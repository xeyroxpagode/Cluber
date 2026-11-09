import type { Transaction } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import { jsonbParam } from "../shared/jsonb.js"
import { AppError } from "../shared/errors.js"
import { AuditWriter, redactAuditValue } from "../audit/audit.js"
import { assignmentActive } from "../authority/authority.js"
import { calendarDateInZone, clubDateStart } from "../shared/club-time.js"
import { randomUUID } from "node:crypto"

export interface AffiliationInput {
  personId: string
  teamId: string
  validFrom?: string
  validUntil?: string | null
  reason?: string | null
}

function dateOrDefault(value: string | undefined, fallback: string): string {
  const date = value?.trim() || fallback
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new AppError("VALIDATION_FAILED", "Date must use YYYY-MM-DD", "domain_validation", false, { validFrom: ["invalid"] })
  const parsed = new Date(`${date}T00:00:00.000Z`)
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) throw new AppError("VALIDATION_FAILED", "Date is invalid", "domain_validation", false, { validFrom: ["invalid"] })
  return date
}

function endDateAfter(date: string): string {
  const parsed = new Date(`${date}T00:00:00.000Z`)
  parsed.setUTCDate(parsed.getUTCDate() + 1)
  return parsed.toISOString().slice(0, 10)
}

export class AffiliationService {
  constructor(private readonly audit = new AuditWriter()) {}

  async add(tx: Transaction<DatabaseSchema>, actorPersonId: string, input: AffiliationInput, evaluationInstant: Date, timeZone: string) {
    const person = await tx.selectFrom("app.people").select("id").where("id", "=", input.personId).executeTakeFirst()
    if (!person) throw new AppError("PERSON_NOT_FOUND", "Person was not found", "not_found")
    const team = await this.requireTeam(tx, input.teamId, true)
    const today = calendarDateInZone(evaluationInstant, timeZone)
    const validFrom = dateOrDefault(input.validFrom, today)
    const validUntil = input.validUntil ? dateOrDefault(input.validUntil, "") : null
    if (validUntil && validUntil <= validFrom) throw new AppError("VALIDATION_FAILED", "Valid-until must follow valid-from", "domain_validation", false, { validUntil: ["invalid"] })

    const existing = await tx.selectFrom("app.team_assignments").selectAll().where("person_id", "=", input.personId).forUpdate().execute()
    if (existing.some((row) => !row.valid_until || row.valid_until > validFrom)) throw new AppError("ASSIGNMENT_OVERLAP", "Person already has an active or overlapping team affiliation", "conflict")

    const roleFrom = clubDateStart(validFrom, timeZone)
    const roleUntil = validUntil ? clubDateStart(validUntil, timeZone) : null
    const assignment = await tx.insertInto("app.team_assignments").values({ id: randomUUID(), person_id: input.personId, team_id: team.id, valid_from: validFrom, valid_until: validUntil, created_at: new Date() }).returningAll().executeTakeFirstOrThrow()
    const role = await tx.insertInto("app.role_assignments").values({ id: randomUUID(), person_id: input.personId, role: "PLAYER", scope_type: "TEAM", scope_ref_id: team.id, valid_from: roleFrom, valid_until: roleUntil, temporal_exclusions: jsonbParam([]), created_at: new Date() }).returningAll().executeTakeFirstOrThrow()
    await this.audit.record(tx, { actorPersonId, action: "PLAYER_ADDED", targetType: "TeamAssignment", targetId: assignment.id, reason: input.reason?.trim() || null, source: "CMD-PPL-07", diff: { teamId: team.id, roleAssignmentId: role.id, validFrom, validUntil } })
    return { assignment, role }
  }

  async move(tx: Transaction<DatabaseSchema>, actorPersonId: string, input: Omit<AffiliationInput, "validFrom" | "validUntil"> & { sourceTeamId: string }, evaluationInstant: Date, timeZone: string) {
    const person = await tx.selectFrom("app.people").select("id").where("id", "=", input.personId).executeTakeFirst()
    if (!person) throw new AppError("PERSON_NOT_FOUND", "Person was not found", "not_found")
    const source = await this.requireTeam(tx, input.sourceTeamId, true)
    const destination = await this.requireTeam(tx, input.teamId, true)
    const today = calendarDateInZone(evaluationInstant, timeZone)
    const endDate = today

    const oldAssignments = await tx.selectFrom("app.team_assignments").selectAll().where("person_id", "=", input.personId).where("team_id", "=", source.id).forUpdate().execute()
    const open = oldAssignments.filter((row) => !row.valid_until || row.valid_until > today)
    if (open.length !== 1) throw new AppError("ASSIGNMENT_NOT_ACTIVE", "No unique active source affiliation exists", "conflict")
    const oldRoles = await tx.selectFrom("app.role_assignments").selectAll().where("person_id", "=", input.personId).where("role", "=", "PLAYER").where("scope_type", "=", "TEAM").where("scope_ref_id", "=", source.id).forUpdate().execute()
    const currentRoles = oldRoles.filter((row) => assignmentActive(row, evaluationInstant))
    if (currentRoles.length !== 1) throw new AppError("ASSIGNMENT_NOT_ACTIVE", "No unique active PLAYER role exists for the source team", "conflict")

    await tx.updateTable("app.team_assignments").set({ valid_until: endDate }).where("id", "=", open[0]!.id).executeTakeFirstOrThrow()
    await tx.updateTable("app.role_assignments").set({ valid_until: evaluationInstant }).where("id", "=", currentRoles[0]!.id).executeTakeFirstOrThrow()

    if (destination.id === source.id) throw new AppError("VALIDATION_FAILED", "Source and destination teams must differ", "domain_validation")

    const assignment = await tx.insertInto("app.team_assignments").values({ id: randomUUID(), person_id: input.personId, team_id: destination.id, valid_from: today, valid_until: null, created_at: new Date() }).returningAll().executeTakeFirstOrThrow()
    const role = await tx.insertInto("app.role_assignments").values({ id: randomUUID(), person_id: input.personId, role: "PLAYER", scope_type: "TEAM", scope_ref_id: destination.id, valid_from: evaluationInstant, valid_until: null, temporal_exclusions: jsonbParam([]), created_at: new Date() }).returningAll().executeTakeFirstOrThrow()
    await this.audit.record(tx, { actorPersonId, action: "PLAYER_MOVED", targetType: "TeamAssignment", targetId: assignment.id, reason: input.reason?.trim() || null, source: "CMD-PPL-08", diff: { fromTeamId: source.id, toTeamId: destination.id, closedTeamAssignmentId: open[0]!.id, closedRoleAssignmentId: currentRoles[0]!.id, teamAssignmentId: assignment.id, roleAssignmentId: role.id } })
    return { assignment, role }
  }

  async remove(tx: Transaction<DatabaseSchema>, actorPersonId: string, input: AffiliationInput & { teamId: string }, evaluationInstant: Date, timeZone: string) {
    const source = await this.requireTeam(tx, input.teamId, true)
    const today = calendarDateInZone(evaluationInstant, timeZone)
    const endDate = endDateAfter(today)
    const affiliations = await tx.selectFrom("app.team_assignments").selectAll().where("person_id", "=", input.personId).where("team_id", "=", source.id).forUpdate().execute()
    const open = affiliations.filter((row) => !row.valid_until || row.valid_until > today)
    if (open.length !== 1) throw new AppError("ASSIGNMENT_NOT_ACTIVE", "No unique active affiliation exists", "conflict")
    const roles = await tx.selectFrom("app.role_assignments").selectAll().where("person_id", "=", input.personId).where("role", "=", "PLAYER").where("scope_type", "=", "TEAM").where("scope_ref_id", "=", source.id).forUpdate().execute()
    const currentRoles = roles.filter((row) => assignmentActive(row, evaluationInstant))
    if (currentRoles.length !== 1) throw new AppError("ASSIGNMENT_NOT_ACTIVE", "No unique active PLAYER role exists", "conflict")
    await tx.updateTable("app.team_assignments").set({ valid_until: endDate }).where("id", "=", open[0]!.id).executeTakeFirstOrThrow()
    await tx.updateTable("app.role_assignments").set({ valid_until: evaluationInstant }).where("id", "=", currentRoles[0]!.id).executeTakeFirstOrThrow()
    await this.audit.record(tx, { actorPersonId, action: "PLAYER_REMOVED", targetType: "TeamAssignment", targetId: open[0]!.id, reason: input.reason?.trim() || null, source: "CMD-PPL-09", diff: { teamId: source.id, closedTeamAssignmentId: open[0]!.id, closedRoleAssignmentId: currentRoles[0]!.id } })
    return { assignmentId: open[0]!.id, roleAssignmentId: currentRoles[0]!.id }
  }

  private async requireTeam(tx: Transaction<DatabaseSchema>, teamId: string, operational: boolean) {
    const team = await tx.selectFrom("app.teams").select(["id", "state", "season_id", "division_id", "line_id", "version"]).where("id", "=", teamId).executeTakeFirst()
    if (!team) throw new AppError("TEAM_NOT_FOUND", "Team was not found", "not_found")
    if (operational && team.state !== "ACTIVE") throw new AppError("TEAM_NOT_OPERATIONAL", "Only active teams can receive player operations", "conflict")
    return team
  }
}
