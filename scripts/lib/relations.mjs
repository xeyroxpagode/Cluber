// E4 use case relation decisions — authoritative data model for diagrams + docs.
// Every edge below is derived from GEI_USE_CASE_RELATION_CANDIDATES_V1.md (8 candidates)
// and decided in docs/uml/use-cases/GEI_USE_CASE_RELATION_DECISIONS_V1.md.

export const INC01_SOURCES = {
  IAM: ["UC-IAM-02", "UC-IAM-03", "UC-IAM-05"],
  PPL: [
    "UC-PPL-01", "UC-PPL-02", "UC-PPL-03", "UC-PPL-04", "UC-PPL-05", "UC-PPL-06",
    "UC-PPL-07", "UC-PPL-08", "UC-PPL-09", "UC-PPL-10", "UC-PPL-11", "UC-PPL-12",
  ],
  STR: [
    "UC-STR-01", "UC-STR-02", "UC-STR-03", "UC-STR-04", "UC-STR-05", "UC-STR-06",
    "UC-STR-07", "UC-STR-08", "UC-STR-09", "UC-STR-10", "UC-STR-11", "UC-STR-12",
    "UC-STR-13", "UC-STR-14", "UC-STR-15",
  ],
  CMP: [
    "UC-CMP-01", "UC-CMP-02", "UC-CMP-03", "UC-CMP-04",
    "UC-CMP-05", "UC-CMP-06", "UC-CMP-07", "UC-CMP-08",
  ],
  PRT: ["UC-PRT-12"],
};

export const REAUTH_TARGET = "UC-IAM-09";

export const INC02_EDGES = [
  ["UC-EVT-04", "MATERIAL_CHANGE"],
  ["UC-EVT-05", "MATERIAL_CHANGE"],
  ["UC-EVT-07", "MATERIAL_CHANGE"],
  ["UC-EVT-08", "MATERIAL_CHANGE"],
  ["UC-EVT-16", "MATERIAL_CHANGE"],
];

export const EXT_EDGES = {
  "EXT-01": [["UC-EVT-12", "UC-EVT-04", "STALE_VERSION"]],
  "EXT-02": [
    ["UC-PRT-07", "UC-PRT-05", "SHEET_CLOSED"],
    ["UC-PRT-07", "UC-PRT-06", "SHEET_CLOSED"],
  ],
  "EXT-03": [["UC-PRT-10", "UC-PRT-09", "RESULT_FINAL"]],
  "EXT-04": [
    ["UC-PRT-04", "UC-PRT-02", "DERIVED_CONFLICTS"],
    ["UC-PRT-04", "UC-PRT-03", "DERIVED_CONFLICTS"],
  ],
};

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
