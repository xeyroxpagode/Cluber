# GEI Target UX Freeze V1.0

**Authority:** FROZEN — Supreme UX authority for GEI V1 implementation  
**Date:** 2026-10-22  
**Status:** Canonical reference — all implementation gaps measured against this  
**Source Documents:** `GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_1.md`, `GEI_FRONTEND_TARGET_BLUEPRINT_V1.md`, `GEI_IA_SIMPLICITY_RESEARCH_V1.md`, `GEI_FINAL_FRONTEND_FREEZE_V1.md`  
**Design System:** `docs/target-ux/GEI_DESIGN_SYSTEM_FREEZE_V1.0.md`  
**Domain Freezes:** `docs/target-ux/DOMAIN_01_HOME_FREEZE_V1.0.md` through `DOMAIN_05_MORE_MANAGEMENT_FREEZE_V1.0.md`  
**Change Control:** `docs/target-ux/GEI_TARGET_UX_CHANGE_CONTROL_V1.0.md`

---

## PRODUCT TRUTH AUTHORITY HIERARCHY

```
1. GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_1.md (Supreme — scope, actors, invariants, auth model)
2. GEI_TARGET_UX_FREEZE_V1.0.md (This document — UX architecture, navigation, global contracts)
3. GEI_DESIGN_SYSTEM_FREEZE_V1.0.md (Visual, components, motion, accessibility tokens)
4. DOMAIN_XX_FREEZE_V1.0.md (5 domain-specific surface contracts)
5. GEI_TARGET_UX_CHANGE_CONTROL_V1.0.md (Process for any modification)
```

**Rule:** Where documents conflict, higher authority wins. No implementation decision may contradict Level 1 or 2.

---

## 7 DESIGN SYSTEM BLOCKS (Frozen)

| Block | Document | Status |
|-------|----------|--------|
| 1. FOUNDATION VISUAL | GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §1 | FROZEN |
| 2. CORE PRIMITIVES | GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §2 | FROZEN |
| 3. CONTENT SYSTEM | GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §3 | FROZEN |
| 4. NAVIGATION | GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §4 | FROZEN |
| 5. SURFACE SYSTEM | GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §5 | FROZEN |
| 6. OVERLAYS | GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §6 | FROZEN |
| 7. FEEDBACK + MOTION | GEI_DESIGN_SYSTEM_FREEZE_V1.0.md §7 | FROZEN |

**Transverse Compositions (Target — not yet implemented):**
- Page Intro
- Object Identity
- Workspace Action Region
- Content Rail
- Inspector
- System Notice

---

## 5 FROZEN DOMAINS

| Domain | Document | Routes | Archetypes |
|--------|----------|--------|------------|
| **01 — Home** | DOMAIN_01_HOME_FREEZE_V1.0.md | R04 `/home` | A1 Operational Home |
| **02 — Calendar + Participation** | DOMAIN_02_CALENDAR_PARTICIPATION_FREEZE_V1.0.md | R05, R12–R20 | A2 Time Browser, A3 Roster Action, A4 Event Detail, A8 Admin Form |
| **03 — Teams** | DOMAIN_03_TEAMS_FREEZE_V1.0.md | R09, R10, R11 | A6 Entity Detail, A3 Roster Action, A7 Management List |
| **04 — Communication** | DOMAIN_04_COMMUNICATION_FREEZE_V1.0.md | R21–R26 | A5 Chat, A6 Entity Detail, A7 Management List, A8 Admin Form |
| **05 — More + Management** | DOMAIN_05_MORE_MANAGEMENT_FREEZE_V1.0.md | R06, R07, R08, R27–R38 | A6 Entity Detail, A7 Management List, A8 Admin Form, A9 Report, A10 Timeline |

---

## GLOBAL / AUTH / CROSS-DOMAIN FREEZE

### Authentication Model (Final — GEI V1)

| Aspect | Decision | Source |
|--------|----------|--------|
| **LOGIN** | email + password | Product Truth §16 |
| **USERNAME** | profile identity only (never authenticates/recovers) | Product Truth §17 |
| **ACTIVATION** | administrative/setup code (delivered by admin) | Product Truth §16 |
| **ACTIVATION SUCCESS** | does NOT auto-login — returns to login | Product Truth §16 |
| **RECOVERY** | administrative (setup code re-issue) | Product Truth §16 |
| **SELF-SERVICE FORGOT PASSWORD** | **OUT OF V1** | Product Truth §17 |
| **OAUTH** | **OUT** | Product Truth §17 |
| **MFA** | **OUT** | Product Truth §17 |
| **PASSKEYS** | **OUT** | Product Truth §17 |

**Auth Routes (frozen):**
- R01 `/login` — AUTH archetype: marca → campos → entrar → ayuda
- R02 `/activate` — AUTH: código → ingresar → dónde conseguirlo
- R03 `/no-access` — AUTH: qué pasó → qué hacer → contacto

### Authorization (Server-side, default DENY)

| Principle | Implementation |
|-----------|----------------|
| **Single source** | `getAllowedActions({ actor, event, resource, field, objectState }) → Action[]` |
| **Formula** | ROLE + ACTION + SCOPE + OBJECT STATE + FIELD AUTHORITY + PII + SOURCE |
| **Default** | DENY |
| **Prohibited in UI** | `person.role`, `person.team`, `person.eligibility`, `capabilities.sport`, `role === "ADMIN"`, `getAllowedActions` en paralelo |
| **Derived from** | `RoleAssignment`, `Membership`, `TeamAssignment`, `EligibilityConstraint` |

### PII Semantics (Frozen — Product Truth §6)

| Field | Visible To | Editable By |
|-------|------------|-------------|
| `username` | self + ADMIN | — |
| `DNI` | ADMIN | ADMIN |
| `birthDate` | ADMIN | ADMIN |
| `phone` / `email` | self, ADMIN, COACH/CAPTAIN del Team (operational need) | self, ADMIN |
| `GuardianRelationship` | guardian self + ADMIN | ADMIN |
| `Eligibility status` | COACH (scope) + SUBCOMMITTEE + ADMIN | SUBCOMMITTEE + ADMIN |
| `Eligibility reason/source` | SUBCOMMITTEE + ADMIN | SUBCOMMITTEE + ADMIN |
| `Message body` | participants | author (soft-delete) |
| `Audit sensitive` | ADMIN (redacted per §6) | — |

### State Grammar (Frozen)

| Domain | States | Terminal States | Rules |
|--------|--------|-----------------|-------|
| Event | `DRAFT` → `SCHEDULED` → `POSTPONED` \| `IN_PROGRESS` → `COMPLETED` \| `ABANDONED`, `CANCELLED` from `SCHEDULED`/`POSTPONED`, `RESTORE` to `SCHEDULED` | `CANCELLED`, `COMPLETED`, `ABANDONED` | Terminal = composition propia + explicación consecuencia + historial visible, SIN ¿Vas? |
| Availability | `YES` / `MAYBE` / `NO` persisted; `NO_RESPONSE` / `NEEDS_RECONFIRMATION` derived from `coordinationRevision` | — | Stale exige reconfirmar |
| Attendance | `PRESENT` / `ABSENT` / `JUSTIFIED` / `UNRECORDED` (null) | — | **UNRECORDED ≠ ABSENT** — planilla puede cerrar con sin registrar |
| Selection | Draft (editable, autosave) → Published (immutable revisions) → Republicación (nueva revisión) | Published inmutable | Publicar NO bloquea por conflicto: avisa + explica + registra revisión |
| MatchRecord | `DRAFT` → `FINAL`; Corregir post-FINAL = flujo distinto con motivo + historial con marcador anterior | `FINAL` | `FINAL` bloquea edición |
| Announcement | `DRAFT` → `PUBLISHED` → `ARCHIVED`; Corrección = `revision++` + notificaciones; audiencia publicada inmutable | `PUBLISHED`, `ARCHIVED` | Corregir no toca audiencia |
| Account | `PENDING` → `ACTIVE` → `DISABLED` | `DISABLED` | Deshabilitar cierra sesiones; no dejar club sin admin activo |

### Overlay Grammar (Frozen)

| Surface | Use For | Contracts |
|---------|---------|-----------|
| **ROUTE** | Tarea importante, profunda, shareable/deep-linkable | 38 routes canónicos |
| **SHEET** | Tarea contextual corta que conserva origen | ¿Vas? desde Home, convocados cortos, crear estructura, selector Viendo a X, filtros complejos |
| **MODAL** | Confirmación/decisión acotada | Impact Preview + token, scope serie, Publicar, Finalizar, Cerrar/Corregir con motivo, eliminar, archivar |
| **INLINE** | Respuesta simple pegada al contexto | Marcar ¿Vas?/Asistencia, acuse Entendido, validación campo, conteos live, autosave |
| **OVERFLOW** | Secundaria/rara/destructiva | Postergar/Cancelar/Restaurar, historial, prefs, export, silenciar |
| **DEDICATED (Conflict Workspace)** | Conflicto de versiones | Baseline vs borrador vs servidor lado a lado (P1-06) |

### Feedback Grammar (Frozen)

| Trigger | Surface | Content | Duration |
|---------|---------|---------|----------|
| Acción primaria exitosa | Toast (`role="status"`) | Verbo real + timestamp | 3.6s |
| Error validación | Inline Field + Alert global | Qué pasó + qué hacer, **input preservado** | Hasta corrección |
| Error command/servidor | Alert + Toast | Qué pasó + qué hacer (+ reintento si aplica) | Persistente |
| Autosave | SavedState inline | "Borrador guardado HH:MM" | Hasta siguiente cambio |
| Mutación destructiva | Toast + navegación origen | Verbo + rastro auditoría | 3.6s |
| Mensaje enviado | Inline (tras confirmación server) | CheckCheck **solo tras server** | — |
| Mensaje fallido | Inline + botón Reintentar | "No se pudo enviar. Reintentar." | Persistente |

**Prohibido:** Fake success, success silencioso, error sin recovery, "Confirmar cambio" genérico.

### Motion Grammar (Frozen)

| Token | Duration | Easing | Use |
|-------|----------|--------|-----|
| `--motion-instant` | 0ms | linear | Toggle, checkbox, cambios instantáneos |
| `--motion-micro` | 120ms | ease-out | ¿Vas? guardado, conteo live, "Borrador guardado" |
| `--motion-context` | 180ms | ease-in-out | State transition (draft→publicado), sheet/modal origen-destino |

**Default:** NONE. **Permitido:** MICRO FEEDBACK, STATE TRANSITION, CONTEXT TRANSITION.  
**Prohibido:** bounce, fade-up cards, scale botones, decoración, >200ms sin causa.  
**Reduced motion:** Apaga todo (global CSS).

### Accessibility (Frozen — Minimum Baseline)

- Focus visible global (index.css intacto)
- Focus trap + Escape + scroll-lock en Modal/Sheet/ConfirmDialog
- `prefers-reduced-motion` respetado globalmente
- Estados siempre en texto (nunca solo color)
- **Gaps known (must close):** `aria-live` 0, `role="tab"` 0, `aria-invalid` 0, `aria-describedby` 0, menú sin semántica, heading skips, touch targets <44px

---

## RESPONSIVE REGIMES (Frozen — 3 Regimes)

| Metric | Compact (<768) | Medium (768–1199) | Wide (≥1200) |
|--------|----------------|-------------------|--------------|
| TopBar | 56px | 56px | 56px |
| BottomNav | 64px + safe-area | 64px + safe-area | — |
| NavigationRail | — | 72px | — |
| Sidebar | — | — | 240px |
| Gutter | 16px | 24px | 32px |
| Content max-width | 100% | 100% | 1440px centered |
| Calendar default | Agenda | Semana | Mes |
| Event Detail → Participation | Detail route | Detail route | Inspector when internal width permits |
| Conversation | Workspace (full) | Workspace | ConversationRail + Workspace |

**Desktop threshold (nav):** 1024px (sidebar appears)  
**Content regimes:** 3 visual regimes as above  
**No ad-hoc breakpoints. No desktop-only assumptions. Resize reversible with state preserved.**

---

## RESOURCE OWNERSHIP (Frozen)

| Resource | Owner Domain | Mutation Authority |
|----------|--------------|-------------------|
| Person / Account / Membership / RoleAssignment / TeamAssignment | Domain 05 (Management) | ADMIN (Account: ADMIN + self password) |
| Season / Division / Line / Team / Venue | Domain 05 (Management) | ADMIN |
| Competition / CompetitionEntry | Domain 05 (Management) | SUBCOMMITTEE + ADMIN |
| Event / EventSeries / Jornada / Match | Domain 02 (Calendar) | COACH (own teams) + SUBCOMMITTEE |
| Availability / Selection / Attendance / MatchRecord | Domain 02 (Participation) | COACH (Selection/Attendance/MatchRecord), PLAYER (own Availability) |
| Announcement / Conversation / Message / Notification | Domain 04 (Communication) | SUBCOMMITTEE (Announcement), participants (Conversation/Message) |
| Search / Reports / History / Audit | Domain 05 (Management) | Read-only (Reports/Audit), ADMIN (Audit write) |

---

## ORIGIN-AWARE BACK (Global Contract — Frozen)

**Requirement:** Back button **must** restore: filters, active tab, scroll position, search query, calendar month/view.

**Implementation:** `useSearchParams` **mandatory** for all filterable/paginated/tabbed views. URL = source of truth for view state.

**Current violation:** `useSearchParams` = **0** in entire codebase.

**Deep link contract:** Every route autosuficiente — no dependency on prior navigation history.

**Breadcrumb:** `Record<prefijo, etiqueta>` en vocabulario usuario (ej: "Hockey / Sexta A / Partido GEI vs CUBA") — **mata "Mi espacio"**.

---

## SEARCH (Frozen)

- **Global Search** (R06 `/search`): A7 archetype — campo → resultados → contexto → abrir
- **Atajo:** ⌘K / Ctrl+K desde cualquier pantalla
- **Scope:** Filtrado por `allowedActions` — usuario solo ve lo que tiene autoridad
- **Results:** Tipo en vocabulario usuario (Partido, Entrenamiento, Persona, Equipo, Comunicado, Conversación)
- **Query en URL:** **Obligatorio** — Back preserva búsqueda
- **Empty state:** Copy honesto + sugerencia (no "sin resultados" vacío)

---

## NOTIFICATIONS (Frozen)

| Type (§22) | Trigger | Audience Resolution | Surface |
|------------|---------|---------------------|---------|
| `ANNOUNCEMENT_PUBLISHED` | Publicar comunicado | `publishedAudience` snapshot (clubWide + teamIds[]) | Notification feed |
| `SELECTION_PUBLISHED` | Publicar convocatoria | Target team + staff + jugadores con availability | Notification feed |
| `EVENT_CHANGED` / `EVENT_RESCHEDULED` | Cambio material evento | `oldTargets ∪ newTargets ∪ publishedSelection ∪ availabilityResponses ∪ staff` | Notification feed |
| `EVENT_POSTPONED` | Postergar evento | Same as EVENT_CHANGED | Notification feed |
| `EVENT_CANCELLED` | Cancelar evento | Same as EVENT_CHANGED | Notification feed |
| `EVENT_RESTORED` | Restaurar evento | Same as EVENT_CHANGED | Notification feed |
| `MESSAGE_RECEIVED` | Nuevo mensaje en conversación | Participants (excluye autor) | Conversation badge + Notification feed |
| `RECORD_FINALIZED` | Finalizar resultado | Target team + staff | Notification feed |

**Key rules:**
- `origin_event_id` + `recipient` + `type` = clave lógica única (evita duplicados)
- Notificaciones **no** crean avisos globales por mensaje de conversación (solo MESSAGE_RECEIVED)
- `occurredAt` real (ISO) — nunca "Hace 1 hora" hardcodeado
- Agrupación por tipo en feed con icono

---

## ROUTE GUARDS (Frozen)

| Route Pattern | Guard | Behavior |
|---------------|-------|----------|
| `/login`, `/activate`, `/no-access` | None (public) | — |
| `/home`, `/calendar`, `/teams`, `/teams/*`, `/people/*`, `/events/*`, `/jornadas/*`, `/communication`, `/communication/*`, `/conversations/*`, `/announcements/*`, `/notifications`, `/search`, `/more`, `/more/profile` | `hasApplicationAccess` (RoleAssignment OR Guardian delegation) | Redirect to `/no-access` if false |
| `/management/*`, `/reports/*`, `/audit` | `allowedActions` includes `Management` / `Reports` / `Audit` | In-page denial: breadcrumb shows, then "Sección no disponible" — **screen must have h1** |

**Gating rule:** Usuario sin autoridad **no entra** a la página completa para recibir vacío — gating ocurre **antes de renderizar** (route guard). Denegación in-page solo para sub-secciones de `/management` donde el hub sí es accesible.

---

## AUTHORITY SEMANTICS (Frozen)

- **Effective roles:** PLAYER, CAPTAIN, COACH, SUBCOMMITTEE, ADMIN
- **ACT-AUTHENTICATED** stays abstract
- **Guardian** no es rol — entra con delegación, ve lo que delegación permite
- **CAPTAIN ≠ COACH**; **SUBCOMMITTEE ≠ COACH**; **ADMIN ≠ superusuario deportivo**
- **Authority derived from:** `RoleAssignment` (role + scopeType + targetId + validity), `Membership`, `TeamAssignment`, `EligibilityConstraint`
- **Field-level authority:** `getVisibleFields(subject, viewer)` per §6 matrix
- **Object-level scope:** `canOperateEvent` = `getAllowedActions({ scope: "EVENT", targetId: eventId, objectState: event.state })`

---

## SEARCH SEMANTICS (Frozen)

- Global search = `/search` route (R06)
- Command palette **prohibited** as primary navigation
- Query **must persist in URL** (`useSearchParams`)
- Results ranked by: exact match → prefix → fuzzy → tipo
- Each result shows: tipo (vocabulario usuario) + contexto mínimo (equipo/fecha) → tap = navegar a route canónica

---

## CHANGE CONTROL (Target UX)

See `GEI_TARGET_UX_CHANGE_CONTROL_V1.0.md` for full process.

**Summary:** Any modification to frozen UX requires:
1. Written product decision
2. Code change
3. Tests sustaining it
4. Runtime evidence (when composition/hierarchy/interaction affected)
5. Update to affected freeze document(s) with version bump

---

## TARGET UX QUESTIONS OPEN

**0**

> **Nota:** Los REAL GAPS identificados en la auditoría de implementación **no son preguntas de diseño**. Son brechas entre CURRENT y TARGET ya definido. El TARGET está congelado y completo.

---

## VERSION

`GEI_TARGET_UX_FREEZE_V1.0` — 2026-10-22 — Baseline SHA: `ebba0b8`  
**Supersedes:** `GEI_FRONTEND_TARGET_BLUEPRINT_V1.md` (now reference only), `GEI_FINAL_FRONTEND_FREEZE_V1.md` (now CURRENT baseline only)