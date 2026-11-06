import { withBrowser, setViewport, waitStable, sleep, makeEvaluator } from "./harness/cdp.mjs"
import { writeFileSync, mkdirSync } from "node:fs"
import path from "node:path"

const BASE = "http://localhost:8443"

const PROBE = `
(() => {
  const round = (n) => Math.round(n * 100) / 100;
  const navs = Array.from(document.querySelectorAll('nav[aria-label="Destinos"]'));
  const sidebar = navs[0] || null;
  const bottom = navs[1] || null;
  const desc = (el) => {
    if (!el) return { present: false };
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      present: true,
      display: s.display,
      position: s.position,
      rect: { x: round(r.x), y: round(r.y), w: round(r.width), h: round(r.height) },
      visibleBox: r.width > 0 && r.height > 0,
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
      ownScroller: s.overflowY === 'auto' || s.overflowY === 'scroll',
      links: Array.from(el.querySelectorAll('a')).map(a => ({
        text: (a.innerText || '').replace(/\\s+/g,' ').trim(),
        ariaCurrent: a.getAttribute('aria-current') || '',
        badgeText: (a.innerText || '').replace(/\\s+/g,' ').trim(),
        hasUnreadDot: !!a.querySelector('.bg-unread'),
      })),
    };
  };
  const brand = document.querySelector('a[aria-label^="GEI Hockey"]');
  const brandDesc = brand ? {
    present: true,
    display: getComputedStyle(brand).display,
    visibleBox: brand.getBoundingClientRect().width > 0,
  } : { present: false };
  const header = document.querySelector('header');
  const headerText = header ? (header.innerText || '').replace(/\\s+/g,' ').trim() : '';
  const kbd = header ? Array.from(header.querySelectorAll('kbd')).map(k => (k.innerText||'').trim()) : [];
  const searchTextLink = header ? !!Array.from(header.querySelectorAll('a')).find(a => (a.innerText||'').includes('Buscar')) : false;
  const searchIconLink = header ? !!Array.from(header.querySelectorAll('a[aria-label="Buscar"]')) : false;
  const microHockey = header ? Array.from(header.querySelectorAll('p')).some(p => (p.innerText||'').trim() === 'Hockey') : false;
  const topbarParts = header ? Array.from(header.querySelectorAll('div, a')).map(el => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      cls: String(el.className || ''),
      aria: el.getAttribute('aria-label') || '',
      display: s.display,
      visibleBox: r.width > 0 && r.height > 0,
      rect: { x: round(r.x), y: round(r.y), w: round(r.width), h: round(r.height) },
    };
  }) : [];
  const main = document.querySelector('main#contenido');
  return {
    viewport: { w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio },
    sidebar: desc(sidebar),
    bottomnav: desc(bottom),
    header: {
      present: !!header,
      text: headerText,
      brand: brandDesc,
      microHockey,
      searchTextLink,
      searchIconLink,
      kbd,
      topbarParts,
    },
    main: main ? {
      present: true,
      paddingBottom: getComputedStyle(main).paddingBottom,
      scrollHeight: document.documentElement.scrollHeight,
    } : { present: false },
    docScrollY: window.scrollY,
    bodyScrollHeight: document.body.scrollHeight,
  };
})()
`

const CASES = [
  {
    id: "GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR",
    route: "/calendar",
    actor: "coach",
    probeViewport: "390",
    expect: "sidebar",
    claim: "La barra lateral de destinos no se renderiza en 390px; la cumple el BottomNav fijo.",
  },
  {
    id: "GBL_NAV_004_SIDEBAR_BADGES_COACH",
    route: "/home",
    actor: "coach",
    probeViewport: "390",
    expect: "sidebar",
    claim: "Los contadores de no-leidos de la barra lateral no existen en 390px; el BottomNav no lleva contadores.",
  },
  {
    id: "GBL_NAV_005_SIDEBAR_BADGES_ADMIN",
    route: "/home",
    actor: "admin",
    probeViewport: "390",
    expect: "sidebar",
    claim: "La barra lateral de destinos no se renderiza en 390px.",
  },
  {
    id: "GBL_NAV_006_SCROLL_02",
    route: "/home",
    actor: "admin",
    probeViewport: "390",
    expect: "sidebar",
    claim: "No existe columna lateral en 390px, por lo que no existe la superficie de scroll propio de la barra lateral.",
  },
  {
    id: "GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR",
    route: "/calendar",
    actor: "coach",
    probeViewport: "1440",
    expect: "bottomnav",
    claim: "El BottomNav fijo no se renderiza en 1440px; la cumplen la barra lateral.",
  },
  {
    id: "GBL_NAV_003_BOTTOMNAV_ACTIVE_COMMUNICATION",
    route: "/communication",
    actor: "coach",
    probeViewport: "1440",
    expect: "bottomnav",
    claim: "El BottomNav fijo no se renderiza en 1440px; el contador vive en la barra lateral.",
  },
  {
    id: "GBL_SHELL_001_TOPBAR_MOBILE",
    route: "/home",
    actor: "coach",
    probeViewport: "1440",
    expect: "topbarMobile",
    claim: "La composicion de topbar movil (marca GEI, contexto en una linea, buscar como icono) no existe en 1440px.",
  },
  {
    id: "GBL_SHELL_002_TOPBAR_DESKTOP",
    route: "/home",
    actor: "coach",
    probeViewport: "390",
    expect: "topbarDesktop",
    claim: "La composicion de topbar escritorio (sin marca GEI, micro Hockey, buscar con atajo) no existe en 390px.",
  },
]

const out = []
await withBrowser(async ({ send, sleep: s }) => {
  const ev = makeEvaluator(send)
  for (const c of CASES) {
    await setViewport(send, c.probeViewport)
    await send("Page.navigate", { url: "about:blank" })
    await sleep(120)
    await send("Page.navigate", { url: `${BASE}${c.route}?demo=${c.actor}` })
    await sleep(300)
    await waitStable(send)
    await sleep(250)
    const r = await ev(PROBE)
    out.push({ ...c, runtime: r })
    const sb = r.sidebar
    const bn = r.bottomnav
    console.log(
      `${c.id} @${c.probeViewport} :: sidebar display=${sb.display} visibleBox=${sb.visibleBox} | bottomnav display=${bn.display} visibleBox=${bn.visibleBox} | brand=${r.header.brand.display}/${r.header.brand.visibleBox} microHockey=${r.header.microHockey} searchText=${r.header.searchTextLink} searchIcon=${r.header.searchIconLink} kbd=${JSON.stringify(r.header.kbd)}`,
    )
  }
})

mkdirSync("GEI_FULL_VISUAL_ATLAS_V2/12_QA", { recursive: true })
writeFileSync(
  "GEI_FULL_VISUAL_ATLAS_V2/12_QA/VIEWPORT_NA_EVIDENCE.json",
  JSON.stringify(out, null, 2),
  "utf8",
)
console.log("\nEvidence written to 12_QA/VIEWPORT_NA_EVIDENCE.json")
