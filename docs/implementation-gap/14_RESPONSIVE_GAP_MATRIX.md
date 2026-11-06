# 14_RESPONSIVE_GAP_MATRIX.md

# Responsive Gap Matrix

**Authority:** `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §4.2`  
**Date:** 2026-10-22  
**Frozen regimes:** Compact `<768` · Medium `768–1199` · Wide `>=1200`

---

## 1. REGIME SPECIFICATION

| Metric | Compact | Medium | Wide | CURRENT |
|--------|---------|--------|------|---------|
| TopBar | 56px | — | — | Present everywhere |
| BottomNav | 64px + safe | — | — | Present <1024 |
| NavigationRail | — | 72px | — | MISSING |
| Sidebar | — | — | 240px | 224px @1024 |
| Gutter | 16px | 24px | 32px | Uniform |
| Content max | 100% | 100% | 1440 centered | max-w-[1440] |
| Calendar default | Agenda | Semana | Mes | Agenda/mes only |
| Month view | day+rows | grid+sel | full grid | static |
| Event→Participation | Detail | Detail | Inspector | none |
| Conversation | Workspace | Workspace | Rail+Workspace | none |
| Tables | row lists | DataTable | DataTable sticky | partial |
| Forms | 1col sticky | 1-2col | form+impact | partial |
| Modal | full-screen | 560px | 640px | mixed |
| Sheet | ~90vh bottom | side/bottom | side | bottom |

> **Correction:** Medium regime has NO global TopBar and NO BottomNav — NavigationRail 72px only. Previous table incorrectly showed TopBar 56px + BottomNav 64px for Medium.

---

## 2. RESPONSIVE GAP LIST

| Gap ID | Regime Affected | Current | Target | Severity |
|--------|-----------------|---------|--------|----------|
| GLB-001 | All | 1 breakpoint @1024 | 3 regimes | P0 |
| GLB-002 | Medium | BottomNav | Rail 72px | P1 |
| GLB-004 | Wide | TopBar persists | hidden + Sidebar 240 | P1 |
| GLB-013 | Wide | no panel | Inspector/Popover | P1 |
| CAL-002 | Compact | Mes no-op | day+rows | P1 |
| CAL-004 | All | agenda only | regime defaults | P1 |
| CAL-005 | Wide | no panel | Inspector | P1 |
| TEAM-011 | Medium/Wide | panel @1280 | regime panel | P2 |
| COM-021 | Compact | composer hidden | fixed composer | P1 |
| MGMT-013 | Compact | table loses cols | fallback | P1 |
| MGMT-030 | Compact | min-w scroll only | row lists | P1 |
| MGMT-039 | Wide | via Más | direct destinations | P2 |
| PART-009 | Compact | sticky covers row | padding | P1 |
| MGMT-032 | Compact | table scroll | row lists | P2 |

---

## 3. CURRENT RESPONSIVE DEFECTS (from Stage 5)

| # | Defect | Regime | Evidence |
|---|--------|--------|----------|
| R1 | 2-col only at `xl` (1280) but doc says desktop 1024 | Medium/Wide | STATIC |
| R2 | People table loses EQUIPO/ROL <768 without fallback | Compact | STATIC |
| R3 | Reports `min-w-[560px]` scroll | Compact | STATIC |
| R4 | Selection table hides column header <768 (labels lost) | Compact | STATIC |
| R5 | "Mes" toggle silent no-op <768 | Compact | STATIC |
| R6 | Attendance buttons 36px | Compact | STATIC |
| R7 | Chat composer not fixed | Compact | STATIC |
| R8 | 390px not verifiable in audit env | Compact | methodology |

---

## 4. VERIFICATION REQUIREMENT

Target: **0 horizontal overflow at 500 / 768 / 1200 / 1440px** (runtime), plus 390px where achievable.

Current baseline: `scripts/screenshot.mjs` measures `scrollWidth`; Stage 4 claims 0 overflow at 91 captures (390/768/1440). Stage 5: 390 not verifiable (OS min ~500).

**Evidence to close:** runtime captures at 4 widths + scrollWidth assertion per surface.

---

## 5. RESPONSIVE IMPACT BY DOMAIN

| Domain | Responsive gaps | Priority |
|--------|-----------------|----------|
| Global/Shell | 5 (GLB-001,002,004,013 + regime) | P0/P1 |
| Home | 1 (HOME-011) | P2 |
| Calendar | 4 (CAL-002,004,005 + panel) | P1 |
| Participation | 2 (PART-009, PART-012) | P1 |
| Teams | 1 (TEAM-011) | P2 |
| Communication | 1 (COM-021) | P1 |
| Management | 4 (MGMT-013,030,032,039) | P1/P2 |

**Total responsive-classified: 18**