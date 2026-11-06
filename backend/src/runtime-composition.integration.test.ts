import { randomUUID } from "node:crypto"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { buildRuntime } from "./bootstrap/build-runtime.js"
import { IdempotencyCoordinator } from "./shared/idempotency-coordinator.js"
import { OutboxWriter } from "./shared/outbox.js"
import { RateLimiter } from "./shared/rate-limiter.js"
import { testConfig } from "./testing/test-config.js"

const runtime = await buildRuntime(testConfig({ realtimeEnabled: false }))

beforeAll(async () => {
  await runtime.database.db.deleteFrom("infra.idempotency_records").execute()
  await runtime.database.db.deleteFrom("infra.outbox_events").execute()
  await runtime.database.db.deleteFrom("infra.rate_limit_windows").execute()
})
afterAll(async () => runtime.close())

describe("runtime composition", () => {
  it("owns usable cross-cutting services over the shared runtime database and transaction boundary", async () => {
    expect(runtime.rateLimiter).toBeInstanceOf(RateLimiter)
    expect(runtime.idempotencyCoordinator).toBeInstanceOf(IdempotencyCoordinator)
    expect(runtime.outboxWriter).toBeInstanceOf(OutboxWriter)
    expect(runtime.database.pool.totalCount).toBeLessThanOrEqual(1)

    await runtime.rateLimiter.consume({ name: "composition", limit: 2, windowSeconds: 60 }, "runtime-only-key")
    const key = randomUUID()
    const result = await runtime.runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx, evaluationInstant }) => {
      const acquired = await runtime.idempotencyCoordinator.acquire(tx, { scopeKey: "runtime", commandId: "CMD-INFRA", key, input: { value: 1 } }, evaluationInstant)
      expect(acquired.acquired).toBe(true)
      if (!acquired.acquired) throw new Error("Unexpected replay")
      await runtime.outboxWriter.enqueue(tx, {
        topic: "runtime.composed",
        aggregateType: "Infra",
        aggregateId: randomUUID(),
        payload: { schemaVersion: 1, event: "resource.changed", recipients: [], resourceType: "Infra", resourceId: randomUUID(), invalidate: ["infra"] },
      })
      await runtime.idempotencyCoordinator.succeed(tx, acquired.id, 201, { accepted: true })
      return acquired.id
    })
    expect(result).toMatch(/^[0-9a-f-]{36}$/)
    expect(await runtime.database.db.selectFrom("infra.idempotency_records").select("id").execute()).toHaveLength(1)
    expect(await runtime.database.db.selectFrom("infra.outbox_events").select("id").execute()).toHaveLength(1)
  })
})
