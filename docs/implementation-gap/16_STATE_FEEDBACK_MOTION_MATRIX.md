# 16_STATE_FEEDBACK_MOTION_MATRIX.md

# State, Feedback and Motion Matrix

**Authority:** `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §3.1, §7`  
**Date:** 2026-10-22

---

## 1. STATE COVERAGE BY DOMAIN

| Domain | States required | Current coverage | Gap |
|--------|-----------------|------------------|-----|
| Event | 8 (DRAFT..RESTORE) | 7/8 (ABANDONED unreachable) | EVENT-006, EVENT-001 |
| Availability | 5 (YES..NEEDS_RECONFIRMATION) | 6/11 derived incomplete | PART-003, HOME-009 |
| Attendance | 4 (PRESENT..UNRECORDED) | 7/8 (history invisible) | PART-013, PART-014 |
| Selection | 3 (DRAFT/PUBLISHED/REVISION_N) | 8/10 (no CONFLICT state, no revisions) | PART-006, PART-010 |
| MatchRecord | 3 (DRAFT/FINAL/CORRECTED_N) | 9/9 states but history invisible | PART-017 |
| Announcement | 4 (DRAFT..CORRECTED_N) | partial (no revision) | COM-016 |
| Account | 3 (PENDING/ACTIVE/DISABLED) | partial (security hidden) | GLB-AUTH-03 |

---

## 2. STATE GAP LIST

| Gap ID | Severity | State Gap |
|--------|----------|-----------|
| EVENT-001 | P0 | Terminal states not communicated |
| EVENT-006 | P1 | ABANDONED unreachable; transitions no modal |
| PART-003 | P2 | RECONFIRM not in enum, neutral tone |
| PART-006 | P1 | Selection CONFLICT state |
| PART-010 | P1 | revisions not shown |
| PART-013 | P0 | Attendance history invisible |
| PART-017 | P0 | MatchRecord history invisible |
| COM-016 | P1 | Announcement revision missing |
| GLB-AUTH-03 | P1 | Account status hidden |
| HOME-009 | P2 | prior answer hidden when stale |
| CAL-006 | P2 | POSTPONED composition |
| AUTO-001 (GLB-026) | P1 | autosave CONFLICT state absent |
| `scenarioTriggered` single-use | P2 | stale scenario triggers once/session |

---

## 3. FEEDBACK MATRIX

| Trigger | Target | Current | Gap |
|---------|--------|---------|-----|
| Primary success (visible result) | Local/causal (state change visible) — NO Toast | Partial (toast used) | PART-002, GLB-026 |
| Primary success (result NOT visible / cross-context) | Toast (`role="status"`) + timestamp | Missing | — |
| Validation error | Inline (Field) + Alert global | 0 inline | GLB-021 |
| Command error | Alert + Toast | No retry | GLB-021, MGMT-019 |
| Autosave | SavedState inline | Present (Availability) | GLB-023 |
| Destructive done (visible result) | Local/causal (state change visible) — NO Toast | Partial (toast used) | MGMT-034 |
| Destructive done (result NOT visible) | Toast + audit trail | Missing | MGMT-034 |
| Message sent | CheckCheck after ack (inline) | Fake | COM-018 |
| Message failed | Inline + Retry | Absent | COM-018 |
| Optimistic confirm | Forbidden | Violated | PART-002, GLB-026 |
| "Generar código" | Must mutate | No mutation | MGMT-015 |

> **Correction:** Feedback at cause. Visible result → normally NO Toast. Toast only when result not visible or cross-context needs transient feedback. Previous matrix incorrectly prescribed universal Toast for all primary success and destructive done.

---

## 4. FEEDBACK GAP LIST

| Gap ID | Severity | Feedback Gap |
|--------|----------|--------------|
| GLB-021 | P1 | Inline validation / focus-to-error absent |
| GLB-026 | P1 | Fake success / optimistic confirmation |
| GLB-014 | P1 | Dirty discard without confirm |
| PART-002 | P1 | Optimistic availability toast (should be local/causal) |
| COM-018 | P1 | No sending/failed state |
| JOR-005 | P2 | Modal error/backdrop not blocked |
| MGMT-015 | P1 | Code generation without mutation |
| PART-007 | P1 | error+success simultaneous |
| GLB-027 | P1 | audit feedback incomplete |

> **Note:** Gaps referencing "Toast + timestamp" or "Toast + audit trail" as universal rules have been corrected to "local/causal feedback; Toast only when result not visible or cross-context". Acceptance criteria in `18_ACCEPTANCE_AND_EVIDENCE_MATRIX.md` updated accordingly.

---

## 5. MOTION MATRIX

| Context | Target | Current | Gap |
|---------|--------|---------|-----|
| ¿Vas? saved | micro 120ms | none | GLB-023 |
| Count live | micro | none | GLB-023 |
| Row disappears (attention) | context 180ms | none | GLB-023 |
| draft→published | context 180ms | none | GLB-023 |
| open→closed | context 180ms | none | GLB-023 |
| Modal/Sheet open | context 180ms | none | GLB-023 |
| Scroll to last message | context | partial | GLB-023 |
| reduced-motion | off | respected | OK |

**Motion-classified gaps: 1 (GLB-023, P2). Target allows only causal motion ≤180ms.**

---

## 6. AUTOSAVE / REALTIME

| Surface | Target | Current | Gap |
|---------|--------|---------|-----|
| Selection autosave | "Borrador guardado HH:MM" | Present | PART-002 |
| Autosave CONFLICT | Banner + Review | Absent | GLB-026/state |
| Realtime counts | live update | static seed | backend |
| Realtime messages | insert + scroll | absent | COM-018 |
| Notifications realtime | push | absent | GLB-025 |

---

## 7. ACCESSIBILITY (State/Feedback)

| Requirement | Current | Gap |
|-------------|---------|-----|
| aria-live regions | 0 | GLB-021 |
| role=alert/status | Partial | GLB-026 |
| Focus management on transition | Partial | GLB-014 |
| Reduced motion | Yes | OK |

---

**Summary: State gaps 13 · Feedback gaps 9 · Motion gaps 1 · Realtime gaps 5.**