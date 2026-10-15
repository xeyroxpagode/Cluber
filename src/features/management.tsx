import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { Lock, Unlock } from "lucide-react"
import { useProduct } from "../mock/store"
import { todayIso } from "../mock/clock"
import {
  dateLabel,
  dateTimeLabel,
  periodLabel,
  roleTextOf,
  roleText,
  teamName,
  type StructureType,
} from "../mock/model"
import {
  activeMemberships,
  activeRoleAssignments,
  activeTeamAssignments,
  membershipOf,
  profileCompleteness,
  roleScopeLabel,
} from "../mock/derive"
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
            : "Competencias del club. Las personas, las cuentas y la estructura las maneja administración."
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
          detail={`${state.people.length} personas · altas, cuentas y roles`}
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
            detail={`${state.competitions.filter((item) => !item.archivedAt).length} competencias activas`}
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
                {Object.entries(roleText).map(([value, label]) => (
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
                                  `${roleTextOf(assignment.role)} · ${roleScopeLabel(state, assignment)}`,
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
      teamId: null,
      role: "PLAYER",
    })
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
          <SectionHeader
            title="Qué sigue"
            hint="Después del alta, la pertenencia y el equipo se operan desde su ficha."
          />
          <p className="gei-meta">
            La persona queda con cuenta pendiente. Desde su ficha iniciás la
            pertenencia y le emitís el código de activación.
          </p>
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
  } = useProduct()
  const query = useQueryState()
  const section = query.get("section", "identidad")
  useRouter()
  const [dialog, setDialog] = useState<
    | null
    | "identidad"
    | "membership-start"
    | "membership-end"
    | "account-disable"
    | "account-enable"
    | "code"
  >(null)
  const [code, setCode] = useState("")
  const [guardError, setGuardError] = useState("")
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
  const history = state.audit.filter((entry) => entry.route.includes(person.id))
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
    { id: "cuenta", label: "Cuenta", show: admin },
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
                    title={roleTextOf(role.role)}
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
          consequence={`${person.firstName} vuelve a poder entrar al sistema con su correo.`}
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
   COMPETENCIAS — simple V1.1: crear, editar, archivar, consultar
   ═══════════════════════════════════════════════════════════════ */

export function CompetitionsPage() {
  const { id: competitionId } = useParams()
  const {
    state,
    authority,
    createCompetition,
    updateCompetition,
    archiveCompetition,
  } = useProduct()
  const [newOpen, setNewOpen] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ name: "", organizer: "" })

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
          lead="Contexto deportivo: crear, editar, archivar y consultar."
          action={
            canMutate && (
              <Button variant="primary" onClick={() => setNewOpen(true)}>
                Crear competencia
              </Button>
            )
          }
        />
        <div className="grid gap-1">
          {state.competitions
            .filter((item) => !item.archivedAt)
            .map((item) => (
              <RowLink
                key={item.id}
                to={`/management/competitions/${item.id}`}
                title={item.name}
                detail={item.organizer}
              />
            ))}
        </div>
        {state.competitions.some((item) => item.archivedAt) && (
          <DetailSection
            title="Archivadas"
            meta={`${state.competitions.filter((item) => item.archivedAt).length}`}
          >
            <div className="grid gap-1">
              {state.competitions
                .filter((item) => item.archivedAt)
                .map((item) => (
                  <RowLink
                    key={item.id}
                    to={`/management/competitions/${item.id}`}
                    title={item.name}
                    detail={`${item.organizer} · archivada`}
                    meta={<StateBadge value="ARCHIVED" />}
                  />
                ))}
            </div>
          </DetailSection>
        )}
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

  const archived = !!competition.archivedAt
  const jornadas = state.jornadas.filter(
    (item) => item.competitionId === competition.id,
  )
  const matches = state.events.filter(
    (event) => event.competitionId === competition.id,
  )
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({ name: "", organizer: "" })
  const [archiveOpen, setArchiveOpen] = useState(false)

  return (
    <div className="gei-stack-page mx-auto max-w-4xl">
      <PageContextHeader
        context="Competencias"
        title={competition.name}
        back="/management/competitions"
        lead={competition.organizer}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <StateBadge value={archived ? "ARCHIVED" : "ACTIVE"} emphasis />
            {canMutate && !archived && (
              <Button
                variant="secondary"
                onClick={() => {
                  setEditForm({
                    name: competition.name,
                    organizer: competition.organizer,
                  })
                  setEditOpen(true)
                }}
              >
                Editar
              </Button>
            )}
          </div>
        }
        below={
          archived ? (
            <Banner tone="neutral" title="Competencia archivada">
              <span className="text-ink-strong">
                Quedó como lectura histórica. Las jornadas y los partidos que la
                referencian se siguen consultando.
              </span>
            </Banner>
          ) : undefined
        }
      />

      {error && (
        <Banner tone="danger" title="No se pudo aplicar el cambio">
          <span className="text-ink-strong">{error}</span>
        </Banner>
      )}

      <DetailSection
        title="Jornadas"
        meta={`${jornadas.length} ${jornadas.length === 1 ? "jornada" : "jornadas"}`}
      >
        {jornadas.length === 0 ? (
          <p className="gei-meta">
            Ninguna jornada referencia a esta competencia.
          </p>
        ) : (
          <ul className="grid gap-1">
            {jornadas.map((jornada) => (
              <li key={jornada.id}>
                <RowLink
                  to={`/jornadas/${jornada.id}`}
                  title={jornada.name}
                  detail={`${jornada.events.length} ${
                    jornada.events.length === 1 ? "partido" : "partidos"
                  }`}
                />
              </li>
            ))}
          </ul>
        )}
      </DetailSection>

      <DetailSection
        title="Partidos"
        meta={`${matches.length} ${matches.length === 1 ? "partido" : "partidos"}`}
      >
        {matches.length === 0 ? (
          <p className="gei-meta">
            Ningún partido referencia a esta competencia.
          </p>
        ) : (
          <ul className="grid gap-1">
            {matches.map((event) => (
              <li key={event.id}>
                <RowLink
                  to={`/events/${event.id}`}
                  title={event.opponent ? `GEI vs. ${event.opponent}` : event.title}
                  detail={`${dateLabel(event.date, true)} · ${event.time}`}
                  meta={<StateBadge value={event.state} />}
                />
              </li>
            ))}
          </ul>
        )}
      </DetailSection>

      {canMutate && !archived && (
        <div className="flex flex-wrap gap-2">
          <Button variant="danger" onClick={() => setArchiveOpen(true)}>
            Archivar competencia
          </Button>
        </div>
      )}

      {editOpen && (
        <Modal
          title="Editar competencia"
          onClose={() => setEditOpen(false)}
          footer={
            <>
              <Button variant="quiet" onClick={() => setEditOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (!editForm.name.trim()) {
                    setError("Poné un nombre.")
                    return
                  }
                  const result = updateCompetition(competition.id, {
                    name: editForm.name.trim(),
                    organizer: editForm.organizer.trim(),
                  })
                  if (result.ok) setEditOpen(false)
                  else setError(result.error ?? "")
                }}
              >
                Guardar
              </Button>
            </>
          }
        >
          <div className="grid gap-4">
            <TextField
              label="Nombre"
              required
              value={editForm.name}
              onChange={(event) =>
                setEditForm((current) => ({ ...current, name: event.target.value }))
              }
            />
            <TextField
              label="Organizador"
              value={editForm.organizer}
              onChange={(event) =>
                setEditForm((current) => ({
                  ...current,
                  organizer: event.target.value,
                }))
              }
            />
          </div>
        </Modal>
      )}

      {archiveOpen && (
        <ConfirmDialog
          title="Archivar la competencia"
          consequence="Deja de aparecer como activa. Las jornadas y los partidos que la referencian se siguen consultando como historia."
          confirmLabel="Archivar competencia"
          requireReason
          reasonLabel="Por qué se archiva"
          onClose={() => setArchiveOpen(false)}
          onConfirm={(reason) => {
            const result = archiveCompetition(competition.id, reason)
            if (result.ok) setArchiveOpen(false)
            else setError(result.error ?? "")
          }}
        />
      )}
    </div>
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

  return (
    <div className="gei-stack-page mx-auto max-w-4xl">
      <PageContextHeader
        context="Equipos"
        title={teamName(state, id)}
        back="/management/people"
        lead="Identidad del equipo y personas asignadas."
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