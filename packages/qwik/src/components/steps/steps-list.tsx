import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useStepsContext } from './use-steps-context.ts'

export interface StepsListBaseProps extends PolymorphicProps<'div'> {}
export interface StepsListProps extends HTMLProps<'div'>, StepsListBaseProps {}

export const StepsList = component$<StepsListProps>((props) => {
  const api = useStepsContext()
  const listProps = api ? mergeProps(api.getListProps(), props) : props

  return (
    <ark.div {...listProps}>
      <Slot />
    </ark.div>
  )
})
