import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCheckboxContext } from './use-checkbox-context.ts'

export interface CheckboxControlBaseProps extends PolymorphicProps<'div'> {}
export interface CheckboxControlProps extends HTMLProps<'div'>, CheckboxControlBaseProps {}

export const CheckboxControl = component$<CheckboxControlProps>((props) => {
  const api = useCheckboxContext()
  const controlProps = api ? mergeProps(api.getControlProps(), props) : props

  return (
    <ark.div {...controlProps}>
      <Slot />
    </ark.div>
  )
})
