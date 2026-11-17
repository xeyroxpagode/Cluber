# GEI T05 R3 — Findings Ledger (estado final post-C1/V1)

| ID | Sev | Hallazgo | Causa raíz | Correctivo | Test de regresión | Estado |
|----|-----|----------|-----------|------------|-------------------|--------|
| T05-QA-001 | P1 | Guardar DRAFT sin audiencia respondía 422 `AUDIENCE_REQUIRED`. | `validateAudience()` aplicaba la precondición de publicación al guardado de borrador; C11 define DRAFT válido por title+body y C12 exige audiencia solo al publicar. | Separar `validateAudienceShape()` (DRAFT) de `requireAudienceForPublish()` (PUBLISH); `publish()` recibe la intención `clubWide` explícita. Sin cambios de esquema. | `t05.integration.test.ts` (DRAFT sin audiencia + publish sin intención → AUDIENCE_REQUIRED); `t05.api.test.ts`; **J01 en 3 navegadores** | **CLOSED — PASS** |
| T05-QA-002 | P2 | El detalle de un DRAFT no ofrecía acción de edición. | `AnnouncementDetail` condicionaba las acciones a `state === "PUBLISHED"`. | Botón "Editar borrador" para DRAFT → `/announcements/:id/edit`. | **J01 en Chromium/Firefox/Edge** | **CLOSED — PASS** |
| T05-QA-003 | P3 | Etiquetas "OPCIONAL" en campos obligatorios. | `TextField`/`TextArea` no recibían `required`. | `required` en Título, Cuerpo y Motivo. | J01 verifica `required` en los tres navegadores | **CLOSED — PASS** |
| T05-QA-004 | INVALID EVIDENCE | Firefox no mostraba badge unread en una ejecución compartida. | Estado compartido entre motores secuenciales sobre la conversación canónica; no reproducible con DB limpia. | Aislamiento de fixtures (`t05-qa-reset.ts`) antes de cada test E2E. | J04 Firefox aislado 1/1; suite V1 15/15 | **CLOSED — no reproducible** |
| A2-PAGINATION | P1 técnico | RC-06/07/19 paginaban en memoria (descarga completa antes de `slice`). | `query.execute()` sin `LIMIT` + filtro/cursor en JavaScript. | Cursor y `LIMIT limit+1` en SQL; recheck de autoridad de RC-06/RC-19 también en SQL. | 105 integration + 82 API + J04 paginación con 25 mensajes en 3 navegadores | **CLOSED — PASS** |

## Resumen
5 hallazgos cerrados · 0 abiertos · 0 bloqueos. Ningún correctivo debilitó invariantes, autoridad o constraints.
