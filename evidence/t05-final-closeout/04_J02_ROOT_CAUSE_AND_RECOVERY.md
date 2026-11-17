# 04 — J02 Root Cause and Recovery

## Hallazgo
`tests/e2e/t05-journeys.spec.ts` → J02 GROUP con título y dos participantes fallaba de forma persistente (también en reintento aislado).

## Reproducción
Con `gei_test` reconstruida y backend real, el test fallaba en:
```
getByRole('checkbox', { name: /César/ }).check({ force: true })
Error: Clicking the checkbox did not change its state
```

## Investigación (UI → request → estado)
- El checkbox es un input controlado por React dentro de un `label.gei-target`.
- `check({force:true})` hacía clic directo sobre el input; el Estado `targets` no se actualizaba de forma confiable para el segundo participante.
- Al intentar `label` genérico, aparecía ambigüedad de selects (etiqueta del formulario + etiqueta del candidato).

## Causa raíz
**Defecto de test/fixture de interacción**, no de producto: selector incorrecto sobre un control controlado por React. El backend creaba GROUP correctamente cuando los participantes se seleccionaban desde la UI.

## Corrección
Se acciona el `label.gei-target` del candidato (interacción visible real) y se añaden aserciones explícitas `toBeChecked()` antes de crear el grupo. No se eliminó ninguna aserción ni se usó `skip`/`fixme`/retries.

## Revalidación
- 2 ejecuciones aisladas consecutivas: PASS.
- Ejecución integrada `e2e-recovery.xml`: 7/7 PASS (incluye J02 y J05b).
- Creación GROUP real, título persistido, participantes correctos, navegación al detalle y persistencia tras recarga.
