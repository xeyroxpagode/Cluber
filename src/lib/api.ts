export interface ApiErrorInfo {
  code: string
  message: string
  fieldErrors?: Record<string, string[]>
  traceId: string
  retryable: boolean
}

export class ApiError extends Error {
  readonly code: string
  readonly fieldErrors?: Record<string, string[]>
  readonly traceId: string
  readonly retryable: boolean
  readonly status: number

  constructor(status: number, info: ApiErrorInfo) {
    super(info.message)
    this.status = status
    this.code = info.code
    this.fieldErrors = info.fieldErrors
    this.traceId = info.traceId
    this.retryable = info.retryable
    this.name = "ApiError"
  }
}

const CSRF_HEADER = "x-gei-csrf"

function headersWithCsrf(headers: HeadersInit, csrfToken: string | null): Headers {
  const h = new Headers(headers)
  if (csrfToken) h.set(CSRF_HEADER, csrfToken)
  return h
}

export async function apiRequest<T>(
  input: RequestInfo | URL,
  init: RequestInit & { csrfToken?: string; idempotencyKey?: string },
  expectedOk = true
): Promise<T> {
  const { csrfToken, idempotencyKey, ...rest } = init
  const headers = headersWithCsrf(rest.headers ?? {}, csrfToken ?? null)
  if (idempotencyKey) headers.set("idempotency-key", idempotencyKey)
  headers.set("Accept", "application/json")

  const res = await fetch(String(input), { ...rest, headers })
  const ct = res.headers.get("content-type") ?? ""
  const isJson = ct.includes("application/json")

  if (!res.ok) {
    let info: ApiErrorInfo
    if (isJson) {
      const body = (await res.json()) as { error?: ApiErrorInfo }
      info = body?.error ?? { code: "HTTP_ERROR", message: res.statusText, traceId: "", retryable: false }
    } else {
      info = { code: "HTTP_ERROR", message: res.statusText, traceId: res.headers.get("x-trace-id") ?? "", retryable: false }
    }
    throw new ApiError(res.status, info)
  }

  if (!isJson) return null as unknown as T
  const body = (await res.json()) as T
  return body
}

export function apiJson(body: unknown): BodyInit {
  return JSON.stringify(body)
}
