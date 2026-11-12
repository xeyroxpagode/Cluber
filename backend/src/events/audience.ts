import type { Transaction } from "kysely"
import type { DatabaseSchema, EventTable } from "../db/types.js"

/**
 * Resolves the frozen audience of an event (DV-29):
 *   clubWideTarget=true  -> all persons with an active Membership;
 *   clubWideTarget=false -> EventTargetPersons + persons with an active TeamAssignment
 *                           on the EventTargetTeams;
 *   plus club staff: active CLUB-scope SUBCOMMITTEE/ADMIN assignees ("staff").
 * When `override` is provided, it is used verbatim (already-resolved audience).
 */
export async function resolveEventAudience(
  tx: Transaction<DatabaseSchema>,
  event: Pick<EventTable, "id" | "club_wide_target">,
  now: Date,
): Promise<string[]> {
  const ids = new Set<string>()
  const today = now.toISOString().slice(0, 10)

  if (event.club_wide_target) {
    const members = await tx
      .selectFrom("app.memberships")
      .select("person_id")
      .where("valid_from", "<=", new Date(today))
      .where((eb) => eb.or([eb("valid_until", "is", null), eb("valid_until", ">", new Date(today))]))
      .execute()
    for (const row of members) ids.add(row.person_id)
  } else {
    const [teams, persons] = await Promise.all([
      tx.selectFrom("app.event_target_team").select("team_id").where("event_id", "=", event.id).execute(),
      tx.selectFrom("app.event_target_person").select("person_id").where("event_id", "=", event.id).execute(),
    ])
    const teamIds = teams.map((row) => row.team_id)
    for (const row of persons) ids.add(row.person_id)
    if (teamIds.length > 0) {
      const assignments = await tx
        .selectFrom("app.team_assignments")
        .select("person_id")
        .where("team_id", "in", teamIds)
        .where("valid_from", "<=", today)
        .where((eb) => eb.or([eb("valid_until", "is", null), eb("valid_until", ">", today)]))
        .execute()
      for (const row of assignments) ids.add(row.person_id)
    }
  }

  const staff = await tx
    .selectFrom("app.role_assignments")
    .select("person_id")
    .where("role", "in", ["SUBCOMMITTEE", "ADMIN"])
    .where("scope_type", "=", "CLUB")
    .where("valid_from", "<=", now)
    .where((eb) => eb.or([eb("valid_until", "is", null), eb("valid_until", ">", now)]))
    .execute()
  for (const row of staff) ids.add(row.person_id)

  return Array.from(ids)
}

export async function resolveEventTargetIds(tx: Transaction<DatabaseSchema>, eventId: string) {
  const [teams, persons] = await Promise.all([
    tx.selectFrom("app.event_target_team").select("team_id").where("event_id", "=", eventId).execute(),
    tx.selectFrom("app.event_target_person").select("person_id").where("event_id", "=", eventId).execute(),
  ])
  return { teamIds: teams.map((row) => row.team_id), personIds: persons.map((row) => row.person_id) }
}

export async function unionAudiences(a: readonly string[], b: readonly string[]): Promise<string[]> {
  return Array.from(new Set([...a, ...b]))
}
