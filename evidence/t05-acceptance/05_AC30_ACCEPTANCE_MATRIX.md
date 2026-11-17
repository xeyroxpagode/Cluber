# 05 — AC30 Acceptance Matrix (V1)

| Gate | Evidencia objetiva | Estado |
|---|---|---|
| AC-01 | Git HEAD/branch/worktree verificado en Q0 | PASS |
| AC-02 | C01–C19 + CC-T05-C10/C19 aplicados | PASS |
| AC-03 | m8.integration · 10 migraciones | PASS |
| AC-04 | t05.integration + J01×3 · DRAFT + Audit | PASS |
| AC-05 | J01×3 · clubWide/teamIds | PASS |
| AC-06 | t05-stress · publicación concurrente e idempotente | PASS |
| AC-07 | t05-stress · NOT-07 dedupe | PASS |
| AC-08 | t05.api · RC-19 por audiencia | PASS |
| AC-09 | J01×3 · Entendido → CMD-COM-12 | PASS |
| AC-10 | t05.api + J01×3 · revision++ y audience inmutable | PASS |
| AC-11 | t05.integration + J01×3 · publishedAt preservado | PASS |
| AC-12 | t05.api + J02×3 · DIRECT canónica | PASS |
| AC-13 | t05.integration + J02×3 · GROUP y archive | PASS |
| AC-14 | t05.api + J03×3 · TEAM/EVENT únicos | PASS |
| AC-15 | m8.integration + t05-stress · intervalos | PASS |
| AC-16 | t05.integration · revocación next-request | PASS |
| AC-17 | t05.api + J04×3 · thread por período | PASS |
| AC-18 | t05.integration + J04×3 · estados honestos | PASS |
| AC-19 | t05-stress · solo autor + Audit | PASS |
| AC-20 | t05.api + J04×3 · tombstone sin body | PASS |
| AC-21 | t05.api · idempotencia de envío | PASS |
| AC-22 | escaneo · 0 tipos prohibidos | PASS |
| AC-23 | t05-stress + escaneo · 0 body en logs/audit/realtime | PASS |
| AC-24 | t05.integration + J04×3 · C19 | PASS |
| AC-25 | RC-06/07/19 con cursor en SQL + J04×3 | PASS |
| AC-26 | J05b (sesión anterior) · SSE/recovery | PASS |
| AC-27 | J01–J04×3 · network real, 0 mocks en UI | PASS |
| AC-28 | J05×3 · 390/768/1440 + ARIA | PASS |
| AC-29 | J02/J04×3 + V1 regresiones | PASS |
| AC-30 | este paquete de evidencia + Git final | PASS |

**Total: 30/30 PASS.**
