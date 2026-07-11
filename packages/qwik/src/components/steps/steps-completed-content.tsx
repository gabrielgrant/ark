import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useStepsContext } from './use-steps-context.ts'

export interface StepsCompletedContentBaseProps extends PolymorphicProps<'div'> {}
export interface StepsCompletedContentProps extends HTMLProps<'div'>, StepsCompletedContentBaseProps {}

export const StepsCompletedContent = component$<StepsCompletedContentProps>((props) => {
  const api = useStepsContext()
  const completedContentProps = api ? mergeProps(api.getContentProps({ index: api.count }), props) : props

  return (
    <ark.div {...completedContentProps}>
      <Slot />
    </ark.div>
  )
})
