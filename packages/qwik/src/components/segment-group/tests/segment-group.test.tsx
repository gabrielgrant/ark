import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('SegmentGroup', () => {
  it('renders all parts with correct initial state and segment-group data-scope', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const root = document.querySelector('[data-part="root"]')
    expect(root?.tagName.toLowerCase()).toBe('div')
    expect(root?.getAttribute('data-scope')).toBe('segment-group')
    expect(document.querySelector('[data-part="label"]')).toBeTruthy()
    expect(document.querySelectorAll('[data-part="item"]').length).toBe(3)
    expect(document.querySelectorAll('input[type="radio"]').length).toBe(3)

    const reactItem = document.querySelector('[data-testid="item-React"]')
    expect(reactItem?.getAttribute('data-state')).toBe('unchecked')
  })

  it('reflects controlled value through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest value="Solid" />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="item-Solid"]')?.getAttribute('data-state')).toBe('checked')
    expect(document.querySelector('[data-testid="control-Solid"]')?.getAttribute('data-state')).toBe('checked')
    expect(document.querySelector('[data-testid="item-React"]')?.getAttribute('data-state')).toBe('unchecked')
  })

  it('reflects defaultValue through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue="Vue" />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="item-Vue"]')?.getAttribute('data-state')).toBe('checked')
  })
})
