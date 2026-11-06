import { withBrowser, setViewport, waitStable, sleep, makeEvaluator, capturePng } from "./harness/cdp.mjs"
import { writeFileSync, readFileSync, readdirSync } from "node:fs"
import { createHash } from "node:crypto"
import path from "node:path"

function findFile(dir, name) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      const hit = findFile(full, name)
      if (hit) return hit
    } else if (entry.name === name) {
      return full
    }
  }
  return null
}

const BASE = "http://localhost:8443"
const ATLAS = "GEI_FULL_VISUAL_ATLAS_V2"
const SURFACE = "GBL_SHELL_003_BYPASS_LINK_FOCUSED"
const DIR = path.join(ATLAS, "01_GLOBAL", "Shell", SURFACE)
const ACTOR = "coach"

const VERIFY = `
(() => {
  const el = document.querySelector('a[href="#contenido"]');
  if (!el) return { present: false };
  el.focus();
  const s = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return {
    present: true,
    activeIsEl: document.activeElement === el,
    matchesFocus: el.matches(':focus'),
    position: s.position,
    width: s.width,
    height: s.height,
    overflow: s.overflow,
    clipPath: s.clipPath,
    background: s.backgroundColor,
    color: s.color,
    zIndex: s.zIndex,
    left: s.left,
    top: s.top,
    rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
    visible: r.width > 4 && r.height > 4,
  };
})()
`

const results = []
await withBrowser(async ({ send, sleep: s }) => {
  const ev = makeEvaluator(send)

  for (const vp of ["390", "1440"]) {
    // Focus emulation: forces :focus to match in headless (Chrome ignores it otherwise).
    await send("Emulation.setFocusEmulationEnabled", { enabled: true })
    await setViewport(send, vp)

    await send("Page.navigate", { url: "about:blank" })
    await sleep(120)
    await send("Page.navigate", { url: `${BASE}/home?demo=${ACTOR}` })
    await sleep(300)
    await waitStable(send)
    await sleep(250)

    // Bring the page to front so the window owns focus.
    await send("Page.bringToFront").catch(() => {})

    const state = await ev(VERIFY)
    const dims = vp === "390" ? { w: 390, h: 844 } : { w: 1440, h: 900 }
    const file = path.join(DIR, `${SURFACE}__${ACTOR.toUpperCase()}__${dims.w}x${dims.h}.png`)
    await capturePng(send, file)

    // Reference: the normal (unfocused) /home capture for the same viewport.
    const refName = `HOME_001_DEFAULT_COACH__${ACTOR.toUpperCase()}__${dims.w}x${dims.h}.png`
    const ref = findFile(path.join(ATLAS, "03_HOME"), refName)
    const newSha = createHash("sha256").update(readFileSync(file)).digest("hex")
    const refSha = ref ? createHash("sha256").update(readFileSync(ref)).digest("hex") : null

    results.push({
      viewport: vp,
      file,
      state,
      new_sha256: newSha,
      reference_unfocused_home_sha256: refSha,
      distinct_from_unfocused: newSha !== refSha,
    })
    console.log(
      `${vp} :: matchesFocus=${state.matchesFocus} visible=${state.visible} rect=${JSON.stringify(state.rect)} bg=${state.background} distinct=${newSha !== refSha}`,
    )
  }
})

writeFileSync(
  path.join(ATLAS, "12_QA", "BYPASS_LINK_RECAPTURE.json"),
  JSON.stringify(results, null, 2),
  "utf8",
)
console.log("\nRecapture evidence written to 12_QA/BYPASS_LINK_RECAPTURE.json")
