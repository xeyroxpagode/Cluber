/**
 * DG-08 MaterialityCheck (INV-16 / DV-13 / RC-30).
 * Closed list of material fields. Anything else is metadata (no coordinationRevision++,
 * no notification). Pure logic, no IO.
 *
 * Accepted patch keys (API shape):
 *   schedule     startAt, endAt, timeZone, venueId
 *   coordination targetTeamIds, targetPersonIds (=> "targets"), clubWideTarget,
 *                opponent, competitionId, logistics
 *   metadata     title
 */
export const MATERIAL_EVENT_FIELDS = [
  "startAt",
  "endAt",
  "timeZone",
  "venueId",
  "targets",
  "clubWideTarget",
  "opponent",
  "competitionId",
  "logistics",
] as const

export type MaterialEventField = (typeof MATERIAL_EVENT_FIELDS)[number]
export type MaterialityClass = "schedule" | "coordination" | "metadata" | "none"

const SCHEDULE_FIELDS: ReadonlySet<string> = new Set(["startAt", "endAt", "timeZone", "venueId"])
const COORDINATION_FIELDS: ReadonlySet<string> = new Set(["targets", "clubWideTarget", "opponent", "competitionId", "logistics"])
const METADATA_FIELDS: ReadonlySet<string> = new Set(["title"])

const TARGET_KEYS = new Set(["targetTeamIds", "targetPersonIds"])

export interface MaterialityResult {
  material: MaterialEventField[]
  metadata: string[]
  classification: MaterialityClass
  touched: string[]
}

function has(value: unknown): boolean {
  if (value === undefined) return false
  if (Array.isArray(value)) return true // explicit replacement intent
  if (value && typeof value === "object") return Object.values(value).some((item) => item !== undefined)
  return true
}

export function classifyEventPatch(patch: Record<string, unknown> | null | undefined): MaterialityResult {
  const input = patch ?? {}
  const material: MaterialEventField[] = []
  const metadata: string[] = []
  const touched: string[] = []

  for (const [key, value] of Object.entries(input)) {
    if (!has(value)) continue
    if (TARGET_KEYS.has(key)) {
      touched.push("targets")
      if (!material.includes("targets")) material.push("targets")
      continue
    }
    if (METADATA_FIELDS.has(key)) {
      touched.push(key)
      metadata.push(key)
      continue
    }
    if (SCHEDULE_FIELDS.has(key) || COORDINATION_FIELDS.has(key)) {
      touched.push(key)
      if (!material.includes(key as MaterialEventField)) material.push(key as MaterialEventField)
      continue
    }
    // Unknown keys are ignored by classification; schema validation rejects them.
  }

  const schedule = material.filter((field) => SCHEDULE_FIELDS.has(field))
  const coordination = material.filter((field) => COORDINATION_FIELDS.has(field))
  const classification: MaterialityClass = schedule.length > 0 ? "schedule" : coordination.length > 0 ? "coordination" : metadata.length > 0 ? "metadata" : "none"

  return { material, metadata, classification, touched }
}

export function isMaterial(result: MaterialityResult): boolean {
  return result.material.length > 0
}
