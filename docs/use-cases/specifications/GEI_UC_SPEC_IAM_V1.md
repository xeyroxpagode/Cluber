# GEI HOCKEY MANAGEMENT SYSTEM
## UC SPECIFICATIONS — IAM (Identity & Access) V1

**Etapa:** 5 — Especificaciones de TODOS los casos de uso
**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-07
**Rama:** `gei/e5-use-case-specifications-freeze-v1`
**Plantilla:** `GEI_USE_CASE_SPECIFICATION_STANDARD_V1.md`
**CU:** 10 — `UC-IAM-01` … `UC-IAM-10`

> Ficha académica según el modelo del profesor. El bloque `TRAZABILIDAD INTERNA GEI` complementa
> la ficha sin reemplazarla. `Autores: PENDIENTE_DATOS_ACADÉMICOS` por SPEC-FEEDBACK-01 (global).

---

## CASO DE USO: UC-IAM-01 · Iniciar sesión

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a una persona entrar a GEI con su propia credencial para poder trabajar en el sistema. La sesión creada es el punto de partida de todo acceso posterior, que dependerá del rol o delegación vigente de la persona.
Actores:
- Actor principal: `ACT-UNAUTHENTICATED`
- Actores secundarios: `ACT-AUTHENTICATED` (queda establecido como sujeto de la sesión creada)
Precondiciones:
- La persona tiene una cuenta con credencial establecida.
- La cuenta no está `DISABLED` ni `PENDING`.
- No se superó el límite de intentos de acceso.
Postcondiciones:
- Éxito: la cuenta queda con una sesión autenticada válida; el acceso a destinos depende de rol interno vigente o delegación con permiso (`REQ-IAM-012`).
- Rechazo: no queda ninguna sesión; nada cambia en la cuenta.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. La persona indica su username y su contraseña para entrar a GEI.
2. GEI valida la credencial y el estado `ACTIVE` de la cuenta.
3. GEI crea una sesión autenticada y lleva a la persona a su destino inicial según su rol o delegación vigente.

Camino alternativo:
2.1. Si la contraseña es incorrecta, GEI no crea sesión, informa el fallo sin revelar si el username existe y aplica la limitación de intentos.
2.2. Si la cuenta está `PENDING` o `DISABLED`, GEI rechaza el acceso explicando el motivo, sin crear sesión.
2.3. Si se superó el límite de intentos o de frecuencia, GEI rechaza el intento sin crear sesión.
3.1. Si la persona no tiene rol interno vigente ni delegación con permiso, GEI la deja en el estado de sin acceso, sin datos ni destinos (`REQ-IAM-012`).

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-IAM-001` (P) · `REQ-IAM-006` (S) · `REQ-IAM-008` (S) · `REQ-IAM-012` (S) · `REQ-IAM-019` (S)
- Authority source: credencial establecida; `Account` + sesión una vez creada
- Scope: `SELF`
- Business rules: `REQ-IAM-012` — la sesión por sí sola no da acceso; una cuenta `ACTIVE` sin rol ni delegación queda sin datos ni destinos
- Estado / objeto afectado: `Account` `PENDING`/`DISABLED` ⇒ acceso rechazado; sesión creada sólo con credencial válida
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: «Validar token» no es un CU (`REQ-IAM-006` es `SYSTEM_INTERNAL`). El control de acceso posterior es `CROSS_CUTTING`, no un include global.

---

## CASO DE USO: UC-IAM-02 · Deshabilitar una cuenta

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración quitarle a una persona el acceso a GEI porque su vínculo con el club cambió o dejó de ser legítimo, revocando sus sesiones sin borrar su historia.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- La cuenta objetivo existe.
- El comando no dejaría cero administradores `ACTIVE` con alcance `CLUB`.
Postcondiciones:
- Éxito: la cuenta queda `DISABLED` con su marca de deshabilitación registrada, sus sesiones quedan revocadas de inmediato y la operación queda auditada.
- Rechazo: nada cambia en la cuenta.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El administrador solicita deshabilitar la cuenta de una persona.
2. GEI verifica el `RoleAssignment ADMIN` vigente y la valla del último administrador.
3. El administrador confirma la deshabilitación.
4. GEI deja la cuenta `DISABLED`, revoca sus sesiones de inmediato y registra la operación en la auditoría.

Camino alternativo:
2.1. Si la deshabilitación dejaría cero administradores `ACTIVE` con alcance `CLUB`, GEI rechaza la operación (`LAST_ADMIN_REQUIRED`) y nada cambia.
2.2. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación sin modificar información.
2.3. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-IAM-002` (P) · `REQ-IAM-013` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: `REQ-IAM-013` (`LAST_ADMIN_REQUIRED`) · `REQ-PPL-015` (el período se conserva) · `REQ-INS-009` (auditoría)
- Estado / objeto afectado: `Account` `ACTIVE → DISABLED`; sesiones revocadas
- Includes: Ninguno. (`UC-IAM-09` es regla transversal condicional, 0 aristas UML — E4 V1.0.1 INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: deshabilitar una cuenta no otorga autoridad deportiva al administrador. La reactivación exige código nuevo: `UC-IAM-03`/`UC-IAM-04`.

---

## CASO DE USO: UC-IAM-03 · Emitir un código de activación

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración darle a una cuenta pendiente o deshabilitada una vía de entrada verificable de un solo uso, para que su titular pueda activarla o reactivarla con una contraseña que nadie más conoce.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: `ACT-UNAUTHENTICATED` (la persona titular consumirá el código en `UC-IAM-04`)
Precondiciones:
- `RoleAssignment ADMIN` vigente.
- La cuenta está `PENDING` o `DISABLED`.
Postcondiciones:
- Éxito: existe un código vigente de un solo uso para esa cuenta; todo código anterior queda invalidado; la operación queda auditada.
- Rechazo: no queda ningún código nuevo; el anterior, si existía, se conserva.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El administrador solicita emitir un código de activación para la cuenta de una persona.
2. GEI verifica el `RoleAssignment ADMIN` vigente.
3. El administrador confirma la emisión.
4. GEI invalida cualquier código anterior de esa cuenta, genera un código nuevo de un solo uso y lo deja disponible para su entrega al titular.

Camino alternativo:
2.1. Si el actor no tiene `RoleAssignment ADMIN` vigente, GEI deniega la operación sin modificar información.
2.2. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.
4.1. Si la cuenta no está `PENDING` ni `DISABLED`, GEI rechaza la emisión explicando el estado de la cuenta.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-IAM-003` (P) · `REQ-IAM-002` (S) · `REQ-IAM-014` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: máximo 1 código activo por cuenta; 5 intentos fallidos de consumo lo invalidan; `REQ-IAM-014` — el username es único e inmutable, independiente del código
- Estado / objeto afectado: código de activación: anterior invalidado, nuevo vigente
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: es la mitad **emisora** de `REQ-IAM-003`; la consumidora es `UC-IAM-04`. El código nunca se expone como literal compartido.

---

## CASO DE USO: UC-IAM-04 · Activar una cuenta con un código de un solo uso

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a una persona activar su cuenta con el código que le entregó la administración y elegir su contraseña, sin que esa activación la deje conectada.
Actores:
- Actor principal: `ACT-UNAUTHENTICATED`
- Actores secundarios: `ACT-ADMIN` (emitió el código en `UC-IAM-03`)
Precondiciones:
- La cuenta existe y está `PENDING` o `DISABLED`.
- Existe un código vigente y de un solo uso para esa cuenta.
- Quedan intentos de consumo disponibles.
Postcondiciones:
- Éxito: la cuenta queda `ACTIVE` y la operación queda auditada; no se crea sesión.
- Rechazo: la cuenta conserva su estado anterior; el trabajo ingresado se preserva.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. La persona indica el código de activación recibido y elige su contraseña.
2. GEI valida el código y la política de contraseñas.
3. GEI deja la cuenta `ACTIVE`, marca el código como consumido y registra la operación en la auditoría.

Camino alternativo:
2.1. Si el código ya fue usado, está vencido o es incorrecto, GEI rechaza el consumo, explica la causa y preserva lo ya ingresado.
2.2. Si la nueva contraseña no cumple la política, GEI rechaza la operación sin mutar nada.
3.1. Si se alcanzan 5 intentos fallidos sobre el mismo código, GEI invalida el código y explica que debe solicitarse uno nuevo a la administración.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-IAM-003` (P) · `REQ-PPL-003` (S) · `REQ-IAM-002` (S)
- Authority source: código de un solo uso emitido por `ACT-ADMIN`
- Scope: `SELF`
- Business rules: `REQ-IAM-001` AC 3 — sin sesión: la persona debe iniciar sesión aparte
- Estado / objeto afectado: `Account` `PENDING → ACTIVE` (activación) y `DISABLED → ACTIVE` (reactivación): un CU con dos precondiciones de entrada y un resultado observable idéntico
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: la vinculación persona–cuenta (`UC-PPL-03`) es condición previa documentada por `REQ-PPL-003`.

---

## CASO DE USO: UC-IAM-05 · Restablecer el acceso de una cuenta

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a la administración restablecer el acceso de una persona que perdió su credencial, invalidando credencial y sesiones previas y emitiendo un código nuevo, sin que el club conozca su contraseña.
Actores:
- Actor principal: `ACT-ADMIN`
- Actores secundarios: —
Precondiciones:
- `RoleAssignment ADMIN` vigente con alcance `CLUB`.
- La cuenta objetivo existe.
- El comando no dejaría cero administradores `ACTIVE` con alcance `CLUB`.
Postcondiciones:
- Éxito: la versión de credencial queda incrementada, todas las sesiones quedan revocadas, el código anterior queda invalidado, queda un código nuevo vigente y todo queda auditado.
- Rechazo: nada cambia en la cuenta ni en sus sesiones.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. El administrador solicita restablecer el acceso de una cuenta.
2. GEI verifica el `RoleAssignment ADMIN` con alcance `CLUB` y la valla del último administrador.
3. El administrador confirma el restablecimiento.
4. GEI incrementa la versión de credencial, revoca todas las sesiones de esa cuenta, invalida el código de activación anterior, emite un código nuevo y registra la operación en la auditoría.

Camino alternativo:
2.1. Si el restablecimiento dejaría cero administradores `ACTIVE` con alcance `CLUB`, GEI rechaza la operación (`LAST_ADMIN_REQUIRED`) y nada cambia.
2.2. Si el actor no tiene autoridad de administración, GEI deniega la operación sin modificar información.
2.3. Si se cumple `REAUTHENTICATION_REQUIRED`, GEI deriva a `UC-IAM-09` · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-IAM-004` (P) · `REQ-IAM-013` (S) · `REQ-IAM-003` (S) · `REQ-IAM-015` (S)
- Authority source: `RoleAssignment ADMIN`
- Scope: `CLUB`
- Business rules: `REQ-IAM-013` (`LAST_ADMIN_REQUIRED`) · `REQ-IAM-015` (política de contraseñas) · `OUT-IAM-003` — la recuperación self-service no es de V1
- Estado / objeto afectado: credencial `SETUP_REQUIRED` con versión incrementada; sesiones revocadas; código anterior invalidado, nuevo emitido
- Includes: Ninguno. (`UC-IAM-09` regla transversal INC-01)
- Extends: Ninguno.
- Notas de trazabilidad: no existe el CU «recuperar mi contraseña» (`OUT-IAM-003`). La persona consumirá el código nuevo en `UC-IAM-04`.

---

## CASO DE USO: UC-IAM-06 · Cambiar mi contraseña

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a una persona cambiar su propia contraseña verificando la actual, para que nadie más pueda entrar con ella.
Actores:
- Actor principal: `ACT-AUTHENTICATED` (y sus 6 especializaciones concretas)
- Actores secundarios: —
Precondiciones:
- Sesión vigente.
- La contraseña actual se verifica.
- La nueva contraseña cumple la política de contraseñas.
Postcondiciones:
- Éxito: la nueva contraseña queda aplicada y versionada.
- Rechazo: la credencial no cambia en absoluto; nunca se informa éxito sin aplicar.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. La persona solicita cambiar su contraseña.
2. La persona indica su contraseña actual y la nueva.
3. GEI verifica la contraseña actual y valida la nueva contra la política.
4. GEI aplica la nueva contraseña con su versión incrementada y confirma el cambio aplicado.

Camino alternativo:
3.1. Si la contraseña actual no corresponde, GEI rechaza la operación sin mutar nada y aplica la limitación de intentos.
3.2. Si la nueva contraseña no cumple la política, GEI rechaza la operación sin mutar nada, explica la causa y preserva lo ingresado.
4.1. Si la operación no puede confirmarse, GEI no afirma éxito: informa que el cambio no pudo confirmarse.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-IAM-005` (P) · `REQ-IAM-015` (S) · `REQ-IAM-019` (S) · `REQ-SYS-009` (S)
- Authority source: `Account` + sesión
- Scope: `SELF`
- Business rules: `REQ-IAM-015` (12–128 caracteres, Unicode, sin expiración forzada) · `REQ-SYS-009` — prohibido el éxito falso
- Estado / objeto afectado: credencial propia versionada
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: es la capacidad propia que `ACT-AUTHENTICATED` generaliza legítimamente (E2 §11.1). Cambiar contraseña no cambia el contacto: `UC-PPL-17` es un CU hermano.

---

## CASO DE USO: UC-IAM-07 · Consultar mis sesiones activas

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a una persona saber si hay un acceso abierto a su cuenta que no reconozca, viendo su sesión actual y las demás con la actual distinguida.
Actores:
- Actor principal: `ACT-AUTHENTICATED` (y sus 6 especializaciones concretas)
- Actores secundarios: —
Precondiciones:
- Sesión vigente.
- La cuenta tiene al menos una sesión abierta.
Postcondiciones:
- Éxito: la persona ve su sesión actual y sus demás sesiones activas, con la actual distinguida.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. La persona solicita revisar la seguridad de su cuenta.
2. GEI valida su sesión vigente.
3. GEI presenta la sesión actual, distinguida, y las demás sesiones activas de la cuenta con su última actividad.

Camino alternativo:
3.1. Si la cuenta no tiene otras sesiones activas, GEI lo comunica explícitamente en lugar de mostrar una lista vacía sin explicación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-IAM-010` (P) · `REQ-IAM-008` (S)
- Authority source: `Account` + sesión
- Scope: `SELF`
- Business rules: `OUT-SYS-001` — no es un historial personal de actividad
- Estado / objeto afectado: consulta sin mutación
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: la «última actividad» es estado de seguridad de la cuenta, no una línea de tiempo personal.

---

## CASO DE USO: UC-IAM-08 · Cerrar una sesión remota

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a una persona cortar de inmediato un acceso abierto a su cuenta que no reconoce, cerrando una sesión remota concreta.
Actores:
- Actor principal: `ACT-AUTHENTICATED` (y sus 6 especializaciones concretas)
- Actores secundarios: —
Precondiciones:
- Sesión vigente.
- La sesión a cerrar pertenece a la misma cuenta.
- La sesión a cerrar no es la sesión actual.
Postcondiciones:
- Éxito: esa sesión queda invalidada en el servidor de inmediato y el cierre queda auditado; desde ese equipo, cualquier operación recibe `SESSION_EXPIRED` y no ejecuta nada.
- Rechazo: la sesión apuntada no cambia.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. La persona identifica, entre sus sesiones activas, una sesión remota que no reconoce.
2. La persona solicita cerrar esa sesión remota.
3. GEI valida que la sesión pertenece a su cuenta y no es la actual.
4. GEI invalida esa sesión en el servidor de inmediato y registra el cierre en la auditoría.

Camino alternativo:
3.1. Si la sesión señalada es la sesión actual, GEI rechaza la operación: el cierre de la sesión propia no está expresado por ningún requisito (`UC-DECISION-02`, exclusión explícita).
3.2. Si la sesión no pertenece a la cuenta de la persona, GEI deniega la operación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-IAM-010` (P) · `REQ-IAM-011` (S) · `REQ-IAM-008` (S) · `REQ-INS-009` (S)
- Authority source: `Account` + sesión · autorización de autoría de la sesión
- Scope: `SELF`
- Business rules: `REQ-IAM-011` — la propagación multi-pestaña hace que el equipo remoto pierda acceso sin recarga manual
- Estado / objeto afectado: sesión remota invalidada
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: `REQ-IAM-010` dice explícitamente «sesión **remota**». No existe CU de cierre de la sesión propia.

---

## CASO DE USO: UC-IAM-09 · Reautenticar para una gestión sensible

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a un administrador o miembro de la Subcomisión volver a demostrar su identidad ante una operación sensible que su autoridad ya le permite, abriendo una ventana corta de reautenticación que habilita esa gestión.
Actores:
- Actor principal: `ACT-ADMIN`, `ACT-SUBCOMMITTEE`
- Actores secundarios: —
Precondiciones:
- La persona tiene cuenta `ACTIVE`.
- Existe una ventana de reautenticación vigente o se puede abrir una.
- La persona tiene el `RoleAssignment` de la operación sensible que va a ejecutar.
Postcondiciones:
- Éxito: la identidad queda verificada con una ventana de 10 minutos; la operación sensible queda habilitada.
- Rechazo: la operación sensible no se ejecuta.
Puntos de Extensión:
- No posee.
Prioridad: P1

Camino básico:
1. La persona con una gestión sensible por delante indica su contraseña para reautenticarse.
2. GEI verifica la credencial y el estado `ACTIVE` de la cuenta.
3. GEI abre una ventana de reautenticación de 10 minutos y habilita la gestión sensible.

Camino alternativo:
2.1. Si la credencial es incorrecta, GEI no abre la ventana y aplica la limitación de intentos.
3.1. Si la ventana ya está vencida al llegar la operación, GEI exige reautenticar de nuevo: la operación no se ejecuta con una sesión vieja.
3.2. Si pasan más de 10 minutos desde la reautenticación, la ventana vence y la operación sensible siguiente vuelve a exigir reautenticación.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-IAM-009` (P) · `REQ-IAM-001` (S) · `REQ-IAM-015` (S)
- Authority source: `RoleAssignment ADMIN` / `RoleAssignment SUBCOMMITTEE`
- Scope: `CLUB`
- Business rules: `REQ-IAM-009` AC 2 — con ventana vigente, las operaciones sensibles se autorizan sin volver a pedir la contraseña
- Estado / objeto afectado: sesión con ventana de reautenticación vigente (10 min)
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: **regla transversal condicional** (E4 V1.0.1 INC-01): cuando se cumple `REAUTHENTICATION_REQUIRED`, el CU sensible derivan aquí antes de continuar. **0 aristas UML de dominio**: ninguna autoridad enumera el perímetro de operaciones sensibles. `RWS-04`: sin superficie actual.

---

## CASO DE USO: UC-IAM-10 · Retomar el trabajo tras una interrupción de sesión

Fecha de creación: 2026-10-07
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: Permite a una persona no perder el trabajo que tenía en curso cuando su sesión se interrumpe, y poder repetir la misma intención sin duplicar efectos ni obtener éxito falso.
Actores:
- Actor principal: `ACT-AUTHENTICATED` (y sus 6 especializaciones concretas)
- Actores secundarios: —
Precondiciones:
- Había una orden en curso cuando la sesión se interrumpió.
- La interrupción no fue deliberada por la persona.
Postcondiciones:
- Éxito: el trabajo ingresado se preserva; al reintentar con la misma intención, el resultado se confirma sin duplicar y sin éxito falso.
- Rechazo: el trabajo ingresado se conserva junto al error; nada se vacía.
Puntos de Extensión:
- No posee.
Prioridad: P0

Camino básico:
1. La persona vuelve a iniciar sesión tras la interrupción.
2. GEI preserva el trabajo que la persona tenía ingresado.
3. La persona reintenta la orden con la misma intención.
4. GEI confirma el resultado sin duplicar el efecto de la orden original.

Camino alternativo:
4.1. Si el reintento llega con una intención ya ejecutada, GEI confirma el resultado existente en lugar de ejecutar de nuevo (idempotencia de la orden).
4.2. Si la confirmación no puede obtenerse, GEI no afirma éxito: informa que el resultado no pudo confirmarse y conserva el trabajo ingresado.

TRAZABILIDAD INTERNA GEI
- Requirements: `REQ-IAM-020` (P) · `REQ-SYS-016` (S) · `REQ-SYS-010` (S)
- Authority source: `Account` + sesión
- Scope: `SELF`
- Business rules: `REQ-SYS-016` — idempotencia: una intención, una orden; `REQ-SYS-010` — el error preserva lo ingresado; `REQ-IAM-008` (vigencia de sesión)
- Estado / objeto afectado: trabajo en curso / orden pendiente preservada
- Includes: Ninguno.
- Extends: Ninguno.
- Notas de trazabilidad: `RWS-08`: sin superficie actual. Es un objetivo propio: el resultado observable —no perder el trabajo y no duplicar— es distinto del objetivo del comando interrumpido.

---

**Fin de las especificaciones IAM. 10 CU · `UC-IAM-01` … `UC-IAM-10`.**
