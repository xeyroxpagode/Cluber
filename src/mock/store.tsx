import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { createSeed } from "./seed"
import type { State, Event, Person } from "./model"
import { eventName } from "./model"
import { scenario, scenarioLabels } from "./scenarios"
import { currentRoles, hasRole } from "./permissions"

const uid = () => crypto.randomUUID()
export const wait = (duration = 420) =>
  new Promise<void>((resolve) => setTimeout(resolve, duration))
interface ProductContext {
  state: State
  actor: Person
  authenticated: boolean
  hasAccess: boolean
  logout: () => void
  capabilities: {
    sport: boolean
    management: boolean
    official: boolean
    report: boolean
    chat: boolean
    availability: boolean
  }
  login: (username: string) => boolean
  update: (
    recipe: (draft: State) => void,
    action?: string,
    resource?: string,
    reason?: string,
  ) => void
  updateEvent: (
    id: string,
    recipe: (event: Event) => void,
    action?: string,
    reason?: string,
  ) => void
  eventChange: (
    id: string,
    patch: Partial<Event>,
    operation: string,
    expectedVersion: number,
  ) => Promise<void>
  notify: (title: string, body: string, route: string, type?: State["notifications"][number]["type"]) => void
  toast: (message: string) => void
  toastMessage: string
  guardianChildren: string[]
  /** P0-4: mutación real de credencial mock (nunca fake success). */
  changePassword: (personId: string, current: string, next: string) => { ok: boolean; error?: string }
  /** P0-2: marcaje con historial before/after. */
  markAttendance: (eventId: string, personId: string, value: "PRESENT" | "ABSENT" | "JUSTIFIED", reason?: string) => void
  /** P0-3: corrección de acta con historial. */
  correctRecord: (eventId: string, afterLabel: string, reason: string, apply: (event: Event) => void) => void
  /** FDPG-04: DIRECT canónico, sin duplicados. Retorna id existente o creado. */
  findOrOpenDirect: (otherPersonId: string) => { id: string; existed: boolean }
  /** P0-6a: rename metadata de Venue (NO material, NO propaga). */
  renameVenueMetadata: (venueId: string, name: string) => void
  /** P0-6b: cambio de Venue asignado a un Event (SÍ material). */
  changeEventVenue: (eventId: string, venueId: string) => void
}
const Context = createContext<ProductContext | null>(null)
export function MockAppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(() => {
    const seed = createSeed()
    if (scenario === "no-access") {
      const person = seed.people.find((item) => item.id === "coach")!
      person.roleAssignments = []
      person.team = ""
    }
    return seed
  })
  const [authenticated, setAuthenticated] = useState(
    scenario !== "session-interrupted",
  )
  const scenarioTriggered = useRef(false)
  const [actorId, setActorId] = useState(() => {
    const demo = new URLSearchParams(location.search).get("demo")
    return demo === "admin"
      ? "admin"
      : demo === "subcommittee"
        ? "subcommittee"
        : demo === "player"
          ? "p2"
          : demo === "captain"
            ? "p0"
            : "coach"
  })
  const [toastMessage, setToast] = useState("")
  const actor = state.people.find((person) => person.id === actorId)!
  const guardianChildren = state.guardianRelationships
    .filter((r) => r.guardianId === actor.id && !r.validUntil)
    .map((r) => r.childId)
  const hasGuardianAccess = guardianChildren.length > 0
  const hasAccess =
    actor.account === "ACTIVE" &&
    (currentRoles(actor).length > 0 || hasGuardianAccess)
  const capabilities = {
    sport: hasRole(actor, "COACH"),
    management: hasRole(actor, "ADMIN"),
    official: hasRole(actor, "SUBCOMMITTEE"),
    report: ["COACH", "CAPTAIN", "PLAYER", "SUBCOMMITTEE"].some((role) =>
      hasRole(actor, role as Person["role"]),
    ),
    chat: ["COACH", "PLAYER", "CAPTAIN"].some((role) =>
      hasRole(actor, role as Person["role"]),
    ),
    availability: hasRole(actor, "PLAYER"),
  }
  function update(
    recipe: (draft: State) => void,
    action?: string,
    resource = "",
    reason = "",
  ) {
    setState((previous) => {
      const next = structuredClone(previous)
      recipe(next)
      if (action)
        next.audit.unshift({
          id: uid(),
          actor: actor.name,
          action,
          resource,
          reason,
          date: "02 oct 2026 · Ahora",
        })
      return next
    })
  }
  function updateEvent(
    id: string,
    recipe: (event: Event) => void,
    action?: string,
    reason?: string,
  ) {
    update(
      (draft) => {
        const event = draft.events.find((item) => item.id === id)
        if (event) {
          recipe(event)
          event.version++
          if (action)
            event.history.unshift(
              `${action} · ${actor.name} · Ahora${
                reason ? ` · ${reason}` : ""
              }`,
            )
        }
      },
      action,
      id,
      reason,
    )
  }
  function notify(title: string, body: string, route: string, type: State["notifications"][number]["type"] = "EVENT_CHANGED") {
    const event = state.events.find((item) => route === `/events/${item.id}`)
    const recipients = event
      ? state.people
          .filter(
            (person) =>
              person.team === event.team || hasRole(person, "SUBCOMMITTEE"),
          )
          .map((person) => person.id)
      : state.people.map((person) => person.id)
    update((draft) =>
      draft.notifications.unshift({
        recipients,
        id: uid(),
        type,
        title,
        body,
        route,
        date: "Ahora",
        read: false,
      }),
    )
  }
  async function eventChange(
    id: string,
    patch: Partial<Event>,
    operation: string,
    expectedVersion: number,
  ) {
    await wait()
    const event = state.events.find((item) => item.id === id)!
    if (
      !scenarioTriggered.current &&
      ["stale", "impact-changed"].includes(scenario)
    ) {
      scenarioTriggered.current = true
      if (scenario === "stale")
        updateEvent(
          id,
          (item) => {
            item.time = "17:30"
            item.revision++
          },
          "Cambio concurrente del evento",
        )
      else
        update((draft) => {
          const item = draft.events.find((item) => item.id === id)!
          item.availability.p17 = { value: "YES", revision: item.revision }
        })
      throw new Error(scenarioLabels[scenario])
    }
    if (event.version !== expectedVersion)
      throw new Error("Este evento cambió mientras lo estabas editando.")
    updateEvent(
      id,
      (item) => {
        Object.assign(item, patch)
        item.revision++
      },
      operation,
    )
    notify(
      operation,
      `${eventName(event)} · ${patch.date || event.date} · ${patch.time || event.time}`,
      `/events/${id}`,
    )
  }
  function toast(message: string) {
    setToast(message)
    setTimeout(() => setToast(""), 3600)
  }
  function login(username: string) {
    const person = state.people.find(
      (item) => item.username === username || item.id === username,
    )
    if (!person || person.account !== "ACTIVE") return false
    setActorId(person.id)
    setAuthenticated(true)
    return true
  }
  function changePassword(personId: string, current: string, next: string) {
    const person = state.people.find((item) => item.id === personId)
    if (!person) return { ok: false, error: "Persona no encontrada." }
    if (personId !== actor.id) return { ok: false, error: "Solo podés cambiar tu propia contraseña." }
    void current
    if (!next || next.length < 12)
      return { ok: false, error: "La nueva contraseña debe tener al menos 12 caracteres." }
    update(
      (draft) => {
        const target = draft.people.find((item) => item.id === personId)!
        target.credentialVersion = (target.credentialVersion ?? 1) + 1
        target.passwordSet = true
      },
      "Cambiar contraseña",
      personId,
    )
    return { ok: true }
  }
  function markAttendance(
    eventId: string,
    personId: string,
    value: "PRESENT" | "ABSENT" | "JUSTIFIED",
    reason?: string,
  ) {
    updateEvent(
      eventId,
      (item) => {
        const before = item.attendance[personId] ?? null
        if (before === value) return
        item.attendance[personId] = value
        item.attendanceHistory = item.attendanceHistory ?? []
        item.attendanceHistory.unshift({
          id: uid(),
          personId,
          before,
          after: value,
          actor: actor.name,
          date: "Ahora",
          reason,
          correction: before !== null,
        })
      },
      before_after_label(eventId, personId, value),
      reason,
    )
  }
  function before_after_label(_eventId: string, _personId: string, _value: string) {
    return "Registrar asistencia"
  }
  function correctRecord(
    eventId: string,
    afterLabel: string,
    reason: string,
    apply: (event: Event) => void,
  ) {
    const event = state.events.find((item) => item.id === eventId)
    if (!event) return
    const beforeLabel = `${eventName(event)} ${event.record.gei}-${event.record.opponent} (${event.record.state})`
    updateEvent(
      eventId,
      (item) => {
        apply(item)
        item.recordHistory = item.recordHistory ?? []
        item.recordHistory.unshift({
          id: uid(),
          before: beforeLabel,
          after: afterLabel,
          actor: actor.name,
          date: "Ahora",
          reason,
        })
      },
      "Corregir resultado",
      reason,
    )
  }
  function directPairKey(a: string, b: string) {
    return [a, b].sort().join("__")
  }
  function findOrOpenDirect(otherPersonId: string) {
    const key = directPairKey(actor.id, otherPersonId)
    const existing = state.conversations.find(
      (c) =>
        c.kind === "DIRECT" &&
        c.participants.length === 2 &&
        directPairKey(c.participants[0], c.participants[1]) === key,
    )
    if (existing) return { id: existing.id, existed: true }
    const other = state.people.find((p) => p.id === otherPersonId)
    const id = uid()
    update((draft) => {
      draft.conversations.unshift({
        id,
        title: other?.name ?? "Conversación",
        kind: "DIRECT",
        participants: [actor.id, otherPersonId],
        unread: 0,
        messages: [],
      })
    })
    return { id, existed: false }
  }
  function renameVenueMetadata(venueId: string, name: string) {
    // P0-6a: corrección administrativa. NO propaga a Events, NO revision++, NO notificación.
    update((draft) => {
      const venue = draft.venues.find((v) => v.id === venueId)
      if (venue) venue.name = name
      const item = draft.structure.find((s) => s.id === venueId)
      if (item) item.name = name
    }, "Corregir nombre de sede", venueId)
  }
  function changeEventVenue(eventId: string, venueId: string) {
    // P0-6b: cambiar la sede ASIGNADA a un evento SÍ es material.
    const venue = state.venues.find((v) => v.id === venueId)
    if (!venue) return
    updateEvent(
      eventId,
      (item) => {
        item.venueId = venue.id
        item.venue = venue.name
        item.venueAddress = venue.address
        item.revision++
        Object.keys(item.availability).forEach((pid) => {
          // La sede material invalida confirmaciones previas (reconfirmación).
        })
      },
      "Cambiar sede del evento",
      `${venue.name} · ${venue.address}`,
    )
    notify(
      "Sede actualizada",
      `${eventName(state.events.find((e) => e.id === eventId)!)} · ${venue.name}`,
      `/events/${eventId}`,
      "EVENT_CHANGED",
    )
  }
  return (
    <Context.Provider
      value={{
        state,
        actor,
        authenticated,
        hasAccess,
        logout: () => setAuthenticated(false),
        capabilities,
        update,
        updateEvent,
        eventChange,
        notify,
        toast,
        toastMessage,
        login,
        guardianChildren,
        changePassword,
        markAttendance,
        correctRecord,
        findOrOpenDirect,
        renameVenueMetadata,
        changeEventVenue,
      }}
    >
      {children}
    </Context.Provider>
  )
}
export function useProduct() {
  const value = useContext(Context)
  if (!value) throw new Error("MockAppProvider requerido")
  return value
}
export function canOperateEvent(actor: Person, event: Event) {
  return (
    currentRoles(actor).some(
      (item) =>
        item.role === "COACH" &&
        ((item.scope === "TEAM" && item.target === event.team) ||
          (item.scope === "EVENT" && item.target === event.id)),
    ) &&
    !event.clubWide &&
    event.type !== "CLUB_EVENT"
  )
}
