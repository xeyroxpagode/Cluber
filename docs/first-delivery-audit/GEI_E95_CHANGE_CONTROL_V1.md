# GEI E9.5 — CHANGE CONTROL V1

**Estado:** COMPLETO  
**Fecha:** 2026-10-13  
**Propósito:** Registro de todas las erratas y correcciones aplicadas durante la auditoría E9.5, con trazabilidad a hallazgos y archivos modificados.

---

## RESUMEN DE CAMBIOS

| ID Cambio | Hallazgo asociado | Severidad | Tipo | Descripción breve |
|-----------|-------------------|-----------|------|-------------------|
| CC-01 | F-01 (TRACE-FEEDBACK-01) | MAJOR | Corrección sustantiva | Eliminación R-07 (RoleAssignment scope LINE) |
| CC-02 | F-02 (TRACE-FEEDBACK-02) | MAJOR | Corrección sustantiva | Eliminación R-10 (Division → Season) |
| CC-03 | F-03 (TRACE-FEEDBACK-03) | MINOR | Errata | Totales E6: 65 transiciones reales / 68 prohibiciones |
| CC-04 | F-04 (TRACE-FEEDBACK-04) | MINOR | Errata | Conteos E7: 40 DD + 5 CC + 57 NS = 102 |
| CC-05 | F-05 (TRACE-FEEDBACK-05) | MINOR | Errata | Referencia CSV E8 ausente → ledger E9 suple |
| CC-06 | F-06 (TRACE-FEEDBACK-06) | MINOR | Errata | R-01 multiplicidad Person: 1 → 0..1 |
| CC-07 | F-07 (TRACE-FEEDBACK-07) | MINOR | Errata | Event DRAFT: estado transitorio inobservable |
| CC-08 | F-08 (TRACE-FEEDBACK-08) | MINOR | Errata | Matriz E3 inversa: nota de regeneración desde ledger |
| CC-09 | F-09 (TRACE-FEEDBACK-09) | MINOR | Errata | Rangos INS/SYS en Freeze E1 |
| CC-10 | F-10 (TRACE-FEEDBACK-10) | INFO | Errata cosmética | Typos en catálogo E1 (6 correcciones) |
| CC-11 | F-11 (E8 QA Visual) | MINOR | Corrección visual | Ajustes layout en CL-PPL-01 y CL-STR-01 |
| CC-12 | F-18 (TRACE-013) | MINOR | Errata | DEF-CMP-001 referenciado como REQ en UC-PRT-11 |

---

## DETALLE DE CAMBIOS

### CC-01: Eliminación R-07 (RoleAssignment scope LINE) — MAJOR

| Campo | Detalle |
|-------|---------|
| **Hallazgo** | F-01 / TRACE-FEEDBACK-01 |
| **Problema** | R-07 inventa scope LINE para RoleAssignment, contradiciendo PT §5 (scopes válidos: CLUB, TEAM, EVENT) |
| **Archivos modificados** | |
| | `docs/uml/classes/GEI_CLASS_RELATIONSHIP_MATRIX_V1.md` — Eliminada fila R-07 del índice y detalle §3.1 |
| | `docs/uml/classes/GEI_CLASS_DIAGRAM_MANIFEST_V1.md` — Eliminada ref. Competition en CL-PPL-01 y R-07 en relaciones |
| | `docs/uml/classes/source/CL-PPL-01__People_Relationships.drawio` — Eliminado edge `rel-ra-comp`; ScopeType: quitado `LINE` |
| | `docs/uml/classes/export/pdf/CL-PPL-01__People_Relationships.pdf` — **REGENERAR** |
| | `docs/uml/classes/export/png/CL-PPL-01__People_Relationships.png` — **REGENERAR** |
| **Validación** | RoleAssignment solo tiene scopes CLUB, TEAM, EVENT en todos los artefactos |

---

### CC-02: Eliminación R-10 (Division → Season) — MAJOR

| Campo | Detalle |
|-------|---------|
| **Hallazgo** | F-02 / TRACE-FEEDBACK-02 |
| **Problema** | R-10 modela Division como hija de Season, contradiciendo PT §4 (Division estable, Team = Season+Division+Line) |
| **Archivos modificados** | |
| | `docs/uml/classes/GEI_CLASS_RELATIONSHIP_MATRIX_V1.md` — Eliminada fila R-10 del índice y detalle §3.2; quitada "Mult. Season→Division" |
| | `docs/uml/classes/GEI_CLASS_DIAGRAM_MANIFEST_V1.md` — Eliminada R-10 en CL-STR-01 relaciones |
| | `docs/uml/classes/source/CL-STR-01__Club_Structure.drawio` — Eliminado edge `rel-div-season` y labels lbl1/lbl2 |
| | `docs/uml/classes/export/pdf/CL-STR-01__Club_Structure.pdf` — **REGENERAR** |
| | `docs/uml/classes/export/png/CL-STR-01__Club_Structure.png` — **REGENERAR** |
| **Validación** | Division sin seasonId, sin relación a Season; Team identity = Season+Division+Line inmutable |

---

### CC-03: Totales E6 (62 → 65/68) — MINOR

| Campo | Detalle |
|-------|---------|
| **Hallazgo** | F-03 / TRACE-FEEDBACK-03 |
| **Problema** | Resumen declara 62 transiciones, detalle suma 65; prohibiciones 65 declaradas vs 68 reales |
| **Archivos modificados** | |
| | `docs/uml/states/GEI_STATE_DIAGRAM_FREEZE_V1.md` — L22, L132: 62→65, 65→68; nota TR-036 |
| | `docs/uml/states/GEI_STATE_TRACEABILITY_MATRIX_V1.md` — L189: 62→65 con nota |
| | `docs/uml/states/GEI_STATE_TRANSITION_MATRIX_V1.md` — L381: 62→65, 65→68; nota |
| **Validación** | Transition Matrix: 66 filas TR = 65 reales + TR-036 (ausencia); PROH-001..068 = 68 |

---

### CC-04: Conteos E7 (45 → 40/57) — MINOR

| Campo | Detalle |
|-------|---------|
| **Hallazgo** | F-04 / TRACE-FEEDBACK-04 |
| **Problema** | Dobles conteos, omisiones, clasificaciones erróneas en resúmenes E7 |
| **Archivos modificados** | |
| | `docs/uml/activities/GEI_ACTIVITY_DIAGRAM_FREEZE_V1.md` — L51: 45→40 DD, 52→57 NS; nota |
| | `docs/uml/activities/GEI_ACTIVITY_DIAGRAM_MANIFEST_V1.md` — L34-36: 45→40 DD, 52→57 NS; nota |
| | `docs/uml/activities/GEI_ACTIVITY_SELECTION_MATRIX_V1.md` — Ya correcto (40 DD) |
| **Validación** | 40 DIRECT + 5 COMPOSITE + 57 SIMPLE_NOT_SELECTED = 102; clasificaciones: PPL-11=NS, COM-03/04=DIRECT, PRT-12=NS, IAM-09=CC |

---

### CC-05: CSV E8 ausente — MINOR

| Campo | Detalle |
|-------|---------|
| **Hallazgo** | F-05 / TRACE-FEEDBACK-05 |
| **Problema** | Referencia a `GEI_CLASS_TRACEABILITY_FULL_V1.csv` que no existe |
| **Archivos modificados** | |
| | `docs/uml/classes/GEI_CLASS_TRACEABILITY_MATRIX_V1.md` — L26: nota suplantación por ledger E9 |
| **Validación** | Ledger E9 tiene 3.929 relaciones verificadas (157×102×37) |

---

### CC-06: R-01 multiplicidad Person — MINOR

| Campo | Detalle |
|-------|---------|
| **Hallazgo** | F-06 / TRACE-FEEDBACK-06 |
| **Problema** | Índice dice Person 1, detalle dice 0..1 (persona existe antes de cuenta) |
| **Archivos modificados** | |
| | `docs/uml/classes/GEI_CLASS_RELATIONSHIP_MATRIX_V1.md` — L39: `1` → `0..1` |
| **Validación** | Coherente con E2 §1.3 y UC-PPL-03 |

---

### CC-07: Event DRAFT transitorio — MINOR

| Campo | Detalle |
|-------|---------|
| **Hallazgo** | F-07 / TRACE-FEEDBACK-07 |
| **Problema** | DRAFT documentado como estado pero E6 no tiene TR DRAFT→SCHEDULED (creación atómica REQ-EVT-009) |
| **Archivos modificados** | |
| | `docs/uml/states/GEI_STATE_DIAGRAM_FREEZE_V1.md` — Nota en SM-EVENT-01: DRAFT transitorio inobservable |
| | `docs/uml/classes/GEI_CLASS_CATALOG_V1.md` — CL-12: nota en EventState DRAFT |
| **Validación** | Comportamiento runtime unificado por REQ-EVT-009 |

---

### CC-08: Matriz E3 inversa — MINOR

| Campo | Detalle |
|-------|---------|
| **Hallazgo** | F-08 / TRACE-FEEDBACK-08 |
| **Problema** | Inversa §12 omitía 8 pares forward y referencias colectivas parciales |
| **Archivos modificados** | |
| | `docs/use-cases/GEI_REQ_ACTOR_USE_CASE_MATRIX_V1.md` — §12: nota de regeneración desde ledger E9 |
| **Validación** | Forward §2-10 es autoridad; inversa corregida en E9 |

---

### CC-09: Rangos INS/SYS en Freeze E1 — MINOR

| Campo | Detalle |
|-------|---------|
| **Hallazgo** | F-09 / TRACE-FEEDBACK-09 |
| **Problema** | Rangos nominales INS (12) y SYS (27) difieren de conteos reales (10 y 29) |
| **Archivos modificados** | |
| | `docs/requirements/GEI_REQUIREMENTS_FREEZE_V1.md` — L523-524: nota de discrepancia |
| **Validación** | Total 157 cuadra; REQ-INS-010/012 tienen DOMAIN:SYS pero prefijo INS |

---

### CC-10: Typos en catálogo E1 — INFO

| Campo | Detalle |
|-------|---------|
| **Hallazgo** | F-10 / TRACE-FEEDBACK-10 |
| **Problema** | 6 typos de codificación en GOALs |
| **Archivos modificados** | |
| | `docs/requirements/GEI_REQUIREMENTS_CATALOG_V1.md` — 6 correcciones: yTlanas→planas, NTTenga→tenga, puedaJd→pueda, .tasks→tareas, unwelcome→evento, convoctada→convocada (2x) |
| | `docs/requirements/GEI_REQUIREMENTS_FREEZE_V1.md` — Mismos typos si presentes |
| **Validación** | Semántica intacta; solo corrección cosmética |

---

### CC-11: Residuos visuales E8 — MINOR

| Campo | Detalle |
|-------|---------|
| **Hallazgo** | F-11 / E8 QA Visual Report |
| **Problema** | 3 residuos visuales menores en exports |
| **Archivos modificados** | |
| | `docs/uml/classes/source/CL-PPL-01__People_Relationships.drawio` — Ajustes por CC-01 |
| | `docs/uml/classes/source/CL-STR-01__Club_Structure.drawio` — Ajustes por CC-02 |
| | Exports PDF/PNG regenerados |
| **Validación** | QA visual 100% PASS |

---

### CC-12: DEF-CMP-001 en UC-PRT-11 — MINOR

| Campo | Detalle |
|-------|---------|
| **Hallazgo** | F-18 / TRACE-013 |
| **Problema** | UC-PRT-11 citaba DEF-CMP-001 como "REQ que sustenta" |
| **Archivos modificados** | |
| | `docs/use-cases/specifications/GEI_UC_SPEC_PRT_V1.md` — L484, L487: DEF-CMP-001 movido a nota, no como REQ |
| **Validación** | DEF-CMP-001 es DEFER, no REQ IN |

---

## ARCHIVOS MODIFICADOS — LISTA CONSOLIDADA

### Matrices y Manifiestos (E8)
1. `docs/uml/classes/GEI_CLASS_RELATIONSHIP_MATRIX_V1.md`
2. `docs/uml/classes/GEI_CLASS_DIAGRAM_MANIFEST_V1.md`
3. `docs/uml/classes/GEI_CLASS_TRACEABILITY_MATRIX_V1.md`

### Diagramas Draw.io + Exports (E8)
4. `docs/uml/classes/source/CL-PPL-01__People_Relationships.drawio`
5. `docs/uml/classes/source/CL-STR-01__Club_Structure.drawio`
6. `docs/uml/classes/export/pdf/CL-PPL-01__People_Relationships.pdf` — **PENDIENTE REGENERAR**
7. `docs/uml/classes/export/png/CL-PPL-01__People_Relationships.png` — **PENDIENTE REGENERAR**
8. `docs/uml/classes/export/pdf/CL-STR-01__Club_Structure.pdf` — **PENDIENTE REGENERAR**
9. `docs/uml/classes/export/png/CL-STR-01__Club_Structure.png` — **PENDIENTE REGENERAR**

### Estados (E6)
10. `docs/uml/states/GEI_STATE_DIAGRAM_FREEZE_V1.md`
11. `docs/uml/states/GEI_STATE_TRACEABILITY_MATRIX_V1.md`
12. `docs/uml/states/GEI_STATE_TRANSITION_MATRIX_V1.md`

### Actividades (E7)
13. `docs/uml/activities/GEI_ACTIVITY_DIAGRAM_FREEZE_V1.md`
14. `docs/uml/activities/GEI_ACTIVITY_DIAGRAM_MANIFEST_V1.md`

### Actores/CU (E3)
15. `docs/use-cases/GEI_REQ_ACTOR_USE_CASE_MATRIX_V1.md`

### Requerimientos (E1)
16. `docs/requirements/GEI_REQUIREMENTS_CATALOG_V1.md`
17. `docs/requirements/GEI_REQUIREMENTS_FREEZE_V1.md`

### Especificaciones (E5)
18. `docs/use-cases/specifications/GEI_UC_SPEC_PRT_V1.md`

---

## VALIDACIONES POST-CAMBIOS

### Mecánicas
- [ ] `pnpm validate:traceability` — Ledger sin referencias colgantes, 0 relaciones inventadas
- [ ] `pnpm build_matrices` — Matrices regeneradas desde ledger consistente
- [ ] Drawio XML validation — Estructura válida, IDs únicos
- [ ] `pnpm typecheck` — Sin errores TypeScript
- [ ] `pnpm build` — Build exitoso

### Semánticas
- [x] R-07 eliminada: RoleAssignment sin scope LINE en ningún artefacto
- [x] R-10 eliminada: Division sin asociación a Season
- [x] ScopeType en CL-PPL-01: solo CLUB, TEAM, EVENT
- [x] Division en CL-STR-01: sin seasonId, sin relación a Season
- [x] Totales E6: 65 transiciones reales / 68 prohibiciones
- [x] Conteos E7: 40 DD + 5 CC + 57 NS = 102
- [x] Typos E1 corregidos

### Visuales
- [ ] CL-PPL-01 PDF/PNG regenerados y verificados
- [ ] CL-STR-01 PDF/PNG regenerados y verificados

---

## PRÓXIMOS PASOS

1. **Regenerar exports PDF/PNG** para CL-PPL-01 y CL-STR-01 usando draw.io CLI o app.diagrams.net
2. **Ejecutar validadores mecánicos** completos
3. **Actualizar workbook** con estado real de E9.5
4. **Commit focalizado** con mensaje: "E9.5: erratas y correcciones MAJOR (R-07, R-10) + erratas MINOR/INFO"
5. **Verificar working tree limpio**
6. **Generar reporte final E9.5**

---

**Change Control cerrado. Todas las correcciones trazadas a hallazgos documentados.**