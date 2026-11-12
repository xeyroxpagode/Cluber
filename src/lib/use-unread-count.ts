import { useCallback, useEffect, useState } from "react"
import { fetchNotificationList, subscribeRealtime } from "./t03-api"

/** Unread notification count, kept fresh by the realtime invalidation stream (GEI RT). */
export function useUnreadCount() {
  const [unread, setUnread] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    try {
      const res = await fetchNotificationList({ unread: true, limit: 200 })
      setUnread(res.items.length)
    } catch {
      setUnread(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void reload()
    const unsubscribe = subscribeRealtime((event) => {
      if (event.invalidate?.includes("notifications")) void reload()
    })
    const interval = window.setInterval(reload, 60_000)
    return () => {
      unsubscribe()
      window.clearInterval(interval)
    }
  }, [reload])

  return { unread, loading, reload }
}
