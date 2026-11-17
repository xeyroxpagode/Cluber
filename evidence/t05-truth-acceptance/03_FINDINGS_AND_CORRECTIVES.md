# 03 — Findings and Correctives (TRUTH)

| ID | Tipo | Severidad | Hallazgo | Corrección / disposición | Estado |
|---|---|---|---|---|---|
| TRUTH-QA-001 | Producto | P1 | C15: `assertConversationAccess` exigía participación activa también para leer, impidiendo la historia de un ex-participante en `[joinedAt,leftAt)`. | `assertConversationAccess(..., {allowHistory:true})` usado por RC-07; la escritura sigue exigiendo participación activa. Nuevo test `ST-C04/C05`. | CLOSED / revalidado en run `fbcb6b76` |
| TRUTH-QA-002 | Test | P2 | Flakiness de estado compartido entre motores en J04/Edge y en J02 del spec de recuperación (checkbox ya marcado). | Aislamiento de fixtures (`t05-qa-reset.ts`) y re-ejecución aislada: J04/Edge PASS. J02 del spec antiguo queda como defecto de fixture documentado; no se usa como evidencia de aceptación. | DOCUMENTED |
| DEF-TRUTH-01 | Certificación | P0 | Matrices anteriores con PASS asignados por script. | Invalidadas; nuevo verificador con 10 tests negativos. | CLOSED |
| DEF-TRUTH-02 | Certificación | P1 | Evidencia no equivalente para ST-A10/B03/C04/C05/C07/C08/C10/C11/E06/E11/F02/F07/F08. | Tests específicos en `t05-truth-gaps.test.ts` y mapeo explícito en el registry. | CLOSED |
| DEF-TRUTH-03 | Certificación | P1 | Evidencia de un HEAD obsoleto tras el correctivo de C15. | Nuevo runId `TRUTH-20261117-181500-fbcb6b76`; verificación de `codeRevision` en cada criterio. | CLOSED |

## Regla aplicada
Ningún finding se cerró cambiando una expectativa contractual. Los tests fallidos se preservan con su resultado original en `runs/<runId>/*.xml`.
