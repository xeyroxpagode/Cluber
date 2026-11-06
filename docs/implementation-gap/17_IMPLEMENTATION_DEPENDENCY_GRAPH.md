# 17_IMPLEMENTATION_DEPENDENCY_GRAPH.md

# Implementation Dependency Graph

**Authority:** `10_MASTER_GAP_LEDGER.md`  
**Date:** 2026-10-22

---

## 1. ROOT-CAUSE LAYER (No dependencies — start here)

These are the systemic foundations. Nothing can be correctly implemented before them.

```
ROOT LAYER
├── GLB-001  3 responsive regimes
├── GLB-003  Design tokens adoption
├── GLB-005  Color accent reservation
├── GLB-006  Single state vocabulary
├── GLB-010  Origin-aware Back (URL state)
├── GLB-011  Authority enforcement (frontend)
├── GLB-012  Object scope
├── GLB-014  Dirty discard guard
├── GLB-015  Form wrappers
├── GLB-016  Menu keyboard
├── GLB-017  Radio focus
├── GLB-019  Shared compositions
├── GLB-021  Inline validation
├── GLB-022  Touch targets 44px
├── GLB-023  Causal motion
├── GLB-024  Empty copy
└── BACKEND: getAllowedActions, getVisibleFields, writeAudit, emitNotification
```

---

## 2. DEPENDENCY GRAPH

```
GLB-011 (authority) ──┬── GLB-012 (object scope)
                      ├── GLB-AUTH-05 (route guards) ── MGMT-001, MGMT-002, MGMT-040
                      ├── TEAM-010 (PII matrix) ── MGMT-012, MGMT-036
                      ├── COM-015 (announcement access)
                      ├── MGMT-038 (person.team/role) ── COM-009
                      └── MORE-001 (profile sections) ── MORE-002, MORE-004, GLB-AUTH-03

GLB-010 (origin Back) ── HOME-012*, TEAM-012*, EVENT-011, MGMT-013, MGMT-032, MORE-010
GLB-019 (compositions) ── EVENT-001, HOME-011, COM-003, MGMT-030, CAL-005
GLB-020 (history visible) ── PART-013, PART-015, PART-017, MGMT-022
GLB-025 (notification types) ── COM-012, COM-024, MORE-012, MORE-013, MORE-014, MORE-015, EVENT-007
GLB-026 (fake success) ── PART-002, COM-018
GLB-027 (audit fidelity) ── HOME-005, MGMT-034, MGMT-035
GLB-013 (Popover/Inspector) ── GLB-009, CAL-005, TEAM-011
GLB-001 (regimes) ── GLB-002, GLB-004, CAL-002, CAL-004, TEAM-011, COM-021
GLB-004 (wide topbar) ── GLB-008, GLB-009, MGMT-039

EVENT-002 (scope apply) ── EVENT-008 (series occurrences) ── EVENT-012 (conflict workspace)
EVENT-012 ── EVENT-005 (draft preserved)
PART-007 ── PART-006 (publish with conflict)
PART-013 ── PART-015 (true copy)

GLB-AUTH-01 (setup token) ── MGMT-015
```

`*` = consolidated into GLB-010.

> **Note:** PG-03 (guardian backend) and PG-04 (competition entry backend) removed — Guardian/CompetitionEntry OUT. MGMT-024 (subcommittee eligibility) removed — Eligibility OUT.

---

## 3. CRITICAL PATH

```
1. Backend contracts: getAllowedActions, getVisibleFields, writeAudit, emitNotification
2. GLB-011 + GLB-012 (authority) 
3. GLB-019 (compositions) + GLB-001 (regimes) + GLB-010 (URL state)
4. GLB-020 (history) + GLB-025 (notifications) + GLB-027 (audit)
5. Domain gap closure (Home, Calendar, Teams, Communication, Management)
6. GLB-003/005/006/021/022/023 (visual/forms/a11y/motion polish)
```

---

## 4. GAPS WITH NO DEPENDENCIES (Can start immediately)

Count: **96** (all gap IDs not listed as dependent above).

Includes most local feature fixes: HOME-001..011, CAL-001,003,006,007,008, EVENT-003,004,006,009,010,014,015,016, JOR-001,002,004, PART-001,003,004,008,009,011,012,014,016,018,019, TEAM-001..009,013,015,016, COM-001,002,004,005,006,007,008,010,011,013,014,016,017,019,020,021,022,023,025,026,027,028, MORE-003,005,006,007,008,009,011,016, MGMT-003,004,005,006,007,008,009,010,011,014,016,017,018,019,020,023,025,026,028,031,033,037,041.

---

## 5. IMPLEMENTATION SLICES (Proposed Order)

| Slice | Scope | Gaps | Depends |
|-------|-------|------|---------|
| S0 | Baseline git | — | — |
| S1 | Decisions | — | — |
| S2 | Foundation (deps, tokens, router, clock, primitives) | GLB-003, GLB-015, GLB-017, GLB-021, GLB-022 | — |
| S3 | Mock state + commands + authority + notifications | GLB-011, GLB-012, GLB-020, GLB-025, GLB-027 | S2 |
| S4 | Correctness (6 P0) | EVENT-001, EVENT-002, PART-013, PART-017, COM-015 | S3 |
| S5 | Missing surfaces | MORE-001, MGMT-006, MGMT-007, MGMT-015, MGMT-020, MGMT-021, EVENT-008, EVENT-009 | S3 |
| S6 | Core flows | CAL-001, PART-006, COM-008, COM-011, COM-018, JOR-004, MGMT-024, EVENT-012 | S5 |
| S7 | Permissions/states | GLB-AUTH-05, TEAM-010, MGMT-038, COM-012, PART-003 | S6 |
| S8 | Responsive | GLB-001, GLB-002, GLB-004, GLB-008, GLB-009, GLB-013, CAL-004, COM-021 | S7 |
| S9 | Visual polish | GLB-005, GLB-006, GLB-024, GLB-023, remaining P2 | S8 |
| S10 | Final QA | full matrix | S9 |

---

## 6. BLOCKING ANALYSIS

| Blocker | Blocks | Resolution |
|---------|--------|------------|
| Backend getAllowedActions | 12 gaps | Backend team |
| Backend writeAudit before/after | 5 gaps | Backend team |
| Backend notification emit | 8 gaps | Backend team |
| Product Truth §6 DNI decision (GLB-AUTH-04) | 1 gap | Product decision |

**No blocker prevents frontend from starting** — backend contracts can be mocked first, then swapped.

> **Note:** PG-03 guardian backend (4 gaps) and PG-04 competition entry backend removed — OUT scope.

---

**Graph complete. No circular dependencies. 96 immediate-start gaps.**