import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('Combobox', () => {
  it('renders closed by default with content hidden', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const trigger = document.querySelector('[data-testid="trigger"]')
    const content = document.querySelector('[data-testid="content"]')
    const input = document.querySelector('[data-testid="input"]')

    expect(trigger?.getAttribute('aria-expanded')).toBe('false')
    expect(input?.getAttribute('aria-expanded')).toBe('false')
    expect(content?.hasAttribute('hidden')).toBe(true)
    expect(content?.getAttribute('data-state')).toBe('closed')
  })

  it('renders open with combobox semantics when open', async () => {
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

  it('reflects controlled inputValue through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest inputValue="Sol" />, { qwikLoader: true })

    const input = document.querySelector('[data-testid="input"]') as HTMLInputElement | null
    expect(input?.getAttribute('value')).toBe('Sol')
  })

  it('reflects defaultInputValue through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultInputValue="Vu" />, { qwikLoader: true })

    const input = document.querySelector('[data-testid="input"]') as HTMLInputElement | null
    expect(input?.getAttribute('value')).toBe('Vu')
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest onValueChange$={$(() => {})} onInputValueChange$={$(() => {})} />,
      { qwikLoader: true },
    )
    expect(document.querySelector('[data-testid="trigger"]')).toBeTruthy()
  })

  it('supports controlled open', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest open={false} />, { qwikLoader: true })

    const content = document.querySelector('[data-testid="content"]')
    expect(content?.getAttribute('data-state')).toBe('closed')
  })

  it('marks the disabled item accordingly', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest open />, { qwikLoader: true })

    const svelteItem = document.querySelector('[data-testid="item-svelte"]')
    expect(svelteItem?.hasAttribute('data-disabled')).toBe(true)
  })
})
