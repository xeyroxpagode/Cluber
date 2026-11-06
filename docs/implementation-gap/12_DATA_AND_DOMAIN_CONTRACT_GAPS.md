# 12_DATA_AND_DOMAIN_CONTRACT_GAPS.md

# Data and Domain Contract Gaps

**Authority:** `GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_1.md`, `docs/target-ux/*`  
**Date:** 2026-10-22  
**Scope:** Model, contracts, backend commands implied by Target UX

---

## 1. DOMAIN MODEL GAPS

| Model Entity | Current State | Target | Gap IDs |
|--------------|---------------|--------|---------|
| `Person` | Has `team`/`role` derived selectors | Remove selectors; derive from assignments | MGMT-038, GLB-012 |
| `Account` | `credentialVersion` exists | Setup token: one active per account | GLB-AUTH-01, MGMT-015 |
| `Membership` | Exists but no surface | Surface + create/end as distinct op | MORE-001, MGMT-015 |
| `Team` | `team.division`/`name` mutable | Identity immutable; new identity = new team | TEAM-016 |
| `Venue` | Name only | `address`, `fieldLabel`, archivedAt | EVENT-016, MGMT-008 |
| `Season` | `archivedAt` only | `startsOn`/`endsOn` | MGMT-005, MGMT-008 |
| `Event` | `targetTeams[]`/`targetPersonIds[]` | Complete plural + clubWide reader | EVENT-009 |
| `EventSeries` | `eventSeries[]` + `seriesId` | Occurrences + `event_occurrence_overrides` | EVENT-008 |
| `Match` | `competitionId` optional | `Match Team.season = Jornada.season` validation | JOR-006 |
| `Announcement` | Audience as string | `AudienceSnapshot { clubWide, teamIds[] }` + `readBy` | COM-012, COM-014 |
| `Announcement` | No revision | `revision` + notif on correction | COM-016 |
| `Conversation` | `unread` counter invented | Derive from messages + participant | COM-004 |
| `Conversation` | No `lastReadAt` | Per-participant read state | COM-004, COM-023 |
| `Notification` | `type` exists, not rendered | Render 8 types + template + real occurredAt | GLB-025, COM-024 |
| `Notification` | No unique logical key | `origin_event_id + recipient + type` | MORE-014 |
| `Message` | No send state | Optimistic + ack + failed | COM-018 |
| `AttendanceEntry` | before/after written | Render history | PART-013, GLB-020 |
| `MatchRecord` | before/after written | Render history | PART-017, GLB-020 |
| `AuditEntry` | No before/after/source | Full audit entry | GLB-027, MGMT-034 |

> **Note:** `Person.eligibility`, `GuardianRelationship`, `CompetitionEntry` rows removed — Eligibility/Guardian/CompetitionEntry OUT per Product Truth V1.1.

---

## 2. BACKEND COMMANDS REQUIRED

| Command | Purpose | Gap IDs | Complexity |
|---------|---------|---------|-----------|
| `getAllowedActions(actor, resource, field, objectState)` | Authority single source | GLB-011, GLB-012 | L |
| `getVisibleFields(subject, viewer)` | PII field authority | GLB-011, TEAM-010, MGMT-036 | M |
| `ApplyEventChange(scope, patch, impactToken)` | EventSeries bulk + overrides | EVENT-002, EVENT-008 | L |
| `CreateEventSeries` / `generateOccurrences` | Series creation | EVENT-008 | M |
| `issueSetupToken` / `activateWithCode` | Auth setup (no auto-login) | GLB-AUTH-01, MGMT-015 | M |
| `changeOwnPassword` | Authenticated password change | GLB-AUTH-03 | S |
| `CreateMembership` / `EndMembership` | Distinct from TeamAssignment | MORE-001, MGMT-015 | S |
| `CreateTeam(season, division, line)` | Team creation | MGMT-006 | S |
| `RestoreArchived(entity)` | Restore | MGMT-007 | S |
| `publishSelection(publishWithConflict)` | Selection publish | PART-006, PART-010 | M |
| `createConversation(TEAM/EVENT canonical)` | Canonical conversations | COM-011 | M |
| `findOrOpenDirect(pairKey)` | DIRECT canonical | COM-008 | S |
| `acknowledgeAnnouncement` | Acuse | COM-014 | S |
| `publishAnnouncement(audienceSnapshot)` | Audience resolution | COM-012 | M |
| `correctAnnouncement(revision++)` | Announcement correction | COM-016 | M |
| `sendMessage` (optimistic/ack/failed) | Chat states | COM-018 | M |
| `markNotificationRead` | Non-navigating read | COM-025 | S |
| `emitNotification(type, template)` | 8 types + unique key | GLB-025, MORE-014 | M |
| `writeAudit(before, after, source)` | Audit fidelity | GLB-027, MGMT-034 | M |
| `closeAttendance` (UNRECORDED preserved) | Attendance | PART-013 | S |
| `correctAttendance(motive, before/after)` | Attendance correction | PART-013, PART-015 | S |
| `finalizeMatchRecord` / `correctMatchRecord` | MatchRecord | PART-017 | S |

> **Note:** `CreateGuardianRelationship`, `CreateEntry`, `respondAvailability` (guardian) removed — Guardian/CompetitionEntry OUT.

---

## 3. DATA CONTRACT CHANGES (13)

| # | Contract | Change | Gap IDs |
|---|----------|--------|---------|
| 1 | Person→assignments | Remove `team`/`role` authority | MGMT-038 |
| 2 | Account | setup token | GLB-AUTH-01 |
| 3 | Membership | distinct from TeamAssignment | MORE-001 |
| 4 | Team | immutable identity | TEAM-016 |
| 5 | Venue | address/fieldLabel | EVENT-016 |
| 6 | EventSeries | occurrence overrides | EVENT-008 |
| 7 | Announcement | AudienceSnapshot + readBy + revision | COM-012, COM-014 |
| 8 | Conversation | derived unread + lastReadAt | COM-004 |
| 9 | Notification | unique logical key + template | MORE-014 |
| 10 | Message | send state | COM-018 |
| 11 | AuditEntry | before/after/source | GLB-027 |
| 12 | AttendanceEntry | rendered history | PART-013 |
| 13 | MatchRecord | rendered history | PART-017 |

> **Note:** Eligibility, GuardianRelationship, CompetitionEntry, Selection, Jornada rows removed — Eligibility/Guardian/CompetitionEntry OUT.

---

## 4. DOMAIN CONTRACT GAPS (UX-level)

| Contract | Current | Target | Gap |
|----------|---------|--------|-----|
| Surface selection | ad-hoc modals | ROUTE/SHEET/MODAL/INLINE/OVERFLOW/DEDICATED | GLB-013, EVENT-012 |
| State grammar | partial enums | 7 domain lifecycles complete | PART-003, CAL-006 |
| Authority formula | 4 booleans | ROLE+ACTION+SCOPE+STATE+FIELD+PII+SOURCE | GLB-011 |
| PII matrix | partial | 10-field matrix per §6 | TEAM-010, MGMT-036 |
| Notification audience | incomplete | old∪new∪selection∪availability∪staff | COM-012 |
| Unique notification key | absent | origin+recipient+type | MORE-014 |

---

**Total DATA/DOMAIN CONTRACT gaps: 13 (+ all backend-required listed above).**