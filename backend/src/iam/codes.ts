import { randomBytes } from "node:crypto"
import { hmacSha256, sha256 } from "../shared/crypto.js"

export function newSetupCode(): string {
  return `GEI-${randomBytes(18).toString("base64url")}`
}

export function newEmailVerificationCode(): string {
  return randomBytes(18).toString("base64url")
}

export function hashSetupCode(pepper: Buffer, rawCode: string): Buffer {
  return hmacSha256(pepper, `gei-setup-code:v1:${rawCode}`)
}

export function hashEmailVerificationCode(pepper: Buffer, rawCode: string): Buffer {
  return hmacSha256(pepper, `gei-email-code:v1:${rawCode}`)
}

export function newSessionToken(): string {
  return randomBytes(32).toString("base64url")
}

export function hashSessionToken(rawToken: string): Buffer {
  return sha256(`gei-session:v1:${rawToken}`)
}
