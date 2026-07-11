import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSliderContext } from './use-slider-context.ts'

export interface SliderMarkerGroupBaseProps extends PolymorphicProps<'div'> {}
export interface SliderMarkerGroupProps extends HTMLProps<'div'>, SliderMarkerGroupBaseProps {}

export const SliderMarkerGroup = component$<SliderMarkerGroupProps>((props) => {
  const api = useSliderContext()
  const markerGroupProps = api ? mergeProps(api.getMarkerGroupProps(), props) : props

  return (
    <ark.div {...markerGroupProps}>
      <Slot />
    </ark.div>
  )
})
