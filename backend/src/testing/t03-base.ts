import type { Kysely } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import { randomUUID } from "node:crypto"
import { jsonbParam } from "../shared/jsonb.js"

export interface ClubFixture {
  seasonId: string
  season2Id: string
  divisionId: string
  lineId: string
  teamAId: string
  teamBId: string
  venueId: string
  competitionId: string
  coachId: string
  captainId: string
  playerId: string
  player2Id: string
  subcommitteeId: string
  adminId: string
}

export async function makeClubFixture(tx: Kysely<DatabaseSchema>, tag: string): Promise<ClubFixture> {
  const suffix = `${tag}-${randomUUID().slice(0, 8)}`
  const seasonId = randomUUID()
  const season2Id = randomUUID()
  const divisionId = randomUUID()
  const lineId = randomUUID()
  const line2Id = randomUUID()
  const teamAId = randomUUID()
  const teamBId = randomUUID()
  const venueId = randomUUID()
  const competitionId = randomUUID()

  await tx.insertInto("app.seasons").values({ id: seasonId, name: `Season ${suffix}`, starts_on: "2026-01-01", ends_on: "2026-12-31", version: 1, created_at: new Date(), updated_at: new Date() }).execute()
  await tx.insertInto("app.seasons").values({ id: season2Id, name: `Season2 ${suffix}`, starts_on: "2026-01-01", ends_on: "2026-12-31", version: 1, created_at: new Date(), updated_at: new Date() }).execute()
  await tx.insertInto("app.divisions").values({ id: divisionId, name: `Div ${suffix}`, version: 1, created_at: new Date(), updated_at: new Date() }).execute()
  await tx.insertInto("app.lines").values({ id: lineId, name: `Line ${suffix}`, version: 1, created_at: new Date(), updated_at: new Date() }).execute()
  await tx.insertInto("app.lines").values({ id: line2Id, name: `Line2 ${suffix}`, version: 1, created_at: new Date(), updated_at: new Date() }).execute()
  await tx.insertInto("app.teams").values({ id: teamAId, season_id: seasonId, division_id: divisionId, line_id: lineId, state: "ACTIVE", version: 1, created_at: new Date(), updated_at: new Date() }).execute()
  await tx.insertInto("app.teams").values({ id: teamBId, season_id: seasonId, division_id: divisionId, line_id: line2Id, state: "ACTIVE", version: 1, created_at: new Date(), updated_at: new Date() }).execute()
  await tx.insertInto("app.venues").values({ id: venueId, name: `Venue ${suffix}`, address: "Calle 123", version: 1, created_at: new Date(), updated_at: new Date() }).execute()
  await tx.insertInto("app.competitions").values({ id: competitionId, season_id: seasonId, name: `Comp ${suffix}`, version: 1, created_at: new Date(), updated_at: new Date() }).execute()

  async function addPerson(first: string) {
    const id = randomUUID()
    await tx.insertInto("app.people").values({ id, first_name: first, last_name: suffix, dni: `${suffix}-${first}`, birth_date: "1990-01-01", phone: "1234567", email: `${first.toLowerCase()}-${suffix}@example.com`, created_at: new Date(), updated_at: new Date() }).execute()
    return id
  }
  const coachId = await addPerson("Coach")
  const captainId = await addPerson("Captain")
  const playerId = await addPerson("Player")
  const player2Id = await addPerson("Player2")
  const subcommitteeId = await addPerson("Subcom")
  const adminId = await addPerson("Admin")

  const now = new Date()
  await tx.insertInto("app.memberships").values([
    { id: randomUUID(), person_id: coachId, valid_from: new Date("2026-01-01"), valid_until: null, created_at: now },
    { id: randomUUID(), person_id: captainId, valid_from: new Date("2026-01-01"), valid_until: null, created_at: now },
    { id: randomUUID(), person_id: playerId, valid_from: new Date("2026-01-01"), valid_until: null, created_at: now },
    { id: randomUUID(), person_id: player2Id, valid_from: new Date("2026-01-01"), valid_until: null, created_at: now },
    { id: randomUUID(), person_id: subcommitteeId, valid_from: new Date("2026-01-01"), valid_until: null, created_at: now },
    { id: randomUUID(), person_id: adminId, valid_from: new Date("2026-01-01"), valid_until: null, created_at: now },
  ]).execute()

  await tx.insertInto("app.role_assignments").values([
    { id: randomUUID(), person_id: coachId, role: "COACH", scope_type: "TEAM", scope_ref_id: teamAId, valid_from: new Date("2026-01-01"), valid_until: null, temporal_exclusions: jsonbParam([]), created_at: now },
    { id: randomUUID(), person_id: captainId, role: "CAPTAIN", scope_type: "TEAM", scope_ref_id: teamAId, valid_from: new Date("2026-01-01"), valid_until: null, temporal_exclusions: jsonbParam([]), created_at: now },
    { id: randomUUID(), person_id: subcommitteeId, role: "SUBCOMMITTEE", scope_type: "CLUB", scope_ref_id: null, valid_from: new Date("2026-01-01"), valid_until: null, temporal_exclusions: jsonbParam([]), created_at: now },
    { id: randomUUID(), person_id: adminId, role: "ADMIN", scope_type: "CLUB", scope_ref_id: null, valid_from: new Date("2026-01-01"), valid_until: null, temporal_exclusions: jsonbParam([]), created_at: now },
  ]).execute()

  await tx.insertInto("app.team_assignments").values([
    { id: randomUUID(), person_id: playerId, team_id: teamAId, valid_from: "2026-01-01", valid_until: null, created_at: now },
    { id: randomUUID(), person_id: player2Id, team_id: teamAId, valid_from: "2026-01-01", valid_until: null, created_at: now },
    { id: randomUUID(), person_id: coachId, team_id: teamAId, valid_from: "2026-01-01", valid_until: null, created_at: now },
  ]).execute()

  return { seasonId, season2Id, divisionId, lineId, teamAId, teamBId, venueId, competitionId, coachId, captainId, playerId, player2Id, subcommitteeId, adminId }
}
