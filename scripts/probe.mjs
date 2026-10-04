/**
 * Medición real de viewport vía Chrome DevTools Protocol (sin dependencias).
 * Uso: node scripts/probe.mjs <ruta> [ancho] [demo]
 * Imprime scrollWidth del documento y los elementos que desbordan.
 */
import { spawn } from "node:child_process"
import { setTimeout as sleep } from "node:timers/promises"

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const BASE = process.env.GEI_BASE ?? "http://localhost:4173"
const route = process.argv[2] ?? "/home"
const width = Number(process.argv[3] ?? 390)
const demo = process.argv[4] ?? "coach"
const PORT = 9333

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    `--remote-debugging-port=${PORT}`,
    "--user-data-dir=" + process.env.TEMP + "\\gei-probe",
    "about:blank",
  ],
  { stdio: "ignore" },
)

process.on("exit", () => chrome.kill())

async function target() {
  for (let i = 0; i < 40; i++) {
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
  throw new Error("No se pudo conectar con Chrome")
}

const wsUrl = await target()
const ws = new WebSocket(wsUrl)
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

await send("Emulation.setDeviceMetricsOverride", {
  width,
  height: 900,
  deviceScaleFactor: 1,
  mobile: width < 768,
})
await send("Page.enable")
await send("Page.navigate", { url: `${BASE}${route}?demo=${demo}` })
await sleep(2200)

const expression = `(() => {
  const doc = document.documentElement
  const overflow = []
  document.querySelectorAll('*').forEach((node) => {
    const rect = node.getBoundingClientRect()
    if (rect.right > ${width} + 1 && rect.width > 0) {
      const style = getComputedStyle(node)
      overflow.push({
        tag: node.tagName.toLowerCase(),
        cls: (node.className || '').toString().slice(0, 90),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
        position: style.position,
      })
    }
  })
  return JSON.stringify({
    viewport: window.innerWidth,
    scrollWidth: doc.scrollWidth,
    clientWidth: doc.clientWidth,
    offenders: overflow.slice(0, 12),
  })
})()`

const result = await send("Runtime.evaluate", {
  expression,
  returnByValue: true,
})
console.log(result.result?.result?.value ?? JSON.stringify(result))
ws.close()
chrome.kill()