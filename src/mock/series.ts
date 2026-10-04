import type { Event, EventSeries, State } from "./model"
import type { SeriesScope } from "./model"

export type { SeriesScope }

export const SERIES_SCOPE_OPTIONS: Array<{
  value: SeriesScope
  title: string
  detail: string
}> = [
  {
    value: "ONLY_THIS",
    title: "Sólo este evento",
    detail: "El resto de la serie queda como está.",
  },
  {
    value: "THIS_AND_FOLLOWING",
    title: "Este y los siguientes",
    detail: "Se aplica desde acá en adelante. Lo anterior no se toca.",
  },
  {
    value: "ENTIRE_SERIES",
    title: "Toda la serie",
    detail: "Se aplica a todos los eventos de la serie.",
  },
]

/**
 * D1 — resolución real del alcance de serie.
 * La serie ordena sus ocurrencias por fecha; THIS_AND_FOLLOWING corta en la
 * ocurrencia de origen inclusiva.
 */
export function seriesOccurrences(
  state: State,
  originId: string,
  scope: SeriesScope,
): Event[] {
  const origin = state.events.find((event) => event.id === originId)
  if (!origin) return []
  if (!origin.seriesId || scope === "ONLY_THIS") return [origin]
  const ordered = state.events
    .filter((event) => event.seriesId === origin.seriesId)
    .sort((a, b) =>
      a.date === b.date
        ? a.time.localeCompare(b.time)
        : a.date.localeCompare(b.date),
    )
  const index = ordered.findIndex((event) => event.id === originId)
  if (index < 0) return [origin]
  if (scope === "THIS_AND_FOLLOWING") return ordered.slice(index)
  return ordered
}

export function seriesOf(state: State, event: Event): EventSeries | undefined {
  if (!event.seriesId) return undefined
  return state.eventSeries.find((series) => series.id === event.seriesId)
}

export function seriesCount(state: State, seriesId: string): number {
  return state.events.filter((event) => event.seriesId === seriesId).length
}

/** Campos que esta ocurrencia ya no comparte con el resto de la serie. */
export function divergedFields(event: Event, seriesEvents: Event[]): string[] {
  const keys: Array<keyof Event> = [
    "date",
    "time",
    "venueId",
    "meeting",
    "departure",
  ]
  return keys.filter((key) =>
    seriesEvents.some((other) => other.id !== event.id && other[key] !== event[key]),
  )
}