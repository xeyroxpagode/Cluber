import { afterAll, describe, expect, it } from "vitest"
import { DatabaseProvider } from "./db/database-provider.js"
import { buildApp } from "./http/build-app.js"
import { Metrics } from "./shared/metrics.js"
import { testConfig } from "./testing/test-config.js"
import { buildTestRuntime, fixtureUuid } from "./testing/test-runtime.js"

const config = testConfig()
const database = new DatabaseProvider(config)
const app = await buildApp({ config, database, metrics: new Metrics(false), listenerHealthy: () => true })
afterAll(async () => { await app.close(); await database.close() })

describe("technical HTTP surface", () => {
  it("returns real liveness with trace and security headers", async () => {
    const response = await app.inject({ method: "GET", url: "/internal/live" })
    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject({ status: "ok" })
    expect(response.headers["x-trace-id"]).toMatch(/^[0-9a-f-]{36}$/)
    expect(response.headers["x-content-type-options"]).toBe("nosniff")
    expect(response.headers["cache-control"]).toBe("no-store")
  })

  it("reports readiness from the real database without private details", async () => {
    const response = await app.inject({ method: "GET", url: "/internal/ready" })
    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ status: "ready", traceId: response.headers["x-trace-id"] })
    expect(response.body).not.toContain("postgres")
  })

  it("normalizes unknown routes without leaking internals", async () => {
    const response = await app.inject({ method: "GET", url: "/does-not-exist" })
    expect(response.statusCode).toBe(404)
    expect(response.json()).toMatchObject({ error: { code: "NOT_FOUND", retryable: false } })
    expect(response.body).not.toContain("stack")
  })

  it("degrades readiness when the database is unavailable", async () => {
    const unavailable = await buildApp({ config, database: { isReady: async () => false } as DatabaseProvider, metrics: new Metrics(false), listenerHealthy: () => true })
    const response = await unavailable.inject({ method: "GET", url: "/internal/ready" })
    await unavailable.close()
    expect(response.statusCode).toBe(503)
    expect(response.json()).toMatchObject({ status: "not-ready" })
    expect(response.body).not.toContain("database")
  })

  it("drains an active request before graceful close completes", async () => {
    const draining = await buildApp({ config, database, metrics: new Metrics(false), listenerHealthy: () => true })
    let started!: () => void
    let release!: () => void
    const didStart = new Promise<void>((resolve) => { started = resolve })
    const hold = new Promise<void>((resolve) => { release = resolve })
    draining.get("/test/drain", { schema: { response: { 200: { type: "object", properties: { done: { type: "boolean" } } } } } }, async () => { started(); await hold; return { done: true } })
    const response = draining.inject({ method: "GET", url: "/test/drain" })
    await didStart
    let closed = false
    const closing = draining.close().then(() => { closed = true })
    await Promise.resolve()
    expect(closed).toBe(false)
    release()
    expect((await response).statusCode).toBe(200)
    await closing
    expect(closed).toBe(true)
  })

  it("buildTestRuntime exposes deterministic fixtures, controlled workers, independent connections, and teardown", async () => {
    const runtime = await buildTestRuntime()
    const client = await runtime.independentConnection()
    expect((await client.query("select current_user role")).rows[0].role).toBe("gei_backend")
    await client.end()
    expect(fixtureUuid(1)).toBe("00000000-0000-4000-8000-000000000001")
    expect(await runtime.processOutboxBatch()).toBe(0)
    await runtime.close()
  })
})
