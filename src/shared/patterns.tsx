import type { ReactNode } from "react"
import { useNavigate } from "react-router"
import { ArrowLeft } from "lucide-react"
import { Modal, Badge } from "./ui"
import { stateText, stateTone } from "./states"

/**
 * Gramática compartida TARGET (Stage 4 §15).
 * SITUACIÓN → ACCIÓN → INFORMACIÓN. L0 → L4.
 * Los nombres son de presentación; lo que importa es no duplicar JSX en 38 screens.
 */

export function PageContextHeader({
  context,
  title,
  description,
  back,
  action,
}: {
  context: string
  title: string
  description?: string
  back?: string
  action?: ReactNode
}) {
  const navigate = useNavigate()
  return (
    <div className="gei-group-stack mb-6">
      <div className="flex items-center gap-2">
        {back && (
          <button
            onClick={() => navigate(back)}
            className="flex min-h-11 items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-primary"
          >
            <ArrowLeft size={15} />
            Volver
          </button>
        )}
        <span className="gei-page-context">{context}</span>
      </div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="gei-page-title">{title}</h1>
          {description && <p className="gei-body mt-1.5 text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
    </div>
  )
}

export function StateBanner({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warning" | "error" | "success"
  title: string
  children?: ReactNode
}) {
  const styles =
    tone === "error"
      ? "border-danger/15 bg-danger-soft text-danger"
      : tone === "success"
        ? "border-success/15 bg-success-soft text-success"
        : tone === "warning"
          ? "border-warning/15 bg-warning-soft text-warning"
          : "border-primary/10 bg-primary-soft text-primary"
  return (
    <div role="status" className={`rounded-xl border p-4 ${styles}`}>
      <p className="text-[13px] font-semibold leading-snug">{title}</p>
      {children && <div className="gei-body mt-1.5 opacity-90">{children}</div>}
    </div>
  )
}

export function SectionHeader({ title, aside }: { title: string; aside?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="gei-section-title">{title}</h2>
      {aside}
    </div>
  )
}

export function StatusText({ value }: { value: string }) {
  return (
    <span className="gei-body">
      <span className="font-semibold">{stateText(value)}</span>
    </span>
  )
}

export function StateBadge({ value }: { value: string }) {
  const tone = stateTone(value)
  const cls =
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
      className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold leading-tight ${cls}`}
    >
      {stateText(value)}
    </span>
  )
}

/** Badge legacy: mapea tono fuera del primitive (Stage 4 §17). */
export function LegacyBadge({ value, children }: { value?: string; children?: ReactNode }) {
  return <Badge value={value}>{children}</Badge>
}

export function MetaRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <span className="gei-meta shrink-0">{label}</span>
      <span className="gei-body min-w-0 text-right">{value}</span>
    </div>
  )
}

export function StickyActionBar({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-5 border-t border-border bg-card/95 px-5 py-3 backdrop-blur-sm sm:mx-0 sm:rounded-xl sm:border sm:px-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">{children}</div>
    </div>
  )
}

export function EventSummary({
  title,
  when,
  where,
  status,
}: {
  title: string
  when: string
  where: string
  status?: string
}) {
  return (
    <div className="gei-group-stack rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="gei-body-strong flex-1">{title}</p>
        {status && <StateBadge value={status} />}
      </div>
      <p className="gei-body text-muted-foreground">
        {when} · {where}
      </p>
    </div>
  )
}

export function ImpactPreview({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <div className="rounded-xl border border-warning/20 bg-warning-soft p-4">
      <p className="text-[13px] font-semibold text-warning">Antes de confirmar, revisá el impacto</p>
      <ul className="gei-body mt-2 list-disc space-y-1 pl-5 text-warning">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

/** FDPG-01: scope de serie en vocabulario usuario (nunca "EventSeries"). */
export type SeriesScope = "ONLY_THIS" | "THIS_AND_FOLLOWING" | "ENTIRE_SERIES"

export const SERIES_SCOPE_OPTIONS: Array<{ value: SeriesScope; title: string; detail: string }> = [
  { value: "ONLY_THIS", title: "Solo este evento", detail: "No cambia el resto de la serie." },
  { value: "THIS_AND_FOLLOWING", title: "Este y los siguientes", detail: "Mantiene lo anterior, cambia lo que viene." },
  { value: "ENTIRE_SERIES", title: "Toda la serie", detail: "Aplica el cambio a todos los eventos." },
]

export function ScopeDialog({
  onClose,
  onPick,
}: {
  onClose: () => void
  onPick: (scope: SeriesScope) => void
}) {
  return (
    <Modal
      title="¿Dónde querés aplicar el cambio?"
      onClose={onClose}
      footer={
        <p className="gei-meta w-full text-left">
          Primero elegís el alcance. Después ves el impacto antes de confirmar.
        </p>
      }
    >
      <div className="grid gap-2">
        {SERIES_SCOPE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onPick(opt.value)}
            className="rounded-xl border border-border p-4 text-left transition-colors hover:border-primary/40 hover:bg-primary-soft/40"
          >
            <span className="block text-[13px] font-semibold">{opt.title}</span>
            <span className="gei-body mt-1 block text-muted-foreground">{opt.detail}</span>
          </button>
        ))}
      </div>
    </Modal>
  )
}

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <h2 className="gei-section-title mb-3">{title}</h2>
      <div className="grid gap-3">{children}</div>
    </section>
  )
}

export function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-4 py-3 sm:px-5">
        <h2 className="gei-section-title">{title}</h2>
      </div>
      <div className="px-4 py-2 sm:px-5">{children}</div>
    </section>
  )
}

export function TimelineEntry({
  date,
  actor,
  action,
  resource,
}: {
  date: string
  actor: string
  action: string
  resource?: string
}) {
  return (
    <div className="flex gap-3 border-b border-border py-3 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold">{action}</p>
        <p className="gei-meta mt-1">
          {actor} · {date}
          {resource ? ` · ${resource}` : ""}
        </p>
      </div>
    </div>
  )
}
