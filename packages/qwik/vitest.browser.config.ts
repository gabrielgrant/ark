import { qwikVite } from '@qwik.dev/core/optimizer'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vite'

// Runs interaction tests in a real Chromium (so `@qwik.dev/core/build`'s
// `isServer` is false and the Zag machine actually starts — see PLAN.md §9).
// Points Playwright at the pre-installed browser since downloads are blocked
// by the sandbox network egress policy.
export default defineConfig({
  plugins: [qwikVite()],
  test: {
    include: ['src/**/*.browser.test.{ts,tsx}'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({
        launchOptions: {
          executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      }),
      instances: [{ browser: 'chromium' }],
    },
  },
})
