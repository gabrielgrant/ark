import { $ } from '@qwik.dev/core'
import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

/**
 * Keyboard interaction per R14 (zero-size draggable thumbs; pointer dragging
 * is not reliable in the harness). The ALPHA slider is used -- arrow-keying
 * the hue slider throws "Unknown color channel: hue" inside the machine when
 * the current value is an RGB-format Color (the hue slider is only
 * keyboard-adjustable for hsla/hsba values).
 */
it('opens via the trigger and arrow-keying the alpha slider thumb changes its value (R14 keyboard path)', async () => {
  const calls: Array<{ valueAsString: string }> = []
  const screen = await render(
    <ComponentUnderTest
      onValueChange$={$((details) => {
        calls.push(details)
      })}
    />,
  )
  const root = screen.container as HTMLElement

  await screen.getByTestId('trigger').click()
  await expect.poll(() => root.querySelector('[data-testid="content"]')?.hasAttribute('hidden')).toBe(false)

  const alphaThumb = root.querySelector('[data-testid="alpha-slider-thumb"]') as HTMLElement
  alphaThumb.focus()
  await expect.poll(() => document.activeElement === alphaThumb).toBe(true)

  const before = Number(alphaThumb.getAttribute('aria-valuenow'))
  expect(before).toBe(1)
  await userEvent.keyboard('{ArrowLeft}')

  await expect.poll(() => Number(alphaThumb.getAttribute('aria-valuenow'))).toBeLessThan(before)
  await expect.poll(() => calls.length).toBeGreaterThan(0)
  await expect
    .poll(() => root.querySelector('[data-testid="alpha-value-text"]')?.textContent)
    .not.toBe('1')
})

it('typing into a channel input updates the value text', async () => {
  const screen = await render(<ComponentUnderTest defaultOpen />)
  const root = screen.container as HTMLElement

  await expect.poll(() => root.querySelector('[data-testid="content"]')?.hasAttribute('hidden')).toBe(false)

  const redInput = root.querySelector('[data-testid="red-input"]') as HTMLInputElement
  redInput.focus()
  await userEvent.keyboard('{Control>}a{/Control}0{Enter}')

  await expect.poll(() => root.querySelector('[data-testid="value-text"]')?.textContent).toContain('rgba(0,')
})
