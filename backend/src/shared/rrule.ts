/**
 * RFC 5545 RRULE subset, strictly validated. Unsupported constructs are rejected
 * with INVALID_RRULE — never silently mis-parsed.
 *
 * Supported: FREQ=DAILY|WEEKLY|MONTHLY|YEARLY, INTERVAL, COUNT, UNTIL,
 *            WEEKLY+BYDAY (MO..SU), MONTHLY+BYMONTHDAY (1..31,-1..-31),
 *            MONTHLY+BYDAY with ordinals (1MO,-1FR...), YEARLY+BYMONTH+BYMONTHDAY.
 */
import { wallClockToUtc, parseUntil, type WallClock } from "./zoned-time.js"

export const RRULE_ERROR = "INVALID_RRULE"

const WEEKDAYS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"] as const
type Weekday = (typeof WEEKDAYS)[number]
const WEEKDAY_INDEX: Record<Weekday, number> = { MO: 0, TU: 1, WE: 2, TH: 3, FR: 4, SA: 5, SU: 6 }

export interface ParsedRRule {
  freq: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"
  interval: number
  count: number | null
  until: string | null
  byDay: Weekday[] | null
  byMonthDay: number[] | null
  byMonth: number[] | null
  ordinalByDay: Array<{ ordinal: number; weekday: Weekday }> | null
}

export class RRuleError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "RRuleError"
  }
}

function fail(message: string): never {
  throw new RRuleError(message)
}

export function parseRRule(input: string): ParsedRRule {
  const raw = input.trim()
  if (!raw) fail("recurrenceRule is required")
  const withoutPrefix = raw.toUpperCase().replace(/^RRULE:/, "")
  const parts = withoutPrefix.split(";").filter(Boolean)
  const fields = new Map<string, string>()
  for (const part of parts) {
    const [key, value] = part.split("=", 2)
    if (!key || value === undefined) fail(`Malformed RRULE segment: ${part}`)
    if (fields.has(key)) fail(`Duplicate RRULE field: ${key}`)
    fields.set(key, value)
  }
  const freq = fields.get("FREQ")
  if (freq !== "DAILY" && freq !== "WEEKLY" && freq !== "MONTHLY" && freq !== "YEARLY") fail("FREQ must be DAILY, WEEKLY, MONTHLY or YEARLY")
  const interval = fields.has("INTERVAL") ? Number(fields.get("INTERVAL")) : 1
  if (!Number.isInteger(interval) || interval < 1 || interval > 366) fail("INTERVAL must be an integer between 1 and 366")
  const count = fields.has("COUNT") ? Number(fields.get("COUNT")) : null
  if (count !== null && (!Number.isInteger(count) || count < 1)) fail("COUNT must be a positive integer")
  const until = fields.has("UNTIL") ? fields.get("UNTIL")! : null
  if (until !== null && !/^\d{8}(T\d{6}Z?)?$/.test(until)) fail("UNTIL must be yyyymmdd or yyyymmddThhmmss[Z]")
  if (count !== null && until !== null) fail("COUNT and UNTIL are mutually exclusive")

  const byDayRaw = fields.get("BYDAY")
  const byMonthDayRaw = fields.get("BYMONTHDAY")
  const byMonthRaw = fields.get("BYMONTH")

  let byDay: Weekday[] | null = null
  let ordinalByDay: Array<{ ordinal: number; weekday: Weekday }> | null = null
  if (byDayRaw) {
    const tokens = byDayRaw.split(",").map((token) => token.trim()).filter(Boolean)
    if (freq === "WEEKLY") {
      for (const token of tokens) if (!WEEKDAYS.includes(token as Weekday)) fail(`Invalid BYDAY token: ${token}`)
      byDay = Array.from(new Set(tokens as Weekday[]))
      if (byDay.length === 0) fail("BYDAY requires at least one weekday")
    } else if (freq === "MONTHLY") {
      const list: Array<{ ordinal: number; weekday: Weekday }> = []
      for (const token of tokens) {
        const match = /^([+-]?\d{1,2})(MO|TU|WE|TH|FR|SA|SU)$/.exec(token)
        if (!match) fail(`MONTHLY ordinal BYDAY must look like 1MO or -1FR: ${token}`)
        const ordinal = Number(match[1])
        if (ordinal === 0 || Math.abs(ordinal) > 5) fail(`Ordinal out of range in BYDAY: ${token}`)
        list.push({ ordinal, weekday: match[2] as Weekday })
      }
      ordinalByDay = list
    } else {
      fail("BYDAY is only supported for WEEKLY or MONTHLY")
    }
  }

  let byMonthDay: number[] | null = null
  if (byMonthDayRaw) {
    byMonthDay = byMonthDayRaw.split(",").map((token) => Number(token.trim()))
    if (byMonthDay.some((value) => !Number.isInteger(value) || value === 0 || Math.abs(value) > 31)) fail("BYMONTHDAY values must be in 1..31 or -1..-31")
    if (freq !== "MONTHLY" && freq !== "YEARLY") fail("BYMONTHDAY is only supported for MONTHLY or YEARLY")
  }

  let byMonth: number[] | null = null
  if (byMonthRaw) {
    byMonth = byMonthRaw.split(",").map((token) => Number(token.trim()))
    if (byMonth.some((value) => !Number.isInteger(value) || value < 1 || value > 12)) fail("BYMONTH values must be in 1..12")
    if (freq !== "YEARLY") fail("BYMONTH is only supported for YEARLY")
  }

  if (ordinalByDay && byMonthDay) fail("BYDAY and BYMONTHDAY cannot be combined")
  if (freq === "YEARLY" && !byMonth) fail("YEARLY requires BYMONTH (and usually BYMONTHDAY)")

  const known = new Set(["FREQ", "INTERVAL", "COUNT", "UNTIL", "BYDAY", "BYMONTHDAY", "BYMONTH"])
  for (const key of fields.keys()) if (!known.has(key)) fail(`Unsupported RRULE field: ${key}`)

  return { freq, interval, count, until, byDay, byMonthDay, byMonth, ordinalByDay }
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

function addMonths(year: number, month: number, delta: number): { year: number; month: number } {
  const total = (month - 1) + delta
  return { year: year + Math.floor(total / 12), month: ((total % 12) + 12) % 12 + 1 }
}

function weekdayOf(year: number, month: number, day: number): Weekday {
  // Epoch 1970-01-01 was a Thursday (index 0). Convert to Monday-based index.
  const index = ((Date.UTC(year, month - 1, day) / 86_400_000) % 7 + 7) % 7
  const mondayBased = (index + 3) % 7
  return WEEKDAYS[mondayBased]!
}

function nthWeekdayOfMonth(year: number, month: number, ordinal: number, weekday: Weekday): number | null {
  const matches: number[] = []
  const total = daysInMonth(year, month)
  for (let day = 1; day <= total; day += 1) if (weekdayOf(year, month, day) === weekday) matches.push(day)
  const index = ordinal > 0 ? ordinal - 1 : matches.length + ordinal
  return matches[index] ?? null
}

function mondayOfWeekOf(year: number, month: number, day: number): { year: number; month: number; day: number } {
  const weekday = WEEKDAY_INDEX[weekdayOf(year, month, day)]
  const shifted = new Date(Date.UTC(year, month - 1, day - weekday))
  return { year: shifted.getUTCFullYear(), month: shifted.getUTCMonth() + 1, day: shifted.getUTCDate() }
}

export interface OccurrenceOptions {
  maxOccurrences: number
  limit: number
}

/**
 * Generate occurrence instants (UTC) from `dtstart` wall clock in `timeZone`.
 * Deterministic order; stops at COUNT, UNTIL or `limit`.
 */
export function generateOccurrences(rule: ParsedRRule, dtstart: WallClock, timeZone: string, options: OccurrenceOptions): Date[] {
  const limit = Math.max(1, Math.min(options.limit, options.maxOccurrences, 366))
  const until = rule.until ? parseUntil(rule.until, timeZone) : null
  const out: Date[] = []

  const push = (wall: WallClock): boolean => {
    const instant = wallClockToUtc(wall, timeZone)
    if (until && instant.getTime() > until.getTime()) return false
    out.push(instant)
    return out.length < limit && (rule.count === null || out.length < rule.count)
  }
  const base = { hour: dtstart.hour, minute: dtstart.minute, second: dtstart.second }

  if (rule.freq === "DAILY") {
    for (let k = 0; k < limit + 400; k += 1) {
      const d = new Date(Date.UTC(dtstart.year, dtstart.month - 1, dtstart.day + k * rule.interval))
      const keep = push({ year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(), ...base })
      if (!keep) break
    }
    return out
  }

  if (rule.freq === "WEEKLY") {
    const byDay = rule.byDay ?? [weekdayOf(dtstart.year, dtstart.month, dtstart.day)]
    const monday = mondayOfWeekOf(dtstart.year, dtstart.month, dtstart.day)
    // Iterate week over week, `interval` weeks apart (bounded at ~100 years).
    for (let w = 0; w < 5200; w += 1) {
      const weekOffset = w * rule.interval
      const weekStart = new Date(Date.UTC(monday.year, monday.month - 1, monday.day + weekOffset * 7))
      for (const weekday of byDay) {
        const d = new Date(Date.UTC(weekStart.getUTCFullYear(), weekStart.getUTCMonth(), weekStart.getUTCDate() + WEEKDAY_INDEX[weekday]))
        const wall: WallClock = { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(), ...base }
        const asInstant = wallClockToUtc(wall, timeZone)
        if (asInstant.getTime() < wallClockToUtc(dtstart, timeZone).getTime()) continue
        if (until && asInstant.getTime() > until.getTime()) return out
        out.push(asInstant)
        if (out.length >= limit || (rule.count !== null && out.length >= rule.count)) return out
      }
    }
    return out
  }

  if (rule.freq === "MONTHLY") {
    const monthlyBound = Math.min(400_000, Math.max(1_200, rule.interval * (rule.count ?? limit) * 4 + 240))
    for (let k = 0; k < monthlyBound; k += 1) {
      const { year, month } = addMonths(dtstart.year, dtstart.month, k * rule.interval)
      const days: number[] = []
      if (rule.ordinalByDay) {
        for (const { ordinal, weekday } of rule.ordinalByDay) {
          const day = nthWeekdayOfMonth(year, month, ordinal, weekday)
          if (day !== null) days.push(day)
        }
      } else if (rule.byMonthDay) {
        for (const value of rule.byMonthDay) {
          const day = value > 0 ? value : daysInMonth(year, month) + value + 1
          if (day >= 1 && day <= daysInMonth(year, month)) days.push(day)
        }
      } else {
        days.push(Math.min(dtstart.day, daysInMonth(year, month)))
      }
      const startOfMonth = wallClockToUtc({ year, month, day: 1, hour: 0, minute: 0, second: 0 }, timeZone)
      const reachedUntilBoundary = until && startOfMonth.getTime() > until.getTime() && k > 0
      for (const day of Array.from(new Set(days)).sort((a, b) => a - b)) {
        const keep = push({ year, month, day, ...base })
        if (!keep) return out
      }
      if (reachedUntilBoundary) return out
    }
    return out
  }

  // YEARLY
  const yearlyBound = Math.min(200_000, Math.max(400, rule.interval * (rule.count ?? limit) + 20))
  for (let k = 0; k < yearlyBound; k += 1) {
    const year = dtstart.year + k * rule.interval
    const months = rule.byMonth ?? [dtstart.month]
    for (const month of months) {
      const days: number[] = rule.byMonthDay
        ? rule.byMonthDay.flatMap((value) => {
            const day = value > 0 ? value : daysInMonth(year, month) + value + 1
            return day >= 1 && day <= daysInMonth(year, month) ? [day] : []
          })
        : [Math.min(dtstart.day, daysInMonth(year, month))]
      for (const day of days.sort((a, b) => a - b)) {
        const keep = push({ year, month, day, ...base })
        if (!keep) return out
      }
    }
  }
  return out
}
