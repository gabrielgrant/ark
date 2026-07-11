import { $ } from '@qwik.dev/core'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

it('checks an item when it is clicked', async () => {
  const screen = await render(<ComponentUnderTest />)
  const root = screen.container as HTMLElement
  const checked = (index: number) => root.querySelector(`[data-testid="item-${index}"]`)?.getAttribute('data-checked')

  await screen.getByTestId('item-3').click()
  await expect.poll(() => checked(3)).toBe('')
  await expect.poll(() => checked(5)).toBe(null)
})

it('invokes the onValueChange$ QRL on selection', async () => {
  const calls: Array<{ value: number }> = []
  const screen = await render(
    <ComponentUnderTest
      onValueChange$={$((details) => {
        calls.push(details)
      })}
    />,
  )

  await screen.getByTestId('item-4').click()
  await expect.poll(() => calls.length).toBe(1)
  expect(calls[0]).toEqual({ value: 4 })
})
