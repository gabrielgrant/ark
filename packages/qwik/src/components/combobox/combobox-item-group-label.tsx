import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useComboboxContext } from './use-combobox-context.ts'
import { useComboboxItemGroupPropsContext } from './use-combobox-item-group-props-context.ts'

export interface ComboboxItemGroupLabelBaseProps extends PolymorphicProps<'div'> {}
export interface ComboboxItemGroupLabelProps extends HTMLProps<'div'>, ComboboxItemGroupLabelBaseProps {}

export const ComboboxItemGroupLabel = component$<ComboboxItemGroupLabelProps>((props) => {
  const api = useComboboxContext()
  const itemGroupProps = useComboboxItemGroupPropsContext()
  const labelProps = api ? mergeProps(api.getItemGroupLabelProps({ htmlFor: itemGroupProps.id }), props) : props

  return (
    <ark.div {...labelProps}>
      <Slot />
    </ark.div>
  )
})
