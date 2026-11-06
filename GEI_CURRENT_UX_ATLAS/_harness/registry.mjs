/** Registro único de superficies: id → dir, ruta, actor, pasos. */
import { readdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const HERE = path.dirname(fileURLToPath(import.meta.url))
const MANIFEST_DIR = path.join(HERE, "manifests")

export const registry = {}

const files = readdirSync(MANIFEST_DIR).filter((f) => f.endsWith(".mjs"))
for (const file of files) {
  const mod = await import(`file://${path.join(MANIFEST_DIR, file).replace(/\\/g, "/")}`)
  for (const s of mod.surfaces ?? []) {
    registry[s.id] = {
      dir: s.dir,
      domain: s.domain,
      route: s.path,
      actor: s.actor,
      stepsRaw: s.steps ?? [],
      viewports: s.viewports ?? ["390", "1440"],
    }
  }
}

export function surfaceDir(id) {
  return registry[id]?.dir
}
export function surfaceRoute(id) {
  return registry[id]?.route
}
export function surfaceActor(id) {
  return registry[id]?.actor
}
