import { $ } from '@qwik.dev/core'
import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

/**
 * Segments are `contentEditable` spans (not native inputs/buttons): a native
 * `.click()` does NOT move focus here (verified -- `document.activeElement`
 * stays `<body>` after `.click()`), unlike the plain `<button>`/`<input>`
 * parts in other ported components. `.focus()` works (confirmed it fires the
 * machine's `onFocus` -> `SEGMENT.FOCUS` handler, after which typed digits
 * land on the segment). This is a pitfall distinct from PLAN.md's #0b (that
 * one is about an ANCESTOR's tabIndex + stopPropagation swallowing a click;
 * here the focusable element IS the target, and the swallow appears specific
 * to contentEditable + Qwik's event-delegation wrapping of the native
 * pointer sequence).
 */
it('typing into a segment updates the value and reflects on the hidden input', async () => {
  const screen = await render(<ComponentUnderTest name="date" />)

  const segments = screen.container.querySelectorAll('[role="spinbutton"]')
  ;(segments[0] as HTMLElement).focus()
  await userEvent.keyboard('6')
  await userEvent.keyboard('15')
  await userEvent.keyboard('2024')

  const root = screen.container as HTMLElement
  await expect.poll(() => root.querySelector('input[type="hidden"]')?.getAttribute('value')).toBe('6/15/2024')
})

it('invokes the onValueChange$ QRL as the user types a full date', async () => {
  const calls: Array<{ valueAsString: string[] }> = []
  const screen = await render(
    <ComponentUnderTest
      onValueChange$={$((details) => {
        calls.push(details)
      })}
    />,
  )

  const segments = screen.container.querySelectorAll('[role="spinbutton"]')
  ;(segments[0] as HTMLElement).focus()
  await userEvent.keyboard('6')
  await userEvent.keyboard('15')
  await userEvent.keyboard('2024')

  await expect.poll(() => calls.length).toBeGreaterThan(0)
  expect(calls.at(-1)?.valueAsString[0]).toBe('6/15/2024')
})
