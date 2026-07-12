import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

const contentState = (screen: { container: Element }) =>
  (screen.container as HTMLElement).querySelector('[data-testid="content"]')?.getAttribute('data-state')

/**
 * Native DOM `click()` instead of Playwright's pointer-simulated `.click()`:
 * the pointer click's dispatch stalls against the zag-qwik adapter's
 * document-capture re-dispatch on this machine (Playwright's call log stops
 * at "performing click action" and times out) — the same adapter timing
 * family as tree-view's clicks and PLAN.md Part 5 #0b. `element.click()`
 * still exercises the real Chromium engine, Qwik's real event system, and
 * the real zag machine — verified: open AND close both transition correctly.
 */
const click = (el: Element | null) => (el as HTMLElement).click()

/**
 * Single `render()` call per file: `@zag-js/drawer`'s registry
 * (`drawer.registry.ts`) is a module-level singleton shared by every drawer
 * machine in this file's process. A second `render()` (a second Qwik
 * container) leaves the previous container's subscriber registered on that
 * singleton, and the next machine's notify touches a signal from the
 * disposed container — Qwik throws "Do not use signals across containers".
 *
 * Drag/swipe (snap points) is intentionally not asserted (PLAN.md R14 —
 * keyboard/click only).
 */
it('opens on trigger click, reports onOpenChange, and closes on close-trigger click', async () => {
  const calls: Array<{ open: boolean }> = []
  const screen = await render(<ComponentUnderTest onOpenChange={(details) => calls.push(details)} />)
  const root = screen.container as HTMLElement

  expect(contentState(screen)).toBe('closed')

  click(root.querySelector('[data-testid="trigger"]'))
  await expect.poll(() => contentState(screen)).toBe('open')
  await expect.poll(() => calls.length).toBe(1)
  expect(calls[0]).toEqual({ open: true })

  click(root.querySelector('[data-testid="close"]'))
  await expect.poll(() => contentState(screen)).toBe('closed')
  await expect.poll(() => calls.length).toBe(2)
  expect(calls[1]).toEqual({ open: false })

  // settle: the machine schedules rAF-deferred work around the close
  // transition (focus restore, dismissable teardown); unmounting the test
  // container while that is in flight races Qwik's cursor flush into an
  // unhandled "insertBefore ... not a child" error (the pre-existing
  // Qwik-core error class seen as a rotating flake at suite level).
  await new Promise((resolve) => setTimeout(resolve, 250))
})
