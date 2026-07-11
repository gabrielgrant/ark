import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSliderContext } from './use-slider-context.ts'

export interface SliderControlBaseProps extends PolymorphicProps<'div'> {}
export interface SliderControlProps extends HTMLProps<'div'>, SliderControlBaseProps {}

export const SliderControl = component$<SliderControlProps>((props) => {
  const api = useSliderContext()
  const controlProps = api ? mergeProps(api.getControlProps(), props) : props

  return (
    <ark.div {...controlProps}>
      <Slot />
    </ark.div>
  )
})
