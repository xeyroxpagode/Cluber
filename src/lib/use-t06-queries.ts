/**
 * Hooks T06 sobre `useFetch`: estados honestos (loading/empty/error), sin
 * TanStack Query y sin caché que autorice. Cada invalidación SSE provoca refetch.
 */
import { useCallback, useEffect, useMemo, useRef } from "react"
import { useFetch } from "./use-fetch"
import { subscribeRealtime } from "./t03-api"
import { useProduct } from "./session-context"
import { getAttention, getAttendanceReport, getHome, getPerformanceReport, searchT06 } from "./t06-api"
import type { SearchResultType } from "../../shared/contracts/t06"

/**
 * SSE invalida; REST refetch es la verdad. Un frame nunca confirma que una acción
 * quedó resuelta: sólo dispara una nueva lectura autorizada. Dedupe por
 * (event, resourceType, resourceId) y limpieza al cambiar de identidad/sesión.
 */
export function useT06Invalidation(tokens: readonly string[], reload: () => void | Promise<unknown>): void {
  const { principal, csrfToken } = useProduct()
  const seen = useRef(new Set<string>())
  const tokenKey = tokens.join(",")

  useEffect(() => { seen.current.clear() }, [principal?.personId, csrfToken])

  useEffect(() => {
    const active = tokenKey.split(",").filter(Boolean)
    if (active.length === 0) return
    return subscribeRealtime((event) => {
      const invalidated = event.invalidate ?? []
      if (!active.some((token) => invalidated.includes(token))) return
      const key = `${event.event ?? ""}:${event.resourceType ?? ""}:${event.resourceId ?? ""}`
      if (seen.current.has(key)) return
      seen.current.add(key)
      void reload()
    })
  }, [tokenKey, reload])
}

export function useHome() {
  const loader = useCallback(() => getHome(), [])
  return useFetch(loader, [])
}

export function useAttention(limit?: number) {
  const loader = useCallback(() => getAttention(limit), [limit])
  return useFetch(loader, [limit])
}

export function useT06Search(query: { q: string; type?: SearchResultType | ""; cursor?: string; enabled?: boolean }) {
  const loader = useCallback(
    () => searchT06({ q: query.q, type: query.type, cursor: query.cursor }),
    [query.q, query.type, query.cursor],
  )
  const result = useFetch(loader, [query.q, query.type, query.cursor, query.enabled !== false])
  return useMemo(() => (query.enabled === false ? { ...result, loading: false } : result), [result, query.enabled])
}

export function useAttendanceReport(params: { seasonId?: string; teamId?: string; eventId?: string; cursor?: string }) {
  const loader = useCallback(() => getAttendanceReport(params), [params.seasonId, params.teamId, params.eventId, params.cursor])
  return useFetch(loader, [params.seasonId, params.teamId, params.eventId, params.cursor])
}

export function usePerformanceReport(params: { seasonId?: string; teamId?: string; cursor?: string }) {
  const loader = useCallback(() => getPerformanceReport(params), [params.seasonId, params.teamId, params.cursor])
  return useFetch(loader, [params.seasonId, params.teamId, params.cursor])
}
