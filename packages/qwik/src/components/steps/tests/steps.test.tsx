import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

/**
 * These tests exercise the SSR render + cross-part context wiring of the Qwik
 * Steps via Qwik 2's official testing utilities. See PLAN.md R5.
 */
describe('Steps', () => {
  it('renders all parts with the correct elements', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="root"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="list"]')?.getAttribute('role')).toBe('tablist')
    expect(document.querySelector('[data-testid="trigger-0"]')?.tagName.toLowerCase()).toBe('button')
    expect(document.querySelector('[data-testid="indicator-0"]')?.tagName.toLowerCase()).toBe('span')
    expect(document.querySelector('[data-testid="content-0"]')?.getAttribute('role')).toBe('tabpanel')
    expect(document.querySelector('[data-testid="next-trigger"]')?.tagName.toLowerCase()).toBe('button')
    expect(document.querySelector('[data-testid="prev-trigger"]')?.tagName.toLowerCase()).toBe('button')
    expect(document.querySelector('[data-testid="progress"]')?.getAttribute('role')).toBe('progressbar')
  })

  it('marks step 0 as current and only shows its content initially', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="trigger-0"]')?.getAttribute('data-current')).toBe('')
    expect(document.querySelector('[data-testid="trigger-0"]')?.getAttribute('aria-selected')).toBe('true')
    expect(document.querySelector('[data-testid="content-0"]')?.hasAttribute('hidden')).toBe(false)
    expect(document.querySelector('[data-testid="content-1"]')?.hasAttribute('hidden')).toBe(true)
  })

  it('disables the prev trigger on the first step and enables next', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="prev-trigger"]')?.hasAttribute('disabled')).toBe(true)
    expect(document.querySelector('[data-testid="next-trigger"]')?.hasAttribute('disabled')).toBe(false)
  })

  it('reflects a controlled step prop through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest step={1} />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="trigger-1"]')?.getAttribute('data-current')).toBe('')
    expect(document.querySelector('[data-testid="trigger-0"]')?.getAttribute('data-complete')).toBe('')
    expect(document.querySelector('[data-testid="content-1"]')?.hasAttribute('hidden')).toBe(false)
  })

  it('hides the completed-content until the final step is reached', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })
    expect(document.querySelector('[data-testid="completed-content"]')?.hasAttribute('hidden')).toBe(true)

    const { document: doc2 } = await ssrRenderToDom(<ComponentUnderTest step={3} />, { qwikLoader: true })
    expect(doc2.querySelector('[data-testid="completed-content"]')?.hasAttribute('hidden')).toBe(false)
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest
        onStepChange$={$(() => {})}
        onStepComplete$={$(() => {})}
        onStepInvalid$={$(() => {})}
      />,
      { qwikLoader: true },
    )
    expect(document.querySelector('[data-testid="root"]')).toBeTruthy()
  })
})
