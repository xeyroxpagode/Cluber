import type { Transaction } from "kysely"
import type { DatabaseSchema, EventTable } from "../db/types.js"
import { AppError } from "../shared/errors.js"

/**
 * T04 — resolution de audiencia y roster.
 *
 * Reglas congeladas:
 *  - La audiencia de un evento es el conjunto de personas destino (person targets)
 *    más las personas con TeamAssignment vigente sobre los equipos destino.
 *  - El staff (SUBCOMMITTEE/ADMIN de club) NO es audiencia deportiva: puede ver el
 *    evento, pero no responder disponibilidad ni figurar en el roster.
 *  - El roster de asistencia (H-07) se deriva de Event + TeamAssignment legítimos,
 *    nunca de la Selection.
 */

export interface RosterMember {
  personId: string
  firstName: string
  lastName: string
}

export interface EventTargets {
  teamIds: string[]
  personIds: string[]
}

export async function resolveEventTargets(tx: Transaction<DatabaseSchema>, eventId: string): Promise<EventTargets> {
  const [teams, persons] = await Promise.all([
    tx.selectFrom("app.event_target_team").select("team_id").where("event_id", "=", eventId).execute(),
    tx.selectFrom("app.event_target_person").select("person_id").where("event_id", "=", eventId).execute(),
  ])
  return { teamIds: teams.map((row) => row.team_id), personIds: persons.map((row) => row.person_id) }
}

/**
 * Fecha local del evento (H-07): el roster y la afiliación se evalúan a la fecha del
 * evento, no a la fecha en que se consulta. Si el evento no tiene inicio, se usa la
 * fecha de referencia.
 */
export function eventLocalDate(
  event: Pick<EventTable, "start_at" | "time_zone">,
  reference: Date,
): string {
  if (!event.start_at) return reference.toISOString().slice(0, 10)
  const instant = new Date(event.start_at)
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: event.time_zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(instant)
    const value = (type: string) => parts.find((part) => part.type === type)?.value ?? ""
    return `${value("year")}-${value("month")}-${value("day")}`
  } catch {
    return instant.toISOString().slice(0, 10)
  }
}

function asDay(value: string | Date): string {
  return typeof value === "string" ? value.slice(0, 10) : new Date(value).toISOString().slice(0, 10)
}

function periodActive(row: { valid_from: string | Date; valid_until: string | Date | null }, today: string): boolean {
  const from = asDay(row.valid_from)
  const until = row.valid_until === null || row.valid_until === undefined ? null : asDay(row.valid_until)
  return from <= today && (until === null || until > today)
}

/** Personas con TeamAssignment vigente sobre los equipos destino. */
export async function resolveTeamAffiliatedPersons(
  tx: Transaction<DatabaseSchema>,
  teamIds: readonly string[],
  today: string,
): Promise<string[]> {
  if (teamIds.length === 0) return []
  const rows = await tx
    .selectFrom("app.team_assignments")
    .select(["person_id", "valid_from", "valid_until"])
    .where("team_id", "in", [...teamIds])
    .execute()
  return Array.from(new Set(rows.filter((row) => periodActive(row, today)).map((row) => row.person_id)))
}

/** Audiencia deportiva efectiva del evento (sin staff club). Se evalúa a la fecha del evento. */
export async function resolveParticipationAudience(
  tx: Transaction<DatabaseSchema>,
  event: Pick<EventTable, "id" | "club_wide_target" | "start_at" | "time_zone">,
  reference: Date,
): Promise<string[]> {
  const date = eventLocalDate(event, reference)
  if (event.club_wide_target) {
    const members = await tx
      .selectFrom("app.memberships")
      .select(["person_id", "valid_from", "valid_until"])
      .execute()
    return Array.from(new Set(members.filter((row) => periodActive(row, date)).map((row) => row.person_id)))
  }
  const targets = await resolveEventTargets(tx, event.id)
  const affiliated = await resolveTeamAffiliatedPersons(tx, targets.teamIds, date)
  return Array.from(new Set([...targets.personIds, ...affiliated]))
}

/** Roster legítimo de un evento: personas del equipo destino con afiliación vigente a la fecha del evento. */
export async function resolveEventRoster(
  tx: Transaction<DatabaseSchema>,
  eventId: string,
  reference: Date,
  date?: string,
): Promise<RosterMember[]> {
  const targets = await resolveEventTargets(tx, eventId)
  const event = await tx.selectFrom("app.events").select(["start_at", "time_zone"]).where("id", "=", eventId).executeTakeFirst()
  const effectiveDate = date ?? eventLocalDate(event ?? { start_at: null, time_zone: "UTC" }, reference)
  const personIds = await resolveTeamAffiliatedPersons(tx, targets.teamIds, effectiveDate)
  if (personIds.length === 0) return []
  const people = await tx
    .selectFrom("app.people")
    .select(["id", "first_name", "last_name"])
    .where("id", "in", personIds)
    .execute()
  return people
    .map((person) => ({ personId: person.id, firstName: person.first_name, lastName: person.last_name }))
    .sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`))
}

/** Staff del club con autoridad deportiva sobre el equipo destino (COACH o CAPTAIN). */
export async function resolveEventStaff(
  tx: Transaction<DatabaseSchema>,
  teamIds: readonly string[],
  now: Date,
): Promise<string[]> {
  if (teamIds.length === 0) return []
  const rows = await tx
    .selectFrom("app.role_assignments")
    .select(["person_id", "role", "valid_from", "valid_until"])
    .where("role", "in", ["COACH", "CAPTAIN"])
    .where("scope_type", "=", "TEAM")
    .where("scope_ref_id", "in", [...teamIds])
    .execute()
  const at = now.getTime()
  const active = rows.filter((row) => {
    const from = new Date(row.valid_from).getTime()
    const until = row.valid_until ? new Date(row.valid_until).getTime() : Number.POSITIVE_INFINITY
    return at >= from && at < until
  })
  return Array.from(new Set(active.map((row) => row.person_id)))
}

/** Personas con nombre para el roster y las listas de la UI. */
export async function resolvePersonNames(
  tx: Transaction<DatabaseSchema>,
  personIds: readonly string[],
): Promise<Map<string, { firstName: string; lastName: string }>> {
  const ids = Array.from(new Set(personIds.filter(Boolean)))
  if (ids.length === 0) return new Map()
  const rows = await tx.selectFrom("app.people").select(["id", "first_name", "last_name"]).where("id", "in", ids).execute()
  return new Map(rows.map((row) => [row.id, { firstName: row.first_name, lastName: row.last_name }]))
}

export async function requireEvent(
  tx: Transaction<DatabaseSchema>,
  eventId: string,
  forUpdate = false,
): Promise<EventTable> {
  let query = tx.selectFrom("app.events").selectAll().where("id", "=", eventId)
  if (forUpdate) query = query.forUpdate()
  const event = await query.executeTakeFirst()
  if (!event) throw new AppError("EVENT_NOT_FOUND", "Event was not found", "not_found")
  return event
}
