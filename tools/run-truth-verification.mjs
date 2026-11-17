import fs from "node:fs"
import path from "node:path"
import { parseJUnit, verifyAll, currentHead, sha256 } from "./truth-verifier.mjs"

const ROOT = process.cwd()
const RUN = process.env.TRUTH_RUN || "TRUTH-20261117-143641-e1e83c0c"
const DIR = path.resolve(ROOT, "evidence/t05-truth-acceptance")
const RUN_DIR = path.join(DIR, "runs", RUN)
const head = currentHead(ROOT)
const collectedAt = new Date().toISOString()

const xmls = fs.readdirSync(RUN_DIR).filter((f) => f.endsWith(".xml") && f !== "probe.xml")
const executions = []
for (const f of xmls) {
  const rel = path.posix.join("evidence/t05-truth-acceptance/runs", RUN, f)
  const xml = fs.readFileSync(path.join(RUN_DIR, f), "utf8")
  const label = f.replace(/\.xml$/, "")
  const prePath = path.join(RUN_DIR, `${label}.pre.json`)
  const attested = fs.existsSync(prePath)
  const pre = attested ? JSON.parse(fs.readFileSync(prePath, "utf8")) : null
  const postPath = path.join(RUN_DIR, `${label}.post.json`)
  const post = fs.existsSync(postPath) ? JSON.parse(fs.readFileSync(postPath, "utf8")) : null
  const changed = fs.existsSync(path.join(RUN_DIR, `${label}.INVALID.json`))
  // TRUTH-CLOSE-01: la revisión se toma de la atestación PRE, nunca del HEAD actual.
  const codeRevision = pre?.fingerprint?.head ?? "UNATTESTED"
  const cases = parseJUnit(xml, { runId: RUN, artifactPath: rel, codeRevision, collectedAt })
  for (const c of cases) { c.runnerExitCode = post?.exitCode ?? (pre ? undefined : 1); c.codeChanged = changed }
  executions.push(...cases)
}
fs.writeFileSync(path.join(RUN_DIR, "executions.json"), JSON.stringify({ runId: RUN, head, collectedAt, executions }, null, 2) + "\n")

const artifacts = {}
function addArtifact(rel) {
  const abs = path.resolve(ROOT, rel)
  if (fs.existsSync(abs)) artifacts[rel] = sha256(abs)
}
for (const f of xmls) addArtifact(path.posix.join("evidence/t05-truth-acceptance/runs", RUN, f))
for (const f of fs.readdirSync(path.join(DIR, "screenshots"))) addArtifact(path.posix.join("evidence/t05-truth-acceptance/screenshots", f))
for (const f of fs.readdirSync(path.join(DIR, "logs"))) addArtifact(path.posix.join("evidence/t05-truth-acceptance/logs", f))
addArtifact("evidence/t05-truth-acceptance/verifier-fixtures/negative-tests.json")
fs.writeFileSync(path.join(DIR, "manifest.json"), JSON.stringify({ runId: RUN, generatedAt: collectedAt, head, artifacts }, null, 2) + "\n")

const registry = JSON.parse(fs.readFileSync(path.join(DIR, "registry/scenarios.json"), "utf8"))
const ctx = { executions, head, manifest: artifacts, baseDir: ROOT }
const st = verifyAll(registry.stress, ctx)
const ac = verifyAll(registry.acceptance, ctx)

fs.writeFileSync(path.join(DIR, "05_ST80_VERIFIED_RESULTS.json"), JSON.stringify({ runId: RUN, head, results: st }, null, 2) + "\n")
fs.writeFileSync(path.join(DIR, "06_AC30_VERIFIED_RESULTS.json"), JSON.stringify({ runId: RUN, head, results: ac }, null, 2) + "\n")

function tally(results) {
  const out = { PASS: 0, FAIL: 0, BLOCKED: 0, "NOT RUN": 0, "INVALID EVIDENCE": 0 }
  for (const r of Object.values(results)) out[r.status]++
  return out
}
const stTally = tally(st)
const acTally = tally(ac)
console.log(`HEAD ${head}`)
console.log(`ST (${Object.keys(st).length}):`, JSON.stringify(stTally))
console.log(`AC (${Object.keys(ac).length}):`, JSON.stringify(acTally))
const stSum = Object.values(stTally).reduce((a, b) => a + b, 0)
const acSum = Object.values(acTally).reduce((a, b) => a + b, 0)
if (stSum !== Object.keys(st).length || acSum !== Object.keys(ac).length) {
  console.error("TALLY MISMATCH")
  process.exit(1)
}
