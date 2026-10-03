import type { Event, Person } from "./model"
import { currentRoles, hasRole } from "./permissions"

/**
 * Authority visual derivada (Stage 4 §43).
 * La UI consume allowedActions; no reimplementa `role === "ADMIN"` por pantalla.
 * Esto simula /me + allowedActions del backend sin backend real.
 */

export interface AllowedActions {
  canCreateEvent: boolean
  canEditEvent: boolean
  canManageLogistics: boolean
  canManageSelection: boolean
  canManageAttendance: boolean
  canManageRecord: boolean
  canPublishAnnouncement: boolean
  canManagePeople: boolean
  canManageStructure: boolean
  canManageCompetitions: boolean
  canViewAudit: boolean
  canViewEligibilityDetail: boolean
  canViewContact: boolean
  canViewDni: boolean
  canChat: boolean
  isCoachOfTeam: (teamId: string) => boolean
}

function coachOf(actor: Person, teamId: string): boolean {
  return currentRoles(actor).some(
    (a) =>
      a.role === "COACH" &&
      ((a.scope === "TEAM" && a.target === teamId) || a.scope === "EVENT"),
  )
}

export function getAllowedActions(actor: Person, event?: Event): AllowedActions {
  const admin = hasRole(actor, "ADMIN")
  const sub = hasRole(actor, "SUBCOMMITTEE")
  const coachTeamScope = currentRoles(actor).some((a) => a.role === "COACH")
  const coachEvent =
    !!event &&
    currentRoles(actor).some(
      (a) =>
        a.role === "COACH" &&
        ((a.scope === "TEAM" && a.target === event.team) ||
          (a.scope === "EVENT" && a.target === event.id)),
    )
  const isCoachOfTeam = (teamId: string) => coachOf(actor, teamId)

  return {
    canCreateEvent: coachTeamScope || sub,
    canEditEvent: coachEvent || sub,
    canManageLogistics: coachEvent || sub,
    canManageSelection: coachEvent,
    canManageAttendance: coachEvent,
    canManageRecord: coachEvent,
    canPublishAnnouncement: sub && !admin,
    canManagePeople: admin,
    canManageStructure: admin,
    canManageCompetitions: admin || sub,
    canViewAudit: admin,
    // P0-5: solo COACH del scope, SUBCOMMITTEE y ADMIN ven detalle operativo de elegibilidad.
    canViewEligibilityDetail: coachEvent || coachTeamScope || sub || admin,
    // PII §6: contacto solo por necesidad operativa; DNI solo ADMIN.
    canViewContact: coachTeamScope || sub || admin || false,
    canViewDni: admin,
    canChat:
      hasRole(actor, "PLAYER") ||
      hasRole(actor, "CAPTAIN") ||
      hasRole(actor, "COACH"),
    isCoachOfTeam,
  }
}
