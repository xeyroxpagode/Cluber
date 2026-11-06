/**
 * GEI CURRENT UX ATLAS — catálogo de componentes compartidos e índice de uso.
 *
 *   node _harness/components.mjs
 *
 * Cruza:
 *   - los primitives declarados en src/shared/*.tsx (leídos del código fuente)
 *   - los componentes documentados en cada surface-map.md (con su source file/symbol)
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ATLAS_ROOT = path.resolve(HERE, "..")
const REPO = path.resolve(HERE, "..", "..")

/* ── 1. primitives leídos del código fuente ─────────────────── */
const sharedDir = path.join(REPO, "src", "shared")
const sources = {}
for (const file of readdirSync(sharedDir).filter((f) => f.endsWith(".tsx"))) {
  const code = readFileSync(path.join(sharedDir, file), "utf8")
  const names = new Set()
  for (const m of code.matchAll(
    /export function ([A-Z][A-Za-z0-9_]*)\s*\(/g,
  ))
    names.add(m[1])
  for (const m of code.matchAll(/export const ([A-Z][A-Za-z0-9_]*)\s*=/g))
    names.add(m[1])
  sources[`src/shared/${file}`] = { code, names: [...names] }
}

/* variantes observadas por literal en el código */
const variantsOf = (code, name) => {
  const out = new Set()
  const re = new RegExp(`${name}[\\s\\S]{0,900}?variant=("|')([a-z]+)\\1`, "g")
  for (const m of code.matchAll(re)) out.add(m[2])
  const re2 = new RegExp(`${name}[\\s\\S]{0,1400}?tone=("|')([a-z]+)\\1`, "g")
  for (const m of code.matchAll(re2)) out.add("tone:" + m[2])
  const re3 = new RegExp(`${name}[\\s\\S]{0,1400}?size=("|')([a-z]+)\\1`, "g")
  for (const m of code.matchAll(re3)) out.add("size:" + m[2])
  return [...out]
}

/* ── 1b. uso real en las features (renderizado, no importado) ── */
const featureDir = path.join(REPO, "src", "features")
const appDir = path.join(REPO, "src", "app")
const featureCode = []
for (const dir of [featureDir, appDir, sharedDir]) {
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".tsx")))
    featureCode.push(readFileSync(path.join(dir, file), "utf8"))
}
const renderedIn = (name) => {
  let n = 0
  for (const code of featureCode) {
    n += (code.match(new RegExp(`<${name}[\\s/>]`, "g")) ?? []).length
  }
  return n
}
const importedIn = (name) => {
  let n = 0
  for (const code of featureCode) {
    const m = code.match(new RegExp(`import\\s*\\{([^}]*)\\}`, "g")) ?? []
    for (const block of m)
      if (new RegExp(`\\b${name}\\b`).test(block)) n++
  }
  return n
}

/* ── 2. componentes documentados en los surface maps ────────── */
const usage = new Map()
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (entry.name === "surface-map.md") {
      const md = readFileSync(full, "utf8")
      const screenId = (md.match(/^\*\*SCREEN ID:\*\* (.+)$/m) ?? [])[1]
      const surface = (md.match(/^\*\*SURFACE NAME:\*\* (.+)$/m) ?? [])[1]
      const blocks = md.split(/^### /m).slice(1)
      for (const b of blocks) {
        const id = (b.match(/^([A-Z]\d\d) — /) ?? [])[1]
        const label = (b.match(/^([A-Z]\d\d) — (.+)$/m) ?? [])[2]
        const type = (b.match(/\*\*COMPONENT TYPE:\*\* (.+)/) ?? [])[1]
        const src = (b.match(/\*\*SOURCE FILE:\*\* (.+)/) ?? [])[1]
        const sym = (b.match(/\*\*SOURCE SYMBOL:\*\* (.+)/) ?? [])[1]
        const srcComp = (b.match(/\*\*SOURCE COMPONENT:\*\* (.+)/) ?? [])[1]
        if (!id) continue
        const key = src && src !== "—" ? `${src} :: ${sym ?? srcComp}` : (srcComp ?? label)
        if (!usage.has(key))
          usage.set(key, {
            label: label ?? id,
            type: type ?? "—",
            sourceFile: src ?? "—",
            sourceSymbol: sym ?? srcComp ?? "—",
            screens: [],
          })
        usage.get(key).screens.push({ screenId, surface, componentId: id })
      }
    }
  }
}
walk(ATLAS_ROOT)

/* ── 3. catálogo ────────────────────────────────────────────── */
const cat = [
  "# SHARED COMPONENT CATALOG — GEI CURRENT UX ATLAS",
  "",
  "Primitives compartidos observados en la aplicación real, con sus variantes, tamaños,",
  "estados y motion. La **configuración de cada instancia** vive en el `surface-map.md`",
  "de la surface donde aparece; acá está la definición del primitive y dónde se usa.",
  "",
  "Fuente de verdad del código: `src/shared/ui.tsx`, `src/shared/patterns.tsx`,",
  "`src/shared/vas.tsx`, `src/shared/states.ts`.",
  "",
]

const groups = [
  ["Botones y acciones", ["Button", "IconButton", "TextLink", "BackLink"]],
  ["Filas y superficies", ["RowLink", "RowStatic", "Surface", "OpenGroup", "Empty", "Banner", "KeyValue", "MetaRow", "Avatar", "DataTable", "StickyActionBar"]],
  ["Estado y etiquetas", ["StateBadge", "Tag", "UnreadMark", "StatusText", "StateBanner"]],
  ["Navegación y filtros", ["TabBar", "SegmentedControl", "FilterChip", "Expander", "FilterBar"]],
  ["Formularios", ["Field", "TextField", "TextArea", "Select", "Checkbox", "RadioGroup"]],
  ["Overlays", ["Modal", "Sheet", "ConfirmDialog", "Menu", "ScopeDialog", "TerminalConfirm"]],
  ["Feedback", ["SavedState", "Toast"]],
  ["Gramática compartida", ["PageContextHeader", "SectionHeader", "DetailSection", "FormSection", "ImpactPreview", "TimelineEntry", "HistoryList", "StateBanner"]],
  ["Dominio", ["VasControl", "VasCompact"]],
]

for (const [group, names] of groups) {
  cat.push(`## ${group}`)
  cat.push("")
  cat.push("| Primitive | Source | Variantes observadas | Aparece en | Renderizado en el código | Motion |")
  cat.push("| --- | --- | --- | --- | --- | --- |")
  for (const name of names) {
    const entries = [...usage.entries()].filter(([k]) => k.includes(name))
    const srcFile = Object.keys(sources).find((f) =>
      sources[f].names.includes(name),
    )
    const file = srcFile ?? "—"
    const variants = srcFile
      ? [...new Set([...variantsOf(sources[srcFile].code, name), ...(srcFile.includes("ui.tsx") && name === "Button" ? ["primary", "secondary", "danger", "quiet"] : [])])]
      : []
    const screens = [
      ...new Set(entries.flatMap(([, i]) => i.screens.map((s) => s.screenId))),
    ]
    const rendered = renderedIn(name)
    const codeUse =
      rendered > 0
        ? `sí (${rendered} render${rendered === 1 ? "" : "izados"})`
        : importedIn(name) > 0
          ? "importado, no renderizado"
          : "NO PRESENT IN CURRENT"
    const motion =
      name === "Button" || name === "IconButton" || name === "TextLink"
        ? "transition-colors duration-micro (120 ms) ease-gei"
        : name === "Menu" || name === "Modal" || name === "Sheet"
          ? "sin animación de entrada: montaje/desmontaje"
          : name === "Expander"
            ? "rotate-180 del chevron, transition-transform duration-micro"
            : name === "Toast"
              ? "sin animación: montaje/desmontaje a los 3800 ms"
              : name === "TabBar" || name === "SegmentedControl" || name === "FilterChip"
                ? "transition-colors duration-micro (120 ms)"
                : name === "RadioGroup" || name === "SavedState"
                  ? "transition-colors duration-micro; el icono busy usa animate-spin"
                  : "—"
    cat.push(
      `| \`${name}\` | \`${file}\` | ${variants.length ? variants.join(", ") : "—"} | ${screens.length} surfaces | ${codeUse} | ${motion} |`,
    )
  }
  cat.push("")
}

cat.push("## Primitives exportados que no aparecen en ninguna surface capturada")
cat.push("")
const unused = []
for (const [file, info] of Object.entries(sources)) {
  for (const name of info.names) {
    const found = [...usage.keys()].some((k) => k.includes(name))
    const rendered = renderedIn(name)
    if (!found && rendered === 0)
      unused.push(
        `\`${name}\` (${file}) — ${importedIn(name) > 0 ? "importado en las features pero nunca renderizado" : "exportado y no referenciado por ninguna feature"}`,
      )
  }
}
cat.push(
  unused.length
    ? unused.map((u) => `- ${u}`).join("\n")
    : "- Ninguno: todos los primitives exportados por `src/shared` aparecen en al menos una surface capturada.",
)
cat.push("")
cat.push("## Fuentes de los primitives")
cat.push("")
for (const [file, info] of Object.entries(sources)) {
  cat.push(`- \`${file}\`: ${info.names.map((n) => `\`${n}\``).join(", ")}`)
}
cat.push("")

writeFileSync(
  path.join(ATLAS_ROOT, "00_Global", "SHARED_COMPONENT_CATALOG.md"),
  cat.join("\n"),
  "utf8",
)

/* ── 4. índice de uso por componente ─────────────────────────── */
const idx = [
  "# COMPONENT USAGE INDEX — GEI CURRENT UX ATLAS",
  "",
  "Para cada componente documentado: en qué surfaces aparece.",
  "Sirve para conocer el radio de impacto de un primitive antes de tocarlo.",
  "",
]
const sorted = [...usage.entries()].sort((a, b) =>
  a[0].localeCompare(b[0]),
)
for (const [key, info] of sorted) {
  const screens = [...new Set(info.screens.map((s) => s.screenId))].sort()
  idx.push(`## ${info.label}`)
  idx.push("")
  idx.push(`- **Clave:** \`${key}\``)
  idx.push(`- **Tipo:** ${info.type}`)
  idx.push(`- **Source file:** \`${info.sourceFile}\``)
  idx.push(`- **Source symbol:** \`${info.sourceSymbol}\``)
  idx.push(`- **Surfaces:** ${screens.length}`)
  idx.push("")
  for (const s of screens) {
    const detail = info.screens.find((x) => x.screenId === s)
    idx.push(`  - \`${s}\` → ${detail.componentId} (${detail.surface ?? ""})`)
  }
  idx.push("")
}
writeFileSync(path.join(ATLAS_ROOT, "COMPONENT_USAGE_INDEX.md"), idx.join("\n"), "utf8")

console.log(
  `catálogo: ${usage.size} componentes · ${[...usage.values()].reduce((s, i) => s + i.screens.length, 0)} apariciones`,
)
