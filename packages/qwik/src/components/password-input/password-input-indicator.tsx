import { mergeProps } from '@zag-js/qwik'
import { type JSXOutput, Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePasswordInputContext } from './use-password-input-context.ts'

export interface PasswordInputIndicatorBaseProps extends PolymorphicProps<'span'> {
  /**
   * The fallback content to display when the password is not visible.
   */
  fallback?: JSXOutput
}
export interface PasswordInputIndicatorProps extends HTMLProps<'span'>, PasswordInputIndicatorBaseProps {}

/**
 * Renders a `span` (not `div`, unlike solid/react): `<PasswordInput.Indicator>`
 * is typically composed inside `<PasswordInput.VisibilityTrigger>`, which is a
 * `button`, and Qwik's SSR enforces the phrasing-content model strictly (Q12).
 * The projected (default-slot) content is toggled via the `hidden` attribute
 * rather than branched with `condition ? <Slot/> : fallback` -- an unclaimed
 * `<Slot/>` leaves a `<q:template>` marker that trips the same content-model
 * check (R11). See `ClipboardIndicator` for the same fix.
 */
export const PasswordInputIndicator = component$<PasswordInputIndicatorProps>((props) => {
  const record = props as unknown as Record<string, unknown>
  const fallback = record.fallback as JSXOutput | undefined

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (key !== 'fallback') rest[key] = record[key]
  }

  const api = usePasswordInputContext()
  const indicatorProps = api ? mergeProps(api.getIndicatorProps(), rest) : rest
  const visible = !!api?.visible

  return (
    <ark.span {...indicatorProps}>
      <span hidden={!visible}>
        <Slot />
      </span>
      {!visible ? fallback : null}
    </ark.span>
  )
})
