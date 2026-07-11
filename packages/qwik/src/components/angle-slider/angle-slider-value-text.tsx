import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useAngleSliderContext } from './use-angle-slider-context.ts'

export interface AngleSliderValueTextBaseProps extends PolymorphicProps<'div'> {}
export interface AngleSliderValueTextProps extends HTMLProps<'div'>, AngleSliderValueTextBaseProps {}

export const AngleSliderValueText = component$<AngleSliderValueTextProps>((props) => {
  const api = useAngleSliderContext()
  const valueTextProps = api ? mergeProps(api.getValueTextProps(), props) : props

  return (
    <ark.div {...valueTextProps}>
      {api?.valueAsDegree}
      <Slot />
    </ark.div>
  )
})
