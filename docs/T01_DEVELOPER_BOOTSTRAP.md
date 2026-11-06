# T01 local developer bootstrap

## Requirements

- Node.js 22–24 and pnpm 10–12 (`.mise.toml` pins the project toolchain).
- Docker Desktop running.
- Supabase CLI available on `PATH`.

## First run

```powershell
pnpm install --frozen-lockfile
pnpm db:start
pnpm setup:dev
pnpm dev:backend
```

`setup:dev` creates a local ignored `.env` once. It uses CSPRNG-generated 32-byte Base64 values for all HMAC/pepper secrets and never prints them. Re-running it preserves the existing file. To regenerate development secrets intentionally, remove only the local `.env` yourself and run the command again.

In another terminal, run the frontend:

```powershell
pnpm dev:web
```

The browser reaches Fastify through Vite's same-origin `/internal` and `/api` proxy. `http://localhost:3001/internal/live` and `/internal/ready` provide local runtime checks.

## Tests and shutdown

```powershell
pnpm test:all
pnpm db:stop
```

Integration/API tests recreate only the dedicated local `gei_test` database after verifying the fixed GEI local project identity and port. They never target a linked or remote Supabase project.

## Troubleshooting

- `Missing required configuration`: run `pnpm setup:dev`; do not replace secrets with placeholders from `.env.example`.
- Database unavailable: start Docker Desktop, then run `pnpm db:start`.
- Invalid local configuration: correct or deliberately recreate the ignored `.env`; ConfigLoader will fail closed rather than accept missing/weak secrets.
