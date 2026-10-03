import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { MockAppProvider } from "../mock/store"
import { VasInline } from "../shared/vas"
import { ScopeDialog, SERIES_SCOPE_OPTIONS } from "../shared/patterns"
import { getAllowedActions } from "../mock/authority"
import { deriveEligibility } from "../mock/eligibility"

describe("target interaction grammar", () => {
  it("¿Vas? usa Voy/Quizás/No voy y mismo orden", () => {
    render(
      <MockAppProvider>
        <MemoryRouter>
          <VasInline
            event={{
              id: "e1",
              title: "Partido",
              type: "MATCH",
              team: "sexta",
              date: "2026-10-10",
              time: "18:00",
              end: "19:30",
              venue: "GEI",
              opponent: "CUBA",
              state: "SCHEDULED",
              revision: 1,
              version: 1,
              competition: "",
              meeting: "",
              departure: "",
              point: "",
              transport: "",
              arrival: "",
              clubWide: false,
              availability: {},
              selection: [],
              published: null,
              selectionRevisions: [],
              attendance: {},
              attendanceOpened: false,
              attendanceClosed: false,
              record: { state: "DRAFT", status: "PLAYED", gei: 0, opponent: 0, observations: "", stats: {} },
              history: [],
            }}
          />
        </MemoryRouter>
      </MockAppProvider>,
    )
    expect(screen.getByRole("group", { name: "¿Vas?" })).toBeTruthy()
    expect(screen.getByRole("button", { name: "Voy" })).toBeTruthy()
    expect(screen.getByRole("button", { name: "Quizás" })).toBeTruthy()
    expect(screen.getByRole("button", { name: "No voy" })).toBeTruthy()
  })

  it("ScopeDialog habla en vocabulario usuario, no EventSeries", () => {
    render(
      <MemoryRouter>
        <ScopeDialog onClose={() => {}} onPick={() => {}} />
      </MemoryRouter>,
    )
    expect(screen.getByText("¿Dónde querés aplicar el cambio?")).toBeTruthy()
    expect(screen.getByText("Solo este evento")).toBeTruthy()
    expect(screen.getByText("Este y los siguientes")).toBeTruthy()
    expect(screen.getByText("Toda la serie")).toBeTruthy()
    expect(SERIES_SCOPE_OPTIONS).toHaveLength(3)
    expect(document.body.textContent).not.toMatch(/EventSeries/)
  })

  it("authority: ADMIN no es Coach; CAPTAIN no es Coach", () => {
    const admin = {
      id: "admin",
      name: "A",
      team: "",
      role: "ADMIN",
      eligibility: "ELIGIBLE",
      phone: "",
      email: "",
      dni: "",
      birth: "",
      account: "ACTIVE",
      username: "a",
    } as const
    const captain = {
      id: "p0",
      name: "C",
      team: "sexta",
      role: "CAPTAIN",
      eligibility: "ELIGIBLE",
      phone: "",
      email: "",
      dni: "",
      birth: "",
      account: "ACTIVE",
      username: "c",
    } as const
    expect(getAllowedActions(admin).canManageSelection).toBe(false)
    expect(getAllowedActions(admin).canManagePeople).toBe(true)
    expect(getAllowedActions(captain).canManageSelection).toBe(false)
  })

  it("eligibility deriva ELIGIBLE sin constraints; BLOCKED domina", () => {
    expect(deriveEligibility([], "p1")).toBe("ELIGIBLE")
    expect(
      deriveEligibility(
        [
          {
            id: "c1",
            personId: "p1",
            state: "PENDING",
            scope: "CLUB",
            scopeRefId: null,
            source: "INTERNAL",
            reason: "ADMIN",
            validFrom: "2020-01-01",
            validUntil: null,
          },
          {
            id: "c2",
            personId: "p1",
            state: "BLOCKED",
            scope: "ENTRY",
            scopeRefId: "e1",
            source: "AHBA",
            reason: "FEDERATION",
            validFrom: "2020-01-01",
            validUntil: null,
          },
        ],
        "p1",
      ),
    ).toBe("BLOCKED")
  })
})
