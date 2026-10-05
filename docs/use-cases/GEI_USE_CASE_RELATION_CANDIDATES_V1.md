# GEI HOCKEY MANAGEMENT SYSTEM
## USE CASE RELATION CANDIDATES V1

**Etapa:** 3 — Uso de casos
**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-05
**Rama:** `gei/e3-use-case-inventory-freeze-v1`

| Autoridad | Archivo · Versión |
|---|---|
| Casos de uso | `docs/use-cases/GEI_MASTER_USE_CASE_CATALOG_V1.md` — **V1** |
| Requerimientos | `docs/requirements/GEI_REQUIREMENTS_FREEZE_V1.md` — **V1** + errata |
| Actores | `docs/actors/GEI_ACTOR_MODEL_FREEZE_V1.md` — **V1** |

> **Este archivo contiene únicamente CANDIDATAS.** No congela relaciones `<<include>>` ni
> `<<extend>>`. No dibuja nada. E4 decide cuáles sobreviven y con qué dirección.
>
> **No se congela ninguna relación débil sólo porque UML la permite.**

---

# 1. REGLAS APLICADAS

Las reglas del brief §24, §25 y §26, traducidas a criterios verificables.

## 1.1 `INCLUDE` — los tres criterios, todos obligatorios

| # | Criterio | Verificación exigida |
|---:|---|---|
| 1 | Es un **comportamiento observable** por el actor, no un paso interno | El REQ tiene AC observable |
| 2 | Los **requirements lo justifican** | ≥1 REQ propio lo describe |
| 3 | **Merece especificación propia** | Es un objetivo que un actor puede intentar por sí mismo |

Un comportamiento que falla el criterio 1 es una regla interna (`BUSINESS_RULE`). Uno que falla el
2 es feature creep. Uno que falla el 3 es una pantalla, no un caso de uso.

## 1.2 `EXTEND` — los tres criterios, todos obligatorios

| # | Criterio | Verificación exigida |
|---:|---|---|
| 1 | Es **opcional o condicional** | Tiene una condición real, no una convención |
| 2 | Se inserta **dentro** de otro CU | El CU base puede completarse sin él |
| 3 | La condición es **observable** por el actor | El actor puede saber que aplica |

## 1.3 Prohibiciones explícitas

| Prohibido | Motivo |
|---|---|
| Usar `include`/`extend` para **reducir líneas** | Es una razón estética, no funcional |
| `<<include>>` de "Autenticar usuario" en todos los CU | La sesión autenticada es una **precondición**, no un comportamiento reutilizable con significado propio. `REQ-IAM-012` es `CROSS_CUTTING`. §24 del brief |
| `<<include>>` de "Consultar disponibilidad" en "Registrar asistencia" | `REQ-PRT-018`: disponibilidad, convocatoria, asistencia y habilitación **no** se derivan entre sí |
| `<<include>>` de "Consultar habilitación" en "Publicar convocatoria" | `REQ-PRT-006`: la publicación **no** se bloquea por un conflicto. El conflicto es derivado y observable, **no** bloqueante. Forzarlo sería falsear la regla |
| Crear una relación para un objetivo que ya es un CU independiente | §18: si el objetivo cambia de lifecycle y de resultado, es un CU, no una extensión |
| Congelar una relación sin evidencia de REQ | §46: 0 include/extend definitivo sin análisis |

---

# 2. CANDIDATAS `INCLUDE` (2)

## INC-01 · Reautenticar para una gestión sensible

| Campo | Valor |
|---|---|
| **Source UC** | `UC-IAM-02`, `UC-IAM-03`, `UC-IAM-05`, `UC-PPL-01` … `UC-PPL-12`, `UC-STR-01` … `UC-STR-15`, `UC-CMP-01` … `UC-CMP-08`, `UC-PRT-12` (todo el bloque `ACT-ADMIN` / `ACT-SUBCOMMITTEE` de gestión sensible) |
| **Target UC** | `UC-IAM-09` |
| **Tipo candidato** | `<<include>>` |
| **Condición** | El actor inicia una gestión sensible y su sesión no tiene reautenticación vigente. |
| **Evidencia** | `REQ-IAM-009` (AC: *"Sin reautenticación ⇒ se pide contraseña; ventana de 10 min; vencido ⇒ la operación no se ejecuta"*) · PT §52 `REAUTHENTICATION_REQUIRED` · PT §38 |
| **Razón** | Los **tres** criterios de §1.1 se cumplen: (1) el actor **ve** que se le pide la contraseña y **ve** que la ventana venció; (2) `REQ-IAM-009` es un REQ propio, `FUNCTIONAL`, `PRIMARY` de `UC-IAM-09`; (3) merece especificación propia porque su resultado observable —identidad verificada con ventana de 10 min— es distinto del de cualquier gestión. Es el único comportamiento de seguridad que se repite en muchas operaciones con el **mismo** significado conceptual. |
| **Confianza** | **ALTA** |
| **Impacto en el diagrama** | E4 debería dibujarlo como `<<include>>` desde el bloque de gestión hacia `UC-IAM-09`. Si lo dibuja, el diagrama tiene ~24 aristas de `include`; conviene agrupar visualmente. **Riesgo de ruido**: §24 advierte exactamente contra esto. E4 debe evaluar si el valor semántico supera el ruido visual. Si el ruido gana, la alternativa correcta **no** es borrar la relación sino dejar `UC-IAM-09` como CU independiente con precondición explícita. |
| **Estado** | `CANDIDATE` — no congelado |

### 2.1 Por qué **no** es `<<include>>` en la sesión ni en el login

`UC-IAM-01 · Iniciar sesión` es un objetivo **propio** con resultado propio, y `REQ-IAM-012`
(`CROSS_CUTTING`) es una **precondición** de todo lo autenticado, no un comportamiento que se
inserte en otro CU. Convertirlo en `include` forzaría una arista hacia casi los 100 CU restantes y
violaría el §24. **Rechazado** — ver `REJ-01`.

## INC-02 · Revisar el impacto de un cambio material

| Campo | Valor |
|---|---|
| **Source UC** | `UC-EVT-04` (rama material) · `UC-EVT-05` · `UC-EVT-07` · `UC-EVT-08` · `UC-EVT-16` (si además cambia un campo coordinativo) |
| **Target UC** | `UC-EVT-11` |
| **Tipo candidato** | `<<include>>` |
| **Condición** | El cambio propuesto es **material** según la lista cerrada de `REQ-EVT-011`. |
| **Evidencia** | `REQ-EVT-012` (`STATEMENT`: *"Antes de aplicar un cambio material, el sistema debe mostrar su impacto … y exigir una confirmación explícita"*) · `REQ-EVT-011` (lista cerrada de campos materiales) · PT §37 `Impact Preview` · PT §24 · PT §38 `IMPACT_CHANGED` / `IMPACT_TOKEN_EXPIRED` |
| **Razón** | Los **tres** criterios se cumplen. (1) El actor **pide** el impacto y **recibe** personas, roles y consecuencias con conteos derivados de los conjuntos reales: es observable. (2) `REQ-EVT-012` es un REQ propio con 4 AC. (3) El objetivo —*"que nadie coordine a un equipo a ciegas"*— es distinto del objetivo de editar, posponer, cancelar o restaurar: el impacto **no** cambia el evento, lo explica. E4 tiene además el caso paradigmático del brief §25. |
| **Confianza** | **ALTA** para `UC-EVT-04`. **MEDIA** para `UC-EVT-05/07/08/16`. |
| **Impacto en el diagrama** | 5 aristas de `include` hacia `UC-EVT-11`. Volumen bajo, valor semántico alto. **E4 debe verificar** si `REQ-EVT-012` se extiende también a las transiciones de lifecycle o sólo a la edición de campos: `REQ-EVT-011` lista *"las acciones de posponer, reprogramar, cancelar y restaurar"* dentro de la lista de material, lo que **sugiere** que sí — pero `REQ-EVT-012` nombra actor sin enumerar operaciones. **E5** debe fijar ese límite. |
| **Estado** | `CANDIDATE` — no congelado |

### 2.2 Por qué "solicitar reconfirmación de disponibilidad" **no** es candidata

El brief §26 pregunta explícitamente si "solicitar reconfirmación" es `extend`, consecuencia del
mismo CU o regla interna. **Respuesta de E3: consecuencia del mismo CU `UC-PRT-01`, más una regla
de negocio.**

| Evidencia | Consecuencia |
|---|---|
| `REQ-PRT-001` AC: *"cambiar sustituye"* | La respuesta permitida es `sí` / `quizás` / `no`. **No hay un token "sigo diciendo que sí"**. Re-responder con el mismo valor **es** reconfirmar. |
| `REQ-PRT-003` AC: *"respuesta anterior a un cambio de coordinación ⇒ 'necesita confirmación'"* | El estado `NEEDS_RECONFIRMATION` es **derivado**, no una orden. |
| `REQ-PRT-003` AC: *"cambio no coordinativo **no** deriva reconfirmación"* | El disparador es la revisión de coordinación, no una acción del jugador. |

Por tanto **no hay un objetivo "confirmar que mi disponibilidad sigue en pie"** distinto de
"responder mi disponibilidad". Crear un `extend` o un CU aquí sería inventar una acción que el
modelo de dominio no tiene. **Rechazado** — ver `REJ-05`.

---

# 3. CANDIDATAS `EXTEND` (6)

## EXT-01 · Resolver un conflicto de edición concurrente

| Campo | Valor |
|---|---|
| **Source UC** | `UC-EVT-04` (y, por la misma regla de `STALE_VERSION`, `UC-EVT-14` si existiera; hoy la serie se edita por `UC-EVT-04`) |
| **Target UC** | `UC-EVT-12` |
| **Tipo candidato** | `<<extend>>` |
| **Condición** | El recurso cambió en el servidor entre la carga del formulario y el guardado ⇒ `STALE_VERSION`. |
| **Evidencia** | `REQ-EVT-013` AC 1–3 · `REQ-SYS-017` · PT §44 (`409 preserves: baseline; localDraft; latestServer`; `No generic force overwrite`) · PT §73 (`409 STALE_VERSION → Conflict Workspace`) |
| **Razón** | Cumple §1.2: (1) es **opcional**: `UC-EVT-04` se completa sin él en el caso normal; (2) se inserta **dentro** de `UC-EVT-04` reemplazando el guardado; (3) la condición es observable —el actor ve que su guardado fue rechazado y por qué—. Y es **independiente** del impacto: un conflicto no es un cambio material. Por eso **no** va dentro de `INC-02`. |
| **Confianza** | **ALTA** |
| **Impacto en el diagrama** | 1 arista `extend` con etiqueta de condición. Coste mínimo, valor alto: es la relación que justifica que `UC-EVT-12` exista como CU y no como nota. |
| **Estado** | `CANDIDATE` — no congelado |

## EXT-02 · Corregir la asistencia de un evento

| Campo | Valor |
|---|---|
| **Source UC** | `UC-PRT-06` · `UC-PRT-05` |
| **Target UC** | `UC-PRT-07` |
| **Tipo candidato** | `<<extend>>` |
| **Condición** | La planilla está `CLOSED`, o el valor se detecta mal después de cerrar. |
| **Evidencia** | `REQ-PRT-011` AC 1: *"cerrado no admite marcaje nuevo **sin corrección**"* · `REQ-PRT-012` (motivo obligatorio) · PT §12 (*"puede cerrar después de `COMPLETED` y admite correcciones auditadas"*) · Boundary matrix E2 §6 |
| **Razón** | Cumple §1.2. (1) `UC-PRT-05` se completa sin corrección el 100 % de las veces; (2) la corrección se inserta en el flujo de asistencia; (3) la condición es observable: el valor queda bloqueado y el sistema ofrece la vía de corrección. `REQ-PRT-011` **no** admite reabrir la planilla (`CON-13`): la corrección es el único camino, y por eso la relación es `extend` y **no** un segundo camino principal. |
| **Confianza** | **ALTA** |
| **Impacto en el diagrama** | 2 aristas `extend`. Refleja que "corregir" y "cerrar" son el mismo lugar conceptual con dos resultados. |
| **Estado** | `CANDIDATE` — no congelado |

## EXT-03 · Corregir el resultado de un partido

| Campo | Valor |
|---|---|
| **Source UC** | `UC-PRT-09` |
| **Target UC** | `UC-PRT-10` |
| **Tipo candidato** | `<<extend>>` |
| **Condición** | El `MatchRecord` está `FINAL` y el marcador necesita corregirse. |
| **Evidencia** | `REQ-PRT-013` AC 2: *"GIVEN un resultado finalizado WHEN se intenta editarlo por la vía normal THEN la operación no está disponible y **se ofrece la vía de corrección**"* · `REQ-PRT-014` (motivo obligatorio) · PT §9 (`FINAL` sólo se corrige explícitamente) |
| **Razón** | Cumple §1.2. El propio `REQ-PRT-013` **diseña** la relación: la vía normal se cierra y se ofrece la corrección. (1) es opcional; (2) se inserta en `UC-PRT-09`; (3) la condición es observable y el sistema la anuncia. |
| **Confianza** | **ALTA** |
| **Impacto en el diagrama** | 1 arista `extend`. Es la relación que explica por qué corregir **no** retrocede el lifecycle. |
| **Estado** | `CANDIDATE` — no congelado |

## EXT-04 · Revisar los conflictos de una convocatoria

| Campo | Valor |
|---|---|
| **Source UC** | `UC-PRT-03` (y `UC-PRT-02`, mientras se prepara) |
| **Target UC** | `UC-PRT-04` |
| **Tipo candidato** | `<<extend>>` |
| **Condición** | Existen conflictos derivados (`ELIGIBILITY_BLOCKED`, `ELIGIBILITY_PENDING`, `NO_LONGER_EVENT_TARGET`, `NO_LONGER_TEAM_AFFILIATED`) sobre la convocatoria. |
| **Evidencia** | `REQ-PRT-006` AC: *"la publicación **no** se bloquea… el conflicto queda derivado y visible, explicado en lenguaje de usuario, **con superficie de revisión**"* · `REQ-PRT-007` AC · PT §14 · PT §5 fila `Eligibility mutation`: `COACH: lectura status` |
| **Razón** | Cumple §1.2, y el criterio (1) es exactamente el que `REQ-EVT-012` no cumple: la revisión de conflictos **no** bloquea la publicación. Si fuera `include`, el modelo afirmaría que no se puede publicar con conflicto, lo que **contradice directamente** `REQ-PRT-006`. `extend` modela la verdad: se puede publicar, y *si* hay conflicto hay una revisión disponible. |
| **Confianza** | **ALTA** |
| **Impacto en el diagrama** | 2 aristas `extend`. Es la relación que hace visible la diferencia entre "bloqueante" y "derivado". |
| **Estado** | `CANDIDATE` — no congelado |

## EXT-05 · Marcar una notificación como leída

| Campo | Valor |
|---|---|
| **Source UC** | `UC-COM-13` |
| **Target UC** | `UC-COM-14` |
| **Tipo candidato** | `<<extend>>` |
| **Condición** | El actor actúa sobre una notificación que todavía no está leída. |
| **Evidencia** | `REQ-COM-018` AC: *"marcar leída **sin salir de la lista**; no leídos primero"* |
| **Razón** | Cumple §1.2. (1) es opcional: `UC-COM-13` se completa sin marcar nada; (2) se inserta en la lista, que es el único lugar donde tiene sentido; (3) la condición es observable. El `AC` lo pide **dentro** de la consulta, lo que es la definición de `extend`. |
| **Confianza** | **MEDIA** |
| **Impacto en el diagrama** | 1 arista `extend`. Alternativa válida para E4: no dibujar la relación y tratar `UC-COM-14` como CU hermano de `UC-COM-13`. **Ambas son defendibles**; por eso queda como candidata y no como decisión. |
| **Estado** | `CANDIDATE` — no congelado |

## EXT-06 · Completar el perfil de una jugadora

| Campo | Valor |
|---|---|
| **Source UC** | `UC-PPL-06` (incorporar a un equipo) |
| **Target UC** | `UC-PPL-02` |
| **Tipo candidato** | `<<extend>>` |
| **Condición** | La jugadora incorporada no tiene los seis datos de perfil ⇒ `PLAYER_PROFILE_INCOMPLETE`. |
| **Evidencia** | `REQ-PPL-002` AC: *"GIVEN asignación al roster … Faltando cualquiera de los seis datos ⇒ `PLAYER_PROFILE_INCOMPLETE` indicando qué falta"* · `REQ-PPL-013` (el aviso a la jugadora) |
| **Razón** | Cumple §1.2 parcialmente, y por eso la confianza es **MEDIA**: (1) es condicional; (2) se inserta en la incorporación; (3) la condición es observable. Pero `UC-PPL-02` **también** se puede iniciar sin haber incorporado a la jugadora (`REQ-PPL-002` nombra `ACT-ADMIN` como actor, no una condición de incorporación), así que la relación **no es obligatoria** en ninguna dirección. |
| **Confianza** | **MEDIA** |
| **Impacto en el diagrama** | 1 arista `extend`. E4 puede descartarla si prefiere mostrar `UC-PPL-02` como CU independiente. |
| **Estado** | `CANDIDATE` — no congelado |

---

# 4. RELACIONES RECHAZADAS (9)

Cada rechazo dice **qué regla de la autoridad lo prohíbe**, no sólo que "no queda bien".

## REJ-01 · "Autenticar usuario" como `<<include>>` de todos los CU

| Campo | Valor |
|---|---|
| **Source** | los 100 CU autenticados |
| **Target hipotético** | "Autenticar usuario" |
| **Tipo rechazado** | `<<include>>` |
| **Condición** | La persona no tiene sesión. |
| **Evidencia** | `REQ-IAM-012` AC: con rol vigente **o** delegación ⇒ acceso; sin ninguno ⇒ `/no-access` **sin datos ni destinos**. E2 §4.2 y §4.4. |
| **Motivo del rechazo** | La sesión autenticada es una **precondición**, no un comportamiento que se inserte en un flujo. Y `ACT-AUTHENTICATED` **no es** una forma de conceder permisos por defecto (E2 §4.2). Modelarlo como `include` haria que "autenticarse" sea un subgoal del mismo tipo que "editar un evento", y obligaría a una arista desde casi todos los CU. **§24 del brief lo prohíbe por nombre.** |
| **Consecuencia en E3** | `REQ-IAM-012` se clasificó `CROSS_CUTTING`. Sus AC aparecen como precondición en los 102 CU y su manifestación observable (`/no-access`) queda en `UC-IAM-01`. |
| **Confianza del rechazo** | **MUY ALTA** |

## REJ-02 · "Iniciar sesión" como `<<include>>` de todos los CU autenticados

| Campo | Valor |
|---|---|
| **Source** | los 100 CU autenticados |
| **Target** | `UC-IAM-01` |
| **Tipo rechazado** | `<<include>>` |
| **Motivo del rechazo** | `UC-IAM-01` **ya es** un CU canónico con goal, trigger y outcome propios. Un `<<include>>` desde 100 CU sólo dibujaría el mismo hecho 100 veces. `UC-IAM-01` es un CU **hermano**, no un behaviour reutilizable embebido. |
| **Consecuencia en E3** | `UC-IAM-01` es independiente. La relación correcta, si E4 quiere, es una **generalización de actor** (`ACT-UNAUTHENTICATED extends ACT-AUTHENTICATED`), que E2 §12.1 ya rechazó por no ser aplicable. |
| **Confianza del rechazo** | **ALTA** |

## REJ-03 · "Consultar disponibilidad" como `<<include>>` de "Registrar asistencia"

| Campo | Valor |
|---|---|
| **Source** | `UC-PRT-05` |
| **Target** | `UC-PRT-01` |
| **Tipo rechazado** | `<<include>>` |
| **Evidencia** | `REQ-PRT-018`: *"Disponibilidad, convocatoria, asistencia y habilitación no se derivan entre sí"* · Freeze §6 regla 4 · `REQ-PRT-010` |
| **Motivo del rechazo** | La asistencia registra presencia real; la disponibilidad registra intención previa. Una no se deriva de la otra y un `include` afirmaría que registrar asistencia **requiere** consultar disponibilidad, que es exactamente la derivación que `REQ-PRT-018` prohíbe. |
| **Consecuencia en E3** | Son CU independientes en `PRT`. La relación real es de **consulta**, no de composición, y es de E10 (IA), no de E4. |
| **Confianza del rechazo** | **MUY ALTA** |

## REJ-04 · "Consultar habilitación" como `<<include>>` de "Publicar convocatoria"

| Campo | Valor |
|---|---|
| **Source** | `UC-PRT-03` |
| **Target** | `UC-PRT-13` |
| **Tipo rechazado** | `<<include>>` |
| **Evidencia** | `REQ-PRT-006` AC: *"Con conflicto de habilitación ⇒ **publica igual**, el conflicto queda derivado y visible"* · Freeze §6 regla 8 |
| **Motivo del rechazo** | Si la habilitación fuera `include`, la publicación **no podría** completarse sin ella, es decir, quedaría bloqueada. `REQ-PRT-006` dice exactamente lo contrario. Un `include` aquí **falsearía la regla de negocio** y sería peor que no dibujar ninguna relación. |
| **Consecuencia en E3** | La relación correcta es `EXT-04`: revisar conflictos es una extensión condicional, no un paso obligatorio. |
| **Confianza del rechazo** | **MUY ALTA** |

## REJ-05 · "Solicitar reconfirmación de disponibilidad" como `extend`

| Campo | Valor |
|---|---|
| **Source** | `UC-PRT-01` |
| **Target hipotético** | "Solicitar reconfirmación" |
| **Tipo rechazado** | `<<extend>>` |
| **Evidencia** | `REQ-PRT-001` AC (*"cambiar sustituye"*; respuestas `sí`/`quizás`/`no`) · `REQ-PRT-003` AC |
| **Motivo del rechazo** | El modelo de dominio **no tiene** la acción "confirmar que la disponibilidad sigue en pie". `NEEDS_RECONFIRMATION` es un estado **derivado** (`REQ-PRT-003`), y la única forma de despejarlo es responder de nuevo —que ya es `UC-PRT-01`. Crear la relación sería inventar un comando. |
| **Consecuencia en E3** | Es una **consecuencia de `UC-PRT-01`** más una regla (`REQ-PRT-003`). Analizado explícitamente por el §26 del brief. |
| **Confianza del rechazo** | **ALTA** |

## REJ-06 · "Archivar estructura" como `<<include>>` de "Archivar equipo"

| Campo | Valor |
|---|---|
| **Source** | `UC-STR-12` |
| **Target** | `UC-STR-05`, `UC-STR-08`, `UC-STR-15` |
| **Tipo rechazado** | `<<include>>` |
| **Evidencia** | `REQ-STR-004` (`Equipo = Temporada + División + Línea`, combinación única) · `REQ-PPL-014` · `REQ-STR-006` |
| **Motivo del rechazo** | Archivar un equipo **no requiere** archivar su división, su línea ni su sede. La relación real es de **integridad referencial**, no de composición: `REQ-STR-006` impide archivar con dependencia activa, lo cual es una **valla**, no un `include`. Un `include` aquí sugeriría que archivar el equipo arrastra la estructura, que es falso. |
| **Consecuencia en E3** | `REQ-STR-006` se clasificó `BUSINESS_RULE` de los cuatro CU de archivo. Sin relación UML. |
| **Confianza del rechazo** | **ALTA** |

## REJ-07 · "Consultar el historial" como `<<include>>` de las correcciones

| Campo | Valor |
|---|---|
| **Source** | `UC-PRT-07` (corregir asistencia), `UC-PRT-10` (corregir resultado), `UC-COM-03` (corregir comunicado) |
| **Target** | `UC-INS-04` |
| **Tipo rechazado** | `<<include>>` |
| **Evidencia** | `REQ-INS-011` AC: la historia se expone *"en la superficie donde corresponde"* |
| **Motivo del rechazo** | La **corrección produce** historia; no la necesita para completarse. El objetivo del entrenador al corregir es *arreglar el dato*, no *leer la historia*. La lectura del antes/después es consecuencia observable de la corrección, mostrada en la misma superficie — y `REQ-INS-011` la cubre sin necesidad de una composición. Como `include` dibujaría 3 aristas que dicen algo que la propia `UC-INS-04` ya expresa. |
| **Consecuencia en E3** | `UC-INS-04` es un CU independiente. La relación de "la corrección muestra su propio antes/después" es de **presentación** y pertenece a E5/E9. |
| **Confianza del rechazo** | **MEDIA-ALTA** |

## REJ-08 · "Consultar comunicado" como `<<include>>` de "Publicar comunicado"

| Campo | Valor |
|---|---|
| **Source** | `UC-COM-02` |
| **Target** | `UC-COM-05` |
| **Tipo rechazado** | `<<include>>` |
| **Evidencia** | `REQ-COM-001` (publicar: `ACT-SUBCOMMITTEE`) · `REQ-COM-005` (leer: la audiencia alcanzada) |
| **Motivo del rechazo** | Actores distintos y objetivos distintos. Publicar es un acto de autoridad del club; leer es un acto de la audiencia. Un `include` fundiría dos capacidades que E2 §14.3 separa deliberadamente. |
| **Consecuencia en E3** | `UC-COM-02` y `UC-COM-05` son CU independientes. |
| **Confianza del rechazo** | **ALTA** |

## REJ-09 · "Archivar conversación" como `<<include>>` de cualquier otro CU de `COM`

| Campo | Valor |
|---|---|
| **Source** | `UC-COM-06`, `UC-COM-08`, `UC-COM-09` |
| **Target** | `UC-COM-12` |
| **Tipo rechazado** | `<<include>>` y `<<extend>>` |
| **Evidencia** | `REQ-COM-007` AC 4 |
| **Motivo del rechazo** | Archivar un grupo de ≥2 participantes no es un sub-paso de enviar un mensaje ni de abrir un directo. Es un objetivo con resultado propio (`ACTIVE → ARCHIVED`). Y `REQ-COM-007` lo exige **sólo** para grupos: no hay REQ para archivar un directo ni una canónica. |
| **Consecuencia en E3** | `UC-COM-12` es un CU independiente, restringido a `GROUP`. |
| **Confianza del rechazo** | **ALTA** |

---

# 5. RESUMEN PARA E4

| Tipo | Candidatas | Confianza alta | Confianza media | Rechazadas |
|---|---:|---:|---:|---:|
| `<<include>>` | **2** | 2 | 0 | 4 |
| `<<extend>>` | **6** | 4 | 2 | 5 |
| **TOTAL** | **8** | **6** | **2** | **9** |

## 5.1 Las 6 candidatas de confianza alta

| ID | Tipo | Source → Target | Condición |
|---|---|---|---|
| `INC-01` | `include` | bloque de gestión sensible → `UC-IAM-09` | sin reautenticación vigente |
| `INC-02` | `include` | `UC-EVT-04`, `05`, `07`, `08`, `16` → `UC-EVT-11` | cambio material |
| `EXT-01` | `extend` | `UC-EVT-04` → `UC-EVT-12` | `STALE_VERSION` |
| `EXT-02` | `extend` | `UC-PRT-05`, `UC-PRT-06` → `UC-PRT-07` | planilla `CLOSED` |
| `EXT-03` | `extend` | `UC-PRT-09` → `UC-PRT-10` | resultado `FINAL` |
| `EXT-04` | `extend` | `UC-PRT-02`, `UC-PRT-03` → `UC-PRT-04` | conflictos derivados |

## 5.2 Las 2 candidatas de confianza media

| ID | Tipo | Source → Target | Duda que E4 debe resolver |
|---|---|---|---|
| `EXT-05` | `extend` | `UC-COM-13` → `UC-COM-14` | ¿`extend` o dos CU hermanos? |
| `EXT-06` | `extend` | `UC-PPL-06` → `UC-PPL-02` | ¿`extend` o dos CU independientes? |

## 5.3 Lo que E4 **no** debe dibujar

| No dibujar | Motivo |
|---|---|
| Una arista `include` desde cada CU a "autenticarse" | `REQ-IAM-012` es precondición. `REJ-01` |
| Una arista `include` desde cada CU a `UC-IAM-01` | `UC-IAM-01` es un CU hermano. `REJ-02` |
| `include` de disponibilidad en asistencia | `REQ-PRT-018`. `REJ-03` |
| `include` de habilitación en publicar convocatoria | `REQ-PRT-006`. `REJ-04` |
| Cualquier relación para "reconfirmar disponibilidad" | No existe el comando. `REJ-05` |
| `include` de archivar estructura dentro de archivar equipo | Es valla de integridad, no composición. `REJ-06` |
| `include` de historial en las correcciones | La corrección produce historia. `REJ-07` |
| `include` de consultar comunicado en publicarlo | Actores y objetivos distintos. `REJ-08` |
| `include` de archivar conversación en enviar mensaje | Objetivo independiente. `REJ-09` |

---

# 6. LIMITACIONES DECLARADAS

1. **0 relaciones congeladas.** Este documento no tiene autoridad para congelarlas: E4 decide.
2. **`INC-01` tiene riesgo de ruido reconocido.** 24 aristas de `include` son muchas. La
   alternativa a la relación no es borrarla, sino dejar `UC-IAM-09` como CU con precondición
   explícita. La decisión es de E4.
3. **`INC-02` tiene un límite sin resolver.** Si el impact preview aplica también a las transiciones
   de lifecycle o sólo a la edición de campos. `REQ-EVT-011` incluye las transiciones en la lista
   de material; `REQ-EVT-012` no las enumera. E5 debe fijar el alcance.
4. **Ninguna relación se proposes por estética.** Las 9 rechazas citan una AC concreta que lo
   prohíbe.
5. **Este documento no dibuja nada.** No hay PlantUML, ni Mermaid, ni imagen.

---

**Fin del Use Case Relation Candidates V1.**

**SOURCE MODIFIED: NO.** Este lote creó únicamente archivos bajo `docs/use-cases/`.
