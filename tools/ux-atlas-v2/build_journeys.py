import json
from collections import defaultdict
from pathlib import Path

ATLAS = Path(r"C:\Users\thega\Desktop\Gei-Hockey-Managment-System\GEI_FULL_VISUAL_ATLAS_V2")
JOURNEYS = ATLAS / "10_JOURNEYS"
INDEXES = ATLAS / "11_INDEXES"

# ── destination surface for each cross-domain shared-pattern surface ────
XD_DESTINATION = {
    "XD_CALENDAR_001_TO_EVENT": "CAL_EVENT_DETAIL_001_SCHEDULED_COACH",
    "XD_COMPETITION_001_TO_JORNADA": "CAL_JORNADA_003_READ_ONLY",
    "XD_EVENT_001_TO_CONVERSATION": "COM_CONVERSATION_001_DEFAULT",
    "XD_HOME_001_TO_EVENT": "CAL_EVENT_DETAIL_005_IN_PROGRESS",
    "XD_NOTIF_001_TO_EVENT": "COM_ANNOUNCEMENT_001_DETAIL",
    "XD_REPORT_001_TO_ATTENDANCE": "PRT_ATTENDANCE_001_OPEN",
    "XD_SEARCH_001_TO_PERSON": "EQ_PERSON_001_DETAIL_COACH",
    "XD_SEARCH_002_TO_TEAM": "EQ_TEAM_DETAIL_001_EVENTOS",
    "XD_SEARCH_003_TO_EVENT": "CAL_EVENT_DETAIL_001_SCHEDULED_COACH",
    "XD_TEAM_001_TO_EVENT": "CAL_EVENT_DETAIL_001_SCHEDULED_COACH",
}

inv = {}
for sj in sorted(ATLAS.rglob("surface.json")):
    d = json.loads(sj.read_text(encoding="utf-8"))
    inv[d["id"]] = {
        "dir": sj.parent,
        "domain": d["domain"],
        "subdomain": d["subdomain"],
        "route": d["route"],
        "actor": d["actor"],
        "state": d["state"],
        "viewports": d.get("viewports", {}),
        "pngs": sorted(p.name for p in sj.parent.glob("*.png")),
        "journeys": list(d.get("journeys") or []),
    }

# ── journey metadata from the existing index (authoritative for the flow) ─
meta = {}
for line in (INDEXES / "MASTER_JOURNEY_INDEX.md").read_text(encoding="utf-8").split("\n"):
    if not line.startswith("| J"):
        continue
    cells = [c.strip() for c in line.strip().strip("|").split("|")]
    if len(cells) < 9 or cells[0] == "Journey ID":
        continue
    meta[cells[0]] = {
        "id": cells[0], "actor": cells[1], "start": cells[2], "end": cells[3],
        "steps": cells[4], "alt": cells[5],
    }

# ── reconcile: per-surface journey assignment is authoritative ──────────
assigned = defaultdict(set)
for sid, s in inv.items():
    for j in s["journeys"]:
        assigned[j].add(sid)

# cross-domain surfaces inherit the journey of their destination surface
xd_assigned = []
for xd, dest in XD_DESTINATION.items():
    dst_journeys = inv[dest]["journeys"]
    if not dst_journeys:
        raise SystemExit(f"destino sin journey: {dest}")
    j = dst_journeys[0]
    assigned[j].add(xd)
    inv[xd]["journeys"] = [j]
    xd_assigned.append((xd, dest, j))

# ── regenerate MASTER_JOURNEY_INDEX.md ──────────────────────────────────
def actor_of(j):
    if j in meta and meta[j]["actor"] not in ("", "-"):
        return meta[j]["actor"]
    actors = {inv[s]["actor"] for s in assigned[j]}
    return ", ".join(sorted(actors)) if actors else "—"


def covered_status(j):
    sids = assigned[j]
    m = sum(1 for s in sids if inv[s]["viewports"].get("390x844", {}).get("status") == "CAPTURED")
    d = sum(1 for s in sids if inv[s]["viewports"].get("1440x900", {}).get("status") == "CAPTURED")
    return m, d


lines = [
    "# MASTER JOURNEY INDEX — GEI FULL VISUAL ATLAS V2",
    "",
    "Índice maestro de journeys. La asignación journey → superficies se reconstruye desde la",
    "propiedad `journeys` de cada `surface.json`, que es la fuente autoritativa.",
    "Las superficies `XD_*` (patrones compartidos) heredan el journey de su superficie destino.",
    "",
    f"**Journeys indexados:** {len(meta)}",
    f"**Superfices cubiertas por journeys:** {len(set().union(*assigned.values()) if assigned else set())}",
    "",
    "| Journey ID | Actor | Start | End | Steps | Alternate paths | Mobile CAPTURED | Desktop CAPTURED | Covered surfaces |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
]
for j in sorted(meta, key=lambda x: (int(x[1:].rstrip("AB")), x)):
    m = meta[j]
    sids = sorted(assigned.get(j, set()))
    cm, cd = covered_status(j)
    lines.append(
        f"| {j} | {actor_of(j)} | {m['start']} | {m['end']} | {m['steps']} | {m['alt']} | "
        f"{cm}/{len(sids)} | {cd}/{len(sids)} | {', '.join(sids)} |"
    )
(INDEXES / "MASTER_JOURNEY_INDEX.md").write_text("\n".join(lines), encoding="utf-8")

# persist the reconciled journey assignment back into each surface.json
for sid, s in inv.items():
    sj = s["dir"] / "surface.json"
    d = json.loads(sj.read_text(encoding="utf-8"))
    d["journeys"] = sorted([j for j, ss in assigned.items() if sid in ss])
    d["journey_reconciled"] = True
    sj.write_text(json.dumps(d, indent=2, ensure_ascii=False), encoding="utf-8")

# ── regenerate 10_JOURNEYS/ ─────────────────────────────────────────────
for j in sorted(meta, key=lambda x: (int(x[1:].rstrip("AB")), x)):
    sids = sorted(assigned.get(j, set()))
    jd = JOURNEYS / j
    jd.mkdir(parents=True, exist_ok=True)
    m = meta[j]
    L = [
        f"# JOURNEY {j} — {m['start']} → {m['end']}",
        "",
        f"**Actor:** {actor_of(j)}",
        f"**Inicio:** {m['start']}",
        f"**Fin:** {m['end']}",
        f"**Pasos:** {m['steps']}",
        f"**Rutas alternativas:** {m['alt']}",
        "",
        "## Superficies cubiertas",
        "",
        "| # | Surface ID | Dominio | Ruta | Estado | Actor | 390×844 | 1440×900 |",
        "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ]
    for i, sid in enumerate(sids, 1):
        s = inv[sid]
        c390 = "CAPTURED" if s["viewports"].get("390x844", {}).get("status") == "CAPTURED" else "N/A"
        c1440 = "CAPTURED" if s["viewports"].get("1440x900", {}).get("status") == "CAPTURED" else "N/A"
        L.append(
            f"| {i} | `{sid}` | {s['domain']} | `{s['route']}` | {s['state']} | {s['actor']} | {c390} | {c1440} |"
        )
    L += ["", "## Capturas", ""]
    for i, sid in enumerate(sids, 1):
        s = inv[sid]
        L.append(f"### {i}. `{sid}`")
        L.append("")
        rel = s["dir"].relative_to(ATLAS).as_posix()
        for vkey, vname in (("390x844", "390×844"), ("1440x900", "1440×900")):
            v = s["viewports"].get(vkey, {})
            if v.get("status") == "CAPTURED":
                L.append(f"- **{vname}:** CAPTURED — `{rel}/{v['file']}`")
            else:
                L.append(f"- **{vname}:** N/A — CURRENT does not render this surface at this viewport")
                L.append(f"  - reason: {v.get('reason', '')}")
                L.append(f"  - alternate surface/route: {v.get('alternate_surface_or_route', '')}")
        L.append("")
    L += [
        "## Índice del atlas",
        "",
        "- 11_INDEXES/MASTER_JOURNEY_INDEX.md",
        "- 11_INDEXES/MASTER_SURFACE_INDEX.md",
        "- 11_INDEXES/ROUTE_SURFACE_MATRIX.md",
        "",
    ]
    (jd / "JOURNEY.md").write_text("\n".join(L), encoding="utf-8")

# remove stale journey folders that are no longer part of the index
for d in JOURNEYS.iterdir():
    if d.is_dir() and d.name not in meta:
        for f in d.iterdir():
            f.unlink()
        d.rmdir()

all_ref = set().union(*assigned.values()) if assigned else set()
print(f"journeys in index      : {len(meta)}")
print(f"journeys with surfaces : {len(assigned)}")
print(f"surfaces referenced    : {len(all_ref)} / {len(inv)}")
print(f"unreferenced           : {sorted(set(inv) - all_ref)}")
print(f"XD assigned            : {len(xd_assigned)}")
for xd, dest, j in xd_assigned:
    print(f"   {xd:32s} -> {dest:34s} -> {j}")
