# 05_CALENDAR_PARTICIPATION_GAPS.md

# Calendar + Participation Gaps (Domain 02)

**Authority:** `docs/target-ux/DOMAIN_02_CALENDAR_PARTICIPATION_FREEZE_V1.0.md`  
**Scope:** R05, R12–R20 (35 Calendar + 29 Participation surfaces)  
**Date:** 2026-10-22

---

## CAL-* — Calendar Gaps

### CAL-001 — "¿Vas?" Not Reachable From Calendar Selection
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Grid/agenda has no action; ¿Vas? only via Home/EventDetail. Month row tap navigates only.  
**CURRENT EVIDENCE:** `RUNTIME` R05; B17.  
**TARGET:** Compact: tap EventRow/EventChip → Event Detail PUSH route; Wide: Inspector when internal width permits.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.1` (Primary Action, Responsive) + `GEI_TARGET_UX_FREEZE_V1.0.md` Responsive Regimes.  
**REAL GAP:** Canonical A2 action unreachable. **IMPACT:** Most frequent task has no path from Calendar.  
**FILES:** `overview.tsx` (Calendar). **DEPS:** None.  
**ACCEPTANCE:** Compact selection opens EventDetail; response updates count live. Wide selection populates Inspector.  
**EVIDENCE:** runtime Calendar → select → respond at 500px and 1440px.

### CAL-002 — Mobile "Mes" Toggle Is Silent No-Op Below 768
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Toggle "Mes" no-op <768px without feedback.  
**CURRENT EVIDENCE:** `STATIC` — B30; R05.  
**TARGET:** Compact Month = day selection + EventRows (functional).  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.1` (Compact default Agenda, Mes colapsable).  
**REAL GAP:** Non-functional control. **IMPACT:** User taps, nothing happens.  
**FILES:** `overview.tsx`. **DEPS:** GLB-001.  
**ACCEPTANCE:** Compact Month shows day selection + rows. **EVIDENCE:** runtime 500px.

### CAL-003 — Calendar Legend Lies / Omits CANCELLED
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Legend says "Club"=warning but `CLUB_EVENT` painted green; no CANCELLED.  
**CURRENT EVIDENCE:** `RUNTIME` R05.  
**TARGET:** Legend truthful + covers all states; states in text.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.1` (Row Grammar).  
**FILES:** `overview.tsx`. **DEPS:** GLB-035 state tone.  
**ACCEPTANCE:** Legend matches rendered states. **EVIDENCE:** runtime.

### CAL-004 — Calendar Default View Not Regime-Aware
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Agenda default everywhere; Mes on desktop. Medium defaults wrong.  
**CURRENT EVIDENCE:** `STATIC`.  
**TARGET:** Compact=Agenda, Medium=Semana, Wide=Mes.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.1` (Responsive Defaults).  
**FILES:** `overview.tsx`. **DEPS:** GLB-001.  
**ACCEPTANCE:** Defaults per regime. **EVIDENCE:** runtime 500/900/1440.

### CAL-005 — Wide Month No Panel Detail (Inspector)
**SEVERITY:** P1 | **TYPE:** CREATE | **BACKEND:** No  
**CURRENT:** No lateral detail panel from grid.  
**CURRENT EVIDENCE:** `STATIC`.  
**TARGET:** Wide Month → full grid + panel detail (Inspector).  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.1` (Wide Month).  
**FILES:** `overview.tsx`. **DEPS:** GLB-013.  
**ACCEPTANCE:** Grid selection populates Inspector. **EVIDENCE:** runtime 1440.

### CAL-006 — Postponed Shows "A definir" + Future Date in Próximamente
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Postponed event shows "A definir" hour + "sáb, 17 oct".  
**CURRENT EVIDENCE:** `RUNTIME` R-02.10.  
**TARGET:** Postponed composition explicit (state + consequence).  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.2` (Terminal States).  
**FILES:** `overview.tsx`, `events.tsx`. **DEPS:** None.  
**ACCEPTANCE:** Postponed rendered with state banner. **EVIDENCE:** runtime.

### CAL-007 — Home Excludes POSTPONED From Hoy, Calendar Includes
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Two truths for POSTPONED ("Hoy").  
**CURRENT EVIDENCE:** `RUNTIME` R-01/B41.  
**TARGET:** Single truth across Home/Calendar.  
**TARGET SOURCE:** `DOMAIN_01/02` Postponed handling.  
**FILES:** `overview.tsx`. **DEPS:** None.  
**ACCEPTANCE:** Consistent POSTPONED placement. **EVIDENCE:** runtime.

### CAL-008 — Calendar No "Crear evento" Context After Selection
**SEVERITY:** P3 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Create only in header.  
**TARGET:** Contextual create near selected date (COACH).  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.3`.  
**FILES:** `overview.tsx`. **ACC:** contextual create. **EVIDENCE:** runtime.

---

## EVENT-* — Event Detail / Create / Edit Gaps

### EVENT-001 — Terminal Events Render as Live
**SEVERITY:** P0 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** CANCELLED shows date/hour/sede/logistics/rail identical to live; only badge changes. `StateBanner` 0 consumers.  
**CURRENT EVIDENCE:** `RUNTIME` R-04.15; UX-04.  
**TARGET:** Terminal = own composition + consequence + history visible + no ¿Vas? primary.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.2` (Terminal States).  
**REAL GAP:** Terminal states not communicated. **IMPACT:** User may act on cancelled event.  
**FILES:** `events.tsx`, `shared/patterns.tsx`. **DEPS:** GLB-019.  
**ACCEPTANCE:** CANCELLED/POSTPONED/COMPLETED/ABANDONED own composition + consequence + no ¿Vas?. **EVIDENCE:** runtime ×4 states.

### EVENT-002 — ScopeDialog Has No Effect (Bulk Serie)
**SEVERITY:** P0 | **TYPE:** MODIFY + BACKEND | **BACKEND:** Yes  
**CURRENT:** Choosing "Toda la serie" mutates exactly 1 event; `seriesCount` shown as if 2. `scope` not in patch.  
**CURRENT EVIDENCE:** `STATIC` — verified; S4-01 AGRAVADO.  
**TARGET:** Apply change to chosen scope occurrences + per-occurrence overrides + `revision++`.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.3` (ScopeDialog) + §2.5 (EventSeries).  
**REAL GAP:** Scope intent unfulfilled. **IMPACT:** Trust — claims scope it doesn't apply.  
**FILES:** `events.tsx`, `mock/store.tsx`, backend command. **DEPS:** EVENT-008.  
**ACCEPTANCE:** Scope applied to occurrences; overrides per occurrence. **EVIDENCE:** runtime + test.

### EVENT-003 — No Title Field in Edit (Non-Material Branch Unreachable)
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** No Title field in edit → non-material branch of §11 unreachable.  
**CURRENT EVIDENCE:** `RUNTIME` R14; UX-20.  
**TARGET:** Title editable for CLUB_EVENT; non-material branch reachable.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.3` (Sections).  
**FILES:** `events.tsx`. **DEPS:** None.  
**ACC:** Title field present for CLUB_EVENT. **EVIDENCE:** runtime.

### EVENT-004 — No `<form>` / Enter Doesn't Submit / 0 aria-invalid
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** EventForm no `<form>`; Enter no submit; 0 aria-invalid.  
**CURRENT EVIDENCE:** `STATIC` — B24; R14.  
**TARGET:** `<form>` + inline validation + focus first error.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.3` (Validation) + GLB-015/021.  
**FILES:** `events.tsx`, `shared/ui.tsx`. **DEPS:** GLB-015, GLB-021.  
**ACC:** Enter submits; inline errors. **EVIDENCE:** runtime + grep.

### EVENT-005 — Recovery Destroys Draft
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Error recovery navigates and destroys draft (§44 violation).  
**CURRENT EVIDENCE:** `STATIC` — `events.tsx:1145-1146`; S4-02.  
**TARGET:** 409 preserves baseline + localDraft + latestServer; Conflict Workspace.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.3` + §2.4 (Conflict Workspace).  
**FILES:** `events.tsx`. **DEPS:** EVENT-012.  
**ACC:** Draft preserved on conflict; 3-way view. **EVIDENCE:** runtime + test.

### EVENT-006 — ABANDONED Inalcanzable / IN_PROGRESS Transitions Without Modal
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** ABANDONED unreachable; IN_PROGRESS transitions no modal.  
**CURRENT EVIDENCE:** `STATIC` — UX-31.  
**TARGET:** Full lifecycle reachable; transitions with consequence modal.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.2` (Terminal).  
**FILES:** `events.tsx`. **DEPS:** None.  
**ACC:** All lifecycle transitions reachable with modal. **EVIDENCE:** runtime.

### EVENT-007 — RESTORE vs RESCHEDULE Notification Indistinguishable
**SEVERITY:** P2 | **TYPE:** MODIFY + BACKEND | **BACKEND:** Yes  
**CURRENT:** RESTORE/RESCHEDULE same notification.  
**CURRENT EVIDENCE:** `STATIC`.  
**TARGET:** Distinct types EVENT_RESTORED/EVENT_CHANGED.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.4`.  
**FILES:** `mock/notifications.ts`. **DEPS:** GLB-025.  
**ACC:** Distinct notifications. **EVIDENCE:** test.

### EVENT-008 — EventSeries Model Partial, No Bulk Occurrence
**SEVERITY:** P1 | **TYPE:** MODIFY + BACKEND | **BACKEND:** Yes  
**CURRENT:** `eventSeries[]` + `seriesId` + ScopeDialog exist; no bulk occurrence/override.  
**CURRENT EVIDENCE:** `STATIC` — P1-04 PARTIAL; S4-01.  
**TARGET:** Occurrences generated as independent Events; overrides per occurrence; 366 limit.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.5`.  
**FILES:** `mock/model.ts`, `mock/store.tsx`, `events.tsx`. **DEPS:** EVENT-002.  
**ACC:** Series generates N occurrences; edit with override affects one. **EVIDENCE:** test + runtime.

### EVENT-009 — Event Targets Plural Partial
**SEVERITY:** P1 | **TYPE:** MODIFY + BACKEND | **BACKEND:** Yes  
**CURRENT:** `targetTeams[]`/`targetPersonIds[]` exist; cluster-wide reader incomplete.  
**CURRENT EVIDENCE:** `STATIC` — P1-03 CLOSED but P2-15 open.  
**TARGET:** Targets plural full; clubWideTarget shows all relevant rosters.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.2` (L1) + Product Truth §10.  
**FILES:** `mock/store.tsx`, `participation.tsx`, `overview.tsx`. **DEPS:** None.  
**ACC:** Multi-team/person training; club-wide shows all. **EVIDENCE:** test + runtime.

### EVENT-010 — Event Detail Rail Missing Counts / "0 sí" Incomprehensible
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** "15 respuestas · 3 sin respuesta · 15 necesitan reconfirmación 0 sí". "0 sí" indecipherable.  
**CURRENT EVIDENCE:** `RUNTIME` R-04.14.  
**TARGET:** Rail rows with clear state text + counts (sí/quizás/no/sin respuesta/reconfirmar).  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.2` (Rail Participación).  
**FILES:** `events.tsx`. **DEPS:** None.  
**ACC:** Rail counts clear per response type. **EVIDENCE:** runtime.

### EVENT-011 — Event Detail Breadcrumb Wrong ("Partido o entrenamiento")
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Breadcrumb generic for specific match.  
**CURRENT EVIDENCE:** `RUNTIME` R13.  
**TARGET:** Breadcrumb names the event (vocabulary).  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.2`.  
**FILES:** `shared/nav-context.ts`. **ACC:** Specific breadcrumb. **EVIDENCE:** runtime.

### EVENT-012 — Conflict Workspace Missing (3-column)
**SEVERITY:** P1 | **TYPE:** CREATE | **BACKEND:** Yes  
**CURRENT:** No baseline/localDraft/latestServer side-by-side; scenario triggers once/session.  
**CURRENT EVIDENCE:** `STATIC` — P1-06 PARTIAL; S4-02.  
**TARGET:** Dedicated Conflict Workspace surface.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.3` + `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §5.2` (DEDICATED).  
**FILES:** `events.tsx`, `participation.tsx`, new surface. **DEPS:** EVENT-005, EVENT-002.  
**ACC:** 3-way conflict surface with explicit per-version action. **EVIDENCE:** runtime + test.

### EVENT-013 — No `expectedVersion` on Create
**SEVERITY:** P2 | **TYPE:** MODIFY + BACKEND | **BACKEND:** Yes  
**CURRENT:** Create has no expectedVersion.  
**CURRENT EVIDENCE:** `STATIC` — R12.  
**TARGET:** Create is single command; version handled server-side.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.3`.  
**FILES:** `events.tsx`, `mock/store.tsx`. **ACC:** create command atomic. **EVIDENCE:** test.

### EVENT-014 — Type Selector Color-Only State
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Event type selector conveys state only by color; no aria-pressed/role=radio.  
**CURRENT EVIDENCE:** `RUNTIME` R12; B08.  
**TARGET:** role=radio / aria-pressed + visible state.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.3` + `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §Accessibility`.  
**FILES:** `events.tsx`. **DEPS:** GLB-017.  
**ACC:** Selector announces selection to AT. **EVIDENCE:** axe + keyboard.

### EVENT-015 — Logistics "Hora de salida: No aplica" Negation Copy
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** "Hora de salida: No aplica" with negation copy.  
**CURRENT EVIDENCE:** `RUNTIME` C11.  
**TARGET:** Hide empty logistics fields; no "No aplica".  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.2` (L2 Logística).  
**FILES:** `events.tsx`. **ACC:** Empty fields hidden. **EVIDENCE:** runtime.

### EVENT-016 — Venue Metadata Not Editable (address/fieldLabel)
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Venue metadata not editable; literal address in EventDetail.  
**CURRENT EVIDENCE:** `STATIC` — M-13.  
**TARGET:** Venue.address/fieldLabel editable; EventDetail shows real address or "Sin dirección".  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.6` (Venue).  
**FILES:** `management.tsx`, `events.tsx`, `mock/model.ts`. **DEPS:** None.  
**ACC:** Real address; no literal. **EVIDENCE:** runtime.

---

## JOR-* — Jornada Gaps

### JOR-001 — `/jornadas/new` Hard to Reach / More Gating
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** `/jornadas/new` only if `state.jornadas.length > 0` from More; else unreachable.  
**CURRENT EVIDENCE:** `STATIC` — P2-32 CLOSED partial.  
**TARGET:** Derive from state, fallback to `/jornadas/new`.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.1` (More destinations).  
**FILES:** `account-insight.tsx`. **ACC:** Always reachable for sport/official. **EVIDENCE:** runtime.

### JOR-002 — Jornada `count={19}` Hardcoded in Preview
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Impact preview count hardcoded 19.  
**CURRENT EVIDENCE:** `STATIC` — R20; B35.  
**TARGET:** Real count from children.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.6` (Impact Preview).  
**FILES:** `events.tsx`. **ACC:** Real count. **EVIDENCE:** runtime.

### JOR-003 — Jornada Bulk Omits expectedVersion; False Copy
**SEVERITY:** P1 | **TYPE:** MODIFY + BACKEND | **BACKEND:** Yes  
**CURRENT:** Bulk omits expectedVersion; revision++ makes all availability stale with "El horario cambió" when venue changed.  
**CURRENT EVIDENCE:** `STATIC` — R20.  
**TARGET:** expectedVersion; honest copy per change type.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.6`.  
**FILES:** `events.tsx`, `mock/store.tsx`. **ACC:** Correct reason text; version checked. **EVIDENCE:** test.

### JOR-004 — No Add/Remove Match in Jornada
**SEVERITY:** P1 | **TYPE:** CREATE + BACKEND | **BACKEND:** Yes  
**CURRENT:** No add/remove children.  
**CURRENT EVIDENCE:** `STATIC` — S4-03/flow J.  
**TARGET:** Add/remove matches respecting max-1 jornada per match.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.6` (§R20).  
**FILES:** `events.tsx`, backend. **ACC:** add/remove works with constraint. **EVIDENCE:** test.

### JOR-005 — No Sticky Create/Guardar; Modal No Error / Backdrop Not Blocked
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** "Crear jornada" inline not sticky; modal no error; backdrop close during mutation not blocked.  
**CURRENT EVIDENCE:** `RUNTIME` R19/R20.  
**TARGET:** Sticky primary; modal blocks during mutation; error handled.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.6` + `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §7.2`.  
**FILES:** `events.tsx`. **ACC:** sticky + mutation lock. **EVIDENCE:** runtime.

### JOR-006 — No Season/Entry/Scope Validation on Create
**SEVERITY:** P1 | **TYPE:** MODIFY + BACKEND | **BACKEND:** Yes  
**CURRENT:** No season/Entry/scope validation.  
**CURRENT EVIDENCE:** `STATIC` — R19.  
**TARGET:** `Match Team.season = Jornada.season`; `COMPETITION_SCOPE_MISMATCH`; bulk limit 100.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.6`.  
**FILES:** `events.tsx`, `mock/store.tsx`, backend. **ACC:** validations produce explained errors. **EVIDENCE:** test.

---

## PART-* — Participation Lifecycle Gaps

### PART-001 — Two ¿Vas? Grammars ("¿Vas?" vs "¿Podés participar?", "Voy" vs "Sí")
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Two ¿Vas? grammars with distinct state detection.  
**CURRENT EVIDENCE:** `RUNTIME` R15; UX-09.  
**TARGET:** Single `vas.tsx` grammar everywhere.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.4` + `GEI_FINAL_FRONTEND_FREEZE_V1.md §7`.  
**FILES:** `participation.tsx`, `shared/vas.tsx`. **ACC:** One grammar. **EVIDENCE:** runtime.

### PART-002 — Availability Optimistic Toast (§47)
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** Yes  
**CURRENT:** "Tu disponibilidad quedó confirmada" optimistic (prohibited §47).  
**CURRENT EVIDENCE:** `RUNTIME` R15.  
**TARGET:** Confirm after persistence; no unconfirmed success.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.4` + `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §7.1`.  
**FILES:** `participation.tsx`. **DEPS:** backend. **ACC:** optimistic UI allowed but confirmation honest. **EVIDENCE:** runtime + test.

### PART-003 — RECONFIRM Tone Neutral / Not in Enum
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** RECONFIRM missing from enum → neutral tone.  
**CURRENT EVIDENCE:** `STATIC` — UX-06.  
**TARGET:** NEEDS_RECONFIRMATION with warning tone.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.4` + `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §3.1`.  
**FILES:** `shared/states.ts`. **ACC:** Correct tone. **EVIDENCE:** runtime.

### PART-004 — Availability Missing Counts by Type + Recovery Row
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** No counts per response type; no recovery row; 18 repeated labels.  
**CURRENT EVIDENCE:** `RUNTIME` R15.  
**TARGET:** Counts per type; recovery row; density reduced.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.4`.  
**FILES:** `participation.tsx`. **ACC:** counts + recovery. **EVIDENCE:** runtime.

### PART-006 — Selection Publish Blocks on Conflict (Contradicts §14)
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** Yes  
**CURRENT:** Publish blocks by BLOCKED/PENDING (Stage 4 pilot allows, but logic duplicative).  
**CURRENT EVIDENCE:** `STATIC`/`RUNTIME` R16.  
**TARGET:** Publish with derived conflict; warn + explain + register revision (never mute block).  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.4` (Selection).  
**FILES:** `participation.tsx`, `mock/store.tsx`. **ACC:** publish-with-conflict allowed + explained. **EVIDENCE:** test + runtime.

### PART-007 — Selection Two Competing Banners (Error+Success)
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Red error + green success stacked for one fact (UX-05).  
**CURRENT EVIDENCE:** `RUNTIME` R-06.19; UX-05.  
**TARGET:** Single coherent signal.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.4` + `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §7.1`.  
**FILES:** `participation.tsx`. **ACC:** no simultaneous error+success. **EVIDENCE:** runtime.

### PART-008 — Selection Redundant Column (18× "Necesita reconfirmación")
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** DISPONIBILIDAD column 18 repeats; low density (4 cols ~900px for ~150px data).  
**CURRENT EVIDENCE:** `RUNTIME` R-06.20,21,22.  
**TARGET:** Density per A3; remove redundant column.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.4` (row grammar).  
**FILES:** `participation.tsx`. **ACC:** density reasonable. **EVIDENCE:** runtime.

### PART-009 — Selection Sticky Bar Covers Last Row
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Sticky bar covers last row.  
**CURRENT EVIDENCE:** `RUNTIME` R-06.21; B33.  
**TARGET:** Content not obscured; bottom padding.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.4` + `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §7.2`.  
**FILES:** `participation.tsx`. **ACC:** last row visible. **EVIDENCE:** runtime.

### PART-010 — Selection No Revision Diff / No History Visible
**SEVERITY:** P1 | **TYPE:** MODIFY + BACKEND | **BACKEND:** Yes  
**CURRENT:** No revision diff; `selectionRevisions` populated but not shown.  
**CURRENT EVIDENCE:** `STATIC` — R-06.24.  
**TARGET:** Revision diff (selectedNow/removedNow); immutable revisions visible.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.4` (Selection).  
**FILES:** `participation.tsx`, `shared/ui.tsx` (DiffList). **ACC:** diff visible. **EVIDENCE:** test + runtime.

### PART-011 — Selection Player Doesn't See If Convoked
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Read-only shows "12 convocadas" + names; player can't tell if she is.  
**CURRENT EVIDENCE:** `RUNTIME` R16.  
**TARGET:** Player sees own convocation status (L0).  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.4`.  
**FILES:** `participation.tsx`. **ACC:** own status visible. **EVIDENCE:** runtime PLAYER.

### PART-012 — Attendance Buttons 36px (Mis-tap Risk)
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** 3 row buttons min-h-9 (36px) with 6px gap.  
**CURRENT EVIDENCE:** `STATIC` — R17; UX-32.  
**TARGET:** ≥44px.  
**TARGET SOURCE:** `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §2` + GLB-022.  
**FILES:** `participation.tsx`. **ACC:** ≥44px. **EVIDENCE:** computed styles.

### PART-013 — Attendance History Invisible
**SEVERITY:** P0 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** `markAttendance` writes before/after nobody sees.  
**CURRENT EVIDENCE:** `STATIC` — B35; GLB-020.  
**TARGET:** History visible with before/after + actor + reason.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.4` (Attendance).  
**FILES:** `participation.tsx`, `shared/patterns.tsx`. **DEPS:** GLB-020. **ACC:** corrections visible. **EVIDENCE:** runtime + test.

### PART-014 — No Per-Row Motivo; UNRECORDED Not Terminal-Explained
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** Yes  
**CURRENT:** No per-row reason; UNRECORDED not explained as terminal; "Abrir" not sticky.  
**CURRENT EVIDENCE:** `RUNTIME` R17.  
**TARGET:** Motivo per row; UNRECORDED explained; Abrir sticky.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.4`.  
**FILES:** `participation.tsx`, `mock/model.ts`. **ACC:** motivo + sticky. **EVIDENCE:** runtime.

### PART-015 — Attendance History Correction Copy False
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** "El cierre original se conserva" not literally true (invisible).  
**CURRENT EVIDENCE:** `STATIC` — B35.  
**TARGET:** Copy true → history visible.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.4`.  
**FILES:** `participation.tsx`. **DEPS:** PART-013. **ACC:** copy truthful. **EVIDENCE:** runtime.

### PART-016 — MatchRecord Editable While SCHEDULED
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Editable with event SCHEDULED, contradicting own text; ABANDONED selectable without lifecycle.  
**CURRENT EVIDENCE:** `RUNTIME` R18; UX-31.  
**TARGET:** Gate by lifecycle; correct states reachable.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.4` (MatchRecord).  
**FILES:** `participation.tsx`. **ACC:** gated correctly. **EVIDENCE:** runtime + test.

### PART-017 — MatchRecord History Invisible
**SEVERITY:** P0 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** `recordHistory` before/after written, never rendered.  
**CURRENT EVIDENCE:** `STATIC` — B35; GLB-020.  
**TARGET:** History visible with before/after.  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.4` (MatchRecord).  
**FILES:** `participation.tsx`. **DEPS:** GLB-020. **ACC:** correction history visible. **EVIDENCE:** runtime + test.

### PART-018 — Selection Publish Conflict Chain Not Closing to Home
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** No chain from Selection conflict to Home attention.  
**CURRENT EVIDENCE:** `RUNTIME` R16 / B43.  
**TARGET:** Conflict chain closes to Home.  
**TARGET SOURCE:** `DOMAIN_01/02`. **FILES:** `overview.tsx`, `participation.tsx`. **ACC:** conflict surfaces on Home. **EVIDENCE:** runtime.

### PART-019 — `hasCurrentConflicts` Doesn't Detect "No Respondió"
**SEVERITY:** P2 | **TYPE:** MODIFY + BACKEND | **BACKEND:** Yes  
**CURRENT:** `needsReconfirmation` detects stale only, never "didn't respond".  
**CURRENT EVIDENCE:** `STATIC` — C16.  
**TARGET:** Derived conflict includes no-response (per §14, no nudge notification).  
**TARGET SOURCE:** `DOMAIN_02...V1.0.md §2.4`.  
**FILES:** `mock/store.tsx`. **ACC:** conflict derivation complete. **EVIDENCE:** test.

---

## SUMMARY — Calendar + Participation

| Gap ID | Sev | Type | Backend |
|--------|-----|------|---------|
| CAL-001 | P1 | MODIFY | No |
| CAL-002 | P1 | MODIFY | No |
| CAL-003 | P2 | MODIFY | No |
| CAL-004 | P1 | MODIFY | No |
| CAL-005 | P1 | CREATE | No |
| CAL-006 | P2 | MODIFY | No |
| CAL-007 | P2 | MODIFY | No |
| CAL-008 | P3 | MODIFY | No |
| EVENT-001 | P0 | MODIFY | No |
| EVENT-002 | P0 | MODIFY | Yes |
| EVENT-003 | P1 | MODIFY | No |
| EVENT-004 | P1 | MODIFY | No |
| EVENT-005 | P1 | MODIFY | No |
| EVENT-006 | P1 | MODIFY | No |
| EVENT-007 | P2 | MODIFY | Yes |
| EVENT-008 | P1 | MODIFY | Yes |
| EVENT-009 | P1 | MODIFY | Yes |
| EVENT-010 | P1 | MODIFY | No |
| EVENT-011 | P2 | MODIFY | No |
| EVENT-012 | P1 | CREATE | Yes |
| EVENT-013 | P2 | MODIFY | Yes |
| EVENT-014 | P1 | MODIFY | No |
| EVENT-015 | P2 | MODIFY | No |
| EVENT-016 | P2 | MODIFY | No |
| JOR-001 | P2 | MODIFY | No |
| JOR-002 | P1 | MODIFY | No |
| JOR-003 | P1 | MODIFY | Yes |
| JOR-004 | P1 | CREATE | Yes |
| JOR-005 | P2 | MODIFY | No |
| JOR-006 | P1 | MODIFY | Yes |
| PART-001 | P2 | MODIFY | No |
| PART-002 | P1 | MODIFY | Yes |
| PART-003 | P2 | MODIFY | No |
| PART-004 | P2 | MODIFY | No |
| PART-006 | P1 | MODIFY | Yes |
| PART-007 | P1 | MODIFY | No |
| PART-008 | P2 | MODIFY | No |
| PART-009 | P1 | MODIFY | No |
| PART-010 | P1 | MODIFY | Yes |
| PART-011 | P1 | MODIFY | No |
| PART-012 | P1 | MODIFY | No |
| PART-013 | P0 | MODIFY | No |
| PART-014 | P2 | MODIFY | Yes |
| PART-015 | P2 | MODIFY | No |
| PART-016 | P1 | MODIFY | No |
| PART-017 | P0 | MODIFY | No |
| PART-018 | P2 | MODIFY | No |
| PART-019 | P2 | MODIFY | Yes |

**Subtotal: 47 gaps (P0: 4, P1: 23, P2: 19, P3: 1)**

> **Note:** PART-005 removed — Guardian actor OUT per Product Truth V1.1 scope reconciliation. See `21_TARGET_DRIFT_RECONCILIATION.md`.