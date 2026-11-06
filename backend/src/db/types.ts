import type { Generated } from "kysely"

export interface IdempotencyRecordTable {
  id: Generated<string>
  scope_key: string
  command_id: string
  idempotency_key: string
  request_hash: Buffer
  status: "IN_PROGRESS" | "SUCCEEDED"
  response_status: number | null
  response_snapshot: unknown | null
  resource_type: string | null
  resource_id: string | null
  created_at: Generated<Date>
  expires_at: Date
}

export interface OutboxEventTable {
  id: Generated<string>
  topic: string
  aggregate_type: string
  aggregate_id: string
  payload: unknown
  created_at: Generated<Date>
  available_at: Generated<Date>
  processed_at: Date | null
  attempt_count: Generated<number>
  last_error: string | null
  failed_at: Date | null
}

export interface RateLimitWindowTable {
  policy: string
  key_hash: Buffer
  window_started_at: Date
  count: number
  blocked_until: Date | null
  updated_at: Generated<Date>
}

export interface DatabaseSchema {
  "infra.idempotency_records": IdempotencyRecordTable
  "infra.outbox_events": OutboxEventTable
  "infra.rate_limit_windows": RateLimitWindowTable
}
