import type { FastifyInstance } from "fastify"
import { Type } from "@sinclair/typebox"
import { ProductServices } from "../product-services.js"
import { PrincipalResolver } from "../iam/session.js"
import { normalizeEmail } from "../shared/normalize.js"
import { AppError } from "../shared/errors.js"

const SilentResponse = Type.Any()

type RouteInput = { app: FastifyInstance; registry: any; services: ProductServices }

export function addPersonRoutes({ app, registry, services }: RouteInput): void {
  function authPrincipal(request: any): Promise<any> {
    return services.principals.require(request, new Date())
  }

  registry.add({
    method: "GET",
    url: "/api/me",
    security: {
      operationId: "RC-28",
      kind: "query",
      auth: "required",
      csrf: "none",
      idempotency: "forbidden",
      cache: "no-store",
    },
    schema: {
      response: { 200: SilentResponse, 401: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await authPrincipal(request)
      const profile = await services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx }) => {
        return services.reads.self(tx, principal.personId, new Date())
      })
      return reply.status(200).send({
        authenticated: true,
        csrfToken: principal.csrfToken,
        principal: {
          sessionId: principal.sessionId,
          accountId: principal.accountId,
          personId: principal.personId,
          username: principal.username,
          credentialVersion: principal.credentialVersion,
          csrfToken: principal.csrfToken,
          expiresAt: principal.expiresAt.toISOString(),
        },
        operations: profile.operations,
        canAccessApplication: profile.canAccessApplication,
        id: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        username: profile.username,
        email: profile.email,
        phone: profile.phone,
        dni: profile.dni,
        birthDate: profile.birthDate,
        membershipActive: profile.membershipActive,
        profileCompleted: profile.profileCompleted,
        accountStatus: profile.accountStatus,
        accountId: profile.accountId,
        credentialVersion: profile.credentialVersion,
        activatedAt: profile.activatedAt,
        disabledAt: profile.disabledAt,
        roleAssignments: profile.roleAssignments,
        teamAssignments: profile.teamAssignments,
        teams: profile.teams,
        role: profile.role,
        isAdmin: profile.isAdmin,
        isSubcommittee: profile.isSubcommittee,
        canManagePeople: profile.canManagePeople,
        canManageStructure: profile.canManageStructure,
        canManageCompetitions: profile.canManageCompetitions,
        canViewCompetitions: profile.canViewCompetitions,
        canViewAudit: profile.canViewAudit,
        canAssignRole: profile.canAssignRole,
        canEndRole: profile.canEndRole,
        canRegisterPlayer: profile.canRegisterPlayer,
        canManageTeams: profile.canManageTeams,
      })
    },
  })

  registry.add({
    method: "PATCH",
    url: "/api/people/self/identity",
    security: {
      operationId: "OP-PPL-SELF-IDENTITY-EDIT",
      kind: "command",
      auth: "required",
      csrf: "required",
      idempotency: "supported",
      cache: "no-store",
    },
    schema: {
      body: Type.Object({
        firstName: Type.String({ minLength: 1, maxLength: 100 }),
        lastName: Type.String({ minLength: 1, maxLength: 100 }),
        idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })),
      }),
      response: { 200: SilentResponse, 400: SilentResponse, 401: SilentResponse, 403: SilentResponse, 409: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await authPrincipal(request)
      const firstName = String(request.body.firstName ?? "").trim()
      const lastName = String(request.body.lastName ?? "").trim()
      const idempotencyKey = String(request.body.idempotency_key ?? "")
      let status = 200
      let body: any = { identityUpdated: true }

      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        let acquired: any = null
        if (idempotencyKey) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
            scopeKey: "OP-PPL-SELF-IDENTITY-EDIT", commandId: "OP-PPL-SELF-IDENTITY-EDIT", key: idempotencyKey,
            input: { firstName, lastName },
          }, evaluationInstant)
          if (!acquired.acquired) {
            status = acquired.status
            body = acquired.snapshot ?? { identityUpdated: true }
            return
          }
        }
        const changed = await services.people.selfUpdateIdentity(tx, principal.personId, { firstName, lastName })
        status = 200
        body = { identityUpdated: true, firstName: changed.first_name, lastName: changed.last_name }
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, body)
      }, true)
      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "PATCH",
    url: "/api/people/self/phone",
    security: {
      operationId: "CMD-PPL-02",
      kind: "command",
      auth: "required",
      csrf: "required",
      idempotency: "supported",
      cache: "no-store",
    },
    schema: {
      body: Type.Object({ phone: Type.Union([Type.String(), Type.Null()]), idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })) }),
      response: { 200: SilentResponse, 400: SilentResponse, 401: SilentResponse, 403: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await authPrincipal(request)
      const phone = request.body.phone === null ? null : String(request.body.phone ?? "")
      const idempotencyKey = String(request.body.idempotency_key ?? "")
      let status = 200
      let body: any = { phoneUpdated: true }

      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        let acquired: any = null
        if (idempotencyKey) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
            scopeKey: "CMD-PPL-02", commandId: "CMD-PPL-02", key: idempotencyKey, input: { phone: "[REDACTED_CONTACT]" },
          }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; body = acquired.snapshot ?? { phoneUpdated: true }; return }
        }
        const updated = await services.people.selfUpdatePhone(tx, principal.personId, phone)
        status = 200
        body = { phoneUpdated: true, phone: null }
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, body)
      }, true)
      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "GET",
    url: "/api/management/people",
    security: {
      operationId: "RC-08",
      kind: "query",
      auth: "required",
      csrf: "none",
      idempotency: "forbidden",
      cache: "no-store",
    },
    schema: { response: { 200: SilentResponse, 403: SilentResponse, 500: SilentResponse } },
    async handler(request: any, reply: any) {
      const principal = await authPrincipal(request)
      const snapshot = await services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx }) => {
        const authority = await services.authority.snapshot(tx, principal.personId, new Date())
        if (!authority.canManagePeople) throw new AppError("AUTHORITY_DENIED", "You do not have authority for people management", "authorization")
        return services.reads.managementPeople(tx, authority.isAdmin ? "admin" : "subcommittee", new Date())
      })
      return reply.status(200).send({ items: snapshot })
    },
  })
}
