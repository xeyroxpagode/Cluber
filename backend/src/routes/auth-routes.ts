import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { Type, type Static } from "@sinclair/typebox"
import { PrincipalResolver, sessionCookieFor } from "../iam/session.js"
import { AccountService } from "../iam/account.js"
import type { Principal } from "../iam/session.js"
import { randomUUID } from "node:crypto"
import { ProductServices } from "../product-services.js"
import { RoleAssignmentService } from "../people/roles.js"
import { MembershipService } from "../people/membership.js"
import { AuthorityService } from "../authority/authority.js"
import { normalizeEmail, isValidEmail } from "../shared/normalize.js"
import { sql, type Transaction } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import { AppError } from "../shared/errors.js"

const EmptyResponse = Type.Object({})

const SilentResponse = Type.Any()

type RouteInput = {
  app: FastifyInstance
  registry: any
  services: ProductServices
}

export function addAuthRoutes({ app, registry, services }: RouteInput): void {
  const cookie = sessionCookieFor(services.deps.config)

  function sessionTokenFor(request: FastifyRequest): string | undefined {
    return typeof request.cookies?.[cookie.name] === "string" ? request.cookies[cookie.name] : undefined
  }

  registry.add({
    method: "POST",
    url: "/api/auth/login",
    security: {
      operationId: "CMD-IAM-01",
      kind: "command",
      auth: "public",
      csrf: "none",
      idempotency: "required",
      rateLimitPolicy: "PRODUCT_LOGIN",
      cache: "no-store",
    },
    schema: {
      body: Type.Object({
        email: Type.String(),
        password: Type.String(),
        idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })),
      }),
      response: {
        200: SilentResponse,
        401: SilentResponse,
        403: SilentResponse,
        429: SilentResponse,
        500: SilentResponse,
      },
    },
    async handler(request: any, reply: any) {
      await services.principals.requirePublic(request)
      const email = String(request.body.email ?? "").trim()
      const password = String(request.body.password ?? "")
      const idempotencyKey = String(request.body?.idempotency_key ?? "")

      if (!isValidEmail(email)) throw new AppError("VALIDATION_FAILED", "Email is invalid", "domain_validation", false, { email: ["invalid"] })
      if (!idempotencyKey) throw new AppError("IDEMPOTENCY_KEY_REQUIRED", "A valid Idempotency-Key is required", "transport")

      let status = 200
      let body: any = null

      await services.deps.runner.run("COMMAND_SERIALIZABLE", randomUUID(), async ({ tx, evaluationInstant }) => {
        const row = await services.accounts.authenticate(tx, email, password, evaluationInstant)
        if (!row) throw new AppError("INVALID_CREDENTIALS", "Invalid credentials", "authentication")
        const issued = await services.principals.create(tx, { id: row.id as string, credentialVersion: row.credential_version }, evaluationInstant)
        reply.setCookie(cookie.name, issued.token, {
          ...cookie.options,
          maxAge: Math.floor((issued.expiresAt.getTime() - evaluationInstant.getTime()) / 1000),
        })
        status = 200
        body = { authenticated: true, sessionId: issued.id, redirect: "/home" }
      }, true)

      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "POST",
    url: "/api/auth/activate",
    security: {
      operationId: "CMD-IAM-02",
      kind: "command",
      auth: "public",
      csrf: "none",
      idempotency: "required",
      rateLimitPolicy: "PRODUCT_ACTIVATION",
      cache: "no-store",
    },
    schema: {
      body: Type.Object({
        setupCode: Type.String({ minLength: 6, maxLength: 256 }),
        newPassword: Type.String({ minLength: 15, maxLength: 128 }),
        idempotency_key: Type.String({ minLength: 1, maxLength: 128 }),
      }),
      response: {
        200: SilentResponse,
        401: SilentResponse,
        403: SilentResponse,
        422: SilentResponse,
        429: SilentResponse,
        500: SilentResponse,
      },
    },
    async handler(request: any, reply: any) {
      const setupCode = String(request.body.setupCode ?? "")
      const newPassword = String(request.body.newPassword ?? "")
      const idempotencyKey = String(request.body?.idempotency_key ?? "")

      let status = 200
      let body: any = { sessionCreated: false, redirect: "/login" }

      await services.deps.runner.run("COMMAND_SERIALIZABLE", "activation", async ({ tx, evaluationInstant }) => {
        const acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
          scopeKey: "CMD-IAM-02",
          commandId: "CMD-IAM-02",
          key: idempotencyKey,
          input: { setupCode: "[REDACTED]", newPassword: "[REDACTED]" },
        }, evaluationInstant)
        if (!acquired.acquired) {
          status = acquired.status
          body = acquired.snapshot ?? { replayed: true, sessionCreated: false, redirect: "/login" }
          return
        }

        const result = await services.accounts.activateWithCode(tx, setupCode, newPassword, evaluationInstant)
        if (!result.ok) {
          await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 400, { replayed: true, sessionCreated: false, redirect: "/login", errorCode: result.code })
          status = result.code === "TOKEN_EXPIRED" ? 401 : result.code === "TOKEN_ATTEMPT_LIMIT" ? 429 : 400
          body = { ok: false, errorCode: result.code, sessionCreated: false, redirect: "/login" }
          return
        }

        status = 200
        body = { ok: true, sessionCreated: false, redirect: "/login", accountId: result.accountId, personId: result.personId }
        await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, {
          replayed: true,
          sessionCreated: false,
          redirect: "/login",
          accountId: result.accountId,
          personId: result.personId,
        })
      }, true)

      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "POST",
    url: "/api/auth/logout",
    security: {
      operationId: "CMD-IAM-LOGOUT",
      kind: "command",
      auth: "required",
      csrf: "required",
      idempotency: "supported",
      rateLimitPolicy: undefined,
      cache: "no-store",
    },
    schema: {
      body: Type.Optional(Type.Object({ idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })) })),
      response: {
        200: SilentResponse,
        401: SilentResponse,
        403: SilentResponse,
        500: SilentResponse,
      },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const idempotencyKey = String(request.body?.idempotency_key ?? "")

      let status = 200
      let body: any = { loggedOut: true }

      if (idempotencyKey) {
        await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx }) => {
          const acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
            scopeKey: "CMD-IAM-LOGOUT",
            commandId: "CMD-IAM-LOGOUT",
            key: idempotencyKey,
            input: { sessionId: principal.sessionId },
          }, new Date())
          if (!acquired.acquired) {
            status = acquired.status
            body = acquired.snapshot ?? { loggedOut: true }
            return
          }
          await services.principals.revokeSession(tx, principal.sessionId, new Date())
          await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, { loggedOut: true })
        }, true)
      } else {
        await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx }) => {
          await services.principals.revokeSession(tx, principal.sessionId, new Date())
        })
      }

      reply.clearCookie(cookie.name, { path: cookie.options.path, sameSite: cookie.options.sameSite, secure: cookie.options.secure, httpOnly: true })
      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "POST",
    url: "/api/account/change-password",
    security: {
      operationId: "CMD-IAM-03",
      kind: "command",
      auth: "required",
      csrf: "required",
      idempotency: "required",
      rateLimitPolicy: undefined,
      cache: "no-store",
    },
    schema: {
      body: Type.Object({
        currentPassword: Type.String({ minLength: 1, maxLength: 128 }),
        newPassword: Type.String({ minLength: 15, maxLength: 128 }),
        idempotency_key: Type.String({ minLength: 1, maxLength: 128 }),
      }),
      response: {
        200: SilentResponse,
        401: SilentResponse,
        403: SilentResponse,
        409: SilentResponse,
        422: SilentResponse,
        500: SilentResponse,
      },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const currentPassword = String(request.body.currentPassword ?? "")
      const newPassword = String(request.body.newPassword ?? "")
      const idempotencyKey = String(request.body?.idempotency_key ?? "")

      let status = 200
      let body: any = { passwordChanged: true, requiresLogin: true }

      await services.deps.runner.run("COMMAND_SERIALIZABLE", principal.sessionId, async ({ tx, evaluationInstant }) => {
        const acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
          scopeKey: "CMD-IAM-03",
          commandId: "CMD-IAM-03",
          key: idempotencyKey,
          input: { currentPassword: "[REDACTED]", newPassword: "[REDACTED]" },
        }, evaluationInstant)
        if (!acquired.acquired) {
          status = acquired.status
          body = acquired.snapshot ?? { passwordChanged: true, requiresLogin: true }
          return
        }
        await services.accounts.changePassword(tx, principal.accountId, principal.accountId, currentPassword, newPassword, evaluationInstant)
        await services.principals.revokeAccountSessions(tx, principal.accountId, evaluationInstant)
        status = 200
        body = { passwordChanged: true, requiresLogin: true, accountId: principal.accountId }
        await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, { passwordChanged: true, requiresLogin: true, accountId: principal.accountId })
      }, true)

      reply.clearCookie(cookie.name, { path: cookie.options.path, sameSite: cookie.options.sameSite, secure: cookie.options.secure, httpOnly: true })
      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "POST",
    url: "/api/account/request-email-change",
    security: {
      operationId: "CMD-PPL-02-EMAIL-REQUEST",
      kind: "command",
      auth: "required",
      csrf: "required",
      idempotency: "required",
      rateLimitPolicy: undefined,
      cache: "no-store",
    },
    schema: {
      body: Type.Object({
        newEmail: Type.String(),
        idempotency_key: Type.String({ minLength: 1, maxLength: 128 }),
      }),
      response: {
        200: SilentResponse,
        400: SilentResponse,
        403: SilentResponse,
        409: SilentResponse,
        500: SilentResponse,
      },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const newEmail = String(request.body.newEmail ?? "").trim()
      const idempotencyKey = String(request.body?.idempotency_key ?? "")

      let status = 200
      let body: any = { verificationRequired: true }

      await services.deps.runner.run("COMMAND_SERIALIZABLE", principal.sessionId, async ({ tx, evaluationInstant }) => {
        const acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
          scopeKey: "CMD-PPL-02",
          commandId: "CMD-PPL-02",
          key: idempotencyKey,
          input: { newEmail: normalizeEmail(newEmail) ?? "[REDACTED]" },
        }, evaluationInstant)
        if (!acquired.acquired) {
          status = acquired.status
          body = acquired.snapshot ?? { verificationRequired: true }
          return
        }
        const result = await services.accounts.requestEmailChange(tx, principal.personId, principal.accountId, newEmail, evaluationInstant)
        status = 200
        body = { ok: true, verificationRequired: true, challengeId: result.challengeId, expiresAt: result.expiresAt.toISOString() }
        if (result.emailCode !== undefined) body.emailCode = result.emailCode
        await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, body)
      }, true)

      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "POST",
    url: "/api/account/confirm-email-change",
    security: {
      operationId: "CMD-PPL-02-EMAIL-CONFIRM",
      kind: "command",
      auth: "required",
      csrf: "required",
      idempotency: "supported",
      rateLimitPolicy: undefined,
      cache: "no-store",
    },
    schema: {
      body: Type.Object({
        emailCode: Type.String({ minLength: 6, maxLength: 256 }),
        idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })),
      }),
      response: {
        200: SilentResponse,
        400: SilentResponse,
        403: SilentResponse,
        409: SilentResponse,
        500: SilentResponse,
      },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const emailCode = String(request.body.emailCode ?? "")
      const idempotencyKey = String(request.body?.idempotency_key ?? "")

      let status = 200
      let body: any = { emailChanged: false }

      await services.deps.runner.run("COMMAND_SERIALIZABLE", principal.sessionId, async ({ tx, evaluationInstant }) => {
        let acquired: any = null
        if (idempotencyKey) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
            scopeKey: "CMD-PPL-02",
            commandId: "CMD-PPL-02",
            key: idempotencyKey,
            input: { emailCode: "[REDACTED]" },
          }, evaluationInstant)
          if (!acquired.acquired) {
            status = acquired.status
            body = acquired.snapshot ?? { emailChanged: false }
            return
          }
        }
        const result = await services.accounts.confirmEmailChange(tx, principal.personId, principal.accountId, emailCode, evaluationInstant)
        if (!result.ok) {
          if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 400, { emailChanged: false, errorCode: result.code })
          status = 400
          body = { ok: false, errorCode: result.code }
          return
        }
        status = 200
        body = { ok: true, emailChanged: true, email: result.email }
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, body)
      }, true)

      return reply.status(status).send(body)
    },
  })
}

const LoginSchema = Type.Object({
  email: Type.String(),
  password: Type.String(),
  idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })),
})
export type LoginBody = Static<typeof LoginSchema>
