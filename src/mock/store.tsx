import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { createSeed } from "./seed"
import type {
  Announcement,
  Competition,
  CompetitionEntry,
  EligibilityConstraint,
  Event,
  GuardianRelationship,
  Membership,
  NewCompetitionEntry,
  Notice,
  CompetitionEntryLine,
  CompetitionEntryTeam,
  NotificationType,
  Person,
  Response,
  SeriesScope,
  State,
} from "./model"
import { addDays, todayIso } from "./clock"
import { classifyChange } from "./impact"
import { seriesOccurrences } from "./series"
import { getAuthority, type Authority } from "./authority"
import { activeRoleAssignments } from "./derive"
import { profileCompleteness } from "./derive"

const uid = () => crypto.randomUUID()
export const nowIso = () => new Date().toISOString()

export const wait = (duration = 380) =>
  new Promise<void>((resolve) => setTimeout(resolve, duration))

export class StaleVersionError extends Error {
  baseline: Record<string, unknown>
  local: Record<string, unknown>
  latest: Record<string, unknown>
  constructor(
    message: string,
    baseline: Record<string, unknown>,
    local: Record<string, unknown>,
    latest: Record<string, unknown>,
  ) {
    super(message)
    this.name = "StaleVersionError"
    this.baseline = baseline
    this.local = local
    this.latest = latest
  }
}

export interface SeriesChangeResult {
  occurrenceIds: string[]
  kind: ReturnType<typeof classifyChange>
}

export interface VenueChangeResult {
  before: string
  after: string
}

interface ProductApi {
  state: State
  actor: Person
  authority: Authority
  childId: string | null
  setChildId: (id: string | null) => void
  authenticated: boolean
  hasAccess: boolean
  login: (username: string) => boolean
  logout: () => void
  toast: (message: string) => void
  toastMessage: string
  update: (
    recipe: (draft: State) => void,
    audit?: {
      action: string
      resource: string
      before?: string | null
      after?: string | null
      source?: string
      route?: string
    },
  ) => void
  /** Escritura no material: sin coordination_revision++, sin impacto, sin aviso. */
  patchEventMeta: (
    id: string,
    patch: Partial<Event>,
    reason: string,
  ) => void
  /** D1 — el alcance seleccionado determina exactamente qué ocurrencias mutan. */
  applyEventChange: (
    originId: string,
    patch: Partial<Event>,
    scope: SeriesScope,
    operation: string,
  ) => Promise<SeriesChangeResult>
  transitionEvent: (
    id: string,
    to: Event["state"],
    reason: string,
  ) => Promise<void>
  respondAvailability: (
    eventId: string,
    personId: string,
    value: Response,
  ) => Promise<void>
  publishSelection: (
    eventId: string,
    selected: string[],
    expectedVersion: number,
  ) => Promise<void>
  openAttendance: (eventId: string) => Promise<void>
  closeAttendance: (eventId: string, reason: string) => Promise<void>
  markAttendance: (
    eventId: string,
    personId: string,
    value: "PRESENT" | "ABSENT" | "JUSTIFIED",
    reason?: string,
  ) => void
  finalizeRecord: (
    eventId: string,
    patch: Event["record"],
    reason: string,
  ) => Promise<void>
  correctRecord: (
    eventId: string,
    patch: Event["record"],
    reason: string,
  ) => void
  changeEventVenue: (eventId: string, venueId: string) => Promise<void>
  renameVenueMetadata: (
    venueId: string,
    data: { name?: string; address?: string; fieldLabel?: string },
  ) => void
  /* Personas y cuentas */
  createPerson: (data: {
    name: string
    email: string
    phone: string
    dni: string
    birth: string
    teamId: string | null
    role: Person["roleAssignments"] extends never ? never : string
  }) => string
  updateIdentity: (
    personId: string,
    data: { name?: string; phone?: string; email?: string; dni?: string; birth?: string },
  ) => void
  startMembership: (personId: string) => void
  endMembership: (personId: string, reason: string) => void
  setAccountState: (
    personId: string,
    next: Person["account"],
    reason: string,
  ) => { ok: boolean; error?: string }
  issueSetupToken: (personId: string) => string
  activateAccount: (code: string) => { ok: boolean; error?: string }
  createGuardianRelationship: (data: {
    guardianId: string
    childId: string
    relation: string
    canViewChildInfo: boolean
    canRespondAvailability: boolean
  }) => void
  endGuardianRelationship: (id: string, reason: string) => void
  createConstraint: (data: Omit<EligibilityConstraint, "id" | "createdAt" | "createdBy">) => void
  endConstraint: (id: string, reason: string) => void
  /* Competencias */
  createCompetition: (data: { name: string; organizer: string }) => string
  addCompetitionEntry: (
    competitionId: string,
    entry: NewCompetitionEntry,
  ) => { ok: boolean; error?: string }
  setCompetitionState: (
    competitionId: string,
    state: Competition["state"],
  ) => { ok: boolean; error?: string }
  setEntryState: (
    competitionId: string,
    entryId: string,
    state: CompetitionEntry["state"],
  ) => { ok: boolean; error?: string }
  /* Estructura */
  setStructureArchived: (
    id: string,
    archived: boolean,
  ) => { ok: boolean; error?: string }
  updateJornada: (
    id: string,
    patch: Partial<State["jornadas"][number]>,
    reason: string,
  ) => void
  createJornada: (data: {
    name: string
    seasonId: string
    competitionId: string
    eventIds: string[]
  }) => { ok: boolean; id?: string; error?: string }
  /* Comunicación */
  sendMessage: (conversationId: string, body: string) => Promise<void>
  deleteMessage: (conversationId: string, messageId: string) => void
  markConversationRead: (conversationId: string) => void
  saveAnnouncement: (data: {
    id?: string
    title: string
    body: string
    audience: Announcement["audience"]
    publish: boolean
    reason?: string
  }) => { ok: boolean; id?: string; error?: string }
  archiveAnnouncement: (id: string, reason: string) => void
  /* Cuenta propia */
  changePassword: (
    current: string,
    next: string,
  ) => { ok: boolean; error?: string }
  endOtherSession: (sessionId: string) => void
  updateOwnContact: (data: { phone: string; email: string }) => void
  markNoticeRead: (id: string) => void
  markAllNoticesRead: () => void
}

const Context = createContext<ProductApi | null>(null)

const DEMO_ACTORS: Record<string, string> = {
  admin: "admin",
  subcommittee: "subcommittee",
  coach: "coach",
  player: "p2",
  captain: "p0",
  guardian: "guardian",
}

export function MockAppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(() => createSeed())
  const [authenticated, setAuthenticated] = useState(true)
  const [actorId, setActorId] = useState(() => {
    const demo = new URLSearchParams(window.location.search).get("demo")
    return DEMO_ACTORS[demo ?? ""] ?? "coach"
  })
  const [childId, setChildId] = useState<string | null>(null)
  const [toastMessage, setToast] = useState("")
  const toastTimer = useRef<number | undefined>(undefined)
  const conflictOnce = useRef(false)

  const actor = state.people.find((person) => person.id === actorId) ?? state.people[0]
  const authority = useMemo(
    () => getAuthority(state, actor, childId),
    [state, actor, childId],
  )
  const hasAccess =
    actor.account === "ACTIVE" &&
    (activeRoleAssignments(state, actor.id).length > 0 ||
      authority.guardianChildren.length > 0)

  const toast = useCallback((message: string) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(""), 3800)
  }, [])

  const audit = useCallback(
    (
      draft: State,
      entry: {
        action: string
        resource: string
        before?: string | null
        after?: string | null
        source?: string
        route?: string
      },
    ) => {
      draft.audit.unshift({
        id: uid(),
        actor: actor.name,
        action: entry.action,
        resource: entry.resource,
        before: entry.before ?? null,
        after: entry.after ?? null,
        source: entry.source ?? "GEI Hockey",
        at: nowIso(),
        route: entry.route ?? "",
      })
    },
    [actor.name],
  )

  const update = useCallback<ProductApi["update"]>(
    (recipe, entry) => {
      setState((previous) => {
        const next = structuredClone(previous)
        recipe(next)
        if (entry) audit(next, entry)
        return next
      })
    },
    [audit],
  )

  /** Destinatarios reales de un evento: club + equipos destino + personas destino. */
  const recipientsOfEvent = useCallback((draft: State, event: Event) => {
    if (event.clubWide) return draft.people.map((person) => person.id)
    const ids = new Set<string>([actor.id])
    event.targetTeams.forEach((teamId) => {
      draft.teamAssignments
        .filter((a) => a.teamId === teamId && !a.validUntil)
        .forEach((a) => ids.add(a.personId))
    })
    event.targetPersonIds.forEach((id) => ids.add(id))
    return Array.from(ids)
  }, [actor.id])

  const pushNotice = useCallback(
    (
      draft: State,
      notice: {
        type: NotificationType
        title: string
        body: string
        route: string
        recipients: string[]
      },
    ) => {
      draft.notifications.unshift({
        id: uid(),
        at: nowIso(),
        readBy: [],
        ...notice,
      })
    },
    [],
  )

  const patchEventMeta: ProductApi["patchEventMeta"] = (id, patch, reason) => {
    update(
      (draft) => {
        const event = draft.events.find((item) => item.id === id)
        if (!event) return
        Object.assign(event, patch)
        event.version++
        event.history.unshift(
          `Corrección de redacción · ${actor.name} · ${reason}`,
        )
      },
      {
        action: "Corregir redacción del evento",
        resource: id,
        before: null,
        after: reason,
        source: "Corrección administrativa",
        route: `/events/${id}`,
      },
    )
  }

  const applyEventChange: ProductApi["applyEventChange"] = async (
    originId,
    patch,
    scope,
    operation,
  ) => {
    await wait()
    const draftSnapshot = structuredClone(state)
    const origin = draftSnapshot.events.find((item) => item.id === originId)
    if (!origin) return { occurrenceIds: [], kind: "none" as const }
    const kind = classifyChange(patch)

    // Simulación de concurrencia (escenario de QA): el servidor cambió mientras editábamos.
    if (
      !conflictOnce.current &&
      new URLSearchParams(window.location.search).get("scenario") === "stale" &&
      kind !== "none"
    ) {
      conflictOnce.current = true
      update((draft) => {
        const event = draft.events.find((item) => item.id === originId)!
        event.time = event.time === "17:30" ? "18:00" : "17:30"
        event.coordinationRevision++
        event.version++
        event.history.unshift(
          `Cambio de horario desde otro dispositivo · Otra persona · hace 1 min`,
        )
      })
      const latest = structuredClone(state).events.find((item) => item.id === originId)!
      throw new StaleVersionError(
        "Este evento cambió mientras lo estabas editando.",
        origin as unknown as Record<string, unknown>,
        { ...origin, ...patch } as unknown as Record<string, unknown>,
        latest as unknown as Record<string, unknown>,
      )
    }

    const occurrences = seriesOccurrences(draftSnapshot, originId, scope)
    const ids = occurrences.map((event) => event.id)
    update(
      (draft) => {
        occurrences.forEach((occurrence) => {
          const target = draft.events.find((item) => item.id === occurrence.id)
          if (!target) return
          Object.assign(target, patch)
          target.version++
          if (kind === "schedule") target.coordinationRevision++
          const label =
            scope === "ONLY_THIS" || occurrences.length === 1
              ? "Este evento"
              : scope === "THIS_AND_FOLLOWING"
                ? "Este evento y los siguientes"
                : "Toda la serie"
          target.history.unshift(
            `${operation} · ${actor.name} · ${label}${kind === "schedule" ? " · cambió el horario" : ""}`,
          )
          if (scope === "ONLY_THIS" && occurrence.seriesId) {
            target.divergedFromSeries = true
            draft.eventOccurrenceOverrides = draft.eventOccurrenceOverrides.filter(
              (item) => item.eventId !== target.id,
            )
            draft.eventOccurrenceOverrides.push({
              eventId: target.id,
              seriesId: occurrence.seriesId,
              fields: Object.keys(patch),
              at: nowIso(),
              by: actor.name,
            })
          }
          if (kind === "schedule") {
            pushNotice(draft, {
              type: "EVENT_CHANGED",
              title: "El horario cambió",
              body: `${operation} · hay que volver a confirmar la disponibilidad.`,
              route: `/events/${target.id}`,
              recipients: recipientsOfEvent(draft, target).filter(
                (id) => id !== actor.id,
              ),
            })
          }
        })
        audit(draft, {
          action: operation,
          resource:
            occurrences.length > 1
              ? `${occurrences.length} eventos de la serie`
              : occurrences[0]?.title || occurrences[0]?.opponent || originId,
          before: Object.keys(patch)
            .map((key) => `${key}: ${String((origin as never as Record<string, unknown>)[key])}`)
            .join(" · "),
          after: Object.keys(patch)
            .map((key) => `${key}: ${String(patch[key as keyof Event])}`)
            .join(" · "),
          source: `Alcance: ${scope === "ONLY_THIS" ? "sólo este evento" : scope === "THIS_AND_FOLLOWING" ? "este y los siguientes" : "toda la serie"}`,
          route: `/events/${originId}`,
        })
      },
    )
    return { occurrenceIds: ids, kind }
  }

  const transitionEvent: ProductApi["transitionEvent"] = async (
    id,
    to,
    reason,
  ) => {
    await wait()
    const snapshot = structuredClone(state)
    const event = snapshot.events.find((item) => item.id === id)
    if (!event) return
    const typeByState: Record<string, NotificationType> = {
      POSTPONED: "EVENT_POSTPONED",
      CANCELLED: "EVENT_CANCELLED",
      SCHEDULED: "EVENT_RESTORED",
      COMPLETED: "EVENT_CHANGED",
      ABANDONED: "EVENT_CHANGED",
    }
    const verbs: Record<string, string> = {
      POSTPONED: "Postergar",
      CANCELLED: "Cancelar",
      SCHEDULED: "Restaurar",
      COMPLETED: "Finalizar",
      ABANDONED: "Suspender",
    }
    update(
      (draft) => {
        const target = draft.events.find((item) => item.id === id)!
        const before = target.state
        target.state = to
        target.version++
        target.coordinationRevision++
        if (to === "COMPLETED" || to === "ABANDONED") {
          target.record.state = to === "COMPLETED" ? "FINAL" : target.record.state
          if (to === "ABANDONED") target.record.status = "ABANDONED"
        }
        target.history.unshift(`${verbs[to]} · ${actor.name} · ${reason}`)
        pushNotice(draft, {
          type: typeByState[to],
          title:
            to === "POSTPONED"
              ? "El evento fue postergado"
              : to === "CANCELLED"
                ? "El evento fue cancelado"
                : to === "SCHEDULED"
                  ? "El evento volvió a estar activo"
                  : `El evento pasó a ${to === "COMPLETED" ? "finalizado" : "suspendido"}`,
          body: `${event.opponent || event.title} · ${reason}`,
          route: `/events/${id}`,
          recipients: recipientsOfEvent(draft, target),
        })
        audit(draft, {
          action: verbs[to],
          resource: event.opponent || event.title,
          before,
          after: to,
          source: reason,
          route: `/events/${id}`,
        })
      },
    )
    toast(`${verbs[to]}: listo.`)
  }

  const respondAvailability: ProductApi["respondAvailability"] = async (
    eventId,
    personId,
    value,
  ) => {
    await wait(220)
    const target = state.events.find((item) => item.id === eventId)
    if (!target) return
    update(
      (draft) => {
        const event = draft.events.find((item) => item.id === eventId)!
        event.availability[personId] = {
          value,
          coordinationRevision: event.coordinationRevision,
          answeredAt: nowIso(),
        }
        event.version++
        event.history.unshift(
          `Disponibilidad ${value === "YES" ? "confirmada" : value === "MAYBE" ? "dudosa" : "negada"} · ${
            draft.people.find((p) => p.id === personId)?.name
          } · ahora`,
        )
      },
      {
        action: "Responder disponibilidad",
        resource: target.opponent || target.title,
        before: target.availability[personId]?.value ?? null,
        after: value,
        source: "Respuesta desde la aplicación",
        route: `/events/${eventId}`,
      },
    )
  }

  const publishSelection: ProductApi["publishSelection"] = async (
    eventId,
    selected,
    expectedVersion,
  ) => {
    await wait()
    const event = state.events.find((item) => item.id === eventId)
    if (!event) return
    if (event.version !== expectedVersion)
      throw new StaleVersionError(
        "La convocatoria cambió mientras la editabas.",
        event as unknown as Record<string, unknown>,
        { selection: selected } as unknown as Record<string, unknown>,
        structuredClone(state).events.find(
          (item) => item.id === eventId,
        ) as unknown as Record<string, unknown>,
      )
    const before = event.published ?? []
    update(
      (draft) => {
        const target = draft.events.find((item) => item.id === eventId)!
        const added = selected.filter((id) => !before.includes(id))
        const removed = before.filter((id) => !selected.includes(id))
        target.published = [...selected]
        target.selection = [...selected]
        target.selectionDraftAt = null
        target.publishedAt = nowIso()
        target.version++
        target.selectionRevisions.unshift({
          id: uid(),
          players: [...selected],
          added,
          removed,
          author: actor.name,
          at: nowIso(),
          conflicts: [],
        })
        target.history.unshift(
          `Convocatoria publicada · ${actor.name} · ${added.length}Sumaron, ${removed.length} salieron`,
        )
        pushNotice(draft, {
          type: "SELECTION_PUBLISHED",
          title: "Convocatoria publicada",
          body: `${target.opponent || target.title} · ${selected.length} convocadas`,
          route: `/events/${eventId}/selection`,
          recipients: Array.from(
            new Set([...selected, ...before]),
          ).filter((id) => id !== actor.id),
        })
        audit(draft, {
          action: "Publicar convocatoria",
          resource: target.opponent || target.title,
          before: before.length ? `${before.length} convocadas` : "Sin convocatoria",
          after: `${selected.length} convocadas`,
          source: "Edición de convocatoria",
          route: `/events/${eventId}/selection`,
        })
      },
    )
  }

  const openAttendance: ProductApi["openAttendance"] = async (eventId) => {
    await wait(220)
    update(
      (draft) => {
        const event = draft.events.find((item) => item.id === eventId)!
        event.attendanceOpened = true
        event.version++
        event.history.unshift(`Asistencia abierta · ${actor.name} · ahora`)
        audit(draft, {
          action: "Abrir asistencia",
          resource: event.opponent || event.title,
          before: "Cerrada",
          after: "Abierta",
          source: "Toma de asistencia",
          route: `/events/${eventId}/attendance`,
        })
      },
    )
  }

  const closeAttendance: ProductApi["closeAttendance"] = async (
    eventId,
    reason,
  ) => {
    await wait(220)
    update(
      (draft) => {
        const event = draft.events.find((item) => item.id === eventId)!
        event.attendanceClosedAt = nowIso()
        event.version++
        event.history.unshift(`Asistencia cerrada · ${actor.name} · ${reason}`)
        audit(draft, {
          action: "Cerrar asistencia",
          resource: event.opponent || event.title,
          before: "Abierta",
          after: "Cerrada",
          source: reason,
          route: `/events/${eventId}/attendance`,
        })
      },
    )
  }

  const markAttendance: ProductApi["markAttendance"] = (
    eventId,
    personId,
    value,
    reason,
  ) => {
    update(
      (draft) => {
        const event = draft.events.find((item) => item.id === eventId)!
        const before = event.attendance[personId] ?? null
        if (before === value) return
        event.attendance[personId] = value
        event.version++
        event.attendanceHistory.unshift({
          id: uid(),
          personId,
          before,
          after: value,
          actor: actor.name,
          at: nowIso(),
          reason,
          correction: before !== null,
        })
        const personName = draft.people.find((p) => p.id === personId)?.name
        event.history.unshift(
          `${personName}: ${before ?? "sin registrar"} → ${value} · ${actor.name}${
            reason ? ` · ${reason}` : ""
          }`,
        )
        audit(draft, {
          action: before ? "Corregir asistencia" : "Registrar asistencia",
          resource: `${personName} · ${event.opponent || event.title}`,
          before,
          after: value,
          source: reason ?? "Toma de asistencia",
          route: `/events/${eventId}/attendance`,
        })
      },
    )
  }

  const finalizeRecord: ProductApi["finalizeRecord"] = async (
    eventId,
    patch,
    reason,
  ) => {
    await wait()
    const event = state.events.find((item) => item.id === eventId)
    if (!event) return
    const beforeLabel = `${event.record.gei}-${event.record.opponent} (${event.record.state})`
    const afterLabel = `${patch.gei}-${patch.opponent} (FINAL)`
    update(
      (draft) => {
        const target = draft.events.find((item) => item.id === eventId)!
        target.record = { ...patch, state: "FINAL" }
        target.version++
        target.state = "COMPLETED"
        target.coordinationRevision++
        target.recordHistory.unshift({
          id: uid(),
          before: beforeLabel,
          after: afterLabel,
          actor: actor.name,
          at: nowIso(),
          reason,
        })
        target.history.unshift(
          `Resultado finalizado ${afterLabel} · ${actor.name} · ${reason}`,
        )
        audit(draft, {
          action: "Finalizar resultado",
          resource: event.opponent || event.title,
          before: beforeLabel,
          after: afterLabel,
          source: reason,
          route: `/events/${eventId}/match-record`,
        })
      },
    )
    toast("Resultado finalizado.")
  }

  const correctRecord: ProductApi["correctRecord"] = (eventId, patch, reason) => {
    const event = state.events.find((item) => item.id === eventId)
    if (!event) return
    if (!reason.trim())
      return
    const beforeLabel = `${event.record.gei}-${event.record.opponent} (${event.record.state})`
    const afterLabel = `${patch.gei}-${patch.opponent} (FINAL)`
    update(
      (draft) => {
        const target = draft.events.find((item) => item.id === eventId)!
        target.record = { ...target.record, ...patch, state: "FINAL" }
        target.version++
        target.recordHistory.unshift({
          id: uid(),
          before: beforeLabel,
          after: afterLabel,
          actor: actor.name,
          at: nowIso(),
          reason,
        })
        target.history.unshift(
          `Resultado corregido ${beforeLabel} → ${afterLabel} · ${actor.name} · ${reason}`,
        )
        audit(draft, {
          action: "Corregir resultado",
          resource: event.opponent || event.title,
          before: beforeLabel,
          after: afterLabel,
          source: reason,
          route: `/events/${eventId}/match-record`,
        })
      },
    )
  }

  const changeEventVenue: ProductApi["changeEventVenue"] = async (
    eventId,
    venueId,
  ) => {
    await wait()
    const venue = state.venues.find((item) => item.id === venueId)
    const event = state.events.find((item) => item.id === eventId)
    if (!venue || !event) return
    const before = event.venueId
    update(
      (draft) => {
        const target = draft.events.find((item) => item.id === eventId)!
        target.venueId = venue.id
        target.version++
        target.coordinationRevision++
        target.history.unshift(
          `Sede cambiada de ${before} a ${venue.name} · ${actor.name}`,
        )
        pushNotice(draft, {
          type: "EVENT_CHANGED",
          title: "Cambió la sede",
          body: `${target.opponent || target.title} ahora se juega en ${venue.name}. Hay que volver a confirmar.`,
          route: `/events/${eventId}`,
          recipients: recipientsOfEvent(draft, target).filter(
            (id) => id !== actor.id,
          ),
        })
        audit(draft, {
          action: "Cambiar sede del evento",
          resource: target.opponent || target.title,
          before: before,
          after: venue.name,
          source: "Cambio material",
          route: `/events/${eventId}`,
        })
      },
    )
  }

  const renameVenueMetadata: ProductApi["renameVenueMetadata"] = (
    venueId,
    data,
  ) => {
    update(
      (draft) => {
        const venue = draft.venues.find((item) => item.id === venueId)
        if (venue) Object.assign(venue, data)
      },
      {
        action: "Corregir datos de la sede",
        resource: venueId,
        before: null,
        after: Object.entries(data)
          .map(([key, value]) => `${key}: ${value}`)
          .join(" · "),
        source: "Corrección administrativa · no propaga a eventos",
      },
    )
  }

  const createPerson: ProductApi["createPerson"] = (data) => {
    const id = `person-${uid().slice(0, 8)}`
    const [firstName, ...rest] = data.name.trim().split(" ")
    update(
      (draft) => {
        draft.people.unshift({
          id,
          name: data.name.trim(),
          firstName,
          lastName: rest.join(" "),
          dni: data.dni,
          birth: data.birth,
          phone: data.phone,
          email: data.email,
          account: "PENDING",
          username: data.name
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .split(" ")
            .slice(0, 2)
            .join("."),
          credentialVersion: 0,
          passwordSet: false,
          lastActivityAt: nowIso(),
          sessions: [],
          setupToken: null,
          roleAssignments: [],
        })
        audit(draft, {
          action: "Crear persona",
          resource: data.name,
          before: null,
          after: "Cuenta pendiente de activar",
          source: "Alta desde administración",
          route: `/management/people/${id}`,
        })
      },
    )
    return id
  }

  const updateIdentity: ProductApi["updateIdentity"] = (personId, data) => {
    const person = state.people.find((item) => item.id === personId)
    if (!person) return
    const before = `${person.dni} · ${person.birth}`
    update(
      (draft) => {
        const target = draft.people.find((item) => item.id === personId)!
        if (data.name) {
          target.name = data.name
          const [first, ...rest] = data.name.split(" ")
          target.firstName = first
          target.lastName = rest.join(" ")
        }
        if (data.phone !== undefined) target.phone = data.phone
        if (data.email !== undefined) target.email = data.email
        if (data.dni !== undefined) target.dni = data.dni
        if (data.birth !== undefined) target.birth = data.birth
        draft.memberships = draft.memberships.filter(
          (item) => item.personId !== personId,
        )
        draft.teamAssignments = draft.teamAssignments.filter(
          (item) => item.personId !== personId,
        )
      },
      {
        action: "Completar identidad",
        resource: person.name,
        before,
        after: `${data.dni ?? person.dni} · ${data.birth ?? person.birth}`,
        source: "Datos administrados por el club",
        route: `/management/people/${personId}`,
      },
    )
  }

  const startMembership: ProductApi["startMembership"] = (personId) => {
    const person = state.people.find((item) => item.id === personId)
    if (!person) return
    update(
      (draft) => {
        draft.memberships.push({
          id: `mem-${uid().slice(0, 6)}`,
          personId,
          validFrom: todayIso(),
          validUntil: null,
        })
      },
      {
        action: "Iniciar pertenencia",
        resource: person.name,
        before: "Sin pertenencia",
        after: `Desde ${todayIso()}`,
        source: "Administración del club",
        route: `/management/people/${personId}`,
      },
    )
  }

  const endMembership: ProductApi["endMembership"] = (personId, reason) => {
    const person = state.people.find((item) => item.id === personId)
    if (!person) return
    update(
      (draft) => {
        const item = draft.memberships.find(
          (m) => m.personId === personId && !m.validUntil,
        )
        if (item) item.validUntil = addDays(todayIso(), 1)
      },
      {
        action: "Finalizar pertenencia",
        resource: person.name,
        before: "Vigente",
        after: `Finaliza ${addDays(todayIso(), 1)}`,
        source: reason,
        route: `/management/people/${personId}`,
      },
    )
  }

  const setAccountState: ProductApi["setAccountState"] = (personId, next, reason) => {
    const person = state.people.find((item) => item.id === personId)
    if (!person) return { ok: false, error: "No encontramos a esa persona." }
    const activeAdmins = state.people.filter(
      (personItem) =>
        personItem.account === "ACTIVE" &&
        personItem.roleAssignments?.some(
          (role) =>
            role.role === "ADMIN" && role.scope === "CLUB" && !role.validUntil,
        ),
    )
    const isLastAdmin =
      person.roleAssignments?.some(
        (role) => role.role === "ADMIN" && role.scope === "CLUB",
      ) && activeAdmins.length <= 1
    if (next !== "ACTIVE" && isLastAdmin)
      return {
        ok: false,
        error:
          "No podés dejar la cuenta sin acceso: es la única administración activa del club.",
      }
    update(
      (draft) => {
        const target = draft.people.find((item) => item.id === personId)!
        target.account = next
        if (next === "DISABLED") target.sessions = []
      },
      {
        action:
          next === "ACTIVE"
            ? "Habilitar cuenta"
            : next === "PENDING"
              ? "Dejar cuenta pendiente"
              : "Deshabilitar cuenta",
        resource: person.name,
        before: person.account,
        after: next,
        source: reason,
        route: `/management/people/${personId}`,
      },
    )
    return { ok: true }
  }

  const issueSetupToken: ProductApi["issueSetupToken"] = (personId) => {
    const person = state.people.find((item) => item.id === personId)
    if (!person) return ""
    const code = `GEI-${Math.floor(1000 + Math.random() * 9000)}`
    update(
      (draft) => {
        const target = draft.people.find((item) => item.id === personId)!
        target.setupToken = {
          code,
          issuedAt: nowIso(),
          expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
          used: false,
        }
      },
      {
        action: "Emitir código de activación",
        resource: person.name,
        before: "Sin código",
        after: code,
        source: "Administración del club",
        route: `/management/people/${personId}`,
      },
    )
    return code
  }

  const activateAccount: ProductApi["activateAccount"] = (code) => {
    const person = state.people.find(
      (item) =>
        item.setupToken?.code === code && !item.setupToken.used && item.account === "PENDING",
    )
    if (!person || !person.setupToken)
      return { ok: false, error: "Ese código no sirve o ya venció." }
    if (new Date(person.setupToken.expiresAt).getTime() < Date.now())
      return { ok: false, error: "Ese código venció. Pedí uno nuevo." }
    update(
      (draft) => {
        const target = draft.people.find((item) => item.id === person.id)!
        target.account = "ACTIVE"
        target.passwordSet = true
        target.credentialVersion = 1
        target.setupToken = { ...target.setupToken!, used: true }
        target.lastActivityAt = nowIso()
        draft.memberships.push({
          id: `mem-${uid().slice(0, 6)}`,
          personId: person.id,
          validFrom: todayIso(),
          validUntil: null,
        })
      },
      {
        action: "Activar cuenta",
        resource: person.name,
        before: "Pendiente",
        after: "Activa",
        source: "Activación con código",
        route: `/management/people/${person.id}`,
      },
    )
    return { ok: true }
  }

  const createGuardianRelationship: ProductApi["createGuardianRelationship"] = (
    data,
  ) => {
    update(
      (draft) => {
        draft.guardianRelationships.push({
          id: `gr-${uid().slice(0, 6)}`,
          ...data,
          validFrom: todayIso(),
          validUntil: null,
        })
      },
      {
        action: "Crear relación de representación",
        resource: data.childId,
        before: null,
        after: `${data.relation} · ve info: ${data.canViewChildInfo ? "sí" : "no"} · responde: ${data.canRespondAvailability ? "sí" : "no"}`,
        source: "Administración del club",
      },
    )
  }

  const endGuardianRelationship: ProductApi["endGuardianRelationship"] = (
    id,
    reason,
  ) => {
    update(
      (draft) => {
        const item = draft.guardianRelationships.find((r) => r.id === id)
        if (item) item.validUntil = addDays(todayIso(), 1)
      },
      {
        action: "Finalizar relación de representación",
        resource: id,
        before: "Vigente",
        after: "Finalizada",
        source: reason,
      },
    )
  }

  const createConstraint: ProductApi["createConstraint"] = (data) => {
    update(
      (draft) => {
        draft.eligibilityConstraints.push({
          ...data,
          id: `ec-${uid().slice(0, 6)}`,
          createdAt: nowIso(),
          createdBy: actor.name,
        })
      },
      {
        action: data.state === "BLOCKED" ? "Bloquear habilitación" : "Pedir habilitación",
        resource: data.personId,
        before: null,
        after: `${data.scope} · ${data.source} · ${data.reason}`,
        source: data.note ?? "Administración",
        route: `/management/people/${data.personId}`,
      },
    )
  }

  const endConstraint: ProductApi["endConstraint"] = (id, reason) => {
    update(
      (draft) => {
        const item = draft.eligibilityConstraints.find((c) => c.id === id)
        if (item) item.validUntil = addDays(todayIso(), 1)
      },
      {
        action: "Levantar restricción de habilitación",
        resource: id,
        before: "Vigente",
        after: "Sin efecto",
        source: reason,
      },
    )
  }

  const createCompetition: ProductApi["createCompetition"] = (data) => {
    const id = `comp-${uid().slice(0, 6)}`
    update(
      (draft) => {
        draft.competitions.unshift({
          id,
          name: data.name,
          organizer: data.organizer,
          state: "DRAFT",
          entries: [],
        })
      },
      {
        action: "Crear competencia",
        resource: data.name,
        before: null,
        after: "Borrador",
        source: "Administración",
      },
    )
    return id
  }

  const addCompetitionEntry: ProductApi["addCompetitionEntry"] = (
    competitionId,
    input,
  ) => {
    const competition = state.competitions.find((item) => item.id === competitionId)
    if (!competition) return { ok: false, error: "No encontramos la competencia." }
    if (competition.state === "CLOSED")
      return {
        ok: false,
        error: "La competencia está cerrada: no admite inscripciones nuevas.",
      }
    if (
      competition.entries.some((item) =>
        item.scope === input.scope
          ? item.scope === "TEAM"
            ? (item as CompetitionEntryTeam).teamId ===
              (input as CompetitionEntryTeam).teamId
            : (item as CompetitionEntryLine).divisionId ===
                (input as CompetitionEntryLine).divisionId &&
              (item as CompetitionEntryLine).lineId ===
                (input as CompetitionEntryLine).lineId &&
              (item as CompetitionEntryLine).seasonId ===
                (input as CompetitionEntryLine).seasonId
          : false,
      )
    )
      return { ok: false, error: "Esa inscripción ya existe en la competencia." }
    update(
      (draft) => {
        const target = draft.competitions.find((item) => item.id === competitionId)!
        target.entries.push({
          ...(input as CompetitionEntry),
          id: `entry-${uid().slice(0, 6)}`,
        })
      },
      {
        action: "Añadir inscripción",
        resource: competition.name,
        before: `${competition.entries.length} inscripciones`,
        after: `${competition.entries.length + 1} inscripciones`,
        source: input.scope === "TEAM" ? "Equipo" : "Línea",
      },
    )
    return { ok: true }
  }

  const setCompetitionState: ProductApi["setCompetitionState"] = (
    competitionId,
    next,
  ) => {
    const competition = state.competitions.find((item) => item.id === competitionId)
    if (!competition) return { ok: false, error: "No encontramos la competencia." }
    if (
      next === "CLOSED" &&
      competition.entries.some((entry) => entry.state === "ACTIVE")
    )
      return {
        ok: false,
        error:
          "No se puede cerrar: quedan inscripciones activas. Finalizalas primero.",
      }
    update(
      (draft) => {
        const target = draft.competitions.find((item) => item.id === competitionId)!
        target.state = next
      },
      {
        action: "Cambiar estado de la competencia",
        resource: competition.name,
        before: competition.state,
        after: next,
        source: "Administración",
        route: `/management/competitions/${competitionId}`,
      },
    )
    return { ok: true }
  }

  const setEntryState: ProductApi["setEntryState"] = (
    competitionId,
    entryId,
    next,
  ) => {
    const competition = state.competitions.find((item) => item.id === competitionId)
    const entry = competition?.entries.find((item) => item.id === entryId)
    if (!competition || !entry) return { ok: false, error: "No encontramos la inscripción." }
    update(
      (draft) => {
        const target = draft.competitions
          .find((item) => item.id === competitionId)!
          .entries.find((item) => item.id === entryId)!
        target.state = next
      },
      {
        action: "Cambiar estado de la inscripción",
        resource: competition.name,
        before: entry.state,
        after: next,
        source: "Administración",
        route: `/management/competitions/${competitionId}`,
      },
    )
    return { ok: true }
  }

  const setStructureArchived: ProductApi["setStructureArchived"] = (id, archived) => {
    const item = state.structure.find((entry) => entry.id === id)
    if (!item) return { ok: false, error: "No encontramos ese elemento." }
    const dependents =
      item.type === "DIVISION"
        ? state.teams.filter((team) => team.divisionId === id)
        : item.type === "LINE"
          ? state.teams.filter((team) => team.lineId === id)
          : item.type === "SEASON"
            ? state.teams.filter((team) => team.seasonId === id)
            : []
    const activeTeams = dependents.filter((team) => team.state === "ACTIVE")
    if (archived && activeTeams.length > 0)
      return {
        ok: false,
        error: `No se puede archivar: ${activeTeams.length} ${
          activeTeams.length === 1 ? "equipo activo" : "equipos activos"
        } lo usan. Desactivá esos equipos primero.`,
      }
    update(
      (draft) => {
        const target = draft.structure.find((entry) => entry.id === id)!
        target.archived = archived
      },
      {
        action: archived ? "Archivar elemento" : "Restaurar elemento",
        resource: item.name,
        before: archived ? "Activo" : "Archivado",
        after: archived ? "Archivado" : "Activo",
        source: item.type,
      },
    )
    return { ok: true }
  }

  const updateJornada: ProductApi["updateJornada"] = (id, patch, reason) => {
    update(
      (draft) => {
        const target = draft.jornadas.find((item) => item.id === id)
        if (!target) return
        const materialSchedule =
          (patch.venueId !== undefined && patch.venueId !== target.venueId) ||
          (patch.meeting !== undefined && patch.meeting !== target.meeting)
        Object.assign(target, patch)
        if (materialSchedule) {
          draft.events
            .filter((event) => target.events.includes(event.id))
            .forEach((event) => {
              event.version++
              event.coordinationRevision++
              event.history.unshift(
                `Jornada actualizada (${Object.entries(patch)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(" · ")}) · ${actor.name} · ${reason}`,
              )
              pushNotice(draft, {
                type: "EVENT_CHANGED",
                title: "Cambió la organización de la jornada",
                body: `${event.opponent || event.title} · hay que volver a confirmar.`,
                route: `/events/${event.id}`,
                recipients: recipientsOfEvent(draft, event).filter(
                  (id) => id !== actor.id,
                ),
              })
            })
        }
        audit(draft, {
          action: "Actualizar jornada",
          resource: target.name,
          before: null,
          after: Object.entries(patch)
            .map(([key, value]) => `${key}: ${value}`)
            .join(" · "),
          source: reason,
          route: `/jornadas/${id}`,
        })
      },
    )
  }

  const createJornada: ProductApi["createJornada"] = (data) => {
    const season = state.structure.find((item) => item.id === data.seasonId)
    const competition = state.competitions.find(
      (item) => item.id === data.competitionId,
    )
    if (!season) return { ok: false, error: "Elegí una temporada." }
    if (!competition) return { ok: false, error: "Elegí una competencia." }
    if (data.eventIds.length === 0)
      return { ok: false, error: "Elegí al menos un partido para la jornada." }
    if (data.eventIds.length > 100)
      return {
        ok: false,
        error: "Una jornada admite hasta 100 partidos. Dividila en dos jornadas.",
      }
    const events = state.events.filter((item) => data.eventIds.includes(item.id))
    const wrongType = events.filter((item) => item.type !== "MATCH")
    if (wrongType.length > 0)
      return {
        ok: false,
        error: "Una jornada sólo agrupa partidos, no entrenamientos ni eventos del club.",
      }
    const mismatchedSeason = events.filter((event) => {
      const team = state.teams.find((item) => item.id === event.targetTeams[0])
      return !team || team.seasonId !== data.seasonId
    })
    if (mismatchedSeason.length > 0)
      return {
        ok: false,
        error:
          "Algún partido pertenece a otra temporada, así que no puede ir en esta jornada.",
      }
    const id = `jornada-${uid().slice(0, 6)}`
    update(
      (draft) => {
        draft.jornadas.unshift({
          id,
          name: data.name.trim() || `Fecha de ${season.name}`,
          seasonId: data.seasonId,
          competitionId: data.competitionId,
          events: [...data.eventIds],
          at: todayIso(),
          venueId: null,
          meeting: "",
          departure: "",
          point: "",
        })
      },
      {
        action: "Crear jornada",
        resource: data.name.trim() || `Fecha de ${season.name}`,
        before: null,
        after: `${data.eventIds.length} partidos`,
        source: competition.name,
        route: `/jornadas/${id}`,
      },
    )
    return { ok: true, id }
  }

  const sendMessage: ProductApi["sendMessage"] = async (conversationId, body) => {
    const text = body.trim()
    if (!text) return
    const id = `m-${uid().slice(0, 8)}`
    update((draft) => {
      const conversation = draft.conversations.find(
        (item) => item.id === conversationId,
      )
      if (!conversation) return
      conversation.messages = [
        ...conversation.messages,
        {
          id,
          author: actor.id,
          body: text,
          at: nowIso(),
          state: "SENT",
          edited: false,
          deletedAt: null,
        },
      ]
      conversation.unread = Object.fromEntries(
        conversation.participants
          .filter((personId) => personId !== actor.id)
          .map((personId) => [personId, 0]),
      )
    })
    await wait(160)
  }

  const deleteMessage: ProductApi["deleteMessage"] = (conversationId, messageId) => {
    update(
      (draft) => {
        const conversation = draft.conversations.find(
          (item) => item.id === conversationId,
        )
        const message = conversation?.messages.find((item) => item.id === messageId)
        if (!conversation || !message) return
        message.deletedAt = nowIso()
        audit(draft, {
          action: "Eliminar mensaje",
          resource: conversationId,
          before: message.body.slice(0, 60),
          after: "Mensaje eliminado",
          source: "Quien lo escribió",
        })
      },
    )
  }

  const markConversationRead: ProductApi["markConversationRead"] = (conversationId) => {
    update((draft) => {
      const conversation = draft.conversations.find(
        (item) => item.id === conversationId,
      )
      if (conversation) conversation.unread[actor.id] = 0
    })
  }

  const audienceLabel = (audience: Announcement["audience"]) =>
    audience.kind === "CLUB"
      ? "Todo el hockey"
      : audience.teamIds
          .map(
            (id) =>
              state.teams.find((team) => team.id === id) &&
              `${state.structure.find((s) => s.id === state.teams.find((team) => team.id === id)!.divisionId)?.name} ${
                state.structure.find((s) => s.id === state.teams.find((team) => team.id === id)!.lineId)?.name
              }`,
          )
          .join(", ")

  const saveAnnouncement: ProductApi["saveAnnouncement"] = (data) => {
    const existing = data.id
      ? state.announcements.find((item) => item.id === data.id)
      : undefined
    if (!existing && !data.title.trim())
      return { ok: false, error: "Poné un título." }
    if (!existing && !data.body.trim())
      return { ok: false, error: "Escribí el comunicado." }
    if (existing && existing.state === "PUBLISHED" && !data.reason?.trim())
      return {
        ok: false,
        error: "Para corregir un comunicado publicado hay que explicar el motivo.",
      }

    const id = existing?.id ?? `a-${uid().slice(0, 6)}`
    update(
      (draft) => {
        if (existing) {
          const target = draft.announcements.find((item) => item.id === id)!
          const beforeTitle = target.title
          const beforeBody = target.body
          target.title = data.title
          target.body = data.body
          if (target.state === "PUBLISHED") {
            target.corrections.unshift({
              id: uid(),
              at: nowIso(),
              actor: actor.name,
              before:
                beforeTitle !== data.title
                  ? `Título: ${beforeTitle}`
                  : `Cuerpo: ${beforeBody.slice(0, 80)}…`,
              after:
                beforeTitle !== data.title
                  ? `Título: ${data.title}`
                  : `Cuerpo: ${data.body.slice(0, 80)}…`,
              reason: data.reason ?? "",
            })
            // La audiencia publicada es inmutable: no se toca.
            pushNotice(draft, {
              type: "ANNOUNCEMENT_PUBLISHED",
              title: "Comunicado corregido",
              body: `${target.title} · la audiencia no cambió`,
              route: `/announcements/${id}`,
              recipients: target.audienceSnapshot?.clubWide
                ? draft.people.map((person) => person.id)
                : recipientsOfTeams(draft, target.audienceSnapshot?.teamIds ?? []),
            })
          } else if (data.publish) {
            target.state = "PUBLISHED"
            target.at = nowIso()
            target.audienceSnapshot = {
              clubWide: target.audience.kind === "CLUB",
              teamIds: target.audience.kind === "TEAMS" ? target.audience.teamIds : [],
              label: audienceLabel(target.audience),
              at: nowIso(),
            }
            pushNotice(draft, {
              type: "ANNOUNCEMENT_PUBLISHED",
              title: `Comunicado para ${target.audienceSnapshot.label}`,
              body: target.title,
              route: `/announcements/${id}`,
              recipients: target.audienceSnapshot.clubWide
                ? draft.people.map((person) => person.id)
                : recipientsOfTeams(draft, target.audienceSnapshot.teamIds),
            })
          }
          audit(draft, {
            action: data.publish && existing.state !== "PUBLISHED" ? "Publicar comunicado" : "Corregir comunicado",
            resource: target.title,
            before: beforeTitle,
            after: data.title,
            source: data.reason ?? "Redacción del comunicado",
            route: `/announcements/${id}`,
          })
          return
        }
        const created: Announcement = {
          id,
          title: data.title,
          body: data.body,
          audience: data.audience,
          audienceSnapshot: null,
          state: "DRAFT",
          at: nowIso(),
          publisher: actor.name,
          corrections: [],
        }
        if (data.publish) {
          created.state = "PUBLISHED"
          created.audienceSnapshot = {
            clubWide: created.audience.kind === "CLUB",
            teamIds:
              created.audience.kind === "TEAMS" ? created.audience.teamIds : [],
            label: audienceLabel(created.audience),
            at: nowIso(),
          }
          pushNotice(draft, {
            type: "ANNOUNCEMENT_PUBLISHED",
            title: `Comunicado para ${created.audienceSnapshot.label}`,
            body: created.title,
            route: `/announcements/${id}`,
            recipients: created.audienceSnapshot.clubWide
              ? draft.people.map((person) => person.id)
              : recipientsOfTeams(draft, created.audienceSnapshot.teamIds),
          })
        }
        draft.announcements.unshift(created)
        audit(draft, {
          action: data.publish ? "Publicar comunicado" : "Crear comunicado",
          resource: created.title,
          before: null,
          after: data.publish ? "Publicado" : "Borrador",
          source: "Subcomisión de hockey",
          route: `/announcements/${id}`,
        })
      },
    )
    toast(data.publish ? "Comunicado publicado." : "Borrador guardado.")
    return { ok: true, id }
  }

  const recipientsOfTeams = (draft: State, teamIds: string[]) => {
    const ids = new Set<string>()
    teamIds.forEach((teamId) => {
      draft.teamAssignments
        .filter((a) => a.teamId === teamId && !a.validUntil)
        .forEach((a) => ids.add(a.personId))
    })
    return Array.from(ids)
  }

  const archiveAnnouncement: ProductApi["archiveAnnouncement"] = (id, reason) => {
    const item = state.announcements.find((entry) => entry.id === id)
    if (!item) return
    update(
      (draft) => {
        const target = draft.announcements.find((entry) => entry.id === id)!
        target.state = "ARCHIVED"
        audit(draft, {
          action: "Archivar comunicado",
          resource: target.title,
          before: "Publicado",
          after: "Archivado",
          source: reason,
          route: `/announcements/${id}`,
        })
      },
    )
  }

  const changePassword: ProductApi["changePassword"] = (current, next) => {
    if (!current) return { ok: false, error: "Escribí tu contraseña actual." }
    if (next.length < 12)
      return {
        ok: false,
        error: "La nueva contraseña necesita al menos 12 caracteres.",
      }
    if (next === current)
      return { ok: false, error: "La nueva contraseña es igual a la actual." }
    update(
      (draft) => {
        const target = draft.people.find((person) => person.id === actor.id)!
        target.credentialVersion += 1
        target.passwordSet = true
      },
      {
        action: "Cambiar contraseña",
        resource: actor.name,
        before: null,
        after: "Contraseña actualizada",
        source: "Desde el perfil",
        route: "/more/profile",
      },
    )
    return { ok: true }
  }

  const endOtherSession: ProductApi["endOtherSession"] = (sessionId) => {
    update(
      (draft) => {
        const target = draft.people.find((person) => person.id === actor.id)!
        target.sessions = target.sessions.filter(
          (session) => session.id !== sessionId,
        )
      },
      {
        action: "Cerrar otra sesión",
        resource: actor.name,
        before: "Sesión activa",
        after: "Sesión cerrada",
        source: "Desde el perfil",
        route: "/more/profile",
      },
    )
    toast("Sesión cerrada.")
  }

  const updateOwnContact: ProductApi["updateOwnContact"] = (data) => {
    update(
      (draft) => {
        const target = draft.people.find((person) => person.id === actor.id)!
        target.phone = data.phone
        target.email = data.email
      },
      {
        action: "Actualizar contacto",
        resource: actor.name,
        before: null,
        after: `${data.phone} · ${data.email}`,
        source: "Desde el perfil",
        route: "/more/profile",
      },
    )
    toast("Contacto actualizado.")
  }

  const markNoticeRead: ProductApi["markNoticeRead"] = (id) => {
    update((draft) => {
      const notice = draft.notifications.find((item) => item.id === id)
      if (notice && !notice.readBy.includes(actor.id)) notice.readBy.push(actor.id)
    })
  }

  const markAllNoticesRead: ProductApi["markAllNoticesRead"] = () => {
    update((draft) => {
      draft.notifications.forEach((notice: Notice) => {
        if (
          notice.recipients.includes(actor.id) &&
          !notice.readBy.includes(actor.id)
        )
          notice.readBy.push(actor.id)
      })
    })
  }

  const login = (username: string) => {
    const person = state.people.find(
      (item) => item.username === username || item.id === username,
    )
    if (!person || person.account !== "ACTIVE") return false
    setActorId(person.id)
    setAuthenticated(true)
    return true
  }

  const value: ProductApi = {
    state,
    actor,
    authority,
    childId,
    setChildId,
    authenticated,
    hasAccess,
    login,
    logout: () => setAuthenticated(false),
    toast,
    toastMessage,
    update,
    patchEventMeta,
    applyEventChange,
    transitionEvent,
    respondAvailability,
    publishSelection,
    openAttendance,
    closeAttendance,
    markAttendance,
    finalizeRecord,
    correctRecord,
    changeEventVenue,
    renameVenueMetadata,
    createPerson,
    updateIdentity,
    startMembership,
    endMembership,
    setAccountState,
    issueSetupToken,
    activateAccount,
    createGuardianRelationship,
    endGuardianRelationship,
    createConstraint,
    endConstraint,
    createCompetition,
    addCompetitionEntry,
    setCompetitionState,
    setEntryState,
    setStructureArchived,
    updateJornada,
    createJornada,
    sendMessage,
    deleteMessage,
    markConversationRead,
    saveAnnouncement,
    archiveAnnouncement,
    changePassword,
    endOtherSession,
    updateOwnContact,
    markNoticeRead,
    markAllNoticesRead,
  }

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useProduct() {
  const value = useContext(Context)
  if (!value) throw new Error("MockAppProvider requerido")
  return value
}

/** Completitud de perfil derivada: usada por Home, People y Create/Assign. */
export function useProfileCompleteness(person: Person) {
  return profileCompleteness(person)
}

export function useMembership(personId: string): Membership | null {
  const { state } = useProduct()
  return (
    state.memberships.find(
      (item) => item.personId === personId && !item.validUntil,
    ) ?? null
  )
}

export function useActiveGuardianRelations(guardianId: string): GuardianRelationship[] {
  const { state } = useProduct()
  const today = todayIso()
  return state.guardianRelationships.filter(
    (item) =>
      item.guardianId === guardianId &&
      item.validFrom <= today &&
      (!item.validUntil || item.validUntil > today),
  )
}