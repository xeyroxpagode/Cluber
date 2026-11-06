import pg from "pg"
import { DatabaseProvider } from "../db/database-provider.js"
import { TransactionRunner } from "../db/transaction-runner.js"
import { buildApp } from "../http/build-app.js"
import { Metrics } from "../shared/metrics.js"
import { OutboxWorker, type OutboxPayload } from "../shared/outbox.js"
import { testConfig } from "./test-config.js"

export function fixtureUuid(index: number): string {
  if (!Number.isInteger(index) || index < 0 || index > 0xffffffffffff) throw new RangeError("Fixture index out of range")
  return `00000000-0000-4000-8000-${index.toString(16).padStart(12, "0")}`
}

export async function buildTestRuntime(options: { outboxHandler?: (event: { id: string; payload: OutboxPayload }) => Promise<void> } = {}) {
  const config = testConfig()
  const database = new DatabaseProvider(config)
  await database.verify()
  const runner = new TransactionRunner(database.db)
  const metrics = new Metrics(false)
  const outboxWorker = new OutboxWorker(runner, options.outboxHandler ?? (async () => undefined))
  const app = await buildApp({ config, database, metrics, listenerHealthy: () => true })
  return {
    config,
    database,
    runner,
    outboxWorker,
    app,
    processOutboxBatch: (limit?: number) => outboxWorker.processBatch(limit),
    async independentConnection() {
      const client = new pg.Client({ connectionString: config.databaseUrl, options: "-c role=gei_backend -c timezone=UTC", application_name: "gei-test-independent" })
      await client.connect()
      return client
    },
    async close() {
      outboxWorker.stopClaiming()
      await app.close()
      await database.close()
    },
  }
}
