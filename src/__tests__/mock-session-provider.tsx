import { type ReactNode } from "react"
import { ProductContext } from "../lib/session-context"
import type { ProductContextValue } from "../lib/session-context"
import type { PersonItem, AuditEntry } from "../lib/api-client"

const emptyValue: ProductContextValue = {
  authenticated: false,
  principal: null,
  csrfToken: null,
  operations: [],
  canAccessApplication: false,
  state: { people: [], teams: [], competitions: [], audit: [], roster: [], notifications: [], conversations: [] },
  loading: false,
  error: null,
  toastMessage: null,
  actor: null,
  authority: {
    canOpen: () => false,
    roles: [],
    isAdmin: false,
    canViewAudit: false,
    canManagePeople: false,
    canManageCompetitions: false,
    canAssignRole: false,
    canEndRole: false,
    isAuthenticated: false,
  },
  me: async () => ({ authenticated: false, csrfToken: "", principal: null, operations: [], canAccessApplication: false }),
  login: async () => false,
  activate: async () => ({ ok: false, errorCode: "NOT_IMPLEMENTED" }),
  logout: async () => {},
  changePassword: async () => false,
  fetchManagementPeople: async () => [],
  fetchStructure: async () => ({ seasons: [], divisions: [], lines: [], teams: [], venues: [], competitions: [] }),
  fetchCompetitions: async () => [],
  fetchCreatePerson: async () => ({}),
  fetchUpdatePersonAdmin: async () => ({}),
  fetchCreateMembership: async () => ({}),
  fetchEndMembership: async () => ({}),
  fetchAssignRole: async () => ({}),
  fetchEndRole: async () => ({}),
  fetchCreateCompetition: async () => ({}),
  fetchCreateTeam: async () => ({}),
  fetchCreateVenue: async () => ({}),
  fetchCreateSeason: async () => ({}),
  fetchCreateDivision: async () => ({}),
  fetchCreateLine: async () => ({}),
  fetchArchiveTeam: async () => ({}),
  fetchActivateTeam: async () => ({}),
  fetchRoster: async () => [],
  fetchAddPlayer: async () => ({}),
  fetchMovePlayer: async () => ({}),
  fetchRemovePlayer: async () => ({}),
  fetchAudit: async () => [],
  fetchSelfIdentity: async () => ({}),
  fetchSelfPhone: async () => ({}),
  fetchDisableAccount: async () => ({}),
  fetchReactivateAccount: async () => ({}),
  fetchReissueSetupCode: async () => ({ setupCodeReissued: true }),
}

const baseState = {
  people: [] as PersonItem[],
  teams: [] as any[],
  competitions: [] as any[],
  audit: [] as AuditEntry[],
  roster: [] as any[],
  notifications: [] as any[],
  conversations: [] as any[],
}

function valueFor(demo: string): ProductContextValue {
  const isAdmin = demo === "admin"
  const isSub = demo === "subcommittee"
  const isCoach = demo === "coach"
  const isPlayer = demo === "player"
  const isCaptain = demo === "captain"

  const operations: string[] = []
  if (isAdmin) operations.push("RC-08", "RC-12", "RC-13", "ADMIN")
  if (isSub) operations.push("RC-12", "RC-13", "SUBCOMMITTEE")
  if (isCoach) operations.push("RC-04", "COACH")
  if (isCaptain) operations.push("RC-04", "CAPTAIN")
  if (isPlayer) operations.push("PLAYER")

  const state = {
    ...baseState,
    people: [
      { id: "p4", firstName: "Ana", lastName: "González", dni: "11-111111", birthDate: "1990-01-01", phone: "12345678", email: "ana@gei.com.ar", accountStatus: "ACTIVE", profileCompleted: true, teamAssignments: [], roleAssignments: [], memberships: [], name: "Ana González" },
      { id: "p17", firstName: "Lucía", lastName: "Pérez", dni: null, birthDate: null, phone: null, email: null, accountStatus: "PENDING", profileCompleted: false, teamAssignments: [], roleAssignments: [], memberships: [], name: "Lucía Pérez" },
      { id: "p2", firstName: "Jugadora", lastName: "Dos", dni: "22-222222", birthDate: "1992-02-02", phone: "87654321", email: "j2@gei.com.ar", accountStatus: "ACTIVE", profileCompleted: true, teamAssignments: [], roleAssignments: [], memberships: [], name: "Jugadora Dos" },
      { id: "coach", firstName: "Entrenador", lastName: "Uno", dni: "33-333333", birthDate: "1985-03-03", phone: "11111111", email: "coach@gei.com.ar", accountStatus: "ACTIVE", profileCompleted: true, teamAssignments: [], roleAssignments: [], memberships: [], name: "Entrenador Uno" },
    ],
    teams: [
      { id: "sexta", name: "Sexta A", state: "ACTIVE", seasonId: "s1", divisionId: "d1", lineId: "l1" },
      { id: "septima", name: "Séptima A", state: "ACTIVE", seasonId: "s1", divisionId: "d1", lineId: "l1" },
    ],
    competitions: [
      { id: "ahba", name: "Torneo AHBA", organizer: "Club", seasonId: "s1", archivedAt: null },
    ],
  } as any

  return {
    ...emptyValue,
    authenticated: true,
    state,
    actor: { id: demo, name: demo, username: demo, email: null },
    authority: {
      canOpen: (page: string) => {
        if (["home", "calendar", "search", "notifications", "more", "profile", "communication"].includes(page)) return true
        if (page === "audit") return operations.includes("RC-12")
        if (page === "management" || page === "structure" || page === "people") return operations.includes("RC-08")
        if (page === "competitions") return operations.includes("RC-13")
        if (page === "teams") return operations.length > 0
        return true
      },
      roles: operations.filter((o) => ["ADMIN", "SUBCOMMITTEE", "COACH", "CAPTAIN", "PLAYER"].includes(o)) as any[],
      isAdmin,
      canViewAudit: operations.includes("RC-12"),
      canManagePeople: operations.includes("RC-08"),
      canManageCompetitions: operations.includes("RC-13"),
      canAssignRole: isAdmin || isSub,
      canEndRole: isAdmin,
      isAuthenticated: true,
    },
    fetchManagementPeople: async () => state.people,
    fetchStructure: async () => ({
      seasons: [],
      divisions: [],
      lines: [],
      teams: state.teams,
      venues: [],
      competitions: state.competitions,
    }),
    fetchCompetitions: async () => state.competitions,
    fetchRoster: async () => [],
  }
}

export function MockSessionProvider({
  children,
  demo = "admin",
}: { children: ReactNode; demo?: string }) {
  return (
    <ProductContext.Provider value={valueFor(demo)}>
      {children}
    </ProductContext.Provider>
  )
}
