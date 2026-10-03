import {
  useEffect,
  useRef,
  useId,
  type ReactNode,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
} from "react"
import { Link, useNavigate } from "react-router"
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  X,
  AlertCircle,
  Check,
  CalendarDays,
  MapPin,
  Dumbbell,
  Flag,
} from "lucide-react"
import {
  labels,
  eventName,
  dateLabel,
  initials,
  type Event,
} from "../mock/model"
import { stateText, stateTone } from "./states"
import { useProduct } from "../mock/store"
export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger"
}) {
  return (
    <button
      {...props}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors disabled:opacity-45 ${
        variant === "primary"
          ? "bg-primary text-white hover:bg-primary/90"
          : variant === "danger"
            ? "bg-danger text-white hover:bg-danger/90"
            : variant === "secondary"
              ? "border border-border bg-card hover:bg-muted"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
      } ${className}`}
    >
      {children}
    </button>
  )
}
export function IconButton({
  children,
  label,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      {...props}
      aria-label={label}
      title={label}
      className="flex size-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-primary disabled:opacity-40"
    >
      {children}
    </button>
  )
}
export function Avatar({
  name,
  size = "md",
  blue = false,
}: {
  name: string
  size?: "sm" | "md" | "lg"
  blue?: boolean
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${
        blue ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground"
      } ${
        size === "sm"
          ? "size-8 text-[10px]"
          : size === "lg"
            ? "size-16 text-lg"
            : "size-10 text-xs"
      }`}
    >
      {initials(name)}
    </span>
  )
}
export function Badge({
  value,
  children,
}: {
  value?: string
  children?: ReactNode
}) {
  const tone = stateTone(value || "")
  const style =
    tone === "success"
      ? "bg-success-soft text-success"
      : tone === "warning"
        ? "bg-warning-soft text-warning"
        : tone === "danger"
          ? "bg-danger-soft text-danger"
          : tone === "info"
            ? "bg-primary-soft text-primary"
            : "bg-muted text-muted-foreground"
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold leading-tight ${style}`}
    >
      {children || (value ? stateText(value) : "")}
    </span>
  )
}
export function Header({
  eyebrow,
  title,
  description,
  action,
  back,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  back?: string
}) {
  const navigate = useNavigate()
  return (
    <div className="mb-7">
      <div className="mb-3 flex items-center gap-2">
        {back && (
          <button
            onClick={() => navigate(back)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            <ArrowLeft size={14} />
            Volver
          </button>
        )}
        {eyebrow && (
          <span className="text-[11px] font-medium text-muted-foreground">
            {eyebrow}
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[27px] font-semibold leading-tight tracking-[-0.5px]">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-[13px] text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
    </div>
  )
}
export function Section({
  title,
  aside,
  children,
  className = "",
}: {
  title: string
  aside?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={className}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  )
}
export function Surface({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-border bg-card ${className}`}
    >
      {children}
    </div>
  )
}
export function TextField({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block space-y-2 text-xs font-medium">
      <span>{label}</span>
      <input
        {...props}
        className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-[13px] font-normal disabled:bg-muted"
      />
    </label>
  )
}
export function Select({
  label,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <label className="block space-y-2 text-xs font-medium">
      {label && <span>{label}</span>}
      <select
        {...props}
        aria-label={label || "Filtrar"}
        className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-[13px] font-normal"
      >
        {children}
      </select>
    </label>
  )
}
export function TextArea({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}) {
  const id = useId()
  return (
    <div className="block space-y-2 text-xs font-medium">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full resize-y rounded-lg border border-border bg-card px-3 py-2.5 text-[13px] font-normal"
      />
    </div>
  )
}
export function Alert({
  children,
  tone = "warning",
}: {
  children: ReactNode
  tone?: "warning" | "info" | "error" | "success"
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-lg border p-4 text-[13px] ${
        tone === "error"
          ? "border-danger/15 bg-danger-soft text-danger"
          : tone === "info"
            ? "border-primary/10 bg-primary-soft text-primary"
            : tone === "success"
              ? "border-success/15 bg-success-soft text-success"
              : "border-warning/15 bg-warning-soft text-warning"
      }`}
    >
      <AlertCircle size={17} className="mt-0.5 shrink-0" />
      <div className="min-w-0 leading-relaxed">{children}</div>
    </div>
  )
}
export function Empty({
  title,
  detail,
  children,
  icon,
}: {
  title: string
  detail: string
  children?: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex justify-center text-muted-foreground">
        {icon ?? <CalendarDays size={26} />}
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
        {detail}
      </p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  )
}
export function Modal({
  title,
  children,
  onClose,
  footer,
}: {
  title: string
  children: ReactNode
  onClose: () => void
  footer?: ReactNode
}) {
  const dialog = useRef<HTMLElement>(null)
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    const previous = document.activeElement as HTMLElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const controls = () =>
      Array.from(
        dialog.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href]",
        ) || [],
      )
    controls()[0]?.focus()
    function keyboard(event: KeyboardEvent) {
      if (event.key === "Escape") close.current()
      if (event.key === "Tab") {
        const elements = controls()
        const first = elements[0]
        const last = elements.at(-1)
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener("keydown", keyboard)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener("keydown", keyboard)
      previous?.focus()
    }
  }, [])
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/35 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      onClick={onClose}
    >
      <section
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex max-h-[90dvh] w-full max-w-lg flex-col rounded-t-2xl bg-card shadow-2xl sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <IconButton label="Cerrar" onClick={onClose}>
            <X size={19} />
          </IconButton>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
        {footer && (
          <div className="flex flex-wrap justify-end gap-2 border-t border-border p-4">
            {footer}
          </div>
        )}
      </section>
    </div>
  )
}
export function RowLink({
  to,
  title,
  detail,
  icon,
  aside,
}: {
  to: string
  title: string
  detail?: string
  icon?: ReactNode
  aside?: ReactNode
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 border-b border-border px-5 py-4 transition-colors last:border-b-0 hover:bg-primary-soft/40"
    >
      {icon}
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold">{title}</div>
        {detail && (
          <div className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            {detail}
          </div>
        )}
      </div>
      {aside}
      <ChevronRight size={16} className="shrink-0 text-muted-foreground/60" />
    </Link>
  )
}
export function EventIcon({ type }: { type: Event["type"] }) {
  const Icon =
    type === "MATCH" ? Flag : type === "TRAINING" ? Dumbbell : CalendarDays
  return (
    <span
      className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
        type === "MATCH"
          ? "bg-primary-soft text-primary"
          : "bg-muted text-muted-foreground"
      }`}
    >
      <Icon size={18} />
    </span>
  )
}
export function EventRow({
  event,
  showDate = true,
}: {
  event: Event
  showDate?: boolean
}) {
  const { state } = useProduct()
  const teamName =
    state.teams.find((team) => team.id === event.team)?.name || "Equipo"
  return (
    <Link
      to={`/events/${event.id}`}
      className="group flex items-center gap-3 border-b border-border px-5 py-4 last:border-b-0 hover:bg-primary-soft/35"
    >
      <EventIcon type={event.type} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[13px] font-semibold">{eventName(event)}</h3>
          {["POSTPONED", "CANCELLED", "COMPLETED"].includes(event.state) && (
            <Badge value={event.state} />
          )}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          <span>
            {event.clubWide ? "Todo hockey" : teamName} · {labels[event.type]}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {event.venue}
          </span>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-[13px] font-semibold tabular-nums">
          {event.state === "POSTPONED" ? "A definir" : event.time}
        </div>
        {showDate && (
          <div className="mt-1 text-[10px] text-muted-foreground">
            {dateLabel(event.date)}
          </div>
        )}
      </div>
      <ChevronRight
        size={15}
        className="hidden text-muted-foreground/50 sm:block"
      />
    </Link>
  )
}
export function TextLink({ to, children }: {
  to: string
  children: ReactNode
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:underline"
    >
      {children}
      <ArrowRight size={13} />
    </Link>
  )
}
export function Saved({ saving }: { saving: boolean }) {
  return (
    <span
      role="status"
      className="flex items-center gap-1.5 text-xs text-muted-foreground"
    >
      {saving ? (
        <span className="size-3 animate-spin rounded-full border-2 border-border border-t-primary" />
      ) : (
        <Check size={14} className="text-success" />
      )}
      {saving ? "Guardando…" : "Guardado"}
    </span>
  )
}
