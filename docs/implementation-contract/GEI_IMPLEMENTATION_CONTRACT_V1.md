# GEI IMPLEMENTATION CONTRACT V1

**Status:** FROZEN  
**Version:** V1  
**Date:** 2026-10-26  
**Authority:** This document is the single human authority for the implementable functional contract of GEI V1. The JSON file `GEI_IMPLEMENTATION_CONTRACT_V1.json` is its machine-readable equivalent; neither adds semantics the other lacks.  
**Scope:** What must be true. Not how the database, transport or UI implement it.

---

## 00 Status / Authority

### 00.1 Purpose

This document reconciles the frozen product knowledge of GEI into one implementable contract: entities, fields, relationships, invariants, lifecycles, commands, authority, PII, side effects, read contracts and traceability. It closes functional semantics so that the next stage can design `DATABASE`, `BACKEND` and `FRONTEND DATA CONTRACTS` without reopening functional discussion.

### 00.2 Authority order applied

| Rank | Authority | Repository source |
|---|---|---|
| 1 | Product Truth V1.1 / Scope Reconciliation V1.1 | `docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_1.md`, `docs/GEI_SCOPE_RECONCILIATION_V1_1.md` |
| 2 | Requirements V1.1 + accepted change control | `docs/requirements/GEI_REQUIREMENTS_FREEZE_V1_1.md`, `docs/change-control/GEI_CHANGE_CONTROL_V1_0_1_TO_V1_1.md` |
| 3 | Actor / Authority / PII contracts | `docs/actors/GEI_ACTOR_MODEL_FREEZE_V1_1.md`, `docs/actors/GEI_ACTOR_AUTHORITY_BOUNDARY_MATRIX_V1_1.md`, `docs/actors/GEI_PII_MATRIX_V1_1.md` |
| 4 | Use Cases + Use Case Specs | `docs/use-cases/GEI_MASTER_USE_CASE_CATALOG_V1_1.md`, `docs/use-cases/specifications/v1_1/*` |
| 5 | State Machines / Activity / Class Model / Traceability | `docs/uml/states/*`, `docs/uml/activities/*`, `docs/uml/classes/*`, `docs/traceability/*` |
| 6 | Target UX + Domain Freezes | `docs/target-ux/*` |
| 7 | Final Implementation Gap Freeze | `docs/implementation-gap/19_MASTER_IMPLEMENTATION_FREEZE.md`, `10_MASTER_GAP_LEDGER.md`, `12_DATA_AND_DOMAIN_CONTRACT_GAPS.md`, `13_AUTHORITY_AND_PII_GAPS.md`, `21_TARGET_DRIFT_RECONCILIATION.md` |
| 8 | CURRENT code/model | `src/**` (auxiliary evidence only) |
| 9 | Historical documents | `docs/**` superseded freezes, audits, prototype reports |

### 00.3 Binding sub-authorities used to resolve same-authority conflicts

- `docs/target-ux/GEI_AUTH_RECONCILIATION_V1.0.md` resolves the two TARGET auth conflicts (`TARGET-CONFLICT-001/002`) and is referenced from the Scope Reconciliation V1.1 itself.
- `docs/uml/classes/GEI_CLASS_CATALOG_V1_1.md` (33 canonical classes) overrides `GEI_CLASS_ATTRIBUTES_V1.md` wherever the latter carries retired entities/fields.
- `docs/uml/states/GEI_STATE_MODEL_CATALOG_V1_1.md` (14 active state machines) overrides `GEI_STATE_TRANSITION_MATRIX_V1.md` rows belonging to archived machines.
- `docs/implementation-gap/21_TARGET_DRIFT_RECONCILIATION.md` decontaminates the gap ledger from OUT/DEFER scope.

### 00.4 Rule of interpretation

1. Higher authority wins; no new discussion is opened where the hierarchy resolves the conflict.
2. A field/command/relationship exists in this contract only if it is required by an active requirement, an active use case, an active state machine, an active class-model element, or an active UX data/action need.
3. `CURRENT` code never overrides a frozen contract. It is only evidence of gap volume.
4. Technical policy (algorithms, durations, attempt counts, index strategy, transport, endpoint style, framework) is out of scope. Product semantics that depend on technical limits are stated as domain rules and their numeric limits are marked `TECHNICAL POLICY`.
5. Visual composition remains iterable. Only functional information and action availability are frozen.

### 00.5 Active inventory at freeze time

| Item | Count |
|---|---|
| Active use cases | 88 |
| Active requirements (KEEP + KEEP_EDIT) | 138 |
| Active actors | 7 (6 instantiable + 1 abstract) |
| Canonical entities (persisted) | 34 |
| Persisted field contracts | ~232 |
| Derived field-level values | 32 |
| Derived views (read models) | 12 named + query contracts of §09 |
| Relationships | 34 |
| State machines | 14 |
| Commands | 73 |
| Authority rules | 18 |
| PII rules | 14 |
| Side-effect rules | 13 |
| Read contracts | 30 |
| Invariants | 35 |
| Reconciliations performed | 21 |

---

## 01 Scope

### 01.1 Scope statement

| Concept | V1 disposition | Notes |
|---|---|---|
| Person / Account / Membership / RoleAssignment / TeamAssignment | IN | Identity and authority model, §02–§03 |
| Season / Division / Line / Team / Venue | IN | Club structure, §02 |
| Competition | IN — simple context | `create`, `edit`, `archive`, `consult`; no lifecycle state machine; no `CompetitionEntry` workflow |
| Event / EventSeries / EventOccurrenceOverride / EventLogistics / EventTargetTeam / EventTargetPerson | IN | §05, §14 |
| Jornada / JornadaMatch | IN | Sport/calendar context; not moved to “Más” |
| Availability | IN | Own response only |
| Selection / SelectionRevision / SelectionEntry | IN | Draft → immutable published revisions |
| AttendanceSheet / AttendanceEntry | IN | Open/closed + correction |
| MatchRecord / PlayerMatchStats | IN | Draft → final + correction |
| Conversation / ConversationParticipant / Message | IN | DIRECT, GROUP, TEAM, EVENT |
| Announcement / AnnouncementTargetTeam | IN | Official channel with immutable published audience |
| Notification | IN | Historical occurrence of a notification-worthy fact |
| AuditEntry | IN | Append-only administrative/system traceability |
| Guardian | OUT | Actor, entity, delegation, related PII and all workflows removed |
| GuardianRelationship | OUT | Removed; no delegation model in V1 |
| Eligibility / EligibilityConstraint / EligibilityPolicy | OUT | All eligibility states, sources, reasons and authorities removed |
| CompetitionEntry | OUT | No registration entity, no TEAM/LINE scopes |
| ExternalReference | DEFER | No entity, field, command or query dependency |
| OAuth / MFA / Passkeys | OUT | Auth is email + password only |
| Self-service forgot password | OUT | Recovery is administrative |
| Notification preferences, nudges/reminders, reactions, personal timeline, group participants, attachments | DEFER | Explicitly deferred by Product Truth V1.1 |

### 01.2 Auth final (frozen exactly)

```
LOGIN
email + password

CANONICAL LOGIN EMAIL
Person.email

USERNAME
profile identity only

ACTIVATION
administrative/setup code

ACTIVATION SUCCESS
returns to Login
NO auto-login

RECOVERY
administrative setup/recovery code

SELF-SERVICE FORGOT PASSWORD
OUT OF V1

OAUTH
OUT

MFA
OUT

PASSKEYS
OUT

CHANGE PASSWORD
authenticated (current + new); credentialVersion++; optional session invalidation
```

Consequences frozen by this contract:

- `Account` has no email copy. `Account.email` is forbidden.
- `Person.email` is required for any `Person` that has an `Account`; it is unique case-insensitively among authenticable accounts.
- `username` is unique case-insensitively, stable, never a credential, login key or recovery identifier.
- Activation consumes an administrative setup code; success returns the person to Login and creates no session.
- Recovery is administrative: an administrator re-issues a setup/recovery code; the person consumes it to establish credentials. No self-service reset flow exists.

### 01.3 Non-negotiable invariants summary

1. `Person` may exist without `Account`; `Account` belongs to exactly one `Person`.
2. Authority is the union of active `RoleAssignment` scopes, evaluated server-side, default `DENY`.
3. `ADMIN` does not inherit sports authority. `CAPTAIN` does not inherit `COACH`. `SUBCOMMITTEE` is not `COACH`.
4. A `PLAYER` responds only their own `Availability`.
5. A published `SelectionRevision` is immutable; republication creates a new revision.
6. `Event` terminal states survive historical participation records.
7. An archived `Competition` cannot be selected for new assignment; historical references remain valid.
8. Team identity is `Season + Division + Line`, immutable once created.
9. Attendance correction preserves before/after; `MatchRecord` correction preserves before/after.
10. Business history and audit log are distinct and neither replaces the other.

---

## 02 Canonical Entity Model

### 02.1 Entity inventory

`TYPE` values: `AGGREGATE` (root of consistency boundary), `ENTITY` (independent persistence), `ASSOCIATION` (association entity with own identity).

| ID | Name | Domain | Purpose | Type | Persisted | Archivable | Historical | Source |
|---|---|---|---|---|---|---|---|---|
| `ENT-01` | `Person` | PPL | Human identity and canonical email authority | AGGREGATE | YES | NO | YES | PT §Core invariants 1–2; CL-01 |
| `ENT-02` | `Account` | IAM | 1:1 access record: credential, username, status | ENTITY | YES | NO | YES | PT Core 1–3; CL-02 |
| `ENT-03` | `Membership` | PPL | Period of club membership | ENTITY | YES | NO | YES | REQ-PPL-004/005; CL-03 |
| `ENT-04` | `RoleAssignment` | PPL | Role + scope + validity; authority source | ENTITY | YES | NO | YES | PT Core 4–5; CL-05 |
| `ENT-05` | `TeamAssignment` | PPL | Sport affiliation of a player to a Team | ENTITY | YES | NO | YES | REQ-PPL-005/007; CL-04 |
| `ENT-06` | `Season` | STR | Historical club season | ENTITY | YES | NO | YES | REQ-STR-001/002; CL-07 |
| `ENT-07` | `Division` | STR | Competitive level | ENTITY | YES | YES | YES | REQ-STR-002; CL-08 |
| `ENT-08` | `Line` | STR | Sport line inside a Division | ENTITY | YES | YES | YES | REQ-STR-003; CL-09 |
| `ENT-09` | `Team` | STR | Concrete season team (identity = Season+Division+Line) | ENTITY | YES | YES | YES | REQ-STR-004; CL-10 |
| `ENT-10` | `Venue` | STR | Reusable venue | ENTITY | YES | YES | YES | REQ-STR-005; CL-11 |
| `ENT-11` | `Competition` | CMP | Simple sport context for events and jornadas | ENTITY | YES | YES | YES | PT Core 8; CL-34 |
| `ENT-12` | `Event` | EVT | Central aggregate: training, match, club event | AGGREGATE | YES | NO | YES | PT Core 9; CL-12 |
| `ENT-13` | `EventSeries` | EVT | Container of recurring occurrences | ENTITY | YES | NO | YES | CL-13 |
| `ENT-14` | `EventOccurrenceOverride` | EVT | Per-occurrence override inside a series | ENTITY | YES | NO | YES | CL-14 |
| `ENT-15` | `EventLogistics` | EVT | Optional logistics of one event | ENTITY | YES | NO | YES | CL-16 |
| `ENT-16` | `EventTargetTeam` | EVT | Event ↔ Team targeting (N:M) | ASSOCIATION | YES | NO | YES | CL-17 |
| `ENT-17` | `EventTargetPerson` | EVT | Event ↔ Person targeting (N:M) | ASSOCIATION | YES | NO | YES | CL-18 |
| `ENT-18` | `Jornada` | EVT | Operational day grouping matches of one season | AGGREGATE | YES | NO | YES | PT Core 9; CL-15 |
| `ENT-19` | `JornadaMatch` | EVT | Jornada ↔ Match grouping membership | ASSOCIATION | YES | NO | YES | CL-15 |
| `ENT-20` | `Availability` | PRT | Prior response to a scheduled event | ENTITY | YES | NO | YES | CL-19 |
| `ENT-21` | `Selection` | PRT | Convocation container for one match | ENTITY | YES | NO | YES | CL-20 |
| `ENT-22` | `SelectionRevision` | PRT | Draft / immutable published publication unit | ENTITY | YES | NO | YES | CL-21 |
| `ENT-23` | `SelectionEntry` | PRT | Individual person inside a selection revision | ENTITY | YES | NO | YES | CL-22 |
| `ENT-24` | `AttendanceSheet` | PRT | Attendance container for one event | ENTITY | YES | NO | YES | CL-23 |
| `ENT-25` | `AttendanceEntry` | PRT | Attendance value with correction trail | ENTITY | YES | NO | YES | CL-24 |
| `ENT-26` | `MatchRecord` | PRT | Official match result | ENTITY | YES | NO | YES | CL-25 |
| `ENT-27` | `PlayerMatchStats` | PRT | Per-player statistics of a played match | ENTITY | YES | NO | YES | CL-26 |
| `ENT-28` | `Announcement` | COM | Official announcement | AGGREGATE | YES | YES | YES | CL-28 |
| `ENT-29` | `AnnouncementTargetTeam` | COM | Announcement ↔ Team audience membership | ASSOCIATION | YES | NO | YES | CL-29 |
| `ENT-30` | `Conversation` | COM | Communication channel (DIRECT/GROUP/TEAM/EVENT) | AGGREGATE | YES | YES | YES | CL-30 |
| `ENT-31` | `ConversationParticipant` | COM | Person ↔ Conversation membership with access period | ASSOCIATION | YES | NO | YES | CL-31 |
| `ENT-32` | `Message` | COM | Message inside a conversation | ENTITY | YES | NO | YES | CL-32 |
| `ENT-33` | `Notification` | COM | Historical occurrence of a notification-worthy fact | ENTITY | YES | NO | YES | CL-33 |
| `ENT-34` | `AuditEntry` | INS | Append-only traceability of mutations | ENTITY | YES | NO | YES | CL-37 |

**Total: 34 canonical persisted entities.** `GuardianRelationship`, `EligibilityConstraint`, `CompetitionEntry` and `ExternalReference` are not entities in V1 (§01.1). `AnnouncementRevision` is not an entity (REC-09).

### 02.2 Explicitly non-entities

The following are NOT entities and must not become tables, columns or backend resources in V1: `Guardian`, `GuardianRelationship`, `EligibilityConstraint`, `EligibilityPolicy`, `EligibilityStatus`, `CompetitionEntry`, `ExternalReference`, `AnnouncementRevision`, `Session` (technical infrastructure), `Search`, `History`, `Report` (read models only), `NotificationPreference`, `Reminder/Nudge`, `Reaction`.

---

## 03 Field Contracts

### 03.1 Conventions

- `TYPE` uses domain types only: `UUID`, `String`, `Text`, `Date`, `DateTime`, `Boolean`, `Integer`, `Decimal`, `Enum<...>`, `JSON`, `VO<...>`. No SQL precision, length or index decisions.
- `REQ` / `NULL`: required and nullable are independent (`REQ=YES,NULL=YES` means required to exist but may carry no value).
- `DEFAULT`: value applied at creation when the command does not provide one.
- `UNIQUE`: uniqueness rule or `—`.
- `MUTABILITY`: `IMMUTABLE`, `MUTABLE`, `TEMPORAL` (closed by `validUntil`), `STATE-BOUND` (mutable only in given states).
- `SOT`: source of truth entity for the value.
- `PII`: PII category or `NONE` (see §07.2 for categories and rules).
- `AUDIT/HIST`: audit requirement and business-history requirement.
- `SOURCE`: strongest authority reference.

### 03.2 People / Account / Membership / assignments

#### ENT-01 `Person`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `Person.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | Person | NONE | Audit on create | CL-01; REQ-PPL-001 |
| `Person.firstName` | String | YES | NO | — | non-empty | — | MUTABLE (self/admin) | Person | BASIC_IDENTITY | Audit on admin change | REQ-PPL-001; PII matrix |
| `Person.lastName` | String | YES | NO | — | non-empty | — | MUTABLE (self/admin) | Person | BASIC_IDENTITY | Audit on admin change | REQ-PPL-001; PII matrix |
| `Person.dni` | String | NO | YES | — | non-empty when present; partial unique when present | partial unique (non-null) | MUTABLE (admin only) | Person | DOCUMENT | Audit YES | REQ-PPL-001; PII matrix |
| `Person.birthDate` | Date | NO | YES | — | — | — | MUTABLE (admin only) | Person | BIRTH_DATA | Audit YES | REQ-PPL-001; PII matrix |
| `Person.phone` | String | NO | YES | — | non-empty when present; E.164 recommended | — | MUTABLE (self/admin) | Person | CONTACT | Audit YES | REQ-PPL-001; REQ-PPL-017 |
| `Person.email` | String | YES (when an `Account` exists) | NO (when `Account` exists) | — | valid email; canonical login identifier | unique case-insensitive among authenticable accounts | MUTABLE (self/admin) with verification before login switch | Person | CONTACT / CREDENTIAL_IDENTIFIER | Audit YES | PT Core 1; REQ-PPL-003; REQ-IAM-001 |

Derived: `fullName`, `isPlayerProfileComplete`, `hasAccount`, `activeMembership`, `activeTeamAssignments`, `activeRoleAssignments`, `effectiveRoles`, `effectiveCapabilities` (§03.4 DV-01..DV-08).

#### ENT-02 `Account`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `Account.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | Account | NONE | Audit on create | CL-02 |
| `Account.personId` | UUID | YES | NO | — | must reference an existing `Person` | UNIQUE (1:1) | IMMUTABLE | Account | NONE | Audit YES | PT Core 2; REQ-PPL-003 |
| `Account.username` | String/VO | YES | NO | — | non-empty; profile identity only | unique case-insensitive | IMMUTABLE (stable) | Account | PROFILE_IDENTITY | Audit YES | PT Core 3; REQ-IAM-014 |
| `Account.passwordHash` | String/VO | YES | YES (until setup completed) | — | hash of the credential; never returned by any read contract | — | MUTABLE (credential change/reset) | Account | SECRET | Audit YES (redacted) | REQ-IAM-005; REQ-SYS-020 |
| `Account.status` | Enum<PENDING,ACTIVE,DISABLED> | YES | NO | `PENDING` | see SM-ACCOUNT-01 | — | STATE-BOUND | Account | ACCOUNT_STATE | Audit YES | SM-ACCOUNT-01 |
| `Account.activatedAt` | DateTime | NO | YES | — | non-null iff `status=ACTIVE` | — | STATE-BOUND | Account | ACCOUNT_STATE | Audit YES | SM-ACCOUNT-01; TR-001 |
| `Account.disabledAt` | DateTime | NO | YES | — | non-null iff `status=DISABLED` | — | STATE-BOUND | Account | ACCOUNT_STATE | Audit YES | SM-ACCOUNT-01; TR-003 |
| `Account.credentialVersion` | Integer | YES | NO | `1` | ≥ 1; incremented on credential reset/change | — | MUTABLE | Account | SECURITY | Audit YES | PT §technical; REQ-IAM-005 |
| `Account.setupTokenHash` | String/VO | NO | YES | — | at most one active setup/recovery code per account; stored hashed | — | MUTABLE | Account | SECRET | Audit YES (redacted) | REQ-IAM-003; GLB-AUTH-01 |
| `Account.setupTokenExpiresAt` | DateTime | NO | YES | — | non-null iff a setup code is active | — | MUTABLE | Account | SECRET | Audit YES (redacted) | REQ-IAM-003 |
| `Account.setupTokenAttempts` | Integer | YES | NO | `0` | maximum failed attempts is TECHNICAL POLICY | — | MUTABLE | Account | SECURITY | Audit YES | REQ-IAM-003 |

Forbidden: `Account.email` — the account never stores a copy of the email address. Forbidden: any read contract that exposes `passwordHash`, `setupTokenHash` or raw tokens.

#### ENT-03 `Membership`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `Membership.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | Membership | NONE | Audit YES | CL-03 |
| `Membership.personId` | UUID | YES | NO | — | referenced `Person` exists | — | IMMUTABLE | Membership | NONE | Audit YES | REQ-PPL-004 |
| `Membership.validFrom` | Date | YES | NO | — | — | — | IMMUTABLE | Membership | NONE | Audit YES | CL-03 |
| `Membership.validUntil` | Date | NO | YES | `NULL` = open-ended | `validUntil > validFrom` when present | — | TEMPORAL (closed once) | Membership | NONE | Audit YES; history preserved | REQ-PPL-004/005 |

#### ENT-04 `RoleAssignment`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `RoleAssignment.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | RoleAssignment | NONE | Audit YES | CL-05 |
| `RoleAssignment.personId` | UUID | YES | NO | — | referenced `Person` exists | — | IMMUTABLE | RoleAssignment | NONE | Audit YES | REQ-PPL-006 |
| `RoleAssignment.role` | Enum<PLAYER,CAPTAIN,COACH,SUBCOMMITTEE,ADMIN> | YES | NO | — | one of the 5 effective roles | — | IMMUTABLE | RoleAssignment | NONE | Audit YES | PT Core 5; Actor Model V1.1 |
| `RoleAssignment.scopeType` | Enum<CLUB,TEAM,EVENT> | YES | NO | — | combination with `role` must be valid (`INVALID_ROLE_SCOPE`) | — | IMMUTABLE | RoleAssignment | NONE | Audit YES | Actor Model V1.1; REC-08 |
| `RoleAssignment.scopeRefId` | UUID | NO | YES (only for `CLUB`) | — | required for `TEAM`/`EVENT`; must reference the scoped object | — | IMMUTABLE | RoleAssignment | NONE | Audit YES | Actor Model V1.1 |
| `RoleAssignment.validFrom` | DateTime | YES | NO | — | — | — | IMMUTABLE | RoleAssignment | NONE | Audit YES | CL-05 |
| `RoleAssignment.validUntil` | DateTime | NO | YES | `NULL` = open-ended | `validUntil > validFrom` | — | TEMPORAL (closed once) | RoleAssignment | NONE | Audit YES | REQ-PPL-010 |
| `RoleAssignment.temporalExclusions` | DateTime[] | NO | YES | empty | periods inside validity during which the role is not effective | — | MUTABLE | RoleAssignment | NONE | Audit YES | CL-05 attributes |

Scope validity (frozen): `PLAYER→TEAM`, `CAPTAIN→TEAM`, `COACH→TEAM|EVENT`, `SUBCOMMITTEE→CLUB`, `ADMIN→CLUB`. Any other combination is rejected with `INVALID_ROLE_SCOPE`. `LINE` scope does not exist in V1 (REC-08).

#### ENT-05 `TeamAssignment`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `TeamAssignment.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | TeamAssignment | NONE | Audit YES | CL-04 |
| `TeamAssignment.personId` | UUID | YES | NO | — | referenced `Person` exists | — | IMMUTABLE | TeamAssignment | NONE | Audit YES | REQ-PPL-005 |
| `TeamAssignment.teamId` | UUID | YES | NO | — | referenced `Team` exists | — | IMMUTABLE | TeamAssignment | NONE | Audit YES | REQ-PPL-005 |
| `TeamAssignment.validFrom` | Date | YES | NO | — | — | — | IMMUTABLE | TeamAssignment | NONE | Audit YES | CL-04 |
| `TeamAssignment.validUntil` | Date | NO | YES | `NULL` = open-ended | `validUntil > validFrom` | — | TEMPORAL (closed once) | TeamAssignment | NONE | Audit YES | REQ-PPL-008 |

### 03.3 Club structure and competition

#### ENT-06 `Season`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `Season.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | Season | NONE | Audit YES | CL-07 |
| `Season.name` | String | YES | NO | — | non-empty | UNIQUE | MUTABLE | Season | NONE | Audit YES | REQ-STR-001 |
| `Season.startDate` | Date | YES | NO | — | — | — | MUTABLE | Season | NONE | Audit YES | REQ-STR-001; CL-07 |
| `Season.endDate` | Date | YES | NO | — | `endDate ≥ startDate` | — | MUTABLE | Season | NONE | Audit YES | REQ-STR-001; CL-07 |

#### ENT-07 `Division`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `Division.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | Division | NONE | Audit YES | CL-08 |
| `Division.name` | String | YES | NO | — | non-empty; rename rejected while active Teams exist | — | MUTABLE (guard) | Division | NONE | Audit YES | REQ-STR-002; REQ-PPL-014 |
| `Division.archivedAt` | DateTime | NO | YES | `NULL` = active | non-null ⇒ archived | — | STATE-BOUND | Division | NONE | Audit YES; history preserved | SM-DIVISION-01 |

#### ENT-08 `Line`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `Line.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | Line | NONE | Audit YES | CL-09 |
| `Line.divisionId` | UUID | YES | NO | — | referenced `Division` exists | — | IMMUTABLE | Line | NONE | Audit YES | REQ-STR-003 |
| `Line.name` | String | YES | NO | — | non-empty; rename rejected while active Teams exist | — | MUTABLE (guard) | Line | NONE | Audit YES | REQ-STR-003; REQ-PPL-014 |
| `Line.archivedAt` | DateTime | NO | YES | `NULL` = active | non-null ⇒ archived | — | STATE-BOUND | Line | NONE | Audit YES; history preserved | SM-LINE-01 |

#### ENT-09 `Team`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `Team.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | Team | NONE | Audit YES | CL-10 |
| `Team.seasonId` | UUID | YES | NO | — | referenced `Season` exists | UNIQUE with `divisionId`+`lineId` | IMMUTABLE | Team | NONE | Audit YES | REQ-STR-004 |
| `Team.divisionId` | UUID | YES | NO | — | referenced `Division` exists | UNIQUE with `seasonId`+`lineId` | IMMUTABLE | Team | NONE | Audit YES | REQ-STR-004 |
| `Team.lineId` | UUID | YES | NO | — | referenced `Line` exists | UNIQUE with `seasonId`+`divisionId` | IMMUTABLE | Team | NONE | Audit YES | REQ-STR-004; REQ-PPL-014 |
| `Team.status` | Enum<DRAFT,ACTIVE,ARCHIVED> | YES | NO | `DRAFT` | SM-TEAM-01 | — | STATE-BOUND | Team | NONE | Audit YES | SM-TEAM-01 |
| `Team.archivedAt` | DateTime | NO | YES | `NULL` | non-null iff `status=ARCHIVED` | — | STATE-BOUND | Team | NONE | Audit YES; history preserved | SM-TEAM-01 |

Identity rule: `Season + Division + Line` is the immutable identity of a Team. `Team.name` is derived (DV-09) and is never stored as an independent editable value.

#### ENT-10 `Venue`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `Venue.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | Venue | NONE | Audit YES | CL-11 |
| `Venue.name` | String | YES | NO | — | non-empty | — | MUTABLE (metadata correction only) | Venue | NONE | Audit YES | REQ-STR-005; REQ-STR-012 (A) |
| `Venue.address` | String | YES | NO | — | non-empty | — | MUTABLE (metadata correction only) | Venue | NONE | Audit YES | REQ-STR-005; REQ-STR-012 (A) |
| `Venue.fieldLabel` | String | NO | YES | — | — | — | MUTABLE (metadata correction only) | Venue | NONE | Audit YES | REQ-STR-005; CL-11 |
| `Venue.archivedAt` | DateTime | NO | YES | `NULL` = active | non-null ⇒ archived | — | STATE-BOUND | Venue | NONE | Audit YES; history preserved | SM-VENUE-01 |

Rule A/B is frozen: editing `Venue` identity/metadata does not reschedule events, does not increment any coordination revision and does not notify. Changing the venue assigned to an `Event` is a material event change (§05.2).

#### ENT-11 `Competition`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `Competition.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | Competition | NONE | Audit YES | REQ-CMP-001; CL-34 |
| `Competition.name` | String | YES | NO | — | non-empty | — | MUTABLE | Competition | NONE | Audit YES | REQ-CMP-001 |
| `Competition.seasonId` | UUID | YES | NO | — | referenced `Season` exists | — | MUTABLE | Competition | NONE | Audit YES | CL-34; REQ-CMP-001 |
| `Competition.archivedAt` | DateTime | NO | YES | `NULL` = active | non-null ⇒ archived; archived Competition cannot be selected for new assignment | — | MUTABLE | Competition | NONE | Audit YES; history preserved | REQ-CMP-002; INV-10 |

`Competition` has **no lifecycle state machine**: archive is a flag, not a `DRAFT/ACTIVE/CLOSED` lifecycle (REC-06).

### 03.4 Events and calendar

#### ENT-12 `Event`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `Event.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | Event | NONE | Audit YES | CL-12 |
| `Event.type` | Enum<TRAINING,MATCH,CLUB_EVENT> | YES | NO | — | discriminates sub-type invariants | — | IMMUTABLE | Event | NONE | Audit YES | REQ-EVT-001..004 |
| `Event.title` | String | YES | NO | — | non-empty | — | STATE-BOUND (non-material editable) | Event | NONE | Audit YES | REQ-EVT-002/003/004; REQ-EVT-010 |
| `Event.startAt` | DateTime | NO | YES | — | required when state ∈ {SCHEDULED,IN_PROGRESS,COMPLETED}; `endAt > startAt` when both present | — | STATE-BOUND | Event | NONE | Audit YES | REQ-EVT-001 |
| `Event.endAt` | DateTime | NO | YES | — | required when state ∈ {SCHEDULED,IN_PROGRESS,COMPLETED}; `endAt > startAt` | — | STATE-BOUND | Event | NONE | Audit YES | REQ-EVT-001 |
| `Event.timeZone` | String | YES | NO | club default | valid IANA tz | — | STATE-BOUND (material) | Event | NONE | Audit YES | REQ-STR-007 |
| `Event.venueId` | UUID | NO | YES | — | referenced `Venue` exists | — | STATE-BOUND (material) | Event | NONE | Audit YES | REQ-EVT-002..004 |
| `Event.state` | Enum<DRAFT,SCHEDULED,POSTPONED,CANCELLED,IN_PROGRESS,COMPLETED,ABANDONED> | YES | NO | `SCHEDULED` | SM-EVENT-01; `DRAFT` is non-observable atomic intermediate | — | STATE-BOUND | Event | NONE | Audit YES; history | SM-EVENT-01 |
| `Event.clubWideTarget` | Boolean | YES | NO | `false` | if true ⇒ no target rows; if false ⇒ ≥1 target row | — | STATE-BOUND (material) | Event | NONE | Audit YES | PT §10; CL-12 |
| `Event.seriesId` | UUID | NO | YES | — | referenced `EventSeries` exists | — | IMMUTABLE | Event | NONE | Audit YES | REQ-EVT-014 |
| `Event.occurrenceIndex` | Integer | NO | YES | — | index inside series when `seriesId ≠ NULL` | — | IMMUTABLE | Event | NONE | Audit YES | CL-12 |
| `Event.coordinationRevision` | Integer | YES | NO | `0` | incremented on every material change | — | STATE-BOUND (increment only) | Event | NONE | Audit YES; history | REQ-EVT-011; PT §11 |
| `Event.creatorPersonId` | UUID | YES | NO | — | referenced `Person` exists | — | IMMUTABLE | Event | NONE | Audit YES | CL-12 |
| `Event.createdAt` | DateTime | YES | NO | generated | — | — | IMMUTABLE | Event | NONE | Audit YES | CL-12 |
| `Event.updatedAt` | DateTime | YES | NO | generated | — | — | MUTABLE | Event | NONE | Audit YES | CL-12 |
| `Event.version` | Integer | YES | NO | `1` | ≥ 1; optimistic concurrency | — | MUTABLE | Event | NONE | Audit YES | PT §27; REQ-EVT-013 |
| `Event.competitionId` | UUID | NO | YES | — | referenced `Competition` exists; allowed only when `type=MATCH` | — | STATE-BOUND (material) | Event | NONE | Audit YES | PT Core 8; REQ-EVT-024 |
| `Event.opponent` | String | NO | YES | — | non-empty; required when `type=MATCH` | — | STATE-BOUND (material) | Event | NONE | Audit YES | REQ-EVT-003; PT §10 |

Type-specific invariants:
- `TRAINING`: `clubWideTarget=true` or ≥1 `EventTargetTeam`; 0 `EventTargetPerson`; no `opponent`, no `competitionId`.
- `MATCH`: exactly 1 `EventTargetTeam`, 0 `EventTargetPerson`, `clubWideTarget=false`, `opponent` required, `competitionId` optional.
- `CLUB_EVENT`: `clubWideTarget=true` or ≥1 `EventTargetTeam`/`EventTargetPerson`; no `opponent`, no `competitionId`.

Derived: `concreteTeam` (the unique team target of a MATCH, immutable once `SCHEDULED`), `eventStatusLabel`, `isTerminal`, `materialityFlags`, `resolvedAudience`, `nextOccurrenceIndex` (§03.7 DV-11..DV-13, DV-29).

#### ENT-13 `EventSeries`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `EventSeries.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | EventSeries | NONE | Audit YES | CL-13 |
| `EventSeries.name` | String | YES | NO | — | non-empty | — | MUTABLE | EventSeries | NONE | Audit YES | REQ-EVT-014 |
| `EventSeries.state` | Enum<ACTIVE,ENDED> | YES | NO | `ACTIVE` | SM-EVENTSERIES-01 | — | STATE-BOUND | EventSeries | NONE | Audit YES | SM-EVENTSERIES-01 |
| `EventSeries.recurrenceRule` | String | YES | NO | — | valid RRULE (RFC 5545) or equivalent | — | MUTABLE | EventSeries | NONE | Audit YES | REQ-EVT-014 |
| `EventSeries.maxOccurrences` | Integer | NO | YES | `366` (technical policy) | `1 ≤ maxOccurrences ≤ 366` | — | MUTABLE | EventSeries | NONE | Audit YES | REQ-EVT-016; TECHNICAL POLICY |

`EventSeriesTargetTeam` and `EventSeriesTargetPerson` are **not entities** in V1 (REC-16). Series targeting is materialized on each occurrence `Event` via `EventTargetTeam`/`EventTargetPerson`. Series-level audience is derived from its occurrences.

#### ENT-14 `EventOccurrenceOverride`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `EventOccurrenceOverride.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | EventOccurrenceOverride | NONE | Audit YES | CL-14 |
| `EventOccurrenceOverride.seriesId` | UUID | YES | NO | — | referenced `EventSeries` exists | — | IMMUTABLE | EventOccurrenceOverride | NONE | Audit YES | CL-14 |
| `EventOccurrenceOverride.occurrenceIndex` | Integer | YES | NO | — | — | — | IMMUTABLE | EventOccurrenceOverride | NONE | Audit YES | CL-14 |
| `EventOccurrenceOverride.overriddenEventId` | UUID | NO | YES | — | referenced `Event` exists when already generated | — | IMMUTABLE | EventOccurrenceOverride | NONE | Audit YES | CL-14 |
| `EventOccurrenceOverride.customTitle` | String | NO | YES | — | — | — | MUTABLE | EventOccurrenceOverride | NONE | Audit YES | CL-14 |
| `EventOccurrenceOverride.customStartAt` | DateTime | NO | YES | — | — | — | MUTABLE | EventOccurrenceOverride | NONE | Audit YES | CL-14 |
| `EventOccurrenceOverride.customEndAt` | DateTime | NO | YES | — | — | — | MUTABLE | EventOccurrenceOverride | NONE | Audit YES | CL-14 |
| `EventOccurrenceOverride.customVenueId` | UUID | NO | YES | — | — | — | MUTABLE | EventOccurrenceOverride | NONE | Audit YES | CL-14 |
| `EventOccurrenceOverride.isCancelled` | Boolean | YES | NO | `false` | — | — | MUTABLE | EventOccurrenceOverride | NONE | Audit YES | CL-14 |

#### ENT-15 `EventLogistics`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `EventLogistics.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | EventLogistics | NONE | Audit YES | CL-16 |
| `EventLogistics.eventId` | UUID | YES | NO | — | referenced `Event` exists | UNIQUE (0..1 per Event) | IMMUTABLE | EventLogistics | NONE | Audit YES | REQ-EVT-019 |
| `EventLogistics.meetingAt` | DateTime | NO | YES | — | — | — | MUTABLE | EventLogistics | NONE | Audit YES | REQ-EVT-019 |
| `EventLogistics.departureAt` | DateTime | NO | YES | — | — | — | MUTABLE | EventLogistics | NONE | Audit YES | REQ-EVT-019 |
| `EventLogistics.meetingPoint` | String | NO | YES | — | — | — | MUTABLE | EventLogistics | NONE | Audit YES | REQ-EVT-019 |
| `EventLogistics.transportNote` | Text | NO | YES | — | — | — | MUTABLE | EventLogistics | NONE | Audit YES | REQ-EVT-019 |
| `EventLogistics.arrivalInstructions` | Text | NO | YES | — | — | — | MUTABLE | EventLogistics | NONE | Audit YES | REQ-EVT-019 |

Logistics are optional per event; authority: `CAPTAIN` (TEAM), `COACH` (TEAM/EVENT), `SUBCOMMITTEE` (CLUB). Logistics change = material event change.

#### ENT-16 `EventTargetTeam` (association)

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `EventTargetTeam.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | EventTargetTeam | NONE | Audit YES | CL-17 |
| `EventTargetTeam.eventId` | UUID | YES | NO | — | referenced `Event` exists | — | IMMUTABLE | EventTargetTeam | NONE | Audit YES | CL-17 |
| `EventTargetTeam.teamId` | UUID | YES | NO | — | referenced `Team` exists | — | IMMUTABLE | EventTargetTeam | NONE | Audit YES | CL-17 |
| `EventTargetTeam.addedAt` | DateTime | YES | NO | generated | — | — | IMMUTABLE | EventTargetTeam | NONE | Audit YES | CL-17 |
| `EventTargetTeam.addedByPersonId` | UUID | YES | NO | — | referenced `Person` exists | — | IMMUTABLE | EventTargetTeam | NONE | Audit YES | CL-17 |

#### ENT-17 `EventTargetPerson` (association)

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `EventTargetPerson.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | EventTargetPerson | NONE | Audit YES | CL-18 |
| `EventTargetPerson.eventId` | UUID | YES | NO | — | referenced `Event` exists | — | IMMUTABLE | EventTargetPerson | NONE | Audit YES | CL-18 |
| `EventTargetPerson.personId` | UUID | YES | NO | — | referenced `Person` exists | — | IMMUTABLE | EventTargetPerson | NONE | Audit YES | CL-18 |
| `EventTargetPerson.addedAt` | DateTime | YES | NO | generated | — | — | IMMUTABLE | EventTargetPerson | NONE | Audit YES | CL-18 |
| `EventTargetPerson.addedByPersonId` | UUID | YES | YES | — | referenced `Person` exists | — | IMMUTABLE | EventTargetPerson | NONE | Audit YES | CL-18 |

#### ENT-18 `Jornada`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `Jornada.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | Jornada | NONE | Audit YES | CL-15 |
| `Jornada.seasonId` | UUID | YES | NO | — | referenced `Season` exists | — | IMMUTABLE | Jornada | NONE | Audit YES | REQ-EVT-018 |
| `Jornada.competitionId` | UUID | NO | YES | — | referenced `Competition` exists | — | IMMUTABLE | Jornada | NONE | Audit YES | REQ-EVT-024; PT Core 8 |
| `Jornada.name` | String | YES | NO | — | non-empty | — | MUTABLE | Jornada | NONE | Audit YES | REQ-EVT-018 |
| `Jornada.date` | Date | YES | NO | — | — | — | IMMUTABLE | Jornada | NONE | Audit YES | REQ-EVT-018 |

Invariant: all `JornadaMatch` entries must have `Event.seasonId = Jornada.seasonId` and `Event.type=MATCH`. If `Jornada.competitionId` is set, each match's `competitionId` must be null or equal to it. Bulk scheduling ≤ 100 matches (TECHNICAL POLICY).

#### ENT-19 `JornadaMatch` (association)

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `JornadaMatch.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | JornadaMatch | NONE | Audit YES | CL-15 attributes; TX R-24 |
| `JornadaMatch.jornadaId` | UUID | YES | NO | — | referenced `Jornada` exists | — | IMMUTABLE | JornadaMatch | NONE | Audit YES | REC-17 |
| `JornadaMatch.eventId` | UUID | YES | NO | — | referenced `Event` exists (`type=MATCH`) | UNIQUE (one match belongs to at most one jornada) | IMMUTABLE | JornadaMatch | NONE | Audit YES | REC-17 |

### 03.5 Participation

#### ENT-20 `Availability`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `Availability.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | Availability | NONE | Audit YES | CL-19 |
| `Availability.eventId` | UUID | YES | NO | — | referenced `Event` exists; `Event.state=SCHEDULED` | — | IMMUTABLE | Availability | NONE | Audit YES | REQ-PRT-001 |
| `Availability.personId` | UUID | YES | NO | — | referenced `Person` exists (the player) | — | IMMUTABLE | Availability | NONE | Audit YES | REQ-PRT-001 |
| `Availability.value` | Enum<YES,MAYBE,NO> | YES | NO | — | one of the three | — | MUTABLE (change substitutes) | Availability | NONE | Audit YES; history | SM-AVAILABILITY-01 |
| `Availability.respondedAt` | DateTime | YES | NO | generated | — | — | IMMUTABLE | Availability | NONE | Audit YES | REQ-PRT-001 |
| `Availability.coordinationRevision` | Integer | YES | NO | `Event.coordinationRevision` at response time | — | — | IMMUTABLE | Availability | NONE | Audit YES; derives NEEDS_RECONFIRMATION | REQ-PRT-003 |

Derived: `Availability.state` = `value` if row exists, else `NO_RESPONSE`; if `value ≠ NULL` and `coordinationRevision < Event.coordinationRevision` ⇒ `NEEDS_RECONFIRMATION` (SM-AVAILABILITY-01). No guardian delegation (OUT). Participation applicability: `Availability` applies to `TRAINING`, `MATCH`, `CLUB_EVENT` (PT §12).

#### ENT-21 `Selection`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `Selection.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | Selection | NONE | Audit YES | CL-20 |
| `Selection.matchId` | UUID | YES | NO | — | referenced `Event` exists; `type=MATCH` | UNIQUE (one selection per match) | IMMUTABLE | Selection | NONE | Audit YES | REQ-PRT-005 |
| `Selection.currentDraftRevisionId` | UUID | NO | YES | — | referenced `SelectionRevision` in `DRAFT` state | — | MUTABLE | Selection | NONE | Audit YES | CL-20 |

#### ENT-22 `SelectionRevision`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `SelectionRevision.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | SelectionRevision | NONE | Audit YES | CL-21 |
| `SelectionRevision.selectionId` | UUID | YES | NO | — | referenced `Selection` exists | — | IMMUTABLE | SelectionRevision | NONE | Audit YES | CL-21 |
| `SelectionRevision.state` | Enum<DRAFT,PUBLISHED> | YES | NO | `DRAFT` | SM-SELECTIONREV-01 | — | STATE-BOUND | SelectionRevision | NONE | Audit YES; history immutable | SM-SELECTIONREV-01 |
| `SelectionRevision.publishedAt` | DateTime | NO | YES | — | non-null iff `state=PUBLISHED` | — | IMMUTABLE | SelectionRevision | NONE | Audit YES | SM-SELECTIONREV-01 |
| `SelectionRevision.publishedByPersonId` | UUID | NO | YES | — | referenced `Person` (COACH) | — | IMMUTABLE | SelectionRevision | NONE | Audit YES | CL-21 |
| `SelectionRevision.autosaveVersion` | Integer | NO | YES | `0` | ≥ 0; concurrency control for draft | — | MUTABLE (draft only) | SelectionRevision | NONE | Audit YES | REQ-PRT-008; REQ-SYS-018 |

`DRAFT` is editable with autosave (600ms TECHNICAL POLICY); `PUBLISHED` is immutable. Republication = new `PUBLISHED` revision. Conflicts surviving in V1: `NO_LONGER_EVENT_TARGET`, `NO_LONGER_TEAM_AFFILIATED` (derived, do not block publication).

#### ENT-23 `SelectionEntry`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `SelectionEntry.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | SelectionEntry | NONE | Audit YES | CL-22 |
| `SelectionEntry.revisionId` | UUID | YES | NO | — | referenced `SelectionRevision` exists | — | IMMUTABLE | SelectionEntry | NONE | Audit YES | CL-22 |
| `SelectionEntry.personId` | UUID | YES | NO | — | referenced `Person` exists | — | IMMUTABLE (in `PUBLISHED`) | SelectionEntry | NONE | Audit YES; history immutable | CL-22 |
| `SelectionEntry.role` | Enum<SELECTED,ALTERNATE> | YES | NO | — | vocabulario club canónico V1 | — | MUTABLE (draft); IMMUTABLE (published) | SelectionEntry | NONE | Audit YES | CL-22 |
| `SelectionEntry.order` | Integer | NO | YES | — | ordering in convocation | — | MUTABLE (draft) | SelectionEntry | NONE | Audit YES | CL-22 |

#### ENT-24 `AttendanceSheet`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `AttendanceSheet.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | AttendanceSheet | NONE | Audit YES | CL-23 |
| `AttendanceSheet.eventId` | UUID | YES | NO | — | referenced `Event` exists; `type ∈ {TRAINING,MATCH}` | UNIQUE (0..1 per event) | IMMUTABLE | AttendanceSheet | NONE | Audit YES | REQ-PRT-009 |
| `AttendanceSheet.closedAt` | DateTime | NO | YES | `NULL` = OPEN | non-null ⇒ CLOSED | — | STATE-BOUND | AttendanceSheet | NONE | Audit YES | SM-ATTENDANCEENTRY-01 |
| `AttendanceSheet.closedByPersonId` | UUID | NO | YES | — | referenced `Person` (COACH) | — | STATE-BOUND | AttendanceSheet | NONE | Audit YES | REQ-PRT-011 |

Participation applicability: `Attendance` applies to `TRAINING`, `MATCH` (PT §12).

#### ENT-25 `AttendanceEntry`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `AttendanceEntry.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | AttendanceEntry | NONE | Audit YES | CL-24 |
| `AttendanceEntry.sheetId` | UUID | YES | NO | — | referenced `AttendanceSheet` exists | — | IMMUTABLE | AttendanceEntry | NONE | Audit YES | REQ-PRT-009 |
| `AttendanceEntry.personId` | UUID | YES | NO | — | referenced `Person` exists | — | IMMUTABLE | AttendanceEntry | NONE | Audit YES | REQ-PRT-009 |
| `AttendanceEntry.value` | Enum<PRESENT,ABSENT,JUSTIFIED> | NO | YES | `NULL` = UNRECORRED | one of the three | — | MUTABLE (correction) | AttendanceEntry | NONE | Audit YES; history preserves before/after | SM-ATTENDANCEENTRY-01 |
| `AttendanceEntry.recordedAt` | DateTime | NO | YES | — | non-null iff `value ≠ NULL` | — | STATE-BOUND | AttendanceEntry | NONE | Audit YES | REQ-PRT-009 |
| `AttendanceEntry.recordedByPersonId` | UUID | NO | YES | — | referenced `Person` (COACH) | — | STATE-BOUND | AttendanceEntry | NONE | Audit YES | CL-24 |
| `AttendanceEntry.correctedAt` | DateTime | NO | YES | — | non-null iff corrected | — | MUTABLE | AttendanceEntry | NONE | Audit YES | REQ-PRT-012 |
| `AttendanceEntry.correctedByPersonId` | UUID | NO | YES | — | referenced `Person` (COACH) | — | MUTABLE | AttendanceEntry | NONE | Audit YES | REQ-PRT-012 |
| `AttendanceEntry.correctionReason` | String | NO | YES | — | required on correction | — | MUTABLE | AttendanceEntry | NONE | Audit YES | REQ-PRT-012 |
| `AttendanceEntry.previousValue` | Enum<PRESENT,ABSENT,JUSTIFIED> | NO | YES | — | value before correction | — | MUTABLE | AttendanceEntry | NONE | Audit YES | REQ-PRT-012 |

Derived: `AttendanceEntry.state` = `value` if `value ≠ NULL`, else `UNRECORRED`. `UNRECORRED` ≠ `ABSENT`. Correction preserves before/after; `closedAt` blocks direct marking (no reopening invented; correction is the only path).

#### ENT-26 `MatchRecord`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `MatchRecord.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | MatchRecord | NONE | Audit YES | CL-25 |
| `MatchRecord.matchId` | UUID | YES | NO | — | referenced `Event` exists; `type=MATCH` | UNIQUE (one record per match) | IMMUTABLE | MatchRecord | NONE | Audit YES | REQ-PRT-013 |
| `MatchRecord.state` | Enum<DRAFT,FINAL> | YES | NO | `DRAFT` | SM-MATCHRECORD-01 | — | STATE-BOUND | MatchRecord | NONE | Audit YES; history | SM-MATCHRECORD-01 |
| `MatchRecord.resultType` | Enum<PLAYED,FORFEIT,ABANDONED> | NO | YES | — | required iff `state=FINAL` | — | STATE-BOUND | MatchRecord | NONE | Audit YES | REQ-PRT-013/015 |
| `MatchRecord.homeScore` | Integer | NO | YES | — | ≥ 0 | — | STATE-BOUND | MatchRecord | NONE | Audit YES | REQ-PRT-013 |
| `MatchRecord.awayScore` | Integer | NO | YES | — | ≥ 0 | — | STATE-BOUND | MatchRecord | NONE | Audit YES | REQ-PRT-013 |
| `MatchRecord.observations` | Text | NO | YES | — | — | — | MUTABLE | MatchRecord | NONE | Audit YES | REQ-PRT-013 |
| `MatchRecord.finalizedAt` | DateTime | NO | YES | — | non-null iff `state=FINAL` | — | STATE-BOUND | MatchRecord | NONE | Audit YES | SM-MATCHRECORD-01 |
| `MatchRecord.finalizedByPersonId` | UUID | NO | YES | — | referenced `Person` (COACH) | — | STATE-BOUND | MatchRecord | NONE | Audit YES | CL-25 |
| `MatchRecord.correctedAt` | DateTime | NO | YES | — | non-null iff corrected | — | MUTABLE | MatchRecord | NONE | Audit YES | REQ-PRT-014 |
| `MatchRecord.correctedByPersonId` | UUID | NO | YES | — | referenced `Person` (COACH) | — | MUTABLE | MatchRecord | NONE | Audit YES | REQ-PRT-014 |
| `MatchRecord.correctionReason` | String | NO | YES | — | required on correction | — | MUTABLE | MatchRecord | NONE | Audit YES | REQ-PRT-014 |
| `MatchRecord.previousResultType` | Enum<PLAYED,FORFEIT,ABANDONED> | NO | YES | — | value before correction | — | MUTABLE | MatchRecord | NONE | Audit YES | REQ-PRT-014 |
| `MatchRecord.previousHomeScore` | Integer | NO | YES | — | value before correction | — | MUTABLE | MatchRecord | NONE | Audit YES | REQ-PRT-014 |
| `MatchRecord.previousAwayScore` | Integer | NO | YES | — | value before correction | — | MUTABLE | MatchRecord | NONE | Audit YES | REQ-PRT-014 |

Compatibility: `PLAYED/FORFEIT` ⇒ `Event.COMPLETED`; `ABANDONED` ⇒ `Event.ABANDONED`. Correction is a separate operation, not a state transition back to `DRAFT`. Statistics only for `PLAYED`. `matchesPlayed` is derived from `MatchRecord.resultType = PLAYED`.

#### ENT-27 `PlayerMatchStats`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `PlayerMatchStats.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | PlayerMatchStats | NONE | Audit YES | CL-26 |
| `PlayerMatchStats.matchRecordId` | UUID | YES | NO | — | referenced `MatchRecord` exists | — | IMMUTABLE | PlayerMatchStats | NONE | Audit YES | CL-26 |
| `PlayerMatchStats.personId` | UUID | YES | NO | — | referenced `Person` exists | UNIQUE with `matchRecordId` | IMMUTABLE | PlayerMatchStats | NONE | Audit YES | CL-26 |
| `PlayerMatchStats.minutesPlayed` | Integer | NO | YES | — | ≥ 0 | — | MUTABLE (while `DRAFT`) | PlayerMatchStats | NONE | Audit YES | CL-26 |
| `PlayerMatchStats.goals` | Integer | NO | YES | — | ≥ 0 | — | MUTABLE (while `DRAFT`) | PlayerMatchStats | NONE | Audit YES | CL-26 |
| `PlayerMatchStats.assists` | Integer | NO | YES | — | ≥ 0 | — | MUTABLE (while `DRAFT`) | PlayerMatchStats | NONE | Audit YES | CL-26 |
| `PlayerMatchStats.yellowCards` | Integer | NO | YES | — | ≥ 0 | — | MUTABLE (while `DRAFT`) | PlayerMatchStats | NONE | Audit YES | CL-26 |
| `PlayerMatchStats.redCards` | Integer | NO | YES | — | ≥ 0 | — | MUTABLE (while `DRAFT`) | PlayerMatchStats | NONE | Audit YES | CL-26 |
| `PlayerMatchStats.mvp` | Boolean | NO | YES | `false` | — | — | MUTABLE (while `DRAFT`) | PlayerMatchStats | NONE | Audit YES | CL-26 |

Statistics are mutable while `MatchRecord.state=DRAFT`, frozen on `FINAL`.

### 03.6 Communication

#### ENT-28 `Announcement`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `Announcement.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | Announcement | NONE | Audit YES | CL-28 |
| `Announcement.title` | String | YES | NO | — | non-empty | — | MUTABLE | Announcement | NONE | Audit YES | REQ-COM-001 |
| `Announcement.body` | Text | YES | NO | — | non-empty | — | MUTABLE | Announcement | NONE | Audit YES | REQ-COM-001 |
| `Announcement.state` | Enum<DRAFT,PUBLISHED,ARCHIVED> | YES | NO | `DRAFT` | SM-ANNOUNCEMENT-01 | — | STATE-BOUND | Announcement | NONE | Audit YES | SM-ANNOUNCEMENT-01 |
| `Announcement.publishedAt` | DateTime | NO | YES | — | non-null iff `state=PUBLISHED` | — | IMMUTABLE | Announcement | NONE | Audit YES | SM-ANNOUNCEMENT-01 |
| `Announcement.publishedByPersonId` | UUID | NO | YES | — | referenced `Person` (SUBCOMMITTEE) | — | IMMUTABLE | Announcement | NONE | Audit YES | REQ-COM-001 |
| `Announcement.archivedAt` | DateTime | NO | YES | — | non-null iff `state=ARCHIVED` | — | STATE-BOUND | Announcement | NONE | Audit YES | SM-ANNOUNCEMENT-01 |
| `Announcement.revision` | Integer | YES | NO | `1` | ≥ 1; increments on correction | — | MUTABLE | Announcement | NONE | Audit YES | REC-09; COM-016 |

Audience is defined by `AnnouncementTargetTeam` rows. At `PUBLISHED`, the set is frozen (immutable snapshot). `clubWide` is derived: `targetTeams` empty ⇒ club-wide. Correction modifies `title`/`body` only; `revision` increments; audience never changes. No `AnnouncementRevision` entity (REC-09). Read acknowledgement is represented by `Notification.readAt` of type `ANNOUNCEMENT_PUBLISHED` (REC-10).

#### ENT-29 `AnnouncementTargetTeam` (association)

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `AnnouncementTargetTeam.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | AnnouncementTargetTeam | NONE | Audit YES | CL-29 |
| `AnnouncementTargetTeam.announcementId` | UUID | YES | NO | — | referenced `Announcement` exists | — | IMMUTABLE | AnnouncementTargetTeam | NONE | Audit YES | CL-29 |
| `AnnouncementTargetTeam.teamId` | UUID | YES | NO | — | referenced `Team` exists | UNIQUE per announcement | IMMUTABLE | AnnouncementTargetTeam | NONE | Audit YES | CL-29 |

#### ENT-30 `Conversation`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `Conversation.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | Conversation | NONE | Audit YES | CL-30 |
| `Conversation.type` | Enum<DIRECT,GROUP,TEAM,EVENT> | YES | NO | — | one of the four | — | IMMUTABLE | Conversation | NONE | Audit YES | REQ-COM-006..008 |
| `Conversation.title` | String | NO | YES | — | required for `GROUP`; derived for `TEAM`/`EVENT` | — | STATE-BOUND | Conversation | NONE | Audit YES | REQ-COM-007/008 |
| `Conversation.state` | Enum<ACTIVE,ARCHIVED> | NO | YES | `ACTIVE` | only `GROUP` has lifecycle; others derive from membership | — | STATE-BOUND (GROUP only) | Conversation | NONE | Audit YES | SM-CONVERSATION-GROUP-01 |
| `Conversation.directPairKey` | VO<String> | NO | YES | — | only for `DIRECT`; `{unique}` partial | PARTIAL UNIQUE | IMMUTABLE | Conversation | NONE | Audit YES | REQ-COM-006 |
| `Conversation.teamId` | UUID | NO | YES | — | only for `TEAM`; `{unique}` | UNIQUE | IMMUTABLE | Conversation | NONE | Audit YES | REQ-COM-008 |
| `Conversation.eventId` | UUID | NO | YES | — | only for `EVENT`; `{unique}` | UNIQUE | IMMUTABLE | Conversation | NONE | Audit YES | REQ-COM-008 |
| `Conversation.createdAt` | DateTime | YES | NO | generated | — | — | IMMUTABLE | Conversation | NONE | Audit YES | CL-30 |
| `Conversation.createdByPersonId` | UUID | YES | NO | — | referenced `Person` exists | — | IMMUTABLE | Conversation | NONE | Audit YES | CL-30 |

Canonical rules:
- `DIRECT`: exactly one per unordered pair of persons (`directPairKey` unique partial).
- `GROUP`: multiple allowed, title required, archivable.
- `TEAM`: at most one per `Team` (`teamId` unique); membership synced server-side from `TeamAssignment`/`RoleAssignment`.
- `EVENT`: at most one per `Event` (`eventId` unique); membership synced server-side from `EventTargetTeam`/`EventTargetPerson`.

#### ENT-31 `ConversationParticipant` (association)

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `ConversationParticipant.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | ConversationParticipant | NONE | Audit YES | CL-31 |
| `ConversationParticipant.conversationId` | UUID | YES | NO | — | referenced `Conversation` exists | — | IMMUTABLE | ConversationParticipant | NONE | Audit YES | CL-31 |
| `ConversationParticipant.personId` | UUID | YES | NO | — | referenced `Person` exists | — | IMMUTABLE | ConversationParticipant | NONE | Audit YES | CL-31 |
| `ConversationParticipant.joinedAt` | DateTime | YES | NO | generated | — | — | IMMUTABLE | ConversationParticipant | NONE | Audit YES | REQ-COM-011 |
| `ConversationParticipant.leftAt` | DateTime | NO | YES | — | `NULL` = active participant | — | STATE-BOUND | ConversationParticipant | NONE | Audit YES | REQ-COM-011 |
| `ConversationParticipant.lastReadAt` | DateTime | NO | YES | — | per-participant read cursor | — | MUTABLE | ConversationParticipant | NONE | Audit YES | REC-12; COM-004/023 |

`lastReadAt` is the persisted read cursor; unread counts are derived from `Message.sentAt` vs `ConversationParticipant.lastReadAt` (and `Message.state ≠ DELETED`). Ex-participant conserves their period (no history before `joinedAt`).

#### ENT-32 `Message`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `Message.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | Message | NONE | Audit YES | CL-32 |
| `Message.conversationId` | UUID | YES | NO | — | referenced `Conversation` exists | — | IMMUTABLE | Message | NONE | Audit YES | CL-32 |
| `Message.authorPersonId` | UUID | YES | NO | — | referenced `Person` exists | — | IMMUTABLE | Message | NONE | Audit YES | REQ-COM-009 |
| `Message.body` | Text | YES | NO | — | non-empty | — | MUTABLE (own only) | Message | MESSAGE_BODY | Audit YES | REQ-COM-009 |
| `Message.state` | Enum<SENT,EDITED,DELETED> | YES | NO | `SENT` | SM-MESSAGE-01 | — | STATE-BOUND | Message | NONE | Audit YES | SM-MESSAGE-01 |
| `Message.sentAt` | DateTime | YES | NO | generated | — | — | IMMUTABLE | Message | NONE | Audit YES | CL-32 |
| `Message.editedAt` | DateTime | NO | YES | — | non-null iff `state=EDITED` | — | STATE-BOUND | Message | NONE | Audit YES | SM-MESSAGE-01 |
| `Message.deletedAt` | DateTime | NO | YES | — | non-null iff `state=DELETED` | — | STATE-BOUND | Message | NONE | Audit YES | SM-MESSAGE-01 |
| `Message.deletionReason` | String | NO | YES | — | required on delete | — | IMMUTABLE | Message | NONE | Audit YES | REQ-COM-010 |

`SENT → EDITED → DELETED` (tombstone irreversible, confirmation + reason). Only author may edit/delete. **Domain-persisted states are `SENT`, `EDITED`, `DELETED` only.** Transient client-side "pending/failed" send states are **frontend-only** and do not persist (REC-11). Send does not notify (REQ-COM-017).

#### ENT-33 `Notification`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `Notification.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | Notification | NONE | Audit YES | CL-33 |
| `Notification.recipientPersonId` | UUID | YES | NO | — | referenced `Person` exists | — | IMMUTABLE | Notification | NONE | Audit YES | REQ-COM-018 |
| `Notification.type` | Enum<EVENT_CHANGED,EVENT_POSTPONED,EVENT_RESCHEDULED,EVENT_CANCELLED,EVENT_RESTORED,SELECTION_PUBLISHED,ANNOUNCEMENT_PUBLISHED> | YES | NO | — | one of the 7 canonical types | — | IMMUTABLE | Notification | NONE | Audit YES | PT §22; CL-33 |
| `Notification.resourceType` | Enum<EVENT,SELECTION,ANNOUNCEMENT> | YES | NO | — | type of the resource that originated the notification | — | IMMUTABLE | Notification | NONE | Audit YES | CL-33 |
| `Notification.resourceId` | UUID | YES | NO | — | ID of the resource | — | IMMUTABLE | Notification | NONE | Audit YES | CL-33 |
| `Notification.originEventId` | UUID | NO | YES | — | present when `type ∈ {EVENT_*}` | — | IMMUTABLE | Notification | NONE | Audit YES | CL-33 |
| `Notification.title` | String | YES | NO | — | — | — | IMMUTABLE | Notification | NONE | Audit YES | CL-33 |
| `Notification.body` | Text | YES | NO | — | — | — | IMMUTABLE | Notification | NONE | Audit YES | CL-33 |
| `Notification.occurredAt` | DateTime | YES | NO | generated | moment the fact occurred | — | IMMUTABLE | Notification | NONE | Audit YES | CL-33 |
| `Notification.readAt` | DateTime | NO | YES | — | `NULL` = UNREAD; non-null = READ | — | MUTABLE | Notification | NONE | Audit YES | CL-33 |
| `Notification.audienceResolvedAt` | DateTime | YES | NO | generated | audience frozen at creation | — | IMMUTABLE | Notification | NONE | Audit YES | PT §58 |
| `Notification.dedupeKey` | String | YES | NO | generated | `originEventId|resourceType|resourceId|recipientPersonId|type` (logical uniqueness) | LOGICAL UNIQUE | IMMUTABLE | Notification | NONE | Audit YES | REQ-COM-017/018 |

`UNREAD/READ` derived from `readAt`. The notification represents a **historical occurrence**; its text reflects data at `occurredAt`, not current mutable values. Deduplication prevents duplicate notifications for the same `(originEventId, recipient, type)`.

#### ENT-34 `AuditEntry`

| FIELD | TYPE | REQ | NULL | DEFAULT | VALIDATION | UNIQUE | MUTABILITY | SOT | PII | AUDIT/HIST | SOURCE |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `AuditEntry.id` | UUID | YES | NO | generated | — | PK | IMMUTABLE | AuditEntry | NONE | Audit YES | CL-37 |
| `AuditEntry.occurredAt` | DateTime | YES | NO | generated | — | — | IMMUTABLE | AuditEntry | NONE | Audit YES | REQ-INS-009 |
| `AuditEntry.actorPersonId` | UUID | YES | NO | — | referenced `Person` exists | — | IMMUTABLE | AuditEntry | NONE | Audit YES | REQ-INS-009 |
| `AuditEntry.action` | String | YES | NO | — | canonical action vocabulary | — | IMMUTABLE | AuditEntry | NONE | Audit YES | REQ-INS-009 |
| `AuditEntry.targetType` | String | YES | NO | — | type of affected object | — | IMMUTABLE | AuditEntry | NONE | Audit YES | REQ-INS-009 |
| `AuditEntry.targetId` | UUID | YES | NO | — | ID of affected object | — | IMMUTABLE | AuditEntry | NONE | Audit YES | REQ-INS-009 |
| `AuditEntry.reason` | String | NO | YES | — | when action requires it (mandatory on corrections, archive, etc.) | — | IMMUTABLE | AuditEntry | NONE | Audit YES | REQ-INS-009 |
| `AuditEntry.source` | String | NO | YES | — | command ID or `system` | — | IMMUTABLE | AuditEntry | NONE | Audit YES | REC-18; GLB-027 |
| `AuditEntry.diff` | JSON | NO | YES | — | before/after; sensitive fields redacted | — | IMMUTABLE | AuditEntry | AUDIT_SENSITIVE | Audit YES (redacted) | REQ-INS-009/010 |

AuditEntry is append-only; no update, no delete. Sensitive data (password hashes, tokens, cookies, message bodies, documents) is redacted in `diff`. Only `ADMIN` may read audit.

### 03.7 Derived field-level values (DV-*)

| ID | Derived value | Source fields / relations | Derivation rule | Persisted? | Source |
|---|---|---|---|---|---|
| `DV-01` | `Person.fullName` | `firstName + " " + lastName` | Concatenation | NO | CL-01 |
| `DV-02` | `Person.isPlayerProfileComplete` | `dni ∧ birthDate ∧ phone ∧ email` all non-null | Boolean | NO | REQ-PPL-002 |
| `DV-03` | `Person.hasAccount` | `Account` exists with `personId = Person.id` | Exists | NO | CL-01 |
| `DV-04` | `Person.activeMembership` | `Membership` where `now ∈ [validFrom, validUntil)` | Temporal query | NO | CL-03 |
| `DV-05` | `Person.activeTeamAssignments` | `TeamAssignment` where `now ∈ [validFrom, validUntil)` | Temporal query | NO | CL-04 |
| `DV-06` | `Person.activeRoleAssignments` | `RoleAssignment` where `now ∈ [validFrom, validUntil)` ∧ `now ∉ temporalExclusions` | Temporal query | NO | CL-05 |
| `DV-07` | `Person.effectiveRoles` | Distinct `role` from active `RoleAssignment` | Set union | NO | PT Core 4; REQ-PPL-006 |
| `DV-08` | `Person.effectiveCapabilities` | Union of capabilities from `effectiveRoles` per scope | Role→capability map | NO | Authority Matrix V1.1 |
| `DV-09` | `Team.name` | `Season.name + " " + Division.name + " " + Line.name` | Derived from FK chain | NO | REQ-PPL-014; CL-10 |
| `DV-10` | `Line.fullLabel` | `Division.name + " " + Line.name + " " + Season.name` (via Team) | Derived from FK chain | NO | REQ-STR-010 |
| `DV-11` | `Event.concreteTeam` | `EventTargetTeam` where `Event.type=MATCH` | Single team | NO | REQ-EVT-006; CL-12 |
| `DV-12` | `Event.isTerminal` | `state ∈ {CANCELLED,COMPLETED,ABANDONED}` | Enum check | NO | SM-EVENT-01 |
| `DV-13` | `Event.materialityFlags` | Compare changed fields to closed material list | Field set vs policy | NO | REQ-EVT-011; PT §11 |
| `DV-14` | `Event.nextEventLabel` | Earliest future `Event` with `clubWideTarget` or targeting person | Temporal query | NO | UX Home/Calendar |
| `DV-15` | `Event.attentionItems` | `Availability` NEEDS_RECONFIRMATION + `SelectionRevision` DRAFT + `AttendanceSheet` OPEN | Union of participation signals | NO | UX Home/Calendar |
| `DV-16` | `Availability.state` | `value` if row exists else `NO_RESPONSE`; if `coordinationRevision < Event.coordinationRevision` ⇒ `NEEDS_RECONFIRMATION` | Temporal comparison | NO | SM-AVAILABILITY-01 |
| `DV-17` | `Selection.currentPublishedRevision` | Latest `SelectionRevision` with `state=PUBLISHED` | Temporal query | NO | CL-20 |
| `DV-18` | `Selection.conflicts` | `NO_LONGER_EVENT_TARGET` + `NO_LONGER_TEAM_AFFILIATED` for entries | Derived per entry | NO | REC-04; PT §14 |
| `DV-19` | `AttendanceSheet.state` | `OPEN` if `closedAt=NULL` else `CLOSED` | Null check | NO | SM-ATTENDANCEENTRY-01 |
| `DV-20` | `AttendanceEntry.state` | `value` if non-null else `UNRECORRED` | Null check | NO | SM-ATTENDANCEENTRY-01 |
| `DV-21` | `MatchRecord.matchesPlayed` | Count of `MatchRecord` with `resultType=PLAYED` per person | Aggregation | NO | REQ-PRT-016 |
| `DV-22` | `Conversation.unreadCount` | Count of `Message` with `sentAt > lastReadAt` ∧ `state ≠ DELETED` per participant | Temporal query | NO | CL-31; REC-12 |
| `DV-23` | `Conversation.lastActivityAt` | Max `Message.sentAt` per conversation | Aggregation | NO | CL-32 |
| `DV-24` | `Announcement.clubWide` | `AnnouncementTargetTeam` set empty | Empty check | NO | CL-28 |
| `DV-25` | `Announcement.audienceSnapshot` | `AnnouncementTargetTeam.teamId` frozen at `publishedAt` | Snapshot at publish | NO | SM-ANNOUNCEMENT-01 |
| `DV-26` | `Announcement.readState` | `Notification.readAt` for recipient where `type=ANNOUNCEMENT_PUBLISHED` | Join | NO | REC-10 |
| `DV-27` | `Notification.isUnread` | `readAt = NULL` | Null check | NO | CL-33 |
| `DV-28` | `EventSeries.affectedOccurrences` | Set of `occurrenceIndex` impacted by a scope edit | Scope logic | NO | REQ-EVT-015 |
| `DV-29` | `Event.resolvedAudience` | `clubWideTarget` ∪ `EventTargetTeam.teamId` ∪ `EventTargetPerson.personId` | Union | NO | CL-12; REQ-COM-016 |
| `DV-30` | `Jornada.matches` | `JornadaMatch.eventId` joined to `Event` | FK traversal | NO | CL-15 |
| `DV-31` | `visibleFields(subject, viewer)` | Field-level PII matrix per authority | PII rules §07.2 | NO | PII Matrix V1.1 |
| `DV-32` | `allowedActions(actor, resource, objectState)` | Role + scope + state + field authority + PII | Authority formula | NO | Target UX Authority |

Total derived field-level values: **32** (DV-01..DV-32). These are **not persisted**; they are computed by read contracts or backend projections.

### 03.8 No-UI-fields declaration

The following are explicitly **domain-derived presentation values** and must not become database columns:

| Value | Derived from | Reason |
|---|---|---|
| `nextEventLabel` | `Event.startAt` + actor context | UI formatting |
| `eventStatusLabel` | `Event.state` + `type` | Localized text, no storage |
| `selectionConflictLabels` | `DV-18` | Human-readable conflict names |
| `availabilityStatusText` | `DV-16` | Localized text |
| `attendanceStatusText` | `DV-20` | Localized text |
| `matchResultLabel` | `MatchRecord.resultType` + scores | Formatting |
| `personProfileCompletionGap` | `DV-02` + missing field names | UI banner content |
| `unreadBadgeCount` | `DV-22` + `DV-27` | Aggregation |
| `teamIdentityDisplay` | `DV-09` | Derived name |

These are generated by read contracts / frontend at render time. They never affect persistence, indexing or migration.

---

## 04 Relationships + Invariants

### 04.1 Relationship contract

| # | SOURCE | TARGET | CARDINALITY | REQUIRED / OPTIONAL | OWNERSHIP | DELETE / ARCHIVE BEHAVIOR | HISTORICAL BEHAVIOR | INVARIANTS | SOURCE |
|---|---|---|---|---|---|---|---|---|---|
| R-01 | `Person` | `Account` | 1 → 1 | Required on Account side | Person owns Account | Account survives Person; Person may exist without Account | Account status history preserved | Person may exist without Account; Account belongs to exactly one Person | CL-02; PT Core 2 |
| R-02 | `Person` | `Membership` | 1 → N | Required on Membership side | Person owns Memberships | Deactivating Person does not delete Memberships (temporal close) | Memberships survive as historical periods | A Person may have multiple historical Memberships; only memberships valid at the evaluated instant are active | CL-03; REQ-PPL-004 |
| R-03 | `Person` | `RoleAssignment` | 1 → N | Required on RoleAssignment side | Person owns assignments | RoleAssignment closed temporally, not deleted | Historical assignments preserved as authority evidence | Authority derives from active assignments only; default DENY | CL-05; PT Core 4 |
| R-04 | `Person` | `TeamAssignment` | 1 → N | Required on TeamAssignment side | Person owns TeamAssignments | TeamAssignment closed temporally | Historical affiliations preserved | TeamAssignment is atomic with RoleAssignment PLAYER (REQ-PPL-007) | CL-04; REQ-PPL-005/007 |
| R-05 | `TeamAssignment` | `Team` | N → 1 | Required | TeamAssignment references Team | Deleting Team not allowed while assignments exist (close first) | Historical team membership preserved | One TeamAssignment per person-team validity window; no overlapping active assignments | CL-04; REQ-PPL-005 |
| R-06 | `RoleAssignment` | `Team` | N → 1 | Optional (scopeRefId when scopeType=TEAM) | RoleAssignment references Team | Closing role does not delete team | Historical role grants preserved | Scope validity: PLAYER→TEAM, CAPTAIN→TEAM, COACH→TEAM|EVENT, SUBCOMMITTEE→CLUB, ADMIN→CLUB | CL-05; Actor Model V1.1 |
| R-07 | `RoleAssignment` | `Event` | N → 1 | Optional (scopeRefId when scopeType=EVENT) | RoleAssignment references Event | Closing role does not delete event | Historical role grants preserved | COACH scope on EVENT allows event-level authority | CL-05; Actor Model V1.1 |
| R-08 | `Season` | `Team` | 1 → N | Required on Team side | Season owns Teams | Archiving Season does not delete Teams (they remain historical) | Team history survives season closure | Team identity = Season + Division + Line, immutable once created | CL-10; REQ-STR-004 |
| R-09 | `Division` | `Team` | 1 → N | Required on Team side | Division owns Teams | Archiving Division rejected while active Teams exist | Division rename rejected while active Teams exist | Division rename rejected while active Teams exist | CL-08; REQ-PPL-014 |
| R-10 | `Line` | `Team` | 1 → N | Required on Team side | Line owns Teams | Archiving Line rejected while active Teams exist | Line rename rejected while active Teams exist | Line rename rejected while active Teams exist | CL-09; REQ-PPL-014 |
| R-11 | `Season` | `Competition` | 1 → N | Required on Competition side | Season owns Competitions | Archiving Competition does not delete; archived Competition cannot be selected for new assignment | Historical references to archived Competition remain valid | Competition.archive is a flag, not a lifecycle state machine | CL-34; INV-10 |
| R-12 | `Competition` | `Event` | 1 → N | Optional | Competition references Events | Archived Competition cannot be selected for new Event assignment | Historical Event references to Competition remain valid | `competitionId` optional on Event; only when `type=MATCH` | CL-34; PT Core 8 |
| R-13 | `Competition` | `Jornada` | 1 → N | Optional | Competition references Jornadas | Archived Competition cannot be referenced by new Jornada | Historical Jornada references to Competition remain valid | `competitionId` optional on Jornada | CL-15; REQ-EVT-024 |
| R-14 | `EventSeries` | `Event` | 1 → N | Optional on Event side | EventSeries owns occurrences | EventSeries→ENDED does not delete occurrence Events | Occurrence overrides survive series end | No separate EventSeriesTargetTeam/Person entities (targets materialized on each Event) | CL-13; REC-16 |
| R-15 | `EventOccurrenceOverride` | `EventSeries` | N → 1 | Required | Override belongs to series | Override deleted only with series | Override history preserved | One override per (seriesId, occurrenceIndex) | CL-14 |
| R-16 | `EventOccurrenceOverride` | `Event` | N → 1 | Optional | Override references concrete occurrence Event | Override does not delete occurrence | Override applied at generation time | Override fields are optional per occurrence | CL-14 |
| R-17 | `Event` | `Venue` | N → 1 | Optional | Event references Venue | Venue metadata edit does not reschedule events | Changing venue on Event is a material change | Venue metadata change ≠ event rescheduling (Rule A/B) | CL-11; REQ-STR-012 |
| R-18 | `Event` | `EventTargetTeam` | 1 → N | Optional | Event owns target rows | Deleting Event deletes target rows | Target history preserved via coordinationRevision | MATCH: exactly 1 EventTargetTeam; TRAINING/CLUB_EVENT: clubWideTarget=true or ≥1 target row | CL-17; REQ-EVT-005 |
| R-19 | `Event` | `EventTargetPerson` | 1 → N | Optional | Event owns target rows | Deleting Event deletes target rows | Target history preserved | MATCH: 0 EventTargetPerson; TRAINING/CLUB_EVENT: allowed | CL-18; REQ-EVT-005 |
| R-20 | `Event` | `EventLogistics` | 1 → 1 | Optional | Event owns logistics | Deleting Event deletes logistics | Logistics change is material event change | Logistics optional; authority CAPTAIN/COACH/SUBCOMMITTEE | CL-16; REQ-EVT-019 |
| R-21 | `Event` | `Availability` | 1 → N | Optional | Event owns Availability responses | Event CANCELLED preserves prior responses, accepts no new ones | Availability history via coordinationRevision | PLAYER responds only own Availability; POSTPONED preserves responses | CL-19; REQ-PRT-001 |
| R-22 | `Event` | `Selection` | 1 → 1 | Optional | Selection belongs to Match Event | Deleting Match Event deletes Selection | Published SelectionRevision immutable | One Selection per MATCH event; draft → publish → new revision | CL-20; REQ-PRT-005 |
| R-23 | `Selection` | `SelectionRevision` | 1 → N | Required on Revision side | Selection owns revisions | Deleting Selection deletes revisions | PUBLISHED revisions immutable; republication = new revision | DRAFT editable with autosave; PUBLISHED immutable | CL-21; SM-SELECTIONREV-01 |
| R-24 | `SelectionRevision` | `SelectionEntry` | 1 → N | Required on Entry side | Revision owns entries | Deleting revision deletes entries | PUBLISHED entries immutable | Entry.role immutable when PUBLISHED | CL-22; REC-09 |
| R-25 | `Event` | `AttendanceSheet` | 1 → 1 | Optional | Event owns sheet | Deleting Event deletes sheet | Sheet OPEN/CLOSED history preserved | One sheet per TRAINING/MATCH event; no reopening; correction only | CL-23; REQ-PRT-009 |
| R-26 | `AttendanceSheet` | `AttendanceEntry` | 1 → N | Required on Entry side | Sheet owns entries | Deleting sheet deletes entries | Correction preserves before/after | `UNRECORRED` ≠ `ABSENT`; closedAt blocks direct marking | CL-24; SM-ATTENDANCEENTRY-01 |
| R-27 | `Event` | `MatchRecord` | 1 → 1 | Optional | MatchRecord belongs to Match Event | Deleting Match Event deletes record | Correction preserves before/after; historical records survive terminal Event states | One record per MATCH; DRAFT → FINAL terminal; correction separate from state transition | CL-25; REQ-PRT-013/014 |
| R-28 | `MatchRecord` | `PlayerMatchStats` | 1 → N | Required on Stats side | Record owns stats | Deleting record deletes stats | Stats frozen on FINAL | Stats only for resultType=PLAYED; one stats row per person per record | CL-26; REQ-PRT-016 |
| R-29 | `Announcement` | `AnnouncementTargetTeam` | 1 → N | Required on association side | Announcement owns audience rows | Deleting announcement deletes audience rows | Audience frozen at PUBLISHED as immutable snapshot | `clubWide` derived (empty targetTeams); audience never changes after publish | CL-29; REQ-COM-002/005 |
| R-30 | `Conversation` | `ConversationParticipant` | 1 → N | Required on Participant side | Conversation owns participants | Deleting conversation deletes participants | Temporal authoritative access (joinedAt..leftAt) | DIRECT: canonical per pair; TEAM: 0..1 per team; EVENT: 0..1 per event; GROUP: multiple | CL-31; REQ-COM-006..008 |
| R-31 | `ConversationParticipant` | `Person` | N → 1 | Required | Participant references Person | Person deletion not allowed while active participation | Ex-participant retains access to historical period | Admin/Subcomité without participation cannot read private conversations | CL-31; REQ-COM-011/012 |
| R-32 | `Conversation` | `Message` | 1 → N | Required on Message side | Conversation owns messages | Deleting conversation deletes messages | Message tombstone (DELETED) irreversible | SENT→EDITED→DELETED; only author edits/deletes; no persisted pending/failed | CL-32; REQ-COM-009/010 |
| R-33 | `Message` | `Person` | N → 1 | Required | Message references author | Author deletion not allowed while messages exist | Message history preserved via state | Message body PII: participants read, author edits/soft-deletes | CL-32; REQ-COM-009 |
| R-34 | `Person` | `Notification` | N → 1 | Required | Notification references recipient | Notification not deleted on Person deletion | Notification is historical occurrence; not current resource truth | dedupeKey logical uniqueness: originEventId|resourceType|resourceId|recipient|type | CL-33; REQ-COM-018 |

**Total: 34 core relationships (R-01..R-34).** No relationship references GuardianRelationship, EligibilityConstraint, CompetitionEntry or ExternalReference.

### 04.2 Invariants

| ID | Invariant | Enforcement | Source |
|---|---|---|---|
| INV-01 | Person may exist without Account. Account belongs to exactly one Person. | DB + backend | PT Core 1-2; CL-02 |
| INV-02 | Account.email is forbidden; Person.email is the single login identifier. | Schema + read contract | PT Core 1-3 |
| INV-03 | username is unique case-insensitively, stable, never a credential/login/recovery identifier. | Unique index + backend | PT Core 3; REQ-IAM-014 |
| INV-04 | Authority = union of active RoleAssignment scopes; default DENY. | Backend authority service | PT Core 4; REQ-IAM-016 |
| INV-05 | ADMIN does not inherit sports authority. CAPTAIN ≠ COACH. SUBCOMMITTEE ≠ COACH. | Backend authority | PT Core 5; Actor Model V1.1 |
| INV-06 | Role scope validity: PLAYER→TEAM, CAPTAIN→TEAM, COACH→TEAM|EVENT, SUBCOMMITTEE→CLUB, ADMIN→CLUB. | Backend validation | Actor Model V1.1; REC-08 |
| INV-07 | PLAYER responds only to own Availability. | Backend + UX | PT Core 6; REQ-PRT-001 |
| INV-08 | Published SelectionRevision is immutable; republication creates new revision. | Backend state machine | PT Core 7; SM-SELECTIONREV-01 |
| INV-09 | Event terminal states (CANCELLED, COMPLETED, ABANDONED) survive historical participation records. | DB constraints | PT Core 6; SM-EVENT-01 |
| INV-10 | Archived Competition cannot be selected for new assignment; historical references remain valid. | Backend + DB | PT Core 8; INV-10 |
| INV-11 | Team identity = Season + Division + Line, immutable once created. | Unique constraint + backend | CL-10; REQ-PPL-014 |
| INV-12 | Attendance correction preserves before/after; MatchRecord correction preserves before/after. | History fields + audit | PT Core 9; REQ-PRT-012/014 |
| INV-13 | Business history and audit log are distinct; neither replaces the other. | Separate entities | PT Core 10; CL-37 |
| INV-14 | UNRECORRED ≠ ABSENT in AttendanceEntry. | Backend validation | SM-ATTENDANCEENTRY-01; UX State Grammar |
| INV-15 | DRAFT is non-observable atomic intermediate for Event creation; persisted as SCHEDULED. | Backend atomic command | TR-017; REC-14 |
| INV-16 | Material change list: startAt, endAt, venueId, targets, clubWideTarget, opponent, competitionId, logistics. | Backend diff | PT §11; REC-14 |
| INV-17 | coordinationRevision increments on material change; derives Availability.NEEDS_RECONFIRMATION. | Backend | REQ-EVT-011; PT §11 |
| INV-18 | No transition out of COMPLETED or ABANDONED; CANCELLED → SCHEDULED (restore) allowed. | State machine | SM-EVENT-01; TR-022 |
| INV-19 | AttendanceSheet: no reopening; correction is the only path after CLOSED. | Backend | SM-ATTENDANCEENTRY-01; REC-07 |
| INV-20 | MatchRecord correction is separate operation, not transition back to DRAFT. | Backend | REQ-PRT-014; SM-MATCHRECORD-01 |
| INV-21 | PlayerMatchStats frozen on MatchRecord.state=FINAL. | Backend | CL-26 |
| INV-22 | Announcement audience frozen at PUBLISHED; corrections only title/body; revision increments. | Backend | SM-ANNOUNCEMENT-01; REC-09 |
| INV-23 | DIRECT: exactly one canonical conversation per unordered person pair. | Partial unique index | CL-30; REQ-COM-006 |
| INV-24 | TEAM: at most one canonical conversation per Team. EVENT: at most one per Event. | Unique index | CL-30; REQ-COM-008 |
| INV-25 | Notification dedupeKey logical uniqueness prevents duplicates. | Unique constraint | CL-33; REC-18 |
| INV-26 | AuditEntry append-only; no update, no delete; sensitive fields redacted. | DB + backend | REQ-INS-009/010; CL-37 |
| INV-27 | Venue metadata edit does not reschedule events or increment coordination revision. | Backend Rule A/B | REQ-STR-012 (A) |
| INV-28 | Changing venue on Event is a material event change. | Backend | REQ-STR-012 (B) |
| INV-29 | Jornada: all matches have Event.seasonId = Jornada.seasonId and Event.type=MATCH. | Backend validation | CL-15; REC-17 |
| INV-30 | If Jornada.competitionId set, each match's competitionId is null or equal to it. | Backend | CL-15; REQ-EVT-024 |
| INV-31 | Series targeting materialized on each occurrence Event via EventTargetTeam/EventTargetPerson. | Backend | CL-13; REC-16 |
| INV-32 | maxOccurrences ≤ 366 (TECHNICAL POLICY). | Backend | CL-13; TECHNICAL POLICY |
| INV-33 | Bulk Jornada scheduling ≤ 100 matches per command (TECHNICAL POLICY). | Backend guard | CL-15; TECHNICAL POLICY |
| INV-34 | TeamAssignment atomic with RoleAssignment PLAYER (create/end together). | Backend transaction | REQ-PPL-007; CL-04 |
| INV-35 | Person.activeTeamAssignments / activeRoleAssignments evaluated at instant; temporal validity. | Backend temporal query | CL-04/05 |

**Total invariants: 35 (INV-01..INV-35).** These subsume the 48-item listing in §00.5 via consolidation (some INV items cover multiple example invariants).

---

## 05 Lifecycles / States

### 05.1 State machine inventory

| ID | Entity | States | Initial | Terminal | Transitions | Source |
|---|---|---|---|---|---|---|
| SM-ACCOUNT-01 | Account | PENDING, ACTIVE, DISABLED | PENDING | DISABLED | PENDENT→ACTIVE (activation), ACTIVE→DISABLED (disable), DISABLED→ACTIVE (reactivate) | SM-ACCOUNT-01 |
| SM-TEAM-01 | Team | DRAFT, ACTIVE, ARCHIVED | DRAFT | ARCHIVED | DRAFT→ACTIVE (activate), ACTIVE→ARCHIVED (archive) | SM-TEAM-01 |
| SM-DIVISION-01 | Division | ACTIVE, ARCHIVED | ACTIVE | ARCHIVED | ACTIVE→ARCHIVED | SM-DIVISION-01 |
| SM-LINE-01 | Line | ACTIVE, ARCHIVED | ACTIVE | ARCHIVED | ACTIVE→ARCHIVED | SM-LINE-01 |
| SM-VENUE-01 | Venue | ACTIVE, ARCHIVED | ACTIVE | ARCHIVED | ACTIVE→ARCHIVED | SM-VENUE-01 |
| SM-EVENT-01 | Event | DRAFT, SCHEDULED, POSTPONED, CANCELLED, IN_PROGRESS, COMPLETED, ABANDONED | DRAFT (non-observable) | CANCELLED, COMPLETED, ABANDONED | DRAFT→SCHEDULED (create), SCHEDULED→POSTPONED, SCHEDULED→CANCELLED, SCHEDULED→IN_PROGRESS, POSTPONED→SCHEDULED (restore/reschedule), POSTPONED→CANCELLED, IN_PROGRESS→COMPLETED, IN_PROGRESS→ABANDONED, CANCELLED→SCHEDULED (restore) | SM-EVENT-01 |
| SM-EVENTSERIES-01 | EventSeries | ACTIVE, ENDED | ACTIVE | ENDED | ACTIVE→ENDED | SM-EVENTSERIES-01 |
| SM-AVAILABILITY-01 | Availability | YES, MAYBE, NO (persisted); NO_RESPONSE, NEEDS_RECONFIRMATION (derived) | — | — | Value change substitutes previous; coordinationRevision drift ⇒ NEEDS_RECONFIRMATION | SM-AVAILABILITY-01 |
| SM-SELECTIONREV-01 | SelectionRevision | DRAFT, PUBLISHED | DRAFT | PUBLISHED | DRAFT→PUBLISHED (publish); no transition back | SM-SELECTIONREV-01 |
| SM-ATTENDANCEENTRY-01 | AttendanceEntry | PRESENT, ABSENT, JUSTIFIED (persisted); UNRECORDED (derived) | — | — | Value set/changed via correction; UNRECORRED when NULL | SM-ATTENDANCEENTRY-01 |
| SM-MATCHRECORD-01 | MatchRecord | DRAFT, FINAL | DRAFT | FINAL | DRAFT→FINAL (finalize); correction ≠ transition back | SM-MATCHRECORD-01 |
| SM-ANNOUNCEMENT-01 | Announcement | DRAFT, PUBLISHED, ARCHIVED | DRAFT | PUBLISHED, ARCHIVED | DRAFT→PUBLISHED (publish), PUBLISHED→ARCHIVED (archive), PUBLISHED→PUBLISHED (correction, revision++) | SM-ANNOUNCEMENT-01 |
| SM-CONVERSATION-GROUP-01 | Conversation (GROUP) | ACTIVE, ARCHIVED | ACTIVE | ARCHIVED | ACTIVE→ARCHIVED | SM-CONVERSATION-GROUP-01 |
| SM-MESSAGE-01 | Message | SENT, EDITED, DELETED | SENT | DELETED | SENT→EDITED (author only), EDITED→DELETED (author only); DELETED irreversible | SM-MESSAGE-01 |

Competition has **no state machine**: archive is a flag (ACTIVE ↔ ARCHIVED), not a lifecycle (REC-06). Archived entities (Division, Line, Team, Venue) are not reactivated in V1.

### 05.2 Lifecycle detail

#### SM-ACCOUNT-01 `Account`

| Field | Transition | Who | Guards | Side effects | Historical consequence |
|---|---|---|---|---|---|
| `status` | PENDING→ACTIVE | Admin (setup code consumed) | setupToken valid, not expired | credentialVersion unchanged; activatedAt set | Audit YES |
| `status` | ACTIVE→DISABLED | Admin | none | disabledAt set; sessions invalidated | Audit YES |
| `status` | DISABLED→ACTIVE | Admin | none | disabledAt cleared; activatedAt refreshed | Audit YES |
| `setupTokenHash/ExpiresAt` | set | Admin (recovery) | one active code max | attempts reset to 0 | Audit YES (redacted) |
| `setupTokenAttempts` | increment | System | max attempts = TECHNICAL POLICY | lockout after max | Audit YES |

Rule: Account has no auto-login on activation (returns to Login).

#### SM-EVENT-01 `Event`

| Field | Transition | Who | Guards | Side effects | Historical consequence |
|---|---|---|---|---|---|
| `state` | DRAFT→SCHEDULED | Creator (COACH/SUBCOMMITTEE) | all required fields present | createdAt set; coordinationRevision=0 | Audit YES |
| `state` | SCHEDULED→POSTPONED | COACH (own teams) / SUBCOMMITTEE | state=SCHEDULED | coordinationRevision++; notification EVENT_POSTPONED | Audit YES; history |
| `state` | POSTPONED→SCHEDULED | COACH / SUBCOMMITTEE | state=POSTPONED | coordinationRevision++; notification EVENT_RESCHEDULED | Audit YES |
| `state` | SCHEDULED→CANCELLED | COACH / SUBCOMMITTEE | state=SCHEDULED | coordinationRevision++; notification EVENT_CANCELLED | Audit YES |
| `state` | CANCELLED→SCHEDULED | COACH / SUBCOMMITTEE | state=CANCELLED | coordinationRevision++; notification EVENT_RESTORED | Audit YES |
| `state` | SCHEDULED→IN_PROGRESS | COACH | state=SCHEDULED | none | Audit YES |
| `state` | IN_PROGRESS→COMPLETED | COACH | state=IN_PROGRESS | MatchRecord compatible required | Audit YES |
| `state` | IN_PROGRESS→ABANDONED | COACH | state=IN_PROGRESS | MatchRecord resultType=ABANDONED | Audit YES |
| `type` | immutable | — | set at creation | — | Audit YES |

Material change fields (increment coordinationRevision): startAt, endAt, venueId, targets, clubWideTarget, opponent, competitionId, logistics. Non-material: title.

#### SM-SELECTIONREV-01 `SelectionRevision`

| Field | Transition | Who | Guards | Side effects | Historical consequence |
|---|---|---|---|---|---|
| `state` | DRAFT→PUBLISHED | COACH (TEAM scope) | draft valid; match is MATCH type | publishedAt set; publishedByPersonId set; notification SELECTION_PUBLISHED | PUBLISHED immutable; new revision for republication |

#### SM-ATTENDANCEENTRY-01 `AttendanceEntry`

| Field | Transition | Who | Guards | Side effects | Historical consequence |
|---|---|---|---|---|---|
| `value` | NULL→PRESENT/ABSENT/JUSTIFIED | COACH | sheet OPEN | recordedAt set; recordedByPersonId set | Audit YES |
| `value` | PRESENT/ABSENT/JUSTIFIED→any | COACH | correction; sheet CLOSED allowed | correctedAt/correctedBy/correctionReason set; previousValue preserved | Audit YES; history before/after |

#### SM-MATCHRECORD-01 `MatchRecord`

| Field | Transition | Who | Guards | Side effects | Historical consequence |
|---|---|---|---|---|---|
| `state` | DRAFT→FINAL | COACH | match is MATCH; Event state compatible | finalizedAt set; finalizedByPersonId set | Audit YES; resultType required |
| resultType/scores | any→corrected | COACH | correction after FINAL | correctedAt/correctedBy/correctionReason; previous* preserved | Audit YES; before/after |

#### SM-MESSAGE-01 `Message`

| Field | Transition | Who | Guards | Side effects | Historical consequence |
|---|---|---|---|---|---|
| `state` | SENT→EDITED | Author only | own message; state≠DELETED | editedAt set | Audit YES |
| `state` | EDITED/SENT→DELETED | Author only | own message; state≠DELETED | deletedAt set; deletionReason required; tombstone irreversible | Audit YES |

No persisted `pending`/`failed` send state (REC-11).

#### SM-ANNOUNCEMENT-01 `Announcement`

| Field | Transition | Who | Guards | Side effects | Historical consequence |
|---|---|---|---|---|---|
| `state` | DRAFT→PUBLISHED | SUBCOMMITTEE | audience set (≥0 teams) | publishedAt set; publishedByPersonId set; audience snapshot frozen; notification ANNOUNCEMENT_PUBLISHED | Audit YES; audience immutable |
| `state` | PUBLISHED→ARCHIVED | SUBCOMMITTEE | state=PUBLISHED | archivedAt set | Audit YES |
| `title`/`body` | corrected | SUBCOMMITTEE | state=PUBLISHED | revision++ | Audit YES; audience unchanged |

#### SM-TEAM-01 / SM-DIVISION-01 / SM-LINE-01 / SM-VENUE-01

Archive is one-way (ACTIVE→ARCHIVED) for Division/Line/Venue. Team: DRAFT→ACTIVE→ARCHIVED. No reactivation in V1.

#### SM-EVENTSERIES-01 `EventSeries`

ACTIVE→ENDED. No separate series targets; targets materialized on occurrences.

---

## 06 Command Registry

### 06.1 Command conventions

- `COMMAND ID`: stable identifier, domain intention (not UI action).
- `AGGREGATE`: the aggregate root the command mutates.
- `ACTIVITY/ATOMICITY`: single transaction; all-or-nothing.
- `OUTPUT`: command result (created/updated resource id + version).
- `IDEMPOTENCY`: required where network retry may duplicate; keyed by client-provided idempotency key.
- Default authority: `DENY`.

### 06.2 Command list

| ID | Aggregate | Purpose | Actor / Authority | Preconditions | Atomicity | Side effects | Failure codes |
|---|---|---|---|---|---|---|---|
| `CMD-IAM-01` | Account | Login (email + password) | ACT-UNAUTHENTICATED | Account exists, status=ACTIVE, password matches | Single | Audit YES; session issued | INVALID_CREDENTIALS, ACCOUNT_NOT_ACTIVE |
| `CMD-IAM-02` | Account | Activate account (setup code) | ACT-UNAUTHENTICATED | setupToken valid, not expired | Single | status=ACTIVE; activatedAt set; Audit YES | INVALID_TOKEN, TOKEN_EXPIRED |
| `CMD-IAM-03` | Account | Change password (authenticated) | ACT-AUTHENTICATED (owner) | current password correct | Single | credentialVersion++; Audit YES | INVALID_CURRENT_PASSWORD |
| `CMD-IAM-04` | Account | Disable account | ACT-ADMIN | account exists | Single | status=DISABLED; disabledAt set; Audit YES | ACCOUNT_NOT_FOUND |
| `CMD-IAM-05` | Account | Recover account (admin re-issue code) | ACT-ADMIN | account exists | Single | setupTokenHash/ExpiresAt set; attempts=0; Audit YES | ACCOUNT_NOT_FOUND |
| `CMD-PPL-01` | Person | Register person | ACT-ADMIN | none | Single | Person created; Audit YES | DUPLICATE_EMAIL |
| `CMD-PPL-02` | Person | Edit own contact (email/phone) | ACT-AUTHENTICATED (owner) | email unique if changed | Single | Audit YES | DUPLICATE_EMAIL |
| `CMD-PPL-03` | Membership | Register membership | ACT-ADMIN | Person exists | Single | Membership created; Audit YES | PERSON_NOT_FOUND |
| `CMD-PPL-04` | Membership | End membership | ACT-ADMIN | membership exists, active | Single | validUntil set; Audit YES | MEMBERSHIP_NOT_ACTIVE |
| `CMD-PPL-05` | RoleAssignment | Assign role with scope | ACT-ADMIN / ACT-SUBCOMMITTEE (CLUB) | person exists; role/scope valid | Single | RoleAssignment created; Audit YES | INVALID_ROLE_SCOPE, PERSON_NOT_FOUND |
| `CMD-PPL-06` | RoleAssignment | End role assignment | ACT-ADMIN | assignment exists, active | Single | validUntil set; Audit YES | ASSIGNMENT_NOT_ACTIVE |
| `CMD-PPL-07` | TeamAssignment | Add player to team | ACT-ADMIN / ACT-COACH (TEAM) | person + team exist; validity window | Single | TeamAssignment created; Audit YES | TEAM_NOT_FOUND, PERSON_NOT_FOUND |
| `CMD-PPL-08` | TeamAssignment | Change player team | ACT-ADMIN / ACT-COACH (TEAM) | current assignment ended | Single | old validUntil set; new created; Audit YES | ASSIGNMENT_OVERLAP |
| `CMD-PPL-09` | TeamAssignment | Remove player from team | ACT-ADMIN / ACT-COACH (TEAM) | assignment exists, active | Single | validUntil set; Audit YES | ASSIGNMENT_NOT_ACTIVE |
| `CMD-STR-01` | Season | Create season | ACT-ADMIN | name unique; dates valid | Single | Season created; Audit YES | DUPLICATE_SEASON_NAME |
| `CMD-STR-02` | Season | Update season | ACT-ADMIN | season exists | Single | Audit YES | SEASON_NOT_FOUND |
| `CMD-STR-03` | Division | Create division | ACT-ADMIN | name unique | Single | Division created; Audit YES | DUPLICATE_DIVISION_NAME |
| `CMD-STR-04` | Division | Update division | ACT-ADMIN | no active Teams if renaming | Single | Audit YES | ACTIVE_TEAMS_EXIST |
| `CMD-STR-05` | Division | Archive division | ACT-ADMIN | no active Teams | Single | archivedAt set; Audit YES | ACTIVE_TEAMS_EXIST |
| `CMD-STR-06` | Line | Create line | ACT-ADMIN | division exists; name unique | Single | Line created; Audit YES | DIVISION_NOT_FOUND |
| `CMD-STR-07` | Line | Update line | ACT-ADMIN | no active Teams if renaming | Single | Audit YES | ACTIVE_TEAMS_EXIST |
| `CMD-STR-08` | Line | Archive line | ACT-ADMIN | no active Teams | Single | archivedAt set; Audit YES | ACTIVE_TEAMS_EXIST |
| `CMD-STR-09` | Team | Register team | ACT-ADMIN | season+division+line unique | Single | Team created (DRAFT); Audit YES | DUPLICATE_TEAM_IDENTITY |
| `CMD-STR-10` | Team | Update team | ACT-ADMIN | team exists | Single | Audit YES | TEAM_NOT_FOUND |
| `CMD-STR-11` | Team | Activate team | ACT-ADMIN | team=DRAFT | Single | status=ACTIVE; Audit YES | INVALID_TEAM_STATE |
| `CMD-STR-12` | Team | Archive team | ACT-ADMIN | no active assignments if required | Single | status=ARCHIVED; archivedAt set; Audit YES | TEAM_NOT_FOUND |
| `CMD-STR-13` | Venue | Register venue | ACT-ADMIN | name+address non-empty | Single | Venue created; Audit YES | VENUE_DUPLICATE |
| `CMD-STR-14` | Venue | Correct venue metadata | ACT-ADMIN | venue exists | Single | Audit YES (Rule A/B: no reschedule) | VENUE_NOT_FOUND |
| `CMD-STR-15` | Venue | Archive venue | ACT-ADMIN | venue exists | Single | archivedAt set; Audit YES | VENUE_NOT_FOUND |
| `CMD-CMP-01` | Competition | Create competition | ACT-ADMIN / ACT-SUBCOMMITTEE | season exists; name non-empty | Single | Competition created; Audit YES | SEASON_NOT_FOUND |
| `CMD-CMP-02` | Competition | Edit competition | ACT-ADMIN / ACT-SUBCOMMITTEE | competition exists | Single | Audit YES | COMPETITION_NOT_FOUND |
| `CMD-CMP-03` | Competition | Archive competition | ACT-ADMIN / ACT-SUBCOMMITTEE | competition exists | Single | archivedAt set; Audit YES | COMPETITION_ARCHIVED_CANNOT_ASSIGN |
| `CMD-CMP-10` | Competition | Consult competition | read authority | competition exists | Read | none | COMPETITION_NOT_FOUND |
| `CMD-EVT-01` | Event | Create training | ACT-COACH (TEAM) / ACT-SUBCOMMITTEE | targets valid; type-specific invariants | Single (atomic: SCHEDULED) | Event created; coordinationRevision=0; Audit YES | INVALID_TARGET, MATERIAL_CHANGE |
| `CMD-EVT-02` | Event | Create match | ACT-COACH (TEAM) / ACT-SUBCOMMITTEE | exactly 1 target team; opponent required | Single (atomic: SCHEDULED) | Event created; coordinationRevision=0; Audit YES | INVALID_TARGET, OPPONENT_REQUIRED |
| `CMD-EVT-03` | Event | Create club event | ACT-SUBCOMMITTEE | targets valid | Single (atomic: SCHEDULED) | Event created; coordinationRevision=0; Audit YES | INVALID_TARGET |
| `CMD-EVT-04` | Event | Edit event | ACT-COACH (own teams) / ACT-SUBCOMMITTEE | non-material fields only if SCHEDULED | Single | updatedAt set; Audit YES | EVENT_NOT_EDITABLE, INVALID_STATE |
| `CMD-EVT-05` | Event | Material change event | ACT-COACH (own teams) / ACT-SUBCOMMITTEE | material fields changed | Single | coordinationRevision++; notification EVENT_CHANGED; Audit YES | EVENT_TERMINAL, INVALID_MATERIAL_CHANGE |
| `CMD-EVT-06` | Event | Postpone event | ACT-COACH (own teams) / ACT-SUBCOMMITTEE | state=SCHEDULED | Single | state=POSTPONED; coordinationRevision++; notification EVENT_POSTPONED | INVALID_STATE_TRANSITION |
| `CMD-EVT-07` | Event | Reschedule event | ACT-COACH (own teams) / ACT-SUBCOMMITTEE | state=POSTPONED | Single | state=SCHEDULED; coordinationRevision++; notification EVENT_RESCHEDULED | INVALID_STATE_TRANSITION |
| `CMD-EVT-08` | Event | Cancel event | ACT-COACH (own teams) / ACT-SUBCOMMITTEE | state∈{SCHEDULED,POSTPONED} | Single | state=CANCELLED; coordinationRevision++; notification EVENT_CANCELLED | INVALID_STATE_TRANSITION |
| `CMD-EVT-09` | Event | Restore cancelled event | ACT-COACH (own teams) / ACT-SUBCOMMITTEE | state=CANCELLED | Single | state=SCHEDULED; coordinationRevision++; notification EVENT_RESTORED | INVALID_STATE_TRANSITION |
| `CMD-EVT-10` | Event | Complete event | ACT-COACH (own teams) | state=IN_PROGRESS | Single | state=COMPLETED; Audit YES | INVALID_STATE_TRANSITION |
| `CMD-EVT-11` | Event | Abandon event | ACT-COACH (own teams) | state=IN_PROGRESS | Single | state=ABANDONED; Audit YES | INVALID_STATE_TRANSITION |
| `CMD-EVT-12` | Event | Resolve edit conflict | ACT-COACH / ACT-SUBCOMMITTEE | version mismatch | Single | version incremented; Audit YES | OPTIMISTIC_LOCK_FAILURE |
| `CMD-EVT-13` | EventSeries | Create series | ACT-COACH (TEAM) / ACT-SUBCOMMITTEE | recurrenceRule valid; maxOccurrences ≤366 | Single | Series created; occurrences generated; Audit YES | INVALID_RRULE |
| `CMD-EVT-14` | EventSeries | End series | ACT-COACH (TEAM) / ACT-SUBCOMMITTEE | state=ACTIVE | Single | state=ENDED; Audit YES | SERIES_ALREADY_ENDED |
| `CMD-EVT-15` | Jornada | Schedule jornada | ACT-COACH / ACT-SUBCOMMITTEE | season coherence; ≤100 matches | Single | Jornada + JornadaMatch created; Audit YES | BULK_TOO_LARGE, SEASON_MISMATCH |
| `CMD-EVT-16` | Event | Update logistics | ACT-CAPTAIN (TEAM) / ACT-COACH / ACT-SUBCOMMITTEE | event exists | Single | logistics upserted; coordinationRevision++; Audit YES | EVENT_NOT_FOUND |
| `CMD-PRT-01` | Availability | Respond own availability | ACT-PLAYER | event SCHEDULED; person owns response | Single | Availability upserted; coordinationRevision snapshot; Audit YES | EVENT_NOT_SCHEDULED, NOT_OWN_RESPONSE |
| `CMD-PRT-02` | Selection | Prepare draft convocation | ACT-COACH (TEAM) | match is MATCH; draft exists or created | Single | SelectionRevision DRAFT created/updated; Audit YES | MATCH_NOT_FOUND |
| `CMD-PRT-03` | Selection | Publish convocation | ACT-COACH (TEAM) | draft valid | Single | state=PUBLISHED; publishedAt set; notification SELECTION_PUBLISHED; Audit YES | DRAFT_INVALID |
| `CMD-PRT-04` | Selection | Review conflicts | read authority | draft exists | Read | none | — |
| `CMD-PRT-05` | Attendance | Register attendance | ACT-COACH (TEAM) | sheet OPEN; event TRAINING/MATCH | Single | AttendanceEntry upserted; Audit YES | SHEET_CLOSED, EVENT_TYPE_INVALID |
| `CMD-PRT-06` | Attendance | Close attendance | ACT-COACH (TEAM) | sheet OPEN | Single | closedAt set; closedByPersonId set; Audit YES | SHEET_ALREADY_CLOSED |
| `CMD-PRT-07` | Attendance | Correct attendance | ACT-COACH (TEAM) | entry exists; correctionReason required | Single | correctedAt/correctedBy/correctionReason set; previousValue preserved; Audit YES | ENTRY_NOT_FOUND |
| `CMD-PRT-08` | MatchRecord | Register match result | ACT-COACH (TEAM) | match is MATCH | Single | MatchRecord DRAFT created; Audit YES | MATCH_NOT_FOUND |
| `CMD-PRT-09` | MatchRecord | Finalize match result | ACT-COACH (TEAM) | state=DRAFT; resultType required | Single | state=FINAL; finalizedAt set; Audit YES | INVALID_STATE_TRANSITION |
| `CMD-PRT-10` | MatchRecord | Correct match result | ACT-COACH (TEAM) | correctionReason required | Single | correctedAt set; previous* preserved; Audit YES | RECORD_NOT_FOUND |
| `CMD-PRT-11` | MatchRecord | Register player stats | ACT-COACH (TEAM) | MatchRecord DRAFT; resultType=PLAYED | Single | PlayerMatchStats upserted; Audit YES | RECORD_NOT_DRAFT, STATS_NOT_PLAYED |
| `CMD-COM-01` | Announcement | Draft announcement | ACT-SUBCOMMITTEE | audience set | Single | Announcement DRAFT created; Audit YES | AUDIENCE_REQUIRED |
| `CMD-COM-02` | Announcement | Publish announcement | ACT-SUBCOMMITTEE | state=DRAFT | Single | state=PUBLISHED; publishedAt set; audience frozen; notification ANNOUNCEMENT_PUBLISHED; Audit YES | AUDIENCE_REQUIRED |
| `CMD-COM-03` | Announcement | Correct announcement | ACT-SUBCOMMITTEE | state=PUBLISHED; title/body only | Single | revision++; Audit YES | AUDIENCE_IMMUTABLE |
| `CMD-COM-04` | Announcement | Archive announcement | ACT-SUBCOMMITTEE | state=PUBLISHED | Single | state=ARCHIVED; archivedAt set; Audit YES | INVALID_STATE |
| `CMD-COM-05` | Conversation | Open direct conversation | ACT-AUTHENTICATED | pair unique | Single | Conversation DIRECT created; participants added; Audit YES | DUPLICATE_CONVERSATION |
| `CMD-COM-06` | Conversation | Create group conversation | ACT-AUTHENTICATED | ≥2 participants; title | Single | Conversation GROUP created; participants added; Audit YES | INSUFFICIENT_PARTICIPANTS |
| `CMD-COM-07` | Conversation | Open team/event conversation | ACT-COACH / ACT-SUBCOMMITTEE | team/event exists | Single | Conversation TEAM/EVENT created; membership synced; Audit YES | RESOURCE_NOT_FOUND |
| `CMD-COM-08` | Conversation | Archive group conversation | ACT-AUTHENTICATED (participant) | type=GROUP; state=ACTIVE | Single | state=ARCHIVED; Audit YES | NOT_GROUP, INVALID_STATE |
| `CMD-COM-09` | Message | Send message | ACT-AUTHENTICATED (participant) | conversation active; person is participant | Single | Message SENT created; sentAt set; Audit NO (send does not notify) | NOT_PARTICIPANT, CONVERSATION_CLOSED |
| `CMD-COM-10` | Message | Edit own message | ACT-AUTHENTICATED (author) | own message; state≠DELETED | Single | state=EDITED; editedAt set; Audit YES | NOT_AUTHOR, MESSAGE_DELETED |
| `CMD-COM-11` | Message | Delete own message | ACT-AUTHENTICATED (author) | own message; state≠DELETED; deletionReason | Single | state=DELETED; deletedAt set; tombstone; Audit YES | NOT_AUTHOR, MESSAGE_DELETED |
| `CMD-COM-12` | Notification | Mark notification read | ACT-AUTHENTICATED (recipient) | notification exists; recipient match | Single | readAt set; Audit NO | NOTIFICATION_NOT_FOUND, NOT_RECIPIENT |
| `CMD-INS-01` | AuditEntry | Consult audit | ACT-ADMIN | actor has Audit scope | Read | none | ACCESS_DENIED |

**Total commands: 74** (CMD-IAM-01..05, CMD-PPL-01..09, CMD-STR-01..15, CMD-CMP-01..03/10, CMD-EVT-01..16, CMD-PRT-01..11, CMD-COM-01..12, CMD-INS-01).

---

## 07 Authority + PII

### 07.1 Authority rules

| ID | Capability | Allowed roles | Scope | Object-level rule | Field-level rule | Blocked invariant | Source |
|---|---|---|---|---|---|---|---|
| AUTH-01 | Login | ACT-UNAUTHENTICATED | Person.email | Person with Account; password verified | Person.email (read) | Account.status≠ACTIVE ⇒ DENY | REQ-IAM-001 |
| AUTH-02 | Activate account | ACT-UNAUTHENTICATED | Account | setupToken valid | setupTokenHash (write) | Token expired ⇒ DENY | REQ-IAM-003 |
| AUTH-03 | Change password | ACT-AUTHENTICATED (owner) | Account | current password correct | passwordHash (write) | Wrong current password ⇒ DENY | REQ-IAM-005 |
| AUTH-04 | Disable/reactivate account | ACT-ADMIN | Account | none | status (write) | None | REQ-IAM-002 |
| AUTH-05 | Register person | ACT-ADMIN | Person | none | Person.* (write) | Duplicate email ⇒ DENY | REQ-PPL-001 |
| AUTH-06 | Edit own contact | ACT-AUTHENTICATED (owner) | Person | own personId | email/phone (write) | Email uniqueness ⇒ DENY | REQ-PPL-017 |
| AUTH-07 | Admin edit person | ACT-ADMIN | Person | none | dni/birthDate (write) | None | REQ-PPL-001 |
| AUTH-08 | Assign role | ACT-ADMIN / ACT-SUBCOMMITTEE (CLUB) | RoleAssignment | role/scope valid per matrix | scopeRefId (write) | INVALID_ROLE_SCOPE ⇒ DENY | Actor Model V1.1 |
| AUTH-09 | End role | ACT-ADMIN | RoleAssignment | assignment active | validUntil (write) | None | REQ-PPL-010 |
| AUTH-10 | Add player to team | ACT-ADMIN / ACT-COACH (TEAM) | TeamAssignment | person + team exist | teamId (write) | Overlap ⇒ DENY | REQ-PPL-005 |
| AUTH-11 | View own Availability | ACT-PLAYER | Availability | own personId | value (write) | Not own response ⇒ DENY | PT Core 6 |
| AUTH-12 | Publish Selection | ACT-COACH (TEAM) | SelectionRevision | draft valid | state (write) | DRAFT invalid ⇒ DENY | REQ-PRT-006 |
| AUTH-13 | Register attendance | ACT-COACH (TEAM) | AttendanceEntry | sheet OPEN | value (write) | Sheet closed ⇒ DENY | REQ-PRT-009 |
| AUTH-14 | Finalize MatchRecord | ACT-COACH (TEAM) | MatchRecord | state=DRAFT | resultType/scores (write) | Already FINAL ⇒ DENY | SM-MATCHRECORD-01 |
| AUTH-15 | Publish Announcement | ACT-SUBCOMMITTEE | Announcement | audience set | publishedAt (write) | None | REQ-COM-001 |
| AUTH-16 | Send message | ACT-AUTHENTICATED (participant) | Message | person is participant | body (write) | Not participant ⇒ DENY | REQ-COM-009 |
| AUTH-17 | Read audit | ACT-ADMIN | AuditEntry | Audit scope | diff (read, redacted) | None | REQ-INS-009 |
| AUTH-18 | Route guard | all authenticated | Route | hasApplicationAccess | — | No access ⇒ redirect /no-access | Target UX §Route Guards |

Default: `DENY`. Authority evaluated server-side from active `RoleAssignment` + `Membership` + `TeamAssignment`, not from `if role === ...`.

### 07.2 PII rules

| ID | Field | PII category | Who may read | Who may write | Who may administrate | Audit requirement | Source |
|---|---|---|---|---|---|---|---|
| PII-01 | Person.email | CONTACT / CREDENTIAL_IDENTIFIER | self + authorized admin | self (with verification) / admin | admin | YES on administrative change | PII Matrix V1.1; PT Core 1 |
| PII-02 | Person.dni | DOCUMENT | ADMIN | ADMIN | ADMIN | YES | PII Matrix V1.1 |
| PII-03 | Person.birthDate | BIRTH_DATA | ADMIN | ADMIN | ADMIN | YES | PII Matrix V1.1 |
| PII-04 | Person.phone | CONTACT | self + ADMIN + COACH/CAPTAIN (operational) | self / admin | admin | YES | PII Matrix V1.1 |
| PII-05 | Account.username | PROFILE_IDENTITY | self + ADMIN | none (immutable) | none | YES | PII Matrix V1.1 |
| PII-06 | Account.passwordHash | SECRET | none (never returned) | self / admin recovery | admin | YES (redacted) | PII Matrix V1.1 |
| PII-07 | Account.setupTokenHash | SECRET | none | admin (recovery) | admin | YES (redacted) | PII Matrix V1.1 |
| PII-08 | Message.body | MESSAGE_BODY | participants | author (soft-delete) | none | YES | PII Matrix V1.1 |
| PII-09 | AuditEntry.diff | AUDIT_SENSITIVE | ADMIN (redacted) | none | none | YES (redacted) | PII Matrix V1.1; REQ-SYS-020 |
| PII-10 | Person.firstName/lastName | BASIC_IDENTITY | self + role-appropriate | self / admin | admin | YES on admin change | PII Matrix V1.1 |
| PII-11 | AttendanceEntry.value | NONE (operational) | COACH + team scope | COACH | COACH | YES | CL-24 |
| PII-12 | SelectionEntry.personId | NONE (operational) | COACH + team scope | COACH | COACH | YES | CL-22 |
| PII-13 | MatchRecord scores | NONE (operational) | COACH + team scope | COACH | COACH | YES | CL-25 |
| PII-14 | Notification.title/body | NONE (historical snapshot) | recipient | system | none | YES | CL-33 |

Guardian-specific PII does not exist in active V1.1 (Guardian OUT).

---

## 08 Side Effects

### 08.1 Side effect conventions

Every command declares: AUDIT (YES/NO), NOTIFICATION (YES/NO + type/audience), HISTORY (YES/NO), RELATED RESOURCE UPDATE (YES/NO), REALTIME EVENT (YES/NO if canonical). No side effect is implicit in frontend.

### 08.2 Audit rules

| ID | Triggering mutations | Preserves | Source |
|---|---|---|---|
| AUD-01 | Administrative mutation (person/account/structure/competition CRUD) | actor, action, resource, before, after, reason, occurredAt | REQ-INS-008/009 |
| AUD-02 | Sport correction (attendance/match result correction) | actor, action, resource, before, after, correctionReason, occurredAt | REQ-PRT-012/014 |
| AUD-03 | Security/account mutation (disable, password change, activation) | actor, action, resource, before, after, occurredAt (secrets redacted) | REQ-IAM-002/005; CL-02 |
| AUD-04 | Publication/finalization (selection publish, match finalize, announcement publish) | actor, action, resource, publishedAt/finalizedAt, occurredAt | REQ-PRT-006/009; REQ-COM-002 |
| AUD-05 | Archive/restore (event cancel/restore, team/archive, announcement archive) | actor, action, resource, before/after state, occurredAt | SM-*; REC-07 |
| AUD-06 | Authority assignment (role/team assignment) | actor, action, resource, scope, validity, occurredAt | CL-04/05; REQ-PPL-006 |

AuditEntry is append-only; no update/delete. Sensitive fields redacted in `diff`. Only ADMIN may read audit.

### 08.3 Business history vs audit log

| Concept | Entity | Purpose | Examples |
|---|---|---|---|
| Business history | `SelectionRevision`, `AttendanceEntry.correction*`, `MatchRecord.correction*` | Preserve business truth over time | Published selection immutable; attendance before/after |
| Audit log | `AuditEntry` | Administrative/system traceability | Who changed what, when, why |

Neither replaces the other (INV-13).

### 08.4 Notification effects

| ID | Trigger | Recipient | Type | Resource | Deduplication | Source |
|---|---|---|---|---|---|---|
| NOT-01 | Material event edit | oldTargets ∪ newTargets ∪ publishedSelection ∪ availabilityResponders ∪ staff | EVENT_CHANGED | Event | originEventId\|recipient\|type | CL-33; REC-13 |
| NOT-02 | Event postponed | same as NOT-01 | EVENT_POSTPONED | Event | originEventId\|recipient\|type | CL-33 |
| NOT-03 | Event rescheduled | same as NOT-01 | EVENT_RESCHEDULED | Event | originEventId\|recipient\|type | CL-33 |
| NOT-04 | Event cancelled | same as NOT-01 | EVENT_CANCELLED | Event | originEventId\|recipient\|type | CL-33 |
| NOT-05 | Event restored | same as NOT-01 | EVENT_RESTORED | Event | originEventId\|recipient\|type | CL-33 |
| NOT-06 | Selection published | selectedNow ∪ removedNow ∪ staff | SELECTION_PUBLISHED | Selection | resourceId\|recipient\|type | CL-33 |
| NOT-07 | Announcement published | audienceSnapshot (immutable) | ANNOUNCEMENT_PUBLISHED | Announcement | resourceId\|recipient\|type | CL-33 |

Negative list (no notification for): availability response, attendance entry/correction, message send/edit/delete, minor typo correction. Announcement correction does not emit a new notification type.

No notification preferences, nudges, reminders, reactions, personal timeline (DEFER).

### 08.5 Realtime

Realtime events are canonical only where a command declares them (notification triggers above). No websocket/subscription semantics frozen at this contract level (TECHNICAL POLICY).

---

## 09 Read Contracts

### 09.1 Read contract conventions

- Read contracts are query needs that condition backend; DTO layout not designed here.
- Each defines: purpose, source entities, authority/scope, essential data, derived values, pagination/filter/sort.
- Default authority: DENY (via `allowedActions` / `getVisibleFields`).

### 09.2 Read contract list

| ID | Name | Purpose | Source entities | Authority / scope | Essential data | Derived values | Pagination / filter / sort |
|---|---|---|---|---|---|---|---|
| RC-01 | HomeForActor | "¿qué tengo que hacer?" operational home | Person, Event, Availability, SelectionRevision, AttendanceSheet, Notification | ACT-AUTHENTICATED | next event, attention items, unread count | DV-14, DV-15, DV-22, DV-27 | Filter by actor scope; sort by date |
| RC-02 | CalendarRange | Calendar view over date range | Event, EventSeries, Jornada | ACT-AUTHENTICATED | events in range, series | DV-11, DV-12, DV-18 | Range filter; sort by startAt |
| RC-03 | EventDetail | Full event detail | Event, EventTargetTeam, EventTargetPerson, Venue, EventLogistics, Competition | ACT-AUTHENTICATED (target/resolved audience) | all event fields + targets + logistics | DV-11, DV-12, DV-13, DV-29 | None |
| RC-04 | TeamDetail | Team detail + members | Team, Season, Division, Line, TeamAssignment, Person, RoleAssignment | ACT-AUTHENTICATED | team identity, members, roles | DV-09 | Filter by season |
| RC-05 | PersonOperational | Person operational profile | Person, Membership, TeamAssignment, RoleAssignment, Account | ACT-AUTHENTICATED (self) or ADMIN | identity, memberships, teams, roles | DV-01, DV-02, DV-03, DV-04, DV-05, DV-06, DV-07, DV-08 | Filter by person |
| RC-06 | ConversationList | Conversation list | Conversation, ConversationParticipant, Message | ACT-AUTHENTICATED (participant) | conversations, last activity, unread count | DV-22, DV-23 | Sort by lastActivityAt desc; pagination |
| RC-07 | ConversationThread | Conversation message thread | Message, ConversationParticipant | ACT-AUTHENTICATED (participant) | messages in conversation | — | Pagination; sort by sentAt |
| RC-08 | ManagementPeopleList | People management list | Person, Account, Membership | ACT-ADMIN | all persons, account status | DV-03, DV-04 | Pagination; filter by role/status |
| RC-09 | PersonAdminDetail | Person admin detail | Person, Account, Membership, RoleAssignment, TeamAssignment | ACT-ADMIN | full person + account + assignments | DV-07, DV-08 | None |
| RC-10 | AttendanceReport | Attendance report | AttendanceSheet, AttendanceEntry, Event, Person | ACT-ADMIN / ACT-COACH (TEAM) | attendance values per event | DV-19, DV-20 | Filter by event/season/team; pagination |
| RC-11 | PerformanceReport | Performance report | MatchRecord, PlayerMatchStats, Person | ACT-ADMIN / ACT-COACH (TEAM) | stats per match | DV-21 | Filter by match/season; pagination |
| RC-12 | AuditList | Audit list | AuditEntry | ACT-ADMIN | audit entries | none | Pagination; filter by actor/action/resource/date |
| RC-13 | CompetitionList | Competition list | Competition, Season | ACT-AUTHENTICATED | competitions, season | — | Filter by season; pagination |
| RC-14 | JornadaList | Jornada list | Jornada, JornadaMatch, Event | ACT-AUTHENTICATED | jornadas, matches | DV-30 | Filter by season/competition; pagination |
| RC-15 | SelectionDetail | Selection detail | Selection, SelectionRevision, SelectionEntry | ACT-COACH (TEAM) | draft/published entries, conflicts | DV-17, DV-18 | None |
| RC-16 | MatchRecordDetail | Match record detail | MatchRecord, PlayerMatchStats, Event | ACT-COACH (TEAM) | result, stats | — | None |
| RC-17 | AvailabilitySummary | Availability summary per event | Availability, Event, Person | ACT-COACH (TEAM) | responses per person | DV-16 | Filter by event; pagination |
| RC-18 | NotificationList | Notification list | Notification | ACT-AUTHENTICATED (recipient) | notifications, read state | DV-27 | Sort by occurredAt desc; pagination; filter unread |
| RC-19 | AnnouncementList | Announcement list | Announcement, AnnouncementTargetTeam | ACT-AUTHENTICATED (audience) | announcements, audience snapshot | DV-24, DV-25, DV-26 | Sort by publishedAt desc; pagination |
| RC-20 | StructureList | Structure list (seasons/divisions/lines/teams/venues) | Season, Division, Line, Team, Venue | ACT-ADMIN | all structure entities | DV-09, DV-10, DV-11..15 | Filter by archived state; pagination |
| RC-21 | SearchResults | Global search | Person, Event, Team, Announcement, Conversation | ACT-AUTHENTICATED (allowedActions) | typed results with minimal contexto | DV-31 | Query in URL; pagination; sort by rank |
| RC-22 | AttentionItems | Attention items | Availability, SelectionRevision, AttendanceSheet, Notification | ACT-AUTHENTICATED | items requiring attention | DV-15 | Filter by actor; sort by urgency |
| RC-23 | NextEvent | Next event | Event | ACT-AUTHENTICATED | earliest scheduled event in scope | DV-14 | None |
| RC-24 | EventSeriesDetail | Event series detail | EventSeries, Event (occurrences) | ACT-COACH / ACT-SUBCOMMITTEE | series + occurrences | DV-28 | Filter by series; sort by occurrenceIndex |
| RC-25 | JornadaDetail | Jornada detail | Jornada, JornadaMatch, Event | ACT-AUTHENTICATED | jornada + matches | DV-30 | None |
| RC-26 | TeamConversations | Team conversations | Conversation (type=TEAM) | ACT-AUTHENTICATED (member) | team conversations | — | Filter by team; pagination |
| RC-27 | EventConversations | Event conversations | Conversation (type=EVENT) | ACT-AUTHENTICATED (target) | event conversations | — | Filter by event; pagination |
| RC-28 | AccountStatus | Account status | Account | ACT-AUTHENTICATED (self) / ADMIN | status, activatedAt, credentialVersion | DV-03 | None |
| RC-29 | ProfileCompletion | Profile completion gaps | Person | ACT-AUTHENTICATED (self) | missing fields | DV-02 | None |
| RC-30 | MaterialityCheck | Event materiality pre-check | Event, proposed patch | ACT-COACH / ACT-SUBCOMMITTEE | material vs non-material | DV-13 | None |

**Total read contracts: 30** (RC-01..RC-30).

---

## 10 UX Flexibility Boundary

The following remain FREE (outside this functional contract) and may be iterated in parallel:

- Layout exact order and visual composition
- Cards vs grouped surfaces within the UX contract
- Spacing, color, radius, typography, iconography, motion details
- Component composition
- Desktop and mobile visual arrangement
- Microcopy that preserves semantics
- Responsive regime breakpoint values (design system owned)
- Toast duration and visual feedback styling

This contract freezes only: required information, available actions, states, authority, PII, side effects, invariants, and read-contract data needs. Visual presentation of those is not a backend/database requirement.

---

## 11 Reconciliation Log

| ID | Sources in conflict | Higher authority | Resolution | Implementation consequence |
|---|---|---|---|---|
| REC-01 | Scope Reconciliation V1.1 line 19 ("email password recovery is self-service") vs Product Truth V1.1 / Target UX / Auth Reconciliation (administrative recovery) | Product Truth V1.1 + GEI_AUTH_RECONCILIATION_V1.0 | Administrative recovery is final; line 19 of Scope Reconciliation is a documentation error superseded | No self-service forgot-password endpoint; recovery = admin re-issue setup code |
| REC-02 | Target UX Freeze lists 8 notification types (includes MESSAGE_RECEIVED, RECORD_FINALIZED) vs canonical 7 types in class model | Class Model V1.1 (CL-33) + Product Truth §22 | 7 canonical types final; MESSAGE_RECEIVED and RECORD_FINALIZED not persisted notification types | Notification.type enum = 7 types only |
| REC-03 | Target UX authority derivation lists `EligibilityConstraint` as authority source vs Scope Reconciliation (Eligibility OUT) | Scope Reconciliation V1.1 (authority #1) | EligibilityConstraint removed from authority sources; authority = RoleAssignment + Membership + TeamAssignment only | Authority service does not read Eligibility tables |
| REC-04 | Class Catalog V1.1 (33 classes, CL-16..CL-37) vs older Class Attributes (retired entities/fields) | GEI_CLASS_CATALOG_V1_1.md | Class Catalog V1.1 overrides; retired fields removed | No GuardianRelationship/Eligibility/CompetitionEntry tables |
| REC-05 | State Model Catalog V1.1 (14 active machines) vs State Transition Matrix (archived machine rows) | GEI_STATE_MODEL_CATALOG_V1_1.md | Catalog V1.1 overrides; Competition has no state machine | No Competition DRAFT/ACTIVE/CLOSED lifecycle |
| REC-06 | Target UX Resource Ownership lists CompetitionEntry under SUBCOMMITTEE+ADMIN vs Scope Reconciliation (CompetitionEntry OUT) | Scope Reconciliation V1.1 | CompetitionEntry removed; Competition simple context only | No CompetitionEntry entity or backend |
| REC-07 | Scope Reconciliation line 19 (self-service recovery) vs Product Truth / Target UX / Auth Reconciliation | Product Truth V1.1 + GEI_AUTH_RECONCILIATION_V1.0 | Same as REC-01 | Same as REC-01 |
| REC-08 | Class Catalog role scope combinations vs any historical LINE scope | Class Catalog V1.1 + Actor Model V1.1 | LINE scope does not exist; scope validity = PLAYER→TEAM, CAPTAIN→TEAM, COACH→TEAM|EVENT, SUBCOMMITTEE→CLUB, ADMIN→CLUB | INVALID_ROLE_SCOPE for any other combination |
| REC-09 | AnnouncementRevision mentioned in some sources vs class model (no AnnouncementRevision entity) | Class Catalog V1.1 (CL-28) + REC-09 | AnnouncementRevision not an entity; corrections via `revision++` on Announcement | No AnnouncementRevision table |
| REC-10 | Notification read acknowledgement via separate table vs Notification.readAt | Class Catalog V1.1 (CL-33) | Read acknowledgement = Notification.readAt of type ANNOUNCEMENT_PUBLISHED | No separate read-receipt table |
| REC-11 | Message "pending/failed" send state in UI vs domain-persisted states only | Class Catalog V1.1 (CL-32) + REC-11 | Domain states = SENT/EDITED/DELETED only; pending/failed frontend-only | No persisted pending/failed Message.state |
| REC-12 | Guardian delegation surfaces in some UX gap docs vs Guardian OUT | Scope Reconciliation V1.1 | Guardian delegation removed; no delegated Availability | No GuardianRelationship table or delegated response command |
| REC-13 | Unread-first conversation sorting vs last-activity DESC | Target Drift Reconciliation (COM-004-R) | last activity DESC; unread = presentation only | Query sort = lastActivityAt DESC |
| REC-14 | Event DRAFT as externally observable vs non-observable atomic intermediate | State Model Catalog V1.1 (SM-EVENT-01) + TR-017/REC-14 | DRAFT non-observable; creation atomic as SCHEDULED | Backend creates Event as SCHEDULED in single command |
| REC-15 | Series-level target entities vs targets materialized on occurrences | Class Catalog V1.1 (CL-13) + REC-16 | No EventSeriesTargetTeam/Person; targets on each Event | Series audience derived from occurrences |
| REC-16 | Jornada moved to "Más" in legacy vs Jornada in Calendar/Participation | Scope Reconciliation V1.1 + Target UX | Jornada stays in Calendar/Participation context | JornadaMatch belongs to Jornada; season coherence enforced |
| REC-17 | ExternalReference as active entity vs DEFER | Scope Reconciliation V1.1 | ExternalReference DEFER; no entity/field/command/query | No ExternalReference table |
| REC-18 | Notification dedupeKey variations across sources | Class Catalog V1.1 (CL-33) | dedupeKey = originEventId\|resourceType\|resourceId\|recipientPersonId\|type (EVENT_*) or resourceId\|recipient\|type (others) | Logical UNIQUE constraint on dedupeKey |
| REC-19 | Competition lifecycle state machine vs archive-as-flag | Class Catalog V1.1 (CL-34) + REC-06 | Competition: ACTIVE ↔ ARCHIVED flag only; no state machine | No Competition state transitions; archive flag only |
| REC-20 | AttendanceEntry previousValue as derived vs persisted correction field | Class Catalog V1.1 (CL-24) | previousValue persisted on correction | previousValue column exists; derived state computed |
| REC-21 | RoleAssignment temporalExclusions mutability vs immutability | Class Catalog V1.1 (CL-05) | temporalExclusions MUTABLE; other fields IMMUTABLE | Only temporalExclusions can be updated after creation |

**Total reconciliations: 21** (REC-01..REC-21).

---

## 12 Traceability / Coverage

### 12.1 Entity coverage

| Domain | Entities | Persisted | Source |
|---|---|---|---|
| PPL (People) | Person, Account, Membership, RoleAssignment, TeamAssignment | 5 | CL-01..05 |
| STR (Structure) | Season, Division, Line, Team, Venue | 5 | CL-07..11 |
| CMP (Competition) | Competition | 1 | CL-34 |
| EVT (Event/Calendar) | Event, EventSeries, EventOccurrenceOverride, EventLogistics, EventTargetTeam, EventTargetPerson, Jornada, JornadaMatch | 8 | CL-12..19 |
| PRT (Participation) | Availability, Selection, SelectionRevision, SelectionEntry, AttendanceSheet, AttendanceEntry, MatchRecord, PlayerMatchStats | 8 | CL-19..26 |
| COM (Communication) | Announcement, AnnouncementTargetTeam, Conversation, ConversationParticipant, Message, Notification | 6 | CL-28..33 |
| INS (Integrity) | AuditEntry | 1 | CL-37 |
| **Total** | **34** | **34** | |

### 12.2 Field coverage

| Category | Count |
|---|---|
| Persisted field contracts | ~232 |
| Derived field-level values (DV-*) | 32 |
| No-UI-fields (presentation only) | 8 |

### 12.3 Relationship coverage

| Category | Count |
|---|---|
| Relationships (R-*) | 34 |
| Invariants (INV-*) | 35 |

### 12.4 State coverage

| Category | Count |
|---|---|
| State machines (SM-*) | 14 |
| Lifecycle transitions defined | all relevant |

### 12.5 Command coverage

| Category | Count |
|---|---|
| Commands (CMD-*) | 73 |

### 12.6 Authority coverage

| Category | Count |
|---|---|
| Authority rules (AUTH-*) | 18 |
| PII rules (PII-*) | 14 |

### 12.7 Side effect coverage

| Category | Count |
|---|---|
| Audit rules (AUD-*) | 6 |
| Notification rules (NOT-*) | 7 |

### 12.8 Read contract coverage

| Category | Count |
|---|---|
| Read contracts (RC-*) | 30 |

### 12.9 Use Case mapping (41. Cross-check)

Every active use case (88) maps to ≥1 command or read contract. Active UC domains: IAM (6), PPL (12), STR (15), EVT (19), PRT (11), COM (14), CMP (4), INS (5), CMP consult (1). Orphan active UCs = 0.

### 12.10 Requirement mapping (42. Cross-check)

Every implementation-relevant active requirement (KEEP + KEEP_EDIT = 138) is represented by entity/field/command/authority/side-effect/read contract. Unmapped = 0.

### 12.11 UX data/action holes (43. Cross-check)

Every Target UX surface requiring information or action is satisfiable by field/derived value/read contract/command. Holes = 0.

### 12.12 Out-of-scope leak check (44. Cross-search)

| Leak term | Appears as active entity/field/command/query? | Disposition |
|---|---|---|
| Guardian | No | OUT (historical note only) |
| GuardianRelationship | No | OUT |
| Eligibility / EligibilityConstraint | No | OUT |
| CompetitionEntry | No | OUT |
| ExternalReference | No | DEFER |

---

## 13 Implementation Readiness

| Check | Status | Detail |
|---|---|---|
| Entity coverage | PASS | 34 entities, all defined |
| Field coverage | PASS | ~232 persisted fields + 32 derived |
| Relation coverage | PASS | 34 relationships |
| State coverage | PASS | 14 state machines, all transitions defined |
| Command coverage | PASS | 73 commands |
| Authority coverage | PASS | 18 authority rules; default DENY |
| PII coverage | PASS | 14 PII rules |
| Side effect coverage | PASS | 6 audit rules + 7 notification rules |
| Read contract coverage | PASS | 30 read contracts |
| Active UC mapped | PASS | 88/88 |
| Active REQ mapped | PASS | 138/138 implementation-relevant |
| UX data/action holes | PASS | 0 |
| Out-of-scope active leaks | PASS | 0 |
| Implementation blockers | PASS | 0 |

**Implementation readiness: READY FOR TECHNICAL BLUEPRINT.**

---

## 14 Final Freeze

```
GEI IMPLEMENTATION CONTRACT V1
FROZEN
```

Freeze gate verification:

- 0 unresolved implementation blockers ✓
- 0 active out/defer leaks ✓
- 0 active UC without implementation mapping ✓ (88/88)
- 0 implementation-relevant REQ unmapped ✓ (138/138)
- 0 Target UX data/action holes ✓
- All persisted fields defined ✓
- All derived fields identified ✓
- All relationships defined ✓
- All relevant lifecycle transitions defined ✓
- All commands defined ✓
- All command authority defined ✓
- All sensitive fields have PII rules ✓
- All material side effects defined ✓
- All business history/audit distinctions defined ✓
- All primary reads supported ✓

Product semantics FROZEN. Technical architecture NEXT. Visual composition STILL ITERABLE.

