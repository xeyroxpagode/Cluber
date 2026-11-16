-- M8 — T05 Communication (DG-13 Announcements + DG-14 Conversations & Messaging)
-- Forward-only. Depende de M1 (app.people), M3 (app.teams), M5 (app.events) y M9 (app.notifications).
-- Contrato: 02_INTEGRATED_IMPLEMENTATION_CONTRACT.md §4.1 (ENT-28..ENT-32).
-- Decisiones aplicadas: CC-T05-C10 (UPDATE DRAFT via version), CC-T05-C19 (unread excluye autor).

create extension if not exists btree_gist;

-- ---------------------------------------------------------------------------
-- ENT-28 Announcement
-- ---------------------------------------------------------------------------
create table app.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 300),
  body text not null check (char_length(trim(body)) >= 1),
  state text not null default 'DRAFT' check (state in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  published_at timestamptz,
  published_by_person_id uuid references app.people(id) on delete restrict,
  archived_at timestamptz,
  revision integer not null default 1 check (revision >= 1),
  version integer not null default 1 check (version >= 1),
  created_at timestamptz not null default transaction_timestamp(),
  updated_at timestamptz not null default transaction_timestamp(),
  -- C18: ARCHIVED conserva published_at / published_by_person_id / audience.
  constraint ck_announcements__published check (
    (state in ('PUBLISHED', 'ARCHIVED') and published_at is not null and published_by_person_id is not null) or
    (state = 'DRAFT' and published_at is null and published_by_person_id is null)
  ),
  constraint ck_announcements__archived check (
    (state = 'ARCHIVED' and archived_at is not null) or
    (state <> 'ARCHIVED' and archived_at is null)
  )
);

create index ix_announcements__published on app.announcements (published_at desc) where state = 'PUBLISHED';
create index ix_announcements__state on app.announcements (state);

-- ---------------------------------------------------------------------------
-- ENT-29 AnnouncementTargetTeam — snapshot inmutable después de publicar
-- ---------------------------------------------------------------------------
create table app.announcement_target_teams (
  id uuid primary key default gen_random_uuid(),
  announcement_id uuid not null references app.announcements(id) on delete cascade,
  team_id uuid not null references app.teams(id) on delete restrict,
  added_at timestamptz not null default transaction_timestamp(),
  added_by_person_id uuid not null references app.people(id) on delete restrict,
  constraint uq_announcement_target_teams__announcement_team unique (announcement_id, team_id)
);

create index ix_announcement_target_teams__announcement on app.announcement_target_teams (announcement_id);
create index ix_announcement_target_teams__team on app.announcement_target_teams (team_id);

-- ---------------------------------------------------------------------------
-- ENT-30 Conversation — identidad canónica por contexto
-- ---------------------------------------------------------------------------
create table app.conversations (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('DIRECT', 'GROUP', 'TEAM', 'EVENT')),
  title text,
  state text not null default 'ACTIVE' check (state in ('ACTIVE', 'ARCHIVED')),
  direct_pair_key text,
  team_id uuid references app.teams(id) on delete restrict,
  event_id uuid references app.events(id) on delete restrict,
  created_at timestamptz not null default transaction_timestamp(),
  created_by_person_id uuid not null references app.people(id) on delete restrict,
  version integer not null default 1 check (version >= 1),
  constraint ck_conversations__title check (
    (type = 'GROUP' and title is not null and char_length(trim(title)) >= 1) or
    (type in ('TEAM', 'EVENT', 'DIRECT') and title is null)
  ),
  constraint ck_conversations__state check (
    (type = 'GROUP' and state in ('ACTIVE', 'ARCHIVED')) or
    (type in ('DIRECT', 'TEAM', 'EVENT') and state = 'ACTIVE')
  ),
  -- Toda conversación tiene exactamente una identidad contextual válida.
  constraint ck_conversations__context check (
    (type = 'DIRECT' and direct_pair_key is not null and team_id is null and event_id is null) or
    (type = 'GROUP' and direct_pair_key is null and team_id is null and event_id is null) or
    (type = 'TEAM' and team_id is not null and direct_pair_key is null and event_id is null) or
    (type = 'EVENT' and event_id is not null and direct_pair_key is null and team_id is null)
  )
);

create unique index uq_conversations__direct_pair on app.conversations (direct_pair_key) where type = 'DIRECT';
create unique index uq_conversations__team on app.conversations (team_id) where type = 'TEAM';
create unique index uq_conversations__event on app.conversations (event_id) where type = 'EVENT';
create index ix_conversations__direct_pair on app.conversations (direct_pair_key) where type = 'DIRECT';
create index ix_conversations__team on app.conversations (team_id) where type = 'TEAM';
create index ix_conversations__event on app.conversations (event_id) where type = 'EVENT';

-- ---------------------------------------------------------------------------
-- ENT-31 ConversationParticipant — intervalos [joinedAt, leftAt) no solapados
-- ---------------------------------------------------------------------------
create table app.conversation_participants (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references app.conversations(id) on delete cascade,
  person_id uuid not null references app.people(id) on delete restrict,
  joined_at timestamptz not null default transaction_timestamp(),
  left_at timestamptz,
  last_read_at timestamptz,
  constraint uq_conversation_participants__interval unique (conversation_id, person_id, joined_at),
  constraint ck_conversation_participants__interval check (left_at is null or left_at > joined_at)
);

alter table app.conversation_participants
  add constraint ex_conversation_participants__no_overlap
  exclude using gist (
    conversation_id with =,
    person_id with =,
    tstzrange(joined_at, coalesce(left_at, 'infinity'::timestamptz)) with &&
  );

create index ix_conversation_participants__conversation on app.conversation_participants (conversation_id);
create index ix_conversation_participants__person on app.conversation_participants (person_id);
create index ix_conversation_participants__active on app.conversation_participants (person_id, conversation_id) where left_at is null;

-- ---------------------------------------------------------------------------
-- ENT-32 Message — SENT/EDITED/DELETED con tombstone irreversible
-- ---------------------------------------------------------------------------
create table app.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references app.conversations(id) on delete cascade,
  author_person_id uuid not null references app.people(id) on delete restrict,
  body text not null check (char_length(trim(body)) >= 1),
  state text not null default 'SENT' check (state in ('SENT', 'EDITED', 'DELETED')),
  sent_at timestamptz not null default transaction_timestamp(),
  edited_at timestamptz,
  deleted_at timestamptz,
  deletion_reason text,
  version integer not null default 1 check (version >= 1),
  -- C09 / SM-MESSAGE-01: EDITED -> DELETED preserva edited_at; SENT -> DELETED no lo tiene.
  constraint ck_messages__edited check (
    (state = 'EDITED' and edited_at is not null) or
    (state = 'DELETED' and deleted_at is not null) or
    (state = 'SENT' and edited_at is null)
  ),
  constraint ck_messages__deleted check (
    (state = 'DELETED' and deleted_at is not null and deletion_reason is not null) or
    (state <> 'DELETED' and deleted_at is null and deletion_reason is null)
  )
);

create index ix_messages__conversation on app.messages (conversation_id, sent_at asc);
create index ix_messages__author on app.messages (author_person_id);
create index ix_messages__conversation_sent on app.messages (conversation_id, sent_at asc, id asc);

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------
grant select, insert, update, delete on app.announcements to gei_backend;
grant select, insert, update, delete on app.announcement_target_teams to gei_backend;
grant select, insert, update, delete on app.conversations to gei_backend;
grant select, insert, update, delete on app.conversation_participants to gei_backend;
grant select, insert, update, delete on app.messages to gei_backend;
revoke all on app.announcements, app.announcement_target_teams, app.conversations, app.conversation_participants, app.messages from public, anon, authenticated;
