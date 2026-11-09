import type { Transaction } from "kysely"
import type { DatabaseSchema, RoleAssignmentTable } from "../db/types.js"
import { AppError } from "../shared/errors.js"

export type RoleName = "PLAYER" | "CAPTAIN" | "COACH" | "SUBCOMMITTEE" | "ADMIN"
export type ScopeType = "TEAM" | "EVENT" | "CLUB"
export interface RoleAssignmentSnapshot {
  id: string
  role: RoleName
  scopeType: ScopeType
  scopeRefId: string | null
  validFrom: Date
  validUntil: Date | null
  temporalExclusions: Array<Record<string, string>>
}

export interface AuthoritySnapshot {
  roles: RoleName[]
  teamIds: string[]
  coachTeamIds: string[]
  captainTeamIds: string[]
  playerTeamIds: string[]
  isAdmin: boolean
  isSubcommittee: boolean
  canAccessApplication: boolean
  canManagePeople: boolean
  canManageStructure: boolean
  canManageCompetitions: boolean
  canViewCompetitions: boolean
  canViewAudit: boolean
  canAssignRole: boolean
  canEndRole: boolean
  canRegisterPlayer: boolean
  canManageTeams: boolean
}

function parseExclusions(value: unknown): Array<Record<string, string>> {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is Record<string, string> => typeof item === "object" && item !== null) as Array<Record<string, string>>
}

function excluded(exclusion: Record<string, string>, instant: Date): boolean {
  const from = exclusion.from ?? exclusion.validFrom ?? exclusion.start
  const until = exclusion.until ?? exclusion.validUntil ?? exclusion.end
  if (!from && !until) return false
  const start = from ? new Date(from).getTime() : Number.NEGATIVE_INFINITY
  const end = until ? new Date(until).getTime() : Number.POSITIVE_INFINITY
  const at = instant.getTime()
  return at >= start && at < end
}

export function assignmentActive(row: RoleAssignmentTable, instant: Date): boolean {
  const from = new Date(row.valid_from).getTime()
  const until = row.valid_until ? new Date(row.valid_until).getTime() : Number.POSITIVE_INFINITY
  const at = instant.getTime()
  if (at < from || at >= until) return false
  return !parseExclusions(row.temporal_exclusions).some((item) => excluded(item, instant))
}

export function assignmentSnapshot(row: RoleAssignmentTable): RoleAssignmentSnapshot {
  return {
    id: row.id as string,
    role: row.role,
    scopeType: row.scope_type,
    scopeRefId: row.scope_ref_id,
    validFrom: new Date(row.valid_from),
    validUntil: row.valid_until ? new Date(row.valid_until) : null,
    temporalExclusions: parseExclusions(row.temporal_exclusions),
  }
}

function currentTeamScopes(assignments: readonly RoleAssignmentSnapshot[], role: RoleName): string[] {
  return Array.from(new Set(assignments
    .filter((item) => item.role === role && item.scopeType === "TEAM" && item.scopeRefId)
    .map((item) => item.scopeRefId as string)))
}

export class AuthorityService {
  async assignments(tx: Transaction<DatabaseSchema>, personId: string, instant: Date): Promise<RoleAssignmentSnapshot[]> {
    const rows = await tx.selectFrom("app.role_assignments")
      .selectAll()
      .where("person_id", "=", personId)
      .execute()
    return rows.filter((row) => assignmentActive(row, instant)).map(assignmentSnapshot)
  }

  async snapshot(tx: Transaction<DatabaseSchema>, personId: string, instant: Date): Promise<AuthoritySnapshot> {
    const assignments = await this.assignments(tx, personId, instant)
    const roles = Array.from(new Set(assignments.map((item) => item.role)))
    const coachTeamIds = currentTeamScopes(assignments, "COACH")
    const captainTeamIds = currentTeamScopes(assignments, "CAPTAIN")
    const playerTeamIds = currentTeamScopes(assignments, "PLAYER")
    const isAdmin = roles.includes("ADMIN")
    const isSubcommittee = roles.includes("SUBCOMMITTEE")
    const teamIds = Array.from(new Set([...coachTeamIds, ...captainTeamIds, ...playerTeamIds]))
    return {
      roles,
      teamIds,
      coachTeamIds,
      captainTeamIds,
      playerTeamIds,
      isAdmin,
      isSubcommittee,
      canAccessApplication: roles.length > 0,
      canManagePeople: isAdmin,
      canManageStructure: isAdmin,
      canManageCompetitions: isAdmin || isSubcommittee,
      canViewCompetitions: roles.length > 0,
      canViewAudit: isAdmin,
      canAssignRole: isAdmin || isSubcommittee,
      canEndRole: isAdmin,
      canRegisterPlayer: isAdmin || coachTeamIds.length > 0,
      canManageTeams: isAdmin || coachTeamIds.length > 0,
    }
  }

  require(condition: boolean, code = "AUTHORITY_DENIED"): void {
    if (!condition) throw new AppError(code, "You do not have authority for this operation", "authorization")
  }
}
