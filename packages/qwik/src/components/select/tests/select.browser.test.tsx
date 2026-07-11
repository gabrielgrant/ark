import { $ } from '@qwik.dev/core'
import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

const contentState = (root: HTMLElement) => root.querySelector('[data-testid="content"]')?.getAttribute('data-state')

it('opens on trigger click, selects an item, and updates the value text', async () => {
  const screen = await render(<ComponentUnderTest />)
  const root = screen.container as HTMLElement

  expect(contentState(root)).toBe('closed')

  await screen.getByTestId('trigger').click()
  await expect.poll(() => contentState(root)).toBe('open')

  await screen.getByTestId('item-solid').click()
  await expect.poll(() => contentState(root)).toBe('closed')

  const valueText = root.querySelector('[data-testid="value-text"]')
  await expect.poll(() => valueText?.textContent).toBe('Solid')
})

it('closes on escape', async () => {
  const screen = await render(<ComponentUnderTest />)
  const root = screen.container as HTMLElement

  await screen.getByTestId('trigger').click()
  await expect.poll(() => contentState(root)).toBe('open')

  await userEvent.keyboard('{Escape}')
  await expect.poll(() => contentState(root)).toBe('closed')

  const trigger = root.querySelector('[data-testid="trigger"]')
  await expect.poll(() => trigger?.getAttribute('aria-expanded')).toBe('false')
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

  await screen.getByTestId('trigger').click()
  await screen.getByTestId('item-vue').click()

  await expect.poll(() => calls.length).toBe(1)
  expect(calls[0]).toEqual({ value: ['vue'] })
})
