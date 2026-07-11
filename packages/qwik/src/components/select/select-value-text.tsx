import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSelectContext } from './use-select-context.ts'

export interface SelectValueTextBaseProps extends PolymorphicProps<'span'> {
  /**
   * Text to display when no value is selected.
   */
  placeholder?: string
}
export interface SelectValueTextProps extends HTMLProps<'span'>, SelectValueTextBaseProps {}

export const SelectValueText = component$<SelectValueTextProps>((props) => {
  const { placeholder, ...localProps } = props as SelectValueTextProps
  const api = useSelectContext()
  const valueTextProps = api ? mergeProps(api.getValueTextProps(), localProps) : localProps

  // rule R13: render the derived value as a sibling expression next to an
  // always-claimed empty Slot, not as a Slot fallback (which goes stale — the
  // value reads a noSerialize store, see PLAN.md).
  return (
    <ark.span {...valueTextProps}>
      {api?.valueAsString || placeholder}
      <Slot />
    </ark.span>
  )
})
