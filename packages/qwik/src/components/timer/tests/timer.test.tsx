import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

/**
 * These tests exercise the SSR render + cross-part context wiring of the Qwik
 * Timer via Qwik 2's official testing utilities. The machine never starts in
 * a headless harness (PLAN.md R5), so ticking must be validated in a real
 * browser — see timer.browser.test.tsx.
 */
describe('Timer', () => {
  it('renders all parts with the correct elements', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="root"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="area"]')?.getAttribute('role')).toBe('timer')
    expect(document.querySelector('[data-testid="item-minutes"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="separator"]')?.getAttribute('aria-hidden')).toBe('true')
    expect(document.querySelector('[data-testid="start"]')?.tagName.toLowerCase()).toBe('button')
  })

  it('renders the formatted (zero-padded) initial time on item parts', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest startMs={2000} />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="item-minutes"]')?.textContent).toBe('00')
    expect(document.querySelector('[data-testid="item-seconds"]')?.textContent).toBe('02')
  })

  it('hides the start trigger and shows pause once autoStart is set', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest autoStart />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="start"]')?.hasAttribute('hidden')).toBe(true)
    expect(document.querySelector('[data-testid="pause"]')?.hasAttribute('hidden')).toBe(false)
  })

  it('shows the start trigger and hides pause/reset when idle', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="start"]')?.hasAttribute('hidden')).toBe(false)
    expect(document.querySelector('[data-testid="pause"]')?.hasAttribute('hidden')).toBe(true)
    expect(document.querySelector('[data-testid="reset"]')?.hasAttribute('hidden')).toBe(true)
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest onTick$={$(() => {})} onComplete$={$(() => {})} />,
      { qwikLoader: true },
    )
    expect(document.querySelector('[data-testid="root"]')).toBeTruthy()
  })
})
