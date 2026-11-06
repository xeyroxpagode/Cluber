import type { OutboxPayload } from "./outbox.js"

type Client = { personId: string; send: (event: OutboxPayload) => boolean; close: () => void }

export class RealtimeHub {
  private readonly clients = new Set<Client>()
  register(client: Client): () => void { this.clients.add(client); return () => this.clients.delete(client) }
  publish(event: OutboxPayload): void {
    const recipients = new Set(event.recipients)
    for (const client of this.clients) if (recipients.has(client.personId) && !client.send(event)) { client.close(); this.clients.delete(client) }
  }
  closeAll(): void { for (const client of this.clients) client.close(); this.clients.clear() }
  get size(): number { return this.clients.size }
}
