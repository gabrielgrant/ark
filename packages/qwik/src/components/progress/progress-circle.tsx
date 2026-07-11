import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useProgressContext } from './use-progress-context.ts'

export interface ProgressCircleBaseProps extends PolymorphicProps<'svg'> {}
export interface ProgressCircleProps extends HTMLProps<'svg'>, ProgressCircleBaseProps {}

export const ProgressCircle = component$<ProgressCircleProps>((props) => {
  const api = useProgressContext()
  const circleProps = api ? mergeProps(api.getCircleProps(), props) : props

  return (
    <ark.svg {...circleProps}>
      <Slot />
    </ark.svg>
  )
})
