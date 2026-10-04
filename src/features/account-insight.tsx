import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router"
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  KeyRound,
  LogOut,
  ShieldCheck,
  Users,
} from "lucide-react"
import { useProduct } from "../mock/store"
import { todayIso } from "../mock/clock"
import {
  dateLabel,
  dateTimeLabel,
  eventName,
  periodLabel,
  relativeLabel,
  teamName,
  type Event,
} from "../mock/model"
import {
  activeGuardianRelations,
  activeMemberships,
  activeRoleAssignments,
  activeTeamAssignments,
  guardiansOf,
  membershipOf,
  profileCompleteness,
  roleScopeLabel,
  visibleEvents,
} from "../mock/derive"
import {
  Avatar,
  Banner,
  Button,
  Empty,
  Expander,
  KeyValue,
  RowLink,
  RowStatic,
  Select,
  Sheet,
  StateBadge,
  Surface,
  Tag,
  TextField,
  cx,
} from "../shared/ui"
import {
  DetailSection,
  HistoryList,
  PageContextHeader,
  SectionHeader,
} from "../shared/patterns"
import { useQueryState } from "../shared/use-query-state"

const ROLE_LABEL: Record<string, string> = {
  PLAYER: "Jugadora",
  CAPTAIN: "Capitana",
  COACH: "Entrenador",
  ADMIN: "Administración",
  SUBCOMMITTEE: "Subcomisión",
}

/* ═══════════════════════════════════════════════════════════════
   MÁS
   ═══════════════════════════════════════════════════════════════ */

export function MorePage() {
  const { authority, state, actor } = useProduct()
  const links: Array<{ to: string; label: string; detail: string; show: boolean }> = [
    {
      to: "/more/profile",
      label: "Mi perfil",
      detail: "Identidad, roles, cuenta y seguridad",
      show: true,
    },
    {
      to: "/reports",
      label: "Informes",
      detail: "Asistencia y rendimiento",
      show: authority.canOpen("reports"),
    },
    {
      to: "/audit",
      label: "Historial de cambios",
      detail: "Quién hizo qué y cuándo",
      show: authority.canOpen("audit"),
    },
    {
      to: "/management/people",
      label: "Personas",
      detail: "Altas, cuentas, roles y habilitación",
      show: authority.canOpen("people"),
    },
    {
      to: "/management/structure",
      label: "Estructura del club",
      detail: "Temporadas, divisiones, líneas y sedes",
      show: authority.canOpen("structure"),
    },
    {
      to: "/management/competitions",
      label: "Competencias",
      detail: "Inscripciones por equipo y por línea",
      show: authority.canOpen("competitions"),
    },
  ]
  const pending = state.jornadas.filter((jornada) =>
    visibleEvents(state, actor.id, null).some((event) =>
      jornada.events.includes(event.id),
    ),
  )

  return (
    <div className="gei-stack-page mx-auto max-w-3xl">
      <PageContextHeader
        context="Más"
        title="Más"
        lead="Todo lo que no es el día a día: informes, administración y tu cuenta."
      />
      <div className="grid gap-1">
        {links
          .filter((link) => link.show)
          .map((link) => (
            <RowLink
              key={link.to}
              to={link.to}
              title={link.label}
              detail={link.detail}
            />
          ))}
      </div>
      {pending.length > 0 && (
        <DetailSection title="Jornadas">
          <div className="grid gap-1">
            {pending.map((jornada) => (
              <RowLink
                key={jornada.id}
                to={`/jornadas/${jornada.id}`}
                title={jornada.name}
                detail={`${jornada.events.length} ${
                  jornada.events.length === 1 ? "partido" : "partidos"
                }`}
              />
            ))}
          </div>
        </DetailSection>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PERFIL — mi identidad y mi acceso al club
   ═══════════════════════════════════════════════════════════════ */

export function ProfilePage() {
  const {
    state,
    actor,
    authority,
    changePassword,
    endOtherSession,
    updateOwnContact,
    logout,
    childId,
  } = useProduct()
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [childSheet, setChildSheet] = useState(false)
  const query = useQueryState()

  const memberships = activeMemberships(state, actor.id)
  const membership = membershipOf(state, actor.id)
  const teams = activeTeamAssignments(state, actor.id)
  const roles = activeRoleAssignments(state, actor.id)
  const completeness = profileCompleteness(actor)
  const relations = activeGuardianRelations(state, actor.id)
  const myGuardians = guardiansOf(state, actor.id)
  const currentSession = actor.sessions.find((session) => session.current)
  const otherSessions = actor.sessions.filter((session) => !session.current)
  const attentionSection = query.get("section")
  void attentionSection

  return (
    <div className="gei-stack-page mx-auto max-w-3xl">
      <PageContextHeader
        context="Mi perfil"
        title={actor.name}
        lead="Quién sos, qué permisos tenés y cómo entrar a tu cuenta."
        action={<Avatar name={actor.name} size="lg" selected />}
      />

      {!completeness.complete && (
        <Banner tone="attention" title="Tu perfil necesita algunos datos para poder ser asignada correctamente">
          <div className="grid gap-1">
            <span className="text-ink-strong">
              No podemos asignarte a un equipo porque faltan datos que administra
              el club:
            </span>
            <ul className="list-disc pl-5">
              {completeness.missing.map((item) => (
                <li key={item.key}>{item.label}</li>
              ))}
            </ul>
          </div>
        </Banner>
      )}

      {relations.length > 0 && (
        <Surface className="grid gap-3">
          <SectionHeader
            title="A quién estás mirando"
            meta={
              relations.length > 1 ? `${relations.length} menores` : undefined
            }
          />
          <ul className="grid gap-1">
            {relations.map((relation) => {
              const child = state.people.find(
                (person) => person.id === relation.childId,
              )
              const active = childId === relation.childId
              return (
                <li key={relation.id}>
                  <button
                    type="button"
                    onClick={() => setChildSheet(true)}
                    className={cx(
                      "gei-target flex w-full items-center gap-3 rounded-control px-3 text-left transition-colors",
                      active ? "bg-selected-soft" : "hover:bg-control",
                    )}
                  >
                    <Avatar name={child?.name ?? "—"} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-body font-semibold text-ink">
                        {child?.name ?? "—"}
                      </span>
                      <span className="gei-meta block">
                        {relation.relation} · ve información:{" "}
                        {relation.canViewChildInfo ? "sí" : "no"} · responde ¿Vas?:{" "}
                        {relation.canRespondAvailability ? "sí" : "no"}
                      </span>
                    </span>
                    {active && <Tag tone="selected">Mirando</Tag>}
                  </button>
                </li>
              )
            })}
          </ul>
        </Surface>
      )}

      <DetailSection title="Identidad">
        <KeyValue
          items={[
            { label: "Nombre", value: actor.name },
            { label: "Nombre de usuario", value: actor.username || "Sin definir" },
            {
              label: "Cuenta",
              value: <StateBadge value={actor.account} emphasis />,
            },
          ]}
        />
      </DetailSection>

      <DetailSection title="Pertenencia" meta="Tu vínculo con el club">
        {memberships.length === 0 ? (
          <Banner tone="attention" title="No tenés una pertenencia vigente">
            <span className="text-ink-strong">
              La pertenencia es el vínculo con el club. Sin ella no podés entrar a
              la temporada. La administra el club.
            </span>
          </Banner>
        ) : (
          <KeyValue
            items={memberships.map((item) => ({
              label: "Vigencia",
              value: periodLabel(item.validFrom, item.validUntil),
            }))}
          />
        )}
        {teams.length > 0 ? (
          <div className="mt-3">
            <p className="gei-meta mb-1">Equipos vigentes</p>
            <ul className="grid gap-1">
              {teams.map((assignment) => (
                <li key={assignment.id}>
                  <RowStatic
                    title={teamName(state, assignment.teamId)}
                    detail={periodLabel(assignment.validFrom, assignment.validUntil)}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="gei-meta mt-3">
            No tenés equipos asignados. La asignación deportiva la hace el club.
          </p>
        )}
      </DetailSection>

      <DetailSection title="Roles y alcance">
        {roles.length === 0 ? (
          <p className="gei-meta">
            {relations.length > 0
              ? "No tenés roles deportivos. Entrás al club para ver la información de los menores a tu cargo."
              : "No tenés roles deportivos vigentes."}
          </p>
        ) : (
          <ul className="grid">
            {roles.map((role) => (
              <li key={role.id}>
                <RowStatic
                  title={ROLE_LABEL[role.role] ?? role.role}
                  detail={`${roleScopeLabel(state, role)} · ${periodLabel(
                    role.validFrom,
                    role.validUntil,
                  )}`}
                />
              </li>
            ))}
          </ul>
        )}
      </DetailSection>

      {myGuardians.length > 0 && (
        <DetailSection title="Personas que pueden actuar por mí">
          <ul className="grid">
            {myGuardians.map((relation) => {
              const guardian = state.people.find(
                (person) => person.id === relation.guardianId,
              )
              return (
                <li key={relation.id}>
                  <RowStatic
                    title={guardian?.name ?? "—"}
                    detail={`${relation.relation} · puede ver tu información: ${
                      relation.canViewChildInfo ? "sí" : "no"
                    } · puede responder tu disponibilidad: ${
                      relation.canRespondAvailability ? "sí" : "no"
                    }`}
                  />
                </li>
              )
            })}
          </ul>
        </DetailSection>
      )}

      <DetailSection
        title="Contacto"
        action={
          <Button variant="secondary" size="sm" onClick={() => setContactOpen(true)}>
            Editar
          </Button>
        }
      >
        <KeyValue
          items={[
            { label: "Correo", value: actor.email || "Sin correo" },
            { label: "Teléfono", value: actor.phone || "Sin teléfono" },
          ]}
        />
      </DetailSection>

      <DetailSection
        title="Seguridad"
        action={
          <Button variant="secondary" size="sm" onClick={() => setPasswordOpen(true)}>
            <KeyRound size={14} aria-hidden />
            Cambiar contraseña
          </Button>
        }
      >
        <div className="grid gap-3">
          <KeyValue
            items={[
              {
                label: "Credencial",
                value: actor.passwordSet ? "Configurada" : "Sin configurar",
              },
              {
                label: "Última actividad",
                value: `${dateTimeLabel(actor.lastActivityAt)} (${relativeLabel(
                  actor.lastActivityAt,
                  new Date(),
                ).toLowerCase()})`,
              },
            ]}
          />
          <div>
            <p className="gei-body-strong">Sesiones activas</p>
            <ul className="mt-2 grid gap-2">
              {currentSession && (
                <li className="flex flex-wrap items-center gap-3 rounded-control border border-selected-line bg-selected-soft px-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="gei-body-strong text-ink">
                      {currentSession.device}
                    </p>
                    <p className="gei-meta">
                      Esta sesión · abierta el {dateTimeLabel(currentSession.createdAt)}
                    </p>
                  </div>
                  <Tag tone="selected">Actual</Tag>
                </li>
              )}
              {otherSessions.map((session) => (
                <li
                  key={session.id}
                  className="flex flex-wrap items-center gap-3 rounded-control border border-line bg-surface px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="gei-body-strong text-ink">{session.device}</p>
                    <p className="gei-meta">
                      Última actividad {relativeLabel(session.lastSeenAt, new Date()).toLowerCase()}
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => endOtherSession(session.id)}
                  >
                    Cerrar sesión
                  </Button>
                </li>
              ))}
              {!currentSession && otherSessions.length === 0 && (
                <li className="gei-meta">No hay sesiones registradas.</li>
              )}
            </ul>
          </div>
        </div>
      </DetailSection>

      {!completeness.complete && (
        <Banner tone="attention" title="Siguiente paso">
          <span className="text-ink-strong">
            Avisale a la administración del club para que complete esos datos.
            Desde tu perfil no se pueden cambiar.
          </span>
        </Banner>
      )}

      <div className="flex flex-wrap gap-2 border-t border-line pt-5">
        <Button variant="danger" onClick={logout}>
          <LogOut size={16} aria-hidden />
          Cerrar sesión
        </Button>
      </div>

      {passwordOpen && (
        <PasswordDialog
          onClose={() => setPasswordOpen(false)}
          onSubmit={(current, next) => changePassword(current, next)}
        />
      )}

      {contactOpen && (
        <ContactDialog
          phone={actor.phone}
          email={actor.email}
          onClose={() => setContactOpen(false)}
          onSubmit={(data) => {
            updateOwnContact(data)
            setContactOpen(false)
          }}
        />
      )}

      {childSheet && (
        <Sheet
          title="Personas a cargo"
          description="Elegí con qué menor querés trabajar."
          onClose={() => setChildSheet(false)}
        >
          <ul className="grid gap-1">
            {relations.map((relation) => {
              const child = state.people.find(
                (person) => person.id === relation.childId,
              )
              return (
                <li key={relation.id}>
                  <RowStatic
                    title={child?.name ?? "—"}
                    detail={`${relation.relation} · responde ¿Vas?: ${
                      relation.canRespondAvailability ? "sí" : "no"
                    }`}
                  />
                </li>
              )
            })}
          </ul>
          <p className="gei-meta mt-3">
            Cambiar de menor se gestiona desde administración. Esta vista es sólo
            de consulta.
          </p>
        </Sheet>
      )}
    </div>
  )
}

function PasswordDialog({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (current: string, next: string) => { ok: boolean; error?: string }
}) {
  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [error, setError] = useState("")
  return (
    <Sheet
      title="Cambiar contraseña"
      description="Necesita al menos 12 caracteres."
      onClose={onClose}
      footer={
        <>
          <Button variant="quiet" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              const result = onSubmit(current, next)
              if (result.ok) onClose()
              else setError(result.error ?? "No pudimos cambiarla.")
            }}
          >
            Cambiar contraseña
          </Button>
        </>
      }
    >
      <div className="grid gap-4">
        <TextField
          label="Contraseña actual"
          type="password"
          value={current}
          error={error && !current ? error : undefined}
          onChange={(event) => {
            setCurrent(event.target.value)
            setError("")
          }}
        />
        <TextField
          label="Contraseña nueva"
          type="password"
          value={next}
          hint="Mínimo 12 caracteres."
          error={error && current ? error : undefined}
          onChange={(event) => {
            setNext(event.target.value)
            setError("")
          }}
        />
      </div>
    </Sheet>
  )
}

function ContactDialog({
  phone,
  email,
  onClose,
  onSubmit,
}: {
  phone: string
  email: string
  onClose: () => void
  onSubmit: (data: { phone: string; email: string }) => void
}) {
  const [form, setForm] = useState({ phone, email })
  const [errors, setErrors] = useState<Record<string, string>>({})
  return (
    <Sheet
      title="Editar contacto"
      onClose={onClose}
      footer={
        <>
          <Button variant="quiet" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              const found: Record<string, string> = {}
              if (!form.phone.trim()) found.phone = "Escribí un teléfono."
              if (!form.email.includes("@")) found.email = "Revisá el correo."
              setErrors(found)
              if (Object.keys(found).length === 0) onSubmit(form)
            }}
          >
            Guardar contacto
          </Button>
        </>
      }
    >
      <div className="grid gap-4">
        <TextField
          label="Teléfono"
          required
          value={form.phone}
          error={errors.phone}
          onChange={(event) =>
            setForm((current) => ({ ...current, phone: event.target.value }))
          }
        />
        <TextField
          label="Correo"
          type="email"
          required
          value={form.email}
          error={errors.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
        />
      </div>
    </Sheet>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ACCESO
   ═══════════════════════════════════════════════════════════════ */

export function LoginPage() {
  const { login } = useProduct()
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  return (
    <main className="mx-auto grid min-h-dvh max-w-md content-center gap-5 px-4">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-control bg-brand text-body-strong text-brand-ink">
          GEI
        </span>
        <div>
          <p className="gei-page-title">GEI Hockey</p>
          <p className="gei-meta">Gimnasia y Esgrima de Ituzaingó</p>
        </div>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (login(username.trim())) navigate("/home")
          else setError("No encontramos esa cuenta activa.")
        }}
        className="grid gap-4"
      >
        <TextField
          label="Nombre de usuario"
          required
          value={username}
          error={error}
          placeholder="vgerg"
          onChange={(event) => {
            setUsername(event.target.value)
            setError("")
          }}
        />
        <Button type="submit" variant="primary">
          Entrar
        </Button>
      </form>
      <p className="gei-meta">
        ¿No tenés cuenta? La administración del club te emite un código de
        activación.
      </p>
    </main>
  )
}

export function ActivatePage() {
  const { state, activateAccount } = useProduct()
  const navigate = useNavigate()
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [ok, setOk] = useState(false)
  return (
    <main className="mx-auto grid min-h-dvh max-w-md content-center gap-5 px-4">
      <PageContextHeader
        context="Activar cuenta"
        title="Activá tu cuenta"
        lead="Usá el código que te dio la administración del club."
      />
      {ok ? (
        <Banner tone="success" title="Cuenta activada">
          <span className="text-ink-strong">
            Ya podés entrar con tu nombre de usuario.
          </span>
        </Banner>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            const result = activateAccount(code.trim())
            if (result.ok) setOk(true)
            else setError(result.error ?? "Ese código no sirve.")
          }}
          className="grid gap-4"
        >
          <TextField
            label="Código de activación"
            required
            value={code}
            error={error}
            placeholder="GEI-1234"
            onChange={(event) => {
              setCode(event.target.value)
              setError("")
            }}
          />
          <Button type="submit" variant="primary">
            Activar cuenta
          </Button>
        </form>
      )}
      {ok && (
        <Button variant="secondary" onClick={() => navigate("/home")}>
          Ir al inicio
        </Button>
      )}
      <p className="gei-meta">
        Cuentas pendientes:{" "}
        {state.people.filter((person) => person.account === "PENDING").length}.
      </p>
    </main>
  )
}

export function NoAccessPage() {
  const { actor, logout } = useProduct()
  return (
    <main className="mx-auto grid min-h-dvh max-w-md content-center gap-5 px-4">
      <PageContextHeader
        context="Sin acceso"
        title="Todavía no tenés acceso al sistema"
        lead="Tu cuenta está activa pero el club todavía no te asignó un rol ni una relación de representación."
      />
      <KeyValue
        items={[
          { label: "Cuenta", value: actor.name },
          {
            label: "Estado",
            value: <StateBadge value={actor.account} emphasis />,
          },
        ]}
      />
      <Banner tone="neutral" title="Qué sigue">
        <span className="text-ink-strong">
          Hablá con la administración del club. En cuanto te asignen, vas a ver
          los destinos que te corresponden.
        </span>
      </Banner>
      <Button variant="secondary" onClick={logout}>
        Cerrar sesión
      </Button>
    </main>
  )
}

/* ═══════════════════════════════════════════════════════════════
   INFORMES — filtros en URL, cero ≠ sin dato, links al origen
   ═══════════════════════════════════════════════════════════════ */

function periodStart(period: string): string {
  const today = todayIso()
  if (period === "month") return `${today.slice(0, 7)}-01`
  if (period === "quarter") {
    const date = new Date(`${today}T12:00:00`)
    date.setMonth(date.getMonth() - 3)
    return date.toISOString().slice(0, 10)
  }
  if (period === "year") return `${today.slice(0, 4)}-01-01`
  return ""
}

function useFilteredEvents() {
  const { state, actor, childId } = useProduct()
  const query = useQueryState()
  const team = query.get("team")
  const period = query.get("period")
  const scoped = visibleEvents(state, actor.id, childId)
  const from = periodStart(period)
  const events = scoped.filter((event) => {
    if (team && !event.targetTeams.includes(team)) return false
    if (from && event.date < from) return false
    return true
  })
  return { events, team, period, query }
}

export function ReportsPage() {
  const { state, authority } = useProduct()
  const { events, team, period, query } = useFilteredEvents()
  const canSee = authority.canOpen("reports")

if (!canSee)
    return (
      <div className="mx-auto max-w-3xl">
        <Empty
          title="No tenés informes disponibles"
          detail="Los informes muestran asistencia y rendimiento según tu alcance."
        />
      </div>
    )

  return (
    <div className="gei-stack-page mx-auto max-w-4xl">
      <PageContextHeader
        context="Informes"
        title="Informes"
        lead="Filtros guardados en la dirección: el botón atrás vuelve al mismo lugar."
      />
      <div className="flex flex-wrap items-end gap-2">
        <Select
          label="Equipo"
          value={team}
          onChange={(event) => query.set({ team: event.target.value })}
          className="min-w-48"
        >
          <option value="">Todos los equipos</option>
          {state.teams.map((item) => (
            <option key={item.id} value={item.id}>
              {teamName(state, item.id)}
            </option>
          ))}
        </Select>
        <Select
          label="Período"
          value={period}
          onChange={(event) => query.set({ period: event.target.value })}
          className="min-w-44"
        >
          <option value="">Todo el histórico</option>
          <option value="year">Esta temporada</option>
          <option value="quarter">Últimos 3 meses</option>
          <option value="month">Este mes</option>
        </Select>
        {(team || period) && (
          <Button variant="quiet" onClick={() => query.reset(["team", "period"])}>
            Quitar filtros
          </Button>
        )}
      </div>

      <div className="grid gap-3">
        <RowLink
          to={`/reports/attendance${team ? `?team=${team}` : ""}${period ? `&period=${period}` : ""}`}
          title="Asistencia"
          detail="Presentes, ausentes y justificadas por evento"
        />
        <RowLink
          to={`/reports/performance${team ? `?team=${team}` : ""}${period ? `&period=${period}` : ""}`}
          title="Rendimiento"
          detail="Resultados y datos por persona"
        />
      </div>

      {events.length === 0 && (
        <Empty
          title="Sin eventos en este período"
          detail="No es un error: simplemente no hay eventos que coincidan con el filtro."
          action={
            (team || period) && (
              <Button variant="secondary" onClick={() => query.reset(["team", "period"])}>
                Quitar filtros
              </Button>
            )
          }
        />
      )}
    </div>
  )
}

export function ReportDetail({ performance = false }: { performance?: boolean }) {
  const { state, authority } = useProduct()
  const { events, team, period, query } = useFilteredEvents()
  if (!authority.canOpen("reports"))
    return (
      <div className="mx-auto max-w-3xl">
        <Empty title="No tenés acceso a los informes" detail="Pedilo a la administración." />
      </div>
    )

  const played = events.filter((event) => event.record.state === "FINAL")
  const withAttendance = events.filter((event) => event.attendanceOpened)

  const people = useMemo(() => {
    const ids = new Set<string>()
    events.forEach((event) => Object.keys(event.attendance).forEach((id) => ids.add(id)))
    return Array.from(ids)
      .map((id) => state.people.find((person) => person.id === id))
      .filter((person): person is NonNullable<typeof person> => !!person)
      .sort((a, b) => a.lastName.localeCompare(b.lastName))
  }, [events, state])

  return (
    <div className="gei-stack-page mx-auto max-w-4xl">
      <PageContextHeader
        context={performance ? "Rendimiento" : "Asistencia"}
        title={performance ? "Informe de rendimiento" : "Informe de asistencia"}
        back="/reports"
        lead={
          events.length === 0
            ? "No hay eventos con estos filtros."
            : `${events.length} ${events.length === 1 ? "evento" : "eventos"} en el período.`
        }
        below={
          <div className="flex flex-wrap items-end gap-2">
            <Select
              label="Equipo"
              value={team}
              onChange={(event) => query.set({ team: event.target.value })}
              className="min-w-48"
            >
              <option value="">Todos los equipos</option>
              {state.teams.map((item) => (
                <option key={item.id} value={item.id}>
                  {teamName(state, item.id)}
                </option>
              ))}
            </Select>
            <Select
              label="Período"
              value={period}
              onChange={(event) => query.set({ period: event.target.value })}
              className="min-w-44"
            >
              <option value="">Todo el histórico</option>
              <option value="year">Esta temporada</option>
              <option value="quarter">Últimos 3 meses</option>
              <option value="month">Este mes</option>
            </Select>
            {(team || period) && (
              <Button variant="quiet" onClick={() => query.reset(["team", "period"])}>
                Quitar filtros
              </Button>
            )}
          </div>
        }
      />

      {events.length === 0 ? (
        <Empty
          title="Nada para mostrar"
          detail="No hay eventos que coincidan con estos filtros. No es que falten datos."
          icon={<FileText size={22} />}
        />
      ) : performance ? (
        <DetailSection title="Resultados" meta={`${played.length} finalizados`}>
          {played.length === 0 ? (
            <p className="gei-meta">
              Ningún evento del período tiene resultado finalizado.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-line-strong">
                    <th scope="col" className="gei-meta px-3 py-2">
                      Evento
                    </th>
                    <th scope="col" className="gei-meta px-3 py-2">
                      Fecha
                    </th>
                    <th scope="col" className="gei-meta px-3 py-2">
                      Resultado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {played.map((event: Event) => (
                    <tr key={event.id} className="border-b border-line last:border-b-0">
                      <td className="px-3 py-2.5">
                        <Link
                          to={`/events/${event.id}/match-record`}
                          className="text-body font-semibold text-interactive hover:underline"
                        >
                          {eventName(event)}
                        </Link>
                      </td>
                      <td className="px-3 py-2.5 text-meta tabular-nums">
                        {dateLabel(event.date)}
                      </td>
                      <td className="px-3 py-2.5 text-body font-semibold tabular-nums">
                        {event.record.gei}–{event.record.opponent}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4">
            <p className="gei-body-strong mb-2">Datos por persona</p>
            <ul className="grid gap-1">
              {people.map((person) => {
                const stats = played
                  .flatMap((event) => [event.record.stats[person.id]])
                  .filter(Boolean)
                const goals = stats.reduce((sum, stat) => sum + (stat?.goals ?? 0), 0)
                const assists = stats.reduce((sum, stat) => sum + (stat?.assists ?? 0), 0)
                const appearances = stats.filter((stat) => stat?.played).length
                return (
                  <li key={person.id}>
                    <RowStatic
                      title={person.name}
                      meta={
                        <span className="text-meta tabular-nums text-ink-muted">
                          {appearances} {appearances === 1 ? "presencia" : "presencias"} ·{" "}
                          {goals} {goals === 1 ? "gol" : "goles"} · {assists}{" "}
                          {assists === 1 ? "asistencia" : "asistencias"}
                        </span>
                      }
                    />
                  </li>
                )
              })}
            </ul>
          </div>
        </DetailSection>
      ) : (
        <DetailSection title="Asistencia por evento" meta={`${withAttendance.length} con planilla`}>
          {withAttendance.length === 0 ? (
            <p className="gei-meta">
              No hay planillas de asistencia abiertas en este período.
            </p>
          ) : (
            <ul className="grid gap-1">
              {withAttendance.map((event) => {
                const values = Object.values(event.attendance)
                const present = values.filter((value) => value === "PRESENT").length
                const absent = values.filter((value) => value === "ABSENT").length
                const justified = values.filter((value) => value === "JUSTIFIED").length
                const recorded = values.length
                const percent = recorded === 0 ? null : Math.round((present / recorded) * 100)
                return (
                  <li key={event.id}>
                    <RowStatic
                      title={eventName(event)}
                      detail={`${dateLabel(event.date)} · ${recorded} ${
                        recorded === 1 ? "registro" : "registros"
                      }`}
                      meta={
                        <span className="text-meta tabular-nums text-ink-muted">
                          {present} presentes · {absent} ausentes · {justified}{" "}
                          justificadas · {percent === null ? "—" : `${percent}%`} presencia
                        </span>
                      }
                      trailing={
                        <Link
                          to={`/events/${event.id}/attendance`}
                          className="gei-target-sm inline-flex items-center gap-1 rounded-control px-2 text-meta font-semibold text-interactive hover:bg-selected-soft"
                        >
                          Ver planilla
                          <ArrowRight size={13} aria-hidden />
                        </Link>
                      }
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </DetailSection>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   HISTORIAL DE CAMBIOS — before/after real, filtro por rango
   ═══════════════════════════════════════════════════════════════ */

export function AuditPage() {
  const { state, authority } = useProduct()
  const query = useQueryState()
  const from = query.get("from")
  const to = query.get("to")
  const actorFilter = query.get("actor")

  if (!authority.canViewAudit)
    return (
      <div className="mx-auto max-w-3xl">
        <Empty
          title="El historial es de administración"
          detail="Sólo la administración del club puede ver quién hizo qué."
        />
      </div>
    )

  const entries = state.audit.filter((entry) => {
    const day = entry.at.slice(0, 10)
    if (from && day < from) return false
    if (to && day > to) return false
    if (actorFilter && entry.actor !== actorFilter) return false
    return true
  })
  const actors = Array.from(new Set(state.audit.map((entry) => entry.actor)))

  return (
    <div className="gei-stack-page mx-auto max-w-4xl">
      <PageContextHeader
        context="Historial"
        title="Historial de cambios"
        lead="Cada cambio queda con autor, fecha, motivo y valor anterior."
        below={
          <div className="flex flex-wrap items-end gap-2">
            <TextField
              label="Desde"
              type="date"
              value={from}
              onChange={(event) => query.set({ from: event.target.value })}
              className="min-w-40"
            />
            <TextField
              label="Hasta"
              type="date"
              value={to}
              onChange={(event) => query.set({ to: event.target.value })}
              className="min-w-40"
            />
            <Select
              label="Persona"
              value={actorFilter}
              onChange={(event) => query.set({ actor: event.target.value })}
              className="min-w-48"
            >
              <option value="">Todas</option>
              {actors.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Select>
            {(from || to || actorFilter) && (
              <Button
                variant="quiet"
                onClick={() => query.reset(["from", "to", "actor"])}
              >
                Quitar filtros
              </Button>
            )}
          </div>
        }
      />

      {entries.length === 0 ? (
        <Empty
          title="No hay cambios en ese rango"
          detail={`El historial tiene ${state.audit.length} movimientos en total. Ajustá las fechas para verlos.`}
          icon={<ShieldCheck size={22} />}
        />
      ) : (
        <Surface flush>
          <HistoryList
            entries={entries.map((entry) => ({
              action: entry.action,
              actor: entry.actor,
              at: dateTimeLabel(entry.at),
              before: entry.before,
              after: entry.after,
              reason: entry.source,
              to: entry.route,
            }))}
          />
        </Surface>
      )}
    </div>
  )
}