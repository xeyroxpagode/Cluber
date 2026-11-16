import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Link, useParams } from "react-router"
import { CalendarDays, CheckCircle2, History, Info, Users } from "lucide-react"
import { useFetch } from "../lib/use-fetch"
import { fetchEventDetail, type EventDetailDto } from "../lib/t03-api"
import { me as fetchMe } from "../lib/session"
import { dateLabel, timeLabel } from "../lib/dates"
import { ApiError } from "../lib/api"
import {
  fetchRespondAvailability,
  fetchAvailabilitySummary,
  fetchSelectionDetail,
  fetchSelectionConflicts,
  fetchMySelectionStatus,
  fetchUpdateSelectionDraft,
  fetchPublishSelection,
  fetchRecordAttendance,
  fetchCloseAttendanceSheet,
  fetchCorrectAttendance,
  fetchMatchRecordDetail,
  fetchCreateMatchRecord,
  fetchStartEvent,
  fetchFinalizeMatchRecord,
  fetchCorrectMatchRecord,
  fetchRecordPlayerStats,
  type AttendanceValue,
  type AvailabilityValue,
  type ResultType,
  type SelectionConflict,
  type SelectionRole,
} from "../lib/t04-api"
import {
  Banner,
  Button,
  ConfirmDialog,
  Empty,
  Modal,
  RadioGroup,
  SavedState,
  StateBadge,
  Surface,
  Tag,
  TextArea,
  TextField,
  cx,
} from "../shared/ui"
import { PageContextHeader, SectionHeader } from "../shared/patterns"

/**
 * T04 R3 — superficies de participación (R15 disponibilidad, R16 convocatoria,
 * R17 asistencia, R18 resultado del partido).
 *
 * Todas las pantallas leen y escriben el backend real: no hay datos simulados.
 * La UI refleja la autoridad que devuelve el servidor (por ejemplo, la hoja de
 * asistencia y el detalle de convocatoria sólo llegan al coach del equipo), pero
 * jamás sustituye la autorización del backend.
 */

type Me = Awaited<ReturnType<typeof fetchMe>>

/**
 * Asignaciones de rol vigentes en este instante. `me.roleAssignments` trae también
 * historial, así que la UI no puede usarlo tal cual para prometer acciones: el
 * backend revalida cada request, pero la interfaz no debe ofrecer lo que no se puede
 * ejecutar (AUTH-01/AUTH-08).
 */
function effectiveAssignments(me: Me | null, now = new Date()): NonNullable<Me["roleAssignments"]> {
  const at = now.getTime()
  return (me?.roleAssignments ?? []).filter((assignment) => {
    const from = new Date(assignment.validFrom).getTime()
    const until = assignment.validUntil ? new Date(assignment.validUntil).getTime() : Number.POSITIVE_INFINITY
    return at >= from && at < until
  })
}

function isCoachRole(me: Me | null): boolean {
  return effectiveAssignments(me).some((assignment) => assignment.role === "COACH")
}

/** COACH con scope aplicable al evento: TEAM de un equipo destino o EVENT del propio evento. */
function canCoachEvent(me: Me | null, event: { id: string; targets: { teams: Array<{ teamId: string }> } } | null): boolean {
  if (!event) return false
  return effectiveAssignments(me).some((assignment) => {
    if (assignment.role !== "COACH") return false
    if (assignment.scopeType === "EVENT") return assignment.scopeRefId === event.id
    if (assignment.scopeType === "TEAM") return event.targets.teams.some((team) => team.teamId === assignment.scopeRefId)
    return false
  })
}

/** PLAYER vigente con scope aplicable al evento (o club-wide). */
function canRespondAvailability(me: Me | null, event: { id: string; clubWideTarget: boolean; targets: { teams: Array<{ teamId: string }> } } | null): boolean {
  if (!event) return false
  return effectiveAssignments(me).some((assignment) => {
    if (assignment.role !== "PLAYER") return false
    if (event.clubWideTarget) return true
    if (assignment.scopeType === "EVENT") return assignment.scopeRefId === event.id
    if (assignment.scopeType === "TEAM") return event.targets.teams.some((team) => team.teamId === assignment.scopeRefId)
    return false
  })
}

function errorText(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return fallback
}

function EventContext({ event }: { event: EventDetailDto }) {
  const label = event.state === "POSTPONED" ? "Sin horario vigente" : `${dateLabel(event.startAt ? event.startAt.slice(0, 10) : "", true)} · ${timeLabel(event.startAt)}`
  return (
    <Surface className="grid gap-2" data-testid="participation-event-context">
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

function PageShell({ eventId, context, title, children }: { eventId: string; context: string; title: string; children: React.ReactNode }) {
  return (
    <div className="gei-stack-page mx-auto max-w-4xl" data-testid={`${context.toLowerCase().replace(/\s+/g, "-")}-page`}>
      <PageContextHeader context={context} title={title} back={`/events/${eventId}`} />
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   R15 — Disponibilidad
   ══════════════════════════════════════════════════════════════════════ */

export function AvailabilityPage() {
  const { eventId = "" } = useParams()
  const event = useFetch(() => fetchEventDetail(eventId), [eventId])
  const me = useFetch(() => fetchMe(), [])
  const coach = canCoachEvent(me.data, event.data)
  const canRespond = canRespondAvailability(me.data, event.data)
  const summary = useFetch(() => (coach ? fetchAvailabilitySummary(eventId) : Promise.resolve(null)), [eventId, coach])
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  const [conflict, setConflict] = useState(false)
  const [saved, setSaved] = useState(false)

  const own = event.data?.participation?.ownAvailability ?? null

  async function respond(value: AvailabilityValue) {
    if (!event.data) return
    setPending(true)
    setError("")
    setSaved(false)
    setConflict(false)
    try {
      await fetchRespondAvailability({ eventId, value, observedCoordinationRevision: event.data.coordinationRevision })
      setSaved(true)
      await event.reload()
      if (coach) await summary.reload()
    } catch (err) {
      if (err instanceof ApiError && err.code === "OPTIMISTIC_LOCK_FAILURE") setConflict(true)
      setError(errorText(err, "No se pudo guardar tu respuesta"))
    } finally {
      setPending(false)
    }
  }

  if (event.loading) return <PageShell eventId={eventId} context="Disponibilidad" title="Disponibilidad"><p className="gei-meta">Cargando disponibilidad…</p></PageShell>
  if (event.error || !event.data) {
    return (
      <PageShell eventId={eventId} context="Disponibilidad" title="Disponibilidad">
        <Empty title="No pudimos cargar el evento" detail="Puede que el enlace esté incompleto o que el evento ya no exista." />
      </PageShell>
    )
  }

  return (
    <PageShell eventId={eventId} context="Disponibilidad" title="Disponibilidad">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid gap-6">
          <EventContext event={event.data} />

          {canRespond && (
            <Surface className="grid gap-3" data-testid="availability-self">
              <SectionHeader title="Tu respuesta" meta={own?.respondedAt ? `Respondiste ${dateLabel(own.respondedAt.slice(0, 10), true)}` : undefined} />
              {own?.needsReconfirmation && (
                <Banner tone="attention" title="El evento cambió desde tu última respuesta" data-testid="availability-reconfirm">
                  <span className="text-ink-strong">Volvé a confirmar para que el club sepa si contás. Tu respuesta anterior se conserva hasta que confirmes.</span>
                </Banner>
              )}
              {event.data.state !== "SCHEDULED" && (
                <Banner tone="warning" title="Este evento ya no admite respuestas">
                  <span className="text-ink-strong">La disponibilidad se toma sólo mientras el evento está programado.</span>
                </Banner>
              )}
              <div className="flex flex-wrap gap-2" role="group" aria-label="Tu disponibilidad">
                {(["YES", "MAYBE", "NO"] as const).map((value) => (
                  <Button
                    key={value}
                    variant={own?.value === value ? "primary" : "secondary"}
                    disabled={pending || event.data!.state !== "SCHEDULED"}
                    busy={pending}
                    data-testid={`availability-response-${value.toLowerCase()}`}
                    onClick={() => void respond(value)}
                  >
                    {value === "YES" ? "Voy" : value === "MAYBE" ? "Tal vez" : "No voy"}
                  </Button>
                ))}
              </div>
              {own && own.state !== "NO_RESPONSE" && !own.needsReconfirmation && (
                <p className="gei-meta" data-testid="availability-current">
                  Tu respuesta actual: <span className="font-semibold text-ink">{own.state === "YES" ? "Voy" : own.state === "MAYBE" ? "Tal vez" : "No voy"}</span>
                </p>
              )}
              {saved && <p className="gei-meta text-success" data-testid="availability-success"><CheckCircle2 size={13} className="inline" aria-hidden /> Respuesta guardada.</p>}
              {conflict && (
                <Banner tone="attention" title="El evento cambió mientras respondías" data-testid="availability-conflict">
                  <span className="text-ink-strong">Actualizá la pantalla para ver la versión vigente y confirmá de nuevo.</span>
                  <div className="mt-2"><Button variant="secondary" onClick={() => void event.reload()}>Actualizar datos</Button></div>
                </Banner>
              )}
              {error && <Banner tone="danger" title="No se pudo guardar tu respuesta" data-testid="availability-error"><span className="text-ink-strong">{error}</span></Banner>}
            </Surface>
          )}

          {coach && (
            <Surface className="grid gap-3" data-testid="availability-summary">
              <SectionHeader title="Respuestas del equipo" meta={summary.data ? `${summary.data.total} personas` : undefined} />
              {summary.loading && <p className="gei-meta">Cargando respuestas…</p>}
              {summary.error && <Banner tone="danger" title="No pudimos cargar las respuestas"><span className="text-ink-strong">{summary.error}</span></Banner>}
              {summary.data && (
                <>
                  <div className="flex flex-wrap gap-2">
                    {(["YES", "MAYBE", "NO", "NO_RESPONSE", "NEEDS_RECONFIRMATION"] as const).map((key) => (
                      <Tag key={key} tone={key === "NO_RESPONSE" ? "neutral" : key === "NEEDS_RECONFIRMATION" ? "attention" : "selected"}>
                        <span data-testid={`availability-count-${key.toLowerCase()}`}>{summary.data!.counts[key]} · {key === "YES" ? "Voy" : key === "MAYBE" ? "Tal vez" : key === "NO" ? "No voy" : key === "NO_RESPONSE" ? "Sin respuesta" : "Por reconfirmar"}</span>
                      </Tag>
                    ))}
                  </div>
                  {summary.data.items.length === 0 ? (
                    <Empty title="Todavía no hay audiencia" detail="Este evento no tiene personas destino registradas." />
                  ) : (
                    <ul className="grid" data-testid="availability-roster">
                      {summary.data.items.map((item) => (
                        <li key={item.personId} className="flex min-h-11 items-center gap-3 border-b border-line last:border-b-0" data-testid={`availability-row-${item.personId}`}>
                          <span className="min-w-0 flex-1 truncate text-body text-ink">{item.name ?? "Sin nombre"}</span>
                          <StateBadge value={item.state} />
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </Surface>
          )}

          {!canRespond && !coach && (
            <Empty title="No tenés disponibilidad para responder" detail="Sólo los jugadores destinatarios del evento pueden responder su disponibilidad." />
          )}
        </div>

        <aside className="grid content-start gap-3">
          <Surface className="grid gap-2">
            <p className="gei-body-strong">Estado</p>
            <p className="gei-meta">Revisión de coordinación</p>
            <p className="gei-body-strong tabular-nums">{event.data.coordinationRevision}</p>
          </Surface>
        </aside>
      </div>
    </PageShell>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   R16 — Convocatoria
   ══════════════════════════════════════════════════════════════════════ */

interface DraftEntry {
  personId: string
  role: SelectionRole
  order: number
}

export function SelectionPage() {
  const { eventId = "" } = useParams()
  const event = useFetch(() => fetchEventDetail(eventId), [eventId])
  const me = useFetch(() => fetchMe(), [])
  const coach = canCoachEvent(me.data, event.data)
  const detail = useFetch(() => (coach ? fetchSelectionDetail(eventId) : Promise.resolve(null)), [eventId, coach])
  const myStatus = useFetch(() => (coach ? Promise.resolve(null) : fetchMySelectionStatus(eventId)), [eventId, coach])
  const [conflicts, setConflicts] = useState<SelectionConflict[]>([])

  const [entries, setEntries] = useState<DraftEntry[]>([])
  const [version, setVersion] = useState(0)
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "dirty" | "error">("idle")
  const [error, setError] = useState("")
  const [conflict, setConflict] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState<string | null>(null)
  const timer = useRef<number | null>(null)
  const inFlight = useRef<Promise<boolean> | null>(null)
  const pending = useRef<DraftEntry[] | null>(null)
  const versionRef = useRef(0)
  const hydrated = useRef(false)

  useEffect(() => {
    if (!detail.data || hydrated.current) return
    hydrated.current = true
    const draft = detail.data.currentDraft
    setVersion(draft?.autosaveVersion ?? 0)
    versionRef.current = draft?.autosaveVersion ?? 0
    setEntries((draft?.entries ?? []).map((entry, index) => ({ personId: entry.personId, role: entry.role, order: entry.order ?? index + 1 })))
    setConflicts(detail.data.currentDraft?.conflicts ?? [])
  }, [detail.data])

  /**
   * Candidatos legítimos: el mismo roster que usa el backend (evento + afiliación
   * vigente a la fecha del evento), no la audiencia de disponibilidad.
   */
  const candidates = useMemo(() => {
    const roster = event.data?.participation?.attendance?.items ?? []
    return roster.map((item) => ({ personId: item.personId, name: item.name }))
  }, [event.data])

  const save = useCallback(async (next: DraftEntry[], currentVersion: number) => {
    setSaveState("saving")
    setError("")
    setConflict(false)
    try {
      const result = await fetchUpdateSelectionDraft({
        eventId,
        entries: next.map((entry) => ({ personId: entry.personId, role: entry.role, order: entry.order })),
        autosaveVersion: currentVersion,
      })
      setVersion(result.autosaveVersion)
      versionRef.current = result.autosaveVersion
      setSaveState("saved")
      void refreshConflicts()
      return true
    } catch (err) {
      setSaveState("error")
      if (err instanceof ApiError && err.code === "OPTIMISTIC_LOCK_FAILURE") setConflict(true)
      setError(errorText(err, "No se pudo guardar la convocatoria"))
      return false
    }
  }, [eventId])

  const refreshConflicts = useCallback(async () => {
    try {
      const result = await fetchSelectionConflicts(eventId)
      setConflicts(result.conflicts)
    } catch {
      /* los conflictos son informativos: un fallo aquí no invalida el borrador */
    }
  }, [eventId])

  /** Guarda lo pendiente y espera: nunca hay dos autosaves en vuelo. */
  const flush = useCallback(async (): Promise<boolean> => {
    if (timer.current) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
    if (inFlight.current) await inFlight.current
    const next = pending.current
    if (!next) return true
    pending.current = null
    const promise = save(next, versionRef.current)
    inFlight.current = promise
    const ok = await promise
    inFlight.current = null
    return ok
  }, [save])

  function scheduleSave(next: DraftEntry[]) {
    pending.current = next
    setSaveState("dirty")
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      timer.current = null
      void flush()
    }, 600)
  }

  function toggle(personId: string, role: SelectionRole) {
    const current = entries.find((entry) => entry.personId === personId)
    let next: DraftEntry[]
    if (!current) {
      next = [...entries, { personId, role, order: entries.filter((entry) => entry.role === role).length + 1 }]
    } else if (current.role === role) {
      next = entries.filter((entry) => entry.personId !== personId)
    } else {
      next = entries.map((entry) => (entry.personId === personId ? { ...entry, role } : entry))
    }
    setEntries(next)
    scheduleSave(next)
  }

  async function publish() {
    setPublishing(true)
    setError("")
    try {
      // Publica exactamente el borrador que el entrenador ve: primero se guarda lo pendiente.
      const saved = await flush()
      if (!saved) {
        setPublishing(false)
        return
      }
      const result = await fetchPublishSelection(eventId)
      setPublished(result.revisionId)
      hydrated.current = false
      await detail.reload()
      await refreshConflicts()
    } catch (err) {
      setError(errorText(err, "No se pudo publicar la convocatoria"))
    } finally {
      setPublishing(false)
    }
  }

  if (event.loading) return <PageShell eventId={eventId} context="Convocatoria" title="Convocatoria"><p className="gei-meta">Cargando convocatoria…</p></PageShell>
  if (event.error || !event.data) {
    return (
      <PageShell eventId={eventId} context="Convocatoria" title="Convocatoria">
        <Empty title="No pudimos cargar el evento" detail="Puede que el enlace esté incompleto o que el evento ya no exista." />
      </PageShell>
    )
  }

  return (
    <PageShell eventId={eventId} context="Convocatoria" title="Convocatoria">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid gap-6">
          <EventContext event={event.data} />

          {coach ? (
            <>
              <Surface className="grid gap-3" data-testid="selection-draft">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <SectionHeader title="Borrador de convocatoria" meta={`versión ${version}`} />
                  <div data-testid="selection-autosave">
                    <SavedState state={saveState === "error" ? "dirty" : saveState} detail={saveState === "error" ? "No se pudo guardar" : undefined} />
                  </div>
                </div>
                {conflict && (
                  <Banner tone="attention" title="Otro entrenador editó este borrador" data-testid="selection-conflict">
                    <span className="text-ink-strong">Tu cambio no se aplicó para no pisar el suyo. Recargá el borrador y volvé a editar.</span>
                    <div className="mt-2"><Button variant="secondary" onClick={() => { hydrated.current = false; void detail.reload() }}>Recargar borrador</Button></div>
                  </Banner>
                )}
                {error && <Banner tone="danger" title="No se pudo guardar la convocatoria" data-testid="selection-error"><span className="text-ink-strong">{error}</span></Banner>}
                {candidates.length === 0 && (
                  <Empty title="No hay personas para convocar" detail="Este evento no tiene personas con afiliación vigente en el equipo destino." />
                )}
                <ul className="grid" data-testid="selection-candidates">
                  {candidates.map((person) => {
                    const entry = entries.find((item) => item.personId === person.personId)
                    return (
                      <li key={person.personId} className="flex min-h-11 flex-wrap items-center gap-3 border-b border-line last:border-b-0" data-testid={`selection-row-${person.personId}`}>
                        <span className="min-w-0 flex-1 truncate text-body text-ink">{person.name ?? "Sin nombre"}</span>
                        <Button
                          size="sm"
                          variant={entry?.role === "SELECTED" ? "primary" : "secondary"}
                          aria-pressed={entry?.role === "SELECTED"}
                          data-testid={`selection-role-${person.personId}-SELECTED`}
                          onClick={() => toggle(person.personId, "SELECTED")}
                        >
                      Convocado
                        </Button>
                        <Button
                          size="sm"
                          variant={entry?.role === "ALTERNATE" ? "primary" : "secondary"}
                          aria-pressed={entry?.role === "ALTERNATE"}
                          data-testid={`selection-role-${person.personId}-ALTERNATE`}
                          onClick={() => toggle(person.personId, "ALTERNATE")}
                        >
                          Alternante
                        </Button>
                      </li>
                    )
                  })}
                </ul>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="primary"
                    busy={publishing}
                    disabled={entries.length === 0}
                    data-testid="selection-publish"
                    onClick={() => void publish()}
                  >
                    Publicar convocatoria
                  </Button>
                  <p className="gei-meta">{entries.length} personas en el borrador</p>
                </div>
                {published && <p className="gei-meta text-success" data-testid="selection-published"><CheckCircle2 size={13} className="inline" aria-hidden /> Convocatoria publicada.</p>}
              </Surface>

              {conflicts.length ? (
                <Surface className="grid gap-2" data-testid="selection-conflicts">
                  <SectionHeader title="Avisos del borrador" hint="No impiden publicar: son avisos operativos." />
                  <ul className="grid gap-2">
                    {conflicts.map((conflictItem) => (
                      <li key={`${conflictItem.personId}-${conflictItem.code}`} className="flex items-start gap-2 text-meta text-ink-muted">
                        <Info size={14} aria-hidden className="mt-0.5 shrink-0 text-attention" />
                        <span>{conflictItem.reason} ({conflictItem.code})</span>
                      </li>
                    ))}
                  </ul>
                </Surface>
              ) : null}

              <Surface className="grid gap-3" data-testid="selection-history">
                <SectionHeader title="Publicaciones" meta={detail.data ? `${detail.data.publishedRevisions.length}` : undefined} />
                {(detail.data?.publishedRevisions ?? []).length === 0 && (
                  <Empty title="Todavía no hay publicaciones" detail="Cuando publiques la convocatoria, acá vas a ver el historial." />
                )}
                <ul className="grid gap-3">
                  {(detail.data?.publishedRevisions ?? []).map((revision) => (
                    <li key={revision.revisionId} className="grid gap-1 border-b border-line pb-3 last:border-b-0 last:pb-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <StateBadge value={revision.state} />
                        <span className="gei-meta">{revision.publishedAt ? dateLabel(revision.publishedAt.slice(0, 10), true) : ""}</span>
                        <span className="gei-meta">{revision.entries.length} personas</span>
                      </div>
                      {detail.data!.history.find((item) => item.revisionId === revision.revisionId) && (
                        <p className="gei-meta">
                          Altas: {detail.data!.history.find((item) => item.revisionId === revision.revisionId)!.added.length} · Bajas: {detail.data!.history.find((item) => item.revisionId === revision.revisionId)!.removed.length}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </Surface>
            </>
          ) : (
            <Surface className="grid gap-3" data-testid="selection-player-status">
              <SectionHeader title="Tu convocatoria" />
              {myStatus.loading && <p className="gei-meta">Cargando tu estado…</p>}
              {myStatus.error && <Banner tone="danger" title="No pudimos cargar tu convocatoria"><span className="text-ink-strong">{myStatus.error}</span></Banner>}
              {myStatus.data && (
                <>
                  <StateBadge value={myStatus.data.status} emphasis />
                  {myStatus.data.publishedAt && <p className="gei-meta">Publicado el {dateLabel(myStatus.data.publishedAt.slice(0, 10), true)}</p>}
                  <p className="gei-meta">Tu estado de convocatoria es el de la última publicación. El borrador del entrenador no se muestra.</p>
                </>
              )}
            </Surface>
          )}
        </div>

        <aside className="grid content-start gap-3">
          <Surface className="grid gap-2">
            <p className="gei-body-strong">Resumen</p>
            <p className="gei-meta flex items-center gap-1.5"><Users size={13} aria-hidden /> Convocatoria de {event.data.type === "MATCH" ? "un partido" : "un evento"}</p>
          </Surface>
        </aside>
      </div>
    </PageShell>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   R17 — Asistencia
   ══════════════════════════════════════════════════════════════════════ */

export function AttendancePage() {
  const { eventId = "" } = useParams()
  const event = useFetch(() => fetchEventDetail(eventId), [eventId])
  const me = useFetch(() => fetchMe(), [])
  const coach = canCoachEvent(me.data, event.data)
  const [pending, setPending] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [correction, setCorrection] = useState<{ personId: string; name: string; entryId: string | null; value: AttendanceValue } | null>(null)
  const [reason, setReason] = useState("")
  const [correctionValue, setCorrectionValue] = useState<AttendanceValue>("PRESENT")

  const attendance = event.data?.participation?.attendance ?? null
  const closed = attendance?.state === "CLOSED"

  async function mark(personId: string, value: AttendanceValue) {
    setPending(personId)
    setError("")
    setSuccess("")
    try {
      await fetchRecordAttendance({ eventId, personId, value })
      setSuccess("Asistencia registrada")
      await event.reload()
    } catch (err) {
      setError(errorText(err, "No se pudo registrar la asistencia"))
    } finally {
      setPending(null)
    }
  }

  async function closeSheet() {
    setPending("close")
    setError("")
    setSuccess("")
    try {
      await fetchCloseAttendanceSheet(eventId)
      setSuccess("Hoja de asistencia cerrada")
      await event.reload()
    } catch (err) {
      setError(errorText(err, "No se pudo cerrar la hoja"))
    } finally {
      setPending(null)
    }
  }

  async function submitCorrection() {
    if (!correction) return
    if (!reason.trim()) return
    setPending("correction")
    setError("")
    try {
      await fetchCorrectAttendance({
        eventId,
        entryId: correction.entryId ?? undefined,
        personId: correction.personId,
        value: correctionValue,
        correctionReason: reason.trim(),
      })
      setCorrection(null)
      setReason("")
      setSuccess("Corrección registrada con motivo")
      await event.reload()
    } catch (err) {
      setError(errorText(err, "No se pudo registrar la corrección"))
    } finally {
      setPending(null)
    }
  }

  if (event.loading) return <PageShell eventId={eventId} context="Asistencia" title="Asistencia"><p className="gei-meta">Cargando asistencia…</p></PageShell>
  if (event.error || !event.data) {
    return (
      <PageShell eventId={eventId} context="Asistencia" title="Asistencia">
        <Empty title="No pudimos cargar el evento" detail="Puede que el enlace esté incompleto o que el evento ya no exista." />
      </PageShell>
    )
  }

  return (
    <PageShell eventId={eventId} context="Asistencia" title="Asistencia">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid gap-6">
          <EventContext event={event.data} />

          {attendance ? (
            <Surface className="grid gap-3" data-testid="attendance-sheet">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <SectionHeader title="Hoja de asistencia" meta={closed ? "Cerrada" : "Abierta"} />
                {!closed && (
                  <Button variant="secondary" busy={pending === "close"} data-testid="attendance-close" onClick={() => void closeSheet()}>
                    Cerrar hoja
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {(["PRESENT", "ABSENT", "JUSTIFIED", "UNRECORDED"] as const).map((key) => (
                  <Tag key={key} tone={key === "PRESENT" ? "success" : key === "ABSENT" ? "danger" : key === "JUSTIFIED" ? "warning" : "neutral"}>
                    <span data-testid={`attendance-count-${key.toLowerCase()}`}>{attendance.counts[key]} · {key === "PRESENT" ? "Presentes" : key === "ABSENT" ? "Ausentes" : key === "JUSTIFIED" ? "Justificados" : "Sin registrar"}</span>
                  </Tag>
                ))}
              </div>

              {closed && (
                <Banner tone="neutral" title="La hoja está cerrada" data-testid="attendance-closed">
                  <span className="text-ink-strong">No se puede volver a marcar. Para cambiar un valor hace falta una corrección con motivo, que queda en el historial.</span>
                </Banner>
              )}
              {success && <p className="gei-meta text-success" data-testid="attendance-success"><CheckCircle2 size={13} className="inline" aria-hidden /> {success}</p>}
              {error && <Banner tone="danger" title="No se pudo completar la acción" data-testid="attendance-error"><span className="text-ink-strong">{error}</span></Banner>}

              <ul className="grid" data-testid="attendance-roster">
                {attendance.items.map((item) => (
                  <li key={item.personId} className="flex min-h-11 flex-wrap items-center gap-3 border-b border-line py-2 last:border-b-0" data-testid={`attendance-row-${item.personId}`}>
                    <span className="min-w-0 flex-1 truncate text-body text-ink">{item.name}</span>
                    <StateBadge value={item.state} />
                    {!closed && (
                      <span className="flex flex-wrap gap-1">
                        {(["PRESENT", "ABSENT", "JUSTIFIED"] as const).map((value) => (
                          <Button
                            key={value}
                            size="sm"
                            variant={item.value === value ? "primary" : "secondary"}
                            disabled={pending === item.personId}
                            data-testid={`attendance-mark-${item.personId}-${value.toLowerCase()}`}
                            onClick={() => void mark(item.personId, value)}
                          >
                            {value === "PRESENT" ? "Presente" : value === "ABSENT" ? "Ausente" : "Justificado"}
                          </Button>
                        ))}
                      </span>
                    )}
                    <Button
                      size="sm"
                      variant="quiet"
                      data-testid={`attendance-correct-${item.personId}`}
                      onClick={() => { setCorrection({ personId: item.personId, name: item.name, entryId: item.entryId, value: item.value ?? "PRESENT" }); setCorrectionValue(item.value ?? "PRESENT"); setReason("") }}
                    >
                      Corregir
                    </Button>
                  </li>
                ))}
              </ul>
              {attendance.items.length === 0 && <Empty title="No hay roster para este evento" detail="Nadie tiene afiliación vigente en el equipo destino." />}

              <Surface className="grid gap-2" data-testid="attendance-history">
                <SectionHeader title="Historial de correcciones" meta={`${attendance.items.reduce((total, item) => total + item.corrections.length, 0)} correcciones`} />
                {attendance.items.every((item) => item.corrections.length === 0) && (
                  <p className="gei-meta">Todavía no hay correcciones registradas.</p>
                )}
                <ul className="grid gap-2">
                  {attendance.items.flatMap((item) => item.corrections.map((correctionItem) => (
                    <li key={correctionItem.id} className="grid gap-0.5 border-b border-line pb-2 last:border-b-0">
                      <p className="text-meta text-ink"><span className="font-semibold">{item.name}</span>: {correctionItem.previousValue ?? "Sin registrar"} → {correctionItem.newValue}</p>
                      <p className="gei-meta">{correctionItem.correctionReason} · {dateLabel(correctionItem.correctedAt.slice(0, 10), true)}</p>
                    </li>
                  )))}
                </ul>
              </Surface>
            </Surface>
          ) : (
            <Empty title="La asistencia no está disponible para vos" detail="Sólo el entrenador del equipo puede registrar y cerrar la asistencia." />
          )}
        </div>

        <aside className="grid content-start gap-3">
          <Surface className="grid gap-2">
            <p className="gei-body-strong">Hoja</p>
            <p className="gei-meta">{attendance ? (closed ? `Cerrada el ${attendance.closedAt ? dateLabel(attendance.closedAt.slice(0, 10), true) : ""}` : "Abierta") : "Sin acceso"}</p>
          </Surface>
        </aside>
      </div>

      {correction && (
        <Modal
          title={`Corregir la asistencia de ${correction.name}`}
          description="La corrección queda registrada con el valor anterior, el nuevo y el motivo."
          onClose={() => setCorrection(null)}
          footer={
            <>
              <Button variant="quiet" onClick={() => setCorrection(null)} disabled={pending === "correction"}>Cancelar</Button>
              <Button variant="primary" busy={pending === "correction"} disabled={!reason.trim()} data-testid="attendance-correct-submit" onClick={() => void submitCorrection()}>
                Registrar corrección
              </Button>
            </>
          }
        >
          <div className="grid gap-4">
            <RadioGroup
              legend="Valor corregido"
              name="attendance-correction-value"
              value={correctionValue}
              onChange={(value) => setCorrectionValue(value as AttendanceValue)}
              options={[
                { value: "PRESENT", label: "Presente" },
                { value: "ABSENT", label: "Ausente" },
                { value: "JUSTIFIED", label: "Justificado" },
              ]}
            />
            <TextArea
              id="attendance-reason"
              label="Motivo de la corrección"
              required
              value={reason}
              data-testid="attendance-reason"
              onChange={(event) => setReason(event.target.value)}
              hint="Queda en el historial junto con el valor anterior."
            />
          </div>
        </Modal>
      )}
    </PageShell>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   R18 — Resultado del partido
   ══════════════════════════════════════════════════════════════════════ */

export function MatchRecordPage() {
  const { eventId = "" } = useParams()
  const event = useFetch(() => fetchEventDetail(eventId), [eventId])
  const me = useFetch(() => fetchMe(), [])
  const coach = canCoachEvent(me.data, event.data)
  const record = useFetch(() => (coach ? fetchMatchRecordDetail(eventId) : Promise.resolve(null)), [eventId, coach])
  const [pending, setPending] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [finalizeOpen, setFinalizeOpen] = useState(false)
  const [correctionOpen, setCorrectionOpen] = useState(false)
  const [resultType, setResultType] = useState<ResultType>("PLAYED")
  const [homeScore, setHomeScore] = useState("")
  const [awayScore, setAwayScore] = useState("")
  const [observations, setObservations] = useState("")
  const [reason, setReason] = useState("")
  const [scoreError, setScoreError] = useState("")
  const [statsDraft, setStatsDraft] = useState<Record<string, { minutes: string; goals: string; assists: string; yellow: string; red: string; mvp: boolean }>>({})

  const detail = record.data
  /** Roster legítimo del evento (misma fuente que usa el backend para stats). */
  const rosterItems = useMemo(() => {
    const roster = event.data?.participation?.attendance?.items ?? []
    const stats = detail?.playerStats ?? []
    const known = new Set(stats.map((stat) => stat.personId))
    return [
      ...roster.map((person) => ({ personId: person.personId, name: person.name })),
      ...stats.filter((stat) => !known.has(stat.personId)).map((stat) => ({ personId: stat.personId, name: stat.name })),
    ]
  }, [event.data, detail])
  const eventState = detail?.event.state ?? event.data?.state ?? null
  const canFinalize = detail?.state === "DRAFT" && eventState === "IN_PROGRESS"

  async function create() {
    setPending("create")
    setError("")
    try {
      await fetchCreateMatchRecord(eventId)
      setSuccess("Acta creada")
      await record.reload()
    } catch (err) {
      setError(errorText(err, "No se pudo crear el acta"))
    } finally {
      setPending(null)
    }
  }

  async function start() {
    setPending("start")
    setError("")
    try {
      await fetchStartEvent(eventId, detail?.event.version)
      setSuccess("Partido iniciado")
      await event.reload()
      await record.reload()
    } catch (err) {
      setError(errorText(err, "No se pudo iniciar el partido"))
    } finally {
      setPending(null)
    }
  }

  async function finalize() {
    setPending("finalize")
    setError("")
    setScoreError("")
    if (resultType === "PLAYED" && (homeScore.trim() === "" || awayScore.trim() === "")) {
      // Un marcador vacío no es un cero: se pide confirmación explícita.
      setScoreError("Cargá el marcador de ambos equipos antes de finalizar.")
      setPending(null)
      return
    }
    try {
      await fetchFinalizeMatchRecord({
        eventId,
        resultType,
        homeScore: resultType === "PLAYED" ? Number(homeScore) : null,
        awayScore: resultType === "PLAYED" ? Number(awayScore) : null,
        observations: observations.trim() || null,
      })
      setFinalizeOpen(false)
      setSuccess("Resultado finalizado")
      await event.reload()
      await record.reload()
    } catch (err) {
      setError(errorText(err, "No se pudo finalizar el resultado"))
    } finally {
      setPending(null)
    }
  }

  async function correct() {
    if (!detail?.matchRecordId) return
    setPending("correct")
    setError("")
    setScoreError("")
    if (resultType === "PLAYED" && (homeScore.trim() === "" || awayScore.trim() === "")) {
      setScoreError("Cargá el marcador de ambos equipos antes de corregir.")
      setPending(null)
      return
    }
    try {
      await fetchCorrectMatchRecord({
        eventId,
        recordId: detail.matchRecordId,
        resultType,
        homeScore: resultType === "PLAYED" ? Number(homeScore) : null,
        awayScore: resultType === "PLAYED" ? Number(awayScore) : null,
        observations: observations.trim() || null,
        correctionReason: reason.trim(),
      })
      setCorrectionOpen(false)
      setReason("")
      setSuccess("Corrección oficial registrada")
      await record.reload()
    } catch (err) {
      setError(errorText(err, "No se pudo registrar la corrección"))
    } finally {
      setPending(null)
    }
  }

  async function saveStats(personId: string) {
    if (!detail?.matchRecordId) return
    const draft = statsDraft[personId]
    const current = detail.playerStats.find((stat) => stat.personId === personId)
    setPending(`stats-${personId}`)
    setError("")
    try {
      // Se envía el conjunto completo de la fila: omitir un campo no lo borra en el servidor,
      // pero la UI manda todos para que el estado guardado sea el que el entrenador ve.
      await fetchRecordPlayerStats({
        eventId,
        recordId: detail.matchRecordId,
        personId,
        stats: {
          minutesPlayed: draft?.minutes !== undefined && draft.minutes !== "" ? Number(draft.minutes) : (current?.minutesPlayed ?? null),
          goals: draft?.goals !== undefined && draft.goals !== "" ? Number(draft.goals) : (current?.goals ?? null),
          assists: draft?.assists !== undefined && draft.assists !== "" ? Number(draft.assists) : (current?.assists ?? null),
          yellowCards: draft?.yellow !== undefined && draft.yellow !== "" ? Number(draft.yellow) : (current?.yellowCards ?? null),
          redCards: draft?.red !== undefined && draft.red !== "" ? Number(draft.red) : (current?.redCards ?? null),
          mvp: draft?.mvp !== undefined ? draft.mvp : (current?.mvp ?? false),
        },
      })
      setSuccess("Estadísticas guardadas")
      await record.reload()
    } catch (err) {
      setError(errorText(err, "No se pudieron guardar las estadísticas"))
    } finally {
      setPending(null)
    }
  }

  if (event.loading) return <PageShell eventId={eventId} context="Resultado" title="Resultado del partido"><p className="gei-meta">Cargando el resultado…</p></PageShell>
  if (event.error || !event.data) {
    return (
      <PageShell eventId={eventId} context="Resultado" title="Resultado del partido">
        <Empty title="No pudimos cargar el evento" detail="Puede que el enlace esté incompleto o que el evento ya no exista." />
      </PageShell>
    )
  }

  return (
    <PageShell eventId={eventId} context="Resultado" title="Resultado del partido">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid gap-6">
          <EventContext event={event.data} />

          {coach ? (
            <>
              <Surface className="grid gap-3" data-testid="match-record">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <SectionHeader title="Acta del partido" meta={detail?.state ?? "Sin acta"} />
                  <div className="flex flex-wrap gap-2">
                    {!detail?.matchRecordId && (
                      <Button variant="primary" busy={pending === "create"} data-testid="match-record-create" onClick={() => void create()}>
                        Crear acta
                      </Button>
                    )}
                    {eventState === "SCHEDULED" && (
                      <Button variant="secondary" busy={pending === "start"} data-testid="match-record-start" onClick={() => void start()}>
                        Iniciar partido
                      </Button>
                    )}
                    {detail?.state === "DRAFT" && (
                      <Button variant="primary" disabled={!canFinalize} data-testid="match-record-finalize" onClick={() => setFinalizeOpen(true)}>
                        Finalizar resultado
                      </Button>
                    )}
                    {detail?.state === "FINAL" && (
                      <Button
                        variant="secondary"
                        data-testid="match-record-correct"
                        onClick={() => {
                          setResultType(detail.resultType ?? "PLAYED")
                          setHomeScore(detail.homeScore === null ? "" : String(detail.homeScore))
                          setAwayScore(detail.awayScore === null ? "" : String(detail.awayScore))
                          setObservations(detail.observations ?? "")
                          setReason("")
                          setCorrectionOpen(true)
                        }}
                      >
                        Corregir resultado
                      </Button>
                    )}
                  </div>
                </div>

                {detail?.state === "DRAFT" && eventState !== "IN_PROGRESS" && (
                  <Banner tone="attention" title="Falta iniciar el partido" data-testid="match-record-gate">
                    <span className="text-ink-strong">El resultado se finaliza cuando el evento está en curso. Iniciá el partido para habilitar la finalización.</span>
                  </Banner>
                )}
                {success && <p className="gei-meta text-success" data-testid="match-record-success"><CheckCircle2 size={13} className="inline" aria-hidden /> {success}</p>}
                {error && <Banner tone="danger" title="No se pudo completar la acción" data-testid="match-record-error"><span className="text-ink-strong">{error}</span></Banner>}

                {detail?.matchRecordId ? (
                  <dl className="grid" data-testid="match-record-summary">
                    <div className="flex min-h-11 items-center gap-3 border-b border-line">
                      <dt className="min-w-0 flex-1 text-body text-ink">Estado del acta</dt>
                      <dd><StateBadge value={detail.state ?? "DRAFT"} /></dd>
                    </div>
                    <div className="flex min-h-11 items-center gap-3 border-b border-line">
                      <dt className="min-w-0 flex-1 text-body text-ink">Resultado</dt>
                      <dd>{detail.resultType ? <StateBadge value={detail.resultType} /> : <span className="gei-meta">Todavía sin resultado</span>}</dd>
                    </div>
                    {detail.resultType === "PLAYED" && (
                      <div className="flex min-h-11 items-center gap-3 border-b border-line">
                        <dt className="min-w-0 flex-1 text-body text-ink">Marcador</dt>
                        <dd className="gei-body-strong tabular-nums">{detail.homeScore ?? 0} - {detail.awayScore ?? 0}</dd>
                      </div>
                    )}
                    {detail.observations && (
                      <div className="flex min-h-11 items-center gap-3 border-b border-line">
                        <dt className="min-w-0 flex-1 text-body text-ink">Observaciones</dt>
                        <dd className="gei-meta max-w-[60%] text-right">{detail.observations}</dd>
                      </div>
                    )}
                    {detail.correctedAt && (
                      <div className="flex min-h-11 items-center gap-3 border-b border-line">
                        <dt className="min-w-0 flex-1 text-body text-ink">Última corrección</dt>
                        <dd className="gei-meta">{detail.correctionReason}</dd>
                      </div>
                    )}
                  </dl>
                ) : (
                  <Empty title="Todavía no hay acta" detail="Creá el acta para empezar a cargar el resultado del partido." />
                )}
              </Surface>

              {detail?.matchRecordId && detail.state === "DRAFT" && (
                <Surface className="grid gap-3" data-testid="match-record-stats">
                  <SectionHeader title="Estadísticas por jugador" hint="Se congelan al finalizar el acta." />
                  {rosterItems.length === 0 && (
                    <Empty title="No hay jugadores en el roster" detail="Nadie tiene afiliación vigente en el equipo destino." />
                  )}
                  <ul className="grid gap-3">
                    {rosterItems.map((person) => {
                      const stat = detail.playerStats.find((row) => row.personId === person.personId)
                      const fields = [
                        { key: "minutes", label: "Minutos", persisted: stat?.minutesPlayed ?? null },
                        { key: "goals", label: "Goles", persisted: stat?.goals ?? null },
                        { key: "assists", label: "Asistencias", persisted: stat?.assists ?? null },
                        { key: "yellow", label: "Amarillas", persisted: stat?.yellowCards ?? null },
                        { key: "red", label: "Rojas", persisted: stat?.redCards ?? null },
                      ] as const
                      return (
                        <li key={person.personId} className="grid gap-2 border-b border-line pb-3 last:border-b-0" data-testid={`match-record-stats-${person.personId}`}>
                          <p className="text-body font-semibold text-ink">{person.name ?? "Sin nombre"}</p>
                          <div className="grid gap-2 sm:grid-cols-3">
                            {fields.map((field) => {
                              const current = statsDraft[person.personId]
                              const value = current?.[field.key] ?? (field.persisted === null || field.persisted === undefined ? "" : String(field.persisted))
                              return (
                                <TextField
                                  key={field.key}
                                  id={`stat-${person.personId}-${field.key}`}
                                  label={field.label}
                                  type="number"
                                  min={0}
                                  value={value}
                                  data-testid={`match-record-stat-${person.personId}-${field.key}`}
                                  onChange={(inputEvent) => setStatsDraft((existing) => {
                                    const base = existing[person.personId] ?? { minutes: "", goals: "", assists: "", yellow: "", red: "", mvp: false }
                                    return { ...existing, [person.personId]: { ...base, [field.key]: inputEvent.target.value } }
                                  })}
                                />
                              )
                            })}
                          </div>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={statsDraft[person.personId]?.mvp ?? stat?.mvp ?? false}
                              data-testid={`match-record-stat-${person.personId}-mvp`}
                              onChange={(inputEvent) => setStatsDraft((existing) => {
                                const base = existing[person.personId] ?? { minutes: "", goals: "", assists: "", yellow: "", red: "", mvp: false }
                                return { ...existing, [person.personId]: { ...base, mvp: inputEvent.target.checked } }
                              })}
                              className="size-5 rounded-control border border-line-strong text-interactive accent-interactive"
                            />
                            <span className="text-body text-ink">MVP del partido</span>
                          </label>
                          <Button size="sm" variant="secondary" busy={pending === `stats-${person.personId}`} data-testid={`match-record-stats-save-${person.personId}`} onClick={() => void saveStats(person.personId)}>
                            Guardar estadísticas
                          </Button>
                        </li>
                      )
                    })}
                  </ul>
                </Surface>
              )}

              {detail?.matchRecordId && detail.state === "FINAL" && detail.playerStats.length > 0 && (
                <Surface className="grid gap-3" data-testid="match-record-final-stats">
                  <SectionHeader title="Estadísticas finales" />
                  <ul className="grid gap-2">
                    {detail.playerStats.map((stat) => (
                      <li key={stat.personId} className="flex min-h-11 items-center gap-3 border-b border-line last:border-b-0">
                        <span className="min-w-0 flex-1 truncate text-body text-ink">{stat.name ?? "Sin nombre"}</span>
                        <span className="gei-meta tabular-nums">{stat.goals ?? 0} G · {stat.assists ?? 0} A · {stat.minutesPlayed ?? 0} min</span>
                      </li>
                    ))}
                  </ul>
                </Surface>
              )}

              {detail && detail.corrections.length > 0 && (
                <Surface className="grid gap-2" data-testid="match-record-history">
                  <SectionHeader title="Historial de correcciones" meta={String(detail.corrections.length)} />
                  <ul className="grid gap-2">
                    {detail.corrections.map((item) => (
                      <li key={item.id} className="grid gap-0.5 border-b border-line pb-2 last:border-b-0">
                        <p className="text-meta text-ink">{item.previousResultType ?? "—"} → {item.newResultType ?? "—"} · {item.previousHomeScore ?? "—"} - {item.previousAwayScore ?? "—"} → {item.newHomeScore ?? "—"} - {item.newAwayScore ?? "—"}</p>
                        <p className="gei-meta">{item.correctionReason} · {dateLabel(item.correctedAt.slice(0, 10), true)}</p>
                      </li>
                    ))}
                  </ul>
                </Surface>
              )}
            </>
          ) : (
            <Empty title="El acta no está disponible para vos" detail="Sólo el entrenador del equipo registra el resultado oficial del partido." />
          )}
        </div>

        <aside className="grid content-start gap-3">
          <Surface className="grid gap-2">
            <p className="gei-body-strong">Estado del evento</p>
            <StateBadge value={eventState ?? "SCHEDULED"} />
            <p className="gei-meta">El resultado se finaliza con el evento en curso.</p>
          </Surface>
        </aside>
      </div>

      {finalizeOpen && (
        <Modal
          title="Finalizar el resultado"
          description="El acta queda final y las estadísticas se congelan."
          onClose={() => setFinalizeOpen(false)}
          footer={
            <>
              <Button variant="quiet" onClick={() => setFinalizeOpen(false)} disabled={pending === "finalize"}>Cancelar</Button>
              <Button variant="primary" busy={pending === "finalize"} data-testid="match-record-finalize-submit" onClick={() => void finalize()}>
                Finalizar
              </Button>
            </>
          }
        >
          <div className="grid gap-4">
            {scoreError && <Banner tone="danger" title="Falta el marcador" data-testid="match-record-score-error"><span className="text-ink-strong">{scoreError}</span></Banner>}
            <RadioGroup
              legend="Resultado"
              name="match-result-type"
              value={resultType}
              onChange={(value) => setResultType(value as ResultType)}
              options={[
                { value: "PLAYED", label: "Jugado" },
                { value: "FORFEIT", label: "No jugado" },
                { value: "ABANDONED", label: "Suspendido" },
              ]}
            />
            {resultType === "PLAYED" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField id="match-record-home-score" label="Gol de GEI" type="number" min={0} value={homeScore} data-testid="match-record-home-score" onChange={(event) => setHomeScore(event.target.value)} />
                <TextField id="match-record-away-score" label="Gol del rival" type="number" min={0} value={awayScore} data-testid="match-record-away-score" onChange={(event) => setAwayScore(event.target.value)} />
              </div>
            )}
            <TextArea id="match-record-observations" label="Observaciones" value={observations} data-testid="match-record-observations" onChange={(event) => setObservations(event.target.value)} />
          </div>
        </Modal>
      )}

      {correctionOpen && (
        <Modal
          title="Corregir el resultado oficial"
          description="La corrección queda registrada con el valor anterior, el nuevo y el motivo."
          onClose={() => setCorrectionOpen(false)}
          footer={
            <>
              <Button variant="quiet" onClick={() => setCorrectionOpen(false)} disabled={pending === "correct"}>Cancelar</Button>
              <Button variant="primary" busy={pending === "correct"} disabled={!reason.trim()} data-testid="match-record-correct-submit" onClick={() => void correct()}>
                Registrar corrección
              </Button>
            </>
          }
        >
          <div className="grid gap-4">
            {scoreError && <Banner tone="danger" title="Falta el marcador" data-testid="match-record-score-error"><span className="text-ink-strong">{scoreError}</span></Banner>}
            <RadioGroup
              legend="Resultado corregido"
              name="match-correction-result"
              value={resultType}
              onChange={(value) => setResultType(value as ResultType)}
              options={[
                { value: "PLAYED", label: "Jugado" },
                { value: "FORFEIT", label: "No jugado" },
                { value: "ABANDONED", label: "Suspendido" },
              ]}
            />
            {resultType === "PLAYED" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField id="match-record-correct-home" label="Gol de GEI" type="number" min={0} value={homeScore} onChange={(event) => setHomeScore(event.target.value)} />
                <TextField id="match-record-correct-away" label="Gol del rival" type="number" min={0} value={awayScore} onChange={(event) => setAwayScore(event.target.value)} />
              </div>
            )}
            <TextArea id="match-record-reason" label="Motivo de la corrección" required value={reason} data-testid="match-record-reason" onChange={(event) => setReason(event.target.value)} />
          </div>
        </Modal>
      )}
    </PageShell>
  )
}
