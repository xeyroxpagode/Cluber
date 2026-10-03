import type { Event } from "../mock/model"
import { useProduct } from "../mock/store"
import { stateText } from "./states"

/**
 * Gramática única ¿Vas? (Stage 4 §16).
 * Vocabulario: Voy / Quizás / No voy. Mismo orden, estado y micro-feedback en
 * Home, Calendario contextual, Detalle de equipo, Detalle de evento y Availability.
 */
export type VasValue = "YES" | "MAYBE" | "NO"

const OPTIONS: Array<{ value: VasValue; label: string }> = [
  { value: "YES", label: "Voy" },
  { value: "MAYBE", label: "Quizás" },
  { value: "NO", label: "No voy" },
]

export function VasInline({ event }: { event: Event }) {
  const { actor, updateEvent, toast } = useProduct()
  const current = event.availability[actor.id]
  const stale = !!current && current.revision !== event.revision

  function answer(value: VasValue) {
    updateEvent(
      event.id,
      (item) => {
        item.availability[actor.id] = { value, revision: item.revision }
      },
      `Responder disponibilidad: ${stateText(value)}`,
    )
    toast(stale ? "Respuesta actualizada. Gracias por confirmar." : "Respuesta guardada.")
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[13px] font-semibold">¿Vas?</p>
        <p role="status" className="gei-meta">
          {current
            ? stale
              ? `Respuesta anterior: ${stateText(current.value)} · El horario cambió desde tu última respuesta.`
              : `Tu respuesta: ${stateText(current.value)}`
            : "Todavía no respondiste."}
        </p>
      </div>
      {stale && (
        <p className="mt-2 rounded-lg bg-warning-soft px-3 py-2 text-[12px] font-medium text-warning">
          El horario cambió desde tu última respuesta. Confirmá nuevamente.
        </p>
      )}
      <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="¿Vas?">
        {OPTIONS.map((opt) => {
          const active = current?.value === opt.value && !stale
          return (
            <button
              key={opt.value}
              onClick={() => answer(opt.value)}
              aria-pressed={active}
              className={`min-h-11 rounded-lg border px-2 py-2.5 text-[13px] font-semibold transition-colors duration-150 motion-reduce:transition-none ${
                active
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-card hover:border-primary/40 hover:bg-primary-soft/40"
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
