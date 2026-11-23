import { useEffect, useState, type ReactNode } from "react"
import { Link } from "react-router"
import { Button, DataTable, Empty, Surface } from "../shared/ui"
import { PageContextHeader, SectionHeader } from "../shared/patterns"
import { useQueryState } from "../shared/use-query-state"
import { useProduct } from "../lib/session-context"
import { useAttendanceReport, usePerformanceReport, useT06Invalidation } from "../lib/use-t06-queries"
import { reportHref } from "../lib/t06-navigation"
import { presenceLabel } from "../../shared/contracts/t06"

/** Reports Hub — doble barrera: la UI oculta, el backend autoriza (403 ADMIN-only). */
export function ReportsHub() {
  const { authority } = useProduct()
  const allowed = authority.roles.some((role) => role !== "ADMIN")
  if (!allowed) {
    return <Empty title="Sin acceso a informes" detail="Tu perfil no tiene capacidades deportivas sobre los informes." />
  }
  return (
    <div className="gei-stack-page mx-auto max-w-5xl">
      <PageContextHeader context="Informes" title="Informes deportivos" lead="Datos vigentes de asistencia y rendimiento según tu alcance." />
      <div className="grid gap-3 sm:grid-cols-2">
        <Surface>
          <h2 className="gei-body-strong">Asistencia</h2>
          <p className="gei-meta mt-1">Presencia efectiva por evento y persona, con historial de correcciones.</p>
          <Link className="gei-link-target mt-3 inline-block" to="/reports/attendance">Abrir informe de asistencia</Link>
        </Surface>
        <Surface>
          <h2 className="gei-body-strong">Rendimiento</h2>
          <p className="gei-meta mt-1">Partidos jugados, totales y desglose por partido.</p>
          <Link className="gei-link-target mt-3 inline-block" to="/reports/performance">Abrir informe de rendimiento</Link>
        </Surface>
      </div>
    </div>
  )
}

interface FilterProps {
  kind: "attendance" | "performance"
  seasonId: string
  teamId: string
  eventId?: string
}

function ReportFilters({ kind, seasonId, teamId, eventId }: FilterProps) {
  const query = useQueryState()
  const { fetchStructure } = useProduct()
  const [options, setOptions] = useState<{ seasons: Array<{ id: string; name: string }>; teams: Array<{ id: string; name: string }> }>({ seasons: [], teams: [] })
  useEffect(() => {
    let cancelled = false
    void fetchStructure().then((value) => {
      if (cancelled) return
      setOptions({
        seasons: (value.seasons ?? []).map((item: any) => ({ id: item.id, name: item.name })),
        teams: (value.teams ?? []).map((item: any) => ({ id: item.id, name: `Equipo ${item.id.slice(0, 8)}` })),
      })
    }).catch(() => setOptions({ seasons: [], teams: [] }))
    return () => { cancelled = true }
  }, [fetchStructure])
  return (
    <div className="flex flex-wrap gap-3">
      <label className="grid gap-1 text-meta">
        Temporada
        <select className="rounded-control border border-line-strong bg-surface px-3 py-2" value={seasonId}
          onChange={(event) => query.set({ seasonId: event.target.value || null, cursor: null })}>
          <option value="">Toda la temporada</option>
          {options.seasons.map((season) => <option key={season.id} value={season.id}>{season.name}</option>)}
        </select>
      </label>
      <label className="grid gap-1 text-meta">
        Equipo
        <select className="rounded-control border border-line-strong bg-surface px-3 py-2" value={teamId}
          onChange={(event) => query.set({ teamId: event.target.value || null, cursor: null })}>
          <option value="">Todos los equipos en scope</option>
          {options.teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
        </select>
      </label>
      {kind === "attendance" && eventId && <span className="gei-meta self-end">Evento filtrado</span>}
      <Link className="gei-link-target self-end" to={reportHref(kind, {})}>Limpiar filtros</Link>
    </div>
  )
}

function ReportState({ state, onRetry }: { state: string | undefined; onRetry: () => void }) {
  if (state === "NO_DATA") return <Empty title="Sin datos" detail="No hay registros para el período y alcance seleccionados." />
  if (state === "ERROR") return <Empty title="No se pudo cargar el informe" detail="La consulta falló. Podés reintentar." action={<Button onClick={onRetry}>Reintentar</Button>} />
  return null
}

/** Guardia de UI (el backend sigue siendo la frontera de autoridad). */
function ReportsGuard({ children }: { children: ReactNode }) {
  const { authority } = useProduct()
  if (!authority.roles.some((role) => role !== "ADMIN")) {
    return <Empty title="Sin acceso a informes" detail="Tu perfil no tiene capacidades deportivas sobre los informes." />
  }
  return <>{children}</>
}

export function AttendanceReport() {
  return <ReportsGuard><AttendanceReportView /></ReportsGuard>
}

function AttendanceReportView() {
  const query = useQueryState()
  const seasonId = query.get("seasonId"), teamId = query.get("teamId"), eventId = query.get("eventId")
  const { data, loading, error, reload } = useAttendanceReport({ seasonId, teamId, eventId, cursor: query.get("cursor") })
  useT06Invalidation(["reports"], reload)
  return (
    <div className="gei-stack-page mx-auto max-w-6xl">
      <PageContextHeader context="Informes" title="Asistencia" lead="Presencia física efectiva. UNRECORDED no cuenta como ausencia." back="/reports" />
      <ReportFilters kind="attendance" seasonId={seasonId} teamId={teamId} eventId={eventId} />
      {loading && <p className="gei-meta" role="status">Cargando…</p>}
      {(error || data?.state === "ERROR") && <ReportState state="ERROR" onRetry={() => void reload()} />}
      <ReportState state={data?.state} onRetry={() => void reload()} />
      {data && data.items.length > 0 && (
        <Surface>
          <DataTable
            caption={`Período: ${data.period.label}. % PRESENCIA = 100 × PRESENT / (PRESENT + ABSENT + JUSTIFIED).`}
            head={["Persona", "Evento", "Estado", "% PRESENCIA", "Correcciones"]}
          >
            {data.items.map((row) => (
              <tr key={`${row.eventId}:${row.personId}`} className="border-b border-line last:border-0">
                <td className="px-3 py-2">{row.personName}</td>
                <td className="px-3 py-2">{row.eventTitle}</td>
                <td className="px-3 py-2">
                  {row.attendance.value}
                  {row.attendance.missingRow && <span className="gei-meta ml-1">(sin fila)</span>}
                </td>
                <td className="px-3 py-2">{presenceLabel(row.presencePercentage?.value ?? null)}</td>
                <td className="px-3 py-2">{row.corrections.length}</td>
              </tr>
            ))}
          </DataTable>
        </Surface>
      )}
      {data?.pageMeta.hasMore && data.pageMeta.cursor && (
        <Button onClick={() => query.set({ cursor: data.pageMeta.cursor })}>Cargar más</Button>
      )}
    </div>
  )
}

export function PerformanceReport() {
  return <ReportsGuard><PerformanceReportView /></ReportsGuard>
}

function PerformanceReportView() {
  const query = useQueryState()
  const seasonId = query.get("seasonId"), teamId = query.get("teamId")
  const { data, loading, error, reload } = usePerformanceReport({ seasonId, teamId, cursor: query.get("cursor") })
  useT06Invalidation(["reports"], reload)
  return (
    <div className="gei-stack-page mx-auto max-w-6xl">
      <PageContextHeader context="Informes" title="Rendimiento" lead="Sólo partidos con resultado PLAYED; DRAFT, FORFEIT y ABANDONED quedan excluidos." back="/reports" />
      <ReportFilters kind="performance" seasonId={seasonId} teamId={teamId} />
      {loading && <p className="gei-meta" role="status">Cargando…</p>}
      {(error || data?.state === "ERROR") && <ReportState state="ERROR" onRetry={() => void reload()} />}
      <ReportState state={data?.state} onRetry={() => void reload()} />
      {data && data.items.length > 0 && (
        <Surface>
          <SectionHeader title="Partidos jugados y totales" meta={`Período: ${data.period.label}`} />
          <DataTable head={["Persona", "PJ", "Minutos", "Goles", "Asist."] } caption="Totales derivados de match_records con result_type = PLAYED.">
            {data.items.map((row) => (
              <tr key={row.personId} className="border-b border-line last:border-0">
                <td className="px-3 py-2">{row.personName}</td>
                <td className="px-3 py-2">{row.totals.matchesPlayed}</td>
                <td className="px-3 py-2">{row.totals.minutesPlayed}</td>
                <td className="px-3 py-2">{row.totals.goals}</td>
                <td className="px-3 py-2">{row.totals.assists}</td>
              </tr>
            ))}
          </DataTable>
          <div className="mt-4 grid gap-4">
            {data.items.map((row) => (
              <div key={`breakdown-${row.personId}`}>
                <p className="gei-body-strong">{row.personName} — detalle por partido</p>
                {row.breakdown.length === 0 ? (
                  <p className="gei-meta">Sin estadísticas registradas. Los partidos PLAYED sin estadísticas igual se contabilizan en PJ.</p>
                ) : (
                  <ul className="grid gap-1">
                    {row.breakdown.map((item) => (
                      <li key={item.matchRecordId} className="gei-meta flex flex-wrap justify-between gap-2">
                        <span>Estado: {item.state}{item.resultType ? ` · ${item.resultType}` : ""}</span>
                        <span className={item.countsAsPlayed ? "text-ink" : "text-ink-muted"}>
                          {item.countsAsPlayed ? "Cuenta como jugado" : "Registro, no cuenta como jugado"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Surface>
      )}
      {data?.pageMeta.hasMore && data.pageMeta.cursor && (
        <Button onClick={() => query.set({ cursor: data.pageMeta.cursor })}>Cargar más</Button>
      )}
    </div>
  )
}
