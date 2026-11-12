import { readFileSync, readdirSync } from "node:fs"
import { resolve } from "node:path"
import pg from "pg"

const root = resolve(".")
const config = readFileSync(resolve(root, "supabase", "config.toml"), "utf8")
if (!config.includes('project_id = "gei-hockey-management-t01"') || !config.includes("port = 56322")) {
  throw new Error("Refusing: GEI local project identity/port is not the frozen target")
}

const adminUrl = "postgresql://postgres:postgres@127.0.0.1:56322/postgres"
const admin = new pg.Client({ connectionString: adminUrl, application_name: "gei-t03-apply" })
await admin.connect()

const migrations = readdirSync(resolve(root, "supabase", "migrations"))
  .filter((file) => /^\d+_.+\.sql$/.test(file))
  .sort()

let applied = 0
let skipped = 0
for (const migration of migrations) {
  try {
    await admin.query(readFileSync(resolve(root, "supabase", "migrations", migration), "utf8"))
    applied++
    console.log(`Applied ${migration}`)
  } catch (e) {
    skipped++
    const msg = e && e.message ? String(e.message).split('\n')[0] : String(e)
    console.log(`Skipped ${migration}: ${msg}`)
  }
}

await admin.end()
console.log(`Applied ${applied}, skipped ${skipped} of ${migrations.length} migrations to postgres`)
