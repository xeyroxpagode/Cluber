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
      if (!event) return json({ error: { code: "EVENT_NOT_FOUND", message: "not found" } }, 404)
      return json({
        ...event,
        participation: {
          ownAvailability: {
            eventId: id,
            value: null,
            state: "NO_RESPONSE",
            respondedAt: null,
            coordinationRevision: null,
            eventCoordinationRevision: event.coordinationRevision,
            needsReconfirmation: false,
          },
          attendance: {
            eventId: id,
            sheetId: "sheet-1",
            state: "OPEN",
            closedAt: null,
            closedBy: null,
            counts: { PRESENT: 1, ABSENT: 0, JUSTIFIED: 0, UNRECORDED: 1 },
            items: [
              { personId: "p-1", name: "Ana González", entryId: "entry-1", value: "PRESENT", state: "PRESENT", recordedAt: iso(-1), correctedAt: null, correctionReason: null, previousValue: null, corrections: [] },
              { personId: "p-2", name: "Pedro Ramos", entryId: null, value: null, state: "UNRECORDED", recordedAt: null, correctedAt: null, correctionReason: null, previousValue: null, corrections: [] },
            ],
            staff: ["me-1"],
          },
        },
      })
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

    /* ── T04 — superficies de participación (R15..R18) ── */
    const availabilitySummary = /^\/api\/events\/([^/]+)\/availability\/summary$/.exec(path)
    if (availabilitySummary && method === "GET") {
      const id = decodeURIComponent(availabilitySummary[1]!)
      return json({
        eventId: id,
        eventState: "SCHEDULED",
        coordinationRevision: 2,
        counts: { YES: 1, MAYBE: 0, NO: 0, NO_RESPONSE: 1, NEEDS_RECONFIRMATION: 0 },
        items: [
          { personId: "me-1", name: "Elina Coach", value: "YES", state: "YES", respondedAt: iso(-1), coordinationRevision: 2, needsReconfirmation: false },
          { personId: "p-2", name: "Ana González", value: null, state: "NO_RESPONSE", respondedAt: null, coordinationRevision: null, needsReconfirmation: false },
        ],
        total: 2,
      })
    }
    const myStatus = /^\/api\/events\/([^/]+)\/selection\/my-status$/.exec(path)
    if (myStatus && method === "GET") {
      const id = decodeURIComponent(myStatus[1]!)
      return json({ matchId: id, status: "SELECTED", order: 1, publishedAt: iso(-2), revisionId: "revision-1" })
    }
    const selectionDetail = /^\/api\/events\/([^/]+)\/selection$/.exec(path)
    if (selectionDetail && method === "GET") {
      const id = decodeURIComponent(selectionDetail[1]!)
      return json({
        selectionId: "selection-1",
        matchId: id,
        currentDraft: { revisionId: "revision-draft", state: "DRAFT", autosaveVersion: 1, publishedAt: null, publishedBy: null, entries: [{ personId: "p-1", role: "SELECTED", order: 1, conflicts: [] }], conflicts: [] },
        publishedRevisions: [{ revisionId: "revision-1", state: "PUBLISHED", autosaveVersion: 0, publishedAt: iso(-2), publishedBy: "me-1", entries: [{ personId: "me-1", role: "SELECTED", order: 1, conflicts: [] }], conflicts: [] }],
        history: [{ revisionId: "revision-1", publishedAt: iso(-2), added: ["me-1"], removed: [], changed: [] }],
      })
    }
    const matchRecord = /^\/api\/events\/([^/]+)\/match-record$/.exec(path)
    if (matchRecord && method === "GET") {
      const id = decodeURIComponent(matchRecord[1]!)
      return json({
        matchRecordId: "record-1",
        matchId: id,
        state: "DRAFT",
        resultType: null,
        homeScore: null,
        awayScore: null,
        observations: null,
        finalizedAt: null,
        finalizedBy: null,
        correctedAt: null,
        correctedBy: null,
        correctionReason: null,
        previousResultType: null,
        previousHomeScore: null,
        previousAwayScore: null,
        previousObservations: null,
        event: { id, state: "SCHEDULED", version: 3, coordinationRevision: 2 },
        playerStats: [],
        corrections: [],
      })
    }
    const startEvent = /^\/api\/events\/([^/]+)\/start$/.exec(path)
    if (startEvent && method === "POST") {
      const id = decodeURIComponent(startEvent[1]!)
      return json({ eventId: id, state: "IN_PROGRESS", version: 4, coordinationRevision: 2 })
    }
    const attendanceSheet = /^\/api\/events\/([^/]+)\/attendance$/.exec(path)
    if (attendanceSheet && method === "POST") return json({ entryId: "entry-1", value: "PRESENT", recordedAt: new Date().toISOString() })

    /* ── T05 — DG-13 Announcements + DG-14 Conversations (R21..R26) ── */
    const t05People = [
      { id: "me-1", firstName: "Elina", lastName: "Coach", username: "elina", accountStatus: "ACTIVE", phone: null, email: null, dni: null, birthDate: null },
      { id: "p-1", firstName: "Ana", lastName: "González", username: "ana", accountStatus: "ACTIVE", phone: null, email: null, dni: null, birthDate: null },
      { id: "p-2", firstName: "Pedro", lastName: "Ramos", username: "pedro", accountStatus: "ACTIVE", phone: null, email: null, dni: null, birthDate: null },
    ]
    const t05Conversations = [{
      id: "conv-1", type: "DIRECT", title: null, state: "ACTIVE", teamId: null, eventId: null,
      participantCount: 2, version: 1, lastActivityAt: iso(-1), unreadCount: 2,
    }]
    const t05Messages = [{
      id: "msg-1", conversationId: "conv-1", authorPersonId: "p-2", body: "Hola del mock",
      state: "SENT", sentAt: iso(-2), editedAt: null, deletedAt: null, deletionReason: null,
    }]
    const t05Announcements = [{
      id: "ann-1", title: "Comunicado de prueba", body: "Contenido del comunicado", state: "PUBLISHED",
      publishedAt: iso(-1), publishedByPersonId: "me-1", archivedAt: null, revision: 1, version: 2,
      clubWide: true, audienceSnapshot: [], readState: { readAt: null },
    }]
    const page = <T,>(items: T[]) => ({ items, hasMore: false, nextCursor: null })

    if (path === "/api/management/people" && method === "GET") return json({ items: t05People })
    if (path === "/api/communication/candidates" && method === "GET") return json({
      people: t05People.map((p) => ({ id: p.id, firstName: p.firstName, lastName: p.lastName })),
      teams: [{ id: cannedStructure.teams[0]?.id ?? "team-1", name: "Equipo A" }],
      events: [{ id: cannedEvents[0]?.id ?? "event-1", title: cannedEvents[0]?.title ?? "Partido" }],
    })
    if (path === "/api/conversations" && method === "GET") return json(page(t05Conversations))
    if (path === "/api/conversations/direct" && method === "POST") return json({ id: "conv-new", type: "DIRECT", title: null, state: "ACTIVE", teamId: null, eventId: null, participantCount: 2, version: 1 }, 201)
    if (path === "/api/conversations/group" && method === "POST") return json({ id: "conv-new", type: "GROUP", title: "Grupo", state: "ACTIVE", teamId: null, eventId: null, participantCount: 2, version: 1 }, 201)
    if (path === "/api/conversations/team-event" && method === "POST") return json({ id: "conv-new", type: "TEAM", title: null, state: "ACTIVE", teamId: cannedStructure.teams[0]?.id ?? "team-1", eventId: null, participantCount: 3, version: 1 }, 201)
    const threadMatch = /^\/api\/conversations\/([^/]+)\/thread$/.exec(path)
    if (threadMatch && method === "GET") return json(page(t05Messages))
    const messagePost = /^\/api\/conversations\/([^/]+)\/messages$/.exec(path)
    if (messagePost && method === "POST") return json({ ...t05Messages[0], id: "msg-new", body: "Hola", authorPersonId: "me-1" }, 201)
    const messageMatch = /^\/api\/messages\/([^/]+)$/.exec(path)
    if (messageMatch && method === "PATCH") return json({ ...t05Messages[0], state: "EDITED", editedAt: iso(0) })
    if (messageMatch && method === "DELETE") return json({ ...t05Messages[0], body: null, state: "DELETED", deletedAt: iso(0), deletionReason: "Eliminado" })
    const convMatch = /^\/api\/conversations\/([^/]+)$/.exec(path)
    if (convMatch && method === "GET") return json(t05Conversations[0])
    if (convMatch && method === "POST") return json({ ...t05Conversations[0], state: "ARCHIVED" })
    if (path === "/api/announcements" && method === "GET") return json(page(t05Announcements))
    if (path === "/api/announcements/draft" && method === "POST") return json({ ...t05Announcements[0], state: "DRAFT", publishedAt: null, version: 1 }, 201)
    const draftMatch = /^\/api\/announcements\/draft\/([^/]+)$/.exec(path)
    if (draftMatch && method === "PATCH") return json({ ...t05Announcements[0], state: "DRAFT", version: 2, title: "Borrador editado" })
    const publishMatch = /^\/api\/announcements\/([^/]+)\/publish$/.exec(path)
    if (publishMatch && method === "POST") return json({ ...t05Announcements[0], state: "PUBLISHED", publishedAt: iso(0), version: 3 })
    const archiveMatch = /^\/api\/announcements\/([^/]+)\/archive$/.exec(path)
    if (archiveMatch && method === "POST") return json({ ...t05Announcements[0], state: "ARCHIVED", archivedAt: iso(0) })
    const correctMatch = /^\/api\/announcements\/([^/]+)\/correct$/.exec(path)
    if (correctMatch && method === "PATCH") return json({ ...t05Announcements[0], revision: 2 })
    const announcementMatch = /^\/api\/announcements\/([^/]+)$/.exec(path)
    if (announcementMatch && method === "GET") return json(t05Announcements[0])

    return json({ error: { code: "NOT_FOUND", message: `unmocked ${method} ${path}` } }, 404)
  }

  vi.stubGlobal("fetch", vi.fn(impl))
  return () => vi.unstubAllGlobals()
}
