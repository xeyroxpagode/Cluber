import fs from "node:fs"
import path from "node:path"
import { runNegativeTests } from "../tools/truth-verifier.mjs"

const results = runNegativeTests()
const out = path.resolve("evidence/t05-truth-acceptance/verifier-fixtures/negative-tests.json")
fs.mkdirSync(path.dirname(out), { recursive: true })
fs.writeFileSync(out, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2) + "\n")
for (const r of results) console.log(`${r.ok ? "OK  " : "FAIL"} ${r.id} expected=${r.expected} actual=${r.actual}`)
const failed = results.filter((r) => !r.ok)
console.log(`NEGATIVE TESTS: ${results.length - failed.length}/${results.length} OK`)
process.exitCode = failed.length ? 1 : 0
