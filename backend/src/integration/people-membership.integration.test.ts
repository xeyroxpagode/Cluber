import { expect, test, describe } from "vitest"
import type { Kysely } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import { runtime } from "./t02-base.js"
import { AppError } from "../shared/errors.js"
import { randomUUID } from "node:crypto"

function emailFor(tag: string): string {
  return `${tag}-${randomUUID().slice(0, 8)}@example.com`
}

function dniFor(tag: string): string {
  return (tag + "-" + crypto.randomUUID().replace(/-/g, "")).slice(0, 38)
}

describe("T02 People & Membership", () => {
  async function bootstrapActor(tx: Kysely<DatabaseSchema>): Promise<string> {
    return tx.insertInto("app.people").values({
      id: randomUUID(), first_name: "Actor", last_name: "Test", dni: dniFor("actor"),
      birth_date: "1990-01-01", phone: "12345678", email: emailFor("actor"), created_at: new Date(), updated_at: new Date(),
    }).returning("id").executeTakeFirstOrThrow().then((r) => r.id)
  }

  async function insertTxPerson(tx: Kysely<DatabaseSchema>, tag: string, dni?: string | null): Promise<string> {
    return tx.insertInto("app.people").values({
      id: randomUUID(), first_name: tag, last_name: "Person", dni: dni ?? dniFor(tag),
      birth_date: "1990-01-01", phone: "12345678", email: emailFor(tag), created_at: new Date(), updated_at: new Date(),
    }).returning("id").executeTakeFirstOrThrow().then((r) => r.id)
  }

  test("registers person, membership, and provision account with unique email", async () => {
    const { services, runner } = runtime!
    await runner.run("COMMAND_STANDARD", "t1", async ({ tx }) => {
      const actorId = await bootstrapActor(tx)
      const personId = await insertTxPerson(tx, "ana", dniFor("ana"))
      const regEmail = emailFor("ana-reg")
      const person = await services.people.register(tx, actorId, {
        firstName: "Ana", lastName: "González", dni: dniFor("ana-reg"), email: regEmail,
      })
      expect(person.email).toBe(regEmail)

      await services.memberships.create(tx, actorId, personId, { validFrom: "2026-01-01" })
      const active = await services.memberships.active(tx, personId, new Date("2026-06-01"))
      expect(active).toBe(true)

      const result = await services.accounts.provision(tx, actorId, personId, new Date())
      expect(result.account.status).toBe("PENDING")
      expect(result.account.password_hash).toBeNull()
      expect(result.setupCode).toMatch(/^GEI-/)
    })
  })

  test("rejects duplicate authenticable email and duplicate account per person", async () => {
    const { services, runner } = runtime!
    await runner.run("COMMAND_STANDARD", "t2", async ({ tx }) => {
      const actorId = await bootstrapActor(tx)
      const email = emailFor("dup")
      const p1 = await tx.insertInto("app.people").values({
        id: randomUUID(), first_name: "P1", last_name: "One", dni: dniFor("dup1"), email, created_at: new Date(), updated_at: new Date(),
      }).returning("id").executeTakeFirstOrThrow().then((r) => r.id)
      const p2 = await tx.insertInto("app.people").values({
        id: randomUUID(), first_name: "P2", last_name: "Two", dni: dniFor("dup2"), email, created_at: new Date(), updated_at: new Date(),
      }).returning("id").executeTakeFirstOrThrow().then((r) => r.id)
      await services.accounts.provision(tx, actorId, p1, new Date())
      try {
        await services.accounts.provision(tx, actorId, p1, new Date())
        throw new Error("should have thrown ACCOUNT_ALREADY_EXISTS")
      } catch (e) {
        expect((e as AppError).code).toBe("ACCOUNT_ALREADY_EXISTS")
      }
      try {
        await services.accounts.provision(tx, actorId, p2, new Date())
        throw new Error("should have thrown DUPLICATE_EMAIL")
      } catch (e) {
        expect((e as AppError).code).toBe("DUPLICATE_EMAIL")
      }
      const acctForP1 = await tx.selectFrom("app.accounts").where("person_id", "=", p1).executeTakeFirst()
      expect(acctForP1).toBeDefined()
    })
  })

  test("membership end keeps history and returns", async () => {
    const { services, runner } = runtime!
    await runner.run("COMMAND_STANDARD", "t3", async ({ tx }) => {
      const actorId = await bootstrapActor(tx)
      const personId = await insertTxPerson(tx, "memb", dniFor("memb"))
      await services.memberships.create(tx, actorId, personId, { validFrom: "2026-01-01", validUntil: null })
      const before = await services.memberships.list(tx, personId)
      expect(before.length).toBe(1)
      await services.memberships.end(tx, actorId, personId, before[0].id, new Date("2026-06-01"))
      const ended = await tx.selectFrom("app.memberships").selectAll().where("id", "=", before[0].id).executeTakeFirst()
      expect(ended.valid_until?.toISOString()).toBe("2026-06-01T00:00:00.000Z")
      const active = await services.memberships.active(tx, personId, new Date("2026-07-01"))
      expect(active).toBe(false)
      await services.memberships.create(tx, actorId, personId, { validFrom: "2026-07-01" })
      const activeAgain = await services.memberships.active(tx, personId, new Date("2026-08-01"))
      expect(activeAgain).toBe(true)
      const all = await services.memberships.list(tx, personId)
      expect(all.length).toBe(2)
    })
  })

  test("rejects duplicate DNI when present", async () => {
    const { services, runner } = runtime!
    await runner.run("COMMAND_STANDARD", "t4", async ({ tx }) => {
      const actorId = await bootstrapActor(tx)
      const sharedDni = dniFor("dup-dni")
      await tx.insertInto("app.people").values({
        id: randomUUID(), first_name: "D", last_name: "One", dni: sharedDni, email: emailFor("dni1"), created_at: new Date(), updated_at: new Date(),
      }).executeTakeFirstOrThrow()
      try {
        await services.people.register(tx, actorId, {
          firstName: "B", lastName: "C", dni: sharedDni, email: emailFor("dni2"),
        })
        throw new Error("should have thrown DUPLICATE_DNI")
      } catch (e) {
        expect((e as AppError).code).toBe("DUPLICATE_DNI")
      }
    })
  })

  test("two persons without account may share email", async () => {
    const { runner } = runtime!
    await runner.run("COMMAND_STANDARD", "t5", async ({ tx }) => {
      await bootstrapActor(tx)
      const email = emailFor("shared")
      await tx.insertInto("app.people").values({
        id: randomUUID(), first_name: "S", last_name: "One", dni: dniFor("shared1"), email, created_at: new Date(), updated_at: new Date(),
      }).executeTakeFirstOrThrow()
      await tx.insertInto("app.people").values({
        id: randomUUID(), first_name: "S", last_name: "Two", dni: dniFor("shared2"), email, created_at: new Date(), updated_at: new Date(),
      }).executeTakeFirstOrThrow()
      const rows = await tx.selectFrom("app.people").selectAll().where("email", "=", email).execute()
      expect(rows.length).toBe(2)
    })
  })

  test("profile completion derived server-side", async () => {
    const { services, runner } = runtime!
    await runner.run("COMMAND_STANDARD", "t6", async ({ tx }) => {
      const actorId = await bootstrapActor(tx)
      const personId = await tx.insertInto("app.people").values({
        id: randomUUID(), first_name: "P", last_name: "Ro", dni: null, birth_date: null, phone: null, email: null,
        created_at: new Date(), updated_at: new Date(),
      }).returning("id").executeTakeFirstOrThrow().then((r) => r.id)
      const person = await tx.selectFrom("app.people").selectAll().where("id", "=", personId).executeTakeFirst()
      expect(services.people.profileCompleted(person)).toBe(false)
      await tx.updateTable("app.people").set({ dni: dniFor("prof"), birth_date: "1990-01-01", phone: "12345678", email: emailFor("prof") }).where("id", "=", personId).execute()
      const updated = await tx.selectFrom("app.people").selectAll().where("id", "=", personId).executeTakeFirst()
      expect(services.people.profileCompleted(updated)).toBe(true)
    })
  })
})
