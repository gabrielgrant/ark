import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

/**
 * Interaction tests — real browser via vitest-browser-qwik. The resize
 * trigger is a zero-size unstyled button by default (R14) — the test fixture
 * gives it an explicit width/height. Rather than a pointer drag, we focus the
 * trigger (via click, matching the Slider thumb pattern) and press
 * ArrowRight, asserting `aria-valuenow` and the adjacent panel's rendered
 * size both change.
 */
it('resizes panels via ArrowRight keyboard interaction on the resize trigger', async () => {
  const screen = await render(<ComponentUnderTest />)
  const trigger = screen.getByTestId('resize-trigger')
  const panelA = screen.getByTestId('panel-a')

  const before = trigger.element().getAttribute('aria-valuenow')
  expect(before).toBeTruthy()
  const widthBefore = panelA.element().getBoundingClientRect().width

  await trigger.click()
  await userEvent.keyboard('{ArrowRight}')

  await expect.poll(() => trigger.element().getAttribute('aria-valuenow')).not.toBe(before)
  await expect.poll(() => panelA.element().getBoundingClientRect().width).not.toBe(widthBefore)
})
