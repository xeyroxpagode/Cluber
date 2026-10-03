import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import {
  CalendarDays,
  Clock3,
  MapPin,
  ChevronRight,
  Users,
  ClipboardCheck,
  Trophy,
  Edit3,
  MoreHorizontal,
  ArrowRight,
  CheckCircle2,
  History,
  Flag,
  Bus,
  Plus,
} from "lucide-react"
import { useProduct, canOperateEvent, wait } from "../mock/store"
import {
  dateLabel,
  eventName,
  labels,
  availabilityLabel,
  type Event,
} from "../mock/model"
import {
  Header,
  Surface,
  Section,
  Badge,
  Button,
  RowLink,
  Alert,
  Modal,
  TextField,
  Select,
  TextArea,
  Empty,
} from "../shared/ui"

export function useEvent() {
  const { eventId } = useParams()
  const product = useProduct()
  return {
    ...product,
    event: product.state.events.find((item) => item.id === eventId),
  }
}
export function EventDetail() {
  const { event, state, actor, capabilities, eventChange, updateEvent, toast } =
    useEvent()
  const [menu, setMenu] = useState(false)
  const [operation, setOperation] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  const [history, setHistory] = useState(false)
  if (!event)
    return (
      <Empty
        title="Evento no disponible"
        detail="Este evento no existe o no está disponible."
      />
    )
  if (!event.clubWide && actor.team !== event.team && !capabilities.official)
    return (
      <Empty
        title="Evento no disponible"
        detail="Este evento no está dentro de tu alcance actual."
      />
    )
  const sport = canOperateEvent(actor, event)
  const teamName =
    state.teams.find((team) => team.id === event.team)?.name || "Equipo"
  const jornada = state.jornadas.find((item) => item.events.includes(event.id))
  const coach = state.people.find(
    (person) => person.team === event.team && person.role === "COACH",
  )
  const conversation =
    state.conversations.find(
      (item) =>
        item.eventId === event.id && item.participants.includes(actor.id),
    ) ||
    state.conversations.find(
      (item) =>
        item.teamId === event.team && item.participants.includes(actor.id),
    )
  const announcement = state.announcements.find(
    (item) => item.state === "PUBLISHED" && item.audience.includes(teamName),
  )
  const editable =
    (sport || capabilities.official) &&
    !["COMPLETED", "ABANDONED", "IN_PROGRESS"].includes(event.state)
  const roster = state.people.filter(
    (person) =>
      person.team === event.team && ["PLAYER", "CAPTAIN"].includes(person.role),
  )
  const replies = roster.filter((person) => event.availability[person.id])
  const reconfirm = replies.filter(
    (person) => event.availability[person.id].revision !== event.revision,
  ).length
  const conflicts = (event.published || []).filter(
    (id) =>
      state.people.find((person) => person.id === id)?.eligibility !==
        "ELIGIBLE" ||
      state.people.find((person) => person.id === id)?.team !== event.team,
  )
  const attendance = Object.values(event.attendance)
  const primary =
    sport && event.type === "MATCH"
      ? "Convocatoria"
      : sport && event.type === "TRAINING"
        ? "Asistencia"
        : capabilities.availability
          ? "Responder disponibilidad"
          : ""
  async function execute() {
    if (!event) return
    setPending(true)
    setError("")
    try {
      await eventChange(
        event.id,
        {
          state:
            operation === "Postergar"
              ? "POSTPONED"
              : operation === "Cancelar"
                ? "CANCELLED"
                : "SCHEDULED",
        },
        `${operation} evento`,
        event.version,
      )
      setOperation("")
      toast("Cambio confirmado. La información está actualizada.")
    } catch (failure) {
      setError((failure as Error).message)
    } finally {
      setPending(false)
    }
  }
  return (
    <>
      <Header
        back="/calendar"
        eyebrow={`${labels[event.type]} · ${
          event.clubWide ? "Todo hockey" : `${teamName} 2026`
        }`}
        title={eventName(event)}
        description={event.type === "MATCH" ? event.competition : event.venue}
        action={
          <div className="flex items-center gap-2">
            {primary && (
              <Link
                to={`/events/${event.id}/${
                  primary === "Convocatoria"
                    ? "selection"
                    : primary === "Asistencia"
                      ? "attendance"
                      : "availability"
                }`}
              >
                <Button>
                  {primary === "Convocatoria" ? (
                    <Users size={16} />
                  ) : (
                    <ClipboardCheck size={16} />
                  )}
                  {primary}
                </Button>
              </Link>
            )}
            {editable && (
              <Link to={`/events/${event.id}/edit`}>
                <Button variant="secondary">
                  <Edit3 size={15} />
                  Editar
                </Button>
              </Link>
            )}
            {(editable || sport) && (
              <div className="relative">
                <Button
                  variant="secondary"
                  aria-label="Más acciones"
                  onClick={() => setMenu(!menu)}
                >
                  <MoreHorizontal size={18} />
                </Button>
                {menu && (
                  <div className="absolute right-0 z-10 mt-2 w-48 rounded-xl border border-border bg-card p-1 shadow-lg">
                    {event.state === "SCHEDULED" && (
                      <>
                        <Link
                          to={`/events/${event.id}/edit`}
                          className="block rounded-md px-3 py-2.5 text-xs hover:bg-muted"
                        >
                          Reprogramar
                        </Link>
                        <button
                          onClick={() => {
                            setOperation("Postergar")
                            setMenu(false)
                          }}
                          className="block w-full rounded-md px-3 py-2.5 text-left text-xs hover:bg-muted"
                        >
                          Postergar
                        </button>
                      </>
                    )}
                    {["SCHEDULED", "POSTPONED"].includes(event.state) && (
                      <button
                        onClick={() => {
                          setOperation("Cancelar")
                          setMenu(false)
                        }}
                        className="block w-full rounded-md px-3 py-2.5 text-left text-xs text-danger hover:bg-danger-soft"
                      >
                        Cancelar evento
                      </button>
                    )}
                    {["CANCELLED", "POSTPONED"].includes(event.state) && (
                      <button
                        onClick={() => {
                          setOperation("Restaurar")
                          setMenu(false)
                        }}
                        className="block w-full rounded-md px-3 py-2.5 text-left text-xs hover:bg-muted"
                      >
                        {event.state === "POSTPONED"
                          ? "Reprogramar"
                          : "Restaurar"}
                      </button>
                    )}
                    {sport && event.state === "SCHEDULED" && (
                      <button
                        onClick={async () => {
                          await wait()
                          updateEvent(
                            event.id,
                            (item) => (item.state = "IN_PROGRESS"),
                            "Iniciar evento",
                          )
                          setMenu(false)
                          toast("Evento en curso")
                        }}
                        className="block w-full rounded-md px-3 py-2.5 text-left text-xs hover:bg-muted"
                      >
                        Iniciar evento
                      </button>
                    )}
                    {sport &&
                      event.state === "IN_PROGRESS" &&
                      event.type === "TRAINING" && (
                        <button
                          onClick={async () => {
                            await wait()
                            updateEvent(
                              event.id,
                              (item) => (item.state = "COMPLETED"),
                              "Finalizar entrenamiento",
                            )
                            setMenu(false)
                          }}
                          className="block w-full px-3 py-2.5 text-left text-xs"
                        >
                          Finalizar entrenamiento
                        </button>
                      )}
                  </div>
                )}
              </div>
            )}
          </div>
        }
      />
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Badge value={event.state} />
        <span className="text-xs text-muted-foreground">
          {event.type === "MATCH"
            ? jornada?.name || "Partido del equipo"
            : "Actividad del equipo"}
        </span>
        {event.record.state === "FINAL" && (
          <Badge value="FINAL">
            Resultado final · {event.record.gei} – {event.record.opponent}
          </Badge>
        )}
      </div>
      <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          {reconfirm > 0 && event.state === "SCHEDULED" && (
            <Alert>
              <strong className="block">
                El horario cambió. Hay {reconfirm} respuestas para reconfirmar.
              </strong>
              <p className="mt-1 text-xs">
                Las respuestas anteriores se conservan, pero no confirman el
                horario actual.
              </p>
            </Alert>
          )}
          {conflicts.length > 0 && (
            <Alert tone="error">
              Esta convocatoria tiene {conflicts.length} situación para revisar.
              La publicación histórica se conserva.
            </Alert>
          )}
          <Surface>
            <div className="grid gap-6 p-6 sm:grid-cols-2">
              <div className="flex gap-3">
                <CalendarDays size={18} className="mt-0.5 text-primary" />
                <div>
                  <span className="text-[10px] text-muted-foreground">
                    Fecha
                  </span>
                  <p className="mt-1 text-sm font-semibold">
                    {dateLabel(event.date, true)}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock3 size={18} className="mt-0.5 text-primary" />
                <div>
                  <span className="text-[10px] text-muted-foreground">
                    Horario
                  </span>
                  <p className="mt-1 text-sm font-semibold">
                    {event.state === "POSTPONED"
                      ? "A confirmar"
                      : `${event.time} – ${event.end} h`}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin size={18} className="mt-0.5 text-primary" />
                <div>
                  <span className="text-[10px] text-muted-foreground">
                    Sede
                  </span>
                  <p className="mt-1 text-sm font-semibold">{event.venue}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Alvear 1240 · Ituzaingó
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Users size={18} className="mt-0.5 text-primary" />
                <div>
                  <span className="text-[10px] text-muted-foreground">
                    {event.clubWide ? "Audiencia" : "Equipo"}
                  </span>
                  <p className="mt-1 text-sm font-semibold">
                    {event.clubWide ? "Todo hockey" : `${teamName} 2026`}
                  </p>
                </div>
              </div>
            </div>
          </Surface>
          <Section title="Participación">
            <Surface>
              <RowLink
                to={`/events/${event.id}/availability`}
                title="Disponibilidad"
                detail={`${replies.length} respuestas · ${roster.length - replies.length} sin respuesta${
                  reconfirm ? ` · ${reconfirm} necesitan reconfirmación` : ""
                }`}
                icon={
                  <span className="text-primary">
                    <CheckCircle2 size={20} />
                  </span>
                }
                aside={
                  <span className="hidden text-xs text-muted-foreground sm:block">
                    {
                      replies.filter(
                        (person) =>
                          event.availability[person.id].value === "YES" && event.availability[person.id].revision === event.revision,
                      ).length
                    }{" "}
                    sí
                  </span>
                }
              />
              {event.type === "MATCH" && (
                <RowLink
                  to={`/events/${event.id}/selection`}
                  title="Convocatoria"
                  detail={
                    event.published
                      ? `${event.published.length} jugadoras convocadas · ${
                          conflicts.length
                            ? `${conflicts.length} conflicto actual`
                            : "Sin conflictos actuales"
                        }`
                      : `${event.selection.length} seleccionadas en borrador`
                  }
                  icon={<Users size={20} className="text-primary" />}
                  aside={
                    <Badge value={event.published ? "PUBLISHED" : "DRAFT"} />
                  }
                />
              )}
              {event.type !== "CLUB_EVENT" && (
                <RowLink
                  to={`/events/${event.id}/attendance`}
                  title="Asistencia"
                  detail={
                    event.attendanceOpened
                      ? `${attendance.filter((value) => value === "PRESENT").length} presentes · ${roster.length - attendance.length} sin registrar`
                      : "Todavía no se abrió la asistencia"
                  }
                  icon={<ClipboardCheck size={20} className="text-primary" />}
                  aside={
                    <Badge value={event.attendanceClosed ? "CLOSED" : "DRAFT"}>
                      {event.attendanceClosed
                        ? "Cerrada"
                        : event.attendanceOpened
                          ? "Abierta"
                          : "Sin abrir"}
                    </Badge>
                  }
                />
              )}
              {event.type === "MATCH" && (
                <RowLink
                  to={`/events/${event.id}/match-record`}
                  title="Resultado y estadísticas"
                  detail={
                    event.record.state === "FINAL"
                      ? `${event.record.gei} – ${event.record.opponent} · Resultado final`
                      : "El resultado final todavía no se registró"
                  }
                  icon={<Trophy size={20} className="text-primary" />}
                  aside={<Badge value={event.record.state} />}
                />
              )}
            </Surface>
          </Section>
          <Section title="Logística">
            <Surface className="p-6">
              <div className="grid gap-5 text-xs sm:grid-cols-2">
                <Info
                  label="Hora de encuentro"
                  value={event.meeting || "Sin definir"}
                />
                <Info
                  label="Hora de salida"
                  value={event.departure || "No aplica"}
                />
                <Info
                  label="Punto de encuentro"
                  value={event.point || "Sin definir"}
                />
                <Info
                  label="Transporte"
                  value={event.transport || "Sin indicaciones"}
                />
              </div>
              <div className="mt-6 border-t border-border pt-5">
                <Info
                  label="Indicaciones de llegada"
                  value={event.arrival || "Sin indicaciones adicionales"}
                />
              </div>
            </Surface>
          </Section>
          <button
            onClick={() => setHistory(!history)}
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
          >
            <History size={15} />
            {history ? "Ocultar historial" : "Ver historial del evento"}
          </button>
          {history && (
            <Surface>
              {event.history.map((entry, index) => (
                <p
                  key={index}
                  className="border-b border-border p-4 text-xs last:border-0"
                >
                  {entry}
                </p>
              ))}
              {event.selectionRevisions.map((revision, index) => (
                <details
                  key={revision.id}
                  className="border-t border-border p-4"
                >
                  <summary className="cursor-pointer text-xs font-semibold">
                    Convocatoria publicada · Revisión {index + 1} ·{" "}
                    {revision.players.length} jugadoras
                  </summary>
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    {revision.author} · {revision.date} · Publicación histórica,
                    no estado actual
                  </p>
                  <p className="mt-3 text-xs leading-relaxed">
                    {revision.players
                      .map(
                        (id) =>
                          state.people.find((person) => person.id === id)
                            ?.name || "Persona histórica",
                      )
                      .join(", ")}
                  </p>
                </details>
              ))}
            </Surface>
          )}
        </div>
        <aside className="space-y-6">
          <Section title="Contexto">
            <Surface className="p-5">
              <Info label="Competencia" value={event.competition} />
              <div className="mt-5">
                <Info
                  label="Responsable deportivo"
                  value={
                    coach
                      ? `${coach.name} · Entrenador`
                      : "Sin entrenador asignado"
                  }
                />
              </div>
              {event.type === "MATCH" && jornada && (
                <Link
                  to={`/jornadas/${jornada.id}`}
                  className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs font-medium text-primary"
                >
                  Ver jornada
                  <ArrowRight size={13} />
                </Link>
              )}
            </Surface>
          </Section>
          <Section title="Comunicación">
            <Surface>
              {conversation && (
                <RowLink
                  to={`/conversations/${conversation.id}`}
                  title={
                    conversation.eventId
                      ? "Conversación del evento"
                      : "Conversación del equipo"
                  }
                  detail="Coordinar con el equipo"
                  icon={<Users size={18} className="text-muted-foreground" />}
                />
              )}
              {announcement && (
                <RowLink
                  to={`/announcements/${announcement.id}`}
                  title={announcement.title}
                  detail={`Comunicado oficial · ${dateLabel(announcement.date)}`}
                />
              )}
              {!conversation && !announcement && (
                <p className="p-5 text-xs text-muted-foreground">
                  No hay comunicaciones vinculadas a este evento.
                </p>
              )}
            </Surface>
          </Section>
        </aside>
      </div>
      {operation && (
        <Modal
          title={`${operation} evento`}
          onClose={() => !pending && setOperation("")}
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setOperation("")}
                disabled={pending}
              >
                Volver
              </Button>
              <Button
                variant={operation === "Cancelar" ? "danger" : "primary"}
                onClick={execute}
                disabled={pending}
              >
                {pending ? "Confirmando…" : "Confirmar cambio"}
              </Button>
            </>
          }
        >
          <ImpactContent
            event={event}
            patch={{
              state:
                operation === "Postergar"
                  ? "POSTPONED"
                  : operation === "Cancelar"
                    ? "CANCELLED"
                    : "SCHEDULED",
            }}
            count={roster.length}
          />
          <p className="mt-4 text-xs text-muted-foreground">
            Las respuestas anteriores y las publicaciones se conservarán en el
            historial.
          </p>
          {error && (
            <div className="mt-4">
              <Alert tone="error">{error}</Alert>
            </div>
          )}
        </Modal>
      )}
    </>
  )
}
function Info({ label, value }: {
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-[12px] font-medium leading-relaxed">{value}</p>
    </div>
  )
}
export function ImpactContent({
  event,
  patch,
  count,
}: {
  event: Event
  patch: Partial<Event>
  count: number
}) {
  const entries = [
    [
      "Fecha",
      event.date,
      patch.date ? dateLabel(patch.date) : "",
      dateLabel(event.date),
    ],
    ["Horario", event.time, patch.time, event.time],
    ["Finalización", event.end, patch.end, event.end],
    ["Sede", event.venue, patch.venue, event.venue],
    ["Rival", event.opponent, patch.opponent, event.opponent],
    [
      "Estado",
      event.state,
      patch.state ? labels[patch.state] : "",
      labels[event.state],
    ],
    ["Encuentro", event.meeting, patch.meeting, event.meeting],
    ["Salida", event.departure, patch.departure, event.departure],
    ["Punto de encuentro", event.point, patch.point, event.point],
    ["Transporte", event.transport, patch.transport, event.transport],
    ["Llegada", event.arrival, patch.arrival, event.arrival],
  ].filter(([, , after]) => after !== undefined && after !== "")
  return (
    <>
      <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
        Revisá los cambios y sus consecuencias antes de confirmar.
      </p>
      <Surface>
        {entries.map(([label, , after, before]) => (
          <div
            key={label}
            className="grid grid-cols-[80px_1fr_1fr] gap-2 border-b border-border p-3 text-xs last:border-0"
          >
            <span className="text-muted-foreground">{label}</span>
            <span className="text-muted-foreground line-through">{before}</span>
            <span className="font-semibold text-primary">{after}</span>
          </div>
        ))}
      </Surface>
      <h3 className="mb-3 mt-6 text-sm font-semibold">
        Impacto en la coordinación
      </h3>
      <div className="space-y-3 text-xs">
        <ImpactLine
          number={Object.keys(event.availability).length}
          label="respuestas existentes se conservarán"
        />
        <ImpactLine
          number={Object.keys(event.availability).length}
          label="personas deberán confirmar nuevamente al programarse"
        />
        <ImpactLine
          number={event.published ? 1 : 0}
          label="convocatoria publicada se conservará"
        />
        <ImpactLine
          number={count + 1}
          label="personas recibirán la actualización"
        />
      </div>
    </>
  )
}
function ImpactLine({ number, label }: {
  number: number
  label: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="min-w-6 font-bold tabular-nums text-primary">
        {number}
      </span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  )
}

export function EventForm() {
  const {
    event,
    state,
    actor,
    capabilities,
    update,
    updateEvent,
    eventChange,
    toast,
  } = useEvent()
  const navigate = useNavigate()
  const isNew = !useParams().eventId
  const [type, setType] = useState<Event["type"]>(event?.type || "TRAINING")
  const [draft, setDraft] = useState({
    title: event?.title || "",
    team: event?.team || actor.team || "sexta",
    date: event?.date || "2026-10-10",
    time: event?.time || "18:00",
    end: event?.end || "19:30",
    venue: event?.venue || "GEI · Cancha de hockey",
    opponent: event?.opponent || "",
    competition: event?.competition || "Torneo AHBA 2026 · Damas",
    meeting: event?.meeting || "17:00",
    departure: event?.departure || "",
    point: event?.point || "Entrada de la cancha",
    transport: event?.transport || "",
    arrival: event?.arrival || "",
    clubWide: event?.clubWide || false,
  })
  const [preview, setPreview] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  const baselineVersion = useState(event?.version || 1)[0]
  if (
    (!capabilities.sport && !capabilities.official) ||
    (!isNew &&
      (!event ||
        (event.team !== actor.team && !capabilities.official) ||
        ["COMPLETED", "ABANDONED", "IN_PROGRESS"].includes(event.state)))
  )
    return (
      <Empty
        title="Edición no disponible"
        detail="Tu alcance o el estado del evento no permiten esta operación. Los eventos finalizados conservan su historia."
      />
    )
  const patch = event
    ? Object.fromEntries(
        Object.entries(draft).filter(
          ([key, value]) => value !== event[(key as keyof Event)],
        ),
      ) as Partial<Event>
    : {}
  const material = Object.keys(patch).some((key) => key !== "title")
  const field = (key: keyof typeof draft, value: string | boolean) =>
    setDraft((previous) => ({ ...previous, [key]: value }))
  async function save(schedule: boolean, confirmed = false) {
    setError("")
    if (
      schedule &&
      (!draft.date ||
        !draft.time ||
        !draft.venue ||
        (type === "MATCH" &&
          (!draft.opponent || !draft.team || !draft.competition)))
    ) {
      setError(
        "Completá la fecha, el horario, la sede y los datos necesarios para programar.",
      )
      return
    }
    if (draft.time && draft.end && draft.end <= draft.time) {
      setError("El horario de finalización debe ser posterior al inicio.")
      return
    }
    if (event && material && event.state !== "DRAFT" && !confirmed) {
      setPreview(true)
      return
    }
    setPending(true)
    try {
      if (isNew) {
        await wait()
        const id = crypto.randomUUID()
        const newEvent: Event = {
          ...draft,
          id,
          type,
          state: schedule ? "SCHEDULED" : "DRAFT",
          revision: 1,
          version: 1,
          availability: {},
          selection: [],
          published: null,
          selectionRevisions: [],
          attendance: {},
          attendanceOpened: false,
          attendanceClosed: false,
          record: {
            state: "DRAFT",
            status: "PLAYED",
            gei: 0,
            opponent: 0,
            observations: "",
            stats: {},
          },
          history: [
            `${schedule ? "Programado" : "Borrador creado"} por ${actor.name}`,
          ],
        }
        update(
          (next) => next.events.push(newEvent),
          schedule ? "Programar evento" : "Crear borrador",
          id,
        )
        toast(schedule ? "Evento programado" : "Borrador guardado")
        navigate(`/events/${id}`)
      } else if (event) {
        if (material && event.state !== "DRAFT")
          await eventChange(
            event.id,
            patch,
            "Partido modificado",
            baselineVersion,
          )
        else {
          await wait()
          if (event.version !== baselineVersion)
            throw new Error(
              "Este evento cambió mientras lo estabas editando. Revisá la versión actual antes de guardar.",
            )
          updateEvent(
            event.id,
            (item) =>
              Object.assign(
                item,
                draft,
                schedule && event.state === "DRAFT"
                  ? { state: "SCHEDULED" }
                  : {},
              ),
            "Editar evento",
          )
        }
        toast("Evento actualizado")
        navigate(`/events/${event.id}`)
      }
    } catch (failure) {
      setError((failure as Error).message)
    } finally {
      setPending(false)
    }
  }
  return (
    <>
      <Header
        back={isNew ? "/calendar" : `/events/${event!.id}`}
        eyebrow={isNew ? "Nuevo evento" : "Editar evento"}
        title={isNew ? "Crear un evento" : eventName(event!)}
        description="La información operativa, en un mismo lugar."
      />
      <div className="max-w-3xl space-y-6">
        {isNew && (
          <Surface className="grid gap-3 p-5 sm:grid-cols-3">
            {(["TRAINING", "MATCH", "CLUB_EVENT"] as const)
              .filter((item) => item !== "CLUB_EVENT" || capabilities.official)
              .map((item) => (
                <button
                  key={item}
                  disabled={item === "CLUB_EVENT" && !capabilities.official}
                  onClick={() => setType(item)}
                  className={`rounded-lg border p-4 text-left text-xs font-semibold disabled:opacity-40 ${
                    type === item
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <CalendarDays size={20} className="mb-3" />
                  {labels[item]}
                  {item === "CLUB_EVENT" && !capabilities.official && (
                    <span className="mt-2 block text-[10px] font-normal">
                      Sólo coordinación oficial
                    </span>
                  )}
                </button>
              ))}
          </Surface>
        )}
        <Surface className="space-y-5 p-6">
          <h2 className="text-sm font-semibold">Información general</h2>
          {type !== "MATCH" && (
            <TextField
              label="Título"
              value={draft.title}
              onChange={(event) => field("title", event.target.value)}
            />
          )}
          {type === "CLUB_EVENT" && (
            <Select
              label="Audiencia"
              value={draft.clubWide ? "club" : "team"}
              onChange={(event) =>
                field("clubWide", event.target.value === "club")
              }
            >
              <option value="club">Todo hockey</option>
              <option value="team">Equipo</option>
            </Select>
          )}
          {!draft.clubWide && (
            <Select
              label="Equipo"
              disabled={!isNew && type === "MATCH" && event?.state !== "DRAFT"}
              value={draft.team}
              onChange={(event) => field("team", event.target.value)}
            >
              {state.teams
                .filter(
                  (team) => capabilities.official || team.id === actor.team,
                )
                .map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name} 2026
                  </option>
                ))}
            </Select>
          )}
          {type === "MATCH" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Rival"
                value={draft.opponent}
                onChange={(event) => field("opponent", event.target.value)}
              />
              <Select
                label="Competencia"
                value={draft.competition}
                onChange={(event) => field("competition", event.target.value)}
              >
                {state.competitions
                  .filter((item) => item.state === "ACTIVE")
                  .map((item) => (
                    <option key={item.id}>{item.name}</option>
                  ))}
              </Select>
            </div>
          )}
        </Surface>
        <Surface className="space-y-5 p-6">
          <h2 className="text-sm font-semibold">Fecha y lugar</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField
              label="Fecha"
              type="date"
              value={draft.date}
              onChange={(event) => field("date", event.target.value)}
            />
            <TextField
              label="Inicio"
              type="time"
              value={draft.time}
              onChange={(event) => field("time", event.target.value)}
            />
            <TextField
              label="Finalización"
              type="time"
              value={draft.end}
              onChange={(event) => field("end", event.target.value)}
            />
          </div>
          <Select
            label="Sede"
            value={draft.venue}
            onChange={(event) => field("venue", event.target.value)}
          >
            {state.structure
              .filter((item) => item.type === "Sede" && !item.archived)
              .map((item) => (
                <option key={item.id}>{item.name}</option>
              ))}
          </Select>
        </Surface>
        {type === "MATCH" && (
          <Surface className="space-y-5 p-6">
            <h2 className="text-sm font-semibold">Logística</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Hora de encuentro"
                type="time"
                value={draft.meeting}
                onChange={(event) => field("meeting", event.target.value)}
              />
              <TextField
                label="Hora de salida"
                type="time"
                value={draft.departure}
                onChange={(event) => field("departure", event.target.value)}
              />
            </div>
            <TextField
              label="Punto de encuentro"
              value={draft.point}
              onChange={(event) => field("point", event.target.value)}
            />
            <TextArea
              label="Transporte"
              value={draft.transport}
              onChange={(value) => field("transport", value)}
            />
            <TextArea
              label="Indicaciones de llegada"
              value={draft.arrival}
              onChange={(value) => field("arrival", value)}
            />
          </Surface>
        )}
        {error && (
          <Alert tone="error">
            {error}
            <div className="mt-2 text-xs">
              Tu información se conserva. Podés revisar los campos y volver a
              intentar.
            </div>
          </Alert>
        )}
        <div className="sticky bottom-20 flex flex-wrap justify-end gap-3 rounded-xl border border-border bg-card p-4 lg:bottom-4">
          {(isNew || event?.state === "DRAFT") && (
            <Button
              variant="secondary"
              disabled={pending}
              onClick={() => save(false)}
            >
              {pending ? "Guardando…" : "Guardar borrador"}
            </Button>
          )}
          <Button disabled={pending} onClick={() => save(true)}>
            {pending
              ? "Guardando…"
              : isNew || event?.state === "DRAFT"
                ? "Programar"
                : material
                  ? "Revisar impacto"
                  : "Guardar cambios"}
            <ArrowRight size={15} />
          </Button>
        </div>
      </div>
      {preview && event && (
        <Modal
          title="Revisar cambio del evento"
          onClose={() => !pending && setPreview(false)}
          footer={
            <>
              <Button
                variant="secondary"
                disabled={pending}
                onClick={() => setPreview(false)}
              >
                Volver
              </Button>
              <Button disabled={pending} onClick={() => save(true, true)}>
                {pending ? "Confirmando…" : "Confirmar cambio"}
              </Button>
            </>
          }
        >
          <ImpactContent
            event={event}
            patch={patch}
            count={
              state.people.filter((person) => person.team === event.team).length
            }
          />
          {error && (
            <div className="mt-5">
              <Alert tone="error">
                {error}
                <p className="mt-2">
                  Tu versión: {baselineVersion} · Versión actual:{" "}
                  {event.version}
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setPreview(false)
                    navigate(`/events/${event.id}`)
                  }}
                >
                  Revisar cambios actuales
                </Button>
              </Alert>
            </div>
          )}
        </Modal>
      )}
    </>
  )
}

export function JornadaPage() {
  const { jornadaId } = useParams()
  const { state, actor, capabilities, update, toast, notify } = useProduct()
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const [venue, setVenue] = useState("GEI · Cancha de hockey")
  const [preview, setPreview] = useState(false)
  const [pending, setPending] = useState(false)
  const [competition, setCompetition] = useState("ahba")
  const jornada = state.jornadas.find((item) => item.id === jornadaId)
  const newPage = !jornadaId
  if (!capabilities.sport && !capabilities.official)
    return (
      <Empty
        title="Jornada no disponible"
        detail="Tu alcance actual no incluye la coordinación de esta jornada."
      />
    )
  async function save() {
    if (!name.trim()) return
    setPending(true)
    await wait()
    const id = crypto.randomUUID()
    update(
      (draft) =>
        draft.jornadas.push({
          id,
          name,
          season: "2026",
          competition,
          events: selected,
        }),
      "Crear jornada",
      name,
    )
    navigate(`/jornadas/${id}`)
    toast("Jornada creada")
  }
  if (newPage)
    return (
      <>
        <Header
          back="/calendar"
          title="Crear jornada"
          description="Agrupá partidos de la misma temporada y competencia."
        />
        <Surface className="max-w-2xl space-y-5 p-6">
          <TextField
            label="Nombre / contexto de fecha"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField label="Temporada" value="2026" disabled />
          <Select
            label="Competencia"
            value={competition}
            onChange={(event) => setCompetition(event.target.value)}
          >
            <option value="">Sin competencia</option>
            {state.competitions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
          <h3 className="text-sm font-semibold">Partidos disponibles</h3>
          {state.events
            .filter(
              (event) =>
                event.type === "MATCH" &&
                (event.team === actor.team || capabilities.official) &&
                !state.jornadas.some((item) =>
                  item.events.includes(event.id),
                ) &&
                (!competition ||
                  event.competition ===
                    state.competitions.find((item) => item.id === competition)
                      ?.name),
            )
            .map((event) => (
              <label key={event.id} className="flex items-center gap-3 text-xs">
                <input
                  type="checkbox"
                  checked={selected.includes(event.id)}
                  onChange={() =>
                    setSelected((previous) =>
                      previous.includes(event.id)
                        ? previous.filter((id) => id !== event.id)
                        : [...previous, event.id],
                    )
                  }
                />
                {eventName(event)} · {dateLabel(event.date)}
              </label>
            ))}
          <Button disabled={!name || pending} onClick={save}>
            {pending ? "Creando…" : "Crear jornada"}
          </Button>
        </Surface>
      </>
    )
  if (!jornada)
    return (
      <Empty
        title="Jornada no encontrada"
        detail="Esta jornada no está disponible."
      />
    )
  const events = state.events.filter((event) =>
    jornada.events.includes(event.id),
  )
  const mutable = events.every(
    (event) =>
      !["COMPLETED", "ABANDONED"].includes(event.state) &&
      (capabilities.official || event.team === actor.team),
  )
  return (
    <>
      <Header
        back="/calendar"
        eyebrow="Jornada · Temporada 2026"
        title={jornada.name}
        description="Los estados de cada partido se gestionan desde el evento."
      />
      <Section title="Partidos">
        <Surface>
          {events.map((event) => (
            <RowLink
              key={event.id}
              to={`/events/${event.id}`}
              title={eventName(event)}
              detail={`${dateLabel(event.date)} · ${event.time} · ${event.venue}`}
              aside={<Badge value={event.state} />}
            />
          ))}
        </Surface>
      </Section>
      <Surface className="mt-6 max-w-2xl space-y-4 p-6">
        <h2 className="text-sm font-semibold">Cambiar sede de la jornada</h2>
        <Select
          label="Nueva sede"
          value={venue}
          onChange={(event) => setVenue(event.target.value)}
        >
          {state.structure
            .filter((item) => item.type === "Sede" && !item.archived)
            .map((item) => (
              <option key={item.id}>{item.name}</option>
            ))}
        </Select>
        <Button
          disabled={!mutable || !events.length}
          onClick={() => setPreview(true)}
        >
          Revisar impacto
        </Button>
        {!mutable && (
          <p className="text-xs text-muted-foreground">
            Hay partidos finalizados o fuera de tu alcance. No se puede ejecutar
            el cambio conjunto.
          </p>
        )}
      </Surface>
      {preview && (
        <Modal
          title="Cambiar sede de la jornada"
          onClose={() => setPreview(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setPreview(false)}>
                Volver
              </Button>
              <Button
                disabled={pending}
                onClick={async () => {
                  setPending(true)
                  await wait()
                  update(
                    (draft) => {
                      draft.events
                        .filter((event) => jornada.events.includes(event.id))
                        .forEach((event) => {
                          event.venue = venue
                          event.revision++
                          event.version++
                          event.history.unshift(
                            `Cambio de sede de jornada · ${actor.name}`,
                          )
                        })
                    },
                    "Cambiar sede de jornada",
                    jornada.name,
                  )
                  events.forEach((event) =>
                    notify(
                      "Evento modificado",
                      `La nueva sede de ${eventName(event)} es ${venue}.`,
                      `/events/${event.id}`,
                    ),
                  )
                  setPending(false)
                  setPreview(false)
                  toast("Sede actualizada en todos los partidos de la jornada")
                }}
              >
                {pending ? "Confirmando…" : "Confirmar cambio"}
              </Button>
            </>
          }
        >
          <Alert tone="info">
            El cambio se aplica conjuntamente a {events.length} partido. Todas
            las respuestas existentes necesitarán reconfirmación.
          </Alert>
          <p className="mt-4 text-sm font-semibold">Nueva sede: {venue}</p>
          {events.map((event) => (
            <div key={event.id} className="mt-4">
              <h3 className="mb-2 text-xs font-semibold">{eventName(event)}</h3>
              <ImpactContent event={event} patch={{ venue }} count={19} />
            </div>
          ))}
        </Modal>
      )}
    </>
  )
}
