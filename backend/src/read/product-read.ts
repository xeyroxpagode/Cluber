import type { Transaction } from "kysely"
import { sql } from "kysely"
import type { DatabaseSchema, RoleAssignmentTable, TeamAssignmentTable } from "../db/types.js"
import { AppError } from "../shared/errors.js"
import { AuthorityService, assignmentActive } from "../authority/authority.js"

function iso(value: Date | string | null | undefined): string | null {
  if (!value) return null
  return new Date(value).toISOString()
}

function dateOnly(value: Date | string | null | undefined): string | null {
  if (!value) return null
  return typeof value === "string" ? value.slice(0, 10) : value.toISOString().slice(0, 10)
}

export interface PersonProjectionOptions { self: boolean; admin: boolean; operationalTeamIds: string[] }

function projectRole(row: RoleAssignmentTable) {
  return {
    id: row.id as string,
    role: row.role,
    scopeType: row.scope_type,
    scopeRefId: row.scope_ref_id,
    validFrom: iso(row.valid_from)!,
    validUntil: iso(row.valid_until),
    temporalExclusions: row.temporal_exclusions,
  }
}

function projectAssignment(row: TeamAssignmentTable) {
  return { id: row.id as string, personId: row.person_id, teamId: row.team_id, validFrom: row.valid_from, validUntil: row.valid_until, createdAt: iso(row.created_at)! }
}

export class ProductReadService {
  constructor(private readonly authority = new AuthorityService()) {}

  async self(tx: Transaction<DatabaseSchema>, personId: string, evaluationInstant: Date) {
    const person = await tx.selectFrom("app.people").selectAll().where("id", "=", personId).executeTakeFirst()
    if (!person) throw new AppError("PERSON_NOT_FOUND", "Person was not found", "not_found")
    const account = await tx.selectFrom("app.accounts").select(["id", "username", "status", "credential_version", "activated_at", "disabled_at"]).where("person_id", "=", personId).executeTakeFirst()
    const memberships = await tx.selectFrom("app.memberships").selectAll().where("person_id", "=", personId).orderBy("valid_from", "desc").execute()
    const roles = await tx.selectFrom("app.role_assignments").selectAll().where("person_id", "=", personId).orderBy("valid_from", "desc").execute()
    const assignments = await tx.selectFrom("app.team_assignments").selectAll().where("person_id", "=", personId).orderBy("valid_from", "desc").execute()
    const activeRoles = roles.filter((role) => assignmentActive(role, evaluationInstant))
    const membershipActive = memberships.some((membership) => new Date(membership.valid_from) <= evaluationInstant && (!membership.valid_until || new Date(membership.valid_until) > evaluationInstant))
    const expiringRoles = activeRoles.map(projectRole)
    const userTeams = Array.from(new Set([...expiringRoles.filter((role) => role.scopeType === "TEAM").map((role) => role.scopeRefId as string), ...assignments.filter((item) => !item.valid_until).map((item) => item.team_id)]))

    const authoritySnapshot = await this.authority.snapshot(tx, personId, evaluationInstant)
    const role = (authoritySnapshot.roles[0] ?? null) as string | null

    const operations: string[] = ["RC-04", "RC-13", "RC-28"]
    if (authoritySnapshot.isAdmin) {
      operations.push("RC-08", "RC-12")
    }

    return {
      id: person.id,
      firstName: person.first_name,
      lastName: person.last_name,
      username: account?.username ?? null,
      email: person.email,
      phone: person.phone,
      dni: person.dni,
      birthDate: dateOnly(person.birth_date),
      membershipActive,
      profileCompleted: Boolean(person.dni && person.birth_date && person.phone && person.email),
      accountStatus: account?.status ?? null,
      accountId: account?.id ?? null,
      credentialVersion: account?.credential_version ?? null,
      activatedAt: iso(account?.activated_at),
      disabledAt: iso(account?.disabled_at),
      roleAssignments: roles.map(projectRole),
      teamAssignments: assignments.map(projectAssignment),
      teams: userTeams,
      operations,
      role,
      canAccessApplication: authoritySnapshot.canAccessApplication,
      isAdmin: authoritySnapshot.isAdmin,
      isSubcommittee: authoritySnapshot.isSubcommittee,
      canManagePeople: authoritySnapshot.canManagePeople,
      canManageStructure: authoritySnapshot.canManageStructure,
      canManageCompetitions: authoritySnapshot.canManageCompetitions,
      canViewCompetitions: authoritySnapshot.canViewCompetitions,
      canViewAudit: authoritySnapshot.canViewAudit,
      canAssignRole: authoritySnapshot.canAssignRole,
      canEndRole: authoritySnapshot.canEndRole,
      canRegisterPlayer: authoritySnapshot.canRegisterPlayer,
      canManageTeams: authoritySnapshot.canManageTeams,
    }
  }

  async managementPeople(tx: Transaction<DatabaseSchema>, scope: "admin" | "subcommittee", evaluationInstant: Date) {
    const people = await tx.selectFrom("app.people").leftJoin("app.accounts", "app.accounts.person_id", "app.people.id")
      .select([
        "app.people.id", "app.people.first_name as firstName", "app.people.last_name as lastName", "app.people.dni", "app.people.birth_date as birthDate", "app.people.phone", "app.people.email",
        "app.accounts.id as accountId", "app.accounts.username", "app.accounts.status as accountStatus", "app.accounts.credential_version as credentialVersion",
      ])
      .orderBy("app.people.last_name").orderBy("app.people.first_name").execute()
    if (people.length === 0) return []
    const personIds = people.map((person) => person.id)
    const [memberships, roles, assignments] = await Promise.all([
      tx.selectFrom("app.memberships").selectAll().where("person_id", "in", personIds).execute(),
      tx.selectFrom("app.role_assignments").selectAll().where("person_id", "in", personIds).execute(),
      tx.selectFrom("app.team_assignments").selectAll().where("person_id", "in", personIds).execute(),
    ])
    const now = evaluationInstant
    return people.map((person) => {
      const ownMemberships = memberships.filter((item) => item.person_id === person.id)
      const activeMembership = ownMemberships.some((membership) => new Date(membership.valid_from) <= now && (!membership.valid_until || new Date(membership.valid_until) > now))
      if (scope === "subcommittee") {
        return {
          id: person.id,
          firstName: person.firstName,
          lastName: person.lastName,
          username: person.username,
          accountStatus: person.accountStatus,
          activeMembership,
          roleAssignments: roles.filter((item) => item.person_id === person.id).map(projectRole),
        }
      }
      return {
        ...person,
        birthDate: dateOnly(person.birthDate),
        membershipActive: activeMembership,
        profileCompleted: Boolean(person.dni && person.birthDate && person.phone && person.email),
        memberships: ownMemberships.map((item) => ({ ...item, validFrom: iso(item.valid_from)!, validUntil: iso(item.valid_until), createdAt: iso(item.created_at)! })),
        roleAssignments: roles.filter((item) => item.person_id === person.id).map(projectRole),
        teamAssignments: assignments.filter((item) => item.person_id === person.id).map(projectAssignment),
      }
    })
  }

  async structure(tx: Transaction<DatabaseSchema>) {
    const [seasons, divisions, lines, teams, venues, competitions] = await Promise.all([
      tx.selectFrom("app.seasons").selectAll().orderBy("starts_on", "desc").execute(),
      tx.selectFrom("app.divisions").selectAll().orderBy("name").execute(),
      tx.selectFrom("app.lines").selectAll().orderBy("name").execute(),
      tx.selectFrom("app.teams").innerJoin("app.seasons", "app.seasons.id", "app.teams.season_id").innerJoin("app.divisions", "app.divisions.id", "app.teams.division_id").innerJoin("app.lines", "app.lines.id", "app.teams.line_id").select([
        "app.teams.id", "app.teams.state", "app.teams.version", "app.teams.season_id", "app.teams.division_id", "app.teams.line_id",
        "app.seasons.name as seasonName", "app.divisions.name as divisionName", "app.lines.name as lineName",
      ]).orderBy("app.divisions.name").execute(),
      tx.selectFrom("app.venues").selectAll().orderBy("name").execute(),
      tx.selectFrom("app.competitions").selectAll().orderBy("created_at", "desc").execute(),
    ])
    return {
      seasons: seasons.map((item) => ({ ...item, startsOn: item.starts_on, endsOn: item.ends_on })),
      divisions: divisions.map((item) => ({ ...item, archivedAt: iso(item.archived_at) })),
      lines: lines.map((item) => ({ ...item, archivedAt: iso(item.archived_at) })),
      teams: teams.map((item) => ({ ...item, name: `${item.divisionName} ${item.lineName}`.trim() })),
      venues: venues.map((item) => ({ ...item, archivedAt: iso(item.archived_at) })),
      competitions: competitions.map((item) => ({ ...item, archivedAt: iso(item.archived_at) })),
    }
  }

  async teams(tx: Transaction<DatabaseSchema>, personId: string, evaluationInstant: Date, all: boolean) {
    const snapshot = await this.authority.snapshot(tx, personId, evaluationInstant)
    const ids = all && (snapshot.isAdmin || snapshot.isSubcommittee) ? undefined : Array.from(new Set([...snapshot.teamIds, ...(all ? snapshot.teamIds : [])]))
    let query = tx.selectFrom("app.teams").innerJoin("app.seasons", "app.seasons.id", "app.teams.season_id").innerJoin("app.divisions", "app.divisions.id", "app.teams.division_id").innerJoin("app.lines", "app.lines.id", "app.teams.line_id").select([
      "app.teams.id", "app.teams.state", "app.teams.version", "app.teams.season_id", "app.teams.division_id", "app.teams.line_id",
      "app.seasons.name as seasonName", "app.divisions.name as divisionName", "app.lines.name as lineName",
    ])
    if (ids) {
      if (ids.length === 0) return []
      query = query.where("app.teams.id", "in", ids) as typeof query
    }
    const teams = await query.orderBy("app.divisions.name").execute()
    return teams.map((item) => ({ ...item, name: `${item.divisionName} ${item.lineName}`.trim() }))
  }

  async roster(tx: Transaction<DatabaseSchema>, teamId: string, viewerPersonId: string, evaluationInstant: Date) {
    const viewer = await this.authority.snapshot(tx, viewerPersonId, evaluationInstant)
    const team = await tx.selectFrom("app.teams").select("id").where("id", "=", teamId).executeTakeFirst()
    if (!team) throw new AppError("TEAM_NOT_FOUND", "Team was not found", "not_found")
    const operational = viewer.isAdmin || viewer.coachTeamIds.includes(teamId) || viewer.captainTeamIds.includes(teamId)
    const affiliated = viewer.playerTeamIds.includes(teamId)
    if (!operational && !viewer.isSubcommittee && !affiliated) throw new AppError("AUTHORITY_DENIED", "You do not have authority for this team", "authorization")
    const rows = await tx.selectFrom("app.team_assignments")
      .innerJoin("app.people", "app.people.id", "app.team_assignments.person_id")
      .leftJoin("app.accounts", "app.accounts.person_id", "app.people.id")
      .select([
        "app.team_assignments.id as assignmentId", "app.team_assignments.person_id as personId", "app.team_assignments.valid_from as validFrom", "app.team_assignments.valid_until as validUntil",
        "app.people.first_name as firstName", "app.people.last_name as lastName", "app.people.phone", "app.people.dni", "app.people.birth_date as birthDate", "app.people.email",
        "app.accounts.username", "app.accounts.status as accountStatus",
      ])
      .where("app.team_assignments.team_id", "=", teamId)
      .orderBy("app.people.last_name").execute()
    return rows.map((row) => ({
      assignmentId: row.assignmentId,
      personId: row.personId,
      firstName: row.firstName,
      lastName: row.lastName,
      username: row.username,
      accountStatus: row.accountStatus,
      phone: operational || row.personId === viewerPersonId ? row.phone : null,
      email: row.personId === viewerPersonId || viewer.isAdmin ? row.email : null,
      dni: viewer.isAdmin ? row.dni : null,
      birthDate: viewer.isAdmin ? dateOnly(row.birthDate) : null,
      validFrom: row.validFrom,
      validUntil: row.validUntil,
    }))
  }

  async competitions(tx: Transaction<DatabaseSchema>) {
    return tx.selectFrom("app.competitions").innerJoin("app.seasons", "app.seasons.id", "app.competitions.season_id")
      .select(["app.competitions.id", "app.competitions.season_id as seasonId", "app.competitions.name", "app.competitions.version", "app.competitions.archived_at as archivedAt", "app.seasons.name as seasonName"])
      .orderBy("app.competitions.created_at", "desc").execute()
      .then((rows) => rows.map((row) => ({ ...row, archivedAt: iso(row.archivedAt) })))
  }
}

