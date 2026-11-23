import { test, expect, type Page } from '@playwright/test'
import crypto from 'crypto'
import {
  openDb, createMinimalStructure, createUserWithRole, createSession, setSessionCookie, cleanupE2E, apiRequest,
} from './e2e-helpers'

/**
 * T06 R3 — QA integral de navegador: 14 journeys, cinco roles, multirol y dos sesiones.
 * Datos reales en PostgreSQL; frontend y backend reales.
 */
interface Ctx {
  role: string
  personId: string
  accountId: string
  token: string
}
const contexts: Record<string, Ctx> = {}
let structure: Awaited<ReturnType<typeof createMinimalStructure>>
let eventId = ''
let title = ''

test.beforeAll(async () => {
  const client = await openDb()
  structure = await createMinimalStructure(client)
  title = `QA Integral ${Date.now()}`
  const definitions: Array<[string, string, string | null]> = [
    ['COACH', 'TEAM', structure.teamAId],
    ['PLAYER', 'TEAM', structure.teamAId],
    ['CAPTAIN', 'TEAM', structure.teamAId],
    ['SUBCOMMITTEE', 'CLUB', null],
    ['ADMIN', 'CLUB', null],
  ]
  for (const [role, scopeType, scopeRefId] of definitions) {
    const user = await createUserWithRole(client, role, scopeType, scopeRefId, scopeRefId ?? undefined)
    const session = await createSession(client, user.accountId, user.personId)
    contexts[role] = { role, personId: user.personId, accountId: user.accountId, token: session.token }
  }
  const multi = await createUserWithRole(client, 'PLAYER', 'TEAM', structure.teamAId, structure.teamAId)
  await client.query(
    `insert into app.role_assignments(id, person_id, role, scope_type, scope_ref_id, valid_from, valid_until, temporal_exclusions, created_at)
     values ($1,$2,'COACH','TEAM',$3,now(),null,'[]'::jsonb,now())`,
    [crypto.randomUUID(), multi.personId, structure.teamAId],
  )
  const multiSession = await createSession(client, multi.accountId, multi.personId)
  contexts['MULTI'] = { role: 'MULTI', personId: multi.personId, accountId: multi.accountId, token: multiSession.token }

  eventId = crypto.randomUUID()
  const now = new Date()
  await client.query(
    `insert into app.events(id,type,title,start_at,time_zone,state,club_wide_target,coordination_revision,creator_person_id,version,created_at,updated_at,competition_id,opponent)
     values ($1,'MATCH',$2,$3,'America/Argentina/Buenos_Aires','SCHEDULED',false,2,$4,1,$5,$5,$6,'Rival QA')`,
    [eventId, title, new Date(Date.now() + 7 * 86400000), contexts.COACH!.personId, now, structure.competitionId],
  )
  await client.query(
    `insert into app.event_target_team(id,event_id,team_id,added_at,added_by_person_id) values ($1,$2,$3,$4,$5)`,
    [crypto.randomUUID(), eventId, structure.teamAId, now, contexts.COACH!.personId],
  )
  await client.query(
    `insert into app.attendance_sheets(id,event_id,closed_at,created_at) values ($1,$2,null,$3)`,
    [crypto.randomUUID(), eventId, now],
  )
  const recordId = crypto.randomUUID()
  await client.query(
    `insert into app.match_records(id,match_id,state,result_type,home_score,away_score,created_at,updated_at)
     values ($1,$2,'DRAFT',null,null,null,$3,$3)`,
    [recordId, eventId, now],
  )
  await client.query(
    `insert into app.player_match_stats(id,match_record_id,person_id,minutes_played,goals,assists,yellow_cards,red_cards,created_at,updated_at)
     values ($1,$2,$3,60,1,0,0,0,$4,$4)`,
    [crypto.randomUUID(), recordId, contexts.PLAYER!.personId, now],
  )
  await client.query(
    `update app.match_records set state='FINAL', result_type='PLAYED', home_score=1, away_score=0, finalized_at=$2, finalized_by_person_id=$3 where id=$1`,
    [recordId, now, contexts.COACH!.personId],
  )
  await client.query(
    `insert into app.notifications(id,recipient_person_id,type,resource_type,resource_id,origin_event_id,title,body,occurred_at,audience_resolved_at,dedupe_key,created_at)
     values ($1,$2,'EVENT_CHANGED','EVENT',$3,$3,$4,'Privado',now(),now(),$5,now())`,
    [crypto.randomUUID(), contexts.PLAYER!.personId, eventId, title, `t06full-${Date.now()}`],
  )
  await client.end()
})

test.afterAll(async () => {
  const client = await openDb()
  await cleanupE2E(client)
  await client.end()
})

async function as(page: Page, role: string, path: string) {
  await setSessionCookie(page, contexts[role]!.token)
  await page.goto(path)
}

test('QA-01/QA-07 Home: cinco bloques para los cinco roles y multirol', async ({ page }) => {
  for (const role of ['COACH', 'PLAYER', 'CAPTAIN', 'SUBCOMMITTEE', 'ADMIN', 'MULTI']) {
    await as(page, role, '/home')
    await expect(page.getByRole('heading', { name: 'Necesita tu atención' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Hoy', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: '¿Vas?' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Próximamente' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Comunicaciones' })).toBeVisible()
  }
})

test('QA-02 People/Club Structure: listas y detalle reales', async ({ page }) => {
  await as(page, 'COACH', '/teams')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.goto(`/teams/${structure.teamAId}`)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.goto(`/people/${contexts.PLAYER!.personId}`)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('QA-03/QA-04/QA-05 Events, Availability, Selection, Attendance, Match', async ({ page }) => {
  await as(page, 'COACH', '/calendar')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  for (const suffix of ['', '/availability', '/selection', '/attendance', '/match-record']) {
    await page.goto(`/events/${eventId}${suffix}`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(await page.locator('body').innerText()).not.toMatch(/500|Internal Server Error/)
  }
})

test('QA-06 Communications: hub, conversaciones y notificaciones', async ({ page }) => {
  await as(page, 'PLAYER', '/communication')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.goto('/notifications')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('QA-08 Attention: acciones reales y límite de tres', async ({ page }) => {
  await as(page, 'COACH', '/home')
  const items = page.locator('ul[aria-label="Pendientes"] > li')
  expect(await items.count()).toBeLessThanOrEqual(3)
  if (await items.count() > 0) {
    const link = items.first().locator('a')
    if (await link.count() > 0) expect(await link.first().getAttribute('href')).toMatch(/^\//)
  }
})

test('QA-09 Search: búsqueda real con filtro y resultado', async ({ page }) => {
  await as(page, 'COACH', `/search?q=${encodeURIComponent(title)}`)
  await expect(page.getByText(title).first()).toBeVisible({ timeout: 10000 })
  await page.getByRole('button', { name: 'Equipos' }).click()
  await expect(page.getByRole('heading', { name: 'Buscar' })).toBeVisible()
})

test('QA-10/QA-11 Reports: fórmula y distinción de breakdown', async ({ page }) => {
  await as(page, 'COACH', '/reports/attendance')
  await expect(page.getByText('100 × PRESENT / (PRESENT + ABSENT + JUSTIFIED)').first()).toBeVisible()
  await page.goto('/reports/performance')
  await expect(page.getByRole('heading', { name: 'Rendimiento' })).toBeVisible()
  await expect(page.getByText(/Cuenta como jugado/).first()).toBeVisible({ timeout: 10000 })
})

test('QA-12 Cross-session: dos identidades sin fuga de caché', async ({ page, browser }) => {
  await as(page, 'COACH', '/home')
  await expect(page.getByText('Cargando…')).toHaveCount(0)
  const coachText = await page.locator('body').innerText()
  const other = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const otherPage = await other.newPage()
  await setSessionCookie(otherPage, contexts.ADMIN!.token)
  await otherPage.goto('/home')
  await expect(otherPage.getByText('Cargando…')).toHaveCount(0)
  const adminText = await otherPage.locator('body').innerText()
  expect(coachText).not.toBe(adminText)
  const forbidden = await apiRequest(otherPage, 'GET', '/api/reports/attendance')
  expect(forbidden.status).toBe(403)
  await other.close()
})

test('QA-13 Navigation: Back/Forward, reload y deep link denegado', async ({ page }) => {
  await as(page, 'COACH', '/home')
  await expect(page.getByRole('heading', { name: 'Necesita tu atención' })).toBeVisible()
  await page.goto('/search?q=a')
  await expect(page.getByRole('heading', { name: 'Buscar' })).toBeVisible()
  await expect(page).toHaveURL(/q=a/)
  await page.goBack()
  await expect(page).toHaveURL(/\/home$/)
  await page.goForward()
  await expect(page).toHaveURL(/q=a/)
  await page.reload()
  await expect(page).toHaveURL(/q=a/)
  await setSessionCookie(page, contexts.ADMIN!.token)
  await page.goto('/reports/attendance')
  await expect(page.getByText('Sin acceso a informes')).toBeVisible()
})

test('QA-14 Responsive 500/768/1440', async ({ page }) => {
  for (const width of [500, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const path of ['/home', '/reports/attendance', '/search?q=a']) {
      await as(page, 'COACH', path)
      const overflow = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, viewport: window.innerWidth }))
      expect(overflow.doc, `${path} @${width}`).toBeLessThanOrEqual(overflow.viewport + 1)
    }
  }
})
