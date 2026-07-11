import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useProgressContext } from './use-progress-context.ts'

export interface ProgressCircleRangeBaseProps extends PolymorphicProps<'circle'> {}
export interface ProgressCircleRangeProps extends HTMLProps<'circle'>, ProgressCircleRangeBaseProps {}

export const ProgressCircleRange = component$<ProgressCircleRangeProps>((props) => {
  const api = useProgressContext()
  const circleRangeProps = api ? mergeProps(api.getCircleRangeProps(), props) : props

  return <ark.circle {...circleRangeProps} />
})
