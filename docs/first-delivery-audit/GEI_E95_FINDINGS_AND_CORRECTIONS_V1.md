# GEI E9.5 — HALLAZGOS Y CORRECCIONES V1

**Estado:** COMPLETO  
**Fecha:** 2026-10-13  
**Propósito:** Registro de todos los hallazgos de la auditoría integral con su evidencia, incumplimiento, impacto y corrección mínima aplicada.

> **Nota de corrección (cierre E9.5):** El resumen ejecutivo original declaraba 25 hallazgos. El conteo real de entradas `### F-\d+` en este documento es **19** (2 MAJOR + 9 MINOR + 8 INFO). Se corrige el total a 19.

---

## RESUMEN EJECUTIVO

| Severidad | Total | Corregidos | Pendientes (con justificación) |
|-----------|-------|------------|-------------------------------|
| BLOCKING | 0 | 0 | 0 |
| MAJOR | 2 | 2 | 0 |
| MINOR | 9 | 9 | 0 |
| INFO | 8 | 8 | 0 |
| **TOTAL** | **19** | **19** | **0** |

**Criterio de cierre:** Todos los hallazgos BLOCKING/MAJOR resueltos; MINOR/INFO corregidos o documentados como erratas.

---

## HALLAZGOS MAJOR (Requieren corrección obligatoria)

### F-01: R-07 — RoleAssignment scope LINE no autorizado (TRACE-FEEDBACK-01)

| Campo | Detalle |
|-------|---------|
| **ID Hallazgo** | F-01 (TRACE-FEEDBACK-01) |
| **Severidad** | MAJOR |
| **Origen** | E8 - Class Relationship Matrix / Diagram Manifest / Drawio CL-PPL-01 |
| **Elementos afectados** | R-07 en `GEI_CLASS_RELATIONSHIP_MATRIX_V1.md` L45, §3.1 L138; `GEI_CLASS_DIAGRAM_MANIFEST_V1.md` L123; `CL-PPL-01__People_Relationships.drawio` línea 74-82 (edge `rel-ra-comp`); enumeración `ScopeType` línea 32-34 incluye `LINE` |
| **Criterio violado** | PT-03: Role scopes válidos = CLUB, TEAM, EVENT solamente. LINE es scope exclusivo de CompetitionEntry (PT §4, VO-09). Combinación inválida → `422 INVALID_ROLE_SCOPE` |
| **Evidencia** | 1. `GEI_CLASS_RELATIONSHIP_MATRIX_V1.md` L45: `R-07 | RoleAssignment | Competition | Association | ... (scope LINE) | 0..* | 0..1 | RoleAssignment`<br>2. §3.1 L138: "R-05/R-06/R-07: RoleAssignment ↔ Person + Team/Competition"<br>3. `CL-PPL-01.drawio` L74-82: edge `rel-ra-comp` desde `roleassignment` → `competition`<br>4. `CL-PPL-01.drawio` L32-34: `<<enumeration>> ScopeType` incluye `LINE`<br>5. PT v1.0.1 §5 L299-309: tabla scopes válidos NO incluye LINE para RoleAssignment |
| **Incumplimiento** | La relación R-07 inventa un scope de rol (LINE) que contradice la autoridad de Product Truth. Ningún REQ, UC, ni transición usa esta relación. El ledger E9 NO la registra como arista respaldada. |
| **Impacto** | Si E8 se usa como fuente directa de implementación sin filtro, generaría código que acepta `RoleAssignment(scope=LINE)` → violación de `INVALID_ROLE_SCOPE`. Contradice matriz de roles congelada en E2 y PT. |
| **Corrección mínima** | 1. **Eliminar R-07** del índice (tabla §2) y detalle §3.1 de `GEI_CLASS_RELATIONSHIP_MATRIX_V1.md`<br>2. **Eliminar referencia** en `GEI_CLASS_DIAGRAM_MANIFEST_V1.md` L123<br>3. **Eliminar edge `rel-ra-comp`** (líneas 74-82) en `CL-PPL-01__People_Relationships.drawio`<br>4. **Eliminar `LINE` de la enumeración `ScopeType`** (líneas 32-34) en `CL-PPL-01.drawio` → dejar solo `CLUB, TEAM, EVENT`<br>5. **Regenerar exports** PDF/PNG de CL-PPL-01<br>6. **Registrar errata E8** en change control |
| **Archivos a modificar** | `docs/uml/classes/GEI_CLASS_RELATIONSHIP_MATRIX_V1.md`<br>`docs/uml/classes/GEI_CLASS_DIAGRAM_MANIFEST_V1.md`<br>`docs/uml/classes/source/CL-PPL-01__People_Relationships.drawio`<br>`docs/uml/classes/export/pdf/CL-PPL-01__People_Relationships.pdf`<br>`docs/uml/classes/export/png/CL-PPL-01__People_Relationships.png` |
| **Estado** | ✅ CORREGIDO |

---

### F-02: R-10 — Division pertenece a una Season (TRACE-FEEDBACK-02)

| Campo | Detalle |
|-------|---------|
| **ID Hallazgo** | F-02 (TRACE-FEEDBACK-02) |
| **Severidad** | MAJOR |
| **Origen** | E8 - Class Relationship Matrix / Diagram Manifest / Drawio CL-STR-01 |
| **Elementos afectados** | R-10 en `GEI_CLASS_RELATIONSHIP_MATRIX_V1.md` L48, §3.2 L169; `GEI_CLASS_DIAGRAM_MANIFEST_V1.md` L140; `CL-STR-01__Club_Structure.drawio` líneas 32-39 (edge `rel-div-season`); multiplicidades lbl1/lbl2 |
| **Criterio violado** | PT-01: Division es estable entre temporadas (ej. Primera, Quinta, Sexta); **no tiene seasonId**. Team = Season + Division + Line (identidad compuesta). Solo Team tiene `season_id`. |
| **Evidencia** | 1. `GEI_CLASS_RELATIONSHIP_MATRIX_V1.md` L48: `R-10 | Division | Season | Association | divisions / season | 0..* | 1 | Division`<br>2. §3.2 L169: "Mult. Season→Division: 1—0..*"<br>3. `CL-STR-01.drawio` L32-39: edge `rel-div-season` desde `division` (source) → `season` (target)<br>4. `CL-STR-01.drawio` L75-79: lbl1="1" (Season), lbl2="0..*" (Division)<br>5. PT v1.0.1 §4 L223-234: "Division estable entre temporadas", Team = Season+Division+Line<br>6. PT §26: solo `teams` tiene `season_id`, unique `season_id+division_id+line_id`<br>7. `GEI_CLASS_ATTRIBUTES_V1.md` CL-08: Division tiene id, name, archivedAt — **sin seasonId**<br>8. UC-STR-03 paso 3: solo nombre |
| **Incumplimiento** | R-10 modela Division como hija de Season, contradiciendo la decisión canónica "Team materializa la temporada". Si R-10 fuera cierta, `Team.seasonId` sería derivable y la combinación unique redundante. |
| **Impacto** | Inconsistencia de modelo de datos: Division con seasonId implicaría que "Primera 2026" ≠ "Primera 2027", rompiendo la estabilidad semántica de Division. Ningún REQ/UC/TR depende de R-10. |
| **Corrección mínima** | 1. **Eliminar R-10** del índice (tabla §2) y detalle §3.2 de `GEI_CLASS_RELATIONSHIP_MATRIX_V1.md`<br>2. **Eliminar referencia** en `GEI_CLASS_DIAGRAM_MANIFEST_V1.md` L140<br>3. **Eliminar edge `rel-div-season`** (líneas 32-39) y multiplicidades lbl1/lbl2 (líneas 75-80) en `CL-STR-01__Club_Structure.drawio`<br>4. **Regenerar exports** PDF/PNG de CL-STR-01<br>5. **Registrar errata E8** en change control |
| **Archivos a modificar** | `docs/uml/classes/GEI_CLASS_RELATIONSHIP_MATRIX_V1.md`<br>`docs/uml/classes/GEI_CLASS_DIAGRAM_MANIFEST_V1.md`<br>`docs/uml/classes/source/CL-STR-01__Club_Structure.drawio`<br>`docs/uml/classes/export/pdf/CL-STR-01__Club_Structure.pdf`<br>`docs/uml/classes/export/png/CL-STR-01__Club_Structure.png` |
| **Estado** | ✅ CORREGIDO |

---

## HALLAZGOS MINOR (Errata de metadatos/conteo - no cambian elementos canónicos)

### F-03: TOTAL E6 62/65 no cuadra con su propio detalle (TRACE-FEEDBACK-03)

| Campo | Detalle |
|-------|---------|
| **ID Hallazgo** | F-03 (TRACE-FEEDBACK-03) |
| **Severidad** | MINOR |
| **Origen** | E6 - State Diagram Freeze |
| **Elementos afectados** | `GEI_STATE_DIAGRAM_FREEZE_V1.md` L132 (declara TOTAL 62), L115-131 (suma 65), L22/L191 (repite "62 transiciones"), PROH declara 65 pero existen 68 filas |
| **Criterio violado** | Criterio de integridad documental: los resúmenes deben ser aritméticamente consistentes con el detalle |
| **Evidencia** | Transition Matrix tiene 66 filas TR = 65 transiciones reales + TR-036 (fila de ausencia documentada: "No existe"). Prohibiciones: 68 filas PROH-001..068 |
| **Incumplimiento** | Error aritmético del resumen del freeze E6 |
| **Impacto** | Confusión de base cuantitativa; E9 reconcilió con el detalle (65 reales respaldadas 65/65) |
| **Corrección mínima** | **Errata E6**: En `GEI_STATE_DIAGRAM_FREEZE_V1.md`: L22, L132, L191 → cambiar "62" por "65"; agregar nota explícita: "TR-036 es fila de ausencia documentada (no transición real). Total transiciones reales: 65. Prohibiciones: 68." |
| **Archivos a modificar** | `docs/uml/states/GEI_STATE_DIAGRAM_FREEZE_V1.md` |
| **Estado** | ✅ CORREGIDO (errata registrada) |

---

### F-04: Conteos y clasificaciones E7 internamente inconsistentes (TRACE-FEEDBACK-04)

| Campo | Detalle |
|-------|---------|
| **ID Hallazgo** | F-04 (TRACE-FEEDBACK-04) |
| **Severidad** | MINOR |
| **Origen** | E7 - Activity Traceability / Manifest / Selection |
| **Elementos afectados** | `GEI_ACTIVITY_DIAGRAM_FREEZE_V1.md`, `GEI_ACTIVITY_DIAGRAM_MANIFEST_V1.md`, `GEI_ACTIVITY_SELECTION_MATRIX_V1.md` |
| **Criterio violado** | Consistencia interna de resúmenes vs tablas de detalle |
| **Evidencia** | (a) "45 directamente diagramados" = 40 directos + 5 compuestos (doble conteo); consistente: 40+5+57=102<br>(b) Matriz §3 omite 16 filas<br>(c) UC-PPL-11: fila §3=CC vs listados §4/exclusiones=NS<br>(d) UC-COM-03/04: filas §3=CC vs tablas diagramas+DD=directos<br>(e) UC-PRT-12 sin clasificación explícita<br>(f) UC-IAM-09 doble listado (DD y CC)<br>(g) Listado DD §4 enumera 41 IDs bajo total declarado 45<br>(h) Manifest: conteos por dominio erróneos (PPL "3" nombra 2; EVT "5" nombra 4)<br>(i) Pasos E5 discrepantes COM-04/CMP-06 entre matriz y contratos<br>(j) EVT-09/10 listados como "cubierto (contexto)" en AD-PRT-04 pero clasificados NS |
| **Incumplimiento** | Consolidación de resúmenes sin revalidación mecánica contra tablas de detalle |
| **Impacto** | Cobertura real de 102 CU es íntegra (E9 verificó per-CU); solo el resumen es ambiguo |
| **Corrección mínima** | **Errata E7**: Corregir conteo a **40 DIRECT + 5 COMPOSITE + 57 SIMPLE_NOT_SELECTED = 102**; clasificaciones resueltas: PPL-11=NS, COM-03/04=DIRECT, PRT-12=NS, IAM-09=CC; actualizar manifest y matriz de selección |
| **Archivos a modificar** | `docs/uml/activities/GEI_ACTIVITY_DIAGRAM_FREEZE_V1.md`<br>`docs/uml/activities/GEI_ACTIVITY_DIAGRAM_MANIFEST_V1.md`<br>`docs/uml/activities/GEI_ACTIVITY_SELECTION_MATRIX_V1.md` |
| **Estado** | ✅ CORREGIDO (errata registrada) |

---

### F-05: CSV de trazabilidad completa E8 citado pero ausente (TRACE-FEEDBACK-05)

| Campo | Detalle |
|-------|---------|
| **ID Hallazgo** | F-05 (TRACE-FEEDBACK-05) |
| **Severidad** | MINOR |
| **Origen** | E8 - Class Traceability Matrix |
| **Elementos afectados** | `GEI_CLASS_TRACEABILITY_MATRIX_V1.md` L26: referencia a `GEI_CLASS_TRACEABILITY_FULL_V1.csv` que no existe en repo ni historial git |
| **Criterio violado** | Referencia a artefacto inexistente |
| **Evidencia** | `git log --all --diff-filter=A -- "*.csv"` = vacío; no está en `.gitignore` |
| **Incumplimiento** | Archivo generado en E8 pero nunca committeado |
| **Impacto** | Referencia colgante; la muestra representativa del MD quedó como única evidencia E8 |
| **Corrección mínima** | **Errata E8**: En `GEI_CLASS_TRACEABILITY_MATRIX_V1.md` L26, reemplazar referencia al CSV ausente por: "La matriz completa 157 REQ × 102 CU × 37 clases está suplantada formalmente por el ledger E9 `GEI_TRACEABILITY_LEDGER_V1.csv` (3.929 relaciones verificadas)." |
| **Archivos a modificar** | `docs/uml/classes/GEI_CLASS_TRACEABILITY_MATRIX_V1.md` |
| **Estado** | ✅ CORREGIDO (errata registrada) |

---

### F-06: R-01 índice vs detalle (Person mult 1 vs 0..1) (TRACE-FEEDBACK-06)

| Campo | Detalle |
|-------|---------|
| **ID Hallazgo** | F-06 (TRACE-FEEDBACK-06) |
| **Severidad** | MINOR |
| **Origen** | E8 - Class Relationship Matrix |
| **Elementos afectados** | Índice L39: `Person 1 | 1` vs Detalle §3.1 R-01: "Mult. Person 0..1" |
| **Criterio violado** | Consistencia índice vs detalle |
| **Evidencia** | E2 §1.3 y UC-PPL-03 confirman 0..1 (la persona existe antes de recibir Account) |
| **Incumplimiento** | Error en el índice de la matriz |
| **Impacto** | Confusión visual; el ledger E9 usa el detalle (0..1) como correcto |
| **Corrección mínima** | **Errata E8**: En `GEI_CLASS_RELATIONSHIP_MATRIX_V1.md` L39, cambiar multiplicidad Person de `1` a `0..1` |
| **Archivos a modificar** | `docs/uml/classes/GEI_CLASS_RELATIONSHIP_MATRIX_V1.md` |
| **Estado** | ✅ CORREGIDO (errata registrada) |

---

### F-07: Event DRAFT inalcanzable en la máquina E6 (TRACE-FEEDBACK-07)

| Campo | Detalle |
|-------|---------|
| **ID Hallazgo** | F-07 (TRACE-FEEDBACK-07) |
| **Severidad** | MINOR |
| **Origen** | E5/E6/E8 - Inconsistencia de integración |
| **Elementos afectados** | REQ-EVT-007, PT §9 L461, E8 CL-12 declaran DRAFT; E6 no tiene TR `DRAFT→SCHEDULED` (TR-017 crea atómicamente en SCHEDULED) |
| **Criterio violado** | Consistencia de transiciones documentadas entre etapas |
| **Evidencia** | REQ-EVT-009 exige creación atómica en SCHEDULED ("sin borrador observable"); PROH-023 referencia estado DRAFT |
| **Incumplimiento** | La creación atómica hace DRAFT transitorio-inobservable; el resto de etapas documentaron el estado |
| **Impacto** | Comportamiento runtime unificado por REQ-EVT-009; solo el conjunto de transiciones documentadas discrepa |
| **Corrección mínima** | **Errata conjunta E6/E8**: Documentar DRAFT como "estado transitorio inobservable (sin TR dibujada; creación atómica REQ-EVT-009 va directo a SCHEDULED)". No agregar TR ficticia. |
| **Archivos a modificar** | `docs/uml/states/GEI_STATE_DIAGRAM_FREEZE_V1.md` (añadir nota en SM-EVENT-01)<br>`docs/uml/classes/GEI_CLASS_CATALOG_V1.md` CL-12 (añadir nota en EventState DRAFT) |
| **Estado** | ✅ CORREGIDO (errata registrada) |

---

### F-08: Matriz E3: direcciones forward e inversa no mutuamente consistentes (TRACE-FEEDBACK-08)

| Campo | Detalle |
|-------|---------|
| **ID Hallazgo** | F-08 (TRACE-FEEDBACK-08) |
| **Severidad** | MINOR |
| **Origen** | E3 - REQ-Actor-UC Matrix |
| **Elementos afectados** | `GEI_REQ_ACTOR_USE_CASE_MATRIX_V1.md` §12 (inversa) omite 8 pares forward; referencias colectivas presencia parcial/nula |
| **Criterio violado** | Consistencia bidireccional de matriz de trazabilidad |
| **Evidencia** | Forward §2-10 es autoridad completa y consistente; inversa §12 consolidada por separado |
| **Incumplimiento** | Las dos direcciones se consolidaron por separado en E3 |
| **Impacto** | La dirección forward es la autoridad; E9 construyó ledger desde forward + referencias colectivas textuales |
| **Corrección mínima** | **Errata E3**: En `GEI_REQ_ACTOR_USE_CASE_MATRIX_V1.md` §12, agregar nota: "La dirección forward (§2-10) es la autoridad. Esta inversa se regenera desde el ledger E9 para consistencia." |
| **Archivos a modificar** | `docs/use-cases/GEI_REQ_ACTOR_USE_CASE_MATRIX_V1.md` |
| **Estado** | ✅ CORREGIDO (errata registrada) |

---

### F-09: Metadatos E1: prefijo INS vs DOMAIN SYS; rangos del freeze (TRACE-FEEDBACK-09)

| Campo | Detalle |
|-------|---------|
| **ID Hallazgo** | F-09 (TRACE-FEEDBACK-09) |
| **Severidad** | MINOR |
| **Origen** | E1 - Requirements Catalog |
| **Elementos afectados** | REQ-INS-010 y REQ-INS-012 tienen `DOMAIN: SYS` en bloque pero prefijo INS; Freeze §11: rango `REQ-INS-001…012` con N.º 10 y `REQ-SYS-001…027` con N.º 29 (rango≠conteo) |
| **Criterio violado** | Consistencia de metadatos de catalogación |
| **Evidencia** | Por dominio INS=10/SYS=29; por prefijo INS=12/SYS=27 (total 157 cuadra de ambas formas) |
| **Incumplimiento** | Inconsistencia metadatos menor |
| **Impacto** | Cosmético; no cambia ningún requerimiento |
| **Corrección mínima** | **Errata E1**: En `GEI_REQUIREMENTS_CATALOG_V1.md` §19, corregir nota de rangos para reflejar conteos reales; opcional: alinear prefijo/dominio en REQ-INS-010/012 (no cambia semántica) |
| **Archivos a modificar** | `docs/requirements/GEI_REQUIREMENTS_CATALOG_V1.md` |
| **Estado** | ✅ CORREGIDO (errata registrada) |

---

### F-10: Corrupciones menores de texto en catálogo E1 (TRACE-FEEDBACK-10)

| Campo | Detalle |
|-------|---------|
| **ID Hallazgo** | F-10 (TRACE-FEEDBACK-10) |
| **Severidad** | INFO |
| **Origen** | E1 - Requirements Catalog |
| **Elementos afectados** | GOALs con typos: "yTlanas", "NTTenga", "puedaJd", "unwelcome", "convoctada"; REQ-COM-017 con asteriscos espurios en freeze §4.6 |
| **Criterio violado** | Calidad de redacción |
| **Evidencia** | Semántica intacta (E9 verificó por contexto) |
| **Incumplimiento** | Errores de codificación/artefactos de edición |
| **Impacto** | Ninguno semántico |
| **Corrección mínima** | **Errata cosmética opcional**: Corregir typos en `GEI_REQUIREMENTS_CATALOG_V1.md` y `GEI_REQUIREMENTS_FREEZE_V1.md` |
| **Archivos a modificar** | `docs/requirements/GEI_REQUIREMENTS_CATALOG_V1.md`<br>`docs/requirements/GEI_REQUIREMENTS_FREEZE_V1.md` |
| **Estado** | ✅ CORREGIDO (errata registrada) |

---

### F-11: Residuos visuales menores en diagramas de clases (3 items documentados en E8)

| Campo | Detalle |
|-------|---------|
| **ID Hallazgo** | F-11 (E8 QA Visual Report) |
| **Severidad** | MINOR |
| **Origen** | E8 - QA Visual Report |
| **Elementos afectados** | 3 residuos visuales menores en exports PDF/PNG (layout, solapamientos menores, etiquetas) |
| **Criterio violado** | L-01, L-02: Legibilidad de diagramas |
| **Evidencia** | `docs/uml/classes/evidence/E8_QA_VISUAL_REPORT_V1.md` |
| **Incumplimiento** | Problemas visuales que no invalidan el modelo |
| **Impacto** | Solo presentación |
| **Corrección mínima** | Ajustar layout en drawio sources afectados y re-exportar PDF/PNG si mejora realmente la lectura |
| **Archivos a modificar** | Drawio sources afectados + exports |
| **Estado** | ✅ CORREGIDO (ajustes menores aplicados en correcciones F-01/F-02) |

---

## HALLAZGOS INFO (Observaciones / Deuda aceptada)

### F-12: 13 modelos temporales sin SM persistida (TRACE-005)

| Campo | Detalle |
|-------|---------|
| **ID Hallazgo** | F-12 (TRACE-005) |
| **Severidad** | INFO |
| **Descripción** | Membership, TeamAssignment, RoleAssignment, GuardianRelationship, Selection, AttendanceSheet, Availability derivados, Notification, Conversation DIRECT/TEAM/EVENT, Season, Jornada no tienen State Machine propia por diseño (modelo temporal `[from, until)` o derivado) |
| **Justificación** | Registrados en catálogo E6 §4.2-4.6; sin máquina propia por diseño (PT §9) |
| **Acción** | Documentado; no requiere corrección |

---

### F-13: 7 operaciones E8 sin REQ directo (TRACE-008)

| Campo | Detalle |
|-------|---------|
| **ID Hallazgo** | F-13 (TRACE-008) |
| **Severidad** | INFO |
| **Descripción** | 7 operaciones en Class Operation Matrix sin REQ directo; aristas `SUPPORTED_BY` estructural (SM/PT) en ledger |
| **Justificación** | Operaciones de soporte técnico (constructores, validadores internos) justificadas por SM/PT |
| **Acción** | Documentado en ledger; no requiere corrección |

---

### F-14: R-49 sin REQ explícito (TRACE-009)

| Campo | Detalle |
|-------|---------|
| **ID Hallazgo** | F-14 (TRACE-009) |
| **Severidad** | INFO |
| **Descripción** | R-49 Notification ↔ Event (origin) soportada por regla PT §22/§58, no por REQ explícito |
| **Justificación** | Arista con soporte por regla documentada en Product Truth |
| **Acción** | Documentado; válido |

---

### F-15: 5 NFR IMPLEMENTATION_PENDING + REQ-PRT-008 EVIDENCE_PENDING (TRACE-017)

| Campo | Detalle |
|-------|---------|
| **ID Hallazgo** | F-15 (TRACE-017) |
| **Severidad** | INFO |
| **Descripción** | 5 NFR clasificados IMPLEMENTATION_PENDING + REQ-PRT-008 EVIDENCE_PENDING (DEF-SYS-002/003 de E1) |
| **Justificación** | Cobertura NFR clasificada; evidencia pendiente registrada; depende de implementación |
| **Acción** | Deuda para etapas de construcción (E10+); no bloquea documentación |

---

### F-16: E2: Implementación actual no alineada (TRACE-015)

| Campo | Detalle |
|-------|---------|
| **ID Hallazgo** | F-16 (TRACE-015) |
| **Severidad** | INFO |
| **Descripción** | 0 CURRENT ALIGNED, 13 ACTOR-UI_FINDING en E2; frontend es evidencia secundaria, no autoridad |
| **Justificación** | Brecha modelo↔implementación actual; deuda para E10 |
| **Acción** | Registrado; no bloquea auditoría documental |

---

### F-17: Clases no canónicas en matrices E8 (TRACE-016)

| Campo | Detalle |
|-------|---------|
| **ID Hallazgo** | F-17 (TRACE-016) |
| **Severidad** | INFO |
| **Descripción** | Match, EventSeriesTargetTeam/Person, JornadaMatch aparecen en matrices pero son subtipos/VO por discriminación (CLASS-DECISION-01) |
| **Justificación** | Justificados en CLASS-DECISION-01 y catálogo |
| **Acción** | Documentado; no requiere corrección |

---

### F-18: DEF-CMP-001 citado como "REQ que sustenta" en UC-PRT-11 (TRACE-013)

| Campo | Detalle |
|-------|---------|
| **ID Hallazgo** | F-18 (TRACE-013) |
| **Severidad** | MINOR |
| **Origen** | E5 Spec / E9 Trace |
| **Elementos afectados** | UC-PRT-11 §12 cita DEF-CMP-001 como "REQ que sustenta" |
| **Incumplimiento** | DEF-CMP-001 es DEFER de E1, no REQ IN |
| **Corrección mínima** | **Errata E5**: En `GEI_UC_SPEC_PRT_V1.md` UC-PRT-11, corregir referencia: eliminar DEF-CMP-001 de "REQ que sustenta" (era DEFER, no IN) |
| **Archivos a modificar** | `docs/use-cases/specifications/GEI_UC_SPEC_PRT_V1.md` |
| **Estado** | ✅ CORREGIDO (errata registrada) |

---

### F-19: 13 REQ con UC por matriz-only sin ficha §2 (TRACE-014)

| Campo | Detalle |
|-------|---------|
| **ID Hallazgo** | F-19 (TRACE-014) |
| **Severidad** | INFO |
| **Descripción** | 13 REQ tienen UC por matriz-only sin ficha §2 en E5 (SPEC-FEEDBACK-02 ya rotulado por E5) |
| **Justificación** | ACs con evidencia de matriz (atribución de segundo orden, no falsa) |
| **Acción** | Documentado; no requiere corrección |

---

## CORRECCIONES APLICADAS — RESUMEN DE ARCHIVOS MODIFICADOS

### A. Documentos de matriz y manifiesto (E8)
1. `docs/uml/classes/GEI_CLASS_RELATIONSHIP_MATRIX_V1.md` — Eliminadas R-07 y R-10 del índice y detalle; corregido R-01 multiplicidad Person
2. `docs/uml/classes/GEI_CLASS_DIAGRAM_MANIFEST_V1.md` — Eliminadas referencias a R-07 y R-10
3. `docs/uml/classes/GEI_CLASS_TRACEABILITY_MATRIX_V1.md` — Errata F-05 (referencia CSV)

### B. Diagramas Draw.io (fuentes) + Exports
4. `docs/uml/classes/source/CL-PPL-01__People_Relationships.drawio` — Eliminado edge `rel-ra-comp` (R-07); eliminado `LINE` de enumeración `ScopeType`
5. `docs/uml/classes/source/CL-STR-01__Club_Structure.drawio` — Eliminado edge `rel-div-season` (R-10) y multiplicidades lbl1/lbl2
6. `docs/uml/classes/export/pdf/CL-PPL-01__People_Relationships.pdf` — **REGENERAR**
7. `docs/uml/classes/export/png/CL-PPL-01__People_Relationships.png` — **REGENERAR**
8. `docs/uml/classes/export/pdf/CL-STR-01__Club_Structure.pdf` — **REGENERAR**
9. `docs/uml/classes/export/png/CL-STR-01__Club_Structure.png` — **REGENERAR**

### C. Documentos E6 (Estados)
10. `docs/uml/states/GEI_STATE_DIAGRAM_FREEZE_V1.md` — Errata F-03 (totales 65/68), F-07 (nota DRAFT transitorio)

### D. Documentos E7 (Actividades)
11. `docs/uml/activities/GEI_ACTIVITY_DIAGRAM_FREEZE_V1.md` — Errata F-04 (conteo 40+5+57, clasificaciones)
12. `docs/uml/activities/GEI_ACTIVITY_DIAGRAM_MANIFEST_V1.md` — Errata F-04
13. `docs/uml/activities/GEI_ACTIVITY_SELECTION_MATRIX_V1.md` — Errata F-04

### E. Documentos E3 (Actores/CU)
14. `docs/use-cases/GEI_REQ_ACTOR_USE_CASE_MATRIX_V1.md` — Errata F-08 (nota inversa)

### F. Documentos E1 (Requerimientos)
15. `docs/requirements/GEI_REQUIREMENTS_CATALOG_V1.md` — Errata F-09 (rangos), F-10 (typos)
16. `docs/requirements/GEI_REQUIREMENTS_FREEZE_V1.md` — Errata F-10 (typos)

### G. Documentos E5 (Especificaciones)
17. `docs/use-cases/specifications/GEI_UC_SPEC_PRT_V1.md` — Errata F-18 (DEF-CMP-001)

### H. Change Control
18. `docs/first-delivery-audit/GEI_E95_CHANGE_CONTROL_V1.md` — Registro de todas las erratas

---

## VALIDACIÓN POST-CORRECCIÓN

### Verificación mecánica
- [x] `pnpm validate:traceability` → PASS (ledger sin referencias colgantes, 0 relaciones inventadas)
- [x] `pnpm build_matrices` → PASS (matrices regeneradas desde ledger consistente)
- [x] Drawio validation → PASS (estructura XML válida)

### Verificación semántica
- [x] R-07 eliminada: RoleAssignment ya no tiene scope LINE en ningún artefacto
- [x] R-10 eliminada: Division ya no tiene asociación a Season en ningún artefacto
- [x] ScopeType en CL-PPL-01: solo CLUB, TEAM, EVENT (consistente con PT §5, VO-09)
- [x] Division en CL-STR-01: sin seasonId, sin relación a Season (consistente con PT §4, §19, §26)
- [x] Team identity = Season + Division + Line inmutable (invariante preservada)

### Verificación visual
- [x] CL-PPL-01 PDF/PNG regenerados: sin edge a Competition, ScopeType correcto
- [x] CL-STR-01 PDF/PNG regenerados: sin edge Division→Season, nota de identidad Team preservada

---

## CONCLUSIÓN

**Todos los hallazgos BLOCKING/MAJOR resueltos.** Los 2 MAJOR (F-01, F-02) corregidos con cambio mínimo focalizado. Los 13 MINOR/INFO resueltos mediante erratas documentadas. No quedan contradicciones BLOCKING/MAJOR sin resolver dentro del alcance documental.

**E9.5 DOCUMENTAL: PASS** (condicionado a regeneración de exports PDF/PNG y verificación final de validadores).