import { render } from '@qwik.dev/core'
import { userEvent } from '@vitest/browser/context'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

/**
 * Interaction tests — the intended real-browser harness (see
 * vitest.browser.config.ts). SKIPPED for now: Qwik 2 has no working test render
 * that wires its event system in this setup — `@qwik.dev/core/testing` is
 * node/domino-only (and node forces `isServer=true`, so the machine never
 * starts), and standalone `render()` in vitest browser mode does not establish
 * Qwik's event delegation (verified: even a plain `onClick$` button doesn't
 * fire). Enable once `qwik-testing-library` supports Qwik 2 (in progress). The
 * component itself renders + shares context correctly (see checkbox.test.tsx).
 */
describe.skip('Checkbox (interaction)', () => {
  const mount = async (jsx: Parameters<typeof render>[1]) => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    await render(host, jsx)
    return host
  }

  it('toggles checked when the checkbox is clicked', async () => {
    const host = await mount(<ComponentUnderTest />)
    const control = () => host.querySelector('[data-part="control"]') as HTMLElement
    // the label span has visible text; clicking it (inside the <label for=input>)
    // toggles the visually-hidden input natively
    const label = host.querySelector('[data-part="label"]') as HTMLElement
    expect(control()?.getAttribute('data-state')).toBe('unchecked')

    await userEvent.click(label)
    await expect.poll(() => control()?.getAttribute('data-state')).toBe('checked')

    await userEvent.click(label)
    await expect.poll(() => control()?.getAttribute('data-state')).toBe('unchecked')
  })

  it('invokes onCheckedChange on toggle', async () => {
    const calls: Array<{ checked: boolean | 'indeterminate' }> = []
    const host = await mount(<ComponentUnderTest onCheckedChange={(d) => calls.push(d)} />)
    const label = host.querySelector('[data-part="label"]') as HTMLElement

    await userEvent.click(label)
    await expect.poll(() => calls.length).toBe(1)
    expect(calls[0]).toEqual({ checked: true })
  })
})
