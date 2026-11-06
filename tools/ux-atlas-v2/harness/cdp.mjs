/**
 * GEI CURRENT UX ATLAS — driver CDP mínimo (sin dependencias).
 *
 * Abre Chrome headless real, aplica Emulation.setDeviceMetricsOverride para
 * que el viewport CSS sea exactamente 390x844 o 1440x900, navega, ejecuta una
 * secuencia de pasos de interacción, y devuelve screenshot + sonda de
 * geometría DOM real.
 *
 * Uso programático:
 *   import { withBrowser, capture } from "./cdp.mjs"
 */

import { spawn } from "node:child_process"
import { mkdirSync, writeFileSync } from "node:fs"
import { setTimeout as sleep } from "node:timers/promises"
import path from "node:path"

export { sleep }

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

export const VIEWPORTS = {
  390: { width: 390, height: 844, mobile: true },
  1440: { width: 1440, height: 900, mobile: false },
}

export async function withBrowser(fn, { port = 9345, onEvent } = {}) {
  const chrome = spawn(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--disable-lcd-text",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${path.join(process.env.TEMP, "gei-atlas-browser")}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  )
  process.on("exit", () => chrome.kill())
  try {
    const wsUrl = await firstTarget(port)
    const ws = new WebSocket(wsUrl)
    let id = 0
    const pending = new Map()
    ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data)
      if (message.id && pending.has(message.id)) {
        pending.get(message.id)(message)
        pending.delete(message.id)
      } else if (message.method) {
        if (message.method === "Page.screencastFrame" && message.params?.sessionId) {
          const ackId = ++id
          ws.send(
            JSON.stringify({
              id: ackId,
              method: "Page.screencastFrameAck",
              params: { sessionId: message.params.sessionId },
            }),
          )
        }
        if (onEvent) onEvent(message)
      }
    })
    await new Promise((resolve) => ws.addEventListener("open", resolve))
    const send = (method, params = {}) => {
      const messageId = ++id
      ws.send(JSON.stringify({ id: messageId, method, params }))
      return new Promise((resolve) => pending.set(messageId, resolve))
    }
    await send("Page.enable")
    await send("Runtime.enable")
    await send("Network.enable")
    await fn({ send, sleep })
    ws.close()
  } finally {
    chrome.kill()
  }
}

async function firstTarget(port) {
  for (let i = 0; i < 80; i++) {
    try {
      const list = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) =>
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

/* ── utilidades de página ───────────────────────────────────── */

export function makeEvaluator(send) {
  return async function evaluate(expression) {
    const result = await send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    })
    if (result.result?.exceptionDetails) {
      throw new Error(
        `JS error: ${result.result.exceptionDetails.text} ${result.result.exceptionDetails.exception?.description ?? ""}`,
      )
    }
    return result.result?.result?.value
  }
}

export async function setViewport(send, viewportName) {
  const vp = VIEWPORTS[viewportName]
  if (!vp) throw new Error(`viewport desconocido: ${viewportName}`)
  await send("Emulation.setDeviceMetricsOverride", {
    width: vp.width,
    height: vp.height,
    deviceScaleFactor: 1,
    mobile: vp.mobile,
    screenWidth: vp.width,
    screenHeight: vp.height,
  })
  await send("Emulation.setTouchEmulationEnabled", {
    enabled: vp.mobile,
    maxTouchPoints: vp.mobile ? 5 : 0,
  })
  return vp
}

/**
 * Espera a que React haya pintado y a que no queden timers de layout.
 * No es un "network idle" estricto: en una SPA con datos en memoria la red
 * no participates; lo que importa es que el árbol DOM esté estable.
 */
export async function waitStable(send, { attempts = 40, quiet = 3 } = {}) {
  let stable = 0
  let last = ""
  for (let i = 0; i < attempts; i++) {
    await sleep(180)
    const snapshot = await evaluateRaw(
      send,
      `(() => {
        const root = document.getElementById('root');
        if (!root || root.children.length === 0) return 'EMPTY';
        const r = root.innerHTML.length;
        return r + '|' + (document.body ? document.body.scrollHeight : 0) + '|' + (window.scrollY);
      })()`,
    )
    if (snapshot === "EMPTY") {
      stable = 0
      last = snapshot
      continue
    }
    if (snapshot === last) stable++
    else stable = 0
    last = snapshot
    if (stable >= quiet) return
  }
}

async function evaluateRaw(send, expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  })
  return result.result?.result?.value
}

/* ── pasos de interacción ────────────────────────────────────── */

const CLICK_BY_TEXT = `
(() => {
  const needle = __TEXT__.toLowerCase();
  const nodes = Array.from(document.querySelectorAll('button, a, [role="button"], [role="tab"], [role="menuitem"], label, summary, [role="radio"]'));
  const hits = nodes.filter(n => (n.innerText || n.textContent || '').trim().toLowerCase().includes(needle));
  if (!hits.length) return 'NOT_FOUND';
  const visible = hits.filter(n => { const r = n.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
  const target = (visible[0] || hits[0]);
  target.scrollIntoView({block:'center'});
  target.click();
  return 'OK:' + (target.innerText || target.textContent || '').trim().slice(0, 60);
})()
`

const CLICK_BY_TEXT_EXACT = `
(() => {
  const needle = __TEXT__.trim().toLowerCase();
  const nodes = Array.from(document.querySelectorAll('button, a, [role="button"], [role="tab"], [role="menuitem"], label, summary, [role="radio"]'));
  const hits = nodes.filter(n => (n.innerText || n.textContent || '').trim().toLowerCase() === needle);
  if (!hits.length) return 'NOT_FOUND';
  const visible = hits.filter(n => { const r = n.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
  const target = (visible[0] || hits[0]);
  target.scrollIntoView({block:'center'});
  target.click();
  return 'OK:' + (target.innerText || target.textContent || '').trim().slice(0, 60);
})()
`

const CLICK_BY_SELECTOR = `
(() => {
  const el = document.querySelector(__SEL__);
  if (!el) return 'NOT_FOUND';
  el.scrollIntoView({block:'center'});
  el.click();
  return 'OK:' + (el.innerText || el.textContent || '').trim().slice(0, 60);
})()
`

export async function runStep(send, step) {
  const ev = makeEvaluator(send)
  if (step.wait) {
    await sleep(step.wait)
    return { step: "wait", ok: true }
  }
  if (step.clickText) {
    const out = await ev(
      CLICK_BY_TEXT.replace("__TEXT__", JSON.stringify(step.clickText)),
    )
    return { step: "clickText", target: step.clickText, result: out }
  }
  if (step.clickTextExact) {
    const out = await ev(
      CLICK_BY_TEXT_EXACT.replace("__TEXT__", JSON.stringify(step.clickTextExact)),
    )
    return { step: "clickTextExact", target: step.clickTextExact, result: out }
  }
  if (step.click) {
    const out = await ev(
      CLICK_BY_SELECTOR.replace("__SEL__", JSON.stringify(step.click)),
    )
    return { step: "click", target: step.click, result: out }
  }
  if (step.type) {
    const out = await ev(`(() => {
      const el = document.querySelector(${JSON.stringify(step.type.selector)});
      if (!el) return 'NOT_FOUND';
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(el, ${JSON.stringify(step.type.text)});
      el.dispatchEvent(new Event('input', {bubbles:true}));
      el.dispatchEvent(new Event('change', {bubbles:true}));
      return 'OK';
    })()`)
    return { step: "type", target: step.type.selector, result: out }
  }
  if (step.select) {
    const out = await ev(`(() => {
      const el = document.querySelector(${JSON.stringify(step.select.selector)});
      if (!el) return 'NOT_FOUND';
      const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
      setter.call(el, ${JSON.stringify(step.select.value)});
      el.dispatchEvent(new Event('change', {bubbles:true}));
      return 'OK:' + el.value;
    })()`)
    return { step: "select", target: step.select.selector, result: out }
  }
  if (step.scroll !== undefined) {
    await ev(`window.scrollTo({top:${Number(step.scroll)}, behavior:'instant'})`)
    await sleep(120)
    return { step: "scroll", target: step.scroll, result: "OK" }
  }
  if (step.spaNavigate) {
    await ev(
      `(()=>{history.pushState({},'', ${JSON.stringify(step.spaNavigate)});window.dispatchEvent(new PopStateEvent('popstate',{state:history.state}));return 'OK'})()`,
    )
    await sleep(400)
    return { step: "spaNavigate", target: step.spaNavigate, result: "OK" }
  }
  if (step.typeFromDom) {
    const out = await ev(`(() => {
      const from = ${JSON.stringify(step.typeFromDom.from)};
      let m;
      if (from && from.startsWith('window:')) {
        m = String(window[from.slice(7)] || '').match(${JSON.stringify(step.typeFromDom.regex || "GEI-\\\\d{4}")});
        if (!m) return 'NO_MATCH_VAR';
      } else {
        const src = document.querySelector(from);
        if (!src) return 'NOT_FOUND_SOURCE';
        m = (src.innerText || src.textContent || '').match(${JSON.stringify(step.typeFromDom.regex || "GEI-\\\\d{4}")});
        if (!m) return 'NO_MATCH';
      }
      const el = document.querySelector(${JSON.stringify(step.typeFromDom.to)});
      if (!el) return 'NOT_FOUND_TARGET';
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(el, m[0]);
      el.dispatchEvent(new Event('input', {bubbles:true}));
      return 'OK:' + m[0];
    })()`)
    return { step: "typeFromDom", target: step.typeFromDom.to, result: out }
  }
  if (step.captureText) {
    const out = await ev(`(() => {
      const src = document.querySelector(${JSON.stringify(step.captureText.selector)});
      if (!src) return 'NOT_FOUND';
      const m = (src.innerText || src.textContent || '').match(${JSON.stringify(step.captureText.regex || "GEI-\\\\d{4}")});
      if (!m) return 'NO_MATCH';
      window[${JSON.stringify(step.captureText.var)}] = m[0];
      return 'OK:' + m[0];
    })()`)
    return { step: "captureText", target: step.captureText.selector, result: out }
  }
  if (step.eval) {
    const out = await ev(step.eval)
    return { step: "eval", result: out }
  }
  return { step: "unknown", result: "unsupported step" }
}

/* ── sonda de geometría ─────────────────────────────────────── */

export const GEOMETRY_PROBE = `
(() => {
  const round = (n) => Math.round(n * 100) / 100;
  const cssPath = (el) => {
    const parts = [];
    let node = el;
    let depth = 0;
    while (node && node.nodeType === 1 && depth < 6) {
      let part = node.tagName.toLowerCase();
      if (node.id) { part += '#' + node.id; parts.unshift(part); break; }
      const cls = (node.className && node.className.baseVal !== undefined ? node.className.baseVal : String(node.className || '')).trim().split(/\\s+/).filter(Boolean).slice(0,2).join('.');
      if (cls) part += '.' + cls;
      const parent = node.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(n => n.tagName === node.tagName);
        if (siblings.length > 1) part += ':nth-of-type(' + (siblings.indexOf(node)+1) + ')';
      }
      parts.unshift(part);
      node = node.parentElement;
      depth++;
    }
    return parts.join(' > ');
  };
  const describe = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    const txt = (el.innerText || el.textContent || '').replace(/\\s+/g, ' ').trim();
    const own = Array.from(el.childNodes)
      .filter(n => n.nodeType === 3)
      .map(n => n.textContent.replace(/\\s+/g,' ').trim())
      .filter(Boolean)
      .join(' ');
    const label = (own || txt).slice(0, 80);
    const icon = el.querySelector(':scope > svg');
    const parent = el.parentElement;
    const pr = parent ? parent.getBoundingClientRect() : null;
    const ps = parent ? getComputedStyle(parent) : null;
    return {
      tag: el.tagName.toLowerCase(),
      role: el.getAttribute('role') || '',
      type: el.getAttribute('type') || '',
      aria: el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || '',
      text: label,
      path: cssPath(el),
      rect: { x: round(r.x), y: round(r.y), w: round(r.width), h: round(r.height) },
      parent: parent ? {
        tag: parent.tagName.toLowerCase(),
        role: parent.getAttribute('role') || '',
        rect: pr ? { x: round(pr.x), y: round(pr.y), w: round(pr.width), h: round(pr.height) } : null,
        display: ps ? ps.display : '',
        flexDirection: ps ? ps.flexDirection : '',
        justifyContent: ps ? ps.justifyContent : '',
        alignItems: ps ? ps.alignItems : '',
        gap: ps ? ps.gap : '',
      } : null,
      display: s.display,
      position: s.position,
      flexDirection: s.flexDirection,
      justifyContent: s.justifyContent,
      alignItems: s.alignItems,
      gap: s.gap,
      padding: s.padding,
      margin: s.margin,
      maxWidth: s.maxWidth,
      minHeight: s.minHeight,
      minWidth: s.minWidth,
      width: s.width,
      gridTemplateColumns: s.gridTemplateColumns,
      overflow: s.overflow,
      overflowY: s.overflowY,
      zIndex: s.zIndex,
      background: s.backgroundColor,
      backgroundImage: s.backgroundImage === 'none' ? '' : 'image',
      color: s.color,
      border: s.borderTopWidth + ' ' + s.borderTopStyle + ' ' + s.borderTopColor,
      borderRadius: s.borderRadius,
      boxShadow: s.boxShadow,
      opacity: s.opacity,
      fontFamily: s.fontFamily,
      fontSize: s.fontSize,
      lineHeight: s.lineHeight,
      fontWeight: s.fontWeight,
      letterSpacing: s.letterSpacing,
      textTransform: s.textTransform,
      transition: s.transitionDuration + ' ' + s.transitionTimingFunction,
      animation: s.animationName + ' ' + s.animationDuration,
      transform: s.transform,
      icon: icon ? (icon.getAttribute('class') || 'svg') : '',
      iconSize: icon ? icon.getAttribute('width') + 'x' + icon.getAttribute('height') : '',
      cls: (el.className && el.className.baseVal !== undefined ? el.className.baseVal : String(el.className || '')).slice(0, 200),
    };
  };
  const out = [];
  const walk = (el, depth) => {
    if (depth > 22) return;
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden') return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    const tag = el.tagName;
    const hasDirectText = Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim());
    const hasRole = !!el.getAttribute('role');
    const hasPaint = (s.backgroundColor && s.backgroundColor !== 'rgba(0, 0, 0, 0)') || (s.borderTopWidth !== '0px') || (s.boxShadow && s.boxShadow !== 'none');
    const structural = ['BUTTON','A','INPUT','SELECT','TEXTAREA','H1','H2','H3','H4','H5','LI','NAV','HEADER','FOOTER','SECTION','ASIDE','DIALOG','DETAILS','SUMMARY','LABEL','TABLE','IMG','SVG','MAIN','FORM','DL','DT','DD','CAPTION','TH','TD','FIELDSET','LEGEND','ARTICLE','P','BLOCKQUOTE','UL','OL'].includes(tag);
    const boxLike = (tag === 'DIV' || tag === 'SPAN') && (hasDirectText || hasRole || hasPaint);
    if (structural || boxLike) out.push(Object.assign({ depth }, describe(el)));
    for (const child of Array.from(el.children)) walk(child, depth + 1);
  };
  walk(document.body, 0);
  const doc = document.documentElement;
  const scrollers = [];
  document.querySelectorAll('*').forEach((el) => {
    const s = getComputedStyle(el);
    if ((s.overflowY === 'auto' || s.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 2) {
      scrollers.push({ path: cssPath(el), scrollHeight: el.scrollHeight, clientHeight: el.clientHeight, scrollTop: el.scrollTop, overflowY: s.overflowY });
    }
  });
  return {
    viewport: { w: window.innerWidth, h: window.innerHeight },
    doc: { scrollWidth: doc.scrollWidth, scrollHeight: doc.scrollHeight, scrollY: window.scrollY },
    bodyOverflow: getComputedStyle(document.body).overflow,
    htmlOverflow: getComputedStyle(doc).overflow,
    bodyClass: document.body.className,
    scrollers,
    nodes: out,
  };
})()
`

export async function probe(send) {
  const value = await evaluateRaw(send, GEOMETRY_PROBE)
  return typeof value === "string" ? JSON.parse(value) : value
}

/* ── captura ─────────────────────────────────────────────────── */

export async function capturePng(send, filePath, { fullPage = false } = {}) {
  mkdirSync(path.dirname(filePath), { recursive: true })
  const shot = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: fullPage,
    optimizeForSpeed: false,
  })
  writeFileSync(filePath, Buffer.from(shot.result.data, "base64"))
  return filePath
}

/**
 * Ejecuta una superficie completa: viewport → navegación → pasos → captura.
 */
export async function captureSurface(
  send,
  {
    id,
    base,
    path: routePath,
    actor,
    viewport,
    steps = [],
    outDir,
    fileName,
    fullPage = false,
    probeResult = true,
  },
) {
  const vp = await setViewport(send, viewport)
  const url = `${base}${routePath}${routePath.includes("?") ? "&" : "?"}demo=${actor}`
  // Navegar primero a about:blank fuerza un cambio de documento: si no, una
  // URL que sólo difiere en la query string es una navegación same-document y
  // el estado del router y del store sobrevive de la captura anterior.
  await send("Page.navigate", { url: "about:blank" })
  await sleep(120)
  await send("Page.navigate", { url })
  await sleep(300)
  await waitStable(send)
  await sleep(250)
  const log = []
  for (const step of steps) {
    const result = await runStep(send, step)
    log.push(result)
    await sleep(step.settle ?? 320)
    await waitStable(send)
  }
  const geometry = probeResult ? await probe(send) : null
  const file = path.join(outDir, fileName ?? `${id}_${viewport}.png`)
  await capturePng(send, file, { fullPage })
  return { id, viewport, url, file, log, geometry, vp }
}
