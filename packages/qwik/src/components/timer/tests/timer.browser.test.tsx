import { $ } from '@qwik.dev/core'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

/**
 * Interaction tests — real browser via vitest-browser-qwik. Uses a short
 * countdown (2000ms, 50ms interval) so the `start` action's tick-driven value
 * change can be observed with `expect.poll` in a reasonable time.
 */
it('ticks the seconds item down after the start action is clicked', async () => {
  const screen = await render(<ComponentUnderTest />)
  const seconds = () => screen.getByTestId('item-seconds').element().textContent

  expect(seconds()).toBe('02')

  await screen.getByTestId('start').click()

  await expect.poll(() => seconds(), { timeout: 3000 }).not.toBe('02')
})

it('toggles action-trigger visibility across idle -> running -> paused', async () => {
  const screen = await render(<ComponentUnderTest />)
  const start = screen.getByTestId('start')
  const pause = screen.getByTestId('pause')
  const resume = screen.getByTestId('resume')

  // idle: only start is visible
  await expect.element(start).not.toHaveAttribute('hidden')
  await expect.element(pause).toHaveAttribute('hidden')

  await start.click()

  // running: only pause is visible
  await expect.element(start).toHaveAttribute('hidden')
  await expect.element(pause).not.toHaveAttribute('hidden')

  await pause.click()

  // paused: only resume is visible
  await expect.element(start).toHaveAttribute('hidden')
  await expect.element(pause).toHaveAttribute('hidden')
  await expect.element(resume).not.toHaveAttribute('hidden')
})

it('invokes the onTick$ QRL as the timer runs', async () => {
  const calls: Array<{ value: number }> = []
  const screen = await render(
    <ComponentUnderTest
      onTick$={$((details) => {
        calls.push(details)
      })}
    />,
  )

  await screen.getByTestId('start').click()

  await expect.poll(() => calls.length, { timeout: 3000 }).toBeGreaterThan(0)
})

it('invokes the onComplete$ QRL when the countdown reaches its target', async () => {
  const completed: boolean[] = []
  const screen = await render(
    <ComponentUnderTest
      startMs={150}
      interval={50}
      onComplete$={$(() => {
        completed.push(true)
      })}
    />,
  )

  await screen.getByTestId('start').click()

  await expect.poll(() => completed.length, { timeout: 3000 }).toBeGreaterThan(0)
})
