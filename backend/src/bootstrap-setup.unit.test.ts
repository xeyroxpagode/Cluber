import { execFileSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"

const directories: string[] = []
afterEach(() => directories.splice(0).forEach((directory) => rmSync(directory, { recursive: true, force: true })))

describe("development setup", () => {
  it("creates strong local configuration once and preserves it on repeat", () => {
    const directory = mkdtempSync(join(tmpdir(), "gei-t01-env-"))
    directories.push(directory)
    const envFile = join(directory, ".env")
    const options = { cwd: process.cwd(), env: { ...process.env, GEI_ENV_FILE: envFile }, encoding: "utf8" as const }
    expect(execFileSync(process.execPath, ["scripts/setup-dev.mjs"], options)).toContain("Created local development configuration")
    const first = readFileSync(envFile, "utf8")
    for (const key of ["AUTH_CODE_PEPPER", "EMAIL_CHANGE_CODE_PEPPER", "CSRF_HMAC_SECRET", "RATE_LIMIT_KEY_PEPPER"]) {
      const value = first.match(new RegExp(`^${key}=(.+)$`, "m"))?.[1]
      expect(value).toBeDefined()
      expect(Buffer.from(value!, "base64")).toHaveLength(32)
    }
    expect(execFileSync(process.execPath, ["scripts/setup-dev.mjs"], options)).toContain("was preserved")
    expect(readFileSync(envFile, "utf8")).toBe(first)
  })
})
