# 05 — ST-D16 Browser Evidence

Test: `tests/e2e/t05-st-d16.spec.ts` · Chromium · viewport real 390×844 · runId `TRUTH-FINAL-0eb41b49` · CODE REVISION `0eb41b49...`.

## Caso A — Sending → Sent
- Autenticación PLAYER A, conversación DIRECT real.
- Envío desde composer:
  - `expect(page.getByText('Enviando…')).toBeVisible()` → **PASS** (estado Sending).
  - `expect(page.getByText('Enviando…')).toHaveCount(0)` → **PASS**.
  - `expect(page.getByText(body)).toHaveCount(1)` tras recarga → **PASS** (Sent confirmado, persistencia única).

## Caso B — Failed → retry
- Intercepción controlada de `POST **/messages` con HTTP 500.
- `expect(page.getByText('Falló el envío')).toBeVisible()` → **PASS** (Failed).
- Verificación en DB aislada: `select count(*) from app.messages where body=…` → **0** (sin falso éxito persistido).
- `page.unroute()` + click en "Reintentar": spinner desaparece y mensaje aparece confirmado.
- Recarga: `expect(page.getByText(body)).toHaveCount(1)` → **PASS** (sin duplicados).

## Resultado
`e2e-d16.xml`: 2/2 PASS. ST-D16 cuatro criterios (sending, sent, failed, retry) calculados PASS por el verificador con aserción explícita.

Nota: no se usó un mock de respuesta exitosa para demostrar persistencia; el fallo se inyectó en el transporte y la recuperación usó el backend real.
