import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('FocusTrap', () => {
  it('renders a div wrapping the projected children', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const trap = document.querySelector('[data-testid="trap"]')
    expect(trap?.tagName.toLowerCase()).toBe('div')
    expect(trap?.querySelector('[data-testid="input-a"]')).toBeTruthy()
    expect(trap?.querySelector('[data-testid="input-b"]')).toBeTruthy()
    expect(trap?.querySelector('[data-testid="button-c"]')).toBeTruthy()
  })

  it('forwards arbitrary div attributes', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest class="my-trap" />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="trap"]')?.className).toBe('my-trap')
  })

  it('serializes QRL onActivate$/onDeactivate$ props through SSR', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest onActivate$={$(() => {})} onDeactivate$={$(() => {})} />,
      { qwikLoader: true },
    )

    expect(document.querySelector('[data-testid="trap"]')).toBeTruthy()
  })
})
