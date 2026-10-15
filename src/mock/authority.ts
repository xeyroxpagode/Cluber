import type { Event, Person, State } from "./model"
import {
  activeRoleAssignments,
  activeTeamAssignments,
  roleScopeLabel,
} from "./derive"
import { todayIso } from "./clock"

/**
 * Única fuente de autoridad (Stage 6 §15 · V1.1).
 *
 * Fórmula: ROLE + ACTION + SCOPE + OBJECT STATE + FIELD AUTHORITY + SOURCE.
 * Toda pantalla y todo route consume de acá. Prohibido `role === "ADMIN"`
 * o `capabilities.sport` como gate paralelo.
 *
 * V1.1: sin Guardian, sin Eligibility. ADMIN no es superusuario deportivo.
 * SUBCOMMITTEE es autoridad oficial (comunicados, competencias) y no
 * administra personas, cuentas ni estructura.
 */

export type Page =
  | "home"
  | "calendar"
  | "teams"
  | "communication"
  | "search"
  | "notifications"
  | "more"
  | "profile"
  | "reports"
  | "audit"
  | "management"
  | "structure"
  | "people"
  | "competitions"
  | "announcements"

export interface Authority {
  /** Identidad */
  person: Person
  isClubWide: boolean
  roles: string[]
  /** Alcance deportivo */
  teamIds: string[]
  coachTeamIds: string[]
  isCoachOfTeam: (teamId: string) => boolean
  isCaptainOfTeam: (teamId: string) => boolean
  /** Operaciones de evento */
  canCreateEvent: boolean
  canEditEvent: (event: Event) => boolean
  canManageLogistics: (event: Event) => boolean
  canManageSelection: (event: Event) => boolean
  canManageAttendance: (event: Event) => boolean
  canManageRecord: (event: Event) => boolean
  canTransitionEvent: (event: Event, to: string) => boolean
  /** Comunicación */
  canChat: boolean
  canPublishAnnouncement: boolean
  canCorrectAnnouncement: () => boolean
  canArchiveAnnouncement: () => boolean
  /** Administración */
  canManagePeople: boolean
  canManageStructure: boolean
  canManageCompetitions: boolean
  canViewCompetitions: boolean
  canViewAudit: boolean
  /** Disponibilidad: cada jugadora responde sólo la propia (V1.1). */
  canRespondOwn: boolean
  /** PII y detalle restringido */
  canViewDni: boolean
  canViewBirth: boolean
  canViewContact: (person: Person) => boolean
  /** Navegación */
  canOpen: (page: Page) => boolean
  /** Etiquetas de alcance ya resueltas */
  scopeLabelOf: (roleId: string) => string
}

function coachScopeIds(actor: Person): string[] {
  return (actor.roleAssignments ?? [])
    .filter((item) => item.role === "COACH" && item.scope === "TEAM" && !item.validUntil)
    .map((item) => item.target)
}

export function getAuthority(state: State, actor: Person): Authority {
  const roles = activeRoleAssignments(state, actor.id)
  const roleNames = Array.from(new Set(roles.map((r) => r.role)))
  const admin = roleNames.includes("ADMIN")
  const official = roleNames.includes("SUBCOMMITTEE")
  const clubWide = admin || official
  const coachTeams = coachScopeIds(actor)
  const captainTeams = roles
    .filter((r) => r.role === "CAPTAIN" && r.scope === "TEAM")
    .map((r) => r.target)

  const teamIds = clubWide
    ? state.teams.filter((t) => t.state === "ACTIVE").map((t) => t.id)
    : Array.from(
        new Set([
          ...coachTeams,
          ...captainTeams,
          ...activeTeamAssignments(state, actor.id).map(
            (a) => a.teamId,
          ),
        ]),
      )

  const isCoachOfTeam = (teamId: string) => coachTeams.includes(teamId)

  const coachOnEvent = (event: Event) =>
    event.targetTeams.some((id) => coachTeams.includes(id)) ||
    roles.some((r) => r.scope === "EVENT" && r.target === event.id)

  const officialOnEvent = (event: Event) => clubWide

  const isSelfPlayer = roleNames.includes("PLAYER") || roleNames.includes("CAPTAIN")
  const hasMembership = state.memberships.some(
    (m) =>
      m.personId === actor.id &&
      m.validFrom <= todayIso() &&
      (!m.validUntil || m.validUntil > todayIso()),
  )

  const authority: Authority = {
    person: actor,
    isClubWide: clubWide,
    roles: roleNames,
    teamIds,
    coachTeamIds: coachTeams,
    isCoachOfTeam,
    isCaptainOfTeam: (teamId: string) => captainTeams.includes(teamId),
    canCreateEvent: coachTeams.length > 0 || official,
    canEditEvent: (event) => coachOnEvent(event) || officialOnEvent(event),
    canManageLogistics: (event) => coachOnEvent(event) || officialOnEvent(event),
    canManageSelection: (event) => coachOnEvent(event),
    canManageAttendance: (event) => coachOnEvent(event),
    canManageRecord: (event) => coachOnEvent(event) && event.type === "MATCH",
    canTransitionEvent: (event, to) => {
      const allowed: Record<string, string[]> = {
        POSTPONED: ["SCHEDULED", "CANCELLED"],
        CANCELLED: ["SCHEDULED"],
        ABANDONED: ["IN_PROGRESS"],
        IN_PROGRESS: ["SCHEDULED", "CANCELLED"],
        SCHEDULED: ["POSTPONED", "CANCELLED", "IN_PROGRESS", "COMPLETED"],
      }
      if (!(allowed[event.state] || []).includes(to)) return false
      if (to === "COMPLETED" || to === "ABANDONED") {
        return coachOnEvent(event) || officialOnEvent(event)
      }
      if (to === "CANCELLED") return coachOnEvent(event) || officialOnEvent(event)
      if (to === "POSTPONED") return coachOnEvent(event) || officialOnEvent(event)
      return coachOnEvent(event) || officialOnEvent(event)
    },
    canChat: roleNames.some((r) =>
      ["PLAYER", "CAPTAIN", "COACH"].includes(r),
    ) && (hasMembership || isSelfPlayer),
    canPublishAnnouncement: official,
    canCorrectAnnouncement: () => official,
    canArchiveAnnouncement: () => official,
    canManagePeople: admin,
    canManageStructure: admin,
    canManageCompetitions: admin || official,
    canViewCompetitions: admin || official,
    canViewAudit: admin,
    canRespondOwn: isSelfPlayer && hasMembership,
    canViewDni: admin,
    canViewBirth: admin,
    canViewContact: (person: Person) => {
      if (person.id === actor.id) return true
      if (admin) return true
      if (official) return true
      // COACH/CAPTAIN del equipo actual de la persona consultada.
      const theirTeams = activeTeamAssignments(state, person.id).map(
        (a) => a.teamId,
      )
      return (
        coachTeams.some((id) => theirTeams.includes(id)) ||
        captainTeams.some((id) => theirTeams.includes(id))
      )
    },
    canOpen: (page: Page) => {
      switch (page) {
        case "more":
        case "profile":
        case "home":
        case "calendar":
        case "search":
        case "notifications":
          return true
        case "teams":
          return teamIds.length > 0
        case "communication":
          return authority.canChat
        case "reports":
          return isSelfPlayer || coachTeams.length > 0 || official
        case "audit":
          return admin
        case "management":
          return admin
        case "structure":
          return admin
        case "people":
          return admin
        case "competitions":
          return admin || official
        case "announcements":
          return official
        default:
          return true
      }
    },
    scopeLabelOf: (roleId: string) => {
      const assignment = roles.find((item) => item.id === roleId)
      return assignment ? roleScopeLabel(state, assignment) : ""
    },
  }

  return authority
}
