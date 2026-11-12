import type { FastifyInstance } from "fastify"
import { Type } from "@sinclair/typebox"
import type { ProductServices } from "../product-services.js"

const SilentResponse = Type.Any()

type RouteInput = { app: FastifyInstance; registry: any; services: ProductServices }

export function addNotificationRoutes({ app, registry, services }: RouteInput): void {
  /* ── RC-18 — caller's notification feed ── */
  registry.add({
    method: "GET",
    url: "/api/notifications",
    security: { operationId: "RC-18", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: {
      querystring: Type.Object({
        unread: Type.Optional(Type.Union([Type.Literal("true"), Type.Literal("false")])),
        limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 200 })),
      }),
      response: { 200: SilentResponse, 403: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const unread = request.query?.unread === "true" ? true : request.query?.unread === "false" ? false : undefined
      const items = await services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) =>
        services.t03Reads.notificationList(tx, principal.personId, { unread, limit: request.query?.limit }, evaluationInstant))
      return reply.status(200).send({ items })
    },
  })

  /* ── CMD-COM-12 — mark notification read ── */
  registry.add({
    method: "POST",
    url: "/api/notifications/:notificationId/read",
    security: { operationId: "CMD-COM-12", kind: "command", auth: "required", csrf: "required", idempotency: "none", cache: "no-store" },
    schema: {
      params: Type.Object({ notificationId: Type.String({ format: "uuid" }) }),
      response: { 200: SilentResponse, 403: SilentResponse, 404: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const notificationId = String(request.params.notificationId)
      let result: any = null
      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        result = await services.notificationService.markRead(tx, principal.personId, notificationId, evaluationInstant)
      }, true)
      return reply.status(200).send({ notificationRead: true, notificationId, readAt: result?.readAt?.toISOString() ?? null, alreadyRead: result?.alreadyRead ?? false })
    },
  })
}
