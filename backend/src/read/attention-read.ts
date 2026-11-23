import { sql, type RawBuilder, type Transaction } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import type { AttentionItemDto, AttentionListDto, AttentionSourceType, Severity } from "../../../shared/contracts/t06.js"
import { buildAttentionList, EMPTY_ATTENTION_COPY } from "./attention-engine.js"
import { eventAuthorityPredicate, type T06Scope } from "./t06-scope.js"

interface AttentionRaw {
  source_id: string
  person_id: string | null
  event_id: string | null
  start_at: Date | null
  revision_id: string | null
  detail: string | null
}

function iso(value: Date | string | null | undefined): string | null {
  return value ? new Date(value).toISOString() : null
}

const SOURCE_LABELS: Record<AttentionSourceType, { stateText: string; reason: string; consequence: string; severity: Severity; action: string }> = {
  AVAILABILITY: { stateText: "Reconfirmá tu disponibilidad", reason: "El evento cambió después de tu respuesta", consequence: "Tu respuesta anterior quedó desactualizada", severity: "MEDIUM", action: "Responder" },
  SELECTION_REVISION: { stateText: "Convocatoria en borrador", reason: "Hay una revisión sin publicar", consequence: "Los jugadores aún no ven la convocatoria", severity: "MEDIUM", action: "Revisar convocatoria" },
  SELECTION_CONFLICT: { stateText: "Conflicto en la convocatoria", reason: "Un convocado ya no cumple el destino o la afiliación", consequence: "La convocatoria puede contener una persona no elegible", severity: "HIGH", action: "Revisar conflicto" },
  ATTENDANCE_SHEET: { stateText: "Planilla de asistencia abierta", reason: "La planilla no fue cerrada", consequence: "El registro de asistencia está incompleto", severity: "HIGH", action: "Cerrar planilla" },
  MATCH_RECORD: { stateText: "Acta de partido en borrador", reason: "El acta no fue finalizada", consequence: "El resultado no es oficial", severity: "HIGH", action: "Finalizar acta" },
  ANNOUNCEMENT: { stateText: "Comunicado en borrador", reason: "El comunicado no fue publicado", consequence: "La audiencia aún no lo recibió", severity: "MEDIUM", action: "Publicar" },
  EVENT_CHANGE: { stateText: "Cambio de coordinación", reason: "El evento fue modificado", consequence: "Revisá la nueva información", severity: "MEDIUM", action: "Ver evento" },
  NOTIFICATION_CONTEXT: { stateText: "Comunicación sin leer", reason: "Contexto de comunicaciones", consequence: "Sólo contexto, no resuelve una condición operativa", severity: "LOW", action: "Ver comunicación" },
}

/**
 * RC-22 — ocho fuentes operativas congeladas. Novena fuente (Notification)
 * deliberadamente NO implementada: decisión A-02, `enabled:false`, CONTEXT_ONLY.
 * No existe persistencia `attention_items`: todo se deriva en caliente.
 */
export class AttentionReadService {
  async list(
    tx: Transaction<DatabaseSchema>,
    scope: T06Scope,
    evaluationInstant: Date,
    options: { limit?: number } = {},
  ): Promise<AttentionListDto> {
    const selfOnly = !scope.isSubcommittee && scope.coachTeamIds.length === 0 && scope.captainTeamIds.length === 0 && scope.eventScopeIds.length === 0
    const selfPredicate = selfOnly ? sql`and ar.person_id = ${sql.val(scope.personId)}::uuid` : sql``
    const selfPredicatePopulation = selfOnly ? sql`and population.person_id = ${sql.val(scope.personId)}::uuid` : sql``
    const scopePredicate = eventAuthorityPredicate(scope)
    const sources: AttentionRaw[] = []
    let failures = 0

    const collect = async (query: RawBuilder<AttentionRaw>): Promise<void> => {
      try {
        sources.push(...(await query.execute(tx)).rows)
      } catch {
        failures += 1
      }
    }

    // 1 — Availability NEEDS_RECONFIRMATION
    await collect(sql<AttentionRaw>`
      select ar.person_id, e.id as event_id, e.start_at, null::uuid as revision_id, 'Reconfirmación requerida' as detail
      from app.availability_responses ar join app.events e on e.id = ar.event_id
      where ar.coordination_revision < e.coordination_revision
        and e.state in ('SCHEDULED','IN_PROGRESS','POSTPONED')
        and (${scopePredicate}) ${selfPredicate}
    `)

    // 2 — Availability NO_RESPONSE (población esperada del target)
    await collect(sql<AttentionRaw>`
      select population.person_id, population.event_id, e.start_at, null::uuid as revision_id, 'Sin respuesta de disponibilidad' as detail
      from (
        select e.id as event_id, etp.person_id from app.events e join app.event_target_person etp on etp.event_id = e.id
        union
        select e.id as event_id, ta.person_id from app.events e
          join app.event_target_team ett on ett.event_id = e.id
          join app.team_assignments ta on ta.team_id = ett.team_id
      ) population
      join app.events e on e.id = population.event_id
      where e.state in ('SCHEDULED','IN_PROGRESS','POSTPONED')
        and not exists (select 1 from app.availability_responses ar where ar.event_id = population.event_id and ar.person_id = population.person_id)
        and (${scopePredicate}) ${selfPredicatePopulation}
    `)

    // 3 — SelectionRevision DRAFT
    await collect(sql<AttentionRaw>`
      select null::uuid as person_id, e.id as event_id, e.start_at, sr.id as revision_id, 'Revisión de convocatoria en borrador' as detail
      from app.selections s
      join app.selection_revisions sr on sr.id = s.current_draft_revision_id and sr.state = 'DRAFT'
      join app.events e on e.id = s.match_id
      where 1=1 and (${scopePredicate})
    `)

    // 4 — Selection conflicts (condición derivada de los owners)
    await collect(sql<AttentionRaw>`
      select se.person_id, e.id as event_id, e.start_at, sr.id as revision_id, 'Convocado sin vínculo vigente' as detail
      from app.selection_entries se
      join app.selection_revisions sr on sr.id = se.revision_id and sr.state = 'DRAFT'
      join app.selections s on s.current_draft_revision_id = sr.id
      join app.events e on e.id = s.match_id
      where 1=1 and (${scopePredicate})
        and (
          not exists (select 1 from app.event_target_person etp where etp.event_id = e.id and etp.person_id = se.person_id)
          and not exists (
            select 1 from app.event_target_team ett
            join app.team_assignments ta on ta.team_id = ett.team_id and ta.person_id = se.person_id
            where ett.event_id = e.id
          )
        )
    `)

    // 5 — AttendanceSheet OPEN
    await collect(sql<AttentionRaw>`
      select null::uuid as person_id, e.id as event_id, e.start_at, null::uuid as revision_id, 'Planilla sin cerrar' as detail
      from app.attendance_sheets s join app.events e on e.id = s.event_id
      where s.closed_at is null and (${scopePredicate})
    `)

    // 6 — MatchRecord DRAFT
    await collect(sql<AttentionRaw>`
      select null::uuid as person_id, e.id as event_id, e.start_at, null::uuid as revision_id, 'Acta en borrador' as detail
      from app.match_records mr join app.events e on e.id = mr.match_id
      where mr.state = 'DRAFT' and (${scopePredicate})
    `)

    // 7 — Announcement DRAFT (SUBCOMMITTEE / club)
    if (scope.isSubcommittee) {
      await collect(sql<AttentionRaw>`
        select null::uuid as person_id, null::uuid as event_id, null::timestamp as start_at, null::uuid as revision_id, title as detail
        from app.announcements where state = 'DRAFT'
      `)
    }

    // 8 — Evento de coordinación (cambios materiales recientes desde Audit)
    await collect(sql<AttentionRaw>`
      select null::uuid as person_id, e.id as event_id, e.start_at, null::uuid as revision_id, 'Cambio material del evento' as detail
      from app.audit_entries a join app.events e on e.id = a.target_id::uuid
      where a.target_type = 'EVENT'
        and a.action in ('EVENT_RESCHEDULED','EVENT_POSTPONED','EVENT_CHANGED','EVENT_CANCELLED')
        and a.occurred_at >= ${sql.val(evaluationInstant)}::timestamptz - interval '7 days'
        and (${scopePredicate})
    `)

    const sourceForRaw = (raw: AttentionRaw): AttentionSourceType => {
      if (raw.detail === "Reconfirmación requerida" || raw.detail === "Sin respuesta de disponibilidad") return "AVAILABILITY"
      if (raw.detail === "Revisión de convocatoria en borrador") return "SELECTION_REVISION"
      if (raw.detail === "Convocado sin vínculo vigente") return "SELECTION_CONFLICT"
      if (raw.detail === "Planilla sin cerrar") return "ATTENDANCE_SHEET"
      if (raw.detail === "Acta en borrador") return "MATCH_RECORD"
      if (raw.event_id === null) return "ANNOUNCEMENT"
      return "EVENT_CHANGE"
    }

    const items: AttentionItemDto[] = sources.map((raw, index) => {
      const sourceType = sourceForRaw(raw)
      const meta = SOURCE_LABELS[sourceType]
      const to = sourceType === "ANNOUNCEMENT" ? null
        : sourceType === "AVAILABILITY" && raw.person_id === scope.personId && raw.event_id
          ? `/events/${raw.event_id}/availability`
          : raw.event_id ? `/events/${raw.event_id}` : null
      return {
        id: `${sourceType}:${raw.event_id ?? raw.detail}:${raw.person_id ?? raw.revision_id ?? index}`,
        dedupeKey: sourceType === "AVAILABILITY"
          ? `availability:${raw.detail === "Reconfirmación requerida" ? "person" : "none"}:${raw.event_id}:${raw.person_id ?? ""}`
          : sourceType === "SELECTION_REVISION" ? `selectionrev:${raw.revision_id}`
          : sourceType === "SELECTION_CONFLICT" ? `selectionconflict:${raw.person_id}:${raw.event_id}`
          : sourceType === "ATTENDANCE_SHEET" ? `sheet:${raw.event_id}`
          : sourceType === "MATCH_RECORD" ? `matchrecord:${raw.event_id}`
          : sourceType === "ANNOUNCEMENT" ? `announcement:${raw.detail}`
          : `event:${raw.event_id}:coordination`,
        sourceType,
        sourceId: raw.event_id ?? raw.revision_id ?? raw.detail ?? String(index),
        stateText: meta.stateText,
        reason: raw.detail ? `${meta.reason} (${raw.detail})` : meta.reason,
        consequence: meta.consequence,
        deadline: iso(raw.start_at),
        severity: meta.severity,
        action: { label: meta.action, to },
        visibleFields: { eventId: raw.event_id, personId: raw.person_id, revisionId: raw.revision_id },
        allowedActions: to ? ["attention.open"] : [],
        audienceScope: scope.isSubcommittee ? "CLUB" : scope.teamIds.length > 0 ? "TEAM" : "SELF",
      }
    })

    const result = buildAttentionList(items, {
      limit: options.limit,
      sourceFailures: failures,
      totalSources: scope.isSubcommittee ? 8 : 7,
    })
    return {
      items: result.items,
      state: result.state,
      pageMeta: { cursor: null, hasMore: result.total > result.items.length },
      blocks: result.items.length === 0 ? [] : [{ key: "attention" }],
      total: result.total,
    }
  }
}

export { EMPTY_ATTENTION_COPY }
