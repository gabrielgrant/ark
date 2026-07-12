import type { TransparencyGridProps } from '@zag-js/color-picker'
import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useColorPickerContext } from './use-color-picker-context.ts'

const itemPropKeys = ['size'] as const

const ownKeySet = new Set<string>(itemPropKeys)

// Defaults to `<span>` (R11): often composed inside `<ColorPicker.Trigger>`.
export interface ColorPickerTransparencyGridBaseProps extends TransparencyGridProps, PolymorphicProps<'span'> {}
export interface ColorPickerTransparencyGridProps extends HTMLProps<'span'>, ColorPickerTransparencyGridBaseProps {}

export const ColorPickerTransparencyGrid = component$<ColorPickerTransparencyGridProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const gridProps = {} as TransparencyGridProps
  for (const key of itemPropKeys) {
    if (key in record) (gridProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useColorPickerContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const gridElProps = api ? mergeProps(api.getTransparencyGridProps(gridProps), rest) : rest

  return <ark.span {...gridElProps} />
})
