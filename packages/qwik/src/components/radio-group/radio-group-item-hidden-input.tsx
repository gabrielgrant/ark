import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useRadioGroupContext } from './use-radio-group-context.ts'
import { useRadioGroupItemPropsContext } from './use-radio-group-item-props-context.ts'

export interface RadioGroupItemHiddenInputBaseProps extends PolymorphicProps<'input'> {}
export interface RadioGroupItemHiddenInputProps extends HTMLProps<'input'>, RadioGroupItemHiddenInputBaseProps {}

export const RadioGroupItemHiddenInput = component$<RadioGroupItemHiddenInputProps>((props) => {
  const api = useRadioGroupContext()
  const itemProps = useRadioGroupItemPropsContext()
  const inputProps = api ? mergeProps(api.getItemHiddenInputProps(itemProps), props) : props

  return <ark.input {...inputProps} />
})
