export const PAGE = { w: 1169, h: 827 };

export const L = {
  title: { x: 24, y: 10, w: 800, h: 26 },
  note: { x: 856, y: 8, w: 292, h: 46 },
  boundary: { x: 250, y: 62, w: 907, h: 730 },
  // E4-0.1: the actor label box was 92 px wide, which forced 11 pt names onto two lines and
  // made the 8-actor column in UCD-00 overflow the page. There is free space between the actor
  // figure (x 90..130) and the boundary (x 250), so the box is widened to 170 px (66..236).
  actor: { cx: 110, size: 40, labelX: 66, labelW: 170 },
  genLanes: [20, 28, 36, 44, 52, 60],
  // E4-0.1: every association gets its OWN vertical lane. Previously all associations of one
  // actor shared a single lane, so two edges travelling the same direction overlapped
  // collinearly over their whole vertical run — unreadable, and invisible to the old metric.
  // Pool sized for the worst sheet (UCD-EVT-01 / UCD-EVT-02a: 2 actors x 6 use cases = 12).
  // E4-0.1: the actor label box ends at x=236, so the association corridor starts at 240. The
  // previous corridor (140..248) ran straight through the actor labels, which the rendered
  // sheets showed as lines crossing "Administración del club" and "Persona autenticada".
  busLanes: [240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 294],
  gridX: [296, 518, 740, 962],
  gridY: [110, 222, 334, 446, 558, 670],
  uc: { w: 190, h: 96 },
};

// Distance from the actor figure centre to the top of its label text block.
export const ACTOR_LABEL_OFFSET = 20;

export const FONT = "Helvetica";
// E4-0.1: every text element in a printed diagram must be >= 11 pt. The previous 10 pt actor
// and 9 pt relation label were a declared deviation; the brief forbids trading type size for
// fewer sheets, and with INC-01 no longer drawing 39 edges the space argument no longer holds.
export const FONT_SIZE = 11;
export const ACTOR_FONT = 11;
export const LABEL_FONT = 11;
export const TITLE_FONT = 15;
export const BOUNDARY_FONT = 12;
export const LINE_H = 16;
export const UC_WRAP = 17;
export const ACTOR_WRAP = 26;
export const ACTOR_LINE_H = 14;

export const ACTOR_NAMES = {
  "ACT-UNAUTHENTICATED": "Persona no autenticada",
  "ACT-AUTHENTICATED": "Persona autenticada",
  "ACT-PLAYER": "Jugadora",
  "ACT-CAPTAIN": "Capitana",
  "ACT-COACH": "Entrenador/a",
  "ACT-SUBCOMMITTEE": "Subcomisión de hockey",
  "ACT-ADMIN": "Administración del club",
  "ACT-GUARDIAN": "Responsable / guardian",
};

// E4 D-10 — reserving space for LABELS, not only for connectors.
// The row pitch was 112 = a 96 px ellipse plus a 16 px band. Sixteen pixels is enough to keep three
// CONNECTORS distinct (they are 5 px apart) but nowhere near enough for a two-line relation label,
// which is ~36 px tall. UCD-EVT-02a draws five relations into that 16 px band and the five labels
// had nowhere legal to go: the only free rectangles inside its boundary are the 54 px strip above
// row 0 and the 34 px strip below row 1. On a relation-bearing sheet the gap is therefore opened to
// hold exactly one label row plus the three connector channels.
export const ROW_PITCH = L.uc.h + 16;          // 112 — unchanged for relation-free sheets
export const REL_LABEL_ROW = 46;               // 36 px label + 5 px clearance above and below
export const REL_ROW_PITCH = L.uc.h + REL_LABEL_ROW; // 142

// Highest row index a sheet can occupy before the system boundary would run off the page. The
// boundary bottom is rowY[maxRow] + ellipse height + 34 and must stay within PAGE.h - 16.
export function maxPitchFor(maxRow) {
  if (maxRow <= 0) return Infinity;
  const bTop = L.gridY[0] - 54;
  return Math.floor((PAGE.h - 16 - bTop - L.uc.h - 34) / maxRow);
}

// Row count a given column split implies, so the pitch can be chosen before anything is placed.
export function maxRowOf(spec, cols) {
  const n = spec.ucs.filter((u) => u !== spec.refId).length;
  const needed = n + (spec.refId ? 1 : 0);
  const plain = cols === 1 ? needed - 1 : Math.floor((needed - 1) / cols);
  return spec.refId ? Math.max(plain, spec.refSlot[1]) : plain;
}

// Vertical position of each grid row. `wide` is set only for sheets that draw relations, so the
// fifteen relation-free sheets keep their previous geometry byte for byte. A `wide` sheet whose row
// count cannot carry the opened band at page scale is not silently squeezed: the caller skips it
// (see generate-use-case-diagrams.mjs) instead of emitting a sheet with no room for its labels.
export function rowYs(wide, maxRow) {
  let pitch = wide ? REL_ROW_PITCH : ROW_PITCH;
  if (wide && Number.isFinite(maxPitchFor(maxRow))) pitch = Math.min(pitch, maxPitchFor(maxRow));
  return Array.from({ length: L.gridY.length }, (_, i) => L.gridY[0] + i * pitch);
}

export const ABSTRACT = new Set(["ACT-AUTHENTICATED"]);

export function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// diagrams.net renders html=1 labels, so a line break must travel as the escaped
// entity &lt;br&gt; — a raw "<br>" inside an attribute would terminate the tag.
export const BR = "&lt;br&gt;";

export function label(lines) {
  return lines.map(esc).join(BR);
}

export function wrapWords(text, max) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = "";
  for (const w of words) {
    if (!cur) cur = w;
    else if ((cur + " " + w).length <= max) cur += " " + w;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

export const ucLabelLines = (uc) => [uc.id, ...wrapWords(uc.name, UC_WRAP)];

export function actorLabelLines(id) {
  const lines = wrapWords(ACTOR_NAMES[id], ACTOR_WRAP);
  lines.push(id);
  if (ABSTRACT.has(id)) lines.push("«abstract»");
  return lines;
}

export function textFitsEllipse(lines, r, fontSize = FONT_SIZE) {
  const charW = fontSize * 0.55;
  const blockH = lines.length * LINE_H;
  const dy = Math.abs(blockH / 2 - LINE_H / 2);
  const t = 1 - (dy / (r.h / 2)) ** 2;
  if (t <= 0) return { fits: false, textW: 0, availW: 0 };
  const availW = 2 * (r.w / 2) * Math.sqrt(t) - 8;
  const textW = Math.max(...lines.map((l) => l.length)) * charW;
  return { fits: textW <= availW, textW: Math.round(textW), availW: Math.round(availW), lines: lines.length };
}

export const CHANNEL_X = [268, 502, 724, 946];
export const CHANNEL_Y = [214, 328, 444, 556, 668];

// E4-0.1 CRITICAL FIX. diagrams.net stores connector waypoints as <mxPoint> CHILD ELEMENTS of
// <Array as="points">. Writing them as space-separated "x,y x,y" text produces a file that is
// still well-formed XML, but draw.io cannot parse the geometry: every connector collapses to a
// straight centre-to-centre line and the headless exporter fails with "Export failed".
// Proven against draw.io 31.7.0 (MSIX): the space-separated form exits 1, the <mxPoint> form
// exports correctly. XML well-formedness is NOT evidence that a .drawio is loadable.
export function pointsArray(pts) {
  if (!pts || !pts.length) return "";
  return `<Array as="points">${pts
    .map((p) => `<mxPoint x="${p.x}" y="${p.y}" />`)
    .join("")}</Array>`;
}
