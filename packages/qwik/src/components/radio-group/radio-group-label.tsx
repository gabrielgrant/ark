import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useRadioGroupContext } from './use-radio-group-context.ts'

export interface RadioGroupLabelBaseProps extends PolymorphicProps<'span'> {}
export interface RadioGroupLabelProps extends HTMLProps<'span'>, RadioGroupLabelBaseProps {}

export const RadioGroupLabel = component$<RadioGroupLabelProps>((props) => {
  const api = useRadioGroupContext()
  const labelProps = api ? mergeProps(api.getLabelProps(), props) : props

  return (
    <ark.span {...labelProps}>
      <Slot />
    </ark.span>
  )
})
