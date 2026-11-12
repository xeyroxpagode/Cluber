/**
 * Fetch mock for T03 component tests. Serves a canned club over the real
 * HTTP surface (same URLs, same JSON shapes) — no React Query, no network.
 * Tests that exercise T04/T05 surfaces still use the mock store/harness.
 */
import { vi } from "vitest"

export interface ApiMockOptions {
  me?: Record<string, unknown>
  events?: any[]
  notifications?: any[]
}

const today = new Date()
const iso = (offsetDays: number, hour = 18): string => {
  const d = new Date(today)
  d.setDate(d.getDate() + offsetDays)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

export const cannedEvents = [
  {
    id: "training-scheduled",
    type: "TRAINING",
    title: "Entrenamiento táctico",
    startAt: iso(2, 18),
    endAt: iso(2, 20),
    timeZone: "America/Argentina/Buenos_Aires",
    venueId: "venue-1",
    venue: { id: "venue-1", name: "Club GEI", address: "Av. del Libertador 100" },
    state: "SCHEDULED",
    clubWideTarget: false,
    seriesId: null,
    occurrenceIndex: null,
    coordinationRevision: 2,
    creatorPersonId: "me-1",
    createdAt: iso(-30),
    updatedAt: iso(-1),
    version: 3,
    competitionId: null,
    competitionName: null,
    opponent: null,
    isTerminal: false,
    concreteTeamId: null,
    targets: { teams: [{ teamId: "team-a", name: "Sexta A" }], persons: [] },
    logistics: null,
    audienceCount: 14,
  },
  {
    id: "training-cancelado",
    type: "CLUB_EVENT",
    title: "Asada solidaria",
    startAt: iso(5, 14),
    endAt: iso(5, 18),
    timeZone: "America/Argentina/Buenos_Aires",
    venueId: "venue-1",
    venue: { id: "venue-1", name: "Club GEI", address: "Av. del Libertador 100" },
    state: "CANCELLED",
    clubWideTarget: true,
    seriesId: null,
    occurrenceIndex: null,
    coordinationRevision: 1,
    creatorPersonId: "me-1",
    createdAt: iso(-20),
    updatedAt: iso(-2),
    version: 2,
    competitionId: null,
    competitionName: null,
    opponent: null,
    isTerminal: true,
    concreteTeamId: null,
    targets: { teams: [], persons: [] },
    logistics: null,
    audienceCount: null,
  },
  {
    id: "match-banco",
    type: "MATCH",
    title: "GEI vs. Banco",
    startAt: iso(7, 16),
    endAt: iso(7, 18),
    timeZone: "America/Argentina/Buenos_Aires",
    venueId: "venue-1",
    venue: { id: "venue-1", name: "Club GEI", address: "Av. del Libertador 100" },
    state: "POSTPONED",
    clubWideTarget: false,
    seriesId: null,
    occurrenceIndex: null,
    coordinationRevision: 4,
    creatorPersonId: "me-1",
    createdAt: iso(-25),
    updatedAt: iso(-1),
    version: 4,
    competitionId: "comp-1",
    competitionName: "Copa GEI",
    opponent: "Banco",
    isTerminal: false,
    concreteTeamId: "team-a",
    targets: { teams: [{ teamId: "team-a", name: "Sexta A" }], persons: [] },
    logistics: null,
    audienceCount: 14,
  },
  {
    id: "match-sic",
    type: "MATCH",
    title: "GEI vs. Sic",
    startAt: iso(-4, 17),
    endAt: iso(-4, 19),
    timeZone: "America/Argentina/Buenos_Aires",
    venueId: "venue-1",
    venue: { id: "venue-1", name: "Club GEI", address: "Av. del Libertador 100" },
    state: "COMPLETED",
    clubWideTarget: false,
    seriesId: null,
    occurrenceIndex: null,
    coordinationRevision: 6,
    creatorPersonId: "me-1",
    createdAt: iso(-30),
    updatedAt: iso(-4),
    version: 6,
    competitionId: "comp-1",
    competitionName: "Copa GEI",
    opponent: "Sic",
    isTerminal: true,
    concreteTeamId: "team-a",
    targets: { teams: [{ teamId: "team-a", name: "Sexta A" }], persons: [] },
    logistics: null,
    audienceCount: 14,
  },
  {
    id: "match-cuba",
    type: "MATCH",
    title: "GEI vs. Cuba",
    startAt: iso(10, 16),
    endAt: iso(10, 18),
    timeZone: "America/Argentina/Buenos_Aires",
    venueId: "venue-1",
    venue: { id: "venue-1", name: "Club GEI", address: "Av. del Libertador 100" },
    state: "SCHEDULED",
    clubWideTarget: false,
    seriesId: null,
    occurrenceIndex: null,
    coordinationRevision: 1,
    creatorPersonId: "me-1",
    createdAt: iso(-15),
    updatedAt: iso(-2),
    version: 2,
    competitionId: "comp-1",
    competitionName: "Copa GEI",
    opponent: "Cuba",
    isTerminal: false,
    concreteTeamId: "team-a",
    targets: { teams: [{ teamId: "team-a", name: "Sexta A" }], persons: [] },
    logistics: null,
    audienceCount: 14,
  },
  {
    id: "training-serie-2",
    type: "TRAINING",
    title: "Entrenamiento físico",
    startAt: iso(1, 20),
    endAt: iso(1, 22),
    timeZone: "America/Argentina/Buenos_Aires",
    venueId: "venue-1",
    venue: { id: "venue-1", name: "Club GEI", address: "Av. del Libertador 100" },
    state: "SCHEDULED",
    clubWideTarget: false,
    seriesId: "series-1",
    occurrenceIndex: 1,
    coordinationRevision: 1,
    creatorPersonId: "me-1",
    createdAt: iso(-10),
    updatedAt: iso(-1),
    version: 2,
    competitionId: null,
    competitionName: null,
    opponent: null,
    isTerminal: false,
    concreteTeamId: null,
    targets: { teams: [{ teamId: "team-a", name: "Sexta A" }], persons: [] },
    logistics: null,
    audienceCount: 14,
  },
]

export const cannedNotifications = [
  {
    id: "note-1",
    recipientPersonId: "me-1",
    type: "EVENT_CHANGED",
    resourceType: "EVENT",
    resourceId: "training-scheduled",
    originEventId: "training-scheduled",
    title: "Evento actualizado",
    body: "El evento \"Entrenamiento táctico\" cambió (fecha, sede o coordinación).",
    occurredAt: iso(0, 9),
    readAt: null,
    isUnread: true,
    dedupeKey: "training-scheduled|EVENT|training-scheduled|me-1|EVENT_CHANGED",
  },
]

const cannedMe = {
  authenticated: true,
  csrfToken: "test-csrf",
  principal: {
    sessionId: "session-1",
    accountId: "account-1",
    personId: "me-1",
    username: "e.coach",
    credentialVersion: 1,
    csrfToken: "test-csrf",
    expiresAt: iso(1, 0),
  },
  operations: ["RC-02", "RC-03", "RC-23"],
  canAccessApplication: true,
  isAdmin: false,
  isSubcommittee: false,
  role: "COACH",
  firstName: "Elina",
  lastName: "Coach",
  username: "e.coach",
  email: "elina@example.com",
  phone: "1234567",
  dni: null,
  birthDate: null,
  membershipActive: true,
  profileCompleted: true,
  accountStatus: "ACTIVE",
  roleAssignments: [
    { id: "ra-1", role: "COACH", scopeType: "TEAM", scopeRefId: "team-a", validFrom: "2026-01-01", validUntil: null },
  ],
  teamAssignments: [{ id: "ta-1", teamId: "team-a", validFrom: "2026-01-01", validUntil: null }],
  teams: ["team-a"],
}

const cannedStructure = {
  seasons: [{ id: "s1", name: "Temporada 2026", startsOn: "2026-01-01", endsOn: "2026-12-31", archivedAt: null }],
  divisions: [{ id: "d1", name: "Sexta", archivedAt: null }],
  lines: [{ id: "l1", name: "A", archivedAt: null }],
  teams: [{ id: "team-a", state: "ACTIVE", name: "Sexta A", seasonId: "s1", divisionId: "d1", lineId: "l1" }],
  venues: [{ id: "venue-1", name: "Club GEI", address: "Av. del Libertador 100", archivedAt: null }],
  competitions: [{ id: "comp-1", seasonId: "s1", name: "Copa GEI", archivedAt: null, seasonName: "Temporada 2026" }],
}

const cannedJornada = {
  id: "jornada-1",
  seasonId: "s1",
  competitionId: "comp-1",
  name: "Jornada 12",
  date: "2026-06-27",
  createdAt: iso(-3),
  matches: [cannedEvents[3], cannedEvents[4]],
}

function json(body: unknown, status = 200): Response {
  const text = JSON.stringify(body)
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    headers: { get: (name: string) => (name.toLowerCase() === "content-type" ? "application/json" : null) },
    json: async () => JSON.parse(text),
    text: async () => text,
    clone() { return json(body, status) },
  } as unknown as Response
}

export function installApiMock(options: ApiMockOptions = {}) {
  const me = { ...cannedMe, ...(options.me ?? {}) }
  const events = options.events ?? cannedEvents
  const notifications = options.notifications ?? cannedNotifications

  const findEvent = (id: string) => events.find((event) => event.id === id)

  const impl = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = new URL(String(input), "http://localhost")
    const path = url.pathname
    const method = String(init?.method ?? "GET").toUpperCase()

    if (path === "/api/me" && method === "GET") return json(me)
    if (path === "/api/structure" && method === "GET") return json(cannedStructure)
    if (path === "/api/structure/competitions" && method === "GET") return json({ items: cannedStructure.competitions })
    if (path === "/api/calendar/range" && method === "GET") return json({ items: events })
    if (path === "/api/events/next" && method === "GET") return json({ event: events.find((event) => event.state === "SCHEDULED") ?? null })
    if (path === "/api/notifications" && method === "GET") return json({ items: notifications })
    const readMatch = /^\/api\/notifications\/([^/]+)\/read$/.exec(path)
    if (readMatch && method === "POST") {
      const id = decodeURIComponent(readMatch[1]!)
      const note = notifications.find((item) => item.id === id)
      return note ? json({ notificationRead: true, notificationId: id, readAt: new Date().toISOString(), alreadyRead: false }) : json({ error: { code: "NOTIFICATION_NOT_FOUND", message: "not found" } }, 404)
    }
    if (path === "/api/jornadas" && method === "GET") return json({ items: [{ id: cannedJornada.id, seasonId: cannedJornada.seasonId, competitionId: cannedJornada.competitionId, name: cannedJornada.name, date: cannedJornada.date, matchCount: 2, createdAt: cannedJornada.createdAt }] })
    const jornadaMatch = /^\/api\/jornadas\/([^/]+)$/.exec(path)
    if (jornadaMatch && method === "GET") return json(cannedJornada)
    if (path === "/api/jornadas" && method === "POST") return json({ jornadaCreated: true, id: "jornada-new", matchCount: 2 }, 201)

    const eventSeriesMatch = /^\/api\/event-series\/([^/]+)$/.exec(path)
    if (eventSeriesMatch && method === "GET") return json({ id: "series-1", name: "Entrenamientos físicos", state: "ACTIVE", recurrenceRule: "FREQ=WEEKLY;COUNT=8;BYDAY=TU", maxOccurrences: 366, createdAt: iso(-10), occurrences: events.filter((event) => event.seriesId === "series-1") })

    const detailMatch = /^\/api\/events\/([^/]+)$/.exec(path)
    if (detailMatch && method === "GET") {
      const id = decodeURIComponent(detailMatch[1]!)
      const event = findEvent(id)
      return event ? json(event) : json({ error: { code: "EVENT_NOT_FOUND", message: "not found" } }, 404)
    }
    const rosterMatch = /^\/api\/teams\/([^/]+)\/roster$/.exec(path)
    if (rosterMatch && method === "GET") return json({ items: [{ assignmentId: "a-1", personId: "p-1", firstName: "Ana", lastName: "González", username: "ana", accountStatus: "ACTIVE", phone: null, email: null, dni: null, birthDate: null, validFrom: "2026-01-01", validUntil: null }] })

    const transitionMatch = /^\/api\/events\/([^/]+)\/(postpone|reschedule|cancel|restore|complete|abandon)$/.exec(path)
    if (transitionMatch && method === "POST") {
      const id = decodeURIComponent(transitionMatch[1]!)
      const event = findEvent(id)
      if (!event) return json({ error: { code: "EVENT_NOT_FOUND", message: "not found" } }, 404)
      const to = transitionMatch[2] === "postpone" ? "POSTPONED" : transitionMatch[2] === "reschedule" ? "SCHEDULED" : transitionMatch[2] === "cancel" ? "CANCELLED" : "SCHEDULED"
      return json({ eventUpdated: true, eventId: id, state: to, version: event.version + 1, coordinationRevision: event.coordinationRevision + 1 })
    }

    if (path === "/api/events" && method === "POST") return json({ eventCreated: true, id: "event-new", state: "SCHEDULED", type: "TRAINING" }, 201)

    return json({ error: { code: "NOT_FOUND", message: `unmocked ${method} ${path}` } }, 404)
  }

  vi.stubGlobal("fetch", vi.fn(impl))
  return () => vi.unstubAllGlobals()
}
