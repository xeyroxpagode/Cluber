export type ErrorCategory =
  | "transport"
  | "authentication"
  | "authorization"
  | "not_found"
  | "conflict"
  | "domain_validation"
  | "rate_limit"
  | "unavailable"
  | "unexpected"

export class AppError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly category: ErrorCategory,
    readonly retryable = false,
    readonly fieldErrors?: Record<string, string[]>,
  ) {
    super(message)
  }
}

export function httpStatusFor(error: AppError): number {
  return {
    transport: 400,
    authentication: 401,
    authorization: 403,
    not_found: 404,
    conflict: 409,
    domain_validation: 422,
    rate_limit: 429,
    unavailable: 503,
    unexpected: 500,
  }[error.category]
}

type PgLikeError = Error & { code?: string; constraint?: string }

export function normalizePostgresError(input: unknown): AppError {
  const error = input as PgLikeError
  if (error?.code === "40001" || error?.code === "40P01") return new AppError("CONCURRENT_MODIFICATION", "Concurrent operation; retry safely", "conflict", true)
  if (error?.code === "55P03") return new AppError("LOCK_TIMEOUT", "Concurrent operation timed out", "conflict", true)
  if (error?.code?.startsWith("08") || error?.code === "57P01") return new AppError("DEPENDENCY_UNAVAILABLE", "Required dependency is unavailable", "unavailable", true)
  if (["23505", "23503", "23514", "23P01"].includes(error?.code ?? "")) {
    return new AppError("CONSTRAINT_CONFLICT", "The operation conflicts with persisted state", "conflict")
  }
  return new AppError("INTERNAL_ERROR", "An unexpected error occurred", "unexpected")
}
