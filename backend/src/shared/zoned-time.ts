/**
 * Civil wall-clock <-> UTC conversion for IANA time zones, DST-safe.
 * Gap (nonexistent local time): shifts forward to the post-transition instant.
 * Ambiguous local time: resolves to the earlier (DST) offset.
 * Pure module; no IO.
 */

export interface WallClock { year: number; month: number; day: number; hour: number; minute: number; second: number }

function partsInZone(value: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone, hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  })
  const map = Object.fromEntries(formatter.formatToParts(value).map((part) => [part.type, part.value]))
  return {
    year: Number(map.year), month: Number(map.month), day: Number(map.day),
    hour: Number(map.hour) % 24, minute: Number(map.minute), second: Number(map.second),
  }
}

function asUtcMs(parts: { year: number; month: number; day: number; hour: number; minute: number; second: number }): number {
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)
}

export function wallClockInZone(instant: Date, timeZone: string): WallClock {
  return partsInZone(instant, timeZone)
}

/** Convert wall clock in `timeZone` to a UTC instant. Deterministic for gaps/ambiguities. */
export function wallClockToUtc(wall: WallClock, timeZone: string): Date {
  const target = Date.UTC(wall.year, wall.month - 1, wall.day, wall.hour, wall.minute, wall.second)
  let utc = target
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const offset = utc - asUtcMs(partsInZone(new Date(utc), timeZone))
    const candidate = target + offset
    if (candidate === utc) return new Date(candidate)
    utc = candidate
  }
  return new Date(utc)
}

/** Parse RFC 5545 basic date/datetime (UNTIL) as wall clock in `timeZone`. */
export function parseUntil(value: string, timeZone: string): Date {
  const dateMatch = /^(\d{4})(\d{2})(\d{2})$/.exec(value)
  const dateTimeMatch = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/.exec(value)
  if (dateMatch) {
    const [, y, m, d] = dateMatch
    return wallClockToUtc({ year: Number(y), month: Number(m), day: Number(d), hour: 23, minute: 59, second: 59 }, timeZone)
  }
  if (dateTimeMatch) {
    const [, y, m, d, hh, mi, ss, z] = dateTimeMatch
    if (z) return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mi), Number(ss)))
    return wallClockToUtc({ year: Number(y), month: Number(m), day: Number(d), hour: Number(hh), minute: Number(mi), second: Number(ss) }, timeZone)
  }
  throw new RangeError("UNTIL must be yyyymmdd or yyyymmddThhmmss[Z]")
}

export function isValidTimeZone(timeZone: string): boolean {
  if (!timeZone || timeZone.length > 64) return false
  try {
    new Intl.DateTimeFormat("en-US", { timeZone })
    return true
  } catch {
    return false
  }
}
