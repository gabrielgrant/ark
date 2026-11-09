import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { ComponentUnderTest } from './basic.tsx'

/**
 * RE-ENABLED on the rebased adapter branch (@zag-js/qwik 1.42.0 / Qwik
 * 2.0.0-rc.4): the former livelock -- any child subscribing to Root's
 * context store spun the tab at 100% CPU (tour's `trackBoundarySize` root
 * effect feeding the old `installRafRenderGate`) -- no longer reproduces;
 * the full start -> advance -> close flow passes in ~0.5s.
 *
 * Two fixture requirements discovered while re-enabling (see basic.tsx):
 * the backdrop must precede the positioner in DOM order, and the dialog
 * content needs the consumer CSS stacking/centering zag ships in its shared
 * tour.css -- without it the fixed backdrop paints above the content and
 * intercepts every pointer click in a real browser.
 */it('starts the tour, advances via action trigger, and closes', async () => {
  const contentState = (screen: { container: Element }) =>
    (screen.container as HTMLElement).querySelector('[data-testid="content"]')?.getAttribute('data-state')
  const text = (screen: { container: Element }, testId: string) =>
    (screen.container as HTMLElement).querySelector(`[data-testid="${testId}"]`)?.textContent

  const screen = await render(<ComponentUnderTest />)

  await screen.getByTestId('start-tour').click()
  await expect.poll(() => contentState(screen)).toBe('open')
  expect(text(screen, 'title')).toBe('Welcome')
  expect(text(screen, 'description')).toBe('This is the first step of the tour.')

  await screen.getByTestId('next').click()
  await expect.poll(() => text(screen, 'title')).toBe('Second step')

  await screen.getByTestId('close').click()
  await expect.poll(() => contentState(screen)).toBe('closed')
})
