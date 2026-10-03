# GEI HOCKEY MANAGEMENT SYSTEM
## STAGE 5 — RUNTIME EVIDENCE V1

**Estado:** evidencia de ejecución para la auditoría perceptual/interacción de Stage 5.
**Naturaleza:** AUDIT-ONLY. Ningún archivo de `src/**` fue modificado.
**Baseline inspeccionado:** `8f30cda91bb531539864ed9175ab256598b17e88` (`gei/frontend-target-v1`) → auditado sobre `gei/stage5-ux-audit`.
**Servidor:** `vite preview` sobre el build de producción (`dist/`, ya verificado en preflight) en `http://localhost:4173`.

---

# 1. Herramientas (sin instalaciones)

| Herramienta | ¿Existía antes? | Uso |
|---|---|---|
| `node_modules\.bin\vite` | sí | `vite preview --port 4173` (build de producción) |
| Chrome `chrome.exe` (headless `--headless=new` / `--headless=old`) | sí, binario del sistema | `--dump-dom` y `--screenshot` |
| Edge `msedge.exe` (headless) | sí, binario del sistema | `--dump-dom` (respaldo) |
| Playwright / Puppeteer / cualquier automatización de navegador | **NO** — verificado: `node_modules\playwright`, `node_modules\puppeteer`, `node_modules\@playwright` = `False` | no usadas |

No se instaló ninguna dependencia. `package.json` y `pnpm-lock.yaml` intactos.

---

# 2. Preflight ejecutable

| Gate | Resultado |
|---|---|
| `pnpm typecheck` | **PASS** (sin salida de error) |
| `pnpm test` | **PASS** — 31/31 en 4 archivos (`target-behavior` 6, `smoke` 5, `target-grammar` 4, `p0-invariants` 16) |
| `pnpm build` | **PASS** — 1915 módulos, `dist/assets/index-BFOXlPOD.js` 468.88 kB (gzip 137.35), `index-g0aVu8HT.css` 41.83 kB (gzip 7.96) |
| `git status --short` | limpio al inicio |
| `git branch --show-current` | `gei/frontend-target-v1` |
| `git rev-parse HEAD` | `8f30cda91bb531539864ed9175ab256598b17e88` |
| Rutas canónicas | 38/38 presentes en `src/app/App.tsx:47-102` |

Warnings de test observados (no bloqueantes): `act(...)` no envuelto en `p0-invariants.test.tsx`; `[GEI] estado de dominio desconocido en UI: SOMETHING_UNKNOWN` (test de fallback, esperado).

---

# 3. Limitación honesta del método: 390 px NO fue verificable

Windows impone un **ancho mínimo de ventana ≈ 500 px** al navegador. Se intentaron dosRenderers:

| Renderer | `--window-size=390,1400` | Resultado |
|---|---|---|
| Edge `--headless=new` | imagen 390×441 | el layout se calculó a ~756 px |
| Chrome `--headless=new` | imagen 390×1400 | layout calculado a ~500 px |
| Chrome `--headless=old` | imagen 390×1400 | layout calculado a ~500 px |

Control de contraste: la misma pantalla capturada a **500 px** renderiza correctamente los 5 ítems del bottom nav, el badge "1 pendientes", el texto completo del aviso de reconfirmación y el tercer botón "¿Vas? / No voy". Por lo tanto, **el recorte visible en las capturas de 390 px es un artefacto del entorno de captura, no un defecto del producto**.

Consecuencia metodológica (sepropaga a toda la auditoría):

- **RUNTIME VERIFIED @ 500 px, 768 px, 1440 px.**
- **390 px: NO VERIFICADO en runtime.** Todo hallazgo móvil se declara `STATIC ONLY` salvo que se haya observado también a 500 px.
- No se declara PASS ni MAJOR visual en 390 px based en pixel. Las conclusiones de 390 px provienen de lectura de clases Tailwind (`grid-cols-3`, `min-h-9`, `min-w-[560px]`, `overflow-x-auto`, `text-[Npx]`).

Tampoco fue posible la **inspección de interacción por puntero/teclado** (no hay automatización de navegador). Por lo tanto:

- Estados `hover`, `focus-visible`, transiciones y `prefers-reduced-motion` = **STATIC ONLY**.
- Flujos con mutación (publicar, cerrar planilla, cambiar contraseña, mover de equipo) = verificados **por código + por texto renderizado en runtime**, no por ejecución de la interacción.

---

# 4. Cobertura runtime

## 4.1 Cobertura de rutas — 38/38

Todas las 38 rutas canónicas fueron renderizadas con `--dump-dom` sobre el build de producción. Ninguna devolvió pantalla de error ni `Empty` por route inexistente.

| # | Route | DOM capturado | Contenido observado (resumen) |
|---|---|---|---|
| R01 | `/login` | sí | "Ingresar", usuario precargado `tomas.beltran`, `<details>` "Información de la demostración local" |
| R02 | `/activate` | sí | "Activar cuenta", 4 campos, código esperado `GEI-2026-4812` hardcodeado (`account-insight.tsx:433`) |
| R03 | `/no-access` | sí | redirige a `/home` cuando `hasAccess` es true; copy "Tu cuenta está activa" + "Mi perfil" / "Cerrar sesión" |
| R04 | `/home` | sí ×3 roles | COACH / PLAYER / ADMIN / SUBCOMMITTEE |
| R05 | `/calendar` | sí | mes + agenda, leyenda, filtros |
| R06 | `/search` | sí | "¿Qué estás buscando?" |
| R07 | `/notifications` | sí | 3 avisos, "Marcar todas como leídas", "Todas/Sin leer" |
| R08 | `/more/profile` | sí | ver §5 |
| R09 | `/teams` | sí | 1 fila (coach) |
| R10 | `/teams/sexta` | sí ×2 roles | roster 18 + badges de elegibilidad sólo para coach |
| R11 | `/people/p2` | sí | ficha read-only |
| R12 | `/events/new` | sí | selector de tipo + 4 secciones |
| R13 | `/events/match-cuba` | sí ×3 roles | ver §5 |
| R14 | `/events/match-cuba/edit` | sí | **sin campo Título** |
| R15 | `/events/match-cuba/availability` | sí | 18 filas, todas "Necesita reconfirmación" o "Sin respuesta" |
| R16 | `/events/match-cuba/selection` | sí | tabla 18 filas + sticky "12 jugadoras seleccionadas / Publicar actualización" |
| R17 | `/events/match-cuba/attendance` | sí | empty "La asistencia todavía no se abrió" + "Abrir asistencia" |
| R18 | `/events/match-cuba/match-record` | sí | editable aunque el evento está `Programado` |
| R19 | `/jornadas/new` | sí | 3 campos + checkboxes |
| R20 | `/jornadas/j1` | sí | 1 hijo + "Cambiar sede de la jornada" |
| R21 | `/communication` | sí ×2 roles | 3 tabs, 2+3 filas |
| R22 | `/communication/conversations/new` | sí | toggle Directo/Grupo + 18 candidatos |
| R23 | `/communication/announcements/new` | sí | Título/Contenido/Audiencia |
| R24 | `/announcements/a1` | sí | cuerpo + badge "Publicado", **sin acción primaria** |
| R25 | `/announcements/a1/edit` | sí (SUBCOMMITTEE) | modo corrección, audiencia deshabilitada, sin diff |
| R26 | `/conversations/c1` | sí | 3 mensajes + "Cargar mensajes anteriores" |
| R27 | `/management` | sí (ADMIN) / denegado (COACH) | hub 5 filas vs "Sección no disponible" |
| R28 | `/management/structure` | sí (ADMIN) | tabs + 1 fila Temporada |
| R29 | `/management/teams/sexta` | sí | denegado para coach |
| R30 | `/management/people` | sí (ADMIN) | 23 filas |
| R31 | `/management/people/new` | sí | 6 campos |
| R32 | `/management/people/p2` | sí (ADMIN) | 5 secciones + rail |
| R33 | `/management/competitions` | sí | lista |
| R34 | `/management/competitions/ahba` | sí ×2 roles | lectura (coach) / lifecycle (SUBCOMMITTEE) |
| R35 | `/reports` | sí | hub 2 filas |
| R36 | `/reports/attendance` | sí | tabla 18 filas × 5 columnas |
| R37 | `/reports/performance` | sí | tabla 18 filas × 3 columnas |
| R38 | `/audit` | sí (ADMIN) | 4 filtros + 2 entradas |

## 4.2 Cobertura de actores

| Actor | How | STATIC | RUNTIME |
|---|---|---|---|
| PLAYER | `?demo=player` → `p2` (Lucía Fernández) | sí | **sí** (`/home`, `/teams/sexta`, `/communication`, `/more`, `/events/match-cuba`, `/events/match-cuba/selection`, `/events/match-cuba/availability`, `/search`, `/notifications`, `/more/profile`) |
| CAPTAIN | `?demo=captain` → `p0` (Victoria Berg) | sí | parcial: mismo dataset que PLAYER + rol dual en `permissions.ts:8` |
| COACH | actor por defecto `coach` (Tomás Beltrán) | sí | **sí** (31/38 rutas) |
| SUBCOMMITTEE | `?demo=subcommittee` | sí | **sí** (`/home`, `/more`, `/management` denegado, `/management/people/p4` denegado, `/management/competitions/ahba`, `/announcements/a1/edit`) |
| ADMIN | `?demo=admin` (Mariana Costa) | sí | **sí** (`/home`, `/more`, `/management`, `/management/structure`, `/management/people`, `/management/people/p2`, `/audit`) |
| GUARDIAN-DELEGATION | `seed.ts:229-244` (`guardian`, `roleAssignments: []`) | sí | **NO** — `store.tsx:83-93` no contempla `?demo=guardian`; el actor sólo es alcanzable por login interactivo (`marcela.fernandez`), imposible sin automatización. Marcado `RUNTIME NOT VERIFIED` |

## 4.3 Cobertura de viewports

| Viewport | Captura | Estado |
|---|---|---|
| 390 px | intentada | **NO FIABLE** (ancho mínimo ~500 px del SO). No se usa como evidencia |
| 500 px | Chrome `--headless=old` | **RUNTIME VERIFIED** (mobile layout real: sin sidebar, bottom nav, `sm:` no aplicado) |
| 768 px | Chrome `--headless=new` | **RUNTIME VERIFIED** |
| 1440 px | Chrome `--headless=new` | **RUNTIME VERIFIED** (con sidebar 224 px) |

45 capturas de pantalla + 39 volcados de DOM quedaron en `C:\Users\thega\AppData\Local\Temp\opencode\gei\` (fuera del repo, no versionado).

---

# 5. Observaciones runtime confirmadas (contexto: sábado 3 de octubre de 2026, reloj real)

Estas observaciones son **hecho renderizado**, no inferencia de código.

## R-01 — Home (COACH, 1440 px) — captura `home-coach-1440.png`

1. Bloque L1 "Hoy" renderiza **"Hoy no hay actividades / Podés revisar los próximos eventos de tu equipo."** en una caja blanca de borde punteado de ~200 px de alto. Ningún evento del seed está fechado el día real (fechas fijas 2026-09-26 … 2026-10-17, `seed.ts:79-161`).
2. Badge del equipo renderiza **"6 A"** en un cuadrado azul de 40 px, siendo el elemento de mayor peso visual de la columna lateral. El equipo real es "Sexta A"; el "6" es un literal (`overview.tsx:325-326`) y el dataset de equipos tiene 4 divisiones.
3. Copy de la fila de atención: **"Convocatoria con situaciones para revisar / GEI vs. CUBA · 1 jugadora con conflicto actual"** — concordancia singular en un texto que admite plural.
4. **Orden de "Necesita tu atención"**: 1) "La asistencia sigue abierta · Entrenamiento de Sexta A · 14 jugadoras sin registrar" (evento del 2 oct, ayer) → 2) "Nuevo horario, nuevas confirmaciones · GEI vs. CUBA · sáb, 10 oct" → 3) "Convocatoria con situaciones para revisar". El partido de dentro de 7 días queda en segundo lugar detrás de una planilla de ayer.
5. "En el equipo" (último bloque, captainía) renderiza **sin contenedor de superficie**, a diferencia de los otros 8 bloques del mismo lado.
6. "Temporada 2026" aparece 3 veces en pantalla: chip de contexto, card lateral, footer.

## R-02 — Home (PLAYER, 500 px) — captura `old-home-player-500.png`

7. Badge ámbar renderiza **"1 pendientes"** (singular con contador 1).
8. El bloque ¿Vas? renderiza **la misma frase dos veces, adyacente**: (a) línea de estado "Respuesta anterior: Voy · El horario cambió desde tu última respuesta." y (b) caja ámbar "El horario cambió desde tu última respuesta. Confirmá nuevamente." — `vas.tsx:41` y `vas.tsx:47-49`.
9. Los botones "Voy / Quizás / **No voy**" renderizan **sin ninguna selección visible**, aunque la jugadora ya respondió "Voy": `active = current?.value === opt.value && !stale` (`vas.tsx:53`) anula el resaltado cuando la respuesta es stale. La única memoria de la respuesta previa está en la línea de estado en gris.
10. En "Próximamente", el evento Postergado renderiza **"A definir"** en la columna de hora y **"sáb, 17 oct"** en la columna de fecha.
11. "Comunicaciones recientes" no muestra ningún indicador de no-leído.

## R-03 — Home (ADMIN, 1440 px)

12. "Necesita tu atención" renderiza el chip **"0 pendientes" en tono ámbar** junto al check verde **"Nada pendiente."** — dos señales contradictorias simultáneas (`overview.tsx:199` vs `overview.tsx:244-247`).
13. Sin aside (ADMIN no tiene equipo): sin "TU EQUIPO", sin "Próximo partido", sin "En el equipo". Home de ADMIN = 0 acciones + 1 evento + 2 comunicados.

## R-04 — EventDetail (COACH, 1440 px)

14. Banner de reconfirmación: "El horario cambió. Hay **15 respuestas** para reconfirmar." — y en el rail de Participación, la fila Disponibilidad renderiza **"15 respuestas · 3 sin respuesta · 15 necesitan reconfirmación 0 sí"**. El token "**0 sí**" es incomprensible: las 15 respuestas existen pero todas quedaron stale.
15. Con evento `CANCELLED`, el detalle renderiza **la misma estructura completa** (fecha, horario, sede, logística, rail de 4 filas). El único cambio es el badge. No hay `StateBanner` en todo el archivo (`patterns.tsx` lo declara; 0 consumidores).

## R-05 — EventDetail (PLAYER)

16. La acción primaria del jugador es "Responder disponibilidad" ✓.
17. El Alert de conflicto **no** se muestra al jugador ✓ (P0-5 cerrado, verificado).
18. El rail sí muestra **"Convocatoria · 12 jugadoras convocadas · 1 conflicto actual"** sin explicar qué es un "conflicto actual" ni a quién corresponde, y sin ninguna acción.

## R-06 — Selection (COACH, 1440 px) — captura `selection-1440.png`

19. **Dos banners de ancho completo contradictorios apilados**: rojo `tone="error"` "Esta convocatoria tiene 1 situación para revisar. La publicación anterior se conserva. · Sofía Romero — No puede jugar este partido por una restricción actual." + verde `tone="success"` "Publicada · 12 jugadoras…". Es la mayor masa de color saturado de la pantalla y describe un único hecho como error y como éxito a la vez. El texto de la línea roja arranca con un "· " colgante.
20. **Las 18 filas de la columna DISPONIBILIDAD dicen "Necesita reconfirmación"** (15) o "Sin respuesta" (3): la columna no aporta información en el estado inicial. Textos a 11 px gris.
21. La barra sticky "12 jugadoras seleccionadas / Publicar actualización" **tapa parcialmente la última fila** de la tabla (fila "MP Milagros Pérez" cortada).
22. La grilla de 4 columnas ocupa ~900 px para datos de ~150 px: la columna JUGADORA mide ~490 px. Densidad baja; ~70 px por fila para 18 filas.
23. Buscador (x≈290) y filtro (x≈960) separados por ~450 px de vacío: no se leen como un grupo.
24. **No existe sección de revisiones** pese a que `selectionRevisions` está poblado en el seed (`seed.ts:82-89`).

## R-07 — Perfil (COACH, 1440 px) — captura `profile-1440.png`

25. La pantalla renderiza **una única card de ~340 px de alto** en un viewport de 1500 px: ~78 % de la página vacía. El card es `max-w-3xl` (768 px) dentro de un `main` de 1440 px: la mitad del ancho sin usar.
26. Contenido renderizado y exhaustivo: `Usuario tomas.beltran` · `Email tomas.beltran@gei.com.ar` · `Teléfono 11 6042 1870` · `Contexto Pertenencia vigente · 2026`. Dos botones `secondary`: "Editar contacto", "Cambiar contraseña".
27. La descripción promete **"Tus datos de contacto y tu acceso a GEI Hockey"**, pero **no se muestra ninguna información de acceso**: ni estado de cuenta, ni roles, ni alcance, ni pertenencia con período.
28. "Contexto: Pertenencia vigente · 2026" — "2026" literal; `team.season` existe (`model.ts:93`) y `memberships[]` existe (`model.ts:40-45`, poblado en `seed.ts:487-497`) y **no se lee en ninguna parte de la pantalla**.
29. Sin `h2`/secciones: `h1` → `dt`. Sin estado de cuenta (`PENDING/ACTIVE/DISABLED`), sin información de seguridad más allá del diálogo de contraseña, sin "Personas a cargo" (no es guardián).

## R-08 — Communication (COACH, 1440 px) — captura `communication-1440.png`

30. Las dos canales están **estructuralmente separados en 2 columnas** (`xl:grid-cols-2`) pero usan **surface, radio, icono de 40 px, gramática de fila y chevron idénticos**. La única diferencia es el encabezado y el icono (megáfono vs. avatar). Separación perceptual = insuficiente.
31. El único elemento de color sólido saturado en el área de contenido es el contador circular azul "2" del no-leído (16 px, texto ~9 px, sin `aria-label`). Funciona como acento; los comunicados **no tienen indicador de no-leído en absoluto**.
32. Los tabs son 3: "Todo / Comunicados / Conversaciones". "Todo" duplica la estructura que la propia pantalla ya muestra abajo (2 secciones simultáneas).
33.debajo de las dos cards, ~900 px de vacío a 1440 px.
34. La acción "Nueva conversación" es `secondary` (outline): la pantalla no tiene acción primaria.

## R-39 — Management/People (ADMIN)

35. La fila de la guardiana renderiza **"MF Marcela Fernández / Club / Jugadora / Activo"**. El actor `guardian` tiene `role: "PLAYER"` en el seed (`seed.ts:232`) pero `roleAssignments: []` (`seed.ts:241`): no es jugadora. §4/§5: PLAYER exige scope TEAM. La lista afirma una verdad que Product Truth contradice.
36. La etiqueta de EQUIPO para ADMIN/SUBCOMMITTEE/guardian es **"Club"**, que en el resto del producto significa "todo el club" y aquí significa "sin equipo".

## R-40 — Management/People/:id (ADMIN, 1440 px) — captura `personadmin-1440.png`

37. **Cero acciones primarias.** 6 acciones, todas `secondary` o texto: "Restablecer acceso", "Deshabilitar cuenta", "Mover de equipo", "Finalizar pertenencia", "Asignar rol", "Actualizar estado".
38. **"Deshabilitar cuenta"** (destructiva) renderiza con **el mismo peso visual que "Finalizar pertenencia"** (acción benigna). `variant="danger"` = **0 usos en todo `src/`**.
39. **Identidad y contacto es read-only**: DNI, fecha de nacimiento, teléfono y email se muestran como texto plano. No hay ningún control para corregirlos.
40. Selects **prellenados con el valor actual**: "Equipo de destino = Sexta A 2026" (el equipo actual) y "Rol a asignar = Entrenador" (primera opción). Un clic sin tocar el select produce un traslado no-op destructivo o asigna COACH.
41. "Elegibilidad" ofrece solo 3 valores y un botón; **no hay scope, source, reason ni vigencia** — la mutación los fija en `CLUB`/`INTERNAL`/`ADMIN`/`validFrom=hoy`/`validUntil=null` (`management.tsx:650-656`).
42. No hay sección de **relación de guardián** (Lucía tiene `gr-1` en `seed.ts:507-517`) ni de **historial**, pese a que la descripción de la pantalla dice "Los cambios conservan la historia."

## R-41 — Management/Structure (ADMIN)

43. La fila de Temporada renderiza el badge **"Activo"**. `StructureItem` sólo tiene `archived: boolean` (`model.ts:213-218`) y §19 no define lifecycle de estado para Season. Se inventa un estado.

## R-42 — Competition (COACH lectura / SUBCOMMITTEE escritura)

44. Inscripción renderiza **"Línea A · 2026"** — sin división ni temporada, con 4 divisiones en el dataset ("Línea A" existe en las cuatro). Verificación runtime de S4-03.
45. SUBCOMMITTEE ve "Cerrar competencia" deshabilitado **con razón visible** ("Para cerrar la competencia deben finalizar todas sus inscripciones activas.") ✓ — único caso de *blocked + reason* bien resuelto en todo el producto.
46. SUBCOMMITTEE en `/management` y `/management/people/p4` recibe "Sección no disponible / Tu acceso actual no incluye esta operación." — pero **§5 le concede `Eligibility mutation ✓`** y no existe ninguna otra superficie donde hacerlo.

## R-43 — Announcement (COACH) / corrección (SUBCOMMITTEE)

47. R24 renderiza **cero acciones primarias**: ni "Entendido", ni archivar (correcto para coach). Blueprint declara "Entendido" como primaria de R24.
48. R25 modo corrección: audiencia `disabled` + "La audiencia publicada no puede modificarse. Si fue incorrecta, corresponde crear un comunicado nuevo." + "Motivo de corrección" + "Guardar corrección". **Sin diff, sin `revision`, sin Impact Preview, sin contador de cambios.**

## R-44 — Reports/Attendance

49. La columna "% PRESENCIA" renderiza `100% / 50% / 0%`. Para 6 jugadoras con 2 planillas sin registrar, el valor es **0%**, no "sin datos". El pie de tabla sí advierte "Sin registros no se interpreta como cero actividad histórica", lo que **contradice el número mostrado**.
50. Selector "Período" con opciones literales "Septiembre 2026 / Octubre 2026".

## R-45 — Denegación por gating in-page

51. COACH en `/management`, `/management/structure`, `/management/people`, `/management/people/p2`, `/audit` → "Sección no disponible / Tu acceso actual no incluye esta operación. La administración no otorga autoridad deportiva ni acceso a conversaciones privadas." El **breadcrumb ya muestra "Hockey / Gestión"** o "Hockey / Historial" antes de negar el acceso. La pantalla denegada **no tiene `h1`**.

## R-46 — Más (hub)

52. COACH: "Mi perfil / Reportes / Competiciones / Jornadas / Cerrar sesión", con el detail de Jornadas **"Fecha 18 · GEI vs. CUBA · 1 partidos"** (concordancia).
53. ADMIN: "Mi perfil / Administración / Auditoría / Cerrar sesión" — **sin "Competiciones"**, aunque §5 le concede `Competitions/Entries ✓`; llega por `/management`.
54. SUBCOMMITTEE: mismo listado que COACH + Reportes; **sin "Administración"**, aunque tiene `Competitions ✓` y `Eligibility ✓`.
55. El breadcrumb de `/reports/*` dice **"Informes"** y el hub dice **"Reportes"**. Dos nombres para el mismo destino.

---

# 6. Evidencia negativa (ausencias verificadas)

Verificado por búsqueda en todo `src/**`:

| Patrón | Matches | Consecuencia |
|---|---|---|
| `variant="danger"` | **0** | ninguna acción destructiva tieneNFUESTO de peligro |
| `aria-live` | **0** | ningún cambio asíncrono se anuncia |
| `role="tab"` | **0** | las tabs de Structure y Communication no son tabs para AT |
| `useSearchParams` | **0** | ningún filtro/tab/mes está en la URL |
| `StickyActionBar` / `ImpactPreview` / `TimelineEntry` / `StateBanner` / `PageContextHeader` | 1 cada uno, **sólo en `patterns.tsx`** | la capa de gramática target de Stage 4 es **código muerto** |
| `canViewDni` / `canViewContact` / `canViewAudit` | 2 cada uno, **sólo en `authority.ts`** | la autoridad de campo PII nunca se consulta |
| `getAllowedActions` | importado en 2 features, usado en 1 flag | 15 de 16 flags sin uso |
| `findOrOpenDirect` | `store.tsx` + test | la UI reimplementa la regla DIRECT canónica |
| `attendanceHistory` / `recordHistory` | sólo **escritura** en `store.tsx` | el before/after que P0-2/P0-3 declaran cerrado **nunca se muestra** |
| `state.audit` | 1 lectura (`account-insight.tsx:752`) | la auditoría no se muestra en ninguna pantalla de detalle |

---

# 7. Veredicto de cobertura

| Dimensión | Estado |
|---|---|
| Rutas | **38/38 renderizadas** |
| Actores | 5/6 con evidencia runtime (PLAYER, CAPTABLE por dataset, COACH, SUBCOMMITTEE, ADMIN); **GUARDIAN sin evidencia runtime** |
| Viewports | 500 / 768 / 1440 **verificados**; **390 NO verificable en este entorno** |
| Interacción (click/teclado/hover) | **NO verificada** — sin automatización de navegador |
| Estados vacíos / zero / error | verificados por DOM y por código; el escenario `?scenario=degraded|stale|impact-changed` fue leído pero no ejecutado |
| Build de producción | verificado (`pnpm build` PASS, preview 4173 servió las 38 rutas) |

**`RUNTIME_VISUAL_AUDIT` = PARCIALMENTE EJECUTADO.** No se declara PASS visual en ningún viewport no observado ni en ninguna interacción no ejecutada. El resto de la auditoría Stage 5 se apoya en estas capturas + volcados de DOM + lectura de código, y cada afirmación del Master Audit marca si es `RUNTIME` o `STATIC`.