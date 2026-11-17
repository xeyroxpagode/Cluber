# 04 — ST80 Execution Matrix (V1, evidence-based)

80 originales + suplemento. Cada fila vincula la expectativa a una prueba ejecutada en V1.

| ST | Expectativa verificada | Evidencia | Estado |
|---|---|---|---|
| A01 | DRAFT creado con Audit | t05.integration · DG-13 crea DRAFT | PASS |
| A01-UPDATE | UPDATE DRAFT con version++ (CC-T05-C10) | t05.integration · CC-T05-C10 + J01×3 | PASS |
| A02 | DRAFT sin title/body rechazado | t05-stress · title vacío | PASS |
| A03 | PLAYER publicar → 403 | t05.api · PLAYER publish 403 | PASS |
| A04 | clubWide explícito | J01×3 + t05.api | PASS |
| A05 | teamIds → announcement_target_teams | t05.integration · audiencia por equipos | PASS |
| A06 | audiencia por TeamSet canónico | t05.integration · targetTeam persistido | PASS |
| A07 | equipo inexistente → INVALID_TEAM | t05-stress · INVALID_TEAM | PASS |
| A08 | publicación concurrente 1 éxito/1 conflicto | t05-stress · Promise.allSettled | PASS |
| A09 | retry publish idempotente, NOT-07 no duplicada | t05.api · publish retry | PASS |
| A10 | NOT-07 en outbox con dedupe key | t05-stress · dedupe `${id}|${recipient}|ANNOUNCEMENT_PUBLISHED` | PASS |
| A11 | corrección title/body + revision++, sin NOT | t05.api + J01×3 | PASS |
| A12 | audiencia inmutable en corrección | t05-stress · targets antes/después | PASS |
| A13 | ARCHIVED conserva publishedAt | t05.integration + J01×3 | PASS |
| A14 | corregir ARCHIVED → INVALID_STATE | t05.integration | PASS |
| A15 | detalle ajeno → 403 | t05.api · GET detalle | PASS |
| A16 | RC-19 reevalúa TeamAssignment actual | t05.integration · filtro audiencia | PASS |
| B01 | DIRECT crea 2 participantes | t05.integration + J02×3 | PASS |
| B02 | misma conversación desde el otro extremo | t05.api + J02×3 | PASS |
| B03 | sortedPair canónica | t05.integration | PASS |
| B04 | self DIRECT → VALIDATION | t05.integration | PASS |
| B05 | GROUP ≥2 con creador incluido | t05.integration + J02×3 | PASS |
| B06 | título vacío → BODY_REQUIRED | t05-stress | PASS |
| B07 | participantes duplicados → DUPLICATE_PARTICIPANT | t05-stress | PASS |
| B08 | GROUP cross-división | t05.api + J02×3 | PASS |
| B09 | TEAM 1 por teamId | t05.api + J03×3 | PASS |
| B10 | EVENT 1 por eventId | t05.integration + J03×3 | PASS |
| B11 | apertura TEAM concurrente → 1 | t05-stress · Promise.allSettled | PASS |
| B12 | crear contexto ≠ leer mensajes | J03×3 · SUBCOMMITTEE sin composer | PASS |
| B13 | archive GROUP preserva historia | t05.integration | PASS |
| B14 | archive no-GROUP → NOT_GROUP | t05.integration | PASS |
| C01 | sync crea participante con joinedAt | t05.integration | PASS |
| C02 | revocación → DENY siguiente request | t05.integration | PASS |
| C03 | reingreso = intervalo nuevo | m8.integration + t05-stress | PASS |
| C04 | thread filtra sentAt >= joinedAt | t05.integration | PASS |
| C05 | thread filtra sentAt < leftAt | t05.integration | PASS |
| C06 | RoleAssignment expirado → DENY | t05.integration | PASS |
| C07 | sync cierra/abre intervalos | t05.integration | PASS |
| C08 | sync EVENT por targets | t05-stress | PASS |
| C09 | recheck fuente canónica | t05.integration | PASS |
| C10 | ex-participante enviar → NOT_PARTICIPANT | t05.integration | PASS |
| C11 | sin solapamiento bajo concurrencia | m8.integration · exclusion gist | PASS |
| C12 | historia acotada al período | t05-stress | PASS |
| D01 | send → SENT | t05.integration + J04×3 | PASS |
| D02 | no participante → 403 | t05.api | PASS |
| D03 | body vacío → BODY_REQUIRED | t05-stress | PASS |
| D04 | retry con key → 1 mensaje | t05.api + t05-stress | PASS |
| D05 | pérdida de respuesta → mismo messageId | t05.api · retry | PASS |
| D06 | edit → EDITED + editedAt | t05.api + J04×3 | PASS |
| D07 | no autor edit → NOT_AUTHOR | t05-stress | PASS |
| D08 | SENT → DELETED tombstone | t05.integration | PASS |
| D09 | EDITED → DELETED preserva edited_at | m8.integration + t05.integration | PASS |
| D10 | no autor delete → NOT_AUTHOR | t05-stress | PASS |
| D11 | delete sin reason rechazado | t05-stress | PASS |
| D12 | edit DELETED → MESSAGE_DELETED | t05.integration | PASS |
| D13 | delete DELETED idempotente | t05.integration | PASS |
| D14 | DTO tombstone sin body | t05.api + J04×3 | PASS |
| D15 | sin MESSAGE_RECEIVED | t05-stress + escaneo | PASS |
| D16 | UI estados honestos de envío | J04×3 | PASS |
| E01 | RC-06 solo autorizadas | t05.integration | PASS |
| E02 | thread ajeno → DENY | t05-stress + J03×3 | PASS |
| E03 | orden (sentAt,id) | t05-stress + J04×3 | PASS |
| E04 | lastActivityAt DESC | t05-stress + J05×3 | PASS |
| E05 | unread > lastReadAt | t05.integration | PASS |
| E06 | DELETED excluido de unread | t05.integration · C19 | PASS |
| E07 | C19 propios excluidos + intercalados | t05.integration + J04×3 | PASS |
| E08 | notification mark-read | J01×3 | PASS |
| E09 | NOT-07 en /api/notifications | J01×3 + t05.api | PASS |
| E10 | Audit diff sin body | t05-stress + t05.integration | PASS |
| E11 | 0 body en logs | escaneo estático | PASS |
| E12 | realtime sin body | t05-stress · payload conversation.changed | PASS |
| F01 | M8 5 tablas + constraints | m8.integration · 14 pruebas | PASS |
| F02 | persistencia tras reinicio | reinicios de backend en Q0/V1 con datos del seed | PASS |
| F03 | multi-usuario real en navegador | J02/J04 ×3 navegadores | PASS |
| F04 | GROUP ≥3 | J02×3 · grupo con 3 participantes | PASS |
| F05 | responsive 390/768/1440 | J05×3 · window.innerWidth verificado | PASS |
| F06 | composer sticky móvil | J05×3 + t05-components | PASS |
| F07 | SSE caído → refetch | t05-journeys J05b (sesión anterior) + useCommunicationRefresh | PASS |
| F08 | 500 → error + reintento | t05-journeys J05b (sesión anterior) | PASS |
| F09 | regresiones T01–T04 | V1-unit/integration/api/frontend | PASS |
| F10 | 0 Guardian/Eligibility/CompetitionEntry | escaneo estático | PASS |

**Total: 80/80 originales PASS + 1 suplemento PASS.**
