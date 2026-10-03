# GEI HOCKEY MANAGEMENT SYSTEM
## STAGE 5 — FRONTEND IMPROVEMENT PLAN V1

**Estado:** PLAN. **NO IMPLEMENTAR.** Ningún archivo de `src/**` fue modificado por Stage 5.
**Baseline:** `8f30cda91bb531539864ed9175ab256598b17e88` · rama `gei/stage5-ux-audit`.
**Origen:** cada slice existe porque hay findings. No hay un solo slice sin evidencia.

---

# 0. CÓMO SE ORDENÓ

Criterio del encargo §22:

```
PRIORIDAD = (IMPACTO EN COMPRENSIÓN × FRECUENCIA DE USO × CRITICIDAD DE FLUJO) ÷ COSTO DE IMPLEMENTACIÓN
```

Escala usada (1–5): **Comprensión** · **Frecuencia** · **Criticidad** · **Coste** (5 = barato).

| Slice | Compr. | Frec. | Crit. | Coste | Índice | Orden |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **B** Base perceptual | 5 | 5 | 3 | 2 (S) | **75** | **1** |
| **H** Propagación y verdad | 5 | 3 | 5 | 3 (M) | **75** | **2** |
| **C** Gramática de interacción | 4 | 5 | 4 | 3 (M) | **80** | **1** |
| **D** Navegación e IA | 4 | 5 | 3 | 3 (M) | **60** | 4 |
| **E** Cierre de flujos | 4 | 4 | 5 | 4 (L) | **80** | **1** |
| **F** Profile/Account | 4 | 3 | 3 | 3 (M) | **36** | 6 |
| **G** Corrección de arquetipos | 4 | 5 | 2 | 3 (M) | **40** | 5 |
| **I** Responsive y a11y | 3 | 5 | 3 | 4 (L) | **45** | 5 |
| **A** Decisiones de producto | 5 | 5 | 5 | 1 (XS) | **125** | **0 (bloqueante)** |
| **J** Stress final | 5 | 5 | 5 | 4 (L) | **125** | **10 (cierre)** |

**Secuencia recomendada:** `A → B → C → H → D → E → F → G → I → J`.
**A va primero porque es XS effort y desbloquea E y F sin los cuales no se pueden cerrar.** No es opcional: PG-06 y PG-03 requieren una decisión de Product Truth, y decidir al final significa rehacer trabajo.

**Si sólo se puede hacer un slice: B.** Es el que más cambia la percepción con menos riesgo de producto (0 features, 0 modelo, 0 rutas).

---

# SLICE A — DECISIONES DE PRODUCTO Y FLUJO (sin código)

- **Purpose:** desbloquear los slices E y F cerrando las 7 preguntas que Product Truth no responde, y fijar las decisiones de flujo que la implementación no puede inventar.
- **Findings que resuelve:** PG-01…PG-07, PDC-01…PDC-05, UX-16 (partial), UX-11, UX-17, UX-42 (partial), FDPG-02/FDPG-03 re-evaluación.
- **Files affected:** **0 de `src/`**. Sólo `docs/`: un addendum a Freeze §11/§13/§17/§20/§21 y una decisión registrada por FDPG.
- **Screens affected:** ninguno directamente; condiciona E, F y H.
- **Product impact:** ALTO. 4 de las 7 decisiones cambian el modelo de comandos (apply-to-occurrences, guardian relationships, setup tokens, announcement audience set).
- **UX impact:** ALTO. Sin A, F24 sigue Courtney audience que no es control de acceso y F09 sigue prometiendo un alcance que no aplica.
- **Dependencies:** ninguna. Es el primero.
- **Acceptance criteria:**
  1. `ApplyEventChange(scope, patch, impactToken)` queda definido en Freeze §32 con `event_occurrence_overrides` por ocurrencia (cierra PG-01).
  2. Freeze §20 define `CreateGuardianRelationship` / `EndGuardianRelationship` y aclara si el **menor** puede ver quién actúa por él (cierra PG-03 y G4 del Profile Map).
  3. Freeze §6 aclara si una jugadora puede autoinformar su DNI (§6 dice "DNI: ADMIN"). **Sin esta decisión, PG-06 no se puede construir** (cierra PG-06).
  4. `memberships[]` queda con superficie en §23: qué ruta y qué operación la expone (cierra PG-02).
  5. §21 redefine `Announcement.audience` como `TEAM_SET` + `audience_snapshot` + filtro de lectura por audiencia (cierra UX-16).
  6. §21 añade `Announcement.read_by`/`read_at` para el acuse "Entendido" (cierra UX-17).
  7. §51 especifica `IssueSetupToken` real (cierra F01).
  8. FDPG-02 y FDPG-03 quedan **DEFERRED con motivo escrito** (no por omisión): §22 prohíbe notificar por respuesta de disponibilidad; §20 no define reacciones.
  9. §25 confirma o descarta `notification_preferences` (cierra PDC-01).
- **Tests:** ninguno (es documento).
- **What NOT to touch:** `src/**`. No abrir tickets de implementación desde acá.
- **Risk:** **MEDIO**. El riesgo no es técnico, es de gobierno: 4 de las 9 decisiones requieren reabrir el Freeze, y §0 del Freeze dice que eso hay que hacerlo explícitamente. Si el equipo no puede reabrir Freeze v1.0.1, el fallback declarado es: PG-06 y PG-03 quedan `DEFERRED` y F18/F03 siguen PARTIAL/MISSING — **y eso hay que registrar, no ocultar**.
- **Effort:** **XS** (documental). **Valor de desbloqueo: el más alto del plan.**

---

# SLICE B — BASE DE JERARQUÍA PERCEPTUAL

- **Purpose:** que el ojo sepa dónde mirar. Reservar el acento, crear el color de peligro, y hacer que los tokens que Stage 4 declaró realmente governen la pantalla.
- **Findings que resuelve:** UX-01, UX-02, UX-03, UX-05, UX-06, UX-07, UX-35 (parcial), UX-36, UX-37, UX-43, UX-45. Ataca directamente los 3 reproches del usuario (§25.preguntas 11, 12, 13, 16).
- **Files affected:**
  - `src/styles/theme.css` — decidir el presupuesto de acento y añadir `--accent-interactive`, `--accent-selected`, `--danger-strong`, `--surface-raised`, `--surface-sunken`, y **cinco** niveles de escala tipográfica que cubran 27/22/15/13/11 sin huecos.
  - `src/shared/ui.tsx` — `Badge` (5 codificaciones de no-leído unificadas), `Button` (**alta de `variant="danger"`**: hoy 0 usos), `Header` (27 px → token), `Empty` (alto colapsable + icono semántico por defecto), `Surface` (3 niveles: sunken/raised/overlay).
  - `src/shared/states.ts` — registrar `RECONFIRM`; alinear `PLAYED/ABANDONED/FORFEIT`; **una sola fuente de vocabulario** (matar `model.labels` como mapper de UI).
  - `src/shared/patterns.tsx` — `DetailSection`/`FormSection`/`Surface` deben dejar de ser el mismo objeto visual.
  - `src/mock/model.ts` — `labels` deja de ser mapper de presentacion (o se borra y se unifica con `states.ts`).
- **Screens affected:** las 38. Es el slice con mayor superficie y el menor riesgo de producto.
- **Product impact:** NINGUNO. 0 features, 0 rutas, 0 modelo de dominio, 0 comandos.
- **UX impact:** **CRITICAL**. attacked 6 de las 8 preguntas perceptuales del usuario. Es el único slice que cambia la impresión del producto entero sin tocar una sola regla de negocio.
- **Dependencies:** ninguno. **Debe ser el primero en codificarse** (A es documental y paralelo).
- **Acceptance criteria:**
  1. Blur test: en `/home`, `/events/:id/selection`, `/events/:id` y `/more/profile`, al desenfocar queda **una** jerarquía legible (≤3 elementos dominantes).
  2. Squint test: en cada una de esas 4 pantallas, **no hay 5 elementos con peso 7–10 simultáneos**.
  3. El azul GEI aparece **sólo** en: marca, acción primaria, selección, no-leído. Los 5 usos restantes (chip de equipo, icono de fila, link de acción, badge de línea, punto decorativo) pasan a neutro.
  4. `variant="danger"` existe y se usa en las **12** acciones destructivas (con modal en las 8 que no lo tienen).
  5. En `/events/:id/selection`, "publicada con 1 situación para revisar" **no** se muestra con `tone="error"`; el rojo queda reservado a "no se pudo hacer".
  6. Cero apariciones de `text-[8px]`, `text-[9px]`, `text-[10px]` fuera de un token `--text-micro` declarado y justificado.
  7. `Header` y `PageContextHeader` usan el **mismo** token de título (hoy 27 vs 22).
  8. Un solo vocabulario de estado: "Entrenador o entrenadora" **o** "Entrenador", nunca ambos; "Habilitada" **o** "Elegible", nunca ambos.
  9. Un solo código de no-leído (badge con número + `aria-label`), usado en header, sidebar, lista y rows.
  10. `Empty` colapsa a ≤72 px cuando no hay acción, y su icono es semántico por contexto.
- **Tests:** (a) test de contrato que falle si aparece `text-[Npx]` fuera de la lista blanca; (b) test de contrato que falle si `variant="danger"` no está presente en el set de acciones destructivas; (c) snapshot visual por rol en las 4 pantallas de la acceptance 1; (d) axe en las 4 pantallas.
- **What NOT to touch:** `src/features/**` (sólo se consume lo que B exporte), el modelo de dominio, los comandos del store, las rutas, el copy de negocio. **B no cambia copy**: si un texto está mal, se corrige en C o G, no acá.
- **Risk:** **BAJO**. El único riesgo real es la tentación de rediseñar: si B empieza a mover layout de pantallas concretas, se convierte en refactor cosmético y se pierde su valor. Límite explícito: **B sólo define y exporta primitives; no edita features.**
- **Effort:** **S**.

---

# SLICE C — GRAMÁTICA DE INTERACCIÓN Y FEEDBACK

- **Purpose:** que lo interactivo parezca interactivo y que toda acción reciba feedback honesto. **Conectar la capa de gramática que Stage 4 escribió y dejó muerta.**
- **Findings que resuelve:** UX-18 (parcial), UX-21, UX-22, UX-36, UX-38, UX-46, B07/B08/B18/B21/B22/B23/B24. Convierte en código lo que hoy tiene 0 consumidores: `StateBanner`, `ImpactPreview`, `TimelineEntry`, `StickyActionBar`, `PageContextHeader`.
- **Files affected:**
  - `src/shared/patterns.tsx` — pasa de 0 a 5 consumidores; `StickyActionBar` con `z-index` y ancho de pantalla (hoy las barras sticky están dentro de `max-w-*`).
  - `src/shared/ui.tsx` — `TextField`/`Select`/`TextArea` **aceptan `error` + `aria-invalid` + `aria-describedby`** (hoy la API lo impide ⇒ 0 errores inline en 12 formularios); `Modal` con foco inicial en el primer campo (no en "Cerrar"); `Select` con estado disabled visible.
  - `src/shared/vas.tsx` + `src/features/participation.tsx` — **una sola** gramática de ¿Vas? (eliminar la segunda implementación).
  - `src/features/communication.tsx` — composer con altura real (`dvh`), `aria-live="polite"` en la lista, menú de mensaje con `role="menu"` + Escape + click-outside, confirmación de borrado.
  - `src/app/Shell.tsx` — unificar los 5 códigos de no-leído; quitar el pie de marketing de 10 px; "Temporada 2026" en un solo lugar.
  - `src/features/management.tsx` — verbos por operación (no "Confirmar cambio" para 10 operaciones); `danger` en deshabilitar/archivar; select de rol **sin default**.
  - `src/features/events.tsx` — `<form>` real (Enter submitea), foco al primer error, dirty state, confirmación de descarte, quitar `key={index}`.
- **Screens affected:** 26 de 38 (todas las que tienen formulario, menú, sticky o no-leído).
- **Product impact:** BAJO-MEDIO. 0 comandos nuevos. 1 cambio de comportamiento: la confirmación de descarte.
- **UX impact:** ALTO. Cierra B18/B21/B22/B23/B24 por completo y elimina 3 de los 4 "no fake success" (copia optimista, `CheckCheck` estático, backdrop que descarta).
- **Dependencies:** **B** (los primitives de `danger`, `error` inline y superficie con niveles deben existir antes).
- **Acceptance criteria:**
  1. 12/12 formularios tienen error inline con `aria-invalid` + `aria-describedby` + foco al primer campo.
  2. 12/12 formularios tienen dirty state visible y confirman al descartar.
  3. 0 formularios pierden el input ante error (ya se cumple: no debe regressions).
  4. `Enter` submitea en los 4 formularios con `<form>`.
  5. 0_backdrop descarta sin confirmar.
  6. 1 sola implementación de ¿Vas? (`VasInline`), con el copy no optimista "Respuesta guardada." en todos lados.
  7. Enviar mensaje tiene estados `enviando` / `enviado` / `falló`; `CheckCheck` **sólo** cuando el estado local es confirmado.
  8. 12/12 acciones destructivas: `danger` + modal de consecuencias.
  9. El composer del chat queda a `dvh` y visible sobre el teclado en 390 px.
  10. `aria-live` en la lista de mensajes y en la lista de avisos.
- **Tests:** (a) por formulario: error inline + foco + input preservado; (b) dirty + descarte; (c) `Enter`; (d) estados de envío de mensaje; (e) axe en los 9 formularios.
- **What NOT to touch:** el modelo, las rutas, la autoridad (`getAllowedActions` se conecta en otro slice), el contenido de los Impact Preview (eso es E/H). **No unificar los dos vocabularios de estado acá** (es B).
- **Risk:** **MEDIO**. El riesgo es de alcance: 26 pantallas es demasiado para un solo lote. **Mitigación:**.internalizar por primitive (una primitive ⇒ todos sus consumidores), nunca pantalla por pantalla.
- **Effort:** **M**.

---

# SLICE H — PROPAGACIÓN Y VERDAD (el slice de confianza)

- **Purpose:** que lo que el sistema registra sea visible, y que lo que la pantalla afirma sea verdad. **Es el slice que ataca el hallazgo más grave de la auditoría.**
- **Findings que resuelve:** UX-18, UX-19, UX-34, UX-35, UX-44, y los cierres de F01/F08/F12/F13/F14/F25/F28.
- **Files affected:**
  - `src/features/participation.tsx` — **renderizar `attendanceHistory` y `recordHistory`** (existen, se escriben, son invisibles). Es un bloque `TimelineEntry` nuevo bajo la planilla y bajo el acta.
  - `src/mock/store.tsx` — `update()` deja de escribir `date: "02 oct 2026 · Ahora"` y usa el reloj real; `notify()` deja de incluir al actor y de notificar a todos en anuncios; `before_after_label()` deja de devolver una constante.
  - `src/mock/model.ts` — `AuditEntry` gana `before`/`after`/`source`/`resourceRef`; `Notice` gana `readAt`.
  - `src/features/account-insight.tsx` — `/audit` con before/after, recurso como link, y **filtro de fecha por rango** (hoy reconoce 3 literales).
  - `src/features/overview.tsx` — **`hasCurrentConflicts` derivado y consumido** (§14): hoy se calcula local y efímero y Home no lo ve; quitar el badge "6 A"; quitar "Temporada 2026" literal; ordenar por urgencia; el chip "0 pendientes" desaparece cuando es 0.
  - `src/features/events.tsx` — `ImpactContent`: rótulos "Antes"/"Después", conteos de destinatarios reales, campos limpiados visibles, "…al programarse" sólo si el evento va a programarse; granularidad de reconfirmación (que el texto diga qué cambió).
  - `src/features/participation.tsx` — `RESTORE` vs `RESCHEDULE` con `NotificationType` distinto.
  - `src/features/management.tsx` — "Generar código de activación" que **realmente crea el token**; rotación de username; guard `LAST_ADMIN` también en "Restablecer acceso".
  - `src/features/communication.tsx` — `notice.type` renderizado en lenguaje usuario; orden no-leídos primero; agrupar; "marcar leído sin salir".
  - `src/features/account-insight.tsx` + `src/features/management.tsx` — fechas de periodo de reports derivadas, no literales; `% PRESENCIA` = "—" cuando no hay dato.
  - `src/mock/seed.ts` — fecha de `training-today` derivada de `todayIso()` (hoy `clock.ts:3` **afirma** que el seed usa fechas relativas y no lo hace), y al menos un evento hoy para que "Hoy" no arranque vacío.
- **Screens affected:** 16 (todas las que muestran verdad: Home, Event, Availability, Selection, Attendance, MatchRecord, People, PersonAdmin, Announcement, Conversation, Notifications, Audit, Reports×2, Structure, Jornada).
- **Product impact:** **ALTO**. Cierra C14 de MISSING y convierte 4 flows CONTRADICTORY/PARTIAL enPartialcorRECT. Añade `before/after` a `AuditEntry` (alinea con §26 `audit_entries` + `command_receipts.result_data`).
- **UX impact:** ALTO. **Elimina la categoría completa de "el sistema afirma algo que no hace".** Un usuario que corrige una asistencia puede ver qué cambió; un usuario que publica un aviso sabe a quién avisó.
- **Dependencies:** A (para `IssueSetupToken` y para el `TEAM_SET` de audiencia), B (superficies), C (`TimelineEntry` conectado).
- **Acceptance criteria:**
  1. `/attendance` muestra el historial de correcciones con `before → after`, motivo, autor y fecha.
  2. `/match-record` muestra el historial del acta con `3-1 → 4-1 (FINAL)`, motivo, autor y fecha.
  3. `/audit` muestra `before/after` y el recurso es un link al objeto.
  4. `/audit` con cualquier fecha devuelve resultados correctos (o explica el rango), no 0 silencioso.
  5. 0 fechas "Ahora" con fecha de ayer: toda fecha escrita usa el reloj real.
  6. El conteo de destinatarios del Impact Preview = el conjunto real, actor excluido.
  7. `/home` consume `hasCurrentConflicts` y una jugadora con conflicto en la convocatoria publicada **ve** la fila.
  8. "Generar código de activación" produce un token que `/activate` acepta, y el código deja de ser un literal compartido.
  9. `/notifications` nombra el tipo de aviso en lenguaje usuario y ordena no-leídos primero.
  10. El guardián **no** aparece como "Jugadora / Club" en `/management/people` (depende de S4-04, ver Slice E).
  11. `reports/attendance` nunca muestra `0%` donde no hay dato.
  12. Con el reloj real, `/home > Hoy` tiene al menos un evento en el estado inicial del seed.
- **Tests:** (a) `attendanceHistory` renderiza N entradas con before/after (hoy existe un test de **modelo**, hay que añadir de **superficie**); (b) `recordHistory` idem; (c) audit con fecha arbitraria; (d) el código de `/activate` es el emitido por `/management`; (e) el conteo de impacto = `recipients.length` real; (f) reloj: una entrada de audit creada hoy tiene la fecha de hoy.
- **What NOT to touch:** la gramática visual (B/C), las rutas, el orden de las listas de `Home` más allá del criterio de urgencia, los textos de negocio. **No rediseñar `/audit`**: se le agregan 3 columnas y un link.
- **Risk:** **MEDIO-ALTO** por volumen (16 pantallas). Mitigación: hacerlo **por truth source** (`attendanceHistory` ⇒ sus 1-2 pantallas; `audit` ⇒ su 1 pantalla), nunca pantalla por pantalla.
- **Effort:** **M**.

---

# SLICE D — NAVEGACIÓN E IA

- **Purpose:** que siempre se sepa dónde se está, cómo volver, y qué se puede hacer aquí. `useSearchParams` = **0** es, en sí solo, uno de los hallazgos más baratos de cerrar.
- **Findings que resuelve:** UX-23, UX-27, UX-40, UX-01 (parcial), B16, y los cierres de F26/F27/F04/F30.
- **Files affected:**
  - `src/app/App.tsx` o guard nuevo — **route gating real**: loader que consulta `allowedActions` por ruta; hoy `/management/*` y `/audit` responden a cualquiera con `hasAccess`.
  - `src/shared/nav-context.ts` — unificar "Historial"/"Auditoría" y "Informes"/"Reportes"; los prefijos de `/events/*` dicen "Partido o entrenamiento" para un partido concreto (scent débil).
  - `src/features/overview.tsx` — mes/año/equipo/tipo/vista **en la URL**; toggle Mes/Agenda con estado activo y `aria-pressed`; corte de mes a `lg:`; leyenda coherente o type-in-text.
  - `src/features/communication.tsx` — tab **en la URL**; CTA por tab; empty de comunicados; guard de audiencia en el deep link.
  - `src/features/management.tsx` — tab de Structure **en la URL**; filtros de People **en la URL** + reset; `role="tablist"`/`role="tab"`/`aria-selected`.
  - `src/features/account-insight.tsx` — filtros de Reports y Audit **en la URL** + reset; `role="tab"` donde aplique.
  - `src/app/Shell.tsx` — el filtro de `Comunicación` con doble negativo ilegible; el heading "MI EQUIPO" que muestra "Administración"; `Restricted` con `h1` y sin crumb que prometa la sección.
  - `src/features/management.tsx` — quitar `/teams` del hub `/management` y la fila "roster".
- **Screens affected:** 20.
- **Product impact:** BAJO. 0 comandos. El route gating **sí** cambia comportamiento (una URL no autorizada deja de renderizar la pantalla denegada y pasa a denegar antes).
- **UX impact:** ALTO. "Siempre sé dónde estoy y cómo volver" (§B16) pasa de FAIL a PASS. Elimina la contradicción "el breadcrumb dice Gestión y la pantalla dice no disponible".
- **Dependencies:** B (para que la tab activa sea visible sin que sea "otro azul"), D-route-gating depende de la capa de autoridad (ver §"riesgo").
- **Acceptance criteria:**
  1. `/calendar?m=2026-10&team=sexta&type=all&view=agenda` restaurable y compartible; Back preserva.
  2. `/communication?tab=conversations` preservado al volver de un hijo.
  3. `/management/structure?tab=sedes` y `/management/people?q=&team=&role=&account=` preservados, con botón "Limpiar filtros" y empty con la acción.
  4. `/reports/attendance?team=&period=&person=` preservado.
  5. `/search?q=` preservado al volver del resultado.
  6. Tabs con `role="tablist"`/`role="tab"`/`aria-selected` y navegación por flechas en Structure y Communication.
  7. El toggle Mes/Agenda muestra estado activo y **no es no-op** en ningún viewport.
  8. Un actor sin autorización que escriba `/management/people` por URL **no** ve la pantalla denegada con el crumb "Gestión": ve una pantalla con `h1` propio.
  9. SUBCOMMITTEE que llega a `/management/competitions/:id` por `/more` **no** atraviesa un hub que lo niega (o el hub reconoce su sub-acceso, o la ruta sale de `/management`).
  10. Cero etiquetas duplicadas por destino ("Historial" vs "Auditoría"; "Informes" vs "Reportes"; "Buscar en GEI" dos veces).
- **Tests:** (a) por ruta con estado: montar → cambiar filtro → navegar → `Back` ⇒ filtro restaurado; (b) tab restaurado; (c) gating: 5 roles × 6 rutas restringidas ⇒ ninguna renderiza contenido no autorizado; (d) axe de tabs.
- **What NOT to touch:** el orden de las tabs (es correcto), la selección de los 5 destinos, el cross-highlight (funciona), los labels de negocio. **No mover rutas**: la corrección es de gating y de estado en URL, no de path (mover paths rompería los deep links ya compartidos).
- **Risk:** **MEDIO**. El route gating toca `App.tsx`, que es el único archivo que ninguna otra pantalla importa. Riesgo de blank screen si el loader rechaza mal. **Mitigación: empezar por estado en URL (sin riesgo) y hacer el gating al final del slice.**
- **Effort:** **M**.

---

# SLICE E — CIERRE DE FLUJOS DE PARTICIPACIÓN Y EVENTO

- **Purpose:** cerrar los flujos que hoy prometen y no cumplen. Es el slice de mayor valor funcional.
- **Findings que resuelve:** UX-11 (S4-01), UX-12 (S4-02), UX-13 (S4-03), UX-14 (S4-04), UX-29, UX-31, UX-32, UX-33, UX-04, UX-06, UX-20, y F06/F08/F09/F10/F11/F12/F13/F14/F15/F20.
- **Files affected:**
  - `src/mock/store.tsx` + `src/features/events.tsx` — **`ApplyEventChange` con scope real**: `scope` entra en la mutación, itera `state.events` por `seriesId`, escribe override por ocurrencia, `coordination_revision++` por ocurrencia, notify por ocurrencia. **Es el hallazgo P0 de Stage 5.**
  - `src/features/participation.tsx` — `SelectionPage`: estado `CONFLICT` del autosave (§45), Conflict Workspace de 3 columnas (baseline / borrador / servidor), diff `selectedNow`/`removedNow` en el modal de publicación, sección de revisiones en la propia pantalla, `hasCurrentConflicts` como campo.
  - `src/features/events.tsx` — `EventForm`: **campo Título en edición** con su rama non-material y `Object.assign` limitado al patch; recuperación de conflicto que **preserva el `draft`** (§44); `ABANDONED` alcanzable; modal para `IN_PROGRESS`; granularidad de reconfirmación por campo (que el texto diga qué cambió).
  - `src/features/participation.tsx` — `AttendancePage`: botones de fila a **44 px**; cierre que explique el destino de los `UNRECORDED`; gate de lifecycle en `MatchRecordPage` (`§12`); coherencia `played ↔ goals`.
  - `src/features/management.tsx` — `CompetitionEntry` con `teamId`/`lineId` + `seasonId` derivado y `422 COMPETITION_SCOPE_MISMATCH` visible; candidatos LINE con división + temporada.
  - `src/features/events.tsx` — `JornadaPage`: add/remove de hijos; `expectedVersion` en el bulk; conteo real; error + `pending` en el modal; gate de `mutable` coherente con `EventDetail`.
  - `src/mock/permissions.ts` / `store.tsx` / 4 features — **eliminar `person.team` y `person.role` como selectores de UI** (S4-04): `overview.tsx:61,167,445`, `participation.tsx:134`, `communication.tsx:196-198`, `account-insight.tsx:593,642`, `store.tsx:167`. Todos deben derivar de `teamAssignments[]` / `roleAssignments[]` con scope.
  - `src/mock/seed.ts` — `competition_entries` con `teamId`/`lineId`; `structure` con líneas por división.
- **Screens affected:** 11 (Event create/edit/detail, Availability, Selection, Attendance, MatchRecord, Jornada×2, Competition detail, y **transversalmente** las 38 por S4-04).
- **Product impact:** **ALTO**. C04 pasa de CONTRADICTORY a la primera capability con una capa de autoridad viva. C05, C06, C07, C08, C09, C10 suben de nivel. Cierra 8 gaps de Stage 4 (5 de ellos ya re-priorizados por esta auditoría).
- **UX impact:** **CRITICAL**. Convierte 8 flujos MISSING/PARTIAL en Complete y elimina 4 "el sistema afirma algo que no hace".
- **Dependencies:** **A** (obligatorio: PG-01, PG-04, decisión de §6), **B** (StateBanner para terminales), **C** (error inline + danger + sticky), **H** (historiales visibles).
- **Acceptance criteria:** (ver §9 del Master Audit y las listas "FALTANTE PARA SER COMPLETO" de cada flujo). Mínimos:
  1. Elegir "Toda la serie" con 2 eventos muta **2** eventos y cada uno tiene override + historial + notify.
  2. `POST` con `version` desactualizado muestra las 3 versiones lado a lado y **el `draft` sobrevive** al conflicto y a la recuperación.
  3. Publicar convocatoria muestra **quién entra y quién sale** respecto de la revisión anterior.
  4. Home consume `hasCurrentConflicts`: una jugadora con conflicto publicado ve la fila de atención.
  5. Un evento `CANCELLED` muestra consequence communicated + `StateBanner` + lifecycle bloqueado.
  6. `ABANDONED` se alcanza desde `IN_PROGRESS` en un MATCH, y el acta **no** puede fijar un estado que el evento no tiene.
  7. Los 3 botones de fila de Attendance miden ≥44 px con separación suficiente.
  8. `CompetitionEntry` distingue TEAM y LINE, y la UI muestra "Línea A de Sexta · Temporada 2026" en vez de "Línea A · 2026".
  9. **0 usos de `person.role`/`person.team` como selector de UI** (grep verificable).
  10. El campo Título existe en edición y su guardado **no** dispara notificación ni `revision++` (con test).
- **Tests:** (a) serie: 1 evento, 2 ocurrencias, 3 alcances ⇒ matriz de mutaciones; (b) conflicto: 3 versiones visibles + draft preservado; (c) revisions diff; (d) `ABANDONED` path; (e) Attendance 44 px (test de clases); (f) LINE vs TEAM entry; (g) grep-test que falle si `person.role`/`person.team` aparece en `features/`.
- **What NOT to touch:** la densidad y la composición de las tablas (es G); los colores (B); el copy de negocio que ya es correcto ("Sin registrar no significa ausente", "Mover termina la asignación…"); el modelo de `Person` más allá de eliminar los dos selectores legacy; `guardian` (es F).
- **Risk:** **ALTO**. Es el slice más grande y el que más superficie toca. **Mitigación obligatoria: dividir en tres lotes** — E1 (S4-04 + authority), E2 (serie + impacto + conflicto), E3 (Attendance/MatchRecord/Jornada/CompetitionEntry). E1 primero: es la causa raíz de la verdad falsa en listas.
- **Effort:** **L**.

---

# SLICE F — PROFILE / ACCOUNT / GUARDIAN

- **Purpose:** responder al reclamo explícito del usuario con evidencia de Product Truth, no con invención. Y cerrar el hueco de Guardian, que hoy es el único contexto **no verificable en runtime**.
- **Findings que resuelve:** UX-42, UX-26, UX-17, y C01/C03. Cierra F02, F03, PG-02, PG-03, PG-05.
- **Files affected:**
  - `src/features/account-insight.tsx` (`ProfilePage`) — de 4 datos a 7 grupos, con el mapa del Capability Doc §3.3 como especificación: **estado de cuenta**, **roles + alcance** (derivado de `roleAssignments[]`, no de `actor.role`), **Membership/TeamAssignment con período**, **Seguridad** (sesiones + última actividad + enlace a cerrar sesión), y "Personas a cargo" **con ambos permisos visibles** y **gestionable**.
  - `src/features/account-insight.tsx` — "Cerrar sesión" también en Seguridad; "Perfil de jugadora incompleto" con su salida (depende de A3).
  - `src/mock/store.tsx` — `guardianChildren` debe derivar el **alcance** del guardián (`childId → TeamAssignment → eventos`) y `capabilities.availability` debe considerar `canRespondAvailability`.
  - `src/features/overview.tsx` — `onChange` del selector de menor + propagación a Calendario/Equipo/Availability (§20 exige las 4 proyecciones).
  - `src/features/participation.tsx` — Availability accesible al guardián para el menor, con PII gating de §6 Guardian.
  - `src/features/management.tsx` — sección "Relación de guardián" en la ficha de persona (§6 dice que ADMIN es quien la ve).
  - `src/mock/store.tsx` — `?demo=guardian` en el harness de actor.
  - `src/features/management.tsx` — `Membership` (PG-02): sección en la ficha + paso en el alta de persona.
- **Screens affected:** 5 (Profile, Home, Availability, PersonAdmin, PersonCreate) + transversal.
- **Product impact:** ALTO. Cierra C01 y C03, y hace verificable el único contexto de actor que hoy no lo es.
- **UX impact:** ALTO y **es la respuesta directa al pedido del usuario**. Convierte la pantalla mas vacia del producto (22 % del viewport para 4 datos) en la pantalla de identidad y acceso que el nombre promete.
- **Dependencies:** **A** (PG-03 necesita comando de guardian relationship; PG-06 necesita la decisión de §6; PG-05 necesita backend de `activity`), **B** (superficies), **E1** (los roles deben derivar de assignments antes de que el perfil pueda mostrarlos).
- **Acceptance criteria:**
  1. `/more/profile` muestra los grupos A, C, D, E, F, G del `PROFILE_COMPLETENESS_MAP`; los grupos E (preferencias) e H (actividad personal) **no** aparecen porque Product Truth no los soporta.
  2. Multi-role: una persona con 2 `RoleAssignment` ve **2** roles con su scope y su vigencia, no 1 etiqueta.
  3. Estado de cuenta visible (PENDING/ACTIVE/DISABLED) + si la credencial está establecida.
  4. "Personas a cargo" muestra `can_view_child_info` **y** `can_respond_availability`, ambos, incluso cuando son `false`.
  5. Con 2+ menores, el selector `Viendo a X` cambia el contexto **y** propaga a Calendario, Equipo y Availability (§20).
  6. El guardián puede responder "¿Vas?" por el menor, y **no** ve DNI, fecha de nacimiento, motivo de elegibilidad ni conversaciones privadas.
  7. `?demo=guardian` funciona ⇒ el contexto es verificable en runtime.
  8. ADMIN ve la relación de guardián en la ficha de persona.
  9. La descripción de la pantalla deja de prometer "tu acceso" si no lo muestra — o lo muestra.
- **Tests:** (a) perfil con 0/1/2 roles; (b) perfil de guardián con 1 y 2 menores; (c) guardián responde availability y la fila aparece en EventDetail sin PII; (d) assertion de que el perfil **no** muestra DNI ni fecha de nacimiento en ningún rol; (e) `?demo=guardian` renderiza `/home` con el contexto del menor.
- **What NOT to touch:** **no inventar preferencias de notificación ni "mi actividad"** (no están en Product Truth; son PDC-01/PDC-05). No ampliar el alcance de `Account` más allá de lo que §5/§26 conceden. No tocar el chat.
- **Risk:** **MEDIO**. El riesgo es de invención: la tentación de "completar" el perfil con datos que el producto no tiene. **Regla dura: cada fila del perfil debe poder citar su sección de Freeze.** Si no puede, es PDC.
- **Effort:** **M**.

---

# SLICE G — CORRECCIÓN DE ARQUETIPOS (densidad, agrupación,ropsura)

- **Purpose:** que cada archetype se parezca a su definición. Sin features nuevas, sin comandos: sólo composición, densidad y agrupación.
- **Findings que resuelve:** UX-03, UX-08, UX-09, UX-15, UX-37, UX-45, B04/B13/B14/B37, y los cierres parciales de F04/F05/F16/F21/F22/F23/F30.
- **Files affected:**
  - `src/features/overview.tsx` — `/home`: orden de urgencia real; "¿Vas?" en la posición del blueprint (después de Hoy); "Hoy" con seed relativo; Communications con estado de no-leído; quitar el bloque "En el equipo" sin función o darle función; `/teams`: marcar "Mi equipo" y empty para el guardián; `/teams/:id`: resultado con link al evento.
  - `src/features/overview.tsx` — `/calendar`: **¿Vas? alcanzable desde la selección** (inline o sheet); sheet de mini-detalle; panel lateral en `lg:`; leyenda coherente.
  - `src/features/communication.tsx` — `/communication`: quitar el tab "Todo"; separación perceptual real entre canales (superficie o heading con peso distinto, no sólo texto); `readBy` en comunicados; orden + filtro por tipo; `Conversation.state` + archivar; sheet de miembros; resolver `teamId`/`eventId` a nombre canónico + link.
  - `src/features/participation.tsx` — rosters de Selection/Attendance: densidad (fila de ~56 px), `truncate` en vez de `flex-wrap`, encabezado de tabla a `md:` con fallback a labels en mobile.
  - `src/features/account-insight.tsx` — `/reports/*`: links al origen, empty real, `<th>`.
  - `src/features/events.tsx` — `ImpactContent`: grilla con rótulos y `md:` de 3 columnas.
- **Screens affected:** 14.
- **Product impact:** NINGUNO (salvo `Conversation.state`, que es Model Change menor y ya está en A).
- **UX impact:** MEDIO-ALTO. No agrega capacidad: **hace legible lo que ya existe** y quita ruido. Ataque directo a §25.preguntas 13, 14, 16.
- **Dependencies:** B (superficies con niveles), C (sticky, `aria-pressed`, tabs), E (para que `/calendar` pueda ofrecer ¿Vas? con la gramática única).
- **Acceptance criteria:**
  1. En `/home`, la fila más urgente es la primera; el bloque "En el equipo" tiene función o no existe; "Temporada 2026" aparece **una** vez.
  2. En `/calendar`, seleccionar un evento ofrece responder "¿Vas?" sin salir del calendario (≥1 camino).
  3. En `/communication`, un usuario nuevo distingue "mensajes" de "comunicados oficiales" en menos de 2 segundos **sin leer los títulos** (blur test).
  4. Las tablas de 18 filas se leen sin scroll horizontal en 1440 y sin perder etiquetas en 390.
  5. `/reports/*`: desde una celda se llega a la planilla o a la persona.
  6. `Remove test`: ningún elemento de `/home`, `/communication` y `/more` sobrevive sólo por decoración.
- **Tests:** (a) snapshot por viewport de las 6 pantallas; (b) aserción de que `/calendar` contiene un control de availability; (c) axe.
- **What NOT to touch:** el **orden** de las secciones (ya es correcto según el blueprint); el contenido de las filas; los mensajes de empty que ya son correctos; el copy de negocio. **No añadir features**: si un elemento falta, primero se pregunta si es A, B, C o D.
- **Risk:** **BAJO-MEDIO**. El riesgo es deconstructivismo: "mejorar" el arquetipo tocando el modelo de la lista.
- **Effort:** **M**.

---

# SLICE I — RESPONSIVE Y ACCESIBILIDAD

- **Purpose:** que la responsive preserves significado (§24) y que el producto sea operable con teclado y lector de pantalla.
- **Findings que resuelve:** UX-39 (parcial), B30, B31, B29, y los cierres de F05/F16/F21/F22.
- **Files affected:**
  - `src/app/App.tsx` — `xl:grid-cols-[…300px]` ⇒ `lg:` (1024) en las 6 pantallas con panel lateral; **390 px sigue sin ser verificable en este entorno**: hay que decidir un método (agente de navegador o CI con viewport emulado) antes de cerrar este slice.
  - `src/features/management.tsx` — tabla de People: segunda línea con equipo+rol bajo 768 px; `overflow-x-auto` con señal.
  - `src/features/participation.tsx` — etiquetas de columna visibles también en mobile (no sólo el dato).
  - `src/features/management.tsx` + `communication.tsx` — `role="tablist"/"tab"/"tabpanel"`, `aria-selected`, navegación por flechas, `aria-controls`.
  - `src/features/events.tsx` — menú de overflow: `role="menu"`, `aria-expanded`, `aria-haspopup`, Escape, click-outside, foco gestionado, items ≥44 px.
  - `src/features/account-insight.tsx` — `Restricted` con `h1`; `AuditPage` y `PeopleManagement` sin skip h1→h3.
  - `src/features/participation.tsx` — `SelectionPage`: `<th>` + `aria-describedby` del conflicto en el checkbox; tabla semántica.
  - Global — skip link, `lang`, foco gestionado en cambio de ruta, `prefers-reduced-motion` ya respetado (mantener).
- **Screens affected:** 22.
- **Product impact:** NINGUNO.
- **UX impact:** MEDIO-ALTO. **Es el slice que decide si el producto es operable en el teléfono**, que es el contexto de uso declarado (§1.3, RNF "responsive"). Y es requisito de §78 Evidence Pending ("responsive behavior", "actual accessibility behavior").
- **Dependencies:** B, C, D (tabs), G (densidad).
- **Acceptance criteria:**
  1. 100 % del flujo F04, F05, F11, F12, F13, F26 completable **a 390 px** con un método de verificación declarado.
  2. 0 overflow horizontal en las 38 rutas a 390/768/1440.
  3. Panel lateral presente desde 1024 px en las 6 pantallas que lo tienen.
  4. Ninguna tabla pierde información al narrower: todo dato de columna tiene fallback.
  5. 0 targets <44 px en gestos de roster y en acciones de fila.
  6. 0 `skip h1→h3`; toda página tiene `h1`.
  7. Tabs navegables por flechas; menús con Escape y foco.
  8. `axe` sin violaciones serias en las 38 rutas × 6 roles.
  9. Navegación completa por teclado en F12 y F17 sin ratón.
  10. 200 % zoom sin pérdida de contenido ni de acción.
- **Tests:** (a) axe por ruta × rol; (b) test de viewport con overflow (`scrollWidth > clientWidth`); (c) test de target mínimo; (d) recorrido de teclado automatizado en 6 flujos; (e) orden de headings por ruta.
- **What NOT to touch:** el layout de las pantallas que ya funcionan a 1440 (elslice es adaptativo, no rediseño); los breakpoints de `Modal`; el grid de `Selection` (ya está bien a 1440).
- **Risk:** **MEDIO**, y tiene una dependencia externa: **el método de verificación a 390 px no existe en este entorno** (ancho mínimo del SO). Hay que decidirlo antes de empezar, o el slice no se puede cerrar honestamente.
- **Effort:** **L**.

---

# SLICE J — STRESS FINAL

- **Purpose:** comprobar que lo anterior no se rompió y que el producto ya puede freeze.
- **Findings que resuelve:** ninguno nuevo; los previene.
- **Files affected:** tests, y un segundo pase de esta auditoría.
- **Screens affected:** las 38.
- **Acceptance criteria:**
  1. `pnpm typecheck`, `pnpm test`, `pnpm build` verdes, con los tests nuevos de B/C/E/F/H/I.
  2. Re-ejecutar **esta auditoría** (48 bloques × 38 rutas) y exigir: **0 MAJOR en B03, B10, B11, B35** (jerarquía, color, tipografía, confianza) y **≥40 % de PASS** en la matriz (hoy 7.8 %).
  3. Los 7 product gaps con decisión escrita (IN/DEFER/OUT) y los 5 PDC con la misma decisión.
  4. Los 5 S4 gaps revalidados y cerrados o re-declared con prioridad.
  5. Los 30 flows con status actualizado; objetivo: **≥20 COMPLETE o PARTIAL con las 11 dimensiones de §5**, y **0 CONTRADICTORY**.
  6. Verificación runtime en los 3 viewports con **método declarado**.
  7. Una captura por rol por pantalla significant, archivada como evidencia.
- **Tests:** los de todos los slices + un **test de contrato de honestidad**: ninguna pantalla puede afirmar un conteo, una fecha o un estado que el modelo no respalde (éste es el test que habría evitado el badge "6 A", el `count={19}` y el "El horario cambió" por un cambio de sede).
- **What NOT to touch:** todo. Este slice no añade features.
- **Risk:** BAJO.
- **Effort:** **L**.

---

# 9. PRIORIDAD TOP (§22)

Orden por `impacto × frecuencia × criticidad ÷ coste`, con el effort real:

| # | Ítem | Slice | Tipo | Effort | Impacto | Frecuencia | Criticidad | Por qué es top |
|---|---|---|---|---|---|---|---|---|
| 1 | **Reservar acento + crear `danger` + bajar la escala tipografica a tokens** | B | D | S | 5 | 5 | 3 | Es lo que el usuario percibe por su cuenta ("sigue plano", "todo con el mismo peso"). 0 riesgo de producto. 38 pantallas. |
| 2 | **Conectar `StateBanner`/`ImpactPreview`/`TimelineEntry`/`StickyActionBar`/`PageContextHeader`** (ya escritos, 0 consumidores) | B+C | A/D | XS–S | 5 | 5 | 3 | El mayorKXk de deuda del código: la capa de gramática target existe y no se usa. |
| 3 | **Renderizar `attendanceHistory` y `recordHistory`** | H | A | XS | 5 | 3 | 5 | Stage 4 declara P0-2/P0-3 cerrados; el dato existe y es invisible. Es la afirmación más grave del informe de Stage 4. |
| 4 | **Quitar `person.role`/`person.team` como selectores** (S4-04) | E1 | A | S | 5 | 5 | 4 | Causa raiz de: guardiana listada como "Jugadora / Club", scope de eventos ignorado, filtro de candidatos, alcance de reports. |
| 5 | **`ApplyEventChange` con scope real** (S4-01 / PG-01) | E2 | C+A | M | 4 | 3 | 5 | La UI promete un alcance que no aplica. Convierte F09 de MISSING a COMPLETE. |
| 6 | **Completar `/more/profile`** (estado de cuenta, roles/alcance, Membership, seguridad, delegaciones) | F | A | M | 5 | 3 | 3 | Responde al reclamo del usuario con evidencia de Freeze. 4 de 7 grupos se derivan de datos que **ya están en el modelo**. |
| 7 | **Filtros y tabs en la URL** (`useSearchParams` = 0) | D | B | S | 4 | 5 | 3 | Back preserva origen (§24). 20 pantallas. Casi sin riesgo. |
| 8 | **Historial visible en Attendance y MatchRecord + audit con before/after** | H | A | S | 5 | 3 | 5 | "Confianza" es lo que §71 llama History. |
| 9 | **Eliminar la verdad falsa en pantalla** (badge "6 A", `count={19}`, fecha de audit, `CheckCheck` estático, "El horario cambió" por cambio de sede) | H | A | S | 4 | 5 | 4 | Un producto que miente pierdeTodo. 5 correcciones puntuales y baratas. |
| 10 | **Estado terminal comunicado** (`CANCELLED`/`POSTPONED` con consecuencia) | B+E | B | S | 4 | 4 | 5 | Hoy un partido cancelado es indistinguible de uno vivo. §9 del Blueprint lo exige. |
| 11 | **Recuperación de conflicto que preserve el draft** | E2 | B | S | 3 | 2 | 5 | §44 explícito: 409 preserva baseline + localDraft + latestServer. Hoy navega y descarta. |
| 12 | **Audiencia de comunicado como control de acceso** (PG/§21) | A+E | C | M | 4 | 3 | 5 | Hoy cualquiera por URL lee un comunicado de otra división. |
| 13 | **Guardián operable** (alcance por menor, responder ¿Vas?, selector funcional) | A+F | A+C | M | 3 | 1 | 4 | §20 es explícito y es el único contexto no verificable hoy. |
| 14 | **44 px en Attendance + `UNRECORDED` como estado terminal explicado** | E3 | B | S | 3 | 3 | 5 | *Mis-tap* con consecuencia de dato. |
| 15 | **Quitar la losería de coherencia** (`Availability`, `1 pendientes`, `1 partidos`, `0 sí`) | B+G | D | XS | 3 | 5 | 3 | 6 correcciones de una línea. Barato y quita la sensación de "AI-generated UI". |

---

# 10. LO QUE ESTE PLAN **NO** PROPOSE

- **No** tocar la IA global: los 5 destinos, la profundidad, el cross-highlight y el vocabulario canónico **son correctos**.
- **No** rediseñar `shared/ui.tsx` ni `patterns.tsx`: se **conectan**.
- **No** agregar preferencias de notificación, reacciones, menciones, undo, ni "mi actividad": no están en Product Truth (PDC-01…PDC-05, FDPG-02/FDPG-03 **DEFERRED** con motivo escrito).
- **No** corregir la tabla física ni el backend: 9 de 45 tablas no tienen representación en el modelo mock y es información para backend, no trabajo de frontend.
- **No** cambiar rutas: los deep links ya compartidos valen más que la pureza del mapa.
- **No** introducir librería de estado, de formularios o de validación: Stage 4 decidió correctamente no instalarlas (§14 deviations 3) y esta auditoría **no** revierte esa decisión.
- **No** "arreglar" los 390 px sin método de verificación (§3 del Runtime Evidence).

---

# 11. RIESGO ACUMULADO DEL PLAN

| Slice | Riesgo | Mitigación |
|---|---|---|
| A | MEDIO — reabrir Freeze | Fallback declarado: los gaps que no se resuelven quedan `DEFERRED` **registrados** |
| B | BAJO | Límite explícito: sólo primitives, no features |
| C | MEDIO — 26 pantallas | Por primitive, nunca pantalla por pantalla |
| D | MEDIO — `App.tsx` | Empezar por estado en URL; gating al final |
| E | **ALTO** — 11 pantallas + transversal | Dividir en E1/E2/E3; E1 primero |
| F | MEDIO — invención | Regla: cada fila cita su sección de Freeze |
| G | BAJO-MEDIO | Prohibido deconstructivismo |
| I | MEDIO — sin método 390 px | Decidir el método antes de empezar |
| J | BAJO | — |

**Orden de riesgo:** E (ALTO) es el único que puede romper algo. Empezar por B, que es el de mejor relación valor/riesgo, y reservar E para cuando A, C y H estén listos.

---

**SOURCE MODIFIED: NO.**
**Este plan no implementa, no corrige y no rediseña. Stage 5 termina acá.**
