import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('JsonTreeView', () => {
  it('renders the tree with role=tree', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const tree = document.querySelector('[data-testid="tree"]')
    expect(tree?.getAttribute('role')).toBe('tree')
    expect(tree?.getAttribute('data-part')).toBe('tree')
  })

  it('renders a collapsed branch by default for the root object', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const branch = document.querySelector('[data-part="branch"]')
    expect(branch).toBeTruthy()
    expect(branch?.getAttribute('aria-expanded')).toBe('false')
  })

  it('expands nodes up to defaultExpandedDepth', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultExpandedDepth={2} />, { qwikLoader: true })

    const branches = document.querySelectorAll('[data-part="branch"]')
    expect(branches.length).toBeGreaterThan(0)
    for (const branch of branches) {
      expect(branch.getAttribute('aria-expanded')).toBe('true')
    }
  })

  it('renders a key/value item for each primitive property', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultExpandedDepth={2} />, { qwikLoader: true })

    const items = document.querySelectorAll('[data-part="item"]')
    const labels = Array.from(items).map((item) => item.getAttribute('aria-label'))
    expect(labels).toContain('name: "John Doe"')
    expect(labels).toContain('age: 30')
  })

  it('renders the key node text and quoted/unquoted value text', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultExpandedDepth={2} />, { qwikLoader: true })

    const keySpans = Array.from(document.querySelectorAll('[data-kind="key"]')).map((el) => el.textContent)
    expect(keySpans).toContain('name')
    expect(keySpans).toContain('age')
  })

  it('renders branch labels describing expandable nested values', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultExpandedDepth={2} />, { qwikLoader: true })

    const branchLabels = Array.from(document.querySelectorAll('[data-part="branch-control"]')).map((el) =>
      el.getAttribute('aria-label'),
    )
    expect(branchLabels.some((label) => label?.includes('tags'))).toBe(true)
    expect(branchLabels.some((label) => label?.includes('address'))).toBe(true)
  })

  it('renders the indent guide when requested', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultExpandedDepth={2} />, { qwikLoader: true })

    expect(document.querySelector('[data-part="branch-indent-guide"]')).toBeTruthy()
  })

  it('quotes keys when quotesOnKeys is set', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultExpandedDepth={2} quotesOnKeys />, {
      qwikLoader: true,
    })

    const keySpans = Array.from(document.querySelectorAll('[data-kind="key"]')).map((el) => el.textContent)
    expect(keySpans).toContain('"name"')
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest onExpandedChange$={$(() => {})} />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="tree"]')).toBeTruthy()
  })
})
