import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useNumberInputContext } from './use-number-input-context.ts'

export interface NumberInputIncrementTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface NumberInputIncrementTriggerProps
  extends HTMLProps<'button'>,
    NumberInputIncrementTriggerBaseProps {}

export const NumberInputIncrementTrigger = component$<NumberInputIncrementTriggerProps>((props) => {
  const api = useNumberInputContext()
  const triggerProps = api ? mergeProps(api.getIncrementTriggerProps(), props) : props

  return (
    <ark.button {...triggerProps}>
      <Slot />
    </ark.button>
  )
})
