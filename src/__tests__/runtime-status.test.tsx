import { render, screen, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { RuntimeStatus } from "../shared/runtime-status"

afterEach(() => vi.unstubAllGlobals())

describe("RuntimeStatus", () => {
  it.each([
    [true, { status: "ok" }, "Backend GEI disponible"],
    [false, { status: "down" }, "Backend GEI no disponible"],
    [true, { status: "unexpected" }, "Respuesta inválida del backend GEI"],
  ])("distinguishes HTTP and response states", async (ok, body, label) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok, json: async () => body }))
    render(<RuntimeStatus />)
    await waitFor(() => expect(screen.getByLabelText(label)).toBeTruthy())
  })

  it("reports a transport failure without fake success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("network")))
    render(<RuntimeStatus />)
    await waitFor(() => expect(screen.getByLabelText("Sin conexión con el backend GEI")).toBeTruthy())
  })
})
