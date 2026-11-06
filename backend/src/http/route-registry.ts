import type { FastifyInstance, FastifyReply, FastifyRequest, HTTPMethods, RouteOptions } from "fastify"

export interface RouteSecurity {
  operationId: string
  kind: "command" | "query" | "infra"
  auth: "public" | "optional" | "required"
  csrf: "none" | "required"
  idempotency: "none" | "supported" | "required" | "forbidden"
  rateLimitPolicy?: string
  cache: "no-store" | "private" | "public"
}

declare module "fastify" {
  interface FastifyContextConfig { security?: RouteSecurity }
}

export class RouteRegistry {
  private readonly routes: Array<{ method: HTTPMethods; url: string; security: RouteSecurity; options: RouteOptions }> = []

  add(input: {
    method: HTTPMethods
    url: string
    security: RouteSecurity
    schema: RouteOptions["schema"]
    handler: (request: FastifyRequest, reply: FastifyReply) => unknown | Promise<unknown>
  }): void {
    this.routes.push({ method: input.method, url: input.url, security: input.security, options: {
      method: input.method, url: input.url, schema: input.schema, config: { security: input.security }, handler: input.handler,
    } })
  }

  audit(): void {
    const ids = new Set<string>()
    for (const route of this.routes) {
      if (ids.has(route.security.operationId)) throw new Error(`Duplicate operationId: ${route.security.operationId}`)
      ids.add(route.security.operationId)
      const safe = ["GET", "HEAD", "OPTIONS"].includes(route.method)
      if (!safe && route.security.auth === "required" && route.security.csrf !== "required") throw new Error(`Unsafe authenticated route without CSRF: ${route.security.operationId}`)
      if (route.security.kind === "command" && safe) throw new Error(`State-changing command cannot use safe method: ${route.security.operationId}`)
      if (!route.options.schema?.response) throw new Error(`Route response schema required: ${route.security.operationId}`)
    }
  }

  register(app: FastifyInstance): void { this.audit(); for (const route of this.routes) app.route(route.options) }
}
