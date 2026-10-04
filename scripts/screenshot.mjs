/**
 * Evidencia runtime honesta a 1440 / 768 / 390 reales.
 * Usa Chrome DevTools Protocol con Emulation.setDeviceMetricsOverride para
 * que el viewport CSS sea exactamente el ancho pedido (--window-size no lo
 * garantiza y produce capturas recortadas).
 *
 * Uso: node scripts/screenshot.mjs [carpeta]
 */
import { spawn } from "node:child_process"
import { mkdirSync, writeFileSync } from "node:fs"
import { setTimeout as sleep } from "node:timers/promises"
import path from "node:path"

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const BASE = process.env.GEI_BASE ?? "http://localhost:4173"
const OUT = process.argv[2] ?? "evidence"
const PORT = Number(process.env.GEI_CDP_PORT ?? 9334)

const VIEWPORTS = [
  { name: "1440", width: 1440, height: 1000 },
  { name: "768", width: 768, height: 1024 },
  { name: "390", width: 390, height: 844 },
]

const ROUTES = [
  ["home", "/home"],
  ["calendar", "/calendar"],
  ["event", "/events/match-cuba"],
  ["event-cancelled", "/events/training-cancelado"],
  ["selection", "/events/match-cuba/selection"],
  ["attendance", "/events/match-lomas/attendance"],
  ["match-record", "/events/match-lomas/match-record"],
  ["profile", "/more/profile"],
  ["communication", "/communication"],
  ["person-admin", "/management/people/p2"],
  ["competitions", "/management/competitions/ahba"],
  ["audit", "/audit"],
  ["reports", "/reports/attendance"],
  ["people", "/management/people"],
]

const ROLES = [
  { demo: "coach", suffix: "" },
  { demo: "player", suffix: "-player" },
  { demo: "guardian", suffix: "-guardian" },
  { demo: "admin", suffix: "-admin" },
]

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    `--remote-debugging-port=${PORT}`,
    "--user-data-dir=" + process.env.TEMP + "\\gei-shot",
    "about:blank",
  ],
  { stdio: "ignore" },
)
process.on("exit", () => chrome.kill())

async function firstTarget() {
  for (let i = 0; i < 60; i++) {
    try {
      const list = await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) =>
        r.json(),
      )
      const page = list.find((item) => item.type === "page")
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl
    } catch {
      /* retry */
    }
    await sleep(250)
  }
  throw new Error("No se pudo conectar con Chrome por CDP")
}

const ws = new WebSocket(await firstTarget())
let id = 0
const pending = new Map()
ws.addEventListener("message", (event) => {
  const message = JSON.parse(event.data)
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message)
    pending.delete(message.id)
  }
})
await new Promise((resolve) => ws.addEventListener("open", resolve))

function send(method, params = {}) {
  const messageId = ++id
  ws.send(JSON.stringify({ id: messageId, method, params }))
  return new Promise((resolve) => pending.set(messageId, resolve))
}

await send("Page.enable")
mkdirSync(path.resolve(OUT), { recursive: true })

const only = process.env.GEI_ONLY
const onlyWidth = process.env.GEI_WIDTH
let captured = 0

for (const viewport of VIEWPORTS) {
  if (onlyWidth && viewport.name !== onlyWidth) continue
  await send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.width < 1024,
  })
  for (const [slug, target] of ROUTES) {
    if (only && !slug.includes(only)) continue
    for (const role of ROLES) {
      if (viewport.name !== "1440" && !["coach", "player"].includes(role.demo)) continue
      if (slug === "person-admin" && role.demo !== "admin") continue
      if (slug === "competitions" && !["admin", "subcommittee"].includes(role.demo))
        continue
      if (slug === "people" && role.demo !== "admin") continue
      await send("Page.navigate", { url: `${BASE}${target}?demo=${role.demo}` })
      await sleep(900)
      const overflow = await send("Runtime.evaluate", {
        expression: `JSON.stringify({
          scrollWidth: document.documentElement.scrollWidth,
          viewport: window.innerWidth
        })`,
        returnByValue: true,
      })
      const measured = JSON.parse(
        overflow.result?.result?.value ?? '{"scrollWidth":0,"viewport":0}',
      )
      const shot = await send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: false,
      })
      const file = path.resolve(
        OUT,
        `${slug}${role.suffix}-${viewport.name}.png`,
      )
      writeFileSync(file, Buffer.from(shot.result.data, "base64"))
      captured++
      const honest =
        measured.scrollWidth <= measured.viewport + 1 ? "ok" : "OVERFLOW"
      console.log(
        `${honest} ${path.basename(file)} (${measured.viewport}px, scroll ${measured.scrollWidth}px)`,
      )
    }
  }
}

ws.close()
chrome.kill()
console.log(`Capturadas ${captured} pantallas en ${OUT}.`)