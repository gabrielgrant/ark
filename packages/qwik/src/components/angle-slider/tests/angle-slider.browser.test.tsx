import { $ } from '@qwik.dev/core'
import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

it('increments the value when the thumb is focused and ArrowRight is pressed', async () => {
  const screen = await render(<ComponentUnderTest defaultValue={10} step={1} />)
  const thumb = screen.getByTestId('thumb')

  await expect.element(thumb).toHaveAttribute('aria-valuenow', '10')

  await thumb.click()
  await userEvent.keyboard('{ArrowRight}')

  await expect.element(thumb).toHaveAttribute('aria-valuenow', '11')
})

it('decrements the value when the thumb is focused and ArrowLeft is pressed', async () => {
  const screen = await render(<ComponentUnderTest defaultValue={10} step={1} />)
  const thumb = screen.getByTestId('thumb')

  await thumb.click()
  await userEvent.keyboard('{ArrowLeft}')

  await expect.element(thumb).toHaveAttribute('aria-valuenow', '9')
})

it('invokes the onValueChange$ QRL as the thumb moves', async () => {
  const calls: Array<{ value: number }> = []
  const screen = await render(
    <ComponentUnderTest
      defaultValue={10}
      onValueChange$={$((details) => {
        calls.push(details)
      })}
    />,
  )

  await screen.getByTestId('thumb').click()
  await userEvent.keyboard('{ArrowRight}')

  await expect.poll(() => calls.length).toBeGreaterThan(0)
  expect(calls.at(-1)?.value).toBe(11)
})
