import { existsSync } from 'node:fs'
import { qwikVite } from '@qwik.dev/core/optimizer'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vite'
import { testSSR } from 'vitest-browser-qwik/ssr-plugin'

// Real-browser interaction tests via vitest-browser-qwik, whose `render` wires
// Qwik's client + event system. See PLAN.md §9.
//
// Use a pre-installed Chromium when present (e.g. sandboxes where Playwright's
// browser download is blocked); otherwise fall back to Playwright's managed
// browser so the config stays portable.
const presetChromium = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const launchOptions = existsSync(presetChromium)
  ? { executablePath: presetChromium, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
  : {}

export default defineConfig({
  plugins: [testSSR(), qwikVite()],
  test: {
    include: ['src/**/*.browser.test.{ts,tsx}'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({ launchOptions }),
      instances: [{ browser: 'chromium' }],
    },
  },
})
