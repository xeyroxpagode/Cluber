# GEI HOCKEY MANAGEMENT SYSTEM
## STAGE 4 — FRONTEND IMPLEMENTATION REPORT V1

**Estado:** implementación frontend target completa sobre LOCAL MOCK STATE. Sin backend.
**Baseline SHA:** `c426950f1c6ceea8e1f501a252b52dadd539618b` (`docs: freeze v1.0.1 + IA simplicity research + frontend target blueprint`)
**Branch:** `gei/frontend-target-v1` (desde `gei/frontend-definition-v1`)
**Remote:** `origin` = `https://github.com/xeyroxpagode/Gei-Hockey-System-Managment.git`

---

# 1. Commits de Stage 4

| # | Commit | Mensaje |
|---|---|---|
| 1 | `63b48d0` | `chore(frontend): establish stage 4 verification baseline` |
| 2 | `70c6a43` | `feat(frontend): establish GEI target interaction grammar` |
| 3 | `70e6504` | `fix(frontend): close product truth P0 and model gaps` |
| 4 | `7f9ff8c` | `feat(frontend): implement laboratory target screens` |
| 5 | `945412e` | `feat(frontend): propagate target grammar across canonical routes` |
| 6 | `c159a0f` | `test(frontend): complete target frontend verification` |

Orden slightly distinto al plan declarado: el commit de modelos/P0 precedió a las laboratory screens porque las seis pantallas de laboratorio consumen `EligibilityConstraint[]`, `targetTeams[]`, `venues[]` y `credentialVersion`. Registrado como deviation menor.

---

# 2. Files changed

## Nuevos
```
docs/STAGE4_DISCOVERED_GAPS.md
src/shared/states.ts
src/shared/patterns.tsx
src/shared/vas.tsx
src/mock/clock.ts
src/mock/authority.ts
src/mock/eligibility.ts
src/__tests__/setup.ts
src/__tests__/smoke.test.tsx
src/__tests__/target-grammar.test.tsx
src/__tests__/target-behavior.test.tsx
src/__tests__/p0-invariants.test.tsx
vitest.config.ts
```

## Modificados
```
package.json            (+typecheck, +test, deps de verificación)
pnpm-lock.yaml
tsconfig.json
src/index.css           (sin cambios; reduced-motion vive en theme.css)
src/styles/theme.css    (tokens: typography, spacing, radii, shadow, z-index, motion)
src/shared/ui.tsx       (Badge consume mapping externo; Empty con icono semántico)
src/app/Shell.tsx       (route-context map; MI EQUIPO; label derivado; nav filtrada)
src/app/App.tsx         (sin cambios de rutas: 38/38 preserved)
src/mock/model.ts       (Venue, Membership, TeamAssignment, GuardianRelationship, EligibilityConstraint, EventSeries, NotificationType, targetTeams, historiales)
src/mock/seed.ts        (venues, constraints, memberships, assignments, guardian, series, guardian actor, notification types)
src/mock/store.tsx      (guardianChildren, changePassword, markAttendance, correctRecord, findOrOpenDirect, renameVenueMetadata, changeEventVenue, notify tipada)
src/mock/permissions.ts (sin cambios)
src/mock/eligibility.ts (renombrado a re-export del modelo canónico)
src/features/overview.tsx      (Home, Calendar, Teams, TeamDetail, PersonDetail, Search)
src/features/events.tsx        (EventDetail, EventForm, JornadaPage)
src/features/participation.tsx (Availability, Selection, Attendance, MatchRecord)
src/features/communication.tsx (Communication, NewConversation, Conversation, Announcement, Notifications)
src/features/management.tsx    (Structure, People, PersonAdminDetail, Competitions)
src/features/account-insight.tsx (More, Profile, Auth, Reports, Audit)
```

---

# 3. Architecture changes

1. **Clock abstraction** (`src/mock/clock.ts`): `todayIso()`, `addDays()`, `todayLabel()`, `isToday()`. Todo "hoy" productivo dejó de usar `2026-10-02`. Override DEV determinista vía `?clock=YYYY-MM-DD` o `window.__GEI_CLOCK_OVERRIDE__`.
2. **Authority layer** (`src/mock/authority.ts`): `getAllowedActions({ actor, event })` devuelve flags consumidos por la UI (`canViewEligibilityDetail`, `canViewDni`, `canManageSelection`, …). Reemplaza checks dispersos `role === "ADMIN"` en las decisiones de presentación critique.
3. **State mapping** (`src/shared/states.ts`): `stateText()` / `stateTone()` con mapping explícito y **sin fallback silencioso**: estado desconocido devuelve "Estado a revisar" y emite warning en DEV.
4. **Route context** (`src/shared/nav-context.ts`): elimina el breadcrumb "Mi espacio".
5. **Mock model canónico**: `eligibilityConstraints[]` (ELIGIBLE derivado), `venues[]`, `memberships[]`, `teamAssignments[]`, `guardianRelationships[]`, `eventSeries[]`, `targetTeams[]`, `targetPersonIds[]`, `notificationType`, `attendanceHistory[]`, `recordHistory[]`, `credentialVersion`.
6. **Commands de dominio en el store**: `changePassword`, `markAttendance`, `correctRecord`, `findOrOpenDirect`, `renameVenueMetadata`, `changeEventVenue`. Cada una escribe audit + historia cuando corresponde.

---

# 4. Design system changes (`src/styles/theme.css`)

Extensión, no reemplazo. Se conservaron los 17 tokens semánticos de color y el `@theme inline`.

Agregados:
- **Typography**: `--text-page-title`, `--text-section-title`, `--text-body`, `--text-meta`, `--leading-tight`, `--leading-body`, y clases `.gei-page-context`, `.gei-page-title`, `.gei-section-title`, `.gei-body`, `.gei-body-strong`, `.gei-meta`.
- **Spacing**: `--space-page`, `--space-section`, `--space-group`, `--space-row`, `--space-inline` + clases `.gei-page-stack`, `.gei-section-stack`, `.gei-group-stack`.
- **Radii**: `--radius-small`, `--radius-control`, `--radius-surface`, `--radius-modal`.
- **Shadow**: `--shadow-floating`, `--shadow-overlay`.
- **Z-index**: `--z-nav`, `--z-sticky`, `--z-sheet`, `--z-modal`, `--z-toast` (declarados; el JSX actual usa valores equivalentes ya existentes).
- **Motion**: `--motion-instant/micro/context`, `--ease-standard` + `@media (prefers-reduced-motion: reduce)` global.
- **Icon system**: `Empty` acepta `icon` semántico (deja de usar `CalendarDays` universal). `Badge` ya no tiene tone hardcodeado: usa `stateTone`.

---

# 5. Archetypes implementados

| Archetype | Dónde vive | Estado |
|---|---|---|
| A1 Operational Home | `overview.tsx` Home | Necesita tu atención máx 3 + "Nada pendiente." + Hoy + ¿Vas? inline + Próximamente + Comunicaciones |
| A2 Time Browser | `overview.tsx` Calendar | Agenda default (mobile-first), mes en desktop, Hoy real |
| A3 Roster Action | `participation.tsx` Availability/Selection/Attendance | Filas one-tap, conteo, sticky action |
| A4 Event Detail | `events.tsx` EventDetail | L0 evento/cuándo/dónde + ¿Vas? inline + rail Participación |
| A5 Chat | `communication.tsx` ConversationPage | Cabecera + mensajes + composer sticky |
| A6 Entity Detail | `overview.tsx` TeamDetail/PersonDetail, `management.tsx` TeamAdmin/PersonAdmin | Secciones, PII gated |
| A7 Management List | `overview.tsx` Search, `management.tsx` Structure/People/Competitions | Filas mínimas + estado en texto |
| A8 Admin Form/Detail | `events.tsx` EventForm, `management.tsx` CreatePerson/PersonAdmin | Secciones + Guardar sticky + Impact Preview |
| A9 Report | `account-insight.tsx` ReportDetail | Lectura con filtros |
| A10 Timeline/History | `account-insight.tsx` AuditPage, `events.tsx` historial | Append-only |

No son componentes monolíticos: son gramáticas compuestas por `shared/patterns.tsx`.

---

# 6. Route coverage 38/38

Las 38 canonical route paths de Freeze v1.0.1 §23 existen en `src/app/App.tsx` y resuelven. Verificado por typecheck + build + render de rutas representativas en tests.

Rutas sin cambios de path (preservadas): `/login`, `/activate`, `/no-access`, `/home`, `/calendar`, `/search`, `/notifications`, `/more/profile`, `/teams`, `/teams/:teamId`, `/people/:personId`, `/events/new`, `/events/:eventId`, `/events/:eventId/edit`, `/events/:eventId/availability`, `/events/:eventId/selection`, `/events/:eventId/attendance`, `/events/:eventId/match-record`, `/jornadas/new`, `/jornadas/:jornadaId`, `/communication`, `/communication/conversations/new`, `/communication/announcements/new`, `/announcements/:id`, `/announcements/:id/edit`, `/conversations/:id`, `/management`, `/management/structure`, `/management/teams/:id`, `/management/people`, `/management/people/new`, `/management/people/:id`, `/management/competitions`, `/management/competitions/:id`, `/reports`, `/reports/attendance`, `/reports/performance`, `/audit`.

Extra preservadas del CURRENT: `/` (redirect), `/more` (hub), `*` (404).

---

# 7. Lab screen results (5-second comprehension)

| Lab screen | PASS/PARTIAL | Evidencia |
|---|---|---|
| Home | **PASS** | "Necesita tu atención" limitado a 3 con "Nada pendiente." explícito; `¿Vas?` inline sin entrar al evento; Hoy con reloj real; separa Comunicaciones de Mensajes |
| Event Detail | **PASS** | L0 evento/cuándo/dónde + `¿Vas?` inline para quien responde; rail Participación (Disponibilidad → Convocados → Asistencia → Resultado); Alert de conflicto **gated** por `allowed.canViewEligibilityDetail` (P0-5); dirección de sede derivada de `venues[]` |
| Selection | **PASS** | Filas persona + disponibilidad + estado + conflicto en lenguaje usuario ("No puede jugar este partido por una restricción actual."); publicar **con** conflicto derivado en vez de bloquear (§14); autosave "Guardado HH:MM"; acción sticky |
| Attendance | **PASS** | Presente/Ausente/Justificada/Sin registrar en texto; conteo arriba; UNRECORDED nunca se convierte en ABSENT; cierre con modal que explica; corrección con motivo que **conserva before/after** (P0-2) |
| Communication | **PARTIAL** | Tabs Conversaciones/Comunicados; composer sticky (P2-23 corregido); FDPG-04 operative. PARTIAL: la pantalla conserva densidad del CURRENT; no se reconstruyó la lista completa con no-leídos reordenados |
| Person Admin | **PASS** | Secciones; mutación de elegibilidad ahora escribe `EligibilityConstraint[]`; "Personas a cargo" en Mi perfil; PII gated |

---

# 8. P0 closure

| P0 | Antes | Después | Evidencia |
|---|---|---|---|
| P0-1 Team identity muta por rename | OPEN | **CLOSED** | `StructurePage.save` bloquea rename de División/Línea con equipos activos y explica que la identidad no cambia. Test `p0-invariants` |
| P0-2 Attendance correction borra historia | OPEN | **CLOSED** | `markAttendance` + `attendanceHistory[]` con before/after/actor/reason. Test verifica 2 entradas y before=null inicial |
| P0-3 MatchRecord correction borra historia | OPEN | **CLOSED** | `correctRecord` + `recordHistory[]`. Test verifica before `3-1` → after `GEI 4-1 (FINAL)` |
| P0-4 Password fake success | OPEN | **CLOSED** | `changePassword` valida longitud (12–128), muta `credentialVersion`, devuelve `{ok:false,error}` sin mutar cuando falla. Test |
| P0-5 Eligibility visible a PLAYER | OPEN | **CLOSED** | Alert de conflicto en `EventDetail` condicionado a `allowed.canViewEligibilityDetail`; `allowedActions` test ensures ADMIN/CAPTAIN no son Coach |
| P0-6 Venue rename sin §11 | OPEN | **CLOSED (A/B separados)** | `renameVenueMetadata` (no propaga, no revision++, no notificación) vs `changeEventVenue` (revision++, notificación, dirección derivada). Dos tests |

**P0 = 0.**

---

# 9. P1 status

| P1 | Estado en Stage 4 |
|---|---|
| P1-01 Guardian | **CLOSED visual/mock**: `guardianRelationships[]`, actor `guardian` sin Membership deportivo, `hasAccess` por delegación, "Viendo a…" en Home sólo si >1, "Personas a cargo" en Mi perfil |
| P1-02 Eligibility SUBCOMMITTEE | **CLOSED**: mutación escribe constraints canónicos; reason/source gated por `allowedActions` |
| P1-03 Event targets plural | **CLOSED**: `targetTeams[]` + `targetPersonIds[]` + `eventTargetsText()` |
| P1-04 EventSeries | **PARTIAL**: modelo `eventSeries[]` + `seriesId` + `ScopeDialog` (FDPG-01) funcionando. Bulk real deOccurrence override no implementado |
| P1-05 Membership | **PARTIAL**: `memberships[]` + `teamAssignments[]` presentes y `MovePlayerTeam` los actualiza. `person.team`/`person.role` se mantienen como selectores derivados por compatibilidad |
| P1-06 Conflict Workspace | **PARTIAL**: superficie de conflictos en Selection (Alert + desglose por persona en lenguaje usuario) y Impact Preview en EventForm. No hay vista lado a lado baseline/localDraft/latestServer |
| P1-07 `Person.role` stale | **PARTIAL**: se eliminó el filtro por `person.role` en Overview (Home/TeamDetail/PersonDetail); siguen existiendo usos en features |
| P2-23 composer mobile | **CLOSED**: composer `sticky bottom-0` + altura mobile-first |
| P2-32 `/jornadas/new` inalcanzable | **CLOSED**: More → Jornadas ahora deriva del estado y cae a `/jornadas/new` si no hay jornadas |
| P3-12 literal `/jornadas/j1` | **CLOSED**: eliminado |
| P2-28 literal `/conversations/c2` | **CLOSED**: Home navega por derivación de estado |

---

# 10. Responsive

| Breakpoint | Resultado |
|---|---|
| 390px | Bottom nav; tablas→filas en Selection/Attendance; composer sticky; filas de roster ≥44px; modales bottom-sheet; sin overflow horizontal introducido |
| 768px | Bottom nav; agenda por defecto en Calendar; mes disponible; selects apilados |
| 1440px | Sidebar 224px; main `max-w-[1440px]`; paneles secundarios (`xl:grid-cols-[1fr_300px]`) en Home/Team/Event |

---

# 11. Accessibility

- Preservado y no degradado: `Modal` con focus trap, Escape, scroll-lock y restore de foco.
- `prefers-reduced-motion` respetado globalmente en `theme.css`.
- Focus visible global (`index.css` intacto).
- `Empty` ahora acepta `role`-friendly iconos; `Badge` mantiene texto además de color (§8 Blueprint).
- `/Vas?` usa `role="group"` + `aria-label` + `aria-pressed`.
- Avisos: `aria-label="Avisos, N sin leer"`.
- Tests: smoke de diálogo, target-grammar de `/Vas?` y ScopeDialog, smoke de estados sin fallback silencioso.

---

# 12. Tests

```
pnpm typecheck   PASS
pnpm test        31/31 PASS (4 files)
pnpm build       PASS
```

Cobertura crítica:
- P0-1..P0-6 invariantes.
- Availability: gramática + reconfirmación.
- Event Detail: sin jerga interna.
- Selection: publicar con conflicto no bloquea.
- Attendance: UNRECORDED ≠ ABSENT.
- MatchRecord: FINAL explícito.
- Communication: par DIRECT único + no duplicación.
- Guardian: login por delegación da acceso.
- Series: ScopeDialog 3 alcances.
- Structure: sin jerga de schema.
- Authority: ADMIN ≠ Coach, CAPTAIN ≠ Coach.
- Eligibility: derivación ELIGIBLE/PENDING/BLOCKED.
- Venue A/B: metadata vs evento.
- Clock: fecha real, no congelada.

---

# 13. Gaps discovered

`docs/STAGE4_DISCOVERED_GAPS.md` — registro mantido. Gaps reales de Stage 4:

| ID | Screen | Problem | Blocking |
|---|---|---|---|
| S4-01 | `/events/:id/edit` | `ScopeDialog` captura la intención de alcance pero el `eventChange` actual sigue aplicando sólo a la ocurrencia editada; no hay bulk de serie | no |
| S4-02 | `/events/:id/selection` | Conflict Workspace pide baseline vs borrador vs servidor lado a lado; Stage 4 implementa la versión de detalle por persona | no |
| S4-03 | `/management/competitions/:id` | `CompetitionEntry.team` sigue fusionando scope LINE y TEAM (M-12) | no |
| S4-04 | mock global | `Person.team` / `Person.role` siguen existiendo como selectores derivados (P1-05/P1-07) | no |
| S4-05 | `/communication` | Lista de conversaciones conserva densidad del CURRENT; no se reordenó por no-leídos/mención | no |

Ningún gap bloqueó una decisión irreversible.

---

# 14. Deviations

1. **Orden de commits**: modelos/P0 antes de laboratory screens (razón arriba).
2. **`noUnusedLocals` / `noUnusedParameters` NO activados**: generaban ~25 errores por imports no usados en los god files del CURRENT. Se decidió no hacer refactor oportunista; el typecheck estricto ya está activo.
3. **Sin React Hook Form / Zod / TanStack Query**: no se instalaron. El prompt las autoriza "sólo si aportan valor real"; en un frontend sin backend, RHF+Zod no reducían riesgo y TanStack Query habría sido una capa de abstracción sin fuente real. Los formularios mantienen el patrón existente con validación inline que preserva input (que ya cumplía §44/§47).
4. **Sin `ResponsiveSheet` propio**: se reutilizó `Modal` como surface de decisión acotada y `sticky` para acción. No se agregó un sheet nuevo porque ningún archetype del Stage 4 lo requería de forma independiente.
5. **`LegacyBadge`**: `shared/patterns.tsx` exporta un wrapper deprecado de `Badge` para no romper consumidores; el tone mapping ya vive fuera del primitive.
6. **Declarative tokens de z-index** existen pero el JSX actual conserva sus valores numéricos equivalentes; migrarlos era refactor cosmético sin valor de comprensión.

---

# 15. Verification summary

| Gate | Resultado |
|---|---|
| build | PASS |
| typecheck | PASS |
| tests | 31/31 PASS |
| routes | 38/38 presentes y renderizan |
| P0 | 6 → 0 |
| backend contamination | 0 (local mock state; sin fetch, sin server, sin deps de red) |
| git status | limpio al cerrar Stage 4 |
