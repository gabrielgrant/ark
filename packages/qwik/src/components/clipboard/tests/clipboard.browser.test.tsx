import { $ } from '@qwik.dev/core'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

/**
 * Interaction tests — real browser via vitest-browser-qwik. The clipboard
 * machine transitions to its "copied" state synchronously on the `COPY`
 * event and fires the actual `navigator.clipboard.writeText` write as a
 * fire-and-forget side effect (not awaited by the state transition) — see
 * `clipboard.machine.ts`'s `copyToClipboard` action. Headless Chromium may
 * deny clipboard-write permission, so these tests assert the `data-copied`
 * state transition (which does not depend on the write succeeding) rather
 * than the clipboard contents themselves.
 */
it('transitions data-copied on the trigger, control and root after clicking the trigger', async () => {
  const screen = await render(<ComponentUnderTest defaultValue="https://ark-ui.com" />)
  const trigger = screen.getByTestId('trigger')

  await expect.element(trigger).not.toHaveAttribute('data-copied')

  await trigger.click()

  await expect.element(trigger).toHaveAttribute('data-copied', '')
  await expect.element(screen.getByTestId('control')).toHaveAttribute('data-copied', '')
})

it('swaps the indicator content when copied', async () => {
  const screen = await render(<ComponentUnderTest defaultValue="https://ark-ui.com" />)
  const trigger = screen.getByTestId('trigger')

  await expect.element(screen.getByTestId('copy-icon')).toBeVisible()

  await trigger.click()

  await expect.element(screen.getByTestId('copied-icon')).toBeVisible()
})

it('invokes the onStatusChange$ QRL when the trigger is clicked', async () => {
  const statusCalls: Array<{ copied: boolean }> = []
  const screen = await render(
    <ComponentUnderTest
      defaultValue="https://ark-ui.com"
      onStatusChange$={$((details) => {
        statusCalls.push(details)
      })}
    />,
  )

  await screen.getByTestId('trigger').click()
  await expect.poll(() => statusCalls.length).toBe(1)
  expect(statusCalls[0]).toEqual({ copied: true })
})
