import { test, expect, type Page } from '@playwright/test'
import { resetMessagingState } from './t05-qa-reset'

const PASSWORD = 'GeiDemo2026!Demo'
const A = 't05-player-a@example.com'

async function login(page: Page, email: string) {
  await page.goto('/login')
  await page.getByLabel('Correo electrónico').fill(email)
  await page.getByLabel('Contraseña').fill(PASSWORD)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await page.waitForURL('**/home', { timeout: 20000 })
}
async function openDirect(page: Page) {
  await page.goto('/communication/conversations/new')
  await page.getByRole('radio', { name: /Belén/ }).check({ force: true })
  await page.getByRole('button', { name: /Crear conversación/ }).click()
  await page.waitForURL((u) => /\/conversations\/[0-9a-f-]{36}/.test(u.pathname), { timeout: 20000 })
  return new URL(page.url()).pathname.split('/').pop()!
}

test.beforeEach(async () => { await resetMessagingState() })

test('ST-D16 Caso A — Sending visible y transición a Sent con persistencia única', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await ctx.newPage()
  await login(page, A)
  const convId = await openDirect(page)
  const body = `D16-success-${Date.now()}`

  await page.getByPlaceholder('Escribí un mensaje…').fill(body)
  await page.getByRole('button', { name: /Enviar mensaje/ }).click()
  // Sending: burbuja optimista con estado explícito.
  await expect(page.getByText('Enviando…')).toBeVisible({ timeout: 5000 })
  // Sent: desaparece el spinner y aparece el mensaje confirmado por el servidor.
  await expect(page.getByText('Enviando…')).toHaveCount(0, { timeout: 15000 })
  await expect(page.getByText(body).first()).toBeVisible({ timeout: 15000 })

  await page.reload()
  await expect(page.getByText(body)).toHaveCount(1, { timeout: 15000 })
  expect(new URL(page.url()).pathname).toContain(convId)
  await ctx.close()
})

test('ST-D16 Caso B — Failed controlado, sin falso éxito y retry sin duplicados', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await ctx.newPage()
  await login(page, A)
  await openDirect(page)
  const body = `D16-failure-${Date.now()}`

  await page.route('**/messages', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: { code: 'INTERNAL_ERROR', message: 'Falla controlada', traceId: 'd16', retryable: true } }),
      })
      return
    }
    await route.continue()
  })
  await page.getByPlaceholder('Escribí un mensaje…').fill(body)
  await page.getByRole('button', { name: /Enviar mensaje/ }).click()
  await expect(page.getByText('Falló el envío')).toBeVisible({ timeout: 15000 })
  await expect(page.getByText('Enviando…')).toHaveCount(0, { timeout: 15000 })
  // El borrador fallido se conserva en la tarjeta de error, pero NO se confirma ni persiste.
  await expect(page.locator('div').filter({ hasText: 'Falló el envío' }).last().getByText(body)).toBeVisible()
  const db = new (await import('pg')).default.Client({ connectionString: 'postgresql://postgres:postgres@127.0.0.1:56322/gei_test' })
  await db.connect()
  const persisted = await db.query('select count(*)::int n from app.messages where body=$1', [body])
  await db.end()
  expect(persisted.rows[0].n).toBe(0) // sin falso éxito persistido

  await page.unroute('**/messages')
  await page.getByRole('button', { name: 'Reintentar' }).click()
  await expect(page.getByText('Enviando…')).toHaveCount(0, { timeout: 15000 })
  await expect(page.getByText(body).first()).toBeVisible({ timeout: 15000 })
  await page.reload()
  await expect(page.getByText(body)).toHaveCount(1, { timeout: 15000 })
  await ctx.close()
})
