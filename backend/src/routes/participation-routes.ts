import type { FastifyInstance } from "fastify"
import { Type } from "@sinclair/typebox"
import type { ProductServices } from "../product-services.js"

/**
 * T04 R3 — superficie HTTP de participación.
 *
 * Inventario normativo (COR-03): 11 comandos CMD-PRT + 3 read contracts
 * (RC-15/16/17) + proyección PLAYER = 15 rutas. CMD-EVT-17 se registra en
 * event-routes.ts (integración con Event Core) y completa las 16 rutas HTTP.
 *
 * Cada comando corre en UNA transacción (TransactionRunner) y revalida la
 * autoridad dentro de la transacción, también en los reintentos.
 */

const SilentResponse = Type.Any()
const Uuid = Type.String({ format: "uuid" })
const AvailabilityValue = Type.Union([Type.Literal("YES"), Type.Literal("MAYBE"), Type.Literal("NO")])
const AttendanceValue = Type.Union([Type.Literal("PRESENT"), Type.Literal("ABSENT"), Type.Literal("JUSTIFIED")])
const SelectionRole = Type.Union([Type.Literal("SELECTED"), Type.Literal("ALTERNATE")])
const ResultType = Type.Union([Type.Literal("PLAYED"), Type.Literal("FORFEIT"), Type.Literal("ABANDONED")])

type RouteInput = { app: FastifyInstance; registry: any; services: ProductServices }

function omitNull(values: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(values)) if (value !== null && value !== undefined) out[key] = value
  return out
}

export function addParticipationRoutes({ app, registry, services }: RouteInput): void {
  /* ── CMD-PRT-01 — respond own availability ── */
  registry.add({
    method: "POST",
    url: "/api/events/:eventId/availability",
    security: { operationId: "CMD-PRT-01", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      params: Type.Object({ eventId: Uuid }),
      body: Type.Object({
        value: AvailabilityValue,
        observedCoordinationRevision: Type.Integer({ minimum: 0 }),
        idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })),
      }),
      response: { 200: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 422: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const eventId = String(request.params.eventId)
      const key = String(request.headers["idempotency-key"] ?? request.body?.idempotency_key ?? "")
      let status = 200
      let bodyOut: any = null
      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        let acquired: any = null
        if (key) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
            scopeKey: "CMD-PRT-01",
            commandId: "CMD-PRT-01",
            key,
            input: { eventId, value: request.body.value, observedCoordinationRevision: request.body.observedCoordinationRevision },
          }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; bodyOut = acquired.snapshot ?? { responded: true }; return }
        }
        bodyOut = await services.participation.respondAvailability(tx, principal.personId, {
          eventId,
          value: request.body.value,
          observedCoordinationRevision: request.body.observedCoordinationRevision,
        }, evaluationInstant)
        status = 200
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, bodyOut)
      }, true)
      return reply.status(status).send(bodyOut)
    },
  })

  /* ── RC-17 — availability summary (coach) ── */
  registry.add({
    method: "GET",
    url: "/api/events/:eventId/availability/summary",
    security: { operationId: "RC-17", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: {
      params: Type.Object({ eventId: Uuid }),
      querystring: Type.Object({ limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 500 })) }),
      response: { 200: SilentResponse, 403: SilentResponse, 404: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const eventId = String(request.params.eventId)
      const limit = request.query?.limit
      const summary = await services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) =>
        services.t04Reads.availabilitySummary(tx, principal.personId, eventId, evaluationInstant, limit))
      return reply.status(200).send(summary)
    },
  })

  /* ── CMD-PRT-02 — selection draft autosave ── */
  registry.add({
    method: "PATCH",
    url: "/api/events/:eventId/selection/draft",
    security: { operationId: "CMD-PRT-02", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      params: Type.Object({ eventId: Uuid }),
      body: Type.Object({
        entries: Type.Array(Type.Object({
          personId: Uuid,
          role: SelectionRole,
          order: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
        })),
        autosaveVersion: Type.Integer({ minimum: 0 }),
        idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })),
      }),
      response: { 200: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 422: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const eventId = String(request.params.eventId)
      const key = String(request.headers["idempotency-key"] ?? request.body?.idempotency_key ?? "")
      let status = 200
      let bodyOut: any = null
      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        let acquired: any = null
        if (key) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
            scopeKey: "CMD-PRT-02",
            commandId: "CMD-PRT-02",
            key,
            input: { eventId, entries: request.body.entries, autosaveVersion: request.body.autosaveVersion },
          }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; bodyOut = acquired.snapshot ?? {}; return }
        }
        bodyOut = await services.participation.updateSelectionDraft(tx, principal.personId, {
          matchId: eventId,
          entries: request.body.entries ?? [],
          autosaveVersion: request.body.autosaveVersion,
        }, evaluationInstant)
        status = 200
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, bodyOut)
      }, true)
      return reply.status(status).send(bodyOut)
    },
  })

  /* ── CMD-PRT-03 — publish selection ── */
  registry.add({
    method: "POST",
    url: "/api/events/:eventId/selection/publish",
    security: { operationId: "CMD-PRT-03", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      params: Type.Object({ eventId: Uuid }),
      body: Type.Object({ idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })) }),
      response: { 200: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 422: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const eventId = String(request.params.eventId)
      const key = String(request.headers["idempotency-key"] ?? request.body?.idempotency_key ?? "")
      let status = 200
      let bodyOut: any = null
      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        // Clave canónica del contrato: matchId|revisionId (evita publicar dos veces el mismo borrador).
        const selection = await tx.selectFrom("app.selections").selectAll().where("match_id", "=", eventId).executeTakeFirst()
        const draftId = selection?.current_draft_revision_id ?? "none"
        const effectiveKey = key || `${eventId}|${draftId}`
        const acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
          scopeKey: "CMD-PRT-03",
          commandId: "CMD-PRT-03",
          key: effectiveKey,
          // El hash de la petición es estable: el borrador cambia tras publicar,
          // pero un reintento con la misma clave debe devolver la misma respuesta.
          input: { matchId: eventId },
        }, evaluationInstant)
        if (!acquired.acquired) { status = acquired.status; bodyOut = acquired.snapshot ?? {}; return }
        bodyOut = await services.participation.publishSelection(tx, principal.personId, { matchId: eventId }, evaluationInstant)
        status = 200
        await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, bodyOut)
      }, true)
      return reply.status(status).send(bodyOut)
    },
  })

  /* ── CMD-PRT-04 — derived conflicts ── */
  registry.add({
    method: "GET",
    url: "/api/events/:eventId/selection/conflicts",
    security: { operationId: "CMD-PRT-04", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: { params: Type.Object({ eventId: Uuid }), response: { 200: SilentResponse, 403: SilentResponse, 404: SilentResponse, 500: SilentResponse } },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const eventId = String(request.params.eventId)
      const result = await services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) =>
        services.t04Reads.selectionConflicts(tx, principal.personId, eventId, evaluationInstant))
      return reply.status(200).send(result)
    },
  })

  /* ── RC-15 — selection detail (coach) ── */
  registry.add({
    method: "GET",
    url: "/api/events/:eventId/selection",
    security: { operationId: "RC-15", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: { params: Type.Object({ eventId: Uuid }), response: { 200: SilentResponse, 403: SilentResponse, 404: SilentResponse, 500: SilentResponse } },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const eventId = String(request.params.eventId)
      const detail = await services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) =>
        services.t04Reads.selectionDetail(tx, principal.personId, eventId, evaluationInstant))
      return reply.status(200).send(detail)
    },
  })

  /* ── PLAYER projection — own published selection status ── */
  registry.add({
    method: "GET",
    url: "/api/events/:eventId/selection/my-status",
    security: { operationId: "RC-PLAYER-SELECTION", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: { params: Type.Object({ eventId: Uuid }), response: { 200: SilentResponse, 404: SilentResponse, 500: SilentResponse } },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const eventId = String(request.params.eventId)
      const status = await services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) =>
        services.t04Reads.playerSelectionStatus(tx, principal.personId, eventId, evaluationInstant))
      return reply.status(200).send(status)
    },
  })

  /* ── CMD-PRT-05 — register attendance ── */
  registry.add({
    method: "POST",
    url: "/api/events/:eventId/attendance",
    security: { operationId: "CMD-PRT-05", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      params: Type.Object({ eventId: Uuid }),
      body: Type.Object({
        personId: Uuid,
        value: AttendanceValue,
        idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })),
      }),
      response: { 200: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 422: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const eventId = String(request.params.eventId)
      const key = String(request.headers["idempotency-key"] ?? request.body?.idempotency_key ?? "")
      let status = 200
      let bodyOut: any = null
      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        let acquired: any = null
        if (key) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
            scopeKey: "CMD-PRT-05",
            commandId: "CMD-PRT-05",
            key,
            input: { eventId, personId: request.body.personId, value: request.body.value },
          }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; bodyOut = acquired.snapshot ?? {}; return }
        }
        bodyOut = await services.participation.recordAttendance(tx, principal.personId, {
          eventId,
          personId: request.body.personId,
          value: request.body.value,
        }, evaluationInstant)
        status = 200
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, bodyOut)
      }, true)
      return reply.status(status).send(bodyOut)
    },
  })

  /* ── CMD-PRT-06 — close attendance sheet ── */
  registry.add({
    method: "POST",
    url: "/api/events/:eventId/attendance/close",
    security: { operationId: "CMD-PRT-06", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      params: Type.Object({ eventId: Uuid }),
      body: Type.Object({ idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })) }),
      response: { 200: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const eventId = String(request.params.eventId)
      const key = String(request.headers["idempotency-key"] ?? request.body?.idempotency_key ?? "")
      let status = 200
      let bodyOut: any = null
      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        let acquired: any = null
        if (key) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, { scopeKey: "CMD-PRT-06", commandId: "CMD-PRT-06", key, input: { eventId } }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; bodyOut = acquired.snapshot ?? {}; return }
        }
        bodyOut = await services.participation.closeAttendanceSheet(tx, principal.personId, { eventId }, evaluationInstant)
        status = 200
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, bodyOut)
      }, true)
      return reply.status(status).send(bodyOut)
    },
  })

  /* ── CMD-PRT-07 — correct attendance ── */
  registry.add({
    method: "PATCH",
    url: "/api/events/:eventId/attendance/:entryId/correct",
    security: { operationId: "CMD-PRT-07", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      params: Type.Object({ eventId: Uuid, entryId: Uuid }),
      body: Type.Object({
        value: AttendanceValue,
        correctionReason: Type.String({ minLength: 1, maxLength: 1000 }),
        personId: Type.Optional(Uuid),
        idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })),
      }),
      response: { 200: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 422: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const eventId = String(request.params.eventId)
      const entryId = String(request.params.entryId)
      const key = String(request.headers["idempotency-key"] ?? request.body?.idempotency_key ?? "")
      let status = 200
      let bodyOut: any = null
      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        let acquired: any = null
        if (key) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
            scopeKey: "CMD-PRT-07",
            commandId: "CMD-PRT-07",
            key,
            input: { eventId, entryId, value: request.body.value, correctionReason: request.body.correctionReason },
          }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; bodyOut = acquired.snapshot ?? {}; return }
        }
        bodyOut = await services.participation.correctAttendance(tx, principal.personId, {
          eventId,
          entryId,
          personId: request.body.personId ?? null,
          value: request.body.value,
          correctionReason: request.body.correctionReason,
        }, evaluationInstant)
        status = 200
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, bodyOut)
      }, true)
      return reply.status(status).send(bodyOut)
    },
  })

  /* ── CMD-PRT-08 — create match record ── */
  registry.add({
    method: "POST",
    url: "/api/events/:eventId/match-record",
    security: { operationId: "CMD-PRT-08", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      params: Type.Object({ eventId: Uuid }),
      body: Type.Object({ idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })) }),
      response: { 200: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 422: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const eventId = String(request.params.eventId)
      const key = String(request.headers["idempotency-key"] ?? request.body?.idempotency_key ?? "")
      let status = 200
      let bodyOut: any = null
      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        let acquired: any = null
        if (key) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, { scopeKey: "CMD-PRT-08", commandId: "CMD-PRT-08", key, input: { eventId } }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; bodyOut = acquired.snapshot ?? {}; return }
        }
        bodyOut = await services.participation.createMatchRecord(tx, principal.personId, { matchId: eventId }, evaluationInstant)
        status = 200
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, bodyOut)
      }, true)
      return reply.status(status).send(bodyOut)
    },
  })

  /* ── CMD-PRT-09 — finalize match record (atomic with Event) ── */
  registry.add({
    method: "POST",
    url: "/api/events/:eventId/match-record/finalize",
    security: { operationId: "CMD-PRT-09", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      params: Type.Object({ eventId: Uuid }),
      body: Type.Object({
        resultType: ResultType,
        homeScore: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
        awayScore: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
        observations: Type.Optional(Type.Union([Type.String({ maxLength: 4000 }), Type.Null()])),
        idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })),
      }),
      response: { 200: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 422: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const eventId = String(request.params.eventId)
      const key = String(request.headers["idempotency-key"] ?? request.body?.idempotency_key ?? "")
      let status = 200
      let bodyOut: any = null
      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        let acquired: any = null
        if (key) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
            scopeKey: "CMD-PRT-09",
            commandId: "CMD-PRT-09",
            key,
            input: { eventId, resultType: request.body.resultType, homeScore: request.body.homeScore, awayScore: request.body.awayScore },
          }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; bodyOut = acquired.snapshot ?? {}; return }
        }
        bodyOut = await services.participation.finalizeMatchRecord(tx, principal.personId, {
          matchId: eventId,
          resultType: request.body.resultType,
          homeScore: request.body.homeScore ?? null,
          awayScore: request.body.awayScore ?? null,
          observations: request.body.observations ?? null,
        }, evaluationInstant)
        status = 200
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, bodyOut)
      }, true)
      return reply.status(status).send(bodyOut)
    },
  })

  /* ── CMD-PRT-10 — correct final match record ── */
  registry.add({
    method: "PATCH",
    url: "/api/events/:eventId/match-record/:recordId/correct",
    security: { operationId: "CMD-PRT-10", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      params: Type.Object({ eventId: Uuid, recordId: Uuid }),
      body: Type.Object({
        resultType: Type.Optional(ResultType),
        homeScore: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
        awayScore: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
        observations: Type.Optional(Type.Union([Type.String({ maxLength: 4000 }), Type.Null()])),
        correctionReason: Type.String({ minLength: 1, maxLength: 1000 }),
        idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })),
      }),
      response: { 200: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 422: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const eventId = String(request.params.eventId)
      const recordId = String(request.params.recordId)
      const key = String(request.headers["idempotency-key"] ?? request.body?.idempotency_key ?? "")
      let status = 200
      let bodyOut: any = null
      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        let acquired: any = null
        if (key) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
            scopeKey: "CMD-PRT-10",
            commandId: "CMD-PRT-10",
            key,
            input: { recordId, ...omitNull(request.body) },
          }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; bodyOut = acquired.snapshot ?? {}; return }
        }
        bodyOut = await services.participation.correctMatchRecord(tx, principal.personId, {
          matchRecordId: recordId,
          matchId: eventId,
          resultType: request.body.resultType,
          homeScore: request.body.homeScore,
          awayScore: request.body.awayScore,
          observations: request.body.observations,
          correctionReason: request.body.correctionReason,
        }, evaluationInstant)
        status = 200
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, bodyOut)
      }, true)
      return reply.status(status).send(bodyOut)
    },
  })

  /* ── CMD-PRT-11 — register player stats ── */
  registry.add({
    method: "POST",
    url: "/api/events/:eventId/match-record/:recordId/stats",
    security: { operationId: "CMD-PRT-11", kind: "command", auth: "required", csrf: "required", idempotency: "supported", cache: "no-store" },
    schema: {
      params: Type.Object({ eventId: Uuid, recordId: Uuid }),
      body: Type.Object({
        personId: Uuid,
        minutesPlayed: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
        goals: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
        assists: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
        yellowCards: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
        redCards: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
        mvp: Type.Optional(Type.Boolean()),
        idempotency_key: Type.Optional(Type.String({ minLength: 1, maxLength: 128 })),
      }),
      response: { 200: SilentResponse, 400: SilentResponse, 403: SilentResponse, 404: SilentResponse, 409: SilentResponse, 422: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const eventId = String(request.params.eventId)
      const recordId = String(request.params.recordId)
      const key = String(request.headers["idempotency-key"] ?? request.body?.idempotency_key ?? "")
      let status = 200
      let bodyOut: any = null
      await services.deps.runner.run("COMMAND_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        await services.principals.requireInTx(tx, request, evaluationInstant)
        let acquired: any = null
        if (key) {
          acquired = await services.deps.idempotencyCoordinator.acquire(tx, {
            scopeKey: "CMD-PRT-11",
            commandId: "CMD-PRT-11",
            key,
            input: { recordId, personId: request.body.personId, stats: omitNull({ minutesPlayed: request.body.minutesPlayed, goals: request.body.goals, assists: request.body.assists, yellowCards: request.body.yellowCards, redCards: request.body.redCards, mvp: request.body.mvp }) },
          }, evaluationInstant)
          if (!acquired.acquired) { status = acquired.status; bodyOut = acquired.snapshot ?? {}; return }
        }
        bodyOut = await services.participation.recordPlayerStats(tx, principal.personId, {
          matchRecordId: recordId,
          matchId: eventId,
          personId: request.body.personId,
          stats: {
            minutesPlayed: request.body.minutesPlayed,
            goals: request.body.goals,
            assists: request.body.assists,
            yellowCards: request.body.yellowCards,
            redCards: request.body.redCards,
            mvp: request.body.mvp,
          },
        }, evaluationInstant)
        status = 200
        if (acquired) await services.deps.idempotencyCoordinator.succeed(tx, acquired.id, 200, bodyOut)
      }, true)
      return reply.status(status).send(bodyOut)
    },
  })

  /* ── RC-16 — match record detail ── */
  registry.add({
    method: "GET",
    url: "/api/events/:eventId/match-record",
    security: { operationId: "RC-16", kind: "query", auth: "required", csrf: "none", idempotency: "forbidden", cache: "no-store" },
    schema: { params: Type.Object({ eventId: Uuid }), response: { 200: SilentResponse, 403: SilentResponse, 404: SilentResponse, 500: SilentResponse } },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request, new Date())
      const eventId = String(request.params.eventId)
      const detail = await services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) =>
        services.t04Reads.matchRecordDetail(tx, principal.personId, eventId, evaluationInstant))
      return reply.status(200).send(detail)
    },
  })
}
