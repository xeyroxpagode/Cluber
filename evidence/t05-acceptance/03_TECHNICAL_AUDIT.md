# 03 — Technical Audit (A1/A2/V1)

## M8 — PostgreSQL
5 tablas (`announcements`, `announcement_target_teams`, `conversations`, `conversation_participants`, `messages`) aplicadas desde baseline aislado (`gei_test`, 10 migraciones). Verificado: FKs, constraints de estado/contexto, 3 índices únicos parciales (DIRECT/TEAM/EVENT), exclusión temporal `btree_gist`, conservación de `published_at` en ARCHIVED (C18), tombstones con `deleted_at`+`deletion_reason`, y `edited_at` preservado en `EDITED→DELETED` (C09). 14 pruebas de integridad (I1) + 105 integration en V1.

## Authority y privacidad
- `assertConversationAccess()` revalida RoleAssignment/TeamAssignment y participación activa en cada request; variables de proyección nunca son security boundary.
- C15: `RC-07` filtra `sent_at >= joined_at` y `< leftAt` **en SQL**; el reingreso crea un intervalo nuevo sin fusionar; la historia de un ex-participante queda acotada a su período. No hay acceso histórico indiscriminado.
- ADMIN sin acceso universal: verificado en J03 (sin composer) y en tests API negativos.
- `Message.body`: redactado en Audit, ausente en logs y en payload realtime (`conversation.changed`). Escaneo: 0 filtraciones.

## RC-07 / paginación (hallazgo A2 corregido)
Antes: `query.execute()` descargaba todos los mensajes y aplicaba cursor/`slice` en memoria. Después: `WHERE (sent_at > cursor OR (sent_at = cursor AND id > cursorId))` y `LIMIT limit+1` en SQL, con orden `(sent_at,id)`. RC-06 y RC-19 también aplican cursor y límite en SQL, con el recheck de audiencia/autoridad movido a `EXISTS`/`IN` en base de datos. Verificado con 25 mensajes y navegación de páginas en J04 (3 navegadores).

## Concurrencia y recuperación
- ST-A08/B03/B11: `Promise.allSettled` sobre transacciones PostgreSQL simultáneas.
- ST-A09/A10: idempotencia con `Idempotency-Key` + hash y NOT-07 en Outbox con dedupe.
- ST-D05: pérdida de respuesta → retry devuelve el mismo `messageId`.
- ST-F07/F08: abort de SSE y 500 simulado → refetch y reintento sin falso éxito (J05b).
- Reinicios del backend durante Q0/V1 con datos persistentes en PostgreSQL.

## C10 / C19
- C10: CREATE/UPDATE DRAFT con `version`, autoridad e Idempotency-Key = retry de la misma operación; DRAFT puede guardarse sin audiencia y la intención se exige al publicar.
- C19: `author_person_id <> viewer` en `unreadCount`; enviar mensaje propio no avanza `lastReadAt` ni marca ajenos.

## Notification Core / Outbox / Audit
Reutilización real sin sistemas paralelos. NOT-07 usa `NotificationService.recordForAudience` + `OutboxWriter.enqueue` en la misma transacción; sin `MESSAGE_RECEIVED` ni `ANNOUNCEMENT_CORRECTED`. Send no genera Audit ni Notification; edit/delete sí con body redactado.

## R21–R26
21 composiciones sobre 6 rutas, sin pantallas paralelas. Todas las acciones visibles están respaldadas por API real. Sin placeholders funcionales. Responsive y ARIA verificados en 390/768/1440 y 3 navegadores.

## Regresiones upstream
Baseline I0: 301 tests locales. V1: 49 unit + 105 integration + 82 API + 102 frontend + 15 stress = **353 técnicos**, 0 fallos. Ninguna regresión T01–T04.

## Diff final
0 `console.log`/`debugger`/`DEBUG_`, 0 secretos versionados, 0 mocks en fuente funcional, 0 cambios fuera del worktree T05.
