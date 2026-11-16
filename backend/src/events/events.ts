import { sql, type Transaction } from "kysely"
import type { DatabaseSchema, EventTable } from "../db/types.js"
import { AppError } from "../shared/errors.js"
import { isNonEmpty } from "../shared/normalize.js"
import { isValidTimeZone } from "../shared/zoned-time.js"
import { classifyEventPatch } from "./materiality.js"
import { resolveEventAudience, resolveEventTargetIds, unionAudiences } from "./audience.js"
import { NotificationService, type NotificationType } from "../notification/notification.js"
import { AuthorityService, type AuthoritySnapshot } from "../authority/authority.js"
import { AuditWriter } from "../audit/audit.js"
import { OutboxWriter } from "../shared/outbox.js"
import { randomUUID } from "node:crypto"

export type EventType = "TRAINING" | "MATCH" | "CLUB_EVENT"
export type EventState = EventTable["state"]

export interface CreateEventInput {
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

export interface EventPatch {
  title?: string
  startAt?: string | null
  endAt?: string | null
  timeZone?: string
  venueId?: string | null
  clubWideTarget?: boolean
  targetTeamIds?: string[]
  targetPersonIds?: string[]
  opponent?: string | null
  competitionId?: string | null
  logistics?: {
    meetingAt?: string | null
    departureAt?: string | null
    meetingPoint?: string | null
    transportNote?: string | null
    arrivalInstructions?: string | null
  }
}

const TERMINAL: ReadonlySet<EventState> = new Set(["CANCELLED", "COMPLETED", "ABANDONED"])
const EDITABLE: ReadonlySet<EventState> = new Set(["SCHEDULED", "POSTPONED"])

export const EVENT_NOTIFICATION_TITLE: Record<NotificationType, string> = {
  EVENT_CHANGED: "Evento actualizado",
  EVENT_POSTPONED: "Evento postergado",
  EVENT_RESCHEDULED: "Evento reprogramado",
  EVENT_CANCELLED: "Evento cancelado",
  EVENT_RESTORED: "Evento restaurado",
  SELECTION_PUBLISHED: "Convocatoria publicada",
  ANNOUNCEMENT_PUBLISHED: "Anuncio publicado",
}

export interface NotifySpec { type: NotificationType; title: string; body: string }

function parseDateTime(value: unknown, field: string): Date | null {
  if (value === null || value === undefined || value === "") return null
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) throw new AppError("VALIDATION_FAILED", `${field} is invalid`, "domain_validation", false, { [field]: ["invalid"] })
  return date
}

function requireText(value: unknown, field: string, max = 160): string {
  const text = String(value ?? "").trim()
  if (!isNonEmpty(text, max)) throw new AppError("VALIDATION_FAILED", `${field} is required`, "domain_validation", false, { [field]: ["required"] })
  return text
}

function requireUuid(value: unknown, field: string): string {
  const text = String(value ?? "").trim()
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(text)) {
    throw new AppError("VALIDATION_FAILED", `${field} must be a UUID`, "domain_validation", false, { [field]: ["invalid"] })
  }
  return text
}

function optionalUuid(value: unknown, field: string): string | null | undefined {
  if (value === undefined) return undefined
  if (value === null) return null
  return requireUuid(value, field)
}

function uniqueStrings(value: unknown, field: string): string[] {
  if (value === undefined) return []
  if (!Array.isArray(value)) throw new AppError("VALIDATION_FAILED", `${field} must be an array`, "domain_validation", false, { [field]: ["invalid"] })
  const items = value.map((item) => requireUuid(item, field))
  return Array.from(new Set(items))
}

export async function validateTargeting(tx: Transaction<DatabaseSchema>, type: EventType, targets: { clubWideTarget: boolean; teamIds: string[]; personIds: string[] }) {
  const { clubWideTarget, teamIds, personIds } = targets
  if (clubWideTarget && (teamIds.length > 0 || personIds.length > 0)) {
    throw new AppError("INVALID_TARGET", "Club-wide events cannot carry target rows", "domain_validation", false, { clubWideTarget: ["club_wide_excludes_targets"] })
  }
  if (!clubWideTarget && teamIds.length === 0 && personIds.length === 0) {
    throw new AppError("INVALID_TARGET", "At least one target team or person is required", "domain_validation", false, { targets: ["required"] })
  }
  if (type === "MATCH") {
    if (clubWideTarget) throw new AppError("INVALID_TARGET", "A match cannot be club-wide", "domain_validation", false, { clubWideTarget: ["match_not_club_wide"] })
    if (teamIds.length !== 1) throw new AppError("INVALID_TARGET", "A match requires exactly one team", "domain_validation", false, { targetTeamIds: ["exactly_one_required"] })
    if (personIds.length > 0) throw new AppError("INVALID_TARGET", "A match does not accept person targets", "domain_validation", false, { targetPersonIds: ["not_allowed"] })
  } else if (type === "TRAINING") {
    if (personIds.length > 0) throw new AppError("INVALID_TARGET", "A training does not accept person targets", "domain_validation", false, { targetPersonIds: ["not_allowed"] })
  }
  if (teamIds.length > 0) {
    const teams = await tx.selectFrom("app.teams").select(["id", "state", "season_id"]).where("id", "in", teamIds).execute()
    if (teams.length !== teamIds.length) throw new AppError("TEAM_NOT_FOUND", "Target team was not found", "not_found")
    const archived = teams.find((team) => team.state === "ARCHIVED")
    if (archived) throw new AppError("TEAM_ARCHIVED", "Archived teams cannot be targeted", "conflict")
  }
  if (personIds.length > 0) {
    const persons = await tx.selectFrom("app.people").select("id").where("id", "in", personIds).execute()
    if (persons.length !== personIds.length) throw new AppError("PERSON_NOT_FOUND", "Target person was not found", "not_found")
  }
}

export async function assertCompetitionCoherent(tx: Transaction<DatabaseSchema>, competitionId: string, teamIds: string[]) {
  const competition = await tx.selectFrom("app.competitions").select(["id", "season_id", "archived_at"]).where("id", "=", competitionId).executeTakeFirst()
  if (!competition) throw new AppError("COMPETITION_NOT_FOUND", "Competition was not found", "not_found")
  if (competition.archived_at) throw new AppError("COMPETITION_ARCHIVED", "Archived competitions cannot be used", "conflict")
  if (teamIds.length > 0) {
    const teams = await tx.selectFrom("app.teams").select(["id", "season_id"]).where("id", "in", teamIds).execute()
    const mismatched = teams.some((team) => team.season_id !== competition.season_id)
    if (mismatched) throw new AppError("SEASON_MISMATCH", "Competition and teams belong to different seasons", "domain_validation", false, { competitionId: ["season_mismatch"] })
  }
  return competition
}

async function assertVenueOperational(tx: Transaction<DatabaseSchema>, venueId: string) {
  const venue = await tx.selectFrom("app.venues").select(["id", "archived_at"]).where("id", "=", venueId).executeTakeFirst()
  if (!venue) throw new AppError("VENUE_NOT_FOUND", "Venue was not found", "not_found")
  if (venue.archived_at) throw new AppError("VENUE_ARCHIVED", "Archived venues cannot be used", "conflict")
  return venue
}

async function loadEvent(tx: Transaction<DatabaseSchema>, eventId: string, forUpdate = true): Promise<EventTable> {
  let query = tx.selectFrom("app.events").selectAll().where("id", "=", eventId)
  if (forUpdate) query = query.forUpdate()
  const row = await query.executeTakeFirst()
  if (!row) throw new AppError("EVENT_NOT_FOUND", "Event was not found", "not_found")
  return row
}

function terminalGuard(event: EventTable): void {
  if (TERMINAL.has(event.state)) throw new AppError("EVENT_TERMINAL", "This operation is not allowed on a terminal event", "conflict")
}

function editableGuard(event: EventTable): void {
  if (TERMINAL.has(event.state)) throw new AppError("EVENT_TERMINAL", "This operation is not allowed on a terminal event", "conflict")
  if (!EDITABLE.has(event.state)) throw new AppError("EVENT_NOT_EDITABLE", "This operation is only allowed on scheduled or postponed events", "conflict")
}

export function assertAuthorityToCreate(snapshot: AuthoritySnapshot, type: EventType, targets: { clubWideTarget: boolean; teamIds: string[]; personIds: string[] }): void {
  if (type === "CLUB_EVENT") {
    if (!snapshot.isSubcommittee) throw new AppError("AUTHORITY_DENIED", "Only SUBCOMMITTEE can create club events", "authorization")
    return
  }
  if (targets.clubWideTarget) {
    if (!snapshot.isSubcommittee) throw new AppError("AUTHORITY_DENIED", "Only SUBCOMMITTEE can create club-wide events", "authorization")
    return
  }
  if (snapshot.isSubcommittee) return
  // COACH: every target team must be an own team.
  const unowned = targets.teamIds.filter((teamId) => !snapshot.coachTeamIds.includes(teamId))
  if (unowned.length > 0 || targets.teamIds.length === 0) {
    throw new AppError("AUTHORITY_DENIED", "COACH can only create events for their own teams", "authorization")
  }
}

interface InternalPatchOptions {
  expectedVersion?: number
  requireMaterial?: boolean
  allowTitle?: boolean
  seriesScope?: "ONLY_THIS" | "THIS_AND_FOLLOWING" | "ENTIRE_SERIES"
}

function assertCoachOperates(snapshot: AuthoritySnapshot, eventId: string, teamIds: readonly string[]): void {
  if (snapshot.eventScopeIds.includes(eventId)) return
  if (teamIds.some((teamId) => snapshot.coachTeamIds.includes(teamId))) return
  throw new AppError("AUTHORITY_DENIED", "You do not have authority for this event", "authorization")
}

export class EventService {
  constructor(
    private readonly authority = new AuthorityService(),
    private readonly audit = new AuditWriter(),
    private readonly notifications = new NotificationService(),
    private readonly outbox = new OutboxWriter(),
  ) {}

  private async notifyAudience(tx: Transaction<DatabaseSchema>, spec: NotifySpec, event: EventTable, audience: readonly string[], now: Date): Promise<void> {
    const { rows } = await this.notifications.recordForAudience(tx, audience, {
      type: spec.type,
      resourceType: "EVENT",
      resourceId: event.id,
      originEventId: event.id,
      title: spec.title,
      body: spec.body,
      occurredAt: now,
    })
    for (const row of rows) {
      if (row.wasDuplicate) continue
      await this.outbox.enqueue(tx, {
        topic: "notification.created",
        aggregateType: "Notification",
        aggregateId: row.id,
        payload: { schemaVersion: 1, event: "notification.created", recipients: [row.recipientPersonId], resourceType: "EVENT", resourceId: event.id, invalidate: ["notifications", "calendar"] },
      })
    }
  }

  async createEvent(tx: Transaction<DatabaseSchema>, actorPersonId: string, input: CreateEventInput, now: Date, clubTimeZone: string, source = "CMD-EVT-01"): Promise<EventTable> {
    const type = input.type
    if (!["TRAINING", "MATCH", "CLUB_EVENT"].includes(type)) {
      throw new AppError("VALIDATION_FAILED", "type must be TRAINING, MATCH or CLUB_EVENT", "domain_validation", false, { type: ["invalid"] })
    }
    const title = requireText(input.title, "title")
    const startAt = parseDateTime(input.startAt, "startAt")
    if (!startAt) throw new AppError("VALIDATION_FAILED", "startAt is required", "domain_validation", false, { startAt: ["required"] })
    const endAt = parseDateTime(input.endAt ?? null, "endAt")
    if (endAt && endAt.getTime() <= startAt.getTime()) {
      throw new AppError("VALIDATION_FAILED", "endAt must be after startAt", "domain_validation", false, { endAt: ["must_follow_start"] })
    }
    const timeZone = String(input.timeZone ?? clubTimeZone).trim()
    if (!isValidTimeZone(timeZone)) throw new AppError("VALIDATION_FAILED", "timeZone must be a valid IANA zone", "domain_validation", false, { timeZone: ["invalid"] })
    const opponentRaw = input.opponent === undefined || input.opponent === null ? null : String(input.opponent).trim()
    if (type === "MATCH") {
      if (!opponentRaw) throw new AppError("OPPONENT_REQUIRED", "A match requires an opponent", "domain_validation", false, { opponent: ["required"] })
    } else if (opponentRaw) {
      throw new AppError("INVALID_TARGET", "Only matches accept an opponent", "domain_validation", false, { opponent: ["match_only"] })
    }
    const competitionId = optionalUuid(input.competitionId, "competitionId") ?? null
    if (competitionId && type !== "MATCH") {
      throw new AppError("INVALID_TARGET", "Only matches accept a competition", "domain_validation", false, { competitionId: ["match_only"] })
    }
    const venueId = optionalUuid(input.venueId, "venueId") ?? null
    const clubWideTarget = Boolean(input.clubWideTarget)
    const teamIds = uniqueStrings(input.targetTeamIds, "targetTeamIds")
    const personIds = uniqueStrings(input.targetPersonIds, "targetPersonIds")

    await validateTargeting(tx, type, { clubWideTarget, teamIds, personIds })
    if (venueId) await assertVenueOperational(tx, venueId)
    if (competitionId) await assertCompetitionCoherent(tx, competitionId, teamIds)

    const snapshot = await this.authority.snapshot(tx, actorPersonId, now)
    assertAuthorityToCreate(snapshot, type, { clubWideTarget, teamIds, personIds })

    const id = randomUUID()
    const endValue = endAt
    const inserted = await tx
      .insertInto("app.events")
      .values({
        id,
        type,
        title,
        start_at: startAt,
        end_at: endValue,
        time_zone: timeZone,
        venue_id: venueId,
        state: "SCHEDULED",
        club_wide_target: clubWideTarget,
        series_id: null,
        occurrence_index: null,
        coordination_revision: 0,
        creator_person_id: actorPersonId,
        version: 1,
        competition_id: competitionId,
        opponent: opponentRaw,
        created_at: now,
        updated_at: now,
      })
      .returningAll()
      .executeTakeFirstOrThrow()

    for (const teamId of teamIds) {
      await tx.insertInto("app.event_target_team").values({ id: randomUUID(), event_id: id, team_id: teamId, added_at: new Date(), added_by_person_id: actorPersonId }).execute()
    }
    for (const personId of personIds) {
      await tx.insertInto("app.event_target_person").values({ id: randomUUID(), event_id: id, person_id: personId, added_at: new Date(), added_by_person_id: actorPersonId }).execute()
    }

    await this.audit.record(tx, {
      actorPersonId,
      action: type === "TRAINING" ? "EVENT_TRAINING_CREATED" : type === "MATCH" ? "EVENT_MATCH_CREATED" : "EVENT_CLUB_EVENT_CREATED",
      targetType: "Event",
      targetId: id,
      source,
      diff: { type, title, startAt: startAt.toISOString(), endAt: endValue?.toISOString() ?? null, timeZone, venueId, clubWideTarget, targetTeamIds: teamIds, targetPersonIds: personIds, competitionId, opponent: opponentRaw },
    })
    return inserted
  }

  /** Shared mutation engine for CMD-EVT-04/05/12/16. Must run inside one transaction. */
  private async applyEventPatch(
    tx: Transaction<DatabaseSchema>,
    actorPersonId: string,
    event: EventTable,
    patch: EventPatch,
    now: Date,
    source: string,
    options: InternalPatchOptions,
  ) {
    const { expectedVersion, requireMaterial = false } = options
    editableGuard(event)

    const current = await resolveEventTargetIds(tx, event.id)
    const snapshot = await this.authority.snapshot(tx, actorPersonId, now)
    if (!this.authority.canOperateEvent(snapshot, { eventId: event.id, targetTeamIds: current.teamIds })) {
      throw new AppError("AUTHORITY_DENIED", "You do not have authority for this event", "authorization")
    }

    const materiality = classifyEventPatch(patch as Record<string, unknown>)
    if (requireMaterial && materiality.material.length === 0) {
      throw new AppError("INVALID_MATERIAL_CHANGE", "At least one material field must change", "domain_validation", false, { materiality: ["no_material_change"] })
    }

    if (expectedVersion !== undefined && expectedVersion !== event.version) {
      throw new AppError("OPTIMISTIC_LOCK_FAILURE", "The event changed since you loaded it", "conflict")
    }

    // ---- merge and validate temporal fields ----
    const touchesWindow = "startAt" in patch || "endAt" in patch || "timeZone" in patch
    const newStartAt = "startAt" in patch ? parseDateTime(patch.startAt, "startAt") : event.start_at
    const newEndAt = "endAt" in patch ? parseDateTime(patch.endAt, "endAt") : event.end_at
    if (newStartAt && newEndAt && newEndAt.getTime() <= newStartAt.getTime()) {
      throw new AppError("VALIDATION_FAILED", "endAt must be after startAt", "domain_validation", false, { endAt: ["must_follow_start"] })
    }
    const newTimeZone = "timeZone" in patch ? String(patch.timeZone ?? "").trim() : event.time_zone
    if (!isValidTimeZone(newTimeZone)) throw new AppError("VALIDATION_FAILED", "timeZone must be a valid IANA zone", "domain_validation", false, { timeZone: ["invalid"] })

    // ---- merge and validate targeting ----
    const wantsTargeting = "targetTeamIds" in patch || "targetPersonIds" in patch || "clubWideTarget" in patch
    let resulting = { clubWideTarget: event.club_wide_target, teamIds: [...current.teamIds], personIds: [...current.personIds] }
    if (patch.clubWideTarget === true && ("targetTeamIds" in patch || "targetPersonIds" in patch)) {
      const providedTeams = uniqueStrings(patch.targetTeamIds ?? [], "targetTeamIds")
      const providedPersons = uniqueStrings(patch.targetPersonIds ?? [], "targetPersonIds")
      if (providedTeams.length > 0 || providedPersons.length > 0) {
        throw new AppError("INVALID_TARGET", "Club-wide events cannot carry target rows", "domain_validation", false, { clubWideTarget: ["club_wide_excludes_targets"] })
      }
    }
    if (patch.clubWideTarget !== undefined) resulting = { ...resulting, clubWideTarget: Boolean(patch.clubWideTarget) }
    if (patch.targetTeamIds !== undefined) resulting = { ...resulting, teamIds: uniqueStrings(patch.targetTeamIds, "targetTeamIds") }
    if (patch.targetPersonIds !== undefined) resulting = { ...resulting, personIds: uniqueStrings(patch.targetPersonIds, "targetPersonIds") }
    if (resulting.clubWideTarget) resulting = { clubWideTarget: true, teamIds: [], personIds: [] }
    await validateTargeting(tx, event.type, resulting)

    // ---- merge and validate sporting references ----
    const resultingTeamIds = resulting.teamIds
    const opponentRaw = "opponent" in patch ? (patch.opponent === null ? null : String(patch.opponent).trim()) : event.opponent
    if (event.type === "MATCH") {
      if (!opponentRaw) throw new AppError("OPPONENT_REQUIRED", "A match requires an opponent", "domain_validation", false, { opponent: ["required"] })
    } else if (opponentRaw) {
      throw new AppError("INVALID_TARGET", "Only matches accept an opponent", "domain_validation", false, { opponent: ["match_only"] })
    }
    const competitionId = "competitionId" in patch ? (patch.competitionId === null ? null : requireUuid(patch.competitionId, "competitionId")) : event.competition_id
    if (competitionId && event.type !== "MATCH") {
      throw new AppError("INVALID_TARGET", "Only matches accept a competition", "domain_validation", false, { competitionId: ["match_only"] })
    }
    if (competitionId) await assertCompetitionCoherent(tx, competitionId, resultingTeamIds)

    const venueId = "venueId" in patch ? optionalUuid(patch.venueId, "venueId") : event.venue_id
    if (venueId) await assertVenueOperational(tx, venueId)

    const title = patch.title !== undefined ? requireText(patch.title, "title") : event.title

    // ---- capture old audience before mutation ----
    const oldAudience = await resolveEventAudience(tx, event, now)

    // ---- apply base event updates ----
    const isMaterial = materiality.material.length > 0
    const updates: Record<string, unknown> = {
      title,
      start_at: newStartAt,
      end_at: newEndAt,
      time_zone: newTimeZone,
      venue_id: venueId ?? null,
      opponent: opponentRaw,
      competition_id: competitionId,
      version: event.version + 1,
      coordination_revision: event.coordination_revision + (isMaterial ? 1 : 0),
      updated_at: now,
    }
    await tx.updateTable("app.events").set(updates).where("id", "=", event.id).execute()

    // ---- replace targeting if requested ----
    if (wantsTargeting) {
      await tx.deleteFrom("app.event_target_team").where("event_id", "=", event.id).execute()
      await tx.deleteFrom("app.event_target_person").where("event_id", "=", event.id).execute()
      await tx.updateTable("app.events").set({ club_wide_target: resulting.clubWideTarget }).where("id", "=", event.id).execute()
      for (const teamId of resulting.teamIds) {
        await tx.insertInto("app.event_target_team").values({ id: randomUUID(), event_id: event.id, team_id: teamId, added_at: new Date(), added_by_person_id: actorPersonId }).execute()
      }
      for (const personId of resulting.personIds) {
        await tx.insertInto("app.event_target_person").values({ id: randomUUID(), event_id: event.id, person_id: personId, added_at: new Date(), added_by_person_id: actorPersonId }).execute()
      }
    } else {
      await tx.updateTable("app.events").set({ club_wide_target: resulting.clubWideTarget }).where("id", "=", event.id).execute()
    }

    // ---- upsert logistics if provided ----
    if (patch.logistics && Object.values(patch.logistics).some((item) => item !== undefined)) {
      const meetingAt = patch.logistics.meetingAt === undefined ? undefined : parseDateTime(patch.logistics.meetingAt, "meetingAt")
      const departureAt = patch.logistics.departureAt === undefined ? undefined : parseDateTime(patch.logistics.departureAt, "departureAt")
      const fields: Record<string, unknown> = {}
      if (meetingAt !== undefined) fields.meeting_at = meetingAt
      if (departureAt !== undefined) fields.departure_at = departureAt
      if (patch.logistics.meetingPoint !== undefined) fields.meeting_point = patch.logistics.meetingPoint === null || String(patch.logistics.meetingPoint).trim() === "" ? null : requireText(patch.logistics.meetingPoint, "meetingPoint", 300)
      if (patch.logistics.transportNote !== undefined) fields.transport_note = patch.logistics.transportNote === null || String(patch.logistics.transportNote).trim() === "" ? null : String(patch.logistics.transportNote).slice(0, 2000)
      if (patch.logistics.arrivalInstructions !== undefined) fields.arrival_instructions = patch.logistics.arrivalInstructions === null || String(patch.logistics.arrivalInstructions).trim() === "" ? null : String(patch.logistics.arrivalInstructions).slice(0, 2000)
      if (Object.keys(fields).length > 0) {
        const existing = await tx.selectFrom("app.event_logistics").select("id").where("event_id", "=", event.id).executeTakeFirst()
        if (existing) await tx.updateTable("app.event_logistics").set({ ...fields, updated_at: now }).where("event_id", "=", event.id).execute()
        else await tx.insertInto("app.event_logistics").values({ id: randomUUID(), event_id: event.id, ...fields, created_at: now, updated_at: now }).execute()
      }
    }

    // ---- series override bookkeeping (ONLY_THIS) ----
    if (event.series_id && event.occurrence_index !== null && event.occurrence_index !== undefined) {
      const custom: Record<string, unknown> = {}
      if ("title" in patch) custom.custom_title = title
      if ("startAt" in patch) custom.custom_start_at = newStartAt
      if ("endAt" in patch) custom.custom_end_at = newEndAt
      if ("venueId" in patch) custom.custom_venue_id = venueId ?? null
      if (Object.keys(custom).length > 0) {
        await tx
          .insertInto("app.event_occurrence_overrides")
          .values({ id: randomUUID(), series_id: event.series_id, occurrence_index: event.occurrence_index, overridden_event_id: event.id, ...custom, is_cancelled: false, created_at: now, updated_at: now })
          .onConflict((oc) => oc.columns(["series_id", "occurrence_index"]).doUpdateSet({ ...custom, updated_at: now }))
          .execute()
      }
    }

    // ---- audit ----
    await this.audit.record(tx, {
      actorPersonId,
      action: isMaterial ? "EVENT_MATERIAL_CHANGED" : "EVENT_EDITED",
      targetType: "Event",
      targetId: event.id,
      source,
      diff: { materialFields: materiality.material, metadataFields: materiality.metadata, startAt: newStartAt?.toISOString() ?? null, endAt: newEndAt?.toISOString() ?? null, timeZone: newTimeZone, venueId: venueId ?? null, clubWideTarget: resulting.clubWideTarget, targetTeamIds: resulting.teamIds, targetPersonIds: resulting.personIds, competitionId, opponent: opponentRaw, title },
    })

    // ---- notify (NOT-01) when material ----
    if (isMaterial) {
      const fresh = { ...event, club_wide_target: resulting.clubWideTarget } as EventTable
      const newAudience = await resolveEventAudience(tx, fresh, now)
      const audience = await unionAudiences(oldAudience, newAudience)
      await this.notifyAudience(tx, { type: "EVENT_CHANGED", title: EVENT_NOTIFICATION_TITLE.EVENT_CHANGED, body: `El evento "${title}" cambió (fecha, sede o coordinación).` }, { ...event, id: event.id }, audience, now)
    }

    return { id: event.id, version: event.version + 1, coordinationRevision: event.coordination_revision + (isMaterial ? 1 : 0), material: materiality.material }
  }

  /** CMD-EVT-04 — non-material edit (title only). */
  async editEventMeta(tx: Transaction<DatabaseSchema>, actorPersonId: string, eventId: string, input: { title?: string; expectedVersion?: number }, now: Date, source = "CMD-EVT-04") {
    const event = await loadEvent(tx, eventId)
    const illegal = Object.keys(input).filter((key) => key !== "title" && key !== "expectedVersion")
    if (illegal.length > 0) {
      throw new AppError("INVALID_MATERIAL_CHANGE", "CMD-EVT-04 only accepts title; use CMD-EVT-05 for material fields", "domain_validation", false, Object.fromEntries(illegal.map((key) => [key, ["use_cmd_evt_05"]])))
    }
    const result = await this.applyEventPatch(tx, actorPersonId, event, { title: input.title }, now, source, { expectedVersion: input.expectedVersion, requireMaterial: false })
    return result
  }

  /** CMD-EVT-05 — material change. */
  async materialChangeEvent(tx: Transaction<DatabaseSchema>, actorPersonId: string, eventId: string, patch: EventPatch, expectedVersion: number | undefined, now: Date, source = "CMD-EVT-05") {
    const event = await loadEvent(tx, eventId)
    return this.applyEventPatch(tx, actorPersonId, event, patch, now, source, { expectedVersion, requireMaterial: true })
  }

  /** CMD-EVT-12 — resolve an edit conflict against the server version. */
  async resolveEditConflict(tx: Transaction<DatabaseSchema>, actorPersonId: string, eventId: string, input: { expectedVersion: number; patch: EventPatch }, now: Date, source = "CMD-EVT-12") {
    const event = await loadEvent(tx, eventId)
    if (Number(input.expectedVersion) !== event.version) {
      throw new AppError("OPTIMISTIC_LOCK_FAILURE", "The event changed since you loaded it", "conflict")
    }
    const materiality = classifyEventPatch(input.patch as Record<string, unknown>)
    return this.applyEventPatch(tx, actorPersonId, event, input.patch, now, source, { expectedVersion: input.expectedVersion, requireMaterial: materiality.material.length > 0 })
  }

  // ---------------------------------------------
  // Lifecycle (SM-EVENT-01)
  // ---------------------------------------------

  private async transitionEvent(
    tx: Transaction<DatabaseSchema>,
    actorPersonId: string,
    eventId: string,
    spec: { from: ReadonlySet<EventState>; to: EventState; notify?: NotifySpec; source: string },
    now: Date,
  ): Promise<{ id: string; state: EventState; version: number; coordinationRevision: number }> {
    const event = await loadEvent(tx, eventId)
    const current = await resolveEventTargetIds(tx, eventId)
    const snapshot = await this.authority.snapshot(tx, actorPersonId, now)
    if (!this.authority.canOperateEvent(snapshot, { eventId, targetTeamIds: current.teamIds })) {
      throw new AppError("AUTHORITY_DENIED", "You do not have authority for this event", "authorization")
    }
    if (!spec.from.has(event.state)) {
      if (TERMINAL.has(event.state)) throw new AppError("EVENT_TERMINAL", "This operation is not allowed on a terminal event", "conflict")
      throw new AppError("INVALID_STATE_TRANSITION", `This operation is not allowed from state ${event.state}`, "conflict")
    }
    const updated = await tx
      .updateTable("app.events")
      .set({ state: spec.to, coordination_revision: event.coordination_revision + 1, version: event.version + 1, updated_at: now })
      .where("id", "=", event.id)
      .returningAll()
      .executeTakeFirstOrThrow()
    await this.audit.record(tx, {
      actorPersonId,
      action: `EVENT_${spec.to}`,
      targetType: "Event",
      targetId: event.id,
      source: spec.source,
      diff: { from: event.state, to: spec.to, title: event.title, coordinationRevision: updated.coordination_revision },
    })
    if (spec.notify) {
      const audience = await resolveEventAudience(tx, updated, now)
      await this.notifyAudience(tx, spec.notify, updated, audience, now)
    }
    return { id: updated.id, state: updated.state, version: updated.version, coordinationRevision: updated.coordination_revision }
  }

  /** CMD-EVT-06 — SCHEDULED → POSTPONED */
  postponeEvent(tx: Transaction<DatabaseSchema>, actorPersonId: string, eventId: string, now: Date, source = "CMD-EVT-06") {
    return this.transitionEvent(tx, actorPersonId, eventId, { from: new Set(["SCHEDULED"]), to: "POSTPONED", notify: { type: "EVENT_POSTPONED", title: EVENT_NOTIFICATION_TITLE.EVENT_POSTPONED, body: "El evento se postergó. Se les avisará cuando haya nueva fecha." }, source }, now)
  }

  /** CMD-EVT-07 — POSTPONED → SCHEDULED */
  rescheduleEvent(tx: Transaction<DatabaseSchema>, actorPersonId: string, eventId: string, now: Date, source = "CMD-EVT-07") {
    return this.transitionEvent(tx, actorPersonId, eventId, { from: new Set(["POSTPONED"]), to: "SCHEDULED", notify: { type: "EVENT_RESCHEDULED", title: EVENT_NOTIFICATION_TITLE.EVENT_RESCHEDULED, body: "El evento vuelve a tener fecha confirmada." }, source }, now)
  }

  /** CMD-EVT-08 — SCHEDULED|POSTPONED → CANCELLED */
  cancelEvent(tx: Transaction<DatabaseSchema>, actorPersonId: string, eventId: string, now: Date, source = "CMD-EVT-08") {
    return this.transitionEvent(tx, actorPersonId, eventId, { from: new Set(["SCHEDULED", "POSTPONED"]), to: "CANCELLED", notify: { type: "EVENT_CANCELLED", title: EVENT_NOTIFICATION_TITLE.EVENT_CANCELLED, body: "El evento fue cancelado." }, source }, now)
  }

  /** CMD-EVT-09 — CANCELLED → SCHEDULED */
  restoreEvent(tx: Transaction<DatabaseSchema>, actorPersonId: string, eventId: string, now: Date, source = "CMD-EVT-09") {
    return this.transitionEvent(tx, actorPersonId, eventId, { from: new Set(["CANCELLED"]), to: "SCHEDULED", notify: { type: "EVENT_RESTORED", title: EVENT_NOTIFICATION_TITLE.EVENT_RESTORED, body: "El evento fue restaurado." }, source }, now)
  }

  /**
   * CMD-EVT-10 — IN_PROGRESS → COMPLETED.
   * T03 has no MatchRecord persistence (T04). The compatible-MatchRecord precondition
   * cannot be satisfied, so this command fails closed with MATCHRECORD_REQUIRED.
   */
  async completeEvent(tx: Transaction<DatabaseSchema>, actorPersonId: string, eventId: string, now: Date, source = "CMD-EVT-10") {
    const event = await loadEvent(tx, eventId)
    if (event.state !== "IN_PROGRESS") {
      if (TERMINAL.has(event.state)) throw new AppError("EVENT_TERMINAL", "This operation is not allowed on a terminal event", "conflict")
      throw new AppError("INVALID_STATE_TRANSITION", `This operation is not allowed from state ${event.state}`, "conflict")
    }
    const current = await resolveEventTargetIds(tx, eventId)
    const snapshot = await this.authority.snapshot(tx, actorPersonId, now)
    assertCoachOperates(snapshot, eventId, current.teamIds)
    throw new AppError("MATCHRECORD_REQUIRED", "Completing an event requires a compatible MatchRecord, which is delivered with T04", "conflict")
  }

  /**
   * CMD-EVT-11 — IN_PROGRESS → ABANDONED. See completeEvent for the T04 dependency.
   */
  async abandonEvent(tx: Transaction<DatabaseSchema>, actorPersonId: string, eventId: string, now: Date, source = "CMD-EVT-11") {
    const event = await loadEvent(tx, eventId)
    if (event.state !== "IN_PROGRESS") {
      if (TERMINAL.has(event.state)) throw new AppError("EVENT_TERMINAL", "This operation is not allowed on a terminal event", "conflict")
      throw new AppError("INVALID_STATE_TRANSITION", `This operation is not allowed from state ${event.state}`, "conflict")
    }
    const current = await resolveEventTargetIds(tx, eventId)
    const snapshot = await this.authority.snapshot(tx, actorPersonId, now)
    assertCoachOperates(snapshot, eventId, current.teamIds)
    throw new AppError("MATCHRECORD_REQUIRED", "Abandoning an event requires a MatchRecord with resultType=ABANDONED, which is delivered with T04", "conflict")
  }

  /**
   * CMD-EVT-17 — startEvent (SCHEDULED -> IN_PROGRESS) para MATCH.
   * Addendum A-D04-02: incrementa Event.version, NO incrementa coordinationRevision
   * (el inicio no es un cambio material de coordinación) y NO emite NOT-01 automático.
   * Autoridad exclusiva de COACH con grant vigente y scope correcto (TEAM propio o EVENT propio).
   */
  async startEvent(
    tx: Transaction<DatabaseSchema>,
    actorPersonId: string,
    eventId: string,
    expectedVersion: number | undefined,
    now: Date,
    source = "CMD-EVT-17",
  ) {
    const event = await loadEvent(tx, eventId)
    if (event.type !== "MATCH") {
      throw new AppError("INVALID_TARGET", "Only a match can be started", "domain_validation", false, { type: ["match_required"] })
    }
    if (event.state !== "SCHEDULED") {
      throw new AppError("EVENT_NOT_SCHEDULED", "Only a scheduled match can be started", "conflict")
    }
    const current = await resolveEventTargetIds(tx, eventId)
    const snapshot = await this.authority.snapshot(tx, actorPersonId, now)
    assertCoachOperates(snapshot, eventId, current.teamIds)
    if (expectedVersion !== undefined && Number(expectedVersion) !== event.version) {
      throw new AppError("OPTIMISTIC_LOCK_FAILURE", "The event changed since you loaded it", "conflict")
    }
    const updated = await tx
      .updateTable("app.events")
      .set({ state: "IN_PROGRESS", version: event.version + 1, updated_at: now })
      .where("id", "=", event.id)
      .returningAll()
      .executeTakeFirstOrThrow()
    await this.audit.record(tx, {
      actorPersonId,
      action: "EVENT_STARTED",
      targetType: "Event",
      targetId: event.id,
      source,
      diff: { from: event.state, to: "IN_PROGRESS", version: updated.version, coordinationRevision: updated.coordination_revision },
    })
    // A-D04-02: sin NOT-01 automático y sin incremento de coordinationRevision.
    return { eventId: updated.id, state: updated.state, version: updated.version, coordinationRevision: updated.coordination_revision }
  }

  /** CMD-EVT-16 — upsert event logistics (material change, NOT-01). */
  async updateLogistics(
    tx: Transaction<DatabaseSchema>,
    actorPersonId: string,
    eventId: string,
    input: { meetingAt?: string | null; departureAt?: string | null; meetingPoint?: string | null; transportNote?: string | null; arrivalInstructions?: string | null; expectedVersion?: number },
    now: Date,
    source = "CMD-EVT-16",
  ) {
    const clean = (value: unknown) => (typeof value === "string" && value.trim() === "" ? null : value)
    input = { ...input, meetingAt: clean(input.meetingAt) as never, departureAt: clean(input.departureAt) as never, meetingPoint: clean(input.meetingPoint) as never, transportNote: clean(input.transportNote) as never, arrivalInstructions: clean(input.arrivalInstructions) as never }
    const event = await loadEvent(tx, eventId)
    terminalGuard(event)
    const current = await resolveEventTargetIds(tx, eventId)
    const snapshot = await this.authority.snapshot(tx, actorPersonId, now)
    if (!this.authority.canUpdateLogistics(snapshot, { eventId, targetTeamIds: current.teamIds })) {
      throw new AppError("AUTHORITY_DENIED", "You do not have authority to update this event's logistics", "authorization")
    }
    if (input.expectedVersion !== undefined && Number(input.expectedVersion) !== event.version) {
      throw new AppError("OPTIMISTIC_LOCK_FAILURE", "The event changed since you loaded it", "conflict")
    }
    const provided = Object.values(input).filter((value) => value !== undefined)
    if (provided.length === 0 || provided.every((value) => value === null)) {
      throw new AppError("VALIDATION_FAILED", "At least one logistics field must be provided", "domain_validation", false, { logistics: ["required"] })
    }
    const patch: EventPatch = { logistics: { meetingAt: input.meetingAt, departureAt: input.departureAt, meetingPoint: input.meetingPoint, transportNote: input.transportNote, arrivalInstructions: input.arrivalInstructions } }
    if (Object.values(patch.logistics!).every((value) => value === undefined)) {
      throw new AppError("VALIDATION_FAILED", "At least one logistics field must be provided", "domain_validation", false, { logistics: ["required"] })
    }
    return this.applyEventPatch(tx, actorPersonId, event, patch, now, source, { expectedVersion: input.expectedVersion })
  }

}
