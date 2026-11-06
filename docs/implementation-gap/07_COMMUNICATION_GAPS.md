# 07_COMMUNICATION_GAPS.md

# Communication Gaps (Domain 04)

**Authority:** `docs/target-ux/DOMAIN_04_COMMUNICATION_FREEZE_V1.0.md`  
**Scope:** R21–R26 (21 surfaces)  
**Date:** 2026-10-22

---

### COM-001 — Hub Has No Primary Action (Buttons secondary) + Double CTA
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** No primary; "Nueva conversación" secondary; in Comunicados tab offers "Nueva conversación".  
**CURRENT EVIDENCE:** `RUNTIME` R21; R-08.34.  
**TARGET:** One primary CTA per tab.  
**TARGET SOURCE:** `DOMAIN_04...V1.0.md §4.3` (Primary Actions).  
**FILES:** `communication.tsx`. **DEPS:** None. **ACC:** one primary per tab. **EVIDENCE:** runtime.

### COM-002 — Tab "Todo" Duplicates Structure
**SEVERITY:** P2 | **TYPE:** REMOVE | **BACKEND:** No  
**CURRENT:** 3 tabs incl. "Todo" which duplicates the screen.  
**CURRENT EVIDENCE:** `RUNTIME` R-08.32.  
**TARGET:** 2 tabs (Conversaciones/Comunicados).  
**TARGET SOURCE:** `DOMAIN_04...V1.0.md §4.3` (Tabs).  
**FILES:** `communication.tsx`. **ACC:** "Todo" removed. **EVIDENCE:** runtime.

### COM-003 — Channels Not Perceptually Separated
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Container/radius/icon/row identical across channels.  
**CURRENT EVIDENCE:** `RUNTIME` R-08.30; UX-03.  
**TARGET:** Distinct container/icon/row grammar.  
**TARGET SOURCE:** `DOMAIN_04...V1.0.md §4.3` (Perceptual Separation).  
**FILES:** `communication.tsx`. **DEPS:** GLB-019. **ACC:** channels visually distinct. **EVIDENCE:** runtime.

### COM-004 — Conversation List Not Ordered By Last Activity
**SEVERITY:** P3 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** No `.sort()`; order = seed order.  
**CURRENT EVIDENCE:** `STATIC` — S4-05; R21.  
**TARGET:** Conversations sorted by last activity DESC; unread changes presentation (stronger text + dot/count), not ordering.  
**TARGET SOURCE:** `DOMAIN_04...V1.0.md §4.3` (L1) + `GEI_TARGET_UX_FREEZE_V1.0.md` Communication section.  
**FILES:** `communication.tsx`. **ACC:** last activity DESC; unread visual priority only. **EVIDENCE:** runtime.

### COM-005 — Announcements No Unread Indicator
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Comunicados have no unread indicator.  
**CURRENT EVIDENCE:** `RUNTIME` R-08.31.  
**TARGET:** Unread indicator for announcements.  
**TARGET SOURCE:** `DOMAIN_04...V1.0.md §4.3`.  
**FILES:** `communication.tsx`. **ACC:** unread present. **EVIDENCE:** runtime.

### COM-006 — Unread Counter No aria-label
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Unread circle ~9px text, no aria-label.  
**CURRENT EVIDENCE:** `RUNTIME` R-08.31.  
**TARGET:** aria-label "N sin leer".  
**TARGET SOURCE:** `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §Accessibility`.  
**FILES:** `communication.tsx`, `shared/ui.tsx`. **ACC:** labeled. **EVIDENCE:** axe.

### COM-007 — New Conversation: Two primary Controls Simultaneously
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** With "Grupo" two controls weight primary.  
**CURRENT EVIDENCE:** `RUNTIME` R22.  
**TARGET:** Single primary.  
**TARGET SOURCE:** `DOMAIN_04...V1.0.md §4.4`.  
**FILES:** `communication.tsx`. **ACC:** one primary. **EVIDENCE:** runtime.

### COM-008 — DIRECT Uses Own Logic, Not findOrOpenDirect
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Duplicate detection after Create with own logic.  
**CURRENT EVIDENCE:** `STATIC` — FDPG-04; findOrOpenDirect 0 UI consumers.  
**TARGET:** Use `findOrOpenDirect`; show "Ya tenés una conversación con X" + "Abrir".  
**TARGET SOURCE:** `DOMAIN_04...V1.0.md §4.4` (DIRECT).  
**FILES:** `communication.tsx`, `mock/store.tsx`. **ACC:** canonical single implementation. **EVIDENCE:** test + runtime.

### COM-009 — New Conversation Uses person.role/person.team (Cross-Division Impossible)
**SEVERITY:** P1 | **TYPE:** MODIFY + BACKEND | **BACKEND:** Yes  
**CURRENT:** Candidate filter uses `person.role`/`person.team` → no cross-division conversation.  
**CURRENT EVIDENCE:** `STATIC` — S4-04; R22.  
**TARGET:** Filter by assignments; GROUP across divisions allowed.  
**TARGET SOURCE:** `DOMAIN_04...V1.0.md §4.4` (Candidate Filtering).  
**FILES:** `communication.tsx`, `mock/store.tsx`. **DEPS:** GLB-012. **ACC:** cross-division GROUP creatable. **EVIDENCE:** test + runtime.

### COM-010 — New Conversation Missing Summary Step
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** No summary before Create.  
**CURRENT EVIDENCE:** `RUNTIME` R22.  
**TARGET:** Summary "qué se va a crear".  
**TARGET SOURCE:** `DOMAIN_04...V1.0.md §4.4` (L2).  
**FILES:** `communication.tsx`. **ACC:** summary present. **EVIDENCE:** runtime.

### COM-011 — No TEAM/EVENT Conversation Creation
**SEVERITY:** P1 | **TYPE:** CREATE + BACKEND | **BACKEND:** Yes  
**CURRENT:** No TEAM/EVENT conversation creation.  
**CURRENT EVIDENCE:** `STATIC` — R22; flow F.  
**TARGET:** Canonical TEAM (1/team) and EVENT (1/event).  
**TARGET SOURCE:** `DOMAIN_04...V1.0.md §4.4` (TEAM/EVENT).  
**FILES:** `communication.tsx`, `mock/store.tsx`, backend. **ACC:** canonical TEAM/EVENT creatable/openable. **EVIDENCE:** test.

### COM-012 — Announcement Audience Is Free String
**SEVERITY:** P1 | **TYPE:** MODIFY + BACKEND | **BACKEND:** Yes  
**CURRENT:** Audience is `string` ("Todo hockey"/"Sexta A"/"Quinta A + Sexta A"); "Línea A" unresolvable; publish notifies everyone.  
**CURRENT EVIDENCE:** `RUNTIME` R23; UX-16.  
**TARGET:** `AudienceSnapshot { clubWide, teamIds[] }`; resolves line to division+season; notifies snapshot only.  
**TARGET SOURCE:** `DOMAIN_04...V1.0.md §4.5` (Audience).  
**FILES:** `communication.tsx`, `mock/model.ts`, `mock/notifications.ts`. **DEPS:** GLB-025. **ACC:** audience resolvable + scoped notification. **EVIDENCE:** test + runtime.

### COM-013 — Announcement Audience Not L0 (Order Wrong)
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Audience is 3rd field; Blueprint puts it first.  
**CURRENT EVIDENCE:** `RUNTIME` R23.  
**TARGET:** Audience first (SITUACIÓN).  
**TARGET SOURCE:** `DOMAIN_04...V1.0.md §4.5` (Frozen Order).  
**FILES:** `communication.tsx`. **ACC:** audience first. **EVIDENCE:** runtime.

### COM-014 — Announcement Detail No "Entendido"/Acuse (0 primary)
**SEVERITY:** P1 | **TYPE:** CREATE + BACKEND | **BACKEND:** Yes  
**CURRENT:** No action; model has no `readBy`/`acknowledgedBy`.  
**CURRENT EVIDENCE:** `RUNTIME` R24; UX-17.  
**TARGET:** "Entendido" primary + acknowledgment.  
**TARGET SOURCE:** `DOMAIN_04...V1.0.md §4.6` (Primary Action).  
**FILES:** `communication.tsx`, `mock/model.ts`. **ACC:** acuse works + persists. **EVIDENCE:** runtime + test.

### COM-015 — Announcement Audience Not Access Control
**SEVERITY:** P0 | **TYPE:** MODIFY + BACKEND | **BACKEND:** Yes  
**CURRENT:** Anyone with URL reads any announcement.  
**CURRENT EVIDENCE:** `RUNTIME` R24; UX-16.  
**TARGET:** Audience = access control; non-audience → no-access.  
**TARGET SOURCE:** `DOMAIN_04...V1.0.md §4.6` (Access Control).  
**FILES:** `communication.tsx`, `app/App.tsx`, backend. **DEPS:** GLB-011. **ACC:** non-audience denied. **EVIDENCE:** test + runtime.

### COM-016 — Announcement Edit Missing Diff
**SEVERITY:** P1 | **TYPE:** MODIFY + BACKEND | **BACKEND:** Yes  
**CURRENT:** No diff, no revision, no impact preview, no change count.  
**CURRENT EVIDENCE:** `RUNTIME` R25; R-43.48.  
**TARGET:** Diff + revision++ + impact preview + counsel.  
**TARGET SOURCE:** `DOMAIN_04...V1.0.md §4.7`.  
**FILES:** `communication.tsx`, `shared/ui.tsx` (DiffList). **ACC:** diff visible. **EVIDENCE:** runtime.

### COM-017 — Announcement Edit Inmutable Rule Uses tone=info (Brand Blue)
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Blocking rule shown with tone=info.  
**CURRENT EVIDENCE:** `RUNTIME` R25.  
**TARGET:** tone=warning.  
**TARGET SOURCE:** `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §1.1`.  
**FILES:** `communication.tsx`. **ACC:** warning tone. **EVIDENCE:** runtime.

### COM-018 — Chat No Sending State / Fake CheckCheck
**SEVERITY:** P1 | **TYPE:** MODIFY + BACKEND | **BACKEND:** Yes  
**CURRENT:** No sending; CheckCheck always; no failed state.  
**CURRENT EVIDENCE:** `RUNTIME` R26; B18; GLB-026.  
**TARGET:** Optimistic + CheckCheck after ack + FAILED + Retry.  
**TARGET SOURCE:** `DOMAIN_04...V1.0.md §4.8` (Message States).  
**FILES:** `communication.tsx`. **ACC:** states honest. **EVIDENCE:** runtime + test.

### COM-019 — "Cargar mensajes anteriores" Fake Control
**SEVERITY:** P2 | **TYPE:** REMOVE/MODIFY | **BACKEND:** Yes  
**CURRENT:** Fake control disables button and shows literal.  
**CURRENT EVIDENCE:** `RUNTIME` R26.  
**TARGET:** Real pagination or remove.  
**TARGET SOURCE:** `DOMAIN_04...V1.0.md §4.8`.  
**FILES:** `communication.tsx`. **ACC:** real or removed. **EVIDENCE:** runtime.

### COM-020 — Conversation Context Is Seed Literal
**SEVERITY:** P1 | **TYPE:** MODIFY + BACKEND | **BACKEND:** Yes  
**CURRENT:** Title is seed string; teamId/eventId unresolved.  
**CURRENT EVIDENCE:** `RUNTIME` R26.  
**TARGET:** Resolve canonical context.  
**TARGET SOURCE:** `DOMAIN_04...V1.0.md §4.8` (Context Resolution).  
**FILES:** `communication.tsx`. **ACC:** real context. **EVIDENCE:** runtime.

### COM-021 — Composer Not Fixed / Below Bottom Nav (P2-23 Not Delivered)
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** `min-h-[60dvh]` without fixed height → composer above bottom nav.  
**CURRENT EVIDENCE:** `STATIC` — R26; B33.  
**TARGET:** Composer always visible above keyboard.  
**TARGET SOURCE:** `DOMAIN_04...V1.0.md §4.8` (Composer).  
**FILES:** `communication.tsx`. **ACC:** composer fixed. **EVIDENCE:** runtime 500px.

### COM-022 — Thread Date Hardcoded ("Hoy · 2 de octubre")
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Hardcoded date with real date 3 oct.  
**CURRENT EVIDENCE:** `RUNTIME` R26.  
**TARGET:** Real clock dates.  
**TARGET SOURCE:** `DOMAIN_04...V1.0.md §4.8`.  
**FILES:** `communication.tsx`. **ACC:** real dates. **EVIDENCE:** runtime.

### COM-023 — No Member Sheet / Archive Conversation
**SEVERITY:** P2 | **TYPE:** CREATE | **BACKEND:** Yes  
**CURRENT:** No member sheet, no archive.  
**CURRENT EVIDENCE:** `STATIC`.  
**TARGET:** Member sheet + archive conversation.  
**TARGET SOURCE:** `DOMAIN_04...V1.0.md §4.8` (L3/L4).  
**FILES:** `communication.tsx`. **ACC:** sheet + archive. **EVIDENCE:** runtime.

### COM-024 — Notifications Type Never Rendered
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** Yes  
**CURRENT:** Avisos visually identical; type never rendered.  
**CURRENT EVIDENCE:** `RUNTIME` R07; GLB-025.  
**TARGET:** Type names each row (§22).  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.4`.  
**FILES:** `communication.tsx`, `mock/notifications.ts`. **ACC:** type visible. **EVIDENCE:** runtime.

### COM-025 — Notifications "Marcar leído" Always Navigates
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Mark-read always navigates; can't clear list without leaving.  
**CURRENT EVIDENCE:** `RUNTIME` R07; F25.  
**TARGET:** Mark read without forced navigation.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.4`.  
**FILES:** `communication.tsx`. **ACC:** mark-read stays. **EVIDENCE:** runtime.

### COM-026 — Internal Design Copy Leak ("Sin lista de registros…")
**SEVERITY:** P2 | **TYPE:** REMOVE | **BACKEND:** No  
**CURRENT:** "Sin lista de registros: sólo lo que requiere mirar" (internal).  
**CURRENT EVIDENCE:** `RUNTIME` R07; B25.  
**TARGET:** Remove internal copy.  
**TARGET SOURCE:** `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §3`.  
**FILES:** `communication.tsx:873`. **ACC:** removed. **EVIDENCE:** grep + runtime.

### COM-027 — Messages Create Global Notifications? (Verify)
**SEVERITY:** P2 | **TYPE:** VERIFY | **BACKEND:** Yes  
**CURRENT:** Verify messages do not create global notifications beyond MESSAGE_RECEIVED.  
**CURRENT EVIDENCE:** `STATIC`.  
**TARGET:** Only MESSAGE_RECEIVED in feed.  
**TARGET SOURCE:** `DOMAIN_04...V1.0.md §4.1`.  
**FILES:** `mock/notifications.ts`. **ACC:** rule held. **EVIDENCE:** test.

---

## SUMMARY — Communication

| Gap ID | Sev | Type | Backend |
|--------|-----|------|---------|
| COM-001 | P1 | MODIFY | No |
| COM-002 | P2 | REMOVE | No |
| COM-003 | P1 | MODIFY | No |
| COM-004 | P3 | MODIFY | No |
| COM-005 | P2 | MODIFY | No |
| COM-006 | P2 | MODIFY | No |
| COM-007 | P1 | MODIFY | No |
| COM-008 | P1 | MODIFY | No |
| COM-009 | P1 | MODIFY | Yes |
| COM-010 | P2 | MODIFY | No |
| COM-011 | P1 | CREATE | Yes |
| COM-012 | P1 | MODIFY | Yes |
| COM-013 | P1 | MODIFY | No |
| COM-014 | P1 | CREATE | Yes |
| COM-015 | P0 | MODIFY | Yes |
| COM-016 | P1 | MODIFY | Yes |
| COM-017 | P2 | MODIFY | No |
| COM-018 | P1 | MODIFY | Yes |
| COM-019 | P2 | REMOVE | Yes |
| COM-020 | P1 | MODIFY | Yes |
| COM-021 | P1 | MODIFY | No |
| COM-022 | P2 | MODIFY | No |
| COM-023 | P2 | CREATE | Yes |
| COM-024 | P1 | MODIFY | Yes |
| COM-025 | P2 | MODIFY | No |
| COM-026 | P2 | REMOVE | No |
| COM-027 | P2 | VERIFY | Yes |

**Subtotal: 27 gaps (P0: 1, P1: 13, P2: 11, P3: 2)**

> **Note:** COM-028 removed — Guardian actor OUT per Product Truth V1.1 scope reconciliation. See `21_TARGET_DRIFT_RECONCILIATION.md`.