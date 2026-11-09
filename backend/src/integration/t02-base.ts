import type { Kysely } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import { testConfig } from "../testing/test-config.js"
import { DatabaseProvider } from "../db/database-provider.js"
import { TransactionRunner } from "../db/transaction-runner.js"
import { RateLimiter } from "../shared/rate-limiter.js"
import { IdempotencyCoordinator } from "../shared/idempotency-coordinator.js"
import { ProductServices } from "../product-services.js"

declare function beforeAll(fn: () => void | Promise<void>): void
declare function afterAll(fn: () => void | Promise<void>): void

let runtime: { config: any; database: DatabaseProvider; runner: TransactionRunner; services: ProductServices } | null = null

beforeAll(async () => {
  const config = testConfig()
  const database = new DatabaseProvider(config)
  const runner = new TransactionRunner(database.db)
  const services = new ProductServices({
    config: config as any,
    database: database.db,
    runner,
    rateLimiter: new RateLimiter(database.db, config.secrets.rateLimitKeyPepper),
    idempotencyCoordinator: new IdempotencyCoordinator(),
  })
  runtime = { config, database, runner, services }
})

afterAll(async () => { await runtime?.database.close() })

async function cleanDb(tx: Kysely<DatabaseSchema>) {
  await tx.deleteFrom("infra.email_change_challenges").execute()
  await tx.deleteFrom("infra.auth_sessions").execute()
  await tx.deleteFrom("app.role_assignments").execute()
  await tx.deleteFrom("app.team_assignments").execute()
  // app.audit_entries is append-only by trigger: never deleted in tests.
  await tx.deleteFrom("app.accounts").execute()
  await tx.deleteFrom("app.memberships").execute()
  await tx.deleteFrom("app.people").execute()
}

import { randomUUID } from "node:crypto"

async function insertPerson(tx: Kysely<DatabaseSchema>, email: string, extra?: Partial<any>) {
  const id = randomUUID()
  await tx.insertInto("app.people").values({
    id, first_name: "Ana", last_name: "González", dni: extra?.dni ?? email,
    birth_date: "1990-01-01", phone: "12345678", email, created_at: new Date(), updated_at: new Date(),
  }).executeTakeFirstOrThrow()
  return id
}

export { runtime, cleanDb, insertPerson }
