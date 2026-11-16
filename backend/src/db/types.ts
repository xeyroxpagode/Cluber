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

export interface EventSeriesTable {
  id: string
  name: string
  state: "ACTIVE" | "ENDED"
  recurrence_rule: string
  max_occurrences: number
  created_at: Date
  updated_at: Date
}

export interface EventTable {
  id: string
  type: "TRAINING" | "MATCH" | "CLUB_EVENT"
  title: string
  start_at: Date | null
  end_at: Date | null
  time_zone: string
  venue_id: string | null
  state: "DRAFT" | "SCHEDULED" | "POSTPONED" | "CANCELLED" | "IN_PROGRESS" | "COMPLETED" | "ABANDONED"
  club_wide_target: boolean
  series_id: string | null
  occurrence_index: number | null
  coordination_revision: number
  creator_person_id: string
  created_at: Date
  updated_at: Date
  version: number
  competition_id: string | null
  opponent: string | null
}

export interface EventLogisticsTable {
  id: string
  event_id: string
  meeting_at: Date | null
  departure_at: Date | null
  meeting_point: string | null
  transport_note: string | null
  arrival_instructions: string | null
  created_at: Date
  updated_at: Date
}

export interface EventTargetTeamTable {
  id: string
  event_id: string
  team_id: string
  added_at: Date
  added_by_person_id: string
}

export interface EventTargetPersonTable {
  id: string
  event_id: string
  person_id: string
  added_at: Date
  added_by_person_id: string | null
}

export interface EventOccurrenceOverrideTable {
  id: string
  series_id: string
  occurrence_index: number
  overridden_event_id: string | null
  custom_title: string | null
  custom_start_at: Date | null
  custom_end_at: Date | null
  custom_venue_id: string | null
  is_cancelled: boolean
  created_at: Date
  updated_at: Date
}

export interface JornadaTable {
  id: string
  season_id: string
  competition_id: string | null
  name: string
  date: string
  created_at: Date
  updated_at: Date
}

export interface JornadaMatchTable {
  id: string
  jornada_id: string
  event_id: string
}

export interface NotificationTable {
  id: string
  recipient_person_id: string
  type: "EVENT_CHANGED" | "EVENT_POSTPONED" | "EVENT_RESCHEDULED" | "EVENT_CANCELLED" | "EVENT_RESTORED" | "SELECTION_PUBLISHED" | "ANNOUNCEMENT_PUBLISHED"
  resource_type: "EVENT" | "SELECTION" | "ANNOUNCEMENT"
  resource_id: string
  origin_event_id: string | null
  title: string
  body: string
  occurred_at: Date
  read_at: Date | null
  audience_resolved_at: Date
  dedupe_key: string
  created_at: Date
}

/* ── T04 Participation (M7) ── */

export interface AvailabilityResponseTable {
  id: Generated<string>
  event_id: string
  person_id: string
  value: "YES" | "MAYBE" | "NO"
  responded_at: Generated<Date>
  coordination_revision: number
  created_at: Generated<Date>
}

export interface SelectionTable {
  id: Generated<string>
  match_id: string
  current_draft_revision_id: string | null
  created_at: Generated<Date>
  updated_at: Generated<Date>
}

export interface SelectionRevisionTable {
  id: Generated<string>
  selection_id: string
  state: "DRAFT" | "PUBLISHED"
  published_at: Date | null
  published_by_person_id: string | null
  autosave_version: number
  created_at: Generated<Date>
  updated_at: Generated<Date>
}

export interface SelectionEntryTable {
  id: Generated<string>
  revision_id: string
  person_id: string
  role: "SELECTED" | "ALTERNATE"
  order: number | null
  created_at: Generated<Date>
}

export interface AttendanceSheetTable {
  id: Generated<string>
  event_id: string
  closed_at: Date | null
  closed_by_person_id: string | null
  created_at: Generated<Date>
}

export interface AttendanceEntryTable {
  id: Generated<string>
  sheet_id: string
  person_id: string
  value: "PRESENT" | "ABSENT" | "JUSTIFIED" | null
  recorded_at: Date | null
  recorded_by_person_id: string | null
  corrected_at: Date | null
  corrected_by_person_id: string | null
  correction_reason: string | null
  previous_value: "PRESENT" | "ABSENT" | "JUSTIFIED" | null
  created_at: Generated<Date>
  updated_at: Generated<Date>
}

export interface AttendanceCorrectionTable {
  id: Generated<string>
  entry_id: string
  previous_value: "PRESENT" | "ABSENT" | "JUSTIFIED" | null
  new_value: "PRESENT" | "ABSENT" | "JUSTIFIED"
  correction_reason: string
  corrected_at: Generated<Date>
  corrected_by_person_id: string
}

export interface MatchRecordTable {
  id: Generated<string>
  match_id: string
  state: "DRAFT" | "FINAL"
  result_type: "PLAYED" | "FORFEIT" | "ABANDONED" | null
  home_score: number | null
  away_score: number | null
  observations: string | null
  finalized_at: Date | null
  finalized_by_person_id: string | null
  corrected_at: Date | null
  corrected_by_person_id: string | null
  correction_reason: string | null
  previous_result_type: "PLAYED" | "FORFEIT" | "ABANDONED" | null
  previous_home_score: number | null
  previous_away_score: number | null
  previous_observations: string | null
  created_at: Generated<Date>
  updated_at: Generated<Date>
}

export interface PlayerMatchStatsTable {
  id: Generated<string>
  match_record_id: string
  person_id: string
  minutes_played: number | null
  goals: number | null
  assists: number | null
  yellow_cards: number | null
  red_cards: number | null
  mvp: Generated<boolean>
  created_at: Generated<Date>
  updated_at: Generated<Date>
}

export interface MatchRecordCorrectionTable {
  id: Generated<string>
  match_record_id: string
  previous_result_type: "PLAYED" | "FORFEIT" | "ABANDONED" | null
  new_result_type: "PLAYED" | "FORFEIT" | "ABANDONED" | null
  previous_home_score: number | null
  new_home_score: number | null
  previous_away_score: number | null
  new_away_score: number | null
  previous_observations: string | null
  new_observations: string | null
  correction_reason: string
  corrected_at: Generated<Date>
  corrected_by_person_id: string
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
  "app.event_series": EventSeriesTable
  "app.events": EventTable
  "app.event_logistics": EventLogisticsTable
  "app.event_target_team": EventTargetTeamTable
  "app.event_target_person": EventTargetPersonTable
  "app.event_occurrence_overrides": EventOccurrenceOverrideTable
  "app.jornadas": JornadaTable
  "app.jornada_matches": JornadaMatchTable
  "app.notifications": NotificationTable
  "app.availability_responses": AvailabilityResponseTable
  "app.selections": SelectionTable
  "app.selection_revisions": SelectionRevisionTable
  "app.selection_entries": SelectionEntryTable
  "app.attendance_sheets": AttendanceSheetTable
  "app.attendance_entries": AttendanceEntryTable
  "app.attendance_corrections": AttendanceCorrectionTable
  "app.match_records": MatchRecordTable
  "app.player_match_stats": PlayerMatchStatsTable
  "app.matchrecord_corrections": MatchRecordCorrectionTable
}
