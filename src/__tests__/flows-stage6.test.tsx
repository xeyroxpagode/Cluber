import { describe, expect, it } from "vitest"
import { renderHook, act } from "@testing-library/react"
import type { ReactNode } from "react"
import { Harness, renderScreen } from "./harness"
import { useProduct } from "../mock/store"
import { JornadaPage } from "../features/events"
import { PersonAdminDetail } from "../features/management"
import { screen } from "@testing-library/react"

const wrapper = ({ children }: { children: ReactNode }) => (
  <Harness>{children}</Harness>
)

function api() {
  return renderHook(() => useProduct(), { wrapper })
}

describe("C08 — jornada real", () => {
  it("rechaza una jornada sin partidos y lo explica", async () => {
    const { result } = api()
    let response: { ok: boolean; id?: string; error?: string } = { ok: true }
    act(() => {
      response = result.current.createJornada({
        name: "Fecha 1",
        seasonId: "s1",
        competitionId: "ahba",
        eventIds: [],
      })
    })
    expect(response.ok).toBe(false)
    expect(response.error).toContain("al menos un partido")
  })

  it("rechaza un entrenamiento dentro de una jornada", async () => {
    const { result } = api()
    let response: { ok: boolean; id?: string; error?: string } = { ok: true }
    act(() => {
      response = result.current.createJornada({
        name: "Fecha 2",
        seasonId: "s1",
        competitionId: "ahba",
        eventIds: ["training-serie-2"],
      })
    })
    expect(response.ok).toBe(false)
    expect(response.error).toContain("sólo agrupa partidos")
  })

  it("rechaza un partido de otra temporada", async () => {
    const { result } = api()
    let response: { ok: boolean; id?: string; error?: string } = { ok: true }
    act(() => {
      response = result.current.createJornada({
        name: "Fecha 3",
        seasonId: "s2",
        competitionId: "ahba",
        eventIds: ["match-cuba"],
      })
    })
    expect(response.ok).toBe(false)
    expect(response.error).toContain("otra temporada")
  })

  it("crea la jornada con los partidos elegidos y no toca el ciclo de los eventos", async () => {
    const { result } = api()
    const before = result.current.state.events.find((e) => e.id === "match-cuba")!
    let response: { ok: boolean; id?: string; error?: string } = { ok: false }
    act(() => {
      response = result.current.createJornada({
        name: "Fecha nueva",
        seasonId: "s1",
        competitionId: "ahba",
        eventIds: ["match-septima-quinta"],
      })
    })
    expect(response.ok).toBe(true)
    const jornada = result.current.state.jornadas.find(
      (item) => item.id === response.id,
    )!
    expect(jornada.events).toEqual(["match-septima-quinta"])
    const after = result.current.state.events.find((e) => e.id === "match-cuba")!
    expect(after.state).toBe(before.state)
    expect(after.coordinationRevision).toBe(before.coordinationRevision)
  })

  it("la pantalla de alta explica la regla de temporada y competencia", () => {
    renderScreen("/jornadas/new", "/jornadas/new", <JornadaPage />)
    expect(screen.getByText(/Cada partido conserva su propio ciclo de vida/)).toBeTruthy()
    expect(screen.getByRole("button", { name: "Crear jornada" })).toBeTruthy()
  })
})

describe("C06 / D6 — habilitación por autoridad", () => {
  it("la Subcomisión entra a la ficha y sólo ve la sección de habilitación", () => {
    window.history.replaceState({}, "", "/?demo=subcommittee")
    renderScreen(
      "/management/people/:id",
      "/management/people/p4",
      <PersonAdminDetail />,
    )
    const tabs = screen.getByRole("tablist", { name: "Secciones de la ficha" })
    expect(tabs).toBeTruthy()
    expect(screen.getByRole("tab", { name: "Habilitación" })).toBeTruthy()
    expect(screen.queryByRole("tab", { name: "Cuenta" })).toBeNull()
    expect(screen.queryByRole("tab", { name: "Identidad" })).toBeNull()
    window.history.replaceState({}, "", "/")
  })

  it("la Subcomisión ve el motivo y el origen de la restricción", () => {
    window.history.replaceState({}, "", "/?demo=subcommittee")
    renderScreen(
      "/management/people/:id",
      "/management/people/p4",
      <PersonAdminDetail />,
    )
    expect(screen.getByText(/Pase pendiente de registración federativa/)).toBeTruthy()
    expect(screen.getByText(/Referencia de la asociación/)).toBeTruthy()
    expect(screen.getByText(/Trámite federativo/)).toBeTruthy()
    window.history.replaceState({}, "", "/")
  })

  it("administración sí ve todas las secciones", () => {
    window.history.replaceState({}, "", "/?demo=admin")
    renderScreen(
      "/management/people/:id",
      "/management/people/p4",
      <PersonAdminDetail />,
    )
    expect(screen.getByRole("tab", { name: "Cuenta" })).toBeTruthy()
    expect(screen.getByRole("tab", { name: "Identidad" })).toBeTruthy()
    window.history.replaceState({}, "", "/")
  })
})

describe("D6 — perfil incompleto recuperable desde administración", () => {
  it("administración ve qué falta y tiene la acción para corregirlo", () => {
    window.history.replaceState({}, "", "/?demo=admin")
    renderScreen(
      "/management/people/:id",
      "/management/people/p17",
      <PersonAdminDetail />,
    )
    expect(screen.getByText(/Faltan datos para poder asignarla/)).toBeTruthy()
    expect(screen.getAllByText(/documento de identidad/).length).toBeGreaterThan(0)
    expect(screen.getByRole("button", { name: "Corregir identidad" })).toBeTruthy()
    window.history.replaceState({}, "", "/")
  })

  it("la jugadora ve el motivo pero no los campos protegidos", () => {
    window.history.replaceState({}, "", "/?demo=player")
    renderScreen(
      "/management/people/:id",
      "/management/people/p2",
      <PersonAdminDetail />,
    )
    expect(screen.queryByRole("button", { name: "Corregir identidad" })).toBeNull()
    window.history.replaceState({}, "", "/")
  })
})

describe("D7 — audiencia de comunicado real", () => {
  it("publicar captura el snapshot y corregir no lo cambia", () => {
    const { result } = api()
    act(() => {
      result.current.saveAnnouncement({
        title: "Trazo de prueba",
        body: "Contenido del comunicado",
        audience: { kind: "TEAMS", teamIds: ["septima"] },
        publish: true,
      })
    })
    const published = result.current.state.announcements[0]
    expect(published.audienceSnapshot?.teamIds).toEqual(["septima"])
    expect(published.audienceSnapshot?.label).toBe("Séptima A")

    act(() => {
      result.current.saveAnnouncement({
        id: published.id,
        title: "Trazo de prueba corregido",
        body: "Contenido corregido",
        audience: { kind: "CLUB" },
        publish: true,
        reason: "Error de destinatario",
      })
    })
    const corrected = result.current.state.announcements.find(
      (item) => item.id === published.id,
    )!
    expect(corrected.audienceSnapshot?.teamIds).toEqual(["septima"])
    expect(corrected.audience).toEqual({ kind: "TEAMS", teamIds: ["septima"] })
    expect(corrected.corrections).toHaveLength(1)
    expect(corrected.corrections[0].reason).toBe("Error de destinatario")
  })

  it("corregir un comunicado publicado exige motivo", () => {
    const { result } = api()
    const published = result.current.state.announcements.find(
      (item) => item.state === "PUBLISHED",
    )!
    let response = { ok: true }
    act(() => {
      response = result.current.saveAnnouncement({
        id: published.id,
        title: "Otro título",
        body: published.body,
        audience: published.audience,
        publish: true,
      }) as { ok: boolean }
    })
    expect(response.ok).toBe(false)
  })

  it("publicar notifica sólo a los alcanzados por la audiencia", () => {
    const { result } = api()
    act(() => {
      result.current.saveAnnouncement({
        title: "Para una sola división",
        body: "Contenido",
        audience: { kind: "TEAMS", teamIds: ["quinta"] },
        publish: true,
      })
    })
    const notice = result.current.state.notifications[0]
    const shouldReach = (personId: string) =>
      result.current.state.teamAssignments.some(
        (assignment) =>
          assignment.personId === personId &&
          assignment.teamId === "quinta" &&
          !assignment.validUntil,
      )
    expect(notice.recipients.length).toBeGreaterThan(0)
    expect(notice.recipients.every(shouldReach)).toBe(true)
    expect(notice.recipients).not.toContain("coach")
  })
})