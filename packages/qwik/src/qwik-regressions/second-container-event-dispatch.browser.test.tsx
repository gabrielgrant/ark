import { component$ } from '@qwik.dev/core'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'

declare global {
  interface Window {
    __events: string[]
  }
}

/**
 * Qwik core regression, 2.0.0-beta.36 -> 2.0.0-rc.4 (no zag involved).
 *
 * The SECOND (and every later) client container rendered into one document
 * loses synchronous event dispatch: handlers run asynchronously AFTER the
 * native event has finished propagating, so `event.stopPropagation()` inside
 * a child handler can no longer stop an ancestor's handler from running,
 * and conditional `preventDefault` cannot work either.
 *
 * Verified empirically on this exact fixture (handlers are plain functions
 * spread at runtime, the shape zag's `normalizeProps` emits on the client;
 * `_qDispatch` wiring is identical on both renders):
 * - first `render()` of a page: dispatch is synchronous during the capture
 *   phase; log is `["child-handler"]` (stopPropagation contains the click;
 *   a native bubble listener on the parent never fires).
 * - second `render()`: the native event fully propagates first (parent's
 *   native listener fires), THEN child-handler and parent-handler both run —
 *   `["parent-native-bubble","child-handler","parent-handler"]`.
 * - swapping only `@qwik.dev/core` back to 2.0.0-beta.36 makes BOTH renders
 *   behave correctly, so this is core's regression, not the zag adapter's
 *   and not vitest-browser-qwik's (its `render` just renders into a fresh
 *   div per test; only the page is shared across one file's tests).
 *
 * Real pages render one container, so apps are unaffected; every
 * multi-`render()` page (this browser test harness, micro-frontends) is.
 * Downstream casualty in this suite: tree-view's third test (branch trigger
 * clicks double-toggle because the trigger's stopPropagation no longer
 * shields the branch-control handler) — skipped with a pointer here.
 *
 * Un-skip when a Qwik release makes this pass; then also un-skip the
 * tree-view test.
 */
const parentProps = {
  'data-testid': 'parent',
  onClick$: () => window.__events.push('parent-handler'),
}
const childProps = {
  'data-testid': 'child',
  onClick$: (event: Event) => {
    window.__events.push('child-handler')
    event.stopPropagation()
  },
}

const Fixture = component$(() => (
  <div {...parentProps}>
    <button type="button" {...childProps}>
      hit
    </button>
  </div>
))

async function probe() {
  window.__events = []
  const screen = await render(<Fixture />)
  const child = screen.container.querySelector('[data-testid="child"]') as HTMLElement
  const parent = screen.container.querySelector('[data-testid="parent"]') as HTMLElement
  parent.addEventListener('click', () => window.__events.push('parent-native-bubble'))
  child.click()
  await new Promise((r) => setTimeout(r, 400))
  return JSON.stringify(window.__events)
}

it('render 1: stopPropagation contains the click', async () => {
  expect(await probe()).toBe('["child-handler"]')
})

// fails on @qwik.dev/core 2.0.0-rc.4: see the header comment
it.skip('render 2: stopPropagation still contains the click', async () => {
  expect(await probe()).toBe('["child-handler"]')
})
