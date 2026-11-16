-- M7 — T04 Participation Core (DG-09 Availability, DG-10 Selection, DG-11 Attendance, DG-12 MatchRecord)
-- Forward-only. Depende de M1 (app.people), M3 (app.teams), M4 (app.team_assignments),
-- M5 (app.events) y M9 (app.notifications).
--
-- Inventario: 8 tablas canónicas + 2 tablas auxiliares de historial (append-only).
-- A-D04-01 (H-01): Availability.responded_at = primera respuesta (inmutable);
--                     coordination_revision se actualiza en cada respuesta válida.
-- A-D04-03 (H-04): attendance_corrections y matchrecord_corrections append-only con trigger.
-- A-D04-04 (H-08): guard de corrección cross-terminal resuelto en servicio + constraints de score.

/* ═══════════════════════════════════════════════════════════════════════════
   M7a — Availability (ENT-20)
   ═══════════════════════════════════════════════════════════════════════════ */

create table app.availability_responses (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references app.events(id) on delete restrict,
  person_id uuid not null references app.people(id) on delete restrict,
  value text not null,
  responded_at timestamptz not null default transaction_timestamp(),
  coordination_revision integer not null default 0,
  created_at timestamptz not null default transaction_timestamp(),
  constraint uq_availability__event_person unique (event_id, person_id),
  constraint ck_availability__value check (value in ('YES','MAYBE','NO')),
  constraint ck_availability__coord_rev check (coordination_revision >= 0)
);

create index ix_availability__event on app.availability_responses (event_id);
create index ix_availability__person on app.availability_responses (person_id);
create index ix_availability__event_person on app.availability_responses (event_id, person_id);

-- A-D04-01: la marca de primera respuesta es inmutable. Reconfirma sólo mueve value/coordination_revision.
create or replace function app.enforce_availability_first_response()
returns trigger
language plpgsql
as $$
begin
  if new.responded_at is distinct from old.responded_at then
    raise exception 'AVAILABILITY_RESPONDED_AT_IMMUTABLE' using errcode = '55000';
  end if;
  if new.event_id is distinct from old.event_id or new.person_id is distinct from old.person_id then
    raise exception 'AVAILABILITY_IDENTITY_IMMUTABLE' using errcode = '55000';
  end if;
  return new;
end;
$$;

create trigger trg_availability__first_response
before update on app.availability_responses
for each row execute function app.enforce_availability_first_response();

/* ═══════════════════════════════════════════════════════════════════════════
   M7b — Selection (ENT-21), SelectionRevision (ENT-22), SelectionEntry (ENT-23)
   ═══════════════════════════════════════════════════════════════════════════ */

create table app.selections (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references app.events(id) on delete restrict,
  current_draft_revision_id uuid,
  created_at timestamptz not null default transaction_timestamp(),
  updated_at timestamptz not null default transaction_timestamp(),
  constraint uq_selections__match unique (match_id)
);

create index ix_selections__match on app.selections (match_id);

create table app.selection_revisions (
  id uuid primary key default gen_random_uuid(),
  selection_id uuid not null references app.selections(id) on delete restrict,
  state text not null default 'DRAFT',
  published_at timestamptz,
  published_by_person_id uuid references app.people(id) on delete restrict,
  autosave_version integer not null default 0,
  created_at timestamptz not null default transaction_timestamp(),
  updated_at timestamptz not null default transaction_timestamp(),
  constraint ck_selrev__state check (state in ('DRAFT','PUBLISHED')),
  constraint ck_selrev__autosave_version check (autosave_version >= 0),
  constraint ck_selrev__published check (
    (state = 'PUBLISHED' and published_at is not null and published_by_person_id is not null)
    or (state = 'DRAFT' and published_at is null and published_by_person_id is null)
  )
);

create index ix_selrev__selection on app.selection_revisions (selection_id);
create index ix_selrev__state on app.selection_revisions (state);
-- Sólo un borrador vivo por convocatoria.
create unique index ux_selrev__single_draft on app.selection_revisions (selection_id) where state = 'DRAFT';

create table app.selection_entries (
  id uuid primary key default gen_random_uuid(),
  revision_id uuid not null references app.selection_revisions(id) on delete restrict,
  person_id uuid not null references app.people(id) on delete restrict,
  role text not null,
  "order" integer,
  created_at timestamptz not null default transaction_timestamp(),
  constraint uq_selentry__rev_person unique (revision_id, person_id),
  constraint ck_selentry__role check (role in ('SELECTED','ALTERNATE'))
);

create index ix_selentry__revision on app.selection_entries (revision_id);
create index ix_selentry__person on app.selection_entries (person_id);
create index ix_selentry__revision_role on app.selection_entries (revision_id, role);

-- FK circular diferible: Selection -> SelectionRevision (DRAFT) y SelectionRevision -> Selection.
alter table app.selections
  add constraint fk_selections__current_draft
  foreign key (current_draft_revision_id)
  references app.selection_revisions(id)
  on delete set null
  deferrable initially deferred;

-- INV-05: una revisión PUBLISHED es inmutable. Sólo se admite la transición DRAFT -> PUBLISHED.
create or replace function app.enforce_selection_revision_immutable()
returns trigger
language plpgsql
as $$
begin
  if old.state = 'PUBLISHED' then
    raise exception 'SELECTION_REVISION_PUBLISHED_IMMUTABLE' using errcode = '55000';
  end if;
  if new.state = 'PUBLISHED' and old.state <> 'DRAFT' then
    raise exception 'SELECTION_REVISION_INVALID_TRANSITION' using errcode = '55000';
  end if;
  if new.state = 'DRAFT' and old.state <> 'DRAFT' then
    raise exception 'SELECTION_REVISION_INVALID_TRANSITION' using errcode = '55000';
  end if;
  if new.selection_id is distinct from old.selection_id then
    raise exception 'SELECTION_REVISION_IDENTITY_IMMUTABLE' using errcode = '55000';
  end if;
  return new;
end;
$$;

create trigger trg_selrev__immutable
before update on app.selection_revisions
for each row execute function app.enforce_selection_revision_immutable();

-- Las entradas de una revisión publicada no se pueden crear, mover ni borrar.
create or replace function app.enforce_selection_entry_revision_state()
returns trigger
language plpgsql
as $$
declare
  target_revision uuid;
  target_state text;
begin
  target_revision := coalesce(new.revision_id, old.revision_id);
  select state into target_state from app.selection_revisions where id = target_revision;
  if target_state = 'PUBLISHED' then
    raise exception 'SELECTION_ENTRY_PUBLISHED_IMMUTABLE' using errcode = '55000';
  end if;
  return coalesce(new, old);
end;
$$;

create trigger trg_selentry__revision_state
before insert or update or delete on app.selection_entries
for each row execute function app.enforce_selection_entry_revision_state();

/* ═══════════════════════════════════════════════════════════════════════════
   M7c — Attendance (ENT-24), AttendanceEntry (ENT-25), AttendanceCorrection (ENT-25H)
   ═══════════════════════════════════════════════════════════════════════════ */

create table app.attendance_sheets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references app.events(id) on delete restrict,
  closed_at timestamptz,
  closed_by_person_id uuid references app.people(id) on delete restrict,
  created_at timestamptz not null default transaction_timestamp(),
  constraint uq_attsheet__event unique (event_id),
  constraint ck_attsheet__closed check (
    (closed_at is not null and closed_by_person_id is not null)
    or (closed_at is null and closed_by_person_id is null)
  )
);

create index ix_attsheet__event on app.attendance_sheets (event_id);

create table app.attendance_entries (
  id uuid primary key default gen_random_uuid(),
  sheet_id uuid not null references app.attendance_sheets(id) on delete restrict,
  person_id uuid not null references app.people(id) on delete restrict,
  value text,
  recorded_at timestamptz,
  recorded_by_person_id uuid references app.people(id) on delete restrict,
  corrected_at timestamptz,
  corrected_by_person_id uuid references app.people(id) on delete restrict,
  correction_reason text,
  previous_value text,
  created_at timestamptz not null default transaction_timestamp(),
  updated_at timestamptz not null default transaction_timestamp(),
  constraint uq_attentry__sheet_person unique (sheet_id, person_id),
  constraint ck_attentry__value check (value is null or value in ('PRESENT','ABSENT','JUSTIFIED')),
  constraint ck_attentry__previous_value check (previous_value is null or previous_value in ('PRESENT','ABSENT','JUSTIFIED')),
  -- UNRECORDED (value null) es ausencia de registro, no ABSENT.
  constraint ck_attentry__recorded check (
    (value is not null and recorded_at is not null and recorded_by_person_id is not null)
    or (value is null and recorded_at is null and recorded_by_person_id is null)
  ),
  -- A-D04-03: previous_value admite NULL (UNRECORDED) como valor anterior.
  constraint ck_attentry__corrected check (
    (corrected_at is not null and corrected_by_person_id is not null and correction_reason is not null)
    or (corrected_at is null and corrected_by_person_id is null and correction_reason is null)
  )
);

create index ix_attentry__sheet on app.attendance_entries (sheet_id);
create index ix_attentry__person on app.attendance_entries (person_id);
create index ix_attentry__sheet_recorded on app.attendance_entries (sheet_id, recorded_at);

create table app.attendance_corrections (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references app.attendance_entries(id) on delete restrict,
  previous_value text,
  new_value text not null,
  correction_reason text not null,
  corrected_at timestamptz not null default transaction_timestamp(),
  corrected_by_person_id uuid not null references app.people(id) on delete restrict,
  constraint ck_attcorr__previous_value check (previous_value is null or previous_value in ('PRESENT','ABSENT','JUSTIFIED')),
  constraint ck_attcorr__new_value check (new_value in ('PRESENT','ABSENT','JUSTIFIED')),
  constraint ck_attcorr__reason check (char_length(trim(correction_reason)) > 0)
);

create index ix_attcorr__entry on app.attendance_corrections (entry_id);
create index ix_attcorr__corrected_at on app.attendance_corrections (corrected_at desc);

-- A-D04-03: historial append-only.
create or replace function app.enforce_immutable_attendance_corrections()
returns trigger
language plpgsql
as $$
begin
  raise exception 'Immutable attendance history table' using errcode = '55000';
end;
$$;

create trigger trg_attendance_corrections_immutable
before update or delete on app.attendance_corrections
for each row execute function app.enforce_immutable_attendance_corrections();

-- Una sheet CLOSED no se reabre: el cierre es irreversible (SM-ATTENDANCEENTRY-01).
create or replace function app.enforce_attendance_sheet_no_reopen()
returns trigger
language plpgsql
as $$
begin
  if old.closed_at is not null then
    if new.closed_at is distinct from old.closed_at or new.closed_by_person_id is distinct from old.closed_by_person_id then
      raise exception 'ATTENDANCE_SHEET_CLOSED_IS_FINAL' using errcode = '55000';
    end if;
  end if;
  if new.event_id is distinct from old.event_id then
    raise exception 'ATTENDANCE_SHEET_EVENT_IMMUTABLE' using errcode = '55000';
  end if;
  return new;
end;
$$;

create trigger trg_attsheet__no_reopen
before update on app.attendance_sheets
for each row execute function app.enforce_attendance_sheet_no_reopen();

-- Con la sheet cerrada, la entrada sólo cambia por corrección explícita (CMD-PRT-07).
create or replace function app.enforce_attendance_entry_closed_guard()
returns trigger
language plpgsql
as $$
declare
  sheet_closed timestamptz;
begin
  if tg_op = 'INSERT' then
    select closed_at into sheet_closed from app.attendance_sheets where id = new.sheet_id;
    -- Con la sheet cerrada no se registra información nueva. Se admite una entrada
    -- vacía (UNRECORDED) para que una corrección motivada pueda dejar constancia
    -- del valor anterior (A-D04-03: previous_value NULL).
    if sheet_closed is not null and new.value is not null then
      raise exception 'ATTENDANCE_SHEET_CLOSED' using errcode = '55000';
    end if;
    return new;
  end if;
  select closed_at into sheet_closed from app.attendance_sheets where id = coalesce(new.sheet_id, old.sheet_id);
  if sheet_closed is not null then
    -- Sólo CMD-PRT-07 puede modificar una entrada con la sheet cerrada.
    if new.corrected_at is not distinct from old.corrected_at then
      raise exception 'ATTENDANCE_SHEET_CLOSED' using errcode = '55000';
    end if;
  end if;
  if tg_op = 'UPDATE' and (new.sheet_id is distinct from old.sheet_id or new.person_id is distinct from old.person_id) then
    raise exception 'ATTENDANCE_ENTRY_IDENTITY_IMMUTABLE' using errcode = '55000';
  end if;
  return coalesce(new, old);
end;
$$;

create trigger trg_attentry__closed_guard
before insert or update or delete on app.attendance_entries
for each row execute function app.enforce_attendance_entry_closed_guard();

/* ═══════════════════════════════════════════════════════════════════════════
   M7d — MatchRecord (ENT-26), PlayerMatchStats (ENT-27), MatchRecordCorrection (ENT-26H)
   ═══════════════════════════════════════════════════════════════════════════ */

create table app.match_records (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references app.events(id) on delete restrict,
  state text not null default 'DRAFT',
  result_type text,
  home_score integer,
  away_score integer,
  observations text,
  finalized_at timestamptz,
  finalized_by_person_id uuid references app.people(id) on delete restrict,
  corrected_at timestamptz,
  corrected_by_person_id uuid references app.people(id) on delete restrict,
  correction_reason text,
  previous_result_type text,
  previous_home_score integer,
  previous_away_score integer,
  previous_observations text,
  created_at timestamptz not null default transaction_timestamp(),
  updated_at timestamptz not null default transaction_timestamp(),
  constraint uq_matchrecord__match unique (match_id),
  constraint ck_mr__state check (state in ('DRAFT','FINAL')),
  constraint ck_mr__result_type check (result_type is null or result_type in ('PLAYED','FORFEIT','ABANDONED')),
  constraint ck_mr__home_score check (home_score is null or home_score >= 0),
  constraint ck_mr__away_score check (away_score is null or away_score >= 0),
  constraint ck_mr__previous_result_type check (previous_result_type is null or previous_result_type in ('PLAYED','FORFEIT','ABANDONED')),
  constraint ck_mr__previous_home_score check (previous_home_score is null or previous_home_score >= 0),
  constraint ck_mr__previous_away_score check (previous_away_score is null or previous_away_score >= 0),
  constraint ck_mr__final check (
    (state = 'FINAL' and result_type is not null and finalized_at is not null and finalized_by_person_id is not null)
    or (state = 'DRAFT' and result_type is null and finalized_at is null and finalized_by_person_id is null)
  ),
  constraint ck_mr__scores check (
    (state = 'DRAFT' and home_score is null and away_score is null)
    or (result_type = 'PLAYED' and home_score is not null and away_score is not null)
    or (result_type in ('FORFEIT','ABANDONED') and home_score is null and away_score is null)
  ),
  constraint ck_mr__corrected check (
    (corrected_at is not null and corrected_by_person_id is not null and correction_reason is not null)
    or (corrected_at is null and corrected_by_person_id is null and correction_reason is null)
  )
);

create index ix_matchrecord__match on app.match_records (match_id);
create index ix_matchrecord__state on app.match_records (state);

create table app.player_match_stats (
  id uuid primary key default gen_random_uuid(),
  match_record_id uuid not null references app.match_records(id) on delete restrict,
  person_id uuid not null references app.people(id) on delete restrict,
  minutes_played integer,
  goals integer,
  assists integer,
  yellow_cards integer,
  red_cards integer,
  mvp boolean not null default false,
  created_at timestamptz not null default transaction_timestamp(),
  updated_at timestamptz not null default transaction_timestamp(),
  constraint uq_pms__mr_person unique (match_record_id, person_id),
  constraint ck_pms__minutes_played check (minutes_played is null or minutes_played >= 0),
  constraint ck_pms__goals check (goals is null or goals >= 0),
  constraint ck_pms__assists check (assists is null or assists >= 0),
  constraint ck_pms__yellow_cards check (yellow_cards is null or yellow_cards >= 0),
  constraint ck_pms__red_cards check (red_cards is null or red_cards >= 0)
);

create index ix_pms__mr on app.player_match_stats (match_record_id);
create index ix_pms__person on app.player_match_stats (person_id);
create index ix_pms__mr_role on app.player_match_stats (match_record_id, person_id);

create table app.matchrecord_corrections (
  id uuid primary key default gen_random_uuid(),
  match_record_id uuid not null references app.match_records(id) on delete restrict,
  previous_result_type text,
  new_result_type text,
  previous_home_score integer,
  new_home_score integer,
  previous_away_score integer,
  new_away_score integer,
  previous_observations text,
  new_observations text,
  correction_reason text not null,
  corrected_at timestamptz not null default transaction_timestamp(),
  corrected_by_person_id uuid not null references app.people(id) on delete restrict,
  constraint ck_mrcorr__previous_result_type check (previous_result_type is null or previous_result_type in ('PLAYED','FORFEIT','ABANDONED')),
  constraint ck_mrcorr__new_result_type check (new_result_type is null or new_result_type in ('PLAYED','FORFEIT','ABANDONED')),
  constraint ck_mrcorr__previous_home_score check (previous_home_score is null or previous_home_score >= 0),
  constraint ck_mrcorr__new_home_score check (new_home_score is null or new_home_score >= 0),
  constraint ck_mrcorr__previous_away_score check (previous_away_score is null or previous_away_score >= 0),
  constraint ck_mrcorr__new_away_score check (new_away_score is null or new_away_score >= 0),
  constraint ck_mrcorr__reason check (char_length(trim(correction_reason)) > 0)
);

create index ix_mrcorr__mr on app.matchrecord_corrections (match_record_id);
create index ix_mrcorr__corrected_at on app.matchrecord_corrections (corrected_at desc);
create index ix_mrcorr__mr_corrected on app.matchrecord_corrections (match_record_id, corrected_at);

-- A-D04-03: historial append-only.
create or replace function app.enforce_immutable_matchrecord_corrections()
returns trigger
language plpgsql
as $$
begin
  raise exception 'Immutable matchrecord history table' using errcode = '55000';
end;
$$;

create trigger trg_matchrecord_corrections_immutable
before update or delete on app.matchrecord_corrections
for each row execute function app.enforce_immutable_matchrecord_corrections();

-- SM-MATCHRECORD-01: DRAFT -> FINAL. FINAL es terminal: no vuelve a DRAFT.
-- En FINAL sólo se admite corrección (CMD-PRT-10) y nunca se toca la cabecera de finalización.
create or replace function app.enforce_match_record_state_machine()
returns trigger
language plpgsql
as $$
begin
  if new.match_id is distinct from old.match_id then
    raise exception 'MATCH_RECORD_MATCH_IMMUTABLE' using errcode = '55000';
  end if;
  if old.state = 'DRAFT' then
    if new.state <> 'DRAFT' and new.state <> 'FINAL' then
      raise exception 'MATCH_RECORD_INVALID_TRANSITION' using errcode = '55000';
    end if;
    return new;
  end if;
  if old.state = 'FINAL' then
    if new.state <> 'FINAL' then
      raise exception 'MATCH_RECORD_FINAL_IS_TERMINAL' using errcode = '55000';
    end if;
    if new.corrected_at is not distinct from old.corrected_at then
      raise exception 'MATCH_RECORD_FINAL_IS_TERMINAL' using errcode = '55000';
    end if;
    if new.finalized_at is distinct from old.finalized_at
       or new.finalized_by_person_id is distinct from old.finalized_by_person_id then
      raise exception 'MATCH_RECORD_FINALIZATION_IMMUTABLE' using errcode = '55000';
    end if;
  end if;
  return new;
end;
$$;

create trigger trg_matchrecord__state_machine
before update on app.match_records
for each row execute function app.enforce_match_record_state_machine();

-- Las estadísticas quedan congeladas cuando el MatchRecord pasa a FINAL (CMD-PRT-11 / INV-14).
create or replace function app.enforce_player_match_stats_freeze()
returns trigger
language plpgsql
as $$
declare
  record_state text;
begin
  select state into record_state from app.match_records where id = coalesce(new.match_record_id, old.match_record_id);
  if record_state = 'FINAL' then
    raise exception 'PLAYER_MATCH_STATS_FROZEN' using errcode = '55000';
  end if;
  return coalesce(new, old);
end;
$$;

create trigger trg_pms__freeze
before insert or update or delete on app.player_match_stats
for each row execute function app.enforce_player_match_stats_freeze();

/* ═══════════════════════════════════════════════════════════════════════════
   Integración con Notification Core (T03 / M9) — COR-02
   NOT-06 (SELECTION_PUBLISHED) referencia el evento de origen para poder
   abrir la convocatoria desde el aviso. El constraint original de M9 sólo
   admitía origin_event_id para tipos EVENT_*. Se amplía de forma explícita y
   mínima: sólo SELECTION_PUBLISHED gana permiso de origen; ANNOUNCEMENT_PUBLISHED
   sigue exigiendo origen nulo y los tipos EVENT_* no cambian.
   ═══════════════════════════════════════════════════════════════════════════ */

alter table app.notifications drop constraint ck_notifications__origin_pair;
alter table app.notifications add constraint ck_notifications__origin_pair check (
  (type like 'EVENT\_%' and origin_event_id is not null)
  or (type = 'SELECTION_PUBLISHED')
  or (type = 'ANNOUNCEMENT_PUBLISHED' and origin_event_id is null)
);

/* ═══════════════════════════════════════════════════════════════════════════
   GRANTS — coherentes con CURRENT (rol gei_backend; sin acceso a público)
   ═══════════════════════════════════════════════════════════════════════════ */

grant select, insert, update, delete on
  app.availability_responses,
  app.selections,
  app.selection_revisions,
  app.selection_entries,
  app.attendance_sheets,
  app.attendance_entries,
  app.match_records,
  app.player_match_stats
  to gei_backend;

-- Historial de negocio: sólo lectura y append (append-only por trigger y por permiso).
grant select, insert on app.attendance_corrections, app.matchrecord_corrections to gei_backend;
revoke update, delete, truncate on app.attendance_corrections, app.matchrecord_corrections from gei_backend;

revoke all on
  app.availability_responses,
  app.selections,
  app.selection_revisions,
  app.selection_entries,
  app.attendance_sheets,
  app.attendance_entries,
  app.attendance_corrections,
  app.match_records,
  app.player_match_stats,
  app.matchrecord_corrections
  from public, anon, authenticated;
