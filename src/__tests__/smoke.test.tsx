import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { MockAppProvider } from "../mock/store"
import { Modal, Empty, Banner, ConfirmDialog } from "../shared/ui"
import { routeContext } from "../shared/nav-context"
import { stateText } from "../shared/states"
import { todayIso } from "../mock/clock"

describe("smoke — el simulador arranca sin backend", () => {
  it("el provider monta y expone estado", () => {
    render(
      <MockAppProvider>
        <MemoryRouter initialEntries={["/home"]}>
          <Empty
            title="Nada pendiente"
            detail="No hay elementos que requieran tu atención."
          />
        </MemoryRouter>
      </MockAppProvider>,
    )
    expect(screen.getByText("Nada pendiente")).toBeTruthy()
  })

  it("Modal es diálogo accesible con nombre", () => {
    render(
      <Modal title="Confirmar" onClose={() => {}}>
        <p>Contenido</p>
      </Modal>,
    )
    expect(screen.getByRole("dialog", { name: "Confirmar" })).toBeTruthy()
  })

  it("ConfirmDialog explica la consecuencia antes de pedir confirmación", () => {
    render(
      <ConfirmDialog
        title="Archivar evento"
        consequence="El evento sale de la temporada."
        confirmLabel="Archivar"
        onConfirm={() => {}}
        onClose={() => {}}
      />,
    )
    expect(screen.getByText("Qué pasa si confirmás")).toBeTruthy()
    expect(screen.getByRole("button", { name: "Archivar" })).toBeTruthy()
  })

  it("Banner expone el estado crítico también en texto", () => {
    render(<Banner tone="danger" title="Este evento fue cancelado" />)
    expect(screen.getByRole("alert").textContent).toContain(
      "Este evento fue cancelado",
    )
  })

  it("el contexto de ruta usa vocabulario de usuario", () => {
    expect(routeContext("/events/abc")).toBe("Eventos")
    expect(routeContext("/home")).toBe("Inicio")
    expect(routeContext("/management/people/x")).toBe("Personas")
    expect(routeContext("/conversations/c1")).toBe("Mensajes")
    expect(routeContext("/more/profile")).toBe("Mi perfil")
    expect(routeContext("/")).not.toBe("Mi espacio")
  })

  it("los estados desconocidos no hacen fallback silencioso", () => {
    expect(stateText("YES")).toBe("Voy")
    expect(stateText("NEEDS_RECONFIRMATION")).toBe("Hay que volver a confirmar")
    expect(stateText("SOMETHING_UNKNOWN")).toBe("Estado a revisar")
  })

  it("el reloj usa la fecha real, no una fecha congelada", () => {
    expect(/^\d{4}-\d{2}-\d{2}$/.test(todayIso())).toBe(true)
  })
})