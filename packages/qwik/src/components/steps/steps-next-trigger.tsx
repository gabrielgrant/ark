import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useStepsContext } from './use-steps-context.ts'

export interface StepsNextTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface StepsNextTriggerProps extends HTMLProps<'button'>, StepsNextTriggerBaseProps {}

export const StepsNextTrigger = component$<StepsNextTriggerProps>((props) => {
  const api = useStepsContext()
  const nextTriggerProps = api ? mergeProps(api.getNextTriggerProps(), props) : props

  return (
    <ark.button {...nextTriggerProps}>
      <Slot />
    </ark.button>
  )
})
