import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SPECS_DIR = path.join(ROOT, 'docs/use-cases/specifications');
const SPEC_FILES = [
  'GEI_UC_SPEC_IAM_V1.md',
  'GEI_UC_SPEC_PPL_V1.md',
  'GEI_UC_SPEC_STR_V1.md',
  'GEI_UC_SPEC_EVT_V1.md',
  'GEI_UC_SPEC_PRT_V1.md',
  'GEI_UC_SPEC_COM_V1.md',
  'GEI_UC_SPEC_CMP_V1.md',
  'GEI_UC_SPEC_INS_V1.md',
];
export const DOMAIN_FILES = {
  IAM: 'GEI_UC_SPEC_IAM_V1.md',
  PPL: 'GEI_UC_SPEC_PPL_V1.md',
  STR: 'GEI_UC_SPEC_STR_V1.md',
  EVT: 'GEI_UC_SPEC_EVT_V1.md',
  PRT: 'GEI_UC_SPEC_PRT_V1.md',
  COM: 'GEI_UC_SPEC_COM_V1.md',
  CMP: 'GEI_UC_SPEC_CMP_V1.md',
  INS: 'GEI_UC_SPEC_INS_V1.md',
};
export const CANONICAL_ACTORS = new Set([
  'ACT-ADMIN', 'ACT-SUBCOMMITTEE', 'ACT-COACH', 'ACT-CAPTAIN',
  'ACT-PLAYER', 'ACT-GUARDIAN', 'ACT-AUTHENTICATED', 'ACT-UNAUTHENTICATED',
]);

// E4 V1.0.1 — modelo final de relaciones congelado
export const E4_INCLUDES = {
  'UC-EVT-05': ['UC-EVT-11'],
  'UC-EVT-07': ['UC-EVT-11'],
  'UC-EVT-08': ['UC-EVT-11'],
};
export const E4_EXTENDS = {
  'UC-EVT-04': ['UC-EVT-11', 'UC-EVT-12'],
  'UC-EVT-16': ['UC-EVT-11'],
};
export const E4_EXTEND_CONDITIONS = {
  'UC-EVT-11': 'MATERIAL_CHANGE',
  'UC-EVT-12': 'STALE_VERSION',
};
// INC-01: perímetro de gestión sensible con derivación transversal a UC-IAM-09
// (candidatas include de E3, congeladas como regla transversal por E4 V1.0.1)
export const REAUTH_WHITELIST = new Set([
  'UC-IAM-02', 'UC-IAM-03', 'UC-IAM-05',
  'UC-PPL-01', 'UC-PPL-02', 'UC-PPL-03', 'UC-PPL-04', 'UC-PPL-05', 'UC-PPL-06',
  'UC-PPL-07', 'UC-PPL-08', 'UC-PPL-09', 'UC-PPL-10', 'UC-PPL-11', 'UC-PPL-12',
  'UC-STR-01', 'UC-STR-02', 'UC-STR-03', 'UC-STR-04', 'UC-STR-05', 'UC-STR-06',
  'UC-STR-07', 'UC-STR-08', 'UC-STR-09', 'UC-STR-10', 'UC-STR-11', 'UC-STR-12',
  'UC-STR-13', 'UC-STR-15',
  'UC-PRT-12',
  'UC-CMP-01', 'UC-CMP-02', 'UC-CMP-03', 'UC-CMP-04', 'UC-CMP-05',
  'UC-CMP-06', 'UC-CMP-07', 'UC-CMP-08',
]);

export function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

export function parseInventory() {
  const t = read('docs/use-cases/GEI_MASTER_USE_CASE_INVENTORY_FREEZE_V1.md');
  const map = new Map();
  // §4.2 «Los 102, en una línea cada uno»: | `UC-ID` | Nombre | `ACT-…` |
  const re = /^\| `(UC-[A-Z]+-\d+)` \| (.+?) \| `ACT-/gm;
  let m;
  while ((m = re.exec(t))) map.set(m[1], m[2].trim());
  return map;
}

export function parseCatalog() {
  const t = read('docs/requirements/GEI_REQUIREMENTS_CATALOG_V1.md');
  const map = new Map();
  const re = /### (REQ-[A-Z]+-\d+) — (.+?)\n([\s\S]*?)(?=\n### REQ-|\n## \d|$)/g;
  let m;
  while ((m = re.exec(t))) {
    const body = m[3];
    const priority = (body.match(/\*\*PRIORITY:\*\* (P\d)/) || [])[1];
    const type = (body.match(/\*\*TYPE:\*\* ([A-Z-]+)/) || [])[1];
    const category = (body.match(/\*\*CATEGORY:\*\* ([A-Z_]+)/) || [])[1];
    const acBlock = (body.match(/\*\*ACCEPTANCE CRITERIA:\*\*\n([\s\S]*?)(?=\n- \*\*|$)/) || [])[1] || '';
    const acs = acBlock.split('\n').filter((l) => /^\s+- GIVEN/.test(l)).map((l) => l.trim());
    map.set(m[1], { id: m[1], name: m[2].trim(), priority, type, category, acs });
  }
  return map;
}

export function parseMatrix() {
  const t = read('docs/use-cases/GEI_REQ_ACTOR_USE_CASE_MATRIX_V1.md');
  const req2uc = new Map();
  const uc2req = new Map();
  const coverage = new Map();
  const actor = new Map();
  const rows = t.split('\n').filter((l) => /REQ-[A-Z]+-\d+/.test(l) && /\| (F|NF) \|/.test(l));
  for (const r of rows) {
    const req = r.match(/REQ-[A-Z]+-\d+/)[0];
    const cells = r.split('|').map((c) => c.replace(/`/g, '').trim());
    const cov = cells.find((c) => /^(PRIMARY|SUPPORTING|BUSINESS_RULE|SYSTEM_INTERNAL|CROSS_CUTTING|EXTERNAL)$/.test(c));
    coverage.set(req, cov || '');
    const actorCell = cells.find((c) => c.startsWith('`ACT-'));
    actor.set(req, actorCell ? actorCell.replace(/`/g, '') : (cells[5] || ''));
    const pairs = [...r.matchAll(/(UC-[A-Z]+-\d+)`? ?\((P|S)\)/g)];
    for (const p of pairs) {
      (req2uc.get(req) || req2uc.set(req, []).get(req)).push({ uc: p[1], tag: p[2] });
      (uc2req.get(p[1]) || uc2req.set(p[1], []).get(p[1])).push({ req, tag: p[2] });
    }
  }
  // REQ-STR-008: la matriz usa notación de rango «UC-STR-01 … UC-STR-15 (S)»;
  // la ficha del catálogo E3 marca REQ-STR-008 (P) sólo para UC-STR-10.
  if (!req2uc.has('REQ-STR-008')) req2uc.set('REQ-STR-008', []);
  for (let i = 1; i <= 15; i++) {
    const uc = `UC-STR-${String(i).padStart(2, '0')}`;
    req2uc.get('REQ-STR-008').push({ uc, tag: uc === 'UC-STR-10' ? 'P' : 'S' });
    (uc2req.get(uc) || uc2req.set(uc, []).get(uc)).push({ req: 'REQ-STR-008', tag: uc === 'UC-STR-10' ? 'P' : 'S' });
  }
  return { req2uc, uc2req, coverage, actor };
}

export function parseSpecs() {
  const specs = new Map();
  for (const f of SPEC_FILES) {
    const t = fs.readFileSync(path.join(SPECS_DIR, f), 'utf8');
    const re = /## CASO DE USO: (UC-[A-Z]+-\d+) · (.+?)\n\n([\s\S]*?)(?=\n---\n|\n\*\*Fin de|$)/g;
    let m;
    while ((m = re.exec(t))) {
      const id = m[1];
      const body = m[3];
      const spec = {
        id, name: m[2].trim(), file: f, body,
        rawPriority: (body.match(/^Prioridad: (P\d)$/m) || [])[1] || null,
        desc: (body.match(/^Descripción: (.+)$/m) || [])[1] || null,
        hasActors: /^Actores:$/m.test(body),
        hasPrecond: /^Precondiciones:$/m.test(body),
        hasPostcond: /^Postcondiciones:$/m.test(body),
        hasExtension: /^Puntos de Extensión:$/m.test(body),
        hasBasic: /^Camino básico:$/m.test(body),
        hasAlt: /^Camino alternativo:$/m.test(body),
        hasTrace: /TRAZABILIDAD INTERNA GEI/.test(body),
        fechaCreacion: (body.match(/^Fecha de creación: (.+)$/m) || [])[1] || null,
        fechaAct: (body.match(/^Fechas de actualización: (.+)$/m) || [])[1] || null,
        version: (body.match(/^Versión: (.+)$/m) || [])[1] || null,
        autores: (body.match(/^Autores: (.+)$/m) || [])[1] || null,
      };
      // camino básico: pasos numerados hasta el primer heading siguiente
      const basicBlock = (body.split(/^Camino básico:$/m)[1] || '').split(/^Camino alternativo:$/m)[0];
      spec.basicSteps = [...basicBlock.matchAll(/^(\d+)\. /gm)].map((x) => parseInt(x[1], 10));
      const altBlock = (body.split(/^Camino alternativo:$/m)[1] || '').split(/^TRAZABILIDAD/m)[0];
      spec.alternatives = [...altBlock.matchAll(/^(\d+)\.(\d+)(?:\.(\d+))?\. /gm)].map((x) => ({
        x: parseInt(x[1], 10), y: parseInt(x[2], 10), z: x[3] ? parseInt(x[3], 10) : null,
      }));
      spec.stepLines = basicBlock.split('\n').filter((l) => /^\d+\. /.test(l))
        .concat(altBlock.split('\n').filter((l) => /^\d+\.\d+/.test(l)));
      // REQ trace del bloque de trazabilidad
      const reqLine = (body.match(/- Requirements: (.+)$/m) || [])[1] || '';
      spec.reqTrace = [...reqLine.matchAll(/(REQ-[A-Z]+-\d+)/g)].map((x) => x[1]);
      // menciones de relación reales: `UC-XXX` … <<include>>/<<extend>> con el marcador
      // SIN backticks. Las menciones entre backticks («Sin `<<include>>` de autenticación»)
      // son citas de regla, no relaciones.
      spec.includeMentions = [...new Set([...body.matchAll(/`(UC-[A-Z]+-\d+)`[^\n]{0,120}?(?<!`)<<include>>(?!`)/g)].map((x) => x[1]))];
      spec.extendMentions = [...new Set([...body.matchAll(/`(UC-[A-Z]+-\d+)`[^\n]{0,120}?(?<!`)<<extend>>(?!`)/g)].map((x) => x[1]))];
      spec.reauthDerivation = /deriva a `UC-IAM-09`/.test(body);
      spec.actorMentions = [...new Set([...body.matchAll(/ACT-[A-Z]+/g)].map((x) => x[0]))];
      spec.ucMentions = [...new Set([...body.matchAll(/UC-[A-Z]+-\d+/g)].map((x) => x[0]))];
      specs.set(id, spec);
    }
  }
  return specs;
}

const REJECTION_RE = /\b(no crea|no se crea|rechaza|rechazado|rechazada|falla|deniega|denegado|invalidado|no admite|no aparece|no obtiene|no completa|no se ejecuta|sin crear|sin mutar|sin sesión|sin modificar|sin notificación|no notifica|no se notifica|sin duplicar|no revela|no deja|nada cambia|sin reescribir|no está disponible|no se afirma|no se abre|no le aparece)\b/i;

export function representationFor(reqId, cat, tag, acText) {
  const cov = cat;
  if (cov === 'BUSINESS_RULE' || cov === 'SYSTEM_INTERNAL') return 'BUSINESS_RULE';
  if (cov === 'CROSS_CUTTING' || cov === 'EXTERNAL') return 'CROSS_CUTTING';
  // PRIMARY / SUPPORTING con UC concreto
  if (REJECTION_RE.test(acText)) return 'ALTERNATIVE';
  return 'BASIC_STEP';
}
