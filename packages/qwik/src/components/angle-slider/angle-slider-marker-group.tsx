import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useAngleSliderContext } from './use-angle-slider-context.ts'

export interface AngleSliderMarkerGroupBaseProps extends PolymorphicProps<'div'> {}
export interface AngleSliderMarkerGroupProps extends HTMLProps<'div'>, AngleSliderMarkerGroupBaseProps {}

export const AngleSliderMarkerGroup = component$<AngleSliderMarkerGroupProps>((props) => {
  const api = useAngleSliderContext()
  const markerGroupProps = api ? mergeProps(api.getMarkerGroupProps(), props) : props

  return (
    <ark.div {...markerGroupProps}>
      <Slot />
    </ark.div>
  )
})
