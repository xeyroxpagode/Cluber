import { readZip } from "./zipxlsx.mjs";

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };

export function decode(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&(amp|lt|gt|quot|apos);/g, (_, e) => ENTITIES[e]);
}

export function encode(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`${name}="([^"]*)"`));
  return m ? m[1] : null;
}

export function sharedStrings(entries) {
  const part = entries.find((e) => e.name === "xl/sharedStrings.xml");
  if (!part) return [];
  const xml = part.data.toString("utf8");
  const out = [];
  const re = /<(?:x:)?si\b[^>]*>([\s\S]*?)<\/(?:x:)?si>/g;
  let m;
  while ((m = re.exec(xml))) {
    const inner = m[1];
    let text = "";
    const tre = /<(?:x:)?t\b[^>]*>([\s\S]*?)<\/(?:x:)?t>/g;
    let t;
    while ((t = tre.exec(inner))) text += decode(t[1]);
    out.push(text);
  }
  return out;
}

export function sheetParts(entries) {
  const wb = entries.find((e) => e.name === "xl/workbook.xml").data.toString("utf8");
  const rels = entries.find((e) => e.name === "xl/_rels/workbook.xml.rels").data.toString("utf8");
  const relMap = new Map();
  const rre = /<Relationship\b[^>]*\/>/g;
  let rm;
  while ((rm = rre.exec(rels))) {
    relMap.set(attr(rm[0], "Id"), attr(rm[0], "Target").replace(/^\/?xl\//, ""));
  }
  const out = [];
  const sre = /<(?:x:)?sheet\b[^>]*\/>/g;
  let sm;
  let i = 0;
  while ((sm = sre.exec(wb))) {
    const tag = sm[0];
    i += 1;
    const rid = attr(tag, "r:id") || attr(tag, "relationship:id");
    const target = relMap.get(rid);
    out.push({
      index: i,
      name: decode(attr(tag, "name")),
      state: attr(tag, "state") || "visible",
      partName: `xl/${target}`,
      rid,
    });
  }
  return out;
}

export function colToIndex(ref) {
  const m = ref.match(/^([A-Z]+)/);
  let n = 0;
  for (const ch of m[1]) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n;
}

export function readSheet(entries, partName) {
  const part = entries.find((e) => e.name === partName);
  if (!part) throw new Error(`missing sheet part ${partName}`);
  const sst = sharedStrings(entries);
  const xml = part.data.toString("utf8");
  const rows = [];
  const rowRe = /<(?:x:)?row\b([^>]*)>([\s\S]*?)<\/(?:x:)?row>/g;
  let r;
  while ((r = rowRe.exec(xml))) {
    const rAttr = attr(`<row ${r[1]}>`, "r");
    const rowNum = rAttr ? parseInt(rAttr, 10) : rows.length + 1;
    const cells = [];
    const cRe = /<(?:x:)?c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/(?:x:)?c>)/g;
    let c;
    while ((c = cRe.exec(r[2]))) {
      const cTag = `<c ${c[1]}>`;
      const ref = attr(cTag, "r");
      const type = attr(cTag, "t");
      const inner = c[2] || "";
      let value = null;
      let formula = null;
      const f = inner.match(/<(?:x:)?f\b[^>]*>([\s\S]*?)<\/(?:x:)?f>/);
      if (f) formula = decode(f[1]);
      if (type === "inlineStr") {
        const tre = /<(?:x:)?t\b[^>]*>([\s\S]*?)<\/(?:x:)?t>/g;
        let t;
        let acc = "";
        while ((t = tre.exec(inner))) acc += decode(t[1]);
        value = acc;
      } else {
        const v = inner.match(/<(?:x:)?v\b[^>]*>([\s\S]*?)<\/(?:x:)?v>/);
        if (v) {
          value = decode(v[1]);
          if (type === "s") value = sst[parseInt(value, 10)] ?? "";
          else if (type === "b") value = value === "1" ? "TRUE" : "FALSE";
          else if (type === "str" || type === "e") value = value;
          else if (/^-?\d+(\.\d+)?$/.test(value) && !value.startsWith("0.")) {
            const n = Number(value);
            value = String(n);
          }
        }
      }
      cells.push({ ref, col: colToIndex(ref), colName: ref.match(/^([A-Z]+)/)[1], type, value, formula });
    }
    rows.push({ row: rowNum, cells });
  }
  return rows;
}

export function cellText(row) {
  return row.cells
    .slice()
    .sort((a, b) => a.col - b.col)
    .map((c) => (c.value == null ? "" : c.value))
    .join(" | ");
}

export { readZip };
