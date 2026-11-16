import type { Kysely } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import { randomUUID } from "node:crypto"
import { jsonbParam } from "../shared/jsonb.js"
import { makeClubFixture, type ClubFixture } from "./t03-base.js"

/**
 * T04 — fixture determinista para participación.
 *
 * Personas y roles:
 *  - coachId        COACH(TEAM A)
 *  - coachBId       COACH(TEAM B)        →Negative de otro equipo
 *  - captainId      CAPTAIN(TEAM A)      → no hereda COACH
 *  - playerId       PLAYER(TEAM A)
 *  - player2Id      PLAYER(TEAM A)
 *  - multiRoleId    PLAYER(TEAM A) + COACH(TEAM A)  → unión multirrol
 *  - crossRoleId    COACH(TEAM A) + CAPTAIN(TEAM B) → no habilita COACH en B
 *  - subcommitteeId SUBCOMMITTEE(CLUB)
 *  - adminId        ADMIN(CLUB)
 */

export interface T04Fixture extends ClubFixture {
  coachBId: string
  multiRoleId: string
  crossRoleId: string
}

export async function makeT04Fixture(tx: Kysely<DatabaseSchema>, tag: string): Promise<T04Fixture> {
  const base = await makeClubFixture(tx, tag)
  const now = new Date()

  async function addPerson(first: string) {
    const id = randomUUID()
    await tx.insertInto("app.people").values({ id, first_name: first, last_name: `t04-${tag}`, dni: `${tag}-${first}-${id.slice(0, 18)}`, birth_date: "1990-01-01", phone: "1234567", email: `${first.toLowerCase()}-${id.slice(0, 8)}@example.com`, created_at: now, updated_at: now }).execute()
    await tx.insertInto("app.memberships").values({ id: randomUUID(), person_id: id, valid_from: new Date("2026-01-01"), valid_until: null, created_at: now }).execute()
    return id
  }

  const coachBId = await addPerson("CoachB")
  const multiRoleId = await addPerson("MultiRole")
  const crossRoleId = await addPerson("CrossRole")

  await tx.insertInto("app.role_assignments").values([
    // PLAYER para los dos jugadores del equipo A.
    { id: randomUUID(), person_id: base.playerId, role: "PLAYER", scope_type: "TEAM", scope_ref_id: base.teamAId, valid_from: new Date("2026-01-01"), valid_until: null, temporal_exclusions: jsonbParam([]), created_at: now },
    { id: randomUUID(), person_id: base.player2Id, role: "PLAYER", scope_type: "TEAM", scope_ref_id: base.teamAId, valid_from: new Date("2026-01-01"), valid_until: null, temporal_exclusions: jsonbParam([]), created_at: now },
    // COACH del equipo B.
    { id: randomUUID(), person_id: coachBId, role: "COACH", scope_type: "TEAM", scope_ref_id: base.teamBId, valid_from: new Date("2026-01-01"), valid_until: null, temporal_exclusions: jsonbParam([]), created_at: now },
    // Multirrol: PLAYER + COACH del mismo equipo.
    { id: randomUUID(), person_id: multiRoleId, role: "PLAYER", scope_type: "TEAM", scope_ref_id: base.teamAId, valid_from: new Date("2026-01-01"), valid_until: null, temporal_exclusions: jsonbParam([]), created_at: now },
    { id: randomUUID(), person_id: multiRoleId, role: "COACH", scope_type: "TEAM", scope_ref_id: base.teamAId, valid_from: new Date("2026-01-01"), valid_until: null, temporal_exclusions: jsonbParam([]), created_at: now },
    // Multirrol cruzado: COACH de A y CAPTAIN de B.
    { id: randomUUID(), person_id: crossRoleId, role: "COACH", scope_type: "TEAM", scope_ref_id: base.teamAId, valid_from: new Date("2026-01-01"), valid_until: null, temporal_exclusions: jsonbParam([]), created_at: now },
    { id: randomUUID(), person_id: crossRoleId, role: "CAPTAIN", scope_type: "TEAM", scope_ref_id: base.teamBId, valid_from: new Date("2026-01-01"), valid_until: null, temporal_exclusions: jsonbParam([]), created_at: now },
  ]).execute()

  await tx.insertInto("app.team_assignments").values([
    { id: randomUUID(), person_id: coachBId, team_id: base.teamBId, valid_from: "2026-01-01", valid_until: null, created_at: now },
    { id: randomUUID(), person_id: multiRoleId, team_id: base.teamAId, valid_from: "2026-01-01", valid_until: null, created_at: now },
    { id: randomUUID(), person_id: crossRoleId, team_id: base.teamAId, valid_from: "2026-01-01", valid_until: null, created_at: now },
  ]).execute()

  return { ...base, coachBId, multiRoleId, crossRoleId }
}
