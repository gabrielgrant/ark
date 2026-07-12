import type { StepAction } from '@zag-js/tour'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTourContext } from './use-tour-context.ts'

export interface TourActionTriggerBaseProps extends PolymorphicProps<'button'> {
  action: StepAction
}
export interface TourActionTriggerProps extends Assign<HTMLProps<'button'>, TourActionTriggerBaseProps> {}

export const TourActionTrigger = component$<TourActionTriggerProps>((props) => {
  const { action, ...localProps } = props
  const api = useTourContext()

  const rest = localProps as unknown as Record<string, unknown>
  const actionTriggerProps = api ? mergeProps(api.getActionTriggerProps({ action }), rest) : rest

  return (
    <ark.button {...actionTriggerProps}>
      {!props.children && action.label}
      <Slot />
    </ark.button>
  )
})
