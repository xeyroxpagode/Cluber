import { sql, type RawBuilder, type Transaction } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import type {
  SearchCursorPayload,
  SearchPageDto,
  SearchResultItemDto,
  SearchResultType,
} from "../../../shared/contracts/t06.js"
import { AppError } from "../shared/errors.js"
import { compareCursorKey, SearchCursor } from "./search-cursor.js"
import { compareRank, matchRank, normalizeQuery } from "./search-ranking.js"
import { eventAuthorityPredicate, type T06Scope } from "./t06-scope.js"

interface Candidate {
  id: string
  type: SearchResultType
  title: string
  subtitle: string | null
  context: string | null
  audienceScope: string
  to: string | null
  visibleFields: Record<string, string | number | boolean | null>
  allowedActions: string[]
}

const TYPE_SET: SearchResultType[] = ["person", "team", "division", "line", "event", "announcement", "conversation"]
const MAX_CANDIDATES = 2000
const PAGE_SIZE = 20

function isSearchType(value: string | undefined): value is SearchResultType {
  return Boolean(value && TYPE_SET.includes(value as SearchResultType))
}

/**
 * RC-21 — siete tipos. Los predicados de acceso se aplican ANTES del ranking.
 * Nunca se indexa ni se devuelve `Message.body`. Sin `total` (non-enumeration).
 */
export class SearchReadService {
  constructor(private readonly cursor: SearchCursor) {}

  async search(
    tx: Transaction<DatabaseSchema>,
    scope: T06Scope,
    params: { q?: string; type?: string; cursor?: string; limit?: number; identity: { accountId: string; personId: string; scopeHash: string; ah: string; sh: string } },
  ): Promise<SearchPageDto> {
    const normalized = normalizeQuery(params.q ?? "")
    if (!normalized) {
      return { query: params.q ?? "", normalizedQuery: "", type: isSearchType(params.type) ? params.type : null, items: [], page: 1, state: "EMPTY_QUERY", pageMeta: { cursor: null, hasMore: false } }
    }
    const type = isSearchType(params.type) ? params.type : null
    const expected = {
      qh: SearchCursor.queryHash(normalized),
      fh: SearchCursor.filtersHash(type ?? null, {}),
    }
    let cursorPayload: SearchCursorPayload | null = null
    if (params.cursor) {
      cursorPayload = this.cursor.decode(params.cursor, params.identity, expected)
      if (type && cursorPayload.k.type !== type) throw new AppError("INVALID_CURSOR", "Invalid cursor", "transport")
    }
    const limit = Math.min(Math.max(params.limit ?? PAGE_SIZE, 1), 100)
    const scopePredicate = eventAuthorityPredicate(scope)
    const candidates: Candidate[] = []

    const add = async (query: RawBuilder<{ id: string; label: string; secondary: string | null; context: string | null }>, builder: (row: { id: string; label: string; secondary: string | null; context: string | null }) => Candidate): Promise<void> => {
      const rows = (await query.execute(tx)).rows.slice(0, MAX_CANDIDATES)
      for (const row of rows) candidates.push(builder(row))
    }

    if (!type || type === "person") {
      const inScope = scope.isSubcommittee
        ? sql``
        : sql`and (p.id = ${sql.val(scope.personId)}::uuid or exists (
            select 1 from app.team_assignments ta where ta.person_id = p.id and ta.team_id = any(${sql.val(scope.teamIds)}::uuid[])))`
      await add(sql<{ id: string; label: string; secondary: string | null; context: string | null }>`
        select p.id::text as id, (p.first_name || ' ' || p.last_name) as label, null::text as secondary, 'Persona' as context
        from app.people p where 1=1 ${inScope} order by p.last_name, p.first_name limit ${MAX_CANDIDATES}
      `, (row) => ({
        id: row.id, type: "person", title: row.label, subtitle: null, context: row.context,
        audienceScope: scope.isSubcommittee ? "CLUB" : "SCOPE",
        to: `/people/${row.id}`, visibleFields: { firstName: row.label }, allowedActions: ["person.open"],
      }))
    }

    if (!type || type === "team") {
      const inScope = scope.isSubcommittee ? sql`` : sql`and t.id = any(${sql.val(scope.teamIds)}::uuid[])`
      await add(sql<{ id: string; label: string; secondary: string | null; context: string | null }>`
        select t.id::text as id, (s.name || ' ' || d.name || ' ' || l.name) as label, null::text as secondary, 'Equipo' as context
        from app.teams t
        join app.seasons s on s.id = t.season_id
        join app.divisions d on d.id = t.division_id
        join app.lines l on l.id = t.line_id
        where t.state = 'ACTIVE' ${inScope}
        order by s.name, d.name, l.name limit ${MAX_CANDIDATES}
      `, (row) => ({
        id: row.id, type: "team", title: row.label, subtitle: null, context: row.context,
        audienceScope: scope.isSubcommittee ? "CLUB" : "TEAM",
        to: `/teams/${row.id}`, visibleFields: { name: row.label }, allowedActions: ["team.open"],
      }))
    }

    if (!type || type === "division") {
      await add(sql<{ id: string; label: string; secondary: string | null; context: string | null }>`
        select id::text as id, name as label, null::text as secondary, 'División' as context
        from app.divisions where archived_at is null order by name limit ${MAX_CANDIDATES}
      `, (row) => ({
        id: row.id, type: "division", title: row.label, subtitle: null, context: row.context,
        audienceScope: "CLUB", to: null, visibleFields: { name: row.label }, allowedActions: [],
      }))
    }

    if (!type || type === "line") {
      await add(sql<{ id: string; label: string; secondary: string | null; context: string | null }>`
        select id::text as id, name as label, null::text as secondary, 'Línea' as context
        from app.lines where archived_at is null order by name limit ${MAX_CANDIDATES}
      `, (row) => ({
        id: row.id, type: "line", title: row.label, subtitle: null, context: row.context,
        audienceScope: "CLUB", to: null, visibleFields: { name: row.label }, allowedActions: [],
      }))
    }

    if (!type || type === "event") {
      await add(sql<{ id: string; label: string; secondary: string | null; context: string | null }>`
        select e.id::text as id, e.title as label, coalesce(e.opponent, '') as secondary, 'Evento' as context
        from app.events e where e.state <> 'CANCELLED' and (${scopePredicate})
        order by e.start_at desc nulls last limit ${MAX_CANDIDATES}
      `, (row) => ({
        id: row.id, type: "event", title: row.label, subtitle: row.secondary || null, context: row.context,
        audienceScope: scope.isSubcommittee ? "CLUB" : "EVENT",
        to: `/events/${row.id}`, visibleFields: { title: row.label }, allowedActions: ["event.open"],
      }))
    }

    if (!type || type === "announcement") {
      const audience = scope.isSubcommittee
        ? sql``
        : sql`and (not exists (select 1 from app.announcement_target_teams att where att.announcement_id = a.id)
                 or exists (select 1 from app.announcement_target_teams att where att.announcement_id = a.id and att.team_id = any(${sql.val(scope.teamIds)}::uuid[])))`
      await add(sql<{ id: string; label: string; secondary: string | null; context: string | null }>`
        select a.id::text as id, a.title as label, null::text as secondary, 'Comunicado' as context
        from app.announcements a
        where a.state = 'PUBLISHED' ${audience}
        order by a.published_at desc nulls last limit ${MAX_CANDIDATES}
      `, (row) => ({
        id: row.id, type: "announcement", title: row.label, subtitle: null, context: row.context,
        audienceScope: scope.isSubcommittee ? "CLUB" : "TEAM",
        to: `/announcements/${row.id}`, visibleFields: { title: row.label }, allowedActions: ["announcement.open"],
      }))
    }

    if (!type || type === "conversation") {
      // Sin Message.body: sólo título de conversación y contexto de participación.
      await add(sql<{ id: string; label: string; secondary: string | null; context: string | null }>`
        select c.id::text as id, coalesce(c.title, 'Conversación') as label, null::text as secondary, 'Conversación' as context
        from app.conversations c
        join app.conversation_participants cp on cp.conversation_id = c.id
          and cp.person_id = ${sql.val(scope.personId)}::uuid and cp.left_at is null
        where c.state = 'ACTIVE'
        order by c.created_at desc limit ${MAX_CANDIDATES}
      `, (row) => ({
        id: row.id, type: "conversation", title: row.label, subtitle: null, context: row.context,
        audienceScope: "PARTICIPANT", to: `/conversations/${row.id}`,
        visibleFields: { title: row.label }, allowedActions: ["conversation.open"],
      }))
    }

    const ranked: SearchResultItemDto[] = candidates
      .map((candidate) => {
        const rank = matchRank(candidate.title, normalized)
        return rank.tier === 0 ? null : { ...candidate, rank: { tier: rank.tier, score: rank.score } }
      })
      .filter((item): item is SearchResultItemDto => item !== null)
      .sort(compareRank)

    const afterCursor = cursorPayload
      ? ranked.filter((item) => compareCursorKey(
          { tier: item.rank.tier, score: item.rank.score, type: item.type, id: item.id },
          cursorPayload.k,
        ) > 0)
      : ranked

    const hasMore = afterCursor.length > limit
    const items = afterCursor.slice(0, limit)
    const last = items.at(-1)
    const key = last
      ? { tier: last.rank.tier, score: last.rank.score, type: last.type, id: last.id }
      : null
    const nextCursor = hasMore && key
      ? this.cursor.encode({
          k: key,
          qh: expected.qh,
          fh: expected.fh,
          sh: params.identity.sh,
          ah: params.identity.ah,
          page: ((cursorPayload as (SearchCursorPayload & { page?: number }) | null)?.page ?? 1) + 1,
        })
      : null

    return {
      query: params.q ?? "",
      normalizedQuery: normalized,
      type,
      items,
      page: (cursorPayload as (SearchCursorPayload & { page?: number }) | null)?.page ?? 1,
      state: items.length === 0 ? "NO_RESULTS" : "OK",
      pageMeta: { cursor: nextCursor, hasMore },
    }
  }
}

