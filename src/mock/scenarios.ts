export const scenario =
  new URLSearchParams(window.location.search).get("scenario") || "normal"
export const scenarioLabels: Record<string, string> = {
  degraded:
    "No pudimos actualizar la información. Tus cambios locales se conservan.",
  stale: "Este evento cambió mientras lo estabas editando.",
  "impact-changed":
    "Las consecuencias cambiaron desde que revisaste este cambio. Revisá el impacto actualizado y confirmá nuevamente.",
}
