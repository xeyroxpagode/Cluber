import type {
  ReactNode,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react"

/**
 * Presentación explícita de estado de dominio (Stage 6 §37).
 * Prohibido `labels[value] || value`. Un estado desconocido se reporta
 * en desarrollo y nunca se muestra crudo.
 */

export type Tone = "neutral" | "attention" | "success" | "warning" | "danger" | "selected"

/**
 * Vocabulario único de estado. La fuente canónica vive en el modelo de
 * dominio; acá se expone como presentación con los mismos textos.
 */
import { labels } from "../mock/model"

export const STATE_TEXT: Record<string, string> = {
  ...labels,
  BLOCKED: "No habilitada",
  YES: "Voy",
  NO: "No voy",
  NO_RESPONSE: "Sin respuesta",
  NEEDS_RECONFIRMATION: "Hay que volver a confirmar",
  UNRECORDED: "Sin registrar",
}
const stateToneMap: Record<string, Tone> = {
  DRAFT: "neutral",
  SCHEDULED: "selected",
  POSTPONED: "warning",
  CANCELLED: "danger",
  IN_PROGRESS: "attention",
  COMPLETED: "success",
  ABANDONED: "warning",
  PUBLISHED: "success",
  ARCHIVED: "neutral",
  ACTIVE: "success",
  DISABLED: "danger",
  PENDING: "warning",
  OPEN: "success",
  CLOSED: "neutral",
  ENDED: "neutral",
  FINAL: "success",
  ELIGIBLE: "success",
  BLOCKED: "danger",
  YES: "success",
  MAYBE: "warning",
  NO: "danger",
  NO_RESPONSE: "neutral",
  NEEDS_RECONFIRMATION: "attention",
  PRESENT: "success",
  ABSENT: "danger",
  JUSTIFIED: "warning",
  UNRECORDED: "neutral",
  PLAYED: "success",
  FORFEIT: "warning",
}

export function stateText(value: string): string {
  const known = STATE_TEXT[value]
  if (known) return known
  if (import.meta.env.DEV)
    console.warn(`[GEI] estado de dominio desconocido en UI: ${value}`)
  return "Estado a revisar"
}

export function stateTone(value: string): Tone {
  return stateToneMap[value] ?? "neutral"
}

/** Clases de badge por tono. Quiet por defecto; `emphasis` para atención real. */
export const toneBadge: Record<Tone, string> = {
  neutral: "bg-neutral-soft text-ink-muted ring-1 ring-inset ring-neutral-line",
  selected: "bg-selected-soft text-selected ring-1 ring-inset ring-selected-line",
  attention: "bg-attention-soft text-attention ring-1 ring-inset ring-attention-line",
  success: "bg-success-soft text-success ring-1 ring-inset ring-success-line",
  warning: "bg-warning-soft text-warning ring-1 ring-inset ring-warning-line",
  danger: "bg-danger-soft text-danger ring-1 ring-inset ring-danger-line",
}

export const toneSurface: Record<Tone, string> = {
  neutral: "bg-neutral-soft",
  selected: "bg-selected-soft",
  attention: "bg-attention-soft",
  success: "bg-success-soft",
  warning: "bg-warning-soft",
  danger: "bg-danger-soft",
}

/** Copy de pluralización: nunca "1 pendientes". */
export function pluralize(
  count: number,
  one: string,
  many: string,
  opts?: { includeCount?: boolean },
): string {
  const text = `${count === 1 ? one : many}`
  return opts?.includeCount === false ? text : `${count} ${text}`
}

export function cx(
  ...values: Array<string | false | null | undefined | boolean>
) {
  return values.filter(Boolean).join(" ")
}

export function childrenText(children: ReactNode): string {
  return typeof children === "string" ? children : ""
}

export type InputFieldProps = InputHTMLAttributes<HTMLInputElement>
export type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement>
export type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement>