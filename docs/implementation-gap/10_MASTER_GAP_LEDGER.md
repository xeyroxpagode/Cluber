# 10_MASTER_GAP_LEDGER.md

# MASTER GAP LEDGER — AUTHORITATIVE GAP REGISTRY

**Authority:** This document is the master authority for all REAL GAPS between CURRENT and TARGET.  
**Date:** 2026-10-22  
**Baseline SHA:** `ebba0b8` (HEAD `gei/v1.1-scope-reconciliation`)  
**Target:** `docs/target-ux/GEI_TARGET_UX_FREEZE_V1.0.md` + 5 Domain Freezes + Design System  
**Schema:** Defined in `03_GLOBAL_AUTH_CROSSDOMAIN_GAPS.md` (full 26-field schema)  
**Deduplication:** Systemic root causes (GLB-*) registered ONCE; domain gaps reference `DEPENDS ON GLB-XXX`  
**Decontamination:** See `21_TARGET_DRIFT_RECONCILIATION.md` — 13 OUT/DEFER gaps removed, 3 target-drift gaps rewritten, 1 reseveritied

---

## FINAL RECOUNT (Recomputed From Zero Post-Decontamination)

### Raw Enumerated Findings

| Domain File | Raw entries | P0 | P1 | P2 | P3 |
|-------------|-------------|----|----|----|----|
| Global/Auth/CrossDomain (03) | 30 | 5 | 19 | 6 | 0 |
| Home (04) | 12 | 0 | 6 | 6 | 0 |
| Calendar+Participation (05) | 47 | 4 | 23 | 19 | 1 |
| Teams (06) | 15 | 0 | 8 | 6 | 1 |
| Communication (07) | 27 | 1 | 13 | 11 | 2 |
| More+Management (08) | 49 | 0 | 25 | 20 | 4 |
| **RAW TOTAL** | **180** | **10** | **94** | **68** | **8** |

### Consolidation (Deduplication)

| Consolidated ID | Folded Into | Reason |
|-----------------|-------------|--------|
| HOME-012 | GLB-010 | Pure restatement of origin-aware Back root cause |
| TEAM-012 | GLB-010 | Pure restatement of origin-aware Back root cause |

**Consolidated: 2** (both duplicate the GLB-010 systemic root cause)

### FINAL DISTINCT GAP COUNT (Authoritative)

| Severity | Count |
|----------|-------|
| **P0** | 10 |
| **P1** | 92 |
| **P2** | 68 |
| **P3** | 8 |
| **TOTAL** | **178** |

### By Classification

| Classification | Count |
|----------------|-------|
| FRONTEND ONLY | 125 |
| BACKEND REQUIRED | 47 |
| DATA CONTRACT | (subset of backend, 13) |
| AUTHORITY | 12 |
| TEST ONLY | 4 |
| SHARED (systemic component) | 31 |
| LOCAL (feature component) | 148 |

### By Work Type

| Type | Count |
|------|-------|
| REUSE (exists, needs wiring) | 28 |
| MODIFY (exists, needs change) | 87 |
| CREATE (missing entirely) | 54 |
| REMOVE (wrong implementation) | 10 |

> **Verification:** P0(10) + P1(92) + P2(68) + P3(8) = 178 ✓

---

## SECTION A — SYSTEMIC ROOT-CAUSE GAPS (Registered Once)

These 31 entries are the systemic root causes. Domain gaps `DEPEND ON` these.

| ID | Severity | Classification | Type | Backend | Description |
|----|----------|----------------|------|---------|-------------|
| GLB-001 | P0 | RESPONSIVE | CREATE | No | 3 responsive regimes missing (Compact/Medium/Wide) |
| GLB-002 | P1 | NAVIGATION | CREATE | No | NavigationRail missing (Medium 72px) |
| GLB-003 | P1 | SHARED/VISUAL | MODIFY | No | Design System tokens not adopted (10 arbitrary sizes) |
| GLB-004 | P1 | RESPONSIVE | MODIFY | No | Wide global TopBar must disappear (Sidebar 240) |
| GLB-005 | P1 | VISUAL | MODIFY | No | Color accent not reserved; 0 danger |
| GLB-006 | P2 | CONTENT | MODIFY | No | Two state vocabularies |
| GLB-008 | P1 | OVERLAY | CREATE | No | Wide Search Command Dialog missing |
| GLB-009 | P1 | OVERLAY | CREATE | No | Wide Notification Popover missing |
| GLB-010 | P0 | NAVIGATION | CREATE | No | Origin-aware Back entirely missing (useSearchParams=0) |
| GLB-011 | P0 | AUTHORITY | MODIFY | Yes | Default-ALLOW / authority enforcement missing |
| GLB-012 | P0 | AUTHORITY | CREATE | Yes | Object-level scope exposure |
| GLB-013 | P1 | SHARED | CREATE | No | Popover + Inspector missing |
| GLB-014 | P1 | FEEDBACK | MODIFY | No | Sheet Escape bug (dirty discard without confirm) |
| GLB-015 | P1 | FORMS | MODIFY | No | Button default submit bug (no `<form>`) |
| GLB-016 | P1 | ACCESSIBILITY | MODIFY | No | Menu keyboard gap |
| GLB-017 | P1 | ACCESSIBILITY | MODIFY | No | Radio visible-focus gap |
| GLB-019 | P1 | SHARED | CREATE | No | Shared Target compositions missing (6 transverse) |
| GLB-020 | P0 | TRUST | MODIFY | Yes | History written but invisible (attendance/record) |
| GLB-021 | P1 | FORMS | CREATE | No | Inline validation / dirty / focus-to-error |
| GLB-022 | P1 | ACCESSIBILITY | MODIFY | No | Touch targets < 44px |
| GLB-023 | P2 | MOTION | CREATE | No | Causal motion missing |
| GLB-024 | P2 | CONTENT | MODIFY | No | Empty surfaces without copy |
| GLB-025 | P1 | CONTENT/STATE | MODIFY | Yes | Notification types not rendered |
| GLB-026 | P1 | TRUST/FEEDBACK | MODIFY | Yes | Fake success / optimistic confirmation |
| GLB-027 | P1 | TRUST | MODIFY | Yes | Audit fidelity (before/after, source, link) |
| GLB-AUTH-01 | P1 | AUTH | MODIFY | Yes | `/activate` code literal + no setup chain |
| GLB-AUTH-02 | P2 | AUTH | VERIFY | No | No self-service forgot-password enforcement |
| GLB-AUTH-03 | P1 | AUTH/CONTENT | CREATE | No | Profile Security section missing |
| GLB-AUTH-04 | P1 | AUTH (escalated) | MODIFY | Yes | DNI/birthDate self-recovery decision pending |
| GLB-AUTH-05 | P1 | AUTHORITY/NAV | MODIFY | No | Route guards incomplete |

---

## SECTION B — DOMAIN GAP INDEX

### Home (Domain 01) — 12 distinct

| ID | Sev | Class | Type | Backend | Depends On |
|----|-----|-------|------|---------|------------|
| HOME-001 | P1 | CONTENT/HIERARCHY | MODIFY | No | — |
| HOME-002 | P1 | STATE/CONTENT | MODIFY | No | — |
| HOME-003 | P1 | HIERARCHY | MODIFY | No | — |
| HOME-004 | P2 | VISUAL/DENSITY | MODIFY | No | — |
| HOME-005 | P1 | TRUST | REMOVE | No | GLB-027 |
| HOME-006 | P2 | NOISE | REMOVE | No | — |
| HOME-007 | P2 | CONTENT | MODIFY | No | — |
| HOME-008 | P2 | CONTENT | MODIFY | No | PART-001 |
| HOME-009 | P2 | STATE | MODIFY | No | — |
| HOME-010 | P2 | STATE/FEEDBACK | MODIFY | No | — |
| HOME-011 | P2 | VISUAL | MODIFY | No | GLB-019 |
| HOME-012 | P1 | CONTENT | MODIFY | No | GLB-024 |
| HOME-013 | P1 | NAVIGATION | CREATE | No | GLB-010 |
| ~~HOME-012~~ | — | consolidated | — | — | → GLB-010 |

> **Note:** HOME-013 (was Guardian empty surface) and HOME-014 (was Guardian selector) removed — Guardian OUT. Former HOME-012 (origin Back) consolidated into GLB-010. Numbering adjusted.

### Calendar + Participation (Domain 02) — 47

| ID | Sev | Class | Type | Backend | Depends On |
|----|-----|-------|------|---------|------------|
| CAL-001 | P1 | NAVIGATION/FLOW | MODIFY | No | — |
| CAL-002 | P1 | RESPONSIVE | MODIFY | No | GLB-001 |
| CAL-003 | P2 | CONTENT | MODIFY | No | GLB-005 |
| CAL-004 | P1 | RESPONSIVE | MODIFY | No | GLB-001 |
| CAL-005 | P1 | SHARED | CREATE | No | GLB-013 |
| CAL-006 | P2 | STATE/CONTENT | MODIFY | No | — |
| CAL-007 | P2 | TRUTH | MODIFY | No | — |
| CAL-008 | P3 | NAVIGATION | MODIFY | No | — |
| EVENT-001 | P0 | STATE | MODIFY | No | GLB-019 |
| EVENT-002 | P0 | FLOW/TRUST | MODIFY | Yes | EVENT-008 |
| EVENT-003 | P1 | CONTENT | MODIFY | No | — |
| EVENT-004 | P1 | FORMS | MODIFY | No | GLB-015, GLB-021 |
| EVENT-005 | P1 | FLOW | MODIFY | No | EVENT-012 |
| EVENT-006 | P1 | FLOW | MODIFY | No | — |
| EVENT-007 | P2 | NOTIFICATION | MODIFY | Yes | GLB-025 |
| EVENT-008 | P1 | FLOW | MODIFY | Yes | — |
| EVENT-009 | P1 | DATA CONTRACT | MODIFY | Yes | — |
| EVENT-010 | P1 | CONTENT | MODIFY | No | — |
| EVENT-011 | P2 | NAVIGATION | MODIFY | No | GLB-010 |
| EVENT-012 | P1 | FLOW | CREATE | Yes | EVENT-005 |
| EVENT-013 | P2 | DATA CONTRACT | MODIFY | Yes | — |
| EVENT-014 | P1 | ACCESSIBILITY | MODIFY | No | GLB-017 |
| EVENT-015 | P2 | CONTENT | MODIFY | No | — |
| EVENT-016 | P2 | DATA CONTRACT | MODIFY | No | — |
| JOR-001 | P2 | NAVIGATION | MODIFY | No | — |
| JOR-002 | P1 | TRUST | MODIFY | No | — |
| JOR-003 | P1 | FLOW/TRUST | MODIFY | Yes | — |
| JOR-004 | P1 | FLOW | CREATE | Yes | — |
| JOR-005 | P2 | FEEDBACK | MODIFY | No | — |
| JOR-006 | P1 | DATA CONTRACT | MODIFY | Yes | — |
| PART-001 | P2 | CONSISTENCY | MODIFY | No | — |
| PART-002 | P1 | TRUST | MODIFY | Yes | GLB-026 |
| PART-003 | P2 | STATE | MODIFY | No | — |
| PART-004 | P2 | CONTENT | MODIFY | No | — |
| PART-005 | P1 | FLOW | MODIFY | Yes | PART-007 |
| PART-006 | P1 | VISUAL/STATE | MODIFY | No | — |
| PART-007 | P2 | DENSITY | MODIFY | No | — |
| PART-008 | P1 | VISUAL | MODIFY | No | — |
| PART-009 | P1 | FLOW | MODIFY | Yes | — |
| PART-010 | P1 | FLOW | MODIFY | No | — |
| PART-011 | P1 | ACCESSIBILITY | MODIFY | No | GLB-022 |
| PART-012 | P0 | TRUST | MODIFY | No | GLB-020 |
| PART-013 | P2 | DATA CONTRACT | MODIFY | Yes | — |
| PART-014 | P2 | TRUST | MODIFY | No | PART-012 |
| PART-015 | P1 | FLOW | MODIFY | No | — |
| PART-016 | P0 | TRUST | MODIFY | No | GLB-020 |
| PART-017 | P2 | FLOW | MODIFY | No | — |
| PART-018 | P2 | FLOW | MODIFY | Yes | — |

> **Note:** PART-005 (Guardian delegation) removed — Guardian OUT. PART numbering compressed.

### Teams (Domain 03) — 15 distinct

| ID | Sev | Class | Type | Backend | Depends On |
|----|-----|-------|------|---------|------------|
| TEAM-001 | P2 | CONTENT | MODIFY | No | GLB-019 |
| TEAM-002 | P2 | CONTENT | MODIFY | No | — |
| TEAM-003 | P1 | FLOW | MODIFY | No | — |
| TEAM-004 | P1 | ACCESSIBILITY | MODIFY | No | GLB-016 |
| TEAM-005 | P1 | FLOW | MODIFY | No | — |
| TEAM-006 | P2 | CONTENT | MODIFY | No | GLB-006 |
| TEAM-007 | P1 | DATA CONTRACT | MODIFY | No | — |
| TEAM-008 | P1 | FLOW | MODIFY | No | — |
| TEAM-009 | P1 | FLOW | MODIFY | No | — |
| TEAM-010 | P1 | AUTHORITY/PII | MODIFY | Yes | GLB-011 |
| TEAM-011 | P2 | RESPONSIVE | MODIFY | No | GLB-001, GLB-013 |
| TEAM-013 | P2 | CONTENT | MODIFY | No | — |
| TEAM-015 | P3 | CONTENT | MODIFY | No | — |
| TEAM-016 | P1 | DATA CONTRACT | VERIFY | No | — |
| ~~TEAM-012~~ | — | consolidated | — | — | → GLB-010 |

> **Note:** TEAM-014 (Guardian team access) removed — Guardian OUT.

### Communication (Domain 04) — 27

| ID | Sev | Class | Type | Backend | Depends On |
|----|-----|-------|------|---------|------------|
| COM-001 | P1 | HIERARCHY | MODIFY | No | — |
| COM-002 | P2 | NOISE | REMOVE | No | — |
| COM-003 | P1 | VISUAL | MODIFY | No | GLB-019 |
| COM-004 | P3 | STATE | MODIFY | No | — |
| COM-005 | P2 | STATE | MODIFY | No | — |
| COM-006 | P2 | ACCESSIBILITY | MODIFY | No | — |
| COM-007 | P1 | HIERARCHY | MODIFY | No | — |
| COM-008 | P1 | FLOW | MODIFY | No | — |
| COM-009 | P1 | DATA CONTRACT | MODIFY | Yes | GLB-012 |
| COM-010 | P2 | CONTENT | MODIFY | No | — |
| COM-011 | P1 | FLOW | CREATE | Yes | — |
| COM-012 | P1 | DATA CONTRACT | MODIFY | Yes | GLB-025 |
| COM-013 | P1 | HIERARCHY | MODIFY | No | — |
| COM-014 | P1 | FLOW | CREATE | Yes | — |
| COM-015 | P0 | AUTHORITY | MODIFY | Yes | GLB-011 |
| COM-016 | P1 | FLOW | MODIFY | Yes | — |
| COM-017 | P2 | VISUAL | MODIFY | No | GLB-005 |
| COM-018 | P1 | TRUST/FEEDBACK | MODIFY | Yes | GLB-026 |
| COM-019 | P2 | TRUST | REMOVE | Yes | — |
| COM-020 | P1 | DATA CONTRACT | MODIFY | Yes | — |
| COM-021 | P2 | TRUTH | MODIFY | No | — |
| COM-022 | P2 | FLOW | CREATE | Yes | — |
| COM-023 | P2 | COPY | REMOVE | No | GLB-006 |
| COM-024 | P1 | CONTENT/STATE | MODIFY | Yes | GLB-025 |
| COM-025 | P2 | FLOW | MODIFY | No | — |
| COM-026 | P2 | COPY | REMOVE | No | GLB-006 |
| COM-027 | P2 | NOTIFICATION | VERIFY | Yes | GLB-025 |

> **Note:** COM-028 (Guardian Communication tab) removed — Guardian OUT. COM-004 rewritten: target now "last activity DESC; unread = presentation only".

### More + Management (Domain 05) — 49

| ID | Sev | Class | Type | Backend | Depends On |
|----|-----|-------|------|---------|------------|
| MORE-001 | P1 | AUTH/CONTENT | CREATE | Yes | GLB-011 |
| MORE-002 | P1 | CONTENT | MODIFY | No | MORE-001 |
| MORE-003 | P2 | TRUTH | MODIFY | No | — |
| MORE-004 | P2 | DENSITY | MODIFY | No | MORE-001 |
| MORE-005 | P2 | NAVIGATION | MODIFY | No | — |
| MORE-007 | P2 | CONSISTENCY | MODIFY | No | GLB-006 |
| MORE-008 | P3 | CONSISTENCY | MODIFY | No | GLB-006 |
| MORE-009 | P2 | CONSISTENCY | MODIFY | No | — |
| MORE-010 | P1 | NAVIGATION | MODIFY | No | GLB-010 |
| MORE-011 | P2 | FLOW | MODIFY | Yes | — |
| MORE-012 | P1 | CONTENT/STATE | MODIFY | Yes | GLB-025 |
| MORE-013 | P2 | TRUTH | MODIFY | Yes | GLB-025 |
| MORE-014 | P2 | DATA CONTRACT | MODIFY | Yes | GLB-025 |
| MORE-015 | P3 | NOTIFICATION | MODIFY | Yes | GLB-025 |
| MORE-016 | P1 | OVERLAY | CREATE | No | GLB-009 |
| MGMT-001 | P1 | AUTH/NAV | MODIFY | No | GLB-AUTH-05 |
| MGMT-002 | P1 | AUTH/NAV | MODIFY | No | GLB-AUTH-05 |
| MGMT-003 | P2 | IA | MODIFY | No | — |
| MGMT-004 | P1 | ACCESSIBILITY | MODIFY | No | GLB-016 |
| MGMT-005 | P2 | TRUTH | MODIFY | No | — |
| MGMT-006 | P1 | FLOW | CREATE | Yes | — |
| MGMT-007 | P1 | FLOW | CREATE | Yes | — |
| MGMT-008 | P2 | DATA CONTRACT | MODIFY | No | EVENT-016 |
| MGMT-009 | P1 | SAFETY | MODIFY | No | GLB-014 |
| MGMT-010 | P2 | DATA CONTRACT | MODIFY | No | — |
| MGMT-011 | P1 | TRUST | MODIFY | No | GLB-011 |
| MGMT-012 | P2 | PII/CONTENT | MODIFY | No | GLB-011 |
| MGMT-013 | P1 | RESPONSIVE/NAV | MODIFY | No | GLB-010 |
| MGMT-014 | P1 | ACCESSIBILITY | MODIFY | No | — |
| MGMT-015 | P1 | AUTH/FLOW | CREATE | Yes | GLB-AUTH-01 |
| MGMT-016 | P1 | AUTHORITY | MODIFY | No | — |
| MGMT-017 | P3 | COPY | MODIFY | No | GLB-006 |
| MGMT-018 | P1 | HIERARCHY/SAFETY | MODIFY | No | GLB-005 |
| MGMT-019 | P1 | SAFETY | MODIFY | No | — |
| MGMT-022 | P1 | TRUST | CREATE | Yes | GLB-020 |
| MGMT-023 | P2 | COPY | MODIFY | No | — |
| MGMT-025 | P1 | AUTHORITY/SAFETY | MODIFY | Yes | — |
| MGMT-026 | P2 | CONTENT | MODIFY | No | — |
| MGMT-028 | P2 | HIERARCHY | MODIFY | No | — |
| MGMT-030 | P1 | ACCESSIBILITY | MODIFY | No | GLB-019 |
| MGMT-031 | P1 | TRUTH | MODIFY | Yes | — |
| MGMT-032 | P2 | FLOW/NAV | MODIFY | No | GLB-010 |
| MGMT-033 | P2 | FLOW | MODIFY | No | — |
| MGMT-034 | P1 | TRUST | MODIFY | Yes | GLB-027 |
| MGMT-035 | P1 | TRUTH | MODIFY | Yes | — |
| MGMT-036 | P2 | PII | MODIFY | Yes | GLB-011 |
| MGMT-037 | P3 | IA | VERIFY | No | — |
| MGMT-038 | P1 | DATA CONTRACT | MODIFY | Yes | GLB-012 |
| MGMT-039 | P2 | RESPONSIVE/NAV | MODIFY | No | GLB-004 |
| MGMT-040 | P2 | ACCESSIBILITY | MODIFY | No | GLB-AUTH-05 |
| MGMT-041 | P3 | COPY | VERIFY | No | GLB-006 |

> **Note:** MORE-006 (SUBCOMMITTEE Eligibility), MGMT-020 (Eligibility constraints), MGMT-021 (Guardian section), MGMT-024 (SUBCOMMITTEE Eligibility denied), MGMT-027 (CompetitionEntry LINE/TEAM), MGMT-029 (Competition scope mismatch) removed — Eligibility/Guardian/CompetitionEntry OUT. MGMT-011 reseveritied P0→P1.

---

## SECTION C — DEPENDENCY SUMMARY

### Gaps with NO dependencies (can start immediately): 96
### Gaps depending on GLB-011 (authority): 12
### Gaps depending on GLB-010 (origin Back): 6
### Gaps depending on GLB-025 (notification types): 8
### Gaps depending on GLB-020 (history visible): 4
### Gaps depending on GLB-019 (compositions): 5
### Gaps depending on GLB-001/004 (responsive): 8

> **Note:** PG-03 (guardian backend) and PG-04 (competition entry backend) dependencies removed — Guardian/CompetitionEntry OUT.

Full graph in `17_IMPLEMENTATION_DEPENDENCY_GRAPH.md`.

---

## SECTION D — BACKEND REQUIRED LIST (47)

| Capability | Gap IDs |
|------------|---------|
| Authority enforcement | GLB-011, GLB-012, TEAM-010, COM-015, MGMT-024, MGMT-036, MGMT-011, PART-005 |
| EventSeries bulk apply | `ApplyEventChange(scope, patch, impactToken)` with occurrence overrides | EVENT-002, EVENT-008, EVENT-009, EVENT-012, EVENT-013 |
| Jornada validation / expectedVersion | JOR-003, JOR-004, JOR-006 |
| Selection / availability persistence | PART-002, PART-005, PART-009, PART-013, PART-018 |
| Communication persistence | COM-009, COM-011, COM-012, COM-014, COM-016, COM-018, COM-019, COM-020, COM-023, COM-024, COM-027 |
| Notifications | GLB-025, EVENT-007, MORE-011, MORE-012, MORE-013, MORE-014, MORE-015, COM-024, COM-027 |
| Audit / history before-after | GLB-020, GLB-027, MGMT-022, MGMT-034, MGMT-035 |
| Auth / setup token | GLB-AUTH-01, GLB-AUTH-04, MGMT-015 |
| Structure / competition | MGMT-006, MGMT-007, MGMT-020, MGMT-025, MGMT-031 |
| Event restructure | EVENT-016 (venue fields), MGMT-008 |

> **Note:** Guardian relationships (PG-03), CompetitionEntry (PG-04), Eligibility backend removed — OUT scope.

---

## SECTION E — PRODUCT-TRUTH-ESCALATED (Not Design Questions)

These are **implementation/backend decisions**, explicitly NOT Target UX design questions:

| ID | Escalated Question | Owner |
|----|--------------------|-------|
| GLB-AUTH-04 | Can a player self-load own DNI/birthDate? (Product Truth §6 says DNI=ADMIN) | Product Truth |
| PG-06 | Recovery path for `PLAYER_PROFILE_INCOMPLETE` | Product Truth + Backend |
| PG-01 | ApplyEventChange command signature | Backend |
| PDC-01..05 | Notification prefs, nudge, undo, reactions, personal timeline | Deferred (documented) |

**Design questions open: 0. Product questions requiring freeze reopening: 0 (GLB-AUTH-04 is a backend policy detail, resolvable within §6 architecture).**

---

## LEDGER AUTHORITY

This ledger is frozen at `19_MASTER_IMPLEMENTATION_FREEZE.md`. Any new gap discovered during implementation must be appended here with a new ID before being worked.

**TOTAL: 178 gaps — P0: 10 · P1: 92 · P2: 68 · P3: 8**

> **Post-decontamination recount:** Removed 13 OUT/DEFER gaps, rewrote 3 target-drift gaps, reseveritied 1 gap (MGMT-011 P0→P1). See `21_TARGET_DRIFT_RECONCILIATION.md`.