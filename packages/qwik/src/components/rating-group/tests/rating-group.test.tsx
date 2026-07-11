import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('RatingGroup', () => {
  it('renders all parts with correct initial state', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-part="root"]')?.tagName.toLowerCase()).toBe('div')
    expect(document.querySelector('[data-part="label"]')).toBeTruthy()
    expect(document.querySelectorAll('[data-part="item"]').length).toBe(5)
    expect(document.querySelector('[data-testid="hidden-input"]')).toBeTruthy()
  })

  it('reflects controlled value through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest value={3} />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="item-1"]')?.hasAttribute('data-highlighted')).toBe(true)
    expect(document.querySelector('[data-testid="item-3"]')?.hasAttribute('data-highlighted')).toBe(true)
    expect(document.querySelector('[data-testid="item-4"]')?.hasAttribute('data-highlighted')).toBe(false)
    expect(document.querySelector('[data-testid="item-5"]')?.hasAttribute('data-highlighted')).toBe(false)
  })

  it('reflects defaultValue through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue={2} />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="item-2"]')?.hasAttribute('data-highlighted')).toBe(true)
    expect(document.querySelector('[data-testid="item-3"]')?.hasAttribute('data-highlighted')).toBe(false)
  })
})
