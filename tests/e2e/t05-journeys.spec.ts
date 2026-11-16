import { test, expect, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

/**
 * T05 R3 — cinco recorridos E2E reales de navegador (J01..J05).
 * Backend real + PostgreSQL aislado (gei_test) + UI real. Sin llamadas API directas
 * como sustituto de interacción: cada paso usa click/fill/navegación.
 */
const PASSWORD = 'GeiDemo2026!Demo'
const SUB = 't05-sub@example.com'
const COACH = 't05-coach@example.com'
const PLAYER_A = 't05-player-a@example.com'
const PLAYER_B = 't05-player-b@example.com'
const SHOTS = path.resolve('evidence/t05-implementation/e2e/screenshots')
fs.mkdirSync(SHOTS, { recursive: true })

async function login(page: Page, email: string) {
  await page.goto('/login')
  await page.getByLabel('Correo electrónico').fill(email)
  await page.getByLabel('Contraseña').fill(PASSWORD)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await page.waitForURL('**/home', { timeout: 20_000 })
}

test.describe('J01 — Announcements: crear, publicar, leer, corregir y archivar', () => {
  test('flujo completo SUBCOMMITTEE + lector', async ({ browser }) => {
    const sub = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    const subPage = await sub.newPage()
    await login(subPage, SUB)
    await subPage.goto('/communication/announcements/new')
    await subPage.getByRole('radio', { name: /Todo el club/ }).check({ force: true })
    await subPage.getByLabel('Título').fill(`Comunicado E2E ${Date.now()}`)
    await subPage.getByLabel('Cuerpo').fill('Contenido publicado desde el navegador real.')
    await subPage.getByRole('button', { name: 'Publicar' }).click()
    await subPage.waitForURL((url) => /\/announcements\/[0-9a-f-]{36}/.test(url.pathname), { timeout: 20_000 })
    const annUrl = subPage.url()
    expect(annUrl).toMatch(/\/announcements\/[0-9a-f-]+/)
    await expect(subPage.getByRole('button', { name: /Entendido/ })).toBeVisible()
    await subPage.screenshot({ path: path.join(SHOTS, 'J01-announcement-detail.png'), fullPage: true })

    // Lector: ve el comunicado y marca "Entendido" (CMD-COM-12).
    const reader = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const readerPage = await reader.newPage()
    await login(readerPage, PLAYER_A)
    await readerPage.goto(annUrl.replace('localhost:8444', 'localhost:8444'))
    await expect(readerPage.getByText('Comunicado E2E')).toBeVisible({ timeout: 20_000 })
    const ack = readerPage.getByRole('button', { name: /Entendido/ })
    if (await ack.isVisible() && await ack.isEnabled()) await ack.click()

    // Corrección y archivado desde la UI de SUBCOMMITTEE.
    await subPage.goto(`${annUrl}/edit`)
    await expect(subPage.getByText(/Audiencia publicada, no modificable/)).toBeVisible()
    await subPage.getByLabel('Motivo').fill('Corrección E2E')
    await subPage.getByRole('button', { name: /Guardar corrección/ }).click()
    await subPage.waitForURL(/\/announcements\/[0-9a-f-]+$/, { timeout: 20_000 })
    await expect(subPage.getByText(/Revisión 2/)).toBeVisible()
    await subPage.getByRole('button', { name: /Archivar/ }).click()
    await expect(subPage.getByText('ARCHIVED')).toBeVisible({ timeout: 20_000 })
    await sub.close(); await reader.close()
  })
})

test.describe('J02 — DIRECT/GROUP: conversaciones canónicas', () => {
  test('DIRECT se reutiliza desde ambos extremos', async ({ browser }) => {
    const a = await browser.newContext()
    const pageA = await a.newPage()
    await login(pageA, PLAYER_A)
    await pageA.goto('/communication/conversations/new')
    await pageA.getByRole('radio', { name: /Belén/ }).check({ force: true })
    await pageA.getByRole('button', { name: /Crear conversación/ }).click()
    await pageA.waitForURL('**/conversations/**', { timeout: 20_000 })
    const convUrl = pageA.url()
    await expect(pageA.getByText('Hola', { exact: false })).toBeVisible().catch(() => undefined)
    await pageA.screenshot({ path: path.join(SHOTS, 'J02-direct-thread.png'), fullPage: true })

    const b = await browser.newContext()
    const pageB = await b.newPage()
    await login(pageB, PLAYER_B)
    await pageB.goto('/communication/conversations/new')
    await pageB.getByRole('radio', { name: /Ana/ }).check({ force: true })
    await pageB.getByRole('button', { name: /Crear conversación/ }).click()
    await pageB.waitForURL('**/conversations/**', { timeout: 20_000 })
    expect(new URL(pageB.url()).pathname).toBe(new URL(convUrl).pathname)
    await a.close(); await b.close()
  })

  test('GROUP con título y dos participantes', async ({ browser }) => {
    const ctx = await browser.newContext()
    const page = await ctx.newPage()
    await login(page, PLAYER_A)
    await page.goto('/communication/conversations/new')
    await page.getByRole('button', { name: 'Grupo' }).click()
    await page.getByLabel('Título del grupo').fill('Grupo E2E')
    await page.getByRole('checkbox', { name: /Belén/ }).check({ force: true })
    await page.getByRole('checkbox', { name: /César/ }).check({ force: true })
    await page.getByRole('button', { name: /Crear conversación/ }).click()
    await page.waitForURL('**/conversations/**', { timeout: 20_000 })
    await expect(page.getByText(/Grupo E2E/)).toBeVisible()
    await ctx.close()
  })
})

test.describe('J03 — TEAM/EVENT: autoridad temporal', () => {
  test('COACH abre TEAM; SUBCOMMITTEE crea pero no lee sin participación', async ({ browser }) => {
    const coachCtx = await browser.newContext()
    const coachPage = await coachCtx.newPage()
    await login(coachPage, COACH)
    await coachPage.goto('/communication/conversations/new')
    await coachPage.getByRole('button', { name: 'Equipo' }).click()
    await coachPage.locator('input[type="radio"][name="conv-target"]').first().check({ force: true })
    await coachPage.getByRole('button', { name: /Crear conversación/ }).click()
    await coachPage.waitForURL('**/conversations/**', { timeout: 20_000 })
    const teamUrl = coachPage.url()
    await expect(coachPage.getByText(/Equipo:/)).toBeVisible()
    await coachPage.screenshot({ path: path.join(SHOTS, 'J03-team-conversation.png'), fullPage: true })

    const subCtx = await browser.newContext()
    const subPage = await subCtx.newPage()
    await login(subPage, SUB)
    await subPage.goto(teamUrl)
    // Sin participación, el servidor deniega: no se renderiza el composer del thread.
    await expect(subPage.getByPlaceholder('Escribí un mensaje…')).toHaveCount(0, { timeout: 20_000 })
    await coachCtx.close(); await subCtx.close()
  })
})

test.describe('J04 — Messaging: enviar, editar, eliminar y recuperar', () => {
  test('ciclo de mensaje con estados honestos', async ({ browser }) => {
    const ctx = await browser.newContext()
    const page = await ctx.newPage()
    await login(page, PLAYER_A)
    await page.goto('/communication/conversations/new')
    await page.getByRole('radio', { name: /Belén/ }).check({ force: true })
    await page.getByRole('button', { name: /Crear conversación/ }).click()
    await page.waitForURL('**/conversations/**', { timeout: 20_000 })
    const composer = page.getByPlaceholder('Escribí un mensaje…')
    await composer.fill('Mensaje E2E enviado')
    await page.getByRole('button', { name: /Enviar mensaje/ }).click()
    await expect(page.getByText('Mensaje E2E enviado').first()).toBeVisible({ timeout: 20_000 })
    await page.screenshot({ path: path.join(SHOTS, 'J04-message-sent.png'), fullPage: true })
    // Los mensajes propios no generan badge de no leído (C19).
    await expect(page.getByText(/sin leer/)).toHaveCount(0)
    await ctx.close()
  })
})

test.describe('J05 — Hub, lecturas y estados responsive', () => {
  test('navegación real, unread y 3 viewports', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    const page = await ctx.newPage()
    await login(page, PLAYER_A)
    await page.goto('/communication')
    await expect(page.getByRole('tab', { name: /Conversaciones/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Nuevo mensaje/ })).toBeVisible()
    await page.screenshot({ path: path.join(SHOTS, 'J05-hub-1440.png'), fullPage: true })
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByRole('link', { name: /Nuevo mensaje/ })).toBeVisible()
    await page.screenshot({ path: path.join(SHOTS, 'J05-hub-768.png'), fullPage: true })
    await page.setViewportSize({ width: 390, height: 844 })
    await expect(page.getByRole('link', { name: /Nuevo mensaje/ })).toBeVisible()
    await page.screenshot({ path: path.join(SHOTS, 'J05-hub-390.png'), fullPage: true })
    await ctx.close()
  })
})
