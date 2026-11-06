# 02_AUTHORITY_AND_SOURCE_HIERARCHY.md

# Authority and Source Hierarchy for Gap Audit

**Purpose:** Establishes the citation chain for every gap's TARGET SOURCE reference  
**Date:** 2026-10-22  
**Rule:** `TARGET SOURCE` in every gap MUST cite a file in `docs/target-ux/` with section

---

## AUTHORITY HIERARCHY (Binding Order)

```
LEVEL 1 (Supreme)
└── GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_1.md
    ├── Scope, actors, invariants, auth model, capabilities, technical policy
    └── Conflicts resolved by: this document wins

LEVEL 2 (UX Architecture)
└── GEI_TARGET_UX_FREEZE_V1.0.md
    ├── Global nav, responsive regimes, resource ownership, origin-aware Back
    ├── Search, Notifications, Route guards, Authority/PII/State/Overlay/Feedback/Motion/Accessibility grammars
    └── Conflicts resolved by: Level 1 > Level 2

LEVEL 2 (Design System)
└── GEI_DESIGN_SYSTEM_FREEZE_V1.0.md
    ├── 7 blocks: Foundation, Primitives, Content, Navigation, Surfaces, Overlays, Feedback+Motion
    ├── Transverse compositions (6), Responsive values, Accessibility baseline
    └── Conflicts resolved by: Level 1 > Level 2

LEVEL 3 (Domain Freezes — 5 domains)
├── DOMAIN_01_HOME_FREEZE_V1.0.md
├── DOMAIN_02_CALENDAR_PARTICIPATION_FREEZE_V1.0.md
├── DOMAIN_03_TEAMS_FREEZE_V1.0.md
├── DOMAIN_04_COMMUNICATION_FREEZE_V1.0.md
└── DOMAIN_05_MORE_MANAGEMENT_FREEZE_V1.0.md
    └── Conflicts resolved by: Level 1 > Level 2 > Level 3

LEVEL 4 (Change Control)
└── GEI_TARGET_UX_CHANGE_CONTROL_V1.0.md
    └── Process for any modification

LEVEL 4 (Auth Reconciliation)
└── GEI_AUTH_RECONCILIATION_V1.0.md
    └── TARGET-CONFLICT-001/002 RESOLVED
```

---

## GAP CITATION RULE

Every gap in `10_MASTER_GAP_LEDGER.md` and domain gap files MUST have:

```
TARGET SOURCE FILE + SECTION
```

**Format:** `docs/target-ux/<FILENAME.md> §<SECTION>`

**Examples:**
- `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §4.1` (Navigation Contract)
- `docs/target-ux/DOMAIN_02_CALENDAR_PARTICIPATION_FREEZE_V1.0.md §2.2` (Event Detail)
- `docs/target-ux/GEI_TARGET_UX_FREEZE_V1.0.md` Global/Auth section

**Prohibited:** "Blueprint §XX", "Freeze §XX", "Product Truth §XX" — must cite the versioned target-ux file.

---

## SOURCE DOCUMENT MAP (For Gap Authors)

| Domain / Area | Target-UX File | Key Sections |
|---------------|----------------|--------------|
| **Global Navigation** | `GEI_TARGET_UX_FREEZE_V1.0.md` | Navigation Contract, Responsive Regimes, Origin-Aware Back |
| **Auth Model** | `GEI_TARGET_UX_FREEZE_V1.0.md` | Global/Auth/Cross-Domain Freeze |
| **Design System - Color** | `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md` | §1.1 Color Tokens |
| **Design System - Typography** | `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md` | §1.3 Typography Tokens |
| **Design System - Spacing** | `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md` | §1.4 Spacing Scale |
| **Design System - Primitives** | `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md` | §2 Core Primitives |
| **Design System - Surfaces** | `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md` | §5 Surface System |
| **Design System - Overlays** | `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md` | §6 Overlays |
| **Design System - Feedback** | `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md` | §7.1 Feedback Grammar |
| **Design System - Motion** | `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md` | §7.4 Motion Tokens |
| **Design System - Accessibility** | `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md` | §Accessibility |
| **Home** | `DOMAIN_01_HOME_FREEZE_V1.0.md` | All sections |
| **Calendar** | `DOMAIN_02_CALENDAR_PARTICIPATION_FREEZE_V1.0.md` | §2.1 Calendar |
| **Event Detail** | `DOMAIN_02_CALENDAR_PARTICIPATION_FREEZE_V1.0.md` | §2.2 Event Detail |
| **Event Create/Edit** | `DOMAIN_02_CALENDAR_PARTICIPATION_FREEZE_V1.0.md` | §2.3 Event Create/Edit |
| **Availability** | `DOMAIN_02_CALENDAR_PARTICIPATION_FREEZE_V1.0.md` | §2.4 Participation Lifecycle |
| **Selection** | `DOMAIN_02_CALENDAR_PARTICIPATION_FREEZE_V1.0.md` | §2.4 Participation Lifecycle |
| **Attendance** | `DOMAIN_02_CALENDAR_PARTICIPATION_FREEZE_V1.0.md` | §2.4 Participation Lifecycle |
| **MatchRecord** | `DOMAIN_02_CALENDAR_PARTICIPATION_FREEZE_V1.0.md` | §2.4 Participation Lifecycle |
| **EventSeries** | `DOMAIN_02_CALENDAR_PARTICIPATION_FREEZE_V1.0.md` | §2.5 EventSeries |
| **Jornada** | `DOMAIN_02_CALENDAR_PARTICIPATION_FREEZE_V1.0.md` | §2.6 Jornada |
| **Teams List** | `DOMAIN_03_TEAMS_FREEZE_V1.0.md` | §3.1 Teams List |
| **Team Detail** | `DOMAIN_03_TEAMS_FREEZE_V1.0.md` | §3.2 Team Detail |
| **Person Detail (Operational)** | `DOMAIN_03_TEAMS_FREEZE_V1.0.md` | §3.3 Person Detail |
| **Communication Hub** | `DOMAIN_04_COMMUNICATION_FREEZE_V1.0.md` | §4.3 Communication Hub |
| **New Conversation** | `DOMAIN_04_COMMUNICATION_FREEZE_V1.0.md` | §4.4 New Conversation |
| **New Announcement** | `DOMAIN_04_COMMUNICATION_FREEZE_V1.0.md` | §4.5 New Announcement |
| **Announcement Detail** | `DOMAIN_04_COMMUNICATION_FREEZE_V1.0.md` | §4.6 Announcement Detail |
| **Announcement Edit** | `DOMAIN_04_COMMUNICATION_FREEZE_V1.0.md` | §4.7 Announcement Edit |
| **Conversation Detail** | `DOMAIN_04_COMMUNICATION_FREEZE_V1.0.md` | §4.8 Conversation Detail |
| **More / Profile** | `DOMAIN_05_MORE_MANAGEMENT_FREEZE_V1.0.md` | §5.1, §5.2 |
| **Search** | `DOMAIN_05_MORE_MANAGEMENT_FREEZE_V1.0.md` | §5.3 |
| **Notifications** | `DOMAIN_05_MORE_MANAGEMENT_FREEZE_V1.0.md` | §5.4 |
| **Management Hub** | `DOMAIN_05_MORE_MANAGEMENT_FREEZE_V1.0.md` | §5.5 |
| **Structure** | `DOMAIN_05_MORE_MANAGEMENT_FREEZE_V1.0.md` | §5.6 |
| **Team Admin** | `DOMAIN_05_MORE_MANAGEMENT_FREEZE_V1.0.md` | §5.7 |
| **People Management** | `DOMAIN_05_MORE_MANAGEMENT_FREEZE_V1.0.md` | §5.8 |
| **Competitions** | `DOMAIN_05_MORE_MANAGEMENT_FREEZE_V1.0.md` | §5.9 |
| **Reports** | `DOMAIN_05_MORE_MANAGEMENT_FREEZE_V1.0.md` | §5.10 |
| **Audit** | `DOMAIN_05_MORE_MANAGEMENT_FREEZE_V1.0.md` | §5.11 |
| **Auth Reconciliation** | `GEI_AUTH_RECONCILIATION_V1.0.md` | All sections |

> **Note:** Target-ux file count = 9 (not 8). Includes `GEI_AUTH_RECONCILIATION_V1.0.md` as separate versioned artifact. All gaps cite versioned target-ux files per citation rule.

---

## EVIDENCE CLASSIFICATION (Per Gap)

Each gap's `CURRENT EVIDENCE` must be tagged:

| Tag | Meaning |
|-----|---------|
| `RUNTIME` | Observed in screen capture or DOM dump (500/768/1440px) |
| `STATIC` | Read from source code (`src/**`) |
| `INFERENCE` | Deduced from code behavior, not directly observed |

**Rule:** No gap accepted on `INFERENCE` alone — must have `RUNTIME` or `STATIC` evidence.

---

## VERSION LOCK

All target-ux files at **V1.0** (except `GEI_AUTH_RECONCILIATION_V1.0` which is V1.0 resolution doc).

**Next version bump:** Only via `GEI_TARGET_UX_CHANGE_CONTROL_V1.0.md` process.