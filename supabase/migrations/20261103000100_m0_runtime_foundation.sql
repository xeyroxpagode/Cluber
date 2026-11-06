create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;
create extension if not exists btree_gist with schema extensions;

create schema if not exists app;
create schema if not exists infra;

revoke all on schema app from public, anon, authenticated;
revoke all on schema infra from public, anon, authenticated;

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'gei_backend') then
    create role gei_backend nologin nosuperuser nocreatedb nocreaterole noinherit;
  end if;
end
$$;

grant usage on schema app, infra to gei_backend;
grant gei_backend to postgres;

create table infra.idempotency_records (
  id uuid primary key default gen_random_uuid(),
  scope_key text not null,
  command_id text not null,
  idempotency_key text not null,
  request_hash bytea not null,
  status text not null,
  response_status integer,
  response_snapshot jsonb,
  resource_type text,
  resource_id uuid,
  created_at timestamptz not null default transaction_timestamp(),
  expires_at timestamptz not null,
  constraint uq_idempotency_records__scope_command_key unique (scope_key, command_id, idempotency_key),
  constraint ck_idempotency_records__status check (status in ('IN_PROGRESS', 'SUCCEEDED')),
  constraint ck_idempotency_records__expiry check (expires_at > created_at),
  constraint ck_idempotency_records__success_snapshot check (
    (status = 'IN_PROGRESS' and response_status is null and response_snapshot is null)
    or (status = 'SUCCEEDED' and response_status is not null)
  )
);

create index ix_idempotency_records__expires_at on infra.idempotency_records (expires_at);

create table infra.outbox_events (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  aggregate_type text not null,
  aggregate_id uuid not null,
  payload jsonb not null,
  created_at timestamptz not null default transaction_timestamp(),
  available_at timestamptz not null default transaction_timestamp(),
  processed_at timestamptz,
  attempt_count integer not null default 0,
  last_error text,
  failed_at timestamptz,
  constraint ck_outbox_events__attempt_count check (attempt_count >= 0),
  constraint ck_outbox_events__terminal_state check (processed_at is null or failed_at is null),
  constraint ck_outbox_events__payload_object check (jsonb_typeof(payload) = 'object')
);

create index ix_outbox_events__eligible
  on infra.outbox_events (available_at, created_at)
  where processed_at is null and failed_at is null;
create index ix_outbox_events__processed_at on infra.outbox_events (processed_at) where processed_at is not null;
create index ix_outbox_events__failed_at on infra.outbox_events (failed_at) where failed_at is not null;

create table infra.rate_limit_windows (
  policy text not null,
  key_hash bytea not null,
  window_started_at timestamptz not null,
  count integer not null,
  blocked_until timestamptz,
  updated_at timestamptz not null default transaction_timestamp(),
  constraint pk_rate_limit_windows primary key (policy, key_hash, window_started_at),
  constraint ck_rate_limit_windows__count check (count >= 0),
  constraint ck_rate_limit_windows__blocked_until check (blocked_until is null or blocked_until >= window_started_at)
);

create index ix_rate_limit_windows__updated_at on infra.rate_limit_windows (updated_at);

grant select, insert, update, delete on all tables in schema infra to gei_backend;
alter default privileges in schema infra grant select, insert, update, delete on tables to gei_backend;
alter default privileges in schema app grant select, insert, update, delete on tables to gei_backend;

revoke all on all tables in schema infra from public, anon, authenticated;
alter default privileges in schema infra revoke all on tables from public, anon, authenticated;
alter default privileges in schema app revoke all on tables from public, anon, authenticated;
