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

// E4-0.1: the E4 rows already exist from the V1 run. Re-running must UPDATE them in place, not
// abort: E4-02, E4-03 and E4-07 are being reopened and the evidence text is superseded.
// Appending again would duplicate the IDs and corrupt the table.
const existingE4 = new Map();
{
  const back = readSheet(entries, parts[3].partName);
  for (const r of back) {
    const a = r.cells.find((c) => c.colName === "A");
    if (a && /^E4-0\d$/.test(a.value)) existingE4.set(a.value, r.row);
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

// CIERRE FINAL DE E4 (tras el fix D-10). E4-02..E4-07 se cierran con la evidencia de la regresión
// final: 6 relaciones con semántica ratificada, 17/17 .drawio cargables y exportables, QA visual
// 17/17, RELATION_LABEL_* = 0/0/0/0, D-10 CERRADA, D-11 ACEPTADA P2 con evidencia (§10.2 del freeze).
const E4_TASKS = [
  ["E4-01", 4, "Use Case Diagrams", "Preflight: verificar baseline, autoridades de E3 y baseline de integridad (typecheck, test, build).", "Gestión", "P0", "Único integrante", "Cerrado", "Etapa 3 cerrada", "Baseline E3 SHA registrado; pnpm typecheck/test/build en PASS; 0 cambios en src/**.", "docs/uml/use-cases/GEI_USE_CASE_DIAGRAM_RECONSTRUCTION_AUDIT_V1.md §1"],
  ["E4-02", 4, "Use Case Diagrams", "Resolver las 8 candidatas include/extend y confirmar la no dibujado de las 9 rechazadas.", "Decisión", "P0", "Único integrante", "Cerrado", "E4-01", "CERRADO. Set final de 6 relaciones: INC-01 include→extend [REAUTHENTICATION_REQUIRED] y 0 aristas (REQ-IAM-009 AC 2 documenta el bypass); INC-02 3 include + 2 extend (REQ-EVT-011 AC 1); EXT-01 conservada; EXT-02/03/04 a SIBLING; EXT-05/06 SIBLING revalidadas. 0 UNDECIDED, 0 DEFER, 0 relación nueva, REJECTED_RELATION_DRAWN=0. Validator: 6 dibujadas, 0 no autorizadas, 0 aprobadas sin dibujar.", "docs/uml/use-cases/GEI_USE_CASE_RELATION_DECISIONS_V1.md"],
  ["E4-03", 4, "Use Case Diagrams", "Diseñar la topología de láminas a partir de relaciones y actores reales, sin forzar 1 diagrama por dominio.", "Diseño", "P0", "Único integrante", "Cerrado", "E4-02", "CERRADO. 17 láminas (1 mapa + 16 detalle). Solape colineal 86.317 px → 182 px (10 pares, ninguno con rótulos). D-10 CERRADA: banda de rótulos reservada (gap 16→46 px en láminas con relaciones) + solucionador determinista de colisiones en scripts/lib/labels.mjs; 5 rótulos de UCD-EVT-02a con posición propia, Σ|d|=114 px, máx 70. Penetración 0, texto desbordado 0.", "docs/uml/use-cases/GEI_USE_CASE_DIAGRAM_FREEZE_V1_0_1.md §8.1, §10.1"],
  ["E4-04", 4, "Use Case Diagrams", "Generar los .drawio no comprimidos y editables de diagrams.net.", "Implementación", "P0", "Único integrante", "Cerrado", "E4-03", "17 archivos .drawio. CORREGIDO: los waypoints se emitían como texto y draw.io no podía cargarlos; ahora <mxPoint>. Verificado por ejecución real: 17/17 cargan y exportan, exit 0. Anclaje explícito exitX/entryX en TODAS las aristas: medido == dibujado.", "docs/uml/use-cases/source/"],
  ["E4-05", 4, "Use Case Diagrams", "Validar cobertura 102/102, catálogo de actores, autorización de relaciones, generalizaciones y geometría.", "QA", "P0", "Único integrante", "Cerrado", "E4-04", "PASS 0 findings: MISSING=0, UNKNOWN_UC=0, RENAMED_ID=0, UNKNOWN_ACTOR=0, NO_NEW_GENERALIZATION=0, UNAUTHORIZED_NEW_RELATION=0, REJECTED_RELATION_DRAWN=0. 10 checks nuevos: DRAWIO_INVALID_WAYPOINTS=0, RAW_ANGLE_IN_ATTRIBUTE=0, EDGE_LABEL_BAD_OFFSET=0, LABEL_FIGURE_OVERLAP=0, ACTOR_OVERLAP=0, TYPOGRAPHY_BELOW_11PT=0, RELATION_LABEL_OVERLAP=0, RELATION_LABEL_TO_NODE_OVERLAP=0, RELATION_LABEL_OUTSIDE_PAGE=0, RELATION_LABEL_UNREADABLE=0.", "docs/uml/use-cases/evidence/GEI_DRAWIO_VALIDATION_REPORT.txt"],
  ["E4-06", 4, "Use Case Diagrams", "QA visual y export a PDF/PNG.", "QA", "P0", "Único integrante", "Cerrado", "E4-05", "CERRADO. draw.io MSIX 31.7.0 localizado sin instalar nada; 17 PNG + 17 PDF exportados (exit 0, firmas válidas, tamaños > 0). QA visual REAL sobre render: 17/17 PASS, incluida UCD-EVT-02a con los 5 rótulos separados y el hallazgo residual (rótulo sobre el título del boundary) corregido y re-exportado.", "docs/uml/use-cases/GEI_USE_CASE_DIAGRAM_FREEZE_V1_0_1.md §9, §10"],
  ["E4-07", 4, "Use Case Diagrams", "Gate de Etapa 4 y freeze del diagrama de casos de uso.", "Gestión", "P0", "Único integrante", "Cerrado", "E4-05,E4-06", "CERRADO. Gate E4-01..E4-07 PASS. GEI_USE_CASE_DIAGRAM_FREEZE_V1_0_1.md FROZEN · PASS: D-10 CERRADA, D-11 ACEPTADA P2 con evidencia (archivo + edge IDs + px), D-9 heredada y no bloqueante. 102/102 CU, 8/8 actores, 6/6 relaciones, 17+17 export, QA visual 17/17. Próxima etapa: E5 — NO INICIADA.", "docs/uml/use-cases/GEI_USE_CASE_DIAGRAM_FREEZE_V1_0_1.md §12"],
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
  setStage(4, "Cerrado", "E4 cerrada 100%: freeze V1.0.1 FROZEN · PASS, QA visual 17/17, D-10 cerrada, D-11 aceptada P2. Próxima: Etapa 5 (NO iniciada).");
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
  // E4_TASKS has 11 fields and appendRow maps field i to column colName(i), i.e. A..K.
  // The in-place update must use the SAME mapping.
  const BACKLOG_COLS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
  for (const t of E4_TASKS) {
    const at = existingE4.get(t[0]);
    if (at) {
      for (let c = 0; c < BACKLOG_COLS.length; c++) {
        if (c === 0) continue; // the ID column is the key; never rewrite it
        xml = setCell(xml, `${BACKLOG_COLS[c]}${at}`, { value: t[c], type: "str" });
      }
      touched.push(`Backlog!A${at}=${t[0]} (fila actualizada in situ)`);
    } else {
      const res = appendRow(xml, t, STYLE.backlogData);
      xml = res.xml;
      touched.push(`Backlog!A${res.row}=${t[0]}`);
    }
  }
  e.data = Buffer.from(xml, "utf8");
  var BACKLOG_LAST_ROW = existingE4.size
    ? Math.max(...existingE4.values())
    : 26 + E4_TASKS.length;
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
    ["ART-014", "Use Case Diagram Freeze V1", "4", "Documentación", "Sí — histórico, superseded", "Activo", "docs/uml/use-cases/GEI_USE_CASE_DIAGRAM_FREEZE_V1.md", "Sustituido por ART-017 en E4-0.1; no se modifica", "Etapa 4"],
    ["ART-015", "Draw.io validation report", "4", "QA", "Evidencia", "Activo", "docs/uml/use-cases/evidence/GEI_DRAWIO_VALIDATION_REPORT.txt", "", "Etapa 4"],
    ["ART-016", "Use Case Diagram exports (PDF/PNG)", "4", "Visual", "Derivado de ART-010", "Activo", "docs/uml/use-cases/export/png/ (17 PNG) + export/pdf/ (17 PDF)", "Exportado con draw.io MSIX 31.7.0 en E4-0.1", "Etapa 4"],
    ["ART-017", "Use Case Diagram Freeze V1.0.1", "4", "Documentación", "Sí — vigente", "Activo", "docs/uml/use-cases/GEI_USE_CASE_DIAGRAM_FREEZE_V1_0_1.md", "FROZEN · PASS; D-10 cerrada, D-11 aceptada P2", "Etapa 4"],
    ["ART-018", "E3 Missing Audit Errata V1", "3", "Documentación", "Higiene documental", "Activo", "docs/use-cases/GEI_E3_MISSING_AUDIT_ERRATA_V1.md", "Registra la referencia colgante; no reconstruye nada", "Etapa 4"],
  ];
  // E4-0.1: ART rows already exist from the V1 run. Update in place, append only new IDs.
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

// 5. Decisiones: record the two E4 decisions that change the control system
{
  const e = getPart(S.decisiones);
  let xml = e.data.toString("utf8");
  const DECISIONES = [
    ["DEC-005", "Ubicación canónica del workbook", "El brief E0 congeló el workbook en docs/project-control/ pero E3 lo dejó en docs/ y su freeze afirmó haberlo actualizado sin que el archivo lo reflejara.", "Dejarlo en docs/ / moverlo a docs/project-control/", "Se movió a docs/project-control/ preservando el contenido byte a byte (SHA256 4EA3C621…96). E4 registra además que E1–E3 figuraban como 'No iniciado' pese a estar congeladas en git.", "Decidida", "Alto", "4", "Roadmap; Backlog; Artefactos", "D-7 del audit de E4. La afirmación de E3 §12.3 no era verificable contra el archivo."],
    ["DEC-006", "Relaciones include/extend de E3", "E3 §8.1 congeló 0 relaciones y declaró que decidir las include/extend es trabajo de E4.", "Aceptar las 8 candidatas / reevaluar cada una contra la semántica UML", "CORREGIDO en E4-0.1: el set de V1 (50 aristas) era semánticamente incorrecto. Set final de 6: INC-01 de include a extend [REAUTHENTICATION_REQUIRED] con 0 aristas (REQ-IAM-009 AC 2 documenta el bypass); INC-02 a 3 include + 2 extend (REQ-EVT-011 AC 1 condiciona por campo); EXT-02/03/04 a SIBLING (el base ya había terminado). 0 diferidas, 0 nuevas, 9 rechazos de E3 intactos.", "Decidida", "Crítico", "4", "Use Case Diagrams; Product Truth V1.0.1", "Cerrada en E4 final: gate E4-02 PASS, 6/6 dibujadas, validador sin findings. El perímetro de INC-01 ya no se dibuja porque ninguna autoridad enumera las operaciones sensibles."],
    ["DEC-007", "Colocación de rótulos de relación (D-10)", "El router reservaba canales para las aristas pero ningún componente reservaba espacio para sus rótulos: 5 rótulos de ~115×36 px caían en una banda de canal de 10 px en UCD-EVT-02a, sin test de colisión alguno.", "Mover rótulos a mano / reservar banda y resolver colisiones por búsqueda determinista", "RESUELTA en el cierre de E4: banda de fila ampliada 16→46 px en láminas con relaciones; solucionador determinista en scripts/lib/labels.mjs (fracción de la polilínea + offset perpendicular en px, semántica mxGraph); anclaje explícito exitX/entryX; título del boundary como obstáculo tras hallazgo del QA visual; 4 checks RELATION_LABEL_* en el validador, geometría re-derivada del archivo emitido.", "Decidida", "Crítico", "4", "Use Case Diagrams; QA", "El primer PASS del generador era cierto sobre su propio modelo y falso sobre el archivo: el validador re-deriva desde el XML para que sólo cuente la geometría que draw.io dibuja. RELATION_LABEL_* = 0/0/0/0; QA visual 17/17."],
  ];
  // E4-0.1: DEC-005/DEC-006 already exist from the V1 run; update in place so re-running does not
  // duplicate them. New decisions are still appended.
  const decRows = readSheet(entries, S.decisiones);
  const existingDec = new Map();
  for (const r of decRows) {
    const a = r.cells.find((c) => c.colName === "A");
    if (a && /^DEC-\d{3}$/.test(a.value)) existingDec.set(a.value, r.row);
  }
  const DEC_COLS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  for (const d of DECISIONES) {
    const at = existingDec.get(d[0]);
    if (at) {
      for (let c = 1; c < DEC_COLS.length; c++) xml = setCell(xml, `${DEC_COLS[c]}${at}`, { value: d[c], type: "str" });
      touched.push(`Decisiones!A${at}=${d[0]} (fila actualizada in situ)`);
    } else {
      const res = appendRow(xml, d, STYLE.decisionData);
      xml = res.xml;
      touched.push(`Decisiones!A${res.row}=${d[0]}`);
    }
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

  // E4-0.1: Resumen!B5 held a stale cached value (0.2941) that contradicted Roadmap!G7. The
  // summary sheet must show the same progress as the roadmap sheet, so it is recomputed from the
  // same closed/total ratio with the same formula.
  {
    const e4 = stageCount.get(4);
    const e4Total = e4 ? e4.total : 0;
    const e4Closed = e4 ? e4.closed : 0;
    const e4Val = e4Total === 0 ? 0 : e4Closed / e4Total;
    xml = setCell(xml, "B5", {
      value: e4Val, type: "n",
      formula: 'IF(COUNTIF(Backlog!$B:$B,4)=0,0,COUNTIFS(Backlog!$B:$B,4,Backlog!$H:$H,"Cerrado")/COUNTIF(Backlog!$B:$B,4))',
    });
    touched.push(`Resumen!B5=${e4Val.toFixed(4)} (Etapa 4: ${e4Closed}/${e4Total})`);
  }

  touched.push(`Resumen!filas de backlog=${totalRows}, cerradas=${closed}`);
  e.data = Buffer.from(xml, "utf8");
}

writeZip(FILE, entries);
console.log("workbook updated: " + touched.length + " mutations");
for (const t of touched) console.log("  " + t);
