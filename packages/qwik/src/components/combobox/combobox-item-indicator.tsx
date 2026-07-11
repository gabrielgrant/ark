import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useComboboxContext } from './use-combobox-context.ts'
import { useComboboxItemPropsContext } from './use-combobox-item-props-context.ts'

export interface ComboboxItemIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface ComboboxItemIndicatorProps extends HTMLProps<'div'>, ComboboxItemIndicatorBaseProps {}

export const ComboboxItemIndicator = component$<ComboboxItemIndicatorProps>((props) => {
  const api = useComboboxContext()
  const itemProps = useComboboxItemPropsContext()
  const indicatorProps = api ? mergeProps(api.getItemIndicatorProps(itemProps), props) : props

  return (
    <ark.div {...indicatorProps}>
      <Slot />
    </ark.div>
  )
})
