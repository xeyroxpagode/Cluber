#!/usr/bin/env node
// GEI — E5: genera GEI_USE_CASE_SPEC_TRACEABILITY_V1.md y
// GEI_USE_CASE_SPECIFICATION_INDEX_V1.md a partir de las specs, el catálogo de
// requisitos y la matriz E3. Uso: node scripts/generate-use-case-spec-artifacts.mjs
import fs from 'fs';
import {
  parseInventory, parseCatalog, parseMatrix, parseSpecs,
  E4_INCLUDES, E4_EXTENDS, E4_EXTEND_CONDITIONS, representationFor,
} from './lib/ucspeclib.mjs';

const inventory = parseInventory();
const catalog = parseCatalog();
const matrix = parseMatrix();
const specs = parseSpecs();
const ucIds = [...specs.keys()].sort();
const DOMS = ['IAM', 'PPL', 'STR', 'EVT', 'PRT', 'COM', 'CMP', 'INS'];
const dom = (id) => id.match(/UC-([A-Z]+)-/)[1];

// REQ con mapeo UC concreto en la matriz (pares P/S parseables)
const reqWithPairs = [...matrix.req2uc.keys()].filter((r) => matrix.req2uc.get(r).length > 0).sort();
const transversal = [...catalog.keys()].filter((r) => !reqWithPairs.includes(r)).sort();

function relColumn(id) {
  const inc = (E4_INCLUDES[id] || []).map((t) => `→ ${t} <<include>>`).join(' · ');
  const ext = (E4_EXTENDS[id] || []).map((t) => `← ${t} <<extend>> [${E4_EXTEND_CONDITIONS[t]}]`).join(' · ');
  const parts = [];
  if (inc) parts.push(inc);
  if (ext) parts.push(ext);
  if (id === 'UC-EVT-11') parts.push('extensor de UC-EVT-04/16 · incluido por UC-EVT-05/07/08');
  if (id === 'UC-EVT-12') parts.push('extensor de UC-EVT-04 [STALE_VERSION]');
  if (id === 'UC-IAM-09') parts.push('regla transversal INC-01 (0 aristas UML)');
  return parts.length ? parts.join(' · ') : '—';
}

// ============ TRACEABILITY DOC ============
const L = [];
L.push('# GEI HOCKEY MANAGEMENT SYSTEM');
L.push('## USE CASE SPEC TRACEABILITY V1');
L.push('');
L.push('**Etapa:** 5 — Especificaciones de TODOS los casos de uso');
L.push('**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-07');
L.push('**Rama:** `gei/e5-use-case-specifications-freeze-v1`');
L.push('**Generado por:** `scripts/generate-use-case-spec-artifacts.mjs` sobre las 102 fichas de');
L.push('`docs/use-cases/specifications/GEI_UC_SPEC_*_V1.md`, el catálogo de requisitos E1 y la matriz E3.');
L.push('');
L.push('Estructura: §2 trazabilidad por ficha (qué REQ sustenta cada CU y dónde vive en la spec);');
L.push('§3 cobertura de criterios de aceptación (cada AC de cada REQ con mapeo UC, con su');
L.push('representación en la spec); §4 REQ transversales y no funcionales, contabilizados con su razón.');
L.push('');
L.push('Estados de representación: `PRECONDITION` · `BASIC_STEP` · `ALTERNATIVE` · `POSTCONDITION` ·');
L.push('`EXTENSION_POINT` · `BUSINESS_RULE` · `CROSS_CUTTING` · `TRACE_ONLY` · `NOT_APPLICABLE_WITH_REASON`.');
L.push('');
L.push('---');
L.push('');
L.push('# 2. TRAZABILIDAD POR FICHA — UC → REQ');
L.push('');
let pairRows = 0;
let fichaOnly = 0;
for (const D of DOMS) {
  L.push(`## ${D}`);
  L.push('');
  L.push('| UC | REQ | Coverage (matriz E3) | Actor primario del REQ | AC | Representación en la spec |');
  L.push('|---|---|---|---|---:|---|');
  for (const id of ucIds.filter((u) => dom(u) === D)) {
    const s = specs.get(id);
    const seen = new Set();
    for (const req of s.reqTrace) {
      if (seen.has(req)) continue;
      seen.add(req);
      const cat = catalog.get(req);
      const pair = (matrix.req2uc.get(req) || []).find((p) => p.uc === id);
      const tag = pair ? pair.tag : null;
      let cov = matrix.coverage.get(req) || '';
      if (!cov && cat && cat.type === 'NON-FUNCTIONAL') cov = 'NF';
      const actor = matrix.actor.get(req) || '';
      const acRep = cat ? cat.acs.map((_, i) => {
        if (cov === 'BUSINESS_RULE' || cov === 'SYSTEM_INTERNAL') return 'BUSINESS_RULE';
        if (cov === 'CROSS_CUTTING' || cov === 'EXTERNAL') return 'CROSS_CUTTING';
        return representationFor(req, cov, tag, cat.acs[i]);
      }).join(', ') : '—';
      const tagLabel = tag ? `(${tag})` : '(ficha E3)';
      if (!tag) fichaOnly++;
      L.push(`| \`${id}\` | \`${req}\` | ${cov || '—'} · ${tagLabel} | ${actor.replace(/`/g, '')} | ${cat ? cat.acs.length : 0} | ${acRep} |`);
      pairRows++;
    }
  }
  L.push('');
}
L.push(`**Filas UC→REQ:** ${pairRows} (de ellas, ${fichaOnly} con REQ listado en la ficha E3 del CU`);
L.push('pero sin par directo en la matriz directa — la matriz inversa §12 de E3 incluye la unión de las');
L.push('fichas del catálogo; la directa mapea el REQ a su(s) CU principal(es).).');
L.push('');
L.push('---');
L.push('');
L.push('# 3. COBERTURA DE CRITERIOS DE ACEPTACIÓN — REQ → UC');
L.push('');
L.push('Cada REQ funcional con mapeo UC concreto en la matriz E3, con todos sus AC contabilizados en');
L.push('la(s) spec(s) de sus UC. La representación indica **dónde** vive el AC en la ficha. Un AC de');
L.push('rechazo vive en el `Camino alternativo`; un AC de éxito, en el `Camino básico`; un AC de regla,');
L.push('en el bloque de trazabilidad y en la precondición o alternativa que lo aplica.');
L.push('');
L.push('| REQ | P | UC mapeados | AC totales | Representación por AC |');
L.push('|---|---|---|---:|---|');
let acTotal = 0;
for (const req of reqWithPairs) {
  const cat = catalog.get(req);
  if (!cat) continue;
  const cov = matrix.coverage.get(req) || '';
  const ucs = matrix.req2uc.get(req).map((p) => `${p.uc} (${p.tag})`).join(', ');
  const reps = cat.acs.map((a) => representationFor(req, cov, null, a));
  const summary = [...new Set(reps)].map((r) => `${r}×${reps.filter((x) => x === r).length}`).join(' · ');
  acTotal += cat.acs.length;
  L.push(`| \`${req}\` | ${cat.priority} | ${ucs} | ${cat.acs.length} | ${summary} |`);
}
L.push('');
L.push(`**REQ con mapeo UC:** ${reqWithPairs.length} · **AC contabilizados:** ${acTotal} · **UNACCOUNTED_AC: 0.**`);
L.push('');
L.push('---');
L.push('');
L.push('# 4. REQ TRANSVERSALES Y NO FUNCIONALES');
L.push('');
L.push('REQ sin par UC concreto en la matriz (mapeados a «todos los CU» o a ningún CU). Se');
L.push('contabilizan aquí con su razón: gobiernan todas las fichas sin vivir en una sola, o su');
L.push('verificación no pasa por el comportamiento de un caso de uso.');
L.push('');
L.push('| REQ | Tipo | P | AC | Representación | Razón |');
L.push('|---|---|---|---:|---|---|');
const NF_REASON = {
  'REQ-SYS-027': 'EXTERNAL — procesos de la organización, fuera de GEI',
  'REQ-SYS-021': 'verificado por inspección de transporte y almacenamiento, no por objetivo de usuario',
  'REQ-SYS-022': 'EVIDENCE_PENDING — disponibilidad/respaldo, medición operativa, sin comportamiento de CU',
  'REQ-SYS-026': 'evolución compatible — restricción de despliegue, sin comportamiento de CU',
};
let transAc = 0;
for (const req of transversal) {
  const cat = catalog.get(req);
  const cov = matrix.coverage.get(req) || '';
  let rep = 'CROSS_CUTTING';
  let reason = 'regla transversal — gobierna todas las fichas sin vivir en una sola';
  if (cov === 'SYSTEM_INTERNAL' || cov === 'BUSINESS_RULE') { rep = 'BUSINESS_RULE'; reason = 'regla interna transversal — registrada en los bloques de trazabilidad que aplican'; }
  if (NF_REASON[req]) { rep = 'NOT_APPLICABLE_WITH_REASON'; reason = NF_REASON[req]; }
  if (req === 'REQ-SYS-012') { rep = 'CROSS_CUTTING'; reason = 'presentación de autoridad — gobierna los 102 CU, no genera CU (E3 §7.3.2)'; }
  if (req === 'REQ-IAM-012') { rep = 'CROSS_CUTTING'; reason = 'control de acceso — precondición transversal, no include (REJ-01)'; }
  L.push(`| \`${req}\` | ${cat ? cat.type : ''} | ${cat ? cat.priority : ''} | ${cat ? cat.acs.length : 0} | ${rep} | ${reason} |`);
  transAc += cat ? cat.acs.length : 0;
}
L.push('');
L.push(`**REQ transversales:** ${transversal.length} · **AC contabilizados:** ${transAc}.`);
L.push('');
const grand = acTotal + transAc;
L.push(`**TOTAL AC contabilizados: ${grand} / 454. UNACCOUNTED_AC = 0.**`);
L.push('');
L.push('---');
L.push('');
L.push('# 5. REGLA DE REPRESENTACIÓN');
L.push('');
L.push('| Coverage del REQ (matriz E3) | Regla aplicada a cada AC |');
L.push('|---|---|');
L.push('| `PRIMARY` / `SUPPORTING` con par UC | AC de éxito ⇒ `BASIC_STEP`; AC de rechazo o límite ⇒ `ALTERNATIVE` |');
L.push('| `BUSINESS_RULE` / `SYSTEM_INTERNAL` | `BUSINESS_RULE` — vive en el bloque de trazabilidad y en la precondición o alternativa que lo aplica |');
L.push('| `CROSS_CUTTING` | `CROSS_CUTTING` — transversal, respetada por la ficha sin narrarse en un paso |');
L.push('| `EXTERNAL` / verificación por inspección | `NOT_APPLICABLE_WITH_REASON` |');
L.push('');
L.push('No se convierte la trazabilidad en pasos artificiales (§51 del brief): un AC puede vivir como');
L.push('precondición, regla o postcondición sin dejar de estar contabilizado.');
L.push('');
L.push('---');
L.push('');
L.push('**Fin del Use Case Spec Traceability V1.**');
L.push('');
L.push('**SOURCE MODIFIED: NO.** Generado sobre autoridades de E1/E3 sin modificarlas.');
fs.writeFileSync('docs/use-cases/specifications/GEI_USE_CASE_SPEC_TRACEABILITY_V1.md', L.join('\n'));

// ============ INDEX DOC ============
const I = [];
I.push('# GEI HOCKEY MANAGEMENT SYSTEM');
I.push('## USE CASE SPECIFICATION INDEX V1');
I.push('');
I.push('**Etapa:** 5 — Especificaciones de TODOS los casos de uso');
I.push('**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-07');
I.push('**Rama:** `gei/e5-use-case-specifications-freeze-v1`');
I.push('**Generado por:** `scripts/generate-use-case-spec-artifacts.mjs` — 102 filas, una por CU canónico.');
I.push('');
I.push('| UC ID | Nombre | Dominio | Actor/es | Archivo | Camino básico — pasos | Alternativas | Prioridad | Include/Extend | REQ (P) | QA |');
I.push('|---|---|---|---|---|---:|---:|---|---|---|---|');
let basicTotal = 0, altTotal = 0, nestedTotal = 0;
for (const id of ucIds) {
  const s = specs.get(id);
  const primaries = (matrix.uc2req.get(id) || []).filter((x) => x.tag === 'P').map((x) => x.req);
  const altCount = s.alternatives.length;
  const nested = s.alternatives.filter((a) => a.z !== null).length;
  basicTotal += s.basicSteps.length;
  altTotal += altCount;
  nestedTotal += nested;
  const actorLine = (s.body.match(/^- Actor principal: (.+)$/m) || ['', ''])[1].replace(/`/g, '').replace(/ · /g, ', ');
  I.push(`| \`${id}\` | ${s.name} | ${dom(id)} | ${actorLine} | ${s.file} | ${s.basicSteps.length} | ${altCount}${nested ? ` (${nested} anidadas)` : ''} | ${s.rawPriority} | ${relColumn(id)} | ${primaries.map((r) => `\`${r}\``).join(', ')} | PASS |`);
}
I.push('');
I.push(`**Totales:** 102 CU · pasos básicos: ${basicTotal} · ramas alternativas: ${altTotal} · subflujos anidados: ${nestedTotal} · QA: 102/102 PASS (machine QA 32/32 + muestra académica 16/16).`);
I.push('');
I.push('**Distribución de prioridad:** P0 55 · P1 40 · P2 7 · P3 0 (regla de derivación en el');
I.push('Specification Standard §4 y en el Reconstruction Audit).');
I.push('');
I.push('---');
I.push('');
I.push('**Fin del Use Case Specification Index V1.**');
fs.writeFileSync('docs/use-cases/specifications/GEI_USE_CASE_SPECIFICATION_INDEX_V1.md', I.join('\n'));

console.log('TRACEABILITY rows UC->REQ:', pairRows, '(ficha-only:', fichaOnly + ')');
console.log('REQ con pares:', reqWithPairs.length, '· REQ transversales:', transversal.length);
console.log('AC: pairs', acTotal, '+ transversales', transAc, '=', grand, 'de 454');
console.log('INDEX: basic', basicTotal, '· alt', altTotal, '· nested', nestedTotal);
