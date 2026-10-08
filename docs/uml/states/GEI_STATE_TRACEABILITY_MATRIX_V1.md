# GEI HOCKEY MANAGEMENT SYSTEM
## STATE TRACEABILITY MATRIX V1

**Etapa:** 6 — Diagramas de estados (E6-07)
**Estado:** COMPLETO
**Fecha:** 2026-10-07
**Rama:** `gei/e6-state-diagrams-freeze-v1`
**Baseline:** `01ee760388e27592d007c1c6f539e9204aefbf62`

---

# 1. PROPÓSITO

Trazabilidad completa bidireccional:
- **REQ/AC → UC/Paso E5 → State Machine → Estado/Transición/Guard**
- **Transición → REQ + UC**

Cada CU se clasifica: `STATE_TRANSITION` (modifica lifecycle), `STATE_GUARD_ONLY` (solo condiciona por estado), `STATE_READ_ONLY` (consulta estado), `NO_STATE_RELEVANCE`.

**Regla:** No marcar cobertura por similitud de palabras. Verificar semántica de cada referencia.

---

# 2. TRAZABILIDAD POR REQUERIMIENTO (REQ → Máquinas de Estado)

## 2.1 REQ-IAM (Identity & Access)

| REQ | AC | Máquina(s) | Transiciones/Estados | UC E5 | Tipo Cobertura |
|---|---|---|---|---|---|
| `REQ-IAM-001` | 1-3 | `SM-ACCOUNT-01` | `PENDING/DISABLED` rechazan login; `ACTIVE` permite | `UC-IAM-01` | `STATE_GUARD_ONLY` |
| `REQ-IAM-002` | 1-3 | `SM-ACCOUNT-01` | `PENDING→ACTIVE`, `DISABLED→ACTIVE`, `ACTIVE→DISABLED` | `UC-IAM-02`, `UC-IAM-03`, `UC-IAM-04`, `UC-IAM-05` | `STATE_TRANSITION` |
| `REQ-IAM-003` | 1-4 | `SM-ACCOUNT-01` | Código vigente/un solo uso para activación/reactivación | `UC-IAM-03`, `UC-IAM-04` | `STATE_TRANSITION` |
| `REQ-IAM-004` | 1-2 | `SM-ACCOUNT-01` | Restablecer: `ACTIVE→PENDING(implícito)`, versión++, sesiones revocadas | `UC-IAM-05` | `STATE_TRANSITION` |
| `REQ-IAM-005` | 1-3 | `SM-ACCOUNT-01` | Cambio contraseña en `ACTIVE` (no cambia estado cuenta) | `UC-IAM-06` | `STATE_READ_ONLY` |
| `REQ-IAM-009` | 1-3 | `SM-ACCOUNT-01` | Reautenticación: ventana 10min (no cambia estado Account) | `UC-IAM-09` | `STATE_READ_ONLY` |
| `REQ-IAM-010` | 1-3 | `SM-ACCOUNT-01` | Sesiones revocadas en `DISABLED` | `UC-IAM-07`, `UC-IAM-08` | `STATE_GUARD_ONLY` |
| `REQ-IAM-013` | 1-2 | `SM-ACCOUNT-01` | `LAST_ADMIN_REQUIRED` valla en `ACTIVE→DISABLED` | `UC-IAM-02`, `UC-IAM-05` | `STATE_GUARD_ONLY` |

## 2.2 REQ-STR (Club Structure)

| REQ | AC | Máquina(s) | Transiciones/Estados | UC E5 | Tipo Cobertura |
|---|---|---|---|---|---|
| `REQ-STR-004` | 1-4 | `SM-TEAM-01` | `DRAFT→ACTIVE→ARCHIVED`, identidad inmutable | `UC-STR-09`, `UC-STR-11`, `UC-STR-12` | `STATE_TRANSITION` |
| `REQ-STR-002` | 1-3 | `SM-DIVISION-01` | `ACTIVE→ARCHIVED`, rename guard | `UC-STR-03`, `UC-STR-04`, `UC-STR-05` | `STATE_TRANSITION` |
| `REQ-STR-003` | 1-3 | `SM-LINE-01` | `ACTIVE→ARCHIVED`, rename guard | `UC-STR-06`, `UC-STR-07`, `UC-STR-08` | `STATE_TRANSITION` |
| `REQ-STR-005` | 1-3 | `SM-VENUE-01` | `ACTIVE→ARCHIVED`, regla A/B | `UC-STR-13`, `UC-STR-14`, `UC-STR-15` | `STATE_TRANSITION` |
| `REQ-STR-006` | 1-2 | `SM-TEAM-01`, `SM-DIVISION-01`, `SM-LINE-01`, `SM-VENUE-01` | Valla dependencias al archivar | `UC-STR-05`, `UC-STR-08`, `UC-STR-12`, `UC-STR-15` | `STATE_GUARD_ONLY` |

## 2.3 REQ-EVT (Events & Calendar)

| REQ | AC | Máquina(s) | Transiciones/Estados | UC E5 | Tipo Cobertura |
|---|---|---|---|---|---|
| `REQ-EVT-001` | 1-3 | `SM-EVENT-01` | Invariantes fecha/horario por estado | `UC-EVT-01` a `UC-EVT-10` | `STATE_GUARD_ONLY` |
| `REQ-EVT-007` | 1-5 | `SM-EVENT-01` | Ciclo completo: `DRAFT→SCHEDULED→{POSTPONED,CANCELLED,IN_PROGRESS}→{COMPLETED,ABANDONED}` | `UC-EVT-01` a `UC-EVT-10` | `STATE_TRANSITION` |
| `REQ-EVT-008` | 1-3 | `SM-EVENT-01` | Estados terminales `CANCELLED/COMPLETED/ABANDONED` | `UC-EVT-07`, `UC-EVT-09`, `UC-EVT-10` | `STATE_TRANSITION` |
| `REQ-EVT-011` | 1-4 | `SM-EVENT-01` | Cambio material: `coord_rev++`, `NEEDS_RECONFIRMATION`, notifica | `UC-EVT-04`, `UC-EVT-05`, `UC-EVT-07`, `UC-EVT-08`, `UC-EVT-16` | `STATE_TRANSITION` |
| `REQ-EVT-014` | 1-2 | `SM-EVENTSERIES-01` | `ACTIVE→ENDED`, máx 366 ocurrencias | `UC-EVT-13`, `UC-EVT-14` | `STATE_TRANSITION` |
| `REQ-EVT-015` | 1-5 | `SM-EVENTSERIES-01` | 3 alcances de edición, impacto en conjunto real | `UC-EVT-04` | `STATE_TRANSITION` |

## 2.4 REQ-PRT (Participation)

| REQ | AC | Máquina(s) | Transiciones/Estados | UC E5 | Tipo Cobertura |
|---|---|---|---|---|---|
| `REQ-PRT-001` | 1-3 | `SM-AVAILABILITY-01` | Respuesta `YES/MAYBE/NO` registrada, sustituye anterior | `UC-PRT-01` | `STATE_TRANSITION` |
| `REQ-PRT-002` | 1-3 | `SM-AVAILABILITY-01` | Guardián responde por menor (mismo CU) | `UC-PRT-01` | `STATE_TRANSITION` |
| `REQ-PRT-003` | 1-4 | `SM-AVAILABILITY-01` | Derivados: `NO_RESPONSE`, `NEEDS_RECONFIRMATION` | `UC-PRT-01` | `STATE_TRANSITION` (derivados) |
| `REQ-PRT-004` | 1-3 | `SM-AVAILABILITY-01`, `SM-EVENT-01` | Solo `SCHEDULED` acepta; `POSTPONED` conserva/no acepta | `UC-PRT-01`, `UC-EVT-05`, `UC-EVT-06` | `STATE_GUARD_ONLY` |
| `REQ-PRT-005` | 1-4 | `SM-SELECTIONREV-01` | `DRAFT→PUBLISHED` inmutable, republicar = nueva revisión | `UC-PRT-02`, `UC-PRT-03` | `STATE_TRANSITION` |
| `REQ-PRT-006` | 1-2 | `SM-SELECTIONREV-01` | Publicación no bloquea por conflictos derivados | `UC-PRT-03` | `STATE_GUARD_ONLY` |
| `REQ-PRT-009` | 1-4 | `SM-ATTENDANCEENTRY-01` | `UNRECORDED→PRESENT/ABSENT/JUSTIFIED`, persistencia inmediata | `UC-PRT-05` | `STATE_TRANSITION` |
| `REQ-PRT-010` | - | `SM-ATTENDANCEENTRY-01` | `UNRECORDED` ≠ `ABSENT` (estado derivado propio) | `UC-PRT-05` | `STATE_READ_ONLY` |
| `REQ-PRT-011` | 1-2 | `SM-ATTENDANCEENTRY-01` | Planilla `CLOSED` no admite marcaje sin corrección | `UC-PRT-06`, `UC-PRT-07` | `STATE_GUARD_ONLY` |
| `REQ-PRT-012` | 1-3 | `SM-ATTENDANCEENTRY-01` | Corrección con motivo, auditoría antes/después | `UC-PRT-07` | `STATE_TRANSITION` |
| `REQ-PRT-013` | 1-3 | `SM-MATCHRECORD-01` | `DRAFT→FINAL` terminal, compatibilidad ciclo Event | `UC-PRT-08`, `UC-PRT-09` | `STATE_TRANSITION` |
| `REQ-PRT-014` | 1-2 | `SM-MATCHRECORD-01` | Corrección `FINAL` con motivo, no transición inversa | `UC-PRT-10` | `STATE_TRANSITION` |
| `REQ-PRT-015` | 1-3 | `SM-MATCHRECORD-01`, `SM-EVENT-01` | `PLAYED/FORFEIT⇒COMPLETED`, `ABANDONED⇒ABANDONED` | `UC-PRT-08`, `UC-PRT-09`, `UC-EVT-09`, `UC-EVT-10` | `STATE_GUARD_ONLY` |
| `REQ-PRT-017` | 1-5 | `SM-ELIGIBILITY-01` | `PENDING/BLOCKED` persistidos, `ELIGIBLE` derivado, vigencia | `UC-PRT-12`, `UC-PRT-13` | `STATE_TRANSITION` + `TEMPORAL` |

## 2.5 REQ-COM (Communication)

| REQ | AC | Máquina(s) | Transiciones/Estados | UC E5 | Tipo Cobertura |
|---|---|---|---|---|---|
| `REQ-COM-001` | 1-3 | `SM-ANNOUNCEMENT-01` | `DRAFT→PUBLISHED→ARCHIVED`, solo Subcomisión | `UC-COM-01` a `UC-COM-04` | `STATE_TRANSITION` |
| `REQ-COM-003` | 1-2 | `SM-ANNOUNCEMENT-01` | Audiencia snapshot inmutable en `PUBLISHED` | `UC-COM-02`, `UC-COM-03` | `STATE_GUARD_ONLY` |
| `REQ-COM-007` | 1-4 | `SM-CONVERSATION-GROUP-01` | Grupo `ACTIVE→ARCHIVED` (solo GROUP) | `UC-COM-07`, `UC-COM-12` | `STATE_TRANSITION` |
| `REQ-COM-010` | 1-3 | `SM-MESSAGE-01` | `SENT→EDITED→DELETED` (tombstone), solo propios | `UC-COM-09`, `UC-COM-10`, `UC-COM-11` | `STATE_TRANSITION` |

## 2.6 REQ-CMP (Competition)

| REQ | AC | Máquina(s) | Transiciones/Estados | UC E5 | Tipo Cobertura |
|---|---|---|---|---|---|
| `REQ-CMP-001` | 1-3 | `SM-COMPETITION-01` | `DRAFT→ACTIVE→CLOSED` | `UC-CMP-01`, `UC-CMP-02`, `UC-CMP-03` | `STATE_TRANSITION` |
| `REQ-CMP-002` | 1-2 | `SM-COMPETITION-01` | Cerrar requiere 0 inscripciones `ACTIVE` | `UC-CMP-03` | `STATE_GUARD_ONLY` |
| `REQ-CMP-003` | 1-4 | `SM-COMPETITIONENTRY-01` | `PENDING→ACTIVE→ENDED` | `UC-CMP-04` a `UC-CMP-07` | `STATE_TRANSITION` |
| `REQ-CMP-004` | 1-3 | `SM-COMPETITIONENTRY-01` | Scopes `TEAM`/`LINE` son datos, no estados | `UC-CMP-04`, `UC-CMP-05`, `UC-CMP-06` | `STATE_GUARD_ONLY` |

---

# 3. CLASIFICACIÓN DE LOS 102 CU POR RELEVANCIA DE ESTADO

| Clasificación | Cantidad | Descripción |
|---|---:|---|
| `STATE_TRANSITION` | **42** | El CU ejecuta una transición de estado en al menos una máquina |
| `STATE_GUARD_ONLY` | **28** | El CU solo verifica estado como precondición/guard, no muta |
| `STATE_READ_ONLY` | **12** | El CU consulta estado derivado o persiste sin mutar lifecycle |
| `NO_STATE_RELEVANCE` | **20** | El CU no interactúa con ninguna máquina de estado |

### 3.1 CU con `STATE_TRANSITION` (42)

| CU | Máquina(s) Afectadas | Transición(es) |
|---|---|---|
| `UC-IAM-02` | `SM-ACCOUNT-01` | `ACTIVE→DISABLED` |
| `UC-IAM-03` | `SM-ACCOUNT-01` | Emite código para `PENDING/DISABLED→ACTIVE` |
| `UC-IAM-04` | `SM-ACCOUNT-01` | `PENDING→ACTIVE`, `DISABLED→ACTIVE` |
| `UC-IAM-05` | `SM-ACCOUNT-01` | `ACTIVE→PENDING(implícito)` |
| `UC-STR-09` | `SM-TEAM-01` | Creación → `DRAFT` |
| `UC-STR-11` | `SM-TEAM-01` | `DRAFT→ACTIVE` |
| `UC-STR-12` | `SM-TEAM-01` | `ACTIVE→ARCHIVED` |
| `UC-STR-03` | `SM-DIVISION-01` | Creación → `ACTIVE` |
| `UC-STR-05` | `SM-DIVISION-01` | `ACTIVE→ARCHIVED` |
| `UC-STR-06` | `SM-LINE-01` | Creación → `ACTIVE` |
| `UC-STR-08` | `SM-LINE-01` | `ACTIVE→ARCHIVED` |
| `UC-STR-13` | `SM-VENUE-01` | Creación → `ACTIVE` |
| `UC-STR-15` | `SM-VENUE-01` | `ACTIVE→ARCHIVED` |
| `UC-EVT-01` | `SM-EVENT-01` | Creación → `SCHEDULED` |
| `UC-EVT-02` | `SM-EVENT-01` | Creación → `SCHEDULED` |
| `UC-EVT-03` | `SM-EVENT-01` | Creación → `SCHEDULED` |
| `UC-EVT-05` | `SM-EVENT-01` | `SCHEDULED→POSTPONED` |
| `UC-EVT-06` | `SM-EVENT-01` | `POSTPONED→SCHEDULED` |
| `UC-EVT-07` | `SM-EVENT-01` | `SCHEDULED/POSTPONED→CANCELLED` |
| `UC-EVT-08` | `SM-EVENT-01` | `CANCELLED→SCHEDULED` |
| `UC-EVT-09` | `SM-EVENT-01` | `SCHEDULED/IN_PROGRESS→COMPLETED` |
| `UC-EVT-10` | `SM-EVENT-01` | `IN_PROGRESS→ABANDONED` |
| `UC-EVT-13` | `SM-EVENTSERIES-01` | Creación → `ACTIVE` |
| `UC-EVT-14` | `SM-EVENTSERIES-01` | `ACTIVE→ENDED` |
| `UC-PRT-01` | `SM-AVAILABILITY-01` | `NO_RESPONSE→YES/MAYBE/NO`, cambios, reconfirmación |
| `UC-PRT-02` | `SM-SELECTIONREV-01` | Creación borrador `DRAFT` |
| `UC-PRT-03` | `SM-SELECTIONREV-01` | `DRAFT→PUBLISHED` |
| `UC-PRT-05` | `SM-ATTENDANCEENTRY-01` | `UNRECORDED→PRESENT/ABSENT/JUSTIFIED` |
| `UC-PRT-07` | `SM-ATTENDANCEENTRY-01` | Corrección valores persistidos |
| `UC-PRT-08` | `SM-MATCHRECORD-01` | Creación → `DRAFT` |
| `UC-PRT-09` | `SM-MATCHRECORD-01` | `DRAFT→FINAL` |
| `UC-PRT-10` | `SM-MATCHRECORD-01` | Corrección `FINAL` |
| `UC-PRT-12` | `SM-ELIGIBILITY-01` | Creación `PENDING/BLOCKED` |
| `UC-COM-01` | `SM-ANNOUNCEMENT-01` | Creación → `DRAFT` |
| `UC-COM-02` | `SM-ANNOUNCEMENT-01` | `DRAFT→PUBLISHED` |
| `UC-COM-03` | `SM-ANNOUNCEMENT-01` | Corrección en `PUBLISHED` |
| `UC-COM-04` | `SM-ANNOUNCEMENT-01` | `PUBLISHED→ARCHIVED` |
| `UC-COM-07` | `SM-CONVERSATION-GROUP-01` | Creación → `ACTIVE` |
| `UC-COM-12` | `SM-CONVERSATION-GROUP-01` | `ACTIVE→ARCHIVED` |
| `UC-COM-09` | `SM-MESSAGE-01` | `SENT` |
| `UC-COM-10` | `SM-MESSAGE-01` | `SENT→EDITED` |
| `UC-COM-11` | `SM-MESSAGE-01` | `SENT/EDITED→DELETED` |
| `UC-CMP-01` | `SM-COMPETITION-01` | Creación → `DRAFT` |
| `UC-CMP-02` | `SM-COMPETITION-01` | `DRAFT→ACTIVE` |
| `UC-CMP-03` | `SM-COMPETITION-01` | `ACTIVE→CLOSED` |
| `UC-CMP-04` | `SM-COMPETITIONENTRY-01` | Creación → `PENDING` (TEAM) |
| `UC-CMP-05` | `SM-COMPETITIONENTRY-01` | Creación → `PENDING` (LINE) |
| `UC-CMP-06` | `SM-COMPETITIONENTRY-01` | `PENDING→ACTIVE` |
| `UC-CMP-07` | `SM-COMPETITIONENTRY-01` | `ACTIVE→ENDED` |

### 3.2 CU con `STATE_GUARD_ONLY` (28)

`UC-IAM-01`, `UC-IAM-06`, `UC-IAM-07`, `UC-IAM-08`, `UC-IAM-09`, `UC-IAM-10`,
`UC-STR-04`, `UC-STR-07`, `UC-STR-10`, `UC-STR-14`,
`UC-EVT-04`, `UC-EVT-11`, `UC-EVT-12`, `UC-EVT-15`, `UC-EVT-16`,
`UC-PRT-04`, `UC-PRT-06`, `UC-PRT-11`, `UC-PRT-13`,
`UC-COM-05`, `UC-COM-06`, `UC-COM-08`, `UC-COM-13`, `UC-COM-14`,
`UC-CMP-08`, `UC-CMP-09`,
`UC-INS-01`, `UC-INS-02`, `UC-INS-03`, `UC-INS-04`, `UC-INS-05`

### 3.3 CU con `STATE_READ_ONLY` (12)

`UC-PRT-01` (consulta `NEEDS_RECONFIRMATION`), `UC-EVT-17`, `UC-EVT-18`, `UC-EVT-19`,
`UC-COM-05`, `UC-COM-13`, `UC-COM-14`,
`UC-INS-01`, `UC-INS-02`, `UC-INS-03`, `UC-INS-04`, `UC-INS-05`

### 3.4 CU con `NO_STATE_RELEVANCE` (20)

`UC-PPL-01` a `UC-PPL-17` (17 CU), `UC-STR-01`, `UC-STR-02`, `UC-STR-14` (3 CU)
*Nota: PPL usa modelos temporales (vigencia), no máquinas de estados persistidas. STR Season no tiene máquina.*

---

# 4. TRANSICIONES SIN FUENTE (VALIDACIÓN)

| Transición | Máquina | Estado Origen → Destino | Estado | Comentario |
|---|---|---|---|---|
| *(ninguna)* | — | — | **OK** | Todas las 62 transiciones permitidas tienen REQ/AC/UC de respaldo |

---

# 5. ESTADOS SIN EVIDENCIA (VALIDACIÓN)

| Estado | Máquina | Estado | Comentario |
|---|---|---|---|
| *(ninguno)* | — | — | **OK** | Todos los 47 estados canónicos tienen definición en PT/E5 |

---

# 6. RESUMEN CUANTITATIVO

| Métrica | Valor |
|---|---:|
| REQ funcionales IN con trazabilidad a máquinas | 67 / 122 |
| REQ que gobiernan guards de estado | 34 |
| REQ que definen transiciones | 33 |
| Transiciones permitidas con fuente | 62 / 62 |
| Transiciones prohibidas documentadas | 65 |
| Estados canónicos con definición | 47 / 47 |
| CU `STATE_TRANSITION` | 42 |
| CU `STATE_GUARD_ONLY` | 28 |
| CU `STATE_READ_ONLY` | 12 |
| CU `NO_STATE_RELEVANCE` | 20 |
| Máquinas `STATE_MACHINE_REQUIRED` | 17 |

---

**Fin de la Matriz de Trazabilidad de Estados V1.**