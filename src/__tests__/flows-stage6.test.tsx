import { describe, expect, it } from "vitest"
import { renderHook, act } from "@testing-library/react"
import type { ReactNode } from "react"
import { Harness, renderScreen } from "./harness"
import { useProduct } from "../mock/store"
import { JornadaPage } from "../features/events"
import { PersonAdminDetail, CompetitionsPage, TeamAdmin } from "../features/management"
import { screen } from "@testing-library/react"

const wrapper = ({ children }: { children: ReactNode }) => (
  <Harness>{children}</Harness>
)

function api() {
  return renderHook(() => useProduct(), { wrapper })
}

describe("C08 — jornada real", () => {
  it("rechaza una jornada sin partidos y lo explica", () => {
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

  it("rechaza un entrenamiento dentro de una jornada", () => {
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

  it("rechaza un partido de otra temporada", () => {
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

  it("crea la jornada con los partidos elegidos y no toca el ciclo de los eventos", () => {
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

  it("la pantalla de alta explica la regla de temporada y competencia", async () => {
    renderScreen("/jornadas/new", "/jornadas/new", <JornadaPage />)
    expect(await screen.findByText(/Cada partido conserva su propio ciclo de vida/)).toBeTruthy()
    expect(screen.getByRole("button", { name: /Crear jornada/ })).toBeTruthy()
  })
})

describe("C06 — ficha administrativa V1.1, sin habilitación", () => {
  it("la Subcomisión no abre fichas de personas", () => {
    window.history.replaceState({}, "", "/?demo=subcommittee")
    renderScreen(
      "/management/people/:id",
      "/management/people/p4",
      <PersonAdminDetail />,
    )
    expect(
      screen.getByText("No tenés acceso a las fichas de personas"),
    ).toBeTruthy()
    window.history.replaceState({}, "", "/")
  })

  it("la ficha no tiene sección de habilitación ni de representación", () => {
    window.history.replaceState({}, "", "/?demo=admin")
    renderScreen(
      "/management/people/:id",
      "/management/people/p4",
      <PersonAdminDetail />,
    )
    const tabs = screen.getByRole("tablist", { name: "Secciones de la ficha" })
    expect(tabs).toBeTruthy()
    expect(screen.queryByRole("tab", { name: "Habilitación" })).toBeNull()
    expect(screen.queryByRole("tab", { name: "Representación" })).toBeNull()
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
describe("V1.1 — login por email, competencia simple, jornada opcional", () => {
  it("el login usa Person.email más contraseña, nunca username", () => {
    const { result } = api()
    let ok = false
    act(() => {
      ok = result.current.login("tomas.beltran@gei.com.ar", "cualquiera")
    })
    expect(ok).toBe(true)
    expect(result.current.actor.id).toBe("coach")
  })

  it("el username no autentica aunque exista", () => {
    const { result } = api()
    let ok = true
    act(() => {
      ok = result.current.login("tomas.beltran", "cualquiera")
    })
    expect(ok).toBe(false)
  })

  it("sin contraseña no hay login", () => {
    const { result } = api()
    let ok = true
    act(() => {
      ok = result.current.login("tomas.beltran@gei.com.ar", "")
    })
    expect(ok).toBe(false)
  })

  it("la competencia se crea, se edita y se archiva; archivada es sólo lectura", () => {
    const { result } = api()
    let id = ""
    act(() => {
      id = result.current.createCompetition({
        name: "Copa de prueba",
        organizer: "Club",
      })
    })
    expect(id).toBeTruthy()
    let edited = { ok: false }
    act(() => {
      edited = result.current.updateCompetition(id, { name: "Copa de prueba 2" })
    })
    expect(edited.ok).toBe(true)
    let archived = { ok: false }
    act(() => {
      archived = result.current.archiveCompetition(id, "Fin de la prueba")
    })
    expect(archived.ok).toBe(true)
    const stored = result.current.state.competitions.find((c) => c.id === id)!
    expect(stored.archivedAt).toBeTruthy()
    let again = { ok: true }
    act(() => {
      again = result.current.updateCompetition(id, { name: "Otro nombre" })
    })
    expect(again.ok).toBe(false)
  })

  it("la jornada admite competencia opcional", () => {
    const { result } = api()
    let response: { ok: boolean; id?: string; error?: string } = { ok: false }
    act(() => {
      response = result.current.createJornada({
        name: "Fecha sin competencia",
        seasonId: "s1",
        competitionId: null,
        eventIds: ["match-septima-quinta"],
      })
    })
    expect(response.ok).toBe(true)
    const jornada = result.current.state.jornadas.find(
      (item) => item.id === response.id,
    )!
    expect(jornada.competitionId).toBeNull()
  })
})

describe("V1.1 — competencias simples y equipo admin renderizan", () => {
  it("la lista muestra las competencias activas y el detalle su contexto", () => {
    window.history.replaceState({}, "", "/?demo=admin")
    renderScreen(
      "/management/competitions",
      "/management/competitions",
      <CompetitionsPage />,
    )
    expect(screen.getByText(/Torneo AHBA/)).toBeTruthy()
    window.history.replaceState({}, "", "/")
  })

  it("el detalle de competencia lista jornadas y partidos que la referencian", () => {
    window.history.replaceState({}, "", "/?demo=admin")
    renderScreen(
      "/management/competitions/:id",
      "/management/competitions/ahba",
      <CompetitionsPage />,
    )
    expect(screen.getByRole("heading", { name: "Jornadas" })).toBeTruthy()
    expect(screen.getByRole("heading", { name: "Partidos" })).toBeTruthy()
    window.history.replaceState({}, "", "/")
  })

  it("el equipo admin muestra identidad y personas sin inscripciones", () => {
    window.history.replaceState({}, "", "/?demo=admin")
    renderScreen("/management/teams/:id", "/management/teams/sexta", <TeamAdmin />)
    expect(screen.getAllByText("Sexta A").length).toBeGreaterThan(0)
    expect(screen.queryByText(/Inscripciones/)).toBeNull()
    window.history.replaceState({}, "", "/")
  })
})
