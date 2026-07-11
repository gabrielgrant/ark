import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

/**
 * These tests exercise the SSR render + cross-part context wiring of the Qwik
 * QrCode via Qwik 2's official testing utilities. See PLAN.md R5.
 */
describe('QrCode', () => {
  it('renders all parts with the correct elements', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue="https://ark-ui.com" />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="root"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="frame"]')?.tagName.toLowerCase()).toBe('svg')
    expect(document.querySelector('[data-testid="pattern"]')?.tagName.toLowerCase()).toBe('path')
    expect(document.querySelector('[data-testid="overlay"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="download-trigger"]')?.tagName.toLowerCase()).toBe('button')
  })

  it('generates a non-empty svg path for the encoded value', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue="https://ark-ui.com" />, {
      qwikLoader: true,
    })

    const d = document.querySelector('[data-testid="pattern"]')?.getAttribute('d')
    expect(d).toBeTruthy()
    expect(d?.length).toBeGreaterThan(0)
  })

  it('projects overlay and download-trigger content', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue="https://ark-ui.com" />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="overlay-content"]')?.textContent).toBe('logo')
    expect(document.querySelector('[data-testid="download-trigger"]')?.textContent).toBe('Download')
  })

  it('changes the generated path when the controlled value changes', async () => {
    const { document: doc1 } = await ssrRenderToDom(<ComponentUnderTest value="https://ark-ui.com" />, {
      qwikLoader: true,
    })
    const { document: doc2 } = await ssrRenderToDom(<ComponentUnderTest value="https://chakra-ui.com" />, {
      qwikLoader: true,
    })

    const d1 = doc1.querySelector('[data-testid="pattern"]')?.getAttribute('d')
    const d2 = doc2.querySelector('[data-testid="pattern"]')?.getAttribute('d')
    expect(d1).not.toBe(d2)
  })

  it('serializes the onValueChange$ QRL callback prop through SSR', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest defaultValue="https://ark-ui.com" onValueChange$={$(() => {})} />,
      { qwikLoader: true },
    )
    expect(document.querySelector('[data-testid="root"]')).toBeTruthy()
  })
})
