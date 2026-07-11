import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest, ComponentUnderTestCircular } from './basic.tsx'

describe('Progress', () => {
  it('renders all linear parts with correct initial state', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue={40} />, { qwikLoader: true })

    expect(document.querySelector('[data-part="root"]')?.tagName.toLowerCase()).toBe('div')
    expect(document.querySelector('[data-part="label"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="track"]')?.getAttribute('data-part')).toBe('track')
    expect(document.querySelector('[data-testid="range"]')?.getAttribute('data-part')).toBe('range')
    expect(document.querySelector('[data-testid="value-text"]')?.textContent).toBe('40%')
  })

  it('reflects controlled value through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest value={75} />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="value-text"]')?.textContent).toBe('75%')
    expect(document.querySelector('[data-part="root"]')?.getAttribute('data-state')).toBe('loading')
  })

  it('reflects the complete state through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest value={100} />, { qwikLoader: true })

    expect(document.querySelector('[data-part="root"]')?.getAttribute('data-state')).toBe('complete')
  })

  it('renders all circular parts', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTestCircular defaultValue={25} />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="circle"]')?.tagName.toLowerCase()).toBe('svg')
    expect(document.querySelector('[data-testid="circle-track"]')?.tagName.toLowerCase()).toBe('circle')
    expect(document.querySelector('[data-testid="circle-range"]')?.tagName.toLowerCase()).toBe('circle')
    expect(document.querySelector('[data-testid="value-text"]')?.textContent).toBe('25%')
  })
})
