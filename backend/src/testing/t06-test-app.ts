import { testConfig } from "./test-config.js"
import { DatabaseProvider } from "../db/database-provider.js"
import { TransactionRunner } from "../db/transaction-runner.js"
import { Metrics } from "../shared/metrics.js"
import { RateLimiter } from "../shared/rate-limiter.js"
import { IdempotencyCoordinator } from "../shared/idempotency-coordinator.js"
import { buildApp } from "../http/build-app.js"
import { RouteRegistry } from "../http/route-registry.js"
import { ProductServices } from "../product-services.js"
import { addT06Routes } from "../routes/t06-routes.js"
import { addPersonRoutes } from "../routes/person-routes.js"

/** Test harness con los cinco operationIds T06 registrados sobre el router real. */
export async function buildT06TestApp() {
  const config = testConfig({ environment: "test" })
  const database = new DatabaseProvider(config)
  await database.verify()
  const runner = new TransactionRunner(database.db)
  const app = await buildApp({ config, database, metrics: new Metrics(false), listenerHealthy: () => true })
  const api = new RouteRegistry()
  const services = new ProductServices({
    config: config as any,
    database: database.db,
    runner,
    rateLimiter: new RateLimiter(database.db, config.secrets.rateLimitKeyPepper),
    idempotencyCoordinator: new IdempotencyCoordinator(),
  })
  addPersonRoutes({ app, registry: api, services })
  addT06Routes({ app, registry: api, services })
  api.register(app)
  return { app, database, services, runner, config }
}
