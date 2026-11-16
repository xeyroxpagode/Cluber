import { sql } from "kysely"
import { AuthorityService } from "../authority/authority.js"
import { AnnouncementService } from "./announcements.js"
import { assertConversationAccess } from "./sync.js"
import { MessageService } from "./messages.js"
import { fail, type AnnouncementDto, type ConversationDto, type MessageDto, type Tx } from "./types.js"

export interface Page<T> {
  items: T[]
  nextCursor: string | null
  hasMore: boolean
}

function decodeCursor(cursor?: string): { at: Date; id: string } | null {
  if (!cursor) return null
  const [at, id] = cursor.split("|")
  if (!at || !id || Number.isNaN(Date.parse(at))) fail("INVALID_CURSOR", "Cursor inválido", "transport")
  return { at: new Date(at), id }
}

function encodeCursor(at: Date, id: string): string {
  return `${new Date(at).toISOString()}|${id}`
}

export class CommunicationQueries {
  constructor(
    private readonly authority = new AuthorityService(),
    private readonly announcements = new AnnouncementService(),
    private readonly messages = new MessageService(),
  ) {}

  /** RC-06 — ConversationList: lastActivityAt DESC; unread excluye propios (C19). */
  async conversationList(
    tx: Tx, personId: string, instant: Date, options: { limit?: number; cursor?: string } = {},
  ): Promise<Page<ConversationDto & { lastActivityAt: string; unreadCount: number }>> {
    const limit = Math.min(Math.max(options.limit ?? 30, 1), 100)
    const cursor = decodeCursor(options.cursor)
    const rows = await tx.selectFrom("app.conversations as c")
      .innerJoin("app.conversation_participants as p", "p.conversation_id", "c.id")
      .select(["c.id", "c.type", "c.title", "c.state", "c.team_id", "c.event_id", "c.version",
        "p.joined_at", "p.last_read_at",
        sql<Date>`coalesce((select max(m.sent_at) from app.messages m where m.conversation_id = c.id), c.created_at)`.as("last_activity_at"),
        sql<number>`(
          select count(*)::int from app.messages m
          where m.conversation_id = c.id
            and m.sent_at > coalesce(p.last_read_at, p.joined_at)
            and m.state <> 'DELETED'
            and m.author_person_id <> ${personId}
        )`.as("unread_count"),
        sql<number>`(select count(*)::int from app.conversation_participants cp where cp.conversation_id = c.id and cp.left_at is null)`.as("participant_count"),
      ])
      .where("p.person_id", "=", personId)
      .where("p.joined_at", "<=", instant)
      .where((eb) => eb.or([eb("p.left_at", "is", null), eb("p.left_at", ">", instant)]))
      .orderBy("last_activity_at", "desc").orderBy("c.id", "desc")
      .execute()

    // La proyección no es security boundary: recheck de fuente canónica para TEAM/EVENT.
    const snapshot = await this.authority.snapshot(tx, personId, instant)
    const visible: typeof rows = []
    for (const row of rows) {
      if (row.type === "TEAM" && !snapshot.teamIds.includes(row.team_id ?? "")) continue
      if (row.type === "EVENT") {
        const target = await tx.selectFrom("app.event_target_person").select("person_id")
          .where("event_id", "=", row.event_id).where("person_id", "=", personId).executeTakeFirst()
        if (!target && !snapshot.eventScopeIds.includes(row.event_id ?? "")) continue
      }
      visible.push(row)
    }
    const pageRows = cursor
      ? visible.filter((r) => {
        const at = new Date(r.last_activity_at).getTime()
        const cat = cursor.at.getTime()
        return at < cat || (at === cat && (r.id as string) < cursor.id)
      }).slice(0, limit)
      : visible.slice(0, limit)
    const items = pageRows.map((r) => ({
      id: r.id as string, type: r.type, title: r.title, state: r.state,
      teamId: r.team_id, eventId: r.event_id, version: r.version,
      participantCount: Number(r.participant_count),
      lastActivityAt: new Date(r.last_activity_at).toISOString(),
      unreadCount: Number(r.unread_count),
    }))
    const last = pageRows[pageRows.length - 1]
    const hasMore = Boolean(last && visible.some((r) => {
      const a = new Date(r.last_activity_at).getTime(); const b = new Date(last.last_activity_at).getTime()
      return a < b || (a === b && (r.id as string) < (last.id as string))
    }))
    return {
      items,
      hasMore,
      nextCursor: hasMore && last ? encodeCursor(new Date(last.last_activity_at), last.id as string) : null,
    }
  }

  /** RC-07 — ConversationThread: cursor estable (sentAt,id) y filtro temporal del período. */
  async conversationThread(
    tx: Tx, personId: string, conversationId: string, instant: Date,
    options: { limit?: number; cursor?: string } = {},
  ): Promise<Page<MessageDto>> {
    const access = await assertConversationAccess(tx, conversationId, personId, instant, this.authority)
    const limit = Math.min(Math.max(options.limit ?? 40, 1), 100)
    const cursor = decodeCursor(options.cursor)
    let query = tx.selectFrom("app.messages").selectAll()
      .where("conversation_id", "=", conversationId)
      .where("sent_at", ">=", access.joinedAt)
      .orderBy("sent_at", "asc").orderBy("id", "asc")
    // Período autorizado [joinedAt, leftAt): ex-participante conserva su historia.
    if (access.leftAt) query = query.where("sent_at", "<", access.leftAt)
    const rows = await query.execute()
    const filtered = cursor
      ? rows.filter((r) => {
        const at = new Date(r.sent_at).getTime(); const cat = cursor.at.getTime()
        return at > cat || (at === cat && (r.id as string) > cursor.id)
      })
      : rows
    const pageRows = filtered.slice(0, limit + 1)
    const hasMore = pageRows.length > limit
    const items = pageRows.slice(0, limit).map((r) => this.messages.toDto(r))
    const last = items[items.length - 1]
    return {
      items,
      hasMore,
      nextCursor: hasMore && last ? encodeCursor(new Date(last.sentAt), last.id) : null,
    }
  }

  /** RC-19 — AnnouncementList: filtro por audiencia; URL ajena → DENY en el detalle. */
  async announcementList(
    tx: Tx, personId: string, instant: Date,
    options: { limit?: number; cursor?: string; includeDrafts?: boolean } = {},
  ): Promise<Page<AnnouncementDto>> {
    const snapshot = await this.authority.snapshot(tx, personId, instant)
    const today = instant.toISOString().slice(0, 10)
    const teamAssignments = await tx.selectFrom("app.team_assignments").select("team_id")
      .where("person_id", "=", personId).where("valid_from", "<=", today)
      .where((eb) => eb.or([eb("valid_until", "is", null), eb("valid_until", ">", today)])).execute()
    const teamIds = teamAssignments.map((r) => r.team_id)
    const limit = Math.min(Math.max(options.limit ?? 30, 1), 100)
    const cursor = decodeCursor(options.cursor)

    const rows = await tx.selectFrom("app.announcements as a").selectAll("a")
      .where((eb) => eb.or([
        eb("a.state", "in", options.includeDrafts && snapshot.isSubcommittee ? ["DRAFT", "PUBLISHED", "ARCHIVED"] : ["PUBLISHED", "ARCHIVED"]),
      ]))
      .orderBy("a.published_at", "desc").orderBy("a.id", "desc").execute()
    const visible: typeof rows = []
    for (const row of rows) {
      if (row.state === "DRAFT") {
        if (!snapshot.isSubcommittee) continue
        visible.push(row)
        continue
      }
      const targets = await tx.selectFrom("app.announcement_target_teams").select("team_id")
        .where("announcement_id", "=", row.id).execute()
      if (targets.length === 0 || targets.some((t) => teamIds.includes(t.team_id))) visible.push(row)
    }
    const pageRows = (cursor
      ? visible.filter((r) => {
        const at = r.published_at ? new Date(r.published_at).getTime() : 0
        const cat = cursor.at.getTime()
        return at < cat || (at === cat && (r.id as string) < cursor.id)
      })
      : visible).slice(0, limit + 1)
    const hasMore = pageRows.length > limit
    const items = []
    for (const row of pageRows.slice(0, limit)) items.push(await this.announcements.toDto(tx, row, personId))
    const last = items[items.length - 1]
    return {
      items,
      hasMore,
      nextCursor: hasMore && last?.publishedAt
        ? encodeCursor(new Date(last.publishedAt), last.id) : null,
    }
  }

  /** RC-19 detalle — audiencia como access control (COM-015). */
  async announcementDetail(tx: Tx, personId: string, announcementId: string, instant: Date): Promise<AnnouncementDto> {
    const row = await tx.selectFrom("app.announcements").selectAll()
      .where("id", "=", announcementId).executeTakeFirst()
    if (!row) fail("ANNOUNCEMENT_NOT_FOUND", "El comunicado no existe", "not_found")
    const snapshot = await this.authority.snapshot(tx, personId, instant)
    if (row.state === "DRAFT") {
      if (!snapshot.isSubcommittee) fail("NO_ANNOUNCEMENT_AUTHORITY", "Sin acceso", "authorization")
      return this.announcements.toDto(tx, row, personId)
    }
    const targets = await tx.selectFrom("app.announcement_target_teams").select("team_id")
      .where("announcement_id", "=", row.id).execute()
    if (targets.length > 0) {
      const today = instant.toISOString().slice(0, 10)
      const assignments = await tx.selectFrom("app.team_assignments").select("team_id")
        .where("person_id", "=", personId).where("valid_from", "<=", today)
        .where((eb) => eb.or([eb("valid_until", "is", null), eb("valid_until", ">", today)])).execute()
      const ids = assignments.map((a) => a.team_id)
      if (!targets.some((t) => ids.includes(t.team_id))) fail("NO_ANNOUNCEMENT_AUTHORITY", "No sos destinatario de este comunicado", "authorization")
    }
    return this.announcements.toDto(tx, row, personId)
  }

  /** RC-26 — TeamConversations */
  async teamConversations(tx: Tx, personId: string, teamId: string, instant: Date, limit = 30): Promise<ConversationDto[]> {
    const snapshot = await this.authority.snapshot(tx, personId, instant)
    if (!snapshot.teamIds.includes(teamId)) fail("NO_TEAM_CONVERSATION_AUTHORITY", "Sin acceso a este equipo", "authorization")
    const rows = await tx.selectFrom("app.conversations").selectAll()
      .where("type", "=", "TEAM").where("team_id", "=", teamId)
      .orderBy("created_at", "desc").limit(Math.min(limit, 100)).execute()
    const result: ConversationDto[] = []
    for (const row of rows) {
      await assertConversationAccess(tx, row.id, personId, instant, this.authority)
      result.push({
        id: row.id as string, type: row.type, title: row.title, state: row.state,
        teamId: row.team_id, eventId: row.event_id, version: row.version, participantCount: 0,
      })
    }
    return result
  }

  /** RC-27 — EventConversations */
  async eventConversations(tx: Tx, personId: string, eventId: string, instant: Date, limit = 30): Promise<ConversationDto[]> {
    const rows = await tx.selectFrom("app.conversations").selectAll()
      .where("type", "=", "EVENT").where("event_id", "=", eventId)
      .orderBy("created_at", "desc").limit(Math.min(limit, 100)).execute()
    const result: ConversationDto[] = []
    for (const row of rows) {
      await assertConversationAccess(tx, row.id, personId, instant, this.authority)
      result.push({
        id: row.id as string, type: row.type, title: row.title, state: row.state,
        teamId: row.team_id, eventId: row.event_id, version: row.version, participantCount: 0,
      })
    }
    return result
  }
}
