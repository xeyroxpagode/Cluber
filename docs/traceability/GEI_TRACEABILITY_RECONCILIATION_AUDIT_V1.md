# GEI — Traceability Reconciliation Audit V1

> **Etapa:** E9-05 · **Estado:** FROZEN con E9 · **Rama:** `gei/e9-integral-traceability-freeze-v1`
> Este documento registra el proceso de reconciliación integral, las decisiones tomadas, los resultados de QA mecánico y semántico, y la evaluación del gate E9-01…E9-07.

## 1. Preflight y baseline

| Check | Resultado |
|---|---|
| Rama base E8 | `gei/e8-complete-class-model-freeze-v1` |
| SHA E8 verificado | `dce6c05955fb68704cb5546fc86b519fffefd009` (coincide con el reportado; push verificado por el usuario, no asumido) |
| Working tree al inicio | Limpio |
| `pnpm typecheck` | PASS |
| `pnpm test` | PASS — 92/92 |
| `pnpm build` | PASS (warning de chunk >500kB, no bloqueante, preexistente) |
| E1–E8 intactas | Verificado: 0 modificaciones a `docs/requirements|actors|use-cases|uml/**`, `src/**`, Product Truth |
| Rama E9 creada | `gei/e9-integral-traceability-freeze-v1` desde la punta E8 |

## 2. Source inventory (E9-01)

Fuentes consumidas (todas FROZEN, versiones vigentes):

| Etapa | Autoridades | Elementos |
|---|---|---|
| E1 | Requirements Freeze, Catalog, Open Decisions | 157 REQ (122 F + 35 NF), 15 categorías, erratas: ninguna vigente que modifique REQ |
| E2 | Actor Model Freeze, Catalog, Requirement Matrix, Authority Boundary Matrix | 8 actores, 173 pares actor-REQ (104 P + 69 S), 4/4 checks críticos documentados |
| E3 | Master UC Inventory Freeze, Catalog, REQ-Actor-UC Matrix, Errata | 102 CU, 792 pares REQ×CU (239 explícitos + 8 referencias colectivas expandidas), 0 REQ funcionales sin CU, 0 CU sin REQ |
| E5 | Specification Freeze, 8 fichas, Index, Spec Traceability | 102 CU especificados, 454 AC, 444 filas UC×REQ (ficha ∪ matriz), granularidad REQ×CU |
| E6 | State Diagram Freeze, Model Catalog, Transition Matrix, Traceability | 17 SM, 66 filas TR (65 reales + TR-036 ausencia), 68 PROH, 12 modelos temporales |
| E7 | Activity Freeze, Manifest, Flow Contracts, Selection Matrix, Traceability | 14 AD, 102 CU evaluados (40 DIRECT + 5 COMPOSITE + 57 SIMPLE_NOT_SELECTED + 0 BLOCKED) |
| E8 | Class Model Freeze, Catalog, Traceability, Operation, Relationship, Attributes | 37 clases, 134 operaciones, 59 relaciones R-XX |

Base cuantitativa confirmada contra archivos reales: **todos los valores coinciden con la base reportada** salvo dos discrepancies documentadas y reconciliadas: transiciones E6 (declaradas 62; reales 65 — ver §5.1) y cobertura E7 (reportada 45 directos; reales 40+5 — ver §5.2). E9 no forzó ningún número.

## 3. Ledger canónico (E9-02)

- **Archivo:** `GEI_TRACEABILITY_LEDGER_V1.csv` — 3.929 relaciones justificadas, 10 columnas de contrato, deduplicación por arista `source||relation||target`.
- **Nomenclatura de relaciones (glosario canónico):**
  - `REQUESTED_BY` (REQ→ACTOR): actor fuente del requerimiento.
  - `IMPLEMENTS_GOAL` (UC→REQ): el CU implementa el objetivo del REQ (primario/secundario/transversal según matriz E3).
  - `SUPPORTED_BY` (REQ→AC; SM→REQ; TR→REQ/AC; OP→CL): el destino soporta/respalda la existencia del origen.
  - `APPLIES_TO` (AC→UC): aplicabilidad contextual REQ×CU del criterio (normaliza la limitación E5).
  - `SPECIFIED_BY` (UC→SPEC): ficha E5 donde el CU está especificado.
  - `CHANGES_STATE` (UC→TR): el CU dispara la transición.
  - `REPRESENTED_BY_ACTIVITY` (UC→AD): el CU está representado por el diagrama (directo o compuesto).
  - `REALIZED_BY_CLASS` (REQ→CL; SM→CL): la clase realiza el REQ / materializa la máquina.
  - `REALIZED_BY_OPERATION` (REQ→OP): la operación funcional realiza el REQ.
  - `PARTICIPATES_IN` (CL→UC): la clase participa en la realización del CU.
  - `GOVERNS_RELATIONSHIP` (REQ→R-XX): el REQ gobierna la relación entre clases.
  - `CONSTRAINS` (PROH→REQ; NFR→NFR_CATEGORÍA): prohibición E6 respaldada; clasificación de REQ no funcional.
  - `coverage_status`: `DIRECT`, `SUPPORTING`, `BUSINESS_RULE`, `SYSTEM_INTERNAL`, `CROSS_CUTTING`, `NOT_APPLICABLE_WITH_REASON`, `MODELLED`, `CONSTRAINT_DOCUMENTED`, `TEST_EVIDENCE_AVAILABLE`, `IMPLEMENTATION_PENDING`, `DEFERRED_BY_AUTHORITY`.
- **Distribución:** REQUESTED_BY 173 · IMPLEMENTS_GOAL 792 · REQ→AC 454 · APPLIES_TO 1.350 · SPECIFIED_BY 102 · CHANGES_STATE 66 · SM/TR→REQ 360 · REPRESENTED_BY_ACTIVITY 50 · REQ→CL 133 · REQ→OP 160 · PARTICIPATES_IN 116 · GOVERNS_RELATIONSHIP 63 · PROH 68 · NFR 35.
- **Regla anti-cartesiano:** cada fila es una relación con evidencia concreta en una autoridad; las referencias colectivas de la matriz E3 (8 REQ transversales) se registran con nota literal "referencia colectiva de la matriz" y cobertura CROSS_CUTTING.

## 4. Machine QA (E9-06, mecánico)

Validador reutilizable: `scripts/validate_traceability.mjs` (relee el CSV committeado; no re-genera nada). Resultado completo: `source-data/e9_machine_qa.json`.

```
REQ_IN = 157            FUNCTIONAL_REQ = 122    NONFUNCTIONAL_REQ = 35
ACTORS = 8              CANONICAL_UC = 102      AC = 454
STATE_MACHINES = 17     TR_REAL = 65            DIAGRAMS = 14          CLASSES = 37

UNKNOWN_REQ = 0         UNKNOWN_ACTOR = 0       UNKNOWN_UC = 0          UNKNOWN_SPEC = 0
UNKNOWN_SM = 0          UNKNOWN_AD = 0          UNKNOWN_CLASS = 0       UNKNOWN_AC = 0
DUPLICATE_TRACE_EDGE = 0                        DANGLING_REFERENCE = 0
UNCLASSIFIED_FUNCTIONAL_REQ = 0                UNCLASSIFIED_NONFUNCTIONAL_REQ = 0
UNACCOUNTED_APPLICABLE_AC = 0
UNJUSTIFIED_STATE_TRANSITION = 0               UNJUSTIFIED_ACTIVITY = 0
UNJUSTIFIED_DOMAIN_CLASS = 0                   UNRESOLVED_BLOCKING_CONFLICT = 0
```

Verificaciones de cobertura derivadas: REQ clasificados 157/157 · CU trazados 102/102 · AC contabilizados 454/454 (418 con CU + 36 transversales/N.A.) · transiciones respaldadas 65/65 · CU evaluados en actividades 102/102 · clases justificadas 37/37 · actores verificados 8/8.

**MACHINE QA: PASS.**

## 5. Reconciliaciones semánticas (decisiones con evidencia)

### 5.1 Transiciones E6: 66 filas → 65 reales + 1 ausencia
El freeze E6 declara TOTAL 62 (L132), pero su columna por máquina (L115–131) suma 65 y la Transition Matrix tiene 66 filas. Reconciliación: **65 transiciones reales** — 64 persistidas + TR-044 (self-loop documentado con fuente REQ-PRT-011 AC 1) — + TR-036 (fila de ausencia: "No existe" transición a NO_RESPONSE porque no es estado persistido) + TR-037/TR-050 (derivada/temporal, cuentan como filas de matriz con fuente REQ). **Decisión E9:** la base cuantitativa de transiciones es **65/65 respaldadas** (62 declaradas = error de suma del resumen E6). Registrado TRACE-006 / TRACE-FEEDBACK-03.

### 5.2 Cobertura E7: "45 directos" = 40 + 5
La cifra 45 del Traceability E7 cuenta los 5 CU compuestos dos veces (una como DD "COVERED_BY_EXISTING_ACTIVITY" y otra como CC). Conteo consistente verificado per-CU desde los contratos: **40 DIRECT + 5 COMPOSITE + 57 SIMPLE_NOT_SELECTED = 102**. Los 57 sin diagrama propio tienen exclusión justificada (flujos simples); 0 BLOCKED. Registrado TRACE-007 / TRACE-FEEDBACK-04. UC-IAM-09 (guard transversal) está representado en 4 AD; el ledger registra 50 aristas UC→AD (40 directos + 10 de compuestos/guards) sin duplicar la verdad.

### 5.3 Formato canónico de AC
E5 no numera ACs (`AC-XXX` no existe); la referencia individual de la fuente es el ordinal `REQ-<DOM>-<NNN> AC n` (usado literalmente en fichas). E9 lo adopta como ID estable. 0 duplicados de ID, 454/454 contabilizados.

### 5.4 Referencias colectivas E3
8 referencias colectivas textuales de la matriz E3 (5 REQ × "los 102 CU", REQ-STR-008/009 × 15 CU STR, REQ-PRT-018 × 13 CU PRT) se expanden a aristas CROSS_CUTTING con nota literal. La dirección forward (§2–10) es la autoridad; la inversa §12 es inconsistente (TRACE-010) y fue reemplazada por la vista inversa del ledger.

### 5.5 Clasificación NFR (35 REQ)
13 MODELLED (con máquina/estructura E6) · 16 CONSTRAINT_DOCUMENTED · 5 IMPLEMENTATION_PENDING (DEF-SYS-002/003 de E1) · 1 DEFERRED_BY_AUTHORITY (REQ-SYS-027 EXTERNAL). Ningún NFR fue forzado a actor/CU.

### 5.6 R-07 y R-10 (defectos E8)
El stress de integración detectó 2 relaciones de la matriz E8 que contradicen Product Truth y E2 (R-07 scope LINE; R-10 Division→Season). **Decisión E9:** no se registran como aristas respaldadas; se registran como TRACE-FEEDBACK-01/02 (MAJOR, no bloqueantes) para Change Control en E8. Ningún REQ/CU/TR depende de ellas, por lo que la cadena directa e inversa de los 157 REQ es íntegra.

## 6. Stress de consistencia (§17 — revisión manual focalizada)

| # | Área | Veredicto |
|---|---|---|
| 1 | Person vs Account vs Membership | CONSISTENTE (nota menor: R-01 índice, TRACE-012) |
| 2 | RoleAssignment y TeamAssignment | CONTRADICCIÓN R-07 (TRACE-FEEDBACK-01, MAJOR no bloqueante); vigencia temporal consistente |
| 3 | GuardianRelationship y authority | CONSISTENTE (E2 §1.1/§5.2 ↔ E8 R-08/09) |
| 4 | Team = Season + Division + Line | CONTRADICCIÓN R-10 (TRACE-FEEDBACK-02, MAJOR no bloqueante); resto consistente (R-12/13/14, TR-005, PROH-009) |
| 5 | Event/Match/EventSeries | CONSISTENTE con excepción DRAFT inalcanzable (TRACE-FEEDBACK-07, MINOR) |
| 6 | Jornada y atomicidad | CONSISTENTE (CL-15/R-24; PROH-030/031 agrupados; guard bulk ≤100) |
| 7 | Availability vs Selection vs Attendance | CONSISTENTE (TR-027 ↔ TR-037 ↔ R-25; PROH-035/036/040/042 ↔ R-25/28/31/32) |
| 8 | SelectionRevision inmutable | CONSISTENTE (PROH-039 ↔ R-29/30 ↔ TR-040/041 ↔ CL-21) |
| 9 | MatchRecord FINAL | CONSISTENTE (PROH-045 ≠ TR-047 corrección con motivo; R-34; REQ-PRT-013/014) |
| 10 | CompetitionEntry TEAM/LINE | CONSISTENTE (PROH-066 ↔ CLASS-DECISION-05 ↔ R-52/53/54 ↔ TR-063/064) |
| 11 | Announcement snapshot | CONSISTENTE (PROH-051/052 ↔ R-41/42 ↔ TR-052/053; doble modelo redundante no contradictorio) |
| 12 | PII / field authority | CONSISTENTE (CL-01 DNI/birthDate/phone/email bajo E2 §3; guardian sin acceso a PII del menor; R-58 audit redactado) |
| 13 | Restore, archive, terminales | CONSISTENTE (PROH-008/012/016/020 ↔ R-10..R-15 ↔ UC-STR-05/08/12/15; restore negado excepto Account TR-002 y Event TR-022, asimetría documentada) |

**SEMANTIC RECONCILIATION: PASS con 2 conflictos MAJOR registrados como deuda no bloqueante (R-07, R-10) + 2 MINOR (DRAFT, R-01 índice).** Ninguno afecta la cadena de trazabilidad de REQ funcionales ni contradice behavior runtime.

## 7. Evaluación del gate E9

| Gate | Criterio | Estado |
|---|---|---|
| E9-01 | Fuentes revisadas e inventariadas | PASS |
| E9-02 | Ledger íntegro (3.929 relaciones, 0 dup, 0 colgantes) | PASS |
| E9-03 | Matrices directas e inversas reconciliadas (proyecciones del ledger) | PASS |
| E9-04 | 0 referencias colgantes en el ledger; colgantes en autoridades registradas (TRACE-003) | PASS |
| E9-05 | 0 relaciones inventadas (toda arista cita evidencia) | PASS |
| E9-06 | 0 contradicciones bloqueantes; 2 MAJOR no bloqueantes registradas con propuesta | PASS |
| E9-07 | Machine QA PASS + Semantic QA PASS + evidencia registrada | PASS |

**Veredicto de reconciliación: PASS.**
