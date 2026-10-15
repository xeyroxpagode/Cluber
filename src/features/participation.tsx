import { useMemo, useState } from "react"
import { useParams } from "react-router"
import {
  AlertCircle,
  CheckCircle2,
  Lock,
  Unlock,
} from "lucide-react"
import {
  StaleVersionError,
  useProduct,
} from "../mock/store"
import {
  eventAvailabilityView,
  eventName,
  dateLabel,
  teamName,
  type AttendanceValue,
} from "../mock/model"
import {
  activeTeamAssignments,
  CONFLICT_TEXT,
  conflictCodesFor,
  selectionConflicts,
} from "../mock/derive"
import {
  Banner,
  Button,
  ConfirmDialog,
  Empty,
  Expander,
  RadioGroup,
  RowLink,
  RowStatic,
  Sheet,
  StateBadge,
  Surface,
  TextArea,
  cx,
} from "../shared/ui"
import {
  DetailSection,
  HistoryList,
  PageContextHeader,
  SectionHeader,
} from "../shared/patterns"
import { VasControl } from "../shared/vas"

function useEvent(eventId: string | undefined) {
  const { state } = useProduct()
  const event = state.events.find((item) => item.id === eventId)
  return { event, state }
}

function Missing({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="mx-auto max-w-3xl">
      <Empty title={title} detail={detail} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   DISPONIBILIDAD
   Una sola gramática de ¿Vas? · estado derivado en texto
   ═══════════════════════════════════════════════════════════════ */

export function AvailabilityPage() {
  const { eventId } = useParams()
  const { event, state } = useEvent(eventId)
  const { actor, authority } = useProduct()

  if (!event) return <Missing title="Ese evento ya no está" detail="Revisá el enlace." />

  const roster = useMemo(() => {
    const teams = event.targetTeams
    const ids = new Set<string>()
    state.teamAssignments
      .filter((a) => teams.includes(a.teamId) && !a.validUntil)
      .forEach((a) => ids.add(a.personId))
    event.targetPersonIds.forEach((id) => ids.add(id))
    return Array.from(ids)
      .map((id) => state.people.find((person) => person.id === id))
      .filter((person): person is NonNullable<typeof person> => !!person)
      .sort((a, b) => a.lastName.localeCompare(b.lastName))
  }, [event, state])

  const buckets = roster.reduce(
    (accumulator, person) => {
      const view = eventAvailabilityView(event, person.id)
      accumulator[view] = (accumulator[view] ?? 0) + 1
      return accumulator
    },
    {} as Record<string, number>,
  )

  return (
    <div className="gei-stack-page mx-auto max-w-4xl">
      <PageContextHeader
        context="Disponibilidad"
        title={eventName(event)}
        back={`/events/${event.id}`}
        lead={`${roster.length} ${roster.length === 1 ? "persona" : "personas"} del ${
          event.clubWide
            ? "todo el hockey"
            : event.targetTeams.map((id) => teamName(state, id)).join(" + ")
        }`}
      />

      {event.state === "POSTPONED" && (
        <Banner tone="warning" title="Este evento está postergado">
          <span className="text-ink-strong">
            No hay horario vigente, así que no se pueden cargar respuestas nuevas.
            Las respuestas anteriores quedan guardadas como referencia.
          </span>
        </Banner>
      )}

      <Surface>
        <VasControl event={event} personId={actor.id} />
      </Surface>

      <Surface className="grid gap-3">
        <SectionHeader title="Resumen" />
        <ul className="grid gap-1">
          {[
            { key: "YES", label: "Voy" },
            { key: "MAYBE", label: "Tal vez" },
            { key: "NO", label: "No voy" },
            { key: "NEEDS_RECONFIRMATION", label: "Hay que volver a confirmar" },
            { key: "NO_RESPONSE", label: "Sin responder" },
          ].map((bucket) => (
            <RowStatic
              key={bucket.key}
              title={bucket.label}
              leading={
                <StateBadge
                  value={bucket.key}
                  tone={
                    bucket.key === "NEEDS_RECONFIRMATION" ? "attention" : undefined
                  }
                />
              }
              trailing={
                <span className="gei-body-strong tabular-nums">
                  {buckets[bucket.key] ?? 0}
                </span>
              }
            />
          ))}
        </ul>
      </Surface>

      <DetailSection title="Respuestas">
        <ul className="grid">
          {roster.map((person) => {
            const view = eventAvailabilityView(event, person.id)
            const mine = person.id === actor.id
            return (
              <li
                key={person.id}
                className="flex min-h-11 flex-wrap items-center gap-3 border-b border-line py-2.5 last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="gei-item-title truncate">
                    {person.name}
                    {mine && (
                      <span className="ml-2 text-meta font-normal text-ink-muted">
                        (vos)
                      </span>
                    )}
                  </p>
                </div>
                <StateBadge
                  value={view}
                  tone={view === "NEEDS_RECONFIRMATION" ? "attention" : undefined}
                />
              </li>
            )
          })}
        </ul>
      </DetailSection>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CONVOCATORIA — escaneable, una sola CTA fuerte, revisiones aparte
   ═══════════════════════════════════════════════════════════════ */

export function SelectionPage() {
  const { eventId } = useParams()
  const { event, state } = useEvent(eventId)
  const { authority, publishSelection, toast } = useProduct()
  const [draft, setDraft] = useState<string[] | null>(null)
  const [dirty, setDirty] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [conflictMessage, setConflictMessage] = useState("")
  const [revisionsOpen, setRevisionsOpen] = useState(false)

  if (!event) return <Missing title="Ese evento ya no está" detail="Revisá el enlace." />
  if (!authority.canManageSelection(event))
    return (
      <Missing
        title="No administrás la convocatoria de este evento"
        detail="La convocatoria es del entrenador del equipo o de la Subcomisión."
      />
    )

  const published = event.published ?? null
  const working = draft ?? published ?? []
  const setWorking = (next: string[] | ((current: string[]) => string[])) =>
    setDraft(
      typeof next === "function"
        ? (next as (current: string[]) => string[])(working)
        : next,
    )
  const eventVersion = event.version
  const eventKey = event.id
  const conflicts = selectionConflicts(state, event)
  const roster = useMemo(() => {
    const ids = new Set<string>()
    state.teamAssignments
      .filter((a) => event.targetTeams.includes(a.teamId) && !a.validUntil)
      .forEach((a) => ids.add(a.personId))
    return Array.from(ids)
      .map((id) => state.people.find((person) => person.id === id))
      .filter((person): person is NonNullable<typeof person> => !!person)
      .sort((a, b) => a.lastName.localeCompare(b.lastName))
  }, [event, state])

  const toggle = (personId: string) => {
    setWorking(
      working.includes(personId)
        ? working.filter((id) => id !== personId)
        : [...working, personId],
    )
    setDirty(true)
  }

  const added = working.filter((id) => !(published ?? []).includes(id))
  const removed = (published ?? []).filter((id) => !working.includes(id))

  async function publish() {
    setPublishing(true)
    setConflictMessage("")
    try {
      await publishSelection(eventKey, working, eventVersion)
      setDraft(null)
      setDirty(false)
      setConfirm(false)
      toast("Convocatoria publicada.")
    } catch (error) {
      if (error instanceof StaleVersionError)
        setConflictMessage(
          "Alguien tocó la convocatoria mientras la editabas. Tu borrador sigue acá: revisá y publicá de nuevo.",
        )
      else setConflictMessage("No pudimos publicar. Volvé a intentar.")
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="gei-stack-page mx-auto max-w-4xl">
      <PageContextHeader
        context="Convocatoria"
        title={eventName(event)}
        back={`/events/${event.id}`}
        lead={`${dateLabel(event.date, true)} · ${
          working.length
        } ${working.length === 1 ? "convocada" : "convocadas"}`}
        action={
          <StateBadge
            value={published === null ? "DRAFT" : "PUBLISHED"}
            emphasis
          />
        }
      />

      {conflictMessage && (
        <Banner tone="attention" title="La convocatoria cambió mientras editabas">
          <span className="text-ink-strong">{conflictMessage}</span>
        </Banner>
      )}

      {conflicts.length > 0 && (
        <Banner
          tone="attention"
          title={`${conflicts.length} ${
            conflicts.length === 1 ? "convocada tiene" : "convocadas tienen"
          } un problema a revisar`}
        >
          <span className="text-ink-strong">
            Podés publicar igual: la convocatoria no se bloquea. Avisale a la
            persona para que no venga en falso.
          </span>
        </Banner>
      )}

      <Surface className="grid gap-3">
        <SectionHeader
          title="Convocadas"
          meta={`${working.length} de ${roster.length}`}
          aside={
            dirty ? (
              <span className="text-meta font-medium text-attention">
                Borrador sin publicar
              </span>
            ) : undefined
          }
        />
        <ul className="grid pb-2">
          {roster.map((person) => {
            const selected = working.includes(person.id)
            const codes = published ? conflictCodesFor(state, event, person.id) : []
            return (
              <li
                key={person.id}
                className="border-b border-line last:border-b-0"
              >
                <div className="flex min-h-11 items-center gap-3 py-2.5">
                  <input
                    type="checkbox"
                    id={`sel-${person.id}`}
                    checked={selected}
                    onChange={() => toggle(person.id)}
                    className="size-5 shrink-0 accent-interactive"
                  />
                  <label
                    htmlFor={`sel-${person.id}`}
                    className="min-w-0 flex-1 cursor-pointer"
                  >
                    <span className="gei-item-title block truncate">{person.name}</span>
                    <span className="gei-meta block">
                      {eventAvailabilityView(event, person.id) === "YES"
                        ? "Dijo que va"
                        : eventAvailabilityView(event, person.id) === "NO"
                          ? "Dijo que no va"
                          : eventAvailabilityView(event, person.id) ===
                              "NEEDS_RECONFIRMATION"
                            ? "Confirmó con el horario anterior"
                            : "Sin responder"}
                    </span>
                  </label>
                </div>
                {selected && codes.length > 0 && (
                  <div className="pb-3 pl-8">
                    <ul className="grid gap-1">
                      {codes.map((code) => (
                        <li
                          key={code}
                          className="flex items-start gap-1.5 text-meta text-attention"
                        >
                          <AlertCircle size={13} aria-hidden className="mt-0.5 shrink-0" />
                          {CONFLICT_TEXT[code]}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </Surface>

      <Surface className="grid gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="gei-section-title">Revisiones publicadas</h2>
          <button
            type="button"
            onClick={() => setRevisionsOpen((value) => !value)}
            aria-expanded={revisionsOpen}
            className="gei-target-sm rounded-control px-2 text-meta font-semibold text-interactive hover:bg-selected-soft"
          >
            {revisionsOpen ? "Ocultar" : `Ver ${event.selectionRevisions.length}`}
          </button>
        </div>
        {revisionsOpen &&
          (event.selectionRevisions.length === 0 ? (
            <p className="gei-meta">Todavía no se publicó ninguna convocatoria.</p>
          ) : (
            <HistoryList
              entries={event.selectionRevisions.map((revision) => ({
                action: `Convocatoria de ${revision.players.length} personas`,
                actor: revision.author,
                at: new Date(revision.at).toLocaleString("es-AR"),
                before:
                  revision.removed.length > 0
                    ? `${revision.removed.length} fuera`
                    : null,
                after:
                  revision.added.length > 0 ? `${revision.added.length} adentro` : null,
              }))}
            />
          ))}
      </Surface>

      <div className="sticky bottom-16 z-20 -mx-4 flex flex-wrap items-center justify-between gap-2 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur-sm lg:bottom-0 lg:mx-0 lg:rounded-surface lg:border">
        <p className="gei-meta">
          {added.length > 0 && `${added.length} sumadas`}
          {added.length > 0 && removed.length > 0 && " · "}
          {removed.length > 0 && `${removed.length} fuera`}
          {added.length === 0 && removed.length === 0 &&
            (published === null ? "Sin publicar" : "Sin cambios")}
        </p>
        <div className="flex gap-2">
          {dirty && (
            <Button
              variant="quiet"
              onClick={() => {
                setDraft(null)
                setDirty(false)
              }}
            >
              Descartar
            </Button>
          )}
          <Button
            variant={dirty ? "primary" : "secondary"}
            disabled={!dirty}
            busy={publishing}
            onClick={() => setConfirm(true)}
          >
            {published === null ? "Publicar convocatoria" : "Publicar cambios"}
          </Button>
        </div>
      </div>

      {confirm && (
        <ConfirmDialog
          title={published === null ? "Publicar convocatoria" : "Publicar cambios"}
          consequence={
            <>
              Las {working.length} personas convocadas van a recibir un aviso. La
              revisión anterior queda guardada y no se reescribe.
            </>
          }
          confirmLabel="Publicar"
          pending={publishing}
          pendingLabel="Publicando"
          onClose={() => setConfirm(false)}
          onConfirm={() => void publish()}
          tone="attention"
          extra={
            added.length > 0 || removed.length > 0 ? (
              <div className="rounded-surface border border-line bg-control p-3">
                <p className="text-meta font-semibold uppercase tracking-wide text-ink-muted">
                  Cambios
                </p>
                <ul className="mt-1.5 grid gap-1">
                  {added.map((id) => (
                    <li key={id} className="gei-body text-ink-strong">
                      Entra {state.people.find((person) => person.id === id)?.name}
                    </li>
                  ))}
                  {removed.map((id) => (
                    <li key={id} className="gei-body text-ink-strong">
                      Sale {state.people.find((person) => person.id === id)?.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : undefined
          }
        />
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ASISTENCIA — uso repetitivo, filas de 44 px, un toque
   ═══════════════════════════════════════════════════════════════ */

const ATTENDANCE_OPTIONS: Array<{
  value: AttendanceValue
  label: string
  tone: "success" | "danger" | "warning"
}> = [
  { value: "PRESENT", label: "Presente", tone: "success" },
  { value: "ABSENT", label: "Ausente", tone: "danger" },
  { value: "JUSTIFIED", label: "Justificada", tone: "warning" },
]

export function AttendancePage() {
  const { eventId } = useParams()
  const { event, state } = useEvent(eventId)
  const {
    authority,
    markAttendance,
    openAttendance,
    closeAttendance,
  } = useProduct()
  const [correction, setCorrection] = useState<{
    personId: string
    value: AttendanceValue
  } | null>(null)
  const [closing, setClosing] = useState(false)
  const [closeReason, setCloseReason] = useState("")
  const [historyOpen, setHistoryOpen] = useState(false)

  if (!event) return <Missing title="Ese evento ya no está" detail="Revisá el enlace." />
  if (!authority.canManageAttendance(event))
    return (
      <Missing
        title="No tomás la asistencia de este evento"
        detail="La asistencia la toma el entrenador del equipo."
      />
    )

  const roster = useMemo(() => {
    const ids = new Set<string>()
    state.teamAssignments
      .filter((a) => event.targetTeams.includes(a.teamId) && !a.validUntil)
      .forEach((a) => ids.add(a.personId))
    event.targetPersonIds.forEach((id) => ids.add(id))
    return Array.from(ids)
      .map((id) => state.people.find((person) => person.id === id))
      .filter((person): person is NonNullable<typeof person> => !!person)
      .sort((a, b) => a.lastName.localeCompare(b.lastName))
  }, [event, state])

  const closed = !!event.attendanceClosedAt
  const unrecorded = roster.filter((person) => !event.attendance[person.id])
  const counts = {
    present: roster.filter((person) => event.attendance[person.id] === "PRESENT")
      .length,
    absent: roster.filter((person) => event.attendance[person.id] === "ABSENT")
      .length,
    justified: roster.filter(
      (person) => event.attendance[person.id] === "JUSTIFIED",
    ).length,
    unrecorded: unrecorded.length,
  }

  return (
    <div className="gei-stack-page mx-auto max-w-4xl">
      <PageContextHeader
        context="Asistencia"
        title={eventName(event)}
        back={`/events/${event.id}`}
        lead={`${dateLabel(event.date, true)} · ${
          closed ? "cerrada" : "abierta"
        }`}
        action={
          <div className="flex items-center gap-2">
            <StateBadge value={closed ? "CLOSED" : "OPEN"} emphasis />
          </div>
        }
      />

      {closed && unrecorded.length > 0 && (
        <Banner tone="attention" title={`${unrecorded.length} quedaron sin registrar`}>
          <span className="text-ink-strong">
            Cerrar la planilla no significa que estuvieran ausentes. Esas personas
            siguen sin registro y podés anotarlas con un motivo.
          </span>
        </Banner>
      )}

      {!event.attendanceOpened && (
        <Banner tone="attention" title="La planilla todavía no está abierta">
          <span className="text-ink-strong">
            Abrila recién cuando estés tomando la asistencia. Nadie ve datos antes
            de eso.
          </span>
        </Banner>
      )}

      {/* Conteos arriba, fijos y con texto */}
      <Surface className="grid gap-3">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ATTENDANCE_OPTIONS.map((option) => (
            <div
              key={option.value}
              className="rounded-control border border-line bg-control px-3 py-2.5"
            >
              <p className="text-meta uppercase tracking-wide text-ink-muted">
                {option.label}
              </p>
              <p className="gei-l4 tabular-nums">
                {option.value === "PRESENT"
                  ? counts.present
                  : option.value === "ABSENT"
                    ? counts.absent
                    : counts.justified}
              </p>
            </div>
          ))}
          <div className="rounded-control border border-line bg-surface px-3 py-2.5">
            <p className="text-meta uppercase tracking-wide text-ink-muted">
              Sin registrar
            </p>
            <p className="gei-l4 tabular-nums">{counts.unrecorded}</p>
          </div>
        </div>
      </Surface>

      <Surface flush className="overflow-visible">
        <ul className="grid">
          {roster.map((person) => {
            const value = event.attendance[person.id]
            return (
              <li
                key={person.id}
                className="border-b border-line last:border-b-0"
              >
                <div className="flex min-h-14 flex-wrap items-center gap-2 px-3 py-2">
                  <div className="min-w-40 flex-1">
                    <p className="gei-item-title truncate">{person.name}</p>
                    <p className="gei-meta">
                      {value
                        ? value === "PRESENT"
                          ? "Presente"
                          : value === "ABSENT"
                            ? "Ausente"
                            : "Justificada"
                        : "Sin registrar — no es lo mismo que ausente"}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {ATTENDANCE_OPTIONS.map((option) => {
                      const active = value === option.value
                      return (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={active}
                          onClick={() => {
                            if (value) setCorrection({ personId: person.id, value: option.value })
                            else markAttendance(event.id, person.id, option.value)
                          }}
                          className={cx(
                            "min-h-11 rounded-control border px-3 text-meta font-semibold transition-colors duration-micro",
                            active
                              ? option.tone === "success"
                                ? "border-success bg-success text-white"
                                : option.tone === "danger"
                                  ? "border-danger bg-danger text-white"
                                  : "border-warning bg-warning text-white"
                              : "border-line-strong bg-surface text-ink-muted hover:border-ink-faint hover:text-ink",
                          )}
                        >
                          {option.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </Surface>

      <Surface className="grid gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="gei-section-title">Correcciones</h2>
          <button
            type="button"
            onClick={() => setHistoryOpen((value) => !value)}
            aria-expanded={historyOpen}
            className="gei-target-sm rounded-control px-2 text-meta font-semibold text-interactive hover:bg-selected-soft"
          >
            {historyOpen ? "Ocultar" : `Ver ${event.attendanceHistory.length}`}
          </button>
        </div>
        {historyOpen ? (
          <HistoryList
            entries={event.attendanceHistory.map((entry) => ({
              action: `${state.people.find((person) => person.id === entry.personId)?.name ?? ""}: ${
                entry.before ?? "sin registrar"
              } → ${entry.after}`,
              actor: entry.actor,
              at: new Date(entry.at).toLocaleString("es-AR"),
              reason: entry.reason ?? null,
            }))}
            emptyText="Todavía no hubo correcciones."
          />
        ) : (
          <p className="gei-meta">
            Cada corrección pide un motivo y queda con nombre, fecha y valor
            anterior.
          </p>
        )}
      </Surface>

      <div className="flex flex-wrap gap-2">
        {!event.attendanceOpened ? (
          <Button variant="primary" onClick={() => void openAttendance(event.id)}>
            Abrir asistencia
          </Button>
        ) : !closed ? (
          <Button variant="danger" onClick={() => setClosing(true)}>
            <Lock size={16} aria-hidden />
            Cerrar asistencia
          </Button>
        ) : (
          <Banner tone="success" title="La planilla está cerrada">
            <span className="text-ink-strong">
              Podés seguir anotando correcciones con motivo. No se pierde nada.
            </span>
          </Banner>
        )}
      </div>

      {closing && (
        <ConfirmDialog
          title="Cerrar la asistencia"
          consequence={
            unrecorded.length > 0 ? (
              <>
                Quedan {unrecorded.length} personas sin registrar. No se van a
                marcar como ausentes: van a quedar explícitamente sin registro.
              </>
            ) : (
              "Después de cerrar, cada cambio necesita un motivo y queda registrado."
            )
          }
          confirmLabel="Cerrar asistencia"
          requireReason
          pendingLabel="Cerrando"
          onClose={() => setClosing(false)}
          onConfirm={(reason) => {
            void closeAttendance(event.id, reason)
            setClosing(false)
          }}
          extra={
            <TextArea
              label="Motivo del cierre"
              rows={2}
              value={closeReason}
              onChange={(event) => setCloseReason(event.target.value)}
              hint="Queda en el historial de la planilla."
            />
          }
        />
      )}

      {correction && (
        <CorrectionDialog
          personName={
            state.people.find((person) => person.id === correction.personId)?.name ??
            ""
          }
          previous={
            event.attendance[correction.personId as string] ?? null
          }
          next={correction.value}
          onClose={() => setCorrection(null)}
          onConfirm={(reason) => {
            markAttendance(
              event.id,
              correction.personId,
              correction.value,
              reason,
            )
            setCorrection(null)
          }}
        />
      )}
    </div>
  )
}

function CorrectionDialog({
  personName,
  previous,
  next,
  onClose,
  onConfirm,
}: {
  personName: string
  previous: AttendanceValue | null
  next: AttendanceValue
  onClose: () => void
  onConfirm: (reason: string) => void
}) {
  const label = (value: AttendanceValue | null) =>
    value === "PRESENT"
      ? "Presente"
      : value === "ABSENT"
        ? "Ausente"
        : value === "JUSTIFIED"
          ? "Justificada"
          : "Sin registrar"
  return (
    <ConfirmDialog
      title={`Cambiar la asistencia de ${personName}`}
      consequence={`${label(previous)} → ${label(next)}. Se guarda el valor anterior.`}
      confirmLabel="Guardar corrección"
      requireReason
      reasonLabel="Por qué cambiás el valor"
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
}

/* ═══════════════════════════════════════════════════════════════
   RESULTADO — editable sólo cuando el lifecycle lo permite
   ═══════════════════════════════════════════════════════════════ */

export function MatchRecordPage() {
  const { eventId } = useParams()
  const { event, state } = useEvent(eventId)
  const { authority, finalizeRecord, correctRecord, transitionEvent } =
    useProduct()
  const [form, setForm] = useState({
    gei: event?.record.gei ?? 0,
    opponent: event?.record.opponent ?? 0,
    observations: event?.record.observations ?? "",
    status: event?.record.status ?? "PLAYED",
  })
  const [editing, setEditing] = useState(false)
  const [finalizing, setFinalizing] = useState(false)
  const [correcting, setCorrecting] = useState(false)
  const [error, setError] = useState("")
  const [historyOpen, setHistoryOpen] = useState(false)

  if (!event)
    return <Missing title="Ese partido ya no está" detail="Revisá el enlace." />
  if (event.type !== "MATCH")
    return (
      <Missing
        title="Este evento no tiene resultado"
        detail="Sólo los partidos tienen acta de resultado."
      />
    )
  if (!authority.canManageRecord(event))
    return (
      <Missing
        title="No cargás el resultado de este partido"
        detail="El acta la completa el entrenador del equipo."
      />
    )

  const canEdit = event.state === "IN_PROGRESS"
  const isFinal = event.record.state === "FINAL"

  return (
    <div className="gei-stack-page mx-auto max-w-3xl">
      <PageContextHeader
        context="Resultado"
        title={eventName(event)}
        back={`/events/${event.id}`}
        lead={dateLabel(event.date, true)}
        action={<StateBadge value={isFinal ? "FINAL" : "DRAFT"} emphasis />}
      />

      {!isFinal && (
        <Banner tone="neutral" title="Esto es un borrador, no un resultado">
          <span className="text-ink-strong">
            Mientras no lo finalices no cuenta como resultado oficial ni aparece
            en los informes.
          </span>
        </Banner>
      )}

      {isFinal && (
        <Banner tone="success" title="Resultado oficial">
          <span className="text-ink-strong">
            {dateLabel(event.date, true)} · cargado por el club. Corregirlo pide
            un motivo y queda registrado.
          </span>
        </Banner>
      )}

      {error && (
        <Banner tone="danger" title="No pudimos guardar el acta">
          <span className="text-ink-strong">{error}</span>
        </Banner>
      )}

      <Surface className="grid gap-4">
        <p className="gei-l5 tabular-nums">
          {form.gei}–{form.opponent}
        </p>
        <RadioGroup
          legend="Situación del partido"
          name="record-status"
          columns={3}
          value={form.status}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              status: value,
              opponent: value === "FORFEIT" ? 3 : current.opponent,
            }))
          }
          options={[
            { value: "PLAYED", label: "Jugado" },
            { value: "FORFEIT", label: "No presentación" },
            { value: "ABANDONED", label: "Suspendido" },
          ]}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-body font-semibold">Goles GEI</span>
            <input
              type="number"
              min={0}
              max={99}
              value={form.gei}
              disabled={!editing}
              onChange={(next) =>
                setForm((current) => ({ ...current, gei: Number(next.target.value) }))
              }
              className="gei-target rounded-control border border-line-strong bg-surface px-3 text-body tabular-nums disabled:bg-control"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-body font-semibold">Goles del rival</span>
            <input
              type="number"
              min={0}
              max={99}
              value={form.opponent}
              disabled={!editing}
              onChange={(next) =>
                setForm((current) => ({
                  ...current,
                  opponent: Number(next.target.value),
                }))
              }
              className="gei-target rounded-control border border-line-strong bg-surface px-3 text-body tabular-nums disabled:bg-control"
            />
          </label>
        </div>
        <label className="grid gap-1.5">
          <span className="text-body font-semibold">Cómo se vio</span>
          <textarea
            rows={3}
            value={form.observations}
            disabled={!editing}
            onChange={(next) =>
              setForm((current) => ({ ...current, observations: next.target.value }))
            }
            className="resize-y rounded-control border border-line-strong bg-surface px-3 py-2.5 text-body disabled:bg-control"
          />
        </label>

        {!isFinal && !editing && (
          <Banner tone="attention" title="El partido todavía no terminó">
            <span className="text-ink-strong">
              El acta se habilita cuando el partido pasa a “En curso”. Si el
              partido ya se jugó, marcá el evento como terminado.
            </span>
          </Banner>
        )}

        <div className="flex flex-wrap gap-2">
          {canEdit && !isFinal && !editing && (
            <Button variant="secondary" onClick={() => setEditing(true)}>
              Cargar el resultado
            </Button>
          )}
          {canEdit && !isFinal && editing && (
            <>
              <Button
                variant="primary"
                onClick={() => setFinalizing(true)}
                disabled={form.gei === event.record.gei && form.opponent === event.record.opponent && !form.observations.trim()}
              >
                Finalizar resultado
              </Button>
              <Button variant="quiet" onClick={() => setEditing(false)}>
                Cancelar
              </Button>
            </>
          )}
          {isFinal && (
            <Button variant="danger" onClick={() => setCorrecting(true)}>
              Corregir el resultado
            </Button>
          )}
        </div>
      </Surface>

      <Surface className="grid gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="gei-section-title">Historial del acta</h2>
          <button
            type="button"
            onClick={() => setHistoryOpen((value) => !value)}
            aria-expanded={historyOpen}
            className="gei-target-sm rounded-control px-2 text-meta font-semibold text-interactive hover:bg-selected-soft"
          >
            {historyOpen ? "Ocultar" : `Ver ${event.recordHistory.length}`}
          </button>
        </div>
        {historyOpen ? (
          <HistoryList
            entries={event.recordHistory.map((entry) => ({
              action: "Resultado",
              actor: entry.actor,
              at: new Date(entry.at).toLocaleString("es-AR"),
              before: entry.before,
              after: entry.after,
              reason: entry.reason,
            }))}
            emptyText="El acta nunca se corrigió."
          />
        ) : (
          <p className="gei-meta">
            Cada corrección guarda el marcador anterior, el motivo, quién lo hizo y
            cuándo.
          </p>
        )}
      </Surface>

      {finalizing && (
        <ConfirmDialog
          title="Finalizar el resultado"
          consequence="Después de finalizar, el acta no se edita más: cualquier cambio pasa por una corrección con motivo."
          confirmLabel="Finalizar resultado"
          tone="attention"
          pendingLabel="Finalizando"
          onClose={() => setFinalizing(false)}
          onConfirm={async () => {
            try {
              await finalizeRecord(event.id, { ...event.record, ...form }, "Cierre del acta")
              setFinalizing(false)
              setEditing(false)
            } catch {
              setError("No pudimos finalizar. Volvé a intentar.")
              setFinalizing(false)
            }
          }}
        />
      )}

      {correcting && (
        <CorrectionRecordDialog
          before={`${event.record.gei}-${event.record.opponent}`}
          next={`${form.gei}-${form.opponent}`}
          onClose={() => setCorrecting(false)}
          onConfirm={(reason) => {
            correctRecord(event.id, { ...event.record, ...form }, reason)
            setCorrecting(false)
          }}
        />
      )}

      {event.state === "SCHEDULED" && authority.canEditEvent(event) && (
        <Surface className="grid gap-2">
          <p className="gei-body-strong">Este partido todavía no empezó</p>
          <p className="gei-meta">
            Pasalo a “En curso” cuando empiece para poder cargar el resultado.
          </p>
          <Button
            variant="secondary"
            onClick={() =>
              void transitionEvent(event.id, "IN_PROGRESS", "Inicio del partido")
            }
          >
            <Unlock size={16} aria-hidden />
            Marcar como en curso
          </Button>
        </Surface>
      )}

      {event.state === "SCHEDULED" && (
        <p className="gei-meta flex items-center gap-1.5">
          <CheckCircle2 size={14} aria-hidden />
          {event.record.state === "DRAFT"
            ? "Todavía no hay resultado oficial."
            : ""}
        </p>
      )}
    </div>
  )
}

function CorrectionRecordDialog({
  before,
  next,
  onClose,
  onConfirm,
}: {
  before: string
  next: string
  onClose: () => void
  onConfirm: (reason: string) => void
}) {
  return (
    <ConfirmDialog
      title="Corregir el resultado"
      consequence={`${before} → ${next}. El resultado anterior queda guardado con el motivo. Esta corrección queda a la vista.`}
      confirmLabel="Guardar corrección"
      requireReason
      reasonLabel="Por qué corregís el resultado"
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
}