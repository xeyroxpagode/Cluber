# Surface GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR

Domain: Global
Subdomain: Navigation

Route: /calendar

Actor(s): COACH

VIEWPORT STATUS:

390×844:
CAPTURED — `GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR__COACH__390x844.png`

1440×900:
N/A — CURRENT does not render this surface at this viewport

reason:
El BottomNav fijo lleva `flex ... lg:hidden` (src/app/Shell.tsx:230-232), por lo que no se renderiza a partir de 1024 px.

current behavior:
Runtime verificado en Chrome headless a 1440×900: bottomnav display=none, visibleBox=false. La misma función la cumple la barra lateral (`hidden ... lg:flex`, src/app/Shell.tsx:183-185), que marca Calendario como destino activo.

alternate surface/route if applicable:
GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR — misma ruta /calendar, actor COACH, viewport 1440×900.


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
