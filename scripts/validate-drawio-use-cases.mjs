#!/usr/bin/env node
// GEI E4 — validator for the use case .drawio deliverables.
// Checks XML well-formedness, mxGraph structure, canonical coverage, actor catalog,
// relation authorization/direction/stereotype, generalization subset, and UML boundary rules.
// No external dependencies: uses only node builtins.

import fs from "node:fs";
import path from "node:path";

const SRC = "docs/uml/use-cases/source";
const CATALOG = "docs/use-cases/GEI_MASTER_USE_CASE_CATALOG_V1.md";
const ACTOR_FREEZE = "docs/actors/GEI_ACTOR_MODEL_FREEZE_V1.md";
const CANONICAL_ACTORS = [
  "ACT-UNAUTHENTICATED", "ACT-AUTHENTICATED", "ACT-PLAYER", "ACT-CAPTAIN",
  "ACT-COACH", "ACT-SUBCOMMITTEE", "ACT-ADMIN", "ACT-GUARDIAN",
];
// E2 §11.1 — the only six generalizations frozen by the actor model.
const CANONICAL_GENERALIZATIONS = [
  ["ACT-PLAYER", "ACT-AUTHENTICATED"],
  ["ACT-CAPTAIN", "ACT-AUTHENTICATED"],
  ["ACT-COACH", "ACT-AUTHENTICATED"],
  ["ACT-SUBCOMMITTEE", "ACT-AUTHENTICATED"],
  ["ACT-ADMIN", "ACT-AUTHENTICATED"],
  ["ACT-GUARDIAN", "ACT-AUTHENTICATED"],
];

const fail = [];
const warn = [];
const failCheck = (name, detail) => fail.push({ name, detail });
const warnCheck = (name, detail) => warn.push({ name, detail });

// ---------------------------------------------------------------- catalog

function readCanonicalUc() {
  const text = fs.readFileSync(CATALOG, "utf8");
  const out = new Map();
  const re = /^##\s+(UC-[A-Z]+-\d{2})\s*[·\-–]\s*(.+?)\s*$/gm;
  let m;
  while ((m = re.exec(text))) {
    const id = m[1];
    if (out.has(id)) failCheck("DUPLICATE_CATALOG_ID", id);
    out.set(id, m[2]);
  }
  return out;
}

// ---------------------------------------------------------------- minimal XML

function parseXml(xml, file) {
  const errors = [];
  const stack = [];
  const cleaned = xml.replace(/<\?[\s\S]*?\?>/g, "").replace(/<!--[\s\S]*?-->/g, "");
  const tagRe = /<(\/?)([A-Za-z_][\w.:-]*)((?:\s+[\w.:-]+\s*=\s*"[^"]*")*)\s*(\/?)>/g;
  const ATTR = /(?:\s+[\w.:-]+\s*=\s*"[^"]*")/g;
  let t;
  let pos = 0;
  while ((t = tagRe.exec(cleaned))) {
    pos = tagRe.lastIndex;
    const name = t[2];
    if (t[1]) {
      const top = stack.pop();
      if (top !== name) errors.push(`mismatched </${name}> (open was <${top}>)`);
    } else if (!t[4]) {
      stack.push(name);
    }
    if (t[1]) continue; // closing tag
    const afterName = t[0].slice(1 + name.length).replace(/\/?>$/, "");
    const leftover = afterName.replace(ATTR, "");
    if (leftover.trim().length) {
      errors.push(`unparsable attribute text in <${name}>: ${JSON.stringify(leftover.slice(0, 40))}`);
    }
  }
  if (stack.length) errors.push(`unclosed elements: ${stack.join(",")}`);
  return errors;
}

function cellsOf(xml) {
  const cells = [];
  const re = /<mxCell\b([^>]*?)(\/>|>([\s\S]*?)<\/mxCell>)/g;
  let m;
  while ((m = re.exec(xml))) {
    const attrsRaw = m[1];
    const inner = m[3] || "";
    const attr = (n) => {
      const mm = attrsRaw.match(new RegExp(`${n}="([^"]*)"`));
      return mm ? mm[1] : null;
    };
    cells.push({
      raw: m[0],
      id: attr("id"),
      value: attr("value"),
      style: attr("style") || "",
      vertex: attr("vertex") === "1",
      edge: attr("edge") === "1",
      parent: attr("parent"),
      source: attr("source"),
      target: attr("target"),
      inner,
      geometry: (inner.match(/<mxGeometry([^>]*?)\/?>/) || [])[1] || "",
    });
  }
  return cells;
}

const decode = (s) => (s == null ? "" : s
  .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&amp;/g, "&"));

// ---------------------------------------------------------------- main

const canonical = readCanonicalUc();
const files = fs.existsSync(SRC) ? fs.readdirSync(SRC).filter((f) => f.endsWith(".drawio")).sort() : [];
if (files.length === 0) failCheck("NO_DRAWIO_FILES", SRC);

const ucSeen = new Map();          // ucId -> Set(filename)
const ucLabelSeen = new Map();     // "id|name" -> Set(filename)
const actorsSeen = new Map();      // actorId -> Set(filename)
const drawnRelations = [];
const drawnAssociations = [];
const drawnGeneralizations = [];
const perFile = [];

for (const f of files) {
  const xml = fs.readFileSync(path.join(SRC, f), "utf8");
  const xmlErrors = parseXml(xml, f);
  if (xmlErrors.length) failCheck("MALFORMED_XML", `${f}: ${xmlErrors.slice(0, 3).join("; ")}`);

  if (!/<mxfile\b/.test(xml)) failCheck("MXFILE_MISSING", f);
  if (!/<diagram\b/.test(xml)) failCheck("DIAGRAM_MISSING", f);
  if (!/<mxGraphModel\b/.test(xml)) failCheck("MXGRAPHPMODEL_MISSING", f);

  const cells = cellsOf(xml);
  const ids = new Set();
  let dupIds = 0;
  for (const c of cells) {
    if (!c.id) continue;
    if (ids.has(c.id)) dupIds += 1;
    ids.add(c.id);
  }
  if (dupIds) failCheck("DUPLICATE_CELL_ID", `${f}: ${dupIds}`);

  for (const c of cells) {
    if (c.parent && !ids.has(c.parent) && c.parent !== "0") {
      failCheck("BROKEN_PARENT_REF", `${f}: ${c.id} -> parent ${c.parent}`);
    }
  }
  for (const c of cells) {
    if (!c.edge) continue;
    for (const end of ["source", "target"]) {
      if (!c[end]) failCheck("BROKEN_EDGE_ENDPOINT", `${f}: ${c.id} missing ${end}`);
      else if (!ids.has(c[end])) failCheck("BROKEN_EDGE_ENDPOINT", `${f}: ${c.id} ${end}=${c[end]}`);
    }
  }
  if (/NaN|Infinity|undefined/.test(xml)) failCheck("NON_FINITE_GEOMETRY", f);

  const byId = new Map(cells.map((c) => [c.id, c]));

  // geometry bounds
  let offPage = 0;
  for (const c of cells) {
    if (!c.vertex || !c.geometry) continue;
    const gx = /x="(-?[\d.]+)"/.exec(c.geometry);
    const gy = /y="(-?[\d.]+)"/.exec(c.geometry);
    const gw = /width="(-?[\d.]+)"/.exec(c.geometry);
    const gh = /height="(-?[\d.]+)"/.exec(c.geometry);
    if (!gx || !gy || !gw || !gh) continue;
    const x = +gx[1], y = +gy[1], w = +gw[1], h = +gh[1];
    if (x < 0 || y < 0 || x + w > 1169 || y + h > 827) offPage += 1;
  }
  if (offPage) failCheck("ELEMENT_OFF_PAGE", `${f}: ${offPage}`);

  // system boundary
  const boundary = cells.find((c) => c.id === "boundary");
  if (!boundary) failCheck("SYSTEM_BOUNDARY_MISSING", f);
  const bx = boundary ? +/x="(-?[\d.]+)"/.exec(boundary.geometry)[1] : 0;
  const by = boundary ? +/y="(-?[\d.]+)"/.exec(boundary.geometry)[1] : 0;
  const bw = boundary ? +/width="(-?[\d.]+)"/.exec(boundary.geometry)[1] : 0;
  const bh = boundary ? +/height="(-?[\d.]+)"/.exec(boundary.geometry)[1] : 0;
  const inside = (x, y) => x >= bx && x <= bx + bw && y >= by && y <= by + bh;

  // actors — resolve each stick figure to its own text label (placed 24px below the figure)
  const actorCells = cells.filter((c) => c.vertex && /shape=umlActor/.test(c.style));
  const textCells = cells.filter((c) => c.vertex && /strokeColor=none/.test(c.style) && /verticalAlign=top/.test(c.style));
  const actorLabelOf = new Map();
  for (const ac of actorCells) {
    const ay = +/y="(-?[\d.]+)"/.exec(ac.geometry)[1];
    const lab = textCells.find((c) => Math.abs(+/y="(-?[\d.]+)"/.exec(c.geometry)[1] - (ay + 44)) < 1.5
      && decode(c.value).includes("ACT-"));
    if (!lab) { failCheck("ACTOR_LABEL_MISSING", `${f}: ${ac.id}`); continue; }
    const text = decode(lab.value);
    const id = text.split("\n").flatMap((l) => l.split(/<br\s*\/?>/i)).map((s) => s.trim()).find((l) => l.startsWith("ACT-"));
    if (!id) { failCheck("ACTOR_ID_UNRESOLVED", `${f}: ${text}`); continue; }
    actorLabelOf.set(ac.id, id);
    if (!CANONICAL_ACTORS.includes(id)) failCheck("UNKNOWN_ACTOR", `${f}: ${id}`);
    if (!actorsSeen.has(id)) actorsSeen.set(id, new Set());
    actorsSeen.get(id).add(f);
  }

  // actor must be OUTSIDE the boundary
  for (const ac of actorCells) {
    const gx = +/x="(-?[\d.]+)"/.exec(ac.geometry)[1];
    const gy = +/y="(-?[\d.]+)"/.exec(ac.geometry)[1];
    const gw = +/width="(-?[\d.]+)"/.exec(ac.geometry)[1];
    const gh = +/height="(-?[\d.]+)"/.exec(ac.geometry)[1];
    if (inside(gx + gw / 2, gy + gh / 2)) failCheck("ACTOR_INSIDE_BOUNDARY", `${f}: ${ac.id}`);
  }

  // use cases must be INSIDE the boundary
  const ucCells = cells.filter((c) => c.vertex && /(^|;)ellipse;/.test(c.style));
  const ucByCell = new Map();
  for (const uc of ucCells) {
    const text = decode(uc.value);
    const lines = text.split(/\n|<br\s*\/?>/i).map((s) => s.trim()).filter(Boolean);
    const id = lines.find((l) => /^UC-[A-Z]+-\d{2}$/.test(l));
    const name = lines.filter((l) => l !== id).join(" ").replace(/\s+/g, " ").trim();
    if (!id) { failCheck("UC_LABEL_WITHOUT_ID", `${f}: ${text}`); continue; }
    if (!canonical.has(id)) { failCheck("UNKNOWN_UC", `${f}: ${id}`); continue; }
    if (canonical.get(id) !== name) failCheck("RENAMED_UC", `${f}: ${id} is "${name}", canonical is "${canonical.get(id)}"`);
    ucByCell.set(uc.id, { id, name });
    if (!ucSeen.has(id)) ucSeen.set(id, new Set());
    ucSeen.get(id).add(f);
    const key = `${id}|${name}`;
    if (!ucLabelSeen.has(key)) ucLabelSeen.set(key, new Set());
    ucLabelSeen.get(key).add(f);
    const gx = +/x="(-?[\d.]+)"/.exec(uc.geometry)[1];
    const gy = +/y="(-?[\d.]+)"/.exec(uc.geometry)[1];
    const gw = +/width="(-?[\d.]+)"/.exec(uc.geometry)[1];
    const gh = +/height="(-?[\d.]+)"/.exec(uc.geometry)[1];
    if (!inside(gx + gw / 2, gy + gh / 2)) failCheck("UC_OUTSIDE_BOUNDARY", `${f}: ${id}`);
  }

  // edges
  for (const c of cells) {
    if (!c.edge) continue;
    const dashed = /dashed=1/.test(c.style);
    const arrow = /endArrow=open/.test(c.style);
    const filled = /endFill=1/.test(c.style);
    const hollowTri = /endArrow=block/.test(c.style) && /endFill=0/.test(c.style);
    const childLabel = cells.find((l) => l.vertex && l.parent === c.id);
    const label = childLabel ? decode(childLabel.value) : "";
    const src = ucByCell.get(c.source);
    const tgt = ucByCell.get(c.target);
    const srcIsActor = actorCells.some((a) => a.id === c.source);
    const tgtIsActor = actorCells.some((a) => a.id === c.target);

    if (hollowTri) {
      if (!srcIsActor || !tgtIsActor) failCheck("MALFORMED_GENERALIZATION", `${f}: ${c.id}`);
      else drawnGeneralizations.push({ child: actorLabelOf.get(c.source), parent: actorLabelOf.get(c.target), file: f, filled });
      continue;
    }
    if (src && tgt) {
      if (!dashed || !arrow) failCheck("MALFORMED_RELATION_STEREOTYPE", `${f}: ${c.id}`);
      if (!/«(include|extend)»/.test(label)) failCheck("STEREOTYPE_LABEL_MISSING", `${f}: ${c.id} label="${label}"`);
      const kind = /«include»/.test(label) ? "include" : "extend";
      const cond = (label.match(/\[([A-Z_]+)\]/) || [])[1] || null;
      if (kind === "extend" && !cond) failCheck("EXTEND_WITHOUT_CONDITION", `${f}: ${src.id} -> ${tgt.id}`);
      drawnRelations.push({ file: f, from: src.id, to: tgt.id, kind, cond });
      continue;
    }
    if (srcIsActor && tgt) {
      if (arrow || dashed) failCheck("ASSOCIATION_MUST_HAVE_NO_ARROW", `${f}: ${c.id}`);
      drawnAssociations.push({ file: f, actor: actorLabelOf.get(c.source), uc: tgt.id });
      continue;
    }
    if (srcIsActor && tgtIsActor) continue; // actor-to-actor without a triangle is not allowed either
    failCheck("UNCLASSIFIED_EDGE", `${f}: ${c.id}`);
  }

  perFile.push({ file: f, ucCount: ucByCell.size, actors: actorCells.length });
}

// ---------------------------------------------------------------- coverage

const missing = [...canonical.keys()].filter((id) => !ucSeen.has(id));
const unknown = [...ucSeen.keys()].filter((id) => !canonical.has(id));
for (const id of missing) failCheck("MISSING_UC", id);
for (const id of unknown) failCheck("UNKNOWN_UC_IN_DIAGRAMS", id);
if (canonical.size !== 102) failCheck("CANONICAL_COUNT", `${canonical.size} (expected 102)`);
if (ucSeen.size !== 102) failCheck("UNIQUE_UC_COVERAGE", `${ucSeen.size} (expected 102)`);

// primary ownership: the UC must appear in a diagram whose id matches its domain
const primaryMissing = [...canonical.keys()].filter((id) => {
  const dom = id.split("-")[1];
  const filesFor = ucSeen.get(id);
  return !filesFor || ![...filesFor].some((f) => f.startsWith(`UCD-${dom}-`));
});
for (const id of primaryMissing) failCheck("UC_NOT_IN_OWNER_DOMAIN_DIAGRAM", id);

for (const id of CANONICAL_ACTORS) {
  if (!actorsSeen.has(id)) failCheck("ACTOR_NOT_REPRESENTED", id);
}
for (const id of actorsSeen.keys()) {
  if (!CANONICAL_ACTORS.includes(id)) failCheck("UNKNOWN_ACTOR", id);
}

// generalization subset
const canonSet = new Set(CANONICAL_GENERALIZATIONS.map(([c, p]) => `${c}->${p}`));
for (const g of drawnGeneralizations) {
  if (!canonSet.has(`${g.child}->${g.parent}`)) failCheck("NO_NEW_GENERALIZATION", `${g.child} -> ${g.parent} in ${g.file}`);
  if (g.filled) failCheck("GENERALIZATION_ARROW_MUST_BE_HOLLOW", `${g.child}->${g.parent}`);
}
const seenGen = new Set(drawnGeneralizations.map((g) => `${g.child}->${g.parent}`));
for (const [c, p] of CANONICAL_GENERALIZATIONS) {
  if (!seenGen.has(`${c}->${p}`)) warnCheck("GENERALIZATION_NOT_DRAWN_HERE", `${c} -> ${p}`);
}

// forbidden generalizations named by the brief
for (const g of drawnGeneralizations) {
  if (g.child === "ACT-CAPTAIN" && (g.parent === "ACT-PLAYER" || g.parent === "ACT-COACH")) {
    failCheck("FORBIDDEN_GENERALIZATION", `${g.child}->${g.parent}`);
  }
  if (g.child === "ACT-ADMIN" && (g.parent === "ACT-COACH" || g.parent === "ACT-PLAYER")) {
    failCheck("FORBIDDEN_GENERALIZATION", `${g.child}->${g.parent}`);
  }
}

// ---------------------------------------------------------------- relations

const ALLOWED = new Map();
for (const s of ["UC-IAM-02", "UC-IAM-03", "UC-IAM-05",
  "UC-PPL-01", "UC-PPL-02", "UC-PPL-03", "UC-PPL-04", "UC-PPL-05", "UC-PPL-06",
  "UC-PPL-07", "UC-PPL-08", "UC-PPL-09", "UC-PPL-10", "UC-PPL-11", "UC-PPL-12",
  "UC-STR-01", "UC-STR-02", "UC-STR-03", "UC-STR-04", "UC-STR-05", "UC-STR-06",
  "UC-STR-07", "UC-STR-08", "UC-STR-09", "UC-STR-10", "UC-STR-11", "UC-STR-12",
  "UC-STR-13", "UC-STR-14", "UC-STR-15",
  "UC-CMP-01", "UC-CMP-02", "UC-CMP-03", "UC-CMP-04", "UC-CMP-05", "UC-CMP-06",
  "UC-CMP-07", "UC-CMP-08", "UC-PRT-12"]) {
  ALLOWED.set(`${s}->UC-IAM-09|include`, "INC-01");
}
for (const s of ["UC-EVT-04", "UC-EVT-05", "UC-EVT-07", "UC-EVT-08", "UC-EVT-16"]) {
  ALLOWED.set(`${s}->UC-EVT-11|include`, "INC-02");
}
ALLOWED.set("UC-EVT-12->UC-EVT-04|extend", "EXT-01");
ALLOWED.set("UC-PRT-07->UC-PRT-05|extend", "EXT-02");
ALLOWED.set("UC-PRT-07->UC-PRT-06|extend", "EXT-02");
ALLOWED.set("UC-PRT-10->UC-PRT-09|extend", "EXT-03");
ALLOWED.set("UC-PRT-04->UC-PRT-02|extend", "EXT-04");
ALLOWED.set("UC-PRT-04->UC-PRT-03|extend", "EXT-04");

const drawnKeys = new Map();
for (const r of drawnRelations) {
  if (!canonical.has(r.from)) failCheck("UNKNOWN_RELATION_ENDPOINT", r.from);
  if (!canonical.has(r.to)) failCheck("UNKNOWN_RELATION_ENDPOINT", r.to);
  const k = `${r.from}->${r.to}|${r.kind}`;
  if (!ALLOWED.has(k)) failCheck("UNAUTHORIZED_NEW_RELATION", `${k} in ${r.file}`);
  drawnKeys.set(k, (drawnKeys.get(k) || 0) + 1);
}
for (const k of ALLOWED.keys()) {
  if (!drawnKeys.has(k)) failCheck("APPROVED_RELATION_NOT_DRAWN", k);
}

// the nine rejected relations must never appear
const REJECTED_PAIRS = [
  ["UC-PRT-01", "UC-PRT-05", "REJ-03 disponibilidad en asistencia"],
  ["UC-PRT-13", "UC-PRT-03", "REJ-04 habilitación en publicar convocatoria"],
  ["UC-PRT-07", "UC-INS-04", "REJ-07 historial en corrección"],
  ["UC-PRT-10", "UC-INS-04", "REJ-07 historial en corrección"],
  ["UC-COM-03", "UC-INS-04", "REJ-07 historial en corrección"],
  ["UC-COM-05", "UC-COM-02", "REJ-08 consultar comunicado en publicar"],
  ["UC-COM-12", "UC-COM-09", "REJ-09 archivar conversación en enviar"],
  ["UC-COM-12", "UC-COM-06", "REJ-09 archivar conversación en abrir"],
  ["UC-COM-12", "UC-COM-08", "REJ-09 archivar conversación en abrir"],
  ["UC-STR-05", "UC-STR-12", "REJ-06 archivar estructura en archivar equipo"],
  ["UC-STR-08", "UC-STR-12", "REJ-06 archivar estructura en archivar equipo"],
  ["UC-STR-15", "UC-STR-12", "REJ-06 archivar estructura en archivar equipo"],
  ["UC-COM-13", "UC-COM-14", "EXT-05 reclassificada a SIBLING"],
  ["UC-PPL-06", "UC-PPL-02", "EXT-06 reclassificada a SIBLING"],
];
for (const [a, b, why] of REJECTED_PAIRS) {
  for (const kind of ["include", "extend"]) {
    if (drawnKeys.has(`${a}->${b}|${kind}`) || drawnKeys.has(`${b}->${a}|${kind}`)) {
      failCheck("REJECTED_RELATION_DRAWN", `${a} <-> ${b} (${why})`);
    }
  }
}
// REJ-01 / REJ-02 : no global fan toward authentication from every CU
const authTargets = drawnRelations.filter((r) => r.to === "UC-IAM-01");
if (authTargets.length) failCheck("REJECTED_RELATION_DRAWN", `REJ-02 login como include (${authTargets.length} aristas)`);

// every CU must carry at least one actor association, directly or through the abstract actor's generalization
const generalizedChildren = new Set(drawnGeneralizations.map((g) => g.child));
const ucWithAssociation = new Set(drawnAssociations.map((a) => a.uc));
const abstractInFile = (file) => drawnGeneralizations.some((g) => g.parent === "ACT-AUTHENTICATED" && g.file === file);
for (const [id, filesFor] of ucSeen) {
  if (ucWithAssociation.has(id)) continue;
  const inherited = [...filesFor].some((f) => abstractInFile(f) && generalizedChildren.size > 0);
  if (!inherited) failCheck("UC_WITHOUT_ACTOR_ASSOCIATION", id);
}

// ---------------------------------------------------------------- report

const layout = fs.existsSync("docs/uml/use-cases/evidence/_layout-report.json")
  ? JSON.parse(fs.readFileSync("docs/uml/use-cases/evidence/_layout-report.json", "utf8")) : [];

const lines = [];
lines.push("GEI E4 — VALIDACIÓN DE ARTEFACTOS DRAW.IO DE CASOS DE USO");
lines.push("=".repeat(72));
lines.push(`Archivos .drawio analizados ............ ${files.length}`);
lines.push(`Errores XML .......................... ${fail.filter((x) => x.name === "MALFORMED_XML").length}`);
lines.push(`Celdas mxCell con ID duplicado ....... ${fail.filter((x) => x.name === "DUPLICATE_CELL_ID").length}`);
lines.push(`Referencias rotas (parent/edge) ....... ${fail.filter((x) => x.name.startsWith("BROKEN")).length}`);
lines.push("");
lines.push("COBERTURA DE CASOS DE USO");
lines.push(`CU canónicos en el catálogo ........... ${canonical.size}`);
lines.push(`UC únicos representados en los diagramas .. ${ucSeen.size}`);
lines.push(`MISSING .............................. ${missing.length}`);
lines.push(`UNKNOWN_UC ........................... ${unknown.length}`);
lines.push(`RENAMED_ID ........................... ${fail.filter((x) => x.name === "RENAMED_UC").length}`);
lines.push(`UC fuera de su diagrama de dominio ... ${primaryMissing.length}`);
lines.push("");
lines.push("ACTORES");
lines.push(`UNKNOWN_ACTOR ........................ ${fail.filter((x) => x.name === "UNKNOWN_ACTOR").length}`);
lines.push(`Actores E2 representados ................. ${actorsSeen.size} / 8`);
lines.push(`Actor dentro del boundary ............. ${fail.filter((x) => x.name === "ACTOR_INSIDE_BOUNDARY").length}`);
lines.push(`UC fuera del boundary ................ ${fail.filter((x) => x.name === "UC_OUTSIDE_BOUNDARY").length}`);
lines.push(`NO_NEW_GENERALIZATION ................ ${fail.filter((x) => x.name === "NO_NEW_GENERALIZATION").length}`);
lines.push(`Generalizaciones dibujadas ........... ${drawnGeneralizations.length}`);
lines.push("");
lines.push("RELACIONES");
lines.push(`Relaciones dibujadas ................. ${drawnKeys.size}`);
lines.push(`UNKNOWN_RELATION_ENDPOINT ............ ${fail.filter((x) => x.name === "UNKNOWN_RELATION_ENDPOINT").length}`);
lines.push(`UNAUTHORIZED_NEW_RELATION ............ ${fail.filter((x) => x.name === "UNAUTHORIZED_NEW_RELATION").length}`);
lines.push(`REJECTED_RELATION_DRAWN .............. ${fail.filter((x) => x.name === "REJECTED_RELATION_DRAWN").length}`);
lines.push(`Relaciones aprobadas no dibujadas .... ${fail.filter((x) => x.name === "APPROVED_RELATION_NOT_DRAWN").length}`);
lines.push("");
lines.push("QA GEOMÉTRICA (sin renderizador draw.io disponible)");
for (const r of layout) {
  lines.push(`${(r.id + "        ").slice(0, 12)} cols=${r.cols} aristas=${String(r.edges).padStart(3)} ` +
    `assoc=${String(r.assoc).padStart(2)} rel=${String(r.rel).padStart(2)} generalización=${r.gen} ` +
    `cruces=${String(r.crossings).padStart(3)} penetración=${r.pen} texto-desbordado=${r.overflow.length}`);
}
lines.push("");
if (warn.length) {
  lines.push("ADVERTENCIAS (no bloqueantes)");
  for (const w of warn) lines.push(`  [${w.name}] ${w.detail}`);
  lines.push("");
}
if (fail.length) {
  lines.push("FALLOS");
  const grouped = new Map();
  for (const x of fail) {
    if (!grouped.has(x.name)) grouped.set(x.name, []);
    grouped.get(x.name).push(x.detail);
  }
  for (const [name, details] of grouped) {
    lines.push(`  [${name}] x${details.length}`);
    for (const d of details.slice(0, 12)) lines.push(`      ${d}`);
    if (details.length > 12) lines.push(`      ... +${details.length - 12}`);
  }
  lines.push("");
  lines.push(`RESULT: FAIL (${fail.length} finding(s))`);
} else {
  lines.push("RESULT: PASS (0 findings)");
}

const manifestRows = [];
for (const r of layout) {
  const rel = drawnRelations.filter((x) => x.file.startsWith(r.id));
  const inc = rel.filter((x) => x.kind === "include").length;
  const ext = rel.filter((x) => x.kind === "extend").length;
  const gen = drawnGeneralizations.filter((g) => g.file.startsWith(r.id)).length;
  const assoc = drawnAssociations.filter((x) => x.file.startsWith(r.id));
  const ucs = [...ucSeen.entries()].filter(([, s]) => [...s].some((f) => f.startsWith(r.id))).map(([id]) => id);
  manifestRows.push({
    id: r.id, actors: [...new Set(assoc.map((a) => a.actor))], ucs, inc, ext, gen,
    cross: r.crossings, pen: r.pen, ovf: r.overflow.length, cols: r.cols,
  });
}
fs.writeFileSync("docs/uml/use-cases/evidence/_manifest-data.json", JSON.stringify(manifestRows, null, 2), "utf8");

const text = lines.join("\n");
fs.mkdirSync("docs/uml/use-cases/evidence", { recursive: true });
fs.writeFileSync("docs/uml/use-cases/evidence/GEI_DRAWIO_VALIDATION_REPORT.txt", text + "\n", "utf8");
console.log(text);
process.exit(fail.length ? 1 : 0);
