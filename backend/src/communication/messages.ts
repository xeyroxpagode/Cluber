import { randomUUID } from "node:crypto"
import { AuthorityService } from "../authority/authority.js"
import { AuditWriter } from "../audit/audit.js"
import { OutboxWriter, type OutboxPayload } from "../shared/outbox.js"
import { fail, requireText, assertUuid, redactedBody, type MessageDto, type Tx } from "./types.js"
import { assertConversationAccess } from "./sync.js"

export class MessageService {
  constructor(
    private readonly authority = new AuthorityService(),
    private readonly audit = new AuditWriter(),
    private readonly outbox = new OutboxWriter(),
  ) {}

  toDto(row: {
    id: string; conversation_id: string; author_person_id: string; body: string
    state: "SENT" | "EDITED" | "DELETED"; sent_at: Date; edited_at: Date | null
    deleted_at: Date | null; deletion_reason: string | null
  }): MessageDto {
    const deleted = row.state === "DELETED"
    return {
      id: row.id as string,
      conversationId: row.conversation_id,
      authorPersonId: row.author_person_id,
      body: deleted ? null : row.body,
      state: row.state,
      sentAt: new Date(row.sent_at).toISOString(),
      editedAt: row.edited_at ? new Date(row.edited_at).toISOString() : null,
      deletedAt: row.deleted_at ? new Date(row.deleted_at).toISOString() : null,
      deletionReason: deleted ? row.deletion_reason : null,
    }
  }

  private async load(tx: Tx, messageId: string) {
    assertUuid(messageId, "messageId")
    const row = await tx.selectFrom("app.messages").selectAll().where("id", "=", messageId).executeTakeFirst()
    if (!row) fail("MESSAGE_NOT_FOUND", "El mensaje no existe", "not_found")
    return row
  }

  /** CMD-COM-09 — ENVÍO: Audit NO, Notification NO (REC-11, C03). */
  async send(tx: Tx, actorPersonId: string, conversationId: string, body: string, instant: Date): Promise<MessageDto> {
    const access = await assertConversationAccess(tx, conversationId, actorPersonId, instant, this.authority)
    if (access.conversation.state !== "ACTIVE") fail("CONVERSATION_CLOSED", "La conversación está archivada", "conflict")
    const text = requireText(body, "body", 20_000)
    const id = randomUUID()
    await tx.insertInto("app.messages").values({
      id, conversation_id: conversationId, author_person_id: actorPersonId,
      body: text, state: "SENT", sent_at: instant, version: 1,
    }).execute()

    const participants = await tx.selectFrom("app.conversation_participants")
      .select("person_id").where("conversation_id", "=", conversationId).where("left_at", "is", null).execute()
    const payload: OutboxPayload = {
      schemaVersion: 1, event: "conversation.changed",
      recipients: participants.map((p) => p.person_id),
      resourceType: "CONVERSATION", resourceId: conversationId,
      invalidate: [`conversation:${conversationId}`, "conversations"],
    }
    await this.outbox.enqueue(tx, {
      topic: "conversation.changed", aggregateType: "Conversation", aggregateId: conversationId, payload,
    })
    return this.toDto(await this.load(tx, id))
  }

  /** CMD-COM-10 — edición propia; Audit YES con body redactado (PII-08). */
  async edit(tx: Tx, actorPersonId: string, messageId: string, body: string, instant: Date): Promise<MessageDto> {
    const row = await this.load(tx, messageId)
    if (row.author_person_id !== actorPersonId) fail("NOT_AUTHOR", "Solo el autor puede editar el mensaje", "authorization")
    if (row.state === "DELETED") fail("MESSAGE_DELETED", "El mensaje fue eliminado", "conflict")
    const text = requireText(body, "body", 20_000)
    await tx.updateTable("app.messages").set({
      body: text, state: "EDITED", edited_at: instant, version: row.version + 1,
    }).where("id", "=", messageId).execute()
    await this.audit.record(tx, {
      actorPersonId, action: "CMD-COM-10", targetType: "Message", targetId: messageId,
      source: "CMD-COM-10", reason: "EDIT",
      diff: { before: redactedBody(), after: redactedBody(), version: row.version + 1 },
    })
    return this.toDto(await this.load(tx, messageId))
  }

  /** CMD-COM-11 — tombstone irreversible desde SENT o EDITED (C09). */
  async delete(tx: Tx, actorPersonId: string, messageId: string, deletionReason: string, instant: Date): Promise<MessageDto> {
    const row = await this.load(tx, messageId)
    if (row.author_person_id !== actorPersonId) fail("NOT_AUTHOR", "Solo el autor puede eliminar el mensaje", "authorization")
    if (row.state === "DELETED") return this.toDto(row) // idempotente (ST-D13)
    const reason = requireText(deletionReason, "deletionReason", 500)
    await tx.updateTable("app.messages").set({
      state: "DELETED", deleted_at: instant, deletion_reason: reason, version: row.version + 1,
    }).where("id", "=", messageId).execute()
    await this.audit.record(tx, {
      actorPersonId, action: "CMD-COM-11", targetType: "Message", targetId: messageId,
      source: "CMD-COM-11", reason,
      diff: { previousState: row.state, state: "DELETED", body: redactedBody(), version: row.version + 1 },
    })
    return this.toDto(await this.load(tx, messageId))
  }
}
