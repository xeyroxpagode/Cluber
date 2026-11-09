import { randomBytes, randomUUID } from "node:crypto"
import { sql, type Transaction } from "kysely"
import type { AppConfig } from "../config/load-config.js"
import type { DatabaseSchema, AccountTable, PersonTable } from "../db/types.js"
import type { PasswordHasher } from "../shared/password-hasher.js"
import { AppError } from "../shared/errors.js"
import { deriveUsername, isValidEmail, normalizeEmail } from "../shared/normalize.js"
import { AuditWriter, redactAuditValue } from "../audit/audit.js"
import { hashSetupCode, hashEmailVerificationCode, newSetupCode, newEmailVerificationCode } from "./codes.js"
import { clubDateStart } from "../shared/club-time.js"

const SETUP_TTL_MS = 7 * 24 * 60 * 60 * 1000
const EMAIL_TTL_MS = 7 * 24 * 60 * 60 * 1000
const MAX_CODE_ATTEMPTS = 5

export class AccountService {
  constructor(
    private readonly config: Pick<AppConfig, "environment" | "secrets" | "publicOrigin" | "clubTimeZone">,
    private readonly passwordHasher: PasswordHasher,
    private readonly audit = new AuditWriter(),
  ) {}

  async assertAuthenticableEmail(tx: Transaction<DatabaseSchema>, email: string, exceptPersonId?: string) {
    const normalized = normalizeEmail(email)
    if (!normalized || !isValidEmail(normalized)) {
      throw new AppError("VALIDATION_FAILED", "Email is invalid", "domain_validation", false, { email: ["invalid"] })
    }
    await sql`select pg_advisory_xact_lock(hashtextextended(${`gei-auth-email:${normalized}`}, 842))`.execute(tx)
    let query = tx.selectFrom("app.people")
      .innerJoin("app.accounts", "app.accounts.person_id", "app.people.id")
      .select("app.people.id as personId")
      .where(sql<boolean>`lower(trim(app.people.email)) = ${normalized}`)
    if (exceptPersonId) query = query.where("app.people.id", "<>", exceptPersonId)
    const existing = await query.executeTakeFirst()
    if (existing) throw new AppError("DUPLICATE_EMAIL", "Email is already used by an authenticable account", "conflict")
    return normalized
  }

  async provision(tx: Transaction<DatabaseSchema>, actorPersonId: string, personId: string, evaluationInstant: Date, source = "OP-IAM-PROVISION-ACCOUNT") {
    const person = await tx.selectFrom("app.people").selectAll().where("id", "=", personId).forUpdate().executeTakeFirst()
    if (!person) throw new AppError("PERSON_NOT_FOUND", "Person was not found", "not_found")
    const existing = await tx.selectFrom("app.accounts").select("id").where("person_id", "=", personId).executeTakeFirst()
    if (existing) throw new AppError("ACCOUNT_ALREADY_EXISTS", "Person already has an account", "conflict")
    const email = await this.assertAuthenticableEmail(tx, person.email ?? "", personId)

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const username = deriveUsername(person.first_name, person.last_name, randomBytes(4).toString("base64url"))
      const taken = await tx.selectFrom("app.accounts").select("id").where(sql<boolean>`lower(trim(username)) = ${username}`).executeTakeFirst()
      if (taken) continue
      const code = newSetupCode()
      const expiresAt = new Date(evaluationInstant.getTime() + SETUP_TTL_MS)
      const inserted = await tx.insertInto("app.accounts").values({
        id: randomUUID(),
        person_id: personId,
        username,
        password_hash: null,
        status: "PENDING",
        credential_version: 1,
        setup_token_hash: hashSetupCode(this.config.secrets.authCodePepper, code),
        setup_token_expires_at: expiresAt,
        setup_token_attempts: 0,
        created_at: evaluationInstant,
        updated_at: evaluationInstant,
      }).returning(["id", "person_id", "username", "status", "credential_version", "password_hash", "created_at"]).executeTakeFirstOrThrow()
      await this.audit.record(tx, { actorPersonId, action: "ACCOUNT_PROVISIONED", targetType: "Account", targetId: inserted.id, source, diff: { personId, status: "PENDING", username, email } })
      return { account: inserted, setupCode: code, setupExpiresAt: expiresAt, email }
    }
    throw new AppError("USERNAME_CONFLICT", "Could not allocate a unique username", "conflict", true)
  }

  async issueSetupCode(tx: Transaction<DatabaseSchema>, actorPersonId: string, accountId: string, evaluationInstant: Date, source = "CMD-IAM-05") {
    const account = await tx.selectFrom("app.accounts").innerJoin("app.people", "app.people.id", "app.accounts.person_id")
      .select(["app.accounts.id as accountId", "app.people.id as personId", "app.accounts.status as status"])
      .where("app.accounts.id", "=", accountId).forUpdate().executeTakeFirst()
    if (!account) throw new AppError("ACCOUNT_NOT_FOUND", "Account was not found", "not_found")
    const code = newSetupCode()
    const expiresAt = new Date(evaluationInstant.getTime() + SETUP_TTL_MS)
    await tx.updateTable("app.accounts").set({
      setup_token_hash: hashSetupCode(this.config.secrets.authCodePepper, code),
      setup_token_expires_at: expiresAt,
      setup_token_attempts: 0,
      updated_at: evaluationInstant,
    }).where("id", "=", accountId).executeTakeFirstOrThrow()
    await this.audit.record(tx, { actorPersonId, action: "ACCOUNT_SETUP_CODE_REISSUED", targetType: "Account", targetId: accountId, source, diff: { status: account.status, attemptsReset: true, setupCode: "[REDACTED]" } })
    return { setupCode: code, expiresAt, status: account.status }
  }

  async activateWithCode(tx: Transaction<DatabaseSchema>, rawCode: string, newPassword: string, evaluationInstant: Date) {
    const codeHash = hashSetupCode(this.config.secrets.authCodePepper, rawCode)
    const account = await tx.selectFrom("app.accounts").selectAll().where("setup_token_hash", "=", codeHash).forUpdate().executeTakeFirst()
    if (!account) return { ok: false as const, code: "INVALID_TOKEN" as const }
    if (account.setup_token_attempts >= MAX_CODE_ATTEMPTS) return { ok: false as const, code: "TOKEN_ATTEMPT_LIMIT" as const }
    if (!account.setup_token_expires_at || new Date(account.setup_token_expires_at).getTime() <= evaluationInstant.getTime()) {
      await this.bumpFailedAttempt(tx, account, evaluationInstant)
      return { ok: false as const, code: "TOKEN_EXPIRED" as const }
    }
    if (account.status !== "PENDING") {
      if (account.status === "ACTIVE" || account.status === "DISABLED") {
        // Admin recovery codes are consumed through the password recovery flow, not activation.
        return { ok: false as const, code: "USE_ACCOUNT_RECOVERY" as const }
      }
      return { ok: false as const, code: "INVALID_TOKEN" as const }
    }
    const passwordHash = await this.passwordHasher.hash(newPassword)
    await tx.updateTable("app.accounts").set({
      password_hash: passwordHash,
      status: "ACTIVE",
      activated_at: evaluationInstant,
      disabled_at: null,
      credential_version: account.credential_version + 1,
      setup_token_hash: null,
      setup_token_expires_at: null,
      setup_token_attempts: 0,
      updated_at: evaluationInstant,
    }).where("id", "=", account.id).executeTakeFirstOrThrow()
    await this.audit.record(tx, { actorPersonId: null, action: "ACCOUNT_ACTIVATED", targetType: "Account", targetId: account.id, source: "CMD-IAM-02", diff: { status: "ACTIVE", credentialVersionIncremented: true } })
    return { ok: true as const, accountId: account.id, personId: account.person_id }
  }

  async consumeRecoveryCode(tx: Transaction<DatabaseSchema>, rawCode: string, newPassword: string, evaluationInstant: Date) {
    const codeHash = hashSetupCode(this.config.secrets.authCodePepper, rawCode)
    const account = await tx.selectFrom("app.accounts").selectAll().where("setup_token_hash", "=", codeHash).forUpdate().executeTakeFirst()
    if (!account) return { ok: false as const, code: "INVALID_TOKEN" as const }
    if (account.setup_token_attempts >= MAX_CODE_ATTEMPTS) return { ok: false as const, code: "TOKEN_ATTEMPT_LIMIT" as const }
    if (!account.setup_token_expires_at || new Date(account.setup_token_expires_at).getTime() <= evaluationInstant.getTime()) {
      await this.bumpFailedAttempt(tx, account, evaluationInstant)
      return { ok: false as const, code: "TOKEN_EXPIRED" as const }
    }
    if (account.status === "PENDING") return { ok: false as const, code: "USE_ACTIVATION" as const }
    const passwordHash = await this.passwordHasher.hash(newPassword)
    await tx.updateTable("app.accounts").set({ password_hash: passwordHash, credential_version: account.credential_version + 1, setup_token_hash: null, setup_token_expires_at: null, setup_token_attempts: 0, updated_at: evaluationInstant }).where("id", "=", account.id).executeTakeFirstOrThrow()
    await tx.updateTable("infra.auth_sessions").set({ revoked_at: evaluationInstant }).where("account_id", "=", account.id).where("revoked_at", "is", null).execute()
    await this.audit.record(tx, { actorPersonId: null, action: "ACCOUNT_RECOVERY_PASSWORD_SET", targetType: "Account", targetId: account.id, source: "OP-IAM-RECOVERY", diff: { status: account.status, credentialVersionIncremented: true } })
    return { ok: true as const, status: account.status }
  }

  async authenticate(tx: Transaction<DatabaseSchema>, email: string, password: string, evaluationInstant: Date) {
    const normalized = normalizeEmail(email)
    const row = normalized ? await tx.selectFrom("app.people")
      .innerJoin("app.accounts", "app.accounts.person_id", "app.people.id")
      .selectAll()
      .where(sql<boolean>`lower(trim(app.people.email)) = ${normalized}`)
      .forUpdate()
      .executeTakeFirst() : undefined
    const hash = row?.password_hash
    const verified = hash ? await this.passwordHasher.verify(hash, password) : false
    if (!row || !verified || row.status !== "ACTIVE") return null
    await this.audit.record(tx, { actorPersonId: row.person_id, action: "AUTHENTICATION_SUCCEEDED", targetType: "Account", targetId: row.id, source: "CMD-IAM-01", diff: { status: "ACTIVE" } })
    return row
  }

  async changePassword(tx: Transaction<DatabaseSchema>, actorPersonId: string, accountId: string, currentPassword: string, newPassword: string, evaluationInstant: Date) {
    const account = await tx.selectFrom("app.accounts").selectAll().where("id", "=", accountId).forUpdate().executeTakeFirst()
    if (!account || account.status !== "ACTIVE") throw new AppError("INVALID_CURRENT_PASSWORD", "Current password is incorrect", "authentication")
    const valid = account.password_hash ? await this.passwordHasher.verify(account.password_hash, currentPassword) : false
    if (!valid) throw new AppError("INVALID_CURRENT_PASSWORD", "Current password is incorrect", "authentication")
    const passwordHash = await this.passwordHasher.hash(newPassword)
    const updated = await tx.updateTable("app.accounts").set({ password_hash: passwordHash, credential_version: account.credential_version + 1, updated_at: evaluationInstant }).where("id", "=", accountId).returning(["credential_version"]).executeTakeFirstOrThrow()
    await tx.updateTable("infra.auth_sessions").set({ revoked_at: evaluationInstant }).where("account_id", "=", accountId).where("revoked_at", "is", null).execute()
    await this.audit.record(tx, { actorPersonId, action: "PASSWORD_CHANGED", targetType: "Account", targetId: accountId, source: "CMD-IAM-03", diff: { credentialVersion: updated.credential_version, sessionsInvalidated: true } })
    return updated
  }

  async disable(tx: Transaction<DatabaseSchema>, actorPersonId: string, accountId: string, evaluationInstant: Date) {
    const account = await tx.selectFrom("app.accounts").selectAll().where("id", "=", accountId).forUpdate().executeTakeFirst()
    if (!account) throw new AppError("ACCOUNT_NOT_FOUND", "Account was not found", "not_found")
    if (account.status !== "ACTIVE") throw new AppError("ACCOUNT_STATE_INVALID", "Only active accounts can be disabled", "conflict")
    const updated = await tx.updateTable("app.accounts").set({ status: "DISABLED", activated_at: null, disabled_at: evaluationInstant, updated_at: evaluationInstant }).where("id", "=", accountId).returningAll().executeTakeFirstOrThrow()
    await tx.updateTable("infra.auth_sessions").set({ revoked_at: evaluationInstant }).where("account_id", "=", accountId).where("revoked_at", "is", null).execute()
    await this.audit.record(tx, { actorPersonId, action: "ACCOUNT_DISABLED", targetType: "Account", targetId: accountId, source: "CMD-IAM-04", diff: { status: "DISABLED", sessionsInvalidated: true } })
    return updated
  }

  async reactivate(tx: Transaction<DatabaseSchema>, actorPersonId: string, accountId: string, evaluationInstant: Date) {
    const account = await tx.selectFrom("app.accounts").selectAll().where("id", "=", accountId).forUpdate().executeTakeFirst()
    if (!account) throw new AppError("ACCOUNT_NOT_FOUND", "Account was not found", "not_found")
    if (account.status !== "DISABLED") throw new AppError("ACCOUNT_STATE_INVALID", "Only disabled accounts can be reactivated", "conflict")
    if (!account.password_hash) throw new AppError("ACCOUNT_STATE_INVALID", "A disabled credential is required before reactivation", "conflict")
    const updated = await tx.updateTable("app.accounts").set({ status: "ACTIVE", activated_at: evaluationInstant, disabled_at: null, updated_at: evaluationInstant }).where("id", "=", accountId).returningAll().executeTakeFirstOrThrow()
    await tx.updateTable("infra.auth_sessions").set({ revoked_at: evaluationInstant }).where("account_id", "=", accountId).where("revoked_at", "is", null).execute()
    await this.audit.record(tx, { actorPersonId, action: "ACCOUNT_REACTIVATED", targetType: "Account", targetId: accountId, source: "OP-IAM-REACTIVATE", diff: { status: "ACTIVE", credentialVersionUnchanged: true, previousSessionsRemainInvalid: true } })
    return updated
  }

  async requestEmailChange(tx: Transaction<DatabaseSchema>, actorPersonId: string, accountId: string, candidateEmail: string, evaluationInstant: Date, source = "CMD-PPL-02") {
    const candidate = await this.assertAuthenticableEmail(tx, candidateEmail, actorPersonId)
    const account = await tx.selectFrom("app.accounts").selectAll().where("id", "=", accountId).forUpdate().executeTakeFirst()
    if (!account || account.credential_version < 1) throw new AppError("ACCOUNT_NOT_FOUND", "Account was not found", "not_found")
    const person = await tx.selectFrom("app.people").select("email").where("id", "=", actorPersonId).executeTakeFirst()
    if (!person) throw new AppError("PERSON_NOT_FOUND", "Person was not found", "not_found")
    if (person.email?.trim().toLowerCase() === candidate) throw new AppError("VALIDATION_FAILED", "Candidate email matches the current email", "domain_validation", false, { email: ["unchanged"] })
    const code = newEmailVerificationCode()
    await tx.updateTable("infra.email_change_challenges").set({ consumed_at: evaluationInstant }).where("person_id", "=", actorPersonId).where("consumed_at", "is", null).execute()
    const expiresAt = new Date(evaluationInstant.getTime() + EMAIL_TTL_MS)
    const inserted = await tx.insertInto("infra.email_change_challenges").values({ person_id: actorPersonId, account_id: accountId, new_email_normalized: candidate, code_hash: hashEmailVerificationCode(this.config.secrets.emailChangeCodePepper, code), expires_at: expiresAt }).returning("id").executeTakeFirstOrThrow()
    await this.audit.record(tx, { actorPersonId, action: "EMAIL_CHANGE_REQUESTED", targetType: "Account", targetId: accountId, source, diff: { candidateEmail: candidate, challengeId: inserted.id } })
    return { challengeId: inserted.id, expiresAt, emailCode: this.config.environment === "production" ? undefined : code }
  }

  async confirmEmailChange(tx: Transaction<DatabaseSchema>, actorPersonId: string, accountId: string, rawCode: string, evaluationInstant: Date) {
    const codeHash = hashEmailVerificationCode(this.config.secrets.emailChangeCodePepper, rawCode)
    const challenge = await tx.selectFrom("infra.email_change_challenges").selectAll().where("person_id", "=", actorPersonId).where("account_id", "=", accountId).where("code_hash", "=", codeHash).forUpdate().executeTakeFirst()
    if (!challenge || challenge.consumed_at || new Date(challenge.expires_at).getTime() <= evaluationInstant.getTime()) {
      if (challenge && challenge.attempts < MAX_CODE_ATTEMPTS) await tx.updateTable("infra.email_change_challenges").set({ attempts: challenge.attempts + 1 }).where("id", "=", challenge.id).execute()
      return { ok: false as const, code: "INVALID_OR_EXPIRED_CODE" as const }
    }
    if (challenge.attempts >= MAX_CODE_ATTEMPTS) return { ok: false as const, code: "TOKEN_ATTEMPT_LIMIT" as const }
    await this.assertAuthenticableEmail(tx, challenge.new_email_normalized, actorPersonId)
    const person = await tx.updateTable("app.people").set({ email: challenge.new_email_normalized, updated_at: evaluationInstant }).where("id", "=", actorPersonId).returningAll().executeTakeFirstOrThrow()
    await tx.updateTable("infra.email_change_challenges").set({ consumed_at: evaluationInstant, attempts: challenge.attempts + 1 }).where("id", "=", challenge.id).executeTakeFirstOrThrow()
    await this.audit.record(tx, { actorPersonId, action: "EMAIL_CHANGED", targetType: "Person", targetId: actorPersonId, source: "CMD-PPL-02", diff: { email: challenge.new_email_normalized, challengeId: challenge.id } })
    return { ok: true as const, email: person.email }
  }

  private async bumpFailedAttempt(tx: Transaction<DatabaseSchema>, account: AccountTable, evaluationInstant: Date) {
    await tx.updateTable("app.accounts").set({ setup_token_attempts: account.setup_token_attempts + 1, updated_at: evaluationInstant }).where("id", "=", account.id).executeTakeFirstOrThrow()
  }
}
