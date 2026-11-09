import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { PositionRerenderFixture } from './basic.tsx'

/**
 * The machine's popper writes `--x`/`--y` onto the positioner through the
 * CSSOM after measuring. Qwik re-serializes the whole `style` attribute when
 * the style prop changes, which would drop them (popper does not re-write
 * values it believes are set); the adapter's document-level style
 * MutationObserver must restore them. The fixture changes the positioner's
 * own style prop (and also passes its own `ref`, which must coexist with the
 * spread zag props).
 */
it('keeps popper position after a style-prop re-render', async () => {
  const screen = await render(<PositionRerenderFixture />)
  const root = screen.container as HTMLElement
  const positioner = () => root.querySelector('[data-testid="positioner"]') as HTMLElement | null

  await expect.poll(() => positioner()?.getAttribute('style') ?? '').toMatch(/--x:/)
  const xBefore = positioner()?.style.getPropertyValue('--x')
  expect(xBefore).toBeTruthy()

  // consumer-passed ref was populated alongside the spread zag props
  await expect.poll(() => root.querySelector('[data-testid="ref-tag"]')?.textContent?.trim()).toBe('positioner')

  await screen.getByTestId('rerender').click()
  // the style prop change really re-serialized the attribute...
  await expect.poll(() => positioner()?.style.outlineWidth).toBe('1px')
  // ...and the machine-written vars survived (restored by the observer)
  await expect.poll(() => positioner()?.style.getPropertyValue('--x')).toBe(xBefore)
  expect(positioner()?.style.getPropertyValue('--y')).toBeTruthy()
})
