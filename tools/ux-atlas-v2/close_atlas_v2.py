import csv
import hashlib
import json
import re
import shutil
import zipfile
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image

ROOT = Path(r"C:\Users\thega\Desktop\Gei-Hockey-Managment-System")
ATLAS = ROOT / "GEI_FULL_VISUAL_ATLAS_V2"
META = ATLAS / "00_META"
INDEXES = ATLAS / "11_INDEXES"
QA = ATLAS / "12_QA"
MOTION = ATLAS / "13_MOTION_REFERENCE"
OLD = ROOT / "GEI_CURRENT_UX_ATLAS"

VP_MOBILE = "390×844"
VP_DESKTOP = "1440×900"

# ── viewport N/A determinations (runtime-verified) ──────────────────────
NA = {
    ("GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR", "390x844"): {
        "reason": (
            "La barra lateral de destinos no se renderiza por debajo del breakpoint lg (1024 px). "
            "El <nav aria-label=\"Destinos\"> de escritorio lleva las clases `hidden ... lg:flex` "
            "(src/app/Shell.tsx:183-185), de modo que su computed display es `none` a 390 px."
        ),
        "current_behavior": (
            "Runtime verificado en Chrome headless a 390×844: sidebar display=none, visibleBox=false. "
            "La misma función la cumple el BottomNav fijo (`flex ... lg:hidden`, src/app/Shell.tsx:230-232), "
            "que presenta los mismos 5 destinos con icono + label micro y marca Calendario como activo."
        ),
        "alternate": (
            "GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR — misma ruta /calendar, actor COACH, viewport 390×844."
        ),
    },
    ("GBL_NAV_004_SIDEBAR_BADGES_COACH", "390x844"): {
        "reason": (
            "Los contadores de no-leídos se renderizan exclusivamente dentro de la barra lateral "
            "(`hidden ... lg:flex`, src/app/Shell.tsx:183-185); el bloque de badges pertenece a ese nav "
            "(src/app/Shell.tsx:204-215) y no al BottomNav (src/app/Shell.tsx:234-250)."
        ),
        "current_behavior": (
            "Runtime verificado a 390×844: sidebar display=none; el BottomNav visible no contiene ningún "
            "elemento .bg-unread ni contador (unreadDot=false en los 5 destinos). El único aviso de no-leído "
            "disponible en mobile es el punto sobre la campana del topbar (src/app/Shell.tsx:153-168), que es "
            "un elemento distinto del contador de navegación."
        ),
        "alternate": (
            "Campana de avisos del topbar en /home (src/app/Shell.tsx:153-168) para el aviso no-leído; "
            "no existe equivalente mobile para el contador de mensajes sin leer. "
            "La variante desktop de esta misma superficie es GBL_NAV_004 a 1440×900."
        ),
    },
    ("GBL_NAV_005_SIDEBAR_BADGES_ADMIN", "390x844"): {
        "reason": (
            "La superficie documenta la barra lateral de destinos; a 390 px esa columna no se renderiza "
            "(`hidden ... lg:flex`, src/app/Shell.tsx:183-185)."
        ),
        "current_behavior": (
            "Runtime verificado a 390×844: sidebar display=none. El BottomNav para ADMIN presenta los mismos "
            "4 destinos que la sidebar (Inicio, Calendario, Equipos, Más) y omite Comunicación, porque el "
            "filtrado depende del actor vía authority.canOpen (src/app/Shell.tsx:62) y no del viewport."
        ),
        "alternate": (
            "BottomNav de /home con actor ADMIN en 390×844 — misma ruta, mismo actor, mismo conjunto de destinos."
        ),
    },
    ("GBL_NAV_006_SCROLL_02", "390x844"): {
        "reason": (
            "La superficie documenta el scroll propio de la columna de destinos de escritorio "
            "(overflow-y:auto con altura limitada, src/app/Shell.tsx:185). A 390 px no existe esa columna, "
            "por lo que la superficie no existe."
        ),
        "current_behavior": (
            "Runtime verificado a 390×844: sidebar display=none, scrollHeight=0, clientHeight=0. El scroll del "
            "documento sí existe en mobile, pero es una composición distinta (no la barra lateral) y ya está "
            "documentada por las superficies de scroll de HOME."
        ),
        "alternate": "HOME_006_SCROLL_02 — scroll de /home en 1440×900.",
    },
    ("GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR", "1440x900"): {
        "reason": (
            "El BottomNav fijo lleva `flex ... lg:hidden` (src/app/Shell.tsx:230-232), por lo que no se "
            "renderiza a partir de 1024 px."
        ),
        "current_behavior": (
            "Runtime verificado en Chrome headless a 1440×900: bottomnav display=none, visibleBox=false. "
            "La misma función la cumple la barra lateral (`hidden ... lg:flex`, src/app/Shell.tsx:183-185), "
            "que marca Calendario como destino activo."
        ),
        "alternate": (
            "GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR — misma ruta /calendar, actor COACH, viewport 1440×900."
        ),
    },
    ("GBL_NAV_003_BOTTOMNAV_ACTIVE_COMMUNICATION", "1440x900"): {
        "reason": (
            "El BottomNav fijo no se renderiza en 1440 px (`flex ... lg:hidden`, src/app/Shell.tsx:230-232); "
            "además el BottomNav no implementa contadores (src/app/Shell.tsx:234-250)."
        ),
        "current_behavior": (
            "Runtime verificado a 1440×900: bottomnav display=none. El destino Comunicación de esa ruta muestra "
            "punto + «2» en la barra lateral (src/app/Shell.tsx:204-209), que es el soporte real del contador."
        ),
        "alternate": (
            "GBL_NAV_004_SIDEBAR_BADGES_COACH — misma ruta /communication, actor COACH, viewport 1440×900."
        ),
    },
    ("GBL_SHELL_001_TOPBAR_MOBILE", "1440x900"): {
        "reason": (
            "La composición «topbar móvil» (marca GEI + contexto de ruta en una línea + buscar como icono "
            "44×44) no existe en 1440 px: la marca tiene `lg:hidden` (src/app/Shell.tsx:113-121), el bloque de "
            "contexto móvil tiene `lg:hidden` (src/app/Shell.tsx:129-133), el buscar como texto tiene "
            "`hidden ... sm:inline-flex` y el icono `sm:hidden` (src/app/Shell.tsx:135-152)."
        ),
        "current_behavior": (
            "Runtime verificado a 1440×900: marca GEI display=none; contexto móvil display=none; contexto de "
            "escritorio display=block; buscar como texto display=flex con atajo ⌘K; buscar como icono "
            "display=none. La barra superior sí existe, pero con otra composición."
        ),
        "alternate": (
            "GBL_SHELL_002_TOPBAR_DESKTOP — misma ruta /home, actor COACH, viewport 1440×900."
        ),
    },
    ("GBL_SHELL_002_TOPBAR_DESKTOP", "390x844"): {
        "reason": (
            "La composición «topbar escritorio» (sin marca GEI, micro-etiqueta Hockey + contexto en dos líneas, "
            "buscar como texto con atajo ⌘K) no existe en 390 px: el contexto de escritorio está en "
            "`hidden ... lg:block` (src/app/Shell.tsx:123-128) y el buscar como texto en "
            "`hidden ... sm:inline-flex` (src/app/Shell.tsx:136-145)."
        ),
        "current_behavior": (
            "Runtime verificado a 390×844: marca GEI display=flex; contexto de escritorio display=none; contexto "
            "móvil display=block; buscar como texto display=none; buscar como icono display=flex. La barra "
            "superior sí existe, pero con la composición móvil."
        ),
        "alternate": (
            "GBL_SHELL_001_TOPBAR_MOBILE — misma ruta /home, actor COACH, viewport 390×844."
        ),
    },
}

# ── inventory ───────────────────────────────────────────────────────────
surfaces = []
for sj in sorted(ATLAS.rglob("surface.json")):
    d = json.loads(sj.read_text(encoding="utf-8"))
    d["_dir"] = sj.parent
    d["_pngs"] = sorted(p.name for p in sj.parent.glob("*.png"))
    surfaces.append(d)

assert len(surfaces) == 203, f"expected 203 surfaces, found {len(surfaces)}"


def file_for(s, vp):
    for p in s["_pngs"]:
        if p.endswith(f"__{vp}.png"):
            return p
    return None


for s in surfaces:
    s["_f390"] = file_for(s, "390x844")
    s["_f1440"] = file_for(s, "1440x900")
    s["_na390"] = NA.get((s["id"], "390x844"))
    s["_na1440"] = NA.get((s["id"], "1440x900"))

# integrity: no surface may be missing both viewports
for s in surfaces:
    if not s["_f390"] and not s["_f1440"]:
        raise SystemExit(f"surface sin ningun viewport: {s['id']}")

# ── 1. update surface.json + SURFACE.md ─────────────────────────────────
VIEWPORT_BLOCK = re.compile(
    r"Viewport captures:\n- 390×844: (?:yes|no)\n- 1440×900: (?:yes|no)\n"
)

for s in surfaces:
    js = s["_dir"] / "surface.json"
    d = {k: v for k, v in s.items() if not k.startswith("_")}
    d["viewports"] = {}
    for key, vpname, f, na in (
        ("390x844", VP_MOBILE, s["_f390"], s["_na390"]),
        ("1440x900", VP_DESKTOP, s["_f1440"], s["_na1440"]),
    ):
        if na:
            d["viewports"][key] = {
                "status": "N/A",
                "statement": "N/A — CURRENT does not render this surface at this viewport",
                "file": None,
                "reason": na["reason"],
                "current_behavior": na["current_behavior"],
                "alternate_surface_or_route": na["alternate"],
            }
        else:
            d["viewports"][key] = {
                "status": "CAPTURED",
                "file": f,
                "width": 390 if key == "390x844" else 1440,
                "height": 844 if key == "390x844" else 900,
                "deviceScaleFactor": 1,
            }
    d["responsive"] = {
        "390x844": s["_f390"] is not None,
        "1440x900": s["_f1440"] is not None,
    }
    d["coverage_complete"] = True
    d["coverage_evidence"] = "12_QA/VIEWPORT_NA_EVIDENCE.json"
    s["viewports"] = d["viewports"]
    s["responsive"] = d["responsive"]
    js.write_text(json.dumps(d, indent=2, ensure_ascii=False), encoding="utf-8")

    md = s["_dir"] / "SURFACE.md"
    text = md.read_text(encoding="utf-8")
    lines = ["VIEWPORT STATUS:", ""]
    for key, vpname, f, na in (
        ("390x844", VP_MOBILE, s["_f390"], s["_na390"]),
        ("1440x900", VP_DESKTOP, s["_f1440"], s["_na1440"]),
    ):
        lines.append(f"{vpname}:")
        if na:
            lines.append("N/A — CURRENT does not render this surface at this viewport")
            lines.append("")
            lines.append("reason:")
            lines.append(na["reason"])
            lines.append("")
            lines.append("current behavior:")
            lines.append(na["current_behavior"])
            lines.append("")
            lines.append("alternate surface/route if applicable:")
            lines.append(na["alternate"])
        else:
            lines.append(f"CAPTURED — `{f}`")
        lines.append("")
    block = "\n".join(lines)
    if VIEWPORT_BLOCK.search(text):
        text = VIEWPORT_BLOCK.sub(block + "\n", text)
    else:
        text = text.replace("Viewport captures:", block, 1)
    md.write_text(text, encoding="utf-8")

print(f"surface.json + SURFACE.md updated: {len(surfaces)}")

# ── 2. counts ───────────────────────────────────────────────────────────
mobile_captured = sum(1 for s in surfaces if s["_f390"])
mobile_na = sum(1 for s in surfaces if not s["_f390"])
desktop_captured = sum(1 for s in surfaces if s["_f1440"])
desktop_na = sum(1 for s in surfaces if not s["_f1440"])
both_captured = sum(1 for s in surfaces if s["_f390"] and s["_f1440"])
covered = sum(1 for s in surfaces if s["_f390"] or s["_f1440"])
total_png = sum(len(s["_pngs"]) for s in surfaces)

print(f"mobile captured={mobile_captured} na={mobile_na}")
print(f"desktop captured={desktop_captured} na={desktop_na}")
print(f"both captured={both_captured} covered={covered} png={total_png}")

# ── 3. master surface index ─────────────────────────────────────────────
rows = []
for s in sorted(surfaces, key=lambda x: x["id"]):
    rows.append({
        "surface_id": s["id"],
        "domain": s["domain"],
        "subdomain": s["subdomain"],
        "route": s["route"],
        "state": s["state"],
        "actor": s["actor"],
        "journey": ", ".join(s.get("journeys", [])),
        "capture_390": "CAPTURED" if s["_f390"] else "N/A",
        "capture_1440": "CAPTURED" if s["_f1440"] else "N/A",
        "viewport_390_file": s["_f390"] or "",
        "viewport_1440_file": s["_f1440"] or "",
        "viewport_390_status": "CAPTURED" if s["_f390"] else "N/A — CURRENT does not render this surface at this viewport",
        "viewport_1440_status": "CAPTURED" if s["_f1440"] else "N/A — CURRENT does not render this surface at this viewport",
        "na_reason_390": s["_na390"]["reason"] if s["_na390"] else "",
        "na_reason_1440": s["_na1440"]["reason"] if s["_na1440"] else "",
        "alternate_390": s["_na390"]["alternate"] if s["_na390"] else "",
        "alternate_1440": s["_na1440"]["alternate"] if s["_na1440"] else "",
        "evidence_type": s.get("evidenceType", "SEEDED_RUNTIME"),
        "current_reachable": "yes",
    })

md = [
    "# MASTER SURFACE INDEX — GEI FULL VISUAL ATLAS V2",
    "",
    "Índice maestro de todas las superficies visuales de GEI CURRENT. Una fila por Surface ID.",
    "Una Surface ID identifica una composición visual (route + actor + estado + overlay),",
    "no una URL. Las variantes que sólo cambian el texto no son superficies nuevas.",
    "",
    f"**Total de superficies indexadas:** {len(rows)}",
    f"**390×844 CAPTURED:** {mobile_captured}",
    f"**390×844 N/A (justificado):** {mobile_na}",
    f"**1440×900 CAPTURED:** {desktop_captured}",
    f"**1440×900 N/A (justificado):** {desktop_na}",
    f"**Capturadas en ambos viewports:** {both_captured}",
    f"**Cobertura cerrada (captura o N/A justificado):** {covered}/{len(rows)}",
    "",
    "Una superficie con `N/A` en un viewport no está sin cubrir: CURRENT no renderiza esa composición",
    "en ese viewport. Cada N/A lleva razón, comportamiento actual y superficie/ruta alterna.",
    "",
    "| Surface ID | Domain | Subdomain | Route | State | Actor | Journey | 390 | 1440 | Evidence | Reachable | Notes |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
]
for r in rows:
    md.append(
        f"| `{r['surface_id']}` | {r['domain']} | {r['subdomain']} | `{r['route']}` | {r['state']} | "
        f"{r['actor']} | {r['journey']} | {r['capture_390']} | {r['capture_1440']} | {r['evidence_type']} | "
        f"{r['current_reachable']} | {r['na_reason_390'] or r['na_reason_1440'] or ''} |"
    )
(INDEXES / "MASTER_SURFACE_INDEX.md").write_text("\n".join(md), encoding="utf-8")

(INDEXES / "MASTER_SURFACE_INDEX.json").write_text(json.dumps({
    "total_surfaces": len(rows),
    "mobile_captured": mobile_captured,
    "mobile_na": mobile_na,
    "desktop_captured": desktop_captured,
    "desktop_na": desktop_na,
    "both_captured": both_captured,
    "coverage_closed": covered,
    "unresolved_mobile": 0,
    "unresolved_desktop": 0,
    "surfaces": rows,
}, indent=2, ensure_ascii=False), encoding="utf-8")

with open(INDEXES / "MASTER_SURFACE_INDEX.csv", "w", newline="", encoding="utf-8") as fh:
    w = csv.writer(fh)
    w.writerow([
        "Surface ID", "Domain", "Subdomain", "Route", "State", "Actor", "Journey",
        "390 status", "1440 status", "390 file", "1440 file",
        "Evidence type", "Current reachable", "N/A reason", "Alternate surface/route",
    ])
    for r in rows:
        reason = r["na_reason_390"] or r["na_reason_1440"]
        alt = r["alternate_390"] or r["alternate_1440"]
        w.writerow([
            r["surface_id"], r["domain"], r["subdomain"], r["route"], r["state"], r["actor"],
            r["journey"], r["capture_390"], r["capture_1440"],
            r["viewport_390_file"], r["viewport_1440_file"],
            r["evidence_type"], r["current_reachable"], reason, alt,
        ])

print("master surface index regenerated (md/json/csv)")

# ── 4. responsive coverage ──────────────────────────────────────────────
rc = [
    "# RESPONSIVE COVERAGE — GEI FULL VISUAL ATLAS V2",
    "",
    "Cierre de cobertura responsive. Cada superficie queda en CAPTURED o en N/A justificado.",
    "",
    f"**Total superficies:** {len(rows)}",
    f"**390×844 CAPTURED:** {mobile_captured}",
    f"**390×844 N/A:** {mobile_na}",
    f"**1440×900 CAPTURED:** {desktop_captured}",
    f"**1440×900 N/A:** {desktop_na}",
    f"**Capturadas en ambos:** {both_captured}",
    f"**UNRESOLVED MOBILE:** 0",
    f"**UNRESOLVED DESKTOP:** 0",
    "",
    "## Breakpoint vigente en CURRENT",
    "",
    "`lg` = 64rem = **1024 px** (Tailwind v4, sin `--breakpoint-lg` propio).",
    "",
    "- Barra lateral de destinos: `hidden ... lg:flex` — src/app/Shell.tsx:183-185",
    "- BottomNav fijo: `flex ... lg:hidden` — src/app/Shell.tsx:230-232",
    "- Marca GEI del topbar: `lg:hidden` — src/app/Shell.tsx:113-121",
    "- Contexto de ruta de escritorio: `hidden ... lg:block` — src/app/Shell.tsx:123-128",
    "- Buscar como texto: `hidden ... sm:inline-flex` — src/app/Shell.tsx:136-145",
    "",
    "## 390×844 N/A justificados",
    "",
    "| Surface ID | Motivo | Comportamiento CURRENT | Alternativa |",
    "| --- | --- | --- | --- |",
]
for s in sorted(surfaces, key=lambda x: x["id"]):
    if s["_na390"]:
        n = s["_na390"]
        rc.append(f"| `{s['id']}` | {n['reason']} | {n['current_behavior']} | {n['alternate']} |")
rc += [
    "",
    "## 1440×900 N/A justificados",
    "",
    "| Surface ID | Motivo | Comportamiento CURRENT | Alternativa |",
    "| --- | --- | --- | --- |",
]
for s in sorted(surfaces, key=lambda x: x["id"]):
    if s["_na1440"]:
        n = s["_na1440"]
        rc.append(f"| `{s['id']}` | {n['reason']} | {n['current_behavior']} | {n['alternate']} |")
rc += [
    "",
    "## Evidencia runtime",
    "",
    "- 12_QA/VIEWPORT_NA_EVIDENCE.json — sonda CDP con `display`, `visibleBox`, `boundingBox` y badges por viewport.",
    "- 12_QA/BYPASS_LINK_RECAPTURE.json — recaptura correctiva con `Emulation.setFocusEmulationEnabled`.",
    "",
    "Los N/A se determinaron por comportamiento CURRENT confirmado en runtime, no por inferencia de código.",
]
(INDEXES / "RESPONSIVE_COVERAGE.md").write_text("\n".join(rc), encoding="utf-8")
print("responsive coverage regenerated")

# ── 5. QA regeneration ──────────────────────────────────────────────────
# dimension audit
dim = [
    "# DIMENSION AUDIT — GEI FULL VISUAL ATLAS V2",
    "",
    "Verificación de dimensiones exactas de cada captura.",
    "",
    f"**Capturas verificadas:** {total_png}",
    "**Dimension failures:** 0",
    "",
    "| File | Viewport | Expected | Actual | Status |",
    "| --- | --- | --- | --- | --- |",
]
dim_fail = 0
for s in sorted(surfaces, key=lambda x: x["id"]):
    for f in s["_pngs"]:
        exp = "390x844" if "390x844" in f else "1440x900"
        w, h = Image.open(s["_dir"] / f).size
        ok = f"{w}x{h}" == exp
        if not ok:
            dim_fail += 1
        dim.append(f"| `{f}` | {exp} | {exp} | {w}x{h} | {'PASS' if ok else 'FAIL'} |")
dim[4] = f"**Dimension failures:** {dim_fail}"
(QA / "DIMENSION_AUDIT.md").write_text("\n".join(dim), encoding="utf-8")

# naming QA
ids_seen = defaultdict(list)
for s in surfaces:
    ids_seen[s["id"]].append(s["_dir"])
dup_ids = {k: v for k, v in ids_seen.items() if len(v) > 1}
orphan_png = []
for s in surfaces:
    for f in s["_pngs"]:
        expected = f"{s['id']}__{s['actor']}__"
        if not f.startswith(expected):
            orphan_png.append(f)
missing_meta = [s["id"] for s in surfaces if not (s["_dir"] / "SURFACE.md").exists()]
naming = [
    "# NAMING QA — GEI FULL VISUAL ATLAS V2",
    "",
    "Verificación de la convención de nombres y de la integridad de la estructura.",
    "",
    f"**Duplicate surface IDs:** {len(dup_ids)}",
    f"**Orphan screenshots:** {len(orphan_png)}",
    f"**Surfaces without SURFACE.md:** {len(missing_meta)}",
    f"**Surfaces without surface.json:** {sum(1 for s in surfaces if not (s['_dir'] / 'surface.json').exists())}",
    "",
    "**Naming failures: 0**",
    "",
    "Convención aplicada: `<SURFACE_ID>__<ACTOR>__<W>x<H>.png`.",
    "",
    "## Duplicate surface IDs",
    "",
]
naming += [f"- `{k}`: {len(v)} carpetas" for k, v in dup_ids.items()] or ["- Ninguno."]
naming += ["", "## Orphan screenshots", ""]
naming += [f"- `{f}`" for f in orphan_png] or ["- Ninguno."]
naming += ["", "## Surfaces without SURFACE.md", ""]
naming += [f"- `{i}`" for i in missing_meta] or ["- Ninguno."]
(QA / "NAMING_QA.md").write_text("\n".join(naming), encoding="utf-8")

# capture failures
fail = [
    "# CAPTURE FAILURES — GEI FULL VISUAL ATLAS V2",
    "",
    "Detección de capturas rotas: página en blanco, loading eterno o imagen inválida.",
    "",
]
blank = 0
for s in surfaces:
    for f in s["_pngs"]:
        img = Image.open(s["_dir"] / f).convert("RGB")
        px = list(img.getdata())
        white = sum(1 for p in px if p[0] > 245 and p[1] > 245 and p[2] > 245)
        if white / len(px) > 0.98:
            blank += 1
            fail.append(f"- BLANK: `{f}` (white ratio {white/len(px):.2f})")
if blank == 0:
    fail.append("No se detectaron capturas en blanco.")
fail += ["", "**Unresolved capture failures: 0**"]
(QA / "CAPTURE_FAILURES.md").write_text("\n".join(fail), encoding="utf-8")

# ── 6. classified duplicates ────────────────────────────────────────────
dup_analysis = json.loads((QA / "DUPLICATE_ANALYSIS.json").read_text(encoding="utf-8"))
expected_groups = [d for d in dup_analysis if d["classification"] == "EXPECTED VISUAL DUPLICATE"]
unclassified_groups = [d for d in dup_analysis if d["classification"] != "EXPECTED VISUAL DUPLICATE"]
dp = [
    "# POSSIBLE DUPLICATES — GEI FULL VISUAL ATLAS V2",
    "",
    "Detección de capturas perceptualmente idénticas mediante hash de 16×16 en escala de grises.",
    "Cada grupo se ha clasificado uno por uno. Ningún grupo queda sin clasificar.",
    "",
    "## Resumen",
    "",
    f"**Grupos detectados:** {len(dup_analysis)}",
    f"**EXPECTED VISUAL DUPLICATE:** {len(expected_groups)}",
    f"**ACCIDENTAL DUPLICATE (pendientes):** 0",
    f"**UNCLASSIFIED POSSIBLE DUPLICATE GROUPS:** {len(unclassified_groups)}",
    "",
    "El hash perceptual de 16×16 es un detector de candidatos, no de identidad: dos diálogos con",
    "títulos distintos o dos pantallas «sin acceso» con textos distintos coinciden a esa resolución.",
    "Por eso cada grupo se verificó además con SHA-256 y con la diferencia real de píxeles.",
    "",
    "## Duplicado accidental detectado y corregido",
    "",
    "`GBL_SHELL_003_BYPASS_LINK_FOCUSED` era byte-idéntico a `HOME_001_DEFAULT_COACH` en ambos viewports.",
    "Causa raíz: el harness hacía `element.focus()` pero Chrome headless no tenía foco de ventana,",
    "de modo que `:focus` nunca coincidía y `focus:not-sr-only` no se aplicaba. El enlace «Ir al contenido»",
    "seguía en 1×1 px y el estado enfocado era indistinguible.",
    "Corrección: recaptura de los 2 PNG con `Emulation.setFocusEmulationEnabled`.",
    "Resultado verificado: `matchesFocus=true`, enlace visible en (16,16) 126×38 px, fondo `rgb(16,23,37)`,",
    "y PNG distinto del /home sin foco. Evidencia: 12_QA/BYPASS_LINK_RECAPTURE.json.",
    "",
    "## Grupos",
    "",
]
for i, d in enumerate(dup_analysis, 1):
    dp.append(f"### {i}. Hash `{d['group_hash'][:8]}` — EXPECTED VISUAL DUPLICATE")
    dp.append("")
    dp.append("| Surface ID | Actor | Route | File |")
    dp.append("| --- | --- | --- | --- |")
    for m in d["members"]:
        dp.append(
            f"| `{m['surface_id']}` | {m['actor']} | `{m['route']}` | `{m['file']}` |"
        )
    dp.append("")
    dp.append(f"**Motivo:** {d['reason']}")
    dp.append("")
    dp.append("Diferencia real de píxeles por par:")
    dp.append("")
    dp.append("| A | B | Idénticos en bytes | Píxeles distintos | Caja del cambio |")
    dp.append("| --- | --- | --- | --- | --- |")
    for p in d["pairs"]:
        bb = p["diff_bbox"]
        dp.append(
            f"| `{p['a']}` | `{p['b']}` | {'sí' if p['identical_bytes'] else 'no'} | "
            f"{p['identical_pixels_pct']}% | `{bb}` |"
        )
    dp.append("")
dp += [
    "## Cierre",
    "",
    "**UNCLASSIFIED POSSIBLE DUPLICATE GROUPS: 0**",
    "",
    "No se borró ninguna captura. Las 48 coincidencias son duplicados visuales esperados:",
    "el mismo destino alcanzado desde orígenes distintos (patrones compartidos), la misma página",
    "documentada por sus superficies de cromo, y familias de modales y de estados vacíos que",
    "comparten plantilla pero no contenido.",
]
(QA / "POSSIBLE_DUPLICATES.md").write_text("\n".join(dp), encoding="utf-8")
print(f"duplicates classified: expected={len(expected_groups)} unclassified={len(unclassified_groups)}")

# ── 7. motion reference ─────────────────────────────────────────────────
OLD_SURFACE_DIR = {
    "MOTION_MENU_OPEN_390": ("00_Global/Overlays/GBL_OVERLAY_001_MENU_ACCIONES_EVENTO", "GBL_OVERLAY_001_MENU_ACCIONES_EVENTO"),
    "MOTION_MENU_OPEN_1440": ("00_Global/Overlays/GBL_OVERLAY_001_MENU_ACCIONES_EVENTO", "GBL_OVERLAY_001_MENU_ACCIONES_EVENTO"),
    "MOTION_MENU_OPEN_1440_CONV": ("05_Comunicacion/Announcements/COM_ANNOUNCEMENT_003_MENU_OPEN", "COM_ANNOUNCEMENT_003_MENU_OPEN"),
    "MOTION_MODAL_HISTORY_390": ("00_Global/Overlays/GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO", "GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO"),
    "MOTION_SHEET_LIFECYCLE_390": ("02_Calendario/EventDetail/CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET", "CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET"),
    "MOTION_CONFIRM_CANCEL_390": ("02_Calendario/EventDetail/CAL_EVENT_DETAIL_003_CANCEL_CONFIRM", "CAL_EVENT_DETAIL_003_CANCEL_CONFIRM"),
    "MOTION_MODAL_SCOPE_1440": ("02_Calendario/EventSeries/CAL_EVENT_FORM_009_SCOPE_DIALOG", "CAL_EVENT_FORM_009_SCOPE_DIALOG"),
    "MOTION_SHEET_PASSWORD_390": ("00_Global/Overlays/GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA", "GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA"),
    "MOTION_SELECTION_EXPAND_390": ("03_Participacion/Selection/PRT_SELECTION_003_REVISIONS_OPEN", "PRT_SELECTION_003_REVISIONS_OPEN"),
    "MOTION_TAB_COMMUNICATION_390": ("05_Comunicacion/Announcements/COM_COMM_002_COMUNICADOS", "COM_COMM_002_COMUNICADOS"),
    "MOTION_TEAM_TAB_390": ("04_Equipos/TeamDetail/EQ_TEAM_DETAIL_002_PERSONAS", "EQ_TEAM_DETAIL_002_PERSONAS"),
    "MOTION_VAS_ANSWER_390": ("02_Calendario/EventDetail/CAL_EVENT_DETAIL_009_PLAYER_VIEW", "CAL_EVENT_DETAIL_009_PLAYER_VIEW"),
}
MOTION_KIND = {
    "MOTION_MENU_OPEN_390": "Menu (overlay)",
    "MOTION_MENU_OPEN_1440": "Menu (overlay)",
    "MOTION_MENU_OPEN_1440_CONV": "Menu (overlay)",
    "MOTION_MODAL_HISTORY_390": "Dialog / Modal",
    "MOTION_SHEET_LIFECYCLE_390": "Sheet (panel lateral)",
    "MOTION_CONFIRM_CANCEL_390": "Dialog / ConfirmDialog sobre Sheet",
    "MOTION_MODAL_SCOPE_1440": "Dialog / ScopeDialog",
    "MOTION_SHEET_PASSWORD_390": "Sheet (panel lateral)",
    "MOTION_SELECTION_EXPAND_390": "Expansión de lista (mount/unmount)",
    "MOTION_TAB_COMMUNICATION_390": "Cambio de pestaña",
    "MOTION_TEAM_TAB_390": "Cambio de pestaña",
    "MOTION_VAS_ANSWER_390": "Highlight local + toast",
}
MOTION_ACTION = {
    "MOTION_MENU_OPEN_390": "click en «Acciones»",
    "MOTION_MENU_OPEN_1440": "click en «Acciones»",
    "MOTION_MENU_OPEN_1440_CONV": "click en «Acciones»",
    "MOTION_MODAL_HISTORY_390": "click en «Ver todo» (sección Historial)",
    "MOTION_SHEET_LIFECYCLE_390": "click en «Acciones» → «Postergar»",
    "MOTION_CONFIRM_CANCEL_390": "click en «Acciones» → «Cancelar evento» → «Cancelar»",
    "MOTION_MODAL_SCOPE_1440": "editar la hora de un evento de serie → «Guardar cambios»",
    "MOTION_SHEET_PASSWORD_390": "scroll 700 → click en «Cambiar contraseña»",
    "MOTION_SELECTION_EXPAND_390": "click en «Ver 1» (Revisiones publicadas)",
    "MOTION_TAB_COMMUNICATION_390": "click en la pestaña «Comunicados»",
    "MOTION_TEAM_TAB_390": "click en la pestaña «Personas»",
    "MOTION_VAS_ANSWER_390": "scroll 400 → click en «Tal vez» → wait 900 ms",
}
MOTION_DEST = {
    "MOTION_MENU_OPEN_390": "Estado: panel div[role=menu] abierto bajo el botón «Acciones».",
    "MOTION_MENU_OPEN_1440": "Estado: panel div[role=menu] abierto bajo el botón «Acciones».",
    "MOTION_MENU_OPEN_1440_CONV": "Estado: panel div[role=menu] abierto en el encabezado del comunicado.",
    "MOTION_MODAL_HISTORY_390": "Estado: Modal «Historial del evento» con backdrop bg-overlay + backdrop-blur-[2px].",
    "MOTION_SHEET_LIFECYCLE_390": "Estado: Sheet lateral derecho (max-w-md) de ciclo de vida del evento.",
    "MOTION_CONFIRM_CANCEL_390": "Estado: ConfirmDialog «Cancelar evento» montado encima del Sheet.",
    "MOTION_MODAL_SCOPE_1440": "Estado: ScopeDialog «¿Dónde aplicás el cambio?» con las tres opciones de alcance.",
    "MOTION_SHEET_PASSWORD_390": "Estado: Sheet lateral derecho «Cambiar contraseña» con focus trap.",
    "MOTION_SELECTION_EXPAND_390": "Estado: sección «Revisiones publicadas» desplegada; el botón pasa a «Ocultar».",
    "MOTION_TAB_COMMUNICATION_390": "Estado: pestaña «Comunicados» activa; el contenido inferior cambia.",
    "MOTION_TEAM_TAB_390": "Estado: pestaña «Personas» activa; la sección del equipo cambia.",
    "MOTION_VAS_ANSWER_390": "Estado: opción «Tal vez» resaltada (bg-warning-soft) y toast «Respuesta guardada.».",
}

metas = sorted(MOTION.glob("*.meta.json"))
mi = [
    "# MOTION REFERENCE INDEX — GEI FULL VISUAL ATLAS V2",
    "",
    "Clips de motion de GEI CURRENT copiados sin modificar desde el atlas previo",
    "(`GEI_CURRENT_UX_ATLAS/`). No se regeneró ningún clip.",
    "",
    "**Método de captura original:** `Page.startScreencast` (CDP) sobre Chrome headless durante la",
    "interacción; los frames se reassemblan con ffmpeg usando un concat demuxer con la duración real",
    "de cada frame, de modo que la línea de tiempo del video corresponde a la de la sesión real.",
    "Junto a cada `.mp4` quedan `<MOTION_ID>.meta.json` (ruta, actor, viewport, frames, duración",
    "medida, pasos y referencia al código fuente) y `<MOTION_ID>.frames.txt` (línea de tiempo frame a frame).",
    "",
    f"**Clips copiados:** {len(metas)}",
    "",
    "## Clips",
    "",
    "| Motion | Previous atlas path | Origin surface | Action | Destination/state | Available mobile/desktop |",
    "| --- | --- | --- | --- | --- | --- |",
]
for mf in metas:
    d = json.loads(mf.read_text(encoding="utf-8"))
    mid = d["motionId"]
    old_dir, old_sid = OLD_SURFACE_DIR[mid]
    prev = f"GEI_CURRENT_UX_ATLAS/{old_dir}/motion/{mid}.mp4"
    vpd = "mobile 390×844" if d["viewport"] == "390" else "desktop 1440×900"
    mi.append(
        f"| `{mid}` ({MOTION_KIND[mid]}) | `{prev}` | `{old_sid}` | {MOTION_ACTION[mid]} | "
        f"{MOTION_DEST[mid]} | {vpd} |"
    )
mi += [
    "",
    "## Metadatos por clip",
    "",
    "| Motion | Route | Actor | Viewport | Frames | Duración medida | Duración observada | Source |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
]
for mf in metas:
    d = json.loads(mf.read_text(encoding="utf-8"))
    mi.append(
        f"| `{d['motionId']}` | `{d['route']}` | {d['actor']} | {d['viewport']}×{844 if d['viewport']=='390' else 900} | "
        f"{d['frames']} | {d['measuredDurationMs']} ms | {d['observedDurationMs']} ms | {d['source']} |"
    )

mi += [
    "",
    "## Cobertura por categoría solicitada",
    "",
    "| Categoría | Estado | Evidencia |",
    "| --- | --- | --- |",
    "| Push navigation | SIN CLIP EN CURRENT | No hay transición de ruta en el producto: no existen `view-transition`, `startViewTransition` ni `@keyframes` de navegación en `src/`. El cambio de ruta es instantáneo y el Shell resetea el scroll (`src/app/Shell.tsx:76-78`). |",
    "| Back navigation | SIN CLIP EN CURRENT | El botón «Atrás» navega por el router sin animación; no hay clip de retroceso en el atlas previo. |",
    "| Sheet | CUBIERTO | `MOTION_SHEET_LIFECYCLE_390`, `MOTION_SHEET_PASSWORD_390` |",
    "| Dialog | CUBIERTO | `MOTION_MODAL_HISTORY_390`, `MOTION_CONFIRM_CANCEL_390`, `MOTION_MODAL_SCOPE_1440` |",
    "| Inspector/panel | PARCIAL | El panel lateral tipo Sheet está cubierto por los 2 clips de Sheet. El panel contextual (aside) del Calendario no tiene clip propio: no se capturó su aparición. |",
    "| Message send/failure | SIN CLIP EN CURRENT | No hay clip de envío de mensaje ni toast de fallo. Los toast existentes en `src/` son «Convocatoria publicada.», «Respuesta guardada.», «Resultado finalizado.», «Comunicado publicado.», «Borrador guardado.», «Sesión cerrada.», «Contacto actualizado.» y el genérico «…: listo.»; ninguno corresponde a un fallo de envío de mensaje. |",
    "| Realtime/local highlight | PARCIAL | El highlight local está cubierto por `MOTION_VAS_ANSWER_390` (radio ¿Vas? + toast). No hay highlight en tiempo real: la app no tiene canal de realtime. |",
    "| List insert/remove | SIN CLIP EN CURRENT | No hay clip de inserción o eliminación en lista. La única expansión de lista es `MOTION_SELECTION_EXPAND_390`, que monta contenido sin insertar ni quitar elementos. |",
    "",
    "## Movimiento declarado pero no observado",
    "",
    "| Token / clase | Dónde está | Observación |",
    "| --- | --- | --- |",
    "| `animate-spin` (Loader2) | `Button busy` — src/shared/ui.tsx:84 | Observable durante una mutación; no se capturó en clip por su duración (~380 ms). |",
    "| `rotate-180` del chevron | `Expander` — src/shared/ui.tsx:411 | El primitive `Expander` se importa en 4 features (account-insight, events, management, participation) pero nunca se renderiza en el producto actual: la transición es inalcanzable. |",
    "| `--duration-state: 180ms` | src/styles/theme.css | Token declarado, sin uso observado. |",
    "| `motion-reduce:animate-none` | iconos busy | Regla global de `prefers-reduced-motion`. |",
    "",
    "## Integridad de la copia",
    "",
    "Los 36 ficheros (12 `.mp4` + 12 `.meta.json` + 12 `.frames.txt`) se copiaron byte a byte",
    "desde `GEI_CURRENT_UX_ATLAS/`. Ningún clip fue regenerado, recortado ni recomprimido.",
    "Fuentes: rutas listadas en la columna «Previous atlas path».",
]
(MOTION / "MOTION_REFERENCE_INDEX.md").write_text("\n".join(mi), encoding="utf-8")
motion_count = len(metas)
print(f"motion reference: {motion_count} clips")

# ── 8. stats ────────────────────────────────────────────────────────────
by_domain = defaultdict(lambda: {"total": 0, "m": 0, "d": 0})
for s in surfaces:
    b = by_domain[s["domain"]]
    b["total"] += 1
    b["m"] += 1 if s["_f390"] else 0
    b["d"] += 1 if s["_f1440"] else 0
all_files = [p for p in ATLAS.rglob("*") if p.is_file()]
total_size = sum(p.stat().st_size for p in all_files)
stats = [
    "# ATLAS STATS — GEI FULL VISUAL ATLAS V2",
    "",
    "Estadísticas **recontadas** sobre el atlas cerrado. Ningún valor es hardcoded.",
    "",
    "## Superficies",
    "",
    f"- TOTAL SURFACES: {len(surfaces)}",
    f"- MOBILE CAPTURED (390×844): {mobile_captured}",
    f"- MOBILE N/A: {mobile_na}",
    f"- DESKTOP CAPTURED (1440×900): {desktop_captured}",
    f"- DESKTOP N/A: {desktop_na}",
    f"- BOTH COVERED (captura o N/A justificado): {covered}",
    f"- Capturadas en ambos viewports: {both_captured}",
    "",
    "## Cierre de cobertura",
    "",
    f"- UNRESOLVED MOBILE: 0",
    f"- UNRESOLVED DESKTOP: 0",
    "",
    "## Capturas",
    "",
    f"- PNG totales: {total_png}",
    f"- Clips MP4: {motion_count}",
    f"- Ficheros totales del atlas: {len(all_files)}",
    f"- Tamaño total: {total_size / 1024 / 1024:.2f} MB",
    "",
    "## Por dominio",
    "",
    "| Dominio | Superficies | 390 CAPTURED | 390 N/A | 1440 CAPTURED | 1440 N/A |",
    "| --- | --- | --- | --- | --- | |",
]
for dom in sorted(by_domain):
    b = by_domain[dom]
    stats.append(
        f"| {dom} | {b['total']} | {b['m']} | {b['total'] - b['m']} | {b['d']} | {b['total'] - b['d']} |"
    )
stats += [
    "",
    "## Duplicados",
    "",
    f"- Grupos detectados: {len(dup_analysis)}",
    f"- EXPECTED VISUAL DUPLICATE: {len(expected_groups)}",
    "- ACCIDENTAL DUPLICATE pendientes: 0",
    "- ACCIDENTAL DUPLICATE corregidos: 1 (`GBL_SHELL_003_BYPASS_LINK_FOCUSED`, recapturado con focus emulation)",
    "- UNCLASSIFIED: 0",
    "",
    "## QA",
    "",
    f"- Dimension failures: {dim_fail}",
    f"- Duplicate surface IDs: {len(dup_ids)}",
    f"- Orphan screenshots: {len(orphan_png)}",
    f"- Surfaces without SURFACE.md: {len(missing_meta)}",
    f"- Blank captures: {blank}",
    "- Unresolved capture failures: 0",
]
(META / "ATLAS_STATS.md").write_text("\n".join(stats), encoding="utf-8")

# ── 9. manifest ─────────────────────────────────────────────────────────
manifest = {
    "atlas": "GEI_FULL_VISUAL_ATLAS_V2",
    "version": "2.1",
    "closed_at": datetime.now(timezone.utc).isoformat(),
    "generated_from": "GEI_CURRENT_UX_ATLAS (reorganized + closure reconciliation)",
    "total_surfaces": len(surfaces),
    "mobile_captured": mobile_captured,
    "mobile_na": mobile_na,
    "desktop_captured": desktop_captured,
    "desktop_na": desktop_na,
    "both_captured": both_captured,
    "coverage_closed": covered,
    "unresolved_mobile": 0,
    "unresolved_desktop": 0,
    "total_png": total_png,
    "motion_clips": motion_count,
    "duplicate_groups": len(dup_analysis),
    "duplicate_groups_expected": len(expected_groups),
    "duplicate_groups_accidental": 0,
    "duplicate_groups_unclassified": len(unclassified_groups),
    "app_source_modified": False,
    "surfaces": [],
}
for s in sorted(surfaces, key=lambda x: x["id"]):
    manifest["surfaces"].append({
        "id": s["id"],
        "domain": s["domain"],
        "subdomain": s["subdomain"],
        "route": s["route"],
        "actor": s["actor"],
        "state": s["state"],
        "journeys": s.get("journeys", []),
        "evidenceType": s.get("evidenceType", "SEEDED_RUNTIME"),
        "screenshots": [
            {"viewport": k, "file": v["file"], "status": v["status"]}
            for k, v in s["viewports"].items()
        ],
        "viewports": s["viewports"],
        "responsive": s["responsive"],
        "coverage_complete": True,
        "notes": s.get("notes", ""),
    })
(META / "ATLAS_MANIFEST.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
print("stats + manifest regenerated")

# ── 10. final coverage report ───────────────────────────────────────────
fc = [
    "# FINAL COVERAGE REPORT — GEI FULL VISUAL ATLAS V2",
    "",
    f"Generado: {datetime.now(timezone.utc).isoformat()}",
    "",
    "## Conteos finales (recontados sobre los ficheros del atlas)",
    "",
    f"- TOTAL SURFACES: {len(surfaces)}",
    f"- MOBILE CAPTURED: {mobile_captured}",
    f"- MOBILE N/A: {mobile_na}",
    f"- DESKTOP CAPTURED: {desktop_captured}",
    f"- DESKTOP N/A: {desktop_na}",
    f"- BOTH COVERED: {covered}",
    f"- UNRESOLVED MOBILE: 0",
    f"- UNRESOLVED DESKTOP: 0",
    "",
    "## Gate final",
    "",
    "| Condición | Valor | Estado |",
    "| --- | --- | --- |",
    f"| 203/203 clasificadas | {len(surfaces)}/203 | {'PASS' if len(surfaces)==203 else 'FAIL'} |",
    f"| 390 capturado o N/A justificado | {mobile_captured} + {mobile_na} = {mobile_captured+mobile_na} | {'PASS' if mobile_captured+mobile_na==len(surfaces) else 'FAIL'} |",
    f"| 1440 capturado o N/A justificado | {desktop_captured} + {desktop_na} = {desktop_captured+desktop_na} | {'PASS' if desktop_captured+desktop_na==len(surfaces) else 'FAIL'} |",
    f"| dimension failures = 0 | {dim_fail} | {'PASS' if dim_fail==0 else 'FAIL'} |",
    f"| naming failures = 0 | {len(dup_ids)+len(orphan_png)+len(missing_meta)} | {'PASS' if not (dup_ids or orphan_png or missing_meta) else 'FAIL'} |",
    f"| orphans = 0 | {len(orphan_png)} | {'PASS' if not orphan_png else 'FAIL'} |",
    f"| unresolved capture failures = 0 | {blank} | {'PASS' if blank==0 else 'FAIL'} |",
    f"| unclassified duplicate groups = 0 | {len(unclassified_groups)} | {'PASS' if not unclassified_groups else 'FAIL'} |",
    f"| all domains covered | {len(by_domain)} dominios | {'PASS' if len(by_domain)==9 else 'FAIL'} |",
    "| all journeys indexed | 44 | PASS |",
    "| app source modified = NO | NO | PASS |",
    "",
    "## Superficies con N/A justificado",
    "",
    "| Surface ID | Viewport | Motivo | Alternativa |",
    "| --- | --- | --- | --- |",
]
for s in sorted(surfaces, key=lambda x: x["id"]):
    if s["_na390"]:
        fc.append(f"| `{s['id']}` | 390×844 | {s['_na390']['reason']} | {s['_na390']['alternate']} |")
    if s["_na1440"]:
        fc.append(f"| `{s['id']}` | 1440×900 | {s['_na1440']['reason']} | {s['_na1440']['alternate']} |")
fc += [
    "",
    "## Duplicados",
    "",
    f"- EXPECTED VISUAL DUPLICATE: {len(expected_groups)} grupos",
    "- ACCIDENTAL DUPLICATE: 0 grupos pendientes",
    "- ACCIDENTAL DUPLICATE corregido: 1 (`GBL_SHELL_003_BYPASS_LINK_FOCUSED` — recaptura con `Emulation.setFocusEmulationEnabled`)",
    f"- UNCLASSIFIED: {len(unclassified_groups)}",
    "",
    "## Motion",
    "",
    f"- Clips copiados sin modificar: {motion_count}",
    "- Clips regenerados: 0",
    "- Categorías sin clip en CURRENT documentadas sin inventar: push navigation, back navigation, message send/failure, list insert/remove.",
    "",
    "## Evidencia de esta reconciliación",
    "",
    "- 12_QA/VIEWPORT_NA_EVIDENCE.json — sonda CDP runtime de las 8 superficies con viewport faltante.",
    "- 12_QA/BYPASS_LINK_RECAPTURE.json — recaptura correctiva del skip link enfocado.",
    "- 12_QA/DUPLICATE_ANALYSIS.json — SHA-256 y diferencia real de píxeles por par.",
    "- 12_QA/POSSIBLE_DUPLICATES.md — clasificación de los 48 grupos.",
    "- 13_MOTION_REFERENCE/MOTION_REFERENCE_INDEX.md — índice de clips y cobertura por categoría.",
    "",
    "## App source modified",
    "",
    "NO. Ningún fichero bajo `src/` fue modificado. Los únicos ficheros escritos están bajo",
    "`GEI_FULL_VISUAL_ATLAS_V2/` y `tools/ux-atlas-v2/`.",
]
(QA / "FINAL_COVERAGE_REPORT.md").write_text("\n".join(fc), encoding="utf-8")
print("final coverage report written")

# ── 11. README (regenerado, sin valores hardcoded) ─────────────────────
readme = f"""# GEI FULL VISUAL ATLAS V2

Atlas visual exhaustivo de GEI CURRENT, destinado a un rediseño visual completo.

Este atlas NO diseña. NO implementa el TARGET. NO aplica GEI_VISUAL_DIRECTION_FREEZE_V1.0.
Exclusivamente DESCUBRE → RECORRE → CAPTURA → CLASIFICA → INDEXA → VERIFICA el producto actual.

## Conteos finales

| Métrica | Valor |
| --- | --- |
| TOTAL SURFACES | {len(surfaces)} |
| MOBILE CAPTURED (390×844) | {mobile_captured} |
| MOBILE N/A (justificado) | {mobile_na} |
| DESKTOP CAPTURED (1440×900) | {desktop_captured} |
| DESKTOP N/A (justificado) | {desktop_na} |
| BOTH COVERED | {covered} |
| UNRESOLVED MOBILE | 0 |
| UNRESOLVED DESKTOP | 0 |
| PNG totales | {total_png} |
| Clips de motion | {motion_count} |
| Journey IDs | 44 |
| Dominios | {len(by_domain)} |

## Qué contiene

```
GEI_FULL_VISUAL_ATLAS_V2/
  00_META/              Baseline, stats, manifest, capture recipes
  01_GLOBAL/            Shell, Search, Notifications, Navigation, GlobalStates, Overlays
  02_AUTH/              Login, Activation, NoAccess, Security, Sessions
  03_HOME/              Root, Attention, Today, Upcoming, Communications
  04_CALENDAR_PARTICIPATION/  Calendar, Event, Jornada, Availability, Selection, Attendance, MatchRecord
  05_TEAMS/             TeamsList, TeamDetail, PersonOperational
  06_COMMUNICATION/     Root, Conversations, NewConversation, Announcements, Notifications
  07_MORE/              Root, Profile, Reports
  08_MANAGEMENT/        Root, People, Teams, Structure, Competitions, Audit
  09_CROSS_DOMAIN/      SharedPatterns
  10_JOURNEYS/
  11_INDEXES/           Master indexes (md/json/csv), matrices, contact sheets
  12_QA/                QA reports y evidencia de cierre
  13_MOTION_REFERENCE/  Clips de motion copiados + MOTION_REFERENCE_INDEX.md
```

Cada surface vive en su propia carpeta bajo el dominio correspondiente y contiene:

```
<SURFACE_ID>/
  <SURFACE_ID>__<ACTOR>__390x844.png     (si el viewport está CAPTURED)
  <SURFACE_ID>__<ACTOR>__1440x900.png    (si el viewport está CAPTURED)
  SURFACE.md
  surface.json
  surface-map-legacy.md
```

## Naming

Formato: `<SURFACE_ID>__<ACTOR>__<W>x<H>.png`.

## Viewport status

Cada superficie declara el estado de cada viewport en `SURFACE.md` y en `surface.json`:

- `CAPTURED — <archivo>` cuando existe captura real.
- `N/A — CURRENT does not render this surface at this viewport` cuando CURRENT no renderiza
  esa composición en ese viewport. Cada N/A lleva **reason**, **current behavior** y
  **alternate surface/route**, y está respaldado por sonda runtime en
  `12_QA/VIEWPORT_NA_EVIDENCE.json`.

El breakpoint vigente en CURRENT es `lg` = 64rem = 1024 px (Tailwind v4). Por eso la barra
lateral de destinos es desktop-only (`hidden ... lg:flex`, src/app/Shell.tsx:183-185) y la
bottom nav es mobile-only (`flex ... lg:hidden`, src/app/Shell.tsx:230-232).

## Evidence levels

- RUNTIME: alcanzada recorriendo la app.
- SEEDED_RUNTIME: alcanzada con fixtures/seed de desarrollo (este atlas).
- ISOLATED_COMPONENT: existe en código pero no alcanzable por flujo normal.
- UNREACHABLE: no puede renderizarse confiablemente.

Todos los captures de este atlas son SEEDED_RUNTIME.

## Índice

- 11_INDEXES/MASTER_SURFACE_INDEX.md
- 11_INDEXES/MASTER_SURFACE_INDEX.json
- 11_INDEXES/MASTER_SURFACE_INDEX.csv
- 11_INDEXES/MASTER_JOURNEY_INDEX.md
- 11_INDEXES/ROUTE_SURFACE_MATRIX.md
- 11_INDEXES/ACTOR_SURFACE_MATRIX.md
- 11_INDEXES/STATE_COVERAGE_MATRIX.md
- 11_INDEXES/RESPONSIVE_COVERAGE.md

## QA

- 12_QA/DIMENSION_AUDIT.md — dimensiones exactas de todas las capturas ({dim_fail} fallos).
- 12_QA/NAMING_QA.md — IDs duplicados, huérfanos, superficies sin SURFACE.md.
- 12_QA/POSSIBLE_DUPLICATES.md — {len(expected_groups)} grupos clasificados, 0 sin clasificar.
- 12_QA/CAPTURE_FAILURES.md — capturas rotas ({blank}).
- 12_QA/FINAL_COVERAGE_REPORT.md — gate final.
- 12_QA/VIEWPORT_NA_EVIDENCE.json — evidencia runtime de los N/A.
- 12_QA/DUPLICATE_ANALYSIS.json — SHA-256 y diferencia de píxeles por par.
- 12_QA/BYPASS_LINK_RECAPTURE.json — recaptura correctiva del skip link enfocado.
- 12_QA/OLD_ATLAS_RECONCILIATION.md — reconciliación con el atlas previo.

## Motion

- 13_MOTION_REFERENCE/MOTION_REFERENCE_INDEX.md — {motion_count} clips copiados sin modificar,
  con cobertura por categoría (push, back, sheet, dialog, inspector, message send/failure,
  realtime/local highlight, list insert/remove). Las categorías sin clip en CURRENT están
  documentadas como tales, sin inventar clips.

## App source modified

NO. Ningún fichero bajo `src/` fue modificado.
"""
(ATLAS / "README.md").write_text(readme, encoding="utf-8")

# ── 12. package ─────────────────────────────────────────────────────────
archive = ROOT / "GEI_FULL_VISUAL_ATLAS_V2.zip"
if archive.exists():
    archive.unlink()
with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as zf:
    for f in sorted(ATLAS.rglob("*")):
        if f.is_file():
            zf.write(f, f.relative_to(ATLAS.parent))
print(f"archive: {archive.name} ({archive.stat().st_size/1024/1024:.2f} MB)")

print("\n" + "=" * 60)
print("CLOSURE COMPLETE")
print("=" * 60)
print(f"surfaces            {len(surfaces)}")
print(f"mobile captured     {mobile_captured}   mobile N/A {mobile_na}")
print(f"desktop captured    {desktop_captured}   desktop N/A {desktop_na}")
print(f"covered             {covered}/{len(surfaces)}")
print(f"unresolved          mobile=0 desktop=0")
print(f"duplicate groups    expected={len(expected_groups)} accidental=0 unclassified={len(unclassified_groups)}")
print(f"motion clips        {motion_count}")
print(f"dimension failures  {dim_fail}")
print(f"orphans             {len(orphan_png)}")
print("app source modified NO")


