import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

it('switches content when a trigger is clicked', async () => {
  const screen = await render(<ComponentUnderTest defaultValue="React" />)
  const root = screen.container as HTMLElement
  const selected = (framework: string) =>
    root.querySelector(`[data-testid="trigger-${framework}"]`)?.getAttribute('aria-selected')
  const hidden = (framework: string) => root.querySelector(`[data-testid="content-${framework}"]`)?.hasAttribute('hidden')

  expect(selected('React')).toBe('true')
  expect(hidden('React')).toBe(false)
  expect(hidden('Solid')).toBe(true)

  await screen.getByTestId('trigger-Solid').click()
  await expect.poll(() => selected('Solid')).toBe('true')
  await expect.poll(() => hidden('Solid')).toBe(false)
  await expect.poll(() => selected('React')).toBe('false')
  await expect.poll(() => hidden('React')).toBe(true)
})
