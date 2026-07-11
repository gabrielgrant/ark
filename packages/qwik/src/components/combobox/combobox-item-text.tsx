import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useComboboxContext } from './use-combobox-context.ts'
import { useComboboxItemPropsContext } from './use-combobox-item-props-context.ts'

export interface ComboboxItemTextBaseProps extends PolymorphicProps<'span'> {}
export interface ComboboxItemTextProps extends HTMLProps<'span'>, ComboboxItemTextBaseProps {}

export const ComboboxItemText = component$<ComboboxItemTextProps>((props) => {
  const api = useComboboxContext()
  const itemProps = useComboboxItemPropsContext()
  const textProps = api ? mergeProps(api.getItemTextProps(itemProps), props) : props

  return (
    <ark.span {...textProps}>
      <Slot />
    </ark.span>
  )
})
