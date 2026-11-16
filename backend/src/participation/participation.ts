import { randomUUID } from "node:crypto"
import type { Transaction } from "kysely"
import type { DatabaseSchema, EventTable } from "../db/types.js"
import { AppError } from "../shared/errors.js"
import { AuthorityService, type AuthoritySnapshot } from "../authority/authority.js"
import { AuditWriter } from "../audit/audit.js"
import { NotificationService } from "../notification/notification.js"
import { OutboxWriter } from "../shared/outbox.js"
import {
  eventLocalDate,
  requireEvent,
  resolveEventRoster,
  resolveEventStaff,
  resolveEventTargets,
  resolveParticipationAudience,
  resolveTeamAffiliatedPersons,
} from "./roster.js"

/**
 * T04 R3 — ParticipationService.
 *
 * Un único servicio para DG-09 (Availability), DG-10 (Selection), DG-11 (Attendance)
 * y DG-12 (MatchRecord). Cada comando corre dentro de UNA transacción provista por
 * el llamador (TransactionRunner) y escribe auditoría, notificaciones y outbox en la
 * misma transacción (INV-10 / §08 del contrato: sin dual-write).
 *
 * COR-01 — toda operación reservada a COACH exige un grant COACH efectivo y con el
 * scope correcto (TEAM propio o EVENT propio). CAPTAIN, ADMIN y SUBCOMMITTEE no
 * heredan autoridad de COACH.
 */

export type AvailabilityValue = "YES" | "MAYBE" | "NO"
export type AttendanceValue = "PRESENT" | "ABSENT" | "JUSTIFIED"
export type SelectionRole = "SELECTED" | "ALTERNATE"
export type MatchResultType = "PLAYED" | "FORFEIT" | "ABANDONED"
export type ConflictCode = "NO_LONGER_EVENT_TARGET" | "NO_LONGER_TEAM_AFFILIATED"

export interface SelectionEntryInput {
  personId: string
  role: SelectionRole
  order?: number | null
}

export interface PlayerStatsInput {
  minutesPlayed?: number | null
  goals?: number | null
  assists?: number | null
  yellowCards?: number | null
  redCards?: number | null
  mvp?: boolean | null
}

export interface MatchRecordCorrectionInput {
  resultType?: MatchResultType
  homeScore?: number | null
  awayScore?: number | null
  observations?: string | null
  correctionReason: string
}

export interface SelectionConflict {
  personId: string
  code: ConflictCode
  reason: string
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function requireUuid(value: unknown, field: string): string {
  const text = String(value ?? "").trim()
  if (!UUID.test(text)) {
    throw new AppError("VALIDATION_FAILED", `${field} must be a UUID`, "domain_validation", false, { [field]: ["invalid"] })
  }
  return text
}

function requireEnum<T extends string>(value: unknown, field: string, allowed: readonly T[]): T {
  const text = String(value ?? "").trim() as T
  if (!allowed.includes(text)) {
    throw new AppError("VALIDATION_FAILED", `${field} is invalid`, "domain_validation", false, { [field]: ["invalid"] })
  }
  return text
}

function requireReason(value: unknown, field = "correctionReason"): string {
  const text = String(value ?? "").trim()
  if (!text) {
    throw new AppError("VALIDATION_FAILED", `${field} is required`, "domain_validation", false, { [field]: ["required"] })
  }
  return text.slice(0, 1000)
}

function optionalScore(value: unknown, field: string): number | null {
  if (value === undefined || value === null) return null
  const score = Number(value)
  if (!Number.isInteger(score) || score < 0) {
    throw new AppError("VALIDATION_FAILED", `${field} must be a non-negative integer`, "domain_validation", false, { [field]: ["invalid"] })
  }
  return score
}

function optionalNonNegativeInt(value: unknown, field: string): number | null {
  if (value === undefined || value === null) return null
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new AppError("VALIDATION_FAILED", `${field} must be a non-negative integer`, "domain_validation", false, { [field]: ["invalid"] })
  }
  return parsed
}

export class ParticipationService {
  constructor(
    private readonly authority = new AuthorityService(),
    private readonly audit = new AuditWriter(),
    private readonly notifications = new NotificationService(),
    private readonly outbox = new OutboxWriter(),
  ) {}

  /* ══════════════════════════════════════════════════════════════════════
     Autoridad (COR-01)
     ══════════════════════════════════════════════════════════════════════ */

  /** COACH-only: grant COACH vigente con scope TEAM propio o EVENT propio. */
  private assertCoachScope(snapshot: AuthoritySnapshot, eventId: string, teamIds: readonly string[]): void {
    if (snapshot.eventScopeIds.includes(eventId)) return
    if (teamIds.some((teamId) => snapshot.coachTeamIds.includes(teamId))) return
    throw new AppError("AUTHORITY_DENIED", "You do not have authority for this team", "authorization")
  }

  /** COACH-only con equipo explícito: ningún otro rol ni otro equipo habilita la operación. */
  private assertCoachTeam(snapshot: AuthoritySnapshot, teamId: string): void {
    if (!snapshot.coachTeamIds.includes(teamId)) {
      throw new AppError("AUTHORITY_DENIED", "You do not have authority for this team", "authorization")
    }
  }

  private async coachSnapshot(tx: Transaction<DatabaseSchema>, actorPersonId: string, now: Date): Promise<AuthoritySnapshot> {
    return this.authority.snapshot(tx, actorPersonId, now)
  }

  /** Membership activa (precondición de CMD-PRT-01 en el contrato funcional). */
  private async hasActiveMembership(tx: Transaction<DatabaseSchema>, personId: string, today: string): Promise<boolean> {
    const from = new Date(today)
    const row = await tx
      .selectFrom("app.memberships")
      .select("id")
      .where("person_id", "=", personId)
      .where("valid_from", "<=", from)
      .where((eb) => eb.or([eb("valid_until", "is", null), eb("valid_until", ">", from)]))
      .executeTakeFirst()
    return Boolean(row)
  }

  /**
   * Guard de evento terminal (INV-06): los estados terminales sobreviven a los registros
   * históricos de participación, pero no admiten nuevas mutaciones de convocatoria,
   * asistencia ni acta.
   */
  private assertEventMutable(event: EventTable): void {
    if (["CANCELLED", "COMPLETED", "ABANDONED"].includes(event.state)) {
      throw new AppError("EVENT_TERMINAL", "This operation is not allowed on a terminal event", "conflict")
    }
  }

  /** Guard de registro de asistencia: sólo con el evento programado o en curso. */
  private assertAttendanceWritable(event: EventTable): void {
    if (!["SCHEDULED", "IN_PROGRESS"].includes(event.state)) {
      throw new AppError("EVENT_NOT_SCHEDULED", "Attendance can only be recorded while the event is scheduled or in progress", "conflict")
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
     DG-09 — Availability (CMD-PRT-01)
     ══════════════════════════════════════════════════════════════════════ */

  async respondAvailability(
    tx: Transaction<DatabaseSchema>,
    actorPersonId: string,
    input: { eventId: string; value: AvailabilityValue; observedCoordinationRevision: number },
    now: Date,
    source = "CMD-PRT-01",
  ) {
    const eventId = requireUuid(input.eventId, "eventId")
    const value = requireEnum<AvailabilityValue>(input.value, "value", ["YES", "MAYBE", "NO"])
    const observed = Number(input.observedCoordinationRevision)
    if (!Number.isInteger(observed) || observed < 0) {
      throw new AppError("VALIDATION_FAILED", "observedCoordinationRevision is required", "domain_validation", false, { observedCoordinationRevision: ["invalid"] })
    }

    const event = await requireEvent(tx, eventId, true)
    if (event.state !== "SCHEDULED") {
      throw new AppError("EVENT_NOT_SCHEDULED", "Availability can only be answered for scheduled events", "conflict")
    }
    const today = now.toISOString().slice(0, 10)
    const snapshot = await this.coachSnapshot(tx, actorPersonId, now)
    if (!snapshot.roles.includes("PLAYER")) {
      throw new AppError("NOT_OWN_RESPONSE", "Only a player can answer availability", "authorization")
    }
    if (!(await this.hasActiveMembership(tx, actorPersonId, today))) {
      throw new AppError("AUTHORITY_DENIED", "An active club membership is required to answer availability", "authorization")
    }
    const audience = await resolveParticipationAudience(tx, event, now)
    if (!audience.includes(actorPersonId)) {
      throw new AppError("NOT_OWN_RESPONSE", "You are not part of this event's audience", "authorization")
    }
    // CAS: nunca se registra silenciosamente una revisión que el jugador no observó.
    if (observed !== event.coordination_revision) {
      throw new AppError("OPTIMISTIC_LOCK_FAILURE", "The event changed since you loaded it", "conflict")
    }

    const existing = await tx
      .selectFrom("app.availability_responses")
      .selectAll()
      .where("event_id", "=", eventId)
      .where("person_id", "=", actorPersonId)
      .executeTakeFirst()

    const upserted = await tx
      .insertInto("app.availability_responses")
      .values({
        id: randomUUID(),
        event_id: eventId,
        person_id: actorPersonId,
        value,
        coordination_revision: event.coordination_revision,
        responded_at: now,
        created_at: now,
      })
      .onConflict((oc) => oc.columns(["event_id", "person_id"]).doUpdateSet({
        value,
        coordination_revision: event.coordination_revision,
      }))
      .returningAll()
      .executeTakeFirstOrThrow()

    await this.audit.record(tx, {
      actorPersonId,
      action: "AVAILABILITY_RESPONDED",
      targetType: "Availability",
      targetId: upserted.id,
      source,
      diff: {
        eventId,
        value,
        previousValue: existing?.value ?? null,
        coordinationRevision: event.coordination_revision,
        previousCoordinationRevision: existing?.coordination_revision ?? null,
      },
    })

    return {
      responded: true,
      value: upserted.value,
      coordinationRevision: upserted.coordination_revision,
      respondedAt: new Date(upserted.responded_at).toISOString(),
      needsReconfirmation: false,
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
     DG-10 — Selection (CMD-PRT-02/03/04)
     ══════════════════════════════════════════════════════════════════════ */

  private async loadSelectionForMatch(tx: Transaction<DatabaseSchema>, matchId: string, forUpdate = false) {
    let query = tx.selectFrom("app.selections").selectAll().where("match_id", "=", matchId)
    if (forUpdate) query = query.forUpdate()
    const selection = await query.executeTakeFirst()
    if (!selection) throw new AppError("SELECTION_NOT_FOUND", "Selection was not found", "not_found")
    return selection
  }

  private async requireMatchEvent(tx: Transaction<DatabaseSchema>, matchId: string, forUpdate = false): Promise<EventTable> {
    const event = await requireEvent(tx, matchId, forUpdate)
    if (event.type !== "MATCH") {
      throw new AppError("INVALID_TARGET", "Selection is only available for match events", "domain_validation", false, { type: ["match_required"] })
    }
    return event
  }

  /** Deriva los dos conflictos canónicos. NO_RESPONSE es información operativa, no un conflicto. */
  async deriveConflicts(
    tx: Transaction<DatabaseSchema>,
    eventId: string,
    entries: readonly { personId?: string; person_id?: string }[],
  ): Promise<SelectionConflict[]> {
    const event = await requireEvent(tx, eventId)
    const reference = new Date()
    const targets = await resolveEventTargets(tx, eventId)
    const affiliated = new Set(await resolveTeamAffiliatedPersons(tx, targets.teamIds, eventLocalDate(event, reference)))
    const personTargets = new Set(targets.personIds)
    // Afiliación histórica (cualquier período): distingue "dejó el equipo" de "nunca fue del evento".
    const pastAffiliations = new Set<string>()
    if (targets.teamIds.length > 0) {
      const history = await tx
        .selectFrom("app.team_assignments")
        .select("person_id")
        .where("team_id", "in", [...targets.teamIds])
        .execute()
      for (const row of history) pastAffiliations.add(row.person_id)
    }
    const conflicts: SelectionConflict[] = []
    for (const entry of entries) {
      const personId = entry.personId ?? entry.person_id ?? ""
      if (affiliated.has(personId)) continue
      if (personTargets.has(personId) || pastAffiliations.has(personId)) {
        conflicts.push({ personId, code: "NO_LONGER_TEAM_AFFILIATED", reason: "Ya no pertenece al equipo" })
        continue
      }
      conflicts.push({ personId, code: "NO_LONGER_EVENT_TARGET", reason: "Ya no es destino del evento" })
    }
    return conflicts
  }

  async updateSelectionDraft(
    tx: Transaction<DatabaseSchema>,
    actorPersonId: string,
    input: { matchId: string; entries: SelectionEntryInput[]; autosaveVersion: number },
    now: Date,
    source = "CMD-PRT-02",
  ) {
    const matchId = requireUuid(input.matchId, "matchId")
    const autosaveVersion = Number(input.autosaveVersion)
    if (!Number.isInteger(autosaveVersion) || autosaveVersion < 0) {
      throw new AppError("VALIDATION_FAILED", "autosaveVersion is required", "domain_validation", false, { autosaveVersion: ["invalid"] })
    }
    const entries = (input.entries ?? []).map((entry) => ({
      personId: requireUuid(entry.personId, "personId"),
      role: requireEnum<SelectionRole>(entry.role, "role", ["SELECTED", "ALTERNATE"]),
      order: entry.order === undefined || entry.order === null ? null : Number(entry.order),
    }))
    const seen = new Set<string>()
    for (const entry of entries) {
      if (seen.has(entry.personId)) {
        throw new AppError("VALIDATION_FAILED", "A person can only appear once in a selection", "domain_validation", false, { entries: ["duplicate_person"] })
      }
      seen.add(entry.personId)
    }

    const event = await this.requireMatchEvent(tx, matchId)
    const targets = await resolveEventTargets(tx, matchId)
    const snapshot = await this.coachSnapshot(tx, actorPersonId, now)
    this.assertCoachScope(snapshot, matchId, targets.teamIds)
    this.assertEventMutable(event)

    if (entries.length > 0) {
      const people = await tx.selectFrom("app.people").select("id").where("id", "in", entries.map((entry) => entry.personId)).execute()
      if (people.length !== new Set(entries.map((entry) => entry.personId)).size) {
        throw new AppError("PERSON_NOT_FOUND", "One or more selected people do not exist", "not_found")
      }
    }

    // Lock order: selections -> selection_revisions.
    let selection = await tx.selectFrom("app.selections").selectAll().where("match_id", "=", matchId).forUpdate().executeTakeFirst()
    if (!selection) {
      selection = await tx.insertInto("app.selections")
        .values({ id: randomUUID(), match_id: matchId, current_draft_revision_id: null, created_at: now, updated_at: now })
        .returningAll()
        .executeTakeFirstOrThrow()
    }

    let revision = selection.current_draft_revision_id
      ? await tx.selectFrom("app.selection_revisions").selectAll().where("id", "=", selection.current_draft_revision_id).forUpdate().executeTakeFirst()
      : null
    if (!revision || revision.state !== "DRAFT") {
      revision = await tx.insertInto("app.selection_revisions")
        .values({ id: randomUUID(), selection_id: selection.id, state: "DRAFT", published_at: null, published_by_person_id: null, autosave_version: 0, created_at: now, updated_at: now })
        .returningAll()
        .executeTakeFirstOrThrow()
      await tx.updateTable("app.selections").set({ current_draft_revision_id: revision.id, updated_at: now }).where("id", "=", selection.id).execute()
    }

    if (revision.autosave_version !== autosaveVersion) {
      throw new AppError("OPTIMISTIC_LOCK_FAILURE", "The selection draft changed since you loaded it", "conflict")
    }

    await tx.deleteFrom("app.selection_entries").where("revision_id", "=", revision.id).execute()
    for (const entry of entries) {
      await tx.insertInto("app.selection_entries").values({
        id: randomUUID(),
        revision_id: revision.id,
        person_id: entry.personId,
        role: entry.role,
        order: entry.order,
        created_at: now,
      }).execute()
    }

    const updated = await tx
      .updateTable("app.selection_revisions")
      .set({ autosave_version: revision.autosave_version + 1, updated_at: now })
      .where("id", "=", revision.id)
      .returningAll()
      .executeTakeFirstOrThrow()

    await this.audit.record(tx, {
      actorPersonId,
      action: "SELECTION_DRAFT_UPDATED",
      targetType: "Selection",
      targetId: selection.id,
      source,
      diff: { revisionId: revision.id, autosaveVersion: updated.autosave_version, entryCount: entries.length },
    })

    return {
      revisionId: updated.id,
      autosaveVersion: updated.autosave_version,
      entries: entries.map((entry) => ({ personId: entry.personId, role: entry.role, order: entry.order })),
      eventId: event.id,
    }
  }

  async publishSelection(
    tx: Transaction<DatabaseSchema>,
    actorPersonId: string,
    input: { matchId: string },
    now: Date,
    source = "CMD-PRT-03",
  ) {
    const matchId = requireUuid(input.matchId, "matchId")
    const event = await this.requireMatchEvent(tx, matchId)
    const targets = await resolveEventTargets(tx, matchId)
    const snapshot = await this.coachSnapshot(tx, actorPersonId, now)
    this.assertCoachScope(snapshot, matchId, targets.teamIds)
    this.assertEventMutable(event)

    const selection = await this.loadSelectionForMatch(tx, matchId, true)
    const draft = selection.current_draft_revision_id
      ? await tx.selectFrom("app.selection_revisions").selectAll().where("id", "=", selection.current_draft_revision_id).forUpdate().executeTakeFirst()
      : null
    if (!draft || draft.state !== "DRAFT") {
      throw new AppError("DRAFT_INVALID", "There is no draft to publish", "conflict")
    }
    const draftEntries = await tx.selectFrom("app.selection_entries").selectAll().where("revision_id", "=", draft.id).execute()
    if (draftEntries.length === 0) {
      throw new AppError("DRAFT_INVALID", "The draft has no entries", "conflict")
    }

    const previous = await tx
      .selectFrom("app.selection_revisions")
      .selectAll()
      .where("selection_id", "=", selection.id)
      .where("state", "=", "PUBLISHED")
      .orderBy("published_at", "desc")
      .executeTakeFirst()
    const previousEntries = previous
      ? await tx.selectFrom("app.selection_entries").selectAll().where("revision_id", "=", previous.id).execute()
      : []

    const conflicts = await this.deriveConflicts(tx, matchId, draftEntries)

    const published = await tx
      .updateTable("app.selection_revisions")
      .set({ state: "PUBLISHED", published_at: now, published_by_person_id: actorPersonId, updated_at: now })
      .where("id", "=", draft.id)
      .returningAll()
      .executeTakeFirstOrThrow()

    await tx.updateTable("app.selections").set({ current_draft_revision_id: null, updated_at: now }).where("id", "=", selection.id).execute()

    await this.audit.record(tx, {
      actorPersonId,
      action: "SELECTION_PUBLISHED",
      targetType: "Selection",
      targetId: selection.id,
      source,
      diff: {
        revisionId: published.id,
        matchId,
        entries: draftEntries.map((entry) => ({ personId: entry.person_id, role: entry.role, order: entry.order })),
        conflicts: conflicts.map((conflict) => ({ personId: conflict.personId, code: conflict.code })),
      },
    })

    // NOT-06 — audiencia: seleccionados nuevos + removidos + staff del equipo.
    const previousByPerson = new Map(previousEntries.map((entry) => [entry.person_id, entry]))
    const selectedNow = draftEntries.filter((entry) => entry.role === "SELECTED" && previousByPerson.get(entry.person_id)?.role !== "SELECTED").map((entry) => entry.person_id)
    const removedNow = previousEntries
      .filter((entry) => {
        const current = draftEntries.find((candidate) => candidate.person_id === entry.person_id)
        return !current || current.role !== "SELECTED"
      })
      .map((entry) => entry.person_id)
    const staff = await resolveEventStaff(tx, targets.teamIds, now)
    const recipients = Array.from(new Set([...selectedNow, ...removedNow, ...staff]))

    for (const recipientPersonId of recipients) {
      const recorded = await this.notifications.record(tx, {
        recipientPersonId,
        type: "SELECTION_PUBLISHED",
        resourceType: "SELECTION",
        resourceId: selection.id,
        originEventId: matchId,
        revisionId: published.id,
        title: "Convocatoria publicada",
        body: `Se publicó la convocatoria de "${event.title}".`,
        occurredAt: now,
      })
      if (recorded.wasDuplicate) continue
      await this.outbox.enqueue(tx, {
        topic: "notification.created",
        aggregateType: "Notification",
        aggregateId: recorded.id,
        payload: {
          schemaVersion: 1,
          event: "notification.created",
          recipients: [recipientPersonId],
          resourceType: "SELECTION",
          resourceId: selection.id,
          revision: published.autosave_version,
          invalidate: ["selection", "calendar"],
        },
      })
    }

    return {
      revisionId: published.id,
      publishedAt: new Date(published.published_at ?? now).toISOString(),
      publishedBy: actorPersonId,
      conflicts,
      notifiedRecipients: recipients.length,
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
     DG-11 — Attendance (CMD-PRT-05/06/07)
     ══════════════════════════════════════════════════════════════════════ */

  private async loadSheetForEvent(tx: Transaction<DatabaseSchema>, eventId: string, forUpdate = false) {
    let query = tx.selectFrom("app.attendance_sheets").selectAll().where("event_id", "=", eventId)
    if (forUpdate) query = query.forUpdate()
    return query.executeTakeFirst()
  }

  private async requireSheet(tx: Transaction<DatabaseSchema>, eventId: string, forUpdate = false) {
    const sheet = await this.loadSheetForEvent(tx, eventId, forUpdate)
    if (!sheet) throw new AppError("SHEET_NOT_FOUND", "Attendance sheet was not found", "not_found")
    return sheet
  }

  async recordAttendance(
    tx: Transaction<DatabaseSchema>,
    actorPersonId: string,
    input: { eventId: string; personId: string; value: AttendanceValue },
    now: Date,
    source = "CMD-PRT-05",
  ) {
    const eventId = requireUuid(input.eventId, "eventId")
    const personId = requireUuid(input.personId, "personId")
    const value = requireEnum<AttendanceValue>(input.value, "value", ["PRESENT", "ABSENT", "JUSTIFIED"])

    const event = await requireEvent(tx, eventId)
    if (event.type !== "TRAINING" && event.type !== "MATCH") {
      throw new AppError("EVENT_TYPE_INVALID", "Attendance is only available for training and match events", "domain_validation")
    }
    const targets = await resolveEventTargets(tx, eventId)
    const snapshot = await this.coachSnapshot(tx, actorPersonId, now)
    this.assertCoachScope(snapshot, eventId, targets.teamIds)
    this.assertAttendanceWritable(event)

    const roster = await resolveEventRoster(tx, eventId, now)
    if (!roster.some((member) => member.personId === personId)) {
      throw new AppError("PERSON_NOT_IN_ROSTER", "That person is not part of this event's roster", "conflict")
    }

    let sheet = await this.loadSheetForEvent(tx, eventId, true)
    if (!sheet) {
      sheet = await tx.insertInto("app.attendance_sheets")
        .values({ id: randomUUID(), event_id: eventId, closed_at: null, closed_by_person_id: null, created_at: now })
        .returningAll()
        .executeTakeFirstOrThrow()
    }
    if (sheet.closed_at) {
      throw new AppError("SHEET_CLOSED", "The attendance sheet is closed", "conflict")
    }

    const existing = await tx.selectFrom("app.attendance_entries").selectAll().where("sheet_id", "=", sheet.id).where("person_id", "=", personId).executeTakeFirst()
    const entry = await tx
      .insertInto("app.attendance_entries")
      .values({
        id: existing?.id ?? randomUUID(),
        sheet_id: sheet.id,
        person_id: personId,
        value,
        recorded_at: now,
        recorded_by_person_id: actorPersonId,
        corrected_at: null,
        corrected_by_person_id: null,
        correction_reason: null,
        previous_value: null,
        created_at: now,
        updated_at: now,
      })
      .onConflict((oc) => oc.columns(["sheet_id", "person_id"]).doUpdateSet({
        value,
        recorded_at: now,
        recorded_by_person_id: actorPersonId,
        corrected_at: null,
        corrected_by_person_id: null,
        correction_reason: null,
        previous_value: null,
        updated_at: now,
      }))
      .returningAll()
      .executeTakeFirstOrThrow()

    await this.audit.record(tx, {
      actorPersonId,
      action: "ATTENDANCE_RECORDED",
      targetType: "AttendanceEntry",
      targetId: entry.id,
      source,
      diff: { eventId, personId, value, previousValue: existing?.value ?? null },
    })

    return { entryId: entry.id, value: entry.value, recordedAt: new Date(entry.recorded_at ?? now).toISOString() }
  }

  async closeAttendanceSheet(
    tx: Transaction<DatabaseSchema>,
    actorPersonId: string,
    input: { eventId: string },
    now: Date,
    source = "CMD-PRT-06",
  ) {
    const eventId = requireUuid(input.eventId, "eventId")
    const event = await requireEvent(tx, eventId)
    const targets = await resolveEventTargets(tx, eventId)
    const snapshot = await this.coachSnapshot(tx, actorPersonId, now)
    this.assertCoachScope(snapshot, eventId, targets.teamIds)

    const sheet = await this.loadSheetForEvent(tx, eventId, true) ?? await tx
      .insertInto("app.attendance_sheets")
      .values({ id: randomUUID(), event_id: eventId, closed_at: null, closed_by_person_id: null, created_at: now })
      .returningAll()
      .executeTakeFirstOrThrow()
    if (sheet.closed_at) {
      throw new AppError("SHEET_ALREADY_CLOSED", "The attendance sheet is already closed", "conflict")
    }
    const closed = await tx
      .updateTable("app.attendance_sheets")
      .set({ closed_at: now, closed_by_person_id: actorPersonId })
      .where("id", "=", sheet.id)
      .returningAll()
      .executeTakeFirstOrThrow()

    await this.audit.record(tx, {
      actorPersonId,
      action: "ATTENDANCE_CLOSED",
      targetType: "AttendanceSheet",
      targetId: closed.id,
      source,
      diff: { eventId, closedAt: new Date(closed.closed_at!).toISOString() },
    })

    return { sheetId: closed.id, closedAt: new Date(closed.closed_at!).toISOString(), closedBy: actorPersonId }
  }

  async correctAttendance(
    tx: Transaction<DatabaseSchema>,
    actorPersonId: string,
    input: { eventId: string; entryId?: string | null; personId?: string | null; value: AttendanceValue; correctionReason: string },
    now: Date,
    source = "CMD-PRT-07",
  ) {
    const eventId = requireUuid(input.eventId, "eventId")
    const value = requireEnum<AttendanceValue>(input.value, "value", ["PRESENT", "ABSENT", "JUSTIFIED"])
    const reason = requireReason(input.correctionReason)

    const event = await requireEvent(tx, eventId)
    const targets = await resolveEventTargets(tx, eventId)
    const snapshot = await this.coachSnapshot(tx, actorPersonId, now)
    this.assertCoachScope(snapshot, eventId, targets.teamIds)

    let entry = input.entryId
      ? await tx.selectFrom("app.attendance_entries").selectAll().where("id", "=", input.entryId).forUpdate().executeTakeFirst()
      : null
    if (!entry) {
      // Corrección sobre una persona sin registro previo (UNRECORDED): se crea la
      // entrada vacía para dejar constancia del valor anterior (NULL).
      const personId = requireUuid(input.personId, "personId")
      const sheet = await this.requireSheet(tx, eventId, true)
      const roster = await resolveEventRoster(tx, eventId, now)
      if (!roster.some((member) => member.personId === personId)) {
        throw new AppError("PERSON_NOT_IN_ROSTER", "That person is not part of this event's roster", "conflict")
      }
      const existing = await tx.selectFrom("app.attendance_entries").selectAll().where("sheet_id", "=", sheet.id).where("person_id", "=", personId).forUpdate().executeTakeFirst()
      entry = existing ?? await tx
        .insertInto("app.attendance_entries")
        .values({
          id: randomUUID(),
          sheet_id: sheet.id,
          person_id: personId,
          value: null,
          recorded_at: null,
          recorded_by_person_id: null,
          corrected_at: null,
          corrected_by_person_id: null,
          correction_reason: null,
          previous_value: null,
          created_at: now,
          updated_at: now,
        })
        .returningAll()
        .executeTakeFirstOrThrow()
    }
    const sheet = await tx.selectFrom("app.attendance_sheets").selectAll().where("id", "=", entry.sheet_id).executeTakeFirst()
    if (!sheet || sheet.event_id !== eventId) {
      throw new AppError("ENTRY_NOT_FOUND", "Attendance entry was not found", "not_found")
    }

    const previousValue = entry.value
    const updated = await tx
      .updateTable("app.attendance_entries")
      .set({
        value,
        recorded_at: entry.recorded_at ?? now,
        recorded_by_person_id: entry.recorded_by_person_id ?? actorPersonId,
        corrected_at: now,
        corrected_by_person_id: actorPersonId,
        correction_reason: reason,
        previous_value: previousValue,
        updated_at: now,
      })
      .where("id", "=", entry.id)
      .returningAll()
      .executeTakeFirstOrThrow()

    await tx.insertInto("app.attendance_corrections").values({
      id: randomUUID(),
      entry_id: entry.id,
      previous_value: previousValue,
      new_value: value,
      correction_reason: reason,
      corrected_at: now,
      corrected_by_person_id: actorPersonId,
    }).execute()

    await this.audit.record(tx, {
      actorPersonId,
      action: "ATTENDANCE_CORRECTED",
      targetType: "AttendanceEntry",
      targetId: entry.id,
      reason,
      source,
      diff: { eventId, personId: entry.person_id, previousValue, newValue: value },
    })

    return {
      entryId: updated.id,
      value: updated.value,
      previousValue,
      correctedAt: new Date(updated.corrected_at!).toISOString(),
      correctedBy: actorPersonId,
      correctionReason: reason,
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
     DG-12 — MatchRecord (CMD-PRT-08/09/10/11)
     ══════════════════════════════════════════════════════════════════════ */

  async createMatchRecord(
    tx: Transaction<DatabaseSchema>,
    actorPersonId: string,
    input: { matchId: string },
    now: Date,
    source = "CMD-PRT-08",
  ) {
    const matchId = requireUuid(input.matchId, "matchId")
    const event = await this.requireMatchEvent(tx, matchId, true)
    const targets = await resolveEventTargets(tx, matchId)
    const snapshot = await this.coachSnapshot(tx, actorPersonId, now)
    this.assertCoachScope(snapshot, matchId, targets.teamIds)
    this.assertEventMutable(event)

    const existing = await tx.selectFrom("app.match_records").selectAll().where("match_id", "=", matchId).executeTakeFirst()
    if (existing) {
      throw new AppError("MATCHRECORD_EXISTS", "A match record already exists for this match", "conflict")
    }
    const record = await tx.insertInto("app.match_records").values({
      id: randomUUID(),
      match_id: matchId,
      state: "DRAFT",
      result_type: null,
      home_score: null,
      away_score: null,
      observations: null,
      finalized_at: null,
      finalized_by_person_id: null,
      corrected_at: null,
      corrected_by_person_id: null,
      correction_reason: null,
      previous_result_type: null,
      previous_home_score: null,
      previous_away_score: null,
      previous_observations: null,
      created_at: now,
      updated_at: now,
    }).returningAll().executeTakeFirstOrThrow()

    await this.audit.record(tx, {
      actorPersonId,
      action: "MATCHRECORD_CREATED",
      targetType: "MatchRecord",
      targetId: record.id,
      source,
      diff: { matchId, eventTitle: event.title },
    })

    return { matchRecordId: record.id, matchId, state: record.state }
  }

  async finalizeMatchRecord(
    tx: Transaction<DatabaseSchema>,
    actorPersonId: string,
    input: { matchId: string; resultType: MatchResultType; homeScore?: number | null; awayScore?: number | null; observations?: string | null },
    now: Date,
    source = "CMD-PRT-09",
  ) {
    const matchId = requireUuid(input.matchId, "matchId")
    const resultType = requireEnum<MatchResultType>(input.resultType, "resultType", ["PLAYED", "FORFEIT", "ABANDONED"])
    const homeScore = optionalScore(input.homeScore, "homeScore")
    const awayScore = optionalScore(input.awayScore, "awayScore")
    const observations = input.observations === undefined || input.observations === null ? null : String(input.observations).slice(0, 4000)

    if (resultType === "PLAYED" && (homeScore === null || awayScore === null)) {
      throw new AppError("VALIDATION_FAILED", "A played match requires both scores", "domain_validation", false, { homeScore: ["required"] })
    }
    if (resultType !== "PLAYED" && (homeScore !== null || awayScore !== null)) {
      throw new AppError("VALIDATION_FAILED", "Scores only apply to a played match", "domain_validation", false, { homeScore: ["not_allowed"] })
    }

    // Lock order: events -> match_records.
    const event = await this.requireMatchEvent(tx, matchId, true)
    const targets = await resolveEventTargets(tx, matchId)
    const snapshot = await this.coachSnapshot(tx, actorPersonId, now)
    this.assertCoachScope(snapshot, matchId, targets.teamIds)

    const record = await tx.selectFrom("app.match_records").selectAll().where("match_id", "=", matchId).forUpdate().executeTakeFirst()
    if (!record) throw new AppError("MATCHRECORD_NOT_FOUND", "Match record was not found", "not_found")
    if (record.state !== "DRAFT") {
      throw new AppError("INVALID_STATE_TRANSITION", "Only a draft match record can be finalized", "conflict")
    }
    if (event.state !== "IN_PROGRESS") {
      throw new AppError("INVALID_STATE_TRANSITION", "The match must be in progress before finalizing", "conflict")
    }

    const stats = await tx.selectFrom("app.player_match_stats").select("id").where("match_record_id", "=", record.id).execute()
    if (stats.length > 0 && resultType !== "PLAYED") {
      throw new AppError("STATS_NOT_PLAYED", "Player statistics exist, so the result must be PLAYED", "conflict")
    }

    const finalized = await tx
      .updateTable("app.match_records")
      .set({
        state: "FINAL",
        result_type: resultType,
        home_score: homeScore,
        away_score: awayScore,
        observations,
        finalized_at: now,
        finalized_by_person_id: actorPersonId,
        updated_at: now,
      })
      .where("id", "=", record.id)
      .returningAll()
      .executeTakeFirstOrThrow()

    const eventState = resultType === "ABANDONED" ? "ABANDONED" : "COMPLETED"
    const updatedEvent = await tx
      .updateTable("app.events")
      .set({
        state: eventState,
        version: event.version + 1,
        coordination_revision: event.coordination_revision + 1,
        updated_at: now,
      })
      .where("id", "=", event.id)
      .returningAll()
      .executeTakeFirstOrThrow()

    await this.audit.record(tx, {
      actorPersonId,
      action: "MATCHRECORD_FINALIZED",
      targetType: "MatchRecord",
      targetId: finalized.id,
      source,
      diff: { matchId, resultType, homeScore, awayScore },
    })
    await this.audit.record(tx, {
      actorPersonId,
      action: eventState === "COMPLETED" ? "EVENT_COMPLETED" : "EVENT_ABANDONED",
      targetType: "Event",
      targetId: event.id,
      source: eventState === "COMPLETED" ? "CMD-EVT-10" : "CMD-EVT-11",
      diff: { from: event.state, to: eventState, matchId, resultType },
    })

    // NOT-01 (contrato §08): el cierre del evento es un cambio material notificado a la audiencia.
    const audience = await resolveParticipationAudience(tx, updatedEvent, now)
    for (const recipientPersonId of audience) {
      const recorded = await this.notifications.record(tx, {
        recipientPersonId,
        type: "EVENT_CHANGED",
        resourceType: "EVENT",
        resourceId: event.id,
        originEventId: event.id,
        title: "Evento finalizado",
        body: `El partido "${event.title}" quedó registrado como ${resultType}.`,
        occurredAt: now,
      })
      if (recorded.wasDuplicate) continue
      await this.outbox.enqueue(tx, {
        topic: "notification.created",
        aggregateType: "Notification",
        aggregateId: recorded.id,
        payload: {
          schemaVersion: 1,
          event: "notification.created",
          recipients: [recipientPersonId],
          resourceType: "EVENT",
          resourceId: event.id,
          invalidate: ["notifications", "calendar", "match-record"],
        },
      })
    }

    return {
      matchRecordId: finalized.id,
      state: finalized.state,
      resultType: finalized.result_type,
      homeScore: finalized.home_score,
      awayScore: finalized.away_score,
      finalizedAt: new Date(finalized.finalized_at!).toISOString(),
      eventState: updatedEvent.state,
      eventVersion: updatedEvent.version,
    }
  }

  async correctMatchRecord(
    tx: Transaction<DatabaseSchema>,
    actorPersonId: string,
    input: { matchRecordId: string; matchId?: string | null; resultType?: MatchResultType; homeScore?: number | null; awayScore?: number | null; observations?: string | null; correctionReason: string },
    now: Date,
    source = "CMD-PRT-10",
  ) {
    const matchRecordId = requireUuid(input.matchRecordId, "matchRecordId")
    const reason = requireReason(input.correctionReason)

    const record = await tx.selectFrom("app.match_records").selectAll().where("id", "=", matchRecordId).forUpdate().executeTakeFirst()
    if (!record) throw new AppError("RECORD_NOT_FOUND", "Match record was not found", "not_found")
    if (input.matchId && record.match_id !== input.matchId) {
      throw new AppError("RECORD_NOT_FOUND", "Match record was not found", "not_found")
    }
    if (record.state !== "FINAL") {
      throw new AppError("INVALID_STATE_TRANSITION", "Only a final match record can be corrected", "conflict")
    }

    const event = await requireEvent(tx, record.match_id)
    const targets = await resolveEventTargets(tx, record.match_id)
    const snapshot = await this.coachSnapshot(tx, actorPersonId, now)
    this.assertCoachScope(snapshot, record.match_id, targets.teamIds)

    const previousResultType = record.result_type
    const newResultType = input.resultType === undefined ? record.result_type : requireEnum<MatchResultType>(input.resultType, "resultType", ["PLAYED", "FORFEIT", "ABANDONED"])

    // H-08 (A-D04-04): prohibido cruzar la frontera COMPLETED <-> ABANDONED.
    if (newResultType !== previousResultType) {
      const crossesTerminal =
        (previousResultType === "ABANDONED" && newResultType !== "ABANDONED")
        || (previousResultType !== "ABANDONED" && newResultType === "ABANDONED")
      if (crossesTerminal) {
        throw new AppError("INVALID_CORRECTION", "The result cannot cross the COMPLETED/ABANDONED boundary", "conflict")
      }
    }

    const stats = await tx.selectFrom("app.player_match_stats").select("id").where("match_record_id", "=", record.id).execute()
    if (stats.length > 0 && newResultType !== "PLAYED") {
      throw new AppError("INVALID_CORRECTION", "Player statistics exist, so the result cannot leave PLAYED", "conflict")
    }

    let homeScore = input.homeScore === undefined ? record.home_score : optionalScore(input.homeScore, "homeScore")
    let awayScore = input.awayScore === undefined ? record.away_score : optionalScore(input.awayScore, "awayScore")
    const observations = input.observations === undefined ? record.observations : (input.observations === null ? null : String(input.observations).slice(0, 4000))

    if (newResultType === "PLAYED") {
      if (homeScore === null || awayScore === null) {
        throw new AppError("VALIDATION_FAILED", "A played match requires both scores", "domain_validation", false, { homeScore: ["required"] })
      }
    } else {
      homeScore = null
      awayScore = null
    }

    const updated = await tx
      .updateTable("app.match_records")
      .set({
        result_type: newResultType,
        home_score: homeScore,
        away_score: awayScore,
        observations,
        corrected_at: now,
        corrected_by_person_id: actorPersonId,
        correction_reason: reason,
        previous_result_type: previousResultType,
        previous_home_score: record.home_score,
        previous_away_score: record.away_score,
        previous_observations: record.observations,
        updated_at: now,
      })
      .where("id", "=", record.id)
      .returningAll()
      .executeTakeFirstOrThrow()

    await tx.insertInto("app.matchrecord_corrections").values({
      id: randomUUID(),
      match_record_id: record.id,
      previous_result_type: previousResultType,
      new_result_type: newResultType,
      previous_home_score: record.home_score,
      new_home_score: homeScore,
      previous_away_score: record.away_score,
      new_away_score: awayScore,
      previous_observations: record.observations,
      new_observations: observations,
      correction_reason: reason,
      corrected_at: now,
      corrected_by_person_id: actorPersonId,
    }).execute()

    await this.audit.record(tx, {
      actorPersonId,
      action: "MATCHRECORD_CORRECTED",
      targetType: "MatchRecord",
      targetId: record.id,
      reason,
      source,
      diff: {
        previousResultType,
        newResultType,
        previousHomeScore: record.home_score,
        newHomeScore: homeScore,
        previousAwayScore: record.away_score,
        newAwayScore: awayScore,
      },
    })

    return {
      matchRecordId: updated.id,
      state: updated.state,
      resultType: updated.result_type,
      homeScore: updated.home_score,
      awayScore: updated.away_score,
      observations: updated.observations,
      correctedAt: new Date(updated.corrected_at!).toISOString(),
      previousResultType: updated.previous_result_type,
      previousHomeScore: updated.previous_home_score,
      previousAwayScore: updated.previous_away_score,
      previousObservations: updated.previous_observations,
    }
  }

  async recordPlayerStats(
    tx: Transaction<DatabaseSchema>,
    actorPersonId: string,
    input: { matchRecordId: string; matchId?: string | null; personId: string; stats: PlayerStatsInput },
    now: Date,
    source = "CMD-PRT-11",
  ) {
    const matchRecordId = requireUuid(input.matchRecordId, "matchRecordId")
    const personId = requireUuid(input.personId, "personId")
    const stats = input.stats ?? {}

    const record = await tx.selectFrom("app.match_records").selectAll().where("id", "=", matchRecordId).forUpdate().executeTakeFirst()
    if (!record) throw new AppError("MATCHRECORD_NOT_FOUND", "Match record was not found", "not_found")
    if (input.matchId && record.match_id !== input.matchId) {
      throw new AppError("MATCHRECORD_NOT_FOUND", "Match record was not found", "not_found")
    }
    if (record.state !== "DRAFT") {
      throw new AppError("RECORD_NOT_DRAFT", "Player statistics can only be recorded while the match record is a draft", "conflict")
    }

    const event = await requireEvent(tx, record.match_id)
    const targets = await resolveEventTargets(tx, record.match_id)
    const snapshot = await this.coachSnapshot(tx, actorPersonId, now)
    this.assertCoachScope(snapshot, record.match_id, targets.teamIds)

    const roster = await resolveEventRoster(tx, record.match_id, now)
    if (!roster.some((member) => member.personId === personId)) {
      throw new AppError("PERSON_NOT_IN_ROSTER", "That person is not part of this event's roster", "conflict")
    }

    // Sólo se modifican los campos provistos: omitted ≠ null (no se borra lo que no se envía).
    const provided = {
      minutesPlayed: stats.minutesPlayed !== undefined ? optionalNonNegativeInt(stats.minutesPlayed, "minutesPlayed") : undefined,
      goals: stats.goals !== undefined ? optionalNonNegativeInt(stats.goals, "goals") : undefined,
      assists: stats.assists !== undefined ? optionalNonNegativeInt(stats.assists, "assists") : undefined,
      yellowCards: stats.yellowCards !== undefined ? optionalNonNegativeInt(stats.yellowCards, "yellowCards") : undefined,
      redCards: stats.redCards !== undefined ? optionalNonNegativeInt(stats.redCards, "redCards") : undefined,
      mvp: stats.mvp !== undefined ? Boolean(stats.mvp) : undefined,
    }
    const providedKeys = Object.keys(provided).filter((key) => (provided as Record<string, unknown>)[key] !== undefined)
    if (providedKeys.length === 0) {
      throw new AppError("VALIDATION_FAILED", "At least one statistic must be provided", "domain_validation", false, { stats: ["required"] })
    }
    const allCleared = providedKeys.length > 0 && providedKeys.every((key) => (provided as Record<string, unknown>)[key] === null)

    if (allCleared) {
      // Todos los campos provistos en null: el entrenador retira las estadísticas del borrador.
      const removed = await tx.deleteFrom("app.player_match_stats").where("match_record_id", "=", record.id).where("person_id", "=", personId).executeTakeFirst()
      await this.audit.record(tx, {
        actorPersonId,
        action: "PLAYERMATCHSTATS_CLEARED",
        targetType: "PlayerMatchStats",
        targetId: personId,
        source,
        diff: { matchRecordId, personId },
      })
      return { statsId: null, personId, cleared: true, removed: Number(removed.numDeletedRows) > 0 }
    }

    const existing = await tx
      .selectFrom("app.player_match_stats")
      .selectAll()
      .where("match_record_id", "=", record.id)
      .where("person_id", "=", personId)
      .executeTakeFirst()

    const columnFor: Record<string, string> = {
      minutesPlayed: "minutes_played",
      goals: "goals",
      assists: "assists",
      yellowCards: "yellow_cards",
      redCards: "red_cards",
      mvp: "mvp",
    }
    const updateSet: Record<string, unknown> = { updated_at: now }
    for (const key of providedKeys) {
      updateSet[columnFor[key]!] = (provided as Record<string, unknown>)[key]
    }

    const upserted = existing
      ? await tx
        .updateTable("app.player_match_stats")
        .set(updateSet)
        .where("id", "=", existing.id)
        .returningAll()
        .executeTakeFirstOrThrow()
      : await tx
        .insertInto("app.player_match_stats")
        .values({
          id: randomUUID(),
          match_record_id: record.id,
          person_id: personId,
          minutes_played: provided.minutesPlayed ?? null,
          goals: provided.goals ?? null,
          assists: provided.assists ?? null,
          yellow_cards: provided.yellowCards ?? null,
          red_cards: provided.redCards ?? null,
          mvp: provided.mvp ?? false,
          created_at: now,
          updated_at: now,
        })
        .returningAll()
        .executeTakeFirstOrThrow()

    await this.audit.record(tx, {
      actorPersonId,
      action: "PLAYERMATCHSTATS_RECORDED",
      targetType: "PlayerMatchStats",
      targetId: upserted.id,
      source,
      diff: { matchRecordId, personId, updated: providedKeys },
    })

    return {
      statsId: upserted.id,
      personId,
      minutesPlayed: upserted.minutes_played,
      goals: upserted.goals,
      assists: upserted.assists,
      yellowCards: upserted.yellow_cards,
      redCards: upserted.red_cards,
      mvp: upserted.mvp,
      cleared: false,
    }
  }
}
