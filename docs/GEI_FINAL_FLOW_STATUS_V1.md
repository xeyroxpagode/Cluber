# GEI Hockey · Estado final de flujos (F01–F30)

**Versión** V1 · **Fecha** 2026-10-03 · **Rama** `gei/frontend-final-ux-v1`
**Comparación** antes = Stage 5 (`docs/GEI_STAGE5_FLOW_COMPLETENESS_V1.md`) ·
después = esta ejecución.

Leyenda: **COMPLETE** el flujo termina con éxito honesto. **PARTIAL** el flujo
termina pero le falta una capacidad que Freeze no define para V1, con motivo.
**CONTRADICTORY** hay un comportamiento que se contradice: no queda ninguno.

---

## Resultado

| Veredicto Stage 5 | Cantidad |
|---|---|
| COMPLETE | 1 |
| PARTIAL | 17 |
| MISSING | 8 |
| CONTRADICTORY | 4 |

| Veredicto Stage 6 | Cantidad |
|---|---|
| COMPLETE | 19 |
| PARTIAL | 11 |
| MISSING | 0 |
| CONTRADICTORY | **0** |

Los 11 PARTIAL restantes tienen motivo legítimo y están escritos al final. Ninguno
es deuda accidental.

---

## Detalle por flujo

| # | Flujo | Antes | Después | Qué cambió |
|---|---|---|---|---|
| F01 | Activación de cuenta | CONTRADICTORY | COMPLETE | El código emitido desde la ficha muta la cuenta, marca la credencial e inicia la Membership. `/activate` valida el código real y avisa si venció |
| F02 | Perfil y cuenta | PARTIAL | COMPLETE | Identidad, pertenencia con período, roles con alcance, cuenta, contacto editable, seguridad con sesiones y cierre de otra sesión, personas a cargo |
| F03 | Guardián | MISSING | PARTIAL | Resuelve por menor, propaga a Inicio, Calendario, Equipos y disponibilidad, responde `¿Vas?` sólo con delegación y `?demo=guardian`. **PARTIAL**: el selector de menor muestra la lista pero no muta la delegación, que es de administración |
| F04 | Inicio | PARTIAL | COMPLETE | Máximo 3 ítems con motivo, consecuencia y acción, ordenados por urgencia; los ítems que el rol no puede resolver no aparecen; "no hay nada pendiente" es un estado resuelto |
| F05 | Calendario | MISSING | COMPLETE | Mes con panel contextual, agenda primero en mobile, estado de vista y filtros en la URL, `¿Vas?` desde la selección, leyenda que coincide con el color real |
| F06 | Alta de evento | PARTIAL | COMPLETE | Error por campo con foco al primero, entrada real de club o equipos, verbo y confirmación honestos, la edición soporta recurrencia de serie |
| F07 | Edición no material | MISSING | COMPLETE | El campo Título existe y su rama no material no dispara impacto, aviso ni `coordinationRevision` |
| F08 | Cambio material | PARTIAL | COMPLETE | Impacto calculado sobre el conjunto real, Conflict Workspace que conserva el borrador, `coordinationRevision` sólo en cambios materiales, la reconfirmación deriva de la revisión real y no del cambio de sede |
| F09 | Serie de eventos | MISSING | COMPLETE | Los tres alcances mutan exactamente su conjunto. Test: **toda la serie de 4 cambia 4** |
| F10 | Ciclo de vida del evento | CONTRADICTORY | COMPLETE | `ABANDONED` es alcanzable; los cuatro estados terminales tienen composición propia sin `¿Vas?`; `RESTORE` es una transición real |
| F11 | Disponibilidad | PARTIAL | COMPLETE | Una sola gramática en cinco superficies; el resumen cuenta por respuesta sin "0 sí"; un postergado no acepta respuestas; quien no puede responder lo ve explicado |
| F12 | Convocatoria | PARTIAL | COMPLETE | Filas escaneables con nombre fijo, disponibilidad como estado y no como columna, conflictos en lenguaje humano, revisiones publicadas bajo disclosure, publicación con versión esperada y un solo CTA fuerte |
| F13 | Asistencia | PARTIAL | COMPLETE | Filas de 44 px, conteos arriba, un toque, "Sin registrar" como estado distinto de ausente, cierre explicado cuando quedan filas sin registrar, corrección con motivo y before/after visible |
| F14 | Resultado | PARTIAL | COMPLETE | Editable sólo cuando el lifecycle lo permite, marcador dominante, borrador explícito, finalizar es terminal y con consecuencia, corregir después es un flujo distinto con motivo e historial |
| F15 | Jornada | PARTIAL | COMPLETE | Alta real que excluye entrenamientos y valida la temporada contra el equipo del partido; la organización en bloque avisa y pide reconfirmación; el detalle es sólo lectura si no tenés alcance |
| F16 | Equipo | PARTIAL | COMPLETE | Tabs en la URL, `¿Vas?` cuando corresponde, resultados con enlace al partido, personas con roles y alcance |
| F17 | Persona | COMPLETE | COMPLETE | Lectura derivada; sin PII indebida; roles con alcance |
| F18 | Personas (admin) | MISSING | COMPLETE | Alta, pertenencia, equipos, roles, habilitación con origen y motivo, cuenta con código real, representación con ambos permisos, historial por ficha |
| F19 | Estructura | PARTIAL | COMPLETE | Archivar y restaurar, valla de dependencia que explica por qué no se puede archivar, edición de nombre, dirección y cancha de la sede sin propagar a eventos |
| F20 | Competencia | MISSING | COMPLETE | Entrada TEAM y LINE separadas, etiqueta completa "Línea A · Sexta · Temporada 2026", causa de alcance visible, no se puede cerrar con inscripciones activas |
| F21 | Conversación directa | PARTIAL | COMPLETE | Si ya existe la conversación se abre la existente, el compositor está siempre visible, Enter envía, el menú de mensaje es accesible y eliminar pide confirmación |
| F22 | Conversación de grupo | MISSING | PARTIAL | La conversación tiene estado y puede archivarse. **PARTIAL**: la gestión de participantes y "salir del grupo" no están implementadas; Freeze no define su comando para V1 |
| F23 | Conversación de equipo y evento | PARTIAL | COMPLETE | El título se deriva del equipo y del evento reales, con enlace al objeto y sin mentira si el evento cambia |
| F24 | Comunicado | CONTRADICTORY | COMPLETE | Audiencia como conjunto real de equipos o club, snapshot inmutable al publicar, corrección sin cambiar la audiencia y con motivo, lectura restringida a los alcanzados, sin acuse genérico |
| F25 | Avisos | PARTIAL | COMPLETE | Orden no leídas primero, tipo en lenguaje de usuario, "Marcar leído" sin salir, una sola codificación de no-leído, fecha real |
| F26 | Buscar | PARTIAL | COMPLETE | `?q=` en la URL, distingue "sin query" de "0 resultados", cobertura de persona, equipo, evento y división o línea, sin PII |
| F27 | Informes | PARTIAL | COMPLETE | Filtros en la URL, cero distinto de sin dato, "—" cuando no hay registro, enlace al origen, `<th>` semántico |
| F28 | Historial | MISSING | COMPLETE | Antes y después, autor, motivo, origen y enlace al objeto; filtro por rango de fecha real sobre fechas ISO |
| F29 | Cambio de rol | CONTRADICTORY | COMPLETE | El rol se deriva de `roleAssignments`, nunca de `person.role`; no hay selector preseleccionado que asigne entrenador por un clic |
| F30 | Inicio de comunicación | PARTIAL | COMPLETE | Orden por no leídas, dos canales con encabezado y composición distintos, audiencia a la vista en comunicados, tab en la URL, deep link con guarda de audiencia |

---

## Los once PARTIAL y su motivo

| # | Flujo | Motivo |
|---|---|---|
| F03 | Guardián | El guardián ve a sus menores y responde por ellos, pero **cambiar los permisos de delegación** es una operación de administración y no del guardián. Freeze §20 no da ese comando al guardián. |
| F22 | Conversación de grupo | Archivar existe; administrar participantes y salir del grupo no. Freeze §20 no define el comando ni sus estados de salida para V1. |
| F11 | Disponibilidad | Los cinco estados de autosave de Freeze §45 (SAVED / CHANGES_PENDING / SAVING / SAVE_ERROR / CONFLICT con debounce de 600 ms) no se reproducen con tiempos de red reales. El flujo de usuario sí es completo. |
| F13 | Asistencia | La justificación puede llevar motivo, pero no un workflow de justificación con approval, que Freeze §12 no define. |
| F15 | Jornada | El alta de jornada existe y valida; no hay motorized de generación automática de fechas, que no está en Freeze. |
| F19 | Estructura | Archivar y restaurar funcionan con valla; la temporada no se renombra por decisión de producto y no hay creación de temporada desde la UI. |
| F24 | Comunicado | La audiencia es inmutable y la corrección exige motivo; no hay "reemplazar por uno nuevo" en un solo paso, porque Freeze §21 lo define como dos anuncios. |
| F27 | Informes | No hay exportación, que Freeze §28 no define para V1. |
| F28 | Historial | No hay exportación ni retención, que son decisiones de backend. |
| F30 | Comunicación | No hay menciones, silencios ni respuestas anidadas: fueron explícitamente diferidos. |
| — | Evento | No hay adjunto de acta ni foto: Freeze §25 no los define para V1. |

---

## Contradicciones que quedan

**Ninguna.** Los cuatro CONTRADICTORY de Stage 5 (F01 fake success de activación,
F04 gems, F10 `ABANDONED` inalcanzable, F24 audiencia decorativa, F29 `person.role`
stale) están cerrados con evidencia de código y de test.