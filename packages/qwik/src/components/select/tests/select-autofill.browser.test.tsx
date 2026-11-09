import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

/**
 * Browser autofill writes into the hidden native `<select>` and fires a
 * native `change` event (never `input`). The adapter maps zag's `onChange`
 * to Qwik's native change event for parts that also handle `onInput`
 * (adapter normalize-props), so the machine must pick the value up.
 */
it('updates the select when autofill fires change on the hidden select', async () => {
  const screen = await render(<ComponentUnderTest />)
  const root = screen.container as HTMLElement

  const hidden = root.querySelector('[data-testid="hidden-select"]') as HTMLSelectElement
  expect(hidden).toBeTruthy()

  // simulate autofill: set the value, then fire a native change
  hidden.value = 'vue'
  hidden.dispatchEvent(new Event('change', { bubbles: true }))

  await expect.poll(() => root.querySelector('[data-testid="value-text"]')?.textContent).toBe('Vue')
  await expect
    .poll(() => root.querySelector('[data-testid="item-vue"]')?.getAttribute('data-state'))
    .toBe('checked')
})
