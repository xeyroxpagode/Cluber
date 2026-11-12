import { useEffect, useMemo, useRef, useState } from "react"
import {
  Save,
  CalendarPlus,
} from "lucide-react"
import { useFetch } from "../lib/use-fetch"
import {
  fetchCalendarRange,
  fetchCancelEvent,
  fetchCreateEvent,
  fetchCreateEventSeries,
  fetchCreateJornada,
  fetchEditEventMeta,
  fetchUpdateLogistics,
  fetchEndEventSeries,
  fetchEventDetail,
  fetchEventSeriesDetail,
  fetchJornadaDetail,
  fetchMaterialChangeEvent,
  fetchPostponeEvent,
  fetchRescheduleEvent,
  fetchResolveEventConflict,
  fetchRestoreEvent,
  type EventDto,
  type EventDetailDto,
} from "../lib/t03-api"
import { Link, useNavigate, useParams, useLocation } from "react-router"
import { fetchStructure } from "../lib/api-client"
import { me as fetchMe } from "../lib/session"
import { dateLabel, dateTimeLabel, timeLabel } from "../lib/dates"
import { zonedLocalInputToIso, utcIsoToZonedParts } from "../lib/zoned-input"
import {
  Banner,
  Button,
  ConfirmDialog,
  Empty,
  Menu,
  Modal,
  RadioGroup,
  RowLink,
  RowStatic,
  Select,
  Sheet,
  StateBadge,
  Surface,
  Tag,
  TextArea,
  TextField,
  cx,
} from "../shared/ui"
import {
  DetailSection,
  ImpactPreview,
  PageContextHeader,
  ScopeDialog,
  SectionHeader,
  StateBanner,
} from "../shared/patterns"
import { VasControl } from "../shared/vas"

const TYPE_LABEL: Record<EventDto["type"], string> = {
  MATCH: "Partido",
  TRAINING: "Entrenamiento",
  CLUB_EVENT: "Evento del club",
}

const CANONICAL_ZONES = [
  "America/Argentina/Buenos_Aires",
  "America/Santiago",
  "America/Montevideo",
  "America/Sao_Paulo",
  "America/Lima",
  "America/Bogota",
  "America/Mexico_City",
  "Europe/Madrid",
  "UTC",
]

const TERMINAL = new Set(["CANCELLED", "COMPLETED", "ABANDONED"])

function startEndFromDto(item: EventDto) {
  const from = item.startAt ? new Date(item.startAt) : null
  const to = item.endAt ? new Date(item.endAt) : null
  return {
    date: from ? from.toISOString().slice(0, 10) : "",
    time: from ? timeLabel(from.toISOString()) : "",
    end: to ? timeLabel(to.toISOString()) : "",
  }
}

function localInputToIso(date: string, time: string): string | null {
  if (!date || !time) return null
  const d = new Date(`${date}T${time}:00`)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

function isoToLocalParts(iso: string | null): { date: string; time: string } | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  const pad = (n: number) => String(n).padStart(2, "0")
  return { date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, time: `${pad(d.getHours())}:${pad(d.getMinutes())}` }
}

/* ─────────────────────────────────────────────
   Conflict workspace — nunca destruye el borrador
   ───────────────────────────────────────────── */

const FIELD_LABEL: Record<string, string> = {
  title: "Título",
  date: "Fecha",
  time: "Hora de inicio",
  end: "Hora de fin",
  venueId: "Sede",
  targetTeams: "Equipos destino",
  targetPersonIds: "Personas destino",
  clubWideTarget: "Destino",
  opponent: "Rival",
  competitionId: "Competencia",
  timeZone: "Zona horaria",
  logistics: "Logística",
}

interface DraftLike { [key: string]: unknown }

function ConflictWorkspace({ baseline, local, latest, onKeepMine, onTakeLatest, onClose }: {
  baseline: DraftLike
  local: DraftLike
  latest: DraftLike
  onKeepMine: () => void
  onTakeLatest: () => void
  onClose: () => void
}) {
  const keys = Array.from(new Set([...Object.keys(local), ...Object.keys(latest)])).filter((k) => FIELD_LABEL[k])
  const rows = keys.map((key) => ({
    key, label: FIELD_LABEL[key],
    mine: String(local[key] ?? "—"),
    theirs: String(latest[key] ?? "—"),
    base: String(baseline[key] ?? "—"),
    safe: String(baseline[key] ?? "") === String(latest[key] ?? ""),
  }))
  return (
    <Modal
      title="Este evento cambió mientras lo editabas"
      description="Tus cambios siguen guardados. Elegí cómo seguir."
      onClose={onClose}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onTakeLatest}>Actualizar con la versión actual</Button>
          <Button variant="primary" onClick={onKeepMine}>Mantener mis cambios donde sea seguro</Button>
        </>
      }
    >
      <div className="grid gap-4">
        <Banner tone="attention" title="No se perdió nada de lo que escribiste">
          <span className="text-ink-strong">Abajo comparamos la versión con la que empezaste, tus cambios y la versión actual del club.</span>
        </Banner>
        <div className="grid gap-3 lg:grid-cols-3">
          <VersionColumn title="Con la que empezaste" rows={rows.map((row) => ({ label: row.label, value: row.base }))} />
          <VersionColumn title="Tus cambios" rows={rows.map((row) => ({ label: row.label, value: row.mine, changed: row.mine !== row.base }))} />
          <VersionColumn title="La versión actual" rows={rows.map((row) => ({ label: row.label, value: row.theirs, changed: row.theirs !== row.base }))} />
        </div>
      </div>
    </Modal>
  )
}

function VersionColumn({ title, rows }: { title: string; rows: Array<{ label: string; value: string; changed?: boolean }> }) {
  return (
    <div className="grid content-start gap-2 rounded-surface border border-line bg-surface p-3">
      <p className="text-meta font-semibold uppercase tracking-wide text-ink-muted">{title}</p>
      <ul className="grid gap-1.5">
        {rows.map((row) => (
          <li key={row.label} className="grid gap-0.5">
            <span className="text-micro uppercase tracking-wide text-ink-faint">{row.label}</span>
            <span className={cx("text-body tabular-nums", row.changed ? "font-semibold text-ink" : "text-ink-muted")}>{row.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ─────────────────────────────────────────────
   DETALLE DE EVENTO
   ───────────────────────────────────────────── */

export function EventDetail() {
  const { eventId = "" } = useParams()
  const navigate = useNavigate()
  const [sheet, setSheet] = useState<null | "lifecycle" | "history">(null)
  const [lifecycleError, setLifecycleError] = useState("")
  const [pendingAction, setPendingAction] = useState<string | null>(null)

  const { data: event, loading, error, reload } = useFetch(() => fetchEventDetail(eventId), [eventId])
  const { data: me } = useFetch(() => fetchMe(), [])
  const isTerminal = event ? TERMINAL.has(event.state) : false
  const canOperate = useMemo(() => {
    if (!event || !me) return false
    if (me.isSubcommittee) return true
    const assignments = me.roleAssignments ?? []
    const eventScope = assignments.some((r) => r.role === "COACH" && r.scopeType === "EVENT" && r.scopeRefId === event.id)
    const coachTeams = assignments.filter((r) => r.role === "COACH" && r.scopeType === "TEAM").map((r) => r.scopeRefId)
    return Boolean(eventScope || event.targets.teams.some((t) => coachTeams.includes(t.teamId)))
  }, [event, me])
  const canEditLogistics = useMemo(() => {
    if (!event || !me) return false
    if (canOperate) return true
    const captainTeams = (me.roleAssignments ?? []).filter((r) => r.role === "CAPTAIN" && r.scopeType === "TEAM").map((r) => r.scopeRefId)
    return event.targets.teams.some((t) => captainTeams.includes(t.teamId))
  }, [event, me, canOperate])

  async function runTransition(action: "postpone" | "reschedule" | "cancel" | "restore") {
    setPendingAction(action)
    setLifecycleError("")
    try {
      if (action === "postpone") await fetchPostponeEvent(eventId)
      else if (action === "reschedule") await fetchRescheduleEvent(eventId)
      else if (action === "cancel") await fetchCancelEvent(eventId)
      else await fetchRestoreEvent(eventId)
      await reload()
      setSheet(null)
    } catch (err) {
      setLifecycleError(err instanceof Error ? err.message : "No se pudo aplicar el cambio")
    } finally {
      setPendingAction(null)
    }
  }

  if (loading) {
    return <div className="mx-auto max-w-3xl"><p className="gei-meta">Cargando el evento…</p></div>
  }
  if (error || !event) {
    return (
      <div className="mx-auto max-w-3xl">
        <Empty title="Ese evento ya no está" detail="Puede que se haya archivado o que el enlace esté incompleto. Volvé a la agenda." />
        <div className="mt-4"><Button variant="secondary" onClick={() => navigate("/calendar")}>Ir a la agenda</Button></div>
      </div>
    )
  }

  const { date, time } = startEndFromDto(event)
  const venue = event.venue

  return (
    <div className="gei-stack-page mx-auto max-w-4xl">
      <PageContextHeader
        context={TYPE_LABEL[event.type]}
        title={event.type === "MATCH" ? `GEI vs. ${event.opponent ?? "Rival a definir"}` : event.title}
        lead={`${dateLabel(date, true)} · ${event.state === "POSTPONED" ? "sin horario vigente" : time} · ${venue?.name ?? "Sin sede"}`}
        back="/calendar"
        action={
          <div className="flex items-center gap-2">
            <StateBadge value={event.state} />
            {(canOperate || canEditLogistics) && !isTerminal && (
              <Menu
                label="Acciones"
                items={[
                  ...(canOperate ? [{ label: "Editar evento", onSelect: () => navigate(`/events/${event.id}/edit`) }] : []),
                  ...(!canOperate && canEditLogistics ? [{ label: "Editar logística", onSelect: () => navigate(`/events/${event.id}/edit`) }] : []),
                  ...(event.state === "SCHEDULED" ? [{ label: "Postergar", onSelect: () => setSheet("lifecycle") }] : []),
                  ...(event.state === "POSTPONED" ? [{ label: "Reprogramar", onSelect: () => setSheet("lifecycle") }] : []),
                  ...(event.state === "SCHEDULED" || event.state === "POSTPONED" ? [{ label: "Cancelar evento", danger: true, onSelect: () => setSheet("lifecycle") }] : []),
                ]}
              />
            )}
            {canOperate && event.state === "CANCELLED" && (
              <Button variant="secondary" onClick={() => runTransition("restore")} busy={pendingAction === "restore"}>Restaurar</Button>
            )}
          </div>
        }
      />

      {event.state === "CANCELLED" && (
        <Banner tone="danger" title="Este evento fue cancelado">
          <span className="text-ink-strong">La información queda disponible como referencia. Si la Subcomisión lo confirma, se puede restaurar.</span>
        </Banner>
      )}
      {event.state === "POSTPONED" && (
        <Banner tone="warning" title="No hay horario vigente">
          <span className="text-ink-strong">Este evento está postergado. Cuando haya nueva fecha, la agenda lo va a mostrar de nuevo.</span>
        </Banner>
      )}
      {event.state === "COMPLETED" && (
        <Banner tone="success" title="Este evento ya se jugó">
          <span className="text-ink-strong">El evento quedó cerrado y forma parte del historial. La información queda disponible como referencia.</span>
        </Banner>
      )}
      {event.state === "ABANDONED" && (
        <Banner tone="warning" title="El partido se suspendió antes de terminar">
          <span className="text-ink-strong">No hay resultado oficial para este partido.</span>
        </Banner>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid gap-6">
          <Surface className="grid gap-2">
            <p className="gei-meta">Coordinación</p>
            <RowStatic title="Revisión de coordinación" detail={String(event.coordinationRevision)} />
            <RowStatic title="Versión" detail={String(event.version)} />
            {event.competitionName && <RowStatic title="Competencia" detail={event.competitionName} />}
            {event.opponent && <RowStatic title="Rival" detail={event.opponent} />}
          </Surface>

          <DetailSection title="Logística">
            <dl className="grid">
              <RowStatic title="Encuentro" detail={event.logistics?.meetingAt ? dateTimeLabel(event.logistics.meetingAt) : "Sin definir"} />
              <RowStatic title="Salida" detail={event.logistics?.departureAt ? dateTimeLabel(event.logistics.departureAt) : "Sin definir"} />
              <RowStatic title="Punto de encuentro" detail={event.logistics?.meetingPoint || "Sin definir"} />
              <RowStatic title="Cómo se llega" detail={event.logistics?.transportNote || "Sin definir"} />
              <RowStatic title="Cómo llegar a la cancha" detail={event.logistics?.arrivalInstructions || "Sin definir"} />
            </dl>
          </DetailSection>

          <Surface className="grid gap-2">
            <SectionHeader title="Participación" />
            <p className="gei-meta">La disponibilidad y la convocatoria llegan con la siguiente etapa (T04).</p>
          </Surface>
        </div>

        <aside className="grid content-start gap-3">
          <Surface className="grid gap-2">
            <p className="gei-body-strong">Resumen</p>
            <RowStatic title="Destino" detail={event.clubWideTarget ? "Todo el club" : event.targets.teams.length > 0 ? event.targets.teams.map((t) => t.name ?? "Equipo").join(" + ") : `${event.targets.persons.length} personas`} />
            <RowStatic title="Revisión" detail={`coord. ${event.coordinationRevision} · v${event.version}`} />
            {event.seriesId && (
              <RowStatic title="Serie" detail={`Ocurrencia ${(event.occurrenceIndex ?? 0) + 1}`} />
            )}
          </Surface>
          {event.seriesId && (
            <SeriesPanel seriesId={event.seriesId} eventId={event.id} onEnded={reload} />
          )}
          {event.state === "SCHEDULED" && <VasControl />}
        </aside>
      </div>

      {sheet === "lifecycle" && (
        <Sheet
          title="Cambiar el estado del evento"
          description="Estas acciones cambian la situación para todo el club."
          onClose={() => setSheet(null)}
        >
          <div className="grid gap-3">
            {event.state === "SCHEDULED" && (
              <Button variant="secondary" onClick={() => runTransition("postpone")} busy={pendingAction === "postpone"}>
                Postergar el evento
              </Button>
            )}
            {event.state === "POSTPONED" && (
              <Button variant="secondary" onClick={() => runTransition("reschedule")} busy={pendingAction === "reschedule"}>
                Reprogramar (volver a programado)
              </Button>
            )}
            {(event.state === "SCHEDULED" || event.state === "POSTPONED") && (
              <Button variant="danger" onClick={() => runTransition("cancel")} busy={pendingAction === "cancel"}>
                Cancelar el evento
              </Button>
            )}
            {lifecycleError && (
              <Banner tone="danger" title="No se pudo aplicar el cambio"><span className="text-ink-strong">{lifecycleError}</span></Banner>
            )}
          </div>
        </Sheet>
      )}
    </div>
  )
}


/* ---------------------------------------------
   FORMULARIO DE EVENTO — alta y edición real
   --------------------------------------------- */

type FormState = {
  title: string
  date: string
  time: string
  end: string
  timeZone: string
  venueId: string
  targetTeams: string[]
  clubWide: boolean
  opponent: string
  competitionId: string
  meeting: string
  departure: string
  point: string
  transport: string
  arrival: string
}

const EMPTY_FORM: FormState = {
  title: "",
  date: "",
  time: "",
  end: "",
  timeZone: "America/Argentina/Buenos_Aires",
  venueId: "",
  targetTeams: [],
  clubWide: false,
  opponent: "",
  competitionId: "",
  meeting: "",
  departure: "",
  point: "",
  transport: "",
  arrival: "",
}

function formFromDetail(detail: EventDetailDto): FormState {
  const tz = detail.timeZone
  const start = utcIsoToZonedParts(detail.startAt, tz) ?? { date: "", time: "" }
  const end = utcIsoToZonedParts(detail.endAt, tz)
  const meeting = utcIsoToZonedParts(detail.logistics?.meetingAt, tz)
  const departure = utcIsoToZonedParts(detail.logistics?.departureAt, tz)
  return {
    title: detail.title,
    date: start.date,
    time: start.time,
    end: end?.time ?? "",
    timeZone: tz,
    venueId: detail.venueId ?? "",
    targetTeams: detail.targets.teams.map((t) => t.teamId),
    clubWide: detail.clubWideTarget,
    opponent: detail.opponent ?? "",
    competitionId: detail.competitionId ?? "",
    meeting: meeting?.time ?? "",
    departure: departure?.time ?? "",
    point: detail.logistics?.meetingPoint ?? "",
    transport: detail.logistics?.transportNote ?? "",
    arrival: detail.logistics?.arrivalInstructions ?? "",
  }
}

function diffForm(base: FormState, next: FormState): Record<string, unknown> {
  const patch: Record<string, unknown> = {}
  if (base.title !== next.title) patch.title = next.title
  const startIso = next.date && next.time ? zonedLocalInputToIso(next.date, next.time, next.timeZone) : null
  const baseStartIso = base.date && base.time ? zonedLocalInputToIso(base.date, base.time, base.timeZone) : null
  if (startIso !== baseStartIso) patch.startAt = startIso
  const endIso = next.end ? zonedLocalInputToIso(next.date, next.end, next.timeZone) : null
  const baseEndIso = base.end ? zonedLocalInputToIso(base.date, base.end, base.timeZone) : null
  if (endIso !== baseEndIso) patch.endAt = endIso
  if (base.timeZone !== next.timeZone) patch.timeZone = next.timeZone
  if (base.venueId !== next.venueId) patch.venueId = next.venueId || null
  if (base.targetTeams.join("|") !== next.targetTeams.join("|")) patch.targetTeamIds = next.targetTeams
  if (base.clubWide !== next.clubWide) patch.clubWideTarget = next.clubWide
  if (base.opponent !== next.opponent) patch.opponent = next.opponent || null
  if (base.competitionId !== next.competitionId) patch.competitionId = next.competitionId || null
  const normTime = (value: string) => (value.trim() === "" ? null : value)
  const normText = (value: string) => (value.trim() === "" ? null : value)
  const logistics: Record<string, unknown> = {}
  if (normTime(base.meeting) !== normTime(next.meeting)) logistics.meetingAt = next.meeting ? zonedLocalInputToIso(next.date, next.meeting, next.timeZone) : null
  if (normTime(base.departure) !== normTime(next.departure)) logistics.departureAt = next.departure ? zonedLocalInputToIso(next.date, next.departure, next.timeZone) : null
  if (normText(base.point) !== normText(next.point)) logistics.meetingPoint = next.point.trim() === "" ? null : next.point.trim()
  if (normText(base.transport) !== normText(next.transport)) logistics.transportNote = next.transport.trim() === "" ? null : next.transport.trim()
  if (normText(base.arrival) !== normText(next.arrival)) logistics.arrivalInstructions = next.arrival.trim() === "" ? null : next.arrival.trim()
  if (Object.keys(logistics).length > 0) patch.logistics = logistics
  return patch
}

export function EventForm() {
  const { eventId = "" } = useParams()
  const editing = Boolean(eventId)
  const navigate = useNavigate()

  const structure = useFetch(() => fetchStructure(), [])
  const existing = useFetch(() => (editing ? fetchEventDetail(eventId) : Promise.resolve(null)), [eventId])
  const me = useFetch(() => fetchMe(), [])

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [loaded, setLoaded] = useState(false)
  const [type, setType] = useState<"TRAINING" | "MATCH" | "CLUB_EVENT">("TRAINING")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState("")
  const [pending, setPending] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [conflict, setConflict] = useState<{ baseline: FormState; local: FormState; latest: FormState; latestVersion: number } | null>(null)
  const [repeat, setRepeat] = useState(false)
  const [repeatFreq, setRepeatFreq] = useState<"DAILY" | "WEEKLY" | "MONTHLY">("WEEKLY")
  const [repeatCount, setRepeatCount] = useState(8)
  const baselineRef = useRef<FormState>(EMPTY_FORM)
  const firstErrorRef = useRef<string | null>(null)

  useEffect(() => {
    if (existing.data && !loaded) {
      const next = formFromDetail(existing.data)
      baselineRef.current = next
      setForm(next)
      setType(existing.data.type)
      setLoaded(true)
    }
  }, [existing.data, loaded])

  const teams = useMemo(() => (structure.data?.teams ?? []).filter((team) => team.state === "ACTIVE"), [structure.data])
  const myCoachTeamIds = useMemo(
    () => new Set((me.data?.roleAssignments ?? []).filter((r) => r.role === "COACH" && r.scopeType === "TEAM").map((r) => r.scopeRefId)),
    [me.data],
  )
  const visibleTeams = useMemo(
    () => (me.data?.isSubcommittee ? teams : teams.filter((team) => myCoachTeamIds.has(team.id))),
    [teams, me.data, myCoachTeamIds],
  )
  const venues = useMemo(() => (structure.data?.venues ?? []).filter((venue) => !venue.archivedAt), [structure.data])
  const competitions = useMemo(() => (structure.data?.competitions ?? []).filter((competition) => !competition.archivedAt), [structure.data])
  const canCreateClubWide = Boolean(me.data?.isSubcommittee)
  const canCreateClubEvent = Boolean(me.data?.isSubcommittee)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setDirty(true)
    setErrors((current) => {
      if (!current[key as string]) return current
      const next = { ...current }
      delete next[key as string]
      return next
    })
  }

  function validate(): boolean {
    const found: Record<string, string> = {}
    if (!form.title.trim()) found.title = "Poné un título para que se entienda de qué evento se trata."
    if (!form.date) found.date = "Elegí la fecha."
    if (!form.time) found.time = "Elegí la hora de inicio."
    if (form.end && form.end <= form.time) found.end = "La hora de fin tiene que ser posterior a la de inicio."
    if (type === "MATCH" && !form.opponent.trim()) found.opponent = "Escribí contra quién se juega."
    if (!form.clubWide && form.targetTeams.length === 0) found.targetTeams = "Elegí al menos un equipo destino."
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      firstErrorRef.current = first
      window.setTimeout(() => document.getElementById(`field-${first}`)?.focus(), 0)
    }
    return Object.keys(found).length === 0
  }

  const patch = diffForm(baselineRef.current, form)
  const isNonMaterialOnly = editing && Object.keys(patch).length > 0 && Object.keys(patch).every((key) => key === "title")

  async function submit() {
    setFormError("")
    if (!validate()) return
    setPending(true)
    try {
      const startAt = zonedLocalInputToIso(form.date, form.time, form.timeZone)!
      const endAt = form.end ? zonedLocalInputToIso(form.date, form.end, form.timeZone) : null
      if (editing) {
        const current = existing.data!
        if (Object.keys(patch).length === 0) {
          navigate(`/events/${eventId}`)
          return
        }
        const logisticsOnly = Object.keys(patch).every((key) => key === "logistics")
        const titlePlusLogistics = Object.keys(patch).every((key) => key === "logistics" || key === "title")
        // Logística usa CMD-EVT-16 (CAPTAIN/COACH/SUBCOMMITTEE); el resto va por CMD-EVT-05/04.
        if (patch.logistics && titlePlusLogistics) {
          const logisticsPatch = patch.logistics as Record<string, unknown>
          if (Object.values(logisticsPatch).some((item) => item !== undefined && item !== null)) {
            await fetchUpdateLogistics({
              eventId,
              meetingAt: logisticsPatch.meetingAt === undefined ? undefined : logisticsPatch.meetingAt as string | null,
              departureAt: logisticsPatch.departureAt === undefined ? undefined : logisticsPatch.departureAt as string | null,
              meetingPoint: logisticsPatch.meetingPoint === undefined ? undefined : logisticsPatch.meetingPoint as string | null,
              transportNote: logisticsPatch.transportNote === undefined ? undefined : logisticsPatch.transportNote as string | null,
              arrivalInstructions: logisticsPatch.arrivalInstructions === undefined ? undefined : logisticsPatch.arrivalInstructions as string | null,
              expectedVersion: current.version,
              idempotencyKey: crypto.randomUUID(),
            })
            if (titlePlusLogistics && patch.title !== undefined) {
              await fetchEditEventMeta({ eventId, title: String(patch.title).trim(), expectedVersion: current.version + 1 })
            }
            navigate(`/events/${eventId}`)
            return
          }
        }
        if (logisticsOnly) {
          // Sin campos reales de logística (todo vacío): no hay cambios — volver al detalle.
          navigate(`/events/${eventId}`)
          return
        }
        if (isNonMaterialOnly) {
          await fetchEditEventMeta({ eventId, title: form.title.trim(), expectedVersion: current.version })
        } else {
          if (patch.title !== undefined) {
            // title viaja también en el patch material: el backend lo trata como metadata (sin coordRev++).
          }
          await fetchMaterialChangeEvent({ eventId, patch, expectedVersion: current.version, idempotencyKey: crypto.randomUUID() })
        }
        navigate(`/events/${eventId}`)
        return
      }
      if (repeat) {
        await fetchCreateEventSeries({
          recurrenceRule: `FREQ=${repeatFreq};COUNT=${repeatCount}`,
          maxOccurrences: repeatCount,
          type,
          title: form.title.trim(),
          startAt,
          endAt,
          timeZone: form.timeZone,
          venueId: form.venueId || null,
          clubWideTarget: form.clubWide,
          targetTeamIds: form.clubWide ? undefined : form.targetTeams,
          competitionId: type === "MATCH" ? form.competitionId || null : null,
          opponent: type === "MATCH" ? form.opponent.trim() : null,
          idempotencyKey: crypto.randomUUID(),
        })
        navigate("/calendar")
        return
      }
      const created = await fetchCreateEvent({
        type,
        title: form.title.trim(),
        startAt,
        endAt,
        timeZone: form.timeZone,
        venueId: form.venueId || null,
        clubWideTarget: form.clubWide,
        targetTeamIds: form.clubWide ? undefined : form.targetTeams,
        competitionId: type === "MATCH" ? form.competitionId || null : null,
        opponent: type === "MATCH" ? form.opponent.trim() : null,
        logistics: {
          meetingAt: form.meeting ? zonedLocalInputToIso(form.date, form.meeting, form.timeZone) : null,
          departureAt: form.departure ? zonedLocalInputToIso(form.date, form.departure, form.timeZone) : null,
          meetingPoint: form.point || null,
          transportNote: form.transport || null,
          arrivalInstructions: form.arrival || null,
        },
        idempotencyKey: crypto.randomUUID(),
      })
      navigate(`/events/${created.id}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo guardar"
      const code = (err as { code?: string } | null)?.code
      if (editing && code === "OPTIMISTIC_LOCK_FAILURE" && existing.data) {
        const fresh = await fetchEventDetail(eventId)
        setConflict({ baseline: baselineRef.current, local: form, latest: formFromDetail(fresh), latestVersion: fresh.version })
      } else {
        setFormError(message)
      }
    } finally {
      setPending(false)
    }
  }

  if (editing && existing.error) {
    return (
      <div className="mx-auto max-w-3xl">
        <Empty title="Ese evento ya no está" detail="Puede que se haya cancelado o que el enlace está incompleto." />
      </div>
    )
  }
  if (editing && !loaded) {
    return <div className="mx-auto max-w-3xl"><p className="gei-meta">Cargando el evento…</p></div>
  }
  if (structure.loading || me.loading) {
    return <div className="mx-auto max-w-3xl"><p className="gei-meta">Cargando equipos y sedes…</p></div>
  }
  if (structure.error) {
    return (
      <div className="mx-auto max-w-3xl">
        <Banner tone="danger" title="No pudimos cargar la estructura del club"><span className="text-ink-strong">{structure.error}</span></Banner>
      </div>
    )
  }

  return (
    <div className="gei-stack-page mx-auto max-w-3xl">
      <PageContextHeader
        context={editing ? `Editar ${TYPE_LABEL[type]}` : `Nuevo ${TYPE_LABEL[type]}`}
        title={editing ? existing.data?.title ?? "Editar evento" : "Nuevo evento"}
        back={editing ? `/events/${eventId}` : "/calendar"}
        action={
          <Button variant="primary" onClick={submit} busy={pending}>
            <Save size={16} aria-hidden />
            {editing ? "Guardar cambios" : "Crear evento"}
          </Button>
        }
      />

      {formError && (
        <Banner tone="danger" title="No se pudo guardar"><span className="text-ink-strong">{formError}</span></Banner>
      )}

      {!editing && (
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Tipo de evento">
          {(["TRAINING", "MATCH", "CLUB_EVENT"] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={type === value}
              onClick={() => setType(value)}
              className={cx(
                "gei-target rounded-pill border px-4 text-body font-semibold transition-colors",
                type === value ? "border-selected-line bg-selected-soft text-selected" : "border-line bg-surface text-ink-muted hover:text-ink",
              )}
            >
              {TYPE_LABEL[value]}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4">
        <Surface className="grid gap-4">
          <TextField id="field-title" label="Título" value={form.title} onChange={(e) => set("title", e.target.value)} error={errors.title} placeholder="Ej.: Entrenamiento táctico" />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField id="field-date" label="Fecha" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} error={errors.date} />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField id="field-time" label="Inicio" type="time" value={form.time} onChange={(e) => set("time", e.target.value)} error={errors.time} />
              <TextField id="field-end" label="Fin" type="time" value={form.end} onChange={(e) => set("end", e.target.value)} error={errors.end} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select id="field-timeZone" label="Zona horaria" value={form.timeZone} onChange={(e) => set("timeZone", e.target.value)}>
              {CANONICAL_ZONES.map((zone) => <option key={zone} value={zone}>{zone.replace(/_/g, " ")}</option>)}
            </Select>
            <Select id="field-venueId" label="Sede" value={form.venueId} onChange={(e) => set("venueId", e.target.value)}>
              <option value="">Sin sede</option>
              {venues.map((venue) => <option key={venue.id} value={venue.id}>{venue.name}</option>)}
            </Select>
          </div>
        </Surface>

        <Surface className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="gei-section-title">Destino</p>
              <p className="gei-meta mt-1">¿Quiénes tienen que enterarse de este evento?</p>
            </div>
            {canCreateClubWide && type !== "MATCH" && (
              <div className="flex gap-2" role="radiogroup" aria-label="Alcance">
                <button type="button" role="radio" aria-checked={!form.clubWide} onClick={() => set("clubWide", false)}
                  className={cx("gei-target rounded-pill border px-3 text-meta font-semibold", !form.clubWide ? "border-selected-line bg-selected-soft text-selected" : "border-line text-ink-muted")}>
                  Equipos elegidos
                </button>
                <button type="button" role="radio" aria-checked={form.clubWide} onClick={() => set("clubWide", true)}
                  className={cx("gei-target rounded-pill border px-3 text-meta font-semibold", form.clubWide ? "border-selected-line bg-selected-soft text-selected" : "border-line text-ink-muted")}>
                  Todo el club
                </button>
              </div>
            )}
          </div>
          {!form.clubWide && (
            <fieldset className="grid gap-2">
              <legend className="gei-meta font-semibold">Equipos</legend>
              {visibleTeams.length === 0 && <p className="gei-meta">{me.data?.isSubcommittee ? "No hay equipos activos." : "No sos entrenador de ningún equipo activo. Pedile a la administración o a la Subcomisión que te asigne."}</p>}
              {visibleTeams.map((team) => (
                <label key={team.id} className="flex cursor-pointer items-center gap-3 rounded-control border border-line px-3 py-2.5 hover:border-interactive">
                  <input
                    type="checkbox"
                    checked={form.targetTeams.includes(team.id)}
                    onChange={(event) => {
                      const next = event.target.checked ? [...form.targetTeams, team.id] : form.targetTeams.filter((id) => id !== team.id)
                      set("targetTeams", next)
                    }}
                    className="size-4 accent-[var(--color-interactive)]"
                  />
                  <span className="text-body text-ink">{team.name}</span>
                </label>
              ))}
              {errors.targetTeams && <p className="text-meta font-medium text-danger">{errors.targetTeams}</p>}
            </fieldset>
          )}
          {type === "MATCH" && (
            <>
              <TextField id="field-opponent" label="Rival" value={form.opponent} onChange={(e) => set("opponent", e.target.value)} error={errors.opponent} placeholder="Ej.: Racing" />
              <Select id="field-competitionId" label="Competencia (opcional)" value={form.competitionId} onChange={(e) => set("competitionId", e.target.value)}>
                <option value="">Sin competencia</option>
                {competitions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </>
          )}
        </Surface>

        <Surface className="grid gap-4">
          <p className="gei-section-title">Logística <span className="gei-meta font-normal">(opcional)</span></p>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField id="field-meeting" label="Hora de encuentro" type="time" value={form.meeting} onChange={(e) => set("meeting", e.target.value)} />
            <TextField id="field-departure" label="Hora de salida" type="time" value={form.departure} onChange={(e) => set("departure", e.target.value)} />
          </div>
          <TextField id="field-point" label="Punto de encuentro" value={form.point} onChange={(e) => set("point", e.target.value)} placeholder="Ej.: Puerta del club" />
          <TextField id="field-transport" label="Como se llega" value={form.transport} onChange={(e) => set("transport", e.target.value)} />
          <TextField id="field-arrival" label="Cómo llegar a la cancha" value={form.arrival} onChange={(e) => set("arrival", e.target.value)} />
        </Surface>

        {!editing && (
          <Surface className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="gei-section-title">Repetir</p>
                <p className="gei-meta mt-1">Crea una serie de eventos reales, uno por ocurrencia.</p>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={repeat} onChange={(e) => setRepeat(e.target.checked)} className="size-4 accent-[var(--color-interactive)]" />
                <span className="text-body text-ink">Repetir este evento</span>
              </label>
            </div>
            {repeat && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Select id="repeat-freq" label="Frecuencia" value={repeatFreq} onChange={(e) => setRepeatFreq(e.target.value as never)}>
                  <option value="WEEKLY">Semanal</option>
                  <option value="DAILY">Diaria</option>
                  <option value="MONTHLY">Mensual</option>
                </Select>
                <TextField id="repeat-count" label="Cantidad de veces" type="number" value={String(repeatCount)} onChange={(e) => setRepeatCount(Math.max(1, Math.min(366, Number(e.target.value) || 1)))} />
              </div>
            )}
          </Surface>
        )}
      </div>

      {conflict && (
        <ConflictWorkspace
          baseline={conflict.baseline as never}
          local={conflict.local as never}
          latest={conflict.latest as never}
          onKeepMine={async () => {
            const fresh = await fetchEventDetail(eventId)
            const latestPatch = diffForm(formFromDetail(fresh), conflict.local)
            await fetchResolveEventConflict({ eventId, expectedVersion: conflict.latestVersion, patch: latestPatch })
            setConflict(null)
            navigate(`/events/${eventId}`)
          }}
          onTakeLatest={() => {
            setForm(conflict.latest)
            baselineRef.current = conflict.latest
            setConflict(null)
          }}
          onClose={() => setConflict(null)}
        />
      )}
    </div>
  )
}

/* ---------------------------------------------
   JORNADA (R19 crear · R20 detalle/listado)
   --------------------------------------------- */

export function JornadaPage() {
  const { jornadaId = "" } = useParams()
  const location = useLocation()
  const creating = location.pathname.endsWith("/new")
  if (creating || !jornadaId) return <JornadaCreate />
  return <JornadaDetail jornadaId={jornadaId} />
}

function JornadaDetail({ jornadaId }: { jornadaId: string }) {
  const navigate = useNavigate()
  const { data: jornada, loading, error } = useFetch(() => fetchJornadaDetail(jornadaId), [jornadaId])

  if (loading) return <div className="mx-auto max-w-4xl"><p className="gei-meta">Cargando jornada…</p></div>
  if (error || !jornada) return (
    <div className="mx-auto max-w-3xl">
      <Empty title="Jornada no encontrada" detail="Puede que haya cambiado o el enlace está incompleto." />
      <div className="mt-4"><Button variant="secondary" onClick={() => navigate("/calendar")}>Volver a la agenda</Button></div>
    </div>
  )

  return (
    <div className="gei-stack-page mx-auto max-w-4xl">
      <PageContextHeader
        context="Jornada"
        title={jornada.name}
        lead={`${dateLabel(jornada.date, true)} · ${jornada.matches.length} ${jornada.matches.length === 1 ? "partido" : "partidos"}`}
        back="/calendar"
      />
      <Surface className="grid gap-2">
        <p className="gei-meta">Partidos de la jornada</p>
        <ul className="grid">
          {jornada.matches.map((match) => {
            const parts = isoToZoned(match)
            return (
              <RowLink
                key={match.id}
                to={`/events/${match.id}`}
                title={`GEI vs. ${match.opponent ?? "Rival a definir"}`}
                detail={parts}
                leading={<span aria-hidden className="size-2 rounded-pill bg-brand" />}
              />
            )
          })}
          {jornada.matches.length === 0 && <p className="gei-meta">Todavía no hay partidos asignados.</p>}
        </ul>
      </Surface>
    </div>
  )
}

function isoToZoned(match: EventDto): string {
  if (!match.startAt) return "Fecha a definir"
  const d = new Date(match.startAt)
  return `${dateLabel(d.toISOString().slice(0, 10), true)} · ${d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}`
}

function JornadaCreate() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [seasonId, setSeasonId] = useState("")
  const [competitionId, setCompetitionId] = useState("")
  const [date, setDate] = useState("")
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [rangeFrom, setRangeFrom] = useState(() => new Date(Date.now() + 86_400_000).toISOString().slice(0, 10))
  const [rangeTo, setRangeTo] = useState(() => new Date(Date.now() + 60 * 86_400_000).toISOString().slice(0, 10))
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  const structure = useFetch(() => fetchStructure(), [])
  const matches = useFetch(
    () => fetchCalendarRange({ from: new Date(`${rangeFrom}T00:00:00`).toISOString(), to: new Date(`${rangeTo}T23:59:59`).toISOString(), type: "MATCH", limit: 200 }),
    [rangeFrom, rangeTo],
  )

  const seasons = structure.data?.seasons ?? []
  const competitions = (structure.data?.competitions ?? []).filter((c) => !c.archivedAt && (!seasonId || c.seasonId === seasonId))
  const available = (matches.data?.items ?? []).filter((item) => item.state !== "CANCELLED")

  async function submit() {
    setError("")
    const eventIds = Object.entries(selected).filter(([, v]) => v).map(([k]) => k)
    if (!name.trim()) { setError("Poné un nombre para la jornada."); return }
    if (!seasonId) { setError("Elegí la temporada."); return }
    if (eventIds.length === 0) { setError("Elegí al menos un partido."); return }
    if (eventIds.length > 100) { setError("Máximo 100 partidos por jornada."); return }
    setPending(true)
    try {
      const created = await fetchCreateJornada({ name: name.trim(), seasonId, competitionId: competitionId || null, date: date || undefined, eventIds, idempotencyKey: crypto.randomUUID() })
      navigate(`/jornadas/${created.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la jornada")
    } finally {
      setPending(false)
    }
  }

  const selectedCount = Object.values(selected).filter(Boolean).length

  if (structure.loading) return <div className="mx-auto max-w-3xl"><p className="gei-meta">Cargando estructura…</p></div>

  return (
    <div className="gei-stack-page mx-auto max-w-3xl">
      <PageContextHeader
        context="Jornada nueva"
        title="Programar jornada"
        lead="Agrupá los partidos de una jornada. Todos deben ser de la misma temporada. Cada partido conserva su propio ciclo de vida."
        back="/calendar"
        action={<Button variant="primary" onClick={submit} busy={pending}><CalendarPlus size={16} aria-hidden />Crear jornada ({selectedCount})</Button>}
      />
      {error && <Banner tone="danger" title="No se pudo crear la jornada"><span className="text-ink-strong">{error}</span></Banner>}
      <Surface className="grid gap-4">
        <TextField id="jornada-name" label="Nombre" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej.: Jornada 12" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Select id="jornada-season" label="Temporada" value={seasonId} onChange={(e) => setSeasonId(e.target.value)}>
            <option value="">Elegir…</option>
            {seasons.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
          <Select id="jornada-competition" label="Competencia (opcional)" value={competitionId} onChange={(e) => setCompetitionId(e.target.value)}>
            <option value="">Sin competencia</option>
            {competitions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <TextField id="jornada-date" label="Fecha" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </Surface>

      <Surface className="grid gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="gei-section-title">Partidos</p>
            <p className="gei-meta mt-1">Elegí de qué rango de fechas tomar los partidos.</p>
          </div>
          <div className="flex gap-2">
            <TextField id="range-from" label="Desde" type="date" value={rangeFrom} onChange={(e) => setRangeFrom(e.target.value)} />
            <TextField id="range-to" label="Hasta" type="date" value={rangeTo} onChange={(e) => setRangeTo(e.target.value)} />
          </div>
        </div>
        {matches.loading && <p className="gei-meta">Buscando partidos…</p>}
        {matches.error && <Banner tone="danger" title="No pudimos buscar partidos"><span className="text-ink-strong">{matches.error}</span></Banner>}
        {!matches.loading && available.length === 0 && <p className="gei-meta">No hay partidos en este rango.</p>}
        <ul className="grid gap-2">
          {available.map((match) => (
            <li key={match.id}>
              <label className="flex cursor-pointer items-center gap-3 rounded-control border border-line px-3 py-2.5 hover:border-interactive">
                <input type="checkbox" checked={Boolean(selected[match.id])} onChange={(e) => setSelected((s) => ({ ...s, [match.id]: e.target.checked }))} className="size-4 accent-[var(--color-interactive)]" />
                <span className="min-w-0 flex-1">
                  <span className="block text-body text-ink">GEI vs. {match.opponent ?? "Rival a definir"}</span>
                  <span className="block text-meta text-ink-muted">{isoToZoned(match)}{match.targets.teams[0]?.name ? ` · ${match.targets.teams[0].name}` : ""}</span>
                </span>
                <StateBadge value={match.state} />
              </label>
            </li>
          ))}
        </ul>
      </Surface>
    </div>
  )
}

/* ---------------------------------------------
   SERIE (recurrencia) — panel de EventDetail
   --------------------------------------------- */

function SeriesPanel({ seriesId, eventId, onEnded }: { seriesId: string; eventId: string; onEnded: () => Promise<unknown> }) {
  const navigate = useNavigate()
  const { data: series, loading, error, reload } = useFetch(() => fetchEventSeriesDetail(seriesId), [seriesId])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [ending, setEnding] = useState(false)
  const [endError, setEndError] = useState("")

  async function endSeries() {
    setEnding(true)
    setEndError("")
    try {
      await fetchEndEventSeries(seriesId)
      setConfirmOpen(false)
      await reload()
      await onEnded()
    } catch (err) {
      setEndError(err instanceof Error ? err.message : "No se pudo terminar la serie")
    } finally {
      setEnding(false)
    }
  }

  if (loading) return <Surface><p className="gei-meta">Cargando serie…</p></Surface>
  if (error || !series) return null

  return (
    <Surface className="grid gap-2">
      <div className="flex items-center justify-between gap-2">
        <p className="gei-body-strong">Serie</p>
        <Tag tone={series.state === "ACTIVE" ? "selected" : "neutral"}>{series.state === "ACTIVE" ? "Activa" : "Terminada"}</Tag>
      </div>
      <RowStatic title="Nombre" detail={series.name} />
      <RowStatic title="Regla" detail={series.recurrenceRule} />
      <RowStatic title="Ocurrencias" detail={String(series.occurrences.length)} />
      {series.state === "ACTIVE" && (
        <Button variant="secondary" onClick={() => setConfirmOpen(true)} busy={ending}>Terminar serie</Button>
      )}
      {endError && <p className="text-meta font-medium text-danger">{endError}</p>}

      {confirmOpen && (
        <ConfirmDialog
          title="Terminar la serie"
          consequence="La serie deja de generar nuevas ocurrencias. Los eventos ya creados se conservan y el historial no se borra."
          confirmLabel="Terminar la serie"
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => void endSeries()}
          tone="danger"
          requireReason={false}
        />
      )}
    </Surface>
  )
}
