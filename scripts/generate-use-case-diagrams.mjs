import fs from "node:fs";
import path from "node:path";
import { buildModel } from "./lib/catalog.mjs";
import {
  L, PAGE, FONT, FONT_SIZE, ACTOR_FONT, LABEL_FONT, esc,
  ucLabelLines, actorLabelLines, wrapWords, textFitsEllipse, BR,
} from "./lib/uclayout.mjs";
import { rectOf, ctr, solve, segsOf, crossings, penetrations, totalCrossings, refine } from "./lib/router.mjs";
import { SPECS, orderByActor, actorLaneOrder } from "./lib/specs.mjs";

const OUT = "docs/uml/use-cases/source";
const model = buildModel();
const byId = new Map(model.map((c) => [c.id, c]));

let seq = 0;
const nid = (p) => `${p}${++seq}`;

function permutations(arr) {
  if (arr.length <= 1) return [arr];
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const p of permutations(rest)) out.push([arr[i], ...p]);
  }
  return out;
}

function build(spec) {
  seq = 0;
  const cells = [];
  const ucs = new Map();
  const actors = new Map();
  const rep = { id: spec.id, overflow: [], crossings: 0, pen: 0, gen: 0, edges: 0, assoc: 0, rel: 0 };

  const cols = spec.cols;
  const refId = spec.refId || null;
  const order = spec.ucs.filter((u) => u !== refId);
  const slotOf = new Map();
  order.forEach((id, i) => {
    if (!byId.has(id)) throw new Error(`${spec.id}: unknown UC ${id}`);
    const col = cols === 1 ? 0 : i % cols;
    const row = cols === 1 ? i : Math.floor(i / cols);
    slotOf.set(id, [col, row]);
  });
  if (refId) {
    if (!byId.has(refId)) throw new Error(`${spec.id}: unknown ref UC ${refId}`);
    const key = `${spec.refSlot[0]},${spec.refSlot[1]}`;
    for (const sl of slotOf.values()) if (`${sl[0]},${sl[1]}` === key) throw new Error(`${spec.id}: refSlot collides at ${key}`);
  }
  order.forEach((id, i) => {
    const [col, row] = slotOf.get(id);
    const r = rectOf(col, row);
    const uc = byId.get(id);
    const lines = ucLabelLines(uc);
    const fit = textFitsEllipse(lines, r, FONT_SIZE);
    if (!fit.fits) rep.overflow.push({ id, ...fit, lines });
    const cid = nid("uc");
    const c = ctr(r); ucs.set(id, { cx: c.x, cy: c.y, x: r.x, y: r.y, w: r.w, h: r.h, cid, rect: r });
    cells.push(
      `<mxCell id="${cid}" value="${lines.join(BR)}" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#1A1A1A;strokeWidth=1.5;fontFamily=${FONT};fontSize=${FONT_SIZE};fontColor=#1A1A1A;align=center;verticalAlign=middle;" vertex="1" parent="1"><mxGeometry x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" as="geometry"/></mxCell>`,
    );
  });
  if (refId) {
    const r = rectOf(spec.refSlot[0], spec.refSlot[1]);
    const uc = byId.get(refId);
    const lines = ucLabelLines(uc);
    const fit = textFitsEllipse(lines, r, FONT_SIZE);
    if (!fit.fits) rep.overflow.push({ id: refId, ...fit, lines });
    const cid = nid("ucr");
    const cr = ctr(r); ucs.set(refId, { cx: cr.x, cy: cr.y, x: r.x, y: r.y, w: r.w, h: r.h, cid, rect: r });
    cells.push(
      `<mxCell id="${cid}" value="${lines.join(BR)}" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#1A1A1A;strokeWidth=1.5;dashed=1;fontFamily=${FONT};fontSize=${FONT_SIZE};fontColor=#1A1A1A;align=center;verticalAlign=middle;" vertex="1" parent="1"><mxGeometry x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" as="geometry"/></mxCell>`,
    );
  }

  // ---- actor placement: abstract (if any) first, then concrete by mean target y
  const targets = new Map();
  for (const [a, u] of spec.associations) {
    if (!targets.has(a)) targets.set(a, []);
    targets.get(a).push(u);
  }
  const mean = (a) => targets.get(a).map((u) => ucs.get(u).y + L.uc.h / 2).reduce((x, y) => x + y, 0) / targets.get(a).length;

  const concrete = spec.actors.filter((a) => a !== spec.abstractActor).sort((a, b) => mean(a) - mean(b));
  const gap = 82;
  let ys = concrete.map(mean);
  for (let i = 1; i < ys.length; i++) if (ys[i] - ys[i - 1] < gap) ys[i] = ys[i - 1] + gap;
  const over = ys.length ? ys[ys.length - 1] - (L.boundary.y + L.boundary.h - 50) : 0;
  if (over > 0) ys = ys.map((y) => y - over);
  if (ys.length && ys[0] < L.boundary.y + 50) {
    const sh = L.boundary.y + 50 - ys[0];
    ys = ys.map((y) => y + sh);
  }
  const placed = [];
  if (spec.abstractActor) {
    const y = Math.max(L.boundary.y + 40, (ys[0] ?? L.boundary.y + L.boundary.h / 2) - 96);
    placed.push({ a: spec.abstractActor, y, kind: "abstract" });
  }
  concrete.forEach((a, i) => placed.push({ a, y: ys[i], kind: "concrete" }));

  placed.forEach(({ a, y }) => {
    const lines = actorLabelLines(a);
    const cid = nid("actor");
    actors.set(a, { cx: L.actor.cx, cy: y, x: L.actor.cx - 20, y: y - 20, w: 40, h: 40, cid });
    cells.push(
      `<mxCell id="${cid}" value="" style="shape=umlActor;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelBackgroundColor=#FFFFFF;fontFamily=${FONT};fontSize=${ACTOR_FONT};fontColor=#1A1A1A;strokeColor=#1A1A1A;fillColor=#1A1A1A;resizable=0;" vertex="1" parent="1"><mxGeometry x="${L.actor.cx - 20}" y="${y - 20}" width="40" height="40" as="geometry"/></mxCell>`,
    );
    cells.push(
      `<mxCell id="${nid("al")}" value="${lines.join(BR)}" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;fontFamily=${FONT};fontSize=${ACTOR_FONT};fontColor=#1A1A1A;whiteSpace=wrap;" vertex="1" parent="1"><mxGeometry x="${L.actor.labelX}" y="${y + 24}" width="${L.actor.labelW}" height="${lines.length * 13}" as="geometry"/></mxCell>`,
    );
  });

  cells.unshift(
    `<mxCell id="title" value="${esc(`${spec.id} · ${spec.title}`)}" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontFamily=${FONT};fontSize=15;fontStyle=1;fontColor=#1A1A1A;" vertex="1" parent="1"><mxGeometry x="${L.title.x}" y="${L.title.y}" width="${L.title.w}" height="${L.title.h}" as="geometry"/></mxCell>`,
    `<mxCell id="boundary" value="${esc(`GEI Hockey Management System — ${spec.boundaryLabel}`)}" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#1A1A1A;strokeWidth=2;verticalAlign=top;align=left;spacingLeft=10;spacingTop=6;fontFamily=${FONT};fontSize=12;fontStyle=1;fontColor=#1A1A1A;container=0;" vertex="1" parent="1"><mxGeometry x="${L.boundary.x}" y="${L.boundary.y}" width="${L.boundary.w}" height="${L.boundary.h}" as="geometry"/></mxCell>`,
  );
  if (spec.note) {
    const lines = wrapWords(spec.note, 44);
    cells.push(
      `<mxCell id="${nid("note")}" value="${lines.join(BR)}" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#8C8C8C;strokeWidth=1;align=left;verticalAlign=top;spacingLeft=6;spacingTop=4;fontFamily=${FONT};fontSize=9;fontColor=#3A3A3A;" vertex="1" parent="1"><mxGeometry x="${L.note.x}" y="${L.note.y}" width="${L.note.w}" height="${Math.max(32, lines.length * 12 + 10)}" as="geometry"/></mxCell>`,
    );
  }

  // ---- generalizations: only the six E2 §11.1 roles specialize ACT-AUTHENTICATED.
  // ACT-UNAUTHENTICATED is never a child (E2 §12.1 rejects every generalization for it).
  const NO_PARENT = new Set(["ACT-UNAUTHENTICATED"]);
  if (spec.abstractActor && spec.actors.length > 1) {
    const parent = actors.get(spec.abstractActor);
    const kids = spec.actors.filter((a) => a !== spec.abstractActor && !NO_PARENT.has(a));
    const byY = [...kids].map((k) => actors.get(k)).sort((a, b) => b.y - a.y);
    byY.forEach((c, i) => {
      const lane = L.genLanes[Math.min(i, L.genLanes.length - 1)];
      const yTop = parent.y + parent.h - 4;
      const yBot = c.y - 4;
      cells.push(
        `<mxCell id="${nid("gen")}" value="" style="endArrow=block;endFill=0;endSize=14;html=1;rounded=0;strokeColor=#1A1A1A;strokeWidth=1.5;" edge="1" parent="1" source="${c.cid}" target="${parent.cid}"><mxGeometry relative="1" as="geometry"><Array as="points">${c.x},${yBot} ${lane},${yBot} ${lane},${yTop} ${parent.x},${yTop}</Array></mxGeometry></mxCell>`,
      );
      rep.gen += 1;
    });
  }

const blockers = [
    ...[...ucs.values()].map((n) => ({ ...n.rect, tag: n.cid })),
    ...[...actors.values()].map((n) => ({ x: n.x - 8, y: n.y - 8, w: n.w + 16, h: n.h + 16, tag: n.cid })),
  ];

  const fanOf = new Map();
  for (const r of spec.relations) {
    const k = `${r.kind}:${r.to}`;
    if (!fanOf.has(k)) fanOf.set(k, []);
    fanOf.get(k).push(r);
  }
  const rankOf = new Map();
  for (const [, list] of fanOf) {
    const sorted = [...list].sort((a, b) => ucs.get(a.from).cy - ucs.get(b.from).cy);
    sorted.forEach((r, i) => rankOf.set(r, i));
  }
  const relEdges = spec.relations.map((r) => {
    if (!ucs.has(r.from) || !ucs.has(r.to)) throw new Error(`${spec.id}: missing endpoint ${r.from} -> ${r.to}`);
    return {
      kind: r.kind, meta: r, from: ucs.get(r.from), to: ucs.get(r.to),
      fromTag: ucs.get(r.from).cid, toTag: ucs.get(r.to).cid, lanes: [], relOnly: true,
      rank: 0, rankCount: fanOf.get(`${r.kind}:${r.to}`).length,
    };
  });
  const relRouted = solve(relEdges, blockers);

  const assocOf = new Map();
  for (const [a, u] of spec.associations) {
    if (!assocOf.has(a)) assocOf.set(a, []);
    assocOf.get(a).push(u);
  }
  const actorList = [...assocOf.keys()];
  const mkAssoc = (laneOf) => {
    const out = [];
    for (const [a, u] of [...spec.associations].reverse()) {
      out.push({
        kind: "assoc", from: actors.get(a), to: ucs.get(u),
        fromTag: actors.get(a).cid, toTag: ucs.get(u).cid,
        busOnly: true, lanes: [laneOf.get(a)], allowStraight: assocOf.get(a).length <= 5,
      });
    }
    return out;
  };

const laneRank = actorLaneOrder(spec);
  const actorListSet = new Set(spec.actors);
  const assignList = [...actorListSet].filter((a) => assocOf.has(a));
  const perms = permutations(assignList);
  let bestTotal = Infinity;
  let bestLane = null;
  let bestAssoc = null;
  const lanes = L.busLanes;
  for (const perm of perms) {
    const laneOf = new Map(perm.map((a, i) => [a, lanes[i]]));
    const routed = refine([...relEdges, ...mkAssoc(laneOf)], blockers, [...relRouted, ...solve(mkAssoc(laneOf), blockers)], 4);
    const total = totalCrossings(routed);
    if (total < bestTotal) { bestTotal = total; bestLane = new Map(laneOf); bestAssoc = mkAssoc(laneOf); }
  }
  if (!bestLane) throw new Error(`${spec.id}: no lane assignment`);
  if (new Set(bestLane.values()).size !== bestLane.size) throw new Error(`${spec.id}: bus lanes not distinct`);
  const laneOf = bestLane;
  const assocEdges = mkAssoc(laneOf);
  const ordered = [...relEdges, ...assocEdges];
  const routed = refine(ordered, blockers, [...relRouted, ...solve(assocEdges, blockers)], 6);
  rep.lanes = [...laneOf.entries()].map(([a, l]) => `${a}@${l}`).join(" ");


  let crossPairs = totalCrossings(routed);
  rep.crossings = crossPairs;
  rep.penDetail = [];
  routed.forEach((rt, i) => {
    const p = penetrations(rt.segs, blockers, new Set([ordered[i].fromTag, ordered[i].toTag]));
    if (p.n) rep.penDetail.push(`${ordered[i].kind} ${ordered[i].meta ? ordered[i].meta.from + "->" + ordered[i].meta.to : ordered[i].from.cid + "->" + ordered[i].to.cid} pen=${p.n} mode=${rt.mode} who=${p.who.join(",")}`);
  });
  rep.pen = rep.penDetail.length;
  rep.lanes = [...laneOf.entries()].map(([a, l]) => `${a}@${l}`).join(" ");

  routed.forEach((rt, i) => {
    const d = ordered[i];
    const arr = rt.pts.length ? `<Array as="points">${rt.pts.map((p) => `${p.x},${p.y}`).join(" ")}</Array>` : "";
    const mid = segsOf({ x: d.from.cx, y: d.from.cy }, { x: d.to.cx, y: d.to.cy }, rt.pts)[0]
      ? (() => {
          const s = segsOf({ x: d.from.cx, y: d.from.cy }, { x: d.to.cx, y: d.to.cy }, rt.pts);
          const long = s.reduce((a, b) => {
            const la = Math.abs(a[0].x - a[1].x) + Math.abs(a[0].y - a[1].y);
            const lb = Math.abs(b[0].x - b[1].x) + Math.abs(b[0].y - b[1].y);
            return la >= lb ? a : b;
          });
          return { x: (long[0].x + long[1].x) / 2, y: (long[0].y + long[1].y) / 2 };
        })()
      : { x: (d.from.cx + d.to.cx) / 2, y: (d.from.cy + d.to.cy) / 2 };
    const style = d.kind === "assoc"
      ? "endArrow=none;html=1;rounded=0;strokeColor=#1A1A1A;strokeWidth=1.1;"
      : "dashed=1;dashPattern=8 5;endArrow=open;endFill=0;endSize=12;html=1;rounded=0;strokeColor=#1A1A1A;strokeWidth=1.2;";
    const eid = nid("e");
    cells.push(`<mxCell id="${eid}" value="" style="${style}" edge="1" parent="1" source="${d.from.cid}" target="${d.to.cid}"><mxGeometry relative="1" as="geometry">${arr}</mxGeometry></mxCell>`);
    rep.edges += 1;
    if (d.kind === "assoc") rep.assoc += 1; else rep.rel += 1;
    if (d.kind !== "assoc") {
      const txt = [`«${d.kind}»`, ...(d.meta.condition ? [`[${d.meta.condition}]`] : [])].join(BR);
      cells.push(
        `<mxCell id="${nid("rl")}" value="${txt}" style="edgeLabel;html=1;align=center;verticalAlign=middle;connectable=0;labelBackgroundColor=#FFFFFF;fontFamily=${FONT};fontSize=${LABEL_FONT};fontColor=#1A1A1A;spacing=0;" vertex="1" connectable="0" parent="${eid}"><mxGeometry x="${mid.x - d.from.cx}" y="${mid.y - d.from.cy}" relative="1" as="geometry"><mxPoint as="offset"/></mxGeometry></mxCell>`,
      );
    }
  });

  return { cells, rep, uccount: ucs.size };
}

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync("docs/uml/use-cases/evidence", { recursive: true });

// layout sweep: choose the column count that minimises geometry defects
function score(r) {
  return r.pen * 10000 + r.crossings * 100 + (r.overflow.length * 100000);
}

const reports = [];
for (const base of SPECS) {
  let best = null;
  const tries = [];
  for (const cols of [1, 2, 3, 4]) {
    const spec = { ...base, cols };
    const needed = spec.ucs.length;
    if (cols === 1 && needed > L.gridY.length) continue;
    if (Math.ceil(needed / cols) > L.gridY.length) continue;
    if (spec.refSlot && (spec.refSlot[1] >= L.gridY.length || spec.refSlot[0] >= L.gridX.length)) continue;
    if (spec.refSlot) {
      const taken = new Set(spec.ucs.filter((u) => u !== spec.refId).map((_, i) => {
        const c = cols === 1 ? 0 : i % cols;
        const rr = cols === 1 ? i : Math.floor(i / cols);
        return `${c},${rr}`;
      }));
      if (taken.has(`${spec.refSlot[0]},${spec.refSlot[1]}`)) continue;
    }
    const { cells, rep } = build(spec);
    rep.cols = cols;
    tries.push({ cols, cells, rep, score: score(rep) });
  }
  tries.sort((a, b) => a.score - b.score);
  const win = tries[0];
  if (!win) throw new Error(`no viable layout for ${base.id}`);
  const spec = { ...base, cols: win.cols };
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="GEI-E4" modified="2026-10-05T00:00:00.000Z" agent="GEI-E4-use-case-diagram-authoring" version="24.7.17" type="device">
  <diagram id="${spec.id}" name="${spec.id}">
    <mxGraphModel dx="1169" dy="827" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${PAGE.w}" pageHeight="${PAGE.h}" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
${win.cells.map((c) => `        ${c}`).join("\n")}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
`;
  fs.writeFileSync(path.join(OUT, spec.file), xml, "utf8");
  const rep = { ...win.rep, cols: win.cols, tried: tries.map((t) => `${t.cols}c:${t.rep.crossings}/${t.rep.pen}`).join(" ") };
  reports.push(rep);
}
fs.writeFileSync("docs/uml/use-cases/evidence/_layout-report.json", JSON.stringify(reports, null, 2), "utf8");
for (const r of reports) {
  console.log(`${r.id.padEnd(12)} cols=${r.cols} edges=${String(r.edges).padStart(3)} (a=${String(r.assoc).padStart(2)} rel=${String(r.rel).padStart(2)}) gen=${r.gen} CROSS=${String(r.crossings).padStart(3)} PEN=${r.pen} OVF=${r.overflow.length}  [${r.tried}]`);
  for (const t of r.overflow) console.log(`    OVF ${t.id} lines=${t.lines} text=${t.textW} avail=${t.availW}`);
  for (const p of r.penDetail) console.log(`    PEN ${p}`);

}
