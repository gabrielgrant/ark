import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { Presence } from '../index.ts'

describe('Presence', () => {
  it('renders visible content when present', async () => {
    const { document } = await ssrRenderToDom(
      <Presence present data-testid="presence">
        Content
      </Presence>,
      { qwikLoader: true },
    )
    const el = document.querySelector('[data-testid="presence"]')
    expect(el).toBeTruthy()
    expect(el?.hasAttribute('hidden')).toBe(false)
    expect(el?.getAttribute('data-state')).toBe('open')
  })

  it('renders hidden content when not present', async () => {
    const { document } = await ssrRenderToDom(
      <Presence present={false} data-testid="presence">
        Content
      </Presence>,
      { qwikLoader: true },
    )
    const el = document.querySelector('[data-testid="presence"]')
    expect(el).toBeTruthy()
    expect(el?.hasAttribute('hidden')).toBe(true)
    expect(el?.getAttribute('data-state')).toBe('closed')
  })

  it('does not render at all with lazyMount before first present', async () => {
    const { document } = await ssrRenderToDom(
      <Presence present={false} lazyMount data-testid="presence">
        Content
      </Presence>,
      { qwikLoader: true },
    )
    expect(document.querySelector('[data-testid="presence"]')).toBeFalsy()
  })
})
