/**
 * T03 — cliente HTTP real para DG-06/07/08.
 * Tipos alineados 1:1 con los DTOs del backend (backend/src/read/t03-read.ts).
 */
import { apiRequest, apiJson } from "./api.js"
import { getCsrfToken } from "./session.js"

type Json = Record<string, unknown>

export interface EventTeamTarget { teamId: string; name: string | null }
export interface EventTargets { teams: EventTeamTarget[]; persons: string[] }
export interface EventDto {
  id: string
  type: "TRAINING" | "MATCH" | "CLUB_EVENT"
  title: string
  startAt: string | null
  endAt: string | null
  timeZone: string
  venueId: string | null
  venue: { id: string | null; name: string; address: string } | null
  state: "DRAFT" | "SCHEDULED" | "POSTPONED" | "CANCELLED" | "IN_PROGRESS" | "COMPLETED" | "ABANDONED"
  clubWideTarget: boolean
  seriesId: string | null
  occurrenceIndex: number | null
  coordinationRevision: number
  creatorPersonId: string
  createdAt: string
  updatedAt: string
  version: number
  competitionId: string | null
  competitionName: string | null
  opponent: string | null
  isTerminal: boolean
  concreteTeamId: string | null
  targets: EventTargets
}

export interface EventDetailDto extends EventDto {
  logistics: { meetingAt: string | null; departureAt: string | null; meetingPoint: string | null; transportNote: string | null; arrivalInstructions: string | null } | null
  audienceCount: number | null
}

export interface NotificationDto {
  id: string
  recipientPersonId: string
  type: "EVENT_CHANGED" | "EVENT_POSTPONED" | "EVENT_RESCHEDULED" | "EVENT_CANCELLED" | "EVENT_RESTORED" | "SELECTION_PUBLISHED" | "ANNOUNCEMENT_PUBLISHED"
  resourceType: "EVENT" | "SELECTION" | "ANNOUNCEMENT"
  resourceId: string
  originEventId: string | null
  title: string
  body: string
  occurredAt: string
  readAt: string | null
  isUnread: boolean
  dedupeKey: string
}

export interface JornadaListItem { id: string; seasonId: string; competitionId: string | null; name: string; date: string; matchCount: number; createdAt: string }
export interface JornadaDetail { id: string; seasonId: string; competitionId: string | null; name: string; date: string; createdAt: string; matches: EventDto[] }
export interface SeriesDetail { id: string; name: string; state: "ACTIVE" | "ENDED"; recurrenceRule: string; maxOccurrences: number; createdAt: string; occurrences: EventDto[] }
export interface MaterialityResult { eventId: string; version: number; state: string; isMaterial: boolean; materialFields: string[]; metadataFields: string[]; classification: string }

const json = () => ({ "Content-Type": "application/json" })
const creds = () => ({ credentials: "include" as RequestCredentials, csrfToken: getCsrfToken() ?? undefined, headers: json() })

async function get<T>(url: string): Promise<T> {
  return apiRequest<T>(url, { method: "GET", credentials: "include", csrfToken: getCsrfToken() ?? undefined, headers: { Accept: "application/json" } })
}

function omitNull(values: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(values)) if (value !== null && value !== undefined) out[key] = value
  return out
}

/* ── Lecturas (RC-*) ── */

export async function fetchCalendarRange(input: { from: string; to: string; type?: string; state?: string; limit?: number }): Promise<{ items: EventDto[] }> {
  const params = new URLSearchParams({ from: new Date(input.from).toISOString(), to: new Date(input.to).toISOString() })
  if (input.type) params.set("type", input.type)
  if (input.state) params.set("state", input.state)
  if (input.limit) params.set("limit", String(input.limit))
  return get(`/api/calendar/range?${params.toString()}`)
}

export async function fetchEventDetail(eventId: string): Promise<EventDetailDto> {
  return get(`/api/events/${encodeURIComponent(eventId)}`)
}

export async function fetchNextEvent(): Promise<{ event: EventDto | null }> {
  return get("/api/events/next")
}

export async function fetchNotificationList(input: { unread?: boolean; limit?: number } = {}): Promise<{ items: NotificationDto[] }> {
  const params = new URLSearchParams()
  if (input.unread !== undefined) params.set("unread", String(input.unread))
  if (input.limit) params.set("limit", String(input.limit))
  const qs = params.toString()
  return get(`/api/notifications${qs ? `?${qs}` : ""}`)
}

export async function fetchJornadaList(input: { seasonId?: string; competitionId?: string; limit?: number } = {}): Promise<{ items: JornadaListItem[] }> {
  const params = new URLSearchParams()
  if (input.seasonId) params.set("seasonId", input.seasonId)
  if (input.competitionId) params.set("competitionId", input.competitionId)
  if (input.limit) params.set("limit", String(input.limit))
  const qs = params.toString()
  return get(`/api/jornadas${qs ? `?${qs}` : ""}`)
}

export async function fetchJornadaDetail(jornadaId: string): Promise<JornadaDetail> {
  return get(`/api/jornadas/${encodeURIComponent(jornadaId)}`)
}

export async function fetchEventSeriesDetail(seriesId: string): Promise<SeriesDetail> {
  return get(`/api/event-series/${encodeURIComponent(seriesId)}`)
}

export async function fetchMaterialityCheck(eventId: string, patch: Record<string, unknown>): Promise<MaterialityResult> {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue
    if (key === "logistics") params.set(key, JSON.stringify(value))
    else if (Array.isArray(value)) params.set(key, value.join(","))
    else if (value === null) params.set(key, "null")
    else params.set(key, String(value))
  }
  return get(`/api/events/${encodeURIComponent(eventId)}/materiality-check?${params.toString()}`)
}

/* ── Comandos (CMD-*) ── */

export interface CreateEventInput {
  type: "TRAINING" | "MATCH" | "CLUB_EVENT"
  title: string
  startAt: string
  endAt?: string | null
  timeZone?: string
  venueId?: string | null
  clubWideTarget?: boolean
  targetTeamIds?: string[]
  targetPersonIds?: string[]
  competitionId?: string | null
  opponent?: string | null
  logistics?: { meetingAt?: string | null; departureAt?: string | null; meetingPoint?: string | null; transportNote?: string | null; arrivalInstructions?: string | null }
  idempotencyKey: string
}

export async function fetchCreateEvent(input: CreateEventInput): Promise<Json> {
  return apiRequest<Json>("/api/events", { method: "POST", ...creds(), idempotencyKey: input.idempotencyKey, body: apiJson(omitNull({ type: input.type, title: input.title, startAt: input.startAt, endAt: input.endAt, timeZone: input.timeZone, venueId: input.venueId, clubWideTarget: input.clubWideTarget, targetTeamIds: input.targetTeamIds, targetPersonIds: input.targetPersonIds, competitionId: input.competitionId, opponent: input.opponent, logistics: input.logistics, idempotency_key: input.idempotencyKey })) })
}

export interface EditEventMetaInput { eventId: string; title: string; expectedVersion?: number }
export async function fetchEditEventMeta(input: EditEventMetaInput): Promise<Json> {
  return apiRequest<Json>(`/api/events/${encodeURIComponent(input.eventId)}/meta`, { method: "PATCH", ...creds(), body: apiJson({ title: input.title, expectedVersion: input.expectedVersion }) })
}

export interface MaterialChangeInput {
  eventId: string
  patch: Record<string, unknown>
  expectedVersion: number
  idempotencyKey: string
}
export async function fetchMaterialChangeEvent(input: MaterialChangeInput): Promise<Json> {
  return apiRequest<Json>(`/api/events/${encodeURIComponent(input.eventId)}`, { method: "PATCH", ...creds(), idempotencyKey: input.idempotencyKey, body: apiJson({ ...input.patch, expectedVersion: input.expectedVersion, idempotency_key: input.idempotencyKey }) })
}

export async function fetchPostponeEvent(eventId: string): Promise<Json> { return apiRequest<Json>(`/api/events/${encodeURIComponent(eventId)}/postpone`, { method: "POST", ...creds() }) }
export async function fetchRescheduleEvent(eventId: string): Promise<Json> { return apiRequest<Json>(`/api/events/${encodeURIComponent(eventId)}/reschedule`, { method: "POST", ...creds() }) }
export async function fetchCancelEvent(eventId: string): Promise<Json> { return apiRequest<Json>(`/api/events/${encodeURIComponent(eventId)}/cancel`, { method: "POST", ...creds() }) }
export async function fetchRestoreEvent(eventId: string): Promise<Json> { return apiRequest<Json>(`/api/events/${encodeURIComponent(eventId)}/restore`, { method: "POST", ...creds() }) }

export interface ResolveConflictInput { eventId: string; expectedVersion: number; patch: Record<string, unknown> }
export async function fetchResolveEventConflict(input: ResolveConflictInput): Promise<Json> {
  return apiRequest<Json>(`/api/events/${encodeURIComponent(input.eventId)}/conflict`, { method: "POST", ...creds(), body: apiJson({ expectedVersion: input.expectedVersion, patch: input.patch }) })
}

export interface CreateEventSeriesInput {
  name?: string
  recurrenceRule: string
  maxOccurrences?: number
  type: "TRAINING" | "MATCH" | "CLUB_EVENT"
  title: string
  startAt: string
  endAt?: string | null
  timeZone?: string
  venueId?: string | null
  clubWideTarget?: boolean
  targetTeamIds?: string[]
  targetPersonIds?: string[]
  competitionId?: string | null
  opponent?: string | null
  idempotencyKey: string
}
export async function fetchCreateEventSeries(input: CreateEventSeriesInput): Promise<Json> {
  return apiRequest<Json>("/api/event-series", { method: "POST", ...creds(), idempotencyKey: input.idempotencyKey, body: apiJson(omitNull({ name: input.name, recurrenceRule: input.recurrenceRule, maxOccurrences: input.maxOccurrences, type: input.type, title: input.title, startAt: input.startAt, endAt: input.endAt, timeZone: input.timeZone, venueId: input.venueId, clubWideTarget: input.clubWideTarget, targetTeamIds: input.targetTeamIds, targetPersonIds: input.targetPersonIds, competitionId: input.competitionId, opponent: input.opponent, idempotency_key: input.idempotencyKey })) })
}

export async function fetchEndEventSeries(seriesId: string): Promise<Json> {
  return apiRequest<Json>(`/api/event-series/${encodeURIComponent(seriesId)}/end`, { method: "POST", ...creds() })
}

export interface CreateJornadaInput { name: string; seasonId: string; competitionId?: string | null; date?: string; eventIds: string[]; idempotencyKey: string }
export async function fetchCreateJornada(input: CreateJornadaInput): Promise<Json> {
  return apiRequest<Json>("/api/jornadas", { method: "POST", ...creds(), idempotencyKey: input.idempotencyKey, body: apiJson(omitNull({ name: input.name, seasonId: input.seasonId, competitionId: input.competitionId, date: input.date, eventIds: input.eventIds, idempotency_key: input.idempotencyKey })) })
}

export interface UpdateLogisticsInput {
  eventId: string
  meetingAt?: string | null
  departureAt?: string | null
  meetingPoint?: string | null
  transportNote?: string | null
  arrivalInstructions?: string | null
  expectedVersion?: number
  idempotencyKey: string
}
export async function fetchUpdateLogistics(input: UpdateLogisticsInput): Promise<Json> {
  const { eventId, idempotencyKey, ...rest } = input
  return apiRequest<Json>(`/api/events/${encodeURIComponent(eventId)}/logistics`, { method: "PATCH", ...creds(), idempotencyKey, body: apiJson(omitNull({ ...rest, idempotency_key: idempotencyKey })) })
}

export async function fetchMarkNotificationRead(notificationId: string): Promise<Json> {
  return apiRequest<Json>(`/api/notifications/${encodeURIComponent(notificationId)}/read`, { method: "POST", credentials: "include", csrfToken: getCsrfToken() ?? undefined, headers: { Accept: "application/json" } })
}

/** SSE stream de invalidación (DG-07, RC-18). Devuelve unsubscribe. */
export function subscribeRealtime(onEvent: (event: { event?: string; invalidate?: string[]; resourceType?: string; resourceId?: string }) => void): () => void {
  if (typeof EventSource === "undefined") return () => undefined
  const source = new EventSource("/api/realtime/stream", { withCredentials: true })
  source.onmessage = (message) => {
    try {
      onEvent(JSON.parse(message.data))
    } catch {
      /* ignore malformed frames */
    }
  }
  return () => source.close()
}
