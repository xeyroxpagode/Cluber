export type Role = "COACH" | "PLAYER" | "CAPTAIN" | "ADMIN" | "SUBCOMMITTEE"
export type EventState = "DRAFT" | "SCHEDULED" | "POSTPONED" | "CANCELLED" | "IN_PROGRESS" | "COMPLETED" | "ABANDONED"
export type EventType = "MATCH" | "TRAINING" | "CLUB_EVENT"
export type Response = "YES" | "MAYBE" | "NO"
export type AttendanceValue = "PRESENT" | "ABSENT" | "JUSTIFIED"
export interface RoleAssignment {
  id: string
  role: Role
  scope: "CLUB" | "TEAM" | "EVENT"
  target: string
  validFrom: string
  validUntil: string | null
}
export interface Person {
  id: string
  name: string
  team: string
  role: Role
  eligibility: "ELIGIBLE" | "PENDING" | "BLOCKED"
  phone: string
  email: string
  dni: string
  birth: string
  account: "PENDING" | "ACTIVE" | "DISABLED"
  username: string
  roleAssignments?: RoleAssignment[]
  eligibilityReason?: string
  eligibilitySource?: string
  /** Stage 4: credencial mock real (P0-4). version++ en cada cambio. */
  credentialVersion?: number
  passwordSet?: boolean
}
export interface Venue {
  id: string
  name: string
  address: string
  fieldLabel?: string
  archived?: boolean
}
export interface Membership {
  id: string
  personId: string
  validFrom: string
  validUntil: string | null
}
export interface TeamAssignment {
  id: string
  personId: string
  teamId: string
  validFrom: string
  validUntil: string | null
}
export interface GuardianRelationship {
  id: string
  guardianId: string
  childId: string
  relation: string
  canViewChildInfo: boolean
  canRespondAvailability: boolean
  validFrom: string
  validUntil: string | null
}
export interface EligibilityConstraint {
  id: string
  personId: string
  state: "PENDING" | "BLOCKED"
  scope: "CLUB" | "COMPETITION" | "ENTRY" | "EVENT"
  scopeRefId: string | null
  source: "INTERNAL" | "AHBA" | "OTHER"
  reason: "ADMIN" | "DISCIPLINE" | "FEDERATION" | "MEDICAL_CLEARANCE" | "OTHER"
  note?: string
  validFrom: string
  validUntil: string | null
}
export interface EventSeries {
  id: string
  name: string
  status: "ACTIVE" | "ENDED"
}
export type NotificationType =
  | "EVENT_CHANGED"
  | "EVENT_POSTPONED"
  | "EVENT_RESCHEDULED"
  | "EVENT_CANCELLED"
  | "EVENT_RESTORED"
  | "SELECTION_PUBLISHED"
  | "ANNOUNCEMENT_PUBLISHED"
export interface Team {
  id: string
  name: string
  division: string
  line: string
  season: string
  state: "DRAFT" | "ACTIVE" | "ARCHIVED"
}
export interface Availability {
  value: Response
  revision: number
}
export interface PlayerStat {
  played: boolean
  goals: number
  assists: number
}
export interface Event {
  id: string
  title: string
  type: EventType
  team: string
  /** Stage 4: targets plurales. `team` se conserva como compat y equivale a targetTeams[0]. */
  targetTeams?: string[]
  targetPersonIds?: string[]
  seriesId?: string | null
  venueId?: string
  date: string
  time: string
  end: string
  venue: string
  /** Dirección derivada del Venue (no literal en UI). */
  venueAddress?: string
  opponent: string
  state: EventState
  revision: number
  version: number
  competition: string
  meeting: string
  departure: string
  point: string
  transport: string
  arrival: string
  clubWide: boolean
  availability: Record<string, Availability>
  selection: string[]
  published: string[] | null
  selectionRevisions: {
    id: string
    players: readonly string[]
    author: string
    date: string
  }[]
  attendance: Record<string, AttendanceValue>
  attendanceOpened: boolean
  attendanceClosed: boolean
  /** P0-2: historial before/after, nunca sobrescribe. */
  attendanceHistory?: Array<{
    id: string
    personId: string
    before: AttendanceValue | null
    after: AttendanceValue
    actor: string
    date: string
    reason?: string
    correction?: boolean
  }>
  record: {
    state: "DRAFT" | "FINAL"
    status: "PLAYED" | "FORFEIT" | "ABANDONED"
    gei: number
    opponent: number
    observations: string
    stats: Record<string, PlayerStat>
  }
  /** P0-3: historial del acta, FINAL solo se corrige explícitamente. */
  recordHistory?: Array<{
    id: string
    before: string
    after: string
    actor: string
    date: string
    reason: string
  }>
  history: string[]
}
export interface Announcement {
  id: string
  title: string
  body: string
  audience: string
  state: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  date: string
  publisher: string
}
export interface Message {
  id: string
  author: string
  body: string
  time: string
  edited?: boolean
  deleted?: boolean
}
export interface Conversation {
  eventId?: string
  teamId?: string
  id: string
  title: string
  kind: "TEAM" | "EVENT" | "DIRECT" | "GROUP"
  participants: string[]
  unread: number
  messages: Message[]
}
export interface Notice {
  recipients?: string[]
  readBy?: string[]
  id: string
  title: string
  body: string
  route: string
  date: string
  read: boolean
  /** Stage 4: tipo real §22. Opcional para seed legacy. */
  type?: NotificationType
}
export interface StructureItem {
  id: string
  type: string
  name: string
  archived: boolean
}
export interface Competition {
  id: string
  name: string
  organizer: string
  state: "DRAFT" | "ACTIVE" | "CLOSED"
  entries: {
    id: string
    team: string
    scope: "TEAM" | "LINE"
    state: "PENDING" | "ACTIVE" | "ENDED"
    reference: string
  }[]
}
export interface Jornada {
  id: string
  name: string
  season: string
  competition: string
  events: string[]
}
export interface AuditEntry {
  id: string
  actor: string
  action: string
  resource: string
  reason: string
  date: string
}
export interface State {
  people: Person[]
  teams: Team[]
  events: Event[]
  announcements: Announcement[]
  conversations: Conversation[]
  notifications: Notice[]
  structure: StructureItem[]
  competitions: Competition[]
  jornadas: Jornada[]
  audit: AuditEntry[]
  /** Stage 4 canonical mock */
  venues: Venue[]
  eligibilityConstraints: EligibilityConstraint[]
  memberships: Membership[]
  teamAssignments: TeamAssignment[]
  guardianRelationships: GuardianRelationship[]
  eventSeries: EventSeries[]
}
export const labels: Record<string, string> = {
  DRAFT: "Borrador",
  SCHEDULED: "Programado",
  POSTPONED: "Postergado",
  CANCELLED: "Cancelado",
  IN_PROGRESS: "En curso",
  COMPLETED: "Finalizado",
  ABANDONED: "Abandonado",
  PUBLISHED: "Publicado",
  ARCHIVED: "Archivado",
  ACTIVE: "Activo",
  DISABLED: "Deshabilitada",
  PENDING: "Pendiente",
  CLOSED: "Cerrada",
  ENDED: "Finalizada",
  FINAL: "Final",
  ELIGIBLE: "Elegible",
  BLOCKED: "Bloqueada",
  YES: "Sí",
  MAYBE: "Tal vez",
  NO: "No",
  PRESENT: "Presente",
  ABSENT: "Ausente",
  JUSTIFIED: "Justificada",
  PLAYER: "Jugadora",
  CAPTAIN: "Capitana",
  COACH: "Entrenador",
  ADMIN: "Administrador",
  SUBCOMMITTEE: "Subcomisión",
  MATCH: "Partido",
  TRAINING: "Entrenamiento",
  CLUB_EVENT: "Evento del club",
  PLAYED: "Jugado",
  FORFEIT: "No presentación",
}
export const dateLabel = (date: string, long = false) =>
  date
    ? new Date(`${date}T12:00:00`).toLocaleDateString(
        "es-AR",
        long
          ? { weekday: "long", day: "numeric", month: "long" }
          : { weekday: "short", day: "numeric", month: "short" },
      )
    : "Fecha a definir"
export const initials = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
export const eventName = (event: Event) =>
  event.type === "MATCH"
    ? `GEI vs. ${event.opponent || "Rival a definir"}`
    : event.title || labels[event.type]
export const availabilityLabel = (event: Event, person: string) =>
  !event.availability[person]
    ? "Sin respuesta"
    : event.availability[person].revision !== event.revision
      ? "Necesita reconfirmación"
      : labels[event.availability[person].value]

/** Stage 4 helpers: fuente plural sin exponer implementación en UI. */
export function eventTeamIds(event: Event): string[] {
  if (event.targetTeams && event.targetTeams.length > 0) return event.targetTeams
  return event.team ? [event.team] : []
}
export function eventPersonIds(event: Event): string[] {
  return event.targetPersonIds ?? []
}
/** Texto usuario para targets: "Sexta A", "Sexta A + 2 personas", "Todo hockey". */
export function eventTargetsText(
  event: Event,
  teamNameOf: (id: string) => string,
): string {
  if (event.clubWide) return "Todo hockey"
  const teams = eventTeamIds(event).map(teamNameOf)
  const extra = eventPersonIds(event).length
  if (teams.length === 0 && extra === 0) return "Sin destino"
  if (extra === 0) return teams.join(" · ")
  return `${teams.join(" · ")} + ${extra} ${extra === 1 ? "persona" : "personas"}`
}
export function venueAddressOf(state: State, event: Event): string {
  if (event.venueAddress) return event.venueAddress
  const byId = event.venueId
    ? state.venues.find((v) => v.id === event.venueId)
    : undefined
  if (byId) return byId.address
  const byName = state.venues.find((v) => v.name === event.venue)
  if (byName) return byName.address
  return ""
}
