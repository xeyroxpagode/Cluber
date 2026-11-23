import { createHash } from "node:crypto"
import { describe, expect, it } from "vitest"
import { ReportPercentagePolicy } from "./report-percentage-policy.js"
import { compareAttention, buildAttentionList } from "./attention-engine.js"
import { compareCursorKey, CursorNonceGuard, SearchCursor } from "./search-cursor.js"
import { compareRank, matchRank, normalizeQuery } from "./search-ranking.js"
import type { AttentionItemDto } from "../../../shared/contracts/t06.js"

const SECRET = "t06-unit-test-secret"

function attention(overrides: Partial<AttentionItemDto>): AttentionItemDto {
  return {
    id: "x", dedupeKey: "x", sourceType: "AVAILABILITY", sourceId: "x",
    stateText: "e", reason: "r", consequence: "c", deadline: "2026-01-01T00:00:00.000Z",
    severity: "MEDIUM", action: { label: "Ir", to: "/events/x" },
    visibleFields: {}, allowedActions: [], audienceScope: "TEAM", ...overrides,
  }
}

describe("T06 — A-01 % PRESENCIA", () => {
  it("usa PRESENT/(PRESENT+ABSENT+JUSTIFIED) y excluye UNRECORDED", () => {
    const result = ReportPercentagePolicy.computePresencePercentage({ present: 2, absent: 1, justified: 1, unrecorded: 5 })
    expect(result).toMatchObject({ status: "APPROVED", value: 50, formulaRef: "A-01" })
  })

  it("denominador cero => null / «Sin datos», nunca 0%", () => {
    const result = ReportPercentagePolicy.computePresencePercentage({ present: 0, absent: 0, justified: 0, unrecorded: 9 })
    expect(result.value).toBeNull()
    expect(ReportPercentagePolicy.label(result.value)).toBe("Sin datos")
  })

  it("JUSTIFIED reduce el indicador cuando una fila pasa de PRESENT a JUSTIFIED", () => {
    const before = ReportPercentagePolicy.computePresencePercentage({ present: 2, absent: 1, justified: 0, unrecorded: 0 })
    const after = ReportPercentagePolicy.computePresencePercentage({ present: 1, absent: 1, justified: 1, unrecorded: 0 })
    expect(after.value!).toBeLessThan(before.value!)
  })
})

describe("T06 — RC-22 prioridad y dedupe", () => {
  it("deadline prevalece sobre severity", () => {
    const soonLow = attention({ id: "a", deadline: "2026-01-01T00:00:00.000Z", severity: "LOW", dedupeKey: "a" })
    const lateHigh = attention({ id: "b", deadline: "2026-03-01T00:00:00.000Z", severity: "HIGH", dedupeKey: "b" })
    expect([soonLow, lateHigh].sort(compareAttention).map((item) => item.id)).toEqual(["a", "b"])
  })

  it("deadline null va al final", () => {
    const none = attention({ id: "a", deadline: null, severity: "HIGH", dedupeKey: "a" })
    const dated = attention({ id: "b", severity: "LOW", dedupeKey: "b" })
    expect([none, dated].sort(compareAttention).map((item) => item.id)).toEqual(["b", "a"])
  })

  it("dedupe por dedupeKey", () => {
    const a = attention({ id: "a", dedupeKey: "k" })
    const b = attention({ id: "b", dedupeKey: "k" })
    expect(buildAttentionList([a, b]).total).toBe(1)
  })
})

describe("T06 — RC-21 ranking y cursor", () => {
  it("normaliza acentos y ordena exact > prefix > fuzzy", () => {
    expect(normalizeQuery("  LUÇÍA  ")).toBe("lucia")
    expect(matchRank("Lucía", "lucia").tier).toBe(3)
    expect(matchRank("Luciano", "lucia").tier).toBe(2)
    expect(matchRank("Ana Lucía", "lucia").tier).toBe(1)
    expect(matchRank("Otro", "lucia").tier).toBe(0)
  })

  it("desempate determinista por tipo e id", () => {
    const a = { id: "b", type: "event" as const, rank: { tier: 3, score: 100 } }
    const b = { id: "a", type: "event" as const, rank: { tier: 3, score: 100 } }
    expect(compareRank(a, b)).toBeGreaterThan(0)
  })

  it("cursor firmado: roundtrip, tampering, exp, identidad y nonce", () => {
    const cursor = new SearchCursor(SECRET)
    const sha = (value: string) => createHash("sha256").update(value).digest("hex")
    const identity = { accountId: "acc", personId: "per", scopeHash: "scope", ah: sha("acc"), sh: sha("per|scope") }
    const expected = { qh: "q", fh: "f" }
    const key = { tier: 2, score: 80, type: "person", id: "id-1" }
    const raw = cursor.encode({ k: key, qh: "q", fh: "f", sh: identity.sh, ah: identity.ah })
    expect(cursor.decode(raw, identity, expected).k).toEqual(key)
    expect(() => cursor.decode(`${raw}x`, identity as any, expected)).toThrow("Invalid cursor")
    const expired = cursor.encode({ k: key, qh: "q", fh: "f", sh: identity.sh, ah: identity.ah, exp: 1 })
    expect(() => cursor.decode(expired, identity as any, expected)).toThrow("Invalid cursor")
    expect(() => cursor.decode(raw, { ...identity, accountId: "otro" } as any, expected)).toThrow("Invalid cursor")
    expect(() => cursor.decode(raw, identity as any, expected)).toThrow("Invalid cursor") // nonce reutilizado
  })

  it("keyset lexicográfico K=(tier,score,type,id)", () => {
    // tier DESC: tier 3 va ANTES que tier 2 => comparador devuelve < 0.
    expect(compareCursorKey({ tier: 3, score: 100, type: "person", id: "a" }, { tier: 2, score: 99, type: "team", id: "z" })).toBeLessThan(0)
    expect(compareCursorKey({ tier: 2, score: 80, type: "person", id: "a" }, { tier: 2, score: 80, type: "team", id: "z" })).toBeLessThan(0)
  })
})

describe("T06 — A-02 frontera Notification", () => {
  it("no hay novena fuente operativa de Attention", () => {
    const built = buildAttentionList([attention({ sourceType: "NOTIFICATION_CONTEXT", dedupeKey: "n" })])
    expect(built.items[0]?.sourceType).toBe("NOTIFICATION_CONTEXT")
    expect(built.items[0]?.allowedActions).toEqual([])
  })
})

describe("T06 — nonce guard", () => {
  it("expira nonces", () => {
    const guard = new CursorNonceGuard()
    expect(guard.consume("n", 100, 50)).toBe(true)
    expect(guard.consume("n", 100, 60)).toBe(false)
    expect(guard.consume("otro", 100, 150)).toBe(true)
  })
})
