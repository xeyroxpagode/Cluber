# 02 — Evidence Attestation

## CODE REVISION vs EVIDENCE COMMIT
- CODE REVISION: `0eb41b495091eee341804a8eddf012171d6b402a` (código, tests, fixtures, tooling de ejecución).
- EVIDENCE COMMIT: se crea al finalizar con informes, matrices y resultados. No modifica código productivo, tests, fixtures ni configuración.

## Mecanismo
`tools/truth-exec.mjs` registra ANTES de cada runner:
- `runId`, timestamp inicial, comando exacto.
- Git HEAD, tree hash, branch y `git status --short`.
- SHA-256 de todos los archivos relevantes (`backend/src`, `src`, `tests`, `tools`, migraciones, `scripts`, configs).

Después registra timestamp final, exit code y vuelve a calcular el fingerprint. Si algo cambia durante la prueba, escribe `<label>.INVALID.json` y la ejecución se declara inválida.

## Resultados de atestación (runId `TRUTH-FINAL-0eb41b49`)
Todos los labels: `backend-unit`, `backend-integration`, `backend-api`, `backend-stress`, `truth-gaps`, `frontend`, `e2e-browser`, `e2e-recovery`, `e2e-d16` registran:
- `exit=0`
- `codeChanged=false`
- `head=0eb41b495091eee341804a8eddf012171d6b402a`

El verificador toma `codeRevision` de `<label>.pre.json`, nunca del HEAD actual (TRUTH-CLOSE-01).

## Integridad
`evidence/t05-truth-acceptance/manifest.json` contiene SHA-256 de XML nativos, logs, screenshots y fixtures del verificador. Cualquier cambio posterior invalida la evidencia correspondiente.

## Nota sobre el verificador
Después del CODE REVISION se ajustó únicamente `tools/truth-verifier.mjs` para resolver rutas de aserciones cuando Playwright reporta solo el basename del spec. No cambió código productivo, tests, fixtures ni configuración (`git diff --name-only 0eb41b49 -- backend/src src tests supabase ...` → 0 archivos). El cambio afecta solo el análisis posterior de evidencia, no la ejecución probada.

## Reproducción
```bash
node tools/run-truth-selftest.mjs                      # 17/17 negativos
TRUTH_RUN=TRUTH-FINAL-0eb41b49 node tools/run-truth-verification.mjs
```
