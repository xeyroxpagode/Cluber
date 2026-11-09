import type { FastifyInstance } from "fastify"
import { Type } from "@sinclair/typebox"
import { ProductServices } from "../product-services.js"
import { AppError } from "../shared/errors.js"

const SilentResponse = Type.Any()

type RouteInput = { app: FastifyInstance; registry: any; services: ProductServices }

function parseDate(value: unknown, field: string): string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new AppError("VALIDATION_FAILED", `${field} must use YYYY-MM-DD`, "domain_validation", false, { [field]: ["invalid"] })
  return value
}

export function addAffiliationRoutes({ app, registry, services }: RouteInput): void {
  async function requireAffiliationAuthority(request: any, tx: any, evaluationInstant: Date): Promise<any> {
    const principal = await services.principals.requireInTx(tx, request, evaluationInstant)
    const authority = await services.authority.snapshot(tx, principal.personId, evaluationInstant)
    services.authority.require(authority.canRegisterPlayer || authority.isAdmin || authority.coachTeamIds.length > 0, "AUTHORITY_DENIED")
    return principal
  }

  registry.add({
    method: "POST",
    url: "/api/teams/:teamId/players",
    security: { operationId: "CMD-PPL-07", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      params: Type.Object({ teamId: Type.String({ format: "uuid" }) }),
      body: Type.Object({ personId: Type.String({ format: "uuid" }), validFrom: Type.Optional(Type.String({ format: "date" })), validUntil: Type.Optional(Type.String({ format: "date" })), reason: Type.Optional(Type.String()), idempotency_key: Type.String({ minLength: 1, maxLength: 128 }) }),
      response: { 201: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const teamId = String(request.params.teamId ?? "")
      const input = { personId: String(request.body.personId ?? ""), validFrom: request.body.validFrom ?? null, validUntil: request.body.validUntil ?? null, reason: request.body.reason ?? null }
      const idempotencyKey = String(request.body.idempotency_key ?? "")
      let status = 201
      let body: any = { playerAdded: true }

      await services.deps.runner.run("COMMAND_SERIALIZABLE", "add-player", async ({ tx, evaluationInstant }) => {
        const principal = await requireAffiliationAuthority(request, tx, evaluationInstant)
        const acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
          scopeKey: "CMD-PPL-07", commandId: "CMD-PPL-07", key: idempotencyKey, input: { personId: input.personId, teamId },
        }, evaluationInstant)
        if (!acquired.acquired) { status = acquired.status; body = acquired.snapshot ?? { playerAdded: true }; return }
        const result = await services.affiliations.add(tx, principal.personId, { ...input, teamId }, evaluationInstant, services.deps.config.clubTimeZone)
        status = 201
        body = { playerAdded: true, assignmentId: result.assignment.id, roleAssignmentId: result.role.id, teamId }
        await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 201, body)
      }, true)
      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "POST",
    url: "/api/players/move",
    security: { operationId: "CMD-PPL-08", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      body: Type.Object({ personId: Type.String({ format: "uuid" }), sourceTeamId: Type.String({ format: "uuid" }), teamId: Type.String({ format: "uuid" }), reason: Type.Optional(Type.String()), idempotency_key: Type.String({ minLength: 1, maxLength: 128 }) }),
      response: { 200: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const input = {
        personId: String(request.body.personId ?? ""),
        sourceTeamId: String(request.body.sourceTeamId ?? ""),
        teamId: String(request.body.teamId ?? ""),
        reason: request.body.reason ?? null,
      }
      const idempotencyKey = String(request.body.idempotency_key ?? "")
      let status = 200
      let body: any = { playerMoved: true }

      await services.deps.runner.run("COMMAND_SERIALIZABLE", "move-player", async ({ tx, evaluationInstant }) => {
        const principal = await requireAffiliationAuthority(request, tx, evaluationInstant)
        const acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
          scopeKey: "CMD-PPL-08", commandId: "CMD-PPL-08", key: idempotencyKey, input: { personId: input.personId, sourceTeamId: input.sourceTeamId, teamId: input.teamId },
        }, evaluationInstant)
        if (!acquired.acquired) { status = acquired.status; body = acquired.snapshot ?? { playerMoved: true }; return }
        const result = await services.affiliations.move(tx, principal.personId, input, evaluationInstant, services.deps.config.clubTimeZone)
        status = 200
        body = { playerMoved: true, assignmentId: result.assignment.id, roleAssignmentId: result.role.id, teamId: input.teamId }
        await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, body)
      }, true)
      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "POST",
    url: "/api/players/remove",
    security: { operationId: "CMD-PPL-09", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      body: Type.Object({ personId: Type.String({ format: "uuid" }), teamId: Type.String({ format: "uuid" }), reason: Type.Optional(Type.String()), idempotency_key: Type.String({ minLength: 1, maxLength: 128 }) }),
      response: { 200: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const input = { personId: String(request.body.personId ?? ""), teamId: String(request.body.teamId ?? ""), reason: request.body.reason ?? null }
      const idempotencyKey = String(request.body.idempotency_key ?? "")
      let status = 200
      let body: any = { playerRemoved: true }

      await services.deps.runner.run("COMMAND_SERIALIZABLE", "remove-player", async ({ tx, evaluationInstant }) => {
        const principal = await requireAffiliationAuthority(request, tx, evaluationInstant)
        const acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
          scopeKey: "CMD-PPL-09", commandId: "CMD-PPL-09", key: idempotencyKey, input: { personId: input.personId, teamId: input.teamId },
        }, evaluationInstant)
        if (!acquired.acquired) { status = acquired.status; body = acquired.snapshot ?? { playerRemoved: true }; return }
        const result = await services.affiliations.remove(tx, principal.personId, { ...input, teamId: input.teamId }, evaluationInstant, services.deps.config.clubTimeZone)
        status = 200
        body = { playerRemoved: true, assignmentId: result.assignmentId, roleAssignmentId: result.roleAssignmentId, teamId: input.teamId }
        await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, body)
      }, true)
      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "GET",
    url: "/api/teams/:teamId/roster",
    security: { operationId: "RC-04", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: { params: Type.Object({ teamId: Type.String({ format: "uuid" }) }), response: { 200: SilentResponse, 403: SilentResponse, 404: SilentResponse, 500: SilentResponse } },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const teamId = String(request.params.teamId ?? "")
      const roster = await services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx }) => {
        const viewer = await tx.selectFrom("app.people").select("id").where("id", "=", principal.personId).executeTakeFirst()
        if (!viewer) throw new AppError("PERSON_NOT_FOUND", "Person was not found", "not_found")
        return services.reads.roster(tx, teamId, viewer.id, new Date())
      })
      return reply.status(200).send({ items: roster })
    },
  })
}
