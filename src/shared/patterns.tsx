import type { ReactNode } from "react"
import { useNavigate } from "react-router"
import {
  Banner,
  Button,
  ConfirmDialog,
  Modal,
  Surface,
  cx,
  toneBadge,
} from "./ui"
import type { Tone } from "./states"

/**
 * Gramática compartida (Stage 6 §12).
 * SITUACIÓN → ACCIÓN → INFORMACIÓN. Patrones con consumidores reales:
 * PageContextHeader, StateBanner, ImpactPreview, TimelineEntry,
 * StickyActionBar, FormSection, DetailSection, StateBadge, StatusText.
 */

/* ── Encabezado de página: contexto → título → lead → acción ── */

export function PageContextHeader({
  context,
  title,
  lead,
  back,
  action,
  below,
}: {
  context: string
  title: string
  lead?: string
  back?: string
  action?: ReactNode
  below?: ReactNode
}) {
  const navigate = useNavigate()
  return (
    <header className="grid gap-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {back && (
          <button
            type="button"
            onClick={() => navigate(back)}
            className="gei-target-sm -ml-2 inline-flex items-center gap-1.5 rounded-control px-2 text-meta font-semibold text-ink-muted transition-colors hover:bg-control hover:text-ink"
          >
            <span aria-hidden>←</span>
            Volver
          </button>
        )}
        <p className="gei-page-context">{context}</p>
      </div>
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0 flex-1 basis-64">
          <h1 className="gei-page-title">{title}</h1>
          {lead && <p className="gei-page-lead mt-2 max-w-2xl">{lead}</p>}
        </div>
        {action && (
          <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto">
            {action}
          </div>
        )}
      </div>
      {below}
    </header>
  )
}

/* ── Identidad de sección ── */

export function SectionHeader({
  title,
  meta,
  hint,
  aside,
  action,
}: {
  title: string
  meta?: string
  hint?: string
  aside?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <div className="min-w-0">
        <h2 className="gei-section-title">{title}</h2>
        {hint && <p className="gei-meta mt-0.5">{hint}</p>}
      </div>
      {meta && <p className="gei-meta">{meta}</p>}
      {aside}
      {action}
    </div>
  )
}

/* ── Estado con consecuencia: el patrón de nivel 4 ── */

export function StateBanner({
  tone = "attention",
  title,
  children,
  action,
}: {
  tone?: Tone
  title: ReactNode
  children?: ReactNode
  action?: ReactNode
}) {
  return (
    <Banner tone={tone} title={title} action={action}>
      {children}
    </Banner>
  )
}

export function StatusText({ value, tone = "neutral" }: { value: string; tone?: Tone }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-control px-2 py-1 text-meta font-semibold",
        toneBadge[tone],
      )}
    >
      {value}
    </span>
  )
}

/* ── Grupos de detalle y de formulario ── */

export function DetailSection({
  title,
  meta,
  children,
  action,
}: {
  title: string
  meta?: string
  children: ReactNode
  action?: ReactNode
}) {
  return (
    <section className="grid gap-3">
      <SectionHeader title={title} meta={meta} aside={action} />
      {children}
    </section>
  )
}

export function FormSection({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: ReactNode
}) {
  return (
    <Surface className="grid gap-4">
      <div>
        <h2 className="gei-section-title">{title}</h2>
        {hint && <p className="gei-meta mt-1">{hint}</p>}
      </div>
      {children}
    </Surface>
  )
}

/* ── Revisión de impacto antes de confirmar ── */

export function ImpactPreview({
  lines,
  occurrences,
  people,
}: {
  lines: string[]
  occurrences: Array<{ id: string; label: string; date: string; time: string }>
  people: Array<{ personId: string; name: string; reason: string }>
}) {
  return (
    <div className="grid gap-3 rounded-surface border border-attention-line bg-attention-soft p-4">
      <p className="gei-body-strong text-attention">Antes de confirmar, revisá el impacto</p>
      {lines.length > 0 && (
        <ul className="grid gap-1">
          {lines.map((line) => (
            <li key={line} className="gei-body text-ink-strong">
              {line}
            </li>
          ))}
        </ul>
      )}
      {occurrences.length > 0 && (
        <div>
          <p className="text-meta font-semibold uppercase tracking-wide text-attention">
            Eventos afectados
          </p>
          <ul className="mt-1.5 grid gap-1">
            {occurrences.map((item) => (
              <li key={item.id} className="gei-body text-ink-strong">
                {item.label} · <span className="tabular-nums">{item.date} {item.time}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {people.length > 0 && (
        <div>
          <p className="text-meta font-semibold uppercase tracking-wide text-attention">
            Personas afectadas
          </p>
          <p className="gei-meta mt-0.5">
            {people.length} {people.length === 1 ? "persona" : "personas"}: {people
              .slice(0, 3)
              .map((person) => person.name)
              .join(", ")}
            {people.length > 3 ? ` y ${people.length - 3} más` : ""}.
          </p>
        </div>
      )}
    </div>
  )
}

/* ── Historia visible: sólo donde aporta confianza ── */

export function TimelineEntry({
  action,
  actor,
  at,
  before,
  after,
  reason,
  route,
  to,
}: {
  action: string
  actor: string
  at: string
  before?: string | null
  after?: string | null
  reason?: string | null
  route?: string
  to?: string
}) {
  const hasDiff = (before ?? null) !== null || (after ?? null) !== null
  return (
    <li className="grid gap-1 border-b border-line py-3 last:border-b-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <p className="gei-body-strong">{action}</p>
        <p className="gei-meta shrink-0 tabular-nums">{at}</p>
      </div>
      {hasDiff && (
        <p className="gei-meta tabular-nums">
          <span className="text-ink-faint line-through">{before ?? "—"}</span>
          <span aria-hidden> → </span>
          <span className="font-semibold text-ink">{after ?? "—"}</span>
        </p>
      )}
      {reason && <p className="gei-body text-ink-strong">“{reason}”</p>}
      <p className="gei-meta">
        {actor}
        {to && route && (
          <>
            {" · "}
            <a href={to} className="font-semibold text-interactive hover:underline">
              Ver el objeto
            </a>
          </>
        )}
      </p>
    </li>
  )
}

export function HistoryList({
  entries,
  emptyText = "Todavía no hay historial.",
}: {
  entries: Array<{
    action: string
    actor: string
    at: string
    before?: string | null
    after?: string | null
    reason?: string | null
    to?: string
  }>
  emptyText?: string
}) {
  if (entries.length === 0)
    return <p className="gei-meta py-2">{emptyText}</p>
  return (
    <ul className="grid">
      {entries.map((entry, index) => (
        <TimelineEntry key={`${entry.action}-${index}`} {...entry} />
      ))}
    </ul>
  )
}

/* ── Filtros / facets con estado ── */

export function FilterBar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">{children}</div>
  )
}

/* ── Diálogo de alcance de serie (D1) ── */

export interface SeriesScopeOption {
  value: "ONLY_THIS" | "THIS_AND_FOLLOWING" | "ENTIRE_SERIES"
  title: string
  detail: string
  count: number
}

export function ScopeDialog({
  options,
  onClose,
  onPick,
}: {
  options: SeriesScopeOption[]
  onClose: () => void
  onPick: (scope: "ONLY_THIS" | "THIS_AND_FOLLOWING" | "ENTIRE_SERIES") => void
}) {
  return (
    <Modal
      title="¿Dónde aplicás el cambio?"
      description="El alcance elegido define exactamente qué eventos cambian."
      onClose={onClose}
      footer={
        <p className="gei-meta mr-auto">
          Después vas a ver el impacto real antes de confirmar.
        </p>
      }
    >
      <div className="grid gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onPick(option.value)}
            className="grid gap-1 rounded-surface border border-line-strong p-4 text-left transition-colors duration-micro hover:border-interactive hover:bg-selected-soft"
          >
            <span className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="gei-body-strong">{option.title}</span>
              <span className="gei-meta tabular-nums">
                {option.count} {option.count === 1 ? "evento" : "eventos"}
              </span>
            </span>
            <span className="gei-meta">{option.detail}</span>
          </button>
        ))}
      </div>
    </Modal>
  )
}

/** Confirmación genérica de acción terminal reutilizable. */
export function TerminalConfirm(props: {
  title: string
  consequence: ReactNode
  confirmLabel: string
  onConfirm: (reason: string) => void
  onClose: () => void
  pending?: boolean
}) {
  return (
    <ConfirmDialog
      {...props}
      tone="danger"
      requireReason
      reasonLabel="Por qué lo hacés"
    />
  )
}

export { Button }