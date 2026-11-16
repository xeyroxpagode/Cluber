import { afterAll, beforeAll, describe, expect, it } from "vitest"
import pg from "pg"
import { randomUUID } from "node:crypto"
import { testConfig } from "../testing/test-config"

/**
 * I1 — M8 physical schema verification against real PostgreSQL (gei_test).
 * Ejecuta casos positivos y negativos; nunca relaja constraints.
 */
const config = testConfig()
let client: pg.Client
let personA: string
let personB: string
let teamId: string
let eventId: string

beforeAll(async () => {
  client = new pg.Client({ connectionString: config.databaseUrl })
  await client.connect()
  // La DB se reconstruye sin entidades (seed.sql deliberadamente vacío): creamos fixtures ficticios reales.
  const tag = `m8-${randomUUID().slice(0, 8)}`
  personA = randomUUID()
  personB = randomUUID()
  await client.query(
    "insert into app.people (id, first_name, last_name, dni, created_at, updated_at) values ($1,$2,$3,$4,now(),now()),($5,$6,$7,$8,now(),now())",
    [personA, "I1", `A-${tag}`, `dni-a-${tag}`, personB, "I1", `B-${tag}`, `dni-b-${tag}`],
  )
  const seasonId = randomUUID()
  const divisionId = randomUUID()
  const lineId = randomUUID()
  await client.query(
    "insert into app.seasons (id, name, starts_on, ends_on, version, created_at, updated_at) values ($1,$2,'2024-01-01','2024-12-31',1,now(),now())",
    [seasonId, `Temporada ${tag}`],
  )
  await client.query(
    "insert into app.divisions (id, name, version, created_at, updated_at) values ($1,$2,1,now(),now())",
    [divisionId, `División ${tag}`],
  )
  await client.query(
    "insert into app.lines (id, name, version, created_at, updated_at) values ($1,$2,1,now(),now())",
    [lineId, `Línea ${tag}`],
  )
  teamId = randomUUID()
  await client.query(
    "insert into app.teams (id, season_id, division_id, line_id, state, version, created_at, updated_at) values ($1,$2,$3,$4,'ACTIVE',1,now(),now())",
    [teamId, seasonId, divisionId, lineId],
  )
  eventId = randomUUID()
  await client.query(
    `insert into app.events (id, type, title, time_zone, state, club_wide_target,
     coordination_revision, creator_person_id, created_at, updated_at, version)
     values ($1,'TRAINING',$2,'UTC','SCHEDULED',false,1,$3,now(),now(),1)`,
    [eventId, `Evento ${tag}`, personA],
  )
})

afterAll(async () => {
  await client.end()
})

async function fails(sql: string, values: unknown[], codeFragment?: string): Promise<void> {
  try {
    await client.query(sql, values)
    throw new Error(`Expected constraint violation but statement succeeded: ${sql.slice(0, 80)}`)
  } catch (error) {
    const e = error as { code?: string; message?: string }
    if (!e.code || !/^23/.test(e.code)) throw error
    if (codeFragment && !e.code.includes(codeFragment) && !e.message?.includes(codeFragment)) throw error
  }
}

describe("M8 — physical schema (I1)", () => {
  it("crea las 5 tablas, constraints e índices contractuales", async () => {
    const tables = await client.query<{ table_name: string }>(`
      select table_name from information_schema.tables
      where table_schema = 'app' and table_name = any($1::text[]) order by table_name
    `, [["announcements", "announcement_target_teams", "conversations", "conversation_participants", "messages"]])
    expect(tables.rows.map((r) => r.table_name)).toEqual([
      "announcement_target_teams", "announcements", "conversation_participants", "conversations", "messages",
    ])
    const indexes = await client.query<{ indexname: string }>(`
      select indexname from pg_indexes where schemaname = 'app' and indexname like any($1::text[])
    `, [["uq_conversations__%", "ix_messages__%", "ix_announcements__%"]])
    const names = indexes.rows.map((r) => r.indexname)
    expect(names).toContain("uq_conversations__direct_pair")
    expect(names).toContain("uq_conversations__team")
    expect(names).toContain("uq_conversations__event")
    expect(names).toContain("ix_messages__conversation_sent")
    const excl = await client.query<{ conname: string }>(`
      select conname from pg_constraint where conname = 'ex_conversation_participants__no_overlap'
    `)
    expect(excl.rows).toHaveLength(1)
    const ext = await client.query("select 1 from pg_extension where extname = 'btree_gist'")
    expect(ext.rows).toHaveLength(1)
  })

  describe("Announcements", () => {
    const makeDraft = async (title = "Título", body = "Cuerpo") => {
      const r = await client.query<{ id: string }>(
        "insert into app.announcements (title, body) values ($1,$2) returning id", [title, body],
      )
      return r.rows[0].id
    }

    it("crea DRAFT y conserva publishedAt al archivar (C18)", async () => {
      const id = await makeDraft()
      await client.query(
        "update app.announcements set state='PUBLISHED', published_at=now(), published_by_person_id=$2, version=2 where id=$1",
        [id, personA],
      )
      const pub = await client.query<{ published_at: Date }>("select published_at from app.announcements where id=$1", [id])
      expect(pub.rows[0].published_at).not.toBeNull()
      await client.query("update app.announcements set state='ARCHIVED', archived_at=now(), version=3 where id=$1", [id])
      const archived = await client.query<{ state: string; published_at: Date; archived_at: Date; revision: number }>(
        "select state, published_at, archived_at, revision from app.announcements where id=$1", [id],
      )
      expect(archived.rows[0].state).toBe("ARCHIVED")
      expect(archived.rows[0].published_at).not.toBeNull()
      expect(archived.rows[0].archived_at).not.toBeNull()
      expect(archived.rows[0].revision).toBe(1)
    })

    it("rechaza título/cuerpo vacíos", async () => {
      await fails("insert into app.announcements (title, body) values ($1,$2)", ["", "cuerpo"], "23514")
      await fails("insert into app.announcements (title, body) values ($1,$2)", ["título", "  "], "23514")
    })

    it("rechaza PUBLICADO sin published_at y DRAFT con published_at", async () => {
      const id = await makeDraft()
      await fails("update app.announcements set state='PUBLISHED' where id=$1", [id], "23514")
      const id2 = await makeDraft()
      await fails("update app.announcements set published_at=now() where id=$1", [id2], "23514")
    })

    it("rechaza ARCHIVED sin archived_at", async () => {
      const id = await makeDraft()
      await client.query("update app.announcements set state='PUBLISHED', published_at=now(), published_by_person_id=$2 where id=$1", [id, personA])
      await fails("update app.announcements set state='ARCHIVED' where id=$1", [id], "23514")
    })

    it("audiencia única por announcement y FK válidos", async () => {
      const id = await makeDraft()
      await client.query(
        "insert into app.announcement_target_teams (announcement_id, team_id, added_by_person_id) values ($1,$2,$3)",
        [id, teamId, personA],
      )
      await fails(
        "insert into app.announcement_target_teams (announcement_id, team_id, added_by_person_id) values ($1,$2,$3)",
        [id, teamId, personA], "23505",
      )
      await fails(
        "insert into app.announcement_target_teams (announcement_id, team_id, added_by_person_id) values ($1,$2,$3)",
        [id, randomUUID(), personA], "23503",
      )
    })
  })

  describe("Conversations", () => {
    const makeConv = async (type: string, extra: Record<string, unknown> = {}) => {
      const keys = Object.keys(extra)
      const cols = ["type", "created_by_person_id", ...keys]
      const vals = [type, personA, ...keys.map((k) => extra[k])]
      const placeholders = cols.map((_, i) => `$${i + 1}`).join(",")
      const r = await client.query<{ id: string; version: number }>(
        `insert into app.conversations (${cols.join(",")}) values (${placeholders}) returning id, version`, vals,
      )
      return r.rows[0]
    }

    it("crea DIRECT canónica con direct_pair_key", async () => {
      const pair = [personA, personB].sort().join("|")
      const c = await makeConv("DIRECT", { direct_pair_key: pair })
      expect(c.version).toBe(1)
      await fails(
        "insert into app.conversations (type, created_by_person_id, direct_pair_key) values ('DIRECT',$1,$2)",
        [personA, pair], "23505",
      )
    })

    it("impide identidades contextuales nulas o incompatibles", async () => {
      await fails("insert into app.conversations (type, created_by_person_id) values ('DIRECT',$1)", [personA], "23514")
      await fails(
        "insert into app.conversations (type, created_by_person_id, team_id, direct_pair_key) values ('TEAM',$1,$2,$3)",
        [personA, teamId, "x|y"], "23514",
      )
      await fails(
        "insert into app.conversations (type, created_by_person_id, title, event_id) values ('GROUP',$1,'T',$2)",
        [personA, eventId], "23514",
      )
      await fails(
        "insert into app.conversations (type, created_by_person_id, title) values ('GROUP',$1,'')",
        [personA], "23514",
      )
    })

    it("impide ARCHIVED en no-GROUP y duplicados TEAM/EVENT", async () => {
      await fails(
        "insert into app.conversations (type, created_by_person_id, direct_pair_key, state) values ('DIRECT',$1,$2,'ARCHIVED')",
        [personA, `${randomUUID()}|${randomUUID()}`], "23514",
      )
      const t1 = await makeConv("TEAM", { team_id: teamId })
      expect(t1.id).toBeTruthy()
      await fails(
        "insert into app.conversations (type, created_by_person_id, team_id) values ('TEAM',$1,$2)",
        [personA, teamId], "23505",
      )
      const e1 = await makeConv("EVENT", { event_id: eventId })
      expect(e1.id).toBeTruthy()
      await fails(
        "insert into app.conversations (type, created_by_person_id, event_id) values ('EVENT',$1,$2)",
        [personA, eventId], "23505",
      )
    })

    it("GROUP permite ARCHIVED y conserva historia", async () => {
      const g = await makeConv("GROUP", { title: "Grupo I1" })
      await client.query("update app.conversations set state='ARCHIVED', version=2 where id=$1", [g.id])
      const state = await client.query<{ state: string }>("select state from app.conversations where id=$1", [g.id])
      expect(state.rows[0].state).toBe("ARCHIVED")
    })
  })

  describe("Participants y temporalidad", () => {
    let convId: string
    beforeAll(async () => {
      const r = await client.query<{ id: string }>(
        "insert into app.conversations (type, created_by_person_id, direct_pair_key) values ('DIRECT',$1,$2) returning id",
        [personA, randomUUID()],
      )
      convId = r.rows[0].id
    })

    it("acepta salida y reingreso como intervalos distintos", async () => {
      const t0 = new Date("2024-01-01T00:00:00Z")
      const t1 = new Date("2024-02-01T00:00:00Z")
      const t2 = new Date("2024-03-01T00:00:00Z")
      const t3 = new Date("2024-04-01T00:00:00Z")
      await client.query(
        "insert into app.conversation_participants (conversation_id, person_id, joined_at, left_at) values ($1,$2,$3,$4)",
        [convId, personA, t0, t1],
      )
      await client.query(
        "insert into app.conversation_participants (conversation_id, person_id, joined_at, left_at) values ($1,$2,$3,$4)",
        [convId, personA, t2, t3],
      )
      const rows = await client.query<{ n: number }>(
        "select count(*)::int n from app.conversation_participants where conversation_id=$1 and person_id=$2", [convId, personA],
      )
      expect(rows.rows[0].n).toBe(2)
    })

    it("rechaza solapamiento e intervalo inválido (exclusion constraint)", async () => {
      const t0 = new Date("2024-01-15T00:00:00Z")
      const t1 = new Date("2024-02-15T00:00:00Z")
      await fails(
        "insert into app.conversation_participants (conversation_id, person_id, joined_at, left_at) values ($1,$2,$3,$4)",
        [convId, personA, t0, t1], "23P01",
      )
      await fails(
        "insert into app.conversation_participants (conversation_id, person_id, joined_at, left_at) values ($1,$2,$3,$4)",
        [convId, personB, t1, t0], "23514",
      )
    })
  })

  describe("Messages", () => {
    let convId: string
    beforeAll(async () => {
      const r = await client.query<{ id: string }>(
        "insert into app.conversations (type, created_by_person_id, direct_pair_key) values ('DIRECT',$1,$2) returning id",
        [personA, randomUUID()],
      )
      convId = r.rows[0].id
    })

    it("persiste SENT → EDITED → DELETED con tombstone", async () => {
      const r = await client.query<{ id: string; state: string }>(
        "insert into app.messages (conversation_id, author_person_id, body) values ($1,$2,$3) returning id, state",
        [convId, personA, "hola"],
      )
      expect(r.rows[0].state).toBe("SENT")
      await client.query("update app.messages set state='EDITED', edited_at=now(), body='editado', version=2 where id=$1", [r.rows[0].id])
      await client.query(
        "update app.messages set state='DELETED', deleted_at=now(), deletion_reason='error', version=3 where id=$1", [r.rows[0].id],
      )
      const deleted = await client.query<{ state: string; deleted_at: Date; deletion_reason: string; edited_at: Date | null }>(
        "select state, deleted_at, deletion_reason, edited_at from app.messages where id=$1", [r.rows[0].id],
      )
      expect(deleted.rows[0].state).toBe("DELETED")
      expect(deleted.rows[0].deletion_reason).toBe("error")
      expect(deleted.rows[0].edited_at).not.toBeNull()
    })

    it("rechaza estados incoherentes, body vacío y FKs inválidos", async () => {
      const r = await client.query<{ id: string }>(
        "insert into app.messages (conversation_id, author_person_id, body) values ($1,$2,$3) returning id",
        [convId, personA, "valido"],
      )
      await fails("update app.messages set state='EDITED' where id=$1", [r.rows[0].id], "23514")
      await fails("update app.messages set state='DELETED' where id=$1", [r.rows[0].id], "23514")
      await fails(
        "insert into app.messages (conversation_id, author_person_id, body) values ($1,$2,'  ')", [convId, personA], "23514",
      )
      await fails(
        "insert into app.messages (conversation_id, author_person_id, body) values ($1,$2,'x')", [randomUUID(), personA], "23503",
      )
    })
  })
})
