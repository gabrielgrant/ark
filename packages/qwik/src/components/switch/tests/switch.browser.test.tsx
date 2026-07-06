import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

it('toggles when clicked', async () => {
  const screen = await render(<ComponentUnderTest />)
  const control = () =>
    (screen.container as HTMLElement).querySelector('[data-testid="control"]')?.getAttribute('data-state')

  expect(control()).toBe('unchecked')
  await screen.getByText('Label').click()
  await expect.poll(control).toBe('checked')
  await screen.getByText('Label').click()
  await expect.poll(control).toBe('unchecked')
})
