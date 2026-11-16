# GEI T05 R3 — Informe técnico integrado (ETAPA 2)

Actor C — implementación integral DG-13 + DG-14 en una sola sesión continua.
Rama `gei/t05-communication` · baseline `410af42` · worktree `C:\Users\thega\Desktop\Gei-Hockey-T05-Implementation`.

## 1. Veredicto técnico

**IMPLEMENTADO Y VERIFICADO — listo para revisión de Actor B y aceptación global de Actor A.**
No se realizó push, merge ni deploy. La aceptación funcional definitiva corresponde a Actor B + Actor A.

## 2. Fuente autoritativa

ZIP `GEI-T05-R3-PREIMPLEMENTATION-FINAL-APPROVED-DECISIONS.zip`, SHA-256
`42946AA9F11739947848FE26920629E19C2DA0FE4FE7887A2CEB9B8706F74EF2` (verificado).
Se leyeron los 6 documentos finales y el MANIFEST. Decisiones aplicadas: **CC-T05-C10** (UPDATE DRAFT vía CMD-COM-01) y **CC-T05-C19** (unreadCount excluye mensajes propios).

Residuos editoriales detectados y resueltos con fuente superior: ST-E07 y §A-01/§G-01 de documentos finales seguían marcando C19 como pendiente; 05_HANDOFF conservaba "create only" y "push verificado". Se aplicó el contrato final §1.3/§2.6/§9 y la orden de no push.

## 3. Cambios principales

### M8 — Data foundation
`supabase/migrations/20261116000100_m8_communication.sql`: 5 tablas con constraints de estado/contexto/temporalidad, 3 índices únicos parciales, exclusión `gist` (con `btree_gist`), índices de cursor y grants a `gei_backend`. Tipos Kysely en `backend/src/db/types.ts`.

### Backend — `backend/src/communication/`
- 11 comandos + 5 reads, 16 endpoints en `communication-routes.ts`, integrados en `build-runtime.ts`.
- Reutilización real: `AuthorityService`, `AuditWriter`, `NotificationService`, `OutboxWriter`, `IdempotencyCoordinator`, `TransactionRunner`, `resolveEventAudience`, `RealtimeHub`. Sin sistemas paralelos de Notification/Audit.
- Autoridad: ADMIN sin acceso universal; recheck de fuente canónica en cada read/write; participación activa por intervalo.
- Privacidad: `Message.body` redactado en Audit, ausente en logs y en payload realtime; send sin Audit/Notification; edit/delete con Audit.
- C19: `unreadCount` con `author_person_id <> viewer`; cursor avanza solo con vista autorizada del thread.
- C10: CREATE/UPDATE DRAFT con optimistic `version` e Idempotency-Key = retry de la misma operación.

### Frontend — R21–R26
`src/features/communication.tsx` y `src/lib/t05-api.ts`: Hub con 2 tabs y CTA real, creación de DIRECT/GROUP/TEAM/EVENT con candidatos autorizados, formulario de anuncios con audiencia FIRST y corrección con diff, detalle con "Entendido" → CMD-COM-12, chat con composer sticky, estados honestos y paginación real. 0 mocks como fuente funcional. Responsive 390/768/1440 y ARIA.

## 4. Integración y evidencia

- PostgreSQL aislado `gei_test` (10 migraciones) + seed ficticio; backend en puerto 3001; Vite en 8444.
- 7 recorridos E2E reales (J01–J05 + J05b de recuperación), con screenshots en `e2e/screenshots/`.
- ST80 + ST-A01-UPDATE y AC30 ejecutados: `ST80_EXECUTED.md` y `AC30_EXECUTED.md`.
- Regresiones T01–T04: 49 unit + 105 integration + 82 API + 102 frontend, todas verdes. Baseline I0: 301 tests locales; baseline final: 338 (incluye 15 stress y 6 componentes T05 nuevos).

## 5. Seguridad y límites

- Sin `MESSAGE_RECEIVED`, `ANNOUNCEMENT_CORRECTED`, AnnouncementRevision, MessageRevision, Guardian/Eligibility/CompetitionEntry funcionales (escaneo en AC-22/AC-23/ST-F10).
- Sin gestión de participantes GROUP posterior a la creación.
- Sin estados de mensaje Entregado/Leído; check solo tras server ack.
- Sin push/merge/deploy. Sin modificación del baseline T04 ni de sus cambios preexistentes.

## 6. Riesgos residuales

- Los navegadores Edge y Firefox no fueron ejecutados; la evidencia E2E es Chromium (disponibilidad real del entorno).
- El diff visual automatizado se sustituyó por screenshots en 3 viewports + aserciones de presencia/ARIA; no se generó comparación pixelmatch.
- Los datos de prueba son ficticios y viven en `gei_test`; `.env.e2e` no se versiona.
