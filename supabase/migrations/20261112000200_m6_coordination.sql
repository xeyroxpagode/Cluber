-- M6 — T03 Coordination (DG-08): overrides, jornadas, jornada_matches
-- Forward-only. Depende de M5 (app.events).

create table app.event_occurrence_overrides (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references app.event_series(id) on delete restrict,
  occurrence_index integer not null,
  overridden_event_id uuid references app.events(id) on delete restrict,
  custom_title text,
  custom_start_at timestamptz,
  custom_end_at timestamptz,
  custom_venue_id uuid references app.venues(id) on delete restrict,
  is_cancelled boolean not null default false,
  created_at timestamptz not null default transaction_timestamp(),
  updated_at timestamptz not null default transaction_timestamp(),
  constraint uq_event_occurrence_overrides__series_index unique (series_id, occurrence_index),
  constraint ck_event_occurrence_overrides__index check (occurrence_index >= 0),
  constraint ck_event_occurrence_overrides__title check (custom_title is null or char_length(trim(custom_title)) between 1 and 160),
  constraint ck_event_occurrence_overrides__window check (custom_end_at is null or custom_start_at is null or custom_end_at > custom_start_at)
);

create index ix_event_occurrence_overrides__series on app.event_occurrence_overrides (series_id);
create index ix_event_occurrence_overrides__overridden on app.event_occurrence_overrides (overridden_event_id) where overridden_event_id is not null;

create table app.jornadas (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references app.seasons(id) on delete restrict,
  competition_id uuid references app.competitions(id) on delete restrict,
  name text not null,
  date date not null,
  created_at timestamptz not null default transaction_timestamp(),
  updated_at timestamptz not null default transaction_timestamp(),
  constraint ck_jornadas__name check (char_length(trim(name)) between 1 and 160)
);

create index ix_jornadas__season_id on app.jornadas (season_id);
create index ix_jornadas__competition_id on app.jornadas (competition_id) where competition_id is not null;
create index ix_jornadas__date on app.jornadas (date);

create table app.jornada_matches (
  id uuid primary key default gen_random_uuid(),
  jornada_id uuid not null references app.jornadas(id) on delete restrict,
  event_id uuid not null references app.events(id) on delete restrict,
  constraint uq_jornada_matches__event unique (event_id)
);

create index ix_jornada_matches__jornada on app.jornada_matches (jornada_id);
create index ix_jornada_matches__event on app.jornada_matches (event_id);

grant select, insert, update, delete on app.event_occurrence_overrides, app.jornadas, app.jornada_matches to gei_backend;
revoke all on app.event_occurrence_overrides, app.jornadas, app.jornada_matches from public, anon, authenticated;
