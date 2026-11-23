import { sql, type Transaction } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import type {
  AnnouncementMiniDto,
  ConversationMiniDto,
  HomeEventDto,
  HomeForActorDto,
  InlineAvailabilityDto,
  NotificationContextDto,
} from "../../../shared/contracts/t06.js"
import { AttentionReadService } from "./attention-read.js"
import { T04ReadService } from "./t04-read.js"
import { eventAuthorityPredicate, type T06Scope } from "./t06-scope.js"

interface EventRow { id: string; title: string; start_at: Date | null; state: string }
interface AvailabilityRow { event_id: string; title: string; value: string | null; coordination_revision: number; event_revision: number }
interface AnnouncementRow { id: string; title: string; published_at: Date | null }
interface ConversationRow { id: string; title: string | null; last_read_at: Date | null; messages_after: number }
interface NotificationRow { id: string; title: string; resource_type: string; resource_id: string; read_at: Date | null; occurred_at: Date }

function iso(value: Date | string | null | undefined): string | null {
  return value ? new Date(value).toISOString() : null
}

function toEventDto(row: EventRow, to: string | null): HomeEventDto {
  return { id: row.id, title: row.title, startAt: iso(row.start_at), state: row.state, to }
}

/**
 * RC-01 — cinco bloques en orden inmutable:
 * Atención → Hoy → ¿Vas? → Próximamente → Comunicaciones.
 * Máximo 3 filas de Atención; estado vacío «Nada pendiente.».
 * profileCompleted y saludo son contexto, nunca fila canónica (B5-13.2).
 */
export class HomeReadService {
  constructor(private readonly attention = new AttentionReadService()) {}

  async compose(
    tx: Transaction<DatabaseSchema>,
    scope: T06Scope,
    evaluationInstant: Date,
    options: { clubTimeZone?: string } = {},
  ): Promise<HomeForActorDto> {
    const attentionList = await this.attention.list(tx, scope, evaluationInstant, { limit: 3 })
    const blocks: HomeForActorDto["blocks"] = []

    // Hoy — reloj real de la transacción; POSTPONED se muestra como "A definir".
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: options.clubTimeZone ?? "America/Argentina/Buenos_Aires",
      year: "numeric", month: "2-digit", day: "2-digit",
    }).format(evaluationInstant)
    const eventRows = (await sql<EventRow>`
      select e.id::text as id, e.title, e.start_at, e.state
      from app.events e
      where e.state <> 'CANCELLED' and (${eventAuthorityPredicate(scope)})
        and e.start_at >= ${sql.val(`${today}T00:00:00-03:00`)}::timestamptz
        and e.start_at < ${sql.val(`${today}T00:00:00-03:00`)}::timestamptz + interval '1 day'
      order by e.start_at asc limit 10
    `.execute(tx)).rows
    const todayItems = eventRows.map((row) => toEventDto(row, `/events/${row.id}`))
    if (rowCount(eventRows) === 0) blocks.push({ key: "today", unavailable: false })

    // ¿Vas? — disponibilidad propia / del equipo según rol.
    const availabilityRows = (await sql<AvailabilityRow>`
      select e.id::text as event_id, e.title, ar.value, ar.coordination_revision,
             e.coordination_revision as event_revision
      from app.events e
      join app.event_target_person etp on etp.event_id = e.id and etp.person_id = ${sql.val(scope.personId)}::uuid
      left join app.availability_responses ar on ar.event_id = e.id and ar.person_id = ${sql.val(scope.personId)}::uuid
      where e.state = 'SCHEDULED' and e.start_at > ${sql.val(evaluationInstant)}::timestamptz
        and (${eventAuthorityPredicate(scope)})
      order by e.start_at asc limit 3
    `.execute(tx)).rows
    const inlineAvailability: InlineAvailabilityDto[] = availabilityRows.map((row) => ({
      eventId: row.event_id,
      eventTitle: row.title,
      state: T04ReadService.availabilityState(row.value, row.coordination_revision, row.event_revision),
      to: `/events/${row.event_id}/availability`,
      needsReconfirmation: row.coordination_revision < row.event_revision,
    }))

    // Próximamente — posteriores a "Hoy".
    const upcomingRows = (await sql<EventRow>`
      select e.id::text as id, e.title, e.start_at, e.state
      from app.events e
      where e.state in ('SCHEDULED','POSTPONED') and (${eventAuthorityPredicate(scope)})
        and (e.start_at is null or e.start_at >= ${sql.val(`${today}T00:00:00-03:00`)}::timestamptz + interval '1 day')
      order by e.start_at asc nulls last limit 5
    `.execute(tx)).rows
    const upcoming = upcomingRows.map((row) => toEventDto(row, `/events/${row.id}`))

    // Comunicaciones — comunicados, conversaciones y contexto de notificaciones.
    const announcementRows = (await sql<AnnouncementRow>`
      select a.id::text as id, a.title, a.published_at
      from app.announcements a
      where a.state = 'PUBLISHED'
        and (${sql.val(scope.isSubcommittee)}
             or not exists (select 1 from app.announcement_target_teams att where att.announcement_id = a.id)
             or exists (select 1 from app.announcement_target_teams att where att.announcement_id = a.id
                        and att.team_id = any(${sql.val(scope.teamIds)}::uuid[])))
      order by a.published_at desc nulls last limit 3
    `.execute(tx)).rows
    const announcements: AnnouncementMiniDto[] = announcementRows.map((row) => ({
      id: row.id, title: row.title, publishedAt: iso(row.published_at), to: `/announcements/${row.id}`,
    }))

    const conversationRows = (await sql<ConversationRow>`
      select c.id::text as id, c.title,
             cp.last_read_at,
             (select count(*)::int from app.messages m
               where m.conversation_id = c.id and m.state = 'SENT'
                 and (cp.last_read_at is null or m.sent_at > cp.last_read_at)) as messages_after
      from app.conversations c
      join app.conversation_participants cp on cp.conversation_id = c.id
        and cp.person_id = ${sql.val(scope.personId)}::uuid and cp.left_at is null
      where c.state = 'ACTIVE'
      order by c.created_at desc limit 3
    `.execute(tx)).rows
    const conversations: ConversationMiniDto[] = conversationRows.map((row) => ({
      id: row.id, title: row.title ?? "Conversación", unreadCount: row.messages_after, to: `/conversations/${row.id}`,
    }))

    // A-02 (B1): Notification.readAt es SIEMPRE contexto/deep link en Comunicaciones;
    // NUNCA una fila de Attention. `enabled:false` gobierna sólo la rama de Attention,
    // no el bloque de Comunicaciones del DTO aprobado.
    const notificationRows = (await sql<NotificationRow>`
      select n.id::text as id, n.title, n.resource_type, n.resource_id, n.read_at, n.occurred_at
      from app.notifications n
      where n.recipient_person_id = ${sql.val(scope.personId)}::uuid
        and (
          ${sql.val(scope.isSubcommittee)}
          or (n.resource_type = 'EVENT' and exists (
            select 1 from app.events e where e.id = n.resource_id::uuid
              and (${eventAuthorityPredicate(scope)})))
          or (n.resource_type = 'SELECTION' and exists (
            select 1 from app.selections s join app.events e on e.id = s.match_id
            where s.id = n.resource_id::uuid and (${eventAuthorityPredicate(scope)})))
          or (n.resource_type = 'ANNOUNCEMENT' and (
            not exists (select 1 from app.announcement_target_teams att where att.announcement_id = n.resource_id::uuid)
            or exists (select 1 from app.announcement_target_teams att
                       where att.announcement_id = n.resource_id::uuid
                         and att.team_id = any(${sql.val(scope.teamIds)}::uuid[]))))
        )
      order by n.occurred_at desc limit 20
    `.execute(tx)).rows
    const notificationContext: NotificationContextDto = {
      unreadCount: notificationRows.filter((row) => row.read_at === null).length,
      latest: notificationRows.slice(0, 3).map((row) => ({
        id: row.id, title: row.title, readAt: iso(row.read_at),
        to: notificationResourceLink(row.resource_type, row.resource_id),
      })),
    }
    const unreadCount = notificationRows.filter((row) => row.read_at === null).length

    return {
      attention: attentionList.items,
      attentionTotal: attentionList.total ?? attentionList.items.length,
      today: todayItems,
      inlineAvailability,
      upcoming,
      communications: { announcements, conversations, notificationContext, unreadCount },
      blocks,
      scope: { roles: scope.roles, isAdmin: scope.isAdmin, isSubcommittee: scope.isSubcommittee },
    }
  }
}

function notificationResourceLink(resourceType: string, resourceId: string): string | null {
  if (resourceType === "EVENT") return `/events/${resourceId}`
  if (resourceType === "SELECTION") return `/events/${resourceId}/selection`
  if (resourceType === "ANNOUNCEMENT") return `/announcements/${resourceId}`
  return null
}

function rowCount(rows: readonly unknown[]): number {
  return rows.length
}
