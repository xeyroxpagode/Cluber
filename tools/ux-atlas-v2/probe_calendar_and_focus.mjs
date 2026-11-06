import { withBrowser, setViewport, waitStable, sleep, makeEvaluator } from "./harness/cdp.mjs"

const BASE = "http://localhost:8443"

const CAL_PROBE = `
(() => {
  const sel = Array.from(document.querySelectorAll('*')).filter(el =>
    String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || '').includes('outline-interactive')
  );
  return {
    viewport: { w: window.innerWidth, h: window.innerHeight },
    selectedChips: sel.map(el => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        text: (el.innerText || '').replace(/\\s+/g,' ').trim().slice(0,40),
        outlineWidth: s.outlineWidth,
        outlineStyle: s.outlineStyle,
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        inViewport: r.top < window.innerHeight && r.bottom > 0,
      };
    }),
    selectedCount: sel.length,
    asideInDom: !!document.querySelector('aside'),
    asideText: (document.querySelector('aside')?.innerText || '').replace(/\\s+/g,' ').trim().slice(0,120),
    bodyTextHasNone: (document.body.innerText || '').includes('Ningún evento seleccionado'),
    bodyTextHasMatch: (document.body.innerText || '').includes('match-cuba') || (document.body.innerText || '').includes('CUBA'),
  };
})()
`

const FOCUS_PROBE = `
(() => {
  const el = document.querySelector('a[href="#contenido"]');
  if (!el) return { present: false };
  const before = (() => { const s = getComputedStyle(el); const r = el.getBoundingClientRect();
    return { position:s.position, width:s.width, height:s.height, overflow:s.overflow, cls:String(el.className), rect:{w:r.width,h:r.height} }; })();
  el.focus();
  const after = (() => { const s = getComputedStyle(el); const r = el.getBoundingClientRect();
    return { position:s.position, width:s.width, height:s.height, overflow:s.overflow, bg:s.backgroundColor, clip:s.clip, rect:{w:r.width,h:r.height,x:r.x,y:r.y} }; })();
  return { present: true, activeIsEl: document.activeElement === el, before, after };
})()
`

await withBrowser(async ({ send, sleep: s }) => {
  const ev = makeEvaluator(send)

  console.log("### CALENDAR month event-selected @390")
  await setViewport(send, "390")
  await send("Page.navigate", { url: "about:blank" })
  await sleep(120)
  await send("Page.navigate", { url: `${BASE}/calendar?view=month&event=match-cuba&demo=coach` })
  await sleep(300)
  await waitStable(send)
  await sleep(250)
  console.log(JSON.stringify(await ev(CAL_PROBE), null, 1))

  console.log("### CALENDAR month WITHOUT event @390")
  await send("Page.navigate", { url: "about:blank" })
  await sleep(120)
  await send("Page.navigate", { url: `${BASE}/calendar?view=month&demo=coach` })
  await sleep(300)
  await waitStable(send)
  await sleep(250)
  console.log(JSON.stringify(await ev(CAL_PROBE), null, 1))

  console.log("### CALENDAR month event-selected @1440")
  await setViewport(send, "1440")
  await send("Page.navigate", { url: "about:blank" })
  await sleep(120)
  await send("Page.navigate", { url: `${BASE}/calendar?view=month&event=match-cuba&demo=coach` })
  await sleep(300)
  await waitStable(send)
  await sleep(250)
  console.log(JSON.stringify(await ev(CAL_PROBE), null, 1))

  console.log("### SKIP LINK focus @390")
  await setViewport(send, "390")
  await send("Page.navigate", { url: "about:blank" })
  await sleep(120)
  await send("Page.navigate", { url: `${BASE}/home?demo=coach` })
  await sleep(300)
  await waitStable(send)
  await sleep(250)
  console.log(JSON.stringify(await ev(FOCUS_PROBE), null, 1))

  console.log("### SKIP LINK focus @1440")
  await setViewport(send, "1440")
  await send("Page.navigate", { url: "about:blank" })
  await sleep(120)
  await send("Page.navigate", { url: `${BASE}/home?demo=coach` })
  await sleep(300)
  await waitStable(send)
  await sleep(250)
  console.log(JSON.stringify(await ev(FOCUS_PROBE), null, 1))
})
