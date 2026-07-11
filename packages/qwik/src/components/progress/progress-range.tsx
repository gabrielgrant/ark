import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useProgressContext } from './use-progress-context.ts'

export interface ProgressRangeBaseProps extends PolymorphicProps<'div'> {}
export interface ProgressRangeProps extends HTMLProps<'div'>, ProgressRangeBaseProps {}

export const ProgressRange = component$<ProgressRangeProps>((props) => {
  const api = useProgressContext()
  const rangeProps = api ? mergeProps(api.getRangeProps(), props) : props

  return (
    <ark.div {...rangeProps}>
      <Slot />
    </ark.div>
  )
})
