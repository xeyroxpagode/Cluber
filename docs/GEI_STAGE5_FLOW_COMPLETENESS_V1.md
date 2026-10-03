# GEI HOCKEY MANAGEMENT SYSTEM
## STAGE 5 — FLOW COMPLETENESS V1 (F01–F30)

**Estado:** AUDITORÍA. AUDIT-ONLY. Ningún archivo de `src/**` modificado.
**Baseline:** `8f30cda91bb531539864ed9175ab256598b17e88` · rama `gei/stage5-ux-audit`.
**Criterio §5:** un flujo es COMPLETE sólo si cubre DISCOVERY → ENTRY → ORIENTATION → PRIMARY ACTION → VALIDATION → CONFIRMATION → STATE CHANGE → CROSS-SCREEN PROPAGATION → ERROR/RECOVERY → HISTORY (cuando corresponda) → RETURN/NEXT STEP, **más** variantes de permiso, empty/zero, mobile y desktop.
**Evidencia:** `docs/GEI_STAGE5_RUNTIME_EVIDENCE_V1.md` (38/38 rutas, 5 roles renderizados) + `docs/GEI_STAGE5_PERCEPTUAL_INTERACTION_AUDIT_V1.md` (UX-01…UX-46).

> **390 px:** no verificable en este entorno (ancho mínimo de SO ≈ 500 px). Toda celda `MOBILE` marcada `s` es **STATIC ONLY**.

---

# 0. RESUMEN

| STATUS | Count | Flujos |
|---|---|---|
| **COMPLETE** | **1** | F17 |
| **PARTIAL** | **17** | F02, F04, F06, F08, F11, F12, F13, F14, F15, F16, F19, F21, F23, F25, F26, F27, F30 |
| **MISSING** | **8** | F03, F05, F07, F09, F18, F20, F22, F28 |
| **CONTRADICTORY** | **4** | F01, F10, F24, F29 |

| Métrica §5 | Resultado |
|---|---|
| Flujos con ciclo completo | **1/30** |
| Flujos con estado terminal sin consecuencia comunicada | 6 (F04, F05, F07, F09, F10, F16) |
| Flujos sin HISTORY visible | **11** (F01, F04, F06, F09, F12, F13, F14, F16, F18, F19, F20, F24, F25, F29, F30 → 15) |
| Flujos con acción destructiva sin confirmación | 5 (F13, F18, F19, F21, F22) |
| Flujos cuyo ERROR no se muestra en el campo (§73 `422 → field explanation`) | 9 |
| Flujos con DEFAULT que puede producir error por un clic | 1 (F18) |
| Flujos con RECOVERY que destruye trabajo del usuario | 1 (F08) |

---

# F01 — ACCOUNT ACTIVATION — **CONTRADICTORY**

- **ENTRY:** `/management/people/:id` → sección "Cuenta y acceso" → "Crear acceso" (sólo si `!person.username`) → campo "Usuario único" → "Confirmar cambio".
- **STEPS reales:** ADMIN crea la persona (R31) → asigna usuario → pulsa **"Generar código de activación"** → la persona entra a `/activate` con usuario + código + contraseña → `POST` simulado → cuenta `PENDING → ACTIVE` → `/login` → `/home` → `/more` → "Mi perfil" → "Cerrar sesión".
- **ROLE:** ADMIN (crea) · la persona (activa). Ningún otro rol ve estas superficies.
- **STATE:** `Account PENDING → ACTIVE`; `Credential SETUP_REQUIRED → activo` (representado por `passwordSet`).
- **SUCCESS:** `/activate` renderiza estado completo con check verde, "Cuenta activada" y CTA "Ir a Ingresar" — **la única pantalla del producto con success state real** ✓.
- **ERROR:** "El usuario o el código de activación no son válidos. Consultá con administración." ✓ honesto, no blames al usuario, inline bajo el formulario ✓. Validación de contraseña: "Usá entre 12 y 128 caracteres. Las contraseñas deben coincidir." ✓ (§48).
- **RECOVERY:** el formulario se conserva y se reintenta ✓.
- **PROPAGATION:** `account = "ACTIVE"` → `hasAccess` true → `Shell` deja de redirigir a `/no-access` ✓. `login()` acepta el usuario ✓.
- **HISTORY:** `audit` escribe "Activar cuenta" ✓ pero **sólo visible en `/audit`, que es ADMIN-only** ⇒ la persona activada no tiene rastro de su propia activación.
- **MOBILE:** `s` — 4 campos apilados, sin riesgo de layout.
- **CONTRADICCIÓN:** `management.tsx:684-691` — **"Generar código de activación" no muta estado**: escribe una entrada de audit, muestra el literal `GEI-2026-4812` y un bloque "Simulación local · Uso único · Vigencia de 24 horas". El mismo literal es el único código que `/activate` acepta (`account-insight.tsx:433`). El código que el usuario "recibe" no existe en el sistema; el admin ve un `Alert tone="success"` con un texto que no se cumple. Viola §24 **"no fake success"** y §51.
- **FALTANTE PARA SER COMPLETO:** (1) comando real `IssueSetupToken` que cree el token y lo devuelva; (2) `PENDING → visible` en `/more/profile`; (3) `Deshabilitar → Reactivar` debe emitir código nuevo (§51); (4) 5 intentos fallidos (§51) — hoy ilimitados; (5) `Crear acceso` no valida que el `username` sea único antes de escribir (`management.tsx:580-591` valida, pero el flujo de "Restablecer acceso" no).

---

# F02 — PROFILE / ACCOUNT — **PARTIAL**

- **ENTRY:** `/more` → "Mi perfil" · o avatar del header · o `/no-access` → "Mi perfil".
- **PASOS QUE EXISTEN:** abrir perfil → ver nombre/rol/equipo → ver Usuario/Email/Teléfono/Contexto → "Editar contacto" → modal → "Guardar cambios" → toast "Contacto actualizado" + audit "Editar contacto propio" → "Cambiar contraseña" → validación 12–128 + confirmación coincidente → `changePassword` real (muta `credentialVersion`, **no** fake success) → toast.
- **PASOS QUE NO EXISTEN:** estado de cuenta; roles + alcance (asignaciones vigentes); Membership con período; TeamAssignment con período; "Personas a cargo" gestionable (revocar, cambiar permisos); vista inversa ("quién actúa sobre mi cuenta"); sesiones/actividad; estado de completitud del perfil de jugadora.
- **ROLE:** idéntico para los 5 roles salvo el texto del rol y la visibilidad de "Personas a cargo". **La pantalla no está personalizada.**
- **STATE:** `Account PENDING/ACTIVE/DISABLED` no se muestra; `Credential` no se muestra; `GuardianRelationship` se muestra sólo si el actor es guardián, y **read-only**.
- **SUCCESS:** dos toasts honestos; el de contraseña sólo aparece si `changePassword` devuelve `{ok:true}` ✓ (P0-4 correcto).
- **ERROR:** un único `Alert` en el modal, tras los 3 campos. Sin `aria-invalid`, sin foco al error, sin error por campo.
- **RECOVERY:** input preservado ✓; si falla la contraseña, `pending` se resetea ✓.
- **PROPAGATION:** contacto → `Header` del sidebar, `/more`, `PeopleManagement` y `/people/:id` ✓ (misma `state`).
- **HISTORY:** audit ✓ pero invisible fuera de `/audit` (ADMIN-only).
- **MOBILE:** `s` — un solo card; sin riesgo.
- **FALTANTE PARA SER COMPLETO:** ver `PROFILE_COMPLETENESS_MAP` en `docs/GEI_STAGE5_CAPABILITY_COMPLETENESS_V1.md`. Resumen: **estado de cuenta** (C01), **roles y alcance derivados de `roleAssignments[]`** (§5 — hoy muestra 1 rol legacy de N), **Membership/TeamAssignment con período** (§17), **"Personas a cargo" gestionable** (§20), **seguridad: sesiones + última actividad** (§36/§49), **indicador de perfil de jugadora incompleto con su camino de recuperación** (§17 → PG-06).

---

# F03 — GUARDIAN — **MISSING**

- **ENTRY:** login como `marcela.fernandez` → `roleAssignments: []`, `team: ""`, `hasAccess` por delegación ✓.
- **PASOS QUE EXISTEN:** Home muestra "Viendo a Lucía Fernández" (`overview.tsx:169-173`) ✓; el tab "Comunicación" se oculta ✓ (§20); `/more/profile` muestra "Personas a cargo" con la relación y "Puede responder ¿Vas?" ✓.
- **PASOS ROTOS:**
  1. **No puede responder disponibilidad.** `capabilities.availability = hasRole(actor,"PLAYER")` (`store.tsx:113`) ⇒ `false` porque `roleAssignments` está vacío. `GuardianRelationship.canRespondAvailability` **no se lee en ninguna feature** (única lectura: `account-insight.tsx:231`, sólo texto). Doble bloqueo: además el guard de alcance de `/availability` (`participation.tsx:48`) exige `event.team === actor.team` y el guardián tiene `team: ""`.
  2. **Alcance reduced a `clubWide`.** `overview.tsx:61` y `overview.tsx:445` filtran por `actor.team || clubWide` ⇒ el guardián ve **1 solo evento** de los 8 del seed. No ve el partido de su menor.
  3. **Selector de >1 menor inerte.** `overview.tsx:174-189`: `<select>` sin `onChange`. Con `guardianChildren.length > 1` no cambia contexto, no propaga a Calendario/Equipo/Availability.
  4. **Sin PII gating por relación.** No hay superficie que aplique §6 Guardian PII porque no hay superficie de menor; `PersonDetail` de un menor sólo se abre si se conoce el id.
  5. **"Personas a cargo" es read-only**: no se puede revocar, no se ven `canViewChildInfo` (sólo `canRespondAvailability`), no hay `relationship_type` editable, no hay alta/baja.
  6. **El harness no lo expone:** `?demo=guardian` no existe (`store.tsx:83-93`) ⇒ el contexto Guardian **no es verificable en runtime** por URL.
- **ROLE:** GUARDIAN.
- **STATE:** delegación vigente (`!validUntil`) ✓; sin no-vigentes.
- **ERROR:** n/a — no hay acciones.
- **PROPAGATION:** ninguna.
- **HISTORY:** `audit` escribe la relación al crearse (seed), no al consultarse.
- **MOBILE:** `s` — "Viendo a X" como texto en mobile ✓; el selector >1 sería un `<select>` nativo ✓ pero inerte.
- **FALTANTE PARA SER COMPLETO:** (1) `capabilities.availability` debe considerar `canRespondAvailability`; (2) el alcance del guardián debe derivarse de `childId → TeamAssignment → eventos`, no de `clubWide`; (3) `onChange` + propagación a las 4 proyecciones (§20); (4) superficie "Personas a cargo" gestionable (PG-03); (5) `?demo=guardian` para verificación; (6) PII gating por relación en la ficha del menor.

---

# F04 — HOME ATTENTION — **PARTIAL**

- **ENTRY:** `/home` (destino por defecto tras login).
- **PASOS QUE EXISTEN:** un cambio de estado (asistencia abierta / conflicto de convocatoria / resultado faltante / cambio de horario) → aparece una fila en "Necesita tu atención" → el usuario pulsa "Registrar / Ver partido / Revisar / Completar" → llega a la ruta → resuelve.
- **STEPS que faltan:** el ítem **desaparece sin señal** (sin motion, sin `aria-live`, sin toast que diga qué cambió) → violation de Blueprint §9 ("cada animación debe responder qué apareció/desapareció"). La fila que sale es el resultado de un `filter`, no de un estado.
- **ROLE — el filtrado por rol es correcto pero incompleto:**
  - COACH: 3 filas (asistencia + reconfirmación + conflicto) ✓
  - PLAYER: 1 fila (reconfirmación) ✓ — sin conflictos/asistencia/resultado ✓ correcto
  - ADMIN: **0 filas + "Nada pendiente."** con chip ámbar "0 pendientes" ⇒ señal contradictoria (UX-25)
  - SUBCOMMITTEE: 1 fila (reconfirmación) que **no puede resolver** — no tiene `VasInline` ni roster. §24 "authorized-but-blocked disabled + reason" incumplido.
- **STATE:** DRAFT y CANCELLED filtrados ✓; POSTPONED excluido de "Hoy" pero listado en Calendar ⇒ **dos verdades para el mismo día** (UX-25).
- **SUCCESS:** toast ✓. **ERROR:** n/a. **RECOVERY:** n/a.
- **PROPAGATION:** resolver la fila no la borra de forma visible; `state` se actualiza y el bloque se recalcula ✓ (re-render real).
- **HISTORY:** ninguno.
- **MOBILE:** verificado a 500 px ✓ — filas correctas, action label sustituido por chevron ✓.
- **FALTANTE PARA SER COMPLETO:** (1) ordenar por urgencia real (no por orden del array `state.events`); (2) badge coherente con el estado (0 → sin chip); (3) ocultar ítems no accionables por el rol o marcar el bloqueo; (4) señal perceptible al desaparecer; (5)Atomicidad con `hasCurrentConflicts` (§14) que hoy no existe como campo; (6) el seed debe garantizar un evento en `todayIso()` para que "Hoy" no arranque vacío.

---

# F05 — CALENDAR — **MISSING**

- **ENTRY:** tab "Calendario" (desktop sidebar / mobile bottom nav).
- **PASOS QUE EXISTEN:** browse (mes en ≥768 px / agenda en <768 px) → filtro por Equipo y Tipo → seleccionar un evento → navegar a `/events/:id`.
- **PASOS QUE FALTAN:**
  1. **¿Vas? desde la selección — AUSENTE.** Es la acción primaria que el Blueprint A2 asigna a esta pantalla. No hay `VasInline`, ni sheet, ni acción de disponibilidad en el calendario. El usuario que quiere responder tiene que entrar al evento y luego a `/availability` (2 saltos). Verificado en DOM: el calendario no contiene ningún control de respuesta.
  2. **Sheet de mini-detalle — AUSENTE.** El click en una celda de mes o en una fila de agenda navega directo; no hay detalle contextual.
  3. **Panel de detalle en desktop — AUSENTE** (§7 "detalle = columna + panel lateral").
  4. **Sin estado en la URL.** `useState` para mes/año/equipo/tipo/vista (`overview.tsx:437-441`) ⇒ Back no preserva, no hay deep link, no hay "compartir esta fecha". `useSearchParams` = **0** en todo `src/` (UX-23).
  5. **Toggle Mes/Agenda sin estado activo y no-op en mobile** (`overview.tsx:545-552`): el botón "Mes" por debajo de 768 px no produce ningún cambio visible.
  6. **"Hoy" resetea sólo mes/año**, no equipo ni tipo, y no hay indicación de filtro activo.
  7. **Leyenda que miente:** dice "Club" = `warning`, pero `CLUB_EVENT` se pinta con `bg-success-soft`; `TRAINING` y `CLUB_EVENT` son indistinguibles; `CANCELLED` no tiene leyenda; el tipo se codifica **sólo por color** + `line-through` (§8/§3 incumplido).
  8. **Cero estado en desktop:** con 0 eventos y vista Mes, la `Empty` vive en un contenedor `md:hidden` ⇒ no hay copy.
- **ROLE:** alcance por rol ✓; el guardian ve 1 evento y un `Select` "Equipo" con una única opción inútil.
- **SUCCESS/ERROR/RECOVERY:** n/a (es lectura). **PROPAGATION:** n/a. **HISTORY:** n/a.
- **MOBILE:** `s` — agenda por defecto ✓ correcto; toggle Mes inoperante.
- **FALTANTE PARA SER COMPLETO:** ¿Vas? inline o sheet; sheet de mini-detalle; panel lateral en ≥1024 px; **mes/equipo/tipo/vista en la URL**; estado activo del toggle; leyenda coherente con la grilla o type-in-text; empty de cero en desktop; mover el corte de mes de `md:` (768) a `lg:` (1024).

---

# F06 — EVENT CREATE — **PARTIAL**

- **ENTRY:** "Crear evento" en `/home` (COACH/SUBCOMMITTEE) o `/calendar` → `/events/new`.
- **PASOS QUE EXISTEN:** descubrir → crear (tipo → información general → fecha/lugar → logística) → validar → éxito → navegar a `/events/:id` (recién creado) ✓ (§5 "éxito navega al objeto") → el evento aparece en `/calendar` ✓ y en el `Home > Próximamente` ✓ → `/events/:id` muestra fecha, sede, dirección y rail de participación ✓.
- **PASOS QUE FALTAN:**
  1. **ScopeDialog no se ofrece al crear una serie.** `seriesId` sólo se puede asignar en edición (`events.tsx:159-161` seed); el flujo de creación no ofrece recurrencia ⇒ el alcance de serie sólo se descubre **después** de crear.
  2. **Validación monolítica:** un único `Alert` para 6 campos ("Completá la fecha, el horario, la sede y los datos necesarios para programar."); no dice cuál falta; vive **después** de las 4 secciones ⇒ fuera de pantalla en mobile.
  3. **0 campos con `aria-invalid`**, 0 foco al primer error, sin `<form>` ⇒ `Enter` no submitea.
  4. **Sin `422 EVENT_TARGET_INVALID`** para TRAINING sin target (§10: ">=1 Team o Person target antes de Scheduled").
  5. **Temporada implícita:** laSeason no se pide; se hardcodea.
- **ROLE:** COACH (Team scope) y SUBCOMMITTEE (Club scope) ✓; ADMIN excluido ✓ (§5 correcto).
- **STATE:** el evento nace `DRAFT` o `SCHEDULED` según el botón ("Programar" vs "Guardar borrador") ✓.
- **SUCCESS:** toast "Evento programado" + navegación ✓.
- **ERROR:** ver arriba. **RECOVERY:** input preservado ✓; sin reintento explícito.
- **PROPAGATION:** ✓ verificada en DOM (aparece en Calendar y Home).
- **HISTORY:** `event.history` "Evento programado por {actor} · {fecha}" ✓ (visible en "Ver historial del evento") + audit ✓.
- **MOBILE:** `s` — 1 columna ✓; primaria sticky ✓ pero dentro de `max-w-3xl` ⇒ barra flotante, no de pantalla.
- **FALTANTE PARA SER COMPLETO:** recurrencia en el create; error por campo + foco; `EVENT_TARGET_INVALID`; barra de acción a pantalla completa en mobile; `expectedVersion` en create (no aplica: es un command nuevo).

---

# F07 — EVENT EDIT NON-MATERIAL — **MISSING**

- **ENTRY:** `/events/:id` → "Editar" → `/events/:id/edit`.
- **PASOS QUE EXISTEN:** abrir → editar (Equipo/Rival/Competencia/Fecha/Inicio/Finalización/Sede/Logística) → guardar → `eventChange` con `expectedVersion` real (`baselineVersion`) ✓ → error de versión manejado ✓ → propagación a `/calendar`, `Home`, `/events/:id` ✓.
- **LA CONTRADICCIÓN CENTRAL:** §11 define como non-material la "corrección de title/wording". El código la implementa correctamente (`material = Object.keys(patch).some(k => k !== "title")`, `events.tsx:790`; rama `else` sin `notify` ni `revision++`, `events.tsx:866-884`) — **pero el campo Título no se renderiza en modo edición**. Verificado en DOM: `/events/match-cuba/edit` muestra "Información general / Equipo / Rival / Competencia" y **ningún campo de título**. El flujo non-material es **inalcanzable desde la UI**.
- **Agravante:** la rama `else` hace `Object.assign(item, draft, …)` (`events.tsx:875-881`) con el **draft completo**, no con el patch ⇒ mutaría campos no renderizados (p. ej. `competition` en un TRAINING) sin `revision++` ni auditoría específica. Código muerto hoy, riesgo vivo si se reactiva el campo.
- **HISTORY:** `event.history` ✓ + audit con acción genérica "Editar evento" (no distingue "corrección de título" de un cambio operativo) ⇒ §71 trazabilidad degradada.
- **ROLE:**–. **ERROR:** §44 ✓ (`409` preserva el draft) — **excepción**: la acción de recovery navega y **destruye** el `draft` (`events.tsx:1145-1146`) ⇒ §44 incumplido en la recuperación.
- **MOBILE:** `s` — sin dirty ni descarte; el backdrop del modal descarta en silencio.
- **FALTANTE PARA SER COMPLETO:** (1) renderizar el campo Título en edición con su regla non-material; (2) `Object.assign` restricted al patch; (3) etiqueta de auditoría específica; (4) contador de caracteres u helper "no avisa a nadie" (el usuario debe saber que es free); (5) recovery que preserve el draft (§44).

---

# F08 — EVENT MATERIAL CHANGE — **PARTIAL**

- **ENTRY:** igual que F07, sobre un campo material (fecha/hora/sede/targets).
- **PASOS QUE EXISTEN:** editar → si el evento tiene serie, `ScopeDialog` ("¿Dónde querés aplicar el cambio?" con 3 opciones en vocabulario usuario ✓) → Impact Preview (`ImpactContent` con antes/después por campo) → "Confirmar cambio" → `eventChange` → `revision++` → `notify` → toast → propagación ✓.
- **PASOS QUE FALTAN:**
  1. **Sin `conflict_revision` visible** (§26 `coordination_revision`): el usuario no ve la versión de coordinación.
  2. **Impact Preview con datos fabricados:** `["…", `${count} personas recibirán la actualización`]` con `count` = tamaño del roster (`:617`, `:1130-1132`) o literal **19** en jornada (`:1379`); los destinatarios reales son `team + todos los SUBCOMMITTEE` e **incluyen al actor** (`store.tsx:163-170`). Las 4 líneas de impacto son idénticas para cualquier patch, incluso en un evento CANCELLED ("…al programarse", `:703`). Los campos **limpiados** no aparecen (`.filter(after !== undefined && after !== "")`, `:675`). La grilla `grid-cols-[80px_1fr_1fr]` **no tiene rótulo "Antes"/"Después"** ⇒ a 390 px es indescifrable.
  3. **Sin Conflict Workspace** (S4-02): no hay vista baseline vs borrador vs servidor. La recuperación muestra dos números de versión y un botón que **navega y descarta el trabajo**.
  4. **`IMPACT_CHANGED` sin efecto:** el escenario lanza el error pero el `ImpactContent` se recalcula con el mismo patch ⇒ **se muestra un impacto nuevo que es idéntico al viejo** (§73 "409 IMPACT_CHANGED → reconfirm new impact").
  5. **Escenario de un solo uso:** `scenarioTriggered` es un `useRef` del provider ⇒ stale/impact-changed **sólo se disparan una vez por sesión**.
  6. **Sin `availability` reconfirmation honesta:** `revision++` es global ⇒ cambiar **sólo** `arrival` invalida las 15 confirmaciones con el texto "El horario cambió desde tu última respuesta" (`vas.tsx:41,47`), que es **falso**. `store.tsx:364-366` tiene el `forEach` vacío con el comentario "La sede material invalida confirmaciones previas" — la intención existe, la granularidad no.
  7. **Tipo de notificación siempre `EVENT_CHANGED`:** "Restaurar" y "Reprogramar" comparten código (`execute()`, `events.tsx:138-143`) ⇒ §22 no puede distinguir `EVENT_RESTORED` de `EVENT_RESCHEDULED`.
- **ROLE:** COACH (TEAM/EVENT) y SUBCOMMITTEE (CLUB) ✓.
- **SUCCESS:** toast "Cambio confirmado. La información está actualizada." — **sin rama degradada** ⇒ §47 ("Cambio guardado. No pudimos actualizar toda la información.") no está implementado.
- **HISTORY:** `event.history` ✓ visible; sin before/after estructurado.
- **MOBILE:** `s` — la grilla de 3 columnas fijas sin `overflow-x-auto` es el mayor riesgo móvil del archivo.
- **FALTANTE PARA SER COMPLETO:** PG-01 (comando de apply-to-occurrences); Conflict Workspace; Impact Preview con rótulos, conteos reales y campos limpiados; granularidad de reconfirmación por campo; §47 degradado; `RESTORE` vs `RESCHEDULE`.

---

# F09 — EVENT SERIES — **MISSING**

- **ENTRY:** un TRAINING con `seriesId` → editar un campo material → `ScopeDialog`.
- **LO QUE EL USUARIO VE:** "Toda la serie / Aplica el cambio a todos los eventos." + `seriesCount` calculado sobre los eventos con el mismo `seriesId` (`events.tsx:767-769`) + preview que dice "Alcance: {scopeText}".
- **LO QUE EL SISTEMA HACE:** **nada.** Traza exacta: `events.tsx:813` `if (event.seriesId && !scope) { setAskScope(true); return }` → `:1089` `onPick` → `:1111` `save(true, true)` → `:812` `confirmed === true` → `:859-865` `eventChange(event.id, patch, …)`. **`scope` no entra en `patch`, no se pasa a `eventChange`, no se itera `state.events`.** Elegir "Toda la serie" con 2 eventos muestra "2 eventos" y **muta exactamente 1**.
- **Estado real de la serie:** `EventSeries { id, name, status }` existe en el modelo y en el seed (`series-sexta`, 2 eventos) pero **no se muestra en ninguna parte**: no hay nombre de serie en `/events/:id`, ni en la lista de eventos, ni en `/calendar`.
- **ROL:**–. **ERROR:**–. **RECOVERY:**–. **PROPAGATION:** inexistente. **HISTORY:** cada evento mutado tendría historia, pero sólo se muta uno.
- **MOBILE:** `s` — el `ScopeDialog` es un `Modal` full-width en mobile ✓.
- **FALTANTE PARA SER COMPLETO:** (1) `ApplyEventChange(scope, patch, impactToken)` con overrides por ocurrencia (PG-01); (2) nombre de serie visible en EventDetail; (3) `END` de serie (no hay superficie); (4) tests que asserten la propagación, no sólo el render del diálogo (los tests actuales sólo verifican que el `ScopeDialog` se monta).

---

# F10 — EVENT LIFECYCLE — **CONTRADICTORY**

- **ENTRY:** overflow "Más acciones" en `/events/:id`.
- **TRANSICIONES IMPLEMENTADAS (verificadas en código):**

| §9 | Existe | Observación |
|---|---|---|
| `DRAFT → SCHEDULED` | ✅ | "Programar" en el form |
| `SCHEDULED → POSTPONED` | ✅ | modal de consecuencias ✓ |
| `POSTPONED → SCHEDULED` | ✅ | rotulado "Reprogramar" |
| `SCHEDULED → CANCELLED` | ✅ | modal ✓ |
| `POSTPONED → CANCELLED` | ✅ | |
| `CANCELLED → SCHEDULED` (Restore) | ✅ | **mismo código que "Reprogramar"** ⇒ §22 indistinguible |
| `SCHEDULED → IN_PROGRESS` | ⚠️ | **sin modal de consecuencias** (Blueprint §5 lo exige) |
| `IN_PROGRESS → COMPLETED` | ⚠️ | **sólo TRAINING**; un MATCH no tiene salida |
| `IN_PROGRESS → ABANDONED` | ❌ | **INALCANZABLE**: ninguna acción de toda la app pone `state = "ABANDONED"` |
| `COMPLETED` no reabre | ✅ | `editable = false` oculta "Editar" |

- **CONTRADICCIÓN:** `/events/:id/match-record` (§12: MatchRecord aplica a MATCH) permite elegir `status = "Abandonado"` directamente, sin que el evento pase por `IN_PROGRESS → ABANDONED` (§9) ⇒ **el estado del partido se puede fijar desde el acta sin tocar el lifecycle del evento**. Verificado en runtime: el form está editable con el evento `Programado`.
- **FALTA:** consequence communication. Un evento `CANCELLED` renderiza **la misma pantalla** que uno vivo: misma fecha, misma hora, misma sede, misma logística, mismo rail de 4 filas de participación. Lo único que cambia es el badge. No hay `StateBanner` (declarado, 0 consumidores). Un evento `POSTPONED` sólo sustituye la hora por "A confirmar" (`events.tsx:346-348`).
- **ROLE:** COACH/SUBCOMMITTEE ✓; ADMIN sin lifecycle ✓ (§5).
- **HISTORY:** `event.history` ✓ con strings libres ("Horario actualizado de 16:00 a 18:00 · 1 oct 2026") — **sin before/after estructurado** aunque el texto lo contenga.
- **MOBILE:** `s` — el menú de overflow tiene items de ~34 px (<44 px).
- **FALTANTE PARA SER COMPLETO:** (1) `ABANDONED` alcanzable y con su path visual; (2) `StateBanner` conectado para estados terminales; (3) modal para `IN_PROGRESS`; (4) MATCH con salida a `COMPLETED`; (5) `RESTORE` con tipo de notificación propio; (6) el acta no puede fijar un estado que el evento no tiene.

---

# F11 — AVAILABILITY — **PARTIAL**

- **ENTRY:** `¿Vas?` inline en `/home` o `/events/:id`; `/availability` desde el rail.
- **PASOS QUE EXISTEN:** `NO_RESPONSE` → responder `YES/MAYBE/NO` (3 botones, `min-h-20`, `aria-pressed` en `VasInline`) → `toast("Respuesta guardada.")` → la fila de "Necesita tu atención" desaparece → `NEEDS_RECONFIRMATION` cuando `revision` cambia → aviso "El horario cambió desde tu última respuesta. Confirmá nuevamente." → re-responder.
- **PASOS QUE FALTAN:**
  1. **Sin estado "Todavía no respondiste."** en la implementación de `participation.tsx` (sí existe en `VasInline`).
  2. **Sin conteo por tipo de respuesta** en `/availability` (`Respuestas del equipo · 18` es el tamaño del roster, no un conteo). El conteo real existe en EventDetail ("15 respuestas · 3 sin respuesta · 15 necesitan reconfirmación") pero allí es **"0 sí"**, indescifrable.
  3. **Sin fila de recuperación:** las filas con `NEEDS_RECONFIRMATION` son read-only; nadie más puede ayudar a reconfirmar.
  4. **`RECONFIRM` fuera del enum de dominio** ⇒ `stateTone` cae en `neutral`; `NEEDS_RECONFIRMATION: "warning"` existe y nunca se usa.
  5. **Mensaje duplicado en runtime** (verificado a 500 px): la misma frase aparece en la línea de estado y en la caja ámbar, adyacentes.
  6. **Selección no visible cuando está stale:** `active = … && !stale` ⇒ la jugadora que ya respondió "Voy" ve los 3 botones sin selección.
  7. **Confirmación optimista prohibida:** `participation.tsx:73` "Tu disponibilidad quedó confirmada" antes de que exista verificación (§47). `VasInline` usa "Respuesta guardada." ✓ — **dos gramáticas con honestidad distinta**.
  8. **Sin `try/catch`:** si `updateEvent` fallara, `pending` queda en `true` para siempre ⇒ los 3 botones quedan **permanentemente deshabilitados sin mensaje**.
  9. **Guardian bloqueado** (ver F03).
  10. **Sin nudge a no respondidas** — FDPG-02, correctamente **DEFERRED** (§22 prohíbe notificar por respuesta de disponibilidad).
- **PROPAGATION:** ✓ la respuesta aparece en el conteo del EventDetail y en la columna DISPONIBILIDAD de Selection.
- **HISTORY:** `event.history` registra "Responder disponibilidad: {valor}" ✓.
- **MOBILE:** `s` — `grid-cols-3` a 390 px da ~118 px por botón ✓; `VasInline` con `min-h-11` (44 px) ✓.
- **FALTANTE PARA SER COMPLETO:** unificar la gramática en `VasInline`; conteo por tipo; `NEEDS_RECONFIRMATION` con tono y recovery; copy no optimista; `try/finally`; granularidad de reconfirmación por campo (F08-6).

---

# F12 — SELECTION — **PARTIAL**

- **ENTRY:** `/events/:id` → rail "Convocatoria" (o acción primaria "Convocatoria").
- **PASOS QUE EXISTEN:** `draft` → toggle de filas → **autosave con debounce 600 ms** ✓, *one in-flight* ✓, *coalesce* ✓, `generation` ✓ (§45 parcial) → estados `Guardado HH:MM` / `Cambios pendientes` / `Guardando…` / `Error al guardar` ✓ → "Publicar convocatoria" (modal con conteo + aviso de que se publica igual) → `published` + `selectionRevisions.push` → `notify("SELECTION_PUBLISHED")` → toast → EventDetail muestra "12 jugadoras convocadas" ✓ → Home no cambia (no lee conflictos).
- **PASOS QUE FALTAN:**
  1. **Estado `CONFLICT` del autosave — AUSENTE.** `publish` usa `updateEvent` (sin validación de versión), no `eventChange` ⇒ **no hay 409 posible** y por tanto no hay Conflict Workspace.
  2. **Sin diff de revisiones.** §22 exige que la republicación compare `selectedNow` / `removedNow`. El modal de publicación **no** muestra quién entra ni quién sale. `selectionRevisions` se escribe (`participation.tsx:302-307`) y se lee **sólo** en EventDetail como `<details>` con nombres, **sin diff** — y **no se renderiza en la propia pantalla de Convocatoria** (la ruta que la Blueprint define con "revisiones" al final del orden).
  3. **`hasCurrentConflicts` no existe como campo** (§14): se calcula local y efímero (`publishedConflicts`, `:279-284`) ⇒ **Home no puede consumirlo** aunque §14 lo mande alimentar "Necesita tu atención".
  4. **Conflicto no explicado en el punto de decisión:** el modal dice "1 jugadora tiene una situación actual" sin nombre ni motivo; el nombre y el motivo están en la tabla, en 10 px ámbar.
  5. **Motivo inexistente en el aviso:** "ya no pertenece al **destino** actual" (`:345`) usa un término de schema; §24 pide vocabulario de usuario.
  6. **Notify a todo el equipo**, no a `old audience ∪ new audience ∪ existing Availability ∪ published Selection ∪ relevant staff` (§22).
  7. **Copy que no describe el comportamiento:** "las personas correspondientes recibirán una notificación" cuando en realidad se notifica a `team + SUBCOMMITTEE + el actor`.
  8. **Rama de lectura (jugadora) no dice si ella está convocada.** Verificado en runtime: la jugadora ve "12 jugadoras convocadas" + 12 nombres y debe buscarse a sí misma.
  9. **Sin `422`/gate de publicación por `PLAYER_PROFILE_INCOMPLETE`.**
- **ROLE:** COACH edita+publica ✓; PLAYER/CAPTAIN lectura ✓; SUBCOMMITTEE/ADMIN `Empty` con motivo — pero el motivo ("La convocatoria corresponde a un partido dentro del alcance del equipo") no explica que la acción no existe para su rol.
- **HISTORY:** `selectionRevisions` ✓ (escrito) + `event.history` ✓ + audit ✓ — **ninguno visible con before/after en la pantalla de Convocatoria**.
- **MOBILE:** `s` — el header de tabla se oculta <768 px **y con él las etiquetas de columna** ⇒ la jugadora ve "Necesita reconfirmación" + "Habilitada" sin rótulo.
- **FALTANTE PARA SER COMPLETO:** estado `CONFLICT` + Conflict Workspace (S4-02); diff `selectedNow`/`removedNow` en el modal y en la sección de revisiones; `hasCurrentConflicts` como campo derivado consumido por Home; motivo por persona en el punto de decisión; audiencia de notificación §22; copy honesto; "estás convocada" en la rama de lectura.

---

# F13 — ATTENDANCE — **PARTIAL**

- **ENTRY:** `/events/:id` → rail "Asistencia" o acción primaria "Asistencia".
- **PASOS QUE EXISTEN:** `!opened` → `Empty` "La asistencia todavía no se abrió" + "Abrí la planilla…" + botón "Abrir asistencia" → abierta → 4 contadores (Presente/Ausente/Justificada/Sin registrar) → marcar por fila (3 botones) → cerrar → **modal que explica** ("Sin registrar no se significa ausente") → cerrada → "Corregir asistencia" → `TextArea` de motivo **requerido** → guardar → `attendanceHistory` con `before`/`after`/`actor`/`reason`/`correction` ✓ → toast.
- **PASOS QUE FALTAN:**
  1. **HISTORY INVISIBLE.** `attendanceHistory` se escribe (`store.tsx:272-282`) y **no se renderiza en ninguna parte** ⇒ el usuario que corrigió no puede ver qué cambió. P0-2 del Stage 4 report dice "CLOSED con before/after"; el before/after existe en el modelo y es invisible en la UI.
  2. **UNRECORDED no es estado terminal explicado.** Al cerrar quedan N "sin registrar"; el toast lo dice, pero la planilla cerrada **sigue mostrando los 3 botones deshabilitados sin explicar** que ya no se registran y que hay que "Corregir".
  3. **"Abrir asistencia" no es sticky** — vive dentro del `Empty` con `py-14`, es decir, en el centro de una caja grande.
  4. **No hay motivo por fila.** §A3 pide "conflicto/motivo explicado en vocabulario usuario bajo la fila" y R17 lista "lista → **motivos**". El modelo `AttendanceValue` es un enum de 3: **no existe `justification reason`**. PG de backend, no de frontend.
  5. **Sin corrección de `UNRECORDED → JUSTIFIED` con motivo obligatorio** que cierre el círculo de "quedó sin registrar".
  6. **Riesgo de dato:** 3 botones de **36 px** (`min-h-9`) con `gap-1.5` ⇒ *mis-tap* entre "Presente" y "Ausente" con consecuencia de dato. Blueprint §7 exige ≥44 px en gestos roster.
- **ROLE:** sólo COACH del equipo ✓ (§5). ADMIN/SUBCOMMITTEE `Empty` ✓.
- **SUCCESS:** toast + `Alert success` ✓. **ERROR:** sin superficie (no hay validación posible). **RECOVERY:** corrección con motivo ✓.
- **PROPAGATION:** `attendance` alimenta EventDetail ("M presentes · M sin registrar") ✓ y `/reports/attendance` ✓ — verificado en runtime.
- **HISTORY:** el modelo sí, la UI no. **MOBILE:** `s` — 36 px y `flex-wrap` por fila.
- **FALTANTE PARA SER COMPLETO:** (1) renderizar `attendanceHistory` (before/after + motivo + autor + fecha); (2) `UNRECORDED` como estado terminal explicado con su salida; (3) "Abrir" sticky; (4) `justification reason` (requiere Product Truth); (5) 44 px por botón.

---

# F14 — MATCH RECORD — **PARTIAL**

- **ENTRY:** `/events/:id` → rail "Resultado y estadísticas".
- **PASOS QUE EXISTEN:** `DRAFT` → marcador GEI/CUBA + `status` + observaciones + stats por jugadora (`played/goals/assists`) → "Guardar borrador" → "Finalizar resultado" (modal: "Sólo podrán hacerse correcciones explícitas con un motivo.") → `FINAL` → todos los campos `disabled` ✓ → única acción "Corregir resultado" → motivo **requerido** → `correctRecord` escribe `recordHistory` con `before` ("GEI 3-1 (FINAL)") / `after` / `actor` / `date` / `reason` ✓ → "Guardar corrección".
- **PASOS QUE FALTAN:**
  1. **HISTORY INVISIBLE** (mismo caso que F13): `recordHistory` se escribe (`store.tsx:304-313`) y **nunca se renderiza**.
  2. **CONTRADICCIÓN DE LIFECYCLE (verificada en DOM):** el evento está `Programado` y el acta **está plenamente editable**; el propio copy del formulario dice "El resultado puede registrarse cuando el partido esté en curso, completado o abandonado. Iniciá el evento desde su detalle." — la UI contradice su propia instrucción y §12.
  3. **`status = "Abandonado"` seleccionable sin lifecycle** ⇒ el evento nunca pasa a `ABANDONED` (F10).
  4. **Sin propagación visible:** `matchesPlayed` es derivado (§15) y `/reports/performance` lo calcula ✓, pero no hay señal en el evento de que el resultado ya impactó el informe.
  5. **Stats fijas sin validación:** `goals`/`assists` son `number` sin tope ni coherencia con `played` (una jugadora con `played:false` puede tener goles).
  6. **Sin `role="table"`/`<th>`**; checkbox `size-4` (16 px) sin label envolvente ⇒ peor accuracy que Selection.
- **ROLE:** sólo COACH ✓. **SUCCESS:** toast ✓. **ERROR:** sin validación de marcador. **RECOVERY:** corrección con motivo ✓.
- **PROPAGATION:** ✓ a `/reports/performance` (verificado: la tabla calcula desde `record.status === "PLAYED" && stats[player].played`).
- **MOBILE:** `s` — 6 columnas de input en un `grid` sin stack declarado.
- **FALTANTE PARA SER COMPLETO:** gate por estado del evento; `ABANDONED` por el lifecycle del evento; renderizar `recordHistory`; validación de stats; coherencia `played` ↔ stats.

---

# F15 — JORNADA — **PARTIAL**

- **ENTRY:** `/more` → "Jornadas" (deriva: si hay jornadas, va a la primera; si no, a `/jornadas/new`) ✓ — P2-32 cerrado.
- **PASOS QUE EXISTEN (create):** nombre → temporada (**disabled, literal**) → competencia → checkboxes de partidos `MATCH` (filtrando los ya asignados ✓) → "Crear jornada" → navega a `/jornadas/:id` ✓.
- **PASOS QUE EXISTEN (detail):** nombre → "Partidos" (filas con estado) → "Cambiar sede de la jornada" (`Select` de sedes) → "Revisar impacto" → modal con impacto **por hijo** → confirma → `venue` + `revision++` + `version++` + `history` + `notify` por hijo → toast.
- **PASOS QUE FALTAN:**
  1. **Sin add/remove de partidos** en R20 (la pertenencia se define al crear y nunca cambia).
  2. **Bulk parcial:** sólo `venue`. No hay bulk de fecha, hora ni estado.
  3. **Sin `expectedVersion`** en el bulk (`events.tsx:1338-1360` muta con `forEach` directo, sin pre-condición de versión) ⇒ el control de concurrencia no aplica a la única operación masiva del producto.
  4. **`count={19}` hardcodeado** en el preview (`:1379`).
  5. **`revision++` indiscriminado:** cambiar la **sede** marca como stale la disponibilidad de todas las jugadoras con el texto "**El horario cambió** desde tu última respuesta" ⇒ copy falso.
  6. **Sin manejo de error en el modal:** no hay bloque `{error}`; el backdrop cierra durante la mutación (`onClose` no respeta `pending`).
  7. **Sin validación §16:** `Match Team.season == Jornada.season`, `CompetitionEntry` TEAM/LINE, `Bulk ≤ 100`.
  8. **Gate de `mutable` inconsistente:** R20 excluye `COMPLETED`/`ABANDONED` pero **no** `IN_PROGRESS` (a diferencia de `events.tsx:101` y `:775`) ⇒ un bulk puede pisar un evento en curso.
  9. **Fecha y nombre de la jornada no editables**; `competition` se guarda pero no se muestra.
  10. **`pending` nunca se resetea** en el create si la promesa no resuelve (sin `finally`); `if (!name.trim()) return` es un **retorno silencioso** sin mensaje.
- **ROLE:** COACH (crea, bulk) y SUBCOMMITTEE (crea, bulk) ✓; ADMIN excluido ✓ (§5: Match = Club scope para SUBCOMMITTEE, Team para COACH).
- **MOBILE:** `s` — primaria inline no sticky; checkbox nativo ~20 px de target.
- **FALTANTE PARA SER COMPLETO:** add/remove; bulk de fecha/hora/estado; `expectedVersion`; conteo real; impacto por hijo sin literals; error + `pending` en el modal; validación §16; coherencia de `mutable`; `reconfirmación` con copy correcto.

---

# F16 — TEAM — **PARTIAL**

- **ENTRY:** tab "Equipos" → fila del equipo (1 para jugadora/capitana/entrenador; 4 para SUBCOMMITTEE/ADMIN).
- **PASOS QUE EXISTEN:** list → detail (tabs Equipo/Eventos/Resultados) → roster (18 filas, nombre + rol + elegibilidad si el viewer puede) → cuerpo técnico → próximos eventos (3) → resultados con marcador `tabular-nums` → link a la persona → link al evento.
- **PASOS QUE FALTAN:**
  1. **`/teams` no tiene entry point admin** (el hub `/management` lo expone, pero con la etiqueta "roster" y como superficie deportiva dentro de un hub administrativo).
  2. **T42 "Mi equipo primero":** el filtrado deja 1 fila, pero el título es plural y no hay marca de "mi equipo" ⇒ una jugadora no puede confirmar que esa es la suya.
  3. **Guard vacío:** para el guardian, `Surface` vacía sin explicación.
  4. **El resultado no enlaza al partido** (A9 exige link al origen) ⇒ desde un marcador no se llega al evento.
  5. **Tabs sin `role="tab"`** y sin estado en la URL ⇒ Back desde un tab pierde el tab.
  6. **Sin "¿Vas?"** para la jugadora en la pantalla del equipo, pese a que el Blueprint asigna "¿Vas?" como primaria de R10.
  7. **Sin filtro por texto** en A7 (buscador + chips).
- **ROLE:** gating de elegibilidad verificado ✓ (jugadora sin badges, entrenador con badges) — **el a11y de P0-5 funciona**.
- **HISTORY:** n/a. **MOBILE:** `s` — roster a ancho completo ✓.
- **FALTANTE PARA SER COMPLETO:** "Mi equipo" marcado; empty del guardian; links de resultado al evento; tabs en URL + semántica; ¿Vas? contextual; de A7 a A7.5.

---

# F17 — PERSON NORMAL — **COMPLETE**

- **ENTRY:** `/teams/:id` → tab "Equipo" → fila de persona.
- **PASOS QUE EXISTEN:** discovery (fila del roster) → entry (`/people/:personId`) → orientation (nombre, rol, equipo, badge de elegibilidad si el viewer puede verlo) → **contacto visible** (teléfono + email, gating §6 ✓) → contexto ("Pertenencia vigente · Temporada 2026") → return (breadcrumb "Hockey / Personas" + volver).
- **ROLE:** COACH ve contacto ✓ (§6 "necesidad operativa"); jugador ve lo mismo (no verificado en runtime con `?demo=player`, pero el código no diferencia); DNI y fecha de nacimiento **nunca** se muestran ✓; elegibilidad se muestra a quien puede ✓.
- **STATE:**–. **SUCCESS:**–. **ERROR:**–. **RECOVERY:**–. **PROPAGATION:**–. **HISTORY:**–.
- **MOBILE:** `s` — ficha de una columna ✓.
- **POR QUÉ ES EL ÚNICO COMPLETE:** es un flujo de **lectura pura** sin estado, sin mutación y sin decisión. Cumple §5 por exclusión: no tiene CONFIRMATION, STATE CHANGE, ERROR ni HISTORY que exigir.
- **MINOR QUE LE QUEDA:** (1) sin acción primaria (ni "¿Vas?" ni "Contactar") ⇒ es un nodo muerto del mapa; (2) "Pertenencia vigente · Temporada 2026" con año literal; (3) el `aria-label` del avatar duplica el nombre.

---

# F18 — PEOPLE ADMIN — **MISSING**

- **ENTRY:** `/management` → "Personas y accesos" → "Crear persona".
- **CADENA DE 9 PASOS QUE DEFINE EL ENCARGO, Y SU ESTADO REAL:**

| # | Paso | Existe | Evidencia |
|---|---|---|---|
| 1 | create | ✅ | R31, 6 campos, orden = §17 exacto, `422 PLAYER_PROFILE_INCOMPLETE` validado al asignar equipo |
| 2 | **membership** | ❌ | `draft.memberships` = **0 escrituras** en `management.tsx`; `state.memberships` = 0 lecturas. La UI muestra "Pertenencia y equipo" pero modela **team assignment**, no Membership |
| 3 | team assignment | ✅ | atómico con TeamAssignment + PLAYER RoleAssignment (§17 ✓) |
| 3b | move team | ✅ | atómico completo, **CAPTAIN no se transfiere** ✓, y el copy lo explica ✓ (excelente) |
| 3c | end team | ✅ | §17 ✓ |
| 4 | role | ✅ | "Asignar rol" + helper que explica que "Administración no incluye autoridad deportiva" ✓ |
| 5 | eligibility | ⚠️ | escribe `EligibilityConstraint[]` canónico ✓ pero con `scope:"CLUB"`, `source:"INTERNAL"`, `reason:"ADMIN"`, `validFrom=hoy`, `validUntil=null` **hardcodeados**; **3 de 4 scopes, 2 de 3 sources y 4 de 5 reasons son inalcanzables**; **no hay superficie de lectura** de constraints |
| 6 | account | ⚠️ | Crear/Restablecer/Deshabilitar/Reactivar existen; "Generar código de activación" **no muta**; **username no rotable** en "Restablecer acceso"; `PENDING → ACTIVE` sólo por `/activate` |
| 7 | **guardian relation** | ❌ | `guardianRelationships` = **0 referencias** en `management.tsx`. Lucía **tiene** `gr-1` y su ficha no lo muestra. §6 dice que ADMIN es quien ve la relación |
| 8 | edit | ⚠️ | Identidad **read-only** ⇒ **no existe camino de recuperación de `PLAYER_PROFILE_INCOMPLETE`** para nadie (ni la persona, ni ADMIN) |
| 9 | **audit** | ❌ | `state.audit` = **0 lecturas** en `management.tsx` ⇒ la ficha no muestra rastro, pese a que su descripción dice "Los cambios conservan la historia" |

- **CONTRADICCIÓN CRÍTICA (verificada en DOM):** la lista de personas muestra a la guardiana como **"MF Marcela Fernández / Club / Jugadora / Activo"**, cuando su `roleAssignments` es `[]` y §4/§5 exigen scope TEAM para PLAYER. La pantalla de administración afirma una verdad que Product Truth contradice.
- **AGUJERO DE SEGURIDAD:** el guard `LAST_ADMIN` (`management.tsx:553-560`) cubre "Deshabilitar cuenta" y "Finalizar rol ADMIN", pero **"Restablecer acceso"** hace `item.account = "PENDING"` (`:633-639`) sin guard ⇒ con un único ADMIN activo, el club queda **sin administrador**, y §18 define la recuperación como CLI ("No es API/UI").
- **OTRO AGUJERO:** "Deshabilitar cuenta" (destructiva) tiene **el mismo peso visual** que "Finalizar pertenencia" (benigna); `variant="danger"` = 0 usos.
- **MOBILE:** `s` — tabla sin `role="table"`; bajo 768 px pierde EQUIPO y ROL **sin fallback**.
- **FALTANTE PARA SER COMPLETO:** Membership (PG-02); GuardianRelationship (PG-03); lectura de constraints con scope/source/reason/validity; edición de identidad o camino de recuperación del perfil incompleto (PG-06); código de activación real; rotación de username; guard LAST_ADMIN en reset; audit en la ficha; `danger` + confirmación en "Deshabilitar".

---

# F19 — STRUCTURE — **PARTIAL**

- **ENTRY:** `/management` → "Estructura del club".
- **PASOS QUE EXISTEN:** 4 tabs (Temporada/División/Línea/Sede) → crear (modal, 1 campo) → editar nombre → archivar (`disabled` si hay dependencias + razón visible ✓) → renombrar Sede con la semántica A/B de §11 v1.0.1 correctamente separada ✓ (P0-6 cerrado: rename no propaga, cambio de sede del evento sí).
- **PASOS QUE FALTAN:**
  1. **Sin restore.** Archivar es **irreversible** desde la UI. §9 define `Team DRAFT→ACTIVE→ARCHIVED` sin retorno, pero División/Línea/Venue tienen `archived_at` y el producto no ofrece volver atrás ⇒ decisión irreversible sin confirmación (§24).
  2. **Temporada con estado "Activo"** — `StructureItem` sólo tiene `archived: boolean` y §19 no define lifecycle de estado para Season ⇒ **se inventa un estado**.
  3. **No existe creación de Team**, pero el error de rename instruye: *"Para una nueva identidad, creá un nuevo equipo"* ⇒ **instrucción imposible de seguir**.
  4. **Venue archivable sin efecto:** `venues[].archived` nunca se escribe.
  5. **Dependencias resueltas por nombre, no por id:** Sede compara `event.venue === name` (no `venueId`) ⇒ un rename de sede puede liberar o bloquear dependencias incorrectamente.
  6. **Línea ignora `CompetitionEntry` con `scope:"LINE"` activa** ⇒ una inscripción activa no bloquea archivar la Línea.
  7. **Temporada se renombra libremente**, lo que contradice "Season histórico" (§19) y la identidad `Season+División+Línea` de los Team.
  8. **`address` y `field_label` de Sede no editables** (§19 los define).
  9. **Tabs sin `role="tab"`/`aria-selected`** y **sin estado en la URL**.
  10. **"Guardar borrador" ≠ "Guardar"**: el disparador dice "Crear división" y el confirm dice "Guardar" (§5 exige mismo verbo).
  11. **Sin `history` por elemento.**
- **ROLE:** sólo ADMIN ✓ (§5 "Club structure" = ADMIN). SUBCOMMITTEE recibe `Restricted` ✓ correcto.
- **MOBILE:** `s` — tabs con `overflow-x-auto` ✓; primaria no sticky.
- **FALTANTE PARA SER COMPLETO:** restore; quitar el estado "Activo" de Temporada; creación de Team (o corregir el copy); Venue por `venueId`; dependencia de Entry LINE; `address`/`field_label`; tabs en URL + semántica; verbo único; modal de consecuencias en archivar.

---

# F20 — COMPETITION — **MISSING**

- **ENTRY:** `/more → Competiciones` (COACH/SUBCOMMITTEE) o `/management/competitions` (los mismos).
- **PASOS QUE EXISTEN:** crear competencia (nombre + organizador) → `DRAFT` → "Activar competencia" → "Crear inscripción" (alcance + target + referencia externa manual) → inscripción `PENDING → ACTIVE` → "Finalizar inscripción" (**con modal de consecuencias ✓**) → "Cerrar competencia" (**deshabilitado con razón visible ✓**).
- **PASOS QUE FALTAN:**
  1. **LINE scope no se puede expresar.** `CompetitionEntry.team` es un `string` único para TEAM y LINE (`model.ts:226`); el write es `team: scope === "LINE" ? team : team` — **un ternario no-op** (`management.tsx:1331`). Verificado en runtime: la inscripción renderiza **"Línea A · 2026"** sin división ni temporada, con 4 divisiones en el dataset ⇒ "Línea A" es ambiguo.
  2. **Sin `422 COMPETITION_SCOPE_MISMATCH`** en ningún punto (§16).
  3. **La lista de Candidatos LINE son líneas globales** (`"A"`, `"B"`, `"Proyección"` sin división ni temporada).
  4. **Sin contexto de competencia en el evento** más allá del texto libre `competition` (comparado por **nombre** entre un id y un nombre: `events.tsx:1235-1239`).
  5. **Sin `ExternalReference` como entidad**: es un `string`.
  6. **Sin `ReferenceAdmissionFence`** observable (§16: `EndCompetitionEntry` vs nuevo Match).
  7. **R33 sin buscador, filtro, empty state ni conteo** ⇒ con 0 Asideñas la `Surface` queda vacía sin texto.
  8. **Sin toast** en "Activar competencia" ni "Activar inscripción" (los demás sí lo tienen) ⇒ inconsistencia de feedback.
- **ROLE:** COACH lectura ✓ (§5 "lectura"); SUBCOMMITTEE lectura + escritura ✓; **ADMIN §5 le concede ✓ pero `/more` no le da entrada** (llega por `/management`).
- **MOBILE:** `s`.
- **FALTANTE PARA SER COMPLETO:** PG-04 (desdoblar `teamId`/`lineId` + `seasonId` derivado); `COMPETITION_SCOPE_MISMATCH`; candidatos LINE con división+temporada; `ExternalReference` con target whitelist (§26); empty/búsqueda/filtro en la lista; toasts faltantes; entrada de ADMIN en `/more`.

---

# F21 — DIRECT CONVERSATION — **PARTIAL**

- **ENTRY:** `/communication` → "Nueva conversación" → tab "Conversaciones".
- **PASOS QUE EXISTEN:** elegir tipo → buscar persona → seleccionar → "Crear conversación" → **detección de par DIRECT existente** → panel inline "Ya tenés una conversación con X." + "Abrir conversación" → si no existe, se crea → `/conversations/:id` → enviar → editar (modal) → eliminar (tombstone ✓ §9).
- **PASOS QUE FALTAN:**
  1. **Detección sólo post-click.** El Blueprint §6 sitúa la detección en INLINE; hoy el usuario elige, pulsa "Crear" y recién ahí aparece el panel. La prevention en la fila sería el lugar natural.
  2. **Lógica duplicada:** la UI **no usa `findOrOpenDirect`** (`store.tsx:318-343`, con `directPairKey` canónico no ordenado). Dos implementaciones de la misma regla §20 ⇒ la que está en producción es la menos canónica.
  3. **"Eliminar mensaje" sin confirmación** — borrado en el acto + toast, irreversible, sin deshacer. Blueprint §6 lista "eliminar mensaje" como MODAL.
  4. **Sin estado "enviando"/"enviado"/"falló"**: `CheckCheck` se dibuja **incondicionalmente** en todo mensaje propio ⇒ *fake success*.
  5. **Sin preview de actualización** (el encargo lo lista; §59 define refetch del mensaje exacto).
  6. **Sin el paso de "resumen"** que el Blueprint define (`tipo→buscar→resumen→crear`); hay un contador, no un resumen.
  7. **Sin TEAM/EVENT** (sólo 2 de 4 tipos) y `kind: type as "DIRECT"|"GROUP"` es un cast no verificado.
  8. **Secuencia de `unshift` vs `push` contradictoria** entre `store.tsx:333` y `communication.tsx:225` ⇒ la posición de una conversación nueva depende de la ruta de creación.
- **ROLE:** candidatos filtrados por `person.role`/`person.team` (S4-04) ⇒ **ninguna conversación entre divisiones es creable**; §20 no lo exige, pero el filtro es un artefacto del modelo legacy, no una decisión.
- **PROPAGATION:** ✓ el `unread` del chat actualiza el badge del sidebar (mismo `state`).
- **HISTORY:** mensaje `EDITED` marcado ✓; `DELETED` como tombstone ✓ (§9).
- **MOBILE:** `s` — "Crear conversación" muy por debajo del fold, no sticky.
- **FALTANTE PARA SER COMPLETO:** detección en la fila con `findOrOpenDirect`; confirmación de borrado; estados de envío; TEAM/EVENT; resumen; unificar `unshift`.

---

# F22 — GROUP CONVERSATION — **MISSING**

- **ENTRY:** mismo, con tipo "Grupo".
- **PASOS QUE EXISTEN:** elegir grupo → nombre (required ✓ §20) → seleccionar ≥2 → crear → enviar.
- **PASOS QUE FALTAN:**
  1. **Sin `ACTIVE → ARCHIVED`** (§9). El modelo `Conversation` **no tiene campo `state`** ⇒ el lifecycle es **irrepresentable**.
  2. **Sin "abandonar grupo"** ni "salir" — §20 exige `left_at` con período autorizado; sin `state` no hay forma de salir.
  3. **Sin gestión de participantes** (sincronización server-side, `joined_at`/`left_at`, "sin acceso a historia anterior").
  4. **Sin los 3 estados que el §5 del encargo exige**: LEAK de historial, EMPTY (0 mensajes), RECOVERY (grupo vacío o inaccesible).
  5. **Sin overflow por fila** en la lista (silenciar/archivar).
  6. **Título de grupo sin límite ni longitud mínima** visible; sin contador de participantes selected más allá del número.
- **ROLE:**–. **HISTORY:** la del grupo, sin estado ni participantes. **MOBILE:** `s`.
- **FALTANTE PARA SER COMPLETO:** `state` en el modelo + archivar/salir; hoja de miembros; política de `joined_at` en la UI; empty y leak de historial; overflow por fila.

---

# F23 — TEAM/EVENT CONVERSATION — **PARTIAL**

- **ENTRY:** "Conversación del equipo" / "Conversación del evento" desde la sección Comunicación de `/events/:id`; y `/conversations/:id` desde la lista.
- **PASOS QUE EXISTEN:** conversaciones canónicas `TEAM` (0..1 por Team) y `EVENT` (0..1 por Event) existen en el seed y se filtran por `participants` ✓; el header declara el tipo ✓.
- **PASOS QUE FALTAN:**
  1. **El contexto canónico no se resuelve.** `conversation.teamId` y `conversation.eventId` **no se leen nunca** en `communication.tsx`; el título es un **string de seed** ("Sexta A · Equipo", "GEI vs. CUBA · 10 oct"). Si el evento se renombra o se reprograma, el chat **miente**. La research §7.5 exige "Sexta A · Partido vs CUBA" para que nadie pregunte "¿de qué equipo es este grupo?".
  2. **Sin link al evento/equipo** desde el chat.
  3. **"Corregir participantes" no existe** (§20: membership sincronizado server-side) ⇒ **0..1 canónico no se puede mantener desde la UI**: no hay forma de ver ni de sincronizar quién pertenece.
  4. **Sin contexto persistente:** el rail de `/events/:id` y el header del chat muestran la misma etiqueta genérica pero no el mismo objeto.
  5. **Sin `CanonicalConversation` guard** para prevenir duplicados (sólo DIRECT tiene `findOrOpenDirect`).
- **ROLE:** participantes + `capabilities.chat` ✓.
- **MOBILE:** `s` — sin panel lateral de miembros en desktop (Blueprint A5 lo exige).
- **FALTANTE PARA SER COMPLETO:** resolver `teamId`/`eventId` a nombre canónico + link; pantalla de participantes sincronizados; guard de canonicidad TEAM/EVENT; panel de miembros.

---

# F24 — ANNOUNCEMENT — **CONTRADICTORY**

- **ENTRY:** `/communication` → "Nuevo comunicado" (SUBCOMMITTEE).
- **PASOS QUE EXISTEN:** título → contenido → **audiencia** → "Guardar borrador" (`DRAFT`) o "Publicar" (modal de confirmación) → `PUBLISHED` → `notify` → lectura → "Corregir" (título/cuerpo + **motivo obligatorio** + `Alert` de inmutabilidad) → `update(..., "Corregir comunicado", title, reason)` con motivo al audit ✓ (§21) → "Archivar comunicado" (**con modal de consecuencias ✓**).
- **PASOS QUE FALTAN:**
  1. **La audiencia NO es control de acceso.** `CommunicationHome` filtra sólo por `state`; `AnnouncementDetail` sólo por `state === "DRAFT" && !official`. Un comunicado con `audience: "Sexta A"` es legible por ADMIN, SUBCOMMITTEE, el guardian y **cualquiera por URL** ⇒ viola §21 y §6.
  2. **La audiencia no es `TEAM_SET`.** Es un `string`: `"Todo hockey" | "Sexta A" | "Quinta A + Sexta A"`. §21 exige que "'Line A' de UI se resuelve a TEAM_SET" — **imposible** con este modelo. El multi-equipo es concatenación de texto.
  3. **No hay snapshot de destinatarios** (§21 "Published audience snapshot immutable"): lo inmutable es un texto, no un conjunto ⇒ la inmutabilidad no protege nada observable.
  4. **Publicar notifica a TODAS las personas.** `notify()` (`store.tsx:161-183`) sólo acota recipients cuando la route es `/events/*`; para `/announcements/:id` cae al fallback `state.people.map(...)` ⇒ un comunicado de Sexta A notifica a guardians, ADMIN y otras divisiones. Viola §21/§22.
  5. **Sin "Entendido" / acuse.** R24 tiene **0 acciones primarias**. `Announcement` no tiene `readBy`/`ack` ⇒ "Comunicados nuevos" es **irrepresentable** y §4 L0 no se cumple.
  6. **La corrección no tiene diff, ni `revision++`, ni notificación.** §21 exige motivo + Audit ✓ (cumple), el Blueprint exige diff + impacto (no cumple).
  7. **La regla bloqueante se muestra con `tone="info"`** (azul de marca) en vez de `warning` ⇒ una restricción se lee como información.
  8. **El `Select` deshabilitado no tiene affordancia visual** (`ui.tsx:233` sin `disabled:bg-muted`, contra `TextField:217`).
  9. **Orden de campos invertido** respecto del Blueprint: "SITUACIÓN audiencia → ACCIÓN Publicar → INFORMACIÓN cuerpo"; hoy es Título → Contenido → **Audiencia**.
  10. **Corolario verificado:** `events.tsx:96-98` resuelve la audiencia por `audience.includes(teamName)` ⇒ `"Todo hockey".includes("Sexta A") === false` ⇒ **un comunicado club-wide no aparece en el detalle de ningún evento**.
- **ROLE:** sólo SUBCOMMITTEE publica ✓ (§5). ADMIN no tiene `Announcement official` ✓ correcto.
- **HISTORY:** `audit` con motivo ✓; sin `revision`, sin diff, sin historial en la pantalla.
- **MOBILE:** `s` — primaria no sticky, bajo el fold.
- **FALTANTE PARA SER COMPLETO:** `TEAM_SET` + filtro de acceso por audiencia (UX-16); `readBy` + "Entendido"; snapshot de destinatarios; `notify` acotado a la audiencia; diff + `revision` en corrección; `warning` en la regla bloqueante; orden de campos; `ExternalReference`-style target whitelist.

---

# F25 — NOTIFICATIONS — **PARTIAL**

- **ENTRY:** punto azul en el header → `/notifications`.
- **PASOS QUE EXISTEN:** creación (`notify` → `unshift` con `date: "Ahora"`) → `read: false` → punto azul en el header ✓ → badge en sidebar ✓ → lista → tap **marca leído y navega** al origen canónico (`/events/match-cuba`, `/announcements/a1`) ✓ → "Marcar todas como leídas" ✓ con `disabled` correcto → filtros "Todas"/"Sin leer" ✓ → empty state's copy correcto ✓ ("Estás al día").
- **PASOS QUE FALTAN:**
  1. **`type` §22 poblado pero NUNCA renderizado.** `Notice.type` existe y el seed lo carga (`EVENT_RESCHEDULED`, `ANNOUNCEMENT_PUBLISHED`, `SELECTION_PUBLISHED`), pero `communication.tsx` no lo lee ⇒ **7 tipos §22 son visualmente idénticos** (mismo `Bell` en el mismo cuadrado). Un aviso de reprogramación y uno de comunicado son indistinguibles.
  2. **Sin orden "no leídos accionables primero"**: el orden es el del array; leídos y no leídos quedan intercalados.
  3. **Sin "marcar leído sin salir"**: el tap siempre navega ⇒ no hay forma de limpiar la lista sin abandonar la vista.
  4. **Sin agrupación por tipo** ni por origen.
  5. **5 codificaciones de no-leído distintas** en el producto (badge 8 px, badge 10 px, dot 1.5 px, dot 2 px, tint de fila), **0 con etiqueta de texto**.
  6. **Fechas relativas estáticas**: el seed usa "Hace 1 hora"/"Ayer"; las nuevas usan "Ahora" ⇒ no hay unrelativización al abrir la lista.
  7. **Copy con razonamiento interno:** "Sin lista de registros: sólo lo que requiere mirar." — habla del diseño, no al usuario.
  8. **Líneas de ~1370 px** en desktop sin `max-w` ni clamp.
  9. **Gating de lectura presente** ✓ (`canReadNotice` + `recipients`) — bien.
- **MOBILE:** `s` — `p-5` + `gap-4` con `pb-28`; filas de ~350 px con holgura excesiva.
- **FALTANTE PARA SER COMPLETO:** renderizar `type` en lenguaje usuario; orden no-leídos primero; "marcar leído" sin navegar; agrupación; una sola codificación de no-leído con etiqueta; unrelativizar fechas; copy de usuario; `max-w` de lectura.

---

# F26 — SEARCH — **PARTIAL**

- **ENTRY:** link "Buscar en GEI" del header, o **⌘K / Ctrl+K** ✓ (implementado y funcional).
- **PASOS QUE EXISTEN:** query → resultados → abrir destino → volver.
- **PASOS QUE FALTAN:**
  1. **La query NO está en la URL.** `useSearchParams` = **0** en todo `src/` ⇒ Back **no preserva la query** (viola §24 "browser Back preserva origen" y Blueprint §2.6), no hay deep link, no hay "compartir búsqueda".
  2. **"Todas" no tiene reset**: no hay forma de volver al estado inicial sin recargar.
  3. **Alcance sin explicar**: la descripción dice "personas, equipos y eventos dentro de tu alcance" pero no indica cuál es el alcance ni por qué un resultado no aparece.
  4. **Empty state sin next step**: "¿Qué estás buscando? / Escribí un nombre, un equipo o un rival…" no ofrece ejemplos clicables ni explica el alcance.
  5. **Sin resultados differentiates** de "sin query": con query y 0 hits, el copy debe cambiar.
  6. **Ruido de labels:** el header dice "Buscar en GEI" y el `h1` de la página dice "Buscar en GEI" — misma etiqueta a 40 px.
  7. **¿Search está resolviendo mala IA?** Parcialmente sí: `/teams` (índice de 1 fila), `/management/people` (con filtros) y `/calendar` (con filtro por equipo) sonurfaces de búsqueda sin query en URL; F26 no es el único problema.
- **MOBILE:** `s` — campo full width ✓.
- **FALTANTE PARA SER COMPLETO:** query + filtros en la URL; reset; alcance explícito; empty differentiated; ejemplos; eliminar la label duplicada.

---

# F27 — REPORTS — **PARTIAL**

- **ENTRY:** `/more → Reportes` (COACH/SUBCOMMITTEE) → "Asistencia" / "Rendimiento".
- **PASOS QUE EXISTEN:** filtros con **defaults correctos** (Mi equipo + Toda la temporada) ✓ (§ A9 "filtros con defaults") → tabla con `tabular-nums` ✓ → pie que explica el período y la convención de "sin registros" ✓ → filtro "Jugadora" con "Mis registros" para PLAYER ✓ (§5 "propio/autorizado").
- **PASOS QUE FALTAN:**
  1. **Sin empty ≠ zero ≠ error.** Con 0 filas, la `Surface` muestra **sólo el `thead`** ⇒ el usuario ve una tabla con encabezados y ningún cuerpo, más un pie con "0 planillas".
  2. **"% PRESENCIA" con 0 % donde no hay dato.** 6 jugadoras con 2 planillas sin registrar muestran `0%`, y el pie afirma "Sin registros no se interpreta como cero actividad histórica" ⇒ **el número contradice la nota** (UX-43). Debería ser "—" (el código ya usa "—" cuando `events.length === 0`, pero no cuando hay eventos sin fila).
  3. **Sin link al origen.** A9 exige "links a origen para actuar"; las celdas son texto plano ⇒ desde un 50 % no se llega a la planilla ni a la persona.
  4. **Filtros no persistidos** en la URL y **sin reset**.
  5. **Período con literales** ("Septiembre 2026", "Octubre 2026") que dejan de ser correctos al pasar el tiempo.
  6. **6 de 6 tablas sin `<th>`**; `min-w-[560px]` con `overflow-x-auto` ⇒ scroll horizontal en mobile sin señal de que la tabla continúa.
  7. **Densidad:** 18 filas × 6 columnas en 1300 px; `% PRESENCIA` alineado a la derecha sin jerarquía.
  8. **Sin p95/progreso** (A9 "p95 <3s"); el skeleton global del Shell es la única señal.
- **ROLE:** PLAYER ve sólo sus propios registros ✓ (verificado en código: `actor.role !== "PLAYER" || item.id === actor.id`); pero usa `item.team`/`item.role` legacy (S4-04).
- **HISTORY:**–. **MOBILE:** `s`.
- **FALTANTE PARA SER COMPLETO:** empty real; "—" en vez de 0 %; links al origen; filtros en URL + reset; períodos derivados; `<th>`; señal de scroll; densidad.

---

# F28 — AUDIT — **MISSING**

- **ENTRY:** `/management → Auditoría` o `/more → Auditoría` (sólo ADMIN ✓).
- **PASOS QUE EXISTEN:** 4 filtros (Actor / Recurso / Acción / Fecha) → lista cronológica → acción + actor·recurso + motivo ✓ → `Empty` "Sin acciones para estos filtros" ✓ → append-only declarado en la descripción ✓.
- **PASOS QUE FALTAN (comparado con A10 "fecha — actor — acción en texto — recurso (link)"):**
  1. **Sin before/after.** `AuditEntry` no tiene campos de diff; el Blueprint A10 y el encargo §F28 los exigen. El detalle existe en `attendanceHistory`/`recordHistory` pero **no se muestra** ⇒ el rastro real está escrito y oculto.
  2. **Sin source.** No hay de dónde vino el cambio.
  3. **Sin link al objeto relacionado.** El recurso es texto plano ⇒ no hay "objeto relacionado" navegable.
  4. **El filtro de fecha está roto para 24 de 365 días.** `<input type="date">` cuyo valor se contrasta contra tres literales (`2026-10-02`, `2026-10-01`, `2026-09-28`) ⇒ cualquier otra fecha devuelve 0 resultados **sin explicación**.
  5. **Viaje en el tiempo:** toda entrada nueva recibe `date: "02 oct 2026 · Ahora"` (`store.tsx:131`) mientras la UI usa reloj real ⇒ el historial dice "Ahora" con fecha de hace días.
  6. **Sin orden explícito** (depende del `unshift`).
  7. **Sin redacción** (§6 "Audit sensitive data: ADMIN con redacción"): el `reason` libre se muestra sin redacción.
  8. **Sin densidad A10:** las acciones más frecuentes ("Registrar asistencia", `before_after_label` constante) **no distinguen qué cambió** ⇒ el registro de 15 marcajes consecutivos dice 15 veces lo mismo.
- **ROL:** sólo ADMIN ✓ correcto. **MOBILE:** `s`.
- **FALTANTE PARA SER COMPLETO:** `before`/`after` en `AuditEntry` (o link a `attendanceHistory`/`recordHistory`); `source`; recurso como link; filtro de fecha por rango; fecha real; redacción; action label específico.

---

# F29 — ROLE CHANGE — **CONTRADICTORY**

- **ENTRY:** `/management/people/:id` → "Roles y alcance" → select + "Asignar rol" → modal con motivo → "Confirmar cambio".
- **PASOS QUE EXISTEN:** asignar rol → escribe `RoleAssignment` con `scope` derivado del equipo de destino (TEAM para entrenador/capitana, CLUB para administración/subcomisión) ✓ → audit con motivo ✓ → **la UI de autoridad cambia de verdad**: `capabilities.*` se recalcula ⇒ el nav de `/more` cambia, "Crear evento" aparece/desaparece, "Conversaciones" se oculta, `/management/*` se niega ✓. **Verificado en runtime en las 5 variantes de rol.** El helper "Los roles vigentes se combinan. Administración no incluye autoridad deportiva…" es el mejor texto de autoridad del producto ✓.
- **PASOS QUE FALTAN:**
  1. **Stale legacy role.** `person.role` sigue existiendo y **sigue alimentando selectores de UI** (S4-04): `overview.tsx:167` (chip de rol), `participation.tsx:134` (cobertura de roster), `communication.tsx:196-198` (candidatos), `account-insight.tsx:593,642` (reports), `store.tsx:167` (`notify`). Una jugadora asignada a un segundo equipo sigue mostrando el `person.team` viejo; un guardián con `role: "PLAYER"` en el seed aparece como Jugadora en la lista de ADMIN.
  2. **Sin effect de cierre** ("no stale legacy role" en el encargo): no hay ninguna normalización que elimine el selector legacy.
  3. **Sin historial de roles**: no se ve un `RoleAssignment` terminado.
  4. **Sin `422 INVALID_ROLE_SCOPE`** visible: el helper explica la regla pero la validación no es surfaced (sólo el caso CAPTAIN↔equipo, `:561-570`).
  5. **Default peligroso:** el select "Rol a asignar" abre en **"Entrenador"** (primera opción) ⇒ un clic sin tocar el select **asigna COACH**.
  6. **Botón "Confirmar cambio"** para 10 operaciones distintas ⇒ el verbo no hace eco (§5).
- **ROL:**–. **MOBILE:** `s`.
- **FALTANTE PARA SER COMPLETO:** eliminar `person.role`/`person.team` como selector (S4-04, ya priorizado P1); historial de assignments; `INVALID_ROLE_SCOPE` visible; select sin default peligroso; verbos por operación.

---

# F30 — COMMUNICATION HOME — **PARTIAL**

- **ENTRY:** tab "Comunicación" (desktop sidebar / mobile bottom nav). Oculto para el guardian ✓.
- **PASOS QUE EXISTEN:** tabs (Todo/Comunicados/Conversaciones) → dos secciones simultáneas → tap en un comunicado (`/announcements/:id`) o una conversación (`/conversations/:id`) → volver.
- **PASOS QUE FALTAN:**
  1. **Sin priorización.** **0 `.sort()`** en el archivo ⇒ el orden es el del seed (`unshift` al crear). Que el no-leído salga primero hoy es **coincidencia de seed**, no regla. **S4-05 confirmado.**
  2. **Sin filtro por tipo** dentro de la lista (sólo el tab) — S4-05 confirmado.
  3. **Separación de canales insuficiente.** Estructural sí (2 columnas a `xl` + secciones) ✓; perceptualmente **no**: mismo `Surface`, mismo radio, mismo icono de 40 px, misma gramática de fila, mismo chevron. Lo único que cambia es el encabezado y el icono (megáfono vs avatar). Blueprint §3 exige "espacio: Comunicados separados de Mensajes" como herramienta de atención ⇒ **no se cumple**. **S4-05 confirmado, prioridad rebajada a P3** porque la estructura existe.
  4. **Comunicados sin no-leído.** No hay `readBy` ⇒ "Comunicados nuevos" es irrepresentable. Con asymmetry: las conversaciones tienen badge, los comunicados — que son la vía de autoridad oficial — no tienen ningún estado.
  5. **Sin CTA por tab.** En el tab "Comunicados" el header ofrece "Nueva conversación" y viceversa.
  6. **Tab no preservado** (`useState` local) ⇒ volver de un hijo resetea a "Todo".
  7. **Empty de comunicados ausente** ⇒ `Surface` de altura 0 (el de conversaciones sí tiene `Empty`, con copy que **implica acción pero sin botón**).
  8. **Comunicados DRAFT visibles para SUBCOMMITTEE** mezclados con los publicados, sin sección propia (aunque el `Badge` "Borrador" sea correcto ✓).
  9. **Copy que anuncia capacidad inexistente**: "Comunicados oficiales y **conversaciones de tu equipo**" se muestra también a quien no puede conversar (SUBCOMMITTEE/ADMIN) ⇒ §24 "unauthorized oculto".
  10. **Deep link sin guard:** `/communication` y `/announcements/:id` no validan audiencia ⇒ cualquiera con la URL lee comunicados de otra división.
  11. **Volumen vacío a 1440 px:** ~900 px de espacio bajo las dos cards.
- **ROLE:** gating verificado ✓ en las 3 variantes (coach con 3+3 filas, player con 2+3, subcom sin conversaciones).
- **MOBILE:** `s` — 1 columna; `RowLink` con preview de mensaje sin `truncate`/`line-clamp` ⇒ líneas de ~600 px en desktop.
- **FALTANTE PARA SER COMPLETO:** ordenar por no-leídos; filtro por tipo; separación perceptual real; `readBy` en comunicados; CTA por tab; tab en URL; empty de comunicados; copy por rol; guard de audiencia en el deep link.

---

# 30. TABLA RESUMEN

| Flow | Nombre | STATUS | Hallazgo que decide el status |
|---|---|---|---|
| F01 | Account activation | **CONTRADICTORY** | El código de activación no existe en el sistema (fake success) |
| F02 | Profile / account | **PARTIAL** | Faltan estado de cuenta, roles/alcance, Membership, seguridad, delegación gestionable |
| F03 | Guardian | **MISSING** | No puede responder disponibilidad; selector de menor inerte; alcance = 1 evento |
| F04 | Home attention | **PARTIAL** | Sin orden de urgencia, ítems no accionables, "Hoy" vacío, chip "0 pendientes" |
| F05 | Calendar | **MISSING** | Sin ¿Vas?, sin sheet, sin panel, sin URL ⇒ F05 no llega a §5 |
| F06 | Event create | **PARTIAL** | Validación monolítica sin campo; sin recurrencia en create |
| F07 | Event edit non-material | **MISSING** | El campo Título no existe en edición ⇒ rama non-material inalcanzable |
| F08 | Event material change | **PARTIAL** | Impact Preview fabricado; recovery destruye draft; `IMPACT_CHANGED` sin efecto |
| F09 | Event series | **MISSING** | El alcance elegido no se aplica: 1 evento mutado de 2 |
| F10 | Event lifecycle | **CONTRADICTORY** | `ABANDONED` inalcanzable; el acta fija estados que el evento no tiene; terminales sin consecuencia |
| F11 | Availability | **PARTIAL** | Dos gramáticas; conteo "0 sí"; sin recovery por fila; copy optimista |
| F12 | Selection | **PARTIAL** | Sin estado `CONFLICT`, sin diff de revisiones, sin `hasCurrentConflicts` |
| F13 | Attendance | **PARTIAL** | Historial invisible; UNRECORDED no terminal; botones de 36 px |
| F14 | Match record | **PARTIAL** | Historial invisible; editable con evento SCHEDULED |
| F15 | Jornada | **PARTIAL** | Bulk sólo de sede, sin `expectedVersion`, conteo hardcodeado |
| F16 | Team | **PARTIAL** | Sin acción primaria, resultados sin link, tabs sin URL |
| F17 | Person normal | **COMPLETE** | Flujo de lectura pura; cumple §5 por exclusión |
| F18 | People admin | **MISSING** | 2 de 9 pasos no existen; identidad read-only; sin auditoría en pantalla |
| F19 | Structure | **PARTIAL** | Sin restore; estado "Activo" inventado; "creá un nuevo equipo" imposible |
| F20 | Competition | **MISSING** | LINE scope no expresable; sin `COMPETITION_SCOPE_MISMATCH` |
| F21 | Direct conversation | **PARTIAL** | Detección post-click con lógica duplicada; borrado sin confirmar |
| F22 | Group conversation | **MISSING** | El lifecycle `ACTIVE→ARCHIVED` es irrepresentable |
| F23 | Team/event conversation | **PARTIAL** | Contexto canónico sin resolver; participantes no gestionables |
| F24 | Announcement | **MISSING** | La audiencia no es control de acceso; sin acuse; notifica a todos |
| F25 | Notifications | **PARTIAL** | `type` §22 sin renderizar; sin orden; "marcar leído" navega |
| F26 | Search | **PARTIAL** | Query fuera de la URL ⇒ Back no preserva |
| F27 | Reports | **PARTIAL** | 0 % donde no hay dato; sin links al origen; sin empty |
| F28 | Audit | **MISSING** | Sin before/after, sin source, sin link; filtro de fecha roto |
| F29 | Role change | **CONTRADICTORY** | La UI de autoridad cambia bien, pero `person.role` deja verdad stale |
| F30 | Communication home | **PARTIAL** | Sin ordenar, sin filtro, separación perceptual insuficiente |

| Totales | |
|---|---|
| COMPLETE | **1** |
| PARTIAL | **17** |
| MISSING | **8** |
| CONTRADICTORY | **4** |
| **TOTAL** | **30** |