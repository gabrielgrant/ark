import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSliderContext } from './use-slider-context.ts'
import { useSliderThumbPropsContext } from './use-slider-thumb-props-context.ts'

export interface SliderDraggingIndicatorBaseProps extends PolymorphicProps<'span'> {}
export interface SliderDraggingIndicatorProps extends HTMLProps<'span'>, SliderDraggingIndicatorBaseProps {}

export const SliderDraggingIndicator = component$<SliderDraggingIndicatorProps>((props) => {
  const api = useSliderContext()
  const thumbProps = useSliderThumbPropsContext()
  const indicatorProps = api ? mergeProps(api.getDraggingIndicatorProps(thumbProps), props) : props

  return (
    <ark.span {...indicatorProps}>
      {api?.getThumbValue(thumbProps.index)}
      <Slot />
    </ark.span>
  )
})
