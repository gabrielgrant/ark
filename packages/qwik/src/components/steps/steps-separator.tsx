import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useStepsContext } from './use-steps-context.ts'
import { useStepsItemPropsContext } from './use-steps-item-props-context.ts'

export interface StepsSeparatorBaseProps extends PolymorphicProps<'div'> {}
export interface StepsSeparatorProps extends HTMLProps<'div'>, StepsSeparatorBaseProps {}

export const StepsSeparator = component$<StepsSeparatorProps>((props) => {
  const api = useStepsContext()
  const itemProps = useStepsItemPropsContext()
  const separatorProps = api ? mergeProps(api.getSeparatorProps(itemProps), props) : props

  return (
    <ark.div {...separatorProps}>
      <Slot />
    </ark.div>
  )
})
