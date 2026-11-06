import { AsyncLocalStorage } from "node:async_hooks"

export interface RequestContext { traceId: string; requestId: string; operationId: string; startedAt: number }
export const requestContext = new AsyncLocalStorage<RequestContext>()
