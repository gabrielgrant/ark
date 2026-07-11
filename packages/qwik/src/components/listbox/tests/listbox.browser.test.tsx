import { $ } from '@qwik.dev/core'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

const selected = (root: HTMLElement, value: string) =>
  root.querySelector(`[data-testid="item-${value}"]`)?.getAttribute('aria-selected')

it('selects an item when it is clicked', async () => {
  const screen = await render(<ComponentUnderTest />)
  const root = screen.container as HTMLElement

  expect(selected(root, 'react')).toBe('false')

  await screen.getByTestId('item-react').click()
  await expect.poll(() => selected(root, 'react')).toBe('true')

  const valueText = root.querySelector('[data-testid="value-text"]')
  await expect.poll(() => valueText?.textContent).toBe('React')
})

it('replaces the selection with a single-select listbox', async () => {
  const screen = await render(<ComponentUnderTest />)
  const root = screen.container as HTMLElement

  await screen.getByTestId('item-react').click()
  await expect.poll(() => selected(root, 'react')).toBe('true')

  await screen.getByTestId('item-vue').click()
  await expect.poll(() => selected(root, 'vue')).toBe('true')
  await expect.poll(() => selected(root, 'react')).toBe('false')
})

it('invokes the onValueChange$ QRL on selection', async () => {
  const calls: Array<{ value: string[] }> = []
  const screen = await render(
    <ComponentUnderTest
      onValueChange$={$((details) => {
        calls.push({ value: details.value })
      })}
    />,
  )

  await screen.getByTestId('item-solid').click()
  await expect.poll(() => calls.length).toBe(1)
  expect(calls[0]).toEqual({ value: ['solid'] })
})
