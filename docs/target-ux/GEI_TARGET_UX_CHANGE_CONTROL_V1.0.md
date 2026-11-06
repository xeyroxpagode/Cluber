# GEI Target UX Change Control V1.0

**Authority:** FROZEN — Governance for all Target UX freeze documents  
**Date:** 2026-10-22  
**Scope:** `GEI_TARGET_UX_FREEZE_V1.0.md`, `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md`, `DOMAIN_01_HOME_FREEZE_V1.0.md` through `DOMAIN_05_MORE_MANAGEMENT_FREEZE_V1.0.md`

---

## CHANGE CONTROL PRINCIPLES

1. **Target UX is frozen** — Implementation gaps are not design questions
2. **No silent deviations** — Every change requires explicit decision trail
3. **Authority hierarchy respected** — Product Truth > Target UX > Design System > Domain Freezes
4. **Evidence-based** — Runtime evidence required for composition/hierarchy/interaction changes
5. **Versioned** — All freeze documents version together; no partial updates

---

## CHANGE REQUEST PROCESS

### 1. Initiation
Any stakeholder may initiate a change by creating a **Change Request (CR)** document with:
- **CR-ID:** `GEI-UX-CR-YYYYMMDD-NNN`
- **Scope:** Which freeze document(s) affected
- **Current text:** Exact quote of current frozen text
- **Proposed text:** Exact replacement text
- **Reason:** Product justification (not preference)
- **Impact analysis:** Affected routes, components, capabilities, authority, PII, responsive, state, navigation, overlay, feedback, motion, accessibility
- **Dependencies:** Other CRs, backend changes, data contract changes
- **Acceptance criteria:** How to verify the change
- **Evidence required:** Runtime captures, test cases, audit trail

### 2. Review
- **Product Owner** validates reason aligns with Product Truth
- **UX Lead** validates consistency across all freeze documents
- **Tech Lead** validates implementation feasibility and dependencies
- **No unilateral approvals** — all three roles must concur

### 3. Approval
- **Decision recorded** in `GEI_TARGET_UX_CHANGE_LOG.md` (append-only)
- **Version bump** of affected freeze document(s) to `V1.x+1`
- **Git tag:** `gei/target-ux-v1.x+1`
- **Communication** to implementation team with migration notes

### 4. Implementation
- Code changes in dedicated branch
- Tests updated/added
- Runtime evidence captured (3 viewports: 500, 768, 1440)
- `typecheck` + `test` + `build` PASS
- Merge to main with conventional commit: `docs(target-ux): CR-ID — summary`

### 5. Verification
- Post-merge runtime verification
- Gap ledger updated if implementation gaps change
- **No retroactive freeze changes** — only forward

---

## WHAT REQUIRES CHANGE CONTROL

| Category | Examples | Process |
|----------|----------|---------|
| **Product Truth conflict** | Auth model, actor roles, invariants | **BLOCKED** — must escalate to Product Truth freeze (Level 1) |
| **Target UX architecture** | Navigation contract, responsive regimes, route guard rules | Full CR process |
| **Design System tokens** | Color, typography, spacing, radius, elevation, motion | Full CR process |
| **Domain surface contract** | Hierarchy, primary action, row grammar, state coverage | Full CR process |
| **Transverse composition** | Page Intro, Object Identity, Workspace Action Region, Content Rail, Inspector, System Notice | Full CR process |
| **Accessibility baseline** | ARIA, focus, touch targets, motion reduction | Full CR process |

---

## WHAT DOES NOT REQUIRE CHANGE CONTROL

| Category | Examples |
|----------|----------|
| **Implementation bug fix** | Button 40px → 44px (to match frozen spec) |
| **Gap closure** | Adding missing Conflict Workspace (frozen in Domain 02) |
| **Copy correction** | Fixing "1 pendientes" → "1 pendiente" (to match frozen grammar) |
| **Token adoption** | Replacing `text-[11px]` with `.gei-meta` (to match frozen tokens) |
| **Test addition** | Adding test for frozen behavior |

**Rule:** If the frozen spec already says X, and current code does Y, fixing to X is **not a change request** — it's gap closure.

---

## AUTHORITY CONFLICT RESOLUTION

### TARGET-CONFLICT Detection
When a freeze document contradicts:
1. **Higher authority** (Product Truth) → Lower authority must yield
2. **Same level** (two Domain Freezes) → CR process with Product Owner tie-break
3. **Implementation reality** → Freeze wins (gap = implementation debt, not spec change)

### Current Resolved Conflicts
| Conflict ID | Description | Resolution | Date |
|-------------|-------------|------------|------|
| TARGET-CONFLICT-001 | Email verification activates account vs Admin activation code | **Admin activation code wins** (Product Truth V1.1 §16) | 2026-10-22 |
| TARGET-CONFLICT-002 | Self-service forgot-password vs Admin recovery | **Admin recovery wins** (Product Truth V1.1 §17) | 2026-10-22 |

**Documentation of resolution:** See `GEI_AUTH_RECONCILIATION_V1.0.md` (created as part of this audit)

---

## VERSIONING SCHEME

| Level | Document | Version Format | Current |
|-------|----------|----------------|---------|
| 1 | Product Truth | `GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_1.md` | V1.1 |
| 2 | Target UX | `GEI_TARGET_UX_FREEZE_V1.0.md` | V1.0 |
| 2 | Design System | `GEI_DESIGN_SYSTEM_FREEZE_V1.0.md` | V1.0 |
| 3 | Domain 01–05 | `DOMAIN_XX_FREEZE_V1.0.md` | V1.0 |
| 4 | Change Control | `GEI_TARGET_UX_CHANGE_CONTROL_V1.0.md` | V1.0 |

**Bumping:** Any change → all affected Level 2+ documents bump minor version together. Level 1 (Product Truth) bumps independently per its own control.

---

## CHANGE LOG

`GEI_TARGET_UX_CHANGE_LOG.md` — Append-only register of all approved changes.

### Format
```markdown
## CR-ID: GEI-UX-CR-20261022-001
**Date:** 2026-10-22
**Scope:** GEI_TARGET_UX_FREEZE_V1.0.md, DOMAIN_01_HOME_FREEZE_V1.0.md
**Change:** Auth model alignment — removed self-service forgot-password, added admin activation code
**Reason:** Alignment with frozen GEI V1 auth model (Product Truth V1.1 §16-17)
**Files Modified:** 
- GEI_TARGET_UX_FREEZE_V1.0.md (Global/Auth section)
- DOMAIN_01_HOME_FREEZE_V1.0.md (Actor variants)
- GEI_AUTH_RECONCILIATION_V1.0.md (new)
**Version Bump:** V1.0 → V1.1
**Git Tag:** gei/target-ux-v1.1
**Approved By:** Product Owner, UX Lead, Tech Lead
```

---

## EMERGENCY BYPASS (Exceptional)

**Only for:** Production-blocking security/accessibility regression discovered post-freeze.

**Process:**
1. Tech Lead declares emergency with written justification
2. Hotfix branch with minimal change
3. Runtime evidence captured
4. **Post-hoc CR required within 24h** — retroactive documentation
5. Full review at next change control cycle

**Never for:** Preference, aesthetics, "nice to have", scope creep.

---

## IMPLEMENTATION READINESS GATE

Before any implementation sprint begins:

```
☐ All Target UX freeze documents at same version (V1.0)
☐ TARGET-CONFLICT count = 0
☐ Product Truth conflicts = 0
☐ All 38 routes mapped to Domain Freezes
☐ All 16 capabilities mapped to screens
☐ All 7 Design System blocks complete
☐ All 6 transverse compositions defined
☐ Responsive regimes (3) fully specified
☐ Authority/PII/State/Overlay/Feedback/Motion/Accessibility grammars complete
☐ Change control process documented and agreed
```

**Only when ALL checked:** `READY FOR IMPLEMENTATION = YES`

---

## VERSION
`GEI_TARGET_UX_CHANGE_CONTROL_V1.0` — 2026-10-22