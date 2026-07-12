import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useTourContext } from './use-tour-context.ts'

export interface TourCloseTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface TourCloseTriggerProps extends HTMLProps<'button'>, TourCloseTriggerBaseProps {}

export const TourCloseTrigger = component$<TourCloseTriggerProps>((props) => {
  const api = useTourContext()
  const closeTriggerProps = api ? mergeProps(api.getCloseTriggerProps(), props) : props

  return (
    <ark.button {...closeTriggerProps}>
      <Slot />
    </ark.button>
  )
})
