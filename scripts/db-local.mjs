import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { spawnSync } from "node:child_process"
import { resolve } from "node:path"

const action = process.argv[2]
const root = resolve(import.meta.dirname, "..")
const configPath = resolve(root, "supabase", "config.toml")
const config = readFileSync(configPath, "utf8")

if (!config.includes('project_id = "gei-hockey-management-t01"') || !config.includes("port = 56322")) {
  throw new Error("Refusing database operation: GEI local project identity/port is not the frozen safe target")
}

for (const linkedState of [resolve(root, "supabase", ".temp", "project-ref"), resolve(root, ".supabase", "project-ref")]) {
  if (existsSync(linkedState)) {
    throw new Error(`Refusing database operation: linked Supabase state exists at ${linkedState}`)
  }
}

const commands = {
  start: ["start"],
  reset: ["db", "reset", "--local"],
  types: ["gen", "types", "typescript", "--local", "--schema", "app,infra"],
  stop: ["stop", "--no-backup"],
}

if (!(action in commands)) throw new Error("Usage: node scripts/db-local.mjs <start|reset|types|stop>")

const executable = process.platform === "win32" ? "supabase.exe" : "supabase"
const result = spawnSync(executable, commands[action], {
  cwd: root,
  stdio: action === "types" ? ["ignore", "pipe", "inherit"] : "inherit",
  encoding: action === "types" ? "utf8" : undefined,
})
if (result.error) throw result.error
if (action === "types" && result.status === 0) {
  const target = resolve(root, "backend", "src", "db", "database.generated.ts")
  writeFileSync(target, result.stdout, "utf8")
  console.log(`Generated ${target}`)
}
process.exitCode = result.status ?? 1
