import { L, CHANNEL_X, CHANNEL_Y, ROW_PITCH } from "./uclayout.mjs";

// E4 D-10: `rowY` is per sheet, because a sheet that draws relations opens its row gap from 16 px to
// 46 px so a relation LABEL can sit between two rows of use cases. Passing it in (rather than
// reading a module constant) keeps one layout function for both cases.
export function rectOf(col, row, rowY = L.gridY) {
  return { x: L.gridX[col], y: rowY[row], w: L.uc.w, h: L.uc.h };
}
export function ctr(r) {
  return { x: r.x + r.w / 2, y: r.y + r.h / 2 };
}

// gutter centre just left of each grid column
export const COL_GUTTER = [268, 502, 724, 946];
// Row gutters sit in the gap BETWEEN use case rows (row pitch 112, ellipse height 96). E4-0.1:
// there are three channels per gap, not one. The previous single gutter plus a +/-30 px stagger
// pushed the horizontal runs INSIDE the ellipse rows, which is what produced the spaghetti seen in
// the first render of UCD-EVT-02a.
// E4 D-10: these are the NARROW channels, 5 px apart, valid when the sheet draws no relations.
// A relation-bearing sheet instead gets REL_CHANNELS: three channels inside the opened 46 px band,
// spaced so at least one of them is centred in the label row.
export const ROW_GUTTER = [
  101, 106, 111,
  209, 214, 219,
  321, 326, 331,
  433, 438, 443,
  545, 550, 555,
  657, 662, 667,
  775,
];
export const ASSOC_STAGGER = [-4, -2, 0, 2, 4];
export const REL_OFFSET = [0, 1, -1, 2, -2];

// E4 D-10: derive the channel table for a sheet whose row gap has been opened. Channels are indexed
// three per row: index 3r+k is the k-th channel in the gap ABOVE grid row r, so `r*3 + rank` keeps
// working unchanged.
export function relChannels(rowY) {
  const out = [];
  for (let r = 0; r < rowY.length; r++) {
    const lo = r === 0 ? rowY[r] - (rowY[1] - rowY[0] - L.uc.h) : rowY[r - 1] + L.uc.h;
    const hi = rowY[r];
    const span = hi - lo - 6;
    out.push(lo + 3 + span * 0.25, lo + 3 + span * 0.5, lo + 3 + span * 0.75);
  }
  out.push(rowY[rowY.length - 1] + L.uc.h + 20);
  return out;
}

export function colOf(target) {
  return L.gridX.indexOf(target.x);
}
export function rowOf(target, rowY = L.gridY) {
  return rowY.findIndex((y) => y === target.y);
}

// E4-0.1: `chIdx` selects an explicit row channel for this edge. Deriving it from the target
// row gave every association into the same row the same channel, so twelve associations into
// two rows collapsed into one dense horizontal band across the sheet.
export function busRoute(lane, from, to, rowY, channels, stagger = 0, which = 1, chIdx = null) {
  const c = colOf(to);
  const r = rowOf(to, rowY);
  const gx = COL_GUTTER[c < 0 ? 0 : c];
  const idx = chIdx == null
    ? Math.min(Math.max(r * 3 + which, 0), channels.length - 1)
    : Math.min(Math.max(chIdx, 0), channels.length - 1);
  const gy = channels[idx] + stagger;
  return [
    { x: lane, y: from.cy },
    { x: lane, y: gy },
    { x: gx, y: gy },
    { x: to.x, y: to.cy },
  ];
}

export function segsOf(from, to, pts) {
  const all = [from, ...pts, to];
  const out = [];
  for (let i = 0; i < all.length - 1; i++) out.push([all[i], all[i + 1]]);
  return out;
}

// E4-0.1: connectors attach to the shape PERIMETER, not the centre. Routing and measuring from
// the centre makes every association of an actor share one phantom stub from (cx,cy) to its
// lane, which the old metric counted as collinear overlap even though draw.io clips it away.
// Each edge therefore carries its own exit/entry point on the boundary.
export function endpointsOf(e) {
  return { from: e.fromP || { x: e.from.cx, y: e.from.cy }, to: e.toP || { x: e.to.cx, y: e.to.cy } };
}

// Where draw.io clips a connector that leaves a shape toward `toward`.
export function boundaryToward(center, rect, toward) {
  const dx = toward.x - center.x, dy = toward.y - center.y;
  let t = Infinity;
  const test = (num, den) => {
    if (Math.abs(den) > 1e-12) {
      const u = num / den;
      if (u > 1e-6 && u < 1) t = Math.min(t, u);
    }
  };
  test(rect.x - center.x, dx);
  test(rect.x + rect.w - center.x, dx);
  test(rect.y - center.y, dy);
  test(rect.y + rect.h - center.y, dy);
  if (!Number.isFinite(t)) return { x: toward.x, y: toward.y };
  return { x: center.x + dx * t, y: center.y + dy * t };
}

function segCross(p1, q1, p2, q2) {
  const d = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const d1 = d(p2, q2, p1), d2 = d(p2, q2, q1), d3 = d(p1, q1, p2), d4 = d(p1, q1, q2);
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
}

export function crossings(a, b) {
  let n = 0;
  for (const [p, q] of a) for (const [r, s] of b) if (segCross(p, q, r, s)) n++;
  return n;
}

// Collinear overlap: two axis-aligned segments that lie on the same line and share extent.
// The proper-crossing test cannot see these (all four cross products are 0), yet visually two
// connectors drawn on top of each other are indistinguishable. E4-0.1 added this term.
export function overlapLen(a, b) {
  const aH = Math.abs(a[0].y - a[1].y) < 1e-9;
  const bH = Math.abs(b[0].y - b[1].y) < 1e-9;
  const aV = Math.abs(a[0].x - a[1].x) < 1e-9;
  const bV = Math.abs(b[0].x - b[1].x) < 1e-9;
  if (aH && bH) {
    if (Math.abs(a[0].y - b[0].y) > 1e-9) return 0;
    const lo = Math.max(Math.min(a[0].x, a[1].x), Math.min(b[0].x, b[1].x));
    const hi = Math.min(Math.max(a[0].x, a[1].x), Math.max(b[0].x, b[1].x));
    return Math.max(0, hi - lo);
  }
  if (aV && bV) {
    if (Math.abs(a[0].x - b[0].x) > 1e-9) return 0;
    const lo = Math.max(Math.min(a[0].y, a[1].y), Math.min(b[0].y, b[1].y));
    const hi = Math.min(Math.max(a[0].y, a[1].y), Math.max(b[0].y, b[1].y));
    return Math.max(0, hi - lo);
  }
  return 0;
}

export function totalOverlap(segsA, segsB) {
  let n = 0;
  for (const a of segsA) for (const b of segsB) n += overlapLen(a, b);
  return n;
}

// A connector that runs exactly along another one, or touches it, is unreadable. This bounds
// the acceptable residual so "0 solapamiento evitable" is a measured property, not a claim.
const OVERLAP_BUDGET = 1;

function segHitsRect(p, q, r) {
  if (Math.abs(p.x - q.x) < 1e-9) {
    const x = p.x;
    if (x <= r.x + 2 || x >= r.x + r.w - 2) return false;
    const lo = Math.min(p.y, q.y), hi = Math.max(p.y, q.y);
    return Math.min(hi, r.y + r.h - 2) - Math.max(lo, r.y + 2) > 1;
  }
  if (Math.abs(p.y - q.y) < 1e-9) {
    const y = p.y;
    if (y <= r.y + 2 || y >= r.y + r.h - 2) return false;
    const lo = Math.min(p.x, q.x), hi = Math.max(p.x, q.x);
    return Math.min(hi, r.x + r.w - 2) - Math.max(lo, r.x + 2) > 1;
  }
  return false;
}

export function penetrations(segs, rects, skip) {
  let n = 0;
  const who = [];
  for (const r of rects) {
    if (skip && skip.has(r.tag)) continue;
    for (const [p, q] of segs) if (segHitsRect(p, q, r)) { n++; who.push(r.tag); break; }
  }
  return { n, who };
}

function plen(segs) {
  let t = 0;
  for (const [p, q] of segs) t += Math.abs(p.x - q.x) + Math.abs(p.y - q.y);
  return t;
}

// Relations run on row gutters. Every member of a fan gets its OWN gutter index so two
// relations into the same target can never default to the same horizontal channel.
export function relRoute(from, to, rowY, channels, rank = 0, rankCount = 1, offset = 0, fy = null, ty = null) {
  const gs = colOf(from), gt = colOf(to);
  const rs = rowOf(from, rowY), rt = rowOf(to, rowY);
  const gxs = COL_GUTTER[gs < 0 ? 0 : gs];
  const gxt = COL_GUTTER[gt < 0 ? 0 : gt];
  const y0 = fy == null ? from.cy : fy;
  const y1 = ty == null ? to.cy : ty;
  const clamp = (i) => Math.min(Math.max(i, 0), channels.length - 1);
  // Each member of a fan owns a distinct primary gutter, and k sweeps alternatives around it so the
  // solver can resolve collisions. (E4-0.1: the previous expression multiplied k by 0, so every
  // alternative collapsed onto the same channel and the fan had no freedom at all.)
  // E4 D-10: the sweep now also steps by whole bands (±3, ±6, ±9), because three channels share one
  // band and two relations in the same band whose runs overlap in x are drawn on top of each other.
  // Stepping a full band is what lets the router separate them — and it is also what gives each
  // relation a band whose label row is free.
  const base = rs * 3 + (rankCount > 1 ? rank - (rankCount - 1) / 2 : 0);
  const OFFSETS = [0, 1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6, 7, -7, 8, -8, 9, -9];
  const out = [];
  if (gs === gt) {
    for (const off of OFFSETS) {
      const mid = channels[clamp(Math.round(base) + off + offset)];
      out.push({ mode: "relV", pts: [{ x: gxs, y: y0 }, { x: gxs, y: mid }, { x: to.x, y: mid }, { x: to.x, y: y1 }] });
    }
    return out;
  }
  for (const off of OFFSETS) {
    const g1 = channels[clamp(Math.round(base) + off + offset)];
    out.push({
      mode: "relH",
      pts: [{ x: gxs, y: y0 }, { x: gxs, y: g1 }, { x: gxt, y: g1 }, { x: gxt, y: y1 }, { x: to.x, y: y1 }],
    });
  }
  return out;
}

export function candidates(edge) {
  const { from, to, rowY, channels } = edge;
  const fy = edge.fromP ? edge.fromP.y : null;
  const ty = edge.toP ? edge.toP.y : null;
  const out = [];
  if (edge.relOnly) {
    for (const off of REL_OFFSET) out.push(...relRoute(from, to, rowY, channels, edge.rank || 0, edge.rankCount || 1, off, fy, ty));
    return out;
  }
  if (edge.busOnly) {
    for (const st of ASSOC_STAGGER) out.push({ mode: "bus", pts: busRoute(edge.lanes[0], from, to, rowY, channels, st, 1, edge.chIdx) });
    for (const st of ASSOC_STAGGER) out.push({ mode: "bus0", pts: busRoute(edge.lanes[0], from, to, rowY, channels, st, 0, edge.chIdx) });
    if (edge.allowStraight) out.push({ mode: "straight", pts: [] });
    return out;
  }
  out.push({ mode: "straight", pts: [] });
  for (const lane of edge.lanes || []) {
    for (const st of ASSOC_STAGGER) out.push({ mode: "bus", pts: busRoute(lane, from, to, rowY, channels, st, 1, edge.chIdx) });
  }
  for (const x of CHANNEL_X) out.push({ mode: "orthX", pts: [{ x, y: from.cy }, { x, y: to.cy }] });
  for (const y of CHANNEL_Y) out.push({ mode: "orthY", pts: [{ x: from.cx, y }, { x: to.cx, y }] });
  for (const x of CHANNEL_X) {
    for (const y of CHANNEL_Y) out.push({ mode: "orthXY", pts: [{ x, y: from.cy }, { x, y }, { x: to.cx, y }] });
  }
  return out;
}

export function solve(edges, blockers) {
  const chosen = [];
  for (const e of edges) {
    const skip = new Set([e.fromTag, e.toTag]);
    let best = null;
    // E4-0.1: a penetrating connector is never acceptable, so pen-free candidates are
    // considered exclusively whenever at least one exists. Previously a lower-scoring
    // penetrating route could survive because overlap/crossing outweighed penetration.
    const all = candidates(e);
    const penFree = all.filter((c) => {
      const ep = endpointsOf(e); const segs = segsOf(ep.from, ep.to, c.pts);
      return penetrations(segs, blockers, skip).n === 0;
    });
    const pool = penFree.length ? penFree : all;
    for (const c of pool) {
      const ep = endpointsOf(e); const segs = segsOf(ep.from, ep.to, c.pts);
      const pen = penetrations(segs, blockers, skip).n;
      let cross = 0, over = 0;
      for (const ch of chosen) { cross += crossings(segs, ch.segs); over += totalOverlap(segs, ch.segs); }
      // Overlap outranks crossings: two connectors on top of each other are less readable
      // than two that cross, because a crossing still shows both endpoints.
      const score = pen * 1000000 + over * 10000 + cross * 1000 + plen(segs) / 100;
      if (!best || score < best.score) best = { ...c, segs, score, pen, cross, over };
    }
    chosen.push(best);
  }
  return chosen;
}

export function totalCrossings(routed) {
  let n = 0;
  for (let i = 0; i < routed.length; i++) {
    for (let j = i + 1; j < routed.length; j++) n += crossings(routed[i].segs, routed[j].segs);
  }
  return n;
}

export function totalOverlapAll(routed) {
  let n = 0;
  for (let i = 0; i < routed.length; i++) {
    for (let j = i + 1; j < routed.length; j++) n += totalOverlap(routed[i].segs, routed[j].segs);
  }
  return n;
}

// Local search: re-pick every edge against all the others, holding the rest fixed.
// `fixedFrom` leaves the first N edges alone. E4 D-10 needs this: relation routes are chosen by the
// label-aware repair pass, and letting refine re-pick them would silently undo that work.
export function refine(edges, blockers, routed, sweeps = 4, fixedFrom = 0) {
  let cur = routed.map((r) => ({ ...r }));
  for (let s = 0; s < sweeps; s++) {
    let changed = false;
    for (let i = 0; i < edges.length; i++) {
      if (i < fixedFrom) continue;
      const e = edges[i];
      const skip = new Set([e.fromTag, e.toTag]);
      let best = null;
      for (const c of candidates(e)) {
        const ep = endpointsOf(e); const segs = segsOf(ep.from, ep.to, c.pts);
        const pen = penetrations(segs, blockers, skip).n;
        if (pen > 0) continue;
        let cross = 0, over = 0;
        for (let j = 0; j < cur.length; j++) {
          if (j === i) continue;
          cross += crossings(segs, cur[j].segs);
          over += totalOverlap(segs, cur[j].segs);
        }
        const score = over * 10000 + cross * 1000 + plen(segs) / 100;
        if (!best || score < best.score) best = { ...c, segs, score, pen, cross, over };
      }
      if (best && best.score + 1e-9 < cur[i].score) {
        cur[i] = best;
        changed = true;
      }
    }
    if (!changed) break;
  }
  return cur;
}
