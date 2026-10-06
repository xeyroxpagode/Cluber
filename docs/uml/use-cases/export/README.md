# `docs/uml/use-cases/export/` — EXPORTACIONES DERIVADAS

**Estado:** `EXPORT_OK` — 17 PNG + 17 PDF

Este directorio contiene las exportaciones **derivadas** de los `.drawio`:
`png/` (preview y evidencia de QA visual) y `pdf/` (entrega y lectura impresa).

> El `.drawio` es la **fuente autoritativa**. Si un PDF y un `.drawio` contradicen algo,
> **manda el `.drawio`**.

---

# 1. CÓMO SE LOCALIZÓ LA CLI

draw.io **no está en `PATH`**:

| Vía | Resultado |
|---|---|
| `where drawio` / `where draw.io` / `where diagrams.net` | no encontrado |
| `Get-Command drawio`, `draw.io` | no encontrado |
| 11 rutas Windows habituales de instalación | ninguna existe |

La instalación es un **paquete MSIX de Microsoft Store**, que no se registra en `PATH`:

```powershell
Get-AppxPackage *draw* | Select-Object Name, PackageFullName, InstallLocation
```

| Campo | Valor |
|---|---|
| Name | `draw.io.draw.ioDiagrams` |
| Version | `31.7.0.0` |
| InstallLocation | `C:\Program Files\WindowsApps\draw.io.draw.ioDiagrams_31.7.0.0_x64__1zh33159kp73c` |
| Ejecutable | `…\app\draw.io.exe` (Electron, `app.asar` de 64 MB) |
| EntryPoint | `Windows.FullTrustApplication` |

## 1.1 Qué NO se hizo

- **No se instaló software.** draw.io ya estaba instalado por el usuario.
- **No se modificaron permisos de `WindowsApps`.**
- **No se copió el ejecutable fuera del paquete.**
- **No se fabricaron exports falsos.** Todo lo que hay aquí salió de la CLI de draw.io.

---

# 2. CÓMO SE EXPORTÓ

```powershell
$exe = "C:\Program Files\WindowsApps\draw.io.draw.ioDiagrams_31.7.0.0_x64__1zh33159kp73c\app\draw.io.exe"

# PNG — evidencia de QA visual, escala 2
& $exe --export --format png --scale 2 --border 4 --output <out.png> <in.drawio>

# PDF — entrega
& $exe --export --format pdf --crop --output <out.pdf> <in.drawio>
```

## 2.1 Verificación previa a exportar el lote

Antes de exportar los 17 se exportó **un `.drawio` mínimo de control**. Exportó bien mientras los
17 de E4 fallaban con `Error: Export failed`. Eso	localizó la causa raíz (§3) **antes** de tocar
nada, y evita el falso positivo de «el export no funciona».

| Archivo de control | Resultado |
|---|---|
| `.drawio` mínimo | **exit 0**, PNG 4 485 bytes |
| `UCD-EVT-02b__GEI_Event_State_Transitions.drawio` (antes del fix) | **exit 1**, `Export failed` |

---

# 3. LA CAUSA RAÍZ QUE EL EXPORT REVELÓ

Los 17 `.drawio` de E4 V1 **no se podían cargar**. El generador escribía los *waypoints* de los
conectores como texto separado por espacios:

```xml
<Array as="points">178,316 268,316 296,158</Array>     <!-- MAL: draw.io no lo parsea -->
```

La forma correcta es un elemento `<mxPoint>` por punto:

```xml
<Array as="points"><mxPoint x="178" y="316" /><mxPoint x="268" y="316" /></Array>
```

El archivo seguía siendo **XML bien formado**, así que el validador de E4 V1 lo daba por bueno.
Consecuencia: en el render, **todos** los conectores colapsaban a una línea recta, y el
export headless fallaba.

> **XML bien formado no es lo mismo que cargable por la herramienta.** Un gate que no comprueba que
> la herramienta pueda cargar el artefacto no puede detectar que el artefacto no carga.

Detalle completo en `GEI_USE_CASE_DIAGRAM_FREEZE_V1_0_1.md` §1 y §3.

---

# 4. INVENTARIO

| Formato | Cantidad | Directorio | Resolución |
|---|---:|---|---|
| **PNG** | **17** | `png/` | 1614 × 924 … 2323 × 1641 px a escala 2 |
| **PDF** | **17** | `pdf/` | A4 landscape, recortado al contenido |

Cada lámina tiene un `.png` y un `.pdf` con el mismo nombre base. Los logs de la CLI (`$base.log.txt`)
se conservan como registro de exit 0 en cada export.

---

# 5. CÓMO REPRODUCIR

```powershell
$exe = "C:\Program Files\WindowsApps\draw.io.draw.ioDiagrams_31.7.0.0_x64__1zh33159kp73c\app\draw.io.exe"
$src = "docs\uml\use-cases\source"

Get-ChildItem $src -Filter *.drawio | ForEach-Object {
  & $exe --export --format png --scale 2 --border 4 --output "docs\uml\use-cases\export\png\$($_.BaseName).png" $_.FullName
  & $exe --export --format pdf --crop --output "docs\uml\use-cases\export\pdf\$($_.BaseName).pdf" $_.FullName
}
```

**Si los `.drawio` se regeneran**, hay que **re-exportar**: los PNG y PDF de aquí son del mismo
commit que los `.drawio`. Si divergen, hay que re-exportar.

---

# 6. QA VISUAL

Se hizo QA visual **sobre estos PNG**, no sobre geometría. Resultado: **17 / 17 PASS**.

Estado intermedio declarado: la corrida E4-0.1 cerró en **16/17** con el FAIL de los 5 rótulos de
relación de `UCD-EVT-02a` (D-10). El FAIL se corrigió en el mismo lote de cierre — banda de rótulos
reservada + solucionador de colisiones — y se **re-exportaron** los archivos afectados antes de
repetir el QA. Detalle y antes/después en `GEI_USE_CASE_DIAGRAM_FREEZE_V1_0_1.md` §10.1.

**No** se acepta «XML válido» como sinónimo de «diagrama legible». **No** se promedia un FAIL
dentro de un PASS.