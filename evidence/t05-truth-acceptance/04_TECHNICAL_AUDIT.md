# 04 — Technical Audit (TRUTH)

codeRevision: `fbcb6b76...`

## M8
5 tablas, FKs, constraints de estado/contexto, 3 índices únicos parciales, exclusión temporal `btree_gist`, C18 y C09 verificados por `m8.integration.test.ts` (14 pruebas) y `t05-truth-gaps.test.ts`.

## DG-13 / C10
DRAFT sin audiencia permitido (C11); audiencia explícita exigida al publicar (C12); `version` para UPDATE; Idempotency-Key = retry; NOT-07 con dedupe en Outbox; corrección con `revision++` y Audit sin Notification; archivado histórico.

## DG-14 / C15 / C19
DIRECT/GROUP/TEAM/EVENT canónicos; intervalos no solapados; reingreso; **lectura histórica corregida** (`allowHistory` en RC-07) manteniendo la escritura con participación activa; `unreadCount` excluye autor; cursor avanza solo con vista autorizada.

## RC-07
Cursor `(sentAt,id)` y `LIMIT` en SQL; filtro temporal en base de datos; sin paginación en memoria. RC-06/19 también con cursor SQL y recheck de audiencia en `EXISTS`.

## Authority / privacidad
ADMIN sin acceso universal (J03); IDOR denegado; `Message.body` redactado en Audit y ausente en logs/realtime; escaneo estático en `t05-truth-gaps.test.ts`.

## Recuperación
Falla de NotificationWriter → rollback sin publicación incoherente (ST-A10); concurrencia real con `Promise.allSettled`; persistencia al abrir nueva conexión (ST-F02); SSE caído y 500 con reintento (J05b).

## Regresiones
367 tests técnicos + 22 E2E sobre el código final, con resultados nativos en `runs/<runId>/*.xml`.
