import { useEffect, useRef, useState } from "react"
import {
  Check,
  X,
  HelpCircle,
  Users,
  Send,
  CheckCircle2,
  Search,
  ShieldAlert,
} from "lucide-react"
import { useProduct, canOperateEvent, wait } from "../mock/store"
import { useEvent } from "./events"
import { scenario } from "../mock/scenarios"
import {
  availabilityLabel,
  eventName,
  dateLabel,
  labels,
  type Response,
  type AttendanceValue,
  type PlayerStat,
} from "../mock/model"
import {
  Header,
  Surface,
  Badge,
  Button,
  Alert,
  Avatar,
  Modal,
  Empty,
  Saved,
  TextField,
  TextArea,
  Select,
} from "../shared/ui"

export function AvailabilityPage() {
  const { event, state, actor, capabilities, updateEvent, toast } = useEvent()
  const [pending, setPending] = useState(false)
  const [query, setQuery] = useState("")
  if (
    !event ||
    (event.team !== actor.team && !event.clubWide && !capabilities.official)
  )
    return (
      <Empty
        title="Disponibilidad no disponible"
        detail="No tenés acceso a este evento."
      />
    )
  const previous = event.availability[actor.id]
  const stale = previous && previous.revision !== event.revision
  const people = state.people.filter(
    (person) =>
      person.team === event.team && ["PLAYER", "CAPTAIN"].includes(person.role),
  )
  async function respond(value: Response) {
    if (!event) return
    setPending(true)
    await wait()
    updateEvent(
      event.id,
      (item) =>
        (item.availability[actor.id] = { value, revision: item.revision }),
      "Responder disponibilidad",
    )
    setPending(false)
    toast("Tu disponibilidad quedó confirmada")
  }
  return (
    <>
      <Header
        back={`/events/${event.id}`}
        eyebrow={`${eventName(event)} · ${dateLabel(event.date)} · ${event.time}`}
        title="Disponibilidad"
        description="Las respuestas previas no determinan la convocatoria ni la asistencia."
      />
      <div className="max-w-3xl space-y-6">
        {capabilities.availability && (
          <Surface className="space-y-5 p-6">
            <h2 className="text-base font-semibold">¿Podés participar?</h2>
            {stale && (
              <Alert>
                <strong>Necesita reconfirmación</strong>
                <p className="mt-1">
                  El evento cambió desde tu última respuesta. Tu respuesta
                  anterior fue {labels[previous.value]}. Confirmá nuevamente
                  para este horario.
                </p>
              </Alert>
            )}
            {previous && !stale && (
              <p className="text-xs text-muted-foreground">
                Tu última respuesta confirmada:{" "}
                <strong>{labels[previous.value]}</strong>
              </p>
            )}
            <div className="grid grid-cols-3 gap-3">
              {(["YES", "MAYBE", "NO"] as const).map((value) => (
                <button
                  key={value}
                  disabled={pending || event.state !== "SCHEDULED"}
                  onClick={() => respond(value)}
                  className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-colors disabled:opacity-45 ${
                    previous?.value === value && !stale
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border hover:border-primary/40 hover:bg-primary-soft/30"
                  }`}
                >
                  {value === "YES" ? (
                    <Check size={20} />
                  ) : value === "NO" ? (
                    <X size={20} />
                  ) : (
                    <HelpCircle size={20} />
                  )}
                  {labels[value]}
                </button>
              ))}
            </div>
            {pending && <Saved saving />}
            {event.state !== "SCHEDULED" && (
              <Alert tone="info">
                Este evento no está programado. Se conservan las respuestas
                previas, pero no se pueden registrar nuevas confirmaciones.
              </Alert>
            )}
          </Surface>
        )}
        {(capabilities.sport ||
          capabilities.official ||
          actor.role === "CAPTAIN") && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-sm font-semibold">
                Respuestas del equipo · {people.length}
              </h2>
              <input
                aria-label="Buscar jugadora"
                placeholder="Buscar jugadora…"
                className="rounded-lg border border-border bg-card px-3 py-2 text-xs"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <Surface>
              {people
                .filter((person) =>
                  person.name.toLowerCase().includes(query.toLowerCase()),
                )
                .map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center gap-3 border-b border-border p-4 last:border-0"
                  >
                    <Avatar name={person.name} size="sm" />
                    <span className="flex-1 text-xs font-medium">
                      {person.name}
                    </span>
                    <Badge
                      value={
                        event.availability[person.id]?.revision !==
                        event.revision
                          ? "RECONFIRM"
                          : event.availability[person.id]?.value
                      }
                    >
                      {availabilityLabel(event, person.id)}
                    </Badge>
                  </div>
                ))}
            </Surface>
          </>
        )}
      </div>
    </>
  )
}

export function SelectionPage() {
  const { event, state, actor, updateEvent, notify, toast } = useEvent()
  const [selected, setSelected] = useState(event?.selection || [])
  const [saveState, setSaveState] = useState("Guardado")
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [confirm, setConfirm] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState("")
  const initialized = useRef(false)
  const saving = useRef<Promise<void> | null>(null)
  const generation = useRef(0)
  const allowed =
    event && canOperateEvent(actor, event) && event.type === "MATCH"
  const mutable = event?.state === "SCHEDULED"
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      return
    }
    if (!event || !allowed || !mutable) return
    setSaveState("Cambios pendientes")
    const current = ++generation.current
    const timer = setTimeout(() => {
      setSaveState("Guardando…")
      saving.current = wait().then(() => {
        if (current !== generation.current) return
        if (scenario === "save-error") {
          setSaveState("Error al guardar")
          setError(
            "No pudimos guardar el borrador. Tu selección se conserva; podés publicar el estado deseado cuando estés lista.",
          )
        } else {
          updateEvent(event.id, (item) => (item.selection = selected))
          setSaveState("Guardado")
        }
        saving.current = null
      })
    }, 600)
    return () => clearTimeout(timer)
  }, [selected])
  if (!event || event.type !== "MATCH" || event.team !== actor.team)
    return (
      <Empty
        title="Convocatoria no disponible"
        detail="La convocatoria corresponde a un partido dentro del alcance del equipo."
      />
    )
  if (!allowed)
    return (
      <>
        <Header
          back={`/events/${event.id}`}
          eyebrow={`${eventName(event)} · ${dateLabel(event.date)}`}
          title="Convocatoria"
          description="Versión publicada para este partido."
        />
        {event.published ? (
          <Surface>
            <div className="flex items-center justify-between border-b border-border p-5">
              <span className="text-xs font-semibold">
                {event.published.length} jugadoras convocadas
              </span>
              <Badge value="PUBLISHED" />
            </div>
            {event.published.map((id) => {
              const person = state.people.find((item) => item.id === id)
              return (
                person && (
                  <div
                    key={id}
                    className="flex items-center gap-3 border-b border-border p-4 last:border-0"
                  >
                    <Avatar name={person.name} size="sm" />
                    <span className="text-xs font-medium">{person.name}</span>
                  </div>
                )
              )
            })}
          </Surface>
        ) : (
          <Empty
            title="Todavía no se publicó la convocatoria"
            detail="El entrenador está preparando la selección para este partido."
          />
        )}
      </>
    )
  const people = state.people.filter(
    (person) =>
      person.team === event.team && ["PLAYER", "CAPTAIN"].includes(person.role),
  )
  const blocked = selected.filter((id) => {
    const person = people.find((item) => item.id === id)
    return !person || person.eligibility !== "ELIGIBLE"
  })
  const publishedConflicts = (event.published || []).filter(
    (id) =>
      !people.some(
        (person) => person.id === id && person.eligibility === "ELIGIBLE",
      ),
  )
  const visible = people.filter(
    (person) =>
      person.name.toLowerCase().includes(query.toLowerCase()) &&
      (filter === "all" || selected.includes(person.id)),
  )
  async function publish() {
    if (!event) return
    if (blocked.length) {
      setError(
        `No se puede publicar la convocatoria porque ${blocked.length} jugadora tiene un bloqueo o una situación pendiente actual.`,
      )
      return
    }
    setPublishing(true)
    if (saving.current) await saving.current
    await wait()
    generation.current++
    updateEvent(
      event.id,
      (item) => {
        item.selection = selected
        item.published = [...selected]
        item.selectionRevisions.push({
          id: crypto.randomUUID(),
          players: [...selected],
          author: actor.name,
          date: "2 oct 2026 · Ahora",
        })
      },
      "Publicar convocatoria",
    )
    notify(
      "Convocatoria publicada",
      `${eventName(event)} · ${selected.length} jugadoras convocadas`,
      `/events/${event.id}`,
    )
    setPublishing(false)
    setConfirm(false)
    setSaveState("Guardado")
    toast("Convocatoria publicada")
  }
  return (
    <>
      <Header
        back={`/events/${event.id}`}
        eyebrow={`${eventName(event)} · ${dateLabel(event.date)} · ${event.time}`}
        title="Convocatoria"
        description="Disponibilidad y elegibilidad son información independiente."
        action={<Badge value={event.published ? "PUBLISHED" : "DRAFT"} />}
      />
      <div className="max-w-4xl space-y-5">
        {publishedConflicts.length > 0 && (
          <Alert tone="error">
            Esta convocatoria tiene {publishedConflicts.length} situación para
            revisar. La publicación anterior se conserva.
          </Alert>
        )}
        {!mutable && (
          <Alert tone="info">
            Sólo se puede publicar una convocatoria cuando el partido está
            programado. La versión publicada se conserva.
          </Alert>
        )}
        {event.published && (
          <Alert tone="success">
            Publicada · {event.published.length} jugadoras. Los cambios actuales
            se guardan como borrador hasta una nueva publicación.
          </Alert>
        )}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="w-full sm:w-64">
            <TextField
              label="Buscar jugadora"
              placeholder="Nombre o apellido…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <select
              aria-label="Filtrar convocatoria"
              className="rounded-lg border border-border bg-card p-2 text-xs"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">Todo el equipo</option>
              <option value="selected">Seleccionadas</option>
            </select>
            <span role="status" className="text-[11px] text-muted-foreground">
              {saveState === "Guardado" && (
                <Check className="mr-1 inline text-success" size={13} />
              )}
              {saveState}
            </span>
          </div>
        </div>
        <Surface>
          <div className="hidden grid-cols-[1fr_180px_100px_80px] border-b border-border bg-muted/40 px-5 py-3 text-[10px] font-medium text-muted-foreground sm:grid">
            <span>JUGADORA</span>
            <span>DISPONIBILIDAD</span>
            <span>ELEGIBILIDAD</span>
            <span className="text-right">SELECCIÓN</span>
          </div>
          {visible.map((person) => {
            const checked = selected.includes(person.id)
            const ineligible = person.eligibility !== "ELIGIBLE"
            return (
              <label
                key={person.id}
                className={`flex cursor-pointer flex-wrap items-center gap-3 border-b border-border p-4 last:border-0 sm:grid sm:grid-cols-[1fr_180px_100px_80px] sm:px-5 ${
                  checked ? "bg-primary-soft/40" : "hover:bg-muted/30"
                }`}
              >
                <span className="flex min-w-0 flex-1 items-center gap-3">
                  <Avatar name={person.name} size="sm" />
                  <span>
                    <span className="block text-xs font-semibold">
                      {person.name}
                    </span>
                    {person.role === "CAPTAIN" && (
                      <span className="mt-1 block text-[10px] text-muted-foreground">
                        Capitana
                      </span>
                    )}
                    {ineligible && (
                      <span className="mt-1 block text-[10px] text-danger">
                        No puede seleccionarse
                      </span>
                    )}
                  </span>
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {availabilityLabel(event, person.id)}
                </span>
                <Badge value={person.eligibility} />
                <input
                  type="checkbox"
                  aria-label={`Seleccionar a ${person.name}`}
                  checked={checked}
                  disabled={!allowed || !mutable || (ineligible && !checked)}
                  onChange={() => {
                    setError("")
                    setSelected((previous) =>
                      previous.includes(person.id)
                        ? previous.filter((id) => id !== person.id)
                        : [...previous, person.id],
                    )
                  }}
                  className="ml-auto size-4 accent-primary sm:justify-self-end"
                />
              </label>
            )
          })}
        </Surface>
        {error && <Alert tone="error">{error}</Alert>}
        {allowed && (
          <div className="sticky bottom-20 flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm lg:bottom-4">
            <span className="text-xs">
              <strong className="text-base text-primary">
                {selected.length}
              </strong>{" "}
              jugadoras seleccionadas
            </span>
            <Button
              disabled={!mutable || !selected.length || publishing}
              onClick={() => {
                if (blocked.length)
                  setError(
                    `No se puede publicar: ${blocked.length} jugadora tiene elegibilidad bloqueada o pendiente.`,
                  )
                else setConfirm(true)
              }}
            >
              <Send size={14} />
              {event.published
                ? "Publicar actualización"
                : "Publicar convocatoria"}
            </Button>
          </div>
        )}
      </div>
      {confirm && (
        <Modal
          title="Publicar convocatoria"
          onClose={() => !publishing && setConfirm(false)}
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setConfirm(false)}
                disabled={publishing}
              >
                Volver
              </Button>
              <Button onClick={publish} disabled={publishing}>
                {publishing ? "Publicando…" : "Confirmar publicación"}
              </Button>
            </>
          }
        >
          <p className="text-sm">
            Se publicará la convocatoria de{" "}
            <strong>{selected.length} jugadoras</strong> para {eventName(event)}
            .
          </p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            La publicación queda registrada y las personas correspondientes
            recibirán una notificación. La disponibilidad no cambia.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {people
              .filter((person) => selected.includes(person.id))
              .map((person) => (
                <span
                  key={person.id}
                  className="rounded-md bg-muted px-2 py-1 text-[10px]"
                >
                  {person.name}
                </span>
              ))}
          </div>
        </Modal>
      )}
    </>
  )
}

export function AttendancePage() {
  const { event, state, actor, updateEvent, toast } = useEvent()
  const [confirm, setConfirm] = useState(false)
  const [correction, setCorrection] = useState(false)
  const [reason, setReason] = useState("")
  const [pending, setPending] = useState(false)
  const [entries, setEntries] = useState(event?.attendance || {})
  const [query, setQuery] = useState("")
  if (!event || event.type === "CLUB_EVENT" || !canOperateEvent(actor, event))
    return (
      <Empty
        title="Asistencia no disponible"
        detail="La asistencia requiere autoridad deportiva y corresponde a entrenamientos o partidos."
      />
    )
  const people = state.people.filter(
    (person) =>
      person.team === event.team && ["PLAYER", "CAPTAIN"].includes(person.role),
  )
  const unrecorded = people.filter(
    (person) => !(correction ? entries : event.attendance)[person.id],
  ).length
  const canOpen = ["SCHEDULED", "IN_PROGRESS"].includes(event.state)
  const canMark = event.attendanceOpened && !event.attendanceClosed
  async function mark(id: string, value: AttendanceValue) {
    if (!event) return
    if (correction) {
      setEntries((previous) => ({ ...previous, [id]: value }))
      return
    }
    setPending(true)
    await wait(130)
    updateEvent(event.id, (item) => (item.attendance[id] = value))
    setPending(false)
  }
  async function close() {
    if (!event) return
    setPending(true)
    await wait()
    updateEvent(
      event.id,
      (item) => (item.attendanceClosed = true),
      "Cerrar asistencia",
    )
    setConfirm(false)
    setPending(false)
    toast(
      "Asistencia cerrada. Los registros faltantes se conservan como Sin registrar.",
    )
  }
  return (
    <>
      <Header
        back={`/events/${event.id}`}
        eyebrow={`${eventName(event)} · ${dateLabel(event.date)}`}
        title="Asistencia"
        description="Registrá la presencia real. Sin registrar no significa ausente."
        action={
          <Badge value={event.attendanceClosed ? "CLOSED" : "DRAFT"}>
            {correction
              ? "Corrección de asistencia cerrada"
              : event.attendanceClosed
                ? "Cerrada"
                : event.attendanceOpened
                  ? "Abierta"
                  : "Sin abrir"}
          </Badge>
        }
      />
      <div className="max-w-4xl space-y-5">
        {!event.attendanceOpened ? (
          <Empty
            title="La asistencia todavía no se abrió"
            detail={
              canOpen
                ? "Abrí la planilla para registrar la presencia de cada jugadora."
                : "Sólo puede abrirse con el evento programado o en curso."
            }
          >
            <Button
              disabled={!canOpen || pending}
              onClick={async () => {
                setPending(true)
                await wait()
                updateEvent(
                  event.id,
                  (item) => (item.attendanceOpened = true),
                  "Abrir asistencia",
                )
                setPending(false)
              }}
            >
              Abrir asistencia
            </Button>
          </Empty>
        ) : (
          <>
            {event.attendanceClosed && !correction && (
              <Alert tone="success">
                Asistencia cerrada. Para modificar un registro, iniciá una
                corrección con motivo.
              </Alert>
            )}
            {correction && (
              <Alert tone="info">
                Estás corrigiendo una asistencia cerrada. El cierre original se
                conserva y el motivo queda en el historial.
              </Alert>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap gap-4">
                <span>
                  <strong className="text-success">
                    {
                      Object.values(
                        correction ? entries : event.attendance,
                      ).filter((value) => value === "PRESENT").length
                    }
                  </strong>{" "}
                  presentes
                </span>
                <span>
                  <strong>
                    {
                      Object.values(
                        correction ? entries : event.attendance,
                      ).filter((value) => value === "ABSENT").length
                    }
                  </strong>{" "}
                  ausentes
                </span>
                <span>
                  <strong>
                    {
                      Object.values(
                        correction ? entries : event.attendance,
                      ).filter((value) => value === "JUSTIFIED").length
                    }
                  </strong>{" "}
                  justificadas
                </span>
                <span className="text-muted-foreground">
                  {unrecorded} sin registrar
                </span>
              </div>
              <input
                aria-label="Buscar jugadora"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar jugadora…"
                className="rounded-lg border border-border bg-card p-2 text-xs"
              />
            </div>
            <Surface>
              {people
                .filter((person) =>
                  person.name.toLowerCase().includes(query.toLowerCase()),
                )
                .map((person) => {
                  const value = (correction ? entries : event.attendance)[
                    person.id
                  ]
                  return (
                    <div
                      key={person.id}
                      className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={person.name} size="sm" />
                        <span>
                          <span className="block text-xs font-semibold">
                            {person.name}
                          </span>
                          <span className="mt-1 block text-[10px] text-muted-foreground">
                            {value ? labels[value] : "Sin registrar"}
                          </span>
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        {(["PRESENT", "ABSENT", "JUSTIFIED"] as const).map(
                          (option) => (
                            <button
                              key={option}
                              disabled={pending || (!canMark && !correction)}
                              onClick={() => mark(person.id, option)}
                              className={`min-h-9 rounded-md border px-2.5 py-1 text-[10px] font-medium disabled:opacity-50 ${
                                option === value
                                  ? option === "PRESENT"
                                    ? "border-success/20 bg-success-soft text-success"
                                    : option === "ABSENT"
                                      ? "border-danger/20 bg-danger-soft text-danger"
                                      : "border-primary/20 bg-primary-soft text-primary"
                                  : "border-border bg-card text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              {labels[option]}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  )
                })}
            </Surface>
            {correction && (
              <TextArea
                label="Motivo de la corrección (obligatorio)"
                value={reason}
                onChange={setReason}
                required
              />
            )}
            <div className="sticky bottom-20 flex justify-end gap-2 rounded-xl border border-border bg-card p-4 lg:bottom-4">
              {event.attendanceClosed ? (
                correction ? (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => setCorrection(false)}
                      disabled={pending}
                    >
                      Volver
                    </Button>
                    <Button
                      disabled={!reason.trim() || pending}
                      onClick={async () => {
                        setPending(true)
                        await wait()
                        updateEvent(
                          event.id,
                          (item) => (item.attendance = entries),
                          "Corregir asistencia",
                          reason,
                        )
                        setPending(false)
                        setCorrection(false)
                        toast("Corrección guardada con su motivo")
                      }}
                    >
                      {pending ? "Guardando…" : "Guardar corrección"}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEntries(event.attendance)
                      setCorrection(true)
                    }}
                  >
                    Corregir asistencia
                  </Button>
                )
              ) : (
                <Button disabled={pending} onClick={() => setConfirm(true)}>
                  Cerrar asistencia
                </Button>
              )}
            </div>
          </>
        )}
      </div>
      {confirm && (
        <Modal
          title="Cerrar asistencia"
          onClose={() => !pending && setConfirm(false)}
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setConfirm(false)}
                disabled={pending}
              >
                Volver
              </Button>
              <Button disabled={pending} onClick={close}>
                {pending
                  ? "Cerrando…"
                  : unrecorded
                    ? "Cerrar igualmente"
                    : "Confirmar cierre"}
              </Button>
            </>
          }
        >
          <Alert tone={unrecorded ? "warning" : "info"}>
            {unrecorded
              ? `Quedan ${unrecorded} jugadoras sin registrar.`
              : "Todas las jugadoras tienen un registro."}
          </Alert>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Si cerrás la asistencia, las jugadoras sin registro seguirán
            figurando como Sin registrar. No se convertirán en ausentes.
          </p>
        </Modal>
      )}
    </>
  )
}

export function MatchRecordPage() {
  const { event, state, actor, updateEvent, toast } = useEvent()
  const [record, setRecord] = useState(event?.record)
  const [correction, setCorrection] = useState(false)
  const [reason, setReason] = useState("")
  const [confirm, setConfirm] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  if (
    !event ||
    !record ||
    event.type !== "MATCH" ||
    !canOperateEvent(actor, event)
  )
    return (
      <Empty
        title="Resultado no disponible"
        detail="El registro de partido requiere autoridad deportiva sobre este evento."
      />
    )
  const people = state.people.filter(
    (person) =>
      person.team === event.team && ["PLAYER", "CAPTAIN"].includes(person.role),
  )
  const final = event.record.state === "FINAL"
  const canEdit =
    correction ||
    (!final && ["IN_PROGRESS", "COMPLETED", "ABANDONED"].includes(event.state))
  function stat(id: string, patch: Partial<PlayerStat>) {
    setRecord((previous) =>
      previous
        ? {
            ...previous,
            stats: {
              ...previous.stats,
              [id]: {
                ...(previous.stats[id] || {
                  played: false,
                  goals: 0,
                  assists: 0,
                }),
                ...patch,
              },
            },
          }
        : previous,
    )
  }
  async function save(finalize: boolean) {
    if (!event || !record) return
    if (correction && !reason.trim()) {
      setError("Indicá el motivo de la corrección.")
      return
    }
    const goals = Object.values(record.stats).reduce(
      (total, value) => total + (value.played ? value.goals : 0),
      0,
    )
    if (record.status === "PLAYED" && goals > record.gei) {
      setError(
        "Los goles de las jugadoras no pueden superar el resultado de GEI.",
      )
      return
    }
    setPending(true)
    await wait()
    updateEvent(
      event.id,
      (item) => {
        item.record = {
          ...record,
          state: finalize || final ? "FINAL" : "DRAFT",
          stats:
            record.status === "PLAYED"
              ? Object.fromEntries(
                  Object.entries(record.stats).filter(
                    ([, value]) => value.played,
                  ),
                )
              : {},
        }
        if (finalize && !final)
          item.state = record.status === "ABANDONED" ? "ABANDONED" : "COMPLETED"
      },
      correction
        ? "Corregir resultado final"
        : finalize
          ? "Finalizar resultado"
          : "Guardar resultado borrador",
      reason,
    )
    setConfirm(false)
    setCorrection(false)
    setPending(false)
    toast(
      correction
        ? "Corrección guardada. El resultado sigue siendo Final."
        : finalize
          ? "Resultado final registrado"
          : "Borrador del resultado guardado",
    )
  }
  return (
    <>
      <Header
        back={`/events/${event.id}`}
        eyebrow={`${eventName(event)} · ${dateLabel(event.date)}`}
        title="Resultado y estadísticas"
        description="Las jugadoras que participaron se registran explícitamente, no desde la asistencia."
        action={
          <Badge value={final ? "FINAL" : "DRAFT"}>
            {final
              ? correction
                ? "Corrección · Final"
                : "Resultado final"
              : "Borrador"}
          </Badge>
        }
      />
      <div className="max-w-4xl space-y-6">
        {!canEdit && !final && (
          <Alert tone="info">
            El resultado puede registrarse cuando el partido esté en curso,
            completado o abandonado. Iniciá el evento desde su detalle.
          </Alert>
        )}
        {final && (
          <Alert tone="success">
            Resultado final: GEI {event.record.gei} – {event.record.opponent}{" "}
            {event.opponent}. El partido no se reabre.
          </Alert>
        )}
        <Surface className="space-y-6 p-6">
          <div className="grid gap-5 sm:grid-cols-3">
            <TextField
              label="Goles GEI"
              type="number"
              min={0}
              disabled={!canEdit}
              value={record.gei}
              onChange={(event) =>
                setRecord({
                  ...record,
                  gei: Math.max(0, Number(event.target.value)),
                })
              }
            />
            <TextField
              label={`Goles ${event.opponent}`}
              type="number"
              min={0}
              disabled={!canEdit}
              value={record.opponent}
              onChange={(event) =>
                setRecord({
                  ...record,
                  opponent: Math.max(0, Number(event.target.value)),
                })
              }
            />
            <Select
              label="Estado del resultado"
              value={record.status}
              disabled={!canEdit || final}
              onChange={(event) =>
                setRecord({
                  ...record,
                  status: event.target.value as typeof record.status,
                })
              }
            >
              <option value="PLAYED">Jugado</option>
              <option value="FORFEIT">No presentación</option>
              <option value="ABANDONED">Abandonado</option>
            </Select>
          </div>
          {canEdit ? (
            <TextArea
              label="Observaciones"
              value={record.observations}
              onChange={(value) =>
                setRecord({ ...record, observations: value })
              }
            />
          ) : (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {record.observations || "Sin observaciones registradas."}
            </p>
          )}
        </Surface>
        {record.status === "PLAYED" && (
          <>
            <h2 className="text-sm font-semibold">
              Participación real · Goles y asistencias
            </h2>
            <Surface>
              <div className="grid grid-cols-[1fr_50px_55px_55px] gap-2 border-b border-border bg-muted/40 p-4 text-[9px] font-semibold text-muted-foreground sm:grid-cols-[1fr_80px_80px_80px]">
                <span>JUGADORA</span>
                <span>JUGÓ</span>
                <span>GOLES</span>
                <span>ASIST.</span>
              </div>
              {people.map((person) => (
                <div
                  key={person.id}
                  className="grid grid-cols-[1fr_50px_55px_55px] items-center gap-2 border-b border-border p-4 last:border-0 sm:grid-cols-[1fr_80px_80px_80px]"
                >
                  <span className="text-xs font-medium">{person.name}</span>
                  <input
                    aria-label={`${person.name} jugó`}
                    type="checkbox"
                    disabled={!canEdit}
                    checked={record.stats[person.id]?.played || false}
                    onChange={(event) =>
                      stat(person.id, {
                        played: event.target.checked,
                        ...(!event.target.checked
                          ? { goals: 0, assists: 0 }
                          : {}),
                      })
                    }
                    className="size-4 accent-primary"
                  />
                  {(["goals", "assists"] as const).map((field) => (
                    <input
                      key={field}
                      aria-label={`${person.name} ${
                        field === "goals" ? "goles" : "asistencias"
                      }`}
                      type="number"
                      min={0}
                      value={record.stats[person.id]?.[field] || 0}
                      disabled={!canEdit || !record.stats[person.id]?.played}
                      onChange={(event) =>
                        stat(person.id, {
                          [field]: Math.max(0, Number(event.target.value)),
                        })
                      }
                      className="w-full rounded-md border border-border px-2 py-1.5 text-xs disabled:bg-muted disabled:text-muted-foreground"
                    />
                  ))}
                </div>
              ))}
            </Surface>
          </>
        )}
        {correction && (
          <TextArea
            label="Motivo de corrección (obligatorio)"
            value={reason}
            onChange={setReason}
            required
          />
        )}
        {error && <Alert tone="error">{error}</Alert>}
        <div className="sticky bottom-20 flex justify-end gap-3 rounded-xl border border-border bg-card p-4 lg:bottom-4">
          {final && !correction ? (
            <Button variant="secondary" onClick={() => setCorrection(true)}>
              Corregir resultado
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                disabled={!canEdit || pending}
                onClick={() =>
                  correction ? setCorrection(false) : save(false)
                }
              >
                {correction ? "Volver" : "Guardar borrador"}
              </Button>
              <Button
                disabled={!canEdit || pending || (correction && !reason.trim())}
                onClick={() => (correction ? save(true) : setConfirm(true))}
              >
                {pending
                  ? "Guardando…"
                  : correction
                    ? "Guardar corrección"
                    : "Finalizar resultado"}
              </Button>
            </>
          )}
        </div>
      </div>
      {confirm && (
        <Modal
          title="Finalizar resultado"
          onClose={() => !pending && setConfirm(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setConfirm(false)}>
                Volver
              </Button>
              <Button disabled={pending} onClick={() => save(true)}>
                {pending ? "Finalizando…" : "Confirmar resultado final"}
              </Button>
            </>
          }
        >
          <p className="text-center text-3xl font-bold">
            GEI {record.gei} – {record.opponent} {event.opponent}
          </p>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            El resultado quedará como Final y el evento pasará a{" "}
            {record.status === "ABANDONED" ? "Abandonado" : "Finalizado"}. Sólo
            podrán hacerse correcciones explícitas con un motivo.
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
