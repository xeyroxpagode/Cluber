import { afterAll, beforeEach, describe, expect, it } from "vitest"
import { randomUUID } from "node:crypto"
import { buildT03TestApp, createSessionFor } from "./testing/test-app.js"
import { makeT04Fixture, type T04Fixture } from "./testing/t04-base.js"
import { deriveCsrfToken } from "./shared/crypto.js"
import { ParticipationService } from "./participation/participation.js"

const ORIGIN = "http://localhost:8443"
const CSRF_SECRET = Buffer.alloc(32, 7)

const { app, database, services, runner } = await buildT03TestApp()
afterAll(async () => {
  // Aislamiento: la base de pruebas es compartida entre suites. T04 crea notificaciones
  // (NOT-06 y NOT-01 de cierre) que las aserciones globales de T03 no contemplan.
  await database.db.deleteFrom("infra.outbox_events").execute().catch(() => undefined)
  await database.db.deleteFrom("app.notifications").execute().catch(() => undefined)
  await app.close()
  await database.close()
})

let fx: T04Fixture

beforeEach(async () => {
  await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
    fx = await makeT04Fixture(tx, "api")
  })
})

async function sessionFor(personId: string) {
  return runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
    const session = await createSessionFor(services, tx, personId)
    return { token: session.token, sessionId: session.id, csrf: deriveCsrfToken(CSRF_SECRET, session.id) }
  })
}

function headers(session: { token: string; csrf: string }, withJsonBody = true) {
  const out: Record<string, string> = { origin: ORIGIN, cookie: `gei_session=${session.token}`, "x-gei-csrf": session.csrf }
  if (withJsonBody) out["content-type"] = "application/json"
  return out
}

async function createEvent(session: { token: string; csrf: string }, type: "TRAINING" | "MATCH", title = "Evento T04", teamId = fx.teamAId, daysAhead = 7) {
  const payload: Record<string, unknown> = {
    type,
    title,
    startAt: new Date(Date.now() + 86_400_000 * daysAhead).toISOString(),
    timeZone: "Europe/Madrid",
    targetTeamIds: [teamId],
  }
  if (type === "MATCH") payload.opponent = "Rivales"
  const response = await app.inject({ method: "POST", url: "/api/events", headers: headers(session), payload })
  expect(response.statusCode, response.body).toBe(201)
  return response.json().id as string
}

async function rows<T extends Record<string, unknown>>(table: string, where?: (qb: any) => any): Promise<T[]> {
  return runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
    let query = tx.selectFrom(table as never).selectAll()
    if (where) query = query.where(where as never)
    return query.execute() as never
  }) as Promise<T[]>
}

/* ══════════════════════════════════════════════════════════════════════
   DG-09 — Availability (ST-01..ST-10)
   ══════════════════════════════════════════════════════════════════════ */

describe("T04 API — DG-09 Availability", () => {
  it("ST-01 a player answers YES and the value plus coordination revision are persisted", async () => {
    const coach = await sessionFor(fx.coachId)
    const eventId = await createEvent(coach, "TRAINING")
    const player = await sessionFor(fx.playerId)
    const response = await app.inject({
      method: "POST",
      url: `/api/events/${eventId}/availability`,
      headers: headers(player),
      payload: { value: "YES", observedCoordinationRevision: 0 },
    })
    expect(response.statusCode, response.body).toBe(200)
    expect(response.json()).toMatchObject({ responded: true, value: "YES", coordinationRevision: 0, needsReconfirmation: false })
    const stored = await rows<{ value: string; coordination_revision: number }>("app.availability_responses", (qb) => qb("event_id", "=", eventId))
    expect(stored).toHaveLength(1)
    expect(stored[0].value).toBe("YES")
    expect(stored[0].coordination_revision).toBe(0)
  })

  it("ST-02 a player cannot answer on behalf of another person", async () => {
    const coach = await sessionFor(fx.coachId)
    const eventId = await createEvent(coach, "TRAINING")
    const player = await sessionFor(fx.playerId)
    const other = await sessionFor(fx.player2Id)
    await app.inject({ method: "POST", url: `/api/events/${eventId}/availability`, headers: headers(player), payload: { value: "YES", observedCoordinationRevision: 0 } })
    await app.inject({ method: "POST", url: `/api/events/${eventId}/availability`, headers: headers(other), payload: { value: "NO", observedCoordinationRevision: 0 } })
    const stored = await rows<{ person_id: string; value: string }>("app.availability_responses", (qb) => qb("event_id", "=", eventId))
    expect(stored).toHaveLength(2)
    expect(stored.find((row) => row.person_id === fx.playerId)?.value).toBe("YES")
    expect(stored.find((row) => row.person_id === fx.player2Id)?.value).toBe("NO")
  })

  it("ST-03 a player outside the event audience is denied with NOT_OWN_RESPONSE", async () => {
    const coach = await sessionFor(fx.coachId)
    const eventId = await createEvent(coach, "TRAINING")
    const outsider = await sessionFor(fx.coachBId)
    const response = await app.inject({ method: "POST", url: `/api/events/${eventId}/availability`, headers: headers(outsider), payload: { value: "YES", observedCoordinationRevision: 0 } })
    expect(response.statusCode).toBe(403)
    expect(response.json()).toMatchObject({ error: { code: "NOT_OWN_RESPONSE" } })
  })

  it("ST-04 a postponed event rejects availability with EVENT_NOT_SCHEDULED", async () => {
    const coach = await sessionFor(fx.coachId)
    const eventId = await createEvent(coach, "TRAINING")
    await app.inject({ method: "POST", url: `/api/events/${eventId}/postpone`, headers: headers(coach, false) })
    const player = await sessionFor(fx.playerId)
    const response = await app.inject({ method: "POST", url: `/api/events/${eventId}/availability`, headers: headers(player), payload: { value: "YES", observedCoordinationRevision: 0 } })
    expect(response.statusCode).toBe(409)
    expect(response.json()).toMatchObject({ error: { code: "EVENT_NOT_SCHEDULED" } })
  })

  it("ST-05 a material change derives NEEDS_RECONFIRMATION without losing the previous answer", async () => {
    const coach = await sessionFor(fx.coachId)
    const eventId = await createEvent(coach, "TRAINING")
    const player = await sessionFor(fx.playerId)
    await app.inject({ method: "POST", url: `/api/events/${eventId}/availability`, headers: headers(player), payload: { value: "YES", observedCoordinationRevision: 0 } })
    const material = await app.inject({ method: "PATCH", url: `/api/events/${eventId}`, headers: headers(coach), payload: { startAt: new Date(Date.now() + 86_400_000 * 9).toISOString(), expectedVersion: 1 } })
    expect(material.statusCode).toBe(200)
    const summary = await app.inject({ method: "GET", url: `/api/events/${eventId}/availability/summary`, headers: { origin: ORIGIN, cookie: `gei_session=${coach.token}` } })
    expect(summary.statusCode).toBe(200)
    const item = summary.json().items.find((row: any) => row.personId === fx.playerId)
    expect(item.state).toBe("NEEDS_RECONFIRMATION")
    expect(item.value).toBe("YES")
  })

  it("ST-06 reconfirming MAYBE keeps the first responded_at and snapshots the current revision", async () => {
    const coach = await sessionFor(fx.coachId)
    const eventId = await createEvent(coach, "TRAINING")
    const player = await sessionFor(fx.playerId)
    const first = await app.inject({ method: "POST", url: `/api/events/${eventId}/availability`, headers: headers(player), payload: { value: "YES", observedCoordinationRevision: 0 } })
    await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
      await tx.updateTable("app.events").set({ coordination_revision: 2 }).where("id", "=", eventId).execute()
    })
    const second = await app.inject({ method: "POST", url: `/api/events/${eventId}/availability`, headers: headers(player), payload: { value: "MAYBE", observedCoordinationRevision: 2 } })
    expect(second.statusCode, second.body).toBe(200)
    const stored = await rows<{ value: string; responded_at: Date; coordination_revision: number }>("app.availability_responses", (qb) => qb("event_id", "=", eventId))
    expect(stored[0].value).toBe("MAYBE")
    expect(stored[0].coordination_revision).toBe(2)
    expect(new Date(stored[0].responded_at).toISOString()).toBe(new Date(first.json().respondedAt).toISOString())
  })

  it("ST-07 a player that never answered is derived as NO_RESPONSE", async () => {
    const coach = await sessionFor(fx.coachId)
    const eventId = await createEvent(coach, "TRAINING")
    const summary = await app.inject({ method: "GET", url: `/api/events/${eventId}/availability/summary`, headers: { origin: ORIGIN, cookie: `gei_session=${coach.token}` } })
    expect(summary.statusCode).toBe(200)
    const item = summary.json().items.find((row: any) => row.personId === fx.playerId)
    expect(item.state).toBe("NO_RESPONSE")
    expect(item.value).toBeNull()
    expect(summary.json().counts.NO_RESPONSE).toBeGreaterThan(0)
  })

  it("ST-08 two concurrent answers keep one coherent row", async () => {
    const coach = await sessionFor(fx.coachId)
    const eventId = await createEvent(coach, "TRAINING")
    const player = await sessionFor(fx.playerId)
    const other = await sessionFor(fx.player2Id)
    const results = await Promise.all([
      app.inject({ method: "POST", url: `/api/events/${eventId}/availability`, headers: headers(player), payload: { value: "YES", observedCoordinationRevision: 0 } }),
      app.inject({ method: "POST", url: `/api/events/${eventId}/availability`, headers: headers(other), payload: { value: "NO", observedCoordinationRevision: 0 } }),
    ])
    expect(results.every((result) => result.statusCode === 200)).toBe(true)
    const stored = await rows<{ person_id: string; coordination_revision: number }>("app.availability_responses", (qb) => qb("event_id", "=", eventId))
    expect(stored).toHaveLength(2)
    expect(stored.every((row) => row.coordination_revision === 0)).toBe(true)
  })

  it("ST-09 answering with a stale observed revision is rejected with OPTIMISTIC_LOCK_FAILURE", async () => {
    const coach = await sessionFor(fx.coachId)
    const eventId = await createEvent(coach, "TRAINING")
    await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
      await tx.updateTable("app.events").set({ coordination_revision: 3 }).where("id", "=", eventId).execute()
    })
    const player = await sessionFor(fx.playerId)
    const response = await app.inject({ method: "POST", url: `/api/events/${eventId}/availability`, headers: headers(player), payload: { value: "YES", observedCoordinationRevision: 0 } })
    expect(response.statusCode).toBe(409)
    expect(response.json()).toMatchObject({ error: { code: "OPTIMISTIC_LOCK_FAILURE" } })
    const stored = await rows<{ id: string }>("app.availability_responses", (qb) => qb("event_id", "=", eventId))
    expect(stored).toHaveLength(0)
  })

  it("ST-10 replaying the same answer with the same idempotency key does not duplicate the response", async () => {
    const coach = await sessionFor(fx.coachId)
    const eventId = await createEvent(coach, "TRAINING")
    const player = await sessionFor(fx.playerId)
    const key = `avail-${randomUUID()}`
    const payload = { value: "YES", observedCoordinationRevision: 0, idempotency_key: key }
    const first = await app.inject({ method: "POST", url: `/api/events/${eventId}/availability`, headers: headers(player), payload })
    const second = await app.inject({ method: "POST", url: `/api/events/${eventId}/availability`, headers: headers(player), payload })
    expect(first.statusCode).toBe(200)
    expect(second.statusCode).toBe(200)
    const stored = await rows<{ id: string }>("app.availability_responses", (qb) => qb("event_id", "=", eventId))
    expect(stored).toHaveLength(1)
  })
})

/* ══════════════════════════════════════════════════════════════════════
   DG-10 — Selection (ST-11..ST-22)
   ══════════════════════════════════════════════════════════════════════ */

describe("T04 API — DG-10 Selection", () => {
  async function draft(session: { token: string; csrf: string }, matchId: string, entries: Array<{ personId: string; role: "SELECTED" | "ALTERNATE"; order?: number }>, autosaveVersion: number, key?: string) {
    return app.inject({ method: "PATCH", url: `/api/events/${matchId}/selection/draft`, headers: headers(session), payload: { entries, autosaveVersion, idempotency_key: key ?? `draft-${randomUUID()}` } })
  }

  it("ST-11 the coach of the team prepares a draft convocation", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    const response = await draft(coach, matchId, [{ personId: fx.playerId, role: "SELECTED", order: 1 }], 0)
    expect(response.statusCode, response.body).toBe(200)
    expect(response.json()).toMatchObject({ autosaveVersion: 1 })
    expect(response.json().entries).toHaveLength(1)
  })

  it("ST-12 a coach of another team is denied on the draft", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    const otherCoach = await sessionFor(fx.coachBId)
    const response = await draft(otherCoach, matchId, [{ personId: fx.playerId, role: "SELECTED" }], 0)
    expect(response.statusCode).toBe(403)
    expect(response.json()).toMatchObject({ error: { code: "AUTHORITY_DENIED" } })
  })

  it("ST-13 selection is rejected on a TRAINING", async () => {
    const coach = await sessionFor(fx.coachId)
    const trainingId = await createEvent(coach, "TRAINING")
    const response = await draft(coach, trainingId, [{ personId: fx.playerId, role: "SELECTED" }], 0)
    expect(response.statusCode).toBe(422)
    expect(response.json()).toMatchObject({ error: { code: "INVALID_TARGET" } })
  })

  it("ST-14 a second editor with a stale autosave version is rejected", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    await draft(coach, matchId, [{ personId: fx.playerId, role: "SELECTED" }], 0)
    const stale = await draft(coach, matchId, [{ personId: fx.player2Id, role: "SELECTED" }], 0)
    expect(stale.statusCode).toBe(409)
    expect(stale.json()).toMatchObject({ error: { code: "OPTIMISTIC_LOCK_FAILURE" } })
  })

  it("ST-15 publishing with derived conflicts succeeds and returns the warning", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    await draft(coach, matchId, [{ personId: fx.playerId, role: "SELECTED" }], 0)
    // La persona deja de estar afiliada al equipo destino -> conflicto derivado, no bloqueante.
    await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
      await tx.updateTable("app.team_assignments").set({ valid_until: "2026-02-01" }).where("person_id", "=", fx.playerId).execute()
    })
    const publish = await app.inject({ method: "POST", url: `/api/events/${matchId}/selection/publish`, headers: headers(coach, false), payload: { idempotency_key: `pub-${randomUUID()}` } })
    expect(publish.statusCode, publish.body).toBe(200)
    expect(publish.json().conflicts.some((conflict: any) => conflict.code === "NO_LONGER_TEAM_AFFILIATED")).toBe(true)
  })

  it("ST-16 publishing twice without a new draft is rejected (PUBLISHED is immutable)", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    await draft(coach, matchId, [{ personId: fx.playerId, role: "SELECTED" }], 0)
    const first = await app.inject({ method: "POST", url: `/api/events/${matchId}/selection/publish`, headers: headers(coach, false), payload: { idempotency_key: `pub-${randomUUID()}` } })
    expect(first.statusCode).toBe(200)
    const second = await app.inject({ method: "POST", url: `/api/events/${matchId}/selection/publish`, headers: headers(coach, false), payload: { idempotency_key: `pub-${randomUUID()}` } })
    expect(second.statusCode).toBe(409)
    expect(second.json()).toMatchObject({ error: { code: "DRAFT_INVALID" } })
  })

  it("ST-17 a correction creates a new published revision and preserves the previous one", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    await draft(coach, matchId, [{ personId: fx.playerId, role: "SELECTED" }], 0)
    await app.inject({ method: "POST", url: `/api/events/${matchId}/selection/publish`, headers: headers(coach, false), payload: { idempotency_key: `pub-${randomUUID()}` } })
    const detail = await app.inject({ method: "GET", url: `/api/events/${matchId}/selection`, headers: { origin: ORIGIN, cookie: `gei_session=${coach.token}` } })
    const firstRevisionId = detail.json().publishedRevisions[0].revisionId
    const updated = await draft(coach, matchId, [{ personId: fx.playerId, role: "SELECTED" }, { personId: fx.player2Id, role: "ALTERNATE", order: 2 }], 0)
    expect(updated.statusCode, updated.body).toBe(200)
    const republished = await app.inject({ method: "POST", url: `/api/events/${matchId}/selection/publish`, headers: headers(coach, false), payload: { idempotency_key: `pub-${randomUUID()}` } })
    expect(republished.statusCode, republished.body).toBe(200)
    const after = await app.inject({ method: "GET", url: `/api/events/${matchId}/selection`, headers: { origin: ORIGIN, cookie: `gei_session=${coach.token}` } })
    expect(after.json().publishedRevisions).toHaveLength(2)
    expect(after.json().publishedRevisions[0].revisionId).toBe(firstRevisionId)
    expect(after.json().publishedRevisions[1].entries).toHaveLength(2)
  })

  it("ST-18 retrying the same publication does not duplicate NOT-06", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    await draft(coach, matchId, [{ personId: fx.playerId, role: "SELECTED" }], 0)
    const key = `pub-${randomUUID()}`
    const first = await app.inject({ method: "POST", url: `/api/events/${matchId}/selection/publish`, headers: headers(coach, false), payload: { idempotency_key: key } })
    expect(first.statusCode, first.body).toBe(200)
    const revisionId = first.json().revisionId
    const notesAfterFirst = await rows<{ id: string; dedupe_key: string }>("app.notifications", (qb) => qb("type", "=", "SELECTION_PUBLISHED"))
    const forRevision = notesAfterFirst.filter((note) => note.dedupe_key.includes(revisionId))
    expect(forRevision.length).toBeGreaterThan(0)
    expect(new Set(forRevision.map((note) => note.dedupe_key)).size).toBe(forRevision.length)

    const second = await app.inject({ method: "POST", url: `/api/events/${matchId}/selection/publish`, headers: headers(coach, false), payload: { idempotency_key: key } })
    expect(second.statusCode).toBe(200)
    expect(second.json().revisionId).toBe(revisionId)
    const notesAfterRetry = await rows<{ id: string; dedupe_key: string }>("app.notifications", (qb) => qb("type", "=", "SELECTION_PUBLISHED"))
    expect(notesAfterRetry.filter((note) => note.dedupe_key.includes(revisionId))).toHaveLength(forRevision.length)
    for (const note of forRevision) {
      expect(note.dedupe_key).toContain(revisionId)
      expect(note.dedupe_key.endsWith("|SELECTION_PUBLISHED")).toBe(true)
    }
  })

  it("ST-19 a second legitimate publication creates a distinct notification fact", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    await draft(coach, matchId, [{ personId: fx.playerId, role: "SELECTED" }], 0)
    const first = await app.inject({ method: "POST", url: `/api/events/${matchId}/selection/publish`, headers: headers(coach, false), payload: { idempotency_key: `pub-${randomUUID()}` } })
    await draft(coach, matchId, [{ personId: fx.playerId, role: "SELECTED" }, { personId: fx.player2Id, role: "ALTERNATE", order: 2 }], 0)
    const second = await app.inject({ method: "POST", url: `/api/events/${matchId}/selection/publish`, headers: headers(coach, false), payload: { idempotency_key: `pub-${randomUUID()}` } })
    expect(first.statusCode).toBe(200)
    expect(second.statusCode).toBe(200)
    expect(second.json().revisionId).not.toBe(first.json().revisionId)
    const notes = await rows<{ dedupe_key: string }>("app.notifications", (qb) => qb("type", "=", "SELECTION_PUBLISHED"))
    expect(notes.some((note) => note.dedupe_key.includes(first.json().revisionId))).toBe(true)
    expect(notes.some((note) => note.dedupe_key.includes(second.json().revisionId))).toBe(true)
  })

  it("ST-20 a player only sees its own published status", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    await draft(coach, matchId, [{ personId: fx.playerId, role: "SELECTED" }], 0)
    await app.inject({ method: "POST", url: `/api/events/${matchId}/selection/publish`, headers: headers(coach, false), payload: { idempotency_key: `pub-${randomUUID()}` } })
    const player = await sessionFor(fx.playerId)
    const status = await app.inject({ method: "GET", url: `/api/events/${matchId}/selection/my-status`, headers: { origin: ORIGIN, cookie: `gei_session=${player.token}` } })
    expect(status.statusCode).toBe(200)
    expect(status.json()).toMatchObject({ status: "SELECTED" })
    expect(Object.keys(status.json())).not.toContain("entries")
    const other = await sessionFor(fx.player2Id)
    const otherStatus = await app.inject({ method: "GET", url: `/api/events/${matchId}/selection/my-status`, headers: { origin: ORIGIN, cookie: `gei_session=${other.token}` } })
    expect(otherStatus.json()).toMatchObject({ status: "NOT_SELECTED" })
  })

  it("ST-21 a player cannot read the coach draft", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    await draft(coach, matchId, [{ personId: fx.playerId, role: "SELECTED" }], 0)
    const player = await sessionFor(fx.playerId)
    const detail = await app.inject({ method: "GET", url: `/api/events/${matchId}/selection`, headers: { origin: ORIGIN, cookie: `gei_session=${player.token}` } })
    expect(detail.statusCode).toBe(403)
    expect(detail.json()).toMatchObject({ error: { code: "AUTHORITY_DENIED" } })
  })

  it("ST-22 a failure while writing the notification rolls the publication back", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    await draft(coach, matchId, [{ personId: fx.playerId, role: "SELECTED" }], 0)
    const broken = {
      record: async (): Promise<never> => {
        throw new Error("notification writer unavailable")
      },
      recordForAudience: async (): Promise<never> => {
        throw new Error("notification writer unavailable")
      },
    }
    const service = new ParticipationService(undefined, undefined, broken as never, undefined)
    await expect(runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx, evaluationInstant }) =>
      service.publishSelection(tx, fx.coachId, { matchId }, evaluationInstant),
    )).rejects.toThrow(/notification writer unavailable/)
    const selection = await rows<{ id: string }>("app.selections", (qb) => qb("match_id", "=", matchId))
    const revisions = await rows<{ state: string }>("app.selection_revisions", (qb) => qb("selection_id", "=", selection[0].id))
    expect(revisions.filter((row) => row.state === "PUBLISHED")).toHaveLength(0)
    const notes = await rows<{ id: string }>("app.notifications", (qb) => qb("resource_id", "=", selection[0].id))
    expect(notes).toHaveLength(0)
  })
})

/* ══════════════════════════════════════════════════════════════════════
   DG-11 — Attendance (ST-23..ST-33)
   ══════════════════════════════════════════════════════════════════════ */

describe("T04 API — DG-11 Attendance", () => {
  it("ST-23 the coach marks PRESENT and the value is persisted", async () => {
    const coach = await sessionFor(fx.coachId)
    const eventId = await createEvent(coach, "TRAINING")
    const response = await app.inject({ method: "POST", url: `/api/events/${eventId}/attendance`, headers: headers(coach), payload: { personId: fx.playerId, value: "PRESENT" } })
    expect(response.statusCode, response.body).toBe(200)
    const stored = await rows<{ person_id: string; value: string }>("app.attendance_entries", (qb) => qb("person_id", "=", fx.playerId))
    expect(stored[0].value).toBe("PRESENT")
  })

  it("ST-24 ABSENT is distinct from UNRECORDED", async () => {
    const coach = await sessionFor(fx.coachId)
    const eventId = await createEvent(coach, "TRAINING")
    await app.inject({ method: "POST", url: `/api/events/${eventId}/attendance`, headers: headers(coach), payload: { personId: fx.playerId, value: "ABSENT" } })
    const detail = await app.inject({ method: "GET", url: `/api/events/${eventId}`, headers: { origin: ORIGIN, cookie: `gei_session=${coach.token}` } })
    const attendance = detail.json().participation.attendance
    const marked = attendance.items.find((item: any) => item.personId === fx.playerId)
    const unmarked = attendance.items.find((item: any) => item.personId === fx.player2Id)
    expect(marked.state).toBe("ABSENT")
    expect(unmarked.state).toBe("UNRECORDED")
    expect(attendance.counts.ABSENT).toBe(1)
    expect(attendance.counts.UNRECORDED).toBeGreaterThan(0)
  })

  it("ST-25 attendance for a CLUB_EVENT is rejected", async () => {
    const coach = await sessionFor(fx.coachId)
    const sub = await sessionFor(fx.subcommitteeId)
    const clubEvent = await app.inject({ method: "POST", url: "/api/events", headers: headers(sub), payload: { type: "CLUB_EVENT", title: "Asada", startAt: new Date(Date.now() + 86_400_000 * 300).toISOString(), clubWideTarget: true } })
    expect(clubEvent.statusCode).toBe(201)
    const response = await app.inject({ method: "POST", url: `/api/events/${clubEvent.json().id}/attendance`, headers: headers(sub), payload: { personId: fx.playerId, value: "PRESENT" } })
    expect(response.statusCode).toBe(422)
    expect(response.json()).toMatchObject({ error: { code: "EVENT_TYPE_INVALID" } })
  })

  it("ST-26 closing the sheet persists CLOSED and it cannot be reopened", async () => {
    const coach = await sessionFor(fx.coachId)
    const eventId = await createEvent(coach, "TRAINING")
    const close = await app.inject({ method: "POST", url: `/api/events/${eventId}/attendance/close`, headers: headers(coach, false), payload: {} })
    expect(close.statusCode, close.body).toBe(200)
    const again = await app.inject({ method: "POST", url: `/api/events/${eventId}/attendance/close`, headers: headers(coach, false), payload: {} })
    expect(again.statusCode).toBe(409)
    expect(again.json()).toMatchObject({ error: { code: "SHEET_ALREADY_CLOSED" } })
  })

  it("ST-27 normal marking after CLOSED is rejected", async () => {
    const coach = await sessionFor(fx.coachId)
    const eventId = await createEvent(coach, "TRAINING")
    await app.inject({ method: "POST", url: `/api/events/${eventId}/attendance`, headers: headers(coach), payload: { personId: fx.playerId, value: "PRESENT" } })
    await app.inject({ method: "POST", url: `/api/events/${eventId}/attendance/close`, headers: headers(coach, false), payload: {} })
    const response = await app.inject({ method: "POST", url: `/api/events/${eventId}/attendance`, headers: headers(coach), payload: { personId: fx.playerId, value: "ABSENT" } })
    expect(response.statusCode).toBe(409)
    expect(response.json()).toMatchObject({ error: { code: "SHEET_CLOSED" } })
  })

  it("ST-29 a correction with a reason preserves before and after", async () => {
    const coach = await sessionFor(fx.coachId)
    const eventId = await createEvent(coach, "TRAINING")
    const marked = await app.inject({ method: "POST", url: `/api/events/${eventId}/attendance`, headers: headers(coach), payload: { personId: fx.playerId, value: "PRESENT" } })
    const entryId = marked.json().entryId
    await app.inject({ method: "POST", url: `/api/events/${eventId}/attendance/close`, headers: headers(coach, false), payload: {} })
    const correction = await app.inject({ method: "PATCH", url: `/api/events/${eventId}/attendance/${entryId}/correct`, headers: headers(coach), payload: { value: "JUSTIFIED", correctionReason: "Turno médico" } })
    expect(correction.statusCode, correction.body).toBe(200)
    expect(correction.json()).toMatchObject({ previousValue: "PRESENT", value: "JUSTIFIED" })
    const history = await rows<{ previous_value: string; new_value: string; correction_reason: string }>("app.attendance_corrections", (qb) => qb("entry_id", "=", entryId))
    expect(history).toHaveLength(1)
    expect(history[0]).toMatchObject({ previous_value: "PRESENT", new_value: "JUSTIFIED", correction_reason: "Turno médico" })
  })

  it("ST-30 a correction without a reason is rejected", async () => {
    const coach = await sessionFor(fx.coachId)
    const eventId = await createEvent(coach, "TRAINING")
    const marked = await app.inject({ method: "POST", url: `/api/events/${eventId}/attendance`, headers: headers(coach), payload: { personId: fx.playerId, value: "PRESENT" } })
    const response = await app.inject({ method: "PATCH", url: `/api/events/${eventId}/attendance/${marked.json().entryId}/correct`, headers: headers(coach), payload: { value: "ABSENT", correctionReason: "  " } })
    expect(response.statusCode).toBe(422)
    expect(response.json()).toMatchObject({ error: { code: "VALIDATION_FAILED" } })
  })

  it("ST-31 two concurrent closes produce a single valid close", async () => {
    const coach = await sessionFor(fx.coachId)
    const eventId = await createEvent(coach, "TRAINING")
    const results = await Promise.all([
      app.inject({ method: "POST", url: `/api/events/${eventId}/attendance/close`, headers: headers(coach, false), payload: {} }),
      app.inject({ method: "POST", url: `/api/events/${eventId}/attendance/close`, headers: headers(coach, false), payload: {} }),
    ])
    expect(results.filter((result) => result.statusCode === 200)).toHaveLength(1)
    expect(results.filter((result) => result.statusCode === 409)).toHaveLength(1)
    const sheets = await rows<{ closed_at: Date | null }>("app.attendance_sheets", (qb) => qb("event_id", "=", eventId))
    expect(sheets).toHaveLength(1)
    expect(sheets[0].closed_at).not.toBeNull()
  })

  it("ST-32 repeated corrections keep the full history recoverable", async () => {
    const coach = await sessionFor(fx.coachId)
    const eventId = await createEvent(coach, "TRAINING")
    const marked = await app.inject({ method: "POST", url: `/api/events/${eventId}/attendance`, headers: headers(coach), payload: { personId: fx.playerId, value: "PRESENT" } })
    const entryId = marked.json().entryId
    await app.inject({ method: "POST", url: `/api/events/${eventId}/attendance/close`, headers: headers(coach, false), payload: {} })
    for (const [value, reason] of [["ABSENT", "Error de carga"], ["JUSTIFIED", "Permiso médico"], ["PRESENT", "Verificado"]] as const) {
      const response = await app.inject({ method: "PATCH", url: `/api/events/${eventId}/attendance/${entryId}/correct`, headers: headers(coach), payload: { value, correctionReason: reason } })
      expect(response.statusCode, response.body).toBe(200)
    }
    const history = await rows<{ previous_value: string | null; new_value: string }>("app.attendance_corrections", (qb) => qb("entry_id", "=", entryId))
    expect(history).toHaveLength(3)
    expect(history.map((row) => row.new_value)).toEqual(["ABSENT", "JUSTIFIED", "PRESENT"])
  })

  it("ST-33 a revoked coach role denies the next request", async () => {
    const coach = await sessionFor(fx.coachId)
    const eventId = await createEvent(coach, "TRAINING")
    await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
      await tx.updateTable("app.role_assignments").set({ valid_until: new Date(Date.now() - 1000) }).where("person_id", "=", fx.coachId).execute()
    })
    const response = await app.inject({ method: "POST", url: `/api/events/${eventId}/attendance`, headers: headers(coach), payload: { personId: fx.playerId, value: "PRESENT" } })
    expect(response.statusCode).toBe(403)
    expect(response.json()).toMatchObject({ error: { code: "AUTHORITY_DENIED" } })
  })
})

/* ══════════════════════════════════════════════════════════════════════
   DG-12 — MatchRecord (ST-34..ST-45)
   ══════════════════════════════════════════════════════════════════════ */

describe("T04 API — DG-12 MatchRecord", () => {
  async function startMatch(coach: { token: string; csrf: string }, matchId: string, version = 1) {
    return app.inject({ method: "POST", url: `/api/events/${matchId}/start`, headers: headers(coach), payload: { expectedVersion: version } })
  }

  it("ST-34 the coach registers a DRAFT match record", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    const response = await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record`, headers: headers(coach, false), payload: {} })
    expect(response.statusCode, response.body).toBe(200)
    expect(response.json()).toMatchObject({ state: "DRAFT" })
  })

  it("ST-35 valid player statistics are persisted while the record is a draft", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    const record = await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record`, headers: headers(coach, false), payload: {} })
    const recordId = record.json().matchRecordId
    const stats = await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record/${recordId}/stats`, headers: headers(coach), payload: { personId: fx.playerId, minutesPlayed: 45, goals: 2, assists: 1, yellowCards: 0, redCards: 0, mvp: true } })
    expect(stats.statusCode, stats.body).toBe(200)
    expect(stats.json()).toMatchObject({ goals: 2, assists: 1, mvp: true })
  })

  it("ST-36 a result that is not PLAYED is rejected when statistics exist", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    const record = await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record`, headers: headers(coach, false), payload: {} })
    const recordId = record.json().matchRecordId
    await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record/${recordId}/stats`, headers: headers(coach), payload: { personId: fx.playerId, goals: 1 } })
    await startMatch(coach, matchId)
    const finalize = await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record/finalize`, headers: headers(coach), payload: { resultType: "FORFEIT" } })
    expect(finalize.statusCode).toBe(409)
    expect(finalize.json()).toMatchObject({ error: { code: "STATS_NOT_PLAYED" } })
  })

  it("ST-37 finalizing without a result type is rejected", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record`, headers: headers(coach, false), payload: {} })
    await startMatch(coach, matchId)
    const finalize = await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record/finalize`, headers: headers(coach), payload: {} })
    expect(finalize.statusCode).toBe(400)
  })

  it("ST-38 finalizing a valid result produces FINAL and a COMPLETED event", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record`, headers: headers(coach, false), payload: {} })
    const started = await startMatch(coach, matchId)
    expect(started.statusCode, started.body).toBe(200)
    expect(started.json()).toMatchObject({ state: "IN_PROGRESS" })
    const finalize = await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record/finalize`, headers: headers(coach), payload: { resultType: "PLAYED", homeScore: 3, awayScore: 1, observations: "Buen partido" } })
    expect(finalize.statusCode, finalize.body).toBe(200)
    expect(finalize.json()).toMatchObject({ state: "FINAL", resultType: "PLAYED", eventState: "COMPLETED" })
    const event = await rows<{ state: string }>("app.events", (qb) => qb("id", "=", matchId))
    expect(event[0].state).toBe("COMPLETED")
  })

  it("ST-39 statistics cannot be modified after FINAL", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    const record = await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record`, headers: headers(coach, false), payload: {} })
    const recordId = record.json().matchRecordId
    await startMatch(coach, matchId)
    await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record/finalize`, headers: headers(coach), payload: { resultType: "PLAYED", homeScore: 1, awayScore: 0 } })
    const stats = await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record/${recordId}/stats`, headers: headers(coach), payload: { personId: fx.playerId, goals: 3 } })
    expect(stats.statusCode).toBe(409)
    expect(stats.json()).toMatchObject({ error: { code: "RECORD_NOT_DRAFT" } })
  })

  it("ST-40 correcting a FINAL record keeps it FINAL and preserves before/after", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    const record = await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record`, headers: headers(coach, false), payload: {} })
    const recordId = record.json().matchRecordId
    await startMatch(coach, matchId)
    await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record/finalize`, headers: headers(coach), payload: { resultType: "PLAYED", homeScore: 3, awayScore: 1 } })
    const correction = await app.inject({ method: "PATCH", url: `/api/events/${matchId}/match-record/${recordId}/correct`, headers: headers(coach), payload: { homeScore: 4, awayScore: 1, correctionReason: "Gol mal computado" } })
    expect(correction.statusCode, correction.body).toBe(200)
    expect(correction.json()).toMatchObject({ state: "FINAL", homeScore: 4, previousHomeScore: 3 })
    const history = await rows<{ previous_home_score: number; new_home_score: number; correction_reason: string }>("app.matchrecord_corrections", (qb) => qb("match_record_id", "=", recordId))
    expect(history).toHaveLength(1)
    expect(history[0]).toMatchObject({ previous_home_score: 3, new_home_score: 4, correction_reason: "Gol mal computado" })
  })

  it("ST-40b a cross-terminal correction is denied with INVALID_CORRECTION", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    const record = await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record`, headers: headers(coach, false), payload: {} })
    const recordId = record.json().matchRecordId
    await startMatch(coach, matchId)
    await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record/finalize`, headers: headers(coach), payload: { resultType: "PLAYED", homeScore: 1, awayScore: 0 } })
    const correction = await app.inject({ method: "PATCH", url: `/api/events/${matchId}/match-record/${recordId}/correct`, headers: headers(coach), payload: { resultType: "ABANDONED", correctionReason: "Cambio de resultado" } })
    expect(correction.statusCode).toBe(409)
    expect(correction.json()).toMatchObject({ error: { code: "INVALID_CORRECTION" } })
  })

  it("ST-41 two concurrent finalizations leave a single coherent final state", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record`, headers: headers(coach, false), payload: {} })
    await startMatch(coach, matchId)
    const results = await Promise.all([
      app.inject({ method: "POST", url: `/api/events/${matchId}/match-record/finalize`, headers: headers(coach), payload: { resultType: "PLAYED", homeScore: 2, awayScore: 0 } }),
      app.inject({ method: "POST", url: `/api/events/${matchId}/match-record/finalize`, headers: headers(coach), payload: { resultType: "PLAYED", homeScore: 2, awayScore: 0 } }),
    ])
    expect(results.filter((result) => result.statusCode === 200)).toHaveLength(1)
    const records = await rows<{ state: string; result_type: string }>("app.match_records", (qb) => qb("match_id", "=", matchId))
    expect(records).toHaveLength(1)
    expect(records[0].state).toBe("FINAL")
    const events = await rows<{ state: string }>("app.events", (qb) => qb("id", "=", matchId))
    expect(events[0].state).toBe("COMPLETED")
  })

  it("ST-42 finalizing while the event is still SCHEDULED is rejected", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record`, headers: headers(coach, false), payload: {} })
    const finalize = await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record/finalize`, headers: headers(coach), payload: { resultType: "PLAYED", homeScore: 1, awayScore: 0 } })
    expect(finalize.statusCode).toBe(409)
    expect(finalize.json()).toMatchObject({ error: { code: "INVALID_STATE_TRANSITION" } })
  })

  it("ST-43 an ABANDONED result moves the event to ABANDONED", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record`, headers: headers(coach, false), payload: {} })
    await startMatch(coach, matchId)
    const finalize = await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record/finalize`, headers: headers(coach), payload: { resultType: "ABANDONED", observations: "Se suspendió por lluvia" } })
    expect(finalize.statusCode, finalize.body).toBe(200)
    expect(finalize.json()).toMatchObject({ resultType: "ABANDONED", eventState: "ABANDONED" })
  })

  it("ST-44 a second match record for the same match is rejected", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    const first = await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record`, headers: headers(coach, false), payload: {} })
    expect(first.statusCode).toBe(200)
    const second = await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record`, headers: headers(coach, false), payload: {} })
    expect(second.statusCode).toBe(409)
    expect(second.json()).toMatchObject({ error: { code: "MATCHRECORD_EXISTS" } })
  })
})

/* ══════════════════════════════════════════════════════════════════════
   Autoridad (COR-01) — AC-17 / ST-48 / ST-49
   ══════════════════════════════════════════════════════════════════════ */

describe("T04 API — guards de contrato y semántica corregida", () => {
  it("las mutaciones de participación se rechazan en un evento terminal", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    const trainingId = await createEvent(coach, "TRAINING")
    await app.inject({ method: "POST", url: `/api/events/${matchId}/cancel`, headers: headers(coach, false) })
    await app.inject({ method: "POST", url: `/api/events/${trainingId}/cancel`, headers: headers(coach, false) })

    const draft = await app.inject({ method: "PATCH", url: `/api/events/${matchId}/selection/draft`, headers: headers(coach), payload: { entries: [{ personId: fx.playerId, role: "SELECTED" }], autosaveVersion: 0 } })
    expect(draft.statusCode).toBe(409)
    expect(draft.json()).toMatchObject({ error: { code: "EVENT_TERMINAL" } })

    const attendance = await app.inject({ method: "POST", url: `/api/events/${trainingId}/attendance`, headers: headers(coach), payload: { personId: fx.playerId, value: "PRESENT" } })
    expect(attendance.statusCode).toBe(409)
    expect(attendance.json()).toMatchObject({ error: { code: "EVENT_NOT_SCHEDULED" } })

    const record = await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record`, headers: headers(coach, false), payload: {} })
    expect(record.statusCode).toBe(409)
    expect(record.json()).toMatchObject({ error: { code: "EVENT_TERMINAL" } })
  })

  it("un jugador sin membership activa no puede responder disponibilidad", async () => {
    const coach = await sessionFor(fx.coachId)
    const eventId = await createEvent(coach, "TRAINING")
    await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
      await tx.updateTable("app.memberships").set({ valid_until: new Date(Date.now() - 86_400_000) }).where("person_id", "=", fx.playerId).execute()
    })
    const player = await sessionFor(fx.playerId)
    const response = await app.inject({ method: "POST", url: `/api/events/${eventId}/availability`, headers: headers(player), payload: { value: "YES", observedCoordinationRevision: 0 } })
    expect(response.statusCode).toBe(403)
    expect(response.json()).toMatchObject({ error: { code: "AUTHORITY_DENIED" } })
  })

  it("el roster se evalúa a la fecha del evento, no a la fecha de hoy", async () => {
    const coach = await sessionFor(fx.coachId)
    const eventId = await createEvent(coach, "TRAINING")
    await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
      // El jugador deja de estar afiliado antes de la fecha del evento.
      await tx.updateTable("app.team_assignments").set({ valid_until: "2026-02-01" }).where("person_id", "=", fx.playerId).execute()
    })
    const response = await app.inject({ method: "POST", url: `/api/events/${eventId}/attendance`, headers: headers(coach), payload: { personId: fx.playerId, value: "PRESENT" } })
    expect(response.statusCode).toBe(409)
    expect(response.json()).toMatchObject({ error: { code: "PERSON_NOT_IN_ROSTER" } })
  })

  it("actualizar una estadística no borra las demás", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    const record = await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record`, headers: headers(coach, false), payload: {} })
    const recordId = record.json().matchRecordId
    await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record/${recordId}/stats`, headers: headers(coach), payload: { personId: fx.playerId, goals: 2, assists: 1, minutesPlayed: 45, yellowCards: 1, redCards: 0, mvp: true } })
    const updated = await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record/${recordId}/stats`, headers: headers(coach), payload: { personId: fx.playerId, goals: 3 } })
    expect(updated.statusCode, updated.body).toBe(200)
    const stored = await rows<{ goals: number; assists: number; minutes_played: number; yellow_cards: number; mvp: boolean }>("app.player_match_stats", (qb) => qb("match_record_id", "=", recordId))
    expect(stored).toHaveLength(1)
    expect(stored[0].goals).toBe(3)
    expect(stored[0].assists).toBe(1)
    expect(stored[0].minutes_played).toBe(45)
    expect(stored[0].yellow_cards).toBe(1)
    expect(stored[0].mvp).toBe(true)
  })

  it("el eventId de la URL debe coincidir con el acta", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    const otherMatchId = await createEvent(coach, "MATCH", "Otro partido")
    const record = await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record`, headers: headers(coach, false), payload: {} })
    const recordId = record.json().matchRecordId
    const stats = await app.inject({ method: "POST", url: `/api/events/${otherMatchId}/match-record/${recordId}/stats`, headers: headers(coach), payload: { personId: fx.playerId, goals: 1 } })
    expect(stats.statusCode).toBe(404)
    const correction = await app.inject({ method: "PATCH", url: `/api/events/${otherMatchId}/match-record/${recordId}/correct`, headers: headers(coach), payload: { homeScore: 2, correctionReason: "x" } })
    expect(correction.statusCode).toBe(404)
  })

  it("la proyección de convocatoria exige un MATCH y un rol PLAYER vigente", async () => {
    const coach = await sessionFor(fx.coachId)
    const trainingId = await createEvent(coach, "TRAINING")
    const matchId = await createEvent(coach, "MATCH")
    const player = await sessionFor(fx.playerId)
    const onTraining = await app.inject({ method: "GET", url: `/api/events/${trainingId}/selection/my-status`, headers: { origin: ORIGIN, cookie: `gei_session=${player.token}` } })
    expect(onTraining.statusCode).toBe(422)
    const captain = await sessionFor(fx.captainId)
    const onMatch = await app.inject({ method: "GET", url: `/api/events/${matchId}/selection/my-status`, headers: { origin: ORIGIN, cookie: `gei_session=${captain.token}` } })
    expect(onMatch.statusCode).toBe(403)
  })

  it("RC-17 cuenta sobre la audiencia completa aunque la lista se pagine", async () => {
    const coach = await sessionFor(fx.coachId)
    const eventId = await createEvent(coach, "TRAINING")
    const full = await app.inject({ method: "GET", url: `/api/events/${eventId}/availability/summary`, headers: { origin: ORIGIN, cookie: `gei_session=${coach.token}` } })
    expect(full.statusCode).toBe(200)
    const paged = await app.inject({ method: "GET", url: `/api/events/${eventId}/availability/summary?limit=1`, headers: { origin: ORIGIN, cookie: `gei_session=${coach.token}` } })
    expect(paged.statusCode).toBe(200)
    expect(paged.json().counts).toEqual(full.json().counts)
    expect(paged.json().items.length).toBeLessThanOrEqual(1)
  })
})

describe("T04 API — COR-01 authority boundaries", () => {
  it("a CAPTAIN cannot operate coach-only participation commands", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    const captain = await sessionFor(fx.captainId)
    const draft = await app.inject({ method: "PATCH", url: `/api/events/${matchId}/selection/draft`, headers: headers(captain), payload: { entries: [], autosaveVersion: 0 } })
    expect(draft.statusCode).toBe(403)
    expect(draft.json()).toMatchObject({ error: { code: "AUTHORITY_DENIED" } })
  })

  it("an ADMIN cannot operate coach-only participation commands", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    const admin = await sessionFor(fx.adminId)
    const record = await app.inject({ method: "POST", url: `/api/events/${matchId}/match-record`, headers: headers(admin, false), payload: {} })
    expect(record.statusCode).toBe(403)
  })

  it("a SUBCOMMITTEE cannot operate coach-only participation commands", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    const sub = await sessionFor(fx.subcommitteeId)
    const start = await app.inject({ method: "POST", url: `/api/events/${matchId}/start`, headers: headers(sub), payload: {} })
    expect(start.statusCode).toBe(403)
  })

  it("ST-48 a PLAYER+COACH multi-role actor gets the union of grants", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    const multi = await sessionFor(fx.multiRoleId)
    const draft = await app.inject({ method: "PATCH", url: `/api/events/${matchId}/selection/draft`, headers: headers(multi), payload: { entries: [{ personId: fx.playerId, role: "SELECTED" }], autosaveVersion: 0 } })
    expect(draft.statusCode, draft.body).toBe(200)
  })

  it("a multi-role actor is COACH in one team only and cannot operate in the other", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    const cross = await sessionFor(fx.crossRoleId)
    const draft = await app.inject({ method: "PATCH", url: `/api/events/${matchId}/selection/draft`, headers: headers(cross), payload: { entries: [], autosaveVersion: 0 } })
    expect(draft.statusCode).toBe(200)
    const coachB = await sessionFor(fx.coachBId)
    const matchB = await createEvent(coachB, "MATCH", "Partido equipo B", fx.teamBId)
    const denied = await app.inject({ method: "PATCH", url: `/api/events/${matchB}/selection/draft`, headers: headers(cross), payload: { entries: [], autosaveVersion: 0 } })
    expect(denied.statusCode).toBe(403)
  })

  it("ST-49 revoking the coach role denies the next write", async () => {
    const coach = await sessionFor(fx.coachId)
    const matchId = await createEvent(coach, "MATCH")
    await app.inject({ method: "PATCH", url: `/api/events/${matchId}/selection/draft`, headers: headers(coach), payload: { entries: [], autosaveVersion: 0 } })
    await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
      await tx.updateTable("app.role_assignments").set({ valid_until: new Date(Date.now() - 1000) }).where("person_id", "=", fx.coachId).execute()
    })
    const denied = await app.inject({ method: "PATCH", url: `/api/events/${matchId}/selection/draft`, headers: headers(coach), payload: { entries: [], autosaveVersion: 0 } })
    expect(denied.statusCode).toBe(403)
  })
})
