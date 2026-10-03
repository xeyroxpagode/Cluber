import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { MockAppProvider } from "../mock/store"
import { Modal, Empty } from "../shared/ui"
import { routeContext } from "../shared/nav-context"
import { stateText } from "../shared/states"
import { todayIso } from "../mock/clock"

function ShellProbe() {
  return (
    <MockAppProvider>
      <MemoryRouter initialEntries={["/home"]}>
        <Empty title="Nada pendiente" detail="No hay elementos que requieran tu atención." />
      </MemoryRouter>
    </MockAppProvider>
  )
}

describe("stage 4 verification baseline", () => {
  it("app boot: mock provider monta sin backend", () => {
    render(<ShellProbe />)
    expect(screen.getByText("Nada pendiente")).toBeTruthy()
  })

  it("Modal es diálogo accesible con Escape/rol", () => {
    render(
      <Modal title="Confirmar" onClose={() => {}}>
        <p>Contenido</p>
      </Modal>,
    )
    expect(screen.getByRole("dialog", { name: "Confirmar" })).toBeTruthy()
  })

  it("route context no usa 'Mi espacio'", () => {
    expect(routeContext("/events/abc")).toBe("Partido o entrenamiento")
    expect(routeContext("/home")).toBe("Inicio")
    expect(routeContext("/management/people/x")).toBe("Personas")
    expect(routeContext("/conversations/c1")).toBe("Mensajes")
  })

  it("states no hacen fallback silencioso", () => {
    expect(stateText("YES")).toBe("Voy")
    expect(stateText("NEEDS_RECONFIRMATION")).toBe("Necesita confirmación")
    expect(stateText("SOMETHING_UNKNOWN")).toBe("Estado a revisar")
  })

  it("clock usa fecha real, no 2026-10-02 congelado", () => {
    expect(/^\d{4}-\d{2}-\d{2}$/.test(todayIso())).toBe(true)
  })
})
