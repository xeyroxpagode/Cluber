import { describe, expect, it } from "vitest"
import { classifyEventPatch } from "./materiality.js"
import { parseRRule, generateOccurrences, RRuleError } from "../shared/rrule.js"
import { notificationDedupeKey } from "../notification/notification.js"
import { isValidTimeZone, wallClockToUtc, wallClockInZone } from "../shared/zoned-time.js"
import { assertAuthorityToCreate } from "./events.js"
import type { AuthoritySnapshot } from "../authority/authority.js"

const snapshotOf = (overrides: Partial<AuthoritySnapshot>): AuthoritySnapshot => ({
  roles: [],
  teamIds: [],
  coachTeamIds: [],
  captainTeamIds: [],
  playerTeamIds: [],
  eventScopeIds: [],
  isAdmin: false,
  isSubcommittee: false,
  canAccessApplication: true,
  canManagePeople: false,
  canManageStructure: false,
  canManageCompetitions: false,
  canViewCompetitions: true,
  canViewAudit: false,
  canAssignRole: false,
  canEndRole: false,
  canRegisterPlayer: false,
  canManageTeams: false,
  ...overrides,
})

describe("materiality classification (DV-13 / INV-16)", () => {
  it("treats schedule fields as material-schedule", () => {
    expect(classifyEventPatch({ startAt: "2030-01-01T10:00:00Z" }).classification).toBe("schedule")
    expect(classifyEventPatch({ venueId: "x" }).classification).toBe("schedule")
    expect(classifyEventPatch({ timeZone: "Europe/Madrid" }).classification).toBe("schedule")
  })

  it("treats coordination fields as material-coordination", () => {
    expect(classifyEventPatch({ targetTeamIds: ["a"] }).classification).toBe("coordination")
    expect(classifyEventPatch({ opponent: "Rivals" }).classification).toBe("coordination")
    expect(classifyEventPatch({ logistics: { meetingPoint: "club" } }).classification).toBe("coordination")
    expect(classifyEventPatch({ clubWideTarget: true }).classification).toBe("coordination")
  })

  it("treats title as metadata, never material", () => {
    const result = classifyEventPatch({ title: "nuevo título" })
    expect(result.classification).toBe("metadata")
    expect(result.material).toEqual([])
  })

  it("classifies mixed patches as schedule when any schedule field changes", () => {
    expect(classifyEventPatch({ title: "x", startAt: "2030-01-01T10:00:00Z" }).classification).toBe("schedule")
  })

  it("classifies empty patches as none", () => {
    expect(classifyEventPatch({}).classification).toBe("none")
    expect(classifyEventPatch({ logistics: {} }).classification).toBe("none")
  })

  it("ignores unknown keys", () => {
    expect(classifyEventPatch({ hacker: "smuggle" } as never).classification).toBe("none")
  })
})

describe("RRULE parsing and occurrence generation (S02.11)", () => {
  it("parses a weekly rule with BYDAY", () => {
    const rule = parseRRule("FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE")
    expect(rule.freq).toBe("WEEKLY")
    expect(rule.byDay).toEqual(["MO", "WE"])
  })

  it("rejects an invalid frequency", () => {
    expect(() => parseRRule("FREQ=MINUTELY")).toThrow(RRuleError)
  })

  it("rejects mismatched COUNT and UNTIL", () => {
    expect(() => parseRRule("FREQ=DAILY;COUNT=5;UNTIL=20300101")).toThrow(RRuleError)
  })

  it("generates DAILY occurrences honoring COUNT", () => {
    const rule = parseRRule("FREQ=DAILY;COUNT=5")
    const out = generateOccurrences(rule, { year: 2030, month: 3, day: 10, hour: 20, minute: 30, second: 0 }, "UTC", { maxOccurrences: 366, limit: 366 })
    expect(out).toHaveLength(5)
    expect(out[0]!.toISOString()).toBe("2030-03-10T20:30:00.000Z")
    expect(out[4]!.toISOString()).toBe("2030-03-14T20:30:00.000Z")
  })

  it("generates WEEKLY occurrences on the right weekdays", () => {
    const rule = parseRRule("FREQ=WEEKLY;COUNT=6;BYDAY=TU,TH")
    const out = generateOccurrences(rule, { year: 2030, month: 3, day: 4, hour: 18, minute: 0, second: 0 }, "UTC", { maxOccurrences: 366, limit: 366 })
    expect(out).toHaveLength(6)
    for (const date of out) expect([2, 4]).toContain(date.getUTCDay())
    expect(out[0]!.toISOString()).toBe("2030-03-05T18:00:00.000Z") // first Tuesday
  })

  it("generates MONTHLY occurrences with ordinal BYDAY (first Saturday)", () => {
    const rule = parseRRule("FREQ=MONTHLY;COUNT=3;BYDAY=1SA")
    const out = generateOccurrences(rule, { year: 2030, month: 1, day: 5, hour: 10, minute: 0, second: 0 }, "UTC", { maxOccurrences: 366, limit: 366 })
    expect(out).toHaveLength(3)
    for (const date of out) {
      expect(date.getUTCDay()).toBe(6)
      expect(date.getUTCDate()).toBeLessThanOrEqual(7)
    }
  })

  it("stops at UNTIL inclusive", () => {
    const rule = parseRRule("FREQ=DAILY;UNTIL=20300312")
    const out = generateOccurrences(rule, { year: 2030, month: 3, day: 10, hour: 20, minute: 0, second: 0 }, "UTC", { maxOccurrences: 366, limit: 366 })
    expect(out.map((d) => d.toISOString().slice(0, 10))).toEqual(["2030-03-10", "2030-03-11", "2030-03-12"])
  })

  it("survives spring-forward gaps deterministically (Europe/Madrid)", () => {
    const rule = parseRRule("FREQ=DAILY;COUNT=2")
    const out = generateOccurrences(rule, { year: 2030, month: 3, day: 31, hour: 2, minute: 30, second: 0 }, "Europe/Madrid", { maxOccurrences: 366, limit: 366 })
    expect(out).toHaveLength(2)
    expect(new Set(out.map((d) => d.toISOString())).size).toBe(2)
  })
})

describe("time zones", () => {
  it("accepts IANA zones and rejects junk", () => {
    expect(isValidTimeZone("Europe/Madrid")).toBe(true)
    expect(isValidTimeZone("America/Argentina/Buenos_Aires")).toBe(true)
    expect(isValidTimeZone("Not/AZone")).toBe(false)
    expect(isValidTimeZone("")).toBe(false)
  })

  it("round-trips wall clock in a DST zone", () => {
    const utc = wallClockToUtc({ year: 2030, month: 7, day: 15, hour: 10, minute: 0, second: 0 }, "Europe/Madrid")
    const back = wallClockInZone(utc, "Europe/Madrid")
    expect({ year: back.year, month: back.month, day: back.day, hour: back.hour, minute: back.minute }).toEqual({ year: 2030, month: 7, day: 15, hour: 10, minute: 0 })
  })
})

describe("notification dedupe key (A-T03-05)", () => {
  it("uses originEventId|resourceType|resourceId|recipient|type for EVENT_*", () => {
    const key = notificationDedupeKey({ type: "EVENT_CHANGED", resourceType: "EVENT", resourceId: "event-1", recipientPersonId: "p-1", originEventId: "event-1" })
    expect(key).toBe("event-1|EVENT|event-1|p-1|EVENT_CHANGED")
  })

  it("uses resourceId|recipient|type for other types", () => {
    const key = notificationDedupeKey({ type: "ANNOUNCEMENT_PUBLISHED", resourceType: "ANNOUNCEMENT", resourceId: "a-1", recipientPersonId: "p-1", originEventId: null })
    expect(key).toBe("a-1|p-1|ANNOUNCEMENT_PUBLISHED")
  })

  it("distinguishes different fact types for the same recipient", () => {
    const base = { resourceType: "EVENT" as const, resourceId: "event-1", recipientPersonId: "p-1", originEventId: "event-1" }
    expect(notificationDedupeKey({ ...base, type: "EVENT_POSTPONED" })).not.toBe(notificationDedupeKey({ ...base, type: "EVENT_CANCELLED" }))
  })
})

describe("create-event authority (AUTH-EVT-01)", () => {
  const targets = (over: Partial<{ clubWideTarget: boolean; teamIds: string[]; personIds: string[] }>) => ({ clubWideTarget: false, teamIds: ["team-a"], personIds: [], ...over })

  it("allows COACH to create for their own team", () => {
    expect(() => assertAuthorityToCreate(snapshotOf({ roles: ["COACH"], coachTeamIds: ["team-a"] }), "TRAINING", targets({}))).not.toThrow()
  })

  it("denies COACH to create for another team", () => {
    expect(() => assertAuthorityToCreate(snapshotOf({ roles: ["COACH"], coachTeamIds: ["team-a"] }), "TRAINING", targets({ teamIds: ["team-b"] }))).toThrowError(/own teams/i)
  })

  it("denies COACH to create club-wide events", () => {
    expect(() => assertAuthorityToCreate(snapshotOf({ roles: ["COACH"], coachTeamIds: ["team-a"] }), "TRAINING", targets({ clubWideTarget: true, teamIds: [] }))).toThrowError(/SUBCOMMITTEE/i)
  })

  it("denies CAPTAIN to create events", () => {
    expect(() => assertAuthorityToCreate(snapshotOf({ roles: ["CAPTAIN"], captainTeamIds: ["team-a"], teamIds: ["team-a"] }), "TRAINING", targets({}))).toThrowError(/own teams/i)
  })

  it("allows SUBCOMMITTEE to create club events and TRAINING", () => {
    expect(() => assertAuthorityToCreate(snapshotOf({ roles: ["SUBCOMMITTEE"], isSubcommittee: true }), "CLUB_EVENT", targets({ clubWideTarget: true, teamIds: [] }))).not.toThrow()
    expect(() => assertAuthorityToCreate(snapshotOf({ roles: ["SUBCOMMITTEE"], isSubcommittee: true }), "TRAINING", targets({}))).not.toThrow()
  })

  it("denies ADMIN to create club events (authority is deliberate)", () => {
    expect(() => assertAuthorityToCreate(snapshotOf({ roles: ["ADMIN"], isAdmin: true }), "CLUB_EVENT", targets({ clubWideTarget: true, teamIds: [] }))).toThrowError(/SUBCOMMITTEE/i)
  })

  it("denies PLAYER to create events", () => {
    expect(() => assertAuthorityToCreate(snapshotOf({ roles: ["PLAYER"], playerTeamIds: ["team-a"] }), "TRAINING", targets({}))).toThrowError(/own teams/i)
  })
})
