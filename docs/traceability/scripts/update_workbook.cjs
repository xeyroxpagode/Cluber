// GEI E9 — Actualizador del Workbook (Roadmap/Resumen/Backlog/Artefactos/Decisiones/Riesgos)
// Edita el XLSX como paquete OOXML con jszip, preservando estilos, fórmulas, tablas,
// validaciones y chart (las entradas no modificadas se copian byte a byte).
// Ejecutar: node docs/traceability/scripts/update_workbook.cjs
const { readFileSync, writeFileSync } = require("node:fs");
const JSZip = require("jszip");

const XLSX = "docs/project-control/GEI_Roadmap_Maestro_Proyecto.xlsx";
const XNS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function replaceCell(xml, ref, oldStr, newStr) {
  const re = new RegExp(`(<x:c r="${ref}"[^>]*>)([\\s\\S]*?)(</x:c>)`);
  const m = xml.match(re);
  if (!m) throw new Error(`Cell ${ref} not found`);
  if (!m[2].includes(oldStr)) throw new Error(`Cell ${ref}: pattern not found: ${oldStr.slice(0, 50)}`);
  return xml.replace(re, (f, a, body, b) => a + body.split(oldStr).join(newStr) + b);
}
function setInline(xml, ref, text) {
  const re = new RegExp(`<x:c r="${ref}"([^>]*?)/>|<x:c r="${ref}"([^>]*?)>[\\s\\S]*?</x:c>`);
  const m = xml.match(re);
  if (!m) throw new Error(`Cell ${ref} not found for inline set`);
  const attrs = (m[1] ?? m[2] ?? "").replace(/\s*t="[^"]*"/, "");
  return xml.replace(re, `<x:c r="${ref}"${attrs} t="inlineStr"><is xmlns="${XNS}"><t>${esc(text)}</t></is></x:c>`);
}
function appendRows(xml, rowsXml) {
  return xml.replace("</x:sheetData>", rowsXml + "</x:sheetData>");
}
function bcell(ref, text, s = "24") { return `<c r="${ref}" s="${s}" t="inlineStr"><is><t>${esc(text)}</t></is></c>`; }
function brow(rn, vals, s = "24") {
  return `<row r="${rn}" customHeight="1" ht="15" hidden="0" xmlns="${XNS}">` + vals.map((v, i) => bcell(String.fromCharCode(65 + i) + rn, v, s)).join("") + `</row>`;
}

(async () => {
  const zip = await JSZip.loadAsync(readFileSync(XLSX));
  const get = async (name) => (await zip.file(name).async("string"));
  const edits = {};

  // ===== Roadmap (xl\worksheets\sheet2.xml) =====
  let s2 = await get("xl\\worksheets\\sheet2.xml");
  s2 = setInline(s2, "F10", "Cerrado");
  s2 = replaceCell(s2, "G10", "<x:v>0</x:v>", "<x:v>1</x:v>");
  s2 = setInline(s2, "H10", "Etapa 7 cerrada 100%: Activity Diagrams Freeze V1 FROZEN · PASS. 14 diagramas, 102/102 CU evaluados (40 directos + 5 compuestos + 57 simples justificados, 0 bloqueados). Tareas E7-01..E7-04 registradas retroactivamente en E9 (reconciliación de backlog).");
  s2 = replaceCell(s2, "G11", "<x:v>0</x:v>", "<x:v>1</x:v>");
  s2 = setInline(s2, "F12", "Cerrado");
  s2 = replaceCell(s2, "G12", "<x:v>0</x:v>", "<x:v>1</x:v>");
  s2 = setInline(s2, "H12", "Etapa 9 cerrada 100%: Traceability Freeze V1 FROZEN · PASS. 157/157 REQ, 102/102 CU, 454/454 AC, 65/65 transiciones, 37/37 clases, 3.929 relaciones, 0 bloqueantes; 2 MAJOR no bloqueantes (TRACE-FEEDBACK-01/02). Próxima: E9.5 - Auditoría Integral (NO iniciada).");
  // Renumerar filas 13..23 -> 14..24 e insertar fila E9.5 como nueva 13
  const rowRe = /<x:row r="(\d+)"[\s\S]*?<\/x:row>/g;
  const blocks = s2.match(rowRe);
  const first = s2.indexOf(blocks[0]);
  const head = s2.slice(0, first);
  const tail = s2.slice(first).slice(blocks.join("").length);
  const out = [];
  for (const blk of blocks) {
    const rn = parseInt(blk.match(/<x:row r="(\d+)"/)[1], 10);
    if (rn >= 13) {
      const nn = rn + 1;
      out.push(
        blk.replace(`<x:row r="${rn}"`, `<x:row r="${nn}"`)
           .replace(new RegExp(`([A-H])${rn}`, "g"), (m, c) => c + nn)
      );
    } else out.push(blk);
    if (rn === 12) {
      out.push(`<x:row r="13" ht="26.399999618530273" hidden="0" customHeight="1"><x:c r="A13" s="72" t="n"><x:v>9.5</x:v></x:c><x:c r="B13" s="30" t="inlineStr"><is xmlns="${XNS}"><t>Auditoría Integral + Cierre Académico</t></is></x:c><x:c r="C13" s="30" t="inlineStr"><is xmlns="${XNS}"><t>Auditar de forma independiente el sistema trazado E1-E9 y emitir el veredicto académico.</t></is></x:c><x:c r="D13" s="30" t="inlineStr"><is xmlns="${XNS}"><t>Auditoría semántica integral independiente; veredicto académico; cierre documental del modelo funcional.</t></is></x:c><x:c r="E13" s="30" t="inlineStr"><is xmlns="${XNS}"><t>Auditoría independiente PASS; 0 contradicciones semánticas sin clasificar; veredicto emitido y registrado.</t></is></x:c><x:c r="F13" s="30" t="inlineStr"><is xmlns="${XNS}"><t>No iniciado</t></is></x:c><x:c r="G13" s="63" t="n"><x:f>IF(COUNTIF(Backlog!$B:$B,A13)=0,0,COUNTIFS(Backlog!$B:$B,A13,Backlog!$H:$H,"Cerrado")/COUNTIF(Backlog!$B:$B,A13))</x:f><x:v>0</x:v></x:c><x:c r="H13" s="31" t="inlineStr"><is xmlns="${XNS}"><t>Gate registrado en E9 como siguiente etapa. NO ejecutar aún: requiere decisión del usuario. E10 sigue NO INICIADO.</t></is></x:c></x:row>`);
    }
  }
  s2 = head + out.join("") + tail;
  s2 = s2.split("F3:F23").join("F3:F24").split("G3:G23").join("G3:G24");
  edits["xl\\worksheets\\sheet2.xml"] = s2;

  // ===== Backlog (xl\worksheets\sheet4.xml): 12 filas =====
  const backlogRows = [
    ["E7-01", "7", "Activity Diagrams", "Auditar candidatos y seleccionar cobertura de los 102 CU (40 directos + 5 compuestos + 57 simples justificados; 0 bloqueados). Registrada retroactivamente en E9: el trabajo se ejecutó en E7 (commit d5c1757) sin cargarse en el backlog.", "Análisis", "P0", "Único integrante", "Cerrado", "Etapa 6 cerrada", "102/102 CU evaluados con justificación de exclusión.", "docs/uml/activities/GEI_ACTIVITY_RECONSTRUCTION_AUDIT_V1.md + GEI_ACTIVITY_SELECTION_MATRIX_V1.md"],
    ["E7-02", "7", "Activity Diagrams", "Definir los contratos de flujo E7-03: 14 fichas con acciones, decisiones con guards excluyentes, finalizaciones, transiciones E6 permitidas, REQs y pasos E5.", "Diseño", "P0", "Único integrante", "Cerrado", "E7-01", "14 contratos validados antes de dibujar.", "docs/uml/activities/GEI_ACTIVITY_FLOW_CONTRACTS_V1.md (commit 060c950)"],
    ["E7-03", "7", "Activity Diagrams", "Trazabilidad E7 y manifiesto: CU cubiertos por diagrama, REQs, transiciones E6.", "Documentación", "P0", "Único integrante", "Cerrado", "E7-02", "14 diagramas trazados a CU/REQ/E6.", "docs/uml/activities/GEI_ACTIVITY_TRACEABILITY_MATRIX_V1.md + GEI_ACTIVITY_DIAGRAM_MANIFEST_V1.md"],
    ["E7-04", "7", "Activity Diagrams", "Gate de Etapa 7 y freeze de diagramas de actividad.", "Gestión", "P0", "Único integrante", "Cerrado", "E7-03", "GEI_ACTIVITY_DIAGRAM_FREEZE_V1.md FROZEN · PASS.", "docs/uml/activities/GEI_ACTIVITY_DIAGRAM_FREEZE_V1.md (commit fa7687f)"],
    ["E9-01", "9", "Traceability", "Preflight E9 + source inventory: baseline E8 verificada (dce6c05), typecheck/test 92/92/build PASS, autoridades E1-E8 inventariadas y extraídas (157 REQ, 8 actores, 102 CU, 454 AC, 17 SM, 14 AD, 37 clases).", "Gestión", "P0", "Único integrante", "Cerrado", "Etapa 8 cerrada", "Extracciones normalizadas y verificadas contra archivos reales.", "docs/traceability/source-data/ + GEI_TRACEABILITY_RECONCILIATION_AUDIT_V1.md"],
    ["E9-02", "9", "Traceability", "Ledger canónico de trazabilidad: 3.929 relaciones justificadas, 12 tipos de relación documentados, 0 duplicadas, 0 colgantes.", "Implementación", "P0", "Único integrante", "Cerrado", "E9-01", "CSV ledger íntegro y validable de forma independiente.", "docs/traceability/GEI_TRACEABILITY_LEDGER_V1.csv"],
    ["E9-03", "9", "Traceability", "Matrices directas/AC/inversa: master (157 REQ con cadena REQ-Actor-CU-Spec-SM/AD-Clase), AC contextual REQ×CU (454), inversa (0 huérfanos reales).", "Documentación", "P0", "Único integrante", "Cerrado", "E9-02", "3 matrices proyección verificable del ledger.", "docs/traceability/GEI_MASTER_TRACEABILITY_MATRIX_V1.md + GEI_ACCEPTANCE_CRITERIA_TRACEABILITY_V1.md + GEI_REVERSE_TRACEABILITY_MATRIX_V1.md"],
    ["E9-04", "9", "Traceability", "Detección de anomalías: 17 hallazgos TRACE + 10 TRACE-FEEDBACK (2 MAJOR R-07/R-10 no bloqueantes, 8 MINOR, 7 INFO); 0 bloqueantes.", "QA", "P0", "Único integrante", "Cerrado", "E9-03", "Anomaly Register V1 con evidencia, causa, impacto y recomendación por hallazgo.", "docs/traceability/GEI_TRACEABILITY_ANOMALY_REGISTER_V1.md"],
    ["E9-05", "9", "Traceability", "Reconciliación: stress de integración de 13 áreas (11 consistentes, 2 conflictos MAJOR registrados); decisiones sobre base E6 (65 transiciones reales), conteo E7 (40+5+57), formato AC, referencias colectivas E3, clasificación NFR (35).", "QA", "P0", "Único integrante", "Cerrado", "E9-04", "Reconciliation Audit V1 con Machine QA y Semantic QA PASS.", "docs/traceability/GEI_TRACEABILITY_RECONCILIATION_AUDIT_V1.md"],
    ["E9-06", "9", "Traceability", "Coverage QA con validador reutilizable: 157/157 REQ, 102/102 CU, 454/454 AC, 65/65 transiciones, 37/37 clases, 8/8 actores; todos los checks del contrato en 0/PASS.", "QA", "P0", "Único integrante", "Cerrado", "E9-05", "validate_traceability.mjs PASS sobre el CSV committeado.", "docs/traceability/scripts/validate_traceability.mjs + source-data/e9_machine_qa.json"],
    ["E9-07", "9", "Traceability", "Gate E9 + freeze + workbook: Traceability Freeze V1 FROZEN · PASS; roadmap/backlog/artefactos/decisiones/riesgos sincronizados; E9.5 registrada como gate pendiente.", "Gestión", "P0", "Único integrante", "Cerrado", "E9-06", "Freeze V1 con declaración de cobertura y reglas de autoridad.", "docs/traceability/GEI_TRACEABILITY_FREEZE_V1.md"],
    ["E95-01", "9.5", "Traceability", "Ejecutar E9.5 - Auditoría Integral + Cierre Académico (auditoría semántica independiente del sistema E1-E9 + veredicto académico). NO ejecutar sin decisión del usuario.", "QA", "P0", "Único integrante", "No iniciado", "Etapa 9 cerrada", "Auditoría independiente ejecutada y veredicto académico emitido y registrado.", "docs/traceability/GEI_TRACEABILITY_FREEZE_V1.md"],
  ];
  let s4 = await get("xl\\worksheets\\sheet4.xml");
  s4 = appendRows(s4, backlogRows.map((v, i) => brow(57 + i, v)).join(""));
  s4 = s4.split('sqref="H3:H48"').join('sqref="H3:H69"');
  edits["xl\\worksheets\\sheet4.xml"] = s4;

  // ===== Resumen (xl\worksheets\sheet1.xml) =====
  let s1 = await get("xl\\worksheets\\sheet1.xml");
  s1 = s1.replace(/(<x:c r="A5"[^>]*>[\s\S]*?<t>)[^<]*(<\/t>)/, "$1E9.5 — Auditoría Integral + Cierre Académico (gate pendiente)$2");
  s1 = s1.replace(/<x:c r="B5"[^>]*>[\s\S]*?<\/x:c>/, `<x:c r="B5" s="99" t="n"><x:f>IF(COUNTIF(Backlog!$B:$B,9.5)=0,0,COUNTIFS(Backlog!$B:$B,9.5,Backlog!$H:$H,"Cerrado")/COUNTIF(Backlog!$B:$B,9.5))</x:f><x:v>0</x:v></x:c>`);
  s1 = replaceCell(s1, "E5", "<x:v>12</x:v>", "<x:v>13</x:v>");
  s1 = replaceCell(s1, "G5", "<x:v>6</x:v>", "<x:v>7</x:v>");
  s1 = replaceCell(s1, "B17", "<x:v>12</x:v>", "<x:v>13</x:v>");
  s1 = replaceCell(s1, "B21", "<x:v>34</x:v>", "<x:v>53</x:v>");
  edits["xl\\worksheets__sheet1.placeholder"] = null; // (no-op para claridad)
  edits["xl\\worksheets\\sheet1.xml"] = s1;

  // ===== Artefactos (xl\worksheets\sheet5.xml): ART-052..060 =====
  const arteRows = [
    ["ART-052", "Traceability Ledger V1 (CSV, 3.929 relaciones justificadas)", "9", "Documentación", "Sí - vigente (única verdad estructural)", "Activo", "docs/traceability/GEI_TRACEABILITY_LEDGER_V1.csv", "Suple el CSV E8 citado y ausente (GEI_CLASS_TRACEABILITY_FULL_V1.csv)", "Etapa 9"],
    ["ART-053", "Master Traceability Matrix V1 (157 REQ)", "9", "Documentación", "Sí - vigente", "Activo", "docs/traceability/GEI_MASTER_TRACEABILITY_MATRIX_V1.md", "", "Etapa 9"],
    ["ART-054", "Acceptance Criteria Traceability V1 (454 AC, cobertura REQ×CU)", "9", "QA", "Sí - vigente", "Activo", "docs/traceability/GEI_ACCEPTANCE_CRITERIA_TRACEABILITY_V1.md", "", "Etapa 9"],
    ["ART-055", "Reverse Traceability Matrix V1", "9", "QA", "Sí - vigente", "Activo", "docs/traceability/GEI_REVERSE_TRACEABILITY_MATRIX_V1.md", "", "Etapa 9"],
    ["ART-056", "Traceability Anomaly Register V1 (17 TRACE + 10 TRACE-FEEDBACK)", "9", "QA", "Sí - vigente", "Activo", "docs/traceability/GEI_TRACEABILITY_ANOMALY_REGISTER_V1.md", "", "Etapa 9"],
    ["ART-057", "Traceability Reconciliation Audit V1", "9", "QA", "Sí - vigente", "Activo", "docs/traceability/GEI_TRACEABILITY_RECONCILIATION_AUDIT_V1.md", "", "Etapa 9"],
    ["ART-058", "Traceability Freeze V1", "9", "Documentación", "Sí - vigente", "Activo", "docs/traceability/GEI_TRACEABILITY_FREEZE_V1.md", "", "Etapa 9"],
    ["ART-059", "Scripts E9 (ledger + matrices + validador + workbook)", "9", "Implementación", "Herramientas de QA", "Activo", "docs/traceability/scripts/", "", "Etapa 9"],
    ["ART-060", "Extracciones normalizadas E1-E8 (source-data)", "9", "Documentación", "Derivadas de autoridades congeladas", "Activo", "docs/traceability/source-data/", "", "Etapa 9"],
  ];
  let s5 = await get("xl\\worksheets\\sheet5.xml");
  s5 = appendRows(s5, arteRows.map((v, i) => brow(54 + i, v)).join(""));
  edits["xl\\worksheets\\sheet5.xml"] = s5;

  // ===== Decisiones (xl\worksheets\sheet6.xml): DEC-009..011 =====
  const decRows = [
    ["DEC-009", "IDs canónicos de criterios de aceptación", "E5 no numera los AC; no existe el formato AC-XXX. La única referencia individual de la fuente es el ordinal por REQ.", "Inventar un formato AC-XXX / adoptar el ordinal de la fuente", "Adoptar REQ-<DOM>-<NNN> AC n como ID estable en todo el sistema E9.", "Cerrada", "Ledger, matrices y QA E9 usan el ID canónico.", "9", "docs/traceability/**", "Usado literalmente en fichas E5 (p.ej. REQ-COM-007 AC 4 en UC-COM-12)."],
    ["DEC-010", "Conflictos R-07/R-10 de la matriz E8", "El stress E9 detectó que R-07 (RoleAssignment→Competition scope LINE) contradice PT §5 y E2, y R-10 (Division 0..*-1 Season) contradice PT §4/§26 y CL-08 (Division sin seasonId).", "Corregir las autoridades E8 dentro de E9 / registrar feedback para Change Control", "Registrar TRACE-FEEDBACK-01/02 (MAJOR, no bloqueantes) y excluirlos como aristas respaldadas del ledger. Ningún REQ/CU/TR los usa.", "Abierta", "Matriz de relaciones E8 y diagramas CL-PPL/CL-STR; riesgo RSK-007.", "9", "docs/uml/classes/GEI_CLASS_RELATIONSHIP_MATRIX_V1.md", "Errata E8 (Change Control) requerida antes de iniciar E10."],
    ["DEC-011", "Base cuantitativa de transiciones E6", "El freeze E6 declara TOTAL 62, pero su propia columna por máquina suma 65 y la matriz tiene 66 filas (65 reales + TR-036, fila de ausencia documentada).", "Forzar el total declarado / reconciliar con el detalle de la matriz", "E9 adopta 65/65 transiciones respaldadas como base verificada; discrepancia registrada como TRACE-FEEDBACK-03 (error de suma del resumen).", "Cerrada", "Ledger, matrices y QA E9 (TRANSITIONS_BACKED 65/65).", "9", "docs/uml/states/GEI_STATE_DIAGRAM_FREEZE_V1.md", "Errata menor E6 pendiente."],
  ];
  let s6 = await get("xl\\worksheets\\sheet6.xml");
  s6 = appendRows(s6, decRows.map((v, i) => brow(11 + i, v)).join(""));
  edits["xl\\worksheets\\sheet6.xml"] = s6;

  // ===== Riesgos (xl\worksheets\sheet7.xml): RSK-007/008 =====
  function rrow(rn, vals) {
    const cells = vals.map((v, i) => `<c r="${String.fromCharCode(65 + i)}${rn}" s="${i === 0 ? "32" : "33"}" t="inlineStr"><is><t>${esc(v)}</t></is></c>`).join("");
    return `<row r="${rn}" customHeight="1" ht="15" hidden="0" xmlns="${XNS}">${cells}</row>`;
  }
  const rskRows = [
    ["RSK-007", "Implementar contra la matriz de relaciones E8 sin resolver R-07/R-10", "Conflictos semánticos MAJOR detectados por el stress E9: scope LINE no autorizado por PT §5/E2; Division→Season contradice PT §4/§26.", "Media", "Alto", "P1", "Errata E8 (Change Control) antes de E10; el ledger E9 ya los excluye como aristas respaldadas.", "Inicio de E10 sin errata E8 publicada.", "Único integrante", "Abierto", "9"],
    ["RSK-008", "Declarar cumplimiento de NFR sin evidencia de implementación", "5 NFR IMPLEMENTATION_PENDING + REQ-PRT-008 EVIDENCE_PENDING (DEF-SYS-002/003 de E1).", "Media", "Medio", "P2", "Checklist de evidencia por NFR en las etapas de construcción; E9 los marca IMPLEMENTATION_PENDING, no cumplidos.", "Alguien declara un NFR como done sin evidencia.", "Único integrante", "Abierto", "9"],
  ];
  let s7 = await get("xl\\worksheets\\sheet7.xml");
  s7 = appendRows(s7, rskRows.map((v, i) => rrow(9 + i, v)).join(""));
  edits["xl\\worksheets\\sheet7.xml"] = s7;

  // ===== Tablas y workbook =====
  let t1 = await get("xl\\tables\\table1.xml");
  edits["xl\\tables\\table1.xml"] = t1.split('ref="A2:H23"').join('ref="A2:H24"');
  let t2 = await get("xl\\tables\\table2.xml");
  edits["xl\\tables\\table2.xml"] = t2.split('ref="A2:K48"').join('ref="A2:K68"');
  let wb = await get("xl\\workbook.xml");
  if (!wb.includes("calcPr")) wb = wb.replace("</x:sheets>", '</x:sheets><x:calcPr calcId="0" fullCalcOnLoad="1" />');
  edits["xl\\workbook.xml"] = wb;

  delete edits["xl\\worksheets__sheet1.placeholder"];

  // ===== Reempaquetar =====
  const outZip = new JSZip();
  for (const name of Object.keys(zip.files)) {
    if (edits[name] !== undefined) outZip.file(name, edits[name]);
    else outZip.file(name, await zip.file(name).async("nodebuffer"));
  }
  const buf = await outZip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  writeFileSync(XLSX, buf);
  console.log("Workbook actualizado. Entradas:", Object.keys(zip.files).length, "| Editadas:", Object.keys(edits).length);
})().catch((e) => { console.error("FAIL:", e.message); process.exit(1); });
