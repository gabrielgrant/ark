import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('Pagination', () => {
  it('marks page 1 as the current page by default', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest count={100} pageSize={10} />, {
      qwikLoader: true,
    })

    const item1 = document.querySelector('[data-testid="item-1"]')
    const item2 = document.querySelector('[data-testid="item-2"]')

    expect(item1?.getAttribute('aria-current')).toBe('page')
    expect(item2?.hasAttribute('aria-current')).toBe(false)
  })

  it('reflects a controlled page through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest count={100} pageSize={10} page={3} />, {
      qwikLoader: true,
    })

    const item3 = document.querySelector('[data-testid="item-3"]')
    expect(item3?.getAttribute('aria-current')).toBe('page')
  })

  it('renders an ellipsis when the page range overflows', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest count={500} pageSize={10} page={25} />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-part="ellipsis"]')).toBeTruthy()
  })

  it('disables the prev trigger on the first page', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest count={100} pageSize={10} />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="prev-trigger"]')?.hasAttribute('disabled')).toBe(true)
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest count={100} pageSize={10} onPageChange$={$(() => {})} />,
      { qwikLoader: true },
    )
    expect(document.querySelector('[data-testid="next-trigger"]')).toBeTruthy()
  })
})
