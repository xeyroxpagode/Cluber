import { sql, type Transaction } from "kysely"
import { randomUUID } from "node:crypto"
import type { DatabaseSchema } from "../db/types.js"
import { AppError } from "../shared/errors.js"
import { isNonEmpty, isValidEmail, normalizeEmail } from "../shared/normalize.js"
import { AuditWriter, redactAuditValue } from "../audit/audit.js"
import { clubDateStart, calendarDateInZone } from "../shared/club-time.js"

export interface PersonInput {
  firstName: string
  lastName: string
  dni?: string | null
  birthDate?: string | null
  phone?: string | null
  email?: string | null
}

export function normalizePersonInput(input: PersonInput, requireName = true) {
  if (!isNonEmpty(input.firstName, 100) || !isNonEmpty(input.lastName, 100)) {
    throw new AppError("VALIDATION_FAILED", "First and last name are required", "domain_validation", false, { name: ["required"] })
  }
  const email = normalizeEmail(input.email)
  if (input.email !== undefined && input.email !== null && (!email || !isValidEmail(email))) {
    throw new AppError("VALIDATION_FAILED", "Person email is invalid", "domain_validation", false, { email: ["invalid"] })
  }
  const birthDate = input.birthDate === "" ? null : input.birthDate ?? null
  if (birthDate && !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    throw new AppError("VALIDATION_FAILED", "Birth date must use YYYY-MM-DD", "domain_validation", false, { birthDate: ["invalid"] })
  }
  const phone = input.phone?.trim() || null
  if (phone && phone.length > 64) throw new AppError("VALIDATION_FAILED", "Phone is too long", "domain_validation", false, { phone: ["too_long"] })
  const dni = input.dni?.trim() || null
  if (dni && dni.length > 40) throw new AppError("VALIDATION_FAILED", "DNI is too long", "domain_validation", false, { dni: ["too_long"] })
  return {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    dni,
    birthDate,
    phone,
    email,
  }
}

async function findDuplicateDni(tx: Transaction<DatabaseSchema>, dni: string | null, exceptPersonId?: string) {
  if (!dni) return
  let query = tx.selectFrom("app.people").select("id").where(sql<boolean>`upper(trim(dni)) = upper(trim(${dni}))`)
  if (exceptPersonId) query = query.where("id", "<>", exceptPersonId)
  const row = await query.executeTakeFirst()
  if (row) throw new AppError("DUPLICATE_DNI", "DNI already belongs to a registered person", "conflict")
}

export class PeopleService {
  constructor(private readonly audit = new AuditWriter()) {}

  async register(tx: Transaction<DatabaseSchema>, actorPersonId: string, input: PersonInput) {
    const data = normalizePersonInput(input)
    await findDuplicateDni(tx, data.dni)
    const inserted = await tx.insertInto("app.people").values({
      id: randomUUID(),
      first_name: data.firstName,
      last_name: data.lastName,
      dni: data.dni,
      birth_date: data.birthDate,
      phone: data.phone,
      email: data.email,
      created_at: new Date(),
      updated_at: new Date(),
    }).returningAll().executeTakeFirstOrThrow()
    await this.audit.record(tx, {
      actorPersonId,
      action: "PERSON_REGISTERED",
      targetType: "Person",
      targetId: inserted.id,
      source: "CMD-PPL-01",
      diff: { firstName: data.firstName, lastName: data.lastName, dni: data.dni, birthDate: data.birthDate, phone: data.phone, email: data.email },
    })
    return inserted
  }

  async updateIdentity(tx: Transaction<DatabaseSchema>, personId: string, input: Partial<Pick<PersonInput, "firstName" | "lastName">>) {
    if (!isNonEmpty(input.firstName ?? undefined, 100) || !isNonEmpty(input.lastName ?? undefined, 100)) {
      throw new AppError("VALIDATION_FAILED", "First and last name are required", "domain_validation")
    }
    return tx.updateTable("app.people").set({ first_name: input.firstName!.trim(), last_name: input.lastName!.trim(), updated_at: new Date() }).where("id", "=", personId).returningAll().executeTakeFirstOrThrow()
  }

  async updateFields(tx: Transaction<DatabaseSchema>, actorPersonId: string, targetPersonId: string, input: Partial<PersonInput>, source: string, action: string) {
    const current = await tx.selectFrom("app.people").selectAll().where("id", "=", targetPersonId).executeTakeFirst()
    if (!current) throw new AppError("PERSON_NOT_FOUND", "Person was not found", "not_found")
    const data = normalizePersonInput({ firstName: input.firstName ?? current.first_name, lastName: input.lastName ?? current.last_name, dni: input.dni === undefined ? current.dni : input.dni, birthDate: input.birthDate === undefined ? current.birth_date : input.birthDate, phone: input.phone === undefined ? current.phone : input.phone, email: input.email === undefined ? current.email : input.email })
    await findDuplicateDni(tx, data.dni, targetPersonId)
    const updated = await tx.updateTable("app.people").set({ first_name: data.firstName, last_name: data.lastName, dni: data.dni, birth_date: data.birthDate, phone: data.phone, updated_at: new Date() }).where("id", "=", targetPersonId).returningAll().executeTakeFirstOrThrow()
    await this.audit.record(tx, {
      actorPersonId,
      action,
      targetType: "Person",
      targetId: targetPersonId,
      source,
      diff: { before: redactAuditValue({ firstName: current.first_name, lastName: current.last_name, dni: current.dni, birthDate: current.birth_date, phone: current.phone, email: current.email }), after: redactAuditValue({ firstName: updated.first_name, lastName: updated.last_name, dni: updated.dni, birthDate: updated.birth_date, phone: updated.phone, email: updated.email }) },
    })
    return updated
  }

  async selfUpdateIdentity(tx: Transaction<DatabaseSchema>, actorPersonId: string, input: Partial<Pick<PersonInput, "firstName" | "lastName">>) {
    const changed = await this.updateIdentity(tx, actorPersonId, input)
    await this.audit.record(tx, { actorPersonId, action: "PERSON_SELF_IDENTITY_UPDATED", targetType: "Person", targetId: actorPersonId, source: "OP-PPL-SELF-IDENTITY-EDIT", diff: { firstName: changed.first_name, lastName: changed.last_name } })
    return changed
  }

  async selfUpdatePhone(tx: Transaction<DatabaseSchema>, actorPersonId: string, phone: string | null) {
    const current = await tx.selectFrom("app.people").select(["first_name", "last_name", "phone"]).where("id", "=", actorPersonId).executeTakeFirst()
    if (!current) throw new AppError("PERSON_NOT_FOUND", "Person was not found", "not_found")
    const normalizedPhone = phone?.trim() || null
    if (normalizedPhone && normalizedPhone.length > 64) throw new AppError("VALIDATION_FAILED", "Phone is too long", "domain_validation", false, { phone: ["too_long"] })
    const updated = await tx.updateTable("app.people").set({ phone: normalizedPhone, updated_at: new Date() }).where("id", "=", actorPersonId).returning(["phone"]).executeTakeFirstOrThrow()
    await this.audit.record(tx, { actorPersonId, action: "PERSON_SELF_PHONE_UPDATED", targetType: "Person", targetId: actorPersonId, source: "CMD-PPL-02", diff: { phone: { before: current.phone ? "[REDACTED_CONTACT]" : null, after: updated.phone ? "[REDACTED_CONTACT]" : null } } })
    return updated
  }

  profileCompleted(person: { dni: string | null; birth_date?: string | Date | null; phone: string | null; email: string | null }): boolean {
    return Boolean(person.dni && person.birth_date && person.phone && person.email)
  }

  calendarDate(instant: Date, timeZone: string): string {
    return calendarDateInZone(instant, timeZone)
  }

  clubMidnight(date: string, timeZone: string): Date {
    return clubDateStart(date, timeZone)
  }
}
