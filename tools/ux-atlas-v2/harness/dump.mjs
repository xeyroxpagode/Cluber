/** Volcado compacto de una sonda para elegir match targets. */
import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const HERE = path.dirname(fileURLToPath(import.meta.url))
const id = process.argv[2]
const vp = process.argv[3] ?? "390"
const file = path.join(HERE, "_probes", `${id}_${vp}.json`)
const j = JSON.parse(readFileSync(file, "utf8"))
console.log(`VIEWPORT ${j.viewport.w}x${j.viewport.h}  DOC ${j.doc.scrollWidth}x${j.doc.scrollHeight}`)
for (const n of j.nodes) {
  const t = String(n.text ?? "").replace(/\s+/g, " ").slice(0, 70)
  console.log(
    `${String(n.depth).padStart(2)} ${n.tag.padEnd(8)} ${(n.role || "-").padEnd(12)} ${(n.type || "-").padEnd(7)} x=${String(n.rect.x).padStart(8)} y=${String(n.rect.y).padStart(8)} w=${String(n.rect.w).padStart(7)} h=${String(n.rect.h).padStart(7)} | ${t}`,
  )
}
