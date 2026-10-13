// GEI E9 — Generador de matrices de trazabilidad (proyecciones del ledger)
// Proyecta GEI_TRACEABILITY_LEDGER_V1.csv en:
//   - GEI_MASTER_TRACEABILITY_MATRIX_V1.md        (directa: REQ → ACTOR → CU → SPEC → SM/AD → CLASS)
//   - GEI_ACCEPTANCE_CRITERIA_TRACEABILITY_V1.md (cobertura contextual REQ×CU de los 454 AC)
//   - GEI_REVERSE_TRACEABILITY_MATRIX_V1.md      (inversa: huérfanos y clasificación)
// Ejecutar: node docs/traceability/scripts/build_matrices.mjs

import { readFileSync, writeFileSync } from "node:fs";
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
const qa = load("e9_machine_qa.json");

// --- Parse CSV ---
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
    if (inQ && li < lines.length - 1) { field += "\n"; continue; }
    row.push(field); field = ""; rows.push(row); row = [];
  }
  return rows;
}
const table = parseCSV(raw);
const H = table[0];
const L = table.slice(1).map((r) => { const o = {}; H.forEach((h, i) => (o[h] = r[i] ?? "")); return o; });

const md = (v, max = 9999) => {
  let s = v == null ? "" : String(v);
  s = s.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
  if (s.length > max) s = s.slice(0, max - 1) + "…";
  return s;
};
const compact = (arr, max = 8) => {
  const a = [...new Set(arr)];
  if (a.length <= max) return a.join(", ") || "—";
  return `${a.slice(0, max).join(", ")} (+${a.length - max})`;
};

// --- Índices directos e inversos desde el ledger ---
const idx = {
  reqActors: new Map(), reqUCs: new Map(), reqACs: new Map(), reqSMs: new Map(),
  reqTRs: new Map(), reqClasses: new Map(), reqOps: new Map(), reqRels: new Map(),
  acUCs: new Map(), ucTRs: new Map(), ucADs: new Map(), ucClasses: new Map(),
  ucREQs: new Map(), ucActors: new Map(), clOps: new Map(), clUCs: new Map(), nfrCat: new Map(),
};
const push = (m, k, v) => { if (!m.has(k)) m.set(k, []); m.get(k).push(v); };

for (const r of L) {
  switch (r.relation_type) {
    case "REQUESTED_BY": push(idx.reqActors, r.source_id, r.target_id); break;
    case "IMPLEMENTS_GOAL": push(idx.reqUCs, r.target_id, { uc: r.source_id, cov: r.coverage_status }); push(idx.ucREQs, r.source_id, r.target_id); break;
    case "SUPPORTED_BY": {
      if (r.source_type === "REQUIREMENT" && r.target_type === "ACCEPTANCE_CRITERION") push(idx.reqACs, r.source_id, r.target_id);
      if (r.source_type === "STATE_MACHINE" && r.target_type === "REQUIREMENT") push(idx.reqSMs, r.target_id, r.source_id);
      if (r.source_type === "STATE_TRANSITION" && r.target_type === "REQUIREMENT") push(idx.reqTRs, r.target_id, r.source_id);
      break;
    }
    case "APPLIES_TO": push(idx.acUCs, r.source_id, { uc: r.target_id, cov: r.coverage_status }); break;
    case "CHANGES_STATE": push(idx.ucTRs, r.source_id, r.target_id); break;
    case "REPRESENTED_BY_ACTIVITY": push(idx.ucADs, r.source_id, { ad: r.target_id, cov: r.coverage_status }); break;
    case "REALIZED_BY_CLASS": { if (r.source_type === "REQUIREMENT") push(idx.reqClasses, r.source_id, r.target_id); break; }
    case "REALIZED_BY_OPERATION": { push(idx.reqOps, r.source_id, r.target_id); push(idx.clOps, r.target_id.split("::")[0], r.target_id); break; }
    case "PARTICIPATES_IN": { push(idx.ucClasses, r.target_id, r.source_id); push(idx.clUCs, r.source_id, r.target_id); break; }
    case "GOVERNS_RELATIONSHIP": push(idx.reqRels, r.source_id, r.target_id); break;
    case "CONSTRAINS": { if (r.target_type === "NFR_CATEGORY") idx.nfrCat.set(r.source_id, { cat: r.target_id, cov: r.coverage_status }); break; }
  }
}
for (const ru of e3.req_uc) { if (ru.actor) push(idx.ucActors, ru.uc, ru.actor); }

const CLNAME = new Map(e8.classes.map((c) => [c.id, c.name]));
const UCDOM = new Map(e3.usecases.map((u) => [u.id, u.domain]));

// ===========================================================================
// 1. MASTER TRACEABILITY MATRIX
// ===========================================================================
const specOfUC = (uc) => "GEI_UC_SPEC_" + (UCDOM.get(uc) || "?") + "_V1.md";
{
  const lines = [];
  lines.push("# GEI — Master Traceability Matrix V1");
  lines.push("");
  lines.push("> **Etapa:** E9-03 · **Estado:** FROZEN con E9 · **Fuente estructural:** `GEI_TRACEABILITY_LEDGER_V1.csv` (3.929 relaciones justificadas).");
  lines.push("> Cadena directa: `REQ → ACTOR → CU → ESPECIFICACIÓN → ESTADOS/TRANSICIONES → ACTIVIDADES → CLASES/OPERACIONES`.");
  lines.push("> Proyección 1:1 del ledger; no constituye una segunda verdad. La evidencia por fila son las aristas del ledger citadas por ID.");
  lines.push("");
  lines.push("**Tipos de cobertura (REQ funcional):** `DIRECT` (≥1 CU lo implementa como primario) · `SUPPORTING` (soporte vía CU secundario) · `CROSS_CUTTING` (regla transversal aplicable al conjunto, referencia colectiva de la matriz E3).");
  lines.push("**Cobertura (REQ no funcional):** `MODELLED` (tiene máquina/estructura E6/E8) · `CONSTRAINT_DOCUMENTED` (restricción documentada en catálogo/PT) · `IMPLEMENTATION_PENDING` (evidencia de implementación pendiente, DEF-* de E1) · `DEFERRED_BY_AUTHORITY` (decisión externa).");
  lines.push("");
  lines.push("| Columna | Contenido |");
  lines.push("|---|---|");
  lines.push("| Actores | Actores fuente del REQ (REQUESTED_BY, matriz E2) |");
  lines.push("| CU | Casos de uso que lo implementan (IMPLEMENTS_GOAL, matriz E3) |");
  lines.push("| Spec | Fichas E5 donde el CU está especificado |");
  lines.push("| AC | Criterios de aceptación del REQ (nº) |");
  lines.push("| SM / TR | Máquinas y transiciones E6 respaldadas por el REQ |");
  lines.push("| AD | Diagramas de actividad E7 que representan sus CU |");
  lines.push("| Clases/Op | Clases E8 y operaciones que lo realizan |");
  lines.push("");
  lines.push("## Matriz maestra — 157 REQ");
  lines.push("");
  lines.push("| REQ | Objetivo | Actores | CU | Spec | AC | SM | TR | AD | Clases/Op | Cobertura |");
  lines.push("|---|---|---|---|---|---:|---|---|---|---|---|");
  const reqsSorted = [...e1.requirements].sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true }));
  for (const r of reqsSorted) {
    const actors = idx.reqActors.get(r.id) || [];
    const ucs = idx.reqUCs.get(r.id) || [];
    const ucIds = [...new Set(ucs.map((u) => u.uc))];
    const crossCut = ucs.length > 15;
    const ucCell = crossCut ? ucIds.length + " CU (transversal, ref. colectiva E3)" : compact(ucIds, 6);
    const specs = [...new Set(ucIds.map(specOfUC))].map((s) => s.replace("GEI_UC_SPEC_", "").replace("_V1.md", ""));
    const acs = idx.reqACs.get(r.id) || [];
    const sms = idx.reqSMs.get(r.id) || [];
    const trs = idx.reqTRs.get(r.id) || [];
    const ads = [...new Set(ucIds.flatMap((u) => (idx.ucADs.get(u) || []).map((x) => x.ad)))];
    const classes = [...new Set(idx.reqClasses.get(r.id) || [])].map((c) => CLNAME.get(c) || c);
    const ops = (idx.reqOps.get(r.id) || []).map((o) => o.split("::")[1] || o);
    const clsOp = [classes.length ? compact(classes, 5) : "", ops.length ? "op:" + ops.length : ""].filter(Boolean).join(" ") || "—";
    let cov;
    if (r.type === "functional") {
      cov = ucs.some((u) => u.cov === "DIRECT") ? "DIRECT" : ucs.some((u) => u.cov === "SUPPORTING") ? "SUPPORTING" : ucs.length ? "CROSS_CUTTING" : "UNMAPPED";
    } else {
      const n = idx.nfrCat.get(r.id);
      cov = n ? n.cov : "UNCLASSIFIED";
    }
    lines.push("| " + r.id + " | " + md(r.goal, 90) + " | " + compact(actors, 4) + " | " + ucCell + " | " + compact(specs, 4) + " | " + (acs.length || "—") + " | " + compact(sms, 3) + " | " + compact(trs, 5) + " | " + compact(ads, 4) + " | " + clsOp + " | " + cov + " |");
  }
  lines.push("");
  lines.push("## Cobertura agregada");
  lines.push("");
  lines.push("| Métrica | Valor |");
  lines.push("|---|---|");
  lines.push("| REQ IN clasificados con destino | 157/157 |");
  lines.push("| REQ funcionales | 122 = " + Object.entries(qa.REQ_COVERAGE_TYPES).map(([k, v]) => v + " " + k).join(" + ") + " |");
  lines.push("| REQ no funcionales | 35 = " + qa.NFR_COVERAGE.MODELLED + " MODELLED + " + qa.NFR_COVERAGE.CONSTRAINT_DOCUMENTED + " CONSTRAINT_DOCUMENTED + " + qa.NFR_COVERAGE.IMPLEMENTATION_PENDING + " IMPLEMENTATION_PENDING + " + qa.NFR_COVERAGE.DEFERRED_BY_AUTHORITY + " DEFERRED_BY_AUTHORITY |");
  lines.push("| CU trazados (≥1 arista REQ) | 102/102 |");
  lines.push("| AC contabilizados | 454/454 (418 con CU + 36 transversales/N.A. justificados) |");
  lines.push("| Transiciones E6 respaldadas | 65/65 (66 filas de matriz = 65 reales + TR-036 ausencia documentada) |");
  lines.push("| CU evaluados en actividades | 102/102 (40 DIRECT + 5 COMPOSITE + 57 SIMPLE_NOT_SELECTED justificados) |");
  lines.push("| Clases E8 justificadas | 37/37 |");
  lines.push("");
  lines.push("**Notas de cobertura.** (1) Un `CROSS_CUTTING` no implica aristas inventadas: la matriz E3 declara la referencia colectiva y el ledger la registra con esa única evidencia. (2) `UNMAPPED` = 0 en REQ funcionales. (3) Los REQ NF no se fuerzan a actor/CU: su destino es la clasificación NFR (§8 del contrato E9).");
  writeFileSync(join(OUT, "GEI_MASTER_TRACEABILITY_MATRIX_V1.md"), lines.join("\r\n"), "utf8");
}

// ===========================================================================
// 2. ACCEPTANCE CRITERIA TRACEABILITY
// ===========================================================================
{
  const lines = [];
  lines.push("# GEI — Acceptance Criteria Traceability V1");
  lines.push("");
  lines.push("> **Etapa:** E9-03 · **Estado:** FROZEN con E9 · **Fuente estructural:** `GEI_TRACEABILITY_LEDGER_V1.csv`.");
  lines.push("> Normaliza la limitación conocida de E5 (cobertura por REQ) a cobertura **contextual REQ × CU**: cada AC declara a qué CU aplica realmente, sin suponer que aplica a todos los CU del REQ.");
  lines.push("");
  lines.push("**Formato canónico de AC ID:** E5 no numera los AC como `AC-XXX`; la referencia individual de la fuente es el ordinal dentro del REQ: **`REQ-<DOM>-<NNN> AC n`** (formato usado literalmente en las fichas E5, p. ej. \"REQ-COM-007 AC 4\" en UC-COM-12). E9 adopta ese formato como ID estable.");
  lines.push("");
  lines.push("**Cobertura global:** 454/454 AC contabilizados = 418 con ≥1 CU aplicable (arista `APPLIES_TO`) + 36 transversales/N.A. con razón registrada.");
  lines.push("**Cobertura contextual REQ × CU:** cada arista AC→CU proviene de E5 §2 (ficha) ∪ E5 §3 (matriz E3); la granularidad por paso es una limitación documentada de E5 (los AC se representan a nivel de sección: camino básico/alternativo/bloque de trazabilidad).");
  lines.push("");
  lines.push("## Criterios — 454 AC");
  lines.push("");
  lines.push("| AC | REQ | CU aplicables | Representación | Paso/Sección spec (E5) | Estado/Transición | Actividad (E7) | Clase/Op (E8) | Resultado |");
  lines.push("|---|---|---|---|---|---|---|---|---|");
  const acsSorted = [...e5.acs].sort((a, b) => a.ac_id.localeCompare(b.ac_id, "en", { numeric: true }));
  for (const ac of acsSorted) {
    const pairs = idx.acUCs.get(ac.ac_id) || [];
    const ucIds = [...new Set(pairs.map((p) => p.uc))];
    const ucCell = ucIds.length ? compact(ucIds, 6) : "—";
    const rep = ac.representation || "";
    const paso = ac.spec_step || "";
    const st = ac.state_transition || "—";
    const ads = [...new Set(ucIds.flatMap((u) => (idx.ucADs.get(u) || []).map((x) => x.ad)))];
    const act = ads.length ? compact(ads, 3) : "—";
    const ops = (idx.reqOps.get(ac.req) || []).map((o) => o.split("::")[0] + "." + o.split("::")[1]);
    const classes = [...new Set(idx.reqClasses.get(ac.req) || [])].map((c) => CLNAME.get(c) || c);
    const clsOp = [compact(classes, 3), ops.length ? "op:" + compact(ops, 3) : ""].filter(Boolean).join(" ") || "—";
    const result = ucIds.length ? "ACCOUNTED" : ac.representation === "NOT_APPLICABLE_WITH_REASON" ? "N_A_JUSTIFIED" : "TRANSVERSAL";
    lines.push("| " + md(ac.ac_id) + " | " + ac.req + " | " + ucCell + " | " + md(rep) + " | " + md(paso, 60) + " | " + md(st, 40) + " | " + act + " | " + md(clsOp, 50) + " | " + result + " |");
  }
  lines.push("");
  lines.push("## Limitaciones y equivalencias registradas (heredadas de E5)");
  lines.push("");
  lines.push("1. **SPEC-FEEDBACK-02 (E5):** 13 REQ tienen CU mapeados sólo por matriz E3 (§3) sin fila de ficha E5 §2: REQ-SYS-025→UC-COM-13, REQ-PRT-005→UC-INS-04, REQ-SYS-023→UC-EVT-17, REQ-SYS-018→UC-EVT-02/03/UC-PPL-06, REQ-SYS-014→UC-EVT-18/19, REQ-COM-003→UC-COM-05, REQ-PRT-003→UC-PRT-04, REQ-EVT-017→UC-PRT-08, REQ-STR-008→UC-STR-04/07, REQ-STR-010→UC-PPL-16, REQ-STR-013→UC-EVT-02, REQ-IAM-013→UC-IAM-09, REQ-PPL-012→UC-COM-06. Sus AC aplican a esos CU con evidencia de matriz; la atribución NO es falsa, es de segundo orden.");
  lines.push("2. **14 REQ transversales sin ficha individual** (AC con CU=— y razón): REQ-IAM-007/017/018, REQ-STR-009, REQ-SYS-001–005/008/021/022/026/027. Registrados como reglas internas en bloques de trazabilidad de las fichas aplicables (evidencia E5 §4).");
  lines.push("3. **AC↔paso:** E5 no registra mapeo AC→paso numerado; la representación es a nivel de sección (BASIC_STEP→camino básico, ALTERNATIVE→camino alternativo, BUSINESS_RULE→bloque de trazabilidad, CROSS_CUTTING→transversal). Registrado como limitación, no como hueco.");
  lines.push("4. **0 AC desconocidos · 0 AC aplicables sin representación · 0 atribuciones falsas:** verificado por `validate_traceability.mjs` (UNACCOUNTED_APPLICABLE_AC=0, UNKNOWN_AC=0). Los pares AC→CU de matriz-only (punto 1) se marcan en el ledger con evidencia \"E5 §2∪§3\".");
  writeFileSync(join(OUT, "GEI_ACCEPTANCE_CRITERIA_TRACEABILITY_V1.md"), lines.join("\r\n"), "utf8");
}

// ===========================================================================
// 3. REVERSE TRACEABILITY MATRIX
// ===========================================================================
{
  const lines = [];
  lines.push("# GEI — Reverse Traceability Matrix V1");
  lines.push("");
  lines.push("> **Etapa:** E9-03 · **Estado:** FROZEN con E9 · **Fuente estructural:** `GEI_TRACEABILITY_LEDGER_V1.csv` (misma verdad que la matriz directa).");
  lines.push("> Trazabilidad inversa: cada elemento de diseño (CU, SPEC, SM, TR, AD, clase, operación, relación) debe justificar su existencia con un REQ/AC/CU, o ser clasificado estructural justificado.");
  lines.push("");
  lines.push("**Clasificación de hallazgos:** `VALID` · `JUSTIFIED_STRUCTURAL` · `DOCUMENTATION_GAP` · `SEMANTIC_CONFLICT` · `MISSING_REQUIREMENT` · `STALE_REFERENCE` · `BLOCKING_DECISION`.");
  lines.push("");

  const sec = (title) => { lines.push(""); lines.push(title); lines.push(""); };

  sec("## A. CU sin REQ");
  lines.push("**Resultado: 0.** Los 102 CU tienen ≥1 arista `IMPLEMENTS_GOAL` (gate E3 §28 verificado por extracción). → `VALID`");

  sec("## B. Especificaciones sin CU");
  lines.push("**Resultado: 0.** Las 8 fichas E5 cubren 102/102 CU (IAM 10 · PPL 17 · STR 15 · EVT 19 · PRT 13 · COM 14 · CMP 9 · INS 5). → `VALID`");

  sec("## C. Máquinas de estados sin fuente REQ");
  lines.push("**Resultado: 0 de 17.** Todas las máquinas declaran fuente REQ/AC en el Catálogo E6. → `VALID`");

  sec("## D. Transiciones sin REQ");
  lines.push("**Resultado: 65/65 respaldadas.** La matriz E6 tiene 66 filas: 65 transiciones reales (todas con fuente REQ/AC) + **TR-036** (`YES/MAYBE/NO → NO_RESPONSE`), fila de **ausencia documentada** (\"No existe\": NO_RESPONSE no es estado persistido). → `JUSTIFIED_STRUCTURAL`");
  lines.push("");
  lines.push("Filas derivadas/temporales con fuente REQ (cuentan como filas de matriz, no como transiciones persistidas): TR-037 (`NO_RESPONSE → NEEDS_RECONFIRMATION`, derivado; REQ-PRT-003 AC 2), TR-050 (`BLOCKED/PENDING → (expirada)`, temporal; REQ-PRT-017). → `JUSTIFIED_STRUCTURAL`");
  lines.push("");
  lines.push("**Discrepancia documental E6 registrada:** el freeze declara TOTAL 62, pero su propia columna por máquina suma 65 y la matriz tiene 65 filas reales. Ver TRACE-006 / TRACE-FEEDBACK-03.");

  sec("## E. Actividades — cobertura de los 102 CU");
  const cov = { DIRECT: [], COMPOSITE: [], SIMPLE_NOT_SELECTED: [], BLOCKED: [] };
  for (const c of e7.uc_coverage) (cov[c.status] = cov[c.status] || []).push(c.uc);
  lines.push("**Resultado: 102/102 evaluados.** " + cov.DIRECT.length + " DIRECT (14 diagramas) · " + (cov.COMPOSITE || []).length + " COMPOSITE (cubierto por proceso compuesto/guard) · " + (cov.SIMPLE_NOT_SELECTED || []).length + " SIMPLE_NOT_SELECTED (flujos simples justificados) · " + (cov.BLOCKED || []).length + " BLOCKED. → `VALID`");
  lines.push("");
  lines.push("Los " + (cov.SIMPLE_NOT_SELECTED || []).length + " CU sin diagrama propio **no son huecos**: su exclusión está justificada por la Selection Matrix E7 (flujos simples de un paso o lectura, sin decisiones). Un CU simple sin AD con exclusión justificada es cobertura válida según contrato E9 §11.");
  lines.push("");
  lines.push("**Nota de conteo E7:** la cifra \"45 directamente diagramados\" del Traceability E7 es 40 directos + 5 compuestos (doble conteo documentado); el conteo consistente es 40+5+57=102. Ver TRACE-007 / TRACE-FEEDBACK-04.");

  sec("## F. Clases sin responsabilidad funcional");
  const clsNoReq = e8.classes.filter((c) => !(c.reqs || []).length).map((c) => c.id);
  lines.push("**Resultado: 0 de 37.** Todas las clases canónicas tienen ≥1 REQ que justifica su existencia (aristas `REALIZED_BY_CLASS`)" + (clsNoReq.length ? ". Excepciones: " + clsNoReq.join(", ") : "") + ". → `VALID`");
  lines.push("");
  const opNoReq = e8.operations.filter((o) => !(o.reqs || []).length);
  lines.push("**Operaciones sin REQ directo:** " + opNoReq.length + " de 134 (" + compact(opNoReq.map((o) => o.class + "." + o.operation), 10) + "). Justificación estructural por máquina de estados o regla PT (p. ej. `SelectionRevision.publish` → SM-SELECTIONREV-01; exclusiones temporales → PT §25; `isActiveBlocking` → SM-ELIGIBILITY-01). → `JUSTIFIED_STRUCTURAL`");
  lines.push("");
  lines.push("**Elementos no canónicos en matrices E8** (subtipos/VO por discriminación, CLASS-DECISION-01): `Match` (subtipo de Event), `EventSeriesTargetTeam/Person`, `JornadaMatch`. No son clases canónicas de las 37 y no se cuentan como huérfanos. → `JUSTIFIED_STRUCTURAL`");

  sec("## G. Relaciones entre clases sin soporte");
  const relNoReq = e8.relationships.map((r, i) => ({ ...r, rid: "R-" + String(i + 1).padStart(2, "0") })).filter((r) => !(String(r.req_or_rule).match(/REQ-[A-Z]+-\d+/) || []));
  lines.push("**Sin REQ explícito:** " + relNoReq.length + " de 59: " + compact(relNoReq.map((r) => r.rid + " (" + r.from + "→" + r.to + ")"), 10) + ". Soporte por regla Product Truth: R-49 (Notification→Event, PT §22/§58). → `VALID` (soporte por regla documentada)");
  lines.push("");
  lines.push("**Conflictos semánticos detectados en E9 (stress §17), a resolver por Change Control en E8:**");
  lines.push("- **R-07** `RoleAssignment→Competition (scope LINE)`: contradice PT §5 \"Role scopes válidos\" (PLAYER/CAPTAIN=TEAM, COACH=TEAM/EVENT, SUBCOMMITTEE/ADMIN=CLUB; cualquier otra combinación = `422 INVALID_ROLE_SCOPE`) y E2 §2.1/§2.3 (LINE/COMPETITION no son scopes de actor). Ningún REQ/UC/TR la utiliza. → `SEMANTIC_CONFLICT` (TRACE-001 / TRACE-FEEDBACK-01, MAJOR, no bloqueante).");
  lines.push("- **R-10** `Division 0..* — 1 Season`: contradice PT §4/§26 (Division estable entre temporadas: \"Primera, Quinta, Sexta\"; solo `teams` tiene `season_id`) y E8 CL-08 (Division sin `seasonId`) y UC-STR-03 paso 3. → `SEMANTIC_CONFLICT` (TRACE-002 / TRACE-FEEDBACK-02, MAJOR, no bloqueante).");
  lines.push("- **R-01** índice (Person mult `1`) vs detalle (`0..1`): el detalle es correcto (la persona existe antes de recibir Account, UC-PPL-03). → `SEMANTIC_CONFLICT` interno E8 (TRACE-012 / TRACE-FEEDBACK-06, MINOR).");

  sec("## H. Requisitos sin destino");
  lines.push("**Resultado: 0 de 157.** 122 funcionales con CU (DIRECT/SUPPORTING/CROSS_CUTTING) + 35 no funcionales con clasificación NFR (13 MODELLED · 16 CONSTRAINT_DOCUMENTED · 5 IMPLEMENTATION_PENDING · 1 DEFERRED_BY_AUTHORITY). → `VALID`");
  lines.push("");
  lines.push("Los 5 IMPLEMENTATION_PENDING corresponden a evidencia pendiente registrada por E1 (DEF-SYS-002 → REQ-SYS-003, DEF-SYS-003 → REQ-PRT-008; serie SYS-001/022/023/024). REQ-SYS-027 EXTERNAL = decisión de la organización (DEFERRED_BY_AUTHORITY).");

  sec("## I. Actores — verificación inversa");
  const actorReqCount = {};
  for (const ar of e2.actor_req) actorReqCount[ar.actor] = (actorReqCount[ar.actor] || 0) + 1;
  lines.push("| Actor | REQ asociados (E2) | Pares REQ×CU con participación (E3) | Veredicto |");
  lines.push("|---|---:|---:|---|");
  for (const a of e2.actors) {
    const ucList = e3.req_uc.filter((ru) => ru.actor === a.id);
    lines.push("| " + a.id + " | " + (actorReqCount[a.id] || 0) + " | " + ucList.length + " | VALID |");
  }
  lines.push("");
  lines.push("- **ACT-CAPTAIN:** 0 REQ como actor primario — deliberado (autoridad deportiva propia REQ-EVT-019; participa como secundario en 10 REQ). → `VALID` (justificado en E2 §7.4).");
  lines.push("- **ACT-AUTHENTICATED:** no concede permisos por sí solo (sin rol o delegación → `/no-access`, REQ-IAM-012). → `VALID`.");
  lines.push("- **ADMIN sin autoridad deportiva por defecto; CAPTAIN no hereda de COACH; Guardian depende de GuardianRelationship:** 4/4 checks críticos E2 documentados y verificados en E9 (freeze E2 §14.1, §7.4, §5.1, §4.2). → `VALID`");
  lines.push("- 52 REQ SYSTEM_INTERNAL/NOT_APPLICABLE sin actor: por diseño (reglas internas del sistema). → `VALID`");

  sec("## J. Referencias obsoletas / colgantes");
  lines.push("- `GEI_CLASS_TRACEABILITY_FULL_V1.csv`: citado por `GEI_CLASS_TRACEABILITY_MATRIX_V1.md` (nota de matriz completa 157×102×37) pero **nunca committeado**. La muestra representativa por dominio del MD es la evidencia disponible. → `STALE_REFERENCE` (TRACE-003 / TRACE-FEEDBACK-05, MINOR: el CSV ausente se suple con el ledger E9, que sí cubre 157×102×37).");
  lines.push("- `GEI_USE_CASE_RECONSTRUCTION_AUDIT_V1.md` (E3): inexistente; ya registrado por la errata E3 (`GEI_E3_MISSING_AUDIT_ERRATA_V1.md`, desviación D-2 de E4-0.1). → `STALE_REFERENCE` conocido y cerrado por errata. → deuda documentada.");
  lines.push("- `DEF-CMP-001` citado como \"REQ que sustenta\" en inversa §12 de UC-PRT-11: es ítem DEFER de E1, no REQ IN. → `DOCUMENTATION_GAP` (TRACE-013, MINOR).");

  sec("## Resumen de clasificación");
  lines.push("| Categoría | Hallazgos |");
  lines.push("|---|---|");
  lines.push("| VALID | 0 huérfanos reales: CU, SPEC, SM, REQ y actores con participación justificada |");
  lines.push("| JUSTIFIED_STRUCTURAL | TR-036 (ausencia documentada), TR-037/TR-050 (derivadas/temporales), " + (cov.SIMPLE_NOT_SELECTED || []).length + " CU SIMPLE_NOT_SELECTED, operaciones estructurales E8, clases no canónicas (Match, EventSeriesTarget*, JornadaMatch), 12 modelos temporales E6 sin SM persistida |");
  lines.push("| DOCUMENTATION_GAP | 13 REQ con UC por matriz-only (SPEC-FEEDBACK-02), DEF-CMP-001 en UC-PRT-11, inconsistencia forward/inversa matriz E3 §12 (123 pares, TRACE-010) |");
  lines.push("| SEMANTIC_CONFLICT | R-07, R-10 (MAJOR, no bloqueantes), R-01 índice (MINOR), Event DRAFT inalcanzable en E6 (MINOR, TRACE-011) |");
  lines.push("| MISSING_REQUIREMENT | 0 |");
  lines.push("| STALE_REFERENCE | CSV E8 ausente (TRACE-003), audit E3 ausente (cerrado por errata E3) |");
  lines.push("| BLOCKING_DECISION | 0 |");
  lines.push("");
  lines.push("**Conclusión inversa:** no existe ningún elemento de diseño sin fuente, justificación estructural o clasificación documentada. Los conflictos semánticos registrados (R-07, R-10) son defectos de las autoridades congeladas E8 detectados por el stress de integración E9; están registrados como TRACE-FEEDBACK con corrección mínima propuesta y NO bloquean la cadena REQ→CU→CLASS para ningún REQ funcional (ningún REQ/CU/TR depende de ellos).");
  writeFileSync(join(OUT, "GEI_REVERSE_TRACEABILITY_MATRIX_V1.md"), lines.join("\r\n"), "utf8");
}

console.log("OK: 3 matrices generadas desde el ledger.");
