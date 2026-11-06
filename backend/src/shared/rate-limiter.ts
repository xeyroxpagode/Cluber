import { sql, type Kysely } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import { hmacSha256 } from "./crypto.js"
import { AppError } from "./errors.js"

export interface RateLimitPolicy { readonly name: string; readonly limit: number; readonly windowSeconds: number }

export class RateLimiter {
  constructor(private readonly db: Kysely<DatabaseSchema>, private readonly pepper: Buffer) {}

  async consume(policy: RateLimitPolicy, rawKey: string, now = new Date()): Promise<{ remaining: number; retryAfter?: number }> {
    const windowMs = policy.windowSeconds * 1_000
    const windowStartedAt = new Date(Math.floor(now.getTime() / windowMs) * windowMs)
    const windowEndsAt = new Date(windowStartedAt.getTime() + windowMs)
    const keyHash = hmacSha256(this.pepper, `gei-rate-limit:v1:${policy.name}:${rawKey}`)
    const result = await sql<{ count: number; blocked_until: Date | null }>`
      insert into infra.rate_limit_windows(policy, key_hash, window_started_at, count, blocked_until, updated_at)
      values (${policy.name}, ${keyHash}, ${windowStartedAt}, 1, null, transaction_timestamp())
      on conflict (policy, key_hash, window_started_at) do update
      set count = infra.rate_limit_windows.count + 1,
          blocked_until = case when infra.rate_limit_windows.count + 1 > ${policy.limit}
            then ${windowEndsAt} else infra.rate_limit_windows.blocked_until end,
          updated_at = transaction_timestamp()
      returning count, blocked_until
    `.execute(this.db)
    const row = result.rows[0]!
    if (row.count > policy.limit) {
      const retryAfter = Math.max(1, Math.ceil((new Date(row.blocked_until ?? windowEndsAt).getTime() - now.getTime()) / 1_000))
      const error = new AppError("RATE_LIMITED", "Too many attempts", "rate_limit", true)
      Object.assign(error, { retryAfter })
      throw error
    }
    return { remaining: Math.max(0, policy.limit - row.count) }
  }
}
