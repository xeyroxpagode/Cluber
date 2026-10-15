import type {
  Event,
  EventState,
  Person,
  Role,
  RoleAssignment,
  State,
  TeamAssignment,
} from "./model"
import { todayIso } from "./clock"

const at = (item: { validFrom: string; validUntil: string | null }, today = todayIso()) =>
  item.validFrom <= today && (!item.validUntil || item.validUntil > today)

export const activeMemberships = (state: State, personId: string) =>
  state.memberships.filter(
    (item) => item.personId === personId && at(item),
  )

export const membershipOf = (state: State, personId: string) =>
  activeMemberships(state, personId)[0] ?? null

export const activeTeamAssignments = (
  state: State,
  personId: string,
): TeamAssignment[] =>
  state.teamAssignments.filter(
    (item) => item.personId === personId && at(item),
  )

export const activeRoleAssignments = (
  state: State,
  personId: string,
): RoleAssignment[] =>
  (state.people.find((p) => p.id === personId)?.roleAssignments ?? []).filter(
    (item) => at(item),
  )

export const rolesOf = (state: State, personId: string): Role[] =>
  Array.from(new Set(activeRoleAssignments(state, personId).map((r) => r.role)))

export const hasRoleIn = (
  state: State,
  personId: string,
  role: Role,
) => rolesOf(state, personId).includes(role)

/** Etiqueta de alcance de una asignación de rol, en vocabulario usuario. */
export function roleScopeLabel(
  state: State,
  assignment: RoleAssignment,
): string {
  if (assignment.scope === "CLUB") return "Todo el club"
  if (assignment.scope === "TEAM") {
    const team = state.teams.find((item) => item.id === assignment.target)
    if (!team) return "Equipo"
    const division = state.structure.find((s) => s.id === team.divisionId)?.name
    const line = state.structure.find((s) => s.id === team.lineId)?.name
    return `${division} ${line}`
  }
  const event = state.events.find((item) => item.id === assignment.target)
  return event ? `Evento: ${event.title || event.opponent}` : "Evento"
}

/* ── Scope de eventos ────────────────────────────────────────── */

/** Eventos donde la persona tiene alcance operativo (club / equipo / persona). */
export function eventsInScopeOfPerson(state: State, personId: string): string[] {
  const roles = activeRoleAssignments(state, personId)
  const clubWide = roles.some((r) => r.scope === "CLUB")
  const teams = new Set<string>()
  roles.forEach((r) => {
    if (r.scope === "TEAM") teams.add(r.target)
  })
  activeTeamAssignments(state, personId).forEach((a) => teams.add(a.teamId))
  return state.events
    .filter((event) => {
      if (clubWide) return true
      if (roles.some((r) => r.scope === "EVENT" && r.target === event.id)) return true
      return event.targetTeams.some((id) => teams.has(id))
    })
    .map((event) => event.id)
}

/** Alcance de lectura de un actor (V1.1: sólo su propio lugar en el club). */
export function scopeTeamIds(state: State, actorId: string): string[] {
  const roles = activeRoleAssignments(state, actorId)
  if (roles.some((r) => r.scope === "CLUB")) {
    return state.teams
      .filter((team) => team.state === "ACTIVE")
      .map((team) => team.id)
  }
  const ids = new Set<string>()
  roles.forEach((r) => {
    if (r.scope === "TEAM") ids.add(r.target)
  })
  activeTeamAssignments(state, actorId).forEach((a) => ids.add(a.teamId))
  return Array.from(ids)
}

export function visibleEvents(state: State, actorId: string): Event[] {
  const roles = activeRoleAssignments(state, actorId)
  const clubWide = roles.some((r) => r.scope === "CLUB")
  const teams = new Set(scopeTeamIds(state, actorId))
  return state.events.filter((event) => {
    if (event.clubWide) return clubWide || teams.size > 0
    if (clubWide) return true
    if (event.targetTeams.some((id) => teams.has(id))) return true
    return event.targetPersonIds.includes(actorId)
  })
}

/* ── Integridad de perfil ────────────────────────────────────── */

/** Campos PII administrados por el club que bloquean la asignación (D6). */
export const PROTECTED_IDENTITY_FIELDS = ["dni", "birth"] as const

export interface ProfileCompleteness {
  complete: boolean
  missing: Array<{ key: string; label: string }>
}

export function profileCompleteness(person: Person): ProfileCompleteness {
  const missing: Array<{ key: string; label: string }> = []
  if (!person.username) missing.push({ key: "username", label: "nombre de usuario" })
  if (!person.dni) missing.push({ key: "dni", label: "documento de identidad" })
  if (!person.birth) missing.push({ key: "birth", label: "fecha de nacimiento" })
  if (!person.phone) missing.push({ key: "phone", label: "teléfono de contacto" })
  if (!person.email) missing.push({ key: "email", label: "correo electrónico" })
  return { complete: missing.length === 0, missing }
}

/* ── Conflictos de convocatoria (V1.1) ──────────────────────────
   Sólo sobreviven NO_LONGER_EVENT_TARGET y NO_LONGER_TEAM_AFFILIATED.
   ──────────────────────────────────────────────────────────── */

export type ConflictCode = "NO_LONGER_EVENT_TARGET" | "NO_LONGER_TEAM_AFFILIATED"

/** Copy humano de conflicto; nunca exponer el código (Freeze §14). */
export const CONFLICT_TEXT: Record<ConflictCode, string> = {
  NO_LONGER_EVENT_TARGET:
    "Ya no figura entre las destinatarias de este evento.",
  NO_LONGER_TEAM_AFFILIATED:
    "Ya no pertenece al equipo de este partido.",
}

export function selectionConflicts(
  state: State,
  event: Event,
): string[] {
  const published = event.published ?? []
  const conflicts: string[] = []
  published.forEach((personId) => {
    if (!personId) return
    const assigned = activeTeamAssignments(state, personId).some(
      (a) => event.targetTeams.includes(a.teamId),
    )
    const targeted =
      event.targetPersonIds.includes(personId) ||
      event.targetTeams.some((teamId) =>
        activeTeamAssignments(state, personId).some((a) => a.teamId === teamId),
      )
    if (!assigned && !targeted) conflicts.push(personId)
  })
  return Array.from(new Set(conflicts))
}

export function conflictCodesFor(
  state: State,
  event: Event,
  personId: string,
): ConflictCode[] {
  const codes: ConflictCode[] = []
  const targeted =
    event.targetPersonIds.includes(personId) ||
    event.targetTeams.some((teamId) =>
      activeTeamAssignments(state, personId).some((a) => a.teamId === teamId),
    )
  if (!targeted) codes.push("NO_LONGER_EVENT_TARGET")
  const assigned = activeTeamAssignments(state, personId).some(
    (a) => event.targetTeams.includes(a.teamId),
  )
  if (!assigned) codes.push("NO_LONGER_TEAM_AFFILIATED")
  return codes
}

/** Alcance de lectura de un comunicado según la autoridad real del actor. */
export function canReadAnnouncement(
  state: State,
  announcement: { audienceSnapshot: { clubWide: boolean; teamIds: string[] } | null },
  options: {
    clubWide: boolean
    teamIds: string[]
    coachTeamIds: string[]
  },
): boolean {
  const snapshot = announcement.audienceSnapshot
  if (!snapshot) return options.clubWide
  if (snapshot.clubWide) return true
  if (options.clubWide) return true
  if (snapshot.teamIds.some((id) => options.coachTeamIds.includes(id))) return true
  return snapshot.teamIds.some((id) => options.teamIds.includes(id))
}

/* ── Lifecycle ───────────────────────────────────────────────── */

export const EVENT_TRANSITIONS: Record<EventState, EventState[]> = {
  DRAFT: ["SCHEDULED", "CANCELLED"],
  SCHEDULED: ["POSTPONED", "CANCELLED", "IN_PROGRESS"],
  POSTPONED: ["SCHEDULED", "CANCELLED"],
  CANCELLED: ["SCHEDULED"],
  IN_PROGRESS: ["COMPLETED", "ABANDONED"],
  COMPLETED: [],
  ABANDONED: [],
}

export function canTransition(event: Event, to: EventState): boolean {
  return EVENT_TRANSITIONS[event.state].includes(to)
}