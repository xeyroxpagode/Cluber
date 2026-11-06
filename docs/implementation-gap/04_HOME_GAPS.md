# 04_HOME_GAPS.md

# Home Gaps (Domain 01)

**Authority:** `docs/target-ux/DOMAIN_01_HOME_FREEZE_V1.0.md`  
**Scope:** R04 `/home`  
**Date:** 2026-10-22

---

## HOME-001 — Attention Order Wrong (Most Urgent Not First)

**SCOPE:** Home  
**SEVERITY:** P1  
**CLASSIFICATION:** CONTENT/HIERARCHY  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** Attention order: (1) attendance open from yesterday, (2) match in 7 days with conflicts, (3) convocation with situations. Most urgent (match conflict) is 2nd.  
**CURRENT EVIDENCE:** `RUNTIME` R-01.4.

**TARGET:** Most urgent first (deadline + severity). Match-with-conflict to #1.  
**TARGET SOURCE:** `docs/target-ux/DOMAIN_01_HOME_FREEZE_V1.0.md` §Component Specifications ("Necesita tu atención")

**REAL GAP:** Ordering not urgency-based.  
**WHY IT MATTERS:** User acts on wrong item first.  
**USER IMPACT:** Misses near-term conflict.  
**PRODUCT LOGIC CHANGE:** No | **DATA CONTRACT CHANGE:** No | **AUTHORITY IMPACT:** No | **PII IMPACT:** No  
**RESPONSIVE IMPACT:** No | **STATE IMPACT:** attention sort | **NAVIGATION IMPACT:** No | **OVERLAY/ FEEDBACK/MOTION/A11Y:** No  
**FILES:** `src/features/overview.tsx` (Home)  
**SHARED SYSTEM IMPACT:** No  
**DEPENDENCIES:** None  
**ACCEPTANCE CRITERIA:** Attention sorted by urgency; match-conflict first when present.  
**EVIDENCE REQUIRED:** runtime Home COACH.

---

## HOME-002 — ADMIN Home Shows Contradictory Signals

**SCOPE:** Home  
**SEVERITY:** P1  
**CLASSIFICATION:** STATE/CONTENT  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** ADMIN sees chip "0 pendientes" in amber beside green "Nada pendiente."  
**CURRENT EVIDENCE:** `RUNTIME` R-03.12.

**TARGET:** ADMIN: zero attention + plain "Nada pendiente." (no amber chip).  
**TARGET SOURCE:** `docs/target-ux/DOMAIN_01_HOME_FREEZE_V1.0.md` Actor Variants (ADMIN)

**REAL GAP:** Contradictory zero-state.  
**USER IMPACT:** Two conflicting signals.  
**FILES:** `overview.tsx`  
**DEPENDENCIES:** None  
**ACCEPTANCE CRITERIA:** ADMIN Home shows single "Nada pendiente."  
**EVIDENCE REQUIRED:** runtime ADMIN.

---

## HOME-003 — ADMIN Home Structurally Empty

**SCOPE:** Home  
**SEVERITY:** P1  
**CLASSIFICATION:** HIERARCHY  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** ADMIN: 0 actions + 1 event + 2 comunicados; no aside; looks broken.  
**CURRENT EVIDENCE:** `RUNTIME` R-03.13.

**TARGET:** ADMIN sees club-wide events in Hoy + Comunicaciones; explicit "Nada pendiente"; no fake team blocks.  
**TARGET SOURCE:** `docs/target-ux/DOMAIN_01_HOME_FREEZE_V1.0.md` Actor Variants (ADMIN)

**REAL GAP:** ADMIN Home not meaningful.  
**USER IMPACT:** ADMIN sees empty page.  
**FILES:** `overview.tsx`  
**DEPENDENCIES:** None  
**ACCEPTANCE CRITERIA:** ADMIN Home has meaningful club-wide content + explicit zero attention.  
**EVIDENCE REQUIRED:** runtime ADMIN.

---

## HOME-004 — "Hoy" Empty Giant (200px)

**SCOPE:** Home  
**SEVERITY:** P2  
**CLASSIFICATION:** VISUAL/DENSITY  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** "Hoy no hay actividades" in ~200px dashed box.  
**CURRENT EVIDENCE:** `RUNTIME` R-01.1.

**TARGET:** Compact empty; hoy real clock; no giant surface.  
**TARGET SOURCE:** `docs/target-ux/DOMAIN_01_HOME_FREEZE_V1.0.md` §"Hoy" (L1)

**REAL GAP:** Empty over-dimensioned.  
**USER IMPACT:** Wasted space; false prominence.  
**FILES:** `overview.tsx`  
**DEPENDENCIES:** None  
**ACCEPTANCE CRITERIA:** Empty "Hoy" compact (<80px).  
**EVIDENCE REQUIRED:** runtime Home COACH 1440.

---

## HOME-005 — Fake Badge "6 A" / Decorated Identity

**SCOPE:** Home  
**SEVERITY:** P1  
**CLASSIFICATION:** TRUST  
**GAP TYPE:** REMOVE  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** 40px blue badge "6 A" is highest-weight element; `6` is a literal; team is "Sexta A"; dataset has 4 divisions.  
**CURRENT EVIDENCE:** `RUNTIME` R-01.2.

**TARGET:** No decorative badge; team identity derived from real model.  
**TARGET SOURCE:** `docs/target-ux/DOMAIN_01_HOME_FREEZE_V1.0.md` Explicit PROHIBITED

**REAL GAP:** Fabricated visual with highest weight.  
**WHY IT MATTERS:** Trust — false data driving attention.  
**USER IMPACT:** Misleading; wrong team.  
**FILES:** `overview.tsx:325-326`  
**DEPENDENCIES:** None  
**ACCEPTANCE CRITERIA:** Badge removed or derived real; not highest weight.  
**EVIDENCE REQUIRED:** runtime + code.

---

## HOME-006 — "Temporada 2026" Repeated ×3

**SCOPE:** Home  
**SEVERITY:** P2  
**CLASSIFICATION:** NOISE  
**GAP TYPE:** REMOVE/MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** "Temporada 2026" appears 3× (chip, card, footer).  
**CURRENT EVIDENCE:** `RUNTIME` R-01.6.

**TARGET:** Season is data, not chrome; ≤1 non-dominant occurrence.  
**TARGET SOURCE:** `docs/target-ux/DOMAIN_01_HOME_FREEZE_V1.0.md` Explicit PROHIBITED

**REAL GAP:** Repetition.  
**FILES:** `Shell.tsx`, `overview.tsx`  
**DEPENDENCIES:** None  
**ACCEPTANCE CRITERIA:** ≤1 season reference.  
**EVIDENCE REQUIRED:** runtime.

---

## HOME-007 — Player Header Copy Mismatch

**SCOPE:** Home  
**SEVERITY:** P2  
**CLASSIFICATION:** CONTENT  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** PLAYER gets "Todo lo que necesitás saber para tu día en GEI" (copy of who has no team).  
**CURRENT EVIDENCE:** `RUNTIME` R-02.

**TARGET:** Header copy variant per actor.  
**TARGET SOURCE:** `docs/target-ux/DOMAIN_01_HOME_FREEZE_V1.0.md` Actor Variants

**REAL GAP:** Copy not actor-aware.  
**FILES:** `overview.tsx`  
**DEPENDENCIES:** None  
**ACCEPTANCE CRITERIA:** Header copy matches actor.  
**EVIDENCE REQUIRED:** runtime PLAYER/COACH.

---

## HOME-008 — ¿Vas? Duplicated Phrase Adjacent

**SCOPE:** Home  
**SEVERITY:** P2  
**CLASSIFICATION:** CONTENT  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** Same sentence twice adjacent (status line + amber box).  
**CURRENT EVIDENCE:** `RUNTIME` R-02.8.

**TARGET:** Single stale message.  
**TARGET SOURCE:** `docs/target-ux/DOMAIN_01_HOME_FREEZE_V1.0.md` + `DOMAIN_02 §2.4` (Availability)

**REAL GAP:** Duplication in vas.tsx.  
**FILES:** `shared/vas.tsx:41,47-49`  
**DEPENDENCIES:** None  
**ACCEPTANCE CRITERIA:** One stale message.  
**EVIDENCE REQUIRED:** runtime PLAYER.

---

## HOME-009 — ¿Vas? Selection Not Highlighted When Stale

**SCOPE:** Home  
**SEVERITY:** P2  
**CLASSIFICATION:** STATE  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** Player answered "Voy" but buttons show no selection (active annulled when stale).  
**CURRENT EVIDENCE:** `RUNTIME` R-02.9; `vas.tsx:53`.

**TARGET:** Prior answer visible in control even when stale (distinct from stale warning).  
**TARGET SOURCE:** `docs/target-ux/DOMAIN_01_HOME_FREEZE_V1.0.md` States Covered

**REAL GAP:** No memory of prior answer except grey line.  
**FILES:** `shared/vas.tsx`  
**DEPENDENCIES:** None  
**ACCEPTANCE CRITERIA:** Prior answer visible + stale warning separate.  
**EVIDENCE REQUIRED:** runtime PLAYER.

---

## HOME-010 — Communications No Unread Indicator

**SCOPE:** Home  
**SEVERITY:** P2  
**CLASSIFICATION:** STATE/FEEDBACK  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** "Comunicaciones recientes" no unread indicator.  
**CURRENT EVIDENCE:** `RUNTIME` R-02.11.

**TARGET:** Unread badge on communications.  
**TARGET SOURCE:** `docs/target-ux/DOMAIN_01_HOME_FREEZE_V1.0.md` §Comunicaciones

**REAL GAP:** No unread state.  
**FILES:** `overview.tsx`  
**DEPENDENCIES:** None  
**ACCEPTANCE CRITERIA:** Unread indicator present per communication.  
**EVIDENCE REQUIRED:** runtime.

---

## HOME-011 — "En el equipo" Block Without Surface

**SCOPE:** Home  
**SEVERITY:** P2  
**CLASSIFICATION:** VISUAL  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** Captain block has no surface container vs other blocks.  
**CURRENT EVIDENCE:** `RUNTIME` R-01.5.

**TARGET:** Consistent surface/spacing grouping.  
**TARGET SOURCE:** `docs/target-ux/DOMAIN_01_HOME_FREEZE_V1.0.md` Spacing Rules

**REAL GAP:** Gestalt break.  
**FILES:** `overview.tsx`  
**DEPENDENCIES:** GLB-019  
**ACCEPTANCE CRITERIA:** Block grouped consistently.  
**EVIDENCE REQUIRED:** runtime.

---

## HOME-012 — Home → Resource Origin Not Preserved

**SCOPE:** Home  
**SEVERITY:** P1  
**CLASSIFICATION:** NAVIGATION  
**GAP TYPE:** CREATE  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** Back from EventDetail/Communication loses Home scroll/filter.  
**CURRENT EVIDENCE:** `STATIC` — GLB-010 overlap.

**TARGET:** Back restores Home origin.  
**TARGET SOURCE:** `docs/target-ux/DOMAIN_01_HOME_FREEZE_V1.0.md` Home → Resource Origin Behavior

**REAL GAP:** No origin preservation.  
**FILES:** `overview.tsx`, `app/Shell.tsx`  
**DEPENDENCIES:** GLB-010  
**ACCEPTANCE CRITERIA:** Back restores Home origin.  
**EVIDENCE REQUIRED:** runtime navigation.

---

## SUMMARY — Home

| Gap ID | Severity | Type | Backend |
|--------|----------|------|---------|
| HOME-001 | P1 | MODIFY | No |
| HOME-002 | P1 | MODIFY | No |
| HOME-003 | P1 | MODIFY | No |
| HOME-004 | P2 | MODIFY | No |
| HOME-005 | P1 | REMOVE | No |
| HOME-006 | P2 | REMOVE | No |
| HOME-007 | P2 | MODIFY | No |
| HOME-008 | P2 | MODIFY | No |
| HOME-009 | P2 | MODIFY | No |
| HOME-010 | P2 | MODIFY | No |
| HOME-011 | P2 | MODIFY | No |
| HOME-012 | P1 | CREATE | No |

**Subtotal: 12 gaps (P0: 0, P1: 6, P2: 6)**

> **Note:** HOME-013 and HOME-014 removed — Guardian actor OUT per Product Truth V1.1 scope reconciliation. See `21_TARGET_DRIFT_RECONCILIATION.md`.