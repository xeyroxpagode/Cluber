# 08_MORE_MANAGEMENT_GAPS.md

# More + Management Gaps (Domain 05)

**Authority:** `docs/target-ux/DOMAIN_05_MORE_MANAGEMENT_FREEZE_V1.0.md`  
**Scope:** R06, R07, R08, R27–R38 (16 More + 41 Management = 57 surfaces)  
**Date:** 2026-10-22

---

## MORE-* — Profile, Search, Notifications, Hub

### MORE-001 — Profile Missing 3 of 5 Sections
**SEVERITY:** P1 | **TYPE:** CREATE | **BACKEND:** Yes  
**CURRENT:** Profile = 4 data + 2 buttons; no Identity detail, Membership, Roles&Scope, Security, Incomplete banner.  
**CURRENT EVIDENCE:** `RUNTIME` R-07; GLB-AUTH-03.  
**TARGET:** 5 sections per Domain 05 §5.2 (Identidad, Pertenencia, Roles y Alcance, Contacto, Seguridad + Incomplete banner if applies).  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.2` (corrected — Guardian/Eligibility/Third-party OUT).  
**FILES:** `account-insight.tsx`. **DEPS:** GLB-011. **ACC:** 5 sections render. **EVIDENCE:** runtime ×roles.

### MORE-002 — Profile Promises Access, Shows None
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Description says "tu acceso a GEI" but shows no access info.  
**CURRENT EVIDENCE:** `RUNTIME` R-07.27.  
**TARGET:** Show account status, roles, scope.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.2`.  
**FILES:** `account-insight.tsx`. **ACC:** access visible. **EVIDENCE:** runtime.

### MORE-003 — Profile "Contexto: Pertenencia vigente · 2026" Literal
**SEVERITY:** P2 | **TYPE:** REMOVE/MODIFY | **BACKEND:** No  
**CURRENT:** Literal "2026"; `memberships[]` populated but unread.  
**CURRENT EVIDENCE:** `RUNTIME` R-07.28.  
**TARGET:** Real membership period from `memberships[]`.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.2` (Pertenencia).  
**FILES:** `account-insight.tsx`. **ACC:** real data. **EVIDENCE:** runtime.

### MORE-004 — Profile Single Card 22% Viewport
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** One card ~340px in 1500px page; 78% empty.  
**CURRENT EVIDENCE:** `RUNTIME` R-07.25.  
**TARGET:** Sectioned layout per §5.2.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.2`.  
**FILES:** `account-insight.tsx`. **ACC:** layout density reasonable. **EVIDENCE:** runtime.

### MORE-005 — More Hub ADMIN Missing Competiciones
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** ADMIN More lacks "Competiciones" (§5 grants it).  
**CURRENT EVIDENCE:** `RUNTIME` R-46.53.  
**TARGET:** ADMIN More includes Competitions entry.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.1`.  
**FILES:** `account-insight.tsx`. **ACC:** correct destinations. **EVIDENCE:** runtime ADMIN.

### MORE-007 — Breadcrumb "Informes" vs Hub "Reportes"
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Two names for `/reports/*`.  
**CURRENT EVIDENCE:** `RUNTIME` R-46.55.  
**TARGET:** Single vocabulary term.  
**TARGET SOURCE:** `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §3.2`.  
**FILES:** `shared/nav-context.ts`, `account-insight.tsx`. **ACC:** consistent. **EVIDENCE:** runtime.

### MORE-008 — `/audit` Breadcrumb "Historial" vs "Auditoría"
**SEVERITY:** P3 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Breadcrumb "Historial"; hub/title "Auditoría".  
**CURRENT EVIDENCE:** `RUNTIME` B01.  
**TARGET:** Single term.  
**TARGET SOURCE:** `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §3.2`.  
**FILES:** `shared/nav-context.ts`. **ACC:** consistent. **EVIDENCE:** runtime.

### MORE-009 — Search Header Duplicates H1
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Header "Buscar en GEI" + h1 "Buscar en GEI".  
**CURRENT EVIDENCE:** `RUNTIME` R06.  
**TARGET:** Single label.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.3`.  
**FILES:** `overview.tsx`. **ACC:** no duplicate. **EVIDENCE:** runtime.

### MORE-010 — Search Query Not in URL
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Query not in URL (F26).  
**CURRENT EVIDENCE:** `STATIC` — GLB-010.  
**TARGET:** Query + type in URL.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.3` (Query in URL).  
**FILES:** `overview.tsx`. **DEPS:** GLB-010. **ACC:** URL carries query. **EVIDENCE:** runtime.

### MORE-011 — Search Doesn't Cover Events
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** Yes  
**CURRENT:** Search doesn't cover events (§12 mapping wanted it).  
**CURRENT EVIDENCE:** `STATIC` — B40.  
**TARGET:** Search covers events.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.3` (Scope).  
**FILES:** `overview.tsx`, `mock/store.tsx`. **ACC:** events searchable. **EVIDENCE:** runtime.

### MORE-012 — Notifications Type/Unread/Filters
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** Yes  
**CURRENT:** Type not rendered; filters limited; unread visual inconsistent.  
**CURRENT EVIDENCE:** `RUNTIME` R07; GLB-025.  
**TARGET:** Type names row; unread ordered; filters.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.4`.  
**FILES:** `communication.tsx`. **DEPS:** GLB-025. **ACC:** type + unread + filter. **EVIDENCE:** runtime.

### MORE-013 — Notification `occurredAt` Frozen
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** Yes  
**CURRENT:** Frozen "Hace 1 hora" style.  
**CURRENT EVIDENCE:** `STATIC` — B35.  
**TARGET:** Real ISO timestamps.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.4`.  
**FILES:** `communication.tsx`, `mock/notifications.ts`. **ACC:** real dates. **EVIDENCE:** runtime.

### MORE-014 — Notification Unique Logical Key Missing
**SEVERITY:** P2 | **TYPE:** MODIFY + BACKEND | **BACKEND:** Yes  
**CURRENT:** `origin_event_id + recipient + type` uniqueness not enforced.  
**CURRENT EVIDENCE:** `STATIC`.  
**TARGET:** Unique key prevents duplicates.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.4` (Key Rules).  
**FILES:** `mock/notifications.ts`. **ACC:** no duplicates. **EVIDENCE:** test.

### MORE-015 — `notify()` Includes Actor
**SEVERITY:** P3 | **TYPE:** MODIFY | **BACKEND:** Yes  
**CURRENT:** `notify()` includes actor among recipients.  
**CURRENT EVIDENCE:** `STATIC` — B35.  
**TARGET:** Actor excluded.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.4`.  
**FILES:** `mock/store.tsx`. **ACC:** actor excluded. **EVIDENCE:** test.

### MORE-016 — Notification Popover Missing (Wide)
**SEVERITY:** P1 | **TYPE:** CREATE | **BACKEND:** No  
**CURRENT:** No popover.  
**CURRENT EVIDENCE:** GLB-009.  
**TARGET:** Wide popover from bell.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.4` + GLB-009.  
**FILES:** `Shell.tsx`. **DEPS:** GLB-009. **ACC:** popover works. **EVIDENCE:** runtime.

---

## MGMT-* — Management Gaps

### MGMT-001 — Hub Breadcrumb Says "Gestión" Before Denial
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** COACH denied but breadcrumb already says "Gestión"; denied screen no h1.  
**CURRENT EVIDENCE:** `RUNTIME` R-45.  
**TARGET:** Guard before render; denied screen with h1.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.5` (Gating).  
**FILES:** `management.tsx`, `app/App.tsx`. **DEPS:** GLB-AUTH-05. **ACC:** no misleading chrome. **EVIDENCE:** runtime.

### MGMT-002 — `/management/competitions` Under Denying Parent (URL Ownership)
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** SUBCOMMITTEE works in `/management/competitions` but parent denies.  
**CURRENT EVIDENCE:** `RUNTIME` R-46.  
**TARGET:** Correct route ownership/hub.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.5`.  
**FILES:** `management.tsx`, `app/App.tsx`. **ACC:** parent coherent. **EVIDENCE:** runtime.

### MGMT-003 — Hub "Equipos" Roster Row in Admin Hub
**SEVERITY:** P2 | **TYPE:** REMOVE/MODIFY | **BACKEND:** No  
**CURRENT:** "Equipos" (sport surface labeled "roster") in admin hub; "Auditoría" duplicated with `/more`.  
**CURRENT EVIDENCE:** `RUNTIME` R27.  
**TARGET:** Remove sport surface from admin hub; no duplicate.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.5`.  
**FILES:** `management.tsx`. **ACC:** coherent hub. **EVIDENCE:** runtime.

### MGMT-004 — Structure Tabs Without role/tab; h3 Without h2
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Tabs no role; rows in h3 without h2.  
**CURRENT EVIDENCE:** `STATIC` — B31.  
**TARGET:** Tabs + heading hierarchy.  
**TARGET SOURCE:** `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §Accessibility`.  
**FILES:** `management.tsx`. **ACC:** semantic + headings. **EVIDENCE:** axe.

### MGMT-005 — Season Badge "Activo" Invented State
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Season shows "Activo" but model only `archivedAt`.  
**CURRENT EVIDENCE:** `RUNTIME` R-41.43.  
**TARGET:** No invented state.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.6` (Season).  
**FILES:** `management.tsx`. **ACC:** no invented state. **EVIDENCE:** runtime.

### MGMT-006 — Team Creation Impossible (Error Instructs Nonexistent Action)
**SEVERITY:** P1 | **TYPE:** CREATE + BACKEND | **BACKEND:** Yes  
**CURRENT:** Rename error says "creá un nuevo equipo" but no Team creation.  
**CURRENT EVIDENCE:** `RUNTIME` R28.  
**TARGET:** Team creation by (season, division, line) + unique validation.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.6` (Team Creation).  
**FILES:** `management.tsx`, `mock/store.tsx`. **ACC:** team creatable. **EVIDENCE:** test + runtime.

### MGMT-007 — No Restore of Archived
**SEVERITY:** P1 | **TYPE:** CREATE | **BACKEND:** Yes  
**CURRENT:** No restore; archive irreversible (D-06/D-08).  
**CURRENT EVIDENCE:** `STATIC` — B22.  
**TARGET:** Restore archived per tab.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.6` (Restore).  
**FILES:** `management.tsx`, `mock/store.tsx`. **ACC:** restore works. **EVIDENCE:** test.

### MGMT-008 — Venue Resolved by Name / No address/fieldLabel
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Venue resolved by name; no address/fieldLabel.  
**CURRENT EVIDENCE:** `STATIC` — M-13.  
**TARGET:** Venue has address/fieldLabel; resolved by id.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.6` (Venue).  
**FILES:** `management.tsx`, `events.tsx`, `mock/model.ts`. **DEPS:** EVENT-016. **ACC:** venue fields present. **EVIDENCE:** runtime.

### MGMT-009 — Team Admin Archive No Modal / Irreversible
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Archive `secondary` no modal; ARCHIVED no way back.  
**CURRENT EVIDENCE:** `RUNTIME` R29; B45.  
**TARGET:** ConfirmDialog + Activate back.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.7`.  
**FILES:** `management.tsx`. **ACC:** modal + reversible. **EVIDENCE:** runtime.

### MGMT-010 — Team Admin Identity as Text Not Data
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Identity rendered as text, not derived data.  
**CURRENT EVIDENCE:** `RUNTIME` R29.  
**TARGET:** Identity = Season+Division+Line data.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.7`.  
**FILES:** `management.tsx`. **ACC:** identity data. **EVIDENCE:** runtime.

### MGMT-011 — People List Guardian Shows "Jugadora / Club" (False)
**SEVERITY:** P0 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Guardian shows "MF Marcela Fernández / Club / Jugadora / Activo" though `roleAssignments: []`.  
**CURRENT EVIDENCE:** `RUNTIME` R-39.35.  
**TARGET:** Guardian not listed as Player; correct scope text.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.8.1`.  
**REAL GAP:** False truth in admin screen.  
**FILES:** `management.tsx`, `mock/seed.ts`, `mock/permissions.ts`. **DEPS:** GLB-011. **ACC:** correct identity. **EVIDENCE:** runtime + test.

### MGMT-012 — People List "Club" Column Ambiguous / PII in List
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** EQUIPO column "Club" meaning "no team"; PII leaks into list.  
**CURRENT EVIDENCE:** `RUNTIME` R-39.36.  
**TARGET:** PII out of list; "Club" clarified or "—".  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.8.1`.  
**FILES:** `management.tsx`. **ACC:** list minimal. **EVIDENCE:** runtime.

### MGMT-013 — People Filters No Reset/URL; Mobile Loses Columns
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Filters no reset/URL; table loses EQUIPO/ROL <768px no fallback.  
**CURRENT EVIDENCE:** `RUNTIME` R30; B30.  
**TARGET:** Reset + URL + mobile fallback.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.8.1`.  
**FILES:** `management.tsx`. **DEPS:** GLB-010. **ACC:** filters persisted + fallback. **EVIDENCE:** runtime.

### MGMT-014 — People List 0 aria-* / Rows Without Chevron
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** 0 aria-* in management.tsx; rows no chevron vs RowLink.  
**CURRENT EVIDENCE:** `STATIC` — B31.  
**TARGET:** aria-* + RowLink grammar.  
**TARGET SOURCE:** `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §Accessibility`.  
**FILES:** `management.tsx`. **ACC:** accessible. **EVIDENCE:** axe.

### MGMT-015 — Create Person No Membership Step / No Real Activation Code
**SEVERITY:** P1 | **TYPE:** CREATE + BACKEND | **BACKEND:** Yes  
**CURRENT:** No Membership step; activation code literal; "Generar código" writes audit without mutating.  
**CURRENT EVIDENCE:** `RUNTIME` R31; R-31.48ish; GLB-AUTH-01.  
**TARGET:** Membership step; real setup-token generation (one active).  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.8.2` + `GEI_AUTH_RECONCILIATION_V1.0.md`.  
**FILES:** `management.tsx`, `mock/store.tsx`. **ACC:** membership + real code. **EVIDENCE:** test + runtime.

### MGMT-016 — Create Person Defaults Grant Sports Role
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Writes `eligibility: "ELIGIBLE"` + `role: "PLAYER"` by default → everyone born with sports role.  
**CURRENT EVIDENCE:** `STATIC` — R31.  
**TARGET:** No authority-granting defaults.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.8.2` (Rules).  
**FILES:** `management.tsx`. **ACC:** no default role. **EVIDENCE:** test.

### MGMT-017 — Create Person Helper Text English "roster"
**SEVERITY:** P3 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Helper text uses English "roster".  
**CURRENT EVIDENCE:** `RUNTIME` R31.  
**TARGET:** Remove English jargon.  
**TARGET SOURCE:** `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §3.2`.  
**FILES:** `management.tsx`. **ACC:** no English jargon. **EVIDENCE:** runtime.

### MGMT-018 — Person Admin 0 Primary Actions (6 Equal Weight)
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** 6 actions all secondary/text; 0 primary; destructive same weight as benign.  
**CURRENT EVIDENCE:** `RUNTIME` R-40.37,38.  
**TARGET:** One primary per section; danger for destructive.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.8.3`.  
**FILES:** `management.tsx`. **ACC:** action hierarchy. **EVIDENCE:** runtime.

### MGMT-019 — Person Admin Selects Prefilled With Current Value
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** "Equipo destino = current", "Rol = first option" → accidental destructive.  
**CURRENT EVIDENCE:** `RUNTIME` R-40.40.  
**TARGET:** No prefill of authority ops; explicit choice required.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.8.3` (Rules).  
**FILES:** `management.tsx`. **ACC:** no default-auth prefill. **EVIDENCE:** runtime + test.

### MGMT-022 — Person Admin No History Despite Copy
**SEVERITY:** P1 | **TYPE:** CREATE | **BACKEND:** Yes  
**CURRENT:** Description says "Los cambios conservan la historia" but no history; identity read-only.  
**CURRENT EVIDENCE:** `RUNTIME` R-40.42; B35.  
**TARGET:** History with before/after + link.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.8.3`.  
**FILES:** `management.tsx`. **DEPS:** GLB-020. **ACC:** history visible. **EVIDENCE:** runtime.

### MGMT-023 — Person Admin "Confirmar cambio" Generic
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Same CTA for 10 operations.  
**CURRENT EVIDENCE:** `RUNTIME` R-40.  
**TARGET:** Verb echoes operation.  
**TARGET SOURCE:** `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §7.1`.  
**FILES:** `management.tsx`. **ACC:** specific verbs. **EVIDENCE:** runtime.

### MGMT-024 — SUBCOMMITTEE Denied Eligibility Section
**SEVERITY:** P1 | **TYPE:** MODIFY + BACKEND | **BACKEND:** Yes  
**CURRENT:** SUBCOMMITTEE gets Restricted on `/management/people/p4` though §5 grants Eligibility.  
**CURRENT EVIDENCE:** `RUNTIME` R-42.46.  
**TARGET:** SUBCOMMITTEE reaches Eligibility.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.8.3` + Product Truth §5.  
**FILES:** `management.tsx`, `authority.ts`. **DEPS:** GLB-011. **ACC:** SUBCOMMITTEE access. **EVIDENCE:** runtime.

### MGMT-025 — LAST_ADMIN Not Guarded for "Restablecer acceso"
**SEVERITY:** P1 | **TYPE:** MODIFY + BACKEND | **BACKEND:** Yes  
**CURRENT:** Reset access sets account PENDING without guard → club could lose active admin.  
**CURRENT EVIDENCE:** `STATIC` — B45.  
**TARGET:** LAST_ADMIN guard for reset/disable/end-admin.  
**TARGET SOURCE:** Product Truth §18 + `DOMAIN_05...V1.0.md §5.8.3`.  
**FILES:** `management.tsx`, `mock/store.tsx`. **ACC:** guard works. **EVIDENCE:** test.

### MGMT-026 — Competitions List No Search/Filter/Empty
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** No search/filter/empty; Surface empty without text.  
**CURRENT EVIDENCE:** `RUNTIME` R33.  
**TARGET:** Search + filter + empty.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.9.1`.  
**FILES:** `management.tsx`. **ACC:** complete list. **EVIDENCE:** runtime.

### MGMT-028 — Competition Lifecycle 3 Action Variants
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** 3 lifecycle actions in `primary`/`secondary`/`ghost`.  
**CURRENT EVIDENCE:** `RUNTIME` R34.  
**TARGET:** One primary per state.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.9.2` (Lifecycle).  
**FILES:** `management.tsx`. **ACC:** coherent variants. **EVIDENCE:** runtime.

### MGMT-030 — Reports 6/6 Tables No `<th>`
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** 6 of 6 tables no semantic `<th>`; `min-w-[560px]` scroll mobile.  
**CURRENT EVIDENCE:** `STATIC` — B39.  
**TARGET:** `<th>` + sortable + sticky header.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.10`.  
**FILES:** `account-insight.tsx`. **DEPS:** GLB-019. **ACC:** semantic tables. **EVIDENCE:** axe.

### MGMT-031 — Reports "% PRESENCIA" Shows 0% Where No Data
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** Yes  
**CURRENT:** 0% where no data; footer contradicts.  
**CURRENT EVIDENCE:** `RUNTIME` R-44.49.  
**TARGET:** "Sin datos" not 0%; footnote consistent.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.10`.  
**FILES:** `account-insight.tsx`, `mock/store.tsx`. **ACC:** no false 0%. **EVIDENCE:** runtime + test.

### MGMT-032 — Reports Filters Not Persisted/Reset; No Real Empty
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Filters not persisted/reset; no real empty.  
**CURRENT EVIDENCE:** `RUNTIME` R36/37.  
**TARGET:** Persist + reset + empty.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.10`.  
**FILES:** `account-insight.tsx`. **DEPS:** GLB-010. **ACC:** filters persisted. **EVIDENCE:** runtime.

### MGMT-033 — Performance Report No Link to Origin
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** No link to jornada/match.  
**CURRENT EVIDENCE:** `RUNTIME` R37.  
**TARGET:** Link to origin per A9.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.10`.  
**FILES:** `account-insight.tsx`. **ACC:** links present. **EVIDENCE:** runtime.

### MGMT-034 — Audit No before/after/source/link
**SEVERITY:** P1 | **TYPE:** MODIFY + BACKEND | **BACKEND:** Yes  
**CURRENT:** No before/after, no source, resource text plain.  
**CURRENT EVIDENCE:** `RUNTIME` R38; GLB-027.  
**TARGET:** Full audit entry.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.11`.  
**FILES:** `account-insight.tsx`, `mock/store.tsx`. **ACC:** full entry. **EVIDENCE:** runtime.

### MGMT-035 — Audit Date Filter 3 Literals / Frozen Dates
**SEVERITY:** P1 | **TYPE:** MODIFY | **BACKEND:** Yes  
**CURRENT:** Date input only accepts 3 literals; entries carry frozen "02 oct 2026 · Ahora".  
**CURRENT EVIDENCE:** `STATIC` — R38.  
**TARGET:** Real date filter + real dates.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.11`.  
**FILES:** `account-insight.tsx`, `mock/store.tsx`. **ACC:** real filter. **EVIDENCE:** runtime + test.

### MGMT-036 — Audit Reason Not Redacted per §6
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** Yes  
**CURRENT:** Reason shown without redaction rules.  
**CURRENT EVIDENCE:** `STATIC`.  
**TARGET:** Redact sensitive reason per §6.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.11` + Product Truth §6.  
**FILES:** `account-insight.tsx`. **DEPS:** GLB-011. **ACC:** redaction applied. **EVIDENCE:** runtime.

### MGMT-037 — Management Hub Metrics Risk (Prohibited)
**SEVERITY:** P3 | **TYPE:** VERIFY | **BACKEND:** No  
**CURRENT:** Risk of becoming KPI dashboard.  
**CURRENT EVIDENCE:** `STATIC`.  
**TARGET:** 3 sections, no KPIs.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.5`.  
**FILES:** `management.tsx`. **ACC:** no KPIs. **EVIDENCE:** runtime.

### MGMT-038 — Person.team/role Selectors Persist (S4-04)
**SEVERITY:** P1 | **TYPE:** MODIFY + BACKEND | **BACKEND:** Yes  
**CURRENT:** `Person.team`/`Person.role` used as selectors across features.  
**CURRENT EVIDENCE:** `STATIC` — S4-04.  
**TARGET:** Derive from assignments only.  
**TARGET SOURCE:** Product Truth §4 + `DOMAIN_05...V1.0.md §5.8`.  
**FILES:** `overview.tsx`, `participation.tsx`, `communication.tsx`, `account-insight.tsx`, `mock/store.tsx`. **DEPS:** GLB-012. **ACC:** 0 selectors read person.team/role. **EVIDENCE:** grep + test.

### MGMT-039 — Wide Management Not Direct Destination
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** Wide still routes via Más; frozen says Wide = direct destinations.  
**CURRENT EVIDENCE:** `STATIC`.  
**TARGET:** Wide Sidebar shows Reports/Management/Audit directly.  
**TARGET SOURCE:** `DOMAIN_05...V1.0.md §5.12`.  
**FILES:** `Shell.tsx`. **DEPS:** GLB-004. **ACC:** direct destinations. **EVIDENCE:** runtime 1440.

### MGMT-040 — Denied Screen No h1
**SEVERITY:** P2 | **TYPE:** MODIFY | **BACKEND:** No  
**CURRENT:** `Restricted` has no h1.  
**CURRENT EVIDENCE:** `STATIC` — B31.  
**TARGET:** Denied screen with h1.  
**TARGET SOURCE:** `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §Accessibility`.  
**FILES:** `management.tsx`, `shared/patterns.tsx`. **ACC:** h1 present. **EVIDENCE:** axe.

### MGMT-041 — Terms "Categoría"/Internal Jargon
**SEVERITY:** P3 | **TYPE:** VERIFY | **BACKEND:** No  
**CURRENT:** Verify no internal jargon ("Categoría", schema terms).  
**CURRENT EVIDENCE:** `STATIC`.  
**TARGET:** Vocabulary compliance.  
**TARGET SOURCE:** `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §3.2`.  
**FILES:** `management.tsx`. **ACC:** clean vocabulary. **EVIDENCE:** grep.

---

## SUMMARY — More + Management

| Gap ID | Sev | Type | Backend |
|--------|-----|------|---------|
| MORE-001 | P1 | CREATE | Yes |
| MORE-002 | P1 | MODIFY | No |
| MORE-003 | P2 | MODIFY | No |
| MORE-004 | P2 | MODIFY | No |
| MORE-005 | P2 | MODIFY | No |
| MORE-006 | P2 | MODIFY | No |
| MORE-007 | P2 | MODIFY | No |
| MORE-008 | P3 | MODIFY | No |
| MORE-009 | P2 | MODIFY | No |
| MORE-010 | P1 | MODIFY | No |
| MORE-011 | P2 | MODIFY | Yes |
| MORE-012 | P1 | MODIFY | Yes |
| MORE-013 | P2 | MODIFY | Yes |
| MORE-014 | P2 | MODIFY | Yes |
| MORE-015 | P3 | MODIFY | Yes |
| MORE-016 | P1 | CREATE | No |
| MGMT-001 | P1 | MODIFY | No |
| MGMT-002 | P1 | MODIFY | No |
| MGMT-003 | P2 | MODIFY | No |
| MGMT-004 | P1 | MODIFY | No |
| MGMT-005 | P2 | MODIFY | No |
| MGMT-006 | P1 | CREATE | Yes |
| MGMT-007 | P1 | CREATE | Yes |
| MGMT-008 | P2 | MODIFY | No |
| MGMT-009 | P1 | MODIFY | No |
| MGMT-010 | P2 | MODIFY | No |
| MGMT-011 | P1 | MODIFY | No |
| MGMT-012 | P2 | MODIFY | No |
| MGMT-013 | P1 | MODIFY | No |
| MGMT-014 | P1 | MODIFY | No |
| MGMT-015 | P1 | CREATE | Yes |
| MGMT-016 | P1 | MODIFY | No |
| MGMT-017 | P3 | MODIFY | No |
| MGMT-018 | P1 | MODIFY | No |
| MGMT-019 | P1 | MODIFY | No |
| MGMT-022 | P1 | CREATE | Yes |
| MGMT-023 | P2 | MODIFY | No |
| MGMT-025 | P1 | MODIFY | Yes |
| MGMT-026 | P2 | MODIFY | No |
| MGMT-028 | P2 | MODIFY | No |
| MGMT-030 | P1 | MODIFY | No |
| MGMT-031 | P1 | MODIFY | Yes |
| MGMT-032 | P2 | MODIFY | No |
| MGMT-033 | P2 | MODIFY | No |
| MGMT-034 | P1 | MODIFY | Yes |
| MGMT-035 | P1 | MODIFY | Yes |
| MGMT-036 | P2 | MODIFY | Yes |
| MGMT-037 | P3 | VERIFY | No |
| MGMT-038 | P1 | MODIFY | Yes |
| MGMT-039 | P2 | MODIFY | No |
| MGMT-040 | P2 | MODIFY | No |
| MGMT-041 | P3 | VERIFY | No |

**Subtotal: 49 gaps (P0: 0, P1: 25, P2: 20, P3: 4)**

> **Note:** MORE-006, MGMT-020, MGMT-021, MGMT-024, MGMT-027, MGMT-029 removed — Eligibility/Guardian/CompetitionEntry OUT per Product Truth V1.1. MGMT-011 reseveritied P0→P1. See `21_TARGET_DRIFT_RECONCILIATION.md`.

---

## DOMAIN SUBTOTAL RECONCILIATION

| Domain File | Gaps | P0 | P1 | P2 | P3 |
|-------------|------|----|----|----|----|
| Global/Auth/CrossDomain | 30 | 5 | 19 | 6 | 0 |
| Home | 12 | 0 | 6 | 6 | 0 |
| Calendar+Participation | 47 | 4 | 23 | 19 | 1 |
| Teams | 15 | 0 | 8 | 6 | 1 |
| Communication | 27 | 1 | 13 | 11 | 2 |
| More+Management | 49 | 0 | 25 | 20 | 4 |
| **TOTAL (pre-dedup)** | **180** | **10** | **94** | **68** | **8** |

> **Nota:** Pre-deduplication. The Master Gap Ledger (`10_MASTER_GAP_LEDGER.md`) deduplicates systemic root causes (e.g., GLB-010 origin-aware Back) so domain gaps reference `DEPENDS ON GLB-XXX` instead of duplicating. Final count after dedup is in the ledger. Counts updated post decontamination — see `21_TARGET_DRIFT_RECONCILIATION.md`.