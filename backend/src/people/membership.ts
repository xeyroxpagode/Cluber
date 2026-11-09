import { randomUUID } from "node:crypto"
import type { Transaction } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import { AppError } from "../shared/errors.js"
import { AuditWriter } from "../audit/audit.js"

export interface MembershipInput { validFrom: string; validUntil?: string | null }

function period(input: MembershipInput): { validFrom: Date; validUntil: Date | null } {
  const validFrom = new Date(input.validFrom)
  if (Number.isNaN(validFrom.getTime())) throw new AppError("VALIDATION_FAILED", "Membership start is invalid", "domain_validation", false, { validFrom: ["invalid"] })
  const validUntil = input.validUntil ? new Date(input.validUntil) : null
  if (validUntil && (Number.isNaN(validUntil.getTime()) || validUntil <= validFrom)) throw new AppError("VALIDATION_FAILED", "Membership end must be after its start", "domain_validation", false, { validUntil: ["invalid"] })
  return { validFrom, validUntil }
}

export class MembershipService {
  constructor(private readonly audit = new AuditWriter()) {}

  async create(tx: Transaction<DatabaseSchema>, actorPersonId: string, personId: string, input: MembershipInput) {
    const person = await tx.selectFrom("app.people").select("id").where("id", "=", personId).executeTakeFirst()
    if (!person) throw new AppError("PERSON_NOT_FOUND", "Person was not found", "not_found")
    const { validFrom, validUntil } = period(input)
    const inserted = await tx.insertInto("app.memberships").values({
      id: randomUUID(),
      person_id: personId,
      valid_from: validFrom,
      valid_until: validUntil,
      created_at: new Date(),
    }).returningAll().executeTakeFirstOrThrow()
    await this.audit.record(tx, { actorPersonId, action: "MEMBERSHIP_REGISTERED", targetType: "Membership", targetId: inserted.id, source: "CMD-PPL-03", diff: { personId, validFrom: validFrom.toISOString(), validUntil: validUntil?.toISOString() ?? null } })
    return inserted
  }

  async end(tx: Transaction<DatabaseSchema>, actorPersonId: string, personId: string, membershipId: string, at: Date) {
    const current = await tx.selectFrom("app.memberships").selectAll().where("id", "=", membershipId).where("person_id", "=", personId).forUpdate().executeTakeFirst()
    if (!current) throw new AppError("MEMBERSHIP_NOT_FOUND", "Membership was not found", "not_found")
    if (new Date(current.valid_from).getTime() > at.getTime() || (current.valid_until && new Date(current.valid_until).getTime() <= at.getTime())) {
      throw new AppError("MEMBERSHIP_NOT_ACTIVE", "The membership period is not active", "conflict")
    }
    const overlapping = await tx.selectFrom("app.memberships").select("id").where("person_id", "=", personId)
      .where("valid_from", "<=", at)
      .where((eb) => eb.or([eb("valid_until", "is", null), eb("valid_until", ">", at)]))
      .execute()
    if (overlapping.length !== 1) throw new AppError("MEMBERSHIP_AMBIGUOUS", "Multiple active memberships are valid; cannot choose one silently", "conflict")
    const updated = await tx.updateTable("app.memberships").set({ valid_until: at }).where("id", "=", membershipId).returningAll().executeTakeFirstOrThrow()
    await this.audit.record(tx, { actorPersonId, action: "MEMBERSHIP_ENDED", targetType: "Membership", targetId: membershipId, source: "CMD-PPL-04", diff: { validUntil: at.toISOString() } })
    return updated
  }

  async active(tx: Transaction<DatabaseSchema>, personId: string, at: Date): Promise<boolean> {
    const row = await tx.selectFrom("app.memberships").select("id").where("person_id", "=", personId)
      .where("valid_from", "<=", at)
      .where((eb) => eb.or([eb("valid_until", "is", null), eb("valid_until", ">", at)]))
      .executeTakeFirst()
    return Boolean(row)
  }

  async list(tx: Transaction<DatabaseSchema>, personId: string) {
    return tx.selectFrom("app.memberships").selectAll().where("person_id", "=", personId).orderBy("valid_from", "desc").execute()
  }
}
