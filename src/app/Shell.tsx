import { useEffect, useRef, useState } from "react"
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router"
import {
  Bell,
  CalendarDays,
  ChevronDown,
  Ellipsis,
  House,
  MessageSquare,
  Search,
  Users,
} from "lucide-react"
import { useProduct } from "../lib/session-context"
import { routeContext } from "../shared/nav-context"
import { Avatar, Toast, cx } from "../shared/ui"
import { relativeLabel } from "../mock/model"
import { RuntimeStatus } from "../shared/runtime-status"

type Page = string

const NAV: Array<{ to: string; label: string; icon: typeof House; page: Page }> = [
  { to: "/home", label: "Inicio", icon: House, page: "home" },
  { to: "/calendar", label: "Calendario", icon: CalendarDays, page: "calendar" },
  { to: "/teams", label: "Equipos", icon: Users, page: "teams" },
  {
    to: "/communication",
    label: "Comunicación",
    icon: MessageSquare,
    page: "communication",
  },
  { to: "/more", label: "Más", icon: Ellipsis, page: "more" },
]

function sectionActive(to: string, path: string) {
  const children: Record<string, string[]> = {
    "/calendar": ["/events", "/jornadas"],
    "/communication": ["/conversations", "/announcements"],
    "/more": ["/management", "/reports", "/audit"],
    "/teams": ["/people"],
  }
  return (children[to] || []).some((prefix) => path.startsWith(prefix))
}

export function Shell() {
  const {
    state,
    actor,
    authority,
    toastMessage,
    authenticated,
    canAccessApplication: hasAccess,
    logout,
    loading: sessionLoading,
  } = useProduct()
  const location = useLocation()
  const navigate = useNavigate()

  const visibleNav = NAV.filter((item) => authority.canOpen(item.page))

  const unread = state.notifications.filter(
    (notice) =>
      notice.recipients.includes(actor?.id ?? "") && !notice.readBy.includes(actor?.id ?? ""),
  ).length
  const unreadMessages = state.conversations
    .filter(
      (conversation) =>
        conversation.state === "ACTIVE" &&
        conversation.participants.includes(actor?.id ?? ""),
    )
    .reduce((sum, conversation) => sum + (conversation.unread[actor?.id ?? ""] ?? 0), 0)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        navigate("/search")
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [navigate])

  if (sessionLoading)
    return (
      <main className="grid min-h-dvh place-items-center">
        <p className="gei-meta">Cargando…</p>
      </main>
    )

  if (!authenticated) return <Navigate to="/login" replace />
  if (!hasAccess)
    return location.pathname === "/more/profile" ? (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Outlet />
      </main>
    ) : (
      <Navigate to="/no-access" replace />
    )

  return (
    <div className="min-h-dvh overflow-x-clip">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-ink focus:px-4 focus:py-2 focus:text-body focus:text-white"
      >
        Ir al contenido
      </a>

      {/* Barra superior: contexto, búsqueda, avisos, cuenta */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur-sm">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
          <Link
            to="/home"
            className="flex items-center gap-2 lg:hidden"
            aria-label="GEI Hockey · Inicio"
          >
            <span className="flex size-9 items-center justify-center rounded-control bg-brand text-body-strong text-brand-ink">
              GEI
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 lg:block">
            <p className="gei-micro">Hockey</p>
            <p className="truncate text-body font-semibold text-ink">
              {routeContext(location.pathname)}
            </p>
          </div>
          <div className="min-w-0 flex-1 lg:hidden">
            <p className="truncate text-body font-semibold text-ink">
              {routeContext(location.pathname)}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <RuntimeStatus />
            <Link
              to="/search"
              className="gei-target-sm hidden items-center gap-2 rounded-control px-2.5 text-meta text-ink-muted transition-colors hover:bg-control hover:text-ink sm:inline-flex"
            >
              <Search size={16} aria-hidden />
              Buscar
              <kbd className="ml-3 rounded border border-line px-1.5 py-0.5 text-micro">
                ⌘K
              </kbd>
            </Link>
            <Link
              to="/search"
              aria-label="Buscar"
              className="flex size-11 items-center justify-center rounded-control text-ink-muted transition-colors hover:bg-control hover:text-ink sm:hidden"
            >
              <Search size={19} aria-hidden />
            </Link>
            <Link
              to="/notifications"
              aria-label={
                unread > 0 ? `Avisos, ${unread} sin leer` : "Avisos, todo leído"
              }
              className="relative flex size-11 items-center justify-center rounded-control text-ink-muted transition-colors hover:bg-control hover:text-ink"
            >
              <Bell size={19} aria-hidden />
              {unread > 0 && (
                <>
                  <span
                    aria-hidden
                    className="absolute right-2.5 top-2.5 size-2 rounded-pill bg-unread ring-2 ring-surface"
                  />
                </>
              )}
            </Link>
            <Link
              to="/more/profile"
              className="ml-1 flex items-center rounded-control p-0.5 transition-colors hover:bg-control"
              aria-label="Mi perfil"
            >
              <Avatar name={actor?.name ?? ""} size="sm" selected />
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Destinos en desktop: los mismos 5, sin drawer */}
        <nav
          aria-label="Destinos"
          className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-[224px] shrink-0 flex-col gap-1 overflow-y-auto border-r border-line bg-surface px-3 py-4 lg:flex"
        >
          {visibleNav.map(({ to, label, icon: Icon }) => {
            const active =
              location.pathname === to || sectionActive(to, location.pathname)
            return (
              <NavLink
                key={to}
                to={to}
                className={cx(
                  "gei-target flex items-center gap-3 rounded-control px-3 text-body font-semibold transition-colors duration-micro",
                  active
                    ? "bg-selected-soft text-selected"
                    : "text-ink-muted hover:bg-control hover:text-ink",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={19} aria-hidden strokeWidth={1.9} />
                {label}
                {to === "/communication" && unreadMessages > 0 && (
                  <span className="ml-auto inline-flex items-center gap-1 text-meta font-semibold text-selected">
                    <span aria-hidden className="size-2 rounded-pill bg-unread" />
                    {unreadMessages}
                  </span>
                )}
                {to === "/more" && unread > 0 && (
                  <span className="ml-auto inline-flex items-center gap-1 text-meta font-semibold text-selected">
                    <span aria-hidden className="size-2 rounded-pill bg-unread" />
                    {unread}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        <main
          id="contenido"
          className="min-w-0 flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-16"
        >
          <Outlet />
        </main>
      </div>

      {/* Destinos en mobile: los mismos 5 */}
      <nav
        aria-label="Destinos"
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {visibleNav.map(({ to, label, icon: Icon }) => {
          const active =
            location.pathname === to || sectionActive(to, location.pathname)
          return (
            <NavLink
              key={to}
              to={to}
              aria-current={active ? "page" : undefined}
              className={cx(
                "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-0 py-2 text-micro font-semibold transition-colors",
                active ? "text-selected" : "text-ink-muted",
              )}
            >
              <Icon size={20} aria-hidden strokeWidth={1.9} />
              <span className="max-w-full truncate">{label}</span>
            </NavLink>
          )
        })}
      </nav>

      <Toast message={toastMessage ?? ""} />
    </div>
  )
}

export function useUnreadSummary() {
  const { state, actor } = useProduct()
  const notices = state.notifications.filter((notice) =>
    notice.recipients.includes(actor?.id ?? ""),
  )
  return {
    unread: notices.filter((notice) => !notice.readBy.includes(actor?.id ?? "")).length,
    newest: notices[0]
      ? { at: relativeLabel(notices[0]!.at, new Date()), title: notices[0]!.title }
      : null,
  }
}
