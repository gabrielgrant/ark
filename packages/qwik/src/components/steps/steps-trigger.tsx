import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useStepsContext } from './use-steps-context.ts'
import { useStepsItemPropsContext } from './use-steps-item-props-context.ts'

export interface StepsTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface StepsTriggerProps extends HTMLProps<'button'>, StepsTriggerBaseProps {}

export const StepsTrigger = component$<StepsTriggerProps>((props) => {
  const api = useStepsContext()
  const itemProps = useStepsItemPropsContext()
  const triggerProps = api ? mergeProps(api.getTriggerProps(itemProps), props) : props

  return (
    <ark.button {...triggerProps}>
      <Slot />
    </ark.button>
  )
})
