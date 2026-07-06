import { createDOM } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

/**
 * Interaction tests — run in a real browser (see vitest.browser.config.ts) so
 * the Zag Qwik adapter runs client-side and the machine starts.
 */
describe('Checkbox (interaction)', () => {
  it('toggles checked when the checkbox is clicked', async () => {
    const { screen, render, userEvent } = await createDOM()
    await render(<ComponentUnderTest />)

    const control = screen.querySelector('[data-part="control"]')
    const input = screen.querySelector('input[type="checkbox"]') as HTMLInputElement
    expect(control?.getAttribute('data-state')).toBe('unchecked')

    await userEvent(input, 'click')
    expect(control?.getAttribute('data-state')).toBe('checked')

    await userEvent(input, 'click')
    expect(control?.getAttribute('data-state')).toBe('unchecked')
  })

  it('invokes onCheckedChange on toggle', async () => {
    const calls: Array<{ checked: boolean | 'indeterminate' }> = []
    const { screen, render, userEvent } = await createDOM()
    await render(<ComponentUnderTest onCheckedChange={(details) => calls.push(details)} />)

    const input = screen.querySelector('input[type="checkbox"]') as HTMLInputElement
    await userEvent(input, 'click')

    expect(calls).toEqual([{ checked: true }])
  })
})
