import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { Type } from "@sinclair/typebox"
import type { ProductServices } from "../product-services.js"
import { AppError } from "../shared/errors.js"
import { OutboxWriter } from "../shared/outbox.js"
import { AnnouncementService } from "./announcements.js"
import { ConversationService } from "./conversations.js"
import { MessageService } from "./messages.js"
import { CommunicationQueries } from "./queries.js"
import { touchConversationReadCursor } from "./read-cursor.js"
import { assertConversationAccess } from "./sync.js"

const Silent = Type.Any()
const Uuid = Type.String({ format: "uuid" })

type Input = { app: FastifyInstance; registry: any; services: ProductServices }

function idempotencyKey(request: FastifyRequest): string {
  const key = String(request.headers["idempotency-key"] ?? "")
  if (!key || key.length > 128 || !/^[\x20-\x7E]+$/.test(key)) {
    throw new AppError("IDEMPOTENCY_KEY_REQUIRED", "Se requiere Idempotency-Key", "transport")
  }
  return key
}

/** DG-13 + DG-14 — 16 endpoints sobre RouteRegistry, sin sistemas paralelos. */
export function addCommunicationRoutes({ registry, services }: Input): void {
  const outboxWriter = new OutboxWriter()
  const announcements = new AnnouncementService(services.authority, services.auditWriter, services.notificationService, outboxWriter)
  const conversations = new ConversationService(services.authority, services.auditWriter)
  const messages = new MessageService(services.authority, services.auditWriter, outboxWriter)
  const queries = new CommunicationQueries(services.authority, announcements, messages)

  // ── CMD-COM-01 CREATE / UPDATE DRAFT (CC-T05-C10) ──
  const draftBody = Type.Object({
    announcementId: Type.Optional(Uuid),
    expectedVersion: Type.Optional(Type.Integer({ minimum: 1 })),
    title: Type.String({ minLength: 1, maxLength: 300 }),
    body: Type.String({ minLength: 1, maxLength: 20_000 }),
    clubWide: Type.Boolean(),
    teamIds: Type.Array(Uuid),
  })
  const draftHandler = async (request: FastifyRequest, reply: FastifyReply, forcedId?: string) => {
    const principal = await services.principals.require(request, new Date())
    const b = request.body as any
    const input = {
      announcementId: forcedId ?? b.announcementId,
      expectedVersion: b.expectedVersion,
      title: b.title, body: b.body, clubWide: b.clubWide, teamIds: b.teamIds ?? [],
    }
    const key = idempotencyKey(request)
    let status = 201
    let response: any = null
    await services.deps.runner.run("COMMAND_SERIALIZABLE", principal.sessionId, async ({ tx, evaluationInstant }) => {
      await services.principals.requireInTx(tx, request, evaluationInstant)
      const acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
        scopeKey: forcedId ? "CMD-COM-01:UPDATE" : "CMD-COM-01:CREATE",
        commandId: "CMD-COM-01", key, input,
      }, evaluationInstant)
      if (!acquired.acquired) { status = acquired.status; response = acquired.snapshot; return }
      status = forcedId || b.announcementId ? 200 : 201
      response = await announcements.draft(tx, principal.personId, evaluationInstant, input)
      await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, status, response, { type: "Announcement", id: response.id })
    }, true)
    return reply.status(status).send(response)
  }
  registry.add({
    method: "POST", url: "/api/announcements/draft",
    security: { operationId: "CMD-COM-01", kind: "command", auth: "required", csrf: "required", idempotency: "required", cache: "no-store" },
    schema: { body: draftBody, response: { 200: Silent, 201: Silent, 400: Silent, 403: Silent, 409: Silent, 500: Silent } },
    handler: (request: FastifyRequest, reply: FastifyReply) => draftHandler(request, reply),
  })
  registry.add({
    method: "PATCH", url: "/api/announcements/draft/:announcementId",
    security: { operationId: "CMD-COM-01:UPDATE", kind: "command", auth: "required", csrf: "required", idempotency: "required", cache: "no-store" },
    schema: { params: Type.Object({ announcementId: Uuid }), body: draftBody, response: { 200: Silent, 400: Silent, 403: Silent, 409: Silent, 500: Silent } },
    handler: (request: FastifyRequest, reply: FastifyReply) => draftHandler(request, reply, String((request.params as any).announcementId)),
  })

  // ── CMD-COM-02 PUBLISH ──
  registry.add({
    method: "POST", url: "/api/announcements/:announcementId/publish",
    security: { operationId: "CMD-COM-02", kind: "command", auth: "required", csrf: "required", idempotency: "required", cache: "no-store" },
    schema: { params: Type.Object({ announcementId: Uuid }), response: { 200: Silent, 400: Silent, 403: Silent, 409: Silent, 500: Silent } },
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const principal = await services.principals.require(request, new Date())
      const id = String((request.params as any).announcementId)
      const key = idempotencyKey(request)
      let status = 200
      let response: any = null
      await services.deps.runner.run("COMMAND_SERIALIZABLE", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        const acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
          scopeKey: `CMD-COM-02:${id}`, commandId: "CMD-COM-02", key, input: { id },
        }, evaluationInstant)
        if (!acquired.acquired) { status = acquired.status; response = acquired.snapshot; return }
        response = await announcements.publish(tx, principal.personId, evaluationInstant, id)
        await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, status, response, { type: "Announcement", id })
      }, true)
      return reply.status(status).send(response)
    },
  })

  // ── CMD-COM-03 CORRECT ──
  registry.add({
    method: "PATCH", url: "/api/announcements/:announcementId/correct",
    security: { operationId: "CMD-COM-03", kind: "command", auth: "required", csrf: "required", idempotency: "none", cache: "no-store" },
    schema: {
      params: Type.Object({ announcementId: Uuid }),
      body: Type.Object({ title: Type.Optional(Type.String({ minLength: 1, maxLength: 300 })), body: Type.Optional(Type.String({ minLength: 1, maxLength: 20_000 })), reason: Type.String({ minLength: 1, maxLength: 1000 }), expectedVersion: Type.Optional(Type.Integer({ minimum: 1 })) }),
      response: { 200: Silent, 400: Silent, 403: Silent, 409: Silent, 500: Silent },
    },
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const principal = await services.principals.require(request, new Date())
      const b = request.body as any
      const response = await services.deps.runner.run("COMMAND_SERIALIZABLE", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        return announcements.correct(tx, principal.personId, evaluationInstant, String((request.params as any).announcementId), b)
      })
      return reply.status(200).send(response)
    },
  })

  // ── CMD-COM-04 ARCHIVE ──
  registry.add({
    method: "POST", url: "/api/announcements/:announcementId/archive",
    security: { operationId: "CMD-COM-04", kind: "command", auth: "required", csrf: "required", idempotency: "none", cache: "no-store" },
    schema: { params: Type.Object({ announcementId: Uuid }), response: { 200: Silent, 400: Silent, 403: Silent, 500: Silent } },
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const principal = await services.principals.require(request, new Date())
      const response = await services.deps.runner.run("COMMAND_SERIALIZABLE", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        return announcements.archive(tx, principal.personId, evaluationInstant, String((request.params as any).announcementId))
      })
      return reply.status(200).send(response)
    },
  })

  // ── RC-19 ANNOUNCEMENT LIST / DETAIL ──
  registry.add({
    method: "GET", url: "/api/announcements",
    security: { operationId: "RC-19", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: { querystring: Type.Object({ limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })), cursor: Type.Optional(Type.String()), includeDrafts: Type.Optional(Type.Union([Type.Literal("true"), Type.Literal("false")])) }), response: { 200: Silent, 403: Silent } },
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const principal = await services.principals.require(request, new Date())
      const q = request.query as any
      const page = await services.deps.runner.run("READ_STANDARD", principal.sessionId, ({ tx, evaluationInstant }) =>
        queries.announcementList(tx, principal.personId, evaluationInstant, {
          limit: q.limit, cursor: q.cursor, includeDrafts: q.includeDrafts === "true",
        }))
      return reply.status(200).send(page)
    },
  })
  registry.add({
    method: "GET", url: "/api/announcements/:announcementId",
    security: { operationId: "RC-19:DETAIL", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: { params: Type.Object({ announcementId: Uuid }), response: { 200: Silent, 403: Silent, 404: Silent } },
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const principal = await services.principals.require(request, new Date())
      const dto = await services.deps.runner.run("READ_STANDARD", principal.sessionId, ({ tx, evaluationInstant }) =>
        queries.announcementDetail(tx, principal.personId, String((request.params as any).announcementId), evaluationInstant))
      return reply.status(200).send(dto)
    },
  })

  // ── CMD-COM-05 DIRECT ──
  registry.add({
    method: "POST", url: "/api/conversations/direct",
    security: { operationId: "CMD-COM-05", kind: "command", auth: "required", csrf: "required", idempotency: "required", cache: "no-store" },
    schema: { body: Type.Object({ targetPersonId: Uuid }), response: { 200: Silent, 201: Silent, 400: Silent, 403: Silent, 409: Silent } },
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const principal = await services.principals.require(request, new Date())
      const targetPersonId = String((request.body as any).targetPersonId)
      const key = idempotencyKey(request)
      let status = 201
      let response: any = null
      await services.deps.runner.run("COMMAND_SERIALIZABLE", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        const acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
          scopeKey: `CMD-COM-05:${sorted(principal.personId, targetPersonId)}`, commandId: "CMD-COM-05", key, input: { targetPersonId },
        }, evaluationInstant)
        if (!acquired.acquired) { status = acquired.status; response = acquired.snapshot; return }
        response = await conversations.openDirect(tx, principal.personId, targetPersonId, evaluationInstant)
        await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, status, response, { type: "Conversation", id: response.id })
      }, true)
      return reply.status(status).send(response)
    },
  })

  // ── CMD-COM-06 GROUP ──
  registry.add({
    method: "POST", url: "/api/conversations/group",
    security: { operationId: "CMD-COM-06", kind: "command", auth: "required", csrf: "required", idempotency: "required", cache: "no-store" },
    schema: { body: Type.Object({ title: Type.String({ minLength: 1, maxLength: 300 }), participantPersonIds: Type.Array(Uuid) }), response: { 201: Silent, 400: Silent, 403: Silent, 409: Silent } },
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const principal = await services.principals.require(request, new Date())
      const b = request.body as any
      const key = idempotencyKey(request)
      let status = 201
      let response: any = null
      await services.deps.runner.run("COMMAND_SERIALIZABLE", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        const acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
          scopeKey: "CMD-COM-06", commandId: "CMD-COM-06", key, input: b,
        }, evaluationInstant)
        if (!acquired.acquired) { status = acquired.status; response = acquired.snapshot; return }
        response = await conversations.createGroup(tx, principal.personId, b, evaluationInstant)
        await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, status, response, { type: "Conversation", id: response.id })
      }, true)
      return reply.status(status).send(response)
    },
  })

  // ── CMD-COM-07 TEAM/EVENT ──
  registry.add({
    method: "POST", url: "/api/conversations/team-event",
    security: { operationId: "CMD-COM-07", kind: "command", auth: "required", csrf: "required", idempotency: "required", cache: "no-store" },
    schema: { body: Type.Object({ resourceType: Type.Union([Type.Literal("TEAM"), Type.Literal("EVENT")]), resourceId: Uuid }), response: { 200: Silent, 201: Silent, 403: Silent, 404: Silent, 409: Silent } },
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const principal = await services.principals.require(request, new Date())
      const b = request.body as any
      const key = idempotencyKey(request)
      let status = 201
      let response: any = null
      await services.deps.runner.run("COMMAND_SERIALIZABLE", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        const acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
          scopeKey: `CMD-COM-07:${b.resourceType}:${b.resourceId}`, commandId: "CMD-COM-07", key, input: b,
        }, evaluationInstant)
        if (!acquired.acquired) { status = acquired.status; response = acquired.snapshot; return }
        response = await conversations.openTeamEvent(tx, principal.personId, b.resourceType, b.resourceId, evaluationInstant)
        await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, status, response, { type: "Conversation", id: response.id })
      }, true)
      return reply.status(status).send(response)
    },
  })

  // ── CMD-COM-08 ARCHIVE GROUP ──
  registry.add({
    method: "POST", url: "/api/conversations/:conversationId/archive",
    security: { operationId: "CMD-COM-08", kind: "command", auth: "required", csrf: "required", idempotency: "none", cache: "no-store" },
    schema: { params: Type.Object({ conversationId: Uuid }), response: { 200: Silent, 400: Silent, 403: Silent } },
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const principal = await services.principals.require(request, new Date())
      const response = await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        return conversations.archiveGroup(tx, principal.personId, String((request.params as any).conversationId), evaluationInstant)
      })
      return reply.status(200).send(response)
    },
  })

  // ── CMD-COM-09 SEND ──
  registry.add({
    method: "POST", url: "/api/conversations/:conversationId/messages",
    security: { operationId: "CMD-COM-09", kind: "command", auth: "required", csrf: "required", idempotency: "required", cache: "no-store" },
    schema: {
      params: Type.Object({ conversationId: Uuid }),
      body: Type.Object({ body: Type.String({ minLength: 1, maxLength: 20_000 }) }),
      response: { 201: Silent, 400: Silent, 403: Silent, 409: Silent },
    },
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const principal = await services.principals.require(request, new Date())
      const conversationId = String((request.params as any).conversationId)
      const body = String((request.body as any).body)
      const key = idempotencyKey(request)
      let response: any = null
      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        const acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
          scopeKey: `CMD-COM-09:${conversationId}`, commandId: "CMD-COM-09", key, input: { conversationId, body },
        }, evaluationInstant)
        if (!acquired.acquired) { response = acquired.snapshot; return }
        response = await messages.send(tx, principal.personId, conversationId, body, evaluationInstant)
        await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 201, response, { type: "Message", id: response.id })
      }, true)
      return reply.status(201).send(response)
    },
  })

  // ── CMD-COM-10 EDIT ──
  registry.add({
    method: "PATCH", url: "/api/messages/:messageId",
    security: { operationId: "CMD-COM-10", kind: "command", auth: "required", csrf: "required", idempotency: "none", cache: "no-store" },
    schema: { params: Type.Object({ messageId: Uuid }), body: Type.Object({ body: Type.String({ minLength: 1, maxLength: 20_000 }) }), response: { 200: Silent, 400: Silent, 403: Silent, 409: Silent } },
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const principal = await services.principals.require(request, new Date())
      const response = await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        return messages.edit(tx, principal.personId, String((request.params as any).messageId), String((request.body as any).body), evaluationInstant)
      })
      return reply.status(200).send(response)
    },
  })

  // ── CMD-COM-11 DELETE ──
  registry.add({
    method: "DELETE", url: "/api/messages/:messageId",
    security: { operationId: "CMD-COM-11", kind: "command", auth: "required", csrf: "required", idempotency: "none", cache: "no-store" },
    schema: {
      params: Type.Object({ messageId: Uuid }),
      body: Type.Object({ deletionReason: Type.String({ minLength: 1, maxLength: 500 }) }),
      response: { 200: Silent, 400: Silent, 403: Silent, 409: Silent },
    },
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const principal = await services.principals.require(request, new Date())
      const response = await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        return messages.delete(tx, principal.personId, String((request.params as any).messageId), String((request.body as any).deletionReason), evaluationInstant)
      })
      return reply.status(200).send(response)
    },
  })

  // ── RC-06 CONVERSATION LIST ──
  registry.add({
    method: "GET", url: "/api/conversations",
    security: { operationId: "RC-06", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: { querystring: Type.Object({ limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })), cursor: Type.Optional(Type.String()) }), response: { 200: Silent, 403: Silent } },
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const principal = await services.principals.require(request, new Date())
      const q = request.query as any
      const page = await services.deps.runner.run("READ_STANDARD", principal.sessionId, ({ tx, evaluationInstant }) =>
        queries.conversationList(tx, principal.personId, evaluationInstant, { limit: q.limit, cursor: q.cursor }))
      return reply.status(200).send(page)
    },
  })

  // ── RC-07 THREAD (+ touch read cursor) ──
  registry.add({
    method: "GET", url: "/api/conversations/:conversationId/thread",
    security: { operationId: "RC-07", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: {
      params: Type.Object({ conversationId: Uuid }),
      querystring: Type.Object({ limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })), cursor: Type.Optional(Type.String()) }),
      response: { 200: Silent, 403: Silent, 404: Silent },
    },
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const principal = await services.principals.require(request, new Date())
      const q = request.query as any
      const conversationId = String((request.params as any).conversationId)
      // COMMAND_STANDARD: la vista actualiza lastReadAt (operación interna) en la misma TX.
      const page = await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        const result = await queries.conversationThread(tx, principal.personId, conversationId, evaluationInstant, { limit: q.limit, cursor: q.cursor })
        await touchConversationReadCursor(tx, conversationId, principal.personId, evaluationInstant, services.authority)
        return result
      })
      return reply.status(200).send(page)
    },
  })

  // ── Detalle de conversación (misma guardia RC-07) ──
  registry.add({
    method: "GET", url: "/api/conversations/:conversationId",
    security: { operationId: "RC-06:DETAIL", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: { params: Type.Object({ conversationId: Uuid }), response: { 200: Silent, 403: Silent, 404: Silent } },
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const principal = await services.principals.require(request, new Date())
      const dto = await services.deps.runner.run("READ_STANDARD", principal.sessionId, ({ tx, evaluationInstant }) =>
        conversations.getForViewer(tx, String((request.params as any).conversationId), principal.personId, evaluationInstant))
      return reply.status(200).send(dto)
    },
  })

  // ── RC-26 / RC-27 ──
  registry.add({
    method: "GET", url: "/api/teams/:teamId/conversations",
    security: { operationId: "RC-26", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: { params: Type.Object({ teamId: Uuid }), response: { 200: Silent, 403: Silent } },
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const principal = await services.principals.require(request, new Date())
      const items = await services.deps.runner.run("READ_STANDARD", principal.sessionId, ({ tx, evaluationInstant }) =>
        queries.teamConversations(tx, principal.personId, String((request.params as any).teamId), evaluationInstant))
      return reply.status(200).send({ items })
    },
  })
  registry.add({
    method: "GET", url: "/api/events/:eventId/conversations",
    security: { operationId: "RC-27", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: { params: Type.Object({ eventId: Uuid }), response: { 200: Silent, 403: Silent } },
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const principal = await services.principals.require(request, new Date())
      const items = await services.deps.runner.run("READ_STANDARD", principal.sessionId, ({ tx, evaluationInstant }) =>
        queries.eventConversations(tx, principal.personId, String((request.params as any).eventId), evaluationInstant))
      return reply.status(200).send({ items })
    },
  })
}

function sorted(a: string, b: string): string {
  return [a, b].sort().join("|")
}
