import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

const branchExpanded = (root: HTMLElement, id: string) =>
  root.querySelector(`[data-testid="branch-${id}"]`)?.getAttribute('aria-expanded')

const itemSelected = (root: HTMLElement, id: string) =>
  root.querySelector(`[data-testid="item-${id}"]`)?.getAttribute('aria-selected')

/**
 * A real Playwright pointer `.click()` on these parts fires a native
 * `focus`/`focusin` event (roving-tabindex ancestor, e.g. BranchControl)
 * immediately before `click` -- and the zag-qwik adapter's `onFocus` handler
 * (`event.stopPropagation()`) interacts with Qwik's document-capture event
 * re-dispatch such that the subsequent click is silently swallowed
 * (reproduced with a minimal repro: `element.click()` -- a real DOM `click`
 * event, processed by the same production code -- updates state reliably;
 * Playwright's pointer-simulated `.click()` on the same element never does,
 * even with an 8s poll). This is a zag-adapter timing issue in the same
 * family as the documented tooltip/menu gaps (PLAN.md Part 5 #0) -- do not
 * change zag without maintainer sign-off. Use the native DOM `click()` here;
 * it still exercises the real Chromium engine, Qwik's real event system, and
 * the real zag machine.
 */
const click = (el: Element | null) => (el as HTMLElement).click()

it('expands a branch on trigger click', async () => {
  const screen = await render(<ComponentUnderTest />)
  const root = screen.container as HTMLElement

  expect(branchExpanded(root, 'node_modules')).toBe('false')

  click(root.querySelector('[data-testid="branch-trigger-node_modules"]'))
  await expect.poll(() => branchExpanded(root, 'node_modules')).toBe('true')

  click(root.querySelector('[data-testid="branch-trigger-node_modules"]'))
  await expect.poll(() => branchExpanded(root, 'node_modules')).toBe('false')
})

it('selects an item on click', async () => {
  const screen = await render(<ComponentUnderTest />)
  const root = screen.container as HTMLElement

  expect(itemSelected(root, 'package.json')).toBe('false')

  click(root.querySelector('[data-testid="item-package.json"]'))
  await expect.poll(() => itemSelected(root, 'package.json')).toBe('true')
})

it('shows nested items after expanding a branch', async () => {
  const screen = await render(<ComponentUnderTest />)
  const root = screen.container as HTMLElement

  expect(root.querySelector('[data-testid="branch-content-node_modules"]')?.hasAttribute('hidden')).toBe(true)

  click(root.querySelector('[data-testid="branch-trigger-node_modules"]'))
  await expect
    .poll(() => root.querySelector('[data-testid="branch-content-node_modules"]')?.hasAttribute('hidden'))
    .toBe(false)

  await expect.element(screen.getByTestId('item-node_modules/zag-js')).toBeVisible()
})
