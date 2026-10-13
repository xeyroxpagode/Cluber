# GEI HOCKEY MANAGEMENT SYSTEM
## REQUIREMENTS FREEZE V1

**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-04
**Alcance:** Requerimientos funcionales y no funcionales de V1 del sistema GEI
**Baseline de código:** `d6c7b55f9b220ad11b5e5e3d4c2195bfcfe050da`
**Rama:** `gei/e1-requirements-freeze-v1`

---

# 1. STATUS Y AUTORIDAD

Este documento es la **autoridad de requerimientos** de GEI a partir de esta fecha.

| Documento | Rol |
|---|---|
| `docs/requirements/GEI_REQUIREMENTS_FREEZE_V1.md` (este) | **Autoridad de requerimientos.** Dice qué tiene que hacer GEI, para quién, bajo qué condiciones y cómo se sabe que está cumplido. |
| `docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` | Autoridad de producto y de dominio. Este documento **no la sustituye**: la traduce a requerimientos formales. Si un requerimiento de este freeze contradice PT v1.0.1, **manda PT** y este documento debe corregirse por revisión de freeze (§82 de PT). |
| `docs/requirements/GEI_REQUIREMENTS_CATALOG_V1.md` | Catálogo completo con trazabilidad, aceptación, dependencias y estados. |
| `docs/requirements/GEI_REQUIREMENTS_RECONSTRUCTION_AUDIT_V1.md` | Proceso, evidencia, contradicciones y verificaciones. |
| `docs/requirements/GEI_REQUIREMENTS_OPEN_DECISIONS_V1.md` | 2 decisiones de producto abiertas, ninguna bloqueante. |
| `docs/GEI_FINAL_FRONTEND_FREEZE_V1.md` | Evidencia de la implementación actual. **No es autoridad de requerimientos.** |
| `src/**` | Prototipo funcional. **No es autoridad de requerimientos.** |

**Contadores del freeze:** 157 requerimientos IN · 14 DEFER · 26 OUT · 0 contradicciones bloqueantes.

**Cambio de este documento:** sólo con decisión de producto escrita, cambio de catálogo
correspondiente y verificación de los gates de §12.

---

# 2. ALCANCE DE GEI

## 2.1 Qué problema resuelve

La operación del hockey de GEI se apoya en grupos de mensajería, anotaciones manuales y planillas
separadas. Eso produce desorden, pérdida de información y dificultad para coordinar
entrenamientos, partidos, asistencia, estadísticas y comunicaciones.

**GEI centraliza la gestión deportiva y operativa del club en una aplicación web**, sustituyendo
ese circuito por información compartida, trazable y con autoridad explícita.

## 2.2 Quiénes son

| Actor | Naturaleza | Naturaleza de su autoridad |
|---|---|---|
| `Player` (jugadora) | Rol deportivo | Alcance `TEAM`. Responde su disponibilidad. No administra. |
| `Captain` (capitana) | Rol deportivo | Alcance `TEAM`. Además,**logística** de su equipo. No hereda poder de entrenador. |
| `Coach` (entrenador/a) | Rol deportivo | Alcance `TEAM` o `EVENT`. Administra los eventos de sus equipos: convocatoria, asistencia, resultado. |
| `Subcommittee` (Subcomisión de hockey) | Rol deportivo | Alcance `CLUB`. Habilitación para jugar, comunicados oficiales, competencias e inscripciones. |
| `Admin` (administración) | Rol deportivo | Alcance `CLUB`. Personas, cuentas, pertenencias, roles, representación, estructura del club, auditoría. **No es superusuario deportivo.** |
| `Guardian / responsible` (guardián) | **No es un rol.** Es una relación de delegación | Dos permisos independientes sobre cada menor: ver su información y responder su disponibilidad. |
| `Authenticated user` | Cualquiera con cuenta | Su propia información de contacto, seguridad y sesión. |
| `System` | Proceso | Deriva estados, aplica reglas, notifica, audita. |

## 2.3 Qué distingue a GEI de otras formas de llevar un club

Cinco decisiones de producto que explican casi todo el resto:

1. **`ADMIN` no es superusuario deportivo.** Administra identidad y estructura; no administra
   convocatoria, asistencia ni resultado, ni ve conversaciones privadas por su rol.
2. **`CAPTAIN` no es `COACH`.** Su única autoridad propia es la logística de su equipo.
3. **El guardián es una relación, no un rol.** Entra al mismo producto y ve sólo lo que la
   delegación permite. No existe módulo, rol ni destino de guardián.
4. **Disponibilidad, convocatoria, asistencia y habilitación son cuatro cosas distintas.** Ninguna
   se deriva de otra.
5. **La verdad tiene dueño.** Inicio, calendario, equipos, búsqueda e informes son proyecciones. Hay
   un solo dueño de escritura por hecho.

---

# 3. IN / DEFER / OUT EXPLÍCITO

## 3.1 IN — dentro de V1 (157)

| Dominio | Requerimientos | N.º |
|---|---|---:|
| **IAM** — Identity & Access | Inicio de sesión · Ciclo de vida de la cuenta · Activación con código de un solo uso · Restablecimiento administrativo · Cambio de contraseña · Sesión opaca y cookie segura · Protección CSRF · Vigencia de sesión · Reautenticación (step-up) · Visibilidad y cierre de sesiones · Propagación multi-pestaña · Control de acceso a la aplicación · Protección del último administrador · Username inmutable · Política de contraseñas · Fórmula de autorización y denegación por defecto · Fuente única de navegación y acciones · La autoridad no se reimplementa en el cliente · Limitación de intentos y frecuencia · Interrupción de sesión | 20 |
| **PPL** — People & Relationships | Persona base · Completitud del perfil de jugadora · Vinculación persona–cuenta · Membresía al club · Afiliación deportiva a equipo · Asignación de roles y alcances · Transiciones de afiliación y rol · Relación de representación con menores · PII mínima del guardián · Visibilidad de la representación sobre la propia cuenta · Autoridad por campo de datos personales · Independencia entre representación y rol · Aviso de perfil incompleto · Identidad estable del equipo · Archivo sin destruir historia · Perfil propio | 16 |
| **STR** — Club Structure | Temporada · División · Línea · Equipo · Sede · Valla de dependencias al archivar · Zona horaria · Operaciones de estructura desde el producto · Estructura no disponible para Subcomisión · Etiqueta completa de línea y equipo · Referencias por identidad, no por nombre · Identidad de sede y cambios de sede · Estructura como referencia seleccionable | 13 |
| **EVT** — Events & Calendar | Invariantes de evento · Crear entrenamiento · Crear partido · Crear evento del club · Destinatarios plurales · Equipo concreto e inmutable del partido · Ciclo de vida del evento · Estados terminales · Programar un evento · Cambio no material · Cambio material · Vista previa de impacto y reconfirmación · Reconciliación de concurrencia · Serie: existencia y creación · Serie: alcances de cambio · Serie: fin y límites · Superficie de participación del evento · Jornada: creación y agrupación · Logística del evento · Calendario como proyección · Inicio como proyección de acción · Coherencia entre proyecciones · Consulta del evento · Valla de dependencias de jornada | 24 |
| **PRT** — Participation | Responder disponibilidad propia · Responder por menor delegado · Estados derivados de disponibilidad · Condiciones de disponibilidad · Convocatoria: borrador, publicación e historial · La publicación no se bloquea por conflicto derivado · Conflictos actuales de convocatoria · Guardado automático de convocatoria · Asistencia: apertura y registro · "Sin registrar" ≠ "ausente" · Cierre de asistencia · Corrección de asistencia auditada · Resultado: borrador y finalización · Corrección de resultado · Compatibilidad resultado–ciclo del evento · Estadísticas de partido · Habilitación como condición de participación · Conceptos independientes · Aplicabilidad por tipo de evento | 19 |
| **COM** — Communication | Ciclo de vida del comunicado · Audiencia del comunicado · Fijación de la audiencia al publicar · Corrección de comunicado · Lectura restringida a la audiencia · Conversación directa · Conversación de grupo · Conversaciones canónicas de equipo y de evento · Mensajes · Edición y borrado de mensajes · Participantes y acceso temporal · Derecho comunicacional · Alcance de candidatos a participante · Tipos de notificación · Notificación por alta y baja en convocatoria · Notificación por cambio de destinatarios · Hechos que no generan notificación · Notificaciones: audiencia, deduplicación y lectura | 18 |
| **CMP** — Competition | Competencia: ciclo de vida · Cierre de competencia · Inscripción: ciclo de vida · Alcances `TEAM` y `LINE` · Uso de la inscripción en un partido · Referencia externa manual · Límite de responsabilidad federativa · Habilitación: alcance y visibilidad | 8 |
| **INS** — Search / Reports / Audit | Búsqueda · Alcance y PII de la búsqueda · Estado de la consulta en la navegación · Informe de asistencia · Informe de rendimiento · Alcance de los informes · Enlace al origen desde los informes · Auditoría: consulta · Auditoría: contenido mínimo · Auditoría: integridad · Historia: fuentes visibles · Historia no genérica | 10 |
| **SYS** — Cross-cutting | Responsive con significado preservado · Objetivos táctiles · Semántica de controles y foco · Movimiento causal y movimiento reducido · El estado se escribe, el color acompaña · Vocabulario de usuario · Una pregunta dominante y una acción primaria · Revelación progresiva · Sin éxito falso · El error preserva lo ingressado · Vacío ≠ cero ≠ error · No autorizado se oculta; bloqueado se deshabilita con razón · Navegación del navegador y enlace directo · Coherencia entre superficies · Verdad de la superficie · Idempotencia de las órdenes · Concurrencia optimista · Una orden, una transacción · Proyecciones con único dueño de escritura · Protección de datos en registros · Transporte y almacenamiento seguro · Disponibilidad, respaldo y recuperación · Rendimiento de consultas comunes · Latencia de notificación · Efectos asíncronos durables · Evolución compatible · Puerta externa de privacidad | 29 |
| **TOTAL IN** | | **157** |

## 3.2 DEFER — explícitamente pospuesto (14)

| ID | Qué | Condición de revisión |
|---|---|---|
| `DEF-IAM-001` | Preferencias de notificación por persona | Decisión de producto y modelo de preferencias |
| `DEF-COM-001` | Recordatorio automático de disponibilidad a quien no respondió | Revisión de PT §22 |
| `DEF-COM-002` | Silenciar conversaciones | Decisión de producto y modelo por conversación |
| `DEF-COM-003` | Menciones en mensajes | Modelo de menciones y reglas de notificación |
| `DEF-COM-004` | Respuestas anidadas a mensajes | Decisión sobre el modelo de hilo |
| `DEF-EVT-001` | Generación automática de las fechas de una jornada | Decisión sobre reglas de calendario |
| `DEF-PRT-001` | Flujo de justificación de asistencia con aprobación | Decisión sobre quién aprueba y con qué registro |
| `DEF-PRT-002` | Recordatorio al guardián de una respuesta pendiente del menor | Junto con `DEF-COM-001` |
| `DEF-STR-001` | Restauración de una división archivada | `REQ-DECISION-NEEDED-01` |
| `DEF-STR-002` | Restauración de una línea archivada | `REQ-DECISION-NEEDED-01` |
| `DEF-SYS-001` | Exportación de datos e informes | Decisión sobre formato, alcance y datos sensibles |
| `DEF-SYS-002` | Evidencia real de accesibilidad (zoom, auditoría automática, lector de pantalla) | Cierre de `REQ-SYS-003` con evidencia |
| `DEF-SYS-003` | Tiempos de red reales del guardado automático de convocatoria | Cierre de `REQ-PRT-008` con evidencia |
| `DEF-CMP-001` | Ampliación del conjunto de estadísticas de partido | Revisión de PT §2 |

## 3.3 OUT — fuera de V1 (26)

| ID | Qué | Por qué |
|---|---|---|
| `OUT-IAM-001` | Ingreso con proveedor externo | Excluido por PT |
| `OUT-IAM-002` | MFA y passkeys | Excluido por PT |
| `OUT-IAM-003` | Recuperación de contraseña por la propia persona | Excluido por PT; el camino vigente es administrativo |
| `OUT-PPL-001` | Tratar a la persona como "categoría" | Desviación corregida por PT |
| `OUT-PPL-002` | Eliminar permanentemente a una jugadora | La historia no se elimina |
| `OUT-STR-001` | Reserva de canchas o sedes | Excluido por PT |
| `OUT-EVT-001` | Offline-first y sincronización | Excluido por PT |
| `OUT-EVT-002` | Adjuntos de acta y fotos | Sin fuente en PT |
| `OUT-EVT-003` | Generador automático de fechas de jornada | Sin fuente en PT |
| `OUT-PRT-001` | Historia clínica completa | Sólo estado de aptitud o bloqueo |
| `OUT-PRT-002` | Expediente disciplinario o de salvaguardia | Sólo estado, motivo y vigencia |
| `OUT-COM-001` | Confirmaciones de lectura de mensajes y acuse genérico | Sin fuente en PT; excluido explícitamente |
| `OUT-COM-002` | Gestión de participantes de grupo y salir del grupo | PT no define el comando |
| `OUT-COM-003` | Deshacer genérico | Excluido explícitamente |
| `OUT-CMP-001` | Cuotas, contabilidad y gestión financiera | Excluido por PT |
| `OUT-CMP-002` | Motor de estadísticas configurable | PT fija un conjunto único |
| `OUT-CMP-003` | Integración automática con la federación | Sólo referencia manual |
| `OUT-CMP-004` | Pases y habilitaciones federativas completas | Excluido por PT |
| `OUT-INS-001` | Exportación de informes y de auditoría | Sin fuente en PT |
| `OUT-INS-002` | Cuotas y contabilidad en informes | Excluido por PT |
| `OUT-SYS-001` | Línea de tiempo personal de actividad del usuario | Excluido explícitamente |
| `OUT-SYS-002` | Reimplementar la autorización en el cliente | La autoridad se resuelve en un lugar |
| `OUT-SYS-003` | Redis, WebSocket, microservicios | Excluido por PT; arquitectura ya congelada |
| `OUT-SYS-004` | Caché de dominio autenticado persistida en el cliente | Excluido por PT |
| `OUT-SYS-005` | Notificaciones por SMS, email o push | Excluido por PT |
| `OUT-SYS-006` | Adaptar el Product Truth al código | Si discrepan, cambia el código |

---

# 4. REQUERIMIENTOS FUNCIONALES POR DOMINIO

## 4.1 IAM — Identidad y acceso

| ID | Nombre | Quién | Condición importante | Cómo se sabe que está cumplido |
|---|---|---|---|---|
| `REQ-IAM-001` | Iniciar sesión | Cualquiera con cuenta activa | Credencial establecida | Cuenta `ACTIVE` + credencial válida ⇒ sesión creada; credencial inválida ⇒ sin sesión, sin revelar si el usuario existe, con limitación de intentos |
| `REQ-IAM-002` | Ciclo de vida de la cuenta | Admin | — | `PENDING → ACTIVE ↔ DISABLED`; desactivar revoca sesiones; reactivar exige código nuevo |
| `REQ-IAM-003` | Activación con código | Admin emite · Persona consume | Código vigente y de un solo uso | Consumo ⇒ cuenta `ACTIVE`, auditado, **sin crear sesión**; 5 intentos fallidos invalidan el código; máximo 1 código activo por cuenta |
| `REQ-IAM-004` | Restablecimiento administrativo | Admin con alcance `CLUB` | No puede dejar 0 admins | Versión de credencial incrementada, sesiones revocadas, código anterior invalidado, nuevo emitido, auditado |
| `REQ-IAM-005` | Cambio de contraseña | Usuario autenticado | Verifica la actual | Nueva contraseña válida ⇒ aplicada y versionada; inválida ⇒ rechazada **sin mutar nada**; nunca se informa éxito sin aplicar |
| `REQ-IAM-006` | Sesión opaca y cookie segura | Sistema | — | Nada portador de permisos accesible a JavaScript; cookie `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/`, sin `Domain`; servidor persiste sólo digest |
| `REQ-IAM-007` | Protección CSRF | Sistema | Petición que modifica estado | Sin token vigente o con `Origin` inesperado ⇒ `CSRF_FAILED`, sin mutación; el token depende de la sesión |
| `REQ-IAM-008` | Vigencia de sesión | Sistema | — | Inactividad 12 h y absoluta 7 d ⇒ expira; el tráfico de fondo no extiende la inactividad |
| `REQ-IAM-009` | Reautenticación (step-up) | Admin · Subcomisión | Gestión sensible | Sin reautenticación ⇒ se pide contraseña; ventana de 10 min; vencido ⇒ la operación no se ejecuta |
| `REQ-IAM-010` | Visibilidad y cierre de sesiones | Usuario autenticado | — | Ve su sesión actual y las demás, distinguidas; cierra una sesión remota de forma individual con invalidación inmediata y auditoría |
| `REQ-IAM-011` | Propagación multi-pestaña | Sistema | — | Cambio de sesión en una pestaña ⇒ las demás pierden acceso sin recarga manual; sin secretos por el canal |
| `REQ-IAM-012` | Control de acceso a la aplicación | Usuario autenticado | — | Con rol interno vigente **o** delegación con permiso ⇒ acceso; sin ninguno ⇒ `/no-access` sin datos ni destinos |
| `REQ-IAM-013` | Protección del último administrador | Admin | — | Todo comando que pudiera dejar 0 admins `ACTIVE`/`CLUB` ⇒ `LAST_ADMIN_REQUIRED`, nada cambia |
| `REQ-IAM-014` | Username inmutable y único | Admin | — | Colisión sin distinción de mayúsculas ⇒ rechazada; cambiar de equipo no lo altera; no existe operación de modificación |
| `REQ-IAM-015` | Política de contraseñas | Sistema | — | 12–128 caracteres; Unicode y espacios admitidos; sin complejidad arbitraria; sin expiración forzada; nunca en claro |

## 4.2 PPL — Personas y relaciones

| ID | Nombre | Quién | Condición importante | Cómo se sabe que está cumplido |
|---|---|---|---|---|
| `REQ-PPL-001` | Persona base | Admin | — | Nombre y apellido obligatorios; DNI único cuando existe; el resto opcional |
| `REQ-PPL-002` | Perfil de jugadora completo | Admin | Asignación al roster | Faltando cualquiera de los seis datos ⇒ `PLAYER_PROFILE_INCOMPLETE` indicando qué falta |
| `REQ-PPL-003` | Vinculación persona–cuenta | Admin | — | Una persona, una cuenta como máximo; la cuenta resuelve exactamente a una persona |
| `REQ-PPL-004` | Membresía al club | Admin | — | Período registrado; afiliaciones y roles internos exigen membresía vigente; finalizar con dependencias activas ⇒ rechazado; el período queda conservado |
| `REQ-PPL-005` | Afiliación deportiva a equipo | Admin | — | Es un período propio, distinto de la membresía y de los roles; el entrenador se asigna por rol, no por afiliación |
| `REQ-PPL-006` | Roles y alcances | Admin | — | Combinación inválida ⇒ `INVALID_ROLE_SCOPE`; varios roles vigentes ⇒ unión; asignación expirada no computa |
| `REQ-PPL-007` | Transiciones de afiliación y rol | Admin | Atomicidad | Incorporar crea afiliación + rol `PLAYER` en una sola operación; cambiar de equipo cierra lo anterior y crea lo nuevo, **sin transferir `CAPTAIN`**, y lo explica; retirar cierra afiliación, `PLAYER` y `CAPTAIN` |
| `REQ-PPL-008` | Relación de representación | Admin gestiona · Guardián usa | Dos permisos independientes | Ver su información y responder disponibilidad se controlan por separado; la relación es individual por menor; al finalizar deja de conceder acceso y conserva el período |
| `REQ-PPL-009` | PII del guardián | Guardián | Sólo lo necesario | Ve nombre, equipo, eventos y disponibilidad; **no** ve documento, fecha de nacimiento, motivo ni origen de habilitación, conversaciones privadas ni auditoría; el contacto del menor no se concede automáticamente |
| `REQ-PPL-010` | Acceso de terceros sobre mí | Menor | Sólo lectura | Ve qué adultos pueden actuar por su cuenta y con qué permisos; sin operación de edición |
| `REQ-PPL-011` | Autoridad por campo | Sistema | — | Cada campo se filtra en la respuesta, no se oculta en pantalla; las reglas `Nunca` de PT §6 se cumplen (Admin no lee chats privados; capitana no ve DNI; guardián no ve otros menores) |
| `REQ-PPL-012` | Representación ≠ rol deportivo | Guardián | — | La relación no otorga rol deportivo, accesorio de comunicación ni autoridad de gestión |
| `REQ-PPL-013` | Perfil incompleto | Jugadora · Admin | — | La jugadora ve qué falta y el siguiente paso, no puede editar lo que administra el club; el siguiente paso es avisar a administración; Admin tiene la operación de corregir identidad |
| `REQ-PPL-014` | Identidad del equipo | Admin | — | Renombrar división o línea con equipos activos ⇒ rechazado; el nombre se deriva de temporada, división y línea |
| `REQ-PPL-015` | Archivo sin destruir historia | Admin | — | Retirar a una persona finaliza relaciones con fecha y conserva el pasado; no existe eliminación de historia con significado |
| `REQ-PPL-016` | Perfil propio | Usuario autenticado | — | Identidad, pertenencia con vigencia, roles con alcance resuelto, contacto editable y seguridad; con un menor no hay selector innecesario; con varios, el selector cambia las proyecciones relevantes |

## 4.3 STR — Estructura del club

| ID | Nombre | Quién | Condición importante | Cómo se sabe que está cumplido |
|---|---|---|---|---|
| `REQ-STR-001` | Temporada | Admin | — | Crear con nombre y fechas; actualizar nombre y fechas; histórica, sin eliminación; **sin ciclo de estado** |
| `REQ-STR-002` | División | Admin | — | Crear, actualizar, archivar; renombrar con equipos activos ⇒ rechazado; la historia se conserva |
| `REQ-STR-003` | Línea | Admin | — | Ídem división |
| `REQ-STR-004` | Equipo | Admin | Combinación única | `DRAFT → ACTIVE → ARCHIVED`; combinación repetida ⇒ rechazada; archivar con dependencia activa ⇒ rechazado; la creación desde el producto es requisito |
| `REQ-STR-005` | Sede | Admin | — | Nombre, dirección, etiqueta de cancha opcional; archivable; identidad estable por identificador |
| `REQ-STR-006` | Valla al archivar | Admin | — | Con dependencia activa ⇒ rechazado nombrando la dependencia; sin ella ⇒ prospera |
| `REQ-STR-007` | Zona horaria | Sistema | — | Horario mostrado en la zona del evento, no en la del servidor o del dispositivo |
| `REQ-STR-008` | Operaciones desde el producto | Admin | — | Alta, edición y archivo disponibles en el producto para cada tipo de estructura; lo que PT no habilita no está disponible |
| `REQ-STR-009` | Estructura no disponible para Subcomisión | Subcomisión | — | Acceso denegado con explicación del motivo |
| `REQ-STR-010` | Etiqueta completa | Usuario autenticado | — | La línea se identifica con división y temporada; el equipo con temporada, división y línea |
| `REQ-STR-011` | Referencias por identidad | Sistema | — | Ninguna relación se resuelve por coincidencia de texto; renombrar no reatribuye historia |
| `REQ-STR-012` | Identidad de sede y cambio de sede | Admin · Entrenador · Subcomisión | **Regla A/B** | (A) corregir identidad o metadatos de la sede ⇒ no reprograma eventos, no pide reconfirmación, no incrementa revisión de coordinación, no notifica. (B) cambiar la sede de un evento ⇒ cambio material completo |
| `REQ-STR-013` | Estructura seleccionable | Admin | — | Las divisiones, líneas y sedes se eligen de una lista, no se escriben a mano |

## 4.4 EVT — Eventos y calendario

| ID | Nombre | Quién | Condición importante | Cómo se sabe que está cumplido |
|---|---|---|---|---|
| `REQ-EVT-001` | Invariantes de evento | Sistema | — | Fin posterior al inicio; `SCHEDULED`/`IN_PROGRESS`/`COMPLETED` exigen inicio; `POSTPONED` puede no tenerlo |
| `REQ-EVT-002` | Crear entrenamiento | Entrenador (equipo o evento) · Subcomisión (club) | Con destino | Destinatarios válidos ⇒ evento creado; sin ningún destino ⇒ `EVENT_TARGET_INVALID`; Admin sin autoridad ⇒ denegado; las personas alcanzadas lo ven en sus proyecciones |
| `REQ-EVT-003` | Crear partido | Entrenador (equipo) · Subcomisión (club) | Exactamente 1 equipo | Más de un equipo, personas destino o alcance de club ⇒ `EVENT_TARGET_INVALID` |
| `REQ-EVT-004` | Crear evento del club | Entrenador (evento) · Subcomisión (club) | Club o dirigido | `club_wide` ⇒ 0 destinos de equipo y de persona; dirigido ⇒ al menos un destino; marcadores contradictorios ⇒ rechazado |
| `REQ-EVT-005` | Destinatarios plurales | Sistema | Según el tipo | Lista de equipos y lista de personas independientes, ambas plurales, presentadas en lenguaje de usuario |
| `REQ-EVT-006` | Equipo concreto del partido | Sistema | Inmutable una vez programado | Cambiar el equipo de un partido programado ⇒ rechazado; antes de programar ⇒ reprograma como cambio material |
| `REQ-EVT-007` | Ciclo de vida del evento | Entrenador · Subcomisión | Transiciones con comando | `DRAFT → SCHEDULED → {POSTPONED, CANCELLED, IN_PROGRESS}`; `POSTPONED → {SCHEDULED, CANCELLED}`; `CANCELLED → SCHEDULED` por restauración; `IN_PROGRESS → {COMPLETED, ABANDONED}`; `COMPLETED` no se reabre |
| `REQ-EVT-008` | Estados terminales | Usuario autenticado | — | `CANCELLED`, `COMPLETED`, `ABANDONED` con composición propia, explicando consecuencia, sin respuesta de disponibilidad como acción principal |
| `REQ-EVT-009` | Programar un evento | Entrenador · Subcomisión | Validación completa | El estado final se persiste en esa misma operación; no queda borrador intermedio observable |
| `REQ-EVT-010` | Cambio no material | Entrenador · Subcomisión | Título, redacción, metadatos no coordinativos | Sin vista previa de impacto, sin incremento de revisión, sin reconfirmación, sin notificación; la corrección queda registrada |
| `REQ-EVT-011` | Cambio material | Entrenador · Subcomisión | Lista cerrada | Cualquier campo material ⇒ incrementa revisión de coordinación, puede derivar reconfirmación y notifica |
| `REQ-EVT-012` | Vista previa de impacto | Entrenador · Subcomisión | Token de impacto | Impacto sobre conjuntos reales; ejecución revalida y recalcula; impacto distinto ⇒ `IMPACT_CHANGED` y nueva confirmación; vencido ⇒ `IMPACT_TOKEN_EXPIRED` |
| `REQ-EVT-013` | Reconciliación de concurrencia | Entrenador · Subcomisión · Admin | `STALE_VERSION` | Se conservan base, borrador local y versión del servidor; cada campo se declara seguro o en conflicto; sin sobrescritura genérica |
| `REQ-EVT-014` | Serie: existencia y creación | Entrenador · Subcomisión | — | Serie, destinatarios y ocurrencias persistidos; nombre y estado consultables |
| `REQ-EVT-015` | Serie: alcances | Entrenador · Subcomisión | 3 alcances | "Toda la serie" sobre 4 ocurrencias ⇒ cambian 4; "este y los siguientes" ⇒ las restantes; "sólo este" ⇒ 1, con anulación específica; revisión de coordinación sólo en las afectadas; impacto sobre el conjunto real |
| `REQ-EVT-016` | Serie: fin y límites | Entrenador · Subcomisión | 366 máximo | `ACTIVE → ENDED` conservando ocurrencias; más de 366 ⇒ `RECURRENCE_TOO_LARGE` |
| `REQ-EVT-017` | Superficie de participación | Usuario · Entrenador | Por tipo y autoridad | Partido ⇒ las cuatro superficies; entrenamiento ⇒ disponibilidad y asistencia; evento de club ⇒ sin convocatoria ni resultado |
| `REQ-EVT-018` | Jornada | Entrenador (equipo) · Subcomisión (club) | Atómica, ≤100 | Hasta 100 en bloque atómico; temporada del partido = temporada de la jornada; competencia de la jornada ⇒ inscripciones de esa competencia; un partido, a lo sumo una jornada |
| `REQ-EVT-019` | Logística | Entrenador · Capitana · Subcomisión | — | Hora de encuentro, de salida, punto de encuentro, nota de transporte e instrucciones de llegada, consultables por los alcanzados; ausencia de logística comunicada con honestidad |
| `REQ-EVT-020` | Calendario | Usuario autenticado | Proyección | Mes, filtros y vista en la dirección de navegación; el botón atrás devuelve el mismo contexto; vacío resuelto, no roto |
| `REQ-EVT-021` | Inicio | Usuario autenticado | Proyección | Hasta 3 elementos con motivo, consecuencia y acción, ordenados por urgencia; los irresolubles no aparecen; sin pendientes ⇒ se dice explícitamente |
| `REQ-EVT-022` | Coherencia entre proyecciones | Usuario autenticado | — | Inicio, calendario, equipo y evento muestran el mismo valor vigente para el mismo hecho |
| `REQ-EVT-023` | Consulta del evento | Usuario autenticado | Con el evento en alcance | Horario, sede, destinatarios, estado e historia; sin alcance por dirección directa ⇒ sin contenido |
| `REQ-EVT-024` | Valla de dependencias | Admin · Subcomisión | — | Cerrar o finalizar con dependencia activa ⇒ rechazado explicando cuál |

## 4.5 PRT — Participación

| ID | Nombre | Quién | Condición importante | Cómo se sabe que está cumplido |
|---|---|---|---|---|
| `REQ-PRT-001` | Disponibilidad propia | Jugadora | Rol `PLAYER` vigente; evento `SCHEDULED` | Respuesta `sí`/`quizás`/`no` registrada con fecha y visible en el conteo; cambiar sustituye; un rol sin `PLAYER` no responde por sí mismo |
| `REQ-PRT-002` | Disponibilidad por menor | Guardián | `can_respond_availability` vigente; evento alcanza al menor | Respuesta registrada a nombre del menor y visible por el equipo como del menor; sin permiso ⇒ denegado; evento que no alcanza al menor ⇒ rechazado |
| `REQ-PRT-003` | Estados derivados | Sistema | — | Sin respuesta ⇒ "sin respuesta", distinto de "no voy"; respuesta anterior a un cambio de coordinación ⇒ "necesita confirmación"; cambio no coordinativo **no** deriva reconfirmación |
| `REQ-PRT-004` | Condiciones de disponibilidad | Jugadora · Guardián | Sólo con `SCHEDULED` | `POSTPONED` conserva respuestas previas y no acepta nuevas; al volver a `SCHEDULED` se puede responder |
| `REQ-PRT-005` | Convocatoria: borrador y publicación | Entrenador | Evento `SCHEDULED` y tipo `MATCH` | Borrador editable; publicación crea revisión inmutable; republicar crea revisión nueva sin reescribir la anterior; publicar sin `SCHEDULED` ⇒ rechazado |
| `REQ-PRT-006` | La publicación no se bloquea | Entrenador | — | Con conflicto de habilitación ⇒ publica igual, el conflicto queda derivado y visible, explicado en lenguaje de usuario, con superficie de revisión |
| `REQ-PRT-007` | Conflictos actuales | Entrenador | — | Se derivan los cuatro tipos de PT §14; la publicación no se reescribe; puede alimentar Inicio |
| `REQ-PRT-008` | Guardado automático | Entrenador | 600 ms, una en vuelo | Cinco estados de guardado; el refresco de fondo no pisa lo escrito; publicar espera sólo lo en vuelo; con error ⇒ reintento, nunca éxito |
| `REQ-PRT-009` | Asistencia: apertura y registro | Entrenador | `SCHEDULED` o `IN_PROGRESS`; tipo `TRAINING` o `MATCH` | Planilla abierta; valor persistido de inmediato; sin registro ⇒ "sin registrar"; sin autoridad ⇒ denegado |
| `REQ-PRT-010` | Sin registrar ≠ ausente | Sistema | — | Estado propio y distinguible; nunca se convierte en ausente; el informe no cuenta como ausente lo no registrado |
| `REQ-PRT-011` | Cierre de asistencia | Entrenador | — | `OPEN`/`CLOSED` derivado de la marca de cierre; cerrado no admite marcaje nuevo sin corrección |
| `REQ-PRT-012` | Corrección de asistencia | Entrenador | Motivo obligatorio | Anterior, nuevo, motivo, autor y fecha persistidos y visibles; sin motivo ⇒ no completa |
| `REQ-PRT-013` | Resultado: borrador y finalización | Entrenador | Ciclo del evento lo permite | `DRAFT → FINAL`; finalizado no se edita por la vía normal; fuera de ciclo ⇒ `MATCH_STATE_INCOMPATIBLE` |
| `REQ-PRT-014` | Corrección de resultado | Entrenador | Motivo obligatorio | Marcador anterior, nuevo, motivo, autor y fecha; marcador final visible junto con la evidencia |
| `REQ-PRT-015` | Compatibilidad resultado–evento | Sistema | — | `PLAYED`/`FORFEIT` exige `COMPLETED`; `ABANDONED` exige `ABANDONED`; el resultado no fija un estado inexistente |
| `REQ-PRT-016` | Estadísticas de partido | Entrenador | Solo `PLAYED` |-asociadas a participación real; partidos jugados derivados del resultado, no de la asistencia |
| `REQ-PRT-017` | Habilitación | Subcomisión · Admin | `EligibilityConstraint[]` | Sin restricción activa ⇒ "habilitada"; con restricción ⇒ estado, alcance, origen, motivo y vigencia; entrenador ve estado, no motivo ni origen; nunca inferida de disponibilidad |
| `REQ-PRT-018` | Conceptos independientes | Sistema | — | Disponibilidad, convocatoria, asistencia y habilitación no se derivan entre sí |
| `REQ-PRT-019` | Aplicabilidad por tipo | Sistema | — | Matriz de PT §12 respetada por tipo de evento |

## 4.6 COM — Comunicación

| ID | Nombre | Quién | Condición importante | Cómo se sabe que está cumplido |
|---|---|---|---|---|
| `REQ-COM-001` | Ciclo de vida del comunicado | Subcomisión | Sólo la Subcomisión | `DRAFT → PUBLISHED → ARCHIVED`; otro rol ⇒ denegado |
| `REQ-COM-002` | Audiencia | Subcomisión | `TEAM_SET` o club | Conjunto real de equipos, no texto libre; identificación completa de cada equipo |
| `REQ-COM-003` | Fijación al publicar | Sistema | Inmutable | Cambiar la audiencia no está disponible; cambiar afiliaciones no altera el snapshot |
| `REQ-COM-004` | Corrección | Subcomisión | Motivo | Corrige título o cuerpo, no la audiencia; el texto anterior queda en historia; audiencia incorrecta ⇒ comunicado nuevo |
| `REQ-COM-005` | Lectura restringida | Usuario autenticado | Alcanzado por la audiencia | No alcanzado por dirección directa ⇒ no obtiene contenido y la respuesta es de recurso no disponible |
| `REQ-COM-006` | Conversación directa | Usuario autenticado | Par canónico | Máximo una por par; si existe ⇒ se abre la existente; el orden inverso encuentra la misma |
| `REQ-COM-007` | Conversación de grupo | Usuario autenticado | ≥2 participantes, título | Grupos múltiples entre las mismas personas; archivable |
| `REQ-COM-008` | Conversaciones canónicas | Usuario autenticado | 0..1 por equipo y por evento | Título derivado del objeto real; si el evento cambia, el título refleja el dato vigente |
| `REQ-COM-009` | Mensajes | Participante | Con acceso a la conversación | Persistido y visible; sin estado de envío ⇒ no se afirma éxito; fallo ⇒ reintento sin duplicar |
| `REQ-COM-010` | Editar y borrar | Usuario autenticado | Sólo mensajes propios | Borrado = tombstone; irreversible ⇒ confirmación con motivo; mensaje ajeno ⇒ sin operación |
| `REQ-COM-011` | Acceso temporal | Sistema | `joined_at` / `left_at` | Sin acceso a historia anterior a su ingreso; el ex-participante conserva su período; Admin sin participación no lee la conversación |
| `REQ-COM-012` | Derecho comunicacional | Sistema | Automático para `PLAYER`, `CAPTAIN`, `COACH` | Guardián sin accesorio; Admin y Subcomisión sin acceso automático a chats privados |
| `REQ-COM-013` | Candidatos | Usuario autenticado | Tipo antes que personas | Los candidatos son personas con las que puede hablar legítimamente |
| `REQ-COM-014` | Tipos de notificación | Usuario autenticado | 7 tipos | Posponer, reprogramar, cancelar y restaurar son distinguibles; convocatoria y comunicado publicados también |
| `REQ-COM-015` | Altas y bajas en convocatoria | Jugadora · Guardián | Al republicar | Agregados y quitados notificados; los que permanecen sin notificación inútil |
| `REQ-COM-016` | Cambio de destinatarios | Jugadora · Entrenador · Guardián | — | Notifica a la unión de audiencia anterior, nueva, disponibilidad registrada, convocatoria publicada y personal relacionado |
| `REQ-COM-017** | **No notificar** | Sistema | Lista negativa cerrada | Respuesta de disponibilidad, registro de asistencia, envío de mensaje y corrección menor ⇒ sin notificación |
| `REQ-COM-018` | Notificaciones: audiencia y lectura | Usuario autenticado | Clave lógica | Destinatario, tipo, recurso, origen y fecha; la combinación origen+destinatario+tipo no se repite; marcar leída sin salir de la lista; no leídos primero y tipo en lenguaje de usuario |

## 4.7 CMP — Competencia

| ID | Nombre | Quién | Condición importante | Cómo se sabe que está cumplido |
|---|---|---|---|---|
| `REQ-CMP-001` | Ciclo de vida | Admin · Subcomisión | — | `DRAFT → ACTIVE → CLOSED` |
| `REQ-CMP-002` | Cierre | Admin · Subcomisión | 0 inscripciones activas | Con inscripciones activas ⇒ rechazado explicándolas |
| `REQ-CMP-003` | Inscripción | Admin · Subcomisión | — | `PENDING → ACTIVE → ENDED`; finalizar en uso ⇒ serializado contra nuevas dependencias |
| `REQ-CMP-004` | Alcances `TEAM` y `LINE` | Admin · Subcomisión | Son distintos | `TEAM` identifica el equipo; `LINE` identifica división, línea y temporada; incompatibilidad ⇒ `COMPETITION_SCOPE_MISMATCH` con causa en lenguaje de usuario |
| `REQ-CMP-005` | Uso en un partido | Entrenador · Subcomisión | Si la jornada tiene competencia | Cada partido usa inscripción de esa competencia y con alcance compatible |
| `REQ-CMP-006` | Referencia externa manual | Admin · Subcomisión | Lista blanca de destinos | Asociada sólo a `COMPETITION`, `COMPETITION_ENTRY` o `MATCH_EVENT`; el sistema no afirma sincronización |
| `REQ-CMP-007` | Límite federativo | Sistema | — | La referencia se identifica como referencia; las restricciones registran estado, motivo y vigencia, sin historia clínica; el sistema no resuelve pases por sí mismo |
| `REQ-CMP-008` | Alcance y visibilidad de la habilitación | Entrenador · Subcomisión · Admin | 4 alcances | El alcance limita dónde aplica; el motivo y el origen sólo para Subcomisión y Admin; toda mutación auditada |

## 4.8 INS — Búsqueda, informes y auditoría

| ID | Nombre | Quién | Condición importante | Cómo se sabe que está cumplido |
|---|---|---|---|---|
| `REQ-INS-001` | Búsqueda | Usuario autenticado | — | Cubre personas, equipos, eventos y divisiones o líneas; "sin consulta" ≠ "cero resultados"; vacío con siguiente paso |
| `REQ-INS-002` | Alcance y PII | Usuario autenticado | — | Los resultados respetan la autoridad por campo; la estructura se busca por división y línea |
| `REQ-INS-003` | Consulta en la navegación | Usuario autenticado | — | La consulta sobrevive al botón atrás y se reproduce por dirección directa |
| `REQ-INS-004` | Informe de asistencia | Entrenador · Subcomisión · Jugadora | Alcance por autoridad | Distingue presente, ausente, justificada y sin registrar; la jugadora ve lo suyo; **Admin no tiene acceso**; cada fila enlaza al origen |
| `REQ-INS-005` | Informe de rendimiento | Entrenador · Subcomisión · Jugadora | Basado en resultado | Partidos jugados derivados del resultado, no de la asistencia; la jugadora ve lo suyo; cada fila enlaza al partido |
| `REQ-INS-006` | Alcance de informes | Usuario autenticado | Derivado de la autoridad | Propio / equipo / club; el período aplicado es visible y modificable |
| `REQ-INS-007` | Enlace al origen | Entrenador · Subcomisión | — | Cada dato enlaza al hecho que lo origina; el enlace respeta la autoridad |
| `REQ-INS-008` | Auditoría: consulta | Admin | Sólo lectura | Filtros por rango de fechas y actor; sin operación de edición ni borrado; otro actor ⇒ denegado con explicación |
| `REQ-INS-009` | Auditoría: contenido mínimo | Admin | — | Qué cambió, quién, cuándo, motivo cuando la acción lo exige, y enlace al objeto; los datos sensibles se muestran redactados |
| `REQ-INS-010` | Auditoría: integridad | Sistema | Sólo agregado | No existe modificación ni eliminación de entradas; sin contraseñas, hashes, tokens, cookies, cuerpos de mensaje ni documentos |
| `REQ-INS-011` | Historia visible | Usuario autenticado | Por superficie | Correcciones de asistencia y resultado, revisiones de convocatoria, historial de evento, correcciones de comunicado y estado de mensaje, con fecha real y actor |
| `REQ-INS-012` | Historia no genérica | Sistema | — | La historia se deriva de las entidades que la originan y de la auditoría; no hay tabla genérica ni línea de tiempo personal |

---

# 5. REQUERIMIENTOS NO FUNCIONALES Y TRANSVERSALES

## 5.1 Usabilidad y comunicación

| ID | Requisito | Verificación |
|---|---|---|
| `REQ-SYS-006` | Vocabulario de usuario, sin nombres de entidad, comando ni mecanismo | Ninguna superficie expone nombres internos |
| `REQ-SYS-007` | Una pregunta dominante y una acción primaria por superficie; lo peligroso separado y con confirmación | Una sola acción primaria identificable; verbo real en cada acción |
| `REQ-SYS-008` | Revelación progresiva; la misma información cambia de nivel según quién consulta | Lo excepcional no compite con lo inmediato; menos autoridad ⇒ menos niveles, no más restricciones |
| `REQ-SYS-009` | Sin éxito falso | Nunca se afirma completado antes de confirmar; "cambio guardado" ≠ "no pudimos confirmar el resultado" |
| `REQ-SYS-010` | El error preserva lo ingressado, explica qué ocurrió y qué hacer, y pide confirmación al descartar | Los datos sobreviven; el error está junto al campo; nada se vacía |
| `REQ-SYS-011` | Vacío, cero y error son tres estados distintos | Cero real se muestra como cero; falta de dato no se muestra como 0 % |
| `REQ-SYS-012` | No autorizado se oculta; bloqueado se deshabilita con razón; sección vacía se explica | Distinción verificable en las tres situaciones |
| `REQ-SYS-013` | El botón atrás devuelve al contexto; una dirección directa es autosuficiente | Mes, filtro, pestaña y consulta conservados |
| `REQ-SYS-014` | Coherencia entre superficies; la pérdida de autoridad purga caché | Dos superficies del mismo hecho muestran el mismo valor vigente |
| `REQ-SYS-015` | Verdad de la superficie | Conteos contados, fechas del reloj o del modelo, nombres derivados, sin literales de conteo ni fechas congeladas |
| `REQ-IAM-017` | Fuente única de navegación y de acciones por objeto | Los destinos no utilizables no aparecen; las acciones bloqueadas se ven con su razón |
| `REQ-IAM-018` | La autoridad no se reimplementa en el cliente | El servidor deniega lo que el cliente ofrezca; sin gates paralelos |
| `REQ-SYS-019` | Las proyecciones no son dueñas de datos | Inicio, calendario, equipos, búsqueda e informes no admiten escritura propia |

## 5.2 Accesibilidad

| ID | Requisito | Verificación |
|---|---|---|
| `REQ-SYS-002` | Objetivo táctil mínimo de 44 px en gestos de lista y formulario | Altura medida; sin ambigüedad entre acciones vecinas |
| `REQ-SYS-003` | Semántica de controles, gestión de foco y teclado | Foco en el primer control útil, contenido en el diálogo, `Escape` cierra y devuelve el foco, error asociado al campo |
| `REQ-SYS-004` | Movimiento sólo causal y desactivado con preferencia de movimiento reducido | Sin movimiento decorativo; sin movimiento no esencial con la preferencia activa |
| `REQ-SYS-005` | El estado se escribe; el color acompaña; sobrevive a alto contraste | Nombre en texto presente; estado identificable en alto contraste; estado desconocido declarado como estado a revisar |

> `DEF-SYS-002`: zoom 200 %, auditoría automática y lector de pantalla están **pendientes de
> evidencia**. `REQ-DECISION-NEEDED-02`: ninguna fuente declara un nivel de conformidad.

## 5.3 Responsive

| ID | Requisito | Verificación |
|---|---|---|
| `REQ-SYS-001` | Mismo significado en móvil y escritorio | Mismos destinos; agenda antes que mes en móvil; formularios de una columna con acción fija; diálogos a pantalla completa; compositor visible; sin desborde horizontal ni contenido oculto detrás de la navegación |

## 5.4 Seguridad, privacidad e integridad

| ID | Requisito | Verificación |
|---|---|---|
| `REQ-IAM-006` | Sesión opaca, cookie segura, digest en servidor | Sin portador de permisos en el navegador |
| `REQ-IAM-007` | CSRF ligado a la sesión | Petición sin token o con `Origin` inesperado ⇒ `CSRF_FAILED`, sin mutación |
| `REQ-IAM-015` | Contraseñas `Argon2id`, 12–128, sin expiración forzada | Política verificada en los dos extremos |
| `REQ-IAM-019` | Limitación persistente de intentos y límites de frecuencia | Contadores sobreviven a reinicios; `Retry-After` en exceso |
| `REQ-SYS-016` | Idempotencia: una intención, una orden | Reintento con misma clave y carga ⇒ resultado confirmado, sin duplicar; clave con carga distinta ⇒ `IDEMPOTENCY_KEY_REUSED`; sin reejecución ciega tras 24 h |
| `REQ-SYS-017` | Concurrencia optimista con versión esperada | Desalineación ⇒ `STALE_VERSION`; se conservan base, borrador y versión del servidor |
| `REQ-SYS-018` | Una orden, una transacción | La transición terminal persiste el estado final en esa misma operación; sin coreografía de guardado y publicación |
| `REQ-SYS-020` | Datos prohibidos en registros | Sin contraseñas, hashes, tokens, cookies, cuerpos de mensaje ni documentos |
| `REQ-SYS-021` | Transporte cifrado, base de datos no expuesta, recursos publicados sin datos privados | Verificado por inspección de transporte, cliente y recursos |
| `REQ-PPL-011` | Autoridad por campo de datos personales | El campo no autorizado no existe en la respuesta |

## 5.5 Rendimiento, disponibilidad y operación

| ID | Requisito | Medición | Estado |
|---|---|---|---|
| `REQ-SYS-023` | Consultas comunes ≤ 3 s con 100 usuarios autenticados concurrentes | Carga representativa de 15 min con el conjunto de estrés de PT §68 | `EVIDENCE_PENDING` |
| `REQ-SYS-024` | Notificación entregada ≤ 1 min desde la confirmación del hecho | Latencia de notificación observable y alertable | `EVIDENCE_PENDING` |
| `REQ-SYS-022` | Disponibilidad 24/7 salvo mantenimiento announcement; respaldo diario verificado; restauración probada | Latido de frescura de respaldo, verificación remota, restauración mensual | `EVIDENCE_PENDING` |
| `REQ-SYS-025` | Efectos asíncronos durables, idempotentes y no necesarios para la corrección | Fallo del efecto ⇒ el hecho permanece confirmado y el efecto se reintenta sin duplicar | `ACTIVE` |
| `REQ-SYS-026` | Evolución compatible hacia adelante y despliegues coexistentes | Versión anterior sigue funcionando al añadir capacidad | `ACTIVE` |
| `REQ-IAM-020` | Interrupción de sesión preserva el trabajo y exige reintento con la misma intención | Sin pérdida de datos ni éxito falso | `ACTIVE` |
| `REQ-IAM-011` | Propagación de cambios de sesión entre pestañas | La otra pestaña pierde acceso sin recarga manual | `ACTIVE` |
| `REQ-IAM-008` | Vigencia de sesión 12 h inactiva / 7 d absoluta | El tráfico de fondo no extiende la inactividad | `ACTIVE` |
| `REQ-SYS-027` | Privacidad: controles técnicos cerrados + decisiones de organización fuera del sistema | Responsables identificados para las decisiones externas | `EXTERNAL` |

---

# 6. REGLAS DE PRODUCTO Y NEGOCIO

1. **Equipo = Temporada + División + Línea.** La combinación es única y su identidad es inmutable.
2. **Un partido pertenece exactamente a un equipo concreto**, inmutable una vez programado.
3. **La identidad de una sede es estable por identificador.** Corregir sus datos no reprograma eventos; cambiar la sede de un evento sí lo hace.
4. **Disponibilidad, convocatoria, asistencia y habilitación son cuatro conceptos distintos.** Ninguno se deriva de otro.
5. **`ELIGIBLE` es derivado:** no hay restricción de habilitación activa aplicable.
6. **La habilitación vive en restricciones** con estado, alcance, origen, motivo y vigencia. Sin datos clínicos.
7. **La disponibilidad sólo existe con horario vigente.** Un evento pospuesto conserva las respuestas y no acepta nuevas.
8. **La publicación de una convocatoria no se bloquea por un conflicto.** Los conflictos se derivan, se explican y se pueden revisar.
9. **Una revisión de convocatoria publicada es inmutable.**
10. **"Sin registrar" no es "ausente".**
11. **La asistencia ≠ participación en el partido.** Los partidos jugados se derivan del resultado.
12. **El resultado no fija un estado que el evento no tiene.**
13. **Cambiar destinatarios o alcance de un material notifica a la unión de audiencias calculada.**
14. **La audiencia de un comunicado se fija al publicar** y no cambia con una corrección.
15. **Un directo es único por par canónico.**
16. **Las conversaciones de equipo y de evento son canónicas**: máximo una por objeto, con título derivado del objeto real.
17. **El acceso temporal a una conversación es autoritativo.**
18. **Sólo hay siete tipos de notificación.** No se notifica por disponibilidad, asistencia, mensaje ni corrección menor.
19. **Una inscripción de equipo y una de línea son cosas distintas.**
20. **Una jornada agrupa partidos y no duplica su ciclo de vida.**
21. **Un cambio material se explica antes de aplicarse y se reconfirma si el impacto cambió.**
22. **Una orden de negocio es una unidad atómica.** No hay pseudo-transacciones en el cliente.
23. **Una referencia federativa es referencia, no verdad federativa.**
24. **Los proyecciones no son dueños de datos.**

---

# 7. REQUISITOS DE AUTORIDAD Y PII

## 7.1 Fórmula

`ROL + ACCIÓN + ALCANCE + ESTADO DEL OBJETO + AUTORIDAD POR CAMPO + ORIGEN` ·
**Por defecto: denegar.**

## 7.2 Alcances válidos por rol

| Rol | Alcance |
|---|---|
| `PLAYER` | `TEAM` |
| `CAPTAIN` | `TEAM` |
| `COACH` | `TEAM` o `EVENT` |
| `SUBCOMMITTEE` | `CLUB` |
| `ADMIN` | `CLUB` |
| Guardián | **No es rol.** Permisos por relación: ver información del menor, responder su disponibilidad |

Combinación distinta: `422 INVALID_ROLE_SCOPE`.

## 7.3 PII por campo

| Dato | Quién lo ve |
|---|---|
| Nombre y apellido | Scopes operativos autorizados |
| Username | La persona y `ADMIN` |
| DNI | `ADMIN` |
| Fecha de nacimiento completa | `ADMIN` |
| Teléfono y email | La persona, `ADMIN`, y entrenador o capitana del equipo actual cuando exista necesidad operativa |
| Relación de representación | El propio guardián y `ADMIN`; el entrenador sólo información operativa mínima |
| Estado de habilitación | Entrenador con alcance, Subcomisión y `ADMIN` |
| Motivo y origen de habilitación | Subcomisión y `ADMIN` |
| Cuerpo de mensaje | Participantes, dentro de su período autorizado |
| Datos sensibles en auditoría | `ADMIN`, con redacción |

**Nunca:** el `ADMIN` lee chats privados por ser `ADMIN`; la capitana ve el DNI por pertenecer al
equipo; el guardián ve información de otros menores.

**El guardián ve del menor:** nombre y apellido, equipo, eventos relevantes y disponibilidad
relevante. **No ve:** documento, fecha de nacimiento completa, información administrativa, motivo ni
origen de habilitación, conversaciones privadas, auditoría ni roles administrativos. El teléfono y
email del menor **no** se conceden automáticamente; el guardián sí puede ver y modificar los suyos.

---

# 8. REQUISITOS DE INTEGRIDAD DE DATOS

| ID | Regla |
|---|---|
| `REQ-EVT-001` | Invariantes de fecha y horario de todo evento |
| `REQ-EVT-005` | Destinatarios plurales según el tipo de evento |
| `REQ-EVT-006` | Equipo del partido inmutable una vez programado |
| `REQ-STR-004` | Unicidad de la combinación temporada + división + línea |
| `REQ-STR-011` | Las referencias se resuelven por identidad, no por nombre |
| `REQ-PPL-001` | DNI único cuando existe |
| `REQ-PPL-003` | Una persona, una cuenta |
| `REQ-IAM-014` | Username único, inmutable e independiente del equipo |
| `REQ-COM-003` | La audiencia de un comunicado es un snapshot inmutable |
| `REQ-COM-018` | Clave lógica única de notificación |
| `REQ-CMP-004` | Compatibilidad de alcance entre inscripción y partido |
| `REQ-PRT-010` | La ausencia de registro es un estado, no un valor |
| `REQ-PRT-017` | La habilitación es un conjunto de restricciones, no un enum |
| `REQ-INS-010` | La auditoría es de sólo agregado |
| `REQ-SYS-014` | Una sola verdad por hecho, sin divergencia por caché |
| `REQ-SYS-015` | Ninguna afirmación visible sin respaldo en el modelo |
| `REQ-SYS-016` | Idempotencia de las órdenes |
| `REQ-SYS-017` | Control de concurrencia por versión |
| `REQ-SYS-018` | Una orden, una transacción |
| `REQ-SYS-019` | Un único dueño de escritura por hecho de dominio |

---

# 9. REQUISITOS DE HISTORIA Y AUDITORÍA

| ID | Regla |
|---|---|
| `REQ-PRT-012` | Corrección de asistencia con anterior, nuevo, motivo, autor y fecha |
| `REQ-PRT-014` | Corrección de resultado con marcador anterior, motivo, autor y fecha |
| `REQ-COM-004` | Corrección de comunicado con motivo y sin tocar la audiencia |
| `REQ-INS-009` | La auditoría registra qué cambió, quién, cuándo, por qué y con enlace al objeto |
| `REQ-INS-010` | La auditoría no se modifica ni se borra; sin datos sensibles en claro |
| `REQ-INS-011` | La historia se expone en la superficie donde se necesita, con fecha real y actor |
| `REQ-INS-012` | La historia se deriva de las entidades y de la auditoría; no hay tabla genérica ni línea de tiempo personal |

**Historia no es event sourcing.** `REQ-SYS-019` mantiene un dueño de escritura por hecho.
**Nada con significado se elimina:** `REQ-PPL-015`.

---

# 10. ALCANCE FUTURO CONOCIDO

Lo que sigue **no** está en V1 y tiene una razón registrada. No es una lista de deseos: cada ítem
tiene fuente y motivo.

| Categoría | Ítems | Referencia |
|---|---|---|
| Pospuesto con revisión prevista | Preferencias de notificación · recordatorio de disponibilidad · silenciar · menciones · respuestas anidadas · motor de jornadas · flujo de justificación con aprobación · ampliación del set de estadísticas · exportación de datos e informes · restauración de división y línea archivadas | §3.2 |
| Excluido de V1 | Ingreso federado · MFA y passkeys · recuperación self-service de contraseña · categoría como entidad · eliminación de personas · reserva de sedes · offline · adjuntos de acta · historia clínica · expediente disciplinario · confirmaciones de lectura · gestión de participantes de grupo · deshacer genérico · cuotas y contabilidad · motor de estadísticas · integración federativa automática · pases · exportación · timeline personal · reimplementar autorización en el cliente · Redis/WebSocket/microservicios · caché autenticado persistida · SMS/email/push · adaptar el Product Truth al código | §3.3 |
| Evidencia pendiente de capacidades ya requeridas | Accesibilidad (zoom, auditoría automática, lector de pantalla) · tiempos de red del guardado automático | `DEF-SYS-002`, `DEF-SYS-003` |
| Fuera del sistema | Responsable del tratamiento, aviso de privacidad, finalidades, base legal, política de retención, solicitudes de acceso, rectificación y supresión | `REQ-SYS-027` (`EXTERNAL`) |
| Decisiones de producto abiertas | Restauración de estructura archivada · nivel de conformidad de accesibilidad | `REQ-DECISION-NEEDED-01/02` |

---

# 11. ÍNDICE DE REQUERIMIENTOS

| Rango | Dominio | IDs | N.º |
|---|---|---|---:|
| Identidad y acceso | IAM | `REQ-IAM-001` … `REQ-IAM-020` | 20 |
| Personas y relaciones | PPL | `REQ-PPL-001` … `REQ-PPL-016` | 16 |
| Estructura del club | STR | `REQ-STR-001` … `REQ-STR-013` | 13 |
| Eventos y calendario | EVT | `REQ-EVT-001` … `REQ-EVT-024` | 24 |
| Participación | PRT | `REQ-PRT-001` … `REQ-PRT-019` | 19 |
| Comunicación | COM | `REQ-COM-001` … `REQ-COM-018` | 18 |
| Competencia | CMP | `REQ-CMP-001` … `REQ-CMP-008` | 8 |
| Búsqueda, informes y auditoría | INS | `REQ-INS-001` … `REQ-INS-012` | 10 |
| Transversal | SYS | `REQ-SYS-001` … `REQ-SYS-027` | 29 |
| **Total IN** | | | **157** |

> **Nota (Errata E9.5 / F-09):** Los rangos nominales INS (001–012 = 12) y SYS (001–027 = 27) difieren de los conteos reales (INS=10, SYS=29) porque REQ-INS-010/012 tienen `DOMAIN: SYS` en su bloque pero prefijo INS. El total 157 cuadra por ambas vías.
| Pospuestos | — | `DEF-*` (14) | 14 |
| Fuera de V1 | — | `OUT-*` (26) | 26 |
| Decisiones abiertas | — | `REQ-DECISION-NEEDED-01/02` | 2 |

Índice detallado con tipo, categoría, prioridad y estado:
`docs/requirements/GEI_REQUIREMENTS_CATALOG_V1.md` §19.

---

# 12. RESULTADO DEL GATE

## 12.1 Criterios de la Etapa 1

| # | Criterio | Resultado |
|---|---|---|
| 1 | 100 % de fuentes relevantes revisadas | **PASS** — 30 fuentes clasificadas |
| 2 | 100 % de candidatos con fuente | **PASS** — 366/366 |
| 3 | 100 % de canónicos activos con ID | **PASS** — 157/157, sin duplicados |
| 4 | 100 % de REQ IN con fuente | **PASS** — 157/157 |
| 5 | 100 % de REQ IN con criterio de aceptación | **PASS** — 157/157 |
| 6 | 100 % de funcionales IN con actor/beneficiario preliminar | **PASS** — 157/157 |
| 7 | 100 % de feature candidates en IN / DEFER / OUT | **PASS** — 27/27 |
| 8 | 0 duplicados funcionales activos | **PASS** |
| 9 | 0 contradicciones bloqueantes abiertas | **PASS** — 23 resueltas |
| 10 | 0 requerimientos inventados | **PASS** |
| 11 | 0 comportamientos del CURRENT convertidos en requerimiento | **PASS** — 9 clasificados, ninguno convertido |
| 12 | 0 ambigüedades de autoridad abiertas | **PASS** — 5 registradas, 3 cerradas por PT, 2 como decisiones no bloqueantes |

## 12.2 Resultado por tarea

```
E1-01  INVENTARIO DE FUENTES                    PASS
E1-02  EXTRACCIÓN DE REQUERIMIENTOS             PASS
E1-03  RECONCILIACIÓN                           PASS
E1-04  CLASIFICACIÓN                            PASS
E1-05  REQUERIMIENTOS FORMALES                  PASS
E1-06  ESTRÉS Y REVISIÓN DE GATE                PASS

REQUIREMENTS FREEZE V1                          PASS
```

## 12.3 Limitaciones declaradas

1. **El workbook de control `docs/project-control/GEI_Roadmap_Maestro_Proyecto.xlsx` no existe** en
   el repo, en `Downloads`, en `Desktop`, en `Documents` ni en `OneDrive`. → `WORKBOOK_UPDATE_BLOCKED`.
   No se creó un sustituto.
2. **No hay enunciado original de GEI en el workspace.** Los requisitos del club provienen de
   PT §1.1–§1.3, §2 y §76. El PDF de "Trabajo Práctico Integrador" presente en el entorno pertenece a
   otro proyecto.
3. **Dos decisiones de producto siguen abiertas**, ninguna bloqueante.
4. **Seis requerimientos están `EVIDENCE_PENDING`:** sólo la implementación puede demostrarlos.
5. **Un requerimiento es `EXTERNAL`:** la conformidad legal depende de organización, no de código.
6. PT §23 no enumera las superficies embebidas y prohíbe fijar su número. Este freeze **no fija
   ningún total de workflows ni de superficies**; las cubre por comportamiento.

---

# 13. QUÉ ALIMENTA ESTE FREEZE

Este documento es la entrada de las etapas siguientes. No las reemplaza.

| Etapa | Qué recibe de este freeze | Qué NO debe tomar de aquí |
|---|---|---|
| **Etapa 2 — Actores** | Los 8 actores preliminares con su base documental (`§2.2`), sus alcances (`§7.2`), su autoridad por campo (`§7.3`) y el hecho de que el guardián es relación y no rol. **Ambigüedad señalada:** `CAPTAIN` tiene autoridad propia en logística que no deriva de `COACH`; E2 debe decidir si eso es una relación de actor o una capacidad aislada. | No debe derivar la jerarquía de actores de las 38 rutas ni de la matriz de PT §5 sin revisarla. |
| **Etapa 3 — Casos de uso** | 157 requerimientos con aceptación, 30 flujos con los `REQ` que los sostienen (catálogo §17), 8 capacidades sin superficie actual (`RWS-01`–`RWS-04`) que deben entrar como casos de uso. | No debe tratar rutas como casos de uso. Las 38 rutas son evidencia, no el conjunto de casos. |
| **Etapa 4 — Diagramas de estado** | Los 11 ciclos de vida de PT §9 con sus transiciones y sus condiciones (`§4`, `§6`), y `REQ-DECISION-NEEDED-01` como pregunta abierta sobre el restore. | No debe inventar transiciones. `PT §75` exige que toda transición tenga comando. |
| **Etapa 5 — Diagramas de actividad** | Los criterios de aceptación en formato Given/When/Then de los 157 requerimientos, que son la secuencia de pasos verificable de cada caso de uso. | No debe dibujar los flujos del prototipo como si fueran los flujos del producto. |
| **Etapa 6 — Modelo de clases** | Las entidades, sus invariantes, sus ciclos y sus reglas de integridad (`§8`, `§9`). **PT §25 ya contiene el modelo físico congelado**, que este freeze no modifica. | No debe derivar clases de las 45 tablas ni del código. |
| **Etapa 7 — Trazabilidad** | Las tres columnas yaprepared: fuente → candidato → requerimiento canónico (catálogo §13). Falta la columna `REQ → Actor formal → CU`, que es de E2 y E3. | — |
| **Etapa 8 — Arquitectura de información** | Las 8 capacidades sin superficie (`RWS-*`) y los 9 `IMPLEMENTATION_WITHOUT_REQUIREMENT` como restricciones de qué superficie es y qué no es producto. | No debe convertir rutas en destinos obligatorios ni contar workflows. |
| **Etapa 9 — Contratos de pantalla** | Las propiedades transversales de §5 como restricciones verificables de cualquier pantalla. | No debe diseñar pantallas. Este freeze no las describe. |
| **Etapa 10 — Arquitectura y backend** | Los requerimientos no funcionales de §5.4 y §5.5, y el límite explícito de que la arquitectura ya está congelada en PT §29 y §60–§71. | No debe elegir pila, base de datos, endpoints ni topología: eso ya está decidido. |
| **Etapa 11 — Implementación** | Criterios de aceptación verificables por cada requerimiento. | No debe implementar lo que está en DEFER u OUT. |

---

**Fin del Requirements Freeze V1.**

**SOURCE MODIFIED: NO.** Este lote creó únicamente archivos bajo `docs/requirements/`.