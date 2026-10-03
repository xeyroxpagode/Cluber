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
  notify: (title: string, body: string, route: string) => void
  toast: (message: string) => void
  toastMessage: string
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
  const hasAccess = actor.account === "ACTIVE" && currentRoles(actor).length > 0
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
  function notify(title: string, body: string, route: string) {
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
