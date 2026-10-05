# GEI HOCKEY MANAGEMENT SYSTEM
## USE CASE OPEN DECISIONS V1

**Etapa:** 3 — Uso de casos
**Estado:** 2 decisiones abiertas · **0 bloqueantes**
**Fecha:** 2026-10-05
**Rama:** `gei/e3-use-case-inventory-freeze-v1`

Este archivo existe sólo porque E3 encontró **dos** objetivos funcionales que el club probablemente
quiere y que **ningún REQ IN expresa**. Ninguno bloquea el cierre de la Etapa 3: en ambos casos la
ausencia de un REQ es una respuesta determinada, y la respuesta de E3 es **no inventar el caso de
uso**.

Las decisiones de la **Etapa 1** (`REQ-DECISION-NEEDED-01`, `REQ-DECISION-NEEDED-02`) y las de la
**Etapa 2** (`ACTOR-DECISION-01`, `ACTOR-DECISION-02`) **no** se movieron aquí. Siguen perteneciendo a
sus documentos de origen.

| ID | Pregunta | Bloqueante | Etapa en que debe resolverse |
|---|---|---|---|
| `UC-DECISION-01` | ¿Existe un objetivo de consultar la ficha de un equipo o de una persona? | **NO** | Antes de la arquitectura de información (**Etapa 8**) |
| `UC-DECISION-02` | ¿Existe un objetivo de cerrar la sesión propia? | **NO** | Antes de los contratos de pantalla (**Etapa 9**) |

---

# UC-DECISION-01 — Ficha de equipo y ficha de persona

## Pregunta

¿`GEI` debe tener un caso de uso para **consultar la ficha de un equipo** y otro para **consultar la
ficha de una persona** — entre pares, no la propia y no la de un menor delegado?

## Por qué E3 no puede cerrarla con la evidencia

Porque **ninguna fuente la exige** y porque las fuentes que rozan el tema **excluyen** el caso
general. El inventario de E3 deriva de REQ, y aquí no hay REQ:

| Lo que sí existe | Lo que significa |
|---|---|
| `REQ-EVT-023` *"Consulta del evento y su contexto"* | Hay un CU de consulta **para el evento**: `UC-EVT-19`. No hay equivalente para equipo ni para persona |
| `REQ-INS-001` *"Búsqueda"* — *"cubre personas, equipos, eventos y divisiones o líneas"* | La búsqueda **devuelve** esos cuatro tipos. Abrir un resultado es el mecanismo natural, pero la búsqueda **no** dice que la ficha exista como objetivo |
| `REQ-INS-002` *"Alcance y PII de la búsqueda"* | Regula **qué campos** devuelve un resultado. Es `SUPPORTING` de `UC-INS-01`, no un objetivo de consulta |
| `REQ-PPL-009` *"PII mínima del guardián sobre el menor"* | Da un CU de consulta **muy acotado**: `UC-PPL-13`, sólo del menor y sólo con dos flags |
| `REQ-PPL-016` *"Perfil propio"* | Da `UC-PPL-16` para la **propia** ficha. El brief dice literalmente *"con un menor no hay selector innecesario"* — es decir, la ficha de **otro** adulto no está contemplada |
| `REQ-PPL-010` *"Acceso de terceros sobre mí"* | El menor ve **quién actúa por su cuenta**, no la ficha de otros |
| `REQ-STR-010` *"Etiqueta completa de línea y equipo"* | Regula **cómo se nombra** una línea y un equipo, no que exista un CU para consultarlos |
| `REQ-PPL-011` *"Autoridad por campo"* | `CROSS_CUTTING`. Regula los campos de la respuesta en cualquier superficie, **incluida** una ficha si existiera |
| PT §5 fila `Personas/cuentas/accesos` | `ADMIN ✓`, resto `—` |
| PT §5 fila `Club structure` | `ADMIN ✓`, resto `—` |
| **PT §23 — las 38 rutas canónicas** | `/teams`, `/teams/:teamId`, `/people/:personId` **existen como rutas**. PT §23 dice que la lista de rutas es autoritativa, y §37 de PT prohíbe inventar rutas. Pero **PT §23 no dice que cada ruta sea un caso de uso** — y E1 §13 ya convirtió rutas en evidencia, nunca en el conjunto |

**La asimetría es el dato duro:** el producto tiene un CU de consulta para el **evento** y **no** lo
tiene para el **equipo** ni para la **persona**. O el prototipó se tomara esa superficie porque le
resultaba natural, o hay un hueco de requerimientos. **Las fuentes no eligen.**

## Evidencia de que el CURRENT sí tiene la superficie

| Evidencia | Qué muestra |
|---|---|
| `src/app/App.tsx:57-59` | `/teams`, `/teams/:teamId`, `/people/:personId` entre las 41 entradas del router |
| `src/features/overview.tsx` — `Teams`, `TeamDetail`, `PersonDetail` | Las tres pantallas existen y son renderizables |
| `src/features/management.tsx:736-739` | La ficha de equipo en gestión muestra "Equipos" y "No tiene equipos vigentes. La asignación deportiva la hace el club" |
| `src/features/management.tsx:660` | *"puede asignar a un equipo: el club no tiene los datos para hacerlo"* — el prototipo **sabe** que no puede ofrecer la afiliación al `COACH` |

**Esto es evidencia de una brecha, no una autoridad.** E1 §12.3 y `GEI_ACTOR_RECONSTRUCTION_AUDIT_V1.md`
§15 ya dequejaba que el CURRENT no implementa el modelo de E2, y E1 §12.1 punto 11 exige que
**0 comportamientos del CURRENT se conviertan en requerimiento**. Convertir estas dos pantallas en
dos CU sería exactamente ese incumplimiento.

## Opciones

| Opción | Descripción | Consecuencia |
|---|---|---|
| **(a) No existe** | La ficha de equipo y la de persona entre pares **no son objetivos funcionales de V1**. `UC-INS-01` es el único camino para llegar a esos objetos: el buscador los devuelve con los campos que la autoridad permite | Coherente con E1 y con `REQ-INS-002`. **Es la opción que E3 aplicó.** Cierra la superficie del CURRENT como `MISSING_EXPECTED_UC_SURFACE` o como `NO_FUNCTIONAL_OWNER`, sin crear CU |
| **(b) Existe un CU "Consultar un equipo"** | `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-COACH` ven su equipo: composición, affiliation vigente, roster, eventos y disponibilidad | **Añade 1 CU.** Necesita REQ nuevo con actor, alcance y resultado observable. El alcance por actor es el punto difícil: un jugador ve **su** equipo, un entrenador **los suyos**, y `ACT-ADMIN` lo ve todo. Y `ACT-SUBCOMMITTEE` no administra estructura (`REQ-STR-009`) pero sí debería poder verla |
| **(c) Existe un CU "Consultar una persona"** | `ACT-ADMIN` ve la ficha completa; los roles operativos ven nombre y contacto con necesidad operativa; `ACT-GUARDIAN` ve la de su menor por `UC-PPL-13`; `ACT-PLAYER` ve la propia por `UC-PPL-16` | **Añade 1 CU.** El PII es el punto difícil: `REQ-PPL-011` y PT §6 gobiernan los campos, pero **ningún REQ dice que la ficha sea consultable**. Y PT §5 no da fila de lectura de personas a nadie |
| **(d) Ambas** | (b) + (c) | **Añade 2 CU** y obliga a definir el alcance de 6 actores sobre 2 objetos |

## Recomendación

**(a) No existe, por ahora — y la pregunta se eleva al club.**

Motivo honesto: la evidencia **no** sostiene ninguna alternativa. Un CU sin REQ es feature creep, y
el brief §61 lo prohíbe. Pero la pregunta de fondo es legítima: un club hockey **quiere** poder
mirar su equipo y sus jugadoras sin pasar por un buscador. Eso es una **necesidad de producto**, no
un hueco de documentación, y la autoridad para decidirla es del club, no de E3.

**Lo que E3 hará si el club adopta (b), (c) o (d):** crear `UC-PPL-18 · Consultar la ficha de una
persona` y `UC-STR-16 · Consultar un equipo`, con REQ nuevos y **versión nueva de E1** — porque sin
REQ el gate de §46 ("0 capacidades nuevas sin Product Truth/REQ") no se puede satisfacer.

## Impacto

| Elemento | Con (a) — aplicado | Con (b) | Con (c) | Con (d) |
|---|---|---|---|---|
| CU totales | **102** | 103 | 103 | **104** |
| Dominio afectado | — | `STR` | `PPL` | `STR` + `PPL` |
| REQ nuevos | 0 | 1 | 1 | 2 |
| Versión nueva de E1 | No | **Sí** | **Sí** | **Sí** |
| Cambia actor primario de algún CU | No | No | No | No |
| Cambia authority de algún CU | No | No | No | No |
| Cambia resultado funcional | No | No | No | No |
| `/teams`, `/teams/:teamId`, `/people/:personId` en E8 | Sin dueño funcional | Con dueño | Con dueño | Con dueño |
| **¿Bloquea E3?** | **NO** | No | No | No |

**Verificación contra los cuatro criterios de bloqueo del §8 del brief:** ninguna de las cuatro
opciones altera la **existencia** de un CU ya congelado, ni un **actor primario**, ni una
**authority** necesaria, ni un **resultado funcional**. Sólo el **número** de CU cambia, y sólo si
el club lo decide. Por eso **no es bloqueante**: el inventario es completo **con respecto al conjunto
de REQ congelado**, que es la única autoridad que E3 tiene.

## Ámbito

- **Dominios:** `PPL`, `STR`, `INS`
- **Actores afectados:** los 6 roles concretos. `ACT-ADMIN` es el único con fila de lectura de
  personas y estructura en PT §5
- **REQ afectados:** ninguno. **La decisión crea REQ, no los modifica**
- **Actores afectados:** `ACT-SUBCOMMITTEE` quedaría con lectura de estructura **sin** ser
  administrador, lo que exige declarar esa lectura explícitamente
- **Etapa de destino:** **Etapa 8 (arquitectura de información)**. Antes de esa etapa hay que saber
  si estas superficies tienen dueño funcional, porque E8 no puede asignar un destino a un CU que no
  existe
- **Bloqueante para E3:** **NO**

---

# UC-DECISION-02 — Cierre de la sesión propia

## Pregunta

¿Existe un caso de uso **"Cerrar mi sesión"** — cerrar la sesión que uno mismo está usando — o es
suficiente `UC-IAM-01` para entrar y `UC-IAM-08` para cortar accesos ajenos?

## Por qué E3 no puede cerrarla con la evidencia

Porque el REQ que cubre sesiones **delimita** el caso y excluye el propio:

| Fuente | Qué dice |
|---|---|
| `REQ-IAM-010` `STATEMENT` | *"…ver su estado de sesión actual y las demás sesiones abiertas de su cuenta, y **cerrar una sesión remota** de forma individual"* |
| `REQ-IAM-010` AC 1 | *"ve su sesión actual y las demás, **con la actual distinguida**"* — la distinción existe para poder decir cuál **no** se cierra desde ahí |
| `REQ-IAM-010` AC 2 | *"GIVEN una sesión **remota** WHEN el usuario la cierra THEN esa sesión queda invalidada…"* |
| `REQ-IAM-001` | Cubre **crear** la sesión. Su `STATEMENT` y sus AC hablan de obtener sesión, no de terminarla |
| `REQ-IAM-002` AC | *"desactivar revoca sesiones"* — es el fin de sesión por cambio de estado de cuenta, no un cierre voluntario |
| `REQ-IAM-008` | Caducidad: 12 h inactiva / 7 d absoluta. Es un fin **automático**, no un acto del actor |
| `REQ-IAM-020` | Interrupción de sesión. Es un **fallo**, no un cierre |
| `OUT-IAM-001`, `OUT-IAM-002`, `OUT-IAM-003` | Excluyen ingreso externo, MFA/passkeys y **recuperación self-service** de contraseña. No hablan de cerrar sesión |

**Nadie nombra el cierre voluntario de la sesión propia.** Y el `ACT-UNAUTHENTICATED` de E2 §3.2
justifica su existencia precisamente porque `REQ-IAM-001` **exige** que alguien inicie la
autenticación: sin actor, el REQ no tiene sujeto. Por simetría, el fin de sesión también debería
tener un sujeto… y no lo tiene.

## Opciones

| Opción | Descripción | Consecuencia |
|---|---|---|
| **(a) No existe** | No hay CU de cierre de sesión propia. La persona deja de usar GEI por inactividad, por `UC-IAM-02` (si alguien la deshabilita) o simplemente deja de entrar | Coherente con el texto literal de `REQ-IAM-010`. **Es la opción que E3 aplicó.** Pero deja al club sin una salida limpia, y un producto sin salida limpia es una decisión de producto, no una omisión |
| **(b) Existe `UC-IAM-11 · Cerrar mi sesión`** | `ACT-AUTHENTICATED` y sus 6 especializaciones terminan la sesión vigente; el trabajo en curso se preserva según `REQ-IAM-020` | **Añade 1 CU.** Necesita REQ nuevo. `ACT-IAM-003` completaría el ciclo de vida de la sesión |
| **(c) Es parte de `UC-IAM-08`** | `UC-IAM-08` pasa a "Cerrar una sesión", incluyendo la propia, y `REQ-IAM-010` se amplía | **Añade 0 CU**, pero cambia el `success outcome` de un CU ya congelado y **contradice** el texto "sesión remota" de `REQ-IAM-010`. Obliga a versionar E1 |

## Recomendación

**(b) Existe `UC-IAM-11 · Cerrar mi sesión`, con REQ nuevo.**

Motivo: el cierre de la sesión propia no es un detalle de implementación, es un **acto de
seguridad** con resultado observable —la sesión deja de existir en el servidor— y con una
consecuencia funcional que el usuario percibe (no puede seguir operando). Un producto donde una
persona compartida un equipo no puede terminar su propia sesión tiene un problema de seguridad
práctico: la única salida es esperar 12 h o pedir a un administrador que la deshabilite.

Y **no** es (c): (c) contradice el texto de `REQ-IAM-010` y mezcla dos objetivos con reglas distintas
—cerrar una sesión **remota** requiere identificarla entre varias y no afecta a quien operas;
cerrar la **propia** termina tu propio contexto de trabajo. Son dos objetivos, como las dos
mitades de `REQ-IAM-003` que E3 sí separó en `UC-IAM-03` y `UC-IAM-04`.

Contra-argumento honesto: **ninguna fuente lo pide.** Por eso E3 no lo crea. Lo registra como
decisión con recomendación, y espera que el club la tome.

## Impacto

| Elemento | Con (a) — aplicado | Con (b) — recomendado | Con (c) |
|---|---|---|---|
| CU totales | **102** | **103** | 102 |
| CU afectados | — | se **añade** `UC-IAM-11` | se **modifica** `UC-IAM-08` |
| REQ nuevos | 0 | 1 | 0 |
| Versión nueva de E1 | No | **Sí** | **Sí** |
| Cambia el resultado funcional de un CU congelado | No | No | **Sí** |
| `REQ-IAM-010` | Intacto | Intacto | Requiere ampliación |
| COMPLEMENTA el ciclo `Account → sesión → fin` | No | **Sí** | Parcial |
| **¿Bloquea E3?** | **NO** | No | **Sí** — cambia un resultado congelado |

## Ámbito

- **Dominio:** `IAM`
- **Actores afectados:** `ACT-AUTHENTICATED` y sus 6 especializaciones. `ACT-UNAUTHENTICATED` **no**
  tiene sesión que cerrar
- **REQ afectados:** `REQ-IAM-010` (con la opción c), `REQ-IAM-001`, `REQ-IAM-020`
- **CU futuros afectados:** `UC-IAM-08` (opción c) o `UC-IAM-11` (opción b)
- **Etapa de destino:** **Etapa 9 (contratos de pantalla)**. Antes hay que saber si hay un control de
  cierre de sesión, porque un producto sin salida visible es un problema de contrato de pantalla
- **Bloqueante para E3:** **NO**

---

# NOTAS DE CIERRE

1. **Ambas decisiones son no bloqueantes por construcción.** Ninguna altera la existencia de un CU
   congelado, ni un actor primario, ni una authority necesaria, ni un resultado funcional ya
   emitido. Las dos sólo cambian el **número** de CU si el club las adopta.
2. **Ninguna se resolvió por inferencia.** E3 aplicó la lectura conservadora: sin REQ, no hay CU.
   Adoptar cualquiera de las alternativas exige decisión de producto escrita y **versión nueva de
   `GEI_REQUIREMENTS_FREEZE_V1.md`**, porque el gate de §46 no admite una capacidad sin REQ.
3. **Ninguna decisión de E1 o de E2 se movió aquí.** `REQ-DECISION-NEEDED-01` y
   `REQ-DECISION-NEEDED-02` siguen en `docs/requirements/GEI_REQUIREMENTS_OPEN_DECISIONS_V1.md`.
   `ACTOR-DECISION-01` y `ACTOR-DECISION-02` siguen en
   `docs/actors/GEI_ACTOR_OPEN_DECISIONS_V1.md`. E3 aplicó sus **valores congelados**, no sus
   recomendaciones.
4. **PT §82 aplica a las dos.** Si alguna se decide y cambia comportamiento de V1, hay que revisar
   la sección correspondiente de `PT v1.0.1` antes de modificar el catálogo de requerimientos.
5. **`GEI_USE_CASE_INVENTORY_FREEZE_V1.md` §3.3 ya declara estas dos ausencias** como exclusiones
   explícitas. Si el club las adopta, hay que versionar también ese freeze.
6. **E3 no eliminó ni ajustó estas pantallas del CURRENT ni las eliminó.** `docs/use-cases/` es el único
   directorio que este lote creó; `src/**` no se tocó.

---

**Fin del Use Case Open Decisions V1.**

**SOURCE MODIFIED: NO.** Este lote creó únicamente archivos bajo `docs/use-cases/`.
