# GEI HOCKEY MANAGEMENT SYSTEM
## STATE MACHINE RECONSTRUCTION AUDIT V1

**Etapa:** 6 — Diagramas de estados
**Estado:** EN PROCESO
**Fecha:** 2026-10-07
**Rama:** `gei/e6-state-diagrams-freeze-v1`
**Baseline E5:** `01ee760388e27592d007c1c6f539e9204aefbf62` (`gei/e5-use-case-specifications-freeze-v1`)

---

# 1. OBJETIVO DE LA AUDITORÍA

Esta auditoría precede a la generación de diagramas de estados. Su propósito es:

1. Verificar todas las autoridades (E1–E5 + Product Truth v1.0.1).
2. Extraer estados y transiciones de las especificaciones E5.
3. Enumerar objetos candidatos a máquina de estados.
4. Verificar si cada objeto realmente tiene lifecycle funcional.
5. Identificar estados persistidos, derivados y vigencia temporal.
6. Detectar contradicciones, transiciones faltantes y estados ambiguos.
7. Clasificar riesgos y decisiones.

**Regla:** No pasar a generación si hay contradicciones funcionales bloqueantes sin resolver.

---

# 2. AUTORIDADES UTILIZADAS

| Documento | Versión | Estado | Rol en E6 |
|---|---|---|---|
| `GEI_REQUIREMENTS_FREEZE_V1.md` | V1 | FROZEN | Requerimientos funcionales y no funcionales |
| `GEI_REQUIREMENTS_CATALOG_V1.md` | V1 | FROZEN | Catálogo con trazabilidad y AC |
| `GEI_ACTOR_MODEL_FREEZE_V1.md` | V1 | FROZEN | 8 actores canónicos, authority source, scope |
| `GEI_ACTOR_AUTHORITY_BOUNDARY_MATRIX_V1.md` | V1 | FROZEN | Límites por estado de objeto (§6) |
| `GEI_MASTER_USE_CASE_INVENTORY_FREEZE_V1.md` | V1 | FROZEN | 102 CU con actor, goal, restricciones por estado |
| `GEI_MASTER_USE_CASE_CATALOG_V1.md` | V1 | FROZEN | Fichas completas de los 102 CU |
| `GEI_USE_CASE_DIAGRAM_FREEZE_V1_0_1.md` | V1.0.1 | FROZEN | 6 relaciones UML congeladas |
| `GEI_USE_CASE_RELATION_DECISIONS_V1.md` | V1 | FROZEN | Decisiones de relaciones con evidencia AC |
| `GEI_USE_CASE_SPECIFICATION_FREEZE_V1.md` | V1 | FROZEN | 102 fichas académicas con postcondiciones de estado |
| 8 archivos `GEI_UC_SPEC_<DOMAIN>_V1.md` | V1 | FROZEN | Especificaciones por dominio con efectos de estado |
| `GEI_USE_CASE_SPEC_TRACEABILITY_V1.md` | V1 | FROZEN | UC→REQ→AC con representación |
| `GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` | v1.0.1 | FROZEN | **Autoridad de producto y dominio** (manda sobre todo) |

---

# 3. METODOLOGÍA DE EXTRACCIÓN

Para cada objeto candidato se analizó:

| Fuente | Qué aporta |
|---|---|
| **Product Truth §9 (Lifecycles)** | Enumera explícitamente los ciclos de vida canónicos |
| **Product Truth §10-16** | Invariantes, políticas de cambio, reglas de participación |
| **E5 Specifications (postcondiciones)** | Transiciones concretas disparadas por CU |
| **E5 Specifications (precondiciones)** | Guards basados en estado del objeto |
| **E5 Specifications (caminos alternativos)** | Rechazos por estado (transiciones prohibidas) |
| **Actor Boundary Matrix §6** | Límites por estado de objeto que gobiernan CU |
| **E3 Inventory §6.4** | Restricciones por estado de objeto que gobiernan CU |
| **Requirements (REQ)** | Reglas de negocio que condicionan transiciones |

---

# 4. CANDIDATOS A MÁQUINA DE ESTADOS — ANÁLISIS EXHAUSTIVO

## 4.1 IAM — Identity & Access

### Account
**Evidencia de lifecycle:**
- Product Truth §9: `PENDING → ACTIVE ↔ DISABLED`
- E5 `UC-IAM-01`: Precondición `Account` no `PENDING` ni `DISABLED`
- E5 `UC-IAM-02`: `ACTIVE → DISABLED` (revoca sesiones)
- E5 `UC-IAM-03`: Emite código para `PENDING` o `DISABLED`
- E5 `UC-IAM-04`: `PENDING → ACTIVE` y `DISABLED → ACTIVE` (activación/reactivación)
- E5 `UC-IAM-05`: Restablece credencial, revoca sesiones, emite código nuevo
- Actor Boundary Matrix §6: `Account DISABLED` revoca sesiones y bloquea entrada; `PENDING`/`DISABLED` acceso rechazado

**Estados confirmados:** `PENDING`, `ACTIVE`, `DISABLED`
**Transiciones confirmadas:** 
- `PENDING → ACTIVE` (activación con código)
- `DISABLED → ACTIVE` (reactivación con código nuevo)
- `ACTIVE → DISABLED` (deshabilitación admin)
- `ACTIVE → PENDING` (implícito en restablecimiento admin: credencial `SETUP_REQUIRED`)

**Clasificación:** **STATE_MACHINE_REQUIRED** — lifecycle persistido, transiciones mutativas con autoridad explícita, guards claros, estados terminales (`DISABLED` puede reactivarse, no es terminal absoluto).

---

## 4.2 PPL — People & Relationships

### Membership
**Evidencia de lifecycle:**
- Product Truth §9: Temporal `[valid_from, valid_until)` — **no enum persistido**
- E5 `UC-PPL-04`: Registra período
- E5 `UC-PPL-05`: Finaliza con fecha; rechaza si dependencias activas; **conserva período**
- Actor Boundary Matrix §6: `Membership` con dependencias activas ⇒ finalizar rechazado; período se conserva
- REQ-PPL-004: Afiliaciones y roles exigen membresía vigente; finalizar con dependencias ⇒ rechazado; período queda conservado

**Análisis:** No hay enum `ACTIVE`/`EXPIRED`/`ARCHIVED` persistido. La vigencia es un intervalo temporal. El estado "activo" es derivado: `now ∈ [valid_from, valid_until)`. Finalizar = setear `valid_until = now`.

**Clasificación:** **TEMPORAL_VALIDITY_MODEL** — No machine de estados persistida. Vigencia derivada de intervalo. No inventar estados `ACTIVE`/`EXPIRED`.

### TeamAssignment
**Evidencia de lifecycle:**
- Product Truth §9: Temporal `[valid_from, valid_until)`
- E5 `UC-PPL-06`: Crea atómicamente `TeamAssignment` + `RoleAssignment PLAYER`
- E5 `UC-PPL-07`: Cierra anterior con fecha, crea nueva; **no transfiere CAPTAIN**
- E5 `UC-PPL-08`: Cierra `TeamAssignment`, `PLAYER` y `CAPTAIN` si existía
- Actor Boundary Matrix §6: `TeamAssignment` terminada ⇒ cierra también `PLAYER` y `CAPTAIN`

**Análisis:** Igual que Membership — intervalo temporal. No hay estados persistidos `ACTIVE`/`ENDED`. La vigencia deriva del intervalo.

**Clasificación:** **TEMPORAL_VALIDITY_MODEL** — Vigencia derivada. No machine de estados.

### RoleAssignment
**Evidencia de lifecycle:**
- Product Truth §9: Temporal `[valid_from, valid_until)`
- E5 `UC-PPL-09`: Asigna rol con alcance; combinación inválida ⇒ `INVALID_ROLE_SCOPE`; varios vigentes ⇒ unión; expirada no computa
- E5 `UC-PPL-10`: Finaliza rol con fecha; deja de computar; historia se conserva; valla último admin
- Actor Boundary Matrix §6: `RoleAssignment` expirada ⇒ no computa; `LAST_ADMIN_REQUIRED` si quedaría en 0

**Análisis:** Intervalo temporal. "Vigente" = derivado de `now ∈ [valid_from, valid_until)`. No enum persistido.

**Clasificación:** **TEMPORAL_VALIDITY_MODEL** — Vigencia derivada. No machine de estados.

### GuardianRelationship
**Evidencia de lifecycle:**
- Product Truth §9: Temporal `[valid_from, valid_until)` (no listado explícito pero consistente con PT §17, §20)
- E5 `UC-PPL-11`: Crea con flags `can_view_child_info`, `can_respond_availability`
- E5 `UC-PPL-12`: Finaliza con fecha; deja de conceder acceso; período se conserva
- Actor Boundary Matrix §6: Finalizada ⇒ deja de conceder acceso; período se conserva

**Análisis:** Intervalo temporal + dos flags booleanos independientes. No hay estados `ACTIVE`/`REVOKED`/`EXPIRED`. La autoridad deriva de: relación vigente (`now ∈ intervalo`) AND flag correspondiente.

**Clasificación:** **TEMPORAL_VALIDITY_MODEL** — Vigencia derivada + flags. No machine de estados.

---

## 4.3 STR — Club Structure

### Team
**Evidencia de lifecycle:**
- Product Truth §9: `DRAFT → ACTIVE → ARCHIVED`
- E5 `UC-STR-09`: Registra equipo en `DRAFT`
- E5 `UC-STR-10`: Actualiza datos; **rechaza si `ARCHIVED`**
- E5 `UC-STR-11`: `DRAFT → ACTIVE`
- E5 `UC-STR-12`: `ACTIVE → ARCHIVED`; rechaza si dependencia activa; **terminal en V1**
- Product Truth §19: `ARCHIVED → ACTIVE` **no existe en V1** (`DEF-STR-001/002`)
- Actor Boundary Matrix §6: Estructura con dependencia activa ⇒ archivar rechazado

**Estados confirmados:** `DRAFT`, `ACTIVE`, `ARCHIVED`
**Transiciones confirmadas:**
- Creación: nace `DRAFT`
- `DRAFT → ACTIVE` (activación admin)
- `ACTIVE → ARCHIVED` (archivado admin, guard: sin dependencias activas)
- **Prohibida:** `ARCHIVED → ACTIVE` (restore no autorizado en V1)
- **Prohibida:** Edición en `ARCHIVED`

**Clasificación:** **STATE_MACHINE_REQUIRED** — Estados persistidos, transiciones mutativas con autoridad, guards, estado terminal `ARCHIVED` sin transición inversa en V1.

### Division
**Evidencia de lifecycle:**
- Product Truth §19: Create, Update, Archive
- E5 `UC-STR-03`: Crea `Division`
- E5 `UC-STR-04`: Actualiza; **rechaza renombrar si equipos activos**
- E5 `UC-STR-05`: Archiva; rechaza si dependencia activa; **terminal en V1**
- Product Truth §19: No hard-delete; `DEF-STR-001` restore no en V1

**Análisis:** Aunque Product Truth no enumera estados explícitos para Division, los CU implican: creada (implícito `ACTIVE`), archivada. No hay `DRAFT` para Division. El estado "activa" es el default tras creación.

**Estados inferidos:** `ACTIVE` (implícito tras creación), `ARCHIVED`
**Transiciones:** Creación → `ACTIVE`; `ACTIVE → ARCHIVED` (guard: sin dependencias)
**Prohibida:** `ARCHIVED → ACTIVE`

**Clasificación:** **STATE_MACHINE_REQUIRED** — Aunque más simple que Team, tiene estados persistidos (`archived_at` timestamp) y transiciones con guards.

### Line
**Evidencia de lifecycle:**
- Product Truth §19: Create, Update, Archive
- E5 `UC-STR-06`: Crea `Line`
- E5 `UC-STR-07`: Actualiza; rechaza renombrar si equipos activos
- E5 `UC-STR-08`: Archiva; rechaza si dependencia activa; **terminal en V1**
- `DEF-STR-002` restore no en V1

**Análisis:** Idéntico a Division.

**Clasificación:** **STATE_MACHINE_REQUIRED** — Misma justificación que Division.

### Venue
**Evidencia de lifecycle:**
- Product Truth §19: name, address, field_label, `archived_at`, stable identity by ID
- E5 `UC-STR-13`: Crea `Venue`
- E5 `UC-STR-14`: Corrige datos (regla A: **no** reprograma eventos, no incrementa revisión, no notifica)
- E5 `UC-STR-15`: Archiva; rechaza si dependencia activa; **terminal en V1**

**Análisis:** Tiene `archived_at` timestamp. Estados: activa (default), archivada. No `DRAFT`.

**Clasificación:** **STATE_MACHINE_REQUIRED** — Estados persistidos, transiciones con guards.

### Season
**Evidencia de lifecycle:**
- Product Truth §9: **sin ciclo de estado** — "histórica, sin eliminación"
- Product Truth §19: Create, Update name/dates, histórica, no hard-delete
- E5 `UC-STR-01`: Crea con nombre y fechas
- E5 `UC-STR-02`: Actualiza nombre y fechas; historia no se reescribe
- Actor Boundary Matrix: `SEASON` **no es scope de actor**, entidad histórica sin estado (`CON-09`)

**Análisis:** No tiene lifecycle de estados. Es una entidad histórica con timestamps. No hay transiciones de estado.

**Clasificación:** **NO_STATE_MACHINE** — Sin estados funcionales, solo timestamps de creación/actualización.

---

## 4.4 EVT — Events & Calendar

### Event
**Evidencia de lifecycle:**
- Product Truth §9: Ciclo completo documentado:
  - `DRAFT → SCHEDULED`
  - Desde `SCHEDULED`: `→ POSTPONED`, `→ CANCELLED`, `→ IN_PROGRESS`
  - `POSTPONED → SCHEDULED`, `POSTPONED → CANCELLED`
  - `CANCELLED → SCHEDULED` (Restore)
  - Operacional: `SCHEDULED → IN_PROGRESS → COMPLETED`
  - Match: `IN_PROGRESS → ABANDONED`
  - `COMPLETED` **no se reabre**. Correcciones no retroceden lifecycle.
- E5 `UC-EVT-01/02/03`: Crean evento `SCHEDULED` (nace `SCHEDULED`, sin borrador observable)
- E5 `UC-EVT-04`: Edita; **rechaza si `COMPLETED`**; cambio material incrementa `coordination_revision`
- E5 `UC-EVT-05`: `SCHEDULED → POSTPONED` (incluye `UC-EVT-11`)
- E5 `UC-EVT-06`: `POSTPONED → SCHEDULED` (reabre disponibilidad)
- E5 `UC-EVT-07`: `SCHEDULED → CANCELLED` o `POSTPONED → CANCELLED` (incluye `UC-EVT-11`)
- E5 `UC-EVT-08`: `CANCELLED → SCHEDULED` (incluye `UC-EVT-11`)
- E5 `UC-EVT-09`: `SCHEDULED/IN_PROGRESS → COMPLETED` (terminal)
- E5 `UC-EVT-10`: `IN_PROGRESS → ABANDONED` (terminal, solo Match)
- Actor Boundary Matrix §6: `Event POSTPONED` conserva respuestas, no acepta nuevas; `CANCELLED/COMPLETED/ABANDONED` terminal; `COMPLETED` no se reabre; `Event MATCH SCHEDULED` cambiar equipo se rechaza

**Estados confirmados:** `DRAFT`, `SCHEDULED`, `POSTPONED`, `CANCELLED`, `IN_PROGRESS`, `COMPLETED`, `ABANDONED`
**Transiciones confirmadas (ver matriz completa en E6-04):**
- `DRAFT → SCHEDULED` (creación/programación atómica)
- `SCHEDULED → POSTPONED`
- `POSTPONED → SCHEDULED`
- `SCHEDULED → CANCELLED`
- `POSTPONED → CANCELLED`
- `CANCELLED → SCHEDULED` (Restore)
- `SCHEDULED → IN_PROGRESS` (inicio operacional)
- `IN_PROGRESS → COMPLETED`
- `IN_PROGRESS → ABANDONED` (solo Match)
**Prohibidas:**
- `COMPLETED →` cualquier estado (no reabre)
- `ABANDONED →` cualquier estado
- `SCHEDULED →` cambio de equipo (Match)
- Edición en `COMPLETED`

**Subtipo Match:** Tiene transición adicional `IN_PROGRESS → ABANDONED`. Equipo inmutable una vez `SCHEDULED`.

**Clasificación:** **STATE_MACHINE_REQUIRED** — El modelo más complejo y crítico. Estados persistidos, transiciones con autoridad, guards, efectos colaterales (disponibilidad, notificaciones, revisión coordinación), estados terminales.

### EventSeries
**Evidencia de lifecycle:**
- Product Truth §9: `ACTIVE → ENDED`, máx 366 ocurrencias
- E5 `UC-EVT-13`: Crea serie `ACTIVE` con ocurrencias
- E5 `UC-EVT-14`: `ACTIVE → ENDED`; **sin transición inversa**; conserva ocurrencias
- E5 `UC-EVT-04`: Edita ocurrencias con 3 alcances (solo esta, esta y siguientes, toda la serie)

**Estados confirmados:** `ACTIVE`, `ENDED`
**Transiciones:** Creación → `ACTIVE`; `ACTIVE → ENDED` (guard: serie activa)
**Prohibida:** `ENDED → ACTIVE`

**Clasificación:** **STATE_MACHINE_REQUIRED** — Estados persistidos, transición terminal sin inversa.

### Jornada
**Evidencia de lifecycle:**
- Product Truth §9: No listado con lifecycle propio
- Product Truth §16: "Jornada agrupa Matches y no duplica el lifecycle de los Matches"
- E5 `UC-EVT-15`: Crea jornada atómica (≤100 partidos); agrupa partidos; **sin transición de los partidos propios de la jornada**
- E3 Inventory §3.2: "Jornada: creación masiva atómica es una regla operacional; no necesariamente implica nuevos estados de Jornada"
- REQ-EVT-018: Bulk ≤100 atómico; un partido a lo sumo una jornada

**Análisis:** La jornada es un contenedor de agrupación. No tiene estados `DRAFT`/`ACTIVE`/`ENDED` propios. Los partidos conservan su propio lifecycle. La creación es atómica (todo o nada). No hay edición de jornada como entidad con estado.

**Clasificación:** **NO_STATE_MACHINE** — No lifecycle propio demostrable. Es una regla operacional de creación atómica, no un objeto con estados funcionales.

---

## 4.5 PRT — Participation

### Availability
**Evidencia de lifecycle:**
- Product Truth §9: Persistido: `YES` / `MAYBE` / `NO`. Derivado: `NO_RESPONSE` / `NEEDS_RECONFIRMATION`
- E5 `UC-PRT-01`: Respuesta `sí`/`quizás`/`no` registrada con fecha; **cambiar sustituye**; sin respuesta = "sin respuesta"
- E5 `UC-PRT-01` alt: `POSTPONED` conserva respuestas previas y no acepta nuevas; al volver `SCHEDULED` se puede responder
- REQ-PRT-003: Estados derivados — sin respuesta ⇒ "sin respuesta"; respuesta anterior a cambio coordinación ⇒ "necesita confirmación"; cambio no coordinativo **no** deriva reconfirmación
- REQ-PRT-004: Solo con `SCHEDULED`; `POSTPONED` conserva y no acepta

**Análisis crítico:** 
- `YES`/`MAYBE`/`NO` son **valores persistidos** de una fila `Availability`
- `NO_RESPONSE` = **ausencia de fila** (no estado persistido)
- `NEEDS_RECONFIRMATION` = **estado derivado** de: existe fila + `coordination_revision` del evento > `coordination_revision` de la respuesta

**NO dibujar:** `NO_RESPONSE → YES` como mutación de fila preexistente. `NO_RESPONSE` significa que no existe respuesta.

**Clasificación:** **DERIVED_STATE_MODEL** — Valores persistidos (`YES`/`MAYBE`/`NO`) + estados derivados (`NO_RESPONSE`, `NEEDS_RECONFIRMATION`). Separar conceptualmente en diagrama.

### Selection / SelectionRevision
**Evidencia de lifecycle:**
- Product Truth §9: Working draft revision + published immutable revisions
- E5 `UC-PRT-02`: Prepara borrador editable con guardado automático
- E5 `UC-PRT-03`: Publica → crea revisión inmutable; republicar crea revisión nueva **sin reescribir la anterior**
- E5 `UC-PRT-04`: Revisa conflictos derivados (SIBLING, no include)
- REQ-PRT-005: Borrador editable; publicación crea revisión inmutable; republicar crea nueva sin reescribir anterior
- REQ-PRT-006: Publicación no se bloquea por conflicto derivado

**Análisis:** Dos objetos relacionados:
1. **Selection** (contenedor): tiene borrador actual + historial de revisiones publicadas
2. **SelectionRevision** (cada publicación): inmutable, con estado implícito `DRAFT` (borrador actual) / `PUBLISHED` (revisiones históricas)

El borrador no es un estado persistido de SelectionRevision — es un objeto separado en edición. Las revisiones publicadas son inmutables.

**Clasificación:** **STATE_MACHINE_REQUIRED** (para SelectionRevision: `DRAFT` → `PUBLISHED` terminal) + **TEMPORAL_VALIDITY_MODEL** (para Selection como contenedor con borrador actual + historial)

### AttendanceSheet
**Evidencia de lifecycle:**
- Product Truth §9: Sheet `OPEN/CLOSED` derivado de `closed_at`
- E5 `UC-PRT-05`: Registra asistencia; precondición planilla `OPEN`
- E5 `UC-PRT-06`: Cierra planilla → `CLOSED` (derivado de marca de cierre); **no admite marcaje nuevo sin corrección**
- E5 `UC-PRT-07`: Corrige asistencia (SIBLING, no reabre); exige motivo; persiste anterior, nuevo, motivo, autor, fecha
- REQ-PRT-011: Reapertura **no** es requisito; corrección la cubre

**Análisis:** `OPEN`/`CLOSED` es **derivado** de `closed_at` (NULL = OPEN, timestamp = CLOSED). No hay transición `CLOSED → OPEN`. La corrección no reabre.

**Clasificación:** **TEMPORAL_VALIDITY_MODEL** (estado derivado de timestamp) — No machine de estados con enum persistido.

### AttendanceEntry
**Evidencia de lifecycle:**
- Product Truth §9: `PRESENT` / `ABSENT` / `JUSTIFIED`. Sin row = `UNRECORDED` (derivado)
- E5 `UC-PRT-05`: Marca `PRESENT`/`ABSENT`/`JUSTIFIED`; persiste inmediato; sin registro = "sin registrar"
- E5 `UC-PRT-07`: Corrección con motivo; persiste anterior, nuevo, motivo, autor, fecha
- REQ-PRT-010: "Sin registrar" ≠ "ausente"; estado propio distinguible

**Análisis:** Valores persistidos por fila: `PRESENT`/`ABSENT`/`JUSTIFIED`. `UNRECORDED` = ausencia de fila (derivado). Corrección muta el valor pero no cambia "estado" en sentido de machine — es actualización de campo con auditoría.

**Clasificación:** **STATE_MACHINE_REQUIRED** (valores persistidos mutables con auditoría) — Pero simple: 3 valores, transición libre entre ellos (con corrección auditada), `UNRECORDED` derivado.

### MatchRecord
**Evidencia de lifecycle:**
- Product Truth §9: `DRAFT → FINAL`; FINAL sólo se corrige explícitamente
- E5 `UC-PRT-08`: Crea `MatchRecord` en `DRAFT`; precondición: ciclo del evento compatible
- E5 `UC-PRT-09`: `DRAFT → FINAL`; finalización terminal por vía normal
- E5 `UC-PRT-10`: Corrige `FINAL` con motivo; **no retrocede lifecycle**; marcador final visible con evidencia
- REQ-PRT-013: `DRAFT → FINAL`; finalizado no se edita por vía normal; fuera de ciclo ⇒ `MATCH_STATE_INCOMPATIBLE`
- REQ-PRT-015: `PLAYED`/`FORFEIT` exige `COMPLETED`; `ABANDONED` exige `ABANDONED`
- Actor Boundary Matrix §6: `MatchRecord FINAL` ⇒ no se edita por vía normal; evento ∉ {COMPLETED, ABANDONED} ⇒ `MATCH_STATE_INCOMPATIBLE`

**Estados confirmados:** `DRAFT`, `FINAL`
**Transiciones:** `DRAFT → FINAL` (finalización coach); **prohibida** `FINAL → DRAFT`
**Corrección:** Operación separada sobre `FINAL` (persiste historia), no transición inversa.

**Distinción crítica:** MatchRecord ≠ Event Match. Que el partido termine (`COMPLETED`) no significa que MatchRecord sea `FINAL` automáticamente.

**Clasificación:** **STATE_MACHINE_REQUIRED** — Estados persistidos, transición terminal, corrección como operación separada con historia.

### EligibilityConstraint
**Evidencia de lifecycle:**
- Product Truth §13: `PENDING` / `BLOCKED` persistidos. `ELIGIBLE` derivado (sin restricción activa aplicable)
- E5 `UC-PRT-12`: Registra restricción con estado, alcance, origen, motivo, vigencia; **no hay CU de finalizar**: la vigencia se registra dentro de este CU
- E5 `UC-PRT-13`: Consulta estado derivado; visibilidad diferenciada por autoridad

**Análisis:** Estados persistidos: `PENDING`, `BLOCKED`. `ELIGIBLE` = derivado (no restricción activa). La vigencia (`validFrom`, `validUntil`) controla aplicabilidad. No hay transición `BLOCKED → PENDING` ni machine compleja — son dos estados de una restricción individual.

**Clasificación:** **STATE_MACHINE_REQUIRED** (simple: 2 estados persistidos) + **TEMPORAL_VALIDITY_MODEL** (vigencia controla aplicabilidad)

---

## 4.6 COM — Communication

### Announcement
**Evidencia de lifecycle:**
- Product Truth §9: `DRAFT → PUBLISHED → ARCHIVED`
- E5 `UC-COM-01`: Crea `DRAFT`
- E5 `UC-COM-02`: `DRAFT → PUBLISHED`; **audiencia snapshot inmutable**
- E5 `UC-COM-03`: Corrige `PUBLISHED`; título/cuerpo; **audiencia no cambia**; texto anterior en historia
- E5 `UC-COM-04`: `PUBLISHED → ARCHIVED`; conserva contenido e historia
- E5 `UC-COM-05`: Consulta `PUBLISHED`; solo si en audiencia
- REQ-COM-003: Audiencia fijada al publicar, inmutable

**Estados confirmados:** `DRAFT`, `PUBLISHED`, `ARCHIVED`
**Transiciones:** `DRAFT → PUBLISHED`; `PUBLISHED → ARCHIVED`
**Prohibidas:** `PUBLISHED → DRAFT`; `ARCHIVED →` cualquier; cambio de audiencia en `PUBLISHED`

**Clasificación:** **STATE_MACHINE_REQUIRED** — Estados persistidos, transiciones con autoridad (solo Subcomisión), guards, audiencia inmutable en `PUBLISHED`.

### Conversation
**Evidencia de lifecycle:**
- Product Truth §9: `ACTIVE → ARCHIVED` (solo GROUP; directas y canónicas no se archivan por REQ)
- E5 `UC-COM-06`: Abre/crea directa canónica (única por par)
- E5 `UC-COM-07`: Crea grupo `ACTIVE`
- E5 `UC-COM-08`: Abre/crea canónica equipo/evento (0..1 por objeto)
- E5 `UC-COM-12`: **Solo GROUP** `ACTIVE → ARCHIVED` (REQ-COM-007 AC 4)
- Product Truth §20: Participantes tienen `joined_at`/`left_at`; ex-participante conserva período; Admin sin participación no lee

**Análisis:** Tipos de conversación con lifecycles distintos:
- `DIRECT`: No se archiva (máximo 1 por par, siempre accesible para participantes)
- `TEAM`/`EVENT` (canónicas): No se archivan; ligadas a vida del objeto real
- `GROUP`: `ACTIVE → ARCHIVED` (archivable por participante)

**Clasificación:** **STATE_MACHINE_REQUIRED** (solo para GROUP: `ACTIVE → ARCHIVED`) — Para DIRECT/TEAM/EVENT: **NO_STATE_MACHINE** (no tienen transiciones de estado, solo existencia y membresía temporal).

### Message
**Evidencia de lifecycle:**
- Product Truth §9: `SENT → EDITED → DELETED` (tombstone)
- E5 `UC-COM-09`: Envía mensaje (persistido)
- E5 `UC-COM-10`: Edita propio; expone historia con fecha real y actor
- E5 `UC-COM-11`: Elimina propio; **tombstone** irreversible con confirmación y motivo
- REQ-COM-010: Solo mensajes propios; borrado = tombstone

**Análisis:** Estados: `SENT` (creación), `EDITED` (si se editó al menos una vez), `DELETED` (tombstone). `EDITED` no es obligatorio — un mensaje puede ir `SENT → DELETED`. La edición no cambia a un estado separado necesariamente; es una propiedad del mensaje.

**Clasificación:** **STATE_MACHINE_REQUIRED** (simple) — `SENT` → (`EDITED`)* → `DELETED` (tombstone). `DELETED` terminal.

### Notification
**Evidencia de lifecycle:**
- Product Truth §22: 7 tipos; clave lógica única `origin_event_id + recipient + type`; `read_at` para marcar leída
- E5 `UC-COM-13`: Consulta notificaciones; no leídas primero
- E5 `UC-COM-14`: Marca como leída (`read_at`); SIBLING de consultar
- REQ-COM-018: `read_at` registrada; combinación única no se rompe ni duplica

**Análisis:** `read_at` NULL/NO NULL = `UNREAD`/`READ` (derivado). No hay machine compleja. No hay `ARCHIVED`, `DISMISSED`, etc. Solo 7 tipos de notificación, no estados de notificación.

**Clasificación:** **DERIVED_STATE_MODEL** — `UNREAD`/`READ` derivado de `read_at`. No machine de estados.

---

## 4.7 CMP — Competition

### Competition
**Evidencia de lifecycle:**
- Product Truth §9: `DRAFT → ACTIVE → CLOSED`
- E5 `UC-CMP-01`: Crea `DRAFT`
- E5 `UC-CMP-02`: `DRAFT → ACTIVE`
- E5 `UC-CMP-03`: `ACTIVE → CLOSED`; **guard: 0 inscripciones activas** (explicándolas)
- REQ-CMP-001: Ciclo `DRAFT → ACTIVE → CLOSED`
- REQ-CMP-002: Cierre requiere 0 inscripciones activas

**Estados confirmados:** `DRAFT`, `ACTIVE`, `CLOSED`
**Transiciones:** `DRAFT → ACTIVE`; `ACTIVE → CLOSED` (guard: 0 active entries)
**Prohibida:** `CLOSED →` cualquier (terminal en V1)

**Clasificación:** **STATE_MACHINE_REQUIRED** — Estados persistidos, guards claros, estado terminal.

### CompetitionEntry
**Evidencia de lifecycle:**
- Product Truth §9: `PENDING → ACTIVE → ENDED`
- E5 `UC-CMP-04`: Inscribe equipo → `PENDING` (scope `TEAM`)
- E5 `UC-CMP-05`: Inscribe línea → `PENDING` (scope `LINE`)
- E5 `UC-CMP-06`: `PENDING → ACTIVE` (guard: alcance compatible)
- E5 `UC-CMP-07`: `ACTIVE → ENDED`; en uso ⇒ serialización; histórico conservado
- REQ-CMP-003: `PENDING → ACTIVE → ENDED`
- REQ-CMP-004: `TEAM` y `LINE` son **alcances de dato**, no estados

**Estados confirmados:** `PENDING`, `ACTIVE`, `ENDED`
**Transiciones:** `PENDING → ACTIVE`; `ACTIVE → ENDED` (guard: serialización si en uso)
**Prohibida:** `ENDED →` cualquier

**Nota importante:** `TEAM` y `LINE` son **alcances de dato** (scope de la inscripción), no etapas del lifecycle. No modelar como estados.

**Clasificación:** **STATE_MACHINE_REQUIRED** — Estados persistidos, guards, estado terminal.

---

# 5. RESUMEN DE CLASIFICACIONES

| Objeto | Dominio | Clasificación | Justificación |
|---|---|---|---|
| `Account` | IAM | **STATE_MACHINE_REQUIRED** | Enum persistido `PENDING/ACTIVE/DISABLED`, transiciones mutativas con autoridad |
| `Membership` | PPL | **TEMPORAL_VALIDITY_MODEL** | Intervalo `[from, until)`, no enum persistido |
| `TeamAssignment` | PPL | **TEMPORAL_VALIDITY_MODEL** | Intervalo `[from, until)`, no enum persistido |
| `RoleAssignment` | PPL | **TEMPORAL_VALIDITY_MODEL** | Intervalo `[from, until)`, no enum persistido |
| `GuardianRelationship` | PPL | **TEMPORAL_VALIDITY_MODEL** | Intervalo + flags booleanos, no enum |
| `Team` | STR | **STATE_MACHINE_REQUIRED** | `DRAFT/ACTIVE/ARCHIVED` persistido, guards, terminal sin restore V1 |
| `Division` | STR | **STATE_MACHINE_REQUIRED** | `ACTIVE/ARCHIVED` (implícito), `archived_at`, guards, terminal sin restore |
| `Line` | STR | **STATE_MACHINE_REQUIRED** | Igual que Division |
| `Venue` | STR | **STATE_MACHINE_REQUIRED** | `ACTIVE/ARCHIVED` (implícito), `archived_at`, guards, terminal sin restore |
| `Season` | STR | **NO_STATE_MACHINE** | Entidad histórica sin estado, solo timestamps |
| `Event` | EVT | **STATE_MACHINE_REQUIRED** | 7 estados, transiciones complejas, guards, efectos colaterales, terminales |
| `EventSeries` | EVT | **STATE_MACHINE_REQUIRED** | `ACTIVE/ENDED`, terminal sin inversa, máx 366 ocurrencias |
| `Jornada` | EVT | **NO_STATE_MACHINE** | Contenedor atómico, no lifecycle propio |
| `Availability` | PRT | **DERIVED_STATE_MODEL** | Persistido: YES/MAYBE/NO; Derivado: NO_RESPONSE/NEEDS_RECONFIRMATION |
| `SelectionRevision` | PRT | **STATE_MACHINE_REQUIRED** | `DRAFT → PUBLISHED` (inmutable), republicar = nueva revisión |
| `Selection` (contenedor) | PRT | **TEMPORAL_VALIDITY_MODEL** | Borrador actual + historial revisiones |
| `AttendanceSheet` | PRT | **TEMPORAL_VALIDITY_MODEL** | `OPEN/CLOSED` derivado de `closed_at`, sin reapertura |
| `AttendanceEntry` | PRT | **STATE_MACHINE_REQUIRED** | 3 valores persistidos + `UNRECORDED` derivado, corrección auditada |
| `MatchRecord` | PRT | **STATE_MACHINE_REQUIRED** | `DRAFT → FINAL` terminal, corrección separada con historia |
| `EligibilityConstraint` | PRT | **STATE_MACHINE_REQUIRED** + **TEMPORAL** | `PENDING/BLOCKED` persistido + vigencia; `ELIGIBLE` derivado |
| `Announcement` | COM | **STATE_MACHINE_REQUIRED** | `DRAFT/PUBLISHED/ARCHIVED`, audiencia inmutable en PUBLISHED |
| `Conversation (GROUP)` | COM | **STATE_MACHINE_REQUIRED** | `ACTIVE → ARCHIVED` |
| `Conversation (DIRECT/TEAM/EVENT)` | COM | **NO_STATE_MACHINE** | Sin transiciones de estado, solo membresía temporal |
| `Message` | COM | **STATE_MACHINE_REQUIRED** | `SENT → EDITED* → DELETED` (tombstone) |
| `Notification` | COM | **DERIVED_STATE_MODEL** | `UNREAD/READ` derivado de `read_at` |
| `Competition` | CMP | **STATE_MACHINE_REQUIRED** | `DRAFT/ACTIVE/CLOSED`, guard 0 active entries |
| `CompetitionEntry` | CMP | **STATE_MACHINE_REQUIRED** | `PENDING/ACTIVE/ENDED`, `TEAM`/`LINE` son scopes de dato |

---

# 6. CONTRADICCIONES Y HALLAZGOS CRÍTICOS

| ID | Objeto | Fuente | Evidencia | Contradicción / Problema | Impacto | Recomendación | Bloqueante |
|---|---|---|---|---|---|---|---|
| AUD-01 | `Availability` | PT §9 vs E5 | PT lista `NO_RESPONSE`/`NEEDS_RECONFIRMATION` como "Derivados"; E5 `UC-PRT-01` trata respuesta como registro persistido | Riesgo de modelar `NO_RESPONSE` como estado persistido con transición `→ YES` | **MAJOR** — Falsearía el modelo si se dibuja `NO_RESPONSE` como nodo con flecha entrante | Separar visualmente: nodos persistidos (YES/MAYBE/NO) vs derivados (NO_RESPONSE, NEEDS_RECONFIRMATION). No flecha `NO_RESPONSE → YES`. | NO |
| AUD-02 | `Membership` / `TeamAssignment` / `RoleAssignment` / `GuardianRelationship` | PT §9 vs práctica común | PT dice "Temporal: `[valid_from, valid_until)`" pero muchos esperan enum `ACTIVE/EXPIRED/REVOKED` | Inventar enum persistido contradice PT | **MAJOR** — Falsearía el modelo de dominio | Documentar como **TEMPORAL_VALIDITY_MODEL**. No crear máquina con estados `ACTIVE/EXPIRED`. | NO |
| AUD-03 | `Event` `COMPLETED` | PT §9 vs E5 `UC-EVT-09` | PT: "COMPLETED no reabre. Correcciones no retroceden lifecycle." E5: `UC-EVT-09` postcondición "terminal, no se reabre" | Consistente. Sin contradicción. | **INFO** — Confirmado | Documentar explícitamente: `COMPLETED` no tiene salidas. | NO |
| AUD-04 | `Event` `ABANDONED` | PT §9 | Solo para Match: `IN_PROGRESS → ABANDONED`. ¿Training/ClubEvent pueden abandonarse? | PT §9 dice "Match: IN_PROGRESS → ABANDONED". No menciona otros tipos. | **MINOR** — Ambiguo para Training/ClubEvent | Asumir que solo Match tiene `ABANDONED` (consistente con PT §9 "Match:" prefijo). Documentar. | NO |
| AUD-05 | `MatchRecord` vs `Event` | PT §9, §15 | PT: "Que el partido termine no significa automáticamente que el MatchRecord se haya finalizado" | Distinción crítica: `Event COMPLETED` ≠ `MatchRecord FINAL` | **MAJOR** — Si se confunden, se pierde la distinción | Modelar como máquinas SEPARADAS. `Event` termina en `COMPLETED`; `MatchRecord` termina en `FINAL` por acción explícita del coach. | NO |
| AUD-06 | `Selection` vs `SelectionRevision` | PT §9, E5 | PT: "Working draft revision + published immutable revisions". E5: `UC-PRT-02` (borrador), `UC-PRT-03` (publica revisión inmutable) | Dos objetos: contenedor (Selection) y revisión (SelectionRevision). No unificar. | **MAJOR** — Unificarlos perdería inmutabilidad de revisiones publicadas | Diagramar `SelectionRevision` con `DRAFT → PUBLISHED`. `Selection` como contenedor temporal. | NO |
| AUD-07 | `AttendanceSheet` reapertura | REQ-PRT-011 NOTES vs E5 | REQ: "reapertura no es requisito; corrección la cubre". E5 `UC-PRT-07` es SIBLING, no reabre. | Consistente. No hay `CLOSED → OPEN`. | **INFO** — Confirmado | No dibujar `CLOSED → OPEN`. | NO |
| AUD-08 | `Jornada` | E3 §3.2, PT §16 | "Creación masiva atómica es regla operacional; no necesariamente implica nuevos estados" | No asignar lifecycle inventado | **INFO** — Confirmado | `NO_STATE_MACHINE` con evidencia. | NO |
| AUD-09 | `Season` | PT §9, §19 | "sin ciclo de estado", "histórica, sin eliminación" | No inventar estados | **INFO** — Confirmado | `NO_STATE_MACHINE`. | NO |
| AUD-10 | `CompetitionEntry` `TEAM`/`LINE` | PT §4, REQ-CMP-004 | "Son alcances de dato, no etapas de lifecycle" | No modelar como estados | **MAJOR** — Error común | Documentar explícitamente: scopes de dato, no estados. | NO |
| AUD-11 | `Conversation` tipos | PT §20, E5 | DIRECT/TEAM/EVENT no archivables; solo GROUP archivable | Un solo diagrama para todos falsearía | **MAJOR** — Solo GROUP tiene machine | Separar: machine solo para GROUP. DIRECT/TEAM/EVENT = NO_STATE_MACHINE. | NO |
| AUD-12 | `Notification` | PT §22, E5 | Solo `read_at` timestamp. No estados complejos. | No inventar `UNREAD/READ` como machine | **MINOR** | `DERIVED_STATE_MODEL`. | NO |

---

# 7. DECISIONES DE MODELADO ADOPTADAS

| Decisión | Objeto(s) | Fundamento |
|---|---|---|
| **No inventar enums para vigencia temporal** | Membership, TeamAssignment, RoleAssignment, GuardianRelationship | PT §9 explícito: "Temporal: `[valid_from, valid_until)`". La vigencia es derivada. |
| **Separar estados persistidos y derivados** | Availability, Notification | PT §9 distingue "Persistido" vs "Derivado". E5 confirma semántica. |
| **No dibujar transiciones prohibidas como flechas** | Todos | Una flecha prohibida parece permitida. Documentar en matriz de transiciones prohibidas (§10). |
| **Estados terminales ≠ pseudonodo final UML** | Event (COMPLETED, ABANDONED), Team (ARCHIVED), etc. | Objeto persiste para consulta/historial/auditoría. No forzar pseudonodo final. |
| **Modelar objetos distintos aunque relacionados** | Selection/SelectionRevision, Event/MatchRecord, AttendanceSheet/Entry | Diferentes lifecycles, autoridades, inmutabilidad. |
| **Subtipo Match como variante de Event** | Event | Match tiene transición adicional `IN_PROGRESS → ABANDONED` y restricción equipo inmutable. Modelar como sub-machine o anotación en máquina Event. |
| **No machine para Season, Jornada** | Season, Jornada | Sin evidencia de lifecycle propio en autoridades. |

---

# 8. RIESGOS IDENTIFICADOS

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Confundir vigencia temporal con enum de estados | ALTA | MAJOR | Documentación explícita en catálogo; separación visual en diagramas |
| Unificar Selection y SelectionRevision | MEDIA | MAJOR | Diagramas separados; catálogo distingue contenedor vs revisión |
| Confundir Event COMPLETED con MatchRecord FINAL | MEDIA | MAJOR | Dos máquinas separadas; trazabilidad a CU distintos |
| Dibujar `NO_RESPONSE → YES` como transición | MEDIA | MAJOR | Nota explícita en diagrama Availability; catálogo aclara derivación |
| Inventar `ARCHIVED → ACTIVE` para estructura | BAJA | CRITICAL | PT §9, DEF-STR-001/002, E5 explícitos: no restore en V1 |
| Tratar `TEAM`/`LINE` como estados de CompetitionEntry | MEDIA | MAJOR | Catálogo y diagrama: scopes de dato, no estados |

---

# 9. OBJETOS CON MÁQUINA ADMITIDA — LISTA FINAL PARA E6-05

| SM-ID | Objeto | Dominio | Tipo |
|---|---|---|---|
| `SM-ACCOUNT-01` | Account | IAM | Persistida |
| `SM-TEAM-01` | Team | STR | Persistida |
| `SM-DIVISION-01` | Division | STR | Persistida (implícita) |
| `SM-LINE-01` | Line | STR | Persistida (implícita) |
| `SM-VENUE-01` | Venue | STR | Persistida (implícita) |
| `SM-EVENT-01` | Event | EVT | Persistida (compleja, subtipo Match) |
| `SM-EVENTSERIES-01` | EventSeries | EVT | Persistida |
| `SM-AVAILABILITY-01` | Availability | PRT | Persistida + Derivada |
| `SM-SELECTIONREV-01` | SelectionRevision | PRT | Persistida |
| `SM-ATTENDANCEENTRY-01` | AttendanceEntry | PRT | Persistida |
| `SM-MATCHRECORD-01` | MatchRecord | PRT | Persistida |
| `SM-ELIGIBILITY-01` | EligibilityConstraint | PRT | Persistida + Temporal |
| `SM-ANNOUNCEMENT-01` | Announcement | COM | Persistida |
| `SM-CONVERSATION-GROUP-01` | Conversation (GROUP) | COM | Persistida |
| `SM-MESSAGE-01` | Message | COM | Persistida |
| `SM-COMPETITION-01` | Competition | CMP | Persistida |
| `SM-COMPETITIONENTRY-01` | CompetitionEntry | CMP | Persistida |

**Total máquinas a diagramar: 17**

Objetos con modelo temporal/derivado (documentar en catálogo, no diagramar como machine):
- Membership, TeamAssignment, RoleAssignment, GuardianRelationship (temporal)
- Season, Jornada (no machine)
- Availability (derivados documentados)
- Selection (contenedor temporal)
- AttendanceSheet (derivado de timestamp)
- Conversation DIRECT/TEAM/EVENT (no machine)
- Notification (derivado)

---

# 10. PRÓXIMOS PASOS

1. **E6-02** — Inventario de objetos candidatos (este documento ya lo contiene, formalizar en catálogo).
2. **E6-03** — Catálogo canónico de estados (`GEI_STATE_MODEL_CATALOG_V1.md`).
3. **E6-04** — Registro completo de transiciones (`GEI_STATE_TRANSITION_MATRIX_V1.md`).
4. **E6-05** — Generación de 17 diagramas Draw.io.
5. **E6-06** — Export PNG/PDF + QA visual real.
6. **E6-07** — Trazabilidad + Machine/Semantic QA.
7. **E6-08** — Freeze.

---

**Fin de la Auditoría de Reconstrucción de Estados V1.**

**E6_BASELINE_SHA = `01ee760388e27592d007c1c6f539e9204aefbf62`**