import { useEffect, useState } from "react"

type RuntimeState = "loading" | "available" | "unavailable" | "network-error" | "invalid-response"

export function RuntimeStatus() {
  const [state, setState] = useState<RuntimeState>("loading")
  useEffect(() => {
    const controller = new AbortController()
    fetch("/internal/live", { headers: { Accept: "application/json" }, signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) { setState("unavailable"); return }
        const body: unknown = await response.json().catch(() => null)
        setState(typeof body === "object" && body !== null && (body as { status?: unknown }).status === "ok" ? "available" : "invalid-response")
      })
      .catch((error: unknown) => { if ((error as { name?: string }).name !== "AbortError") setState("network-error") })
    return () => controller.abort()
  }, [])
  const labels: Record<RuntimeState, string> = {
    loading: "Conectando con GEI",
    available: "Backend GEI disponible",
    unavailable: "Backend GEI no disponible",
    "network-error": "Sin conexión con el backend GEI",
    "invalid-response": "Respuesta inválida del backend GEI",
  }
  return <span aria-label={labels[state]} title={labels[state]} className={`size-2 rounded-full ${state === "available" ? "bg-green-500" : state === "loading" ? "bg-amber-400" : "bg-red-500"}`} />
}
