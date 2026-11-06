# Surface GBL_NAV_004_SIDEBAR_BADGES_COACH

Domain: Global
Subdomain: Navigation

Route: /home

Actor(s): COACH

VIEWPORT STATUS:

390×844:
N/A — CURRENT does not render this surface at this viewport

reason:
Los contadores de no-leídos se renderizan exclusivamente dentro de la barra lateral (`hidden ... lg:flex`, src/app/Shell.tsx:183-185); el bloque de badges pertenece a ese nav (src/app/Shell.tsx:204-215) y no al BottomNav (src/app/Shell.tsx:234-250).

current behavior:
Runtime verificado a 390×844: sidebar display=none; el BottomNav visible no contiene ningún elemento .bg-unread ni contador (unreadDot=false en los 5 destinos). El único aviso de no-leído disponible en mobile es el punto sobre la campana del topbar (src/app/Shell.tsx:153-168), que es un elemento distinto del contador de navegación.

alternate surface/route if applicable:
Campana de avisos del topbar en /home (src/app/Shell.tsx:153-168) para el aviso no-leído; no existe equivalente mobile para el contador de mensajes sin leer. La variante desktop de esta misma superficie es GBL_NAV_004 a 1440×900.

1440×900:
CAPTURED — `GBL_NAV_004_SIDEBAR_BADGES_COACH__COACH__1440x900.png`


Current state: AUTHENTICATED · 2 mensajes sin leer · 1 aviso sin leer

Journey(s): Home → Event → Availability → response

Entry path: /home

Visible sections: See surface-map-legacy.md or source component.

Primary action: Navigation to route destination.

Secondary actions: Context-dependent per role and state.

Overlay: no

Lifecycle state: AUTHENTICATED · 2 mensajes sin leer · 1 aviso sin leer

Authority condition: Actor-dependent access per authority.ts rules.

PII condition: PII fields (DNI, birth, contact) restricted by canViewDni/canViewBirth/canViewContact.

Scroll position: top

Evidence type: SEEDED_RUNTIME

Notes: Reorganized from GEI_CURRENT_UX_ATLAS. Source: 00_Global. Original surface map: surface-map-legacy.md.
