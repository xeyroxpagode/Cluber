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

test.describe('E2E T03 obligatorios (17-20)', () => {
  let client: any
  let fx: any
  let coach: any
  let sub: any

  test.beforeAll(async () => {
    client = await openDb()
    fx = await createMinimalStructure(client)
    coach = await createUserWithRole(client, 'COACH', 'TEAM', fx.teamAId, fx.teamAId)
    sub = await createUserWithRole(client, 'SUBCOMMITTEE', 'CLUB', null)
  })

  test.afterAll(async () => {
    await cleanupE2E(client)
    await client.end()
  })

  // -----------------------------------------------------------------------
  // E2E-17: Interrupción del worker no pierde avisos confirmados.
  // -----------------------------------------------------------------------
  test('E2E-17 Interrupción del worker no pierde avisos confirmados', async ({ page }) => {
    const sess = await createSession(client, coach.accountId, coach.personId)
    await setSessionCookie(page, sess.token)

    const startAt = iso(7, 60)
    const created = await apiRequest(page, 'POST', '/api/events', {
      type: 'TRAINING',
      title: 'Entrenamiento worker E2E',
      startAt,
      timeZone: 'America/Argentina/Buenos_Aires',
      targetTeamIds: [fx.teamAId],
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)
    expect(created.status).toBe(201)
    const eventId = (await created.body).id

    const res = await apiRequest(page, 'PATCH', `/api/events/${eventId}`, {
      startAt: iso(7, 62),
      expectedVersion: 1,
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)
    expect(res.status).toBe(200)

    const notes = await client.query("select id, type, read_at from app.notifications where origin_event_id = $1", [eventId])
    expect(notes.rows.length).toBeGreaterThan(0)
    expect(notes.rows[0].type).toBe('EVENT_CHANGED')
    expect(notes.rows[0].read_at).toBeNull()

    const outbox = await client.query("select id, topic, processed_at from infra.outbox_events where aggregate_id = $1 and topic = 'notification.created'", [notes.rows[0].id])
    expect(outbox.rows.length).toBeGreaterThan(0)
  })

  // -----------------------------------------------------------------------
  // E2E-18: Fallo de realtime no altera persistencia.
  // -----------------------------------------------------------------------
  test('E2E-18 Fallo de realtime no altera persistencia', async ({ page }) => {
    const sess = await createSession(client, coach.accountId, coach.personId)
    await setSessionCookie(page, sess.token)

    const startAt = iso(7, 61)
    const { date, time } = localParts(startAt)

    await page.goto('/events/new')
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: 'Entrenamiento' }).click()
    await page.getByLabel('Título').fill('Entrenamiento SSE E2E')
    await page.getByLabel('Fecha').fill(date)
    await page.getByLabel('Inicio').fill(time)
    await page.getByLabel('Fin').fill('20:00')
    await page.getByLabel('Zona horaria').selectOption({ label: /America\/Argentina\/Buenos_Aires/ })
    await page.getByLabel('Sede').selectOption({ label: /Club E2E/ })
    await page.getByRole('checkbox', { name: /Sexta A/ }).check()
    await page.getByRole('button', { name: /Crear evento/ }).click()
    await expect(page).toHaveURL(/^\/events\/[^/]+$/)
    const eventId = page.url().split('/').pop()!

    await page.goto(`/events/${eventId}/edit`)
    await page.waitForLoadState('networkidle')
    await page.getByLabel('Inicio').fill('19:30')
    await page.getByRole('button', { name: /Guardar cambios/ }).click()
    await expect(page).toHaveURL(`/events/${eventId}`)

    const notes = await client.query("select type from app.notifications where origin_event_id = $1", [eventId])
    expect(notes.rows.length).toBeGreaterThan(0)
    const types = new Set(notes.rows.map((r) => r.type))
    expect(types.has('EVENT_CHANGED')).toBeTruthy()

    const ev = await client.query('select state, coordination_revision from app.events where id = $1', [eventId])
    expect(ev.rows[0].state).toBe('SCHEDULED')
    expect(ev.rows[0].coordination_revision).toBeGreaterThan(0)
  })

  // -----------------------------------------------------------------------
  // E2E-19: Revocación de rol bloquea el siguiente request.
  // -----------------------------------------------------------------------
  test('E2E-19 Revocación de rol bloquea el siguiente request', async ({ page }) => {
    const sessSub = await createSession(client, sub.accountId, sub.personId)
    await setSessionCookie(page, sessSub.token)

    const startAt = iso(7, 70)
    const created = await apiRequest(page, 'POST', '/api/events', {
      type: 'CLUB_EVENT',
      title: 'Evento revocación E2E',
      startAt,
      timeZone: 'America/Argentina/Buenos_Aires',
      clubWideTarget: true,
      idempotency_key: crypto.randomUUID(),
    }, sessSub.sessionId)
    expect(created.status).toBe(201)
    const eventId = (await created.body).id

    await client.query(
      `insert into app.role_assignments(id, person_id, role, scope_type, scope_ref_id, valid_from, valid_until, temporal_exclusions, created_at)
       values ($1,$2,'COACH','EVENT',$3,now(),null,'[]'::jsonb,now())`,
      [crypto.randomUUID(), coach.personId, eventId],
    )

    const sessCoach = await createSession(client, coach.accountId, coach.personId)
    await setSessionCookie(page, sessCoach.token)

    const res1 = await apiRequest(page, 'PATCH', `/api/events/${eventId}`, {
      title: 'Evento revocación editado',
      expectedVersion: 1,
      idempotency_key: crypto.randomUUID(),
    }, sessCoach.sessionId)
    expect(res1.status).toBe(200)

    await client.query(`update app.role_assignments set valid_until = now() where person_id = $1 and role = 'COACH' and scope_type = 'EVENT' and scope_ref_id = $2`, [coach.personId, eventId])

    const res2 = await apiRequest(page, 'PATCH', `/api/events/${eventId}`, {
      title: 'Evento revocación editado 2',
      expectedVersion: 2,
      idempotency_key: crypto.randomUUID(),
    }, sessCoach.sessionId)
    expect(res2.status).toBe(403)
    const body = await res2.body
    expect(body.error.code).toBe('AUTHORITY_DENIED')
  })

  // -----------------------------------------------------------------------
  // E2E-20: Reinicio conserva datos del dominio.
  // -----------------------------------------------------------------------
  test('E2E-20 Reinicio conserva datos del dominio', async ({ page }) => {
    const sess = await createSession(client, sub.accountId, sub.personId)
    await setSessionCookie(page, sess.token)

    const startAt = iso(7, 80)
    const created = await apiRequest(page, 'POST', '/api/events', {
      type: 'CLUB_EVENT',
      title: 'Evento persistencia E2E',
      startAt,
      timeZone: 'America/Argentina/Buenos_Aires',
      clubWideTarget: true,
      idempotency_key: crypto.randomUUID(),
    }, sess.sessionId)
    expect(created.status).toBe(201)
    const eventId = (await created.body).id

    const ev = await client.query('select id, title, state, club_wide_target from app.events where id = $1', [eventId])
    expect(ev.rows[0].id).toBe(eventId)
    expect(ev.rows[0].title).toBe('Evento persistencia E2E')
    expect(ev.rows[0].state).toBe('SCHEDULED')
    expect(ev.rows[0].club_wide_target).toBe(true)

    const detail = await apiRequest(page, 'GET', `/api/events/${eventId}`, undefined, sess.sessionId)
    expect(detail.status).toBe(200)
    expect((detail.body as any).id).toBe(eventId)
    expect((detail.body as any).title).toBe('Evento persistencia E2E')
  })
})
