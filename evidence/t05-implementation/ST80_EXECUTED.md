# GEI T05 R3 — Matriz ST80 EJECUTADA

80 escenarios originales + suplemento `ST-A01-UPDATE`. Resultados de ejecución real contra PostgreSQL `gei_test`, backend real y navegador Chromium.

| ST | Estado | Evidencia (prueba ejecutada) |
|---|---|---|
| A01 | PASS | t05.integration.test.ts · DG-13 crea DRAFT |
| A01-UPDATE | PASS | t05.integration.test.ts · CC-T05-C10 UPDATE DRAFT version++ |
| A02 | PASS | t05-stress.test.ts · title vacío rechazado |
| A03 | PASS | t05.api.test.ts · PLAYER publish → 403 |
| A04 | PASS | t05.api.test.ts · clubWide explícito |
| A05 | PASS | t05.integration.test.ts · teamIds → announcement_target_teams |
| A06 | PASS | t05.integration.test.ts · audiencia resuelta desde TeamAssignment |
| A07 | PASS | t05-stress.test.ts · INVALID_TEAM (mejora I5) |
| A08 | PASS | t05-stress.test.ts · publicación concurrente 1 éxito/1 conflicto |
| A09 | PASS | t05.api.test.ts · retry publish idempotente + NOT-07 no duplicada |
| A10 | PASS | t05-stress.test.ts · NOT-07 en outbox con dedupe key |
| A11 | PASS | t05.api.test.ts · corrección revision++ sin Notification |
| A12 | PASS | t05-stress.test.ts · audiencia inmutable tras corrección |
| A13 | PASS | t05.integration.test.ts · ARCHIVED conserva publishedAt |
| A14 | PASS | t05.integration.test.ts · corregir ARCHIVED → INVALID_STATE |
| A15 | PASS | t05.api.test.ts · GET detalle ajeno → 403 |
| A16 | PASS | t05.integration.test.ts · RC-19 filtra por TeamAssignment actual |
| B01 | PASS | t05.integration.test.ts · openDirect crea 2 participantes |
| B02 | PASS | t05.api.test.ts · misma conversación desde el otro extremo |
| B03 | PASS | t05.integration.test.ts · sortedPair canónica |
| B04 | PASS | t05.integration.test.ts · self DIRECT → VALIDATION |
| B05 | PASS | t05.integration.test.ts · GROUP creador auto-incluido |
| B06 | PASS | t05-stress.test.ts · title vacío → BODY_REQUIRED |
| B07 | PASS | t05-stress.test.ts · participantes duplicados → DUPLICATE_PARTICIPANT |
| B08 | PASS | E2E J02 · GROUP real en navegador |
| B09 | PASS | t05.api.test.ts · TEAM canónica por teamId |
| B10 | PASS | t05.integration.test.ts · EVENT canónica por eventId |
| B11 | PASS | t05-stress.test.ts · apertura TEAM concurrente → 1 conversación |
| B12 | PASS | E2E J03 · SUBCOMMITTEE crea pero no lee |
| B13 | PASS | t05.integration.test.ts · archive GROUP preserva historia |
| B14 | PASS | t05.integration.test.ts · archive DIRECT → NOT_GROUP |
| C01 | PASS | t05.integration.test.ts · sync crea participante con joinedAt |
| C02 | PASS | t05.integration.test.ts · revocación: acceso DENY en siguiente request |
| C03 | PASS | m8.integration.test.ts · reingreso, 2 intervalos no solapados |
| C04 | PASS | t05.integration.test.ts · thread filtra sentAt >= joinedAt |
| C05 | PASS | t05.integration.test.ts · thread filtra sentAt < leftAt |
| C06 | PASS | t05.integration.test.ts · RoleAssignment expirado → DENY |
| C07 | PASS | t05.integration.test.ts · sync cierra/abre intervalos |
| C08 | PASS | t05-stress.test.ts · sync EVENT (targets) |
| C09 | PASS | t05.integration.test.ts · recheck fuente canónica |
| C10 | PASS | t05.integration.test.ts · ex-participante enviar → NOT_PARTICIPANT |
| C11 | PASS | m8.integration.test.ts · intervalos válidos bajo constraints |
| C12 | PASS | t05-stress.test.ts · reingreso preserva historia |
| D01 | PASS | t05.integration.test.ts · send → SENT |
| D02 | PASS | t05.api.test.ts · no participante → 403 |
| D03 | PASS | t05-stress.test.ts · body vacío → BODY_REQUIRED |
| D04 | PASS | t05.api.test.ts · retry con Idempotency-Key → 1 mensaje |
| D05 | PASS | t05.api.test.ts · retry retorna mismo messageId |
| D06 | PASS | t05.api.test.ts · edit → EDITED + editedAt |
| D07 | PASS | t05-stress.test.ts · no autor edit → NOT_AUTHOR |
| D08 | PASS | t05.integration.test.ts · SENT → DELETED tombstone |
| D09 | PASS | t05.integration.test.ts · EDITED → DELETED preserva edited_at |
| D10 | PASS | t05-stress.test.ts · no autor delete → NOT_AUTHOR |
| D11 | PASS | t05-stress.test.ts · delete sin reason rechazado |
| D12 | PASS | t05.integration.test.ts · edit DELETED → MESSAGE_DELETED |
| D13 | PASS | t05.integration.test.ts · delete DELETED idempotente |
| D14 | PASS | t05.api.test.ts · DTO tombstone sin body |
| D15 | PASS | t05-stress.test.ts · sin MESSAGE_RECEIVED / Notification |
| D16 | PASS | E2E J04 · estados de envío honestos en navegador |
| E01 | PASS | t05.integration.test.ts · RC-06 solo conversaciones autorizadas |
| E02 | PASS | t05-stress.test.ts · thread ajeno → DENY |
| E03 | PASS | t05-stress.test.ts · orden determinista (sentAt,id) |
| E04 | PASS | t05-stress.test.ts · lastActivityAt DESC |
| E05 | PASS | t05.integration.test.ts · unreadCount > lastReadAt |
| E06 | PASS | t05.integration.test.ts · DELETED excluido de unread |
| E07 | PASS | t05.integration.test.ts · CC-T05-C19 propios excluidos |
| E08 | PASS | t05-components.test.tsx · Notification mark-read |
| E09 | PASS | t05.api.test.ts · NOT-07 en /api/notifications |
| E10 | PASS | t05-stress.test.ts · Audit diff sin body |
| E11 | PASS | escaneo estático · 0 body en logs |
| E12 | PASS | t05-stress.test.ts · payload realtime sin body |
| F01 | PASS | m8.integration.test.ts · 10 migraciones, constraints e índices |
| F02 | PASS | reinicio backend durante I4/I5 · datos persisten en PostgreSQL |
| F03 | PASS | E2E J02/J04 · 2 identidades reales en navegador |
| F04 | PASS | E2E J02 · GROUP 3 participantes |
| F05 | PASS | E2E J05 · screenshots 390/768/1440 |
| F06 | PASS | t05-components.test.tsx · composer sticky real |
| F07 | PASS | E2E J05b · SSE abortado → refetch autorizado |
| F08 | PASS | E2E J05b · 500 simulado → error + reintento, sin falso éxito |
| F09 | PASS | regresiones T01–T04: 49 unit + 105 integration + 82 API + 102 frontend |
| F10 | PASS | escaneo estático · 0 Guardian/Eligibility/CompetitionEntry funcionales |

**Total: 80 originales PASS + 1 suplementario PASS.**
