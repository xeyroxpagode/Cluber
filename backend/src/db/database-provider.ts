import { Kysely, PostgresDialect, sql } from "kysely"
import pg from "pg"
import type { AppConfig } from "../config/load-config.js"
import type { DatabaseSchema } from "./types.js"

export class DatabaseProvider {
  readonly pool: pg.Pool
  readonly db: Kysely<DatabaseSchema>

  constructor(config: Pick<AppConfig, "databaseUrl" | "databaseRole">) {
    this.pool = new pg.Pool({
      connectionString: config.databaseUrl,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      application_name: "gei-backend",
      options: `-c role=${config.databaseRole} -c timezone=UTC`,
    })
    this.db = new Kysely<DatabaseSchema>({ dialect: new PostgresDialect({ pool: this.pool }) })
  }

  async verify(): Promise<void> {
    const result = await sql<{ role: string; app: boolean; infra: boolean }>`
      select current_user as role,
        has_schema_privilege(current_user, 'app', 'USAGE') as app,
        has_schema_privilege(current_user, 'infra', 'USAGE') as infra
    `.execute(this.db)
    const row = result.rows[0]
    if (!row || row.role !== "gei_backend" || !row.app || !row.infra) throw new Error("Runtime database role/grants are invalid")
  }

  async isReady(): Promise<boolean> {
    try {
      await sql`select 1`.execute(this.db)
      return true
    } catch {
      return false
    }
  }

  async close(): Promise<void> {
    await this.db.destroy()
  }
}
