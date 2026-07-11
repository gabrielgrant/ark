import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useRadioGroupContext } from './use-radio-group-context.ts'
import { useRadioGroupItemPropsContext } from './use-radio-group-item-props-context.ts'

export interface RadioGroupItemControlBaseProps extends PolymorphicProps<'div'> {}
export interface RadioGroupItemControlProps extends HTMLProps<'div'>, RadioGroupItemControlBaseProps {}

export const RadioGroupItemControl = component$<RadioGroupItemControlProps>((props) => {
  const api = useRadioGroupContext()
  const itemProps = useRadioGroupItemPropsContext()
  const controlProps = api ? mergeProps(api.getItemControlProps(itemProps), props) : props

  return (
    <ark.div {...controlProps}>
      <Slot />
    </ark.div>
  )
})
