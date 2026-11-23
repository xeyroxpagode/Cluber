import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { randomUUID } from "node:crypto"
import { buildT06TestApp } from "./testing/t06-test-app.js"
import { createSessionFor } from "./testing/test-app.js"
import { makeT04Fixture, type T04Fixture } from "./testing/t04-base.js"
import { deriveCsrfToken } from "./shared/crypto.js"

const ORIGIN = "http://localhost:8443"
const CSRF_SECRET = Buffer.alloc(32, 7)
const { app, database, services, runner } = await buildT06TestApp()

type Session = { token: string; sessionId: string; csrf: string }
const sessions = new Map<string, Session>()
let fx: T04Fixture
let eventId: string
let playedEventId: string
let noStatsEventId: string

afterAll(async () => {
  await app.close()
  await database.close()
})

beforeAll(async () => {
  await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
    fx = await makeT04Fixture(tx, "t06api")
    const now = new Date()
    eventId = randomUUID()
    playedEventId = randomUUID()
    const draftEventId = randomUUID()
    const forfeitEventId = randomUUID()
    await tx.insertInto("app.events").values([
      {
        id: eventId, type: "TRAINING", title: "Entrenamiento T06", start_at: new Date("2026-06-15T15:00:00Z"),
        end_at: new Date("2026-06-15T16:00:00Z"), time_zone: "America/Argentina/Buenos_Aires", venue_id: null,
        state: "SCHEDULED", club_wide_target: false, series_id: null, occurrence_index: null,
        coordination_revision: 3, creator_person_id: fx.coachId, created_at: now, updated_at: now, version: 1,
        competition_id: null, opponent: null,
      },
      {
        id: playedEventId, type: "MATCH", title: "Partido T06", start_at: new Date("2026-06-20T15:00:00Z"),
        end_at: new Date("2026-06-20T17:00:00Z"), time_zone: "America/Argentina/Buenos_Aires", venue_id: null,
        state: "COMPLETED", club_wide_target: false, series_id: null, occurrence_index: null,
        coordination_revision: 1, creator_person_id: fx.coachId, created_at: now, updated_at: now, version: 1,
        competition_id: fx.competitionId, opponent: "Rival",
      },
      {
        id: draftEventId, type: "MATCH", title: "Partido DRAFT T06", start_at: new Date("2026-06-21T15:00:00Z"),
        end_at: null, time_zone: "America/Argentina/Buenos_Aires", venue_id: null,
        state: "SCHEDULED", club_wide_target: false, series_id: null, occurrence_index: null,
        coordination_revision: 1, creator_person_id: fx.coachId, created_at: now, updated_at: now, version: 1,
        competition_id: fx.competitionId, opponent: "Rival B",
      },
      {
        id: forfeitEventId, type: "MATCH", title: "Partido FORFEIT T06", start_at: new Date("2026-06-22T15:00:00Z"),
        end_at: null, time_zone: "America/Argentina/Buenos_Aires", venue_id: null,
        state: "COMPLETED", club_wide_target: false, series_id: null, occurrence_index: null,
        coordination_revision: 1, creator_person_id: fx.coachId, created_at: now, updated_at: now, version: 1,
        competition_id: fx.competitionId, opponent: "Rival C",
      },
    ]).execute()
    await tx.insertInto("app.event_target_team").values([
      { id: randomUUID(), event_id: eventId, team_id: fx.teamAId, added_at: now, added_by_person_id: fx.coachId },
      { id: randomUUID(), event_id: playedEventId, team_id: fx.teamAId, added_at: now, added_by_person_id: fx.coachId },
      { id: randomUUID(), event_id: draftEventId, team_id: fx.teamAId, added_at: now, added_by_person_id: fx.coachId },
      { id: randomUUID(), event_id: forfeitEventId, team_id: fx.teamAId, added_at: now, added_by_person_id: fx.coachId },
    ]).execute()
    await tx.insertInto("app.event_target_person").values([
      { id: randomUUID(), event_id: eventId, person_id: fx.playerId, added_at: now, added_by_person_id: fx.coachId },
    ]).execute()
    await tx.insertInto("app.availability_responses").values({
      id: randomUUID(), event_id: eventId, person_id: fx.playerId, value: "YES",
      responded_at: now, coordination_revision: 1, created_at: now,
    }).execute()

    const sheetId = randomUUID()
    await tx.insertInto("app.attendance_sheets").values({ id: sheetId, event_id: eventId, closed_at: null, closed_by_person_id: null, created_at: now }).execute()
    const entries = [
      { person: fx.playerId, value: "PRESENT" as const },
      { person: fx.player2Id, value: "PRESENT" as const },
      { person: fx.multiRoleId, value: "ABSENT" as const },
      { person: fx.crossRoleId, value: "JUSTIFIED" as const },
    ]
    let presentEntryId = ""
    for (const entry of entries) {
      const id = randomUUID()
      if (entry.value === "PRESENT" && !presentEntryId) presentEntryId = id
      await tx.insertInto("app.attendance_entries").values({
        id, sheet_id: sheetId, person_id: entry.person, value: entry.value,
        recorded_at: now, recorded_by_person_id: fx.coachId, corrected_at: null, corrected_by_person_id: null,
        correction_reason: null, previous_value: null, created_at: now, updated_at: now,
      }).execute()
    }
    await tx.insertInto("app.attendance_corrections").values({
      id: randomUUID(), entry_id: presentEntryId, previous_value: "ABSENT", new_value: "PRESENT",
      correction_reason: "Corrección T06", corrected_at: now, corrected_by_person_id: fx.coachId,
    }).execute()

    const played = randomUUID(), draft = randomUUID(), forfeit = randomUUID()
    await tx.insertInto("app.match_records").values([
      { id: played, match_id: playedEventId, state: "DRAFT", result_type: null, home_score: null, away_score: null, observations: null, finalized_at: null, finalized_by_person_id: null, corrected_at: null, corrected_by_person_id: null, correction_reason: null, previous_result_type: null, previous_home_score: null, previous_away_score: null, previous_observations: null, created_at: now, updated_at: now },
      { id: draft, match_id: draftEventId, state: "DRAFT", result_type: null, home_score: null, away_score: null, observations: null, finalized_at: null, finalized_by_person_id: null, corrected_at: null, corrected_by_person_id: null, correction_reason: null, previous_result_type: null, previous_home_score: null, previous_away_score: null, previous_observations: null, created_at: now, updated_at: now },
      { id: forfeit, match_id: forfeitEventId, state: "FINAL", result_type: "FORFEIT", home_score: null, away_score: null, observations: null, finalized_at: now, finalized_by_person_id: fx.coachId, corrected_at: null, corrected_by_person_id: null, correction_reason: null, previous_result_type: null, previous_home_score: null, previous_away_score: null, previous_observations: null, created_at: now, updated_at: now },
    ]).execute()
    await tx.insertInto("app.player_match_stats").values([
      { id: randomUUID(), match_record_id: played, person_id: fx.playerId, minutes_played: 60, goals: 2, assists: 1, yellow_cards: 0, red_cards: 0, created_at: now, updated_at: now },
      { id: randomUUID(), match_record_id: played, person_id: fx.player2Id, minutes_played: 45, goals: 0, assists: 0, yellow_cards: 1, red_cards: 0, created_at: now, updated_at: now },
    ]).execute()
    // El owner congela stats en FINAL: se cargan en DRAFT y luego se finaliza como PLAYED.
    await tx.updateTable("app.match_records").set({
      state: "FINAL", result_type: "PLAYED", home_score: 2, away_score: 1,
      finalized_at: now, finalized_by_person_id: fx.coachId,
    }).where("id", "=", played).execute()
  })
})

// C0-01 / C0-02: partido PLAYED sin estadísticas + notificación de contexto.
beforeAll(async () => {
  await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
    const now = new Date()
    noStatsEventId = randomUUID()
    await tx.insertInto("app.events").values({
      id: noStatsEventId, type: "MATCH", title: "Partido PLAYED sin stats", start_at: new Date("2026-06-23T15:00:00Z"),
      end_at: null, time_zone: "America/Argentina/Buenos_Aires", venue_id: null,
      state: "COMPLETED", club_wide_target: false, series_id: null, occurrence_index: null,
      coordination_revision: 1, creator_person_id: fx.coachId, created_at: now, updated_at: now, version: 1,
      competition_id: fx.competitionId, opponent: "Rival D",
    }).execute()
    await tx.insertInto("app.event_target_team").values({
      id: randomUUID(), event_id: noStatsEventId, team_id: fx.teamAId, added_at: now, added_by_person_id: fx.coachId,
    }).execute()
    await tx.insertInto("app.match_records").values({
      id: randomUUID(), match_id: noStatsEventId, state: "FINAL", result_type: "PLAYED", home_score: 1, away_score: 0,
      observations: null, finalized_at: now, finalized_by_person_id: fx.coachId, corrected_at: null, corrected_by_person_id: null,
      correction_reason: null, previous_result_type: null, previous_home_score: null, previous_away_score: null,
      previous_observations: null, created_at: now, updated_at: now,
    }).execute()
    await tx.insertInto("app.notifications").values({
      id: randomUUID(), recipient_person_id: fx.coachId, type: "EVENT_CHANGED",
      resource_type: "EVENT", resource_id: noStatsEventId, origin_event_id: noStatsEventId,
      title: "Cambio en partido", body: "Cuerpo privado", occurred_at: now, read_at: null,
      audience_resolved_at: now, dedupe_key: `t06api-notif-${noStatsEventId}`, created_at: now,
    }).execute()
  })
})

async function sessionFor(personId: string): Promise<Session> {
  const cached = sessions.get(personId)
  if (cached) return cached
  const created = await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) =>
    createSessionFor(services, tx, personId))
  const session = { token: created.token, sessionId: created.id, csrf: deriveCsrfToken(CSRF_SECRET, created.id) }
  sessions.set(personId, session)
  return session
}

function get(url: string, s: Session) {
  return app.inject({ method: "GET", url, headers: { origin: ORIGIN, cookie: `gei_session=${s.token}` } })
}

describe("T06 HTTP API — cinco operationIds sobre BD real", () => {
  it("RC-01 Home: cinco bloques, atención limitada a 3", async () => {
    const res = await get("/api/home", await sessionFor(fx.coachId))
    expect(res.statusCode).toBe(200)
    const body = res.json<any>()
    expect(Array.isArray(body.attention)).toBe(true)
    expect(body.attention.length).toBeLessThanOrEqual(3)
    expect(Array.isArray(body.today)).toBe(true)
    expect(Array.isArray(body.inlineAvailability)).toBe(true)
    expect(Array.isArray(body.upcoming)).toBe(true)
    expect(body.communications).toHaveProperty("notificationContext")
  })

  it("RC-10 Asistencia: fórmula A-01, UNRECORDED y correcciones en lote", async () => {
    const res = await get(`/api/reports/attendance?eventId=${eventId}`, await sessionFor(fx.coachId))
    expect(res.statusCode).toBe(200)
    const body = res.json<any>()
    expect(body.items.length).toBeGreaterThan(0)
    const first = body.items[0]
    const { present, absent, justified } = first.counts
    const expected = present + absent + justified === 0 ? null : (100 * present) / (present + absent + justified)
    expect(first.presencePercentage.value).toBe(expected)
    expect(first.presencePercentage.status).toBe("APPROVED")
    expect(body.items.some((row: any) => row.attendance.value === "UNRECORDED")).toBe(true)
    expect(body.items.some((row: any) => row.corrections.length > 0)).toBe(true)
  })

  it("RC-11 Rendimiento: matchesPlayed cuenta sólo PLAYED", async () => {
    const res = await get("/api/reports/performance", await sessionFor(fx.coachId))
    expect(res.statusCode).toBe(200)
    const body = res.json<any>()
    const player = body.items.find((row: any) => row.personId === fx.playerId)
    expect(player).toBeTruthy()
    // Un PLAYED con stats + un PLAYED sin stats => 2. Sin stats no elimina la fila.
    expect(player.totals.matchesPlayed).toBe(2)
    expect(player.totals.goals).toBe(2)
    expect(player.breakdown.every((item: any) => typeof item.countsAsPlayed === "boolean")).toBe(true)
  })

  it("C0-02: notificación no leída es contexto de Home, nunca fila de Attention", async () => {
    const coach = await sessionFor(fx.coachId)
    const home = await get("/api/home", coach)
    expect(home.statusCode).toBe(200)
    const body = home.json<any>()
    expect(body.communications.notificationContext.unreadCount).toBeGreaterThanOrEqual(1)
    expect(body.communications.notificationContext.latest.length).toBeGreaterThanOrEqual(1)
    expect(body.communications.notificationContext.latest[0].to).toBe(`/events/${noStatsEventId}`)
    expect(body.communications.notificationContext.latest[0].body).toBeUndefined()
    const attention = await get("/api/attention", coach)
    expect(attention.json<any>().items.some((item: any) => item.sourceType === "NOTIFICATION_CONTEXT")).toBe(false)
  })

  it("FR-04: ADMIN-only recibe 403 en reports; PLAYER ve sólo sus filas", async () => {
    const admin = await get("/api/reports/attendance", await sessionFor(fx.adminId))
    expect(admin.statusCode).toBe(403)
    expect(admin.json().error.code).toBe("AUTHORITY_DENIED")
    const player = await get("/api/reports/attendance", await sessionFor(fx.playerId))
    expect(player.statusCode).toBe(200)
    expect((player.json<any>().items ?? []).every((row: any) => row.personId === fx.playerId)).toBe(true)
  })

  it("RC-22 Attention: planilla abierta y reconfirmación aparecen", async () => {
    const res = await get("/api/attention", await sessionFor(fx.coachId))
    expect(res.statusCode).toBe(200)
    const sources = res.json<any>().items.map((item: any) => item.sourceType)
    expect(sources).toContain("ATTENDANCE_SHEET")
    expect(sources).toContain("AVAILABILITY")
    expect(sources).not.toContain("NOTIFICATION_CONTEXT")
  })

  it("RC-21 Search: sin Message.body, tipos válidos y cursor inválido => 400", async () => {
    const coach = await sessionFor(fx.coachId)
    const ok = await get("/api/search?q=Entrenamiento", coach)
    expect(ok.statusCode).toBe(200)
    const body = ok.json<any>()
    expect(["OK", "NO_RESULTS"]).toContain(body.state)
    expect(JSON.stringify(body)).not.toContain('"body"')
    const bad = await get("/api/search?q=Entrenamiento&cursor=tampered", coach)
    expect(bad.statusCode).toBe(400)
    expect(bad.json().error.code).toBe("INVALID_CURSOR")
  })
})
