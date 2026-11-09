import { randomUUID } from "node:crypto"
import type { Transaction, Kysely } from "kysely"
import type { AppConfig } from "../config/load-config.js"
import type { DatabaseSchema } from "../db/types.js"
import { assertCsrf, assertOrigin } from "../http/security.js"
import { sessionCookie } from "../http/session-cookie.js"
import { AppError } from "../shared/errors.js"
import { deriveCsrfToken } from "../shared/crypto.js"
import { newSessionToken, hashSessionToken } from "./codes.js"

export interface Principal {
  sessionId: string
  accountId: string
  personId: string
  username: string | null
  credentialVersion: number
  csrfToken: string
  expiresAt: Date
}

type RequestLike = {
  method?: string
  headers: Record<string, unknown>
  cookies?: Record<string, string | undefined>
}

const SESSION_TTL_MS = 8 * 60 * 60 * 1000
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"])

function present(token: string | undefined): token is string {
  return typeof token === "string" && token.length >= 20 && token.length <= 512
}

function isUnsafe(request: RequestLike): boolean {
  return !SAFE_METHODS.has(request.method ?? "GET")
}

async function loadSession(database: Kysely<DatabaseSchema> | Transaction<DatabaseSchema>, token: string, now: Date) {
  const row = await database.selectFrom("infra.auth_sessions")
    .innerJoin("app.accounts", "app.accounts.id", "infra.auth_sessions.account_id")
    .innerJoin("app.people", "app.people.id", "app.accounts.person_id")
    .select([
      "infra.auth_sessions.id as sessionId",
      "infra.auth_sessions.account_id as accountId",
      "infra.auth_sessions.credential_version as sessionCredentialVersion",
      "infra.auth_sessions.expires_at as expiresAt",
      "infra.auth_sessions.revoked_at as revokedAt",
      "app.accounts.person_id as personId",
      "app.accounts.username as username",
      "app.accounts.status as accountStatus",
      "app.accounts.credential_version as accountCredentialVersion",
    ])
    .where("infra.auth_sessions.session_token_hash", "=", hashSessionToken(token))
    .executeTakeFirst()
  if (!row) return null
  const denied =
    row.revokedAt !== null ||
    new Date(row.expiresAt).getTime() <= now.getTime() ||
    row.accountStatus !== "ACTIVE" ||
    row.sessionCredentialVersion !== row.accountCredentialVersion
  return denied ? null : row
}

export class PrincipalResolver {
  constructor(private readonly database: Kysely<DatabaseSchema>, private readonly config: Pick<AppConfig, "environment" | "secrets" | "publicOrigin">) {}

  cookieName(): string {
    return sessionCookie(this.config.environment).name
  }

  async snapshot(request: Pick<RequestLike, "cookies">, now = new Date()): Promise<Principal | null> {
    const token = request.cookies?.[this.cookieName()]
    if (!present(token)) return null
    const row = await loadSession(this.database, token, now)
    if (!row) return null
    return {
      sessionId: row.sessionId,
      accountId: row.accountId,
      personId: row.personId,
      username: row.username,
      credentialVersion: row.accountCredentialVersion,
      csrfToken: deriveCsrfToken(this.config.secrets.csrfHmacSecret, row.sessionId),
      expiresAt: new Date(row.expiresAt),
    }
  }

  async require(request: RequestLike, now = new Date()): Promise<Principal> {
    const unsafe = isUnsafe(request)
    if (unsafe) assertOrigin(request as never, this.config.publicOrigin)
    const principal = await this.snapshot(request, now)
    if (!principal) throw new AppError("SESSION_INVALID", "Authentication is required", "authentication")
    if (unsafe) assertCsrf(request as never, this.config.secrets.csrfHmacSecret, principal.sessionId)
    return principal
  }

  /** Público: sin sesión previa, sólo verificación de origen. Nunca aplica CSRF derivado de sesión. */
  async requirePublic(request: RequestLike): Promise<void> {
    const unsafe = isUnsafe(request)
    if (unsafe) assertOrigin(request as never, this.config.publicOrigin)
  }

  /** Opcional: sin sesión es permitido; si hay sesión válida, aplica CSRF derivado de sesión. */
  async requireOptional(request: RequestLike, now = new Date()): Promise<Principal | null> {
    const unsafe = isUnsafe(request)
    if (unsafe) assertOrigin(request as never, this.config.publicOrigin)
    const principal = await this.snapshot(request, now)
    if (!principal) return null
    if (unsafe) assertCsrf(request as never, this.config.secrets.csrfHmacSecret, principal.sessionId)
    return principal
  }

  async requireInTx(tx: Transaction<DatabaseSchema>, request: RequestLike, now: Date): Promise<Principal> {
    const unsafe = isUnsafe(request)
    if (unsafe) assertOrigin(request as never, this.config.publicOrigin)
    const token = request.cookies?.[this.cookieName()]
    if (!present(token)) throw new AppError("SESSION_INVALID", "Authentication is required", "authentication")
    const row = await loadSession(tx, token, now)
    if (!row) throw new AppError("SESSION_INVALID", "Authentication is required", "authentication")
    if (unsafe) assertCsrf(request as never, this.config.secrets.csrfHmacSecret, row.sessionId)
    return {
      sessionId: row.sessionId,
      accountId: row.accountId,
      personId: row.personId,
      username: row.username,
      credentialVersion: row.accountCredentialVersion,
      csrfToken: deriveCsrfToken(this.config.secrets.csrfHmacSecret, row.sessionId),
      expiresAt: new Date(row.expiresAt),
    }
  }

  async create(tx: Transaction<DatabaseSchema>, account: { id: string; credentialVersion: number }, now: Date) {
    const token = newSessionToken()
    const expiresAt = new Date(now.getTime() + SESSION_TTL_MS)
    const inserted = await tx.insertInto("infra.auth_sessions").values({
      id: randomUUID(),
      account_id: account.id,
      session_token_hash: hashSessionToken(token),
      credential_version: account.credentialVersion,
      created_at: now,
      expires_at: expiresAt,
    }).returning("id").executeTakeFirstOrThrow()
    return {
      id: inserted.id,
      token,
      csrfToken: deriveCsrfToken(this.config.secrets.csrfHmacSecret, inserted.id),
      expiresAt,
    }
  }

  async revokeSession(tx: Transaction<DatabaseSchema>, sessionId: string, now: Date): Promise<boolean> {
    const result = await tx.updateTable("infra.auth_sessions").set({ revoked_at: now })
      .where("id", "=", sessionId)
      .where("revoked_at", "is", null)
      .executeTakeFirst()
    return Number(result.numUpdatedRows) > 0
  }

  async revokeAccountSessions(tx: Transaction<DatabaseSchema>, accountId: string, now: Date): Promise<number> {
    const result = await tx.updateTable("infra.auth_sessions").set({ revoked_at: now })
      .where("account_id", "=", accountId)
      .where("revoked_at", "is", null)
      .executeTakeFirst()
    return Number(result.numUpdatedRows)
  }
}

export function sessionCookieFor(config: Pick<AppConfig, "environment">) {
  return sessionCookie(config.environment)
}
