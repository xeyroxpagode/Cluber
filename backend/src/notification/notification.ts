import type { Transaction } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import { AppError } from "../shared/errors.js"
import { randomUUID } from "node:crypto"

export type NotificationType =
  | "EVENT_CHANGED" | "EVENT_POSTPONED" | "EVENT_RESCHEDULED" | "EVENT_CANCELLED" | "EVENT_RESTORED"
  | "SELECTION_PUBLISHED" | "ANNOUNCEMENT_PUBLISHED"

export type NotificationResourceType = "EVENT" | "SELECTION" | "ANNOUNCEMENT"

export interface RecordNotificationInput {
  recipientPersonId: string
  type: NotificationType
  resourceType: NotificationResourceType
  resourceId: string
  originEventId?: string | null
  title: string
  body: string
  occurredAt?: Date
}

export function notificationDedupeKey(input: Pick<RecordNotificationInput, "type" | "resourceType" | "resourceId" | "originEventId" | "recipientPersonId">): string {
  if (input.type.startsWith("EVENT_")) {
    if (!input.originEventId) throw new AppError("VALIDATION_FAILED", "Event notifications require originEventId", "domain_validation", false, { originEventId: ["required"] })
    return `${input.originEventId}|${input.resourceType}|${input.resourceId}|${input.recipientPersonId}|${input.type}`
  }
  return `${input.resourceId}|${input.recipientPersonId}|${input.type}`
}

const EVENT_TYPES: ReadonlySet<NotificationType> = new Set([
  "EVENT_CHANGED", "EVENT_POSTPONED", "EVENT_RESCHEDULED", "EVENT_CANCELLED", "EVENT_RESTORED",
])

export class NotificationService {
  /**
   * Persists one notification per call, idempotently (dedupe_key UNIQUE).
   * Returns the row and whether it was a duplicate of an already-persisted fact.
   * MUST run inside the command transaction (single fact, single truth).
   */
  async record(tx: Transaction<DatabaseSchema>, input: RecordNotificationInput): Promise<{ id: string; wasDuplicate: boolean; dedupeKey: string }> {
    if (EVENT_TYPES.has(input.type) && !input.originEventId) {
      throw new AppError("VALIDATION_FAILED", "Event notifications require originEventId", "domain_validation", false, { originEventId: ["required"] })
    }
    const occurredAt = input.occurredAt ?? new Date()
    const dedupeKey = notificationDedupeKey({ ...input, originEventId: input.originEventId ?? null })
    const inserted = await tx
      .insertInto("app.notifications")
      .values({
        id: randomUUID(),
        recipient_person_id: input.recipientPersonId,
        type: input.type,
        resource_type: input.resourceType,
        resource_id: input.resourceId,
        origin_event_id: input.originEventId ?? null,
        title: input.title.slice(0, 300),
        body: input.body.slice(0, 2000),
        occurred_at: occurredAt,
        read_at: null,
        audience_resolved_at: occurredAt,
        dedupe_key: dedupeKey,
        created_at: occurredAt,
      })
      .onConflict((oc) => oc.column("dedupe_key").doNothing())
      .returningAll()
      .executeTakeFirst()
    if (inserted) return { id: inserted.id, wasDuplicate: false, dedupeKey }
    const existing = await tx.selectFrom("app.notifications").select("id").where("dedupe_key", "=", dedupeKey).executeTakeFirstOrThrow()
    return { id: existing.id, wasDuplicate: true, dedupeKey }
  }

  /** Persists the same fact for a resolved audience. Returns created rows (duplicates flagged). */
  async recordForAudience(tx: Transaction<DatabaseSchema>, recipientPersonIds: readonly string[], base: Omit<RecordNotificationInput, "recipientPersonId">): Promise<{ rows: Array<{ id: string; recipientPersonId: string; dedupeKey: string; wasDuplicate: boolean }> }> {
    const unique = Array.from(new Set(recipientPersonIds))
    const rows: Array<{ id: string; recipientPersonId: string; dedupeKey: string; wasDuplicate: boolean }> = []
    for (const recipientPersonId of unique) {
      const row = await this.record(tx, { ...base, recipientPersonId })
      rows.push({ id: row.id, recipientPersonId, dedupeKey: row.dedupeKey, wasDuplicate: row.wasDuplicate })
    }
    return { rows }
  }

  /** CMD-COM-12. Recipient-only; idempotent; no audit, no outbox. */
  async markRead(tx: Transaction<DatabaseSchema>, actorPersonId: string, notificationId: string, at: Date): Promise<{ readAt: Date | null; alreadyRead: boolean }> {
    const row = await tx.selectFrom("app.notifications").selectAll().where("id", "=", notificationId).executeTakeFirst()
    if (!row) throw new AppError("NOTIFICATION_NOT_FOUND", "Notification was not found", "not_found")
    if (row.recipient_person_id !== actorPersonId) throw new AppError("NOT_RECIPIENT", "You are not the recipient of this notification", "authorization")
    if (row.read_at) return { readAt: new Date(row.read_at), alreadyRead: true }
    const updated = await tx.updateTable("app.notifications").set({ read_at: at }).where("id", "=", notificationId).returning("read_at").executeTakeFirstOrThrow()
    return { readAt: new Date(updated.read_at as unknown as Date), alreadyRead: false }
  }
}
