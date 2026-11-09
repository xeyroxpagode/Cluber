import { readFileSync, readdirSync } from "node:fs"
import { resolve } from "node:path"
import pg from "pg"

if (process.argv[2] !== "prepare") throw new Error("Usage: node scripts/test-db.mjs prepare")
const root = resolve(import.meta.dirname, "..")
const config = readFileSync(resolve(root, "supabase", "config.toml"), "utf8")
if (!config.includes('project_id = "gei-hockey-management-t01"') || !config.includes("port = 56322")) {
  throw new Error("Refusing test reset: GEI local project identity/port is not the frozen target")
}

const adminUrl = "postgresql://postgres:postgres@127.0.0.1:56322/postgres"
const testUrl = "postgresql://postgres:postgres@127.0.0.1:56322/gei_test"
const admin = new pg.Client({ connectionString: adminUrl, application_name: "gei-test-bootstrap" })
await admin.connect()
const identity = await admin.query("select current_database() database, current_user role")
if (identity.rows[0]?.database !== "postgres" || identity.rows[0]?.role !== "postgres") throw new Error("Refusing test reset: unexpected database identity")
await admin.query("select pg_terminate_backend(pid) from pg_stat_activity where datname='gei_test' and pid <> pg_backend_pid()")
await admin.query("drop database if exists gei_test")
await admin.query("create database gei_test template template0 encoding 'UTF8'")
await admin.end()

const test = new pg.Client({ connectionString: testUrl, application_name: "gei-test-migrations" })
await test.connect()
const migrations = readdirSync(resolve(root, "supabase", "migrations"))
  .filter((file) => /^\d+_.+\.sql$/.test(file))
  .sort()
for (const migration of migrations) {
  await test.query(readFileSync(resolve(root, "supabase", "migrations", migration), "utf8"))
}
await test.query(readFileSync(resolve(root, "supabase", "seed.sql"), "utf8"))
await test.end()
console.log(`Prepared isolated PostgreSQL database gei_test from ${migrations.length} migration(s)`)
