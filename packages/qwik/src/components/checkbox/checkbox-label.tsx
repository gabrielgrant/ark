import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCheckboxContext } from './use-checkbox-context.ts'

export interface CheckboxLabelBaseProps extends PolymorphicProps<'span'> {}
export interface CheckboxLabelProps extends HTMLProps<'span'>, CheckboxLabelBaseProps {}

export const CheckboxLabel = component$<CheckboxLabelProps>((props) => {
  const api = useCheckboxContext()
  const labelProps = api ? mergeProps(api.getLabelProps(), props) : props

  return (
    <ark.span {...labelProps}>
      <Slot />
    </ark.span>
  )
})
