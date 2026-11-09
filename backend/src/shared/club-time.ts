function partsFor(value: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
  const map = Object.fromEntries(formatter.formatToParts(value).map((part) => [part.type, part.value]))
  return {
    year: Number(map.year), month: Number(map.month), day: Number(map.day),
    hour: Number(map.hour) % 24, minute: Number(map.minute), second: Number(map.second),
  }
}

function asUtc(parts: ReturnType<typeof partsFor>): number {
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)
}

/** Convert a calendar date at local midnight in the club time zone to a UTC instant. */
export function clubDateStart(date: string, timeZone: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (!match) throw new RangeError("Expected a calendar date in YYYY-MM-DD format")
  const [, yearText, monthText, dayText] = match
  const [year, month, day] = [Number(yearText), Number(monthText), Number(dayText)]
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day) || month < 1 || month > 12 || day < 1 || day > 31) {
    throw new RangeError("Invalid calendar date")
  }
  const wallClockUtc = Date.UTC(year, month - 1, day, 0, 0, 0)
  let utc = wallClockUtc
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const offset = utc - asUtc(partsFor(new Date(utc), timeZone))
    const candidate = wallClockUtc + offset
    if (candidate === utc) return new Date(candidate)
    utc = candidate
  }
  return new Date(utc)
}

export function calendarDateInZone(instant: Date, timeZone: string): string {
  const parts = partsFor(instant, timeZone)
  const pad = (value: number) => String(value).padStart(2, "0")
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`
}
