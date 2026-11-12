import pg from "pg"
import { readdirSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import argon2 from "argon2"

const adminUrl = "postgresql://postgres:postgres@127.0.0.1:56322/postgres"
const e2eUrl = "postgresql://postgres:postgres@127.0.0.1:56322/gei_e2e"
const config = readFileSync(resolve("supabase", "config.toml"), "utf8")
if (!config.includes('project_id = "gei-hockey-management-t01"') || !config.includes("port = 56322")) {
  throw new Error("Refusing E2E reset: GEI local project identity/port is not the frozen target")
}

// 1) recreate gei_e2e from scratch
const adminClient = new pg.Client({ connectionString: adminUrl, application_name: "gei-e2e-bootstrap" })
await adminClient.connect()
await adminClient.query("select pg_terminate_backend(pid) from pg_stat_activity where datname='gei_e2e' and pid <> pg_backend_pid()")
await adminClient.query("drop database if exists gei_e2e")
await adminClient.query("create database gei_e2e template template0 encoding 'UTF8'")
await adminClient.end()

// 2) run migrations in order
const test = new pg.Client({ connectionString: e2eUrl, application_name: "gei-e2e-migrations" })
await test.connect()
const migrations = readdirSync(resolve("supabase", "migrations")).filter((f) => /^\d+_.+\.sql$/.test(f)).sort()
for (const migration of migrations) {
  await test.query(readFileSync(resolve("supabase", "migrations", migration), "utf8"))
}
console.log(`applied ${migrations.length} migrations to gei_e2e`)

// 3) seed fixtures with a real argon2 password
const FLOOR = { memoryCost: 19 * 1024, timeCost: 2, parallelism: 1 }
const hashPassword = (pw) => argon2.hash(pw, { type: argon2.argon2id, ...FLOOR })
const passwordHash = await hashPassword("GeiDemo2026!Demo")

const q = (text, params = []) => test.query(text, params)
const now = new Date()
const iso = (daysOffset = 0) => {
  const d = new Date(now.getTime() + daysOffset * 86_400_000)
  return d.toISOString()
}
const today = now.toISOString().slice(0, 10)
const futureDate = (days) => {
  const d = new Date(now.getTime() + days * 86_400_000)
  return d.toISOString().slice(0, 10)
}

// season/structure
const season = (await q("insert into app.seasons(name, starts_on, ends_on) values ('Temporada 2026', '2026-01-01', '2026-12-31') returning id")).rows[0].id
const division = (await q("insert into app.divisions(name) values ('Sexta') returning id")).rows[0].id
const divisionP = (await q("insert into app.divisions(name) values ('Primera') returning id")).rows[0].id
const lineA = (await q("insert into app.lines(name) values ('A') returning id")).rows[0].id
const lineB = (await q("insert into app.lines(name) values ('B') returning id")).rows[0].id
const teamA = (await q("insert into app.teams(season_id, division_id, line_id, state) values ($1, $2, $3, 'ACTIVE') returning id", [season, division, lineA])).rows[0].id
const teamB = (await q("insert into app.teams(season_id, division_id, line_id, state) values ($1, $2, $3, 'ACTIVE') returning id", [season, division, lineB])).rows[0].id
const teamP = (await q("insert into app.teams(season_id, division_id, line_id, state) values ($1, $2, $3, 'ACTIVE') returning id", [season, divisionP, lineA])).rows[0].id
const venue = (await q("insert into app.venues(name, address) values ('Club GEI', 'Av. del Libertador 1234, Buenos Aires') returning id")).rows[0].id
const competition = (await q("insert into app.competitions(season_id, name) values ($1, 'Copa GEI 2026') returning id", [season])).rows[0].id

// people + accounts
async function addPerson(firstName, lastName, email, dni) {
  const person = (await q("insert into app.people(first_name, last_name, email, dni, birth_date, phone) values ($1, $2, $3, $4, '1995-05-10', '11-5555-1000') returning id", [firstName, lastName, email, dni])).rows[0].id
  const account = (await q("insert into app.accounts(person_id, username, password_hash, status, activated_at, credential_version) values ($1, $2, $3, 'ACTIVE', now(), 1) returning id", [person, email.split("@")[0], passwordHash])).rows[0].id
  await q("insert into app.memberships(person_id, valid_from) values ($1, $2)", [person, iso(-100)])
  return { person, account }
}

const admin = await addPerson("Ada", "Admin", "admin@example.com", "E2E-ADMIN-001")
const sub = await addPerson("Sara", "Subcomisión", "subcommittee@example.com", "E2E-SUB-001")
const coach = await addPerson("Elina", "Coach", "coach@example.com", "E2E-COACH-001")
const captain = await addPerson("Carla", "Captain", "captain@example.com", "E2E-CAPT-001")
const player = await addPerson("Paula", "Player", "player@example.com", "E2E-PLAYER-001")
const player2 = await addPerson("Pilar", "Player", "player2@example.com", "E2E-PLAYER-002")

// role assignments
await q("insert into app.role_assignments(person_id, role, scope_type, scope_ref_id, valid_from) values ($1, 'ADMIN', 'CLUB', null, $2)", [admin.person, iso(-100)])
await q("insert into app.role_assignments(person_id, role, scope_type, scope_ref_id, valid_from) values ($1, 'SUBCOMMITTEE', 'CLUB', null, $2)", [sub.person, iso(-100)])
await q("insert into app.role_assignments(person_id, role, scope_type, scope_ref_id, valid_from) values ($1, 'COACH', 'TEAM', $2, $3)", [coach.person, teamA, iso(-100)])
await q("insert into app.role_assignments(person_id, role, scope_type, scope_ref_id, valid_from) values ($1, 'CAPTAIN', 'TEAM', $2, $3)", [captain.person, teamA, iso(-100)])

// team assignments
await q("insert into app.team_assignments(person_id, team_id, valid_from) values ($1, $2, $3)", [player.person, teamA, iso(-100).slice(0, 10)])
await q("insert into app.team_assignments(person_id, team_id, valid_from) values ($1, $2, $3)", [player2.person, teamA, iso(-100).slice(0, 10)])
await q("insert into app.team_assignments(person_id, team_id, valid_from) values ($1, $2, $3)", [captain.person, teamA, iso(-100).slice(0, 10)])

console.log("gei_e2e seeded:")
console.log("  users: admin@example.com / subcommittee@example.com / coach@example.com / captain@example.com / player@example.com (password: GeiDemo2026!Demo)")
console.log("  teams:", { teamA, teamB, teamP })
console.log("  ids:", { season, division, lineA, lineB, teamA, teamB, teamP, venue, competition })

await test.end()
