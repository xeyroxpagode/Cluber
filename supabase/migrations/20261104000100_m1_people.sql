-- M1 — People + Membership
create table app.people (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  dni text,
  birth_date date,
  phone text,
  email text,
  created_at timestamptz not null default transaction_timestamp(),
  updated_at timestamptz not null default transaction_timestamp(),
  constraint ck_people__first_name check (char_length(trim(first_name)) between 1 and 100),
  constraint ck_people__last_name check (char_length(trim(last_name)) between 1 and 100),
  constraint ck_people__email_nonempty check (email is null or char_length(trim(email)) between 3 and 254),
  constraint ck_people__phone_nonempty check (phone is null or char_length(trim(phone)) between 3 and 64),
  constraint ck_people__dni_nonempty check (dni is null or char_length(trim(dni)) between 1 and 40)
);

-- DNI partial unique. No synthetic syntax validation is imposed.
create unique index ux_people__dni_ci_partial on app.people (upper(trim(dni))) where dni is not null;
create index ix_people__email_lookup on app.people (lower(trim(email))) where email is not null;
create index ix_people__search_name on app.people (lower(trim(last_name)), lower(trim(first_name)));

create table app.memberships (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references app.people(id) on delete restrict,
  valid_from timestamptz not null,
  valid_until timestamptz,
  created_at timestamptz not null default transaction_timestamp(),
  constraint ck_memberships__period check (valid_until is null or valid_until > valid_from)
);

create index ix_memberships__person_period on app.memberships (person_id, valid_from desc, valid_until);
create index ix_memberships__active_lookup on app.memberships (valid_from, valid_until) where valid_until is null;

grant select, insert, update, delete on app.people, app.memberships to gei_backend;
revoke all on app.people, app.memberships from public, anon, authenticated;
