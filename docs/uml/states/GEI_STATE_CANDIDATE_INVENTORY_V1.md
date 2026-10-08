# GEI HOCKEY MANAGEMENT SYSTEM
## STATE MACHINE CANDIDATE INVENTORY V1

**Etapa:** 6 — Diagramas de estados (E6-02)
**Estado:** COMPLETO
**Fecha:** 2026-10-07
**Rama:** `gei/e6-state-diagrams-freeze-v1`
**Baseline:** `01ee760388e27592d007c1c6f539e9204aefbf62`

---

# 1. PROPÓSITO

Este documento registra el inventario exhaustivo de objetos del modelo funcional evaluados como candidatos a máquina de estados, con su clasificación fundamentada según la auditoría `GEI_STATE_RECONSTRUCTION_AUDIT_V1.md`.

**Regla:** Esta lista es de **auditoría, NO de diagramas obligatorios**. Solo los clasificados `STATE_MACHINE_REQUIRED` generan diagrama Draw.io.

---

# 2. CLASIFICACIONES UTILIZADAS

| Código | Significado |
|---|---|
| `STATE_MACHINE_REQUIRED` | Objeto con estados persistidos, transiciones mutativas autorizadas, guards, y al menos un estado terminal o ciclo no trivial. Requiere diagrama Draw.io. |
| `TEMPORAL_VALIDITY_MODEL` | La vigencia deriva de un intervalo `[valid_from, valid_until)`. No hay enum persistido de estados. Se documenta en catálogo, no se diagrama como máquina. |
| `DERIVED_STATE_MODEL` | Estados calculados (no persistidos) que combinan valores persistidos + reglas. Se documenta en catálogo con separación visual de persistidos. |
| `LIFECYCLE_EXISTS_BUT_DIAGRAM_NOT_NEEDED` | Tiene lifecycle pero es trivial (ej. 2 estados, una transición) o se cubre en otro diagrama. |
| `NO_STATE_MACHINE` | Sin evidencia de lifecycle funcional en autoridades. |
| `NEEDS_DECISION` | Evidencia contradictoria o insuficiente; requiere decisión de producto. |

---

# 3. INVENTARIO COMPLETO POR DOMINIO

## 3.1 IAM — Identity & Access

| Objeto | Clasificación | Justificación |
|---|---|---|
| **Account** | `STATE_MACHINE_REQUIRED` | Enum persistido `PENDING/ACTIVE/DISABLED`. Transiciones: `PENDING→ACTIVE` (código), `DISABLED→ACTIVE` (código nuevo), `ACTIVE→DISABLED` (admin). Guards: credencial válida, valla último admin. Autoridad: Admin (deshabilitar), código (activar). Estados terminales: `DISABLED` reactivable (no terminal absoluto). Efecto colateral: revocación de sesiones. |

## 3.2 PPL — People & Relationships

| Objeto | Clasificación | Justificación |
|---|---|---|
| **Membership** | `TEMPORAL_VALIDITY_MODEL` | PT §9: "Temporal: `[valid_from, valid_until)`". No enum persistido. `UC-PPL-04` registra período; `UC-PPL-05` finaliza seteando `valid_until`; rechaza si dependencias activas; período se conserva. Vigencia = `now ∈ [from, until)`. |
| **TeamAssignment** | `TEMPORAL_VALIDITY_MODEL` | PT §9: "Temporal: `[valid_from, valid_until)`". `UC-PPL-06` crea atómicamente + `PLAYER` role; `UC-PPL-07` cierra anterior + crea nueva (sin transferir CAPTAIN); `UC-PPL-08` cierra TeamAssignment + PLAYER + CAPTAIN. Vigencia derivada. |
| **RoleAssignment** | `TEMPORAL_VALIDITY_MODEL` | PT §9: "Temporal: `[valid_from, valid_until)`". `UC-PPL-09` asigna con alcance; combinación inválida ⇒ `INVALID_ROLE_SCOPE`; varios vigentes ⇒ unión; expirada no computa. `UC-PPL-10` finaliza con fecha; deja de computar; valla último admin. Vigencia derivada. |
| **GuardianRelationship** | `TEMPORAL_VALIDITY_MODEL` | PT §17, §20: relación individual por menor con vigencia. `UC-PPL-11` crea con 2 flags independientes (`can_view_child_info`, `can_respond_availability`). `UC-PPL-12` finaliza con fecha; deja de conceder acceso; período se conserva. Autoridad = relación vigente AND flag. |

## 3.3 STR — Club Structure

| Objeto | Clasificación | Justificación |
|---|---|---|
| **Team** | `STATE_MACHINE_REQUIRED` | PT §9: `DRAFT → ACTIVE → ARCHIVED`. `UC-STR-09` nace `DRAFT`; `UC-STR-11` `DRAFT→ACTIVE`; `UC-STR-12` `ACTIVE→ARCHIVED` (guard: sin dependencias activas); **terminal en V1** (`DEF-STR-001/002` defer). `UC-STR-10` rechaza edición en `ARCHIVED`. Identidad inmutable (temporada+división+línea). |
| **Division** | `STATE_MACHINE_REQUIRED` | PT §19: Create, Update, Archive. `UC-STR-03` crea; `UC-STR-04` actualiza (rechaza renombrar si equipos activos); `UC-STR-05` archiva (guard: sin dependencias); **terminal en V1** (`DEF-STR-001` defer). No `DRAFT`. Estado "activa" implícito tras creación. |
| **Line** | `STATE_MACHINE_REQUIRED` | PT §19: Create, Update, Archive. `UC-STR-06` crea; `UC-STR-07` actualiza (rechaza renombrar si equipos activos); `UC-STR-08` archiva (guard: sin dependencias); **terminal en V1** (`DEF-STR-002` defer). Igual que Division. |
| **Venue** | `STATE_MACHINE_REQUIRED` | PT §19: name, address, field_label, `archived_at`, stable identity by ID. `UC-STR-13` crea; `UC-STR-14` corrige (regla A: sin efectos coordinación); `UC-STR-15` archiva (guard: sin dependencias); **terminal en V1**. No `DRAFT`. |
| **Season** | `NO_STATE_MACHINE` | PT §9: "histórica, sin ciclo de estado". PT §19: Create, Update name/dates, histórica, no hard-delete. `UC-STR-01/02` solo timestamps. Actor Boundary Matrix: `SEASON` no es scope de actor, entidad histórica sin estado (`CON-09`). |

## 3.4 EVT — Events & Calendar

| Objeto | Clasificación | Justificación |
|---|---|---|
| **Event** | `STATE_MACHINE_REQUIRED` | **Modelo central**. PT §9: 7 estados + subtipo Match. Transiciones: `DRAFT→SCHEDULED` (atómica), `SCHEDULED→POSTPONED`, `POSTPONED→SCHEDULED`, `SCHEDULED→CANCELLED`, `POSTPONED→CANCELLED`, `CANCELLED→SCHEDULED` (Restore), `SCHEDULED→IN_PROGRESS`, `IN_PROGRESS→COMPLETED`, `IN_PROGRESS→ABANDONED` (solo Match). Guards: autoridad, estado origen, invariantes fecha, tipo evento. Efectos: disponibilidad, notificaciones, `coordination_revision`. `COMPLETED`/`ABANDONED` terminales sin reapertura. |
| **EventSeries** | `STATE_MACHINE_REQUIRED` | PT §9: `ACTIVE → ENDED`, máx 366 ocurrencias. `UC-EVT-13` crea `ACTIVE`; `UC-EVT-14` `ACTIVE→ENDED` (sin inversa); conserva ocurrencias. `UC-EVT-04` edita con 3 alcances (esta, esta+y-siguientes, toda). |
| **Jornada** | `NO_STATE_MACHINE` | PT §16: "Jornada agrupa Matches y no duplica el lifecycle de los Matches". `UC-EVT-15`: creación atómica bulk ≤100; agrupa partidos; **sin transición de los partidos propios**. E3 §3.2: "creación masiva atómica es regla operacional; no necesariamente implica nuevos estados". No lifecycle propio demostrable. |

## 3.5 PRT — Participation

| Objeto | Clasificación | Justificación |
|---|---|---|
| **Availability** | `DERIVED_STATE_MODEL` | PT §9: Persistido: `YES/MAYBE/NO`. Derivado: `NO_RESPONSE` (ausencia de fila), `NEEDS_RECONFIRMATION` (respuesta previa a cambio coordinación). `UC-PRT-01`: respuesta sustituye anterior; `POSTPONED` conserva, no acepta nuevas; volver `SCHEDULED` reabre. REQ-PRT-003/004. **Separar visualmente persistidos vs derivados**. |
| **SelectionRevision** | `STATE_MACHINE_REQUIRED` | PT §9: "Working draft revision + published immutable revisions". `UC-PRT-02`: borrador editable (estado `DRAFT` implícito). `UC-PRT-03`: publica → revisión inmutable `PUBLISHED`; republicar = nueva revisión sin reescribir anterior. `UC-PRT-04` revisa conflictos (SIBLING). Inmutabilidad de revisiones publicadas es clave. |
| **Selection (contenedor)** | `TEMPORAL_VALIDITY_MODEL` | Contenedor con borrador actual (mutable) + historial de revisiones publicadas (inmutables). No machine propia; vigencia del borrador actual. |
| **AttendanceSheet** | `TEMPORAL_VALIDITY_MODEL` | PT §9: `OPEN/CLOSED` derivado de `closed_at`. `UC-PRT-05` precondición `OPEN`; `UC-PRT-06` cierra → `CLOSED` (marca `closed_at`); `UC-PRT-07` corrige (SIBLING, **no reabre**); exige motivo; persiste anterior/nuevo/motivo/autor/fecha. REQ-PRT-011: reapertura no requisito. |
| **AttendanceEntry** | `STATE_MACHINE_REQUIRED` | PT §9: `PRESENT/ABSENT/JUSTIFIED` persistidos. Sin fila = `UNRECORDED` (derivado). `UC-PRT-05` marca con persistencia inmediata; `UC-PRT-07` corrige con motivo y auditoría (antes/después visible). 3 valores mutables libremente (con corrección auditada). |
| **MatchRecord** | `STATE_MACHINE_REQUIRED` | PT §9: `DRAFT → FINAL`; FINAL solo corrige explícitamente. `UC-PRT-08` crea `DRAFT` (precondición: ciclo evento compatible); `UC-PRT-09` `DRAFT→FINAL` (terminal vía normal); `UC-PRT-10` corrige `FINAL` con motivo (operación separada, **no transición inversa**). REQ-PRT-013/015: compatibilidad resultado-evento. **Distinto de Event Match**. |
| **EligibilityConstraint** | `STATE_MACHINE_REQUIRED` + `TEMPORAL` | PT §13: `PENDING/BLOCKED` persistidos. `ELIGIBLE` derivado (sin restricción activa). `UC-PRT-12` registra con estado, alcance, origen, motivo, vigencia; **no hay CU de finalizar** (vigencia dentro del CU). `UC-PRT-13` consulta estado derivado con visibilidad por autoridad. Vigencia `[validFrom, validUntil)` controla aplicabilidad. |

## 3.6 COM — Communication

| Objeto | Clasificación | Justificación |
|---|---|---|
| **Announcement** | `STATE_MACHINE_REQUIRED` | PT §9: `DRAFT → PUBLISHED → ARCHIVED`. `UC-COM-01` crea `DRAFT`; `UC-COM-02` `DRAFT→PUBLISHED` (audiencia snapshot inmutable); `UC-COM-03` corrige `PUBLISHED` (título/cuerpo, **audiencia no cambia**, historia); `UC-COM-04` `PUBLISHED→ARCHIVED`; `UC-COM-05` consulta `PUBLISHED` (solo audiencia). Solo Subcomisión. |
| **Conversation (GROUP)** | `STATE_MACHINE_REQUIRED` | PT §9: `ACTIVE → ARCHIVED`. `UC-COM-07` crea `ACTIVE`; `UC-COM-12` **solo GROUP** `ACTIVE→ARCHIVED` (REQ-COM-007 AC 4). Participantes con `joined_at/left_at`; ex-participante conserva período. |
| **Conversation (DIRECT)** | `NO_STATE_MACHINE` | PT §20: "máximo 1 por par canónico". `UC-COM-06` abre/crea única. No archivable. No transiciones de estado. Membresía temporal vía `joined_at/left_at` pero no estados persistidos. |
| **Conversation (TEAM/EVENT)** | `NO_STATE_MACHINE` | PT §20: "0..1 canónica por Team/Event", título derivado del objeto real, membresía sincronizada server-side. `UC-COM-08` abre/crea. No archivable. Ligada a vida del objeto real. |
| **Message** | `STATE_MACHINE_REQUIRED` | PT §9: `SENT → EDITED → DELETED` (tombstone). `UC-COM-09` envía (`SENT`); `UC-COM-10` edita propio (expone historia); `UC-COM-11` elimina propio → `DELETED` (tombstone irreversible, confirmación+motivo). `EDITED` opcional (puede ir `SENT→DELETED`). |
| **Notification** | `DERIVED_STATE_MODEL` | PT §22: 7 tipos, clave lógica única `origin_event_id+recipient+type`, `read_at` para marcar leída. `UC-COM-13` consulta (no leídas primero); `UC-COM-14` marca leída (`read_at`) — SIBLING. `UNREAD/READ` = derivado de `read_at`. No machine compleja. |

## 3.7 CMP — Competition

| Objeto | Clasificación | Justificación |
|---|---|---|
| **Competition** | `STATE_MACHINE_REQUIRED` | PT §9: `DRAFT → ACTIVE → CLOSED`. `UC-CMP-01` crea `DRAFT`; `UC-CMP-02` `DRAFT→ACTIVE`; `UC-CMP-03` `ACTIVE→CLOSED` (guard: 0 inscripciones activas, explicándolas). REQ-CMP-001/002. Terminal en V1. |
| **CompetitionEntry** | `STATE_MACHINE_REQUIRED` | PT §9: `PENDING → ACTIVE → ENDED`. `UC-CMP-04` inscribe equipo → `PENDING` (scope `TEAM`); `UC-CMP-05` inscribe línea → `PENDING` (scope `LINE`); `UC-CMP-06` `PENDING→ACTIVE` (guard: alcance compatible); `UC-CMP-07` `ACTIVE→ENDED` (en uso ⇒ serialización; histórico conservado). **`TEAM`/`LINE` son scopes de dato, NO estados**. |

## 3.8 INS — Search / Reports / Audit

| Objeto | Clasificación | Justificación |
|---|---|---|
| *(ninguno)* | — | `UC-INS-01` a `UC-INS-05` son consultas sin mutación (`estado/objeto afectado: consulta sin mutación`). No hay objetos con lifecycle en este dominio. |

---

# 4. RESUMEN CUANTITATIVO

| Clasificación | Cantidad | Objetos |
|---|---|---|
| `STATE_MACHINE_REQUIRED` | **17** | Account, Team, Division, Line, Venue, Event, EventSeries, SelectionRevision, AttendanceEntry, MatchRecord, EligibilityConstraint, Announcement, Conversation (GROUP), Message, Competition, CompetitionEntry, Availability (persistidos) |
| `TEMPORAL_VALIDITY_MODEL` | **6** | Membership, TeamAssignment, RoleAssignment, GuardianRelationship, Selection (contenedor), AttendanceSheet |
| `DERIVED_STATE_MODEL` | **2** | Availability (derivados), Notification |
| `LIFECYCLE_EXISTS_BUT_DIAGRAM_NOT_NEEDED` | **0** | — |
| `NO_STATE_MACHINE` | **4** | Season, Jornada, Conversation (DIRECT), Conversation (TEAM/EVENT) |
| `NEEDS_DECISION` | **0** | — |

**Total objetos evaluados: 29**

**Diagramas a generar (E6-05): 17** — uno por cada `STATE_MACHINE_REQUIRED`.

---

# 5. MAPA SM-ID ASIGNADOS

| SM-ID | Objeto | Dominio |
|---|---|---|
| `SM-ACCOUNT-01` | Account | IAM |
| `SM-TEAM-01` | Team | STR |
| `SM-DIVISION-01` | Division | STR |
| `SM-LINE-01` | Line | STR |
| `SM-VENUE-01` | Venue | STR |
| `SM-EVENT-01` | Event | EVT |
| `SM-EVENTSERIES-01` | EventSeries | EVT |
| `SM-AVAILABILITY-01` | Availability (persistidos + derivados) | PRT |
| `SM-SELECTIONREV-01` | SelectionRevision | PRT |
| `SM-ATTENDANCEENTRY-01` | AttendanceEntry | PRT |
| `SM-MATCHRECORD-01` | MatchRecord | PRT |
| `SM-ELIGIBILITY-01` | EligibilityConstraint | PRT |
| `SM-ANNOUNCEMENT-01` | Announcement | COM |
| `SM-CONVERSATION-GROUP-01` | Conversation (GROUP) | COM |
| `SM-MESSAGE-01` | Message | COM |
| `SM-COMPETITION-01` | Competition | CMP |
| `SM-COMPETITIONENTRY-01` | CompetitionEntry | CMP |

---

**Fin del Inventario de Objetos Candidatos V1.**