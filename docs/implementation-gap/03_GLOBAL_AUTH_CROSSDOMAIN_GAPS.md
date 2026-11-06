# 03_GLOBAL_AUTH_CROSSDOMAIN_GAPS.md

# Global / Auth / Cross-Domain Gaps

**Authority:** `docs/target-ux/GEI_TARGET_UX_FREEZE_V1.0.md`, `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md`  
**Scope:** GLB-* gaps affecting global navigation, responsive, authority, overlays, auth  
**Date:** 2026-10-22

---

## GAP SCHEMA (Applied to every gap)

```
GAP ID | SCOPE | SEVERITY | CLASSIFICATION | GAP TYPE | COMPLIANCE STATUS | CURRENT |
CURRENT EVIDENCE | TARGET | TARGET SOURCE FILE + SECTION | REAL GAP | WHY IT MATTERS |
USER IMPACT | PRODUCT LOGIC CHANGE | DATA CONTRACT CHANGE | AUTHORITY IMPACT | PII IMPACT |
RESPONSIVE IMPACT | STATE IMPACT | NAVIGATION IMPACT | OVERLAY IMPACT | FEEDBACK IMPACT |
MOTION IMPACT | ACCESSIBILITY IMPACT | FILES / COMPONENTS LIKELY AFFECTED |
SHARED SYSTEM IMPACT | DEPENDENCIES | ACCEPTANCE CRITERIA | EVIDENCE REQUIRED TO CLOSE
```

---

## GLB-001 — 3 Responsive Regimes Missing

**SCOPE:** Global  
**SEVERITY:** P0  
**CLASSIFICATION:** RESPONSIVE  
**GAP TYPE:** CREATE  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** Single breakpoint at 1024px (desktop/mobile). Sidebar appears at 1024px but two-column panels only start at `xl` (1280px). No Medium regime (768–1199) distinct from Compact.  
**CURRENT EVIDENCE:** `STATIC` — `xl:grid-cols-[1fr_300px]` in overview.tsx, events.tsx; RUNTIME R-06 at 1440px; B30 MAJOR.

**TARGET:** 3 regimes: Compact `<768` (TopBar 56, BottomNav 64+safe, gutter 16), Medium `768–1199` (NavigationRail 72, gutter 24), Wide `≥1200` (Sidebar 240, gutter 32).  
**TARGET SOURCE:** `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §4.2` + `docs/target-ux/GEI_TARGET_UX_FREEZE_V1.0.md` Responsive Regimes

**REAL GAP:** Missing Medium regime entirely; Wide starts at 1280 not 1200; gutters not differentiated.  
**WHY IT MATTERS:** Tablet users (768–1199) get mobile layout with wasted space; the frozen design specifies Rail + Semana default.  
**USER IMPACT:** Tablet users cannot use Wide affordances; develop layouts jump at wrong threshold.  
**PRODUCT LOGIC CHANGE:** No  
**DATA CONTRACT CHANGE:** No  
**AUTHORITY IMPACT:** No  
**PII IMPACT:** No  
**RESPONSIVE IMPACT:** YES (core)  
**STATE IMPACT:** Calendar default view wrong per regime  
**NAVIGATION IMPACT:** Rail missing  
**OVERLAY IMPACT:** No  
**FEEDBACK IMPACT:** No  
**MOTION IMPACT:** No  
**ACCESSIBILITY IMPACT:** Touch targets differ per regime  
**FILES / COMPONENTS LIKELY AFFECTED:** `src/app/Shell.tsx`, `src/styles/theme.css`, all features with responsive classes  
**SHARED SYSTEM IMPACT:** YES — `Shell`, breakpoint tokens  
**DEPENDENCIES:** GLB-002 (Rail), GLB-004 (Wide TopBar)  
**ACCEPTANCE CRITERIA:** 3 regimes render correctly at 500/768/1200/1440; Calendar defaults Agenda/Semana/Mes; gutters 16/24/32.  
**EVIDENCE REQUIRED TO CLOSE:** Runtime captures at 4 widths + scrollWidth check (no overflow).

---

## GLB-002 — NavigationRail Missing (Medium)

**SCOPE:** Global  
**SEVERITY:** P1  
**CLASSIFICATION:** NAVIGATION  
**GAP TYPE:** CREATE  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** No NavigationRail. Medium (768–1199) uses BottomNav.  
**CURRENT EVIDENCE:** `STATIC` — `Shell.tsx` only has BottomNav + Sidebar.

**TARGET:** NavigationRail 72px width in Medium regime, same 5 destinations.  
**TARGET SOURCE:** `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §4.2` (Medium NavigationRail 72)

**REAL GAP:** Entire component missing.  
**WHY IT MATTERS:** Frozen design specifies Rail for Medium; BottomNav at 768+ wastes vertical space.  
**USER IMPACT:** Tablet users lack the intended navigation pattern.  
**PRODUCT LOGIC CHANGE:** No | **DATA CONTRACT CHANGE:** No | **AUTHORITY IMPACT:** No | **PII IMPACT:** No  
**RESPONSIVE IMPACT:** YES | **STATE IMPACT:** No | **NAVIGATION IMPACT:** YES | **OVERLAY IMPACT:** No  
**FEEDBACK IMPACT:** No | **MOTION IMPACT:** No | **ACCESSIBILITY IMPACT:** Rail needs `nav` landmark + focus  
**FILES:** `src/app/Shell.tsx`, `src/shared/ui.tsx` (new Rail primitive)  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** GLB-001  
**ACCEPTANCE CRITERIA:** Rail renders 768–1199, 72px, same 5 destinations, active state, keyboard accessible.  
**EVIDENCE REQUIRED:** Runtime capture at 900px.

---

## GLB-003 — Design System Tokens Not Adopted

**SCOPE:** Global  
**SEVERITY:** P1  
**CLASSIFICATION:** SHARED COMPONENT / VISUAL  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** 10 arbitrary type sizes (8,9,10,11,12,13,14,15,16,27px); `.gei-*` classes have ~25 lines of consumers in 5700 total. `Header` uses 27px vs token 26px.  
**CURRENT EVIDENCE:** `STATIC` — B11 MAJOR; UX-02; 9 uses of 9px, 50 uses of 10px.

**TARGET:** 9 typography roles only; `.gei-page-title`, `.gei-section-title`, `.gei-body`, `.gei-meta`, etc.; no `text-[Npx]`.  
**TARGET SOURCE:** `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §1.3`

**REAL GAP:** Tokens declared but not adopted across features.  
**WHY IT MATTERS:** L0–L3 hierarchy not perceivable; typography noise weakens scan.  
**USER IMPACT:** Hierarchy not perceived in 5s; eye finds no anchor.  
**PRODUCT LOGIC CHANGE:** No | **DATA CONTRACT CHANGE:** No | **AUTHORITY IMPACT:** No | **PII IMPACT:** No  
**RESPONSIVE IMPACT:** Minor (type scales) | **STATE IMPACT:** No | **NAVIGATION IMPACT:** No  
**OVERLAY IMPACT:** No | **FEEDBACK IMPACT:** No | **MOTION IMPACT:** No  
**ACCESSIBILITY IMPACT:** Contrast/hierarchy |  
**FILES:** All 6 features, `shared/ui.tsx`, `shared/patterns.tsx`, `styles/theme.css`  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** None  
**ACCEPTANCE CRITERIA:** `grep "text-\[[0-9]*px\]"` = 0 in features; all text uses `.gei-*` or token class.  
**EVIDENCE REQUIRED:** grep + runtime hierarchy check at 1440px.

---

## GLB-004 — Wide Global TopBar Must Disappear

**SCOPE:** Global  
**SEVERITY:** P1  
**CLASSIFICATION:** RESPONSIVE  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** TopBar persists in Wide alongside Sidebar 224px.  
**CURRENT EVIDENCE:** `STATIC` — `Shell.tsx` renders TopBar unconditionally.

**TARGET:** Wide ≥1200: TopBar replaced by Sidebar; Search moves to Sidebar or Command Dialog; Notifications to Popover.  
**TARGET SOURCE:** `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §4.2` (Wide Sidebar 240)

**REAL GAP:** TopBar not removed in Wide; Sidebar is 224px not 240px.  
**WHY IT MATTERS:** Frozen design specifies Sidebar-only for Wide.  
**USER IMPACT:** Redundant chrome; content pushed down.  
**PRODUCT LOGIC CHANGE:** No | **DATA CONTRACT CHANGE:** No | **AUTHORITY IMPACT:** No | **PII IMPACT:** No  
**RESPONSIVE IMPACT:** YES | **NAVIGATION IMPACT:** YES | **OVERLAY IMPACT:** YES (Search/Notif relocation)  
**STATE/OVERLAY/FEEDBACK/MOTION/A11Y:** Minor  
**FILES:** `src/app/Shell.tsx`  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** GLB-008, GLB-009  
**ACCEPTANCE CRITERIA:** At ≥1200 no TopBar; Search/Notifications reachable from Sidebar.  
**EVIDENCE REQUIRED:** Runtime capture at 1440px.

---

## GLB-005 — Color Acent Not Reserved

**SCOPE:** Global  
**SEVERITY:** P1  
**CLASSIFICATION:** VISUAL  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** Blue GEI means 8 things (brand, primary, nav active, chip, icon, link, badge, dot). 0 `variant="danger"`.  
**CURRENT EVIDENCE:** `STATIC` — UX-01; RUNTIME color budget §6.2.

**TARGET:** Primary reserved for: action primary, selection, action-required state, unread. `danger` mandatory for destructive.  
**TARGET SOURCE:** `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §1.1` (regla de reserva de acento)

**REAL GAP:** Accent overused; danger unused.  
**WHY IT MATTERS:** Eye has no reliable signal; destructive actions look benign.  
**USER IMPACT:** Cannot tell what's actionable vs decorative; risk of accidental destructive.  
**PRODUCT LOGIC CHANGE:** No | **DATA CONTRACT CHANGE:** No | **AUTHORITY IMPACT:** No | **PII IMPACT:** No  
**RESPONSIVE IMPACT:** No | **STATE IMPACT:** Tone mapping | **NAVIGATION IMPACT:** No  
**OVERLAY IMPACT:** No | **FEEDBACK IMPACT:** error/success simultaneity | **MOTION IMPACT:** No  
**ACCESSIBILITY IMPACT:** Color-independence |  
**FILES:** `styles/theme.css`, all features, `shared/ui.tsx` (Button danger), `shared/states.ts` (tone)  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** GLB-035 (state mapping)  
**ACCEPTANCE CRITERIA:** Destructive actions use `variant="danger"`; accent used only for 4 reserved cases.  
**EVIDENCE REQUIRED:** grep `variant="danger"` > 0; visual audit 1440px.

---

## GLB-006 — Two State Vocabularies (`model.labels` vs `states.STATE_TEXT`)

**SCOPE:** Global  
**SEVERITY:** P2  
**CLASSIFICATION:** CONTENT  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** "Entrenador" vs "Entrenador o entrenadora"; "Elegible" vs "Habilitada" (3 labels for 1 value); "Sí" vs "Voy".  
**CURRENT EVIDENCE:** `STATIC` — UX-07; RUNTIME Home vs TeamDetail.

**TARGET:** Single `stateText()` / vocabulary source.  
**TARGET SOURCE:** `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §3.1`

**REAL GAP:** Duplicate label maps.  
**WHY IT MATTERS:** Same entity described differently across screens.  
**USER IMPACT:** Confusion; trust erosion.  
**PRODUCT LOGIC CHANGE:** No | **DATA CONTRACT CHANGE:** No | **AUTHORITY IMPACT:** No | **PII IMPACT:** No  
**RESPONSIVE/STATE/NAVIGATION/OVERLAY/FEEDBACK/MOTION:** No  
**ACCESSIBILITY IMPACT:** No  
**FILES:** `shared/states.ts`, `shared/model.labels` consumers  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** None  
**ACCEPTANCE CRITERIA:** `grep` shows single label source per concept.  
**EVIDENCE REQUIRED:** grep + runtime Home/TeamDetail comparison.

---

## GLB-008 — Wide Search Command Dialog Missing

**SCOPE:** Global  
**SEVERITY:** P1  
**CLASSIFICATION:** OVERLAY  
**GAP TYPE:** CREATE  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** Search is R06 route only; ⌘K shortcut exists but no dialog surface.  
**CURRENT EVIDENCE:** `STATIC` — `Shell.tsx` ⌘K navigates to `/search`.

**TARGET:** Wide ≥1200: Search opens Command Dialog (⌘K) overlay; query in URL.  
**TARGET SOURCE:** `docs/target-ux/GEI_TARGET_UX_FREEZE_V1.0.md` Search section + `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §6.3` Popover

**REAL GAP:** Command Dialog missing.  
**WHY IT MATTERS:** Frozen specifies dialog surface for Wide search.  
**USER IMPACT:** Search requires full navigation; slower for power users.  
**PRODUCT LOGIC CHANGE:** No | **DATA CONTRACT CHANGE:** No | **AUTHORITY IMPACT:** No | **PII IMPACT:** No(scope applied)  
**RESPONSIVE IMPACT:** YES (Wide) | **OVERLAY IMPACT:** YES | **STATE/NAVIGATION/FEEDBACK/MOTION:** Minor  
**ACCESSIBILITY IMPACT:** Dialog focus trap, Escape  
**FILES:** `src/app/Shell.tsx`, new `shared/CommandDialog.tsx`, `features/overview.tsx` (Search)  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** GLB-004, GLB-010 (URL)  
**ACCEPTANCE CRITERIA:** ⌘K opens dialog at ≥1200; query in URL; Escape closes; focus trap.  
**EVIDENCE REQUIRED:** Runtime capture 1440px + keyboard test.

---

## GLB-009 — Wide Notification Popover Missing

**SCOPE:** Global  
**SEVERITY:** P1  
**CLASSIFICATION:** OVERLAY  
**GAP TYPE:** CREATE  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** Notifications only at R07 route.  
**CURRENT EVIDENCE:** `STATIC` — `Shell.tsx` bell navigates to `/notifications`.

**TARGET:** Wide: Notifications open Popover from header/bell with recent avisos + "Ver todos".  
**TARGET SOURCE:** `docs/target-ux/GEI_TARGET_UX_FREEZE_V1.0.md` Notifications section + `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §6.3`

**REAL GAP:** Popover missing.  
**WHY IT MATTERS:** Frozen specifies Popover for Wide notifications.  
**USER IMPACT:** No quick glance at avisos without navigation.  
**PRODUCT LOGIC CHANGE:** No | **DATA CONTRACT CHANGE:** No | **AUTHORITY IMPACT:** No | **PII IMPACT:** No  
**RESPONSIVE IMPACT:** YES | **OVERLAY IMPACT:** YES | Others minor  
**ACCESSIBILITY IMPACT:** Popover keyboard/focus  
**FILES:** `Shell.tsx`, new `shared/Popover.tsx`  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** GLB-004  
**ACCEPTANCE CRITERIA:** Bell opens Popover at ≥1200 with recent + "Ver todos"; Escape/click-out.  
**EVIDENCE REQUIRED:** Runtime 1440px.

---

## GLB-010 — Origin-Aware Back Entirely Missing

**SCOPE:** Global  
**SEVERITY:** P0  
**CLASSIFICATION:** NAVIGATION  
**GAP TYPE:** CREATE  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** `useSearchParams` = **0** in all `src/`. No filter/tab/month in URL. Back loses context.  
**CURRENT EVIDENCE:** `STATIC` — verified 0 matches in `src/**`; B16 MAJOR; UX-24.

**TARGET:** Back restores filters, tab, scroll, query, calendar month/view. URL = source of truth. Deep link autosuficiente.  
**TARGET SOURCE:** `docs/target-ux/GEI_TARGET_UX_FREEZE_V1.0.md` Origin-Aware Back section

**REAL GAP:** Entire URL-state layer missing.  
**WHY IT MATTERS:** Users lose context constantly; deep links broken.  
**USER IMPACT:** Every Back resets; cannot share filtered view.  
**PRODUCT LOGIC CHANGE:** No | **DATA CONTRACT CHANGE:** No | **AUTHORITY IMPACT:** No | **PII IMPACT:** No  
**RESPONSIVE IMPACT:** No | **STATE IMPACT:** YES | **NAVIGATION IMPACT:** YES (core) | **OVERLAY IMPACT:** No | **FEEDBACK IMPACT:** No | **MOTION IMPACT:** No  
**ACCESSIBILITY IMPACT:** No  
**FILES:** All features with filters/tabs (overview, events, participation, communication, management, account-insight)  
**SHARED SYSTEM IMPACT:** YES — new `useViewState` hook  
**DEPENDENCIES:** None (root cause)  
**ACCEPTANCE CRITERIA:** Filter/tab/month/search all reflected in URL; Back restores; deep link works.  
**EVIDENCE REQUIRED:** Runtime navigation test + URL inspection.

---

## GLB-011 — Default-ALLOW / Authority Enforcement

**SCOPE:** Global / Cross-Domain  
**SEVERITY:** P0  
**CLASSIFICATION:** AUTHORITY  
**GAP TYPE:** MODIFY + BACKEND REQUIRED  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** `getAllowedActions` exists (16 flags), **1 used**; `canViewDni`/`canViewContact`/`canViewAudit` 0 consumers. UI reimplements auth with 4 booleans; `capabilities.sport` as gate.  
**CURRENT EVIDENCE:** `STATIC` — authority.ts 2 matches each, used nowhere; UX-06 top systemic #6; C04 CONTRADICTORY.

**TARGET:** Single `getAllowedActions({ actor, event, resource, field, objectState })`; default DENY; server-side enforcement; object-level scope; field authority.  
**TARGET SOURCE:** `docs/target-ux/GEI_TARGET_UX_FREEZE_V1.0.md` Authority Semantics + Authorization (Product Truth §5, §6, §16)

**REAL GAP:** Frontend representation gap (UI does not consume authority) **AND** backend enforcement gap (no server).  
**WHY IT MATTERS:** Product Truth demands default DENY + server enforcement + object scope + field authority.  
**USER IMPACT:** Users may see actions they cannot perform or PII they should not see.  
**PRODUCT LOGIC CHANGE:** Yes (authority model) | **DATA CONTRACT CHANGE:** Yes (authority contract) | **AUTHORITY IMPACT:** YES (core) | **PII IMPACT:** YES  
**RESPONSIVE IMPACT:** No | **STATE IMPACT:** objectState input | **NAVIGATION IMPACT:** route guard | **OVERLAY IMPACT:** No | **FEEDBACK IMPACT:** denial copy | **MOTION IMPACT:** No  
**ACCESSIBILITY IMPACT:** Denied screens need h1  
**FILES:** `src/mock/authority.ts`, `src/mock/permissions.ts`, all features, new backend contract  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** None (root cause); blocks GLB-012  
**ACCEPTANCE CRITERIA (FRONTEND):** 0 `if (role === ...)`, 0 `capabilities.sport` gating; all 16 flags consumed; allowedActions drives every gate.  
**ACCEPTANCE CRITERIA (BACKEND):** Server enforces same formula, default DENY, returns 403.  
**EVIDENCE REQUIRED:** Table test 5 roles × 21 authority rows; runtime denied routes; backend 403 evidence.

---

## GLB-012 — Object-Level Scope Exposure

**SCOPE:** Cross-Domain  
**SEVERITY:** P0  
**CLASSIFICATION:** AUTHORITY  
**GAP TYPE:** CREATE + BACKEND REQUIRED  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** No object-level scope enforcement; `Person.team` used as scope proxy. A COACH with 2 teams sees 1.  
**CURRENT EVIDENCE:** `STATIC` — S4-04; UX-06.

**TARGET:** `getAllowedActions({ scope: "EVENT", targetId: eventId, objectState })`; scope TEAM/LINE/EVENT/CLUB resolved from authorities.  
**TARGET SOURCE:** `docs/target-ux/GEI_TARGET_UX_FREEZE_V1.0.md` Authority Semantics + Resource Ownership

**REAL GAP:** Object scope not enforced anywhere.  
**WHY IT MATTERS:** Product Truth §5 requires role+scope; COACH must see all own teams.  
**USER IMPACT:** COACH with 2 teams only sees 1; wrong scope exposure.  
**PRODUCT LOGIC CHANGE:** Yes | **DATA CONTRACT CHANGE:** Yes | **AUTHORITY IMPACT:** YES | **PII IMPACT:** Indirect  
**NAVIGATION IMPACT:** Route reachability | Others minor  
**FILES:** `authority.ts`, `permissions.ts`, all scope-dependent features, backend  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** GLB-011  
**ACCEPTANCE CRITERIA:** Object scope resolved from RoleAssignment; COACH sees all own teams; forbidden objects 403/hidden.  
**EVIDENCE REQUIRED:** Table test per role × scope; runtime multi-team COACH.

---

## GLB-013 — Popover + Inspector Missing

**SCOPE:** Global / Wide compositions  
**SEVERITY:** P1  
**CLASSIFICATION:** SHARED COMPONENT  
**GAP TYPE:** CREATE  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** No Popover; no Inspector. Wide entity screens have no lateral persist panel from list.  
**CURRENT EVIDENCE:** `STATIC` — 0 Popover/Inspector in `src/`.

**TARGET:** Popover (anchored menu/filters/actions) + Inspector (right panel 300-320px persistent on list selection, Wide).  
**TARGET SOURCE:** `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §6.3` + `..` Transverse Compositions (Inspector)

**REAL GAP:** Both components missing.  
**WHY IT MATTERS:** Frozen Wide composition requires Inspector; overflow actions require Popover.  
**USER IMPACT:** Wide users lack inspect-without-navigation; menus are unanchored.  
**PRODUCT LOGIC CHANGE:** No | **DATA CONTRACT CHANGE:** No | **AUTHORITY IMPACT:** No | **PII IMPACT:** Inspector respects PII  
**OVERLAY IMPACT:** YES | **RESPONSIVE IMPACT:** YES (Wide)  
**FILES:** new `shared/Popover.tsx`, new `shared/Inspector.tsx`, consumers in features  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** GLB-001, GLB-004  
**ACCEPTANCE CRITERIA:** Inspector persists on list selection Wide; Popover anchors + flip + Escape.  
**EVIDENCE REQUIRED:** Runtime 1440px capture + keyboard.

---

## GLB-014 — Sheet Escape Bug (Dirty Discard Without Confirm)

**SCOPE:** Global overlays  
**SEVERITY:** P1  
**CLASSIFICATION:** FEEDBACK  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** `Modal` backdrop click discards form without confirming changes (§44 violation).  
**CURRENT EVIDENCE:** `STATIC` — `ui.tsx:363-366`; B22 MAJOR.

**TARGET:** Escape/backdrop on dirty form → confirm discard; preserves input.  
**TARGET SOURCE:** `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §6.4` (ConfirmDialog) + §7.1 (Feedback)

**REAL GAP:** No dirty guard on overlay close.  
**WHY IT MATTERS:** User loses work silently.  
**USER IMPACT:** Data loss on accidental Escape/backdrop.  
**PRODUCT LOGIC CHANGE:** No | **DATA CONTRACT CHANGE:** No | **AUTHORITY IMPACT:** No | **PII IMPACT:** No  
**OVERLAY IMPACT:** YES | **FEEDBACK IMPACT:** YES  
**FILES:** `shared/ui.tsx` (Modal, Sheet), features with forms  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** None  
**ACCEPTANCE CRITERIA:** Dirty overlay close → ConfirmDialog; clean close direct.  
**EVIDENCE REQUIRED:** Runtime + test.

---

## GLB-015 — Button Default Submit Bug

**SCOPE:** Global forms  
**SEVERITY:** P1  
**CLASSIFICATION:** FORMS  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** EventForm has no `<form>`; Enter doesn't submit; 0 `aria-invalid`.  
**CURRENT EVIDENCE:** `STATIC` — B24 MAJOR; RUNTIME R14.

**TARGET:** Every form wrapped in `<form>`; Enter submits when appropriate; submit button `type="submit"`.  
**TARGET SOURCE:** `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §7.1` + forms contracts (Product Truth §44)

**REAL GAP:** No form wrappers.  
**WHY IT MATTERS:** Keyboard users cannot submit; expectation broken.  
**USER IMPACT:** Enter does nothing.  
**PRODUCT LOGIC CHANGE:** No | **DATA CONTRACT CHANGE:** No | **AUTHORITY IMPACT:** No | **PII IMPACT:** No  
**ACCESSIBILITY IMPACT:** YES | **FEEDBACK IMPACT:** YES  
**FILES:** `events.tsx`, `management.tsx`, `communication.tsx`, `account-insight.tsx`, `shared/ui.tsx`  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** GLB-021 (inline validation)  
**ACCEPTANCE CRITERIA:** `<form onSubmit>` in all forms; Enter submits; aria-invalid on error.  
**EVIDENCE REQUIRED:** grep `<form` + runtime Enter test.

---

## GLB-016 — Menu Keyboard Gap

**SCOPE:** Global  
**SEVERITY:** P1  
**CLASSIFICATION:** ACCESSIBILITY  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** Overflow menu without `role="menu"`/Escape/click-out.  
**CURRENT EVIDENCE:** `STATIC` — `role="menu"` = 0; B28/B31.

**TARGET:** `role="menu"`, `role="menuitem"`, Escape closes, click-out closes, focus first item, separator before destructive.  
**TARGET SOURCE:** `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §2` (Menu) + §Accessibility

**REAL GAP:** Menu semantics missing.  
**WHY IT MATTERS:** Keyboard/AT users cannot operate overflow.  
**USER IMPACT:** Overflow inaccessible by keyboard.  
**ACCESSIBILITY IMPACT:** YES | **OVERLAY IMPACT:** YES  
**FILES:** `shared/ui.tsx` (Menu), features  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** GLB-013  
**ACCEPTANCE CRITERIA:** Menu role + Escape + click-out + focus + arrow nav.  
**EVIDENCE REQUIRED:** keyboard runtime test + axe.

---

## GLB-017 — Radio Visible-Focus Gap

**SCOPE:** Global  
**SEVERITY:** P1  
**CLASSIFICATION:** ACCESSIBILITY  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** Only `VasInline` has `aria-pressed`; checkbox/radio lack visible focus.  
**CURRENT EVIDENCE:** `STATIC` — B31 MAJOR.

**TARGET:** All radios/checkbox/toggle have visible focus + `aria-pressed`/`aria-checked`.  
**TARGET SOURCE:** `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §Accessibility`

**REAL GAP:** Focus visibility inconsistent.  
**USER IMPACT:** Keyboard users lose position.  
**ACCESSIBILITY IMPACT:** YES  
**FILES:** `shared/ui.tsx` (Checkbox, RadioGroup, SegmentedControl)  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** None  
**ACCEPTANCE CRITERIA:** focus-visible on all controls; aria-checked/pressed.  
**EVIDENCE REQUIRED:** keyboard runtime + axe.

---

## GLB-019 — Shared Target Compositions Missing

**SCOPE:** Global  
**SEVERITY:** P1  
**CLASSIFICATION:** SHARED COMPONENT  
**GAP TYPE:** CREATE  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** 6 transverse compositions not implemented: Page Intro, Object Identity, Workspace Action Region, Content Rail, Inspector, System Notice. `patterns.tsx` declares 11 but 0 consumers.  
**CURRENT EVIDENCE:** `STATIC` — patterns.tsx dead code; UX-06 systemic #2.

**TARGET:** 6 compositions implemented + consumed.  
**TARGET SOURCE:** `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md` Transverse Compositions

**REAL GAP:** Compositions missing/dead.  
**WHY IT MATTERS:** Shared grammar prevents per-screen reinvention.  
**USER IMPACT:** Inconsistent screens.  
**FILES:** `shared/patterns.tsx`, features  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** GLB-013  
**ACCEPTANCE CRITERIA:** Each composition has ≥2 real consumers.  
**EVIDENCE REQUIRED:** grep consumers + runtime.

---

## GLB-020 — History Written But Invisible (TRUST P0)

**SCOPE:** Cross-Domain (Participation, Management, Audit)  
**SEVERITY:** P0  
**CLASSIFICATION:** TRUST  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** `attendanceHistory`/`recordHistory` written in `store.tsx`, never rendered. P0-2/P0-3 declared "CLOSED with before/after" but user never sees. Audit without before/after/link/source; frozen audit dates.  
**CURRENT EVIDENCE:** `STATIC` — B35 MAJOR; RUNTIME; negative-evidence table.

**TARGET:** History rendered in Attendance, MatchRecord, EventDetail, Announcement, Simulation with before/after + actor + reason + link to object. Audit with before/after + link + source + real dates.  
**TARGET SOURCE:** `docs/target-ux/DOMAIN_02...V1.0.md §2.4` + `docs/target-ux/DOMAIN_05...V1.0.md §5.11`

**REAL GAP:** Truth written but never surfaced.  
**WHY IT MATTERS:** Product Truth claims audit/history; user cannot see it — trust violation.  
**USER IMPACT:** Corrections invisible; cannot verify what changed.  
**PRODUCT LOGIC CHANGE:** No | **DATA CONTRACT CHANGE:** No(before/after exists) | **AUTHORITY IMPACT:** Audit visible only ADMIN | **PII IMPACT:** reason redaction §6  
**STATE IMPACT:** history states | **NAVIGATION IMPACT:** link to object | **FEEDBACK IMPACT:** correction confirmation  
**FILES:** `participation.tsx`, `events.tsx`, `communication.tsx`, `account-insight.tsx`, `shared/patterns.tsx` (TimelineEntry)  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** GLB-019  
**ACCEPTANCE CRITERIA:** Attendance correction shows before/after; MatchRecord too; Audit shows before/after + link + source + real date.  
**EVIDENCE REQUIRED:** Runtime capture + test.

---

## GLB-021 — Inline Validation / Dirty / Focus-to-Error

**SCOPE:** Global forms  
**SEVERITY:** P1  
**CLASSIFICATION:** FORMS  
**GAP TYPE:** CREATE  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** 0 inline errors; `TextField`/`Select`/`TextArea` no `error`/`aria-invalid`/`aria-describedby`; 0 focus to first error; Alert lives after fields.  
**CURRENT EVIDENCE:** `STATIC` — B21/B24 MAJOR.

**TARGET:** Error per field + `aria-invalid` + `aria-describedby` + focus first error + input preserved + dirty visible + discard confirm.  
**TARGET SOURCE:** `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §7.1` + primitives `Field`

**REAL GAP:** Validation layer missing.  
**USER IMPACT:** Users can't see what failed; must hunt.  
**ACCESSIBILITY IMPACT:** YES | **FEEDBACK IMPACT:** YES  
**FILES:** `shared/ui.tsx` (Field/TextField/Select/TextArea), all forms  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** GLB-015  
**ACCEPTANCE CRITERIA:** Error inline per field; aria-invalid/describedby; focus first error; dirty tracked.  
**EVIDENCE REQUIRED:** Runtime + test.

---

## GLB-022 — Touch Targets < 44px

**SCOPE:** Global  
**SEVERITY:** P1  
**CLASSIFICATION:** ACCESSIBILITY  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** Button 40px; Attendance row buttons **36px** with 6px gap; Checkbox 16px; Links 18px.  
**CURRENT EVIDENCE:** `STATIC` — B29 MAJOR; RUNTIME R17.

**TARGET:** 44px minimum on all roster gestures; checkbox ampliable; links 44px where gesture.  
**TARGET SOURCE:** `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §2` + §Accessibility

**REAL GAP:** Sub-44px targets in high-consequence actions.  
**WHY IT MATTERS:** Mis-tap on attendance = wrong data.  
**USER IMPACT:** Accidental wrong attendance.  
**ACCESSIBILITY IMPACT:** YES | **RESPONSIVE IMPACT:** YES  
**FILES:** `shared/ui.tsx` (Button min-h-11), `participation.tsx` (Attendance)  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** None  
**ACCEPTANCE CRITERIA:** All gestures ≥44px; attendance buttons ≥44px.  
**EVIDENCE REQUIRED:** computed styles + runtime.

---

## GLB-023 — Motion Causal Missing

**SCOPE:** Global  
**SEVERITY:** P2  
**CLASSIFICATION:** MOTION  
**GAP TYPE:** CREATE  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** Tokens declared; 0 causal motion (row removal, publish, close unanimated).  
**CURRENT EVIDENCE:** `STATIC` — B32 MINOR.

**TARGET:** Micro feedback (¿Vas? saved, count live), state transition (draft→published), context transition (modal/sheet). ≤180ms; reduced-motion off.  
**TARGET SOURCE:** `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §7.4`

**REAL GAP:** No motion where causality expected.  
**USER IMPACT:** Changes feel magic/instant.  
**MOTION IMPACT:** YES  
**FILES:** `styles/theme.css`, features  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** None  
**ACCEPTANCE CRITERIA:** Micro/state/context transitions present; reduced-motion off.  
**EVIDENCE REQUIRED:** runtime + reduced-motion test.

---

## GLB-024 — Empty Surfaces Without Copy

**SCOPE:** Cross-Domain  
**SEVERITY:** P2  
**CLASSIFICATION:** CONTENT  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** 9 empty surfaces without copy; Home "Hoy" 200px giant; Guardian `/teams` empty Surface.  
**CURRENT EVIDENCE:** `STATIC` — B34 MAJOR; RUNTIME R-01.1.

**TARGET:** Every empty has honest copy + next step; Empty≠zero≠error.  
**TARGET SOURCE:** `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §2` (Empty) + domain freezes

**REAL GAP:** Empty copy missing.  
**USER IMPACT:** Blank screens confuse.  
**FILES:** features  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** None  
**ACCEPTANCE CRITERIA:** Every empty surface has copy+action.  
**EVIDENCE REQUIRED:** grep surfaces + runtime.

---

## GLB-025 — Notification Types Not Rendered

**SCOPE:** Cross-Domain (Communication, Notifications)  
**SEVERITY:** P1  
**CLASSIFICATION:** CONTENT/STATE  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** `type` of notification never rendered; 8 §22 types not distinguishable; `occurredAt` frozen.  
**CURRENT EVIDENCE:** `STATIC` — B19; negative-evidence.

**TARGET:** 8 types rendered with icon+template; real `occurredAt`; group by type.  
**TARGET SOURCE:** `docs/target-ux/DOMAIN_05...V1.0.md §5.4`

**REAL GAP:** Types invisible.  
**USER IMPACT:** Cannot tell aviso kind.  
**FILES:** `communication.tsx`, `mock/notifications.ts`  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** backend notifications  
**ACCEPTANCE CRITERIA:** 8 types distinguishable with real dates.  
**EVIDENCE REQUIRED:** runtime + test.

---

## GLB-026 — Fake Success / Optimistic Confirmation

**SCOPE:** Cross-Domain (Communication, Auth/Profile)  
**SEVERITY:** P1  
**CLASSIFICATION:** TRUST/FEEDBACK  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** `CheckCheck` unconditional on own messages (fake success); "Generar código activación" writes audit without mutating; Availability toast optimistic (§47).  
**CURRENT EVIDENCE:** `STATIC` — B18; RUNTIME R26.

**TARGET:** CheckCheck only after server ack; failed state + retry; no unconfirmed success.  
**TARGET SOURCE:** `docs/target-ux/DOMAIN_04...V1.0.md §4.8` + `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §7.1`

**REAL GAP:** Fake success.  
**USER IMPACT:** User believes action succeeded when unconfirmed.  
**FEEDBACK IMPACT:** YES | **STATE IMPACT:** YES  
**FILES:** `communication.tsx`, `account-insight.tsx`, `participation.tsx`  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** backend  
**ACCEPTANCE CRITERIA:** CheckCheck gated on ack; failed + retry; no unconfirmed success copy.  
**EVIDENCE REQUIRED:** runtime + code audit of success paths.

---

## GLB-027 — Audit Fidelity (before/after, source, link)

**SCOPE:** Cross-Domain  
**SEVERITY:** P1  
**CLASSIFICATION:** TRUST  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** Audit no before/after, no source, no object link, filter date with 3 literals, frozen dates.  
**CURRENT EVIDENCE:** `STATIC` — B35; R38.

**TARGET:** Audit entry: date — actor — action — resource(link) — before/after — reason — source; real date filter.  
**TARGET SOURCE:** `docs/target-ux/DOMAIN_05...V1.0.md §5.11`

**REAL GAP:** Audit incomplete.  
**USER IMPACT:** Cannot trace changes.  
**FILES:** `account-insight.tsx`, `mock/store.tsx`  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** GLB-020, backend before/after  
**ACCEPTANCE CRITERIA:** Audit shows all fields + real date filter.  
**EVIDENCE REQUIRED:** runtime + test.

---

## GLB-AUTH-01 — `/activate` Code Literal + No Setup Chain

**SCOPE:** Auth  
**SEVERITY:** P1  
**CLASSIFICATION:** AUTH  
**GAP TYPE:** MODIFY + BACKEND REQUIRED  
**COMPLIANCE STATUS:** NON-CONFLICTING (reconciled) — implementation gap

**CURRENT:** `/activate` expects literal `GEI-2026-4812` shared with `/management/people/:id` which doesn't generate it. No setup-token issuance UI coherent with `/activate`. Activation has success state but no auto-login behavior documented in code.  
**CURRENT EVIDENCE:** `STATIC` — R02; UX-35; `account-insight.tsx:433`.

**TARGET:** Activation via admin-delivered setup code; success → redirect `/login` (NO auto-login); admin issues code via `issueSetupToken` (one active per account §51).  
**TARGET SOURCE:** `docs/target-ux/GEI_AUTH_RECONCILIATION_V1.0.md` + `GEI_TARGET_UX_FREEZE_V1.0.md` Global/Auth

**REAL GAP:** Literal code; no issuance chain; auto-login ambiguous.  
**WHY IT MATTERS:** Auth model frozen; activation must be coherent end-to-end.  
**USER IMPACT:** Activation cannot work without matching issuance.  
**PRODUCT LOGIC CHANGE:** Yes (activation flow) | **DATA CONTRACT CHANGE:** setup token | **AUTHORITY IMPACT:** admin-only issuance | **PII IMPACT:** No  
**FILES:** `account-insight.tsx` (Auth), `management.tsx` (PersonAdmin), `mock/store.tsx`  
**SHARED SYSTEM IMPACT:** Yes  
**DEPENDENCIES:** GLB-011  
**ACCEPTANCE CRITERIA:** Setup code generated, one active, activation returns to login.  
**EVIDENCE REQUIRED:** runtime + test.

---

## GLB-AUTH-02 — No Self-Service Forgot Password (Enforcement)

**SCOPE:** Auth  
**SEVERITY:** P2  
**CLASSIFICATION:** AUTH  
**GAP TYPE:** VERIFY (REMOVE any trace)  
**COMPLIANCE STATUS:** COMPLIANT (F01 already excludes it) — verify no residue

**CURRENT:** Login `<details>` demo shows credentials; no forgot-password link (correct per frozen model).  
**CURRENT EVIDENCE:** `STATIC` — R01; F01 §3 excludes self-service.

**TARGET:** NO forgot-password anywhere; recovery is administrative. Demo credentials only in DEV.  
**TARGET SOURCE:** `docs/target-ux/GEI_AUTH_RECONCILIATION_V1.0.md`

**REAL GAP:** Demo `<details>` leaks to production (UX-44). Ensure no self-service residue.  
**USER IMPACT:** Demo creds visible in prod.  
**FILES:** `account-insight.tsx` (Login)  
**SHARED SYSTEM IMPACT:** No  
**DEPENDENCIES:** None  
**ACCEPTANCE CRITERIA:** Demo details behind `import.meta.env.DEV`; no forgot-password.  
**EVIDENCE REQUIRED:** build inspection + grep.

---

## GLB-AUTH-03 — Profile Security Section Missing

**SCOPE:** Auth / Profile  
**SEVERITY:** P1  
**CLASSIFICATION:** AUTH/CONTENT  
**GAP TYPE:** CREATE  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** Profile shows 4 data + 2 buttons; no account status, roles, membership, sessions, security.  
**CURRENT EVIDENCE:** `RUNTIME` R-07; B02/B03/B44.

**TARGET:** Profile 8 sections (Identity, Membership, Roles&Scope, Personas a cargo, Third-party access, Contact, Security, Incomplete banner) per Domain 05 §5.2.  
**TARGET SOURCE:** `docs/target-ux/DOMAIN_05...V1.0.md §5.2`

**REAL GAP:** 6 of 8 sections missing.  
**WHY IT MATTERS:** Profile promises identity+access; delivers contact only.  
**USER IMPACT:** Cannot see account status/roles/sessions.  
**FILES:** `account-insight.tsx` (Profile)  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** GLB-011 (roles derivation)  
**ACCEPTANCE CRITERIA:** 8 sections render with real data per role.  
**EVIDENCE REQUIRED:** runtime per role.

---

## GLB-AUTH-04 — DNI/birthDate Self-Recovery Decision Pending

**SCOPE:** Auth / People  
**SEVERITY:** P1  
**CLASSIFICATION:** AUTH → PRODUCT DECISION (escalated, not a design question)

**CURRENT:** Identity read-only for everyone incl ADMIN; no recovery of `PLAYER_PROFILE_INCOMPLETE`.  
**CURRENT EVIDENCE:** `STATIC` — PG-06; `management.tsx:708-720`.

**TARGET:** Recovery path for missing DNI/birthDate. **Product Truth §6 says DNI = ADMIN**, so if a player may self-load own DNI this **requires a Product Truth clarification** (§82).  
**TARGET SOURCE:** `docs/target-ux/DOMAIN_05...V1.0.md §5.8.3`

**REAL GAP:** Missing recovery; blocked on §6 clarification.  
**CLASSIFICATION NOTE:** This is a **BACKEND/Product Truth decision**, not a Target UX design question. Target UX says recovery must exist; authority says who.  
**USER IMPACT:** Player without DNI cannot join roster; nobody can fix.  
**FILES:** `management.tsx`, `overview.tsx` (Profile), `authority.ts`  
**DEPENDENCIES:** GLB-011  
**ACCEPTANCE CRITERIA:** Recovery path exists with authority per §6 clarification.  
**EVIDENCE REQUIRED:** product decision record + runtime.

---

## GLB-AUTH-05 — Route Guards Incomplete

**SCOPE:** Auth / Cross-Domain  
**SEVERITY:** P1  
**CLASSIFICATION:** AUTHORITY/NAVIGATION  
**GAP TYPE:** MODIFY  
**COMPLIANCE STATUS:** NON-COMPLIANT

**CURRENT:** In-page gating: breadcrumb shows "Gestión"/"Historial" before denial; denied screen has no h1; COACH reaches `/management/competitions` under a parent that denies.  
**CURRENT EVIDENCE:** `STATIC` — R-45, R-46; B01.

**TARGET:** Route guard before render; denied screen with h1; no misleading breadcrumb; correct hub per role.  
**TARGET SOURCE:** `docs/target-ux/GEI_TARGET_UX_FREEZE_V1.0.md` Route Guards

**REAL GAP:** Guards in-page + misleading chrome.  
**USER IMPACT:** Confusing denial; URL under non-owned parent.  
**AUTHORITY IMPACT:** YES | **NAVIGATION IMPACT:** YES  
**FILES:** `app/App.tsx`, `app/Shell.tsx`, features  
**SHARED SYSTEM IMPACT:** YES  
**DEPENDENCIES:** GLB-011  
**ACCEPTANCE CRITERIA:** Guards before render; denied routes with h1; correct hub entries per role.  
**EVIDENCE REQUIRED:** runtime per role.

---

## SUMMARY TABLE — Global/Auth/CrossDomain

| Gap ID | Severity | Type | Classification | Backend |
|--------|----------|------|----------------|---------|
| GLB-001 | P0 | CREATE | RESPONSIVE | No |
| GLB-002 | P1 | CREATE | NAVIGATION | No |
| GLB-003 | P1 | MODIFY | SHARED | No |
| GLB-004 | P1 | MODIFY | RESPONSIVE | No |
| GLB-005 | P1 | MODIFY | VISUAL | No |
| GLB-006 | P2 | MODIFY | CONTENT | No |
| GLB-008 | P1 | CREATE | OVERLAY | No |
| GLB-009 | P1 | CREATE | OVERLAY | No |
| GLB-010 | P0 | CREATE | NAVIGATION | No |
| GLB-011 | P0 | MODIFY | AUTHORITY | Yes |
| GLB-012 | P0 | CREATE | AUTHORITY | Yes |
| GLB-013 | P1 | CREATE | SHARED | No |
| GLB-014 | P1 | MODIFY | FEEDBACK | No |
| GLB-015 | P1 | MODIFY | FORMS | No |
| GLB-016 | P1 | MODIFY | ACCESSIBILITY | No |
| GLB-017 | P1 | MODIFY | ACCESSIBILITY | No |
| GLB-019 | P1 | CREATE | SHARED | No |
| GLB-020 | P0 | MODIFY | TRUST | Partial |
| GLB-021 | P1 | CREATE | FORMS | No |
| GLB-022 | P1 | MODIFY | ACCESSIBILITY | No |
| GLB-023 | P2 | CREATE | MOTION | No |
| GLB-024 | P2 | MODIFY | CONTENT | No |
| GLB-025 | P1 | MODIFY | CONTENT/STATE | Yes |
| GLB-026 | P1 | MODIFY | TRUST/FEEDBACK | Yes |
| GLB-027 | P1 | MODIFY | TRUST | Yes |
| GLB-AUTH-01 | P1 | MODIFY | AUTH | Yes |
| GLB-AUTH-02 | P2 | VERIFY | AUTH | No |
| GLB-AUTH-03 | P1 | CREATE | AUTH/CONTENT | No |
| GLB-AUTH-04 | P1 | MODIFY | AUTH (escalated) | Yes |
| GLB-AUTH-05 | P1 | MODIFY | AUTHORITY/NAV | No |

**Subtotal: 30 gaps (P0: 5, P1: 19, P2: 6)**