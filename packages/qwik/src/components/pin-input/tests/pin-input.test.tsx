import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('PinInput', () => {
  it('renders all parts with the correct elements', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-part="root"]')?.tagName.toLowerCase()).toBe('div')
    expect(document.querySelector('[data-part="label"]')).toBeTruthy()
    expect(document.querySelectorAll('[data-part="input"]').length).toBe(3)
    expect(document.querySelector('[data-testid="hidden-input"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="hidden-input"]')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('reflects a controlled value through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest value={['1', '2', '3']} />, { qwikLoader: true })

    expect(document.querySelector('[data-part="root"]')?.getAttribute('data-complete')).toBe('')
    expect(document.querySelector('[data-testid="input-0"]')?.getAttribute('data-filled')).toBe('')
  })

  it('reflects an incomplete value through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest value={['1', '', '']} />, { qwikLoader: true })

    expect(document.querySelector('[data-part="root"]')?.hasAttribute('data-complete')).toBe(false)
    expect(document.querySelector('[data-testid="input-1"]')?.hasAttribute('data-filled')).toBe(false)
  })

  it('reflects the invalid state', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest invalid />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="input-0"]')?.getAttribute('aria-invalid')).toBe('true')
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest onValueChange$={$(() => {})} />, {
      qwikLoader: true,
    })
    expect(document.querySelector('[data-part="root"]')).toBeTruthy()
  })
})
