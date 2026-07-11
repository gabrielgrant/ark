import { $ } from '@qwik.dev/core'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

it('toggles pressed state when clicked', async () => {
  const screen = await render(<ComponentUnderTest />)
  const root = screen.getByTestId('root')

  await expect.element(root).toHaveAttribute('aria-pressed', 'false')
  await root.click()
  await expect.element(root).toHaveAttribute('aria-pressed', 'true')
  await root.click()
  await expect.element(root).toHaveAttribute('aria-pressed', 'false')
})

it('invokes the onPressedChange$ QRL on toggle', async () => {
  const calls: boolean[] = []
  const screen = await render(
    <ComponentUnderTest
      onPressedChange$={$((pressed) => {
        calls.push(pressed)
      })}
    />,
  )

  await screen.getByTestId('root').click()
  await expect.poll(() => calls.length).toBe(1)
  expect(calls[0]).toBe(true)
})
