import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('AngleSlider', () => {
  it('renders all parts with the correct elements', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue={0} />, { qwikLoader: true })

    expect(document.querySelector('[data-part="root"]')?.tagName.toLowerCase()).toBe('div')
    expect(document.querySelector('[data-part="label"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="thumb"]')?.getAttribute('role')).toBe('slider')
    expect(document.querySelectorAll('[data-part="marker"]').length).toBe(2)
  })

  it('reflects a controlled value through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest value={90} />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="thumb"]')?.getAttribute('aria-valuenow')).toBe('90')
    expect(document.querySelector('[data-testid="thumb"]')?.getAttribute('aria-valuemin')).toBe('0')
    expect(document.querySelector('[data-testid="thumb"]')?.getAttribute('aria-valuemax')).toBe('360')
    expect(document.querySelector('[data-testid="value-text"]')?.textContent).toBe('90deg')
  })

  it('reflects defaultValue through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue={45} />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="thumb"]')?.getAttribute('aria-valuenow')).toBe('45')
  })

  it('reflects the disabled state', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest disabled defaultValue={10} />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="control"]')?.getAttribute('data-disabled')).toBe('')
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest onValueChange$={$(() => {})} />, {
      qwikLoader: true,
    })
    expect(document.querySelector('[data-part="root"]')).toBeTruthy()
  })
})
