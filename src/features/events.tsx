import { useMemo, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import {
  ArrowRight,
  CheckCircle2,
  History,
  Info,
  MapPin,
  Megaphone,
  Users,
} from "lucide-react"
import {
  useProduct,
  StaleVersionError,
  type SeriesChangeResult,
} from "../mock/store"
import {
  dateLabel,
  dateTimeLabel,
  eventAvailabilityView,
  eventName,
  eventTargetsText,
  hasLiveSchedule,
  relativeLabel,
  teamName,
  venueOf,
  type Event,
  type SeriesScope,
} from "../mock/model"
import { seriesOccurrences, seriesOf } from "../mock/series"
import { computeImpact, type Impact } from "../mock/impact"
import {
  activeTeamAssignments,
  selectionConflicts,
  visibleEvents,
  CONFLICT_TEXT,
  conflictCodesFor,
} from "../mock/derive"
import {
  Banner,
  Button,
  ConfirmDialog,
  Empty,
  Expander,
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
  TextLink,
  cx,
} from "../shared/ui"
import { stateText } from "../shared/states"
import {
  DetailSection,
  HistoryList,
  ImpactPreview,
  PageContextHeader,
  ScopeDialog,
  SectionHeader,
  StateBanner,
} from "../shared/patterns"
import { VasControl } from "../shared/vas"
import type { SeriesScopeOption } from "../shared/patterns"

/* ═══════════════════════════════════════════════════════════════
   UTILIDADES DE PRESENTACIÓN
   ═══════════════════════════════════════════════════════════════ */

const TYPE_LABEL: Record<Event["type"], string> = {
  MATCH: "Partido",
  TRAINING: "Entrenamiento",
  CLUB_EVENT: "Evento del club",
}

const FIELD_LABEL: Record<string, string> = {
  date: "Fecha",
  time: "Hora de inicio",
  end: "Hora de fin",
  venueId: "Sede",
  targetTeams: "Equipos destino",
  targetPersonIds: "Personas destino",
  clubWide: "Destino",
  opponent: "Rival",
  competitionId: "Competencia",
  meeting: "Hora de encuentro",
  departure: "Hora de salida",
  point: "Punto de encuentro",
  transport: "Cómo se llega",
  arrival: "Cómo llegar a la cancha",
  title: "Título",
}

function conflictSummary(event: Event, state: Parameters<typeof selectionConflicts>[0]) {
  return selectionConflicts(state, event)
}

/* ═══════════════════════════════════════════════════════════════
   CONFLICT WORKSPACE — nunca destruye el borrador
   ═══════════════════════════════════════════════════════════════ */

interface DraftSnapshot {
  [key: string]: unknown
}

function ConflictWorkspace({
  baseline,
  local,
  latest,
  onKeepMine,
  onTakeLatest,
  onClose,
}: {
  baseline: DraftSnapshot
  local: DraftSnapshot
  latest: DraftSnapshot
  onKeepMine: () => void
  onTakeLatest: () => void
  onClose: () => void
}) {
  const [step, setStep] = useState<"desktop" | "compare">("desktop")
  const keys = Array.from(
    new Set([...Object.keys(local), ...Object.keys(latest)]),
  ).filter((key) => FIELD_LABEL[key])

  const rows = keys.map((key) => ({
    key,
    label: FIELD_LABEL[key],
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
          <Button variant="quiet" onClick={() => setStep("compare")}>
            Revisar diferencias
          </Button>
          <Button variant="secondary" onClick={onTakeLatest}>
            Actualizar con la versión actual
          </Button>
          <Button variant="primary" onClick={onKeepMine}>
            Mantener mis cambios donde sea seguro
          </Button>
        </>
      }
    >
      <div className="grid gap-4">
        <Banner tone="attention" title="No se perdió nada de lo que escribiste">
          <span className="text-ink-strong">
            Abajo comparamos la versión con la que empezaste, tus cambios y la
            versión que está ahora en el club.
          </span>
        </Banner>

        <div className={cx("grid gap-3", step === "desktop" ? "lg:grid-cols-3" : "") }>
          <VersionColumn
            title="Con la que empezaste"
            tone="neutral"
            rows={rows.map((row) => ({ label: row.label, value: row.base }))}
          />
          <VersionColumn
            title="Tus cambios"
            tone="selected"
            rows={rows.map((row) => ({
              label: row.label,
              value: row.mine,
              changed: row.mine !== row.base,
            }))}
          />
          <VersionColumn
            title="La versión actual"
            tone="attention"
            rows={rows.map((row) => ({
              label: row.label,
              value: row.theirs,
              changed: row.theirs !== row.base,
            }))}
          />
        </div>

        <div className="rounded-surface border border-line bg-control p-4">
          <p className="gei-body-strong">Qué podés mantener sin riesgo</p>
          <ul className="mt-2 grid gap-1.5">
            {rows.filter((row) => row.safe && row.mine !== row.base).map((row) => (
              <li key={row.key} className="gei-body text-ink-strong">
                {row.label}: el club no lo cambió, así que tu versión se puede
                guardar sin pisar nada.
              </li>
            ))}
            {rows.filter((row) => !row.safe && row.mine !== row.base).map((row) => (
              <li key={row.key} className="gei-body text-ink-strong">
                {row.label}: el club cambió este campo mientras editabas. Si lo
                mantenés, va a pisar su cambio.
              </li>
            ))}
            {rows.every((row) => row.mine === row.base) && (
              <li className="gei-meta">No habías cambiado ningún campo.</li>
            )}
          </ul>
        </div>
      </div>
    </Modal>
  )
}

function VersionColumn({
  title,
  tone,
  rows,
}: {
  title: string
  tone: "neutral" | "selected" | "attention"
  rows: Array<{ label: string; value: string; changed?: boolean }>
}) {
  return (
    <div
      className={cx(
        "grid content-start gap-2 rounded-surface border p-3",
        tone === "neutral" && "border-line bg-surface",
        tone === "selected" && "border-selected-line bg-selected-soft",
        tone === "attention" && "border-attention-line bg-attention-soft",
      )}
    >
      <p className="text-meta font-semibold uppercase tracking-wide text-ink-muted">
        {title}
      </p>
      <ul className="grid gap-1.5">
        {rows.map((row) => (
          <li key={row.label} className="grid gap-0.5">
            <span className="text-micro uppercase tracking-wide text-ink-faint">
              {row.label}
            </span>
            <span
              className={cx(
                "text-body tabular-nums",
                row.changed ? "font-semibold text-ink" : "text-ink-muted",
              )}
            >
              {row.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   DETALLE DE EVENTO
   ═══════════════════════════════════════════════════════════════ */

const TERMINAL = ["CANCELLED", "COMPLETED", "ABANDONED", "POSTPONED"] as const

const BUCKETS: Array<{
  key: "YES" | "MAYBE" | "NO"
  label: string
  tone: "success" | "warning" | "danger"
}> = [
  { key: "YES", label: "Voy", tone: "success" },
  { key: "MAYBE", label: "Tal vez", tone: "warning" },
  { key: "NO", label: "No voy", tone: "danger" },
]

export function EventDetail() {
  const { eventId = "" } = useParams()
  const navigate = useNavigate()
  const { state, authority, actor } = useProduct()
  const [sheet, setSheet] = useState<null | "history" | "lifecycle">(null)
  const [pending, setPending] = useState<null | Event["state"]>(null)
  const [lifecycleError, setLifecycleError] = useState("")

  const event = state.events.find((item) => item.id === eventId)
  if (!event)
    return (
      <div className="mx-auto max-w-3xl">
        <Empty
          title="Ese evento ya no está"
          detail="Puede que se haya archivado o que el enlace esté incompleto."
        />
      </div>
    )

  const venue = venueOf(state, event)
  const series = seriesOf(state, event)
  const coach = authority.isCoachOfTeam(event.targetTeams[0] ?? "")
  const official = authority.isClubWide
  const canOperate = coach || official
  const isTerminal = (TERMINAL as readonly string[]).includes(event.state)
  const eventId_ = event.id
  const selectionConflictsList = event.published
    ? conflictSummary(event, state)
    : []
  const meInvited = event.published?.includes(actor.id) ?? false
  const canRespondHere = authority.canRespondOwn
  const view = eventAvailabilityView(event, actor.id)
  const myTeams = activeTeamAssignments(state, actor.id).map((a) => a.teamId)

  const counts = useMemo(() => {
    const values = Object.values(event.availability)
    return {
      YES: values.filter((item) => item.value === "YES").length,
      MAYBE: values.filter((item) => item.value === "MAYBE").length,
      NO: values.filter((item) => item.value === "NO").length,
    }
  }, [event])

  const conversation = state.conversations.find(
    (item) => item.eventId === event.id,
  )

  async function runTransition(to: Event["state"], reason: string) {
    setPending(to)
    setLifecycleError("")
    try {
      await transition(to, reason)
    } catch {
      setLifecycleError("No pudimos aplicar el cambio. Volvé a intentar.")
    } finally {
      setPending(null)
      setSheet(null)
    }
  }

  const { transitionEvent } = useProduct()

  async function transition(to: Event["state"], reason: string) {
    await transitionEvent(eventId_, to, reason)
  }

  /* ── Composición distinta para estados sin vida operativa ── */
  if (isTerminal) {
    return (
      <div className="gei-stack-page mx-auto max-w-3xl">
        <PageContextHeader
          context={TYPE_LABEL[event.type]}
          title={eventName(event)}
          back="/calendar"
          action={<StateBadge value={event.state} emphasis />}
        />

        <TerminalNotice event={event} />

        <Surface className="grid gap-2">
          <p className="gei-meta">Cómo estaba-coordinate</p>
          <RowStatic
            title="Fecha"
            detail={`${dateLabel(event.date, true)} · ${
              event.state === "POSTPONED" ? "sin horario vigente" : event.time
            }`}
          />
          <RowStatic
            title="Sede"
            detail={`${venue?.name ?? "Sin sede"} · ${venue?.address ?? ""}`}
          />
          <RowStatic title="Destino" detail={eventTargetsText(state, event)} />
        </Surface>

        {event.state === "COMPLETED" && event.record.state === "FINAL" && (
          <DetailSection title="Resultado final">
            <p className="gei-l5 tabular-nums">
              {event.record.gei}–{event.record.opponent}
            </p>
            {event.record.observations && (
              <p className="gei-body">{event.record.observations}</p>
            )}
          </DetailSection>
        )}

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setSheet("history")}>
            <History size={16} aria-hidden />
            Ver historial
          </Button>
          {canOperate && event.state === "CANCELLED" && (
            <Button
              variant="secondary"
              onClick={() =>
                runTransition("SCHEDULED", "Restauración del evento cancelado")
              }
              busy={pending === "SCHEDULED"}
            >
              Restaurar el evento
            </Button>
          )}
        </div>

        {lifecycleError && (
          <Banner tone="danger" title="No pudimos aplicar el cambio">
            <span className="text-ink-strong">{lifecycleError}</span>
          </Banner>
        )}

        {sheet === "history" && (
          <Modal title="Historial del evento" onClose={() => setSheet(null)}>
            <HistoryList
              entries={event.history.map((line) => ({
                action: line.text,
                actor: line.actor,
                at: dateTimeLabel(line.at),
              }))}
              emptyText="Sin movimientos registrados."
            />
          </Modal>
        )}
      </div>
    )
  }

  /* ── Composición operativa ── */
  return (
    <div className="gei-stack-page mx-auto max-w-4xl">
      <PageContextHeader
        context={TYPE_LABEL[event.type]}
        title={eventName(event)}
        lead={`${dateLabel(event.date, true)} · ${
          hasLiveSchedule(event) ? event.time : "sin horario vigente"
        } · ${venue?.name ?? "Sin sede"}`}
        action={
          <div className="flex items-center gap-2">
            <StateBadge value={event.state} />
            {canOperate && (
              <Menu
                label="Acciones"
                items={[
                  {
                    label: "Editar evento",
                    onSelect: () => navigate(`/events/${event.id}/edit`),
                  },
                  ...(authority.canTransitionEvent(event, "POSTPONED")
                    ? [
                        {
                          label: "Postergar",
                          onSelect: () => setSheet("lifecycle"),
                        },
                      ]
                    : []),
                  ...(authority.canTransitionEvent(event, "CANCELLED")
                    ? [
                        {
                          label: "Cancelar evento",
                          danger: true,
                          onSelect: () => setSheet("lifecycle"),
                        },
                      ]
                    : []),
                ]}
              />
            )}
          </div>
        }
        below={
          event.state === "DRAFT" ? (
            <Banner tone="neutral" title="Este evento todavía es un borrador">
              <span className="text-ink-strong">
                Todavía no tiene horario operativo: programalo para que la
                disponibilidad y la convocatoria funcionen.
              </span>
            </Banner>
          ) : undefined
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid gap-6">
          {/* Situación actual + acción */}
          {meInvited && (
            <Banner tone="selected" title="Estás convocada para este partido">
              <span className="text-ink-strong">
                Tu convocatoria está publicada. Si algo cambia, te avisamos y
                podés volver a confirmar.
              </span>
            </Banner>
          )}

          {canRespondHere && event.state === "SCHEDULED" && (
            <Surface>
              <VasControl event={event} personId={actor.id} />
            </Surface>
          )}

          {!canRespondHere && event.state === "SCHEDULED" && (
            <Surface className="grid gap-1">
              <p className="gei-body-strong">¿Vas?</p>
              <p className="gei-meta">
                Vos no jugás este evento, así que no respondés disponibilidad. Abajo está lo que dijo cada jugadora.
              </p>
            </Surface>
          )}

          {canOperate && (
            <Surface className="grid gap-3">
              <SectionHeader
                title="Operación pendiente"
                meta={
                  event.published === null
                    ? "Convocatoria sin publicar"
                    : event.type === "MATCH" &&
                        authority.canManageRecord(event) &&
                        event.record.state !== "FINAL"
                      ? "Resultado sin finalizar"
                      : event.attendanceClosedAt
                        ? "Asistencia cerrada"
                        : !event.attendanceOpened && authority.canManageAttendance(event)
                          ? "Asistencia sin abrir"
                          : "Convocatoria publicada"
                }
              />
              <ul className="grid gap-1">
                <RowLink
                  to={`/events/${event.id}/selection`}
                  title="Convocadas"
                  detail={
                    event.published === null
                      ? "Todavía no hay convocatoria publicada."
                      : `${event.published.length} convocadas${
                          selectionConflictsList.length > 0
                            ? ` · ${selectionConflictsList.length} con un problema a revisar`
                            : ""
                        }`
                  }
                  leading={<Users size={17} aria-hidden className="text-ink-faint" />}
                />
                {authority.canManageAttendance(event) && (
                  <RowLink
                    to={`/events/${event.id}/attendance`}
                    title="Asistencia"
                    detail={
                      event.attendanceClosedAt
                        ? "Cerrada. Las correcciones quedan registradas."
                        : Object.keys(event.attendance).length > 0
                          ? `${Object.keys(event.attendance).length} de ${
                              myTeams.length
                            } registradas`
                          : "Todavía no se registró asistencia"
                    }
                  />
                )}
                {event.type === "MATCH" && authority.canManageRecord(event) && (
                  <RowLink
                    to={`/events/${event.id}/match-record`}
                    title="Resultado"
                    detail={
                      event.record.state === "FINAL"
                        ? `${event.record.gei}–${event.record.opponent} · Finalizado`
                        : "Borrador: todavía no cuenta como resultado oficial"
                    }
                  />
                )}
              </ul>
            </Surface>
          )}

          {official && !coach && (
            <Surface className="grid gap-3">
              <SectionHeader title="Coordinación oficial" />
              <ul className="grid gap-1">
                {event.competitionId && (
                  <RowStatic
                    title="Competencia"
                    detail={
                      state.competitions.find(
                        (competition) => competition.id === event.competitionId,
                      )?.name ?? "Competencia sin datos"
                    }
                  />
                )}
                <RowLink
                  to={`/communication/announcements/new?event=${event.id}`}
                  title="Comunicar un cambio"
                  detail="Publicar un comunicado para las personas alcanzadas por este evento."
                  leading={<Megaphone size={17} aria-hidden className="text-ink-faint" />}
                />
              </ul>
            </Surface>
          )}

          {/* Participación en lectura */}
<Surface className="grid gap-3">
            <SectionHeader
              title="Quién dijo qué"
              meta={`${Object.keys(event.availability).length} respondieron`}
            />
            <ul className="grid">
              {BUCKETS.map((item) => (
                <RowStatic
                  key={item.key}
                  title={item.label}
                  leading={
                    <span
                      aria-hidden
                      className={cx(
                        "size-2.5 shrink-0 rounded-pill",
                        item.tone === "success" && "bg-success",
                        item.tone === "warning" && "bg-warning",
                        item.tone === "danger" && "bg-danger",
                      )}
                    />
                  }
                  trailing={
                    <span className="gei-body-strong tabular-nums">
                      {counts[item.key]}
                    </span>
                  }
                />
              ))}
              <RowStatic
                title="Sin responder"
                trailing={
                  <span className="gei-body-strong tabular-nums">
                    {Math.max(
                      0,
                      activeTeamAssignments(state, actor.id)
                        .filter((assignment) =>
                          event.targetTeams.includes(assignment.teamId),
                        ).length -
                        Object.keys(event.availability).length,
                    )}
                  </span>
                }
              />
            </ul>
          </Surface>

          {/* Logística */}
          <DetailSection title="Logística">
            <dl className="grid">
              <RowStatic
                title="Dónde y cuándo"
                detail={`${venue?.name ?? "Sin sede"} · ${venue?.address ?? ""}${
                  venue?.fieldLabel ? ` · ${venue.fieldLabel}` : ""
                }`}
              />
              <RowStatic
                title="Encuentro"
                detail={
                  event.meeting
                    ? `${event.meeting}${
                        event.departure ? ` · salida ${event.departure}` : ""
                      }`
                    : "Sin horario de encuentro definido"
                }
              />
              <RowStatic title="Punto de encuentro" detail={event.point || "Sin definir"} />
              <RowStatic title="Cómo se llega" detail={event.transport || "Sin definir"} />
              <RowStatic
                title="Cómo llegar a la cancha"
                detail={event.arrival || "Sin definir"}
              />
            </dl>
          </DetailSection>

          {/* Conversación del evento */}
          {conversation && authority.canChat && (
            <DetailSection title="Mensajes de este evento">
              <ul className="grid gap-2">
                {conversation.messages.slice(-2).map((message) => {
                  const author = state.people.find(
                    (person) => person.id === message.author,
                  )
                  return (
                    <li key={message.id} className="rounded-control bg-control px-3 py-2">
                      <p className="text-meta font-semibold text-ink">
                        {author?.name ?? ""}
                      </p>
                      <p className="gei-body text-ink-strong">
                        {message.deletedAt ? "Mensaje eliminado" : message.body}
                      </p>
                    </li>
                  )
                })}
              </ul>
              <Link
                to={`/conversations/${conversation.id}`}
                className="gei-target inline-flex items-center gap-1.5 rounded-control px-1 text-meta font-semibold text-interactive hover:underline"
              >
                Abrir la conversación
                <ArrowRight size={13} aria-hidden />
              </Link>
            </DetailSection>
          )}

          <DetailSection
            title="Historial"
            action={
              <Button variant="quiet" onClick={() => setSheet("history")}>
                Ver todo
              </Button>
            }
          >
            {event.history.length === 0 ? (
              <p className="gei-meta">Todavía no hay movimientos.</p>
            ) : (
              <ul className="grid">
                {event.history.slice(0, 3).map((line, index) => (
                  <li
                    key={index}
                    className="border-b border-line py-2.5 last:border-b-0"
                  >
                    <div>
                    <p className="gei-body text-ink-strong">{line.text}</p>
                    <p className="gei-meta">
                      {line.actor} · {dateTimeLabel(line.at)}
                    </p>
                  </div>
                  </li>
                ))}
              </ul>
            )}
          </DetailSection>
        </div>

        <aside className="grid content-start gap-3">
          <Surface className="grid gap-3">
            <p className="gei-body-strong">Resumen</p>
            <dl className="grid gap-2">
              <RowStatic
                title="Destino"
                detail={eventTargetsText(state, event)}
              />
              {canRespondHere && (
                <RowStatic title="Tu respuesta" detail={stateText(view)} />
              )}
              <RowStatic
                title="Convocatoria"
                detail={
                  event.published === null
                    ? "Sin publicar"
                    : `${event.published.length} personas`
                }
              />
              {series && (
                <RowStatic
                  title="Serie"
                  detail={`${series.name} · ${seriesOccurrences(state, event.id, "ENTIRE_SERIES").length} eventos`}
                />
              )}
            </dl>
          </Surface>

          {canOperate && (
            <Surface className="grid gap-2">
              <p className="gei-body-strong">Qué podés hacer acá</p>
              <ul className="grid gap-1.5">
                <li className="gei-body text-ink-strong">Editar los datos del evento</li>
                <li className="gei-body text-ink-strong">Administrar la convocatoria</li>
                {authority.canManageAttendance(event) && (
                  <li className="gei-body text-ink-strong">Tomar asistencia</li>
                )}
                {event.type === "MATCH" && authority.canManageRecord(event) && (
                  <li className="gei-body text-ink-strong">Cargar el resultado</li>
                )}
                <li className="gei-body text-ink-strong">Postergar o cancelar</li>
              </ul>
            </Surface>
          )}
        </aside>
      </div>

      {sheet === "history" && (
        <Modal title="Historial del evento" onClose={() => setSheet(null)}>
          <HistoryList
            entries={event.history.map((line) => ({
              action: line.text,
              actor: line.actor,
              at: dateTimeLabel(line.at),
            }))}
            emptyText="Sin movimientos registrados."
          />
        </Modal>
      )}

      {sheet === "lifecycle" && (
        <Sheet
          title="Cambiar el estado del evento"
          description="Estas acciones cambian la situación para todo el club."
          onClose={() => setSheet(null)}
        >
          <LifecycleActions
            event={event}
            onPick={(to, reason) => runTransition(to, reason)}
            pending={pending}
            error={lifecycleError}
          />
        </Sheet>
      )}
    </div>
  )
}

function TerminalNotice({ event }: { event: Event }) {
  if (event.state === "CANCELLED")
    return (
      <Banner tone="danger" title="Este evento fue cancelado">
        <span className="text-ink-strong">
          La información que estaba antes queda disponible como referencia, pero
          el evento ya no forma parte de la temporada.
        </span>
      </Banner>
    )
  if (event.state === "ABANDONED")
    return (
      <Banner tone="warning" title="El partido se suspendió antes de terminar">
        <span className="text-ink-strong">
          No hay resultado oficial. El motivo queda registrado en el historial.
        </span>
      </Banner>
    )
  if (event.state === "COMPLETED")
    return (
      <Banner tone="success" title="Este evento ya se jugó">
        <span className="text-ink-strong">
          La convocatoria y la asistencia quedaron cerradas. Cualquier
          corrección pide un motivo y queda registrada.
        </span>
      </Banner>
    )
  return (
    <Banner tone="warning" title="No hay horario vigente">
      <span className="text-ink-strong">
        Este evento está postergado. Cuando la Subcomisión defina la nueva fecha
        vuelve a aparecer en la agenda y las respuestas anteriores piden
        confirmación.
      </span>
    </Banner>
  )
}

function LifecycleActions({
  event,
  onPick,
  pending,
  error,
}: {
  event: Event
  onPick: (to: Event["state"], reason: string) => void
  pending: Event["state"] | null
  error: string
}) {
  const { authority } = useProduct()
  const options: Array<{
    to: Event["state"]
    label: string
    consequence: string
    danger?: boolean
    requiresReason: boolean
  }> = []
  if (authority.canTransitionEvent(event, "POSTPONED"))
    options.push({
      to: "POSTPONED",
      label: "Postergar",
      consequence:
        "El evento deja de tener horario vigente y todas las respuestas anteriores piden confirmación de nuevo.",
      requiresReason: true,
    })
  if (authority.canTransitionEvent(event, "CANCELLED"))
    options.push({
      to: "CANCELLED",
      label: "Cancelar",
      consequence:
        "El evento sale de la temporada. La información queda como referencia y se puede restaurar después.",
      danger: true,
      requiresReason: true,
    })
  if (authority.canTransitionEvent(event, "COMPLETED"))
    options.push({
      to: "COMPLETED",
      label: "Dar por terminado",
      consequence: "El evento queda cerrado y pasa al historial.",
      requiresReason: true,
    })
  if (authority.canTransitionEvent(event, "ABANDONED"))
    options.push({
      to: "ABANDONED",
      label: "Suspender",
      consequence: "El partido no llegó a terminar. No hay resultado oficial.",
      danger: true,
      requiresReason: true,
    })

  const [active, setActive] = useState<(typeof options)[number] | null>(null)
  const [reason, setReason] = useState("")

  if (options.length === 0)
    return (
      <Banner tone="neutral" title="No hay transiciones disponibles desde acá">
        <span className="text-ink-strong">
          Tu rol no permite cambiar el estado de este evento en esta situación.
        </span>
      </Banner>
    )

  return (
    <div className="grid gap-3">
      {options.map((option) => (
        <button
          key={option.to}
          type="button"
          onClick={() => setActive(option)}
          className={cx(
            "gei-target grid gap-1 rounded-surface border p-4 text-left transition-colors",
            option.danger
              ? "border-danger-line bg-danger-soft hover:border-danger"
              : "border-line-strong bg-surface hover:border-ink-faint",
          )}
        >
          <span
            className={cx(
              "text-body font-semibold",
              option.danger ? "text-danger" : "text-ink",
            )}
          >
            {option.label}
          </span>
          <span className="gei-meta text-ink-strong">{option.consequence}</span>
        </button>
      ))}
      {error && (
        <Banner tone="danger" title="No pudimos aplicar el cambio">
          <span className="text-ink-strong">{error}</span>
        </Banner>
      )}
      {active && (
        <ConfirmDialog
          title={active.label}
          consequence={active.consequence}
          confirmLabel={active.label}
          requireReason={active.requiresReason}
          reasonLabel="Por qué lo hacés"
          pending={pending === active.to}
          onClose={() => {
            setActive(null)
            setReason("")
          }}
          onConfirm={(value) => {
            onPick(active.to, value || reason)
            setActive(null)
          }}
          extra={
            <TextArea
              label="Detalle"
              rows={3}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              hint="Queda en el historial junto con tu nombre."
            />
          }
        />
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FORMULARIO DE EVENTO
   Material vs no material · alcance de serie · conflict workspace
   ═══════════════════════════════════════════════════════════════ */

type FormState = {
  title: string
  date: string
  time: string
  end: string
  venueId: string
  targetTeams: string[]
  clubWide: boolean
  opponent: string
  meeting: string
  departure: string
  point: string
  transport: string
  arrival: string
  seriesId: string
}

function initialForm(event: Event | undefined): FormState {
  if (!event)
    return {
      title: "",
      date: "",
      time: "",
      end: "",
      venueId: "v1",
      targetTeams: [],
      clubWide: false,
      opponent: "",
      meeting: "",
      departure: "",
      point: "",
      transport: "",
      arrival: "",
      seriesId: "",
    }
  return {
    title: event.title,
    date: event.date,
    time: event.time,
    end: event.end,
    venueId: event.venueId,
    targetTeams: [...event.targetTeams],
    clubWide: event.clubWide,
    opponent: event.opponent,
    meeting: event.meeting,
    departure: event.departure,
    point: event.point,
    transport: event.transport,
    arrival: event.arrival,
    seriesId: event.seriesId ?? "",
  }
}

function diffForm(base: FormState, next: FormState) {
  const patch: Partial<Event> = {}
  if (base.title !== next.title) patch.title = next.title
  if (base.date !== next.date) patch.date = next.date
  if (base.time !== next.time) patch.time = next.time
  if (base.end !== next.end) patch.end = next.end
  if (base.venueId !== next.venueId) patch.venueId = next.venueId
  if (base.targetTeams.join("|") !== next.targetTeams.join("|"))
    patch.targetTeams = next.targetTeams
  if (base.clubWide !== next.clubWide) patch.clubWide = next.clubWide
  if (base.opponent !== next.opponent) patch.opponent = next.opponent
  if (base.meeting !== next.meeting) patch.meeting = next.meeting
  if (base.departure !== next.departure) patch.departure = next.departure
  if (base.point !== next.point) patch.point = next.point
  if (base.transport !== next.transport) patch.transport = next.transport
  if (base.arrival !== next.arrival) patch.arrival = next.arrival
  return patch
}

export function EventForm() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { state, authority, applyEventChange, patchEventMeta, update } = useProduct()
  const [queryTeam] = [null]
  void queryTeam

  const editing = !!eventId
  const event = state.events.find((item) => item.id === eventId)
  const baseline = useRef<FormState>(initialForm(event))
  const [form, setForm] = useState<FormState>(baseline.current)
  const [type, setType] = useState<Event["type"]>(event?.type ?? "TRAINING")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pending, setPending] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [scopeDialog, setScopeDialog] = useState(false)
  const [impact, setImpact] = useState<Impact | null>(null)
  const [conflict, setConflict] = useState<{
    baseline: Record<string, unknown>
    local: Record<string, unknown>
    latest: Record<string, unknown>
  } | null>(null)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [formError, setFormError] = useState("")
  const firstErrorRef = useRef<string | null>(null)

  const seriesCandidates = event?.seriesId
    ? state.eventSeries.filter((series) => series.id === event.seriesId)
    : []

  const scopeOptions: SeriesScopeOption[] = event
    ? (["ONLY_THIS", "THIS_AND_FOLLOWING", "ENTIRE_SERIES"] as const).map(
        (scope) => ({
          value: scope,
          title:
            scope === "ONLY_THIS"
              ? "Sólo este evento"
              : scope === "THIS_AND_FOLLOWING"
                ? "Este y los siguientes"
                : "Toda la serie",
          detail:
            scope === "ONLY_THIS"
              ? "El resto de la serie queda como está."
              : scope === "THIS_AND_FOLLOWING"
                ? "Se aplica desde acá en adelante. Lo anterior no se toca."
                : "Se aplica a todos los eventos de la serie.",
          count: seriesOccurrences(state, event.id, scope).length,
        }),
      )
    : []

  const canEditThis = event ? authority.canEditEvent(event) : authority.canCreateEvent

  if (editing && !event)
    return (
      <div className="mx-auto max-w-3xl">
        <Empty
          title="Ese evento ya no está"
          detail="Puede que se haya cancelado o que el enlace esté incompleto."
        />
      </div>
    )

  // Narrowing explícito: en alta no existe `target` y no se usa.
  const target = event as Event

  if (!canEditThis)
    return (
      <div className="mx-auto max-w-3xl">
        <Empty
          title="No podés editar este evento"
          detail="Tu rol no tiene alcance sobre este equipo o evento. Pedile a la Subcomisión o al entrenador."
        />
      </div>
    )

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
    if (!form.clubWide && form.targetTeams.length === 0)
      found.targetTeams = "Elegí al menos un equipo destino."
    if (type === "MATCH" && !form.opponent.trim())
      found.opponent = "Escribí contra quién se juega."
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      firstErrorRef.current = first
      window.setTimeout(() => {
        document.getElementById(`field-${first}`)?.focus()
      }, 0)
    }
    return Object.keys(found).length === 0
  }

  const patch = diffForm(baseline.current, form)
  const materialFields = Object.keys(patch).filter(
    (key) => key !== "title",
  )
  const isNonMaterialOnly =
    editing && Object.keys(patch).length > 0 && materialFields.length === 0

  async function submit() {
    setFormError("")
    if (!validate()) return
    if (!editing) {
      // Alta simple: el alcance de serie se resuelve en la edición.
      const id = `event-${crypto.randomUUID().slice(0, 8)}`
      update(
        (draft) => {
          const teams = draft.teams
            .filter((team) => team.state === "ACTIVE")
            .filter((team) => form.targetTeams.includes(team.id))
            .map((team) => {
              const responders = draft.teamAssignments
                .filter((a) => a.teamId === team.id && !a.validUntil)
                .map((a) => a.personId)
              return Object.fromEntries(
                responders.map((personId) => [
                  personId,
                  {
                    value: "YES" as const,
                    coordinationRevision: 1,
                    answeredAt: new Date().toISOString(),
                  },
                ]),
              )
            })
            .reduce<Record<string, unknown>>(
              (accumulator, item) => ({ ...accumulator, ...item }),
              {},
            )
          draft.events.unshift({
            id,
            title: form.title,
            type,
            targetTeams: form.clubWide ? [] : form.targetTeams,
            targetPersonIds: [],
            seriesId: null,
            venueId: form.venueId,
            date: form.date,
            time: form.time,
            end: form.end || "20:30",
            opponent: form.opponent,
            state: "SCHEDULED",
            coordinationRevision: 1,
            version: 1,
            competitionId: type === "MATCH" ? "ahba" : null,
            meeting: form.meeting,
            departure: form.departure,
            point: form.point,
            transport: form.transport,
            arrival: form.arrival,
            clubWide: form.clubWide,
            availability: teams as never,
            selection: [],
            selectionDraftAt: null,
            published: null,
            publishedAt: null,
            selectionRevisions: [],
            attendance: {},
            attendanceOpened: false,
            attendanceClosedAt: null,
            attendanceHistory: [],
            record: {
              state: "DRAFT",
              status: "PLAYED",
              gei: 0,
              opponent: 0,
              observations: "",
              stats: {},
            },
            recordHistory: [],
            history: [
              {
                id: `h-${crypto.randomUUID().slice(0, 8)}`,
                at: new Date().toISOString(),
                actor: authority.person.name,
                text: "Evento creado",
              },
            ],
            divergedFromSeries: false,
          })
        },
        {
          action: "Crear evento",
          resource: form.title,
          before: null,
          after: form.date,
          source: "Alta de evento",
          route: `/events/${id}`,
        },
      )
      navigate(`/events/${id}`)
      return
    }

    if (isNonMaterialOnly) {
      patchEventMeta(target.id, { title: form.title }, "Corrección de redacción")
      navigate(`/events/${target.id}`)
      return
    }

    setPending(true)
    try {
      if (target.seriesId) {
        setScopeDialog(true)
        return
      }
      const result = await applyEventChange(
        target.id,
        patch,
        "ONLY_THIS",
        "Editar evento",
      )
      void result
      navigate(`/events/${target.id}`)
    } catch (error) {
      if (error instanceof StaleVersionError)
        setConflict({
          baseline: error.baseline,
          local: error.local,
          latest: error.latest,
        })
      else setFormError("No pudimos guardar. Volvé a intentar.")
    } finally {
      setPending(false)
    }
  }

  async function chooseScope(scope: SeriesScope) {
    setScopeDialog(false)
    setPending(true)
    try {
      const result = await applyEventChange(
        target.id,
        patch,
        scope,
        "Editar evento",
      )
      setImpact(null)
      navigate(`/events/${target.id}`)
      void result
    } catch (error) {
      if (error instanceof StaleVersionError)
        setConflict({
          baseline: error.baseline,
          local: error.local,
          latest: error.latest,
        })
      else setFormError("No pudimos guardar. Volvé a intentar.")
    } finally {
      setPending(false)
    }
  }

  const previewImpact = event
    ? computeImpact(state, event.id, patch, "ONLY_THIS")
    : null

  return (
    <div className="gei-stack-page mx-auto max-w-3xl">
      <PageContextHeader
        context={editing ? "Editar evento" : "Nuevo evento"}
        title={editing ? "Editar evento" : "Crear evento"}
        lead={
          editing
            ? "Los cambios de horario, sede, destino o logística se aplican a toda la serie si corresponde."
            : "Cargá lo mínimo: el resto se completa a medida que avance la organización."
        }
        back={editing ? `/events/${target.id}` : "/calendar"}
        below={
          dirty ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-meta font-medium text-attention">
                Hay cambios sin guardar
              </span>
              <Button variant="quiet" onClick={() => setDiscardOpen(true)}>
                Descartar
              </Button>
            </div>
          ) : undefined
        }
      />

      <form
        onSubmit={(event_) => {
          event_.preventDefault()
          void submit()
        }}
        noValidate
        className="grid gap-5"
      >
        {formError && (
          <Banner tone="danger" title="No pudimos guardar el evento">
            <span className="text-ink-strong">{formError}</span>
          </Banner>
        )}

        <Surface className="grid gap-4">
          <SectionHeader title="Qué es" />
          <TextField
            id="field-title"
            label="Título"
            required
            value={form.title}
            error={errors.title}
            placeholder="Entrenamiento de la Sexta A"
            onChange={(next) => set("title", next.target.value)}
          />
          <RadioGroup
            legend="Tipo de evento"
            name="event-type"
            columns={3}
            value={type}
            onChange={(value) => {
              setType(value)
              setDirty(true)
            }}
            options={[
              { value: "TRAINING", label: "Entrenamiento" },
              { value: "MATCH", label: "Partido" },
              { value: "CLUB_EVENT", label: "Evento del club" },
            ]}
          />
          {type === "MATCH" && (
            <TextField
              id="field-opponent"
              label="Rival"
              required
              value={form.opponent}
              error={errors.opponent}
              placeholder="Nombre del club"
              onChange={(next) => set("opponent", next.target.value)}
            />
          )}
        </Surface>

        <Surface className="grid gap-4">
          <SectionHeader title="Cuándo y dónde" />
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField
              id="field-date"
              label="Fecha"
              type="date"
              required
              value={form.date}
              error={errors.date}
              onChange={(next) => set("date", next.target.value)}
            />
            <TextField
              id="field-time"
              label="Hora de inicio"
              type="time"
              required
              value={form.time}
              error={errors.time}
              onChange={(next) => set("time", next.target.value)}
            />
            <TextField
              id="field-end"
              label="Hora de fin"
              type="time"
              value={form.end}
              error={errors.end}
              onChange={(next) => set("end", next.target.value)}
            />
          </div>
          <Select
            id="field-venueId"
            label="Sede"
            value={form.venueId}
            error={errors.venueId}
            onChange={(next) => set("venueId", next.target.value)}
          >
            {state.venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name} · {venue.address}
              </option>
            ))}
          </Select>
        </Surface>

        <Surface className="grid gap-4">
          <SectionHeader title="Quiénes van" />
          <RadioGroup
            legend="Destino"
            name="event-audience"
            columns={2}
            value={form.clubWide ? "CLUB" : "TEAMS"}
            onChange={(value) => {
              set("clubWide", value === "CLUB")
            }}
            options={[
              { value: "TEAMS", label: "Equipos concretos" },
              { value: "CLUB", label: "Todo el hockey" },
            ]}
          />
          {!form.clubWide && (
            <fieldset className="grid gap-2" id="field-targetTeams">
              <legend className="mb-1 text-body font-semibold">Equipos destino</legend>
              {errors.targetTeams && (
                <p className="text-meta font-medium text-danger">
                  {errors.targetTeams}
                </p>
              )}
              <div className="grid gap-2 sm:grid-cols-2">
                {state.teams
                  .filter((team) => team.state === "ACTIVE")
                  .map((team) => {
                    const checked = form.targetTeams.includes(team.id)
                    return (
                      <label
                        key={team.id}
                        className={cx(
                          "gei-target flex cursor-pointer items-center gap-2.5 rounded-control border px-3 text-body font-medium transition-colors",
                          checked
                            ? "border-selected-line bg-selected-soft text-selected"
                            : "border-line-strong bg-surface hover:border-ink-faint",
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(next) =>
                            set(
                              "targetTeams",
                              next.target.checked
                                ? [...form.targetTeams, team.id]
                                : form.targetTeams.filter((id) => id !== team.id),
                            )
                          }
                          className="size-5 accent-interactive"
                        />
                        {teamName(state, team.id)}
                      </label>
                    )
                  })}
              </div>
            </fieldset>
          )}
        </Surface>

        <Surface className="grid gap-4">
          <SectionHeader title="Logística" hint="Se puede completar más adelante." />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="field-meeting"
              label="Hora de encuentro"
              type="time"
              value={form.meeting}
              onChange={(next) => set("meeting", next.target.value)}
            />
            <TextField
              id="field-departure"
              label="Hora de salida"
              type="time"
              value={form.departure}
              onChange={(next) => set("departure", next.target.value)}
            />
          </div>
          <TextField
            id="field-point"
            label="Punto de encuentro"
            value={form.point}
            onChange={(next) => set("point", next.target.value)}
          />
          <TextArea
            id="field-transport"
            label="Cómo se llega"
            rows={2}
            value={form.transport}
            onChange={(next) => set("transport", next.target.value)}
          />
          <TextArea
            id="field-arrival"
            label="Cómo llegar a la cancha"
            rows={2}
            value={form.arrival}
            onChange={(next) => set("arrival", next.target.value)}
          />
        </Surface>

        {editing && previewImpact && previewImpact.lines.length > 0 && (
          <ImpactPreview
            lines={previewImpact.lines}
            occurrences={[]}
            people={[]}
          />
        )}

        {editing && Object.keys(patch).length > 0 && (
          <p className="gei-meta">
            {isNonMaterialOnly
              ? "Es una corrección de redacción: no cambia el horario, así que no avisa a nadie ni pide impact review."
              : `Cambian ${materialFields.length} ${
                  materialFields.length === 1 ? "campo" : "campos"
                } con impacto real: se avisa a los alcanzados.`}
          </p>
        )}

        <div className="sticky bottom-16 z-20 -mx-4 flex flex-wrap items-center justify-between gap-2 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur-sm lg:bottom-0 lg:mx-0 lg:rounded-surface lg:border">
          <p className="gei-meta">
            {editing ? "Guardar" : "Crear evento"}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="quiet"
              onClick={() => {
                if (dirty) setDiscardOpen(true)
                else navigate(editing ? `/events/${target.id}` : "/calendar")
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" busy={pending}>
              {editing ? "Guardar cambios" : "Crear evento"}
            </Button>
          </div>
        </div>
      </form>

      {seriesCandidates.length > 0 && !scopeDialog && (
        <p className="gei-meta">
          Este evento pertenece a la serie “{seriesCandidates[0].name}”. Al guardar
          te vamos a preguntar el alcance.
        </p>
      )}

      {scopeDialog && (
        <ScopeDialog
          options={scopeOptions}
          onClose={() => setScopeDialog(false)}
          onPick={chooseScope}
        />
      )}

      {impact && (
        <Modal title="Impacto del cambio" onClose={() => setImpact(null)}>
          <ImpactPreview
            lines={impact.lines}
            occurrences={impact.occurrences}
            people={impact.people}
          />
        </Modal>
      )}

      {conflict && (
        <ConflictWorkspace
          baseline={conflict.baseline}
          local={conflict.local}
          latest={conflict.latest}
          onClose={() => setConflict(null)}
          onKeepMine={async () => {
            setConflict(null)
            setPending(true)
            try {
              await applyEventChange(
                target.id,
                patch,
                "ONLY_THIS",
                "Editar evento",
              )
              navigate(`/events/${target.id}`)
            } catch {
              setFormError("Volvió a cambiar. Revisá de nuevo.")
            } finally {
              setPending(false)
            }
          }}
          onTakeLatest={() => {
            setConflict(null)
            setForm({
              ...baseline.current,
              title: String(conflict.latest.title ?? baseline.current.title),
              date: String(conflict.latest.date ?? baseline.current.date),
              time: String(conflict.latest.time ?? baseline.current.time),
              end: String(conflict.latest.end ?? baseline.current.end),
              venueId: String(conflict.latest.venueId ?? baseline.current.venueId),
            })
            baseline.current = initialForm(target)
            setDirty(false)
          }}
        />
      )}

      {discardOpen && (
        <ConfirmDialog
          title="¿Descartás los cambios?"
          consequence="Vuelves a la última versión guardada. Lo que escribiste en este formulario se pierde."
          confirmLabel="Descartar cambios"
          onClose={() => setDiscardOpen(false)}
          onConfirm={() => {
            setForm(baseline.current)
            setDirty(false)
            setDiscardOpen(false)
            navigate(editing ? `/events/${target.id}` : "/calendar")
          }}
        />
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   JORNADA — detalle y alta
   Una jornada agrupa partidos de una fecha operativa. No reemplaza el ciclo
   de vida de cada partido.
   ═══════════════════════════════════════════════════════════════ */

export function JornadaPage() {
  const { jornadaId } = useParams()
  const jornada = useProduct().state.jornadas.find(
    (item) => item.id === jornadaId,
  )
  if (!jornada) return <JornadaCreate />
  return <JornadaDetail jornadaId={jornada.id} />
}

function JornadaDetail({ jornadaId }: { jornadaId: string }) {
  const navigate = useNavigate()
  const { state, authority, updateJornada } = useProduct()
  const jornada = state.jornadas.find((item) => item.id === jornadaId)!

  const events = jornada.events
    .map((id) => state.events.find((event) => event.id === id))
    .filter((event): event is Event => !!event)
  const season = state.structure.find((item) => item.id === jornada.seasonId)
  const competition = jornada.competitionId
    ? state.competitions.find((item) => item.id === jornada.competitionId)
    : undefined
  const canManage = authority.coachTeamIds.some((teamId) =>
    events.some((event) => event.targetTeams.includes(teamId)),
  )
  const [form, setForm] = useState({
    meeting: jornada.meeting,
    departure: jornada.departure,
    point: jornada.point,
    venueId: jornada.venueId ?? "v1",
  })
  const [pending, setPending] = useState(false)
  const [impactVisible, setImpactVisible] = useState(false)
  const [error, setError] = useState("")

  const bulkChanged =
    (jornada.venueId ?? "v1") !== form.venueId ||
    jornada.meeting !== form.meeting

  return (
    <div className="gei-stack-page mx-auto max-w-3xl">
      <PageContextHeader
        context="Jornadas"
        title={jornada.name}
        back="/calendar"
        lead={
          canManage
            ? "Los cambios de sede o de horario se aplican a todos los partidos de la jornada y avisan a las convocadas."
            : "Estás viendo la organización de la jornada."
        }
      />

      {error && (
        <Banner tone="danger" title="No pudimos guardar">
          <span className="text-ink-strong">{error}</span>
        </Banner>
      )}

      <DetailSection title="Contexto">
        <dl className="grid">
          <RowStatic
            title="Temporada"
            detail={season ? `Temporada ${season.name}` : "Sin temporada"}
          />
          {competition && (
            <RowStatic
              title="Competencia"
              detail={competition.name}
              trailing={
                <TextLink to={`/management/competitions/${competition.id}`}>
                  Ver
                </TextLink>
              }
            />
          )}
        </dl>
      </DetailSection>

      <DetailSection
        title="Partidos de la jornada"
        meta={`${events.length} ${events.length === 1 ? "partido" : "partidos"}`}
      >
        <ul className="grid gap-1">
          {events.map((event) => (
            <li key={event.id}>
              <RowLink
                to={`/events/${event.id}`}
                title={eventName(event)}
                detail={`${dateLabel(event.date, true)} · ${
                  hasLiveSchedule(event) ? event.time : "sin horario vigente"
                }`}
              />
            </li>
          ))}
        </ul>
      </DetailSection>

      {canManage ? (
        <Surface className="grid gap-4">
          <SectionHeader
            title="Organización de toda la jornada"
            meta={bulkChanged ? "Cambia los partidos de la jornada" : undefined}
          />
          <Select
            label="Sede de la jornada"
            value={form.venueId}
            onChange={(next) =>
              setForm((current) => ({ ...current, venueId: next.target.value }))
            }
          >
            {state.venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
              </option>
            ))}
          </Select>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Hora de encuentro"
              type="time"
              value={form.meeting}
              onChange={(next) =>
                setForm((current) => ({ ...current, meeting: next.target.value }))
              }
            />
            <TextField
              label="Hora de salida"
              type="time"
              value={form.departure}
              onChange={(next) =>
                setForm((current) => ({ ...current, departure: next.target.value }))
              }
            />
          </div>
          <TextField
            label="Punto de encuentro"
            value={form.point}
            onChange={(next) =>
              setForm((current) => ({ ...current, point: next.target.value }))
            }
          />

          {bulkChanged && (
            <ImpactPreview
              lines={[
                `Se actualizan ${events.length} ${
                  events.length === 1 ? "partido" : "partidos"
                } de la jornada.`,
                "Las personas convocadas tienen que volver a confirmar disponibilidad.",
              ]}
              occurrences={events.map((event) => ({
                id: event.id,
                label: eventName(event),
                date: event.date,
                time: event.time,
              }))}
              people={[]}
            />
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              busy={pending}
              disabled={!bulkChanged}
              onClick={() => {
                if (!bulkChanged) return
                setPending(true)
                updateJornada(
                  jornada.id,
                  {
                    venueId: form.venueId,
                    meeting: form.meeting,
                    departure: form.departure,
                    point: form.point,
                  },
                  "Organización de la jornada",
                )
                setPending(false)
                setImpactVisible(true)
              }}
            >
              Guardar jornada
            </Button>
          </div>
        </Surface>
      ) : (
        <Banner tone="neutral" title="Sólo lectura">
          <span className="text-ink-strong">
            La organización de la jornada la edita el entrenador del equipo o la
            Subcomisión.
          </span>
        </Banner>
      )}

      {impactVisible && (
        <Modal title="Jornada actualizada" onClose={() => setImpactVisible(false)}>
          <Banner tone="success" title="Guardamos los cambios de la jornada">
            <span className="text-ink-strong">
              Los partidos actualizados quedaron con horario nuevo y las
              convocadas tienen que volver a confirmar.
            </span>
          </Banner>
          <ul className="mt-3 grid gap-1">
            {events.map((event) => (
              <li key={event.id}>
                <RowLink to={`/events/${event.id}`} title={eventName(event)} />
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </div>
  )
}

function JornadaCreate() {
  const navigate = useNavigate()
  const { state, authority, createJornada } = useProduct()
  const seasons = state.structure.filter((item) => item.type === "SEASON")
  const [name, setName] = useState("")
  const [seasonId, setSeasonId] = useState(seasons[0]?.id ?? "")
  const [competitionId, setCompetitionId] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pending, setPending] = useState(false)

  if (!authority.canCreateEvent)
    return (
      <div className="mx-auto max-w-3xl">
        <Empty
          title="No podés crear jornadas"
          detail="Las jornadas las organiza la Subcomisión o el entrenador del equipo."
        />
      </div>
    )

  const candidates = state.events.filter((event) => {
    if (event.type !== "MATCH") return false
    const team = state.teams.find((item) => item.id === event.targetTeams[0])
    if (!team) return false
    if (seasonId && team.seasonId !== seasonId) return false
    return !state.jornadas.some((item) => item.events.includes(event.id))
  })

  return (
    <div className="gei-stack-page mx-auto max-w-3xl">
      <PageContextHeader
        context="Jornadas"
        title="Nueva jornada"
        back="/calendar"
        lead="Agrupá los partidos de una fecha operativa. Cada partido conserva su propio ciclo de vida."
      />
      <form
        noValidate
        className="grid gap-5"
        onSubmit={(event_) => {
          event_.preventDefault()
          const found: Record<string, string> = {}
          if (!seasonId) found.seasonId = "Elegí la temporada."
          if (selected.length === 0) found.events = "Elegí al menos un partido."
          setErrors(found)
          if (Object.keys(found).length > 0) {
            window.setTimeout(
              () =>
                document
                  .getElementById(`jn-${Object.keys(found)[0]}`)
                  ?.focus(),
              0,
            )
            return
          }
          setPending(true)
          const result = createJornada({
            name,
            seasonId,
            competitionId: competitionId || null,
            eventIds: selected,
          })
          setPending(false)
          if (result.ok && result.id) navigate(`/jornadas/${result.id}`)
          else
            setErrors({ form: result.error ?? "No pudimos crear la jornada." })
        }}
      >
        {errors.form && (
          <Banner tone="danger" title="No pudimos crear la jornada">
            <span className="text-ink-strong">{errors.form}</span>
          </Banner>
        )}

        <Surface className="grid gap-4">
          <TextField
            id="jn-name"
            label="Nombre de la jornada"
            value={name}
            hint="Si lo dejás vacío, usamos la temporada."
            onChange={(event_) => setName(event_.target.value)}
          />
          <Select
            id="jn-seasonId"
            label="Temporada"
            required
            value={seasonId}
            error={errors.seasonId}
            onChange={(event_) => {
              setSeasonId(event_.target.value)
              setSelected([])
            }}
          >
            {seasons.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
          <Select
            id="jn-competitionId"
            label="Competencia"
            value={competitionId}
            hint="Opcional: contexto deportivo de la jornada."
            onChange={(event_) => setCompetitionId(event_.target.value)}
          >
            <option value="">Sin competencia</option>
            {state.competitions
              .filter((item) => !item.archivedAt)
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </Select>
        </Surface>

        <Surface className="grid gap-3">
          <SectionHeader
            title="Partidos de la jornada"
            meta={`${selected.length} de ${candidates.length} disponibles`}
          />
          {errors.events && (
            <p className="text-meta font-medium text-danger">{errors.events}</p>
          )}
          {candidates.length === 0 ? (
            <p className="gei-meta">
              No hay partidos de esa temporada fuera de una jornada.
            </p>
          ) : (
            <ul className="grid">
              {candidates.map((event) => {
                const checked = selected.includes(event.id)
                return (
                  <li
                    key={event.id}
                    className="border-b border-line last:border-b-0"
                  >
                    <label className="flex min-h-14 cursor-pointer items-center gap-3 py-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(next) =>
                          setSelected((current) =>
                            next.target.checked
                              ? [...current, event.id]
                              : current.filter((id) => id !== event.id),
                          )
                        }
                        className="size-5 shrink-0 accent-interactive"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="gei-item-title block truncate">
                          {eventName(event)}
                        </span>
                        <span className="gei-meta block">
                          {dateLabel(event.date, true)} · {event.time}
                        </span>
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          )}
        </Surface>

        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="quiet" onClick={() => navigate("/calendar")}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" busy={pending}>
            Crear jornada
          </Button>
        </div>
      </form>
    </div>
  )
}
