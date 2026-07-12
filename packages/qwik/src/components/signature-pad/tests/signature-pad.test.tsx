import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('SignaturePad', () => {
  it('renders the label, control, and guide', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="label"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="control"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="guide"]')).toBeTruthy()
  })

  it('renders the segment as an svg with a title', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const segment = document.querySelector('[data-testid="segment"]')
    expect(segment?.tagName.toLowerCase()).toBe('svg')
    expect(segment?.querySelector('title')?.textContent).toBe('Signature')
  })

  it('hides the clear trigger when there are no paths', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="clear-trigger"]')?.hasAttribute('hidden')).toBe(true)
  })

  it('shows the clear trigger and renders a path element when defaultPaths are given', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultPaths={['M0 0 L10 10']} />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="clear-trigger"]')?.hasAttribute('hidden')).toBe(false)
    const path = document.querySelector('[data-testid="segment"] path')
    expect(path?.getAttribute('d')).toBe('M0 0 L10 10')
  })

  it('renders the hidden input as a text input with the given value', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest hiddenInputValue="signed" />, { qwikLoader: true })

    const input = document.querySelector('[data-testid="hidden-input"]') as HTMLInputElement | null
    expect(input?.getAttribute('type')).toBe('text')
    expect(input?.hasAttribute('hidden')).toBe(true)
    expect(input?.value).toBe('signed')
  })

  it('reflects disabled state on the root and control', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest disabled />, { qwikLoader: true })

    expect(document.querySelector('[data-part="root"]')?.hasAttribute('data-disabled')).toBe(true)
    expect(document.querySelector('[data-testid="control"]')?.hasAttribute('data-disabled')).toBe(true)
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest onDraw$={$(() => {})} onDrawEnd$={$(() => {})} />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="control"]')).toBeTruthy()
  })
})
