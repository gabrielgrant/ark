import type { ColorStringFormat } from '@zag-js/color-utils'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useColorPickerContext } from './use-color-picker-context.ts'

const itemPropKeys = ['format'] as const

const ownKeySet = new Set<string>(itemPropKeys)

interface FormatProps {
  format?: ColorStringFormat
}

export interface ColorPickerValueTextBaseProps extends PolymorphicProps<'span'>, FormatProps {}
export interface ColorPickerValueTextProps extends HTMLProps<'span'>, ColorPickerValueTextBaseProps {}

export const ColorPickerValueText = component$<ColorPickerValueTextProps>((props) => {
  const record = props as unknown as Record<string, unknown>
  const format = record.format as ColorStringFormat | undefined

  const api = useColorPickerContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const valueTextProps = api ? mergeProps(api.getValueTextProps(), rest) : rest

  // Derived from the noSerialize api store -- render as a sibling next to an
  // always-claimed empty `<Slot/>`, never as its fallback (R13).
  const valueAsString = api ? (format ? api.value.toString(format) : api.valueAsString) : ''

  return (
    <ark.span {...valueTextProps}>
      {valueAsString}
      <Slot />
    </ark.span>
  )
})
