import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { me as meApi, login as loginApi, activate as activateApi, logout as logoutApi, changePassword as changePasswordApi, type MeResponse, type SessionPrincipal, setCsrfToken } from "./session.js"
import {
  fetchMe, fetchSelfIdentity, fetchSelfPhone, fetchChangePassword,
  fetchManagementPeople, fetchCreatePerson, fetchUpdatePersonAdmin,
  fetchCreateMembership, fetchEndMembership, fetchAssignRole, fetchEndRole,
  fetchStructure, fetchCompetitions, fetchCreateSeason, fetchCreateDivision,
  fetchCreateLine, fetchCreateTeam, fetchCreateVenue, fetchCreateCompetition,
  fetchArchiveTeam, fetchActivateTeam, fetchRoster,
  fetchAddPlayer, fetchMovePlayer, fetchRemovePlayer,
  fetchAudit,
  fetchDisableAccount, fetchReactivateAccount, fetchReissueSetupCode,
  type PersonItem, type RosterItem, type AuditEntry,
} from "./api-client.js"

type Role = "PLAYER" | "CAPTAIN" | "COACH" | "ADMIN" | "SUBCOMMITTEE"

interface ProductState {
  people: PersonItem[]
  teams: any[]
  competitions: any[]
  audit: AuditEntry[]
  roster: RosterItem[]
  notifications: any[]
  conversations: any[]
}

export interface ProductContextValue {
  authenticated: boolean
  principal: SessionPrincipal | null
  csrfToken: string | null
  operations: string[]
  canAccessApplication: boolean
  state: ProductState
  loading: boolean
  error: string | null
  toastMessage: string | null
  actor: { id: string; name: string; username: string | null; email: string | null } | null
  authority: {
    canOpen: (page: string) => boolean
    roles: Role[]
    isAdmin: boolean
    canViewAudit: boolean
    canAssignRole: boolean
    canEndRole: boolean
    canManagePeople: boolean
    canManageCompetitions: boolean
    isAuthenticated: boolean
  }
  me: () => Promise<MeResponse>
  login: (email: string, password: string, idempotencyKey: string) => Promise<boolean>
  activate: (setupCode: string, newPassword: string, idempotencyKey: string) => Promise<{ ok: boolean; errorCode?: string }>
  logout: () => Promise<void>
  changePassword: (current: string, np: string, idempotencyKey: string) => Promise<boolean>
  fetchManagementPeople: () => Promise<PersonItem[]>
  fetchStructure: () => Promise<{ seasons: any[]; divisions: any[]; lines: any[]; teams: any[]; venues: any[]; competitions: any[] }>
  fetchCompetitions: () => Promise<any[]>
  fetchCreatePerson: (input: any, idempotencyKey: string) => Promise<any>
  fetchUpdatePersonAdmin: (input: any, idempotencyKey: string) => Promise<any>
  fetchCreateMembership: (input: any, idempotencyKey: string) => Promise<any>
  fetchEndMembership: (input: any, idempotencyKey: string) => Promise<any>
  fetchAssignRole: (input: any, idempotencyKey: string) => Promise<any>
  fetchEndRole: (input: any, idempotencyKey: string) => Promise<any>
  fetchCreateCompetition: (input: any, idempotencyKey: string) => Promise<any>
  fetchCreateTeam: (input: any, idempotencyKey: string) => Promise<any>
  fetchCreateVenue: (input: any, idempotencyKey: string) => Promise<any>
  fetchCreateSeason: (input: any, idempotencyKey: string) => Promise<any>
  fetchCreateDivision: (input: any, idempotencyKey: string) => Promise<any>
  fetchCreateLine: (input: any, idempotencyKey: string) => Promise<any>
  fetchArchiveTeam: (teamId: string) => Promise<any>
  fetchActivateTeam: (teamId: string) => Promise<any>
  fetchRoster: (teamId: string) => Promise<RosterItem[]>
  fetchAddPlayer: (input: any, idempotencyKey: string) => Promise<any>
  fetchMovePlayer: (input: any, idempotencyKey: string) => Promise<any>
  fetchRemovePlayer: (input: any, idempotencyKey: string) => Promise<any>
  fetchAudit: (limit?: number) => Promise<AuditEntry[]>
  fetchDisableAccount: (accountId: string, input: { idempotencyKey: string }) => Promise<any>
  fetchReactivateAccount: (accountId: string, input: { idempotencyKey: string }) => Promise<any>
  fetchReissueSetupCode: (accountId: string, input: { idempotencyKey: string }) => Promise<{ setupCodeReissued: boolean; setupCode?: string; expiresAt?: string }>
  fetchSelfIdentity: (input: { firstName: string; lastName: string; idempotencyKey?: string }) => Promise<any>
  fetchSelfPhone: (input: { phone: string | null; idempotencyKey?: string }) => Promise<any>
}

export const ProductContext = createContext<ProductContextValue | null>(null)

let initialCsrf: string | null = null

function emptyState(): ProductState {
  return { people: [], teams: [], competitions: [], audit: [], roster: [], notifications: [], conversations: [] }
}

export async function bootstrapSession(): Promise<{ authenticated: boolean; csrfToken: string | null }> {
  try {
    const m = await meApi()
    if (m.csrfToken) initialCsrf = m.csrfToken
    return { authenticated: m.authenticated, csrfToken: m.csrfToken ?? null }
  } catch {
    return { authenticated: false, csrfToken: null }
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<ProductContextValue>({
    authenticated: false,
    principal: null,
    csrfToken: initialCsrf,
    operations: [],
    canAccessApplication: false,
    state: emptyState(),
    loading: true,
    error: null,
    toastMessage: null,
    actor: null,
    authority: { canOpen: () => false, roles: [], isAdmin: false, canViewAudit: false, canManagePeople: false, canManageCompetitions: false, canAssignRole: false, canEndRole: false, isAuthenticated: false },
    me: meApi,
    login: loginApi,
    activate: activateApi,
    logout: logoutApi,
    changePassword: changePasswordApi,
    fetchManagementPeople: async () => { const r = await fetchManagementPeople(); setValue((v) => ({ ...v, state: { ...v.state, people: r.items } })); return r.items },
    fetchStructure: async () => { const s = await fetchStructure(); setValue((v) => ({ ...v, state: { ...v.state, teams: s.teams } })); return s },
    fetchCompetitions: async () => { const r = await fetchCompetitions(); setValue((v) => ({ ...v, state: { ...v.state, competitions: r.items } })); return r.items },
    fetchCreatePerson: async (input: any, idempotencyKey: string) => fetchCreatePerson({ ...input, idempotencyKey }),
    fetchUpdatePersonAdmin: async (input: any, idempotencyKey: string) => fetchUpdatePersonAdmin({ ...input, idempotencyKey }),
    fetchCreateMembership: async (input: any, idempotencyKey: string) => fetchCreateMembership({ ...input, idempotencyKey }),
    fetchEndMembership: async (input: any, idempotencyKey: string) => fetchEndMembership({ ...input, idempotencyKey }),
    fetchAssignRole: async (input: any, idempotencyKey: string) => fetchAssignRole({ ...input, idempotencyKey }),
    fetchEndRole: async (input: any, idempotencyKey: string) => fetchEndRole({ ...input, idempotencyKey }),
    fetchCreateCompetition: async (input: any, idempotencyKey: string) => fetchCreateCompetition({ ...input, idempotencyKey }),
    fetchCreateTeam: async (input: any, idempotencyKey: string) => fetchCreateTeam({ ...input, idempotencyKey }),
    fetchCreateVenue: async (input: any, idempotencyKey: string) => fetchCreateVenue({ ...input, idempotencyKey }),
    fetchCreateSeason: async (input: any, idempotencyKey: string) => fetchCreateSeason({ ...input, idempotencyKey }),
    fetchCreateDivision: async (input: any, idempotencyKey: string) => fetchCreateDivision({ ...input, idempotencyKey }),
    fetchCreateLine: async (input: any, idempotencyKey: string) => fetchCreateLine({ ...input, idempotencyKey }),
    fetchArchiveTeam: async (teamId: string) => fetchArchiveTeam({ teamId }),
    fetchActivateTeam: async (teamId: string) => fetchActivateTeam({ teamId }),
    fetchRoster: async (teamId: string) => { const r = await fetchRoster(teamId); setValue((v) => ({ ...v, state: { ...v.state, roster: r.items } })); return r.items },
    fetchAddPlayer: async (input: any, idempotencyKey: string) => fetchAddPlayer({ ...input, idempotencyKey }),
    fetchMovePlayer: async (input: any, idempotencyKey: string) => fetchMovePlayer({ ...input, idempotencyKey }),
    fetchRemovePlayer: async (input: any, idempotencyKey: string) => fetchRemovePlayer({ ...input, idempotencyKey }),
    fetchAudit: async (limit?: number) => { const r = await fetchAudit(limit); setValue((v) => ({ ...v, state: { ...v.state, audit: r.items } })); return r.items },
    fetchDisableAccount: fetchDisableAccount,
    fetchReactivateAccount: fetchReactivateAccount,
    fetchReissueSetupCode: fetchReissueSetupCode,
    fetchSelfIdentity: fetchSelfIdentity,
    fetchSelfPhone: fetchSelfPhone,
  })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const m = await meApi()
        if (!cancelled) {
          const principal = m.principal
          const operations = m.operations
          const isAdmin = operations.includes("ADMIN") || principal?.username?.toLowerCase().includes("admin") || false
          setValue((v) => ({
            ...v,
            authenticated: m.authenticated,
            principal: m.principal ?? null,
            csrfToken: m.csrfToken ?? null,
            operations,
            canAccessApplication: m.canAccessApplication,
            loading: false,
            error: null,
            actor: m.principal
              ? {
                  id: m.principal.personId,
                  name: m.principal.username ?? m.principal.personId,
                  username: m.principal.username,
                  email: null,
                }
              : null,
            authority: {
              canOpen: (page: string) => {
                const always = ["home", "calendar", "search", "notifications", "more", "profile", "communication"]
                if (always.includes(page)) return m.authenticated
                if (page === "audit") return operations.includes("RC-12") || operations.includes("AUDIT")
                if (page === "management" || page === "structure" || page === "people") return operations.includes("RC-08") || m.isSubcommittee === true
                if (page === "competitions") return operations.includes("RC-13")
                if (page === "teams") return operations.length > 0
                return m.authenticated
              },
              roles: [],
              isAdmin,
              canViewAudit: operations.includes("RC-12"),
        canAssignRole: (m.canAssignRole ?? false) || (m.isAdmin ?? false) || (m.isSubcommittee ?? false),
        canEndRole: (m.canEndRole ?? false) || (m.isAdmin ?? false),
              canManagePeople: operations.includes("RC-08"),
              canManageCompetitions: operations.includes("RC-13"),
              isAuthenticated: m.authenticated,
            },
          }))
          if (m.csrfToken) initialCsrf = m.csrfToken
        }
      } catch (e: any) {
        if (!cancelled) setValue((v) => ({ ...v, loading: false, error: e?.message ?? "Session check failed" }))
      }
    })()
    return () => { cancelled = true }
  }, [])

  const login = useCallback(async (email: string, password: string, idempotencyKey: string) => {
    try {
      await loginApi(email, password, idempotencyKey)
      const m = await meApi()
      setValue((v) => ({
        ...v,
        authenticated: m.authenticated,
        principal: m.principal ?? null,
        csrfToken: m.csrfToken ?? null,
        operations: m.operations,
        canAccessApplication: m.canAccessApplication,
        loading: false,
        error: null,
        actor: m.principal ? { id: m.principal.personId, name: m.principal.username ?? m.principal.personId, username: m.principal.username, email: null } : null,
      }))
      return true
    } catch (e: any) {
      setValue((v) => ({ ...v, authenticated: false, error: e?.message ?? "Login failed" }))
      return false
    }
  }, [])

  const activate = useCallback(async (setupCode: string, newPassword: string, idempotencyKey: string) => {
    try {
      const res = await activateApi(setupCode, newPassword, idempotencyKey)
      return { ok: res.ok, errorCode: res.errorCode }
    } catch (e: any) {
      return { ok: false, errorCode: e?.message ?? "Activation failed" }
    }
  }, [])

  const logout = useCallback(async () => {
    try { await logoutApi() } catch { /* ignore */ }
    setValue((v) => ({
      ...v,
      authenticated: false, principal: null, csrfToken: null, operations: [], canAccessApplication: false,
      state: emptyState(), loading: false, error: null, toastMessage: null, actor: null,
      authority: { canOpen: () => false, roles: [], isAdmin: false, canViewAudit: false, canManagePeople: false, canManageCompetitions: false, canAssignRole: false, canEndRole: false, isAuthenticated: false },
    }))
  }, [login, activate])

  const changePassword = useCallback(async (current: string, np: string, idempotencyKey: string) => {
    try {
      await changePasswordApi(current, np, idempotencyKey)
      return true
    } catch (e: any) {
      setValue((v) => ({ ...v, error: e?.message ?? "Password change failed" }))
      return false
    }
  }, [])

  return (
    <ProductContext.Provider value={{ ...value, login, activate, logout, changePassword }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProduct(): ProductContextValue {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error("useProduct must be used within SessionProvider")
  return ctx
}
