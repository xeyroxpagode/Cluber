import type { FastifyInstance } from "fastify"
import { Type } from "@sinclair/typebox"
import { ProductServices } from "../product-services.js"
import { AppError } from "../shared/errors.js"

const SilentResponse = Type.Any()

type RouteInput = { app: FastifyInstance; registry: any; services: ProductServices }

export function addPersonAdminRoutes({ app, registry, services }: RouteInput): void {
  async function requireAdminInTx(request: any, tx: any, evaluationInstant: Date): Promise<any> {
    const principal = await services.principals.requireInTx(tx, request, evaluationInstant)
    const authority = await services.authority.snapshot(tx, principal.personId, evaluationInstant)
    services.authority.require(authority.isAdmin, "AUTHORITY_DENIED")
    return principal
  }

  function requireAdmin(request: any): Promise<any> {
    return services.principals.require(request, new Date()).then(async (principal: any) => {
      await services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx }) => {
        const authority = await services.authority.snapshot(tx, principal.personId, new Date())
        services.authority.require(authority.isAdmin, "AUTHORITY_DENIED")
      })
      return principal
    })
  }

  registry.add({
    method: "POST",
    url: "/api/people",
    security: { operationId: "CMD-PPL-01", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      body: Type.Object({
        firstName: Type.String({ minLength: 1, maxLength: 100 }),
        lastName: Type.String({ minLength: 1, maxLength: 100 }),
        dni: Type.Optional(Type.String({ minLength: 1, maxLength: 40 })),
        birthDate: Type.Optional(Type.String({ format: "date" })),
        phone: Type.Optional(Type.String({ minLength: 1, maxLength: 64 })),
        email: Type.Optional(Type.String({ format: "email" })),
        idempotency_key: Type.String({ minLength: 1, maxLength: 128 }),
      }),
      response: { 201: SilentResponse, 400: SilentResponse, 403: SilentResponse, 409: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await requireAdmin(request)
      const input = {
        firstName: String(request.body.firstName ?? ""),
        lastName: String(request.body.lastName ?? ""),
        dni: request.body.dni ?? null,
        birthDate: request.body.birthDate ?? null,
        phone: request.body.phone ?? null,
        email: request.body.email ?? null,
      }
      const idempotencyKey = String(request.body.idempotency_key ?? "")
      let status = 201
      let body: any = { personCreated: true }

      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await requireAdminInTx(request, tx, evaluationInstant)
        const acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
          scopeKey: "CMD-PPL-01", commandId: "CMD-PPL-01", key: idempotencyKey, input: { firstName: input.firstName, lastName: input.lastName, email: input.email ?? "[REDACTED]" },
        }, evaluationInstant)
        if (!acquired.acquired) { status = acquired.status; body = acquired.snapshot ?? { personCreated: true }; return }
        const person = await services.people.register(tx, principal.personId, input)
        status = 201
        body = { personCreated: true, id: person.id, firstName: person.first_name, lastName: person.last_name }
        await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 201, body)
      }, true)
      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "PATCH",
    url: "/api/people/:personId/admin",
    security: { operationId: "OP-PPL-ADMIN-EDIT", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      params: Type.Object({ personId: Type.String({ format: "uuid" }) }),
      body: Type.Object({
        firstName: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
        lastName: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
        dni: Type.Optional(Type.String({ minLength: 1, maxLength: 40 })),
        birthDate: Type.Optional(Type.String({ format: "date" })),
        phone: Type.Optional(Type.String({ minLength: 1, maxLength: 64 })),
        email: Type.Optional(Type.String({ format: "email" })),
        idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })),
      }),
      response: { 200: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await requireAdmin(request)
      const personId = String(request.params.personId ?? "")
      const idempotencyKey = String(request.body.idempotency_key ?? "")
      const input = {
        firstName: request.body.firstName ?? undefined,
        lastName: request.body.lastName ?? undefined,
        dni: request.body.dni ?? undefined,
        birthDate: request.body.birthDate ?? undefined,
        phone: request.body.phone ?? undefined,
        email: request.body.email ?? undefined,
      }
      let status = 200
      let body: any = { personUpdated: true }

      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await requireAdminInTx(request, tx, evaluationInstant)
        let acquired: any = null
        if (idempotencyKey) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
            scopeKey: "OP-PPL-ADMIN-EDIT", commandId: "OP-PPL-ADMIN-EDIT", key: idempotencyKey, input: { personId },
          }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; body = acquired.snapshot ?? { personUpdated: true }; return }
        }
        const person = await services.people.updateFields(tx, principal.personId, personId, input, "OP-PPL-ADMIN-EDIT", "PERSON_ADMIN_UPDATED")
        status = 200
        body = { personUpdated: true, id: person.id, firstName: person.first_name, lastName: person.last_name }
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, body)
      }, true)
      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "POST",
    url: "/api/people/:personId/memberships",
    security: { operationId: "CMD-PPL-03", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      params: Type.Object({ personId: Type.String({ format: "uuid" }) }),
      body: Type.Object({ validFrom: Type.String({ format: "date" }), validUntil: Type.Optional(Type.String({ format: "date" })), idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })) }),
      response: { 201: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await requireAdmin(request)
      const personId = String(request.params.personId ?? "")
      const input = { validFrom: String(request.body.validFrom ?? ""), validUntil: request.body.validUntil ?? null }
      const idempotencyKey = String(request.body.idempotency_key ?? "")
      let status = 201
      let body: any = { membershipCreated: true }

      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await requireAdminInTx(request, tx, evaluationInstant)
        let acquired: any = null
        if (idempotencyKey) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
            scopeKey: "CMD-PPL-03", commandId: "CMD-PPL-03", key: idempotencyKey, input: { personId, validFrom: input.validFrom },
          }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; body = acquired.snapshot ?? { membershipCreated: true }; return }
        }
        const membership = await services.memberships.create(tx, principal.personId, personId, input)
        status = 201
        body = { membershipCreated: true, id: membership.id }
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 201, body)
      }, true)
      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "POST",
    url: "/api/people/:personId/memberships/:membershipId/end",
    security: { operationId: "CMD-PPL-04", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      params: Type.Object({ personId: Type.String({ format: "uuid" }), membershipId: Type.String({ format: "uuid" }) }),
      body: Type.Object({ at: Type.String({ format: "date" }), idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })) }),
      response: { 200: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await requireAdmin(request)
      const personId = String(request.params.personId ?? "")
      const membershipId = String(request.params.membershipId ?? "")
      const input = { at: String(request.body.at ?? "") }
      const idempotencyKey = String(request.body.idempotency_key ?? "")
      let status = 200
      let body: any = { membershipEnded: true }

      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await requireAdminInTx(request, tx, evaluationInstant)
        let acquired: any = null
        if (idempotencyKey) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
            scopeKey: "CMD-PPL-04", commandId: "CMD-PPL-04", key: idempotencyKey, input: { personId, membershipId, at: input.at },
          }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; body = acquired.snapshot ?? { membershipEnded: true }; return }
        }
        const membership = await services.memberships.end(tx, principal.personId, personId, membershipId, new Date(input.at))
        status = 200
        body = { membershipEnded: true, id: membership.id, validUntil: membership.valid_until }
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, body)
      }, true)
      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "POST",
    url: "/api/people/:personId/roles",
    security: { operationId: "CMD-PPL-05", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      params: Type.Object({ personId: Type.String({ format: "uuid" }) }),
      body: Type.Object({
        role: Type.String(), scopeType: Type.String(), scopeRefId: Type.Optional(Type.String({ format: "uuid" })),
        validFrom: Type.String({ format: "date" }), validUntil: Type.Optional(Type.String({ format: "date" })),
        reason: Type.Optional(Type.String()), idempotency_key: Type.String({ minLength: 1, maxLength: 128 }),
      }),
      response: { 201: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const personId = String(request.params.personId ?? "")
      const input = {
        role: String(request.body.role ?? ""), scopeType: String(request.body.scopeType ?? ""),
        scopeRefId: request.body.scopeRefId ?? null,
        validFrom: String(request.body.validFrom ?? ""), validUntil: request.body.validUntil ?? null, reason: request.body.reason ?? null,
      }
      const idempotencyKey = String(request.body.idempotency_key ?? "")
      let status = 201
      let body: any = { roleAssigned: true }

      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        const authority = await services.authority.snapshot(tx, principal.personId, evaluationInstant)
        services.authority.require(authority.isAdmin || authority.isSubcommittee, "AUTHORITY_DENIED")
        if (!authority.isAdmin) {
          // AUTH-08: ACT-SUBCOMMITTEE (CLUB) — sin scopes TEAM/EVENT
          services.authority.require(input.scopeType === "CLUB", "AUTHORITY_DENIED")
        }
        const acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
          scopeKey: "CMD-PPL-05", commandId: "CMD-PPL-05", key: idempotencyKey, input: { personId, role: input.role, scopeType: input.scopeType, scopeRefId: input.scopeRefId },
        }, evaluationInstant)
        if (!acquired.acquired) { status = acquired.status; body = acquired.snapshot ?? { roleAssigned: true }; return }
        const assignment = await services.roles.assign(tx, principal.personId, personId, input, evaluationInstant)
        status = 201
        body = { roleAssigned: true, id: assignment.id, role: assignment.role }
        await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 201, body)
      }, true)
      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "POST",
    url: "/api/roles/:assignmentId/end",
    security: { operationId: "CMD-PPL-06", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      params: Type.Object({ assignmentId: Type.String({ format: "uuid" }) }),
      body: Type.Object({ at: Type.String({ format: "date" }), reason: Type.Optional(Type.String()), idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })) }),
      response: { 200: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await requireAdmin(request)
      const assignmentId = String(request.params.assignmentId ?? "")
      const input = { at: String(request.body.at ?? ""), reason: request.body.reason ?? null }
      const idempotencyKey = String(request.body.idempotency_key ?? "")
      let status = 200
      let body: any = { roleEnded: true }

      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await requireAdminInTx(request, tx, evaluationInstant)
        const authority = await services.authority.snapshot(tx, principal.personId, evaluationInstant)
        services.authority.require(authority.canEndRole, "AUTHORITY_DENIED")
        let acquired: any = null
        if (idempotencyKey) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
            scopeKey: "CMD-PPL-06", commandId: "CMD-PPL-06", key: idempotencyKey, input: { assignmentId },
          }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; body = acquired.snapshot ?? { roleEnded: true }; return }
        }
        const assignment = await services.roles.end(tx, principal.personId, assignmentId, new Date(input.at), input.reason)
        status = 200
        body = { roleEnded: true, id: assignment.id }
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, body)
      }, true)
      return reply.status(status).send(body)
    },
  })
}
