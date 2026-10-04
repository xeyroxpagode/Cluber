# GEI Hockey · Informe de implementación del frontend final (Stage 6)

**Versión** V1 · **Fecha** 2026-10-03
**Rama** `gei/frontend-final-ux-v1`
**Baseline de implementación** `f80fc48` (frontend Stage 4 + auditoría Stage 5)
**Baseline normativo** `docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md`
**Naturaleza del producto** simulador local de producto, sin backend real

Este documento describe **lo realmente implementado** en Stage 6. No describe
intención ni trabajo pendiente. Lo que quedó fuera está escrito como fuera, con
motivo.

---

## 1. Qué cambió de verdad, en una línea

El frontend dejó de ser "la misma interfaz con más color". Cambió el origen de
la verdad (de literales y banderas globales a un modelo derivado con
`coordination_revision` real), cambió el lenguaje visual (de ocho significados
del mismo azul a nueve roles de color y una escala tipográfica de nueve roles) y
cambió la composición de las pantallas (de "tarjeta uniforme para todo" a
"ritmo, peso y tres dominantes por pantalla").

---

## 2. Cifras verificadas

| Métrica | Stage 4 (baseline `8f30cda`) | Stage 6 (este informe) |
|---|---|---|
| Rutas declaradas en el router | 41 entradas | 40 canónicas + redirección de raíz + wildcard |
| Tests | 31 en 4 archivos | **92 en 4 archivos** |
| Tamaños de fuente arbitrarios (`text-[Npx]`) | ~10 distintos | **0** |
| Consumidores de los roles semánticos `.gei-*` | ~25 líneas | **178** |
| Usos de `variant="danger"` | **0** | **12** |
| Diálogos que exigen motivo escrito | 0 | **13** |
| Pantallas con estado en la URL | 0 (`useSearchParams` = 0) | **13** (`useQueryState`) |
| Líneas de `Person` usadas como fuente de UI | `role`, `team`, `eligibility` | **0** |
| Lectores productive de `capabilities.sport` | 1 capa paralela | **0** |
| Historial escrito y nunca mostrado | 2 fuentes | **0** |
| Fechas congeladas en auditoría y avisos | 1 literal global | **0** |
| Capturas runtime honestas | 0 (390 no verificable) | **91** a 1440 / 768 / 390 |
| Desbordes horizontales detectados | no medibles | **0** en 91 capturas |

Distribución del código tras la reconstrucción:

```
src/mock      4.092 líneas   modelo, verdad derivada, autoridad, store
src/features  8.500 líneas   las 38 rutas
src/shared    1.939 líneas   primitivas, patterns, ¿Vas?, estado en URL
src/app         436 líneas   shell y router
src/styles      281 líneas   sistema perceptual
src/__tests__   972 líneas   92 contratos
```

---

## 3. Las siete decisiones de producto, aplicadas

### D1 — Alcance de serie real
`seriesOccurrences(state, origen, alcance)` resuelve el conjunto exacto de
ocurrencias ordenadas por fecha; `applyEventChange` muta **exactamente** ese
conjunto. Test obligatorio cubierto: **toda la serie de 4 cambia 4**, "este y los
siguientes" cambia 3 de 4 y deja intacto el anterior, "sólo este" cambia 1.
Cada ocurrencia afectada sube `coordinationRevision`, registra línea de historial
con fecha real, y la notificación se calcula sobre el conjunto real, no sobre un
número fabricado. Cuando el alcance es `ONLY_THIS` sobre un evento de serie se
registra un `eventOccurrenceOverride`.

### D2 — Membership como superficie
`Membership` dejó de ser un campo decorativo: tiene alta ("Iniciar
pertenencia"), cierre con motivo ("Finalizar pertenencia") y período visible en
el perfil y en la ficha administrativa. `TeamAssignment` es otra cosa: la
pertenencia es el vínculo con el club, el equipo es la afiliación deportiva.
El seed incluye un caso real: `p16` tiene cuenta pendiente y por lo tanto **no**
tiene Membership ni TeamAssignment, y eso se ve en filtros y en el flujo de
asignación.

### D3 — Guardian como relación, no como rol
`GuardianRelationship` expone `canViewChildInfo` y `canRespondAvailability` por
separado. El guardián no tiene `RoleAssignment`, no recibe el accesorio automático
de chat, no ve documento ni fecha de nacimiento ni motivo de habilitación. Su
alcance se resuelve por el menor seleccionado y se propaga a Inicio, Calendario,
Equipos y disponibilidad. Hay un menor con delegación y otro sin delegación en
el seed para que la diferencia sea observable. `?demo=guardian` activa el runtime.

### D4 — CompetitionEntry TEAM / LINE
La entrada de equipo guarda `teamId`; la de línea guarda `divisionId + lineId +
seasonId`. La etiqueta de línea es **"Línea A · Sexta · Temporada 2026"**, nunca
"Línea A". `entryMatchesEvent` produce la causa en lenguaje de usuario cuando la
inscripción no resuelve contra el equipo del partido.

### D5 — Seguridad real en el perfil
Estado de cuenta, credencial, última actividad, sesión actual marcada como tal,
otras sesiones con cierre individual y cierre de sesión propio. No hay timeline
genérico.

### D6 — Perfil incompleto con salida
`profileCompleteness` calcula qué falta. La jugadora ve un banner que dice que no
puede ser asignada y **qué** falta, sin poder editar los campos protegidos. La
acción siguiente es avisar a administración. Administración tiene "Corregir
identidad" en la ficha. El filtro "Perfil incompleto" de Personas usa el mismo
cálculo. En ningún rol el perfil muestra documento ni fecha de nacimiento.

### D7 — Audiencia de comunicado real
`Announcement.audience` es `{kind:"CLUB"}` o `{kind:"TEAMS", teamIds}`. Publicar
captura un `audienceSnapshot` inmutable; corregir título o cuerpo **no** cambia la
audiencia y **exige motivo**; la notificación sale sólo hacia los alcanzados. No
existe acuse "Entendido" genérico.

---

## 4. Sistema perceptual

### Color (nueve roles + seis superficies)
`brand`, `interactive`, `selected`, `attention`, `success`, `warning`, `danger`,
`neutral`, `unread`. El azul fuerte aparece en: la marca, la CTA principal, el
estado seleccionado de tabs y chips, el punto de no-leído y el texto de enlace.
No aparece en iconos, en badges decorativos, en metadatos ni en team chips.

### Tipografía (nueve roles)
`page-context` 12 px · `page-title` 26 px/700 · `page-lead` 15 px ·
`section-title` 17 px/650 · `item-title` 15 px/650 · `body` 14 px ·
`body-strong` 14 px/650 · `meta` 12 px · `micro` 11 px sólo para lo no crítico.
Cero tamaños arbitrarios por pantalla.

### Espaciado con significado
`inline .375rem < row .75rem < group 1rem < concepto 1.75rem < sección 2.75rem <
página 3.5rem`. La distancia agrupa antes que la tarjeta; por eso muchas
secciones viven abiertas sobre la página.

### Superficies
`page`, `open`, `surface`, `raised`, `control`, `overlay`. No hay tarjeta dentro
de tarjeta dentro de tarjeta.

### Peso visual
Clases `.gei-l5` a `.gei-l1` con la regla de tres dominantes por pantalla. En
Inicio el único elemento de peso máximo es el primer ítem de atención; el resto de
las acciones son secundarias, para que no compitan dos azules.

---

## 5. Gramática de interacción

Botones con cuatro variantes y 44 px; fila clickable con hover, foco y chevron;
fila estática que no se confunde con un enlace; tabs con `role="tablist"`,
flechas y `aria-selected`; control segmentado con `aria-pressed`; chip de filtro;
expansor; menú con `role="menu"`, Escape y foco al primer ítem; sheet; modal con
trampa de foco, Escape y bloqueo de scroll.

Formularios con label persistente, marca de obligatorio u opcional, error por
campo, `aria-invalid`, `aria-describedby`, foco al primer error, estado sucio,
confirmación de descarte, envío por Enter, estado de guardado y confirmación
honesta. Las CTAs usan verbo real: "Publicar comunicado", "Crear persona",
"Finalizar resultado", "Cerrar asistencia", "Guardar cambios".

`ConfirmDialog` es el patrón único para acción peligrosa o terminal: explica la
consecuencia en el diálogo y exige motivo cuando la acción no se puede deshacer.
Hay 13 diálogos con motivo obligatorio y 12 usos de la variante `danger`.

---

## 6. Estado de navegación en la URL

`useQueryState` es el único camino para filtros, tabs y vistas:

| Pantalla | Parámetros |
|---|---|
| Calendario | `m`, `team`, `type`, `view`, `event` |
| Comunicación | `tab` |
| Estructura | `tab` |
| Personas | `q`, `team`, `role`, `account`, `profileStatus` |
| Ficha administrativa | `section` |
| Equipo | `tab` |
| Informes | `team`, `period` |
| Historial | `from`, `to`, `actor` |
| Buscar | `q` |

Los destinos canónicos no cambiaron. El botón atrás del navegador devuelve al
mismo mes, filtro, tab y consulta.

---

## 7. Autoridad única

`getAuthority(state, actor, childId)` es la única fuente. Reemplaza a
`getAllowedActions` y a `capabilities.sport`. Cubre rol, alcance, estado del
objeto, autoridad por campo, PII y gating de páginas. `capabilities.*` ya no
existe como gate paralelo: hay **0** lectores.

Reglas derivadas que se verifican en tests:

- El entrenador administra su equipo y no otro.
- La jugadora no administra nada y sí responde su disponibilidad.
- La Subcomisión publica comunicados y gestiona habilitación, pero **no**
  cuentas ni estructura, y no administra personas.
- Administración gestiona personas y estructura, y **no** es superusuario
  deportivo: no administra convocatoria, asistencia ni resultado.
- El documento es sólo de administración; el motivo de habilitación es de
  Subcomisión y administración.

---

## 8. Historia visible donde aporta

Asistencia muestra la corrección con valor anterior, motivo, autor y fecha. El
acta muestra el marcador anterior → actual con motivo. La convocatoria muestra las
revisiones publicadas bajo disclosure. El evento muestra sus líneas de historial
con fecha real. El comunicado muestra sus correcciones. El historial de cambios
muestra antes, después, autor, motivo y enlace al objeto, con filtro por rango de
fecha real.

`Event.history` dejó de ser un `string[]` con etiquetas relativas: es
`HistoryLine[]` con `id`, `at` ISO, `actor` y `text`.

---

## 9. Estados terminales de evento

`POSTPONED`, `CANCELLED`, `COMPLETED` y `ABANDONED` tienen composición propia: no
muestran `¿Vas?` como acción primaria, explican qué pasó y qué queda como
referencia, y ofrecen "Ver historial". Un postergado dice que no hay horario
vigente. Un cancelado dice que la información anterior queda como referencia. Un
jugado muestra el resultado final y explica que las correcciones quedan
registradas. Un suspendido dice que no hay resultado oficial.

`ABANDONED` es alcanzable desde "En curso" mediante "Suspender", que antes era
inalcanzable.

---

## 10. Conflict Workspace

Cuando el escenario de concurrencia se dispara, el evento lanza
`StaleVersionError` con tres instantáneas: **con la que empezaste**, **tus
cambios** y **la versión actual**. El diálogo no destruye el borrador y ofrece
"Mantener mis cambios donde sea seguro", "Actualizar con la versión actual" y
"Revisar diferencias", que en mobile pasa de tres columnas a la comparación por
sección. No hay merge falso: cada campo se declara seguro o en conflicto.

---

## 11. Perfil

Orden de lectura: quién soy → qué puedo hacer → con qué cuenta entro → a quién
miro → quién puede actuar por mí. Secciones: Identidad, Pertenencia (con
período), Roles y alcance (todos los RoleAssignment vigentes con su alcance
resuelto), Cuenta, Contacto editable, Seguridad, Personas a cargo, Acceso de
terceros sobre mí, y el banner de perfil incompleto cuando aplica.

---

## 12. Fuera de alcance, con motivo

No se implementó y no se reabrió: preferencias de notificación, recordatorio de
disponibilidad, silencio, menciones, respuestas anidadas, deshacer genérico,
timeline de actividad personal, menciones en conversación, grupos con archivo,
edición de participantes de conversación, página de ayuda, y la integración de
cuentas ajenas al club. Estas decisiones fueron explícitas y no se reabren.

Sí quedó diferido con motivo legítimo:

- **Zoom 200 %**: no verificado con evidencia runtime; la composición no usa
  tablas fluidas que se rompan, pero no hay captura que lo demuestre.
- **Drag & drop de calendario**: fuera del alcance de Stage 6.
- **Autosave de convocatoria con 600 ms de debounce y estado CONFLICT**: la
  pantalla tiene borrador visible, publicación con versión esperada y
  Conflict Workspace, pero no reproduce los cinco estados de Freeze §45 al nivel
  de tiempos de red.

---

## 13. Verificación

- `pnpm typecheck` → **PASS**
- `pnpm test` → **92 PASS / 92**
- `pnpm build` → **PASS**
- Evidencia runtime: **91 capturas** a 1440, 768 y 390 CSS px reales, con
  emulación de dispositivo por DevTools Protocol, **0 desbordes horizontales**.

Los documentos de estado final están en:

- `docs/GEI_FINAL_UX_STRESS_V1.md` — 48 bloques antes y después.
- `docs/GEI_FINAL_FLOW_STATUS_V1.md` — F01–F30 antes y después.
- `docs/GEI_FINAL_FRONTEND_FREEZE_V1.md` — lo congelado.

No se inició backend. No hubo push.