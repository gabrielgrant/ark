import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useAngleSliderContext } from './use-angle-slider-context.ts'

export interface AngleSliderThumbBaseProps extends PolymorphicProps<'div'> {}
export interface AngleSliderThumbProps extends HTMLProps<'div'>, AngleSliderThumbBaseProps {}

export const AngleSliderThumb = component$<AngleSliderThumbProps>((props) => {
  const api = useAngleSliderContext()
  const thumbProps = api ? mergeProps(api.getThumbProps(), props) : props

  return (
    <ark.div {...thumbProps}>
      <Slot />
    </ark.div>
  )
})
