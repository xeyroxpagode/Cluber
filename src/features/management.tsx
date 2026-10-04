import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { Lock, Unlock } from "lucide-react"
import { useProduct } from "../mock/store"
import { todayIso } from "../mock/clock"
import {
  dateLabel,
  dateTimeLabel,
  entryLabel,
  periodLabel,
  teamName,
  type CompetitionEntry,
  type StructureType,
} from "../mock/model"
import {
  activeMemberships,
  activeRoleAssignments,
  activeTeamAssignments,
  guardiansOf,
  membershipOf,
  profileCompleteness,
  roleScopeLabel,
} from "../mock/derive"
import {
  deriveEligibility,
  CONSTRAINT_REASON_LABEL,
  CONSTRAINT_SCOPE_LABEL,
  CONSTRAINT_SOURCE_LABEL,
} from "../mock/eligibility"
import {
  Avatar,
  Banner,
  Button,
  ConfirmDialog,
  Empty,
  Expander,
  FilterChip,
  Modal,
  RowLink,
  RowStatic,
  Select,
  Sheet,
  StateBadge,
  Surface,
  TabBar,
  Tag,
  TextArea,
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

const STRUCTURE_LABEL: Record<StructureType, string> = {
  SEASON: "Temporadas",
  DIVISION: "Divisiones",
  LINE: "Líneas",
  VENUE: "Sedes",
}

/* ═══════════════════════════════════════════════════════════════
   HUB DE ADMINISTRACIÓN
   ═══════════════════════════════════════════════════════════════ */

export function ManagementHome() {
  const { state, authority } = useProduct()
  if (!authority.canOpen("management") && !authority.canOpen("competitions"))
    return (
      <div className="mx-auto max-w-3xl">
        <Empty
          title="La administración es de administración"
          detail="No tenés acceso a estas superficies."
        />
      </div>
    )

  const incomplete = state.people.filter((person) => !profileCompleteness(person).complete)
  const pending = state.people.filter((person) => person.account === "PENDING")

  return (
    <div className="gei-stack-page mx-auto max-w-4xl">
      <PageContextHeader
        context="Administración"
        title={
          authority.canManagePeople
            ? "Administración del club"
            : "Coordinación oficial"
        }
        lead={
          authority.canManagePeople
            ? "Altas de personas, estructura y competencias. Sin operaciones deportivas."
            : "Desde acá gestionás la habilitación para jugar y las competencias. Las cuentas y la estructura las maneja administración."
        }
      />
      {authority.canManagePeople && (incomplete.length > 0 || pending.length > 0) && (
        <Banner tone="attention" title="Hay pendientes de alta">
          <span className="text-ink-strong">
            {incomplete.length > 0 &&
              `${incomplete.length} ${incomplete.length === 1 ? "persona tiene" : "personas tienen"} el perfil incompleto. `}
            {pending.length > 0 &&
              `${pending.length} ${pending.length === 1 ? "cuenta espera" : "cuentas esperan"} activación.`}
          </span>
        </Banner>
      )}
      <div className="grid gap-1">
        <RowLink
          to="/management/people"
          title="Personas"
          detail={
            authority.canManagePeople
              ? `${state.people.length} personas · altas, cuentas, roles y habilitación`
              : `${state.people.length} personas · habilitación para jugar`
          }
        />
        {authority.canOpen("structure") && (
          <RowLink
            to="/management/structure"
            title="Estructura del club"
            detail="Temporadas, divisiones, líneas y sedes"
          />
        )}
        {authority.canOpen("competitions") && (
          <RowLink
            to="/management/competitions"
            title="Competencias"
            detail={`${state.competitions.length} competencias con inscripciones por equipo y por línea`}
          />
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PERSONAS — búsqueda y filtros preservados en la URL
   ═══════════════════════════════════════════════════════════════ */

export function PeopleManagement() {
  const { state, authority } = useProduct()
  const query = useQueryState()
  const q = query.get("q")
  const team = query.get("team")
  const role = query.get("role")
  const account = query.get("account")
  const profileStatus = query.get("profileStatus")
  useRouter()

  if (!authority.canOpen("people"))
    return (
      <div className="mx-auto max-w-3xl">
        <Empty
          title="Las personas las administra el club"
          detail="Pedile a administración si necesitás corregir un dato."
        />
      </div>
    )

  const rows = state.people
    .map((person) => {
      const assignments = activeTeamAssignments(state, person.id)
      const roles = activeRoleAssignments(state, person.id)
      const completeness = profileCompleteness(person)
      return { person, assignments, roles, completeness }
    })
    .filter((row) => {
      if (q && !row.person.name.toLowerCase().includes(q.toLowerCase()))
        return false
      if (team && !row.assignments.some((a) => a.teamId === team)) return false
      if (role && !row.roles.some((r) => r.role === role)) return false
      if (account && row.person.account !== account) return false
      if (profileStatus === "incomplete" && row.completeness.complete) return false
      return true
    })
    .sort((a, b) => a.person.lastName.localeCompare(b.person.lastName))

  const filtersOn = Boolean(q || team || role || account || profileStatus)

  return (
    <div className="gei-stack-page mx-auto max-w-5xl">
      <PageContextHeader
        context="Personas"
        title="Personas"
        lead={`${rows.length} ${
          rows.length === 1 ? "persona" : "personas"
        } ${filtersOn ? "con estos filtros" : "en el club"}`}
        action={
          authority.canManagePeople && (
            <Button variant="primary" onClick={() => go("/management/people/new")}>
              Crear persona
            </Button>
          )
        }
        below={
          <div className="grid gap-3">
            <TextField
              label="Buscar"
              value={q}
              placeholder="Nombre"
              onChange={(event) => query.set({ q: event.target.value })}
            />
            <div className="flex flex-wrap items-end gap-2">
              <Select
                label="Equipo"
                value={team}
                onChange={(event) => query.set({ team: event.target.value })}
                className="min-w-44"
              >
                <option value="">Todos</option>
                {state.teams.map((item) => (
                  <option key={item.id} value={item.id}>
                    {teamName(state, item.id)}
                  </option>
                ))}
              </Select>
              <Select
                label="Rol"
                value={role}
                onChange={(event) => query.set({ role: event.target.value })}
                className="min-w-44"
              >
                <option value="">Todos</option>
                {Object.entries(ROLE_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
              <Select
                label="Cuenta"
                value={account}
                onChange={(event) => query.set({ account: event.target.value })}
                className="min-w-40"
              >
                <option value="">Todas</option>
                <option value="ACTIVE">Activa</option>
                <option value="PENDING">Pendiente</option>
                <option value="DISABLED">Deshabilitada</option>
              </Select>
              <FilterChip
                active={profileStatus === "incomplete"}
                onClick={() =>
                  query.set({
                    profileStatus: profileStatus === "incomplete" ? "" : "incomplete",
                  })
                }
              >
                Perfil incompleto
              </FilterChip>
              {filtersOn && (
                <Button
                  variant="quiet"
                  onClick={() => query.reset(["q", "team", "role", "account", "profileStatus"])}
                >
                  Quitar filtros
                </Button>
              )}
            </div>
          </div>
        }
      />

      {rows.length === 0 ? (
        <Empty
          title="Sin resultados"
          detail={
            filtersOn
              ? "Ninguna persona coincide con estos filtros."
              : "Todavía no hay personas cargadas."
          }
          action={
            filtersOn && (
              <Button
                variant="secondary"
                onClick={() =>
                  query.reset(["q", "team", "role", "account", "profileStatus"])
                }
              >
                Quitar filtros
              </Button>
            )
          }
        />
      ) : (
        <Surface flush>
          <ul className="grid px-1 py-1">
            {rows.map(({ person, assignments, roles, completeness }) => (
              <li key={person.id}>
                <RowLink
                  to={`/management/people/${person.id}`}
                  title={person.name}
                  leading={<Avatar name={person.name} size="sm" />}
                  detail={
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span>
                        {roles.length === 0
                          ? "Sin rol deportivo"
                          : roles
                              .map(
                                (assignment) =>
                                  `${ROLE_LABEL[assignment.role]} · ${roleScopeLabel(state, assignment)}`,
                              )
                              .join("  ·  ")}
                      </span>
                    </span>
                  }
                  meta={
                    <span className="grid justify-items-end gap-1">
                      <StateBadge value={person.account} />
                      {!completeness.complete && (
                        <Tag tone="attention">Perfil incompleto</Tag>
                      )}
                    </span>
                  }
                />
              </li>
            ))}
          </ul>
        </Surface>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ALTA DE PERSONA — identidad administrada por el club
   ═══════════════════════════════════════════════════════════════ */

export function CreatePerson() {
  const { state, authority, createPerson } = useProduct()
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dni: "",
    birth: "",
    teamId: "",
    membership: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pending, setPending] = useState(false)
  const [created, setCreated] = useState<{ id: string; code: string } | null>(null)
  useRouter()

  if (!authority.canManagePeople)
    return (
      <div className="mx-auto max-w-3xl">
        <Empty title="No podés crear personas" detail="Reservado a administración." />
      </div>
    )

  function submit() {
    const found: Record<string, string> = {}
    if (!form.name.trim()) found.name = "Escribí el nombre completo."
    if (!form.dni.trim()) found.dni = "El documento lo administra el club y es obligatorio."
    if (!form.birth) found.birth = "La fecha de nacimiento es obligatoria."
    if (!form.email.includes("@")) found.email = "Revisá el correo."
    setErrors(found)
    if (Object.keys(found).length > 0) {
      window.setTimeout(() => {
        document.getElementById(`cp-${Object.keys(found)[0]}`)?.focus()
      }, 0)
      return
    }
    setPending(true)
    const id = createPerson({
      name: form.name,
      email: form.email,
      phone: form.phone,
      dni: form.dni,
      birth: form.birth,
      teamId: form.teamId || null,
      role: "PLAYER",
    })
    if (form.membership) {
      // La Membership se inicia desde el detalle administrativo.
      go(`/management/people/${id}`)
    }
    setPending(false)
    setCreated({ id, code: "" })
    go(`/management/people/${id}`)
  }

  return (
    <div className="gei-stack-page mx-auto max-w-2xl">
      <PageContextHeader
        context="Nueva persona"
        title="Crear persona"
        back="/management/people"
        lead="Documento y fecha de nacimiento los administra el club: no se los pide a la familia."
      />
      {created && (
        <Banner tone="success" title="Persona creada">
          <span className="text-ink-strong">
            Quedó con cuenta pendiente. Emitile el código de activación desde su
            ficha.
          </span>
        </Banner>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
        noValidate
        className="grid gap-5"
      >
        <Surface className="grid gap-4">
          <SectionHeader title="Identidad" />
          <TextField
            id="cp-name"
            label="Nombre y apellido"
            required
            value={form.name}
            error={errors.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
          />
          <TextField
            id="cp-dni"
            label="Documento de identidad"
            required
            value={form.dni}
            error={errors.dni}
            hint="Dato del club. La persona no puede editarlo desde su perfil."
            onChange={(event) =>
              setForm((current) => ({ ...current, dni: event.target.value }))
            }
          />
          <TextField
            id="cp-birth"
            label="Fecha de nacimiento"
            type="date"
            required
            value={form.birth}
            error={errors.birth}
            onChange={(event) =>
              setForm((current) => ({ ...current, birth: event.target.value }))
            }
          />
        </Surface>
        <Surface className="grid gap-4">
          <SectionHeader title="Contacto" />
          <TextField
            id="cp-email"
            label="Correo"
            type="email"
            required
            value={form.email}
            error={errors.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
          />
          <TextField
            id="cp-phone"
            label="Teléfono"
            value={form.phone}
            onChange={(event) =>
              setForm((current) => ({ ...current, phone: event.target.value }))
            }
          />
        </Surface>
        <Surface className="grid gap-4">
          <SectionHeader title="Alta deportiva" hint="Opcional: se puede completar después." />
          <Select
            label="Equipo"
            value={form.teamId}
            onChange={(event) =>
              setForm((current) => ({ ...current, teamId: event.target.value }))
            }
          >
            <option value="">Sin equipo por ahora</option>
            {state.teams
              .filter((team) => team.state === "ACTIVE")
              .map((team) => (
                <option key={team.id} value={team.id}>
                  {teamName(state, team.id)}
                </option>
              ))}
          </Select>
        </Surface>
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="quiet" onClick={() => go("/management/people")}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" busy={pending}>
            Crear persona
          </Button>
        </div>
      </form>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FICHA ADMINISTRATIVA — una sola acción primaria contextual
   ═══════════════════════════════════════════════════════════════ */

export function PersonAdminDetail() {
  const { id = "" } = useParams()
  const {
    state,
    authority,
    updateIdentity,
    startMembership,
    endMembership,
    setAccountState,
    issueSetupToken,
    createGuardianRelationship,
    endGuardianRelationship,
    createConstraint,
    endConstraint,
  } = useProduct()
  const query = useQueryState()
  const section = query.get("section", authority.canManagePeople ? "identidad" : "habilitacion")
  useRouter()
  const [dialog, setDialog] = useState<
    | null
    | "identidad"
    | "membership-start"
    | "membership-end"
    | "account-disable"
    | "account-enable"
    | "code"
    | "guardian"
    | "constraint"
  >(null)
  const [code, setCode] = useState("")
  const [guardError, setGuardError] = useState("")
  const [guard, setGuard] = useState({
    guardianId: "",
    relation: "Madre",
    canViewChildInfo: true,
    canRespondAvailability: true,
  })
  const [constraint, setConstraint] = useState({
    state: "PENDING" as "PENDING" | "BLOCKED",
    scope: "CLUB",
    source: "INTERNAL",
    reason: "MEDICAL_CLEARANCE",
    note: "",
  })
  const [identity, setIdentity] = useState({ dni: "", birth: "", phone: "", email: "" })
  const [identityErrors, setIdentityErrors] = useState<Record<string, string>>({})
  const [closeReason, setCloseReason] = useState("")

  const person = state.people.find((item) => item.id === id)

  if (!authority.canOpen("people"))
    return (
      <div className="mx-auto max-w-3xl">
        <Empty title="No tenés acceso a las fichas de personas" detail="Reservado a administración." />
      </div>
    )
  if (!person)
    return (
      <div className="mx-auto max-w-3xl">
        <Empty title="No encontramos a esa persona" detail="Revisá el enlace." />
      </div>
    )

  const membership = membershipOf(state, person.id)
  const memberships = activeMemberships(state, person.id)
  const teams = activeTeamAssignments(state, person.id)
  const roles = activeRoleAssignments(state, person.id)
  const completeness = profileCompleteness(person)
  const eligibility = deriveEligibility(state.eligibilityConstraints, person.id)
  const constraints = state.eligibilityConstraints.filter(
    (constraint) => constraint.personId === person.id,
  )
  const relations = guardiansOf(state, person.id)
  const history = state.audit.filter((entry) => entry.route.includes(person.id))
  const guardiansAvailable = state.people.filter((item) => item.id !== person.id)
  const admin = authority.canManagePeople

  /* Una sola acción primaria contextual según el estado real. */
  const primary = !admin
    ? null
    : !membership
      ? { label: "Iniciar pertenencia", run: () => setDialog("membership-start") }
      : person.account === "PENDING"
        ? { label: "Emitir código de activación", run: () => setDialog("code") }
        : person.account === "DISABLED"
          ? { label: "Habilitar cuenta", run: () => setDialog("account-enable") }
          : null

  const tabs = [
    { id: "identidad", label: "Identidad", show: admin },
    { id: "pertenencia", label: "Pertenencia", show: admin },
    { id: "equipos", label: "Equipos", show: admin, count: teams.length },
    { id: "roles", label: "Roles", show: admin, count: roles.length },
    { id: "habilitacion", label: "Habilitación", show: true },
    { id: "cuenta", label: "Cuenta", show: admin },
    {
      id: "representacion",
      label: "Representación",
      show: admin,
      count: relations.length,
    },
  ].filter((tab) => tab.show)

  return (
    <div className="gei-stack-page mx-auto max-w-4xl">
      <PageContextHeader
        context="Personas"
        title={person.name}
        back="/management/people"
        lead={
          authority.canManagePeople
            ? completeness.complete
              ? "Ficha administrativa: identidad, pertenencia, roles, habilitación y cuenta."
              : `Faltan datos para poder asignarla: ${completeness.missing
                  .map((item) => item.label)
                  .join(", ")}.`
            : `Vista de coordinación: gestionás la habilitación para jugar${
                completeness.complete ? "" : " y le faltan datos de identidad"
              }.`
        }
        action={
          <div className="flex flex-wrap items-center gap-2">
            <StateBadge value={person.account} emphasis />
            {primary && (
              <Button variant="primary" onClick={primary.run}>
                {primary.label}
              </Button>
            )}
          </div>
        }
        below={
          <div className="border-b border-line">
            <TabBar
              ariaLabel="Secciones de la ficha"
              active={section}
              onChange={(value) => query.set({ section: value })}
              tabs={tabs.map(({ id, label, count }) => ({
                id,
                label,
                count,
              }))}
            />
          </div>
        }
      />

      {section === "identidad" && (
        <div className="grid gap-4">
          {!completeness.complete && (
            <Banner tone="attention" title="Perfil incompleto">
              <span className="text-ink-strong">
                Mientras falten{" "}
                {completeness.missing.map((item) => item.label).join(", ")} no se
                puede asignar a un equipo: el club no tiene los datos para hacerlo.
              </span>
            </Banner>
          )}
          <Surface className="grid gap-4">
            <SectionHeader
              title="Datos que administra el club"
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setIdentity({
                      dni: person.dni,
                      birth: person.birth,
                      phone: person.phone,
                      email: person.email,
                    })
                    setDialog("identidad")
                  }}
                >
                  Corregir identidad
                </Button>
              }
            />
            <RowStatic title="Nombre" detail={person.name} />
            <RowStatic title="Documento" detail={person.dni || "Sin cargar"} />
            <RowStatic
              title="Fecha de nacimiento"
              detail={person.birth ? dateLabel(person.birth, true) : "Sin cargar"}
            />
            <RowStatic title="Correo" detail={person.email || "Sin correo"} />
            <RowStatic title="Teléfono" detail={person.phone || "Sin teléfono"} />
          </Surface>
        </div>
      )}

      {section === "pertenencia" && (
        <div className="grid gap-4">
          {memberships.length === 0 ? (
            <Empty
              title="Sin pertenencia vigente"
              detail="La pertenencia es el vínculo con el club. Sin ella no hay temporada."
              action={
                <Button variant="primary" onClick={() => setDialog("membership-start")}>
                  Iniciar pertenencia
                </Button>
              }
            />
          ) : (
            memberships.map((item) => (
              <Surface key={item.id} className="grid gap-3">
                <SectionHeader
                  title="Pertenencia vigente"
                  meta={periodLabel(item.validFrom, item.validUntil)}
                  action={
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDialog("membership-end")}
                    >
                      Finalizar
                    </Button>
                  }
                />
                <p className="gei-meta">
                  Finalizar la pertenencia no borra la historia: el período queda
                  cerrado y los equipos y roles se conservan con su vigencia.
                </p>
              </Surface>
            ))
          )}
        </div>
      )}

      {section === "equipos" && (
        <DetailSection title="Equipos" meta={`${teams.length} vigentes`}>
          {teams.length === 0 ? (
            <p className="gei-meta">
              No tiene equipos vigentes. La asignación deportiva la hace el club.
            </p>
          ) : (
            <ul className="grid">
              {teams.map((assignment) => (
                <li key={assignment.id}>
                  <RowStatic
                    title={teamName(state, assignment.teamId)}
                    detail={periodLabel(assignment.validFrom, assignment.validUntil)}
                  />
                </li>
              ))}
            </ul>
          )}
        </DetailSection>
      )}

      {section === "roles" && (
        <DetailSection title="Roles y alcance" meta={`${roles.length} vigentes`}>
          {roles.length === 0 ? (
            <p className="gei-meta">No tiene roles vigentes.</p>
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
      )}

      {section === "habilitacion" && (
        <div className="grid gap-4">
          <Surface className="grid gap-3">
            <SectionHeader
              title="Estado para jugar"
              action={
                authority.canManageEligibility && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setDialog("constraint")}
                  >
                    Registrar una restricción
                  </Button>
                )
              }
            />
            <div className="flex items-center gap-2">
              <StateBadge
                value={eligibility === "ELIGIBLE" ? "ELIGIBLE" : eligibility}
                emphasis
              />
              <span className="gei-body text-ink-strong">
                {eligibility === "ELIGIBLE"
                  ? "Puede jugar sin restricciones."
                  : eligibility === "PENDING"
                    ? "Tiene un trámite pendiente antes de jugar."
                    : "No puede jugar hasta que se levante el bloqueo."}
              </span>
            </div>
          </Surface>

          <Surface className="grid gap-2">
            <SectionHeader
              title="Restricciones registradas"
              meta={`${constraints.length}`}
            />
            {constraints.length === 0 ? (
              <p className="gei-meta">Sin restricciones registradas.</p>
            ) : (
              <ul className="grid">
                {constraints.map((item) => (
                  <li key={item.id}>
                    <div className="flex flex-wrap items-center gap-3 border-b border-line py-3 last:border-b-0">
                      <div className="min-w-0 flex-1">
                        <p className="gei-item-title">
                          {item.state === "BLOCKED"
                            ? "No habilitada para jugar"
                            : "Trámite pendiente"}
                        </p>
                        <p className="gei-meta">
                          {CONSTRAINT_SCOPE_LABEL[item.scope]} ·{" "}
                          {CONSTRAINT_SOURCE_LABEL[item.source]} ·{" "}
                          {CONSTRAINT_REASON_LABEL[item.reason]}
                        </p>
                        {item.note && (
                          <p className="gei-body text-ink-strong">{item.note}</p>
                        )}
                        <p className="gei-meta tabular-nums">
                          {periodLabel(item.validFrom, item.validUntil)} · cargada por{" "}
                          {item.createdBy}
                        </p>
                      </div>
                      <StateBadge
                        value={item.state === "BLOCKED" ? "BLOCKED" : "PENDING"}
                      />
                      {authority.canManageEligibility && !item.validUntil && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            endConstraint(item.id, "Levantada desde la ficha")
                          }
                        >
                          Levantar
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Surface>
        </div>
      )}

      {section === "cuenta" && (
        <div className="grid gap-4">
          <Surface className="grid gap-3">
            <SectionHeader title="Estado de la cuenta" />
            <RowStatic
              title="Estado"
              detail={
                <StateBadge value={person.account} emphasis />
              }
            />
            <RowStatic
              title="Credencial"
              detail={person.passwordSet ? "Configurada" : "Sin configurar"}
            />
            <RowStatic
              title="Última actividad"
              detail={dateLabel(person.lastActivityAt.slice(0, 10), true)}
            />
            {person.setupToken && (
              <RowStatic
                title="Código vigente"
                detail={`${person.setupToken.code}${
                  person.setupToken.used ? " (usado)" : ""
                }`}
              />
            )}
          </Surface>
          <div className="flex flex-wrap gap-2">
            {person.account === "PENDING" && (
              <Button variant="primary" onClick={() => setDialog("code")}>
                Emitir código de activación
              </Button>
            )}
            {person.account === "ACTIVE" && (
              <Button variant="danger" onClick={() => setDialog("account-disable")}>
                <Lock size={16} aria-hidden />
                Deshabilitar cuenta
              </Button>
            )}
            {person.account === "DISABLED" && (
              <Button variant="primary" onClick={() => setDialog("account-enable")}>
                <Unlock size={16} aria-hidden />
                Habilitar cuenta
              </Button>
            )}
          </div>
        </div>
      )}

      {section === "representacion" && (
        <div className="grid gap-4">
          <Surface className="grid gap-3">
            <SectionHeader
              title="Personas que pueden actuar por esta persona"
              meta={`${relations.length} vigentes`}
              action={
                authority.canManageGuardianRelations && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setDialog("guardian")}
                  >
                    Crear relación
                  </Button>
                )
              }
            />
            {relations.length === 0 ? (
              <p className="gei-meta">
                No hay relaciones vigentes. Si es menor, se puede delegar la
                consulta y la respuesta de disponibilidad sin darle un rol.
              </p>
            ) : (
              <ul className="grid">
                {relations.map((relation) => {
                  const guardian = state.people.find(
                    (item) => item.id === relation.guardianId,
                  )
                  return (
                    <li key={relation.id}>
                      <div className="flex flex-wrap items-center gap-3 border-b border-line py-3 last:border-b-0">
                        <div className="min-w-0 flex-1">
                          <p className="gei-item-title">{guardian?.name ?? "—"}</p>
                          <p className="gei-meta">
                            {relation.relation} · ve información:{" "}
                            {relation.canViewChildInfo ? "sí" : "no"} · responde
                            ¿Vas?: {relation.canRespondAvailability ? "sí" : "no"}
                          </p>
                          <p className="gei-meta tabular-nums">
                            {periodLabel(relation.validFrom, relation.validUntil)}
                          </p>
                        </div>
                        {authority.canManageGuardianRelations && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              endGuardianRelationship(relation.id, "Finalizada desde la ficha")
                            }
                          >
                            Finalizar
                          </Button>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </Surface>
        </div>
      )}

      <Surface className="grid gap-3">
        <SectionHeader title="Cambios de esta ficha" />
        {history.length === 0 ? (
          <p className="gei-meta">Todavía no hay cambios registrados.</p>
        ) : (
          <HistoryList
            entries={history.map((entry) => ({
              action: entry.action,
              actor: entry.actor,
              at: dateTimeLabel(entry.at),
              before: entry.before,
              after: entry.after,
              reason: entry.source,
            }))}
          />
        )}
      </Surface>

      {/* Diálogos de acción */}
      {dialog === "identidad" && (
        <Modal
          title="Corregir identidad"
          description="Datos que el club administra. Queda registrado quién los cambió."
          onClose={() => setDialog(null)}
          footer={
            <>
              <Button variant="quiet" onClick={() => setDialog(null)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const found: Record<string, string> = {}
                  if (!identity.dni.trim()) found.dni = "El documento no puede quedar vacío."
                  if (!identity.birth) found.birth = "La fecha no puede quedar vacía."
                  setIdentityErrors(found)
                  if (Object.keys(found).length > 0) return
                  updateIdentity(person.id, identity)
                  setDialog(null)
                }}
              >
                Guardar identidad
              </Button>
            </>
          }
        >
          <div className="grid gap-4">
            <TextField
              label="Documento de identidad"
              required
              value={identity.dni}
              error={identityErrors.dni}
              onChange={(event) =>
                setIdentity((current) => ({ ...current, dni: event.target.value }))
              }
            />
            <TextField
              label="Fecha de nacimiento"
              type="date"
              required
              value={identity.birth}
              error={identityErrors.birth}
              onChange={(event) =>
                setIdentity((current) => ({ ...current, birth: event.target.value }))
              }
            />
            <TextField
              label="Teléfono"
              value={identity.phone}
              onChange={(event) =>
                setIdentity((current) => ({ ...current, phone: event.target.value }))
              }
            />
            <TextField
              label="Correo"
              type="email"
              value={identity.email}
              onChange={(event) =>
                setIdentity((current) => ({ ...current, email: event.target.value }))
              }
            />
          </div>
        </Modal>
      )}

      {dialog === "membership-start" && (
        <ConfirmDialog
          title="Iniciar pertenencia"
          consequence={`${person.firstName} queda dentro del club desde hoy. A partir de acá se le pueden asignar equipos y roles.`}
          confirmLabel="Iniciar pertenencia"
          tone="attention"
          onClose={() => setDialog(null)}
          onConfirm={() => {
            startMembership(person.id)
            setDialog(null)
          }}
        />
      )}

      {dialog === "membership-end" && (
        <ConfirmDialog
          title="Finalizar pertenencia"
          consequence="Deja de estar dentro del club. No se borra nada: el período queda cerrado y la historia se conserva. Su cuenta queda activa pero sin acceso a la temporada."
          confirmLabel="Finalizar pertenencia"
          requireReason
          onClose={() => setDialog(null)}
          onConfirm={(reason) => {
            endMembership(person.id, reason)
            setDialog(null)
          }}
        />
      )}

      {dialog === "account-disable" && (
        <ConfirmDialog
          title="Deshabilitar cuenta"
          consequence={`${person.firstName} no va a poder entrar más. Se cierran todas sus sesiones abiertas. La información del club se conserva.`}
          confirmLabel="Deshabilitar cuenta"
          requireReason
          onClose={() => setDialog(null)}
          onConfirm={(reason) => {
            const result = setAccountState(person.id, "DISABLED", reason)
            if (!result.ok) setGuardError(result.error ?? "")
            setDialog(null)
          }}
          extra={
            guardError && (
              <Banner tone="danger" title="No se puede deshabilitar">
                <span className="text-ink-strong">{guardError}</span>
              </Banner>
            )
          }
        />
      )}

      {dialog === "account-enable" && (
        <ConfirmDialog
          title="Habilitar cuenta"
          consequence={`${person.firstName} vuelve a poder entrar al sistema con su nombre de usuario.`}
          confirmLabel="Habilitar cuenta"
          tone="attention"
          onClose={() => setDialog(null)}
          onConfirm={() => {
            setAccountState(person.id, "ACTIVE", "Habilitada desde la ficha")
            setDialog(null)
          }}
        />
      )}

      {dialog === "code" && (
        <Modal
          title="Código de activación"
          description="Vigente por 24 horas y de un solo uso."
          onClose={() => setDialog(null)}
          footer={
            <>
              <Button variant="quiet" onClick={() => setDialog(null)}>
                Cerrar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const issued = issueSetupToken(person.id)
                  setCode(issued)
                }}
              >
                Emitir código
              </Button>
            </>
          }
        >
          <div className="grid gap-4">
            {code ? (
              <Banner tone="success" title="Código emitido">
                <span className="gei-body-strong tabular-nums text-ink">{code}</span>
                <span className="mt-1 block text-ink-strong">
                  Pasáselo a {person.firstName}. Sirve en la pantalla “Activar
                  cuenta”.
                </span>
              </Banner>
            ) : (
              <p className="gei-meta">
                Todavía no emitiste un código para esta persona.
              </p>
            )}
          </div>
        </Modal>
      )}

      {dialog === "guardian" && (
        <Modal
          title="Crear relación de representación"
          description="Una relación de representación no es un rol: define qué puede ver y qué puede responder."
          onClose={() => setDialog(null)}
          footer={
            <>
              <Button variant="quiet" onClick={() => setDialog(null)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (!guard.guardianId) {
                    setGuardError("Elegí quién representa.")
                    return
                  }
                  createGuardianRelationship({
                    guardianId: guard.guardianId,
                    childId: person.id,
                    relation: guard.relation,
                    canViewChildInfo: guard.canViewChildInfo,
                    canRespondAvailability: guard.canRespondAvailability,
                  })
                  setDialog(null)
                }}
              >
                Crear relación
              </Button>
            </>
          }
        >
          <div className="grid gap-4">
            <Select
              label="Quién representa"
              value={guard.guardianId}
              onChange={(event) => {
                setGuard((current) => ({ ...current, guardianId: event.target.value }))
                setGuardError("")
              }}
            >
              <option value="">Elegí una persona</option>
              {guardiansAvailable.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
            {guardError && (
              <p className="text-meta font-medium text-danger">{guardError}</p>
            )}
            <TextField
              label="Relación"
              value={guard.relation}
              onChange={(event) =>
                setGuard((current) => ({ ...current, relation: event.target.value }))
              }
            />
            <fieldset className="grid gap-2">
              <legend className="text-body font-semibold">Qué puede hacer</legend>
              {[
                { key: "canViewChildInfo", label: "Ver la información del menor" },
                { key: "canRespondAvailability", label: "Responder el “¿Vas?” del menor" },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-control border border-line-strong px-3"
                >
                  <input
                    type="checkbox"
                    checked={guard[item.key as "canViewChildInfo" | "canRespondAvailability"]}
                    onChange={(event) =>
                      setGuard((current) => ({
                        ...current,
                        [item.key]: event.target.checked,
                      }))
                    }
                    className="size-5 accent-interactive"
                  />
                  <span className="text-body font-medium">{item.label}</span>
                </label>
              ))}
            </fieldset>
            <Banner tone="neutral" title="Lo que no se puede delegar">
              <span className="text-ink-strong">
                Ni documento, ni fecha de nacimiento, ni motivos de habilitación,
                ni conversaciones privadas.
              </span>
            </Banner>
          </div>
        </Modal>
      )}

      {dialog === "constraint" && (
        <Modal
          title="Registrar una restricción de habilitación"
          description="Queda con origen, motivo y vigencia."
          onClose={() => setDialog(null)}
          footer={
            <>
              <Button variant="quiet" onClick={() => setDialog(null)}>
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  createConstraint({
                    personId: person.id,
                    state: constraint.state,
                    scope: constraint.scope as never,
                    scopeRefId: null,
                    source: constraint.source as never,
                    reason: constraint.reason as never,
                    note: constraint.note || undefined,
                    validFrom: todayIso(),
                    validUntil: null,
                  })
                  setDialog(null)
                }}
              >
                Registrar
              </Button>
            </>
          }
        >
          <div className="grid gap-4">
            <Select
              label="Estado"
              value={constraint.state}
              onChange={(event) =>
                setConstraint((current) => ({
                  ...current,
                  state: event.target.value as "PENDING" | "BLOCKED",
                }))
              }
            >
              <option value="PENDING">Trámite pendiente</option>
              <option value="BLOCKED">No habilitada para jugar</option>
            </Select>
            <Select
              label="Alcance"
              value={constraint.scope}
              onChange={(event) =>
                setConstraint((current) => ({ ...current, scope: event.target.value }))
              }
            >
              {Object.entries(CONSTRAINT_SCOPE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
            <Select
              label="Origen"
              value={constraint.source}
              onChange={(event) =>
                setConstraint((current) => ({ ...current, source: event.target.value }))
              }
            >
              {Object.entries(CONSTRAINT_SOURCE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
            <Select
              label="Motivo"
              value={constraint.reason}
              onChange={(event) =>
                setConstraint((current) => ({ ...current, reason: event.target.value }))
              }
            >
              {Object.entries(CONSTRAINT_REASON_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
            <TextArea
              label="Nota"
              rows={3}
              value={constraint.note}
              onChange={(event) =>
                setConstraint((current) => ({ ...current, note: event.target.value }))
              }
              hint="Visible para Subcomisión y administración."
            />
          </div>
        </Modal>
      )}

      <div className="sr-only" aria-live="polite">
        {closeReason}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ESTRUCTURA — tabs, restore, dependency fences, dirección de sede
   ═══════════════════════════════════════════════════════════════ */

export function StructurePage() {
  const { state, authority, setStructureArchived, renameVenueMetadata } =
    useProduct()
  const query = useQueryState()
  const tab = query.get("tab", "VENUE")
  useRouter()
  const [archiveTarget, setArchiveTarget] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [venueEdit, setVenueEdit] = useState<{
    id: string
    name: string
    address: string
    fieldLabel: string
  } | null>(null)

  if (!authority.canOpen("structure"))
    return (
      <div className="mx-auto max-w-3xl">
        <Empty
          title="La estructura la administra el club"
          detail="Temporadas, divisiones, líneas y sedes."
        />
      </div>
    )

  const items = state.structure.filter((item) => item.type === tab)
  const archived = items.filter((item) => item.archived)
  const active = items.filter((item) => !item.archived)

  return (
    <div className="gei-stack-page mx-auto max-w-4xl">
      <PageContextHeader
        context="Estructura"
        title="Estructura del club"
        lead="Lo que sostiene todo lo demás. Archivar no borra: se puede restaurar."
        below={
          <div className="border-b border-line">
            <TabBar
              ariaLabel="Tipo de estructura"
              active={tab}
              onChange={(value) => query.set({ tab: value })}
              tabs={(["SEASON", "DIVISION", "LINE", "VENUE"] as const).map(
                (type) => ({
                  id: type,
                  label: STRUCTURE_LABEL[type],
                  count: state.structure.filter(
                    (item) => item.type === type && !item.archived,
                  ).length,
                }),
              )}
            />
          </div>
        }
      />

      {error && (
        <Banner tone="danger" title="No se puede archivar">
          <span className="text-ink-strong">{error}</span>
        </Banner>
      )}

      {active.length === 0 ? (
        <Empty title="Nada activo en esta sección" detail="Podés restaurar algo archivado." />
      ) : (
        <Surface flush>
          <ul className="grid px-1 py-1">
            {active.map((item) => {
              const teams = state.teams.filter(
                (team) =>
                  (item.type === "DIVISION" && team.divisionId === item.id) ||
                  (item.type === "LINE" && team.lineId === item.id) ||
                  (item.type === "SEASON" && team.seasonId === item.id),
              )
              return (
                <li key={item.id}>
                  <RowStatic
                    title={item.name}
                    detail={
                      item.type === "DIVISION"
                        ? `Temporada ${state.structure.find((s) => s.id === item.parentId)?.name ?? "—"}`
                        : item.type === "VENUE"
                          ? state.venues.find((venue) => venue.id === item.id)?.address
                          : teams.length > 0
                            ? `${teams.length} ${teams.length === 1 ? "equipo lo usa" : "equipos lo usan"}`
                            : undefined
                    }
                    trailing={
                      <span className="flex flex-wrap justify-end gap-1">
                        {item.type === "VENUE" && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              const venue = state.venues.find((v) => v.id === item.id)
                              setVenueEdit({
                                id: item.id,
                                name: venue?.name ?? "",
                                address: venue?.address ?? "",
                                fieldLabel: venue?.fieldLabel ?? "",
                              })
                            }}
                          >
                            Editar
                          </Button>
                        )}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setArchiveTarget(item.id)}
                        >
                          Archivar
                        </Button>
                      </span>
                    }
                  />
                </li>
              )
            })}
          </ul>
        </Surface>
      )}

      {archived.length > 0 && (
        <DetailSection title="Archivados" meta={`${archived.length}`}>
          <ul className="grid">
            {archived.map((item) => (
              <li key={item.id}>
                <RowStatic
                  title={item.name}
                  detail="Archivado. Sigue existiendo y se puede volver a usar."
                  trailing={
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const result = setStructureArchived(item.id, false)
                        if (!result.ok) setError(result.error ?? "")
                      }}
                    >
                      Restaurar
                    </Button>
                  }
                />
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {archiveTarget && (
        <ConfirmDialog
          title="Archivar"
          consequence="Deja de estar disponible para elegir. No se borra: los eventos que ya lo usan siguen con su dato y podés restaurarlo."
          confirmLabel="Archivar"
          requireReason
          reasonLabel="Por qué se archiva"
          onClose={() => setArchiveTarget(null)}
          onConfirm={(reason) => {
            const result = setStructureArchived(archiveTarget, true)
            if (!result.ok) setError(result.error ?? "")
            setArchiveTarget(null)
            void reason
          }}
        />
      )}

      {venueEdit && (
        <Modal
          title="Editar datos de la sede"
          description="Corrección administrativa: no cambia los eventos que ya usan esta sede."
          onClose={() => setVenueEdit(null)}
          footer={
            <>
              <Button variant="quiet" onClick={() => setVenueEdit(null)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  renameVenueMetadata(venueEdit.id, {
                    name: venueEdit.name,
                    address: venueEdit.address,
                    fieldLabel: venueEdit.fieldLabel,
                  })
                  setVenueEdit(null)
                }}
              >
                Guardar sede
              </Button>
            </>
          }
        >
          <div className="grid gap-4">
            <TextField
              label="Nombre"
              required
              value={venueEdit.name}
              onChange={(event) =>
                setVenueEdit((current) =>
                  current ? { ...current, name: event.target.value } : current,
                )
              }
            />
            <TextField
              label="Dirección"
              required
              value={venueEdit.address}
              onChange={(event) =>
                setVenueEdit((current) =>
                  current ? { ...current, address: event.target.value } : current,
                )
              }
            />
            <TextField
              label="Cancha"
              value={venueEdit.fieldLabel}
              onChange={(event) =>
                setVenueEdit((current) =>
                  current ? { ...current, fieldLabel: event.target.value } : current,
                )
              }
            />
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   COMPETENCIAS — TEAM y LINE separados, mismatch visible
   ═══════════════════════════════════════════════════════════════ */

export function CompetitionsPage() {
  const { competitionId } = useParams()
  const {
    state,
    authority,
    createCompetition,
    addCompetitionEntry,
    setCompetitionState,
    setEntryState,
  } = useProduct()
  const query = useQueryState()
  const [newOpen, setNewOpen] = useState(false)
  const [entryOpen, setEntryOpen] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ name: "", organizer: "" })
  const [entry, setEntry] = useState<{
    scope: "TEAM" | "LINE"
    teamId: string
    divisionId: string
    lineId: string
    seasonId: string
    reference: string
  }>({
    scope: "TEAM",
    teamId: "",
    divisionId: "",
    lineId: "",
    seasonId: "",
    reference: "",
  })

  useRouter()

  if (!authority.canViewCompetitions)
    return (
      <div className="mx-auto max-w-3xl">
        <Empty
          title="Las competencias no están en tu alcance"
          detail="Las ven la Subcomisión y la administración."
        />
      </div>
    )

  const competition = state.competitions.find((item) => item.id === competitionId)
  const canMutate = authority.canManageCompetitions

  if (!competition)
    return (
      <div className="gei-stack-page mx-auto max-w-4xl">
        <PageContextHeader
          context="Competencias"
          title="Competencias"
          lead="Inscripciones por equipo y por línea, con su vigencia."
          action={
            canMutate && (
              <Button variant="primary" onClick={() => setNewOpen(true)}>
                Crear competencia
              </Button>
            )
          }
        />
        <div className="grid gap-1">
          {state.competitions.map((item) => (
            <RowLink
              key={item.id}
              to={`/management/competitions/${item.id}`}
              title={item.name}
              detail={`${item.entries.length} ${
                item.entries.length === 1 ? "inscripción" : "inscripciones"
              } · ${item.organizer}`}
              meta={<StateBadge value={item.state} />}
            />
          ))}
        </div>
        {newOpen && (
          <Modal
            title="Crear competencia"
            onClose={() => setNewOpen(false)}
            footer={
              <>
                <Button variant="quiet" onClick={() => setNewOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    if (!form.name.trim()) {
                      setError("Poné un nombre.")
                      return
                    }
                    const id = createCompetition(form)
                    setNewOpen(false)
                    go(`/management/competitions/${id}`)
                  }}
                >
                  Crear
                </Button>
              </>
            }
          >
            <div className="grid gap-4">
              <TextField
                label="Nombre"
                required
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
              />
              <TextField
                label="Organizador"
                required
                value={form.organizer}
                onChange={(event) =>
                  setForm((current) => ({ ...current, organizer: event.target.value }))
                }
              />
              {error && (
                <p className="text-meta font-medium text-danger">{error}</p>
              )}
            </div>
          </Modal>
        )}
      </div>
    )

  return (
    <div className="gei-stack-page mx-auto max-w-4xl">
      <PageContextHeader
        context="Competencias"
        title={competition.name}
        back="/management/competitions"
        lead={competition.organizer}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <StateBadge value={competition.state} emphasis />
            {canMutate && (
              <Button variant="secondary" onClick={() => setEntryOpen(true)}>
                Añadir inscripción
              </Button>
            )}
          </div>
        }
      />

      {error && (
        <Banner tone="danger" title="No se pudo aplicar el cambio">
          <span className="text-ink-strong">{error}</span>
        </Banner>
      )}

      <Surface className="grid gap-3">
        <SectionHeader title="Inscripciones" meta={`${competition.entries.length}`} />
        {competition.entries.length === 0 ? (
          <Empty
            title="Sin inscripciones"
            detail="Esta competencia todavía no tiene equipos ni líneas inscritas."
          />
        ) : (
          <ul className="grid">
            {competition.entries.map((item) => (
              <EntryRow
                key={item.id}
                state={state}
                entry={item}
                canMutate={canMutate}
                onChangeState={(next) => {
                  const result = setEntryState(competition.id, item.id, next)
                  if (!result.ok) setError(result.error ?? "")
                }}
              />
            ))}
          </ul>
        )}
      </Surface>

      {canMutate && (
        <Surface className="grid gap-3">
          <SectionHeader title="Estado de la competencia" />
          <p className="gei-meta">
            Para cerrar una competencia tiene que quedar sin inscripciones activas.
          </p>
          <div className="flex flex-wrap gap-2">
            {(["DRAFT", "ACTIVE", "CLOSED"] as const)
              .filter((next) => next !== competition.state)
              .map((next) => (
                <Button
                  key={next}
                  variant={next === "CLOSED" ? "danger" : "secondary"}
                  onClick={() => {
                    const result = setCompetitionState(competition.id, next)
                    if (!result.ok) setError(result.error ?? "")
                  }}
                >
                  {next === "DRAFT"
                    ? "Volver a borrador"
                    : next === "ACTIVE"
                      ? "Activar competencia"
                      : "Cerrar competencia"}
                </Button>
              ))}
          </div>
        </Surface>
      )}

      {entryOpen && (
        <Modal
          title="Añadir inscripción"
          description="Cada inscripción es de un equipo o de una línea concreta."
          onClose={() => setEntryOpen(false)}
          footer={
            <>
              <Button variant="quiet" onClick={() => setEntryOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const payload =
                    entry.scope === "TEAM"
                      ? ({
                          scope: "TEAM",
                          teamId: entry.teamId,
                          state: "PENDING",
                          reference: entry.reference,
                        } as const)
                      : ({
                          scope: "LINE",
                          divisionId: entry.divisionId,
                          lineId: entry.lineId,
                          seasonId: entry.seasonId,
                          state: "PENDING",
                          reference: entry.reference,
                        } as const)
                  const result = addCompetitionEntry(competition.id, payload)
                  if (result.ok) setEntryOpen(false)
                  else setError(result.error ?? "")
                }}
              >
                Añadir inscripción
              </Button>
            </>
          }
        >
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-2">
              {(["TEAM", "LINE"] as const).map((scope) => (
                <button
                  key={scope}
                  type="button"
                  aria-pressed={entry.scope === scope}
                  onClick={() =>
                    setEntry((current) => ({ ...current, scope }))
                  }
                  className={cx(
                    "gei-target rounded-control border px-3 text-body font-semibold transition-colors",
                    entry.scope === scope
                      ? "border-interactive bg-selected-soft text-selected"
                      : "border-line-strong bg-surface text-ink-muted",
                  )}
                >
                  {scope === "TEAM" ? "Equipo" : "Línea"}
                </button>
              ))}
            </div>
            {entry.scope === "TEAM" ? (
              <Select
                label="Equipo"
                required
                value={entry.teamId}
                onChange={(event) =>
                  setEntry((current) => ({ ...current, teamId: event.target.value }))
                }
              >
                <option value="">Elegí un equipo</option>
                {state.teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {teamName(state, team.id)}
                  </option>
                ))}
              </Select>
            ) : (
              <div className="grid gap-3">
                <Select
                  label="División"
                  required
                  value={entry.divisionId}
                  onChange={(event) =>
                    setEntry((current) => ({
                      ...current,
                      divisionId: event.target.value,
                    }))
                  }
                >
                  <option value="">Elegí una división</option>
                  {state.structure
                    .filter((item) => item.type === "DIVISION")
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </Select>
                <Select
                  label="Línea"
                  required
                  value={entry.lineId}
                  onChange={(event) =>
                    setEntry((current) => ({ ...current, lineId: event.target.value }))
                  }
                >
                  <option value="">Elegí una línea</option>
                  {state.structure
                    .filter((item) => item.type === "LINE")
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </Select>
                <Select
                  label="Temporada"
                  required
                  value={entry.seasonId}
                  onChange={(event) =>
                    setEntry((current) => ({ ...current, seasonId: event.target.value }))
                  }
                >
                  <option value="">Elegí una temporada</option>
                  {state.structure
                    .filter((item) => item.type === "SEASON")
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </Select>
              </div>
            )}
            <TextField
              label="Referencia externa"
              value={entry.reference}
              hint="Código de la asociación, si existe."
              onChange={(event) =>
                setEntry((current) => ({ ...current, reference: event.target.value }))
              }
            />
          </div>
        </Modal>
      )}
    </div>
  )
}

function EntryRow({
  state,
  entry,
  canMutate,
  onChangeState,
}: {
  state: ReturnType<typeof useProduct>["state"]
  entry: CompetitionEntry
  canMutate: boolean
  onChangeState: (next: CompetitionEntry["state"]) => void
}) {
  const label = entryLabel(state, entry)
  return (
    <li className="flex flex-wrap items-center gap-3 border-b border-line py-3 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="gei-item-title">{label}</p>
        <p className="gei-meta">
          {entry.scope === "TEAM"
            ? "Inscripción de equipo: exige que el partido juegue con ese equipo."
            : "Inscripción de línea: exige la misma división, línea y temporada."}
          {entry.reference && ` · referencia ${entry.reference}`}
        </p>
      </div>
      <StateBadge value={entry.state === "ACTIVE" ? "ACTIVE" : entry.state === "ENDED" ? "ENDED" : "PENDING"} />
      {canMutate && (
        <div className="flex flex-wrap gap-1">
          {entry.state !== "ACTIVE" && (
            <Button variant="secondary" size="sm" onClick={() => onChangeState("ACTIVE")}>
              Activar
            </Button>
          )}
          {entry.state !== "ENDED" && (
            <Button variant="danger" size="sm" onClick={() => onChangeState("ENDED")}>
              Finalizar
            </Button>
          )}
        </div>
      )}
    </li>
  )
}

/* ═══════════════════════════════════════════════════════════════
   EQUIPO (administración)
   ═══════════════════════════════════════════════════════════════ */

export function TeamAdmin() {
  const { id = "" } = useParams()
  const { state, authority } = useProduct()
  const team = state.teams.find((item) => item.id === id)

  if (!authority.canOpen("structure"))
    return (
      <div className="mx-auto max-w-3xl">
        <Empty title="No tenés acceso a los equipos" detail="Reservado a administración." />
      </div>
    )
  if (!team)
    return (
      <div className="mx-auto max-w-3xl">
        <Empty title="No encontramos ese equipo" detail="Revisá el enlace." />
      </div>
    )

  const members = state.people.filter((person) =>
    activeTeamAssignments(state, person.id).some((a) => a.teamId === id),
  )
  const entries = state.competitions.flatMap((competition) =>
    competition.entries
      .filter((entry) =>
        entry.scope === "TEAM"
          ? entry.teamId === id
          : state.teams.find(
              (item) =>
                item.divisionId === entry.divisionId &&
                item.lineId === entry.lineId &&
                item.seasonId === entry.seasonId,
            )?.id === id,
      )
      .map((entry) => ({ competition, entry })),
  )

  return (
    <div className="gei-stack-page mx-auto max-w-4xl">
      <PageContextHeader
        context="Equipos"
        title={teamName(state, id)}
        back="/management/people"
        lead="Identidad del equipo e inscripciones en competencias."
      />
      <DetailSection title="Identidad">
        <RowStatic title="Nombre" detail={teamName(state, id)} />
        <RowStatic
          title="Composición"
          detail="División · Línea · Temporada"
        />
        <RowStatic title="Estado" detail={team.state === "ACTIVE" ? "Activo" : "Archivado"} />
      </DetailSection>
      <DetailSection title="Personas" meta={`${members.length}`}>
        <div className="grid gap-1">
          {members.map((person) => (
            <RowLink
              key={person.id}
              to={`/management/people/${person.id}`}
              title={person.name}
              leading={<Avatar name={person.name} size="sm" />}
            />
          ))}
        </div>
      </DetailSection>
      <DetailSection title="Inscripciones en competencias" meta={`${entries.length}`}>
        {entries.length === 0 ? (
          <p className="gei-meta">Este equipo no está inscrito en ninguna competencia.</p>
        ) : (
          <ul className="grid">
            {entries.map(({ competition, entry }) => (
              <li key={entry.id}>
                <RowStatic
                  title={competition.name}
                  detail={entryLabel(state, entry)}
                  meta={<StateBadge value={entry.state === "ACTIVE" ? "ACTIVE" : entry.state === "ENDED" ? "ENDED" : "PENDING"} />}
                />
              </li>
            ))}
          </ul>
        )}
      </DetailSection>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */

let nav: ((to: string) => void) | null = null
/** Navegación SPA para helpers fuera del árbol de componentes. */
function useRouter() {
  nav = useNavigate()
}
function go(path: string) {
  if (nav) nav(path)
  else window.location.assign(path)
}