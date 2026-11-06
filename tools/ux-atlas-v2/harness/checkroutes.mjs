import { readFileSync, readdirSync } from "node:fs"
import path from "node:path"

const app = readFileSync("src/app/App.tsx", "utf8")
const routes = [...app.matchAll(/path:\s*"([^"]+)"/g)].map((m) => m[1])
console.log("ROUTES EN EL ROUTER (" + routes.length + "):")

const covered = new Set()
function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else if (e.name === "surface-map.md") {
      const md = readFileSync(p, "utf8")
      for (const m of md.matchAll(/\*\*ROUTE:\*\* (.+)/g)) {
        const raw = m[1].trim()
        if (raw.startsWith("N/A")) continue
        covered.add(raw.split(" ")[0].split("?")[0])
      }
    }
  }
}
walk("GEI_CURRENT_UX_ATLAS")

const toRegex = (pattern) =>
  new RegExp(
    "^" +
      pattern
        .split("/")
        .map((seg) =>
          seg.startsWith(":")
            ? "[^/]+"
            : seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        )
        .join("/") +
      "$",
  )

const uncovered = []
for (const r of routes) {
  const re = r === "*" ? /^\/.*$/ : toRegex(r)
  const hit = [...covered].some((c) => re.test(c))
  console.log((hit ? "OK   " : "MISS ") + r)
  if (!hit) uncovered.push(r)
}
console.log(
  "\nSIN COBERTURA: " + (uncovered.length ? uncovered.join(", ") : "ninguna"),
)
console.log("Rutas distintas en el atlas: " + covered.size)
