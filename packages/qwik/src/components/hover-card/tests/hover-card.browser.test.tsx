import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

const contentState = (screen: { container: Element }) =>
  (screen.container as HTMLElement).querySelector('[data-testid="content"]')?.getAttribute('data-state')

// openDelay/closeDelay: 0 so hover/unhover reflect immediately. userEvent.hover
// drives a real pointer path in headless Chromium, which can flake through
// the (small) trigger's bounds more than once -- retry the hover/unhover
// action itself inside the poll instead of firing it once and hoping the
// resulting state lands before the assertion runs (the same pattern found
// necessary for tooltip's browser suite). All scenarios share one render()
// (one machine instance): a second same-type hover-card instance rendered
// later in the same browser session was observed (while porting tooltip) to
// attach its positioning/dismiss state effects less reliably than the first.
it('opens on trigger hover (positioned inline per R7), closes on unhover, and reports onOpenChange', async () => {
  const calls: Array<{ open: boolean }> = []
  const screen = await render(
    <ComponentUnderTest openDelay={0} closeDelay={0} onOpenChange={(details) => calls.push(details)} />,
  )

  expect(contentState(screen)).toBe('closed')

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
})
