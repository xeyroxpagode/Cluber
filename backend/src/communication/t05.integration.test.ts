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
import { touchConversationReadCursor } from "./read-cursor.js"
import { AuthorityService } from "../authority/authority.js"
import { AuditWriter } from "../audit/audit.js"
import { NotificationService } from "../notification/notification.js"
import { OutboxWriter } from "../shared/outbox.js"

const config = testConfig()
const T0 = new Date()
const later = (ms: number) => new Date(T0.getTime() + ms)
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
  fx = await runner.run("COMMAND_STANDARD", randomUUID(), ({ tx }) => makeT04Fixture(tx, "t05"))
})

afterAll(async () => database.close())

async function expectDenied(promise: Promise<unknown>, code: string): Promise<void> {
  await expect(promise).rejects.toMatchObject({ code })
}

// ───────────────────────────── DG-13 ─────────────────────────────
describe("DG-13 Announcements (CMD-COM-01..04, RC-19, NOT-07)", () => {
  it("CC-T05-C10: crea y actualiza DRAFT con version++ y Audiencia válida", async () => {
    const created = await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) =>
      announcements.draft(tx, fx.subcommitteeId, later(0), {
        title: "Comunicado T05", body: "Cuerpo del comunicado", clubWide: false, teamIds: [fx.teamAId],
      }))
    expect(created.state).toBe("DRAFT")
    expect(created.version).toBe(1)
    expect(created.audienceSnapshot).toEqual([fx.teamAId])

    const updated = await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) =>
      announcements.draft(tx, fx.subcommitteeId, later(10 * 60_000), {
        announcementId: created.id, expectedVersion: 1, title: "Comunicado T05 editado",
        body: "Cuerpo actualizado", clubWide: true, teamIds: [],
      }))
    expect(updated.title).toBe("Comunicado T05 editado")
    expect(updated.version).toBe(2)
    expect(updated.clubWide).toBe(true)

    await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) =>
      expectDenied(announcements.draft(tx, fx.subcommitteeId, new Date(), {
        announcementId: created.id, expectedVersion: 1, title: "x", body: "y", clubWide: true, teamIds: [],
      }), "CONCURRENCY_CONFLICT"))
  })

  it("rechaza audiencia inválida y actores sin autoridad (PLAYER/ADMIN)", async () => {
    await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) =>
      expectDenied(announcements.draft(tx, fx.playerId, new Date(), {
        title: "x", body: "y", clubWide: true, teamIds: [],
      }), "NO_ANNOUNCEMENT_AUTHORITY"))
    await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) =>
      expectDenied(announcements.draft(tx, fx.adminId, new Date(), {
        title: "x", body: "y", clubWide: true, teamIds: [],
      }), "NO_ANNOUNCEMENT_AUTHORITY"))
    // T05-QA-001 / C11: el DRAFT se guarda sin audiencia; C12 la exige solo al publicar.
    const pending = await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) =>
      announcements.draft(tx, fx.subcommitteeId, new Date(), {
        title: "x", body: "y", clubWide: false, teamIds: [],
      }))
    expect(pending.state).toBe("DRAFT")
    await runner.run("COMMAND_SERIALIZABLE", randomUUID(), async ({ tx }) =>
      expectDenied(announcements.publish(tx, fx.subcommitteeId, new Date(), pending.id, false), "AUDIENCE_REQUIRED"))
  })

  it("publica con NOT-07 deduplicada, corrige con revision++ y archiva preservando metadatos", async () => {
    const id = await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
      const draft = await announcements.draft(tx, fx.subcommitteeId, later(0), {
        title: "Publicación T05", body: "Contenido", clubWide: false, teamIds: [fx.teamAId],
      })
      return draft.id
    })
    const published = await runner.run("COMMAND_SERIALIZABLE", randomUUID(), async ({ tx }) =>
      announcements.publish(tx, fx.subcommitteeId, later(60 * 60_000), id, true))
    expect(published.state).toBe("PUBLISHED")
    expect(published.publishedAt).toBe(later(60 * 60_000).toISOString())

    const notes = await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) =>
      tx.selectFrom("app.notifications").selectAll().where("resource_id", "=", id).execute())
    expect(notes.length).toBeGreaterThan(0)
    expect(new Set(notes.map((n) => n.dedupe_key)).size).toBe(notes.length)
    expect(notes.every((n) => n.type === "ANNOUNCEMENT_PUBLISHED")).toBe(true)

    const outboxRows = await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) =>
      tx.selectFrom("infra.outbox_events").selectAll().where("aggregate_type", "=", "Notification").execute())
    expect(outboxRows.length).toBeGreaterThan(0)

    const corrected = await runner.run("COMMAND_SERIALIZABLE", randomUUID(), async ({ tx }) =>
      announcements.correct(tx, fx.subcommitteeId, later(2 * 60 * 60_000), id, {
        title: "Publicación T05 corregida", reason: "Error de tipeo",
      }))
    expect(corrected.revision).toBe(2)
    expect(corrected.audienceSnapshot).toEqual([fx.teamAId])
    const notesAfter = await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) =>
      tx.selectFrom("app.notifications").selectAll().where("resource_id", "=", id).execute())
    expect(notesAfter.length).toBe(notes.length) // sin ANNOUNCEMENT_CORRECTED

    const archived = await runner.run("COMMAND_SERIALIZABLE", randomUUID(), async ({ tx }) =>
      announcements.archive(tx, fx.subcommitteeId, later(3 * 60 * 60_000), id))
    expect(archived.state).toBe("ARCHIVED")
    expect(archived.publishedAt).toBe(published.publishedAt)
    expect(archived.audienceSnapshot).toEqual([fx.teamAId])
    await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) =>
      expectDenied(announcements.correct(tx, fx.subcommitteeId, new Date(), id, { title: "x", reason: "y" }), "INVALID_STATE"))
  })

  it("RC-19: solo audiencia ve el comunicado; URL ajena → DENY (COM-015)", async () => {
    const id = await runner.run("COMMAND_SERIALIZABLE", randomUUID(), async ({ tx }) => {
      const d = await announcements.draft(tx, fx.subcommitteeId, new Date(), {
        title: "Solo equipo A", body: "Privado", clubWide: false, teamIds: [fx.teamAId],
      })
      await announcements.publish(tx, fx.subcommitteeId, new Date(), d.id, true)
      return d.id
    })
    await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) => {
      const list = await queries.announcementList(tx, fx.playerId, new Date(), {})
      expect(list.items.some((a) => a.id === id)).toBe(true)
      await expect(queries.announcementDetail(tx, fx.playerId, id, new Date())).resolves.toMatchObject({ id })
      await expectDenied(queries.announcementDetail(tx, fx.coachBId, id, new Date()), "NO_ANNOUNCEMENT_AUTHORITY")
    })
  })
})

// ───────────────────────────── DG-14 ─────────────────────────────
describe("DG-14 Conversations & Messaging", () => {
  let directId: string
  let groupId: string
  let teamConvId: string

  it("CMD-COM-05 DIRECT canónica por pareja no ordenada", async () => {
    directId = await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) =>
      (await conversations.openDirect(tx, fx.playerId, fx.player2Id, new Date())).id)
    const same = await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) =>
      (await conversations.openDirect(tx, fx.player2Id, fx.playerId, new Date())).id)
    expect(same).toBe(directId)
    await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) =>
      expectDenied(conversations.openDirect(tx, fx.playerId, fx.playerId, new Date()), "VALIDATION"))
  })

  it("CMD-COM-06 GROUP ≥2 con creador auto-incluido y CMD-COM-08 archiva", async () => {
    groupId = await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) =>
      (await conversations.createGroup(tx, fx.playerId, { title: "Grupo T05", participantPersonIds: [fx.player2Id] }, new Date())).id)
    const count = await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) =>
      tx.selectFrom("app.conversation_participants").selectAll().where("conversation_id", "=", groupId).execute())
    expect(count.length).toBe(2)
    await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) =>
      expectDenied(conversations.createGroup(tx, fx.playerId, { title: "", participantPersonIds: [fx.player2Id] }, new Date()), "BODY_REQUIRED"))
    const archived = await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) =>
      conversations.archiveGroup(tx, fx.playerId, groupId, new Date()))
    expect(archived.state).toBe("ARCHIVED")
    await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) =>
      expectDenied(conversations.archiveGroup(tx, fx.playerId, directId, new Date()), "NOT_GROUP"))
  })

  it("CMD-COM-07 TEAM canónica + sync atómico; SUBCOMMITTEE/ADMIN sin acceso universal", async () => {
    teamConvId = await runner.run("COMMAND_SERIALIZABLE", randomUUID(), async ({ tx }) =>
      (await conversations.openTeamEvent(tx, fx.coachId, "TEAM", fx.teamAId, new Date())).id)
    const again = await runner.run("COMMAND_SERIALIZABLE", randomUUID(), async ({ tx }) =>
      (await conversations.openTeamEvent(tx, fx.coachId, "TEAM", fx.teamAId, new Date())).id)
    expect(again).toBe(teamConvId)
    const participants = await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) =>
      tx.selectFrom("app.conversation_participants").select("person_id").where("conversation_id", "=", teamConvId).execute())
    expect(participants.map((p) => p.person_id)).toContain(fx.playerId)

    // ADMIN/SUBCOMMITTEE no tienen acceso universal: se deniega la conversación TEAM ajena.
    await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) =>
      expectDenied(queries.conversationThread(tx, fx.subcommitteeId, teamConvId, new Date(), {}), "NO_TEAM_CONVERSATION_AUTHORITY"))
    await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) =>
      expectDenied(queries.conversationThread(tx, fx.adminId, teamConvId, new Date(), {}), "NO_TEAM_CONVERSATION_AUTHORITY"))
  })

  it("CMD-COM-09 no crea Audit ni Notification; CMD-COM-10/11 Audit con body redactado", async () => {
    const beforeAudit = await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) =>
      tx.selectFrom("app.audit_entries").select((eb) => eb.fn.count<number>("id").as("n")).executeTakeFirst())
    const beforeNotes = await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) =>
      tx.selectFrom("app.notifications").select((eb) => eb.fn.count<number>("id").as("n")).executeTakeFirst())
    const sent = await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) =>
      messages.send(tx, fx.playerId, directId, "Hola T05", later(4 * 60 * 60_000)))
    expect(sent.state).toBe("SENT")
    expect(sent.body).toBe("Hola T05")
    const afterAudit = await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) =>
      tx.selectFrom("app.audit_entries").select((eb) => eb.fn.count<number>("id").as("n")).executeTakeFirst())
    const afterNotes = await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) =>
      tx.selectFrom("app.notifications").select((eb) => eb.fn.count<number>("id").as("n")).executeTakeFirst())
    expect(Number(afterAudit?.n)).toBe(Number(beforeAudit?.n)) // Audit NO
    expect(Number(afterNotes?.n)).toBe(Number(beforeNotes?.n)) // Notification NO

    const edited = await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) =>
      messages.edit(tx, fx.playerId, sent.id, "Editado T05", later(4 * 60 * 60_000 + 5 * 60_000)))
    expect(edited.state).toBe("EDITED")
    const deleted = await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) =>
      messages.delete(tx, fx.playerId, sent.id, "corrección", later(4 * 60 * 60_000 + 6 * 60_000)))
    expect(deleted.state).toBe("DELETED")
    expect(deleted.body).toBeNull()
    const row = await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) =>
      tx.selectFrom("app.messages").selectAll().where("id", "=", sent.id).executeTakeFirst())
    expect(row?.edited_at).not.toBeNull() // EDITED → DELETED preserva historia (C09)
    const auditRows = await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) =>
      tx.selectFrom("app.audit_entries").selectAll().where("target_id", "=", sent.id).execute())
    expect(auditRows.length).toBe(2)
    expect(JSON.stringify(auditRows)).not.toContain("Hola T05")
    expect(JSON.stringify(auditRows)).not.toContain("Editado T05")
  })

  it("CC-T05-C19: unreadCount excluye propios y el cursor solo avanza con lectura", async () => {
    const instant = later(5 * 60 * 60_000)
    await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
      await messages.send(tx, fx.playerId, directId, "mensaje propio", later(5 * 60 * 60_000 + 60_000))
      await messages.send(tx, fx.player2Id, directId, "mensaje ajeno", later(5 * 60 * 60_000 + 2 * 60_000))
    })
    const before = await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) =>
      queries.conversationList(tx, fx.playerId, instant, {}))
    expect(before.items.find((c) => c.id === directId)?.unreadCount).toBe(1)

    // El cursor solo avanza tras una vista autorizada del thread (posterior a los mensajes).
    await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) =>
      queries.conversationThread(tx, fx.playerId, directId, later(5 * 60 * 60_000 + 10 * 60_000), {}))
    await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) =>
      touchConversationReadCursor(tx, directId, fx.playerId, later(5 * 60 * 60_000 + 10 * 60_000), authority))
    const after = await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) =>
      queries.conversationList(tx, fx.playerId, later(5 * 60 * 60_000 + 20 * 60_000), {}))
    expect(after.items.find((c) => c.id === directId)?.unreadCount).toBe(0)
  })

  it("RC-07 paginación estable y tombstone sin body", async () => {
    const page = await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) =>
      queries.conversationThread(tx, fx.playerId, directId, later(6 * 60 * 60_000), { limit: 2 }))
    expect(page.items.length).toBeLessThanOrEqual(2)
    expect(page.items.every((m) => m.state !== "DELETED" || m.body === null)).toBe(true)
    if (page.nextCursor) {
      const next = await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) =>
        queries.conversationThread(tx, fx.playerId, directId, later(6 * 60 * 60_000), { limit: 2, cursor: page.nextCursor! }))
      expect(next.items.every((m) => !page.items.some((p) => p.id === m.id))).toBe(true)
    }
  })

  it("revocación temporal: Alice pierde acceso en el siguiente request", async () => {
    await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
      const past = later(-30 * 24 * 60 * 60_000)
      const rows = await tx.selectFrom("app.team_assignments").select("id")
        .where("person_id", "=", fx.playerId).where("team_id", "=", fx.teamAId).execute()
      for (const r of rows) await tx.updateTable("app.team_assignments").set({ valid_until: past.toISOString().slice(0, 10) }).where("id", "=", r.id).execute()
      const roles = await tx.selectFrom("app.role_assignments").select("id")
        .where("person_id", "=", fx.playerId).where("scope_ref_id", "=", fx.teamAId).execute()
      for (const r of roles) await tx.updateTable("app.role_assignments").set({ valid_until: past }).where("id", "=", r.id).execute()
      await sync.syncTeamConversationParticipants(tx, teamConvId, fx.teamAId, later(7 * 60 * 60_000))
    })
    await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) =>
      expectDenied(queries.conversationThread(tx, fx.playerId, teamConvId, later(7 * 60 * 60_000), {}), "NO_TEAM_CONVERSATION_AUTHORITY"))
  })
})
