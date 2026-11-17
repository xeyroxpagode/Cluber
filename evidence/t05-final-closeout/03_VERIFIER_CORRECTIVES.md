# 03 — Verifier Correctives and Negative Controls

## Correcciones C1
1. **Revision attestation (TRUTH-CLOSE-01)**: `tools/truth-exec.mjs` captura HEAD/tree/hash de archivos antes y después de cada runner. `run-truth-verification.mjs` usa `<label>.pre.json` como `codeRevision`; sin atestación, la ejecución se marca `UNATTESTED` y el criterio se clasifica inválido.
2. **Assertion mapping (TRUTH-CLOSE-02)**: `build-truth-registry.mjs` reconoce `it(` y `test(`; todos los criterios llevan `requireAssertion: true` y `assertionRefs` explícitos (0 criterios sin aserción). Se rechazan aserciones triviales (`expect(true).toBe(true)`).
3. **Runner exit y código cambiado**: criterios fallan si el runner terminó con exit != 0 o si el fingerprint cambió durante la ejecución.
4. **Compatibilidad de rutas**: aserciones de Playwright se resuelven sobre el archivo del registry cuando JUnit reporta solo el basename.

## Controles negativos
`tools/run-truth-selftest.mjs` → **17/17 OK**: NEG-01…NEG-10 originales + NEG-11 (JUnit anterior a edición), NEG-12 (HEAD cambiado), NEG-13 (resultado modificado tras hash), NEG-14 (criterio sin aserción), NEG-15 (aserción trivial), NEG-16 (runner con fallo pese a resultados parciales), NEG-17 (archivos cambiados durante la prueba).

## CHECK-A / CHECK-B / CHECK-C
- **CHECK-A (Execution Integrity)**: 9 ejecuciones con `exit=0`, `codeChanged=false` y `head=CODE REVISION`; hashes en manifiesto.
- **CHECK-B (Contractual Integrity)**: expectativas tomadas de `04_T05_STRESS_TEST_80_V2.md` y `05_T05_ACCEPTANCE_30_V2.md`; cada criterio vincula aserción específica (concurrencia, dedupe, fault injection y edición/borrado no se sustituyen entre sí).
- **CHECK-C (Product Integrity)**: sin regresiones, autoridad y constraints preservados, C15/C10/C19 y RC-07 correctos.

Juicio técnico: la equivalencia semántica completa entre aserción y contrato requiere revisión de Actor B; el verificador automatizado no la reemplaza.
