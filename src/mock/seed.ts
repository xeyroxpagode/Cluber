import type {
  AttendanceValue,
  Availability,
  Event,
  HistoryLine,
  Person,
  Response,
  State,
} from "./model"
import { addDays, todayIso } from "./clock"

const today = todayIso()

/** Timestamp ISO con offset simulado respecto al día real. */
const at = (dayOffset: number, hour: number, minute = 0) => {
  const [y, m, d] = addDays(today, dayOffset).split("-").map(Number)
  return new Date(y, m - 1, d, hour, minute, 0).toISOString()
}

const peopleNames = [
  ["p0", "Victoria Berg", "Victoria", "Berg", "CAPTAIN", "sexta"],
  ["p1", "Pilar Gómez", "Pilar", "Gómez", "PLAYER", "sexta"],
  ["p2", "Lucía Fernández", "Lucía", "Fernández", "PLAYER", "sexta"],
  ["p3", "Martina López", "Martina", "López", "PLAYER", "sexta"],
  ["p4", "Sofía Romero", "Sofía", "Romero", "PLAYER", "sexta"],
  ["p5", "Camila Suárez", "Camila", "Suárez", "PLAYER", "sexta"],
  ["p6", "Valentina Rossi", "Valentina", "Rossi", "PLAYER", "sexta"],
  ["p7", "Josefina Díaz", "Josefina", "Díaz", "PLAYER", "sexta"],
  ["p8", "Julieta Acosta", "Julieta", "Acosta", "PLAYER", "septima"],
  ["p9", "Delfina Torres", "Delfina", "Torres", "PLAYER", "septima"],
  ["p10", "Catalina Ruiz", "Catalina", "Ruiz", "PLAYER", "septima"],
  ["p11", "Agustina Molina", "Agustina", "Molina", "PLAYER", "septima"],
  ["p12", "Malena Castro", "Malena", "Castro", "PLAYER", "septima"],
  ["p13", "Milagros Pérez", "Milagros", "Pérez", "PLAYER", "septima"],
  ["p14", "Clara Méndez", "Clara", "Méndez", "PLAYER", "septima"],
  ["p15", "Florencia Vidal", "Florencia", "Vidal", "PLAYER", "quinta"],
  ["p16", "Lola Martínez", "Lola", "Martínez", "PLAYER", "quinta"],
  ["p17", "Rocío Peña", "Rocío", "Peña", "PLAYER", "quinta"],
]

const playerIds = peopleNames.map(([id]) => id)

const availabilityFor = (
  ids: string[],
  answers: Record<string, Response>,
  revision: number,
): Record<string, Availability> =>
  Object.fromEntries(
    ids.map((id) => [
      id,
      {
        value: answers[id] ?? "YES",
        coordinationRevision: revision,
        answeredAt: at(-1, 19),
      },
    ]),
  )

const noAnswers = (): Record<string, Availability> => ({})

interface EventOverrides {
  state?: Event["state"]
  title?: string
  date?: string
  time?: string
  end?: string
  venueId?: string
  opponent?: string
  seriesId?: string | null
  clubWide?: boolean
  targetTeams?: string[]
  targetPersonIds?: string[]
  coordinationRevision?: number
  meeting?: string
  departure?: string
  point?: string
  transport?: string
  arrival?: string
  availability?: Record<string, Availability>
  published?: string[] | null
  attendance?: Record<string, AttendanceValue>
  attendanceOpened?: boolean
  attendanceClosedAt?: string | null
  record?: Event["record"]
  history?: HistoryLine[]
}

function makeEvent(
  id: string,
  type: Event["type"],
  dayOffset: number,
  time: string,
  overrides: EventOverrides = {},
): Event {
  const date = overrides.date ?? addDays(today, dayOffset)
  const targetTeams = overrides.targetTeams ?? ["sexta"]
  const coordinationRevision = overrides.coordinationRevision ?? 1
  const responders = targetTeams.includes("sexta")
    ? playerIds.slice(0, 8)
    : targetTeams.includes("septima")
      ? playerIds.slice(8, 15)
      : []
  return {
    id,
    type,
    title:
      overrides.title ??
      (type === "TRAINING" ? "Entrenamiento" : "Encuentro de hockey"),
    targetTeams,
    targetPersonIds: overrides.targetPersonIds ?? [],
    seriesId: overrides.seriesId ?? null,
    venueId: overrides.venueId ?? "v1",
    date,
    time,
    end: overrides.end ?? (type === "MATCH" ? "19:30" : "20:30"),
    opponent: overrides.opponent ?? "",
    state: overrides.state ?? "SCHEDULED",
    coordinationRevision,
    version: 1,
    competitionId: type === "MATCH" ? "ahba" : null,
    competitionEntryId: type === "MATCH" ? "entry-line-sexta-a" : null,
    meeting: overrides.meeting ?? "17:00",
    departure: overrides.departure ?? "",
    point: overrides.point ?? "Entrada de la cancha",
    transport:
      overrides.transport ?? "Nos encontramos directamente en el club.",
    arrival:
      overrides.arrival ??
      "Llegar con 30 minutos de anticipación y ambas camisetas.",
    clubWide: overrides.clubWide ?? false,
    availability:
      overrides.availability ??
      availabilityFor(responders, {}, coordinationRevision),
    selection: [],
    selectionDraftAt: null,
    published: overrides.published ?? null,
    publishedAt: null,
    selectionRevisions: [],
    attendance: overrides.attendance ?? {},
    attendanceOpened: overrides.attendanceOpened ?? false,
    attendanceClosedAt: overrides.attendanceClosedAt ?? null,
    attendanceHistory: [],
    record:
      overrides.record ?? {
        state: "DRAFT",
        status: "PLAYED",
        gei: 0,
        opponent: 0,
        observations: "",
        stats: {},
      },
    recordHistory: [],
    history: overrides.history ?? [],
    divergedFromSeries: false,
  }
}

const peopleIds = playerIds

/** Línea de historial del seed: fecha y autor reales, nunca una etiqueta relativa. */
const line = (dayOffset: number, hour: number, actor: string, text: string) => ({
  id: `h-${dayOffset}-${hour}-${actor.slice(0, 4)}-${text.slice(0, 6)}`,
  at: at(dayOffset, hour),
  actor,
  text,
})

void peopleIds

export function createSeed(): State {
  const matchCuba = makeEvent("match-cuba", "MATCH", 6, "18:00", {
    opponent: "CUBA",
    coordinationRevision: 3,
    published: playerIds.slice(0, 8),
    meeting: "17:00",
  })
  // Una sola persona quedó con la confirmación del horario anterior.
  matchCuba.availability.p0 = {
    value: "YES",
    coordinationRevision: 1,
    answeredAt: at(-3, 19),
  }
  matchCuba.publishedAt = at(-1, 10)
  matchCuba.selection = [...(matchCuba.published ?? [])]
  matchCuba.selectionDraftAt = null
  matchCuba.selectionRevisions = [
    {
      id: "sel-r1",
      players: playerIds.slice(0, 8),
      added: playerIds.slice(0, 8),
      removed: [],
      author: "Tomás Beltrán",
      at: at(-1, 10),
      conflicts: ["p4"],
    },
  ]
  matchCuba.history = [
    line(-2, 18, "Tomás Beltrán", "Horario cambiado de 16:00 a 18:00"),
    line(-2, 10, "Tomás Beltrán", "Convocatoria publicada"),
    line(-8, 9, "Carolina Sánchez", "Evento programado"),
  ]

  const matchLomas = makeEvent("match-lomas", "MATCH", 0, "17:00", {
    opponent: "Lomas",
    state: "IN_PROGRESS",
    availability: availabilityFor(
      playerIds.slice(0, 8),
      { p0: "YES", p1: "YES", p2: "YES", p3: "MAYBE", p4: "NO" },
      1,
    ),
    attendanceOpened: true,
    attendance: {
      p0: "PRESENT",
      p1: "PRESENT",
      p2: "PRESENT",
      p3: "JUSTIFIED",
      p4: "ABSENT",
    },
    record: {
      state: "DRAFT",
      status: "PLAYED",
      gei: 1,
      opponent: 1,
      observations: "",
      stats: { p0: { played: true, goals: 1, assists: 0 } },
    },
  })
  matchLomas.history = [
    line(0, 17, "Tomás Beltrán", "Partido iniciado"),
    line(-4, 10, "Tomás Beltrán", "Convocatoria publicada"),
  ]

  const matchSic = makeEvent("match-sic", "MATCH", -6, "16:00", {
    opponent: "SIC",
    state: "COMPLETED",
    attendanceOpened: true,
    attendanceClosedAt: at(-6, 20),
    attendance: {
      p0: "PRESENT",
      p1: "PRESENT",
      p2: "PRESENT",
      p3: "PRESENT",
      p4: "ABSENT",
      p5: "PRESENT",
      p6: "JUSTIFIED",
    },
    record: {
      state: "FINAL",
      status: "PLAYED",
      gei: 3,
      opponent: 1,
      observations: "Buen trabajo colectivo. Dos goles en el último cuarto.",
      stats: {
        p0: { played: true, goals: 2, assists: 0 },
        p1: { played: true, goals: 0, assists: 1 },
        p2: { played: true, goals: 1, assists: 1 },
      },
    },
    history: [
      line(-5, 21, "Tomás Beltrán", "Resultado corregido de 3-1 a 4-1"),
      line(-6, 20, "Tomás Beltrán", "Resultado finalizado"),
      line(-6, 20, "Tomás Beltrán", "Asistencia cerrada"),
    ],
  })
  matchSic.recordHistory = [
    {
      id: "rh-1",
      before: "GEI vs. SIC 3-1 (Final)",
      after: "GEI vs. SIC 4-1 (Final)",
      actor: "Tomás Beltrán",
      at: at(-5, 21),
      reason: "Gol de먼트氏 corregido con el acta de la árbitra.",
    },
  ]
  matchSic.attendanceHistory = [
    {
      id: "ah-1",
      personId: "p6",
      before: "ABSENT",
      after: "JUSTIFIED",
      actor: "Tomás Beltrán",
      at: at(-6, 20, 5),
      reason: "Envió el certificado médico",
      correction: true,
    },
  ]

  const matchBanco = makeEvent("match-banco", "MATCH", 12, "16:00", {
    opponent: "Banco Nación",
    state: "POSTPONED",
    history: [line(-1, 11, "Carolina Sánchez", "Partido postergado")],
  })

  // Serie de 4 ocurrencias: obliga a que "Toda la serie" mute 4.
  const trainingSeries = [-3, 2, 5, 9].map((offset, index) =>
    makeEvent(`training-serie-${index + 1}`, "TRAINING", offset, "19:00", {
      title: "Entrenamiento Sexta A",
      seriesId: "series-sexta",
      availability: availabilityFor(
        playerIds.slice(0, 8),
        { p4: "MAYBE", p6: "NO" },
        1,
      ),
      history: index === 0 ? [line(-3, 9, "Carolina Sánchez", "Entrenamiento registrado")] : [],
    }),
  )

  const septimaMatch = makeEvent("match-septima-quinta", "MATCH", 8, "11:00", {
    opponent: "Quinta B",
    targetTeams: ["septima"],
    coordinationRevision: 2,
    published: playerIds.slice(8, 13),
    meeting: "10:15",
    departure: "10:00",
    point: "Estacionamiento interno",
    history: [line(-1, 17, "Carolina Sánchez", "Entrenamiento reprogramado")],
  })

  const clubEvent = makeEvent("club-familias", "CLUB_EVENT", 4, "10:00", {
    title: "Encuentro de familias de hockey",
    clubWide: true,
    targetTeams: [],
    availability: noAnswers(),
    history: [],
  })

  const cancelled = makeEvent("training-cancelado", "TRAINING", -1, "19:00", {
    state: "CANCELLED",
    history: [line(-1, 12, "Carolina Sánchez", "Entrenamiento cancelado")],
  })

  const people: Person[] = [
    ...peopleNames.map(
      ([id, name, firstName, lastName, role, team], index) => ({
        id: id as string,
        name: name as string,
        firstName: firstName as string,
        lastName: lastName as string,
        // Perfil incompleto deliberado para poder verificar D6.
        dni: id === "p17" ? "" : `45${String(100000 + index)}`,
        birth: id === "p17" ? "" : "2010-05-12",
        phone: id === "p17" ? "" : `11 5402 ${2100 + index}`,
        email: `${(firstName as string).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}@ejemplo.com`,
        account: id === "p16" ? ("PENDING" as const) : ("ACTIVE" as const),
        username: `${(firstName as string).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`,
        credentialVersion: 1,
        passwordSet: true,
        lastActivityAt: at(index % 5 === 0 ? 0 : -1, 9 + (index % 8), 12),
        sessions: [
          {
            id: `sess-${id}-1`,
            device: "Chrome · Windows",
            createdAt: at(-6, 8),
            lastSeenAt: at(0, 8 + (index % 6)),
            current: true,
          },
          {
            id: `sess-${id}-2`,
            device: "Chrome · Android",
            createdAt: at(-14, 21),
            lastSeenAt: at(-3, 22),
            current: false,
          },
        ],
        setupToken: null,
        roleAssignments: [
          {
            id: `${id}-player`,
            role: (role === "CAPTAIN" ? "PLAYER" : role) as
              | "PLAYER"
              | "CAPTAIN",
            scope: "TEAM" as const,
            target: team,
            validFrom: addDays(today, -200),
            validUntil: null,
          },
          ...(role === "CAPTAIN"
            ? [
                {
                  id: `${id}-captain`,
                  role: "CAPTAIN" as const,
                  scope: "TEAM" as const,
                  target: team,
                  validFrom: addDays(today, -200),
                  validUntil: null,
                },
              ]
            : []),
        ],
      }),
    ),
    {
      id: "coach",
      name: "Tomás Beltrán",
      firstName: "Tomás",
      lastName: "Beltrán",
      dni: "32145678",
      birth: "1986-08-21",
      phone: "11 6042 1870",
      email: "tomas.beltran@gei.com.ar",
      account: "ACTIVE",
      username: "tomas.beltran",
      credentialVersion: 2,
      passwordSet: true,
      lastActivityAt: at(0, 7, 40),
      sessions: [
        {
          id: "sess-coach-1",
          device: "Chrome · Windows",
          createdAt: at(-3, 7),
          lastSeenAt: at(0, 7, 40),
          current: true,
        },
        {
          id: "sess-coach-2",
          device: "Safari · iPad",
          createdAt: at(-30, 18),
          lastSeenAt: at(-9, 20),
          current: false,
        },
      ],
      setupToken: null,
      roleAssignments: [
        {
          id: "coach-sexta",
          role: "COACH",
          scope: "TEAM",
          target: "sexta",
          validFrom: addDays(today, -200),
          validUntil: null,
        },
        {
          id: "coach-septima",
          role: "COACH",
          scope: "TEAM",
          target: "septima",
          validFrom: addDays(today, -120),
          validUntil: null,
        },
      ],
    },
    {
      id: "admin",
      name: "Mariana Costa",
      firstName: "Mariana",
      lastName: "Costa",
      dni: "30123456",
      birth: "1984-04-10",
      phone: "11 4021 5620",
      email: "mariana@gei.com.ar",
      account: "ACTIVE",
      username: "mariana.costa",
      credentialVersion: 1,
      passwordSet: true,
      lastActivityAt: at(0, 8, 5),
      sessions: [
        {
          id: "sess-admin-1",
          device: "Chrome · Windows",
          createdAt: at(-2, 8),
          lastSeenAt: at(0, 8, 5),
          current: true,
        },
      ],
      setupToken: null,
      roleAssignments: [
        {
          id: "admin-club",
          role: "ADMIN",
          scope: "CLUB",
          target: "club",
          validFrom: addDays(today, -400),
          validUntil: null,
        },
      ],
    },
    {
      id: "subcommittee",
      name: "Carolina Sánchez",
      firstName: "Carolina",
      lastName: "Sánchez",
      dni: "31234567",
      birth: "1985-07-01",
      phone: "11 4562 2391",
      email: "carolina@gei.com.ar",
      account: "ACTIVE",
      username: "carolina.sanchez",
      credentialVersion: 1,
      passwordSet: true,
      lastActivityAt: at(0, 7, 15),
      sessions: [
        {
          id: "sess-sub-1",
          device: "Chrome · Windows",
          createdAt: at(-1, 7),
          lastSeenAt: at(0, 7, 15),
          current: true,
        },
      ],
      setupToken: null,
      roleAssignments: [
        {
          id: "sub-club",
          role: "SUBCOMMITTEE",
          scope: "CLUB",
          target: "club",
          validFrom: addDays(today, -400),
          validUntil: null,
        },
      ],
    },
    {
      id: "guardian",
      name: "Marcela Fernández",
      firstName: "Marcela",
      lastName: "Fernández",
      dni: "28999888",
      birth: "1980-02-02",
      phone: "11 5000 0000",
      email: "marcela@ejemplo.com",
      account: "ACTIVE",
      username: "marcela.fernandez",
      credentialVersion: 1,
      passwordSet: false,
      lastActivityAt: at(-2, 20),
      sessions: [
        {
          id: "sess-guardian-1",
          device: "Chrome · Windows",
          createdAt: at(-2, 20),
          lastSeenAt: at(-2, 20),
          current: true,
        },
      ],
      setupToken: null,
      // Guardian no es Role: no tiene RoleAssignment deportivo.
      roleAssignments: [],
    },
  ]

  return {
    people,
    structure: [
      { id: "s1", type: "SEASON", name: "2026", archived: false },
      { id: "s2", type: "SEASON", name: "2025", archived: false },
      { id: "d1", type: "DIVISION", name: "Primera", parentId: "s1", archived: false },
      { id: "d2", type: "DIVISION", name: "Quinta", parentId: "s1", archived: false },
      { id: "d3", type: "DIVISION", name: "Sexta", parentId: "s1", archived: false },
      { id: "d4", type: "DIVISION", name: "Séptima", parentId: "s1", archived: false },
      { id: "l1", type: "LINE", name: "A", archived: false },
      { id: "l2", type: "LINE", name: "B", archived: false },
      { id: "l3", type: "LINE", name: "Proyección", archived: false },
    ],
    venues: [
      {
        id: "v1",
        name: "GEI · Cancha de hockey",
        address: "Av. Mitre 1240, Ituzaingó",
        fieldLabel: "Cancha 1",
      },
      {
        id: "v2",
        name: "CUBA · Villa de Mayo",
        address: "Av. San Martín 4250, Villa de Mayo",
        fieldLabel: "Cancha 2",
      },
      {
        id: "v3",
        name: "Quinta · Club Atlético",
        address: "Av. 25 de Mayo 812, Ituzaingó",
        fieldLabel: "Cancha 1",
      },
    ],
    teams: [
      { id: "primera", divisionId: "d1", lineId: "l1", seasonId: "s1", state: "ACTIVE" },
      { id: "quinta", divisionId: "d2", lineId: "l2", seasonId: "s1", state: "ACTIVE" },
      { id: "sexta", divisionId: "d3", lineId: "l1", seasonId: "s1", state: "ACTIVE" },
      { id: "septima", divisionId: "d4", lineId: "l1", seasonId: "s1", state: "ACTIVE" },
    ],
    events: [
      matchLomas,
      trainingSeries[0],
      cancelled,
      matchSic,
      trainingSeries[1],
      clubEvent,
      matchCuba,
      matchBanco,
      septimaMatch,
      trainingSeries[2],
      trainingSeries[3],
    ],
    eventSeries: [
      {
        id: "series-sexta",
        name: "Entrenamientos Sexta A",
        status: "ACTIVE",
        createdAt: at(-30, 9),
      },
    ],
    eventOccurrenceOverrides: [],
    announcements: [
      {
        id: "a1",
        title: "Todo listo para la próxima fecha",
        body: "El sábado recibimos a CUBA en nuestra cancha. Recordamos traer ambas camisetas, protector bucal y botella de agua.\n\nLas familias pueden acompañar desde el sector de espectadores. Por favor, mantengamos libres los accesos a la cancha.\n\n¡Nos vemos en el club!",
        audience: { kind: "TEAMS", teamIds: ["sexta"] },
        audienceSnapshot: {
          clubWide: false,
          teamIds: ["sexta"],
          label: "Sexta A",
          at: at(-1, 9),
        },
        state: "PUBLISHED",
        publisher: "Carolina Sánchez",
        at: at(-1, 9),
        corrections: [],
      },
      {
        id: "a2",
        title: "Encuentro de familias de hockey",
        body: "El domingo compartimos una mañana de hockey en GEI. El encuentro comienza a las 10:00. Invitamos a todas las familias a participar.",
        audience: { kind: "CLUB" },
        audienceSnapshot: {
          clubWide: true,
          teamIds: [],
          label: "Todo el hockey",
          at: at(-3, 9),
        },
        state: "PUBLISHED",
        publisher: "Carolina Sánchez",
        at: at(-3, 9),
        corrections: [],
      },
      {
        id: "a3",
        title: "Cierre de temporada 2026",
        body: "Estamos coordinando el encuentro de cierre de temporada. Próximamente compartiremos la fecha.",
        audience: { kind: "CLUB" },
        audienceSnapshot: null,
        state: "DRAFT",
        publisher: "Carolina Sánchez",
        at: at(-1, 16),
        corrections: [],
      },
    ],
    conversations: [
      {
        id: "c-team-sexta",
        teamId: "sexta",
        kind: "TEAM",
        participants: ["coach", ...playerIds.slice(0, 8)],
        unread: { coach: 2, p2: 1 },
        state: "ACTIVE",
        messages: [
          {
            id: "m1",
            author: "p0",
            body: "¿Llevamos las dos camisetas el sábado?",
            at: at(0, 10, 32),
            state: "SENT",
          },
          {
            id: "m2",
            author: "coach",
            body: "Sí, las dos. Nos encontramos en la cancha 45 minutos antes.",
            at: at(0, 10, 35),
            state: "SENT",
          },
          {
            id: "m3",
            author: "p2",
            body: "Perfecto, gracias Tomi.",
            at: at(0, 11, 4),
            state: "SENT",
          },
        ],
      },
      {
        id: "c-direct-vicky",
        kind: "DIRECT",
        participants: ["coach", "p0"],
        unread: {},
        state: "ACTIVE",
        messages: [
          {
            id: "m4",
            author: "p0",
            body: "Ya avisé al equipo el cambio de horario.",
            at: at(-1, 9, 48),
            state: "SENT",
          },
          {
            id: "m5",
            author: "coach",
            body: "Buenísimo, Vicky. Gracias por coordinar.",
            at: at(-1, 9, 50),
            state: "SENT",
          },
        ],
      },
      {
        id: "c-event-cuba",
        eventId: "match-cuba",
        kind: "EVENT",
        participants: ["coach", "p0", "p2"],
        unread: { p2: 1 },
        state: "ACTIVE",
        messages: [
          {
            id: "m6",
            author: "coach",
            body: "Este espacio es para coordinar la logística del partido.",
            at: at(-1, 8, 30),
            state: "SENT",
          },
        ],
      },
    ],
    notifications: [
      {
        id: "n1",
        type: "EVENT_RESCHEDULED",
        title: "El horario del partido cambió",
        body: "GEI vs. CUBA pasó de 16:00 a 18:00. Hay que volver a confirmar la disponibilidad.",
        route: "/events/match-cuba",
        at: at(-2, 18, 5),
        recipients: ["coach", ...playerIds.slice(0, 8)],
        readBy: ["coach"],
      },
      {
        id: "n2",
        type: "ANNOUNCEMENT_PUBLISHED",
        title: "Comunicado para Sexta A",
        body: "Todo listo para la próxima fecha",
        route: "/announcements/a1",
        at: at(-1, 9, 5),
        recipients: [...playerIds.slice(0, 8)],
        readBy: [],
      },
      {
        id: "n3",
        type: "SELECTION_PUBLISHED",
        title: "Convocatoria publicada",
        body: "La convocatoria de GEI vs. CUBA ya está disponible.",
        route: "/events/match-cuba/selection",
        at: at(-2, 10, 0),
        recipients: ["coach", ...playerIds.slice(0, 8)],
        readBy: [...playerIds.slice(0, 8)],
      },
    ],
    competitions: [
      {
        id: "ahba",
        name: "Torneo AHBA 2026 · Damas",
        organizer: "Asociación Amateur de Hockey de Buenos Aires",
        state: "ACTIVE",
        entries: [
          {
            id: "entry-line-sexta-a",
            scope: "LINE",
            divisionId: "d3",
            lineId: "l1",
            seasonId: "s1",
            state: "ACTIVE",
            reference: "AHBA-L6A-2026",
          },
          {
            id: "entry-team-quinta-b",
            scope: "TEAM",
            teamId: "quinta",
            state: "ACTIVE",
            reference: "AHBA-5B-2026",
          },
          {
            id: "entry-team-primera-a",
            scope: "TEAM",
            teamId: "primera",
            state: "PENDING",
            reference: "AHBA-1A-2026",
          },
        ],
      },
      {
        id: "copa-gei",
        name: "Copa GEI 2026",
        organizer: "Gimnasia y Esgrima de Ituzaingó",
        state: "ACTIVE",
        entries: [
          {
            id: "entry-line-primera-a",
            scope: "LINE",
            divisionId: "d1",
            lineId: "l1",
            seasonId: "s1",
            state: "ACTIVE",
            reference: "COPA-1A-2026",
          },
        ],
      },
    ],
    jornadas: [
      {
        id: "j1",
        name: `Fecha ${todayIso().slice(8, 10)} · GEI vs. CUBA`,
        seasonId: "s1",
        competitionId: "ahba",
        events: ["match-cuba"],
        at: today,
        venueId: "v1",
        meeting: "17:00",
        departure: "",
        point: "Entrada de la cancha",
      },
    ],
    audit: [
      {
        id: "audit1",
        actor: "Tomás Beltrán",
        action: "Reprogramar partido",
        resource: "GEI vs. CUBA",
        before: "16:00",
        after: "18:00",
        source: "Celular del entrenador",
        at: at(-2, 18, 0),
        route: "/events/match-cuba",
      },
      {
        id: "audit2",
        actor: "Mariana Costa",
        action: "Asignar equipo",
        resource: "Lucía Fernández",
        before: "—",
        after: "Sexta A",
        source: "Alta de temporada",
        at: at(-200, 10, 15),
        route: "/management/people/p2",
      },
      {
        id: "audit3",
        actor: "Carolina Sánchez",
        action: "Publicar comunicado",
        resource: "Todo listo para la próxima fecha",
        before: "Borrador",
        after: "Publicado",
        source: "Subcomisión de hockey",
        at: at(-1, 9, 0),
        route: "/announcements/a1",
      },
    ],
    eligibilityConstraints: [
      {
        id: "ec-p4",
        personId: "p4",
        state: "BLOCKED",
        scope: "ENTRY",
        scopeRefId: "entry-line-sexta-a",
        source: "AHBA",
        reason: "FEDERATION",
        note: "Pase pendiente de registración federativa.",
        validFrom: addDays(today, -60),
        validUntil: null,
        createdAt: at(-60, 10),
        createdBy: "Carolina Sánchez",
      },
      {
        id: "ec-p12",
        personId: "p12",
        state: "PENDING",
        scope: "CLUB",
        scopeRefId: null,
        source: "INTERNAL",
        reason: "MEDICAL_CLEARANCE",
        note: "Apto médico en revisión.",
        validFrom: addDays(today, -20),
        validUntil: addDays(today, 30),
        createdAt: at(-20, 10),
        createdBy: "Carolina Sánchez",
      },
      {
        id: "ec-p9",
        personId: "p9",
        state: "BLOCKED",
        scope: "COMPETITION",
        scopeRefId: "ahba",
        source: "INTERNAL",
        reason: "DISCIPLINE",
        note: "Sanción de una fecha.",
        validFrom: addDays(today, -10),
        validUntil: addDays(today, 4),
        createdAt: at(-10, 10),
        createdBy: "Carolina Sánchez",
      },
    ],
    memberships: [
      // p16 tiene cuenta pendiente de activar: todavía no existe Membership (D2).
      ...people
        .filter((person) => person.id !== "p16")
        .map((person) => ({
          id: `mem-${person.id}`,
          personId: person.id,
          validFrom: addDays(today, -200),
          validUntil: null as string | null,
        })),
    ],
    teamAssignments: [
      // p16 tiene cuenta pendiente: todavía no hay TeamAssignment (D2).
      ...playerIds
        .filter((id) => id !== "p16")
        .map((id) => ({
          id: `ta-${id}`,
          personId: id,
          teamId: peopleNames[playerIds.indexOf(id)][5] as string,
          validFrom: addDays(today, -200),
          validUntil: null as string | null,
        })),
    ],
    guardianRelationships: [
      {
        id: "gr-1",
        guardianId: "guardian",
        childId: "p2",
        relation: "Madre",
        canViewChildInfo: true,
        canRespondAvailability: true,
        validFrom: addDays(today, -200),
        validUntil: null,
      },
      {
        id: "gr-2",
        guardianId: "guardian",
        childId: "p8",
        relation: "Madre",
        canViewChildInfo: true,
        canRespondAvailability: false,
        validFrom: addDays(today, -200),
        validUntil: null,
      },
    ],
  }
}

function state0Membership(ids: string[]) {
  return ids.filter((id) => id !== "p16")
}
