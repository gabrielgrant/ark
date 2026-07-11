import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

/**
 * These tests exercise the SSR render + cross-part context wiring of the Qwik
 * Clipboard via Qwik 2's official testing utilities. Interaction (clicking
 * the trigger to copy) must be validated in a real browser — see PLAN.md R5.
 */
describe('Clipboard', () => {
  it('renders all parts with the correct elements', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue="https://ark-ui.com" />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-part="root"]')).toBeTruthy()
    expect(document.querySelector('[data-part="label"]')?.tagName.toLowerCase()).toBe('label')
    expect(document.querySelector('[data-part="control"]')).toBeTruthy()
    expect(document.querySelector('input')).toBeTruthy()
    expect(document.querySelector('[data-testid="trigger"]')?.tagName.toLowerCase()).toBe('button')
  })

  it('reflects the value on the input and value-text parts', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue="https://ark-ui.com" />, {
      qwikLoader: true,
    })

    expect((document.querySelector('[data-testid="input"]') as HTMLInputElement)?.value).toBe('https://ark-ui.com')
    expect(document.querySelector('[data-testid="value-text"]')?.textContent).toBe('https://ark-ui.com')
  })

  it('shares machine context across parts (consistent initial data-copied)', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue="https://ark-ui.com" />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-part="root"]')?.hasAttribute('data-copied')).toBe(false)
    expect(document.querySelector('[data-part="control"]')?.hasAttribute('data-copied')).toBe(false)
    expect(document.querySelector('[data-testid="trigger"]')?.hasAttribute('data-copied')).toBe(false)
  })

  it('shows the default indicator slot before copying', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultValue="https://ark-ui.com" />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="copy-icon"]')).toBeTruthy()
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest defaultValue="https://ark-ui.com" onValueChange$={$(() => {})} onStatusChange$={$(() => {})} />,
      { qwikLoader: true },
    )
    expect(document.querySelector('[data-part="root"]')).toBeTruthy()
  })
})
