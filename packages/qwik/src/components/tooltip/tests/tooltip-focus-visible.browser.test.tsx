import { userEvent } from '@vitest/browser/context'
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
it('opens on keyboard focus (focus-visible root effect)', async () => {
  const screen = await render(<ComponentUnderTest openDelay={0} closeDelay={0} />)
  const root = screen.container as HTMLElement
  await userEvent.keyboard('{Tab}')
  await expect
    .poll(() => root.querySelector('[data-testid="trigger"]') === document.activeElement)
    .toBe(true)
  await expect
    .poll(() => root.querySelector('[data-testid="content"]')?.getAttribute('data-state'), { timeout: 3000 })
    .toBe('open')
})
