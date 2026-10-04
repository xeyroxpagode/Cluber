import type { EligibilityConstraint } from "./model"
import { todayIso } from "./clock"

export type { EligibilityConstraint }

export type DerivedEligibility = "ELIGIBLE" | "PENDING" | "BLOCKED"

export function isConstraintActive(
  constraint: EligibilityConstraint,
  today = todayIso(),
): boolean {
  if (constraint.validFrom > today) return false
  if (constraint.validUntil && constraint.validUntil <= today) return false
  return true
}

/** Deriva ELIGIBLE / PENDING / BLOCKED desde las restricciones vigentes. */
export function deriveEligibility(
  constraints: EligibilityConstraint[],
  personId: string,
): DerivedEligibility {
  const applicable = activeConstraintsFor(constraints, personId)
  if (applicable.some((item) => item.state === "BLOCKED")) return "BLOCKED"
  if (applicable.some((item) => item.state === "PENDING")) return "PENDING"
  return "ELIGIBLE"
}

export function activeConstraintsFor(
  constraints: EligibilityConstraint[],
  personId: string,
): EligibilityConstraint[] {
  return constraints.filter(
    (item) => item.personId === personId && isConstraintActive(item),
  )
}

export const CONSTRAINT_SCOPE_LABEL: Record<string, string> = {
  CLUB: "Todo el club",
  COMPETITION: "Una competencia",
  ENTRY: "Una inscripción",
  EVENT: "Un evento",
}

export const CONSTRAINT_SOURCE_LABEL: Record<string, string> = {
  INTERNAL: "Definición del club",
  AHBA: "Referencia de la asociación",
  OTHER: "Origen externo",
}

export const CONSTRAINT_REASON_LABEL: Record<string, string> = {
  ADMIN: "Definición de administración",
  DISCIPLINE: "Cuestión disciplinaria",
  FEDERATION: "Trámite federativo",
  MEDICAL_CLEARANCE: "Apto médico",
  OTHER: "Otro motivo",
}

/** Copy de operación para quien no tiene acceso al motivo ni al origen. */
export function constraintUserText(constraint: EligibilityConstraint): string {
  return constraint.state === "BLOCKED"
    ? "No puede jugar este partido por un tema del club. Hablá con la Subcomisión."
    : "Tiene un trámite pendiente antes de jugar."
}