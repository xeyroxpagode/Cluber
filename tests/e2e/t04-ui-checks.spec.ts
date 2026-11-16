import { test, expect, type Page } from '@playwright/test'
import pg from 'pg'
import argon2 from 'argon2'
import crypto from 'crypto'

/**
 * T04 R3 — verificaciones de interfaz: responsive (ST-52), accesibilidad básica y
 * veracidad del autosave frente a pérdida de red (ST-53).
 *
 * Recorridos reales de navegador contra el backend real.
 */

const DATABASE_URL = 'postgresql://postgres:postgres@127.0.0.1:56322/postgres'
const PASSWORD = 'GeiDemo2026!Demo'
const TAG = `t04ui-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

interface Seed {
  coach: { email: string }
  player: { email: string; personId: string }
  trainingId: string
  matchId: string
}

async function seed(): Promise<Seed> {
  const client = new pg.Client({ connectionString: DATABASE_URL })
  await client.connect()
  const now = new Date()
  const hash = await argon2.hash(PASSWORD, { type: argon2.argon2id })
  const seasonId = crypto.randomUUID()
  const divisionId = crypto.randomUUID()
  const lineId = crypto.randomUUID()
  const teamId = crypto.randomUUID()
  await client.query(`insert into app.seasons(id, name, starts_on, ends_on, version, created_at, updated_at) values ($1,$2,'2026-01-01','2026-12-31',1,$3,$3)`, [seasonId, `Temporada ${TAG}`, now])
  await client.query(`insert into app.divisions(id, name, version, created_at, updated_at) values ($1,$2,1,$3,$3)`, [divisionId, `Div ${TAG}`, now])
  await client.query(`insert into app.lines(id, name, version, created_at, updated_at) values ($1,$2,1,$3,$3)`, [lineId, `Line ${TAG}`, now])
  await client.query(`insert into app.teams(id, season_id, division_id, line_id, state, version, created_at, updated_at) values ($1,$2,$3,$4,'ACTIVE',1,$5,$5)`, [teamId, seasonId, divisionId, lineId, now])

  async function addPerson(first: string, role: string, withTeam: boolean) {
    const personId = crypto.randomUUID()
    const email = `${first.toLowerCase()}-${personId.slice(0, 8)}@example.com`
    await client.query(`insert into app.people(id, first_name, last_name, dni, birth_date, phone, email, created_at, updated_at)
      values ($1,$2,$3,$4,'1990-01-01','11-5555-1000',$5,$6,$6)`, [personId, first, TAG, `${first}-${personId.slice(0, 12)}`, email, now])
    await client.query(`insert into app.accounts(id, person_id, username, password_hash, status, activated_at, credential_version, created_at, updated_at)
      values ($1,$2,$3,$4,'ACTIVE',$5,1,$5,$5)`, [crypto.randomUUID(), personId, email, hash, now])
    await client.query(`insert into app.memberships(id, person_id, valid_from, valid_until, created_at) values ($1,$2,$3,null,$4)`, [crypto.randomUUID(), personId, new Date('2026-01-01'), now])
    await client.query(`insert into app.role_assignments(id, person_id, role, scope_type, scope_ref_id, valid_from, valid_until, temporal_exclusions, created_at)
      values ($1,$2,$3,'TEAM',$4,$5,null,'[]'::jsonb,$6)`, [crypto.randomUUID(), personId, role, teamId, new Date('2026-01-01'), now])
    if (withTeam) {
      await client.query(`insert into app.team_assignments(id, person_id, team_id, valid_from, valid_until, created_at) values ($1,$2,$3,'2026-01-01',null,$4)`, [crypto.randomUUID(), personId, teamId, now])
    }
    return { email, personId }
  }

  const coach = await addPerson('Coach', 'COACH', false)
  const player = await addPerson('Player', 'PLAYER', true)

  async function addEvent(type: 'TRAINING' | 'MATCH', title: string, opponent: string | null) {
    const id = crypto.randomUUID()
    const start = new Date(Date.now() + 7 * 86_400_000)
    await client.query(`insert into app.events(id, type, title, start_at, end_at, time_zone, state, club_wide_target,
      coordination_revision, creator_person_id, version, opponent, created_at, updated_at)
      values ($1,$2,$3,$4,null,'America/Argentina/Buenos_Aires','SCHEDULED',false,0,$5,1,$6,$7,$7)`,
      [id, type, title, start, coach.personId, opponent, now])
    await client.query(`insert into app.event_target_team(id, event_id, team_id, added_at, added_by_person_id) values ($1,$2,$3,$4,$5)`, [crypto.randomUUID(), id, teamId, now, coach.personId])
    return id
  }

  const trainingId = await addEvent('TRAINING', `Entrenamiento ${TAG}`, null)
  const matchId = await addEvent('MATCH', `Partido ${TAG}`, 'Rivales')
  await client.end()
  return { coach, player, trainingId, matchId }
}

async function login(page: Page, email: string) {
  await page.goto('/login')
  await page.getByLabel('Correo electrónico').fill(email)
  await page.getByLabel('Contraseña').fill(PASSWORD)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await page.waitForURL('**/home')
}

let fx: Seed
test.beforeAll(async () => { fx = await seed() })

test.describe('ST-52 — responsive y accesibilidad de R15..R18', () => {
  for (const viewport of [
    { name: '390px', width: 390, height: 844 },
    { name: '768px', width: 768, height: 1024 },
    { name: '1440px', width: 1440, height: 900 },
  ]) {
    test(`las cuatro superficies son operables en ${viewport.name}`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } })
      const page = await context.newPage()
      await login(page, fx.coach.email)

      const surfaces: Array<[string, string]> = [
        ['disponibilidad', fx.trainingId],
        ['convocatoria', fx.matchId],
        ['asistencia', fx.trainingId],
        ['resultado', fx.matchId],
      ]

      for (const [surface, eventId] of surfaces) {
        await page.goto(`/events/${eventId}/${surface === 'disponibilidad' ? 'availability' : surface === 'convocatoria' ? 'selection' : surface === 'asistencia' ? 'attendance' : 'match-record'}`)
        await page.waitForLoadState('networkidle')
        const heading = page.locator('main h1')
        await expect(heading).toBeVisible()

        // Los controles interactivos del viewport deben ser alcanzables y pulsables.
        const buttons = page.locator('main button:visible')
        const total = await buttons.count()
        expect(total).toBeGreaterThan(0)
        for (let index = 0; index < Math.min(total, 8); index += 1) {
          const button = buttons.nth(index)
          await expect(button).toBeVisible()
          const box = await button.boundingBox()
          expect(box, `control sin caja en ${viewport.name}`).not.toBeNull()
          expect(box!.width).toBeGreaterThanOrEqual(24)
          expect(box!.height).toBeGreaterThanOrEqual(24)
          await expect(button).toBeInViewport()
        }

        // Sin desbordamiento horizontal ni elementos tapados por overlays.
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
        expect(overflow, `desbordamiento horizontal en ${viewport.name}`).toBeLessThanOrEqual(1)
      }

      await context.close()
    })
  }
})

test.describe('ST-53 — pérdida de red durante el autosave', () => {
  test('el indicador de guardado no miente cuando la petición falla', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    await login(page, fx.coach.email)

    // Se corta la red sólo para el guardado del borrador.
    await page.route('**/api/events/*/selection/draft', (route) => route.abort('failed'))
    await page.goto(`/events/${fx.matchId}/selection`)
    await page.waitForLoadState('networkidle')

    await page.getByTestId(`selection-role-${fx.player.personId}-SELECTED`).click()
    await expect(page.getByTestId('selection-autosave')).not.toContainText('Guardado', { timeout: 10_000 })
    await expect(page.getByTestId('selection-error')).toBeVisible()

    await context.close()
  })
})
