import { useEffect, useState } from "react"
import { Link, useNavigate, Navigate } from "react-router"
import {
  UserRound,
  BarChart3,
  ShieldCheck,
  LogOut,
  Trophy,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  Users,
} from "lucide-react"
import { useProduct, wait } from "../mock/store"
import { labels, dateLabel } from "../mock/model"
import {
  Header,
  Surface,
  Section,
  Button,
  Avatar,
  RowLink,
  TextField,
  TextArea,
  Select,
  Alert,
  Empty,
  Modal,
} from "../shared/ui"
import { Restricted } from "./management"

export function MorePage() {
  const { capabilities, actor } = useProduct()
  return (
    <>
      <Header
        title="Más"
        description="Tu perfil y las herramientas de tu alcance."
      />
      <Surface className="max-w-3xl">
        <RowLink
          to="/more/profile"
          title="Mi perfil"
          detail={`${actor.name} · ${labels[actor.role]}`}
          icon={<UserRound size={20} className="text-primary" />}
        />
        {capabilities.report && (
          <RowLink
            to="/reports"
            title="Reportes"
            detail="Asistencia y rendimiento"
            icon={<BarChart3 size={20} className="text-primary" />}
          />
        )}
        {capabilities.management && (
          <RowLink
            to="/management"
            title="Administración"
            detail="Personas, estructura y accesos"
            icon={<ShieldCheck size={20} className="text-primary" />}
          />
        )}
        {(capabilities.sport || capabilities.official) && (
          <RowLink
            to="/management/competitions"
            title="Competiciones"
            detail="Contexto e inscripciones vigentes"
            icon={<Trophy size={20} className="text-primary" />}
          />
        )}
        {(capabilities.sport || capabilities.official) && (
          <RowLink
            to="/jornadas/j1"
            title="Jornadas"
            detail="Coordinación de partidos"
            icon={<Users size={20} className="text-primary" />}
          />
        )}
        {capabilities.management && (
          <RowLink
            to="/audit"
            title="Auditoría"
            detail="Historial inmutable de acciones"
            icon={<ShieldCheck size={20} className="text-primary" />}
          />
        )}
        <RowLink
          to="/login"
          title="Cerrar sesión"
          detail="Volver a la pantalla de ingreso"
          icon={<LogOut size={20} className="text-muted-foreground" />}
        />
      </Surface>
    </>
  )
}
export function ProfilePage() {
  const { actor, state, update, toast } = useProduct()
  const [edit, setEdit] = useState("")
  const [phone, setPhone] = useState(actor.phone)
  const [email, setEmail] = useState(actor.email)
  const [current, setCurrent] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  async function save() {
    setError("")
    if (
      edit === "password" &&
      (!current ||
        password.length < 12 ||
        password.length > 128 ||
        password !== confirm)
    ) {
      setError(
        "Ingresá la contraseña actual y una nueva de 12 a 128 caracteres. La confirmación debe coincidir.",
      )
      return
    }
    setPending(true)
    await wait()
    if (edit === "contact")
      update(
        (draft) => {
          const person = draft.people.find((item) => item.id === actor.id)!
          person.phone = phone
          person.email = email
        },
        "Editar contacto propio",
        actor.name,
      )
    setPending(false)
    setEdit("")
    toast(
      edit === "contact"
        ? "Contacto actualizado"
        : "Contraseña actualizada en esta simulación local",
    )
  }
  return (
    <>
      <Header
        back="/more"
        title="Mi perfil"
        description="Tus datos de contacto y tu acceso a GEI Hockey."
      />
      <Surface className="max-w-3xl p-6">
        <div className="flex items-center gap-5">
          <Avatar name={actor.name} size="lg" blue />
          <div>
            <h2 className="text-lg font-semibold">{actor.name}</h2>
            <p className="mt-2 text-xs text-muted-foreground">
              {labels[actor.role]}
              {actor.team
                ? ` · ${state.teams.find((team) => team.id === actor.team)?.name} 2026`
                : " · Club"}
            </p>
          </div>
        </div>
        <dl className="mt-7 grid gap-6 border-t border-border pt-6 text-xs sm:grid-cols-2">
          {[
            ["Usuario", actor.username],
            ["Email", actor.email],
            ["Teléfono", actor.phone],
            [
              "Contexto",
              actor.team ? "Pertenencia vigente · 2026" : "Acceso de club",
            ],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[10px] text-muted-foreground">{label}</dt>
              <dd className="mt-2 font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              setEdit("contact")
              setError("")
            }}
          >
            Editar contacto
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setEdit("password")
              setError("")
            }}
          >
            <KeyRound size={14} />
            Cambiar contraseña
          </Button>
        </div>
      </Surface>
      {edit && (
        <Modal
          title={edit === "contact" ? "Editar contacto" : "Cambiar contraseña"}
          onClose={() => !pending && setEdit("")}
          footer={
            <>
              <Button variant="secondary" onClick={() => setEdit("")}>
                Volver
              </Button>
              <Button disabled={pending} onClick={save}>
                {pending ? "Guardando…" : "Guardar cambios"}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            {edit === "contact" ? (
              <>
                <TextField
                  label="Teléfono"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </>
            ) : (
              <>
                <TextField
                  label="Contraseña actual"
                  type="password"
                  value={current}
                  onChange={(event) => setCurrent(event.target.value)}
                />
                <TextField
                  label="Nueva contraseña"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <TextField
                  label="Confirmar nueva contraseña"
                  type="password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Entre 12 y 128 caracteres. Podés usar espacios.
                </p>
              </>
            )}
            {error && <Alert tone="error">{error}</Alert>}
          </div>
        </Modal>
      )}
    </>
  )
}
export function LoginPage() {
  const { login, state, logout } = useProduct()
  const navigate = useNavigate()
  const [username, setUsername] = useState("tomas.beltran")
  const [password, setPassword] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  useEffect(() => {
    logout()
  }, [])
  async function submit() {
    setPending(true)
    setError("")
    await wait()
    const person = state.people.find(
      (item) => item.username === username || item.id === username,
    )
    if (!password || !login(username)) {
      setError(
        "No pudimos ingresar. Revisá tu usuario y contraseña o consultá con administración.",
      )
      setPending(false)
      return
    }
    navigate(
      person?.team || ["ADMIN", "SUBCOMMITTEE"].includes(person?.role || "")
        ? person?.role === "ADMIN"
          ? "/management"
          : "/home"
        : "/no-access",
    )
  }
  return (
    <PublicFrame>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Ingresar</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tu equipo, en un mismo lugar.
        </p>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
        className="space-y-5"
      >
        <TextField
          label="Usuario"
          autoComplete="username"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <TextField
          label="Contraseña"
          autoComplete="current-password"
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error && <Alert tone="error">{error}</Alert>}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Ingresando…" : "Ingresar"}
          <ArrowRight size={15} />
        </Button>
      </form>
      <div className="mt-7 border-t border-border pt-6 text-center text-xs">
        <span className="text-muted-foreground">¿Es tu primera vez?</span>
        <Link to="/activate" className="ml-2 font-semibold text-primary">
          Activar cuenta
        </Link>
      </div>
      <details className="mt-7 text-[10px] text-muted-foreground">
        <summary className="cursor-pointer">
          Información de la demostración local
        </summary>
        <p className="mt-3 leading-relaxed">
          Usá tomas.beltran (entrenador), mariana.costa (administración),
          carolina.sanchez (subcomisión) o jugadora2 (jugadora). Ingresá
          cualquier contraseña no vacía. No se envían ni almacenan credenciales.
        </p>
      </details>
    </PublicFrame>
  )
}
function PublicFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-5 py-12">
      <div className="w-full max-w-sm">
        <Link
          to="/login"
          className="mb-10 flex items-center justify-center gap-3"
        >
          <span className="flex size-11 items-center justify-center rounded-lg bg-primary text-lg font-bold text-white">
            GEI
          </span>
          <span>
            <span className="block text-lg font-bold">GEI Hockey</span>
            <span className="mt-0.5 block text-[9px] uppercase tracking-[1.2px] text-muted-foreground">
              Gestión deportiva
            </span>
          </span>
        </Link>
        <Surface className="p-7">{children}</Surface>
        <p className="mt-7 text-center text-[10px] text-muted-foreground">
          Gimnasia y Esgrima de Ituzaingó · Hockey
        </p>
      </div>
    </div>
  )
}
export function ActivatePage() {
  const { state, update } = useProduct()
  const [form, setForm] = useState({
    username: "",
    code: "",
    password: "",
    confirm: "",
  })
  const [complete, setComplete] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  async function activate() {
    setError("")
    const person = state.people.find((item) => item.username === form.username)
    if (
      !person ||
      person.account !== "PENDING" ||
      form.code !== "GEI-2026-4812"
    ) {
      setError(
        "El usuario o el código de activación no son válidos. Consultá con administración.",
      )
      return
    }
    if (
      form.password.length < 12 ||
      form.password.length > 128 ||
      form.password !== form.confirm
    ) {
      setError(
        "Usá entre 12 y 128 caracteres. Las contraseñas deben coincidir.",
      )
      return
    }
    setPending(true)
    await wait()
    update(
      (draft) =>
        (draft.people.find((item) => item.id === person.id)!.account =
          "ACTIVE"),
      "Activar cuenta",
      person.name,
    )
    setPending(false)
    setComplete(true)
  }
  return (
    <PublicFrame>
      {complete ? (
        <div className="space-y-5 text-center">
          <CheckCircle2 className="mx-auto text-success" size={36} />
          <h1 className="text-xl font-semibold">Cuenta activada</h1>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Ya podés ingresar con tu usuario y contraseña.
          </p>
          <Link to="/login">
            <Button className="mt-4 w-full">Ir a Ingresar</Button>
          </Link>
        </div>
      ) : (
        <>
          <h1 className="mb-2 text-xl font-semibold">Activar cuenta</h1>
          <p className="mb-6 text-xs leading-relaxed text-muted-foreground">
            Usá el código que te entregó administración.
          </p>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              activate()
            }}
            className="space-y-4"
          >
            {[
              ["username", "Usuario"],
              ["code", "Código de activación"],
              ["password", "Nueva contraseña"],
              ["confirm", "Confirmar contraseña"],
            ].map(([key, label]) => (
              <TextField
                key={key}
                label={label}
                required
                type={
                  ["password", "confirm"].includes(key) ? "password" : "text"
                }
                value={form[(key as keyof typeof form)]}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    [key]: event.target.value,
                  }))
                }
              />
            ))}
            {error && <Alert tone="error">{error}</Alert>}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Activando…" : "Activar cuenta"}
            </Button>
          </form>
          <Link
            to="/login"
            className="mt-5 block text-center text-xs text-primary"
          >
            Volver a Ingresar
          </Link>
        </>
      )}
    </PublicFrame>
  )
}
export function NoAccessPage() {
  const { authenticated, hasAccess } = useProduct()
  if (!authenticated) return <Navigate to="/login" replace />
  if (hasAccess) return <Navigate to="/home" replace />
  return (
    <PublicFrame>
      <h1 className="text-xl font-semibold">Tu cuenta está activa</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Tu cuenta está activa, pero actualmente no tiene acceso asignado a GEI
        Hockey.
      </p>
      <p className="mt-3 text-xs text-muted-foreground">
        Consultá con administración para revisar tu acceso.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <Link to="/more/profile">
          <Button className="w-full">Mi perfil</Button>
        </Link>
        <Link to="/login">
          <Button variant="secondary" className="w-full">
            Cerrar sesión
          </Button>
        </Link>
      </div>
    </PublicFrame>
  )
}
export function ReportsPage() {
  const { capabilities } = useProduct()
  if (!capabilities.report) return <Restricted />
  return (
    <>
      <Header
        title="Reportes"
        description="Proyecciones de registros reales. Información de sólo lectura."
      />
      <Surface className="max-w-3xl">
        <RowLink
          to="/reports/attendance"
          title="Asistencia"
          detail="Presente, ausente, justificada y sin registrar"
          icon={<Users size={20} className="text-primary" />}
        />
        <RowLink
          to="/reports/performance"
          title="Rendimiento"
          detail="Partidos jugados, goles y asistencias"
          icon={<Trophy size={20} className="text-primary" />}
        />
      </Surface>
    </>
  )
}
export function ReportDetail({
  performance = false,
}: {
  performance?: boolean
}) {
  const { state, actor, capabilities } = useProduct()
  const [team, setTeam] = useState(actor.team || "sexta")
  const [person, setPerson] = useState("all")
  const [period, setPeriod] = useState("all")
  if (!capabilities.report) return <Restricted />
  const people = state.people.filter(
    (item) =>
      item.team === team &&
      ["PLAYER", "CAPTAIN"].includes(item.role) &&
      (person === "all" || item.id === person) &&
      (actor.role !== "PLAYER" || item.id === actor.id),
  )
  const events = state.events.filter(
    (event) =>
      event.team === team &&
      (period === "all" || event.date.startsWith(period)) &&
      (performance ? event.record.state === "FINAL" : event.attendanceOpened),
  )
  return (
    <>
      <Header
        back="/reports"
        eyebrow="Sólo lectura"
        title={performance ? "Rendimiento" : "Asistencia"}
        description={
          performance
            ? "La participación real se obtiene del registro del partido, no de la asistencia."
            : "Sin registrar se mantiene separado de Ausente."
        }
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Select
          label="Equipo"
          value={team}
          onChange={(event) => setTeam(event.target.value)}
        >
          {state.teams
            .filter((item) => capabilities.official || item.id === actor.team)
            .map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} 2026
              </option>
            ))}
        </Select>
        <Select
          label="Período"
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
        >
          <option value="all">Toda la temporada</option>
          <option value="2026-09">Septiembre 2026</option>
          <option value="2026-10">Octubre 2026</option>
        </Select>
        <Select
          label="Jugadora"
          value={person}
          onChange={(event) => setPerson(event.target.value)}
        >
          <option value="all">
            {actor.role === "PLAYER" ? "Mis registros" : "Todas las jugadoras"}
          </option>
          {state.people
            .filter(
              (item) =>
                item.team === team &&
                ["PLAYER", "CAPTAIN"].includes(item.role) &&
                (actor.role !== "PLAYER" || item.id === actor.id),
            )
            .map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
        </Select>
      </div>
      <Surface>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-xs">
            <thead className="bg-muted/40 text-[10px] text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">JUGADORA</th>
                {(performance
                  ? ["PARTIDOS", "GOLES", "ASISTENCIAS"]
                  : [
                      "PRESENTE",
                      "AUSENTE",
                      "JUSTIFICADA",
                      "SIN REGISTRAR",
                      "% PRESENCIA",
                    ]
                ).map((label) => (
                  <th key={label} className="p-4 font-medium">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {people.map((player) => {
                const values = performance
                  ? [
                      events.filter(
                        (event) =>
                          event.record.status === "PLAYED" &&
                          event.record.stats[player.id]?.played,
                      ).length,
                      events.reduce(
                        (sum, event) =>
                          sum + (event.record.stats[player.id]?.goals || 0),
                        0,
                      ),
                      events.reduce(
                        (sum, event) =>
                          sum + (event.record.stats[player.id]?.assists || 0),
                        0,
                      ),
                    ]
                  : [
                      events.filter(
                        (event) => event.attendance[player.id] === "PRESENT",
                      ).length,
                      events.filter(
                        (event) => event.attendance[player.id] === "ABSENT",
                      ).length,
                      events.filter(
                        (event) => event.attendance[player.id] === "JUSTIFIED",
                      ).length,
                      events.filter((event) => !event.attendance[player.id])
                        .length,
                      events.length
                        ? `${Math.round((events.filter((event) => event.attendance[player.id] === "PRESENT").length / events.length) * 100)}%`
                        : "—",
                    ]
                return (
                  <tr key={player.id} className="border-t border-border">
                    <td className="p-4 font-medium">{player.name}</td>
                    {values.map((value, index) => (
                      <td
                        key={index}
                        className="p-4 tabular-nums text-muted-foreground"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="border-t border-border p-4 text-[10px] text-muted-foreground">
          {events.length}{" "}
          {performance
            ? "partidos con resultado final"
            : "planillas abiertas o cerradas"}{" "}
          en el período. Sin registros no se interpreta como cero actividad
          histórica.
        </p>
      </Surface>
    </>
  )
}
export function AuditPage() {
  const { state, capabilities } = useProduct()
  const [actor, setActor] = useState("")
  const [resource, setResource] = useState("")
  const [action, setAction] = useState("")
  const [date, setDate] = useState("")
  if (!capabilities.management) return <Restricted />
  const entries = state.audit.filter(
    (entry) =>
      entry.actor.toLowerCase().includes(actor.toLowerCase()) &&
      entry.resource.toLowerCase().includes(resource.toLowerCase()) &&
      entry.action.toLowerCase().includes(action.toLowerCase()) &&
      (!date ||
        (date === "2026-10-02"
          ? entry.date.startsWith("02 oct")
          : date === "2026-10-01"
            ? entry.date.startsWith("01 oct")
            : date === "2026-09-28"
              ? entry.date.startsWith("28 sep")
              : false)),
  )
  return (
    <>
      <Header
        back="/management"
        title="Auditoría"
        description="Registro inmutable de acciones. No se puede editar ni eliminar."
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <TextField
          label="Actor"
          value={actor}
          onChange={(event) => setActor(event.target.value)}
        />
        <TextField
          label="Recurso"
          value={resource}
          onChange={(event) => setResource(event.target.value)}
        />
        <TextField
          label="Acción"
          value={action}
          onChange={(event) => setAction(event.target.value)}
        />
        <TextField
          label="Fecha"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </div>
      {entries.length ? (
        <Surface>
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="border-b border-border p-5 last:border-0"
            >
              <div className="flex flex-wrap justify-between gap-2">
                <p className="text-xs font-semibold">{entry.action}</p>
                <span className="text-[10px] text-muted-foreground">
                  {entry.date}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {entry.actor} · {entry.resource}
              </p>
              {entry.reason && (
                <p className="mt-2 text-[11px]">Motivo: {entry.reason}</p>
              )}
            </div>
          ))}
        </Surface>
      ) : (
        <Empty
          title="Sin acciones para estos filtros"
          detail="Probá con otro actor, recurso o período."
        />
      )}
    </>
  )
}
