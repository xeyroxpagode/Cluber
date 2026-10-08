# GEI HOCKEY MANAGEMENT SYSTEM
## UC SPECIFICATIONS — STR (Club Structure) V1

**Etapa:** 5 — Especificaciones de TODOS los casos de uso
**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-07
**Rama:** `gei/e5-use-case-specifications-freeze-v1`
**Plantilla:** `GEI_USE_CASE_SPECIFICATION_STANDARD_V1.md`
**CU:** 15 — `UC-STR-01` … `UC-STR-15`

> Todos los CU de `STR` son de `ACT-ADMIN` con alcance `CLUB`. `ACT-SUBCOMMITTEE` no administra
> estructura (`REQ-STR-009`): recibe la denegación con explicación del motivo. Los CU de gestión
> sensible llevan la derivación transversal a `UC-IAM-09` (E4 V1.0.1 INC-01). `UC-STR-14` no es
> gestión sensible según el inventario E3.

---

## CASO DE USO: UC-STR-01 · Registrar una temporada

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración crear un período del club al que asociar actividades y equipos.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
Postcondiciones:
- Éxito: existe una `Season` con nombre y fechas, histórica, sin ciclo de estado y sin eliminación.
- Rechazo: no se crea ninguna temporada.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El administrador inicia el registro de una temporada para la planificación de un nuevo período.
2. GEI valida el `RoleAssignment ADMIN` vigente.
3. El administrador proporciona el nombre y las fechas de la temporada.
4. GEI registra la temporada.

Camino alternativo:
2.1. Si quien intenta operar es la Subcomisión, GEI deniega la operación explicando que la estructura no está disponible para la Subcomisión.
2.2. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.3. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-STR-001` (P) · `REQ-STR-008` (S) · `REQ-STR-011` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: histórica, **sin ciclo de estado**, sin hard-delete · `REQ-STR-011` — referencias por identidad
- Estado / objeto afectado: `Season` creada con nombre y fechas
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: `RWS-01`: sin superficie actual.

---

## CASO DE USO: UC-STR-02 · Actualizar los datos de una temporada

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración corregir el nombre o las fechas de una temporada existente.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- La temporada existe.
Postcondiciones:
- Éxito: nombre y/o fechas quedan actualizados; la historia no se reescribe ni se borra.
- Rechazo: la temporada conserva sus datos vigentes.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El administrador solicita corregir el nombre o las fechas de una temporada.
2. GEI valida el `RoleAssignment ADMIN` vigente y que la temporada existe.
3. El administrador proporciona los datos nuevos.
4. GEI actualiza nombre y/o fechas de la temporada.

Camino alternativo:
2.1. Si quien intenta operar es la Subcomisión, GEI deniega la operación explicando que la estructura no está disponible para la Subcomisión.
2.2. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.3. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.
4.1. Si el cambio de fechas altera la etiqueta de los equipos derivados, GEI no los reatribuye: las referencias se resuelven por identidad.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-STR-001` (P) · `REQ-STR-008` (S) · `REQ-STR-011` (S) · `REQ-PPL-014` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: sin ciclo de estado · renombrar no reatribuye historia (`REQ-STR-011`)
- Estado / objeto afectado: `Season` con nombre y/o fechas actualizados
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: `RWS-01`: sin superficie actual.

---

## CASO DE USO: UC-STR-03 · Registrar una división

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración crear un nivel de organización del club del que dependan las líneas.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
Postcondiciones:
- Éxito: existe una `Division`.
- Rechazo: no se crea ninguna división.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. El administrador inicia el registro de una división.
2. GEI valida el `RoleAssignment ADMIN` vigente.
3. El administrador proporciona el nombre de la división.
4. GEI registra la división.

Camino alternativo:
2.1. Si quien intenta operar es la Subcomisión, GEI deniega la operación explicando que la estructura no está disponible para la Subcomisión.
2.2. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.3. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-STR-002` (P) · `REQ-STR-008` (S) · `REQ-PPL-014` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: `REQ-PPL-014` — identidad estable del equipo
- Estado / objeto afectado: `Division` creada
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: —

---

## CASO DE USO: UC-STR-04 · Actualizar una división

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración renombrar una división conservando su identidad y su historia.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- La división existe.
Postcondiciones:
- Éxito: el nombre queda actualizado y las referencias se resuelven por identidad.
- Rechazo: la división conserva su nombre.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. El administrador solicita renombrar una división.
2. GEI valida el `RoleAssignment ADMIN` vigente y que la división existe.
3. El administrador proporciona el nombre nuevo.
4. GEI actualiza el nombre de la división; las referencias por identidad no se reatribuyen.

Camino alternativo:
2.1. Si la división tiene equipos activos, GEI rechaza el renombrado: la identidad del equipo es estable y no muta por un rename.
2.2. Si quien intenta operar es la Subcomisión, GEI deniega la operación explicando que la estructura no está disponible para la Subcomisión.
2.3. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.4. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-STR-002` (P) · `REQ-PPL-014` (P) · `REQ-STR-011` (S) · `REQ-STR-010` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: `REQ-PPL-014` — renombrar con equipos activos se rechaza · `REQ-STR-011` — referencias por identidad
- Estado / objeto afectado: `Division` renombrada; la historia se conserva
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: `DEF-STR-001` — la restauración de una división archivada no es de V1.

---

## CASO DE USO: UC-STR-05 · Archivar una división

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración retirar una división que ya no se usa sin perder lo que dependió de ella.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- No hay dependencia activa sobre la división.
Postcondiciones:
- Éxito: la división queda archivada; la historia se conserva.
- Rechazo: la división queda como estaba.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. El administrador solicita archivar una división que el club ya no usa.
2. GEI valida el `RoleAssignment ADMIN` vigente y la ausencia de dependencias activas.
3. El administrador confirma el archivado.
4. GEI archiva la división conservando su historia.

Camino alternativo:
2.1. Si existe una dependencia activa, GEI rechaza la operación **nombrando la dependencia** (`REQ-STR-006`).
2.2. Si quien intenta operar es la Subcomisión, GEI deniega la operación explicando que la estructura no está disponible para la Subcomisión.
2.3. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.4. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-STR-002` (P) · `REQ-STR-006` (P) · `REQ-STR-008` (S) · `REQ-PPL-015` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: `REQ-STR-006` — valla de dependencias al archivar · `REQ-PPL-015` — nada con significado se elimina
- Estado / objeto afectado: `Division` archivada. **Terminal en V1**: no existe transición inversa
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: el «Restaurar» del CURRENT es `IMPLEMENTATION_WITHOUT_REQUIREMENT` bajo `REQ-DECISION-NEEDED-01`.

---

## CASO DE USO: UC-STR-06 · Registrar una línea

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración crear una línea dentro de una división, para organizar la estructura deportiva del club.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- La división padre existe.
Postcondiciones:
- Éxito: existe una `Line` dentro de la división; su etiqueta completa incluye división y temporada.
- Rechazo: no se crea ninguna línea.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. El administrador inicia el registro de una línea dentro de una división.
2. GEI valida el `RoleAssignment ADMIN` vigente y que la división padre existe.
3. El administrador proporciona el nombre de la línea.
4. GEI registra la línea con su etiqueta completa.

Camino alternativo:
2.1. Si la división padre no existe, GEI rechaza la operación explicando la causa.
2.2. Si quien intenta operar es la Subcomisión, GEI deniega la operación explicando que la estructura no está disponible para la Subcomisión.
2.3. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.4. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-STR-003` (P) · `REQ-STR-008` (S) · `REQ-STR-010` (S) · `REQ-STR-011` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: `REQ-STR-010` — la línea se identifica con división y temporada
- Estado / objeto afectado: `Line` creada
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: —

---

## CASO DE USO: UC-STR-07 · Actualizar una línea

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración renombrar una línea conservando su identidad y su historia.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- La línea existe.
Postcondiciones:
- Éxito: el nombre queda actualizado.
- Rechazo: la línea conserva su nombre.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. El administrador solicita renombrar una línea.
2. GEI valida el `RoleAssignment ADMIN` vigente y que la línea existe.
3. El administrador proporciona el nombre nuevo.
4. GEI actualiza el nombre de la línea; las referencias por identidad no se reatribuyen.

Camino alternativo:
2.1. Si la línea tiene equipos activos, GEI rechaza el renombrado: la identidad del equipo es estable.
2.2. Si quien intenta operar es la Subcomisión, GEI deniega la operación explicando que la estructura no está disponible para la Subcomisión.
2.3. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.4. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-STR-003` (P) · `REQ-PPL-014` (P) · `REQ-STR-011` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: `REQ-PPL-014` — renombrar con equipos activos se rechaza
- Estado / objeto afectado: `Line` renombrada; la historia se conserva
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: `DEF-STR-002` — la restauración de una línea archivada no es de V1.

---

## CASO DE USO: UC-STR-08 · Archivar una línea

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración retirar una línea que ya no se usa sin perder lo que dependió de ella.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- No hay dependencia activa sobre la línea.
Postcondiciones:
- Éxito: la línea queda archivada; la historia se conserva.
- Rechazo: la línea queda como estaba.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. El administrador solicita archivar una línea que el club ya no usa.
2. GEI valida el `RoleAssignment ADMIN` vigente y la ausencia de dependencias activas.
3. El administrador confirma el archivado.
4. GEI archiva la línea conservando su historia.

Camino alternativo:
2.1. Si existe una dependencia activa, GEI rechaza la operación **nombrando la dependencia** (`REQ-STR-006`).
2.2. Si quien intenta operar es la Subcomisión, GEI deniega la operación explicando que la estructura no está disponible para la Subcomisión.
2.3. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.4. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-STR-003` (P) · `REQ-STR-006` (P) · `REQ-STR-008` (S) · `REQ-PPL-015` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: `REQ-STR-006` — valla de dependencias · **terminal en V1**
- Estado / objeto afectado: `Line` archivada
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: —

---

## CASO DE USO: UC-STR-09 · Registrar un equipo

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración crear el equipo que representa la combinación única de temporada, división y línea.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- Temporada, división y línea existen.
Postcondiciones:
- Éxito: existe un `Team` en `DRAFT` con la combinación única; su nombre se deriva de temporada, división y línea.
- Rechazo: no se crea ningún equipo.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El administrador inicia el registro de un equipo nuevo.
2. GEI valida el `RoleAssignment ADMIN` vigente y que temporada, división y línea existen.
3. El administrador elige la combinación temporada + división + línea de las listas del club.
4. GEI valida la unicidad de la combinación.
5. GEI registra el equipo en `DRAFT` con su nombre derivado.

Camino alternativo:
2.1. Si quien intenta operar es la Subcomisión, GEI deniega la operación explicando que la estructura no está disponible para la Subcomisión.
2.2. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.3. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.
4.1. Si la combinación temporada + división + línea ya existe, GEI rechaza la operación por combinación repetida.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-STR-004` (P) · `REQ-STR-008` (P) · `REQ-PPL-014` (S) · `REQ-STR-010` (S) · `REQ-STR-013` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: combinación única temporada + división + línea · el nombre se deriva de la combinación · `REQ-STR-013` — se elige de listas
- Estado / objeto afectado: `Team` nace `DRAFT`
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: `RWS-02`: sin superficie actual de create/edit.

---

## CASO DE USO: UC-STR-10 · Actualizar un equipo

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración corregir los datos de un equipo sin cambiar su identidad de combinación única.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- El equipo existe.
- El equipo no está `ARCHIVED`.
Postcondiciones:
- Éxito: el dato queda actualizado; las referencias por identidad no se reatribuyen.
- Rechazo: el equipo conserva sus datos vigentes.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. El administrador solicita corregir un dato de un equipo.
2. GEI valida el `RoleAssignment ADMIN` vigente, que el equipo existe y no está `ARCHIVED`.
3. El administrador proporciona el dato nuevo.
4. GEI actualiza el dato del equipo conservando su identidad.

Camino alternativo:
2.1. Si el equipo está `ARCHIVED`, GEI rechaza la edición: no es editable.
2.2. Si el administrador intenta cambiar la combinación temporada/división/línea, GEI rechaza la operación: eso sería otro equipo.
2.3. Si quien intenta operar es la Subcomisión, GEI deniega la operación explicando que la estructura no está disponible para la Subcomisión.
2.4. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.5. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-STR-008` (P) · `REQ-STR-004` (S) · `REQ-PPL-014` (S) · `REQ-STR-011` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: la edición no incluye cambiar la combinación temporada/división/línea · identidad estable del equipo
- Estado / objeto afectado: `Team` con el dato actualizado
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: `REQ-STR-008` es PRIMARY de este CU según la ficha del catálogo (la matriz E3 usó notación de rango `(S)` para el bloque `STR`; prevalece la ficha granular).

---

## CASO DE USO: UC-STR-11 · Activar un equipo

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración dejar un equipo disponible para afiliaciones, eventos y competencias.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- El equipo está en `DRAFT`.
Postcondiciones:
- Éxito: el equipo queda `ACTIVE` y disponible para eventos, afiliaciones e inscripciones.
- Rechazo: el equipo queda `DRAFT`.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El administrador solicita activar un equipo completo.
2. GEI valida el `RoleAssignment ADMIN` vigente y el estado `DRAFT` del equipo.
3. El administrador confirma la activación.
4. GEI deja el equipo `ACTIVE` y disponible.

Camino alternativo:
2.1. Si el equipo no está `DRAFT`, GEI rechaza la operación explicando el estado actual.
2.2. Si quien intenta operar es la Subcomisión, GEI deniega la operación explicando que la estructura no está disponible para la Subcomisión.
2.3. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.4. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-STR-004` (P) · `REQ-STR-008` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: PT §9 — `DRAFT → ACTIVE`; `ARCHIVED → ACTIVE` **no** existe en V1 (transición de restore, `DEF-STR-001/002`)
- Estado / objeto afectado: `Team` `DRAFT → ACTIVE`
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: —

---

## CASO DE USO: UC-STR-12 · Archivar un equipo

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración retirar un equipo que el club ya no usa sin perder su historia deportiva.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- No hay dependencia activa sobre el equipo.
Postcondiciones:
- Éxito: el equipo queda `ARCHIVED`; sus eventos e inscripciones quedan históricos y consultables.
- Rechazo: el equipo queda como estaba.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El administrador solicita archivar un equipo que el club ya no usa.
2. GEI valida el `RoleAssignment ADMIN` vigente y la ausencia de dependencias activas.
3. El administrador confirma el archivado.
4. GEI archiva el equipo conservando su historia; sus eventos e inscripciones quedan históricos y consultables.

Camino alternativo:
2.1. Si existe una dependencia activa, GEI rechaza la operación **nombrando la dependencia** (`REQ-STR-006`).
2.2. Si quien intenta operar es la Subcomisión, GEI deniega la operación explicando que la estructura no está disponible para la Subcomisión.
2.3. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.4. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-STR-004` (P) · `REQ-STR-006` (P) · `REQ-STR-008` (S) · `REQ-PPL-015` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: `REQ-STR-006` — valla de dependencias · **terminal en V1**
- Estado / objeto afectado: `Team` `ACTIVE → ARCHIVED`
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: no existe «archivar estructura» como include de este CU (`REJ-06`): la valla es una regla, no una composición.

---

## CASO DE USO: UC-STR-13 · Registrar una sede

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración dar de alta un lugar donde el club juega o se reúne.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
Postcondiciones:
- Éxito: existe una `Venue` con nombre, dirección y etiqueta de cancha opcional; su identidad es estable por identificador.
- Rechazo: no se crea ninguna sede.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. El administrador inicia el registro de una sede nueva.
2. GEI valida el `RoleAssignment ADMIN` vigente.
3. El administrador proporciona nombre, dirección y, si corresponde, la etiqueta de cancha.
4. GEI registra la sede con identidad estable por identificador.

Camino alternativo:
2.1. Si quien intenta operar es la Subcomisión, GEI deniega la operación explicando que la estructura no está disponible para la Subcomisión.
2.2. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.3. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-STR-005` (P) · `REQ-STR-008` (S) · `REQ-STR-013` (S) · `REQ-STR-011` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: identidad estable por identificador
- Estado / objeto afectado: `Venue` creada
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: `OUT-STR-001` — no hay reserva de canchas ni de sedes.

---

## CASO DE USO: UC-STR-14 · Corregir los datos de una sede

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración corregir el nombre, la dirección o la etiqueta de cancha de una sede sin alterar la agenda de nadie: es la regla A del cambio de sede.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- La sede existe.
Postcondiciones:
- Éxito: el dato queda corregido; GEI no reprograma eventos, no pide reconfirmación, no incrementa la revisión de coordinación y no notifica.
- Rechazo: la sede conserva sus datos vigentes.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El administrador solicita corregir un dato de identidad de una sede.
2. GEI valida el `RoleAssignment ADMIN` vigente y que la sede existe.
3. El administrador proporciona el dato corregido.
4. GEI actualiza el dato de la sede sin efectos de coordinación: no reprograma eventos, no pide reconfirmación, no incrementa la revisión de coordinación y no notifica.

Camino alternativo:
2.1. Si quien intenta operar es la Subcomisión, GEI deniega la operación explicando que la estructura no está disponible para la Subcomisión.
2.2. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-STR-012` (P, regla A) · `REQ-STR-005` (P) · `REQ-STR-008` (S) · `REQ-EVT-011` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: `REQ-STR-012` regla A/B — corregir la identidad de la sede **no** reprograma; cambiar la sede **de un evento** sí es cambio material completo (regla B, `UC-EVT-04`)
- Estado / objeto afectado: `Venue` con el dato corregido; ningún evento cambia
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: la asimetría A/B es la prueba de que la identidad de la sede y su uso en un evento son hechos distintos. Este CU no es gestión sensible según el inventario E3: sin derivación a `UC-IAM-09`.

---

## CASO DE USO: UC-STR-15 · Archivar una sede

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración retirar una sede que el club ya no usa sin perder los eventos que la usaron.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- No hay dependencia activa sobre la sede.
Postcondiciones:
- Éxito: la sede queda archivada; los eventos que la usaron quedan históricos y consultables.
- Rechazo: la sede queda como estaba.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. El administrador solicita archivar una sede que el club ya no usa.
2. GEI valida el `RoleAssignment ADMIN` vigente y la ausencia de dependencias activas.
3. El administrador confirma el archivado.
4. GEI archiva la sede conservando los eventos que la usaron.

Camino alternativo:
2.1. Si existe una dependencia activa, GEI rechaza la operación **nombrando la dependencia** (`REQ-STR-006`).
2.2. Si quien intenta operar es la Subcomisión, GEI deniega la operación explicando que la estructura no está disponible para la Subcomisión.
2.3. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.4. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-STR-005` (P) · `REQ-STR-006` (P) · `REQ-STR-008` (S) · `REQ-PPL-015` (S) · `REQ-EVT-024` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: `REQ-STR-006` — valla de dependencias · **terminal en V1**
- Estado / objeto afectado: `Venue` archivada
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: `OUT-STR-001` — no hay reserva de canchas ni de sedes.

---

**Fin de las especificaciones STR. 15 CU · `UC-STR-01` … `UC-STR-15`.**
