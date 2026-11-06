# Surface GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR

Domain: Global
Subdomain: Navigation

Route: /calendar

Actor(s): COACH

VIEWPORT STATUS:

390×844:
N/A — CURRENT does not render this surface at this viewport

reason:
La barra lateral de destinos no se renderiza por debajo del breakpoint lg (1024 px). El <nav aria-label="Destinos"> de escritorio lleva las clases `hidden ... lg:flex` (src/app/Shell.tsx:183-185), de modo que su computed display es `none` a 390 px.

current behavior:
Runtime verificado en Chrome headless a 390×844: sidebar display=none, visibleBox=false. La misma función la cumple el BottomNav fijo (`flex ... lg:hidden`, src/app/Shell.tsx:230-232), que presenta los mismos 5 destinos con icono + label micro y marca Calendario como activo.

alternate surface/route if applicable:
GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR — misma ruta /calendar, actor COACH, viewport 390×844.

1440×900:
CAPTURED — `GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR__COACH__1440x900.png`


Current state: AUTHENTICATED · ruta /calendar

Journey(s): Home → Event → Availability → response

Entry path: /calendar

Visible sections: See surface-map-legacy.md or source component.

Primary action: Navigation to route destination.

Secondary actions: Context-dependent per role and state.

Overlay: no

Lifecycle state: AUTHENTICATED · ruta /calendar

Authority condition: Actor-dependent access per authority.ts rules.

PII condition: PII fields (DNI, birth, contact) restricted by canViewDni/canViewBirth/canViewContact.

Scroll position: top

Evidence type: SEEDED_RUNTIME

Notes: Reorganized from GEI_CURRENT_UX_ATLAS. Source: 00_Global. Original surface map: surface-map-legacy.md.
