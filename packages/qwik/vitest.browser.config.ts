import { qwikVite } from '@qwik.dev/core/optimizer'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vite'
import { testSSR } from 'vitest-browser-qwik/ssr-plugin'

// Real-browser interaction tests via vitest-browser-qwik (its `render` wires
// Qwik's client + event system, which standalone `render()` does not). Points
// Playwright at the pre-installed browser since downloads are blocked by the
// sandbox network egress policy. See PLAN.md §9.
export default defineConfig({
  plugins: [testSSR(), qwikVite()],
  // skip the dep-scan over the 86 file-linked Zag TS-source packages (it hangs)
  optimizeDeps: {
    noDiscovery: true,
    include: ['@qwik.dev/core', '@qwik.dev/core/testing'],
  },
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
