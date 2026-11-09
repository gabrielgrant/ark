import { userEvent } from '@vitest/browser/context'
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
it('focuses a segment on a real Playwright pointer click', async () => {
  const screen = await renderReady(<ComponentUnderTest name="date" />)
  const root = screen.container as HTMLElement
  const segment = root.querySelectorAll('[role="spinbutton"]')[0] as HTMLElement
  await screen.getByRole('spinbutton').nth(0).click()
  await expect.poll(() => document.activeElement === segment, { timeout: 3000 }).toBe(true)
  await userEvent.keyboard('6')
  await expect.poll(() => segment.textContent).toContain('6')
})
