import { parseDate } from '@internationalized/date'
import { $ } from '@qwik.dev/core'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

it('opens via the trigger and selects a day cell (onValueChange$ fires)', async () => {
  const calls: Array<{ valueAsString: string[] }> = []
  const screen = await render(
    <ComponentUnderTest
      defaultFocusedValue={parseDate('2024-06-15')}
      onValueChange$={$((details) => {
        calls.push(details)
      })}
    />,
  )

  const root = screen.container as HTMLElement
  await screen.getByTestId('trigger').click()
  await expect
    .poll(() => root.querySelector('[data-testid="content"]')?.hasAttribute('hidden'))
    .toBe(false)

  // Native element.click() (PLAN.md Part 5 #0b): locator clicks on zag-wired
  // cell triggers can be swallowed by the adapter's capture-phase re-dispatch.
  const day15 = root.querySelector('[data-testid="day-2024-06-15"]') as HTMLElement
  expect(day15).toBeTruthy()
  day15.click()

  await expect.poll(() => calls.length).toBeGreaterThan(0)
  expect(calls.at(-1)?.valueAsString[0]).toBe('06/15/2024')
  await expect.poll(() => root.querySelector('[data-selected]')).toBeTruthy()
})

it('switches from month grid to year grid via the view trigger', async () => {
  const screen = await render(<ComponentUnderTest defaultOpen defaultFocusedValue={parseDate('2024-06-15')} />)

  const root = screen.container as HTMLElement
  await expect
    .poll(() => root.querySelector('[data-testid="day-view"]')?.hasAttribute('hidden'))
    .toBe(false)

  const dayViewTrigger = root.querySelector('[data-testid="day-view-trigger"]') as HTMLElement
  dayViewTrigger.click()

  await expect
    .poll(() => root.querySelector('[data-testid="month-view"]')?.hasAttribute('hidden'))
    .toBe(false)
  await expect.poll(() => root.querySelector('[data-testid="day-view"]')?.hasAttribute('hidden')).toBe(true)

  const monthViewTrigger = root.querySelector('[data-testid="month-view-trigger"]') as HTMLElement
  monthViewTrigger.click()

  await expect
    .poll(() => root.querySelector('[data-testid="year-view"]')?.hasAttribute('hidden'))
    .toBe(false)
  await expect.poll(() => root.querySelector('[data-testid="month-view"]')?.hasAttribute('hidden')).toBe(true)
})
