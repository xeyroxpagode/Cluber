import type { AttentionItemDto, DtoState, Severity } from "../../../shared/contracts/t06.js"

const SEVERITY_WEIGHT: Record<Severity, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 }

/**
 * Prioridad congelada (B5-09 corregida):
 *   deadline ASC (NULL al final) -> severity DESC -> sourceType ASC -> sourceId ASC -> dedupeKey ASC.
 * No es severity -> deadline. El deadline prevalece cuando dos filas tienen severidades distintas.
 */
export function compareAttention(a: AttentionItemDto, b: AttentionItemDto): number {
  const ad = a.deadline
  const bd = b.deadline
  if (ad !== bd) {
    if (ad === null) return 1
    if (bd === null) return -1
    return ad < bd ? -1 : 1
  }
  if (a.severity !== b.severity) return SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity]
  if (a.sourceType !== b.sourceType) return a.sourceType < b.sourceType ? -1 : 1
  if (a.sourceId !== b.sourceId) return a.sourceId < b.sourceId ? -1 : 1
  return a.dedupeKey < b.dedupeKey ? -1 : a.dedupeKey > b.dedupeKey ? 1 : 0
}

/** Dedupe por condición fuente (dedupeKey). Sin persistencia attention_items. */
export function dedupeAttention(items: readonly AttentionItemDto[]): AttentionItemDto[] {
  const seen = new Set<string>()
  const result: AttentionItemDto[] = []
  for (const item of items) {
    if (seen.has(item.dedupeKey)) continue
    seen.add(item.dedupeKey)
    result.push(item)
  }
  return result
}

export function buildAttentionList(
  items: readonly AttentionItemDto[],
  options: { limit?: number; sourceFailures?: number; totalSources?: number } = {},
): { items: AttentionItemDto[]; state: DtoState; total: number } {
  const ordered = dedupeAttention(items).sort(compareAttention)
  const total = ordered.length
  const limit = Math.min(Math.max(options.limit ?? 50, 1), 200)
  const sliced = ordered.slice(0, limit)
  const failures = options.sourceFailures ?? 0
  const totalSources = options.totalSources ?? 8
  const state: DtoState = sliced.length === 0
    ? failures >= totalSources ? "ERROR" : failures > 0 ? "ERROR" : "NO_DATA"
    : failures > 0 ? "OK" : "OK"
  return { items: sliced, state, total }
}

export const EMPTY_ATTENTION_COPY = "Nada pendiente."
