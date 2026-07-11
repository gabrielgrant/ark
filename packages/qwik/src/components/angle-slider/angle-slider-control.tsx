import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useAngleSliderContext } from './use-angle-slider-context.ts'

export interface AngleSliderControlBaseProps extends PolymorphicProps<'div'> {}
export interface AngleSliderControlProps extends HTMLProps<'div'>, AngleSliderControlBaseProps {}

export const AngleSliderControl = component$<AngleSliderControlProps>((props) => {
  const api = useAngleSliderContext()
  const controlProps = api ? mergeProps(api.getControlProps(), props) : props

  return (
    <ark.div {...controlProps}>
      <Slot />
    </ark.div>
  )
})
