import { useEffect, useState, type FormEvent } from "react"
import { Link } from "react-router"
import { Button, Empty, FilterChip, Surface } from "../shared/ui"
import { PageContextHeader } from "../shared/patterns"
import { useQueryState } from "../shared/use-query-state"
import { useT06Invalidation, useT06Search } from "../lib/use-t06-queries"
import type { SearchResultType } from "../../shared/contracts/t06"

const TYPES: Array<{ value: SearchResultType | ""; label: string }> = [
  { value: "", label: "Todo" },
  { value: "person", label: "Personas" },
  { value: "team", label: "Equipos" },
  { value: "division", label: "Divisiones" },
  { value: "line", label: "Líneas" },
  { value: "event", label: "Eventos" },
  { value: "announcement", label: "Comunicados" },
  { value: "conversation", label: "Conversaciones" },
]

/** Search — 7 tipos, ranking exact→prefix→fuzzy, cursor en URL, sin `total`. */
export default function T06Search() {
  const queryState = useQueryState()
  const urlQ = queryState.get("q")
  const urlType = queryState.get("type")
  const cursor = queryState.get("cursor")
  const [input, setInput] = useState(urlQ)
  const type = (TYPES.some((item) => item.value === urlType) ? urlType : "") as SearchResultType | ""

  useEffect(() => setInput(urlQ), [urlQ])

  const { data, loading, error, reload } = useT06Search({ q: urlQ, type, cursor, enabled: Boolean(urlQ) })
  useT06Invalidation(["search"], reload)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    queryState.set({ q: input.trim(), cursor: null })
  }

  return (
    <div className="gei-stack-page mx-auto max-w-5xl">
      <PageContextHeader context="Búsqueda" title="Buscar" lead="Encontrá personas, equipos, eventos y comunicaciones a las que tenés acceso." />

      <form onSubmit={submit} className="flex flex-wrap gap-2" role="search">
        <label className="sr-only" htmlFor="t06-q">Buscar</label>
        <input
          id="t06-q"
          className="min-w-0 flex-1 rounded-control border border-line-strong bg-surface px-3 py-2.5 text-body"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Nombre, equipo, evento…"
          autoComplete="off"
        />
        <Button type="submit">Buscar</Button>
      </form>

      <div className="flex flex-wrap gap-2" aria-label="Filtrar por tipo">
        {TYPES.map((item) => (
          <FilterChip
            key={item.value}
            active={type === item.value}
            onClick={() => queryState.set({ type: item.value || null, cursor: null })}
          >
            {item.label}
          </FilterChip>
        ))}
      </div>

      {loading && <p className="gei-meta" role="status">Cargando resultados…</p>}
      {error && (
        <Empty
          title="No se pudo completar la búsqueda"
          detail="Tu búsqueda se conservó. Podés reintentar."
          action={<Button onClick={() => void reload()}>Reintentar</Button>}
        />
      )}

      {data?.state === "EMPTY_QUERY" && <p className="gei-meta">Ingresá un término para buscar.</p>}
      {data?.state === "NO_RESULTS" && (
        <Empty title="Sin resultados" detail={`No encontramos resultados para «${data.normalizedQuery}» con tus permisos actuales.`} />
      )}

      {data && data.items.length > 0 && (
        <Surface>
          <ul className="grid gap-2" aria-label="Resultados de búsqueda">
            {data.items.map((item) => (
              <li key={`${item.type}:${item.id}`} className="flex flex-wrap items-center justify-between gap-2 border-b border-line py-2 last:border-0">
                <div>
                  {item.to ? <Link className="gei-link-target" to={item.to}>{item.title}</Link> : <span>{item.title}</span>}
                  <p className="gei-meta">{item.context}{item.subtitle ? ` · ${item.subtitle}` : ""}</p>
                </div>
                <span className="gei-meta" aria-label={`Posición ${item.rank.tier}`}>{item.rank.tier > 0 ? `Nivel ${item.rank.tier}` : ""}</span>
              </li>
            ))}
          </ul>
        </Surface>
      )}

      {data?.pageMeta.hasMore && data.pageMeta.cursor && (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={() => queryState.set({ cursor: data.pageMeta.cursor })}>Cargar más</Button>
        </div>
      )}
      {cursor && (
        <Button variant="quiet" onClick={() => queryState.set({ cursor: null })}>Volver a la primera página</Button>
      )}
      {data && <span className="sr-only" aria-live="polite">{`Página ${data.page}`}</span>}
    </div>
  )
}
