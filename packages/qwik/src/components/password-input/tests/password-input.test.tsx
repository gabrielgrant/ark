import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('PasswordInput', () => {
  it('renders the input as type password by default', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const input = document.querySelector('[data-testid="input"]')
    expect(input?.getAttribute('type')).toBe('password')

    const trigger = document.querySelector('[data-testid="visibility-trigger"]')
    expect(trigger?.getAttribute('aria-expanded')).toBe('false')
  })

  it('renders the input as type text when defaultVisible is set', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultVisible />, { qwikLoader: true })

    const input = document.querySelector('[data-testid="input"]')
    expect(input?.getAttribute('type')).toBe('text')
  })

  it('reflects a controlled visible prop through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest visible />, { qwikLoader: true })

    const input = document.querySelector('[data-testid="input"]')
    expect(input?.getAttribute('type')).toBe('text')
  })

  it('marks the input as disabled', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest disabled />, { qwikLoader: true })

    const input = document.querySelector('[data-testid="input"]') as HTMLInputElement | null
    expect(input?.hasAttribute('disabled')).toBe(true)
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest onVisibilityChange$={$(() => {})} />, {
      qwikLoader: true,
    })
    expect(document.querySelector('[data-testid="visibility-trigger"]')).toBeTruthy()
  })
})
