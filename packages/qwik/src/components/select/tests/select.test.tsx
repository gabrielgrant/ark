import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('Select', () => {
  it('renders closed by default with content hidden', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const trigger = document.querySelector('[data-testid="trigger"]')
    const content = document.querySelector('[data-testid="content"]')

    expect(trigger?.getAttribute('aria-expanded')).toBe('false')
    expect(content?.hasAttribute('hidden')).toBe(true)
    expect(content?.getAttribute('data-state')).toBe('closed')
  })

  it('renders open with select semantics when open', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest open />, { qwikLoader: true })

    const trigger = document.querySelector('[data-testid="trigger"]')
    const content = document.querySelector('[data-testid="content"]')

    expect(trigger?.getAttribute('aria-expanded')).toBe('true')
    expect(content?.hasAttribute('hidden')).toBe(false)
    expect(content?.getAttribute('data-state')).toBe('open')
  })

  it('does not render content with lazyMount until opened', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest lazyMount />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="content"]')).toBeFalsy()
    expect(document.querySelector('[data-testid="positioner"]')).toBeFalsy()
  })

  it('reflects controlled value through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest value={['solid']} />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="value-text"]')?.textContent).toBe('Solid')
  })

  it('reflects defaultValue through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue={['vue']} />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="value-text"]')?.textContent).toBe('Vue')
  })

  it('renders the value text placeholder when empty', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="value-text"]')?.textContent).toBe('Select a framework')
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest onValueChange$={$(() => {})} />, {
      qwikLoader: true,
    })
    expect(document.querySelector('[data-testid="trigger"]')).toBeTruthy()
  })

  it('supports controlled open', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest open={false} />, { qwikLoader: true })

    const content = document.querySelector('[data-testid="content"]')
    expect(content?.getAttribute('data-state')).toBe('closed')
  })
})
