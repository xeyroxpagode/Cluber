# GEI — Traceability Anomaly Register V1

> **Etapa:** E9-04 · **Estado:** FROZEN con E9 · **Modo:** auditoría (los defectos de autoridades congeladas NO se corrigieron en E9; se registran para Change Control).
> Severidades: `CRITICAL` · `MAJOR` · `MINOR` · `INFO`. Ningún hallazgo es bloqueante para el gate E9.

## Resumen ejecutivo

| Severidad | Cantidad | Bloqueantes |
|---|---:|---:|
| CRITICAL | 0 | 0 |
| MAJOR | 2 (TRACE-FEEDBACK-01, TRACE-FEEDBACK-02) | 0 |
| MINOR | 8 | 0 |
| INFO | 7 | 0 |

Los 2 MAJOR son defectos de la matriz de relaciones E8 (R-07 y R-10) detectados por el stress de integración E9 (§17). Ningún REQ funcional, CU, especificación o transición depende de ellos; la cadena `REQ → CU → CLASS` es íntegra para los 157 REQ.

---

## A. TRACE-FEEDBACK — defectos en autoridades congeladas (Change Control)

### TRACE-FEEDBACK-01 · R-07 scope LINE no autorizado — MAJOR, no bloqueante
- **Etapa origen:** E8 (Class Relationship Matrix / Diagram Manifest).
- **Elementos:** R-07 `RoleAssignment 0..* — 0..1 Competition (scope LINE)`.
- **Evidencia:** `docs/uml/classes/GEI_CLASS_RELATIONSHIP_MATRIX_V1.md` L45 y §3.1 (L138); `GEI_CLASS_DIAGRAM_MANIFEST_V1.md` L123. Contradice: PT §5 "Role scopes válidos" (`docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` L299–309: PLAYER/CAPTAIN=TEAM, COACH=TEAM/EVENT, SUBCOMMITTEE/ADMIN=CLUB; "cualquier combinación distinta: 422 INVALID_ROLE_SCOPE"); E2 §2.1/§2.3 (LINE y COMPETITION no son scopes de actor); E8 `GEI_CLASS_CATALOG_V1.md` CL-05 ("scope CLUB/TEAM/EVENT") y VO-09 ("LINE solo para CompetitionEntry").
- **Causa:** invención de un scope de rol no autorizado al materializar la matriz de relaciones.
- **Impacto:** la relación es huérfana (ningún REQ/UC/TR la usa) pero contradice la matriz de roles congelada; riesgo si E8 se usa como fuente directa de implementación sin filtro.
- **Recomendación:** eliminar R-07 del índice, §3.1 y manifest, o reformularla con scope válido (TEAM/EVENT/CLUB). El ledger E9 **no** la registra como arista `GOVERNS_RELATIONSHIP` respaldada por PT §5 (los REQ-PPL-006/009/010 citados en la fila justifican RoleAssignment, no el scope LINE).
- **Bloquea E9:** No.

### TRACE-FEEDBACK-02 · R-10 Division pertenece a una Season — MAJOR, no bloqueante
- **Etapa origen:** E8 (Class Relationship Matrix / Diagram Manifest).
- **Elementos:** R-10 `Division 0..* — 1 Season`.
- **Evidencia:** `GEI_CLASS_RELATIONSHIP_MATRIX_V1.md` L48, §3.2 (L169: "Mult. Season→Division: 1—0..*"), `GEI_CLASS_DIAGRAM_MANIFEST_V1.md` L140. Contradice: PT §4 (L223–234: Division estable entre temporadas —"Primera, Quinta, Sexta"—; Team es la entidad concreta de temporada `Season + Division + Line`); PT §26 (solo `teams` tiene `season_id`, unique `season_id+division_id+line_id`); E8 `GEI_CLASS_ATTRIBUTES_V1.md` CL-08 (Division: id, name, archivedAt — **sin seasonId**); Operation Matrix `Division(name)` L135; E5 UC-STR-03 paso 3 (sólo nombre); REQ-STR-002.
- **Causa:** modelado de jerarquía de identidad inconsistente con la decisión canónica "Team materializa la temporada".
- **Impacto:** si R-10 fuera cierta, `Team.seasonId` sería derivable y la combinación unique quedaría redundante; además ninguna TR de Team valida `division.season == team.season`. Ningún REQ/UC/TR depende de R-10.
- **Recomendación:** eliminar la asociación Division→Season del índice/§3.2/manifest (Division es estable; la temporalidad vive en Team).
- **Bloquea E9:** No.

### TRACE-FEEDBACK-03 · TOTAL E6 62/65 no cuadra con su propio detalle — MINOR
- **Etapa origen:** E6 (State Diagram Freeze).
- **Evidencia:** `GEI_STATE_DIAGRAM_FREEZE_V1.md` L132 declara TOTAL **62**, pero su columna por máquina (L115–131) suma **65**; la Transition Matrix tiene **66 filas TR** = 65 transiciones reales + TR-036 (fila de ausencia documentada: "No existe"). L22/L191 repiten "62 transiciones". Prohibiciones: declara 65 (L22/L192) pero existen 68 filas PROH (PROH-001..068).
- **Causa:** error aritmético del resumen del freeze.
- **Impacto:** confusión de base cuantitativa; E9 reconcilió con el detalle (65 reales respaldadas 65/65, verificado por `validate_traceability.mjs`).
- **Recomendación:** errata E6: TOTAL 65/68 + nota explícita de TR-036 como fila de ausencia.
- **Bloquea E9:** No.

### TRACE-FEEDBACK-04 · Conteos y clasificaciones E7 internamente inconsistentes — MINOR
- **Etapa origen:** E7 (Activity Traceability / Manifest / Selection).
- **Evidencia:** (a) "45 directamente diagramados" = 40 directos + 5 cubiertos por proceso compuesto (doble conteo; 45+5+52=102 sólo cierra contando los CC dos veces); conteo consistente: **40 + 5 + 57 = 102**. (b) Matriz §3 omite 16 filas (EVT-17..19, PRT-01..13 clasificados sólo en el resumen §4). (c) UC-PPL-11: fila §3=CC vs listados §4/exclusiones=NS. (d) UC-COM-03/04: filas §3=CC vs las 3 tablas de diagramas + listado DD=directos. (e) UC-PRT-12 sin clasificación explícita. (f) UC-IAM-09 doble listado (DD y CC). (g) Listado DD §4 enumera 41 IDs bajo total declarado 45; listado NS omite IAM-02/06/07/08 y PPL-12. (h) Manifest: conteos por dominio erróneos (PPL "3" nombra 2; EVT "5" nombra 4). (i) Pasos E5 discrepantes COM-04/CMP-06 entre matriz y contratos. (j) EVT-09/10 listados como "cubierto (contexto)" en AD-PRT-04 pero clasificados NS.
- **Causa:** consolidación de resúmenes sin revalidación mecánica contra las tablas de detalle.
- **Impacto:** la cobertura real de los 102 CU es íntegra (E9 verificó per-CU desde los contratos y diagramas); sólo el resumen es ambiguo.
- **Recomendación:** errata E7 con conteo 40+5+57 y clasificaciones resueltas (PPL-11=NS, COM-03/04=DIRECT, PRT-12=NS, IAM-09=CC).
- **Bloquea E9:** No.

### TRACE-FEEDBACK-05 · CSV de trazabilidad completa E8 citado pero ausente — MINOR
- **Etapa origen:** E8 (Class Traceability Matrix).
- **Evidencia:** `GEI_CLASS_TRACEABILITY_MATRIX_V1.md` L26: "Matriz completa 157 REQ × 102 CU × 37 clases en archivo adjunto `GEI_CLASS_TRACEABILITY_FULL_V1.csv`". El archivo **no existe** en el repo ni en el historial git (`git log --all --diff-filter=A -- "*.csv"` = vacío; no está en `.gitignore`).
- **Causa:** archivo generado en E8 pero nunca committeado.
- **Impacto:** referencia colgante; la muestra representativa del MD quedó como única evidencia E8.
- **Recomendación:** el ledger E9 (`GEI_TRACEABILITY_LEDGER_V1.csv`, 3.929 relaciones verificadas) **suple formalmente** esa matriz completa; alternativamente committear el CSV original en la errata E8.
- **Bloquea E9:** No.

### TRACE-FEEDBACK-06 · R-01 índice vs detalle (Person mult 1 vs 0..1) — MINOR
- **Etapa origen:** E8.
- **Evidencia:** índice de Relationship Matrix L39 (`Person 1 | 1`) vs detalle §3.1 R-01 ("Mult. Person 0..1"). E2 §1.3 y UC-PPL-03 confirman 0..1 (la persona existe antes de recibir Account).
- **Recomendación:** errata E8: índice → `0..1`.
- **Bloquea E9:** No.

### TRACE-FEEDBACK-07 · Event DRAFT inalcanzable en la máquina E6 — MINOR
- **Etapa origen:** E5/E6/E8 (inconsistencia de integración).
- **Evidencia:** REQ-EVT-007 declara `DRAFT → SCHEDULED → …`; PT §9 L461 (`DRAFT -> SCHEDULED`); E8 CL-12 enumera DRAFT en EventState y "DRAFT→SCHEDULED"; PROH-023 referencia el estado DRAFT. Pero E6 no tiene ninguna TR `DRAFT→SCHEDULED`: TR-017 crea el evento atómicamente en `SCHEDULED` ("sin borrador observable", REQ-EVT-009).
- **Causa:** la creación atómica (REQ-EVT-009) hace DRAFT transitorio-inobservable; el resto de las etapas documentaron el estado de todos modos.
- **Impacto:** el comportamiento runtime está unificado por REQ-EVT-009; sólo el conjunto de transiciones documentadas discrepa entre E5/PT/E8 y la máquina E6.
- **Recomendación:** errata conjunta: documentar DRAFT como estado transitorio inobservable (sin TR dibujada) o agregar la TR explícita con guard de atomicidad.
- **Bloquea E9:** No.

### TRACE-FEEDBACK-08 · Matriz E3: direcciones forward e inversa no mutuamente consistentes — MINOR
- **Etapa origen:** E3 (REQ-Actor-UC Matrix).
- **Evidencia:** la inversa §12 omite 8 pares forward (REQ-COM-003→UC-COM-05, REQ-EVT-017→UC-PRT-08, REQ-IAM-013→UC-IAM-09, REQ-PPL-012→UC-COM-06, REQ-PRT-003→UC-PRT-04, REQ-PRT-005→UC-INS-04, REQ-STR-010→UC-PPL-16, REQ-STR-013→UC-EVT-02); las referencias colectivas tienen presencia parcial o nula en §12 (REQ-STR-009 15→0; REQ-IAM-017 102→0; REQ-PRT-018 13→3; REQ-STR-008 15→13; etc.); y §12 registra 123 pares con REQ funcional que la fila forward no marca en ese CU (57 REQ distintos).
- **Causa:** las dos direcciones se consolidaron por separado en E3.
- **Impacto:** la dirección **forward (§2–10) es la autoridad** (completa y consistente con los gates E3); E9 construyó el ledger desde forward + referencias colectivas textuales, y provee la vista inversa corregida (`GEI_REVERSE_TRACEABILITY_MATRIX_V1.md` + ledger).
- **Recomendación:** regenerar §12 desde la dirección forward (o desde el ledger E9) en errata E3.
- **Bloquea E9:** No.

### TRACE-FEEDBACK-09 · Metadatos E1: prefijo INS vs DOMAIN SYS; rangos del freeze — MINOR
- **Etapa origen:** E1.
- **Evidencia:** REQ-INS-010 y REQ-INS-012 tienen `DOMAIN: SYS` en su bloque pero prefijo INS (el índice §19 los lista bajo INS); por dominio INS=10/SYS=29, por prefijo INS=12/SYS=27 (el total 157 cuadra de ambas formas). Freeze §11: rango `REQ-INS-001…012` con N.º 10 y `REQ-SYS-001…027` con N.º 29 (rango≠conteo).
- **Recomendación:** errata E1 de metadatos (no cambia ningún requerimiento).
- **Bloquea E9:** No.

### TRACE-FEEDBACK-10 · Corrupciones menores de texto en catálogo E1 — INFO
- **Evidencia:** GOALs con typos de codificación ("yTlanas", "NTTenga", "puedaJd", "unwelcome", "convoctada") y REQ-COM-017 con asteriscos espurios en freeze §4.6. Semántica intacta (E9 la verificó por contexto).
- **Recomendación:** errata cosmética opcional. **Bloquea E9:** No.

---

## B. TRACE — hallazgos de trazabilidad E9 (resueltos o clasificados en E9)

| ID | Hallazgo | Clasificación | Severidad | Acción E9 |
|---|---|---|---|---|
| TRACE-001 | R-07 scope LINE (ver TRACE-FEEDBACK-01) | SEMANTIC_CONFLICT | MAJOR | Registrado; no se registró como arista respaldada |
| TRACE-002 | R-10 Division→Season (ver TRACE-FEEDBACK-02) | SEMANTIC_CONFLICT | MAJOR | Registrado; no se registró como arista respaldada |
| TRACE-003 | CSV E8 ausente (ver TRACE-FEEDBACK-05) | STALE_REFERENCE | MINOR | Suplido por el ledger E9 (157×102×37 verificado) |
| TRACE-004 | TR-036 fila de ausencia sin REQ | JUSTIFIED_STRUCTURAL | INFO | Contabilizada como ausencia documentada (no transición) |
| TRACE-005 | 12 modelos temporales sin SM persistida (Membership, TeamAssignment, RoleAssignment, GuardianRelationship, Selection, AttendanceSheet, Availability derivados, Notification, Conversation DIRECT/TEAM/EVENT, Season, Jornada) | JUSTIFIED_STRUCTURAL | INFO | Registrados en catálogo E6 §4.2–4.6; sin máquina propia por diseño |
| TRACE-006 | TOTAL E6 62 vs 65 reales (ver TRACE-FEEDBACK-03) | DOCUMENTATION_GAP | MINOR | Reconciliado con detalle: 65/65 respaldadas |
| TRACE-007 | Conteo E7 45 vs 40+5 (ver TRACE-FEEDBACK-04) | DOCUMENTATION_GAP | MINOR | Reconciliado per-CU: 40+5+57=102 |
| TRACE-008 | 7 operaciones E8 sin REQ directo | JUSTIFIED_STRUCTURAL | INFO | Aristas `SUPPORTED_BY` estructural (SM/PT) en el ledger |
| TRACE-009 | R-49 sin REQ explícito (PT §22/§58) | VALID | INFO | Arista con soporte por regla documentada |
| TRACE-010 | Inconsistencia forward/inversa E3 §12 (ver TRACE-FEEDBACK-08) | DOCUMENTATION_GAP | MINOR | Ledger construido desde forward (autoridad); inversa corregida en E9 |
| TRACE-011 | Event DRAFT inalcanzable en E6 (ver TRACE-FEEDBACK-07) | SEMANTIC_CONFLICT | MINOR | Registrado; runtime unificado por REQ-EVT-009 |
| TRACE-012 | R-01 índice vs detalle (ver TRACE-FEEDBACK-06) | SEMANTIC_CONFLICT | MINOR | El ledger usa el detalle (0..1) como correcto |
| TRACE-013 | DEF-CMP-001 citado como "REQ que sustenta" en UC-PRT-11 §12 | DOCUMENTATION_GAP | MINOR | Ítem DEFER de E1, no REQ IN; excluido del ledger |
| TRACE-014 | 13 REQ con UC por matriz-only sin ficha §2 (SPEC-FEEDBACK-02, ya rotulado por E5) | DOCUMENTATION_GAP | INFO | ACs con evidencia de matriz (atribución de segundo orden, no falsa) |
| TRACE-015 | E2: implementación actual no alineada (0 CURRENT ALIGNED, 13 ACTOR-UI_FINDING) | VALID (gap implementación) | INFO | Deuda para E10; el frontend es evidencia secundaria, no autoridad |
| TRACE-016 | Clases no canónicas en matrices E8 (Match, EventSeriesTargetTeam/Person, JornadaMatch) | JUSTIFIED_STRUCTURAL | INFO | Subtipos/VO por discriminación (CLASS-DECISION-01) |
| TRACE-017 | 5 NFR IMPLEMENTATION_PENDING + REQ-PRT-008 EVIDENCE_PENDING (DEF-SYS-002/003 de E1) | DEFERRED_BY_AUTHORITY | INFO | Cobertura NFR clasificada; evidencia pendiente registrada |

---

## C. Anomalías tipológicas del contrato E9 §14

| Tipo | Detectadas | Detalle |
|---|---:|---|
| A. Referencias colgantes | 2 | TRACE-003 (CSV E8), audit E3 (ya cerrado por errata E3) |
| B. Duplicados | 0 | 0 IDs incompatibles; 0 aristas duplicadas en el ledger (DUPLICATE_TRACE_EDGE=0) |
| C. Naming drift | 1 | TRACE-013 (DEF-CMP-001 presentado como REQ) |
| D. Semantic drift | 2 | TRACE-FEEDBACK-01 (R-07), TRACE-FEEDBACK-02 (R-10) |
| E. State drift | 0 | Ninguna operación E8/E5 modifica un estado que E6 prohíbe (PROH consistente con TR; stress §17 áreas 8–13 CONSISTENTE) |
| F. Authority drift | 0 | Ningún CU concede permiso que E2 no autoriza (4/4 checks críticos verificados; R-07 es defecto de matriz E8, no de CU) |
| G. Cardinality conflict | 1 | TRACE-FEEDBACK-02 (R-10 contradice unique `season_id+division_id+line_id`) |
| H. Lifecycle conflict | 1 | TRACE-FEEDBACK-07 (DRAFT inalcanzable) |
| I. AC gap | 0 | 454/454 contabilizados; 0 aplicables sin representación |
| J. Stale artifact | 2 | TRACE-003, audit E3 (errata) |

**Correcciones aplicadas dentro del alcance E9 (permitidas):** IDs y alias (formato canónico de AC `REQ-<DOM>-<NNN> AC n`), metadatos de conteo en las matrices E9, normalización de referencias colectivas E3 en el ledger con nota de evidencia. **Ninguna autoridad E1–E8 fue modificada.**
