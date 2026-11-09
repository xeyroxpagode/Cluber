-- M2 — IAM + Authority base + AuditEntry

create table app.accounts (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references app.people(id) on delete restrict,
  username text not null,
  password_hash text,
  status text not null default 'PENDING',
  activated_at timestamptz,
  disabled_at timestamptz,
  credential_version integer not null default 1,
  setup_token_hash bytea,
  setup_token_expires_at timestamptz,
  setup_token_attempts integer not null default 0,
  created_at timestamptz not null default transaction_timestamp(),
  updated_at timestamptz not null default transaction_timestamp(),
  constraint uq_accounts__person_id unique (person_id),
  constraint ck_accounts__username check (char_length(trim(username)) between 3 and 100),
  constraint ck_accounts__status check (status in ('PENDING', 'ACTIVE', 'DISABLED')),
  constraint ck_accounts__credential_version check (credential_version >= 1),
  constraint ck_accounts__setup_token_attempts check (setup_token_attempts >= 0),
  constraint ck_accounts__active_state check (
    status <> 'ACTIVE' or (password_hash is not null and activated_at is not null and disabled_at is null)
  ),
  constraint ck_accounts__disabled_state check (
    status <> 'DISABLED' or disabled_at is not null
  ),
  constraint ck_accounts__token_state check (
    (setup_token_hash is null and setup_token_expires_at is null)
    or (setup_token_hash is not null and setup_token_expires_at is not null)
  )
);

create unique index ux_accounts__username_ci on app.accounts (lower(trim(username)));
create index ix_accounts__status on app.accounts (status);

create table infra.auth_sessions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references app.accounts(id) on delete restrict,
  session_token_hash bytea not null,
  credential_version integer not null,
  created_at timestamptz not null default transaction_timestamp(),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  constraint uq_auth_sessions__token_hash unique (session_token_hash),
  constraint ck_auth_sessions__credential_version check (credential_version >= 1),
  constraint ck_auth_sessions__expiry check (expires_at > created_at)
);

create index ix_auth_sessions__account_current on infra.auth_sessions (account_id, credential_version, expires_at) where revoked_at is null;

create table infra.email_change_challenges (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references app.people(id) on delete restrict,
  account_id uuid not null references app.accounts(id) on delete restrict,
  new_email_normalized text not null,
  code_hash bytea not null,
  attempts integer not null default 0,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default transaction_timestamp(),
  constraint ck_email_change_challenges__email check (char_length(trim(new_email_normalized)) between 3 and 254),
  constraint ck_email_change_challenges__attempts check (attempts >= 0),
  constraint ck_email_change_challenges__expiry check (expires_at > created_at)
);

create index ix_email_change_challenges__person_active on infra.email_change_challenges (person_id, expires_at) where consumed_at is null;
create index ix_email_change_challenges__account_active on infra.email_change_challenges (account_id, expires_at) where consumed_at is null;

create table app.role_assignments (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references app.people(id) on delete restrict,
  role text not null,
  scope_type text not null,
  scope_ref_id uuid,
  valid_from timestamptz not null,
  valid_until timestamptz,
  temporal_exclusions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default transaction_timestamp(),
  constraint ck_role_assignments__role check (role in ('PLAYER', 'CAPTAIN', 'COACH', 'SUBCOMMITTEE', 'ADMIN')),
  constraint ck_role_assignments__scope_type check (scope_type in ('TEAM', 'EVENT', 'CLUB')),
  constraint ck_role_assignments__period check (valid_until is null or valid_until > valid_from),
  constraint ck_role_assignments__temporal_exclusions check (jsonb_typeof(temporal_exclusions) = 'array'),
  constraint ck_role_assignments__scope_pair check (
    (role in ('PLAYER', 'CAPTAIN') and scope_type = 'TEAM' and scope_ref_id is not null)
    or (role = 'COACH' and scope_type in ('TEAM', 'EVENT') and scope_ref_id is not null)
    or (role in ('SUBCOMMITTEE', 'ADMIN') and scope_type = 'CLUB' and scope_ref_id is null)
  )
);

create index ix_role_assignments__person_current on app.role_assignments (person_id, valid_from, valid_until);
create index ix_role_assignments__scope_current on app.role_assignments (scope_type, scope_ref_id, valid_until);

create table app.audit_entries (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default transaction_timestamp(),
  actor_person_id uuid references app.people(id) on delete restrict,
  action text not null,
  target_type text not null,
  target_id uuid,
  reason text,
  source text not null,
  diff jsonb,
  constraint ck_audit_entries__action check (char_length(trim(action)) between 1 and 120),
  constraint ck_audit_entries__target_type check (char_length(trim(target_type)) between 1 and 120),
  constraint ck_audit_entries__source check (source = 'system' or source ~ '^(CMD|OP)-[A-Z0-9_-]+$'),
  constraint ck_audit_entries__diff check (diff is null or jsonb_typeof(diff) = 'object')
);

create index ix_audit_entries__occurred_at on app.audit_entries (occurred_at desc);
create index ix_audit_entries__target on app.audit_entries (target_type, target_id, occurred_at desc);
create index ix_audit_entries__actor on app.audit_entries (actor_person_id, occurred_at desc);

create or replace function app.audit_entries_append_only()
returns trigger
language plpgsql
as $$
begin
  raise exception 'AUDIT_ENTRIES_APPEND_ONLY' using errcode = '55000';
end;
$$;

create trigger trg_audit_entries__append_only
before update or delete or truncate on app.audit_entries
for each statement execute function app.audit_entries_append_only();

grant select, insert on app.accounts, app.role_assignments, app.audit_entries to gei_backend;
grant update on app.accounts, app.role_assignments to gei_backend;
grant select, insert, update, delete on infra.auth_sessions, infra.email_change_challenges to gei_backend;
revoke update, delete, truncate on app.audit_entries from gei_backend, public, anon, authenticated;
revoke all on app.accounts, app.role_assignments, app.audit_entries from public, anon, authenticated;
revoke all on infra.auth_sessions, infra.email_change_challenges from public, anon, authenticated;
