# GEI HOCKEY MANAGEMENT SYSTEM
## STAGE 5 — PERCEPTUAL UX + INTERACTION + FLOW COMPLETENESS AUDIT V1

**Estado:** AUDITORÍA. **AUDIT-ONLY.** Ningún archivo de `src/**` fue modificado.
**Baseline:** `8f30cda91bb531539864ed9175ab256598b17e88` · rama de auditoría `gei/stage5-ux-audit` (creada desde `gei/frontend-target-v1`).
**Autoridades:** `docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` > `docs/GEI_FRONTEND_TARGET_BLUEPRINT_V1.md` > `docs/GEI_IA_SIMPLICITY_RESEARCH_V1.md` > `docs/GEI_FRONTEND_IMPLEMENTATION_REPORT_V1.md` > derivados.
**Evidencia runtime:** `docs/GEI_STAGE5_RUNTIME_EVIDENCE_V1.md` (45 capturas + 39 volcados DOM sobre el build de producción).

---

# 1. EXECUTIVE SUMMARY

Stage 4 construyó una **base estructural serie**: 38/38 rutas, typecheck y 31/31 tests verdes, P0 = 0, y una gramática de componentes (`shared/ui.tsx` 17 primitives, `shared/patterns.tsx`) que es en su mayor parte **código muerto**. El problema del producto hoy no es de Construction: es de **jerarquía**.

Tres afirmaciones que la evidencia sostiene:

1. **La IA es correcta y está implementada.** 5 destinos idénticos en bottom nav y sidebar, cross-highlight, breadcrumbs en vocabulario usuario, Real Clock,Draft/Publicado explícito, unconfirmed success, PII gating por rol funcionando (verificado: un jugador NO ve badges de elegibilidad; un coach SÍ). Un usuario nuevo **sí** puede recorrer Inicio → Calendario → Evento → ¿Vas? sin que le expliquen nada.
2. **El color no dirige porque el acento no está reservado.** El azul GEI marca ocho cosas a la vez (marca, acción primaria, nav activa, chip de contexto, icono de fila, link de acción, badge, punto decorativo) y hay **0 usos de `variant="danger"`** en todo `src/`. Además el rojo se usa para un estado que Product Truth §14 declara permitido y esperado (publicar con conflicto). Resultado: el ojo no tiene ninguna señal fiable.
3. **Las pantallas "correctas pero incompletas" son el patrón dominante.** `/more/profile` renderiza **4 datos y 2 botones** en el 22 % de la pantalla y promete en su descripción "tu acceso" sin mostrar ningún acceso. `/people/:personId` es una ficha read-only sin ninguna acción. `/events/:id` con estado CANCELLED renderiza exactamente la misma pantalla que uno vivo. `/communication` separa los canales estructuralmente pero no perceptualmente.

**Veredicto:** el frontend **no** está listo para congelarse. De 38 rutas, **ninguna** es COMPLETA bajo el criterio §5 del encargo. El problema dominante no es S4 (polish) sino **S1/S2**: capacidades de Product Truth que existen y no tienen superficie, y gramáticas que existen y no están conectadas.

| Métrica | Resultado |
|---|---|
| Rutas auditadas | **38/38** |
| Bloques B01–B48 cubiertos | **48/48** (1 824 celdas: PASS 143 · MINOR 618 · MAJOR 807 · N/A 256) |
| Rutas COMPLETAS bajo §5 (ciclo completo) | **0/38** |
| Rutas COMPLETAS como superficie | **2/38** (`/no-access`, `/reports`) — 28 PARTIAL, 8 INCOMPLETE |
| Flujos F01–F30 COMPLETE | **1/30** (F17) |
| Flujos PARTIAL | 17/30 |
| Flujos MISSING | 8/30 |
| Flujos CONTRADICTORY | 4/30 |
| Capacidades C01–C16 COMPLETE | 4/16 |
| Capacidades PARTIAL | 9/16 |
| Capacidades MISSING | 2/16 |
| Capacidades CONTRADICTORY | 1/16 |
| Hallazgos sistémicos | **46** (UX-01 … UX-46) |
| Product gaps | 7 (PG-01 … PG-07) |
| Product discovery candidates | 5 (PDC-01 … PDC-05) |

---

# 2. METODOLOGÍA

| Fase | Qué se hizo |
|---|---|
| Preflight | `typecheck` PASS · `test` 31/31 PASS · `build` PASS · `git status` limpio · rama y HEAD verificados |
| Lectura de autoridades | Product Truth v1.0.1 completo (2652 líneas), Blueprint completo, IA Research, Implementation Report, Freeze Candidate, Stage4 Gaps, Figma audit/matrix |
| Inventario de código | Los 34 archivos de `src/` leídos: 6 features (≈5 700 líneas), `app/`, `shared/` (4), `mock/` (8), `styles/`, 4 tests |
| Runtime | Servidor `vite preview` sobre `dist/`; 38/38 rutas con `--dump-dom`; 45 capturas con Chrome/Edge headless ya presentes en el sistema; sin instalar dependencias |
| Roles | PLAYER, CAPTAIN, COACH, SUBCOMMITTEE, ADMIN con evidencia runtime; GUARDIAN sólo STATIC (el harness `?demo=` no lo contempla, `store.tsx:83-93`) |
| Viewports | 500 / 768 / 1440 verificados. **390 px NO verificable** (ancho mínimo de SO ≈ 500 px, controlado con captura de contraste) |

Cada afirmación de este documento está marcada `RUNTIME` (observada en pantalla o DOM renderizado), `STATIC` (lectura de código) o `INFERENCIA`.

---

# 3. VEREDICTOS POR BLOQUE (B01–B48)

Leyenda: **PASS** / **MINOR** / **MAJOR** / **N/A**.

| # | Bloque | Verdict | Evidencia determinante |
|---|---|---|---|
| B01 | Information Architecture | **MINOR** | IA global correcta (`docs/GEI_FRONTEND_TARGET_BLUEPRINT_V1.md` §1 respetada, `Shell.tsx:29-35`). Defectos: `/management/competitions` es working para SUBCOMMITTEE pero su hub padre lo niega (RUNTIME R-46); "MI EQUIPO" del sidebar muestra "Administración" para ADMIN (`Shell.tsx:133-155`); label `/audit` = "Historial" mientras el hub dice "Auditoría" |
| B02 | Prioridad de información | **MAJOR** | Home: la L1 "Hoy" es un vacío de 200 px y el ítem más urgente (partido con conflictos a 7 días) va segundo detrás de una planilla de ayer (RUNTIME R-01.4). ADMIN ve "0 pendientes" + "Nada pendiente." (R-01.12). `/more/profile` no tiene L0 de acceso |
| B03 | Jerarquía visual | **MAJOR** | El elemento de mayor peso en la columna lateral de Home es un badge decorativo **"6 A"** wrongly derivdo (RUNTIME R-01.2). `/management/people/:id` tiene **0 acciones primarias** y 6 acciones de igual peso (R-40). `p32-live` concentra 3 banners de color a la vez (R-06.19) |
| B04 | Gestalt / agrupación | **MAJOR** | Selection: buscador y filtro separados por ~450 px (R-06.23). Home: 8 superficies con dos lenguajes (`Surface` vs div crudo) y un bloque sin contenedor (R-01.5). Communication: dos canales con container/radio/icono/fila idénticos (R-08.30) |
| B05 | Carga cognitiva | **MAJOR** | `/more/profile` exige aprender qué es "Contexto" y "Pertenencia vigente" sin explicación. EventDetail muestra "1 conflicto actual" al jugador sin decir a quién ni qué hacer (R-05.18). "0 sí" en el rail (R-04.14) es indescifrable |
| B06 | Progressive disclosure | **MINOR** | L3 casi inexistente pero el L2 se'$, bien resuelto. Ausente el disclosure que Product Truth sí exige: sin historial de asistencia, sin revisiones de convocatoria, sin `constraints` de elegibilidad visibles. `details` sólo se usa en Login e historial de evento |
| B07 | Action hierarchy | **MAJOR** | 0–1 primaria se cumple en ~26/38 rutas. Falla en: `/management/people/:id` (0 primarias, 6 acciones), `/communication` (primaria es secondary), `/announcements/:id` (0 primarias), `/management/teams/:id` (destructiva sin modal), `/communication/conversations/new` (2 controles con peso primary a la vez) |
| B08 | Affordance / significadores | **MAJOR** | Botón vs link vs fila: la action de fila de Home es `text-[11px] font-semibold text-primary` idéntico a `TextLink` (`overview.tsx:233` vs `ui.tsx:495`) → 6 elementos con la misma clase. Toggles Mes/Agenda sin estado activo; selector de tipo de evento sólo por color; `RECONFIRM` cae a tono neutral |
| B09 | Mapping | **MINOR** | En general correcto: "¿Vas?" está pegado a su evento, "Publicar" pegado al conteo. Falla en `/management/structure` (el select de tab no está junto a la lista que filtra) y en Calendar (no hay acción Where Is the object) |
| B10 | Color | **MAJOR** | 0 usos de `variant="danger"`. Acento sin reserva (8 significados). ERROR + SUCCESS apilados para el mismo hecho (R-06.19). `ABANDONED` mapea a warning pero `PLAYED` a success y `DISABLED` a danger mientras `ARCHIVED` y `CLOSED` son neutral → el color no ordena nada |
| B11 | Tipografía | **MAJOR** | 10 tamaños arbitrarios (8, 9, 10, 11, 12, 13, 14, 15, 16, 27 px); 9 usos de 9 px, 50 de 10 px. `theme.css` define 4 roles semánticos y sólo se usan en `patterns.tsx`, `vas.tsx` y 4 líneas de features. `Header` de `ui.tsx:158` usa 27 px contra el token de 22 px. Los `.gei-*` tienen **0 consumidores fuera de ~25 líneas** |
| B12 | Spacing / rhythm | **MINOR** | La escala `--space-*` existe y `--space-section/page` se usa bien. Pero el ritmo no comunica: en `/more/profile` un solo bloque de 340 px en 1500 px de alto; en Home el bloque "En el equipo" sin surface rompe la agrupación |
| B13 | Grid / alignment | **MAJOR** | Selection: 4 columnas en ~900 px para datos de ~150 px, columna JUGADORA de 490 px. `/more/profile`: dos columnas de un `dl` a 370 px de distancia. Reports: `min-w-[560px]` con scroll horizontal dentro de un contenedor |
| B14 | Density | **MAJOR** | Rosters de 18 filas a ~70 px en 1440 px; 18 repeticiones de "Necesita reconfirmación" que no aportan información (R-06.20). En contraextremo: `/more/profile` usa el 22 % del viewport para 4 datos |
| B15 | Surface hierarchy | **MAJOR** | `Surface` (blanco + borde) es el único contenedor: page/section/surface/control se distinguen sólo por `background` (#f5f7fa) vs `card` (#ffffff). No hay nivel "overlay" reutilizable, no hay nivel "control". 6+ cards idénticos por pantalla. `Empty` usa borde punteado = lenguaje visual distinto (R-01.1) |
| B16 | Navigation / wayfinding | **MAJOR** | `useSearchParams` = **0** en todo `src/` ⇒ ningún filtro/tab/mes está en la URL ⇒ Back no preserva origen (viola §24). Tabs sin `role="tab"`. Gating in-page: el breadcrumb ya dice "Gestión"/"Historial" antes de negar (R-45). Cross-highlight funciona ✓ |
| B17 | Task flow | **MAJOR** | F04 Home, F05 Calendar, F09/F10 Event series y F18 People admin no completan camino. Details en §Flow. Pasos extra: Calendar → Evento → Availability para responder un "¿Vas?" |
| B18 | Feedback | **MAJOR** | `CheckCheck` se renderiza incondicionalmente en todo mensaje propio = *fake success* sin estado detrás (`communication.tsx:470`). Enviar mensaje no tiene estado "enviando". `Saved` sólo se usa en Availability. "Generar código de activación" escribe audit y **no muta estado** (no fake success permitido: §24) |
| B19 | System status visibility | **MAJOR** | Sólo 3 de los 11 estados de §43/§45 existen. `CONFLICT` de autosave no existe. `scenarioTriggered` es un `useRef` del provider ⇒ el escenario stale/impact-changed **sólo se dispara una vez por sesión**; después la ruta de conflicto es inalcanzable |
| B20 | State design | **MAJOR** | Cobertura de estados por pantalla: EventDetail 7/8 (falta ABANDONED inalcanzable), Availability 6/11, Selection 8/10, Attendance 7/8, MatchRecord 9/9. Estados terminales sin refuerzo cromático ni textual fuera del badge (R-04.15) |
| B21 | Errors | **MAJOR** | **0** errores inline en todo el producto: `TextField`/`Select`/`TextArea` no aceptan `error`/`aria-invalid`/`aria-describedby`. 0 foco al primer error. El `Alert` de validación vive **después** de las 4 superficies ⇒ fuera de pantalla en mobile. Sin reintento en `SAVE_ERROR` |
| B22 | Forgiveness / reversibility | **MAJOR** | 0 `undo`. "Archivar" es irreversible sin restore (D-06/D-08). Backdrop de `Modal` **descarta el formulario sin confirmar** (`ui.tsx:363-366`). Eliminar mensaje no pide confirmación. Confirmanzas: sólo 4 de 12 acciones destructivas |
| B23 | Defaults | **MAJOR** | Selects prellenados con el valor actual o la primera opción en operaciones que cambian autoridad: "Equipo de destino = Sexta A 2026" (actual), "Rol a asignar = Entrenador" (primera opción) ⇒ clic accidental = traslado no-op destructivo o asignar COACH (R-40.40) |
| B24 | Forms | **MAJOR** | 0 dirty state, 0 confirmación de descarte, 0 `required` visible más allá de `*`, 0 `<form>` en EventForm (`Enter` no submitea), 0 foco a primer error, helper text ausente en 4 formularios. Lo que sí está bien: **el input se preserva siempre en error** (§24/§73 cumplido) |
| B25 | Copy / content design | **MAJOR** | Concordancia rota en 5 lugares (`1 pendientes`, `1 jugadora con conflicto actual`, `1 partidos`, `3 situación`, `n jugadoras sin registrar` con n=1). Fuga de razonamiento de implementación: "Sin lista de registros: sólo lo que requiere mirar" (`account-insight.tsx:873`), "Simulación local · Uso único" (`management.tsx:980`). Jerga: "situación", "conflicto actual", "Pertenencia vigente", "renglón" |
| B26 | Discoverability | **MAJOR** | Capacidades casi nadie descubre: `?Vas?` en Calendar (ausente), filtros de Structure, "Generar código de activación", "Abrir para corregir" asistencia, `Detalle de jornada` desde Evento, reports para jugadoras (3 clicks desde Inicio). `/jornadas` desde `/more` sólo si `state.jornadas.length > 0` |
| B27 | Consistency | **MAJOR** | **Dos** vocabularios de estado conviviendo (`model.labels` vs `states.STATE_TEXT`): "Entrenador" vs "Entrenador o entrenadora" (RUNTIME confirmado en Home vs TeamDetail), "Elegible" vs "Habilitada" (3 etiquetas para un valor), "Sí" vs "Voy". **Dos** gramáticas de ¿Vas?. **Dos** lenguajes de superficie. "Reportes" vs "Informes" |
| B28 | Platform conventions | **MINOR** | Se respetan convenciones: `<details>`, `<dialog>`-role, focus trap, Escape, scroll-lock, `aria-pressed` en ¿Vas?, `role="status"`, `min-h-11`. Falla: menú de overflow sin `role="menu"`/`Escape`/click-outside; composer del chat con `sticky` que no se ancla; `key={index}` en listas |
| B29 | Fitts / ergonomics | **MAJOR** | `Button` = `min-h-10` (40 px) < 44 px exigido por Blueprint §7. Attendance: 3 botones de fila a `min-h-9` = **36 px** con `gap-1.5` ⇒ riesgo real de *mis-tap* con consecuencia de dato. Checkbox `size-4` (16 px) ampliable sólo en Selection. Links de 18 px ("Ver historial del evento", "Ver jornada") |
| B30 | Responsive | **MAJOR (STATIC)** | 390 px no verificable. STATIC: 2 columnas sólo a `xl` (1280) ⇒ en 1024–1279 el panel lateral cae al final del feed; tabla de People pierde 2 de 4 columnas bajo 768 px sin fallback; Reports con `min-w-[560px]`; header de tabla de Selection se oculta en mobile **y con él las etiquetas de columna** ⇒ "Sí" y "Habilitada" sin rótulo; toggle "Mes" es **no-op silencioso** bajo 768 px |
| B31 | Accessibility | **MAJOR** | `aria-live` = **0**. `role="tab"` = **0**. 0 `aria-*` en `management.tsx`. `aria-invalid` = **0**. Menús sin semántica. `Restricted` sin `h1`. Skips h1→h3 (Structure, People, Notifications vacío). Foco inicial del modal en el botón "Cerrar". Checkbox sin `aria-describedby` del conflicto |
| B32 | Motion | **MINOR** | `prefers-reduced-motion` respetado globalmente ✓. Pero **no hay motion causal en ninguna parte**: la fila que desaparece de "Necesita tu atención" no se anima, la publicación no transiciona, el cierre de planilla no se señala. §9 del Blueprint permite micro feedback y state transition; ninguno existe. Faltan transiciones donde el cambio "parece mágico" |
| B33 | Perceived performance | **MINOR** | Skeleton global en `Shell.tsx:237-252` con 3 cards de altura fija ✓. `wait()` simula latencia ✓. Falla: enviar mensaje tiene 200 ms de ventana muerta sin señal; la barra sticky de Selection tapa contenido; `Modal` sin `z-index` explícito frente al bottom nav |
| B34 | Empty / zero / first use | **MAJOR** | Empty ≠ zero ≠ error se cumple **a medias**: 9 superficies vacías sin copy (`Surface` vacía) frente a 11 con `Empty` correcto. `Home` "Hoy" vacío con 200 px de alto. Guardian ve `Surface` vacía en `/teams`. No hay estado "filtrado sin resultados" con acción de reset en 4 listas |
| B35 | Trust | **MAJOR** | **Historial escrito pero invisible**: `attendanceHistory` y `recordHistory` se escriben (`store.tsx:272-282`, `:304-313`) y **no se renderizan en ninguna parte** ⇒ P0-2/P0-3 declaran "CLOSED con before/after" y el usuario nunca lo ve. `audit` sin before/after ni link al objeto. Fechas de audit congeladas ("02 oct 2026 · Ahora"). Conteos fabricados en Impact Preview (15, 19). Badge "6 A". `Generate código` sin efecto |
| B36 | Attention management | **MAJOR** | 5 codificaciones distintas de no-leído en el producto (badge 8 px, badge 10 px, dot 1.5 px, dot 2 px, tint de fila), 0 con etiqueta de texto. Chip "0 pendientes" en ámbar. ERROR+SUCCESS simultáneos. Sin urgencia ni orden |
| B37 | Visual noise | **MAJOR** | Recuento por pantalla: Home 8 surfaces + 6 clases de link idénticas + 3 repeticiones de "Temporada 2026". Selection 4 columnas para 3 datos útiles + columna enteramente redundante + 18 repeticiones de un texto inútil. `Empty` con icono default `CalendarDays` en 5+ pantallas no-agenda. Iconos mal nombrados (`FlagIcon` renderiza `CalendarDays`, `MessageIcon` renderiza `Users`) |
| B38 | Scanning | **MINOR** | Anchors correctos (nombre primero, bold; estado a la derecha; `tabular-nums` en números). Falla: no hay `truncate`/`line-clamp` en ninguna fila ⇒ preview de mensaje en 640 px de columna; metadatos de 4 items en una línea de 11 px |
| B39 | Lists / tables | **MAJOR** | 6 de 6 tablas sin `<th>` semántico (Selection usa `<span>`), sin orden, sin selección masiva, sin sticky header, sin row-actions. Degradación mobile pierde etiquetas de columna. `RowLink` con chevron vs `<Link>` sin chevron en la misma app |
| B40 | Search / filtering | **MAJOR** | Búsqueda global existe pero **la query no está en la URL** ⇒ Back no la preserva. 4 listas con filtros sin reset y sin persistencia. `/search` no devuelve nada en el estado inicial con copy adequate, pero no cubre eventos (§12 mapping lo pedía). No hay "no results" con sugerencia |
| B41 | Temporal orientation | **MAJOR** | Hoy/Próximamente/Pasado existen pero: Home excluye POSTPONED de "Hoy" mientras Calendar lo lista (dos verdades); "Próximamente" muestra un evento Postergado con fecha "sáb, 17 oct" y hora "A definir"; `Thread` muestra "Hoy · 2 de octubre" con fecha real 3 oct; reports con periodos literales |
| B42 | Role / contextual personalization | **MAJOR** | El **gating** funciona (verificado en 5 roles). La **jerarquía por rol** no: Home de ADMIN queda vacío (R-01.13); Home de PLAYER y COACH comparten estructura con distinto contenido; TeamDetail de jugador quita badges pero conserva la misma jerarquía; SUBCOMMITTEE recibe ítems de "Necesita tu atención" que no puede resolver |
| B43 | Cross-screen continuity | **MAJOR** | Propagación de estado existe en el store (`update`/`updateEvent` re-renderizan). Falla la **continuidad de contexto**: volver de Availability a Event pierde el scroll; el filtro de mes de Calendar no se conserva; el tab de Communication resetea; "Necesita tu atención" de Home no se alinea con las alertas de EventDetail (Home muestra "1 jugadora con conflicto actual", Selection muestra "1 situación", EventDetail muestra el alert) — tres cifras del mismo hecho en tres Redemption |
| B44 | Information consistency / truth | **MAJOR** | La misma verdad se cuenta de tres formas (arriba). Fechas congeladas. `Person.team`/`role` vs assignments (S4-04). Guardian listada como "Jugadora / Club" (R-39.35). Temporada con estado "Activo" inexistente (R-41.43) |
| B45 | Safety / destructive design | **MAJOR** | `variant="danger"` = 0. "Deshabilitar cuenta" con el mismo peso que "Finalizar pertenencia" (R-40.38). Archivar sin modal y sin restore. Eliminar mensaje sin confirmación. Publicar sin diff ni revisión visible. Selects por defecto en operaciones de autoridad |
| B46 | Brand vs usability | **MINOR** | Identidad GEI coherente: azul único, mark, "Un equipo, un mismo lugar.", avatar por iniciales, voseo. Riesgo de "AI-generated UI": tipografía de 10 tamaños arbitrarios, cards uniforme para todo, badge decorativo "6 A", `IconButton` de 40 px, y un pie de sidebar con copy de marketing a 10 px |
| B47 | Perceptual tests | **MAJOR** | 5-segundo: PASS en Home, Calendar, EventDetail, Selection, Communication. FAIL en `/more/profile` (no dice qué es mi rol/alcance) y en `/management/people/:id`. Blur: **no sobrevive** en Selection (2 banners de color dominan), Home (8 surfaces iguales) y profile. Squint: FAIL en Home (todo pesa 5). Grayscale: PASS en estados (siempre texto). Clickability: PASS salvo links de 11 px idénticos a `TextLink`. Remove test: FAIL en "Temporada 2026" ×3, el badge "6 A", la columna DISPONIBILIDAD entera, el bloque "En el equipo" sin función. 200 % zoom: sin verificar (no hay zoom en las capturas). Keyboard: modal ✓, menús ✗, tabs ✗ |
| B48 | Screen scorecard | **MAJOR** | 0/38 pantallas tienen una jerarquía L0 → L1 → L2 que se sostenga al desenfocar. El scorecard por ruta está en `docs/GEI_STAGE5_SCREEN_AUDIT_MATRIX_V1.md` |

**Totales B01–B48:** PASS **0** · MINOR **5** · MAJOR **42** · N/A **1** (B06 parcialmente, B47 marked MAJOR).

---

# 4. ASPECTOS MÁS FUERTES (KEEP sin discusión)

1. **La arquitectura de información se respeta.** 5 destinos, misma gramática en mobile y desktop, cross-highlight correcto, breadcrumbs en vocabulario usuario, "Mi espacio" eliminado. Un usuario nuevo encuentra Inicio, Calendario, Equipos, Comunicación y Más sin explicación.
2. **El modelo de datos mock se migró a la forma canónica.** `eligibilityConstraints[]`, `memberships[]`, `teamAssignments[]`, `guardianRelationships[]`, `venues[]`, `eventSeries[]`, `targetTeams[]`, `credentialVersion`. Los P0-1 a P0-6 están efectivamente cerrados.
3. **El gating por rol funciona y se verificó en runtime.** Coach ve badges de elegibilidad y jugador no; jugador no ve el alert de conflicto; ADMIN no ve conversaciones privadas; SUBCOMMITTEE no ve el tab Conversaciones; guardian no ve el tab Comunicación. Es la capa de autoridad más fiable del producto.
4. **Draft ≠ Publicado se ve y se explica.** "Publicada · 12 jugadoras. Los cambios actuales se guardan como borrador hasta una nueva publicación." es la mejor frase de producto del frontend.
5. **`UNRECORDED` nunca se convierte en `ABSENT`** y el copy lo dice ("Sin registrar no significa ausente"). Verificado en las 3 apariciones.
6. **La inmutabilidad de la audiencia publicada se respeta en UI y en mutación**, con el texto correcto ("Si fue incorrecta, corresponde crear un comunicado nuevo").
7. **`MatchRecord FINAL` bloquea la edición y exige corrección con motivo**, con before/after persistido.
8. **El input nunca se pierde en error** — §24 y §73 cumplidos en los 12 formularios.
9. **`Modal` es correcto**: focus trap, Escape, scroll-lock, restore de foco, `role="dialog" aria-modal`.
10. **Los estados de dominio siempre tienen texto**, nunca sólo color. `stateText` sin fallback silencioso + warning en DEV. Ésta es la decisión de diseño más acertada de Stage 4.
11. **Real Clock en la capa de UI** (§15.1 del Blueprint) con override DEV explícito.
12. **La copy de "blocked + reason" funciona cuando existe**: "Para cerrar la competencia deben finalizar todas sus inscripciones activas", "No se puede archivar: hay asignaciones o eventos activos", "Debe permanecer al menos un administrador con cuenta activa".

---

# 5. ASPECTOS MÁS DÉBILES

1. **Color**: 0 danger, acento sin reserva, error y success simultáneos, `RECONFIRM` con tono neutral.
2. **Jerarquía**: 8 superficies del mismo peso en Home; 6 acciones de igual peso en la ficha de persona; 2 banners de color dominando Selection.
3. **Completitud de superficie**: `/more/profile`, `/people/:personId`, `/announcements/:id`, `/jornadas/:id`, `/reports/*` son pantallas que "funcionan" y no responden lo que su nombre promete.
4. **Verdad**: historial invisible, conteos fabricados, "6 A", guardian como "Jugadora", fecha de audit congelada, `CheckCheck` sin estado.
5. **Errores y formularios**: 0 inline, 0 dirty, 0 foco, 0 `Enter` en el formulario de evento, 0 confirmación de descarte.
6. **Estado**: `CANCELLED` y `POSTPONED` sin consecuencia comunicada; `ABANDONED` inalcanzable; autosave sin estado `CONFLICT`.
7. **Responsive**: los patrones de panel lateral arrancan en `xl` (1280) cuando el documento define desktop en 1024; las tablas pierden información bajo 768 px sin fallback.
8. **Accesibilidad**: `aria-live` 0, `role="tab"` 0, 0 `aria-invalid`, menús sin semántica.

---

# 6. ANÁLISIS DE JERARQUÍA PERCEPTUAL

## 6.1 Distribución de peso (10 = máximo)

Home (COACH, 1440 px) — asignación conceptual observada:

| Elemento | Peso observed | Peso funcional correcto | Desvío |
|---|---|---|---|
| Badge "6 A" decorativo (card lateral) | **9** | 1 | **−8** |
| Botón "Crear evento" | 8 | 9 | −1 |
| Badge "3 pendientes" | 4 | 6 | −2 |
| Título de sección "Necesita tu atención" | 6 | 8 | −2 |
| 3 filas de atención (iguales entre sí) | 5 c/u | 8/6/5 | la 1ª debería dominar |
| Empty "Hoy no hay actividades" (200 px) | 5 (superficie) | 2 | +3 |
| Card "Próximo partido" | 4 | 6 | −2 |
| Bloque "En el equipo" sin surface | 3 | 3 | ✓ |
| "Temporada 2026" (×3) | 4 | 1 | **+3 ×3** |
| Links de acción (6 con clase idéntica) | 4 | 3 | +1 |

**Diagnóstico:** el peso está mal *distribuido*, no sólo mal *nivelado*. El elemento más pesado es decorativo y falso; los elementos funcionales Urgen están en 5–6.

## 6.2 Budget de acento

| Uso del azul GEI | Pantallas | ¿Debería ser acento? |
|---|---|---|
| Marca (logo "GEI") | todas | sí, 1 vez |
| Acción primaria (`bg-primary`) | todas | sí |
| Nav activa (fondo `primary-soft`) | todas | sí |
| Chip de contexto de equipo | Home | no → neutral |
| Icono de fila (`EventIcon` match = `primary-soft`) | Home, Calendar, Evento | no → neutral |
| Link de acción (`text-primary` 11px) | ~6 por pantalla | no → debería ser el único acento |
| Badge/avatar de línea (`bg-primary text-white`) | Home | no |
| Punto de "MI EQUIPO" | Shell | no |
| Fila seleccionada (`bg-primary-soft/40`) | Selection | sí |
| Checkbox `accent-primary` | Selection, R18, R22 | sí |
| Contador de no-leído | Communication, Shell | sí |

**Conclusión:** el acento está gastado en ~5 usos que deberían ser neutros. Reservar el azul para (a) acción primaria, (b) selección, (c) estado que requiere acción, (d) no-leído, liberaría la señal.

## 6.3 Niveles de superficie

Sólo hay **dos** niveles reales: `background #f5f7fa` (page) y `card #ffffff` + `border #e5e9f0` (todo lo demás). No existe un nivel "control" ni un nivel "overlay" reutilizable. Consecuencia: `Surface`, `DetailSection`, `FormSection` y `EventSummary` son **el mismo objeto visual** con distintos radios.

## 6.4 Escala tipográfica

Tokens definidos: 22 / 15 / 13 / 11 px. Tamaños reales: 27, 16, 15, 14, 13, 12, 11, 10, 9, 8 px.
Los niveles L0–L3 **no se perciben** porque el salto del título de sección (15) al body (13) es de 2 px y no hay peso ni color que compense. `Header` (27 px) y `PageContextHeader` (22 px) conviven para la misma función.

## 6.5 Test de desenfoque (blur)

- **Home**: no sobrevive. Al desenfocar quedan 8 rectángulos blancos iguales.
- **Selection**: no sobrevive. Dominan dos bandas de color (roja y verde) que describen un solo hecho.
- **Communication**: sobrevive parcialmente (el badge de no-leído es el único acento).
- **`/more/profile`**: no sobrevive. Sólo se ve "Mi perfil" y dos botones.
- **EventDetail**: sobrevive; el "¿Vas?" y el rail se leen.
- **Selection de jugador (read-only)**: no sobrevive; es una lista de nombres sin jerarquía.

---

# 7. ANÁLISIS DE INTERACCIÓN

| Dimensión | Estado | Evidencia |
|---|---|---|
| Descubribilidad de acción primaria | **MAJOR** | En 8 rutas la acción primaria es `secondary`, `ghost` o un link de 11 px. En `/announcements/:id` no existe. |
| Claridad de alcance de la acción | **MINOR** | "Archivar" sin modal en estructura/equipo/competencia; "Eliminar mensaje" sin confirmación |
| Feedback de mutación | **MAJOR** | 1 toast global (`role="status"`, 3.6 s, sin acción "Deshacer"). Sin estado "enviando" en chat. `CheckCheck` sin estado. |
| Feedback de error | **MAJOR** | 0 inline; alert global al final del formulario; sin reintento; sin foco |
| Estados de sistema visibles | **MAJOR** | 3 de 11. `CONFLICT` de autosave inexistente; escenario stale/impact-changed de un solo uso |
| Revertibilidad | **MAJOR** | 0 undo; archivar irreversible; backdrop descarta |
| Defaults | **MAJOR** | selects de autoridad prellenados |
| Touch targets | **MAJOR** | 40 px global, 36 px en Attendance, 16 px en checkbox, 18 px en links |
| Teclado | **MAJOR** | modal ✓; menús ✗; tabs ✗; sin `aria-live` |
| Formularios | **MAJOR** | Enter no submitea en EventForm; sin `<form>`; sin dirty |

---

# 8. HALLAZGOS DE INFORMATION ARCHITECTURE

**Correcto y a mantener:**
- 5 destinos, profundidad máx. 3 niveles, nada diario en "Más", nada admin en tabs diarias.
- Guardian no tiene destino propio (cumple §20 v1.0.1).
- Cross-highlight de Calendario/Comunicación/Más.
- `Communication` se oculta al guardian (ÚNICO caso de tab oculto; §20 lo exige).

**Defectuoso:**
1. `/management/competitions*` es working para SUBCOMMITTEE pero su hub padre `/management` le dice "Sección no disponible". El actor llega por `/more → Competiciones` a una URL bajo `/management` que su propio padre niega. **URL bajo un padre que no le pertenece.**
2. El sidebar rotula "MI EQUIPO" y dentro pone "Administración" para ADMIN.
3. `/audit` se anuncia como "Historial" en el breadcrumb y como "Auditoría" en el hub y en el título.
4. "Reportes" (hub) vs "Informes" (breadcrumb).
5. "Temporada 2026" como chrome permanente en sidebar + chip + footer: la temporada no es un destino, es un dato, y ocupa 3 posiciones visuales.
6. `/teams` desde `/management` es una superficie **deportiva** en un hub administrativo, etiquetada con la palabra inglesa "roster".
7. ADMIN no tiene entrada a `Competitions` desde `/more` aunque §5 se la concede.
8. `/people/:personId` está en el mapa de Equipos pero no ofrece ninguna acción → nodo muerto.
9. Calendar no ofrece "¿Vas?" ⇒ la ruta canónica de la tarea más frecuente del producto (responder disponibilidad) es Home o EventDetail, no Calendar, que es donde el usuario realmente está.

---

# 9. HALLAZGOS DEL SISTEMA VISUAL

| Sistema | Estado | Nota |
|---|---|---|
| Color — tokens | **PASS** | 17 tokens semánticos coherentes, buen contraste de `warning` (#9a6515 ≈ 4.9:1) |
| Color — uso | **MAJOR** | accent sin reserva, 0 danger, error/success simultáneos |
| Color — mapeo de estado | **MAJOR** | `RECONFIRM` inexistente en el enum; `ABANDONED`=warning pero `CLOSED`/`ARCHIVED`=neutral |
| Tipografía — tokens | **PASS** | 4 roles semánticos + 3 utilidades de spacing declarados |
| Tipografía — adopción | **MAJOR** | ~25 líneas de 5 700 usan los tokens; el resto usa px arbitrarios |
| Tipografía — contraste de niveles | **MAJOR** | saltos de 2 px sin peso ni color |
| Spacing — escala | **PASS** | page 28 / section 24 / group 16 / row 12 / inline 8 |
| Spacing — uso | **MINOR** | el ritmo no comunica agrupación en 6 superficies |
| Grid — consistencia | **MAJOR** | columnas de 490 px para nombres de 150 px; `dl` a 370 px de separación |
| Grid — max-width | **MINOR** | `max-w-3xl` en profile y management; `max-w-[1440px]` en main |
| Superficies | **MAJOR** | 1 primitive para 4 niveles conceptuales |
| Iconografía | **MINOR** | Lucide consistente; 2 iconos mal nombrados/renderizados; `Empty` con `CalendarDays` universal |
| Borders | **MINOR** | `border-border` como separador de fila en 6 surfaces; el borde está haciendo el trabajo del límite de superficie |
| Shadows | **PASS** | `--shadow-floating`/`--shadow-overlay` declarados; uso sólo en toast y modal |
| Motion | **MINOR** | tokens declarados, `reduced-motion` respetado, **cero** motion causal implementado |
| Densidad | **MAJOR** | 18 filas × 70 px en desktop; 340 px de card en 1500 px de alto |

---

# 10. TRUST, SAFETY Y ACCESIBILITY

**Trust — hallazgos críticos:**
1. `attendanceHistory` y `recordHistory` se escriben y **nunca se leen**. El before/after que el Implementation Report declara cerrado (P0-2, P0-3) es invisible para el usuario.
2. `state.audit` se lee en **una** pantalla; las fichas de persona, evento, comunicación y estructura no muestran rastro.
3. Fechas de audit congeladas en `"02 oct 2026 · Ahora"` (`store.tsx:131`) mientras la UI usa reloj real ⇒ el historial muestra viajes en el tiempo.
4. Impact Preview muestra conteos **fabricados**: "15 personas recibirán la actualización" (número fijo), "19" hardcodeado en jornada, y "…al programarse" en eventos cancelados.
5. `notify()` incluye al propio actor entre los destinatarios.
6. "Generar código de activación" escribe audit y muestra un código sin mutar nada.
7. Badge "6 A" y "Temporada 2026" hardcodeados.
8. `1 partidos`, `1 pendientes`, `3 situación` — copy que resta credibilidad.

**Safety:**
1. 0 `danger`. 4 de 12 acciones destructivas sin confirmación; 8 de 12 sin modal de consecuencias.
2. `LAST_ADMIN`: el guard existe y funciona para "Deshabilitar cuenta" y "Finalizar rol ADMIN", pero **"Restablecer acceso"** pone `account = "PENDING"` sin guard ⇒ el club puede quedar sin administrador activo, y la recuperación de §18 es CLI ("No es API/UI").
3. `Team ARCHIVED` es irreversible desde la UI.
4. Defaults que cambian autoridad con un clic.

**Accessibility:**
- Puntos fuertes: estados siempre en texto; `focus-visible` global; `Modal` correcto; `aria-pressed` en `VasInline`; `role="status"` en alerts y toasts; labels asociados en `TextField`/`Select`/`TextArea`.
- Puntos débiles: `aria-live` 0; `role="tab"` 0; `aria-invalid` 0; `aria-describedby` 0 en checkboxes con conflicto; 0 `aria-*` en `management.tsx`; menús sin `role="menu"`/`Escape`; foco de modal en "Cerrar"; `Restricted` sin `h1`; skips h1→h3; tabla de Selection sin `<th>`; targets 36–40 px.

---

# 11. PRODUCT COMPLETENESS — VEREDICTO POR CAPACIDAD

| Capability | Estado | Hallazgo determinante |
|---|---|---|
| C01 Identity & Access | **PARTIAL** | Login/Activate/No-access/Profile/People existen. Falla: estado de cuenta ausente en Perfil; recuperación de `PLAYER_PROFILE_INCOMPLETE` inexistente (identidad read-only para todos); "Generar código" sin efecto; username no rotable |
| C02 Club Structure | **PARTIAL** | 4 tabs + create/edit/archive + fences con razón. Falla: sin restore; Temporada con estado inventado; sin creación de Team (el error que dice "creá un nuevo equipo" es imposible); Venue archivable nunca |
| C03 People & Assignments | **PARTIAL** | Assign/Move/End atómicos y correctos (CAPTAIN no se transfiere ✓). Falla: **Membership sin superficie**; GuardianRelationship sin superficie; `Person.team`/`role` como selectores |
| C04 Authority & Scope | **CONTRADICTORY** | El gating funciona, pero la capa declarada (`getAllowedActions`) está muerta: 1 de 16 flags en uso, `canViewDni`/`canViewContact`/`canViewAudit` = 0 consumidores, `useSearchParams` = 0. La UI reimplementa autorización con 4 booleanos |
| C05 Competition Context | **PARTIAL** | Lista, detalle, entries, activate/end, gate de cierre con razón ✓. Falla: **LINE vs TEAM indistinguibles en el modelo**; sin `422 COMPETITION_SCOPE_MISMATCH`; "Línea A" sin división ni temporada |
| C06 Eligibility | **MISSING** (parcial visible) | Se ve el estado derivado y se puede mutar, pero: la mutación fija `CLUB`/`INTERNAL`/`ADMIN` y no permite vigencia; **no hay superficie de lectura de constraints** (reason/source/note/validFrom); **SUBCOMMITTEE no tiene acceso** pese a que §5 se lo concede |
| C07 Event Operations | **PARTIAL** | Create/Edit/Detail/Logística/serie/cancel/postpone/restore ✓. Falla: **ScopeDialog sin efecto**; `ABANDONED` inalcanzable; transiciones a `IN_PROGRESS` sin modal; `RESTORE` vs `RESCHEDULE` indistinguibles en la notificación; sin campo Título en edición |
| C08 Match Day / Jornada | **PARTIAL** | Crear + ver + bulk de sede + impacto ✓. Falla: sin add/remove de hijos; bulk sólo de sede; sin `expectedVersion`; `count={19}` hardcodeado; sin manejo de error en el modal; sin fecha/nombre editable |
| C09 Participation Lifecycle | **PARTIAL** | Available/Selection/Attendance funcionan con draft/published, UNRECORDED y reconfirmación. Falla: guardian no puede responder por menor; `CONFLICT` de autosave inexistente; sin diff de revisiones; Attendance a 36 px; sin motivo por fila |
| C10 Change Management | **PARTIAL** | ScopeDialog, Impact Preview y stale version existen. Falla: **sin Conflict Workspace**; la recuperación **destruye el borrador**; `IMPACT_CHANGED` muestra el mismo impacto; conteos fabricados |
| C11 Logistics | **PARTIAL** | Los 5 campos existen y se muestran. Falla: `Hora de salida: "No aplica"` con copy de negación; venue metadata no editable (address/field_label) |
| C12 Communication & Notification | **PARTIAL** | 7 rutas, tombstones, FDPG-04, audiencia inmutable. Falla: **audiencia no es control de acceso**; sin "Entendido"; `type` de notificación nunca se renderiza; lista sin ordenar ni filtro; sin sheet de miembros; sin archivar conversación; FDPG-04 con lógica duplicada |
| C13 Match Record & Performance | **PARTIAL** | Draft/FINAL + corrección con motivo + before/after + report de rendimiento ✓. Falla: **editable con evento SCHEDULED**, contradiciendo su propio texto; `ABANDONED` elegible sin pasar por el lifecycle |
| C14 History / Audit / Provenance | **MISSING** | `attendanceHistory`/`recordHistory` invisibles; `audit` sin before/after, sin source, sin link al objeto; filtro de fecha con 3 valores hardcodeados; sin rastro en ninguna ficha |
| C15 Search & Reporting | **PARTIAL** | Búsqueda + 2 reports con copy excelente ("Sin registrar se mantiene separado de Ausente"). Falla: query fuera de la URL; `% PRESENCIA` muestra 0 % donde hay ausencia de dato; filtros no persistidos ni reseteables |
| C16 Operational Awareness | **PARTIAL** | Home con atención + calendario + avisos. Falla: Home de ADMIN vacío; "Hoy" vacío; sin nudge a no respondidas (FDPG-02); `needsReconfirmation` sólo detecta stale, nunca "no respondió" |

---

# 12. TOP 10 PROBLEMAS SISTÉMICOS

| # | Problema | Sev | Tipo | Impact |
|---|---|---|---|---|
| 1 | **El acento de color no está reservado y no hay color de peligro.** 8 usos del azul, 0 `danger`, error+success simultáneos | S4 | Presentación | CRITICAL |
| 2 | **Las capacidades de la capa `patterns.tsx` existen y están muertas.** `StateBanner`, `ImpactPreview`, `TimelineEntry`, `StickyActionBar`, `PageContextHeader`: 0 consumidores | S2 | Presentación | HIGH |
| 3 | **El historial se escribe y no se muestra.** La verdad de correcciones es invisible | S1 | Presentación / flow | CRITICAL |
| 4 | **0 validación inline, 0 dirty, 0 foco al error, 0 confirmación de descarte** en 12 formularios | S1 | Flow | HIGH |
| 5 | **Ningún estado de filtro/tab está en la URL** (`useSearchParams` = 0) ⇒ Back no preserva origen | S1 | Flow | HIGH |
| 6 | **La capa de autoridad declarada está muerta**: 1 de 16 flags, 0 PII field authority, 0 route gating | S1 | Presentación / flow | HIGH |
| 7 | **Copy con errores gramaticales y de jerga en las pantallas de mayor tráfico** (`1 pendientes`, `3 situación`, `0 sí`, `1 partidos`) | S2 | Presentación | MEDIUM |
| 8 | **Falsos datos en pantalla**: "6 A", "Temporada 2026" ×3, `count={19}`, fecha de audit congelada, guardian como "Jugadora" | S1 | Flow | HIGH |
| 9 | **Actions destructivas sin affordance de peligro ni confirmación** (8 de 12) | S3 | Flow | HIGH |
| 10 | **Los estados terminales no se comunican**: CANCELLED/POSTPONED renderizan como un evento vivo | S2 | Flow | HIGH |

---

# 13. PRODUCT GAPS (con disciplina de evidencia)

### PG-01 — El ScopeDialog captura una intención que el producto no cumple
- **User problem:** un entrenador que posterga 6 entrenamientos de una serie debe elegir alcance 6 veces o editar 6 veces.
- **Current workaround:** edición una por una.
- **Frequency:** media-alta en pretemporada. **Role:** COACH, SUBCOMMITTEE. **Flow:** F07/F08/F09. **Capability:** C07/C10.
- **Product Truth §:** §11 (material change + Impact Preview), §9 (`EventSeries ACTIVE→ENDED`), §25 (`event_occurrence_overrides` existe en el modelo físico).
- **Por qué el Product Truth actual no lo resuelve:** define el efecto pero no el comando de apply-to-occurrences. La tabla `event_occurrence_overrides` (23) implica overrides por ocurrencia que ninguna command list menciona.
- **Minimum proposed capability:** `ApplyEventChange(scope, patch, impactToken)` con overrides por ocurrencia y `coordination_revision++` por ocurrencia.
- **Backend impact:** medio (nuevo command + leases). **Frontend impact:** bajo (el diálogo y el preview ya existen). **Scope risk:** medio.
- **Recommendation: IN** (es la pieza que convierte F09 de MISSING a COMPLETE).

### PG-02 — No hay superficie para `Membership`
- **User problem:** nadie puede ver ni gestionar la pertenencia interna al club, que es requisito para asignar dentro (§17).
- **Current workaround:** el equipo como proxy de pertenencia.
- **Frequency:** baja por usuario, alta en onboarding de temporada. **Role:** ADMIN. **Flow:** F18. **Capability:** C03.
- **Product Truth §:** §17, §25 (`memberships`), §18 (`EndMembership del último Admin`).
- **Por qué no lo resuelve:** define la entidad y la regla, no la superficie.
- **Minimum proposed capability:** alta de `Membership` como parte de "crear persona" + fin de `Membership` como operación explícita (distinta de "Finalizar pertenencia" de team).
- **Backend impact:** bajo. **Frontend impact:** medio (1 sección en `/management/people/:id` + paso en `/management/people/new`). **Scope risk:** bajo.
- **Recommendation: IN.**

### PG-03 — No hay superficie para `GuardianRelationship` (dirección inversa)
- **User problem:** un menor no puede saber quién actúa en su nombre ni con qué permisos; un guardián no puede revocar.
- **Current workaround:** consultar a administración.
- **Frequency:** baja. **Role:** GUARDIAN (recibir), ADMIN (gestionar), menor (consultar). **Flow:** F03. **Capability:** C01/C03.
- **Product Truth §:** §6, §20 ("Relationship management/consultation lives inside More → Mi perfil, in a 'Personas a cargo' section").
- **Por qué no lo resuelve:** §20 ubica la gestión en Mi perfil pero el modelo sólo permite al guardián ver sus propias relaciones; no existe el endpoint de alta/baja ni la vista del menor.
- **Minimum proposed capability:** `CreateGuardianRelationship` / `EndGuardianRelationship` (ADMIN) + sección de solo lectura "Acceso de terceros sobre mi cuenta" para el menor.
- **Backend impact:** bajo. **Frontend impact:** medio. **Scope risk:** bajo.
- **Recommendation: IN.**

### PG-04 — `CompetitionEntry` no puede expresar LINE scope
- **User problem:** "Línea A" es ambigua: hay 4 divisiones con línea A. Insccribir por línea no puede validar `Entry.season_id == Match Team.season_id ∧ Entry.line_id == Match Team.line_id` (§16).
- **Current workaround:** inscribir el Team completo.
- **Frequency:** media. **Role:** SUBCOMMITTEE, ADMIN. **Flow:** F20. **Capability:** C05.
- **Product Truth §:** §16, §25 (`competition_entries`), §4.
- **Por qué no lo resuelve:** define la regla de coincidencia pero el modelo mock tiene un solo campo `team: string`.
- **Minimum proposed capability:** `teamId?` / `lineId?` + `seasonId` derivado, y `422 COMPETITION_SCOPE_MISMATCH` en la UI.
- **Backend impact:** bajo (backend ya lo define). **Frontend impact:** medio (select de línea con división + temporada).
- **Scope risk:** medio (toca el modelo mock, ya marcado como S4-03).
- **Recommendation: IN.**

### PG-05 — No existe "mi actividad" ni "mis sesiones"
- **User problem:** "Who accessed my account?" y "¿desde dónde?" no tienen respuesta. §49 define `POST /auth/activity` y §54 define invalidación por pestaña.
- **Current workaround:** ninguno.
- **Frequency:** baja, alta anxieties. **Role:** todos. **Flow:** F02. **Capability:** C01/C14.
- **Product Truth §:** §36 (Auth: `activity`, `reauthenticate`), §49, §52, §54.
- **Por qué no lo resuelve:** define laFamily de endpoints pero no la superficie.
- **Minimum proposed capability:** en Perfil, sección "Seguridad" con estado de cuenta, última actividad y cierre de sesión remoto.
- **Backend impact:** bajo (`/auth/activity` ya existe). **Frontend impact:** bajo.
- **Scope risk:** bajo.
- **Recommendation: IN** (es de las más baratas y de mayor confianza).

### PG-06 — No hay recuperación de `PLAYER_PROFILE_INCOMPLETE`
- **User problem:** una jugadora sin DNI o fecha de nacimiento no puede entrar al roster; nadie puede completarlo.
- **Current workaround:** ninguno. La identidad es read-only para todos, incluida ADMIN (`management.tsx:708-720`).
- **Frequency:** media en inicio de temporada. **Role:** PLAYER, ADMIN. **Flow:** F18. **Capability:** C01/C03.
- **Product Truth §:** §17 (`422 PLAYER_PROFILE_INCOMPLETE`), §26 (`persons`).
- **Por qué no lo resuelve:** define el error, no el camino de recuperación.
- **Minimum proposed capability:** edición de identidad propia limitada a los campos faltantes (DNI + fecha de nacimiento) en Perfil, con la autoridad §6 ya resuelta (§6 dice DNI = ADMIN, por lo que **requiere una aclaración de Product Truth**: ¿puede una jugadora cargar su propio DNI?).
- **Backend impact:** medio (nueva command + regla de campos). **Frontend impact:** bajo. **Scope risk:** **alto** — requiere decisión de producto.
- **Recommendation: DEFER** hasta decisión explícita sobre §6 (DNI autoinformado). Registrar como decisión pendiente, no como requerimiento.

### PG-07 — El calendario no puede dar de alta una persona que aún no tiene `PLAYER_PROFILE_INCOMPLETE` resuelto
- **User problem:** el filtro de candidatos de "Asignar equipo" ofrece solo los que ya están completos; no hay statewide de "pendientes de completar".
- **Current workaround:** buscar por nombre en la lista.
- **Frequency:** baja. **Role:** ADMIN. **Flow:** F18. **Capability:** C03.
- **Recommendation: DEFER** ( subordinate de PG-06).

---

# 14. PRODUCT DISCOVERY CANDIDATES (no son requisitos)

| ID | Candidatura | Por qué NO es requisito | Origen |
|---|---|---|---|
| PDC-01 | Preferencias de notificación (mute por canal) | §25 no define tabla de preferencias; §22 define 7 tipos sin preferencias; FDPG-03 fue **DEFERRED** en Stage 4 | FDPG-03 |
| PDC-02 | Nudge / recordatorio a no respondidas (§ FDPG-02) | §22 dice explícitamente "No notification por: Availability response" ⇒ un nudge **requeriría** un tipo de notificación nuevo y una excepción a §22. **DEFERRED** sigue siendo la decisión correcta | FDPG-02 |
| PDC-03 | "Deshacer" sobre archivar | §19 exige archivar con fence; no exige undo. La ausencia de undo es una decisión, no un bug | Blueprint §5 |
| PDC-04 | Reacciones / menciones en conversación | §20 y §59 no las definen; FDPG-03 | FDPG-03 |
| PDC-05 | Timeline personal de actividad del usuario | §71 define History como proyecciones de dominio, no una línea personal; §36 expone `activity` sólo para idle-timeout | PG-05 (la parte de sesiones sí es requisito) |

---

# 15. STAGE 4 GAPS — REPLAY Y REPRIORITIZACIÓN

| ID | Gap declarado en Stage 4 | Veredicto Stage 5 | Nueva prioridad | Motivo |
|---|---|---|---|---|
| **S4-01** | ScopeDialog captura alcance pero no bulk | **CONFIRMADO y AGRAVADO** | **P0 de flujo** | Verificado en código: `scope` no entra en `patch` ni llega a `eventChange`; elegir "Toda la serie" muta exactamente 1 evento y muestra `seriesCount` como si fueran 2. El usuario ve una afirmación de alcance que el sistema no cumple ⇒ trust. Convierten F09 de MISSING a COMPLETE |
| **S4-02** | Conflict Workspace sin vista lado a lado | **CONFIRMADO** | **P1** | Verificado: no hay superficie de 3 columnas; la recuperación navega (`events.tsx:1145-1146`) y **destruye el `draft`** ⇒ viola §44 (`409 preserva baseline + localDraft + latestServer`). Agravado: el escenario sólo se dispara una vez por sesión |
| **S4-03** | CompetitionEntry fusiona LINE y TEAM | **CONFIRMADO** | **P1** | Verificado en runtime: "Línea A · 2026" sin división ni temporada con 4 divisiones en el dataset. Convierten PG-04 |
| **S4-04** | `Person.team`/`Person.role` como selectores | **CONFIRMADO y AGRAVADO** | **P1** | Verificado: sobreviven en `overview.tsx` (alcance de eventos, filtro de calendario, chip), `participation.tsx:134`, `communication.tsx:196`, `account-insight.tsx:593,642`, `store.tsx:167`. Es la causa raíz de que un ADMIN vea a la guardiana como "Jugadora / Club" y de que un COACH con 2 equipos sólo vea 1 |
| **S4-05** | Lista de conversaciones sin ordenar por no-leídos | **CONFIRMADO y REBAJADO** | **P3** | Verificado: 0 `.sort()` en el archivo; el orden actual es el orden del seed (coincide por casualidad). Pero la separación de canales **sí** es estructural (2 columnas a `xl`) y el badge de no-leído funciona como acento. Es una mejora de orden, no un hole de flujo |

**FDPG-02 (nudge/reminders):** **DEFERRED confirmado.** §22 prohíbe explícitamente notificar por respuesta de disponibilidad; un nudge requiere abrir el Freeze. No es necesario para que F11 sea COMPLETE: la reconfirmación por cambio material ya está implementada y la falta de *nudge* no rompe el camino, sólo lo hace menos push.
**FDPG-03 (mute/mentions/replies):** **DEFERRED confirmado.** No es necesario para F21–F23. El chat es usable sin reacciones.
**FDPG-04 (anti-duplicado DIRECT):** **IN, pero con deuda.** Funciona (detección + "Abrir conversación") pero la UI **no usa `findOrOpenDirect`** (0 consumidores en features) ⇒ dos implementaciones de la misma regla canónica.

---

# 16. REGISTRO DE HALLAZGOS (referenciado por la matriz de screens)

| ID | Sev | Tipo | Esfuerzo | Impacto | Hallazgo | Pantallas |
|---|---|---|---|---|---|---|
| UX-01 | S4 | Presentación | S | CRITICAL | Acento de color sin reserva: azul con 8 significados; 0 `variant="danger"` | todas |
| UX-02 | S4 | Presentación | S | CRITICAL | Escala tipográfica de Stage 4 no adoptada: 10 tamaños arbitrarios (8–27 px), 9 usos de 9 px, `Header` 27 px vs token 22 px | todas |
| UX-03 | S4 | Presentación | M | HIGH | Superficie única para 4 niveles: 6+ cards idénticos por pantalla | 26 |
| UX-04 | S2 | Flow | XS | HIGH | Estados terminales sin consecuencia comunicada (CANCELLED/POSTPONED) | R13, R05, R04, R10 |
| UX-05 | S4 | Presentación | XS | HIGH | ERROR + SUCCESS simultáneos para un mismo hecho | R16, R13 |
| UX-06 | S4 | Presentación | XS | MEDIUM | `RECONFIRM` fuera del enum ⇒ tono neutral; `NEEDS_RECONFIRMATION` nunca se usa | R15, R16, R17 |
| UX-07 | S4 | Presentación | M | HIGH | Dos vocabularios de estado (`model.labels` vs `states.STATE_TEXT`) y 3 etiquetas para un valor | 14 |
| UX-08 | S4 | Presentación | S | MEDIUM | Empty giants con borde punteado en posiciones L1 | R04, R17, R21 |
| UX-09 | S2 | Flow | S | HIGH | Dos gramáticas de ¿Vas? con detección de estado distinta | R04, R13, R15 |
| UX-10 | S5 | Presentación | S | MEDIUM | Sin motion causal; las filas que desaparecen no se señalan | R04, R16, R17 |
| UX-11 | S1 | **Product gap** | M | CRITICAL | ScopeDialog sin efecto: el alcance no llega a la mutación | R14, R13 |
| UX-12 | S1 | Flow | L | HIGH | Sin Conflict Workspace; la recuperación destruye el borrador | R14 |
| UX-13 | S1 | **Product gap** | M | HIGH | CompetitionEntry no expresa LINE scope | R34, R33 |
| UX-14 | S1 | Flow | L | HIGH | `Person.team`/`Person.role` siguen siendo selectores ⇒ verdad falsa en listas y alcances | R30, R32, R05, R04, R21, R22, R36 |
| UX-15 | S2 | Flow | S | MEDIUM | Comunicación sin orden por no-leídos, sin filtro por tipo, con separación perceptual insuficiente | R21 |
| UX-16 | S0 | **Product gap** | M | CRITICAL | La audiencia de un comunicado no es control de acceso, no es TEAM_SET y notifica a todos | R21, R23, R24, R25 |
| UX-17 | S1 | Flow | S | HIGH | "Entendido"/acuse inexistente ⇒ R24 sin acción primaria | R24 |
| UX-18 | S1 | Flow | M | CRITICAL | Historial escrito pero invisible (`attendanceHistory`, `recordHistory`); audit sin before/after ni link | R13, R17, R18, R32, R38 |
| UX-19 | S1 | Flow | M | HIGH | `eventChange` notifica sin validar audiencia §22 y confunde RESTORE con RESCHEDULE | R13, R14 |
| UX-20 | S2 | Flow | S | MEDIUM | La rama "non-material" es inalcanzable (no hay campo Título en edición) y hace `Object.assign` del draft completo | R14 |
| UX-21 | S1 | Flow | M | HIGH | 0 errores inline, 0 `aria-invalid`, 0 foco al primer error; alert al final del formulario | 9 formularios |
| UX-22 | S2 | Flow | M | HIGH | 0 dirty state y 0 confirmación de descarte; el backdrop del modal descarta | 12 formularios |
| UX-23 | S1 | Flow | M | HIGH | `useSearchParams` = 0: ningún filtro/tab/mes en la URL ⇒ Back no preserva origen | R05, R21, R28, R30, R36, R37, R38 |
| UX-24 | S1 | Flow | M | HIGH | Calendar sin ¿Vas?, sin sheet de detalle, sin panel desktop; toggle "Mes" es no-op en mobile | R05 |
| UX-25 | S1 | Flow | M | HIGH | Home: atención sin ordenar, con ítems no accionables por el rol, "Hoy" vacío, chip "0 pendientes" | R04 |
| UX-26 | S1 | Flow | L | HIGH | Guardian: sin respuesta por menor, selector de menor inerte, PII no filtrado por relación, delegación no gestionable | R04, R08, R13, R15 |
| UX-27 | S2 | Flow | S | MEDIUM | PersonDetail sin acción (Contactar/¿Vas?), sin contexto, nodo muerto | R11 |
| UX-28 | S1 | Flow | L | HIGH | People admin: identidad read-only, sin Membership, sin GuardianRelationship, sin audit, código de activación sin efecto, username no rotable, agujero LAST_ADMIN | R30, R31, R32 |
| UX-29 | S1 | Flow | M | HIGH | Eligibility: mutación con scope/source/reason/validity fijos; sin superficie de lectura; SUBCOMMITTEE sin acceso | R32, R16 |
| UX-30 | S1 | Flow | M | MEDIUM | Estructura: estado "Activo" en Temporada (inexistente en §19), sin restore, "creá un nuevo equipo" imposible, Venue por nombre | R28, R29 |
| UX-31 | S1 | Flow | S | HIGH | MatchRecord editable con evento SCHEDULED, contradiciendo su propio texto; "Abandonado" sin pasar por el lifecycle | R18, R13 |
| UX-32 | S1 | Flow | S | HIGH | Attendance: botones de fila a 36 px con separación de 6 px (riesgo de error de toque con consecuencia de dato); sin motivo por fila | R17 |
| UX-33 | S1 | Flow | M | MEDIUM | Jornada: sin add/remove, bulk sólo de sede, sin `expectedVersion`, `count={19}` hardcodeado, sin error en el modal | R19, R20 |
| UX-34 | S1 | Flow | S | HIGH | Viaje en el tiempo: audit a fecha fija, filtro de audit con 3 fechas literales, periodos de report literales, thread con fecha fija | R38, R36, R37, R26 |
| UX-35 | S1 | Flow | S | HIGH | Datos falsos en UI: badge "6 A", "Temporada 2026" ×3, conteos de impacto fabricados, `notify` incluye al actor, `CheckCheck` estático | R04, R13, R20, R26 |
| UX-36 | S3 | Flow | S | HIGH | Selects prellenados con el valor actual o la primera opción en operaciones de autoridad | R32 |
| UX-37 | S2 | Presentación | S | MEDIUM | Copy: 5Concordancia rotas, jerga no explicada, fuga de razonamiento de implementación, "roster" en inglés | 18 |
| UX-38 | S3 | Flow | S | MEDIUM | Notificaciones: `type` §22 poblado pero nunca renderizado; 7 tipos indistinguibles; "marcar leído" navega | R07 |
| UX-39 | S2 | Presentación | M | MEDIUM | Accesibilidad: `aria-live` 0, `role="tab"` 0, menús sin semántica, sin `h1` en `Restricted`, skips h1→h3 | 20 |
| UX-40 | S2 | Flow | S | MEDIUM | Gating 100 % in-page; el breadcrumb anuncia "Gestión"/"Historial" antes de negar; SUBCOMMITTEE con screens working bajo un hub negado | R27–R34, R38 |
| UX-41 | S1 | Flow | L | HIGH | Capa de autoridad declarada muerta: 1 de 16 flags, 0 PII field authority | transversal |
| UX-42 | S1 | Flow | M | HIGH | Perfil incompleto (§11): identidad, estado de cuenta, roles/alcance, pertenencia con período, seguridad,bidireccional de delegación | R08 |
| UX-43 | S4 | Presentación | XS | MEDIUM | Reports: "% PRESENCIA" con 0 % donde no hay dato, contradiciendo su propio pie | R36 |
| UX-44 | S5 | Flow | XS | LOW | Login/Activate: usuario precargado, código fijo, credenciales de demo en el build de producción | R01, R02 |
| UX-45 | S4 | Presentación | S | MEDIUM | Baja densidad: 18 filas × 70 px; `max-w-3xl` con 4 datos | R16, R17, R15, R08 |
| UX-46 | S3 | Flow | S | HIGH | `variant="danger"` inexistente y 8 de 12 acciones destructivas sin modal ni confirmación | R28, R29, R33, R32, R26 |

---

# 17. STRESS QUESTIONS (§25)

| # | Pregunta | Respuesta |
|---|---|---|
| 1 | ¿Una PLAYER nueva entiende la app sin explicación? | **Sí, mayormente.** Inicio → "¿Vas?" → evento →XSímbolo. Falla en: no ve si está week's en la convocatoria, "1 conflicto actual" inexplicable, "0 sí" indescifrable, reports a 3 clicks. Veredicto: **PASS con reservas** |
| 2 | ¿Una COACH opera rápido tras una semana? | **No.** 18 filas con una columna inútil, sin selección masiva, sin revisions, filtro que no persiste, sin atajo. Veredicto: **FAIL** |
| 3 | ¿SUBCOMMITTEE coordina sin entrar a features deportivas? | **Sí en las cards, no en el mapa.** Puede publicar comunicados y gestionar Match/Club event, pero `/management` le dice "Sección no disponible" mientras `/management/competitions/ahba` funciona; y no puede mutar elegibilidad pese a que §5 se lo concede. Veredicto: **PARTIAL** |
| 4 | ¿ADMIN administra sin convertirse en superusuario deportivo? | **Sí en permisos, sí en apariencia, no en utilidad.** No ve conversaciones, no crea eventos, no responde el "¿Vas?". Pero su Home está vacío (0 acciones, 1 evento) y su lista de personas afirma "Jugadora / Club" para la guardiana. Veredicto: **PARTIAL** |
| 5 | ¿Guardian entiende qué está viendo y de quién? | **No.** Con 1 menor ve "Viendo a Lucía Fernández" pero su alcance es `clubWide` (1 evento), no tiene ¿Vas?, el selector >1 es inerte y no existe en el harness. Veredicto: **FAIL** |
| 6 | ¿Home deja claro qué importa? | **Parcialmente.** El bloque correcto existe y funciona; el orden es incorrecto, el "Hoy" está vacío, y para ADMIN dice "0 pendientes" + "Nada pendiente.". Veredicto: **PARTIAL** |
| 7 | ¿Event deja claro qué pasa y qué hacer? | **Parcialmente.** Para SCHEDULED es excelente; para CANCELLED/POSTPONED es indistinguible de uno vivo. Veredicto: **PARTIAL** |
| 8 | ¿Profile se siente realmente completo? | **No.** 4 datos, 2 botones, 22 % del viewport. Le faltan estado de cuenta, roles y alcance, pertenencia con período, seguridad y la dirección inversa de la delegación. **El usuario tiene razón.** Veredicto: **FAIL** |
| 9 | ¿Communication se siente natural? | **Medianamente.** El chat es usable y sobrio; el hub no ordena, no filtra, no marca comunicados nuevos y separa los canales sólo con un encabezado. Veredicto: **PARTIAL** |
| 10 | ¿Management se siente administrativo pero no intimidante? | **Sí en lenguaje, no en estructura.** El copy es excelente ("Mover termina la asignación y el rol PLAYER anteriores…"), pero 6 acciones de igual peso, 0 primarias, identidad read-only y un selector que asigna COACH con un clic. Veredicto: **PARTIAL** |
| 11 | ¿El color dirige la atención suficientemente? | **No.** 0 danger, acento sin reserva, rojo y verde simultáneos. Veredicto: **FAIL** |
| 12 | ¿La tipografía genera niveles perceptibles? | **No.** 10 tamaños arbitrarios, tokens sin adopción, saltos de 2 px sin refuerzo. Veredicto: **FAIL** |
| 13 | ¿El spacing comunica grupos? | **Parcialmente.** La escala existe; la agrupación falla en 6 superficies y en el bloque sin surface de Home. Veredicto: **PARTIAL** |
| 14 | ¿Lo interactivo parece interactivo? | **Parcialmente.** Filas y botones sí; los links de acción de Home son indistinguibles de `TextLink`; los toggles Mes/Agenda y el selector de tipo no muestran estado. Veredicto: **PARTIAL** |
| 15 | ¿Los estados cambian perceptualmente? | **No.** Transición de estado = cambio de un badge. Sin motion, sin banner, sin refuerzo de superficie. Veredicto: **FAIL** |
| 16 | ¿Existe demasiado ruido visual? | **Sí.** 8 superficies en Home, 6 clases de link idénticas, columna inútil en Selection, "Temporada 2026" ×3, badge "6 A". Veredicto: **FAIL** |
| 17 | ¿Hay pasos innecesarios? | **Sí.** Calendar → Evento → Availability para un "¿Vas?"; Jugadora → Inicio → Más → Reportes → Asistencia; CONVOCATORIA → EventDetail sin ruta directa. Veredicto: **FAIL** |
| 18 | ¿Hay capabilities enterradas? | **Sí.** `Generar código de activación`, `Abrir para corregir`, filtros de Structure, `Viendo a X` (>1), revocar delegación, `Ver jornada`, reports para jugadoras. Veredicto: **FAIL** |
| 19 | ¿Hay screens incompletas aunque "funcionen"? | **Sí, ése es el patrón dominante.** `/more/profile`, `/people/:personId`, `/announcements/:id`, `/jornadas/:id`, `/events/:id` en estado terminal. Veredicto: **FAIL** |
| 20 | ¿Hay features que sobran? | **Muy pocas.** El badge "6 A", el bloque "En el equipo" sin función, la leyenda del calendario (que además miente: "Club" = warning pero `CLUB_EVENT` se pinta verde), el pie de marketing de 10 px, el tab "Todo" de Comunicación. Veredicto: **PASS con 5 remociones** |

---

# 18. VEREDICTO FINAL

```
Stage 5 — PERCEPTUAL UX + INTERACTION + FLOW COMPLETENESS AUDIT

Rutas auditadas:            38/38
Bloques cubiertos:          48/48
Flujos auditados:           30/30
Capacidades replay:         16/16
Roles considerados:          6/6  (5 con evidencia runtime)
Viewports:                  500 / 768 / 1440 verificados · 390 NO VERIFICABLE

Rutas COMPLETAS (§5):       0
Rutas PARTIAL:             26
Rutas INCOMPLETE:          12

Flujos COMPLETE:            1
Flujos PARTIAL:            17
Flujos MISSING:             8
Flujos CONTRADICTORY:       4

Capacidades COMPLETE:       4
Capacidades PARTIAL:        9
Capacidades MISSING:        2
Capacidades CONTRADICTORY:  1

Bloques PASS:               0
Bloques MINOR:              5
Bloques MAJOR:             42
Bloques N/A:                1

Stage 4 gaps revalidados:   S4-01 P0 · S4-02 P1 · S4-03 P1 · S4-04 P1 · S4-05 P3
FDPG-02 DEFERRED (confirmado §22) · FDPG-03 DEFERRED (confirmado)

VEREDICTO: NO FREEZE.
El Stage 5 termina en plan. El frontend no cumple §24 ("una pregunta
dominante", "impact preview antes de cambios relevantes", "error preserva
input"✓, "responsive conserva significado") ni §5 del encargo.
R1_REQUIRED → docs/GEI_STAGE5_FRONTEND_IMPROVEMENT_PLAN_V1.md
```

**Las tres cosas que hay que arreglar primero, por impacto en comprensión × frecuencia × criticidad ÷ coste:**

1. **Reservar el acento y crear el color de peligro** (UX-01, UX-46, UX-05) — S, impacto CRITICAL, 0 riesgo de producto.
2. **Conectar la capa de gramática muerta** (UX-02 + UX-04 + UX-08 + UX-09) — M: los tokens, el `StateBanner` y el `VasInline` único ya están escritos y sin usar.
3. **Completar Perfil** (UX-42, PG-05, PG-02, PG-03) — M, cierra el reclamo explícito del usuario con evidencia de Product Truth, no con invención.

**SOURCE MODIFIED: NO.**
