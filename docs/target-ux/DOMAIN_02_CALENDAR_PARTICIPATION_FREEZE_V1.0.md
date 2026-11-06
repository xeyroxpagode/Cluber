# Domain 02 — Calendar + Participation Freeze V1.0

**Authority:** FROZEN — Part of GEI_TARGET_UX_FREEZE_V1.0  
**Date:** 2026-10-22  
**Routes:** R05 `/calendar`, R12 `/events/new`, R13 `/events/:eventId`, R14 `/events/:eventId/edit`, R15 `/events/:eventId/availability`, R16 `/events/:eventId/selection`, R17 `/events/:eventId/attendance`, R18 `/events/:eventId/match-record`, R19 `/jornadas/new`, R20 `/jornadas/:jornadaId`  
**Archetypes:** A2 Time Browser, A3 Roster Action, A4 Event Detail, A8 Admin Form  
**Source:** `GEI_FRONTEND_TARGET_BLUEPRINT_V1.md` §10.A2, §10.A3, §10.A4, §10.A8, §11 R05, R12–R20, `GEI_IA_SIMPLICITY_RESEARCH_V1.md` §7.2, §7.3, §7.4

---

## FROZEN SPECIFICATION

### 2.1 Calendar (R05 `/calendar`) — Archetype A2 Time Browser

#### Mental Model
**Calendario real (mes/agenda), no planilla con fechas.**

#### Hierarchy
```
L0: Controles tiempo (mes/agenda, navegación, filtros) + pendientes ¿Vas? marcados
L1: Grilla/lista con hora — título — lugar — punto pendiente
L2: SHEET mini-detalle (selección) → ROUTE EventDetail
L3: EventDetail
L4: Serie/admin escondidos
```

#### Responsive Defaults (FROZEN)
| Regime | Default View | Month Behavior |
|--------|--------------|----------------|
| **Compact** | Agenda (lista) | Mes colapsable, day selection → EventRows |
| **Medium** | Semana | Grid + selection |
| **Wide** | Mes | Full grid, panel detalle lateral (Inspector) |

#### Primary Action
**¿Vas? desde selección** (SHEET mini-detalle → responde inline)  
**NOTA:** Calendar NO tiene acción primaria sticky — la acción es responder ¿Vas? desde el evento seleccionado.

#### Row Grammar
```
[punto pendiente] hora — título — lugar
```
- Punto pendiente = indicador visual sutil (no badge masivo)
- Estados terminales (CANCELLED/POSTPONED/COMPLETED) en texto, nunca solo color

#### States
- **Hoy real** (clock real, no frozen)
- **Pendientes ¿Vas?** destacados sin badges masivos
- **CANCELLED/POSTPONED** renderizan con composición propia (StateBanner) — no como evento vivo
- **ABANDONED** inalcanzable en V1 (gap conocido)

#### Motion
**NONE** (Blueprint §9: "Motion: NONE" para A2)

#### Cross-Highlight
Calendario activo en `/events/*` y `/jornadas/*`

---

### 2.2 Event Detail (R13 `/events/:eventId`) — Archetype A4 Event Detail

#### Mental Model
**La página del partido: responder o ver qué pasó, luego contexto.**

#### Hierarchy
```
L0: ¿Vas?/Resultado → Cuándo/Dónde
L1: Rail Participación (¿Vas? → Convocados → Asistencia → Resultado según lifecycle)
L2: Logística + Mensajes del evento
L3: Historial (revisiones, correcciones, audit)
L4: Serie/admin (scope dialog, impacto)
```

#### Primary Action (by lifecycle + role)
| Lifecycle + Role | Primary |
|------------------|---------|
| Pre-event + PLAYER/CAPTAIN/GUARDIAN | ¿Vas? inline (sticky header mobile / header desktop) |
| Pre-event + COACH | Convocatoria (overflow) / ¿Vas? inline |
| Post-event + COACH | Ver resultado / Finalizar (overflow) |
| Post-event + PLAYER | Ver resultado |
| ADMIN/SUBCOMMITTEE | None (read-only) |

#### Rail Participación (4 RowLinks con estado)
```
1. Disponibilidad — [estado] — [conteo] → /availability
2. Convocados — [estado] — [conteo] → /selection
3. Asistencia — [estado] — [conteo] → /attendance
4. Resultado — [estado] — [marcador] → /match-record
```
- **Cada row = acción navega** (chevron)
- Estado en texto: "Borrador / 12 seleccionadas", "Abierta / 14 sin registrar", "Final / 3-1"

#### Responsive
| Regime | Layout |
|--------|--------|
| **Compact** | Cabecera con ¿Vas? sticky + Sheets para Convocados/Asistencia/Mensajes |
| **Medium** | Detalle + panel asistencia (Content Rail) |
| **Wide** | Detalle + Inspector (panel lateral 300-320px) cuando ancho interno lo permite |

#### State Gating (Authority)
- **COACH** ve badges de elegibilidad, alerta conflictos
- **PLAYER** NO ve alerta conflictos (P0-5)
- **ADMIN/SUBCOMMITTEE** read-only, sin ¿Vas?
- **GUARDIAN** puede responder por menor si delegación lo permite

#### Terminal States (CANCELLED/POSTPONED/COMPLETED/ABANDONED)
- **Composición propia** con StateBanner
- Explicación de consecuencia visible
- Historial a la vista
- **SIN ¿Vas? como acción primaria**

---

### 2.3 Event Create/Edit (R12 `/events/new`, R14 `/events/:eventId/edit`) — Archetype A8 Admin Form

#### Mental Model
**Trámite puntual con guía: qué + para quién → completar → confirmar consecuencias.**

#### Hierarchy
```
SITUACIÓN (qué/objeto + alcance) → ACCIÓN sticky (Guardar/Crear) → Secciones → Impact Preview → Rastro
```

#### Primary
**Guardar/Crear sticky** (bottom mobile / header desktop)
- **Descartar** confirma si hay cambios (modal)

#### Sections (Frozen Order)
1. **Información general**: Tipo (Partido/Entrenamiento/Evento club), Título (solo Club Event), Equipo(s) target, Fecha/hora
2. **Fecha y lugar**: Sede, Hora reunión, Hora salida, Timezone
3. **Convocados** (conditional): Solo si tipo ≠ CLUB_EVENT
4. **Logística**: Punto encuentro, Transporte, Instrucciones llegada
5. **Serie** (si recurrente): ScopeDialog — "Solo este / Este y siguientes / Toda la serie"

#### ScopeDialog (FDPG-01 — Frozen)
- **Vocabulario usuario:** "Solo este evento" / "Este y los siguientes" / "Toda la serie"
- **Antes del Impact Preview definitivo**
- **Captura intención** — aplicar es backend command (Stage 5+)

#### Impact Preview (Frozen)
- Token de impacto + reconfirmación
- Explica quién se ve afectado (conteos reales, no fabricados)
- Modal con consecuencia + motivo si material

#### Validation
- Inline por campo, input preservado, foco al primer error
- `Enter` submitea (form wrapper obligatorio)
- Dirty state visible
- Stale version → bloquea hasta reconfirmar (modal)

#### Responsive
| Regime | Layout |
|--------|--------|
| **Compact** | 1 columna, acción sticky bottom, modal full-screen |
| **Medium/Wide** | Form + panel impacto lateral |

---

### 2.4 Participation Lifecycle — Archetype A3 Roster Action

**Shared grammar across Availability, Selection, Attendance, MatchRecord**

#### Mental Model
**Pasar lista en la cancha: nombre-ancla, gesto único, conteo vivo.**

#### Hierarchy (All 4 screens)
```
L0: Cabecera evento + estado planilla (OPEN/CLOSED, DRAFT/PUBLISHED, DRAFT/FINAL)
L1: ACCIÓN sticky (Responder/Publicar/Cerrar/Finalizar) + conteo live
L2: Filas (nombre — estado en texto — conflicto/motivo bajo fila)
L3: Detalle jugador, revisiones, historial (colapsado)
```

#### Primary Action Location
- **Mobile:** Sticky bottom
- **Desktop:** Header (sticky si estado lo cambia — ej: Abrir-para-corregir añade segunda sticky)

#### Row Grammar
```
nombre — estado en texto — (conflicto/motivo explicado en vocabulario usuario bajo la fila)
```

#### Spacing
- Filas **≥44px** (touch target roster)
- Conteo **separado y fijo** (no scroll)

#### States (by screen)

**Availability (R15):**
- `YES` / `MAYBE` / `NO` / `NO_RESPONSE` / `NEEDS_RECONFIRMATION` (derived)
- Stale aviso visible + reconfirmación one-tap
- **GUARDIAN** puede responder por menor si `canRespondAvailability`

**Selection (R16):**
- Draft (editable, autosave "Borrador guardado HH:MM") → Published (immutable revisions)
- **Publicar NO bloquea por conflicto** — avisa, explica en lenguaje usuario, registra revisión
- Conflict alert gated por `allowed.canViewEligibilityDetail` (COACH/SUBCOMMITTEE/ADMIN only)
- **Conflict Workspace** (P1-06): baseline vs borrador vs servidor lado a lado — **superficie dedicada**

**Attendance (R17):**
- `PRESENT` / `ABSENT` / `JUSTIFIED` / `UNRECORDED` (null)
- **UNRECORDED ≠ ABSENT** — planilla puede cerrar dejando sin registrar
- Cerrar/Abrir con modal que explica consecuencia + motivo escrito
- Corrección con motivo **conserva before/after** (P0-2)

**MatchRecord (R18):**
- `DRAFT` → `FINAL` (modal confirmación)
- `PLAYED` / `FORFEIT` / `ABANDONED` (status)
- Corregir post-FINAL = flujo distinto con motivo + historial con marcador anterior (P0-3)
- **Gate:** Solo editable si evento en estado que lo permite (no SCHEDULED — gap actual)

#### Responsive
| Regime | Layout |
|--------|--------|
| **Compact** | Lista full-width, toque grande, acción sticky bottom |
| **Medium** | Lista + panel (conflictos/revisiones/historial) |
| **Wide** | Lista + panel lateral (Inspector) |

#### Motion
- **Micro feedback por fila** (conteo live, guardado)
- **State transition** (draft→publicado, open→closed, DRAFT→FINAL)

---

### 2.5 EventSeries (Frozen Target — P1-04)

#### Scope
- `EventSeries` + `event_series_target_teams/persons` + `event_occurrence_overrides`
- Occurrences generadas como Events independientes (no duplican lifecycle)

#### Create/Edit
- Bloque de recurrencia en EventForm (RRULE simplificado: semanal, quincenal, mensual; hasta fecha / N ocurrencias)
- Límite 366 ocurrencias/command → `RECURRENCE_TOO_LARGE`
- `event_occurrence_overrides` altera una ocurrencia sin tocar las demás

#### Calendar Display
- Occurrences aparecen en Calendar como Events normales
- Edición de serie → ScopeDialog + Impact Preview

---

### 2.6 Jornada (R19 `/jornadas/new`, R20 `/jornadas/:jornadaId`)

#### Mental Model
**Agrupación atómica de partidos para gestión conjunta de sede/fecha.**

#### R19 Create
- Nombre, Fecha, Sede conjunta + checkboxes de Partidos hijos
- Primary: **Crear Jornada sticky**
- Validación: `Match Team.season = Jornada.season` (§16)

#### R20 Detail
- Estado, sede, Partidos hijos, Impact Preview conjunto
- Primary: **Guardar cambios sticky** + Impact Preview si material
- **Bulk sede:** Cambiar sede de la jornada → `coordination_revision++` por partido afectado + notificación
- **Add/Remove partidos** (V1): respetar "Match pertenece como máximo a una Jornada"
- Límite bulk 100 → `BULK_OPERATION_TOO_LARGE`

---

### 2.7 Capabilities Mapped

| Capability | Screens |
|------------|---------|
| C07 Event Operations | R12, R13, R14, R19, R20 |
| C08 Match Day / Jornada | R13, R18, R20 |
| C09 Participation Lifecycle | R13, R15, R16, R17 |
| C10 Change Management | R14, R20, R25 + Conflict Workspace |
| C11 Logistics | R12, R13, R14, R20 |
| C16 Operational Awareness | R05, R13 |

---

### Explicit KEEP from Blueprint
1. Agenda default Compact, Mes default Wide
2. Compact Month: day selection + EventRows; Wide Month: full grid
3. Selected Event: Compact → Detail; Wide → Inspector when internal width permits
4. Event Detail hub (L0 → Rail Participación → Logística → Mensajes → Historial)
5. Event Create/Edit workspace con ScopeDialog + Impact Preview
6. EventSeries scope + occurrences + overrides
7. Jornada atomic grouping + bulk sede
8. Availability: YES/MAYBE/NO + stale + derivados + autosave
9. Selection: draft/published immutable + publicar-con-conflicto + Conflict Workspace
10. Attendance: OPEN/CLOSED + UNRECORDED + motivo + corrección before/after
11. MatchRecord: DRAFT→FINAL + corrección con motivo + before/after
12. Real Clock (no frozen date)

---

### Explicit PROHIBITED
- Calendar sin acción ¿Vas? accesible desde selección
- Event Detail CANCELLED/POSTPONED renderizando como vivo
- ScopeDialog sin efecto (captura intención pero no aplica)
- Selection publicar bloqueando por conflicto (debe permitir + avisar)
- Attendance botones 36px (mínimo 44px)
- MatchRecord editable con evento SCHEDULED
- Jornada bulk sin `expectedVersion` + copy falso ("horario cambió" cuando fue sede)
- Reloj fijo / literales de seed en UI

---

## VERSION
`DOMAIN_02_CALENDAR_PARTICIPATION_FREEZE_V1.0` — 2026-10-22 — Part of `GEI_TARGET_UX_FREEZE_V1.0`