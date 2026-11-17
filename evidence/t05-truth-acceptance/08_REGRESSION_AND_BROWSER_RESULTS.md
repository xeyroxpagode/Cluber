# 08 — Regression and Browser Results

runId: `TRUTH-20261117-181500-fbcb6b76` · HEAD: `fbcb6b76c0dd590bc70e0dbecf31864f779fc745`

| Suite | Resultado | Artefacto |
|---|---|---|
| Backend unit | 49/49 PASS | `backend-unit.xml` |
| Backend integration | 105/105 PASS | `backend-integration.xml` |
| Backend API | 82/82 PASS | `backend-api.xml` |
| Backend stress | 15/15 PASS | `backend-stress.xml` |
| Truth gaps | 14/14 PASS | `truth-gaps.xml` |
| Frontend | 102/102 PASS | `frontend.xml` |
| E2E Chromium/Firefox/Edge | 14/15 + 1 flaky aislado PASS | `e2e-browser.xml`, `retry-j04-edge.xml` |
| E2E recuperación | 6/7 + J02 fixture defect | `e2e-recovery.xml`, `retry-j02-recovery.xml` |
| Verificador negativo | 10/10 PASS | `verifier-fixtures/negative-tests.json` |

Total técnico: **367 tests**; E2E: **22 ejecuciones** (15 journeys + 7 recovery). Los fallos aislados se documentan en `03_FINDINGS_AND_CORRECTIVES.md`; no se ocultan ni se eliminaron aserciones.

Regresiones T01–T04: las suites `foundation.*`, `t03.*`, `t04.*` están incluidas en los XML y no presentan fallos.
