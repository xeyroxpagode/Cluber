# 05 — ST80 Verified Results

runId: TRUTH-20261117-181500-fbcb6b76 · codeRevision: fbcb6b76c0dd590bc70e0dbecf31864f779fc745

Estados calculados por `tools/truth-verifier.mjs` desde ejecuciones reales. Sin PASS predeterminado.

| ST | Estado | Expectativa | Evidencia / razón |
|---|---|---|---|
| ST-A01 | PASS | DRAFT real, Audit YES | draft:PASS |
| ST-A02 | PASS | DRAFT incompleto rechazado, sin escritura parcial | valid:PASS |
| ST-A03 | PASS | Publicar sin SUBCOMMITTEE denegado | deny:PASS |
| ST-A04 | PASS | Club-wide explícito | club:PASS |
| ST-A05 | PASS | Audiencia por Team válida | team:PASS |
| ST-A06 | PASS | TeamSet sin strings libres | teamset:PASS |
| ST-A07 | PASS | Audiencia inexistente rechazada | invalid:PASS |
| ST-A08 | PASS | Publicación concurrente: un único hecho | race:PASS |
| ST-A09 | PASS | Retry publish sin NOT-07 duplicada | retry:PASS |
| ST-A10 | PASS | Falla NotificationWriter sin publicación incoherente | fault:PASS |
| ST-A11 | PASS | Corrección revision++ y Audit sin NOT | correct:PASS |
| ST-A12 | PASS | Corrección de audiencia publicada rechazada | immutable:PASS |
| ST-A13 | PASS | ARCHIVED conserva publishedAt y audiencia | archive:PASS |
| ST-A14 | PASS | Edición de ARCHIVED rechazada | archive-deny:PASS |
| ST-A15 | PASS | URL directa fuera de audiencia → DENY | idor:PASS |
| ST-A16 | PASS | Snapshot no cambia; lectura reconcilia | snapshot:PASS |
| ST-B01 | PASS | DIRECT A-B canónica | direct:PASS |
| ST-B02 | PASS | DIRECT B-A misma ID | direct2:PASS |
| ST-B03 | PASS | Dos DIRECT concurrentes sin duplicado | race:PASS |
| ST-B04 | PASS | DIRECT consigo mismo rechazado | self:PASS |
| ST-B05 | PASS | GROUP mínimo con creador incluido | group:PASS |
| ST-B06 | PASS | GROUP título vacío rechazado | title:PASS |
| ST-B07 | PASS | Participantes repetidos rechazados | dup:PASS |
| ST-B08 | PASS | GROUP cross-división si autorizado | cross:PASS |
| ST-B09 | PASS | TEAM canónica por Team | team:PASS |
| ST-B10 | PASS | EVENT canónica por Event | event:PASS |
| ST-B11 | PASS | Aperturas TEAM concurrentes sin duplicados | race:PASS |
| ST-B12 | PASS | Crear contexto no da acceso a hilos | nouniversal:PASS |
| ST-B13 | PASS | Archivar GROUP preserva historia | archive:PASS |
| ST-B14 | PASS | Archivar no-GROUP rechazado | nogroup:PASS |
| ST-C01 | PASS | Alta de participante con intervalo válido | join:PASS |
| ST-C02 | PASS | Baja con leftAt válido | leave:PASS |
| ST-C03 | PASS | Reingreso: nuevo período no solapado | rejoin:PASS |
| ST-C04 | PASS | Historia anterior a joinedAt no legible | period:PASS |
| ST-C05 | PASS | Historia de período no autorizado no legible | period:PASS |
| ST-C06 | PASS | RoleAssignment revocado → DENY | revoke:PASS |
| ST-C07 | PASS | Transferencia de Team actualiza acceso | transfer:PASS |
| ST-C08 | PASS | Cambio Event targets sincroniza participantes | event:PASS |
| ST-C09 | PASS | Proyección obsoleta no concede acceso | recheck:PASS |
| ST-C10 | PASS | Ex-participante no puede enviar | ex:PASS |
| ST-C11 | PASS | Dos sync simultáneos: integridad de períodos | sync:PASS |
| ST-C12 | PASS | Historia de ex-participante según período | history:PASS |
| ST-D01 | PASS | Envío autorizado → SENT | send:PASS |
| ST-D02 | PASS | No participante → DENY | deny:PASS |
| ST-D03 | PASS | Body vacío rechazado | body:PASS |
| ST-D04 | PASS | Retry idempotente sin duplicación | retry:PASS |
| ST-D05 | PASS | Respuesta perdida tras commit sin duplicar | lost:PASS |
| ST-D06 | PASS | Autor edita SENT → EDITED | edit:PASS |
| ST-D07 | PASS | No autor editar → DENY | notauthor:PASS |
| ST-D08 | PASS | Autor elimina SENT → tombstone | del:PASS |
| ST-D09 | PASS | Autor elimina EDITED → tombstone | del2:PASS |
| ST-D10 | PASS | No autor eliminar → DENY | notauthor:PASS |
| ST-D11 | PASS | Eliminar sin motivo rechazado | reason:PASS |
| ST-D12 | PASS | Editar DELETED rechazado | deleted:PASS |
| ST-D13 | PASS | Eliminar dos veces sin cambio inconsistente | twice:PASS |
| ST-D14 | PASS | Tombstone DTO sin body | dto:PASS |
| ST-D15 | PASS | Sin MESSAGE_RECEIVED | notif:PASS |
| ST-D16 | NOT RUN | UI Sending/Sent/Failed sin estados falsos | sin criterios |
| ST-E01 | PASS | ConversationList sólo autorizadas | list:PASS |
| ST-E02 | PASS | Thread por ID ajeno → DENY | deny:PASS |
| ST-E03 | PASS | Orden determinista con igual sentAt | order:PASS |
| ST-E04 | PASS | lastActivityAt DESC | order:PASS |
| ST-E05 | PASS | unreadCount vs lastReadAt | unread:PASS |
| ST-E06 | PASS | DELETED excluido de unreadCount | deleted:PASS |
| ST-E07 | PASS | C19: propios excluidos, intercalados | c19:PASS |
| ST-E08 | PASS | Notification.readAt por destinatario | read:PASS |
| ST-E09 | PASS | NOT-07 en NotificationList | not07:PASS |
| ST-E10 | PASS | Message.body redactado en Audit.diff | audit:PASS |
| ST-E11 | PASS | Message.body no filtrado en logs | scan:PASS |
| ST-E12 | PASS | Realtime sin body | realtime:PASS |
| ST-F01 | PASS | M8 limpia con constraints | m8:PASS |
| ST-F02 | PASS | Reinicio: datos persisten | persist:PASS |
| ST-F03 | PASS | Dos sesiones browser reales | multi:PASS |
| ST-F04 | PASS | GROUP ≥3 en UI | group3:PASS |
| ST-F05 | PASS | R21–R26 en 390/768/1440 | vp:PASS, vp2:PASS, vp3:PASS |
| ST-F06 | PASS | Composer móvil usable | composer:PASS |
| ST-F07 | PASS | Caída realtime → refetch | recovery:PASS |
| ST-F08 | PASS | Falla API sin éxito falso | recovery:PASS |
| ST-F09 | PASS | Regresión T01–T04 sin fallos | baseline:PASS |
| ST-F10 | PASS | Sin Guardian/Eligibility/CompetitionEntry | scan:PASS |
| ST-A01-UPDATE | PASS | UPDATE DRAFT con versión (CC-T05-C10) | update:PASS |

Totales derivados: PASS=80, FAIL=0, BLOCKED=0, NOT RUN=1, INVALID EVIDENCE=0 · suma=81 de 81 registros.
