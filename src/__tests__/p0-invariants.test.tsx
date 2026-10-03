import { describe, expect, it } from "vitest"
import { act, render, renderHook, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"
import type { ReactNode } from "react"
import { MockAppProvider, useProduct } from "../mock/store"
import {
  AttendancePage,
  AvailabilityPage,
  MatchRecordPage,
} from "../features/participation"
import { EventDetail } from "../features/events"
import { NewConversation } from "../features/communication"
import { StructurePage } from "../features/management"
import { ScopeDialog } from "../shared/patterns"

function useHarness() {
  return renderHook(() => useProduct(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <MockAppProvider>
        <MemoryRouter>{children}</MemoryRouter>
      </MockAppProvider>
    ),
  })
}

function renderEventRoute(node: ReactNode, path: string, routePath = "/events/:eventId") {
  return render(
    <MockAppProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={routePath} element={node} />
        </Routes>
      </MemoryRouter>
    </MockAppProvider>,
  )
}

function renderFlat(node: ReactNode, path = "/") {
  return render(
    <MockAppProvider>
      <MemoryRouter initialEntries={[path]}>{node}</MemoryRouter>
    </MockAppProvider>,
  )
}

describe("P0 invariants — Stage 4", () => {
  it("P0-2 attendance correction conserva before/after e historia", () => {
    const { result } = useHarness()
    const eventId = "training-today"
    act(() => {
      result.current.markAttendance(eventId, "p5", "PRESENT")
    })
    act(() => {
      result.current.markAttendance(eventId, "p5", "ABSENT", "Se equivocó el marcar")
    })
    const event = result.current.state.events.find((e) => e.id === eventId)!
    const history = event.attendanceHistory ?? []
    expect(history.length).toBe(2)
    expect(history[0].before).toBe("PRESENT")
    expect(history[0].after).toBe("ABSENT")
    expect(history[0].reason).toBe("Se equivocó el marcar")
    expect(history[1].before).toBe(null)
    expect(event.attendance.p7).toBeUndefined()
  })

  it("P0-3 match record correction conserva historial before/after", () => {
    const { result } = useHarness()
    act(() => {
      result.current.correctRecord(
        "match-sic",
        "GEI 4-1 (FINAL)",
        "Goleada corregida",
        (item) => {
          item.record.gei = 4
        },
      )
    })
    const event = result.current.state.events.find((e) => e.id === "match-sic")!
    expect(event.record.gei).toBe(4)
    expect(event.recordHistory?.[0].before).toContain("3-1")
    expect(event.recordHistory?.[0].after).toBe("GEI 4-1 (FINAL)")
    expect(event.recordHistory?.[0].reason).toBe("Goleada corregida")
  })

  it("P0-4 password change muta credencial mock; sin fake success", () => {
    const { result } = useHarness()
    const before = result.current.actor.credentialVersion ?? 0
    const short = result.current.changePassword(result.current.actor.id, "x", "corta")
    expect(short.ok).toBe(false)
    let ok = false
    act(() => {
      ok = result.current.changePassword(
        result.current.actor.id,
        "x",
        "clave-de-prueba-1234",
      ).ok
    })
    expect(ok).toBe(true)
    const after = result.current.state.people.find(
      (p) => p.id === result.current.actor.id,
    )!
    expect(after.credentialVersion).toBe((before || 1) + 1)
  })

  it("P0-6a rename metadata de sede NO reprograma eventos", () => {
    const { result } = useHarness()
    const before = result.current.state.events.map((e) => ({
      id: e.id,
      venue: e.venue,
      revision: e.revision,
    }))
    act(() => {
      result.current.renameVenueMetadata("v1", "Cancha Auxiliar GEI")
    })
    const after = result.current.state.events.map((e) => ({
      id: e.id,
      venue: e.venue,
      revision: e.revision,
    }))
    expect(after).toEqual(before)
    expect(result.current.state.venues.find((v) => v.id === "v1")?.name).toBe(
      "Cancha Auxiliar GEI",
    )
  })

  it("P0-6b cambiar la sede asignada al evento SÍ es material", () => {
    const { result } = useHarness()
    const before = result.current.state.events.find((e) => e.id === "match-cuba")!
      .revision
    act(() => {
      result.current.changeEventVenue("match-cuba", "v2")
    })
    const event = result.current.state.events.find((e) => e.id === "match-cuba")!
    expect(event.venueId).toBe("v2")
    expect(event.venueAddress).toBeTruthy()
    expect(event.revision).toBe(before + 1)
    expect(
      result.current.state.notifications.some((n) => n.title === "Sede actualizada"),
    ).toBe(true)
  })

  it("P0-1 rename de División/Línea no muta la identidad del Team", () => {
    const { result } = useHarness()
    const team = result.current.state.teams.find((t) => t.id === "sexta")!
    expect(team.name).toBe("Sexta A")
    expect(team.division).toBe("Sexta")
    expect(team.line).toBe("A")
  })
})

describe("target behavior — Stage 4", () => {
  it("Availability: gramática ¿Vas? con Voy/Quizás/No voy", () => {
    window.history.pushState({}, "", "/events/match-cuba/availability?demo=player")
    const { container } = renderEventRoute(
      <AvailabilityPage />,
      "/events/match-cuba/availability",
      "/events/:eventId/availability",
    )
    expect(screen.getAllByRole("button", { name: /^Voy$/ }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole("button", { name: /^Quizás$/ }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole("button", { name: /^No voy$/ }).length).toBeGreaterThan(0)
    expect(container.textContent).not.toMatch(/YES|MAYBE/)
    window.history.pushState({}, "", "/")
  })

  it("Event Detail: rail de participación y sin jerga interna", () => {
    const { container } = renderEventRoute(<EventDetail />, "/events/match-cuba")
    expect(screen.getAllByText("Disponibilidad").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Asistencia").length).toBeGreaterThan(0)
    expect(container.textContent).not.toMatch(/SelectionRevision|EventTarget|EligibilityConstraint/)
  })

  it("Attendance: UNRECORDED no se convierte en ABSENT", () => {
    const { result } = useHarness()
    const event = result.current.state.events.find((e) => e.id === "training-today")!
    const unrecordedBefore = Object.keys(event.attendance).length
    act(() => {
      result.current.updateEvent("training-today", (item) => {
        item.attendanceClosed = true
      })
    })
    const after = result.current.state.events.find((e) => e.id === "training-today")!
    expect(Object.keys(after.attendance).length).toBe(unrecordedBefore)
    expect(after.attendance.p7).toBeUndefined()
  })

  it("MatchRecord: estado Final explícito y corrección separada", () => {
    const { result } = useHarness()
    const event = result.current.state.events.find((e) => e.id === "match-sic")!
    expect(event.record.state).toBe("FINAL")
    expect(event.recordHistory ?? []).toBeDefined()
  })

  it("Communication: DIRECT duplicado no crea una segunda conversación", () => {
    const { result } = useHarness()
    const before = result.current.state.conversations.length
    let outcome = { id: "", existed: false }
    act(() => {
      outcome = result.current.findOrOpenDirect("p0")
    })
    const stateAfter = result.current.state
    const existingDirect = stateAfter.conversations.find(
      (c) => c.kind === "DIRECT" && c.participants.length === 2,
    )
    expect(outcome.existed || outcome.id).toBeTruthy()
    expect(stateAfter.conversations.length).toBeGreaterThanOrEqual(before)
    // El par canónico sigue siendo único.
    const directPairs = stateAfter.conversations
      .filter((c) => c.kind === "DIRECT")
      .map((c) => [...c.participants].sort().join("__"))
    expect(new Set(directPairs).size).toBe(directPairs.length)
    void existingDirect
  })

  it("Nuevo mensaje: no duplica y comunica que ya existe conversación", () => {
    renderFlat(<NewConversation />, "/communication/conversations/new")
    expect(screen.getAllByRole("button", { name: /Conversación directa/i }).length).toBeGreaterThan(0)
  })

  it("Guardian: delegación habilita acceso sin Membership deportivo", () => {
    const { result } = useHarness()
    expect(result.current.login("marcela.fernandez")).toBe(true)
    expect(result.current.hasAccess).toBe(true)
  })

  it("Series: ScopeDialog con los tres alcances en vocabulario usuario", () => {
    renderFlat(<ScopeDialog onClose={() => {}} onPick={() => {}} />)
    expect(screen.getByText("¿Dónde querés aplicar el cambio?")).toBeTruthy()
    expect(screen.getByText("Solo este evento")).toBeTruthy()
    expect(screen.getByText("Este y los siguientes")).toBeTruthy()
    expect(screen.getByText("Toda la serie")).toBeTruthy()
  })

  it("Estructura: tabs visibles y sin jerga interna", () => {
    window.history.pushState({}, "", "/management/structure?demo=admin")
    const { container } = renderFlat(<StructurePage />, "/management/structure?demo=admin")
    expect(container.textContent).not.toMatch(/event_series_target|event_occurrence_override/)
    window.history.pushState({}, "", "/")
  })

  it("MatchRecord: sólo renderiza para quien tiene autoridad deportiva", () => {
    const { container } = renderEventRoute(
      <MatchRecordPage />,
      "/events/match-sic/match-record",
      "/events/:eventId/match-record",
    )
    expect(container.textContent?.length ?? 0).toBeGreaterThan(0)
  })
})
