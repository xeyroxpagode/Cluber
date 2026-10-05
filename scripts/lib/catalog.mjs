import fs from "node:fs";
import path from "node:path";

const CATALOG = "docs/use-cases/GEI_MASTER_USE_CASE_CATALOG_V1.md";

export function readCatalog() {
  const text = fs.readFileSync(CATALOG, "utf8");
  const lines = text.split(/\r?\n/);
  const items = [];
  let cur = null;
  for (const raw of lines) {
    const line = raw.replace(/\r$/, "");
    const head = line.match(/^##\s+(UC-[A-Z]+-\d{2})\s*[·\-–]\s*(.+?)\s*$/);
    if (head) {
      cur = { id: head[1], name: head[2].trim(), fields: {} };
      items.push(cur);
      continue;
    }
    if (!cur) continue;
    const cell = line.match(/^\|\s*\*\*([^*]+)\*\*\s*\|\s*(.*?)\s*\|\s*$/);
    if (cell) cur.fields[cell[1].trim().toUpperCase()] = cell[2].trim();
  }
  return items;
}

const ACTOR_RE = /ACT-[A-Z]+/g;

export function actorsOf(fieldValue) {
  if (!fieldValue) return [];
  return [...new Set(fieldValue.match(ACTOR_RE) || [])];
}

export function buildModel() {
  const items = readCatalog();
  return items.map((it) => ({
    id: it.id,
    name: it.name,
    domain: it.id.split("-")[1],
    num: Number(it.id.split("-")[2]),
    primary: actorsOf(it.fields["PRIMARY ACTOR(S)"]),
    secondary: actorsOf(it.fields["SECONDARY ACTOR(S)"]),
    includeCandidates: it.fields["INCLUDE CANDIDATES"] || "",
    extendCandidates: it.fields["EXTEND CANDIDATES"] || "",
  }));
}
