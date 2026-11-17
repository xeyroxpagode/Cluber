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

  /** RC-06 — ConversationList: cursor y límite APLICADOS EN SQL; unread excluye propios (C19). */
  async conversationList(
    tx: Tx, personId: string, instant: Date, options: { limit?: number; cursor?: string } = {},
  ): Promise<Page<ConversationDto & { lastActivityAt: string; unreadCount: number }>> {
    const limit = Math.min(Math.max(options.limit ?? 30, 1), 100)
    const cursor = decodeCursor(options.cursor)
    const snapshot = await this.authority.snapshot(tx, personId, instant)
    const lastActivity = sql<Date>`coalesce((select max(m.sent_at) from app.messages m where m.conversation_id = c.id), c.created_at)`

    let query = tx.selectFrom("app.conversations as c")
      .innerJoin("app.conversation_participants as p", "p.conversation_id", "c.id")
      .select(["c.id", "c.type", "c.title", "c.state", "c.team_id", "c.event_id", "c.version",
        lastActivity.as("last_activity_at"),
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
      // Recheck de fuente canónica en SQL: la proyección no es security boundary.
      .where((eb) => eb.or([
        eb("c.type", "in", ["DIRECT", "GROUP"]),
        eb.and([eb("c.type", "=", "TEAM"), snapshot.teamIds.length
          ? eb("c.team_id", "in", snapshot.teamIds) : eb(sql<boolean>`false`, "=", true)]),
        eb.and([eb("c.type", "=", "EVENT"), eb.or([
          snapshot.eventScopeIds.length
            ? eb("c.event_id", "in", snapshot.eventScopeIds) : eb(sql<boolean>`false`, "=", true),
          eb(sql`exists (select 1 from app.event_target_person etp where etp.event_id = c.event_id and etp.person_id = ${personId})`, "=", true),
          eb(sql<boolean>`exists (
            select 1 from app.event_target_team ett
            join app.team_assignments ta on ta.team_id = ett.team_id
            where ett.event_id = c.event_id and ta.person_id = ${personId}
              and ta.valid_from <= ${instant.toISOString().slice(0, 10)}
              and (ta.valid_until is null or ta.valid_until > ${instant.toISOString().slice(0, 10)})
          )`, "=", true),
        ])]),
      ]))

    if (cursor) {
      query = query.where((eb) => eb.or([
        eb(lastActivity, "<", cursor.at),
        eb.and([eb(lastActivity, "=", cursor.at), eb("c.id", "<", cursor.id)]),
      ]))
    }
    const rows = await query.orderBy(lastActivity, "desc").orderBy("c.id", "desc").limit(limit + 1).execute()
    const hasMore = rows.length > limit
    const items = rows.slice(0, limit).map((r) => ({
      id: r.id as string, type: r.type, title: r.title, state: r.state,
      teamId: r.team_id, eventId: r.event_id, version: r.version,
      participantCount: Number(r.participant_count),
      lastActivityAt: new Date(r.last_activity_at).toISOString(),
      unreadCount: Number(r.unread_count),
    }))
    const last = items[items.length - 1]
    return {
      items,
      hasMore,
      nextCursor: hasMore && last ? encodeCursor(new Date(last.lastActivityAt), last.id) : null,
    }
  }

  /** RC-07 — ConversationThread: cursor `(sentAt,id)` y LÍMITE EN SQL; filtro temporal del período. */
  async conversationThread(
    tx: Tx, personId: string, conversationId: string, instant: Date,
    options: { limit?: number; cursor?: string } = {},
  ): Promise<Page<MessageDto>> {
    const access = await assertConversationAccess(tx, conversationId, personId, instant, this.authority, { allowHistory: true })
    const limit = Math.min(Math.max(options.limit ?? 40, 1), 100)
    const cursor = decodeCursor(options.cursor)
    let query = tx.selectFrom("app.messages").selectAll()
      .where("conversation_id", "=", conversationId)
      .where("sent_at", ">=", access.joinedAt)
      .orderBy("sent_at", "asc").orderBy("id", "asc")
    if (access.leftAt) query = query.where("sent_at", "<", access.leftAt)
    if (cursor) {
      query = query.where((eb) => eb.or([
        eb("sent_at", ">", cursor.at),
        eb.and([eb("sent_at", "=", cursor.at), eb("id", ">", cursor.id)]),
      ]))
    }
    const rows = await query.limit(limit + 1).execute()
    const hasMore = rows.length > limit
    const items = rows.slice(0, limit).map((r) => this.messages.toDto(r))
    const last = items[items.length - 1]
    return {
      items,
      hasMore,
      nextCursor: hasMore && last ? encodeCursor(new Date(last.sentAt), last.id) : null,
    }
  }

  /** RC-19 — AnnouncementList: audiencia y cursor APLICADOS EN SQL; URL ajena → DENY en el detalle. */
  async announcementList(
    tx: Tx, personId: string, instant: Date,
    options: { limit?: number; cursor?: string; includeDrafts?: boolean } = {},
  ): Promise<Page<AnnouncementDto>> {
    const snapshot = await this.authority.snapshot(tx, personId, instant)
    const today = instant.toISOString().slice(0, 10)
    const limit = Math.min(Math.max(options.limit ?? 30, 1), 100)
    const cursor = decodeCursor(options.cursor)
    const includeDrafts = Boolean(options.includeDrafts) && snapshot.isSubcommittee
    const states: Array<"DRAFT" | "PUBLISHED" | "ARCHIVED"> = includeDrafts
      ? ["DRAFT", "PUBLISHED", "ARCHIVED"] : ["PUBLISHED", "ARCHIVED"]

    let query = tx.selectFrom("app.announcements as a").selectAll("a")
      .where("a.state", "in", states)
      .where((eb) => eb.or([
        // clubWide = audiencia vacía
        eb(sql`not exists (select 1 from app.announcement_target_teams t where t.announcement_id = a.id)`, "=", true),
        // TeamSet: solo si el lector tiene TeamAssignment vigente sobre algún equipo del snapshot
        eb(sql<boolean>`exists (
          select 1 from app.announcement_target_teams t
          join app.team_assignments ta on ta.team_id = t.team_id
          where t.announcement_id = a.id and ta.person_id = ${personId}
            and ta.valid_from <= ${today}
            and (ta.valid_until is null or ta.valid_until > ${today})
        )`, "=", true),
      ]))

    if (cursor) {
      query = query.where((eb) => eb.or([
        eb("a.published_at", "<", cursor.at),
        eb.and([eb("a.published_at", "=", cursor.at), eb("a.id", "<", cursor.id)]),
      ]))
    }
    const rows = await query.orderBy("a.published_at", "desc").orderBy("a.id", "desc").limit(limit + 1).execute()
    const hasMore = rows.length > limit
    const items: AnnouncementDto[] = []
    for (const row of rows.slice(0, limit)) items.push(await this.announcements.toDto(tx, row, personId))
    const last = items[items.length - 1]
    return {
      items,
      hasMore,
      nextCursor: hasMore && last?.publishedAt ? encodeCursor(new Date(last.publishedAt), last.id) : null,
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
