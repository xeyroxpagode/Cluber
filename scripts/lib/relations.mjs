// E4 use case relation decisions — authoritative data model for diagrams + docs.
// Every edge below is derived from GEI_USE_CASE_RELATION_CANDIDATES_V1.md (8 candidates)
// and decided in docs/uml/use-cases/GEI_USE_CASE_RELATION_DECISIONS_V1.md.
//
// REVISION E4-0.1 (audit-driven). PREVIOUS DECISIONS OF E4 V1 WERE:
//   INC-01  include x39  -> REJECTED. REQ-IAM-009 AC 2 bypasses reauthentication, so it is
//                          not part of every instance of the base. Reclassified to extend and
//                          recorded as a transversal rule; 0 edges drawn.
//   INC-02  include x5   -> SPLIT. 3 include (lifecycle transitions, material by definition)
//                          + 2 extend (conditional per REQ-EVT-011 AC 1).
//   EXT-02  extend x2    -> REJECTED, SIBLING. REQ-PRT-011 AC 1: the base completes, the sheet
//                          is closed, the correction happens afterwards.
//   EXT-03  extend x1    -> REJECTED, SIBLING. REQ-PRT-013 AC 2: result is FINAL and terminal,
//                          the normal path is unavailable and a separate path is offered.
//   EXT-04  extend x2    -> REJECTED, SIBLING. REQ-PRT-006 AC 1: publication prospers; AC 2
//                          offers the review surface on consultation, not inside publication.
//   EXT-01  extend x1    -> KEPT. REQ-EVT-013 AC 1 places the conflict inside the save.

export const REAUTH_CONDITION = "REAUTHENTICATION_REQUIRED";

// INC-01 is a transversal rule, not 39 drawn edges. REQ-IAM-009 does not enumerate which
// operations are sensitive, so no authority supports a 39-edge perimeter in the diagrams.
export const REAUTH_TARGET = "UC-IAM-09";
export const INC01_DRAWN_EDGES = 0;

// INC-02 — REQ-EVT-011 AC 1 conditions materiality on FIELDS, so only the three lifecycle
// transitions that REQ-EVT-011 names as actions are unconditional.
export const INC02_INCLUDE = [
  ["UC-EVT-05", "MATERIAL_CHANGE"],
  ["UC-EVT-07", "MATERIAL_CHANGE"],
  ["UC-EVT-08", "MATERIAL_CHANGE"],
];

export const INC02_EXTEND = [
  ["UC-EVT-11", "UC-EVT-04", "MATERIAL_CHANGE"],
  ["UC-EVT-11", "UC-EVT-16", "MATERIAL_CHANGE"],
];

export const EXT_EDGES = {
  "EXT-01": [["UC-EVT-12", "UC-EVT-04", "STALE_VERSION"]],
  // EXT-02, EXT-03, EXT-04: reclassified to SIBLING, 0 edges. See docs/uml/use-cases/
  // GEI_USE_CASE_RELATION_DECISIONS_V1.md for the per-candidate decision log.
};

// Candidates that produced zero edges, kept so the validator can assert they stay undrawn.
export const REJECTED_TO_SIBLING = [
  ["EXT-02", "UC-PRT-07", "UC-PRT-05", "SHEET_CLOSED", "REQ-PRT-011 AC 1: base cierra y prospera; la corrección es posterior"],
  ["EXT-02", "UC-PRT-07", "UC-PRT-06", "SHEET_CLOSED", "REQ-PRT-011 AC 1 + NOTES: la reapertura no es requisito"],
  ["EXT-03", "UC-PRT-10", "UC-PRT-09", "RESULT_FINAL", "REQ-PRT-013 AC 2: FINAL es terminal; la vía normal no está disponible"],
  ["EXT-04", "UC-PRT-04", "UC-PRT-02", "DERIVED_CONFLICTS", "REQ-PRT-006 AC 2: la revisión se ofrece en la consulta, no dentro de preparar"],
  ["EXT-04", "UC-PRT-04", "UC-PRT-03", "DERIVED_CONFLICTS", "REQ-PRT-006 AC 1: la publicación prospera"],
];

// INC-01 must never be drawn as an edge either.
export const REJECTED_INC01_ANY = ["INC-01", "UC-IAM-09"];

export const REJECTED = [
  ["REJ-01", "autenticar usuario", "los 100 CU autenticados", "include", "REQ-IAM-012: es precondición, no comportamiento embebido"],
  ["REJ-02", "UC-IAM-01", "los 100 CU autenticados", "include", "Ya es un CU hermano con goal y outcome propios"],
  ["REJ-03", "UC-PRT-01", "UC-PRT-05", "include", "REQ-PRT-018: disponibilidad y asistencia no se derivan entre sí"],
  ["REJ-04", "UC-PRT-13", "UC-PRT-03", "include", "REQ-PRT-006: la publicación no se bloquea por el conflicto"],
  ["REJ-05", "reconfirmar disponibilidad", "UC-PRT-01", "extend", "El comando no existe; el estado es derivado (REQ-PRT-003)"],
  ["REJ-06", "UC-STR-05/08/15", "UC-STR-12", "include", "REQ-STR-006 es una valla de integridad, no composición"],
  ["REJ-07", "UC-INS-04", "UC-PRT-07/10, UC-COM-03", "include", "La corrección produce historia; no la necesita (REQ-INS-011)"],
  ["REJ-08", "UC-COM-05", "UC-COM-02", "include", "Actores y objetivos distintos (REQ-COM-001 vs REQ-COM-005)"],
  ["REJ-09", "UC-COM-12", "UC-COM-06/08/09", "include", "Objetivo independiente con resultado propio (REQ-COM-007 AC4)"],
];

// Total drawn relations after the E4-0.1 semantic recheck.
export const DRAWN_TOTAL = INC02_INCLUDE.length + INC02_EXTEND.length + EXT_EDGES["EXT-01"].length;