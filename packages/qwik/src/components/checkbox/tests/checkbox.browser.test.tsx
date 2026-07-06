import { $ } from '@qwik.dev/core'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

/**
 * Interaction tests — real browser via vitest-browser-qwik (see
 * vitest.browser.config.ts), whose `render` wires Qwik's client + event system
 * so the Zag machine starts and processes events.
 */
it('toggles checked when the checkbox is clicked', async () => {
  const screen = await render(<ComponentUnderTest />)
  const checkbox = screen.getByRole('checkbox')

  await expect.element(checkbox).not.toBeChecked()

  // clicking the label text toggles the visually-hidden input via <label for>
  await screen.getByText('Checkbox').click()
  await expect.element(checkbox).toBeChecked()

  await screen.getByText('Checkbox').click()
  await expect.element(checkbox).not.toBeChecked()
})

it('invokes the onCheckedChange$ QRL on toggle', async () => {
  const calls: Array<{ checked: boolean | 'indeterminate' }> = []
  const screen = await render(
    <ComponentUnderTest
      onCheckedChange$={$((details) => {
        calls.push(details)
      })}
    />,
  )

  await screen.getByText('Checkbox').click()
  await expect.poll(() => calls.length).toBe(1)
  expect(calls[0]).toEqual({ checked: true })
})

it('reflects the checked state on the control part', async () => {
  const screen = await render(<ComponentUnderTest />)
  const control = screen.getByTestId('control')

  await expect.element(control).toHaveAttribute('data-state', 'unchecked')
  await screen.getByText('Checkbox').click()
  await expect.element(control).toHaveAttribute('data-state', 'checked')
})
