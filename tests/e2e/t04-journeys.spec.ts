import { test, expect, type Page } from '@playwright/test'
import pg from 'pg'
import argon2 from 'argon2'
import crypto from 'crypto'

/**
 * T04 R3 — recorridos de navegador reales (J01..J04).
 *
 * No son "llamadas API dentro de Playwright": cada recorrido abre la aplicación,
 * inicia sesión con usuarios reales de prueba, navega por la interfaz y acciona
 * controles reales. El backend y la base son los reales (Supabase local).
 *
 * Las semillas (estructura del club, personas, cuentas, eventos) se crean por SQL
 * porque son preparación de datos, no parte del recorrido de usuario.
 */

const DATABASE_URL = 'postgresql://postgres:postgres@127.0.0.1:56322/postgres'
const PASSWORD = 'GeiDemo2026!Demo'
const TAG = `t04-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
/** Evidencia visual fuera del código de producto. */
const EVIDENCE_DIR = process.env.GEI_EVIDENCE_DIR ?? 'C:/Users/thega/Desktop/GEI_T04_R3_BUILD_OUTPUT/evidence/c-ui/screenshots'

interface Seed {
  teamAId: string
  teamBId: string
  coach: { email: string }
  captain: { email: string }
  player: { email: string; personId: string }
  player2: { email: string; personId: string }
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
  const lineBId = crypto.randomUUID()
  const teamAId = crypto.randomUUID()
  const teamBId = crypto.randomUUID()

  await client.query(`insert into app.seasons(id, name, starts_on, ends_on, version, created_at, updated_at)
    values ($1,$2,'2026-01-01','2026-12-31',1,$3,$3)`, [seasonId, `Temporada ${TAG}`, now])
  await client.query(`insert into app.divisions(id, name, version, created_at, updated_at) values ($1,$2,1,$3,$3)`, [divisionId, `Div ${TAG}`, now])
  await client.query(`insert into app.lines(id, name, version, created_at, updated_at) values ($1,$2,1,$3,$3), ($4,$5,1,$3,$3)`, [lineId, `Line ${TAG}`, now, lineBId, `Line B ${TAG}`])
  await client.query(`insert into app.teams(id, season_id, division_id, line_id, state, version, created_at, updated_at)
    values ($1,$2,$3,$4,'ACTIVE',1,$5,$5), ($6,$2,$3,$7,'ACTIVE',1,$5,$5)`, [teamAId, seasonId, divisionId, lineId, now, teamBId, lineBId])

  async function addPerson(first: string, role: string, scopeType: string, scopeRefId: string | null, withTeam: boolean) {
    const personId = crypto.randomUUID()
    const email = `${first.toLowerCase()}-${personId.slice(0, 8)}@example.com`
    await client.query(`insert into app.people(id, first_name, last_name, dni, birth_date, phone, email, created_at, updated_at)
      values ($1,$2,$3,$4,'1990-01-01','11-5555-1000',$5,$6,$6)`, [personId, first, TAG, `${first}-${personId.slice(0, 12)}`, email, now])
    await client.query(`insert into app.accounts(id, person_id, username, password_hash, status, activated_at, credential_version, created_at, updated_at)
      values ($1,$2,$3,$4,'ACTIVE',$5,1,$5,$5)`, [crypto.randomUUID(), personId, email, hash, now])
    await client.query(`insert into app.memberships(id, person_id, valid_from, valid_until, created_at) values ($1,$2,$3,null,$4)`, [crypto.randomUUID(), personId, new Date('2026-01-01'), now])
    await client.query(`insert into app.role_assignments(id, person_id, role, scope_type, scope_ref_id, valid_from, valid_until, temporal_exclusions, created_at)
      values ($1,$2,$3,$4,$5,$6,null,'[]'::jsonb,$7)`, [crypto.randomUUID(), personId, role, scopeType, scopeRefId, new Date('2026-01-01'), now])
    if (withTeam) {
      await client.query(`insert into app.team_assignments(id, person_id, team_id, valid_from, valid_until, created_at)
        values ($1,$2,$3,'2026-01-01',null,$4)`, [crypto.randomUUID(), personId, teamAId, now])
    }
    return { email, personId }
  }

  const coach = await addPerson('Coach', 'COACH', 'TEAM', teamAId, false)
  const captain = await addPerson('Captain', 'CAPTAIN', 'TEAM', teamAId, false)
  const player = await addPerson('Player', 'PLAYER', 'TEAM', teamAId, true)
  const player2 = await addPerson('Player2', 'PLAYER', 'TEAM', teamAId, true)

  async function addEvent(type: 'TRAINING' | 'MATCH', title: string, opponent: string | null) {
    const id = crypto.randomUUID()
    const start = new Date(Date.now() + 7 * 86_400_000)
    await client.query(`insert into app.events(id, type, title, start_at, end_at, time_zone, state, club_wide_target,
      coordination_revision, creator_person_id, version, opponent, created_at, updated_at)
      values ($1,$2,$3,$4,null,'America/Argentina/Buenos_Aires','SCHEDULED',false,0,$5,1,$6,$7,$7)`,
      [id, type, title, start, coach.personId, opponent, now])
    await client.query(`insert into app.event_target_team(id, event_id, team_id, added_at, added_by_person_id)
      values ($1,$2,$3,$4,$5)`, [crypto.randomUUID(), id, teamAId, now, coach.personId])
    return id
  }

  const trainingId = await addEvent('TRAINING', `Entrenamiento ${TAG}`, null)
  const matchId = await addEvent('MATCH', `Partido ${TAG}`, 'Rivales')

  await client.end()
  return { teamAId, teamBId, coach, captain, player, player2, trainingId, matchId }
}

async function login(page: Page, email: string) {
  await page.goto('/login')
  await page.getByLabel('Correo electrónico').fill(email)
  await page.getByLabel('Contraseña').fill(PASSWORD)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await page.waitForURL('**/home')
}

let fx: Seed

test.beforeAll(async () => {
  fx = await seed()
})

test.describe('J01 — PLAYER: disponibilidad, cambio material y reconfirmación', () => {
  test('el jugador responde, ve la confirmación, el evento cambia y reconfirma', async ({ browser }) => {
    const playerContext = await browser.newContext()
    const playerPage = await playerContext.newPage()
    await login(playerPage, fx.player.email)

    await playerPage.goto(`/events/${fx.trainingId}/availability`)
    await expect(playerPage.getByTestId('availability-self')).toBeVisible()
    await playerPage.getByTestId('availability-response-yes').click()
    await expect(playerPage.getByTestId('availability-success')).toBeVisible()
    await expect(playerPage.getByTestId('availability-current')).toContainText('Voy')
    await playerPage.screenshot({ path: `${EVIDENCE_DIR}/J01-availability-respuesta.png`, fullPage: true })

    // Cambio material del evento, hecho por el entrenador desde la interfaz.
    const coachContext = await browser.newContext()
    const coachPage = await coachContext.newPage()
    await login(coachPage, fx.coach.email)
    await coachPage.goto(`/events/${fx.trainingId}/edit`)
    await coachPage.locator('#field-time').fill('19:30')
    await coachPage.getByRole('button', { name: 'Guardar cambios' }).click()
    await coachPage.waitForURL(`**/events/${fx.trainingId}`)

    await playerPage.reload()
    await expect(playerPage.getByTestId('availability-reconfirm')).toBeVisible()
    await playerPage.screenshot({ path: `${EVIDENCE_DIR}/J01-availability-reconfirmacion.png`, fullPage: true })
    await playerPage.getByTestId('availability-response-maybe').click()
    await expect(playerPage.getByTestId('availability-success')).toBeVisible()
    await expect(playerPage.getByTestId('availability-current')).toContainText('Tal vez')

    await playerContext.close()
    await coachContext.close()
  })
})

test.describe('J02 — COACH + PLAYER: convocatoria, autosave, publicación e historial', () => {
  test('el entrenador arma el borrador, publica y el jugador ve sólo su estado', async ({ browser }) => {
    const coachContext = await browser.newContext()
    const coachPage = await coachContext.newPage()
    await login(coachPage, fx.coach.email)
    await coachPage.goto(`/events/${fx.matchId}/selection`)

    await expect(coachPage.getByTestId('selection-draft')).toBeVisible()
    await coachPage.getByTestId(`selection-role-${fx.player.personId}-SELECTED`).click()
    await expect(coachPage.getByTestId('selection-autosave')).toContainText('Guardado', { timeout: 10_000 })

    await coachPage.getByTestId('selection-publish').click()
    await expect(coachPage.getByTestId('selection-published')).toBeVisible()
    await coachPage.screenshot({ path: `${EVIDENCE_DIR}/J02-selection-publicada.png`, fullPage: true })

    await coachPage.reload()
    await expect(coachPage.getByTestId('selection-history')).toContainText('1 personas')

    const playerContext = await browser.newContext()
    const playerPage = await playerContext.newPage()
    await login(playerPage, fx.player.email)
    await playerPage.goto(`/events/${fx.matchId}/selection`)
    await expect(playerPage.getByTestId('selection-player-status')).toContainText('Convocado')
    await expect(playerPage.getByTestId('selection-player-status')).not.toContainText('Borrador')
    await playerPage.screenshot({ path: `${EVIDENCE_DIR}/J02-selection-estado-jugador.png`, fullPage: true })

    await playerContext.close()
    await coachContext.close()
  })
})

test.describe('J03 — COACH: asistencia, UNRECORDED, cierre y corrección motivada', () => {
  test('registra, distingue lo no registrado, cierra y corrige con motivo', async ({ browser }) => {
    const coachContext = await browser.newContext()
    const coachPage = await coachContext.newPage()
    await login(coachPage, fx.coach.email)
    await coachPage.goto(`/events/${fx.trainingId}/attendance`)

    await expect(coachPage.getByTestId(`attendance-row-${fx.player2.personId}`)).toContainText('Sin registrar')
    await coachPage.getByTestId(`attendance-mark-${fx.player.personId}-present`).click()
    await expect(coachPage.getByTestId('attendance-success')).toBeVisible()
    await expect(coachPage.getByTestId(`attendance-row-${fx.player.personId}`)).toContainText('Presente')

    await coachPage.getByTestId('attendance-close').click()
    await expect(coachPage.getByTestId('attendance-closed')).toBeVisible()

    await coachPage.getByTestId(`attendance-correct-${fx.player2.personId}`).click()
    await coachPage.getByTestId('attendance-reason').fill('Justificado por informe médico')
    await coachPage.screenshot({ path: `${EVIDENCE_DIR}/J03-asistencia-correccion.png`, fullPage: true })
    await coachPage.getByTestId('attendance-correct-submit').click()
    await expect(coachPage.getByTestId('attendance-history')).toContainText('Justificado por informe médico')
    await coachPage.screenshot({ path: `${EVIDENCE_DIR}/J03-asistencia-historial.png`, fullPage: true })

    await coachContext.close()
  })
})

test.describe('J04 — COACH: acta del partido, estadísticas, finalización y corrección', () => {
  test('inicia el partido, carga estadísticas, finaliza y corrige oficialmente', async ({ browser }) => {
    const coachContext = await browser.newContext()
    const coachPage = await coachContext.newPage()
    await login(coachPage, fx.coach.email)
    await coachPage.goto(`/events/${fx.matchId}/match-record`)

    await coachPage.getByTestId('match-record-create').click()
    await expect(coachPage.getByTestId('match-record-summary')).toBeVisible()

    await coachPage.getByTestId('match-record-start').click()
    await expect(coachPage.getByTestId('match-record-gate')).toHaveCount(0)

    await coachPage.getByTestId(`match-record-stat-${fx.player.personId}-goals`).fill('2')
    await coachPage.getByTestId(`match-record-stats-save-${fx.player.personId}`).click()
    await expect(coachPage.getByTestId('match-record-success')).toBeVisible()

    await coachPage.getByTestId('match-record-finalize').click()
    await coachPage.getByTestId('match-record-home-score').fill('3')
    await coachPage.getByTestId('match-record-away-score').fill('1')
    await coachPage.getByTestId('match-record-finalize-submit').click()
    await expect(coachPage.getByTestId('match-record-success')).toBeVisible()
    await expect(coachPage.getByTestId('match-record-summary')).toContainText('Jugado')

    await coachPage.getByTestId('match-record-correct').click()
    await coachPage.getByTestId('match-record-reason').fill('Gol mal computado')
    await coachPage.getByTestId('match-record-correct-submit').click()
    await expect(coachPage.getByTestId('match-record-history')).toContainText('Gol mal computado')
    await coachPage.screenshot({ path: `${EVIDENCE_DIR}/J04-match-record-corregido.png`, fullPage: true })

    await coachContext.close()
  })
})

test.describe('J05 — negativo: un actor sin autoridad de COACH no puede operar', () => {
  test('el capitán no crea el acta y el backend lo deniega', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    await login(page, fx.captain.email)
    await page.goto(`/events/${fx.matchId}/match-record`)
    await expect(page.getByTestId('match-record-create')).toHaveCount(0)

    const me = await (await page.request.get('/api/me')).json()
    const response = await page.request.post(`/api/events/${fx.matchId}/match-record`, {
      headers: { origin: 'http://localhost:8444', 'x-gei-csrf': me.csrfToken, 'content-type': 'application/json' },
      data: {},
    })
    expect(response.status()).toBe(403)
    const body = await response.json()
    expect(body.error.code).toBe('AUTHORITY_DENIED')

    await context.close()
  })
})
