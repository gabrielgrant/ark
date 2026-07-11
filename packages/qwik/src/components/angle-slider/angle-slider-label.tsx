import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useAngleSliderContext } from './use-angle-slider-context.ts'

export interface AngleSliderLabelBaseProps extends PolymorphicProps<'label'> {}
export interface AngleSliderLabelProps extends HTMLProps<'label'>, AngleSliderLabelBaseProps {}

export const AngleSliderLabel = component$<AngleSliderLabelProps>((props) => {
  const api = useAngleSliderContext()
  const labelProps = api ? mergeProps(api.getLabelProps(), props) : props

  return (
    <ark.label {...labelProps}>
      <Slot />
    </ark.label>
  )
})
