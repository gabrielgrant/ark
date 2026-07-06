import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

/**
 * These tests exercise the SSR render + cross-part context wiring of the Qwik
 * Checkbox via Qwik 2's official testing utilities.
 *
 * NOTE: user-interaction tests (toggling via click) are intentionally absent.
 * The Zag Qwik adapter only runs its client logic when `@qwik.dev/core/build`'s
 * `isServer` is false, and that flag's `isBrowser` check explicitly excludes
 * jsdom/node (`String(HTMLElement).includes("[native code]")`). So in any
 * headless test the machine stays in SSR mode and never starts — interaction
 * must be validated in a real browser (Playwright, as Zag does) or via
 * qwik-testing-library once it supports Qwik 2. See PLAN.md §9.
 */
describe('Checkbox', () => {
  it('renders all parts with the correct elements', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest data-testid="root" />, { qwikLoader: true })

    expect(document.querySelector('[data-part="root"]')?.tagName.toLowerCase()).toBe('label')
    expect(document.querySelector('[data-part="control"]')).toBeTruthy()
    expect(document.querySelector('[data-part="label"]')).toBeTruthy()
    expect(document.querySelector('input[type="checkbox"]')).toBeTruthy()
  })

  it('shares machine context across parts (consistent initial data-state)', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-part="root"]')?.getAttribute('data-state')).toBe('unchecked')
    expect(document.querySelector('[data-part="control"]')?.getAttribute('data-state')).toBe('unchecked')
    expect(document.querySelector('[data-part="label"]')?.getAttribute('data-state')).toBe('unchecked')
  })

  it('reflects a controlled checked prop through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest checked />, { qwikLoader: true })

    expect(document.querySelector('[data-part="control"]')?.getAttribute('data-state')).toBe('checked')
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest onCheckedChange$={$(() => {})} />, {
      qwikLoader: true,
    })
    expect(document.querySelector('[data-part="root"]')).toBeTruthy()
  })

  it('reflects the indeterminate state', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest checked="indeterminate" />, { qwikLoader: true })

    expect(document.querySelector('[data-part="control"]')?.getAttribute('data-state')).toBe('indeterminate')
  })
})
