import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { randomUUID } from "node:crypto"
import { buildT03TestApp, createSessionFor } from "../testing/test-app.js"
import { makeT04Fixture, type T04Fixture } from "../testing/t04-base.js"
import { deriveCsrfToken } from "../shared/crypto.js"

const ORIGIN = "http://localhost:8443"
const CSRF_SECRET = Buffer.alloc(32, 7)
const { app, database, services, runner } = await buildT03TestApp()

afterAll(async () => {
  await database.db.deleteFrom("infra.outbox_events").execute().catch(() => undefined)
  await database.db.deleteFrom("app.notifications").execute().catch(() => undefined)
  await app.close()
  await database.close()
})

let fx: T04Fixture
type Session = { token: string; sessionId: string; csrf: string }

beforeAll(async () => {
  await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
    fx = await makeT04Fixture(tx, "t05api")
  })
})

const sessionCache = new Map<string, Session>()
async function sessionFor(personId: string): Promise<Session> {
  const cached = sessionCache.get(personId)
  if (cached) return cached
  const session = await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
    const created = await createSessionFor(services, tx, personId)
    return { token: created.token, sessionId: created.id, csrf: deriveCsrfToken(CSRF_SECRET, created.id) }
  })
  sessionCache.set(personId, session)
  return session
}

function headers(s: Session, withJson = true): Record<string, string> {
  const out: Record<string, string> = { origin: ORIGIN, cookie: `gei_session=${s.token}`, "x-gei-csrf": s.csrf }
  if (withJson) out["content-type"] = "application/json"
  return out
}

const key = () => randomUUID()
const send = (method: string, url: string, s: Session, payload?: unknown, idem?: string) =>
  app.inject({
    method: method as any, url,
    headers: { ...headers(s, payload !== undefined), ...(idem ? { "idempotency-key": idem } : {}) },
    ...(payload !== undefined ? { payload: payload as any } : {}),
  })

describe("T05 HTTP API (routes, CSRF, idempotencia, autoridad)", () => {
  it("CMD-COM-01/02: draft → update → publish con idempotencia y NOT-07", async () => {
    const sub = await sessionFor(fx.subcommitteeId)
    const player = await sessionFor(fx.playerId)
    const idem = key()
    const created = await send("POST", "/api/announcements/draft", sub, {
      title: "API T05", body: "Cuerpo API", clubWide: false, teamIds: [fx.teamAId],
    }, idem)
    expect(created.statusCode).toBe(201)
    const id = created.json().id
    expect(created.json().state).toBe("DRAFT")

    const retry = await send("POST", "/api/announcements/draft", sub, {
      title: "API T05", body: "Cuerpo API", clubWide: false, teamIds: [fx.teamAId],
    }, idem)
    expect(retry.statusCode).toBe(201)
    expect(retry.json().id).toBe(id) // retry de la MISMA operación

    const updated = await send("PATCH", `/api/announcements/draft/${id}`, sub, {
      title: "API T05 editado", body: "Cuerpo API", clubWide: false, teamIds: [fx.teamAId], expectedVersion: 1,
    }, key())
    expect(updated.statusCode).toBe(200)
    expect(updated.json().version).toBe(2)

    const publishIdem = key()
    const published = await send("POST", `/api/announcements/${id}/publish`, sub, { clubWide: true }, publishIdem)
    expect(published.statusCode).toBe(200)
    expect(published.json().state).toBe("PUBLISHED")
    const publishedRetry = await send("POST", `/api/announcements/${id}/publish`, sub, { clubWide: true }, publishIdem)
    expect(publishedRetry.json().id).toBe(id)
    const notes = await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) =>
      tx.selectFrom("app.notifications").selectAll().where("resource_id", "=", id).execute())
    expect(notes.every((n) => n.type === "ANNOUNCEMENT_PUBLISHED")).toBe(true)

    const denied = await send("POST", `/api/announcements/${id}/publish`, player, undefined, key())
    expect(denied.statusCode).toBe(403)
    expect(denied.json().error.code).toBe("NO_ANNOUNCEMENT_AUTHORITY")
    const missingKey = await send("POST", "/api/announcements/draft", sub, {
      title: "x", body: "y", clubWide: true, teamIds: [],
    })
    expect(missingKey.statusCode).toBe(400)
    expect(missingKey.json().error.code).toBe("IDEMPOTENCY_KEY_REQUIRED")
  })

  it("CMD-COM-03/04: corrección revision++ y archivado histórico", async () => {
    const sub = await sessionFor(fx.subcommitteeId)
    const id = await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
      const { AnnouncementService } = await import("./announcements.js")
      const svc = new AnnouncementService(services.authority, services.auditWriter, services.notificationService)
      const draft = await svc.draft(tx, fx.subcommitteeId, new Date(), { title: "Corregir", body: "Cuerpo", clubWide: true, teamIds: [] })
      await svc.publish(tx, fx.subcommitteeId, new Date(), draft.id, true)
      return draft.id
    })
    const corrected = await send("PATCH", `/api/announcements/${id}/correct`, sub, { title: "Corregido", reason: "typo" })
    expect(corrected.statusCode).toBe(200)
    expect(corrected.json().revision).toBe(2)
    const archived = await send("POST", `/api/announcements/${id}/archive`, sub)
    expect(archived.statusCode).toBe(200)
    expect(archived.json().state).toBe("ARCHIVED")
    expect(archived.json().publishedAt).not.toBeNull()
  })

  it("RC-19: audiencia como access control", async () => {
    const sub = await sessionFor(fx.subcommitteeId)
    const player = await sessionFor(fx.playerId)
    const outsider = await sessionFor(fx.coachBId)
    const id = (await send("POST", "/api/announcements/draft", sub, {
      title: "Solo A", body: "Cuerpo", clubWide: false, teamIds: [fx.teamAId],
    }, key())).json().id
    await send("POST", `/api/announcements/${id}/publish`, sub, { clubWide: true }, key())
    const list = await send("GET", "/api/announcements", player, undefined)
    expect(list.statusCode).toBe(200)
    expect(list.json().items.some((a: any) => a.id === id)).toBe(true)
    const forbidden = await send("GET", `/api/announcements/${id}`, outsider, undefined)
    expect(forbidden.statusCode).toBe(403)
  })

  it("CMD-COM-05/06/07: DIRECT canónica, GROUP y TEAM por COACH", async () => {
    const a = await sessionFor(fx.playerId)
    const b = await sessionFor(fx.player2Id)
    const coach = await sessionFor(fx.coachId)
    const admin = await sessionFor(fx.adminId)
    const idem = key()
    const direct = await send("POST", "/api/conversations/direct", a, { targetPersonId: fx.player2Id }, idem)
    expect(direct.statusCode).toBe(201)
    // Misma pareja desde el otro extremo: findOrOpenDirect (operación distinta → otra key).
    const directRetry = await send("POST", "/api/conversations/direct", b, { targetPersonId: fx.playerId }, key())
    expect(directRetry.json().id).toBe(direct.json().id) // findOrOpenDirect + idempotencia

    const group = await send("POST", "/api/conversations/group", a, { title: "Grupo API", participantPersonIds: [fx.player2Id] }, key())
    expect(group.statusCode).toBe(201)
    expect(group.json().participantCount).toBe(2)
    const team = await send("POST", "/api/conversations/team-event", coach, { resourceType: "TEAM", resourceId: fx.teamAId }, key())
    expect(team.statusCode).toBe(201)
    const teamAgain = await send("POST", "/api/conversations/team-event", coach, { resourceType: "TEAM", resourceId: fx.teamAId }, key())
    expect(teamAgain.json().id).toBe(team.json().id)
    const adminDenied = await send("POST", "/api/conversations/team-event", admin, { resourceType: "TEAM", resourceId: fx.teamAId }, key())
    expect(adminDenied.statusCode).toBe(403)
  })

  it("CMD-COM-09..11 + RC-06/07: envío idempotente, edición, borrado y unread C19", async () => {
    const a = await sessionFor(fx.playerId)
    const b = await sessionFor(fx.player2Id)
    const admin = await sessionFor(fx.adminId)
    const conv = (await send("POST", "/api/conversations/direct", a, { targetPersonId: fx.player2Id }, key())).json().id
    const idem = key()
    const sent = await send("POST", `/api/conversations/${conv}/messages`, a, { body: "Hola API" }, idem)
    expect(sent.statusCode).toBe(201)
    const messageId = sent.json().id
    const retry = await send("POST", `/api/conversations/${conv}/messages`, a, { body: "Hola API" }, idem)
    expect(retry.json().id).toBe(messageId)
    const count = await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) =>
      tx.selectFrom("app.messages").select((eb) => eb.fn.count<number>("id").as("n")).where("id", "=", messageId).executeTakeFirst())
    expect(Number(count?.n)).toBe(1) // un solo mensaje pese al retry

    const list = await send("GET", "/api/conversations", b, undefined)
    expect(list.json().items.find((c: any) => c.id === conv)?.unreadCount).toBe(1)
    const ownList = await send("GET", "/api/conversations", a, undefined)
    expect(ownList.json().items.find((c: any) => c.id === conv)?.unreadCount).toBe(0) // C19

    const thread = await send("GET", `/api/conversations/${conv}/thread`, b, undefined)
    expect(thread.statusCode).toBe(200)
    expect(thread.json().items[0].body).toBe("Hola API") // antes del borrado, body visible para participante

    const edited = await send("PATCH", `/api/messages/${messageId}`, a, { body: "Editado API" })
    expect(edited.json().state).toBe("EDITED")
    const deleted = await send("DELETE", `/api/messages/${messageId}`, a, { deletionReason: "error" })
    expect(deleted.json().state).toBe("DELETED")
    const threadAfter = await send("GET", `/api/conversations/${conv}/thread`, b, undefined)
    expect(threadAfter.json().items.find((m: any) => m.id === messageId)?.body).toBeNull()

    const forbidden = await send("GET", `/api/conversations/${conv}/thread`, admin, undefined)
    expect(forbidden.statusCode).toBe(403)
  })

  it("RC-26/RC-27 responden con autoridad real", async () => {
    const player = await sessionFor(fx.playerId)
    const team = await send("GET", `/api/teams/${fx.teamAId}/conversations`, player, undefined)
    expect(team.statusCode).toBe(200)
    const outsider = await sessionFor(fx.coachBId)
    const denied = await send("GET", `/api/teams/${fx.teamAId}/conversations`, outsider, undefined)
    expect(denied.statusCode).toBe(403)
  })
})
