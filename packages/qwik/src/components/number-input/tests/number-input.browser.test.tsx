import { $ } from '@qwik.dev/core'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

it('increments the value when the increment trigger is clicked', async () => {
  const screen = await render(<ComponentUnderTest defaultValue="0" step={5} />)

  await screen.getByTestId('increment').click()

  await expect.element(screen.getByTestId('input')).toHaveValue('5')
})

it('decrements the value when the decrement trigger is clicked', async () => {
  const screen = await render(<ComponentUnderTest defaultValue="10" step={1} />)

  await screen.getByTestId('decrement').click()

  await expect.element(screen.getByTestId('input')).toHaveValue('9')
})

it('invokes the onValueChange$ QRL when the value changes', async () => {
  const calls: Array<{ value: string }> = []
  const screen = await render(
    <ComponentUnderTest
      defaultValue="0"
      onValueChange$={$((details) => {
        calls.push(details)
      })}
    />,
  )

  await screen.getByTestId('increment').click()

  await expect.poll(() => calls.length).toBeGreaterThan(0)
  expect(calls.at(-1)?.value).toBe('1')
})
