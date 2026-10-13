# GEI HOCKEY MANAGEMENT SYSTEM
## STATE TRANSITION MATRIX V1

**Etapa:** 6 — Diagramas de estados (E6-04)
**Estado:** COMPLETO
**Fecha:** 2026-10-07
**Rama:** `gei/e6-state-diagrams-freeze-v1`
**Baseline:** `01ee760388e27592d007c1c6f539e9204aefbf62`

---

# 1. PROPÓSITO

Registro completo y exhaustivo de todas las transiciones permitidas y prohibidas para cada máquina de estados admitida. Cada transición registra: TR-ID, SM-ID, objeto, estado origen, estado destino, evento/disparador, condición/guard, efecto funcional, actor/authority source, scope, estado del objeto requerido, REQ y AC de respaldo, UC y paso E5, rechazo correspondiente, si es reversible, si es terminal, observaciones.

**Notación UML:** `evento [condición] / efecto`
**Regla:** No crear acciones internas por decoración. Transiciones prohibidas se documentan en tabla separada, no como flechas en diagrama.

---

# 2. MATRIZ DE TRANSICIONES PERMITIDAS

## 2.1 SM-ACCOUNT-01 — Account

| TR-ID | SM-ID | Objeto | Origen | Destino | Evento/Disparador | Condición/Guard | Efecto Funcional | Actor/Authority | Scope | REQ/AC | UC/Paso E5 | Reversible | Terminal |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TR-001 | SM-ACCOUNT-01 | Account | `PENDING` | `ACTIVE` | Activar con código (`UC-IAM-04` paso 3) | Código vigente, un solo uso, ≤5 intentos fallidos, cuenta `PENDING` | Cuenta `ACTIVE`, código consumido, auditado, **sin crear sesión** | `ACT-UNAUTHENTICATED` (consume código emitido por Admin) | `SELF` | `REQ-IAM-003` AC 1,2,3,4 | `UC-IAM-04` paso 3 | No (activación única) | No |
| TR-002 | SM-ACCOUNT-01 | Account | `DISABLED` | `ACTIVE` | Reactivar con código nuevo (`UC-IAM-03/04`) | Código vigente nuevo, cuenta `DISABLED` | Cuenta `ACTIVE`, código consumido, credencial versionada, auditado, **sin crear sesión** | `ACT-UNAUTHENTICATED` (consume código emitido por Admin vía `UC-IAM-03`) | `SELF` | `REQ-IAM-003` AC 1,2,3,4; `REQ-IAM-002` | `UC-IAM-03` paso 4 → `UC-IAM-04` paso 3 | No (reactivación requiere código nuevo) | No |
| TR-003 | SM-ACCOUNT-01 | Account | `ACTIVE` | `DISABLED` | Deshabilitar cuenta (`UC-IAM-02` paso 4) | `RoleAssignment ADMIN` vigente, valla último admin (`LAST_ADMIN_REQUIRED`), cuenta objetivo existe | Cuenta `DISABLED`, `disabled_at` registrada, **sesiones revocadas inmediatas**, auditado | `ACT-ADMIN` | `CLUB` | `REQ-IAM-002` AC 1,2,3; `REQ-IAM-013` AC 1 | `UC-IAM-02` paso 4 | Sí (vía `TR-002` con código nuevo) | Relativo (reactivable) |
| TR-004 | SM-ACCOUNT-01 | Account | `ACTIVE` | `PENDING` (implícito) | Restablecer acceso admin (`UC-IAM-05` paso 4) | `RoleAssignment ADMIN` vigente `CLUB`, valla último admin, cuenta objetivo existe | Credencial `SETUP_REQUIRED`, versión incrementada, sesiones revocadas, código anterior invalidado, nuevo emitido, auditado | `ACT-ADMIN` | `CLUB` | `REQ-IAM-004` AC 1,2; `REQ-IAM-013`; `REQ-IAM-015` | `UC-IAM-05` paso 4 | Sí (vía `TR-001` con código nuevo) | No |

**Transiciones Prohibidas — Account**

| ID | Intento | Estado Actual | Transición Solicitada | Motivo Rechazo | Efecto | Authority Ref |
|---|---|---|---|---|---|---|
| PROH-001 | Iniciar sesión | `PENDING` | `PENDING →` sesión | Cuenta no activada | Sin sesión, sin revelar existencia | `REQ-IAM-001` AC 3 |
| PROH-002 | Iniciar sesión | `DISABLED` | `DISABLED →` sesión | Cuenta deshabilitada | Sin sesión, explicación motivo | `REQ-IAM-001` AC 3 |
| PROH-003 | Deshabilitar | `ACTIVE` | `ACTIVE → DISABLED` | Dejaría 0 admins `ACTIVE/CLUB` | Nada cambia (`LAST_ADMIN_REQUIRED`) | `REQ-IAM-013` |
| PROH-004 | Activar | `ACTIVE` | `ACTIVE → ACTIVE` (código) | Código solo para `PENDING`/`DISABLED` | Rechazo explicando estado | `REQ-IAM-003` AC 4.1 |
| PROH-005 | Cualquier autenticada | `PENDING`/`DISABLED` | — | Sin sesión válida | Acceso rechazado | `REQ-IAM-012`, Actor Boundary §6 |

---

## 2.2 SM-TEAM-01 — Team

| TR-ID | SM-ID | Objeto | Origen | Destino | Evento/Disparador | Condición/Guard | Efecto Funcional | Actor/Authority | Scope | REQ/AC | UC/Paso E5 | Reversible | Terminal |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TR-005 | SM-TEAM-01 | Team | (creación) | `DRAFT` | Registrar equipo (`UC-STR-09` paso 5) | `RoleAssignment ADMIN`, combinación única temporada+división+línea, temporada/división/línea existen | Equipo `DRAFT`, nombre derivado, combinación única validada | `ACT-ADMIN` | `CLUB` | `REQ-STR-004` AC 1,2,3,4; `REQ-STR-008` | `UC-STR-09` paso 5 | No | No |
| TR-006 | SM-TEAM-01 | Team | `DRAFT` | `ACTIVE` | Activar equipo (`UC-STR-11` paso 4) | `RoleAssignment ADMIN`, equipo `DRAFT` | Equipo `ACTIVE`, disponible para afiliaciones/eventos/inscripciones | `ACT-ADMIN` | `CLUB` | `REQ-STR-004` AC 1,2,3,4; PT §9 | `UC-STR-11` paso 4 | No (en V1) | No |
| TR-007 | SM-TEAM-01 | Team | `ACTIVE` | `ARCHIVED` | Archivar equipo (`UC-STR-12` paso 4) | `RoleAssignment ADMIN`, **sin dependencia activa** (valla `REQ-STR-006`) | Equipo `ARCHIVED`, historia conservada, eventos/inscripciones históricos | `ACT-ADMIN` | `CLUB` | `REQ-STR-004` AC 1,2,3,4; `REQ-STR-006` AC 1,2 | `UC-STR-12` paso 4 | **No en V1** (`DEF-STR-001/002` defer) | **Sí (V1)** |

**Transiciones Prohibidas — Team**

| ID | Intento | Estado Actual | Transición Solicitada | Motivo Rechazo | Efecto | Authority Ref |
|---|---|---|---|---|---|---|
| PROH-006 | Editar datos | `ARCHIVED` | `ARCHIVED → ACTIVE` (edición) | Equipo archivado no editable | Rechazo, estado actual | `UC-STR-10` alt 2.1 |
| PROH-007 | Activar | `ARCHIVED` | `ARCHIVED → ACTIVE` | Restore no autorizado en V1 | Rechazo | `DEF-STR-001/002`, PT §9 |
| PROH-008 | Archivar | `ACTIVE` | `ACTIVE → ARCHIVED` | Dependencia activa (eventos, afiliaciones, inscripciones) | Rechazo **nombrando la dependencia** | `REQ-STR-006`, `UC-STR-12` alt 2.1 |
| PROH-009 | Cambiar combinación | Cualquiera | Cambiar temporada/división/línea | Identidad inmutable | Rechazo | `REQ-STR-004`, `UC-STR-10` alt 2.2 |
| PROH-010 | Cualquier gestión | Cualquiera | Subcomisión intenta | Estructura no disponible para Subcomisión | Denegado con explicación | `REQ-STR-009` |

---

## 2.3 SM-DIVISION-01 — Division

| TR-ID | SM-ID | Objeto | Origen | Destino | Evento/Disparador | Condición/Guard | Efecto Funcional | Actor/Authority | Scope | REQ/AC | UC/Paso E5 | Reversible | Terminal |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TR-008 | SM-DIVISION-01 | Division | (creación) | `ACTIVE` | Registrar división (`UC-STR-03` paso 4) | `RoleAssignment ADMIN` | División `ACTIVE` (implícito), disponible para líneas | `ACT-ADMIN` | `CLUB` | `REQ-STR-002` AC 1,2,3 | `UC-STR-03` paso 4 | No | No |
| TR-009 | SM-DIVISION-01 | Division | `ACTIVE` | `ACTIVE` (rename) | Actualizar división (`UC-STR-04` paso 4) | `RoleAssignment ADMIN`, **sin equipos activos** | Nombre actualizado, referencias por identidad no reatribuidas | `ACT-ADMIN` | `CLUB` | `REQ-STR-002` AC 1,2,3; `REQ-PPL-014` AC 1 | `UC-STR-04` paso 4 | Sí (otro rename) | No |
| TR-010 | SM-DIVISION-01 | Division | `ACTIVE` | `ARCHIVED` | Archivar división (`UC-STR-05` paso 4) | `RoleAssignment ADMIN`, **sin dependencia activa** | División `ARCHIVED`, historia conservada | `ACT-ADMIN` | `CLUB` | `REQ-STR-002` AC 1,2,3; `REQ-STR-006` AC 1,2 | `UC-STR-05` paso 4 | **No en V1** | **Sí (V1)** |

**Transiciones Prohibidas — Division**

| ID | Intento | Estado Actual | Transición Solicitada | Motivo Rechazo | Efecto | Authority Ref |
|---|---|---|---|---|---|---|
| PROH-011 | Renombrar | `ACTIVE` | `ACTIVE` (rename) | Equipos activos en la división | Rechazo | `REQ-PPL-014`, `UC-STR-04` alt 2.1 |
| PROH-012 | Archivar | `ACTIVE` | `ACTIVE → ARCHIVED` | Dependencia activa (líneas, equipos) | Rechazo **nombrando dependencia** | `REQ-STR-006`, `UC-STR-05` alt 2.1 |
| PROH-013 | Restaurar | `ARCHIVED` | `ARCHIVED → ACTIVE` | Restore no en V1 | Rechazo | `DEF-STR-001` |
| PROH-014 | Cualquier gestión | Cualquiera | Subcomisión | Estructura no disponible | Denegado con explicación | `REQ-STR-009` |

---

## 2.4 SM-LINE-01 — Line

| TR-ID | SM-ID | Objeto | Origen | Destino | Evento/Disparador | Condición/Guard | Efecto Funcional | Actor/Authority | Scope | REQ/AC | UC/Paso E5 | Reversible | Terminal |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TR-011 | SM-LINE-01 | Line | (creación) | `ACTIVE` | Registrar línea (`UC-STR-06` paso 4) | `RoleAssignment ADMIN`, división padre existe | Línea `ACTIVE`, etiqueta completa con división+temporada | `ACT-ADMIN` | `CLUB` | `REQ-STR-003` AC 1,2,3 | `UC-STR-06` paso 4 | No | No |
| TR-012 | SM-LINE-01 | Line | `ACTIVE` | `ACTIVE` (rename) | Actualizar línea (`UC-STR-07` paso 4) | `RoleAssignment ADMIN`, **sin equipos activos** | Nombre actualizado, referencias por identidad | `ACT-ADMIN` | `CLUB` | `REQ-STR-003` AC 1,2,3; `REQ-PPL-014` | `UC-STR-07` paso 4 | Sí | No |
| TR-013 | SM-LINE-01 | Line | `ACTIVE` | `ARCHIVED` | Archivar línea (`UC-STR-08` paso 4) | `RoleAssignment ADMIN`, **sin dependencia activa** | Línea `ARCHIVED`, historia conservada | `ACT-ADMIN` | `CLUB` | `REQ-STR-003`; `REQ-STR-006` AC 1,2 | `UC-STR-08` paso 4 | **No en V1** | **Sí (V1)** |

**Transiciones Prohibidas — Line** (igual que Division)
| ID | Intento | Estado | Transición | Motivo | Authority |
|---|---|---|---|---|---|
| PROH-015 | Renombrar | `ACTIVE` | rename | Equipos activos | `REQ-PPL-014` |
| PROH-016 | Archivar | `ACTIVE` | → `ARCHIVED` | Dependencia activa | `REQ-STR-006` |
| PROH-017 | Restaurar | `ARCHIVED` | → `ACTIVE` | No en V1 | `DEF-STR-002` |
| PROH-018 | Subcomisión | Cualquiera | — | Denegado | `REQ-STR-009` |

---

## 2.5 SM-VENUE-01 — Venue

| TR-ID | SM-ID | Objeto | Origen | Destino | Evento/Disparador | Condición/Guard | Efecto Funcional | Actor/Authority | Scope | REQ/AC | UC/Paso E5 | Reversible | Terminal |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TR-014 | SM-VENUE-01 | Venue | (creación) | `ACTIVE` | Registrar sede (`UC-STR-13` paso 4) | `RoleAssignment ADMIN` | Sede `ACTIVE`, identidad estable por ID | `ACT-ADMIN` | `CLUB` | `REQ-STR-005` AC 1,2,3 | `UC-STR-13` paso 4 | No | No |
| TR-015 | SM-VENUE-01 | Venue | `ACTIVE` | `ACTIVE` (corrección) | Corregir datos (`UC-STR-14` paso 4) | `RoleAssignment ADMIN` | Dato corregido, **sin reprogramar eventos, sin reconfirmación, sin notificación, sin coordination_revision++** (Regla A) | `ACT-ADMIN` | `CLUB` | `REQ-STR-012` regla A; `REQ-STR-005` | `UC-STR-14` paso 4 | Sí | No |
| TR-016 | SM-VENUE-01 | Venue | `ACTIVE` | `ARCHIVED` | Archivar sede (`UC-STR-15` paso 4) | `RoleAssignment ADMIN`, **sin dependencia activa** | Sede `ARCHIVED`, eventos históricos conservados | `ACT-ADMIN` | `CLUB` | `REQ-STR-005`; `REQ-STR-006` AC 1,2; `REQ-EVT-024` | `UC-STR-15` paso 4 | **No en V1** | **Sí (V1)** |

**Transiciones Prohibidas — Venue**

| ID | Intento | Estado | Transición | Motivo | Authority |
|---|---|---|---|---|---|
| PROH-019 | Cambiar sede de evento | `ACTIVE` | (cambio material) | Eso es `UC-EVT-04` regla B, no `UC-STR-14` | `REQ-STR-012` regla B |
| PROH-020 | Archivar | `ACTIVE` | → `ARCHIVED` | Dependencia activa (eventos) | `REQ-STR-006`, `REQ-EVT-024` |
| PROH-021 | Restaurar | `ARCHIVED` | → `ACTIVE` | No en V1 | — |
| PROH-022 | Subcomisión | Cualquiera | — | Denegado | `REQ-STR-009` |

---

## 2.6 SM-EVENT-01 — Event (Modelo Principal)

| TR-ID | SM-ID | Objeto | Origen | Destino | Evento/Disparador | Condición/Guard | Efecto Funcional | Actor/Authority | Scope | REQ/AC | UC/Paso E5 | Reversible | Terminal |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TR-017 | SM-EVENT-01 | Event | (creación) | `SCHEDULED` | Crear evento (`UC-EVT-01/02/03` paso 5) | Autoridad + alcance válido, destinatarios válidos, invariantes fecha/horario, **atómico** | Evento `SCHEDULED` con horario vigente, **sin borrador observable**, disponible para alcanzados | `ACT-COACH`/`ACT-SUBCOMMITTEE` | `TEAM`/`EVENT`/`CLUB` | `REQ-EVT-002/003/004` AC; `REQ-EVT-009`; `REQ-EVT-005`; `REQ-EVT-001`; `REQ-SYS-018` | `UC-EVT-01/02/03` paso 5 | No | No |
| TR-018 | SM-EVENT-01 | Event | `SCHEDULED` | `POSTPONED` | Posponer (`UC-EVT-05` paso 5) | Evento `SCHEDULED`, autoridad + alcance, **incluye `UC-EVT-11`** | Evento `POSTPONED` **sin horario vigente**, respuestas conservadas, **no acepta nuevas**, `coordination_revision++`, notifica aplazamiento | `ACT-COACH`/`ACT-SUBCOMMITTEE` | `TEAM`/`EVENT`/`CLUB` | `REQ-EVT-007` AC 1-5; `REQ-EVT-011`; `REQ-PRT-004`; `REQ-COM-014` | `UC-EVT-05` paso 5 | Sí (`TR-019`) | No |
| TR-019 | SM-EVENT-01 | Event | `POSTPONED` | `SCHEDULED` | Reanudar (`UC-EVT-06` paso 4) | Evento `POSTPONED`, autoridad + alcance, invariantes fecha/horario | Evento `SCHEDULED` **con horario vigente**, disponibilidad **reabierta**, respuestas conservadas, notifica reprogramación | `ACT-COACH`/`ACT-SUBCOMMITTEE` | `TEAM`/`EVENT`/`CLUB` | `REQ-EVT-007`; `REQ-PRT-004`; `REQ-COM-014` | `UC-EVT-06` paso 4 | Sí (`TR-018`) | No |
| TR-020 | SM-EVENT-01 | Event | `SCHEDULED` | `CANCELLED` | Cancelar (`UC-EVT-07` paso 5) | Evento `SCHEDULED` o `POSTPONED`, autoridad + alcance, **incluye `UC-EVT-11`** | Evento `CANCELLED`, composición propia, consecuencia explicada, disponibilidad no acción principal, notifica cancelación | `ACT-COACH`/`ACT-SUBCOMMITTEE` | `TEAM`/`EVENT`/`CLUB` | `REQ-EVT-007`; `REQ-EVT-008`; `REQ-EVT-011`; `REQ-COM-014`; `REQ-PRT-004` | `UC-EVT-07` paso 5 | Sí (`TR-022`) | **Sí** |
| TR-021 | SM-EVENT-01 | Event | `POSTPONED` | `CANCELLED` | Cancelar (`UC-EVT-07` paso 5) | Evento `POSTPONED`, autoridad + alcance, **incluye `UC-EVT-11`** | Idem `TR-020` | `ACT-COACH`/`ACT-SUBCOMMITTEE` | `TEAM`/`EVENT`/`CLUB` | Idem `TR-020` | `UC-EVT-07` paso 5 | Sí (`TR-022`) | **Sí** |
| TR-022 | SM-EVENT-01 | Event | `CANCELLED` | `SCHEDULED` | Restaurar (`UC-EVT-08` paso 5) | Evento `CANCELLED`, autoridad + alcance, **incluye `UC-EVT-11`** | Evento `SCHEDULED` con horario vigente, `coordination_revision++`, notifica restauración | `ACT-COACH`/`ACT-SUBCOMMITTEE` | `TEAM`/`EVENT`/`CLUB` | `REQ-EVT-007`; `REQ-EVT-011`; `REQ-COM-014`; `REQ-PRT-004` | `UC-EVT-08` paso 5 | Sí (`TR-020/021`) | No |
| TR-023 | SM-EVENT-01 | Event | `SCHEDULED` | `IN_PROGRESS` | Inicio operacional (inicio real del evento) | Evento `SCHEDULED`, horario vigente alcanzado | Evento `IN_PROGRESS` | Sistema / Actor operacional | — | `REQ-EVT-001`; `REQ-EVT-007` | Implícito en ciclo | No | No |
| TR-024 | SM-EVENT-01 | Event | `IN_PROGRESS` | `COMPLETED` | Completar (`UC-EVT-09` paso 4) | Evento `SCHEDULED`/`IN_PROGRESS`, ciclo permite `COMPLETED`, autoridad + alcance | Evento `COMPLETED`, **terminal**, composición propia, **no se reabre**, habilita resultado `PLAYED/FORFEIT` (si Match) | `ACT-COACH`/`ACT-SUBCOMMITTEE` | `TEAM`/`EVENT`/`CLUB` | `REQ-EVT-007`; `REQ-EVT-008`; `REQ-PRT-015`; `REQ-PRT-013` | `UC-EVT-09` paso 4 | **No** (PT §9 explícito) | **Sí** |
| TR-025 | SM-EVENT-01 | Event | `IN_PROGRESS` | `ABANDONED` | Abandonar (`UC-EVT-10` paso 4) | Evento `IN_PROGRESS`, **tipo Match**, ciclo permite `ABANDONED`, autoridad + alcance | Evento `ABANDONED`, **terminal**, composición propia, resultado `ABANDONED`, sin estadísticas reales | `ACT-COACH`/`ACT-SUBCOMMITTEE` | `TEAM`/`EVENT`/`CLUB` | `REQ-EVT-007`; `REQ-EVT-008`; `REQ-PRT-015`; `REQ-PRT-016` | `UC-EVT-10` paso 4 | **No** | **Sí** |
| TR-026 | SM-EVENT-01 | Event | `SCHEDULED` | `SCHEDULED` (edición no material) | Editar no material (`UC-EVT-04` camino básico) | Evento `≠ COMPLETED`, autoridad + alcance, campos no coordinativos | Corrección registrada, **sin vista previa, sin coordination_revision++, sin reconfirmación, sin notificación** | `ACT-COACH`/`ACT-SUBCOMMITTEE` | `TEAM`/`EVENT`/`CLUB` | `REQ-EVT-010`; `REQ-EVT-001` | `UC-EVT-04` camino básico | Sí | No |
| TR-027 | SM-EVENT-01 | Event | `SCHEDULED` | `SCHEDULED` (edición material) | Editar material (`UC-EVT-04` alt 3.1 + `UC-EVT-11`) | Evento `≠ COMPLETED`, autoridad + alcance, **campo material** (lista cerrada `REQ-EVT-011`), `[MATERIAL_CHANGE]` | `coordination_revision++` en ocurrencias afectadas, deriva `NEEDS_RECONFIRMATION` (`REQ-PRT-003`), notifica unión audiencias (`REQ-COM-016`), impacto revalidado al ejecutar | `ACT-COACH`/`ACT-SUBCOMMITTEE` | `TEAM`/`EVENT`/`CLUB` | `REQ-EVT-011`; `REQ-EVT-012`; `REQ-PRT-003`; `REQ-COM-016`; `REQ-EVT-015` | `UC-EVT-04` alt 3.1 + `UC-EVT-11` | Sí (otro cambio material) | No |
| TR-028 | SM-EVENT-01 | Event | `POSTPONED` | `POSTPONED` (edición no material) | Editar no material (`UC-EVT-04` camino básico) | Evento `POSTPONED`, autoridad + alcance, campos no coordinativos | Corrección registrada sin efectos coordinación | `ACT-COACH`/`ACT-SUBCOMMITTEE` | `TEAM`/`EVENT`/`CLUB` | `REQ-EVT-010` | `UC-EVT-04` camino básico | Sí | No |
| TR-029 | SM-EVENT-01 | Event | `CANCELLED` | `CANCELLED` (edición no material) | Editar no material | Evento `CANCELLED`, autoridad + alcance | Corrección registrada (raro pero posible) | `ACT-COACH`/`ACT-SUBCOMMITTEE` | `TEAM`/`EVENT`/`CLUB` | `REQ-EVT-010` | `UC-EVT-04` camino básico | Sí | No |
| TR-030 | SM-EVENT-01 | Event | Cualquiera | Cualquiera | Resolver conflicto concurrente (`UC-EVT-12`) | `[STALE_VERSION]` al confirmar edición | Reconcilia campo por campo, aplica versión decidida, sin fusión automática | `ACT-COACH`/`ACT-SUBCOMMITTEE` | `TEAM`/`EVENT`/`CLUB` | `REQ-EVT-013`; `REQ-SYS-017`; `REQ-SYS-010` | `UC-EVT-12` | Sí | No |

**Transiciones Prohibidas — Event**

| ID | Intento | Estado Actual | Transición Solicitada | Motivo Rechazo | Efecto | Authority Ref |
|---|---|---|---|---|---|---|
| PROH-023 | Disponibilidad | `DRAFT` | — | Evento no acepta disponibilidad | Rechazo | `REQ-PRT-004` AC 3 |
| PROH-024 | Nueva disponibilidad | `POSTPONED` | — | Conserva previas, no acepta nuevas | Rechazo explicando | `REQ-PRT-004` AC 1 |
| PROH-025 | Disponibilidad/Convocatoria/Asistencia | `CANCELLED` | — | Terminal para participación | Rechazo, composición propia | `REQ-EVT-008`, `REQ-PRT-004` |
| PROH-026 | Disponibilidad/Edición/Convocatoria | `COMPLETED` | — | **No se reabre** (PT §9) | Rechazo | `REQ-EVT-007` AC 2.1; PT §9 |
| PROH-027 | Disponibilidad/Edición/Convocatoria | `ABANDONED` | — | Terminal | Rechazo | `REQ-EVT-008` |
| PROH-028 | Cambiar equipo Match | `SCHEDULED` Match | `SCHEDULED →` (cambio team) | Equipo inmutable una vez programado | Rechazo | `REQ-EVT-006`, `UC-EVT-04` alt 3.3 |
| PROH-029 | Editar material | `COMPLETED` | — | Terminal, no reabre | Rechazo | `REQ-EVT-007` |
| PROH-030 | Reabrir COMPLETED | `COMPLETED` | `COMPLETED → SCHEDULED` | Explícitamente prohibido | Nada cambia | PT §9: "COMPLETED no reabre" |
| PROH-031 | Abandonar no-Match | `IN_PROGRESS` Training/ClubEvent | → `ABANDONED` | Solo Match tiene `ABANDONED` (PT §9) | Rechazo | PT §9 "Match: IN_PROGRESS → ABANDONED" |

---

## 2.7 SM-EVENTSERIES-01 — EventSeries

| TR-ID | SM-ID | Objeto | Origen | Destino | Evento/Disparador | Condición/Guard | Efecto Funcional | Actor/Authority | Scope | REQ/AC | UC/Paso E5 | Reversible | Terminal |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TR-031 | SM-EVENTSERIES-01 | EventSeries | (creación) | `ACTIVE` | Crear serie (`UC-EVT-13` paso 5) | Autoridad + alcance, destinatarios válidos, invariantes cada ocurrencia, **≤366 ocurrencias** | Serie `ACTIVE` con destinatarios y ocurrencias persistidas | `ACT-COACH`/`ACT-SUBCOMMITTEE` | `TEAM`/`EVENT`/`CLUB` | `REQ-EVT-014` AC 1-5; `REQ-EVT-016`; `REQ-EVT-005` | `UC-EVT-13` paso 5 | No | No |
| TR-032 | SM-EVENTSERIES-01 | EventSeries | `ACTIVE` | `ENDED` | Finalizar serie (`UC-EVT-14` paso 4) | Serie `ACTIVE`, autoridad + alcance | Serie `ENDED`, **conserva ocurrencias**, **sin transición inversa** | `ACT-COACH`/`ACT-SUBCOMMITTEE` | `TEAM`/`EVENT`/`CLUB` | `REQ-EVT-016` AC 1,2; `REQ-PPL-015` | `UC-EVT-14` paso 4 | **No** | **Sí** |
| TR-033 | SM-EVENTSERIES-01 | EventSeries | `ACTIVE` | `ACTIVE` (edición ocurrencias) | Editar ocurrencias (`UC-EVT-04` con 3 alcances) | Serie `ACTIVE`, autoridad, elige alcance: solo esta / esta y siguientes / toda la serie | Impacto calculado sobre **conjunto real afectado**, `coordination_revision++` solo en afectadas, notifica si material | `ACT-COACH`/`ACT-SUBCOMMITTEE` | `TEAM`/`EVENT`/`CLUB` | `REQ-EVT-015` AC 1-5; `REQ-EVT-011`; `REQ-COM-016` | `UC-EVT-04` alt 3.2 | Sí | No |

**Transiciones Prohibidas — EventSeries**

| ID | Intento | Estado | Transición | Motivo | Authority |
|---|---|---|---|---|---|
| PROH-032 | Crear serie | — | >366 ocurrencias | `RECURRENCE_TOO_LARGE` | `REQ-EVT-016` |
| PROH-033 | Reactivar | `ENDED` | → `ACTIVE` | Sin transición inversa | PT §9, `UC-EVT-14` |
| PROH-034 | Editar | `ENDED` | — | Terminal | — |

---

## 2.8 SM-AVAILABILITY-01 — Availability (Valores Persistidos)

| TR-ID | SM-ID | Objeto | Origen | Destino | Evento/Disparador | Condición/Guard | Efecto Funcional | Actor/Authority | Scope | REQ/AC | UC/Paso E5 | Reversible | Terminal |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TR-034 | SM-AVAILABILITY-01 | Availability | `NO_RESPONSE` (sin fila) | `YES`/`MAYBE`/`NO` | Responder disponibilidad (`UC-PRT-01` paso 4) | Evento `SCHEDULED`, alcanza a persona/menor, `PLAYER` vigente + TeamAssignment + Membership **O** `GuardianRelationship.can_respond_availability` | Fila `availabilities` creada con valor, fecha, visible en conteo | `ACT-PLAYER` / `ACT-GUARDIAN` | `TEAM` / `CHILD` | `REQ-PRT-001` AC 1,2,3; `REQ-PRT-002` AC 1,2,3; `REQ-PRT-004` | `UC-PRT-01` paso 4 | Sí (cambiar respuesta) | No |
| TR-035 | SM-AVAILABILITY-01 | Availability | `YES`/`MAYBE`/`NO` | `YES`/`MAYBE`/`NO` (cambio) | Cambiar respuesta (`UC-PRT-01` alt 4.1) | Mismos guards que `TR-034` | **Sustituye** respuesta anterior, nueva vigente con fecha | `ACT-PLAYER` / `ACT-GUARDIAN` | `TEAM` / `CHILD` | `REQ-PRT-001` "cambiar sustituye" | `UC-PRT-01` alt 4.1 | Sí | No |
| TR-036 | SM-AVAILABILITY-01 | Availability | `YES`/`MAYBE`/`NO` | `NO_RESPONSE` | (No existe) | — | **No hay transición a `NO_RESPONSE`**: ausencia de fila ≠ estado persistido | — | — | — | — | — | — |
| TR-037 | SM-AVAILABILITY-01 | Availability | `NO_RESPONSE` | `NEEDS_RECONFIRMATION` | (Derivado, no transición) | Existe respuesta Y `event.coordination_revision > availability.coordination_revision` | Estado derivado calculado en consulta | Sistema | — | `REQ-PRT-003` AC 2 | Derivado | N/A | No |
| TR-038 | SM-AVAILABILITY-01 | Availability | `NEEDS_RECONFIRMATION` | `YES`/`MAYBE`/`NO` | Responder de nuevo (`UC-PRT-01` alt 4.2) | Evento `SCHEDULED`, mismo actor/guards | Nueva respuesta **sustituye**, deja de estar "necesita confirmación" | `ACT-PLAYER` / `ACT-GUARDIAN` | `TEAM` / `CHILD` | `REQ-PRT-003` "cambiar sustituye"; `UC-PRT-01` alt 4.2 | `UC-PRT-01` alt 4.2 | Sí | No |

**Transiciones Prohibidas — Availability**

| ID | Intento | Estado | Transición | Motivo | Authority |
|---|---|---|---|---|---|
| PROH-035 | Responder | `DRAFT`/`CANCELLED`/`COMPLETED`/`ABANDONED` | — | Solo `SCHEDULED` acepta | `REQ-PRT-004` AC 3 |
| PROH-036 | Responder | `POSTPONED` | — | Conserva, no acepta nuevas | `REQ-PRT-004` AC 1 |
| PROH-037 | Responder | `SCHEDULED` | Actor sin `PLAYER` ni `Guardian.can_respond` | Denegado | `REQ-PRT-001` AC 3, `REQ-PRT-002` AC 2 |
| PROH-038 | Responder por menor | `SCHEDULED` | Evento no alcanza al menor | Rechazado | `REQ-PRT-002` AC 3 |

---

## 2.9 SM-SELECTIONREV-01 — SelectionRevision

| TR-ID | SM-ID | Objeto | Origen | Destino | Evento/Disparador | Condición/Guard | Efecto Funcional | Actor/Authority | Scope | REQ/AC | UC/Paso E5 | Reversible | Terminal |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TR-039 | SM-SELECTIONREV-01 | SelectionRevision | (creación borrador) | `DRAFT` | Preparar convocatoria (`UC-PRT-02` paso 5) | Evento `SCHEDULED` tipo `MATCH`, `COACH` autoridad + alcance | Borrador editable con guardado automático (5 estados), refresco no pisa escrito | `ACT-COACH` | `TEAM`/`EVENT` | `REQ-PRT-005` AC 1,2,3,4; `REQ-PRT-008` | `UC-PRT-02` paso 5 | No | No |
| TR-040 | SM-SELECTIONREV-01 | SelectionRevision | `DRAFT` | `PUBLISHED` | Publicar convocatoria (`UC-PRT-03` paso 4) | Evento `SCHEDULED` tipo `MATCH`, borrador completo, `COACH` autoridad | **Revisión inmutable** publicada, notifica agregadas/quitadas vs revisión anterior, conflictos derivados visibles pero **publicación prospera** (`REQ-PRT-006`) | `ACT-COACH` | `TEAM`/`EVENT` | `REQ-PRT-005`; `REQ-PRT-006` AC 1,2; `REQ-COM-015`; `REQ-INS-011` | `UC-PRT-03` paso 4 | **No** (inmutable) | **Sí** (inmutable) |
| TR-041 | SM-SELECTIONREV-01 | SelectionRevision | (nueva revisión) | `PUBLISHED` | Republicar (`UC-PRT-03` alt 5.1) | Misma precondición, revisión anterior existe | **Nueva revisión `PUBLISHED` distinta**, anterior inmutable conservada | `ACT-COACH` | `TEAM`/`EVENT` | `REQ-PRT-005`; `REQ-PRT-006` | `UC-PRT-03` alt 5.1 | No (cada revisión inmutable) | **Sí** |

**Transiciones Prohibidas — SelectionRevision**

| ID | Intento | Estado | Transición | Motivo | Authority |
|---|---|---|---|---|---|
| PROH-039 | Editar | `PUBLISHED` | — | Inmutable | `REQ-PRT-005` "revisión inmutable" |
| PROH-040 | Publicar | Evento `≠ SCHEDULED` o `≠ MATCH` | — | No aplica | `REQ-PRT-005`, `REQ-EVT-017` |
| PROH-041 | Bloquear publicación | `DRAFT` con conflictos | — | Publica igual, conflictos derivados | `REQ-PRT-006` |

---

## 2.10 SM-ATTENDANCEENTRY-01 — AttendanceEntry

| TR-ID | SM-ID | Objeto | Origen | Destino | Evento/Disparador | Condición/Guard | Efecto Funcional | Actor/Authority | Scope | REQ/AC | UC/Paso E5 | Reversible | Terminal |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TR-042 | SM-ATTENDANCEENTRY-01 | AttendanceEntry | `UNRECORDED` (sin fila) | `PRESENT`/`ABSENT`/`JUSTIFIED` | Registrar asistencia (`UC-PRT-05` paso 4) | Evento `SCHEDULED`/`IN_PROGRESS`, tipo `TRAINING`/`MATCH`, planilla `OPEN`, `COACH` autoridad | Fila creada con valor, **persistencia inmediata**, conteo vivo | `ACT-COACH` | `TEAM`/`EVENT` | `REQ-PRT-009` AC 1-4; `REQ-PRT-010`; `REQ-PRT-019` | `UC-PRT-05` paso 4 | Sí (corrección) | No |
| TR-043 | SM-ATTENDANCEENTRY-01 | AttendanceEntry | `PRESENT`/`ABSENT`/`JUSTIFIED` | `PRESENT`/`ABSENT`/`JUSTIFIED` (corrección) | Corregir asistencia (`UC-PRT-07` paso 4) | Valor registrado previo, **motivo obligatorio**, `COACH` autoridad | Persiste anterior, nuevo, motivo, autor, fecha; **antes y después visibles**; no retrocede lifecycle | `ACT-COACH` | `TEAM`/`EVENT` | `REQ-PRT-012` AC 1,2,3; `REQ-INS-011`; `REQ-SYS-006` | `UC-PRT-07` paso 4 | Sí (otra corrección) | No |
| TR-044 | SM-ATTENDANCEENTRY-01 | AttendanceEntry | `UNRECORDED` | `UNRECORDED` | Planilla `CLOSED` | Planilla `CLOSED` (`closed_at` seteado) | **No admite marcaje nuevo** sin corrección | — | — | `REQ-PRT-011` AC 1 | `UC-PRT-05` alt 2.1 | N/A | No |

**Transiciones Prohibidas — AttendanceEntry**

| ID | Intento | Estado | Transición | Motivo | Authority |
|---|---|---|---|---|---|
| PROH-042 | Marcar | Planilla `CLOSED` | Cualquier valor | Requiere corrección (`UC-PRT-07`) | `REQ-PRT-011`, `UC-PRT-05` alt 2.1 |
| PROH-043 | Reabrir planilla | `CLOSED` | → `OPEN` | **No es requisito** (corrección la cubre) | `REQ-PRT-011` NOTES, `CON-13` |
| PROH-044 | Marcar | Evento tipo no admite | — | Matriz aplicabilidad | `REQ-PRT-019` |

---

## 2.11 SM-MATCHRECORD-01 — MatchRecord

| TR-ID | SM-ID | Objeto | Origen | Destino | Evento/Disparador | Condición/Guard | Efecto Funcional | Actor/Authority | Scope | REQ/AC | UC/Paso E5 | Reversible | Terminal |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TR-045 | SM-MATCHRECORD-01 | MatchRecord | (creación) | `DRAFT` | Registrar resultado (`UC-PRT-08` paso 4) | Evento `MATCH`, ciclo compatible (`PLAYED/FORFEIT` ⇒ `COMPLETED`, `ABANDONED` ⇒ `ABANDONED`), `COACH` autoridad | `MatchRecord` `DRAFT` creado, **no fija estado inexistente en Event** | `ACT-COACH` | `TEAM`/`EVENT` | `REQ-PRT-013` AC 1,2,3; `REQ-PRT-015`; `REQ-PRT-019` | `UC-PRT-08` paso 4 | No | No |
| TR-046 | SM-MATCHRECORD-01 | MatchRecord | `DRAFT` | `FINAL` | Finalizar resultado (`UC-PRT-09` paso 4) | `MatchRecord` `DRAFT`, ciclo evento permite, `COACH` autoridad | Resultado `FINAL`, **terminal vía normal**, habilita estadísticas `PLAYED`, partidos jugados derivados del resultado | `ACT-COACH` | `TEAM`/`EVENT` | `REQ-PRT-013`; `REQ-PRT-015`; `REQ-PRT-016` | `UC-PRT-09` paso 4 | **No** (vía normal) | **Sí** |
| TR-047 | SM-MATCHRECORD-01 | MatchRecord | `FINAL` | `FINAL` (corrección) | Corregir resultado (`UC-PRT-10` paso 4) | `MatchRecord` `FINAL`, **motivo obligatorio**, `COACH` autoridad | Persiste marcador anterior, nuevo, motivo, autor, fecha; **marcador final visible con evidencia**; **no transición inversa**, lifecycle no retrocede | `ACT-COACH` | `TEAM`/`EVENT` | `REQ-PRT-014` AC 1,2; `REQ-INS-011`; `REQ-SYS-006` | `UC-PRT-10` paso 4 | Sí (otra corrección) | No (sigue `FINAL`) |

**Transiciones Prohibidas — MatchRecord**

| ID | Intento | Estado | Transición | Motivo | Authority |
|---|---|---|---|---|---|
| PROH-045 | Editar vía normal | `FINAL` | `FINAL → DRAFT` | Terminal por vía normal | `REQ-PRT-013` AC 2.1 |
| PROH-046 | Crear/Finalizar | Evento ciclo incompatible | — | `MATCH_STATE_INCOMPATIBLE` | `REQ-PRT-013` alt 2.1, `REQ-PRT-015` |
| PROH-047 | Registrar resultado | `ACT-ADMIN` | — | Admin sin autoridad deportiva | `REQ-PRT-013` alt 2.2, E2 §14.1 |
| PROH-048 | Corregir sin motivo | `FINAL` | — | Operación no completa | `REQ-PRT-014` AC 3.1 |

---

## 2.12 SM-ELIGIBILITY-01 — EligibilityConstraint

| TR-ID | SM-ID | Objeto | Origen | Destino | Evento/Disparador | Condición/Guard | Efecto Funcional | Actor/Authority | Scope | REQ/AC | UC/Paso E5 | Reversible | Terminal |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TR-048 | SM-ELIGIBILITY-01 | EligibilityConstraint | (creación) | `PENDING`/`BLOCKED` | Registrar restricción (`UC-PRT-12` paso 4) | `SUBCOMMITTEE`/`ADMIN` autoridad, jugadora existe, estado/alcance/origen/motivo/vigencia definidos | Fila creada con estado, alcance (`CLUB/COMPETITION/ENTRY/EVENT`), origen, motivo, vigencia; mutación auditada | `ACT-SUBCOMMITTEE`/`ACT-ADMIN` | `CLUB` | `REQ-PRT-017` AC 1-5; `REQ-CMP-008`; `REQ-INS-009` | `UC-PRT-12` paso 4 | No (vigencia controla) | No |
| TR-049 | SM-ELIGIBILITY-01 | EligibilityConstraint | `PENDING` | `BLOCKED` | (Cambio de estado en misma fila) | Actualización de estado por autoridad | Estado actualizado, vigencia vigente | `ACT-SUBCOMMITTEE`/`ACT-ADMIN` | `CLUB` | `REQ-PRT-017` | Implícito en `UC-PRT-12` | Sí | No |
| TR-050 | SM-ELIGIBILITY-01 | EligibilityConstraint | `BLOCKED`/`PENDING` | (expirada) | Vigencia `validUntil` superada | `now > validUntil` | Restricción **ya no aplica**, `ELIGIBLE` derivado | Sistema (temporal) | — | `REQ-PRT-017` "ELIGIBLE derivado" | Temporal | N/A | No |

**Transiciones Prohibidas — EligibilityConstraint**

| ID | Intento | Estado | Transición | Motivo | Authority |
|---|---|---|---|---|---|
| PROH-049 | Registrar | Actor ≠ Subcomisión/Admin | — | Denegado | `UC-PRT-12` alt 2.1 |
| PROH-050 | Consultar motivo/origen | `ACT-COACH` | — | Solo estado + alcance | `REQ-PRT-017` AC, `REQ-CMP-008` |

---

## 2.13 SM-ANNOUNCEMENT-01 — Announcement

| TR-ID | SM-ID | Objeto | Origen | Destino | Evento/Disparador | Condición/Guard | Efecto Funcional | Actor/Authority | Scope | REQ/AC | UC/Paso E5 | Reversible | Terminal |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TR-051 | SM-ANNOUNCEMENT-01 | Announcement | (creación) | `DRAFT` | Redactar (`UC-COM-01` paso 4) | `SUBCOMMITTEE` autoridad, audiencia conjunto real equipos/club | `Announcement` `DRAFT` con título, cuerpo, audiencia | `ACT-SUBCOMMITTEE` | `CLUB`/`TEAM_SET` | `REQ-COM-001` AC 1,2,3; `REQ-COM-002` | `UC-COM-01` paso 4 | No | No |
| TR-052 | SM-ANNOUNCEMENT-01 | Announcement | `DRAFT` | `PUBLISHED` | Publicar (`UC-COM-02` paso 4) | `DRAFT`, audiencia válida, `SUBCOMMITTEE` autoridad | `PUBLISHED`, **audiencia snapshot inmutable**, notifica alcanzados tipo distinguible | `ACT-SUBCOMMITTEE` | `CLUB`/`TEAM_SET` | `REQ-COM-001`; `REQ-COM-003` AC 1,2; `REQ-COM-014` | `UC-COM-02` paso 4 | No | No |
| TR-053 | SM-ANNOUNCEMENT-01 | Announcement | `PUBLISHED` | `PUBLISHED` (corrección) | Corregir (`UC-COM-03` paso 4) | `PUBLISHED`, motivo, `SUBCOMMITTEE` autoridad | Título/cuerpo corregidos, **audiencia no cambia**, texto anterior en historia | `ACT-SUBCOMMITTEE` | `CLUB` | `REQ-COM-004` AC 1,2,3; `REQ-COM-003`; `REQ-INS-011` | `UC-COM-03` paso 4 | Sí (otra corrección) | No |
| TR-054 | SM-ANNOUNCEMENT-01 | Announcement | `PUBLISHED` | `ARCHIVED` | Archivar (`UC-COM-04` paso 4) | `PUBLISHED`, `SUBCOMMITTEE` autoridad | `ARCHIVED`, deja de estar vigente, contenido e historia conservados | `ACT-SUBCOMMITTEE` | `CLUB` | `REQ-COM-001`; `REQ-PPL-015` | `UC-COM-04` paso 4 | **No en V1** | **Sí** |

**Transiciones Prohibidas — Announcement**

| ID | Intento | Estado | Transición | Motivo | Authority |
|---|---|---|---|---|---|
| PROH-051 | Cambiar audiencia | `PUBLISHED` | — | Snapshot inmutable | `REQ-COM-003` "no está disponible" |
| PROH-052 | Corregir audiencia | `PUBLISHED` | — | Corresponde comunicado nuevo | `REQ-COM-004` AC 3 |
| PROH-053 | Publicar | Actor ≠ Subcomisión | — | Denegado | `REQ-COM-001` "solo Subcomisión" |
| PROH-054 | Consultar | No en audiencia | — | Recurso no disponible (no recortado) | `REQ-COM-005`, `REQ-SYS-012` |
| PROH-055 | Reactivar | `ARCHIVED` | → `PUBLISHED` | No en V1 | — |

---

## 2.14 SM-CONVERSATION-GROUP-01 — Conversation (GROUP)

| TR-ID | SM-ID | Objeto | Origen | Destino | Evento/Disparador | Condición/Guard | Efecto Funcional | Actor/Authority | Scope | REQ/AC | UC/Paso E5 | Reversible | Terminal |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TR-055 | SM-CONVERSATION-GROUP-01 | Conversation (GROUP) | (creación) | `ACTIVE` | Crear grupo (`UC-COM-07` paso 5) | Derecho comunicacional (`PLAYER/CAPTAIN/COACH`), ≥2 participantes, título, candidatos legítimos | Grupo `ACTIVE` con participantes, `joined_at`/`left_at` | `ACT-AUTHENTICATED` (con derecho) | `SELF` | `REQ-COM-007` AC 1-4; `REQ-COM-012`; `REQ-COM-013` | `UC-COM-07` paso 5 | No | No |
| TR-056 | SM-CONVERSATION-GROUP-01 | Conversation (GROUP) | `ACTIVE` | `ARCHIVED` | Archivar grupo (`UC-COM-12` paso 4) | Grupo `ACTIVE`, actor participa, confirmación | `ARCHIVED`, contenido y períodos conservados, ex-participante conserva período | `ACT-AUTHENTICATED` (participante) | `SELF` | `REQ-COM-007` AC 4; `REQ-COM-011` | `UC-COM-12` paso 4 | **No en V1** | **Sí** |

**Transiciones Prohibidas — Conversation (GROUP)**

| ID | Intento | Estado | Transición | Motivo | Authority |
|---|---|---|---|---|---|
| PROH-056 | Archivar | `ACTIVE` | Actor no participa | Denegado | `UC-COM-12` alt 2.3 |
| PROH-057 | Archivar | DIRECT/TEAM/EVENT | — | Solo GROUP archivable | `REQ-COM-007` AC 4 |
| PROH-058 | Enviar/Editar/Eliminar | `ARCHIVED` | — | Solo lectura histórico | — |

---

## 2.15 SM-MESSAGE-01 — Message

| TR-ID | SM-ID | Objeto | Origen | Destino | Evento/Disparador | Condición/Guard | Efecto Funcional | Actor/Authority | Scope | REQ/AC | UC/Paso E5 | Reversible | Terminal |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TR-057 | SM-MESSAGE-01 | Message | (envío) | `SENT` | Enviar mensaje (`UC-COM-09` paso 3) | Actor participa, acceso vigente (`joined_at` ≤ now < `left_at`) | Mensaje persistido visible para participantes autorizados | `ACT-AUTHENTICATED` (participante) | `SELF` | `REQ-COM-009` AC 1,2,3; `REQ-COM-011`; `REQ-COM-012` | `UC-COM-09` paso 3 | No | No |
| TR-058 | SM-MESSAGE-01 | Message | `SENT` | `EDITED` | Editar propio (`UC-COM-10` paso 4) | Mensaje propio, acceso vigente a conversación | Corrección aplicada, **historia expuesta** con fecha real y actor | `ACT-AUTHENTICATED` (autor) | `SELF` | `REQ-COM-010` AC 1,2; `REQ-INS-011` | `UC-COM-10` paso 4 | Sí (otra edición) | No |
| TR-059 | SM-MESSAGE-01 | Message | `SENT`/`EDITED` | `DELETED` | Eliminar propio (`UC-COM-11` paso 4) | Mensaje propio, **confirmación con motivo** (irreversible) | **Tombstone**: contenido desaparece, hecho de existencia y borrado permanece | `ACT-AUTHENTICATED` (autor) | `SELF` | `REQ-COM-010` AC 1,2,3; `REQ-PPL-015`; `REQ-SYS-007` | `UC-COM-11` paso 4 | **No** (irreversible) | **Sí** |

**Transiciones Prohibidas — Message**

| ID | Intento | Estado | Transición | Motivo | Authority |
|---|---|---|---|---|---|
| PROH-059 | Editar/Eliminar | Mensaje ajeno | — | Solo propios | `REQ-COM-010` "solo mensajes propios" |
| PROH-060 | Eliminar | Sin confirmación+motivo | — | No ejecuta | `REQ-COM-010` AC 3.1 |
| PROH-061 | Cualquiera | `DELETED` | — | Tombstone irreversible | — |

---

## 2.16 SM-COMPETITION-01 — Competition

| TR-ID | SM-ID | Objeto | Origen | Destino | Evento/Disparador | Condición/Guard | Efecto Funcional | Actor/Authority | Scope | REQ/AC | UC/Paso E5 | Reversible | Terminal |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TR-060 | SM-COMPETITION-01 | Competition | (creación) | `DRAFT` | Registrar (`UC-CMP-01` paso 4) | `SUBCOMMITTEE`/`ADMIN` autoridad | Competition `DRAFT` | `ACT-SUBCOMMITTEE`/`ACT-ADMIN` | `CLUB` | `REQ-CMP-001` AC 1,2,3; `REQ-CMP-006` | `UC-CMP-01` paso 4 | No | No |
| TR-061 | SM-COMPETITION-01 | Competition | `DRAFT` | `ACTIVE` | Activar (`UC-CMP-02` paso 4) | `DRAFT`, `SUBCOMMITTEE`/`ADMIN` autoridad | `ACTIVE`, admite inscripciones | `ACT-SUBCOMMITTEE`/`ACT-ADMIN` | `CLUB` | `REQ-CMP-001`; `REQ-CMP-003` | `UC-CMP-02` paso 4 | No | No |
| TR-062 | SM-COMPETITION-01 | Competition | `ACTIVE` | `CLOSED` | Cerrar (`UC-CMP-03` paso 4) | `ACTIVE`, **0 inscripciones activas**, `SUBCOMMITTEE`/`ADMIN` autoridad | `CLOSED`, histórico conservado | `ACT-SUBCOMMITTEE`/`ACT-ADMIN` | `CLUB` | `REQ-CMP-002` AC 1,2; `REQ-EVT-024`; `REQ-PPL-015` | `UC-CMP-03` paso 4 | **No en V1** | **Sí** |

**Transiciones Prohibidas — Competition**

| ID | Intento | Estado | Transición | Motivo | Authority |
|---|---|---|---|---|---|
| PROH-062 | Cerrar | `ACTIVE` | → `CLOSED` | Inscripciones activas > 0 | Rechazo **explicándolas** | `REQ-CMP-002`, `UC-CMP-03` alt 2.1 |
| PROH-063 | Reactivar | `CLOSED` | → `ACTIVE` | No en V1 | — |
| PROH-064 | Gestionar | Actor ≠ Subcomisión/Admin | — | Denegado | `REQ-CMP-001` |

---

## 2.17 SM-COMPETITIONENTRY-01 — CompetitionEntry

| TR-ID | SM-ID | Objeto | Origen | Destino | Evento/Disparador | Condición/Guard | Efecto Funcional | Actor/Authority | Scope | REQ/AC | UC/Paso E5 | Reversible | Terminal |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TR-063 | SM-COMPETITIONENTRY-01 | CompetitionEntry | (creación TEAM) | `PENDING` | Inscribir equipo (`UC-CMP-04` paso 4) | Competition `ACTIVE`, equipo existe, `SUBCOMMITTEE`/`ADMIN` | Entry `scope=TEAM` `PENDING` identificado por team_id | `ACT-SUBCOMMITTEE`/`ACT-ADMIN` | `CLUB` | `REQ-CMP-003` AC 1-4; `REQ-CMP-004`; `REQ-STR-010` | `UC-CMP-04` paso 4 | No | No |
| TR-064 | SM-COMPETITIONENTRY-01 | CompetitionEntry | (creación LINE) | `PENDING` | Inscribir línea (`UC-CMP-05` paso 4) | Competition `ACTIVE`, línea existe + temporada válida, `SUBCOMMITTEE`/`ADMIN` | Entry `scope=LINE` `PENDING` identificado por division+line+season | `ACT-SUBCOMMITTEE`/`ACT-ADMIN` | `CLUB` | `REQ-CMP-003`; `REQ-CMP-004`; `REQ-STR-010` | `UC-CMP-05` paso 4 | No | No |
| TR-065 | SM-COMPETITIONENTRY-01 | CompetitionEntry | `PENDING` | `ACTIVE` | Activar inscripción (`UC-CMP-06` paso 4) | Entry `PENDING`, **alcance compatible** con uso previsto, `SUBCOMMITTEE`/`ADMIN` | Entry `ACTIVE`, usable por partidos de esa competencia | `ACT-SUBCOMMITTEE`/`ACT-ADMIN` | `CLUB` | `REQ-CMP-003`; `REQ-CMP-004`; `REQ-CMP-005`; `REQ-EVT-024` | `UC-CMP-06` paso 4 | No | No |
| TR-066 | SM-COMPETITIONENTRY-01 | CompetitionEntry | `ACTIVE` | `ENDED` | Finalizar inscripción (`UC-CMP-07` paso 4) | Entry `ACTIVE`, `SUBCOMMITTEE`/`ADMIN`, **serialización si en uso** (`REQ-SYS-018`) | Entry `ENDED`, consecuencia explicada, histórico conservado | `ACT-SUBCOMMITTEE`/`ACT-ADMIN` | `CLUB` | `REQ-CMP-003`; `REQ-EVT-024`; `REQ-PPL-015`; `REQ-SYS-018` | `UC-CMP-07` paso 4 | **No en V1** | **Sí** |

**Transiciones Prohibidas — CompetitionEntry**

| ID | Intento | Estado | Transición | Motivo | Authority |
|---|---|---|---|---|---|
| PROH-065 | Usar en partido | `PENDING` | — | Requiere `ACTIVE` | `REQ-CMP-005` |
| PROH-066 | Cambiar scope | `PENDING`/`ACTIVE` | `TEAM ↔ LINE` | Incompatibles (`COMPETITION_SCOPE_MISMATCH`) | `REQ-CMP-004`, `UC-CMP-04/05` alt 4.1 |
| PROH-067 | Reactivar | `ENDED` | → `ACTIVE` | No en V1 | — |
| PROH-068 | Finalizar sin serializar | `ACTIVE` en uso | — | `REQ-SYS-018` una orden una transacción | `UC-CMP-07` alt 2.1 |

---

# 3. RESUMEN CUANTITATIVO DE TRANSICIONES

| Máquina | Transiciones Permitidas | Transiciones Prohibidas Documentadas |
|---|---|---|
| `SM-ACCOUNT-01` | 4 | 5 |
| `SM-TEAM-01` | 3 | 5 |
| `SM-DIVISION-01` | 3 | 4 |
| `SM-LINE-01` | 3 | 4 |
| `SM-VENUE-01` | 3 | 4 |
| `SM-EVENT-01` | 14 | 9 |
| `SM-EVENTSERIES-01` | 3 | 3 |
| `SM-AVAILABILITY-01` | 4 (2 persistidas + 2 derivadas) | 4 |
| `SM-SELECTIONREV-01` | 3 | 3 |
| `SM-ATTENDANCEENTRY-01` | 3 | 3 |
| `SM-MATCHRECORD-01` | 3 | 4 |
| `SM-ELIGIBILITY-01` | 3 | 2 |
| `SM-ANNOUNCEMENT-01` | 4 | 5 |
| `SM-CONVERSATION-GROUP-01` | 2 | 3 |
| `SM-MESSAGE-01` | 3 | 3 |
| `SM-COMPETITION-01` | 3 | 3 |
| `SM-COMPETITIONENTRY-01` | 4 | 4 |
| **TOTAL** | **65** | **68** |

> **Nota (Errata E9.5):** Total transiciones permitidas reales = 65. TR-036 es fila de ausencia documentada. Prohibiciones = 68.

---

# 4. GUARDS CRÍTICOS IDENTIFICADOS

| Guard | Máquinas Afectadas | Descripción |
|---|---|---|
| `LAST_ADMIN_REQUIRED` | Account, RoleAssignment, Membership | No dejar 0 admins `ACTIVE/CLUB` |
| `INVALID_ROLE_SCOPE` | RoleAssignment | Combinación rol+alcance inválida |
| `EVENT_TARGET_INVALID` | Event | Destinatarios inválidos según tipo |
| `MATCH_STATE_INCOMPATIBLE` | MatchRecord | Resultado incompatible con ciclo Event |
| `COMPETITION_SCOPE_MISMATCH` | CompetitionEntry | Scope `TEAM`/`LINE` incompatible |
| `RECURRENCE_TOO_LARGE` | EventSeries | >366 ocurrencias |
| `BULK_OPERATION_TOO_LARGE` | Jornada | >100 partidos |
| `PLAYER_PROFILE_INCOMPLETE` | TeamAssignment | Perfil jugadora incompleto al incorporar |
| `MEMBERSHIP_HAS_ACTIVE_DEPENDENCIES` | Membership | Finalizar con dependencias |
| `STRUCTURE_HAS_ACTIVE_DEPENDENCIES` | Team/Division/Line/Venue | Archivar con dependencias |
| `COORDINATION_REVISION` | Event, EventSeries, Availability | Cambio material incrementa, deriva reconfirmación |
| `STALE_VERSION` | Event | Concurrencia optimista |
| `IMPACT_CHANGED` / `IMPACT_TOKEN_EXPIRED` | Event | Impact Preview revalidación |

---

**Fin de la Matriz de Transiciones V1.**

**Próximo:** E6-05 — Generación de diagramas Draw.io (17 archivos `.drawio` en `docs/uml/states/source/`).