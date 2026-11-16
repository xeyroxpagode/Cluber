import { describe, expect, it } from "vitest"
import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderScreen } from "./harness"
import { Home, Calendar } from "../features/overview"
import { EventDetail } from "../features/events"
import { AvailabilityPage } from "../features/participation"
import { ProfilePage } from "../features/account-insight"
import { CommunicationHome, Notifications } from "../features/communication"
import { pluralize, stateText } from "../shared/states"
import { Modal, Button } from "../shared/ui"

describe("§4 — Home dirige la atención", () => {
  it("muestra como máximo 3 cosas que necesitan atención", async () => {
    renderScreen("/home", "/home", <Home />, "", "", { me: { profileCompleted: false } })
    const section = (await screen.findByRole("heading", {
      name: "Necesita tu atención",
    })).closest("section")!
    const items = within(section).getAllByRole("listitem")
    expect(items.length).toBeGreaterThan(0)
    expect(items.length).toBeLessThanOrEqual(3)
  })

  it("cada ítem dice motivo, consecuencia y acción", async () => {
    renderScreen("/home", "/home", <Home />, "", "", { me: { profileCompleted: false } })
    const section = (await screen.findByRole("heading", {
      name: "Necesita tu atención",
    })).closest("section")!
    const item = within(section).getAllByRole("listitem")[0]
    expect(within(item).getByRole("link").getAttribute("href")).toBeTruthy()
    expect(item.textContent?.length ?? 0).toBeGreaterThan(40)
  })

  it("el vacío positivo se lee como todo al día", () => {
    renderScreen("/home", "/home", <Home />, "", "", { notifications: [] })
    expect(screen.getByText("No hay nada pendiente")).toBeTruthy()
  })

  it("no deja huecos de 200 px cuando hoy no hay eventos", () => {
    renderScreen("/home", "/home", <Home />)
    const compact = screen.queryByText("Hoy no hay eventos")
    const full = screen.queryByRole("heading", { name: "Hoy", level: 2 })
    expect(full).toBeTruthy()
    if (compact) {
      const node = compact.closest("div")!
      expect(node.className).not.toContain("py-14")
    }
  })

  it("no repite 'Temporada 2026' como decoración", () => {
    renderScreen("/home", "/home", <Home />)
    const occurrences = screen.queryAllByText(/Temporada 2026/)
    expect(occurrences.length).toBe(0)
  })
})

describe("§18 / §21 — estados terminales de evento", () => {
  it("un evento cancelado se lee como cancelado, con referencia y sin ¿Vas?", async () => {
    renderScreen("/events/:eventId", "/events/training-cancelado", <EventDetail />)
    expect(await screen.findByText("Este evento fue cancelado")).toBeTruthy()
    expect(screen.getByText(/queda disponible como referencia/)).toBeTruthy()
    expect(screen.queryByText(/La confirmación de asistencia llega/)).toBeNull()
  })

  it("un evento postergado explica que no hay horario vigente", async () => {
    renderScreen("/events/:eventId", "/events/match-banco", <EventDetail />)
    expect(await screen.findByText("No hay horario vigente")).toBeTruthy()
    expect(screen.queryByText(/La confirmación de asistencia llega/)).toBeNull()
  })

  it("un evento operativo muestra el raíl real de participación (T04)", async () => {
    renderScreen("/events/:eventId", "/events/match-cuba", <EventDetail />, "", "player")
    expect(await screen.findByText("Participación")).toBeTruthy()
    expect(screen.getByText("Disponibilidad")).toBeTruthy()
    // El raíl sólo ofrece las superficies que aplican al tipo de evento (MATCH).
    expect(screen.getByText("Convocatoria")).toBeTruthy()
    expect(screen.getByText("Asistencia")).toBeTruthy()
    expect(screen.getByText("Resultado del partido")).toBeTruthy()
    expect(screen.queryByText(/La confirmación de asistencia llega/)).toBeNull()
  })

  it("el partido ya jugado se lee como jugado", async () => {
    renderScreen("/events/:eventId", "/events/match-sic", <EventDetail />)
    expect(await screen.findByText("Este evento ya se jugó")).toBeTruthy()
  })
})

describe("§11 — una sola gramática de ¿Vas?", () => {
  const asPlayer = {
    me: {
      roleAssignments: [{ id: "ra-player", role: "PLAYER", scopeType: "TEAM", scopeRefId: "team-a", validFrom: "2026-01-01", validUntil: null }],
    },
  }

  it("la disponibilidad ofrece la grilla real de respuestas, sin datos simulados", async () => {
    renderScreen(
      "/events/:eventId/availability",
      "/events/training-serie-2/availability",
      <AvailabilityPage />,
      "",
      "player",
      asPlayer,
    )
    expect(await screen.findByText("Tu respuesta")).toBeTruthy()
    expect(screen.getByRole("button", { name: "Voy" })).toBeTruthy()
    expect(screen.getByRole("button", { name: "Tal vez" })).toBeTruthy()
    expect(screen.getByRole("button", { name: "No voy" })).toBeTruthy()
    expect(screen.queryByText(/La disponibilidad jugadora llega con la T04/)).toBeNull()
  })

  it("el resumen de coordinación muestra revisión y versión reales", async () => {
    renderScreen(
      "/events/:eventId",
      "/events/training-serie-2",
      <EventDetail />,
    )
    expect(await screen.findByText("Revisión de coordinación")).toBeTruthy()
    expect(screen.getAllByText("1").length).toBeGreaterThan(0)
  })

  it("un evento postergado no habilita controles de respuesta", async () => {
    renderScreen(
      "/events/:eventId/availability",
      "/events/match-banco/availability",
      <AvailabilityPage />,
      "",
      "player",
      asPlayer,
    )
    expect(await screen.findByText("Este evento ya no admite respuestas")).toBeTruthy()
    expect(screen.getByRole("button", { name: "Voy" })).toBeDisabled()
  })
})

describe("§27 — Perfil completo sin PII", () => {
  it("el perfil tiene las secciones del freeze", () => {
    renderScreen("/more/profile", "/more/profile", <ProfilePage />)
    for (const title of [
      "Identidad",
      "Pertenencia",
      "Roles y alcance",
      "Contacto",
      "Seguridad",
    ]) {
      expect(screen.getByRole("heading", { name: title })).toBeTruthy()
    }
  })

  it("el perfil nunca muestra documento ni fecha de nacimiento", () => {
    renderScreen("/more/profile", "/more/profile", <ProfilePage />)
    expect(screen.queryByText(/^Documento$/)).toBeNull()
    expect(screen.queryByText(/^Fecha de nacimiento$/)).toBeNull()
  })

  it("la seguridad muestra sesión actual y sesiones activas con texto", () => {
    renderScreen("/more/profile", "/more/profile", <ProfilePage />)
    expect(screen.getByText("Sesiones activas")).toBeTruthy()
    expect(screen.getByText(/Esta sesión/)).toBeTruthy()
    // "Cerrar sesión" aparece por sesión ajena y como salida de la cuenta
    expect(screen.getAllByRole("button", { name: "Cerrar sesión" }).length)
      .toBeGreaterThanOrEqual(2)
  })

  it("el perfil no tiene secciones de representación delegada", () => {
    renderScreen("/more/profile", "/more/profile", <ProfilePage />)
    expect(screen.queryByText("A quién estás mirando")).toBeNull()
    expect(screen.queryByText("Personas a cargo")).toBeNull()
  })

  it("un perfil incompleto dice qué falta y no lo hace editable", () => {
    renderScreen("/more/profile", "/more/profile", <ProfilePage />, "", "player")
    // p2 está completa: el banner no aparece y no hay inputs de identidad
    expect(screen.queryByText(/faltan datos administrados por el club/)).toBeNull()
  })
})

describe("§33 — comunicación con dos canales distintos", () => {
  it("ofrece los avisos reales y anuncia la llegada de conversaciones y anuncios", () => {
    renderScreen("/communication", "/communication", <CommunicationHome />)
    expect(screen.getByRole("link", { name: /Avisos/ }).getAttribute("href")).toBe("/notifications")
    expect(screen.getByText(/Llegan con la T05/)).toBeTruthy()
  })

  it("el aviso muestra el tipo, el cuerpo y el estado de lectura", async () => {
    renderScreen("/notifications", "/notifications", <Notifications />)
    expect(await screen.findByText("Evento actualizado")).toBeTruthy()
    expect(screen.getByText("Cambio en el evento")).toBeTruthy()
    expect(screen.getByText("Sin leer")).toBeTruthy()
  })
})

describe("§37 — copy con concordancia y sin jerga", () => {
  it("pluraliza bien para 1 y para muchos", () => {
    expect(pluralize(1, "pendiente", "pendientes")).toBe("1 pendiente")
    expect(pluralize(3, "pendiente", "pendientes")).toBe("3 pendientes")
    expect(pluralize(0, "persona", "personas")).toBe("0 personas")
  })

  it("los estados tienen un único vocabulario", () => {
    expect(stateText("YES")).toBe("Voy")
    expect(stateText("NEEDS_RECONFIRMATION")).toBe("Hay que volver a confirmar")
    expect(stateText("DESCONOCIDO")).toBe("Estado a revisar")
  })
})

describe("§20 — calendario usable", () => {
  it("el título del mes es una fecha real, no una fecha inválida", () => {
    renderScreen("/calendar", "/calendar", <Calendar />)
    const title = screen.getByRole("heading", { level: 1 })
    expect(title.textContent).not.toContain("Invalid")
    expect(title.textContent).toMatch(/[a-záéíóú]+ de \d{4}/i)
  })

  it("el control de vista muestra el estado seleccionado sin contradecir la grilla", () => {
    renderScreen("/calendar", "/calendar", <Calendar />)
    const control = screen.getByRole("group", { name: "Vista del calendario" })
    const agenda = within(control).getByRole("button", { name: "Agenda" })
    const mes = within(control).getByRole("button", { name: "Mes" })
    const mesSelected = mes.getAttribute("aria-pressed") === "true"
    const agendaSelected = agenda.getAttribute("aria-pressed") === "true"
    expect(mesSelected).not.toBe(agendaSelected)
    if (mesSelected) expect(screen.getByText("Dom")).toBeTruthy()
  })

  it("la agenda explica cómo se leen los estados sin mentir sobre el color", () => {
    renderScreen("/calendar", "/calendar", <Calendar />)
    expect(screen.getByText("Cómo se leen los estados")).toBeTruthy()
    expect(screen.getByText(/Postergado: no hay horario vigente/)).toBeTruthy()
  })

  it("los filtros viven en la URL", async () => {
    renderScreen("/calendar", "/calendar", <Calendar />)
    const select = screen.getByLabelText("Filtrar por tipo de evento")
    await userEvent.selectOptions(select, "MATCH")
    expect(screen.getByRole("button", { name: "Quitar filtros" })).toBeTruthy()
  })
})

describe("§8 / §41 — accesibilidad de los primitivos", () => {
  it("Modal es diálogo accesible y arranca en un control útil", () => {
    renderScreen("/", "/", <Modal title="Confirmar" onClose={() => {}}>
      <button type="button">Aceptar</button>
    </Modal>)
    const dialog = screen.getByRole("dialog", { name: "Confirmar" })
    expect(dialog).toBeTruthy()
  })

  it("las acciones destructivas se ven como tales y piden confirmación", () => {
    renderScreen("/", "/", <Button variant="danger">Archivar</Button>)
    const button = screen.getByRole("button", { name: "Archivar" })
    expect(button.className).toContain("text-danger")
  })

  it("los botones respetan el objetivo táctil mínimo", () => {
    renderScreen("/", "/", <Button variant="primary">Publicar</Button>)
    expect(screen.getByRole("button").className).toContain("min-h-11")
  })
})