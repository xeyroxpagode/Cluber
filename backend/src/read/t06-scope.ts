import { sql, type Transaction } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import { AppError } from "../shared/errors.js"
import type { AuthoritySnapshot } from "../authority/authority.js"

export interface T06Scope extends AuthoritySnapshot {
  personId: string
  accountId: string
}

const NONE = "00000000-0000-0000-0000-000000000000"

/**
 * FR-04 / PT V1.0.1 §5: PLAYER propio; CAPTAIN/COACH por Team; SUBCOMMITTEE Club;
 * ADMIN denegado para reports. Un ADMIN con un segundo rol deportivo autorizado
 * pasa por ese segundo rol y su scope real (multirol sin herencia indebida).
 */
export function assertReportAuthority(scope: T06Scope): void {
  const sporting = scope.roles.some((role) => role !== "ADMIN")
  if (!sporting || (scope.isAdmin && scope.roles.length === 1)) {
    throw new AppError("AUTHORITY_DENIED", "You do not have authority for reports", "authorization")
  }
}

/** Predicado de autoridad materializado en el CTE raíz, antes de cualquier filtro. */
export function eventAuthorityPredicate(scope: T06Scope) {
  return sql`(
    ${sql.val(scope.isSubcommittee)}
    or exists (select 1 from app.event_target_team ett
               where ett.event_id = e.id and ett.team_id = any(${sql.val(scope.teamIds)}::uuid[]))
    or exists (select 1 from app.event_target_person etp
               where etp.event_id = e.id and etp.person_id = ${sql.val(scope.personId)}::uuid)
    or e.club_wide_target
  )`
}

export function teamFilter(teamId: string | undefined) {
  return teamId
    ? sql`exists (select 1 from app.event_target_team ett2 where ett2.event_id = e.id and ett2.team_id = ${sql.val(teamId)}::uuid)`
    : sql``
}

export function eventFilter(eventId: string | undefined) {
  return eventId ? sql`e.id = ${sql.val(eventId)}::uuid` : sql``
}

export function seasonFilter(seasonId: string | undefined) {
  return seasonId
    ? sql`exists (select 1 from app.event_target_team ets join app.teams ts on ts.id = ets.team_id where ets.event_id = e.id and ts.season_id = ${sql.val(seasonId)}::uuid)`
    : sql``
}

/**
 * TD-14: Season explícita validada contra scope (fuera => 422, no 404).
 * Sin explícita: Season de los Teams en scope; si hay varias, la que cubre
 * evaluationInstant; ambigua/ausente => null ("Toda la temporada" es sólo etiqueta).
 */
export async function resolveSeasonId(
  tx: Transaction<DatabaseSchema>,
  requested: string | undefined,
  scope: T06Scope,
  evaluationInstant: Date,
): Promise<{ seasonId: string | null; label: string }> {
  const allSeasons = await tx.selectFrom("app.seasons").select(["id", "name", "starts_on", "ends_on"]).execute()
  const scopedTeams = scope.teamIds.length > 0
    ? await tx.selectFrom("app.teams").select("season_id").where("id", "in", scope.teamIds).execute()
    : []
  const allowed = new Set(scopedTeams.map((team) => team.season_id))

  if (requested) {
    const season = allSeasons.find((item) => item.id === requested)
    if (!season || (!scope.isSubcommittee && allowed.size > 0 && !allowed.has(requested))) {
      throw new AppError("INVALID_ROLE_SCOPE", "Season is outside the active scope", "domain_validation")
    }
    return { seasonId: season.id, label: season.name }
  }

  const candidates = allowed.size > 0 ? allSeasons.filter((season) => allowed.has(season.id)) : allSeasons
  const today = evaluationInstant.toISOString().slice(0, 10)
  const covering = candidates.filter((season) => season.starts_on <= today && season.ends_on >= today)
  if (covering.length === 1) return { seasonId: covering[0]!.id, label: covering[0]!.name }
  if (candidates.length === 1) return { seasonId: candidates[0]!.id, label: candidates[0]!.name }
  return { seasonId: null, label: "Toda la temporada" }
}

/** PII field-level: nombre siempre; contacto sólo según relación con el actor. */
export function personVisibleFields(scope: T06Scope, personId: string): string[] {
  const fields = ["firstName", "lastName"]
  if (personId === scope.personId || scope.isAdmin) fields.push("email", "phone")
  if (scope.isAdmin) fields.push("dni", "birthDate")
  return fields
}

/**
 * RBAC para reports: SUBCOMMITTEE opera Club; COACH/CAPTAIN su Team;
 * PLAYER únicamente sus propias filas (reforzado en la consulta).
 */
export function reportAllowedActions(scope: T06Scope, personId: string): string[] {
  const actions: string[] = ["reports.read"]
  if (scope.isSubcommittee) actions.push("reports.read.club")
  if (scope.coachTeamIds.length > 0 || scope.captainTeamIds.length > 0) actions.push("reports.read.team")
  if (personId === scope.personId) actions.push("reports.read.self")
  return actions
}

export const EMPTY_GUID = NONE
