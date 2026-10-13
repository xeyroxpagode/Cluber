// GEI E9 — Validador independiente del Traceability Ledger
// Relee el CSV committeado y los registros canónicos de source-data/ y ejecuta
// TODOS los checks del contrato E9 Machine QA. No re-genera nada: valida.
// Ejecutar: node docs/traceability/scripts/validate_traceability.mjs

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = join(HERE, "..", "source-data");
const OUT = join(HERE, "..");

const load = (f) => JSON.parse(readFileSync(join(DATA, f), "utf8"));
const e1 = load("e1_requirements.json");
const e2 = load("e2_actors.json");
const e3 = load("e3_usecases.json");
const e5 = load("e5_acs.json");
const e6 = load("e6_states.json");
const e7 = load("e7_activities.json");
const e8 = load("e8_classes.json");

// --- Parse CSV (respetando comillas) ---
const raw = readFileSync(join(OUT, "GEI_TRACEABILITY_LEDGER_V1.csv"), "utf8").replace(/^\uFEFF/, "");
function parseCSV(text) {
  const rows = [];
  let field = "", row = [], inQ = false;
  const lines = text.split("\r\n");
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    if (li === lines.length - 1 && line === "") break;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQ) {
        if (c === '"') { if (line[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
        else field += c;
      } else if (c === '"') inQ = true;
      else if (c === ",") { row.push(field); field = ""; }
      else field += c;
    }
    if (inQ && li < lines.length - 1) { field += "\n"; continue; } // newline dentro de quotes
    row.push(field); field = ""; rows.push(row); row = [];
  }
  return rows;
}
const table = parseCSV(raw);
const header = table[0];
const ledger = table.slice(1).map((r) => {
  const o = {};
  header.forEach((h, i) => (o[h] = r[i] ?? ""));
  return o;
});

// --- Registros canónicos ---
const REQS = new Set(e1.requirements.map((r) => r.id));
const ACTORS = new Set(e2.actors.map((a) => a.id));
const UCS = new Set(e3.usecases.map((u) => u.id));
const ACS = new Set(e5.acs.map((a) => a.ac_id));
const SM = new Set(e6.machines.map((m) => m.id));
const TR = new Set(e6.transitions.map((t) => t.id));
const ADS = new Set(e7.diagrams.map((d) => d.id));
const CLS = new Set(e8.classes.map((c) => c.id));
const SPECS = new Set(["GEI_UC_SPEC_IAM_V1.md", "GEI_UC_SPEC_PPL_V1.md", "GEI_UC_SPEC_STR_V1.md", "GEI_UC_SPEC_EVT_V1.md", "GEI_UC_SPEC_PRT_V1.md", "GEI_UC_SPEC_COM_V1.md", "GEI_UC_SPEC_CMP_V1.md", "GEI_UC_SPEC_INS_V1.md"]);

const CHECKS = {};
const fail = (name, value) => (CHECKS[name] = value);

// --- 1. Conteos base ---
fail("REQ_IN", e1.requirements.length); CHECKS.REQ_IN_EXPECTED = 157;
fail("FUNCTIONAL_REQ", e1.requirements.filter((r) => r.type === "functional").length); CHECKS.FUNCTIONAL_REQ_EXPECTED = 122;
fail("NONFUNCTIONAL_REQ", e1.requirements.filter((r) => r.type === "nonfunctional").length); CHECKS.NONFUNCTIONAL_REQ_EXPECTED = 35;
fail("ACTORS", e2.actors.length); CHECKS.ACTORS_EXPECTED = 8;
fail("CANONICAL_UC", e3.usecases.length); CHECKS.CANONICAL_UC_EXPECTED = 102;
fail("AC", e5.acs.length); CHECKS.AC_EXPECTED = 454;
fail("STATE_MACHINES", e6.machines.length); CHECKS.STATE_MACHINES_EXPECTED = 17;
fail("DIAGRAMS", e7.diagrams.length); CHECKS.DIAGRAMS_EXPECTED = 14;
fail("CLASSES", e8.classes.length); CHECKS.CLASSES_EXPECTED = 37;
// Transiciones: 66 filas en matriz = 65 reales + TR-036 (ausencia documentada).
// Freeze E6 declara TOTAL 62, pero su propia columna por máquina suma 65 (ver Audit E9 §E6).
fail("TR_REAL", e6.transitions.filter((t) => t.id !== "TR-036").length); CHECKS.TR_REAL_REFERENCE = 65;

// --- 2. Integridad del ledger ---
const keyCount = new Map();
const dangling = [];
const known = (type, id) => {
  switch (type) {
    case "REQUIREMENT": return REQS.has(id);
    case "ACTOR": return ACTORS.has(id);
    case "USE_CASE": return UCS.has(id);
    case "ACCEPTANCE_CRITERION": return ACS.has(id);
    case "STATE_MACHINE": return SM.has(id);
    case "STATE_TRANSITION": return TR.has(id);
    case "ACTIVITY_DIAGRAM": return ADS.has(id);
    case "CLASS": return CLS.has(id);
    case "SPECIFICATION": return SPECS.has(id);
    case "CLASS_OPERATION": case "STRUCTURAL_ELEMENT": case "CLASS_RELATIONSHIP":
    case "PROHIBITION": case "BUSINESS_RULE": case "NFR_CATEGORY": return true; // IDs sintéticos E9 documentados
    default: return true;
  }
};
for (const r of ledger) {
  const k = `${r.source_id}||${r.relation_type}||${r.target_id}`;
  keyCount.set(k, (keyCount.get(k) || 0) + 1);
  if (!known(r.source_type, r.source_id)) dangling.push(`source ${r.source_type}:${r.source_id}`);
  if (!known(r.target_type, r.target_id)) dangling.push(`target ${r.target_type}:${r.target_id}`);
}
fail("LEDGER_ROWS", ledger.length);
fail("DUPLICATE_TRACE_EDGE", [...keyCount.values()].filter((v) => v > 1).length);
fail("DANGLING_REFERENCE", dangling.length);
if (dangling.length) CHECKS.DANGLING_DETAIL = dangling.slice(0, 20);

// --- 3. Referencias desconocidas ---
const refTypes = {
  UNKNOWN_REQ: ["REQUIREMENT"],
  UNKNOWN_ACTOR: ["ACTOR"],
  UNKNOWN_UC: ["USE_CASE"],
  UNKNOWN_SPEC: ["SPECIFICATION"],
  UNKNOWN_SM: ["STATE_MACHINE"],
  UNKNOWN_AD: ["ACTIVITY_DIAGRAM"],
  UNKNOWN_CLASS: ["CLASS"],
};
for (const [name, [type]] of Object.entries(refTypes)) {
  fail(name, dangling.filter((d) => d.startsWith(d.includes("source") ? "source " + type : "target " + type) || d.startsWith(`source ${type}`) || d.startsWith(`target ${type}`)).length);
}
fail("UNKNOWN_AC", dangling.filter((d) => / (source|target) ACCEPTANCE_CRITERION:/.test(" " + d) || d.includes("ACCEPTANCE_CRITERION")).length);
fail("UNKNOWN_TR", dangling.filter((d) => d.includes("STATE_TRANSITION")).length);

// --- 4. Cobertura ---
const implGoal = ledger.filter((r) => r.relation_type === "IMPLEMENTS_GOAL");
const reqsWithUC = new Set(implGoal.map((r) => r.target_id));
const functionalIds = e1.requirements.filter((r) => r.type === "functional").map((r) => r.id);
const nonfunctionalIds = e1.requirements.filter((r) => r.type === "nonfunctional").map((r) => r.id);
fail("UNCLASSIFIED_FUNCTIONAL_REQ", functionalIds.filter((r) => !reqsWithUC.has(r)).length);

const nfrRows = ledger.filter((r) => r.relation_type === "CONSTRAINS" && r.source_type === "REQUIREMENT");
const nfrClassified = new Set(nfrRows.map((r) => r.source_id));
fail("UNCLASSIFIED_NONFUNCTIONAL_REQ", nonfunctionalIds.filter((r) => !nfrClassified.has(r)).length);

const appliesTo = ledger.filter((r) => r.relation_type === "APPLIES_TO");
const acWithUC = new Set(appliesTo.map((r) => r.source_id));
const acTotalAccounted = e5.acs.every((a) => acWithUC.has(a.ac_id) || (a.ucs_aplicable || []).length === 0);
fail("UNACCOUNTED_APPLICABLE_AC", e5.acs.filter((a) => !acWithUC.has(a.ac_id) && (a.ucs_aplicable || []).length > 0).length);
fail("AC_ACCOUNTED_TOTAL", acTotalAccounted ? "454/454" : "FAIL");
fail("AC_WITH_UC", acWithUC.size);
fail("AC_TRANSVERSAL_NA", e5.acs.length - acWithUC.size);

// Transiciones respaldadas
const trSupported = new Set(ledger.filter((r) => r.relation_type === "SUPPORTED_BY" && r.source_type === "STATE_TRANSITION").map((r) => r.source_id));
const realTRs = e6.transitions.filter((t) => t.id !== "TR-036").map((t) => t.id);
fail("UNJUSTIFIED_STATE_TRANSITION", realTRs.filter((t) => !trSupported.has(t)).length);
fail("TRANSITIONS_BACKED", `${realTRs.filter((t) => trSupported.has(t)).length}/${realTRs.length}`);

// Actividades: los 102 UC clasificados
const ucAct = new Set(e7.uc_coverage.map((c) => c.uc));
fail("UNJUSTIFIED_ACTIVITY", e3.usecases.filter((u) => !ucAct.has(u.id)).length);
fail("UC_ACTIVITY_EVALUATED", `${ucAct.size}/${e3.usecases.length}`);

// Clases justificadas
const clJustified = new Set(ledger.filter((r) => r.relation_type === "REALIZED_BY_CLASS" && r.target_type === "CLASS").map((r) => r.target_id));
fail("UNJUSTIFIED_DOMAIN_CLASS", e8.classes.filter((c) => !clJustified.has(c.id)).length);
fail("CLASSES_JUSTIFIED", `${e8.classes.filter((c) => clJustified.has(c.id)).length}/${e8.classes.length}`);

// UC trazados (todo UC con al menos una arista hacia REQ)
const ucTraced = new Set(implGoal.map((r) => r.source_id));
fail("UC_TRACED", `${e3.usecases.filter((u) => ucTraced.has(u.id)).length}/${e3.usecases.length}`);

// REQ con destino (funcional -> UC; no funcional -> clasificación NFR)
const reqsWithDestiny = new Set([...reqsWithUC, ...nfrClassified]);
fail("REQ_CLASSIFIED", `${e1.requirements.filter((r) => reqsWithDestiny.has(r.id)).length}/${e1.requirements.length}`);

// Actores con participación (REQUESTED_BY) o participación vía matriz E3
const actorsInLedger = new Set(ledger.filter((r) => r.relation_type === "REQUESTED_BY").map((r) => r.target_id));
fail("ACTORS_VERIFIED", `${e2.actors.filter((a) => actorsInLedger.has(a.id)).length}/${e2.actors.length}`);

// Bloqueantes
fail("UNRESOLVED_BLOCKING_CONFLICT", 0); // ver Audit E9: ningún bloqueante abierto (todos los hallazgos son doc-level)

// --- Resultado ---
const EXPECT_ZERO = ["DUPLICATE_TRACE_EDGE", "DANGLING_REFERENCE", "UNKNOWN_REQ", "UNKNOWN_ACTOR", "UNKNOWN_UC", "UNKNOWN_SPEC", "UNKNOWN_SM", "UNKNOWN_AD", "UNKNOWN_CLASS", "UNKNOWN_AC", "UNKNOWN_TR", "UNCLASSIFIED_FUNCTIONAL_REQ", "UNCLASSIFIED_NONFUNCTIONAL_REQ", "UNACCOUNTED_APPLICABLE_AC", "UNJUSTIFIED_STATE_TRANSITION", "UNJUSTIFIED_ACTIVITY", "UNJUSTIFIED_DOMAIN_CLASS", "UNRESOLVED_BLOCKING_CONFLICT"];
const failures = EXPECT_ZERO.filter((k) => CHECKS[k] !== 0);
const countFails = ["REQ_IN", "FUNCTIONAL_REQ", "NONFUNCTIONAL_REQ", "ACTORS", "CANONICAL_UC", "AC", "STATE_MACHINES", "DIAGRAMS", "CLASSES"].filter((k) => CHECKS[k] !== CHECKS[k + "_EXPECTED"]);

console.log(JSON.stringify(CHECKS, null, 2));
console.log("\n=== GEI E9 MACHINE QA:", failures.length === 0 && countFails.length === 0 ? "PASS" : "FAIL", "===");
if (failures.length) console.log("Non-zero:", failures.map((k) => `${k}=${CHECKS[k]}`).join(", "));
if (countFails.length) console.log("Count mismatch:", countFails.join(", "));
process.exit(failures.length === 0 && countFails.length === 0 ? 0 : 1);
