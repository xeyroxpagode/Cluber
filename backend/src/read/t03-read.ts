import { sql, type Transaction } from "kysely"
import type { DatabaseSchema, EventTable } from "../db/types.js"
import { AppError } from "../shared/errors.js"
import { AuthorityService, type AuthoritySnapshot } from "../authority/authority.js"
import { classifyEventPatch } from "../events/materiality.js"

function iso(value: Date | string | null | undefined): string | null {
  if (!value) return null
  return new Date(value).toISOString()
}

function dateOnly(value: string | Date | null | undefined): string | null {
  if (!value) return null
  if (typeof value === "string") return value.slice(0, 10)
  return value.toISOString().slice(0, 10)
}

const TERMINAL = new Set(["CANCELLED", "COMPLETED", "ABANDONED"])

export function isTerminalState(state: string): boolean {
  return TERMINAL.has(state)
}

export interface CalendarRangeInput {
  from: string
  to: string
  type?: string
  state?: string
  limit?: number
}

export class T03ReadService {
  constructor(private readonly authority = new AuthorityService()) {}

  private async actorTeamIds(tx: Transaction<DatabaseSchema>, actorPersonId: string, today: string): Promise<string[]> {
    const rows = await tx
      .selectFrom("app.team_assignments")
      .select("team_id")
      .where("person_id", "=", actorPersonId)
      .where("valid_from", "<=", today)
      .where((eb) => eb.or([eb("valid_until", "is", null), eb("valid_until", ">", today)]))
      .execute()
    return rows.map((row) => row.team_id)
  }

  private async canSeeEvent(tx: Transaction<DatabaseSchema>, event: EventTable, actorPersonId: string, snapshot: AuthoritySnapshot, today: string): Promise<boolean> {
    if (snapshot.isSubcommittee) return true
    if (event.club_wide_target) return true
    if (event.creator_person_id === actorPersonId) return true
    if (snapshot.eventScopeIds.includes(event.id)) return true
    const myTeamIds = await this.actorTeamIds(tx, actorPersonId, today)
    const teamTargets = await tx.selectFrom("app.event_target_team").select("team_id").where("event_id", "=", event.id).execute()
    if (teamTargets.some((row) => myTeamIds.includes(row.team_id))) return true
    const personTargets = await tx.selectFrom("app.event_target_person").select("person_id").where("event_id", "=", event.id).execute()
    return personTargets.some((row) => row.person_id === actorPersonId)
  }

  private visibilityWhere(actorPersonId: string, snapshot: AuthoritySnapshot, actorTeamIds: string[]) {
    return (eb: any) =>
      eb.or([
        eb("app.events.club_wide_target", "=", true),
        eb("app.events.creator_person_id", "=", actorPersonId),
        ...(snapshot.eventScopeIds.length > 0 ? [eb("app.events.id", "in", snapshot.eventScopeIds)] : []),
        eb.exists(
          eb
            .selectFrom("app.event_target_team")
            .select(sql`1`.as("one"))
            .whereRef("app.event_target_team.event_id", "=", "app.events.id")
            .where("app.event_target_team.team_id", "in", actorTeamIds.length > 0 ? actorTeamIds : ["00000000-0000-0000-0000-000000000000"])
        ),
        eb.exists(
          eb
            .selectFrom("app.event_target_person")
            .select(sql`1`.as("one"))
            .whereRef("app.event_target_person.event_id", "=", "app.events.id")
            .where("app.event_target_person.person_id", "=", actorPersonId)
        ),
      ])
  }

  private async attachTargets(tx: Transaction<DatabaseSchema>, events: EventTable[]) {
    const ids = events.map((event) => event.id)
    const byId = new Map<string, { teams: string[]; persons: string[] }>()
    for (const id of ids) byId.set(id, { teams: [], persons: [] })
    if (ids.length === 0) return byId
    const [teamRows, personRows] = await Promise.all([
      tx.selectFrom("app.event_target_team").select(["event_id", "team_id"]).where("event_id", "in", ids).execute(),
      tx.selectFrom("app.event_target_person").select(["event_id", "person_id"]).where("event_id", "in", ids).execute(),
    ])
    for (const row of teamRows) byId.get(row.event_id)!.teams.push(row.team_id)
    for (const row of personRows) byId.get(row.event_id)!.persons.push(row.person_id)
    return byId
  }

  private async teamNames(tx: Transaction<DatabaseSchema>, teamIds: string[]) {
    if (teamIds.length === 0) return new Map<string, string>()
    const teams = await tx
      .selectFrom("app.teams")
      .innerJoin("app.divisions", "app.divisions.id", "app.teams.division_id")
      .innerJoin("app.lines", "app.lines.id", "app.teams.line_id")
      .select(["app.teams.id", "app.divisions.name as divisionName", "app.lines.name as lineName"])
      .where("app.teams.id", "in", teamIds)
      .execute()
    return new Map(teams.map((row) => [row.id, `${row.divisionName} ${row.lineName}`.trim()]))
  }

  private async venueNames(tx: Transaction<DatabaseSchema>, venueIds: Array<string | null>) {
    const ids = Array.from(new Set(venueIds.filter((id): id is string => Boolean(id))))
    if (ids.length === 0) return new Map<string, { name: string; address: string; fieldLabel: string | null }>()
    const venues = await tx.selectFrom("app.venues").select(["id", "name", "address"]).where("id", "in", ids).execute()
    return new Map(venues.map((row) => [row.id, { name: row.name, address: row.address, fieldLabel: null }]))
  }

  private async competitionNames(tx: Transaction<DatabaseSchema>, competitionIds: Array<string | null>) {
    const ids = Array.from(new Set(competitionIds.filter((id): id is string => Boolean(id))))
    if (ids.length === 0) return new Map<string, string>()
    const rows = await tx.selectFrom("app.competitions").select(["id", "name"]).where("id", "in", ids).execute()
    return new Map(rows.map((row) => [row.id, row.name]))
  }

  private eventDto(row: EventTable, targets: { teams: string[]; persons: string[] } | undefined, extras: { venue?: { name: string; address: string } | null; competitionName?: string | null; teamNames?: Map<string, string> } = {}) {
    const teamIds = targets?.teams ?? []
    const teamNames = extras.teamNames ?? new Map<string, string>()
    return {
      id: row.id,
      type: row.type,
      title: row.title,
      startAt: iso(row.start_at),
      endAt: iso(row.end_at),
      timeZone: row.time_zone,
      venueId: row.venue_id,
      venue: extras.venue ? { id: row.venue_id, name: extras.venue.name, address: extras.venue.address } : null,
      state: row.state,
      clubWideTarget: row.club_wide_target,
      seriesId: row.series_id,
      occurrenceIndex: row.occurrence_index,
      coordinationRevision: row.coordination_revision,
      creatorPersonId: row.creator_person_id,
      createdAt: iso(row.created_at)!,
      updatedAt: iso(row.updated_at)!,
      version: row.version,
      competitionId: row.competition_id,
      competitionName: extras.competitionName ?? null,
      opponent: row.opponent,
      isTerminal: isTerminalState(row.state),
      concreteTeamId: row.type === "MATCH" ? teamIds[0] ?? null : null,
      targets: {
        teams: teamIds.map((teamId) => ({ teamId, name: teamNames.get(teamId) ?? null })),
        persons: targets?.persons ?? [],
      },
    }
  }

  /** RC-02 — events in [from, to], overlap-aware, visible to the actor. */
  async calendarRange(tx: Transaction<DatabaseSchema>, actorPersonId: string, input: CalendarRangeInput, now: Date) {
    const from = new Date(input.from)
    const to = new Date(input.to)
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      throw new AppError("VALIDATION_FAILED", "from/to must be valid date-times", "domain_validation", false, { range: ["invalid"] })
    }
    if (to.getTime() < from.getTime()) {
      throw new AppError("VALIDATION_FAILED", "to must be on or after from", "domain_validation", false, { to: ["must_follow_from"] })
    }
    const today = now.toISOString().slice(0, 10)
    const snapshot = await this.authority.snapshot(tx, actorPersonId, now)
    const actorTeamIds = await this.actorTeamIds(tx, actorPersonId, today)
    let query = tx
      .selectFrom("app.events")
      .selectAll()
      .where((eb) => eb.or([eb("app.events.start_at", "is", null), eb("app.events.start_at", "<", to)]))
      .where((eb) => eb.or([eb("app.events.start_at", ">=", from), eb("app.events.end_at", ">=", from), eb("app.events.start_at", "is", null)]))
    if (!snapshot.isSubcommittee) query = query.where(this.visibilityWhere(actorPersonId, snapshot, actorTeamIds))
    if (input.type && ["TRAINING", "MATCH", "CLUB_EVENT"].includes(input.type)) query = query.where("app.events.type", "=", input.type as EventTable["type"])
    if (input.state && ["DRAFT","SCHEDULED","POSTPONED","CANCELLED","IN_PROGRESS","COMPLETED","ABANDONED"].includes(input.state)) query = query.where("app.events.state", "=", input.state as EventTable["state"])
    const events = await query.orderBy(sql`app.events.start_at asc nulls last`).limit(Math.min(Math.max(input.limit ?? 200, 1), 500)).execute()
    const targets = await this.attachTargets(tx, events)
    const allTeamIds = Array.from(new Set(events.flatMap((event) => targets.get(event.id)?.teams ?? [])))
    const [teamNames, venues, competitions] = await Promise.all([
      this.teamNames(tx, allTeamIds),
      this.venueNames(tx, events.map((event) => event.venue_id)),
      this.competitionNames(tx, events.map((event) => event.competition_id)),
    ])
    return events.map((row) => this.eventDto(row, targets.get(row.id), { venue: row.venue_id ? venues.get(row.venue_id) ?? null : null, competitionName: row.competition_id ? competitions.get(row.competition_id) ?? null : null, teamNames }))
  }

  /** RC-03 — full event detail. 404 when missing or outside audience (or not SUBCOMMITTEE). */
  async eventDetail(tx: Transaction<DatabaseSchema>, actorPersonId: string, eventId: string, now: Date) {
    const event = await tx.selectFrom("app.events").selectAll().where("app.events.id", "=", eventId).executeTakeFirst()
    if (!event) throw new AppError("EVENT_NOT_FOUND", "Event was not found", "not_found")
    const today = now.toISOString().slice(0, 10)
    const snapshot = await this.authority.snapshot(tx, actorPersonId, now)
    if (!(await this.canSeeEvent(tx, event, actorPersonId, snapshot, today))) throw new AppError("EVENT_NOT_FOUND", "Event was not found", "not_found")
    const targets = await this.attachTargets(tx, [event])
    const target = targets.get(event.id)!
    const [teamNames, venues, competitions, logistics] = await Promise.all([
      this.teamNames(tx, target.teams),
      this.venueNames(tx, [event.venue_id]),
      this.competitionNames(tx, [event.competition_id]),
      tx.selectFrom("app.event_logistics").selectAll().where("event_id", "=", event.id).executeTakeFirst(),
    ])
    const audienceRows = await tx
      .selectFrom("app.memberships")
      .select("person_id")
      .where("valid_from", "<=", new Date(today))
      .where((eb) => eb.or([eb("valid_until", "is", null), eb("valid_until", ">", new Date(today))]))
      .execute()
    return {
      ...this.eventDto(event, target, { venue: event.venue_id ? venues.get(event.venue_id) ?? null : null, competitionName: event.competition_id ? competitions.get(event.competition_id) ?? null : null, teamNames }),
      logistics: logistics
        ? { meetingAt: iso(logistics.meeting_at), departureAt: iso(logistics.departure_at), meetingPoint: logistics.meeting_point, transportNote: logistics.transport_note, arrivalInstructions: logistics.arrival_instructions }
        : null,
      audienceCount: event.club_wide_target ? audienceRows.length : null,
    }
  }

  /** RC-23 — earliest scheduled future event visible to the actor. */
  async nextEvent(tx: Transaction<DatabaseSchema>, actorPersonId: string, now: Date) {
    const today = now.toISOString().slice(0, 10)
    const snapshot = await this.authority.snapshot(tx, actorPersonId, now)
    const actorTeamIds = await this.actorTeamIds(tx, actorPersonId, today)
    let query = tx
      .selectFrom("app.events")
      .selectAll()
      .where("app.events.state", "=", "SCHEDULED")
      .where("app.events.start_at", ">=", now)
    if (!snapshot.isSubcommittee) query = query.where(this.visibilityWhere(actorPersonId, snapshot, actorTeamIds))
    const event = await query.orderBy("app.events.start_at", "asc").limit(1).executeTakeFirst()
    if (!event) return null
    const targets = await this.attachTargets(tx, [event])
    return this.eventDto(event, targets.get(event.id))
  }

  /** RC-14 — jornadas with match counts. */
  async jornadaList(tx: Transaction<DatabaseSchema>, actorPersonId: string, filters: { seasonId?: string; competitionId?: string; limit?: number }, now: Date) {
    await this.authority.snapshot(tx, actorPersonId, now) // authenticated; no audience restriction
    let query = tx
      .selectFrom("app.jornadas")
      .leftJoin("app.jornada_matches", "app.jornada_matches.jornada_id", "app.jornadas.id")
      .select(["app.jornadas.id", "app.jornadas.season_id", "app.jornadas.competition_id", "app.jornadas.name", "app.jornadas.date", "app.jornadas.created_at", sql<number>`count(app.jornada_matches.id)::int`.as("matchCount")])
      .groupBy(["app.jornadas.id"])
      .orderBy("app.jornadas.date", "desc")
    if (filters.seasonId) query = query.where("app.jornadas.season_id", "=", filters.seasonId)
    if (filters.competitionId) query = query.where("app.jornadas.competition_id", "=", filters.competitionId)
    const rows = await query.limit(Math.min(Math.max(filters.limit ?? 100, 1), 200)).execute()
    return rows.map((row) => ({ id: row.id, seasonId: row.season_id, competitionId: row.competition_id, name: row.name, date: dateOnly(row.date)!, matchCount: row.matchCount, createdAt: iso(row.created_at)! }))
  }

  /** RC-25 — jornada detail with matches. */
  async jornadaDetail(tx: Transaction<DatabaseSchema>, actorPersonId: string, jornadaId: string, now: Date) {
    await this.authority.snapshot(tx, actorPersonId, now)
    const jornada = await tx.selectFrom("app.jornadas").selectAll().where("app.jornadas.id", "=", jornadaId).executeTakeFirst()
    if (!jornada) throw new AppError("JORNADA_NOT_FOUND", "Jornada was not found", "not_found")
    const matches = await tx
      .selectFrom("app.jornada_matches")
      .innerJoin("app.events", "app.events.id", "app.jornada_matches.event_id")
      .selectAll("app.events")
      .where("app.jornada_matches.jornada_id", "=", jornadaId)
      .orderBy("app.events.start_at", "asc")
      .execute()
    const matchIds = matches.map((row) => row.id)
    const targetTeams = matchIds.length
      ? await tx.selectFrom("app.event_target_team").select(["event_id", "team_id"]).where("event_id", "in", matchIds).execute()
      : []
    const teamByEvent = new Map(targetTeams.map((row) => [row.event_id, row.team_id]))
    const allTeamIds = Array.from(new Set(targetTeams.map((row) => row.team_id)))
    const [teamNames, venues, competitions] = await Promise.all([
      this.teamNames(tx, allTeamIds),
      this.venueNames(tx, matches.map((row) => row.venue_id)),
      this.competitionNames(tx, matches.map((row) => row.competition_id)),
    ])
    return {
      id: jornada.id,
      seasonId: jornada.season_id,
      competitionId: jornada.competition_id,
      name: jornada.name,
      date: dateOnly(jornada.date)!,
      createdAt: iso(jornada.created_at)!,
      matches: matches.map((row) => {
        const dto = this.eventDto(row, { teams: teamByEvent.get(row.id) ? [teamByEvent.get(row.id)!] : [], persons: [] }, {
          venue: row.venue_id ? venues.get(row.venue_id) ?? null : null,
          competitionName: row.competition_id ? competitions.get(row.competition_id) ?? null : null,
          teamNames,
        })
        return dto
      }),
    }
  }

  /** RC-18 — caller's own notification feed. */
  async notificationList(tx: Transaction<DatabaseSchema>, actorPersonId: string, filters: { unread?: boolean; limit?: number }, now: Date) {
    let query = tx.selectFrom("app.notifications").selectAll().where("recipient_person_id", "=", actorPersonId)
    if (filters.unread === true) query = query.where("read_at", "is", null)
    const rows = await query.orderBy("occurred_at", "desc").limit(Math.min(Math.max(filters.limit ?? 50, 1), 200)).execute()
    return rows.map((row) => ({
      id: row.id,
      recipientPersonId: row.recipient_person_id,
      type: row.type,
      resourceType: row.resource_type,
      resourceId: row.resource_id,
      originEventId: row.origin_event_id,
      title: row.title,
      body: row.body,
      occurredAt: iso(row.occurred_at)!,
      readAt: iso(row.read_at),
      isUnread: row.read_at === null,
      dedupeKey: row.dedupe_key,
    }))
  }

  /** RC-24 — series detail + occurrences. ACT-COACH / ACT-SUBCOMMITTEE. */
  async eventSeriesDetail(tx: Transaction<DatabaseSchema>, actorPersonId: string, seriesId: string, now: Date) {
    const snapshot = await this.authority.snapshot(tx, actorPersonId, now)
    if (!snapshot.isSubcommittee && snapshot.roles.includes("COACH") === false) {
      const teamTargets = await tx
        .selectFrom("app.event_target_team")
        .innerJoin("app.events", "app.events.id", "app.event_target_team.event_id")
        .select("app.event_target_team.team_id")
        .where("app.events.series_id", "=", seriesId)
        .execute()
      const coachable = teamTargets.some((row) => snapshot.coachTeamIds.includes(row.team_id))
      if (!coachable) throw new AppError("AUTHORITY_DENIED", "You do not have authority for this series", "authorization")
    }
    const series = await tx.selectFrom("app.event_series").selectAll().where("id", "=", seriesId).executeTakeFirst()
    if (!series) throw new AppError("SERIES_NOT_FOUND", "Series was not found", "not_found")
    const occurrences = await tx.selectFrom("app.events").selectAll().where("series_id", "=", seriesId).orderBy("occurrence_index", "asc").execute()
    const targets = await this.attachTargets(tx, occurrences)
    const allTeamIds = Array.from(new Set(occurrences.flatMap((event) => targets.get(event.id)?.teams ?? [])))
    const teamNames = await this.teamNames(tx, allTeamIds)
    return {
      id: series.id,
      name: series.name,
      state: series.state,
      recurrenceRule: series.recurrence_rule,
      maxOccurrences: series.max_occurrences,
      createdAt: iso(series.created_at)!,
      occurrences: occurrences.map((row) => this.eventDto(row, targets.get(row.id), { teamNames })),
    }
  }

  /** RC-30 — pre-check of a proposed patch against the material list (DV-13). ACT-COACH / ACT-SUBCOMMITTEE. */
  async materialityCheck(tx: Transaction<DatabaseSchema>, actorPersonId: string, eventId: string, patch: Record<string, unknown>, now: Date) {
    const snapshot = await this.authority.snapshot(tx, actorPersonId, now)
    if (!snapshot.isSubcommittee && !snapshot.roles.includes("COACH")) {
      throw new AppError("AUTHORITY_DENIED", "You do not have authority for this check", "authorization")
    }
    const event = await tx.selectFrom("app.events").select(["id", "version", "state"]).where("id", "=", eventId).executeTakeFirst()
    if (!event) throw new AppError("EVENT_NOT_FOUND", "Event was not found", "not_found")
    const result = classifyEventPatch(patch ?? {})
    return {
      eventId: event.id,
      version: event.version,
      state: event.state,
      isMaterial: result.material.length > 0,
      materialFields: result.material,
      metadataFields: result.metadata,
      classification: result.classification,
    }
  }
}
