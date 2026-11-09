import type { FastifyInstance } from "fastify"
import { Type } from "@sinclair/typebox"
import { ProductServices } from "../product-services.js"
import { AppError } from "../shared/errors.js"

const SilentResponse = Type.Any()

type RouteInput = { app: FastifyInstance; registry: any; services: ProductServices }

export function addAuditRoutes({ app, registry, services }: RouteInput): void {
  async function requireAdminInTx(request: any, tx: any, evaluationInstant: Date): Promise<any> {
    const principal = await services.principals.requireInTx(tx, request, evaluationInstant)
    const authority = await services.authority.snapshot(tx, principal.personId, evaluationInstant)
    services.authority.require(authority.canViewAudit, "AUTHORITY_DENIED")
    return principal
  }

  registry.add({
    method: "GET",
    url: "/api/audit",
    security: { operationId: "RC-12", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: {
      querystring: Type.Object({ limit: Type.Optional(Type.String({ pattern: "^[0-9]+$" })) }),
      response: { 200: SilentResponse, 403: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const limit = request.query.limit ? Math.min(Math.max(parseInt(request.query.limit as string, 10), 1), 500) : 100
      const items = await services.deps.runner.run("READ_REPORT", principal.sessionId, async ({ tx }) => {
        await requireAdminInTx(request, tx, new Date())
        return services.auditService.list(tx, limit)
      })
      return reply.status(200).send({ items })
    },
  })
}
