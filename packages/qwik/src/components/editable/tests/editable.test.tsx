import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('Editable', () => {
  it('renders all parts with the correct elements', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-part="root"]')?.tagName.toLowerCase()).toBe('div')
    expect(document.querySelector('[data-part="label"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="area"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="input"]')?.tagName.toLowerCase()).toBe('input')
    expect(document.querySelector('[data-testid="preview"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="edit-trigger"]')?.tagName.toLowerCase()).toBe('button')
  })

  it('shows the preview and hides the input/submit/cancel triggers in preview mode', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="preview"]')?.hasAttribute('hidden')).toBe(false)
    expect(document.querySelector('[data-testid="input"]')?.hasAttribute('hidden')).toBe(true)
    expect(document.querySelector('[data-testid="edit-trigger"]')?.hasAttribute('hidden')).toBe(false)
    expect(document.querySelector('[data-testid="submit-trigger"]')?.hasAttribute('hidden')).toBe(true)
    expect(document.querySelector('[data-testid="cancel-trigger"]')?.hasAttribute('hidden')).toBe(true)
  })

  it('shows the input and submit/cancel triggers in edit mode', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest edit />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="preview"]')?.hasAttribute('hidden')).toBe(true)
    expect(document.querySelector('[data-testid="input"]')?.hasAttribute('hidden')).toBe(false)
    expect(document.querySelector('[data-testid="edit-trigger"]')?.hasAttribute('hidden')).toBe(true)
    expect(document.querySelector('[data-testid="submit-trigger"]')?.hasAttribute('hidden')).toBe(false)
    expect(document.querySelector('[data-testid="cancel-trigger"]')?.hasAttribute('hidden')).toBe(false)
  })

  it('reflects a controlled value through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest value="Gabriel" />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="preview"]')?.textContent).toBe('Gabriel')
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
