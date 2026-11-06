import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto"

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url")
}

export function sha256(value: string | Buffer): Buffer {
  return createHash("sha256").update(value).digest()
}

export function hmacSha256(secret: Buffer, value: string): Buffer {
  return createHmac("sha256", secret).update(value, "utf8").digest()
}

export function constantTimeEqual(left: Buffer | string, right: Buffer | string): boolean {
  const a = Buffer.isBuffer(left) ? left : Buffer.from(left)
  const b = Buffer.isBuffer(right) ? right : Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}

export function deriveCsrfToken(secret: Buffer, sessionId: string): string {
  return hmacSha256(secret, `gei-csrf:v1:${sessionId}`).toString("base64url")
}

export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`
  const record = value as Record<string, unknown>
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`
}
