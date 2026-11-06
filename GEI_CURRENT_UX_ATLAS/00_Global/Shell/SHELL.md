# SHELL — GEI CURRENT UX ATLAS

El contenedor de navegación de la aplicación: todo lo que vive **fuera** de
`<main>` y por lo tanto acompaña a todas las pantallas autenticadas.

Fuente: `src/app/Shell.tsx` · 253 líneas.

---

## 1. Estructura del árbol

```
div.min-h-dvh.overflow-x-clip
├── a[href="#contenido"].sr-only          ← enlace de salto (skip link)
├── header.sticky.top-0.z-30              ← TopBar
│   └── div.flex.h-16.items-center.gap-3.px-4.sm:px-6
│       ├── a (marca GEI, sólo < lg)
│       ├── div (contexto de ruta; dos variantes: < lg y ≥ lg)
│       └── div.flex.items-center.gap-1
│           ├── a → /search   (icono en < sm, texto con ⌘K en ≥ sm)
│           ├── a → /notifications  (campana + punto de no-leído)
│           └── a → /more/profile   (avatar)
├── div.flex
│   ├── nav.sticky.top-16.hidden.lg:flex  ← destinos de escritorio (224 px)
│   └── main#contenido.min-w-0.flex-1.px-4.pb-28.pt-6.sm:px-6.lg:px-8.lg:pb-16
│       └── <Outlet />
├── nav.fixed.inset-x-0.bottom-0.z-30.lg:hidden  ← destinos de móvil
└── Toast
```

`overflow-x-clip` en la raíz es lo que impide que la fila de pestañas de la
ficha de persona (478,58 px dentro de 358 px disponibles) desborde el
documento: el `scrollWidth` del documento se mantiene en 390.

---

## 2. TopBar

| Elemento | 390 | 1440 |
| --- | --- | --- |
| Marca GEI | 36×36, `bg-brand`, texto blanco, `rounded-control` | no se renderiza (`lg:hidden`) |
| Contexto de ruta | una línea, `truncate`, `text-body font-semibold` | dos bloques: `gei-micro` «Hockey» + título truncado |
| Buscar | `a` 44×44 con `Search` 19 px | `a` con texto «Buscar», `kbd` «⌘K», `gei-target-sm` (36 px) |
| Avisos | `a` 44×44 con `Bell` 19 px; punto 8×8 `bg-unread` con `ring-2 ring-surface` | idéntico |
| Avatar | `a` con `Avatar size=sm` (32×32) dentro de un `p-0.5` | idéntico |

- Fondo `bg-surface/95` con `backdrop-blur-sm`.
- Borde inferior `border-b border-line`.
- `z-index: 30` — por debajo de los overlays (`z-50`).

---

## 3. Destinos

### 3.1 Barra lateral (≥ lg)

```
nav.sticky.top-16.h-[calc(100dvh-4rem)].w-[224px].shrink-0.flex-col.gap-1
    .overflow-y-auto.border-r.border-line.bg-surface.px-3.py-4
```

- Cada item: `gei-target flex items-center gap-3 rounded-control px-3 text-body font-semibold`.
- Ícono lucide de 19 px con `strokeWidth={1.9}`.
- Item activo: `bg-selected-soft text-selected` + `aria-current="page"`.
- Item con contador (Comunicación, Más): punto 8×8 `bg-unread` + cifra en
  `text-meta font-semibold text-selected`, con `ml-auto`.
- **El contador de mensajes vive sólo aquí**: el BottomNav de 390 no lo muestra.

### 3.2 Barra inferior (< lg)

```
nav.fixed.inset-x-0.bottom-0.z-30.flex.border-t.border-line.bg-surface
    .pb-[env(safe-area-inset-bottom)]
```

- 5 items `flex-1` con `flex-col items-center gap-1 px-0 py-2`.
- Ícono de 20 px + label `text-micro font-semibold truncate`.
- Item activo: `text-selected`; el resto `text-ink-muted`.
- Fondo opaco `bg-surface` con borde superior: no hay blur.
- Alto medido: 54,84 px.

---

## 4. Comportamiento del Shell

| Comportamiento | Implementación | Efecto observado |
| --- | --- | --- |
| Redirección sin sesión | `if (!authenticated) return <Navigate to="/login" replace />` | `/login` |
| Redirección sin acceso | `if (!hasAccess) → <Navigate to="/no-access" replace />`, con la excepción de `/more/profile`, que se renderiza dentro de un `main` propio (`max-w-2xl px-4 py-8`) | Un actor con cuenta activa pero sin rol ve su perfil, no la pantalla de sin acceso |
| Reset de scroll | `useEffect` con `window.scrollTo({ top: 0 })` en cada cambio de `location.pathname` | La posición de lectura no sobrevive a la navegación |
| Atajo global | listener de `keydown` en `document`: `metaKey || ctrlKey` + `k` → `navigate("/search")` | `⌘K` / `Ctrl+K` |
| Skip link | `a[href="#contenido"]` con `sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50` | Al enfocarse aparece en la esquina superior izquierda, 1×1 px en reposo |
| Contexto de ruta | `routeContext(pathname)` (`src/shared/nav-context.ts`) | Vocabulario de usuario: «Inicio», «Eventos», «Mensajes», «Historial»… |

---

## 5. Reglas de `routeContext`

Prefijo más largo que coincida con la ruta (37 entradas):

```
/home → Inicio            /calendar → Calendario      /search → Buscar
/notifications → Avisos   /more/profile → Mi perfil   /more → Más
/teams → Equipos          /events/new → Nuevo evento  /events → Eventos
/jornadas/new → Nueva jornada   /jornadas → Jornadas
/communication/conversations/new → Nuevo mensaje
/communication/announcements/new → Nuevo comunicado
/communication → Comunicación     /conversations → Mensajes
/announcements → Comunicados
/management/competitions → Competencias   /management/structure → Estructura
/management/people/new → Nueva persona   /management/people → Personas
/management/teams → Equipos   /management → Administración
/reports/attendance → Informe de asistencia
/reports/performance → Informe de rendimiento
/reports → Informes   /audit → Historial   /people → Persona
/login → Acceso   /activate → Activar cuenta   /no-access → Sin acceso
```

Sin coincidencia: «GEI Hockey».
