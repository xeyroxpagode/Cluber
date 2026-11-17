# C0 — Baseline y hallazgos de entrada

- Worktree: `C:\Users\thega\Desktop\Gei-Hockey-T05-Implementation` · rama `gei/t05-communication`.
- HEAD inicial: `4e5e53a4afa07472dbefd401e1d19c7d687cf5b5`.
- Working tree: solo `?? test-results/` (artefactos generados, no código).
- T04 protegido: `410af4247b5573448674e98b07b49fde940e7fde`.
- PostgreSQL: `gei_test`, 127.0.0.1:56322, aislado.
- Evidencia TRUTH anterior preservada en `evidence/t05-truth-acceptance/` como HISTÓRICA.

## Hallazgos de entrada (según orden)

| ID | Descripción | Estado inicial |
|---|---|---|
| TRUTH-CLOSE-01 | `run-truth-verification.mjs` asigna el HEAD vigente al procesar JUnit; no prueba que el test se ejecutó sobre ese commit. | OPEN |
| TRUTH-CLOSE-02 | Registry buscaba `it(`, no `test(`; algunas asociaciones no exigen aserción válida. | OPEN |
| TRUTH-CLOSE-03 | J02 GROUP en `t05-journeys.spec.ts` falló y el reintento aislado siguió fallando. | OPEN |
| TRUTH-CLOSE-04 | ST-D16 sin demostración de navegador de Sending→Sent/Failed. | OPEN |
| TRUTH-CLOSE-05 | AC-30 requiere revisión externa; Actor C no puede autocertificarla. | OPEN (externo) |
