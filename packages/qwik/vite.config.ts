import { qwikVite } from '@qwik.dev/core/optimizer'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [qwikVite()],
  test: {
    globals: true,
    // headless SSR/render tests only; interaction tests live in
    // *.browser.test.tsx and run via vitest.browser.config.ts (real browser).
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/*.browser.test.{ts,tsx}'],
  },
})
