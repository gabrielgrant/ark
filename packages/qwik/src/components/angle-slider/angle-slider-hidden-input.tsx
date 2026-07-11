import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useAngleSliderContext } from './use-angle-slider-context.ts'

export interface AngleSliderHiddenInputBaseProps extends PolymorphicProps<'input'> {}
export interface AngleSliderHiddenInputProps extends HTMLProps<'input'>, AngleSliderHiddenInputBaseProps {}

export const AngleSliderHiddenInput = component$<AngleSliderHiddenInputProps>((props) => {
  const api = useAngleSliderContext()
  const inputProps = api ? mergeProps(api.getHiddenInputProps(), props) : props

  return <ark.input {...inputProps} />
})
