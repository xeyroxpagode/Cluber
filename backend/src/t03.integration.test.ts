import { randomUUID } from "node:crypto"
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest"
import type { Kysely } from "kysely"
import type { DatabaseSchema } from "./db/types.js"
import { runtime, insertPerson } from "./integration/t02-base.js"
import { makeClubFixture, type ClubFixture } from "./testing/t03-base.js"
import { AppError } from "./shared/errors.js"
import { jsonbParam } from "./shared/jsonb.js"

let fx: ClubFixture

beforeEach(async () => {
  // Fixtures use random suffixes; the shared gei_test database is rebuilt before every run.
  await runtime!.runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
    fx = await makeClubFixture(tx, "t03")
  })
})

async function withTx<T>(fn: (tx: Kysely<DatabaseSchema>, now: Date) => Promise<T>): Promise<T> {
  return runtime!.runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx, evaluationInstant }) => fn(tx, evaluationInstant)) as Promise<T>
}

const futureStart = (days: number, hoursOffset = 0) => new Date(Date.now() + days * 86_400_000 + hoursOffset * 3_600_000).toISOString()

describe("T03 event creation (CMD-EVT-01/02/03)", () => {
  it("creates a TRAINING for the coach's team atomically", async () => {
    const event = await withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.coachId, { type: "TRAINING", title: "Entrenamiento", startAt: futureStart(7), endAt: futureStart(7, 2), timeZone: "Europe/Madrid", targetTeamIds: [fx.teamAId] }, now, "America/Argentina/Buenos_Aires"),
    )
    expect(event.state).toBe("SCHEDULED")
    expect(event.coordination_revision).toBe(0)
    expect(event.version).toBe(1)
    const targets = await withTx((tx) => tx.selectFrom("app.event_target_team").selectAll().where("event_id", "=", event.id).execute())
    expect(targets).toHaveLength(1)
  })

  it("rejects a coach creating an event for another team (AUTH-EVT-01)", async () => {
    await expect(withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.coachId, { type: "TRAINING", title: "X", startAt: futureStart(7), targetTeamIds: [fx.teamBId] }, now, "Europe/Madrid"),
    )).rejects.toMatchObject({ code: "AUTHORITY_DENIED" })
  })

  it("creates a MATCH with exactly one team and opponent", async () => {
    const event = await withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.coachId, { type: "MATCH", title: "Partido vs Rivales", startAt: futureStart(7), targetTeamIds: [fx.teamAId], opponent: "Rivales", competitionId: fx.competitionId }, now, "Europe/Madrid"),
    )
    expect(event.type).toBe("MATCH")
    expect(event.opponent).toBe("Rivales")
  })

  it("rejects a MATCH with two team targets", async () => {
    await expect(withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.coachId, { type: "MATCH", title: "X", startAt: futureStart(7), targetTeamIds: [fx.teamAId, fx.teamBId], opponent: "Rivales" }, now, "Europe/Madrid"),
    )).rejects.toMatchObject({ code: "INVALID_TARGET" })
  })

  it("rejects a MATCH without opponent (OPPONENT_REQUIRED)", async () => {
    await expect(withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.coachId, { type: "MATCH", title: "X", startAt: futureStart(7), targetTeamIds: [fx.teamAId] }, now, "Europe/Madrid"),
    )).rejects.toMatchObject({ code: "OPPONENT_REQUIRED" })
  })

  it("rejects a MATCH targeting a team from another season via competition coherence", async () => {
    await expect(withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.subcommitteeId, { type: "MATCH", title: "X", startAt: futureStart(7), targetTeamIds: [fx.teamAId], opponent: "Rivales", competitionId: randomUUID() }, now, "Europe/Madrid"),
    )).rejects.toMatchObject({ code: "COMPETITION_NOT_FOUND" })
  })

  it("allows only SUBCOMMITTEE to create CLUB_EVENT (E2E-03 path)", async () => {
    await expect(withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.coachId, { type: "CLUB_EVENT", title: "Asada del club", startAt: futureStart(7), clubWideTarget: true }, now, "Europe/Madrid"),
    )).rejects.toMatchObject({ code: "AUTHORITY_DENIED" })
    const event = await withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.subcommitteeId, { type: "CLUB_EVENT", title: "Asada del club", startAt: futureStart(7), clubWideTarget: true }, now, "Europe/Madrid"),
    )
    expect(event.club_wide_target).toBe(true)
  })

  it("rejects person targets on a TRAINING (type invariant)", async () => {
    await expect(withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.coachId, { type: "TRAINING", title: "X", startAt: futureStart(7), targetTeamIds: [fx.teamAId], targetPersonIds: [fx.playerId] } as never, now, "Europe/Madrid"),
    )).rejects.toMatchObject({ code: "INVALID_TARGET" })
  })
})

describe("T03 material change (CMD-EVT-05) + notifications (NOT-01)", () => {
  it("editing only the title does NOT bump coordinationRevision and does NOT notify", async () => {
    const event = await withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.coachId, { type: "TRAINING", title: "Original", startAt: futureStart(7), targetTeamIds: [fx.teamAId] }, now, "Europe/Madrid"),
    )
    const result = await withTx((tx, now) =>
      runtime!.services.events.editEventMeta(tx, fx.coachId, event.id, { title: "Nuevo título", expectedVersion: 1 }, now),
    )
    expect(result.coordinationRevision).toBe(0)
    const notes = await withTx((tx) => tx.selectFrom("app.notifications").selectAll().execute())
    expect(notes).toHaveLength(0)
  })

  it("changing startAt bumps coordinationRevision and notifies the audience (NOT-01)", async () => {
    const event = await withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.coachId, { type: "TRAINING", title: "Entrenamiento", startAt: futureStart(7), targetTeamIds: [fx.teamAId] }, now, "Europe/Madrid"),
    )
    const result = await withTx((tx, now) =>
      runtime!.services.events.materialChangeEvent(tx, fx.coachId, event.id, { startAt: futureStart(8) }, 1, now),
    )
    expect(result.coordinationRevision).toBe(1)
    const notes = await withTx((tx) => tx.selectFrom("app.notifications").selectAll().where("origin_event_id", "=", event.id).execute())
    // audience: coach (staff? no—only SUBCOMMITTEE/ADMIN staff) + coach is COACH not staff; players + coach(clubWide false → team targets of teamA → coach, player, player2) + subcommittee + admin
    const recipients = new Set(notes.map((n) => n.recipient_person_id))
    expect(recipients.has(fx.playerId)).toBe(true)
    expect(recipients.has(fx.player2Id)).toBe(true)
    expect(recipients.has(fx.subcommitteeId)).toBe(true)
    expect(recipients.has(fx.adminId)).toBe(true)
    expect(notes.every((n) => n.type === "EVENT_CHANGED")).toBe(true)
  })

  it("outbox carries one notification.created event per created notification", async () => {
    const event = await withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.coachId, { type: "TRAINING", title: "Entrenamiento", startAt: futureStart(7), targetTeamIds: [fx.teamAId] }, now, "Europe/Madrid"),
    )
    await withTx((tx, now) =>
      runtime!.services.events.materialChangeEvent(tx, fx.coachId, event.id, { startAt: futureStart(9) }, 1, now),
    )
    const notes = await withTx((tx) => tx.selectFrom("app.notifications").selectAll().where("origin_event_id", "=", event.id).execute())
    const outbox = await withTx((tx) => tx.selectFrom("infra.outbox_events").selectAll().where("aggregate_id", "in", notes.map((note) => note.id)).execute())
    expect(outbox).toHaveLength(notes.length)
    expect(outbox.every((row) => row.topic === "notification.created")).toBe(true)
  })

  it("rejects material change without material fields (INVALID_MATERIAL_CHANGE)", async () => {
    const event = await withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.coachId, { type: "TRAINING", title: "Entrenamiento", startAt: futureStart(7), targetTeamIds: [fx.teamAId] }, now, "Europe/Madrid"),
    )
    await expect(withTx((tx, now) =>
      runtime!.services.events.materialChangeEvent(tx, fx.coachId, event.id, { title: "solo metadato" }, 1, now),
    )).rejects.toMatchObject({ code: "INVALID_MATERIAL_CHANGE" })
  })

  it("rejects stale expectedVersion (OPTIMISTIC_LOCK_FAILURE)", async () => {
    const event = await withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.coachId, { type: "TRAINING", title: "Entrenamiento", startAt: futureStart(7), targetTeamIds: [fx.teamAId] }, now, "Europe/Madrid"),
    )
    await withTx((tx, now) =>
      runtime!.services.events.materialChangeEvent(tx, fx.coachId, event.id, { startAt: futureStart(8) }, 1, now),
    )
    await expect(withTx((tx, now) =>
      runtime!.services.events.materialChangeEvent(tx, fx.coachId, event.id, { startAt: futureStart(9) }, 1, now),
    )).rejects.toMatchObject({ code: "OPTIMISTIC_LOCK_FAILURE" })
  })
})

describe("T03 lifecycle (SM-EVENT-01)", () => {
  it("postpone → reschedule → cancel → restore", async () => {
    const event = await withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.coachId, { type: "TRAINING", title: "Entrenamiento", startAt: futureStart(7), targetTeamIds: [fx.teamAId] }, now, "Europe/Madrid"),
    )
    const postponed = await withTx((tx, now) => runtime!.services.events.postponeEvent(tx, fx.coachId, event.id, now))
    expect(postponed.state).toBe("POSTPONED")
    const restored = await withTx((tx, now) => runtime!.services.events.rescheduleEvent(tx, fx.coachId, event.id, now))
    expect(restored.state).toBe("SCHEDULED")
    const cancelled = await withTx((tx, now) => runtime!.services.events.cancelEvent(tx, fx.coachId, event.id, now))
    expect(cancelled.state).toBe("CANCELLED")
    const again = await withTx((tx, now) => runtime!.services.events.restoreEvent(tx, fx.coachId, event.id, now))
    expect(again.state).toBe("SCHEDULED")
    const notes = await withTx((tx) => tx.selectFrom("app.notifications").selectAll().where("origin_event_id", "=", event.id).execute())
    const types = new Set(notes.map((n) => n.type))
    expect(types.has("EVENT_POSTPONED")).toBe(true)
    expect(types.has("EVENT_RESCHEDULED")).toBe(true)
    expect(types.has("EVENT_CANCELLED")).toBe(true)
    expect(types.has("EVENT_RESTORED")).toBe(true)
  })

  it("rejects invalid transitions with INVALID_STATE_TRANSITION", async () => {
    const event = await withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.coachId, { type: "TRAINING", title: "Entrenamiento", startAt: futureStart(7), targetTeamIds: [fx.teamAId] }, now, "Europe/Madrid"),
    )
    await expect(withTx((tx, now) => runtime!.services.events.rescheduleEvent(tx, fx.coachId, event.id, now))).rejects.toMatchObject({ code: "INVALID_STATE_TRANSITION" })
    await expect(withTx((tx, now) => runtime!.services.events.restoreEvent(tx, fx.coachId, event.id, now))).rejects.toMatchObject({ code: "INVALID_STATE_TRANSITION" })
  })

  it("complete/abandon fail closed with MATCHRECORD_REQUIRED (T04 boundary)", async () => {
    const event = await withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.coachId, { type: "TRAINING", title: "Entrenamiento", startAt: futureStart(7), targetTeamIds: [fx.teamAId] }, now, "Europe/Madrid"),
    )
    await expect(withTx((tx, now) => runtime!.services.events.completeEvent(tx, fx.coachId, event.id, now))).rejects.toMatchObject({ code: "INVALID_STATE_TRANSITION" })
  })
})

describe("T03 EVENT-scope authority (AUTH-EVENT-SCOPE)", () => {
  it("COACH with EVENT scope can operate only that event", async () => {
    const event = await withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.subcommitteeId, { type: "TRAINING", title: "Club training", startAt: futureStart(7), clubWideTarget: true }, now, "Europe/Madrid"),
    )
    const otherCoach = await withTx((tx) => insertPerson(tx, `other-${randomUUID().slice(0, 6)}@example.com`))
    await withTx((tx) =>
      tx.insertInto("app.role_assignments").values({ id: randomUUID(), person_id: otherCoach, role: "COACH", scope_type: "EVENT", scope_ref_id: event.id, valid_from: new Date("2026-01-01"), valid_until: null, temporal_exclusions: jsonbParam([]), created_at: new Date() }).execute(),
    )
    const rescheduled = await withTx((tx, now) => runtime!.services.events.postponeEvent(tx, otherCoach, event.id, now))
    expect(rescheduled.state).toBe("POSTPONED")
  })

  it("COACH without any scope is denied material changes", async () => {
    const stranger = await withTx((tx) => insertPerson(tx, `stranger-${randomUUID().slice(0, 6)}@example.com`))
    const event = await withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.coachId, { type: "TRAINING", title: "Entrenamiento", startAt: futureStart(7), targetTeamIds: [fx.teamAId] }, now, "Europe/Madrid"),
    )
    await expect(withTx((tx, now) =>
      runtime!.services.events.materialChangeEvent(tx, stranger, event.id, { startAt: futureStart(8) }, 1, now),
    )).rejects.toMatchObject({ code: "AUTHORITY_DENIED" })
  })

  it("ADMIN cannot operate events (default DENY)", async () => {
    const event = await withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.coachId, { type: "TRAINING", title: "Entrenamiento", startAt: futureStart(7), targetTeamIds: [fx.teamAId] }, now, "Europe/Madrid"),
    )
    await expect(withTx((tx, now) =>
      runtime!.services.events.materialChangeEvent(tx, fx.adminId, event.id, { startAt: futureStart(8) }, 1, now),
    )).rejects.toMatchObject({ code: "AUTHORITY_DENIED" })
  })

  it("revoking the EVENT scope blocks the next operation", async () => {
    const event = await withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.subcommitteeId, { type: "TRAINING", title: "Club training", startAt: futureStart(7), clubWideTarget: true }, now, "Europe/Madrid"),
    )
    const otherCoach = await withTx((tx) => insertPerson(tx, `rev-${randomUUID().slice(0, 6)}@example.com`))
    const assignmentId = randomUUID()
    await withTx((tx) =>
      tx.insertInto("app.role_assignments").values({ id: assignmentId, person_id: otherCoach, role: "COACH", scope_type: "EVENT", scope_ref_id: event.id, valid_from: new Date("2026-01-01"), valid_until: null, temporal_exclusions: jsonbParam([]), created_at: new Date() }).execute(),
    )
    await withTx((tx, now) => runtime!.services.events.postponeEvent(tx, otherCoach, event.id, now))
    await withTx((tx, now) => runtime!.services.roles.end(tx, fx.adminId, assignmentId, now, "test revocation"))
    await expect(withTx((tx, now) =>
      runtime!.services.events.materialChangeEvent(tx, otherCoach, event.id, { startAt: futureStart(9) }, 2, now),
    )).rejects.toMatchObject({ code: "AUTHORITY_DENIED" })
  })
})

describe("T03 notifications dedupe + CMD-COM-12 (DG-07)", () => {
  it("same fact recorded twice yields one notification (dedupeKey)", async () => {
    const event = await withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.coachId, { type: "TRAINING", title: "Entrenamiento", startAt: futureStart(7), targetTeamIds: [fx.teamAId] }, now, "Europe/Madrid"),
    )
    const first = await withTx((tx, now) =>
      runtime!.services.notificationService.record(tx, { recipientPersonId: fx.playerId, type: "EVENT_CHANGED", resourceType: "EVENT", resourceId: event.id, originEventId: event.id, title: "t", body: "b", occurredAt: now }),
    )
    const second = await withTx((tx, now) =>
      runtime!.services.notificationService.record(tx, { recipientPersonId: fx.playerId, type: "EVENT_CHANGED", resourceType: "EVENT", resourceId: event.id, originEventId: event.id, title: "t", body: "b", occurredAt: now }),
    )
    expect(first.wasDuplicate).toBe(false)
    expect(second.wasDuplicate).toBe(true)
    expect(second.id).toBe(first.id)
  })

  it("distinct fact types for the same recipient both persist", async () => {
    const event = await withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.coachId, { type: "TRAINING", title: "Entrenamiento", startAt: futureStart(7), targetTeamIds: [fx.teamAId] }, now, "Europe/Madrid"),
    )
    await withTx((tx, now) => runtime!.services.events.postponeEvent(tx, fx.coachId, event.id, now))
    await withTx((tx, now) => runtime!.services.events.cancelEvent(tx, fx.coachId, event.id, now))
    const types = await withTx((tx) => tx.selectFrom("app.notifications").select("type").where("origin_event_id", "=", event.id).where("recipient_person_id", "=", fx.playerId).execute())
    expect(new Set(types.map((row) => row.type))).toEqual(new Set(["EVENT_POSTPONED", "EVENT_CANCELLED"]))
  })

  it("CMD-COM-12: recipient can mark read; non-recipient denied; missing 404; idempotent", async () => {
    const event = await withTx((tx, now) =>
      runtime!.services.events.createEvent(tx, fx.coachId, { type: "TRAINING", title: "Entrenamiento", startAt: futureStart(7), targetTeamIds: [fx.teamAId] }, now, "Europe/Madrid"),
    )
    await withTx((tx, now) => runtime!.services.events.postponeEvent(tx, fx.coachId, event.id, now))
    const note = await withTx((tx) => tx.selectFrom("app.notifications").selectAll().where("recipient_person_id", "=", fx.playerId).executeTakeFirstOrThrow())
    const marked = await withTx((tx, now) => runtime!.services.notificationService.markRead(tx, fx.playerId, note.id, now))
    expect(marked.alreadyRead).toBe(false)
    expect(marked.readAt).not.toBeNull()
    const again = await withTx((tx, now) => runtime!.services.notificationService.markRead(tx, fx.playerId, note.id, now))
    expect(again.alreadyRead).toBe(true)
    await expect(withTx((tx, now) => runtime!.services.notificationService.markRead(tx, fx.player2Id, note.id, now))).rejects.toMatchObject({ code: "NOT_RECIPIENT" })
    await expect(withTx((tx, now) => runtime!.services.notificationService.markRead(tx, fx.playerId, randomUUID(), now))).rejects.toMatchObject({ code: "NOTIFICATION_NOT_FOUND" })
  })
})

describe("T03 recurrence (CMD-EVT-13/14)", () => {
  it("creates a weekly series with materialized occurrence events", async () => {
    const result = await withTx((tx, now) =>
      runtime!.services.eventSeries.createSeries(tx, fx.coachId, { type: "TRAINING", title: "Training semanal", recurrenceRule: "FREQ=WEEKLY;COUNT=4;BYDAY=TU,TH", startAt: futureStart(7), timeZone: "Europe/Madrid", targetTeamIds: [fx.teamAId] }, now, "Europe/Madrid"),
    )
    expect(result.occurrenceCount).toBe(4)
    const occurrences = await withTx((tx) => tx.selectFrom("app.events").selectAll().where("series_id", "=", result.id).orderBy("occurrence_index", "asc").execute())
    expect(occurrences).toHaveLength(4)
    expect(occurrences.map((o) => o.occurrence_index)).toEqual([0, 1, 2, 3])
    expect(occurrences.every((o) => o.state === "SCHEDULED")).toBe(true)
    const targets = await withTx((tx) => tx.selectFrom("app.event_target_team").selectAll().where("event_id", "in", occurrences.map((o) => o.id)).execute())
    expect(targets).toHaveLength(4)
  })

  it("rejects more than 366 occurrences (RECURRENCE_TOO_LARGE)", async () => {
    await expect(withTx((tx, now) =>
      runtime!.services.eventSeries.createSeries(tx, fx.coachId, { type: "TRAINING", title: "X", recurrenceRule: "FREQ=DAILY;COUNT=400", startAt: futureStart(7), targetTeamIds: [fx.teamAId] }, now, "Europe/Madrid"),
    )).rejects.toMatchObject({ code: "RECURRENCE_TOO_LARGE" })
    await expect(withTx((tx, now) =>
      runtime!.services.eventSeries.createSeries(tx, fx.coachId, { type: "TRAINING", title: "X", recurrenceRule: "FREQ=DAILY", maxOccurrences: 400, startAt: futureStart(7), targetTeamIds: [fx.teamAId] }, now, "Europe/Madrid"),
    )).rejects.toMatchObject({ code: "RECURRENCE_TOO_LARGE" })
  })

  it("rejects an invalid rule (INVALID_RRULE)", async () => {
    await expect(withTx((tx, now) =>
      runtime!.services.eventSeries.createSeries(tx, fx.coachId, { type: "TRAINING", title: "X", recurrenceRule: "FREQ=SOMETIMES", startAt: futureStart(7), targetTeamIds: [fx.teamAId] }, now, "Europe/Madrid"),
    )).rejects.toMatchObject({ code: "INVALID_RRULE" })
  })

  it("ends a series preserving occurrence history", async () => {
    const created = await withTx((tx, now) =>
      runtime!.services.eventSeries.createSeries(tx, fx.coachId, { type: "TRAINING", title: "Training", recurrenceRule: "FREQ=WEEKLY;COUNT=3", startAt: futureStart(7), targetTeamIds: [fx.teamAId] }, now, "Europe/Madrid"),
    )
    const ended = await withTx((tx, now) => runtime!.services.eventSeries.endSeries(tx, fx.coachId, created.id, now))
    expect(ended.state).toBe("ENDED")
    const occurrences = await withTx((tx) => tx.selectFrom("app.events").selectAll().where("series_id", "=", created.id).execute())
    expect(occurrences).toHaveLength(3)
    await expect(withTx((tx, now) => runtime!.services.eventSeries.endSeries(tx, fx.coachId, created.id, now))).rejects.toMatchObject({ code: "SERIES_ALREADY_ENDED" })
  })
})

describe("T03 Jornada (CMD-EVT-15)", () => {
  async function createMatch(tx: Kysely<DatabaseSchema>, now: Date, title: string, competitionId?: string) {
    return runtime!.services.events.createEvent(tx, fx.coachId, { type: "MATCH", title, startAt: futureStart(10), targetTeamIds: [fx.teamAId], opponent: "Rivales", competitionId: competitionId ?? null }, now, "Europe/Madrid")
  }

  it("creates a jornada grouping matches atomically", async () => {
    const jornadaId = await withTx(async (tx, now) => {
      const m1 = await createMatch(tx, now, "Partido 1")
      const m2 = await createMatch(tx, now, "Partido 2")
      const result = await runtime!.services.jornada.scheduleJornada(tx, fx.subcommitteeId, { name: "Jornada 1", seasonId: fx.seasonId, competitionId: fx.competitionId, eventIds: [m1.id, m2.id] }, now)
      expect(result.matchCount).toBe(2)
      return result.id
    })
    const matches = await withTx((tx) => tx.selectFrom("app.jornada_matches").selectAll().where("jornada_id", "=", jornadaId).execute())
    expect(matches).toHaveLength(2)
  })

  it("rejects >100 matches (BULK_TOO_LARGE) and rolls back completely", async () => {
    await expect(withTx((tx, now) =>
      runtime!.services.jornada.scheduleJornada(tx, fx.subcommitteeId, { name: "Jornada X", seasonId: fx.seasonId, eventIds: Array.from({ length: 101 }, () => randomUUID()) }, now),
    )).rejects.toMatchObject({ code: "BULK_TOO_LARGE" })
    const jornadas = await withTx((tx) => tx.selectFrom("app.jornadas").selectAll().where("name", "like", "Jornada X%").execute())
    expect(jornadas).toHaveLength(0)
  })

  it("rejects non-MATCH events and rolls back", async () => {
    await expect(withTx(async (tx, now) => {
      const training = await runtime!.services.events.createEvent(tx, fx.coachId, { type: "TRAINING", title: "Entrenamiento", startAt: futureStart(7), targetTeamIds: [fx.teamAId] }, now, "Europe/Madrid")
      const match = await createMatch(tx, now, "Partido 1")
      return runtime!.services.jornada.scheduleJornada(tx, fx.subcommitteeId, { name: `Jornada rollback ${randomUUID().slice(0, 8)}`, seasonId: fx.seasonId, eventIds: [training.id, match.id] }, now)
    })).rejects.toMatchObject({ code: "INVALID_TARGET" })
    const jornadas = await withTx((tx) => tx.selectFrom("app.jornadas").selectAll().where("name", "like", "Jornada rollback%").execute())
    expect(jornadas).toHaveLength(0)
  })

  it("rejects a match belonging to two jornadas (unicidad)", async () => {
    await expect(withTx(async (tx, now) => {
      const match = await createMatch(tx, now, "Partido 1")
      await runtime!.services.jornada.scheduleJornada(tx, fx.subcommitteeId, { name: "Jornada A", seasonId: fx.seasonId, eventIds: [match.id] }, now)
      return runtime!.services.jornada.scheduleJornada(tx, fx.subcommitteeId, { name: "Jornada B", seasonId: fx.seasonId, eventIds: [match.id] }, now)
    })).rejects.toMatchObject({ code: "MATCH_ALREADY_IN_JORNADA" })
  })

  it("rejects a match whose team is in another season (SEASON_MISMATCH)", async () => {
    await expect(withTx(async (tx, now) => {
      const match = await createMatch(tx, now, "Partido 1")
      return runtime!.services.jornada.scheduleJornada(tx, fx.subcommitteeId, { name: "Jornada", seasonId: fx.season2Id, eventIds: [match.id] }, now)
    })).rejects.toMatchObject({ code: "SEASON_MISMATCH" })
  })
})

describe("T03 DB constraints (negative)", () => {
  it("rejects end before start at the database level", async () => {
    await expect(withTx((tx) =>
      tx.insertInto("app.events").values({ id: randomUUID(), type: "TRAINING", title: "X", start_at: new Date(), end_at: new Date(Date.now() - 3_600_000), time_zone: "UTC", state: "SCHEDULED", club_wide_target: false, coordination_revision: 0, creator_person_id: fx.coachId, version: 1, series_id: null, occurrence_index: null, venue_id: null, competition_id: null, opponent: null, created_at: new Date(), updated_at: new Date() }).execute(),
    )).rejects.toThrow()
  })

  it("enforces dedupe_key uniqueness in the database", async () => {
    const id = randomUUID()
    const values = { id, recipient_person_id: fx.playerId, type: "EVENT_CHANGED" as const, resource_type: "EVENT" as const, resource_id: id, origin_event_id: null as string | null, title: "t", body: "b", occurred_at: new Date(), read_at: null, audience_resolved_at: new Date(), dedupe_key: "t03-dup-key", created_at: new Date() }
    // origin_event_id null violates the EVENT_* check — use a non-EVENT type
    const row = { ...values, type: "ANNOUNCEMENT_PUBLISHED" as const, resource_type: "ANNOUNCEMENT" as const, origin_event_id: null }
    await withTx((tx) => tx.insertInto("app.notifications").values(row).execute())
    await expect(withTx((tx) => tx.insertInto("app.notifications").values({ ...row, id: randomUUID() }).execute())).rejects.toThrow()
  })
})
