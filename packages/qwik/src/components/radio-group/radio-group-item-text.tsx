import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useRadioGroupContext } from './use-radio-group-context.ts'
import { useRadioGroupItemPropsContext } from './use-radio-group-item-props-context.ts'

export interface RadioGroupItemTextBaseProps extends PolymorphicProps<'span'> {}
export interface RadioGroupItemTextProps extends HTMLProps<'span'>, RadioGroupItemTextBaseProps {}

export const RadioGroupItemText = component$<RadioGroupItemTextProps>((props) => {
  const api = useRadioGroupContext()
  const itemProps = useRadioGroupItemPropsContext()
  const textProps = api ? mergeProps(api.getItemTextProps(itemProps), props) : props

  return (
    <ark.span {...textProps}>
      <Slot />
    </ark.span>
  )
})
