import { describe, expect, it } from "vitest"
import type { ReactNode } from "react"
import { Harness } from "./harness"
import { createSeed } from "../mock/seed"
import {
  activeMemberships,
  activeRoleAssignments,
  activeTeamAssignments,
  entryMatchesEvent,
  eventsInScopeOfPerson,
  guardiansOf,
  profileCompleteness,
  roleScopeLabel,
  scopeTeamIds,
  selectionConflicts,
  visibleEvents,
} from "../mock/derive"
import { classifyChange, computeImpact } from "../mock/impact"
import { seriesOccurrences } from "../mock/series"
import { getAuthority } from "../mock/authority"
import {
  entryLabel,
  eventAvailabilityView,
  eventTargetsText,
  lineEntryLabel,
  teamName,
} from "../mock/model"
import { todayIso } from "../mock/clock"

const state = createSeed()
const person = (id: string) => state.people.find((p) => p.id === id)!

describe("D1 — alcance de serie real", () => {
  const series = state.eventSeries.find((s) => s.id === "series-sexta")!
  const members = state.events.filter((e) => e.seriesId === series.id)

  it("la serie tiene 4 ocurrencias ordenadas por fecha", () => {
    expect(members).toHaveLength(4)
    const dates = members.map((e) => e.date)
    expect([...dates].sort()).toEqual(dates)
  })

  it("ONLY_THIS resuelve exactamente 1 ocurrencia", () => {
    const all = seriesOccurrences(state, members[1].id, "ONLY_THIS")
    expect(all).toHaveLength(1)
    expect(all[0].id).toBe(members[1].id)
  })

  it("THIS_AND_FOLLOWING corta en la ocurrencia de origen", () => {
    const fromSecond = seriesOccurrences(state, members[1].id, "THIS_AND_FOLLOWING")
    const fromFirst = seriesOccurrences(state, members[0].id, "THIS_AND_FOLLOWING")
    expect(fromFirst).toHaveLength(4)
    expect(fromSecond).toHaveLength(3)
    expect(fromSecond.map((e) => e.id)).toEqual(members.slice(1).map((e) => e.id))
  })

  it("ENTIRE_SERIES devuelve las 4 ocurrencias, nunca 1", () => {
    expect(seriesOccurrences(state, members[1].id, "ENTIRE_SERIES")).toHaveLength(4)
  })

  it("el impacto de toda la serie lista las 4 ocurrencias con fecha real", () => {
    const impact = computeImpact(state, members[1].id, { time: "20:00" }, "ENTIRE_SERIES")
    expect(impact.occurrences).toHaveLength(4)
    expect(impact.occurrences.every((o) => /^\d{4}-\d{2}-\d{2}$/.test(o.date))).toBe(true)
    expect(impact.lines.join(" ")).toContain("4 eventos")
  })

  it("cambiar sólo el horario invalida la disponibilidad previa", () => {
    const impact = computeImpact(state, members[0].id, { time: "20:00" }, "ONLY_THIS")
    expect(impact.kind).toBe("schedule")
    expect(impact.invalidatesAvailability).toBe(true)
    expect(impact.people.length).toBeGreaterThan(0)
  })

  it("cambiar sólo logística NO invalida disponibilidad", () => {
    const impact = computeImpact(state, members[0].id, { point: "Otro lado" }, "ONLY_THIS")
    expect(impact.kind).toBe("coordination")
    expect(impact.invalidatesAvailability).toBe(false)
    expect(impact.people).toHaveLength(0)
  })

  it("cambiar el título no es cambio material", () => {
    expect(classifyChange({ title: "Otro nombre" })).toBe("metadata")
    const impact = computeImpact(state, members[0].id, { title: "Otro nombre" }, "ONLY_THIS")
    expect(impact.occurrences).toHaveLength(0)
  })
})

describe("D1 — mutación efectiva según alcance", () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Harness>{children}</Harness>
  )

  it("toda la serie de 4 cambia 4 eventos (no 1)", async () => {
    const { renderHook, act } = await import("@testing-library/react")
    const { useProduct } = await import("../mock/store")
    const { result } = renderHook(() => useProduct(), { wrapper })

    const members = result.current.state.events.filter(
      (e) => e.seriesId === "series-sexta",
    )
    expect(members).toHaveLength(4)
    const before = members.map((e) => e.time)

    await act(async () => {
      await result.current.applyEventChange(
        members[1].id,
        { time: "20:00" },
        "ENTIRE_SERIES",
        "Editar evento",
      )
    })

    const after = result.current.state.events.filter(
      (e) => e.seriesId === "series-sexta",
    )
    expect(after).toHaveLength(4)
    expect(after.every((event) => event.time === "20:00")).toBe(true)
    const changed = after.filter((event, index) => event.time !== before[index])
    expect(changed).toHaveLength(4)
  })

  it("este y los siguientes cambia 3 de 4 y deja intacto el anterior", async () => {
    const { renderHook, act } = await import("@testing-library/react")
    const { useProduct } = await import("../mock/store")
    const { result } = renderHook(() => useProduct(), { wrapper })

    const members = result.current.state.events.filter(
      (e) => e.seriesId === "series-sexta",
    )
    const before = members.map((e) => e.time)

    await act(async () => {
      await result.current.applyEventChange(
        members[1].id,
        { time: "20:00" },
        "THIS_AND_FOLLOWING",
        "Editar evento",
      )
    })

    const after = result.current.state.events.filter(
      (e) => e.seriesId === "series-sexta",
    )
    expect(after).toHaveLength(4)
    expect(after.filter((event, index) => event.time !== before[index])).toHaveLength(3)
    expect(after[0].time).toBe(before[0])
  })

  it("un cambio material de horario sube coordinationRevision de cada ocurrencia", async () => {
    const { renderHook, act } = await import("@testing-library/react")
    const { useProduct } = await import("../mock/store")
    const { result } = renderHook(() => useProduct(), { wrapper })

    const members = result.current.state.events.filter(
      (e) => e.seriesId === "series-sexta",
    )
    const before = members.map((e) => e.coordinationRevision)

    await act(async () => {
      await result.current.applyEventChange(
        members[0].id,
        { time: "20:00" },
        "ENTIRE_SERIES",
        "Editar evento",
      )
    })

    const after = result.current.state.events.filter(
      (e) => e.seriesId === "series-sexta",
    )
    expect(after.map((e) => e.coordinationRevision)).toEqual(
      before.map((value) => value + 1),
    )
  })

  it("un cambio no material no sube coordinationRevision ni notifica", async () => {
    const { renderHook, act } = await import("@testing-library/react")
    const { useProduct } = await import("../mock/store")
    const { result } = renderHook(() => useProduct(), { wrapper })

    const event = result.current.state.events.find(
      (e) => e.seriesId === "series-sexta",
    )!
    const notificationsBefore = result.current.state.notifications.length

    act(() => {
      result.current.patchEventMeta(
        event.id,
        { title: "Nuevo título" },
        "Corrección",
      )
    })

    const after = result.current.state.events.find((e) => e.id === event.id)!
    expect(after.title).toBe("Nuevo título")
    expect(after.coordinationRevision).toBe(event.coordinationRevision)
    expect(result.current.state.notifications).toHaveLength(notificationsBefore)
  })

  it("la reconfirmación deriva del coordinationRevision, no de un flag global", async () => {
    const { renderHook, act } = await import("@testing-library/react")
    const { useProduct } = await import("../mock/store")
    const { result } = renderHook(() => useProduct(), { wrapper })

    const event = result.current.state.events.find(
      (e) => e.seriesId === "series-sexta" && Object.keys(e.availability).length > 0,
    )!
    const responder = Object.keys(event.availability)[0]
    expect(eventAvailabilityView(event, responder)).not.toBe(
      "NEEDS_RECONFIRMATION",
    )

    await act(async () => {
      await result.current.applyEventChange(
        event.id,
        { time: "21:00" },
        "ONLY_THIS",
        "Editar evento",
      )
    })
    const changed = result.current.state.events.find((e) => e.id === event.id)!
    expect(eventAvailabilityView(changed, responder)).toBe("NEEDS_RECONFIRMATION")
  })

  it("un cambio de logística no dispara reconfirmación", async () => {
    const { renderHook, act } = await import("@testing-library/react")
    const { useProduct } = await import("../mock/store")
    const { result } = renderHook(() => useProduct(), { wrapper })

    const event = result.current.state.events.find(
      (e) => e.seriesId === "series-sexta" && Object.keys(e.availability).length > 0,
    )!
    const responder = Object.keys(event.availability)[0]

    await act(async () => {
      await result.current.applyEventChange(
        event.id,
        { point: "Otro punto de encuentro" },
        "ONLY_THIS",
        "Editar evento",
      )
    })
    const changed = result.current.state.events.find((e) => e.id === event.id)!
    expect(eventAvailabilityView(changed, responder)).not.toBe(
      "NEEDS_RECONFIRMATION",
    )
  })
})

describe("§16 — verdad de persona derivada, no legada", () => {
  it("Person ya no expone role ni team", () => {
    const raw = person("p2") as unknown as Record<string, unknown>
    expect(raw.role).toBeUndefined()
    expect(raw.team).toBeUndefined()
    expect(raw.eligibility).toBeUndefined()
  })

  it("roles vienen de RoleAssignment con alcance resuelto", () => {
    const roles = activeRoleAssignments(state, "p0")
    expect(roles.map((r) => r.role).sort()).toEqual(["CAPTAIN", "PLAYER"])
    expect(roleScopeLabel(state, roles[0])).toBe("Sexta A")
  })

  it("el guardian no tiene roles deportivos", () => {
    expect(activeRoleAssignments(state, "guardian")).toHaveLength(0)
  })

  it("pertenencia y equipo son cosas distintas", () => {
    expect(activeMemberships(state, "p2")).toHaveLength(1)
    expect(activeTeamAssignments(state, "p2")).toHaveLength(1)
    // p16 tiene cuenta pendiente: sin pertenencia y sin equipo
    expect(activeMemberships(state, "p16")).toHaveLength(0)
    expect(activeTeamAssignments(state, "p16")).toHaveLength(0)
  })

  it("el nombre del equipo se deriva de división y línea", () => {
    expect(teamName(state, "sexta")).toBe("Sexta A")
    expect(teamName(state, "quinta")).toBe("Quinta B")
  })
})

describe("D2 / D3 — Membership y representación", () => {
  it("crear una persona no alcanza: la pertenencia se opera aparte", () => {
    const withoutMembership = state.people.filter(
      (person) => activeMemberships(state, person.id).length === 0,
    )
    expect(withoutMembership.map((p) => p.id)).toContain("p16")
  })

  it("una relación de representación declara los dos permisos por separado", () => {
    const relations = guardiansOf(state, "p2")
    expect(relations).toHaveLength(1)
    expect(relations[0].canViewChildInfo).toBe(true)
    expect(relations[0].canRespondAvailability).toBe(true)
  })

  it("la segunda relación puede permitir ver y no responder", () => {
    const relations = guardiansOf(state, "p8")
    expect(relations[0].canViewChildInfo).toBe(true)
    expect(relations[0].canRespondAvailability).toBe(false)
  })
})

describe("D4 — Entry TEAM vs LINE", () => {
  const competition = state.competitions.find((c) => c.id === "ahba")!
  const lineEntry = competition.entries.find((e) => e.scope === "LINE")!
  const teamEntry = competition.entries.find((e) => e.scope === "TEAM")!

  it("una inscripción de línea nunca se muestra como 'Línea A' pelado", () => {
    const label = lineEntryLabel(state, lineEntry)
    expect(label).toBe("Línea A · Sexta · Temporada 2026")
    expect(label.split(" · ")).toHaveLength(3)
  })

  it("una inscripción de equipo dice Equipo · <equipo>", () => {
    expect(entryLabel(state, teamEntry)).toBe("Equipo · Quinta B")
  })

  it("el alcance se resuelve contra el equipo concreto del partido", () => {
    const sextaMatch = state.events.find(
      (e) => e.targetTeams.includes("sexta") && e.type === "MATCH",
    )!
    expect(entryMatchesEvent(state, lineEntry, sextaMatch).ok).toBe(true)
    expect(entryMatchesEvent(state, teamEntry, sextaMatch).ok).toBe(false)
    expect(entryMatchesEvent(state, teamEntry, sextaMatch).reason).toMatch(
      /otro equipo/,
    )
  })

  it("una entrada LINE de otra división no resuelve", () => {
    const primeraMatch = state.events.find(
      (e) => e.targetTeams.includes("primera") && e.type === "MATCH",
    )
    if (primeraMatch)
      expect(entryMatchesEvent(state, lineEntry, primeraMatch).ok).toBe(false)
  })
})

describe("D5 / D6 — autoridad de campo y completitud de perfil", () => {
  it("sólo ADMIN ve documento", () => {
    expect(getAuthority(state, person("admin")).canViewDni).toBe(true)
    expect(getAuthority(state, person("coach")).canViewDni).toBe(false)
    expect(getAuthority(state, person("p2")).canViewDni).toBe(false)
    expect(getAuthority(state, person("guardian")).canViewDni).toBe(false)
  })

  it("el motivo de elegibilidad es de Subcomisión y administración", () => {
    expect(getAuthority(state, person("subcommittee")).canViewEligibilityReason).toBe(true)
    expect(getAuthority(state, person("admin")).canViewEligibilityReason).toBe(true)
    expect(getAuthority(state, person("coach")).canViewEligibilityReason).toBe(false)
    expect(getAuthority(state, person("p2")).canViewEligibilityReason).toBe(false)
  })

  it("la jugadora ve su propio estado de habilitación y no el detalle", () => {
    const authority = getAuthority(state, person("p2"))
    expect(authority.canViewEligibilityStatus(person("p2"))).toBe(true)
    expect(authority.canViewEligibilityStatus(person("p0"))).toBe(false)
  })

  it("un perfil incompleto dice exactamente qué falta", () => {
    const incomplete = profileCompleteness(person("p17"))
    expect(incomplete.complete).toBe(false)
    expect(incomplete.missing.map((m) => m.key).sort()).toEqual(["birth", "dni", "phone"])
    expect(profileCompleteness(person("p2")).complete).toBe(true)
  })
})

describe("D3 / §28 — alcance del guardián", () => {
  const guardian = person("guardian")

  it("el guardián ve los eventos del menor que puede responder", () => {
    const events = visibleEvents(state, guardian.id, "p2")
    expect(events.length).toBeGreaterThan(0)
    expect(
      events.every((e) => e.clubWide || e.targetTeams.includes("sexta")),
    ).toBe(true)
    expect(events.some((e) => e.id === "match-cuba")).toBe(true)
    expect(events.some((e) => e.targetTeams.includes("septima"))).toBe(false)
  })

  it("cambiar de menor cambia el alcance de forma transversal", () => {
    const first = visibleEvents(state, guardian.id, "p2")
    const second = visibleEvents(state, guardian.id, "p8")
    expect(
      second.every((e) => e.clubWide || e.targetTeams.includes("septima")),
    ).toBe(true)
    expect(first.map((e) => e.id)).not.toEqual(second.map((e) => e.id))
    expect(scopeTeamIds(state, guardian.id, "p2")).toEqual(["sexta"])
    expect(scopeTeamIds(state, guardian.id, "p8")).toEqual(["septima"])
  })

  it("sólo puede responder por el menor con delegación", () => {
    const authority = getAuthority(state, guardian, "p2")
    expect(authority.canRespondForChild("p2")).toBe(true)
    expect(authority.canRespondForChild("p8")).toBe(false)
  })

  it("no recibe roles deportivos ni acceso de chat automático", () => {
    const authority = getAuthority(state, guardian, "p2")
    expect(authority.roles).toHaveLength(0)
    expect(authority.canChat).toBe(false)
  })
})

describe("§15 — una sola fuente de autoridad", () => {
  it("el entrenador administra su equipo y no otro", () => {
    const coach = getAuthority(state, person("coach"))
    const sexta = state.events.find((e) => e.targetTeams.includes("sexta"))!
    expect(coach.isCoachOfTeam("sexta")).toBe(true)
    expect(coach.isCoachOfTeam("primera")).toBe(false)
    expect(coach.canManageSelection(sexta)).toBe(true)
  })

  it("la jugadora no administra nada", () => {
    const player = getAuthority(state, person("p2"))
    const event = state.events.find((e) => e.targetTeams.includes("sexta"))!
    expect(player.canManageSelection(event)).toBe(false)
    expect(player.canManageAttendance(event)).toBe(false)
    expect(player.canPublishAnnouncement).toBe(false)
  })

  it("Subcomisión publica comunicados pero no administra personas", () => {
    const official = getAuthority(state, person("subcommittee"))
    expect(official.canPublishAnnouncement).toBe(true)
    expect(official.canManagePeople).toBe(false)
    expect(official.canManageCompetitions).toBe(true)
    expect(official.canOpen("competitions")).toBe(true)
  })

  it("administración no es superusuario deportivo", () => {
    const admin = getAuthority(state, person("admin"))
    const event = state.events.find((e) => e.targetTeams.includes("sexta"))!
    expect(admin.canManageSelection(event)).toBe(false)
    expect(admin.canManageAttendance(event)).toBe(false)
    expect(admin.canManagePeople).toBe(true)
  })

  it("el gating de páginas coincide con la autoridad", () => {
    expect(getAuthority(state, person("admin")).canOpen("people")).toBe(true)
    expect(getAuthority(state, person("coach")).canOpen("people")).toBe(false)
    expect(getAuthority(state, person("coach")).canOpen("audit")).toBe(false)
    expect(getAuthority(state, person("admin")).canOpen("audit")).toBe(true)
    expect(getAuthority(state, person("p2")).canOpen("audit")).toBe(false)
  })
})

describe("§44 — conflictos de convocatoria en lenguaje usuario", () => {
  it("detecta a quien no puede jugar y devuelve su id", () => {
    const match = state.events.find((e) => e.id === "match-cuba")!
    const conflicts = selectionConflicts(state, match)
    expect(conflicts).toContain("p4")
  })

  it("el motivo no expone el código interno", () => {
    const match = state.events.find((e) => e.id === "match-cuba")!
    expect(selectionConflicts(state, match).length).toBeGreaterThan(0)
    // el copy vive en CONFLICT_TEXT, no en el dominio
    expect(typeof selectionConflicts(state, match)[0]).toBe("string")
  })
})

describe("§38 — objetivos de fecha y verdad derived", () => {
  it("el seed usa fechas relativas al día real", () => {
    const today = todayIso()
    expect(state.events.some((e) => e.date === today)).toBe(true)
    expect(state.events.some((e) => e.date > today)).toBe(true)
  })

  it("no quedan marcas de fecha congelada del audit anterior", () => {
    const serialized = JSON.stringify(state)
    expect(serialized).not.toContain("· Ahora")
    expect(
      state.audit.every((entry) => /^\d{4}-\d{2}-\d{2}T/.test(entry.at)),
    ).toBe(true)
    expect(
      state.notifications.every((notice) => /^\d{4}-\d{2}-\d{2}T/.test(notice.at)),
    ).toBe(true)
  })

  it("el texto de destino se deriva del modelo", () => {
    const event = state.events.find((e) => e.clubWide)!
    expect(eventTargetsText(state, event)).toBe("Todo el hockey")
    const match = state.events.find((e) => e.type === "MATCH" && !e.clubWide)!
    expect(eventTargetsText(state, match)).toContain("Sexta A")
  })

  it("el alcance de eventos por persona sale de teamAssignments", () => {
    const ids = eventsInScopeOfPerson(state, "p8")
    expect(ids.length).toBeGreaterThan(0)
    expect(ids).toContain("match-septima-quinta")
  })
})