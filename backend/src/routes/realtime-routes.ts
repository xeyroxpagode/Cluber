import type { FastifyInstance } from "fastify"
import { Type } from "@sinclair/typebox"
import type { ProductServices } from "../product-services.js"
import type { RealtimeHub } from "../shared/realtime-hub.js"
import type { OutboxPayload } from "../shared/outbox.js"

const SilentResponse = Type.Any()

type RouteInput = { app: FastifyInstance; registry: any; services: ProductServices; realtime: RealtimeHub }

/**
 * Server-Sent Events stream. Carries realtime invalidation envelopes
 * ({ event, invalidate, resourceType, resourceId }) filtered per recipient personId.
 * It is NOT the source of truth: /api/notifications is the persisted truth (RC-18).
 */
export function addRealtimeRoutes({ app, registry, services, realtime }: RouteInput): void {
  registry.add({
    method: "GET",
    url: "/api/realtime/stream",
    security: { operationId: "RT-01", kind: "query", auth: "required", csrf: "none", idempotency: "none", cache: "no-store" },
    schema: { querystring: Type.Object({}), response: { 200: SilentResponse, 403: SilentResponse } },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      reply.hijack()
      reply.raw.writeHead(200, {
        "content-type": "text/event-stream; charset=utf-8",
        "cache-control": "no-store",
        "connection": "keep-alive",
        "x-accel-buffering": "no",
      })
      reply.raw.write(": connected\n\n")
      const client = {
        personId: principal.personId,
        send: (event: OutboxPayload) => {
          try {
            reply.raw.write(`data: ${JSON.stringify({ event: event.event, invalidate: event.invalidate ?? [], resourceType: event.resourceType, resourceId: event.resourceId })}\n\n`)
            return true
          } catch {
            return false
          }
        },
        close: () => {
          try { reply.raw.end() } catch { /* already closed */ }
        },
      }
      const unsubscribe = realtime.register(client)
      const keepAlive = setInterval(() => {
        try { reply.raw.write(": ping\n\n") } catch { clearInterval(keepAlive) }
      }, 25_000)
      reply.raw.on("close", () => {
        clearInterval(keepAlive)
        unsubscribe()
      })
    },
  })
}
