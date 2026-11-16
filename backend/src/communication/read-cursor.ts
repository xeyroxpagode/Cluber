import type { AuthorityService } from "../authority/authority.js"
import { assertConversationAccess, type ConversationAccess } from "./sync.js"
import type { Tx } from "./types.js"

/** Operación interna (no Product Command): avanza el cursor de lectura tras vista autorizada. */
export async function touchConversationReadCursor(
  tx: Tx,
  conversationId: string,
  personId: string,
  instant: Date,
  authority: AuthorityService,
): Promise<ConversationAccess> {
  const access = await assertConversationAccess(tx, conversationId, personId, instant, authority)
  await tx.updateTable("app.conversation_participants")
    .set({ last_read_at: instant })
    .where("id", "=", access.participantId)
    .execute()
  return access
}
