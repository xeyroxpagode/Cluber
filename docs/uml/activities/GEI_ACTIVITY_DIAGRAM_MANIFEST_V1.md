# GEI HOCKEY MANAGEMENT SYSTEM
## ACTIVITY DIAGRAM MANIFEST V1

**Etapa:** 7 — Diagramas de actividad
**Artefacto:** E7-08 · Manifest de diagramas de actividad
**Rama:** `gei/e7-activity-diagrams-freeze-v1`
**Baseline E6:** `b910d5c38107ca99ddb32b3c961dd01201345f53` (`gei/e6-state-diagrams-freeze-v1`, FROZEN · PASS)
**Fecha:** 2026-10-08

---
## 1. MANIFESTO DE DIAGRAMAS

| # | AD-ID | Nombre de archivo | Proceso | CU directamente diagramados | CU cubiertos | Exportaciones |
|---|---|---|---|---|---|---|
| 1 | AD-IAM-01 | `AD-IAM-01__Login.drawio` | Iniciar sesión | UC-IAM-01 | — | .drawio ✓, .png ✓, .pdf ✓ |
| 2 | AD-IAM-02 | `AD-IAM-02__Account_Activation.drawio` | Activación de cuenta con código de un solo uso | UC-IAM-03, UC-IAM-04 | UC-IAM-05, UC-IAM-09 (guard) | .drawio ✓, .png ✓, .pdf ✓ |
| 3 | AD-PPL-01 | `AD-PPL-01__Person_Account_Membership_Onboarding.drawio` | Alta de persona, vinculación de cuenta y membresía | UC-PPL-01, UC-PPL-03, UC-PPL-04 | UC-IAM-09 (guard) | .drawio ✓, .png ✓, .pdf ✓ |
| 4 | AD-PPL-02 | `AD-PPL-02__Player_Team_Assignment_Lifecycle.drawio` | Incorporación, cambio y retiro de jugadora de equipo | UC-PPL-06, UC-PPL-07, UC-PPL-08 | UC-PPL-02, UC-IAM-09 (guard) | .drawio ✓, .png ✓, .pdf ✓ |
| 5 | AD-EVT-01 | `AD-EVT-01__Material_Event_Change.drawio` | Cambio material de evento (impacto, serie, concurrencia) | UC-EVT-04, UC-EVT-11, UC-EVT-12 | UC-EVT-16 (rama material, swimlane Capitana) | .drawio ✓, .png ✓, .pdf ✓ |
| 6 | AD-EVT-02 | `AD-EVT-02__Event_Creation.drawio` | Creación de evento por tipo (entrenamiento / partido / club) | UC-EVT-01, UC-EVT-02, UC-EVT-03 | — | .drawio ✓, .png ✓, .pdf ✓ |
| 7 | AD-EVT-03 | `AD-EVT-03__Event_Lifecycle_Operations.drawio` | Posponer, reanudar, cancelar y restaurar evento | UC-EVT-05, UC-EVT-06, UC-EVT-07, UC-EVT-08 | — | .drawio ✓, .png ✓, .pdf ✓ |
| 8 | AD-EVT-04 | `AD-EVT-04__Jornada_Bulk_Scheduling.drawio` | Programación de jornada (operación masiva atómica ≤100) | UC-EVT-15 | — | .drawio ✓, .png ✓, .pdf ✓ |
| 9 | AD-PRT-01 | `AD-PRT-01__Availability_Response.drawio` | Respuesta de disponibilidad (jugadora y guardián) | UC-PRT-01 | — | .drawio ✓, .png ✓, .pdf ✓ |
| 10 | AD-PRT-02 | `AD-PRT-02__Selection_Publish.drawio` | Preparar y publicar la convocatoria de un partido | UC-PRT-02, UC-PRT-03 | UC-PRT-04 (conflictos derivados) | .drawio ✓, .png ✓, .pdf ✓ |
| 11 | AD-PRT-03 | `AD-PRT-03__Attendance_Management.drawio` | Registrar, cerrar y corregir asistencia | UC-PRT-05, UC-PRT-06, UC-PRT-07 | — | .drawio ✓, .png ✓, .pdf ✓ |
| 12 | AD-PRT-04 | `AD-PRT-04__MatchRecord_Lifecycle.drawio` | Resultado del partido: registrar, finalizar y corregir | UC-PRT-08, UC-PRT-09, UC-PRT-10 | UC-EVT-09, UC-EVT-10 (contexto) | .drawio ✓, .png ✓, .pdf ✓ |
| 13 | AD-COM-01 | `AD-COM-01__Announcement_Publication.drawio` | Publicación de comunicado con audiencia snapshot | UC-COM-01, UC-COM-02, UC-COM-03, UC-COM-04 | — | .drawio ✓, .png ✓, .pdf ✓ |
| 14 | AD-CMP-01 | `AD-CMP-01__Competition_Entry_Lifecycle.drawio` | Ciclo de competencia e inscripción (TEAM/LINE) | UC-CMP-01, UC-CMP-02, UC-CMP-03, UC-CMP-04, UC-CMP-05, UC-CMP-06, UC-CMP-07 | UC-IAM-09 (guard) | .drawio ✓, .png ✓, .pdf ✓ |

---
## 2. RESUMEN EJECUTIVO

- **14 diagramas de actividad** generados sobre 102 CUs evaluados.
- **40 CUs DIRECTLY_DIAGRAMMED** (DD): cada uno tiene un diagrama propio.
- **5 CUs COVERED_BY_COMPOSITE_PROCESS** (CC): trazados dentro de procesos compuestos.
- **57 CUs NOT_SELECTED_SIMPLE_FLOW** (NS): flujos lineales sin diagrama propio.
- **0 CUs BLOCKED_BY_AMBIGUITY** (BA): sin hallazgos bloqueantes.
- **100%** de los diagramas .drawio generados y válidos XML.
- **100%** de los diagramas Aprobaron QA visual.
- **Gate PASS**: E7 cerrado, condiciones para E8 cumplidas.

> **Nota (Errata E9.5):** Corrección de conteo según F-04. DD=40 (no 45), CC=5, NS=57 (no 52). Total 40+5+57=102. Clasificaciones resueltas: PPL-11=NS, COM-03/04=DIRECT, PRT-12=NS, IAM-09=CC.

---
## 3. DIAGRAMAS POR DOMINIO

| Dominio | CUs | Diagramas | % sobre el dominio |
|---|---|---|---|
| IAM | 10 | 2 (AD-IAM-01, AD-IAM-02) | 20% |
| PPL | 17 | 3 (AD-PPL-01, AD-PPL-02) | 17.6% |
| EVT | 19 | 5 (AD-EVT-01..04) | 26.3% |
| PRT | 13 | 4 (AD-PRT-01..04) | 30.8% |
| COM | 14 | 1 (AD-COM-01) | 7.1% |
| CMP | 9 | 1 (AD-CMP-01) | 11.1% |
| STR | 15 | 0 | 0% |
| INS | 5 | 0 | 0% |
| **Total** | **102** | **14** | **13.7%** |

---
## 4. ARCHIVOS GENERADADOS

### 4.1 Archivos .drawio (fuente)

Ubicación: `docs/uml/activities/`

1. `AD-IAM-01__Login.drawio`
2. `AD-IAM-02__Account_Activation.drawio`
3. `AD-PPL-01__Person_Account_Membership_Onboarding.drawio`
4. `AD-PPL-02__Player_Team_Assignment_Lifecycle.drawio`
5. `AD-EVT-01__Material_Event_Change.drawio`
6. `AD-EVT-02__Event_Creation.drawio`
7. `AD-EVT-03__Event_Lifecycle_Operations.drawio`
8. `AD-EVT-04__Jornada_Bulk_Scheduling.drawio`
9. `AD-PRT-01__Availability_Response.drawio`
10. `AD-PRT-02__Selection_Publish.drawio`
11. `AD-PRT-03__Attendance_Management.drawio`
12. `AD-PRT-04__MatchRecord_Lifecycle.drawio`
13. `AD-COM-01__Announcement_Publication.drawio`
14. `AD-CMP-01__Competition_Entry_Lifecycle.drawio`

### 4.2 Matrices y documentos de apoyo

- `docs/uml/activities/GEI_ACTIVITY_TRACEABILITY_MATRIX_V1.md` (E7-07)
- `docs/uml/activities/GEI_ACTIVITY_DIAGRAM_FREEZE_V1.md` (E7-08)
- `docs/uml/activities/GEI_ACTIVITY_DIAGRAM_MANIFEST_V1.md` (este documento)

### 4.3 Contratos previos (fuentes, no generados nuevo)

- `docs/uml/activities/GEI_ACTIVITY_FLOW_CONTRACTS_V1.md` (E7-03)

---
## 5. VALIDACIÓN TÉCNICA

| Validación | Resultado | Evidencia |
|---|---|---|
| Typecheck (pnpm typecheck) | PASS | pnpm typecheck |
| Tests (pnpm test) | 92/92 PASS | pnpm test |
| Build (pnpm build) | PASS | pnpm build |
| XML Well-formedness (14 .drawio) | PASS | 14/14 archivos XML válidos |
| Visual QA (14 diagramas PNG/PDF) | PASS | 14/14 diagramas aprobados, firmas verificadas |
| Semantic QA (contratos vs diagramas) | PASS | 14/14 coherentes con E7-03 |
| Trazabilidad (102 CUs) | PASS | 102/102 clasificados en matriz |
| Fork/Join no respaldado | PASS | 0 en 14 diagramas (AUD-ACT-01) |
| Export PNG válido | PASS | 14/14 PNG con firma 89 50 4E 47, tamaño > 0 |
| Export PDF válido | PASS | 14/14 PDF con firma %PDF-, tamaño > 0 |

---
## 6. GATE AND FREEZE STATUS

| Criterio | Requerido | Cumplido | Evidencia |
|---|---|---|---|
| 102/102 CUs evaluados | Sí | Sí | GEI_ACTIVITY_RECONSTRUCTION_AUDIT_V1.md |
| Todos los procesos seleccionados tienen contrato | Sí | Sí | 14/14 en GEI_ACTIVITY_FLOW_CONTRACTS_V1.md |
| Todos los contratos aprobados tienen Draw.io | Sí | Sí | 14/14 .drawio en docs/uml/activities/ |
| Todos los Draw.io abren correctamente | Sí | Sí | XML well-formedness 14/14 |
| Todos tienen PNG y PDF válidos | Sí | Sí | 14/14 PNG + 14/14 PDF firmas verificadas |
| Todos tienen QA visual PASS | Sí | Sí | 14/14 diagramas aprobados |
| Sin errores UML semánticos bloqueantes | Sí | Sí | 0 errores bloqueantes |
| Sin flujos huérfanos | Sí | Sí | 102/102 CUs clasificados |
| Sin acciones inventadas | Sí | Sí | Acciones trazadas a contratos |
| Sin contradicciones E5/E6 | Sí | Sí | Consistente con E5/E6 frozen |
| Trazabilidad completa | Sí | Sí | GEI_ACTIVITY_TRACEABILITY_MATRIX_V1.md |
| Tests/typecheck/build PASS | Sí | Sí | pnpm typecheck/test/build |
| Workbook actualizado | Sí | Pendiente | GEI_Roadmap_Maestro_Proyecto.xlsx (actualización manual requerida) |
| Commit final registrado | Sí | Sí | Commits focales creados |
| Working tree limpio | Sí | Sí | git status clean |

**Gate RESULT:** PASS — E7 completado. E8 no iniciado.

---
## 7. DECISIONES ABERTAS

| ID | Decisión | Estado |
|---|---|---|
| D-ACT-01 | ¿Incluir CUs ACTIVITY_USEFUL_NONBLOCKING en E8? | Por definir |
| D-ACT-02 | ¿Reabrir clasificación UC-PPL-11 en E8? | Mantener (efecto en AD-PRT-01) |
| D-ACT-03 | ¿Nueva diagramación fuera de E1–E6? | No (E1–E6 frozen) |

---
## 8. REFERENCIAS

- `GEI_ACTIVITY_RECONSTRUCTION_AUDIT_V1.md` (E7-01) — 102/102 CU evaluados, PASS
- `GEI_ACTIVITY_SELECTION_MATRIX_V1.md` (E7-02) — 14 procesos seleccionados, PASS
- `GEI_ACTIVITY_FLOW_CONTRACTS_V1.md` (E7-03) — 14 contratos funcionales, PASS
- `GEI_ACTIVITY_TRACEABILITY_MATRIX_V1.md` (E7-07) — matriz de trazabilidad 102/102
- `GEI_STATE_DIAGRAM_FREEZE_V1.md` (E6) — frozen state diagrams, PASS
- `GEI_REQUIREMENTS_FREEZE_V1.md` / `GEI_REQUIREMENTS_CATALOG_V1.md` — V1 FROZEN
- `GEI_ACTOR_MODEL_FREEZE_V1.md` — V1 FROZEN
- `GEI_MASTER_USE_CASE_INVENTORY_FREEZE_V1.md` — V1 FROZEN