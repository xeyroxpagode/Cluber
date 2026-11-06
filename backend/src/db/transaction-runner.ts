import { sql, type Transaction } from "kysely"
import type { DatabaseSchema } from "./types.js"

export type TransactionProfile = "COMMAND_STANDARD" | "COMMAND_SERIALIZABLE" | "READ_STANDARD" | "READ_REPORT"
export interface TransactionContext {
  readonly tx: Transaction<DatabaseSchema>
  readonly evaluationInstant: Date
  readonly traceId: string
  readonly attemptNumber: number
}

const RETRYABLE = new Set(["40001", "40P01"])

export class TransactionRunner {
  constructor(private readonly database: import("kysely").Kysely<DatabaseSchema>) {}

  async run<T>(profile: TransactionProfile, traceId: string, fn: (context: TransactionContext) => Promise<T>, retrySafe = false): Promise<T> {
    const maxAttempts = retrySafe ? 3 : 1
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        let transaction = this.database.transaction()
        transaction = transaction.setIsolationLevel(profile === "COMMAND_SERIALIZABLE" ? "serializable" : "read committed")
        if (profile === "READ_REPORT") transaction = transaction.setAccessMode("read only")
        return await transaction.execute(async (tx) => {
          const command = profile.startsWith("COMMAND")
          await sql.raw(`set local statement_timeout = '${profile === "READ_REPORT" ? "15s" : command ? "8s" : "5s"}'`).execute(tx)
          if (command) {
            await sql`set local lock_timeout = '2s'`.execute(tx)
            await sql`set local idle_in_transaction_session_timeout = '10s'`.execute(tx)
          }
          const clock = await sql<{ now: Date }>`select transaction_timestamp() as now`.execute(tx)
          return fn({ tx, evaluationInstant: new Date(clock.rows[0]!.now), traceId, attemptNumber: attempt })
        })
      } catch (error) {
        if (attempt >= maxAttempts || !RETRYABLE.has((error as { code?: string }).code ?? "")) throw error
      }
    }
    throw new Error("Unreachable transaction retry state")
  }
}
