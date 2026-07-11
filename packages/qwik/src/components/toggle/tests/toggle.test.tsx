import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('Toggle', () => {
  it('renders all parts with correct initial state', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-part="root"]')?.tagName.toLowerCase()).toBe('button')
    expect(document.querySelector('[data-part="root"]')?.getAttribute('data-state')).toBe('off')
    expect(document.querySelector('[data-part="indicator"]')).toBeTruthy()

    const indicator = document.querySelector('[data-testid="indicator"]') as HTMLElement
    expect(indicator.querySelector('span[hidden]')).toBeTruthy()
    expect(indicator.textContent).toContain('Off')
  })

  it('reflects controlled pressed through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest pressed />, { qwikLoader: true })

    expect(document.querySelector('[data-part="root"]')?.getAttribute('data-state')).toBe('on')

    const indicator = document.querySelector('[data-testid="indicator"]') as HTMLElement
    expect(indicator.querySelector('span[hidden]')).toBeFalsy()
    expect(indicator.textContent).toContain('On')
  })
})
