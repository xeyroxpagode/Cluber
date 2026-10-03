/**
 * Real clock abstraction (Stage 4 §38).
 * UI productiva usa real clock. Seed usa fechas relativas al día real.
 * Para demo determinista se permite override vía ?clock=YYYY-MM-DD o window.__GEI_CLOCK_OVERRIDE__.
 */

function devOverride(): string | null {
  try {
    const param = new URLSearchParams(window.location.search).get("clock")
    if (param && /^\d{4}-\d{2}-\d{2}$/.test(param)) return param
    const w = window as unknown as { __GEI_CLOCK_OVERRIDE__?: string }
    if (w.__GEI_CLOCK_OVERRIDE__ && /^\d{4}-\d{2}-\d{2}$/.test(w.__GEI_CLOCK_OVERRIDE__)) {
      return w.__GEI_CLOCK_OVERRIDE__
    }
  } catch {
    /* noop: sin override */
  }
  return null
}

/** Hoy real en zona local, formato YYYY-MM-DD. */
export function todayIso(): string {
  const override = devOverride()
  if (override) return override
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

/** Suma días calendario a un ISO date. */
export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number)
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1, 12, 0, 0)
  dt.setDate(dt.getDate() + days)
  const yy = dt.getFullYear()
  const mm = String(dt.getMonth() + 1).padStart(2, "0")
  const dd = String(dt.getDate()).padStart(2, "0")
  return `${yy}-${mm}-${dd}`
}

/** true si iso es hoy. */
export function isToday(iso: string): boolean {
  return iso === todayIso()
}

/** Etiqueta corta de fecha usando clock real (no congela 2026-10-02). */
export function todayLabel(): string {
  return new Date(`${todayIso()}T12:00:00`).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}
