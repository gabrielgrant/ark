import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useNumberInputContext } from './use-number-input-context.ts'

export interface NumberInputDecrementTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface NumberInputDecrementTriggerProps
  extends HTMLProps<'button'>,
    NumberInputDecrementTriggerBaseProps {}

export const NumberInputDecrementTrigger = component$<NumberInputDecrementTriggerProps>((props) => {
  const api = useNumberInputContext()
  const triggerProps = api ? mergeProps(api.getDecrementTriggerProps(), props) : props

  return (
    <ark.button {...triggerProps}>
      <Slot />
    </ark.button>
  )
})
