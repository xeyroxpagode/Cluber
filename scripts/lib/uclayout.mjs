export const PAGE = { w: 1169, h: 827 };

export const L = {
  title: { x: 24, y: 10, w: 800, h: 26 },
  note: { x: 856, y: 8, w: 292, h: 46 },
  boundary: { x: 250, y: 62, w: 907, h: 730 },
  actor: { cx: 110, size: 40, labelX: 66, labelW: 92 },
  genLanes: [26, 34, 42, 50, 58, 66],
  busLanes: [164, 178, 192, 206, 220, 234],
  gridX: [296, 518, 740, 962],
  gridY: [110, 222, 334, 446, 558, 670],
  uc: { w: 190, h: 96 },
};

export const FONT = "Helvetica";
export const FONT_SIZE = 11;
export const ACTOR_FONT = 10;
export const LABEL_FONT = 9;
export const LINE_H = 16;
export const UC_WRAP = 17;
export const ACTOR_WRAP = 14;

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
