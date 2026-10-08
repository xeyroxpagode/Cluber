# GEI HOCKEY MANAGEMENT SYSTEM
## STATE MODEL CATALOG V1

**Etapa:** 6 — Diagramas de estados (E6-03)
**Estado:** COMPLETO
**Fecha:** 2026-10-07
**Rama:** `gei/e6-state-diagrams-freeze-v1`
**Baseline:** `01ee760388e27592d007c1c6f539e9204aefbf62`

---

# 1. PROPÓSITO

Catálogo canónico de todas las máquinas de estados admitidas. Para cada máquina: ID estable, objeto, dominio, motivo, source of truth, estado inicial, estados canónicos, definición de cada estado, tipo (persistido/derivado/temporal), estados finales/terminales, operaciones permitidas/rechazadas por estado, invariantes, REQ/UC relacionados, referencias a pasos E5.

**Regla:** No escribir estados que ninguna autoridad sustente. Estados terminales y pseudonodo final UML NO son lo mismo.

---

# 2. CATÁLOGO DE MÁQUINAS

## SM-ACCOUNT-01 — Account (IAM)

| Campo | Valor |
|---|---|
| **Objeto** | Account |
| **Dominio** | IAM |
| **Motivo** | Lifecycle persistido con transiciones mutativas autorizadas, guards de seguridad, revocación de sesiones |
| **Source of Truth** | PT §9, REQ-IAM-001/002/003/004/005, UC-IAM-01/02/03/04/05, Actor Boundary Matrix §6 |
| **Estado Inicial** | `PENDING` (tras creación por Admin) |
| **Estados Canónicos** | `PENDING`, `ACTIVE`, `DISABLED` |
| **Definiciones** | `PENDING`: Cuenta creada, esperando activación con código de un solo uso. Sin sesión posible. `ACTIVE`: Cuenta activada, credencial válida, sesiones permitidas. `DISABLED`: Cuenta deshabilitada por Admin, sesiones revocadas, acceso bloqueado. Reactivable con código nuevo. |
| **Tipo** | Persistido (columna `status` en `accounts`) |
| **Estados Finales/Terminales** | `DISABLED` es terminal *relativo* (reactivable vía `UC-IAM-03/04`). No hay pseudonodo final UML: la cuenta persiste para auditoría. |
| **Operaciones Permitidas por Estado** | `PENDING`: Activar con código (`UC-IAM-04`). `ACTIVE`: Iniciar sesión (`UC-IAM-01`), cambiar contraseña (`UC-IAM-06`), consultar/cerrar sesiones (`UC-IAM-07/08`), reautenticar (`UC-IAM-09`), retomar trabajo (`UC-IAM-10`). `DISABLED`: Reactivar con código nuevo (`UC-IAM-03/04`). |
| **Operaciones Rechazadas** | `PENDING`/`DISABLED`: Iniciar sesión (rechazo sin revelar existencia), cualquier operación autenticada. `ACTIVE`: Deshabilitar si deja 0 admins (`LAST_ADMIN_REQUIRED`). |
| **Invariantes** | Username único e inmutable (`REQ-IAM-014`). Máx 1 código activo por cuenta (`REQ-IAM-003`). 5 intentos fallidos invalidan código. Deshabilitar revoca sesiones (`REQ-IAM-002`). Reactivación exige código nuevo. Protección último admin (`REQ-IAM-013`). |
| **REQ Relacionados** | `REQ-IAM-001` a `REQ-IAM-015`, `REQ-IAM-019`, `REQ-IAM-020`, `REQ-SYS-009/010/016` |
| **UC Relacionados** | `UC-IAM-01` a `UC-IAM-10` |
| **Referencias E5** | `GEI_UC_SPEC_IAM_V1.md` §15–441 |

---

## SM-TEAM-01 — Team (STR)

| Campo | Valor |
|---|---|
| **Objeto** | Team |
| **Dominio** | STR |
| **Motivo** | Lifecycle explícito `DRAFT→ACTIVE→ARCHIVED` con guards de dependencias, identidad inmutable |
| **Source of Truth** | PT §9, §19, REQ-STR-004/006/008, UC-STR-09/10/11/12, Actor Boundary Matrix §6 |
| **Estado Inicial** | `DRAFT` (tras `UC-STR-09`) |
| **Estados Canónicos** | `DRAFT`, `ACTIVE`, `ARCHIVED` |
| **Definiciones** | `DRAFT`: Equipo creado, combinación única validada, no disponible para afiliaciones/eventos/inscripciones. `ACTIVE`: Equipo activado, disponible para afiliaciones, eventos, inscripciones a competencias. `ARCHIVED`: Equipo archivado, historia conservada, eventos/inscripciones históricos consultables. **Terminal en V1** (no restore). |
| **Tipo** | Persistido (columna `status` en `teams`) |
| **Estados Finales/Terminales** | `ARCHIVED` terminal en V1. No pseudonodo final: persiste para historial. |
| **Operaciones Permitidas por Estado** | `DRAFT`: Actualizar datos (`UC-STR-10`), Activar (`UC-STR-11`), Archivar (`UC-STR-12` - pero guard falla si dependencias). `ACTIVE`: Actualizar datos (`UC-STR-10`), Archivar (`UC-STR-12` con guard). `ARCHIVED`: Solo consulta. |
| **Operaciones Rechazadas** | `ARCHIVED`: Actualizar (`UC-STR-10` rechaza), Activar (no restore en V1). Cualquier estado: Cambiar combinación temporada/división/línea (identidad inmutable). Archivar con dependencia activa (rechazo nombrando dependencia). |
| **Invariantes** | Combinación única temporada+división+línea (`REQ-STR-004`). Nombre derivado de combinación (`REQ-PPL-014`). Referencias por identidad (`REQ-STR-011`). Valla dependencias al archivar (`REQ-STR-006`). Subcomisión denegada (`REQ-STR-009`). |
| **REQ Relacionados** | `REQ-STR-004`, `REQ-STR-006`, `REQ-STR-008`, `REQ-STR-010`, `REQ-STR-011`, `REQ-STR-013`, `REQ-PPL-014`, `REQ-PPL-015` |
| **UC Relacionados** | `UC-STR-09`, `UC-STR-10`, `UC-STR-11`, `UC-STR-12` |
| **Referencias E5** | `GEI_UC_SPEC_STR_V1.md` §365–541 |

---

## SM-DIVISION-01 — Division (STR)

| Campo | Valor |
|---|---|
| **Objeto** | Division |
| **Dominio** | STR |
| **Motivo** | Lifecycle `ACTIVE→ARCHIVED` implícito con `archived_at`, guards de dependencias, terminal en V1 |
| **Source of Truth** | PT §19, REQ-STR-002/006/008, UC-STR-03/04/05, Actor Boundary Matrix §6 |
| **Estado Inicial** | `ACTIVE` (implícito tras `UC-STR-03`, no hay `DRAFT`) |
| **Estados Canónicos** | `ACTIVE`, `ARCHIVED` |
| **Definiciones** | `ACTIVE`: División creada, disponible para líneas y equipos. `ARCHIVED`: División archivada, historia conservada. **Terminal en V1** (`DEF-STR-001` defer). |
| **Tipo** | Persistido (timestamp `archived_at` en `divisions`) |
| **Estados Finales/Terminales** | `ARCHIVED` terminal en V1. |
| **Operaciones Permitidas por Estado** | `ACTIVE`: Actualizar nombre (`UC-STR-04` con guard), Archivar (`UC-STR-05` con guard). `ARCHIVED`: Solo consulta. |
| **Operaciones Rechazadas** | `ACTIVE`: Renombrar si tiene equipos activos (`REQ-PPL-014`). `ARCHIVED`: Actualizar, Restaurar (no en V1). Archivar con dependencia activa (rechazo nombrando dependencia). |
| **Invariantes** | Identidad estable por ID. Renombrar no reatribuye historia (`REQ-STR-011`). Valla dependencias (`REQ-STR-006`). Subcomisión denegada (`REQ-STR-009`). |
| **REQ Relacionados** | `REQ-STR-002`, `REQ-STR-006`, `REQ-STR-008`, `REQ-STR-011`, `REQ-PPL-014`, `REQ-PPL-015` |
| **UC Relacionados** | `UC-STR-03`, `UC-STR-04`, `UC-STR-05` |
| **Referencias E5** | `GEI_UC_SPEC_STR_V1.md` §103–230 |

---

## SM-LINE-01 — Line (STR)

| Campo | Valor |
|---|---|
| **Objeto** | Line |
| **Dominio** | STR |
| **Motivo** | Igual que Division: `ACTIVE→ARCHIVADA` implícita, guards, terminal en V1 |
| **Source of Truth** | PT §19, REQ-STR-003/006/008/010, UC-STR-06/07/08, Actor Boundary Matrix §6 |
| **Estado Inicial** | `ACTIVE` (implícito tras `UC-STR-06`) |
| **Estados Canónicos** | `ACTIVE`, `ARCHIVED` |
| **Definiciones** | `ACTIVE`: Línea creada dentro de división, disponible para equipos. `ARCHIVED`: Línea archivada, historia conservada. **Terminal en V1** (`DEF-STR-002` defer). |
| **Tipo** | Persistido (timestamp `archived_at` en `lines`) |
| **Estados Finales/Terminales** | `ARCHIVED` terminal en V1. |
| **Operaciones Permitidas por Estado** | `ACTIVE`: Actualizar nombre (`UC-STR-07` con guard), Archivar (`UC-STR-08` con guard). `ARCHIVED`: Solo consulta. |
| **Operaciones Rechazadas** | `ACTIVE`: Renombrar si tiene equipos activos. `ARCHIVED`: Actualizar, Restaurar. Archivar con dependencia activa. |
| **Invariantes** | Etiqueta completa incluye división y temporada (`REQ-STR-010`). Identidad por ID. Valla dependencias. Subcomisión denegada. |
| **REQ Relacionados** | `REQ-STR-003`, `REQ-STR-006`, `REQ-STR-008`, `REQ-STR-010`, `REQ-STR-011`, `REQ-PPL-014`, `REQ-PPL-015` |
| **UC Relacionados** | `UC-STR-06`, `UC-STR-07`, `UC-STR-08` |
| **Referencias E5** | `GEI_UC_SPEC_STR_V1.md` §233–361 |

---

## SM-VENUE-01 — Venue (STR)

| Campo | Valor |
|---|---|
| **Objeto** | Venue |
| **Dominio** | STR |
| **Motivo** | Lifecycle `ACTIVE→ARCHIVED` implícita con `archived_at`, identidad estable, guards, terminal en V1 |
| **Source of Truth** | PT §19, §11 (Venue rename semantics), REQ-STR-005/006/008/011/012/013, UC-STR-13/14/15, Actor Boundary Matrix §6 |
| **Estado Inicial** | `ACTIVE` (implícito tras `UC-STR-13`) |
| **Estados Canónicos** | `ACTIVE`, `ARCHIVED` |
| **Definiciones** | `ACTIVE`: Sede creada, disponible para eventos. `ARCHIVED`: Sede archivada, eventos que la usaron quedan históricos. **Terminal en V1**. |
| **Tipo** | Persistido (timestamp `archived_at` en `venues`) |
| **Estados Finales/Terminales** | `ARCHIVED` terminal en V1. |
| **Operaciones Permitidas por Estado** | `ACTIVE`: Corregir datos identidad (`UC-STR-14` regla A: sin efectos coordinación), Archivar (`UC-STR-15` con guard). `ARCHIVED`: Solo consulta. |
| **Operaciones Rechazadas** | `ACTIVE`: Cambiar sede de evento (eso es `UC-EVT-04` regla B, cambio material). `ARCHIVED`: Corregir, Restaurar. Archivar con dependencia activa. |
| **Invariantes** | Identidad estable por ID (`REQ-STR-011`). Regla A/B: corregir metadatos ≠ cambiar sede de evento (`REQ-STR-012`, PT §11). Valla dependencias (`REQ-STR-006`, `REQ-EVT-024`). Subcomisión denegada (`REQ-STR-009`). Estructura seleccionable de listas (`REQ-STR-013`). |
| **REQ Relacionados** | `REQ-STR-005`, `REQ-STR-006`, `REQ-STR-008`, `REQ-STR-011`, `REQ-STR-012`, `REQ-STR-013`, `REQ-EVT-011`, `REQ-EVT-024`, `REQ-PPL-015` |
| **UC Relacionados** | `UC-STR-13`, `UC-STR-14`, `UC-STR-15` |
| **Referencias E5** | `GEI_UC_SPEC_STR_V1.md` §544–669 |

---

## SM-EVENT-01 — Event (EVT)

| Campo | Valor |
|---|---|
| **Objeto** | Event |
| **Dominio** | EVT |
| **Motivo** | Modelo central y más complejo: 7 estados, subtipo Match, transiciones con autoridad, guards, efectos colaterales (disponibilidad, notificaciones, coordination_revision), estados terminales |
| **Source of Truth** | PT §9, §10, §11, §12, §14, §15, §16, REQ-EVT-001 a 024, REQ-PRT-001 a 019, REQ-COM-014/016/017, UC-EVT-01 a 19, UC-PRT-01/02/03/05/06/07/08/09/10, Actor Boundary Matrix §6 |
| **Estado Inicial** | `DRAFT` (transitorio, atómico a `SCHEDULED` en misma operación) |
| **Estados Canónicos** | `DRAFT`, `SCHEDULED`, `POSTPONED`, `CANCELLED`, `IN_PROGRESS`, `COMPLETED`, `ABANDONED` |
| **Definiciones** | `DRAFT`: Borrador de creación (no observable, `UC-EVT-01/02/03` nacen `SCHEDULED`). `SCHEDULED`: Evento programado con horario vigente, acepta disponibilidad, convocatoria (si Match), asistencia. `POSTPONED`: Aplazado, sin horario vigente, **conserva respuestas previas**, no acepta nuevas. `CANCELLED`: Cancelado, terminal para participación, composición propia, consecuencia explicada. `IN_PROGRESS`: En curso (inicio operacional). `COMPLETED`: Finalizado, **terminal absoluto**, no se reabre, habilita resultado `PLAYED/FORFEIT`. `ABANDONED`: Abandonado (solo Match), terminal, resultado `ABANDONED`, sin estadísticas reales. |
| **Tipo** | Persistido (columna `state` en `events`) |
| **Estados Finales/Terminales** | `CANCELLED`, `COMPLETED`, `ABANDONED` son terminales. No pseudonodo final: objeto persiste para historial/auditoría. `COMPLETED` y `ABANDONED` no tienen salidas. |
| **Operaciones Permitidas por Estado** | `SCHEDULED`: Editar no material (`UC-EVT-04`), Editar material (`UC-EVT-04` + `UC-EVT-11`), Posponer (`UC-EVT-05`), Cancelar (`UC-EVT-07`), Iniciar (`IN_PROGRESS`), Responder disponibilidad (`UC-PRT-01`), Preparar/Publicar convocatoria (`UC-PRT-02/03` si Match), Registrar asistencia (`UC-PRT-05`), Actualizar logística (`UC-EVT-16`). `POSTPONED`: Reanudar (`UC-EVT-06`), Cancelar (`UC-EVT-07`), Editar no material. `CANCELLED`: Restaurar (`UC-EVT-08`). `IN_PROGRESS`: Completar (`UC-EVT-09`), Abandonar (`UC-EVT-10` si Match), Registrar asistencia. `COMPLETED`/`ABANDONED`: Solo consulta, correcciones de asistencia/resultado (no reabren lifecycle). |
| **Operaciones Rechazadas** | `DRAFT`: Disponibilidad (`REQ-PRT-004`). `POSTPONED`: Nueva disponibilidad (`REQ-PRT-004`). `CANCELLED`/`COMPLETED`/`ABANDONED`: Disponibilidad, edición, convocatoria, asistencia nueva. `COMPLETED`: Reabrir (explícito en PT §9). `SCHEDULED` Match: Cambiar equipo (`REQ-EVT-006`). Cualquier: Editar en `COMPLETED`. |
| **Invariantes** | `end_at > start_at` si ambos existen (`REQ-EVT-001`). `SCHEDULED`/`IN_PROGRESS`/`COMPLETED` exigen `start_at` (`REQ-EVT-001`). `POSTPONED` puede no tener schedule. Match: exactamente 1 team target, 0 person targets, `club_wide=false`, subtipo row, team inmutable `SCHEDULED` (`REQ-EVT-006`, PT §10). Cambio material: incrementa `coordination_revision`, deriva `NEEDS_RECONFIRMATION`, notifica (`REQ-EVT-011/012`, `REQ-PRT-003`, `REQ-COM-014`). Corrección no retrocede lifecycle (PT §9). |
| **REQ Relacionados** | `REQ-EVT-001` a `REQ-EVT-024`, `REQ-PRT-001` a `REQ-PRT-019`, `REQ-COM-014/016/017`, `REQ-CMP-005`, `REQ-STR-012` |
| **UC Relacionados** | `UC-EVT-01` a `UC-EVT-19`, `UC-PRT-01` a `UC-PRT-10`, `UC-COM-13/14` |
| **Referencias E5** | `GEI_UC_SPEC_EVT_V1.md` §16–839, `GEI_UC_SPEC_PRT_V1.md` §15–578 |

### Subtipo Match — Variantes Adicionales

| Aspecto | Detalle |
|---|---|
| **Transición Extra** | `IN_PROGRESS → ABANDONED` (solo Match, `UC-EVT-10`) |
| **Restricción Extra** | Equipo inmutable una vez `SCHEDULED` (`REQ-EVT-006`) |
| **Resultado** | `MatchRecord` requiere `COMPLETED` para `PLAYED/FORFEIT`, `ABANDONED` para `ABANDONED` (`REQ-PRT-015`) |

---

## SM-EVENTSERIES-01 — EventSeries (EVT)

| Campo | Valor |
|---|---|
| **Objeto** | EventSeries |
| **Dominio** | EVT |
| **Motivo** | Lifecycle `ACTIVE→ENDED` con máx 366 ocurrencias, edición por alcances, terminal sin inversa |
| **Source of Truth** | PT §9, REQ-EVT-014/015/016, UC-EVT-13/14, UC-EVT-04 (alcances) |
| **Estado Inicial** | `ACTIVE` (tras `UC-EVT-13`) |
| **Estados Canónicos** | `ACTIVE`, `ENDED` |
| **Definiciones** | `ACTIVE`: Serie vigente con ocurrencias programadas. `ENDED`: Serie finalizada, ocurrencias conservadas. **Terminal sin transición inversa**. |
| **Tipo** | Persistido (columna `state` en `event_series`) |
| **Estados Finales/Terminales** | `ENDED` terminal. |
| **Operaciones Permitidas por Estado** | `ACTIVE`: Editar ocurrencias con 3 alcances (`UC-EVT-04`: solo esta / esta y siguientes / toda la serie), Finalizar (`UC-EVT-14`). `ENDED`: Solo consulta. |
| **Operaciones Rechazadas** | `ACTIVE`: Más de 366 ocurrencias (`RECURRENCE_TOO_LARGE`). `ENDED`: Reactivar, editar. |
| **Invariantes** | Máx 366 ocurrencias por comando (`REQ-EVT-016`). Alcances de cambio calculan impacto sobre conjunto real afectado, no total serie (`REQ-EVT-015`). `coordination_revision` sube solo en ocurrencias afectadas. |
| **REQ Relacionados** | `REQ-EVT-014`, `REQ-EVT-015`, `REQ-EVT-016`, `REQ-EVT-005`, `REQ-EVT-001`, `REQ-COM-016` |
| **UC Relacionados** | `UC-EVT-13`, `UC-EVT-14`, `UC-EVT-04` |
| **Referencias E5** | `GEI_UC_SPEC_EVT_V1.md` §542–626 |

---

## SM-AVAILABILITY-01 — Availability (PRT)

| Campo | Valor |
|---|---|
| **Objeto** | Availability |
| **Dominio** | PRT |
| **Motivo** | Valores persistidos (YES/MAYBE/NO) + estados derivados (NO_RESPONSE, NEEDS_RECONFIRMATION). Separación conceptual obligatoria. |
| **Source of Truth** | PT §9, §12, REQ-PRT-001/002/003/004/018/019, REQ-COM-017, REQ-EVT-017, UC-PRT-01, Actor Boundary Matrix §6 |
| **Estado Inicial** | `NO_RESPONSE` (derivado: ausencia de fila) |
| **Estados Canónicos** | **Persistidos:** `YES`, `MAYBE`, `NO`. **Derivados:** `NO_RESPONSE`, `NEEDS_RECONFIRMATION` |
| **Definiciones** | `YES`/`MAYBE`/`NO`: Respuesta registrada con fecha, visible en conteo. Nueva respuesta **sustituye** anterior. `NO_RESPONSE`: No existe fila de respuesta para esa persona/evento. **No es estado persistido**. `NEEDS_RECONFIRMATION`: Existe respuesta previa Y `event.coordination_revision > availability.coordination_revision` (cambio material previo). |
| **Tipo** | Mixto: valores persistidos en fila `availabilities` + derivados calculados |
| **Estados Finales/Terminales** | No aplica (no es máquina lineal). Los valores persistidos son mutables. |
| **Operaciones Permitidas** | `SCHEDULED`: Registrar/cambiar respuesta (`UC-PRT-01`): `YES/MAYBE/NO`. `POSTPONED`: Conserva respuestas, **no acepta nuevas** (`REQ-PRT-004`). Volver `SCHEDULED`: Reabre respuesta. |
| **Operaciones Rechazadas** | `DRAFT`/`CANCELLED`/`COMPLETED`/`ABANDONED`: Disponibilidad no aplica. `POSTPONED`: Nueva respuesta. Actor sin `PLAYER` vigente ni `GuardianRelationship.can_respond_availability`: denegado. Evento no alcanza a persona/menor: rechazado. |
| **Invariantes** | Disponibilidad, convocatoria, asistencia, habilitación **no se derivan entre sí** (`REQ-PRT-018`). Respuesta no genera notificación (`REQ-COM-017`). Matriz aplicabilidad por tipo (`REQ-PRT-019`, PT §12). `NO_RESPONSE` ≠ `NO`. `NEEDS_RECONFIRMATION` solo por cambio coordinativo (`REQ-PRT-003`). |
| **REQ Relacionados** | `REQ-PRT-001` a `REQ-PRT-004`, `REQ-PRT-018`, `REQ-PRT-019`, `REQ-COM-017`, `REQ-EVT-017`, `REQ-PPL-012` |
| **UC Relacionados** | `UC-PRT-01` |
| **Referencias E5** | `GEI_UC_SPEC_PRT_V1.md` §15–60 |
| **Nota Diagrama** | Separar visualmente: nodos persistidos (YES/MAYBE/NO) vs derivados (NO_RESPONSE, NEEDS_RECONFIRMATION). **No flecha `NO_RESPONSE → YES`**. |

---

## SM-SELECTIONREV-01 — SelectionRevision (PRT)

| Campo | Valor |
|---|---|
| **Objeto** | SelectionRevision |
| **Dominio** | PRT |
| **Motivo** | Borrador editable (`DRAFT`) → Publicación inmutable (`PUBLISHED`). Republicar = nueva revisión. Inmutabilidad clave. |
| **Source of Truth** | PT §9, REQ-PRT-005/006/008, UC-PRT-02/03/04, Actor Boundary Matrix §6 |
| **Estado Inicial** | `DRAFT` (borrador de trabajo en `UC-PRT-02`) |
| **Estados Canónicos** | `DRAFT`, `PUBLISHED` |
| **Definiciones** | `DRAFT`: Borrador editable con guardado automático (5 estados de guardado), refresco no pisa lo escrito. `PUBLISHED`: Revisión inmutable publicada. **No se reescribe**. Republicar crea nueva revisión `PUBLISHED` distinta. |
| **Tipo** | Persistido (tabla `selection_revisions` con `status` implícito por existencia) |
| **Estados Finales/Terminales** | `PUBLISHED` terminal (inmutable). No pseudonodo final: revisiones persisten en historial. |
| **Operaciones Permitidas por Estado** | `DRAFT`: Editar, Guardado automático (`UC-PRT-02`), Publicar (`UC-PRT-03` → `PUBLISHED`). `PUBLISHED`: Solo consulta, revisar conflictos (`UC-PRT-04` SIBLING). |
| **Operaciones Rechazadas** | `PUBLISHED`: Editar, borrar, modificar. Publicación no se bloquea por conflictos derivados (`REQ-PRT-006`). |
| **Invariantes** | Publicación crea revisión inmutable. Republicar = nueva revisión sin reescribir anterior. Guardado automático 600ms, una en vuelo (`REQ-PRT-008`). Publicación exige `SCHEDULED` + tipo `MATCH` (`REQ-PRT-005`). Conflictos derivados: `ELIGIBILITY_BLOCKED/PENDING`, `NO_LONGER_EVENT_TARGET`, `NO_LONGER_TEAM_AFFILIATED` (PT §14). |
| **REQ Relacionados** | `REQ-PRT-005`, `REQ-PRT-006`, `REQ-PRT-008`, `REQ-PRT-017`, `REQ-PRT-018`, `REQ-COM-015`, `REQ-EVT-017`, `REQ-SYS-018` |
| **UC Relacionados** | `UC-PRT-02`, `UC-PRT-03`, `UC-PRT-04` |
| **Referencias E5** | `GEI_UC_SPEC_PRT_V1.md` §62–190 |

---

## SM-ATTENDANCEENTRY-01 — AttendanceEntry (PRT)

| Campo | Valor |
|---|---|
| **Objeto** | AttendanceEntry |
| **Dominio** | PRT |
| **Motivo** | 3 valores persistidos mutables con corrección auditada, `UNRECORDED` derivado por ausencia de fila |
| **Source of Truth** | PT §9, §12, REQ-PRT-009/010/011/012/019, UC-PRT-05/06/07, Actor Boundary Matrix §6 |
| **Estado Inicial** | `UNRECORDED` (derivado: sin fila) |
| **Estados Canónicos** | **Persistidos:** `PRESENT`, `ABSENT`, `JUSTIFIED`. **Derivado:** `UNRECORDED` |
| **Definiciones** | `PRESENT`/`ABSENT`/`JUSTIFIED`: Valor persistido con timestamp. `UNRECORDED`: Sin fila en `attendance_entries` para esa persona/evento. **Estado propio distinguible de `ABSENT`** (`REQ-PRT-010`). |
| **Tipo** | Mixto: valores persistidos + derivado por ausencia |
| **Estados Finales/Terminales** | No aplica (valores mutables). |
| **Operaciones Permitidas por Estado** | Planilla `OPEN` (`UC-PRT-05`): Marcar `PRESENT/ABSENT/JUSTIFIED` (persistencia inmediata). Planilla `CLOSED`: No marcaje nuevo. Corrección (`UC-PRT-07`): Cambiar valor con motivo obligatorio, persiste anterior/nuevo/motivo/autor/fecha. |
| **Operaciones Rechazadas** | Planilla `CLOSED`: Marcaje directo sin corrección (`REQ-PRT-011`). Evento tipo no admite asistencia (`REQ-PRT-019`). Actor sin autoridad: denegado. |
| **Invariantes** | `UNRECORDED` ≠ `ABSENT` (nunca se convierte, informe no cuenta como ausente). Corrección no reabre planilla (`REQ-PRT-011` NOTES). Matriz aplicabilidad por tipo (`REQ-PRT-019`). Asistencia ≠ participación en partido (`REQ-PRT-016`). |
| **REQ Relacionados** | `REQ-PRT-009`, `REQ-PRT-010`, `REQ-PRT-011`, `REQ-PRT-012`, `REQ-PRT-019`, `REQ-EVT-017`, `REQ-COM-017`, `REQ-INS-011` |
| **UC Relacionados** | `UC-PRT-05`, `UC-PRT-06`, `UC-PRT-07` |
| **Referencias E5** | `GEI_UC_SPEC_PRT_V1.md` §193–321 |

---

## SM-MATCHRECORD-01 — MatchRecord (PRT)

| Campo | Valor |
|---|---|
| **Objeto** | MatchRecord |
| **Dominio** | PRT |
| **Motivo** | `DRAFT → FINAL` terminal, corrección explícita separada con historia, compatibilidad con ciclo de Event |
| **Source of Truth** | PT §9, §15, REQ-PRT-013/014/015/016, UC-PRT-08/09/10/11, Actor Boundary Matrix §6 |
| **Estado Inicial** | `DRAFT` (tras `UC-PRT-08`) |
| **Estados Canónicos** | `DRAFT`, `FINAL` |
| **Definiciones** | `DRAFT`: Borrador de resultado, editable. `FINAL`: Resultado final oficial, **terminal por vía normal**, habilita estadísticas de partido (`PLAYED`), partidos jugados derivados del resultado. |
| **Tipo** | Persistido (columna `status` en `match_records`) |
| **Estados Finales/Terminales** | `FINAL` terminal. No pseudonodo final: persiste con historia. |
| **Operaciones Permitidas por Estado** | `DRAFT`: Editar, Finalizar (`UC-PRT-09` → `FINAL`). `FINAL`: Corregir (`UC-PRT-10`: operación separada con motivo, persiste anterior/nuevo/motivo/autor/fecha, **no transición inversa**), Consultar estadísticas (`UC-PRT-11` solo `PLAYED`). |
| **Operaciones Rechazadas** | `FINAL`: Editar por vía normal (`REQ-PRT-013`). `DRAFT`: Finalizar si ciclo evento incompatible (`MATCH_STATE_INCOMPATIBLE`: `PLAYED/FORFEIT` exige `COMPLETED`, `ABANDONED` exige `ABANDONED`). Actor sin autoridad: denegado (Admin no registra resultados). |
| **Invariantes** | `REQ-PRT-015`: `PLAYED/FORFEIT` ⇒ Event `COMPLETED`; `ABANDONED` ⇒ Event `ABANDONED`. Resultado no fija estado inexistente en Event. Estadísticas solo `PLAYED` (`REQ-PRT-016`). Partidos jugados derivados del resultado, no asistencia. Corrección no retrocede lifecycle (`REQ-PRT-014`). **Distinto de Event Match**: `Event COMPLETED` ≠ `MatchRecord FINAL` automático. |
| **REQ Relacionados** | `REQ-PRT-013` a `REQ-PRT-016`, `REQ-PRT-019`, `REQ-INS-005`, `REQ-INS-011` |
| **UC Relacionados** | `UC-PRT-08`, `UC-PRT-09`, `UC-PRT-10`, `UC-PRT-11` |
| **Referencias E5** | `GEI_UC_SPEC_PRT_V1.md` §324–492 |

---

## SM-ELIGIBILITY-01 — EligibilityConstraint (PRT)

| Campo | Valor |
|---|---|
| **Objeto** | EligibilityConstraint |
| **Dominio** | PRT |
| **Motivo** | Estados persistidos `PENDING/BLOCKED` + vigencia temporal + estado derivado `ELIGIBLE` |
| **Source of Truth** | PT §13, §9, REQ-PRT-017, REQ-CMP-007/008, UC-PRT-12/13, Actor Boundary Matrix §6 |
| **Estado Inicial** | `PENDING` o `BLOCKED` (según creación en `UC-PRT-12`) |
| **Estados Canónicos** | **Persistidos:** `PENDING`, `BLOCKED`. **Derivado:** `ELIGIBLE` (sin restricción activa aplicable) |
| **Definiciones** | `PENDING`: Restricción registrada pendiente de resolución. `BLOCKED`: Restricción activa que bloquea participación. `ELIGIBLE`: Derivado = no existe `EligibilityConstraint` activa (`now ∈ [validFrom, validUntil)`) con `state=BLOCKED` aplicable al scope. |
| **Tipo** | Mixto: estados persistidos en fila + vigencia temporal + derivado |
| **Estados Finales/Terminales** | No aplica (la vigencia controla aplicabilidad). |
| **Operaciones Permitidas** | Registrar restricción (`UC-PRT-12`): crea fila con estado, alcance (`CLUB/COMPETITION/ENTRY/EVENT`), origen (`INTERNAL/AHBA/OTHER`), motivo (`ADMIN/DISCIPLINE/FEDERATION/MEDICAL_CLEARANCE/OTHER`), vigencia. **No hay CU de finalizar**: la vigencia se registra en la creación. Consultar (`UC-PRT-13`): visibilidad por autoridad (Coach ve estado+alcance; Subcomisión/Admin ve motivo+origen). |
| **Operaciones Rechazadas** | Actor sin autoridad (Solo Subcomisión/Admin registran; Coach solo lectura estado). |
| **Invariantes** | `ELIGIBLE` **nunca** se infiere de disponibilidad (`REQ-PRT-018`). Sin datos clínicos (`REQ-CMP-007`, PT §13). Límite federativo: referencia es referencia, no verdad federativa. Toda mutación auditada (`REQ-CMP-008`). Alcance limita dónde aplica (`REQ-CMP-008`). |
| **REQ Relacionados** | `REQ-PRT-017`, `REQ-CMP-007`, `REQ-CMP-008`, `REQ-PPL-015`, `REQ-INS-009` |
| **UC Relacionados** | `UC-PRT-12`, `UC-PRT-13` |
| **Referencias E5** | `GEI_UC_SPEC_PRT_V1.md` §495–578 |

---

## SM-ANNOUNCEMENT-01 — Announcement (COM)

| Campo | Valor |
|---|---|
| **Objeto** | Announcement |
| **Dominio** | COM |
| **Motivo** | `DRAFT→PUBLISHED→ARCHIVED` con audiencia snapshot inmutable en PUBLISHED, solo Subcomisión |
| **Source of Truth** | PT §9, §21, REQ-COM-001/002/003/004/005, UC-COM-01/02/03/04/05, Actor Boundary Matrix §6 |
| **Estado Inicial** | `DRAFT` (tras `UC-COM-01`) |
| **Estados Canónicos** | `DRAFT`, `PUBLISHED`, `ARCHIVED` |
| **Definiciones** | `DRAFT`: Borrador con título, cuerpo, audiencia (conjunto real de equipos o club). `PUBLISHED`: Publicado, **audiencia fijada como snapshot inmutable**, notifica a alcanzados. `ARCHIVED`: Archivado, deja de estar vigente, contenido e historia conservados. |
| **Tipo** | Persistido (columna `status` en `announcements`) |
| **Estados Finales/Terminales** | `ARCHIVED` terminal. |
| **Operaciones Permitidas por Estado** | `DRAFT`: Publicar (`UC-COM-02` → `PUBLISHED`). `PUBLISHED`: Corregir título/cuerpo con motivo (`UC-COM-03`, **audiencia no cambia**), Archivar (`UC-COM-04` → `ARCHIVED`), Consultar (`UC-COM-05` solo audiencia). `ARCHIVED`: Solo consulta. |
| **Operaciones Rechazadas** | `PUBLISHED`: Cambiar audiencia (inmutable, `REQ-COM-003`). `DRAFT`/`ARCHIVED`: Consultar por no audiencia (recurso no disponible). Actor ≠ Subcomisión: denegado (`REQ-COM-001`). |
| **Invariantes** | Audiencia = conjunto real de equipos, nunca texto libre (`REQ-COM-002`). Snapshot inmutable al publicar (`REQ-COM-003`). Corrección no cambia audiencia (`REQ-COM-004`). Audiencia incorrecta ⇒ comunicado nuevo. Lectura restringida a audiencia (`REQ-COM-005`). Solo 7 tipos notificación (`REQ-COM-014`). |
| **REQ Relacionados** | `REQ-COM-001` a `REQ-COM-005`, `REQ-COM-014`, `REQ-STR-013`, `REQ-PPL-015`, `REQ-SYS-006/007/012` |
| **UC Relacionados** | `UC-COM-01` a `UC-COM-05` |
| **Referencias E5** | `GEI_UC_SPEC_COM_V1.md` §16–224 |

---

## SM-CONVERSATION-GROUP-01 — Conversation (GROUP) (COM)

| Campo | Valor |
|---|---|
| **Objeto** | Conversation (tipo GROUP) |
| **Dominio** | COM |
| **Motivo** | Único tipo de conversación con lifecycle `ACTIVE→ARCHIVED` (DIRECT/TEAM/EVENT no tienen machine) |
| **Source of Truth** | PT §9, §20, REQ-COM-007/011/012, UC-COM-07/12, Actor Boundary Matrix §6 |
| **Estado Inicial** | `ACTIVE` (tras `UC-COM-07`) |
| **Estados Canónicos** | `ACTIVE`, `ARCHIVED` |
| **Definiciones** | `ACTIVE`: Grupo creado, ≥2 participantes, título, participantes con `joined_at`/`left_at`. `ARCHIVED`: Archivado por participante, contenido y períodos conservados. |
| **Tipo** | Persistido (columna `status` en `conversations` donde `type=GROUP`) |
| **Estados Finales/Terminales** | `ARCHIVED` terminal. |
| **Operaciones Permitidas por Estado** | `ACTIVE`: Enviar mensaje (`UC-COM-09`), Editar/Eliminar propio (`UC-COM-10/11`), Archivar (`UC-COM-12` → `ARCHIVED`). `ARCHIVED`: Solo lectura histórico (sin nuevos mensajes). |
| **Operaciones Rechazadas** | `ARCHIVED`: Enviar/Editar/Eliminar mensajes. Archivar conversación DIRECT/TEAM/EVENT (no permitido, `REQ-COM-007` AC 4). Actor sin derecho comunicacional: denegado (`REQ-COM-012`). Admin/Subcomisión sin participación: no leen (`REQ-COM-011`). |
| **Invariantes** | Múltiples grupos entre mismas personas permitidos. Título requerido. Acceso temporal: `joined_at`/`left_at`, sin historia anterior a ingreso, ex-participante conserva período. Derecho comunicacional automático: `PLAYER/CAPTAIN/COACH` (`REQ-COM-012`). Guardian sin accesorio. Admin/Subcomisión sin acceso automático a privados. |
| **REQ Relacionados** | `REQ-COM-007`, `REQ-COM-009`, `REQ-COM-010`, `REQ-COM-011`, `REQ-COM-012`, `REQ-PPL-004`, `REQ-COM-017`, `REQ-SYS-016`, `REQ-PPL-015` |
| **UC Relacionados** | `UC-COM-07`, `UC-COM-09`, `UC-COM-10`, `UC-COM-11`, `UC-COM-12` |
| **Referencias E5** | `GEI_UC_SPEC_COM_V1.md` §268–519 |

---

## SM-MESSAGE-01 — Message (COM)

| Campo | Valor |
|---|---|
| **Objeto** | Message |
| **Dominio** | COM |
| **Motivo** | `SENT → EDITED* → DELETED` (tombstone), solo mensajes propios, historia expuesta |
| **Source of Truth** | PT §9, REQ-COM-009/010/011, UC-COM-09/10/11, Actor Boundary Matrix §6 |
| **Estado Inicial** | `SENT` (tras `UC-COM-09`) |
| **Estados Canónicos** | `SENT`, `EDITED`, `DELETED` |
| **Definiciones** | `SENT`: Mensaje persistido visible. `EDITED`: Mensaje corregido al menos una vez, historia expuesta con fecha real y actor. `DELETED`: Tombstone irreversible (contenido desaparece, hecho de existencia y borrado permanece), confirmación con motivo obligatoria. |
| **Tipo** | Persistido (columna `status` o `deleted_at` en `messages`) |
| **Estados Finales/Terminales** | `DELETED` terminal (tombstone). |
| **Operaciones Permitidas por Estado** | `SENT`: Editar propio (`UC-COM-10` → `EDITED`), Eliminar propio (`UC-COM-11` → `DELETED`). `EDITED`: Editar propio (permanece `EDITED`), Eliminar propio (`UC-COM-11` → `DELETED`). `DELETED`: Ninguna. |
| **Operaciones Rechazadas** | Mensaje ajeno: editar/eliminar denegado. Sin autoría: sin operación. Eliminar sin confirmación+motivo: no ejecuta. |
| **Invariantes** | Solo mensajes propios. Edición expone historia (`REQ-INS-011`). Tombstone irreversible. Reintento idempotente sin duplicar (`REQ-SYS-016`). Enviar no notifica (`REQ-COM-017`). Acceso temporal autoritativo (`REQ-COM-011`). |
| **REQ Relacionados** | `REQ-COM-009`, `REQ-COM-010`, `REQ-COM-011`, `REQ-COM-017`, `REQ-SYS-016`, `REQ-PPL-015`, `REQ-INS-011` |
| **UC Relacionados** | `UC-COM-09`, `UC-COM-10`, `UC-COM-11` |
| **Referencias E5** | `GEI_UC_SPEC_COM_V1.md` §354–476 |

---

## SM-COMPETITION-01 — Competition (CMP)

| Campo | Valor |
|---|---|
| **Objeto** | Competition |
| **Dominio** | CMP |
| **Motivo** | `DRAFT→ACTIVE→CLOSED` con guard 0 inscripciones activas, solo Subcomisión/Admin |
| **Source of Truth** | PT §9, REQ-CMP-001/002/003/006, UC-CMP-01/02/03, Actor Boundary Matrix §6 |
| **Estado Inicial** | `DRAFT` (tras `UC-CMP-01`) |
| **Estados Canónicos** | `DRAFT`, `ACTIVE`, `CLOSED` |
| **Definiciones** | `DRAFT`: Competencia registrada, no admite inscripciones. `ACTIVE`: Abierta para inscripciones de equipos/líneas. `CLOSED`: Cerrada, histórico conservado. **Terminal en V1**. |
| **Tipo** | Persistido (columna `status` en `competitions`) |
| **Estados Finales/Terminales** | `CLOSED` terminal. |
| **Operaciones Permitidas por Estado** | `DRAFT`: Activar (`UC-CMP-02` → `ACTIVE`), Registrar referencia externa (`UC-CMP-08`). `ACTIVE`: Inscribir equipo/línea (`UC-CMP-04/05` → `PENDING`), Cerrar (`UC-CMP-03` con guard), Registrar referencia. `CLOSED`: Solo consulta, referencia externa. |
| **Operaciones Rechazadas** | `ACTIVE`: Cerrar con inscripciones activas (rechazo explicándolas, `REQ-CMP-002`). `CLOSED`: Reactivar, nuevas inscripciones. Actor sin rol Subcomisión/Admin: denegado. |
| **Invariantes** | Ciclo `DRAFT→ACTIVE→CLOSED` (`REQ-CMP-001`). Referencia externa solo `COMPETITION/COMPETITION_ENTRY/MATCH_EVENT` (`REQ-CMP-006`). Límite federativo: referencia no es verdad (`REQ-CMP-007`). Subcomisión/Admin gestionan (`REQ-CMP-003`). Coach solo lectura referencias (`UC-CMP-09`). |
| **REQ Relacionados** | `REQ-CMP-001`, `REQ-CMP-002`, `REQ-CMP-003`, `REQ-CMP-006`, `REQ-CMP-007`, `REQ-EVT-024`, `REQ-PPL-015` |
| **UC Relacionados** | `UC-CMP-01`, `UC-CMP-02`, `UC-CMP-03`, `UC-CMP-08`, `UC-CMP-09` |
| **Referencias E5** | `GEI_UC_SPEC_CMP_V1.md` §16–141 |

---

## SM-COMPETITIONENTRY-01 — CompetitionEntry (CMP)

| Campo | Valor |
|---|---|
| **Objeto** | CompetitionEntry |
| **Dominio** | CMP |
| **Motivo** | `PENDING→ACTIVE→ENDED` con scopes de dato `TEAM`/`LINE` (NO estados), guard compatibilidad, serialización |
| **Source of Truth** | PT §9, §4, REQ-CMP-003/004/005, UC-CMP-04/05/06/07, Actor Boundary Matrix §6 |
| **Estado Inicial** | `PENDING` (tras `UC-CMP-04` o `UC-CMP-05`) |
| **Estados Canónicos** | `PENDING`, `ACTIVE`, `ENDED` |
| **Definiciones** | `PENDING`: Inscripción registrada, pendiente de activación. Identificada por `scope=TEAM` (team_id) o `scope=LINE` (division+line+season). `ACTIVE`: Inscripción activa, usable por partidos de esa competencia. `ENDED`: Finalizada, histórico conservado, consecuencia explicada. |
| **Tipo** | Persistido (columna `status` en `competition_entries`) |
| **Estados Finales/Terminales** | `ENDED` terminal. |
| **Operaciones Permitidas por Estado** | `PENDING`: Activar (`UC-CMP-06` → `ACTIVE` con guard compatibilidad alcance). `ACTIVE`: Finalizar (`UC-CMP-07` → `ENDED`, serialización si en uso). `ENDED`: Solo consulta. |
| **Operaciones Rechazadas** | `PENDING`: Usar en partido (requiere `ACTIVE`). `ACTIVE`: Cambiar scope (`TEAM`↔`LINE` incompatibles, `COMPETITION_SCOPE_MISMATCH`). `ENDED`: Reactivar. Partido con scope incompatible: rechazo con causa en lenguaje usuario. |
| **Invariantes** | `TEAM` y `LINE` son **alcances de dato**, no etapas de lifecycle (`REQ-CMP-004`, PT §4). Uso en partido: scope compatible con jornada (`REQ-CMP-005`, PT §16). Cerrar competencia requiere 0 entries `ACTIVE` (`REQ-CMP-002`). `EndCompetitionEntry` participa en `ReferenceAdmissionFence` (PT §33). |
| **REQ Relacionados** | `REQ-CMP-003`, `REQ-CMP-004`, `REQ-CMP-005`, `REQ-CMP-008`, `REQ-EVT-024`, `REQ-PPL-015`, `REQ-SYS-018` |
| **UC Relacionados** | `UC-CMP-04`, `UC-CMP-05`, `UC-CMP-06`, `UC-CMP-07`, `UC-CMP-09` |
| **Referencias E5** | `GEI_UC_SPEC_CMP_V1.md` §144–401 |

---

# 3. MODELOS TEMPORALES Y DERIVADOS (SIN DIAGRAMA PROPIO)

Estos se documentan aquí para trazabilidad pero **no generan diagrama Draw.io**.

| Objeto | Modelo | Estados/Valores | Referencia Catálogo |
|---|---|---|---|
| Membership | `TEMPORAL_VALIDITY_MODEL` | Vigencia `[valid_from, valid_until)` | Auditoría §4.2 |
| TeamAssignment | `TEMPORAL_VALIDITY_MODEL` | Vigencia `[valid_from, valid_until)` | Auditoría §4.2 |
| RoleAssignment | `TEMPORAL_VALIDITY_MODEL` | Vigencia `[valid_from, valid_until)` | Auditoría §4.2 |
| GuardianRelationship | `TEMPORAL_VALIDITY_MODEL` | Vigencia `[valid_from, valid_until)` + flags `can_view_child_info`, `can_respond_availability` | Auditoría §4.2 |
| Selection (contenedor) | `TEMPORAL_VALIDITY_MODEL` | Borrador actual (mutable) + historial revisiones `PUBLISHED` | Catálogo `SM-SELECTIONREV-01` |
| AttendanceSheet | `TEMPORAL_VALIDITY_MODEL` | `OPEN` (`closed_at` NULL) / `CLOSED` (`closed_at` timestamp) | Catálogo `SM-ATTENDANCEENTRY-01` |
| Availability (derivados) | `DERIVED_STATE_MODEL` | `NO_RESPONSE` (sin fila), `NEEDS_RECONFIRMATION` (resp. previa + coordination_revision) | Catálogo `SM-AVAILABILITY-01` |
| Notification | `DERIVED_STATE_MODEL` | `UNREAD` (`read_at` NULL) / `READ` (`read_at` timestamp) | Catálogo `SM-MESSAGE-01` (sección COM) |
| Conversation (DIRECT) | `NO_STATE_MACHINE` | Única por par canónico, membresía temporal | Auditoría §4.6 |
| Conversation (TEAM/EVENT) | `NO_STATE_MACHINE` | 0..1 por objeto real, título derivado, membresía sync | Auditoría §4.6 |
| Season | `NO_STATE_MACHINE` | Histórica, sin estado, solo timestamps | Auditoría §4.3 |
| Jornada | `NO_STATE_MACHINE` | Contenedor atómico, sin lifecycle propio | Auditoría §4.4 |

---

# 4. RESUMEN

| Métrica | Valor |
|---|---|
| Máquinas `STATE_MACHINE_REQUIRED` | 17 |
| Modelos `TEMPORAL_VALIDITY_MODEL` | 6 |
| Modelos `DERIVED_STATE_MODEL` | 2 |
| `NO_STATE_MACHINE` | 4 |
| Total objetos evaluados | 29 |

**Próximo:** E6-04 — Matriz completa de transiciones (`GEI_STATE_TRANSITION_MATRIX_V1.md`).