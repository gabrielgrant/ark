import type { JSXOutput } from '@qwik.dev/core'
import { _getDomContainer, _whenContainerDataReady } from '@qwik.dev/core/internal'
import { render } from 'vitest-browser-qwik'

/**
 * `render()` that also waits until Qwik has finished setting up the new
 * container. Until then, Qwik runs event handlers only after native
 * propagation, so `stopPropagation()`/`preventDefault()` in a handler have no
 * effect. See `src/qwik-regressions/dispatch-after-render.browser.test.tsx`.
 */
export async function renderReady(jsx: JSXOutput) {
  const screen = await render(jsx)
  await _whenContainerDataReady(_getDomContainer(screen.container as HTMLElement), () => {})
  return screen
}
