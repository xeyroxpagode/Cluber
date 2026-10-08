# GEI HOCKEY MANAGEMENT SYSTEM
## UC SPECIFICATIONS — PPL (People & Relationships) V1

**Etapa:** 5 — Especificaciones de TODOS los casos de uso
**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-07
**Rama:** `gei/e5-use-case-specifications-freeze-v1`
**Plantilla:** `GEI_USE_CASE_SPECIFICATION_STANDARD_V1.md`
**CU:** 17 — `UC-PPL-01` … `UC-PPL-17`

> Los CU de gestión sensible (`UC-PPL-01` … `UC-PPL-12`) llevan la derivación transversal a
> `UC-IAM-09` cuando se cumple `REAUTHENTICATION_REQUIRED` (E4 V1.0.1 INC-01, 0 aristas UML).

---

## CASO DE USO: UC-PPL-01 · Registrar una persona

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración dar de alta en el club a una persona con su identidad real, sin que eso la convierta en jugadora ni le dé acceso.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- Si se informa DNI, no colisiona con otra persona.
Postcondiciones:
- Éxito: existe una `Person` con nombre y apellido; el DNI, si existe, queda único; el resto de los datos es opcional y la inexistencia se declara, no se disimula.
- Rechazo: no se crea ninguna persona.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El administrador inicia el registro de una persona nueva del club.
2. GEI valida el `RoleAssignment ADMIN` vigente.
3. El administrador proporciona nombre y apellido, y el resto de los datos que tenga.
4. GEI valida la unicidad del DNI cuando existe.
5. GEI registra la persona.

Camino alternativo:
2.1. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.2. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.
4.1. Si el DNI informado colisiona con otra persona, GEI rechaza la operación explicando la causa.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PPL-001` (P) · `REQ-PPL-011` (S) · `REQ-PPL-015` (S) · `REQ-IAM-014` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: nombre y apellido obligatorios; DNI único cuando existe; no hay eliminación permanente (`REQ-PPL-015`)
- Estado / objeto afectado: `Person` creada
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: registrar la persona no la convierte en jugadora: eso es `UC-PPL-06`; ni le da acceso: eso es `UC-PPL-03`.

---

## CASO DE USO: UC-PPL-02 · Completar el perfil de una jugadora

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración dejar el perfil de una jugadora con los seis datos que el club necesita, para que no quede bloqueada en su participación.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: `ACT-PLAYER` (recibe el aviso de qué falta)
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- La persona tiene `TeamAssignment` vigente.
Postcondiciones:
- Éxito: los seis datos del perfil están; ya no se emite `PLAYER_PROFILE_INCOMPLETE`.
- Rechazo: el perfil queda como estaba; el aviso de qué falta sigue vigente.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El administrador identifica una jugadora con perfil incompleto.
2. GEI valida el `RoleAssignment ADMIN` vigente y el `TeamAssignment` vigente de la jugadora.
3. El administrador completa los seis datos que faltan del perfil.
4. GEI valida los datos y registra el perfil completo, dejando de emitir `PLAYER_PROFILE_INCOMPLETE`.

Camino alternativo:
2.1. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.2. Si falta alguno de los seis datos, GEI lo indica diciendo **qué** falta, en lugar de un bloqueo sin explicación.
2.3. Si la jugadora no tiene `TeamAssignment` vigente, GEI rechaza la operación explicando la causa.
2.4. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PPL-002` (P) · `REQ-PPL-013` (S) · `REQ-PPL-011` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: `REQ-PPL-011` — autoridad por campo: la jugadora no edita lo que administra el club
- Estado / objeto afectado: `Person` con los seis datos del perfil de jugadora completos
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: el camino de la jugadora es enterarse y avisar: `UC-PPL-15`. SIBLING de `UC-PPL-06` (E4 EXT-06): la incorporación rechaza el perfil incompleto, no incorpora la corrección.

---

## CASO DE USO: UC-PPL-03 · Vincular una cuenta a una persona

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración hacer que la cuenta de acceso de una persona resuelva exactamente a ella y que ella resuelva a una sola cuenta.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- La `Person` existe.
- La `Account` no está vinculada a otra persona.
Postcondiciones:
- Éxito: la cuenta resuelve a exactamente una persona y la persona tiene como máximo una cuenta.
- Rechazo: no cambia ninguna vinculación.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El administrador solicita vincular la cuenta de acceso de una persona ya registrada.
2. GEI valida el `RoleAssignment ADMIN` vigente.
3. El administrador indica la persona y la cuenta.
4. GEI valida que la cuenta no está vinculada a otra persona y que la persona no supera una cuenta.
5. GEI registra la vinculación.

Camino alternativo:
2.1. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.2. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.
4.1. Si la cuenta ya está vinculada a otra persona o la persona ya tiene una cuenta, GEI rechaza la operación explicando el conflicto.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PPL-003` (P) · `REQ-IAM-014` (S) · `REQ-IAM-003` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: `REQ-IAM-014` — username único e inmutable; no existe operación de modificarlo
- Estado / objeto afectado: `Person` ↔ `Account` vinculadas uno a uno
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: objetivo distinto de `UC-PPL-01` con resultado distinto: la identidad ya existe; lo que se resuelve es **quién** entra.

---

## CASO DE USO: UC-PPL-04 · Registrar una membresía al club

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración dejar constancia de que una persona pertenece al club desde una fecha y hasta otra.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- La `Person` existe.
Postcondiciones:
- Éxito: el período de membresía queda registrado; toda afiliación o rol interno posterior exige membresía vigente.
- Rechazo: no se registra ninguna membresía.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El administrador registra la pertenencia de una persona al club.
2. GEI valida el `RoleAssignment ADMIN` vigente y que la persona existe.
3. El administrador indica el período de la membresía.
4. GEI registra la membresía con su período `[valid_from, valid_until)`.

Camino alternativo:
2.1. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.2. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.
2.3. Si la persona no existe, GEI rechaza la operación explicando la causa.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PPL-004` (P) · `REQ-PPL-016` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: `REQ-PPL-007` — la membresía es un período propio, distinto de afiliaciones y roles · la membresía no habilita por sí sola el acceso (`REQ-IAM-012`)
- Estado / objeto afectado: `Membership` con período registrado
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: el cierre de la pertenencia es `UC-PPL-05`.

---

## CASO DE USO: UC-PPL-05 · Finalizar una membresía al club

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración cerrar la pertenencia de una persona al club sin borrar su historia, con fecha de cierre.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- La membresía está vigente.
- No hay afiliaciones ni roles internos con dependencia activa.
Postcondiciones:
- Éxito: el período queda cerrado con fecha; el período anterior se conserva siempre.
- Rechazo: la membresía queda vigente; nada cambia.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El administrador solicita cerrar la pertenencia de una persona al club.
2. GEI valida el `RoleAssignment ADMIN` vigente, la vigencia de la membresía y la ausencia de dependencias activas.
3. El administrador confirma la finalización.
4. GEI cierra el período de la membresía con fecha, conservando la historia.

Camino alternativo:
2.1. Si la persona tiene afiliaciones o roles internos con dependencia activa, GEI rechaza la operación **nombrando la dependencia**; el período se conserva.
2.2. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.3. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PPL-004` (P) · `REQ-PPL-015` (S) · `REQ-PPL-006` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: `REQ-PPL-006` — la valla de dependencias · `REQ-PPL-015` — no hay eliminación permanente; el período se conserva · `OUT-PPL-002`
- Estado / objeto afectado: `Membership` cerrada con fecha; el pasado se conserva
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: finalizar la membresía no retira a nadie de un equipo: eso es `UC-PPL-08`.

---

## CASO DE USO: UC-PPL-06 · Incorporar una jugadora a un equipo

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración poner a una jugadora en un equipo con su afiliación y su rol de jugadora, en una sola operación atómica.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- La persona tiene membresía vigente.
- La combinación temporada + división + línea del equipo está disponible.
Postcondiciones:
- Éxito: en una sola operación atómica quedan la `TeamAssignment` y el `RoleAssignment PLAYER` sobre ese equipo; si el equipo es `CAPTAIN`, además queda `CAPTAIN`.
- Rechazo: no se crea ninguna afiliación ni rol.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El administrador incorpora a una jugadora a un equipo del club.
2. GEI valida el `RoleAssignment ADMIN` vigente, la membresía vigente de la persona y la combinación única del equipo.
3. El administrador confirma la incorporación.
4. GEI crea en una sola operación atómica la `TeamAssignment` y el `RoleAssignment PLAYER` sobre ese equipo.

Camino alternativo:
2.1. Si el perfil de la jugadora está incompleto, GEI rechaza la operación indicando **qué** falta (`PLAYER_PROFILE_INCOMPLETE`).
2.2. Si la persona no tiene membresía vigente, GEI rechaza la operación explicando la causa.
2.3. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.4. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PPL-005` (P) · `REQ-PPL-007` (P) · `REQ-PPL-004` (S) · `REQ-PPL-006` (S) · `REQ-PPL-002` (S) · `REQ-STR-004` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: la incorporación es atómica (`REQ-SYS-018`) · el entrenador se asigna **por rol**, no por afiliación · `REQ-STR-004` — combinación de equipo única
- Estado / objeto afectado: `TeamAssignment` + `RoleAssignment PLAYER` creados en una operación
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: la completitud del perfil es SIBLING (E4 EXT-06): la incorporación rechaza, no incorpora la corrección (`UC-PPL-02`).

---

## CASO DE USO: UC-PPL-07 · Cambiar de equipo a una jugadora

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración trasladar a una jugadora a otro equipo del club, cerrando lo anterior y abriendo lo nuevo, sin transferir automáticamente la capitanía.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: `ACT-CAPTAIN` (afectada: no se le transfiere la capitanía)
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- Membresía vigente de la jugadora.
- El equipo destino tiene combinación única disponible.
Postcondiciones:
- Éxito: la afiliación y el rol `PLAYER` anteriores quedan cerrados con fecha y se crean la afiliación y el rol nuevos; el sistema explica que `CAPTAIN` no se transfiere automáticamente.
- Rechazo: la jugadora queda en su equipo actual; nada cambia.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El administrador solicita trasladar a una jugadora a otro equipo.
2. GEI valida el `RoleAssignment ADMIN` vigente, la membresía y la combinación del equipo destino.
3. El administrador confirma el traslado.
4. GEI cierra con fecha la `TeamAssignment` y el rol `PLAYER` anteriores, crea los nuevos en el equipo destino, y explica que `CAPTAIN` no se transfiere automáticamente.

Camino alternativo:
2.1. Si el equipo destino no tiene combinación disponible, GEI rechaza la operación explicando la causa.
2.2. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.3. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.
4.1. Si la jugadora era capitana del equipo de origen, GEI hace explícita la consecuencia: la capitanía queda cerrada y no se transfiere.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PPL-007` (P) · `REQ-PPL-005` (S) · `REQ-PPL-015` (S) · `REQ-INS-009` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: cambiar de equipo cierra lo anterior y crea lo nuevo sin transferir `CAPTAIN` y lo explica · la historia se conserva
- Estado / objeto afectado: `TeamAssignment` y `RoleAssignment PLAYER` cerradas con fecha y creadas en el destino
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: `ACT-CAPTAIN` es actor secundario **afectado**, no participante.

---

## CASO DE USO: UC-PPL-08 · Retirar a una jugadora del equipo

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración sacar a una jugadora del equipo cerrando todo lo que le daba ese vínculo, sin borrar su historia.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: `ACT-CAPTAIN` (si existía capitanía, se cierra)
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- La `TeamAssignment` está vigente.
Postcondiciones:
- Éxito: quedan cerrados con fecha la `TeamAssignment`, el rol `PLAYER` y el rol `CAPTAIN` si existía; el pasado se conserva.
- Rechazo: la jugadora queda en el equipo; nada cambia.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El administrador solicita retirar a una jugadora de su equipo.
2. GEI valida el `RoleAssignment ADMIN` vigente y la vigencia de la `TeamAssignment`.
3. El administrador confirma el retiro.
4. GEI cierra con fecha la `TeamAssignment`, el rol `PLAYER` y el rol `CAPTAIN` si existía, conservando la historia.

Camino alternativo:
2.1. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.2. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.
2.3. Si la `TeamAssignment` no está vigente, GEI rechaza la operación explicando el estado.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PPL-007` (P) · `REQ-PPL-015` (P) · `REQ-PPL-004` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: retirar del equipo **no** finaliza la membresía (`REQ-PPL-004`): son dos CU con resultados y dependencias distintas · no hay eliminación permanente
- Estado / objeto afectado: `TeamAssignment`, `RoleAssignment PLAYER` y `RoleAssignment CAPTAIN` (si existía) cerradas con fecha
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: la membresía se cierra por `UC-PPL-05`.

---

## CASO DE USO: UC-PPL-09 · Asignar un rol con alcance

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración dar a una persona una capacidad concreta —capitana, entrenador, Subcomisión, administración— sobre un alcance concreto.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- La combinación rol + alcance pertenece a la tabla de alcances válidos.
- La membresía de la persona está vigente.
Postcondiciones:
- Éxito: el `RoleAssignment` queda vigente con su alcance; con varios roles vigentes, la autoridad es la unión evaluada por acción.
- Rechazo: no se asigna ningún rol.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El administrador asigna a una persona un rol con un alcance.
2. GEI valida el `RoleAssignment ADMIN` vigente, la membresía vigente y la combinación rol + alcance contra la tabla de alcances válidos.
3. El administrador confirma la asignación.
4. GEI registra el `RoleAssignment` vigente con su alcance.

Camino alternativo:
2.1. Si la combinación rol + alcance no pertenece a la tabla de alcances válidos, GEI rechaza la operación (`INVALID_ROLE_SCOPE`).
2.2. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.3. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.
2.4. Si la persona no tiene membresía vigente, GEI rechaza la operación explicando la causa.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PPL-006` (P) · `REQ-IAM-016` (S) · `REQ-PPL-012` (S) · `REQ-IAM-013` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: `REQ-IAM-016` — fórmula de los 6 conjunctos, default deny · `REQ-PPL-012` — un rol no es una relación de guardián · un rol expirado no computa
- Estado / objeto afectado: `RoleAssignment` vigente con alcance
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: asignar `CAPTAIN` no crea `PLAYER` si no existe: eso es `UC-PPL-06`. El cierre es `UC-PPL-10`.

---

## CASO DE USO: UC-PPL-10 · Finalizar un rol asignado

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración quitarle a una persona una capacidad que ya no corresponde, cerrando el rol con fecha.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- El rol está vigente.
Postcondiciones:
- Éxito: el `RoleAssignment` queda cerrado con fecha y deja de computar; la historia se conserva.
- Rechazo: el rol queda vigente; nada cambia.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El administrador solicita finalizar un rol asignado a una persona.
2. GEI valida el `RoleAssignment ADMIN` vigente, la vigencia del rol y la valla del último administrador.
3. El administrador confirma la finalización.
4. GEI cierra el rol con fecha; deja de computar y la historia se conserva.

Camino alternativo:
2.1. Si el comando dejaría cero administradores `ACTIVE` con alcance `CLUB`, GEI rechaza la operación (`LAST_ADMIN_REQUIRED`) y nada cambia.
2.2. Si existe una dependencia activa que exige el rol, GEI rechaza la operación nombrando la dependencia.
2.3. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.4. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PPL-006` (P) · `REQ-PPL-007` (S) · `REQ-PPL-015` (S) · `REQ-IAM-013` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: `REQ-IAM-013` — el último administrador no se puede dejar en 0 · finalizar `CAPTAIN` no cierra `PLAYER`: son roles independientes (E2 §12.1)
- Estado / objeto afectado: `RoleAssignment` cerrada con fecha; no computa
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: —

---

## CASO DE USO: UC-PPL-11 · Registrar una relación de representación

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración declarar qué adulto puede actuar por un menor y con qué permisos, creando una relación individual por menor con flags independientes.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: `ACT-GUARDIAN` (queda establecido como sujeto de la relación)
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- El sujeto es un menor.
- El adulto tiene identidad registrada.
Postcondiciones:
- Éxito: existe una `GuardianRelationship` individual para ese menor con sus flags `can_view_child_info` y `can_respond_availability`, independientes entre sí.
- Rechazo: no se registra ninguna relación.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El administrador registra la representación de un menor por un adulto.
2. GEI valida el `RoleAssignment ADMIN` vigente, que el sujeto es un menor y que el adulto tiene identidad.
3. El administrador indica los permisos de la relación: ver la información del menor y/o responder su disponibilidad.
4. GEI registra la `GuardianRelationship` individual para ese menor con sus flags.

Camino alternativo:
2.1. Si el sujeto no es un menor, GEI rechaza la operación: el sujeto delegado es siempre un menor.
2.2. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.3. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.
4.1. Si la relación queda con un solo permiso, GEI explica qué permiso falta cuando el guardián intente usar el otro.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PPL-008` (P) · `REQ-PPL-012` (S) · `REQ-PPL-009` (S) · `REQ-IAM-012` (S) · `REQ-COM-012` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: `REQ-PPL-012` — la relación no otorga rol deportivo, accesorio de comunicación ni autoridad de gestión · relación individual por menor · dos flags independientes
- Estado / objeto afectado: `GuardianRelationship` creada por menor con flags
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: el acceso del guardián nace de esta relación (`REQ-IAM-012` delegación con permiso).

---

## CASO DE USO: UC-PPL-12 · Finalizar una relación de representación

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración quitarle a un adulto la capacidad de actuar por un menor, conservando el período de la relación.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: `ACT-GUARDIAN` (deja de tener acceso)
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- La relación está vigente.
Postcondiciones:
- Éxito: la relación queda cerrada con fecha; deja de conceder acceso y conserva el período.
- Rechazo: la relación queda vigente; nada cambia.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El administrador solicita finalizar la representación de un adulto sobre un menor.
2. GEI valida el `RoleAssignment ADMIN` vigente y la vigencia de la relación.
3. El administrador confirma la finalización.
4. GEI cierra la relación con fecha; deja de conceder acceso y el período se conserva.

Camino alternativo:
2.1. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
2.2. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación.
2.3. Si la relación no está vigente, GEI rechaza la operación explicando el estado.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PPL-008` (P) · `REQ-PPL-015` (S) · `REQ-PPL-012` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: finalizada ⇒ no concede acceso; el período se conserva · `REQ-PPL-012`
- Estado / objeto afectado: `GuardianRelationship` cerrada con fecha
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: —

---

## CASO DE USO: UC-PPL-13 · Consultar la información del menor delegado

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un guardián saber cómo va su hijo o hija en el club, viendo sólo la información del menor de su relación que le corresponde.
Actores:
- Actor principal: `ACT-GUARDIAN`
- Actores secundarios: —
Precondiciones:
- `GuardianRelationship` vigente con `can_view_child_info`.
- El menor es el sujeto de la relación.
Postcondiciones:
- Éxito: el guardián ve nombre y apellido, equipo, eventos relevantes y disponibilidad relevante de su menor.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El guardián consulta la información de su menor.
2. GEI valida la `GuardianRelationship` vigente con `can_view_child_info`.
3. GEI presenta nombre y apellido, equipo, eventos relevantes y disponibilidad relevante del menor.

Camino alternativo:
2.1. Si la relación está finalizada, GEI niega el acceso: no concede nada.
2.2. Si la relación no tiene `can_view_child_info`, GEI deniega la consulta.
2.3. Si el guardián consulta por un menor que no es sujeto de ninguna relación vigente, GEI niega el acceso.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PPL-009` (P) · `REQ-PPL-008` (S) · `REQ-PPL-011` (S) · `REQ-COM-012` (S)
- Authority source: `GuardianRelationship.can_view_child_info`
- Scope: `CHILD`
- Business rules: `REQ-PPL-011` — el campo no autorizado **no existe en la respuesta**; **nunca** concede: `DNI`, fecha de nacimiento completa, información administrativa, motivo ni origen de habilitación, conversaciones privadas, auditoría, roles administrativos, `CONTACT` del menor, ni datos de otro menor (E2 §5.4)
- Estado / objeto afectado: consulta sin mutación
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: el guardián ve y modifica **sus** propios datos de contacto en `UC-PPL-17`; los del menor no se conceden automáticamente.

---

## CASO DE USO: UC-PPL-14 · Consultar quién actúa por mi cuenta

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un menor saber qué adultos pueden ver o responder por él y con qué permisos, en modo sólo lectura.
Actores:
- Actor principal: `ACT-PLAYER` (menor) · `ACT-GUARDIAN` (sobre su propia relación)
- Actores secundarios: —
Precondiciones:
- El sujeto es un menor.
- Existen relaciones de representación vigentes sobre él.
Postcondiciones:
- Éxito: el menor ve la lista de adultos y sus permisos. No hay operación de edición.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. El menor consulta quién actúa por su cuenta.
2. GEI valida su sesión y las relaciones vigentes sobre él.
3. GEI presenta la lista de adultos con los permisos de cada relación.

Camino alternativo:
2.1. Si no hay relaciones vigentes, GEI lo comunica explícitamente en lugar de mostrar una lista vacía sin explicación.
2.2. Si quien consulta es el guardián, GEI presenta su propia relación con el menor, en modo sólo lectura.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PPL-010` (P) · `REQ-PPL-008` (S)
- Authority source: `Account` propia + relación activa (lectura)
- Scope: `SELF`
- Business rules: sólo lectura; sin operación de edición · sólo relaciones vigentes · el sujeto delegado es siempre un menor
- Estado / objeto afectado: consulta sin mutación
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: `ACTOR-FEEDBACK-08` resuelto: el sujeto es siempre un menor.

---

## CASO DE USO: UC-PPL-15 · Conocer qué falta en mi perfil y cómo completarlo

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a una jugadora no quedarse bloqueada sin salida: ver qué falta en su perfil y saber que el siguiente paso es avisar a administración.
Actores:
- Actor principal: `ACT-PLAYER`
- Actores secundarios: `ACT-ADMIN` (destinatario del aviso)
Precondiciones:
- La jugadora tiene rol `PLAYER` vigente.
- El perfil de la jugadora está incompleto.
Postcondiciones:
- Éxito: la jugadora ve **qué** falta y cuál es el siguiente paso —avisar a administración—; no puede editar lo que administra el club.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. La jugadora consulta el estado de su perfil.
2. GEI valida su sesión y su rol `PLAYER` vigente.
3. GEI presenta los datos que faltan de su perfil y le indica el siguiente paso: avisar a administración.

Camino alternativo:
2.1. Si el perfil está completo, GEI lo comunica sin presentar bloqueos inexistentes.
2.2. Si la jugadora intenta editar un dato administrado por el club, GEI explica que ese dato lo administra el club y que el camino es avisar a administración.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PPL-013` (P) · `REQ-PPL-002` (S) · `REQ-PPL-011` (S) · `REQ-SYS-010` (S)
- Authority source: `Account` + sesión
- Scope: `SELF`
- Business rules: la jugadora no edita lo que administra el club · `REQ-SYS-010` — el mensaje preserva lo ingresado y explica qué hacer
- Estado / objeto afectado: consulta sin mutación
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: es el precedente de producto de `ACTOR-DECISION-01`: la jugadora sí debe poder entender su propio bloqueo. La corrección la hace administración: `UC-PPL-02`.

---

## CASO DE USO: UC-PPL-16 · Consultar mi perfil

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a cualquier persona con sesión ver quién es en el club, desde cuándo pertenece y qué roles tiene con qué alcance.
Actores:
- Actor principal: `ACT-AUTHENTICATED` (y sus 6 especializaciones concretas)
- Actores secundarios: `ACT-GUARDIAN` (conmutador de menor)
Precondiciones:
- Sesión vigente.
Postcondiciones:
- Éxito: la persona ve identidad, pertenencia con vigencia, roles con alcance resuelto, estado de cuenta y acceso a seguridad; con varios menores, el selector cambia las proyecciones relevantes; con uno, no hay selector.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. La persona consulta su propio perfil.
2. GEI valida su sesión.
3. GEI presenta identidad, pertenencia con vigencia, roles con alcance resuelto, estado de cuenta y acceso a seguridad.

Camino alternativo:
3.1. Si la persona es guardián con varios menores, el selector de menor cambia las proyecciones relevantes; con un solo menor no hay selector.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PPL-016` (P) · `REQ-IAM-012` (S) · `REQ-PPL-006` (S)
- Authority source: `Account` + sesión
- Scope: `SELF`
- Business rules: cambiar de menor cambia la **proyección**, no el actor (E2 §5.6) · `REQ-IAM-012` — el acceso depende de rol o delegación
- Estado / objeto afectado: consulta sin mutación
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: —

---

## CASO DE USO: UC-PPL-17 · Editar mi contacto

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a cualquier persona con sesión mantener su teléfono y su correo al día. El guardián también mantiene los suyos propios.
Actores:
- Actor principal: `ACT-AUTHENTICATED` (y sus 6 especializaciones concretas)
- Actores secundarios: `ACT-GUARDIAN` (también los suyos propios)
Precondiciones:
- Sesión vigente.
Postcondiciones:
- Éxito: el contacto propio queda actualizado.
- Rechazo: el contacto queda como estaba.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. La persona solicita actualizar su teléfono o su correo.
2. GEI valida su sesión.
3. La persona proporciona los datos de contacto nuevos.
4. GEI registra el contacto propio actualizado.

Camino alternativo:
3.1. Si algún dato de contacto es inválido, GEI rechaza la operación indicando la causa junto al campo, y preserva lo ingresado.
4.1. Si el actor es guardián, GEI aplica la actualización a los datos de contacto del guardián: el contacto del menor no se concede automáticamente.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-PPL-016` (P) · `REQ-PPL-009` (S) · `REQ-PPL-011` (S) · `REQ-SYS-010` (S)
- Authority source: `Account` + sesión
- Scope: `SELF`
- Business rules: `REQ-PPL-011` — autoridad por campo: el guardián modifica los suyos, no los del menor · `REQ-SYS-010` — el error preserva lo ingresado
- Estado / objeto afectado: datos de contacto propios actualizados
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: `UC-IAM-06` (cambiar la contraseña) es un CU hermano: cambia credencial, no contacto.

---

**Fin de las especificaciones PPL. 17 CU · `UC-PPL-01` … `UC-PPL-17`.**
