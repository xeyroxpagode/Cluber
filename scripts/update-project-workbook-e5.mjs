#!/usr/bin/env node
// GEI E5 — workbook update. Cell-level mutation only, modeled on update-project-workbook.mjs (E4).
// Styles, formulas, validations, tables and sheet set are preserved except for the cells and
// ranges listed in GEI_USE_CASE_SPECIFICATION_FREEZE_V1.md / the E5 audit.

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

// ---------------------------------------------------------------- E5 backlog

const E5_TASKS = [
  ["E5-01", 5, "Use Case Specifications", "Input closure: verificar E4 FROZEN·PASS, 102 CU, 8 actores, 6 relaciones finales, 0 bloqueantes y preflight (typecheck, test 92/92, build).", "Gestión", "P0", "Único integrante", "Cerrado", "Etapa 4 cerrada", "PASS. E4 V1.0.1 FROZEN · PASS en d4baa1c; baseline E5 creada desde esa punta; rama gei/e5-use-case-specifications-freeze-v1; git status limpio.", "docs/use-cases/specifications/GEI_USE_CASE_SPECIFICATION_RECONSTRUCTION_AUDIT_V1.md §1-2"],
  ["E5-02", 5, "Use Case Specifications", "Crear el Specification Standard académico y auditar 3 pilotos (UC-IAM-01, UC-EVT-04, UC-PRT-01) antes de generar las 102.", "Diseño", "P0", "Único integrante", "Cerrado", "E5-01", "CERRADO. Standard V1 FROZEN con los 12 campos del modelo del profesor + bloque de trazabilidad interna. Pilotos auditados: happy path de UC-EVT-04 fijado en la rama no material (E4 congeló UC-EVT-11 como extend); delegación Guardian como alternativa exitosa 2.1; 0 UI inventada. SPEC-FEEDBACK-01 (autores) registrado como hallazgo global único.", "docs/use-cases/specifications/GEI_USE_CASE_SPECIFICATION_STANDARD_V1.md"],
  ["E5-03", 5, "Use Case Specifications", "Generar las 102 especificaciones en 8 archivos de dominio con ficha académica completa.", "Implementación", "P0", "Único integrante", "Cerrado", "E5-02", "CERRADO. 102/102: IAM 10, PPL 17, STR 15, EVT 19, PRT 13, COM 14, CMP 9, INS 5. 401 pasos básicos (máx. 5, sin CU de 20-30 pasos), 299 alternativas, 0 subflujos de 3er nivel, 0 placeholders. Prioridad P0 55 / P1 40 / P2 7 por regla Standard §4.", "docs/use-cases/specifications/GEI_UC_SPEC_*_V1.md (8 archivos)"],
  ["E5-04", 5, "Use Case Specifications", "Reconciliación cross-domain: revisar los 102 como un solo sistema (flujos contradictorios, state/actor/authority/naming/relation drift).", "QA", "P0", "Único integrante", "Cerrado", "E5-03", "CERRADO. 7 fronteras reconciliadas (IAM-PPL, PPL-STR, STR-EVT, EVT-PRT, EVT-COM, EVT-CMP, PRT-INS): ningún CU crea un estado que otro declare imposible. 0 correcciones de authorities necesarias. SPEC-FEEDBACK-02 (P3): asimetría matriz directa/inversa rotulada (ficha E3).", "docs/use-cases/specifications/GEI_USE_CASE_SPECIFICATION_RECONSTRUCTION_AUDIT_V1.md §13"],
  ["E5-05", 5, "Use Case Specifications", "Stress de alternativas y errores: aplicar el checklist §53 a cada CU donde aplique, sin inventar reglas.", "QA", "P0", "Único integrante", "Cerrado", "E5-04", "CERRADO. Checklist completo: autoridad (102/102), scope, estado inválido, datos inválidos, dependencia faltante/activa, reauth (38 CU del perímetro E3), guardian sin flag, último admin, concurrencia (sólo donde E4 congeló EXT-01), material change, conflicto derivado, límites de lote (366/100). 0 reglas inventadas.", "docs/use-cases/specifications/GEI_USE_CASE_SPECIFICATION_RECONSTRUCTION_AUDIT_V1.md §8"],
  ["E5-06", 5, "Use Case Specifications", "Traceability index + spec traceability + machine QA + academic QA + AC coverage.", "QA", "P0", "Único integrante", "Cerrado", "E5-05", "CERRADO. Index V1 (102 filas) y Traceability V1 (444 filas UC-REQ, 454/454 AC, UNACCOUNTED_AC=0) generados por script. Machine QA 32/32 PASS (validate-use-case-specs.mjs). Academic QA 16/16 (2 por dominio) + 12 campos verificados por máquina en 102/102. 0 unknown REQ/actor, 0 drift E3/E4, 0 priority mismatch.", "docs/use-cases/specifications/evidence/GEI_UC_SPEC_VALIDATION_REPORT.txt"],
  ["E5-07", 5, "Use Case Specifications", "Gate de Etapa 5 y freeze de las especificaciones.", "Gestión", "P0", "Único integrante", "Cerrado", "E5-06", "CERRADO. Gate E5-01..E5-07 PASS. GEI_USE_CASE_SPECIFICATION_FREEZE_V1.md FROZEN · PASS. 0 decisiones bloqueantes; no se crea Open Decisions (no hay decisiones nuevas). Próxima: Etapa 6 — Diagramas de Estados (NO iniciada).", "docs/use-cases/specifications/GEI_USE_CASE_SPECIFICATION_FREEZE_V1.md"],
];

// ---------------------------------------------------------------- mutations

const touched = [];

// 1. Backlog: append E5-01..E5-07 (idempotent: update in place if the ID already exists)
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
    if (a && /^E5-0\d$/.test(a.value)) existing.set(a.value, r.row);
  }
  const BACKLOG_COLS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
  for (const t of E5_TASKS) {
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
    : maxRow + E5_TASKS.length;
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

// 2. Roadmap: stage 5 state + next action
{
  const e = getPart(S.roadmap);
  let xml = e.data.toString("utf8");
  const rows = readSheet(entries, S.roadmap);
  const byStage = new Map();
  for (const r of rows) {
    const a = r.cells.find((c) => c.colName === "A");
    if (a && /^\d+$/.test(a.value)) byStage.set(Number(a.value), r.row);
  }
  const r5 = byStage.get(5);
  if (!r5) throw new Error("stage 5 not found in Roadmap");
  xml = setCell(xml, `F${r5}`, { value: "Cerrado" });
  xml = setCell(xml, `G${r5}`, { value: 1, type: "n", formula: `IF(COUNTIF(Backlog!$B:$B,A${r5})=0,0,COUNTIFS(Backlog!$B:$B,A${r5},Backlog!$H:$H,"Cerrado")/COUNTIF(Backlog!$B:$B,A${r5}))` });
  xml = setCell(xml, `H${r5}`, { value: "Etapa 5 cerrada 100%: Specification Freeze V1 FROZEN · PASS, 102/102 specs académicas, 454/454 AC, machine QA 32/32, academic QA 16/16. Próxima: Etapa 6 — Diagramas de Estados (NO iniciada)." });
  touched.push(`Roadmap!F${r5}=Cerrado`);
  e.data = Buffer.from(xml, "utf8");
}

// 3. Artefactos: register the E5 deliverables (idempotent by ID)
{
  const e = getPart(S.artefactos);
  let xml = e.data.toString("utf8");
  const ARTEFACTOS = [
    ["ART-019", "Use Case Specification Standard V1", "5", "Documentación", "Sí — autoridad de forma", "Activo", "docs/use-cases/specifications/GEI_USE_CASE_SPECIFICATION_STANDARD_V1.md", "Plantilla del profesor + reglas E5; FROZEN tras pilotos", "Etapa 5"],
    ["ART-020", "UC Specifications IAM V1 (10 CU)", "5", "Documentación", "Sí — autoridad funcional por CU", "Activo", "docs/use-cases/specifications/GEI_UC_SPEC_IAM_V1.md", "", "Etapa 5"],
    ["ART-021", "UC Specifications PPL V1 (17 CU)", "5", "Documentación", "Sí — autoridad funcional por CU", "Activo", "docs/use-cases/specifications/GEI_UC_SPEC_PPL_V1.md", "", "Etapa 5"],
    ["ART-022", "UC Specifications STR V1 (15 CU)", "5", "Documentación", "Sí — autoridad funcional por CU", "Activo", "docs/use-cases/specifications/GEI_UC_SPEC_STR_V1.md", "", "Etapa 5"],
    ["ART-023", "UC Specifications EVT V1 (19 CU)", "5", "Documentación", "Sí — autoridad funcional por CU", "Activo", "docs/use-cases/specifications/GEI_UC_SPEC_EVT_V1.md", "Contiene las 6 relaciones E4: 3 include + 3 extend", "Etapa 5"],
    ["ART-024", "UC Specifications PRT V1 (13 CU)", "5", "Documentación", "Sí — autoridad funcional por CU", "Activo", "docs/use-cases/specifications/GEI_UC_SPEC_PRT_V1.md", "", "Etapa 5"],
    ["ART-025", "UC Specifications COM V1 (14 CU)", "5", "Documentación", "Sí — autoridad funcional por CU", "Activo", "docs/use-cases/specifications/GEI_UC_SPEC_COM_V1.md", "", "Etapa 5"],
    ["ART-026", "UC Specifications CMP V1 (9 CU)", "5", "Documentación", "Sí — autoridad funcional por CU", "Activo", "docs/use-cases/specifications/GEI_UC_SPEC_CMP_V1.md", "", "Etapa 5"],
    ["ART-027", "UC Specifications INS V1 (5 CU)", "5", "Documentación", "Sí — autoridad funcional por CU", "Activo", "docs/use-cases/specifications/GEI_UC_SPEC_INS_V1.md", "", "Etapa 5"],
    ["ART-028", "Use Case Specification Index V1", "5", "Documentación", "Sí", "Activo", "docs/use-cases/specifications/GEI_USE_CASE_SPECIFICATION_INDEX_V1.md", "102 filas; generado por script", "Etapa 5"],
    ["ART-029", "Use Case Spec Traceability V1", "5", "Documentación", "Sí", "Activo", "docs/use-cases/specifications/GEI_USE_CASE_SPEC_TRACEABILITY_V1.md", "444 filas UC-REQ; 454/454 AC; UNACCOUNTED_AC=0", "Etapa 5"],
    ["ART-030", "UC Spec machine QA report", "5", "QA", "Evidencia", "Activo", "docs/use-cases/specifications/evidence/GEI_UC_SPEC_VALIDATION_REPORT.txt", "32/32 PASS", "Etapa 5"],
    ["ART-031", "Use Case Specification Reconstruction Audit V1", "5", "Documentación", "No — proceso y evidencia", "Activo", "docs/use-cases/specifications/GEI_USE_CASE_SPECIFICATION_RECONSTRUCTION_AUDIT_V1.md", "", "Etapa 5"],
    ["ART-032", "Use Case Specification Freeze V1", "5", "Documentación", "Sí — vigente", "Activo", "docs/use-cases/specifications/GEI_USE_CASE_SPECIFICATION_FREEZE_V1.md", "FROZEN · PASS", "Etapa 5"],
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

// 4. Decisiones: DEC-008 (regla de prioridad de CU)
{
  const e = getPart(S.decisiones);
  let xml = e.data.toString("utf8");
  const DECISIONES = [
    ["DEC-008", "Regla de derivación de prioridad de los CU", "El catálogo E1 tiene PRIORITY por REQ, pero la ficha académica pide una prioridad por CU y varios CU tienen varios REQ PRIMARY con prioridades distintas (o ninguna, como UC-STR-10 por la notación de rango de la matriz).", "Asignar arbitrariamente / derivar de los REQ PRIMARY", "Derivación determinista: la prioridad del CU es la más crítica entre sus REQ PRIMARY según la matriz E3 (P0<P1<P2 en criticidad); los SUPPORTING/BR/SI/CC no la alteran. UC-STR-10 toma REQ-STR-008 (P) de la ficha granular del catálogo. Distribución: P0 55, P1 40, P2 7. Verificada por máquina (PRIORITY_MISMATCH=0).", "Decidida", "Medio", "5", "Use Case Specifications", "Standard §4 + Audit §6. Sin convertir todos los CU en P0."],
  ];
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

// 5. Resumen: current stage + recompute cached counters
{
  const e = getPart(S.resumen);
  let xml = e.data.toString("utf8");
  xml = setCell(xml, "A5", { value: "E5 · Especificaciones de TODOS los CU" });
  touched.push("Resumen!A5=E5 · Especificaciones de TODOS los CU");

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

  // Resumen!B5 = progreso de la etapa vigente (5)
  const e5 = stageCount.get(5);
  const e5Val = !e5 || e5.total === 0 ? 0 : e5.closed / e5.total;
  xml = setCell(xml, "B5", {
    value: e5Val, type: "n",
    formula: 'IF(COUNTIF(Backlog!$B:$B,5)=0,0,COUNTIFS(Backlog!$B:$B,5,Backlog!$H:$H,"Cerrado")/COUNTIF(Backlog!$B:$B,5))',
  });
  touched.push(`Resumen!B5=${e5Val.toFixed(4)} (Etapa 5: ${e5 ? e5.closed : 0}/${e5 ? e5.total : 0})`);
  touched.push(`Resumen!filas de backlog=${totalRows}, cerradas=${closed}`);
  e.data = Buffer.from(xml, "utf8");
}

writeZip(FILE, entries);
console.log("workbook updated: " + touched.length + " mutations");
for (const t of touched) console.log("  " + t);
