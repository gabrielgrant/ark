import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useStepsContext } from './use-steps-context.ts'

export interface StepsPrevTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface StepsPrevTriggerProps extends HTMLProps<'button'>, StepsPrevTriggerBaseProps {}

export const StepsPrevTrigger = component$<StepsPrevTriggerProps>((props) => {
  const api = useStepsContext()
  const prevTriggerProps = api ? mergeProps(api.getPrevTriggerProps(), props) : props

  return (
    <ark.button {...prevTriggerProps}>
      <Slot />
    </ark.button>
  )
})
