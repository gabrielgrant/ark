import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

/**
 * These tests exercise the SSR render + cross-part context wiring of the Qwik
 * Splitter via Qwik 2's official testing utilities. Pointer/keyboard resize
 * interaction must be validated in a real browser — see PLAN.md R5 and R14.
 */
describe('Splitter', () => {
  it('renders all parts with the correct elements', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="root"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="panel-a"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="panel-b"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="resize-trigger"]')?.tagName.toLowerCase()).toBe('button')
  })

  it('sets role=separator and aria-orientation on the resize trigger', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const trigger = document.querySelector('[data-testid="resize-trigger"]')
    expect(trigger?.getAttribute('role')).toBe('separator')
    expect(trigger?.getAttribute('aria-orientation')).toBe('horizontal')
    expect(trigger?.getAttribute('tabindex')).toBe('0')
  })

  it('sets data-orientation on the root and panels', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest orientation="vertical" />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="root"]')?.getAttribute('data-orientation')).toBe('vertical')
    expect(document.querySelector('[data-testid="panel-a"]')?.getAttribute('data-orientation')).toBe('vertical')
  })

  it('reflects data-id and data-index on panels', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="panel-a"]')?.getAttribute('data-id')).toBe('a')
    expect(document.querySelector('[data-testid="panel-a"]')?.getAttribute('data-index')).toBe('0')
    expect(document.querySelector('[data-testid="panel-b"]')?.getAttribute('data-index')).toBe('1')
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest
        onResize$={$(() => {})}
        onResizeStart$={$(() => {})}
        onResizeEnd$={$(() => {})}
        onCollapse$={$(() => {})}
        onExpand$={$(() => {})}
      />,
      { qwikLoader: true },
    )
    expect(document.querySelector('[data-testid="root"]')).toBeTruthy()
  })
})
