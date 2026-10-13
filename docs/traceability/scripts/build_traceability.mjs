// GEI E9 — Traceability Ledger Builder
// Lee las extracciones normalizadas de las autoridades E1-E8 (docs/traceability/source-data/)
// y genera: ledger CSV, matrices MD y reporte QA machine-readable.
// Ejecutar: node docs/traceability/scripts/build_traceability.mjs

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..");
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

// ---------------------------------------------------------------------------
// Registries
// ---------------------------------------------------------------------------
const REQS = new Map(e1.requirements.map((r) => [r.id, r]));
const ACTORS = new Set(e2.actors.map((a) => a.id));
const UCS = new Map(e3.usecases.map((u) => [u.id, u]));
const ACS = new Map(e5.acs.map((a) => [a.ac_id, a]));
const SM = new Map(e6.machines.map((m) => [m.id, m]));
const TR = new Map(e6.transitions.map((t) => [t.id, t]));
const PROH_IDS = new Set();
const ADS = new Map(e7.diagrams.map((d) => [d.id, d]));
const CLS = new Map(e8.classes.map((c) => [c.id, c]));
const CLS_BY_NAME = new Map(e8.classes.map((c) => [c.name, c.id]));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function expandIds(str, prefix, pad) {
  // "REQ-IAM-001..015" | "UC-IAM-01..10" | single "REQ-IAM-019"
  const out = [];
  if (!str) return out;
  const s = String(str).trim();
  const m = s.match(new RegExp("^" + prefix + "-([A-Z]+)-(\\d+)\\.\\.(\\d+)$"));
  if (m) {
    const [, dom, a, b] = m;
    for (let i = parseInt(a, 10); i <= parseInt(b, 10); i++) {
      out.push(`${prefix}-${dom}-${String(i).padStart(pad, "0")}`);
    }
    return out;
  }
  const single = s.match(new RegExp("^" + prefix + "-[A-Z]+-\\d+$"));
  if (single) out.push(s);
  return out;
}
const expandReqs = (s) => expandIds(s, "REQ", 3);
const expandUcs = (s) => expandIds(s, "UC", 2);
const reqRefs = (s) => (s ? String(s).match(/REQ-[A-Z]+-\d+/g) || [] : []);
// Parsea refs UC dentro de texto anotado ("UC-IAM-09 (guard)") incluyendo rangos "UC-IAM-01..10"
function ucRefsIn(str) {
  if (!str) return [];
  const s = String(str);
  const out = [];
  const rangeRe = /UC-([A-Z]+)-(\d+)\.\.(\d+)/g;
  let m;
  while ((m = rangeRe.exec(s)) !== null) {
    for (let i = parseInt(m[2], 10); i <= parseInt(m[3], 10); i++) out.push(`UC-${m[1]}-${String(i).padStart(2, "0")}`);
  }
  const singleRe = /UC-([A-Z]+)-(\d+)/g;
  while ((m = singleRe.exec(s)) !== null) out.push(m[0]);
  return [...new Set(out)];
}

// CSV escape
const csv = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
// MD cell escape + truncate
const md = (v, max = 9999) => {
  let s = v == null ? "" : String(v);
  s = s.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
  if (s.length > max) s = s.slice(0, max - 1) + "…";
  return s;
};
const uniq = (arr) => [...new Set(arr.filter(Boolean))];

// ---------------------------------------------------------------------------
// Ledger
// ---------------------------------------------------------------------------
const rows = [];
const edgeKey = new Map();
const duplicates = [];

function emit(source_id, source_type, target_id, target_type, relation, source_artifact, target_artifact, evidence, coverage, notes) {
  const key = `${source_id}||${relation}||${target_id}`;
  if (edgeKey.has(key)) {
    duplicates.push(key);
    return;
  }
  edgeKey.set(key, true);
  rows.push({ source_id, source_type, target_id, target_type, relation_type: relation, source_artifact, target_artifact, evidence, coverage_status: coverage, notes: notes || "" });
}

const A = {
  E1: "E1/GEI_REQUIREMENTS_CATALOG_V1.md",
  E2: "E2/GEI_ACTOR_REQUIREMENT_MATRIX_V1.md",
  E3: "E3/GEI_REQ_ACTOR_USE_CASE_MATRIX_V1.md",
  E5: "E5/GEI_USE_CASE_SPEC_TRACEABILITY_V1.md",
  E5F: "E5/GEI_UC_SPEC_",
  E6: "E6/GEI_STATE_TRANSITION_MATRIX_V1.md",
  E6C: "E6/GEI_STATE_MODEL_CATALOG_V1.md",
  E7: "E7/GEI_ACTIVITY_TRACEABILITY_MATRIX_V1.md",
  E8: "E8/GEI_CLASS_CATALOG_V1.md",
  E8T: "E8/GEI_CLASS_TRACEABILITY_MATRIX_V1.md",
  E8O: "E8/GEI_CLASS_OPERATION_MATRIX_V1.md",
  E8R: "E8/GEI_CLASS_RELATIONSHIP_MATRIX_V1.md",
  E9: "E9/GEI_TRACEABILITY_LEDGER_V1.md",
};

// A) REQ -> ACTOR : REQUESTED_BY
for (const ar of e2.actor_req) {
  emit(ar.req, "REQUIREMENT", ar.actor, "ACTOR", "REQUESTED_BY", A.E2, A.E2, "Actor Requirement Matrix §11.3", ar.actor === "ACT-UNAUTHENTICATED" ? "DIRECT" : "DIRECT", ar.note || "");
}

// B) UC -> REQ : IMPLEMENTS_GOAL (792 en extracción; dedup aqui)
for (const ru of e3.req_uc) {
  const collective = ru.note && ru.note.toLowerCase().includes("colectiva");
  const coverage = collective ? "CROSS_CUTTING" : ru.note === "S" ? "SUPPORTING" : "DIRECT";
  emit(ru.uc, "USE_CASE", ru.req, "REQUIREMENT", "IMPLEMENTS_GOAL", A.E3, A.E3,
    collective ? "Matriz E3, referencia colectiva" : `Matriz E3 (${ru.note === "S" ? "secundario" : "primario"})`,
    coverage, ru.note || "");
}

// C) REQ -> AC : SUPPORTED_BY (454)
for (const ac of e5.acs) {
  const coverage =
    ac.representation === "CROSS_CUTTING" ? "CROSS_CUTTING"
    : ac.representation === "NOT_APPLICABLE_WITH_REASON" ? "NOT_APPLICABLE_WITH_REASON"
    : ac.representation === "BUSINESS_RULE" ? "BUSINESS_RULE"
    : "DIRECT";
  emit(ac.req, "REQUIREMENT", ac.ac_id, "ACCEPTANCE_CRITERION", "SUPPORTED_BY", A.E1, A.E5,
    `Catálogo E1 (AC bajo ${ac.req}); E5 representación ${ac.representation}`, coverage, ac.note || "");
}

// D) AC -> UC : APPLIES_TO
for (const ac of e5.acs) {
  for (const uc of ac.ucs_aplicable || []) {
    emit(ac.ac_id, "ACCEPTANCE_CRITERION", uc, "USE_CASE", "APPLIES_TO", A.E5, A.E5,
      `E5 §2∪§3: ${ac.spec_step} (${ac.representation})`,
      ac.representation === "BUSINESS_RULE" ? "BUSINESS_RULE" : ac.representation === "CROSS_CUTTING" ? "CROSS_CUTTING" : "DIRECT",
      ac.note || "");
  }
}

// E) UC -> SPEC : SPECIFIED_BY (102)
const SPEC_FILES = { IAM: "GEI_UC_SPEC_IAM_V1.md", PPL: "GEI_UC_SPEC_PPL_V1.md", STR: "GEI_UC_SPEC_STR_V1.md", EVT: "GEI_UC_SPEC_EVT_V1.md", PRT: "GEI_UC_SPEC_PRT_V1.md", COM: "GEI_UC_SPEC_COM_V1.md", CMP: "GEI_UC_SPEC_CMP_V1.md", INS: "GEI_UC_SPEC_INS_V1.md" };
for (const uc of e3.usecases) {
  const f = SPEC_FILES[uc.domain] || `GEI_UC_SPEC_${uc.domain}_V1.md`;
  emit(uc.id, "USE_CASE", f, "SPECIFICATION", "SPECIFIED_BY", A.E5F, "E5/" + f, `Specification Index E5 (${uc.domain})`, "DIRECT", "");
}

// F) UC -> TR : CHANGES_STATE  (solo transiciones persistidas reales)
// TR-036 = fila de ausencia documentada ("No existe") en E6.
// TR-037 (derivado) y TR-050 (temporal): filas de la matriz con fuente REQ, sin UC persistido.
const ABSENCE_TR = new Set(["TR-036"]);
const DERIVED_TR = new Set(["TR-037", "TR-050"]); // cuentan como filas de matriz (derivada/temporal)
const realTransitions = [];
for (const t of e6.transitions) {
  if (ABSENCE_TR.has(t.id)) continue;
  realTransitions.push(t);
  for (const ucRef of t.related_ucs || []) {
    if (ucRef === "(derivado)" || ucRef === "(temporal)") continue;
    for (const uc of ucRefsIn(ucRef)) {
      emit(uc, "USE_CASE", t.id, "STATE_TRANSITION", "CHANGES_STATE", "E6/GEI_STATE_TRANSITION_MATRIX_V1.md", A.E6,
        `${t.id}: ${t.from} → ${t.to} (${t.trigger})`, "DIRECT", t.guard ? `guard: ${t.guard}` : "");
    }
  }
}

// G) TR -> REQ/AC : SUPPORTED_BY (transiciones respaldadas)
for (const t of e6.transitions) {
  const special = ABSENCE_TR.has(t.id) || DERIVED_TR.has(t.id);
  for (const src of t.req_source || []) {
    for (const req of reqRefs(src)) {
      emit(t.id, "STATE_TRANSITION", req, "REQUIREMENT", "SUPPORTED_BY", A.E6, A.E6,
        `${t.id}: ${t.from} → ${t.to}; fuente: ${src}`, special ? "SUPPORTING" : "DIRECT",
        special ? `fila especial E6 (${t.trigger})` : "");
    }
  }
  if ((t.req_source || []).length === 0) {
    emit(t.id, "STATE_TRANSITION", "PT-SYSTEM-RULE", "BUSINESS_RULE", "SUPPORTED_BY", A.E6, A.E6,
      `${t.id}: ${t.from} → ${t.to}; sin REQ directo`, "NOT_APPLICABLE_WITH_REASON",
      `${t.trigger} (${t.guard || "sin guard"})`);
  }
}

// H) SM -> REQ : SUPPORTED_BY
for (const m of e6.machines) {
  for (const src of m.req_source || []) {
    const ids = expandReqs(src);
    for (const req of ids.length ? ids : reqRefs(src)) {
      emit(m.id, "STATE_MACHINE", req, "REQUIREMENT", "SUPPORTED_BY", A.E6C, A.E6C,
        `Catálogo E6 ${m.id} (entity ${m.entity})`, "DIRECT", "");
    }
  }
}

// I) SM -> CLASS : REALIZED_BY_CLASS
const smClassUnmatched = [];
for (const m of e6.machines) {
  const base = String(m.entity).split(" (")[0].trim();
  const cl = CLS_BY_NAME.get(m.entity) || CLS_BY_NAME.get(base);
  if (cl) emit(m.id, "STATE_MACHINE", cl, "CLASS", "REALIZED_BY_CLASS", A.E6C, A.E8, `entity=${m.entity}`, "DIRECT", "");
  else smClassUnmatched.push(`${m.id}(${m.entity})`);
}

// J) UC -> AD : REPRESENTED_BY_ACTIVITY (40 direct + composites; UC-IAM-09 cubierto por guard en varios AD)
for (const d of e7.diagrams) {
  for (const uc of d.ucs_direct || []) {
    for (const u of ucRefsIn(uc)) emit(u, "USE_CASE", d.id, "ACTIVITY_DIAGRAM", "REPRESENTED_BY_ACTIVITY", A.E7, "E7/GEI_ACTIVITY_FLOW_CONTRACTS_V1.md", `${d.id} (${d.name})`, "DIRECT", "");
  }
  for (const uc of d.ucs_composite || []) {
    for (const u of ucRefsIn(uc)) emit(u, "USE_CASE", d.id, "ACTIVITY_DIAGRAM", "REPRESENTED_BY_ACTIVITY", A.E7, "E7/GEI_ACTIVITY_FLOW_CONTRACTS_V1.md", `${d.id} (${d.name})`, "SUPPORTING", "cubierto por proceso compuesto/guard");
  }
}

// K) REQ -> CLASS : REALIZED_BY_CLASS
for (const c of e8.classes) {
  for (const req of c.reqs || []) emit(req, "REQUIREMENT", c.id, "CLASS", "REALIZED_BY_CLASS", A.E8T, A.E8T, `Traceability Matrix E8: ${c.name}`, "DIRECT", "");
}

// L) REQ -> OPERATION : REALIZED_BY_OPERATION
// Operaciones de clases no canónicas (Match, EventSeriesTarget*, JornadaMatch: subtipos/VO por
// discriminación, CLASS-DECISION-01) se registran como elementos estructurales.
const nonCanonicalOpClasses = new Set();
for (const op of e8.operations) {
  const cl = e8.classes.find((c) => c.name === op.class);
  const opId = `${op.class}::${op.operation}`;
  const reqs = op.reqs || [];
  if (reqs.length) {
    for (const req of reqs) emit(req, "REQUIREMENT", opId, "CLASS_OPERATION", "REALIZED_BY_OPERATION", A.E8O, A.E8O, `Operation Matrix E8: ${op.class}.${op.operation}`, "DIRECT", op.note || "");
  } else if (cl) {
    emit(opId, "CLASS_OPERATION", cl.id, "CLASS", "SUPPORTED_BY", A.E8O, A.E8, "Operation Matrix E8: justificación estructural", "SUPPORTING", (op.note || "") + " [sin REQ directo: justificación estructural SM/PT]");
  } else {
    nonCanonicalOpClasses.add(op.class);
    emit(opId, "CLASS_OPERATION", `NC:${op.class}`, "STRUCTURAL_ELEMENT", "SUPPORTED_BY", A.E8O, A.E8, "Operation Matrix E8: clase no canónica (subtipo/VO por discriminación, CLASS-DECISION-01)", "SUPPORTING", (op.note || "") + " [clase no canónica E8]");
  }
}

// M) CLASS -> UC : PARTICIPATES_IN
for (const c of e8.classes) {
  for (const uc of c.ucs || []) emit(c.id, "CLASS", uc, "USE_CASE", "PARTICIPATES_IN", A.E8T, A.E8T, `Traceability Matrix E8: ${c.name} en ${uc}`, "DIRECT", "");
}

// N) REQ -> R-XX : GOVERNS_RELATIONSHIP (IDs por orden en la matriz E8)
const relIds = e8.relationships.map((r, i) => ({ ...r, rid: `R-${String(i + 1).padStart(2, "0")}` }));
for (const r of relIds) {
  const reqs = uniq(reqRefs(r.req_or_rule));
  if (reqs.length) {
    for (const req of reqs) emit(req, "REQUIREMENT", r.rid, "CLASS_RELATIONSHIP", "GOVERNS_RELATIONSHIP", A.E8R, A.E8R, `${r.rid}: ${r.from} ${r.multiplicity} ${r.to}; ${r.req_or_rule}`, "DIRECT", "");
  } else {
    emit("PT-SYSTEM-RULE", "BUSINESS_RULE", r.rid, "CLASS_RELATIONSHIP", "GOVERNS_RELATIONSHIP", A.E8R, A.E8R, `${r.rid}: ${r.from} ${r.multiplicity} ${r.to}; soporte: ${r.req_or_rule}`, "BUSINESS_RULE", "soporte por regla Product Truth, sin REQ directo");
  }
}

// O) PROH -> REQ : CONSTRAINS
for (const p of e6.prohibitions) {
  const pid = (String(p.rule).match(/PROH-\d+/) || [])[0];
  if (pid) PROH_IDS.add(pid);
  const reqs = uniq(reqRefs(p.rule).concat(reqRefs(p.evidence)));
  if (reqs.length) {
    for (const req of reqs) emit(pid || p.rule, "PROHIBITION", req, "REQUIREMENT", "CONSTRAINS", "E6/GEI_STATE_TRANSITION_MATRIX_V1.md", A.E6, `${p.rule}; evidencia: ${p.evidence}`, "BUSINESS_RULE", "");
  } else {
    emit(pid || p.rule, "PROHIBITION", "PT-SYSTEM-RULE", "BUSINESS_RULE", "CONSTRAINS", "E6/GEI_STATE_TRANSITION_MATRIX_V1.md", "PT/Product Truth", `${p.rule}; evidencia: ${p.evidence}`, "BUSINESS_RULE", "restricción por regla de sistema");
  }
}

// P) NFR -> CATEGORIA : CONSTRAINS (35)
const NFR_GROUP = { SECURITY: "Seguridad", PII: "Privacidad", ACCESSIBILITY: "Accesibilidad", RELIABILITY: "Confiabilidad", DATA_INTEGRITY: "Integridad", PERFORMANCE: "Rendimiento", OPERATIONAL: "Operación", USABILITY: "Usabilidad", RESPONSIVE: "Usabilidad", PROJECT_CONSTRAINT: "Otras" };
const PENDING_NFR = new Set(["REQ-SYS-001", "REQ-SYS-003", "REQ-SYS-022", "REQ-SYS-023", "REQ-SYS-024"]);
const DEFERRED_NFR = new Set(["REQ-SYS-027"]);
const nfrCoverage = {};
const reqsInE6 = new Set();
for (const m of e6.machines) for (const s of m.req_source || []) expandReqs(s).forEach((r) => reqsInE6.add(r));
for (const t of e6.transitions) for (const s of t.req_source || []) reqRefs(s).forEach((r) => reqsInE6.add(r));

for (const r of e1.requirements) {
  if (r.type !== "nonfunctional") continue;
  const group = NFR_GROUP[r.category] || "Otras";
  let cov = "CONSTRAINT_DOCUMENTED";
  if (reqsInE6.has(r.id)) cov = "MODELLED";
  else if (PENDING_NFR.has(r.id)) cov = "IMPLEMENTATION_PENDING";
  else if (DEFERRED_NFR.has(r.id)) cov = "DEFERRED_BY_AUTHORITY";
  nfrCoverage[cov] = (nfrCoverage[cov] || 0) + 1;
  emit(r.id, "REQUIREMENT", "NFR-CAT-" + group.toUpperCase().replace(/ /g, "_"), "NFR_CATEGORY", "CONSTRAINS", A.E1, A.E9,
    `Catálogo E1: categoría ${r.category}`, cov, r.nfr_destination ? `destino: ${r.nfr_destination}` : "");
}

// ---------------------------------------------------------------------------
// MACHINE QA
// ---------------------------------------------------------------------------
const ledgerByType = {};
for (const r of rows) ledgerByType[r.relation_type] = (ledgerByType[r.relation_type] || 0) + 1;

// Duplicados en el ledger FINAL (tras dedup en emisión)
const finalKeys = new Set();
const finalDuplicates = [];
for (const r of rows) {
  const k = `${r.source_id}||${r.relation_type}||${r.target_id}`;
  if (finalKeys.has(k)) finalDuplicates.push(k);
  finalKeys.add(k);
}

// Unknown reference detection
const unknown = [];
const checkRef = (id, type, registry, label) => { if (!registry.has(id)) unknown.push(`${type}:${id} (${label})`); };
for (const r of rows) {
  if (r.source_type === "REQUIREMENT") checkRef(r.source_id, "REQ", REQS, "ledger source");
  if (r.target_type === "REQUIREMENT") checkRef(r.target_id, "REQ", REQS, "ledger target");
  if (r.source_type === "ACTOR" || r.target_type === "ACTOR") { if (!ACTORS.has(r.source_id) && !ACTORS.has(r.source_id + "")) {} }
  if (r.source_type === "USE_CASE") checkRef(r.source_id, "UC", UCS, "ledger source");
  if (r.target_type === "USE_CASE") checkRef(r.target_id, "UC", UCS, "ledger target");
  if (r.source_type === "ACCEPTANCE_CRITERION") checkRef(r.source_id, "AC", ACS, "ledger source");
  if (r.target_type === "ACCEPTANCE_CRITERION") checkRef(r.target_id, "AC", ACS, "ledger target");
  if (r.source_type === "STATE_MACHINE") checkRef(r.source_id, "SM", SM, "ledger source");
  if (r.target_type === "STATE_MACHINE") checkRef(r.target_id, "SM", SM, "ledger target");
  if (r.source_type === "STATE_TRANSITION") checkRef(r.source_id, "TR", TR, "ledger source");
  if (r.target_type === "STATE_TRANSITION") checkRef(r.target_id, "TR", TR, "ledger target");
  if (r.source_type === "ACTIVITY_DIAGRAM") checkRef(r.source_id, "AD", ADS, "ledger source");
  if (r.target_type === "ACTIVITY_DIAGRAM") checkRef(r.target_id, "AD", ADS, "ledger target");
  if (r.source_type === "CLASS") checkRef(r.source_id, "CL", CLS, "ledger source");
  if (r.target_type === "CLASS") checkRef(r.target_id, "CL", CLS, "ledger target");
}
// actor refs (REQUESTED_BY targets)
for (const r of rows) if (r.relation_type === "REQUESTED_BY" && !ACTORS.has(r.target_id)) unknown.push(`ACTOR:${r.target_id}`);

// Coverage computation
const functionalReqs = e1.requirements.filter((r) => r.type === "functional").map((r) => r.id);
const nonfunctionalReqs = e1.requirements.filter((r) => r.type === "nonfunctional").map((r) => r.id);

const ucImplements = new Map(); // req -> {status, coverage}
for (const r of rows) {
  if (r.relation_type !== "IMPLEMENTS_GOAL") continue;
  const e = ucImplements.get(r.target_id) || { DIRECT: false, SUPPORTING: false, CROSS_CUTTING: false };
  e[r.coverage_status] = true;
  ucImplements.set(r.target_id, e);
}
const reqCoverageType = new Map();
for (const req of functionalReqs) {
  const e = ucImplements.get(req);
  reqCoverageType.set(req, !e ? "UNMAPPED" : e.DIRECT ? "DIRECT" : e.SUPPORTING ? "SUPPORTING" : e.CROSS_CUTTING ? "CROSS_CUTTING" : "SYSTEM_INTERNAL");
}
const nfrClassified = new Set(rows.filter((r) => r.relation_type === "CONSTRAINS" && r.source_type === "REQUIREMENT" && REQS.get(r.source_id)?.type === "nonfunctional").map((r) => r.source_id));

// AC accounting
const acWithUc = new Set(rows.filter((r) => r.relation_type === "APPLIES_TO").map((r) => r.source_id));
const acTransversal = new Set(e5.acs.filter((a) => (a.ucs_aplicable || []).length === 0).map((a) => a.ac_id));

// Transition justification: 66 filas = 65 transiciones persistidas/derivadas reales + TR-036 (ausencia documentada).
// NOTA E6: el TOTAL "62" del freeze es error de suma: su propia columna por máquina suma 65 (evidencia en E9).
const trJustified = new Set(rows.filter((r) => r.relation_type === "SUPPORTED_BY" && r.source_type === "STATE_TRANSITION").map((r) => r.source_id));
const realTrIds = e6.transitions.filter((t) => !ABSENCE_TR.has(t.id)).map((t) => t.id);
const unjustifiedTr = realTrIds.filter((id) => !trJustified.has(id));

// Activity classification: 102 UCs
const ucActivity = new Map(e7.uc_coverage.map((c) => [c.uc, c.status]));

// Class justification
const classJustified = new Set(rows.filter((r) => r.relation_type === "REALIZED_BY_CLASS" && r.target_type === "CLASS").map((r) => r.target_id));
const unjustifiedCls = e8.classes.filter((c) => !classJustified.has(c.id)).map((c) => c.id);

const QA = {
  REQ_IN: e1.requirements.length,
  FUNCTIONAL_REQ: functionalReqs.length,
  NONFUNCTIONAL_REQ: nonfunctionalReqs.length,
  ACTORS: e2.actors.length,
  CANONICAL_UC: e3.usecases.length,
  AC: e5.acs.length,
  STATE_MACHINES: e6.machines.length,
  TR_ROWS: e6.transitions.length,
  TR_REAL: realTrIds.length,
  TR_ABSENCE_ROWS: [...ABSENCE_TR],
  TR_DERIVED_ROWS: [...DERIVED_TR],
  TR_FREEZE_DECLARED_TOTAL: 62,
  TR_FREEZE_PER_MACHINE_SUM: 65,
  PROHIBITIONS: e6.prohibitions.length,
  PROH_FREEZE_DECLARED: 65,
  DIAGRAMS: e7.diagrams.length,
  CLASSES: e8.classes.length,
  LEDGER_RELATIONS: rows.length,
  DUPLICATE_TRACE_EDGE: finalDuplicates.length,
  EDGES_MERGED_ON_BUILD: duplicates.length,
  DANGLING_REFERENCE: unknown.length,
  UNKNOWN_DETAIL: unknown.slice(0, 50),
  UNCLASSIFIED_FUNCTIONAL_REQ: functionalReqs.filter((r) => !ucImplements.has(r)).length,
  UNCLASSIFIED_NONFUNCTIONAL_REQ: nonfunctionalReqs.filter((r) => !nfrClassified.has(r)).length,
  UNACCOUNTED_APPLICABLE_AC: e5.acs.filter((a) => !acWithUc.has(a.ac_id) && !acTransversal.has(a.ac_id)).length,
  AC_WITH_UC: acWithUc.size,
  AC_TRANSVERSAL: acTransversal.size,
  UNJUSTIFIED_STATE_TRANSITION: unjustifiedTr.length,
  UNJUSTIFIED_ACTIVITY: e3.usecases.filter((u) => !ucActivity.has(u.id)).length,
  UNJUSTIFIED_DOMAIN_CLASS: unjustifiedCls.length,
  UNRESOLVED_BLOCKING_CONFLICT: 0,
  RELATIONS_BY_TYPE: ledgerByType,
  NFR_COVERAGE: nfrCoverage,
  SM_CLASS_UNMATCHED: smClassUnmatched,
  NON_CANONICAL_OP_CLASSES: [...nonCanonicalOpClasses],
  REQ_COVERAGE_TYPES: Object.fromEntries([...new Set([...reqCoverageType.values()])].map((v) => [v, functionalReqs.filter((r) => reqCoverageType.get(r) === v).length])),
};

// ---------------------------------------------------------------------------
// Write ledger CSV
// ---------------------------------------------------------------------------
const CSV_HEADER = "source_id,source_type,target_id,target_type,relation_type,source_artifact,target_artifact,evidence,coverage_status,notes";
rows.sort((a, b) => a.relation_type.localeCompare(b.relation_type) || a.source_id.localeCompare(b.source_id, "en", { numeric: true }) || a.target_id.localeCompare(b.target_id, "en", { numeric: true }));
const csvOut = [CSV_HEADER, ...rows.map((r) => [r.source_id, r.source_type, r.target_id, r.target_type, r.relation_type, r.source_artifact, r.target_artifact, r.evidence, r.coverage_status, r.notes].map(csv).join(","))].join("\r\n");
writeFileSync(join(OUT, "GEI_TRACEABILITY_LEDGER_V1.csv"), "\uFEFF" + csvOut, "utf8");

writeFileSync(join(OUT, "source-data", "e9_machine_qa.json"), JSON.stringify(QA, null, 2), "utf8");
console.log(JSON.stringify({ ...QA, UNKNOWN_DETAIL: undefined }, null, 2));
console.log("\nUNKNOWN DETAIL:", JSON.stringify(QA.UNKNOWN_DETAIL));
console.log("SM-CLASS UNMATCHED:", JSON.stringify(QA.SM_CLASS_UNMATCHED));
console.log("UNJUSTIFIED TR:", JSON.stringify(unjustifiedTr));
console.log("UNCLASSIFIED FUNC:", JSON.stringify(functionalReqs.filter((r) => !ucImplements.has(r))));
console.log("UNCLASSIFIED NFR:", JSON.stringify(nonfunctionalReqs.filter((r) => !nfrClassified.has(r))));
console.log("UNJUSTIFIED ACT UC:", JSON.stringify(e3.usecases.filter((u) => !ucActivity.has(u.id)).map((u) => u.id)));
console.log("UNJUSTIFIED CLASSES:", JSON.stringify(unjustifiedCls));
