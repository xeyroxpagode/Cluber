/**
 * GEI CURRENT UX ATLAS — generador de surface-map.md.
 *
 *   node _harness/maps.mjs <spec.mjs>
 *
 * Lee las sondas DOM reales (_probes/<ID>_<viewport>.json) y combina:
 *   - medición real (geometría, styles calculados) del navegador
 *   - descripción semántica escrita a mano en el spec
 *
 * No inventa geometría: si el nodo no se encontró en el DOM, la sección
 * queda marcada NOT FOUND IN DOM.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { registry } from "./registry.mjs"

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ATLAS_ROOT = path.resolve(HERE, "..")
const PROBE_DIR = path.join(HERE, "_probes")

const specArg = process.argv[2]
if (!specArg) {
  console.error("uso: node _harness/maps.mjs <spec.mjs>")
  process.exit(1)
}
const specPath = path.isAbsolute(specArg)
  ? specArg
  : path.resolve(process.cwd(), specArg)
const spec = await import(`file://${specPath.replace(/\\/g, "/")}`)

function loadProbe(id, viewport) {
  const file = path.join(PROBE_DIR, `${id}_${viewport}.json`)
  if (!existsSync(file)) return null
  return JSON.parse(readFileSync(file, "utf8"))
}

function findNode(probe, match) {
  if (!probe || !match) return null
  let hits = probe.nodes.filter((node) => {
    if (match.tag && node.tag !== match.tag) return false
    if (match.role && node.role !== match.role) return false
    if (match.type && node.type !== match.type) return false
    if (match.text && !String(node.text || "").includes(match.text)) return false
    if (match.textExact && String(node.text || "").trim() !== match.textExact)
      return false
    if (match.textStarts && !String(node.text || "").startsWith(match.textStarts))
      return false
    if (match.pathIncludes && !String(node.path || "").includes(match.pathIncludes))
      return false
    if (match.clsIncludes && !String(node.cls || "").includes(match.clsIncludes))
      return false
    if (match.aria && !String(node.aria || "").includes(match.aria)) return false
    return true
  })
  if (match.index !== undefined) hits = hits.slice(match.index, match.index + 1)
  else hits = hits.slice(0, 1)
  return hits[0] ?? null
}

function fmt(n) {
  if (n === null || n === undefined || n === "") return "—"
  return typeof n === "number" ? String(Math.round(n * 100) / 100) : String(n)
}

function layoutLine(node) {
  if (!node) return "—"
  const parts = [`display: ${node.display}`]
  if (node.display === "flex") {
    parts.push(`flex-direction: ${node.flexDirection}`)
    parts.push(`justify-content: ${node.justifyContent}`)
    parts.push(`align-items: ${node.alignItems}`)
    if (node.gap && node.gap !== "normal") parts.push(`gap: ${node.gap}`)
  }
  if (node.display === "grid") {
    parts.push(`grid-template-columns: ${node.gridTemplateColumns}`)
    if (node.gap && node.gap !== "normal") parts.push(`gap: ${node.gap}`)
  }
  parts.push(`padding: ${node.padding}`)
  if (node.margin !== "0px") parts.push(`margin: ${node.margin}`)
  if (node.maxWidth !== "none") parts.push(`max-width: ${node.maxWidth}`)
  if (node.minHeight !== "0px") parts.push(`min-height: ${node.minHeight}`)
  if (node.minWidth !== "0px") parts.push(`min-width: ${node.minWidth}`)
  return parts.join(" · ")
}

function typographyLine(node) {
  if (!node) return "—"
  return [
    `font-family: ${node.fontFamily.split(",")[0]}`,
    `font-size: ${node.fontSize}`,
    `line-height: ${node.lineHeight}`,
    `font-weight: ${node.fontWeight}`,
    node.letterSpacing !== "normal" ? `letter-spacing: ${node.letterSpacing}` : null,
    node.textTransform !== "none" ? `text-transform: ${node.textTransform}` : null,
  ]
    .filter(Boolean)
    .join(" · ")
}

function visualLine(node) {
  if (!node) return "—"
  return [
    `background: ${node.background}`,
    `color: ${node.color}`,
    `border: ${node.border}`,
    `border-radius: ${node.borderRadius}`,
    `box-shadow: ${node.boxShadow === "none" ? "none" : "shadow (ver sonda)"}`,
    `opacity: ${node.opacity}`,
  ].join(" · ")
}

function motionLine(node) {
  if (!node) return "—"
  const transition = node.transition && node.transition !== "0s ease" ? node.transition : "none"
  const animation = node.animation && node.animation !== "none 0s" ? node.animation : "none"
  return `transition: ${transition} · animation: ${animation} · transform: ${node.transform}`
}

function relationshipsFor(nodes, components) {
  const lines = []
  for (const component of components) {
    const node = component.__node
    if (!node) continue
    const parent = node.parent
    const parts = []
    if (parent && parent.rect) {
      const dx = node.rect.x - parent.rect.x
      const dy = node.rect.y - parent.rect.y
      parts.push(
        `contained-by ${parent.tag}${parent.role ? `[${parent.role}]` : ""} @ (${fmt(parent.rect.x)},${fmt(parent.rect.y)}) ${fmt(parent.rect.w)}×${fmt(parent.rect.h)} · offset dx=${fmt(dx)} dy=${fmt(dy)}`,
      )
      if (Math.abs(dx) < 1.5) parts.push("aligned with parent left edge")
      if (Math.abs(node.rect.x + node.rect.w - (parent.rect.x + parent.rect.w)) < 1.5)
        parts.push("aligned with parent right edge")
    }
    if (node.width && node.parent?.rect?.w) {
      const ratio = node.rect.w / node.parent.rect.w
      if (ratio > 0.98) parts.push("fills parent width")
      else if (ratio > 0.9) parts.push("near-full width of parent")
    }
    if (node.position === "absolute" || node.position === "fixed") {
      parts.push(`positioned ${node.position} (z-index ${node.zIndex})`)
    }
    if (node.position === "sticky") parts.push("sticky")
    lines.push(`- **${component.id}** ${component.label}: ${parts.join(" · ")}`)
  }
  return lines
}

let written = 0
const missing = []

for (const surface of spec.surfaces) {
  const entry = registry[surface.id]
  const outDir = path.join(ATLAS_ROOT, surface.dir ?? entry?.dir)
  if (!surface.dir && !entry?.dir) {
    console.error(`SIN REGISTRO: ${surface.id}`)
    continue
  }
  mkdirSync(outDir, { recursive: true })
  const viewports = surface.viewports ?? entry?.viewports ?? ["390", "1440"]
  const blocks = []

  for (const viewport of viewports) {
    const probe = loadProbe(surface.id, viewport)
    if (!probe) {
      missing.push(`${surface.id} ${viewport} (sin sonda)`)
      continue
    }
    const components = (surface.components ?? []).map((c, index) => {
      const node = findNode(probe, c.match)
      return { ...c, id: c.id ?? `C${String(index + 1).padStart(2, "0")}`, __node: node }
    })

    const fileName = `${surface.id}_${viewport}.png`
    const hasPng = existsSync(path.join(outDir, fileName))

    const L = []
    L.push(`# ${surface.id}`)
    L.push("")
    L.push(`**SCREEN ID:** ${surface.id}`)
    L.push("")
    L.push(`**DOMAIN:** ${surface.domain}`)
    L.push("")
    L.push(`**SURFACE NAME:** ${surface.name}`)
    L.push("")
    L.push(`**PURPOSE AS IMPLEMENTED:** ${surface.purpose}`)
    L.push("")
    L.push(`**VIEWPORT:** ${viewport === "390" ? "390×844 (móvil)" : "1440×900 (desktop)"} — ${
      viewport === "390" ? "móvil" : "escritorio"
    }`)
    L.push("")
    L.push(`**ROUTE:** ${surface.route ?? "N/A (no hay route propio; se abre sobre otra ruta)"}`)
    L.push("")
    L.push(`**ORIGIN:** ${surface.origin ?? "—"}`)
    L.push("")
    L.push(`**ACTOR:** ${surface.actor ?? "—"}`)
    L.push("")
    L.push(`**RESOURCE / FIXTURE IDS:** ${(surface.resources ?? []).join(", ") || "—"}`)
    L.push("")
    L.push(`**RESOURCE STATE:** ${surface.resourceState ?? "—"}`)
    L.push("")
    L.push(`**SCROLL POSITION:** ${surface.scroll ?? "top de página (scrollY = 0)"}`)
    L.push("")
    L.push(`**STEPS TO REPRODUCE:**`)
    L.push("")
    const steps = surface.steps ?? []
    steps.forEach((s, i) => L.push(`${i + 1}. ${s}`))
    if (!steps.length) L.push("1. Abrir la ruta directamente.")
    L.push("")
    L.push(`**RELATED SCREEN IDS:** ${(surface.related ?? []).join(", ") || "—"}`)
    L.push("")
    L.push(`**RESPONSIVE COUNTERPART:** ${surface.responsive ?? "—"}`)
    L.push("")
    L.push(`**SOURCE FILES:** ${(surface.sourceFiles ?? []).join(", ") || "—"}`)
    L.push("")
    L.push(`**SOURCE SYMBOLS:** ${(surface.sourceSymbols ?? []).join(", ") || "—"}`)
    L.push("")
    L.push(`**CONFIDENCE:** ${surface.confidence ?? "BOTH (sonda DOM en navegador + lectura de código fuente)"}`)
    L.push("")
    L.push(`**CAPTURE:** ${hasPng ? `\`${fileName}\` presente en esta carpeta` : `SIN SCREENSHOT (${viewport})`}`)
    L.push("")

    /* ── Jerarquía perceptual ─────────────────────────────── */
    L.push("## PERCEPTUAL HIERARCHY")
    L.push("")
    const h = surface.hierarchy ?? {}
    const asList = (v) =>
      v === undefined || v === null
        ? []
        : Array.isArray(v)
          ? v
          : [v]
    L.push(`- **FOCAL 1:** ${h.focal1 ?? "—"}`)
    L.push(`- **FOCAL 2:** ${h.focal2 ?? "—"}`)
    L.push(`- **SUPPORTING:** ${asList(h.supporting).join(" · ") || "—"}`)
    L.push(`- **SECONDARY:** ${asList(h.secondary).join(" · ") || "—"}`)
    L.push(`- **AMBIENT:** ${asList(h.ambient).join(" · ") || "—"}`)
    L.push("")

    /* ── Componentes ─────────────────────────────────────── */
    L.push("## COMPONENT INVENTORY")
    L.push("")
    if (!components.length) {
      L.push("_Sin inventario de componentes declarado para esta composición._")
      L.push("")
    } else {
      L.push("| ID | Componente | Tipo | Instancia / rol |")
      L.push("| --- | --- | --- | --- |")
      for (const c of components) {
        L.push(
          `| ${c.id} | ${c.label} | ${c.type ?? "—"} | ${c.role ?? "—"} |`,
        )
      }
      L.push("")
      for (const c of components) {
        const n = c.__node
        L.push(`### ${c.id} — ${c.label}`)
        L.push("")
        L.push(`- **COMPONENT ID:** ${c.id}`)
        L.push(`- **COMPONENT TYPE:** ${c.type ?? "—"}`)
        L.push(`- **INSTANCE / ROLE:** ${c.role ?? "—"}`)
        L.push(`- **SOURCE COMPONENT:** ${c.source ?? "—"}`)
        L.push(`- **SOURCE FILE:** ${c.sourceFile ?? "—"}`)
        L.push(`- **SOURCE SYMBOL:** ${c.sourceSymbol ?? "—"}`)
        L.push(`- **PARENT:** ${c.parent ?? (n?.parent ? `${n.parent.tag}${n.parent.role ? `[${n.parent.role}]` : ""}` : "—")}`)
        L.push(`- **CHILDREN:** ${c.children ?? "—"}`)
        L.push("")
        L.push("#### GEOMETRY")
        L.push("")
        if (n) {
          L.push(`- rendered: x=${fmt(n.rect.x)} y=${fmt(n.rect.y)} w=${fmt(n.rect.w)} h=${fmt(n.rect.h)}`)
          L.push(`- CSS: width: ${n.width} · min-width: ${n.minWidth} · min-height: ${n.minHeight} · max-width: ${n.maxWidth}`)
        } else {
          L.push("_NOT FOUND IN DOM en esta captura (elemento condicional o fuera de viewport)._")
        }
        L.push("")
        L.push("#### POSITION MODEL")
        L.push("")
        L.push(`- ${n ? n.position : "—"}`)
        L.push("")
        L.push("#### CONSTRAINTS")
        L.push("")
        L.push(`- ${c.constraints ?? (n ? `width ${n.width}, min-width ${n.minWidth}, max-width ${n.maxWidth}` : "—")}`)
        L.push("")
        L.push("#### LAYOUT")
        L.push("")
        L.push(`- ${layoutLine(n)}`)
        L.push("")
        L.push("#### SPATIAL RELATIONSHIPS")
        L.push("")
        if (n && n.parent && n.parent.rect) {
          const dx = n.rect.x - n.parent.rect.x
          const dy = n.rect.y - n.parent.rect.y
          L.push(
            `- contained-by ${n.parent.tag}${n.parent.role ? `[${n.parent.role}]` : ""} · offset dx=${fmt(dx)} dy=${fmt(dy)} · padre ${fmt(n.parent.rect.w)}×${fmt(n.parent.rect.h)}`,
          )
          if (Math.abs(dx) < 1.5) L.push("- aligned with parent left edge")
        }
        for (const rel of c.relationships ?? []) L.push(`- ${rel}`)
        if (n && n.position === "absolute")
          L.push(`- positioned absolute · z-index ${n.zIndex}`)
        if (n && n.position === "fixed") L.push(`- positioned fixed · z-index ${n.zIndex}`)
        if (n && n.position === "sticky") L.push("- sticky")
        L.push("")
        L.push("#### VISUAL CONFIGURATION")
        L.push("")
        L.push(`- ${visualLine(n)}`)
        if (n?.icon) L.push(`- icon: ${n.icon} (${n.iconSize})`)
        if (n) L.push(`- typography: ${typographyLine(n)}`)
        if (c.visual) for (const v of c.visual) L.push(`- ${v}`)
        L.push("")
        L.push("#### CONTENT")
        L.push("")
        L.push(`- visible: ${n?.text ? `"${n.text}"` : "—"}`)
        if (c.content) for (const cc of c.content) L.push(`- ${cc}`)
        L.push("")
        L.push("#### STATE")
        L.push("")
        L.push(`- ${c.state ?? "—"}`)
        L.push("")
        L.push("#### INTERACTION")
        L.push("")
        if (c.interaction) for (const it of c.interaction) L.push(`- ${it}`)
        else L.push("- —")
        L.push("")
        L.push("#### MOTION")
        L.push("")
        if (c.motion) for (const m of c.motion) L.push(`- ${m}`)
        else L.push(`- ${motionLine(n)}`)
        L.push("")
        L.push("#### RESPONSIVE")
        L.push("")
        L.push(`- 390: ${c.responsive390 ?? "—"}`)
        L.push(`- 1440: ${c.responsive1440 ?? "—"}`)
        L.push("")
        L.push("#### IMPLEMENTATION NOTES")
        L.push("")
        if (c.notes) for (const nn of c.notes) L.push(`- ${nn}`)
        else L.push("- —")
        L.push("")
      }
    }

    /* ── Scroll ──────────────────────────────────────────── */
    L.push("## SCROLL CONTRACT")
    L.push("")
    L.push(`- what scrolls: ${surface.scrollWhat ?? "la página (document scroll)"}`)
    L.push(`- what remains sticky/fixed: ${surface.scrollFixed ?? "—"}`)
    L.push(`- initial scroll: ${surface.scrollInitial ?? "scrollY = 0"}`)
    L.push(`- scroll restoration observed: ${surface.scrollRestoration ?? "—"}`)
    L.push(`- scroll lost on navigation: ${surface.scrollLost ?? "—"}`)
    if (probe.scrollers?.length) {
      L.push("")
      L.push("Contenedores con scroll propio detectados en esta captura:")
      L.push("")
      for (const s of probe.scrollers)
        L.push(
          `- ${s.path} · overflow-y: ${s.overflowY} · client-height ${s.clientHeight} · scroll-height ${s.scrollHeight} · scroll-top ${s.scrollTop}`,
        )
    }
    L.push("")
    L.push(
      `- Medición de documento: scrollWidth ${probe.doc.scrollWidth} · scrollHeight ${probe.doc.scrollHeight} · scrollY ${probe.doc.scrollY} · viewport ${probe.viewport.w}×${probe.viewport.h}`,
    )
    L.push("")

    /* ── Responsive ──────────────────────────────────────── */
    L.push("## RESPONSIVE RELATIONSHIP — CURRENT")
    L.push("")
    for (const line of surface.responsiveBlock ?? [])
      L.push(`- ${line}`)
    if (!surface.responsiveBlock?.length)
      L.push("- Ver la sección RESPONSIVE COUNTERPART y las notas 390/1440 de cada componente.")
    L.push("")

    blocks.push({ viewport, text: L.join("\n") })
  }

  const body = [
    `# SURFACE MAP — ${surface.id}`,
    "",
    `> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.`,
    `> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.`,
    "",
    ...blocks.map((b) => b.text),
  ].join("\n")

  writeFileSync(path.join(outDir, "surface-map.md"), body, "utf8")
  written++
  console.log(`OK ${surface.id} (${blocks.length} viewport(s))`)
}

console.log(`\n${written} surface-maps escritos.`)
if (missing.length) {
  console.log(`\nSondas faltantes (${missing.length}):`)
  for (const m of missing) console.log(`  - ${m}`)
}
