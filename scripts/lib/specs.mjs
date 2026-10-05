// E4 diagram topology. Canonical UC only — no invented CU, no umbrella CU.
import { INC01_SOURCES, REAUTH_TARGET, INC02_EDGES, EXT_EDGES } from "./relations.mjs";

const inc01 = (doms) => {
  const out = [];
  for (const d of doms) for (const src of INC01_SOURCES[d]) out.push({ from: src, to: REAUTH_TARGET, kind: "include", id: "INC-01" });
  return out;
};
const inc02 = (ids) =>
  INC02_EDGES.filter(([s]) => ids.includes(s)).map(([s, c]) => ({ from: s, to: "UC-EVT-11", kind: "include", id: "INC-02", condition: c }));
const exts = (ids) => {
  const out = [];
  for (const k of ["EXT-01", "EXT-02", "EXT-03", "EXT-04"]) {
    for (const [from, to, cond] of EXT_EDGES[k]) if (ids.includes(from) && ids.includes(to)) out.push({ from, to, kind: "extend", id: k, condition: cond });
  }
  return out;
};

const A = {
  UNAUTH: "ACT-UNAUTHENTICATED", AUTH: "ACT-AUTHENTICATED", PLAYER: "ACT-PLAYER",
  CAPTAIN: "ACT-CAPTAIN", COACH: "ACT-COACH", SUB: "ACT-SUBCOMMITTEE",
  ADMIN: "ACT-ADMIN", GUARD: "ACT-GUARDIAN",
};

export const REAUTH_TARGET_ID = REAUTH_TARGET;

const pair = (actor, ids) => ids.map((u) => [actor, u]);
const flat = (...arrs) => arrs.flat();

// Cluster each actor's use cases contiguously in the grid, outermost (smallest fan) first,
// so association bundles stay parallel instead of interleaving.
export function orderByActor(spec) {
  const count = new Map();
  for (const [a] of spec.associations) count.set(a, (count.get(a) || 0) + 1);
  const rank = [...count.entries()].sort((x, y) => x[1] - y[1]).map(([a]) => a);
  const rankOf = new Map(rank.map((a, i) => [a, i]));
  const firstActor = new Map();
  spec.associations.forEach(([a, u], i) => {
    if (!firstActor.has(u)) firstActor.set(u, { r: rankOf.get(a), i });
  });
  const list = spec.ucs.filter((u) => u !== spec.refId);
  return list
    .map((u, i) => ({ u, r: firstActor.has(u) ? firstActor.get(u).r : 99, i }))
    .sort((x, y) => (x.r - y.r) || (x.i - y.i))
    .map((x) => x.u);
}

export function actorLaneOrder(spec) {
  const count = new Map();
  for (const [a] of spec.associations) count.set(a, (count.get(a) || 0) + 1);
  return [...count.entries()].sort((x, y) => x[1] - y[1]).map(([a]) => a);
}

export const SPECS = [
  {
    id: "UCD-IAM-01", file: "UCD-IAM-01__GEI_Identity_Access.drawio",
    title: "Identidad y acceso", cols: 2,
    boundaryLabel: "GEI · IAM — Identity & Access",
    purpose: "Inicio y activación de sesión, gestión administrativa de cuentas y seguridad de sesión propia.",
    ucs: ["UC-IAM-02", "UC-IAM-03", "UC-IAM-05", "UC-IAM-07", "UC-IAM-10", "UC-IAM-01", "UC-IAM-04", "UC-IAM-06", "UC-IAM-08", "UC-IAM-09"],
    abstractActor: A.AUTH,
    actors: [A.ADMIN, A.SUB, A.AUTH, A.UNAUTH],
    associations: flat(
      pair(A.ADMIN, ["UC-IAM-02", "UC-IAM-03", "UC-IAM-05"]),
      pair(A.AUTH, ["UC-IAM-06", "UC-IAM-07", "UC-IAM-08", "UC-IAM-10"]),
      pair(A.SUB, ["UC-IAM-09"]),
      pair(A.UNAUTH, ["UC-IAM-01", "UC-IAM-04"]),
    ),
    relations: inc01(["IAM"]),
    note: "UC-IAM-09 se dibuja también en UCD-PPL, UCD-STR, UCD-CMP y UCD-PRT: mismo elemento del modelo.",
  },
  {
    id: "UCD-PPL-01", file: "UCD-PPL-01__GEI_Person_Profile_Membership.drawio",
    title: "Persona, perfil y membresía", cols: 3,
    boundaryLabel: "GEI · PPL — Persona, perfil y membresía",
    purpose: "Alta de personas, completitud del perfil de jugadora, vinculación cuenta–persona y membresía al club.",
    ucs: ["UC-PPL-01", "UC-PPL-02", "UC-PPL-03", "UC-PPL-04", "UC-PPL-05", "UC-PPL-15", "UC-PPL-16", "UC-PPL-17"],
    refId: "UC-IAM-09", refSlot: [2, 2],
    abstractActor: A.AUTH,
    actors: [A.ADMIN, A.PLAYER, A.AUTH],
    associations: flat(
      pair(A.ADMIN, ["UC-PPL-01", "UC-PPL-02", "UC-PPL-03", "UC-PPL-04", "UC-PPL-05"]),
      pair(A.PLAYER, ["UC-PPL-15"]),
      pair(A.AUTH, ["UC-PPL-16", "UC-PPL-17"]),
    ),
    relations: inc01(["PPL"]).slice(0, 5),
    note: "UC-IAM-09 se dibuja también en UCD-IAM-01: mismo elemento del modelo.",
  },
  {
    id: "UCD-PPL-02", file: "UCD-PPL-02__GEI_Team_Roles_Representation.drawio",
    title: "Equipo, roles y representación", cols: 3,
    boundaryLabel: "GEI · PPL — Equipo, roles y representación",
    purpose: "Incorporación, cambio y retiro de equipo; roles con alcance; representación; menor delegado.",
    ucs: ["UC-PPL-06", "UC-PPL-07", "UC-PPL-08", "UC-PPL-09", "UC-PPL-10", "UC-PPL-11", "UC-PPL-12", "UC-PPL-13", "UC-PPL-14"],
    refId: "UC-IAM-09", refSlot: [3, 2],
    abstractActor: null,
    actors: [A.ADMIN, A.GUARD, A.PLAYER],
    associations: flat(
      pair(A.ADMIN, ["UC-PPL-06", "UC-PPL-07", "UC-PPL-08", "UC-PPL-09", "UC-PPL-10", "UC-PPL-11", "UC-PPL-12"]),
      pair(A.GUARD, ["UC-PPL-13", "UC-PPL-14"]),
      pair(A.PLAYER, ["UC-PPL-14"]),
    ),
    relations: inc01(["PPL"]).slice(5),
    note: "UC-IAM-09 se dibuja también en UCD-IAM-01: mismo elemento del modelo.",
  },
  {
    id: "UCD-STR-01", file: "UCD-STR-01__GEI_Season_Division_Line.drawio",
    title: "Temporada, división y línea", cols: 2,
    boundaryLabel: "GEI · STR — Temporada, división y línea",
    purpose: "Registro, actualización y archivo de temporada, división y línea.",
    ucs: ["UC-STR-01", "UC-STR-02", "UC-STR-03", "UC-STR-04", "UC-STR-05", "UC-STR-06", "UC-STR-07", "UC-STR-08"],
    refId: "UC-IAM-09", refSlot: [2, 1],
    abstractActor: null,
    actors: [A.ADMIN],
    associations: pair(A.ADMIN, ["UC-STR-01", "UC-STR-02", "UC-STR-03", "UC-STR-04", "UC-STR-05", "UC-STR-06", "UC-STR-07", "UC-STR-08"]),
    relations: inc01(["STR"]).slice(0, 8),
    note: "UC-IAM-09 se dibuja también en UCD-IAM-01: mismo elemento del modelo.",
  },
  {
    id: "UCD-STR-02", file: "UCD-STR-02__GEI_Team_Venue.drawio",
    title: "Equipo y sede", cols: 2,
    boundaryLabel: "GEI · STR — Equipo y sede",
    purpose: "Identidad estable del equipo; registro, corrección y archivo de sedes.",
    ucs: ["UC-STR-09", "UC-STR-10", "UC-STR-11", "UC-STR-12", "UC-STR-13", "UC-STR-14", "UC-STR-15"],
    refId: "UC-IAM-09", refSlot: [2, 1],
    abstractActor: null,
    actors: [A.ADMIN],
    associations: pair(A.ADMIN, ["UC-STR-09", "UC-STR-10", "UC-STR-11", "UC-STR-12", "UC-STR-13", "UC-STR-14", "UC-STR-15"]),
    relations: inc01(["STR"]).slice(8),
    note: "UC-IAM-09 se dibuja también en UCD-IAM-01: mismo elemento del modelo.",
  },
  {
    id: "UCD-EVT-01", file: "UCD-EVT-01__GEI_Event_Creation.drawio",
    title: "Crear eventos y jornadas", cols: 3,
    boundaryLabel: "GEI · EVT — Creación de eventos y jornadas",
    purpose: "Cuatro objetivos de creación independientes: entrenamiento, partido, evento del club y jornada; más serie de eventos.",
    ucs: ["UC-EVT-01", "UC-EVT-02", "UC-EVT-03", "UC-EVT-13", "UC-EVT-14", "UC-EVT-15"],
    abstractActor: null,
    actors: [A.COACH, A.SUB],
    associations: flat(
      pair(A.COACH, ["UC-EVT-01", "UC-EVT-02", "UC-EVT-03", "UC-EVT-13", "UC-EVT-14", "UC-EVT-15"]),
      pair(A.SUB, ["UC-EVT-01", "UC-EVT-02", "UC-EVT-03", "UC-EVT-13", "UC-EVT-14", "UC-EVT-15"]),
    ),
    relations: [],
  },
  {
    id: "UCD-EVT-02a", file: "UCD-EVT-02a__GEI_Event_Material_Change.drawio",
    title: "Editar el evento y revisar el impacto del cambio material", cols: 2,
    boundaryLabel: "GEI · EVT — Edición e impacto del cambio material",
    purpose: "Editar, posponer, cancelar y restaurar; revisar el impacto del cambio material; resolver el conflicto de edición concurrente.",
    ucs: ["UC-EVT-04", "UC-EVT-05", "UC-EVT-07", "UC-EVT-08", "UC-EVT-11", "UC-EVT-12"],
    abstractActor: null,
    actors: [A.COACH, A.SUB],
    associations: flat(
      pair(A.COACH, ["UC-EVT-04", "UC-EVT-05", "UC-EVT-07", "UC-EVT-08", "UC-EVT-11", "UC-EVT-12"]),
      pair(A.SUB, ["UC-EVT-04", "UC-EVT-05", "UC-EVT-07", "UC-EVT-08", "UC-EVT-11", "UC-EVT-12"]),
    ),
    relations: [...inc02(["UC-EVT-04", "UC-EVT-05", "UC-EVT-07", "UC-EVT-08"]), ...exts(["UC-EVT-04", "UC-EVT-12"])],
  },
  {
    id: "UCD-EVT-02b", file: "UCD-EVT-02b__GEI_Event_State_Transitions.drawio",
    title: "Reanudar, completar y abandonar el evento", cols: 2,
    boundaryLabel: "GEI · EVT — Reanudar, completar y abandonar",
    purpose: "Las tres transiciones restantes del ciclo de vida del evento, que no son cambios materiales.",
    ucs: ["UC-EVT-06", "UC-EVT-09", "UC-EVT-10"],
    abstractActor: null,
    actors: [A.COACH, A.SUB],
    associations: flat(
      pair(A.COACH, ["UC-EVT-06", "UC-EVT-09", "UC-EVT-10"]),
      pair(A.SUB, ["UC-EVT-06", "UC-EVT-09", "UC-EVT-10"]),
    ),
    relations: [],
  },
  {
    id: "UCD-EVT-03", file: "UCD-EVT-03__GEI_Event_Logistics_Queries.drawio",
    title: "Logística y consulta de eventos", cols: 2,
    boundaryLabel: "GEI · EVT — Logística y consulta de eventos",
    purpose: "Logística del evento y las tres proyecciones de consulta.",
    ucs: ["UC-EVT-16", "UC-EVT-17", "UC-EVT-18", "UC-EVT-19"],
    refId: "UC-EVT-11", refSlot: [1, 2],
    abstractActor: A.AUTH,
    actors: [A.COACH, A.SUB, A.CAPTAIN, A.AUTH],
    associations: flat(
      pair(A.COACH, ["UC-EVT-16"]),
      pair(A.SUB, ["UC-EVT-16"]),
      pair(A.CAPTAIN, ["UC-EVT-16"]),
      pair(A.AUTH, ["UC-EVT-17", "UC-EVT-18", "UC-EVT-19"]),
    ),
    relations: inc02(["UC-EVT-16"]),
    note: "UC-EVT-11 se dibuja también en UCD-EVT-02a: mismo elemento del modelo.",
  },
  {
    id: "UCD-PRT-01", file: "UCD-PRT-01__GEI_Availability_Selection_Attendance.drawio",
    title: "Disponibilidad, convocatoria y asistencia", cols: 3,
    boundaryLabel: "GEI · PRT — Disponibilidad, convocatoria y asistencia",
    purpose: "Respuesta de disponibilidad; preparación y publicación de convocatoria con revisión de conflictos; asistencia y su corrección.",
    ucs: ["UC-PRT-01", "UC-PRT-02", "UC-PRT-03", "UC-PRT-04", "UC-PRT-05", "UC-PRT-06", "UC-PRT-07"],
    abstractActor: null,
    actors: [A.PLAYER, A.GUARD, A.COACH],
    associations: flat(
      pair(A.PLAYER, ["UC-PRT-01"]),
      pair(A.GUARD, ["UC-PRT-01"]),
      pair(A.COACH, ["UC-PRT-02", "UC-PRT-03", "UC-PRT-04", "UC-PRT-05", "UC-PRT-06", "UC-PRT-07"]),
    ),
    relations: exts(["UC-PRT-02", "UC-PRT-03", "UC-PRT-04", "UC-PRT-05", "UC-PRT-06", "UC-PRT-07"]),
  },
  {
    id: "UCD-PRT-02", file: "UCD-PRT-02__GEI_Match_Result_Eligibility.drawio",
    title: "Resultado de partido y habilitación", cols: 3,
    boundaryLabel: "GEI · PRT — Resultado de partido y habilitación",
    purpose: "Registro, finalización y corrección del resultado; estadísticas del partido; restricción y consulta de habilitación.",
    ucs: ["UC-PRT-08", "UC-PRT-09", "UC-PRT-10", "UC-PRT-11", "UC-PRT-12", "UC-PRT-13"],
    refId: "UC-IAM-09", refSlot: [3, 1],
    abstractActor: null,
    actors: [A.COACH, A.CAPTAIN, A.SUB, A.ADMIN],
    associations: flat(
      pair(A.COACH, ["UC-PRT-08", "UC-PRT-09", "UC-PRT-10", "UC-PRT-11", "UC-PRT-13"]),
      pair(A.CAPTAIN, ["UC-PRT-11"]),
      pair(A.SUB, ["UC-PRT-12", "UC-PRT-13"]),
      pair(A.ADMIN, ["UC-PRT-12", "UC-PRT-13"]),
    ),
    relations: [...exts(["UC-PRT-08", "UC-PRT-09", "UC-PRT-10"]), ...inc01(["PRT"])],
    note: "UC-IAM-09 se dibuja también en UCD-IAM-01: mismo elemento del modelo.",
  },
  {
    id: "UCD-COM-01", file: "UCD-COM-01__GEI_Announcements.drawio",
    title: "Comunicados del club", cols: 3,
    boundaryLabel: "GEI · COM — Comunicados del club",
    purpose: "Redacción, publicación, corrección y archivo de comunicados, y su consulta por la audiencia alcanzada.",
    ucs: ["UC-COM-01", "UC-COM-02", "UC-COM-03", "UC-COM-04", "UC-COM-05"],
    abstractActor: A.AUTH,
    actors: [A.SUB, A.AUTH],
    associations: flat(
      pair(A.SUB, ["UC-COM-01", "UC-COM-02", "UC-COM-03", "UC-COM-04"]),
      pair(A.AUTH, ["UC-COM-05"]),
    ),
    relations: [],
  },
  {
    id: "UCD-COM-02", file: "UCD-COM-02__GEI_Conversations_Notifications.drawio",
    title: "Conversaciones y notificaciones", cols: 3,
    boundaryLabel: "GEI · COM — Conversaciones y notificaciones",
    purpose: "Conversaciones directa, de grupo y canónica con sus mensajes; notificaciones como objetivos independientes.",
    ucs: ["UC-COM-06", "UC-COM-07", "UC-COM-08", "UC-COM-09", "UC-COM-10", "UC-COM-11", "UC-COM-12", "UC-COM-13", "UC-COM-14"],
    abstractActor: A.AUTH,
    actors: [A.AUTH],
    associations: pair(A.AUTH, ["UC-COM-06", "UC-COM-07", "UC-COM-08", "UC-COM-09", "UC-COM-10", "UC-COM-11", "UC-COM-12", "UC-COM-13", "UC-COM-14"]),
    relations: [],
    note: "UC-COM-13 y UC-COM-14 son CU hermanos: no media relación include ni extend entre ellos.",
  },
  {
    id: "UCD-CMP-01", file: "UCD-CMP-01__GEI_Competition_Lifecycle.drawio",
    title: "Ciclo de vida de la competencia y referencia externa", cols: 2,
    boundaryLabel: "GEI · CMP — Competencia y referencia externa",
    purpose: "Registrar, activar y cerrar la competencia; registrar y consultar la referencia externa.",
    ucs: ["UC-CMP-01", "UC-CMP-02", "UC-CMP-03", "UC-CMP-08", "UC-CMP-09"],
    refId: "UC-IAM-09", refSlot: [3, 1],
    abstractActor: null,
    actors: [A.SUB, A.ADMIN, A.COACH],
    associations: flat(
      pair(A.SUB, ["UC-CMP-01", "UC-CMP-02", "UC-CMP-03", "UC-CMP-08", "UC-CMP-09"]),
      pair(A.ADMIN, ["UC-CMP-01", "UC-CMP-02", "UC-CMP-03", "UC-CMP-08", "UC-CMP-09"]),
      pair(A.COACH, ["UC-CMP-09"]),
    ),
    relations: inc01(["CMP"]).slice(0, 3).concat(inc01(["CMP"]).slice(7)),
    note: "UC-IAM-09 se dibuja también en UCD-IAM-01: mismo elemento del modelo.",
  },
  {
    id: "UCD-CMP-02", file: "UCD-CMP-02__GEI_Competition_Entries.drawio",
    title: "Inscripciones en la competencia", cols: 2,
    boundaryLabel: "GEI · CMP — Inscripciones de equipo y línea",
    purpose: "Inscribir un equipo o una línea en la competencia, activar la inscripción y finalizarla.",
    ucs: ["UC-CMP-04", "UC-CMP-05", "UC-CMP-06", "UC-CMP-07"],
    refId: "UC-IAM-09", refSlot: [3, 1],
    abstractActor: null,
    actors: [A.SUB, A.ADMIN],
    associations: flat(
      pair(A.SUB, ["UC-CMP-04", "UC-CMP-05", "UC-CMP-06", "UC-CMP-07"]),
      pair(A.ADMIN, ["UC-CMP-04", "UC-CMP-05", "UC-CMP-06", "UC-CMP-07"]),
    ),
    relations: inc01(["CMP"]).slice(3, 7),
    note: "UC-IAM-09 se dibuja también en UCD-IAM-01: mismo elemento del modelo.",
  },
  {
    id: "UCD-INS-01", file: "UCD-INS-01__GEI_Search_Reports_Audit.drawio",
    title: "Búsqueda, informes y auditoría", cols: 3,
    boundaryLabel: "GEI · INS — Búsqueda, informes y auditoría",
    purpose: "Búsqueda en el club, informes de asistencia y rendimiento, historial de un objeto y auditoría administrativa.",
    ucs: ["UC-INS-01", "UC-INS-02", "UC-INS-03", "UC-INS-04", "UC-INS-05"],
    abstractActor: A.AUTH,
    actors: [A.AUTH, A.COACH, A.SUB, A.PLAYER, A.CAPTAIN, A.ADMIN],
    associations: flat(
      pair(A.AUTH, ["UC-INS-01", "UC-INS-04"]),
      pair(A.COACH, ["UC-INS-02", "UC-INS-03"]),
      pair(A.SUB, ["UC-INS-02", "UC-INS-03"]),
      pair(A.PLAYER, ["UC-INS-02", "UC-INS-03"]),
      pair(A.CAPTAIN, ["UC-INS-02", "UC-INS-03"]),
      pair(A.ADMIN, ["UC-INS-05"]),
    ),
    relations: [],
  },
];
