import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

it('switches from the fallback to the projected content once mounted on the client', async () => {
  const screen = await render(<ComponentUnderTest fallback={<div data-testid="fallback">Loading</div>} />)

  await expect.element(screen.getByTestId('client-content')).toBeInTheDocument()
  await expect.poll(() => screen.container.querySelector('[data-testid="fallback"]')).toBeFalsy()
})
