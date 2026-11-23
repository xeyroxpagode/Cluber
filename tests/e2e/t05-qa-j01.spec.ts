import { test, expect, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { resetMessagingState } from './t05-qa-reset'

test.beforeEach(async () => { await resetMessagingState() })

const PASSWORD = 'GeiDemo2026!Demo'
const SUB = 't05-sub@example.com'
const A = 't05-player-a@example.com'
const SHOTS = path.resolve('evidence/t05-acceptance/screenshots')
fs.mkdirSync(SHOTS, { recursive: true })

async function login(page: Page, email: string) {
  await page.goto('/login')
  await page.getByLabel('Correo electrónico').fill(email)
  await page.getByLabel('Contraseña').fill(PASSWORD)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await page.waitForURL('**/home', { timeout: 20000 })
}
async function fillReact(page: Page, selector: string, value: string) {
  await page.locator(selector).waitFor({ state: 'attached', timeout: 15000 })
  await page.evaluate(({ selector, value }) => {
    const el = document.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement
    const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
    Object.getOwnPropertyDescriptor(proto, 'value')!.set!.call(el, value)
    el.dispatchEvent(new Event('input', { bubbles: true }))
  }, { selector, value })
}

test('J01 — DRAFT sin audiencia, recuperación, publicación, notificación, corrección y archivado', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await ctx.newPage()
  await login(page, SUB)
  await page.goto('/communication')
  await page.getByRole('tab', { name: /Comunicados/ }).click()
  await page.getByRole('link', { name: /Nuevo comunicado/ }).click()
  await page.waitForURL('**/communication/announcements/new')

  // Campos marcados como obligatorios (T05-QA-003 corregido).
  await expect(page.locator('#ann-title')).toHaveAttribute('required', '')
  await expect(page.locator('#ann-body')).toHaveAttribute('required', '')

  // T05-QA-001 corregido: DRAFT sin audiencia se guarda.
  await fillReact(page, '#ann-title', `Borrador QA ${Date.now()}`)
  await fillReact(page, '#ann-body', 'Cuerpo del borrador sin audiencia')
  await page.getByRole('button', { name: 'Guardar borrador' }).click()
  await page.waitForURL((u) => /\/announcements\/[0-9a-f-]{36}/.test(u.pathname), { timeout: 20000 })
  const annUrl = page.url()
  await expect(page.getByText('DRAFT')).toBeVisible()
  await page.screenshot({ path: path.join(SHOTS, 'J01-draft-saved.png'), fullPage: true })

  // T05-QA-002 corregido: affordance visible de edición desde el detalle del DRAFT.
  await expect(page.getByRole('button', { name: /Editar borrador/ })).toBeVisible()
  await page.getByRole('button', { name: /Editar borrador/ }).click()
  await page.waitForURL('**/edit')
  await expect(page.getByRole('heading', { name: 'Editar borrador' })).toBeVisible({ timeout: 15000 })
  await fillReact(page, '#ann-title', 'Borrador QA recuperado y editado')
  await page.getByRole('button', { name: 'Guardar borrador' }).click()
  await page.waitForURL(/\/announcements\/[0-9a-f-]{36}$/, { timeout: 20000 })
  await page.reload()
  await expect(page.getByText('Borrador QA recuperado y editado')).toBeVisible({ timeout: 15000 })

  // Audiencia explícita y publicación.
  await page.goto(`${annUrl}/edit`)
  await page.getByText('Todo el club (intención explícita)').click()
  await page.getByRole('button', { name: 'Publicar' }).click()
  await page.waitForURL(/\/announcements\/[0-9a-f-]{36}$/, { timeout: 20000 })
  await expect(page.getByText('PUBLISHED')).toBeVisible()
  const id = annUrl.split('/').pop()!

  // NOT-07 en destinatario.
  const reader = await browser.newContext()
  const rp = await reader.newPage()
  await login(rp, A)
  await rp.goto('/notifications')
  await expect(rp.getByText('Borrador QA recuperado y editado').first()).toBeVisible({ timeout: 15000 })
  await expect(rp.getByText('ANUNCIO PUBLICADO').first()).toBeVisible()
  const noteRow = rp.locator('li').filter({ hasText: 'Borrador QA recuperado y editado' }).first()
  await expect(noteRow.getByText('Sin leer')).toHaveCount(1, { timeout: 15000 })
  await rp.getByRole('button', { name: 'Marcar leído' }).click()
  await expect(noteRow.getByText('Sin leer')).toHaveCount(0, { timeout: 15000 })
  await rp.reload()
  const noteRowAfter = rp.locator('li').filter({ hasText: 'Borrador QA recuperado y editado' })
  await expect(noteRowAfter.getByText('Sin leer')).toHaveCount(0, { timeout: 15000 })

  // Corrección + archivado.
  await page.goto(`${annUrl}/edit`)
  await fillReact(page, '#ann-title', 'Comunicado QA corregido')
  await fillReact(page, '#ann-reason', 'Corrección QA V1')
  await page.getByRole('button', { name: /Guardar corrección/ }).click()
  await page.waitForURL(/\/announcements\/[0-9a-f-]{36}$/, { timeout: 20000 })
  await expect(page.getByText('Revisión 2')).toBeVisible()
  await page.getByRole('button', { name: /Archivar/ }).click()
  await expect(page.getByText('ARCHIVED')).toBeVisible({ timeout: 15000 })
  await expect(page.getByText(/Publicado/)).toBeVisible()
  void id
  await ctx.close(); await reader.close()
})
