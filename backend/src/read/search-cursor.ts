import { createHash, createHmac, timingSafeEqual } from "node:crypto"
import type { SearchCursorIdentity, SearchCursorPayload } from "../../../shared/contracts/t06.js"
import { AppError } from "../shared/errors.js"

const VERSION = 1
const DEFAULT_TTL_MS = 5 * 60 * 1000

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex")
}

function b64url(value: string | Buffer): string {
  return Buffer.from(value).toString("base64url")
}

function sign(raw: string, secret: string): string {
  return createHmac("sha256", secret).update(raw).digest("base64url")
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

/**
 * TC-01 / A-05: cursor determinista ligado a identidad, filtros, versión,
 * expiración y scope. No hay snapshot global: la garantía es POR PÁGINA.
 */
export class SearchCursor {
  constructor(
    private readonly secret: string,
    private readonly ttlMs = DEFAULT_TTL_MS,
    private readonly nonces = new CursorNonceGuard(),
  ) {}

  static hashes(input: {
    accountId: string
    personId: string
    roles: readonly string[]
    coachTeamIds: readonly string[]
    captainTeamIds: readonly string[]
    eventScopeIds: readonly string[]
    isSubcommittee: boolean
  }): { ah: string; sh: string; scopeHash: string } {
    const canonical = [
      [...input.roles].sort().join(","),
      [...input.coachTeamIds].sort().join(","),
      [...input.captainTeamIds].sort().join(","),
      [...input.eventScopeIds].sort().join(","),
      input.isSubcommittee ? "1" : "0",
    ].join("|")
    const scopeHash = sha256(canonical)
    return { ah: sha256(input.accountId), sh: sha256(`${input.personId}|${scopeHash}`), scopeHash }
  }

  static queryHash(query: string): string {
    return sha256(query.trim().toLowerCase())
  }

  static filtersHash(type: string | null, filters: Record<string, string | undefined>): string {
    const keys = Object.keys(filters).sort()
    return sha256([type ?? "", ...keys.map((key) => `${key}=${filters[key] ?? ""}`)].join("|"))
  }

  static scopeHash(scope: readonly string[]): string {
    return sha256([...scope].sort().join("|"))
  }

  encode(input: Omit<SearchCursorPayload, "v" | "exp" | "nonce"> & { exp?: number; nonce?: string }): string {
    const payload: SearchCursorPayload = {
      v: VERSION,
      k: input.k,
      qh: input.qh,
      fh: input.fh,
      sh: input.sh,
      ah: input.ah,
      exp: input.exp ?? Date.now() + this.ttlMs,
      nonce: input.nonce ?? createHash("sha256").update(`${Date.now()}|${Math.random()}`).digest("hex").slice(0, 24),
    }
    const body = b64url(JSON.stringify(payload))
    return `${body}.${sign(body, this.secret)}`
  }

  /**
   * Rechaza firma inválida, v != 1, vencimiento, nonce repetido y reutilización
   * entre identidades/scopes. Errores SIEMPRE genéricos (non-enumeration).
   */
  decode(raw: string, identity: SearchCursorIdentity, expected: { qh: string; fh: string }, now = Date.now()): SearchCursorPayload {
    const invalid = () => new AppError("INVALID_CURSOR", "Invalid cursor", "transport")
    if (typeof raw !== "string" || raw.length === 0 || raw.length > 4096) throw invalid()
    const [body, signature, ...extra] = raw.split(".")
    if (!body || !signature || extra.length > 0 || !safeEqual(signature, sign(body, this.secret))) throw invalid()

    let payload: SearchCursorPayload
    try {
      payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SearchCursorPayload
    } catch {
      throw invalid()
    }
    if (!payload || payload.v !== VERSION || !payload.k || typeof payload.exp !== "number") throw invalid()
    if (payload.exp <= now) throw invalid()
    if (payload.qh !== expected.qh || payload.fh !== expected.fh) throw invalid()
    if (payload.ah !== sha256(identity.accountId)) throw invalid()
    if (payload.sh !== sha256(`${identity.personId}|${identity.scopeHash}`)) throw invalid()
    if (!this.nonces.consume(payload.nonce, payload.exp, now)) throw invalid()
    return payload
  }
}

/** Guarda nonces en memoria con expiración; impide reutilización (Q04d/Q04e). */
export class CursorNonceGuard {
  private readonly seen = new Map<string, number>()

  consume(nonce: string, exp: number, now: number): boolean {
    if (!nonce || typeof nonce !== "string") return false
    for (const [key, expiry] of this.seen) if (expiry <= now) this.seen.delete(key)
    if (this.seen.has(nonce)) return false
    this.seen.set(nonce, exp)
    return true
  }

  clear(): void {
    this.seen.clear()
  }
}

/**
 * Comparación en ORDEN DE ORDENACIÓN: tier DESC, score DESC, type ASC, id ASC.
 * Devuelve <0 si `a` va antes que `b`, >0 si va después. Un resultado va en la
 * siguiente página cuando compareCursorKey(resultado, cursor) > 0.
 */
const TYPE_ORDER: Record<string, number> = {
  all: -1,
  person: 0,
  team: 1,
  division: 2,
  line: 3,
  event: 4,
  announcement: 5,
  conversation: 6,
}

function typeIndex(type: string): number {
  return TYPE_ORDER[type] ?? 99
}

export function compareCursorKey(a: SearchCursorPayload["k"], b: SearchCursorPayload["k"]): number {
  if (a.tier !== b.tier) return b.tier - a.tier
  if (a.score !== b.score) return b.score - a.score
  if (a.type !== b.type) return typeIndex(a.type) - typeIndex(b.type)
  if (a.id !== b.id) return a.id < b.id ? -1 : 1
  return 0
}
