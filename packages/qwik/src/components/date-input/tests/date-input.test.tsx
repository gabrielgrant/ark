import { parseDate, parseZonedDateTime } from '@internationalized/date'
import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('DateInput', () => {
  it('renders all parts with the correct elements', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-part="root"]')?.tagName.toLowerCase()).toBe('div')
    expect(document.querySelector('[data-part="label"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="control"]')).toBeTruthy()
    // 5 `[data-part="segment"]` elements render for en-US (month, "/", day, "/", year) --
    // literal separators are also segment parts, but only editable segments get role=spinbutton.
    expect(document.querySelectorAll('[data-part="segment"]').length).toBe(5)
    expect(document.querySelectorAll('[role="spinbutton"]').length).toBe(3)
    expect(document.querySelector('[data-testid="hidden-input"]')).toBeTruthy()
  })

  it('reflects a class-instance defaultValue (DateValue) through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue={[parseDate('2024-06-15')]} />, {
      qwikLoader: true,
    })

    const segments = document.querySelectorAll('[role="spinbutton"]')
    const [month, day, year] = Array.from(segments)
    expect(month?.getAttribute('aria-valuenow')).toBe('6')
    expect(day?.getAttribute('aria-valuenow')).toBe('15')
    expect(year?.getAttribute('aria-valuenow')).toBe('2024')
  })

  it('reflects the invalid state', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest invalid />, { qwikLoader: true })

    expect(document.querySelector('[data-part="root"]')?.hasAttribute('data-invalid')).toBe(true)
  })

  it('reflects the disabled state on segments', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest disabled />, { qwikLoader: true })

    for (const segment of Array.from(document.querySelectorAll('[role="spinbutton"]'))) {
      expect(segment.hasAttribute('data-disabled')).toBe(true)
    }
  })

  it('syncs the hidden input value from a DateValue defaultValue', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest name="date" defaultValue={[parseDate('2024-06-15')]} />,
      { qwikLoader: true },
    )

    expect(document.querySelector('[data-testid="hidden-input"]')?.getAttribute('value')).toBe('6/15/2024')
  })

  it('renders a timeZoneName segment for ZonedDateTime values', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest
        defaultValue={[parseZonedDateTime('2025-02-03T08:45:00[America/Los_Angeles]')]}
        granularity="minute"
      />,
      { qwikLoader: true },
    )

    expect(document.querySelector('[data-type="timeZoneName"]')).toBeTruthy()
  })

  it('hides the timeZoneName segment when hideTimeZone is set', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest
        defaultValue={[parseZonedDateTime('2025-02-03T08:45:00[America/Los_Angeles]')]}
        granularity="minute"
        hideTimeZone
      />,
      { qwikLoader: true },
    )

    expect(document.querySelector('[data-type="timeZoneName"]')).toBeFalsy()
  })

  it('serializes QRL callback props through SSR without crashing', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest
        defaultValue={[parseDate('2024-06-15')]}
        min={parseDate('2020-01-01')}
        max={parseDate('2030-01-01')}
        onValueChange$={$(() => {})}
      />,
      { qwikLoader: true },
    )

    expect(document.querySelector('[data-part="root"]')).toBeTruthy()
  })
})
