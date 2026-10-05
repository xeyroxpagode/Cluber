import { L, CHANNEL_X, CHANNEL_Y } from "./uclayout.mjs";

export function rectOf(col, row) {
  return { x: L.gridX[col], y: L.gridY[row], w: L.uc.w, h: L.uc.h };
}
export function ctr(r) {
  return { x: r.x + r.w / 2, y: r.y + r.h / 2 };
}

// gutter centre just left of each grid column
export const COL_GUTTER = [268, 502, 724, 946];
// row gutter centres
export const ROW_GUTTER = [100, 214, 328, 444, 556, 668, 780];
export const ASSOC_STAGGER = [-30, -20, -12, -6, 6, 12, 20, 30];
export const REL_OFFSET = [0, 1, -1, 2, -2];

export function colOf(target) {
  return L.gridX.indexOf(target.x);
}
export function rowOf(target) {
  return L.gridY.findIndex((y) => y === target.y);
}

export function busRoute(lane, from, to, stagger = 0, which = 1) {
  const c = colOf(to);
  const r = rowOf(to);
  const gx = COL_GUTTER[c < 0 ? 0 : c];
  const idx = Math.min(Math.max(r + which, 0), ROW_GUTTER.length - 1);
  const gy = ROW_GUTTER[idx] + stagger;
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

// Relations run on row gutters; for a fan into one target each member gets a distinct gutter.
export function relRoute(from, to, rank = 0, rankCount = 1, offset = 0) {
  const gs = colOf(from), gt = colOf(to);
  const rs = rowOf(from), rt = rowOf(to);
  const gxs = COL_GUTTER[gs < 0 ? 0 : gs];
  const gxt = COL_GUTTER[gt < 0 ? 0 : gt];
  const clamp = (i) => Math.min(Math.max(i, 0), ROW_GUTTER.length - 1);
  if (gs === gt) {
    const out = [];
    for (const adj of [rs < rt ? rs + 1 : rs, rs, rs + 1, rs - 1]) {
      const mid = ROW_GUTTER[clamp(adj + offset)];
      out.push({ mode: "relV", pts: [{ x: gxs, y: from.cy }, { x: gxs, y: mid }, { x: to.x, y: mid }, { x: to.x, y: to.cy }] });
    }
    return out;
  }
  const out = [];
  for (const adj of [rs < rt ? rs + 1 : rs, rs, rs + 1, rs - 1, rt, rt + 1]) {
    const g1 = ROW_GUTTER[clamp(adj + offset)];
    out.push({
      mode: "relH",
      pts: [{ x: gxs, y: from.cy }, { x: gxs, y: g1 }, { x: gxt, y: g1 }, { x: gxt, y: to.cy }, { x: to.x, y: to.cy }],
    });
  }
  return out;
}

export function candidates(edge) {
  const { from, to } = edge;
  const out = [];
  if (edge.relOnly) {
    for (const off of REL_OFFSET) out.push(...relRoute(from, to, 0, 1, off));
    return out;
  }
  if (edge.busOnly) {
    for (const st of ASSOC_STAGGER) out.push({ mode: "bus", pts: busRoute(edge.lanes[0], from, to, st, 1) });
    for (const st of ASSOC_STAGGER) out.push({ mode: "bus0", pts: busRoute(edge.lanes[0], from, to, st, 0) });
    if (edge.allowStraight) out.push({ mode: "straight", pts: [] });
    return out;
  }
  out.push({ mode: "straight", pts: [] });
  for (const lane of edge.lanes || []) {
    for (const st of ASSOC_STAGGER) out.push({ mode: "bus", pts: busRoute(lane, from, to, st, 1) });
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
    for (const c of candidates(e)) {
      const segs = segsOf({ x: e.from.cx, y: e.from.cy }, { x: e.to.cx, y: e.to.cy }, c.pts);
      const pen = penetrations(segs, blockers, skip).n;
      let cross = 0;
      for (const ch of chosen) cross += crossings(segs, ch.segs);
      const score = pen * 100000 + cross * 1000 + plen(segs) / 100;
      if (!best || score < best.score) best = { ...c, segs, score, pen, cross };
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

// Local search: re-pick every edge against all the others, holding the rest fixed.
export function refine(edges, blockers, routed, sweeps = 4) {
  let cur = routed.map((r) => ({ ...r }));
  for (let s = 0; s < sweeps; s++) {
    let changed = false;
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      const skip = new Set([e.fromTag, e.toTag]);
      let best = null;
      for (const c of candidates(e)) {
        const segs = segsOf({ x: e.from.cx, y: e.from.cy }, { x: e.to.cx, y: e.to.cy }, c.pts);
        const pen = penetrations(segs, blockers, skip).n;
        if (pen > 0) continue;
        let cross = 0;
        for (let j = 0; j < cur.length; j++) if (j !== i) cross += crossings(segs, cur[j].segs);
        const score = cross * 1000 + plen(segs) / 100;
        if (!best || score < best.score) best = { ...c, segs, score, pen, cross };
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
