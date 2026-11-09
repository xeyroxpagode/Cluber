import { apiRequest, apiJson } from "./api.js"

export interface SessionPrincipal {
  sessionId: string
  accountId: string
  personId: string
  username: string | null
  credentialVersion: number
  csrfToken: string
  expiresAt: string
}

export interface MeResponse {
  authenticated: boolean
  csrfToken: string
  principal: SessionPrincipal | null
  operations: string[]
  canAccessApplication: boolean
  // autoridad enriquecida (envelope real del backend)
  isAdmin?: boolean
  isSubcommittee?: boolean
  canAssignRole?: boolean
  canEndRole?: boolean
  canManagePeople?: boolean
  canManageStructure?: boolean
  canManageCompetitions?: boolean
  canViewCompetitions?: boolean
  canViewAudit?: boolean
  canRegisterPlayer?: boolean
  canManageTeams?: boolean
  firstName?: string | null
  lastName?: string | null
  username?: string | null
  email?: string | null
  phone?: string | null
  dni?: string | null
  birthDate?: string | null
  membershipActive?: boolean
  profileCompleted?: boolean
  accountStatus?: string | null
  accountId?: string | null
  credentialVersion?: number | null
  activatedAt?: string | null
  disabledAt?: string | null
  roleAssignments?: Array<{ id: string; role: string; scopeType: string; scopeRefId: string | null; validFrom: string; validUntil: string | null; temporalExclusions?: unknown[] }>
  teamAssignments?: Array<{ id: string; teamId: string; validFrom: string; validUntil: string | null }>
  teams?: string[]
  role?: string | null
}

export interface LoginResult {
  authenticated: boolean
  sessionId: string
  redirect: string
}

export interface ActivateResult {
  ok: boolean
  sessionCreated: boolean
  redirect: string
  accountId?: string
  personId?: string
  errorCode?: string
}

let storedCsrf: string | undefined = undefined

export function setCsrfToken(token: string | undefined) {
  storedCsrf = token
}

export function getCsrfToken(): string | null {
  return storedCsrf ?? null
}

export async function login(email: string, password: string, idempotencyKey: string): Promise<boolean> {
  const body = apiJson({ email, password, idempotency_key: idempotencyKey })
  await apiRequest<LoginResult>("/api/auth/login", {
    method: "POST",
    body,
    credentials: "include",
    csrfToken: storedCsrf,
    idempotencyKey,
    headers: { "Content-Type": "application/json" },
  })
  const m = await me()
  return m.authenticated
}

export async function activate(setupCode: string, newPassword: string, idempotencyKey: string): Promise<ActivateResult> {
  const body = apiJson({ setupCode, newPassword, idempotency_key: idempotencyKey })
  return apiRequest<ActivateResult>("/api/auth/activate", {
    method: "POST",
    body,
    credentials: "include",
    csrfToken: storedCsrf,
    idempotencyKey,
    headers: { "Content-Type": "application/json" },
  })
}

export async function logout(idempotencyKey?: string): Promise<void> {
  const body = idempotencyKey ? apiJson({ idempotency_key: idempotencyKey }) : undefined
  await apiRequest<{ loggedOut: boolean }>("/api/auth/logout", {
    method: "POST",
    body,
    credentials: "include",
    csrfToken: storedCsrf,
    headers: { "Content-Type": "application/json" },
  })
}

export async function me(): Promise<MeResponse> {
  const res = await apiRequest<MeResponse>("/api/me", {
    method: "GET",
    credentials: "include",
    csrfToken: storedCsrf,
    headers: { "Content-Type": "application/json" },
  })
  if (res.csrfToken) setCsrfToken(res.csrfToken)
  return res
}

export async function changePassword(currentPassword: string, newPassword: string, idempotencyKey: string): Promise<boolean> {
  const body = apiJson({ currentPassword, newPassword, idempotency_key: idempotencyKey })
  await apiRequest<{ passwordChanged: boolean; requiresLogin: boolean }>("/api/account/change-password", {
    method: "POST",
    body,
    credentials: "include",
    csrfToken: storedCsrf,
    idempotencyKey,
    headers: { "Content-Type": "application/json" },
  })
  return true
}

export { apiRequest, apiJson }
