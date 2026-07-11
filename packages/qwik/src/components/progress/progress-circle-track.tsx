import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useProgressContext } from './use-progress-context.ts'

export interface ProgressCircleTrackBaseProps extends PolymorphicProps<'circle'> {}
export interface ProgressCircleTrackProps extends HTMLProps<'circle'>, ProgressCircleTrackBaseProps {}

export const ProgressCircleTrack = component$<ProgressCircleTrackProps>((props) => {
  const api = useProgressContext()
  const circleTrackProps = api ? mergeProps(api.getCircleTrackProps(), props) : props

  return <ark.circle {...circleTrackProps} />
})
