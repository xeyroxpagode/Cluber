import fs from "node:fs"
import path from "node:path"
const DIR = path.resolve("evidence/t05-truth-acceptance")
const st = JSON.parse(fs.readFileSync(path.join(DIR, "05_ST80_VERIFIED_RESULTS.json"), "utf8"))
const ac = JSON.parse(fs.readFileSync(path.join(DIR, "06_AC30_VERIFIED_RESULTS.json"), "utf8"))
function tally(results) {
  const out = { PASS: 0, FAIL: 0, BLOCKED: 0, "NOT RUN": 0, "INVALID EVIDENCE": 0 }
  for (const r of Object.values(results)) out[r.status]++
  return out
}
let a = `# 05 — ST80 Verified Results\n\nrunId: ${st.runId} · codeRevision: ${st.head}\n\nEstados calculados por \`tools/truth-verifier.mjs\` desde ejecuciones reales. Sin PASS predeterminado.\n\n`
a += `| ST | Estado | Expectativa | Evidencia / razón |\n|---|---|---|---|\n`
for (const [id, r] of Object.entries(st.results)) {
  const ev = r.criteria?.length ? r.criteria.map((c) => `${c.id}:${c.status}`).join(", ") : r.reason
  a += `| ${id} | ${r.status} | ${r.expected || ""} | ${ev} |\n`
}
const ts = tally(st.results)
a += `\nTotales derivados: ${Object.entries(ts).map(([k, v]) => `${k}=${v}`).join(", ")} · suma=${Object.values(ts).reduce((x, y) => x + y, 0)} de ${Object.keys(st.results).length} registros.\n`
fs.writeFileSync(path.join(DIR, "05_ST80_VERIFIED_RESULTS.md"), a)

let b = `# 06 — AC30 Verified Results\n\nrunId: ${ac.runId} · codeRevision: ${ac.head}\n\nCada gate se aprueba solo si TODOS sus criterios están PASS.\n\n`
b += `| AC | Estado | Criterios |\n|---|---|---|\n`
for (const [id, r] of Object.entries(ac.results)) {
  const ev = r.criteria?.length ? r.criteria.map((c) => `${c.id}:${c.status}`).join(", ") : r.reason
  b += `| AC-${String(id).padStart(2, "0")} | ${r.status} | ${ev} |\n`
}
const ta = tally(ac.results)
b += `\nTotales derivados: ${Object.entries(ta).map(([k, v]) => `${k}=${v}`).join(", ")} · suma=${Object.values(ta).reduce((x, y) => x + y, 0)} de ${Object.keys(ac.results).length} registros.\n`
fs.writeFileSync(path.join(DIR, "06_AC30_VERIFIED_RESULTS.md"), b)
console.log("MD matrices renderizadas")
