import pg from "pg"
import argon2 from "argon2"
import crypto from "node:crypto"

/**
 * Semilla de la suite de aceptación real de navegador (T03) y de los recorridos T04.
 *
 * Crea el club mínimo (temporada, divisiones, líneas, equipos, sede, competencia) y las
 * personas reales que usan tests/e2e/real-acceptance.spec.ts. Es idempotente: se puede
 * volver a ejecutar después de un `pnpm db:reset` para restaurar el entorno local.
 *
 * Nota de aislamiento: toda la semilla usa una fecha de creación antigua a propósito,
 * porque el cleanup de la suite E2E de T03 borra personas, cuentas y asignaciones
 * creados en las últimas dos horas.
 *
 * Uso: node scripts/e2e-seed-real-users.mjs
 */
const adminUrl = "postgresql://postgres:postgres@127.0.0.1:56322/postgres"
const PASSWORD = "TestPass123!"
const SUFFIX = "REAL-eco1uz"
const seedDate = new Date("2026-01-05T12:00:00.000Z")

const USERS = [
  { email: `real-COACH-REAL-eco1uz@example.com`, first: "Real", last: "Coach", role: "COACH", scope: "TEAM" },
  { email: `real-SUBCOMMITTEE-REAL-eco1uz@example.com`, first: "Real", last: "Subcomision", role: "SUBCOMMITTEE", scope: "CLUB" },
  { email: `real-CAPTAIN-REAL-eco1uz@example.com`, first: "Real", last: "Captain", role: "CAPTAIN", scope: "TEAM" },
  { email: `real-PLAYER-REAL-eco1uz@example.com`, first: "Real", last: "Player", role: "PLAYER", scope: "TEAM" },
]

const client = new pg.Client({ connectionString: adminUrl, application_name: "gei-e2e-real-users" })
await client.connect()

/** Busca por nombre (clave natural) y, si no existe, inserta. */
async function ensureByName(table, name, columns) {
  const { rows } = await client.query(`select id from ${table} where lower(trim(name)) = lower(trim($1)) limit 1`, [name])
  if (rows[0]) return rows[0].id
  const names = Object.keys(columns)
  const placeholders = names.map((_, index) => `$${index + 1}`)
  const inserted = await client.query(
    `insert into ${table} (${names.join(",")}) values (${placeholders.join(",")}) on conflict do nothing returning id`,
    names.map((key) => columns[key]),
  )
  if (inserted.rows[0]) return inserted.rows[0].id
  const again = await client.query(`select id from ${table} where lower(trim(name)) = lower(trim($1)) limit 1`, [name])
  return again.rows[0]?.id
}

const seasonId = await ensureByName("app.seasons", `Temporada ${SUFFIX}`, { id: crypto.randomUUID(), name: `Temporada ${SUFFIX}`, starts_on: "2026-01-01", ends_on: "2026-12-31", version: 1, created_at: seedDate, updated_at: seedDate })
const divisionA = await ensureByName("app.divisions", `Div A ${SUFFIX}`, { id: crypto.randomUUID(), name: `Div A ${SUFFIX}`, version: 1, created_at: seedDate, updated_at: seedDate })
const divisionB = await ensureByName("app.divisions", `Div B ${SUFFIX}`, { id: crypto.randomUUID(), name: `Div B ${SUFFIX}`, version: 1, created_at: seedDate, updated_at: seedDate })
const lineA = await ensureByName("app.lines", `Line A ${SUFFIX}`, { id: crypto.randomUUID(), name: `Line A ${SUFFIX}`, version: 1, created_at: seedDate, updated_at: seedDate })
const lineB = await ensureByName("app.lines", `Line B ${SUFFIX}`, { id: crypto.randomUUID(), name: `Line B ${SUFFIX}`, version: 1, created_at: seedDate, updated_at: seedDate })

async function ensureTeam(divisionId, lineId) {
  const { rows } = await client.query("select id from app.teams where season_id = $1 and division_id = $2 and line_id = $3 limit 1", [seasonId, divisionId, lineId])
  if (rows[0]) return rows[0].id
  const inserted = await client.query(
    "insert into app.teams(id, season_id, division_id, line_id, state, version, created_at, updated_at) values ($1,$2,$3,$4,'ACTIVE',1,$5,$5) returning id",
    [crypto.randomUUID(), seasonId, divisionId, lineId, seedDate],
  )
  return inserted.rows[0].id
}

const teamA = await ensureTeam(divisionA, lineA)
const teamB = await ensureTeam(divisionB, lineB)
const venueId = await ensureByName("app.venues", `Club ${SUFFIX}`, { id: crypto.randomUUID(), name: `Club ${SUFFIX}`, address: "Av. del Libertador 1234", version: 1, created_at: seedDate, updated_at: seedDate })
const competitionId = await ensureByName("app.competitions", `Copa ${SUFFIX}`, { id: crypto.randomUUID(), name: `Copa ${SUFFIX}`, season_id: seasonId, version: 1, created_at: seedDate, updated_at: seedDate })

const hash = await argon2.hash(PASSWORD, { type: argon2.argon2id })

for (const user of USERS) {
  const { rows } = await client.query("select id from app.people where email = $1 limit 1", [user.email])
  let personId = rows[0]?.id
  if (!personId) {
    personId = crypto.randomUUID()
    await client.query(
      "insert into app.people(id, first_name, last_name, dni, birth_date, phone, email, created_at, updated_at) values ($1,$2,$3,$4,'1990-01-01','11-5555-1000',$5,$6,$6)",
      [personId, user.first, user.last, `${user.role}-${personId.slice(0, 12)}`, user.email, seedDate],
    )
  }

  const account = await client.query("select id from app.accounts where person_id = $1 limit 1", [personId])
  if (!account.rows[0]) {
    await client.query(
      "insert into app.accounts(id, person_id, username, password_hash, status, activated_at, credential_version, created_at, updated_at) values ($1,$2,$3,$4,'ACTIVE',$5,1,$5,$5)",
      [crypto.randomUUID(), personId, user.email, hash, seedDate],
    )
  }

  const membership = await client.query("select id from app.memberships where person_id = $1 limit 1", [personId])
  if (!membership.rows[0]) {
    await client.query("insert into app.memberships(id, person_id, valid_from, valid_until, created_at) values ($1,$2,'2026-01-01',null,$3)", [crypto.randomUUID(), personId, seedDate])
  }

  const role = await client.query("select id from app.role_assignments where person_id = $1 and role = $2 limit 1", [personId, user.role])
  if (!role.rows[0]) {
    await client.query(
      "insert into app.role_assignments(id, person_id, role, scope_type, scope_ref_id, valid_from, valid_until, temporal_exclusions, created_at) values ($1,$2,$3,$4,$5,'2026-01-01',null,'[]'::jsonb,$6)",
      [crypto.randomUUID(), personId, user.role, user.scope, user.scope === "TEAM" ? teamA : null, seedDate],
    )
  }

  if (user.scope === "TEAM") {
    const assignment = await client.query("select id from app.team_assignments where person_id = $1 and team_id = $2 limit 1", [personId, teamA])
    if (!assignment.rows[0]) {
      await client.query("insert into app.team_assignments(id, person_id, team_id, valid_from, valid_until, created_at) values ($1,$2,$3,'2026-01-01',null,$4)", [crypto.randomUUID(), personId, teamA, seedDate])
    }
  }
}

await client.end()
console.log(`Semilla real lista: ${USERS.map((user) => user.email).join(", ")}`)
console.log(`Equipo A ${teamA} · Equipo B ${teamB} · Sede ${venueId} · Competencia ${competitionId}`)
