import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { FilterableCombobox } from './basic.tsx'

it('typing into the input filters the rendered items', async () => {
  const screen = await render(<FilterableCombobox />)
  const root = screen.container as HTMLElement

  await screen.getByTestId('input').click()
  await userEvent.keyboard('mang')

  await expect.poll(() => root.querySelector('[data-testid="item-mango"]')).toBeTruthy()
  await expect.poll(() => root.querySelector('[data-testid="item-apple"]')).toBeFalsy()
  await expect.poll(() => root.querySelector('[data-testid="item-banana"]')).toBeFalsy()
  await expect.poll(() => root.querySelector('[data-testid="item-orange"]')).toBeFalsy()
})
