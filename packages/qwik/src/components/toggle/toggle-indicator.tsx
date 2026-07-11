import { mergeProps } from '@zag-js/qwik'
import { type JSXOutput, Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useToggleContext } from './use-toggle-context.ts'

export interface ToggleIndicatorBaseProps extends PolymorphicProps<'span'> {
  fallback?: JSXOutput
}
export interface ToggleIndicatorProps extends HTMLProps<'span'>, ToggleIndicatorBaseProps {}

/**
 * Renders a `span` (not `div`, unlike solid/react): `<Toggle.Indicator>` is
 * typically composed directly inside `<Toggle.Root>`, which is a `button`.
 * `button`'s content model is phrasing content only, and Qwik's SSR enforces
 * this strictly (throws `Q12` for a `div` descendant) where jsdom/browsers do
 * not. A `span` keeps the common composition valid without changing the API
 * shape.
 *
 * The projected (default-slot) content is toggled via the `hidden` attribute
 * rather than omitted from the tree with `condition ? <Slot/> : fallback`:
 * Qwik emits a `<q:template>` marker for unclaimed projection wherever a
 * `<Slot/>` is conditionally left out of the render, and that marker hits the
 * same `button`-content-model SSR error. Always rendering (and claiming) the
 * `<Slot/>`, then hiding it, avoids the marker entirely.
 */
export const ToggleIndicator = component$<ToggleIndicatorProps>((props) => {
  const record = props as unknown as Record<string, unknown>
  const fallback = record.fallback as JSXOutput | undefined

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (key !== 'fallback') rest[key] = record[key]
  }

  const api = useToggleContext()
  const indicatorProps = api ? mergeProps(api.getIndicatorProps(), rest) : rest
  const pressed = !!api?.pressed

  return (
    <ark.span {...indicatorProps}>
      <span hidden={!pressed}>
        <Slot />
      </span>
      {pressed ? null : fallback}
    </ark.span>
  )
})
