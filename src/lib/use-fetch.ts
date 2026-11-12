import { useCallback, useEffect, useRef, useState } from "react"

/** Small data-fetching hook for the T03 surfaces (no external query lib). */
export function useFetch<T>(loader: () => Promise<T>, deps: readonly unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const seq = useRef(0)
  const loaderRef = useRef(loader)
  loaderRef.current = loader

  const reload = useCallback(async () => {
    const ticket = ++seq.current
    setLoading(true)
    setError(null)
    try {
      const value = await loaderRef.current()
      if (ticket === seq.current) setData(value)
      return value
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo cargar"
      if (ticket === seq.current) setError(message)
      return null
    } finally {
      if (ticket === seq.current) setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    void reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error, reload, setData }
}

export function useMutation<TArgs, TResult>(fn: (args: TArgs) => Promise<TResult>) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const run = useCallback(async (args: TArgs): Promise<TResult | null> => {
    setBusy(true)
    setError(null)
    try {
      return await fn(args)
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo completar la acción"
      setError(message)
      return null
    } finally {
      setBusy(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return { run, busy, error, setError }
}
