# ATLAS README — GEI CURRENT UX ATLAS

Cartografía exhaustiva de la UX **actual** de GEI Hockey.
Este directorio no modifica el producto: sólo documenta lo que existe hoy,
medido sobre la app real en ejecución.

---

## Qué hay adentro

```
GEI_CURRENT_UX_ATLAS/
├── README.md                     ← este archivo
├── SCREEN_INDEX.md               ← índice maestro de las 203 superficies
├── COVERAGE_MATRIX.md            ← cobertura por dominio
├── COMPONENT_USAGE_INDEX.md      ← componente → surfaces donde aparece
├── 00_Global/
│   ├── SURFACE_INVENTORY.md
│   ├── SHARED_COMPONENT_CATALOG.md
│   ├── Shell/ Navigation/ Search/ Notifications/ Overlays/ GlobalStates/
├── 01_Home/ … 09_CrossDomain/    ← un dominio por carpeta
└── _harness/                     ← herramientas de captura (no es artefacto de UX)
    ├── cdp.mjs  run.mjs  maps.mjs  indexes.mjs  components.mjs  motion.mjs
    ├── manifests/                ← definición de capturas (una por dominio)
    ├── specs/                    ← descripción semántica de cada superficie
    ├── _probes/                  ← sonda DOM real por captura (JSON)
    └── _harness/…                ← artefactos intermedios
```

Cada superficie vive en su propia carpeta:

```
02_Calendario/EventDetail/CAL_EVENT_DETAIL_001_SCHEDULED_COACH/
├── CAL_EVENT_DETAIL_001_SCHEDULED_COACH_390.png
├── CAL_EVENT_DETAIL_001_SCHEDULED_COACH_1440.png
├── surface-map.md
└── motion/            (cuando la superficie tiene un clip de motion)
```

---

## Cómo leer un `surface-map.md`

```
SCREEN ID / DOMAIN / SURFACE NAME / PURPOSE AS IMPLEMENTED
VIEWPORT / ROUTE / ORIGIN / ACTOR / RESOURCE-FIXTURE IDS / RESOURCE STATE
SCROLL POSITION / STEPS TO REPRODUCE / RELATED SCREEN IDS
RESPONSIVE COUNTERPART / SOURCE FILES / SOURCE SYMBOLS / CONFIDENCE

PERCEPTUAL HIERARCHY   → qué domina visualmente: FOCAL 1, FOCAL 2, SUPPORTING,
                          SECONDARY, AMBIENT
COMPONENT INVENTORY    → tabla C01, C02, … con tipo y rol
  por componente:
    GEOMETRY           → x, y, w, h medidos en el DOM + valores CSS
    POSITION MODEL     → static / relative / absolute / fixed / sticky
    CONSTRAINTS        → width / min-width / max-width / min-height
    LAYOUT             → display, flex-direction, justify, align, gap, padding…
    SPATIAL RELATIONSHIPS → contained-by, aligned with, offsets medidos
    VISUAL CONFIGURATION → background, color, border, radius, shadow, tipografía
    CONTENT / STATE / INTERACTION / MOTION / RESPONSIVE / IMPLEMENTATION NOTES
SCROLL CONTRACT        → qué scrollea, qué queda fijo, restauración
RESPONSIVE RELATIONSHIP — CURRENT
```

Los valores de geometría son **medidos** (sonda CDP sobre el DOM renderizado),
no deducidos. Cuando un nodo no existe en una captura concreta, la sección
lo marca como `NOT FOUND IN DOM`.

---

## Etiquetas de confianza

| Etiqueta | Significado |
| --- | --- |
| `RENDER-CONFIRMED` | observado en el navegador |
| `SOURCE-CONFIRMED` | verificado leyendo el código fuente |
| `BOTH` | navegador + código (por defecto en este atlas) |
| `INFERRED` | deducción fuerte, no verificada |
| `UNKNOWN` | no verificable |

---

## Cómo se produjo el atlas

1. **Inspección de código** — `src/app/App.tsx` (38 rutas), `src/features/*`
   (6 módulos), `src/shared/*` (primitives), `src/mock/*` (modelo, autoridad,
   seed).
2. **Inventario de surfaces** — a partir de routes + navegación visible +
   acciones + overflow + formularios + tabs + transiciones + overlays +
   variantes de autoridad + estados vacío/carga/error.
3. **Captura real** — Chrome headless vía Chrome DevTools Protocol, con
   `Emulation.setDeviceMetricsOverride` para obtener exactamente 390×844 y
   1440×900 de viewport CSS, `Emulation.setTouchEmulationEnabled` para el
   viewport móvil, y un actor real por captura vía `?demo=`.
4. **Sonda DOM** — en la misma sesión se midió geometría, estilos calculados,
   contenedores con scroll propio y el árbol de accesibilidad.
5. **Motion** — `Page.startScreencast` + reassembly con ffmpeg usando la
   duración real de cada frame. Junto a cada `.mp4` queda el `.meta.json` y el
   `.frames.txt` con la línea de tiempo.
6. **Mapas** — generados con `_harness/maps.mjs` a partir de la sonda real y de
   una descripción semántica escrita a mano en `_harness/specs/`.

### Reproducir una captura

```bash
pnpm dev                       # dev server en http://localhost:8443
node GEI_CURRENT_UX_ATLAS/_harness/run.mjs \
     GEI_CURRENT_UX_ATLAS/_harness/manifests/02_calendar.mjs
node GEI_CURRENT_UX_ATLAS/_harness/maps.mjs \
     GEI_CURRENT_UX_ATLAS/_harness/specs/spec_02_calendar.mjs
```

### Actores disponibles en runtime

`?demo=` acepta: `admin` (Mariana Costa), `subcommittee` (Carolina Sánchez),
`coach` (Tomás Beltrán), `player` (Lucía Fernández, p2), `captain`
(Victoria Berg, p0).

---

## Alcance de esta fase

Este atlas describe **la UX que existe hoy**. No propone cambios, no jerarquiza
lo que debería cambiar y no clasifica nada como bueno o malo. Donde una
superficie existe en el código pero no es alcanzable desde la UI, se registra
como **IMPLEMENTED BUT NOT RUNTIME-REPRODUCIBLE** con la evidencia; donde la
superficie simplemente no existe, se registra como **NOT PRESENT IN CURRENT**.

Los conteos verificables están en `COVERAGE_MATRIX.md`; el detalle por
superficie, en `SCREEN_INDEX.md` y en los `SURFACE_INVENTORY.md` de cada
dominio.
