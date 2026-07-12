import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ByteUnderTest, NumberUnderTest, RelativeTimeUnderTest, TimeUnderTest } from './basic.tsx'

describe('Format.Number', () => {
  it('formats a plain number using the default locale', async () => {
    const { document } = await ssrRenderToDom(<NumberUnderTest value={1234.5} />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="number"]')?.textContent).toBe('1,234.5')
  })

  it('forwards Intl.NumberFormatOptions', async () => {
    const { document } = await ssrRenderToDom(<NumberUnderTest value={0.5} style="percent" />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="number"]')?.textContent).toBe('50%')
  })
})

describe('Format.Byte', () => {
  it('formats a byte size with the default (decimal, short) options', async () => {
    const { document } = await ssrRenderToDom(<ByteUnderTest value={1500} />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="byte"]')?.textContent).toBe('1.5 kB')
  })

  it('formats using the binary unit system when requested', async () => {
    const { document } = await ssrRenderToDom(<ByteUnderTest value={1024} unitSystem="binary" />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="byte"]')?.textContent).toBe('1 kB')
  })

  it('formats zero bytes', async () => {
    const { document } = await ssrRenderToDom(<ByteUnderTest value={0} />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="byte"]')?.textContent).toBe('0 B')
  })
})

describe('Format.RelativeTime', () => {
  it('formats a date 3 days in the past', async () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    const { document } = await ssrRenderToDom(<RelativeTimeUnderTest value={threeDaysAgo} />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="relative-time"]')?.textContent).toBe('3 days ago')
  })
})

describe('Format.Time', () => {
  it('formats a Date value as 24h time by default', async () => {
    const value = new Date('2024-01-01T13:05:00')
    const { document } = await ssrRenderToDom(<TimeUnderTest value={value} />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="time"]')?.textContent).toBe('13:05')
  })

  it('formats with seconds when withSeconds is set', async () => {
    const value = new Date('2024-01-01T13:05:09')
    const { document } = await ssrRenderToDom(<TimeUnderTest value={value} withSeconds />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="time"]')?.textContent).toBe('13:05:09')
  })
})
