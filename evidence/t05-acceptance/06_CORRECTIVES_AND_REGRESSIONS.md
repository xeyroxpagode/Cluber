# 06 — Correctives and Regressions

## Correctivos C1 (todos verificados en V1)

| ID | Archivos | Cambio | Antes | Después |
|----|----------|--------|-------|---------|
| T05-QA-001 | `backend/src/communication/announcements.ts`, `communication-routes.ts`, `src/lib/t05-api.ts`, `src/features/communication.tsx` | `validateAudienceShape()` para DRAFT; `requireAudienceForPublish()` + `clubWide` explícito en PUBLISH | DRAFT sin audiencia → 422 | DRAFT se guarda; publicar sin intención → AUDIENCE_REQUIRED |
| T05-QA-002 | `src/features/communication.tsx` | Botón "Editar borrador" en el detalle DRAFT | Solo "Volver" | Edición accesible desde UI |
| T05-QA-003 | `src/features/communication.tsx` | `required` en Título/Cuerpo/Motivo | "OPCIONAL" | "obligatorio" |
| A2-PAGINATION | `backend/src/communication/queries.ts` | Cursor + `LIMIT` en SQL para RC-06/07/19; recheck de audiencia en SQL | Paginación en memoria | Paginación real en base de datos |

## Ajustes de tests (no debilitantes)
- `t05.integration.test.ts`: el caso "DRAFT sin audiencia" ahora verifica que **se guarda** y que publicar sin intención se rechaza; antes esperaba el 422 del defecto.
- `t05.api.test.ts` / `t05-stress.test.ts`: pasan `clubWide: true` al publicar, reflejando la intención contractual.
- `tests/e2e/t05-qa-reset.ts`: aisla mensajes/cursores/notificaciones entre ejecuciones de navegador.
- Ningún test fallido fue eliminado; ninguna aserción se relajó sin justificación contractual.

## Ejecución antes → después (evidencia)
| Suite | Antes de C1 | Después de C1 (V1) |
|-------|-------------|--------------------|
| Integration | 2 fallos (DRAFT + UUID centinela) | **105/105 PASS** |
| API | 3 fallos (publish sin intención) | **82/82 PASS** |
| Unit | 49/49 | **49/49 PASS** |
| Frontend | 102/102 | **102/102 PASS** |
| Stress | 15/15 | **15/15 PASS** |
| E2E 3 navegadores | J01 fallaba (DRAFT/audiencia/affordance) | **15/15 PASS** |

Logs: `logs/c1-integration.log`, `logs/c1-api.log`, `logs/V1-*.log`, `logs/v1-e2e-final.log`.

## Regresiones T01–T04
Baseline real en I0: 301 tests locales (96 frontend + 49 unit + 80 integration + 76 API). En V1: 353 técnicos + 15 E2E, sin fallos. Conjunto disponible de regresión ejecutado sin modificación de suites upstream.

## Cobertura final
353 tests técnicos + 15 recorridos de navegador = **368 ejecuciones verificadas**, todas PASS.
