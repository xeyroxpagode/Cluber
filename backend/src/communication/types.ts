import type { Transaction } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import { AppError, type ErrorCategory } from "../shared/errors.js"

export type Tx = Transaction<DatabaseSchema>

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

export function fail(code: string, message: string, category: ErrorCategory = "domain_validation"): never {
  throw new AppError(code, message, category)
}

/** audiences y ids se normalizan siempre; nunca se confía en input del cliente para autoridad. */
export function sortedPair(a: string, b: string): string {
  return [a, b].sort().join("|")
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

export function assertUuid(value: string, field: string): void {
  if (!isUuid(value)) fail("INVALID_UUID", `${field} debe ser un UUID válido`, "transport")
}

export function requireText(value: unknown, field: string, max = 300): string {
  if (typeof value !== "string" || value.trim().length < 1) fail("BODY_REQUIRED", `${field} es obligatorio`, "transport")
  const text = value.trim()
  if (text.length > max) fail("TEXT_TOO_LONG", `${field} excede ${max} caracteres`, "transport")
  return text
}

export function redactedBody(): string {
  return "[REDACTED]"
}
