import type { FastifyInstance } from "fastify"
import { Type } from "@sinclair/typebox"
import type { ProductServices } from "../product-services.js"
import { AppError } from "../shared/errors.js"

const SilentResponse = Type.Any()
const Uuid = Type.String({ format: "uuid" })
const DateTime = Type.String({ format: "date-time" })

type RouteInput = { app: FastifyInstance; registry: any; services: ProductServices }

function toEventPatch(body: any) {
  const patch: Record<string, unknown> = {}
  if (body.title !== undefined) patch.title = body.title
  if (body.startAt !== undefined) patch.startAt = body.startAt
  if (body.endAt !== undefined) patch.endAt = body.endAt
  if (body.timeZone !== undefined) patch.timeZone = body.timeZone
  if (body.venueId !== undefined) patch.venueId = body.venueId
  if (body.clubWideTarget !== undefined) patch.clubWideTarget = body.clubWideTarget
  if (body.targetTeamIds !== undefined) patch.targetTeamIds = body.targetTeamIds
  if (body.targetPersonIds !== undefined) patch.targetPersonIds = body.targetPersonIds
  if (body.opponent !== undefined) patch.opponent = body.opponent
  if (body.competitionId !== undefined) patch.competitionId = body.competitionId
  if (body.logistics !== undefined) patch.logistics = body.logistics
  return patch
}

export function addEventRoutes({ app, registry, services }: RouteInput): void {
  /* ── CMD-EVT-01/02/03 — create event (type-dispatched) ── */
  registry.add({
    method: "POST",
    url: "/api/events",
    security: { operationId: "CMD-EVT-01", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      body: Type.Object({
        type: Type.Union([Type.Literal("TRAINING"), Type.Literal("MATCH"), Type.Literal("CLUB_EVENT")]),
        title: Type.String({ minLength: 1, maxLength: 160 }),
        startAt: DateTime,
        endAt: Type.Optional(Type.Union([DateTime, Type.Null()])),
        timeZone: Type.Optional(Type.String({ minLength: 1, maxLength: 64 })),
        venueId: Type.Optional(Type.Union([Uuid, Type.Null()])),
        clubWideTarget: Type.Optional(Type.Boolean()),
        targetTeamIds: Type.Optional(Type.Array(Uuid)),
        targetPersonIds: Type.Optional(Type.Array(Uuid)),
        competitionId: Type.Optional(Type.Union([Uuid, Type.Null()])),
        opponent: Type.Optional(Type.Union([Type.String({ minLength: 1, maxLength: 160 }), Type.Null()])),
        logistics: Type.Optional(Type.Object({
          meetingAt: Type.Optional(Type.Union([DateTime, Type.Null()])),
          departureAt: Type.Optional(Type.Union([DateTime, Type.Null()])),
          meetingPoint: Type.Optional(Type.Union([Type.String({ maxLength: 300 }), Type.Null()])),
          transportNote: Type.Optional(Type.Union([Type.String({ maxLength: 2000 }), Type.Null()])),
          arrivalInstructions: Type.Optional(Type.Union([Type.String({ maxLength: 2000 }), Type.Null()])),
        })),
        idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })),
      }),
      response: { 201: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 422: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const body = request.body ?? {}
      const key = String(body.idempotency_key ?? "")
      let status = 201
      let bodyOut: any = null
      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        const operationId = body.type === "MATCH" ? "CMD-EVT-02" : body.type === "CLUB_EVENT" ? "CMD-EVT-03" : "CMD-EVT-01"
        let acquired: any = null
        if (key) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, { scopeKey: operationId, commandId: operationId, key, input: { type: body.type, title: body.title } }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; bodyOut = acquired.snapshot ?? { eventCreated: true }; return }
        }
        const event = await services.events.createEvent(tx, principal.personId, {
          type: body.type, title: body.title, startAt: body.startAt, endAt: body.endAt ?? null,
          timeZone: body.timeZone, venueId: body.venueId ?? null, clubWideTarget: body.clubWideTarget,
          targetTeamIds: body.targetTeamIds, targetPersonIds: body.targetPersonIds,
          competitionId: body.competitionId ?? null, opponent: body.opponent ?? null,
        }, evaluationInstant, services.deps.config.clubTimeZone, operationId)
        if (body.logistics) {
          const logistics = body.logistics
          const hasAny = Object.values(logistics).some((value) => value !== undefined && value !== null && value !== "")
          if (hasAny) {
            await services.events.updateLogistics(tx, principal.personId, event.id, { ...logistics }, evaluationInstant, operationId)
          }
        }
        bodyOut = { eventCreated: true, id: event.id, state: "SCHEDULED", type: event.type }
        status = 201
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 201, bodyOut)
      }, true)
      return reply.status(status).send(bodyOut)
    },
  })

  /* ── CMD-EVT-04 — non-material edit (title only) ── */
  registry.add({
    method: "PATCH",
    url: "/api/events/:eventId/meta",
    security: { operationId: "CMD-EVT-04", kind: "command", auth: "required", csrf: "required", idempotency: "none", cache: "no-store" },
    schema: {
      params: Type.Object({ eventId: Uuid }),
      body: Type.Object({ title: Type.String({ minLength: 1, maxLength: 160 }), expectedVersion: Type.Optional(Type.Integer({ minimum: 1 })) }),
      response: { 200: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 422: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const eventId = String(request.params.eventId)
      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        await services.events.editEventMeta(tx, principal.personId, eventId, { title: request.body.title, expectedVersion: request.body.expectedVersion }, evaluationInstant)
      }, true)
      return reply.status(200).send({ eventUpdated: true, eventId })
    },
  })

  /* ── CMD-EVT-05 — material change ── */
  registry.add({
    method: "PATCH",
    url: "/api/events/:eventId",
    security: { operationId: "CMD-EVT-05", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      params: Type.Object({ eventId: Uuid }),
      body: Type.Object({
        title: Type.Optional(Type.String({ minLength: 1, maxLength: 160 })),
        startAt: Type.Optional(DateTime),
        endAt: Type.Optional(Type.Union([DateTime, Type.Null()])),
        timeZone: Type.Optional(Type.String({ minLength: 1, maxLength: 64 })),
        venueId: Type.Optional(Type.Union([Uuid, Type.Null()])),
        clubWideTarget: Type.Optional(Type.Boolean()),
        targetTeamIds: Type.Optional(Type.Array(Uuid)),
        targetPersonIds: Type.Optional(Type.Array(Uuid)),
        opponent: Type.Optional(Type.Union([Type.String({ minLength: 1, maxLength: 160 }), Type.Null()])),
        competitionId: Type.Optional(Type.Union([Uuid, Type.Null()])),
        logistics: Type.Optional(Type.Object({
          meetingAt: Type.Optional(Type.Union([DateTime, Type.Null()])),
          departureAt: Type.Optional(Type.Union([DateTime, Type.Null()])),
          meetingPoint: Type.Optional(Type.Union([Type.String({ maxLength: 300 }), Type.Null()])),
          transportNote: Type.Optional(Type.Union([Type.String({ maxLength: 2000 }), Type.Null()])),
          arrivalInstructions: Type.Optional(Type.Union([Type.String({ maxLength: 2000 }), Type.Null()])),
        })),
        expectedVersion: Type.Optional(Type.Integer({ minimum: 1 })),
        idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })),
      }),
      response: { 200: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 422: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const eventId = String(request.params.eventId)
      const key = String(request.body.idempotency_key ?? "")
      const patch = toEventPatch(request.body)
      let status = 200
      let bodyOut: any = null
      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        let acquired: any = null
        if (key) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, { scopeKey: "CMD-EVT-05", commandId: "CMD-EVT-05", key, input: { eventId, patch } }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; bodyOut = acquired.snapshot ?? { eventUpdated: true, eventId }; return }
        }
        const result = await services.events.materialChangeEvent(tx, principal.personId, eventId, patch, request.body.expectedVersion, evaluationInstant)
        bodyOut = { eventUpdated: true, eventId, version: result.version, coordinationRevision: result.coordinationRevision, materialFields: result.material }
        status = 200
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, bodyOut)
      }, true)
      return reply.status(status).send(bodyOut)
    },
  })

  /* ── CMD-EVT-06..09 — lifecycle ── */
  for (const [operationId, path, action] of [
    ["CMD-EVT-06", "postpone", "postponeEvent"],
    ["CMD-EVT-07", "reschedule", "rescheduleEvent"],
    ["CMD-EVT-08", "cancel", "cancelEvent"],
    ["CMD-EVT-09", "restore", "restoreEvent"],
  ] as const) {
    registry.add({
      method: "POST",
      url: `/api/events/:eventId/${path}`,
      security: { operationId, kind: "command", auth: "required", csrf: "required", idempotency: "none", cache: "no-store" },
      schema: { params: Type.Object({ eventId: Uuid }), response: { 200: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 422: SilentResponse, 500: SilentResponse } },
      async handler(request: any, reply: any) {
        const principal = await services.principals.require(request, new Date())
        const eventId = String(request.params.eventId)
        let outcome: any = null
        await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
          await services.principals.requireInTx(tx, request, evaluationInstant)
          outcome = await (services.events as any)[action](tx, principal.personId, eventId, evaluationInstant)
        }, true)
        return reply.status(200).send({ eventUpdated: true, eventId, ...outcome })
      },
    })
  }

  /* ── CMD-EVT-10/11 — complete/abandon (T04-guarded) ── */
  for (const [operationId, path, action] of [
    ["CMD-EVT-10", "complete", "completeEvent"],
    ["CMD-EVT-11", "abandon", "abandonEvent"],
  ] as const) {
    registry.add({
      method: "POST",
      url: `/api/events/:eventId/${path}`,
      security: { operationId, kind: "command", auth: "required", csrf: "required", idempotency: "none", cache: "no-store" },
      schema: { params: Type.Object({ eventId: Uuid }), response: { 200: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 422: SilentResponse, 500: SilentResponse } },
      async handler(request: any, reply: any) {
        const principal = await services.principals.require(request, new Date())
        const eventId = String(request.params.eventId)
        await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
          await services.principals.requireInTx(tx, request, evaluationInstant)
          await (services.events as any)[action](tx, principal.personId, eventId, evaluationInstant)
        }, true)
        return reply.status(200).send({ eventUpdated: true, eventId })
      },
    })
  }

  /* ── CMD-EVT-12 — resolve edit conflict ── */
  registry.add({
    method: "POST",
    url: "/api/events/:eventId/conflict",
    security: { operationId: "CMD-EVT-12", kind: "command", auth: "required", csrf: "required", idempotency: "none", cache: "no-store" },
    schema: {
      params: Type.Object({ eventId: Uuid }),
      body: Type.Object({
        expectedVersion: Type.Integer({ minimum: 1 }),
        patch: Type.Object({}, { additionalProperties: true }),
      }),
      response: { 200: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 422: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const eventId = String(request.params.eventId)
      const patch = toEventPatch(request.body.patch ?? {})
      let result: any = null
      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        result = await services.events.resolveEditConflict(tx, principal.personId, eventId, { expectedVersion: request.body.expectedVersion, patch }, evaluationInstant)
      }, true)
      return reply.status(200).send({ eventUpdated: true, eventId, ...result })
    },
  })

  /* ── CMD-EVT-13 — create series ── */
  registry.add({
    method: "POST",
    url: "/api/event-series",
    security: { operationId: "CMD-EVT-13", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      body: Type.Object({
        name: Type.Optional(Type.String({ minLength: 1, maxLength: 160 })),
        recurrenceRule: Type.String({ minLength: 1, maxLength: 500 }),
        maxOccurrences: Type.Optional(Type.Integer({ minimum: 1, maximum: 366 })),
        type: Type.Union([Type.Literal("TRAINING"), Type.Literal("MATCH"), Type.Literal("CLUB_EVENT")]),
        title: Type.String({ minLength: 1, maxLength: 160 }),
        startAt: DateTime,
        endAt: Type.Optional(Type.Union([DateTime, Type.Null()])),
        timeZone: Type.Optional(Type.String({ minLength: 1, maxLength: 64 })),
        venueId: Type.Optional(Type.Union([Uuid, Type.Null()])),
        clubWideTarget: Type.Optional(Type.Boolean()),
        targetTeamIds: Type.Optional(Type.Array(Uuid)),
        targetPersonIds: Type.Optional(Type.Array(Uuid)),
        competitionId: Type.Optional(Type.Union([Uuid, Type.Null()])),
        opponent: Type.Optional(Type.Union([Type.String({ minLength: 1, maxLength: 160 }), Type.Null()])),
        idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })),
      }),
      response: { 201: SilentResponse, 400: SilentResponse, 403: SilentResponse, 409: SilentResponse, 422: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const key = String(request.body.idempotency_key ?? "")
      let status = 201
      let bodyOut: any = null
      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        let acquired: any = null
        if (key) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, { scopeKey: "CMD-EVT-13", commandId: "CMD-EVT-13", key, input: { title: request.body.title, rule: request.body.recurrenceRule } }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; bodyOut = acquired.snapshot ?? { seriesCreated: true }; return }
        }
        const result = await services.eventSeries.createSeries(tx, principal.personId, {
          name: request.body.name, recurrenceRule: request.body.recurrenceRule, maxOccurrences: request.body.maxOccurrences,
          type: request.body.type, title: request.body.title, startAt: request.body.startAt, endAt: request.body.endAt ?? null,
          timeZone: request.body.timeZone, venueId: request.body.venueId ?? null, clubWideTarget: request.body.clubWideTarget,
          targetTeamIds: request.body.targetTeamIds, targetPersonIds: request.body.targetPersonIds,
          competitionId: request.body.competitionId ?? null, opponent: request.body.opponent ?? null,
        }, evaluationInstant, services.deps.config.clubTimeZone)
        bodyOut = { seriesCreated: true, id: result.id, occurrenceCount: result.occurrenceCount }
        status = 201
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 201, bodyOut)
      }, true)
      return reply.status(status).send(bodyOut)
    },
  })

  /* ── CMD-EVT-14 — end series ── */
  registry.add({
    method: "POST",
    url: "/api/event-series/:seriesId/end",
    security: { operationId: "CMD-EVT-14", kind: "command", auth: "required", csrf: "required", idempotency: "none", cache: "no-store" },
    schema: { params: Type.Object({ seriesId: Uuid }), response: { 200: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 500: SilentResponse } },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const seriesId = String(request.params.seriesId)
      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        await services.eventSeries.endSeries(tx, principal.personId, seriesId, evaluationInstant)
      }, true)
      return reply.status(200).send({ seriesEnded: true, seriesId })
    },
  })

  /* ── CMD-EVT-16 — update logistics ── */
  registry.add({
    method: "PATCH",
    url: "/api/events/:eventId/logistics",
    security: { operationId: "CMD-EVT-16", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      params: Type.Object({ eventId: Uuid }),
      body: Type.Object({
        meetingAt: Type.Optional(Type.Union([DateTime, Type.Null()])),
        departureAt: Type.Optional(Type.Union([DateTime, Type.Null()])),
        meetingPoint: Type.Optional(Type.Union([Type.String({ maxLength: 300 }), Type.Null()])),
        transportNote: Type.Optional(Type.Union([Type.String({ maxLength: 2000 }), Type.Null()])),
        arrivalInstructions: Type.Optional(Type.Union([Type.String({ maxLength: 2000 }), Type.Null()])),
        expectedVersion: Type.Optional(Type.Integer({ minimum: 1 })),
        idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })),
      }),
      response: { 200: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 422: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const eventId = String(request.params.eventId)
      const key = String(request.body.idempotency_key ?? "")
      let status = 200
      let bodyOut: any = null
      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        let acquired: any = null
        if (key) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, { scopeKey: "CMD-EVT-16", commandId: "CMD-EVT-16", key, input: { eventId, logistics: request.body } }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; bodyOut = acquired.snapshot ?? { logisticsUpdated: true, eventId }; return }
        }
        const result = await services.events.updateLogistics(tx, principal.personId, eventId, request.body, evaluationInstant)
        bodyOut = { logisticsUpdated: true, eventId, version: result.version, coordinationRevision: result.coordinationRevision }
        status = 200
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, bodyOut)
      }, true)
      return reply.status(status).send(bodyOut)
    },
  })

  /* ──────────────────────────── READS (RC-*) ──────────────────────────── */

  /* ── RC-02 — calendar range ── */
  registry.add({
    method: "GET",
    url: "/api/calendar/range",
    security: { operationId: "RC-02", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: {
      querystring: Type.Object({
        from: DateTime,
        to: DateTime,
        type: Type.Optional(Type.Union([Type.Literal("TRAINING"), Type.Literal("MATCH"), Type.Literal("CLUB_EVENT")])),
        state: Type.Optional(Type.String({ maxLength: 20 })),
        limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 500 })),
      }),
      response: { 200: SilentResponse, 400: SilentResponse, 403: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const query = request.query ?? {}
      const items = await services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) =>
        services.t03Reads.calendarRange(tx, principal.personId, { from: String(query.from), to: String(query.to), type: query.type, state: query.state, limit: query.limit }, evaluationInstant))
      return reply.status(200).send({ items })
    },
  })

  /* ── RC-03 — event detail ── */
  registry.add({
    method: "GET",
    url: "/api/events/:eventId",
    security: { operationId: "RC-03", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: { params: Type.Object({ eventId: Uuid }), response: { 200: SilentResponse, 403: SilentResponse, 404: SilentResponse, 500: SilentResponse } },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const eventId = String(request.params.eventId)
      const detail = await services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => services.t03Reads.eventDetail(tx, principal.personId, eventId, evaluationInstant))
      return reply.status(200).send(detail)
    },
  })

  /* ── RC-23 — next event ── */
  registry.add({
    method: "GET",
    url: "/api/events/next",
    security: { operationId: "RC-23", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: { response: { 200: SilentResponse, 403: SilentResponse, 500: SilentResponse } },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const next = await services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => services.t03Reads.nextEvent(tx, principal.personId, evaluationInstant))
      return reply.status(200).send({ event: next })
    },
  })

  /* ── RC-24 — series detail ── */
  registry.add({
    method: "GET",
    url: "/api/event-series/:seriesId",
    security: { operationId: "RC-24", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: { params: Type.Object({ seriesId: Uuid }), response: { 200: SilentResponse, 403: SilentResponse, 404: SilentResponse, 500: SilentResponse } },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const seriesId = String(request.params.seriesId)
      const detail = await services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => services.t03Reads.eventSeriesDetail(tx, principal.personId, seriesId, evaluationInstant))
      return reply.status(200).send(detail)
    },
  })

  /* ── RC-30 — materiality check ── */
  registry.add({
    method: "GET",
    url: "/api/events/:eventId/materiality-check",
    security: { operationId: "RC-30", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: {
      params: Type.Object({ eventId: Uuid }),
      querystring: Type.Object({
        title: Type.Optional(Type.String({ maxLength: 160 })),
        startAt: Type.Optional(DateTime),
        endAt: Type.Optional(Type.Union([DateTime, Type.Null()])),
        timeZone: Type.Optional(Type.String({ maxLength: 64 })),
        venueId: Type.Optional(Type.String({ maxLength: 64 })),
        targetTeamIds: Type.Optional(Type.String({ maxLength: 3000 })),
        targetPersonIds: Type.Optional(Type.String({ maxLength: 6000 })),
        clubWideTarget: Type.Optional(Type.String({ maxLength: 10 })),
        opponent: Type.Optional(Type.String({ maxLength: 160 })),
        competitionId: Type.Optional(Type.String({ maxLength: 64 })),
        logistics: Type.Optional(Type.String({ maxLength: 4000 })),
      }),
      response: { 200: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const eventId = String(request.params.eventId)
      const query = request.query ?? {}
      const patch: Record<string, unknown> = {}
      if (query.title !== undefined) patch.title = query.title
      if (query.startAt !== undefined) patch.startAt = query.startAt
      if (query.endAt !== undefined) patch.endAt = query.endAt === "null" ? null : query.endAt
      if (query.timeZone !== undefined) patch.timeZone = query.timeZone
      if (query.venueId !== undefined) patch.venueId = query.venueId === "null" ? null : query.venueId
      if (query.targetTeamIds !== undefined) patch.targetTeamIds = String(query.targetTeamIds).split(",").map((item) => item.trim()).filter(Boolean)
      if (query.targetPersonIds !== undefined) patch.targetPersonIds = String(query.targetPersonIds).split(",").map((item) => item.trim()).filter(Boolean)
      if (query.clubWideTarget !== undefined) patch.clubWideTarget = ["true", "1", "yes"].includes(String(query.clubWideTarget).toLowerCase())
      if (query.opponent !== undefined) patch.opponent = query.opponent === "null" ? null : query.opponent
      if (query.competitionId !== undefined) patch.competitionId = query.competitionId === "null" ? null : query.competitionId
      if (query.logistics !== undefined) {
        try {
          patch.logistics = JSON.parse(String(query.logistics))
        } catch {
          throw new AppError("VALIDATION_FAILED", "logistics must be valid JSON", "domain_validation", false, { logistics: ["invalid_json"] })
        }
      }
      const result = await services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) =>
        services.t03Reads.materialityCheck(tx, principal.personId, eventId, patch, evaluationInstant))
      return reply.status(200).send(result)
    },
  })
}
