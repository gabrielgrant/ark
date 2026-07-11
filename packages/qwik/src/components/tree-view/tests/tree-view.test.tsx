import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('TreeView', () => {
  it('renders label, tree, and root nodes with correct initial state', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="label"]')?.tagName.toLowerCase()).toBe('h3')
    expect(document.querySelector('[data-testid="tree"]')?.getAttribute('role')).toBe('tree')
    expect(document.querySelector('[data-testid="branch-node_modules"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="item-package.json"]')).toBeTruthy()
  })

  it('renders branches collapsed by default', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const branch = document.querySelector('[data-testid="branch-node_modules"]')
    const trigger = document.querySelector('[data-testid="branch-trigger-node_modules"]')
    const content = document.querySelector('[data-testid="branch-content-node_modules"]')

    expect(branch?.getAttribute('aria-expanded')).toBe('false')
    expect(trigger?.getAttribute('data-state')).toBe('closed')
    expect(content?.hasAttribute('hidden')).toBe(true)
  })

  it('reflects controlled expandedValue through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest expandedValue={['node_modules']} />, {
      qwikLoader: true,
    })

    const branch = document.querySelector('[data-testid="branch-node_modules"]')
    const trigger = document.querySelector('[data-testid="branch-trigger-node_modules"]')
    const content = document.querySelector('[data-testid="branch-content-node_modules"]')

    expect(branch?.getAttribute('aria-expanded')).toBe('true')
    expect(trigger?.getAttribute('data-state')).toBe('open')
    expect(content?.hasAttribute('hidden')).toBe(false)
  })

  it('reflects defaultExpandedValue through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultExpandedValue={['src']} />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="branch-src"]')?.getAttribute('aria-expanded')).toBe('true')
  })

  it('reflects controlled selectedValue through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest selectedValue={['package.json']} />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="item-package.json"]')?.getAttribute('aria-selected')).toBe('true')
  })

  it('does not render collapsed branch content markup with lazyMount', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest lazyMount />, { qwikLoader: true })
    expect(document.querySelector('[data-testid="branch-content-node_modules"]')).toBeFalsy()
  })
})
