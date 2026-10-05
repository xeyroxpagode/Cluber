#!/usr/bin/env node
// GEI E4 — workbook update. Cell-level mutation only.
// Styles, formulas, validations, tables, chart and sheet set are preserved byte-for-byte
// except for the specific cells and ranges listed in E4_USE_CASE_DIAGRAM_FREEZE_V1.md.

import fs from "node:fs";
import { readZip, writeZip } from "./lib/zipxlsx.mjs";
import { readSheet, sheetParts, encode } from "./lib/xlsx.mjs";

const FILE = "docs/project-control/GEI_Roadmap_Maestro_Proyecto.xlsx";
const entries = readZip(FILE);
const parts = sheetParts(entries);
const nameOf = (n) => parts[n - 1];

// idempotence guard: appendRow is not idempotent, so refuse to run twice
{
  const back = readSheet(entries, parts[3].partName);
  const ids = back.map((r) => (r.cells.find((c) => c.colName === "A") || {}).value).filter(Boolean);
  if (ids.some((v) => /^E4-0\d$/.test(v))) {
    console.error(`ABORT: ${FILE} ya contiene filas de backlog E4. Restaura el archivo antes de re-ejecutar.`);
    process.exit(2);
  }
}

const S = {
  resumen: parts[0].partName,
  roadmap: parts[1].partName,
  control: parts[2].partName,
  backlog: parts[3].partName,
  artefactos: parts[4].partName,
  decisiones: parts[5].partName,
  riesgos: parts[6].partName,
  dependencias: parts[7].partName,
  listas: parts[8].partName,
};
void nameOf;

const STYLE = {
  // reuse the exact style ids already present in the neighbouring rows of each sheet
  roadmapData: 24,
  backlogData: 24,
  artefactoData: 24,
  decisionData: 24,
};

// ---------------------------------------------------------------- edit primitives

function setCell(xml, ref, { value = null, type = "str", formula = null, style = null } = {}) {
  const cellRe = new RegExp(`(<x:c\\s+r="${ref}"[^>]*?)(/>|>([\\s\\S]*?)</x:c>)`);
  const m = xml.match(cellRe);
  const attrs = m ? m[1] : `<x:c r="${ref}"`;
  const attrMap = {};
  for (const a of attrs.matchAll(/([\w.:-]+)="([^"]*)"/g)) attrMap[a[1]] = a[2];
  if (style != null) attrMap.s = String(style);
  if (value == null) delete attrMap.t;
  else attrMap.t = type;
  const attrStr = Object.entries(attrMap).map(([k, v]) => ` ${k}="${v}"`).join("");
  let inner = "";
  if (formula != null) inner += `<x:f>${encode(formula)}</x:f>`;
  if (value != null) inner += `<x:v>${encode(String(value))}</x:v>`;
  const open = `<x:c${attrStr}>`;
  const close = `</x:c>`;
  const replacement = `${open}${inner}${close}`;
  // Function replacer is mandatory: a string replacement would interpret the "$3" and "$&"
  // sequences inside spreadsheet formulas such as Backlog!$A$3:$A$1000 as capture references
  // and silently corrupt the cell.
  if (m) return xml.replace(cellRe, () => replacement);
  return xml.replace("</x:sheetData>", () => `${replacement}</x:sheetData>`);
}

function appendRow(xml, cells, style) {
  // find the last <x:row ...> and inject a new one after it
  const rows = [...xml.matchAll(/<x:row\s+r="(\d+)"[^>]*?(?:\/>|>[\s\S]*?<\/x:row>)/g)];
  const lastNum = rows.length ? Number(rows[rows.length - 1][1]) : 1;
  const r = lastNum + 1;
  const body = cells.map((v, i) => {
    const col = colName(i);
    const s = style == null ? "" : ` s="${style}"`;
    if (v == null) return `<x:c r="${col}${r}"${s} />`;
    return `<x:c r="${col}${r}"${s} t="str"><x:v>${encode(String(v))}</x:v></x:c>`;
  }).join("");
  const newRow = `<x:row r="${r}" ht="15" hidden="0" customHeight="1">${body}</x:row>`;
  return { xml: xml.replace("</x:sheetData>", () => `${newRow}</x:sheetData>`), row: r };
}

function colName(i) {
  let n = i + 1, s = "";
  while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
}

function getPart(name) {
  const e = entries.find((x) => x.name === name);
  if (!e) throw new Error(`missing part ${name}`);
  return e;
}

// ---------------------------------------------------------------- E4 backlog

const E4_TASKS = [
  ["E4-01", 4, "Use Case Diagrams", "Preflight: verificar baseline, autoridades de E3 y baseline de integridad (typecheck, test, build).", "Gestión", "P0", "Único integrante", "Cerrado", "Etapa 3 cerrada", "Baseline E3 SHA registrado; pnpm typecheck/test/build en PASS; 0 cambios en src/**.", "docs/uml/use-cases/GEI_USE_CASE_DIAGRAM_RECONSTRUCTION_AUDIT_V1.md §1"],
  ["E4-02", 4, "Use Case Diagrams", "Resolver las 8 candidatas include/extend y confirmar la no dibujado de las 9 rechazadas.", "Decisión", "P0", "Único integrante", "Cerrado", "E4-01", "8/8 candidatas decididas; 0 UNDECIDED; 0 DEFER; 0 relación nueva; REJECTED_RELATION_DRAWN=0.", "docs/uml/use-cases/GEI_USE_CASE_RELATION_DECISIONS_V1.md"],
  ["E4-03", 4, "Use Case Diagrams", "Diseñar la topología de láminas a partir de relaciones y actores reales, sin forzar 1 diagrama por dominio.", "Diseño", "P0", "Único integrante", "Cerrado", "E4-02", "16 láminas de detalle + 1 mapa maestro; división justificada por co-localización de relaciones y densidad.", "docs/uml/use-cases/GEI_USE_CASE_DIAGRAM_MANIFEST_V1.md §2, §4"],
  ["E4-04", 4, "Use Case Diagrams", "Generar los .drawio no comprimidos y editables de diagrams.net.", "Implementación", "P0", "Único integrante", "Cerrado", "E4-03", "17 archivos .drawio; XML bien formado; mxfile/diagram/mxGraphModel presentes; IDs únicos; texto y conectores editables.", "docs/uml/use-cases/source/"],
  ["E4-05", 4, "Use Case Diagrams", "Validar cobertura 102/102, catálogo de actores, autorización de relaciones, generalizaciones y geometría.", "QA", "P0", "Único integrante", "Cerrado", "E4-04", "PASS 0 findings: MISSING=0, UNKNOWN_UC=0, RENAMED_ID=0, UNKNOWN_ACTOR=0, NO_NEW_GENERALIZATION=0, UNAUTHORIZED_NEW_RELATION=0, REJECTED_RELATION_DRAWN=0.", "docs/uml/use-cases/evidence/GEI_DRAWIO_VALIDATION_REPORT.txt"],
  ["E4-06", 4, "Use Case Diagrams", "QA visual y export a PDF/PNG.", "QA", "P0", "Único integrante", "En revisión", "E4-05", "PARCIAL: sin CLI de draw.io no hay render ni export. QA geométrica PASS (0 penetración, 0 texto desbordado). Bloqueo declarado: EXPORT_BLOCKED_NO_DRAWIO_CLI.", "docs/uml/use-cases/export/README.md"],
  ["E4-07", 4, "Use Case Diagrams", "Gate de Etapa 4 y freeze del diagrama de casos de uso.", "Gestión", "P0", "Único integrante", "Cerrado", "E4-05,E4-06", "Gate PARTIAL: E4-06 queda En revisión por falta de render. Freeze V1 emitido con las desviaciones declaradas. Siguiente: E5.", "docs/uml/use-cases/GEI_USE_CASE_DIAGRAM_FREEZE_V1.md"],
];

// ---------------------------------------------------------------- mutations

const touched = [];

// 1. Roadmap: E1, E2, E3, E4 state + next action
{
  const e = getPart(S.roadmap);
  let xml = e.data.toString("utf8");
  const rows = readSheet(entries, S.roadmap);
  const byStage = new Map();
  for (const r of rows) {
    const a = r.cells.find((c) => c.colName === "A");
    if (a && /^\d+$/.test(a.value)) byStage.set(Number(a.value), r.row);
  }
  const setStage = (stage, estado, accion) => {
    const r = byStage.get(stage);
    if (!r) throw new Error(`stage ${stage} not found in Roadmap`);
    xml = setCell(xml, `F${r}`, { value: estado });
    xml = setCell(xml, `G${r}`, { value: 0, type: "n", formula: `IF(COUNTIF(Backlog!$B:$B,A${r})=0,0,COUNTIFS(Backlog!$B:$B,A${r},Backlog!$H:$H,"Cerrado")/COUNTIF(Backlog!$B:$B,A${r}))` });
    xml = setCell(xml, `H${r}`, { value: accion });
    touched.push(`Roadmap!F${r}=${estado}`);
  };
  setStage(1, "Cerrado", "Etapa 1 cerrada: requisitos congelados en V1.");
  setStage(2, "Cerrado", "Etapa 2 cerrada: modelo de actores congelado en V1.");
  setStage(3, "Cerrado", "Etapa 3 cerrada: inventario maestro de casos de uso congelado en V1.");
  setStage(4, "Cerrado", "Abrir Etapa 5: especificaciones de TODOS los casos de uso.");
  e.data = Buffer.from(xml, "utf8");
}

// 2. Backlog: close E1–E3 rows (real closures, evidenced) and append E4-01..E4-07
{
  const e = getPart(S.backlog);
  let xml = e.data.toString("utf8");
  const rows = readSheet(entries, S.backlog);
  const closeWithEvidence = {
    "E1-01": "docs/requirements/GEI_REQUIREMENTS_RECONSTRUCTION_AUDIT_V1.md",
    "E1-02": "docs/use-cases/GEI_PRE_E3_INPUT_CLOSURE_V1.md (errata de E1)",
    "E1-03": "docs/requirements/GEI_REQUIREMENTS_FREEZE_V1.md",
    "E2-01": "docs/actors/GEI_ACTOR_RECONSTRUCTION_AUDIT_V1.md",
    "E2-02": "docs/actors/GEI_ACTOR_MODEL_FREEZE_V1.md",
    "E3-01": "docs/use-cases/GEI_MASTER_USE_CASE_CATALOG_V1.md",
    "E3-02": "docs/use-cases/GEI_MASTER_USE_CASE_INVENTORY_FREEZE_V1.md",
  };
  for (const r of rows) {
    const a = r.cells.find((c) => c.colName === "A");
    if (!a) continue;
    const id = a.value;
    if (closeWithEvidence[id]) {
      xml = setCell(xml, `H${r.row}`, { value: "Cerrado" });
      xml = setCell(xml, `K${r.row}`, { value: closeWithEvidence[id] });
      touched.push(`Backlog!H${r.row}=Cerrado (${id})`);
    }
  }
  for (const t of E4_TASKS) {
    const res = appendRow(xml, t, STYLE.backlogData);
    xml = res.xml;
    touched.push(`Backlog!A${res.row}=${t[0]}`);
  }
  e.data = Buffer.from(xml, "utf8");
  var BACKLOG_LAST_ROW = 26 + E4_TASKS.length;
}

// 3. Backlog table range + data validation ranges must follow the new rows.
//    sqref also appears on <x:conditionalFormatting>, so the replacement must be
//    scoped to the <x:dataValidations> block or it silently widens the wrong ranges.
{
  const t = getPart("xl/tables/table2.xml");
  t.data = Buffer.from(t.data.toString("utf8").replace('ref="A2:K26"', () => `ref="A2:K${BACKLOG_LAST_ROW}"`), "utf8");
  touched.push(`BacklogTable ref -> A2:K${BACKLOG_LAST_ROW}`);
  const s = getPart(S.backlog);
  let xml = s.data.toString("utf8");
  const blockRe = /<x:dataValidations\b[\s\S]*?<\/x:dataValidations>/;
  const block = xml.match(blockRe);
  if (!block) throw new Error("Backlog: no <x:dataValidations> block found");
  let newBlock = block[0]
    .replace(/(<x:dataValidation\b[^>]*sqref=")E3:E26(")/, `$1E3:E${BACKLOG_LAST_ROW}$2`)
    .replace(/(<x:dataValidation\b[^>]*sqref=")F3:F26(")/, `$1F3:F${BACKLOG_LAST_ROW}$2`)
    .replace(/(<x:dataValidation\b[^>]*sqref=")H3:H26(")/, `$1H3:H${BACKLOG_LAST_ROW}$2`);
  const found = [...newBlock.matchAll(/<x:dataValidation\b[^>]*sqref="([^"]+)"/g)].map((m) => m[1]);
  if (found.join(",") !== `E3:E${BACKLOG_LAST_ROW},F3:F${BACKLOG_LAST_ROW},H3:H${BACKLOG_LAST_ROW}`) {
    throw new Error(`Backlog: validation ranges not extended as expected -> ${found.join(",")}`);
  }
  xml = xml.replace(blockRe, () => newBlock);
  // conditional formatting uses the same sqref rows and must reach the new E4 rows too
  let cf = 0;
  xml = xml.replace(/(<x:conditionalFormatting\b[^>]*sqref="[^"]*?)26(")/g, (m, a, b) => {
    cf += 1;
    return `${a}${BACKLOG_LAST_ROW}${b}`;
  });
  touched.push(`conditionalFormatting de Backlog extendido en ${cf} rango(s)`);
  s.data = Buffer.from(xml, "utf8");
  touched.push(`dataValidations de Backlog -> ${found.join(" ")}`);
}

// 4. Artefactos: register the E4 deliverables
{
  const e = getPart(S.artefactos);
  let xml = e.data.toString("utf8");
  const ARTEFACTOS = [
    ["ART-010", "Use Case Diagram sources (draw.io)", "4", "Visual", "Sí — fuente autoritativa", "Activo", "docs/uml/use-cases/source/ (17 .drawio)", "", "Etapa 4"],
    ["ART-011", "Use Case Relation Decisions V1", "4", "Documentación", "Sí", "Activo", "docs/uml/use-cases/GEI_USE_CASE_RELATION_DECISIONS_V1.md", "", "Etapa 4"],
    ["ART-012", "Use Case Diagram Manifest V1", "4", "Documentación", "Sí", "Activo", "docs/uml/use-cases/GEI_USE_CASE_DIAGRAM_MANIFEST_V1.md", "", "Etapa 4"],
    ["ART-013", "Use Case Diagram Reconstruction Audit V1", "4", "Documentación", "No — proceso y evidencia", "Activo", "docs/uml/use-cases/GEI_USE_CASE_DIAGRAM_RECONSTRUCTION_AUDIT_V1.md", "", "Etapa 4"],
    ["ART-014", "Use Case Diagram Freeze V1", "4", "Documentación", "Sí", "Activo", "docs/uml/use-cases/GEI_USE_CASE_DIAGRAM_FREEZE_V1.md", "", "Etapa 4"],
    ["ART-015", "Draw.io validation report", "4", "QA", "Evidencia", "Activo", "docs/uml/use-cases/evidence/GEI_DRAWIO_VALIDATION_REPORT.txt", "", "Etapa 4"],
    ["ART-016", "Use Case Diagram exports (PDF/PNG)", "4", "Visual", "Derivado de ART-010", "Bloqueado", "docs/uml/use-cases/export/ — EXPORT_BLOCKED_NO_DRAWIO_CLI", "Requiere CLI de draw.io", "Etapa 4"],
  ];
  for (const a of ARTEFACTOS) {
    const res = appendRow(xml, a, STYLE.artefactoData);
    xml = res.xml;
    touched.push(`Artefactos!A${res.row}=${a[0]}`);
  }
  e.data = Buffer.from(xml, "utf8");
}

// 5. Decisiones: record the two E4 decisions that change the control system
{
  const e = getPart(S.decisiones);
  let xml = e.data.toString("utf8");
  const DECISIONES = [
    ["DEC-005", "Ubicación canónica del workbook", "El brief E0 congeló el workbook en docs/project-control/ pero E3 lo dejó en docs/ y su freeze afirmó haberlo actualizado sin que el archivo lo reflejara.", "Dejarlo en docs/ / moverlo a docs/project-control/", "Se movió a docs/project-control/ preservando el contenido byte a byte (SHA256 4EA3C621…96). E4 registra además que E1–E3 figuraban como 'No iniciado' pese a estar congeladas en git.", "Decidida", "Alto", "4", "Roadmap; Backlog; Artefactos", "D-7 del audit de E4. La afirmación de E3 §12.3 no era verificable contra el archivo."],
    ["DEC-006", "Relaciones include/extend de E3", "E3 §8.1 congeló 0 relaciones y declaró que decidir las include/extend es trabajo de E4.", "Aceptar las 8 candidatas / reevaluar cada una contra la semántica UML", "Se evaluaron las 8: 6 aceptadas (2 include, 4 extend) y 2 reclasificadas a SIBLING (EXT-05, EXT-06). 0 diferidas a E5. 0 relaciones nuevas. Las 9 rechazadas por E3 no se dibujan.", "Decidida", "Crítico", "4", "Use Case Diagrams; Product Truth V2", "El perímetro exacto de INC-01 (39 CU) queda como validación pendiente para E5. El tipo está congelado."],
  ];
  for (const d of DECISIONES) {
    const res = appendRow(xml, d, STYLE.decisionData);
    xml = res.xml;
    touched.push(`Decisiones!A${res.row}=${d[0]}`);
  }
  e.data = Buffer.from(xml, "utf8");
}

// 6. Resumen: current stage + recompute the cached counters that changed
{
  const e = getPart(S.resumen);
  let xml = e.data.toString("utf8");
  xml = setCell(xml, "A5", { value: "E4 · Diagramas de Casos de Uso" });
  touched.push("Resumen!A5=E4 · Diagramas de Casos de Uso");

  const back = readSheet(entries, S.backlog);
  const counts = new Map();
  let totalRows = 0;
  for (const r of back) {
    const a = r.cells.find((c) => c.colName === "A");
    if (!a || r.row < 3) continue;
    const h = r.cells.find((c) => c.colName === "H");
    totalRows += 1;
    const st = h ? h.value : "";
    counts.set(st, (counts.get(st) || 0) + 1);
  }
  // the E4 rows were already appended above, so they are already counted here
  const statusRows = [["A17", "No iniciado"], ["A18", "En curso"], ["A19", "Bloqueado"], ["A20", "En revisión"], ["A21", "Cerrado"]];
  let closed = 0;
  for (const [ref, label] of statusRows) {
    const n = counts.get(label) || 0;
    if (label === "Cerrado") closed = n;
    xml = setCell(xml, `B${ref.slice(1)}`, { value: n, type: "n", formula: `COUNTIF(Backlog!$H:$H,${ref})` });
    touched.push(`Resumen!B${ref.slice(1)}=${n} (${label})`);
  }
  const open = totalRows - closed;
  xml = setCell(xml, "E5", { value: open, type: "n", formula: 'COUNTA(Backlog!$A$3:$A$1000)-COUNTIF(Backlog!$H$3:$H$1000,"Cerrado")' });
  touched.push(`Resumen!E5=${open}`);

  // refresh the cached Progreso of every stage so the numbers are right before recalculation
  const stageCount = new Map();
  for (const r of back) {
    const b = r.cells.find((c) => c.colName === "B");
    const h = r.cells.find((c) => c.colName === "H");
    if (!b || r.row < 3) continue;
    const st = Number(b.value);
    if (!Number.isFinite(st)) continue;
    if (!stageCount.has(st)) stageCount.set(st, { total: 0, closed: 0 });
    const e = stageCount.get(st);
    e.total += 1;
    if (h && h.value === "Cerrado") e.closed += 1;
  }
  const rd = getPart(S.roadmap);
  let rxml = rd.data.toString("utf8");
  const rdRows = readSheet(entries, S.roadmap);
  for (const r of rdRows) {
    const a = r.cells.find((c) => c.colName === "A");
    if (!a || !/^\d+$/.test(a.value)) continue;
    const st = Number(a.value);
    const sc = stageCount.get(st);
    const val = !sc || sc.total === 0 ? 0 : sc.closed / sc.total;
    const before = rxml;
    rxml = setCell(rxml, `G${r.row}`, {
      value: val, type: "n",
      formula: `IF(COUNTIF(Backlog!$B:$B,A${r.row})=0,0,COUNTIFS(Backlog!$B:$B,A${r.row},Backlog!$H:$H,"Cerrado")/COUNTIF(Backlog!$B:$B,A${r.row}))`,
    });
    if (rxml !== before) touched.push(`Roadmap!G${r.row}=${val.toFixed(4)} (etapa ${st}: ${sc ? sc.closed : 0}/${sc ? sc.total : 0})`);
  }
  rd.data = Buffer.from(rxml, "utf8");
  touched.push(`Resumen!filas de backlog=${totalRows}, cerradas=${closed}`);
  e.data = Buffer.from(xml, "utf8");
}

writeZip(FILE, entries);
console.log("workbook updated: " + touched.length + " mutations");
for (const t of touched) console.log("  " + t);
