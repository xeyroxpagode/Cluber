import { useParams, Link } from "react-router"
import { CalendarDays } from "lucide-react"
import { useFetch } from "../lib/use-fetch"
import { fetchEventDetail } from "../lib/t03-api"
import { dateLabel, timeLabel } from "../lib/dates"
import { Button, Empty, Surface } from "../shared/ui"
import { PageContextHeader } from "../shared/patterns"
import { VasControl } from "../shared/vas"

/**
 * T04 (disponibilidad, convocatoria, asistencia, acta) no tiene backend todavía.
 * Estas páginas muestran el estado real del evento y un aviso honesto de la
 * entrega que falta, en lugar de simular datos de participación.
 */

function EventSummary({ eventId }: { eventId: string }) {
  const { data: event, loading, error } = useFetch(() => fetchEventDetail(eventId), [eventId])
  if (loading) return <p className="gei-meta">Cargando evento…</p>
  if (error || !event) {
    return (
      <Surface className="grid gap-2">
        <p className="gei-body-strong">No pudimos cargar el evento</p>
        <p className="gei-meta">Puede que el enlace esté incompleto o que el evento haya sido cancelado.</p>
      </Surface>
    )
  }
  const label = event.state === "POSTPONED" ? "Sin horario vigente" : `${dateLabel(event.startAt ? event.startAt.slice(0, 10) : "", true)} · ${timeLabel(event.startAt)}`
  return (
    <Surface className="grid gap-2">
      <p className="gei-meta">Evento</p>
      <p className="gei-body-strong">{event.type === "MATCH" ? `GEI vs. ${event.opponent ?? "Rival a definir"}` : event.title}</p>
      <p className="gei-meta">{label}{event.venue?.name ? ` · ${event.venue.name}` : ""}</p>
      <Link to={`/events/${event.id}`} className="gei-target mt-1 inline-flex items-center gap-1.5 rounded-control text-meta font-semibold text-interactive hover:underline">
        <CalendarDays size={13} aria-hidden />
        Abrir el evento
      </Link>
    </Surface>
  )
}

function Missing({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="mx-auto max-w-3xl">
      <Empty title={title} detail={detail} />
    </div>
  )
}

function T04Notice({ title, detail }: { title: string; detail: string }) {
  return (
    <Surface className="grid gap-2">
      <p className="gei-body-strong">{title}</p>
      <p className="gei-meta">{detail}</p>
      <p className="gei-meta">Llega con la siguiente etapa (T04 — Participation Core). Mientras tanto, la coordinación del evento (fecha, sede, logística, estado) está completa y funciona con datos reales.</p>
    </Surface>
  )
}

export function AvailabilityPage() {
  const { eventId = "" } = useParams()
  return (
    <div className="gei-stack-page mx-auto max-w-3xl">
      <PageContextHeader context="Disponibilidad" title="Disponibilidad" back={`/events/${eventId}`} />
      <EventSummary eventId={eventId} />
      <VasControl />
      <T04Notice
        title="La disponibilidad jugadora llega con la T04"
        detail="Todavía no existe el backend de respuestas, y no se simulan respuestas."
      />
    </div>
  )
}

export function SelectionPage() {
  const { eventId = "" } = useParams()
  return (
    <div className="gei-stack-page mx-auto max-w-3xl">
      <PageContextHeader context="Convocatoria" title="Convocatoria" back={`/events/${eventId}`} />
      <EventSummary eventId={eventId} />
      <T04Notice
        title="La convocatoria llega con la T04"
        detail="Todavía no existe el backend de selección ni la publicación de convocadas."
      />
    </div>
  )
}

export function AttendancePage() {
  const { eventId = "" } = useParams()
  return (
    <div className="gei-stack-page mx-auto max-w-3xl">
      <PageContextHeader context="Asistencia" title="Asistencia" back={`/events/${eventId}`} />
      <EventSummary eventId={eventId} />
      <T04Notice
        title="La asistencia llega con la T04"
        detail="Todavía no existe el backend de registro y cierre de asistencia."
      />
    </div>
  )
}

export function MatchRecordPage() {
  const { eventId = "" } = useParams()
  return (
    <div className="gei-stack-page mx-auto max-w-3xl">
      <PageContextHeader context="Resultado" title="Resultado del partido" back={`/events/${eventId}`} />
      <EventSummary eventId={eventId} />
      <T04Notice
        title="El acta y el resultado llegan con la T04"
        detail="Todavía no existe el backend de MatchRecord; por eso Completar y Abandonar están protegidos (fail-closed) en el servidor."
      />
    </div>
  )
}
