# NOTIFICATIONS — GEI COMMUNICATION

## Las superficies de avisos viven en `00_Global/Notifications/`

La lista de avisos del club es un componente **global** del Shell (el icono de
campana del TopBar es su único punto de entrada), por eso sus capturas están en
el dominio `00_Global`:

| Screen ID | Carpetilla | Contenido |
| --- | --- | --- |
| `GBL_NOTIF_001_LIST_COACH_ALL_READ` | `00_Global/Notifications/` | Lista con 2 avisos ya leídos, sin acción global |
| `GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD` | `00_Global/Notifications/` | Lista con 1 aviso sin leer: fondo `bg-selected-soft/40`, marca «Sin leer» y acciones «Marcar leído» / «Abrir» |
| `GBL_NOTIF_003_ALL_MARKED_READ` | `00_Global/Notifications/` | Estado tras «Marcar todo como leído» |
| `GBL_NOTIF_004_EMPTY_STATE` | `00_Global/Notifications/` | Actor sin avisos recibidos |

## Lo que la lista de avisos **no** tiene

- No hay bandeja de notificaciones dentro de «Comunicación»: el canal de
  comunicación tiene dos pestañas (Conversaciones / Comunicados) y los avisos
  son un destino aparte.
- No hay filtros, búsqueda ni paginación en la lista.
- No hay estado vacío con acción: es un `Empty` sin `action`.
- No hay bandeja «archivados» ni «resueltos».

## Relación con los otros canales

| Canal | Dónde vive | Quién lo ve |
| --- | --- | --- |
| Avisos (notificaciones del club) | `/notifications` | todos los actores con avisos recibidos |
| Comunicados (publicaciones del club) | `/communication?tab=comunicados` → `/announcements/:id` | según la audiencia registrada |
| Conversaciones | `/communication` → `/conversations/:id` | actores con `canChat` |

El trayecto desde un aviso hasta su objeto está documentado en
`09_CrossDomain/NavigationOrigins/XD_NOTIF_001_TO_EVENT/`.
