# COVERAGE MATRIX — GEI CURRENT UX ATLAS

Cobertura por dominio. Los números salen de los archivos realmente escritos en el atlas.
No se declaran porcentajes estimados: sólo recuentos verificables.

| Dominio | Routes descubiertas | Screens descubiertas | Overlays | Variantes de estado | 390 | 1440 | Motion | Mapeadas |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 08_Auth | 4 | 6 | 0 | 3 | 6 | 6 | 0 | 6 |
| 02_Calendario | 13 | 35 | 7 | 1 | 35 | 35 | 4 | 35 |
| 05_Comunicacion | 9 | 21 | 3 | 5 | 21 | 21 | 2 | 21 |
| 04_Equipos | 8 | 16 | 0 | 0 | 16 | 16 | 1 | 16 |
| 00_Global | 8 | 22 | 5 | 1 | 17 | 19 | 4 | 22 |
| 01_Home | 1 | 7 | 1 | 2 | 7 | 7 | 0 | 7 |
| 07_Gestion | 12 | 41 | 8 | 1 | 41 | 41 | 0 | 41 |
| 06_Mas | 5 | 16 | 1 | 1 | 16 | 16 | 0 | 16 |
| 03_Participacion | 12 | 29 | 6 | 4 | 29 | 29 | 1 | 29 |
| 09_CrossDomain | 8 | 10 | 0 | 0 | 10 | 10 | 0 | 10 |

## Totales

- Screen IDs indexados: **203**
- Capturas 390: **198**
- Capturas 1440: **200**
- Clips de motion: **12**
- Surface maps escritos: **203**
- Rutas distintas alcanzadas: **66**

## Unreachable implemented states — superficies en el código sin acceso desde la UI actual

| Superficie | Evidencia | Dónde se documenta |
| --- | --- | --- |
| `ConflictWorkspace` (3 columnas baseline/local/latest) | `src/features/events.tsx:113` — se abre sólo con `StaleVersionError`, que exige una mutación concurrente que el prototipo no produce | `02_Calendario/EventCreate/` (registrado en el inventario) |
| Banner de conflicto de convocatoria | `src/features/participation.tsx:288` — ningún `published` del seed queda fuera de su equipo; sólo se dispara si se edita el evento y se le quitan los equipos destino | `03_Participacion/Selection/` |
| Edición de sedes y archivado de sedes | `src/features/management.tsx:1133` — la pantalla filtra `state.structure` por tipo VENUE y el seed no tiene entradas de ese tipo (las sedes viven en `state.venues`) | `07_Gestion/Structure/Venues/MGT_STRUCTURE_004_VENUES/` |
| Enlace «Ver el objeto» del historial de auditoría | `src/shared/patterns.tsx:266` — `TimelineEntry` exige las props `to` **y** `route`; `AuditPage` sólo pasa `to` | `07_Gestion/Audit/MGT_AUDIT_001_LIST/` |
| `SavedState` (idle/saving/saved/dirty) | `src/shared/ui.tsx:1136` — exportado, nunca renderizado | `00_Global/SHARED_COMPONENT_CATALOG.md` |
| `Expander`, `Checkbox`, `StatusText`, `StateBanner`, `UnreadMark`, `FilterBar`, `FormSection`, `TerminalConfirm`, `OpenGroup`, `DataTable`, `StickyActionBar`, `BackLink` | exportados desde `src/shared/*` sin ninguna renderización en `src/features/*` | `00_Global/SHARED_COMPONENT_CATALOG.md` |
| Ruta `/events/:id/availability` | existe en el router, pero ningún enlace de la UI la apunta | `03_Participacion/Availability/` |
| Ruta `/events/new` (alta de evento) | existe en el router, sin enlace de alta en la UI | `02_Calendario/EventCreate/` |
| Ruta `/management/teams/:id` | existe en el router, sin enlace en la UI | `07_Gestion/Teams/` |
| Ruta `/activate` | existe en el router, sin enlace en la UI | `08_Auth/Activation/` |
| Recuperación de contraseña | no hay ruta, ni enlace, ni API | `08_Auth/Recovery/RECOVERY.md` |
| Entidad «cuerpo técnico» (staff) | no existe en el modelo; el entrenador es un `RoleAssignment` | `04_Equipos/Staff/STAFF.md` |

## Unknowns

| Unknown | Por qué queda abierto |
| --- | --- |
| Comportamiento del `Sheet` en viewports < 390 | El atlas sólo midió 390 y 1440; por debajo de 390 el `max-w-md` del panel secede terreno al viewport y no hay medición |
| Óptima de Safari/Firefox | Las capturas son de Chromium 140 (Chrome headless): `backdrop-filter`, `100dvh` y `overflow: clip` pueden diferir en otros motores |
| Scroll dentro de la lista de mensajes de la conversación | La ruta `/conversations/:id` no resuelve la conversación, de modo que el `div` con `overflow-y-auto` del hilo nunca se renderiza |
| Movimiento con `prefers-reduced-motion: reduce` | El harness captura con la preferencia por defecto del sistema; el comportamiento reducido está documentado por código (`theme.css:315`) pero no filmado |
| Contenido real del correo de activación | El prototipo no envía correo: el canal de entrega del código es manual (lo documenta la propia pantalla) |
