import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

/**
 * Verifies the client-only clone-mirroring workaround (see the doc comment
 * on `MarqueeContent`): the presentation-only clone wrapper (data-index="1")
 * should pick up a DOM copy of the real content's items after mount, even
 * though only the real wrapper (data-index="0") ever claims the actual
 * `<Slot/>` projection.
 */
it('mirrors projected items into the presentation clone wrapper', async () => {
  const screen = await render(<ComponentUnderTest />)
  const root = screen.container as HTMLElement

  const wrappers = () => root.querySelectorAll('[data-testid="content"]')

  await expect.poll(() => wrappers().length).toBe(2)
  await expect.poll(() => wrappers()[0]?.querySelector('[data-testid="item-0"]')).toBeTruthy()

  const clone = () => wrappers()[1]
  await expect.poll(() => clone()?.querySelectorAll('[data-part="item"]').length).toBe(2)
  await expect.poll(() => clone()?.textContent).toBe('OneTwo')
})
