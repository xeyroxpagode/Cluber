import type { FastifyInstance } from "fastify"
import { Type } from "@sinclair/typebox"
import { ProductServices } from "../product-services.js"
import { AppError } from "../shared/errors.js"

const SilentResponse = Type.Any()

type RouteInput = { app: FastifyInstance; registry: any; services: ProductServices }

export function addIamAdminRoutes({ app, registry, services }: RouteInput): void {
  function requireAdmin(request: any): Promise<any> {
    return services.principals.require(request, new Date()).then(async (principal: any) => {
      await services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx }) => {
        const authority = await services.authority.snapshot(tx, principal.personId, new Date())
        services.authority.require(authority.isAdmin, "AUTHORITY_DENIED")
      })
      return principal
    })
  }

  function requireAdminInTx(request: any, tx: any, evaluationInstant: Date): Promise<any> {
    return services.principals.requireInTx(tx, request, evaluationInstant).then(async (principal: any) => {
      const authority = await services.authority.snapshot(tx, principal.personId, evaluationInstant)
      services.authority.require(authority.isAdmin, "AUTHORITY_DENIED")
      return principal
    })
  }

  registry.add({
    method: "POST",
    url: "/api/iam/provision",
    security: { operationId: "OP-IAM-PROVISION-ACCOUNT", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      body: Type.Object({ personId: Type.String({ format: "uuid" }), idempotency_key: Type.String({ minLength: 1, maxLength: 128 }) }),
      response: { 201: SilentResponse, 400: SilentResponse, 403: SilentResponse, 409: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await requireAdmin(request)
      const personId = String(request.body.personId ?? "")
      const idempotencyKey = String(request.body.idempotency_key ?? "")
      let status = 201
      let body: any = { accountProvisioned: true }

      await services.deps.runner.run("COMMAND_SERIALIZABLE", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await requireAdminInTx(request, tx, evaluationInstant)
        const acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
          scopeKey: "OP-IAM-PROVISION-ACCOUNT", commandId: "OP-IAM-PROVISION-ACCOUNT", key: idempotencyKey, input: { personId },
        }, evaluationInstant)
        if (!acquired.acquired) {
          status = acquired.status
          body = acquired.snapshot ?? { accountProvisioned: true }
          return
        }
        const result = await services.accounts.provision(tx, principal.personId, personId, evaluationInstant)
        status = 201
        body = { accountProvisioned: true, accountId: result.account.id, personId: result.account.person_id, setupCode: result.setupCode, setupExpiresAt: result.setupExpiresAt.toISOString() }
        await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 201, body)
      }, true)

      reply.header("X-Gei-Setup-Once", "true")
      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "POST",
    url: "/api/iam/setup-code",
    security: { operationId: "CMD-IAM-05", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      body: Type.Object({ accountId: Type.String({ format: "uuid" }), idempotency_key: Type.String({ minLength: 1, maxLength: 128 }) }),
      response: { 200: SilentResponse, 403: SilentResponse, 404: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await requireAdmin(request)
      const accountId = String(request.body.accountId ?? "")
      const idempotencyKey = String(request.body.idempotency_key ?? "")
      let status = 200
      let body: any = { setupCodeReissued: true }

      await services.deps.runner.run("COMMAND_SERIALIZABLE", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await requireAdminInTx(request, tx, evaluationInstant)
        const acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
          scopeKey: "CMD-IAM-05", commandId: "CMD-IAM-05", key: idempotencyKey, input: { accountId },
        }, evaluationInstant)
        if (!acquired.acquired) { status = acquired.status; body = acquired.snapshot ?? { setupCodeReissued: true }; return }
        const result = await services.accounts.issueSetupCode(tx, principal.personId, accountId, evaluationInstant)
        status = 200
        body = { setupCodeReissued: true, accountId, setupCode: result.setupCode, expiresAt: result.expiresAt.toISOString() }
        await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, body)
      }, true)
      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "POST",
    url: "/api/accounts/:accountId/disable",
    security: { operationId: "CMD-IAM-04", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      params: Type.Object({ accountId: Type.String({ format: "uuid" }) }),
      body: Type.Object({ idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })) }),
      response: { 200: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await requireAdmin(request)
      const accountId = String(request.params.accountId ?? "")
      const idempotencyKey = String(request.body.idempotency_key ?? "")
      let status = 200
      let body: any = { accountDisabled: true }

      await services.deps.runner.run("COMMAND_SERIALIZABLE", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await requireAdminInTx(request, tx, evaluationInstant)
        let acquired: any = null
        if (idempotencyKey) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
            scopeKey: "CMD-IAM-04", commandId: "CMD-IAM-04", key: idempotencyKey, input: { accountId },
          }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; body = acquired.snapshot ?? { accountDisabled: true }; return }
        }
        await services.accounts.disable(tx, principal.personId, accountId, evaluationInstant)
        status = 200
        body = { accountDisabled: true, accountId }
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, body)
      }, true)
      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "POST",
    url: "/api/accounts/:accountId/reactivate",
    security: { operationId: "OP-IAM-REACTIVATE", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      params: Type.Object({ accountId: Type.String({ format: "uuid" }) }),
      body: Type.Object({ idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })) }),
      response: { 200: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await requireAdmin(request)
      const accountId = String(request.params.accountId ?? "")
      const idempotencyKey = String(request.body.idempotency_key ?? "")
      let status = 200
      let body: any = { accountReactivated: true }

      await services.deps.runner.run("COMMAND_SERIALIZABLE", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await requireAdminInTx(request, tx, evaluationInstant)
        let acquired: any = null
        if (idempotencyKey) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
            scopeKey: "OP-IAM-REACTIVATE", commandId: "OP-IAM-REACTIVATE", key: idempotencyKey, input: { accountId },
          }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; body = acquired.snapshot ?? { accountReactivated: true }; return }
        }
        await services.accounts.reactivate(tx, principal.personId, accountId, evaluationInstant)
        status = 200
        body = { accountReactivated: true, accountId }
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, body)
      }, true)
      return reply.status(status).send(body)
    },
  })
}

export type ProvisionBody = { personId: string; idempotency_key?: string }
