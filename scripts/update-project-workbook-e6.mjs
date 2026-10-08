#!/usr/bin/env node
// GEI E6 — workbook update. Cell-level mutation only, modeled on update-project-workbook-e5.mjs.
// Styles, formulas, validations, tables and sheet set are preserved except for the cells and
// ranges listed in GEI_STATE_DIAGRAM_FREEZE_V1.md / the E6 audit.

import fs from "node:fs";
import { readZip, writeZip } from "./lib/zipxlsx.mjs";
import { readSheet, sheetParts, encode } from "./lib/xlsx.mjs";

const FILE = "docs/project-control/GEI_Roadmap_Maestro_Proyecto.xlsx";
const entries = readZip(FILE);
const parts = sheetParts(entries);

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

const STYLE = { backlogData: 24, artefactoData: 24, decisionData: 24 };

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
  const replacement = `<x:c${attrStr}>${inner}</x:c>`;
  if (m) return xml.replace(cellRe, () => replacement);
  return xml.replace("</x:sheetData>", () => `${replacement}</x:sheetData>`);
}

function appendRow(xml, cells, style) {
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

// ---------------------------------------------------------------- E6 backlog

const E6_TASKS = [
  ["E6-01", 6, "Diagramas de Estados", "Preflight + auditoría de fuentes: verificar E5 FROZEN·PASS, 102 CU, 8 actores, 6 relaciones finales, 0 bloqueantes y preflight (typecheck, test 92/92, build). Extraer estados y transiciones de specs E5.", "Gestión", "P0", "Único integrante", "Cerrado", "Etapa 5 cerrada", "PASS. E5 V1 FROZEN · PASS en 01ee760; baseline E6 creada desde esa punta; rama gei/e6-state-diagrams-freeze-v1; git status limpio.", "docs/uml/states/GEI_STATE_RECONSTRUCTION_AUDIT_V1.md §1-3"],
  ["E6-02", 6, "Diagramas de Estados", "Inventario exhaustivo de 29 objetos candidatos con clasificación: 17 STATE_MACHINE_REQUIRED, 6 TEMPORAL_VALIDITY_MODEL, 2 DERIVED_STATE_MODEL, 4 NO_STATE_MACHINE. 0 NEEDS_DECISION.", "Análisis", "P0", "Único integrante", "Cerrado", "E6-01", "CERRADO. Clasificación fundamentada en PT §9, E5 specs, Actor Boundary Matrix §6. Separación persistido/derivado/temporal respetada. Membership/TeamAssignment/RoleAssignment/GuardianRelationship = TEMPORAL; Availability = PERSISTIDO+DERIVADO; Selection/SelectionRevision = PERSISTIDO+TEMPORAL; Conversation solo GROUP.", "docs/uml/states/GEI_STATE_CANDIDATE_INVENTORY_V1.md"],
  ["E6-03", 6, "Diagramas de Estados", "Catálogo canónico de 17 máquinas admitidas (SM-ACCOUNT-01 a SM-COMPETITIONENTRY-01) con estados, transiciones, guards, invariantes, REQ/UC, referencias E5.", "Diseño", "P0", "Único integrante", "Cerrado", "E6-02", "CERRADO. 17 máquinas: IAM(1), STR(4), EVT(2), PRT(5), COM(3), CMP(2). Cada máquina con ID estable, estado inicial, estados canónicos, definición, tipo, terminales, ops permitidas/rechazadas, invariantes, REQ/UC, refs E5.", "docs/uml/states/GEI_STATE_MODEL_CATALOG_V1.md"],
  ["E6-04", 6, "Diagramas de Estados", "Registro completo de 62 transiciones permitidas + 65 prohibidas con TR-ID, SM-ID, evento, condición, efecto, actor/authority, scope, REQ/AC, UC/paso E5, reversible, terminal.", "Diseño", "P0", "Único integrante", "Cerrado", "E6-03", "CERRADO. Matriz completa con notación UML 'evento [condición] / efecto'. Transiciones prohibidas documentadas (no dibujadas). Guards críticos identificados (LAST_ADMIN_REQUIRED, COORDINATION_REVISION, MATCH_STATE_INCOMPATIBLE, etc.).", "docs/uml/states/GEI_STATE_TRANSITION_MATRIX_V1.md"],
  ["E6-05", 6, "Diagramas de Estados", "Generación de 17 diagramas Draw.io XML válidos (fuente autoritativa) con script generate-state-diagrams.mjs. Notación UML académica: inicio, estados, transiciones, etiquetas 'evento [guard] / efecto', estados derivados dashed.", "Implementación", "P0", "Único integrante", "Cerrado", "E6-04", "CERRADO. 17 archivos .drawio en docs/uml/states/source/. XML bien formado, IDs únicos, endpoints válidos, waypoints <mxPoint>, escape correcto, coordenadas finitas, labels editables, conectores editables. Sin pseudonodo final forzado.", "scripts/state-diagrams/generate-state-diagrams.mjs"],
  ["E6-06", 6, "Diagramas de Estados", "Export PNG/PDF vía draw.io CLI real (MSIX 32.3.0). QA visual real sobre 17 PNG renderizados: 17/17 PASS. Sin clipping, solapes, flechas atraviesan texto, cruces graves, elementos invisibles, contenido fuera de página.", "QA", "P0", "Único integrante", "Cerrado", "E6-05", "CERRADO. draw.io CLI localizado en MSIX WindowsApps; export 17 PNG + 17 PDF exitoso. Tamaños PNG 80-270 KB, PDF 45-67 KB. Smoke test previo aprobado. Dimensiones A4 landscape.", "docs/uml/states/GEI_STATE_DIAGRAM_MANIFEST_V1.md §4"],
  ["E6-07", 6, "Diagramas de Estados", "Trazabilidad REQ/AC → UC → Máquina → Estado/Transición/Guard (67 REQ funcionales, 62 transiciones, 47 estados). Machine QA: 0 UNKNOWN_STATE, 0 UNKNOWN_TRANSITION, 0 DUPLICATE, 0 BROKEN_ENDPOINT, 0 UNAUTHORIZED, 0 FORBIDDEN_DRAWN, 0 REVERSE_INVENTADA, 0 PERSISTED_DERIVED_CONFLATION, 0 TEMPORAL_ENUM_INVENTADO, 0 UNREACHABLE_UNJUSTIFIED, 0 TERMINAL_OUTGOING_INVALID, 0 TRANSITION_WITHOUT_REQ. Semantic review: todas las máquinas validadas contra autoridades.", "QA", "P0", "Único integrante", "Cerrado", "E6-06", "CERRADO. Traceability Matrix V1: 67 REQ, 42 CU STATE_TRANSITION, 28 STATE_GUARD_ONLY, 12 STATE_READ_ONLY, 20 NO_STATE_RELEVANCE. Machine QA 0 findings. 0 bloqueos funcionales.", "docs/uml/states/GEI_STATE_TRACEABILITY_MATRIX_V1.md"],
  ["E6-08", 6, "Diagramas de Estados", "Gate de Etapa 6 y freeze de los diagramas de estados. Verificación: typecheck PASS, tests 92/92 PASS, build PASS, git status limpio. Freeze FROZEN · PASS.", "Gestión", "P0", "Único integrante", "Cerrado", "E6-07", "CERRADO. Gate E6-01..E6-08 PASS. GEI_STATE_DIAGRAM_FREEZE_V1.md FROZEN · PASS. 0 decisiones bloqueantes. Próxima: Etapa 7 — Trazabilidad (NO iniciada).", "docs/uml/states/GEI_STATE_DIAGRAM_FREEZE_V1.md"],
];

// ---------------------------------------------------------------- mutations

const touched = [];

// 1. Backlog: append E6-01..E6-08 (idempotent: update in place if the ID already exists)
let BACKLOG_LAST_ROW;
{
  const e = getPart(S.backlog);
  let xml = e.data.toString("utf8");
  const rows = readSheet(entries, S.backlog);
  const existing = new Map();
  let maxRow = 0;
  for (const r of rows) {
    const a = r.cells.find((c) => c.colName === "A");
    if (a && a.value) maxRow = Math.max(maxRow, r.row);
    if (a && /^E6-0\d$/.test(a.value)) existing.set(a.value, r.row);
  }
  const BACKLOG_COLS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
  for (const t of E6_TASKS) {
    const at = existing.get(t[0]);
    if (at) {
      for (let c = 1; c < BACKLOG_COLS.length; c++) xml = setCell(xml, `${BACKLOG_COLS[c]}${at}`, { value: t[c], type: "str" });
      touched.push(`Backlog!A${at}=${t[0]} (fila actualizada in situ)`);
    } else {
      const res = appendRow(xml, t, STYLE.backlogData);
      xml = res.xml;
      touched.push(`Backlog!A${res.row}=${t[0]}`);
    }
  }
  const oldLast = maxRow;
  BACKLOG_LAST_ROW = existing.size
    ? Math.max(...existing.values())
    : maxRow + E6_TASKS.length;
  // table range + data validations must reach the new rows
  const tbl = getPart("xl/tables/table2.xml");
  tbl.data = Buffer.from(tbl.data.toString("utf8").replace(new RegExp(`ref="A2:K${oldLast}"`), () => `ref="A2:K${BACKLOG_LAST_ROW}"`), "utf8");
  touched.push(`BacklogTable ref A2:K${oldLast} -> A2:K${BACKLOG_LAST_ROW}`);
  const blockRe = /<x:dataValidations\b[\s\S]*?<\/x:dataValidations>/;
  const block = xml.match(blockRe);
  if (!block) throw new Error("Backlog: no dataValidations block");
  let newBlock = block[0].replace(/(<x:dataValidation\b[^>]*sqref=")([EFH])3:\2(\d+)(")/g,
    (m, a, col, oldEnd, z) => `${a}${col}3:${col}${BACKLOG_LAST_ROW}${z}`);
  const found = [...newBlock.matchAll(/<x:dataValidation\b[^>]*sqref="([^"]+)"/g)].map((m) => m[1]);
  if (found.length === 0) throw new Error("Backlog: no validation sqref found after update");
  xml = xml.replace(blockRe, () => newBlock);
  touched.push(`dataValidations de Backlog -> ${found.join(" ")}`);
  e.data = Buffer.from(xml, "utf8");
}

// conditionalFormatting: extend the ranges that ended at the previous last row
{
  const s = getPart(S.backlog);
  const oldLast = 33;
  let xml = s.data.toString("utf8");
  let cf = 0;
  xml = xml.replace(new RegExp(`(<x:conditionalFormatting\\b[^>]*sqref="[^"]*?)${oldLast}(")`, "g"), (m, a, b) => {
    cf += 1;
    return `${a}${BACKLOG_LAST_ROW}${b}`;
  });
  touched.push(`conditionalFormatting de Backlog extendido en ${cf} rango(s) -> fila ${BACKLOG_LAST_ROW}`);
  s.data = Buffer.from(xml, "utf8");
}

// 2. Roadmap: stage 6 state + next action
{
  const e = getPart(S.roadmap);
  let xml = e.data.toString("utf8");
  const rows = readSheet(entries, S.roadmap);
  const byStage = new Map();
  for (const r of rows) {
    const a = r.cells.find((c) => c.colName === "A");
    if (a && /^\d+$/.test(a.value)) byStage.set(Number(a.value), r.row);
  }
  const r6 = byStage.get(6);
  if (!r6) throw new Error("stage 6 not found in Roadmap");
  xml = setCell(xml, `F${r6}`, { value: "Cerrado" });
  xml = setCell(xml, `G${r6}`, { value: 1, type: "n", formula: `IF(COUNTIF(Backlog!$B:$B,A${r6})=0,0,COUNTIFS(Backlog!$B:$B,A${r6},Backlog!$H:$H,"Cerrado")/COUNTIF(Backlog!$B:$B,A${r6}))` });
  xml = setCell(xml, `H${r6}`, { value: "Etapa 6 cerrada 100%: State Diagrams Freeze V1 FROZEN · PASS, 17 máquinas, 62 transiciones, 17 diagramas Draw.io, QA visual 17/17. Próxima: Etapa 7 — Trazabilidad (NO iniciada)." });
  touched.push(`Roadmap!F${r6}=Cerrado`);
  e.data = Buffer.from(xml, "utf8");
}

// 3. Artefactos: register the E6 deliverables (idempotent by ID)
{
  const e = getPart(S.artefactos);
  let xml = e.data.toString("utf8");
  const ARTEFACTOS = [
    ["ART-033", "State Reconstruction Audit V1", "6", "Documentación", "No — proceso y evidencia", "Activo", "docs/uml/states/GEI_STATE_RECONSTRUCTION_AUDIT_V1.md", "CRITICAL/MAJOR/MINOR/INFO findings; 0 bloqueantes", "Etapa 6"],
    ["ART-034", "State Candidate Inventory V1", "6", "Documentación", "Sí — auditoría de 29 objetos", "Activo", "docs/uml/states/GEI_STATE_CANDIDATE_INVENTORY_V1.md", "17 STATE_MACHINE_REQUIRED, 6 TEMPORAL, 2 DERIVED, 4 NO_STATE", "Etapa 6"],
    ["ART-035", "State Model Catalog V1", "6", "Documentación", "Sí — catálogo 17 máquinas", "Activo", "docs/uml/states/GEI_STATE_MODEL_CATALOG_V1.md", "Estados, transiciones, guards, invariantes, REQ/UC", "Etapa 6"],
    ["ART-036", "State Transition Matrix V1", "6", "Documentación", "Sí — 62 permitidas + 65 prohibidas", "Activo", "docs/uml/states/GEI_STATE_TRANSITION_MATRIX_V1.md", "TR-ID, guards, actor, REQ/AC, UC", "Etapa 6"],
    ["ART-037", "State Traceability Matrix V1", "6", "Documentación", "Sí — trazabilidad completa", "Activo", "docs/uml/states/GEI_STATE_TRACEABILITY_MATRIX_V1.md", "67 REQ, 42 CU STATE_TRANSITION", "Etapa 6"],
    ["ART-038", "State Diagram Manifest V1", "6", "Documentación", "Sí — manifest + validaciones", "Activo", "docs/uml/states/GEI_STATE_DIAGRAM_MANIFEST_V1.md", "17 PNG/PDF, QA visual 17/17 PASS", "Etapa 6"],
    ["ART-039", "State Diagrams Freeze V1", "6", "Documentación", "Sí — vigente", "Activo", "docs/uml/states/GEI_STATE_DIAGRAM_FREEZE_V1.md", "FROZEN · PASS", "Etapa 6"],
    ["ART-040", "State Diagram Generator", "6", "Código", "Herramienta", "Activo", "scripts/state-diagrams/generate-state-diagrams.mjs", "Genera 17 .drawio XML válidos", "Etapa 6"],
    ["ART-041", "17 State Diagrams (.drawio source)", "6", "Diagrama", "Sí — fuente autoritativa editable", "Activo", "docs/uml/states/source/*.drawio", "17 archivos, XML válido, editable", "Etapa 6"],
    ["ART-042", "17 State Diagrams (PNG export)", "6", "Diagrama", "Derivado", "Activo", "docs/uml/states/export/png/*.png", "QA visual 17/17 PASS", "Etapa 6"],
    ["ART-043", "17 State Diagrams (PDF export)", "6", "Diagrama", "Derivado", "Activo", "docs/uml/states/export/pdf/*.pdf", "Entrega académica", "Etapa 6"],
  ];
  const ART_COLS = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  const artRows = readSheet(entries, S.artefactos);
  const existingArt = new Map();
  for (const r of artRows) {
    const a = r.cells.find((c) => c.colName === "A");
    if (a && /^ART-\d{3}$/.test(a.value)) existingArt.set(a.value, r.row);
  }
  for (const a of ARTEFACTOS) {
    const at = existingArt.get(a[0]);
    if (at) {
      for (let c = 1; c < ART_COLS.length; c++) xml = setCell(xml, `${ART_COLS[c]}${at}`, { value: a[c], type: "str" });
      touched.push(`Artefactos!A${at}=${a[0]} (fila actualizada in situ)`);
    } else {
      const res = appendRow(xml, a, STYLE.artefactoData);
      xml = res.xml;
      touched.push(`Artefactos!A${res.row}=${a[0]}`);
    }
  }
  e.data = Buffer.from(xml, "utf8");
}

// 4. Resumen: current stage + recompute cached counters
{
  const e = getPart(S.resumen);
  let xml = e.data.toString("utf8");
  xml = setCell(xml, "A5", { value: "E6 · Diagramas de Estados" });
  touched.push("Resumen!A5=E6 · Diagramas de Estados");

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

  // refresh cached Progreso of every stage from closed/total
  const stageCount = new Map();
  for (const r of back) {
    const b = r.cells.find((c) => c.colName === "B");
    const h = r.cells.find((c) => c.colName === "H");
    if (!b || r.row < 3) continue;
    const st = Number(b.value);
    if (!Number.isFinite(st)) continue;
    if (!stageCount.has(st)) stageCount.set(st, { total: 0, closed: 0 });
    const s = stageCount.get(st);
    s.total += 1;
    if (h && h.value === "Cerrado") s.closed += 1;
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
    rxml = setCell(rxml, `G${r.row}`, {
      value: val, type: "n",
      formula: `IF(COUNTIF(Backlog!$B:$B,A${r.row})=0,0,COUNTIFS(Backlog!$B:$B,A${r.row},Backlog!$H:$H,"Cerrado")/COUNTIF(Backlog!$B:$B,A${r.row}))`,
    });
  }
  rd.data = Buffer.from(rxml, "utf8");
  touched.push("Roadmap!G — progreso cacheado recalculado para todas las etapas");

  // Resumen!B5 = progreso de la etapa vigente (6)
  const e6 = stageCount.get(6);
  const e6Val = !e6 || e6.total === 0 ? 0 : e6.closed / e6.total;
  xml = setCell(xml, "B5", {
    value: e6Val, type: "n",
    formula: 'IF(COUNTIF(Backlog!$B:$B,6)=0,0,COUNTIFS(Backlog!$B:$B,6,Backlog!$H:$H,"Cerrado")/COUNTIF(Backlog!$B:$B,6))',
  });
  touched.push(`Resumen!B5=${e6Val.toFixed(4)} (Etapa 6: ${e6 ? e6.closed : 0}/${e6 ? e6.total : 0})`);
  touched.push(`Resumen!filas de backlog=${totalRows}, cerradas=${closed}`);
  e.data = Buffer.from(xml, "utf8");
}

writeZip(FILE, entries);
console.log("workbook updated: " + touched.length + " mutations");
for (const t of touched) console.log("  " + t);