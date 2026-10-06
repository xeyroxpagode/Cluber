import fs from "node:fs";
import path from "node:path";
import { buildModel } from "./lib/catalog.mjs";
import {
  L, PAGE, FONT, FONT_SIZE, ACTOR_FONT, LABEL_FONT, TITLE_FONT, BOUNDARY_FONT,
  ACTOR_LINE_H, ACTOR_LABEL_OFFSET, pointsArray, esc, rowYs, maxRowOf, maxPitchFor,
  ucLabelLines, actorLabelLines, wrapWords, textFitsEllipse, BR, REL_LABEL_ROW,
} from "./lib/uclayout.mjs";
import {
  rectOf, ctr, solve, candidates, segsOf, penetrations, totalCrossings, totalOverlapAll,
  refine, endpointsOf, relChannels, ROW_GUTTER, totalOverlap,
} from "./lib/router.mjs";
import { placeLabels, labelBox, overlapArea, insideRect } from "./lib/labels.mjs";
import { SPECS } from "./lib/specs.mjs";

const OUT = "docs/uml/use-cases/source";
// E4 D-10: relation label position is no longer a closed-form table. Labels are placed by the
// deterministic, collision-aware solver in scripts/lib/labels.mjs, which searches (position along the
// edge) x (perpendicular slot) against every already-placed label, the use case ellipses, the actor
// figures and their name blocks, the system boundary and the page. The previous LABEL_FRACTIONS /
// LABEL_LIFTS tables only ever lifted a label 14 px across its edge, which cannot fit a 36 px tall
// label inside a 10 px channel band — that was D-10.
const model = buildModel();
const byId = new Map(model.map((c) => [c.id, c]));

// E4 D-10: the narrow 16 px channel table is kept verbatim for relation-free sheets, so opening the
// band on a relation-bearing sheet cannot perturb the other fifteen diagrams.
const relChannelsNarrow = () => ROW_GUTTER;

let seq = 0;
const nid = (p) => `${p}${++seq}`;

function build(spec) {
  seq = 0;
  const cells = [];
  const ucs = new Map();
  const actors = new Map();
  const rep = { id: spec.id, overflow: [], crossings: 0, pen: 0, gen: 0, edges: 0, assoc: 0, rel: 0 };

  const cols = spec.cols;
  const refId = spec.refId || null;
  // E4 D-10: a sheet that draws relations needs a wider row gap, because the gap is where the relation
  // LABEL lives. Fifteen sheets draw no relations and keep the previous pitch untouched. If a column
  // split would need more rows than an opened band fits on the page, the sweep below refuses that
  // split rather than emitting a sheet whose labels cannot be placed anywhere legal.
  const wide = spec.relations.length > 0;
  const rowY = rowYs(wide, maxRowOf(spec, cols));
  const channels = wide ? relChannels(rowY) : relChannelsNarrow();
  rep.wideRowBand = wide;
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
    const r = rectOf(col, row, rowY);
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
    const r = rectOf(spec.refSlot[0], spec.refSlot[1], rowY);
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
  // E4-0.1 M-2/M-4: a fixed 82 px gap was sized for 10 pt labels. At 11 pt a 3-line actor label
  // needs 40 (figure) + 24 (offset) + 3*14 = 106, so the gap must follow the real label height.
  const needOf = (a) => 40 + ACTOR_LABEL_OFFSET + actorLabelLines(a).length * ACTOR_LINE_H;
  let ys = concrete.map(mean);
  for (let i = 1; i < ys.length; i++) {
    const gap = needOf(concrete[i - 1]);
    if (ys[i] - ys[i - 1] < gap) ys[i] = ys[i - 1] + gap;
  }
  const over = ys.length ? ys[ys.length - 1] - (L.boundary.y + L.boundary.h - 50) : 0;
  if (over > 0) ys = ys.map((y) => y - over);
  if (ys.length && ys[0] < L.boundary.y + 50) {
    const sh = L.boundary.y + 50 - ys[0];
    ys = ys.map((y) => y + sh);
  }
  // Every concrete label must fit before the next figure, and the last one inside the page.
  for (let i = 0; i < ys.length; i++) {
    const labelBottom = ys[i] + ACTOR_LABEL_OFFSET + actorLabelLines(concrete[i]).length * ACTOR_LINE_H;
    if (labelBottom > PAGE.h - 6) {
      throw new Error(`${spec.id}: actor label of ${concrete[i]} overflows the page (${Math.round(labelBottom)} > ${PAGE.h - 6})`);
    }
    if (i + 1 < ys.length && ys[i + 1] - 20 <= labelBottom) {
      throw new Error(`${spec.id}: actor label of ${concrete[i]} overlaps ${concrete[i + 1]}`);
    }
  }
  const placed = [];
  if (spec.abstractActor) {
    const y = Math.max(L.boundary.y + 40, (ys[0] ?? L.boundary.y + L.boundary.h / 2) - 96);
    placed.push({ a: spec.abstractActor, y, kind: "abstract" });
  }
  concrete.forEach((a, i) => placed.push({ a, y: ys[i], kind: "concrete" }));

  // E4 D-10: relation labels must also clear the actor NAME blocks, not just the stick figures. The
  // name block spans x 66..236 and the figure only x 90..130, so the figure rect alone would let a
  // label sit straight across "Subcomisión de hockey".
  const actorLabelRects = [];

  placed.forEach(({ a, y }) => {
    const lines = actorLabelLines(a);
    const cid = nid("actor");
    actors.set(a, { cx: L.actor.cx, cy: y, x: L.actor.cx - 20, y: y - 20, w: 40, h: 40, cid });
    actorLabelRects.push({
      x: L.actor.labelX, y: y + ACTOR_LABEL_OFFSET,
      w: L.actor.labelW, h: lines.length * ACTOR_LINE_H, tag: `${cid}-label`,
    });
    cells.push(
      `<mxCell id="${cid}" value="" style="shape=umlActor;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;labelBackgroundColor=#FFFFFF;fontFamily=${FONT};fontSize=${ACTOR_FONT};fontColor=#1A1A1A;strokeColor=#1A1A1A;fillColor=#1A1A1A;resizable=0;" vertex="1" parent="1"><mxGeometry x="${L.actor.cx - 20}" y="${y - 20}" width="40" height="40" as="geometry"/></mxCell>`,
    );
    cells.push(
      `<mxCell id="${nid("al")}" value="${lines.join(BR)}" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=top;fontFamily=${FONT};fontSize=${ACTOR_FONT};fontColor=#1A1A1A;whiteSpace=wrap;" vertex="1" parent="1"><mxGeometry x="${L.actor.labelX}" y="${y + ACTOR_LABEL_OFFSET}" width="${L.actor.labelW}" height="${lines.length * ACTOR_LINE_H}" as="geometry"/></mxCell>`,
    );
  });

  // E4-0.1: fit the system boundary to the content actually placed. A fixed 730 px tall boundary left
  // UCD-EVT-02a (6 use cases in 2 rows) with roughly 60% of the sheet blank, which reads as an
  // unfinished page in print.
  const usedSlots = [...slotOf.values()];
  if (spec.refId) usedSlots.push(spec.refSlot);
  const maxRow = Math.max(...usedSlots.map((s) => s[1]));
  const maxCol = Math.max(...usedSlots.map((s) => s[0]));
  // E4-0.1: the top margin must fit a wrapped boundary label. On a one-column sheet the boundary is
  // narrow, the label wraps to two lines, and the second line landed under the first ellipse
  // ("Creación de eventos y jornadas" was unreadable in UCD-EVT-01).
  const bTop = rowY[0] - 54;
  // E4 D-10: on a sheet that draws relations, the bottom margin is widened by one label row. The
  // relation label bands are the row gaps, the strip above row 0 and the strip below the last row;
  // the title obstacle removes most of the top strip, so the bottom strip has to actually exist or
  // the last relation has nowhere legal to go (its label was the one written across the title).
  const bBottom = Math.min(rowY[maxRow] + L.uc.h + 34 + (wide ? REL_LABEL_ROW : 0), PAGE.h - 16);
  const bLeft = L.gridX[0] - 46;
  const bRight = Math.min(L.gridX[maxCol] + L.uc.w + 46, PAGE.w - 16);
  const boundaryBox = { x: bLeft, y: bTop, w: bRight - bLeft, h: bBottom - bTop };

  // E4 D-10 (hallazgo del QA visual sobre el PNG exportado): el RÓTULO del boundary es texto bold
  // 12 pt en la esquina superior izquierda, DENTRO del rectángulo. No es un nodo, así que nada
  // impedía que una etiqueta de relación de la franja superior se escribiera encima — el render
  // mostró «extend» [STALE_VERSION] cruzando "Management System —". Se modela como obstáculo para
  // que el solver mantenga toda etiqueta fuera de él. Fuente bold ~0.62 em por carácter.
  const bText = `GEI Hockey Management System — ${spec.boundaryLabel}`;
  const bCharW = BOUNDARY_FONT * 0.62;
  const bAvail = boundaryBox.w - 20;
  const bLines = Math.max(1, Math.ceil((bText.length * bCharW) / bAvail));
  const boundaryTitleRect = {
    x: boundaryBox.x + 10, y: boundaryBox.y + 8,
    w: Math.min(Math.ceil(bText.length * bCharW), bAvail),
    h: bLines * 16 + 4, tag: "boundary-label",
  };

  cells.unshift(
    `<mxCell id="title" value="${esc(`${spec.id} · ${spec.title}`)}" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontFamily=${FONT};fontSize=${TITLE_FONT};fontStyle=1;fontColor=#1A1A1A;" vertex="1" parent="1"><mxGeometry x="${L.title.x}" y="${L.title.y}" width="${L.title.w}" height="${L.title.h}" as="geometry"/></mxCell>`,
    `<mxCell id="boundary" value="${esc(`GEI Hockey Management System — ${spec.boundaryLabel}`)}" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#1A1A1A;strokeWidth=2;verticalAlign=top;align=left;spacingLeft=10;spacingTop=8;fontFamily=${FONT};fontSize=${BOUNDARY_FONT};fontStyle=1;fontColor=#1A1A1A;container=0;" vertex="1" parent="1"><mxGeometry x="${boundaryBox.x}" y="${boundaryBox.y}" width="${boundaryBox.w}" height="${boundaryBox.h}" as="geometry"/></mxCell>`,
  );
  if (spec.note) {
    const lines = wrapWords(spec.note, 46);
    const noteH = Math.max(36, lines.length * 14 + 12);
    // E4-0.1: the note lives above the system boundary. If a longer note pushed into the boundary it
    // would overlay the use cases, so this is now a hard failure, not a warning.
    if (L.note.y + noteH > L.boundary.y) {
      throw new Error(`${spec.id}: note overflows into the system boundary (${L.note.y + noteH} > ${L.boundary.y})`);
    }
    cells.push(
      `<mxCell id="${nid("note")}" value="${lines.join(BR)}" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#8C8C8C;strokeWidth=1;align=left;verticalAlign=top;spacingLeft=6;spacingTop=4;fontFamily=${FONT};fontSize=${FONT_SIZE};fontColor=#3A3A3A;" vertex="1" parent="1"><mxGeometry x="${L.note.x}" y="${L.note.y}" width="${L.note.w}" height="${noteH}" as="geometry"/></mxCell>`,
    );
  }

  // ---- generalizations: only the six E2 §11.1 roles specialize ACT-AUTHENTICATED.
  // ACT-UNAUTHENTICATED is never a child (E2 §12.1 rejects every generalization for it).
  const NO_PARENT = new Set(["ACT-UNAUTHENTICATED"]);
  if (spec.abstractActor && spec.actors.length > 1) {
    const parent = actors.get(spec.abstractActor);
    const kids = spec.actors.filter((a) => a !== spec.abstractActor && !NO_PARENT.has(a));
    const byY = [...kids].map((k) => actors.get(k)).sort((a, b) => b.y - a.y);
    // E4-0.1: each generalization enters the abstract actor at its own point on the right edge and
    // runs in its own lane. They used to converge on one fixed y, so all six final legs lay on top of
    // each other.
    byY.forEach((c, i) => {
      const lane = L.genLanes[Math.min(i, L.genLanes.length - 1)];
      const entryFrac = (i + 1) / (byY.length + 1);
      const exitY = c.y + c.h / 2;
      const entryY = parent.y + parent.h * entryFrac;
      cells.push(
        `<mxCell id="${nid("gen")}" value="" style="endArrow=block;endFill=0;endSize=14;html=1;rounded=0;strokeColor=#1A1A1A;strokeWidth=1.5;exitX=0;exitY=0.5;exitDx=0;exitDy=0;entryX=1;entryY=${entryFrac.toFixed(4)};entryDx=0;entryDy=0;" edge="1" parent="1" source="${c.cid}" target="${parent.cid}"><mxGeometry relative="1" as="geometry">${pointsArray([{ x: lane, y: exitY }, { x: lane, y: entryY }])}</mxGeometry></mxCell>`,
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
  const relOutOf = new Map();
  const relInto = new Map();
  for (const r of spec.relations) {
    if (!relOutOf.has(r.from)) relOutOf.set(r.from, []);
    relOutOf.get(r.from).push(r);
    if (!relInto.has(r.to)) relInto.set(r.to, []);
    relInto.get(r.to).push(r);
  }
  const relEdges = spec.relations.map((r, ri) => {
    if (!ucs.has(r.from) || !ucs.has(r.to)) throw new Error(`${spec.id}: missing endpoint ${r.from} -> ${r.to}`);
    const from = ucs.get(r.from), to = ucs.get(r.to);
    // E4-0.1: relations attach at distinct points of each ellipse perimeter, so the members of a fan
    // do not converge on one shared final leg.
    const outs = relOutOf.get(r.from), ins = relInto.get(r.to);
    const exitFrac = (outs.indexOf(r) + 1) / (outs.length + 1);
    const entryFrac = (ins.indexOf(r) + 1) / (ins.length + 1);
    // E4 D-10: relations ALWAYS leave and enter on the LEFT perimeter. relRoute runs them through
    // COL_GUTTER[col] = gridX[col] - 28, the gutter immediately left of their own column, in every one
    // of its branches. The previous `rightward ? 1 : 0` picked the RIGHT perimeter, which is 152..190 px
    // from where draw.io actually attaches an edge carrying no explicit exitX. That silently meant the
    // router scored one polyline while draw.io drew another, and the label was placed on the wrong one.
    return {
      kind: r.kind, meta: { ...r, relIdx: ri }, from, to, rowY, channels,
      fromTag: from.cid, toTag: to.cid, lanes: [], relOnly: true,
      fromP: { x: from.x, y: from.y + from.h * exitFrac },
      toP: { x: to.x, y: to.y + to.h * entryFrac },
      exitX: 0, exitY: exitFrac, entryX: 0, entryY: entryFrac,
      rank: rankOf.get(r) || 0,
      rankCount: fanOf.get(`${r.kind}:${r.to}`).length,
    };
  });
  const relRouted = solve(relEdges, blockers);

  // ---- E4 D-10: relation label slots, resolved BEFORE any cell is emitted and BEFORE the
  // associations are refined, because associations are routed against the relation channels. Each
  // relation is measured on the polyline draw.io will draw (attachment points included), so the anchor
  // the solver picks is the anchor the renderer resolves back from the relative fraction.
  const relLabelLinesOf = (d) => [`«${d.kind}»`, ...(d.meta.condition ? [`[${d.meta.condition}]`] : [])];
  const polyFor = (d, pts) => {
    const ep = endpointsOf(d);
    return [ep.from, ...pts, ep.to];
  };
  const relLabelItems = relEdges.map((d, i) => ({
    id: `rel${i}`, lines: relLabelLinesOf(d), fontSize: LABEL_FONT,
    poly: polyFor(d, relRouted[i].pts), desc: `${d.meta.from}->${d.meta.to} ${d.kind}`,
  }));
  const LABEL_CLEARANCE = 4;
  const labelCtx = {
    page: { x: 0, y: 0, w: PAGE.w, h: PAGE.h },
    boundary: boundaryBox,
    boundaryPad: 2,
    // boundaryTitleRect (calculado arriba): el rótulo del boundary es TEXTO dentro del rect, no un
    // nodo, y sin este obstáculo una etiqueta de la franja superior cae encima de
    // "GEI Hockey Management System — ..." sin que ningún check geométrico lo vea.
    obstacles: [...blockers, ...actorLabelRects, boundaryTitleRect],
    clearance: LABEL_CLEARANCE,
  };
  let labelSlots = placeLabels(relLabelItems, labelCtx);

  // ---- E4 D-10 ROUTE REPAIR. The connector router optimises crossings and collinear overlap and is
  // blind to labels, so it happily routes two relations down the SAME gutter band. Their labels then
  // share one 234 px run, only one of them fits, and the other is pushed up to 142 px from the
  // connector it belongs to — legal, collision-free, and unreadable. Here each relation may re-pick
  // its channel to minimise how far its own label must sit from it, holding the other labels fixed.
  // Bounded rounds, deterministic order, and a move is accepted only when it strictly improves the
  // label distance AND leaves the collinear overlap of the relation connectors unchanged. Without the
  // second condition the repair happily buys a perfect label layout with 795 px of connector lying on
  // top of connector, which is a worse defect than the one it fixed: two relations drawn over each
  // other cannot be told apart at all, whereas a label 70 px above its own run still is traceable.
  const relOverlap = (routes) => {
    let n = 0;
    for (let i = 0; i < routes.length; i++) {
      for (let j = i + 1; j < routes.length; j++) n += totalOverlap(routes[i].segs, routes[j].segs);
    }
    return n;
  };
  const liftOf = () => relEdges.reduce((s, _, k) => s + Math.abs(labelSlots.get(`rel${k}`).d), 0);
  for (let round = 0; round < 3; round++) {
    let improved = false;
    for (let i = 0; i < relEdges.length; i++) {
      const ep = endpointsOf(relEdges[i]);
      const skip = new Set([relEdges[i].fromTag, relEdges[i].toTag]);
      const prior = relEdges
        .map((_, k) => (k === i ? null : labelSlots.get(`rel${k}`)))
        .filter(Boolean).map((s) => s.test);
      const cur = labelSlots.get(`rel${i}`);
      const ovNow = relOverlap(relRouted);
      let bestLocal = null;
      for (const c of candidates(relEdges[i])) {
        const segs = segsOf(ep.from, ep.to, c.pts);
        if (penetrations(segs, blockers, skip).n) continue;
        const trial = relRouted.map((r, k) => (k === i ? { ...c, segs } : r));
        if (relOverlap(trial) > ovNow) continue;
        const one = placeLabels(
          [{ id: "x", lines: relLabelLinesOf(relEdges[i]), fontSize: LABEL_FONT, poly: polyFor(relEdges[i], c.pts) }],
          { ...labelCtx, prior },
          { maxPasses: 1 },
        ).get("x");
        if (!one || one.cost !== 0) continue;
        // |d|, not d: the ladder offers both +k and -k, so a signed comparison would prefer whichever
        // side of the connector happens to be negative. The candidate is stored WITH its segs because
        // everything downstream (refine, the metrics, the emitter) expects the shape solve() returns.
        if (!bestLocal || Math.abs(one.d) < Math.abs(bestLocal.one.d)) bestLocal = { c: { ...c, segs }, one };
      }
      if (bestLocal && Math.abs(bestLocal.one.d) < Math.abs(cur.d)) {
        relRouted[i] = bestLocal.c;
        labelSlots.set(`rel${i}`, bestLocal.one);
        improved = true;
      }
    }
    if (!improved) break;
  }
  rep.labelLiftPre = liftOf();
  // Authoritative placement of the whole set together, now that the routes account for labels.
  labelSlots = placeLabels(
    relLabelItems.map((it, i) => ({ ...it, poly: polyFor(relEdges[i], relRouted[i].pts) })),
    labelCtx,
  );

  // ---- associations
  const assocOf = new Map();
  for (const [a, u] of spec.associations) {
    if (!assocOf.has(a)) assocOf.set(a, []);
    assocOf.get(a).push(u);
  }
  const inOf = new Map();
  for (const [a, u] of spec.associations) {
    if (!inOf.has(u)) inOf.set(u, []);
    inOf.get(u).push(a);
  }
  const nAssoc = spec.associations.length;
  if (nAssoc > L.busLanes.length) {
    throw new Error(`${spec.id}: ${nAssoc} associations exceed the ${L.busLanes.length} available bus lanes`);
  }
  // E4-0.1: distinct attachment points per association, plus one of two lane strategies.
  //   "edge"  — a lane per association: kills collinear overlap, costs extra crossings.
  //   "actor" — a lane per actor: parallel verticals (few crossings) but the legs of two
  //             associations of the same actor can still run on top of each other.
  // Both are generated and the one with the better measured geometry wins, so neither rule is
  // assumed correct in advance.
  const mkAssoc = (strategy) => {
    const out = [];
    // E4-0.1: order associations by target row/column so channel indices rise with the target, and
    // keep each edge's channel inside the band adjacent to its own target row. Spreading channels over
    // the full page height made routes wander below the boundary and come back.
    const orderedAssoc = [...spec.associations].sort((a, b) => {
      const ua = ucs.get(a[1]), ub = ucs.get(b[1]);
      return (ua.y - ub.y) || (ua.x - ub.x) || a[0].localeCompare(b[0]);
    });
    const perRow = new Map();
    orderedAssoc.forEach(([a, u], i) => {
      const uc = ucs.get(u);
      const r = Math.max(0, rowY.indexOf(uc.y));
      const n = perRow.get(r) || 0;
      perRow.set(r, n + 1);
      const act = actors.get(a);
      const outs = assocOf.get(a), ins = inOf.get(u);
      const exitFrac = (outs.indexOf(u) + 1) / (outs.length + 1);
      const entryFrac = (ins.indexOf(a) + 1) / (ins.length + 1);
      // six channels straddling the gap above this row: keeps the run local and distinct
      const band = [r * 3 - 2, r * 3 - 1, r * 3, r * 3 + 1, r * 3 + 2, r * 3 + 3]
        .map((k) => Math.min(Math.max(k, 0), channels.length - 1));
      out.push({
        kind: "assoc", from: act, to: uc, rowY, channels,
        fromTag: act.cid, toTag: uc.cid,
        busOnly: true, lanes: [L.busLanes[i % L.busLanes.length]],
        chIdx: band[n % band.length], allowStraight: strategy === "actor" && nAssoc <= 5,
        fromP: { x: act.x + act.w, y: act.y + act.h * exitFrac },
        toP: { x: uc.x, y: uc.y + uc.h * entryFrac },
        exitX: 1, exitY: exitFrac, entryX: 0, entryY: entryFrac,
      });
    });
    return out;
  };

  let assocEdges = null;
  let routed = null;
  let bestRoute = null;
  for (const strategy of ["edge", "actor"]) {
    const cand = mkAssoc(strategy);
    // fixedFrom keeps the relation routes exactly as the label repair left them: refine optimises
    // crossings and collinear overlap and knows nothing about label placement.
    const r = refine([...relEdges, ...cand], blockers, [...relRouted, ...solve(cand, blockers)], 6, relEdges.length);
    const ov = Math.round(totalOverlapAll(r));
    const cr = totalCrossings(r);
    const pen = r.reduce((s, rt, k) => {
      const e2 = k < relEdges.length ? relEdges[k] : cand[k - relEdges.length];
      return s + penetrations(rt.segs, blockers, new Set([e2.fromTag, e2.toTag])).n;
    }, 0);
    const sc = pen * 1000000 + ov * 1000 + cr;
    if (!bestRoute || sc < bestRoute.sc) bestRoute = { sc, strategy, cand, r, ov, cr };
  }
  assocEdges = bestRoute.cand;
  routed = bestRoute.r;
  rep.laneStrategy = bestRoute.strategy;
  rep.lanes = assocEdges.map((e) => e.lanes[0]).join(" ");

  rep.crossings = totalCrossings(routed);
  rep.overlapPx = Math.round(totalOverlapAll(routed));
  rep.penDetail = [];
  const ordered = [...relEdges, ...assocEdges];
  routed.forEach((rt, i) => {
    const p = penetrations(rt.segs, blockers, new Set([ordered[i].fromTag, ordered[i].toTag]));
    if (p.n) rep.penDetail.push(`${ordered[i].kind} ${ordered[i].meta ? ordered[i].meta.from + "->" + ordered[i].meta.to : ordered[i].from.cid + "->" + ordered[i].to.cid} pen=${p.n} mode=${rt.mode} who=${p.who.join(",")}`);
  });
  rep.pen = rep.penDetail.length;

  // Self-check on the geometry about to be written, so a regression surfaces as a build failure
  // rather than as an unreadable sheet discovered during visual QA.
  rep.labelBoxH = relLabelItems.length
    ? Math.max(...relLabelItems.map((it) => labelBox(it.lines, it.fontSize).h))
    : 0;
  rep.labelClearance = LABEL_CLEARANCE;
  rep.labelPairs = 0;
  rep.labelNodeOverlap = 0;
  rep.labelOutside = 0;
  rep.labelDetail = [];
  rep.labelLift = 0;
  const placedRects = relLabelItems.map((it, i) => ({ it, s: labelSlots.get(it.id) }));
  for (const { s } of placedRects) rep.labelLift += Math.abs(s.d);
  for (let i = 0; i < placedRects.length; i++) {
    for (let j = i + 1; j < placedRects.length; j++) {
      const a = overlapArea(placedRects[i].s.test, placedRects[j].s.test);
      if (a > 0.5) {
        rep.labelPairs += 1;
        rep.labelDetail.push(`LABEL_OVERLAP ${placedRects[i].it.desc} x ${placedRects[j].it.desc} = ${Math.round(a)}px2`);
      }
    }
  }
  for (const { it, s } of placedRects) {
    for (const r of blockers) {
      const a = overlapArea(s.test, r);
      if (a > 0.5) {
        rep.labelNodeOverlap += 1;
        rep.labelDetail.push(`LABEL_NODE ${it.desc} sobre ${r.tag} = ${Math.round(a)}px2`);
      }
    }
    if (!insideRect(s.test, { x: 0, y: 0, w: PAGE.w, h: PAGE.h }, 0.5) || !insideRect(s.test, boundaryBox, 0.5)) {
      rep.labelOutside += 1;
      rep.labelDetail.push(`LABEL_OUTSIDE ${it.desc} ${JSON.stringify(s.test).replace(/"/g, "")}`);
    }
  }

  routed.forEach((rt, i) => {
    const d = ordered[i];
    const arr = pointsArray(rt.pts);
    // draw.io attaches the connector where exit/entry say, so the geometry the router measured is the
    // geometry that gets drawn. E4 D-10 extended this to relations, which previously shipped with no
    // anchor at all and were therefore attached by draw.io rather than by us.
    const anchor = `exitX=${d.exitX};exitY=${d.exitY};exitDx=0;exitDy=0;entryX=${d.entryX};entryY=${d.entryY};entryDx=0;entryDy=0;`;
    const style = d.kind === "assoc"
      ? `endArrow=none;html=1;rounded=0;strokeColor=#1A1A1A;strokeWidth=1.1;${anchor}`
      : `dashed=1;dashPattern=8 5;endArrow=open;endFill=0;endSize=12;html=1;rounded=0;strokeColor=#1A1A1A;strokeWidth=1.2;${anchor}`;
    const eid = nid("e");
    cells.push(`<mxCell id="${eid}" value="" style="${style}" edge="1" parent="1" source="${d.from.cid}" target="${d.to.cid}"><mxGeometry relative="1" as="geometry">${arr}</mxGeometry></mxCell>`);
    rep.edges += 1;
    if (d.kind === "assoc") rep.assoc += 1; else rep.rel += 1;
    if (d.kind !== "assoc") {
      const it = relLabelItems[i];
      const s = labelSlots.get(it.id);
      const txt = it.lines.join(BR);
      // E4 D-10. For an edge-label child with relative="1", diagrams.net reads x/y as a FRACTION of
      // the edge polyline length, never as pixels. y=0 centres the label on the path and the
      // perpendicular nudge travels as <mxPoint as="offset"> in page pixels. Both values come from the
      // collision solver, so five labels sharing one channel band get five independent slots.
      const fx = s.f.toFixed(4);
      const ox = s.offset.x.toFixed(2);
      const oy = s.offset.y.toFixed(2);
      cells.push(
        `<mxCell id="${nid("rl")}" value="${txt}" style="edgeLabel;html=1;align=center;verticalAlign=middle;connectable=0;labelBackgroundColor=#FFFFFF;fontFamily=${FONT};fontSize=${LABEL_FONT};fontColor=#1A1A1A;spacing=0;" vertex="1" connectable="0" parent="${eid}"><mxGeometry x="${fx}" y="0" relative="1" as="geometry"><mxPoint as="offset" x="${ox}" y="${oy}"/></mxGeometry></mxCell>`,
      );
    }
  });
  // A label defect is recorded, not thrown: a column split that cannot host every label simply loses
  // the layout sweep. Only the sheet that actually ships is held to the hard gate below.
  rep.labelFail = (rep.labelPairs || rep.labelNodeOverlap || rep.labelOutside)
    ? `${spec.id}: relation label placement unresolved — ${rep.labelPairs} overlap, ${rep.labelNodeOverlap} on node, ${rep.labelOutside} outside\n    ${placedRects.map(({ it, s }) => `${it.desc} f=${s.f} d=${s.d} test=${JSON.stringify(s.test)}`).join("\n    ")}\n    ${rep.labelDetail.join("\n    ")}`
    : null;
  rep.labelDefects = rep.labelPairs + rep.labelNodeOverlap + rep.labelOutside;

  return { cells, rep, uccount: ucs.size };
}

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync("docs/uml/use-cases/evidence", { recursive: true });

// layout sweep: choose the column count that minimises geometry defects.
// E4-0.1: collinear overlap is weighted far above crossings. Two connectors drawn on top of each other
// are unreadable, while two that cross still show both endpoints. Target is 0 overlap; crossings are
// then minimised within that constraint.
function score(r) {
  // E4 D-10: an unplaceable relation label disqualifies a column split outright. Any split that can
  // host every label cleanly must win over one that cannot, however few crossings it has.
  return r.overflow.length * 10000000 + (r.labelDefects || 0) * 1000000
    + r.pen * 100000 + r.overlapPx * 1000 + r.crossings + r.emptyRows * 40;
}

const reports = [];
for (const base of SPECS) {
  const tries = [];
  const wantsLabelBand = base.relations.length > 0;
  for (const cols of [1, 2, 3, 4]) {
    const spec = { ...base, cols };
    const needed = spec.ucs.length;
    if (cols === 1 && needed > L.gridY.length) continue;
    if (Math.ceil(needed / cols) > L.gridY.length) continue;
    if (spec.refSlot && (spec.refSlot[1] >= L.gridY.length || spec.refSlot[0] >= L.gridX.length)) continue;
    // E4 D-10: this split must still leave a band wide enough to host a relation label, otherwise the
    // sheet would ship with relations whose labels cannot be placed anywhere legal.
    if (wantsLabelBand && maxPitchFor(maxRowOf(spec, cols)) < L.uc.h + REL_LABEL_ROW) continue;
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
    // E4-0.1: an under-filled grid wastes half an A4 sheet. UCD-EVT-02a with 6 use cases chose
    // 3 columns (2 rows) and left four empty rows; the sheet read as mostly blank.
    rep.emptyRows = Math.max(0, L.gridY.length - Math.ceil((spec.ucs.length + (spec.refId ? 1 : 0)) / cols));
    rep.fill = (spec.ucs.length + (spec.refId ? 1 : 0)) / (cols * Math.ceil((spec.ucs.length + (spec.refId ? 1 : 0)) / cols));
    tries.push({ cols, cells, rep, score: score(rep) });
  }
  tries.sort((a, b) => a.score - b.score);
  const win = tries[0];
  if (!win) throw new Error(`no viable layout for ${base.id}`);
  // E4 D-10 hard gate: the sheet that ships must place every relation label legally. The sweep already
  // prefers clean layouts, so reaching this point with a defect means no column split can host the
  // labels and generation must fail loudly rather than emit an unreadable sheet.
  if (win.rep.labelFail) throw new Error(win.rep.labelFail);
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
  const rep = {
    ...win.rep,
    cols: win.cols,
    tried: tries.map((t) => `${t.cols}c:${t.rep.crossings}c/${t.rep.overlapPx}px/${t.rep.pen}p/${t.rep.labelDefects}l`).join(" "),
  };
  reports.push(rep);
}
fs.writeFileSync("docs/uml/use-cases/evidence/_layout-report.json", JSON.stringify(reports, null, 2), "utf8");
for (const r of reports) {
  console.log(`${r.id.padEnd(12)} cols=${r.cols} edges=${String(r.edges).padStart(3)} (a=${String(r.assoc).padStart(2)} rel=${String(r.rel).padStart(2)}) gen=${r.gen} CROSS=${String(r.crossings).padStart(3)} OVERLAP=${String(r.overlapPx).padStart(5)}px PEN=${r.pen} OVF=${r.overflow.length} LBL=${r.labelPairs}/${r.labelNodeOverlap}/${r.labelOutside} LIFT=${r.labelLift || 0}px  [${r.tried}]`);
  for (const t of r.overflow) console.log(`    OVF ${t.id} lines=${t.lines} text=${t.textW} avail=${t.availW}`);
  for (const p of r.penDetail) console.log(`    PEN ${p}`);
  for (const d of r.labelDetail) console.log(`    LBL ${d}`);
}