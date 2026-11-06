# 06_TEAMS_GAPS.md

# Teams Gaps (Domain 03)

**Authority:** `docs/target-ux/DOMAIN_03_TEAMS_FREEZE_V1.0.md`  
**Scope:** R09, R10, R11 (16 surfaces)  
**Date:** 2026-10-22

---

### TEAM-001 — Teams List Missing Search/Filter
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** A7 requires search + filters; Teams has none.  
**CURRENT EVIDENCE:** `RUNTIME` R09.  
**TARGET:** Buscador + filtros (chips).  
**TARGET SOURCE:** `DOMAIN_03...V1.0.md §3.1`.  
**FILES:** `overview.tsx`. **DEPS:** None. **ACC:** search + filters present. **EVIDENCE:** runtime.

### TEAM-002 — Teams List "Mi equipo" Not Prioritized by Position
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Player sees 1 row with plural title; "Mi equipo" not first by position.  
**CURRENT EVIDENCE:** `RUNTIME` R09.  
**TARGET:** "Mi equipo" first by position (no badge/mark).  
**TARGET SOURCE:** `DOMAIN_03...V1.0.md §3.1` (Actor Variants: "First by position").  
**FILES:** `overview.tsx`. **ACC:** "Mi equipo" row first by position. **EVIDENCE:** runtime.

### TEAM-003 — Team Detail Default Tab Wrong / No Prioritized Next Event
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** No prioritized next event; next in "Próximos eventos" list; no ¿Vas? primary.  
**CURRENT EVIDENCE:** `RUNTIME` R10.  
**TARGET:** Default Eventos; one prioritized next event + ¿Vas? inline.  
**TARGET SOURCE:** `DOMAIN_03...V1.0.md §3.2`.  
**FILES:** `overview.tsx`. **DEPS:** None. **ACC:** next event opens block with ¿Vas?. **EVIDENCE:** runtime.

### TEAM-004 — Team Detail Tabs Without role="tab"
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Tabs no `role="tab"`.  
**CURRENT EVIDENCE:** `STATIC` — `role="tab"`=0; B31.  
**TARGET:** role=tablist/tab with aria-selected + arrows.  
**TARGET SOURCE:** `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §2` + §Accessibility.  
**FILES:** `overview.tsx`, `shared/ui.tsx`. **DEPS:** GLB-016-family. **ACC:** tabs semantic. **EVIDENCE:** axe + keyboard.

### TEAM-005 — No Next-Step / Results Without Link (Dead Flow)
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** F16/F17 don't complete §5; results without link.  
**CURRENT EVIDENCE:** `RUNTIME` R10.  
**TARGET:** Clear next-step per tab; results link to EventDetail.  
**TARGET SOURCE:** `DOMAIN_03...V1.0.md §3.2` (Resultados).  
**FILES:** `overview.tsx`. **ACC:** next-steps + links. **EVIDENCE:** runtime.

### TEAM-006 — Coach Label Inconsistency ("Entrenador" vs "Entrenador o entrenadora")
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Home "Entrenador" vs TeamDetail "Entrenador o entrenadora".  
**CURRENT EVIDENCE:** `RUNTIME` R10.  
**TARGET:** Single label source.  
**TARGET SOURCE:** GLB-006.  
**FILES:** `shared/states.ts`, `overview.tsx`. **ACC:** consistent. **EVIDENCE:** runtime.

### TEAM-007 — Cuerpo Técnico Mixed With Plantel
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Cuerpo técnico not clearly separated from Plantel.  
**CURRENT EVIDENCE:** `STATIC`/`RUNTIME`.  
**TARGET:** Separate sections; Cuerpo técnico from RoleAssignment.  
**TARGET SOURCE:** `DOMAIN_03...V1.0.md §3.2` (Personas).  
**FILES:** `overview.tsx`, `mock/store.tsx`. **ACC:** separated + derived. **EVIDENCE:** runtime + test.

### TEAM-008 — Coach Fake Self-VAS
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Coach sees own response card.  
**CURRENT EVIDENCE:** `RUNTIME` R10.  
**TARGET:** Coach does not receive fake self-VAS.  
**TARGET SOURCE:** `DOMAIN_03...V1.0.md §3.2` (Inline Availability).  
**FILES:** `overview.tsx`. **ACC:** coach has no own response card. **EVIDENCE:** runtime COACH.

### TEAM-009 — Person Detail No Action (Dead Node)
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Ficha read-only, no action, no contextual back.  
**CURRENT EVIDENCE:** `RUNTIME` R11.  
**TARGET:** Exactly one contextual primary action (Contactar / Ver ¿Vas?); contextual back to team.  
**TARGET SOURCE:** `DOMAIN_03...V1.0.md §3.3`.  
**FILES:** `overview.tsx`. **ACC:** one primary action + back. **EVIDENCE:** runtime.

### TEAM-010 — Person Detail Lacks Operational PII Rules
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** Yes  
**CURRENT:** PII visible inconsistently; no field authority.  
**CURRENT EVIDENCE:** `STATIC` — `canView*` 0 consumers; C04.  
**TARGET:** Field-level PII per Product Truth §6.  
**TARGET SOURCE:** `DOMAIN_03...V1.0.md §3.3` (PII table).  
**FILES:** `overview.tsx`, `authority.ts`. **DEPS:** GLB-011. **ACC:** PII per role correct. **EVIDENCE:** runtime ×4 roles.

### TEAM-011 — Team Detail Responsive Panel Not Regime-Aware
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Panel only at `xl` (1280).  
**CURRENT EVIDENCE:** `STATIC`.  
**TARGET:** Medium panel/rail, Wide Inspector.  
**TARGET SOURCE:** `DOMAIN_03...V1.0.md §3.4`.  
**FILES:** `overview.tsx`. **DEPS:** GLB-001, GLB-013. **ACC:** regime-aware panel. **EVIDENCE:** runtime.

### TEAM-012 — Team Detail Cross-Navigation Back Not Preserved
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Back loses tab/scroll.  
**CURRENT EVIDENCE:** `STATIC`.  
**TARGET:** Origin preserved.  
**TARGET SOURCE:** `DOMAIN_03...V1.0.md §3.2` (Canonical Navigation).  
**FILES:** `overview.tsx`. **DEPS:** GLB-010. **ACC:** origin preserved. **EVIDENCE:** runtime.

### TEAM-013 — Operational vs Admin Person Confusion
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** No clear boundary; admin actions leak.  
**CURRENT EVIDENCE:** `STATIC`.  
**TARGET:** Operational Person (R11) ≠ Person Admin (R32).  
**TARGET SOURCE:** `DOMAIN_03...V1.0.md §3.3` + `DOMAIN_05...V1.0.md §5.8.3`.  
**FILES:** `overview.tsx`, `management.tsx`. **ACC:** clear boundary. **EVIDENCE:** runtime.

### TEAM-015 — Teams List Empty for SUBCOMMITTEE/ADMIN Semantics
**SEVERITY:** P3 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** SUBCOMMITTEE/ADMIN see 4 rows; semantics of "my teams" unclear.  
**CURRENT EVIDENCE:** `RUNTIME` R09.  
**TARGET:** Their view is read-only all-teams; no "Mi equipo" priority.  
**TARGET SOURCE:** `DOMAIN_03...V1.0.md §3.1`.  
**FILES:** `overview.tsx`. **ACC:** correct semantics. **EVIDENCE:** runtime.

### TEAM-016 — Team Identity Mutates by Rename (Verify P0-1)
**SEVERITY:** P1 | **TYPE:** VERIFY | **BACKEND:** No  
**CURRENT:** P0-1 declared closed; verify no residual `division`/`name` mutation.  
**CURRENT EVIDENCE:** `STATIC` — Implementation Report P0-1.  
**TARGET:** Team identity immutable; new identity = new team.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.6`.  
**FILES:** `management.tsx`. **ACC:** rename does not mutate teams. **EVIDENCE:** test.

---

## SUMMARY — Teams

| Gap ID | Sev | Type | Backend |
|--------|-----|------|---------|
| TEAM-001 | P2 | MODIFY | No |
| TEAM-002 | P2 | MODIFY | No |
| TEAM-003 | P1 | MODIFY | No |
| TEAM-004 | P1 | MODIFY | No |
| TEAM-005 | P1 | MODIFY | No |
| TEAM-006 | P2 | MODIFY | No |
| TEAM-007 | P1 | MODIFY | No |
| TEAM-008 | P1 | MODIFY | No |
| TEAM-009 | P1 | MODIFY | No |
| TEAM-010 | P1 | MODIFY | Yes |
| TEAM-011 | P2 | MODIFY | No |
| TEAM-012 | P2 | MODIFY | No |
| TEAM-013 | P2 | MODIFY | No |
| TEAM-015 | P3 | MODIFY | No |
| TEAM-016 | P1 | VERIFY | No |

**Subtotal: 15 gaps (P0: 0, P1: 8, P2: 6, P3: 1)**

> **Note:** TEAM-014 removed — Guardian actor OUT per Product Truth V1.1 scope reconciliation. See `21_TARGET_DRIFT_RECONCILIATION.md`.