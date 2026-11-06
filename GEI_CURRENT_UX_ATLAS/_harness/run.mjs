/**
 * GEI CURRENT UX ATLAS — runner de capturas.
 *
 *   node _harness/run.mjs <manifest.mjs> [--only=ID_SUBSTR] [--probe]
 *
 * El manifest exporta un array `surfaces`:
 *   {
 *     id: "HOME_001_DEFAULT",
 *     domain: "01_Home",
 *     dir: "01_Home/Home",              // carpeta relativa dentro del atlas
 *     path: "/home",
 *     actor: "coach",
 *     viewports: ["390", "1440"],        // opcional; default ambos
 *     steps: [...],                     // opcional
 *     fullPage: false,                  // opcional
 *     probe: true                       // opcional
 *   }
 *
 * Escribe:
 *   GEI_CURRENT_UX_ATLAS/<dir>/<ID>_<viewport>.png
 *   GEI_CURRENT_UX_ATLAS/_harness/_probes/<ID>_<viewport>.json
 */

import { mkdirSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { withBrowser, captureSurface, VIEWPORTS } from "./cdp.mjs"

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ATLAS_ROOT = path.resolve(HERE, "..")
const BASE = process.env.GEI_BASE ?? "http://localhost:8443"
const PROBE_DIR = path.join(HERE, "_probes")

const args = process.argv.slice(2)
const manifestArg = args.find((a) => !a.startsWith("--"))
const only = args.find((a) => a.startsWith("--only="))?.split("=")[1]
const noProbe = args.includes("--no-probe")

if (!manifestArg) {
  console.error("uso: node _harness/run.mjs <manifest.mjs> [--only=SUBSTR] [--no-probe]")
  process.exit(1)
}

const manifestPath = path.isAbsolute(manifestArg)
  ? manifestArg
  : path.resolve(process.cwd(), manifestArg)
const manifest = await import(`file://${manifestPath.replace(/\\/g, "/")}`)
const surfaces = manifest.surfaces ?? []

mkdirSync(PROBE_DIR, { recursive: true })

const results = []
let failures = 0

await withBrowser(async ({ send, sleep }) => {
  for (const surface of surfaces) {
    if (only && !surface.id.includes(only)) continue
    const viewports = surface.viewports ?? ["390", "1440"]
    for (const viewport of viewports) {
      const outDir = path.join(ATLAS_ROOT, surface.dir)
      try {
        const result = await captureSurface(send, {
          id: surface.id,
          base: BASE,
          path: surface.path,
          actor: surface.actor,
          viewport,
          steps: surface.steps ?? [],
          outDir,
          fileName: surface.fileName ?? `${surface.id}_${viewport}.png`,
          fullPage: surface.fullPage ?? false,
          probeResult: surface.probe ?? !noProbe,
        })
        if (surface.probe ?? !noProbe) {
          writeFileSync(
            path.join(PROBE_DIR, `${surface.id}_${viewport}.json`),
            JSON.stringify(result.geometry, null, 2),
            "utf8",
          )
        }
        const bad = result.log.filter(
          (l) => typeof l.result === "string" && l.result.startsWith("NOT_FOUND"),
        )
        if (bad.length) failures++
        results.push({
          id: surface.id,
          viewport,
          file: path.relative(ATLAS_ROOT, result.file),
          badSteps: bad.map((b) => `${b.step}:${b.target}`),
        })
        console.log(
          `${bad.length ? "WARN" : "OK  "} ${surface.id}_${viewport} -> ${path.relative(ATLAS_ROOT, result.file)}${bad.length ? `  (not found: ${bad.map((b) => b.target).join(", ")})` : ""}`,
        )
      } catch (error) {
        failures++
        console.error(`FAIL ${surface.id}_${viewport}: ${error.message}`)
      }
    }
  }
})

writeFileSync(
  path.join(PROBE_DIR, "_last-run.json"),
  JSON.stringify({ base: BASE, results }, null, 2),
  "utf8",
)

console.log(`\n${results.length} capturas · ${failures} con pasos fallidos`)
console.log(`Viewports: ${Object.keys(VIEWPORTS).join(", ")}`)
console.log(`Base: ${BASE}`)
