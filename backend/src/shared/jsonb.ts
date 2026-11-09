import { sql, type RawBuilder } from "kysely"

/** Serializa un valor JS como parámetro jsonb seguro. */
export function jsonbParam(value: unknown): RawBuilder<never> {
  return sql`(${JSON.stringify(value ?? [])}::jsonb)` as RawBuilder<never>
}
