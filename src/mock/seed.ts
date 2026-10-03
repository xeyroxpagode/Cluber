import type { Event, State } from "./model"

const names = [
  "Victoria Berg",
  "Pilar Gómez",
  "Lucía Fernández",
  "Martina López",
  "Sofía Romero",
  "Camila Suárez",
  "Valentina Rossi",
  "Josefina Díaz",
  "Julieta Acosta",
  "Delfina Torres",
  "Catalina Ruiz",
  "Agustina Molina",
  "Malena Castro",
  "Milagros Pérez",
  "Clara Méndez",
  "Florencia Vidal",
  "Lola Martínez",
  "Paula Benítez",
]
const baseEvent = (
  id: string,
  type: Event["type"],
  date: string,
  time: string,
  opponent = "",
): Event => ({
  id,
  type,
  date,
  time,
  end: type === "MATCH" ? "19:30" : "20:30",
  title:
    type === "TRAINING" ? "Entrenamiento de Sexta A" : "Encuentro de hockey",
  team: "sexta",
  targetTeams: ["sexta"],
  targetPersonIds: [],
  seriesId: null,
  venueId: "v1",
  venue: "GEI · Cancha de hockey",
  venueAddress: "Av. Mitre 1240, Ituzaingó",
  opponent,
  state: "SCHEDULED",
  revision: 1,
  version: 1,
  competition: "Torneo AHBA 2026 · Damas",
  meeting: "17:00",
  departure: "",
  point: "Entrada de la cancha",
  transport: "Nos encontramos directamente en el club.",
  arrival: "Llegar con 30 minutos de anticipación y ambas camisetas.",
  clubWide: false,
  availability: Object.fromEntries(names.slice(0, 15).map((_, index) => [
      `p${index}`,
      {
        value: index < 11 ? "YES" : index < 13 ? "MAYBE" : "NO",
        revision: 1,
      },
    ])),
  selection: names.slice(0, 12).map((_, index) => `p${index}`),
  published: null,
  selectionRevisions: [],
  attendance: {},
  attendanceOpened: false,
  attendanceClosed: false,
  record: {
    state: "DRAFT",
    status: "PLAYED",
    gei: 0,
    opponent: 0,
    observations: "",
    stats: {},
  },
  history: ["Evento programado por Tomás Beltrán · 28 sep 2026"],
})
export function createSeed(): State {
  const match = baseEvent("match-cuba", "MATCH", "2026-10-10", "18:00", "CUBA")
  match.revision = 2
  match.published = [...match.selection]
  match.selectionRevisions = [
    {
      id: "selection-r1",
      players: [...match.selection],
      author: "Tomás Beltrán",
      date: "1 oct 2026 · 10:00",
    },
  ]
  match.history.unshift("Horario actualizado de 16:00 a 18:00 · 1 oct 2026")
  const completed = baseEvent(
    "match-sic",
    "MATCH",
    "2026-09-26",
    "16:00",
    "SIC",
  )
  completed.state = "COMPLETED"
  completed.attendanceOpened = true
  completed.attendanceClosed = true
  completed.attendance = Object.fromEntries(
    names
      .slice(0, 14)
      .map((_, index) => [`p${index}`, index < 12 ? "PRESENT" : "JUSTIFIED"]),
  )
  completed.record = {
    state: "FINAL",
    status: "PLAYED",
    gei: 3,
    opponent: 1,
    observations: "Buen trabajo colectivo. Dos goles en el último cuarto.",
    stats: {
      p0: { played: true, goals: 2, assists: 0 },
      p2: { played: true, goals: 1, assists: 1 },
      p1: { played: true, goals: 0, assists: 1 },
    },
  }
  const training = baseEvent(
    "training-today",
    "TRAINING",
    "2026-10-02",
    "19:00",
  )
  training.attendanceOpened = true
  training.attendance = {
    p0: "PRESENT",
    p1: "PRESENT",
    p2: "PRESENT",
    p3: "JUSTIFIED",
  }
  const postponed = baseEvent(
    "match-banco",
    "MATCH",
    "2026-10-17",
    "16:00",
    "Banco Nación",
  )
  postponed.state = "POSTPONED"
  const cancelled = baseEvent(
    "training-cancelled",
    "TRAINING",
    "2026-10-01",
    "19:00",
  )
  cancelled.state = "CANCELLED"
  const unresolved = baseEvent(
    "match-lomas",
    "MATCH",
    "2026-09-30",
    "17:00",
    "Lomas",
  )
  unresolved.state = "IN_PROGRESS"
  const club = baseEvent("club-event", "CLUB_EVENT", "2026-10-11", "10:00")
  club.title = "Encuentro de familias de hockey"
  club.clubWide = true
  club.targetTeams = []
  club.targetPersonIds = []
  training.seriesId = "series-sexta"
  const trainingNext = baseEvent("training-next", "TRAINING", "2026-10-06", "19:00")
  trainingNext.seriesId = "series-sexta"
  return {
    people: [
      ...names.map((name, index) => ({
        id: `p${index}`,
        name,
        team: "sexta",
        role: index === 0 ? "CAPTAIN" as const : "PLAYER" as const,
        eligibility:
          index === 4
            ? "BLOCKED" as const
            : index === 12
              ? "PENDING" as const
              : "ELIGIBLE" as const,
        phone: `11 5402 ${String(2100 + index)}`,
        email: `${name.split(" ")[0].toLowerCase()}@ejemplo.com`,
        dni: `${45000000 + index}`,
        birth: "2010-05-12",
        account: "ACTIVE" as const,
        username: `jugadora${index}`,
        credentialVersion: 1,
        passwordSet: true,
      })),
      {
        id: "coach",
        name: "Tomás Beltrán",
        role: "COACH",
        team: "sexta",
        eligibility: "ELIGIBLE",
        phone: "11 6042 1870",
        email: "tomas.beltran@gei.com.ar",
        dni: "32145678",
        birth: "1986-08-21",
        account: "ACTIVE",
        username: "tomas.beltran",
        credentialVersion: 1,
        passwordSet: true,
      },
      {
        id: "admin",
        name: "Mariana Costa",
        role: "ADMIN",
        team: "",
        eligibility: "ELIGIBLE",
        phone: "11 4021 5620",
        email: "mariana@gei.com.ar",
        dni: "30123456",
        birth: "1984-04-10",
        account: "ACTIVE",
        username: "mariana.costa",
        credentialVersion: 1,
        passwordSet: true,
      },
      {
        id: "subcommittee",
        name: "Carolina Sánchez",
        role: "SUBCOMMITTEE",
        team: "",
        eligibility: "ELIGIBLE",
        phone: "11 4562 2391",
        email: "carolina@gei.com.ar",
        dni: "31234567",
        birth: "1985-07-01",
        account: "ACTIVE",
        username: "carolina.sanchez",
        credentialVersion: 1,
        passwordSet: true,
      },
      {
        id: "guardian",
        name: "Marcela Fernández",
        role: "PLAYER",
        team: "",
        eligibility: "ELIGIBLE",
        phone: "11 5000 0000",
        email: "marcela@ejemplo.com",
        dni: "28999888",
        birth: "1980-02-02",
        account: "ACTIVE",
        username: "marcela.fernandez",
        roleAssignments: [],
        credentialVersion: 1,
        passwordSet: true,
      },
    ],
    teams: [
      ["primera", "Primera"],
      ["quinta", "Quinta"],
      ["sexta", "Sexta"],
      ["septima", "Séptima"],
    ].map(([id, division]) => ({
      id,
      division,
      line: "A",
      season: "2026",
      name: `${division} A`,
      state: "ACTIVE",
    })),
    events: [
      training,
      match,
      trainingNext,
      club,
      postponed,
      completed,
      cancelled,
      unresolved,
    ],
    announcements: [
      {
        id: "a1",
        title: "Todo listo para la próxima fecha",
        body: "El sábado recibimos a CUBA en nuestra cancha. Recordamos traer ambas camisetas, protector bucal y botella de agua.\n\nLas familias pueden acompañar desde el sector de espectadores. Por favor, mantengamos libres los accesos a la cancha.\n\n¡Nos vemos en el club!",
        audience: "Sexta A",
        state: "PUBLISHED",
        publisher: "Carolina Sánchez · Subcomisión",
        date: "2026-10-01",
      },
      {
        id: "a2",
        title: "Encuentro de familias de hockey",
        body: "El domingo 11 de octubre compartiremos una mañana de hockey en GEI. El encuentro comienza a las 10:00. Invitamos a todas las familias a participar.",
        audience: "Todo hockey",
        state: "PUBLISHED",
        publisher: "Subcomisión de hockey",
        date: "2026-09-30",
      },
      {
        id: "a3",
        title: "Cierre de temporada 2026",
        body: "Estamos coordinando el encuentro de cierre de temporada. Próximamente compartiremos la fecha.",
        audience: "Todo hockey",
        state: "DRAFT",
        publisher: "Carolina Sánchez",
        date: "2026-10-02",
      },
    ],
    conversations: [
      {
        id: "c1",
        teamId: "sexta",
        title: "Sexta A · Equipo",
        kind: "TEAM",
        participants: ["coach", ...names.map((_, index) => `p${index}`)],
        unread: 2,
        messages: [
          {
            id: "m1",
            author: "p0",
            body: "¿Llevamos las dos camisetas el sábado?",
            time: "10:32",
          },
          {
            id: "m2",
            author: "coach",
            body: "Sí, las dos. Nos encontramos en la cancha a las 17:00.",
            time: "10:35",
          },
          {
            id: "m3",
            author: "p2",
            body: "Perfecto, gracias Tomi. ¡Nos vemos hoy!",
            time: "11:04",
          },
        ],
      },
      {
        id: "c2",
        title: "Victoria Berg",
        kind: "DIRECT",
        participants: ["coach", "p0"],
        unread: 0,
        messages: [
          {
            id: "m4",
            author: "p0",
            body: "Ya avisé al equipo el cambio de horario.",
            time: "09:48",
          },
          {
            id: "m5",
            author: "coach",
            body: "Buenísimo, Vicky. Gracias por coordinar.",
            time: "09:50",
          },
        ],
      },
      {
        id: "c3",
        eventId: "match-cuba",
        title: "GEI vs. CUBA · 10 oct",
        kind: "EVENT",
        participants: ["coach", "p0", "p2"],
        unread: 0,
        messages: [
          {
            id: "m6",
            author: "coach",
            body: "Este espacio es para coordinar la logística del partido.",
            time: "Ayer",
          },
        ],
      },
    ],
    notifications: [
      {
        id: "n1",
        type: "EVENT_RESCHEDULED",
        title: "Partido reprogramado",
        body: "GEI vs. CUBA pasó de las 16:00 a las 18:00. Las jugadoras deben reconfirmar su disponibilidad.",
        route: "/events/match-cuba",
        date: "Hace 1 hora",
        read: false,
      },
      {
        id: "n2",
        type: "ANNOUNCEMENT_PUBLISHED",
        title: "Comunicado publicado",
        body: "Todo listo para la próxima fecha · Sexta A",
        route: "/announcements/a1",
        date: "Ayer",
        read: false,
      },
      {
        id: "n3",
        type: "SELECTION_PUBLISHED",
        title: "Convocatoria publicada",
        body: "La convocatoria de GEI vs. CUBA ya está disponible.",
        route: "/events/match-cuba",
        date: "Ayer",
        read: true,
      },
    ],
    structure: [
      { id: "s1", type: "Temporada", name: "2026", archived: false },
      ...["Primera", "Quinta", "Sexta", "Séptima"].map((name, index) => ({
        id: `d${index}`,
        type: "División",
        name,
        archived: false,
      })),
      { id: "l1", type: "Línea", name: "A", archived: false },
      { id: "l2", type: "Línea", name: "B", archived: false },
      { id: "l3", type: "Línea", name: "Proyección", archived: false },
      {
        id: "v1",
        type: "Sede",
        name: "GEI · Cancha de hockey",
        archived: false,
      },
      { id: "v2", type: "Sede", name: "CUBA · Villa de Mayo", archived: false },
    ],
    competitions: [
      {
        id: "ahba",
        name: "Torneo AHBA 2026 · Damas",
        organizer: "Asociación Amateur de Hockey de Buenos Aires",
        state: "ACTIVE",
        entries: [
          {
            id: "entry1",
            scope: "LINE",
            team: "A",
            state: "ACTIVE",
            reference: "AHBA · Línea A · 2026",
          },
        ],
      },
    ],
    jornadas: [
      {
        id: "j1",
        name: "Fecha 18 · GEI vs. CUBA",
        season: "2026",
        competition: "ahba",
        events: ["match-cuba"],
      },
    ],
    audit: [
      {
        id: "audit1",
        actor: "Tomás Beltrán",
        action: "Reprogramar partido",
        resource: "GEI vs. CUBA",
        reason: "Cambio de horario confirmado por el club visitante",
        date: "01 oct 2026 · 14:20",
      },
      {
        id: "audit2",
        actor: "Mariana Costa",
        action: "Asignar equipo",
        resource: "Lucía Fernández · Sexta A",
        reason: "Alta de temporada",
        date: "28 sep 2026 · 10:15",
      },
    ],
    venues: [
      { id: "v1", name: "GEI · Cancha de hockey", address: "Av. Mitre 1240, Ituzaingó", fieldLabel: "Cancha 1" },
      { id: "v2", name: "CUBA · Villa de Mayo", address: "Av. San Martín 4250, Villa de Mayo" },
    ],
    eligibilityConstraints: [
      {
        id: "ec-p4",
        personId: "p4",
        state: "BLOCKED",
        scope: "ENTRY",
        scopeRefId: "entry1",
        source: "AHBA",
        reason: "FEDERATION",
        note: "Pase pendiente de registración federativa.",
        validFrom: "2026-03-01",
        validUntil: null,
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
        validFrom: "2026-09-01",
        validUntil: null,
      },
    ],
    memberships: [
      ...names.map((_, index) => ({
        id: `mem-p${index}`,
        personId: `p${index}`,
        validFrom: "2026-03-01",
        validUntil: null as string | null,
      })),
      { id: "mem-coach", personId: "coach", validFrom: "2026-03-01", validUntil: null as string | null },
      { id: "mem-admin", personId: "admin", validFrom: "2026-03-01", validUntil: null as string | null },
      { id: "mem-sub", personId: "subcommittee", validFrom: "2026-03-01", validUntil: null as string | null },
    ],
    teamAssignments: [
      ...names.map((_, index) => ({
        id: `ta-p${index}`,
        personId: `p${index}`,
        teamId: "sexta",
        validFrom: "2026-03-01",
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
        validFrom: "2026-03-01",
        validUntil: null as string | null,
      },
    ],
    eventSeries: [{ id: "series-sexta", name: "Entrenamientos Sexta A", status: "ACTIVE" as const }],
  }
}
