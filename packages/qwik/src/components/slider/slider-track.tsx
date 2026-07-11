import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSliderContext } from './use-slider-context.ts'

export interface SliderTrackBaseProps extends PolymorphicProps<'div'> {}
export interface SliderTrackProps extends HTMLProps<'div'>, SliderTrackBaseProps {}

export const SliderTrack = component$<SliderTrackProps>((props) => {
  const api = useSliderContext()
  const trackProps = api ? mergeProps(api.getTrackProps(), props) : props

  return (
    <ark.div {...trackProps}>
      <Slot />
    </ark.div>
  )
})
