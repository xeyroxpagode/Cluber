# 11_SHARED_COMPONENT_IMPACT.md

# Shared Component Impact Matrix

**Authority:** `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md`  
**Date:** 2026-10-22  
**Purpose:** Map every shared component to the gaps that touch it

---

## PRIMITIVES (shared/ui.tsx)

| Component | Current State | Gaps Touching | Target Change | Consumers Affected |
|-----------|---------------|---------------|---------------|--------------------|
| `Button` | 40px, no danger usage | GLB-022, GLB-005, MGMT-018 | min-h-11 (44px); danger mandatory for destructive | All features |
| `IconButton` | 40px | GLB-022 | 44px | Shell, features |
| `RowLink` | chevron + states | TEAM-004, MGMT-014 | use `role` where needed | Features |
| `RowStatic` | present | — | — | Features |
| `StateBadge` | tone external | GLB-005, GLB-006 | Tone from states.ts single map | All |
| `Tag` | present | — | — | Features |
| `UnreadMark` | present | COM-006 | aria-label | Communication, Shell |
| `TabBar` | no role=tab | TEAM-004, MGMT-004, GLB-016 | role=tablist/tab, aria-selected, arrows | Teams, Communication, Management |
| `SegmentedControl` | basic | GLB-017 | aria-pressed, focus-visible | Events (type), Availability |
| `FilterChip` | aria-pressed | GLB-010 | URL persistence | Management, Search |
| `Expander` | details native | — | — | Features |
| `Menu` | no role/Escape | GLB-016 | role=menu, Escape, click-out, focus | Features, Shell |
| `Field` | no error/aria | GLB-021 | error, aria-invalid, aria-describedby | All forms |
| `TextField` | no error | GLB-021 | inherit Field | Forms |
| `TextArea` | no error | GLB-021 | inherit Field | Forms |
| `Select` | no error | GLB-021, MGMT-019 | error + no-auth-prefill | Forms |
| `Checkbox` | 16px, no describedby | GLB-022, GLB-017 | 44px target, aria-describedby | Selection, R18, R22 |
| `RadioGroup` | no focus | GLB-017 | focus-visible, aria-checked | Events, Availability |
| `Surface` | only 2 visual levels | GLB-003, GLB-013 | surface hierarchy (control/overlay levels) | All |
| `OpenGroup` | present | — | — | Features |
| `Banner` | tone prop | GLB-005 | use stateTone map | All |
| `Empty` | semantic icon | GLB-024 | copy mandatory | All |
| `Modal` | focus trap OK | GLB-014 | dirty-discard guard; z-index | Features |
| `Sheet` | present | GLB-014 | dirty-discard guard | Features |
| `ConfirmDialog` | present | MGMT-009, GLB-005 | danger variant; motive required | Management, Participation |
| `SavedState` | present | PART-002 | honest confirmation | Availability, Selection |
| `Toast` | role=status | GLB-026, PART-002 | no optimistic success | All |
| `Avatar` | initials | — | — | Features |
| `MetaRow` | present | — | — | Profile |
| `TextLink` | 36px | GLB-022 | 44px where gesture | Features |
| `BackLink` | present | GLB-010 | origin preservation | Features |
| `StickyActionBar` | present | PART-009 | content not obscured | Participation |
| `DataTable` | no th | MGMT-030 | semantic th, sort, sticky header | Reports, Selection, Management |
| `KeyValue` | present | — | — | Detail screens |

---

## PATTERNS (shared/patterns.tsx) — 11 DECLARED, 0 CONSUMED

| Pattern | Current | Gaps | Target |
|---------|---------|------|--------|
| `PageContextHeader` | dead | GLB-019 | Consume in every ROUTE (Page Intro) |
| `SectionHeader` | dead | GLB-019 | Consume in every section |
| `DetailSection` | dead | GLB-019 | Consume in detail screens |
| `FormSection` | dead | GLB-019 | Consume in forms |
| `StateBanner` | dead | EVENT-001, GLB-019 | Consume for terminal states |
| `ImpactPreview` | dead | EVENT-002, JOR-002, COM-016 | Consume with real counts |
| `TimelineEntry` | dead | GLB-020, GLB-027, MGMT-022 | Consume for history/audit |
| `HistoryList` | dead | GLB-020 | Consume for corrections |
| `FilterBar` | dead | GLB-010 | Consume with URL persistence |
| `ScopeDialog` | dead (duplicated inline) | EVENT-002 | Consolidate + apply scope |
| `TerminalConfirm` | dead | MGMT-009 | Consume for destructive |
| `StatusText` | dead | GLB-006 | Consume single vocabulary |

---

## VAS (shared/vas.tsx)

| Component | Current | Gaps | Target |
|-----------|---------|------|--------|
| `VasControl` | present | HOME-008, HOME-009, PART-001 | single grammar; prior answer visible |
| `VasCompact` | present | PART-001 | unify with VasControl |

---

## NEW SHARED COMPONENTS REQUIRED (CREATE)

| New Component | Purpose | Gaps | Complexity |
|---------------|---------|------|-----------|
| `NavigationRail` | Medium nav 72px | GLB-002 | M |
| `Popover` | anchored overlay | GLB-013, GLB-009 | M |
| `Inspector` | Wide lateral panel | GLB-013, CAL-005 | M |
| `CommandDialog` | Wide search | GLB-008 | M |
| `DiffList` | revision/announcement diff | PART-010, COM-016 | S |
| `NotificationPopover` | Wide notifications | GLB-009, MORE-016 | S |
| `ConflictWorkspace` | 3-way conflict | EVENT-012 | L |
| `ViewState` hook | URL view state | GLB-010 | M |
| `useDirtyGuard` | dirty discard | GLB-014 | S |
| `getVisibleFields` | PII field authority | GLB-011, GLB-012, TEAM-010 | M |

---

## SHARED SYSTEM IMPACT SUMMARY

| System | Gaps | Impact |
|--------|------|--------|
| Design tokens | 4 (GLB-003,005,006,023) | All features |
| UI primitives | 14 | All features |
| Patterns library | 1 (GLB-019) + 12 patterns | All features |
| Vas grammar | 3 | Home, Participation |
| Navigation | 5 (GLB-001,002,004,010 + rail) | Shell + all |
| Authority | 5 (GLB-011,012 + PII) | All |

**31 SHARED-component-classified gaps. 161 local (feature) gaps.**