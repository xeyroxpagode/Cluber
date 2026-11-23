import { randomUUID } from "node:crypto"
import { sql, type Kysely, type Transaction } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import { jsonbParam } from "../shared/jsonb.js"
import { makeT04Fixture, type T04Fixture } from "./t04-base.js"

export interface T06St70Fixture extends T04Fixture {
  noRoleId: string
  trainingId: string
  todayEventId: string
  playedWithStatsId: string
  playedNoStatsId: string
  draftMatchId: string
  forfeitMatchId: string
  abandonedMatchId: string
  outOfScopeEventId: string
  openSheetId: string
  closedSheetId: string
  draftAnnouncementId: string
  publishedClubAnnouncementId: string
  publishedTeamAnnouncementId: string
  otherTeamAnnouncementId: string
  directConversationId: string
  outsiderConversationId: string
  unreadNotificationId: string
  readNotificationId: string
}

/** Fixture determinista y completo para los 70 escenarios ST de T06. */
export async function makeT06St70Fixture(tx: Kysely<DatabaseSchema> | Transaction<DatabaseSchema>, tag: string): Promise<T06St70Fixture> {
  const base = await makeT04Fixture(tx as Kysely<DatabaseSchema>, tag)
  const now = new Date()
  const id = () => randomUUID()

  const noRoleId = id()
  await tx.insertInto("app.people").values({
    id: noRoleId, first_name: "Sin", last_name: `Rol-${tag}`, dni: `${tag}-norole`, birth_date: "1990-01-01",
    phone: "123", email: `norole-${tag}@example.com`, created_at: now, updated_at: now,
  }).execute()
  await tx.insertInto("app.memberships").values({ id: id(), person_id: noRoleId, valid_from: new Date("2026-01-01"), valid_until: null, created_at: now }).execute()

  async function event(title: string, type: "TRAINING" | "MATCH", state: "SCHEDULED" | "COMPLETED", startAt: Date, revision: number): Promise<string> {
    const eventId = id()
    await tx.insertInto("app.events").values({
      id: eventId, type, title, start_at: startAt, end_at: null, time_zone: "America/Argentina/Buenos_Aires",
      venue_id: null, state, club_wide_target: false, series_id: null, occurrence_index: null,
      coordination_revision: revision, creator_person_id: base.coachId, created_at: now, updated_at: now,
      version: 1, competition_id: type === "MATCH" ? base.competitionId : null, opponent: type === "MATCH" ? "Rival" : null,
    }).execute()
    await tx.insertInto("app.event_target_team").values({ id: id(), event_id: eventId, team_id: base.teamAId, added_at: now, added_by_person_id: base.coachId }).execute()
    return eventId
  }

  const future = new Date(Date.now() + 7 * 86_400_000)
  const trainingId = await event(`Entrenamiento ${tag}`, "TRAINING", "SCHEDULED", future, 2)
  const todayEventId = await event(`Hoy ${tag}`, "TRAINING", "SCHEDULED", new Date(), 1)
  await tx.insertInto("app.event_target_person").values({ id: id(), event_id: trainingId, person_id: base.playerId, added_at: now, added_by_person_id: base.coachId }).execute()
  const playedWithStatsId = await event(`Partido stats ${tag}`, "MATCH", "COMPLETED", new Date("2026-06-01T15:00:00Z"), 1)
  const playedNoStatsId = await event(`Partido sin stats ${tag}`, "MATCH", "COMPLETED", new Date("2026-06-02T15:00:00Z"), 1)
  const draftMatchId = await event(`Partido draft ${tag}`, "MATCH", "SCHEDULED", future, 1)
  const forfeitMatchId = await event(`Partido forfeit ${tag}`, "MATCH", "COMPLETED", new Date("2026-06-04T15:00:00Z"), 1)
  const abandonedMatchId = await event(`Partido abandoned ${tag}`, "MATCH", "COMPLETED", new Date("2026-06-05T15:00:00Z"), 1)
  const outOfScopeEventId = id()
  await tx.insertInto("app.events").values({
    id: outOfScopeEventId, type: "TRAINING", title: `Fuera de scope ${tag}`, start_at: future, end_at: null,
    time_zone: "UTC", venue_id: null, state: "SCHEDULED", club_wide_target: false, series_id: null,
    occurrence_index: null, coordination_revision: 1, creator_person_id: base.coachBId,
    created_at: now, updated_at: now, version: 1, competition_id: null, opponent: null,
  }).execute()
  await tx.insertInto("app.event_target_team").values({ id: id(), event_id: outOfScopeEventId, team_id: base.teamBId, added_at: now, added_by_person_id: base.coachBId }).execute()

  // Availability: jugador respondió con revisión vieja (reconfirmación), player2 sin respuesta.
  await tx.insertInto("app.availability_responses").values({
    id: id(), event_id: trainingId, person_id: base.playerId, value: "YES",
    responded_at: now, coordination_revision: 1, created_at: now,
  }).execute()

  // Selection: draft con un entrada válida y otra en conflicto (sin vínculo).
  const selectionId = id(), draftRevisionId = id()
  await tx.insertInto("app.selections").values({ id: selectionId, match_id: draftMatchId, current_draft_revision_id: draftRevisionId, created_at: now, updated_at: now }).execute()
  await tx.insertInto("app.selection_revisions").values({ id: draftRevisionId, selection_id: selectionId, state: "DRAFT", published_at: null, published_by_person_id: null, autosave_version: 1, created_at: now, updated_at: now }).execute()
  await tx.insertInto("app.selection_entries").values([
    { id: id(), revision_id: draftRevisionId, person_id: base.playerId, role: "SELECTED", order: 1, created_at: now },
    { id: id(), revision_id: draftRevisionId, person_id: noRoleId, role: "ALTERNATE", order: 2, created_at: now },
  ]).execute()

  // Attendance: planilla abierta con 4 estados, historial de corrección y planilla cerrada.
  const openSheetId = id(), closedSheetId = id()
  await tx.insertInto("app.attendance_sheets").values([
    { id: openSheetId, event_id: trainingId, closed_at: null, closed_by_person_id: null, created_at: now },
    { id: closedSheetId, event_id: playedWithStatsId, closed_at: now, closed_by_person_id: base.coachId, created_at: now },
  ]).execute()
  const entryIds = { present: id(), absent: id(), justified: id(), unrecorded: id() }
  await tx.insertInto("app.attendance_entries").values([
    { id: entryIds.present, sheet_id: openSheetId, person_id: base.playerId, value: "PRESENT", recorded_at: now, recorded_by_person_id: base.coachId, corrected_at: null, corrected_by_person_id: null, correction_reason: null, previous_value: null, created_at: now, updated_at: now },
    { id: entryIds.absent, sheet_id: openSheetId, person_id: base.player2Id, value: "ABSENT", recorded_at: now, recorded_by_person_id: base.coachId, corrected_at: null, corrected_by_person_id: null, correction_reason: null, previous_value: null, created_at: now, updated_at: now },
    { id: entryIds.justified, sheet_id: openSheetId, person_id: base.multiRoleId, value: "JUSTIFIED", recorded_at: now, recorded_by_person_id: base.coachId, corrected_at: null, corrected_by_person_id: null, correction_reason: null, previous_value: null, created_at: now, updated_at: now },
    { id: entryIds.unrecorded, sheet_id: openSheetId, person_id: base.crossRoleId, value: null, recorded_at: null, recorded_by_person_id: null, corrected_at: null, corrected_by_person_id: null, correction_reason: null, previous_value: null, created_at: now, updated_at: now },
  ]).execute()
  await tx.insertInto("app.attendance_corrections").values({
    id: id(), entry_id: entryIds.present, previous_value: "ABSENT", new_value: "PRESENT",
    correction_reason: "Corrección ST70", corrected_at: now, corrected_by_person_id: base.coachId,
  }).execute()

  // Match records: PLAYED con stats, PLAYED sin stats, DRAFT, FORFEIT, ABANDONED.
  async function record(eventRef: string, state: "DRAFT" | "FINAL", resultType: "PLAYED" | "FORFEIT" | "ABANDONED" | null) {
    const recordId = id()
    await tx.insertInto("app.match_records").values({
      id: recordId, match_id: eventRef, state, result_type: resultType, home_score: resultType === "PLAYED" ? 2 : null,
      away_score: resultType === "PLAYED" ? 1 : null, observations: null, finalized_at: state === "FINAL" ? now : null,
      finalized_by_person_id: state === "FINAL" ? base.coachId : null, corrected_at: null, corrected_by_person_id: null,
      correction_reason: null, previous_result_type: null, previous_home_score: null, previous_away_score: null,
      previous_observations: null, created_at: now, updated_at: now,
    }).execute()
    return recordId
  }
  const playedRecord = await record(playedWithStatsId, "DRAFT", null)
  await tx.insertInto("app.player_match_stats").values([
    { id: id(), match_record_id: playedRecord, person_id: base.playerId, minutes_played: 60, goals: 2, assists: 1, yellow_cards: 0, red_cards: 0, created_at: now, updated_at: now },
    { id: id(), match_record_id: playedRecord, person_id: base.player2Id, minutes_played: 45, goals: 0, assists: 0, yellow_cards: 1, red_cards: 0, created_at: now, updated_at: now },
  ]).execute()
  await tx.updateTable("app.match_records").set({ state: "FINAL", result_type: "PLAYED", home_score: 2, away_score: 1, finalized_at: now, finalized_by_person_id: base.coachId }).where("id", "=", playedRecord).execute()
  await record(playedNoStatsId, "FINAL", "PLAYED")
  await record(draftMatchId, "DRAFT", null)
  await record(forfeitMatchId, "FINAL", "FORFEIT")
  const abandonedRecordId = await record(abandonedMatchId, "FINAL", "ABANDONED")
  await tx.insertInto("app.matchrecord_corrections").values({
    id: id(), match_record_id: abandonedRecordId, previous_result_type: "PLAYED", new_result_type: "ABANDONED",
    previous_home_score: 1, new_home_score: null, previous_away_score: 0, new_away_score: null,
    previous_observations: null, new_observations: null, correction_reason: "Corrección ST70",
    corrected_at: now, corrected_by_person_id: base.coachId,
  }).execute()

  // Announcements: DRAFT, PUBLIC club, PUBLIC equipo A, PUBLIC equipo B.
  async function announcement(title: string, state: "DRAFT" | "PUBLISHED", teamIds: string[]) {
    const announcementId = id()
    await tx.insertInto("app.announcements").values({
      id: announcementId, title, body: "Cuerpo", state: "DRAFT", published_at: null,
      published_by_person_id: null, archived_at: null, revision: 1, version: 1, created_at: now, updated_at: now,
    }).execute()
    for (const teamId of teamIds) {
      await tx.insertInto("app.announcement_target_teams").values({ id: id(), announcement_id: announcementId, team_id: teamId, added_at: now, added_by_person_id: base.subcommitteeId }).execute()
    }
    if (state === "PUBLISHED") {
      await tx.updateTable("app.announcements").set({ state: "PUBLISHED", published_at: now, published_by_person_id: base.subcommitteeId }).where("id", "=", announcementId).execute()
    }
    return announcementId
  }
  const draftAnnouncementId = await announcement(`Borrador ${tag}`, "DRAFT", [])
  const publishedClubAnnouncementId = await announcement(`Club ${tag}`, "PUBLISHED", [base.teamAId, base.teamBId])
  const publishedTeamAnnouncementId = await announcement(`EquipoA ${tag}`, "PUBLISHED", [base.teamAId])
  const otherTeamAnnouncementId = await announcement(`EquipoB ${tag}`, "PUBLISHED", [base.teamBId])

  // Conversaciones: directa con jugador, y conversación sin el jugador.
  const directConversationId = id(), outsiderConversationId = id()
  await tx.insertInto("app.conversations").values([
    { id: directConversationId, type: "DIRECT", title: null, state: "ACTIVE", direct_pair_key: `pair-${tag}`, team_id: null, event_id: null, created_at: now, created_by_person_id: base.coachId, version: 1 },
    { id: outsiderConversationId, type: "GROUP", title: `Grupo cerrado ${tag}`, state: "ACTIVE", direct_pair_key: null, team_id: null, event_id: null, created_at: now, created_by_person_id: base.coachBId, version: 1 },
  ]).execute()
  await tx.insertInto("app.conversation_participants").values([
    { id: id(), conversation_id: directConversationId, person_id: base.coachId, joined_at: now, left_at: null, last_read_at: null },
    { id: id(), conversation_id: directConversationId, person_id: base.playerId, joined_at: now, left_at: null, last_read_at: null },
    { id: id(), conversation_id: outsiderConversationId, person_id: base.coachBId, joined_at: now, left_at: null, last_read_at: null },
    { id: id(), conversation_id: outsiderConversationId, person_id: base.coachId, joined_at: now, left_at: null, last_read_at: now },
  ]).execute()
  await tx.insertInto("app.messages").values({
    id: id(), conversation_id: directConversationId, author_person_id: base.coachId,
    body: "Mensaje privado que nunca debe indexarse", state: "SENT", sent_at: now, edited_at: null,
    deleted_at: null, deletion_reason: null, version: 1,
  }).execute()

  // Notificaciones de contexto: una sin leer y una leída.
  const unreadNotificationId = id(), readNotificationId = id()
  await tx.insertInto("app.notifications").values([
    { id: unreadNotificationId, recipient_person_id: base.playerId, type: "EVENT_CHANGED", resource_type: "EVENT", resource_id: trainingId, origin_event_id: trainingId, title: `Aviso ${tag}`, body: "Privado", occurred_at: now, read_at: null, audience_resolved_at: now, dedupe_key: `st70-unread-${tag}`, created_at: now },
    { id: readNotificationId, recipient_person_id: base.playerId, type: "ANNOUNCEMENT_PUBLISHED", resource_type: "ANNOUNCEMENT", resource_id: publishedClubAnnouncementId, origin_event_id: null, title: `Aviso leído ${tag}`, body: "Privado", occurred_at: now, read_at: now, audience_resolved_at: now, dedupe_key: `st70-read-${tag}`, created_at: now },
  ]).execute()

  // Audit: cambio de evento en scope.
  await tx.insertInto("app.audit_entries").values({
    id: id(), occurred_at: now, actor_person_id: base.coachId, action: "EVENT_RESCHEDULED",
    target_type: "EVENT", target_id: trainingId, reason: "ST70", source: "CMD-EVT-04", diff: jsonbParam({}),
  }).execute()

  void sql
  return {
    ...base, noRoleId, trainingId, todayEventId, playedWithStatsId, playedNoStatsId, draftMatchId,
    forfeitMatchId, abandonedMatchId, outOfScopeEventId, openSheetId, closedSheetId,
    draftAnnouncementId, publishedClubAnnouncementId, publishedTeamAnnouncementId, otherTeamAnnouncementId,
    directConversationId, outsiderConversationId, unreadNotificationId, readNotificationId,
  }
}
