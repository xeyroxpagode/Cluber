/**
 * Conversión civil <-> UTC para la zona del evento (DST-safe), igual criterio que el backend.
 * Gap inexistente: salta hacia adelante. Horario ambiguo: toma el offset más temprano.
 */

interface WallClock {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

function partsFor(instant: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone, hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  })
  const map = Object.fromEntries(formatter.formatToParts(instant).map((part) => [part.type, part.value]))
  return {
    year: Number(map.year), month: Number(map.month), day: Number(map.day),
    hour: Number(map.hour) % 24, minute: Number(map.minute), second: Number(map.second),
  }
}

function asUtcMs(parts: { year: number; month: number; day: number; hour: number; minute: number; second: number }): number {
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)
}

export function wallClockInZone(instant: Date, timeZone: string): WallClock {
  return partsFor(instant, timeZone)
}

export function wallClockToUtc(wall: WallClock, timeZone: string): Date {
  const target = Date.UTC(wall.year, wall.month - 1, wall.day, wall.hour, wall.minute, wall.second)
  let utc = target
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const offset = utc - asUtcMs(partsFor(new Date(utc), timeZone))
    const candidate = target + offset
    if (candidate === utc) return new Date(candidate)
    utc = candidate
  }
  return new Date(utc)
}

/** "2030-03-31" + "02:30" in `tz` -> ISO UTC instant. */
export function zonedLocalInputToIso(date: string, time: string, timeZone: string): string | null {
  const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  const t = /^(\d{2}):(\d{2})$/.exec(time)
  if (!d || !t) return null
  const wall: WallClock = { year: Number(d[1]), month: Number(d[2]), day: Number(d[3]), hour: Number(t[1]), minute: Number(t[2]), second: 0 }
  return wallClockToUtc(wall, timeZone).toISOString()
}

/** UTC ISO -> { date, time } parts rendered in `tz`. */
export function utcIsoToZonedParts(iso: string | null | undefined, timeZone: string): { date: string; time: string } | null {
  if (!iso) return null
  const instant = new Date(iso)
  if (Number.isNaN(instant.getTime())) return null
  const p = partsFor(instant, timeZone)
  const pad = (n: number) => String(n).padStart(2, "0")
  return { date: `${p.year}-${pad(p.month)}-${pad(p.day)}`, time: `${pad(p.hour)}:${pad(p.minute)}` }
}
