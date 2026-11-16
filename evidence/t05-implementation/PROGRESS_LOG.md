# GEI T05 R3 — Registro de avance I0→I6 (única sesión)

Actor C — ETAPA 2: Implementación integral DG-13 + DG-14.
Worktree: `C:\Users\thega\Desktop\Gei-Hockey-T05-Implementation`
Rama: `gei/t05-communication` · Baseline: `410af4247b5573448674e98b07b49fde940e7fde`

---

## I0 — PREFLIGHT Y BASELINE

### Evidencia confirmada
- ZIP autoritativo: `C:\Users\thega\Desktop\GEI-T05-R3-PREIMPLEMENTATION-FINAL-APPROVED-DECISIONS.zip`
- SHA-256 verificado: `42946AA9F11739947848FE26920629E19C2DA0FE4FE7887A2CEB9B8706F74EF2` (coincide con el reportado).
- Extraído a `C:\Users\thega\AppData\Local\Temp\opencode\T05-PREIMPL` (44 archivos). Leídos íntegramente los 6 documentos finales + MANIFEST.
- Repo original: `C:\Users\thega\Desktop\Gei-Hockey-Managment-System`, branch `gei/t04-participation-operations`, HEAD `410af42...`, remoto `https://github.com/xeyroxpagode/Gei-Hockey-System-Managment.git`.
- Cambios preexistentes del original preservados: `.gitignore` (M) y untracked `.egm-review-inputs/`, `.opencode/`, `backend-*.txt`, `frontend-*.txt`, `docs/GEI_OPENCODE_EGM_INSTALLATION.md`, `playwright-report/`, `test-results/`, `tests/e2e/debug-login.spec.ts`. **No se modificaron.**
- Worktree T05 creado desde `410af42` (no existía previamente; rama no existía). OpenCode operando desde su raíz (verificado por `git rev-parse --show-toplevel` y entorno de sesión).
- Config local reproducida de forma acotada: `.env` copiado del original (ignorado por git) y junction de `node_modules` al original (solo lectura). Sin secretos nuevos ni cambios en el repo protegido.
- PostgreSQL: Docker local Supabase, `127.0.0.1:56322`, proyecto `gei-hockey-management-t01`.
  - DB `postgres`: historial `supabase_migrations.schema_migrations` = M0,M1,M2,M3,M4,M5,M6,M9,M7 (9 migraciones; orden real confirmado). No se escribió aquí.
  - DB `gei_test`: aislada, datos ficticios (`api-…@example.com`), 36 tablas app/infra, extensión `btree_gist` disponible. `test-config.ts` valida destino `127.0.0.1:56322/gei_test`.
  - Mecanismo recuperable: `node scripts/test-db.mjs prepare` hace DROP/CREATE de `gei_test` desde M0–M7+M9 + seed.sql.
- Frontend vigente: React 19 + Vite 8 + Tailwind v4; `src/features/communication.tsx` con placeholders R21–R26.
- Backend vigente: Fastify 5 + Kysely + PostgreSQL; módulos T01–T04 completos, sin `communication`.

### Consistentencia de entrada — hallazgos editoriales (registrados, no bloqueantes)
1. `03_EXECUTION_AND_ACCEPTANCE_MATRIX.md` ST-E07 dice "PENDING C19 — requiere Change Control". Resuelto por fuente superior: CC-T05-C19 APROBADO + contrato §2.6/§7.2/§9. Se ejecutará con exclusión de mensajes propios.
2. `04_ADVERSARIAL_ANALYSIS.md` §A-01, §G-01, §3 (tabla resumen y "Bloqueos Críticos") conservan C19 como abierto. Su propia §5 y §4 dicen 0 bloqueos y C10/C19 aprobados → se aplica la decisión aprobada.
3. `05_SINGLE_B_TO_C_HANDOFF.md` §3.1 dice CMD-COM-01 "create only"; §3.2 y §9 mantienen "C19 pendiente"; §10.1 exige "push remoto verificado". Se resuelve con contrato §1.3 (CREATE/UPDATE DRAFT), CC-T05-C19 y la orden del usuario (sin push/merge/deploy).
4. `MANIFEST_T05_R3.json` `status: READY_FOR_B_INTAKE_NOT_READY_TO_BUILD` refleja el estado A→B pre-revisión; los 6 documentos finales y la autorización del Actor A prevalecen.

### Conteos contractuales verificados
- ST originales: A01..A16 (16) + B01..B14 (14) + C01..C12 (12) + D01..D16 (16) + E01..E12 (12) + F01..F10 (10) = **80**. `ST-A01-UPDATE` es suplementario.
- AC originales: **30** (AC-01..AC-30). Backlog: **19** tareas. C01–C19: 0 decisiones pendientes.

### Baseline de tests T04 — EJECUTADO (sin modificar tests)
| Comando | Archivos | Tests | Resultado | Log |
|---------|----------|-------|-----------|-----|
| `pnpm test` (frontend/vitest jsdom) | 5 | 96 | 96 PASS, 0 FAIL | `raw/baseline-frontend.log` |
| `pnpm test:unit` (backend unit) | 4 | 49 | 49 PASS, 0 FAIL | `raw/baseline-backend-unit.log` |
| `pnpm test:integration` (backend, gei_test reconstruida desde 9 migraciones) | 6 | 80 | 80 PASS, 0 FAIL | `raw/baseline-backend-integration.log` |
| `pnpm test:api` (backend, gei_test reconstruida desde 9 migraciones) | 3 | 76 | 76 PASS, 0 FAIL | `raw/baseline-backend-api.log` |
| **Total ejecutable en I0** | **18** | **301** | **301 PASS, 0 FAIL, 0 fallos preexistentes** | — |

Nota: el reporte T04 citaba 349/349 incluyendo suites E2E/Playwright, no ejecutadas en I0 (requieren servidores). Se ejecutarán en I5. Baseline real registrado: 301 tests locales + E2E pendiente.

### Estado I0
**PASS** — repo/rama/base correctos, worktree aislado, documentos íntegros, DB segura y recuperable, plan de pruebas reproducible, agente operando desde el worktree correcto. Continué automáticamente con I1.

---

## I1 — DATA FOUNDATION Y M8

### Implementado
- `supabase/migrations/20261116000100_m8_communication.sql`: 5 tablas (`announcements`, `announcement_target_teams`, `conversations`, `conversation_participants`, `messages`), constraints de estado/contexto/temporalidad, 3 índices únicos parciales, exclusion constraint `gist` (con `CREATE EXTENSION IF NOT EXISTS btree_gist`), índices de cursor y grants a `gei_backend` + revoke a public/anon/authenticated.
- `backend/src/db/types.ts`: 5 interfaces y sus claves en `DatabaseSchema` para Kysely.
- `ck_conversations__context` agregada (el contrato §4.1 la describía en prosa pero no la declaraba; I1 exige impedir identidades contextuales nulas/incompatibles).

### Correctivo C1 — M8 / `ck_messages__edited`
- **Fallo reproducido**: `EDITED → DELETED` violaba `ck_messages__edited`, porque el constraint contractual exigía `edited_at IS NULL` para todo estado ≠ EDITED. Contradice C09 y SM-MESSAGE-01 (delete permitido desde EDITED; tombstone preserva historia) y ST-D09.
- **Causa**: redacción literal del constraint en contrato §4.1, no una decisión de producto.
- **Corrección mínima**: permitir `edited_at` en `DELETED` (`state='DELETED' and deleted_at is not null`) sin relajar `SENT sin edited_at` ni `EDITED con edited_at`. No se eliminó el constraint.
- **Revalidación**: test `Messages > persiste SENT → EDITED → DELETED con tombstone` verifica `edited_at` conservado. 14/14 PASS.

### Pruebas ejecutadas (PostgreSQL real `gei_test`, reconstruida desde 10 migraciones)
`npx vitest run --config backend/vitest.config.ts m8.integration.test` → **14/14 PASS** (`raw/i1-m8-schema.log`).
Cobertura: tablas/índices/extensión; DRAFT/PUBLISHED/ARCHIVED con publishedAt conservado; título/cuerpo vacíos rechazados; publicación sin metadatos rechazada; audiencia única y FK; DIRECT canónica y duplicados; identidades contextuales inválidas; TEAM/EVENT únicos; GROUP archivable; reingreso con 2 intervalos; solapamiento rechazado (`23P01`); `left_at <= joined_at` rechazado; SENT→EDITED→DELETED con `edited_at` preservado; estados incoherentes, body vacío y FKs inválidos rechazados.

### Estado I1
**PASS** — migración real aplicada y validada; integridad demostrada con ejecución, no inspección textual. Continué con I2.

---

## I2 — BACKEND, API Y AUTHORITY

### Implementado
- `backend/src/communication/`: `types.ts`, `announcements.ts` (CMD-COM-01..04), `conversations.ts` (05..08), `messages.ts` (09..11), `queries.ts` (RC-06/07/19/26/27), `sync.ts` (sync TEAM/EVENT + `assertConversationAccess` con recheck), `read-cursor.ts`, `communication-routes.ts` (16 endpoints), `m8.integration.test.ts`, `t05.integration.test.ts`, `t05.api.test.ts`.
- Reutilización real (sin sistemas paralelos): `AuthorityService.snapshot`, `AuditWriter.record` (body siempre redactado), `NotificationService.recordForAudience` (NOT-07 con dedupe `resourceId|recipient|type`), `OutboxWriter.enqueue`, `IdempotencyCoordinator.acquire/succeed`, `TransactionRunner`, `resolveEventAudience`/`unionAudiences`, `RealtimeHub` vía `invalidate[]`.
- Integrado en `build-runtime.ts` y `testing/test-app.ts`.

### Decisiones aplicadas
- **CC-T05-C10**: `CMD-COM-01` hace CREATE (announcementId ausente) o UPDATE de DRAFT (announcementId presente) con optimistic lock `version` y Audit de la operación. Idempotency-Key = retry de la misma operación (hash + scope por operación), no upsert funcional.
- **CC-T05-C19**: `unreadCount` = `COUNT(messages WHERE sent_at > COALESCE(last_read_at,joined_at) AND state<>'DELETED' AND author_person_id<>viewer)`. Enviar mensaje propio no avanza cursor; el cursor avanza solo con vista autorizada del thread (`touchConversationReadCursor`).

### Seguridad
- ADMIN no tiene acceso universal: RC-06/07/26/27 y TEAM/EVENT revalidan fuente canónica + participación activa en cada request (ST-B12, COM-015).
- `Message.body` nunca en Audit (redactado), logs ni payload realtime (`conversation.changed` sin body). Enviar mensaje no crea Audit ni Notification.
- Tombstone irreversible; `EDITED→DELETED` conserva `edited_at` (correctivo I1).

### Correctivos I2
1. `source: "communication"` violaba `ck_audit_entries__source` → se usa el operationId (`CMD-COM-0X`). Causa: constraint M2 no documentado en el contrato T05. Revalidado en integración y API.
2. `touchConversationReadCursor` dentro de `READ_STANDARD` (read-only) fallaba → RC-07 usa `COMMAND_STANDARD`. Causa: perfil transaccional incorrecto. Revalidado.
3. `createSessionFor` por test duplicaba cuenta (`uq_accounts__person_id`) → caché de sesiones por persona en el test API. Causa: diseño del fixture de prueba, no del producto.
4. `foundation.integration.test.ts` asumía "no future tables" → se actualizó la lista esperada a 36 tablas app (31 + 5 de M8). No se relajaron grants.

### Pruebas ejecutadas (PostgreSQL real `gei_test`)
| Suite | Tests | Resultado | Log |
|-------|-------|-----------|-----|
| `pnpm test:unit` | 49 | 49 PASS | — |
| `pnpm test:integration` (T04 + M8 + T05) | 105 | 105 PASS | `raw/i2-all-integration.log` |
| `pnpm test:api` (T04 + T05) | 82 | 82 PASS | `raw/i2-all-api.log` |
| T05 integración focalizada | 11 | 11 PASS | `raw/i2-t05-integration.log` |
| T05 API focalizada | 6 | 6 PASS | `raw/i2-t05-api.log` |
| `pnpm typecheck:backend` | — | PASS | — |

### Estado I2
**PASS** — backend funcionalmente integrado y verificado contra PostgreSQL real. Continúo con I3.
