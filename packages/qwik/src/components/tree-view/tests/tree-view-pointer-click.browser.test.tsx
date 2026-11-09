import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

/**
 * Coverage re-enabled by the rebased adapter branch (@zag-js/qwik 1.42.0 /
 * Qwik 2.0.0-rc.4): this scenario was blocked by a documented adapter issue
 * (PLAN.md Part 5 #0 family) on the previous branch and now passes.
 *
 * Kept in its own single-test file on purpose: it must run as the page's
 * FIRST render() -- second and later containers run with Qwik rc.4's broken
 * event dispatch (see src/qwik-regressions/) which re-breaks pointer
 * semantics for reasons unrelated to the adapter.
 */
it('expands a branch on a real Playwright pointer click', async () => {
  const screen = await render(<ComponentUnderTest />)
  const root = screen.container as HTMLElement
  await screen.getByTestId('branch-trigger-node_modules').click()
  await expect
    .poll(() => root.querySelector('[data-testid="branch-node_modules"]')?.getAttribute('aria-expanded'), {
      timeout: 3000,
    })
    .toBe('true')
})
