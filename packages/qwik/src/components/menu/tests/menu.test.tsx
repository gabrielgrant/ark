import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'
import { NestedMenu } from './nested.tsx'

describe('Menu', () => {
  it('renders closed by default with content hidden', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const trigger = document.querySelector('[data-testid="trigger"]')
    const content = document.querySelector('[data-testid="content"]')

    expect(trigger?.getAttribute('aria-expanded')).toBe('false')
    expect(content?.hasAttribute('hidden')).toBe(true)
    expect(content?.getAttribute('data-state')).toBe('closed')
  })

  it('renders open with menu semantics when open', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest open />, { qwikLoader: true })

    const trigger = document.querySelector('[data-testid="trigger"]')
    const content = document.querySelector('[data-testid="content"]')

    expect(trigger?.getAttribute('aria-expanded')).toBe('true')
    expect(content?.hasAttribute('hidden')).toBe(false)
    expect(content?.getAttribute('data-state')).toBe('open')
    expect(document.querySelectorAll('[data-part="item"]').length).toBe(3)
  })

  it('marks a disabled item', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest open />, { qwikLoader: true })

    const deleteItem = document.querySelector('[data-testid="item-delete"]')
    expect(deleteItem?.getAttribute('data-disabled')).toBe('')
    expect(deleteItem?.getAttribute('aria-disabled')).toBe('true')
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest onSelect$={$(() => {})} />, {
      qwikLoader: true,
    })
    expect(document.querySelector('[data-testid="trigger"]')).toBeTruthy()
  })

  it('renders a nested submenu structure through SSR', async () => {
    const { document } = await ssrRenderToDom(<NestedMenu />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="trigger"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="item-share"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="sub-content"]')).toBeTruthy()
  })
})
