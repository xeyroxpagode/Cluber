-- M5 — T03 Event Core (DG-06) + extensión forward-only del guard de role_assignments
-- Forward-only. No modifica M0–M4.

create table app.event_series (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  state text not null default 'ACTIVE',
  recurrence_rule text not null,
  max_occurrences integer not null default 366,
  created_at timestamptz not null default transaction_timestamp(),
  updated_at timestamptz not null default transaction_timestamp(),
  constraint ck_event_series__name check (char_length(trim(name)) between 1 and 160),
  constraint ck_event_series__state check (state in ('ACTIVE', 'ENDED')),
  constraint ck_event_series__rule check (char_length(trim(recurrence_rule)) between 1 and 500),
  constraint ck_event_series__max_occurrences check (max_occurrences between 1 and 366)
);

create index ix_event_series__state on app.event_series (state);

create table app.events (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title text not null,
  start_at timestamptz,
  end_at timestamptz,
  time_zone text not null,
  venue_id uuid references app.venues(id) on delete restrict,
  state text not null default 'SCHEDULED',
  club_wide_target boolean not null default false,
  series_id uuid references app.event_series(id) on delete restrict,
  occurrence_index integer,
  coordination_revision integer not null default 0,
  creator_person_id uuid not null references app.people(id) on delete restrict,
  created_at timestamptz not null default transaction_timestamp(),
  updated_at timestamptz not null default transaction_timestamp(),
  version integer not null default 1,
  competition_id uuid references app.competitions(id) on delete restrict,
  opponent text,
  constraint ck_events__type check (type in ('TRAINING', 'MATCH', 'CLUB_EVENT')),
  constraint ck_events__state check (state in ('DRAFT','SCHEDULED','POSTPONED','CANCELLED','IN_PROGRESS','COMPLETED','ABANDONED')),
  constraint ck_events__title check (char_length(trim(title)) between 1 and 160),
  constraint ck_events__version check (version >= 1),
  constraint ck_events__coordination_revision check (coordination_revision >= 0),
  constraint ck_events__time_zone check (char_length(trim(time_zone)) between 1 and 64),
  constraint ck_events__occurrence_pair check ((series_id is not null) = (occurrence_index is not null)),
  constraint ck_events__occurrence_index check (occurrence_index is null or occurrence_index >= 0),
  constraint ck_events__end_after_start check (end_at is null or start_at is null or end_at > start_at),
  constraint ck_events__match_requires_opponent check (
    (type <> 'MATCH') or (opponent is not null and char_length(trim(opponent)) > 0)
  ),
  constraint ck_events__competition_only_match check (
    competition_id is null or type = 'MATCH'
  ),
  constraint ck_events__opponent_only_match check (
    opponent is null or type = 'MATCH'
  )
);

create index ix_events__state on app.events (state);
create index ix_events__start_at on app.events (start_at);
create index ix_events__series_id on app.events (series_id);
create index ix_events__club_wide on app.events (club_wide_target) where club_wide_target = true;
create index ix_events__venue on app.events (venue_id) where venue_id is not null;
create index ix_events__competition on app.events (competition_id) where competition_id is not null;
create unique index ux_events__series_occurrence on app.events (series_id, occurrence_index) where series_id is not null;

create table app.event_logistics (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references app.events(id) on delete restrict,
  meeting_at timestamptz,
  departure_at timestamptz,
  meeting_point text,
  transport_note text,
  arrival_instructions text,
  created_at timestamptz not null default transaction_timestamp(),
  updated_at timestamptz not null default transaction_timestamp(),
  constraint uq_event_logistics__event unique (event_id),
  constraint ck_event_logistics__departure_after_meeting check (meeting_at is null or departure_at is null or departure_at >= meeting_at)
);

create index ix_event_logistics__event on app.event_logistics (event_id);

create table app.event_target_team (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references app.events(id) on delete restrict,
  team_id uuid not null references app.teams(id) on delete restrict,
  added_at timestamptz not null default transaction_timestamp(),
  added_by_person_id uuid not null references app.people(id) on delete restrict,
  constraint uq_event_target_team__event_team unique (event_id, team_id)
);

create index ix_event_target_team__event on app.event_target_team (event_id);
create index ix_event_target_team__team on app.event_target_team (team_id);

create table app.event_target_person (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references app.events(id) on delete restrict,
  person_id uuid not null references app.people(id) on delete restrict,
  added_at timestamptz not null default transaction_timestamp(),
  added_by_person_id uuid references app.people(id) on delete restrict,
  constraint uq_event_target_person__event_person unique (event_id, person_id)
);

create index ix_event_target_person__event on app.event_target_person (event_id);
create index ix_event_target_person__person on app.event_target_person (person_id);

grant select, insert, update, delete on app.event_series, app.events, app.event_logistics, app.event_target_team, app.event_target_person to gei_backend;
revoke all on app.event_series, app.events, app.event_logistics, app.event_target_team, app.event_target_person from public, anon, authenticated;

-- Extensión forward-only del guard M3: permite scope_type='EVENT' solo para COACH
-- referenciando un evento existente. Resto del comportamiento se conserva.
create or replace function app.assert_role_assignment_target()
returns trigger
language plpgsql
as $$
begin
  if new.scope_type = 'TEAM' then
    if new.role not in ('PLAYER', 'CAPTAIN', 'COACH') then
      raise exception 'ROLE_SCOPE_PAIR_PROHIBITED' using errcode = '22023';
    end if;
    if not exists (select 1 from app.teams where id = new.scope_ref_id) then
      raise exception 'TEAM_NOT_FOUND' using errcode = '23503';
    end if;
  elsif new.scope_type = 'EVENT' then
    if new.role <> 'COACH' then
      raise exception 'EVENT_SCOPE_REQUIRES_COACH' using errcode = '22023';
    end if;
    if new.scope_ref_id is null then
      raise exception 'EVENT_SCOPE_REF_REQUIRED' using errcode = '22023';
    end if;
    if not exists (select 1 from app.events where id = new.scope_ref_id) then
      raise exception 'EVENT_NOT_FOUND' using errcode = '23503';
    end if;
  elsif new.scope_ref_id is not null then
    raise exception 'CLUB_SCOPE_REF_PROHIBITED' using errcode = '22023';
  end if;
  return new;
end;
$$;
