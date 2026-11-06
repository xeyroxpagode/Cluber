# SHARED PATTERNS — GEI CURRENT UX ATLAS

Patrones que se repiten en el producto actual, con su gramática exacta.
Cada patrón se mide en su(s) `surface-map.md`; acá se describe la regla común.

---

## 1. Encabezado de página — `PageContextHeader`

`src/shared/patterns.tsx` · usado en 42 lugares del código.

Orden fijo: **contexto → título → lead → acción → bloque `below`**.

| Elemento | Clases | Medida (390) |
| --- | --- | --- |
| Contexto | `gei-page-context` (12 px, 600, tracking 0.06em, uppercase) | 15,59 px de alto |
| Título | `gei-page-title` (26 px, 700, −0.02em) | 29,63 px de alto; 2 líneas → 59,25 px |
| Lead | `gei-page-lead` (15 px, 1.5) | 45 px con 2 líneas |
| Acción | `flex w-full flex-wrap items-center gap-2 sm:w-auto` | 46 px de alto |
| `below` | contenedor libre | depende del bloque |

El botón «Volver» (cuando existe) vive **dentro** del bloque de contexto, a la
izquierda, con `-ml-2` y la flecha como carácter `←` (no es un icono lucide).

---

## 2. Jerarquía de secciones — `SectionHeader` / `DetailSection`

`src/shared/patterns.tsx`

- `SectionHeader`: `flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1`
  con título `gei-section-title` (17 px, 650), meta a la derecha en `gei-meta`.
- `DetailSection`: `section grid gap-3` que envuelve un `SectionHeader` + contenido.
- Cuando la sección tiene acción, la acción va en `aside` o `action`, no dentro
  del título.

---

## 3. Grammar de estado — `StateBadge` / `Tag` / `Banner`

`src/shared/ui.tsx` · `src/shared/states.ts`

`StateBadge` es la única forma de mostrar un estado de dominio:

```
inline-flex shrink-0 items-center gap-1.5 rounded-control px-2 py-1
text-meta font-semibold leading-tight
```

Tono (`toneBadge`): `neutral`, `selected`, `attention`, `success`, `warning`,
`danger` — cada uno con fondo, texto y `ring-1 ring-inset`.

Mapa de tonos de dominio (`stateToneMap`):

| Estado | Tono | Texto (`stateText`) |
| --- | --- | --- |
| DRAFT | neutral | Borrador |
| SCHEDULED | selected | Programado |
| POSTPONED | warning | Postergado |
| CANCELLED | danger | Cancelado |
| IN_PROGRESS | attention | En curso |
| COMPLETED | success | Finalizado |
| ABANDONED | warning | Suspendido |
| PUBLISHED | success | Publicado |
| ARCHIVED | neutral | Archivado |
| ACTIVE | success | Activo |
| PENDING | warning | Pendiente |
| DISABLED | danger | Deshabilitado |
| OPEN | success | Abierta |
| CLOSED | neutral | Cerrada |
| FINAL | success | Final |
| YES / MAYBE / NO | success / warning / danger | Voy / Tal vez / No voy |
| NO_RESPONSE | neutral | Sin respuesta |
| NEEDS_RECONFIRMATION | attention | Hay que volver a confirmar |
| PRESENT / ABSENT / JUSTIFIED | success / danger / warning | Presente / Ausente / Justificada |

`Tag` es la variante **estática**: nunca usa el azul de `selected` para
decorar; sólo `neutral` en los usos observados, salvo el «Tu alcance» del
detalle de equipo.

`Banner` es el patrón de mensaje con consecuencia:

```
flex flex-wrap items-start gap-3 rounded-surface border p-4
```

con icono lucide de 18 px a la izquierda (`AlertCircle`, `CheckCircle2` o `Info`),
título en `gei-body-strong` y cuerpo en `gei-body`.

---

## 4. Grammar «¿Vas?» — `VasControl`

`src/shared/vas.tsx` · un único control en todo el producto.

```
<div class="grid gap-2.5">
  <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
    <p class="gei-body-strong">¿Vas?</p>
    <p class="gei-meta" role="status" aria-live="polite">Tu respuesta: {valor}</p>
  </div>
  [aviso de reconfirmación, si aplica]
  <RadioGroup legend="¿Vas?" columns=3 />
</div>
```

Opciones y tonos: `Voy` (success), `Tal vez` (warning), `No voy` (danger).
El input radio es `sr-only`; el label es el blanco del toque (`min-h-11`).

Variantes por estado:

| Estado | Render |
| --- | --- |
| Evento no SCHEDULED | párrafo `gei-meta` con el motivo |
| Sin autoridad para responder | párrafo `gei-meta` («Vos no jugás este evento…» / «No podés responder por otra persona.») |
| `NO_RESPONSE` | radio group sin valor seleccionado |
| `NEEDS_RECONFIRMATION` | radio group sin valor + aviso ámbar «El horario cambió desde tu última respuesta. Confirmá de nuevo.» |
| Respondible | radio group con la opción actual marcada |

---

## 5. Filas — `RowLink` / `RowStatic`

`src/shared/ui.tsx`

```
flex min-h-11 items-center gap-3 rounded-control px-3 py-3
```

- `RowLink` = `<Link>` con `hover:bg-selected-soft active:bg-selected-soft` y un
  `ChevronRight` de 16 px al final.
- `RowStatic` = `<div>` sin interacción: misma métrica, sin flecha.
- `leading` = avatar, icono o tag; `title` = `gei-item-title truncate`;
  `detail` = `gei-meta mt-0.5 line-clamp-2`; `meta` = columna derecha
  `shrink-0 text-right`; `trailing` = acciones.

---

## 6. Superficies — `Surface`

```
rounded-surface border border-line bg-surface shadow-raised
p-4 sm:p-5
```

`flush` quita el padding (se usa en listas: `<ul class="grid px-1 py-1">`).
`shadow-raised` = `0 1px 2px rgb(16 23 37 / 0.05)`.

---

## 7. Formularios — `Field` + control

`src/shared/ui.tsx`

```
<div class="grid gap-1.5">
  <label class="flex items-baseline gap-2 text-body font-semibold">{label}
    <span class="text-micro font-medium uppercase tracking-wide text-ink-faint">
      {obligatorio | opcional}</span>
  </label>
  [hint en gei-meta]
  [control]
  [error: <p class="flex items-start gap-1.5 text-meta font-medium text-danger"> + AlertCircle 14 px]
</div>
```

Control base (`controlBase`):

```
w-full rounded-control border bg-surface px-3 py-2.5 text-body text-ink
transition-colors duration-micro placeholder:text-ink-faint
disabled:bg-control disabled:text-ink-muted
```

- `TextField` / `TextArea`: `border-line-strong` en reposo, `border-danger` con error.
- `Select`: `appearance-none` + chevron SVG en `background-image`, `pr-9`.
- `RadioGroup`: `fieldset` + `legend`; la opción activa usa
  `border-interactive bg-selected-soft text-selected` o el tono propio de la
  opción con `border-current`.

---

## 8. Overlays

| Primitive | Comportamiento |
| --- | --- |
| `Modal` | `fixed inset-0 z-50`; backdrop `bg-overlay` + `backdrop-blur-[2px]`; panel `max-h-[92dvh]`; cuerpo con `overflow-y-auto`; `useFocusTrap` (Tab cicla, Escape emite `gei:close`, el foco inicial evita el botón «Cerrar», al cerrar se restaura `overflow` del body y el foco previo) |
| `Sheet` | Igual que Modal pero sin blur en el backdrop y con panel lateral `h-full max-w-md` |
| `ConfirmDialog` | Modal + banner «Qué pasa si confirmás» + textarea de motivo cuando `requireReason`; botones `quiet` Cancelar y `danger`/`primary` confirmar |
| `Menu` | `absolute top-[calc(100%+4px)] z-30 min-w-56`; el foco va al primer ítem al abrir; cierra con click fuera, Escape o selección; **no hay focus trap** |

---

## 9. Pestañas y segmentos

| Primitive | Forma | Nota |
| --- | --- | --- |
| `TabBar` | `role=tablist` con `-mx-1 flex gap-1 overflow-x-auto px-1 pb-px`; cada tab con `border-b-2`; flechas ←/→ cambian de tab | Se usa en comunicación y en la ficha de persona |
| Pestañas propias | `div role=tablist class="flex gap-1 overflow-x-auto"` en el detalle de equipo | Mismo patrón, sin primitive |
| `SegmentedControl` | `role=group` con `inline-flex gap-0.5 rounded-control border border-line bg-control p-0.5`; la opción activa es `bg-surface text-ink shadow-raised` | Se usa en calendario y audiencia de comunicado |
| `FilterChip` | `aria-pressed` con `border-selected-line bg-selected-soft text-selected` cuando está activo | Se usa en el filtro de perfil incompleto |

---

## 10. Movimiento declarado en el sistema

`src/styles/theme.css`:

| Token | Valor | Dónde se usa |
| --- | --- | --- |
| `--duration-micro` | 120 ms | `transition-colors duration-micro` en botones, filas, chips, tabs |
| `--duration-state` | 180 ms | declarado, sin uso observado en las surfaces capturadas |
| `--ease-gei` | `cubic-bezier(0.2, 0, 0, 1)` | `ease-gei` en botones |
| `prefers-reduced-motion` | todas las duraciones a 0,01 ms y `animation-iteration-count: 1` | Regla global |

Movimientos que sí se observan en runtime:

- `Expander`: `rotate-180` del chevron (el primitive no se renderiza hoy).
- Icono `Loader2` de los botones `busy`: `animate-spin` (con `motion-reduce:animate-none`).
- Icono `CheckCircle2` del `Toast`: sin animación.
- Overlays: **sin animación**; aparecen por montaje.

---

## 11. Micro-texto y tonos

`src/shared/states.ts` · `stateText` nunca devuelve un código crudo: un estado
desconocido devuelve «Estado a revisar» y emite un `console.warn` en desarrollo.

`src/shared/ui.tsx` · `cx()` concatena clases falsy; no hay `clsx` ni
`tailwind-merge` en el proyecto.
