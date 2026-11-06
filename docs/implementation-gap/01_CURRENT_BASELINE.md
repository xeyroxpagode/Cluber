# 01_CURRENT_BASELINE.md

# Current Baseline — Stage 4 Frontend Implementation

**Baseline SHA:** `ebba0b8` (HEAD `gei/frontend-target-v1`)  
**Date:** 2026-10-22  
**Source:** `GEI_FRONTEND_IMPLEMENTATION_REPORT_V1.md`, `GEI_FINAL_FRONTEND_FREEZE_V1.md`, `GEI_STAGE5_SCREEN_AUDIT_MATRIX_V1.md`, `GEI_STAGE5_PERCEPTUAL_INTERACTION_AUDIT_V1.md`

---

## BUILD & QUALITY GATES

| Gate | Result | Evidence |
|------|--------|----------|
| `pnpm build` | PASS | 1915 modules, 468.88 kB JS (gz 137.35), 41.83 kB CSS (gz 7.96) |
| `pnpm typecheck` | PASS | Strict mode, noUnusedLocals/Parameters OFF (25 dead imports) |
| `pnpm test` | 31/31 PASS | 4 files: smoke(5), target-grammar(4), target-behavior(6), p0-invariants(16) |
| `git status` | Clean | No uncommitted changes |

---

## ARCHITECTURE (Stage 4 Changes)

### New Files (14)
```
src/shared/states.ts              # stateText/stateTone — no silent fallback
src/shared/patterns.tsx           # 11 patterns (StateBanner, ImpactPreview, TimelineEntry, etc.) — 0 consumers in features
src/shared/vas.tsx                # VasControl, VasCompact — ¿Vas? grammar
src/mock/clock.ts                 # Real clock abstraction + DEV override
src/mock/authority.ts             # getAllowedActions (16 flags, 1 used)
src/mock/eligibility.ts           # Re-export canónico
src/__tests__/setup.ts
src/__tests__/smoke.test.tsx
src/__tests__/target-grammar.test.tsx
src/__tests__/target-behavior.test.tsx
src/__tests__/p0-invariants.test.tsx
vitest.config.ts
```

### Modified Files (18)
```
package.json              +typecheck, +test, deps
pnpm-lock.yaml
tsconfig.json             strict mode (noUnusedLocals OFF)
src/index.css             intact
src/styles/theme.css      +17 tokens (typography, spacing, radii, shadow, z-index, motion)
src/shared/ui.tsx         Badge tone external, Empty semantic icon
src/app/Shell.tsx         route-context map, MI EQUIPO label derivado, nav filtrada
src/app/App.tsx           38/38 routes preserved
src/mock/model.ts         +Venue, Membership, TeamAssignment, GuardianRelationship, EligibilityConstraint, EventSeries, NotificationType, targetTeams, targetPersonIds, credentialVersion
src/mock/seed.ts          +venues, constraints, memberships, assignments, guardian, series, notifications
src/mock/store.tsx        +guardianChildren, changePassword, markAttendance, correctRecord, findOrOpenDirect, renameVenueMetadata, changeEventVenue, notify tipada
src/mock/permissions.ts   unchanged
src/features/overview.tsx Home, Calendar, Teams, TeamDetail, PersonDetail, Search
src/features/events.tsx   EventDetail, EventForm, JornadaPage
src/features/participation.tsx Availability, Selection, Attendance, MatchRecord
src/features/communication.tsx Communication, NewConversation, Conversation, Announcement, Notifications
src/features/management.tsx Structure, People, PersonAdminDetail, Competitions
src/features/account-insight.tsx More, Profile, Auth, Reports, Audit
```

---

## ROUTE COVERAGE (38/38 Canonical)

| Route | Status | Archetype |
|-------|--------|-----------|
| R01 `/login` | Render | AUTH |
| R02 `/activate` | Render | AUTH |
| R03 `/no-access` | Render | AUTH |
| R04 `/home` | Render | A1 Operational Home |
| R05 `/calendar` | Render | A2 Time Browser |
| R06 `/search` | Render | A7 Management List |
| R07 `/notifications` | Render | A10+A1 |
| R08 `/more/profile` | Render | A6 Entity Detail |
| R09 `/teams` | Render | A7 Management List |
| R10 `/teams/:teamId` | Render | A6+A3 |
| R11 `/people/:personId` | Render | A6 |
| R12 `/events/new` | Render | A8 Admin Form |
| R13 `/events/:eventId` | Render | A4 Event Detail |
| R14 `/events/:eventId/edit` | Render | A8 Admin Form |
| R15 `/events/:eventId/availability` | Render | A3 Roster Action |
| R16 `/events/:eventId/selection` | Render | A3 Roster Action |
| R17 `/events/:eventId/attendance` | Render | A3 Roster Action |
| R18 `/events/:eventId/match-record` | Render | A8 Admin Form |
| R19 `/jornadas/new` | Render | A8 Admin Form |
| R20 `/jornadas/:jornadaId` | Render | A4+A8 |
| R21 `/communication` | Render | A5-hub |
| R22 `/communication/conversations/new` | Render | A8 |
| R23 `/communication/announcements/new` | Render | A8 |
| R24 `/announcements/:id` | Render | A6 |
| R25 `/announcements/:id/edit` | Render | A8 |
| R26 `/conversations/:id` | Render | A5 |
| R27 `/management` | Render | A7-hub |
| R28 `/management/structure` | Render | A7+A8 |
| R29 `/management/teams/:id` | Render | A6 |
| R30 `/management/people` | Render | A7 |
| R31 `/management/people/new` | Render | A8 |
| R32 `/management/people/:id` | Render | A6+A8 |
| R33 `/management/competitions` | Render | A7 |
| R34 `/management/competitions/:id` | Render | A6 |
| R35 `/reports` | Render | A7-hub |
| R36 `/reports/attendance` | Render | A9 |
| R37 `/reports/performance` | Render | A9 |
| R38 `/audit` | Render | A10 |

**Extra preserved:** `/` (redirect), `/more` (hub), `*` (404)

---

## STAGE 4 LAB SCREEN RESULTS

| Lab Screen | Verdict | Key Evidence |
|------------|---------|--------------|
| Home | PASS | Attention ≤3 + "Nada pendiente." + Hoy real + ¿Vas? inline + Comunicaciones separated |
| Event Detail | PASS | L0 + ¿Vas? inline + Rail Participación + Alert gated (P0-5) + sede derivada |
| Selection | PASS | Filas + disponibilidad + conflicto en lenguaje usuario + publicar-con-conflicto + autosave |
| Attendance | PASS | PRESENT/AUSENT/JUSTIFICADO/SIN REGISTRO + UNRECORDED≠ABSENT + cierre modal + corrección before/after |
| Communication | PARTIAL | Tabs Conversaciones/Comunicados + composer sticky + FDPG-04; density not rebuilt |
| Person Admin | PASS | Secciones + elegibilidad constraints + "Personas a cargo" + PII gated |

---

## P0 CLOSURE (Stage 4)

| P0 | Before | After | Evidence |
|----|--------|-------|----------|
| P0-1 Team identity muta por rename | OPEN | **CLOSED** | `StructurePage.save` bloquea rename División/Línea con equipos activos |
| P0-2 Attendance correction borra historia | OPEN | **CLOSED** | `markAttendance` + `attendanceHistory[]` con before/after/actor/reason |
| P0-3 MatchRecord correction borra historia | OPEN | **CLOSED** | `correctRecord` + `recordHistory[]` |
| P0-4 Password fake success | OPEN | **CLOSED** | `changePassword` valida 12-128, muta `credentialVersion`, devuelve error sin mutar |
| P0-5 Eligibility visible a PLAYER | OPEN | **CLOSED** | Alert gated por `allowed.canViewEligibilityDetail`; ADMIN/CAPTAIN ≠ Coach |
| P0-6 Venue rename sin §11 | OPEN | **CLOSED (A/B)** | `renameVenueMetadata` (no propaga) vs `changeEventVenue` (revision++, notif) |

---

## STAGE 4 DISCOVERED GAPS (Carried Forward)

| ID | Screen | Problem | Capability | Blocking |
|----|--------|---------|------------|----------|
| S4-01 | `/events/:id/edit` | ScopeDialog captures intent but `eventChange` applies only to edited occurrence | C10/C07 | no |
| S4-02 | `/events/:id/selection` | Conflict Workspace missing 3-column baseline/borrador/servidor | C10/C14 | no |
| S4-03 | `/management/competitions/:id` | CompetitionEntry fusiona LINE+TEAM | C05 | no |
| S4-04 | mock global | `Person.team`/`Person.role` persisten como selectores derivados | C03/C04 | no |
| S4-05 | `/communication` | Lista conversaciones sin reordenar por no-leídos | C12 | no |

---

## STAGE 5 PERCEPTUAL AUDIT SUMMARY (Read-Only)

| Metric | Result |
|--------|--------|
| Rutas auditadas | 38/38 |
| Bloques B01-B48 | 1,824 celdas: PASS 143, MINOR 618, MAJOR 807, N/A 256 |
| Rutas COMPLETAS bajo §5 (ciclo completo) | **0/38** |
| Rutas COMPLETAS como superficie | 2/38 (`/no-access`, `/reports`) |
| Flujos F01-F30 COMPLETE | 1/30 (F17) |
| Flujos PARTIAL | 17/30 |
| Flujos MISSING | 8/30 |
| Flujos CONTRADICTORY | 4/30 |
| Capacidades C01-C16 COMPLETE | 4/16 |
| Capacidades PARTIAL | 9/16 |
| Capacidades MISSING | 2/16 |
| Capacidades CONTRADICTORY | 1/16 (C04) |
| Hallazgos sistémicos (UX-01..UX-46) | 46 |
| Product gaps (PG-01..PG-07) | 7 |
| Product discovery candidates (PDC-01..05) | 5 |

---

## RUNTIME EVIDENCE BASELINE

- **Server:** `vite preview` over `dist/` (production build) on `http://localhost:4173`
- **Viewports verified:** 500px, 768px, 1440px (390px NOT verifiable — OS minimum ~500px)
- **Actors verified runtime:** PLAYER, COACH, SUBCOMMITTEE, ADMIN (CAPTAIN via dataset, GUARDIAN static only)
- **Captures:** 45 screenshots + 39 DOM dumps (stored in temp, not repo)
- **Interactions:** NOT verified (no browser automation) — all mutations verified by code + rendered text

---

## KNOWN LIMITATIONS (Current Baseline)

1. **No backend** — all state in-memory, resets on reload
2. **Mock model** — `Person.team`/`role` still exist as derived selectors (S4-04)
3. **Authority layer** — `getAllowedActions` exists but 15/16 flags unused
4. **Patterns layer** — `shared/patterns.tsx` 11 components, 0 consumers in features
5. **Responsive** — Single breakpoint (1024px), 3 regimes not implemented
6. **URL state** — `useSearchParams` = 0; no filter/tab/month in URL
7. **Forms** — 0 `<form>` wrappers, 0 inline validation, 0 dirty tracking, 0 discard confirm
8. **Motion** — Tokens declared, 0 causal motion implemented
9. **Accessibility** — `aria-live`=0, `role="tab"`=0, `aria-invalid`=0, touch targets <44px
10. **Trust** — History written but invisible, fabricated counts, frozen audit dates