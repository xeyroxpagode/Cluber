# GEI — Reverse Traceability Matrix V1

> **Etapa:** E9-03 · **Estado:** FROZEN con E9 · **Fuente estructural:** `GEI_TRACEABILITY_LEDGER_V1.csv` (misma verdad que la matriz directa).
> Trazabilidad inversa: cada elemento de diseño (CU, SPEC, SM, TR, AD, clase, operación, relación) debe justificar su existencia con un REQ/AC/CU, o ser clasificado estructural justificado.

**Clasificación de hallazgos:** `VALID` · `JUSTIFIED_STRUCTURAL` · `DOCUMENTATION_GAP` · `SEMANTIC_CONFLICT` · `MISSING_REQUIREMENT` · `STALE_REFERENCE` · `BLOCKING_DECISION`.


## A. CU sin REQ

**Resultado: 0.** Los 102 CU tienen ≥1 arista `IMPLEMENTS_GOAL` (gate E3 §28 verificado por extracción). → `VALID`

## B. Especificaciones sin CU

**Resultado: 0.** Las 8 fichas E5 cubren 102/102 CU (IAM 10 · PPL 17 · STR 15 · EVT 19 · PRT 13 · COM 14 · CMP 9 · INS 5). → `VALID`

## C. Máquinas de estados sin fuente REQ

**Resultado: 0 de 17.** Todas las máquinas declaran fuente REQ/AC en el Catálogo E6. → `VALID`

## D. Transiciones sin REQ

**Resultado: 65/65 respaldadas.** La matriz E6 tiene 66 filas: 65 transiciones reales (todas con fuente REQ/AC) + **TR-036** (`YES/MAYBE/NO → NO_RESPONSE`), fila de **ausencia documentada** ("No existe": NO_RESPONSE no es estado persistido). → `JUSTIFIED_STRUCTURAL`

Filas derivadas/temporales con fuente REQ (cuentan como filas de matriz, no como transiciones persistidas): TR-037 (`NO_RESPONSE → NEEDS_RECONFIRMATION`, derivado; REQ-PRT-003 AC 2), TR-050 (`BLOCKED/PENDING → (expirada)`, temporal; REQ-PRT-017). → `JUSTIFIED_STRUCTURAL`

**Discrepancia documental E6 registrada:** el freeze declara TOTAL 62, pero su propia columna por máquina suma 65 y la matriz tiene 65 filas reales. Ver TRACE-006 / TRACE-FEEDBACK-03.

## E. Actividades — cobertura de los 102 CU

**Resultado: 102/102 evaluados.** 40 DIRECT (14 diagramas) · 5 COMPOSITE (cubierto por proceso compuesto/guard) · 57 SIMPLE_NOT_SELECTED (flujos simples justificados) · 0 BLOCKED. → `VALID`

Los 57 CU sin diagrama propio **no son huecos**: su exclusión está justificada por la Selection Matrix E7 (flujos simples de un paso o lectura, sin decisiones). Un CU simple sin AD con exclusión justificada es cobertura válida según contrato E9 §11.

**Nota de conteo E7:** la cifra "45 directamente diagramados" del Traceability E7 es 40 directos + 5 compuestos (doble conteo documentado); el conteo consistente es 40+5+57=102. Ver TRACE-007 / TRACE-FEEDBACK-04.

## F. Clases sin responsabilidad funcional

**Resultado: 0 de 37.** Todas las clases canónicas tienen ≥1 REQ que justifica su existencia (aristas `REALIZED_BY_CLASS`). → `VALID`

**Operaciones sin REQ directo:** 13 de 134 (Membership.hasActiveDependencies, RoleAssignment.addTemporalExclusion(period), RoleAssignment.removeTemporalExclusion(period), Event.start(), Event.complete(), Event.abandon(reason), Match.Match(eventId, opponent), Match.getCompetitionEntry(jornada), EventLogistics.EventLogistics(eventId), Selection.getCurrentConflicts (+3)). Justificación estructural por máquina de estados o regla PT (p. ej. `SelectionRevision.publish` → SM-SELECTIONREV-01; exclusiones temporales → PT §25; `isActiveBlocking` → SM-ELIGIBILITY-01). → `JUSTIFIED_STRUCTURAL`

**Elementos no canónicos en matrices E8** (subtipos/VO por discriminación, CLASS-DECISION-01): `Match` (subtipo de Event), `EventSeriesTargetTeam/Person`, `JornadaMatch`. No son clases canónicas de las 37 y no se cuentan como huérfanos. → `JUSTIFIED_STRUCTURAL`

## G. Relaciones entre clases sin soporte

**Sin REQ explícito:** 0 de 59: —. Soporte por regla Product Truth: R-49 (Notification→Event, PT §22/§58). → `VALID` (soporte por regla documentada)

**Conflictos semánticos detectados en E9 (stress §17), a resolver por Change Control en E8:**
- **R-07** `RoleAssignment→Competition (scope LINE)`: contradice PT §5 "Role scopes válidos" (PLAYER/CAPTAIN=TEAM, COACH=TEAM/EVENT, SUBCOMMITTEE/ADMIN=CLUB; cualquier otra combinación = `422 INVALID_ROLE_SCOPE`) y E2 §2.1/§2.3 (LINE/COMPETITION no son scopes de actor). Ningún REQ/UC/TR la utiliza. → `SEMANTIC_CONFLICT` (TRACE-001 / TRACE-FEEDBACK-01, MAJOR, no bloqueante).
- **R-10** `Division 0..* — 1 Season`: contradice PT §4/§26 (Division estable entre temporadas: "Primera, Quinta, Sexta"; solo `teams` tiene `season_id`) y E8 CL-08 (Division sin `seasonId`) y UC-STR-03 paso 3. → `SEMANTIC_CONFLICT` (TRACE-002 / TRACE-FEEDBACK-02, MAJOR, no bloqueante).
- **R-01** índice (Person mult `1`) vs detalle (`0..1`): el detalle es correcto (la persona existe antes de recibir Account, UC-PPL-03). → `SEMANTIC_CONFLICT` interno E8 (TRACE-012 / TRACE-FEEDBACK-06, MINOR).

## H. Requisitos sin destino

**Resultado: 0 de 157.** 122 funcionales con CU (DIRECT/SUPPORTING/CROSS_CUTTING) + 35 no funcionales con clasificación NFR (13 MODELLED · 16 CONSTRAINT_DOCUMENTED · 5 IMPLEMENTATION_PENDING · 1 DEFERRED_BY_AUTHORITY). → `VALID`

Los 5 IMPLEMENTATION_PENDING corresponden a evidencia pendiente registrada por E1 (DEF-SYS-002 → REQ-SYS-003, DEF-SYS-003 → REQ-PRT-008; serie SYS-001/022/023/024). REQ-SYS-027 EXTERNAL = decisión de la organización (DEFERRED_BY_AUTHORITY).

## I. Actores — verificación inversa

| Actor | REQ asociados (E2) | Pares REQ×CU con participación (E3) | Veredicto |
|---|---:|---:|---|
| ACT-UNAUTHENTICATED | 2 | 1 | VALID |
| ACT-AUTHENTICATED | 27 | 141 | VALID |
| ACT-PLAYER | 14 | 14 | VALID |
| ACT-CAPTAIN | 10 | 0 | VALID |
| ACT-COACH | 37 | 48 | VALID |
| ACT-SUBCOMMITTEE | 33 | 25 | VALID |
| ACT-ADMIN | 40 | 73 | VALID |
| ACT-GUARDIAN | 10 | 6 | VALID |

- **ACT-CAPTAIN:** 0 REQ como actor primario — deliberado (autoridad deportiva propia REQ-EVT-019; participa como secundario en 10 REQ). → `VALID` (justificado en E2 §7.4).
- **ACT-AUTHENTICATED:** no concede permisos por sí solo (sin rol o delegación → `/no-access`, REQ-IAM-012). → `VALID`.
- **ADMIN sin autoridad deportiva por defecto; CAPTAIN no hereda de COACH; Guardian depende de GuardianRelationship:** 4/4 checks críticos E2 documentados y verificados en E9 (freeze E2 §14.1, §7.4, §5.1, §4.2). → `VALID`
- 52 REQ SYSTEM_INTERNAL/NOT_APPLICABLE sin actor: por diseño (reglas internas del sistema). → `VALID`

## J. Referencias obsoletas / colgantes

- `GEI_CLASS_TRACEABILITY_FULL_V1.csv`: citado por `GEI_CLASS_TRACEABILITY_MATRIX_V1.md` (nota de matriz completa 157×102×37) pero **nunca committeado**. La muestra representativa por dominio del MD es la evidencia disponible. → `STALE_REFERENCE` (TRACE-003 / TRACE-FEEDBACK-05, MINOR: el CSV ausente se suple con el ledger E9, que sí cubre 157×102×37).
- `GEI_USE_CASE_RECONSTRUCTION_AUDIT_V1.md` (E3): inexistente; ya registrado por la errata E3 (`GEI_E3_MISSING_AUDIT_ERRATA_V1.md`, desviación D-2 de E4-0.1). → `STALE_REFERENCE` conocido y cerrado por errata. → deuda documentada.
- `DEF-CMP-001` citado como "REQ que sustenta" en inversa §12 de UC-PRT-11: es ítem DEFER de E1, no REQ IN. → `DOCUMENTATION_GAP` (TRACE-013, MINOR).

## Resumen de clasificación

| Categoría | Hallazgos |
|---|---|
| VALID | 0 huérfanos reales: CU, SPEC, SM, REQ y actores con participación justificada |
| JUSTIFIED_STRUCTURAL | TR-036 (ausencia documentada), TR-037/TR-050 (derivadas/temporales), 57 CU SIMPLE_NOT_SELECTED, operaciones estructurales E8, clases no canónicas (Match, EventSeriesTarget*, JornadaMatch), 12 modelos temporales E6 sin SM persistida |
| DOCUMENTATION_GAP | 13 REQ con UC por matriz-only (SPEC-FEEDBACK-02), DEF-CMP-001 en UC-PRT-11, inconsistencia forward/inversa matriz E3 §12 (123 pares, TRACE-010) |
| SEMANTIC_CONFLICT | R-07, R-10 (MAJOR, no bloqueantes), R-01 índice (MINOR), Event DRAFT inalcanzable en E6 (MINOR, TRACE-011) |
| MISSING_REQUIREMENT | 0 |
| STALE_REFERENCE | CSV E8 ausente (TRACE-003), audit E3 ausente (cerrado por errata E3) |
| BLOCKING_DECISION | 0 |

**Conclusión inversa:** no existe ningún elemento de diseño sin fuente, justificación estructural o clasificación documentada. Los conflictos semánticos registrados (R-07, R-10) son defectos de las autoridades congeladas E8 detectados por el stress de integración E9; están registrados como TRACE-FEEDBACK con corrección mínima propuesta y NO bloquean la cadena REQ→CU→CLASS para ningún REQ funcional (ningún REQ/CU/TR depende de ellos).