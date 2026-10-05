# `docs/uml/use-cases/evidence/` — EVIDENCIA DE E4

Este directorio guarda la evidencia **machine-generated** de la Etapa 4. No contiene
capturas porque no hubo renderizador (ver `../export/README.md`).

| Archivo | Qué es | Cómo se produce |
|---|---|---|
| `GEI_DRAWIO_VALIDATION_REPORT.txt` | Informe de validación: XML, cobertura, actores, relaciones, generalizaciones, geometría | `node scripts/validate-drawio-use-cases.mjs` |
| `_layout-report.json` | Métricas geométricas por lámina: columnas, aristas, cruces, penetración, desbordes de texto | `node scripts/generate-use-case-diagrams.mjs` |
| `_manifest-data.json` | Filas del manifiesto derivadas de los `.drawio` reales | `node scripts/validate-drawio-use-cases.mjs` |

Los tres se regeneran con los comandos de `../GEI_USE_CASE_DIAGRAM_MANIFEST_V1.md` §7.

## Lo que estos archivos SÍ demuestran

- Los 17 `.drawio` parsean como XML bien formado y tienen `<mxfile>`, `<diagram>` y `<mxGraphModel>`.
- Los IDs de `mxCell` son únicos y todas las referencias `parent` y `source`/`target` resuelven.
- Los 102 CU canónicos aparecen, cada uno en la lámina de su propio dominio, con su nombre exacto.
- Los 8 actores dibujados son exactamente los del catálogo E2.
- Las 50 relaciones dibujadas son todas candidatas de E3; ninguna rechazada aparece.
- Ninguna generalización dibujada existe fuera de las seis de E2 §11.1.
- Ningún actor queda dentro del *system boundary* y ningún CU fuera.
- Ningún texto desborda su elipse (cálculo del rectángulo inscrito de la elipse).
- Ningún conector atraviesa una forma o un texto.

## Lo que estos archivos NO demuestran

- **Que las láminas se vean bien.** No hubo render. Un XML válido no es sinónimo de diagrama
  legible, y el propio brief §40 lo dice: *«No aceptar "XML válido" como sinónimo de "diagrama
  legible"»*. Por eso E4 declara su gate de QA visual como **PARTIAL** y no PASS.
- **Que los cruces residuales sean aceptables para un humano.** El recuento de cruces es una
  métrica geométrica; si un profesor los encuentra confusos, hace falta reordenar la lámina.
- **Nada del comportamiento.** No hay caminos felices, ni alternativos, ni precondiciones
  detalladas. Eso es E5.

## Nota sobre `_layout-report.json` y `_manifest-data.json`

El prefijo `_` los marca como artefactos intermedios regenerables, no como entregables. La
entrega es el informe `.txt`, que es el único que se cita en el freeze y en el gate.
