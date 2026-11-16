import { randomUUID } from "node:crypto"
import type { ConversationTable } from "../db/types.js"
import { AuthorityService } from "../authority/authority.js"
import { AuditWriter } from "../audit/audit.js"
import { fail, sortedPair, requireText, assertUuid, type ConversationDto, type Tx } from "./types.js"
import { assertConversationAccess, ConversationSyncService } from "./sync.js"

export interface CreateGroupInput {
  title: string
  participantPersonIds: string[]
}

export class ConversationService {
  constructor(
    private readonly authority = new AuthorityService(),
    private readonly audit = new AuditWriter(),
    private readonly sync = new ConversationSyncService(),
  ) {}

  async load(tx: Tx, conversationId: string): Promise<ConversationTable> {
    assertUuid(conversationId, "conversationId")
    const row = await tx.selectFrom("app.conversations").selectAll().where("id", "=", conversationId).executeTakeFirst()
    if (!row) fail("CONVERSATION_NOT_FOUND", "La conversación no existe", "not_found")
    return row
  }

  async toDto(tx: Tx, row: ConversationTable): Promise<ConversationDto> {
    const count = await tx.selectFrom("app.conversation_participants")
      .select((eb) => eb.fn.count<number>("id").as("n"))
      .where("conversation_id", "=", row.id).where("left_at", "is", null).executeTakeFirst()
    return {
      id: row.id as string,
      type: row.type,
      title: row.title,
      state: row.state,
      teamId: row.team_id,
      eventId: row.event_id,
      participantCount: Number(count?.n ?? 0),
      version: row.version,
    }
  }

  async getForViewer(tx: Tx, conversationId: string, viewerPersonId: string, instant: Date): Promise<ConversationDto> {
    const { conversation } = await assertConversationAccess(tx, conversationId, viewerPersonId, instant, this.authority)
    return this.toDto(tx, conversation)
  }

  private async personExists(tx: Tx, personId: string): Promise<boolean> {
    return Boolean(await tx.selectFrom("app.people").select("id").where("id", "=", personId).executeTakeFirst())
  }

  /** CMD-COM-05 — findOrOpenDirect atómico; pareja no ordenada. */
  async openDirect(tx: Tx, actorPersonId: string, targetPersonId: string, instant: Date): Promise<ConversationDto> {
    assertUuid(targetPersonId, "targetPersonId")
    if (targetPersonId === actorPersonId) fail("VALIDATION", "No podés abrir una conversación con vos mismo", "transport")
    if (!await this.personExists(tx, targetPersonId)) fail("INVALID_PARTICIPANT", "La persona no existe", "not_found")
    const pairKey = sortedPair(actorPersonId, targetPersonId)

    const existing = await tx.selectFrom("app.conversations").selectAll()
      .where("type", "=", "DIRECT").where("direct_pair_key", "=", pairKey).executeTakeFirst()
    if (existing) return this.toDto(tx, existing)

    const id = randomUUID()
    let created = false
    try {
      await tx.insertInto("app.conversations").values({
        id, type: "DIRECT", direct_pair_key: pairKey, created_by_person_id: actorPersonId,
        created_at: instant, state: "ACTIVE", version: 1,
      }).execute()
      created = true
    } catch (error) {
      const code = (error as { code?: string }).code
      if (code !== "23505") throw error // unique index parcial gana la carrera; re-leemos debajo.
    }

    let conversation = await tx.selectFrom("app.conversations").selectAll()
      .where("type", "=", "DIRECT").where("direct_pair_key", "=", pairKey).executeTakeFirst()
    if (!conversation) fail("DUPLICATE_CONVERSATION", "No se pudo abrir la conversación", "conflict")
    if (created) {
      for (const personId of [actorPersonId, targetPersonId]) {
        await tx.insertInto("app.conversation_participants").values({
          id: randomUUID(), conversation_id: id, person_id: personId, joined_at: instant,
        }).execute()
      }
      await this.audit.record(tx, {
        actorPersonId, action: "CMD-COM-05", targetType: "Conversation", targetId: id,
        source: "CMD-COM-05", reason: "OPEN_DIRECT",
        diff: { type: "DIRECT", pairKey: "[REDACTED]" },
      })
      conversation = await this.load(tx, id)
    }
    return this.toDto(tx, conversation)
  }

  /** CMD-COM-06 — GROUP con ≥2 participant records; creador auto-incluido (C02). */
  async createGroup(tx: Tx, actorPersonId: string, input: CreateGroupInput, instant: Date): Promise<ConversationDto> {
    const title = requireText(input.title, "title")
    const requested = input.participantPersonIds ?? []
    if (!Array.isArray(requested)) fail("INVALID_PARTICIPANT", "participantPersonIds debe ser una lista", "transport")
    if (new Set(requested).size !== requested.length) fail("DUPLICATE_PARTICIPANT", "Participantes duplicados", "transport")
    for (const id of requested) assertUuid(id, "participantPersonId")
    const participants = Array.from(new Set([actorPersonId, ...requested]))
    if (participants.length < 2) fail("INSUFFICIENT_PARTICIPANTS", "Un grupo requiere al menos 2 participantes")
    for (const id of requested) {
      if (!await this.personExists(tx, id)) fail("INVALID_PARTICIPANT", "Uno de los participantes no existe", "not_found")
    }

    const id = randomUUID()
    await tx.insertInto("app.conversations").values({
      id, type: "GROUP", title, state: "ACTIVE", created_by_person_id: actorPersonId,
      created_at: instant, version: 1,
    }).execute()
    for (const personId of participants) {
      await tx.insertInto("app.conversation_participants").values({
        id: randomUUID(), conversation_id: id, person_id: personId, joined_at: instant,
      }).execute()
    }
    await this.audit.record(tx, {
      actorPersonId, action: "CMD-COM-06", targetType: "Conversation", targetId: id,
      source: "CMD-COM-06", reason: "CREATE_GROUP",
      diff: { type: "GROUP", title, participantCount: participants.length },
    })
    return this.toDto(tx, await this.load(tx, id))
  }

  /** CMD-COM-07 — conversación TEAM/EVENT canónica + sync atómico de participantes. */
  async openTeamEvent(tx: Tx, actorPersonId: string, resourceType: "TEAM" | "EVENT", resourceId: string, instant: Date): Promise<ConversationDto> {
    assertUuid(resourceId, "resourceId")
    const snapshot = await this.authority.snapshot(tx, actorPersonId, instant)
    const isSubcommittee = snapshot.isSubcommittee
    if (resourceType === "TEAM") {
      if (!snapshot.coachTeamIds.includes(resourceId) && !isSubcommittee) fail("NO_AUTHORITY", "Sin autoridad sobre ese equipo", "authorization")
      const team = await tx.selectFrom("app.teams").select("id").where("id", "=", resourceId).executeTakeFirst()
      if (!team) fail("RESOURCE_NOT_FOUND", "El equipo no existe", "not_found")
    } else {
      if (!snapshot.eventScopeIds.includes(resourceId) && !isSubcommittee) fail("NO_AUTHORITY", "Sin autoridad sobre ese evento", "authorization")
      const event = await tx.selectFrom("app.events").select("id").where("id", "=", resourceId).executeTakeFirst()
      if (!event) fail("RESOURCE_NOT_FOUND", "El evento no existe", "not_found")
    }

    const column = resourceType === "TEAM" ? "team_id" : "event_id"
    let conversation = await tx.selectFrom("app.conversations").selectAll()
      .where("type", "=", resourceType).where(column, "=", resourceId).executeTakeFirst()
    if (conversation) {
      await this.syncConversation(tx, conversation, instant)
      return this.toDto(tx, conversation)
    }

    const id = randomUUID()
    try {
      await tx.insertInto("app.conversations").values({
        id, type: resourceType, [column]: resourceId, state: "ACTIVE",
        created_by_person_id: actorPersonId, created_at: instant, version: 1,
      }).execute()
    } catch (error) {
      const code = (error as { code?: string }).code
      if (code !== "23505") throw error
      conversation = await tx.selectFrom("app.conversations").selectAll()
        .where("type", "=", resourceType).where(column, "=", resourceId).executeTakeFirst()
      if (!conversation) fail("DUPLICATE_CONVERSATION", "No se pudo abrir la conversación", "conflict")
      await this.syncConversation(tx, conversation, instant)
      return this.toDto(tx, conversation)
    }
    conversation = await this.load(tx, id)
    await this.syncConversation(tx, conversation, instant)
    await this.audit.record(tx, {
      actorPersonId, action: "CMD-COM-07", targetType: "Conversation", targetId: id,
      source: "CMD-COM-07", reason: `OPEN_${resourceType}`,
      diff: { type: resourceType, resourceId },
    })
    return this.toDto(tx, conversation)
  }

  private async syncConversation(tx: Tx, conversation: ConversationTable, instant: Date): Promise<void> {
    if (conversation.type === "TEAM" && conversation.team_id) {
      await this.sync.syncTeamConversationParticipants(tx, conversation.id, conversation.team_id, instant)
    } else if (conversation.type === "EVENT" && conversation.event_id) {
      await this.sync.syncEventConversationParticipants(tx, conversation.id, conversation.event_id, instant)
    }
  }

  /** CMD-COM-08 — solo GROUP ACTIVE; historia preservada. */
  async archiveGroup(tx: Tx, actorPersonId: string, conversationId: string, instant: Date): Promise<ConversationDto> {
    const { conversation } = await assertConversationAccess(tx, conversationId, actorPersonId, instant, this.authority)
    if (conversation.type !== "GROUP") fail("NOT_GROUP", "Solo se pueden archivar conversaciones GROUP")
    if (conversation.state !== "ACTIVE") fail("INVALID_STATE", "La conversación ya está archivada", "conflict")
    await tx.updateTable("app.conversations").set({ state: "ARCHIVED", version: conversation.version + 1 })
      .where("id", "=", conversationId).execute()
    await this.audit.record(tx, {
      actorPersonId, action: "CMD-COM-08", targetType: "Conversation", targetId: conversationId,
      source: "CMD-COM-08", reason: "ARCHIVE_GROUP", diff: { state: "ARCHIVED" },
    })
    return this.toDto(tx, await this.load(tx, conversationId))
  }
}
