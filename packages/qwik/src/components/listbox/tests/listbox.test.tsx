import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { $ } from '@qwik.dev/core'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('Listbox', () => {
  it('renders all parts with correct initial state', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-part="root"]')?.tagName.toLowerCase()).toBe('div')
    expect(document.querySelector('[data-part="label"]')).toBeTruthy()
    expect(document.querySelectorAll('[data-part="item"]').length).toBe(4)

    const reactItem = document.querySelector('[data-testid="item-react"]')
    expect(reactItem?.getAttribute('aria-selected')).toBe('false')
  })

  it('reflects controlled value through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest value={['solid']} />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="item-solid"]')?.getAttribute('aria-selected')).toBe('true')
    expect(document.querySelector('[data-testid="item-react"]')?.getAttribute('aria-selected')).toBe('false')
  })

  it('reflects defaultValue through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue={['vue']} />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="item-vue"]')?.getAttribute('aria-selected')).toBe('true')
  })

  it('renders the value text placeholder when empty', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="value-text"]')?.textContent).toBe('Select a framework')
  })

  it('renders the selected value text through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue={['svelte']} />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="value-text"]')?.textContent).toBe('Svelte')
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest onValueChange$={$(() => {})} />, {
      qwikLoader: true,
    })
    expect(document.querySelector('[data-part="root"]')).toBeTruthy()
  })
})
