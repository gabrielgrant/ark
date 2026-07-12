import type { SwatchProps } from '@zag-js/color-picker'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useColorPickerContext } from './use-color-picker-context.ts'
import { ColorPickerSwatchPropsProvider } from './use-color-picker-swatch-props-context.ts'

const itemPropKeys = ['respectAlpha'] as const

const ownKeySet = new Set<string>(itemPropKeys)

interface ValueSwatchProps extends Omit<SwatchProps, 'value'> {}

// Defaults to `<span>` (R11): typically composed inside `<ColorPicker.Trigger>`.
export interface ColorPickerValueSwatchBaseProps extends ValueSwatchProps, PolymorphicProps<'span'> {}
export interface ColorPickerValueSwatchProps extends HTMLProps<'span'>, ColorPickerValueSwatchBaseProps {}

export const ColorPickerValueSwatch = component$<ColorPickerValueSwatchProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const api = useColorPickerContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  // `api.value` is already noSerialize-tagged by `useColorPickerContext()`,
  // so it is safe both in the swatch-props context and in this component's
  // own serialized state.
  const swatchProps: SwatchProps = {
    respectAlpha: record.respectAlpha as boolean | undefined,
    value: api ? api.value : '#000000',
  }

  const swatchElProps = api ? mergeProps(api.getSwatchProps(swatchProps), rest) : rest

  ColorPickerSwatchPropsProvider(swatchProps)

  return (
    <ark.span {...swatchElProps}>
      <Slot />
    </ark.span>
  )
})
