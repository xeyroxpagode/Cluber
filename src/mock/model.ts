/**
 * GEI Hockey · Modelo de dominio del simulador local.
 *
 * Regla de Stage 6 §16: `Person` NO es fuente de UI.
 * Identidad, pertenencia, roles y elegibilidad se derivan de
 * Membership / TeamAssignment / RoleAssignment / EligibilityConstraint.
 */

export type Role = "COACH" | "PLAYER" | "CAPTAIN" | "ADMIN" | "SUBCOMMITTEE"
export type EventState =
  | "DRAFT"
  | "SCHEDULED"
  | "POSTPONED"
  | "CANCELLED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ABANDONED"
export type EventType = "MATCH" | "TRAINING" | "CLUB_EVENT"
export type Response = "YES" | "MAYBE" | "NO"
export type AttendanceValue = "PRESENT" | "ABSENT" | "JUSTIFIED"

/** Estados terminales: no admiten operación de coordinación. */
export const TERMINAL_EVENT_STATES: EventState[] = [
  "CANCELLED",
  "COMPLETED",
  "ABANDONED",
]
/** Estados sin horario operativo vigente. */
export const INACTIVE_EVENT_STATES: EventState[] = [
  "DRAFT",
  "POSTPONED",
  "CANCELLED",
  "COMPLETED",
  "ABANDONED",
]

export type RoleScope = "CLUB" | "TEAM" | "EVENT"

export interface RoleAssignment {
  id: string
  role: Role
  scope: RoleScope
  /** teamId | eventId | "club" */
  target: string
  validFrom: string
  validUntil: string | null
}

export interface Person {
  id: string
  name: string
  firstName: string
  lastName: string
  phone: string
  email: string
  /** PII · sólo ADMIN */
  dni: string
  /** PII · sólo ADMIN */
  birth: string
  account: "PENDING" | "ACTIVE" | "DISABLED"
  username: string
  credentialVersion: number
  passwordSet: boolean
  lastActivityAt: string
  sessions: MockSession[]
  setupToken: SetupToken | null
  /** Autoridad deportiva y administrativa: única fuente de roles. */
  roleAssignments: RoleAssignment[]
}

export interface MockSession {
  id: string
  device: string
  createdAt: string
  lastSeenAt: string
  current: boolean
}

export interface SetupToken {
  code: string
  issuedAt: string
  expiresAt: string
  used: boolean
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

export type ConstraintScope = "CLUB" | "COMPETITION" | "ENTRY" | "EVENT"
export type ConstraintSource = "INTERNAL" | "AHBA" | "OTHER"
export type ConstraintReason =
  | "ADMIN"
  | "DISCIPLINE"
  | "FEDERATION"
  | "MEDICAL_CLEARANCE"
  | "OTHER"

export interface EligibilityConstraint {
  id: string
  personId: string
  state: "PENDING" | "BLOCKED"
  scope: ConstraintScope
  scopeRefId: string | null
  source: ConstraintSource
  reason: ConstraintReason
  note?: string
  validFrom: string
  validUntil: string | null
  createdAt: string
  createdBy: string
}

export type SeriesStatus = "ACTIVE" | "ENDED"

export interface EventSeries {
  id: string
  name: string
  status: SeriesStatus
  createdAt: string
}

export type NotificationType =
  | "EVENT_CHANGED"
  | "EVENT_POSTPONED"
  | "EVENT_RESCHEDULED"
  | "EVENT_CANCELLED"
  | "EVENT_RESTORED"
  | "SELECTION_PUBLISHED"
  | "ANNOUNCEMENT_PUBLISHED"

export type StructureType = "SEASON" | "DIVISION" | "LINE" | "VENUE"

export interface StructureItem {
  id: string
  type: StructureType
  name: string
  /** DIVISION → seasonId */
  parentId?: string | null
  archived: boolean
}

export interface Team {
  id: string
  divisionId: string
  lineId: string
  seasonId: string
  state: "ACTIVE" | "ARCHIVED"
}

export interface Availability {
  value: Response
  coordinationRevision: number
  answeredAt: string
}

export interface PlayerStat {
  played: boolean
  goals: number
  assists: number
}

export type SeriesScope = "ONLY_THIS" | "THIS_AND_FOLLOWING" | "ENTIRE_SERIES"

export interface EventOccurrenceOverride {
  eventId: string
  seriesId: string
  /** Campos que esta ocurrencia ya no comparte con la serie. */
  fields: string[]
  at: string
  by: string
}

export interface Event {
  id: string
  title: string
  type: EventType
  targetTeams: string[]
  targetPersonIds: string[]
  seriesId: string | null
  venueId: string
  date: string
  time: string
  end: string
  opponent: string
  state: EventState
  /** Sólo los cambios materiales incrementan coordinationRevision (Freeze §11). */
  coordinationRevision: number
  /** Concurrencia optimista: incrementa en cada escritura. */
  version: number
  competitionId: string | null
  competitionEntryId: string | null
  meeting: string
  departure: string
  point: string
  transport: string
  arrival: string
  clubWide: boolean
  availability: Record<string, Availability>
  selection: string[]
  selectionDraftAt: string | null
  published: string[] | null
  publishedAt: string | null
  selectionRevisions: SelectionRevision[]
  attendance: Record<string, AttendanceValue>
  attendanceOpened: boolean
  attendanceClosedAt: string | null
  attendanceHistory: HistoryEntry<AttendanceValue | null>[]
  record: MatchRecord
  recordHistory: MatchRecordHistoryEntry[]
  history: HistoryLine[]
  divergedFromSeries: boolean
}

export interface HistoryLine {
  id: string
  at: string
  actor: string
  text: string
}

export interface SelectionRevision {
  id: string
  players: readonly string[]
  added: readonly string[]
  removed: readonly string[]
  author: string
  at: string
  conflicts: readonly string[]
}

export interface HistoryEntry<T> {
  id: string
  personId?: string
  before: T | null
  after: T
  actor: string
  at: string
  reason?: string
  correction?: boolean
}

export interface MatchRecordHistoryEntry {
  id: string
  before: string
  after: string
  actor: string
  at: string
  reason: string
}

export interface MatchRecord {
  state: "DRAFT" | "FINAL"
  status: "PLAYED" | "FORFEIT" | "ABANDONED"
  gei: number
  opponent: number
  observations: string
  stats: Record<string, PlayerStat>
}

/** Audiencia de comunicado: club completo o conjunto real de equipos. */
export type AnnouncementAudience =
  | { kind: "CLUB" }
  | { kind: "TEAMS"; teamIds: string[] }

export interface AudienceSnapshot {
  clubWide: boolean
  teamIds: string[]
  label: string
  at: string
}

export interface Announcement {
  id: string
  title: string
  body: string
  audience: AnnouncementAudience
  audienceSnapshot: AudienceSnapshot | null
  state: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  at: string
  publisher: string
  corrections: AnnouncementCorrection[]
}

export interface AnnouncementCorrection {
  id: string
  at: string
  actor: string
  before: string
  after: string
  reason: string
}

export type MessageState = "SENDING" | "SENT" | "FAILED"

export interface Message {
  id: string
  author: string
  body: string
  at: string
  state: MessageState
  edited?: boolean
  deletedAt?: string | null
}

export interface Conversation {
  id: string
  eventId?: string
  teamId?: string
  kind: "TEAM" | "EVENT" | "DIRECT" | "GROUP"
  participants: string[]
  unread: Record<string, number>
  state: "ACTIVE" | "ARCHIVED"
  messages: Message[]
}

export interface Notice {
  id: string
  type: NotificationType
  title: string
  body: string
  route: string
  at: string
  recipients: string[]
  readBy: string[]
}

export interface CompetitionEntryTeam {
  id: string
  scope: "TEAM"
  teamId: string
  state: "PENDING" | "ACTIVE" | "ENDED"
  reference: string
}

export interface CompetitionEntryLine {
  id: string
  scope: "LINE"
  divisionId: string
  lineId: string
  seasonId: string
  state: "PENDING" | "ACTIVE" | "ENDED"
  reference: string
}

export type CompetitionEntry = CompetitionEntryTeam | CompetitionEntryLine

/** Payload de alta de inscripción: el mismo modelo, sin id. */
export type NewCompetitionEntry =
  | Omit<CompetitionEntryTeam, "id">
  | Omit<CompetitionEntryLine, "id">

export interface Competition {
  id: string
  name: string
  organizer: string
  state: "DRAFT" | "ACTIVE" | "CLOSED"
  entries: CompetitionEntry[]
}

export interface Jornada {
  id: string
  name: string
  seasonId: string
  competitionId: string
  events: string[]
  at: string
  venueId: string | null
  meeting: string
  departure: string
  point: string
}

export interface AuditEntry {
  id: string
  actor: string
  action: string
  resource: string
  before: string | null
  after: string | null
  source: string
  at: string
  route: string
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
  venues: Venue[]
  eligibilityConstraints: EligibilityConstraint[]
  memberships: Membership[]
  teamAssignments: TeamAssignment[]
  guardianRelationships: GuardianRelationship[]
  eventSeries: EventSeries[]
  eventOccurrenceOverrides: EventOccurrenceOverride[]
}

/* ──────────────────────────────────────────────────────────────
   Etiquetas de dominio. Una sola fuente de vocabulario (Stage 6 §37).
   `states.ts` expone el mismo mapa; este es el canónico de dominio.
   ────────────────────────────────────────────────────────────── */

export const labels: Record<string, string> = {
  DRAFT: "Borrador",
  SCHEDULED: "Programado",
  POSTPONED: "Postergado",
  CANCELLED: "Cancelado",
  IN_PROGRESS: "En curso",
  COMPLETED: "Finalizado",
  ABANDONED: "Suspendido",
  PUBLISHED: "Publicado",
  ARCHIVED: "Archivado",
  ACTIVE: "Activo",
  DISABLED: "Deshabilitada",
  PENDING: "Pendiente",
  OPEN: "Abierta",
  CLOSED: "Cerrada",
  ENDED: "Finalizada",
  FINAL: "Final",
  ELIGIBLE: "Habilitada",
  MAYBE: "Tal vez",
  PRESENT: "Presente",
  ABSENT: "Ausente",
  JUSTIFIED: "Justificada",
  PLAYER: "Jugadora",
  CAPTAIN: "Capitana",
  COACH: "Entrenador",
  ADMIN: "Administración",
  SUBCOMMITTEE: "Subcomisión",
  MATCH: "Partido",
  TRAINING: "Entrenamiento",
  CLUB_EVENT: "Evento del club",
  PLAYED: "Jugado",
  FORFEIT: "No presentación",
}

/** Vocabulario único de roles para toda la interfaz. */
export const roleText: Record<Role, string> = {
  PLAYER: "Jugadora",
  CAPTAIN: "Capitana",
  COACH: "Entrenador",
  ADMIN: "Administración",
  SUBCOMMITTEE: "Subcomisión",
}

export const roleTextOf = (role: string) =>
  roleText[role as Role] ?? "Sin rol deportivo"

/** Estado derivado de disponibilidad que la jugadora ve. */
export type AvailabilityView = Response | "NO_RESPONSE" | "NEEDS_RECONFIRMATION"

/* ──────────────────────────────────────────────────────────────
   Presentación derivada (nunca literales en pantalla)
   ────────────────────────────────────────────────────────────── */

export const dateLabel = (date: string, long = false) => {
  if (!date) return "Fecha a definir"
  return new Date(`${date}T12:00:00`).toLocaleDateString(
    "es-AR",
    long
      ? { weekday: "long", day: "numeric", month: "long", year: "numeric" }
      : { weekday: "short", day: "numeric", month: "short" },
  )
}

export const shortDate = (date: string) => {
  if (!date) return "—"
  return new Date(`${date}T12:00:00`).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
  })
}

export const dateTimeLabel = (at: string) => {
  if (!at) return "—"
  const date = new Date(at)
  return date.toLocaleString("es-AR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const relativeLabel = (at: string, now: Date) => {
  const minutes = Math.round((now.getTime() - new Date(at).getTime()) / 60000)
  if (minutes < 1) return "Recién"
  if (minutes < 60) return `Hace ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `Hace ${hours} h`
  const days = Math.round(hours / 24)
  if (days === 1) return "Ayer"
  if (days < 7) return `Hace ${days} días`
  return dateLabel(at.slice(0, 10))
}

export const periodLabel = (from: string, until: string | null) =>
  until
    ? `${dateLabel(from, true)} — ${dateLabel(until, true)}`
    : `Desde ${dateLabel(from, true)}`

export const initials = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

export const eventName = (event: Event) =>
  event.type === "MATCH"
    ? `GEI vs. ${event.opponent || "Rival a definir"}`
    : event.title || labels[event.type]

/** ¿Tiene fecha/hora operativa vigente? */
export const hasLiveSchedule = (event: Event) =>
  !["POSTPONED", "DRAFT"].includes(event.state)

export function eventAvailabilityView(
  event: Event,
  personId: string,
): AvailabilityView {
  const answer = event.availability[personId]
  if (!answer) return "NO_RESPONSE"
  if (answer.coordinationRevision !== event.coordinationRevision)
    return "NEEDS_RECONFIRMATION"
  return answer.value
}

export function venueOf(state: State, event: Event): Venue | undefined {
  return state.venues.find((venue) => venue.id === event.venueId)
}

export function structureName(state: State, id: string | null | undefined) {
  if (!id) return ""
  return state.structure.find((item) => item.id === id)?.name ?? ""
}

/** "Sexta A" · nombre de equipo concreto derivado de estructura. */
export function teamName(state: State, teamId: string | null | undefined) {
  if (!teamId) return ""
  const team = state.teams.find((item) => item.id === teamId)
  if (!team) return ""
  return `${structureName(state, team.divisionId)} ${structureName(state, team.lineId)}`.trim()
}

/** "Línea A · Sexta · Temporada 2026" · nunca sólo "Línea A" (D4). */
export function lineEntryLabel(
  state: State,
  entry: CompetitionEntryLine,
): string {
  return `Línea ${structureName(state, entry.lineId)} · ${structureName(
    state,
    entry.divisionId,
  )} · Temporada ${structureName(state, entry.seasonId)}`
}

export function teamEntryLabel(state: State, entry: CompetitionEntryTeam): string {
  return `Equipo · ${teamName(state, entry.teamId)}`
}

export function entryLabel(state: State, entry: CompetitionEntry): string {
  return entry.scope === "TEAM"
    ? teamEntryLabel(state, entry)
    : lineEntryLabel(state, entry)
}

/** Origen de un CompetitionEntry LINE → Team concreto. */
export function entryResolvesToTeam(
  state: State,
  entry: CompetitionEntry,
): string | null {
  if (entry.scope === "TEAM") return entry.teamId
  const team = state.teams.find(
    (item) =>
      item.divisionId === entry.divisionId &&
      item.lineId === entry.lineId &&
      item.seasonId === entry.seasonId,
  )
  return team?.id ?? null
}

/** Texto de destino de un evento, derivado. */
export function eventTargetsText(state: State, event: Event): string {
  if (event.clubWide) return "Todo el hockey"
  const teams = event.targetTeams
    .map((id) => teamName(state, id))
    .filter(Boolean)
  const extra = event.targetPersonIds.length
  if (teams.length === 0 && extra === 0) return "Sin destino asignado"
  if (teams.length === 0) return `${extra} personas`
  if (extra === 0) return teams.join(" + ")
  return `${teams.join(" + ")} + ${extra} ${extra === 1 ? "persona" : "personas"}`
}