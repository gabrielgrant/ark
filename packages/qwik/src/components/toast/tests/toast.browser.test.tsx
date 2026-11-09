import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

const toastRoot = (screen: { container: Element }) =>
  (screen.container as HTMLElement).querySelector('[data-testid="toast-root"]')

/**
 * Interaction tests — real browser via vitest-browser-qwik (see
 * vitest.browser.config.ts). The headless SSR harness can never exercise
 * this component meaningfully (PLAN.md R5): toasts are created imperatively
 * from a client event handler, so a server render always shows an empty
 * group.
 *
 * Previously skipped: on the pre-rc.4 adapter branch, any toast transition
 * that started rAF-based machine work (`setRafTimeout` duration timers,
 * dismiss) deadlocked against the adapter's `installRafRenderGate`, hanging
 * the tab after the test body finished. FIXED by the rebased adapter
 * (@zag-js/qwik 1.42.0 / Qwik 2.0.0-rc.4 branch): the full
 * show -> dismiss cycle passes with no post-test hang.
 *
 * Ordering constraint: this interactive test must be the FILE'S FIRST
 * `render()`. Run after another `render()` of the fixture, the click is
 * delivered and `toaster.create()` adds the toast to the shared module-level
 * toaster, but no `<Toaster>` renders it. This is not the Qwik dispatch
 * regression (`renderReady()` does not help); the cause is not yet known
 * (PLAN.md Part 5 #0q). The static region assertion below tolerates running
 * second.
 */
it('shows a toast from a trigger click and dismisses it via the close trigger', async () => {
  const screen = await render(<ComponentUnderTest />)

  await screen.getByTestId('show-toast').click()
  await expect.poll(() => toastRoot(screen)).toBeTruthy()
  expect(toastRoot(screen)?.textContent).toContain('Saved')
  expect(toastRoot(screen)?.textContent).toContain('Your changes have been saved.')

  await screen.getByTestId('toast-close').click()
  await expect.poll(() => toastRoot(screen)).toBeFalsy()
})

it('reflects toast group region attributes', async () => {
  const screen = await render(<ComponentUnderTest />)
  const region = screen.getByRole('region')

  await expect.element(region).toHaveAttribute('data-placement', 'bottom')
  await expect.element(region).toHaveAttribute('aria-live', 'polite')
  expect(toastRoot(screen)).toBeFalsy()
})
