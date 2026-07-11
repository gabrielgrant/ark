import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePopoverContext } from './use-popover-context.ts'

export interface PopoverIndicatorBaseProps extends PolymorphicProps<'span'> {}
export interface PopoverIndicatorProps extends HTMLProps<'span'>, PopoverIndicatorBaseProps {}

/**
 * Rendered as `<span>`, not `<div>` (unlike solid/react): this part is
 * typically nested inside `<Popover.Trigger>` (a `<button>`), and Qwik's SSR
 * enforces HTML content models strictly (error Q12) — a `<div>` is not
 * permitted inside button phrasing content (R11).
 */
export const PopoverIndicator = component$<PopoverIndicatorProps>((props) => {
  const api = usePopoverContext()
  const indicatorProps = api ? mergeProps(api.getIndicatorProps(), props) : props

  return (
    <ark.span {...indicatorProps}>
      <Slot />
    </ark.span>
  )
})
