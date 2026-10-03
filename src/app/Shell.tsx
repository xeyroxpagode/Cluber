import { useEffect, useState } from "react"
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router"
import {
  House,
  CalendarDays,
  Users,
  MessageSquare,
  Ellipsis,
  Search,
  Bell,
  ChevronDown,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react"
import { useProduct } from "../mock/store"
import { canReadNotice, noticeRead } from "../mock/permissions"
import { scenario, scenarioLabels } from "../mock/scenarios"
import { Avatar, Alert, Button } from "../shared/ui"
import { labels } from "../mock/model"
const nav = [
  { to: "/home", label: "Inicio", icon: House },
  { to: "/calendar", label: "Calendario", icon: CalendarDays },
  { to: "/teams", label: "Equipos", icon: Users },
  { to: "/communication", label: "Comunicación", icon: MessageSquare },
  { to: "/more", label: "Más", icon: Ellipsis },
]
function sectionActive(to: string, path: string) {
  const children: Record<string, string[]> = {
    "/calendar": ["/events", "/jornadas"],
    "/communication": ["/conversations", "/announcements"],
    "/more": ["/management", "/reports", "/audit"],
  }
  return (children[to] || []).some((prefix) => path.startsWith(prefix))
}
export function Shell() {
  const { state, actor, toastMessage, capabilities, authenticated, hasAccess } =
    useProduct()
  const location = useLocation()
  const unread = state.notifications.filter(
    (item) => !noticeRead(actor, item) && canReadNotice(actor, item),
  ).length
  const unreadMessages = state.conversations
    .filter((item) => item.participants.includes(actor.id))
    .reduce((sum, item) => sum + item.unread, 0)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(scenario === "loading")
  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(timer)
  }, [loading])
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault()
        navigate("/search")
      }
    }
    document.addEventListener("keydown", shortcut)
    return () => document.removeEventListener("keydown", shortcut)
  }, [navigate])
  if (!authenticated) return <Navigate to="/login" replace />
  if (!hasAccess)
    return location.pathname === "/more/profile" ? (
      <main className="mx-auto max-w-3xl p-6">
        <Outlet />
      </main>
    ) : (
      <Navigate to="/no-access" replace />
    )
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[224px] flex-col border-r border-border bg-card lg:flex">
        <Link to="/home" className="flex items-center gap-3 px-6 pb-8 pt-8">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-[16px] font-extrabold tracking-[-1px] text-white">
            GEI
          </span>
          <span>
            <span className="block text-[15px] font-bold">GEI Hockey</span>
            <span className="mt-0.5 block text-[9px] font-medium tracking-[1.5px] text-muted-foreground">
              GESTIÓN DEPORTIVA
            </span>
          </span>
        </Link>
        <div className="mx-4 mb-6 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5">
          <span className="size-1.5 rounded-full bg-success" />
          <span className="flex-1 text-[11px] font-medium">Temporada 2026</span>
          <CalendarDays size={13} className="text-muted-foreground" />
        </div>
        <nav className="space-y-1 px-3">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-[13px] font-medium ${
                  isActive || sectionActive(to, location.pathname)
                    ? "bg-primary-soft text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`
              }
            >
              <Icon size={18} strokeWidth={1.7} />
              {label}
              {to === "/communication" &&
                capabilities.chat &&
                unreadMessages > 0 && (
                  <span className="ml-auto flex size-5 items-center justify-center rounded-md bg-primary/10 text-[10px] text-primary">
                    {unreadMessages}
                  </span>
                )}
            </NavLink>
          ))}
        </nav>
        <div className="mx-6 mt-8 border-t border-border pt-6">
          <div className="mb-3 text-[9px] font-semibold tracking-[1.4px] text-muted-foreground">
            MI ESPACIO
          </div>
          {actor.team && (
            <Link
              to={`/teams/${actor.team}`}
              className="flex items-center gap-2 text-xs font-medium"
            >
              <span className="size-2 rounded-full bg-primary" />
              {state.teams.find((team) => team.id === actor.team)?.name}
              <ArrowUpRight
                size={12}
                className="ml-auto text-muted-foreground"
              />
            </Link>
          )}
          {capabilities.management && (
            <Link to="/management" className="flex items-center gap-2 text-xs">
              <ShieldCheck size={14} />
              Administración
            </Link>
          )}
        </div>
        <div className="mt-auto">
          <div className="mx-5 mb-5 rounded-lg bg-background p-3">
            <span className="text-[10px] font-semibold text-foreground">
              Un equipo, un mismo lugar.
            </span>
            <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground">
              Todo lo que necesitás para el día a día del hockey.
            </p>
          </div>
          <Link
            to="/more/profile"
            className="flex items-center gap-3 border-t border-border p-5"
          >
            <Avatar name={actor.name} blue />
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-semibold">
                {actor.name}
              </span>
              <span className="mt-1 block text-[10px] text-muted-foreground">
                {labels[actor.role]}
                {actor.team ? " · Sexta A" : ""}
              </span>
            </span>
            <ChevronDown size={13} className="text-muted-foreground" />
          </Link>
        </div>
      </aside>
      <div className="lg:pl-[224px]">
        <header className="sticky top-0 z-20 flex h-[65px] items-center justify-between gap-4 border-b border-border bg-card/95 px-5 backdrop-blur-sm sm:px-8">
          <div className="hidden text-xs text-muted-foreground sm:block">
            Hockey <span className="mx-2 text-border">/</span>
            <span className="font-medium text-foreground">
              {location.pathname.startsWith("/events")
                ? "Eventos"
                : location.pathname.startsWith("/teams")
                  ? "Equipos"
                  : location.pathname.startsWith("/calendar")
                    ? "Calendario"
                    : location.pathname.startsWith("/communication") ||
                        location.pathname.startsWith("/conversations")
                      ? "Comunicación"
                      : location.pathname.startsWith("/management")
                        ? "Administración"
                        : location.pathname === "/home"
                          ? "Inicio"
                          : "Mi espacio"}
            </span>
          </div>
          <Link to="/home" className="text-sm font-bold text-primary sm:hidden">
            GEI Hockey
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/search"
              aria-label="Buscar"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-[11px] text-muted-foreground hover:bg-muted"
            >
              <Search size={16} />
              <span className="hidden md:inline">Buscar en GEI</span>
              <kbd className="ml-7 hidden rounded border border-border px-1.5 py-0.5 text-[9px] md:inline">
                ⌘ K
              </kbd>
            </Link>
            <span className="mx-2 hidden h-5 w-px bg-border sm:block" />
            <Link
              to="/notifications"
              aria-label={`Notificaciones, ${unread} sin leer`}
              className="relative rounded-lg p-2.5 text-muted-foreground hover:bg-muted"
            >
              <Bell size={19} />
              {unread > 0 && (
                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary ring-2 ring-card" />
              )}
            </Link>
            <Link to="/more/profile" className="ml-2">
              <Avatar name={actor.name} size="sm" blue />
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-[1440px] px-5 pb-28 pt-7 sm:px-8 sm:pt-9 lg:px-10 lg:pb-12">
          {scenario === "degraded" && (
            <div className="mb-6">
              <Alert tone="error">
                {scenarioLabels.degraded}
                <p className="mt-2 text-xs">
                  La demostración mantiene los datos visibles. No se descarta
                  ningún formulario.
                </p>
              </Alert>
            </div>
          )}
          {loading ? (
            <div
              role="status"
              aria-label="Cargando información"
              className="space-y-7"
            >
              <div className="h-8 w-52 animate-pulse rounded bg-border motion-reduce:animate-none" />
              <div className="h-4 w-72 max-w-full animate-pulse rounded bg-border motion-reduce:animate-none" />
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-32 animate-pulse rounded-xl border border-border bg-card motion-reduce:animate-none"
                />
              ))}
              <span className="sr-only">Cargando información…</span>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
        <footer className="hidden items-center justify-between border-t border-border px-10 py-5 text-[10px] text-muted-foreground lg:flex">
          <span>GEI Hockey · Gimnasia y Esgrima de Ituzaingó</span>
          <span>Temporada 2026</span>
        </footer>
      </div>
      <nav
        aria-label="Navegación principal"
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-card pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1.5 py-3 text-[9px] font-medium ${
                isActive || sectionActive(to, location.pathname)
                  ? "text-primary"
                  : "text-muted-foreground"
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-[60] flex max-w-[90vw] -translate-x-1/2 items-center gap-3 rounded-xl bg-foreground px-5 py-3.5 text-xs text-white shadow-xl lg:bottom-6"
        >
          <CheckCircle2 size={17} className="shrink-0" />
          {toastMessage}
        </div>
      )}
    </div>
  )
}
