import { apiRequest } from "./api"
import { getCsrfToken } from "./session"

export interface AnnouncementDto {
  id: string
  title: string
  body: string
  state: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  publishedAt: string | null
  publishedByPersonId: string | null
  archivedAt: string | null
  revision: number
  version: number
  clubWide: boolean
  audienceSnapshot: string[]
  readState: { readAt: string | null } | null
}

export interface ConversationDto {
  id: string
  type: "DIRECT" | "GROUP" | "TEAM" | "EVENT"
  title: string | null
  state: "ACTIVE" | "ARCHIVED"
  teamId: string | null
  eventId: string | null
  participantCount: number
  version: number
}

export interface ConversationListItem extends ConversationDto {
  lastActivityAt: string
  unreadCount: number
}

export interface MessageDto {
  id: string
  conversationId: string
  authorPersonId: string
  body: string | null
  state: "SENT" | "EDITED" | "DELETED"
  sentAt: string
  editedAt: string | null
  deletedAt: string | null
  deletionReason: string | null
}

export interface Page<T> {
  items: T[]
  nextCursor: string | null
  hasMore: boolean
}

export interface DraftInput {
  announcementId?: string
  expectedVersion?: number
  title: string
  body: string
  clubWide: boolean
  teamIds: string[]
}

function creds() {
  return { credentials: "include" as RequestCredentials, csrfToken: getCsrfToken() ?? undefined }
}
function post<T>(url: string, body?: unknown, idempotencyKey?: string): Promise<T> {
  return apiRequest<T>(url, {
    method: "POST", ...creds(),
    ...(body !== undefined ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}),
    idempotencyKey,
  })
}
function patch<T>(url: string, body?: unknown, idempotencyKey?: string): Promise<T> {
  return apiRequest<T>(url, {
    method: "PATCH", ...creds(),
    ...(body !== undefined ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}),
    idempotencyKey,
  })
}
function get<T>(url: string): Promise<T> { return apiRequest<T>(url, { method: "GET", ...creds() }) }
export const newKey = () => crypto.randomUUID()

// ── DG-13 ──
export function fetchAnnouncementList(includeDrafts = false): Promise<Page<AnnouncementDto>> {
  return get(`/api/announcements${includeDrafts ? "?includeDrafts=true" : ""}`)
}
export function fetchAnnouncement(id: string): Promise<AnnouncementDto> {
  return get(`/api/announcements/${encodeURIComponent(id)}`)
}
export function saveDraft(input: DraftInput): Promise<AnnouncementDto> {
  return input.announcementId
    ? patch(`/api/announcements/draft/${encodeURIComponent(input.announcementId)}`, input, newKey())
    : post("/api/announcements/draft", input, newKey())
}
export function publishAnnouncement(id: string): Promise<AnnouncementDto> {
  return post(`/api/announcements/${encodeURIComponent(id)}/publish`, undefined, newKey())
}
export function correctAnnouncement(id: string, input: { title?: string; body?: string; reason: string; expectedVersion?: number }): Promise<AnnouncementDto> {
  return patch(`/api/announcements/${encodeURIComponent(id)}/correct`, input)
}
export function archiveAnnouncement(id: string): Promise<AnnouncementDto> {
  return post(`/api/announcements/${encodeURIComponent(id)}/archive`)
}

// ── DG-14 ──
export function fetchConversationList(): Promise<Page<ConversationListItem>> {
  return get("/api/conversations")
}
export function fetchConversation(id: string): Promise<ConversationDto> {
  return get(`/api/conversations/${encodeURIComponent(id)}`)
}
export function fetchThread(id: string, cursor?: string): Promise<Page<MessageDto>> {
  return get(`/api/conversations/${encodeURIComponent(id)}/thread${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ""}`)
}
export function openDirect(targetPersonId: string): Promise<ConversationDto> {
  return post("/api/conversations/direct", { targetPersonId }, newKey())
}
export function createGroup(title: string, participantPersonIds: string[]): Promise<ConversationDto> {
  return post("/api/conversations/group", { title, participantPersonIds }, newKey())
}
export function openTeamEvent(resourceType: "TEAM" | "EVENT", resourceId: string): Promise<ConversationDto> {
  return post("/api/conversations/team-event", { resourceType, resourceId }, newKey())
}
export function archiveConversation(id: string): Promise<ConversationDto> {
  return post(`/api/conversations/${encodeURIComponent(id)}/archive`)
}
/** Clave estable por borrador local para reintentos seguros del mismo envío. */
export function sendMessage(conversationId: string, body: string, idempotencyKey: string = newKey()): Promise<MessageDto> {
  return post(`/api/conversations/${encodeURIComponent(conversationId)}/messages`, { body }, idempotencyKey)
}
export function editMessage(id: string, body: string): Promise<MessageDto> {
  return patch(`/api/messages/${encodeURIComponent(id)}`, { body })
}
export function deleteMessage(id: string, deletionReason: string): Promise<MessageDto> {
  return apiRequest<MessageDto>(`/api/messages/${encodeURIComponent(id)}`, {
    method: "DELETE", ...creds(), headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deletionReason }),
  })
}
export function fetchTeamConversations(teamId: string): Promise<{ items: ConversationDto[] }> {
  return get(`/api/teams/${encodeURIComponent(teamId)}/conversations`)
}
export function fetchEventConversations(eventId: string): Promise<{ items: ConversationDto[] }> {
  return get(`/api/events/${encodeURIComponent(eventId)}/conversations`)
}
