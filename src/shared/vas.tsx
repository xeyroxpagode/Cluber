import type { Event, Response } from "../mock/model"
import { eventAvailabilityView } from "../mock/model"
import { useProduct } from "../mock/store"
import { RadioGroup } from "./ui"
import { cx } from "./states"

export type VasValue = Response

const OPTIONS: Array<{ value: VasValue; label: string; tone: "success" | "warning" | "danger" }> = [
  { value: "YES", label: "Voy", tone: "success" },
  { value: "MAYBE", label: "Tal vez", tone: "warning" },
  { value: "NO", label: "No voy", tone: "danger" },
]

export const VAS_LABELS: Record<string, string> = {
  YES: "Voy",
  MAYBE: "Tal vez",
  NO: "No voy",
  NO_RESPONSE: "Sin respuesta",
  NEEDS_RECONFIRMATION: "Hay que volver a confirmar",
}

/**
 * Única gramática de ¿Vas? (Stage 6 §11 / Freeze §12).
 * Mismo orden, mismo vocabulario y mismo feedback en Inicio, Calendario,
 * Equipo, Evento y Availability. Sólo accesible si la autoridad lo permite.
 */
export function VasControl({
  event,
  personId,
  readOnlyReason,
}: {
  event: Event
  personId: string
  readOnlyReason?: string
}) {
  const { respondAvailability, toast, authority } = useProduct()
  const view = eventAvailabilityView(event, personId)
  const canRespond =
    personId === authority.person.id
      ? authority.canRespondOwn
      : authority.canRespondForChild(personId)

  if (event.state !== "SCHEDULED")
    return (
      <p className="gei-meta">
        {event.state === "POSTPONED"
          ? "Este evento está postergado: no hay horario vigente para confirmar."
          : "Este evento ya no admite cambios de disponibilidad."}
      </p>
    )

  if (readOnlyReason || !canRespond)
    return (
      <p className="gei-meta">
        {readOnlyReason ??
          (personId === authority.person.id
            ? "Vos no jugás este evento, así que no respondés disponibilidad. La lista de responses es la que podés ver."
            : "La delegación de este menor no incluye responder disponibilidad.")}
      </p>
    )

  async function answer(value: VasValue) {
    await respondAvailability(event.id, personId, value)
    toast("Respuesta guardada.")
  }

  return (
    <div className="grid gap-2.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="gei-body-strong">¿Vas?</p>
        <p className="gei-meta" role="status" aria-live="polite">
          Tu respuesta:{" "}
          <span
            className={cx(
              "font-semibold",
              view === "NEEDS_RECONFIRMATION" && "text-attention",
              view === "NO_RESPONSE" && "text-ink-muted",
            )}
          >
            {VAS_LABELS[view]}
          </span>
        </p>
      </div>
      {view === "NEEDS_RECONFIRMATION" && (
        <p className="rounded-control border border-attention-line bg-attention-soft px-3 py-2 text-meta font-medium text-attention">
          El horario cambió desde tu última respuesta. Confirmá de nuevo.
        </p>
      )}
      <RadioGroup
        legend="¿Vas?"
        name={`vas-${event.id}-${personId}`}
        columns={3}
        value={(view === "NEEDS_RECONFIRMATION" || view === "NO_RESPONSE"
          ? null
          : view) as VasValue | null}
        options={OPTIONS}
        onChange={answer}
      />
    </div>
  )
}

export function VasCompact({ event }: { event: Event }) {
  const { childId, authority } = useProduct()
  const personId = childId ?? authority.person.id
  const view = eventAvailabilityView(event, personId)
  const canRespond =
    authority.person.id === personId
      ? authority.canRespondOwn
      : authority.canRespondForChild(personId)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="gei-meta font-semibold">¿Vas?</span>
      <span
        className="text-meta font-semibold text-ink-strong"
        aria-live="polite"
      >
        {VAS_LABELS[view]}
      </span>
      {!canRespond && (
        <span className="gei-meta">sólo consulta</span>
      )}
    </div>
  )
}