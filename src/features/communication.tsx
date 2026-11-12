import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { Bell, Megaphone, MessagesSquare } from "lucide-react"
import { useFetch } from "../lib/use-fetch"
import {
  fetchMarkNotificationRead,
  fetchNotificationList,
  type NotificationDto,
} from "../lib/t03-api"
import { relativeLabel } from "../lib/dates"
import {
  Button,
  Empty,
  RowLink,
  RowStatic,
  Surface,
  Tag,
  cx,
} from "../shared/ui"
import { PageContextHeader } from "../shared/patterns"
import { useUnreadCount } from "../lib/use-unread-count"

const NOTICE_TYPE_TEXT: Record<NotificationDto["type"], string> = {
  EVENT_CHANGED: "Cambio en el evento",
  EVENT_POSTPONED: "Evento postergado",
  EVENT_RESCHEDULED: "Evento reprogramado",
  EVENT_CANCELLED: "Evento cancelado",
  EVENT_RESTORED: "Evento restaurado",
  SELECTION_PUBLISHED: "Convocatoria publicada",
  ANNOUNCEMENT_PUBLISHED: "Anuncio publicado",
}

/* ─────────────────────────────────────────────
   COMUNICACIÓN HOME
   ───────────────────────────────────────────── */

export function CommunicationHome() {
  const { unread } = useUnreadCount()
  return (
    <div className="gei-stack-page mx-auto max-w-3xl">
      <PageContextHeader
        context="Comunicación"
        title="Comunicación"
        lead="Avisos del club y novedades que te afectan."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/notifications" className="group block rounded-surface border border-line bg-surface p-5 transition-colors hover:border-interactive">
          <Bell size={22} aria-hidden className="text-ink-faint group-hover:text-interactive" />
          <p className="mt-3 text-body font-semibold text-ink">Avisos</p>
          <p className="mt-1 text-meta text-ink-muted">Cambios en eventos que te afectan, con estado de lectura.</p>
          {(unread ?? 0) > 0 && <div className="mt-3"><Tag tone="selected">{unread} sin leer</Tag></div>}
        </Link>
        <div className="rounded-surface border border-line bg-control p-5">
          <Megaphone size={22} aria-hidden className="text-ink-faint" />
          <p className="mt-3 text-body font-semibold text-ink">Anuncios y conversaciones</p>
          <p className="mt-1 text-meta text-ink-muted">Llegan con la T05 (Announcements &amp; Conversations). Cuando estén disponibles, vas a verlos acá.</p>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   NUEVA CONVERSACIÓN / CONVERSACIÓN / ANUNCIO (T05)
   ───────────────────────────────────────────── */

export function NewConversation() {
  return <T05Notice title="Las conversaciones llegan con la T05" />
}

export function ConversationPage() {
  return <T05Notice title="Las conversaciones llegan con la T05" />
}

export function AnnouncementDetail() {
  return <T05Notice title="Los anuncios llegan con la T05" />
}

export function AnnouncementForm() {
  return <T05Notice title="Los anuncios llegan con la T05" />
}

function T05Notice({ title }: { title: string }) {
  const navigate = useNavigate()
  return (
    <div className="mx-auto max-w-2xl">
      <PageContextHeader context="Comunicación" title={title} back="/communication" />
      <Surface className="grid gap-3">
        <MessagesSquare size={20} aria-hidden className="text-ink-faint" />
        <p className="gei-meta">Esta capacidad no está implementada todavía: no hay backend de conversaciones ni de anuncios en esta versión, y no se simulan mensajes ni destinatarios.</p>
        <div><Button variant="secondary" onClick={() => navigate("/communication")}>Volver a Comunicación</Button></div>
      </Surface>
    </div>
  )
}

/* ─────────────────────────────────────────────
   AVISOS (RC-18) — reales, con marcado de leído
   ───────────────────────────────────────────── */

export function Notifications() {
  const [onlyUnread, setOnlyUnread] = useState(false)
  const [markingAll, setMarkingAll] = useState(false)
  const { data, loading, error, reload, setData } = useFetch(
    () => fetchNotificationList({ unread: onlyUnread ? true : undefined, limit: 100 }),
    [onlyUnread],
  )
  const { reload: reloadBadge } = useUnreadCount()
  const items = useMemo(() => data?.items ?? [], [data])
  const unread = items.filter((item) => item.isUnread)

  async function markRead(id: string) {
    try {
      await fetchMarkNotificationRead(id)
      setData((current) =>
        current
          ? { items: current.items.map((item) => (item.id === id ? { ...item, isUnread: false, readAt: new Date().toISOString() } : item)) }
          : current,
      )
      void reloadBadge()
    } catch {
      void reload()
    }
  }

  async function markAllRead() {
    setMarkingAll(true)
    try {
      for (const item of items.filter((entry) => entry.isUnread)) {
        await fetchMarkNotificationRead(item.id)
      }
      await reload()
      void reloadBadge()
    } finally {
      setMarkingAll(false)
    }
  }

  return (
    <div className="gei-stack-page mx-auto max-w-3xl">
      <PageContextHeader
        context="Avisos"
        title="Avisos"
        lead="Lo que cambió y te afecta."
        back="/communication"
        action={
          <div className="flex items-center gap-2">
            <Button variant={onlyUnread ? "primary" : "secondary"} size="sm" onClick={() => setOnlyUnread((v) => !v)}>
              {onlyUnread ? "Viendo sin leer" : "Ver solo sin leer"}
            </Button>
            {unread.length > 0 && (
              <Button variant="secondary" size="sm" busy={markingAll} onClick={markAllRead}>Marcar todo</Button>
            )}
          </div>
        }
      />

      {loading && <p className="gei-meta">Cargando avisos…</p>}
      {error && (
        <Surface className="grid gap-2">
          <p className="gei-meta">No pudimos cargar los avisos: {error}</p>
          <Button variant="secondary" size="sm" onClick={reload}>Reintentar</Button>
        </Surface>
      )}

      {!loading && !error && items.length === 0 && (
        <Empty title={onlyUnread ? "No hay avisos sin leer" : "No tenés avisos"} detail="Cuando cambie algo que te afecta, aparece acá." />
      )}

      {!loading && !error && items.length > 0 && (
        <Surface flush>
          <ul className="grid px-1 py-1">
            {items.map((notice) => {
              const target = notice.originEventId ? `/events/${notice.originEventId}` : "/calendar"
              return (
                <li key={notice.id}>
                  <RowStatic
                    title={notice.title}
                    detail={
                      <span className="grid gap-1">
                        <span className="text-meta font-semibold uppercase tracking-wide text-ink-faint">
                          {NOTICE_TYPE_TEXT[notice.type] ?? "Aviso del club"}
                        </span>
                        <span>{notice.body}</span>
                        {notice.originEventId && (
                          <Link to={target} className="text-meta font-semibold text-interactive hover:underline">
                            Abrir el evento
                          </Link>
                        )}
                      </span>
                    }
                    meta={
                      <span className="grid gap-1 text-right">
                        {notice.isUnread && (
                          <span className="inline-flex items-center gap-1.5">
                            <span aria-hidden className="size-2 rounded-pill bg-unread" />
                            <span className="text-meta font-semibold text-selected">Sin leer</span>
                          </span>
                        )}
                        <span className="gei-meta tabular-nums">{relativeLabel(notice.occurredAt)}</span>
                      </span>
                    }
                    trailing={notice.isUnread ? (
                      <Button variant="quiet" size="sm" onClick={() => void markRead(notice.id)}>Marcar leído</Button>
                    ) : undefined}
                  />
                </li>
              )
            })}
          </ul>
        </Surface>
      )}
    </div>
  )
}
