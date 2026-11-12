/** Etiquetas de fecha/hora de presentación (es). */

export const dateLabel = (date: string, long = false) => {
  if (!date) return "Fecha a definir"
  return new Date(`${date}T12:00:00`).toLocaleDateString(
    "es-AR",
    long
      ? { weekday: "long", day: "numeric", month: "long", year: "numeric" }
      : { weekday: "short", day: "numeric", month: "short" },
  )
}

export const shortDate = (date: string) => {
  if (!date) return "—"
  return new Date(`${date}T12:00:00`).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
  })
}

export const dateTimeLabel = (at: string | null | undefined) => {
  if (!at) return "—"
  const date = new Date(at)
  return date.toLocaleString("es-AR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const relativeLabel = (at: string, now = new Date()) => {
  const minutes = Math.round((now.getTime() - new Date(at).getTime()) / 60000)
  if (minutes < 1) return "Recién"
  if (minutes < 60) return `Hace ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `Hace ${hours} h`
  const days = Math.round(hours / 24)
  if (days === 1) return "Ayer"
  if (days < 7) return `Hace ${days} días`
  return dateLabel(at.slice(0, 10))
}

export const timeLabel = (iso: string | null | undefined) => {
  if (!iso) return "—"
  return new Date(iso).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
}
