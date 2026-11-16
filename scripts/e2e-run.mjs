import { spawn } from "node:child_process"
import { setTimeout as delay } from "node:timers/promises"
import { createConnection } from "node:net"

/**
 * Comando E2E reproducible.
 *
 * Levanta el stack completo contra la instancia local de Supabase, aplica las
 * migraciones, restaura la semilla de usuarios reales y corre Playwright. Sin esto,
 * la corrida depende de que el origen (PUBLIC_ORIGIN) coincida con el puerto del
 * frontend y de que la base tenga la semilla: dos fuentes históricas de falsos
 * negativos.
 *
 *   node scripts/e2e-run.mjs              # reconstruye la base local y corre todo
 *   node scripts/e2e-run.mjs --no-reset   # conserva los datos y sólo corre las pruebas
 *   node scripts/e2e-run.mjs tests/e2e/t04-journeys.spec.ts
 */
const args = process.argv.slice(2)
const shouldReset = !args.includes("--no-reset")
const testArgs = args.filter((arg) => !arg.startsWith("--"))

const isWindows = process.platform === "win32"
const pnpm = isWindows ? "pnpm.cmd" : "pnpm"
const children = []

function run(command, commandArgs, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, {
      stdio: "inherit",
      shell: isWindows,
      env: { ...process.env, ...(options.env ?? {}) },
      cwd: options.cwd ?? process.cwd(),
    })
    children.push(child)
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${command} ${commandArgs.join(" ")} exited with ${code}`))))
    child.on("error", reject)
  })
}

async function waitFor(url, label, timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {
      /* todavía no levanta */
    }
    await delay(500)
  }
  throw new Error(`${label} no respondió en ${url}`)
}

/**
 * Libera el puerto del backend. El E2E necesita su propio backend con
 * PUBLIC_ORIGIN apuntando al puerto del frontend de pruebas: si queda el backend de
 * desarrollo, la corrida fallaría por origen no permitido.
 */
async function freePort(port) {
  const inUse = await new Promise((resolve) => {
    const socket = createConnection({ port, host: "127.0.0.1" })
    socket.once("connect", () => {
      socket.destroy()
      resolve(true)
    })
    socket.once("error", () => resolve(false))
    socket.setTimeout(1000, () => {
      socket.destroy()
      resolve(false)
    })
  })
  if (!inUse) return
  console.log(`[e2e] liberando el puerto ${port} (backend de desarrollo)`)
  const killer = spawn("powershell", ["-NoProfile", "-Command", `$c = Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue; if ($c) { $c | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue } }`], {
    stdio: "ignore",
    shell: isWindows,
  })
  await new Promise((resolve) => killer.on("exit", resolve))
  await delay(1500)
}

function stopAll() {
  for (const child of children) {
    if (!child.killed) {
      try {
        child.kill(isWindows ? undefined : "SIGTERM")
      } catch {
        /* best effort */
      }
    }
  }
}

process.on("exit", stopAll)
process.on("SIGINT", () => {
  stopAll()
  process.exit(130)
})

try {
  if (shouldReset) {
    console.log("[e2e] reconstruyendo la base local (Supabase local, instancia descartable)")
    await run(pnpm, ["db:reset"])
    console.log("[e2e] restaurando la semilla de usuarios reales")
    await run(process.execPath, ["scripts/e2e-seed-real-users.mjs"])
  }

  console.log("[e2e] levantando el backend con PUBLIC_ORIGIN=http://localhost:8444")
  await freePort(3001)
  const backend = spawn(pnpm, ["dev:backend"], {
    stdio: "inherit",
    shell: isWindows,
    env: { ...process.env, PUBLIC_ORIGIN: "http://localhost:8444" },
    detached: false,
  })
  children.push(backend)

  console.log("[e2e] levantando el frontend en el puerto 8444")
  const frontend = spawn(pnpm, ["dev"], {
    stdio: "inherit",
    shell: isWindows,
    env: { ...process.env, PORT: "8444" },
    detached: false,
  })
  children.push(frontend)

  await waitFor("http://127.0.0.1:3001/internal/ready", "el backend")
  await waitFor("http://127.0.0.1:8444", "el frontend")
  console.log("[e2e] stack listo; se corre Playwright")

  await run(pnpm, ["exec", "playwright", "test", ...testArgs])
  console.log("[e2e] terminé sin errores")
} catch (error) {
  console.error("[e2e] fallo:", error instanceof Error ? error.message : error)
  process.exitCode = 1
} finally {
  stopAll()
}
