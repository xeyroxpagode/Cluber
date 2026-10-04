import { useMemo, useState } from "react"
import { Link, useParams } from "react-router"
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flag,
  MapPin,
  Search as SearchIcon,
  Dumbbell,
} from "lucide-react"
import { useProduct } from "../mock/store"
import {
  addDays,
  todayIso,
} from "../mock/clock"
import {
  activeRoleAssignments,
  activeTeamAssignments,
  eventsInScopeOfPerson,
  guardiansOf,
  profileCompleteness,
  roleScopeLabel,
  selectionConflicts,
  visibleEvents,
  CONFLICT_TEXT,
  conflictCodesFor,
} from "../mock/derive"
import {
  dateLabel,
  dateTimeLabel,
  eventAvailabilityView,
  eventName,
  eventTargetsText,
  teamName,
  type Event,
} from "../mock/model"
import {
  Avatar,
  Button,
  Empty,
  FilterChip,
  RowLink,
  RowStatic,
  SegmentedControl,
  Select,
  StateBadge,
  Surface,
  Tag,
  TextLink,
  cx,
} from "../shared/ui"
import { PageContextHeader, DetailSection } from "../shared/patterns"
import { VasControl, VasCompact } from "../shared/vas"
import { useQueryState } from "../shared/use-query-state"

/* ═══════════════════════════════════════════════════════════════
   HOME
   SITUACIÓN → ACCIÓN → INFORMACIÓN. Máximo 3 ítems de atención.
   ═══════════════════════════════════════════════════════════════ */

interface AttentionItem {
  id: string
  reason: string
  consequence: string
  action: { label: string; to: string }
  urgency: "now" | "soon" | "later"
}

function buildAttention(): AttentionItem[] {
  const { state, actor, authority, childId } = useProduct()
  const today = todayIso()
  const subject = childId ?? actor.id
  const scoped = visibleEvents(state, actor.id, childId).filter(
    (event) => event.state !== "CANCELLED" && event.state !== "COMPLETED",
  )
  const items: AttentionItem[] = []

  if (authority.canManagePeople) {
    const incomplete = state.people.filter(
      (person) => !profileCompleteness(person).complete,
    )
    if (incomplete.length > 0)
      items.push({
        id: "profile-incomplete",
        reason: `${incomplete.length} ${
          incomplete.length === 1 ? "persona tiene" : "personas tienen"
        } el perfil incompleto.`,
        consequence:
          "No se pueden asignar a un equipo con la información incompleta.",
        action: {
          label: "Ver esas personas",
          to: "/management/people?profileStatus=incomplete",
        },
        urgency: "now",
      })
    const noMembership = state.people.filter(
      (person) =>
        person.account === "ACTIVE" &&
        !state.memberships.some(
          (item) => item.personId === person.id && !item.validUntil,
        ),
    )
    if (noMembership.length > 0)
      items.push({
        id: "no-membership",
        reason: `${noMembership.length} ${
          noMembership.length === 1 ? "cuenta activa sin" : "cuentas activas sin"
        } pertenencia vigente.`,
        consequence: "Sin pertenencia no pueden entrar a la temporada.",
        action: { label: "Abrir personas", to: "/management/people" },
        urgency: "now",
      })
    const pending = state.people.filter((person) => person.account === "PENDING")
    if (pending.length > 0)
      items.push({
        id: "pending-accounts",
        reason: `${pending.length} ${
          pending.length === 1 ? "cuenta espera" : "cuentas esperan"
        } activación.`,
        consequence: "Hasta que activen la cuenta no pueden entrar al sistema.",
        action: { label: "Emitir códigos", to: "/management/people?account=PENDING" },
        urgency: "soon",
      })
  }

  if (authority.canManageEligibility) {
    const blocked = state.eligibilityConstraints.filter(
      (constraint) => constraint.state === "BLOCKED" && !constraint.validUntil,
    )
    if (blocked.length > 0)
      items.push({
        id: "blocked",
        reason: `${blocked.length} ${
          blocked.length === 1 ? "restricción vigente" : "restricciones vigentes"
        } sin resolver.`,
        consequence:
          "Las personas afectadas no pueden jugar hasta que se levante el bloqueo.",
        action: { label: "Revisar elegibilidad", to: "/management/people" },
        urgency: "now",
      })
  }

  // Reconfirmación pendiente de quien mira (sólo si puede responder).
  const canRespond =
    authority.canRespondOwn ||
    (childId !== null && authority.canRespondForChild(childId))
  const subjectEvents = canRespond
    ? scoped.filter((event) => event.state === "SCHEDULED")
    : []
  const stale = subjectEvents.filter(
    (event) => eventAvailabilityView(event, subject) === "NEEDS_RECONFIRMATION",
  )
  if (stale.length > 0)
    items.push({
      id: "reconfirm",
      reason:
        stale.length === 1
          ? "Cambió el horario de un evento al que respondiste."
          : `Cambió el horario de ${stale.length} eventos a los que respondiste.`,
      consequence: "Tu respuesta anterior ya no cuenta hasta que confirmes de nuevo.",
      action: {
        label: "Volver a confirmar",
        to: `/events/${stale[0].id}`,
      },
      urgency: "now",
    })

  const unanswered = subjectEvents.filter(
    (event) => eventAvailabilityView(event, subject) === "NO_RESPONSE" && event.date >= today,
  )
  if (unanswered.length > 0)
    items.push({
      id: "unanswered",
      reason:
        unanswered.length === 1
          ? "Hay un evento próximo sin tu respuesta."
          : `Hay ${unanswered.length} eventos próximos sin tu respuesta.`,
      consequence: "La entrenadora necesita saber quién viene.",
      action: { label: "Responder", to: `/events/${unanswered[0].id}` },
      urgency: "soon",
    })

  // Sólo para quien convoca: conflictos derivados en la convocatoria publicada.
  if (authority.coachTeamIds.length > 0) {
    const conflictEvents = scoped.filter((event) => {
      if (event.type !== "MATCH" || !event.published) return false
      if (!authority.isCoachOfTeam(event.targetTeams[0] ?? "")) return false
      return selectionConflicts(state, event).length > 0
    })
    if (conflictEvents.length > 0) {
      const event = conflictEvents[0]
      items.push({
        id: "selection-conflict",
        reason:
          conflictEvents.length === 1
            ? "Hay 1 convocatoria con una persona que no puede jugar."
            : `Hay ${conflictEvents.length} convocatorias con gente que no puede jugar.`,
        consequence:
          "La convocatoria publicada sigue en pie, pero conviene revisarla antes del partido.",
        action: {
          label: "Revisar convocatoria",
          to: `/events/${event.id}/selection`,
        },
        urgency: "now",
      })
    }
  }

  const order: Record<AttentionItem["urgency"], number> = {
    now: 0,
    soon: 1,
    later: 2,
  }
  return items.sort((a, b) => order[a.urgency] - order[b.urgency]).slice(0, 3)
}

function AttentionSection() {
  const items = buildAttention()
  if (items.length === 0)
    return (
      <section className="grid gap-3">
        <h2 className="gei-section-title">Necesita tu atención</h2>
        <div className="flex flex-wrap items-center gap-3 rounded-surface border border-success-line bg-success-soft px-4 py-3.5">
          <CheckCircle2 size={19} aria-hidden className="text-success" />
          <div>
            <p className="gei-body-strong text-success">No hay nada pendiente</p>
            <p className="gei-meta text-ink-strong">
              Todo lo que dependía de vos está resuelto.
            </p>
          </div>
        </div>
      </section>
    )

  return (
    <section className="grid gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="gei-section-title">Necesita tu atención</h2>
        <p className="gei-meta">{items.length} {items.length === 1 ? "cosa" : "cosas"}</p>
      </div>
      <ul className="grid gap-3">
        {items.map((item, index) => (
          <li
            key={item.id}
            className={cx(
              "grid gap-3 rounded-surface border p-4",
              item.urgency === "now"
                ? "border-attention-line bg-attention-soft"
                : "border-line bg-surface",
            )}
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className={cx(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-pill text-micro font-bold",
                  item.urgency === "now"
                    ? "bg-attention text-white"
                    : "bg-neutral-soft text-ink-muted",
                )}
              >
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="gei-body-strong text-ink">{item.reason}</p>
                <p className="gei-body mt-0.5 text-ink-strong">{item.consequence}</p>
              </div>
            </div>
            <div className="pl-8">
              <Link
                to={item.action.to}
                className={cx(
                  "gei-target inline-flex items-center gap-1.5 rounded-control px-3.5 py-2 text-meta font-semibold transition-colors",
                  index === 0
                    ? "bg-interactive text-white hover:bg-interactive-hover"
                    : "border border-line-strong bg-surface text-ink hover:border-ink-faint",
                )}
              >
                {item.action.label}
                <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function EventLine({ event, showDate = true }: { event: Event; showDate?: boolean }) {
  const { state } = useProduct()
  const terminal = ["CANCELLED", "COMPLETED", "ABANDONED", "POSTPONED"].includes(
    event.state,
  )
  return (
    <RowLink
      to={`/events/${event.id}`}
      title={eventName(event)}
      detail={
        <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span>{eventTargetsText(state, event)}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={11} aria-hidden />
            {venueName(state, event)}
          </span>
        </span>
      }
      meta={
        <span className="grid gap-1">
          {terminal && <StateBadge value={event.state} />}
          <span
            className={cx(
              "block text-body font-semibold tabular-nums",
              event.state === "POSTPONED" && "text-ink-muted",
            )}
          >
            {event.state === "POSTPONED" ? "A definir" : event.time}
          </span>
          {showDate && (
            <span className="gei-meta tabular-nums">{dateLabel(event.date)}</span>
          )}
        </span>
      }
    />
  )
}

function venueName(state: ReturnType<typeof useProduct>["state"], event: Event) {
  return state.venues.find((venue) => venue.id === event.venueId)?.name ?? "Sin sede"
}

export function Home() {
  const { state, authority, actor, childId } = useProduct()
  const today = todayIso()
  const scoped = visibleEvents(state, actor.id, childId)
  const subject = childId ?? actor.id

  const todayEvents = scoped
    .filter((event) => event.date === today && event.state !== "CANCELLED")
    .sort((a, b) => a.time.localeCompare(b.time))

  const upcoming = scoped
    .filter((event) => event.date > today && event.state !== "CANCELLED")
    .sort((a, b) =>
      a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date),
    )
    .slice(0, 4)

  const unreadNotices = state.notifications.filter(
    (notice) =>
      notice.recipients.includes(actor.id) && !notice.readBy.includes(actor.id),
  )
  const conversations = state.conversations
    .filter(
      (conversation) =>
        conversation.state === "ACTIVE" &&
        conversation.participants.includes(actor.id),
    )
    .sort(
      (a, b) => (b.unread[actor.id] ?? 0) - (a.unread[actor.id] ?? 0),
    )

  const greeting = activeRoleAssignments(state, actor.id)
  void greeting

  return (
    <div className="gei-stack-page mx-auto max-w-5xl">
      <PageContextHeader
        context="Inicio"
        title={authority.guardianChildren.length > 0 && childId
          ? (state.people.find((p) => p.id === childId)?.name ?? actor.name)
          : `Hola, ${actor.firstName}`}
        lead={
          authority.guardianChildren.length > 0 && childId
            ? "Información y eventos del menor que estás mirando."
            : "Lo que pasa hoy y lo que viene."
        }
      />

      <AttentionSection />

      <section className="grid gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="gei-section-title">Hoy</h2>
          <TextLink to="/calendar">Ver calendario</TextLink>
        </div>
        {todayEvents.length === 0 ? (
          <div className="flex flex-wrap items-center gap-3 rounded-surface border border-line bg-surface px-4 py-3.5">
            <CalendarDays size={18} aria-hidden className="text-ink-faint" />
            <div>
              <p className="gei-body-strong">Hoy no hay eventos</p>
              <p className="gei-meta">
                {upcoming.length > 0
                  ? `El próximo es ${dateLabel(upcoming[0].date)}.`
                  : "No hay eventos programados por delante."}
              </p>
            </div>
          </div>
        ) : (
          <Surface flush>
            <ul className="grid px-1 py-1">
              {todayEvents.map((event) => (
                <li key={event.id}>
                  <EventLine event={event} />
                </li>
              ))}
            </ul>
          </Surface>
        )}
      </section>

      <section className="grid gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="gei-section-title">Próximamente</h2>
          <TextLink to="/calendar">Ver calendario</TextLink>
        </div>
        {upcoming.length === 0 ? (
          <p className="gei-meta">
            No hay eventos programados por delante. Cuando se carguen, aparecen acá.
          </p>
        ) : (
          <Surface flush>
            <ul className="grid px-1 py-1">
              {upcoming.map((event) => (
                <li key={event.id}>
                  <EventLine event={event} />
                </li>
              ))}
            </ul>
          </Surface>
        )}
      </section>

      <section className="grid gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="gei-section-title">Comunicaciones</h2>
          <TextLink to="/communication">Ver todo</TextLink>
        </div>
        <div className="grid gap-2">
          {conversations.slice(0, 2).map((conversation) => {
            const last = conversation.messages.at(-1)
            const other = conversation.participants
              .filter((id) => id !== actor.id)
              .map((id) => state.people.find((person) => person.id === id)?.name)
              .filter(Boolean)
            const title =
              conversation.kind === "TEAM"
                ? `Equipo · ${teamName(state, conversation.teamId)}`
                : conversation.kind === "EVENT"
                  ? `Evento · ${state.events.find((e) => e.id === conversation.eventId)?.opponent ?? ""}`
                  : other[0]
            return (
              <RowLink
                key={conversation.id}
                to={`/conversations/${conversation.id}`}
                title={title}
                detail={last?.deletedAt ? "Mensaje eliminado" : last?.body}
                meta={
                  (conversation.unread[actor.id] ?? 0) > 0 ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span aria-hidden className="size-2 rounded-pill bg-unread" />
                      <span className="text-meta font-semibold text-selected">
                        {conversation.unread[actor.id]} sin leer
                      </span>
                    </span>
                  ) : (
                    <span className="gei-meta tabular-nums">
                      {last ? dateTimeLabel(last.at) : ""}
                    </span>
                  )
                }
              />
            )
          })}
          {unreadNotices.length > 0 && (
            <RowLink
              to="/notifications"
              title="Avisos"
              detail={unreadNotices[0].title}
              meta={
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden className="size-2 rounded-pill bg-unread" />
                  <span className="text-meta font-semibold text-selected">
                    {unreadNotices.length} sin leer
                  </span>
                </span>
              }
            />
          )}
          {conversations.length === 0 && unreadNotices.length === 0 && (
            <p className="gei-meta">Todavía no hay conversaciones ni avisos.</p>
          )}
        </div>
      </section>

      <p className="gei-meta sr-only" aria-live="polite">
        Tu disponibilidad pendiente:{" "}
        {subject ? String(scoped.filter((e) => eventAvailabilityView(e, subject) === "NO_RESPONSE").length) : "0"}
      </p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CALENDARIO
   Mes + panel contextual en desktop. Agenda primero en mobile.
   Estado en URL: mes, equipo, tipo, vista.
   ═══════════════════════════════════════════════════════════════ */

const monthName = (iso: string) =>
  new Date(`${iso}-01T12:00:00`).toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  })

function monthMatrix(anchor: string) {
  const [y, m] = anchor.split("-").map(Number)
  const first = new Date(y, m - 1, 1)
  const start = new Date(first)
  start.setDate(first.getDate() - first.getDay())
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return date.toISOString().slice(0, 10)
  }).map((iso) => {
    const local = new Date(`${iso}T12:00:00`)
    return {
      iso,
      day: local.getDate(),
      inMonth: local.getMonth() === m - 1,
    }
  })
}

export function Calendar() {
  const { state, authority, actor, childId } = useProduct()
  const query = useQueryState()
  const today = todayIso()
  const anchor = query.get("m", today.slice(0, 7)) || today.slice(0, 7)
  const teamFilter = query.get("team")
  const typeFilter = query.get("type")
  const view = query.get("view", window.innerWidth >= 1024 ? "month" : "agenda")
  const selected = query.get("event")

  const scoped = useMemo(
    () => visibleEvents(state, actor.id, childId),
    [state, actor.id, childId],
  )
  const filtered = scoped.filter((event) => {
    if (teamFilter && !event.targetTeams.includes(teamFilter)) return false
    if (typeFilter && event.type !== typeFilter) return false
    return true
  })

  const days = monthMatrix(anchor)
  const selectedEvent = filtered.find((event) => event.id === selected)
  const agenda = [...filtered].sort((a, b) =>
    a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date),
  )

  const shiftMonth = (delta: number) => {
    const [y, m] = anchor.split("-").map(Number)
    const date = new Date(y, m - 1 + delta, 1)
    query.set({
      m: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
    })
  }

  const eventToneChip = (event: Event) =>
    event.state === "CANCELLED" || event.state === "ABANDONED"
      ? "bg-danger-soft text-danger"
      : event.state === "POSTPONED"
        ? "bg-warning-soft text-warning"
        : event.state === "COMPLETED"
          ? "bg-neutral-soft text-ink-muted"
          : event.type === "MATCH"
            ? "bg-selected-soft text-selected"
            : "bg-neutral-soft text-ink-strong"

  const monthGrid = (
    <div className="grid gap-px overflow-hidden rounded-surface border border-line bg-line">
      <div className="grid grid-cols-7 bg-surface">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div key={day} className="gei-micro px-2 py-2 text-center">
            {day}
          </div>
        ))}
      </div>
      {Array.from({ length: 6 }, (_, week) => (
        <div key={week} className="grid grid-cols-7 gap-px bg-line">
          {days.slice(week * 7, week * 7 + 7).map((day) => {
            const dayEvents = filtered.filter((event) => event.date === day.iso)
            return (
              <div
                key={day.iso}
                className={cx(
                  "min-h-[5.5rem] bg-surface p-1.5",
                  !day.inMonth && "bg-page",
                  day.iso === today && "ring-1 ring-inset ring-interactive",
                )}
              >
                <p
                  className={cx(
                    "gei-micro tabular-nums",
                    day.iso === today ? "font-bold text-interactive" : "text-ink-faint",
                  )}
                >
                  {day.day}
                </p>
                <ul className="mt-1 grid gap-0.5">
                  {dayEvents.slice(0, 2).map((event) => (
                    <li key={event.id}>
                      <button
                        type="button"
                        onClick={() => query.set({ event: event.id })}
                        className={cx(
                          "block w-full truncate rounded-control px-1.5 py-1 text-left text-micro font-semibold transition-colors",
                          eventToneChip(event),
                          selected === event.id && "outline-2 outline-offset-1 outline-interactive",
                        )}
                      >
                        <span className="tabular-nums">{event.time}</span>{" "}
                        {event.state === "CANCELLED" ? "Cancelado" : event.type === "MATCH" ? "Partido" : "Entreno."}
                      </button>
                    </li>
                  ))}
                  {dayEvents.length > 2 && (
                    <li className="gei-micro px-1.5">
                      +{dayEvents.length - 2} más
                    </li>
                  )}
                </ul>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )

  const agendaList = (
    <ul className="grid gap-3">
      {agenda.map((event) => (
        <li key={event.id}>
          <EventLine event={event} />
        </li>
      ))}
    </ul>
  )

  return (
    <div className="gei-stack-page mx-auto max-w-6xl">
      <PageContextHeader
        context="Calendario"
        title={monthName(`${anchor}-01`)}
        lead="Filtros, mes y vista quedan guardados: el botón atrás del navegador vuelve a este mismo lugar."
        action={
          <SegmentedControl
            ariaLabel="Vista del calendario"
            value={view}
            onChange={(value) => query.set({ view: value })}
            options={[
              { value: "agenda", label: "Agenda" },
              { value: "month", label: "Mes" },
            ]}
          />
        }
        below={
          <div className="flex flex-wrap items-end gap-2">
            <Select
              label="Equipo"
              aria-label="Filtrar por equipo"
              value={teamFilter}
              onChange={(event) => query.set({ team: event.target.value })}
              className="min-w-48"
            >
              <option value="">Todos los equipos</option>
              {state.teams
                .filter((team) => team.state === "ACTIVE")
                .map((team) => (
                  <option key={team.id} value={team.id}>
                    {teamName(state, team.id)}
                  </option>
                ))}
            </Select>
            <Select
              label="Tipo"
              aria-label="Filtrar por tipo de evento"
              value={typeFilter}
              onChange={(event) => query.set({ type: event.target.value })}
              className="min-w-44"
            >
              <option value="">Todos los tipos</option>
              <option value="MATCH">Partido</option>
              <option value="TRAINING">Entrenamiento</option>
              <option value="CLUB_EVENT">Evento del club</option>
            </Select>
            {(teamFilter || typeFilter) && (
              <Button
                variant="quiet"
                onClick={() => query.reset(["team", "type"])}
              >
                Quitar filtros
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid gap-3">
          {view === "month" ? (
            <>
              <div className="flex items-center justify-between gap-2">
                <Button variant="secondary" size="sm" onClick={() => shiftMonth(-1)}>
                  <ChevronLeft size={15} aria-hidden />
                  Mes anterior
                </Button>
                <Button variant="secondary" size="sm" onClick={() => shiftMonth(1)}>
                  Mes siguiente
                  <ChevronRight size={15} aria-hidden />
                </Button>
              </div>
              {monthGrid}
              <p className="gei-meta">
                En el mes, cada celda muestra hasta dos eventos con hora y tipo.
                Tocá uno para ver el detalle acá al lado.
              </p>
            </>
          ) : agenda.length === 0 ? (
            <Empty
              title="Sin eventos con estos filtros"
              detail="No hay nada agendado que coincida con lo que elegiste."
              action={
                <Button variant="secondary" onClick={() => query.reset(["team", "type"])}>
                  Quitar filtros
                </Button>
              }
            />
          ) : (
            agendaList
          )}
        </div>

        <aside className="grid content-start gap-3">
          {selectedEvent ? (
            <Surface className="grid gap-4">
              <div className="grid gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <StateBadge value={selectedEvent.state} />
                  <span className="gei-meta">
                    {dateLabel(selectedEvent.date)} ·{" "}
                    {selectedEvent.state === "POSTPONED" ? "sin horario" : selectedEvent.time}
                  </span>
                </div>
                <h3 className="gei-section-title">{eventName(selectedEvent)}</h3>
                <p className="gei-meta">
                  {eventTargetsText(state, selectedEvent)}
                </p>
              </div>
              <p className="gei-meta flex items-center gap-1.5">
                <MapPin size={13} aria-hidden />
                {venueName(state, selectedEvent)}
              </p>
              {selectedEvent.state === "SCHEDULED" && (
                <VasControl event={selectedEvent} personId={childId ?? actor.id} />
              )}
              <Button variant="secondary" onClick={() => query.set({ event: "" })}>
                Dejar de ver este evento
              </Button>
            </Surface>
          ) : (
            <Surface className="grid gap-2">
              <p className="gei-body-strong">Ningún evento seleccionado</p>
              <p className="gei-meta">
                Tocá un día del mes o una fila de la agenda para ver el detalle y
                responder ¿Vas? sin salir del calendario.
              </p>
            </Surface>
          )}
          <Surface className="grid gap-2">
            <p className="gei-body-strong">Cómo se leen los estados</p>
            <ul className="grid gap-1.5">
              <li className="flex items-center gap-2 text-meta">
                <span aria-hidden className="size-3 rounded-control bg-selected-soft ring-1 ring-inset ring-selected-line" />
                Con horario vigente: se puede confirmar disponibilidad.
              </li>
              <li className="flex items-center gap-2 text-meta">
                <span aria-hidden className="size-3 rounded-control bg-warning-soft ring-1 ring-inset ring-warning-line" />
                Postergado: no hay horario vigente.
              </li>
              <li className="flex items-center gap-2 text-meta">
                <span aria-hidden className="size-3 rounded-control bg-danger-soft ring-1 ring-inset ring-danger-line" />
                Cancelado o suspendido: ya no es un evento operativo.
              </li>
            </ul>
          </Surface>
        </aside>
      </div>
      {authority.isClubWide && filtered.length === 0 && (
        <p className="gei-meta">Sin resultados para estos filtros.</p>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   EQUIPOS
   ═══════════════════════════════════════════════════════════════ */

export function Teams() {
  const { state, authority, actor, childId } = useProduct()
  const scoped = visibleEvents(state, actor.id, childId)
  const teams = state.teams.filter((team) => team.state === "ACTIVE")

  return (
    <div className="gei-stack-page mx-auto max-w-5xl">
      <PageContextHeader
        context="Equipos"
        title="Equipos"
        lead="La lista depende de tu alcance: un entrenador ve sus equipos, una jugadora el suyo."
      />
      <div className="grid gap-2">
        {teams.map((team) => {
          const members = state.people.filter((person) =>
            activeTeamAssignments(state, person.id).some(
              (assignment) => assignment.teamId === team.id,
            ),
          )
          const teamEvents = scoped.filter((event) =>
            event.targetTeams.includes(team.id),
          )
          const isMine = authority.teamIds.includes(team.id)
          return (
            <RowLink
              key={team.id}
              to={`/teams/${team.id}`}
              title={teamName(state, team.id)}
              detail={`${members.length} ${
                members.length === 1 ? "persona" : "personas"
              } · ${teamEvents.length} ${
                teamEvents.length === 1 ? "evento" : "eventos"
              } a la vista`}
              leading={isMine ? <Tag tone="selected">Tu alcance</Tag> : undefined}
            />
          )
        })}
        {teams.length === 0 && (
          <Empty
            title="No tenés equipos asignados"
            detail="Cuando la administración te asigne a un equipo, aparece acá."
          />
        )}
      </div>
    </div>
  )
}

export function TeamDetail() {
  const { teamId = "" } = useParams()
  const { state, authority, actor, childId } = useProduct()
  const query = useQueryState()
  const tab = query.get("tab", "eventos")
  const today = todayIso()
  const subject = childId ?? actor.id

  const team = state.teams.find((item) => item.id === teamId)
  if (!team || !authority.canOpen("teams"))
    return (
      <div className="gei-stack-page mx-auto max-w-3xl">
        <PageContextHeader context="Equipos" title="No llegaste a ese equipo" />
        <Empty
          title="Ese equipo no está en tu alcance"
          detail="Pedile a la administración que te lo asigne si lo necesitás."
        />
      </div>
    )

  const members = state.people.filter((person) =>
    activeTeamAssignments(state, person.id).some(
      (assignment) => assignment.teamId === teamId,
    ),
  )
  const scoped = visibleEvents(state, actor.id, childId)
  const events = scoped
    .filter((event) => event.targetTeams.includes(teamId))
    .sort((a, b) =>
      a.date === b.date ? b.time.localeCompare(a.time) : b.date.localeCompare(a.date),
    )
  const upcoming = events.filter(
    (event) => event.date >= today && event.state !== "CANCELLED",
  )
  const finished = events.filter(
    (event) => event.date < today || event.state === "COMPLETED",
  )
  const isMine = authority.teamIds.includes(teamId)

  return (
    <div className="gei-stack-page mx-auto max-w-5xl">
      <PageContextHeader
        context="Equipos"
        title={teamName(state, teamId)}
        back="/teams"
        lead={
          isMine
            ? "Es un equipo que vos ves: aquí abajo están tus eventos y tu disponibilidad."
            : "Estás viendo un equipo que no gestionás."
        }
        action={
          isMine ? (
            <Tag tone="selected">En tu alcance</Tag>
          ) : (
            <Tag>Sólo consulta</Tag>
          )
        }
      />

      <div className="border-b border-line">
        <div
          role="tablist"
          aria-label="Secciones del equipo"
          className="flex gap-1 overflow-x-auto"
        >
          {[
            { id: "personas", label: "Personas", count: members.length },
            { id: "eventos", label: "Eventos", count: events.length },
            { id: "resultados", label: "Resultados", count: finished.filter((e) => e.record.state === "FINAL").length },
          ].map((item) => {
            const selected = tab === item.id
            return (
              <button
                key={item.id}
                role="tab"
                type="button"
                aria-selected={selected}
                onClick={() => query.set({ tab: item.id })}
                className={cx(
                  "gei-target-sm shrink-0 border-b-2 px-3 text-body font-semibold transition-colors",
                  selected
                    ? "border-interactive text-interactive"
                    : "border-transparent text-ink-muted hover:text-ink",
                )}
              >
                {item.label}
                <span className="ml-1.5 text-meta text-ink-faint">{item.count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {tab === "personas" && (
        <DetailSection
          title="Personas del equipo"
          meta={`${members.length} ${members.length === 1 ? "persona" : "personas"}`}
        >
          <div className="grid gap-1">
            {members.map((person) => {
              const roles = activeRoleAssignments(state, person.id)
              return (
                <RowLink
                  key={person.id}
                  to={`/people/${person.id}`}
                  title={person.name}
                  detail={roles
                    .map(
                      (role) =>
                        `${role.role === "COACH" ? "Entrenador" : role.role === "CAPTAIN" ? "Capitana" : "Jugadora"} · ${roleScopeLabel(state, role)}`,
                    )
                    .join("  ·  ")}
                  leading={<Avatar name={person.name} size="sm" />}
                />
              )
            })}
          </div>
        </DetailSection>
      )}

      {tab === "eventos" && (
        <div className="grid gap-4">
          {upcoming.length > 0 && (
            <DetailSection
              title="Próximos eventos"
              meta={`${upcoming.length} ${upcoming.length === 1 ? "evento" : "eventos"}`}
            >
              <ul className="grid gap-2">
                {upcoming.map((event) => (
                  <li key={event.id}>
                    <Surface className="grid gap-3">
                      <EventLine event={event} />
                      {event.state === "SCHEDULED" && (
                        <VasControl event={event} personId={subject} />
                      )}
                    </Surface>
                  </li>
                ))}
              </ul>
            </DetailSection>
          )}
          <DetailSection
            title="Eventos pasados"
            meta={finished.length === 0 ? undefined : `${finished.length}`}
          >
            {finished.length === 0 ? (
              <p className="gei-meta">Todavía no hay eventos pasados.</p>
            ) : (
              <ul className="grid gap-1">
                {finished.map((event) => (
                  <li key={event.id}>
                    <EventLine event={event} />
                  </li>
                ))}
              </ul>
            )}
          </DetailSection>
        </div>
      )}

      {tab === "resultados" && (
        <DetailSection title="Resultados" meta="De eventos finalizados">
          {finished.filter((event) => event.record.state === "FINAL").length === 0 ? (
            <p className="gei-meta">Todavía no hay resultados finalizados.</p>
          ) : (
            <ul className="grid gap-1">
              {finished
                .filter((event) => event.record.state === "FINAL")
                .map((event) => (
                  <li key={event.id}>
                    <RowStatic
                      title={eventName(event)}
                      detail={dateLabel(event.date, true)}
                      meta={
                        <span className="gei-body-strong tabular-nums">
                          {event.record.gei}–{event.record.opponent}
                        </span>
                      }
                      trailing={
                        <TextLink to={`/events/${event.id}/match-record`}>
                          Ver acta
                        </TextLink>
                      }
                    />
                  </li>
                ))}
            </ul>
          )}
        </DetailSection>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PERSONA — lectura, sin PII indebida
   ═══════════════════════════════════════════════════════════════ */

export function PersonDetail() {
  const { personId = "" } = useParams()
  const { state, authority } = useProduct()
  const person = state.people.find((item) => item.id === personId)
  if (!person)
    return (
      <div className="mx-auto max-w-3xl">
        <Empty
          title="No encontramos a esa persona"
          detail="Puede que el enlace esté incompleto o que ya no exista."
        />
      </div>
    )

  const roles = activeRoleAssignments(state, person.id)
  const teams = activeTeamAssignments(state, person.id)
  const relations = guardiansOf(state, person.id)
  const eligibility = state.eligibilityConstraints.filter(
    (constraint) =>
      constraint.personId === person.id &&
      (!constraint.validUntil || constraint.validUntil > todayIso()),
  )

  return (
    <div className="gei-stack-page mx-auto max-w-3xl">
      <PageContextHeader
        context="Personas"
        title={person.name}
        back="/teams"
        action={<StateBadge value={person.account} />}
      />

      <DetailSection title="Identidad">
        <dl className="grid">
          <RowStatic title="Nombre" detail={person.name} />
          <RowStatic
            title="Contacto"
            detail={
              authority.canViewContact(person)
                ? `${person.phone || "Sin teléfono"} · ${person.email || "Sin correo"}`
                : "No disponible para tu rol"
            }
          />
          {authority.canViewDni && (
            <RowStatic title="Documento" detail={person.dni || "Sin cargar"} />
          )}
          {authority.canViewBirth && (
            <RowStatic title="Fecha de nacimiento" detail={person.birth || "Sin cargar"} />
          )}
        </dl>
      </DetailSection>

      <DetailSection title="Roles y alcance">
        {roles.length === 0 ? (
          <p className="gei-meta">No tiene roles deportivos vigentes.</p>
        ) : (
          <ul className="grid gap-1">
            {roles.map((role) => (
              <li key={role.id}>
                <RowStatic
                  title={
                    role.role === "COACH"
                      ? "Entrenador"
                      : role.role === "CAPTAIN"
                        ? "Capitana"
                        : role.role === "ADMIN"
                          ? "Administración"
                          : role.role === "SUBCOMMITTEE"
                            ? "Subcomisión"
                            : "Jugadora"
                  }
                  detail={roleScopeLabel(state, role)}
                />
              </li>
            ))}
          </ul>
        )}
      </DetailSection>

      {teams.length > 0 && (
        <DetailSection title="Equipos">
          <ul className="grid gap-1">
            {teams.map((assignment) => (
              <li key={assignment.id}>
                <RowStatic
                  title={teamName(state, assignment.teamId)}
                  detail={`Desde ${dateLabel(assignment.validFrom)}`}
                />
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {relations.length > 0 && (
        <DetailSection title="Personas que pueden actuar por esta persona">
          <ul className="grid gap-1">
            {relations.map((relation) => {
              const guardian = state.people.find(
                (item) => item.id === relation.guardianId,
              )
              return (
                <li key={relation.id}>
                  <RowStatic
                    title={guardian?.name ?? "—"}
                    detail={`${relation.relation} · puede ver información: ${
                      relation.canViewChildInfo ? "sí" : "no"
                    } · puede responder ¿Vas?: ${
                      relation.canRespondAvailability ? "sí" : "no"
                    }`}
                  />
                </li>
              )
            })}
          </ul>
        </DetailSection>
      )}

      {authority.canViewEligibilityStatus(person) && (
        <DetailSection title="Habilitación para jugar">
          {eligibility.length === 0 ? (
            <p className="gei-meta">Sin restricciones vigentes: puede jugar.</p>
          ) : (
            <ul className="grid gap-1">
              {eligibility.map((constraint) => (
                <li key={constraint.id}>
                  <RowStatic
                    title={
                      constraint.state === "BLOCKED"
                        ? "No habilitada para jugar"
                        : "Trámite pendiente"
                    }
                    detail={
                      authority.canViewEligibilityReason
                        ? constraint.note ?? "Sin detalle"
                        : "Pedí el detalle a la Subcomisión."
                    }
                    trailing={
                      <StateBadge
                        value={constraint.state === "BLOCKED" ? "BLOCKED" : "PENDING"}
                      />
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </DetailSection>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   BUSCAR — query en la URL
   ═══════════════════════════════════════════════════════════════ */

export function SearchPage() {
  const { state, authority, actor, childId } = useProduct()
  const query = useQueryState()
  const term = query.get("q")
  const [draft, setDraft] = useState(term)
  const needle = term.trim().toLowerCase()
  const scoped = visibleEvents(state, actor.id, childId)

  const people = needle
    ? state.people.filter(
        (person) =>
          person.name.toLowerCase().includes(needle) ||
          person.username.toLowerCase().includes(needle),
      )
    : []
  const teams = needle
    ? state.teams.filter((team) =>
        teamName(state, team.id).toLowerCase().includes(needle),
      )
    : []
  const events = needle
    ? scoped.filter((event) =>
        (eventName(event) + eventTargetsText(state, event))
          .toLowerCase()
          .includes(needle),
      )
    : []
  const structure = needle
    ? state.structure.filter(
        (item) =>
          item.type !== "VENUE" &&
          item.name.toLowerCase().includes(needle),
      )
    : []
  const total = people.length + teams.length + events.length + structure.length

  return (
    <div className="gei-stack-page mx-auto max-w-3xl">
      <PageContextHeader
        context="Buscar"
        title="Buscar"
        lead="Buscá personas, equipos, eventos y divisiones o líneas del club."
      />
      <form
        onSubmit={(event) => {
          event.preventDefault()
          query.set({ q: draft })
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <SearchIcon
            size={17}
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
          />
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-label="Buscar en GEI Hockey"
            placeholder="Nombre, equipo, evento…"
            className="gei-target w-full rounded-control border border-line-strong bg-surface pl-9 pr-3 text-body text-ink placeholder:text-ink-faint"
          />
        </div>
        <Button type="submit" variant="primary">
          Buscar
        </Button>
      </form>

      {!needle ? (
        <Empty
          title="Escribí algo para empezar"
          detail="La búsqueda no devuelve datos personales como documento o fecha de nacimiento."
          icon={<SearchIcon size={22} />}
        />
      ) : total === 0 ? (
        <Empty
          title={`Nada para "${term}"`}
          detail="Probá con menos palabras o revisá cómo está escrito el nombre."
          action={
            <Button variant="secondary" onClick={() => query.reset(["q"])}>
              Limpiar búsqueda
            </Button>
          }
          icon={<SearchIcon size={22} />}
        />
      ) : (
        <div className="grid gap-5">
          {people.length > 0 && (
            <DetailSection title="Personas" meta={`${people.length}`}>
              <div className="grid gap-1">
                {people.slice(0, 8).map((person) => (
                  <RowLink
                    key={person.id}
                    to={`/people/${person.id}`}
                    title={person.name}
                    detail={
                      authority.canViewEligibilityStatus(person)
                        ? undefined
                        : undefined
                    }
                    leading={<Avatar name={person.name} size="sm" />}
                  />
                ))}
              </div>
            </DetailSection>
          )}
          {teams.length > 0 && (
            <DetailSection title="Equipos" meta={`${teams.length}`}>
              <div className="grid gap-1">
                {teams.map((team) => (
                  <RowLink
                    key={team.id}
                    to={`/teams/${team.id}`}
                    title={teamName(state, team.id)}
                  />
                ))}
              </div>
            </DetailSection>
          )}
          {events.length > 0 && (
            <DetailSection title="Eventos" meta={`${events.length}`}>
              <ul className="grid gap-1">
                {events.map((event) => (
                  <li key={event.id}>
                    <EventLine event={event} />
                  </li>
                ))}
              </ul>
            </DetailSection>
          )}
          {structure.length > 0 && (
            <DetailSection
              title="Divisiones y líneas"
              meta={`${structure.length}`}
            >
              <div className="grid gap-1">
                {structure.map((item) => (
                  <RowStatic
                    key={item.id}
                    title={item.name}
                    detail={item.type === "DIVISION" ? "División" : "Línea"}
                  />
                ))}
              </div>
            </DetailSection>
          )}
        </div>
      )}
    </div>
  )
}

export { VasCompact }