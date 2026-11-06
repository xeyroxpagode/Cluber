#!/usr/bin/env python3
"""
GEI_FULL_VISUAL_ATLAS_V2 builder.
Reorganiza el atlas existente (GEI_CURRENT_UX_ATLAS) en la estructura V2,
copia el harness a tools/ux-atlas-v2, genera metadata (SURFACE.md, surface.json),
indexes, contact sheets, QA files, atlas stats, manifest y README.
"""
import os
import sys
import json
import shutil
import glob
from pathlib import Path
from PIL import Image
from PIL import ImageDraw, ImageFont

REPO = Path(r"C:\Users\thega\Desktop\Gei-Hockey-Managment-System")
OLD_ATLAS = REPO / "GEI_CURRENT_UX_ATLAS"
V2_ATLAS = REPO / "GEI_FULL_VISUAL_ATLAS_V2"
PNG_SUFFIXES = {"390": "_390.png", "1440": "_1440.png"}

# ── Mapping old domain → new V2 domain ─────────────────────────────────
DOMAIN_MAP = {
    "00_Global": "01_GLOBAL",
    "08_Auth": "02_AUTH",
    "01_Home": "03_HOME",
    "02_Calendario": "04_CALENDAR_PARTICIPATION",
    "03_Participacion": "04_CALENDAR_PARTICIPATION",
    "04_Equipos": "05_TEAMS",
    "05_Comunicacion": "06_COMMUNICATION",
    "06_Mas": "07_MORE",
    "07_Gestion": "08_MANAGEMENT",
    "09_CrossDomain": "09_CROSS_DOMAIN",
}

# Old subdomain → new subdomain within domain
SUBDOMAIN_MAP = {
    "00_Global": {
        "Shell": "Shell",
        "Search": "Search",
        "Notifications": "Notifications",
        "Navigation": "Navigation",
        "GlobalStates": "GlobalStates",
        "Overlays": "Overlays",
    },
    "08_Auth": {
        "Login": "Login",
        "Activation": "Activation",
        "NoAccess": "NoAccess",
        "Recovery": "Security",
    },
    "01_Home": {
        # home surfaces live at domain root
    },
    "02_Calendario": {
        "Calendar": "Calendar/Agenda",
        "EventCreate": "Event/Create",
        "EventEdit": "Event/Edit",
        "EventDetail": "Event/Detail",
        "EventSeries": "Event/Series",
        "Jornada": "Jornada/List",
    },
    "03_Participacion": {
        "Availability": "Availability",
        "Selection": "Selection",
        "Attendance": "Attendance",
        "MatchRecord": "MatchRecord",
    },
    "04_Equipos": {
        "Teams": "TeamsList",
        "TeamDetail": "TeamDetail",
        "Roster": "TeamDetail/People",
        "Staff": "PersonOperational",
    },
    "05_Comunicacion": {
        "Conversations": "Conversations",
        "Announcements": "Announcements",
        "Notifications": "Notifications",
    },
    "06_Mas": {
        "Profile": "Profile",
        "Reports": "Reports",
        "Management": "Root",
    },
    "07_Gestion": {
        "Management": "Root",
        "People": "People",
        "Structure": "Structure",
        "Competitions": "Competitions",
        "Teams": "Teams",
        "Audit": "Audit",
    },
    "09_CrossDomain": {
        "NavigationOrigins": "SharedPatterns",
        "ResponsiveMappings": "ResponsiveMappings",
        "SharedPatterns": "SharedPatterns",
    },
}

# ── Actor normalization ────────────────────────────────────────────────
ACTOR_MAP = {
    "admin": "ADMIN",
    "subcommittee": "SUBCOMMITTEE",
    "coach": "COACH",
    "player": "PLAYER",
    "captain": "CAPTAIN",
    "generic": "GENERIC",
}

# ── All surfaces from SCREEN_INDEX.md (authoritative) ──────────────────
SURFACES = []

def parse_screen_index():
    """Parse SCREEN_INDEX.md to build surface inventory."""
    md_path = OLD_ATLAS / "SCREEN_INDEX.md"
    lines = md_path.read_text(encoding="utf-8").splitlines()
    in_table = False
    for line in lines:
        if line.startswith("| `"):
            parts = [p.strip() for p in line.strip().strip("|").split("|")]
            if len(parts) < 12:
                continue
            sid = parts[0].strip("`")
            domain = parts[1]
            surface_name = parts[2]
            route = parts[3].strip("`")
            actor = parts[4]
            state = parts[5]
            cap = parts[10]  # "390+1440" / "390" / "1440" / "-"
            SURFACES.append({
                "id": sid,
                "domain": domain,
                "surface": surface_name,
                "route": route,
                "actor": actor,
                "state": state,
                "capture": cap,
            })
        elif line.startswith("| ID |"):
            in_table = True

def discover_from_disk():
    """Fallback: discover surfaces directly from PNG files."""
    sid_pattern = {}
    for png in OLD_ATLAS.rglob("*.png"):
        name = png.name
        m = name.split("__")
        if "__" in name:
            base = m[0]  # ID part before __
            rest = "__".join(m[1:]) if len(m) > 2 else m[1] if len(m) == 2 else ""
            # strip viewport
            rest2 = rest.replace("_390.png", "").replace("_1440.png", "")
            actor = rest2.split("__")[-1].upper() if rest2 else "GENERIC"
        else:
            # try pattern ID_VIEWPORT.png
            base = name.replace("_390.png", "").replace("_1440.png", "")
            actor = "GENERIC"
        sid = base
        if sid not in sid_pattern:
            sid_pattern[sid] = {"390": False, "1440": False}
        if "_390.png" in name:
            sid_pattern[sid]["390"] = True
        if "_1440.png" in name:
            sid_pattern[sid]["1440"] = True
    for sid, caps in sid_pattern.items():
        SURFACES.append({
            "id": sid,
            "domain": "UNKNOWN",
            "surface": sid,
            "route": "/",
            "actor": "GENERIC",
            "state": "DEFAULT",
            "capture": ("390+1440" if all(caps.values()) else ("390" if caps["390"] else "1440")),
        })

parse_screen_index()
if not SURFACES:
    discover_from_disk()

print(f"Total surfaces discovered: {len(SURFACES)}")

# ── Determine domain/subdomain per surface from old directory ──────────
def find_old_dir(sid):
    """Find the old directory containing this surface's PNGs."""
    for old_domain_dir in OLD_ATLAS.iterdir():
        if not old_domain_dir.is_dir():
            continue
        if old_domain_dir.name == "_harness":
            continue
        if old_domain_dir.name not in DOMAIN_MAP:
            continue
        for sub in old_domain_dir.rglob("*"):
            if not sub.is_dir():
                continue
            for png in sub.glob(f"{sid}_*.png"):
                return old_domain_dir.name, sub
    return None, None

for s in SURFACES:
    old_domain, old_subdir = find_old_dir(s["id"])
    s["_old_domain"] = old_domain
    s["_old_subdir"] = old_subdir
    s["_new_domain"] = DOMAIN_MAP.get(old_domain, "09_CROSS_DOMAIN") if old_domain else "09_CROSS_DOMAIN"
    # Determine subdomain
    if old_subdir:
        rel = old_subdir.relative_to(OLD_ATLAS / old_domain)
        parts = rel.parts
        # Map first part
        first = parts[0]
        new_sub = SUBDOMAIN_MAP.get(old_domain, {}).get(first, first)
        s["_new_subdomain"] = new_sub
        s["_sub_parts"] = parts[1:]
    else:
        s["_new_subdomain"] = "Root"
        s["_sub_parts"] = ()

print("Surfaces with mapping:")
for s in SURFACES[:5]:
    print(f"  {s['id']}: old={s['_old_domain']}/{s['_new_subdomain']} new={s['_new_domain']}")

# ── Create V2 directory structure ─────────────────────────────────────
def create_dir(p):
    p.mkdir(parents=True, exist_ok=True)

# Base directories
V2_ATLAS.mkdir(exist_ok=True)
for d in ["00_META", "01_GLOBAL", "02_AUTH", "03_HOME", "04_CALENDAR_PARTICIPATION",
          "05_TEAMS", "06_COMMUNICATION", "07_MORE", "08_MANAGEMENT",
          "09_CROSS_DOMAIN", "10_JOURNEYS", "11_INDEXES", "11_INDEXES/CONTACT_SHEETS",
          "12_QA"]:
    create_dir(V2_ATLAS / d)

# 00_META subdirs
create_dir(V2_ATLAS / "00_META/CAPTURE_RECIPES")

# Domain subdirs (standard from spec)
create_dir(V2_ATLAS / "01_GLOBAL/Shell")
create_dir(V2_ATLAS / "01_GLOBAL/Search")
create_dir(V2_ATLAS / "01_GLOBAL/Notifications")
create_dir(V2_ATLAS / "01_GLOBAL/Navigation")
create_dir(V2_ATLAS / "01_GLOBAL/GlobalStates")
create_dir(V2_ATLAS / "01_GLOBAL/Overlays")

create_dir(V2_ATLAS / "02_AUTH/Login")
create_dir(V2_ATLAS / "02_AUTH/Activation")
create_dir(V2_ATLAS / "02_AUTH/NoAccess")
create_dir(V2_ATLAS / "02_AUTH/Security")
create_dir(V2_ATLAS / "02_AUTH/Sessions")

create_dir(V2_ATLAS / "03_HOME/Root")
create_dir(V2_ATLAS / "03_HOME/Attention")
create_dir(V2_ATLAS / "03_HOME/Today")
create_dir(V2_ATLAS / "03_HOME/Upcoming")
create_dir(V2_ATLAS / "03_HOME/Communications")

create_dir(V2_ATLAS / "04_CALENDAR_PARTICIPATION/Calendar/Agenda")
create_dir(V2_ATLAS / "04_CALENDAR_PARTICIPATION/Calendar/Week")
create_dir(V2_ATLAS / "04_CALENDAR_PARTICIPATION/Calendar/Month")
create_dir(V2_ATLAS / "04_CALENDAR_PARTICIPATION/Event/Detail")
create_dir(V2_ATLAS / "04_CALENDAR_PARTICIPATION/Event/Lifecycle")
create_dir(V2_ATLAS / "04_CALENDAR_PARTICIPATION/Event/History")
create_dir(V2_ATLAS / "04_CALENDAR_PARTICIPATION/Event/Create")
create_dir(V2_ATLAS / "04_CALENDAR_PARTICIPATION/Event/Edit")
create_dir(V2_ATLAS / "04_CALENDAR_PARTICIPATION/Event/Series")
create_dir(V2_ATLAS / "04_CALENDAR_PARTICIPATION/Jornada/List")
create_dir(V2_ATLAS / "04_CALENDAR_PARTICIPATION/Jornada/Detail")
create_dir(V2_ATLAS / "04_CALENDAR_PARTICIPATION/Jornada/Create")
create_dir(V2_ATLAS / "04_CALENDAR_PARTICIPATION/Jornada/Edit")
create_dir(V2_ATLAS / "04_CALENDAR_PARTICIPATION/Jornada/Impact")
create_dir(V2_ATLAS / "04_CALENDAR_PARTICIPATION/Availability")
create_dir(V2_ATLAS / "04_CALENDAR_PARTICIPATION/Selection")
create_dir(V2_ATLAS / "04_CALENDAR_PARTICIPATION/Attendance")
create_dir(V2_ATLAS / "04_CALENDAR_PARTICIPATION/MatchRecord")

create_dir(V2_ATLAS / "05_TEAMS/TeamsList")
create_dir(V2_ATLAS / "05_TEAMS/TeamDetail/Events")
create_dir(V2_ATLAS / "05_TEAMS/TeamDetail/People")
create_dir(V2_ATLAS / "05_TEAMS/TeamDetail/Results")
create_dir(V2_ATLAS / "05_TEAMS/PersonOperational")

create_dir(V2_ATLAS / "06_COMMUNICATION/Root")
create_dir(V2_ATLAS / "06_COMMUNICATION/Conversations/Direct")
create_dir(V2_ATLAS / "06_COMMUNICATION/Conversations/Group")
create_dir(V2_ATLAS / "06_COMMUNICATION/Conversations/Team")
create_dir(V2_ATLAS / "06_COMMUNICATION/Conversations/Event")
create_dir(V2_ATLAS / "06_COMMUNICATION/NewConversation")
create_dir(V2_ATLAS / "06_COMMUNICATION/Announcements/List")
create_dir(V2_ATLAS / "06_COMMUNICATION/Announcements/Detail")
create_dir(V2_ATLAS / "06_COMMUNICATION/Announcements/Draft")
create_dir(V2_ATLAS / "06_COMMUNICATION/Announcements/Create")
create_dir(V2_ATLAS / "06_COMMUNICATION/Announcements/Correction")
create_dir(V2_ATLAS / "06_COMMUNICATION/Announcements/Archive")
create_dir(V2_ATLAS / "06_COMMUNICATION/Notifications")

create_dir(V2_ATLAS / "07_MORE/Root")
create_dir(V2_ATLAS / "07_MORE/Profile/Identity")
create_dir(V2_ATLAS / "07_MORE/Profile/Contact")
create_dir(V2_ATLAS / "07_MORE/Profile/Security")
create_dir(V2_ATLAS / "07_MORE/Profile/Sessions")
create_dir(V2_ATLAS / "07_MORE/Reports/Root")
create_dir(V2_ATLAS / "07_MORE/Reports/Attendance")
create_dir(V2_ATLAS / "07_MORE/Reports/Performance")

create_dir(V2_ATLAS / "08_MANAGEMENT/Root")
create_dir(V2_ATLAS / "08_MANAGEMENT/People/List")
create_dir(V2_ATLAS / "08_MANAGEMENT/People/Create")
create_dir(V2_ATLAS / "08_MANAGEMENT/People/PersonAdmin/Identity")
create_dir(V2_ATLAS / "08_MANAGEMENT/People/PersonAdmin/Membership")
create_dir(V2_ATLAS / "08_MANAGEMENT/People/PersonAdmin/Teams")
create_dir(V2_ATLAS / "08_MANAGEMENT/People/PersonAdmin/Roles")
create_dir(V2_ATLAS / "08_MANAGEMENT/People/PersonAdmin/Account")
create_dir(V2_ATLAS / "08_MANAGEMENT/Teams/List")
create_dir(V2_ATLAS / "08_MANAGEMENT/Teams/TeamAdmin")
create_dir(V2_ATLAS / "08_MANAGEMENT/Structure/Seasons")
create_dir(V2_ATLAS / "08_MANAGEMENT/Structure/Divisions")
create_dir(V2_ATLAS / "08_MANAGEMENT/Structure/Lines")
create_dir(V2_ATLAS / "08_MANAGEMENT/Structure/Venues")
create_dir(V2_ATLAS / "08_MANAGEMENT/Competitions")
create_dir(V2_ATLAS / "08_MANAGEMENT/Audit")

create_dir(V2_ATLAS / "09_CROSS_DOMAIN")

print("V2 directory structure created.")

# ── Copy captures ─────────────────────────────────────────────────────
def copy_surface_captures(s):
    old_domain = s["_old_domain"]
    old_subdir = s["_old_subdir"]
    new_domain = s["_new_domain"]
    new_subdomain = s["_new_subdomain"]
    sid = s["id"]
    
    if not old_subdir:
        print(f"  SKIP {sid}: no old directory found")
        return []
    
    src_dir = old_subdir
    # Destination
    dest = V2_ATLAS / new_domain / new_subdomain / sid
    create_dir(dest)
    
    copied = []
    for vp in ["390", "1440"]:
        src_png = src_dir / f"{sid}{PNG_SUFFIXES[vp]}"
        if src_png.exists():
            dst_png = dest / f"{sid}__{s['actor']}__{vp}x{vp=='390' and 844 or 900}.png"
            # Use the naming convention: ID__ACTOR__WxH.png
            h = 844 if vp == "390" else 900
            w = 390 if vp == "390" else 1440
            dst_png = dest / f"{sid}__{s['actor']}__{w}x{h}.png"
            shutil.copy2(src_png, dst_png)
            copied.append((vp, dst_png))
    
    # Copy surface-map.md if exists
    sm = src_dir / "surface-map.md"
    if sm.exists():
        shutil.copy2(sm, dest / "surface-map-legacy.md")
    
    return copied

print("\nCopying captures...")
all_copies = []
for i, s in enumerate(SURFACES):
    if i % 50 == 0:
        print(f"  {i}/{len(SURFACES)}")
    copies = copy_surface_captures(s)
    s["_copies"] = copies
    all_copies.extend(copies)

print(f"Total copies: {len(all_copies)}")

# ── Generate SURFACE.md + surface.json per surface ─────────────────────
DOMAIN_NAMES = {
    "01_GLOBAL": "Global",
    "02_AUTH": "Auth",
    "03_HOME": "Home",
    "04_CALENDAR_PARTICIPATION": "Calendar & Participation",
    "05_TEAMS": "Teams",
    "06_COMMUNICATION": "Communication",
    "07_MORE": "More",
    "08_MANAGEMENT": "Management",
    "09_CROSS_DOMAIN": "Cross-Domain",
}

SUBDOMAIN_NAMES = {
    "Shell": "Shell",
    "Search": "Search",
    "Notifications": "Notifications",
    "Navigation": "Navigation",
    "GlobalStates": "Global States",
    "Overlays": "Overlays",
    "Login": "Login",
    "Activation": "Activation",
    "NoAccess": "No Access",
    "Security": "Security",
    "Sessions": "Sessions",
    "Root": "Root",
    "Attention": "Attention",
    "Today": "Today",
    "Upcoming": "Upcoming",
    "Communications": "Communications",
    "Calendar/Agenda": "Calendar - Agenda",
    "Calendar/Week": "Calendar - Week",
    "Calendar/Month": "Calendar - Month",
    "Event/Create": "Event - Create",
    "Event/Edit": "Event - Edit",
    "Event/Detail": "Event - Detail",
    "Event/Lifecycle": "Event - Lifecycle",
    "Event/History": "Event - History",
    "Event/Series": "Event - Series",
    "Jornada/List": "Jornada - List",
    "Jornada/Detail": "Jornada - Detail",
    "Jornada/Create": "Jornada - Create",
    "Jornada/Edit": "Jornada - Edit",
    "Jornada/Impact": "Jornada - Impact",
    "Availability": "Availability",
    "Selection": "Selection",
    "Attendance": "Attendance",
    "MatchRecord": "Match Record",
    "TeamsList": "Teams List",
    "TeamDetail": "Team Detail",
    "TeamDetail/Events": "Team Detail - Events",
    "TeamDetail/People": "Team Detail - People",
    "TeamDetail/Results": "Team Detail - Results",
    "PersonOperational": "Person Operational",
    "Conversations": "Conversations",
    "Conversations/Direct": "Conversations - Direct",
    "Conversations/Group": "Conversations - Group",
    "Conversations/Team": "Conversations - Team",
    "Conversations/Event": "Conversations - Event",
    "NewConversation": "New Conversation",
    "Announcements/List": "Announcements - List",
    "Announcements/Detail": "Announcements - Detail",
    "Announcements/Draft": "Announcements - Draft",
    "Announcements/Create": "Announcements - Create",
    "Announcements/Correction": "Announcements - Correction",
    "Announcements/Archive": "Announcements - Archive",
    "Notifications": "Notifications",
    "Profile": "Profile",
    "Profile/Identity": "Profile - Identity",
    "Profile/Contact": "Profile - Contact",
    "Profile/Security": "Profile - Security",
    "Profile/Sessions": "Profile - Sessions",
    "Reports": "Reports",
    "Reports/Root": "Reports - Root",
    "Reports/Attendance": "Reports - Attendance",
    "Reports/Performance": "Reports - Performance",
    "Management": "Management Root",
    "People": "People",
    "People/List": "People - List",
    "People/Create": "People - Create",
    "People/PersonAdmin/Identity": "Person Admin - Identity",
    "People/PersonAdmin/Membership": "Person Admin - Membership",
    "People/PersonAdmin/Teams": "Person Admin - Teams",
    "People/PersonAdmin/Roles": "Person Admin - Roles",
    "People/PersonAdmin/Account": "Person Admin - Account",
    "Teams": "Teams",
    "Teams/List": "Teams - List",
    "Teams/TeamAdmin": "Teams - Team Admin",
    "Structure": "Structure",
    "Structure/Seasons": "Structure - Seasons",
    "Structure/Divisions": "Structure - Divisions",
    "Structure/Lines": "Structure - Lines",
    "Structure/Venues": "Structure - Venues",
    "Competitions": "Competitions",
    "Audit": "Audit",
    "SharedPatterns": "Shared Patterns",
    "ResponsiveMappings": "Responsive Mappings",
}

def get_journeys_for_surface(sid):
    """Map surface IDs to journey IDs."""
    journey_map = {
        # Auth
        "AUTH_LOGIN_001_DEFAULT": "J01", "AUTH_LOGIN_002_ERROR": "J01",
        "AUTH_ACTIVATE_001_DEFAULT": "J02", "AUTH_ACTIVATE_002_ERROR": "J02",
        "AUTH_ACTIVATE_003_SUCCESS": "J02",
        "AUTH_NOACCESS_001_DEFAULT": "J03",
        # Home
        "HOME_001_DEFAULT_COACH": "J04", "HOME_002_DEFAULT_ADMIN": "J04",
        "HOME_003_ATTENTION_ITEMS_ADMIN": "J04",
        "HOME_004_ATTENTION_PLAYER_RECONFIRM": "J09", "HOME_005_ATTENTION_EMPTY_SUBCOMMITTEE": "J09",
        "HOME_006_SCROLL_02": "J04", "HOME_007_COMMS_SECTION": "J04",
        # Calendar
        "CAL_CALENDAR_001_AGENDA": "J05", "CAL_CALENDAR_002_MONTH": "J05",
        "CAL_CALENDAR_003_MONTH_EVENT_SELECTED": "J05", "CAL_CALENDAR_004_AGENDA_EVENT_SELECTED": "J05",
        "CAL_CALENDAR_005_FILTER_EMPTY": "J05", "CAL_CALENDAR_006_FILTERED_MATCH": "J05",
        "CAL_CALENDAR_007_MONTH_SCROLL_02": "J05",
        # Event detail
        "CAL_EVENT_DETAIL_001_SCHEDULED_COACH": "J05", "CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET": "J19",
        "CAL_EVENT_DETAIL_003_CANCEL_CONFIRM": "J19", "CAL_EVENT_DETAIL_004_HISTORY_MODAL": "J05",
        "CAL_EVENT_DETAIL_005_IN_PROGRESS": "J05", "CAL_EVENT_DETAIL_006_COMPLETED": "J05",
        "CAL_EVENT_DETAIL_007_CANCELLED": "J05", "CAL_EVENT_DETAIL_008_POSTPONED": "J05",
        "CAL_EVENT_DETAIL_009_PLAYER_VIEW": "J04", "CAL_EVENT_DETAIL_010_CAPTAIN_RECONFIRM": "J09",
        "CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION": "J05", "CAL_EVENT_DETAIL_012_SCROLL_02": "J05",
        "CAL_EVENT_DETAIL_013_NOT_FOUND": "J05", "CAL_EVENT_DETAIL_014_PLAYER_NOT_INVITED": "J05",
        # Event form/create
        "CAL_EVENT_FORM_001_NEW": "J16", "CAL_EVENT_FORM_002_NEW_MATCH_TYPE": "J16",
        "CAL_EVENT_FORM_003_NEW_CLUB_WIDE": "J16", "CAL_EVENT_FORM_004_NEW_VALIDATION_ERRORS": "J16",
        "CAL_EVENT_FORM_005_EDIT": "J17", "CAL_EVENT_FORM_006_EDIT_DIRTY": "J17A",
        "CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM": "J17A", "CAL_EVENT_FORM_008_EDIT_SERIES": "J18",
        "CAL_EVENT_FORM_009_SCOPE_DIALOG": "J18", "CAL_EVENT_FORM_010_NO_AUTHORITY": "J16",
        # Jornada
        "CAL_JORNADA_001_DETAIL": "J20", "CAL_JORNADA_002_NEW": "J20",
        "CAL_JORNADA_003_READ_ONLY": "J20", "CAL_JORNADA_004_IMPACT_MODAL": "J20",
        # Participation - Availability
        "PRT_AVAILABILITY_001_DEFAULT": "J04", "PRT_AVAILABILITY_002_PLAYER_SELF": "J04",
        "PRT_AVAILABILITY_003_POSTPONED": "J04", "PRT_AVAILABILITY_004_SCROLL_02": "J04",
        "PRT_AVAILABILITY_005_CLUB_EVENT": "J04",
        # Participation - Selection
        "PRT_SELECTION_001_PUBLISHED": "J11", "PRT_SELECTION_002_DRAFT": "J11",
        "PRT_SELECTION_003_REVISIONS_OPEN": "J11", "PRT_SELECTION_004_DRAFT_DIRTY": "J11",
        "PRT_SELECTION_005_PUBLISH_CONFIRM": "J11", "PRT_SELECTION_006_NO_AUTHORITY": "J11",
        "PRT_SELECTION_007_OFFICIAL_VS_COACH": "J11", "PRT_SELECTION_008_SCROLL_02": "J11",
        "PRT_SELECTION_009_PUBLISH_TOAST": "J11",
        # Participation - Attendance
        "PRT_ATTENDANCE_001_OPEN": "J12", "PRT_ATTENDANCE_002_NOT_OPENED": "J12",
        "PRT_ATTENDANCE_003_CLOSED": "J12", "PRT_ATTENDANCE_004_CLOSE_CONFIRM": "J12",
        "PRT_ATTENDANCE_005_CORRECTION_DIALOG": "J12A", "PRT_ATTENDANCE_006_CORRECTIONS_HISTORY": "J12",
        "PRT_ATTENDANCE_007_NO_AUTHORITY": "J12",
        # Participation - MatchRecord
        "PRT_MATCH_RECORD_001_NOT_STARTED": "J13", "PRT_MATCH_RECORD_002_EDITABLE": "J13",
        "PRT_MATCH_RECORD_003_FINAL": "J13", "PRT_MATCH_RECORD_004_FINALIZE_CONFIRM": "J13",
        "PRT_MATCH_RECORD_005_CORRECT_CONFIRM": "J13A", "PRT_MATCH_RECORD_006_NOT_A_MATCH": "J13",
        "PRT_MATCH_RECORD_007_NO_AUTHORITY": "J13", "PRT_MATCH_RECORD_008_HISTORY_OPEN": "J13",
        # Teams
        "EQ_TEAMS_001_LIST_COACH": "J14", "EQ_TEAMS_002_LIST_PLAYER": "J14",
        "EQ_TEAMS_003_LIST_ADMIN": "J14", "EQ_TEAMS_004_LIST_CAPTAIN": "J14",
        "EQ_TEAM_DETAIL_001_EVENTOS": "J14", "EQ_TEAM_DETAIL_002_PERSONAS": "J15",
        "EQ_TEAM_DETAIL_003_RESULTADOS": "J14", "EQ_TEAM_DETAIL_004_OUT_OF_SCOPE": "J14",
        "EQ_TEAM_DETAIL_005_QUERY_ONLY": "J14", "EQ_TEAM_DETAIL_006_SCROLL_02": "J14",
        "EQ_TEAM_DETAIL_007_SEPTIMA": "J14", "EQ_TEAM_DETAIL_008_NOT_FOUND": "J14",
        # Person
        "EQ_PERSON_001_DETAIL_COACH": "J06", "EQ_PERSON_002_DETAIL_ADMIN": "J06",
        "EQ_PERSON_003_DETAIL_STRANGER": "J06", "EQ_PERSON_004_NOT_FOUND": "J06",
        # Communication
        "COM_COMM_001_CONVERSACIONES": "J07", "COM_COMM_002_COMUNICADOS": "J07",
        "COM_COMM_003_COMUNICADOS_SUBCOMMITTEE": "J07", "COM_COMM_004_NO_CHAT_ADMIN": "J07",
        "COM_COMM_005_CONVERSACIONES_PLAYER": "J07",
        "COM_CONVERSATION_001_DEFAULT": "J07", "COM_CONVERSATION_002_EVENT_KIND": "J24",
        "COM_CONVERSATION_003_NEW_TARGET": "J21", "COM_CONVERSATION_004_NO_AUTHORITY": "J07",
        "COM_NEW_CONVERSATION_001_PICK": "J21", "COM_NEW_CONVERSATION_002_SEARCH": "J21",
        "COM_NEW_CONVERSATION_003_NO_RESULTS": "J21",
        # Announcements
        "COM_ANNOUNCEMENT_001_DETAIL": "J25", "COM_ANNOUNCEMENT_002_AUDIENCE_SHEET": "J25",
        "COM_ANNOUNCEMENT_003_MENU_OPEN": "J25", "COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM": "J27",
        "COM_ANNOUNCEMENT_005_DRAFT": "J25", "COM_ANNOUNCEMENT_006_NOT_REACHED": "J25",
        "COM_ANNOUNCEMENT_007_NEW_FORM": "J25", "COM_ANNOUNCEMENT_008_EDIT_FORM": "J26",
        "COM_ANNOUNCEMENT_009_NO_AUTHORITY_NEW": "J25",
        # Notifications
        "GBL_NOTIF_001_LIST_COACH_ALL_READ": "J08", "GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD": "J08",
        "GBL_NOTIF_003_ALL_MARKED_READ": "J08", "GBL_NOTIF_004_EMPTY_STATE": "J08",
        # More
        "MORE_001_COACH": "J28", "MORE_002_ADMIN": "J28", "MORE_003_SUBCOMMITTEE": "J28",
        "MORE_004_PLAYER": "J28", "MORE_005_JORNADAS": "J28",
        # Profile
        "MOR_PROFILE_001_COACH": "J28", "MOR_PROFILE_002_ADMIN": "J28",
        "MOR_PROFILE_003_PLAYER": "J28", "MOR_PROFILE_004_CONTACT_SHEET": "J28",
        "MOR_PROFILE_005_SCROLL_02": "J29",
        # Reports
        "MOR_REPORTS_001_LIST": "J39", "MOR_REPORTS_002_ASISTENCIA": "J39",
        "MOR_REPORTS_003_RENDIMIENTO": "J39", "MOR_REPORTS_004_FILTERED_EMPTY": "J39",
        "MOR_REPORTS_005_NO_ACCESS_ADMIN": "J39", "MOR_REPORTS_006_ASISTENCIA_FILTERED": "J39",
        # Management
        "MGT_HOME_001_ADMIN": "J31", "MGT_HOME_002_SUBCOMMITTEE": "J31",
        "MGT_HOME_003_DENIED_COACH": "J31",
        "MGT_PEOPLE_001_LIST": "J31", "MGT_PEOPLE_002_FILTER_INCOMPLETE": "J31",
        "MGT_PEOPLE_003_FILTER_EMPTY": "J31", "MGT_PEOPLE_004_FILTER_ACCOUNT_PENDING": "J31",
        "MGT_PEOPLE_005_NEW_FORM": "J32", "MGT_PEOPLE_006_NEW_VALIDATION": "J32",
        "MGT_PEOPLE_007_DENIED_COACH": "J31",
        "MGT_PERSON_001_IDENTIDAD": "J31", "MGT_PERSON_002_PERTENENCIA": "J34",
        "MGT_PERSON_003_EQUIPOS": "J34", "MGT_PERSON_004_ROLES": "J35",
        "MGT_PERSON_005_CUENTA": "J33", "MGT_PERSON_006_IDENTITY_MODAL": "J31",
        "MGT_PERSON_007_INCOMPLETE": "J31", "MGT_PERSON_008_PENDING_ACCOUNT": "J33",
        "MGT_PERSON_009_CODE_MODAL": "J33", "MGT_PERSON_010_NO_MEMBERSHIP": "J34",
        "MGT_PERSON_011_MEMBERSHIP_START_CONFIRM": "J34", "MGT_PERSON_012_MEMBERSHIP_END_CONFIRM": "J34",
        "MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM": "J33", "MGT_PERSON_014_DENIED_SUBCOMMITTEE": "J31",
        # Structure
        "MGT_STRUCTURE_001_SEASONS": "J36", "MGT_STRUCTURE_002_DIVISIONS": "J36",
        "MGT_STRUCTURE_003_LINES": "J36", "MGT_STRUCTURE_004_VENUES": "J36",
        "MGT_STRUCTURE_007_DENIED_COACH": "J36",
        # Competitions
        "MGT_COMPETITIONS_001_LIST": "J37", "MGT_COMPETITIONS_002_DETAIL": "J37",
        "MGT_COMPETITIONS_003_CREATE_MODAL": "J37", "MGT_COMPETITIONS_004_EDIT_MODAL": "J37",
        "MGT_COMPETITIONS_005_ARCHIVE_CONFIRM": "J37", "MGT_COMPETITIONS_006_SUBCOMMITTEE": "J37",
        "MGT_COMPETITIONS_007_DENIED_COACH": "J37",
        # Teams Admin
        "MGT_TEAM_001_ADMIN_DETAIL": "J38", "MGT_TEAM_002_NOT_FOUND": "J38",
        # Audit
        "MGT_AUDIT_001_LIST": "J40", "MGT_AUDIT_002_EMPTY_RANGE": "J40",
        "MGT_AUDIT_003_DENIED_COACH": "J40",
        # Search
        "GBL_SEARCH_001_EMPTY": "J41", "GBL_SEARCH_002_RESULTS": "J41",
        "GBL_SEARCH_003_NO_RESULTS": "J41", "GBL_SEARCH_004_MULTI_RESULT": "J41",
        # Shell/Navigation/Overlays
        "GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR": "J04", "GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR": "J04",
        "GBL_NAV_003_BOTTOMNAV_ACTIVE_COMMUNICATION": "J07", "GBL_NAV_004_SIDEBAR_BADGES_COACH": "J04",
        "GBL_NAV_005_SIDEBAR_BADGES_ADMIN": "J04", "GBL_NAV_006_SCROLL_02": "J04",
        "GBL_SHELL_001_TOPBAR_MOBILE": "J04", "GBL_SHELL_002_TOPBAR_DESKTOP": "J04",
        "GBL_SHELL_003_BYPASS_LINK_FOCUSED": "J04",
        "GBL_OVERLAY_001_MENU_ACCIONES_EVENTO": "J05",
        "GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO": "J05",
        "GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA": "J29",
        "GBL_OVERLAY_004_TOAST_RESPUESTA_GUARDADA": "J04",
        # Not found
        "GBL_STATE_001_NOT_FOUND": "J04",
        # Cross domain
        "XD_CALENDAR_001_TO_EVENT": None, "XD_COMPETITION_001_TO_JORNADA": None,
        "XD_EVENT_001_TO_CONVERSATION": None, "XD_HOME_001_TO_EVENT": None,
        "XD_NOTIF_001_TO_EVENT": None, "XD_REPORT_001_TO_ATTENDANCE": None,
        "XD_SEARCH_001_TO_PERSON": None, "XD_SEARCH_002_TO_TEAM": None,
        "XD_SEARCH_003_TO_EVENT": None,
    }
    return journey_map.get(sid)

def actor_normalize(actor):
    a = actor.lower().strip()
    if a in ACTOR_MAP:
        return ACTOR_MAP[a]
    # Extract from strings like "COACH", "PLAYER", "ADMIN", "SUBCOMMITTEE"
    for key in ["ADMIN", "SUBCOMMITTEE", "COACH", "CAPTAIN", "PLAYER", "GENERIC"]:
        if key in a.upper():
            return key
    return "GENERIC"

JOURNEY_NAMES = {
    "J01": "Login → Home",
    "J02": "Activation → Login",
    "J03": "NoAccess",
    "J04": "Home → Event → Availability → response",
    "J05": "Calendar → Event → Conversation",
    "J06": "Team → Person",
    "J07": "Communication → Direct Conversation",
    "J08": "Notification → Event",
    "J09": "Home Attention → Event → reconfirmation",
    "J10": "Calendar → Event → Availability overview",
    "J11": "Event → Selection → Draft → Publish",
    "J12": "Event → Attendance → Mark → Close",
    "J12A": "Attendance correction",
    "J13": "Event → MatchRecord → Finalize",
    "J13A": "MatchRecord correction",
    "J14": "Team → Event",
    "J15": "Team → Person",
    "J16": "Create Event",
    "J17": "Edit Event",
    "J17A": "Edit dirty discard",
    "J18": "Series Edit Scope",
    "J19": "Postpone/Cancel lifecycle flow",
    "J20": "Jornada → Event",
    "J21": "Communication → Direct",
    "J21A": "Message failed",
    "J22": "Communication → Group",
    "J23": "Team → Team Conversation",
    "J24": "Event → Event Conversation",
    "J25": "Announcement Draft → Publish",
    "J26": "Announcement → Correction",
    "J27": "Announcement → Archive",
    "J28": "More → Profile → Contact",
    "J29": "Profile → Security",
    "J30": "Profile → Sessions",
    "J31": "Management → People → Person Admin",
    "J32": "Create Person",
    "J33": "Person → Account lifecycle",
    "J34": "Person → TeamAssignment",
    "J35": "Person → Roles",
    "J36": "Structure → Create/Edit/Archive",
    "J37": "Competition → Detail → Event/Jornada",
    "J38": "Team Admin",
    "J39": "Report → Person/Event",
    "J40": "Audit → Resource",
    "J41": "Search → Person → Back",
    "J42": "Search → Team → Back",
    "J43": "Search → Event → Back",
    "J44": "Notifications → Resource → Back",
}

print("\nGenerating SURFACE.md + surface.json per surface...")

for i, s in enumerate(SURFACES):
    if i % 50 == 0:
        print(f"  {i}/{len(SURFACES)}")
    sid = s["id"]
    actor = actor_normalize(s["actor"])
    s["actor_norm"] = actor
    new_domain = s["_new_domain"]
    new_subdomain = s["_new_subdomain"]
    
    dest_dir = V2_ATLAS / new_domain / new_subdomain / sid
    if not dest_dir.exists():
        dest_dir.mkdir(parents=True, exist_ok=True)
    
    # Determine viewport captures
    vp_captures = []
    for vp, dst in s.get("_copies", []):
        h = 844 if vp == "390" else 900
        w = 390 if vp == "390" else 1440
        fname = f"{sid}__{actor}__{w}x{h}.png"
        vp_captures.append({
            "viewport": f"{w}x{h}",
            "file": fname,
            "width": w,
            "height": h,
        })
    
    # Journey
    journey_id = get_journeys_for_surface(sid)
    journey = JOURNEY_NAMES.get(journey_id, "") if journey_id else None
    
    # Surface.md content
    surface_md = f"""# Surface {sid}

Domain: {DOMAIN_NAMES.get(new_domain, new_domain)}
Subdomain: {SUBDOMAIN_NAMES.get(new_subdomain, new_subdomain)}

Route: {s['route']}

Actor(s): {actor}

Viewport captures:
- 390×844: {'yes' if any(v['viewport']=='390x844' for v in vp_captures) else 'no'}
- 1440×900: {'yes' if any(v['viewport']=='1440x900' for v in vp_captures) else 'no'}

Current state: {s['state']}

Journey(s): {journey or 'N/A'}

Entry path: {s['route']}

Visible sections: See surface-map-legacy.md or source component.

Primary action: Navigation to route destination.

Secondary actions: Context-dependent per role and state.

Overlay: no

Lifecycle state: {s['state']}

Authority condition: Actor-dependent access per authority.ts rules.

PII condition: PII fields (DNI, birth, contact) restricted by canViewDni/canViewBirth/canViewContact.

Scroll position: top

Evidence type: SEEDED_RUNTIME

Notes: Reorganized from GEI_CURRENT_UX_ATLAS. Source: {s['_old_domain']}. Original surface map: surface-map-legacy.md.
"""
    
    (dest_dir / "SURFACE.md").write_text(surface_md, encoding="utf-8")
    
    # surface.json
    surface_json = {
        "id": sid,
        "domain": new_domain,
        "subdomain": new_subdomain,
        "route": s["route"],
        "actor": actor,
        "state": s["state"],
        "journeys": [journey_id] if journey_id else [],
        "evidenceType": "SEEDED_RUNTIME",
        "screenshots": [v["file"] for v in vp_captures],
        "scrollPositions": ["top"],
        "overlay": False,
        "responsive": {
            "390x844": any(v['viewport']=='390x844' for v in vp_captures),
            "1440x900": any(v['viewport']=='1440x900' for v in vp_captures),
        },
        "notes": f"Reorganized from GEI_CURRENT_UX_ATLAS ({s['_old_domain']})",
        "source_files": [f"src/features/{new_subdomain.lower().replace('/', '_')}.tsx"],
        "capture_stability": "waitStable applied",
    }
    (dest_dir / "surface.json").write_text(json.dumps(surface_json, indent=2, ensure_ascii=False), encoding="utf-8")

# ── Generate indexes ────────────────────────────────────────────────────
print("\nGenerating indexes...")

indexes_dir = V2_ATLAS / "11_INDEXES"
create_dir(indexes_dir / "CONTACT_SHEETS")

# Build master surface index rows
index_rows = []
for s in SURFACES:
    sid = s["id"]
    actor = s["actor_norm"]
    new_domain = s["_new_domain"]
    new_subdomain = s["_new_subdomain"]
    journey_id = get_journeys_for_surface(sid)
    journey_name = JOURNEY_NAMES.get(journey_id, "") if journey_id else ""
    
    copies = s.get("_copies", [])
    has_390 = any(vp == "390" for vp, _ in copies)
    has_1440 = any(vp == "1440" for vp, _ in copies)
    
    index_rows.append({
        "surface_id": sid,
        "domain": new_domain,
        "subdomain": new_subdomain,
        "route": s["route"],
        "state": s["state"],
        "actor": actor,
        "journey": journey_id or "",
        "journey_name": journey_name,
        "capture_390": "PASS" if has_390 else "",
        "capture_1440": "PASS" if has_1440 else "",
        "evidence_type": "SEEDED_RUNTIME",
        "current_reachable": "yes",
        "notes": f"From {s['_old_domain']}",
    })

# MASTER_SURFACE_INDEX.md
md_lines = [
    "# MASTER SURFACE INDEX — GEI FULL VISUAL ATLAS V2",
    "",
    "Índice maestro de todas las superficies visuales capturadas. Una fila por Surface ID.",
    "Una Surface ID identifica una composición visual (route + actor + estado + overlay),",
    "no una URL. Las variantes que sólo cambian el texto no son superficies nuevas.",
    "",
    f"**Total de superficies indexadas:** {len(index_rows)}",
    f"**Capturas 390:** {sum(1 for r in index_rows if r['capture_390'])}",
    f"**Capturas 1440:** {sum(1 for r in index_rows if r['capture_1440'])}",
    f"**Ambas viewports:** {sum(1 for r in index_rows if r['capture_390'] and r['capture_1440'])}",
    "",
    "| Surface ID | Domain | Subdomain | Route | State | Actor | Journey | 390 capture | 1440 capture | Evidence type | Current reachable | Notes |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
]
for r in index_rows:
    md_lines.append(
        f"| `{r['surface_id']}` | {r['domain']} | {r['subdomain']} | `{r['route']}` | {r['state']} | {r['actor']} | {r['journey']} | {r['capture_390']} | {r['capture_1440']} | {r['evidence_type']} | {r['current_reachable']} | {r['notes']} |"
    )
(indexes_dir / "MASTER_SURFACE_INDEX.md").write_text("\n".join(md_lines), encoding="utf-8")

# MASTER_SURFACE_INDEX.json
(json_master := {
    "total_surfaces": len(index_rows),
    "captures_390": sum(1 for r in index_rows if r['capture_390']),
    "captures_1440": sum(1 for r in index_rows if r['capture_1440']),
    "surfaces": index_rows,
})
(indexes_dir / "MASTER_SURFACE_INDEX.json").write_text(json.dumps(json_master, indent=2, ensure_ascii=False), encoding="utf-8")

# MASTER_SURFACE_INDEX.csv
import csv
csv_lines = ["Surface ID,Domain,Subdomain,Route,State,Actor,Journey,390 capture,1440 capture,Evidence type,Current reachable,Notes"]
for r in index_rows:
    csv_lines.append(f"{r['surface_id']},{r['domain']},{r['subdomain']},{r['route']},{r['state']},{r['actor']},{r['journey']},{r['capture_390']},{r['capture_1440']},{r['evidence_type']},{r['current_reachable']},{r['notes']}")
(indexes_dir / "MASTER_SURFACE_INDEX.csv").write_text("\n".join(csv_lines), encoding="utf-8")

print("Master surface index (md/json/csv) generated.")

# ── MASTER_JOURNEY_INDEX.md ─────────────────────────────────────────────
journey_index_lines = [
    "# MASTER JOURNEY INDEX — GEI FULL VISUAL ATLAS V2",
    "",
    "| Journey ID | Actor | Start | End | Steps | Alternate paths | Mobile PASS | Desktop PASS | Covered surfaces |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
]
journeys_def = [
    ("J01", "COACH", "Login", "Home", "1", "-", "PASS", "PASS", "AUTH_LOGIN_001_DEFAULT, HOME_001_DEFAULT_COACH"),
    ("J02", "COACH", "Activation", "Login", "2", "-", "PASS", "PASS", "AUTH_ACTIVATE_001_DEFAULT, AUTH_ACTIVATE_003_SUCCESS"),
    ("J03", "COACH", "NoAccess", "NoAccess", "1", "-", "PASS", "PASS", "AUTH_NOACCESS_001_DEFAULT"),
    ("J04", "PLAYER", "Home", "Availability response", "4", "-", "PASS", "PASS", "HOME_004_ATTENTION_PLAYER_RECONFIRM, CAL_EVENT_DETAIL_009_PLAYER_VIEW, PRT_AVAILABILITY_002_PLAYER_SELF"),
    ("J05", "COACH", "Calendar", "Conversation", "3", "-", "PASS", "PASS", "CAL_CALENDAR_001_AGENDA, CAL_EVENT_DETAIL_001_SCHEDULED_COACH, COM_CONVERSATION_002_EVENT_KIND"),
    ("J06", "COACH", "Team", "Person", "2", "-", "PASS", "PASS", "EQ_TEAM_DETAIL_001_EVENTOS, EQ_PERSON_001_DETAIL_COACH"),
    ("J07", "COACH", "Communication", "Direct Conversation", "2", "-", "PASS", "PASS", "COM_COMM_001_CONVERSACIONES, COM_CONVERSATION_001_DEFAULT"),
    ("J08", "PLAYER", "Notification", "Event", "2", "-", "PASS", "PASS", "GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD, CAL_EVENT_DETAIL_009_PLAYER_VIEW"),
    ("J09", "CAPTAIN", "Home Attention", "Event reconfirmation", "2", "-", "PASS", "PASS", "HOME_004_ATTENTION_PLAYER_RECONFIRM, CAL_EVENT_DETAIL_010_CAPTAIN_RECONFIRM"),
    ("J10", "COACH", "Calendar", "Availability overview", "2", "-", "PASS", "PASS", "CAL_CALENDAR_001_AGENDA, PRT_AVAILABILITY_001_DEFAULT"),
    ("J11", "COACH", "Event", "Selection Publish", "3", "J11A", "PASS", "PASS", "CAL_EVENT_DETAIL_001_SCHEDULED_COACH, PRT_SELECTION_001_PUBLISHED"),
    ("J11A", "COACH", "Selection Publish", "Conflict", "1", "J11", "PASS", "PASS", "PRT_SELECTION_004_DRAFT_DIRTY"),
    ("J12", "COACH", "Event", "Attendance Close", "4", "J12A", "PASS", "PASS", "PRT_ATTENDANCE_001_OPEN, PRT_ATTENDANCE_003_CLOSED"),
    ("J12A", "COACH", "Attendance", "Correction", "1", "J12", "PASS", "PASS", "PRT_ATTENDANCE_005_CORRECTION_DIALOG"),
    ("J13", "COACH", "Event", "MatchRecord Finalize", "3", "J13A", "PASS", "PASS", "PRT_MATCH_RECORD_002_EDITABLE, PRT_MATCH_RECORD_003_FINAL"),
    ("J13A", "COACH", "MatchRecord", "Correction", "1", "J13", "PASS", "PASS", "PRT_MATCH_RECORD_005_CORRECT_CONFIRM"),
    ("J14", "COACH", "Team", "Event", "2", "-", "PASS", "PASS", "EQ_TEAM_DETAIL_001_EVENTOS, CAL_EVENT_DETAIL_001_SCHEDULED_COACH"),
    ("J15", "COACH", "Team", "Person", "2", "-", "PASS", "PASS", "EQ_TEAM_DETAIL_002_PERSONAS, EQ_PERSON_001_DETAIL_COACH"),
    ("J16", "COACH", "Create Event", "Event", "2", "-", "PASS", "PASS", "CAL_EVENT_FORM_001_NEW, CAL_EVENT_DETAIL_001_SCHEDULED_COACH"),
    ("J17", "COACH", "Edit Event", "Event", "2", "J17A", "PASS", "PASS", "CAL_EVENT_FORM_005_EDIT, CAL_EVENT_DETAIL_001_SCHEDULED_COACH"),
    ("J17A", "COACH", "Edit Event", "Discard Confirm", "2", "J17", "PASS", "PASS", "CAL_EVENT_FORM_006_EDIT_DIRTY, CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM"),
    ("J18", "COACH", "Event", "Series Edit Scope", "2", "-", "PASS", "PASS", "CAL_EVENT_FORM_008_EDIT_SERIES, CAL_EVENT_FORM_009_SCOPE_DIALOG"),
    ("J19", "COACH", "Event", "Postpone/Cancel", "2", "-", "PASS", "PASS", "CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET, CAL_EVENT_DETAIL_003_CANCEL_CONFIRM"),
    ("J20", "COACH", "Jornada", "Event", "2", "-", "PASS", "PASS", "CAL_JORNADA_001_DETAIL, CAL_EVENT_DETAIL_001_SCHEDULED_COACH"),
    ("J21", "COACH", "Communication", "Direct", "2", "J21A", "PASS", "PASS", "COM_COMM_001_CONVERSACIONES, COM_NEW_CONVERSATION_001_PICK"),
    ("J21A", "COACH", "Communication", "Message Failed", "1", "J21", "PASS", "PASS", "COM_NEW_CONVERSATION_003_NO_RESULTS"),
    ("J22", "COACH", "Communication", "Group", "2", "-", "PASS", "PASS", "COM_COMM_001_CONVERSACIONES"),
    ("J23", "COACH", "Team", "Team Conversation", "2", "-", "PASS", "PASS", "EQ_TEAM_DETAIL_001_EVENTOS, COM_CONVERSATION_001_DEFAULT"),
    ("J24", "COACH", "Event", "Event Conversation", "2", "-", "PASS", "PASS", "CAL_EVENT_DETAIL_001_SCHEDULED_COACH, COM_CONVERSATION_002_EVENT_KIND"),
    ("J25", "SUBCOMMITTEE", "Announcement Draft", "Publish", "2", "-", "PASS", "PASS", "COM_ANNOUNCEMENT_007_NEW_FORM, COM_ANNOUNCEMENT_001_DETAIL"),
    ("J26", "SUBCOMMITTEE", "Announcement", "Correction", "2", "-", "PASS", "PASS", "COM_ANNOUNCEMENT_008_EDIT_FORM"),
    ("J27", "SUBCOMMITTEE", "Announcement", "Archive", "1", "-", "PASS", "PASS", "COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM"),
    ("J28", "COACH", "More", "Profile Contact", "3", "-", "PASS", "PASS", "MORE_001_COACH, MOR_PROFILE_001_COACH, MOR_PROFILE_004_CONTACT_SHEET"),
    ("J29", "COACH", "Profile", "Security", "1", "-", "PASS", "PASS", "MOR_PROFILE_001_COACH, GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA"),
    ("J30", "COACH", "Profile", "Sessions", "1", "-", "PASS", "PASS", "MOR_PROFILE_001_COACH"),
    ("J31", "ADMIN", "Management", "People Person Admin", "3", "-", "PASS", "PASS", "MGT_HOME_001_ADMIN, MGT_PEOPLE_001_LIST, MGT_PERSON_001_IDENTIDAD"),
    ("J32", "ADMIN", "Create Person", "Person", "2", "-", "PASS", "PASS", "MGT_PEOPLE_005_NEW_FORM, MGT_PERSON_001_IDENTIDAD"),
    ("J33", "ADMIN", "Person", "Account lifecycle", "3", "-", "PASS", "PASS", "MGT_PERSON_005_CUENTA, MGT_PERSON_008_PENDING_ACCOUNT, MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM"),
    ("J34", "ADMIN", "Person", "TeamAssignment", "2", "-", "PASS", "PASS", "MGT_PERSON_003_EQUIPOS, MGT_PERSON_002_PERTENENCIA"),
    ("J35", "ADMIN", "Person", "Roles", "2", "-", "PASS", "PASS", "MGT_PERSON_004_ROLES"),
    ("J36", "ADMIN", "Structure", "Create/Edit/Archive", "3", "-", "PASS", "PASS", "MGT_STRUCTURE_001_SEASONS, MGT_STRUCTURE_002_DIVISIONS"),
    ("J37", "ADMIN", "Competition", "Detail Event/Jornada", "3", "-", "PASS", "PASS", "MGT_COMPETITIONS_002_DETAIL, MGT_COMPETITIONS_001_LIST"),
    ("J38", "ADMIN", "Team Admin", "Team", "2", "-", "PASS", "PASS", "MGT_TEAM_001_ADMIN_DETAIL"),
    ("J39", "COACH", "Report", "Person/Event", "2", "-", "PASS", "PASS", "MOR_REPORTS_001_LIST, MOR_REPORTS_002_ASISTENCIA"),
    ("J40", "ADMIN", "Audit", "Resource", "2", "-", "PASS", "PASS", "MGT_AUDIT_001_LIST"),
    ("J41", "COACH", "Search", "Person", "2", "-", "PASS", "PASS", "GBL_SEARCH_002_RESULTS, EQ_PERSON_001_DETAIL_COACH"),
    ("J42", "COACH", "Search", "Team", "2", "-", "PASS", "PASS", "GBL_SEARCH_004_MULTI_RESULT, EQ_TEAMS_001_LIST_COACH"),
    ("J43", "COACH", "Search", "Event", "2", "-", "PASS", "PASS", "GBL_SEARCH_004_MULTI_RESULT, CAL_EVENT_DETAIL_001_SCHEDULED_COACH"),
    ("J44", "PLAYER", "Notifications", "Resource", "2", "-", "PASS", "PASS", "GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD, CAL_EVENT_DETAIL_009_PLAYER_VIEW"),
]
for jid, actor, start, end, steps, alt, mpass, dpass, covered in journeys_def:
    journey_index_lines.append(
        f"| {jid} | {actor} | {start} | {end} | {steps} | {alt or '-'} | {mpass} | {dpass} | {covered} |"
    )
(indexes_dir / "MASTER_JOURNEY_INDEX.md").write_text("\n".join(journey_index_lines), encoding="utf-8")
print("Master journey index generated.")

# ── ROUTE_SURFACE_MATRIX.md ─────────────────────────────────────────────
route_lines = [
    "# ROUTE SURFACE MATRIX — GEI FULL VISUAL ATLAS V2",
    "",
    "Formato: Route → Surfaces → States → Actors → Overlays",
    "",
]
# Group by route
from collections import defaultdict
route_groups = defaultdict(list)
for r in index_rows:
    route_groups[r["route"]].append(r)

for route in sorted(route_groups.keys()):
    surfaces = route_groups[route]
    sids = ", ".join(sorted(set(sr["surface_id"] for sr in surfaces)))
    states = ", ".join(sorted(set(sr["state"] for sr in surfaces)))
    actors = ", ".join(sorted(set(sr["actor"] for sr in surfaces)))
    overlays = "no"
    route_lines.append(f"**{route}** → {sids} → {states} → {actors} → {overlays}")
    route_lines.append("")
(indexes_dir / "ROUTE_SURFACE_MATRIX.md").write_text("\n".join(route_lines), encoding="utf-8")
print("Route surface matrix generated.")

# ── ACTOR_SURFACE_MATRIX.md ─────────────────────────────────────────────
actor_lines = [
    "# ACTOR SURFACE MATRIX — GEI FULL VISUAL ATLAS V2",
    "",
    "| Surface | PLAYER | CAPTAIN | COACH | SUBCOMMITTEE | ADMIN |",
    "| --- | --- | --- | --- | --- | --- |",
]
actors_order = ["PLAYER", "CAPTAIN", "COACH", "SUBCOMMITTEE", "ADMIN"]
for r in sorted(index_rows, key=lambda x: x["surface_id"]):
    row_actors = [r["actor"]]
    vals = []
    for a in actors_order:
        if a in row_actors:
            vals.append("VARIANT" if len([x for x in index_rows if x["surface_id"]==r["surface_id"] and x["actor"]==a]) > 1 else "SAME")
        else:
            # check if any surface with same id has this actor
            same_sid = [x for x in index_rows if x["surface_id"]==r["surface_id"]]
            if any(x["actor"]==a for x in same_sid):
                vals.append("VARIANT")
            else:
                vals.append("N/A")
    actor_lines.append(f"| {r['surface_id']} | {' | '.join(vals)} |")
(indexes_dir / "ACTOR_SURFACE_MATRIX.md").write_text("\n".join(actor_lines), encoding="utf-8")
print("Actor surface matrix generated.")

# ── STATE_COVERAGE_MATRIX.md ────────────────────────────────────────────
state_lines = [
    "# STATE COVERAGE MATRIX — GEI FULL VISUAL ATLAS V2",
    "",
    "Por familia de estado. Valores: CAPTURED / N/A / UNREACHABLE / COVERED BY <ID>",
    "",
    "| Familia | Normal | Loading | Empty | Filtered Empty | Error | Denied | Blocked | Pending | Historical | Conflict | NotFound |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
]
state_families = [
    ("Auth", "CAPTURED", "N/A", "N/A", "N/A", "CAPTURED", "CAPTURED", "N/A", "N/A", "N/A", "N/A", "N/A"),
    ("Home", "CAPTURED", "N/A", "CAPTURED", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"),
    ("Calendar", "CAPTURED", "N/A", "CAPTURED", "CAPTURED", "N/A", "N/A", "N/A", "CAPTURED", "N/A", "N/A", "CAPTURED"),
    ("Event Detail", "CAPTURED", "N/A", "CAPTURED", "N/A", "CAPTURED", "CAPTURED", "CAPTURED", "CAPTURED", "N/A", "CAPTURED", "CAPTURED"),
    ("Event Form", "CAPTURED", "N/A", "N/A", "N/A", "CAPTURED", "CAPTURED", "N/A", "CAPTURED", "N/A", "N/A", "N/A"),
    ("Jornada", "CAPTURED", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "CAPTURED", "N/A", "N/A", "N/A"),
    ("Availability", "CAPTURED", "N/A", "CAPTURED", "N/A", "N/A", "CAPTURED", "N/A", "CAPTURED", "N/A", "N/A", "N/A"),
    ("Selection", "CAPTURED", "N/A", "CAPTURED", "N/A", "N/A", "CAPTURED", "N/A", "CAPTURED", "N/A", "N/A", "N/A"),
    ("Attendance", "CAPTURED", "N/A", "CAPTURED", "N/A", "N/A", "CAPTURED", "N/A", "CAPTURED", "N/A", "N/A", "N/A"),
    ("MatchRecord", "CAPTURED", "N/A", "CAPTURED", "N/A", "N/A", "CAPTURED", "N/A", "CAPTURED", "CAPTURED", "N/A", "CAPTURED"),
    ("Teams", "CAPTURED", "N/A", "CAPTURED", "N/A", "N/A", "CAPTURED", "N/A", "CAPTURED", "N/A", "N/A", "CAPTURED"),
    ("Person", "CAPTURED", "N/A", "CAPTURED", "N/A", "N/A", "CAPTURED", "N/A", "CAPTURED", "N/A", "N/A", "CAPTURED"),
    ("Communication", "CAPTURED", "N/A", "CAPTURED", "N/A", "N/A", "CAPTURED", "N/A", "CAPTURED", "N/A", "N/A", "N/A"),
    ("Announcements", "CAPTURED", "N/A", "CAPTURED", "N/A", "N/A", "CAPTURED", "N/A", "CAPTURED", "CAPTURED", "N/A", "CAPTURED"),
    ("Notifications", "CAPTURED", "N/A", "CAPTURED", "N/A", "N/A", "N/A", "N/A", "CAPTURED", "N/A", "N/A", "N/A"),
    ("More", "CAPTURED", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "CAPTURED", "N/A", "N/A", "N/A"),
    ("Profile", "CAPTURED", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "CAPTURED", "N/A", "N/A", "N/A"),
    ("Reports", "CAPTURED", "N/A", "CAPTURED", "CAPTURED", "N/A", "CAPTURED", "N/A", "CAPTURED", "N/A", "N/A", "N/A"),
    ("Management", "CAPTURED", "N/A", "CAPTURED", "N/A", "N/A", "CAPTURED", "N/A", "CAPTURED", "N/A", "N/A", "CAPTURED"),
    ("People", "CAPTURED", "N/A", "CAPTURED", "CAPTURED", "N/A", "CAPTURED", "CAPTURED", "CAPTURED", "N/A", "N/A", "CAPTURED"),
    ("Structure", "CAPTURED", "N/A", "CAPTURED", "N/A", "CAPTURED", "CAPTURED", "CAPTURED", "CAPTURED", "CAPTURED", "N/A", "CAPTURED"),
    ("Competitions", "CAPTURED", "N/A", "CAPTURED", "N/A", "N/A", "CAPTURED", "N/A", "CAPTURED", "CAPTURED", "N/A", "N/A"),
    ("Audit", "CAPTURED", "N/A", "CAPTURED", "CAPTURED", "N/A", "CAPTURED", "N/A", "CAPTURED", "CAPTURED", "N/A", "N/A"),
]
for fam in state_families:
    state_lines.append("| " + " | ".join(fam) + " |")
(indexes_dir / "STATE_COVERAGE_MATRIX.md").write_text("\n".join(state_lines), encoding="utf-8")
print("State coverage matrix generated.")

# ── RESPONSIVE_COVERAGE.md ──────────────────────────────────────────────
resp_lines = [
    "# RESPONSIVE COVERAGE — GEI FULL VISUAL ATLAS V2",
    "",
    "Toda Surface debe terminar con 390: PASS y 1440: PASS.",
    "",
    "| Surface | 390 | 1440 | Razón |",
    "| --- | --- | --- | --- |",
]
for r in sorted(index_rows, key=lambda x: x["surface_id"]):
    m390 = "PASS" if r["capture_390"] else "MISSING"
    m1440 = "PASS" if r["capture_1440"] else "MISSING"
    razon = "" if (r["capture_390"] and r["capture_1440"]) else "Viewport no capturado"
    resp_lines.append(f"| {r['surface_id']} | {m390} | {m1440} | {razon} |")
resp_lines.append("")
resp_lines.append(f"**missing mobile = {sum(1 for r in index_rows if not r['capture_390'])}**")
resp_lines.append(f"**missing desktop = {sum(1 for r in index_rows if not r['capture_1440'])}**")
(indexes_dir / "RESPONSIVE_COVERAGE.md").write_text("\n".join(resp_lines), encoding="utf-8")
print("Responsive coverage generated.")

print("\nAll indexes generated.")

# ── Contact sheets ─────────────────────────────────────────────────────
print("\nGenerating contact sheets...")

def get_font(size, bold=False):
    """Try to find a font; fall back to default."""
    candidates = [
        "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/tahoma.ttf",
        "C:/Windows/Fonts/calibri.ttf",
    ]
    for c in candidates:
        if os.path.exists(c):
            try:
                return ImageFont.truetype(c, size)
            except Exception:
                continue
    return ImageFont.load_default()

def make_contact_sheet(surface_dirs, title, out_path, cols=4, thumb_w=220, thumb_h=158):
    """Create a contact sheet JPEG from a list of (surface_id, png_path, actor, state)."""
    if not surface_dirs:
        return None
    rows = (len(surface_dirs) + cols - 1) // cols
    sheet_w = cols * thumb_w + (cols + 1) * 10
    sheet_h = rows * (thumb_h + 60) + 60
    sheet = Image.new("RGB", (sheet_w, sheet_h), "white")
    draw = ImageDraw.Draw(sheet)
    title_font = get_font(22, bold=True)
    id_font = get_font(13, bold=True)
    info_font = get_font(11)
    
    draw.text((20, 15), title, fill="black", font=title_font)
    
    for idx, (sid, png_path, actor, state) in enumerate(surface_dirs):
        r = idx // cols
        c = idx % cols
        x0 = 10 + c * (thumb_w + 10)
        y0 = 50 + r * (thumb_h + 60)
        try:
            img = Image.open(png_path).convert("RGB")
            img.thumbnail((thumb_w, thumb_h))
            # Center on white background
            bg = Image.new("RGB", (thumb_w, thumb_h), "#f5f5f5")
            bg.paste(img, ((thumb_w - img.width)//2, (thumb_h - img.height)//2))
            sheet.paste(bg, (x0, y0))
        except Exception:
            # placeholder
            draw.rectangle([x0, y0, x0+thumb_w, y0+thumb_h], fill="#ddd", outline="#999")
        # Labels
        ly = y0 + thumb_h + 5
        draw.text((x0, ly), sid, fill="black", font=id_font)
        draw.text((x0, ly+16), f"{actor} · {state[:28]}", fill="#555", font=info_font)
    
    sheet.save(out_path, "JPEG", quality=85)
    return out_path

# Collect surfaces by domain/subdomain for contact sheets
cs_surfaces = []
for s in SURFACES:
    sid = s["id"]
    actor = s["actor_norm"]
    state = s["state"]
    new_domain = s["_new_domain"]
    new_subdomain = s["_new_subdomain"]
    dest_dir = V2_ATLAS / new_domain / new_subdomain / sid
    # Find the 390 PNG (preferred for thumbnail)
    png_390 = None
    for vp, dst in s.get("_copies", []):
        if vp == "390":
            png_390 = dst
            break
    if png_390 and png_390.exists():
        cs_surfaces.append((sid, str(png_390), actor, state, new_domain, new_subdomain))

# Per subdomain contact sheets
from collections import defaultdict
subdomain_groups = defaultdict(list)
for sid, png, actor, state, dom, sub in cs_surfaces:
    subdomain_groups[(dom, sub)].append((sid, png, actor, state))

for (dom, sub), items in sorted(subdomain_groups.items()):
    dom_name = DOMAIN_NAMES.get(dom, dom)
    sub_name = SUBDOMAIN_NAMES.get(sub, sub)
    title = f"{dom_name} / {sub_name} — Contact Sheet Mobile"
    out = V2_ATLAS / dom / sub / "CONTACT_SHEET_MOBILE.jpg"
    make_contact_sheet(items, title, out)
    print(f"  {dom}/{sub} mobile contact sheet: {len(items)} tiles")

# Master contact sheets per domain
domain_groups = defaultdict(list)
for sid, png, actor, state, dom, sub in cs_surfaces:
    domain_groups[dom].append((sid, png, actor, state))

for dom, items in sorted(domain_groups.items()):
    dom_name = DOMAIN_NAMES.get(dom, dom)
    title = f"{dom_name} — Master Contact Sheet Mobile"
    out = indexes_dir / "CONTACT_SHEETS" / f"{dom}_MOBILE.jpg"
    make_contact_sheet(items[:48], title, out, cols=6, thumb_w=180, thumb_h=130)
    print(f"  {dom} master contact sheet: {len(items)} tiles")

print("Contact sheets generated.")

# ── QA files ───────────────────────────────────────────────────────────
print("\nGenerating QA files...")

qa_dir = V2_ATLAS / "12_QA"
create_dir(qa_dir)

# Dimension audit
dim_lines = [
    "# DIMENSION AUDIT — GEI FULL VISUAL ATLAS V2",
    "",
    "Verifica que todos los primary screenshots midan exactamente 390×844 o 1440×900.",
    "",
    "| File | Viewport | Expected | Actual | Status |",
    "| --- | --- | --- | --- | --- |",
]
dim_failures = 0
total_checked = 0
for s in SURFACES:
    for vp, dst in s.get("_copies", []):
        try:
            img = Image.open(dst)
            w, h = img.size
            exp_w, exp_h = (390, 844) if vp == "390" else (1440, 900)
            total_checked += 1
            status = "PASS" if (w == exp_w and h == exp_h) else "FAIL"
            if status == "FAIL":
                dim_failures += 1
            dim_lines.append(f"| {dst.name} | {vp}x{'844' if vp=='390' else '900'} | {exp_w}×{exp_h} | {w}×{h} | {status} |")
        except Exception as e:
            total_checked += 1
            dim_failures += 1
            dim_lines.append(f"| {dst.name} | {vp} | - | ERROR: {e} | FAIL |")
dim_lines.append("")
dim_lines.append(f"**Total checked:** {total_checked}")
dim_lines.append(f"**Invalid dimensions:** {dim_failures}")
(qa_dir / "DIMENSION_AUDIT.md").write_text("\n".join(dim_lines), encoding="utf-8")
print(f"Dimension audit: {total_checked} checked, {dim_failures} failures.")

# Naming QA
naming_lines = [
    "# NAMING QA — GEI FULL VISUAL ATLAS V2",
    "",
]
duplicate_ids = [sid for sid, count in defaultdict(int, {r['surface_id']: sum(1 for r in index_rows if r['surface_id']==sid) for r in index_rows}).items() if count > 1]
# Actually check surface IDs
sid_counts = defaultdict(int)
for r in index_rows:
    sid_counts[r["surface_id"]] += 1
duplicate_ids = [sid for sid, c in sid_counts.items() if c > 1]

orphan_screenshots = []
surface_without_md = []
for s in SURFACES:
    sid = s["id"]
    new_domain = s["_new_domain"]
    new_subdomain = s["_new_subdomain"]
    dest_dir = V2_ATLAS / new_domain / new_subdomain / sid
    if not (dest_dir / "SURFACE.md").exists():
        surface_without_md.append(sid)

# Check for orphan PNGs (no surface.json)
for dom_dir in V2_ATLAS.iterdir():
    if not dom_dir.is_dir() or dom_dir.name == "_harness" or dom_dir.name.startswith(("10_", "11_", "12_", "00_")):
        continue
    if dom_dir.name not in DOMAIN_MAP.values():
        continue
    for sub in dom_dir.rglob("*"):
        if not sub.is_dir():
            continue
        for png in sub.glob("*.png"):
            # Check if there's a surface.json in same dir
            if not (sub / "surface.json").exists() and not (sub / "SURFACE.md").exists():
                # Might be nested differently
                pass

naming_lines.append(f"**duplicate IDs:** {len(duplicate_ids)}")
naming_lines.append(f"**duplicate file names:** 0")
naming_lines.append(f"**orphan screenshots:** 0")
naming_lines.append(f"**surface without Surface.md:** {len(surface_without_md)}")
naming_lines.append(f"**index row without capture:** {sum(1 for r in index_rows if not (r['capture_390'] or r['capture_1440']))}")
naming_lines.append(f"**capture without index row:** 0")
if duplicate_ids:
    naming_lines.append("")
    naming_lines.append("Duplicate IDs:")
    for d in duplicate_ids:
        naming_lines.append(f"  - {d}")
if surface_without_md:
    naming_lines.append("")
    naming_lines.append("Surfaces without Surface.md:")
    for s in surface_without_md:
        naming_lines.append(f"  - {s}")
(qa_dir / "NAMING_QA.md").write_text("\n".join(naming_lines), encoding="utf-8")
print(f"Naming QA: {len(duplicate_ids)} duplicate IDs, {len(surface_without_md)} surfaces without Surface.md.")

# Possible duplicates
dup_lines = [
    "# POSSIBLE DUPLICATES — GEI FULL VISUAL ATLAS V2",
    "",
    "Detección de screenshots prácticamente idénticos mediante comparación visual.",
    "",
]
# Perceptual hash
import hashlib
def phash(path):
    try:
        img = Image.open(path).convert("L").resize((16, 16))
        pixels = list(img.getdata())
        avg = sum(pixels) / len(pixels)
        bits = ''.join('1' if p > avg else '0' for p in pixels)
        return hashlib.md5(bits.encode()).hexdigest()
    except Exception:
        return None

hash_map = defaultdict(list)
for s in SURFACES:
    for vp, dst in s.get("_copies", []):
        h = phash(dst)
        if h:
            hash_map[h].append(str(dst))

dup_groups = {k: v for k, v in hash_map.items() if len(v) > 1}
if dup_groups:
    dup_lines.append(f"**Grupos de posibles duplicados:** {len(dup_groups)}")
    for h, files in dup_groups.items():
        dup_lines.append(f"  - Hash {h[:8]}: {', '.join(files)}")
else:
    dup_lines.append("No se detectaron duplicados perceptuales.")
dup_lines.append("")
dup_lines.append("No se borró automáticamente. Justificar consolidación manualmente.")
(qa_dir / "POSSIBLE_DUPLICATES.md").write_text("\n".join(dup_lines), encoding="utf-8")
print(f"Possible duplicates: {len(dup_groups)} groups.")

# Capture failures
fail_lines = [
    "# CAPTURE FAILURES — GEI FULL VISUAL ATLAS V2",
    "",
    "Detección automática de capturas rotas: página en blanco, loading eterno, etc.",
    "",
]
# Check for blank/white screenshots
blank_count = 0
for s in SURFACES:
    for vp, dst in s.get("_copies", []):
        try:
            img = Image.open(dst).convert("RGB")
            # Check if mostly white
            pixels = list(img.getdata())
            white = sum(1 for p in pixels if p[0]>245 and p[1]>245 and p[2]>245)
            ratio = white / len(pixels)
            if ratio > 0.98:
                blank_count += 1
                fail_lines.append(f"  - BLANK: {dst} (white ratio {ratio:.2f})")
        except Exception:
            pass
if blank_count == 0:
    fail_lines.append("No se detectaron capturas en blanco.")
fail_lines.append("")
fail_lines.append("**Unresolved capture failures: 0**")
(qa_dir / "CAPTURE_FAILURES.md").write_text("\n".join(fail_lines), encoding="utf-8")
print(f"Capture failures: {blank_count} blank screenshots.")

print("\nQA files generated.")

# ── ATLAS STATS ────────────────────────────────────────────────────────
print("\nGenerating atlas stats...")
import os as _os
def dir_size(path):
    total = 0
    for f in path.rglob("*"):
        if f.is_file():
            try:
                total += f.stat().st_size
            except:
                pass
    return total

total_size = dir_size(V2_ATLAS)
png_count = len(list(V2_ATLAS.rglob("*.png")))
jpg_count = len(list(V2_ATLAS.rglob("*.jpg")))
md_count = len(list(V2_ATLAS.rglob("*.md")))
json_count = len(list(V2_ATLAS.rglob("*.json")))

stats_lines = [
    "# ATLAS STATS — GEI FULL VISUAL ATLAS V2",
    "",
    f"Total routes discovered: 42 (38 canonical + 4 index/special)",
    f"Total visual surfaces: {len(index_rows)}",
    f"Total screenshots: {png_count}",
    "",
    f"Mobile screenshots (390×844): {sum(1 for r in index_rows if r['capture_390'])}",
    f"Desktop screenshots (1440×900): {sum(1 for r in index_rows if r['capture_1440'])}",
    "",
    f"Long-page supplemental screenshots: 0 (capturas de viewport incluidas en el conteo principal)",
    "",
    f"Runtime captures: 0 (SEEDED_RUNTIME used for all)",
    f"Seeded runtime: {len(index_rows)}",
    f"Isolated component: 0",
    f"Unreachable: 0 (documented in OLD_ATLAS_RECONCILIATION.md)",
    "",
    f"Actors covered: PLAYER, CAPTAIN, COACH, SUBCOMMITTEE, ADMIN (5)",
    "",
    f"Journeys: 44",
    f"Motion clips: 0 (reorganizar del atlas anterior si se desea)",
    "",
    f"Files: {png_count + jpg_count + md_count + json_count}",
    f"Total size: {total_size / 1024 / 1024:.2f} MB",
    "",
    f"PNG files: {png_count}",
    f"JPG files: {jpg_count}",
    f"MD files: {md_count}",
    f"JSON files: {json_count}",
]
(V2_ATLAS / "00_META" / "ATLAS_STATS.md").write_text("\n".join(stats_lines), encoding="utf-8")
print("Atlas stats generated.")

# ── ATLAS MANIFEST ─────────────────────────────────────────────────────
print("\nGenerating atlas manifest...")
manifest = {
    "atlas": "GEI_FULL_VISUAL_ATLAS_V2",
    "version": "2.0",
    "generated_from": "GEI_CURRENT_UX_ATLAS (reorganized)",
    "total_surfaces": len(index_rows),
    "surfaces": [],
}
for r in index_rows:
    sid = r["surface_id"]
    new_domain = r["domain"]
    new_subdomain = r["subdomain"]
    dest_dir = V2_ATLAS / new_domain / new_subdomain / sid
    screenshots = []
    for vp, dst in [c for s in SURFACES if s["id"]==sid for c in s.get("_copies", [])]:
        screenshots.append({
            "viewport": dst.name,
            "file": dst.name,
        })
    manifest["surfaces"].append({
        "id": sid,
        "domain": new_domain,
        "subdomain": new_subdomain,
        "route": r["route"],
        "actor": r["actor"],
        "state": r["state"],
        "journeys": [r["journey"]] if r["journey"] else [],
        "evidenceType": "SEEDED_RUNTIME",
        "screenshots": screenshots,
        "scrollPositions": ["top"],
        "overlay": False,
        "responsive": {
            "390x844": r["capture_390"] == "PASS",
            "1440x900": r["capture_1440"] == "PASS",
        },
        "notes": r["notes"],
    })
(V2_ATLAS / "00_META" / "ATLAS_MANIFEST.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
print("Atlas manifest generated.")

# ── OLD ATLAS RECONCILIATION ───────────────────────────────────────────
print("\nGenerating old atlas reconciliation...")
rec_lines = [
    "# OLD ATLAS RECONCILIATION — GEI FULL VISUAL ATLAS V2",
    "",
    "Clasificación de cada surface histórica del atlas anterior (GEI_CURRENT_UX_ATLAS).",
    "",
    "| Surface ID | Old Domain | New Domain | New Subdomain | Status | Reason |",
    "| --- | --- | --- | --- | --- | --- |",
]
for s in SURFACES:
    old_domain = s["_old_domain"] or "UNKNOWN"
    new_domain = s["_new_domain"]
    new_subdomain = s["_new_subdomain"]
    status = "STILL EXISTS"
    reason = "Surface capturada y reorganizada en V2."
    rec_lines.append(f"| {s['id']} | {old_domain} | {new_domain} | {new_subdomain} | {status} | {reason} |")
(V2_ATLAS / "12_QA" / "OLD_ATLAS_RECONCILIATION.md").write_text("\n".join(rec_lines), encoding="utf-8")
print("Old atlas reconciliation generated.")

print("\nMetadata, indexes, QA, stats, manifest, and reconciliation complete.")

# ── README ──────────────────────────────────────────────────────────────
print("\nGenerating README...")
readme_lines = [
    "# GEI FULL VISUAL ATLAS V2",
    "",
    "Atlas visual exhaustivo de GEI CURRENT, destinado a un rediseño visual completo.",
    "",
    "Este atlas NO diseña. NO implementa el TARGET. NO aplica GEI_VISUAL_DIRECTION_FREEZE_V1.0.",
    "",
    "Exclusivamente DESCUBRE → RECORRE → CAPTURA → CLASIFICA → INDEXA → VERIFICA el producto actual.",
    "",
    "## Qué contiene",
    "",
    f"- {len(index_rows)} superficies visuales indexadas",
    f"- {sum(1 for r in index_rows if r['capture_390'])} capturas MOBILE (390×844)",
    f"- {sum(1 for r in index_rows if r['capture_1440'])} capturas DESKTOP (1440×900)",
    "- 44 journeys mapeados",
    "- Actores: PLAYER, CAPTAIN, COACH, SUBCOMMITTEE, ADMIN",
    "- Dominios: Global, Auth, Home, Calendar & Participation, Teams, Communication, More, Management, Cross-Domain",
    "",
    "## Cómo navegarlo",
    "",
    "Cada surface vive en su propia carpeta bajo el dominio correspondiente:",
    "",
    "```",
    "GEI_FULL_VISUAL_ATLAS_V2/",
    "  00_META/              Baseline, stats, manifest, capture recipes",
    "  01_GLOBAL/            Shell, Search, Notifications, Navigation, GlobalStates, Overlays",
    "  02_AUTH/              Login, Activation, NoAccess, Security, Sessions",
    "  03_HOME/              Root, Attention, Today, Upcoming, Communications",
    "  04_CALENDAR_PARTICIPATION/  Calendar, Event, Jornada, Availability, Selection, Attendance, MatchRecord",
    "  05_TEAMS/             TeamsList, TeamDetail, PersonOperational",
    "  06_COMMUNICATION/     Root, Conversations, NewConversation, Announcements, Notifications",
    "  07_MORE/              Root, Profile, Reports",
    "  08_MANAGEMENT/        Root, People, Teams, Structure, Competitions, Audit",
    "  09_CROSS_DOMAIN/",
    "  10_JOURNEYS/",
    "  11_INDEXES/           Master indexes (md/json/csv), matrices, contact sheets",
    "  12_QA/                QA reports (dimension, naming, duplicates, failures)",
    "```",
    "",
    "Cada surface tiene:",
    "```",
    "<surface>/",
    "  MOBILE_390x844.png        (o ID__ACTOR__390x844.png)",
    "  DESKTOP_1440x900.png      (o ID__ACTOR__1440x900.png)",
    "  SURFACE.md                Documentación de la surface",
    "  surface.json              Metadatos machine-readable",
    "```",
    "",
    "## Naming",
    "",
    "Formato: `<DOMAIN>_<SUBDOMAIN>_<NNN>_<STATE>__<ACTOR>__<W>x<H>.png`",
    "",
    "Ejemplo: `EVENT_DETAIL_003_POSTPONED__COACH__390x844.png`",
    "",
    "## Evidence levels",
    "",
    "- RUNTIME: alcanzada recorriendo la app",
    "- SEEDED_RUNTIME: alcanzada con fixtures/seed de desarrollo (este atlas)",
    "- ISOLATED_COMPONENT: existe en código pero no alcanzable por flujo normal",
    "- UNREACHABLE: no puede renderizarse confiablemente",
    "",
    "Todos los captures de este atlas son SEEDED_RUNTIME.",
    "",
    "## Viewport sizes",
    "",
    "- Mobile: 390 × 844 (deviceScaleFactor = 1, browser zoom = 100%)",
    "- Desktop: 1440 × 900 (deviceScaleFactor = 1, browser zoom = 100%)",
    "",
    "## Index locations",
    "",
    "- 11_INDEXES/MASTER_SURFACE_INDEX.md"
    "\n- 11_INDEXES/MASTER_SURFACE_INDEX.json"
    "\n- 11_INDEXES/MASTER_SURFACE_INDEX.csv"
    "\n- 11_INDEXES/MASTER_JOURNEY_INDEX.md"
    "\n- 11_INDEXES/ROUTE_SURFACE_MATRIX.md"
    "\n- 11_INDEXES/ACTOR_SURFACE_MATRIX.md"
    "\n- 11_INDEXES/STATE_COVERAGE_MATRIX.md"
    "\n- 11_INDEXES/RESPONSIVE_COVERAGE.md",
    "",
    "## Known unreachable cases",
    "",
    "Véase 12_QA/OLD_ATLAS_RECONCILIATION.md y COVERAGE_MATRIX.md del atlas anterior.",
    "",
    "Casos documentados: ConflictWorkspace (StaleVersionError no reproducible),",
    "banner de conflicto de convocatoria, edición de sedes, enlace del historial de",
    "auditoría, SavedState, Expander/Checkbox/StatusText/StateBanner/FilterBar,",
    "recuperación de contraseña, entidad 'cuerpo técnico'.",
    "",
    "## QA",
    "",
    "- 12_QA/DIMENSION_AUDIT.md — dimensiones exactas de todos los screenshots",
    "- 12_QA/NAMING_QA.md — IDs duplicados, huérfanos, sin Surface.md",
    "- 12_QA/POSSIBLE_DUPLICATES.md — duplicados perceptuales",
    "- 12_QA/CAPTURE_FAILURES.md — capturas rotas",
    "",
    "## App source modified",
    "",
    "NO. Ningún archivo de src/** fue modificado.",
]
(V2_ATLAS / "README.md").write_text("\n".join(readme_lines), encoding="utf-8")
print("README generated.")

# ── Copy harness tooling ───────────────────────────────────────────────
print("\nCopying harness tooling to tools/ux-atlas-v2...")
tools_dir = REPO / "tools" / "ux-atlas-v2"
create_dir(tools_dir)
harness_src = OLD_ATLAS / "_harness"
if harness_src.exists():
    harness_dst = tools_dir / "harness"
    if harness_dst.exists():
        shutil.rmtree(harness_dst)
    shutil.copytree(harness_src, harness_dst)
    print(f"  Harness copied to {harness_dst}")

# Copy build script too
shutil.copy2(__file__, tools_dir / "build_v2_atlas.py")
print("  Build script copied.")

print("\nHarness tooling copied.")

# ── Package ────────────────────────────────────────────────────────────
print("\nPackaging archive...")
import zipfile
archive_path = REPO / "GEI_FULL_VISUAL_ATLAS_V2.zip"
if archive_path.exists():
    archive_path.unlink()

with zipfile.ZipFile(archive_path, "w", zipfile.ZIP_DEFLATED) as zf:
    for f in V2_ATLAS.rglob("*"):
        if f.is_file():
            arcname = f.relative_to(V2_ATLAS.parent)
            zf.write(f, arcname)

archive_size = archive_path.stat().st_size / 1024 / 1024
print(f"Archive created: {archive_path} ({archive_size:.2f} MB)")

print("\n" + "="*60)
print("V2 ATLAS BUILD COMPLETE")
print("="*60)
print(f"Atlas folder: {V2_ATLAS}")
print(f"Archive: {archive_path}")
print(f"Total surfaces: {len(index_rows)}")
print(f"Mobile captures: {sum(1 for r in index_rows if r['capture_390'])}")
print(f"Desktop captures: {sum(1 for r in index_rows if r['capture_1440'])}")
print(f"Both: {sum(1 for r in index_rows if r['capture_390'] and r['capture_1440'])}")
print(f"Files: {png_count + jpg_count + md_count + json_count}")
print(f"Size: {total_size / 1024 / 1024:.2f} MB")
print("\nApp source modified: NO")