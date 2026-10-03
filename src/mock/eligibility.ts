import type { Person } from "../mock/model"

/**
 * Modelo canónico mock: EligibilityConstraint[] (Stage 4 §33, Freeze §13 v1.0.1).
 * ELIGIBLE es derivado: sin constraint activa aplicable.
 */
export interface EligibilityConstraint {
  id: string
  personId: string
  state: "PENDING" | "BLOCKED"
  scope: "CLUB" | "COMPETITION" | "ENTRY" | "EVENT"
  scopeRefId: string | null
  source: "INTERNAL" | "AHBA" | "OTHER"
  reason: "ADMIN" | "DISCIPLINE" | "FEDERATION" | "MEDICAL_CLEARANCE" | "OTHER"
  note?: string
  validFrom: string
  validUntil: string | null
}

export type DerivedEligibility = "ELIGIBLE" | "PENDING" | "BLOCKED"

const nowIso = () => new Date().toISOString().slice(0, 10)

function isActive(c: EligibilityConstraint, at = nowIso()): boolean {
  if (c.validFrom > at) return false
  if (c.validUntil && c.validUntil < at) return false
  return true
}

/** Deriva ELIGIBLE / PENDING / BLOCKED desde constraints activas. BLOCKED domina. */
export function deriveEligibility(
  constraints: EligibilityConstraint[],
  personId: string,
  opts?: { eventId?: string; entryId?: string; competitionId?: string },
): DerivedEligibility {
  const at = nowIso()
  const applicable = constraints.filter(
    (c) => c.personId === personId && isActive(c, at),
  )
  // En V1 mock, toda constraint activa aplica; el scope se usa para explicar, no para filtrar fuera.
  void opts
  if (applicable.some((c) => c.state === "BLOCKED")) return "BLOCKED"
  if (applicable.some((c) => c.state === "PENDING")) return "PENDING"
  return "ELIGIBLE"
}

export function activeConstraintsFor(
  constraints: EligibilityConstraint[],
  personId: string,
): EligibilityConstraint[] {
  const at = nowIso()
  return constraints.filter((c) => c.personId === personId && isActive(c, at))
}

/** Lenguaje usuario para un constraint (nunca exponer enum crudo a PLAYER). */
export function constraintUserText(c: EligibilityConstraint): string {
  if (c.state === "BLOCKED")
    return "No puede jugar este partido por una restricción actual."
  return "Tiene un trámite pendiente antes de jugar."
}

/** Compat: deriva desde el modelo legacy person.eligibility cuando no hay constraints. */
export function deriveFromLegacy(person: Person): DerivedEligibility {
  return person.eligibility
}
