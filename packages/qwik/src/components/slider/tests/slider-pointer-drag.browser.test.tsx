import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

/**
 * Coverage re-enabled by the rebased adapter branch (@zag-js/qwik 1.42.0 /
 * Qwik 2.0.0-rc.4): this scenario was blocked by a documented adapter issue
 * (PLAN.md Part 5 #0 family) on the previous branch and now passes.
 *
 * Kept in its own single-test file on purpose: it must run as the page's
 * FIRST render() -- second and later containers run with Qwik rc.4's broken
 * event dispatch (see src/qwik-regressions/) which re-breaks pointer
 * semantics for reasons unrelated to the adapter.
 */
it('drags the thumb with a pointer sequence', async () => {
  const screen = await render(<ComponentUnderTest defaultValue={[50]} min={0} max={100} step={1} />)
  const root = screen.container as HTMLElement
  const thumb = root.querySelector('[data-testid="thumb-0"]') as HTMLElement

  await expect.poll(() => thumb.getAttribute('aria-valuenow')).toBe('50')

  const r = thumb.getBoundingClientRect()
  const startX = r.x + r.width / 2
  const y = r.y + r.height / 2
  const opts = { bubbles: true, pointerId: 1, isPrimary: true, button: 0, buttons: 1 }
  thumb.dispatchEvent(new PointerEvent('pointerdown', { ...opts, clientX: startX, clientY: y }))
  for (let i = 1; i <= 5; i++) {
    document.dispatchEvent(new PointerEvent('pointermove', { ...opts, clientX: startX + i * 10, clientY: y }))
    await new Promise((res) => setTimeout(res, 30))
  }
  document.dispatchEvent(new PointerEvent('pointerup', { ...opts, buttons: 0, clientX: startX + 50, clientY: y }))

  await expect
    .poll(() => Number(thumb.getAttribute('aria-valuenow')), { timeout: 3000 })
    .toBeGreaterThan(50)
})
