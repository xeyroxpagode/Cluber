import { readZip } from "./lib/zipxlsx.mjs";
import { readSheet, sheetParts } from "./lib/xlsx.mjs";

const e = readZip("docs/project-control/GEI_Roadmap_Maestro_Proyecto.xlsx");
const p = sheetParts(e);
const pick = (rows, cols) => rows.map((r) => {
  const g = (c) => { const x = r.cells.find((k) => k.colName === c); return x ? (x.value ?? "") : ""; };
  return cols.map(g).join(" | ");
});
const roadmap = readSheet(e, p[1].partName).filter((r) => r.row >= 3 && r.row <= 8);
console.log("=== Roadmap (Etapa | Nombre | Estado | Progreso | Siguiente acción) ===");
pick(roadmap, ["A", "B", "F", "G", "H"]).forEach((l, i) => console.log(roadmap[i].row + ": " + l));
console.log("\n=== Backlog E4 ===");
readSheet(e, p[3].partName).filter((r) => r.row >= 27).forEach((r) => {
  const g = (c) => { const x = r.cells.find((k) => k.colName === c); return x ? (x.value ?? "") : ""; };
  console.log(`${g("A")} | etapa ${g("B")} | ${g("D").slice(0, 62)}… | ${g("E")} | ${g("F")} | ${g("H")}`);
});
console.log("\n=== Artefactos E4 ===");
readSheet(e, p[4].partName).filter((r) => r.row >= 12).forEach((r) => {
  const g = (c) => { const x = r.cells.find((k) => k.colName === c); return x ? (x.value ?? "") : ""; };
  console.log(`${g("A")} | ${g("B")} | Etapa ${g("C")} | ${g("E")} | ${g("F")} | ${g("G")}`);
});
console.log("\n=== Decisiones E4 ===");
readSheet(e, p[5].partName).filter((r) => r.row >= 7).forEach((r) => {
  const g = (c) => { const x = r.cells.find((k) => k.colName === c); return x ? (x.value ?? "") : ""; };
  console.log(`${g("A")} | ${g("B")} | ${g("F")} | ${g("G")} | Etapa ${g("H")}`);
});
console.log("\n=== Resumen ===");
readSheet(e, p[0].partName).forEach((r) => {
  if (r.row === 5 || (r.row >= 17 && r.row <= 21)) {
    const g = (c) => { const x = r.cells.find((k) => k.colName === c); return x ? (x.value ?? "") : ""; };
    console.log(`${r.row}: ${g("A")} = ${g("B")} ${g("C")} ${g("E")} ${g("G")}`);
  }
});
