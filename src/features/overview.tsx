import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search as SearchIcon,
} from "lucide-react"
import { useFetch } from "../lib/use-fetch"
import {
  fetchCalendarRange,
  fetchNextEvent,
  fetchNotificationList,
  subscribeRealtime,
  type EventDto,
} from "../lib/t03-api"
import { fetchStructure, fetchRoster } from "../lib/api-client"
import { me as fetchMe } from "../lib/session"
import { dateLabel, timeLabel, shortDate } from "../lib/dates"
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
import { PageContextHeader } from "../shared/patterns"
import { useQueryState } from "../shared/use-query-state"
import { useUnreadCount } from "../lib/use-unread-count"

/* ─────────────────────────────────────────────
   Helpers de presentación de EventDto
   ───────────────────────────────────────────── */

const EVENT_TYPE_LABEL: Record<EventDto["type"], string> = {
  MATCH: "Partido",
  TRAINING: "Entrenamiento",
  CLUB_EVENT: "Evento del club",
}

function targetsText(event: EventDto): string {
  if (event.clubWideTarget) return "Todo el club"
  const teams = event.targets.teams.map((t) => t.name ?? "Equipo")
  const persons = event.targets.persons.length
  if (teams.length > 0 && persons > 0) return `${teams.join(" + ")} + ${persons} ${persons === 1 ? "persona" : "personas"}`
  if (teams.length > 0) return teams.join(" + ")
  if (persons > 0) return `${persons} ${persons === 1 ? "persona" : "personas"}`
  return "Sin destino asignado"
}

function eventTitle(event: EventDto): string {
  return event.type === "MATCH" ? `GEI vs. ${event.opponent ?? "Rival a definir"}` : event.title
}

function eventDateIso(event: EventDto): string {
  return event.startAt ? event.startAt.slice(0, 10) : ""
}

function startTimeLabel(event: EventDto): string {
  if (event.state === "POSTPONED") return "A definir"
  return event.startAt ? timeLabel(event.startAt) : "A definir"
}

function EventLine({ event, showDate = true }: { event: EventDto; showDate?: boolean }) {
  const terminal = ["CANCELLED", "COMPLETED", "ABANDONED", "POSTPONED"].includes(event.state)
  return (
    <RowLink
      to={`/events/${event.id}`}
      title={eventTitle(event)}
      detail={
        <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span>{targetsText(event)}</span>
          {event.venue?.name && (
            <>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={11} aria-hidden />
                {event.venue.name}
              </span>
            </>
          )}
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
            {startTimeLabel(event)}
          </span>
          {showDate && <span className="gei-meta tabular-nums">{dateLabel(eventDateIso(event))}</span>}
        </span>
      }
    />
  )
}

const monthName = (anchor: string) =>
  new Date(`${anchor}-01T12:00:00`).toLocaleDateString("es-AR", { month: "long", year: "numeric" })

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
    return { iso, day: local.getDate(), inMonth: local.getMonth() === m - 1 }
  })
}

const todayIso = () => new Date().toLocaleDateString("en-CA") // YYYY-MM-DD local
const shiftDateIso = (iso: string, days: number) => {
  const d = new Date(`${iso}T12:00:00`)
  d.setDate(d.getDate() + days)
  return d.toLocaleDateString("en-CA")
}

/* ─────────────────────────────────────────────
   HOME
   ───────────────────────────────────────────── */

export function Home() {
  const me = useFetch(() => fetchMe(), [])
  const today = todayIso()
  const sevenDaysOut = shiftDateIso(today, 14)
  const events = useFetch(
    () => fetchCalendarRange({ from: `${today}T00:00:00`, to: `${sevenDaysOut}T23:59:59`, limit: 50 }),
    [today],
  )
  const next = useFetch(() => fetchNextEvent(), [])
  const { unread } = useUnreadCount()

  const todayEvents = useMemo(
    () => (events.data?.items ?? []).filter((event) => eventDateIso(event) === today && event.state !== "CANCELLED"),
    [events.data, today],
  )
  const upcoming = useMemo(
    () => (events.data?.items ?? []).filter((event) => eventDateIso(event) > today && event.state !== "CANCELLED").slice(0, 4),
    [events.data, today],
  )

  const name = me.data?.firstName ?? me.data?.username ?? ""

  const attention: Array<{ id: string; reason: string; consequence: string; action: { label: string; to: string } }> = []
  if (me.data && me.data.profileCompleted === false) {
    attention.push({
      id: "profile-incomplete",
      reason: "Completá tu perfil",
      consequence: "No se pueden asignar a un equipo con la información incompleta.",
      action: { label: "Completar mi perfil", to: "/more/profile" },
    })
  }
  // Decisión A-02 (B1): Notification.readAt NUNCA genera una fila de Attention.
  // Los avisos sin leer permanecen como contexto/deep link en Comunicaciones.

  return (
    <div className="gei-stack-page mx-auto max-w-5xl">
      <PageContextHeader context="Inicio" title={`Hola${name ? `, ${name}` : ""}`} lead="Lo que pasa hoy y lo que viene." />

      <section aria-labelledby="atencion-pendientes" className="grid gap-3">
        <h2 id="atencion-pendientes" className="gei-section-title">Necesita tu atención</h2>
        {attention.length === 0 ? (
          <p className="gei-meta">Nada pendiente.</p>
        ) : (
          <ul className="grid gap-2">
            {attention.slice(0, 3).map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-surface border border-line bg-surface px-4 py-3">
                <div>
                  <p className="gei-body-strong">{item.reason}</p>
                  <p className="gei-meta">{item.consequence}</p>
                </div>
                <TextLink to={item.action.to}>{item.action.label}</TextLink>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="gei-section-title">Hoy</h2>
          <TextLink to="/calendar">Ver calendario</TextLink>
        </div>
        {events.loading ? (
          <p className="gei-meta">Cargando eventos…</p>
        ) : todayEvents.length === 0 ? (
          <div className="flex flex-wrap items-center gap-3 rounded-surface border border-line bg-surface px-4 py-3.5">
            <CalendarDays size={18} aria-hidden className="text-ink-faint" />
            <div>
              <p className="gei-body-strong">Hoy no hay eventos</p>
              <p className="gei-meta">{upcoming.length > 0 ? `El próximo es ${dateLabel(eventDateIso(upcoming[0]!))}.` : "No hay eventos programados por delante."}</p>
            </div>
          </div>
        ) : (
          <Surface flush>
            <ul className="grid px-1 py-1">
              {todayEvents.map((event) => (
                <li key={event.id}><EventLine event={event} /></li>
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
          <p className="gei-meta">No hay eventos programados por delante. Cuando se carguen, aparecen acá.</p>
        ) : (
          <Surface flush>
            <ul className="grid px-1 py-1">
              {upcoming.map((event) => (
                <li key={event.id}><EventLine event={event} /></li>
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
        {(unread ?? 0) > 0 ? (
          <RowLink
            to="/notifications"
            title="Avisos sin leer"
            detail={`Tenés ${unread} ${unread === 1 ? "aviso pendiente" : "avisos pendientes"}.`}
            leading={<Bell size={17} aria-hidden className="text-ink-faint" />}
          />
        ) : (
          <p className="gei-meta">No tenés avisos sin leer.</p>
        )}
      </section>

      {next.data?.event && (
        <section className="grid gap-3">
          <h2 className="gei-section-title">Tu próximo evento</h2>
          <EventLine event={next.data.event} />
        </section>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   CALENDARIO
   ───────────────────────────────────────────── */

export function Calendar() {
  const query = useQueryState()
  const navigate = useNavigate()
  const me = useFetch(() => fetchMe(), [])
  const today = todayIso()
  const anchor = query.get("m", today.slice(0, 7)) || today.slice(0, 7)
  const teamFilter = query.get("team")
  const typeFilter = query.get("type")
  const view = query.get("view", typeof window !== "undefined" && window.innerWidth >= 1024 ? "month" : "agenda")
  const selected = query.get("event")

  const [y, m] = anchor.split("-").map(Number)
  const monthStart = new Date(y, m - 1, 1)
  const from = shiftDateIso(`${monthStart.toLocaleDateString("en-CA")}`, -6)
  const to = shiftDateIso(`${new Date(y, m, 0).toLocaleDateString("en-CA")}`, 7)

  const { data, loading, error, reload } = useFetch(
    () => fetchCalendarRange({ from: `${from}T00:00:00`, to: `${to}T23:59:59`, limit: 400 }),
    [anchor],
  )

  useEffect(() => {
    const unsubscribe = subscribeRealtime((event) => {
      if (event.invalidate?.includes("calendar")) void reload()
    })
    return unsubscribe
  }, [reload])

  const structure = useFetch(() => fetchStructure(), [])
  const teams = (structure.data?.teams ?? []).filter((team) => team.state === "ACTIVE")

  const filtered = useMemo(
    () => (data?.items ?? []).filter((event) => {
      if (teamFilter && !event.targets.teams.some((t) => t.teamId === teamFilter)) return false
      if (typeFilter && event.type !== typeFilter) return false
      return true
    }),
    [data, teamFilter, typeFilter],
  )

  const days = monthMatrix(anchor)
  const selectedEvent = filtered.find((event) => event.id === selected) ?? null
  const agenda = [...filtered].sort((a, b) => (a.startAt ?? "").localeCompare(b.startAt ?? ""))

  const isOperational = Boolean(me.data?.isSubcommittee) || (me.data?.roleAssignments ?? []).some((r) => r.role === "COACH")

  const shiftMonth = (delta: number) => {
    const date = new Date(y, m - 1 + delta, 1)
    query.set({ m: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}` })
  }

  const eventToneChip = (event: EventDto) =>
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
          <div key={day} className="gei-micro px-2 py-2 text-center">{day}</div>
        ))}
      </div>
      {Array.from({ length: 6 }, (_, week) => (
        <div key={week} className="grid grid-cols-7 gap-px bg-line">
          {days.slice(week * 7, week * 7 + 7).map((day) => {
            const dayEvents = filtered.filter((event) => eventDateIso(event) === day.iso)
            return (
              <div key={day.iso} className={cx("min-h-[5.5rem] bg-surface p-1.5", !day.inMonth && "bg-page", day.iso === today && "ring-1 ring-inset ring-interactive")}>
                <p className={cx("gei-micro tabular-nums", day.iso === today ? "font-bold text-interactive" : "text-ink-faint")}>{day.day}</p>
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
                        <span className="tabular-nums">{event.state === "POSTPONED" ? "—" : event.startAt ? timeLabel(event.startAt) : "—"}</span>{" "}
                        {event.state === "CANCELLED" ? "Cancelado" : event.type === "MATCH" ? "Partido" : "Entreno."}
                      </button>
                    </li>
                  ))}
                  {dayEvents.length > 2 && <li className="gei-micro px-1.5">+{dayEvents.length - 2} más</li>}
                </ul>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )

  return (
    <div className="gei-stack-page mx-auto max-w-6xl">
      <PageContextHeader
        context="Calendario"
        title={monthName(anchor)}
        lead="Mes y filtros quedan guardados: el botón atrás del navegador vuelve a este mismo lugar."
        action={
          <div className="flex flex-wrap items-center gap-2">
            {isOperational && (
              <>
                <Button variant="secondary" onClick={() => navigate("/events/new")}>Nuevo evento</Button>
                <Button variant="secondary" onClick={() => navigate("/jornadas/new")}>Nueva jornada</Button>
              </>
            )}
            <SegmentedControl
              ariaLabel="Vista del calendario"
              value={view}
              onChange={(value) => query.set({ view: value })}
              options={[
                { value: "agenda", label: "Agenda" },
                { value: "month", label: "Mes" },
              ]}
            />
          </div>
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
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
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
              <Button variant="quiet" onClick={() => query.reset(["team", "type"])}>Quitar filtros</Button>
            )}
          </div>
        }
      />

      {error && <Surface><p className="gei-meta">No pudimos cargar el calendario: {error}</p><Button variant="secondary" size="sm" onClick={reload}>Reintentar</Button></Surface>}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid gap-3">
          {view === "month" ? (
            <>
              <div className="flex items-center justify-between gap-2">
                <Button variant="secondary" size="sm" onClick={() => shiftMonth(-1)}><ChevronLeft size={15} aria-hidden />Mes anterior</Button>
                <Button variant="secondary" size="sm" onClick={() => shiftMonth(1)}>Mes siguiente<ChevronRight size={15} aria-hidden /></Button>
              </div>
              {monthGrid}
              <p className="gei-meta">En el mes, cada celda muestra hasta dos eventos con hora y tipo. Tocá uno para ver el detalle acá al lado.</p>
            </>
          ) : loading ? (
            <p className="gei-meta">Cargando agenda…</p>
          ) : agenda.length === 0 ? (
            <Empty
              title="Sin eventos con estos filtros"
              detail="No hay nada agendado que coincida con lo que elegiste en este mes."
              action={(teamFilter || typeFilter) ? <Button variant="secondary" onClick={() => query.reset(["team", "type"])}>Quitar filtros</Button> : undefined}
            />
          ) : (
            <ul className="grid gap-3">{agenda.map((event) => <li key={event.id}><EventLine event={event} /></li>)}</ul>
          )}
        </div>

        <aside className="grid content-start gap-3">
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
          {selectedEvent ? (
            <Surface className="grid gap-4">
              <div className="grid gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <StateBadge value={selectedEvent.state} />
                  <span className="gei-meta">{dateLabel(eventDateIso(selectedEvent))} · {startTimeLabel(selectedEvent)}</span>
                </div>
                <h3 className="gei-section-title">{eventTitle(selectedEvent)}</h3>
                <p className="gei-meta">{targetsText(selectedEvent)}</p>
              </div>
              {selectedEvent.venue?.name && (
                <p className="gei-meta flex items-center gap-1.5"><MapPin size={13} aria-hidden />{selectedEvent.venue.name}</p>
              )}
              <Button variant="secondary" onClick={() => query.set({ event: "" })}>Dejar de ver este evento</Button>
              <Button variant="primary" onClick={() => navigate(`/events/${selectedEvent.id}`)}>Abrir el evento</Button>
            </Surface>
          ) : (
            <Surface className="grid gap-2">
              <p className="gei-body-strong">Ningún evento seleccionado</p>
              <p className="gei-meta">Tocá un día del mes o una fila de la agenda para ver el detalle acá al lado.</p>
            </Surface>
          )}
        </aside>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   EQUIPOS
   ───────────────────────────────────────────── */

export function Teams() {
  const { data, loading, error } = useFetch(() => fetchStructure(), [])
  const teams = (data?.teams ?? []).filter((team) => team.state === "ACTIVE")

  return (
    <div className="gei-stack-page mx-auto max-w-5xl">
      <PageContextHeader
        context="Equipos"
        title="Equipos"
        lead="La lista depende de tu alcance: un entrenador ve sus equipos, una jugadora el suyo."
      />
      {loading && <p className="gei-meta">Cargando equipos…</p>}
      {error && <Surface><p className="gei-meta">No pudimos cargar los equipos: {error}</p></Surface>}
      <div className="grid gap-2">
        {teams.map((team) => (
          <RowLink key={team.id} to={`/teams/${team.id}`} title={team.name} detail={`${data?.seasons.find((s) => s.id === team.seasonId)?.name ?? ""}`} />
        ))}
        {!loading && teams.length === 0 && (
          <Empty title="No hay equipos activos" detail="Cuando la administración dé de alta un equipo, aparece acá." />
        )}
      </div>
    </div>
  )
}

export function TeamDetail() {
  const { teamId = "" } = useParams()
  const me = useFetch(() => fetchMe(), [])
  const structure = useFetch(() => fetchStructure(), [])
  const roster = useFetch(() => fetchRoster(teamId), [teamId])

  if (roster.loading) return <div className="mx-auto max-w-4xl"><p className="gei-meta">Cargando plantel…</p></div>

  if (roster.error) {
    return (
      <div className="mx-auto max-w-3xl">
        <PageContextHeader context="Equipos" title="No llegaste a ese equipo" />
        <Empty title="Ese equipo no está en tu alcance" detail="Pedile a la administración que te lo asigne si lo necesitás." />
      </div>
    )
  }

  const team = structure.data?.teams.find((item) => item.id === teamId)
  const items = roster.data?.items ?? []

  return (
    <div className="gei-stack-page mx-auto max-w-4xl">
      <PageContextHeader context="Equipos" title={team?.name ?? "Equipo"} back="/teams" lead={`${items.length} ${items.length === 1 ? "persona en el plantel" : "personas en el plantel"}`} />
      <Surface flush>
        <ul className="grid px-1 py-1">
          {items.map((person) => (
            <li key={person.assignmentId} className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-3 py-2.5 last:border-b-0">
              <div className="flex items-center gap-3">
                <Avatar name={`${person.firstName} ${person.lastName}`} size="sm" />
                <div>
                  <p className="text-body font-semibold text-ink">{person.firstName} {person.lastName}</p>
                  <p className="gei-meta">Desde {dateLabel(person.validFrom)}{person.validUntil ? ` hasta ${dateLabel(person.validUntil)}` : ""}</p>
                </div>
              </div>
              <div className="text-right">
                {person.username && <p className="gei-meta">{person.username}</p>}
                {person.accountStatus && <Tag tone={person.accountStatus === "ACTIVE" ? "selected" : "neutral"}>{person.accountStatus === "ACTIVE" ? "Cuenta activa" : person.accountStatus === "PENDING" ? "Pendiente" : "Deshabilitada"}</Tag>}
              </div>
            </li>
          ))}
          {items.length === 0 && <p className="px-3 py-4 text-meta text-ink-muted">Todavía no hay personas asignadas a este equipo.</p>}
        </ul>
      </Surface>
    </div>
  )
}

export function PersonDetail() {
  const { personId = "" } = useParams()
  const me = useFetch(() => fetchMe(), [])
  const isSelf = me.data?.principal?.personId === personId

  if (me.loading) return <div className="mx-auto max-w-2xl"><p className="gei-meta">Cargando…</p></div>

  if (!isSelf) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageContextHeader context="Personas" title="Ficha de persona" back="/teams" />
        <Surface className="grid gap-2">
          <p className="gei-body-strong">Esta ficha llega con la siguiente etapa</p>
          <p className="gei-meta">Por ahora, tu propio perfil está en Más → Mi perfil, y la administración ve las personas desde Gestión.</p>
        </Surface>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageContextHeader context="Personas" title="Mi ficha" back="/more/profile" />
      <Surface className="grid gap-2">
        <RowStatic title="Nombre" detail={`${me.data?.firstName ?? ""} ${me.data?.lastName ?? ""}`.trim() || "—"} />
        <RowStatic title="Usuario" detail={me.data?.username ?? "—"} />
        <RowStatic title="Correo" detail={me.data?.email ?? "—"} />
        <RowStatic title="Estado de cuenta" detail={me.data?.accountStatus ?? "—"} />
        <RowStatic title="Perfil completo" detail={me.data?.profileCompleted ? "Sí" : "No"} />
      </Surface>
    </div>
  )
}

export function SearchPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageContextHeader context="Buscar" title="Búsqueda" />
      <Surface className="grid gap-2">
        <SearchIcon size={20} aria-hidden className="text-ink-faint" />
        <p className="gei-body-strong">La búsqueda llega con la T06</p>
        <p className="gei-meta">Por ahora podés encontrar equipos desde Equipos y eventos desde el calendario.</p>
        <Button variant="secondary" onClick={() => window.history.back()}>Volver</Button>
      </Surface>
    </div>
  )
}
