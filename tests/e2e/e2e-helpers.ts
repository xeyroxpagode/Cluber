import pg from 'pg'
import argon2 from 'argon2'
import crypto from 'crypto'

const DATABASE_URL = 'postgresql://postgres:postgres@127.0.0.1:56322/postgres'
const BASE = 'http://localhost:8444'
const CSRF_SECRET_B64 = 'woqnqR0kbMM4YdXiIdb3O1gJ8a6w4aQN8GWNzw2NSWM='
const CSRF_SECRET = Buffer.from(CSRF_SECRET_B64, 'base64')

export const TAG = `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export function tag(suffix: string): string {
  return `${TAG}-${suffix}`
}

export async function openDb(): Promise<pg.Client> {
  const client = new pg.Client({ connectionString: DATABASE_URL })
  await client.connect()
  return client
}

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password)
}

function hashSessionToken(rawToken: string): Buffer {
  return crypto.createHash('sha256').update(`gei-session:v1:${rawToken}`).digest()
}

function deriveCsrfToken(sessionId: string): string {
  return crypto.createHmac('sha256', CSRF_SECRET).update(`gei-csrf:v1:${sessionId}`, 'utf8').digest('base64url')
}

export interface UserFixture {
  personId: string
  accountId: string
  email: string
  password: string
  role: string
  scopeType: string
  scopeRefId: string | null
  teamId?: string
}

export interface SessionFixture {
  token: string
  sessionId: string
  personId: string
  accountId: string
  csrfToken: string
}

export async function createUserWithRole(
  client: pg.Client,
  role: string,
  scopeType: string,
  scopeRefId: string | null,
  teamId?: string,
): Promise<UserFixture> {
  const personId = crypto.randomUUID()
  const email = `e2e-${tag(role)}-${personId.slice(0, 6)}@example.com`
  const password = 'GeiDemo2026!Demo'
  const passwordHash = await hashPassword(password)
  const accountId = crypto.randomUUID()
  const username = email.split('@')[0]
  const now = new Date()

  await client.query(
    `insert into app.people(id, first_name, last_name, email, dni, birth_date, phone, created_at, updated_at)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9) on conflict (id) do nothing`,
    [personId, 'E2E', tag(role), email, `E${Date.now().toString().slice(-6)}${personId.slice(0, 2)}`, '1990-01-01', '12345678', now, now],
  )
  await client.query(
    `insert into app.accounts(id, person_id, username, password_hash, status, credential_version, activated_at, created_at, updated_at)
     values ($1,$2,$3,$4,'ACTIVE',1,$5,$6,$7)`,
    [accountId, personId, username, passwordHash, now, now, now],
  )
  await client.query(
    `insert into app.memberships(id, person_id, valid_from, valid_until, created_at)
     values ($1,$2,$3,null,$4) on conflict (id) do nothing`,
    [crypto.randomUUID(), personId, now, now],
  )
  await client.query(
    `insert into app.role_assignments(id, person_id, role, scope_type, scope_ref_id, valid_from, valid_until, temporal_exclusions, created_at)
     values ($1,$2,$3,$4,$5,$6,null,'[]'::jsonb,$7) on conflict (id) do nothing`,
    [crypto.randomUUID(), personId, role, scopeType, scopeRefId, now, now],
  )
  if (teamId) {
    await client.query(
      `insert into app.team_assignments(id, person_id, team_id, valid_from, valid_until, created_at)
       values ($1,$2,$3,$4,null,$5) on conflict (id) do nothing`,
      [crypto.randomUUID(), personId, teamId, now, now],
    )
  }
  return { personId, accountId, email, password, role, scopeType, scopeRefId, teamId }
}

export async function createSession(client: pg.Client, accountId: string, personId: string): Promise<SessionFixture> {
  const account = await client.query('select credential_version from app.accounts where id = $1', [accountId])
  const credentialVersion = account.rows[0]?.credential_version ?? 1
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 8 * 60 * 60 * 1000)
  const sessionId = crypto.randomUUID()
  const token = crypto.randomBytes(32).toString('base64url')
  const tokenHash = hashSessionToken(token)
  const csrfToken = deriveCsrfToken(sessionId)

  await client.query(
    `insert into infra.auth_sessions(id, account_id, session_token_hash, credential_version, created_at, expires_at, revoked_at)
     values ($1,$2,$3,$4,$5,$6,null)`,
    [sessionId, accountId, tokenHash, credentialVersion, now, expiresAt],
  )

  return { token, sessionId, personId, accountId, csrfToken }
}

export async function setSessionCookie(page: Page, token: string) {
  await page.context().addCookies([{
    name: 'gei_session',
    value: token,
    url: 'http://localhost:8444',
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
  }])
}

export async function apiRequest(page: Page, method: string, url: string, body?: any, sessionId?: string): Promise<any> {
  const fullUrl = url.startsWith('http') ? url : BASE + url
  const cookies = await page.context().cookies()
  const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join('; ')
  const headers: Record<string, string> = { origin: BASE }
  const hasBody = body !== undefined && body !== null
  if (hasBody) headers['Content-Type'] = 'application/json'
  if (cookieHeader) headers['Cookie'] = cookieHeader
  if (sessionId && method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
    headers['x-gei-csrf'] = deriveCsrfToken(sessionId)
  }
  let res: any
  const m = method.toUpperCase()
  if (m === 'GET') {
    res = await page.request.get(fullUrl, { headers })
  } else if (m === 'POST') {
    res = await page.request.post(fullUrl, { headers, data: hasBody ? body : undefined })
  } else if (m === 'PATCH') {
    res = await page.request.patch(fullUrl, { headers, data: hasBody ? body : undefined })
  } else if (m === 'DELETE') {
    res = await page.request.delete(fullUrl, { headers })
  } else {
    res = await page.request.fetch(fullUrl, { method, headers, body: hasBody ? JSON.stringify(body) : undefined })
  }
  return { status: res.status(), body: await res.json() }
}

export interface StructureFixture {
  seasonId: string
  divisionId: string
  lineId: string
  teamAId: string
  teamBId: string
  venueId: string
  competitionId: string
}

async function getOrInsertSeason(client: pg.Client, id: string, name: string, now: Date): Promise<string> {
  const existing = await client.query('select id from app.seasons where name = $1', [name])
  if (existing.rows.length > 0) return existing.rows[0].id as string
  await client.query(
    `insert into app.seasons(id, name, starts_on, ends_on, version, created_at, updated_at)
     values ($1,$2,'2026-01-01','2026-12-31',1,$3,$3)`,
    [id, name, now],
  )
  return id
}

async function getOrInsertDivision(client: pg.Client, id: string, name: string, now: Date): Promise<string> {
  const existing = await client.query('select id from app.divisions where name = $1', [name])
  if (existing.rows.length > 0) return existing.rows[0].id as string
  await client.query(
    `insert into app.divisions(id, name, version, created_at, updated_at)
     values ($1,$2,1,$3,$3)`,
    [id, name, now],
  )
  return id
}

async function getOrInsertLine(client: pg.Client, id: string, name: string, now: Date): Promise<string> {
  const existing = await client.query('select id from app.lines where name = $1', [name])
  if (existing.rows.length > 0) return existing.rows[0].id as string
  await client.query(
    `insert into app.lines(id, name, version, created_at, updated_at)
     values ($1,$2,1,$3,$3)`,
    [id, name, now],
  )
  return id
}

async function getOrInsertTeam(client: pg.Client, id: string, seasonId: string, divisionId: string, lineId: string, now: Date): Promise<string> {
  const existing = await client.query(
    'select id from app.teams where season_id = $1 and division_id = $2 and line_id = $3 limit 1',
    [seasonId, divisionId, lineId],
  )
  if (existing.rows.length > 0) return existing.rows[0].id as string
  await client.query(
    `insert into app.teams(id, season_id, division_id, line_id, state, version, created_at, updated_at)
     values ($1,$2,$3,$4,'ACTIVE',1,$5,$5)`,
    [id, seasonId, divisionId, lineId, now],
  )
  return id
}

export async function createMinimalStructure(client: pg.Client): Promise<StructureFixture> {
  const now = new Date()
  const seasonId = await getOrInsertSeason(client, crypto.randomUUID(), `Temporada E2E ${TAG}`, now)
  const divisionId = await getOrInsertDivision(client, crypto.randomUUID(), `Div E2E ${TAG}`, now)
  const lineId = await getOrInsertLine(client, crypto.randomUUID(), `Line E2E ${TAG}`, now)
  const teamAId = await getOrInsertTeam(client, crypto.randomUUID(), seasonId, divisionId, lineId, now)
  const teamBId = await getOrInsertTeam(client, crypto.randomUUID(), seasonId, divisionId, lineId, now)
  const venueId = crypto.randomUUID()
  const competitionId = crypto.randomUUID()

  await client.query(
    `insert into app.venues(id, name, address, version, created_at, updated_at)
     values ($1,$2,$3,1,$4,$4) on conflict (id) do nothing`,
    [venueId, `Venue E2E ${TAG}`, 'Calle E2E 123', now],
  )
  await client.query(
    `insert into app.competitions(id, season_id, name, version, created_at, updated_at)
     values ($1,$2,$3,1,$4,$4) on conflict (id) do nothing`,
    [competitionId, seasonId, `Comp E2E ${TAG}`, now],
  )
  return { seasonId, divisionId, lineId, teamAId, teamBId, venueId, competitionId }
}

export async function safeQuery(client: pg.Client, text: string, params?: any[]): Promise<any> {
  try {
    return await client.query(text, params)
  } catch (e) {
    return { rows: [], rowCount: 0 }
  }
}

export async function cleanupE2E(client: pg.Client): Promise<void> {
  await safeQuery(client, `delete from app.notifications where dedupe_key like $1`, [`${TAG}%`])
  await safeQuery(client, `delete from infra.outbox_events where topic like $1`, [`${TAG}%`])
  await safeQuery(client, `delete from app.event_occurrence_overrides where created_at > now() - interval '2 hours'`)
  await safeQuery(client, `delete from app.event_logistics where created_at > now() - interval '2 hours'`)
  await safeQuery(client, `delete from app.event_target_person where created_at > now() - interval '2 hours'`)
  await safeQuery(client, `delete from app.event_target_team where created_at > now() - interval '2 hours'`)
  await safeQuery(client, `delete from app.events where created_at > now() - interval '2 hours'`)
  await safeQuery(client, `delete from app.event_series where created_at > now() - interval '2 hours'`)
  await safeQuery(client, `delete from app.jornada_matches where created_at > now() - interval '2 hours'`)
  await safeQuery(client, `delete from app.jornadas where created_at > now() - interval '2 hours'`)
  await safeQuery(client, `delete from app.competitions where name like $1`, [`Comp E2E ${TAG}%`])
  await safeQuery(client, `delete from app.venues where name like $1`, [`Venue E2E ${TAG}%`])
  await safeQuery(client, `delete from app.teams where state = 'ACTIVE' and created_at > now() - interval '2 hours'`)
  await safeQuery(client, `delete from app.lines where name like $1`, [`Line E2E ${TAG}%`])
  await safeQuery(client, `delete from app.divisions where name like $1`, [`Div E2E ${TAG}%`])
  await safeQuery(client, `delete from app.seasons where name like $1`, [`Temporada E2E ${TAG}%`])
  await safeQuery(client, `delete from app.team_assignments where created_at > now() - interval '2 hours'`)
  await safeQuery(client, `delete from app.role_assignments where created_at > now() - interval '2 hours'`)
  await safeQuery(client, `delete from app.memberships where created_at > now() - interval '2 hours'`)
  await safeQuery(client, `delete from app.accounts where created_at > now() - interval '2 hours' and username like $1`, [`e2e-${TAG}%`])
  await safeQuery(client, `delete from app.people where created_at > now() - interval '2 hours' and last_name like $1`, [`${TAG}%`])
  await safeQuery(client, `delete from infra.auth_sessions where created_at > now() - interval '2 hours'`)
}
