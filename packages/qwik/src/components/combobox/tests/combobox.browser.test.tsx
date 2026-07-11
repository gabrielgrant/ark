import { $ } from '@qwik.dev/core'
import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

const contentState = (root: HTMLElement) => root.querySelector('[data-testid="content"]')?.getAttribute('data-state')

it('opens on trigger click, arrow-down highlights the first item, and enter selects it', async () => {
  const calls: Array<{ value: string[] }> = []
  const screen = await render(
    <ComponentUnderTest
      onValueChange$={$((details) => {
        calls.push({ value: details.value })
      })}
    />,
  )
  const root = screen.container as HTMLElement

  expect(contentState(root)).toBe('closed')

  await screen.getByTestId('trigger').click()
  await expect.poll(() => contentState(root)).toBe('open')

  await userEvent.keyboard('{ArrowDown}')
  await userEvent.keyboard('{Enter}')

  await expect.poll(() => contentState(root)).toBe('closed')
  await expect.element(screen.getByTestId('input')).toHaveValue('React')

  await expect.poll(() => calls.length).toBe(1)
  expect(calls[0]).toEqual({ value: ['react'] })
})
