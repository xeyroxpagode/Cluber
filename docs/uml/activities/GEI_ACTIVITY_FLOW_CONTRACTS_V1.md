# GEI HOCKEY MANAGEMENT SYSTEM
## ACTIVITY FLOW CONTRACTS V1

**Etapa:** 7 — Diagramas de actividad
**Artefacto:** E7-03 · Contratos funcionales (antes de dibujar)
**Rama:** `gei/e7-activity-diagrams-freeze-v1`
**Fecha:** 2026-10-08
**Regla:** ningún `.drawio` se genera hasta que estas fichas pasen validación semántica (E7-06 sobre el XML generado debe devolver exactamente estos flujos).

**Convención de IDs** (compartida con los diagramas): `A<n>` acción · `D<n>` decisión · `F<n>` finalización (Activity Final) · `M<n>` merge. Los guards usan `[ … ]` con el vocabulario canónico (PT §38). Toda acción se expresa con verbo.

---

# AD-IAM-01 · Iniciar sesión

| Campo | Valor |
|---|---|
| **Proceso** | Iniciar sesión |
| **Objetivo** | Obtener una sesión activa con destino inicial según rol o delegación, o rechazar sin sesión |
| **CU cubiertos** | UC-IAM-01 |
| **Actores/particiones** | Persona (ACT-UNAUTHENTICATED) \| GEI |
| **Trigger** | La persona indica username y contraseña para entrar a GEI |
| **Precondiciones** | Ninguna (es la puerta del sistema); el resultado depende de credencial y estado de cuenta |

**Acciones:** A1 `Indicar nombre de usuario y contraseña` → A2 `Validar credencial y estado de la cuenta` → A3 `Crear sesión autenticada` → A4 `Derivar el destino inicial según rol o delegación vigente` → A5 `Comunicar el estado «sin acceso» (sin datos ni destinos)` → A6 `Informar el fallo sin revelar si el usuario existe` (aplica limitación de intentos) → A7 `Explicar el motivo del estado de la cuenta`.

**Decisiones:** D1 `¿Credencial válida ∧ cuenta ACTIVE?` con salidas `[incorrecta]` → A6 → F1; `[cuenta PENDING ∨ DISABLED]` → A7 → F1; `[límite de intentos ∨ frecuencia superada]` → F1 (rechazo sin sesión); `[válida ∧ ACTIVE]` → A3. D2 `¿Rol interno vigente ∨ delegación con permiso?` con `[sí]` → A4 → F2; `[no]` → A5 → F3.

**Finalizaciones:** F1 rechazo sin sesión (nada cambia) · F2 sesión activa con destino según rol/delegación · F3 sesión creada en estado «sin acceso» (REQ-IAM-012: `/no-access` sin datos ni destinos).

**Rechazos:** incorrecta (sin revelar existencia del username, con limitación de intentos) · PENDING/DISABLED (motivo explicado, PROH-001/002/005) · límite superado · sin rol ni delegación (explícito, no lista vacía).

**Concurrencia:** ninguna. **Postcondiciones:** éxito ⇒ sesión vigente; rechazo ⇒ no queda sesión y nada cambia. **E6:** sin transición (la sesión no es máquina de dominio; guards de lectura sobre SM-ACCOUNT-01). **REQ/AC:** REQ-IAM-001, REQ-IAM-002, REQ-IAM-012, REQ-SYS-009. **Pasos E5:** UC-IAM-01 1–3, alt. 2.1/2.2/2.3/3.1.

---

# AD-IAM-02 · Activación de cuenta con código de un solo uso

| Campo | Valor |
|---|---|
| **Proceso** | Activar (o reactivar) una cuenta consumiendo un código de un solo uso |
| **Objetivo** | Dejar la cuenta ACTIVE mediante emisión administrativa y consumo por el titular, sin crear sesión |
| **CU cubiertos** | UC-IAM-03, UC-IAM-04 (directos); UC-IAM-05 (cola de emisión/consumo compartida — sus efectos propios: versión de credencial++, revocación total de sesiones, quedan documentados en E5/E6 y como nota del diagrama); UC-IAM-09 (guard transversal) |
| **Actores/particiones** | Administración (ACT-ADMIN) \| Titular (ACT-UNAUTHENTICATED) \| GEI |
| **Trigger** | El administrador solicita emitir un código para una cuenta PENDING o DISABLED |
| **Precondiciones** | Cuenta en `PENDING` o `DISABLED`; máx. 1 código activo por cuenta; 5 intentos fallidos de consumo invalidan el código |

**Acciones:** A1 `Solicitar emitir un código de activación` → A2 `Validar RoleAssignment ADMIN` → A3 `Reautenticar (UC-IAM-09)` → A4 `Verificar que la cuenta está PENDING o DISABLED` → A5 `Invalidar el código anterior y emitir un código nuevo de un solo uso` → A6 `Indicar el código recibido y elegir una contraseña` (Titular) → A7 `Validar el código y la política de contraseñas` → A8 `Explicar la causa preservando lo ingresado` → A9 `Invalidar el código tras 5 intentos fallidos` → A10 `Marcar la cuenta ACTIVE y el código consumido` (SM-ACCOUNT-01: `PENDING→ACTIVE` o `DISABLED→ACTIVE`) → A11 `Auditar la activación` → A12 `Comunicar que la sesión debe iniciarse aparte`.

**Decisiones:** D1 `¿REAUTHENTICATION_REQUIRED?` `[sí]` → A3 → M1 → A2; `[no ∧ ventana vigente]` → A2. D2 `¿ADMIN vigente?` `[no]` → F1 denegación sin modificar. D3 `¿Cuenta en PENDING ∨ DISABLED?` `[no]` → A8' `Rechazar la emisión explicando el estado` → F1; `[sí]` → A5. D4 `¿Código vigente ∧ contraseña conforme a la política?` `[código usado/vencido/incorrecto]` → D5 `¿5 intentos fallidos sobre el mismo código?` `[sí]` → A9 → F2 (debe solicitarse código nuevo); `[no]` → A8 → retorno a A6 (reintento acotado, no bucle infinito); `[política insatisfecha]` → A8 → retorno a A6; `[ok]` → A10.

**Finalizaciones:** F1 denegación/rechazo de emisión (nada cambia) · F2 código invalidado (nueva emisión requerida) · F3 cuenta ACTIVE sin sesión (éxito). Ningún camino termina en sesión creada.

**Rechazos:** sin ADMIN · cuenta en estado que no admite emisión · código incorrecto/vencido/usado (preserva lo ingresado) · política de contraseñas · 5 intentos. Todos conservan el estado previo; 0 éxito falso.

**Concurrencia:** ninguna. **Postcondiciones:** éxito ⇒ cuenta ACTIVE, código consumido, auditoría registrada, sin sesión. **E6:** TR-001 (`PENDING→ACTIVE`), TR-002 (`DISABLED→ACTIVE`); PROH-004 (código sobre cuenta ACTIVE no aplica). **REQ/AC:** REQ-IAM-001 (AC 3: sin sesión), REQ-IAM-003, REQ-IAM-009 (AC 2), REQ-IAM-014, REQ-IAM-015, REQ-INS-009. **Pasos E5:** UC-IAM-03 1–4, alt. 2.1/2.2/4.1; UC-IAM-04 1–3, alt. 2.1/2.2/3.1; UC-IAM-05 1–4 (nota).

---

# AD-PPL-01 · Alta de persona, vinculación de cuenta y membresía

| Campo | Valor |
|---|---|
| **Proceso** | Registrar una persona, vincular su cuenta y abrir su membresía (recorrido típico de alta) |
| **Objetivo** | Dejar a una persona registrada, con cuenta vinculada 1:1 y membresía vigente |
| **CU cubiertos** | UC-PPL-01, UC-PPL-03, UC-PPL-04; UC-IAM-09 (guard) |
| **Actores/particiones** | Administración (ACT-ADMIN) \| GEI |
| **Trigger** | El administrador inicia el registro de una persona nueva del club |
| **Precondiciones** | RoleAssignment ADMIN vigente. **Independencia documentada:** los tres CU tienen triggers propios y guards independientes; el diagrama muestra el recorrido típico, no una dependencia obligatoria entre ellos |

**Acciones:** A1 `Iniciar el registro de la persona` → A2 `Reautenticar (UC-IAM-09)` (si D1 lo exige) → A3 `Validar RoleAssignment ADMIN` → A4 `Proporcionar nombre y apellido (obligatorios) y datos opcionales` → A5 `Validar la unicidad del DNI cuando existe` → A6 `Registrar la persona` → A7 `Indicar la persona y la cuenta a vincular` → A8 `Validar que la cuenta no está vinculada y la persona no supera una cuenta` → A9 `Registrar la vinculación Person ↔ Account` → A10 `Indicar el período de la membresía` → A11 `Registrar la Membership con el período [valid_from, valid_until)`.

**Decisiones:** D1 `¿REAUTHENTICATION_REQUIRED?` `[sí]` → A2 → A3; `[no]` → A3. D2 `¿ADMIN vigente?` `[no]` → F1 denegación. D3 `¿DNI único?` `[colisión]` → A12 `Explicar la causa de la colisión` → F1 (ninguna persona creada); `[único ∨ inexistente]` → A6. D4 `¿Vínculo 1:1 posible?` `[cuenta ya vinculada ∨ persona ya con cuenta]` → A13 `Explicar el conflicto sin cambiar ninguna vinculación` → F2 (nada cambia); `[posible]` → A9. D5 `¿Persona existe para la membresía?` `[no]` → A14 `Explicar la causa` → F3; `[sí]` → A11.

**Finalizaciones:** F1/F2/F3 rechazos parciales o totales según el punto de corte (lo ya registrado se conserva; lo pendiente no se crea) · F4 persona con cuenta vinculada y membresía vigente (éxito).

**Rechazos:** denegación de autoridad · colisión de DNI · conflicto de vínculo · persona inexistente. Ningún rechazo altera datos previos.

**Concurrencia:** ninguna. **Postcondiciones:** éxito ⇒ la cuenta resuelve a exactamente una persona; la persona tiene ≤1 cuenta; toda afiliación o rol posterior exigirá membresía vigente. **E6:** sin máquina (Person; Membership = TEMPORAL_VALIDITY_MODEL). **REQ/AC:** REQ-PPL-001, REQ-PPL-003, REQ-PPL-007, REQ-IAM-014, REQ-PPL-015, REQ-IAM-009. **Pasos E5:** UC-PPL-01 1–5, alt. 2.1/2.2/4.1; UC-PPL-03 1–5, alt. 2.1/2.2/4.1; UC-PPL-04 1–4, alt. 2.1/2.2/2.3.

---

# AD-PPL-02 · Incorporación, cambio y retiro de jugadora de equipo

| Campo | Valor |
|---|---|
| **Proceso** | Ciclo de la afiliación de una jugadora a un equipo (incorporar → cambiar → retirar) |
| **Objetivo** | Mantener TeamAssignment y RoleAssignment PLAYER consistentes, con historia fechada y sin transferir la capitanía |
| **CU cubiertos** | UC-PPL-06, UC-PPL-07, UC-PPL-08; UC-PPL-02 (rechazo PLAYER_PROFILE_INCOMPLETE, SIBLING); UC-IAM-09 (guard) |
| **Actores/particiones** | Administración (ACT-ADMIN) \| GEI. *ACT-CAPTAIN es actor afectado (la capitanía se cierra), no participante* |
| **Trigger** | El administrador solicita incorporar una jugadora a un equipo |
| **Precondiciones** | ADMIN vigente; membresía de la persona vigente; combinación temporada+división+línea del equipo disponible |

**Acciones:** A1 `Solicitar la incorporación al equipo` → A2 `Reautenticar (UC-IAM-09)` (si D1) → A3 `Validar ADMIN, membresía vigente y combinación única del equipo` → A4 `Confirmar la incorporación` → A5 `Crear TeamAssignment y RoleAssignment PLAYER en una sola operación atómica` → A6 `Solicitar el traslado a otro equipo` → A7 `Validar membresía y combinación única del destino` → A8 `Cerrar con fecha la TeamAssignment y el rol PLAYER del origen` → A9 `Crear los nuevos en el equipo destino` → A10 `Explicar que la capitanía no se transfiere (se cierra en el origen)` → A11 `Solicitar el retiro del equipo` → A12 `Validar la vigencia de la TeamAssignment` → A13 `Cerrar con fecha la TeamAssignment, el rol PLAYER y el rol CAPTAIN si existía`.

**Decisiones:** D1 `¿REAUTHENTICATION_REQUIRED?` `[sí]` → A2; `[no]` → A3. D2 `¿Validaciones de incorporación ok?` `[perfil incompleto]` → A14 `Indicar qué falta del perfil (PLAYER_PROFILE_INCOMPLETE)` → F1 (no se crea afiliación ni rol; la corrección es UC-PPL-02, CU independiente); `[sin membresía vigente]` → A15 `Explicar la causa` → F1; `[sin ADMIN]` → F1 denegación. D3 `¿Solicitud posterior sobre la afiliación?` (tras A5) `[cambiar de equipo]` → A6; `[retirar del equipo]` → A11; `[ninguna por ahora]` → F2 (jugadora incorporada, afiliación vigente). D4 `¿Destino con combinación disponible?` `[no]` → A16 `Rechazar explicando la causa` → F3 (afiliación de origen se conserva); `[sí]` → A8 → A9 → A10 → F4. D5 `¿TeamAssignment vigente?` (retiro) `[no]` → A17 `Explicar el estado` → F5; `[sí]` → A13 → F6.

**Finalizaciones:** F1 rechazo de incorporación (nada creado) · F2 incorporación exitosa (fin de fase) · F3 traslado rechazado (origen se conserva) · F4 traslado aplicado (capitanía no transferida) · F5 retiro rechazado · F6 retiro aplicado (membresía NO finaliza: REQ-PPL-004).

**Rechazos:** perfil incompleto (nombra qué falta) · sin membresía · denegación · destino sin combinación · TeamAssignment no vigente. Ningún rechazo cierra la afiliación vigente.

**Concurrencia:** ninguna (la creación de afiliación+rol es UNA transacción, REQ-SYS-018; no es Fork). **Postcondiciones:** historia fechada conservada; capitanía jamás transferida automáticamente. **E6:** TeamAssignment/RoleAssignment (TEMPORAL_VALIDITY_MODEL); co-ocurrencia PLAYER+CAPTAIN (invariante E2 §7.5). **REQ/AC:** REQ-PPL-005, REQ-PPL-006, REQ-PPL-007 (AC 1–3), REQ-PPL-004, REQ-STR-004, REQ-SYS-018. **Pasos E5:** UC-PPL-06 1–4, alt. 2.1..2.4; UC-PPL-07 1–4, alt. 2.1/2.2/4.1; UC-PPL-08 1–4, alt. 2.1..2.3.

---

# AD-EVT-01 · Cambio material de evento

| Campo | Valor |
|---|---|
| **Proceso** | Editar un evento (o su logística) resolviendo cambio material, impacto, serie y concurrencia |
| **Objetivo** | Aplicar o rechazar una edición preservando la coordinación: revisión de impacto, reconfirmaciones, notificación y resolución de conflictos |
| **CU cubiertos** | UC-EVT-04, UC-EVT-11, UC-EVT-12; UC-EVT-16 (rama material; swimlane incluye a la Capitana) |
| **Actores/particiones** | Entrenador / Subcomisión / Capitana (sólo logística, scope TEAM) \| GEI |
| **Trigger** | El actor solicita editar un evento de su alcance o actualizar su logística |
| **Precondiciones** | Evento ≠ COMPLETED (edición); no terminal (logística); actor con alcance; el campo material pertenece a la lista cerrada REQ-EVT-011 (horario, fin/duración, sede, destinatarios, audiencia club, rival, CompetitionEntry, campos logísticos) — la sede como cambio material es la Regla B de REQ-STR-012 |

**Acciones:** A1 `Solicitar la edición (campos o logística)` → A2 `Validar autoridad y estado del evento` → A3 `Modificar los campos propuestos` → A4 `Elegir el alcance de serie` (sólo esta ocurrencia · esta y las siguientes · toda la serie) → A5 `Presentar el impacto: personas, roles y consecuencias sobre el conjunto real afectado (conteos derivados)` → A6 `Revisar el impacto` → A7 `Confirmar el cambio` → A8 `Presentar base local, cambios locales y versión vigente del servidor` → A9 `Declarar el valor a conservar campo por campo` → A10 `Marcar el conflicto y exigir el valor final antes de continuar` → A11 `Recalcular y revalidar el impacto al ejecutar` → A12 `Aplicar el cambio con el impacto confirmado` → A13 `Registrar los efectos de coordinación: revisión de coordinación++ en las ocurrencias afectadas · respuestas previas pasan a NECESITA_CONFIRMACIÓN · notificar a la unión de audiencias afectadas` → A14 `Registrar la corrección sin vista previa de impacto, sin revisión de coordinación, sin reconfirmación y sin notificación` → A15 `Rechazar explicando el estado actual del evento`.

**Decisiones:** D1 `¿Estado admite la operación?` `[COMPLETED ∨ terminal]` → A15 → F1 (nada cambia; COMPLETED no se reabre); `[capitana sin RoleAssignment vigente sobre el equipo]` → F1 denegación; `[admite]` → A3. D2 `¿El campo es material (REQ-EVT-011)?` `[no]` → A14 → F2 (cambio registrado sin efectos de coordinación); `[sí]` → D3. D3 `¿El evento pertenece a una serie?` `[sí]` → A4 → M1; `[no]` → M1. M1 → A5 → A6 → D4 `¿Confirmar el cambio?` `[descarta]` → F3 (el cambio no se aplica; el borrador no se descarta silenciosamente); `[confirma]` → A7 → D5 `¿STALE_VERSION al confirmar?` `[versión cambiada]` → A8 → A9 → D6 `¿Conflictos resueltos?` `[no]` → A10 → retorno a A9; `[sí]` → M2; `[versión esperada]` → M2. M2 → A11 → D7 `¿Impacto vigente y sin cambios?` `[IMPACT_CHANGED]` → A16 `Presentar el impacto nuevo` → retorno a A6 (nueva confirmación; sin éxito falso); `[IMPACT_TOKEN_EXPIRED]` → retorno a A5; `[ok]` → A12 → A13 → F4.

**Finalizaciones:** F1 rechazo por estado/autoridad · F2 cambio no material aplicado · F3 cambio material descartado · F4 cambio material aplicado con efectos de coordinación.

**Rechazos y reintentos:** COMPLETED no se reabre (PROH-026/029/030) · equipo de Match inmutable (PROH-028, se documenta; el intento es rechazo) · STALE_VERSION sin fusión automática ni sobrescritura (REQ-SYS-017) · IMPACT_CHANGED/EXPIRED re-presentan el impacto; los retornos son reintentos acotados por el token de impacto, no bucles infinitos.

**Serie:** las tres opciones de alcance tienen la MISMA consecuencia funcional (impacto sobre el conjunto real afectado, nunca sobre el total de la serie; revisión++ sólo en afectadas — REQ-EVT-015). No se dibujan como estados.

**Concurrencia:** ninguna — STALE_VERSION **no** se dibuja como Fork: es un conflicto de concurrencia optimista resuelto por reconciliación explícita campo por campo (una persona, un flujo). **E6:** TR-027/028 (ediciones material/no material), TR-018 (serie), PROH-023..030. **REQ/AC:** REQ-EVT-010, REQ-EVT-011, REQ-EVT-013, REQ-EVT-015, REQ-EVT-019, REQ-SYS-009, REQ-SYS-010, REQ-SYS-015, REQ-SYS-017, REQ-PRT-003, REQ-COM-016, REQ-STR-012 (Regla B), REQ-STR-014. **Pasos E5:** UC-EVT-04 1–5, alt. 2.1/2.2/3.1/3.2/3.3/4.1; UC-EVT-11 1–4, alt. 4.1/4.2; UC-EVT-12 1–4, alt. 3.1/4.1; UC-EVT-16 1–4, alt. 2.1/2.2/3.1.

---

# AD-EVT-02 · Creación de evento por tipo

| Campo | Valor |
|---|---|
| **Proceso** | Crear un entrenamiento, un partido o un evento del club |
| **Objetivo** | Registrar un evento que nace SCHEDULED en una sola operación, con destinatarios válidos según el tipo |
| **CU cubiertos** | UC-EVT-01, UC-EVT-02, UC-EVT-03 |
| **Actores/particiones** | Entrenador (scope TEAM) / Subcomisión (scope CLUB) \| GEI. *Player/Captain/Guardian son alcanzados, no participantes* |
| **Trigger** | El actor inicia la programación de un evento |
| **Precondiciones** | Autoridad sobre el destino; invariantes de fecha y horario; destinatarios de las listas del club |

**Acciones:** A1 `Iniciar la programación del evento` → A2 `Indicar el tipo de evento` → A3 `Proporcionar horario, sede y destinatarios (entrenamiento: listas de equipos y personas, independientes, ≥1 destino)` → A4 `Proporcionar horario, sede y exactamente un equipo destino (partido)` → A5 `Indicar si es para todo el club o dirigido (evento del club)` → A6 `Proporcionar destinatarios de equipo y de persona si es dirigido` → A7 `Validar autoridad, alcance, destino e invariantes de fecha y horario` → A8 `Validar la compatibilidad de inscripción de competencia cuando la jornada tiene competencia (partido)` → A9 `Registrar el evento SCHEDULED en la misma operación (sin borrador observable)` → A10 `Rechazar indicando la causa (nada creado)`.

**Decisiones:** D1 `¿Tipo de evento?` `[ENTRENAMIENTO]` → A3; `[PARTIDO]` → A4; `[EVENTO DEL CLUB]` → A5 → D2 `¿Alcance del club?` `[todo el club]` (0 destinos de equipo y persona) → M1; `[dirigido]` → A6 → M1. A3/A4 → M1. M1 → A7 (+A8 en la rama partido) → D3 `¿Validación ok?` `[EVENT_TARGET_INVALID (sin destino, varios equipos en partido, personas en partido, o alcance de club)]` → A10 → F1; `[sin autoridad sobre el destino]` → F1 denegación; `[invariantes de fecha/horario incumplidas]` → A10 → F1; `[jornada con competencia ∧ partido sin inscripción compatible]` → A10 → F1; `[ok]` → A9 → F2.

**Finalizaciones:** F1 rechazo sin crear nada (todas las ramas) · F2 evento SCHEDULED disponible para los alcanzados.

**Rechazos:** EVENT_TARGET_INVALID · denegación de autoridad (ADMIN no tiene autoridad deportiva) · invariantes · inscripción incompatible (REQ-CMP-005). En partido, el equipo queda inmutable una vez SCHEDULED (REQ-EVT-006) — nota del diagrama.

**Concurrencia:** ninguna (nace SCHEDULED atómicamente, REQ-EVT-009). **Postcondiciones:** éxito ⇒ Event SCHEDULED con composición por tipo; el evento del club no tiene convocatoria ni resultado pero sí admite disponibilidad (REQ-EVT-017). **E6:** TR-003 (creación→SCHEDULED, subtipos incluidos); PROH-023 (DRAFT no acepta disponibilidad — el DRAFT es transitorio no observable). **REQ/AC:** REQ-EVT-001..005, REQ-EVT-006, REQ-EVT-009, REQ-EVT-017, REQ-STR-013, REQ-CMP-005, REQ-SYS-018. **Pasos E5:** UC-EVT-01 1–5, alt. 4.1..4.3; UC-EVT-02 1–5, alt. 4.1..4.4; UC-EVT-03 1–5, alt. 4.1..4.3.

---

# AD-EVT-03 · Posponer, reanudar, cancelar y restaurar evento

| Campo | Valor |
|---|---|
| **Proceso** | Operaciones de ciclo del evento con revisión de impacto |
| **Objetivo** | Aplicar la transición de ciclo solicitada sólo con estado y autoridad válidos, con los efectos distinguibles de cada operación |
| **CU cubiertos** | UC-EVT-05, UC-EVT-06, UC-EVT-07, UC-EVT-08 |
| **Actores/particiones** | Entrenador / Subcomisión \| GEI |
| **Trigger** | El actor solicita posponer, reanudar, cancelar o restaurar un evento |
| **Precondiciones** | Según operación: `SCHEDULED` (posponer), `POSTPONED` (reanudar), `SCHEDULED ∨ POSTPONED` (cancelar), `CANCELLED` (restaurar) |

**Acciones:** A1 `Solicitar la operación de ciclo del evento` → A2 `Validar autoridad y estado del evento` → A3 `Revisar el impacto del cambio (UC-EVT-11; flujo interno en AD-EVT-01)` → A4 `Confirmar la operación sobre el impacto presentado` → A5 `Posponer: evento POSTPONED sin horario vigente; respuestas conservadas, nuevas cerradas; notifica aplazamiento` → A6 `Reanudar: indicar la fecha nueva y validar invariantes` → A7 `Reanudar: evento SCHEDULED con horario vigente; disponibilidad reabierta conservando las previas; notifica reprogramación` → A8 `Cancelar: evento CANCELLED con composición propia; consecuencia explicada; disponibilidad deja de ser acción principal; notifica cancelación` → A9 `Restaurar: evento SCHEDULED con horario vigente; revisión de coordinación++; notifica restauración` → A10 `Rechazar explicando el estado actual del evento`.

**Decisiones:** D1 `¿Operación solicitada?` `[posponer ∧ SCHEDULED]` → A3 → A4 → A5 → F1; `[reanudar ∧ POSTPONED]` → A6 → D2 `¿Invariantes de fecha/horario válidas?` `[no]` → A10 → F5 (queda POSTPONED); `[sí]` → A4 → A7 → F2; `[cancelar ∧ (SCHEDULED ∨ POSTPONED)]` → A3 → A4 → A8 → F3; `[restaurar ∧ CANCELLED]` → A3 → A4 → A9 → F4; `[estado incompatible con la operación]` → A10 → F5 (el evento conserva estado).

**Finalizaciones:** F1 evento POSTPONED (reversible por reanudación) · F2 evento SCHEDULED reanudado (disponibilidad reabierta) · F3 evento CANCELLED (terminal para la participación; restaurable por UC-EVT-08) · F4 evento restaurado a SCHEDULED · F5 rechazo, el evento conserva su estado.

**Rechazos:** estado incompatible en todas las operaciones (el rechazo explica el estado actual); sin alcance. La reanudación rechazada deja el evento POSTPONED.

**Concurrencia:** ninguna. **E6:** TR-008 (SCHEDULED→POSTPONED), TR-009 (POSTPONED→SCHEDULED), TR-010/011 (→CANCELLED), TR-012 (CANCELLED→SCHEDULED); PROH-024/025/026/030/031. **REQ/AC:** REQ-EVT-007, REQ-EVT-008, REQ-EVT-010/011 (toda posposición/cancelación/restauración es material), REQ-PRT-004, REQ-COM-014, REQ-COM-016. **Pasos E5:** UC-EVT-05 1–5, alt. 2.1/2.2; UC-EVT-06 1–4, alt. 2.1..2.3; UC-EVT-07 1–5, alt. 2.1/2.2; UC-EVT-08 1–5, alt. 2.1/2.2.

---

# AD-EVT-04 · Programación de jornada (operación masiva atómica)

| Campo | Valor |
|---|---|
| **Proceso** | Programar una jornada agrupando hasta 100 partidos en un bloque atómico |
| **Objetivo** | Crear la jornada con todos los partidos validados o no crear nada |
| **CU cubiertos** | UC-EVT-15 |
| **Actores/particiones** | Entrenador (TEAM) / Subcomisión (CLUB) \| GEI. *ADMIN sólo aporta la valla técnica de dependencias; no inicia ni cierra* |
| **Trigger** | El actor inicia la programación de una jornada con los partidos de una fecha operativa |
| **Precondiciones** | Temporada y división válidas; partidos válidos de esa temporada; cada partido pertenece a lo sumo a una jornada; si la jornada tiene competencia, cada partido usa inscripción de esa competencia compatible |

**Acciones:** A1 `Iniciar la programación de la jornada` → A2 `Indicar temporada, división, competencia de la jornada cuando corresponda y los partidos` → A3 `Rechazar por límite de lote (BULK_OPERATION_TOO_LARGE)` → A4 `Validar autoridad, pertenencia única de cada partido, temporada y reglas de inscripción` → A5 `Crear la jornada y agrupar los partidos en un bloque atómico` → A6 `Persistir el estado final en la misma operación (sin creación parcial)` → A7 `Rechazar explicando la causa (no se crea jornada ni se agrupa ningún partido)`.

**Decisiones:** D1 `¿A lo sumo 100 partidos?` `[>100]` → A3 → F1; `[≤100]` → A4. D2 `¿Validaciones ok?` `[partido de otra temporada]` → A7 → F1; `[partido ya agrupado en otra jornada]` → A7 → F1; `[jornada con competencia ∧ partido sin inscripción compatible]` → A7 → F1; `[sin autoridad]` → F1 denegación; `[algún partido no validable]` → A7 → F1 (atomicidad: GEI no crea nada); `[ok]` → A5 → A6 → F2.

**Finalizaciones:** F1 operación rechazada (0 creación parcial, 0 agrupamiento parcial) · F2 jornada creada con los partidos agrupados.

**Rechazos:** límite de lote (>100) · temporada ajena · pertenencia única · inscripción incompatible · denegación. **Ninguna ruta rechazada reporta éxito.** La validación previa no es commit: el estado final persiste en la misma operación (5.1).

**Notas:** la jornada no duplica el ciclo de vida de los partidos (los estados de los partidos no transicionan); no se basa en el CURRENT que sólo agrupa partidos preexistentes (mismatch documentado en E3 Audit §14; manda REQ-EVT-018 y PT §16).

**Concurrencia:** ninguna — el bloque es UNA transacción, no un Fork. **E6:** Jornada NO_STATE_MACHINE (contenedor atómico). **REQ/AC:** REQ-EVT-018, REQ-EVT-024, REQ-CMP-005, REQ-SYS-018. **Pasos E5:** UC-EVT-15 1–5, alt. 3.1, 4.1..4.3, 5.1.

---

# AD-PRT-01 · Respuesta de disponibilidad

| Campo | Valor |
|---|---|
| **Proceso** | Responder (o cambiar) la disponibilidad propia o del menor representado |
| **Objetivo** | Registrar con fecha una respuesta sí/quizás/no visible en el conteo del evento, sustituyendo la anterior |
| **CU cubiertos** | UC-PRT-01 |
| **Actores/particiones** | Jugadora (ACT-PLAYER) / Guardiana (ACT-GUARDIAN) \| GEI. *La capitana responde sólo con RoleAssignment PLAYER vigente (invariante E2 §7.5); el entrenador sólo observa el conteo* |
| **Trigger** | La jugadora consulta un evento con horario vigente que la alcanza y aún sin responder; o la guardiana lo hace por su menor |
| **Precondiciones** | Evento SCHEDULED que alcanza a la jugadora o al menor; `RoleAssignment PLAYER + TeamAssignment + Membership` vigentes **o** `GuardianRelationship` vigente con `can_respond_availability` |

**Acciones:** A1 `Consultar el evento que alcanza a la jugadora o al menor` → A2 `Validar el estado del evento y la autoridad del respondiente` → A3 `Responder en nombre propio (jugadora)` → A4 `Responder por el menor de la relación (guardiana; sujeto CHILD; registrada a nombre del menor y visible como del menor)` → A5 `Informar la respuesta: sí, quizás o no` → A6 `Registrar la respuesta con fecha (sustituye la anterior si existía; visible en el conteo del evento; deja de estar «necesita confirmación» cuando aplicaba)` → A7 `Explicar que el evento POSTPONED no acepta respuesta nueva y que las previas se conservan` → A8 `Explicar la denegación con su motivo`.

**Decisiones:** D1 `¿Evento SCHEDULED ∧ autoridad del respondiente?` `[POSTPONED]` → A7 → F1 (no queda respuesta nueva; la anterior se conserva); `[evento no SCHEDULED (DRAFT/terminal)]` → A8 → F1 (sólo SCHEDULED acepta; PROH-023..026/035); `[menor no alcanzado por el evento]` → A8 → F1; `[guardiana sin can_respond_availability vigente]` → A8 → F1 (con el motivo visible); `[rol sin RoleAssignment PLAYER vigente]` → A8 → F1 (ni la capitana por sí sola ni otro rol responden por sí mismos); `[jugadora con PLAYER+TeamAssignment+Membership vigentes]` → A3; `[guardiana con relación y permiso vigentes]` → A4. A3/A4 → M1 → A5 → A6 → F2.

**Finalizaciones:** F1 sin nueva respuesta (estado previo conservado) · F2 respuesta vigente registrada (sustituye la anterior; limpia «necesita confirmación» si aplicaba).

**Notas:** sin respuesta ≠ «no voy» · responder no genera notificación (REQ-COM-017) · la disponibilidad no deriva convocatoria, asistencia ni habilitación (REQ-PRT-018). `NEEDS_RECONFIRMATION` es derivado de coordinación (REQ-PRT-003), no un estado persistido.

**Concurrencia:** ninguna (cada respuesta es una fila por persona/evento; las respuestas de varias jugadoras son procesos independientes, no Fork). **E6:** SM-AVAILABILITY-01 TR-034/035 (+TR-037 derivada). **REQ/AC:** REQ-PRT-001, REQ-PRT-002, REQ-PRT-003, REQ-PRT-004, REQ-PRT-018, REQ-PRT-019, REQ-COM-017, REQ-PPL-008. **Pasos E5:** UC-PRT-01 1–4, alt. 2.1..2.5, 4.1, 4.2.

---

# AD-PRT-02 · Preparar y publicar la convocatoria de un partido

| Campo | Valor |
|---|---|
| **Proceso** | Convocatoria de un partido: borrador con autosave → revisión publicada inmutable |
| **Objetivo** | Publicar una revisión inmutable de la convocatoria, notificando altas y bajas, sin bloquearse por conflictos derivados |
| **CU cubiertos** | UC-PRT-02, UC-PRT-03; UC-PRT-04 (conflictos derivados visibles y explicados) |
| **Actores/particiones** | Entrenador (ACT-COACH) \| GEI. *Player/Guardian reciben notificación; son alcanzados, no participantes* |
| **Trigger** | El entrenador inicia la preparación de la convocatoria de un partido |
| **Precondiciones** | Evento SCHEDULED y tipo MATCH; rol COACH vigente con alcance |

**Acciones:** A1 `Iniciar la preparación de la convocatoria` → A2 `Validar autoridad y evento SCHEDULED tipo MATCH` → A3 `Armar la lista de convocadas sobre el borrador` → A4 `Guardar automáticamente los cambios (una sola operación en vuelo; el refresco de fondo no pisa lo escrito)` → A5 `Reintentar el guardado sin informar éxito falso (el estado de guardado refleja el estado real)` → A6 `Solicitar la publicación` → A7 `Esperar lo que esté en vuelo (sin coreografía de guardado y publicación)` → A8 `Validar estado SCHEDULED y autoridad` → A9 `Publicar la revisión inmutable de la convocatoria` → A10 `Dejar los conflictos derivados visibles, explicados y revisables (ELIGIBILITY_BLOCKED/PENDING, NO_LONGER_EVENT_TARGET, NO_LONGER_TEAM_AFFILIATED)` → A11 `Notificar a las agregadas y a las quitadas respecto de la revisión anterior (las que permanecen no reciben notificación)` → A12 `Comunicar que la convocatoria no aplica por tipo o estado del evento` → A13 `Rechazar la publicación conservando el borrador` → A14 `Armar una revisión nueva sobre el borrador (sin reescribir la anterior)`.

**Decisiones:** D1 `¿Evento SCHEDULED ∧ MATCH ∧ con alcance?` `[no aplica por tipo/estado]` → A12 → F1 (matriz de aplicabilidad REQ-PRT-019); `[sin alcance]` → F1 denegación; `[ok]` → A3. Bucle de edición: A3 → A4 → D2 `¿Guardado exitoso?` `[fallo]` → A5 → retorno a A4; `[ok]` → D3 `¿Publicar ahora?` `[seguir editando]` → retorno a A3; `[publicar]` → A6 → A7 → A8 → D4 `¿SCHEDULED ∧ autoridad?` `[no]` → A13 → F2 (borrador se conserva); `[sí]` → A9 → D5 `¿Conflictos de habilitación en alguna convocada?` `[sí]` → A10 → M1 (la publicación prospera igual — REQ-PRT-006); `[no]` → M1. M1 → A11 → D6 `¿Se publica otra revisión después?` `[sí]` → A14 → retorno a A3; `[no]` → F3.

**Finalizaciones:** F1 convocatoria no aplicable · F2 publicación rechazada (borrador conservado) · F3 revisión PUBLISHED inmutable notificada.

**Rechazos:** tipo/estado no aplicables · denegación · no SCHEDULED al publicar. La publicación **no se bloquea** por conflictos derivados (PROH-041). Ninguna ruta reescribe una revisión publicada (PROH-039).

**Concurrencia:** ninguna — «esperar lo en vuelo» es una espera secuencial dentro de una operación, no un Fork. **E6:** SM-SELECTIONREV-01 TR-045/046/047. **REQ/AC:** REQ-PRT-005, REQ-PRT-006, REQ-PRT-008, REQ-PRT-019, REQ-COM-015, REQ-PRT-017 (coach ve estado, no motivo). **Pasos E5:** UC-PRT-02 1–5, alt. 2.1/2.2/4.1/4.2; UC-PRT-03 1–5, alt. 2.1/2.2/4.1/5.1; UC-PRT-04 1–3, alt. 3.1/3.2.

---

# AD-PRT-03 · Registrar, cerrar y corregir asistencia

| Campo | Valor |
|---|---|
| **Proceso** | Asistencia de un evento: marcar con planilla OPEN, cerrar y corregir sobre planilla cerrada |
| **Objetivo** | Persistir la asistencia real con evidencia de corrección, sin reapertura y sin éxito falso |
| **CU cubiertos** | UC-PRT-05, UC-PRT-06, UC-PRT-07 |
| **Actores/particiones** | Entrenador (ACT-COACH) \| GEI |
| **Trigger** | El entrenador inicia la carga de la planilla de un evento |
| **Precondiciones** | Evento SCHEDULED o IN_PROGRESS (registro) / SCHEDULED, IN_PROGRESS o COMPLETED (cierre); tipo TRAINING o MATCH; planilla OPEN para marcaje nuevo |

**Acciones:** A1 `Iniciar la carga de la planilla` → A2 `Validar autoridad, estado del evento, tipo aplicable y planilla OPEN` → A3 `Marcar la asistencia de cada jugadora: presente, ausente o justificada` → A4 `Persistir cada valor de inmediato y presentar el conteo vivo` → A5 `Solicitar el cierre de la planilla` → A6 `Confirmar el cierre` → A7 `Registrar la marca de cierre (planilla CLOSED, distinguible de abierta)` → A8 `Comunicar que la planilla CLOSED no admite marcaje nuevo y que la corrección es la vía (UC-PRT-07)` → A9 `Identificar el valor mal cargado` → A10 `Indicar el valor nuevo y el motivo escrito` → A11 `Validar autoridad y motivo` → A12 `Persistir valor anterior, valor nuevo, motivo, autor y fecha (antes y después visibles al consultar)` → A13 `Rechazar el cierre explicando el estado` → A14 `Explicar que la operación no completa sin motivo escrito`.

**Decisiones:** D1 `¿Planilla OPEN ∧ evento y tipo aplicables?` `[planilla CLOSED]` → A8 → D3 `¿Corregir un valor?`; `[tipo no admite asistencia]` → A15 `Comunicar la matriz de aplicabilidad` → F1; `[sin autoridad]` → F1 denegación; `[ok]` → A3 → A4 → D2 `¿Cerrar la planilla ahora?` `[seguir marcando]` → retorno a A3; `[cerrar]` → A5 → A6 → A7 → D3. D3 `¿Corregir un valor?` `[sí]` → A9 → A10 → D4 `¿Motivo escrito válido?` `[sin motivo]` → A14 → retorno a A10; `[con autoridad y motivo]` → A12 → F3; `[no]` → F2 (planilla CLOSED; valores vigentes).

**Finalizaciones:** F1 operación no aplicable o denegada · F2 planilla CLOSED con valores vigentes · F3 valor corregido con evidencia (la planilla sigue CLOSED; el ciclo de vida de nada retrocede).

**Rechazos:** planilla CLOSED para marcaje nuevo (PROH-042) · reapertura inexistente (PROH-043: no es requisito, CON-13; la corrección la cubre) · corrección sin motivo (no completa; PROH-048 análogo) · registrar asistencia no notifica (REQ-COM-017). Lo no registrado queda «sin registrar», estado propio distinguible de «ausente» (REQ-PRT-010).

**Concurrencia:** ninguna (persistencia inmediata por valor, secuencia lineal). **E6:** SM-ATTENDANCEENTRY-01 TR-052/053/054; AttendanceSheet OPEN/CLOSED derivado de `closed_at`. **REQ/AC:** REQ-PRT-009, REQ-PRT-010, REQ-PRT-011, REQ-PRT-012, REQ-PRT-019, REQ-SYS-006, REQ-COM-017. **Pasos E5:** UC-PRT-05 1–4, alt. 2.1..2.3; UC-PRT-06 1–4, alt. 2.1/2.2; UC-PRT-07 1–4, alt. 3.1/3.2.

---

# AD-PRT-04 · Resultado del partido: registrar, finalizar y corregir

| Campo | Valor |
|---|---|
| **Proceso** | MatchRecord: borrador → FINAL → corrección auditada |
| **Objetivo** | Dejar el resultado oficial FINAL con estadísticas habilitadas, corrigible sólo con evidencia |
| **CU cubiertos** | UC-PRT-08, UC-PRT-09, UC-PRT-10; UC-EVT-09, UC-EVT-10 como contexto de compatibilidad |
| **Actores/particiones** | Entrenador (ACT-COACH) \| GEI. *ACT-ADMIN no registra resultados (sin autoridad deportiva; PROH-047)* |
| **Trigger** | El entrenador inicia la carga del resultado del partido terminado |
| **Precondiciones** | Evento tipo MATCH; ciclo compatible: `PLAYED/FORFEIT ⇒ evento COMPLETED`, `ABANDONED ⇒ evento ABANDONED` (MATCH_STATE_INCOMPATIBLE en caso contrario) |

**Acciones:** A1 `Iniciar la carga del resultado del partido` → A2 `Validar autoridad, tipo MATCH y compatibilidad del ciclo del evento` → A3 `Proporcionar el resultado` → A4 `Registrar el MatchRecord en DRAFT (no fija un estado que el evento no tiene)` → A5 `Solicitar la finalización del borrador` → A6 `Confirmar la finalización` → A7 `Dejar el resultado FINAL (habilita estadísticas de partidos jugados)` → A8 `Explicar que la corrección aplica sólo sobre resultados finalizados` → A9 `Indicar el marcador nuevo y el motivo escrito` → A10 `Validar autoridad y motivo` → A11 `Persistir marcador anterior, marcador nuevo, motivo, autor y fecha (el corregido queda vigente con evidencia)` → A12 `Rechazar explicando la incompatibilidad del ciclo` → A13 `Explicar que la operación no completa sin motivo escrito`.

**Decisiones:** D1 `¿Ciclo del evento compatible?` `[MATCH_STATE_INCOMPATIBLE]` → A12 → F1 (no se crea resultado); `[sin autoridad]` → F1 denegación; `[compatible]` → A3 → A4 → D2 `¿Finalizar el borrador?` `[seguir en DRAFT]` → F2 (resultado en DRAFT); `[finalizar]` → A5 → D3 `¿MatchRecord DRAFT ∧ ciclo permite?` `[no está DRAFT (un FINAL no se edita por vía normal)]` → A8 → D4; `[ciclo incompatible]` → A12 → F3 (queda DRAFT); `[ok]` → A6 → A7 → D4 `¿Corregir el resultado FINAL?` `[sí]` → A9 → D5 `¿Motivo escrito válido?` `[sin motivo]` → A13 → retorno a A9; `[ok]` → A11 → F5; `[no]` → F4.

**Finalizaciones:** F1 registro rechazado · F2 resultado en DRAFT · F3 finalización rechazada (queda DRAFT) · F4 resultado FINAL oficial · F5 resultado corregido (sigue FINAL; sin retroceso del ciclo de vida).

**Rechazos:** MATCH_STATE_INCOMPATIBLE en registro y finalización · FINAL no editable por vía normal (PROH-045; la corrección es la única vía) · corrección sin motivo (no completa) · Admin denegado. Una corrección **no** retrocede el ciclo de vida del evento ni del resultado.

**Notas de contexto:** UC-EVT-09 (completar) y UC-EVT-10 (abandonar) son los productores del estado del evento que este proceso exige; partidos jugados se derivan del resultado, nunca de la asistencia (REQ-PRT-016).

**Concurrencia:** ninguna. **E6:** SM-MATCHRECORD-01 TR-055/056/057; SM-EVENT TR-040/041; PROH-045..048. **REQ/AC:** REQ-PRT-013, REQ-PRT-014, REQ-PRT-015, REQ-PRT-016, REQ-PRT-019, REQ-SYS-006, REQ-COM-017. **Pasos E5:** UC-PRT-08 1–4, alt. 2.1/2.2; UC-PRT-09 1–4, alt. 2.1..2.3; UC-PRT-10 1–4, alt. 2.1/3.1/3.2.

---

# AD-COM-01 · Publicación de comunicado con audiencia snapshot

| Campo | Valor |
|---|---|
| **Proceso** | Comunicado oficial: redactar → publicar (snapshot) → corregir/archivar |
| **Objetivo** | Publicar un comunicado a una audiencia fijada como snapshot inmutable, corrigiendo sólo texto y archivando sin perder historia |
| **CU cubiertos** | UC-COM-01, UC-COM-02, UC-COM-03, UC-COM-04 |
| **Actores/particiones** | Subcomisión (ACT-SUBCOMMITTEE) \| GEI. *El comunicado oficial es sólo de la Subcomisión (REQ-COM-001); la Administración no publica* |
| **Trigger** | La Subcomisión inicia la redacción de un comunicado oficial |
| **Precondiciones** | RoleAssignment SUBCOMMITTEE vigente; audiencia = club entero o conjunto real de equipos de las listas del club (nunca texto libre) |

**Acciones:** A1 `Iniciar la redacción del comunicado` → A2 `Validar RoleAssignment SUBCOMMITTEE` → A3 `Escribir título y cuerpo; elegir audiencia (club entero o conjunto real de equipos)` → A4 `Validar la audiencia como conjunto real` → A5 `Registrar el comunicado en DRAFT con su audiencia` → A6 `Solicitar la publicación` → A7 `Validar rol vigente, estado DRAFT y audiencia` → A8 `Confirmar la publicación` → A9 `Publicar: audiencia fijada como snapshot inmutable; notificar a las alcanzadas con tipo distinguible` → A10 `Denegar: el comunicado oficial es sólo de la Subcomisión` → A11 `Rechazar la audiencia (no queda borrador)` → A12 `Rechazar la publicación (queda DRAFT)` → A13 `Indicar la corrección de texto y el motivo` → A14 `Validar estado PUBLISHED y motivo` → A15 `Corregir título o cuerpo conservando el texto anterior en historia (audiencia intacta)` → A16 `Explicar que un error de audiencia exige un comunicado nuevo` → A17 `Explicar que la operación no completa sin motivo` → A18 `Solicitar el archivo` → A19 `Validar estado PUBLISHED` → A20 `Archivar conservando contenido e historia`.

**Decisiones:** D1 `¿SUBCOMMITTEE vigente?` `[otro rol (incluida Administración)]` → A10 → F1; `[sí]` → A3. D2 `¿Audiencia válida?` `[conjunto irreal/texto libre]` → A11 → F1; `[válida]` → A5 → D3 `¿Publicar?` `[publicar]` → A6 → A7 → D4 `¿DRAFT ∧ rol vigente?` `[no]` → A12 → F2; `[sí]` → A8 → A9 → D5; `[redactar más]` → retorno a A3. D5 `¿Acción posterior?` `[corregir texto]` → A13 → D6 `¿Motivo escrito?` `[sin motivo]` → A17 → retorno a A13; `[con motivo]` → A14 → D7 `¿Error de texto (no de audiencia)?` `[error de audiencia]` → A16 → F3 (corresponde comunicado nuevo; la audiencia jamás cambia); `[error de texto]` → A15 → F4; `[archivar]` → A18 → A19 → A20 → F5; `[nada]` → F6.

**Finalizaciones:** F1 denegación de rol o audiencia inválida (sin borrador) · F2 publicación rechazada (queda DRAFT) · F3 corrección de audiencia imposible (comunicado nuevo) · F4 texto corregido con historia · F5 comunicado ARCHIVED · F6 comunicado PUBLISHED vigente.

**Rechazos:** rol ≠ Subcomisión (PROH-053) · audiencia no conjunto real · publicar sin DRAFT · corregir sin motivo · cambiar audiencia en PUBLISHED (PROH-051/052: jamás; snapshot inmutable desde REQ-COM-003) · ARCHIVED→PUBLISHED (PROH-055).

**Concurrencia:** ninguna. **E6:** SM-ANNOUNCEMENT-01 TR-058..061. **REQ/AC:** REQ-COM-001, REQ-COM-002, REQ-COM-003, REQ-COM-004 (AC 3), REQ-COM-005, REQ-COM-015, REQ-PPL-015. **Pasos E5:** UC-COM-01 1–4, alt. 2.1/2.2; UC-COM-02 1–4, alt. 2.1/2.2/4.1; UC-COM-03 1–4, alt. 3.1..3.3; UC-COM-04 1–4, alt. 2.1/2.2.

---

# AD-CMP-01 · Ciclo de competencia e inscripción (TEAM/LINE)

| Campo | Valor |
|---|---|
| **Proceso** | Competencia: registrar → activar → inscribir (TEAM o LINE) → activar inscripción → finalizar → cerrar |
| **Objetivo** | Dejar la competencia CLOSED habiendo finalizado todas sus inscripciones activas, con scopes de dato coherentes |
| **CU cubiertos** | UC-CMP-01..07; UC-IAM-09 (guard) |
| **Actores/particiones** | Subcomisión / Administración \| GEI |
| **Trigger** | La Subcomisión o la Administración inicia el registro de una competencia |
| **Precondiciones** | RoleAssignment SUBCOMMITTEE o ADMIN vigente. TEAM y LINE son **alcances de dato**, no scopes de actor (E2 §9.2) ni estados |

**Acciones:** A1 `Registrar la competencia (nace DRAFT)` → A2 `Reautenticar (UC-IAM-09)` (si D1) → A3 `Solicitar la activación` → A4 `Activar la competencia (admite inscripciones)` → A5 `Inscribir un equipo o una línea` → A6 `Validar competencia ACTIVE y existencia del equipo (scope de dato TEAM, identificado por team_id)` → A7 `Validar competencia ACTIVE, existencia de la línea y temporada válida (scope de dato LINE, identificado por división+línea+temporada)` → A8 `Registrar la inscripción en PENDING` → A9 `Solicitar la activación de la inscripción` → A10 `Activar la inscripción (usable por partidos de esa competencia)` → A11 `Solicitar la finalización de la inscripción` → A12 `Finalizar la inscripción (serializada si está en uso; histórico conservado)` → A13 `Solicitar el cierre de la competencia` → A14 `Validar estado ACTIVE y 0 inscripciones activas` → A15 `Cerrar la competencia (histórico conservado)` → A16 `Rechazar explicando el estado o la causa`.

**Decisiones:** D1 `¿REAUTHENTICATION_REQUIRED?` `[sí]` → A2 → A3; `[no]` → A3. D2 `¿Competencia DRAFT?` `[no]` → A16 → F1; `[sí]` → A4 → D3 `¿Qué se inscribe?` `[equipo]` → A6 → D4; `[línea]` → A7 → D4. D4 `¿Validación ok?` `[competencia no ACTIVE]` → A16 → F1; `[sin rol]` → F1 denegación; `[ok]` → A8 → D5 `¿Continuar el ciclo de la inscripción?` `[activar]` → A9 → D6 `¿Alcance compatible con el uso previsto?` `[COMPETITION_SCOPE_MISMATCH]` → A16 → F2 (queda PENDING); `[compatible]` → A10 → D7; `[finalizar]` → A11 → D7. D7 `¿Inscripción ACTIVE ∧ no en uso conflictivo?` `[serialización en curso]` → espera acotada → A12; `[ok]` → A12 → D8 `¿Cerrar la competencia?` `[sí]` → A13 → A14 → D9 `¿0 inscripciones activas?` `[hay activas]` → A16' `Rechazo explicándolas (finalizarlas primero, UC-CMP-07)` → F3 (queda ACTIVE); `[0 activas]` → A15 → F4; `[no]` → F5.

**Finalizaciones:** F1 activación/inscripción rechazada · F2 activación de inscripción rechazada (queda PENDING) · F3 cierre rechazado con inscripciones activas nombradas · F4 competencia CLOSED · F5 inscripciones ENDED, competencia sigue ACTIVE.

**Rechazos:** estado inválido en cada paso · scope incompatible (PROH-066) · cerrar con inscripciones activas (PROH-062, se explican) · ENDED→ACTIVE (PROH-067) · CLOSED→ACTIVE (PROH-063). La serialización de la finalización es una espera de una transacción (REQ-SYS-018), **no** un Fork.

**Concurrencia:** ninguna. **E6:** SM-COMPETITION-01 TR-062..064; SM-COMPETITIONENTRY-01 TR-065..068; PROH-062..068. **REQ/AC:** REQ-CMP-001..005, REQ-CMP-006 (lista blanca de referencias, contextual), REQ-SYS-018, REQ-IAM-009. **Pasos E5:** UC-CMP-01 1–4; UC-CMP-02 1–4; UC-CMP-03 1–4, alt. 2.1..2.3; UC-CMP-04 1–4, alt. 2.1..4.1; UC-CMP-05 1–4, alt. 2.1..4.1; UC-CMP-06 1–4, alt. 2.1..2.3; UC-CMP-07 1–4, alt. 2.1..2.3.

---

# REGLA TRANSVERSAL DE REAUTENTICACIÓN (todos los diagramas)

`REAUTHENTICATION_REQUIRED` se representa exclusivamente como **decisión D-REAUTH** con dos salidas: `[ventana vigente]` continúa sin repetir el desafío; `[sin ventana]` → acción `Reautenticar (UC-IAM-09)` → merge → continúa. Aparece sólo en AD-IAM-02, AD-PPL-01, AD-PPL-02 y AD-CMP-01, que son los procesos sensibles de los dominios con derivación documentada en E5. **No** se dibuja en procesos deportivos (EVT/PRT/COM) porque ninguna autoridad los enumera como sensibles. No es `include` obligatorio global (E4 INC-01, 0 aristas).

# REGISTRO DE VALIDACIÓN SEMÁNTICA PREVIA A LA GENERACIÓN

| Verificación | Resultado |
|---|---|
| Toda acción con fuente funcional (REQ/paso E5) | PASS — 0 acciones inventadas |
| Toda decisión con guards explícitos y salidas excluyentes | PASS |
| Toda ruta de rechazo termina sin éxito | PASS |
| Retornos de reintento acotados (sin bucles infinitos) | PASS — códigos de límite (5 intentos, token de impacto, motivo) documentados |
| Fork/Join | **0** — sin concurrencia respaldada (AUD-ACT-01) |
| Transiciones E6 usadas | Sólo TR permitidas; 0 transiciones prohibidas dibujadas | PASS |
| Consistencia de actores (E2) | CAPTAIN sólo inicia logística (AD-EVT-01 lane); Guardian sólo vía GuardianRelationship (AD-PRT-01); ADMIN sin autoridad deportiva | PASS |
| Independencia de CU en procesos compuestos | Documentada por ficha | PASS |

**E7-03: PASS.** Los contratos habilitan la generación Draw.io (E7-04).
