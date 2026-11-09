import { randomUUID } from "node:crypto"
import pg from "pg"
import { sql } from "kysely"
import { afterAll, beforeEach, describe, expect, it } from "vitest"
import { DatabaseProvider } from "./db/database-provider.js"
import { ListenerClient } from "./db/listener-client.js"
import { TransactionRunner } from "./db/transaction-runner.js"
import { AppError } from "./shared/errors.js"
import { IdempotencyCoordinator } from "./shared/idempotency-coordinator.js"
import { HousekeepingWorker, OutboxWorker, OutboxWriter } from "./shared/outbox.js"
import { RateLimiter } from "./shared/rate-limiter.js"
import { testConfig } from "./testing/test-config.js"

const config = testConfig()
const database = new DatabaseProvider(config)
const runner = new TransactionRunner(database.db)

beforeEach(async () => {
  await database.db.deleteFrom("infra.idempotency_records").execute()
  await database.db.deleteFrom("infra.outbox_events").execute()
  await database.db.deleteFrom("infra.rate_limit_windows").execute()
})
afterAll(async () => database.close())

describe("M0 and PostgreSQL semantics", () => {
  it("uses the limited runtime role and denies browser roles", async () => {
    await database.verify()
    const admin = new pg.Pool({ connectionString: config.databaseUrl })
    const result = await admin.query(`select
      has_schema_privilege('anon','app','USAGE') anon_app,
      has_schema_privilege('authenticated','infra','USAGE') authenticated_infra,
      (select count(*)::int from information_schema.tables where table_schema='app') app_tables,
      (select count(*)::int from information_schema.tables where table_schema='infra') infra_tables`)
    await admin.end()
    expect(result.rows[0]).toEqual({ anon_app: false, authenticated_infra: false, app_tables: 12, infra_tables: 5 })
  })

  it("exposes exactly the authorized T01/T02 tables and no future tables", async () => {
    await database.verify()
    const admin = new pg.Pool({ connectionString: config.databaseUrl })
    const rows = await admin.query<{ table_schema: string; table_name: string }>(`
      select table_schema, table_name
      from information_schema.tables
      where table_schema in ('app','infra')
      order by table_schema, table_name
    `)
    await admin.end()
    const tables = rows.rows.map((row) => `${row.table_schema}.${row.table_name}`)
    const expectedInfra = [
      "infra.auth_sessions",
      "infra.email_change_challenges",
      "infra.idempotency_records",
      "infra.outbox_events",
      "infra.rate_limit_windows",
    ]
    const expectedApp = [
      "app.people",
      "app.memberships",
      "app.accounts",
      "app.role_assignments",
      "app.audit_entries",
      "app.seasons",
      "app.divisions",
      "app.lines",
      "app.teams",
      "app.venues",
      "app.competitions",
      "app.team_assignments",
    ]
    for (const table of [...expectedInfra, ...expectedApp]) {
      expect(tables).toContain(table)
    }
    const unexpected = tables.filter((table) => !expectedInfra.includes(table) && !expectedApp.includes(table))
    expect(unexpected).toEqual([])
  })

  it("keeps app schema grants restricted to the runtime role", async () => {
    await database.verify()
    const admin = new pg.Pool({ connectionString: config.databaseUrl })
    const result = await admin.query(`select
      has_schema_privilege('gei_backend','app','USAGE') gei_backend_app_usage,
      has_schema_privilege('gei_backend','infra','USAGE') gei_backend_infra_usage,
      has_schema_privilege('anon','app','USAGE') anon_app_usage,
      has_schema_privilege('authenticated','app','USAGE') authenticated_app_usage`,
    )
    await admin.end()
    expect(result.rows[0]).toEqual({
      gei_backend_app_usage: true,
      gei_backend_infra_usage: true,
      anon_app_usage: false,
      authenticated_app_usage: false,
    })
  })

  it("commits and rolls back atomically with one PostgreSQL evaluation instant", async () => {
    await expect(runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx, evaluationInstant }) => {
      await tx.insertInto("infra.outbox_events").values({ topic: "test", aggregate_type: "Test", aggregate_id: randomUUID(), payload: {}, processed_at: null, last_error: null, failed_at: null }).execute()
      expect(evaluationInstant).toBeInstanceOf(Date)
      throw new Error("controlled rollback")
    })).rejects.toThrow("controlled rollback")
    expect((await sql<{ count: number }>`select count(*)::int count from infra.outbox_events`.execute(database.db)).rows[0]!.count).toBe(0)
  })

  it("enforces a shared rate limit under concurrent connections", async () => {
    const limiter = new RateLimiter(database.db, config.secrets.rateLimitKeyPepper)
    const outcomes = await Promise.allSettled(Array.from({ length: 20 }, () => limiter.consume({ name: "test.concurrent", limit: 5, windowSeconds: 900 }, "same-key")))
    expect(outcomes.filter((item) => item.status === "fulfilled")).toHaveLength(5)
    expect(outcomes.filter((item) => item.status === "rejected" && item.reason instanceof AppError && item.reason.code === "RATE_LIMITED")).toHaveLength(15)
  })

  it("replays equal idempotent requests and rejects key reuse", async () => {
    const coordinator = new IdempotencyCoordinator()
    const input = { scopeKey: "actor-a", commandId: "CMD-TEST", key: randomUUID(), input: { a: 1 } }
    const first = await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx, evaluationInstant }) => {
      const acquired = await coordinator.acquire(tx, input, evaluationInstant)
      expect(acquired.acquired).toBe(true)
      if (acquired.acquired) await coordinator.succeed(tx, acquired.id, 201, { id: "result" })
      return acquired
    })
    expect(first.acquired).toBe(true)
    const replay = await runner.run("COMMAND_STANDARD", randomUUID(), ({ tx, evaluationInstant }) => coordinator.acquire(tx, input, evaluationInstant))
    expect(replay).toEqual({ acquired: false, status: 201, snapshot: { id: "result" } })
    await expect(runner.run("COMMAND_STANDARD", randomUUID(), ({ tx, evaluationInstant }) => coordinator.acquire(tx, { ...input, input: { a: 2 } }, evaluationInstant))).rejects.toMatchObject({ code: "IDEMPOTENCY_KEY_REUSED" })
  })

  it("serializes concurrent idempotency acquisition to one effect", async () => {
    const coordinator = new IdempotencyCoordinator()
    const input = { scopeKey: "actor-race", commandId: "CMD-RACE", key: randomUUID(), input: { value: 1 } }
    let release!: () => void
    let acquired!: () => void
    const hold = new Promise<void>((resolve) => { release = resolve })
    const firstAcquired = new Promise<void>((resolve) => { acquired = resolve })
    let effects = 0
    const first = runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx, evaluationInstant }) => {
      const result = await coordinator.acquire(tx, input, evaluationInstant)
      if (result.acquired) { effects += 1; acquired(); await hold; await coordinator.succeed(tx, result.id, 200, { effect: effects }) }
      return result
    })
    await firstAcquired
    const second = runner.run("COMMAND_STANDARD", randomUUID(), ({ tx, evaluationInstant }) => coordinator.acquire(tx, input, evaluationInstant))
    const admin = new pg.Pool({ connectionString: config.databaseUrl })
    for (let attempt = 0; attempt < 1_000; attempt += 1) {
      const waiting = await admin.query("select 1 from pg_stat_activity where query like 'insert into infra.idempotency_records%' and wait_event_type = 'Lock'")
      if (waiting.rowCount) break
      await new Promise<void>((resolve) => setImmediate(resolve))
    }
    release()
    const [, replay] = await Promise.all([first, second])
    await admin.end()
    expect(effects).toBe(1)
    expect(replay).toEqual({ acquired: false, status: 200, snapshot: { effect: 1 } })
  })

  it("recovers durable outbox work after handler failure and prevents double claims", async () => {
    const writer = new OutboxWriter()
    const eventId = await runner.run("COMMAND_STANDARD", randomUUID(), ({ tx }) => writer.enqueue(tx, { topic: "realtime", aggregateType: "Test", aggregateId: randomUUID(), payload: { schemaVersion: 1, event: "resource.changed", recipients: [], resourceType: "Test", resourceId: randomUUID(), invalidate: ["test"] } }))
    const failing = new OutboxWorker(runner, async () => { throw new Error("secret detail must not persist") })
    expect(await failing.processBatch()).toBe(1)
    let row = await database.db.selectFrom("infra.outbox_events").selectAll().where("id", "=", eventId).executeTakeFirstOrThrow()
    expect(row).toMatchObject({ attempt_count: 1, processed_at: null, last_error: "Error" })
    await database.db.updateTable("infra.outbox_events").set({ available_at: new Date() }).where("id", "=", eventId).execute()
    let calls = 0
    const succeeding = new OutboxWorker(runner, async () => { calls += 1 })
    await Promise.all([succeeding.processBatch(), succeeding.processBatch()])
    row = await database.db.selectFrom("infra.outbox_events").selectAll().where("id", "=", eventId).executeTakeFirstOrThrow()
    expect(row.processed_at).toBeInstanceOf(Date)
    expect(calls).toBe(1)
  })

  it("marks an outbox row permanently failed at attempt ten", async () => {
    const id = randomUUID()
    await database.db.insertInto("infra.outbox_events").values({ id, topic: "test", aggregate_type: "Test", aggregate_id: randomUUID(), payload: {}, processed_at: null, attempt_count: 9, last_error: null, failed_at: null }).execute()
    const worker = new OutboxWorker(runner, async () => { throw new Error("private failure detail") })
    await worker.processBatch()
    const row = await database.db.selectFrom("infra.outbox_events").select(["attempt_count", "failed_at", "last_error"]).where("id", "=", id).executeTakeFirstOrThrow()
    expect(row.attempt_count).toBe(10)
    expect(row.failed_at).toBeInstanceOf(Date)
    expect(row.last_error).toBe("Error")
  })

  it("receives commit-time LISTEN notifications on a dedicated client", async () => {
    let resolveSignal!: (value: string) => void
    const signal = new Promise<string>((resolve) => { resolveSignal = resolve })
    const listener = new ListenerClient(config.databaseUrl, config.databaseRole, (channel, payload) => { if (channel === "gei_outbox_wakeup") resolveSignal(payload) })
    await listener.start()
    const expected = randomUUID()
    await sql`select pg_notify('gei_outbox_wakeup', ${expected})`.execute(database.db)
    const actual = await Promise.race([signal, new Promise<string>((_, reject) => setTimeout(() => reject(new Error("notification timeout")), 3_000))])
    await listener.close()
    expect(actual).toBe(expected)
  })

  it("housekeeps only expired technical rows in bounded batches", async () => {
    const old = new Date(Date.now() - 40 * 86_400_000)
    const expired = new Date(old.getTime() + 60_000)
    await database.db.insertInto("infra.idempotency_records").values({ scope_key: "cleanup", command_id: "CMD-CLEAN", idempotency_key: randomUUID(), request_hash: Buffer.alloc(32), status: "SUCCEEDED", response_status: 200, response_snapshot: {}, resource_type: null, resource_id: null, created_at: old, expires_at: expired }).execute()
    await database.db.insertInto("infra.rate_limit_windows").values({ policy: "cleanup", key_hash: Buffer.alloc(32), window_started_at: old, count: 1, blocked_until: null, updated_at: old }).execute()
    await database.db.insertInto("infra.outbox_events").values({ topic: "cleanup", aggregate_type: "Test", aggregate_id: randomUUID(), payload: {}, processed_at: null, attempt_count: 10, last_error: "Error", failed_at: old, created_at: old, available_at: old }).execute()
    const worker = new HousekeepingWorker(database.db)
    await worker.processBatch(10)
    expect((await database.db.selectFrom("infra.idempotency_records").select("id").execute())).toHaveLength(0)
    expect((await database.db.selectFrom("infra.rate_limit_windows").select("policy").execute())).toHaveLength(0)
    expect((await database.db.selectFrom("infra.outbox_events").select("id").execute())).toHaveLength(0)
  })
})
