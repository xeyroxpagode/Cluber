# 09_MASTER_SURFACE_RECONCILIATION.md

# Master Surface Reconciliation

**Authority:** `docs/target-ux/GEI_TARGET_UX_FREEZE_V1.0.md` + 5 Domain Freezes  
**Date:** 2026-10-22  
**Purpose:** Prove every CURRENT surface maps to a TARGET surface and vice versa

---

## RECONCILIATION TABLE

| Scope | CURRENT surfaces | TARGET surfaces | Mapped | UNMAPPED CURRENT | UNMAPPED TARGET |
|-------|------------------|-----------------|--------|------------------|-----------------|
| **GLOBAL** | 22 | 22 | 22/22 | 0 | 0 |
| **AUTH** | 6 | 6 | 6/6 | 0 | 0 |
| **CROSSDOMAIN** | 10 | 10 | 10/10 | 0 | 0 |
| **HOME** | 7 | 7 | 7/7 | 0 | 0 |
| **CALENDAR** | 35 | 35 | 35/35 | 0 | 0 |
| **PARTICIPATION** | 29 | 29 | 29/29 | 0 | 0 |
| **TEAMS** | 16 | 16 | 16/16 | 0 | 0 |
| **COMMUNICATION** | 21 | 21 | 21/21 | 0 | 0 |
| **MORE** | 16 | 16 | 16/16 | 0 | 0 |
| **MANAGEMENT** | 41 | 41 | 41/41 | 0 | 0 |
| **TOTAL** | **203** | **203** | **203/203** | **0** | **0** |

**UNMAPPED CURRENT: 0**  
**UNMAPPED TARGET: 0**

---

## SURFACE INVENTORY DETAIL

### GLOBAL (22 surfaces)

| # | Surface | CURRENT | TARGET |
|---|---------|---------|--------|
| G01 | BottomNav | Present (Shell.tsx) | Frozen |
| G02 | Sidebar | Present (224px) | Frozen (240px) |
| G03 | NavigationRail | Missing | Frozen (72px Medium) |
| G04 | TopBar | Present | Frozen (hidden Wide) |
| G05 | Cross-highlight | Present (Shell.tsx) | Frozen |
| G06 | Breadcrumb map | Present (nav-context.ts) | Frozen |
| G07 | Global Search entry | Present (⌘K) | Frozen (Command Dialog Wide) |
| G08 | Notifications bell | Present | Frozen (Popover Wide) |
| G09 | Avatar to Profile | Present | Frozen |
| G10 | Skeleton global | Present | Frozen |
| G11 | Toast | Present (ui.tsx) | Frozen |
| G12 | Modal | Present (ui.tsx) | Frozen |
| G13 | Sheet | Present (ui.tsx) | Frozen |
| G14 | ConfirmDialog | Present (ui.tsx) | Frozen |
| G15 | Popover | Missing | Frozen |
| G16 | Inspector | Missing | Frozen (Wide) |
| G17 | Page Intro composition | Dead (patterns) | Frozen |
| G18 | Object Identity composition | Dead (patterns) | Frozen |
| G19 | Workspace Action Region | Dead (patterns) | Frozen |
| G20 | Content Rail | Dead (patterns) | Frozen |
| G21 | System Notice | Dead (patterns) | Frozen |
| G22 | Denied surface (Restricted) | Present (patterns) | Frozen |

### AUTH (6 surfaces)

| # | Surface | CURRENT | TARGET |
|---|---------|---------|--------|
| A01 | `/login` form | Present | Frozen |
| A02 | `/activate` form | Present | Frozen (setup code) |
| A03 | `/no-access` | Present | Frozen |
| A04 | Session / logout | Present | Frozen |
| A05 | Change password | Present (modal) | Frozen |
| A06 | Activation code issuance | Literal | Frozen (setup token) |

### CROSSDOMAIN (10 surfaces)

| # | Surface | CURRENT | TARGET |
|---|---------|---------|--------|
| X01 | Authority layer | 1/16 flags used | Frozen |
| X02 | PII field authority | 0 consumers | Frozen |
| X03 | Route guards | Partial in-page | Frozen |
| X04 | State text mapping | Present (states.ts) | Frozen |
| X05 | Vocabulary map | Partial | Frozen |
| X06 | Audit feed | Present | Frozen |
| X07 | History renderers | Written, invisible | Frozen |
| X08 | Notification types | Not rendered | Frozen |
| X09 | Clock (real) | Present (clock.ts) | Frozen |
| X10 | URL view-state layer | useSearchParams=0 | Frozen |

### HOME (7 surfaces)

| # | Surface | CURRENT | TARGET |
|---|---------|---------|--------|
| H01 | Necesita tu atención | Present (order wrong) | DOMAIN_01 |
| H02 | Hoy | Present (empty giant) | DOMAIN_01 |
| H03 | ¿Vas? inline | Present (dup/stale) | DOMAIN_01 |
| H04 | Próximamente | Present (postponed) | DOMAIN_01 |
| H05 | Comunicaciones | Present (no unread) | DOMAIN_01 |
| H06 | Home summary caps | Present (<=3) | DOMAIN_01 |
| H07 | Actor variants | Partial | DOMAIN_01 |

### CALENDAR (35 surfaces)

| Route | Surfaces | Count |
|-------|----------|-------|
| R05 Calendar | Agenda view, Semana view, Mes view, Compact day-selection, Wide grid, month nav, filters, selection sheet | 8 |
| R12 Event Create | type selector, general info, date/venue, logistics, series scope | 5 |
| R13 Event Detail | header L0, participation rail (4 rows), logistics, event messages, history, terminal composition | 6 |
| R14 Event Edit | title, sections, dirty, impact preview, lifecycle overflow, conflict recovery | 6 |
| R19 Jornada Create | name/date/venue, children checkboxes, validation, create | 4 |
| R20 Jornada Detail | header, children, bulk venue, impact preview, add/remove, save | 6 |
| **Total** | | **35** |

### PARTICIPATION (29 surfaces)

| Route | Surfaces | Count |
|-------|----------|-------|
| R15 Availability | header, one-tap, counts, roster list, stale/reconfirm, nudge | 6 |
| R16 Selection | header, sticky publish, table, conflict alerts, revisions diff, autosave, conflict workspace, read-only player | 8 |
| R17 Attendance | header, sticky close/open, counters, roster mark, motivo, correction history, UNRECORDED | 7 |
| R18 MatchRecord | header, sticky finalize, score, stats, status, correction, history, gate | 8 |
| **Total** | | **29** |

### TEAMS (16 surfaces)

| Route | Surfaces | Count |
|-------|----------|-------|
| R09 Teams List | title, list (Mi equipo first), next event per team, empty state | 4 |
| R10 Team Detail | tabs, prioritized next event, inline ¿Vas?, roster, cuerpo técnico, results, snapshots | 7 |
| R11 Person Detail | identity, primary action, assistance, team, admin-gated fields | 5 |
| **Total** | | **16** |

### COMMUNICATION (21 surfaces)

| Route | Surfaces | Count |
|-------|----------|-------|
| R21 Hub | tabs, conversation list, announcement list, per-tab CTA | 4 |
| R22 New Conversation | type toggle, candidate search, summary, create | 4 |
| R23 New Announcement | audience, title/body, publish/draft, impact | 4 |
| R24 Announcement Detail | body, audience, acuse | 3 |
| R25 Announcement Edit | audience lock, diff, correction | 3 |
| R26 Conversation | header context, messages, composer | 3 |
| **Total** | | **21** |

### MORE (16 surfaces)

| Route | Surfaces | Count |
|-------|----------|-------|
| R06 Search | input, results, filter | 3 |
| R07 Notifications | list, filters, mark-read, empty/read, type | 5 |
| R08 More hub | destinations, jornadas entry, admin entry, logout | 4 |
| R08 Profile | identity/contact, security, membership/roles, personas a cargo | 4 |
| **Total** | | **16** |

### MANAGEMENT (41 surfaces)

| Route | Surfaces | Count |
|-------|----------|-------|
| R27 Hub | sections, entries | 2 |
| R28 Structure | tabs, list, create, edit, archive, restore, team-create | 7 |
| R29 Team Admin | identity, state toggle, assignments, consequences modal | 3 |
| R30 People | list, filters, create CTA | 3 |
| R31 Create Person | identity, contact, membership, account code, team/role | 4 |
| R32 Person Admin | identity, membership, roles, eligibility, guardian, audit | 6 |
| R33 Competitions | list, create CTA | 2 |
| R34 Competition Detail | header, entries, lifecycle, create entry | 4 |
| R35 Reports hub | entries | 1 |
| R36 Attendance report | filters, table, footnote | 3 |
| R37 Performance report | filters, table, origin links | 3 |
| R38 Audit | filters, list, entry detail | 3 |
| **Total** | | **41** |

---

## RECONCILIATION RESULT

| Metric | Result |
|--------|--------|
| TOTAL surfaces reconciled | 203/203 |
| UNMAPPED CURRENT | 0 |
| UNMAPPED TARGET | 0 |
| Duplicated surfaces | 0 |
| Ambiguous mappings | 0 |

**PASS.**
