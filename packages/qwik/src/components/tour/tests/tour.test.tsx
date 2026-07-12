import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

/**
 * Headless SSR/render tests (PLAN.md R5): the adapter never starts a machine
 * outside a real browser, so the tour stays `NotStarted`/closed. Interaction
 * (`start()`, advancing steps) is covered by tour.browser.test.tsx.
 */
describe('Tour', () => {
  it('renders all parts with the correct elements, closed by default', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="start-tour"]')).toBeTruthy()
    expect(document.querySelector('[data-part="content"]')?.tagName.toLowerCase()).toBe('div')
    expect(document.querySelector('[data-part="title"]')?.tagName.toLowerCase()).toBe('h2')
    expect(document.querySelector('[data-part="description"]')).toBeTruthy()
    expect(document.querySelector('[data-part="close-trigger"]')).toBeTruthy()

    expect(document.querySelector('[data-testid="content"]')?.getAttribute('data-state')).toBe('closed')
    expect(document.querySelector('[data-testid="content"]')?.hasAttribute('hidden')).toBe(true)
  })

  it('shares machine context across parts', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="backdrop"]')?.hasAttribute('hidden')).toBe(true)
  })
})
