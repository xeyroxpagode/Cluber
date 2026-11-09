import { useCallback, useEffect, useMemo, useState } from "react"
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
import { useProduct as useRealProduct } from "../lib/session-context"
import { todayIso } from "../mock/clock"
import { login as apiLogin, activate as apiActivate } from "../lib/session"
import { fetchAudit } from "../lib/api-client"
import type { AuditEntry } from "../lib/api-client"
import {
  dateLabel,
  dateTimeLabel,
  eventName,
  periodLabel,
  relativeLabel,
  roleTextOf,
  teamName,
  type Event,
} from "../mock/model"
import {
  activeMemberships,
  activeRoleAssignments,
  activeTeamAssignments,
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
      detail: "Contexto deportivo: crear, editar, archivar y consultar",
      show: authority.canOpen("competitions"),
    },
  ]
  const pending = state.jornadas.filter((jornada) =>
    visibleEvents(state, actor.id).some((event) =>
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
  const { changePassword, logout, me, fetchSelfIdentity, fetchSelfPhone, fetchStructure } = useRealProduct()
  const [meData, setMeData] = useState<any | null>(null)
  const [structure, setStructure] = useState<{ teams?: any[] } | null>(null)
  const [identityOpen, setIdentityOpen] = useState(false)
  const [identityDraft, setIdentityDraft] = useState({ firstName: "", lastName: "" })
  const [identityError, setIdentityError] = useState("")
  const [identitySaved, setIdentitySaved] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const query = useQueryState()

  const refresh = useCallback(async () => {
    try {
      const m: any = await me()
      setMeData(m)
    } catch {
      setMeData(null)
    }
  }, [me])

  useEffect(() => { refresh() }, [refresh])
  useEffect(() => { fetchStructure().then(setStructure).catch(() => void 0) }, [fetchStructure])

  const personName = `${meData?.firstName ?? ""} ${meData?.lastName ?? ""}`.trim() || meData?.username || meData?.principal?.username || "Vos"
  const accountStatus = meData?.accountStatus ?? "ACTIVE"
  const membershipActive = Boolean(meData?.membershipActive)
  const membershipValidFrom = meData?.activatedAt ?? null
  const teamIds: string[] = meData?.teams ?? []
  const teamNameMap = new Map((structure?.teams ?? []).map((team: any) => [String(team.id), String(team.name)]))
  const teamObjects: Array<{ id: string; name: string }> = teamIds.map((id) => ({ id: String(id), name: teamNameMap.get(String(id)) ?? "Equipo" }))
  const ROLE_TEXT: Record<string, string> = { PLAYER: "Jugadora", CAPTAIN: "Capitana", COACH: "Entrenadora", SUBCOMMITTEE: "Subcomisión", ADMIN: "Administración" }
  const now = new Date()
  const roles = (meData?.roleAssignments ?? [])
    .filter((assignment: any) => !assignment.validUntil || new Date(assignment.validUntil) > now)
    .map((assignment: any) => {
      const scopeLabel = assignment.scopeType === "CLUB" ? "Ámbito club" : assignment.scopeType === "TEAM" ? (teamNameMap.get(String(assignment.scopeRefId ?? "")) ?? "Equipo") : "Ámbito club"
      return {
        id: String(assignment.id),
        role: String(assignment.role),
        label: ROLE_TEXT[assignment.role] ?? String(assignment.role),
        scopeLabel,
        validFrom: String(assignment.validFrom),
        validUntil: assignment.validUntil ? String(assignment.validUntil) : null,
      }
    })
  const profileCompleted = meData?.profileCompleted !== false
  const principal = meData?.principal ?? null
  const passwordSet = (meData?.credentialVersion ?? (principal?.credentialVersion ?? null)) ?? null
  const expiresAt = principal?.expiresAt ?? null
  void query

  return (
    <div className="gei-stack-page mx-auto max-w-3xl">
      <PageContextHeader
        context="Mi perfil"
        title={personName}
        lead="Quién sos, qué permisos tenés y cómo entrar a tu cuenta."
        action={<Avatar name={personName} size="lg" selected />}
      />

      {!profileCompleted && (
        <Banner tone="attention" title="Tu perfil necesita algunos datos para poder ser asignada correctamente">
          <span className="text-ink-strong">
            La administración del club todavía no cargó todos los datos de tu profile. Avisales para que lo completen.
          </span>
        </Banner>
      )}

      <DetailSection
        title="Identidad"
        action={<Button variant="secondary" size="sm" onClick={() => {
          setIdentityDraft({ firstName: meData?.firstName ?? "", lastName: meData?.lastName ?? "" })
          setIdentityError("")
          setIdentityOpen(true)
        }}>Editar</Button>}
      >
        <KeyValue
          items={[
            { label: "Nombre", value: personName },
            { label: "Nombre de usuario", value: meData?.username ?? meData?.principal?.username ?? "Sin definir" },
            {
              label: "Cuenta",
              value: <StateBadge value={accountStatus} emphasis />,
            },
          ]}
        />
        {identitySaved && <p className="gei-meta mt-2">Datos de identidad guardados.</p>}
      </DetailSection>

      <DetailSection title="Pertenencia" meta="Tu vínculo con el club">
        {!membershipActive ? (
          <Banner tone="attention" title="No tenés una pertenencia vigente">
            <span className="text-ink-strong">
              La pertenencia es el vínculo con el club. Sin ella no podés entrar a
              la temporada. La administra el club.
            </span>
          </Banner>
        ) : (
          <KeyValue items={[{ label: "Vigencia", value: "Activa" }]} />
        )}
        {teamObjects.length > 0 ? (
          <div className="mt-3">
            <p className="gei-meta mb-1">Equipos vigentes</p>
            <ul className="grid gap-1">
              {teamObjects.map((team) => (
                <li key={team.id}>
                  <RowStatic title={team.name} detail="Vigente" />
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
          <p className="gei-meta">No tenés roles deportivos vigentes.</p>
        ) : (
          <ul className="grid">
            {roles.map((role: any) => (
              <li key={role.id}>
                <RowStatic
                  title={role.label}
                  detail={`${role.scopeLabel} · ${periodLabel(
                    role.validFrom.slice(0, 10),
                    role.validUntil ? role.validUntil.slice(0, 10) : null,
                  )}`}
                />
              </li>
            ))}
          </ul>
        )}
      </DetailSection>

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
            { label: "Correo", value: meData?.email ?? "Sin correo" },
            { label: "Teléfono", value: meData?.phone ?? "Sin teléfono" },
          ]}
        />
        <p className="gei-meta mt-2">El club gestiona el correo de tu cuenta.</p>
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
                value: (passwordSet ?? 0) > 0 ? "Configurada" : "Sin configurar",
              },
              {
                label: "Sesión",
                value: expiresAt ? `Vigente hasta ${dateTimeLabel(expiresAt)}` : "Sesión actual",
              },
            ]}
          />
          <div>
            <p className="gei-body-strong">Sesiones activas</p>
            <ul className="mt-2 grid gap-2">
              <li className="flex flex-wrap items-center gap-3 rounded-control border border-selected-line bg-selected-soft px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="gei-body-strong text-ink">
                    Esta sesión
                  </p>
                  <p className="gei-meta">
                    {expiresAt ? `Abierta hasta ${dateTimeLabel(expiresAt)}` : "Sesión actual"} · Credencial v{passwordSet ?? 1}
                  </p>
                </div>
                <Tag tone="selected">Actual</Tag>
                <Button variant="danger" size="sm" onClick={logout}>
                  Cerrar sesión
                </Button>
              </li>
            </ul>
            <p className="gei-meta mt-2">
              No hay otras sesiones para mostrar todavía. Cuando el club habilite el listado de sesiones, aparecerán acá.
            </p>
          </div>
        </div>
      </DetailSection>

      {!profileCompleted && (
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
          onSubmit={async (current, next) => {
            const ok = await changePassword(current, next, crypto.randomUUID())
            return ok ? { ok: true } : { ok: false, error: "No pudimos cambiar la contraseña. Revisá la actual y probá de nuevo." }
          }}
        />
      )}

      {contactOpen && (
        <ContactDialog
          phone={meData?.phone ?? ""}
          email={meData?.email ?? "Sin correo"}
          onClose={() => setContactOpen(false)}
          onSubmit={async ({ phone }) => {
            await fetchSelfPhone({ phone: phone === "" ? null : phone, idempotencyKey: crypto.randomUUID() })
            setContactOpen(false)
            await refresh()
          }}
        />
      )}

      {identityOpen && (
        <IdentityDialog
          firstName={identityDraft.firstName}
          lastName={identityDraft.lastName}
          error={identityError}
          onClose={() => setIdentityOpen(false)}
          onSubmit={async (firstName, lastName) => {
            setIdentityError("")
            try {
              await fetchSelfIdentity({ firstName, lastName, idempotencyKey: crypto.randomUUID() })
              setIdentityOpen(false)
              setIdentitySaved(true)
              await refresh()
              return { ok: true }
            } catch (err: any) {
              const msg = err?.message ?? "No pudimos guardar los datos."
              setIdentityError(msg)
              return { ok: false, error: msg }
            }
          }}
        />
      )}
    </div>
  )
}

function PasswordDialog({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (current: string, next: string) => Promise<{ ok: boolean; error?: string }>
}) {
  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  return (
    <Sheet
      title="Cambiar contraseña"
      description="Necesita al menos 15 caracteres."
      onClose={onClose}
      footer={
        <>
          <Button variant="quiet" onClick={onClose} disabled={pending}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            busy={pending}
            disabled={pending}
            onClick={async () => {
              setPending(true)
              const result = await onSubmit(current, next)
              setPending(false)
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
          hint="Mínimo 15 caracteres."
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
  onSubmit: (data: { phone: string; email: string }) => Promise<void>
}) {
  const [form, setForm] = useState({ phone, email })
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  return (
    <Sheet
      title="Editar contacto"
      description="El club gestiona el correo de tu cuenta."
      onClose={onClose}
      footer={
        <>
          <Button variant="quiet" onClick={onClose} disabled={pending}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            busy={pending}
            disabled={pending}
            onClick={async () => {
              if (!form.phone.trim()) { setError("Escribí un teléfono."); return }
              setPending(true)
              try { await onSubmit(form) } finally { setPending(false) }
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
          error={error || undefined}
          hint="El club lo usa para contactarte."
          onChange={(event) => {
            setForm((current) => ({ ...current, phone: event.target.value }))
            setError("")
          }}
        />
        <TextField
          label="Correo"
          type="email"
          value={form.email}
          disabled
          hint="El club lo gestiona; no se puede cambiar desde acá."
        />
      </div>
    </Sheet>
  )
}

function IdentityDialog({
  firstName,
  lastName,
  error,
  onClose,
  onSubmit,
}: {
  firstName: string
  lastName: string
  error: string
  onClose: () => void
  onSubmit: (firstName: string, lastName: string) => Promise<{ ok: boolean; error?: string }>
}) {
  const [form, setForm] = useState({ firstName, lastName })
  const [pending, setPending] = useState(false)
  return (
    <Sheet
      title="Editar identidad"
      description="Tu nombre como figura en el club."
      onClose={onClose}
      footer={
        <>
          <Button variant="quiet" onClick={onClose} disabled={pending}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            busy={pending}
            disabled={pending}
            onClick={async () => {
              const first = form.firstName.trim()
              const last = form.lastName.trim()
              if (!first || !last) return
              setPending(true)
              try { await onSubmit(first, last) } finally { setPending(false) }
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
          value={form.firstName}
          error={error || undefined}
          onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
        />
        <TextField
          label="Apellido"
          required
          value={form.lastName}
          onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
        />
      </div>
    </Sheet>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ACCESO
   ═══════════════════════════════════════════════════════════════ */

export function LoginPage() {
  const navigate = useNavigate()
  const { authenticated, loading } = useRealProduct()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && authenticated) navigate("/home", { replace: true })
  }, [authenticated, loading, navigate])
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
        onSubmit={async (event) => {
          event.preventDefault()
          setSubmitting(true)
          setError("")
          try {
            const ok = await apiLogin(email.trim(), password, String(Math.random()))
            if (ok) navigate("/home")
            else setError("No encontramos esa cuenta activa con ese correo y contraseña.")
          } catch {
            setError("No se pudo completar el inicio de sesión. Intentá de nuevo.")
          } finally {
            setSubmitting(false)
          }
        }}
        className="grid gap-4"
      >
        <TextField
          label="Correo electrónico"
          type="email"
          required
          value={email}
          error={error}
          placeholder="nombre@ejemplo.com"
          hint="Es el correo que el club registró para vos."
          onChange={(event) => {
            setEmail(event.target.value)
            setError("")
          }}
        />
        <TextField
          label="Contraseña"
          type="password"
          required
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
            setError("")
          }}
        />
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Ingresando…" : "Entrar"}
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
  const { state } = useProduct()
  const navigate = useNavigate()
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [ok, setOk] = useState(false)
  const [submitting, setSubmitting] = useState(false)
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
            Ya podés entrar con tu correo electrónico.
          </span>
        </Banner>
      ) : (
        <form
          onSubmit={async (event) => {
            event.preventDefault()
            setSubmitting(true)
            setError("")
            try {
              if (newPassword !== confirm) throw new Error("Las contraseñas no coinciden.")
              if (newPassword.length < 15) throw new Error("La contraseña debe tener entre 15 y 128 caracteres.")
              const result = await apiActivate(code.trim(), newPassword, String(Math.random()))
              if (result.ok) setOk(true)
              else setError(result.errorCode ?? "Ese código no sirve o expiró.")
            } catch (e: any) {
              setError(e?.message ?? "No se pudo activar la cuenta.")
            } finally {
              setSubmitting(false)
            }
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
          <TextField
            label="Nueva contraseña"
            type="password"
            required
            value={newPassword}
            error={error}
            placeholder="•••••••••••••••"
            hint="Entre 15 y 128 caracteres."
            onChange={(event) => {
              setNewPassword(event.target.value)
              setError("")
            }}
          />
          <TextField
            label="Confirmar contraseña"
            type="password"
            required
            value={confirm}
            error={error}
            placeholder="•••••••••••••••"
            onChange={(event) => {
              setConfirm(event.target.value)
              setError("")
            }}
          />
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Activando…" : "Activar cuenta"}
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
        lead="Tu cuenta está activa pero el club todavía no te asignó un rol."
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
  const { state, actor } = useProduct()
  const query = useQueryState()
  const team = query.get("team")
  const period = query.get("period")
  const scoped = visibleEvents(state, actor.id)
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
  const { authority, fetchAudit } = useRealProduct()
  const query = useQueryState()
  const from = (query.get("from") ?? "")
  const to = (query.get("to") ?? "")
  const actorFilter = (query.get("actor") ?? "")
  const [entries, setEntries] = useState<AuditEntry[]>([])
  const [actors, setActors] = useState<string[]>([])

  useCallback(async () => {
    const items = await fetchAudit(200)
    setEntries(items)
    setActors(Array.from(new Set(items.map((item) => String(item.actorPersonId ?? "")).filter(Boolean))))
  }, [fetchAudit])()

  if (!authority.canViewAudit)
    return (
      <div className="mx-auto max-w-3xl">
        <Empty
          title="El historial es de administración"
          detail="Sólo la administración del club puede ver quién hizo qué."
        />
      </div>
    )

  const filtered = entries.filter((entry) => {
    const day = entry.occurredAt.slice(0, 10)
    if (from && day < from) return false
    if (to && day > to) return false
    if (actorFilter && String(entry.actorPersonId ?? "") !== actorFilter) return false
    return true
  })

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
              {actors.map((actorId) => (
                <option key={actorId} value={actorId}>{actorId}</option>
              ))}
            </Select>
            {(from || to || actorFilter) && (
              <Button variant="quiet" onClick={() => query.reset(["from", "to", "actor"])}>
                Quitar filtros
              </Button>
            )}
          </div>
        }
      />

      {filtered.length === 0 ? (
        <Empty
          title="No hay cambios en ese rango"
          detail={`El historial tiene ${entries.length} movimientos en total. Ajustá las fechas para verlos.`}
          icon={<ShieldCheck size={22} />}
        />
      ) : (
        <Surface flush>
          <HistoryList
            entries={filtered.map((entry) => ({
              action: entry.action,
              actor: String(entry.actorPersonId ?? ""),
              at: dateTimeLabel(entry.occurredAt),
              before: String(entry.diff ?? ""),
              after: "",
              reason: entry.reason ?? "",
              to: `${entry.targetType}:${entry.targetId ?? ""}`,
            }))}
          />
        </Surface>
      )}
    </div>
  )
}