import { randomUUID } from "node:crypto"
import type { Transaction } from "kysely"
import type { DatabaseSchema } from "../db/types.js"

export interface AuditRecordInput {
  actorPersonId: string | null
  action: string
  targetType: string
  targetId?: string | null
  reason?: string | null
  source: string
  diff?: Record<string, unknown> | null
}

const FORBIDDEN_KEY = /(password|passwd|hash|token|code|secret|pepper|credential|authorization|cookie)/i

export function redactAuditValue(value: unknown, depth = 0): unknown {
  if (depth > 6) return "[REDACTED]"
  if (value === null || value === undefined) return value ?? null
  if (typeof value === "string") {
    return value.length > 512 ? `${value.slice(0, 512)}…` : value
  }
  if (typeof value === "number" || typeof value === "boolean") return value
  if (Array.isArray(value)) return value.slice(0, 50).map((item) => redactAuditValue(item, depth + 1))
  if (typeof value === "object") {
    const out: Record<string, unknown> = {}
    for (const [key, entry] of Object.entries(value as Record<string, unknown>).slice(0, 100)) {
      out[key] = FORBIDDEN_KEY.test(key) ? "[REDACTED]" : redactAuditValue(entry, depth + 1)
    }
    return out
  }
  return String(value)
}

export class AuditWriter {
  async record(tx: Transaction<DatabaseSchema>, input: AuditRecordInput): Promise<void> {
    if (!input.action.trim() || !input.targetType.trim() || !input.source.trim()) {
      throw new Error("Invalid audit record input")
    }
    await tx.insertInto("app.audit_entries").values({
      id: randomUUID(),
      occurred_at: new Date(),
      actor_person_id: input.actorPersonId,
      action: input.action.trim(),
      target_type: input.targetType.trim(),
      target_id: input.targetId ?? null,
      reason: input.reason?.trim() || null,
      source: input.source.trim(),
      diff: input.diff ? (redactAuditValue(input.diff) as Record<string, unknown>) : null,
    }).executeTakeFirstOrThrow()
  }
}

export class AuditService {
  async list(tx: Transaction<DatabaseSchema>, limit = 100) {
    const rows = await tx.selectFrom("app.audit_entries")
      .leftJoin("app.people", "app.people.id", "app.audit_entries.actor_person_id")
      .select([
        "app.audit_entries.id as id",
        "app.audit_entries.occurred_at as occurredAt",
        "app.audit_entries.actor_person_id as actorPersonId",
        "app.audit_entries.action as action",
        "app.audit_entries.target_type as targetType",
        "app.audit_entries.target_id as targetId",
        "app.audit_entries.reason as reason",
        "app.audit_entries.source as source",
        "app.audit_entries.diff as diff",
        "app.people.first_name as actorFirstName",
        "app.people.last_name as actorLastName",
      ])
      .orderBy("app.audit_entries.occurred_at", "desc")
      .limit(Math.min(Math.max(limit, 1), 500))
      .execute()
    return rows.map((row) => ({
      id: row.id,
      occurredAt: row.occurredAt?.toISOString?.() ?? String(row.occurredAt),
      actorPersonId: row.actorPersonId,
      actorName: row.actorPersonId ? `${row.actorFirstName ?? ""} ${row.actorLastName ?? ""}`.trim() || null : null,
      action: row.action,
      targetType: row.targetType,
      targetId: row.targetId,
      reason: row.reason,
      source: row.source,
      diff: redactAuditValue(row.diff ?? null),
    }))
  }
}
