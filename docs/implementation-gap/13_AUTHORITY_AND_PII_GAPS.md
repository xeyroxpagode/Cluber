# 13_AUTHORITY_AND_PII_GAPS.md

# Authority and PII Gaps

**Authority:** `GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_1.md` §5, §6, §16 + `docs/target-ux/GEI_TARGET_UX_FREEZE_V1.0.md`  
**Date:** 2026-10-22

---

## 1. AUTHORITY ARCHITECTURE GAPS

### GLB-011 — Default-ALLOW / Authority Enforcement (P0)
- **Frontend representation gap:** `getAllowedActions` exists (16 flags), 1 consumed. UI reimplements with 4 booleans + `capabilities.sport`.
- **Backend enforcement gap:** No server; Product Truth requires server-side default DENY.
- **Required:** single source, default DENY, object scope, field authority, PII.
- **Source:** `GEI_TARGET_UX_FREEZE_V1.0.md` Authority Semantics.
- **Acceptance:** 0 `if (role===)`, 0 `capabilities.sport` gating, all 16 flags consumed, server enforces.

### GLB-012 — Object-Level Scope (P0)
- **Gap:** No object scope; `Person.team` as proxy → COACH with 2 teams sees 1.
- **Required:** `getAllowedActions({ scope: EVENT, targetId, objectState })`.
- **Acceptance:** scope from RoleAssignment; COACH sees all own teams.

### GLB-AUTH-05 — Route Guards (P1)
- **Gap:** In-page gating with misleading breadcrumb; denied screen no h1.
- **Required:** guard before render; h1; correct hub per role.

---

## 2. AUTHORITY MATRIX (Frozen — from Product Truth §5)

| Capability | PLAYER | CAPTAIN | COACH | SUBCOMMITTEE | ADMIN |
|-----------|--------|---------|-------|--------------|-------|
| Availability (own) | ✓ | ✓ | ✓ | — | — |
| Availability (respond) | — | — | — | — | — |
| Selection manage | — | — | ✓ (own teams) | — | — |
| Attendance manage | — | — | ✓ (own teams) | — | — |
| MatchRecord manage | — | — | ✓ (own teams) | — | — |
| Event create/edit | — | — | ✓ (own teams) | ✓ | — |
| Jornada | — | — | ✓ | ✓ | — |
| Announcement publish | — | — | — | ✓ | — |
| Conversation | participants | participants | participants | — | — |
| Eligibility status view | — | — | ✓ (scope) | ✓ | ✓ |
| Eligibility mutate | — | — | — | ✓ | ✓ |
| Eligibility reason/source | — | — | — | ✓ | ✓ |
| Structure | — | — | — | — | ✓ |
| People/Accounts | — | — | — | — | ✓ |
| Competitions | read | read | read | ✓ | ✓ |
| Audit | — | — | — | — | ✓ |
| Reports | ✓ | ✓ | ✓ | ✓ | ✓ |

**Current gaps:** SUBCOMMITTEE→Eligibility denied (MGMT-024); ADMIN not sports superuser not enforced consistently (GLB-011); COACH scope partial (GLB-012).

---

## 3. PII FIELD AUTHORITY MATRIX (Frozen — Product Truth §6)

| Field | PLAYER(self) | PLAYER(other) | CAPTAIN | COACH(own team) | SUBCOMMITTEE | ADMIN | GUARDIAN(delegated) |
|-------|--------------|---------------|---------|-----------------|--------------|-------|---------------------|
| Name | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Role/Team | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Username | ✓ | — | — | — | — | ✓ | — |
| DNI | — | — | — | — | — | ✓ | — |
| BirthDate | — | — | — | — | — | ✓ | — |
| Phone/Email | ✓ | — | — | ✓ (operational) | — | ✓ | ✓ (if canViewChildInfo) |
| GuardianRelationship | ✓ (self) | — | — | — | — | ✓ | ✓ (self) |
| Eligibility status | — | — | — | ✓ (scope) | ✓ | ✓ | — |
| Eligibility reason/source | — | — | — | — | ✓ | ✓ | — |
| Message body | participant | participant | participant | participant | — | — | — |
| Audit sensitive | — | — | — | — | — | ✓ (redacted) | — |

**Gaps:**
- GLB-011: `getVisibleFields` not implemented (0 `canView*` consumers).
- TEAM-010: PersonDetail PII not field-enforced.
- MGMT-036: Audit reason not redacted.
- MGMT-012: PII leaking into People list.
- MGMT-011: Guardian shown as "Jugadora" (false identity).

---

## 4. AUTHORITY GAP LIST

| Gap ID | Severity | Nature | Backend |
|--------|----------|--------|---------|
| GLB-011 | P0 | Representation + enforcement | Yes |
| GLB-012 | P0 | Object scope | Yes |
| GLB-AUTH-05 | P1 | Route guards | No |
| TEAM-010 | P1 | PII matrix | Yes |
| MGMT-011 | P0 | False identity (guardian=player) | No |
| MGMT-012 | P2 | PII in list | No |
| MGMT-024 | P1 | SUBCOMMITTEE eligibility denied | Yes |
| MGMT-036 | P2 | Audit reason redaction | Yes |
| HOME-014 | P1 | Guardian delegation access | Yes |
| TEAM-014 | P1 | Guardian team access | Yes |
| PART-005 | P1 | Guardian respond availability | Yes |
| COM-015 | P0 | Announcement audience not access control | Yes |
| COM-009 | P1 | cross-division candidate (person.role) | Yes |
| MGMT-038 | P1 | person.team/role selectors | Yes |

**Total AUTHORITY-classified gaps: 12 (+ 2 P0 root causes).**

---

## 5. PII ESCALATION

| Item | Status | Owner |
|------|--------|-------|
| DNI self-load by player | Product Truth §6 says DNI=ADMIN → recovery path needs policy decision | Product Truth (GLB-AUTH-04) |
| Guardian sees child phone/email | Product Truth §6 ambiguous → implement only if `canViewChildInfo` | Product Truth (documented PG-03) |

**Neither is a Target UX design question — both are Product Truth/backend policy details.**