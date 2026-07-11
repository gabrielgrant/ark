import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSliderContext } from './use-slider-context.ts'
import { useSliderThumbPropsContext } from './use-slider-thumb-props-context.ts'

export interface SliderHiddenInputBaseProps extends PolymorphicProps<'input'> {}
export interface SliderHiddenInputProps extends HTMLProps<'input'>, SliderHiddenInputBaseProps {}

export const SliderHiddenInput = component$<SliderHiddenInputProps>((props) => {
  const api = useSliderContext()
  const thumbProps = useSliderThumbPropsContext()
  const inputProps = api ? mergeProps(api.getHiddenInputProps(thumbProps), props) : props

  return <ark.input {...inputProps} />
})
