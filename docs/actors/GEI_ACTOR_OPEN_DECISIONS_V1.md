# GEI HOCKEY MANAGEMENT SYSTEM
## ACTOR OPEN DECISIONS V1

**Etapa:** 2 — Modelo de Actores
**Estado:** 2 decisiones abiertas · **0 bloqueantes**
**Fecha:** 2026-10-05
**Rama:** `gei/e2-actor-model-freeze-v1`

Este archivo existe sólo porque E2 encontró **dos** preguntas de modelo de actores que la
evidencia disponible no cierra. Ninguna bloquea el cierre de la Etapa 2.

Las decisiones abiertas de la **Etapa 1** (`REQ-DECISION-NEEDED-01`,
`REQ-DECISION-NEEDED-02`) **no** se movieron aquí. Siguen perteneciendo a
`docs/requirements/GEI_REQUIREMENTS_OPEN_DECISIONS_V1.md`.

| ID | Pregunta | Bloqueante | Etapa en que debe resolverse |
|---|---|---|---|
| `ACTOR-DECISION-01` | ¿`ACT-PLAYER` y `ACT-CAPTAIN` ven su propio estado de habilitación? | **NO** | Antes de los casos de uso de habilitación (**Etapa 3**) |
| `ACTOR-DECISION-02` | ¿`ACT-ADMIN` puede cerrar una jornada? | **NO** | Antes de los casos de uso de jornada (**Etapa 3**) |

---

# ACTOR-DECISION-01 — Visibilidad del propio estado de habilitación

## Pregunta

`ACT-PLAYER` y `ACT-CAPTAIN` ¿ven su propio estado de habilitación, o no lo ven?

## Por qué E2 no puede cerrarla con la evidencia

PT §6 y el Freeze §7.3 enumeran la visibilidad del estado de habilitación y **no incluyen** al
jugador. Por la regla de default deny del Freeze §7.1, la respuesta conservadora es `NONE`, y E2
congela ese valor.

Pero hay evidencia en la dirección contraria que no es descartable:

| Evidencia | Qué implica |
|---|---|
| `REQ-PRT-017` AC 1 | *"Sin restricción activa ⇒ 'habilitada'"*. Exige que exista un estado **observable** |
| `REQ-PRT-017` GOAL | "que la habilitación sea una condición de participación" — una condición que la jugadora no puede ver no puede actuar sobre ella |
| `REQ-PRT-007` AC 3 / NOTES | Los conflictos de habilitación *"puede alimentar Inicio"* |
| `REQ-EVT-021` | Inicio es una proyección de `ACT-AUTHENTICATED`, es decir, de la propia jugadora |
| `REQ-SYS-014` | Coherencia entre superficies: el mismo hecho muestra el mismo valor vigente |
| `ACTOR-UI-09` | La implementación actual **ya** concede `canViewEligibilityStatus` a la propia persona (`src/mock/authority.ts:220`) |

Si un conflicto derivado de la habilitación llega al Inicio de una jugadora y ella no puede ver el
estado que lo origina, la proyección es incoherente con `REQ-SYS-014`. Pero si el estado no debe
ser visible para ella, entonces `REQ-PRT-007` no debería poder alimentar su Inicio. **Las dos
lecturas son defendibles y las fuentes no eligen.**

## Fuentes

| Fuente | Qué dice | Status |
|---|---|---|
| `PT §6` | `Eligibility status \| COACH scope + SUBCOMMITTEE + ADMIN`. `PLAYER` y `CAPTAIN` no aparecen | `AUTHORITATIVE` |
| `PT §5` fila `Eligibility mutation` | `PLAYER: —` · `CAPTAIN: —` · `COACH: lectura status` | `AUTHORITATIVE` |
| Freeze §7.3 | `Estado de habilitación \| Entrenador con alcance, Subcomisión y ADMIN` | `AUTHORITATIVE` |
| Freeze §7.1 | Default: **denegar** | `AUTHORITATIVE` |
| `REQ-PRT-017` AC | *"entrenador ve estado, no motivo ni origen"* — delimita al entrenador, no al jugador | `AUTHORITATIVE` |
| `REQ-CMP-008` | *"el motivo y el origen sólo para Subcomisión y Admin"* | `AUTHORITATIVE` |
| `REQ-PPL-013` GOAL | *"Que la jugadera no quede bloqueada sin salida y sin saber qué hacer"* — precedente de producto: la jugadora **sí** debe poder entender su bloqueo | `EVIDENCE` |
| `src/mock/authority.ts:218-225` | El CURRENT concede el propio estado | `EVIDENCE` (no decide) |

## Opciones

| Opción | Descripción | Consecuencia |
|---|---|---|
| **(a) `NONE`** | `ACT-PLAYER` y `ACT-CAPTAIN` no ven ningún dato de habilitación, ni el propio | Coherente con PT §6 y con default deny. **Cierra la tensión de `REQ-SYS-014` sólo si además se corrige `REQ-PRT-007` para que no alimente el Inicio de la jugadora.** Deja a la jugadora sin forma de entender por qué no puede jugar |
| **(b) `VIEW` del propio estado** | La persona ve su **propio** estado derivado (`PENDING` / `BLOCKED` / `ELIGIBLE`), **nunca** el motivo ni el origen, nunca el de otro | Cierra la tensión de `REQ-SYS-014`. Mantiene el límite de `REQ-CMP-008` intacto porque motivo y origen siguen restringidos. Coherente con el precedente de `REQ-PPL-013`. **Amplía el alcance de `REQ-PPL-011`** |
| **(c) Sólo un booleano derivado** | La persona ve "puede participar" / "no puede participar" sin los estados `PENDING` / `BLOCKED` | Cierra la tensión de `REQ-SYS-014` con el mínimo dato. Introduce una cuarta representación de la habilitación además de `ELIGIBLE` derivado, `PENDING` y `BLOCKED`. **Complejidad sin fuente** |

## Recomendación

**(b) `VIEW` del propio estado, sin motivo ni origen.**

Motivo: es la única opción que satisface simultáneamente las tres restricciones que las fuentes
sí fijan. Default deny se mantiene para **motivo** y **origen** (`REQ-CMP-008`, `REQ-PRT-017`).
La regla `Nunca` de PT §6 no se toca. Y el club obtiene una jugadora que puede entender su
propio bloqueo sin que la información sensible se abra.

Contra-argumento honesto: PT §6 no lo concede, y concederlo es ampliar el alcance de un
requerimiento ya congelado. Por eso es **decisión de producto**, no un cambio que E2 pueda hacer.

## Impacto

| Elemento | Con (a) — congelado por E2 | Con (b) — recomendado |
|---|---|---|
| Matriz PII, filas `ELIGIBILITY STATUS` | `ACT-PLAYER` = `—`, `ACT-CAPTAIN` = `—` | `V` limitado al propio |
| Matriz PII, filas `ELIGIBILITY REASON` / `SOURCE` | `—` | `—` **sin cambio** |
| `ACTOR-UI-09` | `CURRENT CONTRADICTORY` | `CURRENT ALIGNED` |
| `REQ-PRT-007`-feeding-`REQ-EVT-021` | Tensión con `REQ-SYS-014` | Resuelto |
| Casos de uso futuros | Ninguno nuevo | **Uno nuevo**: consultar mi estado de habilitación |
| `REQ-PPL-011` | Sin cambio | **Requiere ampliar**: añadir el propio estado de habilitación a la fila de estado |
| `REQ-SYS-027` (privacidad) | Sin cambio | Sin cambio: es un estado, no un dato sensible |

## Ámbito

- **Dominios:** `PRT`, `PPL`, `CMP`, `SYS`
- **Actores afectados:** `ACT-PLAYER`, `ACT-CAPTAIN`. Indirectamente `ACT-COACH` y
  `ACT-SUBCOMMITTEE` no cambian.
- **Casos de uso futuros afectados:** uno nuevo de consulta propia, si se adopta (b)
- **Requerimientos catalogados que esperarían esta decisión:** `REQ-PPL-011`, `REQ-PRT-017`,
  `REQ-CMP-008`, `REQ-PRT-007`
- **Bloqueante para E2:** **NO.** E2 congela (a) y registra el change candidate

---

# ACTOR-DECISION-02 — Autoridad de `ACT-ADMIN` sobre el cierre de jornada

## Pregunta

`ACT-ADMIN` ¿puede cerrar una jornada?

## Por qué E2 no puede cerrarla con la evidencia

`REQ-EVT-024` (valla de dependencias de jornada) nombra a `Admin · Subcomisión` como actores. Es
el **único** REQ donde `ACT-ADMIN` aparece junto a un concepto que PT §5 no le concede de forma
explícita: PT §5 no tiene fila de cierre de jornada, y las filas deportivas vecinas
(`crear Match`, `postpone/reschedule/cancel Match`) están en `—` para `ADMIN`.

| Lectura | Qué implica |
|---|---|
| **Administrativa** | La participación de `ACT-ADMIN` en `REQ-EVT-024` es la **valla técnica** — comprobar que no haya dependencia activa — igual que en `REQ-EVT-013`. No inicia el cierre | 
| **Deportiva** | `ACT-ADMIN` puede cerrar una jornada, y eso es autoridad deportiva de club, lo que contradice `ADMIN no es superusuario deportivo` |

La lectura administrativa es la coherente con el resto de la matriz. Pero el REQ dice
`Admin · Subcomisión` en la columna de actores sin distinguir quién hace qué, y no hay ninguna
fuente que lo Declare.

## Fuentes

| Fuente | Qué dice | Status |
|---|---|---|
| `PT §5` | Matriz completa: `ADMIN = —` en `crear Match`, `postpone/reschedule/cancel Match`, `Logistics`, `Selection`, `Attendance`, `MatchRecord/stats`, `Announcement oficial` | `AUTHORITATIVE` |
| `PT §75` | `ADMIN is not sports superuser` | `AUTHORITATIVE` |
| Freeze §2.3.1 | *"`ADMIN` no es superusuario deportivo. Administra identidad y estructura; no administra convocatoria, asistencia ni resultado"* | `AUTHORITATIVE` |
| `REQ-EVT-024` | `PRELIMINARY ACTOR: Admin · Subcomisión` | `AUTHORITATIVE` |
| `REQ-EVT-013` | `PRELIMINARY ACTOR: Coach · Subcomisión · Admin` | `AUTHORITATIVE` |
| `REQ-EVT-003` / `REQ-EVT-004` | `Admin` sin autoridad ⇒ denegado | `AUTHORITATIVE` |
| `REQ-INS-004` AC | El acceso de `ADMIN` a los informes **deporte** está denegado explícitamente | `AUTHORITATIVE` |
| `ACTOR-UI-01` | El CURRENT concede a `ACT-ADMIN` `canEditEvent` / `canManageLogistics` / `canTransitionEvent` de club por la fusión `officialOnEvent = clubWide` | `EVIDENCE` (defecto, no autoridad) |

## Opciones

| Opción | Descripción | Consecuencia |
|---|---|---|
| **(a) Sin autoridad deportiva** | `ACT-ADMIN` participa en la valla técnica de `REQ-EVT-024` y `REQ-EVT-013`, pero **no** inicia el cierre de una jornada. Actor primario: `ACT-SUBCOMMITTEE` | Coherente con PT §5 y con Freeze §2.3.1. Default deny. Cero filas nuevas en la matriz |
| **(b) Con fila propia** | `ACT-ADMIN` puede cerrar una jornada con alcance `CLUB`, y PT §5 recibe una fila nueva | **Contradice** `ADMIN no es superusuario deportivo` salvo que PT se revise. Obliga a modificar `GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` §5, es decir, **rompe la cadena de autoridad** de E1 |

## Recomendación

**(a) Sin autoridad deportiva.**

Motivo: default deny, coherencia con las 15 denegaciones explícitas de la matriz de PT §5, y
`REQ-EVT-024` es una **valla de dependencia**, no una operación de negocio. La valla se comprueba;
el cierre se decide. Y la opción (b) exigiría revisar PT §5, que es autoridad de producto
anterior al Requirements Freeze y que E2 no puede modificar.

## Impacto

| Elemento | Con (a) — congelado por E2 | Con (b) |
|---|---|---|
| `ACT-ADMIN` | Mantiene su lista de denegaciones sin excepción | Aparece una excepción deportiva |
| PT §5 | Sin cambio | **Filas nuevas** en la matriz de autoridad |
| `REQ-EVT-024` | Actor primario `ACT-SUBCOMMITTEE`, secundario `ACT-ADMIN` por valla | Ambos son iniciadores |
| `REQ-EVT-013` | Igual: valla técnica | Sin cambio |
| Casos de uso futuros | Cierre de jornada con `ACT-SUBCOMMITTEE` | Cierre de jornada con dos actores |
| `ACTOR-UI-01` | `CURRENT CONTRADICTORY` confirmado como defecto | El CURRENT se acercaría por casualidad, no por diseño |

## Ámbito

- **Dominios:** `EVT`, `STR` (efecto colateral si el restore se decide)
- **Actores afectados:** `ACT-ADMIN`, `ACT-SUBCOMMITTEE`
- **Casos de uso futuros afectados:** cierre y finalización de jornada; vallas de dependencia
- **Requerimientos catalogados que esperarían esta decisión:** `REQ-EVT-024`, `REQ-EVT-013`
- **Bloqueante para E2:** **NO.** E2 congela (a)

---

# NOTAS DE CIERRE

1. **Ambas decisiones son no bloqueantes por construcción.** Ninguna impide cerrar la Etapa 2,
   ninguna contradice una autoridad vigente en su lectura conservadora, y cada una tiene una
   etapa de destino.
2. **Ninguna se resolvió por inferencia.** E2 congela el valor **conservador** de ambas y
   registra el change candidate. Adoptar la recomendación requiere decisión de producto escrita.
3. **E2 no editó `docs/requirements/**`.** Los feedbacks de calidad de requerimiento que
   se deriven de estas decisiones están en
   `docs/actors/GEI_ACTOR_RECONSTRUCTION_AUDIT_V1.md` §17 (`ACTOR-FEEDBACK-02`,
   `ACTOR-FEEDBACK-03`, `ACTOR-FEEDBACK-07`).
4. **Ninguna decisión de E1 se movió aquí.** `REQ-DECISION-NEEDED-01` y
   `REQ-DECISION-NEEDED-02` siguen en su documento de origen.
5. **`ACTOR-DECISION-01` tiene un efecto secundario en el CURRENT.** `ACTOR-UI-09` es
   `CURRENT CONTRADICTORY` bajo (a) y `CURRENT ALIGNED` bajo (b). Se registra para que la
   implementación no "arregle" el defecto sin la decisión tomada.
6. **PT §82 aplica a las dos.** Si alguna se decide, la que cambie comportamiento de V1
   requiere revisar la sección correspondiente de `PT v1.0.1` antes de modificar el catálogo de
   requerimientos.

---

**Fin del Actor Open Decisions V1.**

**SOURCE MODIFIED: NO.** Este lote creó únicamente archivos bajo `docs/actors/`.
