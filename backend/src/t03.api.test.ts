import { afterAll, beforeEach, describe, expect, it } from "vitest"
import { randomUUID } from "node:crypto"
import { buildT03TestApp, createSessionFor } from "./testing/test-app.js"
import { makeClubFixture, type ClubFixture } from "./testing/t03-base.js"
import { deriveCsrfToken } from "./shared/crypto.js"

const ORIGIN = "http://localhost:8443"
const CSRF_SECRET = Buffer.alloc(32, 7)

const { app, database, services, runner, config } = await buildT03TestApp()
afterAll(async () => {
  // Keep the shared gei_test database clean for neighbouring API suites.
  await database.db.deleteFrom("infra.outbox_events").execute().catch(() => undefined)
  await app.close()
  await database.close()
})

let fx: ClubFixture

beforeEach(async () => {
  await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
    fx = await makeClubFixture(tx, "api")
  })
})

async function sessionFor(personId: string) {
  return runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
    const session = await createSessionFor(services, tx, personId)
    return { token: session.token, sessionId: session.id, csrf: deriveCsrfToken(CSRF_SECRET, session.id) }
  })
}

function authHeaders(session: { token: string; csrf: string }, withJsonBody = true) {
  const headers: Record<string, string> = { origin: ORIGIN, cookie: `gei_session=${session.token}`, "x-gei-csrf": session.csrf }
  if (withJsonBody) headers["content-type"] = "application/json"
  return headers
}

describe("T03 API — authentication and CSRF", () => {
  it("rejects unauthenticated command requests with 403 SESSION_INVALID", async () => {
    const response = await app.inject({ method: "POST", url: "/api/events", headers: { origin: ORIGIN }, payload: { type: "TRAINING", title: "X", startAt: new Date(Date.now() + 86_400_000 * 7).toISOString() } })
    expect(response.statusCode).toBe(401)
    expect(response.json()).toMatchObject({ error: { code: "SESSION_INVALID" } })
  })

  it("rejects a valid session with missing CSRF header with 403", async () => {
    const session = await sessionFor(fx.coachId)
    const response = await app.inject({ method: "POST", url: "/api/events", headers: { origin: ORIGIN, cookie: `gei_session=${session.token}` }, payload: { type: "TRAINING", title: "X", startAt: new Date(Date.now() + 86_400_000 * 7).toISOString() } })
    expect(response.statusCode).toBe(403)
    expect(response.json()).toMatchObject({ error: { code: "CSRF_INVALID" } })
  })

  it("rejects unauthenticated reads with 403", async () => {
    const response = await app.inject({ method: "GET", url: "/api/events/next", headers: { origin: ORIGIN } })
    expect(response.statusCode).toBe(401)
  })
})

describe("T03 API — command + query round trip", () => {
  async function createTraining() {
    const session = await sessionFor(fx.coachId)
    const startAt = new Date(Date.now() + 86_400_000 * 7).toISOString()
    const created = await app.inject({ method: "POST", url: "/api/events", headers: authHeaders(session), payload: { type: "TRAINING", title: "API training", startAt, timeZone: "Europe/Madrid", targetTeamIds: [fx.teamAId], idempotency_key: `idem-${randomUUID()}` } })
    expect(created.statusCode).toBe(201)
    return { session, eventId: created.json().id as string, startAt }
  }

  it("creating an event with all-null logistics succeeds (frontend sends empty fields)", async () => {
    const session = await sessionFor(fx.coachId)
    const response = await app.inject({
      method: "POST",
      url: "/api/events",
      headers: authHeaders(session),
      payload: {
        type: "TRAINING",
        title: "Logistica nula",
        startAt: new Date(Date.now() + 86_400_000 * 7).toISOString(),
        timeZone: "Europe/Madrid",
        targetTeamIds: [fx.teamAId],
        logistics: { meetingAt: null, departureAt: null, meetingPoint: null, transportNote: null, arrivalInstructions: null },
      },
    })
    expect(response.statusCode, response.body).toBe(201)
    expect(response.json()).toMatchObject({ eventCreated: true, type: "TRAINING" })
  })

  it("CMD-EVT-16 with only null fields is rejected with 422", async () => {
    const session = await sessionFor(fx.coachId)
    const startAt = new Date(Date.now() + 86_400_000 * 7).toISOString()
    const created = await app.inject({ method: "POST", url: "/api/events", headers: authHeaders(session), payload: { type: "TRAINING", title: "Logistica campos", startAt, timeZone: "Europe/Madrid", targetTeamIds: [fx.teamAId] } })
    expect(created.statusCode).toBe(201)
    const response = await app.inject({ method: "PATCH", url: `/api/events/${created.json().id}/logistics`, headers: authHeaders(session), payload: { meetingAt: null, meetingPoint: null, transportNote: null, arrivalInstructions: null } })
    expect(response.statusCode).toBe(422)
    expect(response.json()).toMatchObject({ error: { code: "VALIDATION_FAILED" } })
  })

  it("creates, reads and lists a TRAINING end to end", async () => {
    const { session, eventId, startAt } = await createTraining()
    const detail = await app.inject({ method: "GET", url: `/api/events/${eventId}`, headers: { origin: ORIGIN, cookie: `gei_session=${session.token}` } })
    expect(detail.statusCode).toBe(200)
    expect(detail.json()).toMatchObject({ id: eventId, type: "TRAINING", state: "SCHEDULED", title: "API training", coordinationRevision: 0 })

    const from = new Date(Date.now() + 86_400_000).toISOString()
    const to = new Date(Date.now() + 86_400_000 * 30).toISOString()
    const calendar = await app.inject({ method: "GET", url: `/api/calendar/range?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, headers: { origin: ORIGIN, cookie: `gei_session=${session.token}` } })
    expect(calendar.statusCode).toBe(200)
    expect(calendar.json().items.map((item: any) => item.id)).toContain(eventId)

    const next = await app.inject({ method: "GET", url: "/api/events/next", headers: { origin: ORIGIN, cookie: `gei_session=${session.token}` } })
    expect(next.statusCode).toBe(200)
    expect(next.json().event?.id).toBe(eventId)
  })

  it("idempotent replay of creation does not duplicate the event", async () => {
    const session = await sessionFor(fx.coachId)
    const startAt = new Date(Date.now() + 86_400_000 * 7).toISOString()
    const key = `idem-${randomUUID()}`
    const payload = { type: "TRAINING", title: "Idempotent", startAt, timeZone: "Europe/Madrid", targetTeamIds: [fx.teamAId], idempotency_key: key }
    const first = await app.inject({ method: "POST", url: "/api/events", headers: authHeaders(session), payload })
    const second = await app.inject({ method: "POST", url: "/api/events", headers: authHeaders(session), payload })
    expect(first.statusCode).toBe(201)
    expect(second.statusCode).toBe(201)
    expect(second.json().id).toBe(first.json().id)
  })

  it("rejects COACH creating CLUB_EVENT with 403/422 (authority is SUBCOMMITTEE)", async () => {
    const session = await sessionFor(fx.coachId)
    const response = await app.inject({ method: "POST", url: "/api/events", headers: authHeaders(session), payload: { type: "CLUB_EVENT", title: "Asada", startAt: new Date(Date.now() + 86_400_000 * 7).toISOString(), clubWideTarget: true } })
    expect([403]).toContain(response.statusCode)
    expect(response.json()).toMatchObject({ error: { code: "AUTHORITY_DENIED" } })
  })

  it("allows SUBCOMMITTEE to create a CLUB_EVENT", async () => {
    const session = await sessionFor(fx.subcommitteeId)
    const response = await app.inject({ method: "POST", url: "/api/events", headers: authHeaders(session), payload: { type: "CLUB_EVENT", title: "Asada", startAt: new Date(Date.now() + 86_400_000 * 7).toISOString(), clubWideTarget: true } })
    expect(response.statusCode).toBe(201)
  })

  it("material change via PATCH notifies and reflects in feed; read marks read", async () => {
    const { session, eventId } = await createTraining()
    const patch = await app.inject({ method: "PATCH", url: `/api/events/${eventId}`, headers: authHeaders(session), payload: { startAt: new Date(Date.now() + 86_400_000 * 9).toISOString(), expectedVersion: 1 } })
    expect(patch.statusCode).toBe(200)
    expect(patch.json()).toMatchObject({ coordinationRevision: 1 })

    const playerSession = await sessionFor(fx.playerId)
    const feed = await app.inject({ method: "GET", url: "/api/notifications", headers: { origin: ORIGIN, cookie: `gei_session=${playerSession.token}` } })
    expect(feed.statusCode).toBe(200)
    const items = feed.json().items.filter((item: any) => item.originEventId === eventId)
    expect(items.length).toBeGreaterThan(0)
    const target = items[0]
    expect(target.isUnread).toBe(true)

    const read = await app.inject({ method: "POST", url: `/api/notifications/${target.id}/read`, headers: authHeaders(playerSession, false) })
    expect(read.statusCode).toBe(200)
    expect(read.json()).toMatchObject({ notificationRead: true })

    // non-recipient cannot mark someone else's notification
    const strangerSession = await sessionFor(fx.player2Id)
    const forbidden = await app.inject({ method: "POST", url: `/api/notifications/${target.id}/read`, headers: authHeaders(strangerSession, false) })
    expect(forbidden.statusCode).toBe(403)
    expect(forbidden.json()).toMatchObject({ error: { code: "NOT_RECIPIENT" } })
  })

  it("RC-30 materiality-check distinguishes metadata from material edits", async () => {
    const { session, eventId } = await createTraining()
    const metaOnly = await app.inject({ method: "GET", url: `/api/events/${eventId}/materiality-check?title=Nuevo`, headers: { origin: ORIGIN, cookie: `gei_session=${session.token}` } })
    expect(metaOnly.statusCode).toBe(200)
    expect(metaOnly.json()).toMatchObject({ isMaterial: false, classification: "metadata" })
    const scheduled = await app.inject({ method: "GET", url: `/api/events/${eventId}/materiality-check?startAt=${encodeURIComponent(new Date(Date.now() + 86_400_000 * 10).toISOString())}`, headers: { origin: ORIGIN, cookie: `gei_session=${session.token}` } })
    expect(scheduled.json()).toMatchObject({ isMaterial: true, classification: "schedule" })
  })

  it("RC-14/RC-25 jornadas are listable and creator can read detail", async () => {
    const coach = await sessionFor(fx.coachId)
    const startAt = new Date(Date.now() + 86_400_000 * 10).toISOString()
    const match = await app.inject({ method: "POST", url: "/api/events", headers: authHeaders(coach), payload: { type: "MATCH", title: "Partido", startAt, timeZone: "Europe/Madrid", targetTeamIds: [fx.teamAId], opponent: "Rivales", competitionId: fx.competitionId } })
    expect(match.statusCode).toBe(201)
    const jornada = await app.inject({ method: "POST", url: "/api/jornadas", headers: authHeaders(coach), payload: { name: "Jornada API", seasonId: fx.seasonId, competitionId: fx.competitionId, eventIds: [match.json().id] } })
    expect(jornada.statusCode).toBe(201)
    const list = await app.inject({ method: "GET", url: "/api/jornadas", headers: { origin: ORIGIN, cookie: `gei_session=${coach.token}` } })
    expect(list.statusCode).toBe(200)
    expect(list.json().items.some((item: any) => item.id === jornada.json().id)).toBe(true)
    const detail = await app.inject({ method: "GET", url: `/api/jornadas/${jornada.json().id}`, headers: { origin: ORIGIN, cookie: `gei_session=${coach.token}` } })
    expect(detail.statusCode).toBe(200)
    expect(detail.json().matches).toHaveLength(1)
  })

  it("MATCH with two teams is rejected with 422 INVALID_TARGET (E2E-04)", async () => {
    const session = await sessionFor(fx.coachId)
    const response = await app.inject({ method: "POST", url: "/api/events", headers: authHeaders(session), payload: { type: "MATCH", title: "Partido", startAt: new Date(Date.now() + 86_400_000 * 10).toISOString(), timeZone: "Europe/Madrid", targetTeamIds: [fx.teamAId, fx.teamBId], opponent: "Rivales" } })
    expect(response.statusCode).toBe(422)
    expect(response.json()).toMatchObject({ error: { code: "INVALID_TARGET" } })
  })
})
