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

test.describe('E2E T03 obligatorios (DG-06/07/08)', () => {
  let client: any
  let fx: any
  let coach: any
  let sub: any
  let captain: any
  let player: any

  test.beforeAll(async () => {
    client = await openDb()
    fx = await createMinimalStructure(client)
    coach = await createUserWithRole(client, 'COACH', 'TEAM', fx.teamAId, fx.teamAId)
    sub = await createUserWithRole(client, 'SUBCOMMITTEE', 'CLUB', null)
    captain = await createUserWithRole(client, 'CAPTAIN', 'TEAM', fx.teamAId, fx.teamAId)
    player = await createUserWithRole(client, 'PLAYER', 'TEAM', fx.teamAId, fx.teamAId)
  })

  test.afterAll(async () => {
    await cleanupE2E(client)
    await client.end()
  })

  // -----------------------------------------------------------------------
  // E2E-01: COACH crea TRAINING para su equipo.
  // -----------------------------------------------------------------------
  test('E2E-01 COACH crea TRAINING para su equipo', async ({ page }) => {
    const sess = await createSession(client, coach.accountId, coach.personId)
    await setSessionCookie(page, sess.token)

    const startAt = iso(7, 18)
    const res = await apiRequest(page, 'POST', '/api/events', {
      type: 'TRAINING',
      title: 'Entrenamiento táctico E2E',
      startAt,
      timeZone: 'America/Argentina/Buenos_Aires',
      targetTeamIds: [fx.teamAId],
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)
    expect(res.status).toBe(201)
    const body = await res.body
    expect(body.eventCreated).toBe(true)
    const eventId = body.id

    const rows = await client.query('select id, type, state, coordination_revision, version from app.events where id = $1', [eventId])
    expect(rows.rows).toHaveLength(1)
    expect(rows.rows[0].type).toBe('TRAINING')
    expect(rows.rows[0].state).toBe('SCHEDULED')
    expect(rows.rows[0].coordination_revision).toBe(0)
    expect(rows.rows[0].version).toBe(1)
    const targets = await client.query('select team_id from app.event_target_team where event_id = $1', [eventId])
    expect(targets.rows.map((r: any) => r.team_id)).toContain(fx.teamAId)
  })

  // -----------------------------------------------------------------------
  // E2E-02: COACH intenta crear evento en equipo ajeno y es rechazado.
  // -----------------------------------------------------------------------
  test('E2E-02 COACH intenta crear evento en equipo ajeno y es rechazado', async ({ page }) => {
    const sess = await createSession(client, coach.accountId, coach.personId)
    await setSessionCookie(page, sess.token)

    const startAt = iso(7, 18)
    const res = await apiRequest(page, 'POST', '/api/events', {
      type: 'TRAINING',
      title: 'Entrenamiento equipo ajeno',
      startAt,
      timeZone: 'America/Argentina/Buenos_Aires',
      targetTeamIds: [fx.teamBId],
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)
    expect([403, 422]).toContain(res.status)
    const body = await res.body
    expect(body.error.code).toMatch(/AUTHORITY_DENIED|INVALID_TARGET/)

    const rows = await client.query("select count(*)::int n from app.events where title = 'Entrenamiento equipo ajeno'")
    expect(rows.rows[0].n).toBe(0)
  })

  // -----------------------------------------------------------------------
  // E2E-03: SUBCOMMITTEE crea CLUB_EVENT válido.
  // -----------------------------------------------------------------------
  test('E2E-03 SUBCOMMITTEE crea CLUB_EVENT válido', async ({ page }) => {
    const sess = await createSession(client, sub.accountId, sub.personId)
    await setSessionCookie(page, sess.token)

    const startAt = iso(7, 19)
    const res = await apiRequest(page, 'POST', '/api/events', {
      type: 'CLUB_EVENT',
      title: 'Asada del club E2E',
      startAt,
      timeZone: 'America/Argentina/Buenos_Aires',
      clubWideTarget: true,
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)
    expect(res.status).toBe(201)
    const body = await res.body
    expect(body.eventCreated).toBe(true)

    const rows = await client.query('select id, type, state, club_wide_target from app.events where title = $1', ['Asada del club E2E'])
    expect(rows.rows).toHaveLength(1)
    expect(rows.rows[0].type).toBe('CLUB_EVENT')
    expect(rows.rows[0].club_wide_target).toBe(true)
  })

  // -----------------------------------------------------------------------
  // E2E-04: MATCH con dos Team targets es rechazado.
  // -----------------------------------------------------------------------
  test('E2E-04 MATCH con dos Team targets es rechazado', async ({ page }) => {
    const sess = await createSession(client, coach.accountId, coach.personId)
    await setSessionCookie(page, sess.token)

    const startAt = iso(7, 20)
    const res = await apiRequest(page, 'POST', '/api/events', {
      type: 'MATCH',
      title: 'Partido dos equipos',
      startAt,
      timeZone: 'America/Argentina/Buenos_Aires',
      targetTeamIds: [fx.teamAId, fx.teamBId],
      opponent: 'Rival',
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)
    expect(res.status).toBe(422)
    expect((res.body as any).error.code).toBe('INVALID_TARGET')

    const rows = await client.query("select count(*)::int n from app.events where title = 'Partido dos equipos'")
    expect(rows.rows[0].n).toBe(0)
  })

  // -----------------------------------------------------------------------
  // E2E-05: MATCH sin opponent es rechazado.
  // -----------------------------------------------------------------------
  test('E2E-05 MATCH sin opponent es rechazado', async ({ page }) => {
    const sess = await createSession(client, coach.accountId, coach.personId)
    await setSessionCookie(page, sess.token)

    const startAt = iso(7, 21)
    const res = await apiRequest(page, 'POST', '/api/events', {
      type: 'MATCH',
      title: 'Partido sin rival',
      startAt,
      timeZone: 'America/Argentina/Buenos_Aires',
      targetTeamIds: [fx.teamAId],
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)
    expect(res.status).toBe(422)
    expect((res.body as any).error.code).toBe('OPPONENT_REQUIRED')

    const rows = await client.query("select count(*)::int n from app.events where title = 'Partido sin rival'")
    expect(rows.rows[0].n).toBe(0)
  })
})
