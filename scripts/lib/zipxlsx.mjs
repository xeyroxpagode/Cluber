import zlib from "node:zlib";
import fs from "node:fs";

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

export function readZip(filePath) {
  const raw = fs.readFileSync(filePath);
  const eocdIdx = findEocd(raw);
  if (eocdIdx < 0) throw new Error("EOCD not found: not a zip file");
  const eocd = raw.subarray(eocdIdx);
  const count = eocd.readUInt16LE(10);
  let off = eocd.readUInt32LE(16);
  const entries = [];
  for (let i = 0; i < count; i++) {
    if (raw.readUInt32LE(off) !== 0x02014b50) throw new Error(`bad central dir @${off}`);
    const method = raw.readUInt16LE(off + 10);
    const compSize = raw.readUInt32LE(off + 20);
    const nameLen = raw.readUInt16LE(off + 28);
    const extraLen = raw.readUInt16LE(off + 30);
    const commentLen = raw.readUInt16LE(off + 32);
    const localOff = raw.readUInt32LE(off + 42);
    const name = raw.subarray(off + 46, off + 46 + nameLen).toString("utf8");

    if (raw.readUInt32LE(localOff) !== 0x04034b50) throw new Error(`bad local header for ${name}`);
    const lNameLen = raw.readUInt16LE(localOff + 26);
    const lExtraLen = raw.readUInt16LE(localOff + 28);
    const dataStart = localOff + 30 + lNameLen + lExtraLen;
    const comp = raw.subarray(dataStart, dataStart + compSize);
    let data;
    if (method === 0) data = Buffer.from(comp);
    else if (method === 8) data = zlib.inflateRawSync(comp);
    else throw new Error(`unsupported method ${method} for ${name}`);

    entries.push({ name, data, method });
    off += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

function findEocd(buf) {
  const min = Math.max(0, buf.length - 65557);
  for (let i = buf.length - 22; i >= min; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) return i;
  }
  return -1;
}

export function writeZip(filePath, entries) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const e of entries) {
    const nameBuf = Buffer.from(e.name, "utf8");
    const comp = zlib.deflateRawSync(e.data, { level: 9 });
    const crc = crc32(e.data);

    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0);
    lh.writeUInt16LE(20, 4);
    lh.writeUInt16LE(0, 6);
    lh.writeUInt16LE(8, 8);
    lh.writeUInt16LE(0, 10);
    lh.writeUInt16LE(0, 12);
    lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(comp.length, 18);
    lh.writeUInt32LE(e.data.length, 22);
    lh.writeUInt16LE(nameBuf.length, 26);
    lh.writeUInt16LE(0, 28);
    locals.push(lh, nameBuf, comp);

    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0);
    ch.writeUInt16LE(20, 4);
    ch.writeUInt16LE(20, 6);
    ch.writeUInt16LE(0, 8);
    ch.writeUInt16LE(8, 10);
    ch.writeUInt16LE(0, 12);
    ch.writeUInt16LE(0, 14);
    ch.writeUInt32LE(crc, 16);
    ch.writeUInt32LE(comp.length, 20);
    ch.writeUInt32LE(e.data.length, 24);
    ch.writeUInt16LE(nameBuf.length, 28);
    ch.writeUInt16LE(0, 30);
    ch.writeUInt16LE(0, 32);
    ch.writeUInt16LE(0, 34);
    ch.writeUInt16LE(0, 36);
    ch.writeUInt32LE(0, 38);
    ch.writeUInt32LE(offset, 42);
    centrals.push(ch, nameBuf);

    offset += lh.length + nameBuf.length + comp.length;
  }

  const localBuf = Buffer.concat(locals);
  const centralBuf = Buffer.concat(centrals);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralBuf.length, 12);
  eocd.writeUInt32LE(localBuf.length, 16);
  eocd.writeUInt16LE(0, 20);

  fs.writeFileSync(filePath, Buffer.concat([localBuf, centralBuf, eocd]));
}
