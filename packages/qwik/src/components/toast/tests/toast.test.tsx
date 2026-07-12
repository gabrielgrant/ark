import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { createToaster } from '../create-toaster.ts'
import { ToastTitle } from '../toast-title.tsx'
import { Toaster } from '../toaster.tsx'

/**
 * SSR/headless coverage is necessarily limited (PLAN.md R5): the adapter
 * never starts a machine outside a real browser, and toasts are normally
 * created imperatively from client event handlers — so a server render
 * always shows an empty toast group. These tests cover the (empty) group
 * markup and confirm the non-serializable `toaster`/`renderToast` props
 * survive SSR without crashing (the R15 `noSerialize`-tagging in
 * `toaster.tsx`). Real toast-lifecycle behavior is covered by
 * `toast.browser.test.tsx`.
 */
describe('Toaster', () => {
  it('renders the empty toast region with the default placement', async () => {
    const toaster = createToaster({ placement: 'top-end' })
    const { document } = await ssrRenderToDom(
      <Toaster
        toaster={toaster}
        renderToast={(toast) => (
          <div data-testid="toast">
            <ToastTitle>{toast.title}</ToastTitle>
          </div>
        )}
      />,
      { qwikLoader: true },
    )

    const region = document.querySelector('[role="region"]')
    expect(region).toBeTruthy()
    expect(region?.getAttribute('data-placement')).toBe('top-end')
    expect(document.querySelector('[data-testid="toast"]')).toBeFalsy()
  })

  it('does not crash when the toaster already has a pending toast before render', async () => {
    const toaster = createToaster({ placement: 'bottom' })
    toaster.create({ title: 'Hello' })

    const { document } = await ssrRenderToDom(
      <Toaster toaster={toaster} renderToast={(toast) => <div data-testid="toast">{toast.title}</div>} />,
      { qwikLoader: true },
    )

    expect(document.querySelector('[role="region"]')).toBeTruthy()
  })
})
