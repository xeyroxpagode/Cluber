import type { Transaction } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import { AppError } from "../shared/errors.js"
import { isNonEmpty } from "../shared/normalize.js"
import { AuthorityService } from "../authority/authority.js"
import { AuditWriter } from "../audit/audit.js"
import { resolveEventTargetIds } from "../events/audience.js"
import { randomUUID } from "node:crypto"

export interface ScheduleJornadaInput {
  name: string
  seasonId: string
  competitionId?: string | null
  date?: string
  eventIds: string[]
}

export class JornadaService {
  constructor(
    private readonly authority = new AuthorityService(),
    private readonly audit = new AuditWriter(),
  ) {}

  /** CMD-EVT-15 — create a Jornada grouping MATCH events. Single atomic transaction. Bulk <= 100. */
  async scheduleJornada(tx: Transaction<DatabaseSchema>, actorPersonId: string, input: ScheduleJornadaInput, now: Date, source = "CMD-EVT-15") {
    const name = String(input.name ?? "").trim()
    if (!isNonEmpty(name, 160)) throw new AppError("VALIDATION_FAILED", "name is required", "domain_validation", false, { name: ["required"] })
    const seasonId = String(input.seasonId ?? "").trim()
    if (!/^[0-9a-f-]{36}$/i.test(seasonId)) throw new AppError("VALIDATION_FAILED", "seasonId must be a UUID", "domain_validation", false, { seasonId: ["invalid"] })
    const competitionId = input.competitionId ? String(input.competitionId).trim() : null
    if (competitionId && !/^[0-9a-f-]{36}$/i.test(competitionId)) throw new AppError("VALIDATION_FAILED", "competitionId must be a UUID", "domain_validation", false, { competitionId: ["invalid"] })

    const season = await tx.selectFrom("app.seasons").select(["id"]).where("id", "=", seasonId).executeTakeFirst()
    if (!season) throw new AppError("SEASON_NOT_FOUND", "Season was not found", "not_found")
    if (competitionId) {
      const competition = await tx.selectFrom("app.competitions").select(["id", "season_id", "archived_at"]).where("id", "=", competitionId).executeTakeFirst()
      if (!competition) throw new AppError("COMPETITION_NOT_FOUND", "Competition was not found", "not_found")
      if (competition.archived_at) throw new AppError("COMPETITION_ARCHIVED", "Archived competitions cannot be used", "conflict")
      if (competition.season_id !== seasonId) throw new AppError("SEASON_MISMATCH", "Competition and jornada belong to different seasons", "domain_validation", false, { competitionId: ["season_mismatch"] })
    }

    const eventIds = Array.from(new Set((input.eventIds ?? []).map((id) => String(id).trim()).filter(Boolean)))
    if (eventIds.length === 0) throw new AppError("VALIDATION_FAILED", "eventIds must not be empty", "domain_validation", false, { eventIds: ["required"] })
    if (eventIds.length > 100) throw new AppError("BULK_TOO_LARGE", "A jornada cannot group more than 100 matches", "domain_validation", false, { eventIds: ["max_100"] })

    const snapshot = await this.authority.snapshot(tx, actorPersonId, now)
    const canOperateAny = snapshot.isSubcommittee || snapshot.coachTeamIds.length > 0
    if (!canOperateAny) throw new AppError("AUTHORITY_DENIED", "You do not have authority to schedule a jornada", "authorization")

    const events = await tx.selectFrom("app.events").selectAll().where("id", "in", eventIds).execute()
    if (events.length !== eventIds.length) throw new AppError("EVENT_NOT_FOUND", "One or more events were not found", "not_found")

    for (const event of events) {
      if (event.type !== "MATCH") throw new AppError("INVALID_TARGET", "A jornada can only group matches", "domain_validation", false, { eventId: [event.id], rule: ["match_only"] })
      if (competitionId && event.competition_id && event.competition_id !== competitionId) {
        throw new AppError("SEASON_MISMATCH", "A match references a different competition than the jornada", "domain_validation", false, { eventId: [event.id], competitionId: ["mismatch"] })
      }
      const targets = await resolveEventTargetIds(tx, event.id)
      if (targets.teamIds.length !== 1) throw new AppError("INVALID_TARGET", "A match must target exactly one team", "domain_validation", false, { eventId: [event.id], rule: ["exactly_one_team"] })
      const team = await tx.selectFrom("app.teams").select(["id", "season_id"]).where("id", "=", targets.teamIds[0]!).executeTakeFirstOrThrow()
      if (team.season_id !== seasonId) throw new AppError("SEASON_MISMATCH", "A match belongs to a different season than the jornada", "domain_validation", false, { eventId: [event.id], teamId: [team.id] })
      // COACH must coach the team this match targets.
      if (!snapshot.isSubcommittee && !snapshot.coachTeamIds.includes(team.id) && !snapshot.eventScopeIds.includes(event.id)) {
        throw new AppError("AUTHORITY_DENIED", "COACH can only group matches of their own teams", "authorization")
      }
    }

    // Unicidad: ningún partido puede pertenecer a otra jornada.
    const taken = await tx.selectFrom("app.jornada_matches").select("event_id").where("event_id", "in", eventIds).execute()
    if (taken.length > 0) throw new AppError("MATCH_ALREADY_IN_JORNADA", "A match already belongs to a jornada", "conflict", false, { eventIds: taken.map((row) => row.event_id) })

    const date = String(input.date ?? now.toISOString().slice(0, 10)).trim()
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new AppError("VALIDATION_FAILED", "date must be in YYYY-MM-DD format", "domain_validation", false, { date: ["invalid"] })

    const jornadaId = randomUUID()
    await tx.insertInto("app.jornadas").values({ id: jornadaId, season_id: seasonId, competition_id: competitionId, name, date, created_at: now, updated_at: now }).execute()
    for (const eventId of eventIds) {
      await tx.insertInto("app.jornada_matches").values({ id: randomUUID(), jornada_id: jornadaId, event_id: eventId }).execute()
    }
    await this.audit.record(tx, {
      actorPersonId,
      action: "JORNADA_SCHEDULED",
      targetType: "Jornada",
      targetId: jornadaId,
      source,
      diff: { name, seasonId, competitionId, date, matchCount: eventIds.length, eventIds },
    })
    return { id: jornadaId, matchCount: eventIds.length }
  }
}
