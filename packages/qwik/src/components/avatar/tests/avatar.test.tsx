import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { Avatar } from '../index.ts'

const ComponentUnderTest = (props: Avatar.RootProps) => (
  <Avatar.Root {...props}>
    <Avatar.Fallback data-testid="fallback">PA</Avatar.Fallback>
    <Avatar.Image data-testid="image" src="https://example.com/a.png" alt="PA" />
  </Avatar.Root>
)

describe('Avatar', () => {
  it('renders fallback visible and image hidden before load', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const fallback = document.querySelector('[data-testid="fallback"]')
    const image = document.querySelector('[data-testid="image"]')

    expect(document.querySelector('[data-part="root"]')).toBeTruthy()
    expect(fallback?.hasAttribute('hidden')).toBe(false)
    expect(image?.getAttribute('data-state')).toBe('hidden')
  })
})
