import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

/**
 * No scroll-drag assertions here -- the interaction surface covered is that
 * content renders in a real layout and the scrollbar/thumb data attributes
 * reflect their static `orientation` prop (a `ResizeObserver`-driven
 * hidden/visible toggle is not asserted, per the component's real-layout
 * measurement dependency).
 */
it('renders content in a real layout with orientation-tagged scrollbars', async () => {
  const screen = await render(<ComponentUnderTest />)

  await expect.element(screen.getByTestId('row-0')).toBeInTheDocument()
  await expect.element(screen.getByTestId('row-49')).toBeInTheDocument()

  await expect.element(screen.getByTestId('scrollbar-vertical')).toHaveAttribute('data-orientation', 'vertical')
  await expect.element(screen.getByTestId('thumb-vertical')).toHaveAttribute('data-orientation', 'vertical')
  await expect.element(screen.getByTestId('scrollbar-horizontal')).toHaveAttribute('data-orientation', 'horizontal')
  await expect.element(screen.getByTestId('thumb-horizontal')).toHaveAttribute('data-orientation', 'horizontal')

  const viewport = screen.getByTestId('viewport').element() as HTMLElement
  viewport.scrollTop = 100
  viewport.dispatchEvent(new Event('scroll', { bubbles: true }))

  await expect.poll(() => viewport.getAttribute('data-at-top')).toBeFalsy()
})
