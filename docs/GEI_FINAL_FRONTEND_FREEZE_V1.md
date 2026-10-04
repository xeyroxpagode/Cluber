# GEI Hockey · Freeze del frontend (V1)

**Versión** V1 · **Fecha** 2026-10-03 · **Rama** `gei/frontend-final-ux-v1`
**SHA de cierre** ver `git log -1` de esta rama
**Baseline** `f80fc48` · **Normativo** `docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md`

Este documento congela **lo que el frontend de GEI Hockey es hoy**. Describe lo
implementado, no lo previsto. Si algo no está acá, no existe en el frontend
congelado.

---

## 1. Qué es este producto

Un **simulador local de producto**. No hay servidor, ni base de datos, ni API real,
ni sesiones reales, ni despliegue. Todo el estado vive en memoria del navegador y
se reinicia al recargar. El simulador existe para poder evaluar decisiones de
producto con usuarios reales antes de construir el backend.

La arquitectura queda preparada conceptualmente para el backend: la autoridad se
resuelve en un solo lugar, los comandos se nombran como comandos, los estados de
negocio son explícitos y no hay缓存 de dominio autenticado en el cliente.

---

## 2. Arquitectura de información congelada

Cinco destinos, idénticos en barra lateral (desktop) y barra inferior (mobile):

`Inicio` · `Calendario` · `Equipos` · `Comunicación` · `Más`

En `Más`: Mi perfil, Informes, Historial de cambios, Personas, Estructura del
club, Competencias y las jornadas del usuario. Nada de lo que se usa a diario
vive en `Más`; nada de la administración vive en los destinos diarios.

El cross-highlight funciona: Calendario en `/events/*` y `/jornadas/*`,
Comunicación en `/conversations/*` y `/announcements/*`, Más en `/management/*`,
`/reports/*`, `/audit` y `/more/*`.

### Registro de rutas

| Ruta | Destino | Visible para |
|---|---|---|
| `/login` | Acceso | todos |
| `/activate` | Activar cuenta | todos |
| `/no-access` | Sin acceso | todos |
| `/home` | Inicio | todos |
| `/calendar` | Calendario | todos |
| `/teams` | Equipos | con equipo o menor a cargo |
| `/teams/:teamId` | Detalle de equipo | con ese equipo en alcance |
| `/people/:personId` | Persona | con la persona en alcance |
| `/events/new` | Nuevo evento | entrenador o Subcomisión |
| `/events/:eventId` | Evento | con el evento en alcance |
| `/events/:eventId/edit` | Editar evento | entrenador del equipo o Subcomisión |
| `/events/:eventId/availability` | Disponibilidad | con el evento en alcance |
| `/events/:eventId/selection` | Convocatoria | entrenador del equipo |
| `/events/:eventId/attendance` | Asistencia | entrenador del equipo |
| `/events/:eventId/match-record` | Resultado | entrenador del equipo |
| `/jornadas/new` | Nueva jornada | entrenador o Subcomisión |
| `/jornadas/:jornadaId` | Jornada | con algún partido en alcance |
| `/communication` | Comunicación | con chat o menor a cargo |
| `/communication/conversations/new` | Nuevo mensaje | con chat |
| `/communication/announcements/new` | Nuevo comunicado | Subcomisión |
| `/announcements/:id` | Comunicado | alcanzados por la audiencia |
| `/announcements/:id/edit` | Corregir comunicado | Subcomisión |
| `/conversations/:id` | Conversación | participante |
| `/conversations/new` | Nuevo mensaje | con chat |
| `/notifications` | Avisos | todos |
| `/search` | Buscar | todos |
| `/more` | Más | todos |
| `/more/profile` | Mi perfil | todos |
| `/management` | Administración | administración o Subcomisión |
| `/management/structure` | Estructura | administración |
| `/management/people` | Personas | administración o Subcomisión |
| `/management/people/new` | Nueva persona | administración |
| `/management/people/:id` | Ficha administrativa | administración; Subcomisión sólo habilitación |
| `/management/teams/:id` | Equipo | administración |
| `/management/competitions` | Competencias | administración o Subcomisión |
| `/management/competitions/:id` | Competencia | administración o Subcomisión |
| `/reports` | Informes | jugadora, capitana, entrenador, Subcomisión |
| `/reports/attendance` | Informe de asistencia | ídem |
| `/reports/performance` | Informe de rendimiento | ídem |
| `/audit` | Historial de cambios | administración |

Cualquier ruta fuera de este registro muestra una pantalla de "página no
encontrada". Un usuario sin autoridad **no entra** a la página completa para
recibir un vacío: el gating ocurre antes de renderizar.

---

## 3. Jerarquía visual congelada

Cinco niveles, con la regla de que **ninguna pantalla normal muestra más de tres
elementos simultáneos de nivel 4 o 5**.

| Nivel | Qué es | Cómo se ve |
|---|---|---|
| L5 DOMINANTE | situación actual y acción principal | 20–26 px, peso 700, o la única CTA saturada de la pantalla |
| L4 FUERTE | identidad de sección, atención requerida, estado seleccionado | 17 px, peso 650 |
| L3 NORMAL | contenido operacional | 14–15 px, peso 500–650 |
| L2 SECUNDARIO | contexto y metadatos | 12 px, tinta atenuada |
| L1 TENUE | separadores y terciario | 11 px, sólo sin información crítica |

La lectura esperada en menos de cinco segundos: **qué es** (título de página),
**qué pasa** (L5 o banner de atención), **qué hago** (la única CTA).

---

## 4. Semántica de color congelada

| Rol | Uso | Prohibido |
|---|---|---|
| `brand` | marca GEI | como acción o selección |
| `interactive` | CTA principal y enlace | en iconos, badges, metadatos, chips decorativos |
| `selected` | tab activa, chip de filtro, banner informativo | como marca |
| `attention` | necesita acción humana | para decorar |
| `success` | operación resuelta | como color de marca |
| `warning` | situación que merece revisión | como error |
| `danger` | error o acción destructiva | mezclado con la CTA normal sin separación |
| `neutral` | información sin juicio | para jerarquizar |
| `unread` | punto y contador de no leído | como relleno de fila |

Todo estado se escribe **en texto**. El color acompaña, nunca sustituye. Con
`forced-colors` los badges conservan borde.

Superficies: `page`, `open`, `surface`, `raised`, `control`, `overlay`. Seis, y
ninguna más.

---

## 5. Tipografía congelada

Nueve roles. Ningún tamaño arbitrario por pantalla.

| Rol | Tamaño | Peso |
|---|---|---|
| page-context | 12 px | 600, mayúsculas, tracking abierto |
| page-title | 26 px | 700 |
| page-lead | 15 px | 400 |
| section-title | 17 px | 650 |
| item-title | 15 px | 650 |
| body | 14 px | 400 |
| body-strong | 14 px | 650 |
| meta | 12 px | 400 |
| micro | 11 px | 400, sólo sin información crítica |

Fuente: Inter. El azul de marca y el voseo se conservan.

---

## 6. Espaciado y ritmo congelados

`inline .375rem` < `row .75rem` < `group 1rem` < `concept 1.75rem` <
`sección 2.75rem` < `página 3.5rem`.

Regla de composición: **antes de agregar una tarjeta, un borde o un divisor,
preguntar si el espaciado ya resuelve la agrupación.** La mayoría de las secciones
viven abiertas sobre la página.

---

## 7. Componentes congelados

Primitivas en `shared/ui.tsx`: `Button` (primary, secondary, danger, quiet),
`IconButton`, `RowLink`, `RowStatic`, `StateBadge`, `Tag`, `UnreadMark`,
`TabBar`, `SegmentedControl`, `FilterChip`, `Expander`, `Menu`, `Field`,
`TextField`, `TextArea`, `Select`, `Checkbox`, `RadioGroup`, `Surface`,
`OpenGroup`, `Banner`, `Empty`, `Modal`, `Sheet`, `ConfirmDialog`, `SavedState`,
`Toast`, `Avatar`, `MetaRow`, `TextLink`, `BackLink`, `StickyActionBar`,
`DataTable`, `KeyValue`.

Patterns en `shared/patterns.tsx`: `PageContextHeader`, `SectionHeader`,
`DetailSection`, `FormSection`, `StateBanner`, `ImpactPreview`, `TimelineEntry`,
`HistoryList`, `FilterBar`, `ScopeDialog`, `TerminalConfirm`, `StatusText`.

Composición en `shared/vas.tsx`: `VasControl` y `VasCompact`, la única gramática
de `¿Vas?` del producto.

Todos tienen consumidores reales. No hay abstracción muerta.

---

## 8. Gramática de interacción congelada

- **BUTTON**: 44 px. La variante primaria es única por pantalla. La variante
  `danger` es una acción de riesgo y va separada de la normal.
- **ROW**: la fila con chevron es un enlace con hover, foco y estado presionado;
  la fila sin chevron es estática. Ningún texto estático usa el azul de acción.
- **LINK**: azul de acción, subrayado al pasar, 36 px de alto porque es texto en
  línea y no un gesto de roster.
- **TAB**: `role="tablist"` con `aria-selected`, navegación por flechas y foco
  gestionado.
- **TOGGLE**: `aria-pressed` y estado visible con fondo, no sólo con color.
- **SELECT**: control de 44 px con label persistente y error asociado.
- **CHIP**: filtro interactivo con `aria-pressed`; el chip estático es `Tag` y no
  parece pulsable.
- **MENU**: `role="menu"`, Escape para cerrar, clic afuera para cerrar, foco al
  primer ítem, separación entre acción secundaria y destructiva.
- **EXPANDER**: `details` nativo, resumen de 44 px.
- **DIALOG**: trampa de foco, Escape, bloqueo de scroll, foco inicial en el primer
  control útil y no en "Cerrar".

Objetivo táctil mínimo: **44 px** en todo gesto de roster. Checkbox de 20 px.

---

## 9. Formularios congelados

Todo formulario tiene: label persistente, marca de obligatorio u opcional, error
por campo, `aria-invalid`, `aria-describedby`, foco al primer error, input
preservado ante error, estado sucio visible, confirmación al descartar, envío por
Enter cuando corresponde, estado de guardado y confirmación honesta del éxito.

Las CTAs usan verbo real: "Guardar cambios", "Crear persona", "Publicar
convocatoria", "Publicar comunicado", "Finalizar resultado", "Cerrar asistencia",
"Guardar jornada". Nada de "Confirmar cambio" para todo.

La acción peligrosa o terminal pasa por `ConfirmDialog`, que **siempre** explica
la consecuencia y **exige motivo escrito** cuando la acción no se puede deshacer.

---

## 10. Movimiento congelado

Por defecto, ninguno. Sólo se mueve lo que explica causalidad: guardado,
publicación, cierre, finalización, actualización de fila, apertura de diálogo y
lectura de un aviso. Duración de 120 a 180 ms. Nunca más de 200 ms. Sin rebote,
sin escala compulsiva, sin aparecer de tarjetas. `prefers-reduced-motion` apaga
todo.

---

## 11. Responsive congelado

Un solo corte: **desktop ≥ 1024 px**, mobile por debajo. En desktop, barra lateral
de 224 px con los mismos cinco destinos y columnas con panel lateral. En mobile,
barra inferior con los mismos cinco destinos, agenda antes que mes, formularios
de una columna con acción fija, diálogos a pantalla completa y compositor siempre
visible.

Verificado con evidencia runtime a **390, 768 y 1440 px CSS reales** mediante
emulación de dispositivo: **0 desbordes horizontales en 91 capturas**.

El pie de navegación no existe: en mobile la barra inferior cumple esa función y
el contenido no queda oculto detrás de ella.

---

## 12. Comportamiento por rol congelado

### Jugadora
Su identidad, su pertenencia, sus roles, su contacto y su seguridad. Ve sus
eventos, responde `¿Vas?`, ve si está convocada, ve su asistencia pasada. No
administra nada. Si le faltan datos administrados por el club, ve un banner que
dice cuáles y no puede editarlos.

### Capitana
Lo mismo que jugadora, más el alcance de Capitalism en la disponibilidad de su
equipo. No hereda poder de entrenador.

### Entrenador
Administra los eventos de sus equipos: edición con alcance de serie, convocatoria,
asistencia y resultado. Ve los datos de contacto de las jugadoras de su equipo
actual por necesidad operativa. **No** accede a documento ni fecha de nacimiento.
**No** ve conversaciones privadas ajenas a su participante.

### Subcomisión
Administra la habilitación para jugar con motivo, origen y vigencia. Publica
comunicados oficiales y gestiona competencias e inscripciones. Ve la ficha de
persona **sólo** en su sección de habilitación. No gestiona cuentas ni estructura.
No es entrenador: no administra convocatoria, asistencia ni resultado.

### Administración
Altas de personas, cuentas, pertenencias, roles, representación, estructura del
club y lectura del historial de cambios. **No** es superusuario deportivo: no
administra convocatoria, asistencia ni resultado de ningún equipo. Ve documento
y fecha de nacimiento porque son datos que administra.

### Guardián
No es un rol. Entra al producto con una relación de representación y ve lo que la
delegación permite: Personas a cargo, eventos del menor, equipos y disponibilidad.
Puede responder `¿Vas?` del menor si la delegación lo dice. No recibe documento,
fecha de nacimiento, motivo de habilitación, conversaciones privadas ni
administración. Con más de un menor, un selector que cambia Inicio, Calendario,
Equipos y disponibilidad.

---

## 13. Perfil congelado

Secciones, en este orden: **Identidad** · **Pertenencia** (con vigencia) ·
**Roles y alcance** (todos los RoleAssignment vigentes con su alcance resuelto,
por ejemplo "Entrenador · Sexta A" y "Capitana · Primera A") · **Personas a
cargo** (si es guardián) · **Acceso de terceros sobre mí** (si es menor con
relaciones activas, sólo lectura) · **Contacto** (editable) · **Seguridad**
(estado de cuenta, credencial, última actividad, sesión actual, otras sesiones
con cierre individual, cambio de contraseña y cierre de sesión) ·
**Perfil incompleto** (banner con qué falta y el siguiente paso).

El perfil **nunca** muestra documento ni fecha de nacimiento, en ningún rol. No hay
timeline genérico. No hay jerga interna.

---

## 14. Estados congelados

### Eventos
`DRAFT` → `SCHEDULED` → `POSTPONED` | `IN_PROGRESS` → `COMPLETED` | `ABANDONED`,
con `CANCELLED` desde `SCHEDULED` o `POSTPONED`, y `RESTORE` de vuelta a
`SCHEDULED`.

Terminales: `CANCELLED`, `COMPLETED`, `ABANDONED`. Se muestran con composición
propia, con explicación de la consecuencia y con historial a la vista, **sin**
`¿Vas?` como acción primaria.

### Disponibilidad
`YES` / `MAYBE` / `NO` persistidas; `NO_RESPONSE` y `NEEDS_RECONFIRMATION`
derivadas de la `coordinationRevision` real de cada respuesta.

### Asistencia
`PRESENT` / `ABSENT` / `JUSTIFIED`. **Sin registro es un estado distinto de
ausente**, y la planilla se puede cerrar dejando filas sin registrar.

### Convocatoria
Borrador en edición, revisiones publicadas inmutables. Publicar no se bloquea por
un conflicto: avisa, explica el motivo en lenguaje humano y deja registrar la
revisión.

### Resultado
`DRAFT` → `FINAL`. Corregir después de finalizar es un flujo distinto que exige
motivo y queda visible en el historial con el marcador anterior.

### Comunicado
`DRAFT` → `PUBLISHED` → `ARCHIVED`. La audiencia publicada es inmutable; corregir
título o cuerpo exige motivo y no toca la audiencia.

### Cuenta
`PENDING` → `ACTIVE` → `DISABLED`. Deshabilitar cierra las sesiones. No se puede
dejar sin acceso a la única administración activa del club.

---

## 15. Autoridad congelada

Una sola fuente: `getAuthority(state, actor, childId)`. Fórmula: **rol + acción +
alcance + estado del objeto + autoridad por campo + PII + origen**.

Prohibido y ausente: `person.role`, `person.team`, `person.eligibility` como
fuente de UI; `capabilities.sport` como gate; `getAllowedActions` en paralelo;
`role === "ADMIN"` reimplementado por pantalla. Los lectores legados no existen:
rol, pertenencia, equipos y elegibilidad se derivan de `RoleAssignment`,
`Membership`, `TeamAssignment` y `EligibilityConstraint`.

---

## 16. Verdad congelada

Ninguna afirmación visible en pantalla puede no estar respaldada por el modelo.
Concretamente: los conteos salen de contar, las fechas salen del reloj o del
modelo, los nombres de equipo se derivan de división y línea, los estados salen
del enum con texto, las audiencias salen del snapshot, y no hay fechas congeladas
ni literales de conteo en el código de presentación. El historial usa fechas ISO
reales, nunca etiquetas relativas escritas a mano.

---

## 17. Alcance diferido, declarado

No implementado y no será implementado en V1: preferencias de notificación,
recordatorio de disponibilidad, silenciar, menciones, respuestas anidadas, deshacer
genérico, mi actividad personal, exportación de informes, motor de estadísticas,
integración con federaciones, archivos adjuntos de acta, motorized de jornadas,
participantes de grupo, y el self-service de contraseña olvidada.

Pendiente de evidencia y declarado: zoom 200 %, axe y lector de pantalla, y los
tiempos de red del autosave de convocatoria. No se declaran PASS.

---

## 18. Cómo se verifica este freeze

```
pnpm typecheck   # PASS
pnpm test        # 92 PASS
pnpm build       # PASS
node scripts/probe.mjs /home 390 guardian
node scripts/screenshot.mjs evidence
```

`scripts/screenshot.mjs` mide `scrollWidth` real en cada pantalla y marca
`OVERFLOW` cuando hay desborde horizontal. Es la evidencia de que el responsive se
verificó de verdad y no por inspección estática.

---

## 19. Regla de cambio

Este freeze se modifica sólo con:

1. una decisión de producto escrita;
2. el cambio de código correspondiente;
3. los tests que lo sostienen;
4. evidencia runtime cuando el cambio afecta composición, jerarquía o
   interacción.

No se reabre por preferencia estética.