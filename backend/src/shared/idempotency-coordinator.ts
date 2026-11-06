import { sql, type Transaction } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import { canonicalJson, sha256 } from "./crypto.js"
import { AppError } from "./errors.js"

export interface IdempotencyInput {
  scopeKey: string
  commandId: string
  key: string
  input: unknown
}
export type IdempotencyResult = { acquired: true; id: string } | { acquired: false; status: number; snapshot: unknown }

export class IdempotencyCoordinator {
  requestHash(input: IdempotencyInput): Buffer {
    return sha256(`${input.commandId}\n${input.scopeKey}\n${canonicalJson(input.input)}`)
  }

  async acquire(tx: Transaction<DatabaseSchema>, input: IdempotencyInput, now: Date): Promise<IdempotencyResult> {
    if (!input.key || input.key.length > 128 || !/^[\x21-\x7E]+$/.test(input.key)) {
      throw new AppError("IDEMPOTENCY_KEY_REQUIRED", "A valid Idempotency-Key is required", "transport")
    }
    const hash = this.requestHash(input)
    const inserted = await sql<{ id: string }>`
      insert into infra.idempotency_records
        (scope_key, command_id, idempotency_key, request_hash, status, expires_at)
      values (${input.scopeKey}, ${input.commandId}, ${input.key}, ${hash}, 'IN_PROGRESS', ${new Date(now.getTime() + 86_400_000)})
      on conflict (scope_key, command_id, idempotency_key) do nothing
      returning id
    `.execute(tx)
    if (inserted.rows[0]) return { acquired: true, id: inserted.rows[0].id }

    const existing = await sql<{ request_hash: Buffer; status: string; response_status: number | null; response_snapshot: unknown }>`
      select request_hash, status, response_status, response_snapshot
      from infra.idempotency_records
      where scope_key=${input.scopeKey} and command_id=${input.commandId} and idempotency_key=${input.key}
      for update
    `.execute(tx)
    const row = existing.rows[0]
    if (!row || !row.request_hash.equals(hash)) throw new AppError("IDEMPOTENCY_KEY_REUSED", "Idempotency key was used for a different request", "conflict")
    if (row.status !== "SUCCEEDED" || row.response_status === null) throw new AppError("CONCURRENT_MODIFICATION", "The original request is still resolving", "conflict", true)
    return { acquired: false, status: row.response_status, snapshot: row.response_snapshot }
  }

  async succeed(tx: Transaction<DatabaseSchema>, id: string, status: number, snapshot: unknown, resource?: { type: string; id: string }): Promise<void> {
    await tx.updateTable("infra.idempotency_records").set({
      status: "SUCCEEDED",
      response_status: status,
      response_snapshot: JSON.parse(JSON.stringify(snapshot)) as never,
      resource_type: resource?.type ?? null,
      resource_id: resource?.id ?? null,
    }).where("id", "=", id).executeTakeFirstOrThrow()
  }
}
