import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSliderContext } from './use-slider-context.ts'

export interface SliderValueTextBaseProps extends PolymorphicProps<'span'> {}
export interface SliderValueTextProps extends HTMLProps<'span'>, SliderValueTextBaseProps {}

export const SliderValueText = component$<SliderValueTextProps>((props) => {
  const api = useSliderContext()
  const valueTextProps = api ? mergeProps(api.getValueTextProps(), props) : props

  return (
    <ark.span {...valueTextProps}>
      {api?.value.join(',')}
      <Slot />
    </ark.span>
  )
})
