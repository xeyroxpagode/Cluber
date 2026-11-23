import type { FastifyInstance } from "fastify"
import { Type } from "@sinclair/typebox"
import type { ProductServices } from "../product-services.js"
import type { T06Scope } from "../read/t06-scope.js"
import { SearchCursor } from "../read/search-cursor.js"
import { normalizeQuery } from "../read/search-ranking.js"

const SilentResponse = Type.Any()
const Uuid = Type.String({ format: "uuid" })
const SEARCH_TYPES = ["person", "team", "division", "line", "event", "announcement", "conversation"] as const

type RouteInput = { app: FastifyInstance; registry: any; services: ProductServices }

const QUERY_SECURITY = {
  kind: "query" as const,
  auth: "required" as const,
  csrf: "none" as const,
  idempotency: "forbidden" as const,
  cache: "no-store" as const,
}

/**
 * Cinco operationIds aditivos: RC-01, RC-10, RC-11, RC-21, RC-22.
 * Un solo router (RouteRegistry), un solo sistema de autoridad. Sin DI paralelo.
 */
export function addT06Routes({ registry, services }: RouteInput): void {
  const scopeFrom = async (request: any, principal: any, tx: any, evaluationInstant: Date): Promise<T06Scope> => {
    await services.principals.requireInTx(tx, request, evaluationInstant)
    const snapshot = await services.authority.snapshot(tx, principal.personId, evaluationInstant)
    return { ...snapshot, personId: principal.personId, accountId: principal.accountId }
  }

  /* ── RC-01 — HomeForActor ────────────────────────────────────────────── */
  registry.add({
    method: "GET",
    url: "/api/home",
    security: { operationId: "RC-01", ...QUERY_SECURITY },
    schema: { response: { 200: SilentResponse, 401: SilentResponse, 403: SilentResponse, 500: SilentResponse } },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request)
      const result = await services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        const scope = await scopeFrom(request, principal, tx, evaluationInstant)
        return services.homeReads.compose(tx, scope, evaluationInstant, { clubTimeZone: services.deps.config.clubTimeZone })
      })
      return reply.status(200).send(result)
    },
  })

  /* ── RC-22 — AttentionList ───────────────────────────────────────────── */
  registry.add({
    method: "GET",
    url: "/api/attention",
    security: { operationId: "RC-22", ...QUERY_SECURITY },
    schema: {
      querystring: Type.Object({ limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 200 })) }),
      response: { 200: SilentResponse, 401: SilentResponse, 403: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request)
      const result = await services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        const scope = await scopeFrom(request, principal, tx, evaluationInstant)
        return services.attentionReads.list(tx, scope, evaluationInstant, { limit: request.query?.limit })
      })
      return reply.status(200).send(result)
    },
  })

  /* ── RC-21 — Search (cursor firmado TC-01) ───────────────────────────── */
  registry.add({
    method: "GET",
    url: "/api/search",
    security: { operationId: "RC-21", ...QUERY_SECURITY },
    schema: {
      querystring: Type.Object({
        q: Type.Optional(Type.String({ maxLength: 200 })),
        type: Type.Optional(Type.Union(SEARCH_TYPES.map((value) => Type.Literal(value)))),
        cursor: Type.Optional(Type.String({ maxLength: 4096 })),
        limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
      }),
      response: { 200: SilentResponse, 400: SilentResponse, 401: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request)
      const result = await services.deps.runner.run("READ_STANDARD", principal.sessionId, async ({ tx, evaluationInstant }) => {
        const scope = await scopeFrom(request, principal, tx, evaluationInstant)
        const normalizedQuery = normalizeQuery(request.query?.q ?? "")
        const hashes = SearchCursor.hashes({
          accountId: principal.accountId,
          personId: principal.personId,
          roles: scope.roles,
          coachTeamIds: scope.coachTeamIds,
          captainTeamIds: scope.captainTeamIds,
          eventScopeIds: scope.eventScopeIds,
          isSubcommittee: scope.isSubcommittee,
        })
        return services.searchReads.search(tx, scope, {
          q: request.query?.q,
          type: request.query?.type,
          cursor: request.query?.cursor,
          limit: request.query?.limit,
          identity: {
            accountId: principal.accountId,
            personId: principal.personId,
            scopeHash: hashes.scopeHash,
            ah: hashes.ah,
            sh: hashes.sh,
          },
        })
      })
      return reply.status(200).send(result)
    },
  })

  /* ── RC-10 — AttendanceReport ────────────────────────────────────────── */
  registry.add({
    method: "GET",
    url: "/api/reports/attendance",
    security: { operationId: "RC-10", ...QUERY_SECURITY },
    schema: {
      querystring: Type.Object({
        seasonId: Type.Optional(Uuid), teamId: Type.Optional(Uuid), eventId: Type.Optional(Uuid),
        cursor: Type.Optional(Type.String({ maxLength: 4096 })), limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 200 })),
      }),
      response: { 200: SilentResponse, 400: SilentResponse, 401: SilentResponse, 403: SilentResponse, 422: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request)
      const result = await services.deps.runner.run("READ_REPORT", principal.sessionId, async ({ tx, evaluationInstant }) => {
        const scope = await scopeFrom(request, principal, tx, evaluationInstant)
        return services.reportReads.attendance(tx, scope, {
          seasonId: request.query?.seasonId, teamId: request.query?.teamId, eventId: request.query?.eventId,
          cursor: request.query?.cursor, limit: request.query?.limit,
        })
      })
      return reply.status(200).send(result)
    },
  })

  /* ── RC-11 — PerformanceReport ───────────────────────────────────────── */
  registry.add({
    method: "GET",
    url: "/api/reports/performance",
    security: { operationId: "RC-11", ...QUERY_SECURITY },
    schema: {
      querystring: Type.Object({
        seasonId: Type.Optional(Uuid), teamId: Type.Optional(Uuid),
        cursor: Type.Optional(Type.String({ maxLength: 4096 })), limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 200 })),
      }),
      response: { 200: SilentResponse, 400: SilentResponse, 401: SilentResponse, 403: SilentResponse, 422: SilentResponse, 500: SilentResponse },
    },
    async handler(request: any, reply: any) {
      const principal = await services.principals.require(request)
      const result = await services.deps.runner.run("READ_REPORT", principal.sessionId, async ({ tx, evaluationInstant }) => {
        const scope = await scopeFrom(request, principal, tx, evaluationInstant)
        return services.reportReads.performance(tx, scope, {
          seasonId: request.query?.seasonId, teamId: request.query?.teamId,
          cursor: request.query?.cursor, limit: request.query?.limit,
        })
      })
      return reply.status(200).send(result)
    },
  })

  /* ── operationId audit (T06-TASK-006): fail fast on duplicate/missing schema ── */
  registry.audit()
}
