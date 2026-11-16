import { randomUUID } from "node:crypto"
import { AppError } from "../shared/errors.js"
import type { Tx } from "./types.js"

/**
 * Sincronización de proyección ConversationParticipant con la fuente canónica.
 * La proyección NUNCA es security boundary: assertConversationAccess revalida siempre.
 */
export class ConversationSyncService {
  private async activeTeamPersons(tx: Tx, teamId: string, instant: Date): Promise<string[]> {
    const today = instant.toISOString().slice(0, 10)
    const [assignments, coaches] = await Promise.all([
      tx.selectFrom("app.team_assignments").select("person_id")
        .where("team_id", "=", teamId)
        .where("valid_from", "<=", today)
        .where((eb) => eb.or([eb("valid_until", "is", null), eb("valid_until", ">", today)]))
        .execute(),
      tx.selectFrom("app.role_assignments").select("person_id")
        .where("role", "=", "COACH").where("scope_type", "=", "TEAM").where("scope_ref_id", "=", teamId)
        .where("valid_from", "<=", instant)
        .where((eb) => eb.or([eb("valid_until", "is", null), eb("valid_until", ">", instant)]))
        .execute(),
    ])
    return Array.from(new Set([...assignments.map((r) => r.person_id), ...coaches.map((r) => r.person_id)]))
  }

  private async activeEventPersons(tx: Tx, eventId: string, instant: Date): Promise<string[]> {
    const today = instant.toISOString().slice(0, 10)
    const [targetPersons, targetTeams, coaches] = await Promise.all([
      tx.selectFrom("app.event_target_person").select("person_id").where("event_id", "=", eventId).execute(),
      tx.selectFrom("app.event_target_team").select("team_id").where("event_id", "=", eventId).execute(),
      tx.selectFrom("app.role_assignments").select("person_id")
        .where("role", "=", "COACH").where("scope_type", "=", "EVENT").where("scope_ref_id", "=", eventId)
        .where("valid_from", "<=", instant)
        .where((eb) => eb.or([eb("valid_until", "is", null), eb("valid_until", ">", instant)]))
        .execute(),
    ])
    const ids = new Set<string>([...targetPersons.map((r) => r.person_id), ...coaches.map((r) => r.person_id)])
    const teamIds = targetTeams.map((r) => r.team_id)
    if (teamIds.length > 0) {
      const assignments = await tx.selectFrom("app.team_assignments").select("person_id")
        .where("team_id", "in", teamIds)
        .where("valid_from", "<=", today)
        .where((eb) => eb.or([eb("valid_until", "is", null), eb("valid_until", ">", today)]))
        .execute()
      for (const row of assignments) ids.add(row.person_id)
    }
    return Array.from(ids)
  }

  private async apply(tx: Tx, conversationId: string, allowed: string[], instant: Date): Promise<void> {
    const set = new Set(allowed)
    const active = await tx.selectFrom("app.conversation_participants")
      .select(["id", "person_id"]).where("conversation_id", "=", conversationId)
      .where("left_at", "is", null).execute()
    for (const row of active) {
      if (!set.has(row.person_id)) {
        await tx.updateTable("app.conversation_participants")
          .set({ left_at: instant }).where("id", "=", row.id).execute()
      }
    }
    const activeIds = new Set(active.map((r) => r.person_id))
    for (const personId of allowed) {
      if (activeIds.has(personId)) continue
      await tx.insertInto("app.conversation_participants").values({
        id: randomUUID(), conversation_id: conversationId, person_id: personId, joined_at: instant,
      }).execute()
    }
  }

  async syncTeamConversationParticipants(tx: Tx, conversationId: string, teamId: string, instant: Date): Promise<void> {
    await this.apply(tx, conversationId, await this.activeTeamPersons(tx, teamId, instant), instant)
  }

  async syncEventConversationParticipants(tx: Tx, conversationId: string, eventId: string, instant: Date): Promise<void> {
    await this.apply(tx, conversationId, await this.activeEventPersons(tx, eventId, instant), instant)
  }
}

/** Chequeo de autoridad en cada request: participación activa + recheck de fuente canónica. */
export async function assertConversationAccess(
  tx: Tx,
  conversationId: string,
  personId: string,
  instant: Date,
  authority: { snapshot: (tx: Tx, personId: string, instant: Date) => Promise<import("../authority/authority.js").AuthoritySnapshot>; require: (condition: boolean, code?: string) => void },
): Promise<{ conversation: import("../db/types.js").ConversationTable; participantId: string; lastReadAt: Date | null; joinedAt: Date; leftAt: Date | null }> {
  const conversation = await tx.selectFrom("app.conversations").selectAll()
    .where("id", "=", conversationId).executeTakeFirst()
  if (!conversation) throw new Error("CONVERSATION_NOT_FOUND")

  const snapshot = await authority.snapshot(tx, personId, instant)
  if (conversation.type === "TEAM") {
    authority.require(snapshot.teamIds.includes(conversation.team_id ?? ""), "NO_TEAM_CONVERSATION_AUTHORITY")
  } else if (conversation.type === "EVENT") {
    const target = await tx.selectFrom("app.event_target_person")
      .select("person_id").where("event_id", "=", conversation.event_id).where("person_id", "=", personId).executeTakeFirst()
    let isTarget = Boolean(target)
    if (!isTarget && conversation.event_id) {
      const teamTargets = await tx.selectFrom("app.event_target_team").select("team_id").where("event_id", "=", conversation.event_id).execute()
      const teamIds = teamTargets.map((r) => r.team_id)
      if (teamIds.length > 0) {
        const today = instant.toISOString().slice(0, 10)
        const assignment = await tx.selectFrom("app.team_assignments").select("person_id")
          .where("person_id", "=", personId).where("team_id", "in", teamIds)
          .where("valid_from", "<=", today)
          .where((eb) => eb.or([eb("valid_until", "is", null), eb("valid_until", ">", today)]))
          .executeTakeFirst()
        isTarget = Boolean(assignment)
      }
    }
    authority.require(snapshot.eventScopeIds.includes(conversation.event_id ?? "") || isTarget, "NO_EVENT_CONVERSATION_AUTHORITY")
  }

  const participant = await tx.selectFrom("app.conversation_participants")
    .selectAll().where("conversation_id", "=", conversationId).where("person_id", "=", personId)
    .where("joined_at", "<=", instant)
    .where((eb) => eb.or([eb("left_at", "is", null), eb("left_at", ">", instant)]))
    .orderBy("joined_at", "desc").executeTakeFirst()
  if (!participant) throw new AppError("NOT_PARTICIPANT", "No sos participante de esta conversación", "authorization")

  return {
    conversation,
    participantId: participant.id as string,
    lastReadAt: participant.last_read_at,
    joinedAt: new Date(participant.joined_at),
    leftAt: participant.left_at,
  }
}

export type ConversationAccess = Awaited<ReturnType<typeof assertConversationAccess>>
