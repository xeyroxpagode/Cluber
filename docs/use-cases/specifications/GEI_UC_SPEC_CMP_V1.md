# GEI HOCKEY MANAGEMENT SYSTEM
## UC SPECIFICATIONS — CMP (Competition) V1

**Etapa:** 5 — Especificaciones de TODOS los casos de uso
**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-07
**Rama:** `gei/e5-use-case-specifications-freeze-v1`
**Plantilla:** `GEI_USE_CASE_SPECIFICATION_STANDARD_V1.md`
**CU:** 9 — `UC-CMP-01` … `UC-CMP-09`

> `ACT-SUBCOMMITTEE` y `ACT-ADMIN` gestionan competencias (PT §5 fila `Competitions/Entries` =
> `✓` para ambos); la separación de `REQ-STR-009` es sólo de estructura. Los CU de gestión sensible
> llevan la derivación transversal a `UC-IAM-09` (E4 V1.0.1 INC-01).

---

## CASO DE USO: UC-CMP-01 · Registrar una competencia

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la Subcomisión o a la administración crear una competencia del club en la que los equipos o líneas podrán inscribirse.
Actores:
- Actor principal: `ACT-SUBCOMMITTEE` · `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment SUBCOMMITTEE` o `RoleAssignment ADMIN` vigente.
Postcondiciones:
- Éxito: existe una `Competition` en `DRAFT`.
- Rechazo: no se crea ninguna competencia.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. La Subcomisión o la administración inicia el registro de una competencia.
2. GEI valida el rol vigente del actor.
3. El actor proporciona los datos de la competencia.
4. GEI registra la competencia en `DRAFT`.

Camino alternativo:
2.1. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.2. Si el actor no tiene rol de Subcomisión ni de administración, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-CMP-001` (P) · `REQ-CMP-006` (S)
- Authority source: `RoleAssignment SUBCOMMITTEE` / `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: `REQ-CMP-006` — la referencia externa sólo se asocia a `COMPETITION`, `COMPETITION_ENTRY` o `MATCH_EVENT`
- Estado / objeto afectado: `Competition` nace `DRAFT`
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: la activación es `UC-CMP-02`.

---

## CASO DE USO: UC-CMP-02 · Activar una competencia

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la Subcomisión o a la administración dejar una competencia abierta para que los equipos y líneas se inscriban.
Actores:
- Actor principal: `ACT-SUBCOMMITTEE` · `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- La competencia está `DRAFT`.
- Rol vigente del actor.
Postcondiciones:
- Éxito: la competencia queda `ACTIVE` y admite inscripciones.
- Rechazo: la competencia queda `DRAFT`.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. La Subcomisión o la administración solicita abrir una competencia definida.
2. GEI valida el rol vigente del actor y el estado `DRAFT` de la competencia.
3. El actor confirma la activación.
4. GEI deja la competencia `ACTIVE` y admite inscripciones.

Camino alternativo:
2.1. Si la competencia no está `DRAFT`, GEI rechaza la operación explicando el estado actual.
2.2. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.3. Si el actor no tiene rol de Subcomisión ni de administración, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-CMP-001` (P) · `REQ-CMP-003` (S)
- Authority source: `RoleAssignment SUBCOMMITTEE` / `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: ciclo `DRAFT → ACTIVE → CLOSED`
- Estado / objeto afectado: `Competition` `DRAFT → ACTIVE`
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: —

---

## CASO DE USO: UC-CMP-03 · Cerrar una competencia

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la Subcomisión o a la administración cerrar una competencia que ya terminó, conservando su historial.
Actores:
- Actor principal: `ACT-SUBCOMMITTEE` · `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- La competencia está `ACTIVE`.
- La competencia tiene 0 inscripciones activas.
- Rol vigente del actor.
Postcondiciones:
- Éxito: la competencia queda `CLOSED` y su histórico se conserva.
- Rechazo: la competencia queda `ACTIVE`; nada cambia.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. La Subcomisión o la administración solicita cerrar una competencia terminada.
2. GEI valida el rol vigente del actor, el estado `ACTIVE` y la ausencia de inscripciones activas.
3. El actor confirma el cierre.
4. GEI deja la competencia `CLOSED` conservando su histórico.

Camino alternativo:
2.1. Si la competencia tiene inscripciones activas, GEI rechaza la operación **explicándolas**: las finaliza primero (`UC-CMP-07`).
2.2. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.3. Si el actor no tiene rol de Subcomisión ni de administración, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-CMP-002` (P) · `REQ-EVT-024` (S) · `REQ-PPL-015` (S)
- Authority source: `RoleAssignment SUBCOMMITTEE` / `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: 0 inscripciones activas exigidas · el histórico se conserva
- Estado / objeto afectado: `Competition` `ACTIVE → CLOSED`
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: —

---

## CASO DE USO: UC-CMP-04 · Inscribir un equipo en una competencia

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la Subcomisión o a la administración registrar que un equipo concreto participa en una competencia activa.
Actores:
- Actor principal: `ACT-SUBCOMMITTEE` · `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- La competencia está `ACTIVE`.
- El equipo existe.
- Rol vigente del actor.
Postcondiciones:
- Éxito: existe una inscripción de alcance `TEAM` en `PENDING`, identificada por el equipo.
- Rechazo: no se crea ninguna inscripción.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. La Subcomisión o la administración inscribe a un equipo en una competencia.
2. GEI valida el rol vigente del actor, el estado `ACTIVE` de la competencia y la existencia del equipo.
3. El actor confirma la inscripción.
4. GEI registra la inscripción de alcance `TEAM` en `PENDING`, identificada por el equipo.

Camino alternativo:
2.1. Si la competencia no está `ACTIVE`, GEI rechaza la operación explicando el estado.
2.2. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.3. Si el actor no tiene rol de Subcomisión ni de administración, GEI deniega la operación.
4.1. Si el uso previsto en un partido es incompatible con el alcance `TEAM`, GEI rechaza la operación con la causa en lenguaje de usuario (`COMPETITION_SCOPE_MISMATCH`).

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-CMP-003` (P) · `REQ-CMP-004` (S) · `REQ-CMP-005` (S) · `REQ-STR-010` (S)
- Authority source: `RoleAssignment SUBCOMMITTEE` / `RoleAssignment ADMIN`
- Scope: `CLUB` (el alcance `TEAM` es alcance de **dato** de la inscripción, no scope de actor)
- Business rules: `REQ-CMP-004` — `TEAM` y `LINE` son alcances distintos e incompatibles
- Estado / objeto afectado: `CompetitionEntry` `scope = TEAM` nace `PENDING`
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: no fusionado con `UC-CMP-05`: PT §4 y `REQ-CMP-004` los tratan como alcances distintos con reglas y errores distintos.

---

## CASO DE USO: UC-CMP-05 · Inscribir una línea en una competencia

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la Subcomisión o a la administración registrar que una línea participa en una competencia activa, identificada por división, línea y temporada.
Actores:
- Actor principal: `ACT-SUBCOMMITTEE` · `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- La competencia está `ACTIVE`.
- La línea existe y su temporada es válida.
- Rol vigente del actor.
Postcondiciones:
- Éxito: existe una inscripción de alcance `LINE` en `PENDING`, identificada por división, línea y temporada.
- Rechazo: no se crea ninguna inscripción.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. La Subcomisión o la administración inscribe a una línea en una competencia.
2. GEI valida el rol vigente del actor, el estado `ACTIVE` de la competencia y la existencia de la línea con temporada válida.
3. El actor confirma la inscripción.
4. GEI registra la inscripción de alcance `LINE` en `PENDING`, identificada por división, línea y temporada.

Camino alternativo:
2.1. Si la competencia no está `ACTIVE`, GEI rechaza la operación explicando el estado.
2.2. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.3. Si el actor no tiene rol de Subcomisión ni de administración, GEI deniega la operación.
4.1. Si el uso previsto en un partido es incompatible con el alcance `LINE`, GEI rechaza la operación con la causa en lenguaje de usuario (`COMPETITION_SCOPE_MISMATCH`).

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-CMP-003` (P) · `REQ-CMP-004` (S) · `REQ-CMP-005` (S) · `REQ-STR-010` (S)
- Authority source: `RoleAssignment SUBCOMMITTEE` / `RoleAssignment ADMIN`
- Scope: `CLUB` (el alcance `LINE` es alcance de **dato**, no scope de actor — E2 §9.2)
- Business rules: `REQ-CMP-004` — `LINE` y `TEAM` son alcances distintos e incompatibles
- Estado / objeto afectado: `CompetitionEntry` `scope = LINE` nace `PENDING`
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: —

---

## CASO DE USO: UC-CMP-06 · Activar una inscripción en una competencia

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la Subcomisión o a la administración dejar activa una inscripción para que pueda ser usada por los partidos de esa competencia.
Actores:
- Actor principal: `ACT-SUBCOMMITTEE` · `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- La inscripción está `PENDING`.
- Su alcance es compatible con el uso previsto.
- Rol vigente del actor.
Postcondiciones:
- Éxito: la inscripción queda `ACTIVE` y puede ser la inscripción usada por un partido de esa competencia.
- Rechazo: la inscripción queda `PENDING`.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. La Subcomisión o la administración solicita activar una inscripción completa.
2. GEI valida el rol vigente del actor, el estado `PENDING` y la compatibilidad del alcance.
3. El actor confirma la activación.
4. GEI deja la inscripción `ACTIVE`.

Camino alternativo:
2.1. Si el alcance de la inscripción no es compatible con el uso previsto, GEI rechaza la operación con la causa en lenguaje de usuario.
2.2. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.3. Si el actor no tiene rol de Subcomisión ni de administración, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-CMP-003` (P) · `REQ-CMP-004` (S) · `REQ-CMP-005` (S) · `REQ-EVT-024` (S)
- Authority source: `RoleAssignment SUBCOMMITTEE` / `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: un CU para cualquier alcance: la diferencia `TEAM`/`LINE` está en `UC-CMP-04`/`UC-CMP-05` y en la regla de compatibilidad
- Estado / objeto afectado: `CompetitionEntry` `PENDING → ACTIVE`
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: —

---

## CASO DE USO: UC-CMP-07 · Finalizar una inscripción en una competencia

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la Subcomisión o a la administración cerrar la participación de un equipo o una línea en una competencia, conservando el histórico.
Actores:
- Actor principal: `ACT-SUBCOMMITTEE` · `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- La inscripción está `ACTIVE`.
- Rol vigente del actor.
Postcondiciones:
- Éxito: la inscripción queda `ENDED`, con su consecuencia explicada y su histórico conservado.
- Rechazo: la inscripción queda `ACTIVE`.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. La Subcomisión o la administración solicita finalizar una inscripción.
2. GEI valida el rol vigente del actor y el estado `ACTIVE` de la inscripción.
3. El actor confirma la finalización.
4. GEI deja la inscripción `ENDED`, explica su consecuencia y conserva el histórico.

Camino alternativo:
2.1. Si la inscripción está en uso por partidos, GEI serializa la operación contra la creación de nuevas dependencias, sin dejar la operación a medio hacer.
2.2. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.3. Si el actor no tiene rol de Subcomisión ni de administración, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-CMP-003` (P) · `REQ-EVT-024` (S) · `REQ-PPL-015` (S) · `REQ-SYS-018` (S)
- Authority source: `RoleAssignment SUBCOMMITTEE` / `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: en uso ⇒ serialización · una orden, una transacción
- Estado / objeto afectado: `CompetitionEntry` `ACTIVE → ENDED`
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: finalizar la inscripción es lo que habilita `UC-CMP-03` (cerrar la competencia con 0 inscripciones activas).

---

## CASO DE USO: UC-CMP-08 · Registrar una referencia externa

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la Subcomisión o a la administración dejar asentado el dato federativo oficial de una competencia, inscripción o partido, sin construir una integración.
Actores:
- Actor principal: `ACT-SUBCOMMITTEE` · `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- El objetivo asociado es uno de la lista blanca: `COMPETITION`, `COMPETITION_ENTRY`, `MATCH_EVENT`.
- Rol vigente del actor.
Postcondiciones:
- Éxito: la referencia queda asociada a un objetivo permitido y a ningún otro; el sistema no afirma que provenga de una fuente sincronizada.
- Rechazo: no se registra ninguna referencia.
Puntos de Extensión:
- No posee.
Prioridad: P2

Camino básico:
1. La Subcomisión o la administración registra un identificador o estado federativo oficial.
2. GEI valida el rol vigente del actor y que el objetivo asociado pertenece a la lista blanca.
3. El actor confirma la referencia.
4. GEI asocia la referencia al objetivo permitido, identificada como referencia.

Camino alternativo:
2.1. Si el objetivo asociado no pertenece a la lista blanca, GEI rechaza la operación explicando la causa.
2.2. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.3. Si el actor no tiene rol de Subcomisión ni de administración, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-CMP-006` (P) · `REQ-CMP-007` (S)
- Authority source: `RoleAssignment SUBCOMMITTEE` / `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: `REQ-CMP-007` — la referencia **es** referencia; sin historia clínica; el sistema no resuelve pases por sí mismo · `OUT-CMP-003`/`OUT-CMP-004` — sin integración automática federativa
- Estado / objeto afectado: `ExternalReference` asociada a un objetivo permitido
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: `RWS-03`: sin superficie actual. La referencia es **manual y puntual**.

---

## CASO DE USO: UC-CMP-09 · Consultar una referencia externa

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un entrenador, a la Subcomisión o a la administración ver el identificador o estado federativo registrado de un objeto, sabiendo que no es verdad federativa.
Actores:
- Actor principal: `ACT-COACH` (lectura) · `ACT-SUBCOMMITTEE` · `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- El objeto tiene una referencia externa registrada.
- El actor tiene alcance.
Postcondiciones:
- Éxito: el actor ve la referencia identificada como referencia; el sistema no afirma sincronización ni resuelve consultas sobre pases u habilitación oficial.
Puntos de Extensión:
- No posee.
Prioridad: P2

Camino básico:
1. El entrenador, la Subcomisión o la administración consulta el dato federativo de un objeto de su alcance.
2. GEI valida la autoridad y el alcance del actor.
3. GEI presenta la referencia identificada como referencia.

Camino alternativo:
2.1. Si el actor no tiene alcance sobre el objeto, GEI deniega la operación.
2.2. Si el objeto no tiene referencia registrada, GEI lo comunica explícitamente en lugar de mostrar un vacío sin explicación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-CMP-006` (P) · `REQ-CMP-007` (S) · `REQ-CMP-008` (S) · `REQ-SYS-015` (S)
- Authority source: `RoleAssignment COACH` (lectura) / `RoleAssignment SUBCOMMITTEE` / `RoleAssignment ADMIN`
- Scope: `TEAM` / `EVENT` / `CLUB`
- Business rules: `REQ-CMP-008` — el alcance limita dónde aplica; `ACT-COACH` puede consultar y **no** puede registrar: dos autoridades distintas sobre el mismo hecho
- Estado / objeto afectado: consulta sin mutación
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: no fusionado con `UC-CMP-08`: PT §5 da lectura a `COACH` y registro a `SUBCOMMITTEE`/`ADMIN`.

---

**Fin de las especificaciones CMP. 9 CU · `UC-CMP-01` … `UC-CMP-09`.**
