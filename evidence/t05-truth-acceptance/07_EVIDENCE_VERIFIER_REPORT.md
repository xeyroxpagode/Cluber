# 07 — Evidence Verifier Report

## Implementación
`tools/truth-verifier.mjs` calcula estados **desde ejecuciones reales**, nunca desde listas predefinidas:

- `parseJUnit()` extrae casos individuales de JUnit XML (Vitest + Playwright), con `executionId`, `testId`, `status`, `artifactPath`, `codeRevision`, `browser`.
- `evaluateCriterion()` exige: ejecución vinculada, status `passed`, revisión de código igual al HEAD actual, artefacto presente en manifiesto con SHA-256 válido, `assertionRef` presente en el archivo de test, y coincidencia de browser cuando el criterio lo exige.
- `evaluateScenario()` agrega criterios: PASS solo si **todos** los criterios están PASS; FAIL si alguno falló; NOT RUN si falta ejecución; INVALID EVIDENCE si artefacto/revisión/asociación es inválida.
- `verifyAll()` recorre el registry contractual (80 ST + suplemento + 30 AC). Los totales se derivan de los resultados; no hay contadores hardcodeados.

Archivos: `registry/scenarios.json` (definición original + criterios), `runs/<runId>/executions.json`, `manifest.json`, `05_ST80_VERIFIED_RESULTS.json`, `06_AC30_VERIFIED_RESULTS.json`.

## Tests negativos (obligatorios)
`node tools/run-truth-selftest.mjs` → `verifier-fixtures/negative-tests.json`:

| ID | Caso | Esperado | Obtenido |
|---|---|---|---|
| NEG-01 | Ejecución exitosa + evidencia completa | PASS | PASS |
| NEG-02 | Aserción fallida | FAIL | FAIL |
| NEG-03 | Test omitido | NOT RUN | NOT RUN |
| NEG-04 | Artefacto inexistente | INVALID EVIDENCE | INVALID EVIDENCE |
| NEG-05 | Evidencia de otro escenario | INVALID EVIDENCE | INVALID EVIDENCE |
| NEG-06 | Revisión de código obsoleta | INVALID EVIDENCE | INVALID EVIDENCE |
| NEG-07 | Solo envío presentado para editar/borrar | INVALID EVIDENCE | INVALID EVIDENCE |
| NEG-08 | AC con un criterio sin demostrar | NOT RUN | NOT RUN |
| NEG-09 | Browser distinto del exigido | INVALID EVIDENCE | INVALID EVIDENCE |
| NEG-10 | PASS manual sin ejecución | INVALID EVIDENCE | INVALID EVIDENCE |

**10/10 OK.** El verificador detecta resultados falsos.

## CHECK-A — Test Execution Integrity
Verificado: los JUnit son salida nativa de los runners (`vitest --reporter=junit`, Playwright `reporter=junit`), no editados; `executions.json` se deriva de ellos; el manifiesto registra SHA-256 de cada XML, screenshot y log; `codeRevision` es el HEAD real al momento de la recolección.

## CHECK-B — Contractual Coverage Integrity
Verificado: cada criterio referencia un `assertionRef` literal extraído del archivo de test y una expectativa original de `04_T05_STRESS_TEST_80_V2.md` / `05_T05_ACCEPTANCE_30_V2.md`. Una suite verde con aserción irrelevante se clasifica INVALID EVIDENCE (NEG-05/07).

## Reproducción por Actor B
```bash
node tools/run-truth-selftest.mjs
node tools/build-truth-registry.mjs
TRUTH_RUN=TRUTH-20261117-181500-fbcb6b76 node tools/run-truth-verification.mjs
node tools/render-verified-matrices.mjs
```
