import type { FastifyInstance } from "fastify"
import { Type } from "@sinclair/typebox"
import { ProductServices } from "../product-services.js"
import { AppError } from "../shared/errors.js"
import { normalizeEmail } from "../shared/normalize.js"
import { jsonbParam } from "../shared/jsonb.js"
import { sql, type Transaction } from "kysely"
import { hashSetupCode } from "../iam/codes.js"
import { randomBytes, randomUUID } from "node:crypto"
import type { DatabaseSchema } from "../db/types.js"

const SilentResponse = Type.Any()

type RouteInput = { app: FastifyInstance; registry: any; services: ProductServices }

export function addSystemRoutes({ app, registry, services }: RouteInput): void {
  async function markerExists(tx: Transaction<DatabaseSchema>): Promise<boolean> {
    const row = await tx.selectFrom("app.audit_entries")
      .select("id")
      .where("action", "=", "SYSTEM_FIRST_ADMIN_BOOTSTRAP")
      .where("source", "=", "system")
      .limit(1)
      .executeTakeFirst()
    return Boolean(row)
  }

  async function effectiveAdmins(tx: Transaction<DatabaseSchema>): Promise<number> {
    const rows = await tx.selectFrom("app.role_assignments")
      .selectAll()
      .where("role", "=", "ADMIN")
      .where("scope_type", "=", "CLUB")
      .execute()
    const now = new Date()
    return rows.filter((row) => {
      const from = new Date(row.valid_from).getTime()
      const until = row.valid_until ? new Date(row.valid_until).getTime() : Number.POSITIVE_INFINITY
      const at = now.getTime()
      return at >= from && at < until
    }).length
  }

  registry.add({
    method: "POST",
    url: "/api/system/bootstrap-first-admin",
    security: { operationId: "OP-SYSTEM-FIRST-ADMIN-BOOTSTRAP", kind: "command", auth: "public", csrf: "none", idempotency: "supported", cache: "no-store" },
    schema: {
      body: Type.Object({
        firstName: Type.String({ minLength: 1, maxLength: 100 }),
        lastName: Type.String({ minLength: 1, maxLength: 100 }),
        email: Type.String({ format: "email" }),
        username: Type.String({ minLength: 3, maxLength: 100 }),
        idempotency_key: Type.String({ minLength: 1, maxLength: 128 }),
      }),
      response: { 201: SilentResponse, 409: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      await services.principals.requirePublic(request)
      const input = {
        firstName: String(request.body.firstName ?? "").trim(),
        lastName: String(request.body.lastName ?? "").trim(),
        email: String(request.body.email ?? "").trim().toLowerCase(),
        username: String(request.body.username ?? "").trim(),
      }
      const idempotencyKey = String(request.body.idempotency_key ?? "")
      let status = 201
      let body: any = { bootstrapped: true }

      await services.deps.runner.run("COMMAND_SERIALIZABLE", "bootstrap", async ({ tx, evaluationInstant }) => {
        const existingMarker = await markerExists(tx)
        if (existingMarker) throw new AppError("BOOTSTRAP_ALREADY_EXECUTED", "First admin bootstrap was already executed", "conflict")
        const admins = await effectiveAdmins(tx)
        if (admins > 0) throw new AppError("ADMIN_ALREADY_EXISTS", "An administrator already exists", "conflict")

        const person = await tx.insertInto("app.people").values({
          id: randomUUID(),
          first_name: input.firstName, last_name: input.lastName, email: input.email,
          created_at: evaluationInstant, updated_at: evaluationInstant,
        }).returningAll().executeTakeFirstOrThrow()

        const usernameTaken = await tx.selectFrom("app.accounts").select("id")
          .where(sql<boolean>`lower(trim(username)) = ${input.username.toLowerCase()}`).executeTakeFirst()
        if (usernameTaken) throw new AppError("USERNAME_TAKEN", "Username is already taken", "conflict")

        const account = await tx.insertInto("app.accounts").values({
          id: randomUUID(),
          person_id: person.id, username: input.username, password_hash: null,
          status: "PENDING", credential_version: 1,
          setup_token_hash: null, setup_token_expires_at: null, setup_token_attempts: 0,
          created_at: evaluationInstant, updated_at: evaluationInstant,
        }).returningAll().executeTakeFirstOrThrow()

        await tx.insertInto("app.role_assignments").values({
          id: randomUUID(),
          person_id: person.id, role: "ADMIN", scope_type: "CLUB", scope_ref_id: null,
          valid_from: evaluationInstant, valid_until: null, temporal_exclusions: jsonbParam([]),
          created_at: evaluationInstant,
        }).executeTakeFirstOrThrow()

        await tx.insertInto("app.audit_entries").values({
          id: randomUUID(),
          actor_person_id: null, action: "SYSTEM_FIRST_ADMIN_BOOTSTRAP", target_type: "Person", target_id: person.id,
          reason: null, source: "system", diff: { personId: person.id, accountId: account.id, username: account.username, email: "[REDACTED]", role: "ADMIN", scope: "CLUB" },
          occurred_at: evaluationInstant,
        }).executeTakeFirstOrThrow()

        const code = `GEI-${randomBytes(18).toString("base64url")}`
        const setupExpiresAt = new Date(evaluationInstant.getTime() + 7 * 24 * 60 * 60 * 1000)
        await tx.updateTable("app.accounts").set({
          setup_token_hash: hashSetupCode(services.deps.config.secrets.authCodePepper, code),
          setup_token_expires_at: setupExpiresAt,
          updated_at: evaluationInstant,
        }).where("id", "=", account.id).executeTakeFirstOrThrow()

        status = 201
        body = { bootstrapped: true, personId: person.id, accountId: account.id, username: account.username, setupCode: code, setupExpiresAt: setupExpiresAt.toISOString() }
      }, true)

      return reply.status(status).send(body)
    },
  })

  registry.add({
    method: "POST",
    url: "/api/system/admin-recovery",
    security: { operationId: "OP-SYSTEM-ADMIN-RECOVERY", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      body: Type.Object({
        personId: Type.String({ format: "uuid" }),
        accountId: Type.Optional(Type.String({ format: "uuid" })),
        reactivateIfDisabled: Type.Optional(Type.Boolean()),
        idempotency_key: Type.String({ minLength: 1, maxLength: 128 }),
      }),
      response: { 200: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const input = {
        personId: String(request.body.personId ?? ""),
        accountId: request.body.accountId ?? null,
        reactivateIfDisabled: Boolean(request.body.reactivateIfDisabled),
      }
      const idempotencyKey = String(request.body.idempotency_key ?? "")
      let status = 200
      let body: any = { recovered: true }

      await services.deps.runner.run("COMMAND_SERIALIZABLE", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        const authority = await services.authority.snapshot(tx, principal.personId, evaluationInstant)
        const admins = await effectiveAdmins(tx)
        const subcommittees = await tx.selectFrom("app.role_assignments")
          .selectAll()
          .where("role", "=", "SUBCOMMITTEE").where("scope_type", "=", "CLUB").execute()
        const activeSub = subcommittees.filter((row) => {
          const from = new Date(row.valid_from).getTime()
          const until = row.valid_until ? new Date(row.valid_until).getTime() : Number.POSITIVE_INFINITY
          const at = new Date().getTime()
          return at >= from && at < until
        }).length
        const lockedOut = admins === 0 && activeSub === 0
        services.authority.require(authority.isAdmin || lockedOut, "AUTHORITY_DENIED")

        const acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
          scopeKey: "OP-SYSTEM-ADMIN-RECOVERY", commandId: "OP-SYSTEM-ADMIN-RECOVERY", key: idempotencyKey, input: { personId: input.personId },
        }, evaluationInstant)
        if (!acquired.acquired) { status = acquired.status; body = acquired.snapshot ?? { recovered: true }; return }

        const person = await tx.selectFrom("app.people").select("id").where("id", "=", input.personId).executeTakeFirst()
        if (!person) { status = 404; body = { recovered: false, reason: "PERSON_NOT_FOUND" }; return }

        let accountId = input.accountId
        if (!accountId) {
          const existing = await tx.selectFrom("app.accounts").select("id").where("person_id", "=", input.personId).executeTakeFirst()
          accountId = existing?.id ?? null
        }

        if (!accountId) {
          status = 404; body = { recovered: false, reason: "ACCOUNT_NOT_FOUND" }
          await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 404, body)
          return
        }

        const account = await tx.selectFrom("app.accounts").selectAll().where("id", "=", accountId).forUpdate().executeTakeFirst()
        if (!account || account.person_id !== input.personId) { status = 404; body = { recovered: false, reason: "ACCOUNT_NOT_FOUND" }; return }

        if (account.status === "DISABLED") {
          if (!input.reactivateIfDisabled) { status = 409; body = { recovered: false, reason: "ACCOUNT_DISABLED" }; return }
          await services.accounts.reactivate(tx, principal.personId, accountId, evaluationInstant)
        } else if (account.status === "PENDING") {
          status = 409; body = { recovered: false, reason: "ACCOUNT_PENDING_USE_ACTIVATION" }
          await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 409, body)
          return
        }

        const existingAdmin = await tx.selectFrom("app.role_assignments")
          .select("id").where("person_id", "=", input.personId).where("role", "=", "ADMIN").where("scope_type", "=", "CLUB")
          .where((eb) => eb("valid_until", "is", null)).executeTakeFirst()
        if (!existingAdmin) {
          await tx.insertInto("app.role_assignments").values({
            id: randomUUID(),
            person_id: input.personId, role: "ADMIN", scope_type: "CLUB", scope_ref_id: null,
            valid_from: evaluationInstant, valid_until: null, temporal_exclusions: jsonbParam([]),
            created_at: evaluationInstant,
          }).executeTakeFirstOrThrow()
        }

        await tx.insertInto("app.audit_entries").values({
          id: randomUUID(),
          actor_person_id: principal.personId, action: "SYSTEM_ADMIN_RECOVERY", target_type: "Account", target_id: accountId,
          reason: null, source: "system", diff: { personId: input.personId, accountId, status: account.status, lockedOut, roleAssigned: "ADMIN", scope: "CLUB" },
          occurred_at: evaluationInstant,
        }).executeTakeFirstOrThrow()

        status = 200
        body = { recovered: true, accountId, personId: input.personId }
        await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, body)
      }, true)
      return reply.status(status).send(body)
    },
  })
}

export type BootstrapBody = { firstName: string; lastName: string; email: string; username: string; idempotency_key: string }
