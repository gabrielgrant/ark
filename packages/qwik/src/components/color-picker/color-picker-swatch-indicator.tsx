import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useColorPickerContext } from './use-color-picker-context.ts'
import { useColorPickerSwatchPropsContext } from './use-color-picker-swatch-props-context.ts'

export interface ColorPickerSwatchIndicatorBaseProps extends PolymorphicProps<'span'> {}
export interface ColorPickerSwatchIndicatorProps extends HTMLProps<'span'>, ColorPickerSwatchIndicatorBaseProps {}

// Defaults to `<span>` (R11): the indicator is typically composed inside
// `<ColorPicker.SwatchTrigger>`, which renders a `<button>` -- a `<div>` child
// there fails Qwik's strict SSR content-model check (Q12).
export const ColorPickerSwatchIndicator = component$<ColorPickerSwatchIndicatorProps>((props) => {
  const api = useColorPickerContext()
  const swatchProps = useColorPickerSwatchPropsContext()
  const indicatorProps = api ? mergeProps(api.getSwatchIndicatorProps(swatchProps), props) : props

  return (
    <ark.span {...indicatorProps}>
      <Slot />
    </ark.span>
  )
})
