import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

/**
 * R14-style: no pointer-drag (resize/pan) assertions -- the interaction
 * surface covered is that the cropper renders in a real layout with all
 * parts present and the selection reports a measured, focusable slider.
 */
it('renders the image, selection, handles, and grid in a real layout', async () => {
  const screen = await render(<ComponentUnderTest />)

  await expect.element(screen.getByTestId('viewport')).toBeInTheDocument()
  await expect.element(screen.getByTestId('selection')).toBeInTheDocument()
  await expect.element(screen.getByTestId('handle-nw')).toHaveAttribute('data-position', 'nw')
  await expect.element(screen.getByTestId('grid-horizontal')).toHaveAttribute('data-axis', 'horizontal')

  await expect.poll(() => screen.getByTestId('selection').element().hasAttribute('data-measured')).toBe(true)
})
