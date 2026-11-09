-- M4 — Team affiliation

create table app.team_assignments (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references app.people(id) on delete restrict,
  team_id uuid not null references app.teams(id) on delete restrict,
  valid_from date not null,
  valid_until date,
  created_at timestamptz not null default transaction_timestamp(),
  constraint ck_team_assignments__period check (valid_until is null or valid_until > valid_from),
  constraint excl_team_assignments__person_no_overlap exclude using gist (
    person_id with =,
    daterange(valid_from, valid_until, '[)') with &&
  )
);

create index ix_team_assignments__team_period on app.team_assignments (team_id, valid_from, valid_until);
create index ix_team_assignments__person_period on app.team_assignments (person_id, valid_from, valid_until);

grant select, insert, update, delete on app.team_assignments to gei_backend;
revoke all on app.team_assignments from public, anon, authenticated;
