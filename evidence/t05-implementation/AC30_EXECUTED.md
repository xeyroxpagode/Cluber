# GEI T05 R3 — Matriz AC30 EJECUTADA

30 gates con evidencia objetiva de ejecución.

| Gate | Estado | Evidencia |
|---|---|---|
| AC-01 | PASS | git rev-parse HEAD/branch + worktree (I0) |
| AC-02 | PASS | revisión C01–C19 + hallazgos editoriales registrados (I0) |
| AC-03 | PASS | m8.integration.test.ts · 10 migraciones desde baseline |
| AC-04 | PASS | t05.integration.test.ts · DRAFT + Audit |
| AC-05 | PASS | t05.api.test.ts · clubWide/teamIds explícitos |
| AC-06 | PASS | t05-stress.test.ts · publicación concurrente e idempotente |
| AC-07 | PASS | t05-stress.test.ts · NOT-07 dedupe en outbox |
| AC-08 | PASS | t05.api.test.ts · RC-19 por audiencia |
| AC-09 | PASS | t05-components.test.tsx + E2E J01 · Entendido → CMD-COM-12 |
| AC-10 | PASS | t05.api.test.ts · revision++ y audience congelada |
| AC-11 | PASS | t05.integration.test.ts · publishedAt preservado |
| AC-12 | PASS | t05.integration.test.ts · DIRECT canónica |
| AC-13 | PASS | t05.integration.test.ts · GROUP ≥2 y archive only GROUP |
| AC-14 | PASS | t05.api.test.ts · TEAM/EVENT 1 por recurso |
| AC-15 | PASS | m8.integration.test.ts · intervalos join/leave/rejoin |
| AC-16 | PASS | t05.integration.test.ts · revocación next-request DENY |
| AC-17 | PASS | t05.api.test.ts · RC-07 privacidad por período |
| AC-18 | PASS | t05.integration.test.ts + E2E J04 · estados persistidos y UI honesta |
| AC-19 | PASS | t05-stress.test.ts · solo autor + Audit |
| AC-20 | PASS | t05.api.test.ts · tombstone irreversible sin body |
| AC-21 | PASS | t05.api.test.ts · idempotencia de envío |
| AC-22 | PASS | escaneo estático y runtime · 0 tipos prohibidos |
| AC-23 | PASS | t05-stress.test.ts + escaneo · 0 body en logs/audit/realtime/errores |
| AC-24 | PASS | t05.integration.test.ts · lastReadAt/unreadCount con C19 |
| AC-25 | PASS | t05.integration.test.ts · cursor (sentAt,id) real |
| AC-26 | PASS | E2E J05b · SSE caído + refetch autorizado |
| AC-27 | PASS | E2E J01–J04 · 0 mocks en UI (network real) |
| AC-28 | PASS | E2E J05 + t05-components · 390/768/1440 y ARIA |
| AC-29 | PASS | E2E J02/J04 + regresiones T01–T04 |
| AC-30 | PASS | este paquete de evidencia + SHA final (I6) |

**Total: 30/30 PASS.**
