import type { FastifyInstance } from "fastify"
import { Type } from "@sinclair/typebox"
import { ProductServices } from "../product-services.js"
import { AppError } from "../shared/errors.js"

const SilentResponse = Type.Any()

type RouteInput = { app: FastifyInstance; registry: any; services: ProductServices }

export function addStructureRoutes({ app, registry, services }: RouteInput): void {
  function requireAdmin(request: any) {
    return services.principals.require(request, new Date()).then((principal: any) => {
      const operation = request.routeOptions?.config?.security?.operationId ?? "STRUCTURE_OP"
      return services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx }) => {
        const authority = await services.authority.snapshot(tx, principal.personId, new Date())
        services.authority.require(authority.isAdmin, "AUTHORITY_DENIED")
        return principal
      })
    })
  }

  registry.add({
    method: "POST",
    url: "/api/structure/seasons",
    security: { operationId: "CMD-STR-01", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      body: Type.Object({ name: Type.String({ minLength: 1, maxLength: 160 }), startsOn: Type.String({ format: "date" }), endsOn: Type.String({ format: "date" }), idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })) }),
      response: { 201: SilentResponse, 400: SilentResponse, 403: SilentResponse, 409: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await requireAdmin(request)
      const input = { name: String(request.body.name ?? "").trim(), startsOn: String(request.body.startsOn ?? ""), endsOn: String(request.body.endsOn ?? "") }
      const key = String(request.body.idempotency_key ?? "")
      let status = 201
      let body: any = { seasonCreated: true }

      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        let acquired: any = null
        if (key) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, { scopeKey: "CMD-STR-01", commandId: "CMD-STR-01", key, input: { name: input.name } }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; body = acquired.snapshot ?? { seasonCreated: true }; return }
        }
        const season = await services.structure.createSeason(tx, principal.personId, input)
        status = 201; body = { seasonCreated: true, id: season.id, name: season.name }
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 201, body)
      }, true)
      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "POST",
    url: "/api/structure/divisions",
    security: { operationId: "CMD-STR-03", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      body: Type.Object({ name: Type.String({ minLength: 1, maxLength: 160 }), idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })) }),
      response: { 201: SilentResponse, 400: SilentResponse, 403: SilentResponse, 409: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await requireAdmin(request)
      const input = { name: String(request.body.name ?? "").trim() }
      const key = String(request.body.idempotency_key ?? "")
      let status = 201
      let body: any = { divisionCreated: true }

      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        let acquired: any = null
        if (key) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, { scopeKey: "CMD-STR-03", commandId: "CMD-STR-03", key, input: { name: input.name } }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; body = acquired.snapshot ?? { divisionCreated: true }; return }
        }
        const division = await services.structure.createDivision(tx, principal.personId, input)
        status = 201; body = { divisionCreated: true, id: division.id, name: division.name }
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 201, body)
      }, true)
      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "POST",
    url: "/api/structure/lines",
    security: { operationId: "CMD-STR-06", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      body: Type.Object({ name: Type.String({ minLength: 1, maxLength: 160 }), idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })) }),
      response: { 201: SilentResponse, 400: SilentResponse, 403: SilentResponse, 409: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await requireAdmin(request)
      const input = { name: String(request.body.name ?? "").trim() }
      const key = String(request.body.idempotency_key ?? "")
      let status = 201
      let body: any = { lineCreated: true }

      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        let acquired: any = null
        if (key) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, { scopeKey: "CMD-STR-06", commandId: "CMD-STR-06", key, input: { name: input.name } }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; body = acquired.snapshot ?? { lineCreated: true }; return }
        }
        const line = await services.structure.createLine(tx, principal.personId, input)
        status = 201; body = { lineCreated: true, id: line.id, name: line.name }
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 201, body)
      }, true)
      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "POST",
    url: "/api/structure/teams",
    security: { operationId: "CMD-STR-09", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      body: Type.Object({ seasonId: Type.String({ format: "uuid" }), divisionId: Type.String({ format: "uuid" }), lineId: Type.String({ format: "uuid" }), idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })) }),
      response: { 201: SilentResponse, 400: SilentResponse, 403: SilentResponse, 409: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await requireAdmin(request)
      const input = { seasonId: String(request.body.seasonId ?? ""), divisionId: String(request.body.divisionId ?? ""), lineId: String(request.body.lineId ?? "") }
      const key = String(request.body.idempotency_key ?? "")
      let status = 201
      let body: any = { teamCreated: true }

      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        let acquired: any = null
        if (key) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, { scopeKey: "CMD-STR-09", commandId: "CMD-STR-09", key, input: { seasonId: input.seasonId, divisionId: input.divisionId, lineId: input.lineId } }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; body = acquired.snapshot ?? { teamCreated: true }; return }
        }
        const team = await services.structure.createTeam(tx, principal.personId, input)
        status = 201; body = { teamCreated: true, id: team.id, state: team.state }
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 201, body)
      }, true)
      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "POST",
    url: "/api/structure/teams/:teamId/activate",
    security: { operationId: "CMD-STR-11", kind: "command", auth: "required", csrf: "required", idempotency: "none", cache: "no-store" },
    schema: { params: Type.Object({ teamId: Type.String({ format: "uuid" }) }), response: { 200: SilentResponse, 403: SilentResponse, 409: SilentResponse, 500: SilentResponse } },
    async handler(request: any, reply: any) {
      const principal = await requireAdmin(request)
      const teamId = String(request.params.teamId ?? "")
      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        await services.structure.activateTeam(tx, principal.personId, teamId)
      }, true)
      return reply.status(200).send({ teamActivated: true, teamId })
    },
  })

  registry.add({
    method: "POST",
    url: "/api/structure/teams/:teamId/archive",
    security: { operationId: "CMD-STR-12", kind: "command", auth: "required", csrf: "required", idempotency: "none", cache: "no-store" },
    schema: { params: Type.Object({ teamId: Type.String({ format: "uuid" }) }), response: { 200: SilentResponse, 403: SilentResponse, 409: SilentResponse, 500: SilentResponse } },
    async handler(request: any, reply: any) {
      const principal = await requireAdmin(request)
      const teamId = String(request.params.teamId ?? "")
      await services.deps.runner.run("COMMAND_SERIALIZABLE", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        await services.structure.archiveTeam(tx, principal.personId, teamId, evaluationInstant, services.deps.config.clubTimeZone)
      }, true)
      return reply.status(200).send({ teamArchived: true, teamId })
    },
  })

  registry.add({
    method: "POST",
    url: "/api/structure/venues",
    security: { operationId: "CMD-STR-13", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      body: Type.Object({ name: Type.String({ minLength: 1, maxLength: 160 }), address: Type.String({ minLength: 1, maxLength: 300 }), idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })) }),
      response: { 201: SilentResponse, 400: SilentResponse, 403: SilentResponse, 409: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await requireAdmin(request)
      const input = { name: String(request.body.name ?? "").trim(), address: String(request.body.address ?? "").trim() }
      const key = String(request.body.idempotency_key ?? "")
      let status = 201
      let body: any = { venueCreated: true }

      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        let acquired: any = null
        if (key) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, { scopeKey: "CMD-STR-13", commandId: "CMD-STR-13", key, input: { name: input.name, address: "[REDACTED]" } }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; body = acquired.snapshot ?? { venueCreated: true }; return }
        }
        const venue = await services.structure.createVenue(tx, principal.personId, input)
        status = 201; body = { venueCreated: true, id: venue.id, name: venue.name }
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 201, body)
      }, true)
      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "POST",
    url: "/api/structure/competitions",
    security: { operationId: "CMD-CMP-01", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      body: Type.Object({ seasonId: Type.String({ format: "uuid" }), name: Type.String({ minLength: 1, maxLength: 160 }), idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })) }),
      response: { 201: SilentResponse, 400: SilentResponse, 403: SilentResponse, 409: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const input = { seasonId: String(request.body.seasonId ?? ""), name: String(request.body.name ?? "").trim() }
      const key = String(request.body.idempotency_key ?? "")
      let status = 201
      let body: any = { competitionCreated: true }

      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        const authority = await services.authority.snapshot(tx, principal.personId, evaluationInstant)
        services.authority.require(authority.canManageCompetitions, "AUTHORITY_DENIED")
        let acquired: any = null
        if (key) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, { scopeKey: "CMD-CMP-01", commandId: "CMD-CMP-01", key, input: { seasonId: input.seasonId, name: input.name } }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; body = acquired.snapshot ?? { competitionCreated: true }; return }
        }
        const competition = await services.structure.createCompetition(tx, principal.personId, input)
        status = 201; body = { competitionCreated: true, id: competition.id, name: competition.name }
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 201, body)
      }, true)
      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "GET",
    url: "/api/structure/competitions",
    security: { operationId: "RC-13", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: { response: { 200: SilentResponse, 403: SilentResponse, 500: SilentResponse } },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const competitions = await services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx }) => services.structure.competitions(tx))
      return reply.status(200).send({ items: competitions })
    },
  })

  registry.add({
    method: "GET",
    url: "/api/structure",
    security: { operationId: "RC-13-STRUCTURE", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: { response: { 200: SilentResponse, 403: SilentResponse, 500: SilentResponse } },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const snapshot = await services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx }) => services.reads.structure(tx))
      return reply.status(200).send(snapshot)
    },
  })
}
