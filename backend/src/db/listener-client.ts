import pg from "pg"

export class ListenerClient {
  private client: pg.Client | undefined
  private stopping = false
  private healthy = false

  constructor(
    private readonly connectionString: string,
    private readonly databaseRole: string,
    private readonly onNotification: (channel: string, payload: string) => void,
  ) {}

  isHealthy(): boolean { return this.healthy }

  async start(): Promise<void> {
    this.stopping = false
    await this.connect()
  }

  private async connect(): Promise<void> {
    const client = new pg.Client({
      connectionString: this.connectionString,
      application_name: "gei-listener",
      options: `-c role=${this.databaseRole} -c timezone=UTC`,
    })
    client.on("notification", (message) => this.onNotification(message.channel, message.payload ?? ""))
    client.on("error", () => { this.healthy = false; if (!this.stopping) void this.reconnect() })
    await client.connect()
    await client.query("listen gei_outbox_wakeup")
    await client.query("listen gei_realtime")
    this.client = client
    this.healthy = true
  }

  private async reconnect(): Promise<void> {
    for (const delay of [250, 500, 1_000, 2_000, 5_000]) {
      if (this.stopping) return
      await new Promise((resolve) => setTimeout(resolve, delay))
      try { await this.connect(); return } catch { this.healthy = false }
    }
  }

  async close(): Promise<void> {
    this.stopping = true
    this.healthy = false
    const client = this.client
    this.client = undefined
    if (client) { await client.query("unlisten *").catch(() => undefined); await client.end().catch(() => undefined) }
  }
}
