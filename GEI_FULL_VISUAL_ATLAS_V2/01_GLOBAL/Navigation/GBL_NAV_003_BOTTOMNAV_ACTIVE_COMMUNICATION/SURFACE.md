# Surface GBL_NAV_003_BOTTOMNAV_ACTIVE_COMMUNICATION

Domain: Global
Subdomain: Navigation

Route: /communication

Actor(s): COACH

VIEWPORT STATUS:

390×844:
CAPTURED — `GBL_NAV_003_BOTTOMNAV_ACTIVE_COMMUNICATION__COACH__390x844.png`

1440×900:
N/A — CURRENT does not render this surface at this viewport

reason:
El BottomNav fijo no se renderiza en 1440 px (`flex ... lg:hidden`, src/app/Shell.tsx:230-232); además el BottomNav no implementa contadores (src/app/Shell.tsx:234-250).

current behavior:
Runtime verificado a 1440×900: bottomnav display=none. El destino Comunicación de esa ruta muestra punto + «2» en la barra lateral (src/app/Shell.tsx:204-209), que es el soporte real del contador.

alternate surface/route if applicable:
GBL_NAV_004_SIDEBAR_BADGES_COACH — misma ruta /communication, actor COACH, viewport 1440×900.


Current state: AUTHENTICATED · 2 mensajes sin leer en el equipo

Journey(s): Communication → Direct Conversation

Entry path: /communication

Visible sections: See surface-map-legacy.md or source component.

Primary action: Navigation to route destination.

Secondary actions: Context-dependent per role and state.

Overlay: no

Lifecycle state: AUTHENTICATED · 2 mensajes sin leer en el equipo

Authority condition: Actor-dependent access per authority.ts rules.

PII condition: PII fields (DNI, birth, contact) restricted by canViewDni/canViewBirth/canViewContact.

Scroll position: top

Evidence type: SEEDED_RUNTIME

Notes: Reorganized from GEI_CURRENT_UX_ATLAS. Source: 00_Global. Original surface map: surface-map-legacy.md.
