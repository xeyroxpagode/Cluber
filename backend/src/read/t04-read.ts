import type { Transaction } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import { AppError } from "../shared/errors.js"
import { AuthorityService, type AuthoritySnapshot } from "../authority/authority.js"
import { ParticipationService, type SelectionConflict } from "../participation/participation.js"
import {
  resolveEventRoster,
  resolveEventStaff,
  resolveEventTargets,
  resolveParticipationAudience,
} from "../participation/roster.js"

/**
 * T04 R3 — T04ReadService.
 *
 * Read contracts de participación:
 *  - RC-17 AvailabilitySummary (COACH de equipo).
 *  - RC-15 SelectionDetail (COACH de equipo).
 *  - RC-16 MatchRecordDetail (COACH de equipo).
 *  - PLAYER OwnSelectionStatus (proyección segura: nunca expone DRAFT).
 *  - Contexto de participación para RC-03 (disponibilidad propia y asistencia del coach).
 *
 * PII: sólo identidad básica (nombre). Sin documento, contacto ni datos de salud.
 */

export type AvailabilityState = "YES" | "MAYBE" | "NO" | "NO_RESPONSE" | "NEEDS_RECONFIRMATION"

function iso(value: Date | string | null | undefined): string | null {
  if (!value) return null
  return new Date(value).toISOString()
}

export class T04ReadService {
  constructor(
    private readonly authority = new AuthorityService(),
    private readonly participation = new ParticipationService(),
  ) {}

  private assertCoachScope(snapshot: AuthoritySnapshot, eventId: string, teamIds: readonly string[]): void {
    if (snapshot.eventScopeIds.includes(eventId)) return
    if (teamIds.some((teamId) => snapshot.coachTeamIds.includes(teamId))) return
    throw new AppError("AUTHORITY_DENIED", "You do not have authority for this team", "authorization")
  }

  private async loadEvent(tx: Transaction<DatabaseSchema>, eventId: string) {
    const event = await tx.selectFrom("app.events").selectAll().where("id", "=", eventId).executeTakeFirst()
    if (!event) throw new AppError("EVENT_NOT_FOUND", "Event was not found", "not_found")
    return event
  }

  /** Derivación canónica del estado de disponibilidad. */
  static availabilityState(value: string | null, coordinationRevision: number, eventRevision: number): AvailabilityState {
    if (!value) return "NO_RESPONSE"
    if (coordinationRevision < eventRevision) return "NEEDS_RECONFIRMATION"
    return value as AvailabilityState
  }

  /* ══════════════════════════════════════════════════════════════════════
     RC-17 — AvailabilitySummary
     ══════════════════════════════════════════════════════════════════════ */

  async availabilitySummary(
    tx: Transaction<DatabaseSchema>,
    actorPersonId: string,
    eventId: string,
    now: Date,
    limit = 200,
  ) {
    const event = await this.loadEvent(tx, eventId)
    const targets = await resolveEventTargets(tx, eventId)
    const snapshot = await this.authority.snapshot(tx, actorPersonId, now)
    this.assertCoachScope(snapshot, eventId, targets.teamIds)

    const today = now.toISOString().slice(0, 10)
    const audience = await resolveParticipationAudience(tx, event, now)
    const responses = await tx.selectFrom("app.availability_responses").selectAll().where("event_id", "=", eventId).execute()
    const byPerson = new Map(responses.map((row) => [row.person_id, row]))
    const people = await tx
      .selectFrom("app.people")
      .select(["id", "first_name", "last_name"])
      .where("id", "in", audience.length > 0 ? audience : ["00000000-0000-0000-0000-000000000000"])
      .execute()
    const names = new Map(people.map((row) => [row.id, `${row.first_name} ${row.last_name}`.trim()]))

    // Los conteos se calculan sobre la audiencia completa; la lista se pagina.
    const all = audience.map((personId) => {
      const row = byPerson.get(personId)
      const state = T04ReadService.availabilityState(row?.value ?? null, row?.coordination_revision ?? 0, event.coordination_revision)
      return {
        personId,
        name: names.get(personId) ?? null,
        value: row?.value ?? null,
        state,
        respondedAt: iso(row?.responded_at),
        coordinationRevision: row?.coordination_revision ?? null,
        needsReconfirmation: state === "NEEDS_RECONFIRMATION",
      }
    })
    const counts = { YES: 0, MAYBE: 0, NO: 0, NO_RESPONSE: 0, NEEDS_RECONFIRMATION: 0 }
    for (const item of all) counts[item.state] += 1

    const max = Math.min(Math.max(limit, 1), 500)
    const items = all.slice(0, max)

    return {
      eventId,
      eventState: event.state,
      coordinationRevision: event.coordination_revision,
      counts,
      items,
      total: audience.length,
      itemsTruncated: all.length > items.length,
    }
  }

  /** Respuesta propia del jugador (contexto de participación). */
  async ownAvailability(
    tx: Transaction<DatabaseSchema>,
    actorPersonId: string,
    eventId: string,
    now: Date,
  ) {
    const event = await this.loadEvent(tx, eventId)
    const row = await tx
      .selectFrom("app.availability_responses")
      .selectAll()
      .where("event_id", "=", eventId)
      .where("person_id", "=", actorPersonId)
      .executeTakeFirst()
    const state = T04ReadService.availabilityState(row?.value ?? null, row?.coordination_revision ?? 0, event.coordination_revision)
    return {
      eventId,
      value: row?.value ?? null,
      state,
      respondedAt: iso(row?.responded_at),
      coordinationRevision: row?.coordination_revision ?? null,
      eventCoordinationRevision: event.coordination_revision,
      needsReconfirmation: state === "NEEDS_RECONFIRMATION",
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
     RC-15 — SelectionDetail + CMD-PRT-04 (conflictos derivados)
     ══════════════════════════════════════════════════════════════════════ */

  async selectionDetail(
    tx: Transaction<DatabaseSchema>,
    actorPersonId: string,
    matchId: string,
    now: Date,
  ) {
    const event = await this.loadEvent(tx, matchId)
    if (event.type !== "MATCH") {
      throw new AppError("INVALID_TARGET", "Selection is only available for match events", "domain_validation")
    }
    const targets = await resolveEventTargets(tx, matchId)
    const snapshot = await this.authority.snapshot(tx, actorPersonId, now)
    this.assertCoachScope(snapshot, matchId, targets.teamIds)

    const selection = await tx.selectFrom("app.selections").selectAll().where("match_id", "=", matchId).executeTakeFirst()
    if (!selection) {
      return { selectionId: null, matchId, currentDraft: null, publishedRevisions: [], history: [] }
    }

    const revisions = await tx
      .selectFrom("app.selection_revisions")
      .selectAll()
      .where("selection_id", "=", selection.id)
      .orderBy("created_at", "asc")
      .execute()

    const entriesByRevision = new Map<string, Awaited<ReturnType<typeof this.loadEntries>>>
    for (const revision of revisions) {
      entriesByRevision.set(revision.id, await this.loadEntries(tx, revision.id))
    }

    const describe = async (revision: (typeof revisions)[number]) => {
      const entries = entriesByRevision.get(revision.id) ?? []
      const conflicts: SelectionConflict[] = await this.participation.deriveConflicts(tx, matchId, entries)
      return {
        revisionId: revision.id,
        state: revision.state,
        autosaveVersion: revision.autosave_version,
        publishedAt: iso(revision.published_at),
        publishedBy: revision.published_by_person_id,
        entries: entries.map((entry) => ({
          personId: entry.person_id,
          role: entry.role,
          order: entry.order,
          conflicts: conflicts.filter((conflict) => conflict.personId === entry.person_id),
        })),
        conflicts,
      }
    }

    const draft = revisions.find((revision) => revision.state === "DRAFT") ?? null
    const published = revisions.filter((revision) => revision.state === "PUBLISHED")
    const publishedRevisions = []
    for (const revision of published) publishedRevisions.push(await describe(revision))

    const history: Array<{ revisionId: string; publishedAt: string | null; added: string[]; removed: string[]; changed: string[] }> = []
    let previousEntries: string[] = []
    for (const revision of publishedRevisions) {
      const current = revision.entries.filter((entry) => entry.role === "SELECTED").map((entry) => entry.personId)
      const added = current.filter((personId) => !previousEntries.includes(personId))
      const removed = previousEntries.filter((personId) => !current.includes(personId))
      history.push({
        revisionId: revision.revisionId,
        publishedAt: revision.publishedAt,
        added,
        removed,
        changed: current.filter((personId) => previousEntries.includes(personId) && !added.includes(personId) && !removed.includes(personId)),
      })
      previousEntries = current
    }

    return {
      selectionId: selection.id,
      matchId,
      currentDraft: draft ? await describe(draft) : null,
      publishedRevisions,
      history,
    }
  }

  /** CMD-PRT-04 — sólo conflictos derivados. */
  async selectionConflicts(
    tx: Transaction<DatabaseSchema>,
    actorPersonId: string,
    matchId: string,
    now: Date,
  ) {
    const detail = await this.selectionDetail(tx, actorPersonId, matchId, now)
    const revision = detail.currentDraft ?? detail.publishedRevisions.at(-1) ?? null
    return {
      matchId,
      revisionId: revision?.revisionId ?? null,
      state: revision?.state ?? null,
      conflicts: revision?.conflicts ?? [],
      entries: revision?.entries ?? [],
    }
  }

  private async loadEntries(tx: Transaction<DatabaseSchema>, revisionId: string) {
    return tx.selectFrom("app.selection_entries").selectAll().where("revision_id", "=", revisionId).orderBy("order", "asc").execute()
  }

  /** PLAYER — proyección segura: sólo la última publicación, nunca el DRAFT. */
  async playerSelectionStatus(
    tx: Transaction<DatabaseSchema>,
    actorPersonId: string,
    matchId: string,
    now: Date,
  ) {
    const event = await this.loadEvent(tx, matchId)
    if (event.type !== "MATCH") {
      throw new AppError("INVALID_TARGET", "Selection is only available for match events", "domain_validation")
    }
    const snapshot = await this.authority.snapshot(tx, actorPersonId, now)
    if (!snapshot.roles.includes("PLAYER")) {
      throw new AppError("AUTHORITY_DENIED", "Only a player can consult a selection status", "authorization")
    }
    const audience = await resolveParticipationAudience(tx, event, now)
    if (!audience.includes(actorPersonId)) {
      throw new AppError("EVENT_NOT_FOUND", "Event was not found", "not_found")
    }
    const selection = await tx.selectFrom("app.selections").selectAll().where("match_id", "=", matchId).executeTakeFirst()
    if (!selection) {
      return { matchId, status: "NOT_SELECTED", order: null, publishedAt: null, revisionId: null }
    }
    const published = await tx
      .selectFrom("app.selection_revisions")
      .selectAll()
      .where("selection_id", "=", selection.id)
      .where("state", "=", "PUBLISHED")
      .orderBy("published_at", "desc")
      .executeTakeFirst()
    if (!published) {
      return { matchId, status: "NOT_SELECTED", order: null, publishedAt: null, revisionId: null }
    }
    const entry = await tx
      .selectFrom("app.selection_entries")
      .selectAll()
      .where("revision_id", "=", published.id)
      .where("person_id", "=", actorPersonId)
      .executeTakeFirst()
    if (!entry) {
      return { matchId, status: "NOT_SELECTED", order: null, publishedAt: iso(published.published_at), revisionId: published.id }
    }
    return {
      matchId,
      status: entry.role,
      order: entry.order,
      publishedAt: iso(published.published_at),
      revisionId: published.id,
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
     RC-16 — MatchRecordDetail
     ══════════════════════════════════════════════════════════════════════ */

  async matchRecordDetail(
    tx: Transaction<DatabaseSchema>,
    actorPersonId: string,
    matchId: string,
    now: Date,
  ) {
    const event = await this.loadEvent(tx, matchId)
    if (event.type !== "MATCH") {
      throw new AppError("INVALID_TARGET", "Match record is only available for match events", "domain_validation")
    }
    const targets = await resolveEventTargets(tx, matchId)
    const snapshot = await this.authority.snapshot(tx, actorPersonId, now)
    this.assertCoachScope(snapshot, matchId, targets.teamIds)

    const record = await tx.selectFrom("app.match_records").selectAll().where("match_id", "=", matchId).executeTakeFirst()
    if (!record) {
      return {
        matchRecordId: null,
        matchId,
        state: null,
        event: { id: event.id, state: event.state, version: event.version, coordinationRevision: event.coordination_revision },
        playerStats: [],
        corrections: [],
      }
    }
    const stats = await tx.selectFrom("app.player_match_stats").selectAll().where("match_record_id", "=", record.id).execute()
    const roster = await resolveEventRoster(tx, matchId, now)
    const names = new Map(roster.map((member) => [member.personId, `${member.firstName} ${member.lastName}`.trim()]))
    const corrections = await tx
      .selectFrom("app.matchrecord_corrections")
      .selectAll()
      .where("match_record_id", "=", record.id)
      .orderBy("corrected_at", "desc")
      .execute()

    return {
      matchRecordId: record.id,
      matchId,
      state: record.state,
      resultType: record.result_type,
      homeScore: record.home_score,
      awayScore: record.away_score,
      observations: record.observations,
      finalizedAt: iso(record.finalized_at),
      finalizedBy: record.finalized_by_person_id,
      correctedAt: iso(record.corrected_at),
      correctedBy: record.corrected_by_person_id,
      correctionReason: record.correction_reason,
      previousResultType: record.previous_result_type,
      previousHomeScore: record.previous_home_score,
      previousAwayScore: record.previous_away_score,
      previousObservations: record.previous_observations,
      event: { id: event.id, state: event.state, version: event.version, coordinationRevision: event.coordination_revision },
      playerStats: stats.map((row) => ({
        personId: row.person_id,
        name: names.get(row.person_id) ?? null,
        minutesPlayed: row.minutes_played,
        goals: row.goals,
        assists: row.assists,
        yellowCards: row.yellow_cards,
        redCards: row.red_cards,
        mvp: row.mvp,
      })),
      corrections: corrections.map((row) => ({
        id: row.id,
        previousResultType: row.previous_result_type,
        newResultType: row.new_result_type,
        previousHomeScore: row.previous_home_score,
        newHomeScore: row.new_home_score,
        previousAwayScore: row.previous_away_score,
        newAwayScore: row.new_away_score,
        previousObservations: row.previous_observations,
        newObservations: row.new_observations,
        correctionReason: row.correction_reason,
        correctedAt: iso(row.corrected_at),
        correctedBy: row.corrected_by_person_id,
      })),
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
     Asistencia (lectura de negocio para el coach, integrada en RC-03)
     ══════════════════════════════════════════════════════════════════════ */

  async attendanceDetail(
    tx: Transaction<DatabaseSchema>,
    actorPersonId: string,
    eventId: string,
    now: Date,
  ) {
    const event = await this.loadEvent(tx, eventId)
    if (event.type !== "TRAINING" && event.type !== "MATCH") {
      throw new AppError("EVENT_TYPE_INVALID", "Attendance is only available for training and match events", "domain_validation")
    }
    const targets = await resolveEventTargets(tx, eventId)
    const snapshot = await this.authority.snapshot(tx, actorPersonId, now)
    this.assertCoachScope(snapshot, eventId, targets.teamIds)

    const roster = await resolveEventRoster(tx, eventId, now)
    const sheet = await tx.selectFrom("app.attendance_sheets").selectAll().where("event_id", "=", eventId).executeTakeFirst()
    const entries = sheet
      ? await tx.selectFrom("app.attendance_entries").selectAll().where("sheet_id", "=", sheet.id).execute()
      : []
    const byPerson = new Map(entries.map((entry) => [entry.person_id, entry]))
    const corrections = entries.length > 0
      ? await tx.selectFrom("app.attendance_corrections").selectAll().where("entry_id", "in", entries.map((entry) => entry.id)).orderBy("corrected_at", "desc").execute()
      : []
    const correctionsByEntry = new Map<string, typeof corrections>()
    for (const correction of corrections) {
      const list = correctionsByEntry.get(correction.entry_id) ?? []
      list.push(correction)
      correctionsByEntry.set(correction.entry_id, list)
    }

    const counts = { PRESENT: 0, ABSENT: 0, JUSTIFIED: 0, UNRECORDED: 0 }
    const items = roster.map((member) => {
      const entry = byPerson.get(member.personId)
      const state = entry?.value ?? "UNRECORDED"
      counts[state as keyof typeof counts] += 1
      return {
        personId: member.personId,
        name: `${member.firstName} ${member.lastName}`.trim(),
        entryId: entry?.id ?? null,
        value: entry?.value ?? null,
        state,
        recordedAt: iso(entry?.recorded_at),
        correctedAt: iso(entry?.corrected_at),
        correctionReason: entry?.correction_reason ?? null,
        previousValue: entry?.previous_value ?? null,
        corrections: (entry ? correctionsByEntry.get(entry.id) ?? [] : []).map((correction) => ({
          id: correction.id,
          previousValue: correction.previous_value,
          newValue: correction.new_value,
          correctionReason: correction.correction_reason,
          correctedAt: iso(correction.corrected_at),
          correctedBy: correction.corrected_by_person_id,
        })),
      }
    })

    return {
      eventId,
      sheetId: sheet?.id ?? null,
      state: sheet?.closed_at ? "CLOSED" : "OPEN",
      closedAt: iso(sheet?.closed_at),
      closedBy: sheet?.closed_by_person_id ?? null,
      counts,
      items,
      staff: await resolveEventStaff(tx, targets.teamIds, now),
    }
  }

  /** Contexto de participación para RC-03 (extensión additive de T03). */
  async participationContext(
    tx: Transaction<DatabaseSchema>,
    actorPersonId: string,
    eventId: string,
    now: Date,
  ) {
    const event = await this.loadEvent(tx, eventId)
    const targets = await resolveEventTargets(tx, eventId)
    const snapshot = await this.authority.snapshot(tx, actorPersonId, now)
    const isCoach = snapshot.eventScopeIds.includes(eventId) || targets.teamIds.some((teamId) => snapshot.coachTeamIds.includes(teamId))
    const own = await this.ownAvailability(tx, actorPersonId, eventId, now)
    let attendance: unknown = null
    if (isCoach && (event.type === "TRAINING" || event.type === "MATCH")) {
      attendance = await this.attendanceDetail(tx, actorPersonId, eventId, now)
    }
    return { ownAvailability: own, attendance }
  }
}
