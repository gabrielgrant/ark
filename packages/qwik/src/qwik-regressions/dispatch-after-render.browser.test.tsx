import { component$ } from '@qwik.dev/core'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { renderReady } from '../tests/render-ready.ts'

declare global {
  interface Window {
    __events: string[]
  }
}

/**
 * Qwik core regression since 2.0.0-beta.38 (beta.37 and earlier are correct;
 * still present in rc.4 and rc.5). No zag involved.
 *
 * Right after `render()` resolves, Qwik has not finished setting up the new
 * container: the vnode-data walk runs in later macrotasks, and while it is
 * pending `runEventHandlerQRL` waits on `whenContainerDataReady` and returns a
 * promise. qwikloader queues that promise and lets the native event keep
 * propagating, so handlers run only after propagation has finished:
 * `stopPropagation()` in a child handler cannot shield an ancestor's handler
 * and `preventDefault()` comes too late. The readiness flag is document-wide,
 * so mounting a new container also affects containers that were already
 * settled, until the new one is ready.
 *
 * This is about timing, not about being the second container: the first
 * `render()` of a file usually passes only because it has to load the
 * component's code, which gives the setup time to finish. Later renders reuse
 * loaded code and resolve before the setup is done.
 *
 * Upstream repro: https://github.com/gabrielgrant/qwik-repro-dispatch-after-render
 *
 * Tests that depend on synchronous dispatch should use `renderReady()`
 * (`src/tests/render-ready.ts`), which waits for the container to be ready.
 * Un-skip the raw-render test when a Qwik release makes it pass.
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

async function probe(mount: typeof render) {
  window.__events = []
  const screen = await mount(<Fixture />)
  const child = screen.container.querySelector('[data-testid="child"]') as HTMLElement
  const parent = screen.container.querySelector('[data-testid="parent"]') as HTMLElement
  parent.addEventListener('click', () => window.__events.push('parent-native-bubble'))
  child.click()
  await new Promise((r) => setTimeout(r, 400))
  return JSON.stringify(window.__events)
}

it('first render: stopPropagation contains the click', async () => {
  expect(await probe(render)).toBe('["child-handler"]')
})

it('later render, after the container is ready: stopPropagation contains the click', async () => {
  expect(await probe(renderReady)).toBe('["child-handler"]')
})

// fails on @qwik.dev/core 2.0.0-beta.38 through rc.5: see the header comment
it.skip('later render, clicked as soon as render() resolves: stopPropagation contains the click', async () => {
  expect(await probe(render)).toBe('["child-handler"]')
})
