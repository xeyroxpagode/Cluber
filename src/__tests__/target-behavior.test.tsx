import { describe, expect, it } from "vitest"
import { createSeed } from "../mock/seed"
import { deriveEligibility } from "../mock/eligibility"
import { eventTeamIds, eventTargetsText, venueAddressOf } from "../mock/model"

describe("stage 4 product behavior", () => {
  it("eligibility canónica: BLOCKED/PENDING derivan de constraints", () => {
    const seed = createSeed()
    expect(seed.eligibilityConstraints.length).toBeGreaterThan(0)
    expect(deriveEligibility(seed.eligibilityConstraints, "p4")).toBe("BLOCKED")
    expect(deriveEligibility(seed.eligibilityConstraints, "p12")).toBe("PENDING")
    expect(deriveEligibility(seed.eligibilityConstraints, "p0")).toBe("ELIGIBLE")
  })

  it("event targets plurales con texto usuario", () => {
    const seed = createSeed()
    const match = seed.events.find((e) => e.id === "match-cuba")!
    expect(eventTeamIds(match)).toEqual(["sexta"])
    expect(eventTargetsText(match, (id) => seed.teams.find((t) => t.id === id)?.name ?? "?")).toContain("Sexta")
    const club = seed.events.find((e) => e.id === "club-event")!
    expect(eventTargetsText(club, () => "?")).toBe("Todo hockey")
  })

  it("venue tiene dirección real, no literal en UI", () => {
    const seed = createSeed()
    expect(seed.venues.find((v) => v.id === "v1")?.address).toBeTruthy()
    const match = seed.events.find((e) => e.id === "match-cuba")!
    expect(venueAddressOf(seed, match)).toBeTruthy()
  })

  it("serie de entrenamientos existe para ScopeDialog", () => {
    const seed = createSeed()
    expect(seed.eventSeries.find((s) => s.id === "series-sexta")?.status).toBe("ACTIVE")
    const inSeries = seed.events.filter((e) => e.seriesId === "series-sexta")
    expect(inSeries.length).toBeGreaterThanOrEqual(2)
  })

  it("guardian existe sin membership deportivo pero con delegación", () => {
    const seed = createSeed()
    const rel = seed.guardianRelationships.find((r) => r.guardianId === "guardian")!
    expect(rel.canRespondAvailability).toBe(true)
    expect(seed.people.find((p) => p.id === "guardian")).toBeTruthy()
  })

  it("notifications usan tipos reales §22", () => {
    const seed = createSeed()
    const types = seed.notifications.map((n) => n.type)
    expect(types).toContain("EVENT_RESCHEDULED")
    expect(types).toContain("SELECTION_PUBLISHED")
    expect(types).toContain("ANNOUNCEMENT_PUBLISHED")
  })
})
