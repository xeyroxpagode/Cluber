# Surface GBL_NAV_005_SIDEBAR_BADGES_ADMIN

Domain: Global
Subdomain: Navigation

Route: /home

Actor(s): ADMIN

VIEWPORT STATUS:

390×844:
N/A — CURRENT does not render this surface at this viewport

reason:
La superficie documenta la barra lateral de destinos; a 390 px esa columna no se renderiza (`hidden ... lg:flex`, src/app/Shell.tsx:183-185).

current behavior:
Runtime verificado a 390×844: sidebar display=none. El BottomNav para ADMIN presenta los mismos 4 destinos que la sidebar (Inicio, Calendario, Equipos, Más) y omite Comunicación, porque el filtrado depende del actor vía authority.canOpen (src/app/Shell.tsx:62) y no del viewport.

alternate surface/route if applicable:
BottomNav de /home con actor ADMIN en 390×844 — misma ruta, mismo actor, mismo conjunto de destinos.

1440×900:
CAPTURED — `GBL_NAV_005_SIDEBAR_BADGES_ADMIN__ADMIN__1440x900.png`


Current state: AUTHENTICATED · sin conversaciones habilitadas

Journey(s): Home → Event → Availability → response

Entry path: /home

Visible sections: See surface-map-legacy.md or source component.

Primary action: Navigation to route destination.

Secondary actions: Context-dependent per role and state.

Overlay: no

Lifecycle state: AUTHENTICATED · sin conversaciones habilitadas

Authority condition: Actor-dependent access per authority.ts rules.

PII condition: PII fields (DNI, birth, contact) restricted by canViewDni/canViewBirth/canViewContact.

Scroll position: top

Evidence type: SEEDED_RUNTIME

Notes: Reorganized from GEI_CURRENT_UX_ATLAS. Source: 00_Global. Original surface map: surface-map-legacy.md.
