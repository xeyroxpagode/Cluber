# E8 — EXPORT MANIFEST V1

**Fecha:** 2026-10-12 · **Herramienta:** `draw.io.exe` MSIX `draw.io.draw.ioDiagrams_32.4.1.0_x64__1zh33159kp73c\app\draw.io.exe` (instalación existente, sin modificaciones al sistema).
**Comando por archivo:** `draw.io.exe -x -f png|pdf -o <destino> <fuente.drawio>`.
**Verificación:** lectura de bytes de cada archivo (PNG `89 50 4E 47`, PDF `%PDF-`) + tamaño > 0. Correspondencia 1:1 fuente→PNG→PDF (mismo basename).

| Fuente (`source/`) | PNG (`export/png/`, bytes) | PDF (`export/pdf/`, bytes) | Página |
|---|---|---|---|
| CL-00__GEI_Domain_Overview.drawio | 284232 | 60959 | 1169x827 |
| CL-IAM-01__Identity_Access.drawio | 406283 | 82081 | 1169x827 |
| CL-PPL-01__People_Relationships.drawio | 452156 | 77458 | 1169x827 |
| CL-STR-01__Club_Structure.drawio | 431796 | 62565 | 1169x827 |
| CL-EVT-01__Events_Calendar.drawio | 797690 | 106645 | 1169x1210 |
| CL-PRT-01__Participation.drawio | 907734 | 95418 | 1169x1420 |
| CL-COM-01__Communication.drawio | 810568 | 109947 | 1169x1220 |
| CL-CMP-01__Competition.drawio | 528092 | 95659 | 1169x980 |
| CL-INS-01__Insight_Integrity.drawio | 541679 | 93248 | 1169x935 |

**Firmas: PNG 9/9 OK · PDF 9/9 OK. Total 18/18.**
