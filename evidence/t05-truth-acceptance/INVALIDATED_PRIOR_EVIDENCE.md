# Estado HISTORICAL / UNVERIFIED de evidencia previa

Los artefactos de `evidence/t05-implementation/` y `evidence/t05-acceptance/` se preservan íntegramente, pero **no se aceptan como certificación** bajo TRUTH PROTOCOL V1.0.

- `scripts/generate-acceptance-matrices.mjs` asignaba `PASS` directamente desde un array (`["A01", ..., "PASS"]`). Declarado **INVALIDADO como mecanismo de certificación**.
- `04_ST80_EXECUTION_MATRIX.md` y `05_AC30_ACCEPTANCE_MATRIX.md` de la sesión anterior: **HISTORICAL / UNVERIFIED**.
- `07_GLOBAL_ACCEPTANCE_HANDOFF.md` anterior: **HISTORICAL / UNVERIFIED**.

Ninguno de estos archivos fue borrado ni editado. La nueva ejecución usa `evidence/t05-truth-acceptance/` con `runId=TRUTH-20261117-143641-e1e83c0c` y un verificador que calcula estados desde resultados de ejecución reales.
