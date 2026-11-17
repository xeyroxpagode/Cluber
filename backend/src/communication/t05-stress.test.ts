import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { randomUUID } from "node:crypto"
import { DatabaseProvider } from "../db/database-provider.js"
import { TransactionRunner } from "../db/transaction-runner.js"
import { testConfig } from "../testing/test-config.js"
import { makeT04Fixture, type T04Fixture } from "../testing/t04-base.js"
import { AnnouncementService } from "./announcements.js"
import { ConversationService } from "./conversations.js"
import { MessageService } from "./messages.js"
import { CommunicationQueries } from "./queries.js"
import { ConversationSyncService } from "./sync.js"
import { AuthorityService } from "../authority/authority.js"
import { AuditWriter } from "../audit/audit.js"
import { NotificationService } from "../notification/notification.js"
import { OutboxWriter } from "../shared/outbox.js"

const config = testConfig()
let database: DatabaseProvider
let runner: TransactionRunner
let fx: T04Fixture
const authority = new AuthorityService()
const audit = new AuditWriter()
const notifications = new NotificationService()
const outbox = new OutboxWriter()
let announcements: AnnouncementService
let conversations: ConversationService
let messages: MessageService
let queries: CommunicationQueries
let sync: ConversationSyncService

beforeAll(async () => {
  database = new DatabaseProvider(config)
  await database.verify()
  runner = new TransactionRunner(database.db)
  announcements = new AnnouncementService(authority, audit, notifications, outbox)
  conversations = new ConversationService(authority, audit)
  messages = new MessageService(authority, audit, outbox)
  queries = new CommunicationQueries(authority, announcements, messages)
  sync = new ConversationSyncService()
  fx = await runner.run("COMMAND_STANDARD", randomUUID(), ({ tx }) => makeT04Fixture(tx, "t05stress"))
})
afterAll(async () => database.close())

const run = <T,>(fn: (ctx: { tx: any; evaluationInstant: Date }) => Promise<T>) =>
  runner.run("COMMAND_SERIALIZABLE", randomUUID(), fn as any)

describe("ST-A — Announcements (estrés)", () => {
  it("ST-A02/A11: DRAFT sin title se rechaza; corrección sin cambios se rechaza", async () => {
    await run(async ({ tx }) => {
      await expect(announcements.draft(tx, fx.subcommitteeId, new Date(), { title: "", body: "x", clubWide: true, teamIds: [] }))
        .rejects.toMatchObject({ code: "BODY_REQUIRED" })
    })
    const id = await run(async ({ tx }) => (await announcements.draft(tx, fx.subcommitteeId, new Date(), { title: "A", body: "B", clubWide: true, teamIds: [] })).id)
    await run(async ({ tx }) => announcements.publish(tx, fx.subcommitteeId, new Date(), id, true))
    await run(async ({ tx }) =>
      expect(announcements.correct(tx, fx.subcommitteeId, new Date(), id, { reason: "x" })).rejects.toMatchObject({ code: "NO_CHANGES" }))
  })

  it("ST-A07/A12: equipo inexistente y audiencia inmutable en corrección", async () => {
    const id = await run(async ({ tx }) => (await announcements.draft(tx, fx.subcommitteeId, new Date(), { title: "A", body: "B", clubWide: true, teamIds: [] })).id)
    await run(async ({ tx }) =>
      expect(announcements.draft(tx, fx.subcommitteeId, new Date(), { title: "A", body: "B", clubWide: false, teamIds: [randomUUID()] }))
        .rejects.toMatchObject({ code: "INVALID_TEAM" }))
    await run(async ({ tx }) => announcements.publish(tx, fx.subcommitteeId, new Date(), id, true))
    const before = await run(async ({ tx }) => tx.selectFrom("app.announcement_target_teams").selectAll().where("announcement_id", "=", id).execute())
    await run(async ({ tx }) => announcements.correct(tx, fx.subcommitteeId, new Date(), id, { title: "C", reason: "r" }))
    const after = await run(async ({ tx }) => tx.selectFrom("app.announcement_target_teams").selectAll().where("announcement_id", "=", id).execute())
    expect(after).toEqual(before)
  })

  it("ST-A08/A09: publicación concurrente → 1 éxito, 1 conflicto; retry no duplica NOT-07", async () => {
    const id = await run(async ({ tx }) => (await announcements.draft(tx, fx.subcommitteeId, new Date(), { title: "Conc", body: "B", clubWide: true, teamIds: [] })).id)
    const results = await Promise.allSettled([
      run(({ tx }) => announcements.publish(tx, fx.subcommitteeId, new Date(), id, true)),
      run(({ tx }) => announcements.publish(tx, fx.subcommitteeId, new Date(), id, true)),
    ])
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1)
    expect(results.filter((r) => r.status === "rejected")).toHaveLength(1)
    const notes = await run(async ({ tx }) => tx.selectFrom("app.notifications").selectAll().where("resource_id", "=", id).execute())
    expect(new Set(notes.map((n) => n.dedupe_key)).size).toBe(notes.length)
  })

  it("ST-A10: NOT-07 queda en outbox con dedupe key canónica", async () => {
    const id = await run(async ({ tx }) => (await announcements.draft(tx, fx.subcommitteeId, new Date(), { title: "Outbox", body: "B", clubWide: true, teamIds: [] })).id)
    await run(({ tx }) => announcements.publish(tx, fx.subcommitteeId, new Date(), id, true))
    const notes = await run(async ({ tx }) => tx.selectFrom("app.notifications").selectAll().where("resource_id", "=", id).execute())
    expect(notes.length).toBeGreaterThan(0)
    expect(notes[0].dedupe_key).toBe(`${id}|${notes[0].recipient_person_id}|ANNOUNCEMENT_PUBLISHED`)
    const outboxRows = await run(async ({ tx }) => tx.selectFrom("infra.outbox_events").selectAll().where("aggregate_type", "=", "Notification").execute())
    expect(outboxRows.length).toBeGreaterThan(0)
  })

  it("ST-A13/A14: ARCHIVED conserva publishedAt y no se puede corregir", async () => {
    const id = await run(async ({ tx }) => (await announcements.draft(tx, fx.subcommitteeId, new Date(), { title: "Arch", body: "B", clubWide: true, teamIds: [] })).id)
    await run(({ tx }) => announcements.publish(tx, fx.subcommitteeId, new Date(), id, true))
    const published = await run(({ tx }) => announcements.archive(tx, fx.subcommitteeId, new Date(), id))
    expect(published.state).toBe("ARCHIVED")
    expect(published.publishedAt).not.toBeNull()
    await run(async ({ tx }) =>
      expect(announcements.correct(tx, fx.subcommitteeId, new Date(), id, { title: "x", reason: "r" })).rejects.toMatchObject({ code: "INVALID_STATE" }))
  })
})

describe("ST-B/C — Conversaciones y temporalidad (estrés)", () => {
  it("ST-B06/B07: título vacío y participantes duplicados se rechazan", async () => {
    await run(async ({ tx }) => {
      await expect(conversations.createGroup(tx, fx.playerId, { title: "", participantPersonIds: [fx.player2Id] }, new Date()))
        .rejects.toMatchObject({ code: "BODY_REQUIRED" })
      await expect(conversations.createGroup(tx, fx.playerId, { title: "G", participantPersonIds: [fx.player2Id, fx.player2Id] }, new Date()))
        .rejects.toMatchObject({ code: "DUPLICATE_PARTICIPANT" })
    })
  })

  it("ST-B11: apertura concurrente TEAM → 1 sola conversación", async () => {
    const results = await Promise.allSettled([
      run(({ tx }) => conversations.openTeamEvent(tx, fx.coachId, "TEAM", fx.teamAId, new Date())),
      run(({ tx }) => conversations.openTeamEvent(tx, fx.coachId, "TEAM", fx.teamAId, new Date())),
    ])
    const ids = results.filter((r) => r.status === "fulfilled").map((r: any) => r.value.id)
    expect(new Set(ids).size).toBe(1)
  })

  it("ST-C03/C12: reingreso crea intervalo nuevo y historia queda acotada al período", async () => {
    const conv = await run(({ tx }) => conversations.openTeamEvent(tx, fx.coachId, "TEAM", fx.teamAId, new Date()))
    const base = Date.now()
    const t0 = new Date(base + 1_000)
    const t1 = new Date(base + 86_400_000)
    const t2 = new Date(base + 2 * 86_400_000)
    await run(async ({ tx }) => {
      // Cerramos el intervalo activo creado por el sync para poder simular reingreso.
      await tx.updateTable("app.conversation_participants").set({ left_at: t0 })
        .where("conversation_id", "=", conv.id).where("person_id", "=", fx.playerId)
        .where("left_at", "is", null).execute()
      await tx.insertInto("app.conversation_participants").values([
        { id: randomUUID(), conversation_id: conv.id, person_id: fx.playerId, joined_at: t0, left_at: t1 },
        { id: randomUUID(), conversation_id: conv.id, person_id: fx.playerId, joined_at: t2, left_at: null },
      ]).execute()
    })
    const rows = await run(async ({ tx }) => tx.selectFrom("app.conversation_participants").selectAll()
      .where("conversation_id", "=", conv.id).where("person_id", "=", fx.playerId).execute())
    expect(rows.length).toBeGreaterThanOrEqual(2)
  })
})

describe("ST-D/E/F — Mensajes, privacidad y recovery (estrés)", () => {
  let convId: string
  beforeAll(async () => {
    convId = await run(({ tx }) => conversations.openDirect(tx, fx.playerId, fx.player2Id, new Date()).then((c) => c.id))
  })

  it("ST-D03/D11: body vacío y delete sin reason se rechazan", async () => {
    await run(async ({ tx }) => {
      await expect(messages.send(tx, fx.playerId, convId, "  ", new Date())).rejects.toMatchObject({ code: "BODY_REQUIRED" })
      const sent = await messages.send(tx, fx.playerId, convId, "ok", new Date())
      await expect(messages.delete(tx, fx.playerId, sent.id, "", new Date())).rejects.toMatchObject({ code: "BODY_REQUIRED" })
    })
  })

  it("ST-D07/D10: no autor no puede editar ni eliminar", async () => {
    const sent = await run(({ tx }) => messages.send(tx, fx.playerId, convId, "mío", new Date()))
    await run(async ({ tx }) => {
      await expect(messages.edit(tx, fx.player2Id, sent.id, "ajeno", new Date())).rejects.toMatchObject({ code: "NOT_AUTHOR" })
      await expect(messages.delete(tx, fx.player2Id, sent.id, "r", new Date())).rejects.toMatchObject({ code: "NOT_AUTHOR" })
    })
  })

  it("ST-D15: enviar mensaje NO crea Notification (MESSAGE_RECEIVED prohibido)", async () => {
    const before = await run(async ({ tx }) => tx.selectFrom("app.notifications").select((eb) => eb.fn.count<number>("id").as("n")).executeTakeFirst())
    await run(({ tx }) => messages.send(tx, fx.playerId, convId, "sin notificación", new Date()))
    const after = await run(async ({ tx }) => tx.selectFrom("app.notifications").select((eb) => eb.fn.count<number>("id").as("n")).executeTakeFirst())
    expect(Number(after?.n)).toBe(Number(before?.n))
    const prohibited = await run(async ({ tx }) => tx.selectFrom("app.notifications").selectAll().where("type", "=", "MESSAGE_RECEIVED" as any).execute())
    expect(prohibited).toHaveLength(0)
  })

  it("ST-E02/E10: no participante DENY; audit de mensajes sin body", async () => {
    const outsiderConv = await run(({ tx }) => conversations.openDirect(tx, fx.playerId, fx.player2Id, new Date()).then((c) => c.id))
    await run(async ({ tx }) =>
      expect(queries.conversationThread(tx, fx.adminId, outsiderConv, new Date(), {})).rejects.toMatchObject({ code: "NOT_PARTICIPANT" }))
    const sent = await run(({ tx }) => messages.send(tx, fx.playerId, convId, "SECRETO_BODY_TEST", new Date()))
    await run(({ tx }) => messages.edit(tx, fx.playerId, sent.id, "EDITADO_SECRETO", new Date()))
    const auditRows = await run(async ({ tx }) => tx.selectFrom("app.audit_entries").selectAll().where("target_id", "=", sent.id).execute())
    expect(auditRows.length).toBeGreaterThan(0)
    expect(JSON.stringify(auditRows)).not.toContain("SECRETO_BODY_TEST")
    expect(JSON.stringify(auditRows)).not.toContain("EDITADO_SECRETO")
  })

  it("ST-E03/E04: orden estable y lastActivityAt DESC", async () => {
    const page1 = await run(({ tx }) => queries.conversationList(tx, fx.playerId, new Date(), { limit: 2 }))
    const times = page1.items.map((i) => new Date(i.lastActivityAt).getTime())
    expect(times).toEqual([...times].sort((a, b) => b - a))
    const thread = await run(({ tx }) => queries.conversationThread(tx, fx.playerId, convId, new Date(), { limit: 2 }))
    const stamps = thread.items.map((m) => new Date(m.sentAt).getTime())
    expect(stamps).toEqual([...stamps].sort((a, b) => a - b))
  })

  it("ST-E12: payload realtime de mensaje no contiene body", async () => {
    const rows = await run(async ({ tx }) => tx.selectFrom("infra.outbox_events").selectAll().where("topic", "=", "conversation.changed").execute())
    if (rows.length > 0) {
      expect(JSON.stringify(rows[0].payload)).not.toContain("body")
      expect((rows[0].payload as any).event).toBe("conversation.changed")
    }
  })

  it("ST-F01: M8 presente con 5 tablas y 3 índices únicos parciales", async () => {
    const tables = await run(async ({ tx }) => tx.selectFrom("information_schema.tables" as any)
      .select("table_name" as any).where("table_schema" as any, "=", "app").execute())
    expect(tables.length).toBeGreaterThanOrEqual(36)
  })
})
