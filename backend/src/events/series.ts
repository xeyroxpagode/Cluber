import { sql, type Transaction } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import { AppError } from "../shared/errors.js"
import { isNonEmpty } from "../shared/normalize.js"
import { isValidTimeZone, wallClockInZone } from "../shared/zoned-time.js"
import { parseRRule, generateOccurrences, RRuleError, type ParsedRRule } from "../shared/rrule.js"
import { AuthorityService } from "../authority/authority.js"
import { AuditWriter } from "../audit/audit.js"
import { randomUUID } from "node:crypto"
import { validateTargeting, assertAuthorityToCreate, assertCompetitionCoherent, type EventType } from "./events.js"

export interface CreateSeriesInput {
  name?: string
  recurrenceRule: string
  maxOccurrences?: number
  type: EventType
  title: string
  startAt: string
  endAt?: string | null
  timeZone?: string
  venueId?: string | null
  clubWideTarget?: boolean
  targetTeamIds?: string[]
  targetPersonIds?: string[]
  competitionId?: string | null
  opponent?: string | null
}

function uniqueStrings(value: unknown, field: string): string[] {
  if (value === undefined) return []
  if (!Array.isArray(value)) throw new AppError("VALIDATION_FAILED", `${field} must be an array`, "domain_validation", false, { [field]: ["invalid"] })
  const items = value.map((item) => String(item ?? "").trim())
  return Array.from(new Set(items))
}

function parseMax(value: unknown, rule: ParsedRRule): number {
  const requested = value === undefined || value === null ? (rule.count ?? 366) : Number(value)
  if (!Number.isInteger(requested) || requested < 1) {
    throw new AppError("VALIDATION_FAILED", "maxOccurrences must be a positive integer", "domain_validation", false, { maxOccurrences: ["invalid"] })
  }
  if (requested > 366 || (rule.count !== null && rule.count > 366)) {
    throw new AppError("RECURRENCE_TOO_LARGE", "A series cannot exceed 366 occurrences", "domain_validation", false, { maxOccurrences: ["max_366"] })
  }
  return requested
}

export class EventSeriesService {
  constructor(
    private readonly authority = new AuthorityService(),
    private readonly audit = new AuditWriter(),
  ) {}

  /** CMD-EVT-13 — create a series and materialize occurrences as real Events. */
  async createSeries(tx: Transaction<DatabaseSchema>, actorPersonId: string, input: CreateSeriesInput, now: Date, clubTimeZone: string, source = "CMD-EVT-13") {
    const title = String(input.title ?? "").trim()
    if (!isNonEmpty(title, 160)) throw new AppError("VALIDATION_FAILED", "title is required", "domain_validation", false, { title: ["required"] })
    const name = String(input.name ?? title).trim()
    if (!isNonEmpty(name, 160)) throw new AppError("VALIDATION_FAILED", "name is required", "domain_validation", false, { name: ["required"] })

    let rule: ParsedRRule
    try {
      rule = parseRRule(String(input.recurrenceRule ?? ""))
    } catch (error) {
      if (error instanceof RRuleError) throw new AppError("INVALID_RRULE", error.message, "domain_validation", false, { recurrenceRule: ["invalid"] })
      throw error
    }
    const maxOccurrences = parseMax(input.maxOccurrences, rule)
    const effectiveLimit = Math.min(maxOccurrences, rule.count ?? Number.POSITIVE_INFINITY)

    const timeZone = String(input.timeZone ?? clubTimeZone).trim()
    if (!isValidTimeZone(timeZone)) throw new AppError("VALIDATION_FAILED", "timeZone must be a valid IANA zone", "domain_validation", false, { timeZone: ["invalid"] })
    const startAt = new Date(String(input.startAt))
    if (Number.isNaN(startAt.getTime())) throw new AppError("VALIDATION_FAILED", "startAt is invalid", "domain_validation", false, { startAt: ["invalid"] })
    const endAt = input.endAt ? new Date(String(input.endAt)) : null
    if (endAt && (Number.isNaN(endAt.getTime()) || endAt.getTime() <= startAt.getTime())) {
      throw new AppError("VALIDATION_FAILED", "endAt must be after startAt", "domain_validation", false, { endAt: ["must_follow_start"] })
    }
    const durationMs = endAt ? endAt.getTime() - startAt.getTime() : null

    const clubWideTarget = Boolean(input.clubWideTarget)
    const teamIds = uniqueStrings(input.targetTeamIds, "targetTeamIds")
    const personIds = uniqueStrings(input.targetPersonIds, "targetPersonIds")
    if (input.type === "MATCH" && !String(input.opponent ?? "").trim()) {
      throw new AppError("OPPONENT_REQUIRED", "A match requires an opponent", "domain_validation", false, { opponent: ["required"] })
    }
    if (input.type !== "MATCH" && input.competitionId) {
      throw new AppError("INVALID_TARGET", "Only matches accept a competition", "domain_validation", false, { competitionId: ["match_only"] })
    }
    if (input.type !== "MATCH" && String(input.opponent ?? "").trim()) {
      throw new AppError("INVALID_TARGET", "Only matches accept an opponent", "domain_validation", false, { opponent: ["match_only"] })
    }
    await validateTargeting(tx, input.type, { clubWideTarget, teamIds, personIds })
    if (input.competitionId) await assertCompetitionCoherent(tx, String(input.competitionId), teamIds)
    if (input.venueId) {
      const venue = await tx.selectFrom("app.venues").select(["id", "archived_at"]).where("id", "=", String(input.venueId)).executeTakeFirst()
      if (!venue) throw new AppError("VENUE_NOT_FOUND", "Venue was not found", "not_found")
      if (venue.archived_at) throw new AppError("VENUE_ARCHIVED", "Archived venues cannot be used", "conflict")
    }

    const snapshot = await this.authority.snapshot(tx, actorPersonId, now)
    assertAuthorityToCreate(snapshot, input.type, { clubWideTarget, teamIds, personIds })

    const wall = wallClockInZone(startAt, timeZone)
    const occurrences = generateOccurrences(rule, wall, timeZone, { maxOccurrences, limit: effectiveLimit })
    if (occurrences.length === 0) {
      throw new AppError("INVALID_RRULE", "The recurrence rule produces no occurrences", "domain_validation", false, { recurrenceRule: ["no_occurrences"] })
    }
    if (occurrences.length > 366) {
      throw new AppError("RECURRENCE_TOO_LARGE", "A series cannot exceed 366 occurrences", "domain_validation", false, { maxOccurrences: ["max_366"] })
    }

    const seriesId = randomUUID()
    await tx
      .insertInto("app.event_series")
      .values({ id: seriesId, name, state: "ACTIVE", recurrence_rule: String(input.recurrenceRule).trim(), max_occurrences: maxOccurrences, created_at: now, updated_at: now })
      .execute()

    const created: string[] = []
    for (let index = 0; index < occurrences.length; index += 1) {
      const occurrenceStart = occurrences[index]!
      const occurrenceEnd = durationMs === null ? null : new Date(occurrenceStart.getTime() + durationMs)
      const occurrence = await tx
        .insertInto("app.events")
        .values({
          id: randomUUID(),
          type: input.type,
          title,
          start_at: occurrenceStart,
          end_at: occurrenceEnd,
          time_zone: timeZone,
          venue_id: input.venueId ?? null,
          state: "SCHEDULED",
          club_wide_target: clubWideTarget,
          series_id: seriesId,
          occurrence_index: index,
          coordination_revision: 0,
          creator_person_id: actorPersonId,
          version: 1,
          competition_id: input.competitionId ?? null,
          opponent: input.type === "MATCH" ? String(input.opponent ?? "").trim() : null,
          created_at: now,
          updated_at: now,
        })
        .returning(["id"])
        .executeTakeFirstOrThrow()
      created.push(occurrence.id)
      for (const teamId of teamIds) {
        await tx.insertInto("app.event_target_team").values({ id: randomUUID(), event_id: occurrence.id, team_id: teamId, added_at: now, added_by_person_id: actorPersonId }).execute()
      }
      for (const personId of personIds) {
        await tx.insertInto("app.event_target_person").values({ id: randomUUID(), event_id: occurrence.id, person_id: personId, added_at: now, added_by_person_id: actorPersonId }).execute()
      }
    }

    await this.audit.record(tx, {
      actorPersonId,
      action: "EVENT_SERIES_CREATED",
      targetType: "EventSeries",
      targetId: seriesId,
      source,
      diff: { name, recurrenceRule: input.recurrenceRule, occurrences: created.length, type: input.type, title, timeZone },
    })
    return { id: seriesId, occurrenceCount: created.length }
  }

  /** CMD-EVT-14 — ACTIVE → ENDED. Does not delete occurrences. */
  async endSeries(tx: Transaction<DatabaseSchema>, actorPersonId: string, seriesId: string, now: Date, source = "CMD-EVT-14") {
    const series = await tx.selectFrom("app.event_series").selectAll().where("id", "=", seriesId).forUpdate().executeTakeFirst()
    if (!series) throw new AppError("SERIES_NOT_FOUND", "Series was not found", "not_found")
    if (series.state === "ENDED") throw new AppError("SERIES_ALREADY_ENDED", "Series is already ended", "conflict")

    // Authority: SUBCOMMITTEE, or COACH of at least one team targeted by the series.
    const snapshot = await this.authority.snapshot(tx, actorPersonId, now)
    if (!snapshot.isSubcommittee) {
      const teams = await sql<{ team_id: string }>`
        select distinct ett.team_id from app.event_target_team ett
        join app.events e on e.id = ett.event_id
        where e.series_id = ${seriesId}
      `.execute(tx)
      const teamIds = teams.rows.map((row) => row.team_id)
      const coachable = teamIds.some((teamId) => snapshot.coachTeamIds.includes(teamId))
      if (!coachable) {
        const anyCoach = teamIds.length === 0 && snapshot.coachTeamIds.length > 0
        if (!anyCoach) throw new AppError("AUTHORITY_DENIED", "You do not have authority for this series", "authorization")
      }
    }

    await tx.updateTable("app.event_series").set({ state: "ENDED", updated_at: now }).where("id", "=", seriesId).execute()
    await this.audit.record(tx, { actorPersonId, action: "EVENT_SERIES_ENDED", targetType: "EventSeries", targetId: seriesId, source, diff: { previousState: series.state } })
    return { id: seriesId, state: "ENDED" }
  }
}
