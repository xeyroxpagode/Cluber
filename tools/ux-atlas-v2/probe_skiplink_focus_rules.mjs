import { withBrowser, setViewport, waitStable, sleep, makeEvaluator } from "./harness/cdp.mjs"

const BASE = "http://localhost:8443"

const PROBE = `
(() => {
  const el = document.querySelector('a[href="#contenido"]');
  if (!el) return { present: false };
  el.focus();
  const s = getComputedStyle(el);
  const matched = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let rules;
    try { rules = sheet.cssRules; } catch { continue; }
    const walk = (list) => {
      for (const r of Array.from(list || [])) {
        if (r.selectorText) {
          let m = false;
          try { m = el.matches(r.selectorText); } catch {}
          if (m && /sr-only|fixed|left-4|top-4/.test(r.selectorText)) {
            matched.push({ sel: r.selectorText, css: r.style ? r.style.cssText : '' });
          }
        }
        if (r.cssRules) { try { walk(r.cssRules); } catch {} }
      }
    };
    walk(rules);
  }
  return {
    present: true,
    activeIsEl: document.activeElement === el,
    matchesFocus: el.matches(':focus'),
    matchesFocusVisible: el.matches(':focus-visible'),
    docHasFocus: document.hasFocus(),
    computed: {
      position: s.position, width: s.width, height: s.height,
      overflow: s.overflow, clipPath: s.clipPath, left: s.left, top: s.top,
      background: s.backgroundColor, zIndex: s.zIndex, padding: s.padding, margin: s.margin,
    },
    matched,
  };
})()
`

await withBrowser(async ({ send, sleep: s }) => {
  const ev = makeEvaluator(send)
  await setViewport(send, "1440")
  await send("Page.navigate", { url: "about:blank" })
  await sleep(120)
  await send("Page.navigate", { url: `${BASE}/home?demo=coach` })
  await sleep(300)
  await waitStable(send)
  await sleep(400)
  const r = await ev(PROBE)
  console.log(JSON.stringify(r, null, 1))
})
