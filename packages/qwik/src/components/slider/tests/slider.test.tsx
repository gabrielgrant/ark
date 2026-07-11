import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('Slider', () => {
  it('renders all parts with the correct elements', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue={[50]} />, { qwikLoader: true })

    expect(document.querySelector('[data-part="root"]')?.tagName.toLowerCase()).toBe('div')
    expect(document.querySelector('[data-part="label"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="thumb-0"]')?.getAttribute('role')).toBe('slider')
    expect(document.querySelector('[data-testid="track"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="range"]')).toBeTruthy()
    expect(document.querySelectorAll('[data-part="marker"]').length).toBe(2)
  })

  it('reflects a controlled value through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest value={[40]} min={0} max={100} />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="thumb-0"]')?.getAttribute('aria-valuenow')).toBe('40')
    expect(document.querySelector('[data-testid="thumb-0"]')?.getAttribute('aria-valuemin')).toBe('0')
    expect(document.querySelector('[data-testid="thumb-0"]')?.getAttribute('aria-valuemax')).toBe('100')
    expect(document.querySelector('[data-testid="value-text"]')?.textContent).toBe('40')
  })

  it('reflects defaultValue through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue={[65]} />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="thumb-0"]')?.getAttribute('aria-valuenow')).toBe('65')
  })

  it('reflects marker state relative to the value', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest value={[50]} />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="marker-25"]')?.getAttribute('data-state')).toBe('under-value')
    expect(document.querySelector('[data-testid="marker-75"]')?.getAttribute('data-state')).toBe('over-value')
  })

  it('reflects the disabled state', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest disabled defaultValue={[10]} />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="thumb-0"]')?.getAttribute('aria-disabled')).toBe('true')
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest onValueChange$={$(() => {})} />, {
      qwikLoader: true,
    })
    expect(document.querySelector('[data-part="root"]')).toBeTruthy()
  })
})
