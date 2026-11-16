import type { Transaction } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import { testConfig } from "./test-config.js"
import { DatabaseProvider } from "../db/database-provider.js"
import { TransactionRunner } from "../db/transaction-runner.js"
import { Metrics } from "../shared/metrics.js"
import { RateLimiter } from "../shared/rate-limiter.js"
import { IdempotencyCoordinator } from "../shared/idempotency-coordinator.js"
import { buildApp } from "../http/build-app.js"
import { RouteRegistry } from "../http/route-registry.js"
import { ProductServices } from "../product-services.js"
import { addEventRoutes } from "../routes/event-routes.js"
import { addParticipationRoutes } from "../routes/participation-routes.js"
import { addNotificationRoutes } from "../routes/notification-routes.js"
import { addJornadaRoutes } from "../routes/jornada-routes.js"

/**
 * In-process full wiring of the T03 HTTP surface for API tests.
 * Mirrors build-runtime.ts route registration (same add*Routes functions) without listen/listeners.
 */
export async function buildT03TestApp() {
  const config = testConfig({ environment: "test" })
  const database = new DatabaseProvider(config)
  await database.verify()
  const runner = new TransactionRunner(database.db)
  const app = await buildApp({ config, database, metrics: new Metrics(false), listenerHealthy: () => true })
  const api = new RouteRegistry()
  const productDeps = {
    config: config as any,
    database: database.db,
    runner,
    rateLimiter: new RateLimiter(database.db, config.secrets.rateLimitKeyPepper),
    idempotencyCoordinator: new IdempotencyCoordinator(),
  }
  const services = new ProductServices(productDeps)
  addEventRoutes({ app, registry: api, services })
  addParticipationRoutes({ app, registry: api, services })
  addNotificationRoutes({ app, registry: api, services })
  addJornadaRoutes({ app, registry: api, services })
  api.register(app)
  return { app, database, services, runner, config }
}

export async function createSessionFor(services: ProductServices, tx: import("kysely").Transaction<DatabaseSchema>, personId: string) {
  const accountId = crypto.randomUUID()
  await tx.insertInto("app.accounts").values({
    id: accountId, person_id: personId, username: `api-${personId.slice(0, 8)}-${crypto.randomUUID().slice(0, 6)}`,
    password_hash: "$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHRzb21lc2FsdA$c29tZXNhbHRzd21lLXZhbHVl", status: "ACTIVE", activated_at: new Date(), credential_version: 1, setup_token_attempts: 0,
    created_at: new Date(), updated_at: new Date(),
  }).execute()
  return services.principals.create(tx, { id: accountId, credentialVersion: 1 }, new Date())
}
