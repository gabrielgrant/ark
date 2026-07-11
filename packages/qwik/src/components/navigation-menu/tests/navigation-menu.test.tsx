import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('NavigationMenu', () => {
  it('renders closed by default with content hidden', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const trigger = document.querySelector('[data-testid="trigger-features"]')
    const content = document.querySelector('[data-testid="content-features"]')

    expect(document.querySelector('[data-testid="list"]')).toBeTruthy()
    expect(trigger?.tagName.toLowerCase()).toBe('button')
    expect(content?.hasAttribute('hidden')).toBe(true)
  })

  it('renders link parts as anchors', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="link-about"]')?.tagName.toLowerCase()).toBe('a')
    expect(document.querySelector('[data-testid="link-about"]')?.getAttribute('href')).toBe('#about')
  })

  it('reflects controlled value through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest value="docs" />, { qwikLoader: true })

    const docsContent = document.querySelector('[data-testid="content-docs"]')
    const featuresContent = document.querySelector('[data-testid="content-features"]')

    expect(docsContent?.hasAttribute('hidden')).toBe(false)
    expect(featuresContent?.hasAttribute('hidden')).toBe(true)
  })

  it('reflects defaultValue through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue="features" />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="content-features"]')?.hasAttribute('hidden')).toBe(false)
  })

  it('does not render content markup with lazyMount until opened', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest lazyMount />, { qwikLoader: true })
    expect(document.querySelector('[data-testid="content-features"]')).toBeFalsy()
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest onValueChange$={$(() => {})} />, {
      qwikLoader: true,
    })
    expect(document.querySelector('[data-testid="trigger-features"]')).toBeTruthy()
  })
})
