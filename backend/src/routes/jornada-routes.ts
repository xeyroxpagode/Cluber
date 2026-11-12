import type { FastifyInstance } from "fastify"
import { Type } from "@sinclair/typebox"
import type { ProductServices } from "../product-services.js"

const SilentResponse = Type.Any()
const Uuid = Type.String({ format: "uuid" })

type RouteInput = { app: FastifyInstance; registry: any; services: ProductServices }

export function addJornadaRoutes({ app, registry, services }: RouteInput): void {
  /* ── CMD-EVT-15 — schedule jornada ── */
  registry.add({
    method: "POST",
    url: "/api/jornadas",
    security: { operationId: "CMD-EVT-15", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      body: Type.Object({
        name: Type.String({ minLength: 1, maxLength: 160 }),
        seasonId: Uuid,
        competitionId: Type.Optional(Type.Union([Uuid, Type.Null()])),
        date: Type.Optional(Type.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
        eventIds: Type.Array(Uuid, { minItems: 1, maxItems: 100 }),
        idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })),
      }),
      response: { 201: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 422: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const key = String(request.body.idempotency_key ?? "")
      let status = 201
      let bodyOut: any = null
      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        let acquired: any = null
        if (key) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, { scopeKey: "CMD-EVT-15", commandId: "CMD-EVT-15", key, input: { name: request.body.name, seasonId: request.body.seasonId, eventIds: request.body.eventIds } }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; bodyOut = acquired.snapshot ?? { jornadaCreated: true }; return }
        }
        const result = await services.jornada.scheduleJornada(tx, principal.personId, {
          name: request.body.name,
          seasonId: request.body.seasonId,
          competitionId: request.body.competitionId ?? null,
          date: request.body.date,
          eventIds: request.body.eventIds,
        }, evaluationInstant)
        bodyOut = { jornadaCreated: true, id: result.id, matchCount: result.matchCount }
        status = 201
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 201, bodyOut)
      }, true)
      return reply.status(status).send(bodyOut)
    },
  })

  /* ── RC-14 — jornada list ── */
  registry.add({
    method: "GET",
    url: "/api/jornadas",
    security: { operationId: "RC-14", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: {
      querystring: Type.Object({
        seasonId: Type.Optional(Uuid),
        competitionId: Type.Optional(Uuid),
        limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 200 })),
      }),
      response: { 200: SilentResponse, 403: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const items = await services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) =>
        services.t03Reads.jornadaList(tx, principal.personId, { seasonId: request.query?.seasonId, competitionId: request.query?.competitionId, limit: request.query?.limit }, evaluationInstant))
      return reply.status(200).send({ items })
    },
  })

  /* ── RC-25 — jornada detail ── */
  registry.add({
    method: "GET",
    url: "/api/jornadas/:jornadaId",
    security: { operationId: "RC-25", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: { params: Type.Object({ jornadaId: Uuid }), response: { 200: SilentResponse, 403: SilentResponse, 404: SilentResponse, 500: SilentResponse } },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const jornadaId = String(request.params.jornadaId)
      const detail = await services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) =>
        services.t03Reads.jornadaDetail(tx, principal.personId, jornadaId, evaluationInstant))
      return reply.status(200).send(detail)
    },
  })
}
