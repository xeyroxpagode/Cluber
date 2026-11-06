# Domain 03 — Teams Freeze V1.0

**Authority:** FROZEN — Part of GEI_TARGET_UX_FREEZE_V1.0  
**Date:** 2026-10-22  
**Routes:** R09 `/teams`, R10 `/teams/:teamId`, R11 `/people/:personId`  
**Archetypes:** A6 Entity Detail, A3 Roster Action, A7 Management List  
**Source:** `GEI_FRONTEND_TARGET_BLUEPRINT_V1.md` §10.A6, §10.A3, §10.A7, §11 R09, R10, R11, `GEI_IA_SIMPLICITY_RESEARCH_V1.md` §7.6

---

## FROZEN SPECIFICATION

### 3.1 Teams List (R09 `/teams`) — Archetype A7 Management List

#### Mental Model
**Índice de mis equipos — encontrar Mi equipo y abrirlo.**

#### Hierarchy
```
L0: Título "Equipos" + descripción contextual
L1: Lista con "Mi equipo" primero (posición, no badge)
L2: Próximo Partido/Entrenamiento por equipo (subordinado)
L3: TeamDetail (tap fila)
L4: Estructura administrativa escondida
```

#### Primary Action
**Abrir Mi equipo** (tap en fila — la fila ES la acción)

#### Row Grammar
```
nombre equipo — próximo evento (hora/lugar) — estado textual si aplica
```
- **Mínimo:** buscador + filtros (chips) — **actual: sin buscador ni filtros (gap)**
- **Empty state:** "No tenés equipos asignados" + acción contextual

#### Actor Variants
| Actor | Rows Visible | "Mi equipo" Position |
|-------|--------------|----------------------|
| PLAYER/CAPTAIN/COACH | Own teams (TeamAssignment vigente) | First by position |
| SUBCOMMITTEE/ADMIN | All teams (read-only) | Alphabetic, no "Mi equipo" priority |
| GUARDIAN | Minor's teams (delegación) | First by position |

**Guardian con 0 equipos:** Surface vacía **con explicación** ("No hay equipos para la persona que estás viendo") — **nunca Surface vacía sin copy**

#### Responsive
| Regime | Layout |
|--------|--------|
| Compact | Lista vertical, bottom nav |
| Medium | Lista vertical, bottom nav o rail |
| Wide | Grid simple, sidebar, misma jerarquía |

---

### 3.2 Team Detail (R10 `/teams/:teamId`) — Archetype A6 Entity Detail + A3 Roster Action

#### Mental Model
**Ficha de contacto con contexto: quiénes somos + 1 acción + resto bajo demanda.**

#### Default Tab = **Eventos** (no Plantilla)

#### Tabs (Frozen — 3, only navigate)
```
1. Eventos (default) — Próximos + Resultados recientes
2. Personas — Plantilla + Cuerpo técnico
3. Resultados — Historial de partidos finalizados
```

#### Hierarchy (Eventos tab - default)
```
L0: Próximo evento priorizado + ¿Vas? inline (si actionable)
L1: Conteo live disponibilidad/convocatoria/asistencia/resultado
L2: Lista eventos (próximos → recientes)
L3: EventDetail (tap)
L4: Competition/Eligibility escondidos
```

#### Primary Action
**¿Vas? del próximo evento actionable** (inline, sticky header mobile / header desktop)  
- **Solo un próximo evento priorizado** — no lista de "próximos" compitiendo
- Si no hay evento actionable: siguiente evento visible sin acción primaria

#### Inline Availability (Next Event Only)
- **Solo para próximo evento actionable** (no para todos)
- One-tap VOY/QUIZÁS/NO VOY + conteo live
- **COACH NO recibe fake self-VAS** — coach ve roster sin tarjeta de respuesta propia

#### Personas Tab (Plantilla → Cuerpo técnico)
- **Cuerpo técnico ≠ Plantel** — separados visual y semánticamente
- **Person operational ≠ Person Admin** — ficha operativa muestra: nombre, rol operativo, contacto (si necesidad operativa), próximo ¿Vas?
- **Field-level PII** (Product Truth §6):
  - COACH ve teléfono/email de sus jugadoras (necesidad operativa)
  - COACH **NO** ve DNI ni fecha de nacimiento
  - COACH **NO** ve conversaciones privadas ajenas

#### Resultados Tab
- Lista de partidos `COMPLETED`/`FINAL` con marcador
- Navega a EventDetail (modo resultado)
- Read-only para todos salvo COACH (corrección en EventDetail)

#### Canonical Navigation (Frozen)
| From | To | Trigger |
|------|-----|---------|
| TeamDetail → EventDetail | `/events/:eventId` | Tap evento en lista |
| TeamDetail → PersonDetail | `/people/:personId` | Tap persona en Plantilla/Cuerpo técnico |
| TeamDetail → Conversation | `/conversations/:id` | Tap "Mensajes" en EventDetail rail |
| EventDetail → TeamDetail | `/teams/:teamId` | Back preserva origen (tab Eventos, scroll) |

---

### 3.3 Person Detail — Operational (R11 `/people/:personId`) — Archetype A6 Entity Detail

#### Mental Model
**Ficha de contacto: quién es + 1 acción + resto bajo demanda.**

#### Hierarchy
```
L0: Identidad (nombre + rol operativo + equipo) + estado terminal si aplica
L1: 1 ACCIÓN CONTEXTUAL ÚNICA (Contactar / Ver su próximo ¿Vas?)
L2: Asistencia / Convocatorias recientes (colapsable)
L3: Equipo / Eventos (colapsable)
L4: Admin / Auditoría (escondido, tras acción/contexto)
```

#### Primary Action (Contextual — exactly one)
| Viewer | Subject | Primary Action |
|--------|---------|----------------|
| COACH | Own player | Contactar / Ver ¿Vas? próximo evento |
| CAPTAIN | Teammate | Contactar / Ver ¿Vas? |
| PLAYER | Teammate | Contactar (si necesidad operativa) |
| ADMIN | Any | **None** — usa `/management/people/:id` (PersonAdminDetail) |
| GUARDIAN | Minor | Responder ¿Vas? (si delegación) |

**Prohibido:** Ficha read-only sin ninguna acción (actual gap)

#### Field-Level PII (Product Truth §6 — Frozen)
| Field | COACH (own team) | CAPTAIN | PLAYER | ADMIN | GUARDIAN (delegated) |
|-------|------------------|---------|--------|-------|----------------------|
| Name | ✓ | ✓ | ✓ | ✓ | ✓ |
| Role/Team | ✓ | ✓ | ✓ | ✓ | ✓ |
| Phone/Email | ✓ (operational) | ✗ | ✗ | ✓ | ✓ (if `canViewChildInfo`) |
| DNI/Birth | ✗ | ✗ | ✗ | ✓ | ✗ |
| Eligibility status | ✓ (scope) | ✗ | ✗ | ✓ | ✗ |
| Eligibility reason/source | ✗ | ✗ | ✗ | ✓ (SUBCOMMITTEE+ADMIN) | ✗ |

#### Empty State / Dead End Prevention
- **Nunca nodo muerto:** Back contextual a TeamDetail ("Volver a Sexta A")
- Breadcrumbs: "Hockey / Sexta A / Lucía Fernández"

---

### 3.4 Responsive Behavior (All Teams Screens)

| Regime | Teams List | Team Detail | Person Detail |
|--------|------------|-------------|---------------|
| Compact | Lista vertical | Tabs fijas, sheet convocados | Ficha vertical |
| Medium | Lista/grid | Tabs + panel | Tarjeta + panel contexto |
| Wide | Grid simple | Tabs + panel lateral (Inspector) | Tarjeta + panel lateral |

---

### 3.5 Capabilities Mapped

| Capability | Screens |
|------------|---------|
| C02 Club Structure | R09, R10 |
| C03 People & Assignments | R10, R11 |
| C05 Competition Context | R10 (hidden tabs) |
| C09 Participation Lifecycle | R10 (inline ¿Vas?) |

---

### Explicit KEEP from Blueprint
1. Teams List: "Mi equipo" first by position
2. Team Detail default = Eventos tab
3. One prioritized next event with inline ¿Vas?
4. Inline own Availability only for next actionable event
5. Coach does NOT receive fake self-VAS
6. Cuerpo técnico ≠ Plantel (separate sections)
7. Person operational ≠ Person Admin
8. Field-level PII enforcement
9. Canonical Event/Person/Conversation navigation
10. Tabs internal (Equipo/Eventos/Resultados) preserve state, only navigate

---

### Explicit PROHIBITED
- Team Detail default = Plantilla (debe ser Eventos)
- Múltiples "próximos eventos" compitiendo en L0
- Coach viendo su propio ¿Vas? (fake self-VAS)
- Plantel y Cuerpo técnico mezclados
- Ficha operativa mostrando DNI/birth
- Ficha operativa sin acción contextual (dead end)
- Person Admin accesible desde TeamDetail (va en Management)

---

## VERSION
`DOMAIN_03_TEAMS_FREEZE_V1.0` — 2026-10-22 — Part of `GEI_TARGET_UX_FREEZE_V1.0`