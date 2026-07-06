import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('Collapsible', () => {
  it('renders closed by default with hidden content', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const trigger = document.querySelector('[data-part="trigger"]')
    const content = document.querySelector('[data-testid="content"]')
    expect(trigger?.getAttribute('aria-expanded')).toBe('false')
    expect(content?.hasAttribute('hidden')).toBe(true)
  })

  it('renders open content when defaultOpen', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultOpen />, { qwikLoader: true })

    expect(document.querySelector('[data-part="trigger"]')?.getAttribute('aria-expanded')).toBe('true')
    expect(document.querySelector('[data-testid="content"]')?.hasAttribute('hidden')).toBe(false)
  })

  it('does not render content with lazyMount until opened', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest lazyMount />, { qwikLoader: true })
    expect(document.querySelector('[data-testid="content"]')).toBeFalsy()
  })
})
