# GEI Frontend Target V1 — Implementation Report

**Branch:** `gei/v1.1-scope-reconciliation`
**Date:** 2026-10-15
**Authority:** GEI V1.1 (Product Truth Freeze V1.1 + Scope Reconciliation V1.1)

## 1. Current audit (summary)

- Repo real en `C:\Users\thega\Desktop\Gei-Hockey-Managment-System`, worktree limpio al inicio salvo 8 archivos del slice mock/Shell ya iniciado.
- Stack verificado: React 19, React Router 7, Vite 8, TypeScript 5.7, Tailwind v4, Vitest 5, pnpm.
- Arquitectura: `src/app` (router 38 destinos + Shell responsive), `src/features` (6 archivos), `src/mock` (engine con seed/authority/derive/impact/series), `src/shared` (design system), `src/__tests__` (4 suites).
- El CURRENT era prototipo V1.0.1 con Guardian/Eligibility/CompetitionEntry activos en UI, authority, seed y tests; login por username.

## 2. KEEP / REFIT / REBUILD / REMOVE

- **KEEP:** design system (theme, states, ui, patterns), rutas canónicas, Shell responsive, series/impact/attendance/selection/record engine, Home/Calendar/EventDetail/Availability/Selection/Attendance/Communication/Notifications/Search/Reports/Audit tal como estaban (salvo leaks puntuales).
- **REFIT:** `model.ts`, `derive.ts`, `authority.ts`, `seed.ts`, `store.tsx`, `Shell.tsx`, `vas.tsx`, `states.ts`, `overview.tsx`, `events.tsx`, `participation.tsx`, `communication.tsx`, `account-insight.tsx`, `management.tsx` (PersonAdmin, TeamAdmin, ManagementHome, CreatePerson), tests.
- **REBUILD:** `CompetitionsPage` (entries + DRAFT/ACTIVE/CLOSED → simple crear/editar/archivar/consultar); `LoginPage` (username → email+password).
- **REMOVE:** `src/mock/eligibility.ts`; `GuardianRelationship`, `EligibilityConstraint`, `CompetitionEntry*` (tipos, seed, APIs, UI); `childId`/child-switcher (Shell, store, vas, features); flags `canRespondForChild`, `canManageEligibility`, `canManageGuardianRelations`, `canViewEligibility*`, `guardianChildren`; tabs `Habilitación`/`Representación` + dialogs constraint/guardian; `competitionEntryId`; sección inscripciones (Competitions, TeamAdmin, EventDetail); selector de equipo muerto en CreatePerson; actor demo `guardian`.

## 3. Decisions

- Competition V1.1 = `{ id, name, organizer, archivedAt }`; archivar es terminal; archivada = sólo lectura con banner.
- `Jornada.competitionId` y `Match/Event.competitionId` opcionales y directos; alta de jornada sin competencia obligatoria; JornadaDetail muestra Contexto (Temporada + Competencia).
- Conflictos de Selection supervivientes: sólo `NO_LONGER_EVENT_TARGET`, `NO_LONGER_TEAM_AFFILIATED`.
- `SUBCOMMITTEE` ya no abre fichas de personas (`people` = ADMIN); ManagementHome con título/lead por rol.
- Login prototipo honesto: email case-insensitive + contraseña no vacía; hint de credencial simulada en el store.
- Cambio de email propio advierte que es el correo de acceso.
- Bug V1.0 encontrado y corregido: `CompetitionsPage` leía `useParams().competitionId` pero la ruta define `:id`, por lo que el detalle nunca se mostraba.
- 25 archivos `docs/uml/**/source-v1_1/*.drawio` aparecen modificados en el worktree por un proceso concurrente ajeno a este lote (contenido coherente V1.1, no tocado por mí). No se stagean ni se commitean aquí.

## 4. Route coverage (38 destinos, todos montan)

`/login`, `/activate`, `/no-access`, `/home`, `/calendar`, `/teams`, `/teams/:teamId`, `/people/:personId`, `/events/new`, `/events/:eventId`, `/events/:eventId/edit`, `/events/:eventId/availability`, `/events/:eventId/selection`, `/events/:eventId/attendance`, `/events/:eventId/match-record`, `/jornadas/new`, `/jornadas/:jornadaId`, `/communication`, `/communication/conversations/new`, `/communication/announcements/new`, `/announcements/:id`, `/announcements/:id/edit`, `/conversations/:id`, `/conversations/new`, `/notifications`, `/search`, `/more`, `/more/profile`, `/management`, `/management/structure`, `/management/people`, `/management/people/new`, `/management/people/:id`, `/management/teams/:id`, `/management/competitions`, `/management/competitions/:id`, `/reports`, `/reports/attendance`, `/reports/performance`, `/audit`, `*`.

## 5. Tests

- `pnpm typecheck` → 0 errores.
- `pnpm test` → 4 archivos, 92/92 tests en verde.
- `pnpm build` → OK (vite, 1.25s).
- Tests nuevos V1.1: login email/username/password, competition crear→editar→archivar→lectura, jornada sin competencia, renders de CompetitionsPage (lista/detalle) y TeamAdmin, ficha sin tabs removidas, Home vacío positivo, conflictos sólo NO_LONGER_*.

## 6. Visual QA

- Sin tooling de browser/screenshots en este entorno: QA por tests de render jsdom (Home, Calendar, EventDetail, Availability, Profile, Communication, PersonAdmin, Jornada, Competitions, TeamAdmin) + revisión de código + build.
- Pendiente con tooling visual: inspección a 390/768/1024/1440px y reduced-motion manual (el CSS `prefers-reduced-motion` ya existe en theme.css).

## 7. Remaining issues

- Ningún blocker de Product Truth. Deuda conocida no tocada (fuera de alcance): alta de TeamAssignment/RoleAssignment no existe en UI (igual que en V1.0); `updateOwnContact` cambia email sin verificación (prototipo, advertido en UI).
