import { describe, expect, it } from "vitest"
import { loadConfig } from "./config/load-config.js"
import { canonicalJson, constantTimeEqual, deriveCsrfToken, randomToken } from "./shared/crypto.js"
import { RouteRegistry } from "./http/route-registry.js"
import { assertCsrf, assertOrigin } from "./http/security.js"
import type { FastifyRequest } from "fastify"
import { PasswordHasher } from "./shared/password-hasher.js"
import { sessionCookie } from "./http/session-cookie.js"

const secret = Buffer.alloc(32, 1).toString("base64")
const validEnv = {
  NODE_ENV: "test",
  PUBLIC_ORIGIN: "http://localhost:8443",
  DATABASE_URL: "postgresql://localhost/test",
  AUTH_CODE_PEPPER: secret,
  EMAIL_CHANGE_CODE_PEPPER: secret,
  CSRF_HMAC_SECRET: secret,
  RATE_LIMIT_KEY_PEPPER: secret,
}

describe("foundation primitives", () => {
  it("fails fast for missing or weak secrets", () => {
    expect(() => loadConfig({ ...validEnv, CSRF_HMAC_SECRET: undefined })).toThrow(/CSRF_HMAC_SECRET/)
    expect(() => loadConfig({ ...validEnv, CSRF_HMAC_SECRET: Buffer.alloc(8).toString("base64") })).toThrow(/32 random bytes/)
  })

  it("creates stable canonical hashes and session-bound CSRF tokens", () => {
    expect(canonicalJson({ b: 1, a: [2, 3] })).toBe('{"a":[2,3],"b":1}')
    const token = deriveCsrfToken(Buffer.alloc(32, 2), "session-a")
    expect(constantTimeEqual(token, deriveCsrfToken(Buffer.alloc(32, 2), "session-a"))).toBe(true)
    expect(constantTimeEqual(token, deriveCsrfToken(Buffer.alloc(32, 2), "session-b"))).toBe(false)
    expect(randomToken()).not.toBe(randomToken())
  })

  it("rejects duplicate operation IDs and unsafe authenticated commands", () => {
    const registry = new RouteRegistry()
    const schema = { response: { 200: { type: "object" } } }
    registry.add({ method: "POST", url: "/x", security: { operationId: "CMD-X", kind: "command", auth: "required", csrf: "none", idempotency: "none", cache: "no-store" }, schema, handler: async () => ({}) })
    expect(() => registry.audit()).toThrow(/without CSRF/)
  })

  it("fails closed for missing or mismatched browser origin and CSRF", () => {
    const request = { headers: { origin: "https://evil.example", "x-gei-csrf": "wrong" } } as unknown as FastifyRequest
    expect(() => assertOrigin(request, "http://localhost:8443")).toThrow(/origin/i)
    expect(() => assertCsrf(request, Buffer.alloc(32, 2), "session-a")).toThrow(/CSRF/)
    const valid = { headers: { origin: "http://localhost:8443", "x-gei-csrf": deriveCsrfToken(Buffer.alloc(32, 2), "session-a") } } as unknown as FastifyRequest
    expect(() => assertOrigin(valid, "http://localhost:8443")).not.toThrow()
    expect(() => assertCsrf(valid, Buffer.alloc(32, 2), "session-a")).not.toThrow()
  })

  it("hashes passwords with Argon2id and freezes secure cookie attributes", async () => {
    const hasher = new PasswordHasher()
    const hash = await hasher.hash("correct horse battery staple")
    expect(hash).toMatch(/^\$argon2id\$/)
    expect(await hasher.verify(hash, "correct horse battery staple")).toBe(true)
    expect(await hasher.verify(hash, "incorrect password value")).toBe(false)
    expect(sessionCookie("production")).toEqual({ name: "__Host-gei_session", options: { secure: true, httpOnly: true, sameSite: "strict", path: "/" } })
    expect(sessionCookie("development").name).toBe("gei_session")
  })
})
