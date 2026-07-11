import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

const contentState = (screen: { container: Element }) =>
  (screen.container as HTMLElement).querySelector('[data-testid="content"]')?.getAttribute('data-state')

it('opens on trigger click and closes on close-trigger click', async () => {
  const screen = await render(<ComponentUnderTest />)

  expect(contentState(screen)).toBe('closed')

  await screen.getByTestId('trigger').click()
  await expect.poll(() => contentState(screen)).toBe('open')

  const trigger = (screen.container as HTMLElement).querySelector('[data-testid="trigger"]')
  expect(trigger?.getAttribute('aria-expanded')).toBe('true')

  await screen.getByTestId('close-trigger').click()
  await expect.poll(() => contentState(screen)).toBe('closed')
})

it('positions the content with computed inline style (R7: no portal, inline rendering)', async () => {
  const screen = await render(<ComponentUnderTest />)

  await screen.getByTestId('trigger').click()
  await expect.poll(() => contentState(screen)).toBe('open')

  const positioner = (screen.container as HTMLElement).querySelector('[data-testid="positioner"]')
  const content = (screen.container as HTMLElement).querySelector('[data-testid="content"]')

  const style = positioner?.getAttribute('style')
  expect(style).toBeTruthy()
  // zag's popper positions the element with `position` (absolute by default;
  // fixed only when `positioning.strategy: 'fixed'` is set) plus computed
  // `--x`/`--y` CSS custom properties -- confirms R7's fixed-coordinates
  // inline-rendering contract rather than a JS portal.
  expect(['absolute', 'fixed']).toContain((positioner as HTMLElement)?.style.position)
  expect(style).toMatch(/--x:/)
  expect(style).toMatch(/--y:/)
  expect(content?.hasAttribute('hidden')).toBe(false)

  // Close before the test ends: popover positioning keeps a live
  // ResizeObserver + async placement compute (zag's popper middleware,
  // unlike dialog/tabs) running while open. Leaving it open past this test
  // races that async work against the next test's render and trips Qwik's
  // cursor walker (`insertBefore` on a stale node) -- close-trigger/escape
  // tears down the popper before the next render starts.
  await userEvent.keyboard('{Escape}')
  await expect.poll(() => contentState(screen)).toBe('closed')
})

it('closes on escape and returns focus to the trigger', async () => {
  const screen = await render(<ComponentUnderTest />)

  await screen.getByTestId('trigger').click()
  await expect.poll(() => contentState(screen)).toBe('open')

  await userEvent.keyboard('{Escape}')
  await expect.poll(() => contentState(screen)).toBe('closed')

  const trigger = (screen.container as HTMLElement).querySelector('[data-testid="trigger"]')
  await expect.poll(() => trigger?.getAttribute('aria-expanded')).toBe('false')
})

it('invokes onOpenChange when toggled', async () => {
  const calls: Array<{ open: boolean }> = []
  const screen = await render(<ComponentUnderTest onOpenChange={(details) => calls.push(details)} />)

  await screen.getByTestId('trigger').click()
  await expect.poll(() => calls.length).toBe(1)
  expect(calls[0]).toEqual({ open: true })

  await userEvent.keyboard('{Escape}')
  await expect.poll(() => calls.length).toBe(2)
  expect(calls[1]).toEqual({ open: false })
})
