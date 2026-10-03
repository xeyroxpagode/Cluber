/**
 * Domain → presentation mapping explícito (Stage 4 §17).
 * Prohibido: labels[value] || value como fallback silencioso.
 * Estado desconocido: warning en dev + etiqueta visualmente segura.
 */

export type Tone = "neutral" | "info" | "success" | "warning" | "danger"

const STATE_TEXT: Record<string, string> = {
  // Event lifecycle
  DRAFT: "Borrador",
  SCHEDULED: "Programado",
  POSTPONED: "Postergado",
  CANCELLED: "Cancelado",
  IN_PROGRESS: "En curso",
  COMPLETED: "Finalizado",
  ABANDONED: "Suspendido",
  // Publication / sheets / records
  PUBLISHED: "Publicado",
  ARCHIVED: "Archivado",
  ACTIVE: "Activo",
  DISABLED: "Deshabilitada",
  PENDING: "Pendiente",
  OPEN: "Abierta",
  CLOSED: "Cerrada",
  ENDED: "Finalizada",
  FINAL: "Final",
  // Eligibility (derivado)
  ELIGIBLE: "Habilitada",
  BLOCKED: "No habilitada",
  // Availability (vocabulario usuario)
  YES: "Voy",
  MAYBE: "Quizás",
  NO: "No voy",
  NO_RESPONSE: "Sin respuesta",
  NEEDS_RECONFIRMATION: "Necesita confirmación",
  // Attendance
  PRESENT: "Presente",
  ABSENT: "Ausente",
  JUSTIFIED: "Justificada",
  UNRECORDED: "Sin registrar",
  // Match
  PLAYED: "Jugado",
  FORFEIT: "No presentación",
  // Roles (solo para contexto, no como decisión de autoridad)
  PLAYER: "Jugadora",
  CAPTAIN: "Capitana",
  COACH: "Entrenador o entrenadora",
  ADMIN: "Administración",
  SUBCOMMITTEE: "Subcomisión",
  // Event types
  MATCH: "Partido",
  TRAINING: "Entrenamiento",
  CLUB_EVENT: "Evento del club",
}

const STATE_TONE: Record<string, Tone> = {
  DRAFT: "neutral",
  SCHEDULED: "info",
  POSTPONED: "warning",
  CANCELLED: "danger",
  IN_PROGRESS: "info",
  COMPLETED: "success",
  ABANDONED: "warning",
  PUBLISHED: "success",
  ARCHIVED: "neutral",
  ACTIVE: "success",
  DISABLED: "danger",
  PENDING: "warning",
  OPEN: "success",
  CLOSED: "neutral",
  ENDED: "neutral",
  FINAL: "success",
  ELIGIBLE: "success",
  BLOCKED: "danger",
  YES: "success",
  MAYBE: "warning",
  NO: "danger",
  NO_RESPONSE: "neutral",
  NEEDS_RECONFIRMATION: "warning",
  PRESENT: "success",
  ABSENT: "danger",
  JUSTIFIED: "warning",
  UNRECORDED: "neutral",
  PLAYED: "success",
  FORFEIT: "warning",
}

export function stateText(value: string): string {
  const known = STATE_TEXT[value]
  if (known) return known
  if (import.meta.env.DEV) {
    console.warn(`[GEI] estado de dominio desconocido en UI: ${value}`)
  }
  return "Estado a revisar"
}

export function stateTone(value: string): Tone {
  return STATE_TONE[value] ?? "neutral"
}
