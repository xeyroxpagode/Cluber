# GEI HOCKEY MANAGEMENT SYSTEM
## ACTIVITY DIAGRAM RECONSTRUCTION AUDIT V1

**Etapa:** 7 — Diagramas de actividad
**Artefacto:** E7-01 · Auditoría previa de los 102 casos de uso
**Rama:** `gei/e7-activity-diagrams-freeze-v1`
**Baseline E6:** `b910d5c38107ca99ddb32b3c961dd01201345f53` (`gei/e6-state-diagrams-freeze-v1`, FROZEN · PASS)
**Fecha:** 2026-10-08
**Resultado de la auditoría:** **PASS** — 0 hallazgos bloqueantes

---

# 1. PROPÓSITO Y ALCANCE

Esta auditoría evalúa la totalidad de los **102 casos de uso** canónicos del inventario E3 para decidir cuáles procesos funcionales requieren un **diagrama de actividad UML** en E7. No genera diagramas: fija la evidencia y la clasificación sobre la que se construyen E7-02 (selección), E7-03 (contratos) y E7-04 (generación).

La unidad de diagramación es el **proceso funcional**, no el CU ni la pantalla. E5 define qué sucede dentro de los CU; E6 define qué estados y transiciones son válidos; E7 debe representar **cómo se desarrolla un proceso en el tiempo**.

# 2. BASELINE Y PREFLIGHT VERIFICADOS

| Verificación | Resultado |
|---|---|
| Rama base | `gei/e6-state-diagrams-freeze-v1` |
| SHA | `b910d5c38107ca99ddb32b3c961dd01201345f53` (coincide con el esperado) |
| `git status --short` | Limpio (0 cambios preexistentes) |
| E6 freeze | `docs/uml/states/GEI_STATE_DIAGRAM_FREEZE_V1.md` — **FROZEN · PASS** |
| `pnpm typecheck` | PASS (exit 0) |
| `pnpm test` | PASS — **92/92** tests |
| `pnpm build` | PASS (exit 0) |
| Rama E7 creada | `gei/e7-activity-diagrams-freeze-v1` desde la punta verificada de E6 |

# 3. AUTORIDADES UTILIZADAS

| Documento | Versión | Estado |
|---|---|---|
| `GEI_REQUIREMENTS_FREEZE_V1.md` / `GEI_REQUIREMENTS_CATALOG_V1.md` | V1 | FROZEN |
| `GEI_ACTOR_MODEL_FREEZE_V1.md` / `GEI_ACTOR_AUTHORITY_BOUNDARY_MATRIX_V1.md` | V1 | FROZEN |
| `GEI_MASTER_USE_CASE_INVENTORY_FREEZE_V1.md` / `GEI_MASTER_USE_CASE_CATALOG_V1.md` | V1 | FROZEN |
| `GEI_USE_CASE_DIAGRAM_FREEZE_V1_0_1.md` | V1.0.1 | FROZEN |
| `GEI_USE_CASE_SPECIFICATION_FREEZE_V1.md` + 8 `GEI_UC_SPEC_<DOMAIN>_V1.md` | V1 | FROZEN |
| `GEI_STATE_DIAGRAM_FREEZE_V1.md` + Catálogo + Matriz de transiciones + Trazabilidad E6 | V1 | FROZEN |
| `GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` | v1.0.1 | FROZEN (manda sobre todo) |

`src/**` se trató únicamente como evidencia histórica. **Ninguna actividad se derivó de las pantallas del prototipo.**

# 4. REFERENCIA ACADÉMICA

**`Diagrama de Actividad (1).pdf` — NO localizado en el workspace** (búsqueda recursiva de `*.pdf`: 0 coincidencias fuera de los export E4/E6). Registrada su ausencia; no se inventó contenido.

Se adopta como referencia el contrato de la etapa, coherente con el material de Modelos y Sistemas 2026: diagramas de comportamiento UML que representan cronológicamente las acciones de un proceso, con la gramática: **Inicio** (círculo sólido) · **Actividad/Acción** (rectángulo redondeado, verbo) · **Flujo de control** (flecha direccional) · **Decisión** (rombo con guards) · **Merge** (reúne alternativas, no sincroniza) · **Fork/Join** (sólo concurrencia real) · **Activity Final** (termina la actividad) · **Flow Final** (termina una ruta particular) · **Swimlanes/Partitions** (responsable de cada acción, sólo cuando aporta claridad).

# 5. MÉTODO DE EVALUACIÓN

Para cada uno de los 102 CU se identificaron: ID, objetivo, actor principal y alternativos, complejidad real (pasos del camino básico y ramas alternativas E5), decisiones, rechazos, validaciones críticas, dependencias con otros CU, cambios de estado E6 (SM/TR), eventual paralelismo real y necesidad de diagrama.

**Criterios de clasificación:**

| Clasificación | Definición |
|---|---|
| `ACTIVITY_REQUIRED` | El proceso tiene decisiones reales, alternativas con consecuencias distintas, rechazos con destinos diferentes o responsabilidades múltiples que E5/E6 no comunican igual de bien en prosa. Requiere diagrama. |
| `ACTIVITY_USEFUL_NONBLOCKING` | El flujo aportaría valor pero su ausencia no degrada la verdad funcional; se documenta y queda como deuda no bloqueante. |
| `COVERED_BY_EXISTING_ACTIVITY` | El CU queda funcionalmente representado dentro de otro diagrama de E7 (proceso compuesto o guard transversal), sin diagrama propio. |
| `SIMPLE_USE_CASE_NO_DIAGRAM` | Flujo lineal (o casi) cuyo comportamiento E5 ya comunica perfectamente y cuyos guards quedan trazados en E6. |
| `NEEDS_CLARIFICATION` | Evidencia insuficiente o contradictoria; bloquearía el Freeze hasta resolverse. |

**Reglas de la auditoría:** no obligar a que todo CU tenga diagrama propio; no fusionar procesos diferentes para reducir archivos; si E5 omitiera una rama funcional esencial se registraría `ACTIVITY-FEEDBACK` en lugar de inventarla.

# 6. EVALUACIÓN POR DOMINIO (102/102)

Leyenda de columnas — **C**: complejidad `pasos/alternativas` (E5) · **AD**: diagrama que lo cubre (E7-02) · Clasificaciones abreviadas: `REQUIRED` = ACTIVITY_REQUIRED, `USEFUL` = ACTIVITY_USEFUL_NONBLOCKING, `COVERED` = COVERED_BY_EXISTING_ACTIVITY, `SIMPLE` = SIMPLE_USE_CASE_NO_DIAGRAM.

## 6.1 IAM — Identidad y acceso (10 CU)

| ID | CU | Actor | C | Decisiones / guards clave | Rechazos | E6 | Clasificación | AD |
|---|---|---|---|---|---|---|---|---|
| UC-IAM-01 | Iniciar sesión | UNAUTH | 3/3 | Credencial válida ∧ estado ACTIVE; PENDING/DISABLED; límite de intentos; sin rol ni delegación → «sin acceso» | Sin sesión; fallo sin revelar existencia del username | SM-ACCOUNT (guard de estado) | `REQUIRED` | AD-IAM-01 |
| UC-IAM-02 | Deshabilitar una cuenta | ADMIN | 4/3 | ADMIN vigente; LAST_ADMIN_REQUIRED; REAUTH (INC-01) | Valla último admin; denegación | SM-ACCOUNT TR (ACTIVE→DISABLED) | `SIMPLE` | — |
| UC-IAM-03 | Emitir un código de activación | ADMIN | 4/3 | ADMIN; cuenta PENDING/DISABLED; máx. 1 código activo; invalida el anterior; REAUTH | Estado inválido; denegación | SM-ACCOUNT (pre-tr) | `REQUIRED` | AD-IAM-02 |
| UC-IAM-04 | Activar una cuenta con código | UNAUTH | 3/3 | Código vigente un solo uso; ≤5 intentos; política de contraseñas; sin sesión tras activar | Código usado/vencido/incorrecto; política; 5 intentos → invalidación | SM-ACCOUNT TR (PENDING→ACTIVE, DISABLED→ACTIVE) | `REQUIRED` | AD-IAM-02 |
| UC-IAM-05 | Restablecer el acceso | ADMIN | 4/3 | ADMIN CLUB + valla último admin; versión de credencial++; revoca sesiones; código nuevo; REAUTH | LAST_ADMIN; denegación | SM-ACCOUNT TR (restablecer) | `COVERED` | AD-IAM-02 (nota: cola de emisión/consumo compartida) |
| UC-IAM-06 | Cambiar mi contraseña | AUTH | 4/3 | Contraseña actual; política 12–128; versión++; sin éxito falso | Actual incorrecta; política | — | `SIMPLE` | — |
| UC-IAM-07 | Consultar mis sesiones activas | AUTH | 3/1 | Sesión vigente; distingue sesión actual | Vacío explícito | — | `SIMPLE` | — |
| UC-IAM-08 | Cerrar una sesión remota | AUTH | 4/2 | Pertenencia a la cuenta; no es la sesión actual | Es la actual (UC-DECISION-02); ajena | — | `SIMPLE` | — |
| UC-IAM-09 | Reautenticar para gestión sensible | ADMIN, SUBCOMM | 3/2 | Ventana 10 min; ventana vencida ⇒ operación no se ejecuta; transversal INC-01 con 0 aristas UML | Credencial incorrecta | — | `COVERED` | Guard transversal en AD-IAM-02, AD-PPL-01, AD-PPL-02, AD-CMP-01 |
| UC-IAM-10 | Retomar el trabajo tras interrupción | AUTH | 4/2 | Idempotencia de la orden (REQ-SYS-016); conserva trabajo; reintenta sin duplicar | Confirmación no obtenible (sin éxito falso) | — | `USEFUL` | — |

## 6.2 PPL — Personas y relaciones (17 CU)

| ID | CU | Actor | C | Decisiones / guards clave | Rechazos | E6 | Clasificación | AD |
|---|---|---|---|---|---|---|---|---|
| UC-PPL-01 | Registrar una persona | ADMIN | 5/3 | ADMIN; nombre+apellido obligatorios; DNI único cuando existe; REAUTH | Colisión de DNI (nada creado); denegación | — | `REQUIRED` | AD-PPL-01 |
| UC-PPL-02 | Completar el perfil de una jugadora | ADMIN | 4/4 | ADMIN + TeamAssignment vigente; seis datos; qué falta | Falta dato (indica cuál); sin TeamAssignment | — | `COVERED` | AD-PPL-02 (rechazo PLAYER_PROFILE_INCOMPLETE; SIBLING documentado) |
| UC-PPL-03 | Vincular una cuenta a una persona | ADMIN | 5/3 | ADMIN; Person↔Account 1:1; cuenta no vinculada; REAUTH | Conflicto de vínculo (nada cambia) | — | `REQUIRED` | AD-PPL-01 |
| UC-PPL-04 | Registrar una membresía | ADMIN | 4/3 | ADMIN; persona existe; período [valid_from, valid_until) | Persona inexistente | Membership (temporal) | `REQUIRED` | AD-PPL-01 |
| UC-PPL-05 | Finalizar una membresía | ADMIN | 4/3 | ADMIN; valla de dependencias activas (nombra la dependencia) | Dependencia activa (período se conserva) | Membership (temporal) | `USEFUL` | — |
| UC-PPL-06 | Incorporar una jugadora a un equipo | ADMIN | 4/4 | ADMIN + membresía + combinación única; TeamAssignment+PLAYER atómicos; REAUTH | Perfil incompleto; sin membresía | TeamAssignment/RoleAssignment | `REQUIRED` | AD-PPL-02 |
| UC-PPL-07 | Cambiar de equipo a una jugadora | ADMIN | 4/3 | Valida destino; cierra con fecha origen; crea en destino; CAPTAIN no se transfiere | Destino sin combinación | TeamAssignment/RoleAssignment | `REQUIRED` | AD-PPL-02 |
| UC-PPL-08 | Retirar a una jugadora del equipo | ADMIN | 4/3 | Cierra TeamAssignment + PLAYER + CAPTAIN si existía; no finaliza membresía | TeamAssignment no vigente | TeamAssignment/RoleAssignment | `REQUIRED` | AD-PPL-02 |
| UC-PPL-09 | Asignar un rol con alcance | ADMIN | 4/4 | Tabla de alcances válidos (INVALID_ROLE_SCOPE); membresía vigente; REAUTH | Combinación inválida; sin membresía | RoleAssignment | `USEFUL` | — |
| UC-PPL-10 | Finalizar un rol asignado | ADMIN | 4/4 | Rol vigente; LAST_ADMIN_REQUIRED; dependencia activa | Valla último admin; dependencia | RoleAssignment | `USEFUL` | — |
| UC-PPL-11 | Registrar representación | ADMIN | 4/3 | Sujeto siempre menor; identidad del adulto; flags independientes por relación; REAUTH | Sujeto no menor | GuardianRelationship (temporal) | `USEFUL` | — (su efecto operativo se representa en AD-PRT-01) |
| UC-PPL-12 | Finalizar representación | ADMIN | 4/3 | Relación vigente; deja de conceder acceso; período se conserva | No vigente | GuardianRelationship | `SIMPLE` | — |
| UC-PPL-13 | Consultar información del menor | GUARDIAN | 3/3 | Relación vigente + can_view_child_info; PII lista cerrada | Relación finalizada; sin flag; menor ajeno | — | `SIMPLE` | — |
| UC-PPL-14 | Consultar quién actúa por mi cuenta | PLAYER, GUARDIAN | 3/2 | Sólo lectura; relaciones vigentes | Vacío explícito | — | `SIMPLE` | — |
| UC-PPL-15 | Conocer qué falta en mi perfil | PLAYER | 3/2 | Field authority: el club administra el dato; camino = avisar a administración | Intento de editar dato del club | — | `SIMPLE` | — |
| UC-PPL-16 | Consultar mi perfil | AUTH | 3/1 | Sesión; conmutador de menor (proyección, no actor) | — | — | `SIMPLE` | — |
| UC-PPL-17 | Editar mi contacto | AUTH | 4/1 | Sesión; propio; guardián edita lo suyo, no lo del menor | Dato inválido (preserva ingresado) | — | `SIMPLE` | — |

## 6.3 STR — Estructura del club (15 CU)

Todos los CU de STR son flujo administrativo lineal del patrón: *solicitar → validar ADMIN → proporcionar dato → registrar/actualizar*, con tres guards recurrentes ya trazados en E6: **valla de dependencias** (REQ-STR-006, rechazo nombrando la dependencia), **denegación a Subcomisión con explicación** (REQ-STR-009) y **REAUTH (INC-01)**. Los ciclos de vida están íntegramente dibujados en `SM-TEAM-01`, `SM-DIVISION-01`, `SM-LINE-01`, `SM-VENUE-01`.

| ID | CU | C | Guard distintivo | E6 | Clasificación | AD |
|---|---|---|---|---|---|---|
| UC-STR-01 | Registrar temporada | 4/3 | Sin ciclo de estado; refs por identidad | Season NO_SM | `SIMPLE` | — |
| UC-STR-02 | Actualizar temporada | 4/3 | No reatribuye etiqueta de equipos | Season NO_SM | `SIMPLE` | — |
| UC-STR-03 | Registrar división | 4/3 | — | SM-DIVISION (creación→ACTIVE) | `SIMPLE` | — |
| UC-STR-04 | Actualizar división | 4/4 | Rename con equipos activos se rechaza | SM-DIVISION (rename) | `SIMPLE` | — |
| UC-STR-05 | Archivar división | 4/4 | Valla de dependencias | SM-DIVISION (ACTIVE→ARCHIVED) | `SIMPLE` | — |
| UC-STR-06 | Registrar línea | 4/4 | División padre existe | SM-LINE (creación→ACTIVE) | `SIMPLE` | — |
| UC-STR-07 | Actualizar línea | 4/4 | Rename con equipos activos se rechaza | SM-LINE (rename) | `SIMPLE` | — |
| UC-STR-08 | Archivar línea | 4/4 | Valla de dependencias | SM-LINE (ACTIVE→ARCHIVED) | `SIMPLE` | — |
| UC-STR-09 | Registrar equipo | 5/4 | Combinación temporada+división+línea única; nace DRAFT | SM-TEAM (creación→DRAFT) | `SIMPLE` | — |
| UC-STR-10 | Actualizar equipo | 5/5 | No ARCHIVED; no cambia combinación | SM-TEAM | `SIMPLE` | — |
| UC-STR-11 | Activar equipo | 4/4 | Sólo desde DRAFT | SM-TEAM (DRAFT→ACTIVE) | `SIMPLE` | — |
| UC-STR-12 | Archivar equipo | 4/4 | Valla de dependencias; REJ-06 | SM-TEAM (ACTIVE→ARCHIVED) | `SIMPLE` | — |
| UC-STR-13 | Registrar sede | 4/3 | — | SM-VENUE (creación→ACTIVE) | `SIMPLE` | — |
| UC-STR-14 | Corregir sede | 4/2 | Regla A: sin efectos de coordinación | SM-VENUE (corrección) | `SIMPLE` | — |
| UC-STR-15 | Archivar sede | 4/4 | Valla de dependencias | SM-VENUE (ACTIVE→ARCHIVED) | `SIMPLE` | — |

**Decisión de dominio:** STR produce **0 diagramas de actividad**, justificado: ningún CU de STR supera 5 pasos ni presenta bifurcaciones con consecuencias divergentes; su complejidad es de guards, ya dibujados en E6.

## 6.4 EVT — Eventos (19 CU)

| ID | CU | Actor | C | Decisiones / guards clave | Rechazos | E6 | Clasificación | AD |
|---|---|---|---|---|---|---|---|---|
| UC-EVT-01 | Crear un entrenamiento | COACH, SUBCOMM | 5/3 | Listas de equipos y personas independientes, ≥1 destino; nace SCHEDULED atómico | EVENT_TARGET_INVALID; sin autoridad; invariantes | SM-EVENT TR (creación→SCHEDULED) | `REQUIRED` | AD-EVT-02 |
| UC-EVT-02 | Crear un partido | COACH, SUBCOMM | 5/4 | Exactamente un equipo destino; inscripción compatible con jornada; equipo inmutable tras SCHEDULED | EVENT_TARGET_INVALID; inscripción incompatible | SM-EVENT TR (creación→SCHEDULED) | `REQUIRED` | AD-EVT-02 |
| UC-EVT-03 | Crear evento del club | SUBCOMM, COACH | 5/3 | Todo el club (0 destinos) XOR dirigido (≥1 destino) | Marcadores contradictorios | SM-EVENT TR (creación→SCHEDULED) | `REQUIRED` | AD-EVT-02 |
| UC-EVT-04 | Editar un evento | COACH, SUBCOMM | 5/5 | ≠COMPLETED; material (REQ-EVT-011) vs no material; alcance de serie (3 opciones); STALE_VERSION | COMPLETED no se reabre; equipo de Match inmutable | SM-EVENT TR (ediciones) | `REQUIRED` | AD-EVT-01 |
| UC-EVT-05 | Posponer un evento | COACH, SUBCOMM | 5/2 | SCHEDULED; include UC-EVT-11; conserva respuestas, no acepta nuevas | Estado inválido | SM-EVENT TR (SCHEDULED→POSTPONED) | `REQUIRED` | AD-EVT-03 |
| UC-EVT-06 | Reanudar un evento | COACH, SUBCOMM | 4/3 | POSTPONED; invariantes fecha; reabre disponibilidad conservando previas | Estado inválido | SM-EVENT TR (POSTPONED→SCHEDULED) | `REQUIRED` | AD-EVT-03 |
| UC-EVT-07 | Cancelar un evento | COACH, SUBCOMM | 5/2 | SCHEDULED∨POSTPONED; include UC-EVT-11; terminal participación | Estado inválido | SM-EVENT TR (SCHEDULED/POSTPONED→CANCELLED) | `REQUIRED` | AD-EVT-03 |
| UC-EVT-08 | Restaurar un evento | COACH, SUBCOMM | 5/2 | CANCELLED; include UC-EVT-11; vuelve SCHEDULED | Estado inválido | SM-EVENT TR (CANCELLED→SCHEDULED) | `REQUIRED` | AD-EVT-03 |
| UC-EVT-09 | Completar un evento | COACH, SUBCOMM | 4/2 | Ciclo permite COMPLETED; habilita resultado PLAYED/FORFEIT | Ciclo no permite | SM-EVENT TR (IN_PROGRESS→COMPLETED) | `SIMPLE` | — (contexto en AD-PRT-04) |
| UC-EVT-10 | Abandonar un evento | COACH, SUBCOMM | 4/2 | Sólo Match; resultado ABANDONED sin estadísticas reales | Ciclo no permite | SM-EVENT TR (IN_PROGRESS→ABANDONED) | `SIMPLE` | — (contexto en AD-PRT-04) |
| UC-EVT-11 | Revisar impacto de cambio material | COACH, SUBCOMM | 4/2 | Impacto sobre conjunto real afectado (sin cifras fijas); revalida al ejecutar; IMPACT_CHANGED / IMPACT_TOKEN_EXPIRED | Confirmación rechazada; vista previa vencida | — | `REQUIRED` | AD-EVT-01 (expandido; referenciado en AD-EVT-03) |
| UC-EVT-12 | Resolver conflicto de edición concurrente | COACH, SUBCOMM | 4/2 | STALE_VERSION; base + cambios + versión vigente; reconciliación campo por campo; sin fusión automática; descarte exige confirmación explícita | Evento conserva versión del servidor | — | `REQUIRED` | AD-EVT-01 |
| UC-EVT-13 | Crear una serie | COACH, SUBCOMM | 5/3 | ≤366 ocurrencias; fechas de cada ocurrencia sin generación automática; atómico | RECURRENCE_TOO_LARGE; invariantes por ocurrencia | SM-EVENTSERIES (creación→ACTIVE) | `USEFUL` | — (edición de ocurrencias sí se diagrama: AD-EVT-01) |
| UC-EVT-14 | Finalizar una serie | COACH, SUBCOMM | 4/2 | ACTIVE; sin inversa | Estado inválido | SM-EVENTSERIES (ACTIVE→ENDED) | `SIMPLE` | — |
| UC-EVT-15 | Programar una jornada | COACH, SUBCOMM | 5/5 | ≤100 partidos; pertenencia única; temporada; inscripción compatible; atómico sin creación parcial; no duplica lifecycle de partidos | Límite de lote; temporada ajena; pertenencia; inscripción | Jornada NO_SM (contenedor atómico) | `REQUIRED` | AD-EVT-04 |
| UC-EVT-16 | Actualizar logística | COACH, SUBCOMM, CAPTAIN | 4/4 | Único CU iniciable por CAPTAIN (scope TEAM); evento no terminal; rama material extiende UC-EVT-11 | Terminal; capitana sin RoleAssignment vigente | — | `COVERED` | AD-EVT-01 (rama material; actores en swimlane) |
| UC-EVT-17 | Consultar el calendario | AUTH | 3/1 | Proyección por scope; vacío explícito | — | — | `SIMPLE` | — |
| UC-EVT-18 | Revisar lo que requiere mi atención | AUTH | 3/2 | Hasta 3 elementos con motivo/consecuencia/acción | Pendiente irresoluble no aparece | — | `SIMPLE` | — |
| UC-EVT-19 | Consultar un evento | AUTH | 3/3 | Alcance; superficies por tipo y autoridad; terminal sin respuesta de disponibilidad | Recurso no disponible (no contenido recortado) | — | `SIMPLE` | — |

## 6.5 PRT — Participación (13 CU)

| ID | CU | Actor | C | Decisiones / guards clave | Rechazos | E6 | Clasificación | AD |
|---|---|---|---|---|---|---|---|---|
| UC-PRT-01 | Responder mi disponibilidad | PLAYER, GUARDIAN | 4/6 | SCHEDULED; PLAYER+TeamAssignment+Membership ∨ GuardianRelationship.can_respond_availability; sustituye; limpia NECESITA_CONFIRMACIÓN | POSTPONED no acepta; menor no alcanzado; sin permiso; sin PLAYER | SM-AVAILABILITY TR-034/035 | `REQUIRED` | AD-PRT-01 |
| UC-PRT-02 | Preparar convocatoria | COACH | 5/4 | SCHEDULED ∧ MATCH; borrador con autosave (5 estados, una en vuelo, refresco no pisa) | No aplica por tipo; fallo de guardado reintenta sin éxito falso | SM-SELECTIONREV (creación→DRAFT) | `REQUIRED` | AD-PRT-02 |
| UC-PRT-03 | Publicar convocatoria | COACH | 5/2 | Espera lo en vuelo; revisión inmutable; conflictos derivados NO bloquean (REQ-PRT-006); notifica agregadas y quitadas | No SCHEDULED; denegación | SM-SELECTIONREV (DRAFT→PUBLISHED) | `REQUIRED` | AD-PRT-02 |
| UC-PRT-04 | Revisar conflictos | COACH | 3/2 | Deriva ELIGIBILITY_BLOCKED/PENDING, NO_LONGER_EVENT_TARGET, NO_LONGER_TEAM_AFFILIATED; coach ve estado, nunca motivo/origen | Vacío explícito | — | `COVERED` | AD-PRT-02 (conflictos derivados, visibles y explicados) |
| UC-PRT-05 | Registrar asistencia | COACH | 4/3 | SCHEDULED/IN_PROGRESS ∧ TRAINING/MATCH ∧ planilla OPEN; persistencia inmediata; UNRECORDED ≠ ABSENT | Planilla CLOSED; tipo no admite | SM-ATTENDANCEENTRY | `REQUIRED` | AD-PRT-03 |
| UC-PRT-06 | Cerrar asistencia | COACH | 4/2 | Marca de cierre; OPEN→CLOSED; sin reapertura (CON-13) | Ya CLOSED | AttendanceSheet | `REQUIRED` | AD-PRT-03 |
| UC-PRT-07 | Corregir asistencia | COACH | 4/2 | Motivo escrito obligatorio; persiste anterior/nuevo/motivo/autor/fecha; única vía con planilla CLOSED | Sin motivo (no completa) | SM-ATTENDANCEENTRY (corrección) | `REQUIRED` | AD-PRT-03 |
| UC-PRT-08 | Registrar resultado | COACH | 4/2 | MATCH ∧ ciclo compatible (PLAYED/FORFEIT⇒COMPLETED; ABANDONED⇒ABANDONED); nace DRAFT; Admin no registra | MATCH_STATE_INCOMPATIBLE | SM-MATCHRECORD (creación→DRAFT) | `REQUIRED` | AD-PRT-04 |
| UC-PRT-09 | Finalizar resultado | COACH | 4/3 | DRAFT ∧ ciclo permite; FINAL habilita estadísticas PLAYED | No DRAFT; ciclo incompatible | SM-MATCHRECORD (DRAFT→FINAL) | `REQUIRED` | AD-PRT-04 |
| UC-PRT-10 | Corregir resultado | COACH | 4/3 | Sólo sobre FINAL; motivo escrito; no retrocede ciclo de vida | Sin motivo; no FINAL | SM-MATCHRECORD (corrección) | `REQUIRED` | AD-PRT-04 |
| UC-PRT-11 | Consultar estadísticas | COACH (CAPTAIN alt.) | 3/2 | Sólo PLAYED; derivadas de participación real | ≠PLAYED: sin estadísticas reales | — | `SIMPLE` | — |
| UC-PRT-12 | Registrar restricción de habilitación | SUBCOMM, ADMIN | 4/2 | Estado/alcance/origen/motivo/vigencia; sin historia clínica; REAUTH; mutación auditada | Sin autoridad | SM-ELIGIBILITY | `USEFUL` | — (su efecto derivado en convocatoria está en AD-PRT-02) |
| UC-PRT-13 | Consultar habilitación | SUBCOMM, ADMIN, COACH | 3/2 | Coach ve sólo estado+alcance (REQ-PPL-011) | Sin alcance | SM-ELIGIBILITY (derivado) | `SIMPLE` | — |

## 6.6 COM — Comunicación (14 CU)

| ID | CU | Actor | C | Decisiones / guards clave | Rechazos | E6 | Clasificación | AD |
|---|---|---|---|---|---|---|---|---|
| UC-COM-01 | Redactar comunicado | SUBCOMM | 4/2 | Audiencia = conjunto real de equipos/club, nunca texto libre | Otro rol (incl. Admin) denegado; audiencia inválida | SM-ANNOUNCEMENT (creación→DRAFT) | `REQUIRED` | AD-COM-01 |
| UC-COM-02 | Publicar comunicado | SUBCOMM | 4/2 | DRAFT; audiencia fijada como **snapshot inmutable**; notifica con tipo distinguible | No DRAFT (queda DRAFT) | SM-ANNOUNCEMENT (DRAFT→PUBLISHED) | `REQUIRED` | AD-COM-01 |
| UC-COM-03 | Corregir comunicado publicado | SUBCOMM | 4/3 | Motivo; sólo texto; audiencia NUNCA cambia; texto anterior en historia | Sin motivo; error de audiencia ⇒ comunicado nuevo | SM-ANNOUNCEMENT (corrección) | `REQUIRED` | AD-COM-01 |
| UC-COM-04 | Archivar comunicado | SUBCOMM | 4/2 | PUBLISHED→ARCHIVED | No PUBLISHED | SM-ANNOUNCEMENT (PUBLISHED→ARCHIVED) | `REQUIRED` | AD-COM-01 |
| UC-COM-05 | Consultar comunicado | AUTH | 3/2 | Pertenencia al snapshot; fuera → recurso no disponible | Fuera de audiencia se oculta | — | `SIMPLE` | — |
| UC-COM-06 | Abrir conversación directa | AUTH c/ derecho | 3/2 | Par canónico único; abre existente | Sin derecho; candidato ilegítimo | Conversation DIRECT NO_SM | `SIMPLE` | — |
| UC-COM-07 | Crear conversación de grupo | AUTH c/ derecho | 5/2 | ≥2 participantes; título; candidatos legítimos | <2; sin título | SM-CONVERSATION-GROUP (creación→ACTIVE) | `SIMPLE` | — |
| UC-COM-08 | Abrir conversación canónica | AUTH c/ derecho | 3/2 | 0..1 por equipo/evento; título derivado; acceso temporal | Sin alcance | Conversation TEAM/EVENT NO_SM | `SIMPLE` | — |
| UC-COM-09 | Enviar mensaje | AUTH participante | 3/3 | Participación + período vigente; reintento idempotente sin duplicar | No participa; sin éxito falso | SM-MESSAGE (envío→SENT) | `SIMPLE` | — |
| UC-COM-10 | Editar mensaje propio | AUTH | 4/1 | Autoría propia; historia expuesta | Ajeno: no se ofrece | SM-MESSAGE (SENT→EDITED) | `SIMPLE` | — |
| UC-COM-11 | Eliminar mensaje propio | AUTH | 4/2 | Confirmación + motivo; tombstone irreversible | Sin confirmación: no ejecuta | SM-MESSAGE (→DELETED) | `SIMPLE` | — |
| UC-COM-12 | Archivar conversación de grupo | AUTH participante | 4/3 | Sólo GROUP ∧ ACTIVE ∧ participa | DIRECT/TEAM/EVENT no archivable | SM-CONVERSATION-GROUP (ACTIVE→ARCHIVED) | `SIMPLE` | — |
| UC-COM-13 | Consultar mis notificaciones | AUTH | 3/1 | 7 tipos; no leídas primero; lista negativa cerrada | Vacío explícito | Notification (derivado) | `SIMPLE` | — |
| UC-COM-14 | Marcar notificación como leída | AUTH | 3/2 | Suya ∧ no leída; sin salir de la lista | Ya leída (sin duplicar) | Notification (derivado) | `SIMPLE` | — |

**Decisión de dominio:** mensajería y notificaciones (COM-05..14) producen **0 diagramas**: la «complejidad real» exigida por la etapa no existe — flujos lineales con guards de participación/autoría, cuyos ciclos ya dibujó E6. El comunicado SÍ: la semántica de snapshot de audiencia con tres destinos de corrección distintos (texto corregible · audiencia ⇒ comunicado nuevo · archivo) justifica AD-COM-01.

## 6.7 CMP — Competencia (9 CU)

| ID | CU | Actor | C | Decisiones / guards clave | Rechazos | E6 | Clasificación | AD |
|---|---|---|---|---|---|---|---|---|
| UC-CMP-01 | Registrar competencia | SUBCOMM, ADMIN | 4/2 | Nace DRAFT; REAUTH | Denegación | SM-COMPETITION (creación→DRAFT) | `REQUIRED` | AD-CMP-01 |
| UC-CMP-02 | Activar competencia | SUBCOMM, ADMIN | 4/3 | DRAFT→ACTIVE; admite inscripciones | No DRAFT | SM-COMPETITION (DRAFT→ACTIVE) | `REQUIRED` | AD-CMP-01 |
| UC-CMP-03 | Cerrar competencia | SUBCOMM, ADMIN | 4/3 | **0 inscripciones activas** (rechazo explicándolas) | Inscripciones activas | SM-COMPETITION (ACTIVE→CLOSED) | `REQUIRED` | AD-CMP-01 |
| UC-CMP-04 | Inscribir equipo | SUBCOMM, ADMIN | 4/4 | Competencia ACTIVE; scope de dato TEAM (team_id) | No ACTIVE; uso incompatible | SM-COMPETITIONENTRY (creación→PENDING) | `REQUIRED` | AD-CMP-01 |
| UC-CMP-05 | Inscribir línea | SUBCOMM, ADMIN | 4/4 | ACTIVE; scope de dato LINE (div+línea+temporada); temporada válida | Ídem | SM-COMPETITIONENTRY (creación→PENDING) | `REQUIRED` | AD-CMP-01 |
| UC-CMP-06 | Activar inscripción | SUBCOMM, ADMIN | 4/3 | PENDING ∧ alcance compatible con uso previsto | COMPETITION_SCOPE_MISMATCH | SM-COMPETITIONENTRY (PENDING→ACTIVE) | `REQUIRED` | AD-CMP-01 |
| UC-CMP-07 | Finalizar inscripción | SUBCOMM, ADMIN | 4/3 | ACTIVE; serializada si está en uso (una orden, una transacción) | Sin serializar | SM-COMPETITIONENTRY (ACTIVE→ENDED) | `REQUIRED` | AD-CMP-01 |
| UC-CMP-08 | Registrar referencia externa | SUBCOMM, ADMIN | 4/3 | Lista blanca COMPETITION/COMPETITION_ENTRY/MATCH_EVENT; la referencia es referencia | Fuera de lista | — | `SIMPLE` | — |
| UC-CMP-09 | Consultar referencia externa | COACH, SUBCOMM, ADMIN | 3/2 | Coach sólo lectura | Sin alcance | — | `SIMPLE` | — |

## 6.8 INS — Búsqueda, informes y auditoría (5 CU)

| ID | CU | Actor | C | Decisión | Clasificación | AD |
|---|---|---|---|---|---|---|
| UC-INS-01 | Buscar en el club | AUTH | 4/2 | Proyección por scope; campo no autorizado no existe en la respuesta; «sin consulta» ≠ «cero resultados» | `SIMPLE` | — |
| UC-INS-02 | Informe de asistencia | COACH, SUBCOMM, PLAYER, CAPTAIN | 4/3 | Período visible y modificable; UNRECORDED ≠ ABSENT; Admin denegado explícito | `SIMPLE` | — |
| UC-INS-03 | Informe de rendimiento | COACH, SUBCOMM, PLAYER, CAPTAIN | 4/3 | Partidos jugados derivados del resultado, nunca de la asistencia | `SIMPLE` | — |
| UC-INS-04 | Historial de un objeto | AUTH | 3/2 | Historia derivada de entidades+auditoría; sin tabla genérica | `SIMPLE` | — |
| UC-INS-05 | Auditoría administrativa | ADMIN | 4/2 | Sólo lectura redactada; nadie edita ni borra entradas | `SIMPLE` | — |

# 7. RESUMEN DE CLASIFICACIÓN (102/102)

| Clasificación | Total | CU |
|---|---|---|
| `ACTIVITY_REQUIRED` | **40** | IAM-01, IAM-03, IAM-04; PPL-01, PPL-03, PPL-04, PPL-06, PPL-07, PPL-08; EVT-01..08, EVT-11, EVT-12, EVT-15; PRT-01..03, PRT-05..10; COM-01..04; CMP-01..07 |
| `ACTIVITY_USEFUL_NONBLOCKING` | **7** | IAM-10, PPL-05, PPL-09, PPL-10, PPL-11, EVT-13, PRT-12 |
| `COVERED_BY_EXISTING_ACTIVITY` | **5** | IAM-05, IAM-09, PPL-02, EVT-16, PRT-04 |
| `SIMPLE_USE_CASE_NO_DIAGRAM` | **50** | IAM-02, IAM-06..08; PPL-12..17; STR-01..15; EVT-09, EVT-10, EVT-14, EVT-17..19; PRT-11, PRT-13; COM-05..14; CMP-08, CMP-09; INS-01..05 |
| `NEEDS_CLARIFICATION` | **0** | — |
| **Total evaluado** | **102** | 102/102, 0 omitidos |

# 8. HALLAZGOS

| ID | Severidad | Hallazgo | Evidencia | Acción |
|---|---|---|---|---|
| AUD-ACT-01 | **INFO** | **0 paralelismo real respaldado.** Ningún CU de E1–E6 respalda actividades concurrentes dentro de un mismo proceso: toda mutación es una orden/una transacción (REQ-SYS-018), el sistema es monolito modular sin workers/colas (PT §3) y las proyecciones no tienen escritura propia (REQ-SYS-019). | PT §3, §31; REQ-SYS-016/018; E6 Regla 6 | **E7 no dibujará ningún Fork/Join.** No es una omisión: dibujar concurrencia sería inventar infraestructura. La concurrencia entre actores distintos (p. ej. respuestas de varias jugadoras) no es paralelismo dentro de un proceso. |
| AUD-ACT-02 | **INFO** | `REAUTHENTICATION_REQUIRED` es regla transversal con 0 aristas UML (E4 INC-01). Ninguna autoridad enumera las 39 operaciones sensibles individualmente. | E4 §5.1; REQ-IAM-009; E5 pasos «N.1» | E7 la representa como **decisión/guard transversal** en los diagramas de procesos sensibles (AD-IAM-02, AD-PPL-01, AD-PPL-02, AD-CMP-01), nunca como `include` obligatorio ni inventando el inventario completo. |
| AUD-ACT-03 | **INFO** | Procesos multi-CU: «alta de persona», «ciclo de afiliación», «publicación de comunicado», «ciclo de inscripción». Los CU que los componen siguen siendo independientes (triggers propios); el diagrama muestra el recorrido típico y cada segmento conserva sus guards propios, sin fusionar objetivos distintos. | E5 specs; E7-02 | Documentado en cada contrato (E7-03) con la aclaración de independencia. |
| AUD-ACT-04 | **INFO** | El material académico `Diagrama de Actividad (1).pdf` no está en el workspace (misma ausencia ya registrada como `SPEC-FEEDBACK-01/P3` en E5). | Búsqueda `*.pdf` en el repo | Se usa el contrato de la etapa como referencia gramatical. No se inventó contenido del PDF. |
| AUD-ACT-05 | **MINOR** | UC-EVT-09/10 (completar/abandonar) no obtienen diagrama propio, pero su guard de compatibilidad (`PLAYED/FORFEIT⇒COMPLETED; ABANDONED⇒ABANDONED`) reaparece como contexto obligatorio del registro de resultado. | REQ-PRT-015; SM-EVENT TR-040/041 | Se documenta el contexto en el contrato AD-PRT-04 y como nota en el diagrama. |
| AUD-ACT-06 | **INFO** | 0 contradicciones funcionales entre E5 y E6/Product Truth detectadas en la evaluación: cada transición usada por los flujos existe en la matriz E6 y cada guard de estado coincide con PROH-023..050. | Matriz E6 vs. specs E5 | Sin `ACTIVITY-FEEDBACK`. Nada bloquea el Freeze. |

# 9. CONCLUSIÓN

- **102/102 CU evaluados** con evidencia por CU (§6).
- **40 procesos** requieren diagrama; se agrupan en **14 diagramas de actividad** por proceso funcional coherente (E7-02).
- 0 `NEEDS_CLARIFICATION`, 0 contradicciones bloqueantes, 0 ramas funcionales esenciales omitidas por E5.
- El paralelismo real respaldado es **nulo**; E7 no dibujará Fork/Join (hallazgo AUD-ACT-01).

**E7-01: PASS.** La auditoría habilita E7-02 (selección) sin bloqueos.
