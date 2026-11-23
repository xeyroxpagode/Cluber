import type { SearchRank, SearchResultType } from "../../../shared/contracts/t06.js"

export type MatchTier = "exact" | "prefix" | "fuzzy" | "none"

export function normalizeQuery(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
}

function normalizeText(input: string): string {
  return normalizeQuery(input)
}

/**
 * Ranking congelado: exact -> prefix -> fuzzy -> tipo.
 * Sin stemming. `pg_trgm` sólo con evidencia de plan (tarea 089).
 */
export function matchRank(text: string, normalizedQuery: string): SearchRank & { tier: number; match: MatchTier } {
  const candidate = normalizeText(text)
  if (!normalizedQuery) return { tier: 0, score: 0, match: "none" }
  if (candidate === normalizedQuery) return { tier: 3, score: 100, match: "exact" }
  if (candidate.startsWith(normalizedQuery)) return { tier: 2, score: 80, match: "prefix" }
  const tokens = normalizedQuery.split(" ").filter(Boolean)
  const hits = tokens.filter((token) => candidate.includes(token)).length
  if (hits > 0 || candidate.includes(normalizedQuery)) {
    return { tier: 1, score: 40 + Math.round((hits / Math.max(tokens.length, 1)) * 30), match: "fuzzy" }
  }
  return { tier: 0, score: 0, match: "none" }
}

const TYPE_ORDER: Record<SearchResultType, number> = {
  person: 0,
  team: 1,
  division: 2,
  line: 3,
  event: 4,
  announcement: 5,
  conversation: 6,
}

/** Desempate determinista: tier DESC, score DESC, type ASC, id ASC. Sin random. */
export function compareRank(
  a: { rank: SearchRank; type: SearchResultType; id: string },
  b: { rank: SearchRank; type: SearchResultType; id: string },
): number {
  if (a.rank.tier !== b.rank.tier) return b.rank.tier - a.rank.tier
  if (a.rank.score !== b.rank.score) return b.rank.score - a.rank.score
  if (a.type !== b.type) return TYPE_ORDER[a.type] - TYPE_ORDER[b.type]
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0
}
