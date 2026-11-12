-- M9 — T03 Notification Core (DG-07)
-- Forward-only. Depende de M1 (app.people) y M5 (app.events) para origin_event_id.

create table app.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_person_id uuid not null references app.people(id) on delete restrict,
  type text not null,
  resource_type text not null,
  resource_id uuid not null,
  origin_event_id uuid references app.events(id) on delete restrict,
  title text not null,
  body text not null,
  occurred_at timestamptz not null default transaction_timestamp(),
  read_at timestamptz,
  audience_resolved_at timestamptz not null default transaction_timestamp(),
  dedupe_key text not null,
  created_at timestamptz not null default transaction_timestamp(),
  constraint ck_notifications__type check (type in (
    'EVENT_CHANGED','EVENT_POSTPONED','EVENT_RESCHEDULED','EVENT_CANCELLED',
    'EVENT_RESTORED','SELECTION_PUBLISHED','ANNOUNCEMENT_PUBLISHED'
  )),
  constraint ck_notifications__resource_type check (resource_type in ('EVENT','SELECTION','ANNOUNCEMENT')),
  constraint ck_notifications__title check (char_length(trim(title)) between 1 and 300),
  constraint ck_notifications__origin_pair check ((type like 'EVENT\_%') = (origin_event_id is not null)),
  constraint uq_notifications__dedupe_key unique (dedupe_key)
);

create index ix_notifications__recipient on app.notifications (recipient_person_id);
create index ix_notifications__unread on app.notifications (recipient_person_id, occurred_at desc) where read_at is null;
create index ix_notifications__read_at on app.notifications (read_at);
create index ix_notifications__occurred_at on app.notifications (occurred_at desc);

grant select, insert, update, delete on app.notifications to gei_backend;
revoke all on app.notifications from public, anon, authenticated;
