# 18_ACCEPTANCE_AND_EVIDENCE_MATRIX.md

# Acceptance and Evidence Matrix

**Authority:** `10_MASTER_GAP_LEDGER.md`  
**Date:** 2026-10-22  
**Purpose:** Every gap has acceptance criteria + evidence required to close

---

## 1. EVIDENCE TYPES

| Code | Meaning |
|------|---------|
| `T` | Automated test (unit/table/invariant) |
| `R500` | Runtime capture at 500px |
| `R768` | Runtime capture at 768px |
| `R1200` | Runtime capture at 1200px |
| `R1440` | Runtime capture at 1440px |
| `RN` | Runtime navigation test (Back/origin) |
| `K` | Keyboard/AT test (axe/axe-core) |
| `G` | grep assertion |
| `B` | Backend evidence (403, contract) |
| `CO` | Computed styles |

---

## 2. ACCEPTANCE SUMMARY BY GAP

### P0 Gaps (11)

| Gap | Acceptance | Evidence |
|-----|-----------|----------|
| GLB-001 | 3 regimes at 4 widths; Calendar defaults; gutters 16/24/32; 0 overflow | R500/R768/R1200/R1440 + CO |
| GLB-010 | Filters/tab/month/query in URL; Back restores; deep link works | RN + URL inspection |
| GLB-011 | 0 `if(role===)`, 0 `capabilities.sport`, all 16 flags consumed; server 403 | G + T (5×21 table) + B |
| GLB-012 | Scope from RoleAssignment; COACH sees all own teams; forbidden hidden | T + R per role |
| GLB-020 | Attendance+MatchRecord+Announcement history visible with before/after+actor+reason+link | R + T |
| EVENT-001 | CANCELLED/POSTPONED/COMPLETED/ABANDONED own composition + consequence + no ¿Vas? | R ×4 states |
| EVENT-002 | Scope applied to occurrences + overrides; revision++ | R + T |
| PART-013 | Attendance correction shows before/after | R + T |
| PART-017 | MatchRecord correction shows before/after | R + T |
| COM-015 | Non-audience announcement → no-access | T + R |
| MGMT-011 | Guardian not shown as Player; correct scope text | R + T |

### P1 Gaps (92) — Representative

| Gap | Acceptance | Evidence |
|-----|-----------|----------|
| GLB-002 | Rail 768–1199, 72px, 5 dest, accessible | R768 + K |
| GLB-004 | No TopBar ≥1200; Search/Notif from Sidebar | R1200/R1440 |
| GLB-003 | 0 `text-[Npx]` in features; `.gei-*` everywhere | G + R1440 |
| GLB-005 | danger used for destructive; accent 4 reserved cases | G + R1440 |
| GLB-008 | ⌘K dialog ≥1200; query URL; Escape; focus trap | R1200 + K + RN |
| GLB-009 | Bell popover ≥1200 with recent + Ver todos | R1200 + K |
| GLB-013 | Inspector persists on selection Wide; Popover anchors | R1440 + K |
| GLB-014 | Dirty overlay close → confirm; clean direct | R + T |
| GLB-015 | `<form>` all forms; Enter submits; aria-invalid | G + R + K |
| GLB-016 | Menu role + Escape + click-out + focus + arrows | K |
| GLB-017 | focus-visible all controls; aria-checked/pressed | K |
| GLB-019 | 6 compositions with ≥2 consumers each | G + R |
| GLB-021 | Inline per field; aria-invalid/describedby; focus first error | R + T + K |
| GLB-022 | All gestures ≥44px | CO + R |
| GLB-025 | 8 types distinguishable; real dates | R + T |
| GLB-026 | CheckCheck after ack; failed+retry; no unconfirmed success | R + T |
| GLB-027 | Audit before/after + link + source + real date filter | R + T |
| GLB-AUTH-01 | Setup code generated, one active, activation→login | R + T |
| GLB-AUTH-03 | Profile 5 sections with real data | R ×roles |
| GLB-AUTH-05 | Guards before render; denied h1; correct hub | R per role |
| HOME-001..003,005,012 | (see domain file) | R per actor |
| CAL-001,002,004,005 | (see domain file) | R per regime |
| EVENT-003..016 | (see domain file) | R + T |
| JOR-002,003,004,006 | (see domain file) | T + R |
| PART-002,006..012,016 | (see domain file) | R + T |
| TEAM-003..010,013,016 | (see domain file) | R + T |
| COM-001,003,007..009,011..014,016,018,020,021,024 | (see domain file) | R + T |
| MORE-001,002,010,012,016 | (see domain file) | R + T |
| MGMT-001,002,004,006,007,009,011,013..016,018..019,022,023,025,026,028,030,031,034,035,038 | (see domain file) | R + T + B |

### P2/P3 Gaps (75)

Acceptance criteria listed per-gap in domain files `04`–`08` (updated post-decontamination).

---

## 3. TABLE TESTS REQUIRED (TEST-ONLY gaps)

| Test | Purpose | Gap |
|------|---------|-----|
| Authority matrix 5 roles × 21 rows | Reproduce Product Truth §5 | GLB-011 |
| Scope matrix role × scope | Object scope | GLB-012 |
| PII field matrix 10 fields × 7 viewers | §6 | TEAM-010 |
| Notification audience union | §22 | COM-012 |

---

## 4. RUNTIME EVIDENCE REQUIREMENTS

| Scenario | Viewports | Gaps |
|----------|-----------|------|
| Home per actor (PLAYER/CAPTAIN/COACH/SUBCOMMITTEE/ADMIN) | 500/768/1440 | HOME-*, MORE-*, GLB-AUTH-03 |
| Calendar per regime | 500/900/1200/1440 | CAL-*, GLB-001 |
| Terminal event states ×4 | 1440 | EVENT-001 |
| Selection conflict + publish | 1440 | PART-006, EVENT-012 |
| Attendance correction history | 1440 | PART-013 |
| MatchRecord correction history | 1440 | PART-017 |
| Conversation send/fail | 500 | COM-018, COM-021 |
| Announcement non-audience | 1440 | COM-015 |
| Audit entry complete | 1440 | GLB-027 |
| Denied route per role | 1440 | GLB-AUTH-05 |

> **Note:** GUARDIAN actor removed from runtime evidence requirements (OUT per Product Truth V1.1). See `21_TARGET_DRIFT_RECONCILIATION.md`.

---

## 5. DEFINITION OF DONE (Per Gap)

A gap is CLOSED only when:
1. Acceptance criteria met (evidence attached)
2. `typecheck` + `test` + `build` PASS
3. Runtime evidence captured at required viewports
4. No regression in dependent gaps
5. Ledger updated with `CLOSED` + evidence reference
6. `git diff --check` clean

---

## 6. EVIDENCE GAP

| Needed Evidence | Current Status |
|-----------------|----------------|
| 390px runtime | NOT achievable in env (OS min ~500) |
| Pointer/keyboard interaction | NOT automated (no Playwright/Puppeteer) |
| axe scan | NOT run |
| Backend 403 | N/A (no backend) |

**These are recorded honestly. All closures must state which evidence is manual vs automated.**

---

**Every gap in the ledger has acceptance + evidence-to-close defined (domain files + this matrix).**