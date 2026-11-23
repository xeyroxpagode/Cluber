/**
 * GEI T06 R3 — shared contracts (DG-15 Sport Reporting + DG-16 Cross-domain Reads).
 *
 * Autoridad: B6 Final Implementation Contract V1.0 (§10) + Task Manifest.
 * Reglas congeladas aplicadas aquí:
 *  - FR-21 / A-01: `% PRESENCIA` = 100 * PRESENT / (PRESENT + ABSENT + JUSTIFIED).
 *    UNRECORDED queda fuera del denominador; denominador 0 => null ("Sin datos").
 *    ReportPercentagePolicy = APPROVED. La etiqueta NO debe decir que JUSTIFIED "no penaliza".
 *  - FR-22 / A-02: Notification.readAt NUNCA genera una fila de Attention.
 *    NotificationBranchConfig.enabled = false, policy = CONTEXT_ONLY (permanente).
 *  - FR-06: `evaluationInstant` = transaction_timestamp(); único reloj autoritativo.
 *  - FR-17: viewports canónicos 500/768/1440.
 *  - Non-enumeration: Search no expone `total` y `to` puede ser null.
 *
 * Este módulo no tiene dependencias de runtime: es importable por backend y frontend.
 */

/* ── Estados semánticos ───────────────────────────────────────────────── */

export type AttentionState = "NO_DATA" | "ZERO" | "ERROR" | "OK"
export type DtoState = AttentionState
export type SearchState = "EMPTY_QUERY" | "NO_RESULTS" | "OK" | "ERROR"

export type AttendanceValue = "PRESENT" | "ABSENT" | "JUSTIFIED" | "UNRECORDED"
export type AttendanceRecordedValue = Exclude<AttendanceValue, "UNRECORDED">

export type Severity = "HIGH" | "MEDIUM" | "LOW"
export type AttentionSourceType =
  | "AVAILABILITY"
  | "SELECTION_REVISION"
  | "SELECTION_CONFLICT"
  | "ATTENDANCE_SHEET"
  | "MATCH_RECORD"
  | "ANNOUNCEMENT"
  | "EVENT_CHANGE"
  | "NOTIFICATION_CONTEXT"

export type SearchResultType =
  | "person"
  | "team"
  | "division"
  | "line"
  | "event"
  | "announcement"
  | "conversation"

/* ── Metadatos de paginación y errores ────────────────────────────────── */

export interface PageMeta {
  cursor: string | null
  hasMore: boolean
}

export interface ErrorMeta {
  code: string
  message: string
  retryable: boolean
  traceId: string
}

/* ── Política de porcentaje (A-01) ────────────────────────────────────── */

export type PercentageStatus = "NOT_APPROVED" | "APPROVED"

export interface PresencePercentageDto {
  status: PercentageStatus
  value: number | null
  formulaRef?: "A-01"
}

export interface AttendanceCounts {
  present: number
  absent: number
  justified: number
  unrecorded: number
}

/* ── Atención ─────────────────────────────────────────────────────────── */

export interface AttentionAction {
  label: string
  /** null => el usuario no tiene autoridad; non-enumeration. */
  to: string | null
}

export interface AttentionItemDto {
  id: string
  dedupeKey: string
  sourceType: AttentionSourceType
  sourceId: string
  stateText: string
  reason: string
  consequence: string
  deadline: string | null
  severity: Severity
  action: AttentionAction
  visibleFields: Record<string, string | number | boolean | null>
  allowedActions: string[]
  audienceScope: string
}

export interface AttentionBlock {
  key: "attention"
  unavailable?: boolean
  reason?: "SOURCE_UNAVAILABLE"
}

export interface AttentionListDto {
  items: AttentionItemDto[]
  state: DtoState
  pageMeta: PageMeta
  blocks: AttentionBlock[]
  /** Total de filas antes del recorte; interno para Home (no se expone como total de Search). */
  total?: number
}

/* ── Home ─────────────────────────────────────────────────────────────── */

export interface HomeEventDto {
  id: string
  title: string
  startAt: string | null
  state: string
  to: string | null
}

export interface InlineAvailabilityDto {
  eventId: string
  eventTitle: string
  state: string
  to: string | null
  needsReconfirmation: boolean
}

export interface AnnouncementMiniDto {
  id: string
  title: string
  publishedAt: string | null
  to: string | null
}

export interface ConversationMiniDto {
  id: string
  title: string
  unreadCount: number
  to: string | null
}

export interface NotificationContextDto {
  unreadCount: number
  latest: Array<{ id: string; title: string; to: string | null; readAt: string | null }>
}

export type HomeBlockKey = "attention" | "today" | "inlineAvailability" | "upcoming" | "communications"

export interface HomeBlockStatus {
  key: HomeBlockKey
  unavailable?: boolean
  reason?: "SOURCE_UNAVAILABLE"
}

export interface HomeForActorDto {
  attention: AttentionItemDto[]
  attentionTotal: number
  today: HomeEventDto[]
  inlineAvailability: InlineAvailabilityDto[]
  upcoming: HomeEventDto[]
  communications: {
    announcements: AnnouncementMiniDto[]
    conversations: ConversationMiniDto[]
    notificationContext: NotificationContextDto
    unreadCount: number
  }
  blocks: HomeBlockStatus[]
  scope: { roles: string[]; isAdmin: boolean; isSubcommittee: boolean }
}

/* ── Search ───────────────────────────────────────────────────────────── */

export interface SearchRank {
  tier: number
  score: number
}

export interface SearchResultItemDto {
  id: string
  type: SearchResultType
  title: string
  subtitle: string | null
  context: string | null
  rank: SearchRank
  visibleFields: Record<string, string | number | boolean | null>
  allowedActions: string[]
  to: string | null
  audienceScope: string
}

export interface SearchCursorIdentity {
  accountId: string
  personId: string
  scopeHash: string
}

export interface SearchCursorPayload {
  v: 1
  k: { tier: number; score: number; type: string; id: string }
  qh: string
  fh: string
  sh: string
  ah: string
  exp: number
  nonce: string
  /** Contador de página interno del cursor (no expuesto como total de resultados). */
  page?: number
}

export interface SearchPageDto {
  query: string
  normalizedQuery: string
  type: SearchResultType | null
  items: SearchResultItemDto[]
  page: number
  state: SearchState
  pageMeta: PageMeta
  error?: ErrorMeta
}

/* ── Reports ──────────────────────────────────────────────────────────── */

export interface AttendanceCorrectionDto {
  id: string
  previousValue: AttendanceRecordedValue | null
  newValue: AttendanceRecordedValue
  reason: string
  correctedAt: string
}

export interface AttendanceReportRowDto {
  personId: string
  personName: string
  eventId: string
  eventTitle: string
  sheetId: string | null
  eventStartAt: string | null
  seasonId: string | null
  teamId: string | null
  attendance: {
    value: AttendanceValue
    recordedAt: string | null
    correctedAt: string | null
    /** true cuando NO existe fila; distinto de value IS NULL. Ambos son UNRECORDED. */
    missingRow: boolean
  }
  corrections: AttendanceCorrectionDto[]
  links: { event: string | null; person: string | null }
  presencePercentage: PresencePercentageDto | null
  counts: AttendanceCounts
  visibleFields: string[]
  allowedActions: string[]
}

export interface AttendanceReportDto {
  items: AttendanceReportRowDto[]
  state: DtoState
  pageMeta: PageMeta
  links: { hub: string }
  period: { seasonId: string | null; label: string }
}

export interface PerformanceTotals {
  matchesPlayed: number
  minutesPlayed: number
  goals: number
  assists: number
  yellowCards: number
  redCards: number
  mvp: number
}

export interface PerformanceBreakdownItem {
  matchRecordId: string
  eventId: string
  state: string
  resultType: string | null
  finalizedAt: string | null
  minutesPlayed: number | null
  goals: number | null
  assists: number | null
  yellowCards: number | null
  redCards: number | null
  mvp: boolean
  /** false para DRAFT/FORFEIT/ABANDONED: el registro NO incrementa matchesPlayed. */
  countsAsPlayed: boolean
}

export interface PerformanceCorrectionDto {
  id: string
  previousResultType: string | null
  newResultType: string | null
  reason: string
  correctedAt: string
}

export interface PerformanceReportRowDto {
  personId: string
  personName: string
  totals: PerformanceTotals
  breakdown: PerformanceBreakdownItem[]
  corrections: PerformanceCorrectionDto[]
  links: { person: string | null }
  visibleFields: string[]
  allowedActions: string[]
}

export interface PerformanceReportDto {
  items: PerformanceReportRowDto[]
  state: DtoState
  pageMeta: PageMeta
  links: { hub: string }
  period: { seasonId: string | null; label: string }
  /** Correcciones de actas del alcance, incluso sin estadísticas ni jugador asociado. */
  corrections?: PerformanceCorrectionDto[]
}

/* ── Frontera A-02 (congelada) ────────────────────────────────────────── */

export interface NotificationBranchConfig {
  /** Decisión A-02 (B1): permanente, no es un gate pendiente. */
  enabled: false
  policy: "CONTEXT_ONLY"
}

export const NOTIFICATION_BRANCH: NotificationBranchConfig = Object.freeze({
  enabled: false as const,
  policy: "CONTEXT_ONLY" as const,
})

/** Decisión A-01 (A1). Toda implementación debe usar APPROVED. */
export const REPORT_PERCENTAGE_POLICY = Object.freeze({
  status: "APPROVED" as const,
  formulaRef: "A-01" as const,
})

/** Etiqueta canónica de % PRESENCIA: null => «Sin datos», nunca 0%. */
/** Literal congelado del estado vacío de Atención / Home (Domain 01). */
export const EMPTY_ATTENTION_COPY = "Nada pendiente."

export function presenceLabel(value: number | null): string {
  return value === null ? "Sin datos" : `${value.toFixed(1)}%`
}

export const VIEWPORTS = Object.freeze([500, 768, 1440] as const)
export const BROWSERS = Object.freeze(["chromium", "msedge", "firefox"] as const)
