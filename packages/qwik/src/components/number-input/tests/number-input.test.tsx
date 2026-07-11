import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('NumberInput', () => {
  it('renders all parts with the correct elements', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-part="root"]')?.tagName.toLowerCase()).toBe('div')
    expect(document.querySelector('[data-part="label"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="input"]')?.getAttribute('role')).toBe('spinbutton')
    expect(document.querySelector('[data-testid="decrement"]')?.tagName.toLowerCase()).toBe('button')
    expect(document.querySelector('[data-testid="increment"]')?.tagName.toLowerCase()).toBe('button')
    expect(document.querySelector('[data-testid="scrubber"]')).toBeTruthy()
  })

  it('reflects a controlled value through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest value="5" />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="input"]')?.getAttribute('aria-valuenow')).toBe('5')
  })

  it('reflects min/max through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest min={0} max={10} />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="input"]')?.getAttribute('aria-valuemin')).toBe('0')
    expect(document.querySelector('[data-testid="input"]')?.getAttribute('aria-valuemax')).toBe('10')
  })

  it('reflects the disabled state', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest disabled />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="input"]')?.hasAttribute('disabled')).toBe(true)
    expect(document.querySelector('[data-testid="control"]')?.getAttribute('aria-disabled')).toBe('true')
  })

  it('reflects the invalid state', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest invalid />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="input"]')?.getAttribute('aria-invalid')).toBe('true')
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest onValueChange$={$(() => {})} />, {
      qwikLoader: true,
    })
    expect(document.querySelector('[data-part="root"]')).toBeTruthy()
  })
})
