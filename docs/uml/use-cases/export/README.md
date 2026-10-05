# `docs/uml/use-cases/export/` — VACÍO A PROPÓSITO

**Estado:** `EXPORT_BLOCKED_NO_DRAWIO_CLI`

Este directorio debe contener las exportaciones **derivadas** de los `.drawio`:
PDF (entrega/lectura) y PNG (preview/evidencia).

## Por qué está vacío

No hay ninguna CLI de draw.io / diagrams.net en esta máquina. Se comprobó:

| Vía | Resultado |
|---|---|
| `%LOCALAPPDATA%\Programs\draw.io\Draw.io.exe` | no existe |
| `%LOCALAPPDATA%\draw.io\Draw.io.exe` | no existe |
| `%ProgramFiles%\draw.io\Draw.io.exe` | no existe |
| `%ProgramFiles(x86)%\draw.io\Draw.io.exe` | no existe |
| `%LOCALAPPDATA%\Programs\diagrams.net\Draw.io.exe` | no existe |
| `%ProgramFiles%\diagrams.net\Draw.io.exe` | no existe |
| `draw.io` en `PATH` | no encontrado |
| `drawio` en `PATH` | no encontrado |
| `diagrams.net` en `PATH` | no encontrado |
| `diagramsnet` en `PATH` | no encontrado |

## Qué NO se hizo, deliberadamente

- **No se instaló draw.io.** El brief §39 prohíbe instalar software o paquetes globales sin
  necesidad, y aquí no lo hay: los `.drawio` son editables y se abren sin ninguna instalación.
- **No se fabricaron exports falsos.** El brief §39 dice literalmente: *«NO falsificar
  exports»*. Un PNG generado por otro medio y puesto aquí sería peor que no tener nada:
  parecería la salida de draw.io sin serlo.
- **No se trata el `.drawio` como derivado.** Es al revés: el `.drawio` es la **fuente
  autoritativa** y el PDF/PNG serían derivados (brief §17).

## Cómo producir las exportaciones cuando haya CLI

```bash
# Con la app de escritorio instalada (Windows)
"C:\Program Files\draw.io\Draw.io.exe" ^
  --export --format pdf --crop --border 10 ^
  --output docs\uml\use-cases\export docs\uml\use-cases\source\UCD-00__GEI_Use_Case_Map.drawio

# Repetir por cada .drawio; después lo mismo con --format png --scale 2
```

## Qué hay que hacer después de exportar

1. Revisar **visualmente** cada PNG (§40 del brief): solapamiento de texto, etiquetas cortadas,
   actor dentro del *boundary*, CU fuera, flecha a través de texto, fuente ilegible, enredos,
   dirección de flecha, elementos fuera de página.
2. Ejecutar los tests de §41 (5 segundos · trace · print · remove · crossing) sobre el render.
3. Registrar el resultado en `GEI_USE_CASE_DIAGRAM_FREEZE_V1.md` §8 y §10.

Hasta entonces, la QA registrada en E4 es **geométrica**, no visual, y así está declarada.
