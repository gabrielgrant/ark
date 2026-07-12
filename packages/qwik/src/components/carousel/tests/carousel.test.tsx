import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('Carousel', () => {
  it('renders the item group and items', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="item-group"]')).toBeTruthy()
    expect(document.querySelectorAll('[data-part="item"]').length).toBe(5)
  })

  it('marks indicator 0 as current by default', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const indicator0 = document.querySelector('[data-testid="indicator-0"]')
    const indicator1 = document.querySelector('[data-testid="indicator-1"]')
    expect(indicator0?.hasAttribute('data-current')).toBe(true)
    expect(indicator1?.hasAttribute('data-current')).toBe(false)
  })

  it('reflects a controlled page through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest page={2} />, { qwikLoader: true })

    const indicator2 = document.querySelector('[data-testid="indicator-2"]')
    expect(indicator2?.hasAttribute('data-current')).toBe(true)

    const item0 = document.querySelector('[data-testid="item-0"]')
    expect(item0?.getAttribute('aria-hidden')).toBe('true')
  })

  it('disables the prev trigger on the first page', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="prev-trigger"]')?.hasAttribute('disabled')).toBe(true)
  })

  it('renders the progress text', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="progress-text"]')?.textContent).toBe('1 / 5')
  })

  it('renders the autoplay indicator fallback while not playing', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const autoplayIndicator = document.querySelector('[data-testid="autoplay-indicator"]')
    const projectedChildren = autoplayIndicator?.querySelector('span')
    expect(projectedChildren?.hasAttribute('hidden')).toBe(true)
    expect(autoplayIndicator?.textContent).toContain('Play')
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest onPageChange$={$(() => {})} />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="next-trigger"]')).toBeTruthy()
  })
})
