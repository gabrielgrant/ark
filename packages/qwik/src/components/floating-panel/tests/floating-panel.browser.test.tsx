import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

const contentState = (screen: { container: Element }) =>
  (screen.container as HTMLElement).querySelector('[data-testid="content"]')?.getAttribute('data-state')

// `data-stage` is reflected on the Control part (see getControlProps in the
// zag connect); Content only carries the boolean-ish `data-staged`/`data-minimized`.
const controlStage = (screen: { container: Element }) =>
  (screen.container as HTMLElement).querySelector('[data-testid="control"]')?.getAttribute('data-stage')

/**
 * Native DOM `click()` instead of Playwright's pointer-simulated `.click()`
 * — the pointer click stalls against the zag-qwik adapter's document-capture
 * re-dispatch on drag-capable machines (same as drawer/tree-view; PLAN.md
 * Part 5 #0b). Still exercises the real Chromium engine, Qwik's real event
 * system, and the real zag machine.
 *
 * Drag/resize interactions intentionally not asserted (PLAN.md R14).
 */
const click = (el: Element | null) => (el as HTMLElement).click()

it('opens on trigger click, toggles stage, and closes on close-trigger click', async () => {
  const screen = await render(<ComponentUnderTest />)
  const root = screen.container as HTMLElement

  expect(contentState(screen)).toBe('closed')

  click(root.querySelector('[data-testid="trigger"]'))
  await expect.poll(() => contentState(screen)).toBe('open')

  click(root.querySelector('[data-testid="stage-min"]'))
  await expect.poll(() => controlStage(screen)).toBe('minimized')

  click(root.querySelector('[data-testid="stage-default"]'))
  await expect.poll(() => controlStage(screen)).toBe('default')

  click(root.querySelector('[data-testid="close"]'))
  await expect.poll(() => contentState(screen)).toBe('closed')

  // settle: let the machine's rAF-deferred close work (focus restore,
  // dismissable teardown) finish before the container unmounts — otherwise
  // Qwik's cursor flush races it into an unhandled "insertBefore" error
  // (pre-existing Qwik-core error class, see drawer.browser.test.tsx).
  await new Promise((resolve) => setTimeout(resolve, 250))
})
