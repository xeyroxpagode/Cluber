# GEI HOCKEY MANAGEMENT SYSTEM
## STATE DIAGRAMS FREEZE V1

**Etapa:** 6 — Diagramas de estados
**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-07
**Rama:** `gei/e6-state-diagrams-freeze-v1`
**Baseline E5:** `01ee760388e27592d007c1c6f539e9204aefbf62` (`gei/e5-use-case-specifications-freeze-v1`)
**E6_BASELINE_SHA:** `01ee760388e27592d007c1c6f539e9204aefbf62`
**Resultado del gate:** **PASS**

---

# 1. ESTADO Y VERSIÓN

Este documento es la **autoridad de los diagramas de estados** de GEI a partir de esta fecha. Declara qué objetos tienen máquinas de estados, cuáles son sus estados y transiciones canónicas, qué transiciones están prohibidas, y cómo repercuten los estados sobre otras operaciones.

| Documento | Rol |
|---|---|
| `docs/uml/states/GEI_STATE_RECONSTRUCTION_AUDIT_V1.md` | Auditoría previa obligatoria (proceso, evidencia, hallazgos) |
| `docs/uml/states/GEI_STATE_CANDIDATE_INVENTORY_V1.md` | Inventario de 29 objetos evaluados con clasificación |
| `docs/uml/states/GEI_STATE_MODEL_CATALOG_V1.md` | Catálogo canónico de 17 máquinas admitidas |
| `docs/uml/states/GEI_STATE_TRANSITION_MATRIX_V1.md` | Registro completo de 62 transiciones permitidas + 65 prohibidas |
| `docs/uml/states/GEI_STATE_TRACEABILITY_MATRIX_V1.md` | Trazabilidad REQ/AC → UC → Máquina → Estado/Transición/Guard |
| `docs/uml/states/GEI_STATE_DIAGRAM_MANIFEST_V1.md` | Manifest de 17 diagramas Draw.io con validaciones |
| `docs/uml/states/source/` | **17 archivos `.drawio` fuente autoritativa (editable)** |
| `docs/uml/states/export/png/` | **17 PNG derivados para revisión visual** |
| `docs/uml/states/export/pdf/` | **17 PDF derivados para entrega académica** |
| **Este documento** | **Freeze autoritativo** |

**Regla:** Si un `.drawio` y un PDF contradicen algo, **manda el `.drawio`**.

---

# 2. AUTORIDADES UTILIZADAS

| Documento | Versión | Estado |
|---|---|---|
| `GEI_REQUIREMENTS_FREEZE_V1.md` | V1 | FROZEN |
| `GEI_REQUIREMENTS_CATALOG_V1.md` | V1 | FROZEN |
| `GEI_ACTOR_MODEL_FREEZE_V1.md` | V1 | FROZEN |
| `GEI_ACTOR_AUTHORITY_BOUNDARY_MATRIX_V1.md` | V1 | FROZEN |
| `GEI_MASTER_USE_CASE_INVENTORY_FREEZE_V1.md` | V1 | FROZEN |
| `GEI_MASTER_USE_CASE_CATALOG_V1.md` | V1 | FROZEN |
| `GEI_USE_CASE_DIAGRAM_FREEZE_V1_0_1.md` | V1.0.1 | FROZEN |
| `GEI_USE_CASE_RELATION_DECISIONS_V1.md` | V1 | FROZEN |
| `GEI_USE_CASE_SPECIFICATION_FREEZE_V1.md` | V1 | FROZEN |
| 8 archivos `GEI_UC_SPEC_<DOMAIN>_V1.md` | V1 | FROZEN |
| `GEI_USE_CASE_SPEC_TRACEABILITY_V1.md` | V1 | FROZEN |
| `GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` | v1.0.1 | FROZEN (manda sobre todo) |

---

# 3. REGLAS DE MODELADO APLICADAS

1. **Solo modelar objetos con lifecycle funcional real** — No un diagrama por CU ni por clase.
2. **Estados persistidos ≠ derivados ≠ vigencia temporal** — Separación conceptual obligatoria.
3. **No inventar enums para vigencia temporal** — Membership, TeamAssignment, RoleAssignment, GuardianRelationship usan intervalo `[valid_from, valid_until)`.
4. **No dibujar transiciones prohibidas como flechas** — Documentadas en matriz y nota en diagrama.
5. **Estados terminales ≠ pseudonodo final UML** — Objetos persisten para historial/auditoría.
6. **Autoridad por transición** — Cada transición mutativa tiene actor/authority source explícito.
7. **Subtipo Match como variante de Event** — Transición extra `IN_PROGRESS→ABANDONED` y restricción equipo inmutable.
8. **Selección/SelectionRevision separados** — Borrador editable (`DRAFT`) vs revisiones publicadas inmutables (`PUBLISHED`).
9. **MatchRecord ≠ Event Match** — `Event COMPLETED` ≠ `MatchRecord FINAL` automático.
10. **Conversation solo GROUP tiene machine** — DIRECT/TEAM/EVENT son `NO_STATE_MACHINE`.

---

# 4. OBJETOS CON MÁQUINAS DE ESTADOS (17)

| SM-ID | Objeto | Dominio | Tipo | Estados Canónicos | Terminal(es) |
|---|---|---|---|---|---|
| `SM-ACCOUNT-01` | Account | IAM | Persistida | `PENDING`, `ACTIVE`, `DISABLED` | `DISABLED` (relativo, reactivable) |
| `SM-TEAM-01` | Team | STR | Persistida | `DRAFT`, `ACTIVE`, `ARCHIVED` | `ARCHIVED` (V1) |
| `SM-DIVISION-01` | Division | STR | Persistida (implícita) | `ACTIVE`, `ARCHIVED` | `ARCHIVED` (V1) |
| `SM-LINE-01` | Line | STR | Persistida (implícita) | `ACTIVE`, `ARCHIVED` | `ARCHIVED` (V1) |
| `SM-VENUE-01` | Venue | STR | Persistida (implícita) | `ACTIVE`, `ARCHIVED` | `ARCHIVED` (V1) |
| `SM-EVENT-01` | Event | EVT | Persistida (compleja) | `DRAFT`, `SCHEDULED`, `POSTPONED`, `CANCELLED`, `IN_PROGRESS`, `COMPLETED`, `ABANDONED` | `CANCELLED`, `COMPLETED`, `ABANDONED` |
| `SM-EVENTSERIES-01` | EventSeries | EVT | Persistida | `ACTIVE`, `ENDED` | `ENDED` |
| `SM-AVAILABILITY-01` | Availability | PRT | Persistida + Derivada | `YES/MAYBE/NO` (persistidos), `NO_RESPONSE`, `NEEDS_RECONFIRMATION` (derivados) | — |
| `SM-SELECTIONREV-01` | SelectionRevision | PRT | Persistida | `DRAFT`, `PUBLISHED` | `PUBLISHED` (inmutable) |
| `SM-ATTENDANCEENTRY-01` | AttendanceEntry | PRT | Persistida | `PRESENT`, `ABSENT`, `JUSTIFIED`, `UNRECORDED` (derivado) | — |
| `SM-MATCHRECORD-01` | MatchRecord | PRT | Persistida | `DRAFT`, `FINAL` | `FINAL` |
| `SM-ELIGIBILITY-01` | EligibilityConstraint | PRT | Persistida + Temporal | `PENDING`, `BLOCKED`, `ELIGIBLE` (derivado) | — |
| `SM-ANNOUNCEMENT-01` | Announcement | COM | Persistida | `DRAFT`, `PUBLISHED`, `ARCHIVED` | `ARCHIVED` |
| `SM-CONVERSATION-GROUP-01` | Conversation (GROUP) | COM | Persistida | `ACTIVE`, `ARCHIVED` | `ARCHIVED` |
| `SM-MESSAGE-01` | Message | COM | Persistida | `SENT`, `EDITED`, `DELETED` (tombstone) | `DELETED` |
| `SM-COMPETITION-01` | Competition | CMP | Persistida | `DRAFT`, `ACTIVE`, `CLOSED` | `CLOSED` |
| `SM-COMPETITIONENTRY-01` | CompetitionEntry | CMP | Persistida | `PENDING`, `ACTIVE`, `ENDED` | `ENDED` |

---

# 5. OBJETOS EXCLUIDOS Y MOTIVO (12)

| Objeto | Clasificación | Motivo |
|---|---|---|
| Membership | `TEMPORAL_VALIDITY_MODEL` | Vigencia `[valid_from, valid_until)` sin enum persistido (PT §9) |
| TeamAssignment | `TEMPORAL_VALIDITY_MODEL` | Vigencia `[valid_from, valid_until)` sin enum persistido (PT §9) |
| RoleAssignment | `TEMPORAL_VALIDITY_MODEL` | Vigencia `[valid_from, valid_until)` sin enum persistido (PT §9) |
| GuardianRelationship | `TEMPORAL_VALIDITY_MODEL` | Vigencia + 2 flags booleanos, sin enum (PT §17, §20) |
| Selection (contenedor) | `TEMPORAL_VALIDITY_MODEL` | Borrador actual + historial revisiones inmutables |
| AttendanceSheet | `TEMPORAL_VALIDITY_MODEL` | `OPEN/CLOSED` derivado de `closed_at`, sin reapertura |
| Availability (derivados) | `DERIVED_STATE_MODEL` | `NO_RESPONSE` (sin fila), `NEEDS_RECONFIRMATION` (coord_rev) |
| Notification | `DERIVED_STATE_MODEL` | `UNREAD/READ` derivado de `read_at` |
| Conversation (DIRECT) | `NO_STATE_MACHINE` | Única por par canónico, sin transiciones |
| Conversation (TEAM/EVENT) | `NO_STATE_MACHINE` | 0..1 por objeto real, título derivado, sin transiciones |
| Season | `NO_STATE_MACHINE` | Entidad histórica sin estado (PT §9, §19) |
| Jornada | `NO_STATE_MACHINE` | Contenedor atómico, no lifecycle propio (PT §16) |

---

# 6. RESUMEN DE TRANSICIONES

| Máquina | Transiciones Permitidas | Transiciones Prohibidas Documentadas |
|---|---:|---:|
| `SM-ACCOUNT-01` | 4 | 5 |
| `SM-TEAM-01` | 3 | 5 |
| `SM-DIVISION-01` | 3 | 4 |
| `SM-LINE-01` | 3 | 4 |
| `SM-VENUE-01` | 3 | 4 |
| `SM-EVENT-01` | 14 | 9 |
| `SM-EVENTSERIES-01` | 3 | 3 |
| `SM-AVAILABILITY-01` | 4 | 4 |
| `SM-SELECTIONREV-01` | 3 | 3 |
| `SM-ATTENDANCEENTRY-01` | 3 | 3 |
| `SM-MATCHRECORD-01` | 3 | 4 |
| `SM-ELIGIBILITY-01` | 3 | 2 |
| `SM-ANNOUNCEMENT-01` | 4 | 5 |
| `SM-CONVERSATION-GROUP-01` | 2 | 3 |
| `SM-MESSAGE-01` | 3 | 3 |
| `SM-COMPETITION-01` | 3 | 3 |
| `SM-COMPETITIONENTRY-01` | 4 | 4 |
| **TOTAL** | **62** | **65** |

---

# 7. INVARIANTES CRÍTICAS

| Invariante | Máquinas Afectadas | Fuente |
|---|---|---|
| `LAST_ADMIN_REQUIRED` valla | Account, RoleAssignment, Membership | `REQ-IAM-013` |
| `INVALID_ROLE_SCOPE` | RoleAssignment | `REQ-PPL-006`, `REQ-IAM-016` |
| Equipo Match inmutable `SCHEDULED` | Event | `REQ-EVT-006` |
| `COMPLETED` no se reabre | Event | PT §9, `REQ-EVT-007` |
| `MATCH_STATE_INCOMPATIBLE` | MatchRecord | `REQ-PRT-015` |
| `COORDINATION_REVISION` incrementa en cambio material | Event, EventSeries, Availability | `REQ-EVT-011`, `REQ-PRT-003` |
| `STALE_VERSION` concurrencia optimista | Event | `REQ-EVT-013`, `REQ-SYS-017` |
| Audiencia Announcement inmutable en `PUBLISHED` | Announcement | `REQ-COM-003` |
| Scopes `TEAM`/`LINE` son datos, no estados | CompetitionEntry | `REQ-CMP-004`, PT §4 |
| `ELIGIBLE` derivado (sin restricción activa) | EligibilityConstraint | PT §13 |
| `UNRECORDED` ≠ `ABSENT` | AttendanceEntry | `REQ-PRT-010` |
| `NO_RESPONSE` ≠ estado persistido | Availability | PT §9, `REQ-PRT-003` |

---

# 8. ESTADOS DERIVADOS / TEMPORALES (NO PERSISTIDOS)

| Modelo | Estado Derivado | Definición |
|---|---|---|
| Availability | `NO_RESPONSE` | Ausencia de fila en `availabilities` |
| Availability | `NEEDS_RECONFIRMATION` | `∃ respuesta ∧ event.coord_rev > avail.coord_rev` |
| AttendanceEntry | `UNRECORDED` | Ausencia de fila en `attendance_entries` |
| AttendanceSheet | `OPEN` / `CLOSED` | `closed_at` NULL / timestamp |
| EligibilityConstraint | `ELIGIBLE` | `¬∃ restricción activa (now ∈ [from,until) ∧ BLOCKED)` |
| Notification | `UNREAD` / `READ` | `read_at` NULL / timestamp |
| Membership/TeamAssignment/RoleAssignment/GuardianRelationship | `VIGENTE` | `now ∈ [valid_from, valid_until)` |

---

# 9. TRANSICIONES PROHIBIDAS CLAVE (NO DIBUJADAS)

| Transición | Motivo |
|---|---|
| `COMPLETED →` cualquier estado | PT §9: "COMPLETED no reabre" |
| `ABANDONED →` cualquier estado | Terminal |
| `ARCHIVED → ACTIVE` (Team/Division/Line/Venue) | Restore no en V1 (`DEF-STR-001/002` defer) |
| `PUBLISHED → DRAFT` (Announcement) | Inmutable |
| `PUBLISHED →` cambiar audiencia | Snapshot inmutable (`REQ-COM-003`) |
| `FINAL → DRAFT` (MatchRecord) | Terminal vía normal |
| `CLOSED → OPEN` (AttendanceSheet) | Reapertura no requisito |
| `ENDED → ACTIVE` (EventSeries/Competition/CompetitionEntry) | Sin transición inversa |
| `DELETED →` cualquier (Message) | Tombstone irreversible |
| `TEAM ↔ LINE` (CompetitionEntry) | Incompatibles (`COMPETITION_SCOPE_MISMATCH`) |

---

# 10. TRAZABILIDAD RESUMEN

| Métrica | Valor |
|---|---:|
| REQ funcionales con trazabilidad a máquinas | 67 / 122 |
| Transiciones permitidas con fuente (REQ/AC/UC) | 62 / 62 |
| Transiciones prohibidas documentadas | 65 |
| Estados canónicos con definición | 47 / 47 |
| CU `STATE_TRANSITION` | 42 |
| CU `STATE_GUARD_ONLY` | 28 |
| CU `STATE_READ_ONLY` | 12 |
| CU `NO_STATE_RELEVANCE` | 20 |

---

# 11. MANIFEST DRAW.IO

| Nivel | Formato | Cantidad | Autoridad |
|---|---|---|---|
| **1 — Fuente** | `.drawio` XML no comprimido | 17 | **AUTORITATIVO. Editable.** |
| 2 — Entrega | PDF | 17 | Derivado |
| 3 — Preview | PNG | 17 | Derivado |

**Validaciones:**
- ✅ XML bien formado (17/17)
- ✅ draw.io carga archivo (CLI exit 0) (17/17)
- ✅ draw.io exporta PNG (17/17)
- ✅ draw.io exporta PDF (17/17)
- ✅ IDs únicos, endpoints válidos, waypoints `<mxPoint>`
- ✅ QA visual real: **17/17 PASS**

---

# 12. DECISIONES ABIERTAS

| ID | Objeto | Pregunta | Impacto | Estado |
|---|---|---|---|---|
| `AUD-04` | Event | ¿Training/ClubEvent pueden ir a `ABANDONED`? PT §9 solo menciona Match | Menor | Documentado: asumido solo Match |
| `REQ-DECISION-NEEDED-01` | Structure | ¿Restore de Division/Line/Team en V1? | Bloqueante para restore | **DEFER** (no en V1) |
| `ACTOR-DECISION-01` | Eligibility | ¿Jugadora ve su `ELIGIBILITY STATUS`? | Visibilidad | Congelado en (a) `NONE` |

**Ninguna decisión bloqueante para E6.**

---

# 13. QUÉ ALIMENTA ESTE FREEZE

| Consumidor | Qué toma | Qué NO debe tomar |
|---|---|---|
| **E7 — Trazabilidad** | Index + Traceability ya emitidos | No re-derivar prioridad con otra regla |
| **Implementación / UX / IA (etapas 8–11)** | Fichas autosuficientes: autoridad, transiciones, guards, efectos | No tratar diagrama como diseño de UI; entry points son E10 |
| **Backend / BD** | Estados persistidos, transiciones, guards, invariantes | No inventar estados ni transiciones no documentadas |

---

# 14. GATE E6 — RESULTADO

| Criterio | Resultado |
|---|---|
| 100% objetos candidatos evaluados (29/29) | **PASS** |
| 0 máquinas inventadas | **PASS** |
| 0 estados sin evidencia | **PASS** |
| 0 transiciones sin evidencia | **PASS** |
| 0 persistidos/derivados confundidos | **PASS** |
| 0 vigencias temporales convertidas en enums | **PASS** |
| 0 transiciones inversas inventadas | **PASS** |
| 0 transiciones prohibidas dibujadas como permitidas | **PASS** |
| 0 lifecycle contradiciendo E5 | **PASS** |
| 0 guards críticos omitidos | **PASS** |
| 0 bloqueos funcionales sin resolver | **PASS** |
| 100% transiciones relevantes trazables | **PASS** |
| 100% XML Draw.io válidos y editables | **PASS** |
| 100% diagramas renderizados (CLI) | **PASS** |
| 100% PNG/PDF generados | **PASS** |
| 100% QA visual aprobado | **PASS** |
| 0 fallos de validación mecánica | **PASS** |
| Typecheck PASS | **PASS** |
| Tests PASS (92/92) | **PASS** |
| Build PASS | **PASS** |

```
E6-01  AUDITORÍA PREVIA OBLIGATORIA        PASS
E6-02  INVENTARIO DE OBJETOS CANDIDATOS    PASS
E6-03  CATÁLOGO CANÓNICO DE ESTADOS        PASS
E6-04  REGISTRO COMPLETO DE TRANSICIONES   PASS
E6-05  GENERACIÓN DRAW.IO                  PASS
E6-06  EXPORT + QA VISUAL                  PASS
E6-07  TRAZABILIDAD + MACHINE/SEMANTIC QA  PASS
E6-08  GATE + FREEZE                       PASS

STATE DIAGRAMS FREEZE V1:  FROZEN · PASS
```

---

# 15. ARTEFACTOS ENTREGADOS

| Artefacto | Ubicación | Autoridad |
|---|---|---|
| Audit Reconstruction | `docs/uml/states/GEI_STATE_RECONSTRUCTION_AUDIT_V1.md` | Proceso |
| Candidate Inventory | `docs/uml/states/GEI_STATE_CANDIDATE_INVENTORY_V1.md` | Auditoría |
| State Model Catalog | `docs/uml/states/GEI_STATE_MODEL_CATALOG_V1.md` | **Sí** |
| Transition Matrix | `docs/uml/states/GEI_STATE_TRANSITION_MATRIX_V1.md` | **Sí** |
| Traceability Matrix | `docs/uml/states/GEI_STATE_TRACEABILITY_MATRIX_V1.md` | **Sí** |
| Diagram Manifest | `docs/uml/states/GEI_STATE_DIAGRAM_MANIFEST_V1.md` | **Sí** |
| **State Diagrams Freeze** | `docs/uml/states/GEI_STATE_DIAGRAM_FREEZE_V1.md` | **Sí** |
| 17 Diagramas `.drawio` | `docs/uml/states/source/` | **Fuente autoritativa** |
| 17 PNG | `docs/uml/states/export/png/` | Derivado |
| 17 PDF | `docs/uml/states/export/pdf/` | Derivado |
| Generador | `scripts/state-diagrams/generate-state-diagrams.mjs` | Código |

---

# 16. SOURCE MODIFICATION POLICY

| Ruta | Modificado |
|---|---|
| `src/**` | **NO** |
| `docs/requirements/**` | **NO** |
| `docs/actors/**` | **NO** |
| `docs/use-cases/**` | **NO** |
| `docs/uml/use-cases/**` | **NO** |
| `docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` | **NO** |
| `docs/uml/states/**` | **SÍ** (nuevos archivos) |
| `scripts/state-diagrams/**` | **SÍ** (nuevos archivos) |
| `docs/project-control/GEI_Roadmap_Maestro_Proyecto.xlsx` | **SÍ** (actualizado E6=100%) |

---

# 17. GIT

```powershell
git add docs/uml/states/ scripts/state-diagrams/
git commit -m "docs(uml): freeze GEI state diagrams v1

- 17 state machines reconstructed from E1-E5 authorities
- 62 allowed transitions + 65 prohibited documented
- 17 Draw.io diagrams generated, validated, exported (PNG/PDF)
- Visual QA: 17/17 PASS
- Traceability matrix REQ→UC→State→Transition complete
- No src/** modifications
- E6 BASELINE_SHA = 01ee760388e27592d007c1c6f539e9204aefbf62"
```

```powershell
git push -u origin gei/e6-state-diagrams-freeze-v1
```

---

**Fin del State Diagrams Freeze V1.**

**Etapa 6 cerrada.**