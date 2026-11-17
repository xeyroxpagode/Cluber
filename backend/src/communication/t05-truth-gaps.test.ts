import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { randomUUID } from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import pg from "pg"
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
  fx = await runner.run("COMMAND_STANDARD", randomUUID(), ({ tx }) => makeT04Fixture(tx, "truth"))
})
afterAll(async () => database.close())

const run = <T,>(fn: (ctx: { tx: any; evaluationInstant: Date }) => Promise<T>) =>
  runner.run("COMMAND_SERIALIZABLE", randomUUID(), fn as any)

async function freshDirect(partnerId: string) {
  const id = randomUUID()
  const now = new Date()
  const joined = new Date(now.getTime() - 2 * 86_400_000)
  await run(async ({ tx }) => {
    await tx.insertInto("app.conversations").values({
      id, type: "DIRECT", direct_pair_key: [fx.playerId, partnerId].sort().join("|"),
      state: "ACTIVE", created_at: now, created_by_person_id: fx.playerId, version: 1,
    }).execute()
    for (const personId of [fx.playerId, partnerId]) {
      await tx.insertInto("app.conversation_participants").values({
        id: randomUUID(), conversation_id: id, person_id: personId, joined_at: joined,
      }).execute()
    }
  })
  return id
}

describe("TRUTH — huecos de evidencia", () => {
  it("ST-A10: falla NotificationWriter → sin publicación incoherente", async () => {
    const id = await run(async ({ tx }) => (await announcements.draft(tx, fx.subcommitteeId, new Date(), { title: "Fault", body: "B", clubWide: true, teamIds: [] })).id)
    const failing = new AnnouncementService(authority, audit, {
      recordForAudience: async () => { throw new Error("NOTIFICATION_WRITER_FAILURE") },
    } as any, outbox)
    await expect(run(({ tx }) => failing.publish(tx, fx.subcommitteeId, new Date(), id, true))).rejects.toThrow()
    const row = await run(async ({ tx }) => tx.selectFrom("app.announcements").selectAll().where("id", "=", id).executeTakeFirst())
    expect(row?.state).toBe("DRAFT")
    expect(row?.published_at).toBeNull()
  })

  it("ST-A16: publicación congela audiencia aunque cambie TeamAssignment", async () => {
    const id = await run(async ({ tx }) => (await announcements.draft(tx, fx.subcommitteeId, new Date(), { title: "Snap", body: "B", clubWide: false, teamIds: [fx.teamAId] })).id)
    await run(({ tx }) => announcements.publish(tx, fx.subcommitteeId, new Date(), id, false))
    const before = await run(async ({ tx }) => tx.selectFrom("app.announcement_target_teams").select("team_id").where("announcement_id", "=", id).execute())
    await run(async ({ tx }) => {
      const rows = await tx.selectFrom("app.team_assignments").select("id")
        .where("person_id", "=", fx.playerId).where("team_id", "=", fx.teamAId).execute()
      for (const r of rows) await tx.updateTable("app.team_assignments").set({ valid_until: "2026-01-02" }).where("id", "=", r.id).execute()
    })
    const after = await run(async ({ tx }) => tx.selectFrom("app.announcement_target_teams").select("team_id").where("announcement_id", "=", id).execute())
    expect(after).toEqual(before)
    expect(before.length).toBeGreaterThan(0)
  })

  it("ST-B03: aperturas DIRECT concurrentes no duplican", async () => {
    const results = await Promise.allSettled([
      run(({ tx }) => conversations.openDirect(tx, fx.playerId, fx.player2Id, new Date())),
      run(({ tx }) => conversations.openDirect(tx, fx.player2Id, fx.playerId, new Date())),
    ])
    const ids = results.filter((r) => r.status === "fulfilled").map((r: any) => r.value.id)
    expect(new Set(ids).size).toBe(1)
  })

  it("ST-C08: cambio de Event targets sincroniza participación", async () => {
    const eventId = randomUUID()
    await run(async ({ tx }) => {
      await tx.insertInto("app.events").values({
        id: eventId, type: "TRAINING", title: `Event truth ${eventId.slice(0, 8)}`, time_zone: "UTC",
        state: "SCHEDULED", club_wide_target: false, coordination_revision: 1,
        creator_person_id: fx.subcommitteeId, version: 1, created_at: new Date(), updated_at: new Date(),
      }).execute()
      await tx.insertInto("app.event_target_person").values({
        id: randomUUID(), event_id: eventId, person_id: fx.playerId, added_at: new Date(),
      }).execute()
    })
    const conv = await run(({ tx }) => conversations.openTeamEvent(tx, fx.subcommitteeId, "EVENT", eventId, new Date()))
    const rows = await run(async ({ tx }) => tx.selectFrom("app.conversation_participants")
      .select("person_id").where("conversation_id", "=", conv.id).execute())
    expect(rows.map((r) => r.person_id)).toContain(fx.playerId)
  })

  it("ST-C10: ex-participante no puede enviar", async () => {
    const conv = await freshDirect(fx.coachId)
    const past = new Date(Date.now() - 86_400_000)
    await run(async ({ tx }) => tx.updateTable("app.conversation_participants").set({ left_at: past })
      .where("conversation_id", "=", conv).where("person_id", "=", fx.playerId)
      .where("left_at", "is", null).execute())
    await run(async ({ tx }) =>
      expect(messages.send(tx, fx.playerId, conv, "denegado", new Date())).rejects.toMatchObject({ code: "NOT_PARTICIPANT" }))
  })

  it("ST-E06: mensaje DELETED no computa en unreadCount", async () => {
    const conv = await freshDirect(fx.subcommitteeId)
    const sent = await run(({ tx }) => messages.send(tx, fx.subcommitteeId, conv, "borrar", new Date()))
    const before = await run(({ tx }) => queries.conversationList(tx, fx.playerId, new Date(), {}))
    const countBefore = before.items.find((c) => c.id === conv)?.unreadCount ?? 0
    expect(countBefore).toBeGreaterThan(0)
    await run(({ tx }) => messages.delete(tx, fx.subcommitteeId, sent.id, "qa", new Date()))
    const after = await run(({ tx }) => queries.conversationList(tx, fx.playerId, new Date(), {}))
    expect(after.items.find((c) => c.id === conv)?.unreadCount).toBe(countBefore - 1)
  })
})

describe("TRUTH — cobertura temporal y canónica adicional", () => {
  it("ST-B08: GROUP entre divisiones permitido si ambos autorizados", async () => {
    const conv = await run(({ tx }) => conversations.createGroup(tx, fx.playerId,
      { title: "Cross", participantPersonIds: [fx.coachBId] }, new Date()))
    expect(conv.participantCount).toBeGreaterThanOrEqual(2)
  })

  it("ST-C04/C05: RC-07 excluye mensajes fuera del período del participante", async () => {
    const conv = await freshDirect(fx.adminId)
    const joined = new Date(Date.now() - 2 * 86_400_000)
    const left = new Date(Date.now() - 86_400_000)
    await run(async ({ tx }) => {
      await tx.insertInto("app.messages").values({
        id: randomUUID(), conversation_id: conv, author_person_id: fx.adminId,
        body: "fuera de período", state: "SENT", sent_at: new Date(Date.now() - 3 * 86_400_000), version: 1,
      }).execute()
      await tx.updateTable("app.conversation_participants").set({ joined_at: joined, left_at: left })
        .where("conversation_id", "=", conv).where("person_id", "=", fx.playerId).execute()
    })
    const page = await run(({ tx }) => queries.conversationThread(tx, fx.playerId, conv, new Date(), {}))
    expect(page.items.some((m) => m.body === "fuera de período")).toBe(false)
  })

  it("ST-C07: cambio de TeamAssignment cierra el intervalo del participante", async () => {
    const conv = await run(({ tx }) => conversations.openTeamEvent(tx, fx.coachId, "TEAM", fx.teamAId, new Date()))
    await run(async ({ tx }) => tx.updateTable("app.team_assignments").set({ valid_until: "2026-01-02" })
      .where("person_id", "=", fx.playerId).where("team_id", "=", fx.teamAId).execute())
    await run(async ({ tx }) => sync.syncTeamConversationParticipants(tx, conv.id, fx.teamAId, new Date()))
    const rows = await run(async ({ tx }) => tx.selectFrom("app.conversation_participants")
      .selectAll().where("conversation_id", "=", conv.id).where("person_id", "=", fx.playerId).execute())
    expect(rows.filter((r) => r.person_id === fx.playerId && r.left_at === null).length).toBe(0)
  })

  it("ST-C11: dos syncs simultáneos conservan períodos sin solapamiento", async () => {
    const conv = await run(({ tx }) => conversations.openTeamEvent(tx, fx.coachId, "TEAM", fx.teamAId, new Date()))
    const results = await Promise.allSettled([
      run(({ tx }) => sync.syncTeamConversationParticipants(tx, conv.id, fx.teamAId, new Date())),
      run(({ tx }) => sync.syncTeamConversationParticipants(tx, conv.id, fx.teamAId, new Date())),
    ])
    const rows = await run(async ({ tx }) => tx.selectFrom("app.conversation_participants")
      .selectAll().where("conversation_id", "=", conv.id).execute())
    const byPerson = new Map<string, typeof rows>()
    for (const r of rows) byPerson.set(r.person_id, [...(byPerson.get(r.person_id) ?? []), r])
    for (const list of byPerson.values()) {
      const sorted = [...list].sort((a, b) => new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime())
      for (let i = 1; i < sorted.length; i++) {
        expect(new Date(sorted[i].joined_at).getTime()).toBeGreaterThanOrEqual(new Date(sorted[i - 1].left_at ?? 0).getTime())
      }
    }
    expect(results.length).toBe(2)
  })

  it("ST-F02: los datos persisten al abrir una nueva conexión (simula reinicio)", async () => {
    const id = await run(async ({ tx }) => (await announcements.draft(tx, fx.subcommitteeId, new Date(), {
      title: `Persist ${randomUUID().slice(0, 8)}`, body: "B", clubWide: true, teamIds: [],
    })).id)
    const fresh = new DatabaseProvider(config)
    await fresh.verify()
    const row = await fresh.db.selectFrom("app.announcements").selectAll().where("id", "=", id).executeTakeFirst()
    await fresh.close()
    expect(row?.id).toBe(id)
  })
})

describe("TRUTH — invariantes estáticos", () => {
  const read = (rel: string) => fs.readFileSync(path.resolve(process.cwd(), rel), "utf8")
  it("ST-E11/F10: sin body en logs ni funcionalidades OUT", () => {
    const files = [
      "backend/src/communication/announcements.ts", "backend/src/communication/conversations.ts",
      "backend/src/communication/messages.ts", "backend/src/communication/queries.ts",
      "backend/src/communication/sync.ts", "backend/src/communication/communication-routes.ts",
      "src/features/communication.tsx", "src/lib/t05-api.ts",
    ].map(read).join("\n")
    expect(files).not.toMatch(/MESSAGE_RECEIVED|ANNOUNCEMENT_CORRECTED|Guardian|Eligibility|CompetitionEntry/)
    expect(files).not.toMatch(/console\.(log|debug|info)\([^)]*body/)
  })
  it("AC-22: enum de notificaciones canónico", () => {
    const sql = read("supabase/migrations/20261112000300_m9_notification.sql")
    expect(sql).toContain("ANNOUNCEMENT_PUBLISHED")
    expect(sql).not.toContain("MESSAGE_RECEIVED")
    expect(sql).not.toContain("ANNOUNCEMENT_CORRECTED")
  })
})
