# GEI T01 Execution Ledger

Date: 2026-11-03  
Milestone: T01 / DG-00 Runtime Foundation  
Executor status: implementation candidate; final PASS remains Actor B authority.

## Baseline and gate

- Checkout: `C:\Users\thega\Desktop\Gei-Hockey-Managment-System`
- Branch: `gei/v1.1-scope-reconciliation`
- Initial HEAD: `ebba0b8efde9c33da6f785b6b0411204b2fece42`
- Existing UML modifications and untracked atlas/documentation trees were preserved.
- Authority intake: `GEI_ACTOR_A_START_PACKAGE_V1.zip` extracted outside the repository.
- Master Plan V2: Sessions 1–5 present and FROZEN.
- Contract discrepancy: the ZIP Contract is an earlier pre-integrity-closure snapshot on 30 lines (inventory counts/derived references). The checkout Contract and Master Plan agree on the closure inventory: 32 derived values, 34 relationships, 35 invariants, 73 commands, 18 authority rules and 13 side effects. No DG-00 table, algorithm or security policy differs.
- Toolchain used: Node 24.13.0, pnpm 12.15.0, Docker 29.5.3, Compose 5.1.4, Supabase CLI 2.90.0. Project engines support Node 22–24 and pnpm 10–12; `.mise.toml` remains the canonical local pin. A duplicate `packageManager` field was rejected because the current pnpm engine could not resolve that local executable, so it was removed rather than leaving a broken install path.
- Database target: local project `gei-hockey-management-t01`, ports 56320–56324. No linked Supabase project state exists.
- Final resource state: GEI Supabase containers stopped with no retained local database volume after evidence collection.
- Auto-gate: `CURRENT AUTO-GATE — SATISFIED UNDER CONDITIONAL EXECUTION AUTHORIZATION`.

## Unit status

| Unit | Result | Implemented evidence |
|---|---|---|
| U01 Reproducible Platform | VERIFIED | pnpm workspace/lock, protected local DB scripts, CSPRNG/idempotent `setup:dev`, documented local `.env` loading, Supabase config, M0 migration, seed, generated types, isolated `gei_test` recreation |
| U02 HTTP & Transaction Runtime | VERIFIED | config fail-fast, database provider, explicit TransactionRunner, Fastify app, RouteRegistry, RequestContext, stable errors, liveness/readiness |
| U03 Security & Consistency | VERIFIED | Argon2id floor, random/hash/HMAC/constant-time helpers, production cookie contract, Origin/CSRF fail-closed checks, security headers, PostgreSQL RateLimiter and IdempotencyCoordinator composed by RuntimeServices |
| U04 Durable Processing & Operations | VERIFIED | transactional OutboxWriter composed by RuntimeServices, SKIP LOCKED worker, retry/dead-letter, dedicated LISTEN client, RealtimeHub, housekeeping retention, metrics/logging, graceful drain |
| U05 Frontend Integration & Certification | VERIFIED | Vite same-origin proxy, isolated RuntimeStatus consumer, `buildTestRuntime`, real HTTP/proxy proof, frontend regressions, two clean database reproductions |

## PostgreSQL evidence

Final introspection after clean reproduction:

```text
schemas|2
app_tables|0
infra_tables|idempotency_records,outbox_events,rate_limit_windows
browser_app_usage|false|false
browser_infra_usage|false|false
backend_role|superuser=false|createdb=false|createrole=false|login=false
migration|20261103000100
```

M0 implements only S4.07 platform persistence. `auth_sessions` and `email_change_challenges` remain deferred to M2/T03. No T02–T12 product tables were created.

## Test record

| Command/evidence | Result |
|---|---|
| `pnpm install --frozen-lockfile` | PASS; build allowlist limited to `argon2` and `esbuild` |
| `pnpm db:start` from absent local state | PASS |
| `pnpm db:reset` from zero | PASS (repeated) |
| stop `--no-backup` → start second reproduction | PASS |
| `pnpm db:types` | PASS; generated `database.generated.ts` |
| `pnpm typecheck` | PASS |
| `pnpm typecheck:backend` | PASS |
| `pnpm test` | PASS — 96 frontend tests |
| `pnpm test:unit` | PASS — 6 tests |
| `pnpm test:integration` | PASS — 10 tests with recreated real `gei_test` PostgreSQL |
| `pnpm test:api` | PASS — 6 tests with real PostgreSQL |
| `pnpm build:backend` | PASS |
| `pnpm build` | PASS |
| direct `/internal/live`, `/internal/ready`, `/internal/metrics` | PASS |
| temporary Vite `/internal/live` proxy | PASS, real backend response and trace ID |
| production bundle secret-marker scan | PASS — no configured secret/database markers found |

PostgreSQL tests prove limited-role access, browser-role denial, commit/rollback, one evaluation instant, concurrent shared rate limiting, idempotent replay/key conflict/concurrent single effect, outbox retry/recovery/dead-letter/multi-worker safety, commit-time LISTEN notification and technical housekeeping. API tests prove security headers, safe envelopes, readiness degradation, active-request drain and reusable test runtime teardown.

## Final corrective pass

- `COR-T01-01`: `RuntimeServices` now exposes a single composed `RateLimiter`, `IdempotencyCoordinator` and `OutboxWriter`. The composition integration test runs all three through the shared `DatabaseProvider` and `TransactionRunner`, persists a rate window/idempotency record/outbox event, and completes runtime teardown without product identity fixtures.
- `COR-T01-02`: `pnpm setup:dev` creates a CSPRNG-secret local `.env` exactly once; a repeat preserves it. `pnpm dev:backend` uses Node-compatible env-file loading, starts in a clean shell without exported values, and retains ConfigLoader fail-fast behavior for absent/invalid configuration. `docs/T01_DEVELOPER_BOOTSTRAP.md` documents the procedure.

## Acceptance gates

| Gate | Result | Principal evidence |
|---|---|---|
| G01 Bootstrap | PASS | clean stop/start/reset and lockfile install |
| G02 Persistence | PASS | M0 introspection, grants and real PostgreSQL |
| G03 Backend | PASS | backend build and real startup |
| G04 Transport | PASS | route schemas/metadata, real HTTP and safe errors |
| G05 Transactions | PASS | commit/rollback, DB clock and concurrent arbitration |
| G06 Traceability | PASS | server UUID trace IDs and stable envelopes |
| G07 Security | PASS | crypto/cookie/CSRF/Origin/header negative tests |
| G08 Rate limiting | PASS | 20 concurrent attempts: exactly 5 allowed under limit 5 |
| G09 Idempotency | PASS | replay, different-body conflict and one-effect race |
| G10 Outbox | PASS | enqueue/retry/recovery/attempt-10 terminal failure |
| G11 Listener/workers | PASS | commit-time NOTIFY, SKIP LOCKED and polling-capable deterministic batch |
| G12 Shutdown | PASS | active request drains before app close |
| G13 Testing | PASS | isolated real `gei_test`, exact M0, teardown and second reproduction |
| G14 Scope integrity | PASS | zero `app` tables; no product capability added |

## Adversarial reconciliation

- ADV-01/02/26/27: invalid/missing config, weak secrets, unsafe route metadata and production-origin rules fail closed.
- ADV-03/24: readiness returns 503 without dependency details when DB is unavailable.
- ADV-04/05/21: browser schema privileges denied; runtime role is limited.
- ADV-06/07/22/23: M0 recreated from zero and tests use a separately recreated real PostgreSQL database.
- ADV-08/09: rollback and lock/transaction profiles verified.
- ADV-10/11/12: idempotency replay, conflict and concurrent single effect verified.
- ADV-13: shared PostgreSQL rate-limit race verified.
- ADV-14/15: public errors and worker errors are redacted.
- ADV-16/17/18: worker retry, recovery, terminal failure and competing claims verified.
- ADV-19: correctness does not depend on LISTEN; deterministic polling batch processes durable rows.
- ADV-20: active request drains before shutdown completes.
- ADV-25: frontend reports transport failure rather than fake success.

## Residual limitations

- Supabase CLI 2.90.0 emits a development warning that published Docker ports bind to `0.0.0.0`. The stack is local-only by project/port/link policy and is stopped after evidence collection; production must use network controls and non-default credentials.
- Vite reports the preexisting application bundle above 500 KiB. This is a performance warning, not a DG-00 correctness failure.
- Functional login, product sessions, AuthorityService product policies, audit/notification product persistence and authenticated SSE activation remain deliberately owned by T02–T04 and later milestones.
