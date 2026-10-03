import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import {
  Users,
  Layers3,
  Trophy,
  ShieldCheck,
  Plus,
  Search,
  Pencil,
  Archive,
  UserRound,
  KeyRound,
  ArrowRight,
  ChevronRight,
} from "lucide-react"
import { useProduct, wait } from "../mock/store"
import { roleAssignments, currentRoles, hasRole } from "../mock/permissions"
import { labels, type Person } from "../mock/model"
import { todayIso } from "../mock/clock"
import { deriveEligibility } from "../mock/eligibility"
import {
  Header,
  Surface,
  Section,
  Button,
  Avatar,
  Badge,
  RowLink,
  TextField,
  TextArea,
  Select,
  Alert,
  Empty,
  Modal,
} from "../shared/ui"

export function Restricted() {
  return (
    <Empty
      title="Sección no disponible"
      detail="Tu acceso actual no incluye esta operación. La administración no otorga autoridad deportiva ni acceso a conversaciones privadas."
    />
  )
}
export function ManagementHome() {
  const { capabilities } = useProduct()
  if (!capabilities.management) return <Restricted />
  return (
    <>
      <Header
        eyebrow="Administración"
        title="Gestión de GEI Hockey"
        description="Identidad, accesos y estructura. La operación deportiva tiene su propio alcance."
      />
      <div className="grid max-w-4xl gap-7 md:grid-cols-2">
        <Section title="Organización">
          <Surface>
            <RowLink
              to="/management/structure"
              title="Estructura del club"
              detail="Temporadas, divisiones, líneas y sedes"
              icon={<Layers3 size={20} className="text-primary" />}
            />
            <RowLink
              to="/management/people"
              title="Personas y accesos"
              detail="Pertenencias, asignaciones y cuentas"
              icon={<Users size={20} className="text-primary" />}
            />
            <RowLink
              to="/teams"
              title="Equipos"
              detail="Identidad, roster y asignación de responsables"
              icon={<UserRound size={20} className="text-primary" />}
            />
          </Surface>
        </Section>
        <Section title="Competencia e integridad">
          <Surface>
            <RowLink
              to="/management/competitions"
              title="Competiciones"
              detail="Inscripciones y referencias oficiales manuales"
              icon={<Trophy size={20} className="text-primary" />}
            />
            <RowLink
              to="/audit"
              title="Auditoría"
              detail="Registro inmutable de acciones"
              icon={<ShieldCheck size={20} className="text-primary" />}
            />
          </Surface>
        </Section>
      </div>
    </>
  )
}
export function StructurePage() {
  const { state, capabilities, update, renameVenueMetadata, toast } = useProduct()
  const [tab, setTab] = useState("Temporada")
  const [edit, setEdit] = useState("")
  const [name, setName] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  if (!capabilities.management) return <Restricted />
  function dependency(id: string) {
    const item = state.structure.find((item) => item.id === id)!
    return (
      item.type === "Temporada" ||
      (item.type === "División" &&
        state.teams.some(
          (team) => team.division === item.name && team.state === "ACTIVE",
        )) ||
      (item.type === "Línea" &&
        state.teams.some(
          (team) => team.line === item.name && team.state === "ACTIVE",
        )) ||
      (item.type === "Sede" &&
        state.events.some(
          (event) =>
            event.venue === item.name &&
            ["SCHEDULED", "IN_PROGRESS"].includes(event.state),
        ))
    )
  }
  async function save() {
    if (!name.trim()) return
    if (
      state.structure.some(
        (item) => item.type === tab && item.name === name && item.id !== edit,
      )
    ) {
      setError("Ya existe un elemento con ese nombre.")
      return
    }
    setPending(true)
    await wait()
    if (edit !== "new" && (tab === "División" || tab === "Línea")) {
      const item = state.structure.find((s) => s.id === edit)
      if (item && item.name !== name) {
        const inUse =
          tab === "División"
            ? state.teams.some((t) => t.division === item.name && t.state === "ACTIVE")
            : state.teams.some((t) => t.line === item.name && t.state === "ACTIVE")
        if (inUse) {
          setPending(false)
          setError(
            "La identidad del equipo no cambia por renombrar División/Línea. Para una nueva identidad, creá un nuevo equipo. El nombre histórico se conserva.",
          )
          return
        }
      }
    }
    if (edit !== "new" && tab === "Sede") {
      const venue = state.venues.find((v) => v.id === edit || v.name === state.structure.find((s) => s.id === edit)?.name)
      if (venue) {
        renameVenueMetadata(venue.id, name)
        setPending(false)
        setEdit("")
        toast("Nombre de sede corregido. Los eventos conservan su sede asignada.")
        return
      }
    }
    update(
      (draft) => {
        if (edit === "new")
          draft.structure.push({
            id: crypto.randomUUID(),
            name,
            type: tab,
            archived: false,
          })
        else {
          const item = draft.structure.find((item) => item.id === edit)!
          item.name = name
        }
      },
      "Actualizar estructura",
      name,
    )
    setPending(false)
    setEdit("")
    toast("Estructura guardada")
  }
  return (
    <>
      <Header
        back="/management"
        title="Estructura del club"
        description="Los elementos históricos se conservan. No se eliminan."
        action={
          <Button
            onClick={() => {
              setEdit("new")
              setName("")
              setError("")
            }}
          >
            <Plus size={15} />
            Crear {tab.toLowerCase()}
          </Button>
        }
      />
      <div className="mb-6 flex gap-5 overflow-x-auto border-b border-border">
        {["Temporada", "División", "Línea", "Sede"].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`shrink-0 border-b-2 pb-3 text-xs font-medium ${
              tab === item
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            }`}
          >
            {item === "División"
              ? "Divisiones"
              : item === "Temporada"
                ? "Temporadas"
                : item === "Línea"
                  ? "Líneas"
                  : "Sedes"}
          </button>
        ))}
      </div>
      <Surface>
        {state.structure
          .filter((item) => item.type === tab)
          .map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center gap-3 border-b border-border p-5 last:border-0"
            >
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold">{item.name}</h3>
                {dependency(item.id) && (
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {item.type === "Temporada"
                      ? "Registro histórico · no se archiva"
                      : "Tiene dependencias activas. No se puede archivar."}
                  </p>
                )}
              </div>
              <Badge value={item.archived ? "ARCHIVED" : "ACTIVE"} />
              <Button
                variant="ghost"
                onClick={() => {
                  setEdit(item.id)
                  setName(item.name)
                  setError("")
                }}
              >
                <Pencil size={14} />
                Editar
              </Button>
              {item.type !== "Temporada" && (
                <Button
                  variant="ghost"
                  disabled={item.archived || dependency(item.id)}
                  onClick={async () => {
                    await wait()
                    update(
                      (draft) =>
                        (draft.structure.find(
                          (element) => element.id === item.id,
                        )!.archived = true),
                      "Archivar estructura",
                      item.name,
                    )
                    toast("Elemento archivado")
                  }}
                >
                  <Archive size={14} />
                  Archivar
                </Button>
              )}
            </div>
          ))}
      </Surface>
      {edit && (
        <Modal
          title={`${edit === "new" ? "Crear" : "Editar"} ${tab.toLowerCase()}`}
          onClose={() => setEdit("")}
          footer={
            <>
              <Button variant="secondary" onClick={() => setEdit("")}>
                Volver
              </Button>
              <Button disabled={!name.trim() || pending} onClick={save}>
                {pending ? "Guardando…" : "Guardar"}
              </Button>
            </>
          }
        >
          <TextField
            label="Nombre"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          {error && (
            <div className="mt-3">
              <Alert tone="error">{error}</Alert>
            </div>
          )}
        </Modal>
      )}
    </>
  )
}
export function PeopleManagement() {
  const { state, capabilities } = useProduct()
  const [query, setQuery] = useState("")
  const [team, setTeam] = useState("all")
  const [role, setRole] = useState("all")
  const [status, setStatus] = useState("all")
  if (!capabilities.management) return <Restricted />
  const people = state.people.filter(
    (person) =>
      person.name.toLowerCase().includes(query.toLowerCase()) &&
      (team === "all" || person.team === team) &&
      (role === "all" || person.role === role) &&
      (status === "all" || person.account === status),
  )
  return (
    <>
      <Header
        back="/management"
        title="Personas y accesos"
        description="Datos de identidad, cuentas y relaciones vigentes."
        action={
          <Link to="/management/people/new">
            <Button>
              <Plus size={15} />
              Crear persona
            </Button>
          </Link>
        }
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <TextField
          label="Buscar persona"
          placeholder="Nombre o apellido"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select
          label="Equipo"
          value={team}
          onChange={(event) => setTeam(event.target.value)}
        >
          <option value="all">Todos los equipos</option>
          {state.teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </Select>
        <Select
          label="Rol"
          value={role}
          onChange={(event) => setRole(event.target.value)}
        >
          <option value="all">Todos los roles</option>
          {["PLAYER", "CAPTAIN", "COACH", "SUBCOMMITTEE", "ADMIN"].map(
            (item) => (
              <option key={item} value={item}>
                {labels[item]}
              </option>
            ),
          )}
        </Select>
        <Select
          label="Estado"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="all">Todas las cuentas</option>
          {["ACTIVE", "PENDING", "DISABLED"].map((item) => (
            <option key={item} value={item}>
              {labels[item]}
            </option>
          ))}
        </Select>
      </div>
      {people.length ? (
        <Surface>
          <div className="hidden grid-cols-[1.5fr_1fr_1fr_100px] bg-muted/40 p-4 text-[10px] font-semibold text-muted-foreground md:grid">
            <span>PERSONA</span>
            <span>EQUIPO</span>
            <span>ROL</span>
            <span>CUENTA</span>
          </div>
          {people.map((person) => (
            <Link
              key={person.id}
              to={`/management/people/${person.id}`}
              className="flex items-center gap-3 border-t border-border p-4 hover:bg-primary-soft/40 md:grid md:grid-cols-[1.5fr_1fr_1fr_100px]"
            >
              <span className="flex flex-1 items-center gap-3">
                <Avatar name={person.name} size="sm" />
                <span className="text-xs font-semibold">{person.name}</span>
              </span>
              <span className="hidden text-xs text-muted-foreground md:block">
                {state.teams.find((team) => team.id === person.team)?.name ||
                  "Club"}
              </span>
              <span className="hidden text-xs text-muted-foreground md:block">
                {labels[person.role]}
              </span>
              <Badge value={person.account} />
            </Link>
          ))}
        </Surface>
      ) : (
        <Empty
          title="No encontramos personas"
          detail="Probá con otro nombre o ajustá los filtros."
        />
      )}
    </>
  )
}
export function CreatePerson() {
  const { capabilities, state, update, toast } = useProduct()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    first: "",
    last: "",
    dni: "",
    birth: "",
    phone: "",
    email: "",
  })
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  if (!capabilities.management) return <Restricted />
  async function create() {
    setError("")
    if (form.dni && state.people.some((person) => person.dni === form.dni)) {
      setError("Ya existe una persona con ese DNI.")
      return
    }
    setPending(true)
    await wait()
    const id = crypto.randomUUID()
    update(
      (draft) =>
        draft.people.push({
          id,
          name: `${form.first} ${form.last}`,
          dni: form.dni,
          birth: form.birth,
          phone: form.phone,
          email: form.email,
          team: "",
          role: "PLAYER",
          eligibility: "ELIGIBLE",
          account: "PENDING",
          username: "",
        }),
      "Crear persona",
      `${form.first} ${form.last}`,
    )
    toast("Persona creada. Todavía no tiene equipo ni acceso activo.")
    navigate(`/management/people/${id}`)
  }
  return (
    <>
      <Header
        back="/management/people"
        title="Crear persona"
        description="La identidad existe independientemente del equipo o de la cuenta."
      />
      <form
        onSubmit={(event) => {
          event.preventDefault()
          create()
        }}
      >
        <Surface className="max-w-3xl space-y-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries({
              first: "Nombre",
              last: "Apellido",
              dni: "DNI",
              birth: "Fecha de nacimiento",
              phone: "Teléfono",
              email: "Email",
            }).map(([key, label]) => (
              <TextField
                key={key}
                label={`${label}${["first", "last"].includes(key) ? " *" : ""}`}
                required={["first", "last"].includes(key)}
                type={
                  key === "birth" ? "date" : key === "email" ? "email" : "text"
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
          </div>
          <Alert tone="info">
            Para ingresar al roster como jugadora se requieren todos estos
            campos completos. Crear una persona no asigna automáticamente una
            cuenta, un equipo ni permisos.
          </Alert>
          {error && <Alert tone="error">{error}</Alert>}
          <Button type="submit" disabled={pending}>
            {pending ? "Creando…" : "Crear persona"}
          </Button>
        </Surface>
      </form>
    </>
  )
}
export function PersonAdminDetail() {
  const { id } = useParams()
  const { state, capabilities, update, toast } = useProduct()
  const person = state.people.find((item) => item.id === id)
  const [target, setTarget] = useState(person?.team || "sexta")
  const [operation, setOperation] = useState("")
  const [reason, setReason] = useState("")
  const [username, setUsername] = useState(person?.username || "")
  const [code, setCode] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  const [eligibility, setEligibility] = useState(
    person?.eligibility || "ELIGIBLE",
  )
  const [role, setRole] = useState<Person["role"]>("COACH")
  if (!capabilities.management) return <Restricted />
  if (!person)
    return (
      <Empty
        title="Persona no encontrada"
        detail="Revisá el listado de personas."
      />
    )
  const lastAdmin =
    hasRole(person, "ADMIN") &&
    person.account === "ACTIVE" &&
    state.people.filter(
      (item) => hasRole(item, "ADMIN") && item.account === "ACTIVE",
    ).length === 1
  async function execute() {
    if (!person) return
    setError("")
    if (
      (operation === "Deshabilitar cuenta" ||
        (operation === "Finalizar rol" && role === "ADMIN")) &&
      lastAdmin
    ) {
      setError("Debe permanecer al menos un administrador con cuenta activa.")
      return
    }
    if (
      operation === "Asignar rol" &&
      role === "CAPTAIN" &&
      target !== person.team
    ) {
      setError(
        "La capitana debe pertenecer al equipo en el que se asigna el rol.",
      )
      return
    }
    if (
      operation === "Asignar equipo" &&
      (!person.dni || !person.birth || !person.phone || !person.email)
    ) {
      setError(
        "Perfil de jugadora incompleto. Completá DNI, fecha de nacimiento, teléfono y email antes de asignar equipo.",
      )
      return
    }
    if (
      operation === "Crear acceso" &&
      (!username.trim() ||
        state.people.some(
          (item) =>
            item.username.toLowerCase() === username.toLowerCase() &&
            item.id !== person.id,
        ))
    ) {
      setError("Elegí un usuario único. El usuario no depende del equipo.")
      return
    }
    setPending(true)
    await wait()
    update(
      (draft) => {
        const item = draft.people.find((item) => item.id === id)!
        const today = todayIso()
        if (operation === "Asignar equipo") {
          item.roleAssignments = roleAssignments(item).map((assignment) =>
            ["PLAYER", "CAPTAIN"].includes(assignment.role) &&
            !assignment.validUntil
              ? { ...assignment, validUntil: today }
              : assignment,
          )
          item.roleAssignments.push({
            id: crypto.randomUUID(),
            role: "PLAYER",
            scope: "TEAM",
            target,
            validFrom: today,
            validUntil: null,
          })
          item.team = target
          item.role = "PLAYER"
          const ta = draft.teamAssignments.find((t) => t.personId === item.id && !t.validUntil)
          if (ta) ta.validUntil = today
          draft.teamAssignments.push({ id: crypto.randomUUID(), personId: item.id, teamId: target, validFrom: today, validUntil: null })
        }
        if (operation === "Finalizar pertenencia al equipo") {
          item.roleAssignments = roleAssignments(item).map((assignment) =>
            ["PLAYER", "CAPTAIN"].includes(assignment.role) &&
            !assignment.validUntil
              ? { ...assignment, validUntil: today }
              : assignment,
          )
          item.team = ""
          if (item.role === "CAPTAIN") item.role = "PLAYER"
          const ta = draft.teamAssignments.find((t) => t.personId === item.id && !t.validUntil)
          if (ta) ta.validUntil = today
        }
        if (operation === "Deshabilitar cuenta") item.account = "DISABLED"
        if (operation === "Reactivar cuenta") item.account = "ACTIVE"
        if (
          operation === "Crear acceso" ||
          operation === "Restablecer acceso"
        ) {
          item.username = username || item.username
          item.account = "PENDING"
        }
        if (operation === "Actualizar elegibilidad") {
          const today = todayIso()
          draft.eligibilityConstraints.forEach((c) => {
            if (c.personId === item.id && !c.validUntil) c.validUntil = today
          })
          if (eligibility !== "ELIGIBLE") {
            draft.eligibilityConstraints.push({
              id: crypto.randomUUID(),
              personId: item.id,
              state: eligibility,
              scope: "CLUB",
              scopeRefId: null,
              source: "INTERNAL",
              reason: "ADMIN",
              note: reason || "Actualización administrativa.",
              validFrom: today,
              validUntil: null,
            })
          }
          item.eligibility = eligibility
        }
        if (operation === "Asignar rol") {
          item.roleAssignments = roleAssignments(item)
          item.roleAssignments.push({
            id: crypto.randomUUID(),
            role,
            scope: ["ADMIN", "SUBCOMMITTEE"].includes(role) ? "CLUB" : "TEAM",
            target: ["ADMIN", "SUBCOMMITTEE"].includes(role) ? "club" : target,
            validFrom: todayIso(),
            validUntil: null,
          })
          if (!item.team && role === "COACH") item.team = target
        }
        if (operation === "Finalizar rol")
          item.roleAssignments = roleAssignments(item).map((assignment) =>
            assignment.role === role && !assignment.validUntil
              ? { ...assignment, validUntil: todayIso() }
              : assignment,
          )
      },
      operation,
      person.name,
      reason,
    )
    if (
      [
        "Crear acceso",
        "Restablecer acceso",
        "Generar código de activación",
      ].includes(operation)
    )
      setCode("GEI-2026-4812")
    else setOperation("")
    setPending(false)
    toast("Cambio guardado en el historial")
  }
  return (
    <>
      <Header
        back="/management/people"
        eyebrow="Administración de persona"
        title={person.name}
        description="Identidad, acceso y relaciones. Los cambios conservan la historia."
      />
      <div className="grid items-start gap-7 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Section title="Identidad y contacto">
            <Surface className="grid gap-5 p-6 sm:grid-cols-2">
              {[
                ["DNI", person.dni],
                ["Fecha de nacimiento", person.birth],
                ["Teléfono", person.phone],
                ["Email", person.email],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                  <p className="mt-1.5 break-words text-xs font-medium">
                    {value || "Sin completar"}
                  </p>
                </div>
              ))}
            </Surface>
          </Section>
          <Section title="Pertenencia y equipo">
            <Surface className="space-y-5 p-6">
              <p className="text-xs">
                {person.team
                  ? `${state.teams.find((team) => team.id === person.team)?.name} 2026 · Pertenencia vigente`
                  : "Sin asignación deportiva vigente"}
              </p>
              <Select
                label="Equipo de destino"
                value={target}
                onChange={(event) => setTarget(event.target.value)}
              >
                {state.teams
                  .filter((team) => team.state === "ACTIVE")
                  .map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} 2026
                    </option>
                  ))}
              </Select>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setOperation("Asignar equipo")
                    setError("")
                    setCode("")
                  }}
                >
                  {" "}
                  {person.team ? "Mover de equipo" : "Asignar equipo"}
                </Button>
                {person.team && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setOperation("Finalizar pertenencia al equipo")
                      setCode("")
                    }}
                  >
                    Finalizar pertenencia
                  </Button>
                )}
              </div>
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                Mover termina la asignación y el rol PLAYER anteriores. Si era
                capitana, ese rol finaliza y no se transfiere automáticamente.
              </p>
            </Surface>
          </Section>
          <Section title="Roles y alcance">
            <Surface className="p-6">
              <div className="mb-5 space-y-3">
                {currentRoles(person).map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="flex items-center gap-2">
                      <Badge value={assignment.role} />
                      <span className="text-[10px] text-muted-foreground">
                        {assignment.scope === "CLUB"
                          ? "Club"
                          : assignment.scope === "TEAM"
                            ? state.teams.find(
                                (team) => team.id === assignment.target,
                              )?.name
                            : "Evento"}
                      </span>
                    </span>
                    {assignment.role !== "PLAYER" && (
                      <Button
                        variant="ghost"
                        disabled={assignment.role === "ADMIN" && lastAdmin}
                        onClick={() => {
                          setRole(assignment.role)
                          setOperation("Finalizar rol")
                          setCode("")
                        }}
                      >
                        Finalizar
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Select
                label="Rol a asignar"
                value={role}
                onChange={(event) =>
                  setRole(event.target.value as Person["role"])
                }
              >
                {["CAPTAIN", "COACH", "SUBCOMMITTEE", "ADMIN"].map((value) => (
                  <option key={value} value={value}>
                    {labels[value]}
                  </option>
                ))}
              </Select>
              <Button
                className="mt-3"
                variant="secondary"
                disabled={
                  hasRole(person, role) || (role === "CAPTAIN" && !person.team)
                }
                onClick={() => {
                  setOperation("Asignar rol")
                  setCode("")
                  setError("")
                }}
              >
                Asignar rol
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                Los roles vigentes se combinan. Administración no incluye
                autoridad deportiva. Para entrenadores y capitanas se usa el
                equipo de destino; administración y subcomisión tienen alcance
                de club.
              </p>
            </Surface>
          </Section>
          <Section title="Elegibilidad">
            <Surface className="space-y-4 p-6">
              <Select
                label="Estado operacional"
                value={eligibility}
                onChange={(event) =>
                  setEligibility(event.target.value as Person["eligibility"])
                }
              >
                <option value="ELIGIBLE">
                  Elegible · sin restricciones activas
                </option>
                <option value="PENDING">Pendiente</option>
                <option value="BLOCKED">Bloqueada</option>
              </Select>
              <Button
                variant="secondary"
                onClick={() => {
                  setOperation("Actualizar elegibilidad")
                  setCode("")
                }}
              >
                Actualizar estado
              </Button>
              <p className="text-[10px] text-muted-foreground">
                Fuente manual · Sin datos clínicos. El entrenador sólo ve el
                estado operativo.
              </p>
            </Surface>
          </Section>
        </div>
        <Section title="Cuenta y acceso">
          <Surface className="space-y-5 p-6">
            <Badge value={person.account} />
            <div>
              <p className="text-[10px] text-muted-foreground">Usuario</p>
              <p className="mt-1 text-xs font-semibold">
                {person.username || "Sin acceso creado"}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {!person.username ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setOperation("Crear acceso")
                    setCode("")
                  }}
                >
                  Crear acceso
                </Button>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setOperation("Restablecer acceso")
                      setCode("")
                    }}
                  >
                    Restablecer acceso
                  </Button>
                  {person.account === "PENDING" && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setOperation("Generar código de activación")
                        setCode("")
                      }}
                    >
                      Generar código de activación
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    disabled={lastAdmin}
                    onClick={() => {
                      setOperation(
                        person.account === "DISABLED"
                          ? "Reactivar cuenta"
                          : "Deshabilitar cuenta",
                      )
                      setCode("")
                    }}
                  >
                    {person.account === "DISABLED"
                      ? "Reactivar cuenta"
                      : "Deshabilitar cuenta"}
                  </Button>
                </>
              )}
              {lastAdmin && (
                <p className="text-[10px] text-warning">
                  No se puede deshabilitar al último ADMIN activo.
                </p>
              )}
            </div>
          </Surface>
        </Section>
      </div>
      {operation && (
        <Modal
          title={operation}
          onClose={() => !pending && setOperation("")}
          footer={
            <>
              <Button
                variant="secondary"
                disabled={pending}
                onClick={() => setOperation("")}
              >
                {code ? "Cerrar" : "Volver"}
              </Button>
              {!code && (
                <Button
                  disabled={
                    pending || (!reason.trim() && operation !== "Crear acceso")
                  }
                  onClick={execute}
                >
                  {pending ? "Guardando…" : "Confirmar cambio"}
                </Button>
              )}
            </>
          }
        >
          {code ? (
            <>
              <Alert tone="success">
                Código de activación generado. La cuenta no inicia sesión
                automáticamente.
              </Alert>
              <p className="my-5 rounded-lg bg-muted p-4 text-center font-mono text-lg">
                {code}
              </p>
              <p className="text-xs text-muted-foreground">
                Simulación local · Uso único · Vigencia de 24 horas. Entregalo
                sólo a la persona correspondiente.
              </p>
            </>
          ) : (
            <>
              <p className="mb-4 text-xs">
                Persona: <strong>{person.name}</strong>
                {operation === "Asignar equipo" &&
                  ` → ${state.teams.find((team) => team.id === target)?.name}`}
              </p>
              {operation === "Crear acceso" && (
                <div className="mb-4">
                  <TextField
                    label="Usuario único"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </div>
              )}
              <TextArea
                label="Motivo del cambio"
                value={reason}
                onChange={setReason}
              />
              {error && (
                <div className="mt-4">
                  <Alert tone="error">{error}</Alert>
                </div>
              )}
            </>
          )}
        </Modal>
      )}
    </>
  )
}
export function TeamAdmin() {
  const { id } = useParams()
  const { state, capabilities, update, toast } = useProduct()
  const team = state.teams.find((item) => item.id === id)
  if (!capabilities.management) return <Restricted />
  if (!team)
    return (
      <Empty
        title="Equipo no encontrado"
        detail="Revisá la estructura deportiva."
      />
    )
  const dependencies =
    state.people.some((person) => person.team === id) ||
    state.events.some(
      (event) =>
        event.team === id && ["SCHEDULED", "IN_PROGRESS"].includes(event.state),
    )
  return (
    <>
      <Header
        back="/teams"
        eyebrow="Administración de equipo"
        title={`${team.name} ${team.season}`}
        description={`${team.division} · Línea ${team.line} · Identidad de temporada inmutable`}
        action={<Badge value={team.state} />}
      />
      <div className="max-w-3xl space-y-6">
        <Surface className="space-y-4 p-6">
          <Button
            variant="secondary"
            disabled={team.state === "ARCHIVED" || dependencies}
            onClick={async () => {
              await wait()
              update(
                (draft) =>
                  (draft.teams.find((item) => item.id === id)!.state =
                    team.state === "DRAFT" ? "ACTIVE" : "ARCHIVED"),
                "Cambiar estado equipo",
                team.name,
              )
              toast("Estado del equipo actualizado")
            }}
          >
            {team.state === "DRAFT" ? "Activar equipo" : "Archivar equipo"}
          </Button>
          {dependencies && (
            <Alert>
              No se puede archivar: hay asignaciones o eventos activos. Finalizá
              las dependencias antes de archivar.
            </Alert>
          )}
        </Surface>
        <Section title="Asignaciones vigentes">
          <Surface>
            {state.people
              .filter((person) => person.team === id)
              .map((person) => (
                <RowLink
                  key={person.id}
                  to={`/management/people/${person.id}`}
                  title={person.name}
                  detail={labels[person.role]}
                  icon={<Avatar name={person.name} />}
                />
              ))}
          </Surface>
        </Section>
        <Link to="/management/people">
          <Button variant="secondary">Gestionar asignaciones</Button>
        </Link>
      </div>
    </>
  )
}
export function CompetitionsPage() {
  const { id } = useParams()
  const { state, capabilities, update, toast } = useProduct()
  const [create, setCreate] = useState(false)
  const [name, setName] = useState("")
  const [organizer, setOrganizer] = useState("")
  const [pending, setPending] = useState(false)
  const [newEntry, setNewEntry] = useState(false)
  const [team, setTeam] = useState("sexta")
  const [reference, setReference] = useState("")
  const [scope, setScope] = useState("TEAM")
  const [ending, setEnding] = useState("")
  const competition = state.competitions.find((item) => item.id === id)
  const mutate = capabilities.management || capabilities.official
  if (!mutate && !capabilities.sport) return <Restricted />
  async function createCompetition() {
    setPending(true)
    await wait()
    update(
      (draft) =>
        draft.competitions.push({
          id: crypto.randomUUID(),
          name,
          organizer,
          state: "DRAFT",
          entries: [],
        }),
      "Crear competencia",
      name,
    )
    setPending(false)
    setCreate(false)
    toast("Competencia creada como borrador")
  }
  return (
    <>
      <Header
        back={
          id
            ? "/management/competitions"
            : capabilities.management
              ? "/management"
              : "/more"
        }
        title={competition?.name || "Competiciones"}
        description={
          competition?.organizer ||
          "Inscripciones y contexto de competencia. Referencias federativas manuales."
        }
        action={
          !id &&
          mutate && (
            <Button onClick={() => setCreate(true)}>
              <Plus size={15} />
              Crear competencia
            </Button>
          )
        }
      />
      {!id ? (
        <Surface>
          {state.competitions.map((item) => (
            <RowLink
              key={item.id}
              to={`/management/competitions/${item.id}`}
              title={item.name}
              detail={item.organizer}
              icon={<Trophy size={20} className="text-primary" />}
              aside={<Badge value={item.state} />}
            />
          ))}
        </Surface>
      ) : competition ? (
        <div className="max-w-4xl space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Badge value={competition.state} />
            {mutate && competition.state === "DRAFT" && (
              <Button
                onClick={async () => {
                  await wait()
                  update(
                    (draft) =>
                      (draft.competitions.find(
                        (item) => item.id === id,
                      )!.state = "ACTIVE"),
                    "Activar competencia",
                    competition.name,
                  )
                }}
              >
                Activar competencia
              </Button>
            )}
            {mutate && competition.state === "ACTIVE" && (
              <Button
                variant="secondary"
                disabled={competition.entries.some(
                  (entry) => entry.state === "ACTIVE",
                )}
                onClick={async () => {
                  await wait()
                  update(
                    (draft) =>
                      (draft.competitions.find(
                        (item) => item.id === id,
                      )!.state = "CLOSED"),
                    "Cerrar competencia",
                    competition.name,
                  )
                  toast("Competencia cerrada")
                }}
              >
                Cerrar competencia
              </Button>
            )}
          </div>
          {competition.entries.some((entry) => entry.state === "ACTIVE") &&
            mutate && (
              <Alert tone="info">
                Para cerrar la competencia deben finalizar todas sus
                inscripciones activas.
              </Alert>
            )}
          <Section
            title="Inscripciones"
            aside={
              mutate &&
              competition.state !== "CLOSED" && (
                <Button variant="secondary" onClick={() => setNewEntry(true)}>
                  <Plus size={14} />
                  Crear inscripción
                </Button>
              )
            }
          >
            <Surface>
              {competition.entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-wrap items-center gap-3 border-b border-border p-5 last:border-0"
                >
                  <div className="flex-1">
                    <p className="text-xs font-semibold">
                      {entry.scope === "LINE"
                        ? `Línea ${entry.team}`
                        : state.teams.find((team) => team.id === entry.team)
                            ?.name}{" "}
                      · 2026
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {entry.reference || "Sin referencia externa"}
                    </p>
                  </div>
                  <Badge value={entry.state} />
                  {mutate && entry.state === "PENDING" && (
                    <Button
                      variant="secondary"
                      onClick={async () => {
                        await wait()
                        update(
                          (draft) =>
                            (draft.competitions
                              .find((item) => item.id === id)!
                              .entries.find(
                                (item) => item.id === entry.id,
                              )!.state = "ACTIVE"),
                          "Activar inscripción",
                          competition.name,
                        )
                      }}
                    >
                      Activar
                    </Button>
                  )}
                  {mutate && entry.state === "ACTIVE" && (
                    <Button variant="ghost" onClick={() => setEnding(entry.id)}>
                      Finalizar inscripción
                    </Button>
                  )}
                </div>
              ))}
              {!competition.entries.length && (
                <p className="p-6 text-xs text-muted-foreground">
                  Esta competencia todavía no tiene inscripciones.
                </p>
              )}
            </Surface>
          </Section>
        </div>
      ) : (
        <Empty
          title="Competencia no encontrada"
          detail="Revisá el listado de competiciones."
        />
      )}
      {create && (
        <Modal
          title="Crear competencia"
          onClose={() => setCreate(false)}
          footer={
            <Button
              disabled={!name || !organizer || pending}
              onClick={createCompetition}
            >
              {pending ? "Creando…" : "Crear borrador"}
            </Button>
          }
        >
          <div className="space-y-4">
            <TextField
              label="Nombre"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <TextField
              label="Organizador"
              value={organizer}
              onChange={(event) => setOrganizer(event.target.value)}
            />
          </div>
        </Modal>
      )}
      {newEntry && competition && (
        <Modal
          title="Crear inscripción"
          onClose={() => setNewEntry(false)}
          footer={
            <Button
              disabled={pending}
              onClick={async () => {
                setPending(true)
                await wait()
                update(
                  (draft) =>
                    draft.competitions
                      .find((item) => item.id === id)!
                      .entries.push({
                        id: crypto.randomUUID(),
                        scope: scope as "TEAM" | "LINE",
                        team: scope === "LINE" ? team : team,
                        state: "PENDING",
                        reference,
                      }),
                  "Crear inscripción",
                  competition.name,
                )
                setPending(false)
                setNewEntry(false)
                toast("Inscripción creada como Pendiente")
              }}
            >
              Crear inscripción
            </Button>
          }
        >
          <div className="space-y-4">
            <Select
              label="Alcance"
              value={scope}
              onChange={(event) => {
                setScope(event.target.value)
                setTeam(event.target.value === "LINE" ? "A" : "sexta")
              }}
            >
              <option value="TEAM">Equipo</option>
              <option value="LINE">Línea</option>
            </Select>
            <Select
              label={scope === "TEAM" ? "Equipo" : "Línea"}
              value={team}
              onChange={(event) => setTeam(event.target.value)}
            >
              {scope === "TEAM"
                ? state.teams.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} 2026
                    </option>
                  ))
                : state.structure
                    .filter((item) => item.type === "Línea")
                    .map((item) => <option key={item.id}>{item.name}</option>)}
            </Select>
            <TextField
              label="Referencia externa manual"
              value={reference}
              onChange={(event) => setReference(event.target.value)}
            />
          </div>
        </Modal>
      )}
      {ending && competition && (
        <Modal
          title="Finalizar inscripción"
          onClose={() => setEnding("")}
          footer={
            <>
              <Button variant="secondary" onClick={() => setEnding("")}>
                Volver
              </Button>
              <Button
                disabled={pending}
                onClick={async () => {
                  setPending(true)
                  await wait()
                  update(
                    (draft) =>
                      (draft.competitions
                        .find((item) => item.id === id)!
                        .entries.find((item) => item.id === ending)!.state =
                        "ENDED"),
                    "Finalizar inscripción",
                    competition.name,
                  )
                  setPending(false)
                  setEnding("")
                  toast(
                    "Inscripción finalizada. El contexto histórico se conserva.",
                  )
                }}
              >
                Confirmar finalización
              </Button>
            </>
          }
        >
          <p className="text-xs leading-relaxed">
            La inscripción no podrá usarse en nuevos partidos. Los partidos que
            ya la referencian conservan su contexto histórico.
          </p>
        </Modal>
      )}
    </>
  )
}
