# 15_NAVIGATION_AND_ORIGIN_MATRIX.md

# Navigation and Origin Matrix

**Authority:** `docs/target-ux/GEI_TARGET_UX_FREEZE_V1.0.md` (Origin-Aware Back, Route Guards)  
**Date:** 2026-10-22

---

## 1. ORIGIN-AWARE BACK CONTRACT

| Requirement | Target | Current | Gap |
|-------------|--------|---------|-----|
| Filters in URL | Yes | No | GLB-010 |
| Tab in URL | Yes | No | GLB-010 |
| Scroll restored | Yes | No | GLB-010 |
| Query in URL | Yes | No | GLB-010/MORE-010 |
| Calendar month/view in URL | Yes | No | GLB-010 |
| Deep link autosuficiente | Yes | Partial | GLB-010 |
| Breadcrumb vocabulary map | Yes | Partial (Mi espacio killed) | GLB-006 |

**`useSearchParams` = 0 in entire `src/`.**

---

## 2. ORIGIN MATRIX (Per Flow)

| From → To | Origin to Preserve | Current | Gap |
|-----------|--------------------|---------|-----|
| Home → EventDetail → Back | Home scroll + tabs | Lost | HOME-012→GLB-010 |
| Calendar → Event → Back | Month/view + filters | Lost | CAL-004/GLB-010 |
| TeamDetail → PersonDetail → Back | Tab + scroll | Lost | TEAM-012→GLB-010 |
| TeamDetail → Event → Back | Tab + scroll | Lost | GLB-010 |
| Communication tab switch → Back | Tab preserved | Lost | GLB-010 |
| Selection → Home (conflict chain) | Conflict surfaces on Home | Partial | PART-018 |
| Management list → detail → Back | Filters + scroll | Lost | MGMT-013/GLB-010 |
| Reports → origin → Back | Filters | Lost | MGMT-032 |
| Search → result → Back | Query | Lost | MORE-010 |

---

## 3. ROUTE GUARD MATRIX

| Route Group | Guard | Current | Gap |
|-------------|-------|---------|-----|
| Auth (login/activate/no-access) | Public | OK | GLB-AUTH-02 (demo creds) |
| Daily (home/calendar/teams/.../more) | hasApplicationAccess | Partial in-page | GLB-AUTH-05 |
| `/management/*` | allowedActions Management | In-page, misleading chrome | MGMT-001, MGMT-002 |
| `/management/competitions/*` | SUBCOMMITTEE/ADMIN | Under denying parent | MGMT-002 |
| `/reports/*` | report flag | OK | — |
| `/audit` | ADMIN | In-page, no h1 | MGMT-040 |
| `/announcements/:id` | audience | NOT enforced | COM-015 |

---

## 4. CROSS-HIGHLIGHT (Frozen — Current OK)

| Section | Active on routes | Status |
|---------|------------------|--------|
| Calendario | `/events/*`, `/jornadas/*` | OK |
| Comunicación | `/conversations/*`, `/announcements/*` | OK |
| Más | `/management/*`, `/reports/*`, `/audit`, `/more/*` | OK |

---

## 5. NAVIGATION GAP LIST

| Gap ID | Severity | Description |
|--------|----------|-------------|
| GLB-010 | P0 | Origin-aware Back entirely missing |
| GLB-002 | P1 | NavigationRail missing |
| GLB-004 | P1 | Wide TopBar must disappear |
| GLB-008 | P1 | Wide Search Command Dialog missing |
| GLB-009 | P1 | Wide Notification Popover missing |
| GLB-AUTH-05 | P1 | Route guards incomplete |
| MGMT-001 | P1 | Breadcrumb before denial |
| MGMT-002 | P1 | URL ownership |
| MGMT-039 | P2 | Wide direct destinations |
| HOME-012 (consol.) | — | → GLB-010 |
| TEAM-012 (consol.) | — | → GLB-010 |
| CAL-008 | P3 | contextual create |
| EVENT-011 | P2 | breadcrumb specificity |
| JOR-001 | P2 | jornada reachability |
| MORE-005 | P2 | ADMIN competitions entry |
| MORE-006 | P2 | SUBCOMMITTEE entry |
| MORE-010 | P1 | search query URL |
| CAL-001 | P1 | Calendar ¿Vas? reachability |

**Total navigation-classified: ~16 (+ GLB-010 root cause).**

---

## 6. NAVIGATION AUTHORITY SEMANTICS

- **10 routes total.** No drawer, no command palette as navigation.
- **Back = restore origin.** URL is source of truth.
- **Denied = before render**, with h1, without misleading breadcrumb.
- **Cross-highlight** confirmed correct; preserve.
- **Tabs only navigate**, never execute.
- **Max depth:** tab → list → detail → sub-detail (3 levels + sheets).

**Current status:** IA correct; URL-state layer 0% implemented; gating in-page.