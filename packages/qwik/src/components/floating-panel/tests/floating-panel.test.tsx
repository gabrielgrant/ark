import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('FloatingPanel', () => {
  it('renders closed by default with content hidden', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const trigger = document.querySelector('[data-part="trigger"]')
    const content = document.querySelector('[data-testid="content"]')

    expect(trigger?.textContent).toBe('Toggle Panel')
    expect(trigger?.getAttribute('data-state')).toBe('closed')
    expect(content?.hasAttribute('hidden')).toBe(true)
  })

  it('renders all parts with dialog semantics when open', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest open />, { qwikLoader: true })

    const content = document.querySelector('[data-testid="content"]')

    expect(content?.getAttribute('role')).toBe('dialog')
    expect(content?.hasAttribute('hidden')).toBe(false)
    expect(content?.getAttribute('data-state')).toBe('open')
    expect(document.querySelector('[data-part="positioner"]')).toBeTruthy()
    expect(document.querySelector('[data-part="header"]')).toBeTruthy()
    expect(document.querySelector('[data-part="body"]')).toBeTruthy()
    expect(document.querySelector('[data-part="title"]')).toBeTruthy()
    expect(document.querySelector('[data-part="control"]')).toBeTruthy()
    expect(document.querySelector('[data-part="drag-trigger"]')).toBeTruthy()
    expect(document.querySelector('[data-part="resize-trigger"][data-axis="e"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="stage-min"]')).toBeTruthy()
    expect(document.querySelector('[data-part="close-trigger"]')).toBeTruthy()
  })

  it('does not render content with lazyMount until opened', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest lazyMount />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="content"]')).toBeFalsy()
    expect(document.querySelector('[data-testid="positioner"]')).toBeFalsy()
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest onOpenChange$={$(() => {})} onStageChange$={$(() => {})} />,
      { qwikLoader: true },
    )
    expect(document.querySelector('[data-part="trigger"]')).toBeTruthy()
  })
})
