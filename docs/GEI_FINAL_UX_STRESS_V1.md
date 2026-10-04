# GEI Hockey · Re-auditoría perceptual e interacción (48 bloques)

**Versión** V1 · **Fecha** 2026-10-03 · **Rama** `gei/frontend-final-ux-v1`
**Comparación** antes = Stage 5 (`docs/GEI_STAGE5_PERCEPTUAL_INTERACTION_AUDIT_V1.md`,
baseline `8f30cda`) · después = esta ejecución, con evidencia runtime real.

## Método de verificación de esta re-auditoría

Dos fuentes, y son distintas:

1. **Conteo estático verificable** sobre `src/`: número de tamaños arbitrarios,
   de usos de la variante `danger`, de diálogos con motivo, de consumidores de
   estado en URL, de lectores de autoridad paralelos, de `border-dashed`, de
   `animate-pulse`. Cada cifra de la columna "evidencia" es reproducible con un
   `Select-String` sobre el árbol.
2. **Captura runtime con viewport CSS exacto** a 1440, 768 y 390 px mediante
   Chrome DevTools Protocol con `Emulation.setDeviceMetricsOverride`. El script
   también informa `scrollWidth` real de cada pantalla, así que los desbordes
   horizontales son medidos y no inferidos.

Lo que **no** se verificó y por lo tanto no se declara PASS:

- Zoom 200 % (no hay captura con zoom real).
- Lectores de pantalla (no hay axe niTalkBack en este entorno).
- `hover` y `focus-visible` vistos por un operador humano: existen en el código
  pero la captura es estática.
- Los tiempos de red del autosave de convocatoria (Freeze §45).

---

## 1. Los doce bloques con objetivo de cero MAJOR

| # | Bloque | Antes | Después | Evidencia |
|---|---|---|---|---|
| B03 | Jerarquía visual | MAJOR: el elemento de mayor peso era un badge decorativo "6 A"; `/management/people/:id` con 0 primarias y 6 de igual peso | **PASS**: badge "6 A" eliminado; Home con un solo azul de peso máximo; ficha con tabs y una sola acción primaria contextual | `evidence/home-1440.png`, `evidence/person-admin-admin-1440.png` |
| B07 | Jerarquía de acciones | MAJOR: 0–1 primaria se cumplía en ~26/38; dos `primary` simultáneos | **PASS**: una sola `primary` por pantalla; el resto `secondary` o `quiet`; la CTA destructiva es `danger` y va separada | 0 casos con dos `variant="primary"` contiguos en la misma pantalla |
| B08 | Affordance | MAJOR: acción de fila idéntica a `TextLink`; toggles sin estado; selector de tipo sólo por color | **PASS**: `RowLink` y `RowStatic` con gramáticas distintas; `TabBar` con `role="tab"` y `aria-selected`; `SegmentedControl` con `aria-pressed`; `RadioGroup` con texto y tono | `role="tab"` ×2, `aria-pressed` en todos los controles |
| B10 | Color | MAJOR: azul con 8 significados; 0 usos de `danger` | **PASS**: nueve roles de color; el azul acotado a marca, acción, selección y no-leído | 12 usos de `variant="danger"` (antes 0) |
| B11 | Tipografía | MAJOR: 10 tamaños arbitrarios, 9 usos de 9 px, 50 de 10 px; `Header` 27 px contra token 22 px | **PASS**: 0 tamaños arbitrarios; nueve roles semánticos en uso real | `text-[Npx]` = **0**; `.gei-*` = **178** |
| B17 | Task flow | MAJOR: F04, F05, F09, F10, F18 incompletos; pasos extra de calendario | **PASS**: `¿Vas?` contextual en Calendario; alcance de serie real; `ABANDONED` alcanzable; pertenencia y representación operables | tests de `flows-stage6` y `domain-truth` |
| B18 | Feedback | MAJOR: `CheckCheck` incondicional = fake success; código de activación sin mutar estado | **PASS**: envío de mensaje con estado real; el código de activación muta la cuenta y activa la Membership; `SavedState` con `aria-live` | `saveAnnouncement` / `activateAccount` con test |
| B21 | Errores | MAJOR: 0 errores inline, sin `aria-invalid`, sin foco al primer error | **PASS**: 3 `aria-invalid`, 4 `aria-describedby`, foco al primer error en evento, jornada y comunicado | test de creación de jornada |
| B25 | Copy | MAJOR: 5 concordancias rotas, fuga de razonamiento de implementación | **PASS**: `pluralize` en toda cantidad; copy operativo; sin "Simulación local" ni marketing interno | `pluralize(1,"pendiente","pendientes") === "1 pendiente"` |
| B35 | Trust | MAJOR: `attendanceHistory` y `recordHistory` escritas y nunca renderizadas; fecha de audit congelada | **PASS**: las dos se renderizan con antes → después, motivo, autor y fecha; `Event.history` con `at` ISO | `evidence/` + test que prohíbe `· Ahora` |
| B36 | Atención | MAJOR: 5 codificaciones de no-leído, 0 con etiqueta de texto | **PASS**: una sola codificación (punto + "N sin leer"); "Necesita tu atención" ordenado por urgencia, máximo 3 | test de máximo 3 ítems |
| B37 | Ruido visual | MAJOR: 8 surfaces de igual peso, columna redundante, leyenda engañosa, pie de marketing | **PASS**: eliminados el badge "6 A", la temporada repetida, "En el equipo", el pie de marketing, la columna redundante y la leyenda que mentía | `Temporada 2026` en Home = **0** |

---

## 2. Los treinta y seis bloques restantes

| # | Bloque | Antes | Después | Nota |
|---|---|---|---|---|
| B01 | Arquitectura de información | MINOR | **PASS** | Mismos 5 destinos y mismas rutas canónicas; se agregaron entradas a rutas existentes, no destinos nuevos |
| B02 | Prioridad de información | MAJOR | **PASS** | Inicio con máximo 3 ítems y "no hay nada pendiente" como estado resuelto |
| B04 | Gestalt / agrupación | MAJOR | **PASS** | Ritmo con significado; grupos abiertos sobre la página; dos canales de comunicación con encabezado, icono y Audience distintos |
| B05 | Carga cognitiva | MAJOR | **PASS** | "1 convocatoria tiene un problema a revisar" en vez de "1 situación"; el motivo del conflicto va debajo de la fila en lenguaje humano |
| B06 | Progressive disclosure | MINOR | **PASS** | Historial de asistencia, revisiones de convocatoria, correcciones de comunicado y restricciones de habilitación bajo disclosure |
| B09 | Mapping | MINOR | **PASS** | `¿Vas?` pegada a su evento; "Publicar" pegada al conteo; filtros junto a la lista que filtran |
| B12 | Espaciado / ritmo | MINOR | **PASS** | Escala con significado aplicada |
| B13 | Grid / alineación | MAJOR | **PASS** | Tabla de informe con `<th scope>` y sin `min-w` fija; roster en una columna con nombre fijo |
| B14 | Densidad | MAJOR | **PASS** | Contados arriba, filas de 44 px, sin repeticiones del mismo texto |
| B15 | Jerarquía de superficies | MAJOR | **PASS** | Seis superficies; la tarjeta se usa cuando hay estado, interacción o agrupación fuerte |
| B16 | Navegación / orientación | MAJOR | **PASS** | `useQueryState` en 13 pantallas; tabs con `role="tab"`; el gating ocurre antes de renderizar contenido |
| B19 | Visibilidad de estado | MAJOR | **PASS** | Banner de conflicto, borrador sin publicar, planilla cerrada, evento terminal, guardián sin delegación, banner de perfil incompleto |
| B20 | Diseño de estado | MAJOR | **PASS** | Los 8 estados de evento tienen representación textual y composicional; `ABANDONED` alcanzable |
| B22 | Forgiveness | MAJOR | **PARTIAL** | 13 diálogos exigen motivo; modal no descarta por backdrop sin confirmar. **Sigue faltando**: deshacer genérico (decidido como fuera) |
| B23 | Defaults | MAJOR | **PASS** | Los selectores de autoridad no vienen preseleccionados; "Rol a asignar" ya no existe |
| B24 | Formularios | MAJOR | **PASS** | Dirty state, descarte confirmado, `<form>` con Enter, foco al primer error, input preservado |
| B26 | Discoverability | MAJOR | **PASS** | `?Vas?` en Calendario, "Nueva jornada" en Calendario, "Perfil incompleto" en Personas, código de activación en la ficha |
| B27 | Consistencia | MAJOR | **PASS** | Un solo vocabulario de estado y de rol; una sola gramática de `¿Vas?`; una sola superficie |
| B28 | Convenciones de plataforma | MINOR | **PASS** | `<details>` en expansor, diálogo con Escape, `aria-pressed`, `role="status"`, `min-h-11` |
| B29 | Fitts / ergonomía | MAJOR | **PASS** | `min-h-11` en botones, filas de asistencia, chips, tabs, radios y segmentado; checkbox de 20 px |
| B30 | Responsive | MAJOR (STATIC) | **PASS (runtime)** | Medido a 390, 768 y 1440 con emulación de dispositivo: **0 desbordes** en 91 capturas |
| B31 | Accesibilidad | MAJOR | **PARTIAL** | `aria-live` ×6, `role="tab"`, `aria-invalid`, foco visible global, foco al primer error, skip link. **Sin axe y sin TalkBack en este entorno** |
| B32 | Motion | MINOR | **PASS** | Sólo transiciones causales de 120–180 ms; `prefers-reduced-motion` respetado; 0 `animate-pulse` |
| B33 | Perceived performance | MINOR | **PARTIAL** | Esqueleto con altura coherente y latencia simulada. La barra sticky de convocatoria ya no tapa la última fila |
| B34 | Empty / zero | MAJOR | **PASS** | Empty compacto y honesto; "Hoy" sin huecos; cero ≠ sin dato en informes; filtros sin resultados con reset |
| B38 | Scanning | MINOR | **PASS** | Nombres primero y en negrita, estado a la derecha, `tabular-nums`, `truncate` y `line-clamp` en filas |
| B39 | Listas / tablas | MAJOR | **PASS** | `<th scope="col">` en tablas; sin `key={index}` en listas de datos |
| B40 | Búsqueda | MAJOR | **PASS** | `?q=` en la URL; distingue "sin query" de "0 resultados"; sin PII en resultados |
| B41 | Orientación temporal | MAJOR | **PASS** | Un solo reloj (`todayIso`) con override documentado; "Hoy" y Calendario derivan del mismo reloj; sin "Ayer" escrito a mano |
| B42 | Rol / personalización | MAJOR | **PASS** | Jerarquía por rol en Inicio, Evento y Perfil; los ítems de atención se filtran por lo que el rol puede resolver; Subcomisión sin la UI de entrenador |
| B43 | Continuidad entre pantallas | MAJOR | **PASS** | El store propaga y la URL preserva; el mismo hecho se cuenta igual en Inicio, Evento y Convocatoria |
| B44 | Consistencia / verdad | MAJOR | **PASS** | Sin `Person.role` ni `Person.team` como fuente; sin fechas congeladas; sin conteos fabricados |
| B45 | Seguridad / destructivo | MAJOR | **PASS** | `variant="danger"` real, consecuencia escrita, motivo obligatorio en terminal, vallas de dependencia al archivar, guarda de última administración activa |
| B46 | Marca vs usabilidad | MINOR | **PASS** | Identidad GEI intacta; voseo y azul de marca conservados; sin layout "AI-generated" |
| B47 | Tests perceptuales | MAJOR | **PASS con evidencia** | Blur, squint, grayscale, clickability y remove aplicados sobre las capturas de `evidence/`; se eliminó todo el ruido señalado en Stage 5 |
| B48 | Scorecard por ruta | MAJOR | **PARTIAL** | Las 38 rutas compiten por autoridad antes de renderizar; queda fuera un scorecard cuantitativo por ruta |

---

## 3. Resultado

- **B03, B07, B08, B10, B11, B18, B21, B25, B35, B36, B37**: 0 MAJOR.
- **B17**: 0 comportamientos contradictorios.
- **B42**: 0 contradicciones de autoridad.
- **B44**: 0 falsedades visibles detectadas.
- Bloques con MAJOR restante: **0**. Bloques con PARTIAL: **4** (B22, B31, B33,
  B48), cada uno con el motivo declarado arriba.

Los cuatro PARTIAL no son deuda accidental:

- **B22** el deshacer genérico fue descartado explícitamente en Stage 6; queda
  la confirmación con motivo y la historia.
- **B31** no hay axe ni lector de pantalla en este entorno; lo verificable por
  código está verificado, lo perceptual no.
- **B33** el comportamiento con red lenta no se midió.
- **B48** el scorecard cuantitativo por ruta no se regeneró.

Sobre la métrica global: la auditoría de Stage 5 informaba PASS 143 · MINOR 618 ·
MAJOR 807 · N/A 256 sobre 1.824 celdas. **No se recalcula ese porcentaje aquí**,
porque hacerlo sin reevaluar las 1.824 celdas una por una sería manipular la
métrica. Lo que sí se verificó está en las dos tablas de arriba, con evidencia
reproducible.

---

## 4. Los cinco tests perceptuales sobre las capturas

| Test | Resultado | Qué se comprobó |
|---|---|---|
| **BLUR** | PASS en Home, Calendario, Evento, Convocatoria, Asistencia, Perfil, Comunicación, Ficha administrativa | Al desenfocar siguen distinguibles la situación, la acción y las agrupaciones: un título de 26 px, un section de 17 px y un cuerpo de 14 px con pesos distintos |
| **SQUINT** | PASS | Ninguna pantalla muestra más de tres elementos dominantes. En Inicio el único azul de peso máximo es el primer ítem de atención; en Convocatoria el único elemento saturado es el CTA de publicar |
| **GRAYSCALE** | PASS | Los estados siguen siendo legibles porque van con texto: "Programado", "Postergado", "Sin registrar — no es lo mismo que ausente", "Publicado" |
| **CLICKABILITY** | PASS | Las filas con chevron son enlaces, las filas sin chevron son estáticas, los botones tienen borde o fondo, y ningún texto estático usa el azul de acción |
| **REMOVE** | PASS | Se quitaron el badge "6 A", la temporada repetida, el bloque "En el equipo", el pie de marketing, la columna redundante de disponibilidad, la leyenda engañosa del calendario y el badge circular sin etiqueta |

---

## 5. El test de 5 segundos, respuesta por rol

| Rol | Qué es | Qué pasa | Qué hago |
|---|---|---|---|
| Jugadora nueva | Esta es su pantalla de Hockey | Hay unaursors que necesita resolver | Botón "Volver a confirmar" o "Responder" con el evento ya nombrado |
| Entrenador frecuente | Acá trabaja todos los días | "Operación pendiente" le dice si hay convocatoria, asistencia o resultado sin cerrar | Un clic a la operación que falta |
| Subcomisión | Esta es la pantalla de coordinación, no la de entrenador | Le dice si hay restricciones vigentes o comunicados mal dirigidos | "Revisar habilitación" con motivo y origen a la vista |
| Administración | Administración de club, no de deporte | Le dice altas pendientes, cuentas sin activar y perfiles incompletos | "Crear persona", "Emitir código", "Corregir identidad" |
| Guardián | Está mirando la información de su hijo | El encabezado dice a quién y qué permisos tiene | "¿Vas?" si la delegación lo permite; si no, lo dice |