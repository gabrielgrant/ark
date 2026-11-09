import { $ } from '@qwik.dev/core'
import { whenMachinesStarted } from '@zag-js/qwik'
import { userEvent } from '@vitest/browser/context'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

it('moves focus inside on activation and keeps it there while tabbing', async () => {
  const screen = await render(<ComponentUnderTest />)
  const trap = screen.getByTestId('trap').element() as HTMLElement

  await expect.poll(() => trap.contains(document.activeElement)).toBe(true)

  await userEvent.keyboard('{Tab}')
  await expect.poll(() => trap.contains(document.activeElement)).toBe(true)

  await userEvent.keyboard('{Tab}')
  await expect.poll(() => trap.contains(document.activeElement)).toBe(true)

  // Tabbing past the last tabbable element wraps back inside the trap
  // (not out to the document body).
  await userEvent.keyboard('{Tab}')
  await expect.poll(() => trap.contains(document.activeElement)).toBe(true)
})

it('does not trap focus when disabled', async () => {
  const calls: string[] = []
  const screen = await render(
    <ComponentUnderTest
      disabled
      onActivate$={$(() => {
        calls.push('activate')
      })}
    />,
  )
  const trap = screen.getByTestId('trap').element() as HTMLElement

  // the machine has started (adapter's whenMachinesStarted) and still did
  // not activate the trap -- replaces an arbitrary fixed wait
  await whenMachinesStarted()
  expect(trap.contains(document.activeElement)).toBe(false)
  expect(calls).toEqual([])
})
