# E8 — QA VISUAL REPORT V1

**Fecha:** 2026-10-12 · **Método:** inspección directa de los 9 PNG finales (lectura de imagen real, no inferencia).
**Criterios (manifiesto §4.2):** nombres correctos · atributos con tipos/visibilidad · operaciones con firmas · multiplicidades junto al extremo correcto · tipos de relación correctos · cero solapamientos graves · cero texto cortado · cero etiquetas flotantes · cero conectores atravesando texto · sin elementos invisibles ni fuera de página.

## Resultado: 9/9 PASS

| # | Lámina | Veredicto | Estado inicial | Corrección aplicada |
|---|---|---|---|---|
| 1 | CL-00__GEI_Domain_Overview | PASS | FAIL (labels largos R-nn solapando listas; 3 rutas cruzando paquetes) | Labels cortos (`R-01`, `R-04`, …); waypoints por corredores x=400 / y=225 / y=595 |
| 2 | CL-IAM-01__Identity_Access | PASS | OBS (rótulo `0..1` flotante en esquina) | Labels a geometría absoluta; alturas por contenido; rutas cortas explícitas |
| 3 | CL-PPL-01__People_Relationships | PASS | FAIL (Guardian pisaba RoleAssignment; 10 labels flotantes; conectores sobre texto) | Alturas 165/255/255; 7 edges por corredor x=305–346; 10 labels al corredor; lbl6→`0..*` (R-06) |
| 4 | CL-STR-01__Club_Structure | PASS | FAIL (Venue pisaba Team; conectores sobre headers Division/Line; 12 labels flotantes) | Team h=300, Venue y=370; 6 edges por corredor x=306–327; 12 labels al corredor |
| 5 | CL-EVT-01__Events_Calendar | PASS | FAIL (Event L45 desbordaba; solapes serie/override/targets/enums; contenido fuera de página) | Página 1169x1210; alturas por contenido; 8 edges con corredores x=435/806–822 |
| 6 | CL-PRT-01__Participation | PASS | FAIL (diagonal cruzando 3 cajas; solapes services/playerstats/enums; contenido fuera de página) | Página 1169x1420; reroute attentry-person por banda y=660; ortogonal explícito; waypoints válidos |
| 7 | CL-COM-01__Communication | PASS | FAIL (Notification desbordaba; 5 edges a proxies; sin refs Team/Person/Event) | Página 1169x1220; 3 ref boxes añadidas; 5 edges re-apuntados (R-44–R-49); bus derecho x=820–844 |
| 8 | CL-CMP-01__Competition | PASS | FAIL (diagonal extref-entry; títulos fuera de caja; 8 labels sobre texto) | Página 1169x980; vía superior extref-comp (y=55); 8 labels a corredores/bordes |
| 9 | CL-INS-01__Insight_Integrity | PASS | FAIL (diagonal audit-person; solapes report/notas/sources) | Página 1169x935; ruta audit-person ortogonal; notas reubicadas sin solape |

## Defectos residuales menores (no bloqueantes)

- Labels de multiplicidad apoyados sobre líneas de conector en corredores densos (PPL x≈303, STR x≈302, CMP entry-comp). Legibles, sin cruzar texto. Aceptado.
- Vía `extref-comp` (CMP) a 5px bajo el título (banda y=55). Sin cruce de texto. Aceptado.
- Banda horizontal PRT `rel-elig-person` (y=270) a 5px de cajas vecinas. Sin cruce de texto. Aceptado.

## Evidencia de inspección

Los 9 PNG finales fueron abiertos y revisados uno por uno en esta sesión (rondas: 4 iniciales + CL-00 re-QA + 8 finales + PPL/STR + PRT/CMP + INS). Cada PASS corresponde a la imagen exportada desde la fuente final (firmas y tamaños en `E8_EXPORT_MANIFEST_V1.md`).
