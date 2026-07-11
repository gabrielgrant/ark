import { $ } from '@qwik.dev/core'
import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

const contentState = (root: HTMLElement) => root.querySelector('[data-testid="content"]')?.getAttribute('data-state')

it('opens on trigger click, arrow-down highlights an item, click selects (fires onSelect$) and closes', async () => {
  const calls: Array<{ value: string }> = []
  const screen = await render(
    <ComponentUnderTest
      onSelect$={$((details) => {
        calls.push({ value: details.value })
      })}
    />,
  )
  const root = screen.container as HTMLElement

  expect(contentState(root)).toBe('closed')

  await screen.getByTestId('trigger').click()
  await expect.poll(() => contentState(root)).toBe('open')

  await userEvent.keyboard('{ArrowDown}')
  await expect.poll(() => root.querySelector('[data-testid="item-new"]')?.getAttribute('data-highlighted')).toBe('')

  await screen.getByTestId('item-copy').click()
  await expect.poll(() => contentState(root)).toBe('closed')
  await expect.poll(() => calls.length).toBe(1)
  expect(calls[0]).toEqual({ value: 'copy' })
})
