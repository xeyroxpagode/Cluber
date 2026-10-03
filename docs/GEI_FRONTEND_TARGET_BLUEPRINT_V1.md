# GEI — FRONTEND TARGET BLUEPRINT V1

**Estado:** TARGET ejecutable para Stage 4. NO código. Evidencia completa en `docs/GEI_IA_SIMPLICITY_RESEARCH_V1.md`.
**Autoridad:** Freeze v1.0.1. Si este blueprint contradice el Freeze, el Freeze gana y el blueprint se corrige.
**Alcance:** las 38 canonical routes. Vocabulario UI: Mi equipo, Partido, Entrenamiento, ¿Vas?, Convocados, Asistencia, Resultado, Mensajes, Comunicados.

---

# 1. Global IA

```
Inicio (/home)               ¿Qué tengo que saber o hacer ahora?      [ARCHETYPE: OPERATIONAL HOME]
Calendario (/calendar)       ¿Qué pasa y cuándo?                      [ARCHETYPE: TIME BROWSER]
Equipos (/teams, /teams/:id, /people/:personId)  ¿Quiénes somos?       [ARCHETYPE: ROSTER HOME / ENTITY DETAIL]
Comunicación (/communication + hijas)            ¿Qué dijeron?         [ARCHETYPE: CHANNEL HUB / CHAT]
Más (/more, /management/*, /reports/*, /audit, /more/profile)
                             ¿Qué necesito que no es diario?          [ARCHETYPE: HUB / MANAGEMENT LIST / ADMIN DETAIL / REPORT / TIMELINE]
Utilities (misma chrome, sin tab): Buscar (/search), Avisos (/notifications)
Auth (sin chrome): /login, /activate, /no-access
```

Profundidad máxima: tab → lista → detalle → sub-detalle (3 niveles + sheets). Nada diario vive en Más. Nada admin vive en tabs diarias. Guardian no tiene destino propio: habita Home/Calendario/Equipo/¿Vas? vía `Viendo a X` y se configura en Más → Mi perfil → Personas a cargo.

# 2. Navigation contract

1. 5 destinos idénticos en bottom nav (mobile) y sidebar (desktop ≥1024px): Inicio, Calendario, Equipos, Comunicación, Más. Sin drawer. Sin command palette. Tabs con label de una palabra + icono.
2. Tabs siempre visibles y nunca deshabilitadas; sección vacía explica por qué (no desaparece).
3. Utilidades persistentes en header: Buscar (⌘K/Ctrl+K) + Avisos con punto no-leído + avatar → Mi perfil.
4. Tabs internas (Equipo/Eventos/Resultados; Conversaciones/Comunicados; tabs de Structure) preservan estado por tab y solo navegan, nunca ejecutan.
5. Cross-highlight: Calendario activo en /events/* y /jornadas/*; Comunicación en /conversations/* y /announcements/*; Más en /management/*, /reports/*, /audit, /more/*.
6. Back preserva origen (filtros/tab/scroll); deep link autosuficiente; breadcrumb por mapa Record<prefijo, etiqueta> en vocabulario usuario (mata "Mi espacio").
7. Guardian con un solo menor: sin selector. Con varios: `Viendo a X ▾` en Home y cabeceras afectadas (sheet en mobile).

# 3. Visual attention rules

Orden de lectura impuesto por construcción: L0 (estado + acción) → L1 (operacional) → L2 (contexto) → L3/L4 (bajo demanda/escondido). Herramientas: tamaño (1 hero por screen: marcador, ¿Vas?, conteo), peso (una sola acción primaria con peso máximo), contraste (estados terminales DRAFT/PUBLICADO/ABIERTA/CERRADA/FINAL siempre en texto, nunca solo color), espacio (atención separada de Próximamente; Comunicados separados de Mensajes), proximidad (acción pegada a su estado: ¿Vas? bajo el evento; Publicar bajo el conteo), repetición (misma gramática de fila en las 6 pantallas roster). Prohibido: dos primarias compitiendo, KPIs decorativos, card uniforme para todo, badge por defecto.

# 4. Information levels L0–L4 (contrato por archetype en §9; resumen)

- L0: estado + próxima acción, 1–3 s. Siempre visible, nunca en overflow.
- L1: datos para actuar (hora, lugar, ¿Vas?, conteos, audiencia). Visible sin scroll en mobile salvo listas largas.
- L2: contexto (logística, miembros, audiencia detalle, motivos). Visible o a 1 tap/sheet.
- L3: detalle bajo demanda (historial, revisiones, correcciones, ediciones). Colapsado/ruta hija.
- L4: admin/rare (IDs, reglas §, prefs, audit técnico). Tras acción/contexto apropiado; PII gated por rol (DNI/birth ADMIN; contacto por necesidad operativa; eligibility reason/source SUBCOMMITTEE+ADMIN; Guardian mínimo v1.0.1).

# 5. Action hierarchy

Por screen: 0–1 primaria (sticky bottom en mobile / header en desktop para tareas; inline para gestos). Secundarias como rows tocables o acciones contextuales junto a su objeto. Raras/destructivas en overflow; destructivas y lifecycle (Postergar/Cancelar/Restaurar, Archivar, Cerrar, Finalizar) siempre con MODAL de consecuencias a distancia de 1 confirmación, nunca más. Reglas de consistencia: Crear/Guardar/Publicar/Finalizar/Cerrar siempre mismo verbo + misma posición por archetype; Descartar con cambios siempre confirma; éxito navega al objeto + rastro en Auditoría; error preserva input + dice qué pasó y qué hacer (Freeze §44/§73; nunca fake success §47).

# 6. Surface-selection rules

| Decisión | Surface | Ejemplos GEI |
|---|---|---|
| Ver/operar algo importante o compartible | ROUTE | Las 38 routes; EventDetail, Convocados, Conversación, Ficha, Informes |
| Tarea corta que conserva origen | SHEET | ¿Vas? desde Home; convocados cortos; crear estructura/competencia; selector Viendo a X; filtros complejos |
| Confirmación o decisión acotada | MODAL | Impact Preview + token; scope de serie; Publicar; Finalizar; Cerrar/Corregir con motivo; eliminar mensaje; archivar |
| Respuesta simple pegada al contexto | INLINE | Marcar ¿Vas?/Asistencia; acuse Entendido; validación de campo; conteos live; autosave "Borrador guardado" |
| Secundaria/rara/destructiva | OVERFLOW | Postergar/Cancelar/Restaurar; historial; prefs; export; silenciar |
| Conflicto de versiones | DEDICATED surface | Conflict Workspace: baseline vs borrador vs servidor lado a lado (P1-06) |

# 7. Responsive rules

- Mobile (<1024px): bottom nav; agenda por defecto en Calendario; tablas→listas de filas; formularios 1 columna con primaria sticky; modales full-screen; sheets a pantalla casi completa; composer del chat siempre visible sobre el teclado (fix P2-23); toque ≥44px en gestos roster.
- Desktop (≥1024px): sidebar 224px con los mismos 5 destinos; contenido max-w columna central; detalle = columna + panel lateral (hijos/impacto/miembros/historial); tablas completas con ordenación; modales centrados.
- Tablet: bottom nav o rail según ancho, misma destinations; sin layouts exclusivos por tamaño (una sola navigation graph conceptual).
- Sin breakpoints ad-hoc; sin supuestos desktop-only; resize reversible con estado preservado.

# 8. Iconography rules

Lucide (consistente, no se descarta). Icono solo si: estándar conocido (buscar, volver, enviar, añadir, archivo), o icono+label. Texto solo si el icono aporta ruido. Prohibido: icono por label, badges masivos, semáforos sin texto, custom icons por branding. Estados (Voy/Quizás/No voy, Presente/Ausente/Justificado/Sin registrar, Borrador/Publicado/Abierta/Cerrada/Final) siempre en texto; el color acompaña, nunca sustituye. Avatar = iniciales, funcional.

# 9. Motion rules

Default NONE. Permitido: MICRO FEEDBACK (¿Vas? guardado, conteo live, "Borrador guardado 18:42"), STATE TRANSITION (draft→publicado, open→closed, tab preservado), CONTEXT TRANSITION (sheet/modal con origen claro, scroll al último mensaje). Prohibido: bounce, fade-up en cards, scale en botones, decoración, >200ms sin causa. Cada animación debe responder qué apareció/desapareció/cambió/dónde fue.

# 10. Reusable screen archetypes (emergentes de las 38 fichas)

## A1 — OPERATIONAL HOME (R04; eco en R07)

- **Mental model:** bandeja de acción, no diario. Como abrir el banco y ver qué vence hoy.
- **Hierarchy:** Necesita-tu-atención (≤3) → Hoy → ¿Vas? inline → Próximamente → Comunicaciones. Cero-atención se dice explícito.
- **Primary location:** inline por bloque (¿Vas? / Abrir / Leer).
- **Row grammar:** [estado en texto] título — hora/lugar — acción.
- **Spacing:** atención separada del resto; aire entre bloques, densidad dentro.
- **Mobile/desktop:** feed vertical / misma columna central; sin métricas en ambos.
- **State:** pendientes primero; vacíos explicados, nunca rotos.
- **Motion:** micro feedback en ¿Vas?.

## A2 — TIME BROWSER (R05)

- **Mental model:** calendario real (mes/agenda), no planilla con fechas.
- **Hierarchy:** controles tiempo → grilla/lista con pendientes marcados → SHEET mini-detalle → ROUTE evento.
- **Primary:** ¿Vas? desde selección.
- **Row grammar:** [punto pendiente] hora — título — lugar.
- **Mobile:** agenda default, mes colapsable. **Desktop:** mes + panel detalle.
- **State:** Hoy real; pendientes ¿Vas? destacados sin badges masivos. **Motion:** NONE.

## A3 — ROSTER ACTION (R15, R16, R17; eco en R10)

- **Mental model:** pasar lista en la cancha: nombre-ancla, gesto único, conteo vivo.
- **Hierarchy:** cabecera evento + estado planilla → ACCIÓN sticky (Responder/Publicar/Cerrar) → conteo live → filas → L3 colapsado.
- **Primary location:** sticky bottom mobile / header desktop; segunda sticky solo si el estado la cambia (Abrir-para-corregir).
- **Row grammar:** nombre — estado en texto — (conflicto/motivo explicado en vocabulario usuario bajo la fila).
- **Spacing:** filas ≥44px, conteo separado y fijo.
- **Mobile:** lista full-width, toque grande. **Desktop:** lista + panel (conflictos/revisiones/historial).
- **State:** OPEN/CLOSED, draft/published, UNRECORDED≠ausente, stale→reconfirmar. **Motion:** micro feedback por fila.

## A4 — EVENT DETAIL (R13; eco en R20)

- **Mental model:** la página del partido: responder o ver qué pasó, luego contexto.
- **Hierarchy:** ¿Vas?/Resultado → cuándo/dónde → rail Participación (¿Vas?→Convocados→Asistencia→Resultado según lifecycle) → logística → mensajes del evento → historial.
- **Primary:** ¿Vas? (previo) / Ver resultado (posterior); lifecycle en overflow con modal.
- **Row grammar:** participación como 4 rows tocables con estado cada una.
- **Mobile:** cabecera con ¿Vas? + sheets. **Desktop:** detalle + panel asistencia.
- **State:** gating por rol (misma info cambia L1↔L4 según viewer). **Motion:** conteo live.

## A5 — CHAT (R26; eco en R21/R22)

- **Mental model:** WhatsApp/iMessage: leer arriba, escribir abajo, contexto siempre visible.
- **Hierarchy:** cabecera (quién + contexto TEAM/EVENT) → mensajes cronológicos → input sticky.
- **Primary:** Enviar (input sticky, siempre visible con teclado).
- **Row grammar:** burbuja/contenido + autor + hora; ediciones/eliminados marcados, no borrados.
- **Mobile:** full-height, sheet miembros. **Desktop:** chat + lateral.
- **State:** DIRECT/GROUP/TEAM/EVENT visible; soft-delete propio. **Motion:** scroll al último.

## A6 — ENTITY DETAIL (R10, R11, R24, R29, R34)

- **Mental model:** ficha de contacto con contexto: quién es + 1 acción + resto bajo demanda.
- **Hierarchy:** identidad + estado → 1 acción → operacional → contexto → L3/L4 colapsados.
- **Primary:** contextual única (¿Vas? / Entendido / Archivar-Activar / Inscribir).
- **Row grammar:** sección colapsable con estado en 1 línea sin abrir.
- **Mobile:** columna única. **Desktop:** tarjeta + panel.
- **State:** terminal explícito + fecha. **Motion:** acordeón.

## A7 — MANAGEMENT LIST (R09, R27, R28, R30, R33, R35)

- **Mental model:** índice admin puntual, no directorio diario.
- **Hierarchy:** buscador + filtros (chips) → filas mínimas (nombre + estado/alcance en texto) → detalle.
- **Primary:** Crear (contextual al tab/filtro) o ninguna (hubs).
- **Row grammar:** nombre — estado/alcance — próxima cita o conteo (sin KPIs).
- **Mobile:** buscador fijo, filtros scroll horizontal. **Desktop:** filtros colapsables + lista central.
- **State:** PII fuera de lista; estados lifecycle como texto. **Motion:** NONE.

## A8 — ADMIN FORM / ADMIN DETAIL (R12, R14, R19, R23, R25, R31, R32)

- **Mental model:** trámite puntual con guía: qué + para quién → completar → confirmar consecuencias.
- **Hierarchy:** SITUACIÓN (qué/objeto + alcance) → ACCIÓN sticky → secciones → impacto pre-confirmación → rastro.
- **Primary:** Guardar/Crear/Publicar sticky; Descartar confirma si hay cambios.
- **Row grammar:** campo = label persistente + input + error inline con recovery (nada se borra).
- **Spacing:** 1 columna mobile; form + panel impacto desktop.
- **State:** dirty visible; stale bloquea hasta reconfirmar; draft vs final inequívoco. **Motion:** foco a primer error; modal consecuencias.

## A9 — REPORT (R36, R37; hub R35)

- **Mental model:** tabla de lectura para decidir, no dashboard.
- **Hierarchy:** filtros con defaults (Mi equipo + período) → tabla → links a origen para actuar.
- **Primary:** ninguna (lectura). Acciones viven en origen (Calendario/Equipos/Comunicación).
- **Row grammar:** fila dato + link a evento/persona.
- **Mobile:** filtros colapsables, scroll horizontal controlado. **Desktop:** barra filtros + tabla ordenable.
- **State:** p95 <3s; vacío ≠ cero ≠ error. **Motion:** NONE.

## A10 — TIMELINE / HISTORY (R38; eco en R07)

- **Mental model:** registro de verdad append-only: qué cambió, quién, cuándo.
- **Hierarchy:** filtros (actor/recurso/acción/fecha, default 30 días) → lista cronológica con antes/después resumido → origen.
- **Primary:** ninguna. **Row grammar:** fecha — actor — acción en texto — recurso (link).
- **Mobile/desktop:** filtros colapsables + lista. **State:** inmutable, no editable. **Motion:** NONE.

# 11. Route-by-route target structure (38/38)

Formato: ROUTE → archetype → orden conceptual → primaria → capabilities.

- R01 /login → AUTH → marca→campos→entrar→ayuda → Iniciar sesión → C01 C04
- R02 /activate → AUTH → código→ingresar→dónde conseguirlo → Activar → C01 C03
- R03 /no-access → AUTH → qué pasó→qué hacer→contacto → Contactar/volver → C01 C04
- R04 /home → A1 → atención→hoy→¿Vas?→próximamente→comunicados → ¿Vas? pendiente → C07 C09 C12 C16
- R05 /calendar → A2 → tiempo→pendientes→selección→detalle → ¿Vas? → C07 C09 C10 C16
- R06 /search → A7 → campo→resultados→contexto→abrir → Abrir resultado → C15 C02 C03
- R07 /notifications → A10+A1 → qué cambió→acción→origen → Abrir aviso → C12 C10 C16
- R08 /more/profile → A6 → quién soy/veo→cambiar vista→datos→a cargo → Viendo-a-X (si aplica) → C01 C03 C04
- R09 /teams → A7 → mis equipos→abrir→qué pasa → Abrir Mi equipo → C02 C03 C05
- R10 /teams/:teamId → A6+A3 → próximo+resultado→¿Vas?→plantilla/eventos → ¿Vas? → C02 C03 C05 C06 C09 C13
- R11 /people/:personId → A6 → quién→contactar→equipo/asistencia → Contactar/¿Vas? → C03 C04 C09 C14
- R12 /events/new → A8 → qué+para quién→crear→lugar/convocados/logística → Crear → C07 C05 C09 C11 C12
- R13 /events/:eventId → A4 → ¿Vas?/resultado→cuándo/dónde→participación→logística→mensajes → ¿Vas? → C07 C08 C09 C10 C11 C12 C13 C14
- R14 /events/:eventId/edit → A8 → cabecera→guardar→secciones→impacto → Guardar → C07 C10 C11 C14 C04
- R15 /events/:eventId/availability → A3 → evento→¿Vas?→conteo→lista → VOY/QUIZÁS/NO → C09 C07 C12 C16 C06
- R16 /events/:eventId/selection → A3 → estado→publicar→tabla→conflictos→revisiones → Publicar → C03 C06 C07 C10 C14 C04
- R17 /events/:eventId/attendance → A3 → estado planilla→cerrar/abrir→lista→motivos → Cerrar/Abrir → C09 C07 C10 C14 C04
- R18 /events/:eventId/match-record → A8 → marcador→finalizar→goles→cierre → Finalizar → C13 C07 C08 C14 C04
- R19 /jornadas/new → A8 → nombre/fecha/sede→crear→hijos → Crear → C08 C05 C07 C11 C04
- R20 /jornadas/:jornadaId → A4 → cabecera→guardar→hijos→impacto → Guardar → C08 C07 C10 C11 C14 C04
- R21 /communication → A5-hub → tabs→CTA por tab→listas no-leídos → Nuevo mensaje/comunicado → C12 C15 C01 C04 C16
- R22 /communication/conversations/new → A8 → tipo→buscar→resumen→crear → Crear → C12 C01 C02 C03 C04
- R23 /communication/announcements/new → A8 → audiencia→publicar→cuerpo→alcance → Publicar → C12 C04 C10 C14 C01
- R24 /announcements/:id → A6 → título/meta→cuerpo→audiencia/acuse → Entendido → C12 C14 C04 C01
- R25 /announcements/:id/edit → A8 → bloqueo→guardar→diff→impacto → Guardar corrección → C12 C10 C14 C04
- R26 /conversations/:id → A5 → contexto→mensajes→enviar → Enviar → C12 C01 C04 C14 C16
- R27 /management → A7-hub → organización→competencia→integridad → (0) → C02 C05 C14 C15
- R28 /management/structure → A7+A8 → tabs→crear→filas→editar/archivar → Crear elemento → C02 C04 C10 C11 C14
- R29 /management/teams/:id → A6 → identidad→archivar/activar→asociados → Archivar/Activar → C02 C03 C04 C10 C14
- R30 /management/people → A7 → buscar/filtrar→filas→abrir → Crear persona → C01 C03 C04 C15
- R31 /management/people/new → A8 → formulario→crear→detalle+audit → Crear → C01 C03 C04 C10
- R32 /management/people/:id → A6+A8 → identidad→ajuste→secciones→audit → Guardar cambios → C01 C03 C04 C06 C10 C14
- R33 /management/competitions → A7 → lista/filtros→crear→abrir → Crear competencia → C02 C05 C10 C15
- R34 /management/competitions/:id → A6 → estado/scope→inscribir→avanzar → Añadir inscripción → C05 C06 C10 C14
- R35 /reports → A7-hub → asistencia→rendimiento → (0) → C09 C13 C15 C16
- R36 /reports/attendance → A9 → filtros→tabla→origen → (0, lectura) → C09 C15 C16
- R37 /reports/performance → A9 → filtros→tabla→jornada → (0, lectura) → C13 C15 C16
- R38 /audit → A10 → filtros→lista→origen → (0, lectura) → C14 C04 C01 C15

# 12. Capability replay (Freeze v1.0.1 → screens)

| CAPABILITY | SCREEN(S) | USER ACTION | INFORMATION REQUIRED | STATUS |
|---|---|---|---|---|
| C01 Identity & Access | R01 R02 R03 R08 R30 R31 R32 | Entrar, activar, crear persona, gestionar cuenta | Estado cuenta, roles/alcance, Last Admin | OK (target cubre; P0-4 fix Stage 4) |
| C02 Club Structure | R09 R10 R28 R29 R33 | Ver/crear equipos, estructura, sedes | Identidad immutable, estados, Venue A/B | OK target; confirma M-13 (Venue fields) |
| C03 People & Assignments | R10 R11 R16 R30 R31 R32 | Fichas, convocar, administrar | Pertenencia, roles, Guardian (perfil) | OK target; confirma P1-01/P1-05 |
| C04 Authority & Scope | transversal (gating) | Todo (fuente allowedActions) | allowedActions por objeto/estado | OK target (sin `if role===`) |
| C05 Competition Context | R10 R19 R20 R33 R34 | Ver contexto, inscribir | Entry TEAM/LINE, scopes, mismatch | OK target; confirma M-12 |
| C06 Eligibility | R16 (coach), R32 (subcom.) | Ver estado / mutar constraint | Constraints + traza; status gated | OK target; confirma P1-02 (+P0-5 fix) |
| C07 Event Operations | R04 R05 R12 R13 R14 | Crear/editar/ver eventos | Estado, lugar, serie/scope | OK target; FDPG-01 (scope dialog) |
| C08 Match Day / Jornada | R13 R18 R20 | Jornada + resultado | Hijos, sede conjunta, acta | OK target; confirma P1-04 |
| C09 Participation Lifecycle | R04 R13 R15 R16 R17 | ¿Vas?, convocar, asistencia | Respuestas, conflictos, planilla | OK target; FDPG-02 (nudge) |
| C10 Change Management | R14 R20 R25 + Conflict WS | Preview, reconfirmar, conflictos | Impacto, token, versiones | OK target; confirma P1-06; FDPG-01 |
| C11 Logistics | R12 R13 R14 R20 | Lugar, horarios, notas | Venue, meeting/departure | OK target; confirma M-13 |
| C12 Communication & Notification | R04 R07 R21–R26 | Avisar, conversar, leer | Audiencia, tipos §22, realtime | OK target; FDPG-03/04; FDPG-02 toca §22 |
| C13 Match Record & Performance | R10 R13 R18 R37 | Resultado, rendimiento | Marcador, FINAL, stats fijas | OK target (P0-3 fix Stage 4) |
| C14 History / Audit / Provenance | R13 R16 R25 R32 R38 | Rastrear cambios | Audit append-only, revisions | OK target (P0-2 fix Stage 4) |
| C15 Search & Reporting | R06 R30 R33 R35 R36 R37 R38 | Buscar, filtrar, informar | Índices, filtros, p95 | OK target |
| C16 Operational Awareness | R04 R05 R07 R26 | Home, calendario, avisos | Proyecciones, polling/realtime | OK target; FDPG-02 (reminders) |

Lectura: capability sin superficie = ninguna (las 16 tienen pantalla). Surface sin capability = ninguna (hubs R27/R35 son navegación). Actions sin command conceptual = las 4 FDPG (scope, nudge, mute/mentions, anti-duplicado DIRECT) + Conflict Workspace (P1-06) — todas registradas, ninguna implementada en esta pasada.

# 13. Identified Product Truth gaps (para stress test, no cambian el Freeze)

- FDPG-01 scope dialog serie/alcance (R05/R13/R14/R20; C10; §11/§9) — medio.
- FDPG-02 nudge/recordatorios no-respondidos (R04/R13/R15; C09/C12; §12/§22/§58) — medio-alto (puede tocar §22).
- FDPG-03 mute/mentions/replies (R21/R26; C12; §20/§59) — medio.
- FDPG-04 anti-duplicado DIRECT (R22; C12; §20) — bajo (comportamiento, no modelo).
- Confirmados ya auditados: P1-06 Conflict Workspace; P1-01 Guardian; P1-02 Eligibility SUBCOMMITTEE; P1-05 Membership; P1-04 EventSeries; M-12 Entry fusionado; M-13 Venue fields.

# 14. Explicit KEEP from Figma (no perder en Stage 4)

1. 5 destinos idénticos en bottom nav + sidebar (Shell).
2. Home Necesita-tu-atención + Hoy + Próximamente + Comunicaciones.
3. Calendar mes/agenda con degradación a agenda en mobile.
4. Tabs Equipo/Eventos/Resultados; tabs Conversaciones/Comunicados; tabs Temporada/División/Línea/Sede.
5. theme.css: 17 tokens semánticos + `@theme inline` (fuente visual; se extiende, no se reemplaza).
6. shared/ui 17 primitives + Modal con focus trap/Escape/scroll-lock.
7. EventDetail rail Participación (4 RowLinks) + ImpactContent como base del preview.
8. Availability YES/MAYBE/NO + aviso stale + derivados; Selection autosave + revisions immutable; Attendance OPEN/CLOSED + UNRECORDED + motivo; MatchRecord DRAFT→FINAL.
9. Announcement ciclo + audiencia immutable; Conversation DIRECT/GROUP + TEAM/EVENT canonical + soft-delete.
10. Guards (login/no-access/profile), atajo ⌘K, badges no-leídos, toasts, scroll-top, `sectionActive`.
11. Capa de autoridad visual (ADMIN≠Coach, CAPTAIN≠Coach, ADMIN no ve privados) como comportamiento a preservar con allowedActions.
12. `routes → features → shared`; cero inline styles; sin "Categoría"; OUT §3 respetado.

# 15. Explicit CHANGE from Figma (Stage 4, fuera de esta pasada)

1. Reloj real (mata 2026-10-02 fijo) en Home/Calendar/EventDetail/Selection/Conversation.
2. Cero literales de seed en UI (Alvear 1240, /conversations/c2, /jornadas/j1, GEI-2026-4812) fuera de harness DEV.
3. Gating P0-5 (Alert conflictos solo COACH/SUBCOMMITTEE/ADMIN); PII gated por rol en todas las fichas.
4. Publish-con-conflicto-derivado (§14) en vez de bloqueo; Conflict Workspace (P1-06).
5. Modelo: Membership, GuardianRelationship, EligibilityConstraint[], EventSeries, targets plurales, Entry desdoblado, Venue address/field_label (P1-01/02/04/05/06, M-12/13).
6. Breadcrumb por mapa (mata "Mi espacio"); composer visible mobile (P2-23); filtros en URL; allowedActions; Query/sessionEpoch; RHF+Zod; tokens extendidos.
7. P0-1/P0-2/P0-3/P0-4/P0-6: fixes deCorrectness (identidad, before/after, credenciales, venue A/B).
8. FDPG-01–04 según decisión del stress test; superficie SUBCOMMITTEE Eligibility; selector `Viendo a X`; mute/mentions/replies si se aprueban.
9. Sin rediseño visual gratuito: misma marca, mismos tokens, mismos primitives (extendidos). El cambio es estructural y de jerarquía, no estético.

# 16. Cierre

Blueprint autocontenido para Stage 4: IA global (§1), navegación (§2), atención (§3), L0–L4 (§4), acciones (§5), surfaces (§6), responsive (§7), iconografía (§8), motion (§9), 10 archetypes (§10), 38 targets (§11), replay C01–C16 (§12), gaps (§13), KEEP (§14), CHANGE (§15). No requiere releer el research para ejecutar; el research queda como evidencia y justificación donor por donor.
