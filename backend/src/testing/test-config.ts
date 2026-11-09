import type { AppConfig } from "../config/load-config.js"

const TEST_DATABASE_URL = "postgresql://postgres:postgres@127.0.0.1:56322/gei_test"

export function testConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  const secret = Buffer.alloc(32, 7)
  if (!TEST_DATABASE_URL.includes("@127.0.0.1:56322/gei_test")) throw new Error("Unsafe test database target")
  return {
    environment: "test",
    host: "127.0.0.1",
    port: 0,
    publicOrigin: "http://localhost:8443",
    databaseUrl: TEST_DATABASE_URL,
    databaseRole: "gei_backend",
    secrets: { authCodePepper: secret, emailChangeCodePepper: secret, csrfHmacSecret: secret, rateLimitKeyPepper: secret },
    metricsEnabled: false,
    realtimeEnabled: false,
    clubTimeZone: "America/Argentina/Buenos_Aires",
    ...overrides,
  }
}
