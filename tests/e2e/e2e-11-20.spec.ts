import { test, expect, type Page } from '@playwright/test'
import {
  openDb,
  createUserWithRole,
  createMinimalStructure,
  cleanupE2E,
  createSession,
  setSessionCookie,
  apiRequest,
  TAG,
} from './e2e-helpers'

function iso(offsetDays: number, hour = 18): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

function localParts(isoStr: string): { date: string; time: string } {
  const d = new Date(isoStr)
  const pad = (n: number) => String(n).padStart(2, '0')
  return { date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, time: `${pad(d.getHours())}:${pad(d.getMinutes())}` }
}

test.describe('E2E T03 obligatorios (11-20)', () => {
  let client: any
  let fx: any
  let coach: any
  let sub: any
  let captain: any

  test.beforeAll(async () => {
    client = await openDb()
    fx = await createMinimalStructure(client)
    coach = await createUserWithRole(client, 'COACH', 'TEAM', fx.teamAId, fx.teamAId)
    sub = await createUserWithRole(client, 'SUBCOMMITTEE', 'CLUB', null)
    captain = await createUserWithRole(client, 'CAPTAIN', 'TEAM', fx.teamAId, fx.teamAId)
  })

  test.afterAll(async () => {
    await cleanupE2E(client)
    await client.end()
  })

  // -----------------------------------------------------------------------
  // E2E-11: CAPTAIN modifica logística cuando está autorizado.
  // -----------------------------------------------------------------------
  test('E2E-11 CAPTAIN modifica logística cuando está autorizado', async ({ page }) => {
    const sessSub = await createSession(client, sub.accountId, sub.personId)
    await setSessionCookie(page, sessSub.token)

    const startAt = iso(7, 30)
    const created = await apiRequest(page, 'POST', '/api/events', {
      type: 'MATCH',
      title: 'Partido logística E2E',
      startAt,
      timeZone: 'America/Argentina/Buenos_Aires',
      targetTeamIds: [fx.teamAId],
      opponent: 'Rival E2E',
      competitionId: fx.competitionId,
      idempotency_key: crypto.randomUUID(),
    }, sessSub.sessionId)
    expect(created.status).toBe(201)
    const eventId = (await created.body).id

    const sessCap = await createSession(client, captain.accountId, captain.personId)
    await setSessionCookie(page, sessCap.token)

    // CAPTAIN modifica logística vía endpoint dedicado CMD-EVT-16
    const res = await apiRequest(page, 'PATCH', `/api/events/${eventId}/logistics`, {
      meetingPoint: 'Puerta principal E2E',
      expectedVersion: 1,
      idempotency_key: crypto.randomUUID(),
    }, sessCap.sessionId)
    expect(res.status).toBe(200)

    const after = await client.query('select coordination_revision, version from app.events where id = $1', [eventId])
    expect(after.rows[0].coordination_revision).toBeGreaterThan(0)
    expect(after.rows[0].version).toBeGreaterThan(1)

    const log = await client.query('select meeting_point from app.event_logistics where event_id = $1', [eventId])
    expect(log.rows[0].meeting_point).toBe('Puerta principal E2E')

    const notes = await client.query("select type from app.notifications where origin_event_id = $1 and type = 'EVENT_CHANGED'", [eventId])
    expect(notes.rows.length).toBeGreaterThan(0)
  })

  // -----------------------------------------------------------------------
  // E2E-12: Crear serie recurrente válida (≤366 ocurrencias).
  // -----------------------------------------------------------------------
  test('E2E-12 Crear serie recurrente válida', async ({ page }) => {
    const sess = await createSession(client, coach.accountId, coach.personId)
    await setSessionCookie(page, sess.token)

    const startAt = iso(7, 10)
    const res = await apiRequest(page, 'POST', '/api/event-series', {
      recurrenceRule: 'FREQ=WEEKLY;COUNT=4;BYDAY=TU',
      maxOccurrences: 4,
      type: 'TRAINING',
      title: 'Serie semanal E2E',
      startAt,
      timeZone: 'America/Argentina/Buenos_Aires',
      targetTeamIds: [fx.teamAId],
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)
    expect(res.status).toBe(201)
    const body = await res.body
    expect(body.seriesCreated).toBe(true)
    expect(body.occurrenceCount).toBe(4)

    const series = await client.query('select id, state, max_occurrences from app.event_series where id = $1', [body.id])
    expect(series.rows[0].state).toBe('ACTIVE')
    expect(series.rows[0].max_occurrences).toBe(4)

    const occurrences = await client.query('select count(*)::int n from app.events where series_id = $1', [body.id])
    expect(occurrences.rows[0].n).toBe(4)
  })

  // -----------------------------------------------------------------------
  // E2E-13: Modificar una ocurrencia individual (override).
  // -----------------------------------------------------------------------
  test('E2E-13 Modificar una ocurrencia individual', async ({ page }) => {
    const sess = await createSession(client, coach.accountId, coach.personId)
    await setSessionCookie(page, sess.token)

    const startAt = iso(7, 10)
    const created = await apiRequest(page, 'POST', '/api/event-series', {
      recurrenceRule: 'FREQ=WEEKLY;COUNT=2;BYDAY=TU',
      maxOccurrences: 2,
      type: 'TRAINING',
      title: 'Serie override',
      startAt,
      timeZone: 'America/Argentina/Buenos_Aires',
      targetTeamIds: [fx.teamAId],
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)
    expect(created.status).toBe(201)
    const seriesId = (await created.body).id

    const occurrences = await client.query('select id, occurrence_index from app.events where series_id = $1 order by occurrence_index', [seriesId])
    expect(occurrences.rows).toHaveLength(2)
    const occ0Id = occurrences.rows[0].id
    const occ1Id = occurrences.rows[1].id

    // Modificar solo la ocurrencia 0 vía API (CMD-EVT-04 /meta)
    const before0 = await client.query('select version from app.events where id = $1', [occ0Id])
    const res0 = await apiRequest(page, 'PATCH', `/api/events/${occ0Id}/meta`, {
      title: 'Occurrencia 0 modificada',
      expectedVersion: before0.rows[0].version,
    }, sess.sessionId)
    expect(res0.status).toBe(200)

    const occAfter = await client.query('select title from app.events where id = $1', [occ0Id])
    expect(occAfter.rows[0].title).toBe('Occurrencia 0 modificada')

    // Verificar que existe un override en la serie
    const overrides = await client.query('select count(*)::int n from app.event_occurrence_overrides where series_id = $1', [seriesId])
    expect(overrides.rows[0].n).toBeGreaterThan(0)

    // La segunda ocurrencia no debe haber cambiado
    const occ1After = await client.query('select title from app.events where id = $1', [occ1Id])
    expect(occ1After.rows[0].title).toBe('Serie override')
  })

  // -----------------------------------------------------------------------
  // E2E-14: Finalizar serie preservando historia.
  // -----------------------------------------------------------------------
  test('E2E-14 Finalizar serie preservando historia', async ({ page }) => {
    const sess = await createSession(client, coach.accountId, coach.personId)
    await setSessionCookie(page, sess.token)

    const startAt = iso(7, 10)
    const created = await apiRequest(page, 'POST', '/api/event-series', {
      recurrenceRule: 'FREQ=WEEKLY;COUNT=2;BYDAY=TU',
      maxOccurrences: 2,
      type: 'TRAINING',
      title: 'Serie para terminar',
      startAt,
      timeZone: 'America/Argentina/Buenos_Aires',
      targetTeamIds: [fx.teamAId],
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)
    expect(created.status).toBe(201)
    const seriesId = (await created.body).id

    const before = await client.query('select state from app.event_series where id = $1', [seriesId])
    expect(before.rows[0].state).toBe('ACTIVE')

    const res = await apiRequest(page, 'POST', `/api/event-series/${seriesId}/end`, {}, sess.sessionId)
    expect(res.status).toBe(200)

    const after = await client.query('select state from app.event_series where id = $1', [seriesId])
    expect(after.rows[0].state).toBe('ENDED')

    const occurrences = await client.query('select count(*)::int n from app.events where series_id = $1', [seriesId])
    expect(occurrences.rows[0].n).toBe(2)

    const res2 = await apiRequest(page, 'POST', `/api/event-series/${seriesId}/end`, {}, sess.sessionId)
    expect(res2.status).toBe(409)
  })

  // -----------------------------------------------------------------------
  // E2E-15: Crear Jornada válida.
  // -----------------------------------------------------------------------
  test('E2E-15 Crear Jornada válida', async ({ page }) => {
    const sess = await createSession(client, sub.accountId, sub.personId)
    await setSessionCookie(page, sess.token)

    const startAt = iso(7, 40)
    const m1 = await apiRequest(page, 'POST', '/api/events', {
      type: 'MATCH',
      title: 'Partido J1',
      startAt,
      timeZone: 'America/Argentina/Buenos_Aires',
      targetTeamIds: [fx.teamAId],
      opponent: 'R1',
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)
    expect(m1.status).toBe(201)
    const m2 = await apiRequest(page, 'POST', '/api/events', {
      type: 'MATCH',
      title: 'Partido J2',
      startAt,
      timeZone: 'America/Argentina/Buenos_Aires',
      targetTeamIds: [fx.teamBId],
      opponent: 'R2',
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)
    expect(m2.status).toBe(201)

    const res = await apiRequest(page, 'POST', '/api/jornadas', {
      name: 'Jornada E2E',
      seasonId: fx.seasonId,
      competitionId: fx.competitionId,
      eventIds: [(await m1.body).id, (await m2.body).id],
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)
    expect(res.status).toBe(201)
    const body = await res.body
    expect(body.jornadaCreated).toBe(true)
    expect(body.matchCount).toBe(2)

    const matches = await client.query('select count(*)::int n from app.jornada_matches where jornada_id = $1', [body.id])
    expect(matches.rows[0].n).toBe(2)
  })

  // -----------------------------------------------------------------------
  // E2E-16: Jornada inválida provoca rollback completo.
  // -----------------------------------------------------------------------
  test('E2E-16 Jornada inválida rollback completo', async ({ page }) => {
    const sess = await createSession(client, sub.accountId, sub.personId)
    await setSessionCookie(page, sess.token)

    // Crear otra temporada y un equipo en esa temporada
    const otherSeason = await client.query("insert into app.seasons(id, name, starts_on, ends_on, version, created_at, updated_at) values ($1,'Otra temporada E2E ' || $2,'2026-01-01','2026-12-31',1,now(),now()) returning id", [crypto.randomUUID(), TAG])
    const otherSeasonId = otherSeason.rows[0].id
    const otherDivision = await client.query("insert into app.divisions(id, name, version, created_at, updated_at) values ($1,'Div Otra E2E ' || $2,1,now(),now()) returning id", [crypto.randomUUID(), TAG])
    const otherDivisionId = otherDivision.rows[0].id
    const otherTeam = await client.query("insert into app.teams(id, season_id, division_id, line_id, state, version, created_at, updated_at) values ($1,$2,$3,$4,'ACTIVE',1,now(),now()) returning id", [crypto.randomUUID(), otherSeasonId, otherDivisionId, fx.lineId])
    const otherTeamId = otherTeam.rows[0].id

    const startAt = iso(7, 50)
    const m = await apiRequest(page, 'POST', '/api/events', {
      type: 'MATCH',
      title: 'Partido otra temporada',
      startAt,
      timeZone: 'America/Argentina/Buenos_Aires',
      targetTeamIds: [otherTeamId],
      opponent: 'Rival',
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)
    expect(m.status).toBe(201)
    const eventId = (await m.body).id

    const res = await apiRequest(page, 'POST', '/api/jornadas', {
      name: 'Jornada inválida',
      seasonId: fx.seasonId,
      eventIds: [eventId],
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)
    expect(res.status).toBe(422)
    const body = await res.body
    expect(body.error.code).toBe('SEASON_MISMATCH')

    const jornadas = await client.query("select count(*)::int n from app.jornadas where name = 'Jornada inválida'")
    expect(jornadas.rows[0].n).toBe(0)
  })
})