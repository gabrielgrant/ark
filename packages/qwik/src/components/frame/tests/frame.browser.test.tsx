import { $ } from '@qwik.dev/core'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

it('writes the srcdoc into a real, separate iframe document and fires onMount$', async () => {
  const calls: string[] = []
  const screen = await render(
    <ComponentUnderTest
      onMount$={$(() => {
        calls.push('mounted')
      })}
    />,
  )

  const frame = screen.getByTestId('frame').element() as HTMLIFrameElement

  await expect.poll(() => frame.contentDocument?.querySelector('.frame-root')).toBeTruthy()
  await expect.poll(() => calls).toEqual(['mounted'])

  // R7 caveat, verified: children render inline in the MAIN document, not
  // inside the iframe's own (separate) document.
  await expect.element(screen.getByTestId('frame-children')).toBeInTheDocument()
  expect(frame.contentDocument?.querySelector('[data-testid="frame-children"]')).toBeFalsy()

  await expect.poll(() => frame.style.getPropertyValue('--width')).not.toBe('')
})
