import { useCallback, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { Lock, Unlock } from "lucide-react"
import { useProduct } from "../lib/session-context"
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
import { activeRoleAssignments, profileCompleteness, roleScopeLabel } from "../mock/derive"
import {
  Avatar, Banner, Button, ConfirmDialog, Empty, FilterChip,
  Modal, RowLink, RowStatic, Select, Sheet, StateBadge, Surface,
  TabBar, Tag, TextField, cx,
} from "../shared/ui"
import {
  DetailSection, HistoryList, PageContextHeader, SectionHeader,
} from "../shared/patterns"
import { useQueryState } from "../shared/use-query-state"

const STRUCTURE_LABEL: Record<StructureType, string> = {
  SEASON: "Temporadas",
  DIVISION: "Divisiones",
  LINE: "Líneas",
  VENUE: "Sedes",
}

function personName(p: { firstName?: string | null; lastName?: string | null }): string {
  return `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim() || "Sin nombre"
}

function isActivePeriod(item: { validFrom: string; validUntil: string | null }): boolean {
  return item.validFrom <= todayIso() && (!item.validUntil || item.validUntil > todayIso())
}

/* HUB DE ADMINISTRACIÓN */

export function ManagementHome() {
  const { state, authority, fetchManagementPeople, fetchCompetitions } = useProduct()
  if (!authority.canOpen("management") && !authority.canOpen("competitions"))
    return (
      <div className="mx-auto max-w-3xl">
        <Empty title="La administración es de administración" detail="No tenés acceso a estas superficies." />
      </div>
    )

  const [loaded, setLoaded] = useState(false)
  useCallback(async () => { await Promise.all([fetchManagementPeople(), fetchCompetitions()]); setLoaded(true) }, [fetchManagementPeople, fetchCompetitions])()

  const people = loaded ? state.people : []
  const competitions = loaded ? state.competitions : []
  const incomplete = people.filter((person) => !person.profileCompleted)
  const pending = people.filter((person) => person.accountStatus === "PENDING")

  return (
    <div className="gei-stack-page mx-auto max-w-4xl">
      <PageContextHeader
        context="Administración"
        title={authority.canManagePeople ? "Administración del club" : "Coordinación oficial"}
        lead={authority.canManagePeople ? "Altas de personas, estructura y competencias. Sin operaciones deportivas." : "Competencias del club."}
      />
      {authority.canManagePeople && (incomplete.length > 0 || pending.length > 0) && (
        <Banner tone="attention" title="Hay pendientes de alta">
          <span className="text-ink-strong">
            {incomplete.length > 0 && `${incomplete.length} ${incomplete.length === 1 ? "persona tiene" : "personas tienen"} el perfil incompleto. `}
            {pending.length > 0 && `${pending.length} ${pending.length === 1 ? "cuenta espera" : "cuentas esperan"} activación.`}
          </span>
        </Banner>
      )}
      <div className="grid gap-1">
        <RowLink to="/management/people" title="Personas" detail={`${people.length} personas · altas, cuentas y roles`} />
        {authority.canOpen("structure") && (
          <RowLink to="/management/structure" title="Estructura del club" detail="Temporadas, divisiones, líneas y sedes" />
        )}
        {authority.canOpen("competitions") && (
          <RowLink to="/management/competitions" title="Competencias" detail={`${competitions.filter((item) => !item.archivedAt).length} competencias activas`} />
        )}
      </div>
    </div>
  )
}

/* PERSONAS */

export function PeopleManagement() {
  const { state, authority, fetchManagementPeople } = useProduct()
  const navigate = useNavigate()
  const query = useQueryState()
  const q = query.get("q") ?? ""
  const team = query.get("team") ?? ""
  const role = query.get("role") ?? ""
  const account = query.get("account") ?? ""
  const profileStatus = query.get("profileStatus") ?? ""

  const [loaded, setLoaded] = useState(false)
  useCallback(async () => { await fetchManagementPeople(); setLoaded(true) }, [fetchManagementPeople])()

  if (!authority.canOpen("people"))
    return (
      <div className="mx-auto max-w-3xl">
        <Empty title="Las personas las administra el club" detail="Pedile a administración si necesitás corregir un dato." />
      </div>
    )

  const people = loaded ? state.people : []
  const rows = people
    .map((person) => {
      const assignments = (person.teamAssignments ?? []).filter(isActivePeriod)
      const roles = (person.roleAssignments ?? []).filter(isActivePeriod)
      const completeness = person.profileCompleted ? { complete: true, missing: [] } : profileCompleteness({ dni: person.dni ?? null, birth: person.birthDate ?? null, phone: person.phone ?? null, email: person.email ?? null } as any)
      return { person, assignments, roles, completeness }
    })
    .filter((row) => {
      if (q && !personName(row.person).toLowerCase().includes(q.toLowerCase())) return false
      if (team && !row.assignments.some((a) => a.teamId === team)) return false
      if (role && !row.roles.some((r) => r.role === role)) return false
      if (account && row.person.accountStatus !== account) return false
      if (profileStatus === "incomplete" && row.completeness.complete) return false
      return true
    })
    .sort((a, b) => personName(a.person).localeCompare(personName(b.person)))

  const filtersOn = Boolean(q || team || role || account || profileStatus)

  return (
    <div className="gei-stack-page mx-auto max-w-5xl">
      <PageContextHeader
        context="Personas"
        title="Personas"
        lead={`${rows.length} ${rows.length === 1 ? "persona" : "personas"} ${filtersOn ? "con estos filtros" : "en el club"}`}
        action={authority.canManagePeople && (<Button variant="primary" onClick={() => navigate("/management/people/new")}>Crear persona</Button>)}
        below={
          <div className="grid gap-3">
            <TextField label="Buscar" value={q} placeholder="Nombre" onChange={(event) => query.set({ q: event.target.value })} />
            <div className="flex flex-wrap items-end gap-2">
              <Select label="Equipo" value={team} onChange={(event) => query.set({ team: event.target.value })} className="min-w-44">
                <option value="">Todos</option>
                {state.teams.map((item) => (<option key={item.id} value={item.id}>{teamName(state as any, item.id)}</option>))}
              </Select>
              <Select label="Rol" value={role} onChange={(event) => query.set({ role: event.target.value })} className="min-w-44">
                <option value="">Todos</option>
                {Object.entries(roleText).map(([value, label]) => (<option key={value} value={value}>{label}</option>))}
              </Select>
              <Select label="Cuenta" value={account} onChange={(event) => query.set({ account: event.target.value })} className="min-w-40">
                <option value="">Todas</option><option value="ACTIVE">Activa</option><option value="PENDING">Pendiente</option><option value="DISABLED">Deshabilitada</option>
              </Select>
              <FilterChip active={profileStatus === "incomplete"} onClick={() => query.set({ profileStatus: profileStatus === "incomplete" ? "" : "incomplete" })}>Perfil incompleto</FilterChip>
              {filtersOn && (<Button variant="quiet" onClick={() => query.reset(["q", "team", "role", "account", "profileStatus"])}>Quitar filtros</Button>)}
            </div>
          </div>
        }
      />

      {rows.length === 0 ? (
        <Empty title="Sin resultados" detail={filtersOn ? "Ninguna persona coincide con estos filtros." : "Todavía no hay personas cargadas."} />
      ) : (
        <Surface flush>
          <ul className="grid px-1 py-1">
            {rows.map(({ person, assignments, roles, completeness }) => (
              <li key={person.id}>
                <RowLink
                  to={`/management/people/${person.id}`}
                  title={personName(person)}
                  leading={<Avatar name={personName(person)} size="sm" />}
                  detail={
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span>{roles.length === 0 ? "Sin rol deportivo" : roles.map((r) => `${roleTextOf(r.role)} · ${roleScopeLabel(state as any, { ...r, scope: r.scopeType, target: r.scopeRefId } as any)}`).join("  ·  ")}</span>
                    </span>
                  }
                  meta={
                    <span className="grid justify-items-end gap-1">
                      <StateBadge value={person.accountStatus ?? ""} />
                      {!completeness.complete && <Tag tone="attention">Perfil incompleto</Tag>}
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

/* ALTA DE PERSONA */

export function CreatePerson() {
  const { authority, fetchCreatePerson } = useProduct()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: "", email: "", phone: "", dni: "", birth: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pending, setPending] = useState(false)

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
    if (Object.keys(found).length > 0) { window.setTimeout(() => { document.getElementById(`cp-${Object.keys(found)[0]}`)?.focus() }, 0); return }
    setPending(true)
    const parts = form.name.trim().split(" ")
    fetchCreatePerson({ firstName: parts[0], lastName: parts.slice(1).join(" "), email: form.email, phone: form.phone, dni: form.dni, birthDate: form.birth }, String(Math.random()))
      .then(() => { setPending(false); navigate("/management/people") })
      .catch(() => setPending(false))
  }

  return (
    <div className="gei-stack-page mx-auto max-w-2xl">
      <PageContextHeader context="Nueva persona" title="Crear persona" back="/management/people" lead="Documento y fecha de nacimiento los administra el club." />
      <form onSubmit={(event) => { event.preventDefault(); submit() }} noValidate className="grid gap-5">
        <Surface className="grid gap-4">
          <SectionHeader title="Identidad" />
          <TextField id="cp-name" label="Nombre y apellido" required value={form.name} error={errors.name} onChange={(event) => setForm((c) => ({ ...c, name: event.target.value }))} />
          <TextField id="cp-dni" label="Documento de identidad" required value={form.dni} error={errors.dni} hint="Dato del club." onChange={(event) => setForm((c) => ({ ...c, dni: event.target.value }))} />
          <TextField id="cp-birth" label="Fecha de nacimiento" type="date" required value={form.birth} error={errors.birth} onChange={(event) => setForm((c) => ({ ...c, birth: event.target.value }))} />
        </Surface>
        <Surface className="grid gap-4">
          <SectionHeader title="Contacto" />
          <TextField id="cp-email" label="Correo" type="email" required value={form.email} error={errors.email} onChange={(event) => setForm((c) => ({ ...c, email: event.target.value }))} />
          <TextField id="cp-phone" label="Teléfono" value={form.phone} onChange={(event) => setForm((c) => ({ ...c, phone: event.target.value }))} />
        </Surface>
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="quiet" onClick={() => navigate("/management/people")}>Cancelar</Button>
          <Button type="submit" variant="primary" busy={pending}>Crear persona</Button>
        </div>
      </form>
    </div>
  )
}

/* FICHA ADMINISTRATIVA */

export function PersonAdminDetail() {
  const { id = "" } = useParams()
  const {
    state, authority, fetchUpdatePersonAdmin, fetchCreateMembership, fetchEndMembership,
    fetchAssignRole, fetchEndRole, fetchManagementPeople,
    fetchDisableAccount, fetchReactivateAccount, fetchReissueSetupCode,
    fetchStructure,
  } = useProduct()
  const navigate = useNavigate()
  const query = useQueryState()
  const section = (query.get("section", "identidad") ?? "identidad")
  const [dialog, setDialog] = useState<null | "identidad" | "membership-start" | "membership-end" | "account-disable" | "account-enable" | "code" | "role-assign" | "role-end">(null)
  const [issuingCode, setIssuingCode] = useState(false)
  const [code, setCode] = useState("")
  const [identity, setIdentity] = useState({ dni: "", birth: "", phone: "", email: "" })
  const [identityErrors, setIdentityErrors] = useState<Record<string, string>>({})
  const [loaded, setLoaded] = useState(() => (state.people?.length ?? 0) > 0)
  const [structure, setStructure] = useState<{ teams?: any[] } | null>(null)
  const [roleForm, setRoleForm] = useState({ role: "SUBCOMMITTEE", scopeType: "CLUB", scopeRefId: "", validFrom: todayIso(), reason: "" })
  const [roleError, setRoleError] = useState("")
  const [rolePending, setRolePending] = useState(false)
  const [endTarget, setEndTarget] = useState<string | null>(null)
  const [endReason, setEndReason] = useState("")

  useCallback(async () => {
    try {
      await fetchManagementPeople()
      try { setStructure(await fetchStructure()) } catch { /* noop */ }
    } finally {
      setLoaded(true)
    }
  }, [fetchManagementPeople, fetchStructure])()

  const person = state.people.find((item) => item.id === id)

  if (!authority.canOpen("people"))
    return (
      <div className="mx-auto max-w-3xl">
        <Empty title="No tenés acceso a las fichas de personas" detail="Reservado a administración." />
      </div>
    )
  if (!loaded)
    return (
      <p className="gei-meta p-6">Cargando…</p>
    )
  if (!person)
    return (
      <div className="mx-auto max-w-3xl">
        <Empty title="No encontramos a esa persona" detail="Revisá el enlace." />
      </div>
    )

  const memberships = (person.memberships ?? [])
  const teams = (person.teamAssignments ?? [])
  const roles = (person.roleAssignments ?? [])
  const completeness = profileCompleteness({ dni: person.dni ?? null, birth: person.birthDate ?? null, phone: person.phone ?? null, email: person.email ?? null } as any)
  const admin = authority.canManagePeople

  const primary = !admin ? null : memberships.length === 0
    ? { label: "Iniciar pertenencia", run: () => setDialog("membership-start") }
    : person.accountStatus === "PENDING"
      ? { label: "Emitir código de activación", run: () => setDialog("code") }
      : person.accountStatus === "DISABLED"
        ? { label: "Habilitar cuenta", run: () => setDialog("account-enable") }
        : null

  const tabs = [
    { id: "identidad", label: "Identidad", show: admin },
    { id: "pertenencia", label: "Pertenencia", show: admin },
    { id: "equipos", label: "Equipos", show: admin, count: teams.length },
    { id: "roles", label: "Roles", show: admin, count: roles.length },
    { id: "cuenta", label: "Cuenta", show: admin },
  ].filter((t) => t.show)

  return (
    <div className="gei-stack-page mx-auto max-w-4xl">
      <PageContextHeader
        context="Personas"
        title={personName(person)}
        back="/management/people"
        lead={admin ? (completeness.complete ? "Ficha administrativa." : `Faltan datos para poder asignarla: ${completeness.missing.map((i) => i.label).join(", ")}.`) : "Vista de coordinación."}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <StateBadge value={person.accountStatus ?? ""} emphasis />
            {primary && (<Button variant="primary" onClick={primary.run}>{primary.label}</Button>)}
          </div>
        }
        below={
          <div className="border-b border-line">
            <TabBar ariaLabel="Secciones de la ficha" active={section} onChange={(value) => query.set({ section: value })} tabs={tabs.map(({ id, label, count }) => ({ id, label, count }))} />
          </div>
        }
      />

      {section === "identidad" && (
        <div className="grid gap-4">
          {!completeness.complete && (
            <Banner tone="attention" title="Perfil incompleto"><span className="text-ink-strong">{completeness.missing.map((i) => i.label).join(", ")}.</span></Banner>
          )}
          <Surface className="grid gap-4">
            <SectionHeader title="Datos que administra el club" action={
              authority.canManagePeople && (<Button variant="secondary" size="sm" onClick={() => { setIdentity({ dni: person.dni ?? "", birth: person.birthDate ?? "", phone: person.phone ?? "", email: person.email ?? "" }); setDialog("identidad") }}>Corregir identidad</Button>)
            } />
            <RowStatic title="Nombre" detail={personName(person)} />
            {authority.canManagePeople && (
              <>
                <RowStatic title="Documento" detail={person.dni || "Sin cargar"} />
                <RowStatic title="Fecha de nacimiento" detail={person.birthDate ? dateLabel(person.birthDate, true) : "Sin cargar"} />
                <RowStatic title="Correo" detail={person.email || "Sin correo"} />
                <RowStatic title="Teléfono" detail={person.phone || "Sin teléfono"} />
              </>
            )}
            {!authority.canManagePeople && (
              <p className="gei-meta text-ink-muted">
                La información personal detallada la administra el club. Podés asignar roles dentro de tu alcance.
              </p>
            )}
          </Surface>
        </div>
      )}

      {section === "pertenencia" && (
        <div className="grid gap-4">
          {memberships.length === 0 ? (
            <Empty title="Sin pertenencia vigente" detail="La pertenencia es el vínculo con el club." action={authority.canManagePeople && (<Button variant="primary" onClick={() => setDialog("membership-start")}>Iniciar pertenencia</Button>)} />
          ) : (
            memberships.map((item) => (
              <Surface key={item.id} className="grid gap-3">
                <SectionHeader title="Pertenencia vigente" meta={periodLabel(item.validFrom, item.validUntil)} action={authority.canManagePeople && (<Button variant="danger" size="sm" onClick={() => setDialog("membership-end")}>Finalizar</Button>)} />
              </Surface>
            ))
          )}
        </div>
      )}

      {section === "equipos" && (
        <DetailSection title="Equipos" meta={`${teams.length} vigentes`}>
          {teams.length === 0 ? (<p className="gei-meta">No tiene equipos vigentes.</p>) : (
            <ul className="grid">{teams.map((a) => (<li key={a.id}><RowStatic title={teamName(state as any, a.teamId)} detail={periodLabel(a.validFrom, a.validUntil)} /></li>))}</ul>
          )}
        </DetailSection>
      )}

      {section === "roles" && (
        <DetailSection
          title="Roles y alcance"
          meta={`${roles.length} vigentes`}
          action={authority.canAssignRole && (
            <Button variant="secondary" size="sm" onClick={() => {
              setRoleForm({ role: authority.isAdmin ? "SUBCOMMITTEE" : "SUBCOMMITTEE", scopeType: "CLUB", scopeRefId: "", validFrom: todayIso(), reason: "" })
              setRoleError("")
              setDialog("role-assign")
            }}>Asignar rol</Button>
          )}
        >
          {roles.length === 0 ? (<p className="gei-meta">No tiene roles vigentes.</p>) : (
            <ul className="grid">
              {roles.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-line py-2.5 last:border-b-0">
                  <div className="min-w-0 flex-1">
                    <p className="gei-body-strong text-ink">{roleTextOf(r.role)}</p>
                    <p className="gei-meta">{roleScopeLabel(state as any, { ...r, scope: r.scopeType, target: r.scopeRefId } as any)} · {periodLabel(r.validFrom, r.validUntil)}</p>
                  </div>
                  {authority.canEndRole && (
                    <Button variant="danger" size="sm" onClick={() => { setEndTarget(r.id); setEndReason(""); setDialog("role-end") }}>Finalizar</Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </DetailSection>
      )}
      {section === "roles" && dialog === "role-assign" && (
        <Sheet title="Asignar rol" description="El alcance se valida según la autoridad." onClose={() => setDialog(null)} footer={
          <>
            <Button variant="quiet" onClick={() => setDialog(null)} disabled={rolePending}>Cancelar</Button>
            <Button variant="primary" busy={rolePending} disabled={rolePending} onClick={async () => {
              setRoleError("")
              const isTeam = roleForm.scopeType === "TEAM"
              if (isTeam && !roleForm.scopeRefId) { setRoleError("Elegí un equipo."); return }
              setRolePending(true)
              try {
                const assignment = await fetchAssignRole({ personId: id, role: roleForm.role, scopeType: roleForm.scopeType, scopeRefId: isTeam ? roleForm.scopeRefId : null, validFrom: roleForm.validFrom, reason: roleForm.reason || null }, crypto.randomUUID())
                await fetchManagementPeople()
                setDialog(null)
              } catch (err: any) {
                setRoleError(err?.message ?? "No se pudo asignar el rol.")
              } finally {
                setRolePending(false)
              }
            }}>Asignar rol</Button>
          </>
        }>
          <div className="grid gap-4">
            <Select label="Rol" value={roleForm.role} onChange={(event) => {
              const role = event.target.value
              let scopeType = "CLUB"
              if (role === "COACH" || role === "CAPTAIN") scopeType = "TEAM"
              setRoleForm((c) => ({ ...c, role, scopeType, scopeRefId: scopeType === "CLUB" ? "" : c.scopeRefId }))
            }}>
              {(authority.isAdmin ? ["ADMIN", "SUBCOMMITTEE", "COACH", "CAPTAIN"] : ["SUBCOMMITTEE"]).map((role) => (<option key={role} value={role}>{role}</option>))}
            </Select>
            {roleForm.scopeType === "TEAM" && (
              <Select label="Equipo" value={roleForm.scopeRefId} onChange={(event) => setRoleForm((c) => ({ ...c, scopeRefId: event.target.value }))}>
                <option value="">Elegí un equipo</option>
                {(structure?.teams ?? []).map((team: any) => (<option key={team.id} value={team.id}>{team.name}</option>))}
              </Select>
            )}
            <TextField label="Válido desde" type="date" required value={roleForm.validFrom} onChange={(event) => setRoleForm((c) => ({ ...c, validFrom: event.target.value }))} />
            <TextField label="Motivo (opcional)" value={roleForm.reason} onChange={(event) => setRoleForm((c) => ({ ...c, reason: event.target.value }))} />
            {roleError && <p className="gei-meta text-danger">{roleError}</p>}
            <p className="gei-meta">PLAYER se asigna exclusivamente por afiliación a un equipo (CMD-PPL-07), no por esta superficie.</p>
          </div>
        </Sheet>
      )}
      {section === "roles" && dialog === "role-end" && endTarget && (
        <ConfirmDialog title="Finalizar rol" consequence="El rol queda cerrado y el historial se conserva." confirmLabel="Finalizar rol" requireReason onClose={() => setDialog(null)} onConfirm={(reason) => {
          void (async () => {
            try { await fetchEndRole({ assignmentId: endTarget, at: todayIso(), reason: reason || null }, crypto.randomUUID()) } finally { await fetchManagementPeople().catch(() => {}) }
            setDialog(null)
            setEndTarget(null)
          })()
        }} />
      )}

      {section === "cuenta" && (
        <div className="grid gap-4">
          <Surface className="grid gap-3">
            <SectionHeader title="Estado de la cuenta" />
            <RowStatic title="Estado" detail={<StateBadge value={person.accountStatus ?? ""} emphasis />} />
            <RowStatic title="Credencial" detail="Configurada" />
          </Surface>
          <div className="flex flex-wrap gap-2">
            {authority.canManagePeople && person.accountStatus === "PENDING" && (<Button variant="primary" onClick={() => setDialog("code")}>Emitir código de activación</Button>)}
            {authority.canManagePeople && person.accountStatus === "ACTIVE" && (<Button variant="danger" onClick={() => setDialog("account-disable")}><Lock size={16} aria-hidden /> Deshabilitar cuenta</Button>)}
            {authority.canManagePeople && person.accountStatus === "DISABLED" && (<Button variant="primary" onClick={() => setDialog("account-enable")}><Unlock size={16} aria-hidden /> Habilitar cuenta</Button>)}
          </div>
        </div>
      )}

      {dialog === "identidad" && (
        <Modal title="Corregir identidad" description="Datos que el club administra." onClose={() => setDialog(null)} footer={
          <>
            <Button variant="quiet" onClick={() => setDialog(null)}>Cancelar</Button>
            <Button variant="primary" onClick={() => {
              const found: Record<string, string> = {}
              if (!identity.dni.trim()) found.dni = "El documento no puede quedar vacío."
              if (!identity.birth) found.birth = "La fecha no puede quedar vacía."
              setIdentityErrors(found)
              if (Object.keys(found).length > 0) return
              void fetchUpdatePersonAdmin({ personId: id, dni: identity.dni, birthDate: identity.birth, phone: identity.phone, email: identity.email }, crypto.randomUUID())
                .then(() => fetchManagementPeople().catch(() => {}))
                .finally(() => setDialog(null))
            }}>Guardar identidad</Button>
          </>
        }>
          <div className="grid gap-4">
            <TextField label="Documento de identidad" required value={identity.dni} error={identityErrors.dni} onChange={(event) => setIdentity((c) => ({ ...c, dni: event.target.value }))} />
            <TextField label="Fecha de nacimiento" type="date" required value={identity.birth} error={identityErrors.birth} onChange={(event) => setIdentity((c) => ({ ...c, birth: event.target.value }))} />
            <TextField label="Teléfono" value={identity.phone} onChange={(event) => setIdentity((c) => ({ ...c, phone: event.target.value }))} />
            <TextField label="Correo" type="email" value={identity.email} onChange={(event) => setIdentity((c) => ({ ...c, email: event.target.value }))} />
          </div>
        </Modal>
      )}

      {dialog === "membership-start" && (
        <ConfirmDialog title="Iniciar pertenencia" consequence={`Queda dentro del club desde hoy.`} confirmLabel="Iniciar pertenencia" tone="attention" onClose={() => setDialog(null)} onConfirm={() => {
          void (async () => {
            try { await fetchCreateMembership({ personId: id, validFrom: todayIso() }, crypto.randomUUID()) } finally { await fetchManagementPeople().catch(() => {}) }
            setDialog(null)
          })()
        }} />
      )}
      {dialog === "membership-end" && (
        <ConfirmDialog title="Finalizar pertenencia" consequence="El período queda cerrado y la historia se conserva." confirmLabel="Finalizar pertenencia" requireReason onClose={() => setDialog(null)} onConfirm={() => {
          void (async () => {
            const active = memberships.find((m) => !m.validUntil)
            try { if (active) await fetchEndMembership({ personId: id, membershipId: active.id, at: todayIso() }, crypto.randomUUID()) } finally { await fetchManagementPeople().catch(() => {}) }
            setDialog(null)
          })()
        }} />
      )}
      {dialog === "account-disable" && (
        <ConfirmDialog title="Deshabilitar cuenta" consequence="No va a poder entrar más." confirmLabel="Deshabilitar cuenta" requireReason onClose={() => setDialog(null)} onConfirm={() => {
          void (async () => {
            try { if (person.accountId) await fetchDisableAccount(person.accountId, { idempotencyKey: crypto.randomUUID() }) } finally { await fetchManagementPeople().catch(() => {}) }
            setDialog(null)
          })()
        }} />
      )}
      {dialog === "account-enable" && (
        <ConfirmDialog title="Habilitar cuenta" consequence="Vuelve a poder entrar al sistema." confirmLabel="Habilitar cuenta" tone="attention" onClose={() => setDialog(null)} onConfirm={() => {
          void (async () => {
            try { if (person.accountId) await fetchReactivateAccount(person.accountId, { idempotencyKey: crypto.randomUUID() }) } finally { await fetchManagementPeople().catch(() => {}) }
            setDialog(null)
          })()
        }} />
      )}
      {dialog === "code" && (
        <Modal title="Código de activación" description="Vigente por 7 días y de un solo uso." onClose={() => setDialog(null)} footer={
          <>
            <Button variant="quiet" onClick={() => setDialog(null)}>Cerrar</Button>
            <Button variant="primary" busy={issuingCode} disabled={issuingCode || !person.accountId} onClick={async () => {
              if (!person.accountId) return
              setIssuingCode(true)
              try {
                const res = await fetchReissueSetupCode(person.accountId, { idempotencyKey: crypto.randomUUID() })
                setCode(res.setupCode ?? "")
              } catch {
                setCode("ERROR")
              } finally {
                setIssuingCode(false)
              }
            }}>Emitir código</Button>
          </>
        }>
          <div className="grid gap-4">
            {code === "ERROR" ? (<Banner tone="danger" title="No se pudo emitir"><span className="gei-meta text-ink-strong">Revisá que la cuenta esté activa e intentá de nuevo.</span></Banner>) : code ? (<Banner tone="success" title="Código emitido"><span className="gei-body-strong tabular-nums text-ink">{code}</span><span className="gei-meta mt-1 text-ink-strong">Copialo ahora: no se vuelve a mostrar.</span></Banner>) : (<p className="gei-meta">Se genera un código de un solo uso vigente por 7 días para esta cuenta.</p>)}
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ESTRUCTURA */

export function StructurePage() {
  const { authority, fetchStructure, fetchArchiveTeam } = useProduct()
  const navigate = useNavigate()
  const query = useQueryState()
  const tab = (query.get("tab", "VENUE") ?? "VENUE")
  const [loaded, setLoaded] = useState(false)
  const [data, setData] = useState<{ seasons: any[]; divisions: any[]; lines: any[]; teams: any[]; venues: any[]; competitions: any[] } | null>(null)
  const [archiveTarget, setArchiveTarget] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [venueEdit, setVenueEdit] = useState<{ id: string; name: string; address: string; fieldLabel: string } | null>(null)

  useCallback(async () => { const d = await fetchStructure(); setData(d); setLoaded(true) }, [fetchStructure])()

  const structure = data
  const items = structure ? [...structure.seasons, ...structure.divisions, ...structure.lines, ...structure.venues].map((item) => ({ ...item, type: item.type })) : []
  const typed = items as Array<{ id: string; name: string; type: StructureType; archived: boolean; parentId?: string | null }>
  const filtered = typed.filter((item) => item.type === tab)
  const archived = filtered.filter((item) => item.archived)
  const active = filtered.filter((item) => !item.archived)

  if (!authority.canOpen("structure"))
    return (
      <div className="mx-auto max-w-3xl">
        <Empty title="La estructura la administra el club" detail="Temporadas, divisiones, líneas y sedes." />
      </div>
    )

  return (
    <div className="gei-stack-page mx-auto max-w-4xl">
      <PageContextHeader
        context="Estructura"
        title="Estructura del club"
        lead="Lo que sostiene todo lo demás. Archivar no borra: se puede restaurar."
        below={
          <div className="border-b border-line">
            <TabBar ariaLabel="Tipo de estructura" active={tab} onChange={(value) => query.set({ tab: value })} tabs={["SEASON", "DIVISION", "LINE", "VENUE"].map((type) => ({ id: type, label: STRUCTURE_LABEL[type as StructureType], count: active.filter((item) => item.type === type).length }))} />
          </div>
        }
      />

      {error && <Banner tone="danger" title="No se puede archivar"><span className="text-ink-strong">{error}</span></Banner>}

      {active.length === 0 ? (
        <Empty title="Nada activo en esta sección" detail="Podés restaurar algo archivado." />
      ) : (
        <Surface flush>
          <ul className="grid px-1 py-1">
            {active.map((item) => {
              const teams = structure!.teams.filter((team) =>
                (item.type === "DIVISION" && team.divisionId === item.id) ||
                (item.type === "LINE" && team.lineId === item.id) ||
                (item.type === "SEASON" && team.seasonId === item.id)
              )
              return (
                <li key={item.id}>
                  <RowStatic
                    title={item.name}
                    detail={item.type === "DIVISION" ? `Temporada ${structure!.seasons.find((s) => s.id === item.parentId)?.name ?? "—"}` : item.type === "VENUE" ? structure!.venues.find((venue) => venue.id === item.id)?.address : teams.length > 0 ? `${teams.length} ${teams.length === 1 ? "equipo lo usa" : "equipos lo usan"}` : undefined}
                    trailing={
                      <span className="flex flex-wrap justify-end gap-1">
                        {item.type === "VENUE" && (
                          <Button variant="secondary" size="sm" onClick={() => { const venue = structure!.venues.find((v) => v.id === item.id); setVenueEdit({ id: item.id, name: venue?.name ?? "", address: venue?.address ?? "", fieldLabel: venue?.fieldLabel ?? "" }) }}>Editar</Button>
                        )}
                        <Button variant="danger" size="sm" onClick={() => setArchiveTarget(item.id)}>Archivar</Button>
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
                <RowStatic title={item.name} detail="Archivado. Sigue existiendo y se puede volver a usar." trailing={
                  <Button variant="secondary" size="sm" onClick={() => { void fetchArchiveTeam(item.id as string); setError("") }}>Restaurar</Button>
                } />
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {archiveTarget && (
        <ConfirmDialog title="Archivar" consequence="Deja de estar disponible para elegir. No se borra." confirmLabel="Archivar" requireReason reasonLabel="Por qué se archiva" onClose={() => setArchiveTarget(null)} onConfirm={(reason) => { void fetchArchiveTeam(archiveTarget as string); setArchiveTarget(null); void reason }} />
      )}

      {venueEdit && (
        <Modal title="Editar datos de la sede" description="Corrección administrativa." onClose={() => setVenueEdit(null)} footer={
          <>
            <Button variant="quiet" onClick={() => setVenueEdit(null)}>Cancelar</Button>
            <Button variant="primary" onClick={() => { setVenueEdit(null) }}>Guardar sede</Button>
          </>
        }>
          <div className="grid gap-4">
            <TextField label="Nombre" required value={venueEdit.name} onChange={(event) => setVenueEdit((c) => c ? { ...c, name: event.target.value } : c)} />
            <TextField label="Dirección" required value={venueEdit.address} onChange={(event) => setVenueEdit((c) => c ? { ...c, address: event.target.value } : c)} />
            <TextField label="Cancha" value={venueEdit.fieldLabel} onChange={(event) => setVenueEdit((c) => c ? { ...c, fieldLabel: event.target.value } : c)} />
          </div>
        </Modal>
      )}
    </div>
  )
}

/* COMPETENCIAS */

export function CompetitionsPage() {
  const { id: competitionId } = useParams()
  const { state, authority, fetchCompetitions, fetchCreateCompetition } = useProduct()
  const navigate = useNavigate()
  const [newOpen, setNewOpen] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ name: "", organizer: "" })
  const [loaded, setLoaded] = useState(false)
  const [data, setData] = useState<any[] | null>(null)

  useCallback(async () => { const d = await fetchCompetitions(); setData(d); setLoaded(true) }, [fetchCompetitions])()

  if (!authority.canOpen("competitions"))
    return (
      <div className="mx-auto max-w-3xl">
        <Empty title="Las competencias no están en tu alcance" detail="Las ven la Subcomisión y la administración." />
      </div>
    )

  const competitions = loaded ? (data ?? []) : (state.competitions ?? [])
  const competition = competitions.find((item) => item.id === competitionId)
  const canMutate = authority.canManageCompetitions
  const archived = !!competition?.archivedAt
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({ name: "", organizer: "" })
  const [archiveOpen, setArchiveOpen] = useState(false)

  if (!competition)
    return (
      <div className="gei-stack-page mx-auto max-w-4xl">
        <PageContextHeader context="Competencias" title="Competencias" lead="Contexto deportivo." action={canMutate && (<Button variant="primary" onClick={() => setNewOpen(true)}>Crear competencia</Button>)} />
        <div className="grid gap-1">
          {competitions.filter((item) => !item.archivedAt).map((item) => (
            <RowLink key={item.id} to={`/management/competitions/${item.id}`} title={item.name} detail={item.organizer ?? ""} />
          ))}
        </div>
        {competitions.some((item) => item.archivedAt) && (
          <DetailSection title="Archivadas" meta={`${competitions.filter((item) => item.archivedAt).length}`}>
            <div className="grid gap-1">
              {competitions.filter((item) => item.archivedAt).map((item) => (
                <RowLink key={item.id} to={`/management/competitions/${item.id}`} title={item.name} detail={`${item.organizer ?? ""} · archivada`} meta={<StateBadge value="ARCHIVED" />} />
              ))}
            </div>
          </DetailSection>
        )}
        {newOpen && (
          <Modal title="Crear competencia" onClose={() => setNewOpen(false)} footer={
            <>
              <Button variant="quiet" onClick={() => setNewOpen(false)}>Cancelar</Button>
              <Button variant="primary" onClick={() => {
                if (!form.name.trim()) { setError("Poné un nombre."); return }
                fetchCreateCompetition({ name: form.name.trim(), organizer: form.organizer.trim() }, String(Math.random()))
                setNewOpen(false)
              }}>Crear</Button>
            </>
          }>
            <div className="grid gap-4">
              <TextField label="Nombre" required value={form.name} onChange={(event) => setForm((c) => ({ ...c, name: event.target.value }))} />
              <TextField label="Organizador" value={form.organizer} onChange={(event) => setForm((c) => ({ ...c, organizer: event.target.value }))} />
              {error && <p className="text-meta font-medium text-danger">{error}</p>}
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
        lead={competition.organizer ?? ""}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <StateBadge value={archived ? "ARCHIVED" : "ACTIVE"} emphasis />
            {canMutate && !archived && (<Button variant="secondary" onClick={() => { setEditForm({ name: competition.name, organizer: competition.organizer ?? "" }); setEditOpen(true) }}>Editar</Button>)}
          </div>
        }
        below={archived ? (<Banner tone="neutral" title="Competencia archivada"><span className="text-ink-strong">Quedó como lectura histórica.</span></Banner>) : undefined}
      />

      {error && <Banner tone="danger" title="No se pudo aplicar el cambio"><span className="text-ink-strong">{error}</span></Banner>}

      <DetailSection title="Jornadas" meta="Sin jornadas"><p className="gei-meta">Ninguna jornada referencia a esta competencia.</p></DetailSection>
      <DetailSection title="Partidos" meta="Sin partidos"><p className="gei-meta">Ningún partido referencia a esta competencia.</p></DetailSection>

      {canMutate && !archived && (
        <div className="flex flex-wrap gap-2"><Button variant="danger" onClick={() => setArchiveOpen(true)}>Archivar competencia</Button></div>
      )}

      {editOpen && (
        <Modal title="Editar competencia" onClose={() => setEditOpen(false)} footer={
          <>
            <Button variant="quiet" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={() => { if (!editForm.name.trim()) { setError("Poné un nombre."); return } setEditOpen(false) }}>Guardar</Button>
          </>
        }>
          <div className="grid gap-4">
            <TextField label="Nombre" required value={editForm.name} onChange={(event) => setEditForm((c) => ({ ...c, name: event.target.value }))} />
            <TextField label="Organizador" value={editForm.organizer} onChange={(event) => setEditForm((c) => ({ ...c, organizer: event.target.value }))} />
          </div>
        </Modal>
      )}

      {archiveOpen && (
        <ConfirmDialog title="Archivar competencia" consequence="Quedará como lectura histórica." confirmLabel="Archivar" requireReason onClose={() => setArchiveOpen(false)} onConfirm={() => { setArchiveOpen(false) }} />
      )}
    </div>
  )
}

/* EQUIPOS (roster básico) */

export function TeamAdmin() {
  const { id: teamId = "" } = useParams()
  const { authority, fetchStructure, fetchRoster, state } = useProduct()
  const [roster, setRoster] = useState<any[] | null>(() => state.roster?.length ? state.roster : null)
  const [team, setTeam] = useState<any | null>(() => (state.teams ?? []).find((item: any) => item.id === teamId) ?? null)
  const [error, setError] = useState("")
  const [loaded, setLoaded] = useState(() => (state.teams ?? []).some((item: any) => item.id === teamId))

  useCallback(async () => {
    try {
      const structure = await fetchStructure()
      const found = (structure.teams ?? []).find((item: any) => item.id === teamId)
      setTeam(found ?? null)
      if (found) {
        const items = await fetchRoster(teamId)
        setRoster(items)
      }
    } catch (err: any) {
      setError(err?.message ?? "No tenés acceso a este equipo.")
    } finally {
      setLoaded(true)
    }
  }, [teamId, fetchStructure, fetchRoster])()

  if (!authority.canOpen("teams"))
    return (
      <div className="mx-auto max-w-3xl">
        <Empty title="No tenés acceso a este equipo" detail="Reservado a quienes tienen alcance sobre este equipo." />
      </div>
    )
  if (!loaded)
    return (
      <p className="gei-meta p-6">Cargando…</p>
    )
  if (error)
    return (
      <div className="mx-auto max-w-3xl">
        <Banner tone="danger" title="No se pudo abrir este roster"><span className="text-ink-strong">{error}</span></Banner>
      </div>
    )

  return (
    <div className="gei-stack-page mx-auto max-w-4xl">
      <PageContextHeader context="Equipos" title={team?.name ?? "Equipo"} lead="Roster del equipo." />
      <Surface flush>
        <ul className="grid px-1 py-1">
          {(roster ?? []).map((person: any) => (
            <li key={person.personId}>
              <RowStatic title={`${person.firstName} ${person.lastName}`} detail={person.accountStatus ?? ""} />
            </li>
          ))}
          {(roster ?? []).length === 0 && <li className="px-3 py-3"><p className="gei-meta">Todavía no hay jugadores cargadas en este equipo.</p></li>}
        </ul>
      </Surface>
    </div>
  )
}
