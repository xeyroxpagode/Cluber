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
    if (x < 0 || y < 0 || x + w > 1169 || y + h > 827) {
      offPage += 1;
      // E4 D-10: an element off the page is one failure; a cell that CARRIES TEXT off the page is a
      // distinct, separately countable defect, because the reader loses the words, not just the box.
      if ((c.value || "").trim()) failCheck("TEXT_OFF_PAGE", `${f}: ${c.id} en ${x},${y} ${w}x${h}`);
    }
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
    const ag = ac.geometry;
    const ax = +/x="(-?[\d.]+)"/.exec(ag)[1], ay = +/y="(-?[\d.]+)"/.exec(ag)[1];
    const aw = +/width="(-?[\d.]+)"/.exec(ag)[1];
    const cx = ax + aw / 2;
    // E4-0.1: the previous matcher hardcoded the label offset (ay+44), so changing the actor
    // label geometry silently broke actor identity resolution. Match instead on the nearest
    // label below the figure whose horizontal span contains the figure's centre.
    const cands = textCells.filter((c) => {
      const cg = c.geometry;
      const tx = +/x="(-?[\d.]+)"/.exec(cg)[1], tw = +/width="(-?[\d.]+)"/.exec(cg)[1];
      const ty = +/y="(-?[\d.]+)"/.exec(cg)[1];
      return decode(c.value).includes("ACT-") && ty >= ay && tx <= cx && cx <= tx + tw;
    }).sort((p, q) => +/y="(-?[\d.]+)"/.exec(p.geometry)[1] - +/y="(-?[\d.]+)"/.exec(q.geometry)[1]);
    const lab = cands[0];
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

// E4-0.1 FINAL relation set. See docs/uml/use-cases/GEI_USE_CASE_RELATION_DECISIONS_V1.md.
// INC-01 is now a transversal rule with ZERO drawn edges (REQ-IAM-009 AC 2 bypasses
// reauthentication, so it cannot be <<include>>, and no authority enumerates the perimeter).
const ALLOWED = new Map();
for (const s of ["UC-EVT-05", "UC-EVT-07", "UC-EVT-08"]) {
  ALLOWED.set(`${s}->UC-EVT-11|include`, "INC-02");
}
ALLOWED.set("UC-EVT-11->UC-EVT-04|extend", "INC-02");
ALLOWED.set("UC-EVT-11->UC-EVT-16|extend", "INC-02");
ALLOWED.set("UC-EVT-12->UC-EVT-04|extend", "EXT-01");

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
  // E4-0.1: EXT-02 / EXT-03 / EXT-04 reclassified to SIBLING. The base completes successfully
  // first, so the correcting/reviewing use case is a separate objective, not an extension.
  ["UC-PRT-07", "UC-PRT-05", "EXT-02 reclassificada a SIBLING"],
  ["UC-PRT-07", "UC-PRT-06", "EXT-02 reclassificada a SIBLING"],
  ["UC-PRT-10", "UC-PRT-09", "EXT-03 reclassificada a SIBLING"],
  ["UC-PRT-04", "UC-PRT-02", "EXT-04 reclassificada a SIBLING"],
  ["UC-PRT-04", "UC-PRT-03", "EXT-04 reclassificada a SIBLING"],
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
// INC-01 reclassified: UC-IAM-09 must not be the target of any drawn relation.
const reauthAristas = drawnRelations.filter((r) => r.to === "UC-IAM-09" || r.from === "UC-IAM-09");
if (reauthAristas.length) failCheck("REJECTED_RELATION_DRAWN", `INC-01 reautenticacion dibujada como arista (${reauthAristas.length})`);

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

// ---------------------------------------------------------------- E4-0.1 NEW CHECKS
// Three defect classes the V1 gate could not see. Each one previously passed as clean:
//  1. DRAWIO_INVALID_WAYPOINTS — <Array as="points"> written as space-separated "x,y x,y" text
//     instead of <mxPoint> children. Still well-formed XML, but draw.io cannot parse the
//     geometry: every connector collapses to a straight line and headless export fails.
//  2. CONNECTOR_OVERLAP — two axis-aligned connectors lying on the same line. Invisible to a
//     proper-crossing test (all cross products are 0) yet unreadable when drawn.
//  3. LABEL_FIGURE_OVERLAP and TYPOGRAPHY_BELOW_11PT.

function parseWaypointArrays(xml, file) {
  // E4-0.1: a raw "<" or ">" inside an attribute value makes the document malformed XML. The
  // regex-based parser used everywhere else here does not notice, and diagrams.net silently
  // drops the offending cells: UCD-00 shipped with eight invisible domain packages because the
  // package label carried a raw <i> tag. This is a real well-formedness check, not a heuristic.
  for (const m of xml.matchAll(/<mxCell\b([^>]*)>/g)) {
    for (const a of m[1].matchAll(/([a-zA-Z]+)="([^"]*)"/g)) {
      if (/[<>]/.test(a[2])) {
        failCheck("RAW_ANGLE_IN_ATTRIBUTE", `${file}: ${a[1]}="${a[2].slice(0, 50)}" -> XML malformado`);
      }
    }
  }

  let bad = 0;
  for (const m of xml.matchAll(/<Array as="points">([\s\S]*?)<\/Array>/g)) {
    const inner = m[1].trim();
    if (!inner) continue;
    if (!/<mxPoint\b/.test(inner)) {
      bad += 1;
      failCheck("DRAWIO_INVALID_WAYPOINTS", `${file}: <Array as="points"> sin <mxPoint> -> ${inner.slice(0, 60)}`);
    }
  }
  // An edge-label child with relative="1" carries x/y as a FRACTION of the edge length.
  // A pixel value there displaces the label by that many edge-lengths and explodes the export
  // bounding box. Proven: x="-244" produced a 232,136 px wide render of an A4 page.
  for (const m of xml.matchAll(/<mxCell\b[^>]*style="edgeLabel[\s\S]*?<\/mxCell>/g)) {
    const g = (m[0].match(/<mxGeometry([^>]*)>/) || [])[1] || "";
    if (!/relative="1"/.test(g)) continue;
    const gx = /x="(-?[\d.]+)"/.exec(g), gy = /y="(-?[\d.]+)"/.exec(g);
    for (const [k, v] of [["x", gx], ["y", gy]]) {
      if (v && Math.abs(+v[1]) > 1) failCheck("EDGE_LABEL_BAD_OFFSET", `${file}: edgeLabel ${k}=${v[1]} es una fracción de la longitud de la arista, no píxeles`);
    }
  }
  return bad;
}

function styleNum(style, key) {
  const m = (style || "").match(new RegExp("(?:^|;)" + key + "=(-?[\\d.]+)"));
  return m ? +m[1] : null;
}

function boundaryToward(center, rect, toward) {
  const dx = toward.x - center.x, dy = toward.y - center.y;
  let t = Infinity;
  const test = (n, d) => {
    if (Math.abs(d) > 1e-12) { const u = n / d; if (u > 1e-6 && u < 1) t = Math.min(t, u); }
  };
  test(rect.x - center.x, dx);
  test(rect.x + rect.w - center.x, dx);
  test(rect.y - center.y, dy);
  test(rect.y + rect.h - center.y, dy);
  if (!Number.isFinite(t)) return { x: toward.x, y: toward.y };
  return { x: center.x + dx * t, y: center.y + dy * t };
}

function overlapLen(a, b) {
  const aH = Math.abs(a[0].y - a[1].y) < 1e-9, bH = Math.abs(b[0].y - b[1].y) < 1e-9;
  const aV = Math.abs(a[0].x - a[1].x) < 1e-9, bV = Math.abs(b[0].x - b[1].x) < 1e-9;
  if (aH && bH) {
    if (Math.abs(a[0].y - b[0].y) > 1e-9) return 0;
    const lo = Math.max(Math.min(a[0].x, a[1].x), Math.min(b[0].x, b[1].x));
    const hi = Math.min(Math.max(a[0].x, a[1].x), Math.max(b[0].x, b[1].x));
    return Math.max(0, hi - lo);
  }
  if (aV && bV) {
    if (Math.abs(a[0].x - b[0].x) > 1e-9) return 0;
    const lo = Math.max(Math.min(a[0].y, a[1].y), Math.min(b[0].y, b[1].y));
    const hi = Math.min(Math.max(a[0].y, a[1].y), Math.max(b[0].y, b[1].y));
    return Math.max(0, hi - lo);
  }
  return 0;
}

const geomReport = [];
let labelCount = 0;

for (const f of files) {
  const xml = fs.readFileSync(path.join(SRC, f), "utf8");
  parseWaypointArrays(xml, f);

  // typography floor: nothing readable in print may sit below 11 pt
  for (const m of xml.matchAll(/fontSize="([\d.]+)"/g)) {
    if (+m[1] < 11) failCheck("TYPOGRAPHY_BELOW_11PT", `${f}: fontSize=${m[1]}`);
  }

  // geometry + attachment points, replicating diagrams.net
  const geo = new Map();
  const boxes = [];
  for (const m of xml.matchAll(/<mxCell\b([^>]*?)vertex="1"([^>]*?)>([\s\S]*?)<\/mxCell>/g)) {
    const attrs = m[1] + m[2];
    const id = (attrs.match(/\bid="([^"]*)"/) || [])[1];
    const style = (attrs.match(/\bstyle="([^"]*)"/) || [])[1] || "";
    const g = (m[3].match(/<mxGeometry([^>]*)\/>/) || [])[1] || "";
    const gv = (k) => { const r = g.match(new RegExp(k + '="(-?[\\d.]+)"')); return r ? +r[1] : null; };
    const x = gv("x"), y = gv("y"), w = gv("width"), h = gv("height");
    if (x == null || w == null) continue;
    const r = { x, y, w, h, cx: x + w / 2, cy: y + h / 2, id, style };
    r.value = (attrs.match(/\bvalue="([^"]*)"/) || [])[1] || "";
    geo.set(id, r);
    boxes.push(r);
  }

  // an actor label must not sit on top of the next actor figure
  const actors = boxes.filter((b) => /shape=umlActor/.test(b.style)).sort((a, b) => a.y - b.y);
  const texts = boxes.filter((b) => /style="text;/.test(b.style)).sort((a, b) => a.y - b.y);
  const hit = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  for (const t of texts) {
    for (const a of actors) if (hit(t, a)) failCheck("LABEL_FIGURE_OVERLAP", `${f}: texto ${JSON.stringify(t.value || "").slice(0, 30)} sobre actor ${a.id}`);
  }
  for (let i = 0; i < actors.length; i++) {
    for (let j = i + 1; j < actors.length; j++) if (hit(actors[i], actors[j])) failCheck("ACTOR_OVERLAP", `${f}: ${actors[i].id} sobre ${actors[j].id}`);
  }

  // connector overlap, measured where draw.io actually attaches
  const edges = [];
  for (const m of xml.matchAll(/<mxCell\b([^>]*?)edge="1"([^>]*?)>([\s\S]*?)<\/mxCell>/g)) {
    const attrs = m[1] + m[2];
    const id = (attrs.match(/\bid="([^"]*)"/) || [])[1];
    const style = (attrs.match(/\bstyle="([^"]*)"/) || [])[1] || "";
    const source = (attrs.match(/\bsource="([^"]*)"/) || [])[1];
    const target = (attrs.match(/\btarget="([^"]*)"/) || [])[1];
    const raw = (m[3].match(/<Array as="points">([\s\S]*?)<\/Array>/) || [])[1];
    const pts = raw ? [...raw.matchAll(/<mxPoint\s+x="(-?[\d.]+)"\s+y="(-?[\d.]+)"\s*\/>/g)].map((q) => ({ x: +q[1], y: +q[2] })) : [];
    edges.push({ id, style, source, target, pts });
  }
  const segsOf = (e) => {
    const a = geo.get(e.source), b = geo.get(e.target);
    if (!a || !b) return [];
    const first = e.pts[0] || { x: b.cx, y: b.cy };
    const last = e.pts[e.pts.length - 1] || { x: a.cx, y: a.cy };
    const ex = styleNum(e.style, "exitX"), ey = styleNum(e.style, "exitY");
    const nx = styleNum(e.style, "entryX"), ny = styleNum(e.style, "entryY");
    const from = ex != null && ey != null ? { x: a.x + a.w * ex, y: a.y + a.h * ey } : boundaryToward({ x: a.cx, y: a.cy }, a, first);
    const to = nx != null && ny != null ? { x: b.x + b.w * nx, y: b.y + b.h * ny } : boundaryToward({ x: b.cx, y: b.cy }, b, last);
    const all = [from, ...e.pts, to];
    const out = [];
    for (let i = 0; i < all.length - 1; i++) out.push([all[i], all[i + 1]]);
    return out;
  };
  const segs = edges.map(segsOf);
  let ovPx = 0;
  for (let i = 0; i < edges.length; i++) {
    for (let j = i + 1; j < edges.length; j++) {
      let ol = 0;
      for (const sa of segs[i]) for (const sb of segs[j]) ol += overlapLen(sa, sb);
      if (ol > 1) { ovPx += ol; warn.push({ name: "CONNECTOR_OVERLAP", detail: `${f}: ${edges[i].id} x ${edges[j].id} = ${Math.round(ol)}px` }); }
    }
  }
  geomReport.push({ f, edges: edges.length, overlapPx: Math.round(ovPx) });

  // ---------------------------------------------------------------- E4 D-10
  // Relation label geometry, re-derived from the EMITTED FILE and not from the generator's intent.
  // This is the whole point of the check: the generator believed it had placed five labels in five
  // slots, and the previous release showed five labels stacked on one spot. What is checked here is
  // what draw.io will draw — anchor = point at (geometry.x * total polyline length), then the
  // <mxPoint as="offset"> pixel nudge — recomputed from the file with its own arithmetic.
  const edgeById = new Map(edges.map((e) => [e.id, e]));
  // boundary box, read again here so the label check can test containment without sharing state
  // with the structural pass above.
  const bCell = (xml.match(/<mxCell\b[^>]*\bid="boundary"[^>]*>[\s\S]*?<\/mxCell>/) || [""])[0];
  const bGeom = (bCell.match(/<mxGeometry([^>]*)\/>/) || [])[1] || "";
  const bg = (k) => { const r2 = bGeom.match(new RegExp(k + '="(-?[\\d.]+)"')); return r2 ? +r2[1] : 0; };
  const bx = bg("x"), by = bg("y"), bw = bg("width"), bh = bg("height");
  // E4 D-10: the boundary label is text drawn inside the boundary rect. Same calibration as the
  // generator (12 pt bold ~ 0.62 em advance, spacingLeft 10, spacingTop 8) so the two agree on
  // where the words actually end; the text itself is read back from the emitted value attribute.
  const bValue = decode((bCell.match(/\bvalue="([^"]*)"/) || [])[1] || "");
  const bChars = bValue.length;
  const bTextW = Math.ceil(bChars * 12 * 0.62);
  const bLineCount = Math.max(1, Math.ceil(bTextW / (bw - 20)));
  const blz = {
    x: bx + 10, y: by + 8,
    w: Math.min(bTextW, bw - 20), h: bLineCount * 16 + 4, id: "boundary-label",
  };
  const labelRects = [];
  for (const m of xml.matchAll(/<mxCell\b([^>]*?)vertex="1"([^>]*?)>([\s\S]*?)<\/mxCell>/g)) {
    const attrs = m[1] + m[2];
    const style = (attrs.match(/\bstyle="([^"]*)"/) || [])[1] || "";
    if (!/edgeLabel/.test(style)) continue;
    const parent = (attrs.match(/\bparent="([^"]*)"/) || [])[1];
    const value = decode((attrs.match(/\bvalue="([^"]*)"/) || [])[1] || "");
    const lines = value.split(/<br\s*\/?>/i).map((s) => s.trim()).filter(Boolean);
    const fontSize = styleNum(style, "fontSize") || 0;
    const edge = edgeById.get(parent);
    if (!edge) { failCheck("RELATION_LABEL_UNREADABLE", `${f}: label colgado de una arista inexistente ${parent}`); continue; }
    if (!lines.length) { failCheck("RELATION_LABEL_UNREADABLE", `${f}: ${parent} label sin texto`); continue; }
    if (fontSize < 11) { failCheck("RELATION_LABEL_UNREADABLE", `${f}: ${parent} fontSize=${fontSize}`); continue; }
    const g = (m[3].match(/<mxGeometry([^>]*)>/) || [])[1] || "";
    const frac = (g.match(/\bx="(-?[\d.]+)"/) || [])[1];
    const off = (m[3].match(/<mxPoint\s+as="offset"\s+x="(-?[\d.]+)"\s+y="(-?[\d.]+)"/) || []);
    if (frac == null || !/relative="1"/.test(g)) {
      failCheck("RELATION_LABEL_UNREADABLE", `${f}: ${parent} sin mxGeometry relative="1"`);
      continue;
    }
    const s = segs[edges.indexOf(edge)];
    let total = 0;
    for (const [p, q] of s) total += Math.abs(p.x - q.x) + Math.abs(p.y - q.y);
    let walk = total * +frac;
    let ax = s.length ? s[0][0].x : 0, ay = s.length ? s[0][0].y : 0;
    for (const [p, q] of s) {
      const len = Math.abs(p.x - q.x) + Math.abs(p.y - q.y);
      if (len <= 1e-9) continue;
      if (walk <= len) { ax = p.x + (q.x - p.x) * (walk / len); ay = p.y + (q.y - p.y) * (walk / len); break; }
      walk -= len;
      ax = q.x; ay = q.y;
    }
    const ox = off[1] ? +off[1] : 0, oy = off[2] ? +off[2] : 0;
    // Box metrics mirror the generator's labels.mjs metric (Helvetica ~0.62 em advance, 16 px lines).
    const w = Math.ceil(Math.max(...lines.map((l) => l.length)) * fontSize * 0.62) + 12;
    const h = lines.length * 16 + 4;
    const cx = ax + ox, cy = ay + oy;
    const rect = { x: cx - w / 2, y: cy - h / 2, w, h };
    const name = `${value.replace(/<br\s*\/?>/gi, " ")} (${parent})`;
    if (rect.x < 0 || rect.y < 0 || rect.x + w > 1169 || rect.y + h > 827) {
      failCheck("RELATION_LABEL_OUTSIDE_PAGE", `${f}: ${name} en ${rect.x.toFixed(0)},${rect.y.toFixed(0)} ${w}x${h}`);
    }
    if (rect.x < bx - 0.5 || rect.y < by - 0.5 || rect.x + w > bx + bw + 0.5 || rect.y + h > by + bh + 0.5) {
      failCheck("RELATION_LABEL_UNREADABLE", `${f}: ${name} fuera del system boundary`);
    }
    labelRects.push({ name, rect });
    labelCount += 1;
  }
  for (let i = 0; i < labelRects.length; i++) {
    for (let j = i + 1; j < labelRects.length; j++) {
      if (hit(labelRects[i].rect, labelRects[j].rect)) {
        failCheck("RELATION_LABEL_OVERLAP", `${f}: ${labelRects[i].name} x ${labelRects[j].name}`);
      }
    }
    for (const b of boxes) {
      if (/edgeLabel/.test(b.style) || /ellipse;/.test(b.style) === false && !/shape=umlActor/.test(b.style) && !/style="text;/.test(b.style)) continue;
      if (hit(labelRects[i].rect, b)) {
        failCheck("RELATION_LABEL_TO_NODE_OVERLAP", `${f}: ${labelRects[i].name} sobre ${b.id}`);
      }
    }
    if (hit(labelRects[i].rect, blz)) {
      failCheck("RELATION_LABEL_TO_NODE_OVERLAP", `${f}: ${labelRects[i].name} sobre el texto del boundary`);
    }
  }
}

const layout = fs.existsSync("docs/uml/use-cases/evidence/_layout-report.json")
  ? JSON.parse(fs.readFileSync("docs/uml/use-cases/evidence/_layout-report.json", "utf8")) : [];
// E4 D-10: TEXT_CLIPPING also covers use case text that does not fit inside its own ellipse, which
// the generator measures and records per sheet.
const ucOverflow = layout.reduce((s, r) => s + (r.overflow ? r.overflow.length : 0), 0);
if (ucOverflow) failCheck("UC_TEXT_OVERFLOWS_ELLIPSE", `${ucOverflow} etiqueta(s) de CU exceden su elipse`);

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
lines.push("QA GEOMÉTRICA (medida con las reglas de anclaje de diagrams.net)");
for (const r of layout) {
  lines.push(`${(r.id + "        ").slice(0, 12)} cols=${r.cols} aristas=${String(r.edges).padStart(3)} ` +
    `assoc=${String(r.assoc).padStart(2)} rel=${String(r.rel).padStart(2)} generalización=${r.gen} ` +
    `cruces=${String(r.crossings).padStart(3)} solape=${String(r.overlapPx).padStart(5)}px penetración=${r.pen} texto-desbordado=${r.overflow.length}`);
}
lines.push("");
lines.push("QA DE ANCLAJE Y SOLAPE (E4-0.1, midiendo el archivo real)");
lines.push(`DRAWIO_INVALID_WAYPOINTS ............. ${fail.filter((x) => x.name === "DRAWIO_INVALID_WAYPOINTS").length}`);
lines.push(`RAW_ANGLE_IN_ATTRIBUTE ............... ${fail.filter((x) => x.name === "RAW_ANGLE_IN_ATTRIBUTE").length}`);
lines.push(`EDGE_LABEL_BAD_OFFSET ............... ${fail.filter((x) => x.name === "EDGE_LABEL_BAD_OFFSET").length}`);
lines.push(`CONNECTOR_OVERLAP (pares) ............ ${warn.filter((x) => x.name === "CONNECTOR_OVERLAP").length}`);
lines.push(`Solape colineal total ................. ${geomReport.reduce((s, r) => s + r.overlapPx, 0)} px`);
lines.push(`LABEL_FIGURE_OVERLAP ................ ${fail.filter((x) => x.name === "LABEL_FIGURE_OVERLAP").length}`);
lines.push(`ACTOR_OVERLAP ....................... ${fail.filter((x) => x.name === "ACTOR_OVERLAP").length}`);
lines.push(`TYPOGRAPHY_BELOW_11PT ............... ${fail.filter((x) => x.name === "TYPOGRAPHY_BELOW_11PT").length}`);
lines.push("");
lines.push("QA DE ETIQUETAS DE RELACIÓN (E4 D-10, geometría re-derivada del archivo)");
lines.push(`RELATION_LABEL_OVERLAP .............. ${fail.filter((x) => x.name === "RELATION_LABEL_OVERLAP").length}`);
lines.push(`RELATION_LABEL_TO_NODE_OVERLAP ..... ${fail.filter((x) => x.name === "RELATION_LABEL_TO_NODE_OVERLAP").length}`);
lines.push(`RELATION_LABEL_OUTSIDE_PAGE ........ ${fail.filter((x) => x.name === "RELATION_LABEL_OUTSIDE_PAGE").length}`);
lines.push(`RELATION_LABEL_UNREADABLE .......... ${fail.filter((x) => x.name === "RELATION_LABEL_UNREADABLE").length}`);
lines.push(`Etiquetas de relación medidas ....... ${labelCount}`);
lines.push("");
lines.push("PÁGINA Y RECORTE DE TEXTO");
lines.push(`OUT_OF_PAGE (ELEMENT_OFF_PAGE) ...... ${fail.filter((x) => x.name === "ELEMENT_OFF_PAGE").length}`);
lines.push(`TEXT_CLIPPING (texto fuera de página) ${fail.filter((x) => x.name === "TEXT_OFF_PAGE").length}`);
lines.push(`TEXT_CLIPPING (texto mayor que elipse) ${ucOverflow}`);
lines.push(`TYPOGRAPHY_BELOW_THRESHOLD ......... ${fail.filter((x) => x.name === "TYPOGRAPHY_BELOW_11PT").length}`);
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
