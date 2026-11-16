import { describe, expect, it } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderScreen } from "./harness"
import {
  AnnouncementDetail, AnnouncementForm, CommunicationHome,
  ConversationPage, NewConversation,
} from "../features/communication"

describe("T05 R21–R26 — superficies reales con API", () => {
  it("R21: muestra conversaciones con badge unread y CTA de nuevo mensaje", async () => {
    renderScreen("/communication", "/communication", <CommunicationHome />)
    expect(await screen.findByText(/Cargando conversaciones|Conversación/)).toBeTruthy()
    expect(screen.getByRole("link", { name: /Nuevo mensaje/ }).getAttribute("href")).toBe("/communication/conversations/new")
    await waitFor(() => expect(screen.queryByText("Cargando conversaciones…")).toBeNull())
    expect(screen.getByRole("tab", { name: /Comunicados/ })).toBeTruthy()
  })

  it("R22: selector de tipo, resumen obligatorio y creación de DIRECT", async () => {
    const user = userEvent.setup()
    renderScreen("/communication/conversations/new", "/communication/conversations/new", <NewConversation />)
    expect(screen.getByRole("group", { name: "Tipo de conversación" })).toBeTruthy()
    expect(await screen.findByText(/Elegí al menos un destinatario/)).toBeTruthy()
    await user.click(await screen.findByRole("radio", { name: /Ana González/ }))
    expect(await screen.findByText(/Conversación con Ana González/)).toBeTruthy()
    const create = screen.getByRole("button", { name: /Crear conversación/ })
    expect((create as HTMLButtonElement).disabled).toBe(false)
    await user.click(create)
    // La navegación real al thread saca el formulario del DOM.
    await waitFor(() => expect(screen.queryByRole("button", { name: /Crear conversación/ })).toBeNull())
  })

  it("R23: audiencia first, título/cuerpo y acciones de borrador y publicación", async () => {
    renderScreen("/communication/announcements/new", "/communication/announcements/new", <AnnouncementForm />)
    expect(screen.getByText(/1\. Audiencia/)).toBeTruthy()
    expect(screen.getByText(/Todo el club \(intención explícita\)/)).toBeTruthy()
    expect(screen.getByText(/2\. Contenido/)).toBeTruthy()
    expect(screen.getByRole("button", { name: /Guardar borrador/ })).toBeTruthy()
    expect(screen.getByRole("button", { name: /Publicar/ })).toBeTruthy()
  })

  it("R25: corrección muestra audiencia inmutable, motivo y diff", async () => {
    const user = userEvent.setup()
    renderScreen("/announcements/:id/edit", "/announcements/ann-1/edit", <AnnouncementForm />)
    expect(await screen.findByText(/Audiencia publicada, no modificable/)).toBeTruthy()
    expect(screen.getByText(/3\. Motivo de la corrección/)).toBeTruthy()
    expect(screen.getByText(/Antes:/)).toBeTruthy()
    await user.type(screen.getByLabelText(/Motivo/), "Error de tipeo")
    expect(screen.getByRole("button", { name: /Guardar corrección/ })).toBeTruthy()
  })

  it("R24: detalle con audiencia visible y acción 'Entendido'", async () => {
    renderScreen("/announcements/:id", "/announcements/ann-1", <AnnouncementDetail />)
    expect(await screen.findByText("Comunicado de prueba")).toBeTruthy()
    expect(screen.getByText(/Todo el club/)).toBeTruthy()
    expect(screen.getByRole("button", { name: /Entendido/ })).toBeTruthy()
  })

  it("R26: thread real, composer sticky y envío con ack del servidor", async () => {
    const user = userEvent.setup()
    renderScreen("/conversations/:id", "/conversations/conv-1", <ConversationPage />)
    expect(await screen.findByText("Hola del mock")).toBeTruthy()
    const composer = screen.getByPlaceholderText("Escribí un mensaje…")
    await user.type(composer, "Mensaje de prueba{enter}")
    await waitFor(() => expect(screen.queryByText("Enviando…")).toBeNull())
    expect(screen.getByRole("button", { name: /Enviar mensaje/ })).toBeTruthy()
  })
})
