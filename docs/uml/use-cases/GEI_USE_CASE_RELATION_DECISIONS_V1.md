# GEI HOCKEY MANAGEMENT SYSTEM
## USE CASE RELATION DECISIONS V1

**Etapa:** 4 — Diagramas de casos de uso
**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-05
**Rama:** `gei/e4-use-case-diagrams-freeze-v1`
**Baseline de E3:** `730bf8ffee428666d24a588e23f23b457dc35123`

| Autoridad de entrada | Archivo · Versión |
|---|---|
| Candidatas y rechazos | `docs/use-cases/GEI_USE_CASE_RELATION_CANDIDATES_V1.md` — **V1** |
| Casos de uso | `docs/use-cases/GEI_MASTER_USE_CASE_CATALOG_V1.md` — **V1** |
| Requerimientos | `docs/requirements/GEI_REQUIREMENTS_FREEZE_V1.md` — **V1** + errata de E3 |
| Actores | `docs/actors/GEI_ACTOR_MODEL_FREEZE_V1.md` — **V1** |

> E3 §8.1 congeló **0** relaciones y declaró que decidir las relaciones es trabajo de E4.
> Este documento es el registro de esa decisión. **Ninguna relación dibujada en E4 fue
> inventada por E4**: todas proceden de las 8 candidatas de E3, reclasificadas o no.

---

# 1. RESUMEN DE LA DECISIÓN

| ID candidata | Tipo E3 | Tipo final E4 | Decisión | Aristas dibujadas |
|---|---|---|---:|---:|
| `INC-01` | `include` | **INCLUDE** | `ACCEPT_INCLUDE` | **39** |
| `INC-02` | `include` | **INCLUDE** | `ACCEPT_INCLUDE` | **5** |
| `EXT-01` | `extend` | **EXTEND** | `ACCEPT_EXTEND` | **1** |
| `EXT-02` | `extend` | **EXTEND** | `ACCEPT_EXTEND` | **2** |
| `EXT-03` | `extend` | **EXTEND** | `ACCEPT_EXTEND` | **1** |
| `EXT-04` | `extend` | **EXTEND** | `ACCEPT_EXTEND` | **2** |
| `EXT-05` | `extend` | **SIBLING** | `REJECT_EXTEND` | **0** |
| `EXT-06` | `extend` | **SIBLING** | `REJECT_EXTEND` | **0** |
| | | | **TOTAL** | **50** |

| Métrica | Valor |
|---|---:|
| Candidatas evaluadas | **8 / 8** |
| `UNDECIDED` | **0** |
| `DEFER_TO_E5` | **0** |
| Reclasificaciones | **2** (`EXT-05`, `EXT-06` → `SIBLING`) |
| Relaciones rechazadas por E3 y no dibujadas | **9 / 9** |
| Relaciones nuevas no autorizadas | **0** |

---

# 2. CRITERIO APLICADO

No se/confió en el label de E3. Cada candidata se re-evaluó contra los tres criterios
de E3 §1.1 (`include`) y §1.2 (`extend`), y contra la semántica UML estricta del brief §9:

| Semántica | Regla aplicada |
|---|---|
| `INCLUDE` | El comportamiento incluido es **obligatorio** para completar el CU base cada vez que aplica ese CU base |
| `EXTEND` | El comportamiento aparece **sólo** bajo una condición, y el CU base **puede completarse sin él** |
| `PRECONDITION` | Si sólo describe estado previo requerido ⇒ **no se dibuja relación** |
| `BUSINESS_RULE` | Si sólo restringe el flujo ⇒ **no se dibuja relación** |
| `SIBLING` | Si ambos CU son objetivos independientes ⇒ **no se relacionan** |

**Dirección UML.** En un `<<extend>>` la flecha va **del CU que extiende al CU base**.
E3 etiquetaba la pareja como `(source = base, target =/extensor)`. Este documento mantiene
las dos columnas de E3 para poder cotejar, y añade `dirección de la flecha` explícita.

---

# 3. `INC-01` · Reautenticar para una gestión sensible → **INCLUDE**

| Campo | Valor |
|---|---|
| **Source UC (E3)** | `UC-IAM-02`, `UC-IAM-03`, `UC-IAM-05`, `UC-PPL-01`…`UC-PPL-12`, `UC-STR-01`…`UC-STR-15`, `UC-CMP-01`…`UC-CMP-08`, `UC-PRT-12` |
| **Target UC** | `UC-IAM-09` |
| **Tipo candidato** | `<<include>>` |
| **Tipo final** | **`<<include>>`** |
| **Decisión** | `ACCEPT_INCLUDE` |
| **Condición** | El actor inicia una gestión sensible y su sesión **no** tiene reautenticación vigente |
| **Dirección de la flecha** | `UC-IAM-09` **no** es el origen: la flecha va de cada CU base **hacia** `UC-IAM-09` |
| **Diagramas** | `UCD-IAM-01`, `UCD-PPL-01`, `UCD-PPL-02`, `UCD-STR-01`, `UCD-STR-02`, `UCD-CMP-01`, `UCD-CMP-02`, `UCD-PRT-02` |

## 3.1 Por qué `INCLUDE` y no `EXTEND` ni precondición

| Evidencia | Lectura |
|---|---|
| `REQ-IAM-009` AC 1 | *"GIVEN un usuario sin reautenticación reciente WHEN intenta una operación sensible THEN el sistema **pide la contraseña antes de ejecutar**"* |
| `REQ-IAM-009` AC 3 | *"GIVEN una reautenticación fallida o vencida WHEN el usuario insiste THEN **la operación no se ejecuta**"* |
| `REQ-IAM-009` STATEMENT | *"El acceso a operaciones sensibles de gestión **debe exigir** una reautenticación por contraseña reciente, con una ventana de 10 minutos"* |

Los tres criterios de E3 §1.1 se cumplen:

1. **Comportamiento observable** — el actor ve que se le pide la contraseña y ve que la ventana venció.
2. **REQ propio** — `REQ-IAM-009` es `FUNCTIONAL` · `SECURITY` · `PRIORITY P1` y es `PRIMARY` de `UC-IAM-09` (`GEI_REQ_ACTOR_USE_CASE_MATRIX_V1.md`, REQ-IAM-009).
3. **Merece especificación propia** — `UC-IAM-09` existe como CU canónico con goal, trigger y outcome propios.

**Por qué no es precondición (brief §9).** Una precondición se cumple o falla **antes** de
ejecutarse y no produce un resultado observable propio. AC 3 dice exactamente lo contrario:
el resultado observable del comportamiento incluido es *"la operación no se ejecutó"*. Si
fuera precondición, el modelo no podría expresar ese segundo resultado.

**Por qué no es `EXTEND`.** `EXTEND` exige que el CU base **pueda completarse sin él**
(E3 §1.2 criterio 2). AC 3 dice que, sin reautenticación vigente, **la operación no se
ejecuta**. El CU base no se completa. Es obligatorio cuando aplica ⇒ `include`.

## 3.2 Las 39 aristas: por qué no se colapsan en un «macro CU»

E3 §2 Fanticipó el riesgo: *«si el ruido gana, la alternativa correcta no es borrar la
relación sino dejar `UC-IAM-09` como CU independiente con precondición explícita»*, y el
brief §10 añade *«No inventar una "macro CU" para agrupar gestiones»*.

**Decisión de representación (E4).** Las 39 aristas **se dibujan**, pero **distribuidas**:
cada CU base aparece en el diagrma de su propio dominio y su arista `<<include>>` sale de
ahí hacia una copia de `UC-IAM-09` con **el mismo ID y el mismo nombre** (mismo elemento
del modelo, permitido por el brief §23). La copia va con trazo discontinuo y cada lámina
lleva una nota de una línea que lo declara.

**Por qué no un `UCD-X-01` de relaciones cruzadas.** El brief §24 lo permite *«sólo si
aporta claridad»*. Aquí **no** aporta: obligaría a repetir 39 CU en una lámina adicional,
es decir, más ruido, no menos. La legibilidad se conserva distribuyendo.

## 3.3 Discrepancia registrada: E3 "~24 aristas" frente a 39 enumeradas

| Fuente | Aritidad |
|---|---:|
| E3 Freeze §8.2 y Candidates §6 — *«~24 aristas»* | ~24 |
| E3 Candidates §INC-01 — lista explícita de `source UC` | **39** |
| E3 Freeze §8.4 — *«no debe dibujar una arista include desde cada CU hacia "autenticarse"»* | — |

Se dibujó la **lista enumerada** (39), por ser la evidencia más precisa: una estimación
aproximada no puede prevalecer sobre una enumeración explícita de la misma candidata.

`3 + 12 + 15 + 8 + 1 = 39`. Comprobado contra `scripts/lib/relations.mjs`.

## 3.4 Validación pendiente para E5 (no bloqueante)

`GEI_REQ_ACTOR_USE_CASE_MATRIX_V1.md` clasifica `REQ-IAM-009` **sólo** como `PRIMARY` de
`UC-IAM-09`; no lo lista como `SUPPORTING` de los 39 CU base. La pertenencia al «bloque de
gestión sensible» está enunciada a nivel de bloque por E3, no CU por CU.

- **E4 congela el TIPO** (`INCLUDE`), que está evidenciado por AC 1 + AC 3.
- **E4 congela el PERÍMETRO** tal como E3 lo enumeró (39).
- **E5 debe confirmar** si esas 39 son exactamente las operaciones sensibles. `REQ-IAM-009`
  no enumera operaciones, y ninguna autoridad las enumera.

| Impacto si E5 reduce el perímetro | Consecuencia |
|---|---|
| Si algunas de las 39 no son sensibles | Se borran esas aristas `<<include>>`. Ningún CU, actor ni nombre cambia. |
| Si alguna gestión sensible adicional existe | Se añade su arista. Ningún CU nuevo: el `UC-IAM-09` ya existe. |
| Si el perímetro se mantiene | El diagrama queda exactamente como está. |

**No bloquea el gate de E4**: ninguna relación inventada, ninguna rechazada dibujada,
ningún CU nuevo.

---

# 4. `INC-02` · Revisar el impacto de un cambio material → **INCLUDE**

| Campo | Valor |
|---|---|
| **Source UC (E3)** | `UC-EVT-04`, `UC-EVT-05`, `UC-EVT-07`, `UC-EVT-08`, `UC-EVT-16` |
| **Target UC** | `UC-EVT-11` |
| **Tipo candidato** | `<<include>>` |
| **Tipo final** | **`<<include>>`** (5 aristas) |
| **Decisión** | `ACCEPT_INCLUDE` |
| **Condición** | El cambio propuesto es **material** según la lista cerrada de `REQ-EVT-011` |
| **Etiqueta de condición** | `[MATERIAL_CHANGE]` |
| **Dirección de la flecha** | De cada CU base **hacia** `UC-EVT-11` |
| **Diagramas** | `UCD-EVT-02a` (4 aristas), `UCD-EVT-03` (1 arista) |

## 4.1 La duda real de E3 queda resuelta con evidencia, no con suposición

E3 §2 dejó la duda explícita: *«E4 debe verificar si `REQ-EVT-012` se extiende también a las
transiciones de lifecycle o sólo a la edición de campos … E5 debe fijar ese límite»*, y el
brief §11 ofrece `DEFER_TO_E5` para ese caso.

**La evidencia alcanza y la resuelve en E4.** No hace falta diferir:

| Evidencia | Texto | Qué demuestra |
|---|---|---|
| `REQ-EVT-011` STATEMENT | *«…de sede, de equipos destino, de personas destino, de audiencia de club, de rival, de inscripción de competencia, de los datos de logística, **o las acciones de posponer, reprogramar, cancelar y restaurar**, deben considerarse cambio material»* | La lista cerrada de material **enumera por nombre** posponer, cancelar y restaurar. `UC-EVT-05`, `UC-EVT-07` y `UC-EVT-08` son, por definición de la autoridad, cambios materiales. |
| `REQ-EVT-019` RELATED BUSINESS RULES | *«`REQ-EVT-011` (**los cambios de logística son materiales**)»* | La logística es material. `UC-EVT-16` entra. |
| `REQ-EVT-012` STATEMENT | *«**Antes de aplicar un cambio material**, el sistema debe mostrar su impacto … y exigir una confirmación explícita»* | El REQ está escrito **sobre la clase** «cambio material», no sobre una lista de operaciones. |
| `REQ-EVT-012` AC 1 | *«GIVEN un cambio material **propuesto** WHEN el actor pide el impacto THEN el sistema devuelve las personas y roles alcanzados y las consecuencias»* | La redacción genérica es deliberada: la clase está definida por `REQ-EVT-011`. |

**La ausencia de enumeración en `REQ-EVT-012` no es una restricción**: es la consequence de
que el REQ opera sobre la clase que `REQ-EVT-011` define. Leerlo como restricción sería
inventar un límite que ninguna autoridad escribe.

## 4.2 Frontera exacta: lo que `INC-02` **no** cubre

La lista cerrada de `REQ-EVT-011` es también la frontera. Los CU de `EVT` que **no**
materializan un cambio material **no** llevan arista:

| CU | ¿Está en la lista de `REQ-EVT-011`? | Arista |
|---|---|---|
| `UC-EVT-01` Crear un entrenamiento | No — es una creación, no un cambio | **No** |
| `UC-EVT-02` Crear un partido | No — creación | **No** |
| `UC-EVT-03` Crear un evento del club | No — creación | **No** |
| `UC-EVT-06` Reanudar un evento pospuesto | **No** — la lista dice «posponer», no «reanudar» | **No** |
| `UC-EVT-09` Completar un evento | **No** | **No** |
| `UC-EVT-10` Abandonar un evento | **No** | **No** |
| `UC-EVT-13` Crear una serie | No — creación | **No** |
| `UC-EVT-14` Finalizar una serie | No — la lista no la menciona | **No** |
| `UC-EVT-15` Programar una jornada | No — creación | **No** |

Esto es lo que permite afirmar que `INC-02` está **cerrada**: 5 aristas dibujadas y 14 CU de
`EVT` deliberadamente sin arista, con motivo verificable.

## 4.3 Por qué `INCLUDE` y no `EXTEND`

`EXTEND` exige que `UC-EVT-04`, `UC-EVT-05`, `UC-EVT-07`, `UC-EVT-08` y `UC-EVT-16` puedan
completarse **sin** revisar el impacto. `REQ-EVT-012` STATEMENT dice *«antes de aplicar un
cambio material … **debe** mostrar su impacto y **exigir** una confirmación explícita»*: sin
esa revisión, el cambio no se aplica. Obligatoria ⇒ `include`.

`UC-EVT-11` conserva goal propio (*«que nadie coordine a un equipo a ciegas»*, REQ-EVT-012
GOAL) y outcome propio, y sigue siendo un CU canónico independiente: `include` no significa
«cuello de botella sin flujo propio».

---

# 5. `EXT-01` · Resolver un conflicto de edición concurrente → **EXTEND**

| Campo | Valor |
|---|---|
| **Source UC (E3)** | `UC-EVT-04` *(E3 lo llama base)* |
| **Target UC (E3)** | `UC-EVT-12` *(E3 lo llama extensor)* |
| **Tipo candidato** | `<<extend>>` |
| **Tipo final** | **`<<extend>>`** |
| **Decisión** | `ACCEPT_EXTEND` |
| **Condición** | `STALE_VERSION` |
| **Etiqueta** | `«extend»` + `[STALE_VERSION]` |
| **Dirección de la flecha** | **De `UC-EVT-12` hacia `UC-EVT-04`** |
| **Diagrama** | `UCD-EVT-02a` |

## 5.1 Corrección de dirección

E3 §3 escribió *«Source UC: `UC-EVT-04` … Target UC: `UC-EVT-12`»* usando su convención
`(base, extensor)`. La **flecha** va en el sentido contrario:

```
UC-EVT-12  «extend» [STALE_VERSION] ──────▶  UC-EVT-04
 (extensor, sólo bajo STALE_VERSION)          (base, se completa sin él)
```

El criterio es E3 §1.2 criterio 2: *«se insula dentro de otro CU · el CU base puede
completarse sin él»*. `UC-EVT-04` se completa en el caso normal; `UC-EVT-12` sólo aparece
cuando el guardado es rechazado. La flecha señala **al CU base**.

## 5.2 Evidencia

`REQ-EVT-013` AC 1: *«GIVEN un formulario con cambios locales WHEN el recurso cambia en el
servidor y el actor guarda THEN la operación es rechazada y el usuario ve su base, sus
cambios y la versión actual»*. `REQ-SYS-017`; PT §44 (`409 preserves: baseline; localDraft;
latestServer`, `No generic force overwrite`); PT §73 (`409 STALE_VERSION → Conflict Workspace`).

`UC-EVT-04` **no** requiere `UC-EVT-12`: se completa con normalidad. `UC-EVT-12` no es un
`include` de `UC-EVT-11`: un conflicto de concurrencia **no** es un cambio material, son
disjuntos.

---

# 6. `EXT-02` · Corregir la asistencia de un evento → **EXTEND**

| Campo | Valor |
|---|---|
| **Source UC (E3)** | `UC-PRT-05`, `UC-PRT-06` *(bases)* |
| **Target UC (E3)** | `UC-PRT-07` *(extensor)* |
| **Tipo final** | **`<<extend>>`** — 2 aristas |
| **Decisión** | `ACCEPT_EXTEND` |
| **Condición** | Planilla de asistencia `CLOSED`, o valor detectado mal después de cerrar |
| **Etiqueta** | `«extend»` + `[SHEET_CLOSED]` |
| **Dirección** | De `UC-PRT-07` **hacia** `UC-PRT-05` y **hacia** `UC-PRT-06` |
| **Diagrama** | `UCD-PRT-01` |

| Evidencia | Texto |
|---|---|
| `REQ-PRT-011` AC 1 | *«…la planilla ya no admite marcaje nuevo **sin corrección**»* |
| `REQ-PRT-012` AC 3 | *«GIVEN una corrección **sin motivo** WHEN se intenta THEN la operación no se completa»* |
| `REQ-PRT-011` NOTES | *«La reapertura de una planilla cerrada **no** es requisito … la corrección cubre el caso (`CON-13`)»* |

`UC-PRT-05` y `UC-PRT-06` se completan el 100 % de las veces sin `UC-PRT-07` ⇒ `extend`.
La corrección **no** es un segundo camino principal: `REQ-PRT-011` prohíbe reabrir, y la
corrección es la única vía ⇒ no es un segundo `include` de la asistencia.

---

# 7. `EXT-03` · Corregir el resultado de un partido → **EXTEND**

| Campo | Valor |
|---|---|
| **Source UC (E3)** | `UC-PRT-09` *(base)* |
| **Target UC (E3)** | `UC-PRT-10` *(extensor)* |
| **Tipo final** | **`<<extend>>`** |
| **Decisión** | `ACCEPT_EXTEND` |
| **Condición** | `MatchRecord` en estado `FINAL` |
| **Etiqueta** | `«extend»` + `[RESULT_FINAL]` |
| **Dirección** | De `UC-PRT-10` **hacia** `UC-PRT-09` |
| **Diagrama** | `UCD-PRT-02` |

`REQ-PRT-013` AC 2 **diseña la relación en su propia redacción**:
*«GIVEN un resultado finalizado WHEN se intenta editarlo por la vía normal THEN la
operación **no está disponible** y **se ofrece la vía de corrección**»*. La vía normal
(`UC-PRT-09`) se cierra; la corrección se ofrece. Condicional, observable, insertable dentro,
y el base se completa sin ella. Es el `extend` mejor_evidenciado del conjunto.

---

# 8. `EXT-04` · Revisar los conflictos de una convocatoria → **EXTEND**

| Campo | Valor |
|---|---|
| **Source UC (E3)** | `UC-PRT-02`, `UC-PRT-03` *(bases)* |
| **Target UC (E3)** | `UC-PRT-04` *(extensor)* |
| **Tipo final** | **`<<extend>>`** — 2 aristas |
| **Decisión** | `ACCEPT_EXTEND` |
| **Condición** | Existen conflictos derivados: `ELIGIBILITY_BLOCKED`, `ELIGIBILITY_PENDING`, `NO_LONGER_EVENT_TARGET`, `NO_LONGER_TEAM_AFFILIATED` |
| **Etiqueta** | `«extend»` + `[DERIVED_CONFLICTS]` |
| **Dirección** | De `UC-PRT-04` **hacia** `UC-PRT-02` y **hacia** `UC-PRT-03` |
| **Diagrama** | `UCD-PRT-01` |

## 8.1 La evidencia que **descarta** `include`

`REQ-PRT-006` AC 1: *«GIVEN una convocatoria con una persona bloqueada por elegibilidad WHEN
el entrenador publica THEN **la publicación prospera** y el conflicto queda derivado y
visible»*.

Si `UC-PRT-04` fuera `include` de `UC-PRT-03`, el modelo afirmaría que **no se puede publicar
con conflicto**. `REQ-PRT-006` dice exactamente lo contrario. Un `include` aquí
**falsearía la regla de negocio**, y por eso E3 §1.3 lo prohíbe por nombre en su análisis de
`REJ-04`. `extend` modela la verdad: se puede publicar, y *si* hay conflicto hay revisión.

`REQ-PRT-006` AC 2: *«…se explica el motivo en lenguaje de usuario y **se ofrece la
superficie de revisión de conflictos**»* — condicional, observable, offered, no exigido.

---

# 9. `EXT-05` · Marcar una notificación como leída → **SIBLING** (no se dibuja)

| Campo | Valor |
|---|---|
| **Source UC (E3)** | `UC-COM-13` *(E3 lo llama base)* |
| **Target UC (E3)** | `UC-COM-14` *(E3 lo llama extensor)* |
| **Tipo candidato** | `<<extend>>` |
| **Tipo final** | **`SIBLING`** |
| **Decisión** | `REJECT_EXTEND` — se conservan **dos CU independientes**, sin relación |
| **Dirección** | **Ninguna.** No se dibuja flecha |
| **Diagrama** | `UCD-COM-02` (ambos CU, sin arista entre ellos) |

## 9.1 Por qué no es `extend`

E3 §3 la dejó como *«MEDIA»* y dijo: *«Ambas son defendibles; por eso queda como candidata y
no como decisión»*. E4 decide con `REQ-COM-018`:

| Evidencia | Texto | Por qué refute `extend` |
|---|---|---|
| `REQ-COM-018` NOTES | *«…el estado de lectura por notificación **sí es requisito**»* | Es un requisito **en su propio derecho**, no una parte opcional de otro. E3 lo comprobó explícitamente al clasificar *«marcar todas como leídas»* como `ACCIDENTAL UI` y preservar el estado de lectura individual. |
| `REQ-COM-018` GOAL | *«Que la lista de avisos sea una lista, no un registro duplicado ni una trampa de navegación»* | El objetivo es la **calidad de la lista**, no insertar una acción dentro de consultar. La lectura del AC es *sibling*, no *extensión*. |
| `REQ-COM-018` AC 2 | *«GIVEN una lista de notificaciones WHEN se marca una como leída THEN el estado persiste **sin abandonar la lista**»* | «Sin abandonar la lista» es una **restricción de navegación y de superficie**, no una inserción de comportamiento en el flujo de consulta. Por eso E3 lo dejó como *«las dos cosas»*. |

## 9.2 El test decisivo

`<<extend>>` implica que el CU extensor **no tiene goal, trigger ni outcome propios**: se
define sólo por su relación con el base. `UC-COM-14` tiene las tres cosas en el catálogo de
E3 (goal *«Marcar una notificación como leída»*, trigger propio, success outcome propio), y su
actor primario es `ACT-AUTHENTICATED` igual que `UC-COM-13`, pero su **resultado observable
es distinto**: `UC-COM-13` deja `read_at` intacto; `UC-COM-14` lo escribe. Resultado distinto
⇒ objetivo independiente ⇒ `SIBLING`.

En `UCD-COM-02` los dos CU aparecen **con el mismo actor y sin ninguna línea entre ellos**, y
la lámina lleva la nota *«UC-COM-13 y UC-COM-14 son CU hermanos: no media relación include ni
extend entre ellos»*. Esa es la representación visual de esta decisión.

---

# 10. `EXT-06` · Completar el perfil de una jugadora → **SIBLING** (no se dibuja)

| Campo | Valor |
|---|---|
| **Source UC (E3)** | `UC-PPL-06` *(E3 lo llama base)* |
| **Target UC (E3)** | `UC-PPL-02` *(E3 lo llama extensor)* |
| **Tipo candidato** | `<<extend>>` |
| **Tipo final** | **`SIBLING`** |
| **Decisión** | `REJECT_EXTEND` — dos CU independientes, sin relación |
| **Dirección** | **Ninguna.** No se dibuja flecha |
| **Diagramas** | `UCD-PPL-01` (`UC-PPL-02`) y `UCD-PPL-02` (`UC-PPL-06`) |

## 10.1 La evidencia que **descarta** `extend` y también `include`

`REQ-PPL-002` AC 1: *«GIVEN una persona a la que le falta cualquiera de los seis datos WHEN se
intenta **asignarla a un equipo** THEN la operación es **rechazada** con
`PLAYER_PROFILE_INCOMPLETE` e indica qué falta»*.

La incorporación **no incorpora** la corrección del perfil: **la rechaza**. Un `include`
afirmaría que `UC-PPL-06` se completa ejecuta `UC-PPL-02`; el requerimiento afirma que se
completa **no** ejecutándola. Por eso `EXT-06` no puede ser `include` en ninguna dirección.

## 10.2 Por qué tampoco es `extend`

| Evidencia | Texto | Por qué |
|---|---|---|
| `REQ-PPL-002` PRELIMINARY ACTOR | `Admin` | `UC-PPL-02` lo inicia `ACT-ADMIN` **con autoridad propia**, sin condición de incorporación. No es condicional respecto de `UC-PPL-06`. |
| `REQ-PPL-013` AC 3 | *«GIVEN un Admin WHEN abre la ficha de esa persona THEN dispone de la operación de **corregir su identidad**»* | Es una **capacidad alcanzable de forma independiente**, no un punto de inserción dentro de la incorporación. |
| `REQ-PPL-013` AC 2 | *«GIVEN esa jugadora WHEN intenta editar los datos que administra el club THEN no hay operación de edición; el siguiente paso es **avisar a la administración**»* | El camino es un aviso, no una ejecución embebida. |

Objetivo, resultado y reglas distintos, y cada uno alcanzable por separado ⇒ `SIBLING`.
Exactamente el criterio `REJECT_SIBLING_USE_CASE` del brief §8.

---

# 11. LAS 9 RELACIONES RECHAZADAS POR E3 — VERIFICACIÓN DE NO DIBUJO

Las nueve **no aparecen** en ningún `.drawio`. La comprobación es automática y re-ejecutable:
`node scripts/validate-drawio-use-cases.mjs` → `REJECTED_RELATION_DRAWN = 0`.

| ID | Relación rechazada por E3 | AC que lo prohíbe | Presente en E4 |
|---|---|---|---|
| `REJ-01` | «Autenticar usuario» como `include` de todos los CU | `REQ-IAM-012`: sin rol ni delegación ⇒ `/no-access`. Es **precondición** | **No** |
| `REJ-02` | `UC-IAM-01` como `include` de todos los CU autenticados | Ya es un CU hermano con goal y outcome propios | **No** |
| `REJ-03` | Disponibilidad `include` en asistencia | `REQ-PRT-018`: no se derivan entre sí | **No** |
| `REJ-04` | Habilitación `include` en publicar convocatoria | `REQ-PRT-006`: **publica igual** | **No** |
| `REJ-05` | «Solicitar reconfirmación» como `extend` | `REQ-PRT-003`: el estado es **derivado**; el comando no existe | **No** |
| `REJ-06` | Archivar estructura `include` en archivar equipo | `REQ-STR-006` es una **valla**, no composición | **No** |
| `REJ-07` | Historial `include` en las correcciones | La corrección **produce** historia; `REQ-INS-011` | **No** |
| `REJ-08` | Consultar comunicado `include` en publicarlo | `REQ-COM-001` vs `REQ-COM-005`: actores y objetivos distintos | **No** |
| `REJ-09` | Archivar conversación `include` en enviar mensaje | `REQ-COM-007` AC 4: objetivo independiente | **No** |

Las nueve se verifican **por pareja concreta**, no por ausencia global: el validador comprueba
que ninguna arista `include`/`extend` exista entre esos dos CU, en ninguna dirección y en
ningún archivo.

`REJ-01` y `REJ-02` se verifican además de forma global: `REJECTED_RELATION_DRAWN` salta si
existe **cualquier** arista que apunte a `UC-IAM-01`, y el modelo tiene **0** aristas hacia
`UC-IAM-01`.

## 11.1 `REJ-04` y `EXT-04` no se contradicen

`REJ-04` rechaza `UC-PRT-13 → UC-PRT-03` como `include`. `EXT-04` acepta `UC-PRT-04 → UC-PRT-03`
como `extend`. No son la misma pareja: `UC-PRT-13` es *consultar habilitación* (leer) y
`UC-PRT-04` es *revisar conflictos* (resolver lo derivado). `REQ-PRT-006` permite que la
publicación prospere y, *si* hay conflicto, ofrece revisión. Lo que no puede pasar es que la
habilitación sea un paso obligatorio de la publicación.

---

# 12. RELACIONES DIFERIDAS A E5

**Ninguna.** `DEFER_TO_E5 = 0`.

E3 dejó dos asuntos abiertos:

| Asunto | Resolución E4 |
|---|---|
| Perímetro exacto de `INC-01` (39 CU sensibles) | Decidido como E3 lo enumeró. **Validación** pendiente en E5, registrada en §3.4. No es un `DEFER`: el tipo está congelado. |
| Alcance de `INC-02` sobre transiciones de lifecycle | **Resuelto con evidencia** en §4.1. No diferido. |

Ninguna decisión de E4 depende de semántica que E5 deba fijar.

---

# 13. RELACIONES DIBUJADAS POR DIAGRAMA

| Diagrama | `<<include>>` | `<<extend>>` | Detalle |
|---|---:|---:|---|
| `UCD-IAM-01` | 3 | 0 | `UC-IAM-02/03/05 → UC-IAM-09` |
| `UCD-PPL-01` | 5 | 0 | `UC-PPL-01…05 → UC-IAM-09` |
| `UCD-PPL-02` | 7 | 0 | `UC-PPL-06…12 → UC-IAM-09` |
| `UCD-STR-01` | 8 | 0 | `UC-STR-01…08 → UC-IAM-09` |
| `UCD-STR-02` | 7 | 0 | `UC-STR-09…15 → UC-IAM-09` |
| `UCD-EVT-01` | 0 | 0 | — |
| `UCD-EVT-02a` | 4 | 1 | `UC-EVT-04/05/07/08 → UC-EVT-11`; `UC-EVT-12 →» UC-EVT-04` |
| `UCD-EVT-02b` | 0 | 0 | — |
| `UCD-EVT-03` | 1 | 0 | `UC-EVT-16 → UC-EVT-11` (copia de referencia) |
| `UCD-PRT-01` | 0 | 4 | `UC-PRT-07 →» UC-PRT-05/06`; `UC-PRT-04 →» UC-PRT-02/03` |
| `UCD-PRT-02` | 1 | 1 | `UC-PRT-12 → UC-IAM-09`; `UC-PRT-10 →» UC-PRT-09` |
| `UCD-COM-01` | 0 | 0 | — |
| `UCD-COM-02` | 0 | 0 | — |
| `UCD-CMP-01` | 4 | 0 | `UC-CMP-01/02/03/08 → UC-IAM-09` |
| `UCD-CMP-02` | 4 | 0 | `UC-CMP-04/05/06/07 → UC-IAM-09` |
| `UCD-INS-01` | 0 | 0 | — |
| **TOTAL** | **44** | **6** | **50** |

`→»` = dirección de `<<extend>>`, del CU que extiende al CU base.

---

# 14. LIMITACIONES DECLARADAS

1. **`INC-02` se resolvió con inferencia razonada, no con enumeración de `REQ-EVT-012`.** La
   inferencia es: `REQ-EVT-012` opera sobre la clase «cambio material», y `REQ-EVT-011` es la
   definición de esa clase. Si E5-legislador considerara que `REQ-EVT-012` debe limitarse a la
   edición de campos, habría que borrar 4 aristas (`UC-EVT-05`, `UC-EVT-07`, `UC-EVT-08`,
   `UC-EVT-16`) y su condición `[MATERIAL_CHANGE]`. La evidencia disponible en E1 no sostiene
   esa lectura restrictiva.
2. **La pertenencia al bloque de gestión sensible de `INC-01` no está cerrada CU por CU** en
   ninguna autoridad. Ver §3.4.
3. **Este documento no dibuja y no especifica.** No hay caminos felices, ni alternos, ni
   precondiciones detalladas, ni reglas de negocio: eso es E5.
4. **Las 6 candidatas de confianza alta de E3 se aceptaron con confianza alta.** Las 2 de
   confianza media se rechazaron. E4 no reclasificó ninguna relación de confianza alta a baja.
5. **0 relaciones nuevas.** Ninguna pareja dibujada existe fuera de las 8 candidatas de E3.

---

**Fin del Use Case Relation Decisions V1.**

**SOURCE MODIFIED: NO.** Este lote no modificó `docs/use-cases/**`, `docs/actors/**`,
`docs/requirements/**` ni `src/**`.
