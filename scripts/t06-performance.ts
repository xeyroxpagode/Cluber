/**
 * T06 — medición de p95 real de PerformanceReport sobre PostgreSQL de QA.
 * Uso: node scripts/test-db.mjs prepare && node --import tsx scripts/t06-performance.ts
 * El dataset es sintético pero representativo (300 personas · 60 partidos · 600 stats).
 */
import { randomUUID } from "node:crypto"
import { performance } from "node:perf_hooks"
import { buildT06TestApp } from "../backend/src/testing/t06-test-app.js"
import { createSessionFor } from "../backend/src/testing/test-app.js"
import { deriveCsrfToken } from "../backend/src/shared/crypto.js"
import { jsonbParam } from "../backend/src/shared/jsonb.js"

const { app, database, services, runner } = await buildT06TestApp()
const tag = `perf-${Date.now()}`
const now = new Date()
const PASSWORD_SECRET = Buffer.alloc(32, 7)

const seasonId = randomUUID(), divisionId = randomUUID(), lineId = randomUUID(), teamId = randomUUID()
const personIds: string[] = []

await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
  await tx.insertInto("app.seasons").values({ id: seasonId, name: `Season ${tag}`, starts_on: "2026-01-01", ends_on: "2026-12-31", version: 1, created_at: now, updated_at: now }).execute()
  await tx.insertInto("app.divisions").values({ id: divisionId, name: `Div ${tag}`, version: 1, created_at: now, updated_at: now }).execute()
  await tx.insertInto("app.lines").values({ id: lineId, name: `Line ${tag}`, version: 1, created_at: now, updated_at: now }).execute()
  await tx.insertInto("app.teams").values({ id: teamId, season_id: seasonId, division_id: divisionId, line_id: lineId, state: "ACTIVE", version: 1, created_at: now, updated_at: now }).execute()

  const coachId = randomUUID()
  await tx.insertInto("app.people").values({ id: coachId, first_name: "Perf", last_name: "Coach", dni: `${tag}-coach`, birth_date: "1990-01-01", phone: "123", email: `${tag}-coach@example.com`, created_at: now, updated_at: now }).execute()
  await tx.insertInto("app.role_assignments").values({ id: randomUUID(), person_id: coachId, role: "COACH", scope_type: "TEAM", scope_ref_id: teamId, valid_from: new Date("2026-01-01"), valid_until: null, temporal_exclusions: jsonbParam([]), created_at: now }).execute()
  // createSessionFor crea la cuenta ACTIVA con hash válido.
  const session = await createSessionFor(services, tx, coachId)
  ;(globalThis as any).__perf = { token: session.token, csrf: deriveCsrfToken(PASSWORD_SECRET, session.id) }

  for (let index = 0; index < 300; index += 1) {
    const id = randomUUID()
    personIds.push(id)
    await tx.insertInto("app.people").values({ id, first_name: `Perf${index}`, last_name: `Jugador${String(index).padStart(3, "0")}`, dni: `${tag}-${index}`, birth_date: "1990-01-01", phone: "123", email: `${tag}-${index}@example.com`, created_at: now, updated_at: now }).execute()
    await tx.insertInto("app.memberships").values({ id: randomUUID(), person_id: id, valid_from: new Date("2026-01-01"), valid_until: null, created_at: now }).execute()
    await tx.insertInto("app.team_assignments").values({ id: randomUUID(), person_id: id, team_id: teamId, valid_from: "2026-01-01", valid_until: null, created_at: now }).execute()
  }

  for (let match = 0; match < 60; match += 1) {
    const eventId = randomUUID()
    await tx.insertInto("app.events").values({
      id: eventId, type: "MATCH", title: `Partido ${match}`, start_at: new Date(Date.UTC(2026, 5, 1 + (match % 28), 15)),
      end_at: null, time_zone: "America/Argentina/Buenos_Aires", venue_id: null, state: "COMPLETED",
      club_wide_target: false, series_id: null, occurrence_index: null, coordination_revision: 1,
      creator_person_id: coachId, created_at: now, updated_at: now, version: 1, competition_id: null, opponent: "Rival",
    }).execute()
    await tx.insertInto("app.event_target_team").values({ id: randomUUID(), event_id: eventId, team_id: teamId, added_at: now, added_by_person_id: coachId }).execute()
    const recordId = randomUUID()
    await tx.insertInto("app.match_records").values({
      id: recordId, match_id: eventId, state: "DRAFT", result_type: null, home_score: null, away_score: null,
      observations: null, finalized_at: null, finalized_by_person_id: null, corrected_at: null, corrected_by_person_id: null,
      correction_reason: null, previous_result_type: null, previous_home_score: null, previous_away_score: null,
      previous_observations: null, created_at: now, updated_at: now,
    }).execute()
    for (let player = 0; player < 10; player += 1) {
      await tx.insertInto("app.player_match_stats").values({
        id: randomUUID(), match_record_id: recordId, person_id: personIds[(match * 10 + player) % personIds.length]!,
        minutes_played: 45 + (player % 20), goals: player % 3, assists: player % 2,
        yellow_cards: player % 4 === 0 ? 1 : 0, red_cards: 0, created_at: now, updated_at: now,
      }).execute()
    }
    await tx.updateTable("app.match_records").set({ state: "FINAL", result_type: "PLAYED", home_score: 2, away_score: 1, finalized_at: now, finalized_by_person_id: coachId }).where("id", "=", recordId).execute()
  }
})

const token = (globalThis as any).__perf.token as string
const iterations = Number(process.env.PERF_ITERATIONS ?? 200)
const latencies: number[] = []
let failures = 0
for (let index = 0; index < iterations; index += 1) {
  const start = performance.now()
  const response = await app.inject({
    method: "GET",
    url: "/api/reports/performance?limit=50",
    headers: { origin: "http://localhost:8443", cookie: `gei_session=${token}` },
  })
  latencies.push(performance.now() - start)
  if (response.statusCode !== 200) failures += 1
}
latencies.sort((a, b) => a - b)
const p = (q: number) => latencies[Math.min(latencies.length - 1, Math.floor(q * latencies.length))]!
const summary = {
  dataset: { persons: 300, matches: 60, stats: 600 },
  iterations, failures,
  p50_ms: Number(p(0.5).toFixed(2)),
  p95_ms: Number(p(0.95).toFixed(2)),
  max_ms: Number(latencies.at(-1)!.toFixed(2)),
  threshold_ms: 3000,
  pass: p(0.95) < 3000 && failures === 0,
}
console.log(JSON.stringify(summary, null, 2))
await app.close()
await database.close()
