import { randomUUID } from "node:crypto"
import { sql, type Kysely, type Transaction } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import type { TransactionRunner } from "../db/transaction-runner.js"

export interface OutboxPayload {
  schemaVersion: 1
  event: "resource.changed" | "notification.created" | "conversation.changed" | "authority.changed" | "session.invalidated"
  recipients: string[]
  resourceType: string
  resourceId: string
  revision?: number
  invalidate: string[]
}

export class OutboxWriter {
  async enqueue(tx: Transaction<DatabaseSchema>, input: { topic: string; aggregateType: string; aggregateId: string; payload: OutboxPayload }): Promise<string> {
    const row = await tx.insertInto("infra.outbox_events").values({
      topic: input.topic,
      aggregate_type: input.aggregateType,
      aggregate_id: input.aggregateId,
      payload: input.payload as never,
      processed_at: null,
      last_error: null,
      failed_at: null,
    }).returning("id").executeTakeFirstOrThrow()
    await sql`select pg_notify('gei_outbox_wakeup', ${row.id})`.execute(tx)
    return row.id
  }
}

export class OutboxWorker {
  private accepting = true
  constructor(private readonly runner: TransactionRunner, private readonly handler: (event: { id: string; payload: OutboxPayload }) => Promise<void>) {}
  stopClaiming(): void { this.accepting = false }

  async processBatch(limit = 25): Promise<number> {
    if (!this.accepting) return 0
    return this.runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx, evaluationInstant }) => {
      const rows = await sql<{ id: string; payload: OutboxPayload; attempt_count: number }>`
        select id, payload, attempt_count from infra.outbox_events
        where processed_at is null and failed_at is null and available_at <= transaction_timestamp()
        order by created_at for update skip locked limit ${limit}
      `.execute(tx)
      for (const row of rows.rows) {
        try {
          await this.handler({ id: row.id, payload: row.payload })
          await tx.updateTable("infra.outbox_events").set({ processed_at: evaluationInstant, last_error: null }).where("id", "=", row.id).execute()
          await sql`select pg_notify('gei_realtime', ${row.id})`.execute(tx)
        } catch (error) {
          const attempts = row.attempt_count + 1
          const redacted = error instanceof Error ? error.name.slice(0, 120) : "TechnicalHandlerError"
          await tx.updateTable("infra.outbox_events").set({
            attempt_count: attempts,
            last_error: redacted,
            failed_at: attempts >= 10 ? evaluationInstant : null,
            available_at: new Date(evaluationInstant.getTime() + Math.min(300_000, 1_000 * 2 ** (attempts - 1))),
          }).where("id", "=", row.id).execute()
        }
      }
      return rows.rows.length
    }, true)
  }
}

export class HousekeepingWorker {
  constructor(private readonly db: Kysely<DatabaseSchema>) {}
  async processBatch(limit = 250): Promise<number> {
    const result = await sql<{ count: number }>`
      with deleted as (
        delete from infra.idempotency_records where id in (
          select id from infra.idempotency_records where expires_at < transaction_timestamp() limit ${limit} for update skip locked
        ) returning 1
      ) select count(*)::int as count from deleted
    `.execute(this.db)
    await sql`delete from infra.rate_limit_windows where ctid in (
      select ctid from infra.rate_limit_windows where updated_at < transaction_timestamp() - interval '24 hours' limit ${limit}
    )`.execute(this.db)
    await sql`delete from infra.outbox_events where ctid in (
      select ctid from infra.outbox_events where processed_at < transaction_timestamp() - interval '7 days' limit ${limit}
    )`.execute(this.db)
    await sql`delete from infra.outbox_events where ctid in (
      select ctid from infra.outbox_events where failed_at < transaction_timestamp() - interval '30 days' limit ${limit}
    )`.execute(this.db)
    return result.rows[0]?.count ?? 0
  }
}
