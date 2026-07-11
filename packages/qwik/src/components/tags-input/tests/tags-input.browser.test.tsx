import { $ } from '@qwik.dev/core'
import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

it('adds a tag by typing + enter, and removes one via its delete trigger', async () => {
  const calls: Array<{ value: string[] }> = []
  const screen = await render(
    <ComponentUnderTest
      onValueChange$={$((details) => {
        calls.push({ value: details.value })
      })}
    />,
  )
  const root = screen.container as HTMLElement

  expect(root.querySelector('[data-testid="item-python"]')).toBeFalsy()

  await screen.getByTestId('input').click()
  await userEvent.keyboard('python{Enter}')

  await expect.poll(() => root.querySelector('[data-testid="item-python"]')).toBeTruthy()
  await expect.poll(() => calls.length).toBeGreaterThan(0)
  expect(calls.at(-1)?.value).toContain('python')

  await expect.element(screen.getByTestId('input')).toHaveValue('')

  await screen.getByTestId('delete-solid').click()
  await expect.poll(() => root.querySelector('[data-testid="item-solid"]')).toBeFalsy()
  await expect.poll(() => calls.at(-1)?.value).not.toContain('solid')
})
