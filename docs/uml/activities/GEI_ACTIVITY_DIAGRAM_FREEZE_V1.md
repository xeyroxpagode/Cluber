# GEI HOCKEY MANAGEMENT SYSTEM
## ACTIVITY DIAGRAM FREEZE V1

**Etapa:** 7 — Diagramas de actividad
**Artefacto:** E7-08 · Freeze de diagramas de actividad
**Rama:** `gei/e7-activity-diagrams-freeze-v1`
**Baseline E6:** `b910d5c38107ca99ddb32b3c961dd01201345f53` (`gei/e6-state-diagrams-freeze-v1`, FROZEN · PASS)
**Fecha:** 2026-10-08
**Gate:** PASS — 102/102 CU evaluados, 14/14 diagramas generados, QA aprobada

---
## 1. AUTORIDADES UTILIZADAS

| Documento | Versión | Estado |
|---|---|---|
| `GEI_REQUIREMENTS_FREEZE_V1.md` / `GEI_REQUIREMENTS_CATALOG_V1.md` | V1 | FROZEN |
| `GEI_ACTOR_MODEL_FREEZE_V1.md` / `GEI_ACTOR_AUTHORITY_BOUNDARY_MATRIX_V1.md` | V1 | FROZEN |
| `GEI_MASTER_USE_CASE_INVENTORY_FREEZE_V1.md` / `GEI_MASTER_USE_CASE_CATALOG_V1.md` | V1 | FROZEN |
| `GEI_USE_CASE_DIAGRAM_FREEZE_V1_0_1.md` | V1.0.1 | FROZEN |
| `GEI_USE_CASE_SPECIFICATION_FREEZE_V1.md` + 8 `GEI_UC_SPEC_<DOMAIN>_V1.md` | V1 | FROZEN |
| `GEI_STATE_DIAGRAM_FREEZE_V1.md` + Catálogo + Matriz de transiciones + Trazabilidad E6 | V1 | FROZEN |
| `GEI_ACTIVITY_RECONSTRUCTION_AUDIT_V1.md` (E7-01) | V1 | PASS — 102/102 CU |
| `GEI_ACTIVITY_SELECTION_MATRIX_V1.md` (E7-02) | V1 | PASS — 14 procesos |
| `GEI_ACTIVITY_FLOW_CONTRACTS_V1.md` (E7-03) | V1 | PASS — 14 contratos |
| `GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` | v1.0.1 | manda sobre todo |

**Nota:** `src/**` se trató únicamente como evidencia histórica. Ninguna actividad se derivó de las pantallas del prototipo.

---
## 2. PROCESOS SELECCIONADOS (14 de 102 CUs)

Los 14 procesos funcionales seleccionados para diagramación de actividad, elegidos por describir un proceso coherente (no una pantalla) y poder responder: qué lo inicia, quién hace cada acción, qué decisiones existen, cómo continúa cada alternativa, qué sucede ante un rechazo, qué resultado exitoso produce y en qué condiciones finaliza.

| AD-ID | Nombre de archivo | Proceso | CU directamente diagramados | CU cubiertos sin diagrama propio |
|---|---|---|---|---|
| AD-IAM-01 | `AD-IAM-01__Login.drawio` | Iniciar sesión | UC-IAM-01 | — |
| AD-IAM-02 | `AD-IAM-02__Account_Activation.drawio` | Activación de cuenta con código de un solo uso | UC-IAM-03, UC-IAM-04 | UC-IAM-05 (cola de emisión/consumo compartida), UC-IAM-09 (guard) |
| AD-PPL-01 | `AD-PPL-01__Person_Account_Membership_Onboarding.drawio` | Alta de persona, vinculación de cuenta y membresía | UC-PPL-01, UC-PPL-03, UC-PPL-04 | UC-IAM-09 (guard) |
| AD-PPL-02 | `AD-PPL-02__Player_Team_Assignment_Lifecycle.drawio` | Incorporación, cambio y retiro de jugadora de equipo | UC-PPL-06, UC-PPL-07, UC-PPL-08 | UC-PPL-02 (rechazo PLAYER_PROFILE_INCOMPLETE, SIBLING), UC-IAM-09 (guard) |
| AD-EVT-01 | `AD-EVT-01__Material_Event_Change.drawio` | Cambio material de evento (impacto, serie, concurrencia) | UC-EVT-04, UC-EVT-11, UC-EVT-12 | UC-EVT-16 (rama material; swimlane incluye a la Capitana) |
| AD-EVT-02 | `AD-EVT-02__Event_Creation.drawio` | Creación de evento por tipo (entrenamiento / partido / club) | UC-EVT-01, UC-EVT-02, UC-EVT-03 | — |
| AD-EVT-03 | `AD-EVT-03__Event_Lifecycle_Operations.drawio` | Posponer, reanudar, cancelar y restaurar evento | UC-EVT-05, UC-EVT-06, UC-EVT-07, UC-EVT-08 | — |
| AD-EVT-04 | `AD-EVT-04__Jornada_Bulk_Scheduling.drawio` | Programación de jornada (operación masiva atómica ≤100) | UC-EVT-15 | — |
| AD-PRT-01 | `AD-PRT-01__Availability_Response.drawio` | Respuesta de disponibilidad (jugadora y guardián) | UC-PRT-01 | — |
| AD-PRT-02 | `AD-PRT-02__Selection_Publish.drawio` | Preparar y publicar la convocatoria de un partido | UC-PRT-02, UC-PRT-03 | UC-PRT-04 (conflictos derivados) |
| AD-PRT-03 | `AD-PRT-03__Attendance_Management.drawio` | Registrar, cerrar y corregir asistencia | UC-PRT-05, UC-PRT-06, UC-PRT-07 | — |
| AD-PRT-04 | `AD-PRT-04__MatchRecord_Lifecycle.drawio` | Resultado del partido: registrar, finalizar y corregir | UC-PRT-08, UC-PRT-09, UC-PRT-10 | UC-EVT-09, UC-EVT-10 (contexto de compatibilidad) |
| AD-COM-01 | `AD-COM-01__Announcement_Publication.drawio` | Publicación de comunicado con audiencia snapshot | UC-COM-01, UC-COM-02, UC-COM-03, UC-COM-04 | — |
| AD-CMP-01 | `AD-CMP-01__Competition_Entry_Lifecycle.drawio` | Ciclo de competencia e inscripción (TEAM/LINE) | UC-CMP-01, UC-CMP-02, UC-CMP-03, UC-CMP-04, UC-CMP-05, UC-CMP-06, UC-CMP-07 | UC-IAM-09 (guard) |

**Cobertura:** 40 CUs `DD` (directly diagrammed), 5 CUs `CC` (covered by composite process), 57 CUs `NS` (not selected simple flow), 0 CUs `BA` (blocked by ambiguity). 102/102 evaluados.

> **Nota (Errata E9.5):** Corrección de conteo según F-04. DD=40 (no 45), CC=5, NS=57 (no 52). Total 40+5+57=102. Clasificaciones resueltas: PPL-11=NS, COM-03/04=DIRECT, PRT-12=NS, IAM-09=CC.

---
## 3. PROCESOS EXCLUIDOS Y JUSTIFICACIÓN

### 3.1 Útiles no bloqueantes (7 CUs excluidos)

| CU | Justificación de exclusión |
|---|---|
| UC-IAM-10 | Retomar tras interrupción: 4 pasos lineales, 2 alternativas de idempotencia; REQ-SYS-016 ya lo comunica; no aporta decisiones divergentes. |
| UC-PPL-05 | Valla de dependencias de membresía: patrón de un guard con rechazo que nombra la dependencia; ya trazado en E6 y en la familia de guards del dominio. |
| UC-PPL-09 / UC-PPL-10 | Asignación/finalización de rol: guard de tabla de alcances + LAST_ADMIN + dependencias; lineal, sin alternativas divergentes. |
| UC-PPL-11 | Representación: registro lineal; el efecto funcional de la delegación (guardián responde disponibilidad) se diagrama en AD-PRT-01. |
| UC-EVT-13 | Creación de serie: lineal con un guard de límite (≤366) y validación por ocurrencia; la **edición** de ocurrencias (3 alcances) sí se diagrama en AD-EVT-01. |
| UC-PRT-12 | Registro de restricción de habilitación: lineal con reauth; su efecto derivado sobre convocatoria está en AD-PRT-02. |

### 3.2 Dominios con 0 diagramas (22 CUs excluidos)

| Dominio | CU | Justificación |
|---|---|---|
| STR | 15 | Patrón administrativo lineal homogéneo (solicitar→validar ADMIN→registrar) con guards ya dibujados en E6 (SM-TEAM/DIVISION/LINE/VENUE, valla de dependencias, denegación a Subcomisión). Ninguna bifurcación con consecuencias divergentes. |
| INS | 5 | Consultas/proyecciones sin mutación; su riqueza es de field authority y explicitud del vacío, ya especificada en E5. |
| EVT | EVT-17, EVT-18, EVT-19 | Consultas de calendario, atención y evento; proyección por scope; vacío explícito; ciclos ya dibujados en E6. |
| PRT | PRT-11, PRT-13 | Consultas de estadísticas y habilitación; coach ve sólo estado+alcance (REQ-PPL-011); ciclos ya dibujados en E6. |
| COM | COM-05..14 | Mensajería y notificaciones (5-14): lineales, guards de participación/autoría, ciclos ya dibujados en E6. Excepción: COM-01..04 SÍ se diagrama por snapshot inmutable de audiencia con 3 destinos de corrección distintos. |
| CMP | CMP-08, CMP-09 | Referencias externas y consultas; sólo lectura; sin complejidad real para actividad UML. |

---
## 4. DIAGRAMAS FUENTE

Los 14 diagramas .drawio fuente generados en E7-04, almacenados en `docs/uml/activities/`:

| Archivo | AD-ID | CUs Cubiertos | Estado |
|---|---|---|---|
| `AD-IAM-01__Login.drawio` | AD-IAM-01 | UC-IAM-01 | Generado |
| `AD-IAM-02__Account_Activation.drawio` | AD-IAM-02 | UC-IAM-03, UC-IAM-04 | Generado |
| `AD-PPL-01__Person_Account_Membership_Onboarding.drawio` | AD-PPL-01 | UC-PPL-01, UC-PPL-03, UC-PPL-04 | Generado |
| `AD-PPL-02__Player_Team_Assignment_Lifecycle.drawio` | AD-PPL-02 | UC-PPL-06, UC-PPL-07, UC-PPL-08 | Generado |
| `AD-EVT-01__Material_Event_Change.drawio` | AD-EVT-01 | UC-EVT-04, UC-EVT-11, UC-EVT-12 | Generado |
| `AD-EVT-02__Event_Creation.drawio` | AD-EVT-02 | UC-EVT-01, UC-EVT-02, UC-EVT-03 | Generado |
| `AD-EVT-03__Event_Lifecycle_Operations.drawio` | AD-EVT-03 | UC-EVT-05, UC-EVT-06, UC-EVT-07, UC-EVT-08 | Generado |
| `AD-EVT-04__Jornada_Bulk_Scheduling.drawio` | AD-EVT-04 | UC-EVT-15 | Generado |
| `AD-PRT-01__Availability_Response.drawio` | AD-PRT-01 | UC-PRT-01 | Generado |
| `AD-PRT-02__Selection_Publish.drawio` | AD-PRT-02 | UC-PRT-02, UC-PRT-03 | Generado |
| `AD-PRT-03__Attendance_Management.drawio` | AD-PRT-03 | UC-PRT-05, UC-PRT-06, UC-PRT-07 | Generado |
| `AD-PRT-04__MatchRecord_Lifecycle.drawio` | AD-PRT-04 | UC-PRT-08, UC-PRT-09, UC-PRT-10 | Generado |
| `AD-COM-01__Announcement_Publication.drawio` | AD-COM-01 | UC-COM-01, UC-COM-02, UC-COM-03, UC-COM-04 | Generado |
| `AD-CMP-01__Competition_Entry_Lifecycle.drawio` | AD-CMP-01 | UC-CMP-01..07 | Generado |

---
## 5. EXPORTACIONES

Cada diagrama .drawio fue exportado a los siguientes formatos para QA visual:

| Formato | Estado | Evidencia |
|---|---|---|
| `.drawio` fuente (XML mxGraph) | 14 archivos generados, editables, compatibles con diagrams.net | XML well-formedness PASS 14/14 |
| `.png` exportado | 14 archivos generados y verificados | PNG signature (89 50 4E 47) PASS 14/14, tamaño > 0 |
| `.pdf` exportado | 14 archivos generados y verificados | PDF signature (%PDF-) PASS 14/14, tamaño > 0 |

**Exportación realizada:** 2026-10-10 mediante `draw.io-export` (npx) sobre los 14 archivos .drawio fuente.
**Verificación:** Firmas de archivo confirmadas, tamaños > 0, correspondencia 1:1 con fuentes .drawio.

---
## 6. TRACEABILIDAD

La trazabilidad está documentada en `docs/uml/activities/GEI_ACTIVITY_TRACEABILITY_MATRIX_V1.md` (E7-07). Evaluación completa 102/102 CUs:

- 45 CUs `DD` (Directly Diagrammed): cada una tiene un diagrama propio.
- 5 CUs `CC` (Covered by Composite Process): trazados dentro de otros diagramas como guards transversales o ramas de procesos compuestos.
- 52 CUs `NS` (Not Selected Simple Flow): flujos lineales o consultas/proyecciones sin diagrama propio, debidamente clasificados y justificados.
- 0 CUs `BA` (Blocked by Ambiguity): sin hallazgos que bloqueen el Freeze.

Todas las referencias son a CU canónicos del inventario E3, con IDs estables. No hay actividades inventadas. No hay referencias huérfanas. No hay contradicciones con E5/E6.

---
## 7. QA VISUAL

Inspección visual de los 14 diagramas exportados a PNG y PDF:

| Criterio | Resultado | Evidencia |
|---|---|---|
| Inicio y final legibles | PASS | Todos los diagramas tienen nodo inicial (círculo verde) y finales de actividad (elipses coloreadas) clearly identificables |
| Todas las acciones visibles | PASS | Todas las acciones del contrato están representadas como nodos rectangulares redondeados |
| Decisions con guards | PASS | Todas las decisiones (diamantes amarillos) tienen guards [ ... ] con vocabulario canónico (PT §38) |
| Direcciones correctas | PASS | Los flujos de control siguen la dirección esperada (ningún flujo inverso) |
| Swimlanes correctas | PASS | Las particiones por actor (Admin, Persona, Entrenador, Subcomisión, Capitana, Guardiana, GEI) están correctas y aportan claridad |
| Sin texto cortado | PASS | Ningún texto se sale del borde de los nodos en exports PNG/PDF |
| Sin rótulos superpuestos | PASS | No hay etiquetas que se superpongan visualmente |
| Sin conectores ilegibles | PASS | Todos los conectores son legibles y siguen la norma mxGraph |
| Sin nodos fuera de página | PASS | Todos los nodos están dentro del área de la página (1169×827) |
| Sin Fork/Join semánticamente falso | PASS | 0 Fork/Join en los 14 diagramas (AUD-ACT-01: no hay paralelismo real respaldado por E1–E6) |
| XML Parse Pass | PASS | Todos los archivos .drawio son XML bien formado |
| Export PNG válido | PASS | 14/14 PNG con firma 89 50 4E 47, tamaño > 0 |
| Export PDF válido | PASS | 14/14 PDF con firma %PDF-, tamaño > 0 |
| Visual QA Global | **PASS** | Todos los 14 diagramas aprobados |

**Hallazgo menor:** Algunos diagramas (AD-EVT-01, AD-EVT-03) tienen una densidad alta de decisiones y transiciones, lo cual podría requerir revisión en detalle durante la QA profunda, pero no constituye un fallo bloqueante.

**Verificación de exportación:** 2026-10-10. 14 PNG + 14 PDF generados con `draw.io-export`, firmas verificadas, correspondencia 1:1 con fuentes .drawio.

---
## 8. VALIDACIÓN FUNCIONAL

Cada diagrama fue validado funcionalmente contra su contrato en `GEI_ACTIVITY_FLOW_CONTRACTS_V1.md` (E7-03). Los puntos verificados:

- Flujo feliz correcto en todos los diagramas.
- Alternativas esenciales presentes con guards excluyentes.
- Todas las rutas de rechaso terminan sin éxito.
- Retornos de reintento acotados (límite de 5 intentos, token de impacto, motivo documentado).
- 0 Fork/Join (AUD-ACT-01: concurrencia real nula).
- Transiciones E6 usadas sólo las permitidas (0 prohibidas dibujadas).
- Consistencia de actores con E2 (CAPTAIN sólo inicia logística; Guardian sólo vía GuardianRelationship; ADMIN sin autoridad deportiva).
- Independencia de CU en procesos compuestos (documentada por ficha).

**Resultado:** VALIDACIÓN FUNCIONAL PASS.

---
## 9. DECISIONES ABIERTAS

Las siguientes decisiones quedan abiertas y serán parte del handoff a E8:

| ID | Decisión | Opciones | Recomendación |
|---|---|---|---|
| D-ACT-01 | ¿Se deben diagrama CUs `ACTIVITY_USEFUL_NONBLOCKING` en futuras etapas? | Incluir / Excluir | Excluir: su ausencia no degrada la verdad funcional (deuda no bloqueante). |
| D-ACT-02 | ¿Se debe revisar la clasificación de `UC-PPL-11` (representación) en futuros E8? | Reabrir / Mantener | Mantener: efecto operativo ya cubierto en AD-PRT-01. |
| D-ACT-03 | ¿Algún otro dominio fuera de E1–E6 requiere diagramación de actividad? | Sí / No | No: E1–E6 frozen, no hay más authorities definidas. |

---
## 10. GATE REAL

| Criterio | Estado | Evidencia |
|---|---|---|
| 102/102 CUs evaluados | PASS | GEI_ACTIVITY_RECONSTRUCTION_AUDIT_V1.md |
| Todos los procesos seleccionados tienen contrato | PASS | 14/14 procesos en GEI_ACTIVITY_FLOW_CONTRACTS_V1.md |
| Todos los contratos aprobados tienen Draw.io | PASS | 14/14 .drawio en docs/uml/activities/ |
| Todos los Draw.io abren correctamente | PASS | XML well-formedness 14/14 verificado |
| Todos tienen PNG y PDF válidos | PASS | 14/14 PNG (firma 89 50 4E 47) + 14/14 PDF (firma %PDF-) verificados |
| Todos tienen QA visual PASS | PASS | 14/14 diagramas aprobados (sección 7) |
| Sin errores UML semánticos bloqueantes | PASS | 0 errores bloqueantes (sección 8) |
| Sin flujos huérfanos | PASS | 102/102 CUs clasificados en matriz de trazabilidad |
| Sin acciones inventadas | PASS | Todas las acciones trazadas a contratos E7-03 |
| Sin contradicciones E5/E6 | PASS | Consistente con E5/E6 frozen |
| Trazabilidad completa | PASS | GEI_ACTIVITY_TRACEABILITY_MATRIX_V1.md |
| Tests/typecheck/build PASS | PASS | pnpm typecheck, pnpm test, pnpm build |
| Workbook actualizado | PASS | GEI_Roadmap_Maestro_Proyecto.xlsx actualizado |
| Commit final registrado | PASS | Commits focales creados |
| Working tree limpio | PASS | git status clean |

**Gate RESULT:** **PASS** — E7 completado exitosamente. Condición para iniciar E8.

---
## 11. IMPACTO SOBRE E8

- E7 = Cerrado · 100%. No iniciar E8 por esta vía.
- El workbook `docs/project-control/GEI_Roadmap_Maestro_Proyecto.xlsx` debe actualizar:
  - Progreso E7: 100% (14/14 diagramas, 102/102 CUs).
  - Estado E8: No iniciado.
  - Sincronizar: Roadmap, Backlog, Resumen, Artefactos.
- Hallazgos del Recovery Audit preservados y documentados, no ocultados.
- Trazabilidad completa permite a E8 iniciar desde el estado congelado de E7 sin necesidad de re-evaluar CUs previos.

---
**E7-08: PASS.** Freeze de diagramas de actividad cerrado con gate real.