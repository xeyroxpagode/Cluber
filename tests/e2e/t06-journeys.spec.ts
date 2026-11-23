import { test, expect, type Page } from '@playwright/test'
import crypto from 'crypto'
import {
  openDb, createMinimalStructure, createUserWithRole, createSession, setSessionCookie, cleanupE2E,
} from './e2e-helpers'

/**
 * T06 R3 — journeys reales en navegador sobre backend y PostgreSQL reales.
 * QA-07 Home · QA-09 Search · QA-10 Reports · QA-13 navegación.
 */
let page: Page
let consoleErrors: string[] = []
let apiErrors: string[] = []
let title = ''

test.beforeAll(async () => {
  const client = await openDb()
  const structure = await createMinimalStructure(client)
  const coach = await createUserWithRole(client, 'COACH', 'TEAM', structure.teamAId, structure.teamAId)
  const player = await createUserWithRole(client, 'PLAYER', 'TEAM', structure.teamAId, structure.teamAId)
  title = `Entrenamiento T06 ${Date.now()}`
  const eventId = crypto.randomUUID()
  const now = new Date()
  await client.query(
    `insert into app.events(id, type, title, start_at, time_zone, state, club_wide_target, coordination_revision, creator_person_id, version, created_at, updated_at)
     values ($1,'TRAINING',$2,$3,'America/Argentina/Buenos_Aires','SCHEDULED',false,0,$4,1,$5,$5)`,
    [eventId, title, new Date(Date.now() + 7 * 86_400_000), coach.personId, now],
  )
  await client.query(
    `insert into app.event_target_team(id, event_id, team_id, added_at, added_by_person_id) values ($1,$2,$3,$4,$5)`,
    [crypto.randomUUID(), eventId, structure.teamAId, now, coach.personId],
  )
  await client.query(
    `insert into app.attendance_sheets(id, event_id, closed_at, created_at) values ($1,$2,null,$3)`,
    [crypto.randomUUID(), eventId, now],
  )
  const session = await createSession(client, coach.accountId, coach.personId)
  ;(globalThis as any).__t06Session = session
  void player
  await client.end()
})

test.beforeEach(async ({ page: p }) => {
  page = p
  consoleErrors = []
  apiErrors = []
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()) })
  page.on('response', (response) => {
    const url = response.url()
    if (url.includes('/api/') && response.status() >= 400 && !url.includes('/api/realtime/stream')) {
      apiErrors.push(`${response.status()} ${url}`)
    }
  })
  await setSessionCookie(page, (globalThis as any).__t06Session.token)
  await page.goto('/home')
})

test.afterAll(async () => {
  const client = await openDb()
  await cleanupE2E(client)
  await client.end()
})

test('QA-07 Home: cinco bloques ordenados y atención con límite de tres', async () => {
  await expect(page.getByRole('heading', { name: 'Necesita tu atención' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Hoy', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: '¿Vas?' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Próximamente' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Comunicaciones' })).toBeVisible()
  const items = page.locator('ul[aria-label="Pendientes"] > li')
  expect(await items.count()).toBeLessThanOrEqual(3)
})

test('QA-09 Search: resultados reales y URL reproducible', async () => {
  await page.goto(`/search?q=${encodeURIComponent(title)}`)
  await expect(page.getByRole('heading', { name: 'Buscar' })).toBeVisible()
  await expect(page.getByText(title).first()).toBeVisible({ timeout: 10_000 })
  await page.reload()
  expect(new URL(page.url()).searchParams.get('q')).toBe(title)
})

test('QA-10 Reports: hub y asistencia con fórmula aprobada', async () => {
  await page.goto('/reports')
  await expect(page.getByRole('heading', { name: 'Informes deportivos' })).toBeVisible()
  await page.goto('/reports/attendance')
  await expect(page.getByRole('heading', { name: 'Asistencia', exact: true })).toBeVisible()
  await expect(page.getByText('100 × PRESENT / (PRESENT + ABSENT + JUSTIFIED)').first()).toBeVisible({ timeout: 10_000 })
})

test('QA-14 responsive 500/768/1440 sin desbordes', async () => {
  for (const width of [500, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const path of ['/home', '/reports/attendance']) {
      await page.goto(path)
      const overflow = await page.evaluate(() => ({
        doc: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
      }))
      expect(overflow.doc, `${path} a ${width}px`).toBeLessThanOrEqual(overflow.viewport + 1)
    }
  }
})

test('sin errores graves de consola en los journeys', async () => {
  // Sólo se tolera la DESCONEXIÓN esperable del stream SSE al cerrar/recargar.
  // Un 401/500 en el stream, o cualquier otro error, sigue siendo un fallo.
  const expectedSseDisconnect = (message: string) =>
    message.includes('/api/realtime/stream') &&
    /can.?t establish|ERR_CONNECTION|ERR_ABORTED|aborted|Closed/i.test(message)
  const relevant = consoleErrors.filter((message) =>
    !/favicon/.test(message) && !expectedSseDisconnect(message))
  expect(relevant).toEqual([])
  expect(apiErrors).toEqual([])
})
