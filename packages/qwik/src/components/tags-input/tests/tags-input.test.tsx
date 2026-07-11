import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('TagsInput', () => {
  it('renders a tag item for each defaultValue entry', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="item-react"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="item-solid"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="item-vue"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="item-react"] [data-part="item-text"]')?.textContent).toBe('react')
  })

  it('reflects a controlled value through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest value={['qwik']} />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="item-qwik"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="item-react"]')).toBeFalsy()
  })

  it('marks the root as disabled', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest disabled />, { qwikLoader: true })

    const root = document.querySelector('[data-part="root"]')
    expect(root?.hasAttribute('data-disabled')).toBe(true)
  })

  it('marks the input as invalid', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest invalid />, { qwikLoader: true })

    const input = document.querySelector('[data-testid="input"]')
    expect(input?.getAttribute('aria-invalid')).toBe('true')
  })

  it('renders a non-empty hidden input value for form submission', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const hiddenInput = document.querySelector('[data-testid="hidden-input"]') as HTMLInputElement | null
    expect(hiddenInput?.hasAttribute('hidden')).toBe(true)
    expect(hiddenInput?.getAttribute('value')).toBeTruthy()
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest onValueChange$={$(() => {})} />, {
      qwikLoader: true,
    })
    expect(document.querySelector('[data-testid="input"]')).toBeTruthy()
  })
})
