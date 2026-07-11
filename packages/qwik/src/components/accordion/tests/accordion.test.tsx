import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('Accordion', () => {
  it('renders all parts with correct initial state', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-part="root"]')?.tagName.toLowerCase()).toBe('div')
    expect(document.querySelectorAll('[data-part="item"]').length).toBe(3)
    expect(document.querySelectorAll('[data-part="item-trigger"]').length).toBe(3)

    const reactTrigger = document.querySelector('[data-testid="trigger-React"]')
    expect(reactTrigger?.getAttribute('aria-expanded')).toBe('false')
    expect(document.querySelector('[data-testid="content-React"]')?.hasAttribute('hidden')).toBe(true)
  })

  it('reflects controlled value through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest value={['Solid']} />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="trigger-Solid"]')?.getAttribute('aria-expanded')).toBe('true')
    expect(document.querySelector('[data-testid="content-Solid"]')?.hasAttribute('hidden')).toBe(false)
    expect(document.querySelector('[data-testid="trigger-React"]')?.getAttribute('aria-expanded')).toBe('false')
  })

  it('reflects defaultValue through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue={['Vue']} />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="trigger-Vue"]')?.getAttribute('aria-expanded')).toBe('true')
    expect(document.querySelector('[data-testid="content-Vue"]')?.hasAttribute('hidden')).toBe(false)
  })

  it('does not render collapsed item content markup with lazyMount', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest lazyMount />, { qwikLoader: true })
    expect(document.querySelector('[data-testid="content-React"]')).toBeFalsy()
  })
})
