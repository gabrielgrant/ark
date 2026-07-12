import type { ColorFormat } from '@zag-js/color-picker'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { colorPickerAnatomy } from './color-picker.anatomy.ts'
import { useColorPickerContext } from './use-color-picker-context.ts'
import { ColorPickerFormatPropsProvider } from './use-color-picker-format-context.ts'

const itemPropKeys = ['format'] as const

const ownKeySet = new Set<string>(itemPropKeys)

interface FormatOptions {
  format: ColorFormat
}

export interface ColorPickerViewBaseProps extends FormatOptions, PolymorphicProps<'div'> {}
export interface ColorPickerViewProps extends HTMLProps<'div'>, ColorPickerViewBaseProps {}

export const ColorPickerView = component$<ColorPickerViewProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const formatProps = { format: 'rgba' } as FormatOptions
  for (const key of itemPropKeys) {
    if (key in record) (formatProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useColorPickerContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  /**
   * Other frameworks unmount inactive views (`<Show when>`); Qwik must always
   * claim the `<Slot/>` (R11), so the inactive view is `hidden` instead.
   * `hidden` is delivered via the mergeProps SPREAD, never as an explicit JSX
   * attribute: the optimizer compiles explicit attribute expressions reading
   * the api into fine-grained signals that capture the stale noSerialize api
   * and freeze (established empirically in date-picker's View; see
   * `date-picker-view.tsx`).
   */
  const viewElProps = mergeProps(
    colorPickerAnatomy.build().view.attrs as Record<string, string>,
    { 'data-format': formatProps.format, hidden: api ? api.format !== formatProps.format : false },
    rest,
  )

  ColorPickerFormatPropsProvider(formatProps)

  return (
    <ark.div {...viewElProps}>
      <Slot />
    </ark.div>
  )
})
