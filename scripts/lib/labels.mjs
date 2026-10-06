// E4 D-10 — deterministic, collision-aware placement for UML relation labels.
//
// ROOT CAUSE (UCD-EVT-02a). The router reserved channels for the CONNECTORS but nothing
// reserved space for their LABELS. Label position was a fixed closed-form formula:
//
//     fx = LABEL_FRACTIONS[relIdx % 5]      // 0, .22, -.22, .42, -.42 along the edge
//     oy = -14                             // constant perpendicular lift, LABEL_LIFTS all zero
//
// That shifts the anchor ALONG the edge but only ever lifts the label 14 px ACROSS it. The five
// relations of UCD-EVT-02a are routed onto row gutters 101/106/111 and 214/219 — a channel band
// 10 px tall — while a two-line «include»/«extend» label measures ~115 x 36 px and needs ~50 px
// of perpendicular room. Two labels whose fractions differed by 0.22 of the edge still landed on
// top of each other whenever that arc length was smaller than the label width. No collision test
// existed anywhere, so the generator could not have known.
//
// SECOND, COMPOUNDING DEFECT. Relation edges emitted NO exitX/exitY/entryX/entryY, so diagrams.net
// attached them with boundaryToward(first waypoint). Relations always route through the gutter
// LEFT of their grid column, so draw.io attaches on the left perimeter — while the generator
// measured from `exitX = rightward ? 1 : 0`, i.e. the RIGHT perimeter. The polyline the router
// optimised, and the polyline the label was placed on, were not the polyline draw.io draws (the
// discrepancy reached 190 px). Label placement cannot be truthful until both agree.
//
// mxGraph semantics used here, matching what draw.io itself writes:
//   <mxGeometry x="FRACTION" y="0" relative="1"> + <mxPoint as="offset" dx dy/>
// x/y are FRACTIONS of the edge polyline arc length (y=0 centres on the path); dx/dy are PIXELS in
// page coordinates. Writing pixels into x/y is the earlier bug that blew the export box to ~232,000 px.

import { LINE_H } from "./uclayout.mjs";

// Average Helvetica advance as a fraction of the point size. Calibrated against the actual draw.io
// 31.7 render: 0.55 em underestimates the real text width by ~10%, which let a label sit 2.5 px
// clear of an ellipse on paper and overlap its text in the PNG. 0.62 em is conservative.
export const CHAR_W = 0.62;
// draw.io draws an edge label with a little slack around the glyphs.
export const PAD_X = 6;
export const PAD_Y = 2;

// Perpendicular slot ladder, ordered by increasing distance from the connector so an unobstructed
// label stays on its own line and a crowded one backs off by the least amount that clears.
//
// The brief's ladder is slot 0, +1, -1, +2, -2 with "separación suficiente para fontSize 11". With a
// single fixed step that is impossible to honour literally: a widened row band is 46 px and a label
// is 36 px, so the only legal centre in it is a ~10 px window, and a fixed 42 px step jumps clean
// over it. Separation is therefore enforced by MEASUREMENT — every candidate is tested against the
// already-placed label boxes — and the scan granularity below only decides which of the legal slots
// is preferred. The first accepted candidate is by construction at least `clearance` px away from
// every other label, so the resulting separation is provably sufficient for 11 pt.
export const SLOT_SCAN_PX = 2;
export const SLOT_SCAN_MAX = 200;

export function slotLadder(maxPx = SLOT_SCAN_MAX, scan = SLOT_SCAN_PX) {
  const out = [0];
  for (let k = scan; k <= maxPx; k += scan) out.push(k, -k);
  return out;
}

// Candidate anchor positions ALONG the edge. Polylines here are orthogonal, so which segment the
// anchor lands on decides the direction of the only offset direction available: on a vertical leg a
// perpendicular nudge moves the label horizontally and can never get it out of an ellipse row. The
// ladder therefore has to be fine enough that some fraction always lands on the long horizontal run.
// Ordered by distance from the midpoint so a clear label stays near the middle of its connector.
export const LABEL_FRACTION_SPAN = 0.01;

export function fractionLadder(span = LABEL_FRACTION_SPAN) {
  const out = [0.5];
  const n = Math.round(0.5 / span);
  for (let k = 1; k <= n; k++) {
    const lo = +(0.5 - k * span).toFixed(6);
    const hi = +(0.5 + k * span).toFixed(6);
    if (lo >= 0) out.push(lo);
    if (hi <= 1) out.push(hi);
  }
  return out;
}

export function labelBox(lines, fontSize = 11) {
  const longest = Math.max(...lines.map((l) => l.length), 0);
  return {
    w: Math.ceil(longest * fontSize * CHAR_W) + PAD_X * 2,
    h: Math.ceil(lines.length * LINE_H) + PAD_Y * 2,
  };
}

// Manhattan length == Euclidean length for the orthogonal polylines this router produces.
function segLen(p, q) {
  return Math.abs(q.x - p.x) + Math.abs(q.y - p.y);
}

export function polyLength(poly) {
  let n = 0;
  for (let i = 0; i < poly.length - 1; i++) n += segLen(poly[i], poly[i + 1]);
  return n;
}

// Point and unit tangent at arc-length fraction f. This reproduces how mxEdgeRenderer resolves a
// relative label coordinate: it walks the same state points and takes the point at x * totalLength.
export function pointAt(poly, f) {
  const total = polyLength(poly);
  let s = total * f;
  for (let i = 0; i < poly.length - 1; i++) {
    const p = poly[i], q = poly[i + 1];
    const len = segLen(p, q);
    if (len <= 1e-9) continue;
    const ux = (q.x - p.x) / len;
    const uy = (q.y - p.y) / len;
    if (s <= len || i === poly.length - 2) {
      const t = Math.min(s, len);
      return { x: p.x + ux * t, y: p.y + uy * t, ux, uy };
    }
    s -= len;
  }
  const last = poly[poly.length - 1];
  return { x: last.x, y: last.y, ux: 1, uy: 0 };
}

export function rectAround(cx, cy, box) {
  return { x: cx - box.w / 2, y: cy - box.h / 2, w: box.w, h: box.h };
}

// Segment of the polyline containing arc length `s`, in the exact form diagrams.net resolves a
// relative label coordinate: walk the state points and take the point at x * totalLength.
//
// THE FRACTION EMITTED IN THE FILE MUST COME FROM THIS PARAMETRISATION. Choosing an anchor by
// fraction-of-horizontal-length (or of vertical length) and writing that fraction into
// mxGeometry x makes draw.io resolve a different point, and the label lands somewhere the generator
// never measured — which is precisely how four labels ended up sitting on use case ellipses while
// the generator's own self-check reported zero.
export function segmentAt(poly, total, s) {
  let walk = s;
  for (let i = 0; i < poly.length - 1; i++) {
    const p = poly[i], q = poly[i + 1];
    const len = Math.abs(q.x - p.x) + Math.abs(q.y - p.y);
    if (len <= 1e-9) continue;
    if (walk <= len) {
      const ux = (q.x - p.x) / len, uy = (q.y - p.y) / len;
      const t = walk;
      return { x: p.x + ux * t, y: p.y + uy * t, ux, uy, horizontal: Math.abs(p.y - q.y) < 1e-9 };
    }
    walk -= len;
  }
  const last = poly[poly.length - 1];
  const prev = poly[poly.length - 2] || last;
  const len = Math.abs(last.x - prev.x) + Math.abs(last.y - prev.y);
  return {
    x: last.x, y: last.y,
    ux: len > 1e-9 ? (last.x - prev.x) / len : 1,
    uy: len > 1e-9 ? (last.y - prev.y) / len : 0,
    horizontal: Math.abs(prev.y - last.y) < 1e-9,
  };
}

export function overlapArea(a, b) {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? w * h : 0;
}

export function insideRect(r, outer, pad = 0) {
  return (
    r.x >= outer.x + pad && r.y >= outer.y + pad &&
    r.x + r.w <= outer.x + outer.w - pad && r.y + r.h <= outer.y + outer.h - pad
  );
}

function outsideArea(r, outer) {
  const dx = Math.max(0, outer.x - r.x) + Math.max(0, r.x + r.w - (outer.x + outer.w));
  const dy = Math.max(0, outer.y - r.y) + Math.max(0, r.y + r.h - (outer.y + outer.h));
  return dx * dy;
}

// Cost of one candidate rectangle. 0 means a legal slot. Any positive number is a ranking, so the
// search degrades to "least bad" instead of failing when a sheet is genuinely full.
function candidateCost(rect, placed, ctx) {
  let c = 0;
  if (!insideRect(rect, ctx.page)) c += 1e6 + outsideArea(rect, ctx.page);
  if (!insideRect(rect, ctx.boundary, ctx.boundaryPad)) c += 1e6 + outsideArea(rect, ctx.boundary);
  for (const r of ctx.obstacles) c += overlapArea(rect, r);
  // Already-settled labels, weighted as labels: the route-repair pass hands the solver the slots the
  // other relations already occupy so it treats them exactly as it would its own placed labels.
  for (const r of ctx.prior || []) c += overlapArea(rect, r) * 2;
  // An already-placed label is weighted above a node: two labels on top of each other make the
  // relations ambiguous, whereas a label clipping an ellipse edge is merely ugly.
  for (const r of placed) c += overlapArea(rect, r) * 2;
  return c;
}

/**
 * Assign each relation label an independent, collision-free slot.
 *
 * @param items  [{ id, lines, fontSize, poly }]  poly = [from, ...waypoints, to] exactly as draw.io
 *               will assemble it, so the anchor matches the rendered edge.
 * @param ctx    { page, boundary, boundaryPad, obstacles, clearance, prior }
 * @returns Map id -> { f, d, offset:{x,y}, rect, test, cost, lines }
 *
 * `rect` is the true label box; `test` is the same box grown by `clearance`, and only `test` takes
 * part in collision. Placement is shortest-polyline-first (most constrained first), tie-broken by
 * id, with failing labels promoted to the front of the order and the pass repeated: fully
 * deterministic, and it stops a greedy label from taking the only room a more constrained one could
 * use.
 */
export function placeLabels(items, ctx, opts = {}) {
  const maxPasses = opts.maxPasses == null ? 8 : opts.maxPasses;
  // Most constrained first: the shortest polyline has the fewest legal anchor points, so it must get
  // first pick rather than be left with whatever room the others did not want.
  const byConstraint = (a, b) =>
    polyLength(a.poly) - polyLength(b.poly) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  const ladder = slotLadder();
  const fractions = fractionLadder();
  const pad = ctx.clearance == null ? 0 : ctx.clearance;
  const totalOf = new Map(items.map((it) => [it.id, polyLength(it.poly)]));

  const runPass = (order) => {
    const placed = [];
    const result = new Map();
    for (const it of order) {
      const box = labelBox(it.lines, it.fontSize || 11);
      const probe = { w: box.w + pad * 2, h: box.h + pad * 2 };
      const total = totalOf.get(it.id);
      // `want` filters which segment kind the anchor may sit on: true = horizontal run only,
      // false = vertical leg only. Both passes read the fraction off the FULL polyline length.
      const search = (want) => {
        let best = null;
        // The perpendicular distance loop is the OUTER loop, so the first legal slot found is the one
        // that keeps the label nearest its own connector — the objective the brief asks for
        // ("asociación inequívoca con su edge"). Scanning fractions first would let a label sit 140 px
        // away simply because an early fraction admitted some distant offset.
        for (const d of ladder) {
          for (const f of fractions) {
            const a = segmentAt(it.poly, total, total * f);
            if (a.horizontal !== want) continue;
            const nx = -a.uy;
            const ny = a.ux;
            const offset = { x: nx * d, y: ny * d };
            const cx = a.x + offset.x, cy = a.y + offset.y;
            const rect = rectAround(cx, cy, box);
            const probeRect = rectAround(cx, cy, probe);
            const cost = candidateCost(probeRect, placed, ctx);
            if (!best || cost < best.cost) best = { f, d, offset, rect, test: probeRect, cost, lines: it.lines };
            if (cost === 0) return best;
          }
        }
        return best;
      };
      // Pass A prefers the horizontal gutter run, which is the idiomatic home of a relation label.
      // Pass B exists for the same-column route, whose only horizontal segments are two 16..28 px
      // elbows at the gutter: no 123 px label can be centred there without leaving the boundary, so
      // the label goes beside the vertical leg instead — still adjacent to its own connector.
      let best = search(true);
      const alt = search(false);
      if (!best || (best.cost !== 0 && alt && alt.cost < best.cost)) best = alt;
      result.set(it.id, best);
      placed.push(best.test);
    }
    return result;
  };

  let order = [...items].sort(byConstraint);
  let result = runPass(order);
  // Greedy is order-sensitive: a label whose only gutter run was already covered by earlier labels
  // gets pushed a long way from its own connector just to find any legal slot. Promoting the label
  // that failed to the front of the order gives it first pick and resolves it permanently. Still
  // deterministic — the promotion order follows the same constraint sort, and the pass count is capped.
  for (let pass = 1; pass < maxPasses; pass++) {
    const failing = order.filter((it) => result.get(it.id).cost > 0);
    if (!failing.length) break;
    const promote = failing[0];
    order = [promote, ...order.filter((it) => it !== promote)];
    result = runPass(order);
  }
  return result;
}