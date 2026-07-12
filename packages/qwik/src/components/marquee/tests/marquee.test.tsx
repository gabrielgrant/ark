import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('Marquee', () => {
  it('renders the viewport and both edges', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="viewport"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="edge-start"]')?.getAttribute('data-side')).toBe('start')
    expect(document.querySelector('[data-testid="edge-end"]')?.getAttribute('data-side')).toBe('end')
  })

  it('renders two content wrappers by default (real + one clone)', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const wrappers = document.querySelectorAll('[data-testid="content"]')
    expect(wrappers.length).toBe(2)
  })

  it('marks index 0 as the real (accessible) content and index 1+ as presentation clones', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const wrappers = document.querySelectorAll('[data-testid="content"]')
    const real = wrappers[0]
    const clone = wrappers[1]

    expect(real?.getAttribute('data-index')).toBe('0')
    expect(real?.hasAttribute('data-clone')).toBe(false)
    expect(real?.hasAttribute('aria-hidden')).toBe(false)

    expect(clone?.getAttribute('data-index')).toBe('1')
    expect(clone?.hasAttribute('data-clone')).toBe(true)
    expect(clone?.getAttribute('aria-hidden')).toBe('true')
    expect(clone?.getAttribute('role')).toBe('presentation')
  })

  it('renders the projected items only inside the real content wrapper', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const wrappers = document.querySelectorAll('[data-testid="content"]')
    expect(wrappers[0]?.querySelector('[data-testid="item-0"]')).toBeTruthy()
    expect(wrappers[0]?.querySelector('[data-testid="item-1"]')).toBeTruthy()
  })

  it('reflects the paused state on the root', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest paused />, { qwikLoader: true })

    const root = document.querySelector('[data-testid="root"]')
    expect(root?.getAttribute('data-state')).toBe('paused')
    expect(root?.hasAttribute('data-paused')).toBe(true)
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest onPauseChange$={$(() => {})} onLoopComplete$={$(() => {})} onComplete$={$(() => {})} />,
      { qwikLoader: true },
    )

    expect(document.querySelector('[data-testid="root"]')).toBeTruthy()
  })
})
