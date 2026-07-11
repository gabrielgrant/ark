import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('Tabs', () => {
  it('renders all parts with correct initial state', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue="React" />, { qwikLoader: true })

    expect(document.querySelector('[data-part="root"]')?.tagName.toLowerCase()).toBe('div')
    expect(document.querySelectorAll('[data-part="trigger"]').length).toBe(3)

    const reactTrigger = document.querySelector('[data-testid="trigger-React"]')
    expect(reactTrigger?.getAttribute('aria-selected')).toBe('true')
    expect(document.querySelector('[data-testid="content-React"]')?.hasAttribute('hidden')).toBe(false)
    expect(document.querySelector('[data-testid="content-Solid"]')?.hasAttribute('hidden')).toBe(true)
  })

  it('reflects controlled value through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest value="Solid" />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="trigger-Solid"]')?.getAttribute('aria-selected')).toBe('true')
    expect(document.querySelector('[data-testid="content-Solid"]')?.hasAttribute('hidden')).toBe(false)
    expect(document.querySelector('[data-testid="trigger-React"]')?.getAttribute('aria-selected')).toBe('false')
    expect(document.querySelector('[data-testid="content-React"]')?.hasAttribute('hidden')).toBe(true)
  })

  it('does not render any content with lazyMount until a tab is selected', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest lazyMount />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="content-React"]')).toBeFalsy()
    expect(document.querySelector('[data-testid="content-Solid"]')).toBeFalsy()
    expect(document.querySelector('[data-testid="content-Vue"]')).toBeFalsy()
  })
})
