import { sql } from "kysely"
import type { AppConfig } from "../config/load-config.js"
import { DatabaseProvider } from "../db/database-provider.js"
import { ListenerClient } from "../db/listener-client.js"
import { TransactionRunner } from "../db/transaction-runner.js"
import { buildApp } from "../http/build-app.js"
import { Metrics } from "../shared/metrics.js"
import { IdempotencyCoordinator } from "../shared/idempotency-coordinator.js"
import { HousekeepingWorker, OutboxWorker, OutboxWriter, type OutboxPayload } from "../shared/outbox.js"
import { RateLimiter } from "../shared/rate-limiter.js"
import { RealtimeHub } from "../shared/realtime-hub.js"
import { RouteRegistry } from "../http/route-registry.js"
import type { RuntimeServices } from "./runtime-services.js"
import { ProductServices } from "../product-services.js"
import { addAuthRoutes } from "../routes/auth-routes.js"
import { addPersonRoutes } from "../routes/person-routes.js"
import { addPersonAdminRoutes } from "../routes/person-admin-routes.js"
import { addStructureRoutes } from "../routes/structure-routes.js"
import { addAffiliationRoutes } from "../routes/affiliation-routes.js"
import { addAuditRoutes } from "../routes/audit-routes.js"
import { addSystemRoutes } from "../routes/system-routes.js"
import { addIamAdminRoutes } from "../routes/iam-admin-routes.js"
import { addEventRoutes } from "../routes/event-routes.js"
import { addParticipationRoutes } from "../routes/participation-routes.js"
import { addNotificationRoutes } from "../routes/notification-routes.js"
import { addJornadaRoutes } from "../routes/jornada-routes.js"
import { addRealtimeRoutes } from "../routes/realtime-routes.js"
import { addCommunicationRoutes } from "../communication/communication-routes.js"

export async function buildRuntime(config: AppConfig): Promise<RuntimeServices> {
  const database = new DatabaseProvider(config)
  const runner = new TransactionRunner(database.db)
  const metrics = new Metrics(config.metricsEnabled)
  const rateLimiter = new RateLimiter(database.db, config.secrets.rateLimitKeyPepper)
  const idempotencyCoordinator = new IdempotencyCoordinator()
  const outboxWriter = new OutboxWriter()
  const realtime = new RealtimeHub()
  const outboxWorker = new OutboxWorker(runner, async ({ payload }) => {
    if (payload.schemaVersion !== 1 || !Array.isArray(payload.recipients)) throw new TypeError("InvalidOutboxPayload")
  })
  const housekeeping = new HousekeepingWorker(database.db)
  const listener = new ListenerClient(config.databaseUrl, config.databaseRole, (channel, payload) => {
    if (channel === "gei_outbox_wakeup") void outboxWorker.processBatch()
    if (channel === "gei_realtime") void sql<{ payload: OutboxPayload }>`select payload from infra.outbox_events where id=${payload} and processed_at is not null`.execute(database.db).then((result) => {
      const event = result.rows[0]?.payload
      if (event) realtime.publish(event)
    })
  })

  await database.verify()
  if (config.realtimeEnabled) await listener.start()
  const app = await buildApp({ config, database, metrics, listenerHealthy: () => !config.realtimeEnabled || listener.isHealthy() })

  const productDeps = { config: config as any, database: database.db, runner, rateLimiter, idempotencyCoordinator }
  const services = new ProductServices(productDeps)
  const productRoutes = new RouteRegistry()
  addAuthRoutes({ app, registry: productRoutes, services })
  addPersonRoutes({ app, registry: productRoutes, services })
  addPersonAdminRoutes({ app, registry: productRoutes, services })
  addIamAdminRoutes({ app, registry: productRoutes, services })
  addStructureRoutes({ app, registry: productRoutes, services })
  addAffiliationRoutes({ app, registry: productRoutes, services })
  addAuditRoutes({ app, registry: productRoutes, services })
  addSystemRoutes({ app, registry: productRoutes, services })
  addEventRoutes({ app, registry: productRoutes, services })
  addParticipationRoutes({ app, registry: productRoutes, services })
  addNotificationRoutes({ app, registry: productRoutes, services })
  addJornadaRoutes({ app, registry: productRoutes, services })
  addCommunicationRoutes({ app, registry: productRoutes, services })
  addRealtimeRoutes({ app, registry: productRoutes, services, realtime })
  productRoutes.register(app)

  let ready = true
  const workerTimer = setInterval(() => void outboxWorker.processBatch().catch((error) => app.log.error({ err: { name: error.name } }, "outbox batch failed")), 2_000)
  const housekeepingTimer = setInterval(() => void housekeeping.processBatch().catch((error) => app.log.error({ err: { name: error.name } }, "housekeeping failed")), 60_000)
  workerTimer.unref()
  housekeepingTimer.unref()

  return {
    config, app, database, listener, outboxWorker, housekeeping, realtime, runner, metrics,
    rateLimiter, idempotencyCoordinator, outboxWriter,
    isReady: () => ready,
    async close() {
      ready = false
      clearInterval(workerTimer)
      clearInterval(housekeepingTimer)
      outboxWorker.stopClaiming()
      realtime.closeAll()
      await app.close()
      await listener.close()
      await database.close()
    },
  }
}
