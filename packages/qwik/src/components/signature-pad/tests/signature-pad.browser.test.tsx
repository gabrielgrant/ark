import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

/**
 * R14: no drawing (pointer-drag) assertions -- headless markup plus the
 * clear-trigger's presence/hidden state is the interaction surface covered
 * here.
 */
it('clear-trigger is visible with existing paths and clears them on click', async () => {
  const screen = await render(<ComponentUnderTest defaultPaths={['M0 0 L10 10']} />)
  const root = screen.container as HTMLElement

  await expect.element(screen.getByTestId('clear-trigger')).not.toHaveAttribute('hidden')
  expect(root.querySelector('[data-testid="segment"] path')).toBeTruthy()

  await screen.getByTestId('clear-trigger').click()

  await expect.element(screen.getByTestId('clear-trigger')).toHaveAttribute('hidden')
  await expect.poll(() => root.querySelector('[data-testid="segment"] path')).toBeFalsy()
})
