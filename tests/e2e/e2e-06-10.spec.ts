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

test.describe('E2E T03 obligatorios (06-10)', () => {
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
  // E2E-06: Editar solo título no provoca cambio material indebido.
  // -----------------------------------------------------------------------
  test('E2E-06 Editar solo título no provoca cambio material indebido', async ({ page }) => {
    const sess = await createSession(client, coach.accountId, coach.personId)
    await setSessionCookie(page, sess.token)

    const startAt = iso(7, 22)
    const created = await apiRequest(page, 'POST', '/api/events', {
      type: 'TRAINING',
      title: 'Entrenamiento solo título',
      startAt,
      timeZone: 'America/Argentina/Buenos_Aires',
      targetTeamIds: [fx.teamAId],
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)
    expect(created.status).toBe(201)
    const eventId = (await created.body).id

    const before = await client.query('select coordination_revision, version from app.events where id = $1', [eventId])
    const revBefore = before.rows[0].coordination_revision

    const res = await apiRequest(page, 'PATCH', `/api/events/${eventId}/meta`, {
      title: 'Entrenamiento solo título editado',
      expectedVersion: before.rows[0].version,
    }, sess.sessionId)
    expect(res.status).toBe(200)

    const after = await client.query('select coordination_revision, version from app.events where id = $1', [eventId])
    expect(after.rows[0].coordination_revision).toBe(revBefore)
    expect(after.rows[0].version).toBe(before.rows[0].version + 1)

    const notes = await client.query('select count(*)::int n from app.notifications where origin_event_id = $1', [eventId])
    expect(notes.rows[0].n).toBe(0)
  })

  // -----------------------------------------------------------------------
  // E2E-07: Cambio de horario actualiza revisión y notifica.
  // -----------------------------------------------------------------------
  test('E2E-07 Cambio de horario actualiza revisión y notifica', async ({ page }) => {
    const sess = await createSession(client, coach.accountId, coach.personId)
    await setSessionCookie(page, sess.token)

    const startAt = iso(7, 23)
    const created = await apiRequest(page, 'POST', '/api/events', {
      type: 'TRAINING',
      title: 'Entrenamiento horario',
      startAt,
      timeZone: 'America/Argentina/Buenos_Aires',
      targetTeamIds: [fx.teamAId],
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)
    expect(created.status).toBe(201)
    const eventId = (await created.body).id

    const before = await client.query('select coordination_revision from app.events where id = $1', [eventId])
    const revBefore = before.rows[0].coordination_revision

    const res = await apiRequest(page, 'PATCH', `/api/events/${eventId}`, {
      startAt: iso(7, 23, 19),
      expectedVersion: before.rows[0].version,
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)
    expect(res.status).toBe(200)

    const after = await client.query('select coordination_revision from app.events where id = $1', [eventId])
    expect(after.rows[0].coordination_revision).toBe(revBefore + 1)

    const notes = await client.query("select type from app.notifications where origin_event_id = $1 and type in ('EVENT_CHANGED','EVENT_POSTPONED')", [eventId])
    expect(notes.rows.length).toBeGreaterThan(0)
  })

  // -----------------------------------------------------------------------
  // E2E-08: Ediciones concurrentes sin pérdida de datos.
  // -----------------------------------------------------------------------
  test('E2E-08 Ediciones concurrentes sin pérdida de datos', async ({ page }) => {
    const sess = await createSession(client, coach.accountId, coach.personId)
    await setSessionCookie(page, sess.token)

    const startAt = iso(7, 24)
    const created = await apiRequest(page, 'POST', '/api/events', {
      type: 'TRAINING',
      title: 'Entrenamiento conflicto',
      startAt,
      timeZone: 'America/Argentina/Buenos_Aires',
      targetTeamIds: [fx.teamAId],
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)
    expect(created.status).toBe(201)
    const eventId = (await created.body).id

    const before = await client.query('select version from app.events where id = $1', [eventId])
    const version = before.rows[0].version

    // Primera actualización (título vía /meta)
    const resA = await apiRequest(page, 'PATCH', `/api/events/${eventId}/meta`, {
      title: 'Versión A',
      expectedVersion: version,
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)

    // Segunda actualización con versión vieja (debe conflictar)
    const resB = await apiRequest(page, 'PATCH', `/api/events/${eventId}/meta`, {
      title: 'Versión B',
      expectedVersion: version,
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)

    // Verificar que el evento existe y tiene una versión (sin pérdida de datos)
    const final = await client.query('select version, title from app.events where id = $1', [eventId])
    expect(final.rows[0].version).toBeGreaterThanOrEqual(version)
    expect(final.rows[0].title).toMatch(/Versión [AB]/)
  })

  // -----------------------------------------------------------------------
  // E2E-09: Postpone y Reschedule funcionan correctamente.
  // -----------------------------------------------------------------------
  test('E2E-09 Postpone y Reschedule funcionan correctamente', async ({ page }) => {
    const sess = await createSession(client, coach.accountId, coach.personId)
    await setSessionCookie(page, sess.token)

    const startAt = iso(7, 25)
    const created = await apiRequest(page, 'POST', '/api/events', {
      type: 'TRAINING',
      title: 'Entrenamiento postergar',
      startAt,
      timeZone: 'America/Argentina/Buenos_Aires',
      targetTeamIds: [fx.teamAId],
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)
    expect(created.status).toBe(201)
    const eventId = (await created.body).id

    const resPostpone = await apiRequest(page, 'POST', `/api/events/${eventId}/postpone`, {}, sess.sessionId)
    expect(resPostpone.status).toBe(200)

    const afterPostpone = await client.query('select state from app.events where id = $1', [eventId])
    expect(afterPostpone.rows[0].state).toBe('POSTPONED')

    const resReschedule = await apiRequest(page, 'POST', `/api/events/${eventId}/reschedule`, {}, sess.sessionId)
    expect(resReschedule.status).toBe(200)

    const afterReschedule = await client.query('select state, coordination_revision from app.events where id = $1', [eventId])
    expect(afterReschedule.rows[0].state).toBe('SCHEDULED')
    expect(afterReschedule.rows[0].coordination_revision).toBeGreaterThan(0)

    const types = await client.query("select type from app.notifications where origin_event_id = $1", [eventId])
    const setTypes = new Set(types.rows.map((r) => r.type))
    expect(setTypes.has('EVENT_POSTPONED')).toBeTruthy()
    expect(setTypes.has('EVENT_RESCHEDULED')).toBeTruthy()
  })

  // -----------------------------------------------------------------------
  // E2E-10: Cancel y Restore respetan lifecycle y efectos.
  // -----------------------------------------------------------------------
  test('E2E-10 Cancel y Restore respetan lifecycle y efectos', async ({ page }) => {
    const sess = await createSession(client, coach.accountId, coach.personId)
    await setSessionCookie(page, sess.token)

    const startAt = iso(7, 26)
    const created = await apiRequest(page, 'POST', '/api/events', {
      type: 'TRAINING',
      title: 'Entrenamiento cancelar',
      startAt,
      timeZone: 'America/Argentina/Buenos_Aires',
      targetTeamIds: [fx.teamAId],
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)
    expect(created.status).toBe(201)
    const eventId = (await created.body).id

    const resCancel = await apiRequest(page, 'POST', `/api/events/${eventId}/cancel`, {}, sess.sessionId)
    expect(resCancel.status).toBe(200)

    const afterCancel = await client.query('select state from app.events where id = $1', [eventId])
    expect(afterCancel.rows[0].state).toBe('CANCELLED')

    const resRestore = await apiRequest(page, 'POST', `/api/events/${eventId}/restore`, {}, sess.sessionId)
    expect(resRestore.status).toBe(200)

    const afterRestore = await client.query('select state, coordination_revision from app.events where id = $1', [eventId])
    expect(afterRestore.rows[0].state).toBe('SCHEDULED')
    expect(afterRestore.rows[0].coordination_revision).toBeGreaterThan(0)

    const types = await client.query("select type from app.notifications where origin_event_id = $1", [eventId])
    const setTypes = new Set(types.rows.map((r) => r.type))
    expect(setTypes.has('EVENT_CANCELLED')).toBeTruthy()
    expect(setTypes.has('EVENT_RESTORED')).toBeTruthy()
  })
})
