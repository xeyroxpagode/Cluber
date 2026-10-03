import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import {
  ArrowRight,
  Plus,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock3,
  AlertCircle,
  ClipboardList,
  CheckCircle2,
  Megaphone,
  Users,
  MapPin,
  List,
  Grid3X3,
  Search,
  Phone,
  Mail,
} from "lucide-react"
import { useProduct } from "../mock/store"
import {
  dateLabel,
  eventName,
  labels,
  availabilityLabel,
  eventTargetsText,
} from "../mock/model"
import { currentRoles } from "../mock/permissions"
import { todayIso, todayLabel } from "../mock/clock"
import { deriveEligibility } from "../mock/eligibility"
import { stateText } from "../shared/states"
import { VasInline } from "../shared/vas"
import {
  Header,
  Section,
  Surface,
  EventRow,
  TextLink,
  Badge,
  Button,
  Avatar,
  RowLink,
  Select,
  Empty,
  IconButton,
  TextField,
} from "../shared/ui"

export function Home() {
  const { state, actor, capabilities, guardianChildren } = useProduct()
  const myTeam = state.teams.find((team) => team.id === actor.team)
  const teamRoster = state.people.filter(
    (person) =>
      person.team === actor.team && ["PLAYER", "CAPTAIN"].includes(person.role),
  )
  const captain = teamRoster.find((person) => person.role === "CAPTAIN")
  const scope = state.events.filter(
    (event) =>
      event.team === actor.team || event.clubWide || capabilities.official,
  )
  const todayIsoValue = todayIso()
  const today = scope.filter(
    (event) => event.date === todayIsoValue && event.state === "SCHEDULED",
  )
  const upcoming = scope
    .filter(
      (event) =>
        event.date > todayIsoValue &&
        !["CANCELLED", "DRAFT"].includes(event.state),
    )
    .sort((first, second) => first.date.localeCompare(second.date))
  const nextMatch = upcoming.find(
    (event) => event.type === "MATCH" && event.state === "SCHEDULED",
  )
  const attention = scope.flatMap((event) => {
    const rows: {
      title: string
      detail: string
      route: string
      kind: string
      action: string
    }[] = []
    const needsReconfirmation = capabilities.availability ? !!event.availability[actor.id] && event.availability[actor.id].revision !== event.revision : Object.values(event.availability).some(response => response.revision !== event.revision)
    if (event.state === "SCHEDULED" && needsReconfirmation)
      rows.push({
        title: "Nuevo horario, nuevas confirmaciones",
        detail: `${eventName(event)} · ${dateLabel(event.date)} · ${event.time}`,
        route: `/events/${event.id}${
          capabilities.availability ? "/availability" : ""
        }`,
        kind: "time",
        action: capabilities.availability ? "Reconfirmar" : "Ver partido",
      })
    const conflicts = (event.published || []).filter((id) => {
      const person = state.people.find((p) => p.id === id)
      if (!person) return true
      if (deriveEligibility(state.eligibilityConstraints, id) !== "ELIGIBLE") return true
      return person.team !== event.team
    })
    if (conflicts.length && capabilities.sport)
      rows.push({
        title: "Convocatoria con situaciones para revisar",
        detail: `${eventName(event)} · ${conflicts.length} jugadora con conflicto actual`,
        route: `/events/${event.id}/selection`,
        kind: "selection",
        action: "Revisar",
      })
    if (event.attendanceOpened && !event.attendanceClosed && capabilities.sport)
      rows.push({
        title: "La asistencia sigue abierta",
        detail: `${event.title} · ${state.people.filter((person) => person.team === event.team && ["PLAYER", "CAPTAIN"].includes(person.role) && !event.attendance[person.id]).length} jugadoras sin registrar`,
        route: `/events/${event.id}/attendance`,
        kind: "attendance",
        action: "Registrar",
      })
    if (
      event.state === "IN_PROGRESS" &&
      event.record.state !== "FINAL" &&
      capabilities.sport
    )
      rows.push({
        title: "Falta completar el resultado",
        detail: `${eventName(event)} · ${dateLabel(event.date)}`,
        route: `/events/${event.id}/match-record`,
        kind: "record",
        action: "Completar",
      })
    return rows
  })
  const visibleAttention = attention.slice(0, 3)
  const pendingVas = [...today, ...upcoming].find(
    (event) =>
      event.state === "SCHEDULED" &&
      capabilities.availability &&
      (!event.availability[actor.id] ||
        event.availability[actor.id].revision !== event.revision),
  )
  return (
    <>
      <Header
        eyebrow={todayLabel()}
        title={`Buen día, ${actor.name.split(" ")[0]}`}
        description={
          capabilities.sport
            ? "Este es el día a día de tu equipo. Vamos a lo importante."
            : "Todo lo que necesitás saber para tu día en GEI."
        }
        action={
          (capabilities.sport || capabilities.official) && (
            <Link to="/events/new">
              <Button>
                <Plus size={16} />
                Crear evento
              </Button>
            </Link>
          )
        }
      />
      <div className="mb-7 flex items-center gap-2 text-[11px] text-muted-foreground">
        <span className="rounded-md border border-border bg-card px-2.5 py-1.5 font-medium text-foreground">
          {actor.team ? myTeam?.name : "GEI Hockey"}
        </span>
        <span>Temporada 2026</span>
        <span className="mx-1 size-1 rounded-full bg-border" />
        <span>{labels[actor.role]}</span>
      </div>
      {guardianChildren.length === 1 && (
        <p role="status" className="gei-body mb-5 text-muted-foreground">
          Viendo a {state.people.find((p) => p.id === guardianChildren[0])?.name}
        </p>
      )}
      {guardianChildren.length > 1 && (
        <label className="mb-5 block max-w-xs text-xs font-medium">
          <span className="gei-meta">Viendo a</span>
          <select
            aria-label="Viendo a"
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-[13px]"
            defaultValue={guardianChildren[0]}
          >
            {guardianChildren.map((id) => (
              <option key={id} value={id}>
                {state.people.find((p) => p.id === id)?.name ?? id}
              </option>
            ))}
          </select>
        </label>
      )}
      <div
        className={`grid items-start gap-8 ${
          actor.team ? "xl:grid-cols-[minmax(0,1fr)_300px]" : ""
        }`}
      >
        <div className="space-y-8">
          <Section
            title="Necesita tu atención"
            aside={
              <span className="rounded-md bg-warning-soft px-2 py-0.5 text-[10px] font-semibold text-warning">
                {visibleAttention.length} pendientes
              </span>
            }
          >
            <Surface>
              {visibleAttention.length ? (
                visibleAttention.map((item, index) => (
                  <Link
                    key={index}
                    to={item.route}
                    className="group flex items-center gap-3.5 border-b border-border px-5 py-[18px] last:border-b-0 hover:bg-warning-soft/30"
                  >
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                        item.kind === "time"
                          ? "bg-warning-soft text-warning"
                          : "bg-primary-soft text-primary"
                      }`}
                    >
                      {item.kind === "time" ? (
                        <Clock3 size={17} />
                      ) : item.kind === "attendance" ? (
                        <ClipboardList size={17} />
                      ) : (
                        <AlertCircle size={17} />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-semibold">{item.title}</p>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                    <span className="hidden items-center gap-1 text-[11px] font-semibold text-primary sm:flex">
                      {item.action}
                      <ArrowRight size={13} />
                    </span>
                    <ChevronRight
                      size={15}
                      className="text-muted-foreground sm:hidden"
                    />
                  </Link>
                ))
              ) : (
                <div className="flex items-center gap-3 p-5 text-sm">
                  <CheckCircle2 size={18} className="text-success" />
                  Nada pendiente.
                </div>
              )}
            </Surface>
          </Section>
          {pendingVas && (
            <section aria-label="Responder disponibilidad">
              <VasInline event={pendingVas} />
            </section>
          )}
          <Section
            title="Hoy"
            aside={
              <span className="text-[11px] text-muted-foreground">
                {dateLabel(todayIsoValue)}
              </span>
            }
          >
            {today.length ? (
              <Surface>
                {today.map((event) => (
                  <EventRow key={event.id} event={event} showDate={false} />
                ))}
                <div className="flex items-center gap-2 border-t border-border bg-muted/30 px-5 py-3 text-[10px] text-muted-foreground">
                  <Clock3 size={12} />
                  Tu próxima actividad comienza a las {today[0].time}.
                </div>
              </Surface>
            ) : (
              <Empty
                title="Hoy no hay actividades"
                detail="Podés revisar los próximos eventos de tu equipo."
              />
            )}
          </Section>
          <Section
            title="Próximamente"
            aside={<TextLink to="/calendar">Ver calendario</TextLink>}
          >
            <Surface>
              {upcoming.slice(0, 4).map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </Surface>
          </Section>
          <Section
            title="Comunicaciones recientes"
            aside={<TextLink to="/communication">Ver todas</TextLink>}
          >
            <Surface>
              {state.announcements
                .filter((item) => item.state === "PUBLISHED")
                .slice(0, 2)
                .map((item) => (
                  <RowLink
                    key={item.id}
                    to={`/announcements/${item.id}`}
                    title={item.title}
                    detail={`${item.publisher} · ${dateLabel(item.date)}`}
                    icon={
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Megaphone size={17} />
                      </span>
                    }
                  />
                ))}
            </Surface>
          </Section>
        </div>
        {actor.team && (
          <aside className="space-y-6">
            <Surface>
              <div className="border-b border-border px-5 py-4">
                <span className="text-[10px] font-semibold tracking-[1px] text-muted-foreground">
                  TU EQUIPO
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">
                    6<span className="ml-0.5 text-xs">A</span>
                  </span>
                  <div>
                    <h3 className="text-[16px] font-semibold">
                      {myTeam?.name}
                    </h3>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Temporada 2026
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Users size={14} />
                  <span>{teamRoster.length} jugadoras en el equipo</span>
                </div>
                <div className="mt-4 flex -space-x-1.5">
                  {teamRoster.slice(0, 5).map((person) => (
                    <span
                      key={person.id}
                      className="rounded-full border-2 border-card"
                    >
                      <Avatar name={person.name} size="sm" blue />
                    </span>
                  ))}
                  <span className="flex size-9 items-center justify-center rounded-full border-2 border-card bg-muted text-[9px] text-muted-foreground">
                    +{Math.max(0, teamRoster.length - 5)}
                  </span>
                </div>
                <Link
                  to={`/teams/${actor.team}`}
                  className="mt-5 flex items-center justify-between border-t border-border pt-4 text-[11px] font-semibold text-primary"
                >
                  Ver equipo
                  <ArrowRight size={14} />
                </Link>
              </div>
            </Surface>
            {nextMatch && (
              <div className="rounded-xl border border-primary/10 bg-primary-soft/60 p-5">
                <span className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.8px] text-primary">
                  <FlagIcon />
                  Próximo partido
                </span>
                <h3 className="text-[16px] font-semibold">
                  GEI{" "}
                  <span className="mx-1 font-normal text-muted-foreground">
                    vs.
                  </span>{" "}
                  {nextMatch.opponent}
                </h3>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {nextMatch.competition}
                </p>
                <div className="mt-5 space-y-2.5 text-[11px]">
                  <div className="flex gap-2">
                    <CalendarDays size={14} className="text-primary" />
                    {dateLabel(nextMatch.date)}
                  </div>
                  <div className="flex gap-2">
                    <Clock3 size={14} className="text-primary" />
                    {nextMatch.time} h
                  </div>
                  <div className="flex gap-2">
                    <MapPin size={14} className="shrink-0 text-primary" />
                    {nextMatch.venue}
                  </div>
                </div>
                <div className="mt-5">
                  <TextLink to={`/events/${nextMatch.id}`}>
                    Abrir partido
                  </TextLink>
                </div>
              </div>
            )}
            {captain && (
              <div className="px-1">
                <h3 className="mb-4 text-[12px] font-semibold">En el equipo</h3>
                <div className="flex items-center gap-3">
                  <Avatar name={captain.name} size="sm" />
                  <div>
                    <p className="text-[11px] font-medium">{captain.name}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Capitana · {myTeam?.name}
                    </p>
                  </div>
                  <Link
                    to="/conversations/c2"
                    aria-label="Abrir conversación con Victoria"
                    className="ml-auto text-muted-foreground"
                  >
                    <MessageIcon />
                  </Link>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </>
  )
}
function FlagIcon() {
  return <CalendarDays size={14} />
}
function MessageIcon() {
  return <Users size={16} />
}

export function Calendar() {
  const { state, capabilities, actor } = useProduct()
  const now = new Date(`${todayIso()}T12:00:00`)
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())
  const [team, setTeam] = useState(actor.team || "all")
  const [type, setType] = useState("all")
  const [view, setView] = useState("agenda")
  const events = state.events.filter(
    (event) =>
      event.state !== "DRAFT" &&
      (event.team === actor.team || event.clubWide || capabilities.official) &&
      (team === "all" || event.team === team || event.clubWide) &&
      (type === "all" || event.type === type) &&
      event.date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`),
  )
  const title = new Date(year, month, 1).toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  })
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7
  const days = new Date(year, month + 1, 0).getDate()
  function move(delta: number) {
    const date = new Date(year, month + delta, 1)
    setMonth(date.getMonth())
    setYear(date.getFullYear())
  }
  return (
    <>
      <Header
        eyebrow="Temporada 2026"
        title="Calendario"
        description="Entrenamientos, partidos y actividades del club."
        action={
          (capabilities.sport || capabilities.official) && (
            <Link to="/events/new">
              <Button>
                <Plus size={15} />
                Crear evento
              </Button>
            </Link>
          )
        }
      />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <IconButton label="Mes anterior" onClick={() => move(-1)}>
            <ChevronLeft size={18} />
          </IconButton>
          <h2 className="min-w-36 text-sm font-semibold capitalize">{title}</h2>
          <IconButton label="Mes siguiente" onClick={() => move(1)}>
            <ChevronRight size={18} />
          </IconButton>
          <Button
            variant="secondary"
            onClick={() => {
              setMonth(now.getMonth())
              setYear(now.getFullYear())
            }}
          >
            Hoy
          </Button>
        </div>
        <div className="flex gap-2">
          <div className="w-32">
            <Select
              label="Equipo"
              value={team}
              onChange={(event) => setTeam(event.target.value)}
            >
              <option value="all">Todos</option>
              {state.teams
                .filter(
                  (item) => item.id === actor.team || capabilities.official,
                )
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </Select>
          </div>
          <div className="w-36">
            <Select
              label="Tipo"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="all">Todos</option>
              <option value="TRAINING">Entrenamientos</option>
              <option value="MATCH">Partidos</option>
              <option value="CLUB_EVENT">Club</option>
            </Select>
          </div>
        </div>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" />
            Partido
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-success" />
            Entrenamiento
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-warning" />
            Club
          </span>
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
          <IconButton label="Mes" onClick={() => setView("month")}>
            <Grid3X3 size={16} />
          </IconButton>
          <IconButton label="Agenda" onClick={() => setView("agenda")}>
            <List size={16} />
          </IconButton>
        </div>
      </div>
      <Surface className={`${view === "month" ? "hidden md:block" : "hidden"}`}>
        <div className="grid grid-cols-7 border-b border-border bg-muted/40">
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
            <div
              key={day}
              className="py-3 text-center text-xs text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from(
            { length: Math.ceil((firstDay + days) / 7) * 7 },
            (_, index) => {
              const day = index - firstDay + 1
              const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              const valid = day > 0 && day <= days
              return (
                <div
                  key={index}
                  className={`min-h-28 border-b border-r border-border p-2 ${
                    valid ? "bg-card" : "bg-muted/40"
                  }`}
                >
                  <span
                    className={`mb-2 flex size-6 items-center justify-center rounded-full text-[11px] ${
                      date === todayIso()
                        ? "bg-primary font-semibold text-white"
                        : "text-muted-foreground"
                    }`}
                  >
                    {valid ? day : ""}
                  </span>
                  {events
                    .filter((event) => event.date === date)
                    .map((event) => (
                      <Link
                        key={event.id}
                        to={`/events/${event.id}`}
                        className={`mb-1 block rounded-md border-l-2 p-1.5 text-[10px] ${
                          event.state === "CANCELLED"
                            ? "border-danger bg-danger-soft line-through"
                            : event.type === "MATCH"
                              ? "border-primary bg-primary-soft"
                              : "border-success bg-success-soft"
                        }`}
                      >
                        <span className="block font-semibold">
                          {event.time} · {eventName(event)}
                        </span>
                        <span className="mt-0.5 block opacity-65">
                          {event.state === "SCHEDULED"
                            ? event.clubWide
                              ? "Todo hockey"
                              : eventTargetsText(
                                  event,
                                  (id) =>
                                    state.teams.find((t) => t.id === id)?.name ?? "Equipo",
                                )
                            : stateText(event.state)}
                        </span>
                      </Link>
                    ))}
                </div>
              )
            },
          )}
        </div>
      </Surface>
      <div className={view === "month" ? "md:hidden" : ""}>
        {events.length ? (
          <Surface>
            {[...events]
              .sort((first, second) => first.date.localeCompare(second.date))
              .map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
          </Surface>
        ) : (
          <Empty
            title="No hay eventos en este período"
            detail="Cambiá de mes o ajustá los filtros para ver otras actividades."
          />
        )}
      </div>
    </>
  )
}

export function Teams() {
  const { state, actor, capabilities } = useProduct()
  const visible = state.teams.filter(
    (team) =>
      team.id === actor.team ||
      capabilities.management ||
      capabilities.official,
  )
  return (
    <>
      <Header
        eyebrow="Temporada 2026"
        title="Equipos"
        description="La estructura deportiva de tu temporada."
      />
      <Surface>
        {visible.map((team) => (
          <RowLink
            key={team.id}
            to={`/teams/${team.id}`}
            title={`${team.name} 2026`}
            detail={`${team.division} · Línea ${team.line} · ${state.people.filter((person) => person.team === team.id && ["PLAYER", "CAPTAIN"].includes(person.role)).length} jugadoras`}
            icon={
              <span className="flex size-12 items-center justify-center rounded-lg bg-primary-soft text-base font-bold text-primary">
                {team.line}
              </span>
            }
            aside={<Badge value={team.state} />}
          />
        ))}
      </Surface>
    </>
  )
}
export function TeamDetail() {
  const { teamId } = useParams()
  const { state, actor, capabilities } = useProduct()
  const [tab, setTab] = useState("Equipo")
  const team = state.teams.find((item) => item.id === teamId)
  if (!team)
    return (
      <Empty
        title="Equipo no disponible"
        detail="No encontramos este equipo."
      />
    )
  if (
    actor.team !== team.id &&
    !capabilities.management &&
    !capabilities.official
  )
    return (
      <Empty
        title="Equipo no disponible"
        detail="No tenés acceso a este equipo."
      />
    )
  const people = state.people.filter(
    (person) =>
      person.team === team.id && ["PLAYER", "CAPTAIN"].includes(person.role),
  )
  const events = state.events.filter((event) => event.team === team.id)
  return (
    <>
      <Header
        back="/teams"
        eyebrow="Equipo · Temporada 2026"
        title={team.name}
        description={`${team.division} · Línea ${team.line}`}
        action={
          capabilities.management && (
            <Link to={`/management/teams/${team.id}`}>
              <Button variant="secondary">Administrar equipo</Button>
            </Link>
          )
        }
      />
      <div className="mb-6 flex gap-6 border-b border-border">
        {["Equipo", "Eventos", "Resultados"].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`border-b-2 px-1 pb-3 text-xs font-medium ${
              tab === item
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      {tab === "Equipo" ? (
        <div className="grid gap-7 xl:grid-cols-[1fr_300px]">
          <Section title={`Jugadoras · ${people.length}`}>
            <Surface>
              {people.map((person) => (
                <RowLink
                  key={person.id}
                  to={`/people/${person.id}`}
                  title={person.name}
                  detail={person.role === "CAPTAIN" ? "Capitana" : "Jugadora"}
                  icon={<Avatar name={person.name} />}
                  aside={
                    capabilities.sport ||
                    capabilities.official ||
                    capabilities.management ? (
                      <Badge value={deriveEligibility(state.eligibilityConstraints, person.id)} />
                    ) : undefined
                  }
                />
              ))}
            </Surface>
          </Section>
          <div className="space-y-6">
            <Section title="Cuerpo técnico">
              <Surface>
                {state.people
                  .filter((person) =>
                    currentRoles(person).some(
                      (a) => a.role === "COACH" && a.scope === "TEAM" && a.target === team.id,
                    ),
                  )
                  .map((coach) => (
                    <RowLink
                      key={coach.id}
                      to={`/people/${coach.id}`}
                      title={coach.name}
                      detail="Entrenador o entrenadora"
                      icon={<Avatar name={coach.name} blue />}
                    />
                  ))}
                {!state.people.some((person) =>
                  currentRoles(person).some(
                    (a) => a.role === "COACH" && a.scope === "TEAM" && a.target === team.id,
                  ),
                ) && (
                  <p className="p-5 text-xs text-muted-foreground">
                    Sin cuerpo técnico asignado a este equipo.
                  </p>
                )}
              </Surface>
            </Section>
            <Section title="Próximos eventos">
              <Surface>
                {events
                  .filter(
                    (event) =>
                      event.date >= todayIso() && event.state === "SCHEDULED",
                  )
                  .slice(0, 3)
                  .map((event) => (
                    <EventRow key={event.id} event={event} />
                  ))}
              </Surface>
            </Section>
          </div>
        </div>
      ) : tab === "Eventos" ? (
        <Surface>
          {events.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </Surface>
      ) : (
        <Surface>
          {!events.some((event) => event.record.state === "FINAL") && (
            <div className="p-8 text-center">
              <h3 className="text-sm font-semibold">
                Todavía no hay resultados finales
              </h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Los partidos aparecerán acá cuando se finalice su resultado.
              </p>
            </div>
          )}
          {events
            .filter((event) => event.record.state === "FINAL")
            .map((event) => (
              <RowLink
                key={event.id}
                to={`/events/${event.id}`}
                title={eventName(event)}
                detail={`${dateLabel(event.date)} · ${labels[event.record.status]}`}
                aside={
                  <span className="text-xl font-bold tabular-nums">
                    {event.record.gei} – {event.record.opponent}
                  </span>
                }
              />
            ))}
        </Surface>
      )}
    </>
  )
}
export function PersonDetail() {
  const { personId } = useParams()
  const { state, actor, capabilities } = useProduct()
  const person = state.people.find((item) => item.id === personId)
  if (
    !person ||
    (person.team !== actor.team &&
      !capabilities.official &&
      person.id !== actor.id)
  )
    return (
      <Empty
        title="Persona no disponible"
        detail="Esta información no está disponible en tu contexto."
      />
    )
  return (
    <>
      <Header
        back={`/teams/${person.team}`}
        title={person.name}
        description={`${labels[person.role]} · ${state.teams.find((team) => team.id === person.team)?.name || "Club"} 2026`}
      />
      <Surface className="max-w-2xl p-6">
        <Avatar name={person.name} size="lg" />
        <div className="mt-5 flex gap-2">
          <Badge value={person.role} />
          {capabilities.sport && <Badge value={deriveEligibility(state.eligibilityConstraints, person.id)} />}
        </div>
        {(capabilities.sport ||
          actor.role === "CAPTAIN" ||
          actor.id === person.id) && (
          <div className="mt-6 space-y-4 text-sm">
            <p className="flex items-center gap-3">
              <Phone size={16} className="text-muted-foreground" />
              {person.phone}
            </p>
            <p className="flex items-center gap-3">
              <Mail size={16} className="text-muted-foreground" />
              {person.email}
            </p>
          </div>
        )}
        <p className="mt-6 text-xs text-muted-foreground">
          Pertenencia vigente · Temporada 2026
        </p>
      </Surface>
    </>
  )
}
export function SearchPage() {
  const { state, actor, capabilities } = useProduct()
  const [query, setQuery] = useState("")
  const search = query.toLocaleLowerCase()
  const people = state.people.filter(
    (item) =>
      (item.team === actor.team ||
        capabilities.management ||
        capabilities.official) &&
      item.name.toLocaleLowerCase().includes(search),
  )
  const teams = state.teams.filter(
    (item) =>
      (item.id === actor.team ||
        capabilities.management ||
        capabilities.official) &&
      item.name.toLocaleLowerCase().includes(search),
  )
  const events = state.events.filter(
    (item) =>
      (item.team === actor.team || item.clubWide || capabilities.official) &&
      eventName(item).toLocaleLowerCase().includes(search),
  )
  return (
    <>
      <Header
        title="Buscar"
        description="Personas, equipos y eventos dentro de tu alcance."
      />
      <div className="mb-7 max-w-2xl">
        <TextField
          label="Buscar en GEI"
          autoFocus
          placeholder="Nombre, equipo o partido…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {query ? (
        <div className="max-w-3xl space-y-6">
          <Section title="Personas">
            <Surface>
              {people.map((person) => (
                <RowLink
                  key={person.id}
                  to={
                    capabilities.management
                      ? `/management/people/${person.id}`
                      : `/people/${person.id}`
                  }
                  title={person.name}
                  detail={`PERSONA · ${state.teams.find((team) => team.id === person.team)?.name || "Club"}`}
                  icon={<Avatar name={person.name} />}
                />
              ))}
              {!people.length && (
                <p className="p-5 text-xs text-muted-foreground">
                  No encontramos personas con ese nombre.
                </p>
              )}
            </Surface>
          </Section>
          <Section title="Equipos">
            <Surface>
              {teams.map((team) => (
                <RowLink
                  key={team.id}
                  to={`/teams/${team.id}`}
                  title={team.name}
                  detail="EQUIPO · Temporada 2026"
                />
              ))}
              {!teams.length && (
                <p className="p-5 text-xs text-muted-foreground">
                  No hay equipos que coincidan.
                </p>
              )}
            </Surface>
          </Section>
          <Section title="Eventos">
            <Surface>
              {events.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
              {!events.length && (
                <p className="p-5 text-xs text-muted-foreground">
                  No hay eventos que coincidan.
                </p>
              )}
            </Surface>
          </Section>
        </div>
      ) : (
        <Empty
          title="¿Qué estás buscando?"
          detail="Escribí un nombre, un equipo o un rival para encontrarlo rápidamente."
        />
      )}
    </>
  )
}
