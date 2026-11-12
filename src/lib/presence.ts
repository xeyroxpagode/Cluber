/** Vocabulario y helpers de presentación sin dependencias de mock state. */

export const todayIso = () => new Date().toLocaleDateString("en-CA") // YYYY-MM-DD local

export const roleText: Record<string, string> = {
  PLAYER: "Jugadora",
  CAPTAIN: "Capitana",
  COACH: "Entrenadora",
  SUBCOMMITTEE: "Subcomisión",
  ADMIN: "Administración",
}

export const roleTextOf = (role: string) => roleText[role] ?? role

export const periodLabel = (from: string, until: string | null) =>
  until ? `${from} → ${until}` : `Desde ${from}`
