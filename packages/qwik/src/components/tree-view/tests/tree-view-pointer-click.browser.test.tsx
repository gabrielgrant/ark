import { expect, it } from 'vitest'
import { renderReady } from '../../../tests/render-ready.ts'
import { ComponentUnderTest } from './basic.tsx'

/**
 * Coverage re-enabled by the rebased adapter branch (@zag-js/qwik 1.42.0 /
 * Qwik 2.0.0-rc.4): this scenario was blocked by a documented adapter issue
 * (PLAN.md Part 5 #0 family) on the previous branch and now passes.
 *
 * Uses `renderReady()` so dispatch is synchronous no matter where this test
 * runs (see src/qwik-regressions/dispatch-after-render.browser.test.tsx).
 */
it('expands a branch on a real Playwright pointer click', async () => {
  const screen = await renderReady(<ComponentUnderTest />)
  const root = screen.container as HTMLElement
  await screen.getByTestId('branch-trigger-node_modules').click()
  await expect
    .poll(() => root.querySelector('[data-testid="branch-node_modules"]')?.getAttribute('aria-expanded'), {
      timeout: 3000,
    })
    .toBe('true')
})
