import type { Event, State } from "./model"
import { seriesOccurrences, type SeriesScope } from "./series"

/**
 * Clasificación de cambios (Freeze §11).
 * MATERIAL           → coordination_revision++ + impacto + notificación
 *   · SCHEDULE        → además invalida confirmaciones de disponibilidad
 *   · COORDINATION    → material sin invalidar disponibilidad
 * NON_MATERIAL       → corrección de redacción, sin impacto ni notificación
 */

export const SCHEDULE_FIELDS = ["date", "time", "end", "venueId"] as const
export const COORDINATION_FIELDS = [
  "targetTeams",
  "targetPersonIds",
  "clubWide",
  "opponent",
  "competitionId",
  "meeting",
  "departure",
  "point",
  "transport",
  "arrival",
] as const
export const METADATA_FIELDS = ["title"] as const

export type ChangeKind = "schedule" | "coordination" | "metadata" | "none"

export function classifyChange(patch: Partial<Event>): ChangeKind {
  const keys = Object.keys(patch)
  if (keys.length === 0) return "none"
  if (keys.some((key) => (SCHEDULE_FIELDS as readonly string[]).includes(key)))
    return "schedule"
  if (keys.some((key) => (COORDINATION_FIELDS as readonly string[]).includes(key)))
    return "coordination"
  if (keys.every((key) => (METADATA_FIELDS as readonly string[]).includes(key)))
    return "metadata"
  return "coordination"
}

export interface ImpactPerson {
  personId: string
  name: string
  reason: string
}

export interface Impact {
  kind: ChangeKind
  occurrences: Array<{ id: string; label: string; date: string; time: string }>
  people: ImpactPerson[]
  invalidatesAvailability: boolean
  /** Copys en lenguaje usuario. */
  lines: string[]
}

const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`

export function computeImpact(
  state: State,
  originId: string,
  patch: Partial<Event>,
  scope: SeriesScope,
): Impact {
  const kind = classifyChange(patch)
  // Una corrección de redacción no tiene impacto: no hay ocurrencias afectadas.
  const ids =
    kind === "none" || kind === "metadata"
      ? []
      : seriesOccurrences(state, originId, scope).map((e) => e.id)
  const events = state.events.filter((event) => ids.includes(event.id))
  const people: ImpactPerson[] = []
  const names = new Map(state.people.map((person) => [person.id, person.name]))

  if (kind === "schedule") {
    events.forEach((event) => {
      Object.keys(event.availability).forEach((personId) => {
        if (!people.some((p) => p.personId === personId)) {
          people.push({
            personId,
            name: names.get(personId) ?? personId,
            reason: "Confirmó con el horario anterior",
          })
        }
      })
    })
  }

  if (kind === "coordination" && patch.targetTeams) {
    const before = new Set(events.flatMap((event) => event.targetTeams))
    const after = new Set(patch.targetTeams)
    before.forEach((teamId) => {
      if (!after.has(teamId)) {
        people.push({
          personId: `team:${teamId}`,
          name: "Equipo destino",
          reason: "Deja de estar en el destino del evento",
        })
      }
    })
  }

  const lines: string[] = []
  if (kind === "metadata") {
    lines.push("Es una corrección de redacción: no cambia el horario ni el destino.")
  }
  if (events.length > 1) {
    lines.push(`Se modifican ${plural(events.length, "evento", "eventos")} de la serie.`)
  } else if (events.length === 1 && scope !== "ONLY_THIS") {
    lines.push("Esta serie sólo tiene este evento por delante.")
  }
  if (kind === "schedule" && people.length > 0) {
    lines.push(
      `${plural(people.length, "persona confirma", "personas confirman")} el horario anterior y van a tener que volver a confirmar.`,
    )
  }
  if (kind === "coordination") {
    lines.push("El cambio afecta la organización, pero no el horario.")
  }

  return {
    kind,
    occurrences: events.map((event) => ({
      id: event.id,
      label: event.title || event.opponent || event.id,
      date: event.date,
      time: event.time,
    })),
    people,
    invalidatesAvailability: kind === "schedule",
    lines,
  }
}