# GEI — IA / SIMPLICITY RESEARCH V1

**Estado:** investigación y definición TARGET. NO implementación. NO refactorización. NO cambio de código.
**Autoridad:** `GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` (v1.0.1). El Freeze manda sobre este documento; si este research contradice el Freeze, el Freeze gana.
**CURRENT auditado:** `GEI_FIGMA_VS_FREEZE_AUDIT_V1.md` + `GEI_FIGMA_VS_FREEZE_MATRIX_V1.md` (38/38 rutas existen; 16 PASS, 22 PARTIAL; 6 P0, 10 P1).
**Rutas autoritativas:** 38 canonical route paths (§23 v1.0.1). Sin número mágico de workflows.
**Handoff:** este archivo es la evidencia; `GEI_FRONTEND_TARGET_BLUEPRINT_V1.md` es el TARGET ejecutable condensado.

---

# 1. Research method

## 1.1 Qué se investigó y cómo

1. Lectura completa del Freeze v1.0 (2557 líneas) + v1.0.1 (5 clarificaciones absorbidas).
2. Lectura completa de auditoría (2474 líneas), matriz (631 líneas) y plan de reconstrucción mediante agentes dedicados con verificación puntual directa; cifras y hallazgos citados con fuente y línea.
3. Inventario READ-ONLY del CURRENT (`src/`, 20 archivos): 41 entradas de router (39 patrones navegables + `/` redirect + `*` 404), 6 god files, 17 primitives, mock store con 21 personas / 4 teams / 8 eventos.
4. Web research real (octubre 2026) sobre productos actuales, documentación oficial y guías de plataforma. Cada donor usado registra producto, superficie, problema, expectativa, qué se copia, qué NO se copia y evidencia/source (§3).
5. Separación honesta: `EXTERNAL EVIDENCE` (fuente verificada) vs `KNOWN PATTERN` (patrón ampliamente aprendido, sin fuente externa consultada) vs `EXTERNAL RESEARCH PENDING` (se declara cuando aplica; en esta pasada solo §8.7).

## 1.2 Fuentes externas consultadas (evidencia real)

- F1 Apple HIG — Tab bars: `https://developer.apple.com/design/human-interface-guidelines/tab-bars` (+ WWDC22 "Explore navigation design for iOS", WWDC25 Liquid Glass tab views).
- F2 Material Design 3 — Navigation bar/rail/drawer: `https://m3.material.io/components/navigation-rail/guidelines` (+ Android Developers "Build responsive navigation", "Layouts and navigation patterns").
- F3 TeamSnap / Heja / Spond (team sports apps 2025-2026): RSVP one-tap con conteo live, nudge a no-respondidos, reminders automáticos, team messaging + announcements separados, calendar sync.
- F4 WhatsApp Communities/Eventos/Replies: `https://blog.whatsapp.com/` (Announcement Groups + subgroups, eventos con RSVP en grupos, replies agrupadas, mute/mentions).
- F5 Google Calendar recurring-event scope: `https://support.google.com/calendar/answer/37115` ("Only this event / Following events / All events").
- F6 Banking/home UX patterns (Purrweb 2025, Lazarev 2025, Customer Science 2025): dashboard = estado actual + próxima acción ("summary of state + next action" como foco), errores con recovery específico preservando input, secondary tools en profundidad.

No se usó Dribbble/behance como donor. Ningún donor se eligió por estética. Ninguna app se copia globalmente.

## 1.3 Principio de frankenstein controlado

Cada pieza del TARGET justifica PROBLEMA → PATRÓN APRENDIDO → DONOR → ADAPTACIÓN GEI. Nunca DONOR → me gusta → copiar.

---

# 2. Principles (congelados para el TARGET)

## P1 — Complejidad en el sistema, no en el usuario

Vocabulario de interfaz: Mi equipo, Partido, Entrenamiento, ¿Vas?, Convocados, Asistencia, Resultado, Mensajes, Comunicados. Prohibido exponer en UI: CompetitionEntry, EligibilityConstraint, RoleAssignment, SelectionRevision, AttendanceSheet, EventTarget, coordination_revision, command, idempotency, outbox.

## P2 — SITUACIÓN → ACCIÓN → INFORMACIÓN

Toda screen ordena: qué está pasando (contexto) → qué puedo hacer ahora (1 acción primaria) → con qué información (operacional primero, admin al final). Prohibido el orden INFORMACIÓN → INFORMACIÓN → INFORMACIÓN → BOTÓN.

## P3 — Cinco entradas, una pregunta cada una (DEFAULT KEEP, sin evidencia para cambiarlas)

- INICIO: ¿Qué tengo que saber o hacer ahora?
- CALENDARIO: ¿Qué pasa y cuándo?
- EQUIPOS: ¿Quiénes somos y qué pasa con mi equipo?
- COMUNICACIÓN: ¿Qué dijeron / con quién hablo?
- MÁS: ¿Qué necesito que no es uso diario?

## P4 — Página autoexplicativa en 5 segundos

¿Qué es esto? ¿Qué está pasando? ¿Qué puedo hacer ahora? ¿Dónde tocaría sin que me lo expliquen? Atención guiada con tamaño, peso, contraste, color, espacio, agrupación, proximidad, affordance y progressive disclosure. Sin guía visible de la guía.

## P5 — Información por niveles L0–L4

- L0 INMEDIATA: se entiende en 1–3 s (estado + próxima acción).
- L1 OPERACIONAL: lo necesario para actuar (hora, lugar, ¿Vas?, conteos).
- L2 CONTEXTO: útil, no dominante (logística, audiencia, miembros).
- L3 DETALLE: bajo demanda (historial, revisiones, correcciones).
- L4 ADMIN/RARE: escondido tras acción/contexto (IDs, reglas, audit técnico, prefs).

## P6 — Una acción primaria como máximo

Secundarias contextuales. Raras/destructivas en overflow/sheet/modal. Headers sin botonera. Rows completas tocables donde la row ES la acción. Ninguna acción obvia tras tres menús.

## P7 — Surface con intención

- ROUTE: tarea importante, profunda, shareable/deep-linkable o que necesita espacio.
- SHEET: tarea contextual corta que conserva sensación de origen.
- MODAL: confirmación o decisión acotada (incluye Impact Preview y scope de serie).
- INLINE: respuesta simple o cambio pegado al contexto visible.
- OVERFLOW: secundaria/rara/destructiva.
- Prohibido el modal como default. Prohibida la command palette como navegación primaria.

## P8 — Motion solo causal

NONE por defecto. MICRO FEEDBACK (¿Vas? guardado, conteo live), STATE TRANSITION (draft→publicado, open→closed), CONTEXT TRANSITION (sheet/modal origen-destino). Prohibidas: bounce universal, fade-up en cards, scale en botones, decoración, transiciones largas.

## P9 — Iconografía para comprender, no para decorar

Lucide actual se conserva (consistente). Icono solo si es estándar conocido, o icono+label; texto solo si es mejor; sin icono por label; sin badges masivos; sin custom icons por branding. Prioridad: COMPRENSIÓN.

## P10 — Guardian invisible como módulo

Sin módulo, sin rol, sin ruta `/guardian`. Mismo producto, destinos filtrados por uso real. `Viendo a X ▾` solo con varios menores. Configuración en Más → Mi perfil → Personas a cargo. PII mínima por delegación (v1.0.1 §6/§20).

---

# 3. Donor map

| # | Donor (fuente) | Superficie / patrón concreto | Problema que resuelve | Expectativa aprovechada | Copiamos conceptualmente | NO copiamos |
|---|---|---|---|---|---|---|
| D1 | Apple HIG tab bars [F1 EXTERNAL EVIDENCE] | Tabs ≤5, single-word labels, tabs para navegar (no acciones), no esconder/deshabilitar, sidebar en iPad | Nav impredecible, tabs-acciones, destinos escondidos | La gente ya sabe moverse por 5 tabs | 5 destinos intactos; tabs internas solo navegan; tabs siempre visibles | Estética iOS; Liquid Glass; "More" como overflow (nuestro Más es destino intencional no-diario, tensión consciente §8.6) |
| D2 | Material M3 navigation [F2 EXTERNAL EVIDENCE] | 3–5 destinos; mismos destinos adaptados bar→rail→drawer; drawer solo si muchos destinos | Duplicar navegación por tamaño; drawer injustificado | Mismo lugar en móvil y desktop | Bottom nav + sidebar con los mismos 5 destinos; sin drawer (38 routes no lo justifican) | Componentes Material; FAB; drawer |
| D3 | TeamSnap/Heja/Spond [F3 EXTERNAL EVIDENCE] | RSVP one-tap + conteo live; nudge a no-respondidos; reminders automáticos; messaging y announcements separados | Baja respuesta; conteos manuales; avisos perdidos en chat | "¿Vas?" de una app de equipo; recordatorio que llega solo | ¿Vas? Sí/Quizás/No + conteo; nudge/recordatorio; Comunicados separados de Mensajes | Pricing/planes; ads; payments; estética |
| D4 | WhatsApp Communities [F4 EXTERNAL EVIDENCE] | Announcements group + subgroups; eventos con RSVP; replies agrupadas; mute/mentions | Anuncios mezclados con cháchara; ruido; hilos ilegibles | Canal de anuncios + grupos por tema; silenciar/mencionar | Tabs Conversaciones/Comunicados; TEAM/EVENT canonical; replies al hilo; mute/mentions (gaps FDPG-02/03) | Cifrado/estados/canales; estética chat |
| D5 | Google Calendar scope dialog [F5 EXTERNAL EVIDENCE] | "Only this / Following / All events" al editar serie | Editar una ocurrencia rompe la serie o avisa mal | Preguntar alcance antes de aplicar | Scope dialog en vocabulario usuario + Impact Preview con token y reconfirmación (gap FDPG-01) | Estética Google; recurrencia RRULE expuesta |
| D6 | Banking/home patterns [F6 EXTERNAL EVIDENCE] | "Summary of state + next action" como foco; errores con recovery específico preservando input; secondary tools en profundidad | Home-dashboard confuso; formularios que borran input; settings que compiten | Estado actual + qué hacer + qué pasa si falla | Home Necesita-atención→¿Vas?; validación inline sin perder input; admin en Más con disclosure | Jerga financiera; widgets; personalización IA |
| D7 | iOS Contacts [KNOWN PATTERN] | Ficha: identidad + acción contactar primero, historial bajo demanda | Fichas administrativas densas | Abrir un contacto y llamar/escribir | PersonDetail y PersonAdminDetail por secciones con PII gated | Estética iOS |
| D8 | Apple/Google Calendar + Reminders [KNOWN PATTERN] | Mes/agenda; tareas con checkbox y estado visible; autosave silencioso | Tiempo ilegible; ediciones perdidas | Calendario mensual; tachar tarea | Calendar mes/agenda; Availability/Attendance one-tap; autosave Selection con estado visible | Sindicación de calendarios; listas de tareas como IA |
| D9 | iMessage/WhatsApp chat [KNOWN PATTERN] | Lista + input sticky; envío optimista; editar/eliminar contenido | Conversación que no fluye | Escribir abajo, leer arriba | ConversationPage: cabecera contexto + mensajes + input sticky; soft-delete propio | Burbujas/estética; doble-check como contrato |

---

# 4. Learned interaction patterns (reutilizables)

1. **Action inbox (Home):** resumen de estado + próxima acción como foco; 1–3 ítems accionables, resto subordinado. [D6]
2. **One-tap RSVP + live count (¿Vas?, Asistencia, Convocados-draft):** gesto único, conteo inmediato, stale exige reconfirmar. [D3, D8]
3. **Selective nudge (recordatorio a no-respondidos):** el sistema recuerda, no la persona por WhatsApp. [D3] (gap FDPG-02)
4. **Scope-first edit (serie/jornada):** preguntar alcance en vocabulario usuario antes de aplicar. [D5] (gap FDPG-01)
5. **Consequence preview (Impact Preview):** explicar quién se ve afectado + reconfirmar con token; nunca ejecutar a ciegas. [D5, D6]
6. **Announcements ≠ chat:** canal lectura con audiencia visible vs conversación con input; replies contenidas. [D4]
7. **Sectioned entity (ficha):** identidad + 1 acción primero; PII y admin gated y colapsados. [D7, D6]
8. **Same destinations, adapted chrome:** 5 destinos en bottom nav y sidebar; tabs internas persistentes. [D1, D2]
9. **Inline validation that preserves input:** error junto al campo, qué pasó + qué hacer, nada se borra. [D6]
10. **Explicit terminal states:** DRAFT vs PUBLICADO / ABIERTA vs CERRADA / BORRADOR vs FINAL inequívocos, sin fake success. [D6 + Freeze §24/§47]

---

# 5. IA recommendations (vinculantes para el TARGET)

1. Mantener las 5 entradas y los 5 destinos en ambas plataformas; sin drawer; sin command palette; Gestión/Informes/Auditoría viven en Más (uso no-diario).
2. Home es action inbox, no dashboard: Necesita-tu-atención → Hoy → ¿Vas? → Próximamente → Comunicaciones. Sin métricas.
3. Evento = página profunda shareable con rail de participación (¿Vas?/Convocados/Asistencia/Resultado) y mensajes del evento contenidos.
4. Roster = gramática de filas one-tap con estados en texto; publicar-con-conflicto-derivado (§14), nunca bloqueo mudo; Conflict Workspace como superficie (P1-06 confirmado).
5. Chat = expectativas WhatsApp/iMessage; TEAM/EVENT canonical visibles; mute/mentions/replies como gaps a decidir (FDPG-03).
6. Persona = ficha por secciones; DNI/birth solo ADMIN; contacto solo por necesidad operativa; Guardian sin módulo (v1.0.1).
7. Admin = formularios cortos con defaults/pickers, validación inline, confirmaciones con consecuencias; identidad Team immutable; venue rename A/B (v1.0.1).
8. Reports = lectura con filtros y defaults, sin dashboard; Audit = lista append-only con filtros.
9. Vocabulario usuario en toda la superficie; jerga interna prohibida en UI.
10. 1 acción primaria por screen; resto contextual; destructivo en overflow/modal.

---

# 6. Route-by-route analysis (38/38)

Formato por ficha: Screen · Pregunta · 5s · Primary/Secondary · L0–L4 · Modelo · Donors · Keep · Fricción · Target · Surfaces · Jerarquía · Iconos · Motion · Mobile/Desktop · Capabilities · Gap.

## R01 — /login — Acceso

**Screen:** Acceso. **Pregunta:** ¿Cómo entro a mi espacio del club? **5s:** Estoy en GEI, pongo mis datos y entro; si soy nuevo, activo mi cuenta.
**Primary:** Iniciar sesión. **Secondary:** Activar cuenta con código; recuperar acceso (overflow).
**L0:** marca + campos + botón. **L1:** error con recovery. **L2:** ayuda/demo. **L3:** detalle ayuda. **L4:** none.
**Modelo:** formulario simple con validación inline que preserva input.
**Donors:** [D6 EXTERNAL] error con recovery específico preservando input.
**Keep:** LoginPage mínima sin nav; tokens semánticos.
**Fricción:** credenciales demo visibles (harness, no producto); sin P0 auditado aquí.
**Target:** SITUACIÓN (estás en GEI) → ACCIÓN (ingresar/activar) → INFORMACIÓN (ayuda).
**Surfaces:** ROUTE sin nav; overflow para recupero; sin sheet/modal.
**Jerarquía:** título + 1 línea + formulario + acción única. **Iconos:** solo mostrar/ocultar contraseña y estado error. **Motion:** NONE.
**Mobile:** centrado, teclado adecuado, acción ancho completo, sin bottom nav. **Desktop:** tarjeta centrada, sin sidebar.
**Capabilities:** C01, C04. **Gap:** none — no inventar.

## R02 — /activate — Activar cuenta

**Screen:** Activar cuenta. **Pregunta:** ¿Cómo activo mi cuenta con el código del club? **5s:** Pongo el código que me dio el club y creo mi acceso.
**Primary:** Activar cuenta. **Secondary:** Volver a acceso; pedir ayuda (overflow).
**L0:** código + campo + acción. **L1:** código inválido + qué hacer. **L2:** quién lo entrega. **L3:** detalle. **L4:** none.
**Modelo:** ingreso de código con validación tolerante y reintento sin perder input.
**Donors:** KNOWN PATTERN (input simple con corrección).
**Keep:** flujo separado de login.
**Fricción:** código literal rígido (harness GEI-2026-4812); normalizar y explicar.
**Target:** SITUACIÓN (tenés un código) → ACCIÓN (ingresarlo) → INFORMACIÓN (dónde conseguirlo).
**Surfaces:** ROUTE; inline para error; overflow ayuda.
**Jerarquía:** título + contexto + campo prominente + acción única. **Iconos:** solo estado. **Motion:** NONE.
**Mobile:** campo grande, acción accesible, sin bottom nav. **Desktop:** tarjeta centrada.
**Capabilities:** C01, C03. **Gap:** none — no inventar.

## R03 — /no-access — Sin acceso

**Screen:** Sin acceso. **Pregunta:** ¿Por qué no puedo entrar y qué hago? **5s:** No tenés acceso y este es el único paso siguiente.
**Primary:** Contactar al club / volver (una sola según caso). **Secondary:** Cerrar sesión, reintentar (overflow).
**L0:** sin acceso + qué hacer. **L1:** motivo operativo sin jerga. **L2:** contacto. **L3–L4:** none (sin exponer C05/C06).
**Modelo:** mensaje de estado + recovery específico, sin callejón.
**Donors:** [D6 EXTERNAL] error con recovery + siguiente paso visible.
**Keep:** destino explícito con vocabulario usuario.
**Fricción:** sin hallazgo auditado; no exponer razones internas (eligibility/roles) aquí.
**Target:** SITUACIÓN (qué pasó) → ACCIÓN (qué hacer) → INFORMACIÓN (a quién acudir).
**Surfaces:** ROUTE; sin modal/sheet.
**Jerarquía:** estado + causa operativa + acción única + contacto subordinado. **Iconos:** un icono de estado. **Motion:** NONE.
**Mobile:** centrado, acción ancho completo. **Desktop:** tarjeta centrada, sin sidebar.
**Capabilities:** C01, C04. **Gap:** none — no inventar.

## R04 — /home — Inicio (LAB — deep-dive en §7.1)

**Screen:** Inicio. **Pregunta:** ¿Qué tengo que saber o hacer ahora? **5s:** Si hay algo que necesita tu atención, qué tenés hoy y qué viene.
**Primary:** Responder ¿Vas? del próximo evento pendiente (si existe). **Secondary:** Ver evento, leer comunicado, ir a Calendario/Mi equipo.
**L0:** Necesita tu atención (1–3) + Hoy. **L1:** Próximamente + Comunicaciones accionables. **L2:** hora/lugar/convocados. **L3:** EventDetail. **L4:** admin escondido.
**Modelo:** action inbox + RSVP one-tap con conteo live; nudge solo a no-respondidos.
**Donors:** [D6 EXTERNAL] summary-of-state + next action; [D3 EXTERNAL] RSVP one-tap + nudge.
**Keep:** Necesita tu atención + Hoy + Próximamente + Comunicaciones; shell 5 destinos.
**Fricción:** reloj fijo 2026-10-02 distorsiona Hoy; link /conversations/c2 hardcodeado; Notice sin type.
**Target:** SITUACIÓN (atención + hoy) → ACCIÓN (¿Vas?/leer) → INFORMACIÓN (próximamente + comunicaciones).
**Surfaces:** ROUTE resumen; SHEET detalle corto; INLINE confirmar; OVERFLOW rarezas.
**Jerarquía:** atención primero, Hoy segundo, Próximamente tercero, Comunicaciones al final; 1 primaria por bloque. **Iconos:** solo funcionales (¿Vas?, hora/lugar). **Motion:** NONE salvo cambio estado ¿Vas? (micro feedback).
**Mobile:** feed vertical, bottom nav, acción táctil grande. **Desktop:** sidebar, columna central, sin métricas.
**Capabilities:** C07, C09, C12, C16. **Gap:** FDPG-02 (nudge/reminders) — §9.

## R05 — /calendar — Calendario

**Screen:** Calendario. **Pregunta:** ¿Qué pasa y cuándo? **5s:** Tus Partidos y Entrenamientos en el tiempo y qué requiere respuesta.
**Primary:** Responder ¿Vas? desde el evento seleccionado. **Secondary:** Cambiar mes/agenda, filtrar Mi equipo, abrir evento.
**L0:** mes/agenda + pendientes ¿Vas?. **L1:** hora/lugar/equipo. **L2:** convocados/asistencia. **L3:** EventDetail. **L4:** serie/admin escondidos.
**Modelo:** mes/agenda navegable; selección inline con resumen; edición de serie con scope dialog.
**Donors:** KNOWN PATTERN (Apple/Google Calendar mes/agenda); [D5 EXTERNAL] scope Only/Following/All; [D2 EXTERNAL] mismos destinos adaptados.
**Keep:** mes/agenda; shell 5 destinos.
**Fricción:** reloj fijo congela Hoy; scope de serie sin resolver en CURRENT.
**Target:** SITUACIÓN (cuándo hay algo) → ACCIÓN (responder/abrir) → INFORMACIÓN (horario/lugar).
**Surfaces:** ROUTE; SHEET mini-detalle; MODAL solo scope de serie; INLINE ¿Vas?.
**Jerarquía:** controles tiempo arriba, grilla/lista centro, detalle subordinado. **Iconos:** funcionales con texto (Partido/Entrenamiento/pendiente). **Motion:** NONE.
**Mobile:** agenda por defecto, mes colapsable. **Desktop:** mes + panel detalle.
**Capabilities:** C07, C09, C10, C16. **Gap:** FDPG-01 (scope dialog serie, C10) — §9.

## R06 — /search — Buscar

**Screen:** Buscar. **Pregunta:** ¿Dónde está esa persona, equipo o partido? **5s:** Buscás por nombre y llegás sin aprender jerga.
**Primary:** Abrir el resultado principal. **Secondary:** Filtrar por tipo, ver recientes.
**L0:** campo + resultados. **L1:** tipo en vocabulario usuario. **L2:** contexto (equipo/fecha). **L3:** ficha destino. **L4:** none.
**Modelo:** búsqueda simple con resultados accionables; sin command palette.
**Donors:** KNOWN PATTERN (Contacts/búsqueda persona→hilo).
**Keep:** SearchPage + atajo ⌘K/Ctrl+K.
**Fricción:** sin hallazgo auditado; no exponer CompetitionEntry en resultados.
**Target:** SITUACIÓN (qué busco) → ACCIÓN (abrir) → INFORMACIÓN (contexto mínimo).
**Surfaces:** ROUTE simple; INLINE resultados; overflow filtros raros.
**Jerarquía:** campo arriba, resultados por relevancia. **Iconos:** indicador funcional de tipo con texto. **Motion:** NONE.
**Mobile:** campo fijo arriba, lista táctil. **Desktop:** columna central estrecha.
**Capabilities:** C15, C02, C03. **Gap:** none — no inventar.

## R07 — /notifications — Avisos

**Screen:** Avisos. **Pregunta:** ¿Qué cambió que me afecta? **5s:** Comunicados y cambios (hora/lugar/convocatoria) con qué hacer.
**Primary:** Abrir el aviso principal. **Secondary:** Marcar leído, ir al origen.
**L0:** qué cambió + qué hacer. **L1:** quién/equipo/cuándo. **L2:** detalle origen. **L3:** EventDetail/Comunicación. **L4:** prefs en Más.
**Modelo:** lista accionable; announcements separados de mensajes; replies al origen.
**Donors:** [D4 EXTERNAL] announcements vs subgroups + replies agrupadas; [D3 EXTERNAL] solo cambios que te afectan.
**Keep:** Comunicaciones recientes de Home como base.
**Fricción:** Notice sin type; link c2 hardcodeado si se reutiliza.
**Target:** SITUACIÓN (qué cambió) → ACCIÓN (abrir/responder) → INFORMACIÓN (origen).
**Surfaces:** ROUTE; SHEET detalle corto; INLINE marcar leído; overflow prefs.
**Jerarquía:** no leídos accionables primero; sin badges masivos. **Iconos:** solo leído/pendiente con texto. **Motion:** NONE.
**Mobile:** lista simple táctil. **Desktop:** lista + panel detalle.
**Capabilities:** C12, C10, C16. **Gap:** none — no inventar (prefs = L4 razonable, no gap).

## R08 — /more/profile — Mi perfil

**Screen:** Mi perfil (+ Personas a cargo). **Pregunta:** ¿Qué necesita el club de mí y quiénes están a mi cargo? **5s:** Quién sos, a quién ves y Personas a cargo.
**Primary:** Selector `Viendo a X` (solo si varios menores). **Secondary:** Editar datos, gestionar Personas a cargo, prefs (overflow).
**L0:** quién soy + a quién veo. **L1:** equipos y rol operativo. **L2:** contacto/asistencia. **L3:** PersonDetail. **L4:** Personas a cargo + prefs.
**Modelo:** Guardian v1.0.1 — mismo producto, switch contextual solo si aplica.
**Donors:** KNOWN PATTERN (múltiples calendarios/cuentas en una vista).
**Keep:** ficha como base; Más como contenedor no-diario.
**Fricción:** breadcrumb "Mi espacio" confuso; P0-4 fake success en cambio de contraseña (auditado en ProfilePage).
**Target:** SITUACIÓN (quién soy/veo) → ACCIÓN (cambiar vista si aplica) → INFORMACIÓN (datos + a cargo).
**Surfaces:** ROUTE; SHEET selector; MODAL solo confirmación; overflow prefs.
**Jerarquía:** identidad primero, selector solo si aplica, Personas a cargo al final. **Iconos:** avatar funcional. **Motion:** NONE.
**Mobile:** sección única, selector en sheet. **Desktop:** tarjeta + panel a cargo.
**Capabilities:** C01, C03, C04. **Gap:** none — no inventar (Guardian ya cerrado en v1.0.1).

## R09 — /teams — Equipos

**Screen:** Equipos. **Pregunta:** ¿Quiénes somos y qué pasa con mi equipo? **5s:** Encontrás Mi equipo y el resto sin jerga.
**Primary:** Abrir Mi equipo. **Secondary:** Abrir otro equipo, buscar.
**L0:** lista con Mi equipo primero. **L1:** próximo Partido/Entrenamiento por equipo. **L2:** cuerpo técnico/horario. **L3:** TeamDetail. **L4:** estructura escondida.
**Modelo:** lista navegable; tabs para navegar.
**Donors:** [D1 EXTERNAL] ≤5 tabs, tabs para navegar; [D2 EXTERNAL] mismos destinos adaptados.
**Keep:** lista Teams; shell 5 destinos.
**Fricción:** sin P0 auditado; vigilar literales de sede.
**Target:** SITUACIÓN (mis equipos) → ACCIÓN (abrir Mi equipo) → INFORMACIÓN (qué pasa).
**Surfaces:** ROUTE; inline abrir; overflow info estructural.
**Jerarquía:** Mi equipo por posición, resto alfabético con próxima cita subordinada. **Iconos:** identificador textual. **Motion:** NONE.
**Mobile:** lista vertical. **Desktop:** grilla simple, misma jerarquía.
**Capabilities:** C02, C03, C05 (oculta). **Gap:** none — no inventar.

## R10 — /teams/:teamId — Mi equipo

**Screen:** Mi equipo. **Pregunta:** ¿Quiénes somos y qué pasa con mi equipo? **5s:** Próximo Partido/Entrenamiento, Convocados/Asistencia y Resultado.
**Primary:** Responder ¿Vas? del próximo evento. **Secondary:** Ver eventos/resultados, abrir persona, contactar.
**L0:** próximo evento + ¿Vas?. **L1:** Convocados/Asistencia + Resultado reciente. **L2:** plantilla/eventos. **L3:** EventDetail/PersonDetail. **L4:** Competition/Eligibility escondidas.
**Modelo:** tabs Equipo/Eventos/Resultados que navegan; RSVP one-tap; messaging separado de announcements.
**Donors:** [D1 EXTERNAL] tabs para navegar; [D3 EXTERNAL] messaging + announcements separados.
**Keep:** tabs Equipo/Eventos/Resultados.
**Fricción:** breadcrumb "Mi espacio"; riesgo literales de sede.
**Target:** SITUACIÓN (próximo + resultado) → ACCIÓN (¿Vas?/convocados) → INFORMACIÓN (plantilla/eventos).
**Surfaces:** ROUTE; SHEET convocados cortos; INLINE ¿Vas?; overflow historial/admin.
**Jerarquía:** próximo primero, Asistencia/Resultado segundo, plantilla después. **Iconos:** estados con texto. **Motion:** NONE salvo conteo live.
**Mobile:** tabs fijas, sheet convocados. **Desktop:** tabs + panel, sin métricas.
**Capabilities:** C02, C03, C05, C06 (oculta), C09, C13. **Gap:** none — no inventar.

## R11 — /people/:personId — Ficha persona (ver lab §7.6 para admin; esta es la vista operativa)

**Screen:** Ficha persona. **Pregunta:** ¿Quién es y qué necesita de mí? **5s:** Equipo, rol operativo y cómo contactar o ver su ¿Vas?/Asistencia.
**Primary:** Contactar / ver su próximo ¿Vas?. **Secondary:** Ver equipo/eventos, historial asistencia.
**L0:** nombre + equipo + contacto. **L1:** asistencia/convocatorias. **L2:** equipo/eventos. **L3:** EventDetail/TeamDetail. **L4:** admin/auditoría escondida.
**Modelo:** ficha simple sin exponer EligibilityConstraint; contacto agrupa replies.
**Donors:** [D7 KNOWN] Contacts (ficha + acción contactar).
**Keep:** ficha PersonDetail; vocabulario usuario.
**Fricción:** breadcrumb "Mi espacio"; teléfono/email solo por necesidad operativa (§6).
**Target:** SITUACIÓN (quién es) → ACCIÓN (contactar/ver ¿Vas?) → INFORMACIÓN (equipo/asistencia).
**Surfaces:** ROUTE; SHEET si contextual; inline contacto; overflow historial/admin.
**Jerarquía:** identidad + equipo primero, acción única, asistencia después. **Iconos:** avatar + contactar. **Motion:** NONE.
**Mobile:** ficha vertical. **Desktop:** tarjeta + panel contexto.
**Capabilities:** C03, C04, C09, C14 (bajo demanda). **Gap:** none — no inventar.

## R12 — /events/new — Nuevo evento

**Screen:** Nuevo evento. **Pregunta:** ¿Cómo creo un Partido o Entrenamiento para mi equipo? **5s:** Creás Partido/Entrenamiento con cuándo/dónde/quién en un paso.
**Primary:** Crear evento. **Secondary:** Lugar/logística, convocados, cancelar (serie en overflow).
**L0:** tipo + cuándo + equipo + crear. **L1:** lugar/convocados. **L2:** logística/notas. **L3:** detalle post-creación. **L4:** serie/admin escondido.
**Modelo:** tarea profunda; formulario que preserva input; serie con alcance explícito si se habilita.
**Donors:** [D6 EXTERNAL] recovery preservando input; [D5 EXTERNAL] scope de serie en vocabulario usuario.
**Keep:** primitives + tokens; vocabulario Partido/Entrenamiento/Convocados.
**Fricción:** evitar literales (Alvear 1240) y reloj fijo como defaults.
**Target:** SITUACIÓN (qué + para quién) → ACCIÓN (crear) → INFORMACIÓN (lugar/convocados/logística).
**Surfaces:** ROUTE; inline errores; MODAL solo confirmar descarte con cambios; overflow serie.
**Jerarquía:** tipo/equipo/fecha primero, Crear único, logística subordinada. **Iconos:** solo fecha/lugar. **Motion:** NONE.
**Mobile:** paso único, acción accesible. **Desktop:** formulario centrado.
**Capabilities:** C07, C05 (oculta), C09, C11, C12. **Gap:** none — serie se resuelve en edición (FDPG-01).

## R13 — /events/:eventId — Partido / Entrenamiento (LAB — deep-dive en §7.2)

**Screen:** Partido / Entrenamiento. **Pregunta:** ¿Voy? ¿Dónde/cuándo es, quién va y qué pasó? **5s:** Si tenés que responder ¿Vas?, dónde/cuándo y Convocados/Asistencia/Resultado.
**Primary:** Responder ¿Vas? (o Ver resultado si ya pasó). **Secondary:** Convocados/asistencia, lugar, mensajes del evento, editar (overflow, con scope si serie).
**L0:** ¿Vas? pendiente + cuándo/dónde. **L1:** Convocados/Asistencia/Resultado. **L2:** logística + mensajes. **L3:** historial. **L4:** serie/admin.
**Modelo:** página profunda shareable; RSVP one-tap + conteo; cambio de serie con scope; confirmación acotada.
**Donors:** [D3 EXTERNAL] RSVP + messaging/announcements separados; [D5 EXTERNAL] scope Only/Following/All.
**Keep:** base EventDetail; mismos 5 destinos.
**Fricción:** P0-5 Alert sin gate; reloj fijo; literal Alvear 1240; Notice sin type.
**Target:** SITUACIÓN (responder / qué pasó) → ACCIÓN (¿Vas?/resultado) → INFORMACIÓN (convocados/lugar/mensajes).
**Surfaces:** ROUTE; SHEET convocados/mensajes; MODAL cambio/cancelación y scope; INLINE ¿Vas?; overflow destructivo.
**Jerarquía:** ¿Vas?/Resultado primero, cuándo/dónde segundo, Convocados después, mensajes al final. **Iconos:** funcionales con texto. **Motion:** NONE salvo conteo live.
**Mobile:** cabecera con ¿Vas?, sheet convocados. **Desktop:** detalle + panel asistencia.
**Capabilities:** C07, C08, C09, C10, C11, C12, C13, C14. **Gap:** FDPG-01 (scope serie) + FDPG-02 (nudge) — §9.

## R14 — /events/:eventId/edit — Editar Partido / Entrenamiento

**Screen:** Editar evento. **Pregunta:** ¿Qué cambio sin romper lo coordinado? **5s:** Qué partido es, fecha/lugar actuales y si hay cambios sin guardar.
**Primary:** Guardar cambios (bloqueada si versión stale hasta reconfirmar). **Secondary:** Descartar; Impact Preview; Postergar/Cancelar/Restaurar (overflow).
**L0:** nombre + fecha/lugar + estado. **L1:** secciones + dirty. **L2:** impacto + versión. **L3:** historial + revisions. **L4:** IDs/auditoría.
**Modelo:** formulario seccional con guardado explícito; cambio material → Impact Preview con token + reconfirmación.
**Donors:** [D5 EXTERNAL] explicar alcance antes de confirmar (scope dialog).
**Keep:** secciones general/fecha-lugar/logística; ImpactContent; control de versión.
**Fricción:** sin EventSeries (alcance singular); reloj fijo; falta Conflict Workspace §44/§73.
**Target:** SITUACIÓN cabecera → ACCIÓN Guardar/Descartar sticky → INFORMACIÓN secciones → MODAL impacto solo si material.
**Surfaces:** ROUTE; MODAL Impact Preview + token; overflow lifecycle; inline validación.
**Jerarquía:** cabecera fija, secciones apiladas, impacto colapsable, historial bajo demanda. **Iconos:** volver/cerrar/alerta. **Motion:** NONE salvo aparición modal.
**Mobile:** una columna, Guardar sticky, modal full-screen. **Desktop:** form + panel impacto.
**Capabilities:** C07, C10, C11, C14, C04. **Gap:** FDPG-01 (serie/scope) — §9.

## R15 — /events/:eventId/availability — ¿Vas?

**Screen:** ¿Vas? **Pregunta:** ¿Vas a este Partido / Entrenamiento? **5s:** Qué partido es, cuándo/dónde y cuál es tu respuesta.
**Primary:** Marcar VOY / QUIZÁS / NO VOY (one-tap). **Secondary:** Ver Convocados/Asistencia/Resultado; nudge a sin respuesta (coach, overflow).
**L0:** evento + fecha/lugar + mi estado. **L1:** botones + conteo + aviso stale. **L2:** lista equipo + RECONFIRM. **L3:** detalle jugador. **L4:** admin.
**Modelo:** one-tap con conteo live; stale exige reconfirmar.
**Donors:** [D3 EXTERNAL] RSVP one-tap + conteo + nudge + reminders.
**Keep:** botones YES/MAYBE/NO; aviso stale; derivados NO_RESPONSE/NEEDS_RECONFIRMATION.
**Fricción:** reloj fijo para stale; derivados sin explicación; falta Conflict Workspace para NO_LONGER_EVENT_TARGET.
**Target:** SITUACIÓN cabecera → ACCIÓN ¿Vas? sticky → INFORMACIÓN conteo/lista.
**Surfaces:** ROUTE; INLINE respuesta y conteo; overflow nudge; sheet detalle jugador.
**Jerarquía:** L0 arriba, ACCIÓN debajo, conteo L1, lista L2 en texto. **Iconos:** estados como texto. **Motion:** NONE salvo cambio estado inline.
**Mobile:** botones a pulgar, sticky, lista full-width. **Desktop:** centrado + panel equipo.
**Capabilities:** C09, C07, C12, C16, C06 (derivados). **Gap:** FDPG-02 (nudge) — §9.

## R16 — /events/:eventId/selection — Convocados (LAB — deep-dive en §7.3)

**Screen:** Convocados. **Pregunta:** ¿A quién convoco y quién tiene algún problema? **5s:** Borrador o publicado, cuántos convocados y si hay conflictos.
**Primary:** Publicar Convocados (coach; jugador solo lectura). **Secondary:** Editar draft; ver revisiones; detalle conflicto; descartar (overflow).
**L0:** evento + draft/published + conteo. **L1:** tabla + hasCurrentConflicts. **L2:** ELIGIBILITY_BLOCKED/PENDING, NO_LONGER_*. **L3:** revisions immutable. **L4:** auditoría.
**Modelo:** draft editable con autosave visible; publicar-con-conflicto-derivado con aviso (§14), nunca bloqueo mudo.
**Donors:** KNOWN PATTERN (autosave tipo Calendar/Reminders: "Borrador guardado").
**Keep:** tabla + autosave + modal publicar + revisions + conflictos derivados.
**Fricción:** publish bloquea por BLOCKED/PENDING (contradice §14); P0-5 expone eligibility a PLAYER; falta Conflict Workspace; targets singular; SUBCOMMITTEE sin superficie.
**Target:** SITUACIÓN cabecera → ACCIÓN Publicar sticky → INFORMACIÓN tabla + conflictos por rol + revisiones bajo demanda.
**Surfaces:** ROUTE; MODAL publicar con consecuencias; SHEET detalle conflicto; overflow historial; inline validación fila.
**Jerarquía:** estado arriba, acción sticky, tabla, conflictos inline bajo fila, revisiones colapsadas. **Iconos:** texto + una alerta funcional. **Motion:** NONE salvo modal publicar.
**Mobile:** tabla→lista de filas, Publicar sticky, conflictos expandibles. **Desktop:** tabla + panel conflictos/revisiones.
**Capabilities:** C03, C06, C07, C10, C14, C04. **Gap:** confirmado P1-06 (Conflict Workspace) + P1-02 (SUBCOMMITTEE); sin gap nuevo.

## R17 — /events/:eventId/attendance — Asistencia (LAB — deep-dive en §7.4)

**Screen:** Asistencia. **Pregunta:** ¿Quién vino realmente? **5s:** Planilla ABIERTA/CERRADA y conteo presentes/ausentes/sin registrar.
**Primary:** Cerrar Asistencia si OPEN (si CLOSED: Abrir para corregir con motivo). **Secondary:** Marcar PRESENTE/AUSENTE/JUSTIFICADO; corregir con motivo; ver Convocados.
**L0:** evento + OPEN/CLOSED + conteo. **L1:** lista marcaje + UNRECORDED. **L2:** motivos. **L3:** correcciones/historial. **L4:** admin.
**Modelo:** abrir → marcaje one-tap con guardado inmediato → cerrar explícito; corregir exige motivo.
**Donors:** [D3 EXTERNAL] one-tap + conteo live.
**Keep:** abrir/marcar/cerrar/corregir con motivo; OPEN/CLOSED + UNRECORDED ("Sin registrar nunca = ausente").
**Fricción:** reloj fijo vs apertura real; P0-2 sobrescribe mapa (destruye historia — fix Stage 4, no TARGET).
**Target:** SITUACIÓN cabecera → ACCIÓN Cerrar/Abrir sticky → INFORMACIÓN lista y motivos.
**Surfaces:** ROUTE; INLINE marcaje; MODAL Cerrar/Corregir con motivo; overflow historial.
**Jerarquía:** conteo arriba, lista con estados en texto, motivos bajo demanda. **Iconos:** texto Presente/Ausente/Justificado. **Motion:** NONE.
**Mobile:** lista full-width, toque grande, acción sticky. **Desktop:** lista + panel resumen/historial.
**Capabilities:** C09, C07, C10, C14, C04. **Gap:** none — no inventar.

## R18 — /events/:eventId/match-record — Resultado

**Screen:** Resultado. **Pregunta:** ¿Cómo salió el Partido? **5s:** Marcador, BORRADOR/FINAL y jugado/ausencia/suspendido.
**Primary:** Finalizar Resultado DRAFT→FINAL (con confirmación). **Secondary:** Editar goles; PLAYED/FORFEIT/ABANDONED; corrección explícita post-FINAL (overflow).
**L0:** equipos + marcador + estado. **L1:** goles + validación. **L2:** tipo cierre. **L3:** correcciones. **L4:** auditoría.
**Modelo:** DRAFT libre con validación inline → Finalizar con modal; post-FINAL solo corrección explícita con motivo.
**Donors:** none — formulario específico, no rellenar.
**Keep:** goles + PLAYED/FORFEIT/ABANDONED + validación; DRAFT→FINAL + correcciones.
**Fricción:** gate por rol poco explícito; reloj fijo; P0-3 sobrescribe record (fix Stage 4).
**Target:** SITUACIÓN marcador → ACCIÓN Finalizar sticky → INFORMACIÓN goles y cierre.
**Surfaces:** ROUTE; MODAL Finalizar; INLINE validación; overflow correcciones.
**Jerarquía:** marcador grande, formulario, cierre, correcciones colapsadas. **Iconos:** texto jugado/ausencia/suspendido. **Motion:** NONE.
**Mobile:** marcador arriba, numéricos grandes, Finalizar sticky. **Desktop:** centrado + panel historial.
**Capabilities:** C13, C07, C08, C14, C04. **Gap:** none — no inventar.

## R19 — /jornadas/new — Nueva Jornada

**Screen:** Nueva Jornada. **Pregunta:** ¿Cómo creo una Jornada con varios Partidos de una vez? **5s:** Nombre/fecha/sede conjunta y cuántos Partidos incluye.
**Primary:** Crear Jornada. **Secondary:** Añadir/quitar Partidos; sede conjunta; descartar (overflow).
**L0:** nombre/fecha/sede. **L1:** Partidos hijos. **L2:** logística conjunta. **L3:** detalle por partido. **L4:** admin.
**Modelo:** creación agrupada con valores heredados + resumen antes de crear.
**Donors:** KNOWN PATTERN (creación con repetición tipo Calendar).
**Keep:** crear/detalle + sede conjunta como valor inicial.
**Fricción:** Jornada como pseudo-serie sin semántica Freeze (falta EventSeries P1-04); team singular limita multi-equipo; reloj fijo.
**Target:** SITUACIÓN cabecera → ACCIÓN Crear sticky → INFORMACIÓN hijos + logística colapsable.
**Surfaces:** ROUTE; inline validación; overflow descartar; sin modal previo.
**Jerarquía:** L0 arriba, hijos L1, logística colapsable. **Iconos:** añadir/quitar/volver. **Motion:** NONE.
**Mobile:** una columna, Crear sticky. **Desktop:** form + resumen hijos.
**Capabilities:** C08, C05, C07, C11, C04. **Gap:** confirmado P1-04 (EventSeries); sin gap nuevo.

## R20 — /jornadas/:jornadaId — Detalle Jornada

**Screen:** Detalle Jornada. **Pregunta:** ¿Cómo está la Jornada y qué pasa si cambio sede o fechas? **5s:** Estado, sede, Partidos y cambios pendientes.
**Primary:** Guardar cambios (con Impact Preview si material). **Secondary:** Ver hijos; sede conjunta; Postergar/Cancelar (overflow).
**L0:** nombre/fecha/sede/estado. **L1:** hijos + conteos. **L2:** impacto conjunto. **L3:** historial. **L4:** admin.
**Modelo:** edición con Impact Preview + token + reconfirmación; sede conjunta explica N afectados antes de ejecutar.
**Donors:** [D5 EXTERNAL] scope explícito → preview "sede nueva + N Partidos afectados" + confirmar.
**Keep:** detalle + cambio sede conjunto.
**Fricción:** impacto a hijos sin token completo; reloj fijo; team singular.
**Target:** SITUACIÓN cabecera → ACCIÓN Guardar sticky → INFORMACIÓN hijos + impacto.
**Surfaces:** ROUTE; MODAL Impact Preview + token; overflow lifecycle; inline estado.
**Jerarquía:** cabecera fija, hijos L1, impacto destacado pre-confirmación. **Iconos:** alerta funcional solo en impacto. **Motion:** NONE salvo modal.
**Mobile:** una columna, modal full-screen. **Desktop:** detalle + hijos/impacto.
**Capabilities:** C08, C07, C10, C11, C14, C04. **Gap:** confirmado P1-04 (serie); sin gap nuevo.

## R21 — /communication — Comunicación (LAB — deep-dive en §7.5)

**Screen:** Comunicación. **Pregunta:** ¿Qué dijeron y con quién estoy hablando? **5s:** Conversaciones pendientes y Comunicados nuevos/no leídos.
**Primary:** Nuevo mensaje / Nuevo comunicado (una CTA por tab). **Secondary:** Filtrar; marcar leídas; abrir detalle; archivar (overflow).
**L0:** pendientes/no leídos por tab. **L1:** listas. **L2:** preview + audiencia. **L3:** detalle. **L4:** admin.
**Modelo:** tabs que preservan estado; lectura como navegación; creación por tab.
**Donors:** [D4 EXTERNAL] announcements + subgroups separados; [D1/D2 EXTERNAL] tabs persistentes.
**Keep:** tabs Conversaciones/Comunicados; preview en listas.
**Fricción:** audiencia team singular; sin mute/mentions/replies agrupadas; filtros de Notifications separados.
**Target:** SITUACIÓN tabs → ACCIÓN CTA por tab → INFORMACIÓN listas con no-leídos primero.
**Surfaces:** ROUTE contenedora; ROUTE hija detalle; INLINE marcar leída; overflow archivar/silenciar; sheet filtros.
**Jerarquía:** tabs L0, pendientes por recencia/mención, resto L2, no-leído esencial. **Iconos:** texto tabs + punto no-leído mínimo. **Motion:** NONE.
**Mobile:** tabs + listas full-width, Nuevo por tab. **Desktop:** lista + preview.
**Capabilities:** C12, C15, C01, C04, C16. **Gap:** FDPG-03 (mute/mentions/replies) — §9.

## R22 — /communication/conversations/new — Nuevo Mensaje

**Screen:** Nuevo Mensaje. **Pregunta:** ¿A quién quiero escribir? **5s:** Si es DIRECTO/GRUPO y a quién incluye antes de crear.
**Primary:** Crear conversación. **Secondary:** Elegir DIRECT/GROUP/TEAM/EVENT; buscar en equipo; descartar (overflow).
**L0:** tipo + destinatarios. **L1:** búsqueda. **L2:** contexto canonical. **L3:** miembros. **L4:** admin.
**Modelo:** tipo → buscar → resumen → Crear; DIRECT valida 2 personas y duplicado por pair.
**Donors:** [D4 EXTERNAL] TEAM/EVENT canonical + GROUP explícito.
**Keep:** DIRECT vs GROUP; canonical TEAM/EVENT.
**Fricción:** DIRECT duplicado no prevenido en UI; team singular; contexto EVENT poco visible.
**Target:** SITUACIÓN tipo → ACCIÓN Crear sticky → INFORMACIÓN búsqueda + resumen.
**Surfaces:** ROUTE corta; inline validación/búsqueda; overflow descartar.
**Jerarquía:** tipo arriba, búsqueda, resumen sticky. **Iconos:** texto Directo/Grupo/Equipo/Partido. **Motion:** NONE.
**Mobile:** búsqueda sticky, Crear sticky. **Desktop:** búsqueda + resumen.
**Capabilities:** C12, C01, C02, C03, C04. **Gap:** FDPG-04 (prevención DIRECT duplicado) — §9.

## R23 — /communication/announcements/new — Nuevo Comunicado

**Screen:** Nuevo Comunicado. **Pregunta:** ¿Qué necesita saber el club? **5s:** Título, audiencia y si queda borrador o publicado.
**Primary:** Publicar Comunicado (Guardar borrador secundaria). **Secondary:** Audiencia; descartar (overflow).
**L0:** título + audiencia. **L1:** cuerpo. **L2:** alcance/impacto. **L3:** previsualización. **L4:** admin.
**Modelo:** redactar → audiencia → previsualizar alcance → Publicar con consecuencias; borrador no notifica.
**Donors:** [D4 EXTERNAL] canal solo-anuncios + audiencia explícita pre-publicar.
**Keep:** AnnouncementForm; DRAFT→PUBLISHED→ARCHIVED; audiencia central.
**Fricción:** audiencia inmutable si PUBLISHED debe advertirse antes; team singular; reloj fijo.
**Target:** SITUACIÓN audiencia → ACCIÓN Publicar sticky → INFORMACIÓN cuerpo + alcance.
**Surfaces:** ROUTE; MODAL publicar con consecuencias; inline borrador; overflow descartar.
**Jerarquía:** título/audiencia arriba, cuerpo, alcance con aviso inmutabilidad. **Iconos:** volver/publicar. **Motion:** NONE salvo modal.
**Mobile:** selector nativo, Publicar sticky. **Desktop:** redacción + panel audiencia.
**Capabilities:** C12, C04, C10, C14, C01. **Gap:** audiencia multi-equipo limitada (heredado team singular; no gap nuevo).

## R24 — /announcements/:id — Detalle Comunicado

**Screen:** Detalle Comunicado. **Pregunta:** ¿Qué comunicó el club y me alcanza? **5s:** Título, quién/cuándo, a quién alcanza y si lo leí.
**Primary:** Marcar leído / Entendido (inline). **Secondary:** Ver audiencia; compartir; Archivar/Corregir autorizado (overflow).
**L0:** título + fecha + audiencia. **L1:** cuerpo. **L2:** acuse/lecturas. **L3:** correcciones. **L4:** admin.
**Modelo:** lectura shareable; acuse inline; corrección/archivo solo autorizados.
**Donors:** [D4 EXTERNAL] lectura + respuestas contenidas, audiencia visible.
**Keep:** AnnouncementDetail con audiencia y estados.
**Fricción:** coordination_revision++ sin superficie clara; team singular; reloj fijo.
**Target:** SITUACIÓN cabecera → INFORMACIÓN cuerpo + audiencia → ACCIÓN Entendido mínima.
**Surfaces:** ROUTE; inline acuse; sheet audiencia; overflow Archivar/Corregir.
**Jerarquía:** título/meta, cuerpo legible, audiencia/acuse, historial colapsado. **Iconos:** texto audiencia. **Motion:** NONE.
**Mobile:** una columna, Entendido sticky. **Desktop:** centrado + panel audiencia.
**Capabilities:** C12, C14, C04, C01. **Gap:** none — no inventar.

## R25 — /announcements/:id/edit — Corregir Comunicado

**Screen:** Corregir Comunicado. **Pregunta:** ¿Qué corrijo sin confundir a quienes ya lo leyeron? **5s:** Qué cambia, a quién alcanzó y audiencia bloqueada si publicado.
**Primary:** Guardar corrección (con revision++ y notificaciones). **Secondary:** Descartar; Archivar; historial (overflow).
**L0:** título + audiencia bloqueada. **L1:** diff. **L2:** impacto + notificaciones. **L3:** historial. **L4:** admin.
**Modelo:** audiencia deshabilitada con explicación si PUBLISHED + preview consecuencias + reconfirmación.
**Donors:** [D5 EXTERNAL] Impact Preview "quién ya leyó + se notificará" + confirmar.
**Keep:** audiencia immutable si PUBLISHED; ciclo DRAFT→PUBLISHED→ARCHIVED.
**Fricción:** revision++/notificación poco visible; team singular; reloj fijo.
**Target:** SITUACIÓN aviso bloqueo → ACCIÓN Guardar sticky → INFORMACIÓN diff + impacto.
**Surfaces:** ROUTE; MODAL impacto + token; overflow archivar/descartar; inline validación.
**Jerarquía:** bloqueo L0, diff L1, impacto destacado, historial colapsado. **Iconos:** alerta funcional. **Motion:** NONE salvo modal.
**Mobile:** Guardar sticky, impacto full-screen. **Desktop:** edición + impacto/historial.
**Capabilities:** C12, C10, C14, C04. **Gap:** none — no inventar.

## R26 — /conversations/:id — Conversación

**Screen:** Conversación. **Pregunta:** ¿Qué hablamos y qué sigue? **5s:** Con quién hablo, contexto Equipo/Partido y últimos mensajes.
**Primary:** Enviar mensaje. **Secondary:** Editar/eliminar propio (soft-delete); miembros; silenciar/archivar (overflow).
**L0:** interlocutores + contexto. **L1:** mensajes. **L2:** miembros/detalle. **L3:** ediciones. **L4:** admin.
**Modelo:** chat con envío inline; soft-delete propio con confirmación; canonical visible.
**Donors:** [D9 KNOWN] lista + input sticky + soft-delete; [D4 EXTERNAL] silenciar/mención si existe.
**Keep:** editar/eliminar soft-delete; canonical TEAM/EVENT; DIRECT/GROUP.
**Fricción:** sin replies agrupadas/mute/mentions; contexto EVENT poco visible; `h-[calc(100dvh-280px)]` entierra composer en mobile (P2-23); reloj fijo en orden.
**Target:** SITUACIÓN cabecera contexto → INFORMACIÓN mensajes → ACCIÓN input Enviar sticky.
**Surfaces:** ROUTE; INLINE enviar/editar; SHEET miembros/contexto; overflow eliminar/silenciar; MODAL solo confirmar eliminar.
**Jerarquía:** cabecera fija, mensajes cronológicos, contexto bajo demanda. **Iconos:** enviar/volver/info. **Motion:** NONE; scroll al último sin distraer.
**Mobile:** full-height, input sticky con teclado (composer siempre visible — fix P2-23). **Desktop:** chat + lateral miembros.
**Capabilities:** C12, C01, C04, C14, C16. **Gap:** FDPG-03 (mute/mentions/replies) — §9.

## R27 — /management — Gestión

**Screen:** Gestión (hub en Más). **Pregunta:** ¿Qué trámite admin puntual necesito y dónde está? **5s:** Zona no-diaria con 3 caminos: Organización, Competencia, Integridad.
**Primary:** Ninguna (hub navegacional; 0). **Secondary:** Ir a Estructura/Equipos/Personas; Competencias; Informes/Auditoría.
**L0:** título + contexto club. **L1:** 3 hubs con qué resuelven. **L2:** conteo operativo simple. **L3:** hija al navegar. **L4:** IDs escondidos.
**Modelo:** solo navegación; sin formularios ni mutaciones aquí.
**Donors:** [D2 EXTERNAL] mismos destinos adaptados; [D1 EXTERNAL] Gestión no es tab, vive en Más.
**Keep:** hubs Organización / Competencia e integridad.
**Fricción:** riesgo de convertirlo en dashboard de métricas (prohibido) o sacarlo a tabs diarios.
**Target:** 3 secciones: Organización (Estructura, Equipos, Personas), Competencia, Integridad (Informes, Auditoría); disclosure agresivo.
**Surfaces:** ROUTE hub; inline descripciones; overflow admin raro.
**Jerarquía:** título + 3 bloques, una jerarquía tipográfica, sin KPIs. **Iconos:** 3 funcionales. **Motion:** NONE.
**Mobile:** lista vertical desde Más. **Desktop:** columna estrecha centrada.
**Capabilities:** C02, C05, C14, C15 (navegación; sin C10/C06 aquí). **Gap:** none — no inventar.

## R28 — /management/structure — Estructura del club

**Screen:** Estructura. **Pregunta:** ¿Cómo está organizado el club y qué corrección toca? **5s:** 4 tabs estables con conteo; identidad Team no se renombra a la ligera.
**Primary:** Crear [elemento del tab] (contextual, defaults + pickers). **Secondary:** Editar metadata; Archivar/Activar con confirm; abrir TeamAdmin.
**L0:** tabs + conteo. **L1:** filas nombre + estado. **L2:** vigencia, uso en Eventos. **L3:** historial vía Auditoría. **L4:** IDs y reglas §11 escondidos.
**Modelo:** tab según qué corrijo → crear/editar/archivar con confirm → lista + rastro; validación inline.
**Donors:** [D6 EXTERNAL] recovery preservando input; KNOWN PATTERN (Settings admin con disclosure).
**Keep:** tabs Temporada/División/Línea/Sede + crear/editar/archivar.
**Fricción:** P0-1 rename muta identidad Team; P0-6 rename sede sin efectos §11; Venue sin address/field_label.
**Target:** Team con pickers, rename bloqueado salvo errata, nueva identidad = nuevo Team; Venue rename A/B v1.0.1; Division/Line con confirm; vive en Más.
**Surfaces:** ROUTE lista por tab; SHEET crear/editar; MODAL archivar; inline errores; overflow archivar/activar.
**Jerarquía:** tabs arriba, lista densa, estado como texto. **Iconos:** añadir/editar/archivar estándar. **Motion:** solo colapso tab si aporta.
**Mobile:** tabs scroll horizontal, sheet full-screen. **Desktop:** columna central, sheet lateral.
**Capabilities:** C02, C04, C10, C11, C14. **Gap:** confirmado M-13 (Venue address/field_label); sin gap nuevo.

## R29 — /management/teams/:id — Administración de equipo

**Screen:** Administración de equipo. **Pregunta:** ¿Está bien definido y debe estar activo o archivado? **5s:** Identidad inmutable + estado + qué implica archivar.
**Primary:** Archivar / Activar (contextual, con confirm). **Secondary:** Corregir metadata no-identitaria; ver asociados; Auditoría.
**L0:** nombre + estado. **L1:** identidad unique(season,division,line) + sede. **L2:** conteo operativo. **L3:** Asistencia/Resultado. **L4:** IDs y ciclo escondidos.
**Modelo:** reviso caso puntual → ajuste mínimo con confirm que explica efectos → estado + rastro. ADMIN ≠ superusuario deportivo.
**Donors:** KNOWN PATTERN (Settings: destructivo al final); [D6 EXTERNAL] confirm con recovery.
**Keep:** activar/archivar.
**Fricción:** P0-1 — si nombre editable como metadata se rompe trazabilidad.
**Target:** identidad bloqueada + estado con Archivar/Activar; archivado con MODAL y rastro; desde Más, no tab diario.
**Surfaces:** ROUTE; MODAL confirm; inline validación; overflow auditoría/personas.
**Jerarquía:** identidad, estado, secundarios colapsados. **Iconos:** archivo/activar + candado identidad. **Motion:** solo modal.
**Mobile:** columna única, primaria fija abajo. **Desktop:** columna estrecha.
**Capabilities:** C02, C03, C04, C10, C14. **Gap:** none — no inventar.

## R30 — /management/people — Personas

**Screen:** Personas. **Pregunta:** ¿Encuentro a la persona correcta y con qué rol/alcance actúa? **5s:** Busco/filtro por rol; cada fila muestra alcance sin PII en lista.
**Primary:** Crear persona (→ /new). **Secondary:** Buscar; filtrar rol/estado; abrir detalle.
**L0:** buscador + filtros. **L1:** filas nombre + rol + alcance. **L2:** pertenencia resumida. **L3:** DNI/birth y contacto en detalle. **L4:** IDs/cuenta/audit escondidos.
**Modelo:** admin puntual → buscar/filtrar → abrir; PII fuera de lista.
**Donors:** [D7 KNOWN] Contacts (lista + filtros + detalle); [D2 EXTERNAL] destinos adaptados.
**Keep:** filtros + filas.
**Fricción:** P1-05 Membership ausente (filas sin pertenencia confunden alcance); P1-01 Guardian invisible; riesgo PII en lista.
**Target:** buscador + filtros rol/estado; filas mínimas; DNI/birth solo ADMIN en detalle; sin command palette.
**Surfaces:** ROUTE lista; inline filtros; overflow raras.
**Jerarquía:** buscador, chips filtro, lista densa. **Iconos:** buscar/filtrar/añadir; rol por texto. **Motion:** NONE.
**Mobile:** buscador fijo, filtros scroll horizontal. **Desktop:** filtros colapsables + lista central.
**Capabilities:** C01, C03, C04, C15. **Gap:** confirmados P1-05/P1-01; sin gap nuevo.

## R31 — /management/people/new — Crear persona

**Screen:** Crear persona. **Pregunta:** ¿Doy de alta a alguien con datos mínimos y rol correcto? **5s:** Formulario corto con defaults, pickers y obligatorios claros.
**Primary:** Crear persona (validación + preserva input). **Secondary:** Elegir rol/alcance; cancelar.
**L0:** formulario + CTA. **L1:** campos operativos con pickers/defaults. **L2:** contacto solo si necesidad operativa. **L3:** DNI/birth solo ADMIN. **L4:** cuenta/Last Admin hasta error.
**Modelo:** alta puntual → pickers → detalle persistido + Audit; errores con recovery, sin fake success (P0-4).
**Donors:** [D6 EXTERNAL] recovery preservando input, settings profundos.
**Keep:** ROUTE separada con defaults y pickers.
**Fricción:** P1-01 sin captura de vínculo (→ Personas a cargo en perfil); P1-05 alta sin pertenencia; riesgo repetir P0-4.
**Target:** 1 columna, pickers rol/división/línea, DNI/birth solo ADMIN, éxito = ir a detalle + Audit; en Más.
**Surfaces:** ROUTE; inline validación; MODAL solo descartar con cambios.
**Jerarquía:** vertical, labels persistentes, errores junto a campo. **Iconos:** sistema. **Motion:** solo foco a primer error.
**Mobile:** ancho completo, CTA fija, pickers nativos. **Desktop:** form estrecho.
**Capabilities:** C01, C03, C04, C10. **Gap:** confirmados P1-01/P1-05 heredados; sin gap nuevo.

## R32 — /management/people/:id — Detalle administración persona (LAB — deep-dive en §7.6)

**Screen:** Detalle administración persona. **Pregunta:** ¿Quién es, qué puede hacer y puede seguir actuando? **5s:** Identidad, pertenencia, roles/alcance y elegibilidad/cuenta sin PII de más.
**Primary:** Guardar cambios de rol/estado (contextual; resto lectura). **Secondary:** Editar identidad/pertenencia; cuenta con Last Admin; Auditoría.
**L0:** nombre + rol/alcance + estado. **L1:** identidad, pertenencia, roles, elegibilidad manual, cuenta. **L2:** contacto + historial. **L3:** DNI/birth solo ADMIN. **L4:** IDs, scope, Last Admin.
**Modelo:** reviso caso → ajuste mínimo con confirm → detalle + Audit append-only. SUBCOMMITTEE muta Eligibility con traza.
**Donors:** [D7 KNOWN] Contacts por secciones; [D6 EXTERNAL] recovery preservando input.
**Keep:** secciones identidad/pertenencia/roles/elegibilidad/cuenta.
**Fricción:** P1-02 SUBCOMMITTEE sin superficie; P1-05 Membership; P1-01 Guardian; riesgo P0-4.
**Target:** secciones colapsables, PII gated, elegibilidad versionada, Last Admin; todo cambio → Audit; en Más.
**Surfaces:** ROUTE; SHEET editar sección; MODAL sensibles; inline validación; overflow auditoría.
**Jerarquía:** cabecera, secciones apiladas, elegibilidad explícita. **Iconos:** sección + candado PII/cuenta. **Motion:** solo acordeón.
**Mobile:** acordeones full-width, sheet full-screen. **Desktop:** dos columnas.
**Capabilities:** C01, C03, C04, C06, C10, C14. **Gap:** confirmados P1-02/P1-05/P1-01; sin gap nuevo.

## R33 — /management/competitions — Competencias

**Screen:** Competencias. **Pregunta:** ¿Qué competencias hay, en qué estado están y qué inscripciones tocan? **5s:** Lista por estado y scope TEAM/LINE sin métricas.
**Primary:** Crear competencia (defaults + pickers). **Secondary:** Filtrar por estado; abrir detalle.
**L0:** lista + estado + scope. **L1:** vigencia e inscripciones. **L2:** reglas scope. **L3:** Entry bajo demanda. **L4:** IDs y mismatch escondidos.
**Modelo:** admin puntual → crear/filtrar → abrir; errores inline con recovery.
**Donors:** [D6 EXTERNAL] secondary tools profundos + recovery.
**Keep:** lista/crear/inscripciones TEAM/LINE.
**Fricción:** CompetitionEntry fusionado confunde scopes y oculta COMPETITION_SCOPE_MISMATCH; estados sin guía.
**Target:** filtros estado/scope; crear con SHEET (nombre, scope, vigencia); inscripciones en detalle; en Más.
**Surfaces:** ROUTE; SHEET crear; inline filtros; overflow raras; MODAL cerrar/activar en detalle.
**Jerarquía:** lista densa con estado textual. **Iconos:** crear/filtrar; scope por texto. **Motion:** NONE.
**Mobile:** 1 columna, filtros scroll horizontal, sheet full-screen. **Desktop:** lista central, filtros colapsables.
**Capabilities:** C02, C05, C10, C15. **Gap:** confirmado M-12 (Entry fusionado); sin gap nuevo.

## R34 — /management/competitions/:id — Detalle competencia

**Screen:** Detalle competencia. **Pregunta:** ¿En qué estado está y quién participa con qué alcance? **5s:** Estado, scope e inscripciones con su estado.
**Primary:** Añadir inscripción TEAM/LINE (con validación scope). **Secondary:** Activar/Cerrar con confirm; terminar inscripción; Auditoría.
**L0:** nombre + estado + scope. **L1:** inscripciones. **L2:** vigencia y elegibilidad. **L3:** historial. **L4:** IDs y traza.
**Modelo:** reviso → inscribir/avanzar con confirm → lista + Audit; mismatch bloquea con recovery explícito.
**Donors:** [D6 EXTERNAL] recovery específico preservando input.
**Keep:** detalle con inscripciones y ciclo Competition/Entry.
**Fricción:** Entry fusionado facilita mismatch LINE-en-TEAM y confunde ciclos Entry vs Competition.
**Target:** cabecera estado/scope + inscripciones con pickers validados; cambio estado con MODAL de efectos; en Más.
**Surfaces:** ROUTE; SHEET inscribir; MODAL cambio estado/baja; inline errores scope; overflow auditoría.
**Jerarquía:** cabecera, lista, secundarios colapsados. **Iconos:** estándar; estado por texto. **Motion:** solo foco a error scope.
**Mobile:** columna única, sheet completa. **Desktop:** cabecera + tabla central.
**Capabilities:** C05, C06, C10, C14. **Gap:** confirmado M-12; sin gap nuevo.

## R35 — /reports — Informes

**Screen:** Informes. **Pregunta:** ¿Qué informe operativo necesito sin perderme en cifras? **5s:** 2 informes puntuales, qué responde cada uno, no un dashboard.
**Primary:** Ninguna (hub; 0). **Secondary:** Ir a Asistencia; ir a Rendimiento.
**L0:** título + 2 caminos. **L1:** qué responde cada uno. **L2:** alcance. **L3:** tablas en hija. **L4:** p95 y parámetros escondidos.
**Modelo:** duda puntual → elegir → hija con filtros; cada cifra lleva a acción/información.
**Donors:** [D2 EXTERNAL] destinos adaptados; [D6 EXTERNAL] secondary tools profundos.
**Keep:** hubs hacia asistencia/rendimiento.
**Fricción:** riesgo hub-dashboard con KPIs sin SITUACIÓN→ACCIÓN.
**Target:** 2 tarjetas (Asistencia, Rendimiento) con filtros por defecto; en Más.
**Surfaces:** ROUTE hub; inline descripciones.
**Jerarquía:** título + 2 bloques, sin gráficos. **Iconos:** 2 funcionales. **Motion:** NONE.
**Mobile:** lista vertical. **Desktop:** lista centrada estrecha.
**Capabilities:** C09, C13, C15, C16. **Gap:** none — no inventar.

## R36 — /reports/attendance — Informe asistencia

**Screen:** Informe asistencia. **Pregunta:** ¿Quién vino a Entrenamiento y Partido de Mi equipo? **5s:** Asistencia por evento con filtros claros, solo lectura.
**Primary:** Ninguna (lectura). **Secondary:** Filtrar equipo/período; abrir origen; contactar si hace falta.
**L0:** filtros + tabla. **L1:** desglose Convocados/¿Vas?. **L2:** contexto Evento. **L3:** jugador bajo demanda. **L4:** IDs y p95 escondidos.
**Modelo:** reviso puntual → filtrar con defaults → tabla; sin editar aquí.
**Donors:** [D6 EXTERNAL] filtros profundos con recovery.
**Keep:** tablas solo lectura.
**Fricción:** riesgo tabla sin filtros útiles o dashboard sin vínculo a evento/comunicación.
**Target:** defaults (Mi equipo + últimas jornadas) + pickers, tabla densa, links a Calendario/Equipos; en Más.
**Surfaces:** ROUTE; inline filtros; overflow raras.
**Jerarquía:** filtros arriba, tabla protagonista. **Iconos:** filtrar/ordenar; asistencia por texto. **Motion:** NONE.
**Mobile:** filtros colapsables, scroll horizontal controlado. **Desktop:** barra filtros + tabla ordenable.
**Capabilities:** C09, C15, C16 (lectura). **Gap:** none — no inventar.

## R37 — /reports/performance — Informe rendimiento

**Screen:** Informe rendimiento. **Pregunta:** ¿Cómo resultó Mi equipo en Partidos? **5s:** Resultado por Partido con alcance claro, lectura para decidir.
**Primary:** Ninguna (lectura). **Secondary:** Filtrar equipo/competencia/período; abrir Jornada origen.
**L0:** filtros + tabla Resultado. **L1:** desglose Partido/Convocados. **L2:** Competencia y Jornada. **L3:** acta bajo demanda. **L4:** IDs y p95 escondidos.
**Modelo:** balance puntual → filtrar → tabla; actas se mutan en Match Record, aquí se leen.
**Donors:** [D6 EXTERNAL] secondary tools profundos.
**Keep:** tablas solo lectura.
**Fricción:** riesgo dashboard sin SITUACIÓN→ACCIÓN; P0-1 rompería serie histórica de Resultado.
**Target:** defaults (Mi equipo, competencia activa) + pickers, tabla con link a Jornada; en Más.
**Surfaces:** ROUTE; inline filtros; overflow detalle.
**Jerarquía:** filtros arriba, tabla plana. **Iconos:** filtrar/ordenar; resultado explícito. **Motion:** NONE.
**Mobile:** filtros colapsables, esenciales primero. **Desktop:** filtros + tabla ordenable.
**Capabilities:** C13, C15, C16 (lectura). **Gap:** none — no inventar.

## R38 — /audit — Auditoría

**Screen:** Auditoría. **Pregunta:** ¿Qué cambió, quién lo hizo y cuándo? **5s:** Lista append-only actor/recurso/acción/fecha, no editable.
**Primary:** Ninguna (lectura de integridad). **Secondary:** Filtrar actor/recurso/acción/fecha; abrir origen.
**L0:** filtros + lista cronológica. **L1:** actor + acción + recurso + fecha. **L2:** antes/después resumido. **L3:** scope bajo demanda. **L4:** hashes/IDs escondidos.
**Modelo:** verifico cambio → filtrar → evidencia append-only. Audit es la verdad; sin historial inventado.
**Donors:** [D6 EXTERNAL] filtros con recovery; KNOWN PATTERN (log admin solo lectura).
**Keep:** filtros actor/recurso/acción/fecha.
**Fricción:** si renames (P0-1/P0-6) o Eligibility (P1-02) no dejan rastro se pierde confianza; P0-4 recuerda no fingir éxito.
**Target:** en Más→Gestión→Integridad, defaults últimos 30 días, cada mutación C10/C06/C02/C05 enlaza aquí.
**Surfaces:** ROUTE; inline filtros; overflow detalle cambio.
**Jerarquía:** filtros arriba, lista densa cronológica. **Iconos:** filtrar/buscar; acción por texto. **Motion:** NONE.
**Mobile:** filtros colapsables, lista full-width. **Desktop:** filtros laterales + lista central.
**Capabilities:** C14, C04, C01, C15 (lectura; soporta C02/C05/C06/C10). **Gap:** none — no inventar.

**Conteo: 38/38 fichas completas. Ninguna route se resolvió copiando una donor app; cada donor aporta solo interaction pattern con justificación.**

---

# 7. Laboratory deep-dives

## 7.1 HOME — ¿Qué necesito saber o hacer ahora?

**Hallazgo central.** CURRENT ya descubrió la estructura correcta (Necesita tu atención + Hoy + Próximamente + Comunicaciones) pero la entierra: el reloj fijo le quita verdad, el link hardcodeado le quita confianza, y "Comunicaciones recientes" mezcla anuncios con cháchara. El TARGET no reordena por estética sino por decisión: una persona nueva debe saber en 5 segundos si tiene que hacer algo. Si no hay nada pendiente, Home lo dice explícitamente ("Nada pendiente. Próximo: Entrenamiento jueves 18h") en vez de mostrar un feed vacío que parece roto. ¿Vas? vive inline en Home para el próximo evento pendiente (mismo gesto que en R13/R15, mismo conteo), porque obligar a navegar a EventDetail para la acción más frecuente viola P6. Guardian: Home es la primera proyección afectada por `Viendo a X`; con un solo menor no hay selector ni explicación, el contexto simplemente es el del menor. Regla de densidad: máximo 3 ítems en Necesita tu atención; el resto vive en sus destinos. Esto evita el dashboard-métricas y respeta [D6]: summary of state + next action como foco único.

## 7.2 EVENT DETAIL — ¿Qué está pasando con este evento y qué tengo que hacer yo?

**Hallazgo central.** Es la pantalla con más capabilities (8) y el mayor riesgo de convertirse en "ficha de base de datos". El TARGET la organiza por rol-acción: para PLAYER/CAPTAIN es una pantalla de respuesta (¿Vas? domina; convocados y mensajes subordinados); para COACH es una pantalla de operación (rail Participación: ¿Vas?→Convocados→Asistencia→Resultado según estado del lifecycle); para SUBCOMMITTEE/ADMIN es lectura + gestión puntual. El error P0-5 (Alert de conflictos visible a PLAYER) demuestra por qué el gating no es decoración: la misma información cambia de L1 a L4 según quién mira. Impact Preview y scope de serie viven aquí como MODAL con consecuencias antes de ejecutar ([D5]): "Cambiar la sede afecta a 14 convocadas y 9 confirmadas. Se les avisará. [Revisar afectados] [Confirmar cambio]". Mensajes del evento contenidos (no el chat general) para no mezclar coordinación puntual con conversación.

## 7.3 SELECTION — ¿A quién convoco y quién tiene algún problema?

**Hallazgo central.** Debe usarse muy rápido, y la velocidad viene de tres decisiones: (1) tabla como lista de filas con estados en texto (no badges por columna), con el conflicto explicado en vocabulario usuario bajo la fila ("No puede jugar este partido por un tema del club. Hablar con Subcomisión" en vez de ELIGIBILITY_BLOCKED); (2) autosave con estado visible ("Borrador guardado 18:42") para no perder trabajo ni generar ansiedad de guardado; (3) publicar-con-conflicto-derivado (§14) en vez de bloqueo: el coach decide con información completa, el sistema registra, Home lo refleja. Bloquear la publicación por eligibility (fricción CURRENT) transfiere al coach una decisión que el Freeze asigna al sistema (derivar) + humano (publicar informado). Conflict Workspace (P1-06) es la superficie que falta para el caso 409/IMPACT_CHANGED: baseline vs borrador vs servidor lado a lado, sin la cual la "velocidad" colapsa ante el primer choque.

## 7.4 ATTENDANCE — ¿Quién estuvo?

**Hallazgo central.** Recorrer un roster casi sin pensar exige: filas grandes con el nombre como ancla visual, gesto único por fila (tocar cicla Presente→Ausente→Justificado→sin marcar, con texto siempre visible), conteo vivo arriba ("12 presentes · 3 ausentes · 2 sin registrar"), y UNRECORDED distinguido de ausente en todo momento (Freeze §9: sin row = UNRECORDED; confundirlos destruye reporting). Abrir/Cerrar es el único gesto con fricción intencional (MODAL con motivo para corregir), porque cambia el estado de la planilla. P0-2 (sobrescritura del mapa) es invisible en UI pero letal en confianza: el TARGET exige que cada corrección muestre antes/después en historial (L3), o la planilla "cerrada" no significa nada. Mobile-first real: se marca en la cancha, con una mano, con sol en la pantalla — contraste y tamaño antes que densidad.

## 7.5 COMMUNICATION — ¿Qué dijeron y con quién estoy hablando?

**Hallazgo central.** La expectativa ya aprendida ([D4]/[D9]) es el diseño: tabs Conversaciones/Comunicados porque la gente ya vive en WhatsApp Communities (anuncios arriba, grupos por tema). Tres decisiones sostienen la simplicidad: (1) Comunicados son lectura con audiencia visible y acuse mínimo — sin input competidor, sin hilo; (2) Conversación TEAM/EVENT muestra su contexto siempre ("Sexta A · Partido vs CUBA") para que nadie pregunte "¿de qué equipo es este grupo?"; (3) crear conversación elige tipo primero (Directo/Grupo/Equipo/Partido) porque el tipo determina las reglas (DIRECT 1 por pair, TEAM/EVENT canonical). Los gaps FDPG-03 (mute/mentions/replies) y FDPG-04 (DIRECT duplicado) son exactamente los lugares donde CURRENT se queda corto frente a la expectativa aprendida: la gente intentará silenciar un grupo ruidoso y mencionar a alguien, porque eso hacen en todas sus otras apps.

## 7.6 PERSON ADMIN — ¿Quién es esta persona y qué necesito administrar?

**Hallazgo central.** Es la pantalla donde la densidad administrativa amenaza con devorar la comprensión. El TARGET aplica disclosure agresivo por secciones colapsables ordenadas por frecuencia de uso real: identidad → pertenencia/roles → elegibilidad → cuenta → auditoría. Cada sección muestra su estado en una línea sin abrir ("Cuenta: activa · último acceso …", "Elegibilidad: puede jugar"). PII gated por rol no es un feature, es la forma de la pantalla: DNI/birth simplemente no existen en el DOM para quien no es ADMIN; teléfono/email aparecen solo con necesidad operativa. La elegibilidad manual (SUBCOMMITTEE) es la sección más delicada: cada constraint muestra scope/source/reason/validity en vocabulario usuario ("No puede jugar en el club hasta el 30/11 — tema federativo") con traza a Auditoría. Guardian no aparece aquí como rol (v1.0.1): las relaciones viven en el perfil del guardián, no en la ficha del menor, para no mezclar administración con delegación.

---

# 8. Cross-screen findings

1. **¿Vas? es un gesto global, no una pantalla.** Aparece en Home, EventDetail, TeamDetail, Calendar y Availability con idéntica gramática (3 estados en texto + conteo). Unificarlo es la mayor ganancia de simplicidad transversal.
2. **Draft vs publicado es el estado que más confusión genera.** Selection, Announcement, MatchRecord y Event usan vocabularios distintos para la misma idea. TARGET: `Borrador` / `Publicado|Cerrado|Final` + fecha, en todas.
3. **El reloj fijo contamina 5 pantallas.** Home, Calendar, EventDetail, Selection, Conversation ordenan por "hoy" congelado. Ningún TARGET funciona sin reloj real (fix Stage 4, P2-).
4. **Los literales hardcodeados rompen la confianza en 4 pantallas.** Sede "Alvear 1240", /conversations/c2, /jornadas/j1, código GEI-2026-4812. Regla: ningún literal de seed en UI fuera de harness DEV.
5. **Breadcrumb "Mi espacio" no cubre 6 destinos.** Reemplazar por mapa Record<prefijo, etiqueta> con vocabulario usuario.
6. **Tensión consciente con Apple HIG: el tab "Más".** HIG desaconseja el overflow-tab porque esconde contenido [F1]. GEI lo mantiene intencionalmente: es destino de uso no-diario (P3), no overflow de lo que no cupo. Se documenta la tensión en vez de esconderla; la mitigación es que nada diario vive en Más.
7. **EXTERNAL RESEARCH PENDING:** roster/attendance en apps deportivas escolares no-angloparlantes y expectativas de familias (no solo coaches) ante listas de convocatoria; validar con usuarios reales del club antes de Stage 4. No se finge cobertura.

---

# 9. Product gaps discovered (FRONTEND_DISCOVERED_PRODUCT_GAP)

Solo gaps que el diseño visual revela como capacidad/información real faltante. Confirmaciones de P0/P1 ya auditados se marcan como tales, no como nuevos. Nada se cambia en el Freeze automáticamente; se deciden en el stress test posterior.

## FDPG-01 — Scope dialog al editar serie/alcance conjunto (NUEVO)

- **Descripción:** al editar un evento perteneciente a serie (o jornada con hijos), no hay superficie que pregunte alcance (solo este / siguientes / todos) ni preview de afectados antes de ejecutar.
- **Affected screens:** R05, R13, R14, R20.
- **Affected capability:** C10 Change Management (+ C07).
- **Freeze section:** §11 (material changes, Impact Preview), §9 (EventSeries ACTIVE→ENDED, 366 occurrences).
- **Proposed clarification:** Impact Preview exige selector de alcance en vocabulario usuario + token + reconfirmación; patrón [D5].
- **Implementation impact:** medio — modal + token + validación por alcance; sin cambio de modelo si EventSeries ya existe (P1-04).

## FDPG-02 — Nudge / recordatorios a no-respondidos (NUEVO)

- **Descripción:** el coach no puede recordar a quienes no respondieron ¿Vas? sin salir a WhatsApp; no hay recordatorio automático.
- **Affected screens:** R04, R13, R15.
- **Affected capability:** C09 Participation (+ C12).
- **Freeze section:** §12 (Availability, NO_RESPONSE), §22 (Notifications — tipos V1 cerrados, sin reminder), §58 (Worker/Outbox).
- **Proposed clarification:** definir si "recordatorio de disponibilidad" es nuevo Notification type (v1.1) o acción coordinativa sin notificación persistida; patrón [D3].
- **Implementation impact:** medio-alto — toca §22/§58 si es notification; bajo si es solo coordinación.

## FDPG-03 — Mute / mentions / replies agrupadas en chat (NUEVO)

- **Descripción:** la expectativa aprendida ([D4]) incluye silenciar grupos, mencionar y responder al hilo; CURRENT no lo tiene.
- **Affected screens:** R21, R26.
- **Affected capability:** C12.
- **Freeze section:** §20 (Conversation/participants), §59 (conversation realtime).
- **Proposed clarification:** alcance V1: ¿mute/mentions/replies sí o no? Si sí, modelo ( participant prefs, mention index, reply_to) y reglas de notificación.
- **Implementation impact:** medio — modelo + realtime + notificaciones.

## FDPG-04 — Prevención UI de DIRECT duplicado por pair (NUEVO)

- **Descripción:** §20 exige máximo 1 DIRECT por pair (direct_pair_key unique), pero ninguna superficie previene crearlo ni redirige al existente.
- **Affected screens:** R22.
- **Affected capability:** C12.
- **Freeze section:** §20 (DIRECT canonical unordered pair).
- **Proposed clarification:** NewConversation detecta pair existente y ofrece abrirlo en vez de duplicar (comportamiento, no modelo).
- **Implementation impact:** bajo — query + UX, sin cambio de Freeze (aclaración de comportamiento).

## Confirmados (ya auditados, el research los valida — no son nuevos)

- P1-06 Conflict Workspace (R16, C10, §44/§73) — el research confirma que sin esta superficie la "velocidad" de Convocados colapsa.
- P1-01 Guardian superficies (R08/R30/R31/R32, §5/§17/§53) — v1.0.1 cierra experiencia; falta implementación.
- P1-02 Eligibility SUBCOMMITTEE (R32, §5/§6/§13) — confirmado por ficha R32.
- P1-05 Membership (R30/R31/R32, §17) — confirmado por fichas.
- P1-04 EventSeries (R19/R20, §9) — confirmado por fichas.
- M-12 CompetitionEntry fusionado (R33/R34, §16) — confirmado por fichas.
- M-13 Venue address/field_label (R28, §19) — confirmado por ficha R28.

---

# 10. No implementation + handoff a Blueprint

Esta investigación no modifica `src/`, no agrega features, no refactoriza, no arregla P0/P1. El TARGET ejecutable condensado vive en `docs/GEI_FRONTEND_TARGET_BLUEPRINT_V1.md`: IA global, navigation contract, reglas de atención, L0–L4, jerarquía de acciones, surfaces, responsive, iconografía, motion, archetypes reutilizables, target por route, capabilities por screen, gaps, KEEP/CHANGE explícitos. Stage 4 (otra ejecución) lo implementa.
