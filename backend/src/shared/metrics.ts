import { Counter, Gauge, Histogram, Registry, collectDefaultMetrics } from "prom-client"

export class Metrics {
  readonly registry = new Registry()
  readonly requests = new Counter({ name: "gei_http_requests_total", help: "HTTP requests", labelNames: ["operation", "status"], registers: [this.registry] })
  readonly duration = new Histogram({ name: "gei_http_request_duration_seconds", help: "HTTP latency", labelNames: ["operation"], registers: [this.registry] })
  readonly outboxFailures = new Counter({ name: "gei_outbox_failures_total", help: "Outbox failures", registers: [this.registry] })
  readonly sseConnections = new Gauge({ name: "gei_sse_connections", help: "Active SSE connections", registers: [this.registry] })
  constructor(enabled = true) { if (enabled) collectDefaultMetrics({ register: this.registry, prefix: "gei_" }) }
}
