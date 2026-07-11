import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useNumberInputContext } from './use-number-input-context.ts'

export interface NumberInputControlBaseProps extends PolymorphicProps<'div'> {}
export interface NumberInputControlProps extends HTMLProps<'div'>, NumberInputControlBaseProps {}

export const NumberInputControl = component$<NumberInputControlProps>((props) => {
  const api = useNumberInputContext()
  const controlProps = api ? mergeProps(api.getControlProps(), props) : props

  return (
    <ark.div {...controlProps}>
      <Slot />
    </ark.div>
  )
})
