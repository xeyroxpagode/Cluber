/**
 * GEI CURRENT UX ATLAS — generador de índices maestros.
 *
 *   node _harness/indexes.mjs
 *
 * Usa: registry (manifiestos de captura), specs (descripción semántica),
 * motion (clips) y el estado real de los archivos del atlas.
 */

import { readFileSync, readdirSync, writeFileSync, existsSync, statSync, mkdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { registry } from "./registry.mjs"

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ATLAS_ROOT = path.resolve(HERE, "..")
const SPEC_DIR = path.join(HERE, "specs")

/* ── specs semánticos ───────────────────────────────────────── */
const specs = {}
for (const file of readdirSync(SPEC_DIR).filter((f) => f.startsWith("spec_"))) {
  const mod = await import(`file://${path.join(SPEC_DIR, file).replace(/\\/g, "/")}`)
  for (const s of mod.surfaces ?? []) specs[s.id] = { ...s, _file: file }
}

const motionSpec = await import(`file://${path.join(SPEC_DIR, "motion.mjs").replace(/\\/g, "/")}`)
const motions = motionSpec.motions ?? []
const motionByDir = {}
for (const m of motions) {
  motionByDir[m.dir] ??= []
  motionByDir[m.dir].push(m)
}

/* ── estado real de los archivos ────────────────────────────── */
const pngs = []
function walk(dir, rel = "") {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    const r = rel ? `${rel}/${entry.name}` : entry.name
    if (entry.isDirectory()) walk(full, r)
    else pngs.push({ rel: r, full })
  }
}
walk(ATLAS_ROOT)

const shotById = {}
for (const p of pngs) {
  if (!p.rel.endsWith(".png")) continue
  const m = p.rel.match(/^(.+)\/(.+?)_(390|1440)\.png$/)
  if (!m) continue
  const id = m[2]
  shotById[id] ??= { "390": null, "1440": null }
  shotById[id][m[3]] = p.rel
}

const mapById = {}
for (const p of pngs) {
  if (!p.rel.endsWith("surface-map.md")) continue
  const m = p.rel.match(/^(.+)\/surface-map\.md$/)
  if (!m) continue
  mapById[m[1]] = p.rel
}

const ids = Object.keys(registry).sort((a, b) => a.localeCompare(b))
const byDomain = {}
for (const id of ids) {
  const d = registry[id].domain ?? specs[id]?.domain ?? "—"
  byDomain[d] ??= []
  byDomain[d].push(id)
}

/* ═══ SCREEN_INDEX.md ═════════════════════════════════════════ */
const indexRows = []
for (const id of ids) {
  const reg = registry[id]
  const spec = specs[id]
  const shots = shotById[id] ?? {}
  const motion = (motionByDir[reg.dir] ?? []).map((m) => m.id)
  indexRows.push({
    id,
    domain: reg.domain,
    surface: spec?.name ?? "—",
    route: reg.route,
    actor: (spec?.actor ?? reg.actor ?? "—").split(" (")[0],
    state: spec?.resourceState ?? "—",
    s390: shots["390"] ? "sí" : "—",
    s1440: shots["1440"] ? "sí" : "—",
    motion: motion.length ? motion.join(", ") : "—",
    source: (spec?.sourceFiles ?? []).join(", ") || "—",
    capture: shots["390"] && shots["1440"] ? "390+1440" : shots["390"] ? "390" : shots["1440"] ? "1440" : "—",
    map: mapById[reg.dir] ? "sí" : "NO",
  })
}

const indexMd = [
  "# SCREEN INDEX — GEI CURRENT UX ATLAS",
  "",
  "Índice maestro de todas las superficies capturadas. Una fila por **Screen ID**.",
  "Un Screen ID identifica una composición visual (route + actor + estado + overlay),",
  "no una URL. Las variantes que sólo cambian el texto no son superficies nuevas.",
  "",
  `**Total de superficies indexadas:** ${indexRows.length}`,
  "",
  `**Capturas 390:** ${indexRows.filter((r) => r.s390 === "sí").length} · **Capturas 1440:** ${indexRows.filter((r) => r.s1440 === "sí").length} · **Clips de motion:** ${motions.length}`,
  "",
  "| ID | Dominio | Surface | Route / origin | Actor | Estado | 390 | 1440 | Motion | Source | Captura | Mapa |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ...indexRows.map(
    (r) =>
      `| \`${r.id}\` | ${r.domain} | ${r.surface} | \`${r.route}\` | ${r.actor} | ${r.state} | ${r.s390} | ${r.s1440} | ${r.motion} | ${r.source} | ${r.capture} | ${r.map} |`,
  ),
  "",
  "## Lectura de las columnas",
  "",
  "- **390 / 1440** — si existe captura real del Screen ID en ese viewport.",
  "- **Motion** — identificadores de los clips mp4 guardados en la carpeta `motion/` de la misma carpeta del Screen ID.",
  "- **Captura** — viewports capturados para ese ID.",
  "- **Mapa** — existencia de `surface-map.md` con la ficha completa de componentes.",
  "",
]
writeFileSync(path.join(ATLAS_ROOT, "SCREEN_INDEX.md"), indexMd.join("\n"), "utf8")

/* ═══ SURFACE_INVENTORY.md por dominio ═══════════════════════ */
for (const [domain, list] of Object.entries(byDomain)) {
  const dir = path.join(ATLAS_ROOT, domain)
  mkdirSync(dir, { recursive: true })
  const lines = [
    `# SURFACE INVENTORY — ${domain}`,
    "",
    "Inventario de superficies de este dominio. El listado sale de la implementación real:",
    "routes del router + navegación visible + acciones + overflow + formularios + tabs +",
    "estados de transición + overlays + variantes de autoridad + estados vacío/carga/error.",
    "",
    `**Superficies en este dominio:** ${list.length}`,
    "",
    "| [x] | ID | Route / origin | Actor | Estado | Cómo llegar | 390 | 1440 | Capturada | Mapeada | Motion |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ]
  for (const id of list) {
    const reg = registry[id]
    const spec = specs[id]
    const shots = shotById[id] ?? {}
    const motion = (motionByDir[reg.dir] ?? []).map((m) => m.id).join(", ")
    const reach = spec
      ? (spec.steps ?? []).join(" → ")
      : `Abrir ${reg.route}`
    lines.push(
      `| [x] | \`${id}\` | \`${reg.route}\` | ${(spec?.actor ?? reg.actor ?? "—").split(" (")[0]} | ${spec?.resourceState ?? "—"} | ${reach} | ${shots["390"] ? "sí" : "N/A"} | ${shots["1440"] ? "sí" : "N/A"} | ${shots["390"] || shots["1440"] ? "sí" : "no"} | ${mapById[reg.dir] ? "sí" : "NO"} | ${motion || "—"} |`,
    )
  }
  lines.push("")
  writeFileSync(path.join(dir, "SURFACE_INVENTORY.md"), lines.join("\n"), "utf8")
}

/* ═══ COVERAGE_MATRIX.md ═════════════════════════════════════ */
const routeCount = {}
for (const id of ids) {
  const r = registry[id].route.split("?")[0]
  routeCount[r] = (routeCount[r] ?? 0) + 1
}

const cov = [
  "# COVERAGE MATRIX — GEI CURRENT UX ATLAS",
  "",
  "Cobertura por dominio. Los números salen de los archivos realmente escritos en el atlas.",
  "No se declaran porcentajes estimados: sólo recuentos verificables.",
  "",
  "| Dominio | Routes descubiertas | Screens descubiertas | Overlays | Variantes de estado | 390 | 1440 | Motion | Mapeadas |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
]

const overlayTokens = ["OVERLAY", "CONFIRM", "MENU", "SHEET", "MODAL", "DIALOG", "TOAST", "BYPASS"]
for (const [domain, list] of Object.entries(byDomain)) {
  const routes = new Set(list.map((id) => registry[id].route.split("?")[0]))
  const overlays = list.filter((id) => overlayTokens.some((t) => id.includes(t))).length
  const stateVariants = list.filter(
    (id) => /_(DEFAULT|NO_|_EMPTY|_FILTER|_DENIED|_ERROR|_ARCHIVED|_POSTPONED|_CANCELLED|_COMPLETED|_IN_PROGRESS|_DRAFT|_PUBLISHED|_CLOSED|_OPEN|_NOTHING)/.test(id),
  ).length
  const s390 = list.filter((id) => shotById[id]?.["390"]).length
  const s1440 = list.filter((id) => shotById[id]?.["1440"]).length
  const mot = new Set(
    list.flatMap((id) => (motionByDir[registry[id].dir] ?? []).map((m) => m.id)),
  ).size
  const mapped = list.filter((id) => mapById[registry[id].dir]).length
  cov.push(
    `| ${domain} | ${routes.size} | ${list.length} | ${overlays} | ${stateVariants} | ${s390} | ${s1440} | ${mot} | ${mapped} |`,
  )
}

cov.push("")
cov.push("## Totales")
cov.push("")
cov.push(`- Screen IDs indexados: **${ids.length}**`)
cov.push(`- Capturas 390: **${indexRows.filter((r) => r.s390 === "sí").length}**`)
cov.push(`- Capturas 1440: **${indexRows.filter((r) => r.s1440 === "sí").length}**`)
cov.push(`- Clips de motion: **${motions.length}**`)
cov.push(`- Surface maps escritos: **${Object.keys(mapById).length}**`)
cov.push(`- Rutas distintas alcanzadas: **${Object.keys(routeCount).length}**`)
cov.push("")
cov.push("## Unreachable implemented states — superficies en el código sin acceso desde la UI actual")
cov.push("")
cov.push("| Superficie | Evidencia | Dónde se documenta |")
cov.push("| --- | --- | --- |")
cov.push("| `ConflictWorkspace` (3 columnas baseline/local/latest) | `src/features/events.tsx:113` — se abre sólo con `StaleVersionError`, que exige una mutación concurrente que el prototipo no produce | `02_Calendario/EventCreate/` (registrado en el inventario) |")
cov.push("| Banner de conflicto de convocatoria | `src/features/participation.tsx:288` — ningún `published` del seed queda fuera de su equipo; sólo se dispara si se edita el evento y se le quitan los equipos destino | `03_Participacion/Selection/` |")
cov.push("| Edición de sedes y archivado de sedes | `src/features/management.tsx:1133` — la pantalla filtra `state.structure` por tipo VENUE y el seed no tiene entradas de ese tipo (las sedes viven en `state.venues`) | `07_Gestion/Structure/Venues/MGT_STRUCTURE_004_VENUES/` |")
cov.push("| Enlace «Ver el objeto» del historial de auditoría | `src/shared/patterns.tsx:266` — `TimelineEntry` exige las props `to` **y** `route`; `AuditPage` sólo pasa `to` | `07_Gestion/Audit/MGT_AUDIT_001_LIST/` |")
cov.push("| `SavedState` (idle/saving/saved/dirty) | `src/shared/ui.tsx:1136` — exportado, nunca renderizado | `00_Global/SHARED_COMPONENT_CATALOG.md` |")
cov.push("| `Expander`, `Checkbox`, `StatusText`, `StateBanner`, `UnreadMark`, `FilterBar`, `FormSection`, `TerminalConfirm`, `OpenGroup`, `DataTable`, `StickyActionBar`, `BackLink` | exportados desde `src/shared/*` sin ninguna renderización en `src/features/*` | `00_Global/SHARED_COMPONENT_CATALOG.md` |")
cov.push("| Ruta `/events/:id/availability` | existe en el router, pero ningún enlace de la UI la apunta | `03_Participacion/Availability/` |")
cov.push("| Ruta `/events/new` (alta de evento) | existe en el router, sin enlace de alta en la UI | `02_Calendario/EventCreate/` |")
cov.push("| Ruta `/management/teams/:id` | existe en el router, sin enlace en la UI | `07_Gestion/Teams/` |")
cov.push("| Ruta `/activate` | existe en el router, sin enlace en la UI | `08_Auth/Activation/` |")
cov.push("| Recuperación de contraseña | no hay ruta, ni enlace, ni API | `08_Auth/Recovery/RECOVERY.md` |")
cov.push("| Entidad «cuerpo técnico» (staff) | no existe en el modelo; el entrenador es un `RoleAssignment` | `04_Equipos/Staff/STAFF.md` |")
cov.push("")
cov.push("## Unknowns")
cov.push("")
cov.push("| Unknown | Por qué queda abierto |")
cov.push("| --- | --- |")
cov.push("| Comportamiento del `Sheet` en viewports < 390 | El atlas sólo midió 390 y 1440; por debajo de 390 el `max-w-md` del panel secede terreno al viewport y no hay medición |")
cov.push("| Óptima de Safari/Firefox | Las capturas son de Chromium 140 (Chrome headless): `backdrop-filter`, `100dvh` y `overflow: clip` pueden diferir en otros motores |")
cov.push("| Scroll dentro de la lista de mensajes de la conversación | La ruta `/conversations/:id` no resuelve la conversación, de modo que el `div` con `overflow-y-auto` del hilo nunca se renderiza |")
cov.push("| Movimiento con `prefers-reduced-motion: reduce` | El harness captura con la preferencia por defecto del sistema; el comportamiento reducido está documentado por código (`theme.css:315`) pero no filmado |")
cov.push("| Contenido real del correo de activación | El prototipo no envía correo: el canal de entrega del código es manual (lo documenta la propia pantalla) |")
cov.push("")
writeFileSync(path.join(ATLAS_ROOT, "COVERAGE_MATRIX.md"), cov.join("\n"), "utf8")

console.log(
  `SCREEN_INDEX: ${indexRows.length} filas · inventarios: ${Object.keys(byDomain).length} · coverage: ok`,
)
