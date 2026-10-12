# GEI HOCKEY MANAGEMENT SYSTEM
## CLASS MODEL FREEZE V1

**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-12
**Etapa:** 8 — Modelo de clases completo · **Gate E8: PASS · 100%**
**Rama:** `gei/e8-complete-class-model-freeze-v1`
**Baseline documental (congelada con este freeze):**
`GEI_CLASS_CATALOG_V1.md` · `GEI_CLASS_ATTRIBUTES_V1.md` · `GEI_CLASS_OPERATION_MATRIX_V1.md` · `GEI_CLASS_RELATIONSHIP_MATRIX_V1.md` · `GEI_CLASS_TRACEABILITY_MATRIX_V1.md` · `GEI_CLASS_DIAGRAM_MANIFEST_V1.md` · `GEI_CLASS_MODEL_RECONSTRUCTION_AUDIT_V1.md` · `GEI_CLASS_VALIDATION_CHECKLIST_V1.md`

---

# 1. MODELO CANÓNICO FINAL (37 clases CL-01..CL-37)

| ID | Clase | Dominio | Vista propietaria |
|---|---|---|---|
| CL-01 | Person | PPL | ref en IAM/PPL/COM/INS (§3.2/§3.3) |
| CL-02 | Account | IAM | CL-IAM-01 |
| CL-03 | Membership | PPL | CL-IAM-01 |
| CL-04 | TeamAssignment | PPL | CL-PPL-01 |
| CL-05 | RoleAssignment | PPL | CL-PPL-01 |
| CL-06 | GuardianRelationship | PPL | CL-PPL-01 |
| CL-07 | Season | STR | CL-STR-01 |
| CL-08 | Division | STR | CL-STR-01 |
| CL-09 | Line | STR | CL-STR-01 |
| CL-10 | Team | STR | CL-STR-01 |
| CL-11 | Venue | STR | CL-STR-01 |
| CL-12 | Event | EVT | CL-EVT-01 |
| CL-13 | EventSeries | EVT | CL-EVT-01 |
| CL-14 | EventOccurrenceOverride | EVT | CL-EVT-01 |
| CL-15 | Jornada | EVT | CL-EVT-01 |
| CL-16 | EventLogistics | EVT | CL-EVT-01 |
| CL-17 | EventTargetTeam | EVT | CL-EVT-01 |
| CL-18 | EventTargetPerson | EVT | CL-EVT-01 |
| CL-19 | Availability | PRT | CL-PRT-01 |
| CL-20 | Selection | PRT | CL-PRT-01 |
| CL-21 | SelectionRevision | PRT | CL-PRT-01 |
| CL-22 | SelectionEntry | PRT | CL-PRT-01 |
| CL-23 | AttendanceSheet | PRT | CL-PRT-01 |
| CL-24 | AttendanceEntry | PRT | CL-PRT-01 |
| CL-25 | MatchRecord | PRT | CL-PRT-01 |
| CL-26 | PlayerMatchStats | PRT | CL-PRT-01 |
| CL-27 | EligibilityConstraint | PRT | CL-PRT-01 |
| CL-28 | Announcement | COM | CL-COM-01 |
| CL-29 | AnnouncementTargetTeam | COM | CL-COM-01 |
| CL-30 | Conversation | COM | CL-COM-01 |
| CL-31 | ConversationParticipant | COM | CL-COM-01 |
| CL-32 | Message | COM | CL-COM-01 |
| CL-33 | Notification | COM | CL-COM-01 |
| CL-34 | Competition | CMP | CL-CMP-01 |
| CL-35 | CompetitionEntry | CMP | CL-CMP-01 |
| CL-36 | ExternalReference | CMP | CL-CMP-01 |
| CL-37 | AuditEntry | INS | CL-INS-01 |

Atributos, tipos, operaciones y firmas: `GEI_CLASS_ATTRIBUTES_V1.md` + `GEI_CLASS_OPERATION_MATRIX_V1.md` (491 líneas de firma verificadas mecánicamente, 0 sin tipo).
Value Objects (Username, PasswordHash, SessionToken, ActivationCode, DirectPairKey, CoordinationRevision, …), enumeraciones (27) y services (History/Report/Search, EligibilityPolicy + policies, INFRA: CommandReceipt/OutboxEvent/credenciales): según catálogo y vistas (ver §3).

# 2. RELACIONES Y CARDINALIDADES

Matriz autoritativa: `GEI_CLASS_RELATIONSHIP_MATRIX_V1.md` (**R-01–R-58**). Los 61 edges de los 9 diagramas resuelven a `source`/`target` existentes (verificación ejecutada, 0 rotos); extremos numéricos conformes a la matriz (correcciones E8: R-01, R-06; re-apuntados COM a R-44–R-49 y R-42). Composición solo en R-19, R-20, R-23, R-29, R-32, R-35 (+ R-01/R-46 composition-like). Sin herencia UML en el dominio (CLASS-DECISION-01/05/06: discriminación por `type`/`scope`).

# 3. CORRESPONDENCIA CON E1–E7

La correspondencia vive en los artefactos congelados: `GEI_CLASS_TRACEABILITY_MATRIX_V1.md` (clases↔PT/REQs), `GEI_CLASS_MODEL_RECONSTRUCTION_AUDIT_V1.md` (§ PT/E6/E7 por candidato), y las cajas `Fuentes`/`Invariantes` de cada lámina (PT §, REQ-*, UC-*, SM-*: p. ej. SM-ACCOUNT-01, SM-EVENT-01, SM-SELECTIONREV-01, SM-MATCHRECORD-01, SM-ATTENDANCEENTRY-01, SM-ELIGIBILITY-01, SM-ANNOUNCEMENT-01, SM-CONVERSATION-GROUP-01, SM-MESSAGE-01, SM-COMPETITION-01, SM-COMPETITIONENTRY-01, SM-TEAM/DIVISION/LINE/VENUE-01). Sin contradicciones conocidas con E5/E6/E7.

# 4. NUEVE VISTAS DRAW.IO (fuentes autoritativas editables)

`docs/uml/classes/source/`: CL-00 (overview, 9 paquetes incl. INFRA, regla 2.1) + CL-IAM-01 + CL-PPL-01 + CL-STR-01 + CL-EVT-01 + CL-PRT-01 + CL-COM-01 + CL-CMP-01 + CL-INS-01. XML well-formed 9/9, IDs únicos, parents y edges válidos, waypoints válidos, estilo ortogonal explícito.

# 5. EXPORTACIONES

`docs/uml/classes/export/png/` (9) + `docs/uml/classes/export/pdf/` (9), generadas con draw.io MSIX 32.4.1.0 desde las fuentes finales; firmas y tamaños verificados por lectura de bytes (detalle: `evidence/E8_EXPORT_MANIFEST_V1.md`). Correspondencia 1:1.

# 6. VALIDACIÓN

- **Mecánica:** ver `GEI_CLASS_VALIDATION_CHECKLIST_V1.md` (0 duplicados, 0 parents/edges rotos, 0 waypoints inválidos, 0 atributos sin tipo sobre 491 líneas, 37/37 cobertura).
- **Semántica:** 37/37 clases, enums cerrados (EventType, RoleType 5 roles, ScopeType…), decisiones CLASS-DECISION-01..06, correcciones R-01/R-06 y rewiring COM.
- **Académica/visual:** QA 9/9 PASS sobre PNG finales (`evidence/E8_QA_VISUAL_REPORT_V1.md`).

# 7. DESVIACIONES ACEPTADAS (D1–D5)

D1 (multiplicidades en extremos solo PPL/STR/IAM/CMP; resto en compartimentos) · D2 (STR rel-event-venue termina en Team) · D3 (PRT rel-elig-person termina en Availability) · D4 (COM rel-conv-event re-apuntada a Event ref; sin relación Conversation→Message en la matriz) · D5 (Person solo como `<<ref>>`, por diseño §3.2/§3.3). Definiciones en `GEI_CLASS_VALIDATION_CHECKLIST_V1.md` §6. No hay decisiones funcionales pendientes: no se crea documento de open decisions.

# 8. GATE E8

| Criterio | Estado |
|---|---|
| Fuentes draw.io 9/9 válidas y cargables | PASS |
| Cobertura 37/37 | PASS |
| Exports PNG 9/9 + PDF 9/9 verificados | PASS |
| QA visual 9/9 | PASS |
| Validación mecánica/semántica | PASS (con D1–D5 aceptadas) |
| Workbook E8→100%, E9 no iniciado | PASS (esta etapa) |
| Regresión `typecheck/test/build` + `git diff --check` | PASS (esta etapa) |

**ETAPA 8 CERRADA · 100% · FROZEN · PASS. No iniciar E9 en este lote.**
