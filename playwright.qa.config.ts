import { defineConfig, devices } from '@playwright/test'

/** Config aislada para la auditoría QA T05 — no modifica playwright.config.ts (baseline T04). */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'evidence/t05-acceptance/playwright-report' }]],
  use: {
    baseURL: 'http://localhost:8444',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'msedge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
  ],
})
