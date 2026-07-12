import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('ScrollArea', () => {
  it('renders the viewport, content, scrollbars, and corner', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="viewport"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="content"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="scrollbar-vertical"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="scrollbar-horizontal"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="corner"]')).toBeTruthy()
  })

  it('renders all content rows inside the content part', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="row-0"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="row-49"]')).toBeTruthy()
  })

  it('reflects orientation on the scrollbar and its thumb', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="scrollbar-vertical"]')?.getAttribute('data-orientation')).toBe(
      'vertical',
    )
    expect(document.querySelector('[data-testid="thumb-vertical"]')?.getAttribute('data-orientation')).toBe(
      'vertical',
    )
    expect(document.querySelector('[data-testid="scrollbar-horizontal"]')?.getAttribute('data-orientation')).toBe(
      'horizontal',
    )
    expect(document.querySelector('[data-testid="thumb-horizontal"]')?.getAttribute('data-orientation')).toBe(
      'horizontal',
    )
  })

  it('marks the viewport as owned by the root', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const root = document.querySelector('[data-testid="root"]')
    const viewport = document.querySelector('[data-testid="viewport"]')
    expect(viewport?.getAttribute('data-ownedby')).toBe(root?.getAttribute('id'))
  })
})
