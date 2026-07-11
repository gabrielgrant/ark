import { $ } from '@qwik.dev/core'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

it('clicking the visibility trigger toggles the input type and indicator content', async () => {
  const calls: Array<{ visible: boolean }> = []
  const screen = await render(
    <ComponentUnderTest
      onVisibilityChange$={$((details) => {
        calls.push({ visible: details.visible })
      })}
    />,
  )
  const root = screen.container as HTMLElement
  const input = () => root.querySelector('[data-testid="input"]') as HTMLInputElement | null

  expect(input()?.type).toBe('password')

  await screen.getByTestId('visibility-trigger').click()

  await expect.poll(() => input()?.type).toBe('text')
  await expect.poll(() => calls.at(-1)).toEqual({ visible: true })
  await expect.element(screen.getByTestId('indicator')).toHaveTextContent('Hide')

  await screen.getByTestId('visibility-trigger').click()

  await expect.poll(() => input()?.type).toBe('password')
  await expect.poll(() => calls.at(-1)).toEqual({ visible: false })
  await expect.element(screen.getByTestId('indicator')).toHaveTextContent('Show')
})
