/**
 * Navegación contextual T06 (FR-20): deep links autosuficientes, Back/reload
 * reproducen el estado, y el servidor revalida scope/PII en el destino.
 * La caché nunca autoriza.
 */
export const T06_ROUTES = Object.freeze({
  home: "/home",
  attention: "/home#atencion",
  search: "/search",
  reports: "/reports",
  attendanceReport: "/reports/attendance",
  performanceReport: "/reports/performance",
})

/** Construye una URL de búsqueda conservando q/type/cursor. */
export function searchHref(input: { q: string; type?: string; cursor?: string }): string {
  const params = new URLSearchParams()
  if (input.q) params.set("q", input.q)
  if (input.type) params.set("type", input.type)
  if (input.cursor) params.set("cursor", input.cursor)
  const encoded = params.toString()
  return encoded ? `${T06_ROUTES.search}?${encoded}` : T06_ROUTES.search
}

/** Construye una URL de reporte conservando período/filtros. */
export function reportHref(kind: "attendance" | "performance", params: Record<string, string | undefined>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) if (value) search.set(key, value)
  const base = kind === "attendance" ? T06_ROUTES.attendanceReport : T06_ROUTES.performanceReport
  const encoded = search.toString()
  return encoded ? `${base}?${encoded}` : base
}

/** Traduce un `to` del backend a un destino navegable; null => sin autoridad. */
export function resolveAttentionTarget(to: string | null): string | null {
  return to && to.startsWith("/") ? to : null
}
