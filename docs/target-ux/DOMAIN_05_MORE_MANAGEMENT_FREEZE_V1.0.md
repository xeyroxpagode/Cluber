# Domain 05 — More + Management Freeze V1.0

**Authority:** FROZEN — Part of GEI_TARGET_UX_FREEZE_V1.0  
**Date:** 2026-10-22  
**Routes:** R06 `/search`, R07 `/notifications`, R08 `/more/profile`, R27 `/management`, R28 `/management/structure`, R29 `/management/teams/:id`, R30 `/management/people`, R31 `/management/people/new`, R32 `/management/people/:id`, R33 `/management/competitions`, R34 `/management/competitions/:id`, R35 `/reports`, R36 `/reports/attendance`, R37 `/reports/performance`, R38 `/audit`  
**Archetypes:** A6 Entity Detail, A7 Management List, A8 Admin Form, A9 Report, A10 Timeline/History  
**Source:** `GEI_FRONTEND_TARGET_BLUEPRINT_V1.md` §10.A6–A10, §11 R06–R08, R27–R38, `GEI_IA_SIMPLICITY_RESEARCH_V1.md` §7.7–7.10

---

## FROZEN SPECIFICATION

### 5.1 More Hub (R08 `/more` → R08 `/more/profile`)

#### Mental Model
**¿Qué necesito que no es uso diario? — Hub de navegación no-diaria + Perfil.**

#### More Hub Destinations (Frozen)
| Actor | Destinations (in order) |
|-------|-------------------------|
| **PLAYER/CAPTAIN/COACH** | Mi perfil, Informes, Competiciones, Jornadas, Cerrar sesión |
| **SUBCOMMITTEE** | Mi perfil, Informes, Competiciones, Jornadas, Cerrar sesión |
| **ADMIN** | Mi perfil, Administración, Auditoría, Cerrar sesión |
| **GUARDIAN** | Mi perfil (con Personas a cargo), Cerrar sesión |

**Reglas:**
- **Nada diario en Más** — Inicio/Calendario/Equipos/Comunicación son tabs diarios
- **Nada admin en tabs diarios** — Administración solo en Más
- **Jornadas accesible** desde Más para sport/official (aunque `state.jornadas.length === 0` → `/jornadas/new`)

#### Cross-Highlight
Más activo en `/management/*`, `/reports/*`, `/audit`, `/more/*`

---

### 5.2 Profile (R08 `/more/profile`) — Archetype A6 Entity Detail

#### Mental Model
**Ficha de identidad + acceso + pertenencia + seguridad + Personas a cargo (si guardian).**

#### Sections (Frozen Order)
```
1. IDENTIDAD — Quién soy / a quién veo (selector Viendo a X si guardian multi-menor)
2. PERTENENCIA — Membership vigente con período (desde memberships[])
3. ROLES Y ALCANCE — Todos RoleAssignment vigentes resueltos (ej: "Entrenador · Sexta A", "Capitana · Primera A")
4. PERSONAS A CARGO — Solo si guardian (delegaciones activas)
5. ACCESO DE TERCEROS SOBRE MÍ — Solo si menor con relaciones activas (read-only)
6. CONTACTO — Editable (teléfono, email)
7. SEGURIDAD — Estado cuenta, credencial, última actividad, sesión actual, otras sesiones (cierre individual), cambio contraseña, cerrar sesión
8. PERFIL INCOMPLETO — Banner con qué falta + siguiente paso (si aplica)
```

#### Primary Action
- **Guardian multi-menor:** Selector `Viendo a X ▾` (Sheet en mobile)
- **Otros:** **Ninguna primaria** (pantalla de configuración) — 2 botones `secondary`: "Editar contacto", "Cambiar contraseña"

#### Field-Level PII (Product Truth §6 — Frozen)
| Field | Visible To | Editable By |
|-------|------------|-------------|
| Username | self + ADMIN | — |
| DNI / BirthDate | ADMIN only | ADMIN |
| Phone / Email | self, ADMIN, COACH/CAPTAIN (operational) | self, ADMIN |
| GuardianRelationship | guardian self + ADMIN | ADMIN |
| Eligibility status | COACH (scope) + SUBCOMMITTEE + ADMIN | — |
| Eligibility reason/source | SUBCOMMITTEE + ADMIN | — |
| Account status | self + ADMIN | ADMIN (disable), self (password) |
| Sessions | self + ADMIN | self (close own), ADMIN (close others) |

**Prohibido:** Perfil muestra DNI/birthDate en cualquier rol.  
**Prohibido:** Timeline genérico.  
**Prohibido:** Jerga interna ("Pertenencia vigente · 2026" literal → usar Membership real).

#### Account Activation / Recovery (Auth Model — Frozen)
- **Activación:** Código administrativo/setup (entregado por admin) — **NO auto-login tras activar**
- **Recuperación:** Administrativa (re-emisión setup code) — **NO self-service forgot-password**
- **Cambio contraseña:** Autenticado (current + new), `credentialVersion++`, invalida otras sesiones si se desea

---

### 5.3 Search (R06 `/search`) — Archetype A7 Management List

#### Mental Model
**Búsqueda simple: campo → resultados → contexto → abrir.**

#### Hierarchy
```
L0: Campo de búsqueda (autofocus) + atajo ⌘K/Ctrl+K global
L1: Resultados por relevancia (tipo en vocabulario usuario + contexto mínimo)
L2: Filtros por tipo (chips colapsables) — overflow
L3: Ficha destino (EventDetail, PersonDetail, TeamDetail, Announcement, Conversation)
```

#### Query in URL (Frozen — Mandatory)
- `useSearchParams` **obligatorio** — Back preserva búsqueda
- Deep link autosuficiente: `/search?q=lucia&type=person`

#### Scope
- Filtrado por `allowedActions` — usuario solo ve lo que tiene autoridad
- Tipos: Partido, Entrenamiento, Persona, Equipo, Comunicado, Conversación

---

### 5.4 Notifications (R07 `/notifications`) — Archetype A10 + A1

#### Mental Model
**Feed accionable: qué cambió + qué hacer + origen.**

#### Hierarchy
```
L0: No-leídos accionables primero (sin badges masivos)
L1: Tipo de aviso (§22) nombra cada fila (hoy: visualmente idénticos — gap)
L2: Detalle origen (EventDetail, Announcement, Conversation) — tap fila
L3: Marcar leída (inline) / Marcar todas (header)
```

#### Primary Action
**Tap fila** (correcto para feed)

#### Notification Types (§22 — Frozen, 8 Types)
| Type | Trigger | Title Template | Audience |
|------|---------|----------------|----------|
| `ANNOUNCEMENT_PUBLISHED` | Publicar comunicado | "Nuevo comunicado: {title}" | `publishedAudience` |
| `SELECTION_PUBLISHED` | Publicar convocatoria | "Convocatoria publicada: {event}" | Target team + staff + availability responders |
| `EVENT_CHANGED` / `EVENT_RESCHEDULED` | Cambio material evento | "{event}: cambio de horario/lugar" | `oldTargets ∪ newTargets ∪ publishedSelection ∪ availability ∪ staff` |
| `EVENT_POSTPONED` | Postergar evento | "{event}: postergado" | Same as EVENT_CHANGED |
| `EVENT_CANCELLED` | Cancelar evento | "{event}: cancelado" | Same as EVENT_CHANGED |
| `EVENT_RESTORED` | Restaurar evento | "{event}: reprogramado" | Same as EVENT_CHANGED |
| `MESSAGE_RECEIVED` | Nuevo mensaje en conversación | "Nuevo mensaje en {conversation}" | Participants (excluye autor) |
| `RECORD_FINALIZED` | Finalizar resultado | "Resultado final: {event} {score}" | Target team + staff |

**Key Rules (Frozen):**
- `origin_event_id` + `recipient` + `type` = **clave lógica única** (evita duplicados)
- `occurredAt` real (ISO) — **nunca** "Hace 1 hora" hardcodeado
- Agrupación por tipo en feed con icono
- **Messages NO crean Notifications globales** (solo MESSAGE_RECEIVED en feed)

---

### 5.5 Management Hub (R27 `/management`) — Archetype A7-hub

#### Mental Model
**Zona no-diaria con 3 caminos: Organización, Competencia, Integridad.**

#### Structure (Frozen)
```
1. ORGANIZACIÓN → Estructura (/management/structure), Equipos (/management/teams/:id), Personas (/management/people)
2. COMPETENCIA → Competencias (/management/competitions)
3. INTEGRIDAD → Informes (/reports), Auditoría (/audit)
```

#### Primary: **Ninguna** (hub navegacional — correcto)

#### Gating (Frozen)
- **COACH:** "Sección no disponible" — **breadcrumb NO debe mostrar "Gestión" antes de negar** (actual gap: breadcrumb ya dice "Gestión")
- **Pantalla denegada DEBE tener h1** (actual gap: no tiene)
- **SUBCOMMITTEE:** Acceso a Competencias ✓, Eligibility ✓ — **NO Administración** (Product Truth §5)
- **ADMIN:** Acceso completo

---

### 5.6 Structure (R28 `/management/structure`) — Archetype A7 + A8

#### Tabs (Frozen — 4, preserve state)
```
1. Temporada
2. División
3. Línea
4. Sede
```

#### Hierarchy per Tab
```
L0: Tab + conteo + "Crear {tab}" (contextual, header, sticky en mobile)
L1: Filas mínimas: nombre + estado textual (Activo/Archivado) + vigencia
L2: Uso en Eventos (conteo), dependencias
L3: Historial vía Auditoría (link)
L4: IDs y reglas §11 escondidos
```

#### Primary per Tab
**Crear [elemento del tab]** (contextual, defaults + pickers)

#### Actions per Row
- Editar metadata (nombre, fechas)
- **Archivar/Activar con ConfirmDialog** (explica efectos: "Tiene dependencias activas. No se puede archivar.")
- Abrir TeamAdmin (desde fila Equipo en tab Línea)

#### Team Creation (Frozen — M-10)
- Alta por `(seasonId, divisionId, lineId)` + validación `unique(season, division, line)`
- Estado inicial `DRAFT` → activar
- **Identidad Team inmutable** — rename División/Línea **NO muta** Team (P0-1)
- **Nueva identidad = nuevo Team**

#### Venue (Frozen — M-13, P0-6)
- `Venue` = `{ name, address, fieldLabel, archivedAt }`
- **Rename metadata (A):** `renameVenueMetadata` — no propaga, no revision++, no notificación
- **Cambio sede en Evento (B):** `changeEventVenue` — revision++, notificación, dirección derivada
- **EventDetail muestra dirección real** (address) o "Sin dirección" — **elimina literal "Alvear 1240 · Ituzaingó"**

#### Season (Frozen)
- `Season` = `{ name, startsOn, endsOn|null, archivedAt }`
- **NO estado "Activo" inventado** — solo `archivedAt` (actual gap: badge "Activo" inventado)

#### Restore Archived (Frozen — Missing in current)
- **Restore** de archivados visible en cada tab (overflow)

---

### 5.7 Team Admin (R29 `/management/teams/:id`) — Archetype A6 Entity Detail

#### Mental Model
**Reviso caso puntual → ajuste mínimo con confirm que explica efectos → estado + rastro.**

#### Hierarchy
```
L0: Identidad inmutable (Season + División + Línea + Sede) + Estado (DRAFT/ACTIVE/ARCHIVED)
L1: ACCIÓN PRIMARIA CONTEXTUAL: Archivar / Activar (con ConfirmDialog de consecuencias)
L2: Conteo operativo (jugadores, cuerpo técnico, eventos)
L3: Asignaciones vigentes (RoleAssignment + TeamAssignment con vigencia)
L4: IDs y ciclo escondidos
```

#### Primary Action
**Archivar / Activar** — **ConfirmDialog obligatorio** (explica: "Archivar desactiva el equipo. Los eventos futuros se cancelarán. Las asignaciones se finalizarán.")
- **Actual gap:** Botón `secondary` sin modal

#### Dead End Prevention (Frozen)
- Equipo `ARCHIVED` muestra **"Activar equipo"** (no "Archivar" deshabilitado)
- Vuelta atrás siempre posible

#### ADMIN ≠ Superusuario Deportivo (Frozen)
- **NO** administra convocatoria/asistencia/resultado de ningún equipo
- Ve documento y birthDate porque son datos que administra

---

### 5.8 People Management (R30 `/management/people`, R31 `/management/people/new`, R32 `/management/people/:id`)

#### 5.8.1 People List (R30) — Archetype A7 Management List

**Hierarchy:**
```
L0: Buscador fijo + filtros (chips: rol, equipo, estado, elegibilidad) → Filas mínimas
L1: Fila: nombre + estado/alcance en texto + próxima cita o conteo
L2: PersonAdminDetail (tap)
```

**Primary:** **Crear persona** (contextual al tab/filtro)

**Row Grammar:** `nombre — estado/alcance — próxima cita o conteo` (sin KPIs)

**Field-Level PII en Lista (Frozen):**
- **PII FUERA de lista** — solo nombre + estado/alcance
- **Guardian NO aparece como "Jugadora / Club"** — gap actual: muestra "MF Marcela Fernández / Club / Jugadora / Activo" siendo guardian sin RoleAssignment

**Filters (Frozen):**
- Reset visible
- Persistencia en URL (`useSearchParams`)
- Fallback mobile: no pierde columnas bajo 768px

#### 5.8.2 Create Person (R31) — Archetype A8 Admin Form

**Hierarchy:**
```
SITUACIÓN (qué/objeto + alcance) → ACCIÓN sticky (Crear persona) → Secciones → Impact Preview → Rastro
```

**Sections (Frozen Order — §17 exact):**
1. Identidad: Nombre, Apellido, DNI, Fecha nacimiento
2. Contacto: Teléfono, Email
3. Membresía: Membership (vigencia) — **OBLIGATORIO paso** (actual gap: no existe)
4. Cuenta: Username (generado/editable), **Generar código de activación** (real, muta estado)
5. Equipo: TeamAssignment (opcional, dentro de Membership vigente)
6. Rol: RoleAssignment (scope TEAM/EVENT, opcional)

**Rules (Frozen):**
- **Crear Persona ≠ Crear Cuenta** — separado, código activación real
- **NO defaults que cambian autoridad:** `eligibility: "ELIGIBLE"` y `role: "PLAYER"` por defecto **PROHIBIDO** (actual gap: toda persona nace con rol deportivo)
- **Helper text:** "Crear una persona no asigna automáticamente una cuenta, un equipo ni permisos"
- **Generar código de activación** muta estado + escribe audit (actual: escribe audit sin mutar)

#### 5.8.3 Person Admin Detail (R32) — Archetype A6 + A8

**Hierarchy:**
```
L0: Identidad + Contacto (read-only) + Estado cuenta
L1: ACCIÓN PRIMARIA POR SECCIÓN (no 6 acciones mismo peso)
L2: Secciones colapsables:
    - Pertenencia y Equipo (Membership + TeamAssignment con vigencia)
    - Roles y Alcance (RoleAssignment vigentes resueltos)
    - Elegibilidad (Constraints con scope/source/reason/validity) — SUBCOMMITTEE+ADMIN only
    - Relaciones de Guardián (GuardianRelationship) — **actual gap: no existe**
    - Auditoría (historial cambios con before/after + link a objeto)
L3: Acciones destructivas (Deshabilitar cuenta, Finalizar pertenencia) — variant="danger" + ConfirmDialog + motivo
L4: IDs + reglas técnicas
```

**Primary Actions per Section (Frozen):**
| Section | Primary Action |
|---------|----------------|
| Pertenencia | Mover de equipo / Finalizar pertenencia |
| Roles | Asignar rol / Finalizar rol |
| Elegibilidad | Crear constraint / Finalizar constraint |
| Guardián | Crear relación / Finalizar relación |
| Cuenta | Cambiar contraseña / Deshabilitar (danger) |

**Rules (Frozen):**
- **Identidad read-only** → **PERO** debe haber recuperación de `PLAYER_PROFILE_INCOMPLETE` (campos faltantes: DNI + birthDate) — **requiere decisión Product Truth §6: ¿puede jugadora cargar su propio DNI?**
- **Selects NO prellenados con valor actual** en operaciones de autoridad (actual gap: "Equipo de destino = actual", "Rol = primera opción")
- **variant="danger" OBLIGATORIO** para Deshabilitar cuenta, Finalizar pertenencia
- **ConfirmDialog + motivo escrito** para destructivas
- **Historial visible** con before/after + link a objeto relacionado
- **SUBCOMMITTEE** tiene acceso a sección Elegibilidad (Product Truth §5) — **actual gap: recibe Restricted**

---

### 5.9 Competitions (R33 `/management/competitions`, R34 `/management/competitions/:id`)

#### 5.9.1 Competitions List (R33) — Archetype A7

**Hierarchy:**
```
L0: Buscador + filtros + "Crear competencia" (primary)
L1: Filas: nombre + organizador + estado + scope (TEAM/LINE)
L2: CompetitionDetail (tap)
```

**Empty State:** "Sin competencias creadas" + "Crear competencia" (actual: Surface vacía sin texto)

#### 5.9.2 Competition Detail (R34) — Archetype A6 + A8

**Hierarchy:**
```
L0: Nombre + organizador + estado + scope (TEAM/LINE resuelto con División+Temporada)
L1: ACCIONES DE LIFECYCLE (3 variantes distintas PROHIBIDAS — una primaria por estado)
L2: Inscripciones — filas con identidad correcta (Equipo Sexta A vs Línea A de Sexta)
L3: Crear inscripción (primary contextual)
```

**CompetitionEntry Scope (Frozen — M-12, PG-04):**
- **Entry TEAM:** `teamId` + `seasonId` derivado
- **Entry LINE:** `lineId` + `seasonId` derivado
- **VALIDACIÓN:** `Match Team.season = Jornada.season = CompetitionEntry.seasonId` (§16)
- **ERROR:** `422 COMPETITION_SCOPE_MISMATCH` con copy explicativo
- **Actual gap:** "Línea A · 2026" sin división ni temporada (4 divisiones en dataset)

**Lifecycle Actions (Frozen):**
- `primary`: Activar / Cerrar / Finalizar (una por estado)
- `secondary`: Editar metadata
- `ghost`: Archivar
- **Cerrar competencia:** Deshabilitado **con razón visible** ✓ ("Para cerrar la competencia deben finalizar todas sus inscripciones activas.")
- **Finalizar inscripción:** Modal de consecuencias ✓ ("La inscripción no podrá usarse en nuevos partidos…")

---

### 5.10 Reports (R35 `/reports`, R36 `/reports/attendance`, R37 `/reports/performance`) — Archetype A9 Report

#### Mental Model
**Tabla de lectura para decidir, no dashboard. Acciones viven en origen (Calendario/Equipos/Comunicación).**

#### Hub (R35) — COMPLETE (Frozen)
- 2 filas con copy descriptivo exacto
- Primary: ninguna ✓
- Roles: oculto sin `report` ✓

#### Attendance Report (R36) — Archetype A9

**Hierarchy:**
```
L0: Filtros con defaults (Mi equipo + Toda la temporada) ✓
L1: Tabla: fila dato + link a origen (EventDetail/PersonDetail) para actuar
L2: "% PRESENCIA" — **0% donde no hay dato ≠ "sin datos"** (actual gap: número contradice nota)
L3: Pie: "Sin registros no se interpreta como cero actividad histórica" ✓
```

**Responsive:**
- Mobile: Filtros colapsables, scroll horizontal controlado
- Desktop: Barra filtros + tabla ordenable + sticky header
- **Tablas: `<th>` semántico OBLIGATORIO** (actual gap: 0 `<th>`)

#### Performance Report (R37) — Archetype A9

**Same as Attendance +** link a Jornada/Partido de origen (Blueprint A9 lo exige)

**State:** p95 <3s; vacío ≠ cero ≠ error

---

### 5.11 Audit (R38 `/audit`) — Archetype A10 Timeline/History

#### Mental Model
**Registro de verdad append-only: qué cambió, quién, cuándo.**

#### Hierarchy
```
L0: Filtros (actor/recurso/acción/fecha, default 30 días)
L1: Lista cronológica con antes/después resumido → link a origen
L2: Detalle audit entry
```

#### Primary: **Ninguna** (lectura)

#### Audit Entry (Frozen — Must Render)
```
fecha — actor — acción en texto — recurso (link) — before/after — motivo — source
```
- **before/after OBLIGATORIO** (Blueprint A10)
- **Link al objeto relacionado** (recurso no es texto plano)
- **Source** visible (UI / API / CLI / System)
- **Filtro fecha:** input type="date" real (no 3 literales hardcodeados)
- **Fechas reales** (clock real) — no "02 oct 2026 · Ahora" congelado
- **Inmutable / Read-only** — solo ADMIN

---

### 5.12 Responsive Rules (Frozen — All Management)

| Regime | Nav | Layout |
|--------|-----|--------|
| **Compact** | BottomNav (Más = hub primary) | 1 columna, sheets full-screen para create/edit, tablas → row lists |
| **Medium** | BottomNav o Rail | 1-2 columnas, sheets laterales, tablas completas |
| **Wide** | Sidebar 240px | **Reports/Management/Audit = direct destinations** (no bajo Más), columna central + paneles laterales, tablas con sticky header |

**Wide Specific:** `/management/*`, `/reports/*`, `/audit` son **destinos directos en Sidebar** — no bajo Más.

---

### 5.13 Capabilities Mapped

| Capability | Screens |
|------------|---------|
| C01 Identity & Access | R08, R30, R31, R32 |
| C02 Club Structure | R28, R29, R33, R34 |
| C03 People & Assignments | R30, R31, R32 |
| C04 Authority & Scope | Transversal (gating) |
| C05 Competition Context | R33, R34 |
| C14 History / Audit / Provenance | R32, R38 |
| C15 Search & Reporting | R06, R30, R33, R35, R36, R37, R38 |

---

### Explicit KEEP from Blueprint
1. More primarily Compact/Medium navigation; Wide: direct destinations
2. Profile ≠ Person Admin (separate routes, separate archetypes)
3. Operational Person ≠ Person Admin
4. Operational Team ≠ Team Admin
5. Create Person ≠ Create Account
6. Person Admin: Compact = section hub, Wide = tabs
7. Team Admin: same responsive rule
8. Structure: Season / Division / Line / Venue
9. Competition simplified (create/edit/archive/consult only)
10. Reports read-only, actions in origin
11. Attendance report per-person with "Sin registrar ≠ Ausente"
12. Audit immutable/read-only with before/after + link + source
13. Real clock, no frozen dates
14. Guardian: Personas a cargo in Profile, selector Viendo a X

---

### Explicit PROHIBITED
- Métricas/KPIs en Management hub
- "Equipo" en People Management = "Club" (significado ambiguo)
- Guardian listada como "Jugadora / Club" (falso)
- Temporada con badge "Activo" inventado
- CompetitionEntry fusionando LINE + TEAM scope
- Person Admin sin acción primaria por sección (6 acciones mismo peso)
- Deshabilitar cuenta sin `variant="danger"` + ConfirmDialog + motivo
- Identidad read-only sin recuperación `PLAYER_PROFILE_INCOMPLETE`
- Selects prellenados con valor actual en ops de autoridad
- Auditoría sin before/after, sin link, sin source, fechas congeladas
- Reports sin `<th>` semántico, `% PRESENCIA` = 0% donde no hay dato
- Filtros sin reset, sin URL, sin fallback mobile
- `/jornadas/new` inalcanzable desde Más

---

## VERSION
`DOMAIN_05_MORE_MANAGEMENT_FREEZE_V1.0` — 2026-10-22 — Part of `GEI_TARGET_UX_FREEZE_V1.0`