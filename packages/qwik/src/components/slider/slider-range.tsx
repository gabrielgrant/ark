import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSliderContext } from './use-slider-context.ts'

export interface SliderRangeBaseProps extends PolymorphicProps<'div'> {}
export interface SliderRangeProps extends HTMLProps<'div'>, SliderRangeBaseProps {}

export const SliderRange = component$<SliderRangeProps>((props) => {
  const api = useSliderContext()
  const rangeProps = api ? mergeProps(api.getRangeProps(), props) : props

  return (
    <ark.div {...rangeProps}>
      <Slot />
    </ark.div>
  )
})
