import type { FastifyInstance } from "fastify"
import type { AppConfig } from "../config/load-config.js"
import type { DatabaseProvider } from "../db/database-provider.js"
import type { ListenerClient } from "../db/listener-client.js"
import type { TransactionRunner } from "../db/transaction-runner.js"
import type { IdempotencyCoordinator } from "../shared/idempotency-coordinator.js"
import type { Metrics } from "../shared/metrics.js"
import type { HousekeepingWorker, OutboxWorker, OutboxWriter } from "../shared/outbox.js"
import type { RateLimiter } from "../shared/rate-limiter.js"
import type { RealtimeHub } from "../shared/realtime-hub.js"

/** Services owned by the process composition root and injected explicitly into future modules. */
export interface RuntimeServices {
  readonly config: AppConfig
  readonly app: FastifyInstance
  readonly database: DatabaseProvider
  readonly runner: TransactionRunner
  readonly rateLimiter: RateLimiter
  readonly idempotencyCoordinator: IdempotencyCoordinator
  readonly outboxWriter: OutboxWriter
  readonly listener: ListenerClient
  readonly outboxWorker: OutboxWorker
  readonly housekeeping: HousekeepingWorker
  readonly realtime: RealtimeHub
  readonly metrics: Metrics
  isReady(): boolean
  close(): Promise<void>
}
