export type RuntimeEnvironment = "development" | "test" | "staging" | "production"

export interface AppConfig {
  readonly environment: RuntimeEnvironment
  readonly host: string
  readonly port: number
  readonly publicOrigin: string
  readonly databaseUrl: string
  readonly databaseRole: string
  readonly secrets: {
    readonly authCodePepper: Buffer
    readonly emailChangeCodePepper: Buffer
    readonly csrfHmacSecret: Buffer
    readonly rateLimitKeyPepper: Buffer
  }
  readonly metricsEnabled: boolean
  readonly realtimeEnabled: boolean
  readonly clubTimeZone: string
}

function required(env: NodeJS.ProcessEnv, key: string): string {
  const value = env[key]
  if (!value) throw new Error(`Missing required configuration: ${key}`)
  return value
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback
  if (value === "true") return true
  if (value === "false") return false
  throw new Error(`Invalid boolean configuration: ${value}`)
}

function parseClubTimeZone(value: string | undefined): string {
  const timeZone = value ?? "America/Argentina/Buenos_Aires"
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format(new Date())
    return timeZone
  } catch {
    throw new Error("CLUB_TIME_ZONE must be a valid IANA time zone")
  }
}

function parseSecret(env: NodeJS.ProcessEnv, key: string): Buffer {
  const raw = required(env, key)
  const decoded = Buffer.from(raw, "base64")
  if (decoded.length < 32 || decoded.toString("base64").replace(/=+$/, "") !== raw.replace(/=+$/, "")) {
    throw new Error(`${key} must be valid base64 encoding at least 32 random bytes`)
  }
  return decoded
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const environment = (env.NODE_ENV ?? "development") as RuntimeEnvironment
  if (!["development", "test", "staging", "production"].includes(environment)) {
    throw new Error(`Invalid NODE_ENV: ${environment}`)
  }
  const port = Number(env.BACKEND_PORT ?? 3001)
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("BACKEND_PORT must be a valid port")
  const publicOrigin = required(env, "PUBLIC_ORIGIN")
  const origin = new URL(publicOrigin)
  if (origin.origin !== publicOrigin || (environment === "production" && origin.protocol !== "https:")) {
    throw new Error("PUBLIC_ORIGIN must be an exact origin and production must use HTTPS")
  }
  const databaseRole = env.DATABASE_ROLE ?? "gei_backend"
  if (!/^gei_backend$/.test(databaseRole)) throw new Error("DATABASE_ROLE must be gei_backend")

  return Object.freeze({
    environment,
    host: env.BACKEND_HOST ?? "127.0.0.1",
    port,
    publicOrigin,
    databaseUrl: required(env, "DATABASE_URL"),
    databaseRole,
    secrets: Object.freeze({
      authCodePepper: parseSecret(env, "AUTH_CODE_PEPPER"),
      emailChangeCodePepper: parseSecret(env, "EMAIL_CHANGE_CODE_PEPPER"),
      csrfHmacSecret: parseSecret(env, "CSRF_HMAC_SECRET"),
      rateLimitKeyPepper: parseSecret(env, "RATE_LIMIT_KEY_PEPPER"),
    }),
    metricsEnabled: parseBoolean(env.METRICS_ENABLED, false),
    realtimeEnabled: parseBoolean(env.REALTIME_ENABLED, true),
    clubTimeZone: parseClubTimeZone(env.CLUB_TIME_ZONE),
  })
}
