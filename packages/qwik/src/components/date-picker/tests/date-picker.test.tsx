import { parseDate } from '@internationalized/date'
import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('DatePicker', () => {
  it('renders closed by default with content hidden', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const trigger = document.querySelector('[data-testid="trigger"]')
    const content = document.querySelector('[data-testid="content"]')

    expect(trigger?.getAttribute('aria-haspopup')).toBe('grid')
    expect(trigger?.getAttribute('aria-expanded')).toBe('false')
    expect(content?.hasAttribute('hidden')).toBe(true)
  })

  it('renders open with a day-view table', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest open defaultValue={[parseDate('2024-06-15')]} />,
      { qwikLoader: true },
    )

    const content = document.querySelector('[data-testid="content"]')
    expect(content?.hasAttribute('hidden')).toBe(false)

    const dayTable = document.querySelector('[data-testid="day-table"]')
    expect(dayTable?.tagName.toLowerCase()).toBe('table')
    expect(document.querySelectorAll('[data-part="table-cell-trigger"]').length).toBeGreaterThan(0)
  })

  it('reflects the selected day as data-selected on its cell trigger', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest open defaultValue={[parseDate('2024-06-15')]} />,
      { qwikLoader: true },
    )

    const selected = document.querySelector('[data-selected]')
    expect(selected).toBeTruthy()
    expect(selected?.textContent).toBe('15')
  })

  it('reflects the invalid state on the input', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest invalid />, { qwikLoader: true })

    const input = document.querySelector('[data-testid="input"]')
    expect(input?.getAttribute('aria-invalid')).toBe('true')
    expect(input?.hasAttribute('data-invalid')).toBe(true)
  })

  it('reflects the disabled state', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest disabled />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="trigger"]')?.hasAttribute('disabled')).toBe(true)
  })

  it('syncs the input value from a DateValue defaultValue', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue={[parseDate('2024-06-15')]} />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="input"]')?.getAttribute('value')).toBe('06/15/2024')
  })

  it('serializes QRL callback props through SSR without crashing', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest
        open
        defaultValue={[parseDate('2024-06-15')]}
        min={parseDate('2020-01-01')}
        max={parseDate('2030-01-01')}
        onValueChange$={$(() => {})}
        onOpenChange$={$(() => {})}
      />,
      { qwikLoader: true },
    )

    expect(document.querySelector('[data-testid="trigger"]')).toBeTruthy()
  })

  it('switches to the month view via defaultView', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest open view="month" />, { qwikLoader: true })

    const dayView = document.querySelector('[data-testid="day-view"]')
    const monthView = document.querySelector('[data-testid="month-view"]')
    expect(dayView?.hasAttribute('hidden')).toBe(true)
    expect(monthView?.hasAttribute('hidden')).toBe(false)
  })
})
