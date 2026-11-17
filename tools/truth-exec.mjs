import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import { spawnSync } from "node:child_process"

/** Ejecuta un comando de prueba registrando ANTES y DESPUÉS la identidad del código. */
const [runId, label, sep, ...cmd] = process.argv.slice(2)
if (!runId || !label || sep !== "--" || !cmd.length) {
  console.error('usage: node tools/truth-exec.mjs <runId> <label> -- <command ...>')
  process.exit(2)
}
const ROOT = process.cwd()
const DIR = path.resolve(ROOT, "evidence/t05-truth-acceptance")
const RUN = path.join(DIR, "runs", runId)
fs.mkdirSync(RUN, { recursive: true })
fs.mkdirSync(path.join(DIR, "logs"), { recursive: true })

const git = (...args) => {
  try { return spawnSync("git", args, { cwd: ROOT, encoding: "utf8", maxBuffer: 20_000_000 }).stdout.trim() }
  catch { return "" }
}
const relevant = [
  "backend/src", "src", "tests", "tools", "supabase/migrations", "scripts",
  "package.json", "playwright.qa.config.ts", "vitest.config.ts", "backend/vitest.config.ts", "vite.config.ts",
]
function fingerprint() {
  const files = git("ls-files").split("\n").filter((f) => relevant.some((p) => f.startsWith(p))).sort()
  const hashes = {}
  for (const f of files) {
    const abs = path.join(ROOT, f)
    if (!fs.existsSync(abs)) continue
    hashes[f] = crypto.createHash("sha256").update(fs.readFileSync(abs)).digest("hex")
  }
  return {
    head: git("rev-parse", "HEAD"),
    tree: git("rev-parse", "HEAD^{tree}"),
    branch: git("branch", "--show-current"),
    status: git("status", "--short"),
    files: hashes,
  }
}

const pre = { runId, label, startedAt: new Date().toISOString(), command: cmd.join(" "), fingerprint: fingerprint() }
fs.writeFileSync(path.join(RUN, `${label}.pre.json`), JSON.stringify(pre, null, 2) + "\n")

const result = spawnSync(cmd.join(" "), { cwd: ROOT, encoding: "utf8", maxBuffer: 50_000_000, env: process.env, shell: true })
const stdout = result.stdout ?? ""
const stderr = result.stderr ?? ""
fs.writeFileSync(path.join(DIR, "logs", `${label}.log`), stdout + "\n--- STDERR ---\n" + stderr)

const post = { runId, label, finishedAt: new Date().toISOString(), exitCode: result.status ?? -1, fingerprint: fingerprint() }
fs.writeFileSync(path.join(RUN, `${label}.post.json`), JSON.stringify(post, null, 2) + "\n")
const changed = JSON.stringify(pre.fingerprint.files) !== JSON.stringify(post.fingerprint.files)
if (changed) {
  fs.writeFileSync(path.join(RUN, `${label}.INVALID.json`), JSON.stringify({ reason: "code changed during execution", pre: pre.startedAt, post: post.finishedAt }, null, 2) + "\n")
}
console.log(`${label}: exit=${post.exitCode} codeChanged=${changed} head=${pre.fingerprint.head}`)
process.stdout.write(stdout.slice(-2000))
process.exit(result.status ?? 1)
