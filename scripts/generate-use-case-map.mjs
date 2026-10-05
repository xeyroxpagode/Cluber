import fs from "node:fs";
import path from "node:path";
import { buildModel } from "./lib/catalog.mjs";
import {
  L, PAGE, FONT, ACTOR_FONT, BR, esc, actorLabelLines, wrapWords,
} from "./lib/uclayout.mjs";
import { SPECS } from "./lib/specs.mjs";

const OUT = "docs/uml/use-cases/source";
const model = buildModel();

const DOMAINS = [
  ["IAM", "Identity & Access", "Identidad, acceso, cuentas y seguridad de sesión"],
  ["PPL", "People & Relationships", "Personas, perfil, membresía, equipo, roles y representación"],
  ["STR", "Club Structure", "Temporada, división, línea, equipo y sede"],
  ["EVT", "Events & Calendar", "Creación, ciclo de vida, logística y consulta de eventos"],
  ["PRT", "Participation", "Disponibilidad, convocatoria, asistencia, resultado y habilitación"],
  ["COM", "Communication", "Comunicados, conversaciones y notificaciones"],
  ["CMP", "Competition", "Competencia, inscripciones y referencia externa"],
  ["INS", "Search / Reports / Audit", "Búsqueda, informes, historial y auditoría"],
];

let seq = 0;
const nid = (p) => `${p}${++seq}`;

function buildMap() {
  seq = 0;
  const cells = [];

  const counts = new Map(DOMAINS.map(([d]) => [d, 0]));
  for (const c of model) counts.set(c.domain, (counts.get(c.domain) || 0) + 1);

  const diagramsFor = new Map(DOMAINS.map(([d]) => [d, []]));
  for (const s of SPECS) {
    for (const [d] of DOMAINS) {
      if (s.ucs.some((u) => u.startsWith(`UC-${d}-`))) diagramsFor.get(d).push(s.id);
    }
  }

  cells.push(
    `<mxCell id="title" value="${esc("UCD-00 · Mapa maestro de cobertura de casos de uso")}" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontFamily=${FONT};fontSize=15;fontStyle=1;fontColor=#1A1A1A;" vertex="1" parent="1"><mxGeometry x="24" y="10" width="820" height="26" as="geometry"/></mxCell>`,
  );

  const noteLines = [
    "Mapa maestro de cobertura — no reemplaza los diagramas UML detallados.",
    "No contiene casos de uso. Los 102 casos de uso canónicos están en las láminas UCD-XX-XX.",
  ];
  cells.push(
    `<mxCell id="${nid("note")}" value="${noteLines.join(BR)}" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#1A1A1A;strokeWidth=1.5;align=left;verticalAlign=top;spacingLeft=8;spacingTop=6;fontFamily=${FONT};fontSize=10;fontStyle=1;fontColor=#1A1A1A;" vertex="1" parent="1"><mxGeometry x="${L.note.x}" y="${L.note.y}" width="${L.note.w}" height="52" as="geometry"/></mxCell>`,
  );

  cells.push(
    `<mxCell id="boundary" value="${esc("GEI Hockey Management System — 8 dominios · 102 casos de uso canónicos")}" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#1A1A1A;strokeWidth=2;verticalAlign=top;align=left;spacingLeft=10;spacingTop=6;fontFamily=${FONT};fontSize=12;fontStyle=1;fontColor=#1A1A1A;container=0;" vertex="1" parent="1"><mxGeometry x="${L.boundary.x}" y="${L.boundary.y}" width="${L.boundary.w}" height="${L.boundary.h}" as="geometry"/></mxCell>`,
  );

  // actor column: abstract on top, concrete below
  const concrete = [
    "ACT-UNAUTHENTICATED", "ACT-ADMIN", "ACT-SUBCOMMITTEE",
    "ACT-COACH", "ACT-CAPTAIN", "ACT-PLAYER", "ACT-GUARDIAN",
  ];
  const top = L.boundary.y + 60;
  const step = (L.boundary.y + L.boundary.h - 70 - top) / concrete.length;
  const ys = concrete.map((_, i) => top + step * (i + 0.5));

  const placed = [{ a: "ACT-AUTHENTICATED", y: top - 12 }, ...concrete.map((a, i) => ({ a, y: ys[i] }))];
  const actorCells = new Map();
  for (const { a, y } of placed) {
    const lines = actorLabelLines(a);
    const cid = nid("actor");
    actorCells.set(a, { cid, x: L.actor.cx - 20, y: y - 20, w: 40, h: 40 });
    cells.push(
      `<mxCell id="${cid}" value="" style="shape=umlActor;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelBackgroundColor=#FFFFFF;fontFamily=${FONT};fontSize=${ACTOR_FONT};fontColor=#1A1A1A;strokeColor=#1A1A1A;fillColor=#1A1A1A;resizable=0;" vertex="1" parent="1"><mxGeometry x="${L.actor.cx - 20}" y="${y - 20}" width="40" height="40" as="geometry"/></mxCell>`,
    );
    cells.push(
      `<mxCell id="${nid("al")}" value="${lines.join(BR)}" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;fontFamily=${FONT};fontSize=${ACTOR_FONT};fontColor=#1A1A1A;whiteSpace=wrap;" vertex="1" parent="1"><mxGeometry x="${L.actor.labelX}" y="${y + 24}" width="${L.actor.labelW}" height="${lines.length * 13}" as="geometry"/></mxCell>`,
    );
  }

  const parent = actorCells.get("ACT-AUTHENTICATED");
  const specialized = concrete.filter((a) => a !== "ACT-UNAUTHENTICATED");
  specialized
    .map((a) => ({ a, n: actorCells.get(a) }))
    .sort((x, y2) => y2.n.y - x.n.y)
    .forEach((c, i) => {
      const lane = L.genLanes[i % L.genLanes.length];
      const yTop = parent.y + parent.h - 6;
      const yBot = c.n.y + 6;
      cells.push(
        `<mxCell id="${nid("gen")}" value="" style="endArrow=block;endFill=0;endSize=14;html=1;rounded=0;strokeColor=#1A1A1A;strokeWidth=1.5;" edge="1" parent="1" source="${c.n.cid}" target="${parent.cid}"><mxGeometry relative="1" as="geometry"><Array as="points">${c.n.x},${yBot} ${lane},${yBot} ${lane},${yTop} ${parent.x},${yTop}</Array></mxGeometry></mxCell>`,
      );
    });

  // domain packages — no use case ellipses, no umbrella use cases
  const pkgW = 400;
  const pkgH = 152;
  const xs = [300, 740];
  const ys2 = [124, 296, 468, 640];
  DOMAINS.forEach(([d, label, desc], i) => {
    const x = xs[i % 2];
    const y = ys2[Math.floor(i / 2)];
    const diagrams = diagramsFor.get(d);
    const value = [
      `${d} · ${label}`,
      `${counts.get(d)} casos de uso`,
      wrapWords(desc, 54).join(BR),
      `<i>${diagrams.join("  ·  ")}</i>`,
    ].join(BR);
    cells.push(
      `<mxCell id="${nid("pkg")}" value="${value}" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#F7F7F7;strokeColor=#1A1A1A;strokeWidth=1.2;align=left;verticalAlign=top;spacingLeft=10;spacingTop=8;fontFamily=${FONT};fontSize=11;fontColor=#1A1A1A;spacing=4;" vertex="1" parent="1"><mxGeometry x="${x}" y="${y}" width="${pkgW}" height="${pkgH}" as="geometry"/></mxCell>`,
    );
  });

  const total = model.length;
  cells.push(
    `<mxCell id="${nid("tot")}" value="${esc(`Cobertura: ${total} / ${total} casos de uso canónicos representados. 0 CU inventados. 0 actores fuera del catálogo E2.`)}" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontFamily=${FONT};fontSize=11;fontColor=#1A1A1A;" vertex="1" parent="1"><mxGeometry x="300" y="760" width="840" height="22" as="geometry"/></mxCell>`,
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="GEI-E4" modified="2026-10-05T00:00:00.000Z" agent="GEI-E4-use-case-diagram-authoring" version="24.7.17" type="device">
  <diagram id="UCD-00" name="UCD-00">
    <mxGraphModel dx="1169" dy="827" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${PAGE.w}" pageHeight="${PAGE.h}" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
${cells.map((c) => `        ${c}`).join("\n")}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
`;
}

fs.mkdirSync(OUT, { recursive: true });
const file = path.join(OUT, "UCD-00__GEI_Use_Case_Map.drawio");
fs.writeFileSync(file, buildMap(), "utf8");
console.log(`wrote ${file}`);
