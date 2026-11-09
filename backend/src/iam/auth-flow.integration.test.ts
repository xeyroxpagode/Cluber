import { randomUUID } from "node:crypto"
import { describe, expect, test } from "vitest"
import type { Kysely } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import { runtime } from "../integration/t02-base.js"
import { PrincipalResolver } from "./session.js"
import { AppError } from "../shared/errors.js"
import { deriveCsrfToken } from "../shared/crypto.js"

const PUBLIC_ORIGIN = "http://localhost:8443"

function emailFor(tag: string) { return `${tag}-${randomUUID().slice(0, 8)}@example.com` }
function dniFor(tag: string) { return (tag + "-" + randomUUID().replace(/-/g, "")).slice(0, 38) }
function fakeRequest(method: string, headers: Record<string, string | undefined>, cookies?: Record<string, string>) {
  return { method, headers, cookies } as never
}

describe("T02 Auth flow — public/private security policy", () => {
  function resolver(): PrincipalResolver {
    return new PrincipalResolver(runtime!.database.db, {
      environment: "development",
      publicOrigin: PUBLIC_ORIGIN,
      secrets: {
        authCodePepper: Buffer.alloc(32, 7),
        emailChangeCodePepper: Buffer.alloc(32, 7),
        csrfHmacSecret: Buffer.alloc(32, 7),
        rateLimitKeyPepper: Buffer.alloc(32, 7),
      },
    } as never)
  }

  async function createActiveAccount(tx: Kysely<DatabaseSchema>, tag: string, password = "SuperSecretPassword123") {
    const services = runtime!.services
    const personId = randomUUID()
    await tx.insertInto("app.people").values({
      id: personId, first_name: tag, last_name: "Test", dni: dniFor(tag),
      birth_date: "1990-01-01", phone: "12345678", email: emailFor(tag),
      created_at: new Date(), updated_at: new Date(),
    }).execute()
    const hash = await services.passwordHasher.hash(password)
    const accountId = randomUUID()
    await tx.insertInto("app.accounts").values({
      id: accountId, person_id: personId, username: `${tag}-${randomUUID().slice(0, 6)}`,
      password_hash: hash, status: "ACTIVE", credential_version: 1, activated_at: new Date(),
      created_at: new Date(), updated_at: new Date(),
    }).execute()
    return { personId, accountId }
  }

  async function createActor(tx: Kysely<DatabaseSchema>): Promise<string> {
    const id = randomUUID()
    await tx.insertInto("app.people").values({
      id, first_name: "Actor", last_name: "Test", dni: dniFor("actor"),
      birth_date: "1990-01-01", phone: "12345678", email: emailFor("actor"),
      created_at: new Date(), updated_at: new Date(),
    }).execute()
    return id
  }

  async function createSession(tx: Kysely<DatabaseSchema>, accountId: string, evaluationInstant: Date) {
    return runtime!.services.principals.create(tx, { id: accountId, credentialVersion: 1 }, evaluationInstant)
  }

  test("1. public login without cookie is permitted (origin ok)", async () => {
    await expect(resolver().requirePublic(fakeRequest("POST", { origin: PUBLIC_ORIGIN }))).resolves.toBeUndefined()
  })

  test("1. public login without origin is rejected with ORIGIN_NOT_ALLOWED", async () => {
    await expect(resolver().requirePublic(fakeRequest("POST", {}))).rejects.toMatchObject({ code: "ORIGIN_NOT_ALLOWED" })
  })

  test("2. invalid login yields no account and no session (canonical null-compatible path)", async () => {
    const { services, runner } = runtime!
    await runner.run("COMMAND_STANDARD", "af-login-bad", async ({ tx }) => { await createActiveAccount(tx, "badlogin") })
    const result = await runner.run("READ_STANDARD", "af-login-read", ({ tx }) => services.accounts.authenticate(tx, emailFor("missing"), "SuperSecretPassword999", new Date()))
    expect(result).toBeNull()
  })

  test("3. private operation without session is refused with SESSION_INVALID", async () => {
    await expect(resolver().require(fakeRequest("POST", { origin: PUBLIC_ORIGIN }), new Date()))
      .rejects.toMatchObject({ code: "SESSION_INVALID" })
  })

  test("4. private operation with valid cookie but origin mismatch is refused with ORIGIN_NOT_ALLOWED", async () => {
    const { runner } = runtime!
    let cookie = ""
    await runner.run("COMMAND_STANDARD", "af-origin", async ({ tx, evaluationInstant }) => {
      const account = await createActiveAccount(tx, "originfx")
      const session = await createSession(tx, account.accountId, evaluationInstant)
      cookie = session.token
    })
    await expect(resolver().require(fakeRequest("POST", { origin: "https://malicious.example.com" }, { gei_session: cookie }), new Date()))
      .rejects.toMatchObject({ code: "ORIGIN_NOT_ALLOWED" })
  })

  test("4. private operation with valid cookie but missing/wrong CSRF is refused with CSRF_INVALID", async () => {
    const { runner } = runtime!
    let cookie = ""
    let csrfToken = ""
    await runner.run("COMMAND_STANDARD", "af-csrf", async ({ tx, evaluationInstant }) => {
      const account = await createActiveAccount(tx, "csrf")
      const session = await createSession(tx, account.accountId, evaluationInstant)
      cookie = session.token
      csrfToken = session.csrfToken
    })
    expect(cookie).toBeTruthy()
    expect(csrfToken).toBeTruthy()
    await expect(resolver().require(fakeRequest("POST", { origin: PUBLIC_ORIGIN }, { gei_session: cookie }), new Date()))
      .rejects.toMatchObject({ code: "CSRF_INVALID" })
    await expect(resolver().require(fakeRequest("POST", { origin: PUBLIC_ORIGIN, "x-gei-csrf": "deadbeef" }, { gei_session: cookie }), new Date()))
      .rejects.toMatchObject({ code: "CSRF_INVALID" })
  })

  test("5. activate with valid setup code and new password does not require session", async () => {
    const { services, runner } = runtime!
    await runner.run("COMMAND_STANDARD", "af-activate", async ({ tx, evaluationInstant }) => {
      const personId = randomUUID()
      await tx.insertInto("app.people").values({
        id: personId, first_name: "Activate", last_name: "Test", dni: dniFor("act"),
        birth_date: "1990-01-01", phone: "12345678", email: emailFor("act"),
        created_at: evaluationInstant, updated_at: evaluationInstant,
      }).execute()
      const accountId = randomUUID()
      await tx.insertInto("app.accounts").values({
        id: accountId, person_id: personId, username: `act-${randomUUID().slice(0, 6)}`,
        password_hash: null, status: "PENDING", credential_version: 1,
        setup_token_hash: null, setup_token_expires_at: null, setup_token_attempts: 0,
        created_at: evaluationInstant, updated_at: evaluationInstant,
      }).execute()
      const actorId = await createActor(tx)
      const issued = await services.accounts.issueSetupCode(tx, actorId, accountId, evaluationInstant)
      expect(issued.setupCode).toBeTruthy()
      const activated = await services.accounts.activateWithCode(tx, issued.setupCode, "SuperSecretPassword12345", evaluationInstant)
      expect(activated.ok).toBe(true)
    })
  })

  test("6. private routes never fall back to unauthenticated access (four variants)", async () => {
    const variants = [
      { req: fakeRequest("POST", {}), expected: "ORIGIN_NOT_ALLOWED" },
      { req: fakeRequest("POST", { origin: PUBLIC_ORIGIN }), expected: "SESSION_INVALID" },
      { req: fakeRequest("POST", { origin: PUBLIC_ORIGIN, authorization: "Bearer abc" }), expected: "SESSION_INVALID" },
      { req: fakeRequest("PATCH", {}, { gei_session: "not-a-valid-token-at-all-12345" }), expected: "ORIGIN_NOT_ALLOWED" },
    ]
    for (const variant of variants) {
      await expect(resolver().require(variant.req, new Date())).rejects.toMatchObject({ code: variant.expected })
    }
  })

  test("6. private route with valid session, origin and CSRF passes", async () => {
    const { runner } = runtime!
    let cookie = ""
    let csrfToken = ""
    await runner.run("COMMAND_STANDARD", "af-ok-private", async ({ tx, evaluationInstant }) => {
      const account = await createActiveAccount(tx, "getok")
      const session = await createSession(tx, account.accountId, evaluationInstant)
      cookie = session.token
      csrfToken = session.csrfToken
    })
    await expect(resolver().require(fakeRequest("GET", { origin: PUBLIC_ORIGIN }, { gei_session: cookie }), new Date()))
      .resolves.toBeTruthy()
    await expect(resolver().require(fakeRequest("POST", { origin: PUBLIC_ORIGIN, "x-gei-csrf": csrfToken }, { gei_session: cookie }), new Date()))
      .resolves.toBeTruthy()
  })
})
