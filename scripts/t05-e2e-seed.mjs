import pg from "pg"
import argon2 from "argon2"
import crypto from "node:crypto"

/** Seed ficticio y aislado para los recorridos E2E T05 (gei_test). Idempotente. */
const URL = "postgresql://postgres:postgres@127.0.0.1:56322/gei_test"
const PASSWORD = "GeiDemo2026!Demo"
const TAG = "t05-e2e"
const now = new Date()
const client = new pg.Client({ connectionString: URL, application_name: "gei-t05-e2e-seed" })
await client.connect()

async function one(sql, values) {
  const r = await client.query(sql, values)
  return r.rows[0]
}
async function ensure(table, where, values) {
  const existing = await one(`select id from ${table} where ${where.where} limit 1`, where.values)
  if (existing) return existing.id
  return (await one(`insert into ${table} (${values.columns}) values (${values.placeholders}) returning id`, values.values)).id
}

const seasonId = await ensure("app.seasons", { where: "name = $1", values: [`Temporada ${TAG}`] }, {
  columns: "id,name,starts_on,ends_on,version,created_at,updated_at",
  placeholders: "$1,$2,$3,$4,1,$5,$5", values: [crypto.randomUUID(), `Temporada ${TAG}`, "2026-01-01", "2026-12-31", now],
})
const divisionId = await ensure("app.divisions", { where: "name = $1", values: [`Div ${TAG}`] }, {
  columns: "id,name,version,created_at,updated_at", placeholders: "$1,$2,1,$3,$3",
  values: [crypto.randomUUID(), `Div ${TAG}`, now],
})
const lineAId = await ensure("app.lines", { where: "name = $1", values: [`Line A ${TAG}`] }, {
  columns: "id,name,version,created_at,updated_at", placeholders: "$1,$2,1,$3,$3",
  values: [crypto.randomUUID(), `Line A ${TAG}`, now],
})
const lineBId = await ensure("app.lines", { where: "name = $1", values: [`Line B ${TAG}`] }, {
  columns: "id,name,version,created_at,updated_at", placeholders: "$1,$2,1,$3,$3",
  values: [crypto.randomUUID(), `Line B ${TAG}`, now],
})
async function ensureTeam(lineId, name) {
  return ensure("app.teams", { where: "season_id = $1 and division_id = $2 and line_id = $3", values: [seasonId, divisionId, lineId] }, {
    columns: "id,season_id,division_id,line_id,state,version,created_at,updated_at",
    placeholders: "$1,$2,$3,$4,'ACTIVE',1,$5,$5", values: [crypto.randomUUID(), seasonId, divisionId, lineId, now],
  })
}
const teamAId = await ensureTeam(lineAId, "A")
const teamBId = await ensureTeam(lineBId, "B")
void teamBId

const hash = await argon2.hash(PASSWORD, { type: argon2.argon2id })
const users = [
  { email: "t05-sub@example.com", first: "Sub", last: "Comision", role: "SUBCOMMITTEE", scope: "CLUB", team: null },
  { email: "t05-coach@example.com", first: "César", last: "Entrenador", role: "COACH", scope: "TEAM", team: teamAId },
  { email: "t05-player-a@example.com", first: "Ana", last: "Jugadora", role: "PLAYER", scope: "TEAM", team: teamAId },
  { email: "t05-player-b@example.com", first: "Belén", last: "Jugadora", role: "PLAYER", scope: "TEAM", team: teamAId },
  { email: "t05-player-c@example.com", first: "Carla", last: "OtroEquipo", role: "PLAYER", scope: "TEAM", team: teamBId },
  { email: "t05-admin@example.com", first: "Alicia", last: "Administradora", role: "ADMIN", scope: "CLUB", team: null },
]
const ids = {}
for (const user of users) {
  let person = await one("select id from app.people where email = $1 limit 1", [user.email])
  if (!person) {
    person = await one(
      "insert into app.people (id,first_name,last_name,dni,birth_date,phone,email,created_at,updated_at) values ($1,$2,$3,$4,'1990-01-01','1234567',$5,$6,$6) returning id",
      [crypto.randomUUID(), user.first, user.last, user.email, user.email, now],
    )
  }
  const personId = person.id
  let account = await one("select id from app.accounts where person_id = $1 limit 1", [personId])
  if (!account) {
    account = await one(
      `insert into app.accounts (id,person_id,username,password_hash,status,activated_at,credential_version,setup_token_attempts,created_at,updated_at)
       values ($1,$2,$3,$4,'ACTIVE',$5,1,0,$5,$5) returning id`,
      [crypto.randomUUID(), personId, user.email, hash, now],
    )
  }
  await client.query(
    "insert into app.memberships (id,person_id,valid_from,valid_until,created_at) select $1,$2,$3,null,$4 where not exists (select 1 from app.memberships where person_id=$2 and valid_until is null)",
    [crypto.randomUUID(), personId, "2026-01-01", now],
  )
  await client.query(
    `insert into app.role_assignments (id,person_id,role,scope_type,scope_ref_id,valid_from,valid_until,temporal_exclusions,created_at)
     select $1,$2,$3,$4,$5::uuid,$6,null,'[]'::jsonb,$7 where not exists
     (select 1 from app.role_assignments where person_id=$2 and role=$3 and scope_type=$4 and coalesce(scope_ref_id::text,'')=coalesce($5::text,''))`,
    [crypto.randomUUID(), personId, user.role, user.scope, user.team, new Date("2026-01-01"), now],
  )
  if (user.team) {
    await client.query(
      `insert into app.team_assignments (id,person_id,team_id,valid_from,valid_until,created_at)
       select $1,$2,$3,$4,null,$5 where not exists (select 1 from app.team_assignments where person_id=$2 and team_id=$3 and valid_until is null)`,
      [crypto.randomUUID(), personId, user.team, "2026-01-01", now],
    )
  }
  ids[user.email] = personId
}

// Evento de partido para el recorrido TEAM/EVENT.
let event = await one("select id from app.events where title = $1 limit 1", [`Partido T05 ${TAG}`])
if (!event) {
  event = await one(
    `insert into app.events (id,type,title,start_at,end_at,time_zone,state,club_wide_target,coordination_revision,creator_person_id,opponent,created_at,updated_at,version)
     values ($1,'MATCH',$2,$3,$4,'UTC','SCHEDULED',false,1,$5,'Rival E2E',$6,$6,1) returning id`,
    [crypto.randomUUID(), `Partido T05 ${TAG}`, new Date(Date.now() + 7 * 86_400_000), new Date(Date.now() + 7 * 86_400_000 + 7_200_000), ids["t05-coach@example.com"], now],
  )
}

// EVENT target: PLAYER A como destinatario y COACH con scope EVENT para poder abrir la conversación.
await client.query(
  `insert into app.event_target_person (id, event_id, person_id, added_at)
   select $1,$2,$3,$4 where not exists (select 1 from app.event_target_person where event_id=$2 and person_id=$3)`,
  [crypto.randomUUID(), event.id, ids["t05-player-a@example.com"], now],
)
await client.query(
  `insert into app.role_assignments (id,person_id,role,scope_type,scope_ref_id,valid_from,valid_until,temporal_exclusions,created_at)
   select $1,$2,'COACH','EVENT',$3,$4,null,'[]'::jsonb,$5 where not exists
   (select 1 from app.role_assignments where person_id=$2 and role='COACH' and scope_type='EVENT' and scope_ref_id=$3)`,
  [crypto.randomUUID(), ids["t05-coach@example.com"], event.id, new Date("2026-01-01"), now],
)

console.log(JSON.stringify({ password: PASSWORD, teamAId, eventId: event.id, ids }, null, 2))
await client.end()
