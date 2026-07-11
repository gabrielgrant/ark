import { $ } from '@qwik.dev/core'
import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

it('fills inputs and completes as the user types', async () => {
  const screen = await render(<ComponentUnderTest />)

  await screen.getByTestId('input-0').click()
  await userEvent.keyboard('123')

  await expect.element(screen.getByTestId('input-0')).toHaveValue('1')
  await expect.element(screen.getByTestId('input-1')).toHaveValue('2')
  await expect.element(screen.getByTestId('input-2')).toHaveValue('3')

  const root = screen.container as HTMLElement
  await expect.poll(() => root.querySelector('[data-part="root"]')?.getAttribute('data-complete')).toBe('')
})

it('invokes the onValueChange$ QRL as the user types', async () => {
  const calls: Array<{ value: string[] }> = []
  const screen = await render(
    <ComponentUnderTest
      onValueChange$={$((details) => {
        calls.push(details)
      })}
    />,
  )

  await screen.getByTestId('input-0').click()
  await userEvent.keyboard('1')

  await expect.poll(() => calls.length).toBeGreaterThan(0)
  expect(calls.at(-1)?.value[0]).toBe('1')
})
