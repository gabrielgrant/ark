import type { AreaProps } from '@zag-js/color-picker'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { ColorPickerAreaPropsProvider } from './use-color-picker-area-props-context.ts'
import { useColorPickerContext } from './use-color-picker-context.ts'

const itemPropKeys = ['xChannel', 'yChannel'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface ColorPickerAreaBaseProps extends AreaProps, PolymorphicProps<'div'> {}
export interface ColorPickerAreaProps extends HTMLProps<'div'>, ColorPickerAreaBaseProps {}

export const ColorPickerArea = component$<ColorPickerAreaProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const areaProps = {} as AreaProps
  for (const key of itemPropKeys) {
    if (key in record) (areaProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useColorPickerContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const areaElProps = api ? mergeProps(api.getAreaProps(areaProps), rest) : rest

  ColorPickerAreaPropsProvider(areaProps)

  return (
    <ark.div {...areaElProps}>
      <Slot />
    </ark.div>
  )
})
