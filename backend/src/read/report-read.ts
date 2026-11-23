import { createHash, createHmac, timingSafeEqual } from "node:crypto"
import { sql, type Transaction } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import type {
  AttendanceCorrectionDto,
  AttendanceReportDto,
  AttendanceReportRowDto,
  AttendanceValue,
  PerformanceReportDto,
  PerformanceReportRowDto,
} from "../../../shared/contracts/t06.js"
import { AppError } from "../shared/errors.js"
import { ReportPercentagePolicy } from "./report-percentage-policy.js"
import {
  assertReportAuthority,
  eventAuthorityPredicate,
  eventFilter,
  personVisibleFields,
  reportAllowedActions,
  resolveSeasonId,
  seasonFilter,
  teamFilter,
  type T06Scope,
} from "./t06-scope.js"

interface AttendanceRawRow {
  event_id: string
  person_id: string
  entry_id: string | null
  sheet_id: string | null
  value: AttendanceValue
  recorded_at: Date | null
  corrected_at: Date | null
  n_present: number
  n_absent: number
  n_justified: number
  n_unrecorded: number
  first_name: string
  last_name: string
  title: string
  start_at: Date | null
}

interface CorrectionRawRow {
  id: string
  entry_id: string
  previous_value: "PRESENT" | "ABSENT" | "JUSTIFIED" | null
  new_value: "PRESENT" | "ABSENT" | "JUSTIFIED"
  correction_reason: string
  corrected_at: Date
}

interface PerformanceRawRow {
  person_id: string
  first_name: string
  last_name: string
  matches_played: number
  minutes_played: number
  goals: number
  assists: number
  yellow_cards: number
  red_cards: number
  mvp: number
  breakdown: unknown
  participation_matches: unknown
  scoped_match_ids: unknown
}

interface MatchCorrectionRawRow {
  id: string
  match_record_id: string
  previous_result_type: string | null
  new_result_type: string | null
  correction_reason: string
  corrected_at: Date
}

interface AttendanceCursor {
  startAt: string
  eventId: string
  personId: string
}

interface ReportCursor {
  name: string
  id: string
}

function iso(value: Date | string | null | undefined): string | null {
  return value ? new Date(value).toISOString() : null
}

function decodeCursor<T>(raw: string | undefined, secret: Buffer, domain: string): T | null {
  if (!raw) return null
  try {
    const [body, signature, ...rest] = raw.split(".")
    if (!body || !signature || rest.length > 0) throw new Error("shape")
    const expected = createHmac("sha256", secret).update(`${domain}:${body}`).digest("base64url")
    const a = Buffer.from(signature)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error("signature")
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as T
  } catch {
    throw new AppError("INVALID_CURSOR", "Invalid cursor", "transport")
  }
}

function encodeCursor(value: unknown, secret: Buffer, domain: string): string {
  const body = Buffer.from(JSON.stringify(value)).toString("base64url")
  const signature = createHmac("sha256", secret).update(`${domain}:${body}`).digest("base64url")
  return `${body}.${signature}`
}

const PAGE_SIZE = 50

/**
 * RC-10 / RC-11. Proyecciones en caliente; ninguna tabla de verdad nueva.
 * Las correcciones se leen en lote con los ids REALes de la página (sin N+1).
 */
export class ReportReadService {
  private readonly cursorSecret: Buffer

  constructor() {
    this.cursorSecret = createHash("sha256").update("gei-t06-report-cursor-v1").digest()
  }

  async attendance(
    tx: Transaction<DatabaseSchema>,
    scope: T06Scope,
    params: { seasonId?: string; teamId?: string; eventId?: string; cursor?: string; limit?: number },
  ): Promise<AttendanceReportDto> {
    assertReportAuthority(scope)
    const period = await resolveSeasonId(tx, params.seasonId, scope, new Date())
    const cursor = decodeCursor<AttendanceCursor>(params.cursor, this.cursorSecret, "attendance")
    const limit = Math.min(Math.max(params.limit ?? PAGE_SIZE, 1), 200)
    const selfOnly = !scope.isSubcommittee && scope.coachTeamIds.length === 0 && scope.captainTeamIds.length === 0
    // PLAYER sin rol deportivo ve únicamente sus propias filas (se aplica al result set final).
    const ownPredicate = selfOnly ? sql`and cv.person_id = ${sql.val(scope.personId)}::uuid` : sql``
    // Kysely interpola arrays con ',' — hay que unir explícitamente con AND.
    const predicateParts = [eventAuthorityPredicate(scope)]
    if (period.seasonId) predicateParts.push(seasonFilter(period.seasonId))
    if (params.eventId) predicateParts.push(eventFilter(params.eventId))
    if (params.teamId) predicateParts.push(teamFilter(params.teamId))
    const predicates = sql.join(predicateParts, sql` and `)
    const keyset = cursor
      ? sql`and (coalesce(e.start_at, 'epoch'::timestamptz), e.id::text, cv.person_id::text)
             > (${sql.val(cursor.startAt)}::timestamptz, ${sql.val(cursor.eventId)}::text, ${sql.val(cursor.personId)}::text)`
      : sql``

    const result = await sql<AttendanceRawRow>`
      with expected_population as (
        select e.id as event_id, etp.person_id
        from app.events e
        join app.event_target_person etp on etp.event_id = e.id
        where 1=1 and ${predicates}
        union
        select e.id as event_id, ta.person_id
        from app.events e
        join app.event_target_team ett on ett.event_id = e.id
        join app.team_assignments ta on ta.team_id = ett.team_id
        where 1=1 and ${predicates}
      ),
      scoped_sheets as (
        select s.id as sheet_id, s.event_id
        from app.attendance_sheets s
        where exists (select 1 from expected_population ep where ep.event_id = s.event_id)
      ),
      current_values as (
        select ep.event_id, ep.person_id, ae.id as entry_id, ss.sheet_id,
               case when ae.id is null or ae.value is null then 'UNRECORDED' else ae.value end as value,
               ae.recorded_at, ae.corrected_at
        from expected_population ep
        join scoped_sheets ss on ss.event_id = ep.event_id
        left join app.attendance_entries ae
               on ae.sheet_id = ss.sheet_id and ae.person_id = ep.person_id
      ),
      counts as (
        select sheet_id,
          count(*) filter (where value = 'PRESENT')::int as n_present,
          count(*) filter (where value = 'ABSENT')::int as n_absent,
          count(*) filter (where value = 'JUSTIFIED')::int as n_justified,
          count(*) filter (where value = 'UNRECORDED')::int as n_unrecorded
        from current_values group by sheet_id
      )
      select cv.*, c.n_present, c.n_absent, c.n_justified, c.n_unrecorded,
             p.first_name, p.last_name, e.title, e.start_at
      from current_values cv
      join counts c on c.sheet_id = cv.sheet_id
      join app.people p on p.id = cv.person_id
      join app.events e on e.id = cv.event_id
      where 1=1 ${keyset} ${ownPredicate}
      order by coalesce(e.start_at, 'epoch'::timestamptz) asc, e.id asc, cv.person_id asc
      limit ${limit + 1}
    `.execute(tx)

    const rows = result.rows
    const hasMore = rows.length > limit
    const page = rows.slice(0, limit)
    const entryIds = page.map((row) => row.entry_id).filter((id): id is string => Boolean(id))
    const corrections = entryIds.length > 0
      ? (await sql<CorrectionRawRow>`select * from app.attendance_corrections
          where entry_id = any(${sql.val(entryIds)}::uuid[])
          order by corrected_at desc, id desc`.execute(tx)).rows
      : []
    const correctionsByEntry = new Map<string, AttendanceCorrectionDto[]>()
    for (const row of corrections) {
      const list = correctionsByEntry.get(row.entry_id) ?? []
      list.push({
        id: row.id,
        previousValue: row.previous_value,
        newValue: row.new_value,
        reason: row.correction_reason,
        correctedAt: iso(row.corrected_at)!,
      })
      correctionsByEntry.set(row.entry_id, list)
    }

    const items: AttendanceReportRowDto[] = page.map((row) => {
      const counts = { present: row.n_present, absent: row.n_absent, justified: row.n_justified, unrecorded: row.n_unrecorded }
      return {
        personId: row.person_id,
        personName: `${row.first_name} ${row.last_name}`.trim(),
        eventId: row.event_id,
        eventTitle: row.title,
        sheetId: row.sheet_id,
        eventStartAt: iso(row.start_at),
        seasonId: period.seasonId,
        teamId: params.teamId ?? null,
        attendance: {
          value: row.value,
          recordedAt: iso(row.recorded_at),
          correctedAt: iso(row.corrected_at),
          missingRow: row.entry_id === null,
        },
        corrections: correctionsByEntry.get(row.entry_id ?? "") ?? [],
        links: {
          event: scope.isSubcommittee || scope.teamIds.length > 0 ? `/events/${row.event_id}` : null,
          person: row.person_id === scope.personId || scope.isAdmin ? `/people/${row.person_id}` : null,
        },
        presencePercentage: ReportPercentagePolicy.computePresencePercentage(counts),
        counts,
        visibleFields: personVisibleFields(scope, row.person_id),
        allowedActions: reportAllowedActions(scope, row.person_id),
      }
    })

    const last = page.at(-1)
    return {
      items,
      state: items.length === 0 ? "NO_DATA" : "OK",
      pageMeta: {
        hasMore,
        cursor: hasMore && last
          ? encodeCursor({
              startAt: iso(last.start_at) ?? "1970-01-01T00:00:00.000Z",
              eventId: last.event_id,
              personId: last.person_id,
            }, this.cursorSecret, "attendance")
          : null,
      },
      links: { hub: "/reports" },
      period,
    }
  }

  async performance(
    tx: Transaction<DatabaseSchema>,
    scope: T06Scope,
    params: { seasonId?: string; teamId?: string; cursor?: string; limit?: number },
  ): Promise<PerformanceReportDto> {
    assertReportAuthority(scope)
    const period = await resolveSeasonId(tx, params.seasonId, scope, new Date())
    const cursor = decodeCursor<ReportCursor>(params.cursor, this.cursorSecret, "performance")
    const limit = Math.min(Math.max(params.limit ?? PAGE_SIZE, 1), 200)
    const selfOnly = !scope.isSubcommittee && scope.coachTeamIds.length === 0 && scope.captainTeamIds.length === 0
    const ownPredicate = selfOnly ? sql`and pp.person_id = ${sql.val(scope.personId)}::uuid` : sql``
    const keyset = cursor
      ? sql`and (p.last_name, p.first_name, p.id::text) > (${sql.val(cursor.name.split("|")[0] ?? "")}::text, ${sql.val(cursor.name.split("|")[1] ?? "")}::text, ${sql.val(cursor.id)}::text)`
      : sql``

    // matchesPlayed = count(match_records WHERE result_type='PLAYED'). Nunca Attendance ni stats.
    // La identidad del participante NO depende de tener stats: se deriva del roster
    // canónico (team_assignments vigente sobre equipos destino a la fecha local del
    // evento, igual que resolveEventRoster) y se conservan además quienes tienen stats.
    const result = await sql<PerformanceRawRow>`
      with scoped_matches as (
        select mr.id as match_record_id, mr.match_id as event_id, mr.state, mr.result_type,
               mr.finalized_at, e.start_at, e.time_zone
        from app.match_records mr
        join app.events e on e.id = mr.match_id
        where 1=1 and ${sql.join([
          eventAuthorityPredicate(scope),
          ...(period.seasonId ? [seasonFilter(period.seasonId)] : []),
          ...(params.teamId ? [teamFilter(params.teamId)] : []),
        ], sql` and `)}
      ),
      played as (select * from scoped_matches where result_type = 'PLAYED'),
      participation_identity as (
        select distinct pl.match_record_id, ta.person_id
        from played pl
        join app.event_target_team ett on ett.event_id = pl.event_id
        join app.team_assignments ta on ta.team_id = ett.team_id
        where ta.valid_from::date <= coalesce((pl.start_at at time zone pl.time_zone)::date, current_date)
          and (ta.valid_until is null or ta.valid_until::date > coalesce((pl.start_at at time zone pl.time_zone)::date, current_date))
        union
        select distinct pl.match_record_id, s.person_id
        from played pl
        join app.player_match_stats s on s.match_record_id = pl.match_record_id
      ),
      per_person as (
        select pi.person_id,
          count(distinct pi.match_record_id)::int as matches_played,
          coalesce(sum(s.minutes_played), 0)::int as minutes_played,
          coalesce(sum(s.goals), 0)::int as goals,
          coalesce(sum(s.assists), 0)::int as assists,
          coalesce(sum(s.yellow_cards), 0)::int as yellow_cards,
          coalesce(sum(s.red_cards), 0)::int as red_cards,
          count(s.id) filter (where s.mvp)::int as mvp,
          json_agg(distinct pi.match_record_id) as participation_matches
        from participation_identity pi
        left join app.player_match_stats s
               on s.match_record_id = pi.match_record_id and s.person_id = pi.person_id
        group by pi.person_id
      ),
      breakdown as (
        select s.person_id, json_agg(json_build_object(
          'matchRecordId', sm.match_record_id, 'eventId', sm.event_id,
          'state', sm.state, 'resultType', sm.result_type,
          'finalizedAt', sm.finalized_at, 'minutesPlayed', s.minutes_played,
          'goals', s.goals, 'assists', s.assists,
          'yellowCards', s.yellow_cards, 'redCards', s.red_cards, 'mvp', s.mvp,
          'countsAsPlayed', sm.result_type = 'PLAYED'
        ) order by sm.event_id) as items
        from scoped_matches sm
        join app.player_match_stats s on s.match_record_id = sm.match_record_id
        group by s.person_id
      ),
      scoped_ids as (select json_agg(match_record_id) as ids from scoped_matches)
      select pp.*, b.items as breakdown, p.first_name, p.last_name, si.ids as scoped_match_ids
      from per_person pp
      left join breakdown b on b.person_id = pp.person_id
      join app.people p on p.id = pp.person_id
      cross join scoped_ids si
      where 1=1 ${keyset} ${ownPredicate}
      order by p.last_name asc, p.first_name asc, p.id asc
      limit ${limit + 1}
    `.execute(tx)

    const rows = result.rows
    const hasMore = rows.length > limit
    const page = rows.slice(0, limit)
    const matchesFor = (row: PerformanceRawRow): string[] =>
      Array.isArray(row.participation_matches) ? row.participation_matches as string[] : []
    const matchIds = page.flatMap(matchesFor)
    const scopedIds = rows[0] && Array.isArray(rows[0].scoped_match_ids) ? rows[0].scoped_match_ids as string[] : []
    const allCorrectionIds = [...new Set([...matchIds, ...scopedIds])]
    const corrections = allCorrectionIds.length > 0
      ? (await sql<MatchCorrectionRawRow>`select * from app.matchrecord_corrections
          where match_record_id = any(${sql.val(allCorrectionIds)}::uuid[])
          order by corrected_at desc, id desc`.execute(tx)).rows
      : []
    const reportCorrections = corrections.map((item) => ({
      id: item.id,
      previousResultType: item.previous_result_type,
      newResultType: item.new_result_type,
      reason: item.correction_reason,
      correctedAt: iso(item.corrected_at)!,
    }))
    const correctionsByMatch = new Map<string, MatchCorrectionRawRow[]>()
    for (const row of corrections) {
      const list = correctionsByMatch.get(row.match_record_id) ?? []
      list.push(row)
      correctionsByMatch.set(row.match_record_id, list)
    }

    const items: PerformanceReportRowDto[] = page.map((row) => ({
      personId: row.person_id,
      personName: `${row.first_name} ${row.last_name}`.trim(),
      totals: {
        matchesPlayed: row.matches_played,
        minutesPlayed: row.minutes_played,
        goals: row.goals,
        assists: row.assists,
        yellowCards: row.yellow_cards,
        redCards: row.red_cards,
        mvp: row.mvp,
      },
      breakdown: (Array.isArray(row.breakdown) ? row.breakdown : []) as PerformanceReportRowDto["breakdown"],
      corrections: [...new Set(matchesFor(row))].flatMap((id) =>
        (correctionsByMatch.get(id) ?? []).map((item) => ({
          id: item.id,
          previousResultType: item.previous_result_type,
          newResultType: item.new_result_type,
          reason: item.correction_reason,
          correctedAt: iso(item.corrected_at)!,
        })),
      ),
      links: { person: row.person_id === scope.personId || scope.isAdmin ? `/people/${row.person_id}` : null },
      visibleFields: personVisibleFields(scope, row.person_id),
      allowedActions: reportAllowedActions(scope, row.person_id),
    }))

    const last = page.at(-1)
    return {
      items,
      state: items.length === 0 ? "NO_DATA" : "OK",
      pageMeta: {
        hasMore,
        cursor: hasMore && last
          ? encodeCursor({ name: `${last.last_name}|${last.first_name}`, id: last.person_id }, this.cursorSecret, "performance")
          : null,
      },
      links: { hub: "/reports" },
      period,
      corrections: reportCorrections,
    }
  }
}
