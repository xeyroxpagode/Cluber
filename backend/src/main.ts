import { loadConfig } from "./config/load-config.js"
import { buildRuntime } from "./bootstrap/build-runtime.js"

const config = loadConfig()
const runtime = await buildRuntime(config)
await runtime.app.listen({ host: config.host, port: config.port })

let closing = false
async function shutdown(signal: string) {
  if (closing) return
  closing = true
  runtime.app.log.info({ signal }, "graceful shutdown started")
  const deadline = setTimeout(() => process.exit(1), 15_000)
  deadline.unref()
  await runtime.close()
  clearTimeout(deadline)
  process.exit(0)
}

process.on("SIGTERM", () => void shutdown("SIGTERM"))
process.on("SIGINT", () => void shutdown("SIGINT"))
