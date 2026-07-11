import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('Popover', () => {
  it('renders closed by default with content hidden', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const trigger = document.querySelector('[data-testid="trigger"]')
    const content = document.querySelector('[data-testid="content"]')

    expect(trigger?.getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger?.getAttribute('aria-expanded')).toBe('false')
    expect(content?.hasAttribute('hidden')).toBe(true)
    expect(content?.getAttribute('data-state')).toBe('closed')
  })

  it('renders open with popover semantics when open', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest open />, { qwikLoader: true })

    const trigger = document.querySelector('[data-testid="trigger"]')
    const content = document.querySelector('[data-testid="content"]')
    const title = document.querySelector('[data-testid="title"]')
    const description = document.querySelector('[data-testid="description"]')
    const positioner = document.querySelector('[data-testid="positioner"]')

    expect(trigger?.getAttribute('aria-expanded')).toBe('true')
    expect(content?.hasAttribute('hidden')).toBe(false)
    expect(content?.getAttribute('data-state')).toBe('open')
    expect(content?.getAttribute('role')).toBe('dialog')
    expect(content?.getAttribute('aria-labelledby')).toBe(title?.id)
    expect(content?.getAttribute('aria-describedby')).toBe(description?.id)
    expect(positioner).toBeTruthy()
  })

  it('does not render content with lazyMount until opened', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest lazyMount />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="content"]')).toBeFalsy()
    expect(document.querySelector('[data-testid="positioner"]')).toBeFalsy()
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest onOpenChange$={$(() => {})} />, {
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
