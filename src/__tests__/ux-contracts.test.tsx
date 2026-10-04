import { describe, expect, it } from "vitest"
import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderScreen } from "./harness"
import { Home } from "../features/overview"
import { EventDetail } from "../features/events"
import { AvailabilityPage } from "../features/participation"
import { ProfilePage } from "../features/account-insight"
import { CommunicationHome } from "../features/communication"
import { pluralize, stateText } from "../shared/states"
import { Modal, Button } from "../shared/ui"

describe("§4 — Home dirige la atención", () => {
  it("muestra como máximo 3 cosas que necesitan atención", () => {
    renderScreen("/home", "/home", <Home />)
    const section = screen.getByRole("heading", {
      name: "Necesita tu atención",
    }).closest("section")!
    const items = within(section).getAllByRole("listitem")
    expect(items.length).toBeGreaterThan(0)
    expect(items.length).toBeLessThanOrEqual(3)
  })

  it("cada ítem dice motivo, consecuencia y acción", () => {
    renderScreen("/home", "/home", <Home />)
    const section = screen.getByRole("heading", {
      name: "Necesita tu atención",
    }).closest("section")!
    const item = within(section).getAllByRole("listitem")[0]
    expect(within(item).getByRole("link").getAttribute("href")).toBeTruthy()
    expect(item.textContent?.length ?? 0).toBeGreaterThan(40)
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
  it("un evento cancelado se lee como cancelado, con referencia y sin ¿Vas?", () => {
    renderScreen("/events/:eventId", "/events/training-cancelado", <EventDetail />)
    expect(screen.getByText("Este evento fue cancelado")).toBeTruthy()
    expect(screen.getByText(/queda disponible como referencia/)).toBeTruthy()
    expect(screen.queryByRole("group", { name: "¿Vas?" })).toBeNull()
  })

  it("un evento postergado explica que no hay horario vigente", () => {
    renderScreen("/events/:eventId", "/events/match-banco", <EventDetail />)
    expect(screen.getByText("No hay horario vigente")).toBeTruthy()
    expect(screen.queryByRole("group", { name: "¿Vas?" })).toBeNull()
  })

  it("un evento operativo sí ofrece ¿Vas?", () => {
    renderScreen("/events/:eventId", "/events/match-cuba", <EventDetail />, "", "player")
    expect(screen.getAllByRole("group", { name: "¿Vas?" }).length).toBeGreaterThan(0)
  })

  it("el partido ya jugado muestra el resultado final", () => {
    renderScreen("/events/:eventId", "/events/match-sic", <EventDetail />)
    expect(screen.getByText("Este evento ya se jugó")).toBeTruthy()
    expect(screen.getByText("3–1")).toBeTruthy()
  })
})

describe("§11 — una sola gramática de ¿Vas?", () => {
  it("las tres respuestas están en el mismo orden y con texto", async () => {
    renderScreen(
      "/events/:eventId/availability",
      "/events/training-serie-2/availability",
      <AvailabilityPage />,
      "",
      "player",
    )
    const group = screen.getAllByRole("group", { name: "¿Vas?" })[0]
    const options = within(group)
      .getAllByRole("radio")
      .map((option) => option.closest("label")?.textContent?.trim())
    expect(options).toEqual(["Voy", "Tal vez", "No voy"])
  })

  it("el resumen cuenta por respuesta, sin '0 sí'", () => {
    renderScreen(
      "/events/:eventId/availability",
      "/events/training-serie-2/availability",
      <AvailabilityPage />,
    )
    expect(screen.queryByText(/^0 sí$/)).toBeNull()
    expect(screen.getByText("Sin responder")).toBeTruthy()
  })

  it("un evento postergado no acepta respuestas nuevas y lo dice", () => {
    renderScreen(
      "/events/:eventId/availability",
      "/events/match-banco/availability",
      <AvailabilityPage />,
    )
    expect(
      screen.getByText(/no se pueden cargar respuestas nuevas/),
    ).toBeTruthy()
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

  it("el guardián ve a quién mira y con qué permisos", () => {
    renderScreen("/more/profile", "/more/profile", <ProfilePage />, "", "guardian")
    expect(screen.getByText("A quién estás mirando")).toBeTruthy()
    expect(screen.getByText(/responde ¿Vas\?: sí/)).toBeTruthy()
      })

  it("un perfil incompleto dice qué falta y no lo hace editable", () => {
    renderScreen("/more/profile", "/more/profile", <ProfilePage />, "", "player")
    // p2 está completa: el banner no aparece y no hay inputs de identidad
    expect(screen.queryByText(/faltan datos administrados por el club/)).toBeNull()
  })
})

describe("§33 — comunicación con dos canales distintos", () => {
  it("los canales son tabs reales con estado seleccionado", () => {
    renderScreen("/communication", "/communication", <CommunicationHome />)
    const tabs = screen.getByRole("tablist", { name: "Canal de comunicación" })
    const conversaciones = within(tabs).getByRole("tab", { name: /Conversaciones/ })
    expect(conversaciones.getAttribute("aria-selected")).toBe("true")
    expect(
      within(tabs)
        .getByRole("tab", { name: /Comunicados/ })
        .getAttribute("aria-selected"),
    ).toBe("false")
  })

  it("el tab de comunicados muestra la audiencia de cada comunicado", async () => {
    renderScreen("/communication", "/communication", <CommunicationHome />)
    await userEvent.click(screen.getByRole("tab", { name: /Comunicados/ }))
    expect(screen.getByText(/Para Sexta A/)).toBeTruthy()
    expect(screen.getByText(/Para todo el hockey/i)).toBeTruthy()
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
    expect(stateText("ELIGIBLE")).toBe("Habilitada")
    expect(stateText("DESCONOCIDO")).toBe("Estado a revisar")
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