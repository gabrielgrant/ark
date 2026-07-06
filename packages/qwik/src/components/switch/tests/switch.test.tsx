import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('Switch', () => {
  it('renders all parts with correct initial state', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-part="root"]')?.tagName.toLowerCase()).toBe('label')
    expect(document.querySelector('[data-part="control"]')?.getAttribute('data-state')).toBe('unchecked')
    expect(document.querySelector('[data-part="thumb"]')).toBeTruthy()
    expect(document.querySelector('input[type="checkbox"]')).toBeTruthy()
  })

  it('reflects controlled checked through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest checked />, { qwikLoader: true })

    expect(document.querySelector('[data-part="control"]')?.getAttribute('data-state')).toBe('checked')
    expect(document.querySelector('[data-part="thumb"]')?.getAttribute('data-state')).toBe('checked')
  })
})
