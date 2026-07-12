import type { SwatchProps } from '@zag-js/color-picker'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$, noSerialize } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useColorPickerContext } from './use-color-picker-context.ts'
import { ColorPickerSwatchPropsProvider } from './use-color-picker-swatch-props-context.ts'

const itemPropKeys = ['respectAlpha', 'value'] as const

const ownKeySet = new Set<string>(itemPropKeys)

// Defaults to `<span>` (R11): swatches typically compose inside
// `<ColorPicker.SwatchTrigger>`/`<ColorPicker.Trigger>` buttons -- a `<div>`
// child there fails Qwik's strict SSR content-model check (Q12).
export interface ColorPickerSwatchBaseProps extends SwatchProps, PolymorphicProps<'span'> {}
export interface ColorPickerSwatchProps extends HTMLProps<'span'>, ColorPickerSwatchBaseProps {}

export const ColorPickerSwatch = component$<ColorPickerSwatchProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const swatchProps = {} as SwatchProps
  for (const key of itemPropKeys) {
    if (key in record) (swatchProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  /**
   * `value` may be a `Color` class instance (R15: prop boundary + context
   * value) -- tag it so neither this component's prop state nor the
   * swatch-props context crashes SSR serialization (Q20/Q3). Plain color
   * strings pass through untouched.
   */
  if (typeof swatchProps.value === 'object' && swatchProps.value !== null) noSerialize(swatchProps.value)

  const api = useColorPickerContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const swatchElProps = api ? mergeProps(api.getSwatchProps(swatchProps), rest) : rest

  ColorPickerSwatchPropsProvider(swatchProps)

  return (
    <ark.span {...swatchElProps}>
      <Slot />
    </ark.span>
  )
})
