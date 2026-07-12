import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

/**
 * Native DOM `element.click()`, not a Playwright pointer-simulated click:
 * PLAN.md Part 5 #0b documents that a real pointer click on a tree-view
 * branch-control (which has a roving `tabIndex` and its own `onFocus`
 * handler) can be silently swallowed by the zag-qwik adapter's
 * document-capture event re-dispatch. See `tree-view.browser.test.tsx` for
 * the full repro notes; this is the same underlying part reused here.
 */
const click = (el: Element | null) => (el as HTMLElement).click()

it('clicking a branch control toggles its expanded state and reveals its items', async () => {
  const screen = await render(<ComponentUnderTest />)
  const root = screen.container as HTMLElement

  const branchControl = () => root.querySelector('[data-part="branch-control"]')

  const branchContent = () => root.querySelector('[data-part="branch-content"]')

  await expect.poll(() => branchControl()?.getAttribute('data-state')).toBe('closed')
  await expect.poll(() => branchContent()?.hasAttribute('hidden')).toBe(true)

  click(branchControl())

  await expect.poll(() => branchControl()?.getAttribute('data-state')).toBe('open')
  await expect.poll(() => branchContent()?.hasAttribute('hidden')).toBe(false)
  await expect.poll(() => root.querySelector('[data-part="item"]')).toBeTruthy()

  click(branchControl())
  await expect.poll(() => branchControl()?.getAttribute('data-state')).toBe('closed')
})
