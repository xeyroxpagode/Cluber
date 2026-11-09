import type { Transaction } from "kysely"
import type { DatabaseSchema, RoleAssignmentTable } from "../db/types.js"
import { jsonbParam } from "../shared/jsonb.js"
import { AppError } from "../shared/errors.js"
import { AuditWriter, redactAuditValue } from "../audit/audit.js"
import { assignmentActive } from "../authority/authority.js"
import { randomUUID } from "node:crypto"

export interface AssignRoleInput { role: string; scopeType: string; scopeRefId?: string | null; validFrom: string; validUntil?: string | null; reason?: string }

const ASSIGNABLE_ROLES = new Set(["CAPTAIN", "COACH", "SUBCOMMITTEE", "ADMIN"])

function parsePeriod(validFrom: string, validUntil?: string | null) {
  const from = new Date(validFrom)
  if (Number.isNaN(from.getTime())) throw new AppError("VALIDATION_FAILED", "Role start is invalid", "domain_validation", false, { validFrom: ["invalid"] })
  const until = validUntil ? new Date(validUntil) : null
  if (until && (Number.isNaN(until.getTime()) || until <= from)) {
    throw new AppError("VALIDATION_FAILED", "Role end must be after its start", "domain_validation", false, { validUntil: ["invalid"] })
  }
  return { from, until }
}

function expectedScope(role: string): "TEAM" | "CLUB" | null {
  if (role === "PLAYER") return null
  if (role === "CAPTAIN" || role === "COACH") return null
  if (role === "SUBCOMMITTEE" || role === "ADMIN") return "CLUB"
  return null
}

export class RoleAssignmentService {
  constructor(private readonly audit = new AuditWriter()) {}

  async assign(tx: Transaction<DatabaseSchema>, actorPersonId: string, personId: string, input: AssignRoleInput, evaluationInstant: Date, source = "CMD-PPL-05") {
    const role = input.role?.trim().toUpperCase()
    const scopeType = input.scopeType?.trim().toUpperCase()
    if (role === "PLAYER") throw new AppError("INVALID_ROLE_SCOPE", "PLAYER assignments are managed by team affiliation", "domain_validation", false, { role: ["player_managed_by_affiliation"] })
    if (!ASSIGNABLE_ROLES.has(role)) throw new AppError("INVALID_ROLE_SCOPE", "Role is not assignable", "domain_validation", false, { role: ["invalid"] })
    if (scopeType === "EVENT") throw new AppError("EVENT_SCOPE_NOT_ASSIGNABLE_IN_T02", "EVENT scope is not assignable in T02", "domain_validation", false, { scopeType: ["event_deferred"] })

    const person = await tx.selectFrom("app.people").select("id").where("id", "=", personId).executeTakeFirst()
    if (!person) throw new AppError("PERSON_NOT_FOUND", "Person was not found", "not_found")
    const { from, until } = parsePeriod(input.validFrom, input.validUntil)
    const scopeRefId = input.scopeRefId?.trim() || null

    if (scopeType === "TEAM") {
      if (!["CAPTAIN", "COACH"].includes(role)) throw new AppError("INVALID_ROLE_SCOPE", "This role cannot be team scoped", "domain_validation", false, { scopeType: ["invalid"] })
      if (!scopeRefId) throw new AppError("INVALID_ROLE_SCOPE", "Team scope requires a team", "domain_validation", false, { scopeRefId: ["required"] })
      const team = await tx.selectFrom("app.teams").select(["id", "state"]).where("id", "=", scopeRefId).executeTakeFirst()
      if (!team) throw new AppError("TEAM_NOT_FOUND", "Team was not found", "not_found")
      if (team.state === "ARCHIVED") throw new AppError("TEAM_ARCHIVED", "Archived teams cannot receive new role assignments", "conflict")
    } else if (scopeType === "CLUB") {
      if (!["SUBCOMMITTEE", "ADMIN"].includes(role) || scopeRefId !== null) throw new AppError("INVALID_ROLE_SCOPE", "CLUB scope is only valid for SUBCOMMITTEE and ADMIN", "domain_validation", false, { scopeType: ["invalid"] })
    } else {
      throw new AppError("INVALID_ROLE_SCOPE", "Scope is not valid for this role", "domain_validation", false, { scopeType: ["invalid"] })
    }

    const all = await tx.selectFrom("app.role_assignments").selectAll().where("person_id", "=", personId).forUpdate().execute()
    const current = all.filter((row) => row.role === role && row.scope_type === scopeType && (row.scope_ref_id ?? null) === scopeRefId && assignmentActive(row, evaluationInstant))
    if (current.length > 0) throw new AppError("ROLE_ASSIGNMENT_ALREADY_ACTIVE", "An active assignment of this role already exists", "conflict")

    const inserted = await tx.insertInto("app.role_assignments").values({ id: randomUUID(), person_id: personId, role: role as RoleAssignmentTable["role"], scope_type: scopeType as RoleAssignmentTable["scope_type"], scope_ref_id: scopeRefId, valid_from: from, valid_until: until, temporal_exclusions: jsonbParam([]), created_at: new Date() }).returningAll().executeTakeFirstOrThrow()
    await this.audit.record(tx, { actorPersonId, action: "ROLE_ASSIGNED", targetType: "RoleAssignment", targetId: inserted.id, reason: input.reason?.trim() || null, source, diff: { role, scopeType, scopeRefId, validFrom: from.toISOString(), validUntil: until?.toISOString() ?? null } })
    return inserted
  }

  async end(tx: Transaction<DatabaseSchema>, actorPersonId: string, assignmentId: string, at: Date, reason?: string) {
    const current = await tx.selectFrom("app.role_assignments").selectAll().where("id", "=", assignmentId).forUpdate().executeTakeFirst()
    if (!current) throw new AppError("ASSIGNMENT_NOT_FOUND", "Role assignment was not found", "not_found")
    if (current.role === "PLAYER") throw new AppError("PLAYER_ASSIGNMENT_NOT_ENDABLE", "PLAYER roles are closed by the team affiliation flow", "conflict")
    if (!assignmentActive(current, at)) throw new AppError("ASSIGNMENT_NOT_ACTIVE", "Role assignment is not active", "conflict")
    const updated = await tx.updateTable("app.role_assignments").set({ valid_until: at }).where("id", "=", assignmentId).returningAll().executeTakeFirstOrThrow()
    await this.audit.record(tx, { actorPersonId, action: "ROLE_ENDED", targetType: "RoleAssignment", targetId: assignmentId, reason: reason?.trim() || null, source: "CMD-PPL-06", diff: { validUntil: at.toISOString(), role: current.role, scopeType: current.scope_type, scopeRefId: current.scope_ref_id } })
    return updated
  }

  async list(tx: Transaction<DatabaseSchema>, personId: string) {
    return tx.selectFrom("app.role_assignments").selectAll().where("person_id", "=", personId).orderBy("valid_from", "desc").execute()
  }
}
