import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useProgressContext } from './use-progress-context.ts'

export interface ProgressTrackBaseProps extends PolymorphicProps<'div'> {}
export interface ProgressTrackProps extends HTMLProps<'div'>, ProgressTrackBaseProps {}

export const ProgressTrack = component$<ProgressTrackProps>((props) => {
  const api = useProgressContext()
  const trackProps = api ? mergeProps(api.getTrackProps(), props) : props

  return (
    <ark.div {...trackProps}>
      <Slot />
    </ark.div>
  )
})
