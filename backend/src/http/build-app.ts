import { randomUUID } from "node:crypto"
import cookie from "@fastify/cookie"
import helmet from "@fastify/helmet"
import Fastify, { LogController } from "fastify"
import { Type } from "@sinclair/typebox"
import { ErrorEnvelopeSchema } from "../../../shared/contracts/errors.js"
import type { AppConfig } from "../config/load-config.js"
import type { DatabaseProvider } from "../db/database-provider.js"
import { AppError, httpStatusFor, normalizePostgresError } from "../shared/errors.js"
import type { Metrics } from "../shared/metrics.js"
import { requestContext } from "./request-context.js"
import { RouteRegistry } from "./route-registry.js"

const StatusSchema = Type.Object({ status: Type.Union([Type.Literal("ok"), Type.Literal("ready"), Type.Literal("not-ready")]), traceId: Type.String({ format: "uuid" }) })

export async function buildApp(input: { config: AppConfig; database: DatabaseProvider; metrics: Metrics; listenerHealthy: () => boolean }) {
  const app = Fastify({ logger: { level: input.config.environment === "production" ? "info" : "warn", redact: ["req.headers.cookie", "res.headers.set-cookie", "req.headers.authorization", "req.headers.x-gei-csrf", "req.body.password", "req.body.currentPassword", "req.body.newPassword"] }, logController: new LogController({ disableRequestLogging: true }) })
  await app.register(cookie)
  await app.register(helmet, { contentSecurityPolicy: false, hsts: input.config.environment === "production" })

  app.addHook("onRequest", (request, reply, done) => {
    const traceId = randomUUID()
    reply.header("X-Trace-Id", traceId)
    const security = request.routeOptions.config.security
    reply.header("Cache-Control", security?.cache === "public" ? "public, max-age=60" : security?.cache === "private" ? "private, no-store" : "no-store")
    requestContext.run({ traceId, requestId: request.id, operationId: security?.operationId ?? "UNMATCHED", startedAt: performance.now() }, done)
  })
  app.addHook("onResponse", (request, reply, done) => {
    const operation = request.routeOptions.config.security?.operationId ?? "UNMATCHED"
    input.metrics.requests.inc({ operation, status: String(reply.statusCode) })
    const context = requestContext.getStore()
    if (context) input.metrics.duration.observe({ operation }, (performance.now() - context.startedAt) / 1_000)
    done()
  })

  app.setErrorHandler((error, _request, reply) => {
    const normalized = error instanceof AppError
      ? error
      : typeof error === "object" && error !== null && "validation" in error && error.validation
        ? new AppError("TRANSPORT_VALIDATION", "Request validation failed", "transport")
        : normalizePostgresError(error)
    const traceId = requestContext.getStore()?.traceId ?? randomUUID()
    const status = httpStatusFor(normalized)
    if (status >= 500) app.log.error({ traceId, errorCode: normalized.code, err: { name: error instanceof Error ? error.name : "UnknownError", message: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined } }, "request failed")
    const retryAfter = (normalized as AppError & { retryAfter?: number }).retryAfter
    if (retryAfter) reply.header("Retry-After", retryAfter)
    void reply.status(status).send({ error: { code: normalized.code, message: normalized.message, fieldErrors: normalized.fieldErrors, traceId, retryable: normalized.retryable } })
  })
  app.setNotFoundHandler(() => { throw new AppError("NOT_FOUND", "Resource not found", "not_found") })

  const routes = new RouteRegistry()
  routes.add({
    method: "GET", url: "/internal/live",
    security: { operationId: "INFRA-LIVE", kind: "infra", auth: "public", csrf: "none", idempotency: "none", cache: "no-store" },
    schema: { response: { 200: StatusSchema, 500: ErrorEnvelopeSchema } },
    handler: async () => ({ status: "ok", traceId: requestContext.getStore()!.traceId }),
  })
  routes.add({
    method: "GET", url: "/internal/ready",
    security: { operationId: "INFRA-READY", kind: "infra", auth: "public", csrf: "none", idempotency: "none", cache: "no-store" },
    schema: { response: { 200: StatusSchema, 503: StatusSchema, 500: ErrorEnvelopeSchema } },
    handler: async (_request, reply) => {
      const ready = await input.database.isReady() && (!input.config.realtimeEnabled || input.listenerHealthy())
      return reply.status(ready ? 200 : 503).send({ status: ready ? "ready" : "not-ready", traceId: requestContext.getStore()!.traceId })
    },
  })
  if (input.config.metricsEnabled && input.config.environment !== "production") routes.add({
    method: "GET", url: "/internal/metrics",
    security: { operationId: "INFRA-METRICS", kind: "infra", auth: "public", csrf: "none", idempotency: "none", cache: "no-store" },
    schema: { response: { 200: Type.String(), 500: ErrorEnvelopeSchema } },
    handler: async (_request, reply) => reply.type(input.metrics.registry.contentType).send(await input.metrics.registry.metrics()),
  })
  routes.register(app)
  return app
}
