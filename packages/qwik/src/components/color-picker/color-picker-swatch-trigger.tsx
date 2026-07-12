import type { SwatchTriggerProps } from '@zag-js/color-picker'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$, noSerialize } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useColorPickerContext } from './use-color-picker-context.ts'

const itemPropKeys = ['value', 'disabled'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface ColorPickerSwatchTriggerBaseProps extends SwatchTriggerProps, PolymorphicProps<'button'> {}
export interface ColorPickerSwatchTriggerProps extends Assign<HTMLProps<'button'>, ColorPickerSwatchTriggerBaseProps> {}

export const ColorPickerSwatchTrigger = component$<ColorPickerSwatchTriggerProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const triggerProps = {} as SwatchTriggerProps
  for (const key of itemPropKeys) {
    if (key in record) (triggerProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  // `value` may be a `Color` class instance (R15, prop boundary).
  if (typeof triggerProps.value === 'object' && triggerProps.value !== null) noSerialize(triggerProps.value)

  const api = useColorPickerContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const triggerElProps = api ? mergeProps(api.getSwatchTriggerProps(triggerProps), rest) : rest

  return (
    <ark.button {...triggerElProps}>
      <Slot />
    </ark.button>
  )
})
