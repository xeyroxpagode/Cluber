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

export interface PersonTable {
  id: string
  first_name: string
  last_name: string
  dni: string | null
  birth_date: string | null
  phone: string | null
  email: string | null
  created_at: Date
  updated_at: Date
}

export interface MembershipTable {
  id: string
  person_id: string
  valid_from: Date
  valid_until: Date | null
  created_at: Date
}

export interface AccountTable {
  id: string
  person_id: string
  username: string
  password_hash: string | null
  status: "PENDING" | "ACTIVE" | "DISABLED"
  activated_at: Date | null
  disabled_at: Date | null
  credential_version: number
  setup_token_hash: Buffer | null
  setup_token_expires_at: Date | null
  setup_token_attempts: number
  created_at: Date
  updated_at: Date
}

export interface AuthSessionTable {
  id: string
  account_id: string
  session_token_hash: Buffer
  credential_version: number
  created_at: Date
  expires_at: Date
  revoked_at: Date | null
}

export interface EmailChangeChallengeTable {
  id: Generated<string>
  person_id: string
  account_id: string
  new_email_normalized: string
  code_hash: Buffer
  attempts: Generated<number>
  expires_at: Generated<Date>
  consumed_at: Date | null
  created_at: Generated<Date>
}

export interface RoleAssignmentTable {
  id: string
  person_id: string
  role: "PLAYER" | "CAPTAIN" | "COACH" | "SUBCOMMITTEE" | "ADMIN"
  scope_type: "TEAM" | "EVENT" | "CLUB"
  scope_ref_id: string | null
  valid_from: Date
  valid_until: Date | null
  temporal_exclusions: unknown[]
  created_at: Date
}

export interface AuditEntryTable {
  id: string
  occurred_at: Date
  actor_person_id: string | null
  action: string
  target_type: string
  target_id: string | null
  reason: string | null
  source: string
  diff: Record<string, unknown> | null
}

export interface SeasonTable {
  id: string
  name: string
  starts_on: string
  ends_on: string
  version: number
  created_at: Date
  updated_at: Date
}

export interface DivisionTable {
  id: string
  name: string
  archived_at: Date | null
  version: number
  created_at: Date
  updated_at: Date
}

export interface LineTable {
  id: string
  name: string
  archived_at: Date | null
  version: number
  created_at: Date
  updated_at: Date
}

export interface TeamTable {
  id: string
  season_id: string
  division_id: string
  line_id: string
  state: "DRAFT" | "ACTIVE" | "ARCHIVED"
  version: number
  created_at: Date
  updated_at: Date
}

export interface VenueTable {
  id: string
  name: string
  address: string
  archived_at: Date | null
  version: number
  created_at: Date
  updated_at: Date
}

export interface CompetitionTable {
  id: string
  season_id: string
  name: string
  archived_at: Date | null
  version: number
  created_at: Date
  updated_at: Date
}

export interface TeamAssignmentTable {
  id: string
  person_id: string
  team_id: string
  valid_from: string
  valid_until: string | null
  created_at: Date
}

export interface DatabaseSchema {
  "infra.idempotency_records": IdempotencyRecordTable
  "infra.outbox_events": OutboxEventTable
  "infra.rate_limit_windows": RateLimitWindowTable
  "app.people": PersonTable
  "app.memberships": MembershipTable
  "app.accounts": AccountTable
  "infra.auth_sessions": AuthSessionTable
  "infra.email_change_challenges": EmailChangeChallengeTable
  "app.role_assignments": RoleAssignmentTable
  "app.audit_entries": AuditEntryTable
  "app.seasons": SeasonTable
  "app.divisions": DivisionTable
  "app.lines": LineTable
  "app.teams": TeamTable
  "app.venues": VenueTable
  "app.competitions": CompetitionTable
  "app.team_assignments": TeamAssignmentTable
}
