import { mergeProps } from '@zag-js/qwik'
import { type JSXOutput, Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useClipboardContext } from './use-clipboard-context.ts'

export interface ClipboardIndicatorBaseProps extends PolymorphicProps<'span'> {
  copied?: JSXOutput
}
export interface ClipboardIndicatorProps extends HTMLProps<'span'>, ClipboardIndicatorBaseProps {}

/**
 * Renders a `span` (not `div`, unlike solid/react): `<Clipboard.Indicator>` is
 * typically composed inside `<Clipboard.Trigger>`, which is a `button`, and
 * Qwik's SSR enforces the phrasing-content model strictly (Q12). See
 * `ToggleIndicator` for the same fix. The projected (default-slot) content is
 * toggled via the `hidden` attribute rather than branched with `condition ?
 * <Slot/> : fallback` — an unclaimed `<Slot/>` leaves a `<q:template>` marker
 * that trips the same content-model check (R11).
 */
export const ClipboardIndicator = component$<ClipboardIndicatorProps>((props) => {
  const record = props as unknown as Record<string, unknown>
  const copiedContent = record.copied as JSXOutput | undefined

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (key !== 'copied') rest[key] = record[key]
  }

  const api = useClipboardContext()
  const indicatorProps = api ? mergeProps(api.getIndicatorProps({ copied: api.copied }), rest) : rest
  const copied = !!api?.copied

  return (
    <ark.span {...indicatorProps}>
      <span hidden={copied}>
        <Slot />
      </span>
      {copied ? copiedContent : null}
    </ark.span>
  )
})
