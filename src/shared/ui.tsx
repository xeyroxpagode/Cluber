import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react"
import { Link, useNavigate } from "react-router"
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Info,
  Loader2,
  MinusCircle,
  X,
} from "lucide-react"
import {
  cx,
  stateText,
  stateTone,
  toneBadge,
  toneSurface,
  type Tone,
} from "./states"

export { cx }
export { stateText, stateTone, toneBadge, toneSurface }
export type { Tone }

/* ═══════════════════════════════════════════════════════════════
   BOTONES — 44 px, tres gramáticas distinguibles
   primary  = acción principal de la pantalla (una sola)
   secondary= acción alternativa con borde
   danger   = acción destructiva: se separa y se explica
   quiet    = acción terciaria, sin caja
   ═══════════════════════════════════════════════════════════════ */

const buttonBase =
  "gei-target min-h-11 inline-flex items-center justify-center gap-2 rounded-control px-4 py-2.5 text-body-strong whitespace-nowrap transition-colors duration-micro ease-gei disabled:pointer-events-none disabled:opacity-45 motion-reduce:transition-none"

const buttonVariants = {
  primary:
    "bg-interactive text-white shadow-raised hover:bg-interactive-hover active:bg-interactive-hover",
  secondary:
    "border border-line-strong bg-surface text-ink hover:border-ink-faint hover:bg-control",
  danger:
    "border border-danger-line bg-danger-soft text-danger hover:border-danger hover:bg-danger-soft/70",
  quiet: "text-interactive hover:bg-selected-soft hover:text-selected",
} as const

export type ButtonVariant = keyof typeof buttonVariants

export function Button({
  children,
  variant = "secondary",
  size = "md",
  className = "",
  busy,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: "md" | "sm"
  busy?: boolean
}) {
  return (
    <button
      {...props}
      aria-busy={busy || undefined}
      className={cx(
        buttonBase,
        buttonVariants[variant],
        size === "sm" && "min-h-11 px-3 py-2 text-meta",
        className,
      )}
    >
      {busy && <Loader2 size={15} className="animate-spin motion-reduce:animate-none" />}
      {children}
    </button>
  )
}

export function IconButton({
  children,
  label,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      {...props}
      aria-label={label}
      title={label}
      className={cx(
        "flex size-11 shrink-0 items-center justify-center rounded-control text-ink-muted transition-colors duration-micro hover:bg-control hover:text-ink disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FILAS — clickables con hover, foco y presionado
   ═══════════════════════════════════════════════════════════════ */

export function RowLink({
  to,
  title,
  detail,
  meta,
  leading,
  trailing,
  className = "",
  children,
}: {
  to: string
  title: ReactNode
  detail?: ReactNode
  meta?: ReactNode
  leading?: ReactNode
  trailing?: ReactNode
  className?: string
  children?: ReactNode
}) {
  return (
    <Link
      to={to}
      className={cx(
        "group flex min-h-11 items-center gap-3 rounded-control px-3 py-3 transition-colors duration-micro hover:bg-selected-soft active:bg-selected-soft motion-reduce:transition-none",
        className,
      )}
    >
      {leading}
      <div className="min-w-0 flex-1">
        <div className="gei-item-title truncate">{title}</div>
        {detail && <div className="gei-meta mt-0.5 line-clamp-2">{detail}</div>}
      </div>
      {meta && <div className="shrink-0 text-right">{meta}</div>}
      {trailing}
      {children ?? (
        <ChevronRight
          size={16}
          aria-hidden
          className="shrink-0 text-ink-faint transition-colors group-hover:text-selected"
        />
      )}
    </Link>
  )
}

/** Fila estática: nunca se ve como un link. */
export function RowStatic({
  title,
  detail,
  meta,
  leading,
  trailing,
  className = "",
}: {
  title: ReactNode
  detail?: ReactNode
  meta?: ReactNode
  leading?: ReactNode
  trailing?: ReactNode
  className?: string
}) {
  return (
    <div className={cx("flex min-h-11 items-center gap-3 px-3 py-3", className)}>
      {leading}
      <div className="min-w-0 flex-1">
        <div className="gei-item-title truncate">{title}</div>
        {detail && <div className="gei-meta mt-0.5 line-clamp-2">{detail}</div>}
      </div>
      {meta && <div className="shrink-0 text-right">{meta}</div>}
      {trailing}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   BADGES Y ESTADOS
   ═══════════════════════════════════════════════════════════════ */

export function StateBadge({
  value,
  tone,
  emphasis = false,
  children,
}: {
  value: string
  tone?: Tone
  emphasis?: boolean
  children?: ReactNode
}) {
  const resolved = tone ?? stateTone(value)
  return (
    <span
      className={cx(
        "gei-state-badge inline-flex shrink-0 items-center gap-1.5 rounded-control px-2 py-1 text-meta font-semibold leading-tight",
        toneBadge[resolved],
        emphasis && resolved !== "neutral",
      )}
    >
      {children ?? stateText(value)}
    </span>
  )
}

/** Etiqueta estática: nunca usa el azul para decorar. */
export function Tag({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span className={cx("inline-flex items-center rounded-control px-2 py-0.5 text-meta font-medium", toneBadge[tone])}>
      {children}
    </span>
  )
}

/** Punto + texto para "sin leer". Discreto pero inequívoco. */
export function UnreadMark({ count, label }: { count: number; label?: string }) {
  if (count <= 0) return null
  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden className="size-2 shrink-0 rounded-pill bg-unread" />
      <span className="text-meta font-semibold text-selected">
        {label ?? `${count} sin leer`}
      </span>
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TABS Y SEGMENTOS — estado seleccionado inequívoco
   ═══════════════════════════════════════════════════════════════ */

export function TabBar({
  tabs,
  active,
  onChange,
  ariaLabel,
}: {
  tabs: Array<{ id: string; label: string; count?: number }>
  active: string
  onChange: (id: string) => void
  ariaLabel: string
}) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-px"
    >
      {tabs.map((tab) => {
        const selected = tab.id === active
        return (
          <button
            key={tab.id}
            ref={(node) => {
              refs.current[tab.id] = node
            }}
            role="tab"
            type="button"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onKeyDown={(event) => {
              const index = tabs.findIndex((item) => item.id === active)
              if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                event.preventDefault()
                const next =
                  event.key === "ArrowRight"
                    ? tabs[(index + 1) % tabs.length]
                    : tabs[(index - 1 + tabs.length) % tabs.length]
                onChange(next.id)
                refs.current[next.id]?.focus()
              }
            }}
            onClick={() => onChange(tab.id)}
            className={cx(
              "gei-target-sm inline-flex shrink-0 items-center gap-2 border-b-2 px-3 text-body font-semibold transition-colors duration-micro motion-reduce:transition-none",
              selected
                ? "border-interactive text-interactive"
                : "border-transparent text-ink-muted hover:border-line-strong hover:text-ink",
            )}
          >
            {tab.label}
            {typeof tab.count === "number" && (
              <span
                className={cx(
                  "rounded-pill px-1.5 py-px text-micro font-semibold",
                  selected ? "bg-selected-soft text-selected" : "bg-neutral-soft text-ink-muted",
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/** Control segmentado (Mes / Agenda, Presente / Ausente…). */
export function SegmentedControl({
  options,
  value,
  onChange,
  ariaLabel,
  size = "md",
}: {
  options: Array<{ value: string; label: string }>
  value: string
  onChange: (value: string) => void
  ariaLabel: string
  size?: "md" | "sm"
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex gap-0.5 rounded-control border border-line bg-control p-0.5"
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cx(
              "rounded-[0.4rem] px-3 font-semibold transition-colors duration-micro motion-reduce:transition-none",
              size === "md" ? "min-h-11 text-meta" : "min-h-10 text-meta",
              active
                ? "bg-surface text-ink shadow-raised"
                : "text-ink-muted hover:text-ink",
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

/** Chip de filtro: interactivo, con estado seleccionado explícito. */
export function FilterChip({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
  count?: number
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cx(
        "gei-target-sm inline-flex items-center gap-1.5 rounded-control border px-3 text-meta font-semibold transition-colors duration-micro motion-reduce:transition-none",
        active
          ? "border-selected-line bg-selected-soft text-selected"
          : "border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink",
      )}
    >
      {children}
      {typeof count === "number" && (
        <span className={active ? "text-selected/70" : "text-ink-faint"}>{count}</span>
      )}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════════
   EXPANSOR
   ═══════════════════════════════════════════════════════════════ */

export function Expander({
  title,
  meta,
  children,
  defaultOpen = false,
}: {
  title: ReactNode
  meta?: ReactNode
  children: ReactNode
  defaultOpen?: boolean
}) {
  return (
    <details open={defaultOpen} className="group border-b border-line last:border-b-0">
      <summary className="gei-target flex cursor-pointer list-none items-center gap-3 px-1 py-3 text-body font-semibold marker:content-none">
        <span className="min-w-0 flex-1">{title}</span>
        {meta && <span className="shrink-0 text-meta font-normal text-ink-muted">{meta}</span>}
        <ChevronDown
          size={16}
          aria-hidden
          className="shrink-0 text-ink-faint transition-transform duration-micro group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <div className="pb-4">{children}</div>
    </details>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MENÚ DE ACCIONES SECUNDARIAS Y DESTRUCTIVAS
   ═══════════════════════════════════════════════════════════════ */

export function Menu({
  label,
  items,
  align = "end",
}: {
  label: string
  items: Array<{ label: string; onSelect: () => void; danger?: boolean }>
  align?: "start" | "end"
}) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const firstItem = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointer = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onPointer)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onPointer)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div className="relative" ref={root}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          setOpen((value) => !value)
          window.setTimeout(() => firstItem.current?.focus(), 0)
        }}
        className="gei-target-sm inline-flex items-center gap-1.5 rounded-control px-2.5 text-meta font-semibold text-ink-muted transition-colors hover:bg-control hover:text-ink"
      >
        {label}
        <ChevronDown size={14} aria-hidden />
      </button>
      {open && (
        <div
          role="menu"
          className={cx(
            "absolute top-[calc(100%+4px)] z-30 min-w-56 rounded-surface border border-line bg-raised p-1 shadow-overlay",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {items.map((item, index) => (
            <button
              key={item.label}
              ref={index === 0 ? firstItem : undefined}
              role="menuitem"
              type="button"
              onClick={() => {
                setOpen(false)
                item.onSelect()
              }}
              className={cx(
                "flex min-h-11 w-full items-center gap-2 rounded-control px-3 text-left text-body font-medium transition-colors",
                item.danger
                  ? "text-danger hover:bg-danger-soft"
                  : "text-ink hover:bg-control",
              )}
            >
              {item.danger && <AlertCircle size={15} aria-hidden />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FORMULARIOS — labels persistentes, error por campo, ARIA
   ═══════════════════════════════════════════════════════════════ */

export function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
  className = "",
}: {
  label: string
  hint?: string
  error?: string
  required?: boolean
  htmlFor: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cx("grid gap-1.5", className)}>
      <label htmlFor={htmlFor} className="flex items-baseline gap-2 text-body font-semibold">
        {label}
        <span className="text-micro font-medium uppercase tracking-wide text-ink-faint">
          {required ? "obligatorio" : "opcional"}
        </span>
      </label>
      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="gei-meta">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="flex items-start gap-1.5 text-meta font-medium text-danger">
          <AlertCircle size={14} aria-hidden className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

const controlBase =
  "w-full rounded-control border bg-surface px-3 py-2.5 text-body text-ink transition-colors duration-micro placeholder:text-ink-faint disabled:bg-control disabled:text-ink-muted motion-reduce:transition-none"

export function TextField({
  label,
  hint,
  error,
  required,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
  error?: string
}) {
  const generated = useId()
  const fieldId = id ?? generated
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={fieldId}
    >
      <input
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
        }
        {...props}
        className={cx(
          controlBase,
          error ? "border-danger" : "border-line-strong hover:border-ink-faint",
        )}
      />
    </Field>
  )
}

export function TextArea({
  label,
  hint,
  error,
  required,
  id,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  hint?: string
  error?: string
}) {
  const generated = useId()
  const fieldId = id ?? generated
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={fieldId}
    >
      <textarea
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
        }
        rows={4}
        {...props}
        className={cx(
          controlBase,
          "resize-y",
          error ? "border-danger" : "border-line-strong hover:border-ink-faint",
        )}
      />
    </Field>
  )
}

export function Select({
  label,
  hint,
  error,
  required,
  id,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  hint?: string
  error?: string
}) {
  const generated = useId()
  const fieldId = id ?? generated
  const select = (
    <select
      id={fieldId}
      aria-invalid={error ? true : undefined}
      aria-describedby={
        error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
      }
      aria-label={label}
      {...props}
      className={cx(
        controlBase,
        "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22none%22 stroke=%22%2356616f%22 stroke-width=%221.5%22><path d=%22M6 8l4 4 4-4%22/></svg>')] bg-[length:18px] bg-[right_0.6rem_center] bg-no-repeat pr-9",
        error ? "border-danger" : "border-line-strong hover:border-ink-faint",
      )}
    >
      {children}
    </select>
  )
  if (!label) return select
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={fieldId}>
      {select}
    </Field>
  )
}

export function Checkbox({
  label,
  hint,
  checked,
  onChange,
  disabled,
}: {
  label: string
  hint?: string
  checked: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}) {
  const id = useId()
  return (
    <div className="flex gap-2.5">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className="mt-0.5 size-5 shrink-0 rounded-control border border-line-strong text-interactive accent-interactive"
      />
      <div className="min-w-0">
        <label htmlFor={id} className="block text-body font-semibold">
          {label}
        </label>
        {hint && (
          <p id={`${id}-hint`} className="gei-meta">
            {hint}
          </p>
        )}
      </div>
    </div>
  )
}

/** Grupo de casillas con radios: el estado se marca con texto, no sólo color. */
export function RadioGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
  name,
  columns = 1,
}: {
  legend: string
  options: Array<{ value: T; label: string; tone?: Tone }>
  value: T | null
  onChange: (value: T) => void
  name: string
  columns?: 1 | 2 | 3
}) {
  return (
    <fieldset className="grid gap-2">
      <legend className="mb-1 text-body font-semibold">{legend}</legend>
      <div
        className={cx(
          "grid gap-2",
          columns === 2 && "sm:grid-cols-2",
          columns === 3 && "grid-cols-3",
        )}
      >
        {options.map((option) => {
          const active = value === option.value
          return (
            <label
              key={option.value}
              className={cx(
                "gei-target flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-control border px-3 text-body font-semibold transition-colors duration-micro",
                active
                  ? cx(
                      option.tone ?? "selected",
                      option.tone
                        ? toneSurface[option.tone] + " border-current"
                        : "border-interactive bg-selected-soft text-selected",
                    )
                  : "border-line-strong bg-surface text-ink-muted hover:border-ink-faint hover:text-ink",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={active}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SUPERFICIES
   ═══════════════════════════════════════════════════════════════ */

export function Surface({
  children,
  className = "",
  flush = false,
}: {
  children: ReactNode
  className?: string
  flush?: boolean
}) {
  return (
    <div
      className={cx(
        "rounded-surface border border-line bg-surface shadow-raised",
        !flush && "p-4 sm:p-5",
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Grupo abierto sobre la página: sin caja, sólo ritmo. */
export function OpenGroup({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cx("grid gap-3", className)}>{children}</div>
}

export function Banner({
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
  const Icon =
    tone === "danger"
      ? AlertCircle
      : tone === "success"
        ? CheckCircle2
        : tone === "warning"
          ? AlertCircle
          : tone === "selected"
            ? Info
            : Info
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cx(
        "flex flex-wrap items-start gap-3 rounded-surface border p-4",
        tone === "danger" && "border-danger-line bg-danger-soft",
        tone === "attention" && "border-attention-line bg-attention-soft",
        tone === "warning" && "border-warning-line bg-warning-soft",
        tone === "success" && "border-success-line bg-success-soft",
        tone === "selected" && "border-selected-line bg-selected-soft",
        tone === "neutral" && "border-line bg-neutral-soft",
      )}
    >
      <Icon
        size={18}
        aria-hidden
        className={cx(
          "mt-0.5 shrink-0",
          tone === "danger" && "text-danger",
          tone === "attention" && "text-attention",
          tone === "warning" && "text-warning",
          tone === "success" && "text-success",
          (tone === "selected" || tone === "neutral") && "text-selected",
        )}
      />
      <div className="min-w-0 flex-1">
        <p className="gei-body-strong">{title}</p>
        {children && (
          <div className="gei-body mt-1 text-ink-strong/90">{children}</div>
        )}
      </div>
      {action}
    </div>
  )
}

/** Estado vacío honesto: dice qué pasó y qué se puede hacer. Compacto. */
export function Empty({
  title,
  detail,
  action,
  icon,
}: {
  title: string
  detail: string
  action?: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className="grid gap-3 rounded-surface border border-line bg-surface px-5 py-8 text-center">
      <div className="mx-auto flex justify-center text-ink-faint" aria-hidden>
        {icon ?? <MinusCircle size={22} />}
      </div>
      <div>
        <p className="gei-body-strong">{title}</p>
        <p className="gei-meta mx-auto mt-1 max-w-sm">{detail}</p>
      </div>
      {action}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   OVERLAYS
   ═══════════════════════════════════════════════════════════════ */

function useFocusTrap(dialog: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const focusables = () =>
      Array.from(
        dialog.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex]:not([tabindex="-1"])',
        ) ?? [],
      )
    // El foco arranca en el primer control útil, no en "Cerrar".
    window.setTimeout(() => {
      const elements = focusables()
      const first = elements.find(
        (element) => element.getAttribute("aria-label") !== "Cerrar",
      )
      ;(first ?? elements[0])?.focus()
    }, 0)
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation()
        dialog.current?.dispatchEvent(new CustomEvent("gei:close"))
        return
      }
      if (event.key !== "Tab") return
      const elements = focusables()
      const first = elements[0]
      const last = elements.at(-1)
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener("keydown", onKey)
      previous?.focus()
    }
  }, [dialog])
}

export function Modal({
  title,
  description,
  children,
  onClose,
  footer,
  size = "md",
}: {
  title: string
  description?: string
  children: ReactNode
  onClose: () => void
  footer?: ReactNode
  size?: "md" | "lg"
}) {
  const dialog = useRef<HTMLElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  useEffect(() => {
    const handler = () => onCloseRef.current()
    dialog.current?.addEventListener("gei:close", handler)
    return () => dialog.current?.removeEventListener("gei:close", handler)
  }, [])
  useFocusTrap(dialog)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-overlay backdrop-blur-[2px]"
      />
      <section
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cx(
          "relative flex max-h-[92dvh] w-full flex-col rounded-t-overlay bg-raised shadow-overlay sm:rounded-overlay",
          size === "lg" ? "sm:max-w-3xl" : "sm:max-w-lg",
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <h2 className="gei-section-title">{title}</h2>
            {description && <p className="gei-meta mt-1">{description}</p>}
          </div>
          <IconButton label="Cerrar" onClick={onClose} className="-mr-2 -mt-1">
            <X size={19} />
          </IconButton>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line px-5 py-4">
            {footer}
          </div>
        )}
      </section>
    </div>
  )
}

/** Hoja inferior en mobile, panel lateral en desktop. */
export function Sheet({
  title,
  description,
  children,
  onClose,
  footer,
}: {
  title: string
  description?: string
  children: ReactNode
  onClose: () => void
  footer?: ReactNode
}) {
  const panel = useRef<HTMLElement>(null)
  useFocusTrap(panel)
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div aria-hidden onClick={onClose} className="absolute inset-0 bg-overlay" />
      <section
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex h-full w-full max-w-md flex-col bg-raised shadow-overlay"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <h2 className="gei-section-title">{title}</h2>
            {description && <p className="gei-meta mt-1">{description}</p>}
          </div>
          <IconButton label="Cerrar" onClick={onClose} className="-mr-2 -mt-1">
            <X size={19} />
          </IconButton>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-4">
            {footer}
          </div>
        )}
      </section>
    </div>
  )
}

/**
 * Confirmación de acción peligrosa o terminal (Stage 6 §7).
 * Siempre explica la consecuencia. `terminal` exige motivo escrito.
 */
export function ConfirmDialog({
  title,
  consequence,
  confirmLabel,
  onConfirm,
  onClose,
  tone = "danger",
  requireReason,
  reasonLabel = "Motivo",
  pending,
  pendingLabel = "Guardando",
  extra,
}: {
  title: string
  consequence: ReactNode
  confirmLabel: string
  onConfirm: (reason: string) => void
  onClose: () => void
  tone?: "danger" | "attention"
  requireReason?: boolean
  reasonLabel?: string
  pending?: boolean
  pendingLabel?: string
  extra?: ReactNode
}) {
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")
  const reasonId = useId()
  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button variant="quiet" onClick={onClose} disabled={pending}>
            Cancelar
          </Button>
          <Button
            variant={tone === "danger" ? "danger" : "primary"}
            busy={pending}
            onClick={() => {
              if (requireReason && !reason.trim()) {
                setError("Escribí el motivo: queda registrado en el historial.")
                document.getElementById(reasonId)?.focus()
                return
              }
              onConfirm(reason.trim())
            }}
          >
            {pending ? pendingLabel : confirmLabel}
          </Button>
        </>
      }
    >
      <div className="grid gap-4">
        <Banner tone={tone === "danger" ? "danger" : "attention"} title="Qué pasa si confirmás">
          <div className="text-ink-strong">{consequence}</div>
        </Banner>
        {extra}
        {requireReason && (
          <TextArea
            id={reasonId}
            label={reasonLabel}
            required
            rows={3}
            value={reason}
            error={error}
            hint="Queda registrado con tu nombre y la fecha."
            onChange={(event) => {
              setReason(event.target.value)
              if (error) setError("")
            }}
          />
        )}
      </div>
    </Modal>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FEEDBACK
   ═══════════════════════════════════════════════════════════════ */

export function SavedState({
  state,
  detail,
}: {
  state: "idle" | "saving" | "saved" | "dirty"
  detail?: string
}) {
  if (state === "idle") return null
  return (
    <p
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-1.5 text-meta text-ink-muted"
    >
      {state === "saving" && (
        <Loader2 size={13} className="animate-spin motion-reduce:animate-none" />
      )}
      {state === "saved" && <Check size={13} className="text-success" />}
      {state === "dirty" && <AlertCircle size={13} className="text-attention" />}
      {state === "saving"
        ? "Guardando"
        : state === "saved"
          ? (detail ?? "Guardado")
          : (detail ?? "Cambios sin guardar")}
    </p>
  )
}

export function Toast({ message }: { message: string }) {
  if (!message) return null
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-24 left-1/2 z-50 flex max-w-[90vw] -translate-x-1/2 items-center gap-2.5 rounded-control bg-ink px-4 py-3 text-body font-medium text-white shadow-overlay lg:bottom-6"
    >
      <CheckCircle2 size={16} aria-hidden className="shrink-0 text-success-line" />
      {message}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PEQUEÑAS PIEZAS DE PRESENTACIÓN
   ═══════════════════════════════════════════════════════════════ */

export function Avatar({
  name,
  size = "md",
  selected = false,
}: {
  name: string
  size?: "sm" | "md" | "lg"
  selected?: boolean
}) {
  const letters = name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
  return (
    <span
      aria-hidden
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-pill font-semibold",
        selected
          ? "bg-selected-soft text-selected ring-1 ring-inset ring-selected-line"
          : "bg-neutral-soft text-ink-muted",
        size === "sm" ? "size-8 text-micro" : size === "lg" ? "size-16 text-item-title" : "size-10 text-meta",
      )}
    >
      {letters}
    </span>
  )
}

export function MetaRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: ReactNode
  mono?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-line py-2.5 last:border-b-0">
      <dt className="shrink-0 text-meta text-ink-muted">{label}</dt>
      <dd
        className={cx(
          "min-w-0 text-right text-body font-medium text-ink",
          mono && "tabular-nums",
        )}
      >
        {value}
      </dd>
    </div>
  )
}

export function TextLink({
  to,
  children,
  className = "",
}: {
  to: string
  children: ReactNode
  className?: string
}) {
  return (
    <Link
      to={to}
      className={cx(
        "inline-flex min-h-9 items-center gap-1.5 rounded-control px-1 text-meta font-semibold text-interactive transition-colors hover:bg-selected-soft hover:text-selected hover:underline",
        className,
      )}
    >
      {children}
      <ArrowRight size={13} aria-hidden />
    </Link>
  )
}

export function BackLink({ to, label = "Volver" }: { to: string; label?: string }) {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="gei-target-sm -ml-2 inline-flex items-center gap-1.5 rounded-control px-2 text-meta font-semibold text-ink-muted transition-colors hover:bg-control hover:text-ink"
    >
      <ChevronRight size={14} aria-hidden className="rotate-180" />
      {label}
    </button>
  )
}

export function StickyActionBar({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-16 z-20 -mx-4 mt-6 border-t border-line bg-surface/95 px-4 py-3 shadow-sticky backdrop-blur-sm lg:bottom-0 lg:mx-0 lg:rounded-surface lg:border lg:px-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">{children}</div>
    </div>
  )
}

export function DataTable({
  head,
  children,
  caption,
}: {
  head: string[]
  children: ReactNode
  caption?: string
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[34rem] border-collapse text-left">
        {caption && <caption className="gei-meta pb-2 text-left">{caption}</caption>}
        <thead>
          <tr className="border-b border-line-strong">
            {head.map((label) => (
              <th
                key={label}
                scope="col"
                className="gei-meta whitespace-nowrap px-3 py-2 font-semibold"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function KeyValue({
  items,
}: {
  items: Array<{ label: string; value: ReactNode }>
}) {
  return (
    <dl className="grid">
      {items.map((item) => (
        <MetaRow key={item.label} label={item.label} value={item.value} />
      ))}
    </dl>
  )
}