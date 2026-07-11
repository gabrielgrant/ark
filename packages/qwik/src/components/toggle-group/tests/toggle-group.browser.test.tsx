import { $ } from '@qwik.dev/core'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

it('toggles an item when clicked', async () => {
  const screen = await render(<ComponentUnderTest />)
  const root = screen.container as HTMLElement
  const state = (framework: string) => root.querySelector(`[data-testid="item-${framework}"]`)?.getAttribute('data-state')

  expect(state('React')).toBe('off')

  await screen.getByText('React').click()
  await expect.poll(() => state('React')).toBe('on')

  await screen.getByText('React').click()
  await expect.poll(() => state('React')).toBe('off')
})

it('invokes the onValueChange$ QRL on selection', async () => {
  const calls: Array<{ value: string[] }> = []
  const screen = await render(
    <ComponentUnderTest
      onValueChange$={$((details) => {
        calls.push(details)
      })}
    />,
  )

  await screen.getByText('Vue').click()
  await expect.poll(() => calls.length).toBe(1)
  expect(calls[0]).toEqual({ value: ['Vue'] })
})
