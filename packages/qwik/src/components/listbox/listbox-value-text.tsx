import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useListboxContext } from './use-listbox-context.ts'

export interface ListboxValueTextBaseProps extends PolymorphicProps<'span'> {
  /**
   * Text to display when no value is selected.
   */
  placeholder?: string
}
export interface ListboxValueTextProps extends HTMLProps<'span'>, ListboxValueTextBaseProps {}

export const ListboxValueText = component$<ListboxValueTextProps>((props) => {
  const { placeholder, ...localProps } = props as ListboxValueTextProps
  const api = useListboxContext()
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
