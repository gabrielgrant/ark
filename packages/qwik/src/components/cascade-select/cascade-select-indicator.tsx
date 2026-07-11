import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCascadeSelectContext } from './use-cascade-select-context.ts'

export interface CascadeSelectIndicatorBaseProps extends PolymorphicProps<'span'> {}
export interface CascadeSelectIndicatorProps extends HTMLProps<'span'>, CascadeSelectIndicatorBaseProps {}

/**
 * Rendered as `<span>`: nested inside `<CascadeSelect.Trigger>` (a
 * `<button>`); Qwik's SSR enforces HTML content models strictly (R11).
 */
export const CascadeSelectIndicator = component$<CascadeSelectIndicatorProps>((props) => {
  const api = useCascadeSelectContext()
  const indicatorProps = api ? mergeProps(api.getIndicatorProps(), props) : props

  return (
    <ark.span {...indicatorProps}>
      <Slot />
    </ark.span>
  )
})
