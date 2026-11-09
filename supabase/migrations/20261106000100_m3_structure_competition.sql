-- M3 — Structure + Competition

create table app.seasons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  starts_on date not null,
  ends_on date not null,
  version integer not null default 1,
  created_at timestamptz not null default transaction_timestamp(),
  updated_at timestamptz not null default transaction_timestamp(),
  constraint ck_seasons__name check (char_length(trim(name)) between 1 and 160),
  constraint ck_seasons__dates check (ends_on > starts_on),
  constraint ck_seasons__version check (version >= 1)
);

create unique index ux_seasons__name_ci on app.seasons (lower(trim(name)));

create table app.divisions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  archived_at timestamptz,
  version integer not null default 1,
  created_at timestamptz not null default transaction_timestamp(),
  updated_at timestamptz not null default transaction_timestamp(),
  constraint ck_divisions__name check (char_length(trim(name)) between 1 and 160),
  constraint ck_divisions__version check (version >=1)
);

create unique index ux_divisions__name_ci_active on app.divisions (lower(trim(name))) where archived_at is null;

create table app.lines (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  archived_at timestamptz,
  version integer not null default 1,
  created_at timestamptz not null default transaction_timestamp(),
  updated_at timestamptz not null default transaction_timestamp(),
  constraint ck_lines__name check (char_length(trim(name)) between 1 and 160),
  constraint ck_lines__version check (version >= 1)
);

create unique index ux_lines__name_ci_active on app.lines (lower(trim(name))) where archived_at is null;

create table app.teams (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references app.seasons(id) on delete restrict,
  division_id uuid not null references app.divisions(id) on delete restrict,
  line_id uuid not null references app.lines(id) on delete restrict,
  state text not null default 'DRAFT',
  version integer not null default 1,
  created_at timestamptz not null default transaction_timestamp(),
  updated_at timestamptz not null default transaction_timestamp(),
  constraint uq_teams__season_division_line unique (season_id, division_id, line_id),
  constraint ck_teams__state check (state in ('DRAFT', 'ACTIVE', 'ARCHIVED')),
  constraint ck_teams__version check (version >= 1)
);

create index ix_teams__division_state on app.teams (division_id, state);
create index ix_teams__line_state on app.teams (line_id, state);
create index ix_teams__season_state on app.teams (season_id, state);

create table app.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  archived_at timestamptz,
  version integer not null default 1,
  created_at timestamptz not null default transaction_timestamp(),
  updated_at timestamptz not null default transaction_timestamp(),
  constraint ck_venues__name check (char_length(trim(name)) between 1 and 160),
  constraint ck_venues__address check (char_length(trim(address)) between 1 and 300),
  constraint ck_venues__version check (version >= 1)
);

create index ix_venues__active_name on app.venues (lower(trim(name))) where archived_at is null;

create table app.competitions (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references app.seasons(id) on delete restrict,
  name text not null,
  archived_at timestamptz,
  version integer not null default 1,
  created_at timestamptz not null default transaction_timestamp(),
  updated_at timestamptz not null default transaction_timestamp(),
  constraint ck_competitions__name check (char_length(trim(name)) between 1 and 160),
  constraint ck_competitions__version check (version >= 1)
);

create index ix_competitions__season_active on app.competitions (season_id, lower(trim(name))) where archived_at is null;

create or replace function app.assert_role_assignment_target()
returns trigger
language plpgsql
as $$
begin
  if new.scope_type = 'TEAM' then
    if not exists (select 1 from app.teams where id = new.scope_ref_id) then
      raise exception 'TEAM_NOT_FOUND' using errcode = '23503';
    end if;
  elsif new.scope_type = 'EVENT' then
    raise exception 'EVENT_SCOPE_NOT_ASSIGNABLE_IN_T02' using errcode = '22023';
  elsif new.scope_ref_id is not null then
    raise exception 'CLUB_SCOPE_REF_PROHIBITED' using errcode = '22023';
  end if;
  return new;
end;
$$;

create trigger trg_role_assignments__target
before insert or update of scope_type, scope_ref_id on app.role_assignments
for each row execute function app.assert_role_assignment_target();

grant select, insert, update, delete on app.seasons, app.divisions, app.lines, app.teams, app.venues, app.competitions to gei_backend;
revoke all on app.seasons, app.divisions, app.lines, app.teams, app.venues, app.competitions from public, anon, authenticated;
