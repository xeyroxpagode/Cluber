import type { RuntimeEnvironment } from "../config/load-config.js"

export function sessionCookie(environment: RuntimeEnvironment) {
  const production = environment === "production"
  return {
    name: production ? "__Host-gei_session" : "gei_session",
    options: { secure: production, httpOnly: true, sameSite: "strict" as const, path: "/" },
  }
}
