import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router"

/**
 * Estado de navegación en la URL (Stage 6 §14).
 * Filtros, tabs, búsqueda, mes y vista sobreviven a Back y al refresh.
 */
export function useQueryState() {
  const [params, setParams] = useSearchParams()

  const get = useCallback(
    (key: string, fallback = "") => params.get(key) ?? fallback,
    [params],
  )

  const set = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params)
      Object.entries(patch).forEach(([key, value]) => {
        if (value === null || value === "") next.delete(key)
        else next.set(key, value)
      })
      setParams(next, { replace: true })
    },
    [params, setParams],
  )

  const reset = useCallback(
    (keys: string[]) => {
      const next = new URLSearchParams(params)
      keys.forEach((key) => next.delete(key))
      setParams(next, { replace: true })
    },
    [params, setParams],
  )

  return useMemo(
    () => ({ get, set, reset, params, has: (key: string) => params.has(key) }),
    [get, set, reset, params],
  )
}