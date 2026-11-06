# RESPONSIVE MAPPINGS — GEI CURRENT UX ATLAS

Relación 390 ↔ 1440 de cada familia de superficies, tal como existe hoy.
Sin evaluación: sólo lo que se midió en el navegador.

## Viewports canónicos

| | 390 (móvil) | 1440 (escritorio) |
| --- | --- | --- |
| CSS viewport | 390 × 844 | 1440 × 900 |
| Emulación | `Emulation.setDeviceMetricsOverride` con `mobile: true` y touch de 5 puntos | idem con `mobile: false` |
| Breakpoint activo | — | `lg` (1024 px) y `sm` (640 px) |

## 1. Cromo de aplicación

| 390 | 1440 |
| --- | --- |
| Barra superior fija de 64 px con marca GEI (36×36) | Barra superior fija de 64 px sin marca, con contexto en dos líneas |
| Iconos de buscar (44×44), avisos (44×44) y avatar (36×36) | Buscar como texto con badge ⌘K, avisos (44×44) y avatar (36×36) |
| Barra inferior fija de destinos: 5 items de 78 px, icono 20 px + label micro, 54,84 px de alto | Barra lateral de destinos: 224 px, icono 19 px + label body, `sticky top-16`, alto `calc(100dvh - 4rem)` |
| La barra inferior no muestra contadores | La barra lateral muestra punto + cifra en «Comunicación» y «Más» |
| `pb-28` (112 px) al pie de `<main>` | `pb-16` (64 px) al pie de `<main>` |

## 2. Contenedores de contenido

| Familia | 390 | 1440 |
| --- | --- | --- |
| Inicio, Equipos | `max-w-5xl` → 358 px útiles | `max-w-5xl` → 1024 px |
| Calendario, Participación, Gestión, Informes | `max-w-6xl` / `max-w-4xl` → 358 px | 1152 px / 896 px |
| Ficha de persona, Jornada, Más | `max-w-3xl` → 358 px | 768 px |
| Comunicados, Conversaciones, Perfil | `max-w-2xl` → 358 px | 672 px |
| Login / Activar / Sin acceso | `max-w-md` → 358 px | 448 px, centrado |

Los contenedores son iguales en ambos viewports: lo que cambia es el **ancho
útil** (358 px frente al ancho del contenedor) porque `<main>` aplica
`px-4` en 390 y `px-8` en 1440.

## 3. Composiciones de dos columnas

| Superficie | 390 | 1440 |
| --- | --- | --- |
| Calendario | Una columna: la agenda o la matriz arriba, el `aside` de evento seleccionado debajo (358×273,11 px) | `lg:grid-cols-[minmax(0,1fr)_22rem]`: contenido a la izquierda, panel de 352 px a la derecha, gap 16 px |
| Detalle de evento | Una columna de 358 px; el `aside` «Resumen» (358×411,09 px) al final | `lg:grid-cols-[minmax(0,1fr)_20rem]`: columna principal + aside de 320 px, gap 24 px |
| Conversación | `grid-rows-[auto_minmax(0,1fr)_auto]` con `h-[calc(100dvh-4rem)]`; el hilo hace scroll propio (`overflow-y-auto`) | idéntico; el composer queda `lg:bottom-0` en lugar de `bottom-14` |

## 4. Formularios

| Campo | 390 | 1440 |
| --- | --- | --- |
| Fecha / Hora de inicio / Hora de fin (evento) | `sm:grid-cols-3` no aplica → tres filas apiladas | una fila de tres columnas |
| Hora de encuentro / Hora de salida (jornada) | `sm:grid-cols-2` no aplica → apiladas | una fila de dos columnas |
| Equipos destino (evento y comunicado) | una columna | `sm:grid-cols-2` |
| Goles GEI / Goles del rival (acta) | apilados | `sm:grid-cols-2` |
| Tipos de evento (radio group) | 3 columnas de ~102,66 px; «Evento del club» envuelve a 2 líneas | 3 columnas más anchas |

## 5. Barras de acción pegadas

| Barra | 390 | 1440 |
| --- | --- | --- |
| Publicación de convocatoria | `sticky bottom-16` con `-mx-4 px-4 py-3` y borde superior | `lg:bottom-0 lg:mx-0 lg:rounded-surface lg:border` |
| Guardado de evento | igual que la anterior | igual que la anterior |

`bottom-16` (64 px) deja la barra por encima del BottomNav (54,84 px) en móvil.

## 6. Overlays

| Overlay | 390 | 1440 |
| --- | --- | --- |
| `Modal` | Hoja inferior: `items-end justify-center`, ancho 100 %, `rounded-t-overlay`, `max-h-[92dvh]` | Diálogo centrado: `sm:items-center sm:p-6`, `sm:max-w-lg` (512 px) o `sm:max-w-3xl` (768 px), `rounded-overlay` |
| `Sheet` | Panel lateral a pantalla completa: `w-full h-full max-w-md` (100 % del viewport) | Panel lateral de 448 px alineado a la derecha |
| `Menu` | Panel `min-w-56` (224 px) alineado con `right-0` al botón | idéntico |
| `Toast` | `bottom-24` (96 px), `max-w-[90vw]` | `lg:bottom-6` (24 px) |

## 7. Tablas

| Tabla | 390 | 1440 |
| --- | --- | --- |
| Informe de rendimiento | Contenedor con `overflow-x-auto` y tabla de `min-w-[34rem]` (544 px): scroll horizontal propio | La tabla entra completa en los 896 px del contenedor |

Es la única superficie con scroll horizontal en el producto actual.

## 8. Fila de pestañas con overflow

| Pestañas | 390 | 1440 |
| --- | --- | --- |
| Ficha de persona (5 pestañas) | Fila de 478,58 px dentro de un contenedor `overflow-x-auto`: se desplaza horizontalmente. El documento no desborda (`scrollWidth` = 390) porque el contenedor raíz del Shell usa `overflow-x-clip` | Fila de 478,58 px, sin necesidad de desplazamiento |
| Estructura (4 pestañas) | Fila de 465,16 px con scroll horizontal | las cuatro caben en 896 px |
| Comunicación (2 pestañas) | 302,62 px, caben | caben |

## 9. Responsive mapping de la familia de superficies

| Familia | 390 | 1440 |
| --- | --- | --- |
| Calendario | Lista de agenda o matriz mensual de 7 columnas con celdas de 51,14 px | Matriz de celdas de ~144,86 px + panel lateral de 352 px |
| Detalle de evento | Columna única de 358 px | Columna principal + aside de 320 px |
| Selección | Columna única + barra de publicación `bottom-16` | Columna única de 896 px + barra `lg:bottom-0` |
| Asistencia | Contadores en 2×2 (156×60,64 px); botones de valor bajo el nombre | Contadores en 1×4; botones de valor a la derecha del nombre |
| Ficha de equipo | Columna única; cada evento en una tarjeta con ¿Vas? debajo | Columna de 1024 px; mismas tarjetas |
| Comunicación | Pestañas con scroll + lista de 358 px | Mismas pestañas, lista de 896 px |
| Personas (admin) | Filtros en dos filas: 118 / 149 / 140 px + chip | Filtros en una fila dentro de 1024 px |
| Perfil | Avatar de 64×64 en línea propia bajo el encabezado | Avatar de 64×64 en el action del encabezado |
| Más | Columna de 358 px | Columna de 768 px |
| Informes | Contenedor de 358 px | Contenedor de 896 px |
| Auth | `max-w-md` de 358 px, `content-center` vertical | `max-w-md` de 448 px, `content-center` vertical |

## 10. Lo que NO cambia entre 390 y 1440

- El sistema de color, la escala tipográfica, los radios y las sombras
  (`src/styles/theme.css`): no hay breakpoints de token.
- La gramática de las superficies: mismo texto, mismo orden, misma jerarquía.
- Los componentes de formulario: mismo control, mismo label, mismo hint.
- Los overlays: mismas propiedades; sólo cambian su anclaje y su ancho máximo.
