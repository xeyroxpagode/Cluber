import { withBrowser, setViewport, waitStable, sleep, makeEvaluator } from "./harness/cdp.mjs"

const BASE = "http://localhost:8443"

const CSS_PROBE = `
(() => {
  const out = [];
  const hits = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let rules;
    try { rules = sheet.cssRules; } catch { continue; }
    for (const r of Array.from(rules || [])) {
      const t = r.cssText || '';
      if (t.includes('not-sr-only') || t.includes('focus\\\\:not-sr-only')) hits.push(t);
      if (r.selectorText && r.selectorText.includes('sr-only')) {
        out.push({ sel: r.selectorText, css: r.style ? r.style.cssText : '' });
      }
    }
  }
  return { srOnlyRules: out, notSrOnlyHits: hits, total: hits.length };
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
  const rules = await ev(CSS_PROBE)
  console.log("sr-only related rules:")
  for (const r of rules.srOnlyRules || []) console.log("  ", r.sel, "=>", r.css)
  console.log("\nnot-sr-only rule hits:", rules.total)
  for (const h of rules.notSrOnlyHits || []) console.log("  ", h.slice(0, 500))
})
