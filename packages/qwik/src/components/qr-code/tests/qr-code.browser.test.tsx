import { component$, useSignal } from '@qwik.dev/core'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-qwik'
import { QrCode } from '../index.ts'
import { ComponentUnderTest } from './basic.tsx'

/**
 * Interaction tests — real browser via vitest-browser-qwik (see
 * vitest.browser.config.ts). QrCode has no interactive part that itself
 * mutates the encoded value (unlike Clipboard's Input) — `onValueChange`
 * only fires from an imperative `api.setValue()` call, which the QRL
 * serialization is already covered by the headless SSR test. Here we verify
 * the rendered svg path is non-empty and reacts to a controlled `value`
 * prop change driven from outside the component.
 */
it('renders a non-empty svg path for a given value', async () => {
  const screen = await render(<ComponentUnderTest defaultValue="https://ark-ui.com" />)
  const pattern = screen.getByTestId('pattern')

  await expect.element(pattern).toBeInTheDocument()
  const d = pattern.element().getAttribute('d')
  expect(d).toBeTruthy()
  expect(d?.startsWith('M')).toBe(true)
})

const Controlled = component$(() => {
  const value = useSignal('https://ark-ui.com')
  return (
    <div>
      <button type="button" onClick$={() => (value.value = 'https://chakra-ui.com')}>
        Change value
      </button>
      <QrCode.Root value={value.value}>
        <QrCode.Frame>
          <QrCode.Pattern data-testid="pattern" />
        </QrCode.Frame>
      </QrCode.Root>
    </div>
  )
})

it('regenerates the pattern when the controlled value prop changes', async () => {
  const screen = await render(<Controlled />)
  const pattern = () => (screen.container as HTMLElement).querySelector('[data-testid="pattern"]')

  const before = pattern()?.getAttribute('d')
  expect(before).toBeTruthy()

  await screen.getByText('Change value').click()

  await expect.poll(() => pattern()?.getAttribute('d')).not.toBe(before)
})
