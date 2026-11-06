import type { FastifyRequest } from "fastify"
import { constantTimeEqual, deriveCsrfToken } from "../shared/crypto.js"
import { AppError } from "../shared/errors.js"

export function assertOrigin(request: FastifyRequest, publicOrigin: string): void {
  const origin = request.headers.origin
  if (origin === publicOrigin) return
  const referer = request.headers.referer
  if (!origin && referer) {
    try { if (new URL(referer).origin === publicOrigin) return } catch { /* fail closed */ }
  }
  throw new AppError("ORIGIN_NOT_ALLOWED", "Request origin is not allowed", "authorization")
}

export function assertCsrf(request: FastifyRequest, secret: Buffer, sessionId: string): void {
  const supplied = request.headers["x-gei-csrf"]
  const token = Array.isArray(supplied) ? supplied[0] : supplied
  const expected = deriveCsrfToken(secret, sessionId)
  if (!token || !constantTimeEqual(token, expected)) throw new AppError("CSRF_INVALID", "CSRF validation failed", "authorization")
}
