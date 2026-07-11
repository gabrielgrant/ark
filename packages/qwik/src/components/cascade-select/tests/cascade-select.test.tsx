import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('CascadeSelect', () => {
  it('renders closed by default with content hidden', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const trigger = document.querySelector('[data-testid="trigger"]')
    const content = document.querySelector('[data-testid="content"]')

    expect(trigger?.getAttribute('aria-expanded')).toBe('false')
    expect(content?.hasAttribute('hidden')).toBe(true)
  })

  it('renders the root-level list items', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest open />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="item-asia"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="item-europe"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="chevron-asia"]')).toBeTruthy()
  })

  it('renders the value text placeholder when empty', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })
    expect(document.querySelector('[data-testid="value-text"]')?.textContent).toBe('Select a location')
  })

  /**
   * `valueAsString` (and thus `ValueText`'s text) is derived from the
   * `selectedItems` context field, which the machine only populates via the
   * `watch`/`track()`-driven `syncInputValue` action (fired on a `value`
   * CHANGE) or the `ITEM.SELECT` event's `selectItem` action -- NOT
   * synchronously from the initial `value`/`defaultValue` props (`track()`'s
   * first invocation for a slot is documented as "initialize only", so it
   * never fires on the first render, headless or client). This is a
   * characteristic of the cascade-select machine itself (no react/solid port
   * exists to cross-check), not a Qwik-port gap -- so `ValueText` legitimately
   * stays empty here. `aria-selected`/`data-selected` on the item itself,
   * read directly from `context.get('value')` inside `getItemState`, DOES
   * reflect the controlled/default value synchronously; verified below and
   * covered end-to-end (post-interaction `ValueText`) in the browser test.
   */
  it('reflects controlled value through SSR on the selected item', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest open value={[['asia', 'india']]} highlightedValue={['asia']} />,
      { qwikLoader: true },
    )
    expect(document.querySelector('[data-testid="item-india"]')?.getAttribute('data-state')).toBe('checked')
    expect(document.querySelector('[data-testid="item-india"]')?.getAttribute('data-selected')).toBe('')
  })

  it('reflects defaultValue through SSR on the selected item', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest open defaultValue={[['europe', 'france']]} highlightedValue={['europe']} />,
      { qwikLoader: true },
    )
    expect(document.querySelector('[data-testid="item-france"]')?.getAttribute('data-selected')).toBe('')
  })

  it('reflects controlled highlightedValue by showing the second-level list', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest open highlightedValue={['asia']} />, {
      qwikLoader: true,
    })
    expect(document.querySelector('[data-testid="item-india"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="item-japan"]')).toBeTruthy()
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest onValueChange$={$(() => {})} />, {
      qwikLoader: true,
    })
    expect(document.querySelector('[data-testid="trigger"]')).toBeTruthy()
  })

  it('supports controlled open', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest open={false} />, { qwikLoader: true })
    expect(document.querySelector('[data-testid="content"]')?.hasAttribute('hidden')).toBe(true)
  })
})
