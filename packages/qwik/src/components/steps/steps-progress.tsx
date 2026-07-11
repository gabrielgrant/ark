import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useStepsContext } from './use-steps-context.ts'

export interface StepsProgressBaseProps extends PolymorphicProps<'div'> {}
export interface StepsProgressProps extends HTMLProps<'div'>, StepsProgressBaseProps {}

export const StepsProgress = component$<StepsProgressProps>((props) => {
  const api = useStepsContext()
  const progressProps = api ? mergeProps(api.getProgressProps(), props) : props

  return (
    <ark.div {...progressProps}>
      <Slot />
    </ark.div>
  )
})
