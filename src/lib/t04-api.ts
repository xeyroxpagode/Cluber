/**
 * T04 R3 — cliente HTTP real de participación.
 *
 * Cubre las 16 rutas HTTP del inventario normativo (COR-03):
 *  11 comandos CMD-PRT + CMD-EVT-17 + RC-15/16/17 + proyección PLAYER.
 * No hay mocks: cada función habla con el backend real.
 */
import { apiRequest, apiJson } from "./api.js"
import { getCsrfToken } from "./session.js"

export type AvailabilityValue = "YES" | "MAYBE" | "NO"
export type AvailabilityState = AvailabilityValue | "NO_RESPONSE" | "NEEDS_RECONFIRMATION"
export type AttendanceValue = "PRESENT" | "ABSENT" | "JUSTIFIED"
export type AttendanceState = AttendanceValue | "UNRECORDED"
export type SelectionRole = "SELECTED" | "ALTERNATE"
export type ResultType = "PLAYED" | "FORFEIT" | "ABANDONED"

export interface AvailabilitySelf {
  eventId: string
  value: AvailabilityValue | null
  state: AvailabilityState
  respondedAt: string | null
  coordinationRevision: number | null
  eventCoordinationRevision: number
  needsReconfirmation: boolean
}

export interface AvailabilitySummaryItem {
  personId: string
  name: string | null
  value: AvailabilityValue | null
  state: AvailabilityState
  respondedAt: string | null
  coordinationRevision: number | null
  needsReconfirmation: boolean
}

export interface AvailabilitySummary {
  eventId: string
  eventState: string
  coordinationRevision: number
  counts: { YES: number; MAYBE: number; NO: number; NO_RESPONSE: number; NEEDS_RECONFIRMATION: number }
  items: AvailabilitySummaryItem[]
  total: number
}

export interface SelectionConflict {
  personId: string
  code: "NO_LONGER_EVENT_TARGET" | "NO_LONGER_TEAM_AFFILIATED"
  reason: string
}

export interface SelectionEntryView {
  personId: string
  role: SelectionRole
  order: number | null
  conflicts: SelectionConflict[]
}

export interface SelectionRevisionView {
  revisionId: string
  state: "DRAFT" | "PUBLISHED"
  autosaveVersion: number
  publishedAt: string | null
  publishedBy: string | null
  entries: SelectionEntryView[]
  conflicts: SelectionConflict[]
}

export interface SelectionDetail {
  selectionId: string | null
  matchId: string
  currentDraft: SelectionRevisionView | null
  publishedRevisions: SelectionRevisionView[]
  history: Array<{ revisionId: string; publishedAt: string | null; added: string[]; removed: string[]; changed: string[] }>
}

export interface PlayerSelectionStatus {
  matchId: string
  status: "SELECTED" | "ALTERNATE" | "NOT_SELECTED"
  order: number | null
  publishedAt: string | null
  revisionId: string | null
}

export interface AttendanceCorrectionView {
  id: string
  previousValue: AttendanceValue | null
  newValue: AttendanceValue
  correctionReason: string
  correctedAt: string
  correctedBy: string
}

export interface AttendanceItem {
  personId: string
  name: string
  entryId: string | null
  value: AttendanceValue | null
  state: AttendanceState
  recordedAt: string | null
  correctedAt: string | null
  correctionReason: string | null
  previousValue: AttendanceValue | null
  corrections: AttendanceCorrectionView[]
}

export interface AttendanceDetail {
  eventId: string
  sheetId: string | null
  state: "OPEN" | "CLOSED"
  closedAt: string | null
  closedBy: string | null
  counts: { PRESENT: number; ABSENT: number; JUSTIFIED: number; UNRECORDED: number }
  items: AttendanceItem[]
  staff: string[]
}

export interface PlayerStatsView {
  personId: string
  name: string | null
  minutesPlayed: number | null
  goals: number | null
  assists: number | null
  yellowCards: number | null
  redCards: number | null
  mvp: boolean
}

export interface MatchRecordCorrectionView {
  id: string
  previousResultType: ResultType | null
  newResultType: ResultType | null
  previousHomeScore: number | null
  newHomeScore: number | null
  previousAwayScore: number | null
  newAwayScore: number | null
  previousObservations: string | null
  newObservations: string | null
  correctionReason: string
  correctedAt: string
  correctedBy: string
}

export interface MatchRecordDetail {
  matchRecordId: string | null
  matchId: string
  state: "DRAFT" | "FINAL" | null
  resultType: ResultType | null
  homeScore: number | null
  awayScore: number | null
  observations: string | null
  finalizedAt: string | null
  finalizedBy: string | null
  correctedAt: string | null
  correctedBy: string | null
  correctionReason: string | null
  previousResultType: ResultType | null
  previousHomeScore: number | null
  previousAwayScore: number | null
  previousObservations: string | null
  event: { id: string; state: string; version: number; coordinationRevision: number }
  playerStats: PlayerStatsView[]
  corrections: MatchRecordCorrectionView[]
}

export interface AttendanceContext {
  ownAvailability: AvailabilitySelf | null
  attendance: AttendanceDetail | null
}

const creds = () => ({ credentials: "include" as RequestCredentials, csrfToken: getCsrfToken() ?? undefined, headers: { "Content-Type": "application/json" } })

function omitNull(values: Record<string, unknown> | Record<string, string | number | boolean | null | undefined>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(values)) if (value !== null && value !== undefined) out[key] = value
  return out
}

function key(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `idem-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/* ── Disponibilidad ── */

export async function fetchRespondAvailability(input: {
  eventId: string
  value: AvailabilityValue
  observedCoordinationRevision: number
}): Promise<{ responded: boolean; value: AvailabilityValue; coordinationRevision: number; respondedAt: string; needsReconfirmation: boolean }> {
  return apiRequest(`/api/events/${encodeURIComponent(input.eventId)}/availability`, {
    method: "POST",
    ...creds(),
    body: apiJson({ value: input.value, observedCoordinationRevision: input.observedCoordinationRevision, idempotency_key: key() }),
  })
}

export async function fetchAvailabilitySummary(eventId: string): Promise<AvailabilitySummary> {
  return apiRequest(`/api/events/${encodeURIComponent(eventId)}/availability/summary`, { method: "GET", credentials: "include", headers: { Accept: "application/json" } })
}

/* ── Convocatoria ── */

export async function fetchSelectionDetail(eventId: string): Promise<SelectionDetail> {
  return apiRequest(`/api/events/${encodeURIComponent(eventId)}/selection`, { method: "GET", credentials: "include", headers: { Accept: "application/json" } })
}

export async function fetchSelectionConflicts(eventId: string): Promise<{ matchId: string; revisionId: string | null; state: string | null; conflicts: SelectionConflict[]; entries: SelectionEntryView[] }> {
  return apiRequest(`/api/events/${encodeURIComponent(eventId)}/selection/conflicts`, { method: "GET", credentials: "include", headers: { Accept: "application/json" } })
}

export async function fetchMySelectionStatus(eventId: string): Promise<PlayerSelectionStatus> {
  return apiRequest(`/api/events/${encodeURIComponent(eventId)}/selection/my-status`, { method: "GET", credentials: "include", headers: { Accept: "application/json" } })
}

export async function fetchUpdateSelectionDraft(input: {
  eventId: string
  entries: Array<{ personId: string; role: SelectionRole; order?: number | null }>
  autosaveVersion: number
}): Promise<{ revisionId: string; autosaveVersion: number; entries: Array<{ personId: string; role: SelectionRole; order: number | null }> }> {
  return apiRequest(`/api/events/${encodeURIComponent(input.eventId)}/selection/draft`, {
    method: "PATCH",
    ...creds(),
    body: apiJson({ entries: input.entries, autosaveVersion: input.autosaveVersion, idempotency_key: key() }),
  })
}

export async function fetchPublishSelection(eventId: string): Promise<{ revisionId: string; publishedAt: string; publishedBy: string; conflicts: SelectionConflict[]; notifiedRecipients: number }> {
  return apiRequest(`/api/events/${encodeURIComponent(eventId)}/selection/publish`, {
    method: "POST",
    ...creds(),
    body: apiJson({ idempotency_key: key() }),
  })
}

/* ── Asistencia ── */

export async function fetchRecordAttendance(input: { eventId: string; personId: string; value: AttendanceValue }): Promise<{ entryId: string; value: AttendanceValue; recordedAt: string }> {
  return apiRequest(`/api/events/${encodeURIComponent(input.eventId)}/attendance`, {
    method: "POST",
    ...creds(),
    body: apiJson({ personId: input.personId, value: input.value, idempotency_key: key() }),
  })
}

export async function fetchCloseAttendanceSheet(eventId: string): Promise<{ sheetId: string; closedAt: string; closedBy: string }> {
  return apiRequest(`/api/events/${encodeURIComponent(eventId)}/attendance/close`, {
    method: "POST",
    ...creds(),
    body: apiJson({ idempotency_key: key() }),
  })
}

export async function fetchCorrectAttendance(input: { eventId: string; entryId?: string | null; personId?: string; value: AttendanceValue; correctionReason: string }): Promise<{ entryId: string; value: AttendanceValue; previousValue: AttendanceValue | null; correctedAt: string }> {
  // Una persona sin registro previo no tiene entryId: se usa su personId como
  // identificador de la corrección y el backend crea la entrada vacía (UNRECORDED).
  const target = input.entryId ?? input.personId ?? ""
  return apiRequest(`/api/events/${encodeURIComponent(input.eventId)}/attendance/${encodeURIComponent(target)}/correct`, {
    method: "PATCH",
    ...creds(),
    body: apiJson({ value: input.value, correctionReason: input.correctionReason, personId: input.personId, idempotency_key: key() }),
  })
}

/* ── Resultado del partido ── */

export async function fetchMatchRecordDetail(eventId: string): Promise<MatchRecordDetail> {
  return apiRequest(`/api/events/${encodeURIComponent(eventId)}/match-record`, { method: "GET", credentials: "include", headers: { Accept: "application/json" } })
}

export async function fetchCreateMatchRecord(eventId: string): Promise<{ matchRecordId: string; matchId: string; state: string }> {
  return apiRequest(`/api/events/${encodeURIComponent(eventId)}/match-record`, {
    method: "POST",
    ...creds(),
    body: apiJson({ idempotency_key: key() }),
  })
}

export async function fetchStartEvent(eventId: string, expectedVersion?: number): Promise<{ eventUpdated: boolean; eventId: string; state: string; version: number; coordinationRevision: number }> {
  return apiRequest(`/api/events/${encodeURIComponent(eventId)}/start`, {
    method: "POST",
    ...creds(),
    body: apiJson(omitNull({ expectedVersion, idempotency_key: key() })),
  })
}

export async function fetchFinalizeMatchRecord(input: {
  eventId: string
  resultType: ResultType
  homeScore?: number | null
  awayScore?: number | null
  observations?: string | null
}): Promise<{ matchRecordId: string; state: string; resultType: ResultType; eventState: string }> {
  return apiRequest(`/api/events/${encodeURIComponent(input.eventId)}/match-record/finalize`, {
    method: "POST",
    ...creds(),
    body: apiJson({ ...omitNull({ resultType: input.resultType, homeScore: input.homeScore, awayScore: input.awayScore, observations: input.observations }), idempotency_key: key() }),
  })
}

export async function fetchCorrectMatchRecord(input: {
  eventId: string
  recordId: string
  resultType?: ResultType
  homeScore?: number | null
  awayScore?: number | null
  observations?: string | null
  correctionReason: string
}): Promise<{ matchRecordId: string; state: string; resultType: ResultType }> {
  return apiRequest(`/api/events/${encodeURIComponent(input.eventId)}/match-record/${encodeURIComponent(input.recordId)}/correct`, {
    method: "PATCH",
    ...creds(),
    body: apiJson({ ...omitNull({ resultType: input.resultType, homeScore: input.homeScore, awayScore: input.awayScore, observations: input.observations, correctionReason: input.correctionReason }), idempotency_key: key() }),
  })
}

export async function fetchRecordPlayerStats(input: {
  eventId: string
  recordId: string
  personId: string
  stats: { minutesPlayed?: number | null; goals?: number | null; assists?: number | null; yellowCards?: number | null; redCards?: number | null; mvp?: boolean }
}): Promise<{ statsId: string | null; personId: string }> {
  return apiRequest(`/api/events/${encodeURIComponent(input.eventId)}/match-record/${encodeURIComponent(input.recordId)}/stats`, {
    method: "POST",
    ...creds(),
    body: apiJson({ personId: input.personId, ...omitNull(input.stats), idempotency_key: key() }),
  })
}
