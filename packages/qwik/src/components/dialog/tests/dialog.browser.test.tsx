import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

const contentState = (screen: { container: Element }) =>
  (screen.container as HTMLElement).querySelector('[data-testid="content"]')?.getAttribute('data-state')

it('opens on trigger click and closes on close-trigger click', async () => {
  const screen = await render(<ComponentUnderTest />)

  expect(contentState(screen)).toBe('closed')

  await screen.getByText('Open Dialog').click()
  await expect.poll(() => contentState(screen)).toBe('open')

  await screen.getByText('Close').click()
  await expect.poll(() => contentState(screen)).toBe('closed')
})

it('moves focus into the content on open and closes on escape', async () => {
  const screen = await render(<ComponentUnderTest />)

  await screen.getByText('Open Dialog').click()
  await expect.poll(() => contentState(screen)).toBe('open')

  const content = (screen.container as HTMLElement).querySelector('[data-testid="content"]')
  await expect.poll(() => content?.contains(document.activeElement)).toBe(true)

  await userEvent.keyboard('{Escape}')
  await expect.poll(() => contentState(screen)).toBe('closed')
})

it('invokes onOpenChange when toggled', async () => {
  const calls: Array<{ open: boolean }> = []
  const screen = await render(<ComponentUnderTest onOpenChange={(details) => calls.push(details)} />)

  await screen.getByText('Open Dialog').click()
  await expect.poll(() => calls.length).toBe(1)
  expect(calls[0]).toEqual({ open: true })

  await userEvent.keyboard('{Escape}')
  await expect.poll(() => calls.length).toBe(2)
  expect(calls[1]).toEqual({ open: false })
})
