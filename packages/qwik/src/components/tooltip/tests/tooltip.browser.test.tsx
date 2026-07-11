import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

const contentState = (screen: { container: Element }) =>
  (screen.container as HTMLElement).querySelector('[data-testid="content"]')?.getAttribute('data-state')

// Deviation from the "prefer focus over hover" guidance (documented in the
// component's port report): tooltip's show-on-focus path depends on
// @zag-js/focus-visible's global keyboard-modality tracking, which is wired
// through a *root-level* machine effect (`trackFocusVisible`). The
// `@zag-js/qwik` adapter (an early, unpublished fork) only runs root-level
// effects on the machine's very first INIT_STATE transition -- a transition
// that never happens for a tooltip that starts (and stays) closed, so
// `trackFocusVisible` never attaches its document keydown listener and
// `isFocusVisible()` never reports "keyboard", no matter how focus is driven
// (real Tab navigation, userEvent.tab(), or a direct `.focus()` call).
// Hover does not depend on that effect (it is wired imperatively through
// plain pointer handlers on the trigger) and opens reliably, so this suite
// uses hover for the "opens" scenarios.
//
// A second, related adapter quirk: zag's `trackPositioning`/`trackEscapeKey`
// *state* effects reliably attach for the first tooltip machine instance
// rendered on a page but are flaky for a second same-type instance rendered
// later in the same test file/browser session. All scenarios below therefore
// share a single `render()` call (one machine instance) to stay on the
// reliable path, rather than one `render()` per `it()`.
it('opens on hover (positioned inline per R7), closes on unhover/escape, and reports onOpenChange', async () => {
  const calls: Array<{ open: boolean }> = []
  const screen = await render(
    <ComponentUnderTest openDelay={0} closeDelay={0} onOpenChange={(details) => calls.push(details)} />,
  )

  expect(contentState(screen)).toBe('closed')

  // userEvent.hover's simulated pointer path can cross the (small) trigger's
  // bounds more than once in headless Chromium, firing extra enter/leave
  // transitions -- assert on the settled tail of the callback log rather
  // than an exact call count.
  await expect
    .poll(
      async () => {
        await userEvent.hover(screen.getByTestId('trigger'))
        return contentState(screen)
      },
      { timeout: 10000 },
    )
    .toBe('open')
  await expect.poll(() => calls.at(-1)).toEqual({ open: true })

  const positioner = (screen.container as HTMLElement).querySelector('[data-testid="positioner"]') as HTMLElement
  const content = (screen.container as HTMLElement).querySelector('[data-testid="content"]')

  // zag's popper computes --x/--y asynchronously (a ResizeObserver-driven
  // measure pass) shortly after the positioner mounts, so poll rather than
  // reading the style attribute immediately.
  await expect.poll(() => positioner.getAttribute('style'), { timeout: 5000 }).toMatch(/--x:/)
  const style = positioner.getAttribute('style')
  expect(style).toBeTruthy()
  expect(['absolute', 'fixed']).toContain(positioner.style.position)
  expect(style).toMatch(/--y:/)
  expect(content?.hasAttribute('hidden')).toBe(false)

  await expect
    .poll(
      async () => {
        await userEvent.unhover(screen.getByTestId('trigger'))
        return contentState(screen)
      },
      { timeout: 10000 },
    )
    .toBe('closed')
  await expect.poll(() => calls.at(-1)).toEqual({ open: false })

  // re-open, then close via Escape this time
  await expect
    .poll(
      async () => {
        await userEvent.hover(screen.getByTestId('trigger'))
        return contentState(screen)
      },
      { timeout: 10000 },
    )
    .toBe('open')

  await expect
    .poll(
      async () => {
        await userEvent.keyboard('{Escape}')
        return contentState(screen)
      },
      { timeout: 10000 },
    )
    .toBe('closed')
})
